import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notesApi, categoriesApi } from '../services/api';
import type { Category } from '../types';

export default function NoteFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoriesApi.list().then(setCategories);
    if (id) {
      notesApi.get(Number(id)).then((note) => {
        setTitle(note.title);
        setContent(note.content);
        setSelectedCategoryIds(note.categories.map((c) => c.id));
      });
    }
  }, [id]);

  const toggleCategory = (catId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { title, content, categoryIds: selectedCategoryIds };

    try {
      if (isEdit) {
        await notesApi.update(Number(id), data);
      } else {
        await notesApi.create(data);
      }
      navigate('/');
    } catch {
      alert('Error saving note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>{isEdit ? 'Edit Note' : 'New Note'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>

        {categories.length > 0 && (
          <div className="form-group">
            <label>Categories</label>
            <div className="checkbox-list">
              {categories.map((cat) => (
                <label key={cat.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

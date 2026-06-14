import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notesApi } from '../services/api';
import NoteCard from '../components/NoteCard';
import type { Note } from '../types';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const loadNotes = () => {
    setLoading(true);
    const catId = categoryId ? Number(categoryId) : undefined;
    notesApi.list(false, catId)
      .then((data) => setNotes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotes();
  }, [categoryId, version]);

  const handleUpdate = () => {
    setVersion(v => v + 1);
  };

  if (loading) return <div className="empty-state"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>{categoryId ? 'Filtered Notes' : 'Active Notes'}</h2>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>{categoryId ? 'No notes in this category' : 'No active notes yet'}</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

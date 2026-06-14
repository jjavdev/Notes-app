import { useNavigate } from 'react-router-dom';
import { notesApi } from '../services/api';
import type { Note } from '../types';

interface Props {
  note: Note;
  onUpdate: () => void;
}

export default function NoteCard({ note, onUpdate }: Props) {
  const navigate = useNavigate();

  const handleArchive = async () => {
    try {
      await notesApi.toggleArchive(note.id);
    } catch {
      alert('Error archiving note');
    }
    onUpdate();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesApi.delete(note.id);
    } catch {
      alert('Error deleting note');
    }
    onUpdate();
  };

  return (
    <div className="card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>

      {note.categories.length > 0 && (
        <div className="categories" style={{ marginBottom: '0.75rem' }}>
          {note.categories.map((cat) => (
            <span key={cat.id} className="badge">{cat.name}</span>
          ))}
        </div>
      )}

      <div className="card-footer">
        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        <div className="card-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/edit/${note.id}`)}>
            Edit
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleArchive}>
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

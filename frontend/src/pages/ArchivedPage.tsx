import { useState, useEffect } from 'react';
import { notesApi } from '../services/api';
import NoteCard from '../components/NoteCard';
import type { Note } from '../types';

export default function ArchivedPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const loadNotes = () => {
    setLoading(true);
    notesApi.list(true)
      .then((data) => setNotes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotes();
  }, [version]);

  const handleUpdate = () => {
    setVersion(v => v + 1);
  };

  if (loading) return <div className="empty-state"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Archived Notes</h2>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <p>No archived notes</p>
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

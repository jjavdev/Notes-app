import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { categoriesApi } from '../services/api';
import type { Category } from '../types';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const loadCategories = () => categoriesApi.list().then(setCategories).catch(() => {});

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await categoriesApi.create(newCategory.trim());
      setNewCategory('');
    } catch {
      alert('Error creating category');
    }
    loadCategories();
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoriesApi.delete(id);
    } catch {
      alert('Error deleting category');
    }
    loadCategories();
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Notes App</h1>

        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Active Notes
          </NavLink>
          <NavLink to="/archived" className={({ isActive }) => isActive ? 'active' : ''}>
            Archived
          </NavLink>
        </nav>

        <div className="sidebar-section">
          <h3>Categories</h3>
          <div className="category-input">
            <input
              placeholder="New category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button className="btn btn-primary btn-sm" onClick={handleAddCategory}>
              +
            </button>
          </div>
          {categories.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
              <button
                onClick={() => navigate(`/?category=${cat.id}`)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left', padding: '0.125rem 0' }}
              >
                {cat.name}
              </button>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.7rem' }}
              >
                x
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/new" className="btn btn-primary" style={{ textAlign: 'center' }}>
            + New Note
          </NavLink>
          <button className="btn btn-secondary btn-sm" onClick={logout} style={{ color: '#94a3b8', background: '#334155' }}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

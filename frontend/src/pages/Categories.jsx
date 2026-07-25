import { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/categories', { name: name.trim() });
      setMessage(`Category "${res.data.name}" created`);
      setName('');
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your blog categories</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Create New Category</h2>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">
              {message}
            </div>
          )}

          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Category name"
            />
            <button
              type="submit"
              disabled={!name.trim() || creating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-sm text-slate-500">No categories yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">/{cat.slug}</p>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                  {cat.postCount} {cat.postCount === 1 ? 'post' : 'posts'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

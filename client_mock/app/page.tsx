'use client';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function ProductsMockClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceCents: 0,
    stock: 0,
    category: 'Apparel'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products?page=${page}&limit=10`);
      const data = await res.json();
      setProducts(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Product created!');
        fetchProducts();
        setFormData({ name: '', description: '', priceCents: 0, stock: 0, category: 'Apparel' });
      } else {
        const err = await res.json();
        alert(`Error: ${JSON.stringify(err)}`);
      }
    } catch (err) {
      alert(`Failed: ${err}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Product deleted!');
        fetchProducts();
      }
    } catch (err) {
      alert(`Failed: ${err}`);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginBottom: '1rem' }}>Products API - Client Mock</h1>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          This is a minimal client to test your BE API. Implement the API endpoints according to the README.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Create Product</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '0.5rem' }}>
          <input 
            className="input"
            placeholder="Name"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <textarea 
            className="input"
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
          />
          <input 
            className="input"
            type="number"
            placeholder="Price (cents)"
            value={formData.priceCents}
            onChange={e => setFormData(prev => ({ ...prev, priceCents: parseInt(e.target.value) }))}
            required
          />
          <input 
            className="input"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={e => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
            required
          />
          <select 
            className="input"
            value={formData.category}
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option>Apparel</option>
            <option>Gadgets</option>
            <option>Books</option>
            <option>Home</option>
            <option>Sports</option>
          </select>
          <button type="submit" className="btn btn-primary">Create Product</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Products List</h2>
        {loading && <p>Loading...</p>}
        {!loading && products.length === 0 && <p>No products found. Create one above!</p>}
        {!loading && products.length > 0 && (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>${(p.priceCents / 100).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>{p.category}</td>
                    <td>
                      <button className="btn" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button className="btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
              <span style={{ padding: '0.5rem' }}>Page {page} of {totalPages}</span>
              <button className="btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


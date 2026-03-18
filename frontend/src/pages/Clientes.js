import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8080/api/clientes';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: '', telefono: '', vereda: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = () => axios.get(API).then(r => setClientes(r.data));

  const guardar = () => {
    if (editId) {
      axios.put(`${API}/${editId}`, form).then(() => { cargar(); limpiar(); });
    } else {
      axios.post(API, form).then(() => { cargar(); limpiar(); });
    }
  };

  const editar = (c) => { setForm({ nombre: c.nombre, telefono: c.telefono, vereda: c.vereda }); setEditId(c.id); };
  const eliminar = (id) => { if (window.confirm('¿Eliminar cliente?')) axios.delete(`${API}/${id}`).then(cargar); };
  const limpiar = () => { setForm({ nombre: '', telefono: '', vereda: '' }); setEditId(null); };

  return (
    <div>
      <h2>Clientes</h2>

      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px', maxWidth: '400px' }}>
        <h3>{editId ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
        <input placeholder="Nombre" value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Teléfono" value={form.telefono}
          onChange={e => setForm({ ...form, telefono: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Vereda" value={form.vereda}
          onChange={e => setForm({ ...form, vereda: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <button onClick={guardar}
          style={{ background: '#0f8b8d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
          {editId ? 'Actualizar' : 'Guardar'}
        </button>
        {editId && <button onClick={limpiar} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cancelar</button>}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Teléfono</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Vereda</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Saldo Pendiente</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{c.nombre}</td>
              <td style={{ padding: '10px' }}>{c.telefono}</td>
              <td style={{ padding: '10px' }}>{c.vereda}</td>
              <td style={{ padding: '10px' }}>${c.saldoPendiente?.toFixed(2)}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => editar(c)}
                  style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                  Editar
                </button>
                <button onClick={() => eliminar(c.id)}
                  style={{ padding: '5px 10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;
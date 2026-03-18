import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_QUESO = 'http://localhost:8080/api/queso';
const API_CLIENTES = 'http://localhost:8080/api/clientes';

function Queso() {
  const [lotes, setLotes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loteActivo, setLoteActivo] = useState(null);
  const [form, setForm] = useState({
    clienteId: '', kilosRecibidos: '', precioKiloCompra: '', observaciones: ''
  });
  const [venta, setVenta] = useState({
    kilosVendidosAbrego: 0, precioKiloAbrego: 0,
    kilosVendidosOcana: 0, precioKiloOcana: 0
  });

  useEffect(() => {
    cargar();
    axios.get(API_CLIENTES).then(r => setClientes(r.data));
  }, []);

  const cargar = () => axios.get(API_QUESO).then(r => setLotes(r.data));

  const crearLote = () => {
    if (!form.kilosRecibidos || !form.precioKiloCompra)
      return alert('Ingresa los kilos y el precio de compra');
    axios.post(API_QUESO, {
      cliente: form.clienteId ? { id: form.clienteId } : null,
      kilosRecibidos: parseFloat(form.kilosRecibidos),
      precioKiloCompra: parseFloat(form.precioKiloCompra),
      observaciones: form.observaciones
    }).then(() => {
      cargar();
      setForm({ clienteId: '', kilosRecibidos: '', precioKiloCompra: '', observaciones: '' });
    });
  };

  const registrarVenta = () => {
    axios.put(`${API_QUESO}/${loteActivo.id}/vender`, {
      kilosVendidosAbrego: parseFloat(venta.kilosVendidosAbrego),
      precioKiloAbrego: parseFloat(venta.precioKiloAbrego),
      kilosVendidosOcana: parseFloat(venta.kilosVendidosOcana),
      precioKiloOcana: parseFloat(venta.precioKiloOcana)
    }).then(() => {
      cargar();
      setLoteActivo(null);
      setVenta({ kilosVendidosAbrego: 0, precioKiloAbrego: 0, kilosVendidosOcana: 0, precioKiloOcana: 0 });
    });
  };

  const totalGanancia = lotes.reduce((sum, l) => sum + (l.gananciaQueso || 0), 0);
  const totalKilos = lotes.reduce((sum, l) => sum + (l.kilosDisponibles || 0), 0);

  return (
    <div>
      <h2>Gestión de Queso</h2>

      {/* Tarjetas resumen */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: '#0f8b8d', color: 'white', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <div style={{ fontSize: '13px' }}>Kilos disponibles</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalKilos.toFixed(1)} kg</div>
        </div>
        <div style={{ background: '#2c5f2d', color: 'white', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <div style={{ fontSize: '13px' }}>Ganancia total queso</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>${totalGanancia.toLocaleString()}</div>
        </div>
      </div>

      {/* Registrar nuevo lote */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '25px', maxWidth: '500px' }}>
        <h3>Registrar Lote de Queso</h3>
        <select value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}>
          <option value="">-- Campesino que entregó (opcional) --</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.vereda}</option>)}
        </select>
        <input placeholder="Kilos recibidos" type="number" value={form.kilosRecibidos}
          onChange={e => setForm({ ...form, kilosRecibidos: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Precio por kilo de compra $" type="number" value={form.precioKiloCompra}
          onChange={e => setForm({ ...form, precioKiloCompra: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input placeholder="Observaciones (opcional)" value={form.observaciones}
          onChange={e => setForm({ ...form, observaciones: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <button onClick={crearLote}
          style={{ background: '#0f8b8d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Registrar Lote
        </button>
      </div>

      {/* Registrar ventas de un lote */}
      {loteActivo && (
        <div style={{ background: '#e8f5e8', padding: '20px', borderRadius: '8px', marginBottom: '25px', maxWidth: '500px' }}>
          <h3>Registrar Ventas — Lote #{loteActivo.id}</h3>
          <p style={{ color: '#555' }}>Kilos disponibles: <strong>{loteActivo.kilosDisponibles} kg</strong></p>

          <div style={{ marginBottom: '15px' }}>
            <strong>Ábrego</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <input placeholder="Kilos vendidos" type="number" value={venta.kilosVendidosAbrego}
                onChange={e => setVenta({ ...venta, kilosVendidosAbrego: e.target.value })}
                style={{ padding: '8px', flex: 1 }} />
              <input placeholder="Precio x kilo $" type="number" value={venta.precioKiloAbrego}
                onChange={e => setVenta({ ...venta, precioKiloAbrego: e.target.value })}
                style={{ padding: '8px', flex: 1 }} />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Ocaña</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <input placeholder="Kilos vendidos" type="number" value={venta.kilosVendidosOcana}
                onChange={e => setVenta({ ...venta, kilosVendidosOcana: e.target.value })}
                style={{ padding: '8px', flex: 1 }} />
              <input placeholder="Precio x kilo $" type="number" value={venta.precioKiloOcana}
                onChange={e => setVenta({ ...venta, precioKiloOcana: e.target.value })}
                style={{ padding: '8px', flex: 1 }} />
            </div>
          </div>

          <button onClick={registrarVenta}
            style={{ background: '#2c5f2d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
            Guardar Ventas
          </button>
          <button onClick={() => setLoteActivo(null)}
            style={{ padding: '10px 15px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      )}

      {/* Tabla de lotes */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '10px' }}>#</th>
            <th style={{ padding: '10px' }}>Fecha</th>
            <th style={{ padding: '10px' }}>Campesino</th>
            <th style={{ padding: '10px' }}>Kilos</th>
            <th style={{ padding: '10px' }}>Disponibles</th>
            <th style={{ padding: '10px' }}>Costo compra</th>
            <th style={{ padding: '10px' }}>Total ventas</th>
            <th style={{ padding: '10px' }}>Ganancia</th>
            <th style={{ padding: '10px' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {lotes.map(l => (
            <tr key={l.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
              <td style={{ padding: '10px' }}>{l.id}</td>
              <td style={{ padding: '10px' }}>{l.fecha}</td>
              <td style={{ padding: '10px' }}>{l.cliente?.nombre || '—'}</td>
              <td style={{ padding: '10px' }}>{l.kilosRecibidos} kg</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  background: l.kilosDisponibles > 0 ? '#e8f5f5' : '#f5e8e8',
                  padding: '3px 8px', borderRadius: '10px'
                }}>
                  {l.kilosDisponibles} kg
                </span>
              </td>
              <td style={{ padding: '10px' }}>${l.totalCompra?.toLocaleString()}</td>
              <td style={{ padding: '10px' }}>${l.totalVentas?.toLocaleString()}</td>
              <td style={{ padding: '10px', fontWeight: 'bold', color: l.gananciaQueso > 0 ? '#2c5f2d' : '#c0392b' }}>
                ${l.gananciaQueso?.toLocaleString()}
              </td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => setLoteActivo(l)}
                  style={{ padding: '5px 12px', background: '#0f8b8d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Vender
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Queso;
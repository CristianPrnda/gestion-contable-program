import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_PEDIDOS = 'http://localhost:8080/api/pedidos';
const API_CLIENTES = 'http://localhost:8080/api/clientes';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [detalle, setDetalle] = useState({
    producto: '', categoria: 'BASICO', cantidad: '', precioUnitario: '', porcentajeGanancia: 20, acarreo: 0
  });

  useEffect(() => {
    cargarPedidos();
    axios.get(API_CLIENTES).then(r => setClientes(r.data));
  }, []);

  const cargarPedidos = () => axios.get(API_PEDIDOS).then(r => setPedidos(r.data));

  const crearPedido = () => {
    if (!clienteId) return alert('Selecciona un cliente');
    axios.post(API_PEDIDOS, {
      cliente: { id: clienteId },
      observaciones
    }).then(r => {
      setPedidoActivo(r.data);
      cargarPedidos();
      setObservaciones('');
    });
  };

  const cargarDetalles = (pedido) => {
    setPedidoActivo(pedido);
    axios.get(`${API_PEDIDOS}/${pedido.id}/detalles`).then(r => setDetalles(r.data));
  };

  const agregarDetalle = () => {
    if (!detalle.producto || !detalle.cantidad || !detalle.precioUnitario)
      return alert('Completa todos los campos del producto');
    axios.post(`${API_PEDIDOS}/${pedidoActivo.id}/detalles`, detalle).then(() => {
      cargarDetalles(pedidoActivo);
      cargarPedidos();
      setDetalle({ producto: '', categoria: 'BASICO', cantidad: '', precioUnitario: '', porcentajeGanancia: 20, acarreo: 0 });
    });
  };

  const cambiarEstado = (id, estado) => {
    axios.put(`${API_PEDIDOS}/${id}/estado?estado=${estado}`).then(cargarPedidos);
  };

  const estadoColor = (estado) => {
    if (estado === 'PENDIENTE') return '#e8c547';
    if (estado === 'ENTREGADO') return '#0f8b8d';
    if (estado === 'PAGADO') return '#2c5f2d';
    return '#ccc';
  };

  return (
    <div>
      <h2>Pedidos</h2>

      {/* Crear nuevo pedido */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px', maxWidth: '500px' }}>
        <h3>Nuevo Pedido</h3>
        <select value={clienteId} onChange={e => setClienteId(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}>
          <option value="">-- Seleccionar cliente --</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.vereda}</option>)}
        </select>
        <input placeholder="Observaciones (opcional)" value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }} />
        <button onClick={crearPedido}
          style={{ background: '#1a1a2e', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Crear Pedido
        </button>
      </div>

      {/* Agregar productos al pedido activo */}
      {pedidoActivo && (
        <div style={{ background: '#e8f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Agregar productos — Pedido #{pedidoActivo.id} ({pedidoActivo.cliente?.nombre})</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <input placeholder="Producto" value={detalle.producto}
              onChange={e => setDetalle({ ...detalle, producto: e.target.value })}
              style={{ padding: '8px', flex: 1 }} />
            <select value={detalle.categoria}
              onChange={e => setDetalle({ ...detalle, categoria: e.target.value })}
              style={{ padding: '8px' }}>
              <option value="BASICO">Básico (hogar)</option>
              <option value="GANADERO">Ganadero</option>
            </select>
            <input placeholder="Cantidad" type="number" value={detalle.cantidad}
              onChange={e => setDetalle({ ...detalle, cantidad: e.target.value })}
              style={{ padding: '8px', width: '90px' }} />
            <input placeholder="Precio unitario" type="number" value={detalle.precioUnitario}
              onChange={e => setDetalle({ ...detalle, precioUnitario: e.target.value })}
              style={{ padding: '8px', width: '130px' }} />
            <input placeholder="% Ganancia" type="number" value={detalle.porcentajeGanancia}
              onChange={e => setDetalle({ ...detalle, porcentajeGanancia: e.target.value })}
              style={{ padding: '8px', width: '100px' }} />
            <input placeholder="Acarreo $" type="number" value={detalle.acarreo}
              onChange={e => setDetalle({ ...detalle, acarreo: e.target.value })}
              style={{ padding: '8px', width: '100px' }} />
          </div>
          <button onClick={agregarDetalle}
            style={{ background: '#0f8b8d', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Agregar Producto
          </button>

          {/* Detalles del pedido activo */}
          {detalles.length > 0 && (
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a2e', color: 'white' }}>
                  <th style={{ padding: '8px' }}>Producto</th>
                  <th style={{ padding: '8px' }}>Categoría</th>
                  <th style={{ padding: '8px' }}>Cantidad</th>
                  <th style={{ padding: '8px' }}>P. Unitario</th>
                  <th style={{ padding: '8px' }}>% Ganancia</th>
                  <th style={{ padding: '8px' }}>Acarreo</th>
                  <th style={{ padding: '8px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map(d => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    <td style={{ padding: '8px' }}>{d.producto}</td>
                    <td style={{ padding: '8px' }}>{d.categoria}</td>
                    <td style={{ padding: '8px' }}>{d.cantidad}</td>
                    <td style={{ padding: '8px' }}>${d.precioUnitario?.toFixed(0)}</td>
                    <td style={{ padding: '8px' }}>{d.porcentajeGanancia}%</td>
                    <td style={{ padding: '8px' }}>${d.acarreo?.toFixed(0)}</td>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>${d.subtotal?.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={() => setPedidoActivo(null)}
            style={{ marginTop: '10px', padding: '8px 15px', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      )}

      {/* Lista de pedidos */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '10px' }}>#</th>
            <th style={{ padding: '10px' }}>Cliente</th>
            <th style={{ padding: '10px' }}>Fecha</th>
            <th style={{ padding: '10px' }}>Total</th>
            <th style={{ padding: '10px' }}>Estado</th>
            <th style={{ padding: '10px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
              <td style={{ padding: '10px' }}>{p.id}</td>
              <td style={{ padding: '10px' }}>{p.cliente?.nombre}</td>
              <td style={{ padding: '10px' }}>{p.fecha}</td>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>${p.totalPedido?.toFixed(0)}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ background: estadoColor(p.estado), padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  {p.estado}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => cargarDetalles(p)}
                  style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>
                  Ver/Agregar
                </button>
                <select onChange={e => cambiarEstado(p.id, e.target.value)} defaultValue=""
                  style={{ padding: '5px', cursor: 'pointer' }}>
                  <option value="" disabled>Estado</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="ENTREGADO">Entregado</option>
                  <option value="PAGADO">Pagado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pedidos;
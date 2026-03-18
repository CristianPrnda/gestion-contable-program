package com.gestioncontable.backend.controller;

import com.gestioncontable.backend.model.*;
import com.gestioncontable.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final DetallePedidoRepository detalleRepository;
    private final ClienteRepository clienteRepository;

    @GetMapping
    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Pedido> porCliente(@PathVariable Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    @GetMapping("/{id}/detalles")
    public List<DetallePedido> detalles(@PathVariable Long id) {
        return detalleRepository.findByPedidoId(id);
    }

    @PostMapping
    public Pedido crear(@RequestBody Pedido pedido) {
        pedido.setFecha(LocalDate.now());
        pedido.setEstado("PENDIENTE");
        return pedidoRepository.save(pedido);
    }

    @PostMapping("/{pedidoId}/detalles")
    public DetallePedido agregarDetalle(@PathVariable Long pedidoId,
                                        @RequestBody DetallePedido detalle) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow();
        detalle.setPedido(pedido);

        // Calcular subtotal con ganancia
        double subtotal = detalle.getCantidad() * detalle.getPrecioUnitario();
        double ganancia = subtotal * (detalle.getPorcentajeGanancia() / 100);
        detalle.setSubtotal(subtotal + ganancia);

        DetallePedido guardado = detalleRepository.save(detalle);

        // Actualizar total del pedido
        List<DetallePedido> detalles = detalleRepository.findByPedidoId(pedidoId);
        double totalProductos = detalles.stream().mapToDouble(DetallePedido::getSubtotal).sum();
        double totalAcarreo = detalles.stream().mapToDouble(DetallePedido::getAcarreo).sum();
        pedido.setTotalProductos(totalProductos);
        pedido.setTotalAcarreo(totalAcarreo);
        pedido.setTotalPedido(totalProductos + totalAcarreo);
        pedidoRepository.save(pedido);

        return guardado;
    }

    @PutMapping("/{id}/estado")
    public Pedido cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        Pedido pedido = pedidoRepository.findById(id).orElseThrow();
        pedido.setEstado(estado);

        // Si se marca como PAGADO, actualizar saldo del cliente
        if (estado.equals("PAGADO")) {
            Cliente cliente = pedido.getCliente();
            cliente.setSaldoPendiente(
                cliente.getSaldoPendiente() - pedido.getTotalPedido()
            );
            clienteRepository.save(cliente);
        }

        return pedidoRepository.save(pedido);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        pedidoRepository.deleteById(id);
    }
}
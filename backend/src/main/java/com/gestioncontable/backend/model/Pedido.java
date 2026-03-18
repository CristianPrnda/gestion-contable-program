package com.gestioncontable.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    private LocalDate fecha;

    private String estado; // PENDIENTE, ENTREGADO, PAGADO

    private Double totalProductos = 0.0;

    private Double totalAcarreo = 0.0;

    private Double totalPedido = 0.0;

    private String observaciones;
}
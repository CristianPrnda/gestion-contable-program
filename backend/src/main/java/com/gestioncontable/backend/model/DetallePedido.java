package com.gestioncontable.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "detalle_pedidos")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    private String producto;

    private String categoria; // BASICO o GANADERO

    private Double cantidad;

    private Double precioUnitario;

    private Double subtotal;

    private Double porcentajeGanancia = 20.0;

    private Double acarreo = 0.0;
}
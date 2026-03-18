package com.gestioncontable.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "lotes_queso")
public class LoteQueso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente; // campesino que entregó el queso

    private Double kilosRecibidos = 0.0;

    private Double precioKiloCompra = 0.0; // precio al que se recibió

    private Double kilosVendidosAbrego = 0.0;

    private Double precioKiloAbrego = 0.0;

    private Double kilosVendidosOcana = 0.0;

    private Double precioKiloOcana = 0.0;

    private Double kilosDisponibles = 0.0;

    private Double totalCompra = 0.0; // lo que costó el queso

    private Double totalVentas = 0.0; // lo que se recibió por ventas

    private Double gananciaQueso = 0.0;

    private String observaciones;
}
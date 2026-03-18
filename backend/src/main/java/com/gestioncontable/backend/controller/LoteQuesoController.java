package com.gestioncontable.backend.controller;

import com.gestioncontable.backend.model.LoteQueso;
import com.gestioncontable.backend.repository.LoteQuesoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/queso")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class LoteQuesoController {

    private final LoteQuesoRepository loteQuesoRepository;

    @GetMapping
    public List<LoteQueso> listar() {
        return loteQuesoRepository.findAll();
    }

    @PostMapping
    public LoteQueso crear(@RequestBody LoteQueso lote) {
        lote.setFecha(LocalDate.now());
        lote.setKilosDisponibles(lote.getKilosRecibidos());
        lote.setTotalCompra(lote.getKilosRecibidos() * lote.getPrecioKiloCompra());
        lote.setTotalVentas(0.0);
        lote.setGananciaQueso(0.0);
        return loteQuesoRepository.save(lote);
    }

    @PutMapping("/{id}/vender")
    public LoteQueso registrarVenta(@PathVariable Long id, @RequestBody LoteQueso datos) {
        LoteQueso lote = loteQuesoRepository.findById(id).orElseThrow();

        lote.setKilosVendidosAbrego(datos.getKilosVendidosAbrego());
        lote.setPrecioKiloAbrego(datos.getPrecioKiloAbrego());
        lote.setKilosVendidosOcana(datos.getKilosVendidosOcana());
        lote.setPrecioKiloOcana(datos.getPrecioKiloOcana());

        // Calcular kilos disponibles
        double vendidos = datos.getKilosVendidosAbrego() + datos.getKilosVendidosOcana();
        lote.setKilosDisponibles(lote.getKilosRecibidos() - vendidos);

        // Calcular totales
        double ventasAbrego = datos.getKilosVendidosAbrego() * datos.getPrecioKiloAbrego();
        double ventasOcana = datos.getKilosVendidosOcana() * datos.getPrecioKiloOcana();
        lote.setTotalVentas(ventasAbrego + ventasOcana);
        lote.setGananciaQueso(lote.getTotalVentas() - lote.getTotalCompra());

        return loteQuesoRepository.save(lote);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        loteQuesoRepository.deleteById(id);
    }
}
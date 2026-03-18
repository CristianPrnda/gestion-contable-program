package com.gestioncontable.backend.repository;

import com.gestioncontable.backend.model.LoteQueso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoteQuesoRepository extends JpaRepository<LoteQueso, Long> {
    List<LoteQueso> findByClienteId(Long clienteId);
}
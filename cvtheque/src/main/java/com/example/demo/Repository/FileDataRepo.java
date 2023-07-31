package com.example.demo.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.domain.FileData;

public interface FileDataRepo extends JpaRepository<FileData,Long> {
    Optional<FileData> findByName(String fileName);
}

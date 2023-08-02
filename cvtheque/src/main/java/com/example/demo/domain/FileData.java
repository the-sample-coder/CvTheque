package com.example.demo.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.example.demo.domain.enums.Contrat;
import com.example.demo.domain.enums.Disponibilite;
import com.example.demo.domain.enums.NiveauEtude;
import com.example.demo.domain.enums.ProfilCandidat;
import com.example.demo.domain.enums.Source;

@Entity
@Table(name = "file_data")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String filePath;

    private LocalDateTime creationDate;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Contrat contrat;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Source source;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private NiveauEtude niveau;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Disponibilite disponibilite;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private ProfilCandidat profil;

    public String getName(){
        return this.name;
    }

    public String getType(){
        return this.type;
    }

}

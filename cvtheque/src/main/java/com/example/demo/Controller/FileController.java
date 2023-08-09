package com.example.demo.Controller;

import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.domain.FileData;
import com.example.demo.domain.GoogleDriveManager;
import com.example.demo.domain.enums.Contrat;
import com.example.demo.domain.enums.Disponibilite;
import com.example.demo.domain.enums.NiveauEtude;
import com.example.demo.domain.enums.ProfilCandidat;
import com.example.demo.domain.enums.Source;
import com.example.demo.service.DriveService;
import com.example.demo.service.FileService;
import com.google.api.services.drive.model.FileList;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileService fileStorageService;

    @Autowired
    private DriveService driveService;

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxUploadSizeException(MaxUploadSizeExceededException e) {
        return ResponseEntity.status(413).body("File size exceeds the allowed limit.");
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "contrat", required = false) String contratStr,
            @RequestParam(value = "source", required = false) String sourceStr,
            @RequestParam(value = "niveau", required = false) String niveauStr,
            @RequestParam(value = "disponibilite", required = false) String disponibiliteStr,
            @RequestParam(value = "profil", required = false) String profilStr) throws Exception {
        System.out.println("Received upload request.");

        // Convert the nullable fields from String to the corresponding enumeration
        // types
        Contrat contrat = contratStr != null ? Contrat.valueOf(contratStr) : null;
        Source source = sourceStr != null ? Source.valueOf(sourceStr) : null;
        NiveauEtude niveau = niveauStr != null ? NiveauEtude.valueOf(niveauStr) : null;
        Disponibilite disponibilite = disponibiliteStr != null ? Disponibilite.valueOf(disponibiliteStr) : null;
        ProfilCandidat profil = profilStr != null ? ProfilCandidat.valueOf(profilStr) : null;

        String response = fileStorageService.storeFile(file, contrat, source, niveau, disponibilite, profil);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileId) throws IOException, GeneralSecurityException {
        FileData fileData = fileStorageService.getFileById(fileId);
        String filename = fileData.getName();

        com.google.api.services.drive.model.File existedFile = driveService.findFileByName(filename);

        if (existedFile != null) {
            // File file = new File(fileData.getFilePath());
            // byte[] fileContent = fileStorageService.getFileContent(file);
            byte[] fileContent = driveService.getFileStream(existedFile);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDispositionFormData("attachment", fileData.getName());
            headers.setContentType(MediaType.valueOf(fileData.getType()));
            // headers.set("Content-Disposition", "attachment; filename=" +
            // fileData.getName());
            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<FileData>> getAllFiles() {
        List<FileData> files = fileStorageService.getAllFiles();
        return ResponseEntity.ok(files);
    }

    @DeleteMapping("/delete/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable Long fileId) throws Exception {

        FileData fileData = fileStorageService.getFileById(fileId);
        String filename = fileData.getName();
        String file_drive_id = driveService.findFileByName(filename).getId();
        if(file_drive_id == null) {
            return ResponseEntity.notFound().build();
        }else{
            driveService.deleteFile(file_drive_id);
            fileStorageService.deleteFile(fileId);
            return ResponseEntity.ok("File deleted successfully");
        }
    }
}

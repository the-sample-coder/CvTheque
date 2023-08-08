package com.example.demo.service;

import java.io.ByteArrayInputStream;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import com.example.demo.domain.FileData;
import com.example.demo.domain.enums.Contrat;
import com.example.demo.domain.enums.Disponibilite;
import com.example.demo.domain.enums.NiveauEtude;
import com.example.demo.domain.enums.ProfilCandidat;
import com.example.demo.domain.enums.Source;
import com.example.demo.Repository.FileDataRepo;
import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.example.demo.service.DriveService;
import com.example.demo.domain.GoogleDriveManager;

@Service
public class FileService {

    @Autowired
    private FileDataRepo fileDataRepository;

    @Autowired
    private DriveService driveService;

    // private final String FOLDER_PATH = System.getProperty("user.home") + File.separator + "Desktop" + File.separator + "File" + File.separator;
    // private final String FOLDER_PATH = System.getProperty("user.home") + File.separator + "Files" + File.separator;
    private final long MAX_FILE_SIZE_BYTES = 10485759; // 10MB  

    public String storeFile(MultipartFile file, Contrat contrat, Source source, NiveauEtude niveau, Disponibilite disponibilite, ProfilCandidat profil) throws Exception {
        String response = new String();

        GoogleDriveManager googleDriveManager = new GoogleDriveManager();

        // this conditions does not work we deal with it in the controller
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            response=  "File size exceeds the allowed limit.";
            return response;
        }

        // Check file extension
        String fileExtension = getFileExtension(file.getOriginalFilename());
        if (!isValidFileExtension(fileExtension)) {
            return "Invalid file extension. Only Word and PDF files are allowed.";
        }

        String filewithoutextension = StringUtils.stripFilenameExtension(file.getOriginalFilename() );
        String newuuid = UUID.randomUUID().toString();
        String fileName = filewithoutextension + '_' + newuuid + '.' + fileExtension;

        String fileType = file.getContentType();
        // String filePath = FOLDER_PATH + fileName;
        String filePath = "Cvtheque/";
        String folderId = driveService.getFolderId("Cvtheque/");

        LocalDateTime creationDate = LocalDateTime.now();
        FileData fileDataEntity = new FileData(null, fileName, fileType, filePath, creationDate, contrat, source, niveau, disponibilite, profil);

        try (InputStream inputStream = file.getInputStream()) {
            // Path targetLocation = Paths.get(filePath);
            // Files.createDirectories(targetLocation.getParent());
            // Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            File fileMetadata = new File();
            fileMetadata.setName(fileName);
            fileMetadata.setParents(Collections.singletonList(folderId));

            File uploadFile = googleDriveManager.getInstance().files().create(fileMetadata, new InputStreamContent(fileType, new ByteArrayInputStream(file.getBytes()))).setFields("id").execute();
        } catch (IOException e) {
            // throw new IOException("Failed to store the file: " + fileName, e);
            response = ("Failed to store the file: " + fileName);
            return response;
        }
        fileDataRepository.save(fileDataEntity);
        response= "File uploaded successfully with ID: " + fileDataEntity.getId();
        return response;
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1).toLowerCase();
    }

    private boolean isValidFileExtension(String fileExtension) {
        return fileExtension.equals("docx") || fileExtension.equals("pdf");
    }

    public FileData getFileById(Long fileId) {
        return fileDataRepository.findById(fileId).orElse(null);
    }

    public byte[] getFileContent(java.io.File file) throws IOException {
        try (FileInputStream fis = new FileInputStream(file)) {
            return fis.readAllBytes();
        }
    }

    public List<FileData> getAllFiles() {
        return fileDataRepository.findAll();
    }
}

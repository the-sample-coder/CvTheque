package com.example.demo.service;


import java.io.File;
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
import java.util.List;
import java.util.UUID;

import com.example.demo.domain.FileData;
import com.example.demo.Repository.FileDataRepo;

@Service
public class FileService {

    @Autowired
    private FileDataRepo fileDataRepository;

    

    // private final String FOLDER_PATH = System.getProperty("user.home") + File.separator + "Desktop" + File.separator + "File" + File.separator;
    private final String FOLDER_PATH = System.getProperty("user.home") + File.separator + "Files" + File.separator;
    private final long MAX_FILE_SIZE_BYTES = 10485759; // 10MB  y

    public String storeFile(MultipartFile file) throws IOException {
        String response = new String();

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
        String filePath = FOLDER_PATH + fileName;
        LocalDateTime creationDate = LocalDateTime.now();

        FileData fileDataEntity = new FileData(null, fileName, fileType, filePath, creationDate);

        try (InputStream inputStream = file.getInputStream()) {
            Path targetLocation = Paths.get(filePath);
            Files.createDirectories(targetLocation.getParent());
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            // throw new IOException("Failed to store the file: " + fileName, e);
            response = ("Failed to store the file: " + fileName);
            return response;
        }
        response= "File uploaded successfully with ID: " + fileDataEntity.getId();
        fileDataRepository.save(fileDataEntity);
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

    public byte[] getFileContent(File file) throws IOException {
        try (FileInputStream fis = new FileInputStream(file)) {
            return fis.readAllBytes();
        }
    }

    public List<FileData> getAllFiles() {
        return fileDataRepository.findAll();
    }
}

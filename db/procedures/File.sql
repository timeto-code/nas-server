-- 新建文件时，更新Folder表中的filesCount和totalFiles字段
DELIMITER //
CREATE PROCEDURE InsertFile(IN rootFolderId VARCHAR(255), IN folderId VARCHAR(255))
BEGIN
    UPDATE Folder SET filesCount = filesCount + 1 WHERE id COLLATE utf8mb4_unicode_ci = folderId COLLATE utf8mb4_unicode_ci;

    
    IF rootFolderId IS NOT NULL THEN
        UPDATE Folder SET totalFiles = totalFiles + 1 WHERE id COLLATE utf8mb4_unicode_ci = rootFolderId COLLATE utf8mb4_unicode_ci;
    END IF;
END //
DELIMITER ;

-- 删除文件时，更新Folder表中的filesCount和totalFiles字段
DELIMITER //
CREATE PROCEDURE DeleteFile(IN rootFolderId VARCHAR(255), IN folderId VARCHAR(255))
BEGIN
    UPDATE Folder SET filesCount = filesCount - 1 WHERE id COLLATE utf8mb4_unicode_ci = folderId COLLATE utf8mb4_unicode_ci;

    
    IF rootFolderId IS NOT NULL THEN
        UPDATE Folder SET totalFiles = totalFiles - 1 WHERE id COLLATE utf8mb4_unicode_ci = rootFolderId COLLATE utf8mb4_unicode_ci;
    END IF;
END //
DELIMITER ;
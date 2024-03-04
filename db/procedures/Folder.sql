-- 新建文件夹时，更新父文件夹的subFolderCount，并且更新根文件夹的totalFolders
DELIMITER //
CREATE PROCEDURE InsertFolder(IN rootFolderId VARCHAR(255), IN parentId VARCHAR(255))
BEGIN
    IF parentId IS NOT NULL THEN
        UPDATE Folder SET subFoldersCount = subFoldersCount + 1 WHERE id COLLATE utf8mb4_unicode_ci = parentId COLLATE utf8mb4_unicode_ci;
    END IF;

    IF rootFolderId IS NOT NULL THEN
        UPDATE Folder SET totalFolders = totalFolders + 1 WHERE id COLLATE utf8mb4_unicode_ci = rootFolderId COLLATE utf8mb4_unicode_ci;
    END IF;
END //
DELIMITER ;

-- 删除文件夹时，更新父文件夹的subFolderCount，并且更新根文件夹的totalFolders
DELIMITER //
CREATE PROCEDURE DeleteFolder(IN rootFolderId VARCHAR(255), IN parentId VARCHAR(255))
BEGIN
    IF parentId IS NOT NULL THEN
        UPDATE Folder SET subFoldersCount = subFoldersCount - 1 WHERE id COLLATE utf8mb4_unicode_ci = parentId COLLATE utf8mb4_unicode_ci;
    END IF;

    IF rootFolderId IS NOT NULL THEN
        UPDATE Folder SET totalFolders = totalFolders - 1 WHERE id COLLATE utf8mb4_unicode_ci = rootFolderId COLLATE utf8mb4_unicode_ci;
    END IF;
END //
DELIMITER ;

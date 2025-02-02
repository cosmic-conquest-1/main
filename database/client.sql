CREATE TABLE client(
    Id INT AUTO_INCREMENT PRIMARY KEY,
	Username varchar(30),
    Password varchar(255),
    Email varchar(255),
    IP varchar(255),
    Rating INT,
    Session_Id VARCHAR(255),
    Online_Status ENUM('online', 'offline', 'busy', 'away') DEFAULT 'offline'
);
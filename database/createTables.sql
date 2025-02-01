CREATE TABLE client(
	Username varchar(30),
    Password varchar(255),
    Email varchar(50),
    IP varchar(255),
    Rating INT,
    Session_Id VARCHAR(255),
    Online_Status ENUM('online', 'offline', 'busy', 'away') DEFAULT 'offline'
);

CREATE TABLE power_symbol (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL
);

CREATE TABLE card (
    Id INT AUTO_INCREMENT PRIMARY KEY,  
    Value INT NOT NULL,  
    Credit DECIMAL(10, 2) NOT NULL,  
    Type ENUM('number', 'power') NOT NULL,  
    Power_symbol_id INT,  
    FOREIGN KEY (Power_symbol_id) REFERENCES power_symbol(Id)
);
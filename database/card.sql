CREATE TABLE card (
    Id INT AUTO_INCREMENT PRIMARY KEY,  
    Value varchar(255),  
    Credit DECIMAL(10, 0) NOT NULL CHECK (
        (Credit >= 1 AND Credit <= 10) OR Credit IN (20,25)
    ), 
    Type ENUM('number', 'power') NOT NULL,  
    Power_symbol_id INT,  
    Action varchar(2000),
    FOREIGN KEY (Power_symbol_id) REFERENCES power_symbol(Id)
);
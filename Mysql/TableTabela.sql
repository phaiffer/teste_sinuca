CREATE TABLE `tabela`(
id INT NOT NULL AUTO_INCREMENT,
timeId INT,
PRIMARY KEY (id),
FOREIGN KEY (timeId) REFERENCES `time`(id)
);
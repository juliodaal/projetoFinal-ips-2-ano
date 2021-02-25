drop database if exists projecto;
create database projecto; 
use projecto;

create table tipo_utilizador(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    tipo VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id));
    
insert into tipo_utilizador (tipo) values ("client");
insert into tipo_utilizador (tipo) values ("worker");
insert into tipo_utilizador (tipo) values ("administrator");

create table utilizador(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    nome VARCHAR(50) NOT NULL,
    apelido VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    pwd VARCHAR(50) NOT NULL,
    company VARCHAR(50) NULL,
    tipo_from_tipo_utilizador INT,
    PRIMARY KEY (id));

insert into utilizador (nome,apelido,email,pwd,tipo_from_tipo_utilizador) values ("Daniel Admin", "Admin","admin@gmail.com","asd123",3);

create table tipo_box(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    id_utilizador_form_utilizador INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    total_reciclado INT,
    PRIMARY KEY (id,id_utilizador_form_utilizador,tipo)); 

create table box(
	id INT NOT NULL auto_increment,
    id_utilizador_form_utilizador INT NOT NULL,
	tipo_from_tipo_box INT NOT NULL,
    quantidade_atual INT,
    total_reciclado INT,
    aviso TINYINT(1),
    PRIMARY KEY (id));

create table box_ganhos(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    id_box INT NOT NULL,
    total_esvaziado INT NOT NULL,
    peso DOUBLE NOT NULL,
	data date NOT NULL,
    PRIMARY KEY (id));
    
create table trabalhos(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
	id_utilizador INT NOT NULL,
	id_box INT NOT NULL,
	PRIMARY KEY (id));

create table historico_cliente(
	id int not null auto_increment unique,
    id_utilizador_from_utilizador int not null,
    id_box_from_box int not null,
    data date not null,
    primary key(id));
    
create table historico_trabalhador(
	id int not null auto_increment unique,
    id_utilizador_from_utilizador int not null,
    id_box_from_box int not null,
    data date not null,
    primary key(id));
    select * from box where id = 1;

create table historico_box(
	id int not null auto_increment unique,
    id_box_from_box int not null,
    quantidade_atual int not null,
    data date not null,
    primary key(id));

create table inqueritos(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id));

create table supportTickets(
	id int not null auto_increment unique,
	id_utilizador_from_utilizador int not null,
    id_worker_from_cometchat varchar(50) not null,
    primary key(id));

ALTER TABLE utilizador ADD CONSTRAINT tipo_utilizador
FOREIGN KEY (tipo_from_tipo_utilizador) REFERENCES tipo_utilizador(id)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE tipo_box  ADD CONSTRAINT tipo_box_utilizador
FOREIGN KEY (id_utilizador_form_utilizador) REFERENCES utilizador(id)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE box ADD CONSTRAINT tipo_box
FOREIGN KEY (tipo_from_tipo_box) REFERENCES tipo_box(id)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE box ADD CONSTRAINT box_utilizador
FOREIGN KEY (id_utilizador_form_utilizador) REFERENCES utilizador(id)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE box_ganhos ADD CONSTRAINT box
FOREIGN KEY (id_box) REFERENCES box(id)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE trabalhos ADD CONSTRAINT utilizador
FOREIGN KEY (id_utilizador) REFERENCES utilizador(id)
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE trabalhos ADD CONSTRAINT box_trabalho
FOREIGN KEY (id_box) REFERENCES box(id)
ON UPDATE NO ACTION ON DELETE NO ACTION;
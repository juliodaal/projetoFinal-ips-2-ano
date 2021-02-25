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
-- select * from tipo_utilizador;

create table utilizador(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    nome VARCHAR(50) NOT NULL,
    apelido VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    pwd VARCHAR(50) NOT NULL,
    company VARCHAR(50) NULL,
    tipo_from_tipo_utilizador INT,
    PRIMARY KEY (id));

insert into utilizador (nome,apelido,email,pwd,company,tipo_from_tipo_utilizador) values ("Julio Cesar", "Daal De Sousa","juliocesar.daal@gmail.com","asd123","Instituto Politécnico de Setúbal",1);
insert into utilizador (nome,apelido,email,pwd,tipo_from_tipo_utilizador) values ("Robert Worker", "Worker","worker@gmail.com","asd123",2);
insert into utilizador (nome,apelido,email,pwd,tipo_from_tipo_utilizador) values ("Daniel Admin", "Admin","admin@gmail.com","asd123",3);
-- select id,nome,apelido,email,company from utilizador where id = 2 and tipo_from_tipo_utilizador = 1;
-- update utilizador set nome = ?, apelido = ?, email = ?, company = ? where id = ?;
-- delete from box where id_utilizador_form_utilizador = 1;
-- delete from tipo_box where id_utilizador_form_utilizador = 1;
-- delete from utilizador where id = 1;
-- delete from utilizador where id = 1 and tipo_from_tipo_utilizador = 1;
-- delete from tipo_box where tipo = "tampas" and id_utilizador_form_utilizador = 1;

create table tipo_box(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    id_utilizador_form_utilizador INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    total_reciclado INT,
    PRIMARY KEY (id,id_utilizador_form_utilizador,tipo)); 
-- select id from tipo_box where tipo ="tampas" and id_utilizador_form_utilizador = 1;
insert into tipo_box (id_utilizador_form_utilizador,tipo,total_reciclado) values (1,"tampas",0);
insert into tipo_box (id_utilizador_form_utilizador,tipo,total_reciclado) values (1,"Rolhas",10);
-- select id from tipo_box where id_utilizador_form_utilizador = 1 and tipo = "tampas";
-- delete from box where tipo_from_tipo_box = 1 and id_utilizador_form_utilizador = 1;
create table box(
	id INT NOT NULL auto_increment,
    id_utilizador_form_utilizador INT NOT NULL,
	tipo_from_tipo_box INT NOT NULL,
    quantidade_atual INT,
    total_reciclado INT,
    aviso TINYINT(1),
    PRIMARY KEY (id));
insert into box (id_utilizador_form_utilizador,tipo_from_tipo_box,quantidade_atual,total_reciclado,aviso) values (1,1,0,0,0);
insert into box (id_utilizador_form_utilizador,tipo_from_tipo_box,quantidade_atual,total_reciclado,aviso) values (1,2,25,13,0);

-- select b.id,tb.tipo,b.quantidade_atual,b.aviso,b.total_reciclado from utilizador u join box b on u.id=b.id_utilizador_form_utilizador join tipo_box tb on b.tipo_from_tipo_box=tb.id where u.tipo_from_tipo_utilizador = 1 and u.id = 3 order by id;

-- select b.id,tb.tipo,b.quantidade_atual,b.aviso,b.total_reciclado from utilizador u join box b on u.id=b.id_utilizador_form_utilizador join tipo_box tb on b.tipo_from_tipo_box=tb.id where u.tipo_from_tipo_utilizador = 1 and u.id = 1 order by id;
create table box_ganhos(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    id_box INT NOT NULL,
    total_esvaziado INT NOT NULL,
    peso DOUBLE NOT NULL,
	data date NOT NULL,
    PRIMARY KEY (id));
    
-- insert into box_ganhos (id_box,total_esvaziado,peso,data) values (1,123,32,STR_TO_DATE("2021-02-07",'%Y-%m-%d'));

create table trabalhos(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
	id_utilizador INT NOT NULL,
	id_box INT NOT NULL,
	PRIMARY KEY (id));

-- select b.id,tb.tipo,b.quantidade_atual,b.aviso,b.total_reciclado from utilizador u join box b on u.id=b.id_utilizador_form_utilizador join tipo_box tb on b.tipo_from_tipo_box=tb.id where b.id = 2;

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
-- insert into historico_cliente (id_utilizador_from_utilizador,id_box_from_box,data) values (1,1,STR_TO_DATE("2021-02-03",'%Y-%m-%d'));

-- insert into historico_trabalhador (id_utilizador_from_utilizador,id_box_from_box,data) values (2,3,STR_TO_DATE("2021-03-03",'%Y-%m-%d'));
-- select id, data from historico_trabalhador where id_utilizador_from_utilizador = 2;
-- delete from utilizador where id = 2;

-- delete from box where tipo_from_tipo_box = 1 and id_utilizador_form_utilizador = 1;

create table historico_box(
	id int not null auto_increment unique,
    id_box_from_box int not null,
    quantidade_atual int not null,
    data date not null,
    primary key(id));
    
insert into historico_box (id_box_from_box,quantidade_atual,data) values (1,13,STR_TO_DATE("2021-03-03",'%Y-%m-%d'));
select sum(quantidade_atual),data from historico_box where id_box_from_box = 8 group by data;

create table inqueritos(
	id INT NOT NULL AUTO_INCREMENT UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(50) NOT NULL,
    PRIMARY KEY (id));
    -- Enviar msg a un dominio (Email)


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
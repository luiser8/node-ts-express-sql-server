CREATE DATABASE ntsexpress;
USE ntsexpress;

CREATE TABLE clients(
	id INT IDENTITY(1,1) NOT NULL,
	first_name NVARCHAR(100) NOT NULL,
	last_name NVARCHAR(100) NOT NULL,
	creation_date DATETIME NOT NULL CONSTRAINT df_client_creation_date DEFAULT(GETDATE()),
	CONSTRAINT pk_client_id PRIMARY KEY (id)
);

CREATE TABLE clients_address(
	id INT IDENTITY(1,1) NOT NULL,
	id_client INT NOT NULL,
	address NVARCHAR(100) NOT NULL,
	creation_date DATETIME NOT NULL CONSTRAINT df_client_address_creation_date  DEFAULT(GETDATE()),
	CONSTRAINT pk_client_address_id PRIMARY KEY (id),
	CONSTRAINT fk_client_id FOREIGN KEY (id_client) REFERENCES clients(id)
);

CREATE PROC sp_clients_insert(
	@first_name varchar(100),
	@last_name varchar(100),
	@address varchar(100)
)
AS
BEGIN
	DECLARE @id_client INT;
	BEGIN TRY
		BEGIN TRAN;
			INSERT INTO clients
			(
				first_name,
				last_name
			)
			VALUES
			(
				@first_name,
				@last_name
			);
			SET @id_client = SCOPE_IDENTITY();
			INSERT INTO clients_address
			(
				id_client,
				address
			)
			VALUES
			(
				@id_client,
				@address
			);
		COMMIT;
		SELECT
		  id AS id_client,
		  first_name,
		  last_name
		  FROM clients WHERE id = @id_client;
		RETURN 1;
	END TRY
	BEGIN CATCH
		SELECT
            ERROR_NUMBER() AS ErrorNumber
            ,ERROR_SEVERITY() AS ErrorSeverity
            ,ERROR_STATE() AS ErrorState
            ,ERROR_PROCEDURE() AS ErrorProcedure
            ,ERROR_LINE() AS ErrorLine
            ,ERROR_MESSAGE() AS ErrorMessage;
		ROLLBACK;
		RETURN -1;
	END CATCH
END;
GO

CREATE PROC sp_clients_update(
    @id_client int,
	@first_name varchar(100),
	@last_name varchar(100),
	@address varchar(100)
)
AS
BEGIN
	IF NOT EXISTS (SELECT 1 FROM clients WHERE id = @id_client)
	BEGIN
		SELECT 'Client not exists' AS message_error;
		RETURN 0
	END;
	BEGIN TRY
		BEGIN TRAN;
			UPDATE clients
			SET first_name = @first_name, last_name = @last_name
				WHERE id = @id_client;
			UPDATE clients_address
			SET address = @address
				WHERE id_client = @id_client;
		COMMIT;
		SELECT
		  id AS id_client, first_name, last_name
		  	FROM clients
				WHERE id = @id_client;
		RETURN 1;
	END TRY
	BEGIN CATCH
		SELECT
            ERROR_NUMBER() AS ErrorNumber
            ,ERROR_SEVERITY() AS ErrorSeverity
            ,ERROR_STATE() AS ErrorState
            ,ERROR_PROCEDURE() AS ErrorProcedure
            ,ERROR_LINE() AS ErrorLine
            ,ERROR_MESSAGE() AS ErrorMessage;
		ROLLBACK;
		RETURN -1;
	END CATCH
END;
GO

CREATE PROC sp_clients_select
AS
BEGIN
		  SELECT
		  c.id AS id_client,
		  c.first_name,
		  c.last_name,
		  ca.address
		  FROM clients c
		  	INNER JOIN clients_address ca ON c.id = ca.id_client
		RETURN 1;
END;
GO
CREATE PROC sp_clients_select_id
(
	@id_client int
)
AS
BEGIN
		  SELECT
		  c.id AS id_client,
		  c.first_name,
		  c.last_name,
		  ca.address
		  FROM clients c
		  	INNER JOIN clients_address ca ON c.id = ca.id_client
			WHERE c.id = @id_client;
		RETURN 1;
END;
GO

CREATE PROC sp_clients_delete(
	@id_client int
)
AS
BEGIN
	IF NOT EXISTS (SELECT 1 FROM clients WHERE id = @id_client)
	BEGIN
		SELECT 'Client not exists' AS message_error;
		RETURN 0
	END;
	BEGIN TRY
		BEGIN TRAN;
			DELETE FROM clients_address where id_client = @id_client;
			DELETE FROM clients WHERE id = @id_client;
		COMMIT;
		SELECT 'Client deleted' as message_error;
		RETURN 1;
	END TRY
	BEGIN CATCH
		SELECT
            ERROR_NUMBER() AS ErrorNumber
            ,ERROR_SEVERITY() AS ErrorSeverity
            ,ERROR_STATE() AS ErrorState
            ,ERROR_PROCEDURE() AS ErrorProcedure
            ,ERROR_LINE() AS ErrorLine
            ,ERROR_MESSAGE() AS ErrorMessage;
		ROLLBACK;
		RETURN -1;
	END CATCH
END;
GO
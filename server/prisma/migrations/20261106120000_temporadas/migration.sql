-- Temporada visual del sitio (BASE, NAVIDAD, MUERTOS o AMOR), elegida por la administradora.
ALTER TABLE `StoreSettings` ADD COLUMN `season` VARCHAR(20) NOT NULL DEFAULT 'BASE';
ALTER TABLE `StoreSettings` ALTER COLUMN `slogan` SET DEFAULT 'Velas artesanales para cada momento';

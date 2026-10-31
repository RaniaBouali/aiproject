-- ==============================================================================
-- ProxiService Database Schema & Seed Data (Microsoft SQL Server / Azure SQL)
-- ==============================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ProxiServiceDB')
BEGIN
    CREATE DATABASE ProxiServiceDB;
END
GO

USE ProxiServiceDB;
GO

-- 1. Users Table
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id NVARCHAR(50) PRIMARY KEY,
        Name NVARCHAR(150) NOT NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        Phone NVARCHAR(50) NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(20) NOT NULL CHECK (Role IN ('CLIENT', 'PROVIDER', 'ADMIN')),
        AvatarUrl NVARCHAR(500) NULL,
        AddressText NVARCHAR(255) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- 2. Categories Table
IF OBJECT_ID('dbo.Categories', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Categories (
        Id NVARCHAR(50) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Slug NVARCHAR(100) NOT NULL UNIQUE,
        Icon NVARCHAR(50) NOT NULL,
        Description NVARCHAR(500) NOT NULL,
        BadgeCount INT NOT NULL DEFAULT 0
    );
END
GO

-- 3. Providers Table
IF OBJECT_ID('dbo.Providers', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Providers (
        Id NVARCHAR(50) PRIMARY KEY,
        UserId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES dbo.Users(Id),
        Name NVARCHAR(150) NOT NULL,
        Avatar NVARCHAR(500) NOT NULL,
        Phone NVARCHAR(50) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        AddressText NVARCHAR(255) NOT NULL,
        Latitude FLOAT NOT NULL,
        Longitude FLOAT NOT NULL,
        OperationalRadiusKm INT NOT NULL DEFAULT 20,
        IsVerified BIT NOT NULL DEFAULT 1,
        RatingAverage FLOAT NOT NULL DEFAULT 5.0,
        ReviewCount INT NOT NULL DEFAULT 0,
        Status NVARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
        Bio NVARCHAR(MAX) NOT NULL,
        ExperienceYears INT NOT NULL DEFAULT 3,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- 4. Provider Categories (Many-to-Many)
IF OBJECT_ID('dbo.ProviderCategories', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ProviderCategories (
        ProviderId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES dbo.Providers(Id),
        CategoryId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES dbo.Categories(Id),
        PRIMARY KEY (ProviderId, CategoryId)
    );
END
GO

-- 5. Services Table
IF OBJECT_ID('dbo.Services', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Services (
        Id NVARCHAR(50) PRIMARY KEY,
        ProviderId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES dbo.Providers(Id),
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(1000) NOT NULL,
        Price DECIMAL(18, 2) NOT NULL,
        PriceType NVARCHAR(20) NOT NULL CHECK (PriceType IN ('HOURLY', 'FIXED', 'ESTIMATE')),
        DurationMinutes INT NULL DEFAULT 60
    );
END
GO

-- 6. Portfolio Items
IF OBJECT_ID('dbo.PortfolioItems', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PortfolioItems (
        Id NVARCHAR(50) PRIMARY KEY,
        ProviderId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES dbo.Providers(Id),
        Title NVARCHAR(200) NOT NULL,
        ImageUrl NVARCHAR(500) NOT NULL,
        Description NVARCHAR(500) NULL
    );
END
GO

-- 7. Bookings Table
IF OBJECT_ID('dbo.Bookings', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Bookings (
        Id NVARCHAR(50) PRIMARY KEY,
        ClientId NVARCHAR(50) NOT NULL,
        ClientName NVARCHAR(150) NOT NULL,
        ClientPhone NVARCHAR(50) NOT NULL,
        ClientAddress NVARCHAR(255) NOT NULL,
        ProviderId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES dbo.Providers(Id),
        ProviderName NVARCHAR(150) NOT NULL,
        ServiceId NVARCHAR(50) NOT NULL,
        ServiceTitle NVARCHAR(200) NOT NULL,
        ServicePrice DECIMAL(18, 2) NOT NULL,
        ServicePriceType NVARCHAR(20) NOT NULL,
        ScheduledAt DATETIME2 NOT NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (Status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
        Notes NVARCHAR(MAX) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- 8. Reviews Table
IF OBJECT_ID('dbo.Reviews', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Reviews (
        Id NVARCHAR(50) PRIMARY KEY,
        ProviderId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES dbo.Providers(Id),
        BookingId NVARCHAR(50) NULL,
        ClientId NVARCHAR(50) NOT NULL,
        ClientName NVARCHAR(150) NOT NULL,
        Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
        Comment NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- ==============================================================================
-- Seed Data Injection
-- ==============================================================================

-- Seed Categories
IF NOT EXISTS (SELECT 1 FROM dbo.Categories WHERE Slug = 'mecanicien')
BEGIN
    INSERT INTO dbo.Categories (Id, Name, Slug, Icon, Description, BadgeCount)
    VALUES 
    ('cat-meca', N'Mécanicien Auto & Moto', 'mecanicien', 'Wrench', N'Dépannage, vidange, révision, freins et diagnostic à domicile.', 14),
    ('cat-menage', N'Femme de ménage & Aide à domicile', 'femme-de-menage', 'Sparkles', N'Nettoyage approfondi, repassage, entretien de maisons et bureaux.', 22),
    ('cat-elec', N'Électricien', 'electricien', 'Zap', N'Installation, remise aux normes, recherche de pannes & disjoncteurs.', 18),
    ('cat-plomb', N'Plombier Chauffagiste', 'plombier', 'Droplet', N'Recherche de fuite, débouchage, chauffe-eau et robinetterie.', 19),
    ('cat-peint', N'Peintre en bâtiment', 'peintre', 'Paintbrush', N'Peinture intérieure/extérieure, enduit, rénovation murale.', 12),
    ('cat-menuis', N'Menuisier & Agencement', 'menuisier', 'Hammer', N'Meubles sur mesure, pose de cuisine, parquets et placards.', 9);
END
GO

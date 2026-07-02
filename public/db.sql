-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: hermosa
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `preferred_location` varchar(200) DEFAULT NULL,
  `preferred_doctor` varchar(100) DEFAULT NULL,
  `preferred_day` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') DEFAULT NULL,
  `preferred_time` time DEFAULT NULL,
  `preferred_contact` enum('phone','email','text') NOT NULL DEFAULT 'email',
  `status` enum('active','inactive','archived') NOT NULL DEFAULT 'active',
  `notes` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_email` (`email`),
  UNIQUE KEY `customers_phone` (`phone`),
  KEY `customers_preferred_location` (`preferred_location`),
  KEY `customers_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (11,'Aaron Xiao','axiao@blueocean.caa','122650380156','5075 Yonge St #600, Richmond Hill',NULL,'Tuesday','15:41:00','email','active',NULL,'2026-07-01 18:41:30','2026-07-01 18:41:30'),(12,'jerry','jerry@abc.com','16473369666','5075 Yonge St #600, Richmond Hill','lee','Tuesday','11:48:00','email','active','test','2026-07-02 14:46:49','2026-07-02 14:46:49');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20260630120127-create-staff.js'),('20260701120328-add-status-to-staffs.js'),('20260701144629-create-customers-table.js'),('20260701160319-create-treatments-tabl.js'),('20260701203448-alter-treatments-change-staff-field.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staffs`
--

DROP TABLE IF EXISTS `staffs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staffs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'staff',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staffs`
--

LOCK TABLES `staffs` WRITE;
/*!40000 ALTER TABLE `staffs` DISABLE KEYS */;
INSERT INTO `staffs` VALUES (1,'Jerry','6479835211','jerryhong@live.com','$2b$10$urZ7NmfZg6GtsuzpsPb7dOSyMb6To3DhHvmPl1ObG6AvBWj3eD/pO','manager','2026-07-01 08:23:18','2026-07-01 14:01:09','active'),(2,'Aaron','2265038015','249349925@qq.com','$2b$10$xsST2npZfeVbUsGw0jSe.eL1mLCZwWJQNMiNgN/5.X38MKIhi8lRG','manager','2026-07-01 14:03:37','2026-07-01 14:24:27','active');
/*!40000 ALTER TABLE `staffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `customer_id` int NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `payment` varchar(250) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT '0.00',
  `balance` decimal(10,2) DEFAULT '0.00',
  `remark` text,
  `status` enum('in-progress','completed','cancelled','no-show') DEFAULT 'in-progress',
  `reminder_sent` tinyint(1) DEFAULT '0',
  `reminder_sent_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `staff_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `treatments_customer_id` (`customer_id`),
  KEY `treatments_date` (`date`),
  KEY `treatments_status` (`status`),
  KEY `treatments_location` (`location`),
  KEY `treatments_date_time` (`date`,`time`),
  KEY `treatments_staff_id_foreign_idx` (`staff_id`),
  CONSTRAINT `fk_treatments_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `treatments_staff_id_foreign_idx` FOREIGN KEY (`staff_id`) REFERENCES `staffs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatments`
--

LOCK TABLES `treatments` WRITE;
/*!40000 ALTER TABLE `treatments` DISABLE KEYS */;
INSERT INTO `treatments` VALUES (2,'Laser hair removal','2026-07-09','17:53:00',11,'5075 Yonge St #600, Richmond Hill',NULL,'2026-07-09',0.00,0.00,'This is a remark.\n','in-progress',0,NULL,'2026-07-01 20:54:17','2026-07-01 20:54:17',1),(3,'Injectables','2026-07-09','11:50:00',12,'5075 Yonge St #600, Richmond Hill','Cash','2026-07-14',0.00,0.00,'nope','in-progress',0,NULL,'2026-07-02 14:48:00','2026-07-02 14:48:00',2);
/*!40000 ALTER TABLE `treatments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-02 14:32:46

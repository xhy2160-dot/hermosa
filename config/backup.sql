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
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('added','edited','cancelled','login','system') NOT NULL,
  `actor` varchar(100) NOT NULL,
  `verb` varchar(255) NOT NULL,
  `object` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `activity_logs_type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
INSERT INTO `activity_logs` VALUES (3,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-25 15:30','2026-07-25 11:25:06','2026-07-25 11:25:06'),(4,'edited','Aaron','added a new appointment ','at 2026-07-25 15:30','2026-07-25 11:25:50','2026-07-25 11:25:50'),(5,'edited','Aaron','edited an appointment ','at 2026-07-25 15:30:00','2026-07-25 12:19:32','2026-07-25 12:19:32'),(6,'edited','Aaron','edited an appointment ','at 2026-07-29 13:30:00','2026-07-29 20:27:32','2026-07-29 20:27:32'),(7,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-29 13:30','2026-07-29 20:27:55','2026-07-29 20:27:55'),(8,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-29 14:30','2026-07-29 21:06:47','2026-07-29 21:06:47'),(9,'edited','Aaron','edited an appointment ','at 2026-07-29 14:30','2026-07-29 21:07:33','2026-07-29 21:07:33'),(10,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-30 11:00','2026-07-30 11:08:21','2026-07-30 11:08:21'),(11,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-30 11:00','2026-07-30 11:33:26','2026-07-30 11:33:26'),(12,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-30 14:00','2026-07-30 11:51:49','2026-07-30 11:51:49'),(13,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-30 13:30','2026-07-30 20:48:06','2026-07-30 20:48:06'),(14,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-30 16:30','2026-07-30 20:58:47','2026-07-30 20:58:47'),(15,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00','2026-07-30 21:00:09','2026-07-30 21:00:09'),(16,'edited','Aaron','edited an appointment ','at 2026-07-30 16:30','2026-07-30 21:00:17','2026-07-30 21:00:17'),(17,'edited','Aaron','edited an appointment ','at 2026-07-30 16:30:00','2026-07-30 21:01:14','2026-07-30 21:01:14'),(18,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-30 14:30','2026-07-30 21:01:34','2026-07-30 21:01:34'),(19,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-30 16:00','2026-07-30 21:06:01','2026-07-30 21:06:01'),(20,'edited','Aaron','edited an appointment ','at 2026-07-30 14:30','2026-07-30 21:06:52','2026-07-30 21:06:52'),(21,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00','2026-07-30 21:12:49','2026-07-30 21:12:49'),(22,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00','2026-07-30 21:14:02','2026-07-30 21:14:02'),(23,'edited','Aaron','edited an appointment ','at 2026-07-30 14:30','2026-07-30 21:14:19','2026-07-30 21:14:19'),(24,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00','2026-07-30 21:15:22','2026-07-30 21:15:22'),(25,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00:00','2026-07-30 21:22:51','2026-07-30 21:22:51'),(26,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00:00','2026-07-30 21:23:25','2026-07-30 21:23:25'),(27,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00:00','2026-07-30 21:23:48','2026-07-30 21:23:48'),(28,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00:00','2026-07-30 21:23:53','2026-07-30 21:23:53'),(29,'edited','Aaron','edited an appointment ','at 2026-07-30 11:00','2026-07-30 21:24:00','2026-07-30 21:24:00'),(30,'edited','Aaron','edited an appointment ','at 2026-07-30 14:30:00','2026-07-30 21:24:35','2026-07-30 21:24:35'),(31,'edited','Aaron','edited an appointment ','at 2026-07-30 14:30','2026-07-30 21:24:41','2026-07-30 21:24:41'),(32,'edited','Aaron','edited an appointment ','at 2026-07-30 16:00','2026-07-30 21:24:45','2026-07-30 21:24:45'),(33,'edited','Aaron','edited an appointment ','at 2026-07-30 16:00','2026-07-30 21:24:54','2026-07-30 21:24:54'),(34,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 12:00','2026-07-31 09:08:33','2026-07-31 09:08:33'),(35,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 14:30','2026-07-31 09:12:55','2026-07-31 09:12:55'),(36,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 12:00','2026-07-31 09:25:39','2026-07-31 09:25:39'),(37,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 11:30','2026-07-31 09:31:26','2026-07-31 09:31:26'),(38,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 14:30','2026-07-31 09:34:37','2026-07-31 09:34:37'),(39,'edited','Aaron','edited an appointment ','at 2026-07-31 14:30','2026-07-31 09:45:14','2026-07-31 09:45:14'),(40,'edited','Aaron','edited an appointment ','at 2026-07-31 11:30','2026-07-31 09:46:01','2026-07-31 09:46:01'),(41,'edited','Aaron','edited an appointment ','at 2026-07-31 14:30','2026-07-31 09:48:01','2026-07-31 09:48:01'),(42,'edited','Aaron','edited an appointment ','at 2026-07-31 14:30','2026-07-31 09:51:51','2026-07-31 09:51:51'),(43,'edited','Aaron','edited an appointment ','at 2026-07-31 14:30','2026-07-31 09:54:39','2026-07-31 09:54:39'),(44,'edited','Aaron','edited an appointment ','at 2026-07-31 14:30','2026-07-31 09:55:26','2026-07-31 09:55:26'),(45,'edited','Aaron','edited an appointment ','at 2026-07-31 11:30:00','2026-07-31 09:55:34','2026-07-31 09:55:34'),(46,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 13:00','2026-07-31 09:56:08','2026-07-31 09:56:08'),(47,'edited','Aaron','edited an appointment ','at 2026-07-31 13:00','2026-07-31 09:56:16','2026-07-31 09:56:16'),(48,'edited','Aaron','edited an appointment ','at 2026-07-31 13:00:00','2026-07-31 10:21:21','2026-07-31 10:21:21'),(49,'edited','Aaron','edited an appointment ','at 2026-07-31 13:00:00','2026-07-31 10:22:43','2026-07-31 10:22:43'),(50,'edited','Aaron','edited an appointment ','at 2026-07-31 13:00:00','2026-07-31 10:22:50','2026-07-31 10:22:50'),(51,'edited','Aaron','edited an appointment ','at 2026-07-31 13:00:00','2026-07-31 10:22:55','2026-07-31 10:22:55'),(52,'edited','Aaron','edited an appointment ','at 2026-07-31 13:00:00','2026-07-31 10:23:01','2026-07-31 10:23:01'),(53,'edited','Aaron','edited an appointment ','at 2026-07-31 13:00:00','2026-07-31 10:23:02','2026-07-31 10:23:02'),(54,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-07-31 10:32:26','2026-07-31 10:32:26'),(55,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-07-31 10:32:32','2026-07-31 10:32:32'),(56,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-07-31 10:32:34','2026-07-31 10:32:34'),(57,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-07-31 10:33:00','2026-07-31 10:33:00'),(58,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-07-31 10:33:38','2026-07-31 10:33:38'),(59,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-07-31 10:33:59','2026-07-31 10:33:59'),(60,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-07-31 10:34:35','2026-07-31 10:34:35'),(61,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 18:00','2026-07-31 10:39:40','2026-07-31 10:39:40'),(62,'edited','Aaron','edited an appointment','at 2026-07-31 18:00:00','2026-07-31 10:40:14','2026-07-31 10:40:14'),(63,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 19:00','2026-07-31 10:40:33','2026-07-31 10:40:33'),(64,'edited','Aaron','edited an appointment','at 2026-07-31 19:00:00','2026-07-31 10:41:25','2026-07-31 10:41:25'),(65,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-07-31 20:00','2026-07-31 10:41:48','2026-07-31 10:41:48'),(66,'edited','Aaron','edited an appointment','at 2026-07-31 20:00:00','2026-07-31 10:42:06','2026-07-31 10:42:06'),(67,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-01 09:01:18','2026-08-01 09:01:18'),(68,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-08-02 08:57:55','2026-08-02 08:57:55'),(69,'edited','Aaron','edited an appointment','at 2026-07-31 13:00:00','2026-08-02 08:57:58','2026-08-02 08:57:58'),(70,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-02 12:30','2026-08-02 10:22:18','2026-08-02 10:22:18'),(71,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-02 14:30','2026-08-02 10:22:34','2026-08-02 10:22:34'),(72,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-02 14:00','2026-08-02 10:30:33','2026-08-02 10:30:33'),(73,'edited','Aaron','edited an appointment','at 2026-08-02 12:30:00','2026-08-02 10:34:42','2026-08-02 10:34:42'),(74,'edited','Aaron','edited an appointment','at 2026-08-02 14:00:00','2026-08-02 11:27:21','2026-08-02 11:27:21'),(75,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-02 12:25:22','2026-08-02 12:25:22'),(76,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-02 12:25:31','2026-08-02 12:25:31'),(77,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-02 12:25:33','2026-08-02 12:25:33'),(78,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-02 12:25:44','2026-08-02 12:25:44'),(79,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-02 12:25:50','2026-08-02 12:25:50'),(80,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-02 12:27:40','2026-08-02 12:27:40'),(81,'edited','Aaron','edited an appointment','at 2026-07-31 14:30:00','2026-08-02 12:27:50','2026-08-02 12:27:50'),(82,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-03 12:30','2026-08-03 11:14:30','2026-08-03 11:14:30'),(83,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-03 14:00','2026-08-03 11:15:00','2026-08-03 11:15:00'),(84,'edited','Aaron','edited an appointment','at 2026-08-03 14:00:00','2026-08-03 20:07:35','2026-08-03 20:07:35'),(85,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-03 14:00','2026-08-03 20:08:58','2026-08-03 20:08:58'),(86,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-03 17:00','2026-08-03 20:09:14','2026-08-03 20:09:14'),(87,'edited','Aaron','edited an appointment','at 2026-08-03 14:00:00','2026-08-03 20:10:03','2026-08-03 20:10:03'),(88,'edited','Aaron','edited an appointment','at 2026-08-03 17:00:00','2026-08-03 20:10:21','2026-08-03 20:10:21'),(89,'edited','Aaron','edited an appointment','at 2026-08-03 14:00:00','2026-08-03 20:23:35','2026-08-03 20:23:35'),(90,'edited','Aaron','edited an appointment','at 2026-08-03 14:00:00','2026-08-03 20:23:42','2026-08-03 20:23:42'),(91,'edited','Aaron','edited an appointment','at 2026-08-02 14:00:00','2026-08-03 20:30:10','2026-08-03 20:30:10'),(92,'edited','Aaron','edited an appointment','at 2026-08-02 14:00:00','2026-08-03 20:30:13','2026-08-03 20:30:13'),(93,'added','Aaron','added a new appointment for','Aaron Xiao at 2026-08-04 10:00','2026-08-03 20:43:47','2026-08-03 20:43:47'),(94,'system','System','sent 24h reminder SMS to','Aaron Xiao','2026-08-03 20:44:01','2026-08-03 20:44:01');
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `treatment_id` int DEFAULT NULL COMMENT '关联的疗程/项目单ID',
  `title` varchar(250) NOT NULL COMMENT '预约标题/服务名称摘要',
  `date` date NOT NULL COMMENT '预约日期',
  `start_time` time NOT NULL COMMENT '开始时间',
  `end_time` time NOT NULL COMMENT '结束时间',
  `location` enum('NY','RH') NOT NULL COMMENT '门店位置',
  `room` int DEFAULT NULL COMMENT '房间id',
  `assigned_staff` int DEFAULT NULL COMMENT '被指派的员工ID',
  `remark` text COMMENT '备注信息',
  `status` enum('scheduled','completed','cancelled','no-show') NOT NULL DEFAULT 'scheduled' COMMENT '预约状态',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reminder_24h_sent` datetime DEFAULT NULL,
  `reminder_1h_sent` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_location_date` (`location`,`date`),
  KEY `appointments_assigned_staff` (`assigned_staff`),
  KEY `Appointments_customer_id_foreign_idx` (`customer_id`),
  CONSTRAINT `Appointments_customer_id_foreign_idx` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (40,11,0,'single 2','2026-07-31','14:30:00','15:00:00','NY',13,4,'aa','completed','2026-07-31 09:34:37','2026-08-02 12:27:50',NULL,NULL),(45,11,31,'treatment1 (1/2)','2026-08-02','12:30:00','13:00:00','NY',14,1,'re','completed','2026-08-02 10:22:18','2026-08-02 10:34:42',NULL,NULL),(47,11,31,'treatment1 (2/2)','2026-08-02','14:00:00','14:30:00','NY',15,1,'rr','completed','2026-08-02 10:30:33','2026-08-03 20:30:13',NULL,NULL),(48,11,0,'treatment 2','2026-08-03','12:30:00','13:00:00','NY',14,1,'rr','scheduled','2026-08-03 11:14:30','2026-08-03 11:14:30',NULL,NULL),(49,11,31,'treatment1 (3/2)','2026-08-03','14:00:00','14:30:00','NY',13,4,'rr','cancelled','2026-08-03 11:15:00','2026-08-03 20:07:35',NULL,NULL),(50,11,32,'package treatment 2 (1/2)','2026-08-03','14:00:00','14:30:00','NY',16,4,'rr','completed','2026-08-03 20:08:58','2026-08-03 20:23:42',NULL,NULL),(51,11,32,'package treatment 2 (2/2)','2026-08-03','17:00:00','17:30:00','NY',13,1,'aa','completed','2026-08-03 20:09:14','2026-08-03 20:10:21',NULL,NULL),(52,11,0,'facial','2026-08-04','10:00:00','10:30:00','NY',12,1,'rr','scheduled','2026-08-03 20:43:47','2026-08-03 20:44:01','2026-08-03 20:44:01',NULL);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

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
  `language` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'EN',
  `reminder_type` varchar(20) DEFAULT '24 hour',
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_email` (`email`),
  UNIQUE KEY `customers_phone` (`phone`),
  KEY `customers_preferred_location` (`preferred_location`),
  KEY `customers_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (11,'Aaron Xiao','axiao@blueocean.caa','+12265038015','NY',NULL,'Tuesday','15:41:00','email','active',NULL,'2026-07-01 18:41:30','2026-07-25 11:29:46','CN_S','both'),(12,'jerry','jerry@abc.com','+16473369666','NY','lee','Tuesday','11:48:00','email','active','test','2026-07-02 14:46:49','2026-07-02 14:46:49','CN_S','24 hour'),(13,'Carl','carl@email.com','+19027223300','NY',NULL,'Monday','09:30:00','email','active','this is the 3rd customer','2026-07-07 23:14:16','2026-07-07 23:14:16','CN_T','24 hour'),(14,'John','john@example.com','+12265038014','NY','doc who','Monday','11:30:00','email','active','notes','2026-07-15 18:38:43','2026-07-15 18:38:43','KR','24 hour'),(22,'Lee','lee@email.com','+12265038020','RH','doc who','Monday','05:43:00','email','active','note','2026-07-15 20:41:10','2026-07-15 20:48:54','EN','24h');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `install_payments`
--

DROP TABLE IF EXISTS `install_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `install_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `treatment_id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `install_payments`
--

LOCK TABLES `install_payments` WRITE;
/*!40000 ALTER TABLE `install_payments` DISABLE KEYS */;
INSERT INTO `install_payments` VALUES (23,31,0,'initial',100.00,'Cash','2026-08-02 09:57:25','2026-08-02 09:57:25'),(34,0,40,'expense',100.00,'Store Credits','2026-08-03 10:23:36','2026-08-03 10:23:36'),(35,0,45,'expense',50.00,'Store Credits','2026-08-03 10:25:51','2026-08-03 10:25:51'),(36,0,45,'expense',30.00,'Credit Card','2026-08-03 10:32:40','2026-08-03 10:32:40'),(37,0,45,'expense',1.00,'Cash','2026-08-03 10:37:34','2026-08-03 10:37:34'),(38,0,47,'expense',1.00,'Cash','2026-08-03 10:38:32','2026-08-03 10:38:32'),(39,0,47,'expense',2.00,'Credit Card','2026-08-03 10:40:10','2026-08-03 10:40:10'),(40,0,47,'expense',1.00,'Cash','2026-08-03 10:41:08','2026-08-03 10:41:08'),(46,31,0,'conversion',15.00,'Store Credits','2026-08-03 19:41:57','2026-08-03 19:41:57'),(47,32,0,'initial',100.00,'Cash','2026-08-03 20:08:24','2026-08-03 20:08:24'),(48,0,50,'expense',40.00,'Treatment Package','2026-08-03 20:09:54','2026-08-03 20:09:54'),(49,0,51,'expense',40.00,'Treatment Package','2026-08-03 20:10:14','2026-08-03 20:10:14'),(50,32,0,'conversion',20.00,'Store Credits','2026-08-03 20:18:29','2026-08-03 20:18:29');
/*!40000 ALTER TABLE `install_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` enum('NY','RH') DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (12,'Laser Room #7','NY','2026-07-07 11:14:52','2026-07-07 11:14:52'),(13,'Laser Room #6','NY','2026-07-07 11:14:52','2026-07-07 11:14:52'),(14,'Facial Room #2','NY','2026-07-07 11:14:52','2026-07-07 11:14:52'),(15,'Facial Room #3','NY','2026-07-07 11:14:52','2026-07-07 11:14:52'),(16,'Privacy Room #5','NY','2026-07-07 11:14:52','2026-07-07 11:14:52'),(17,'Consultation Room #1','NY','2026-07-07 11:14:52','2026-07-07 11:14:52'),(18,'Room 1','RH','2026-07-07 11:14:52','2026-07-07 11:14:52'),(19,'Room 2','RH','2026-07-07 11:14:52','2026-07-07 11:14:52'),(20,'Room 3','RH','2026-07-07 11:14:52','2026-07-07 11:14:52'),(21,'Laser Room','RH','2026-07-07 11:14:52','2026-07-07 11:14:52'),(22,'2nd Floor','RH','2026-07-07 11:14:52','2026-07-07 11:14:52');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
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
INSERT INTO `sequelizemeta` VALUES ('20260630120127-create-staff.js'),('20260701120328-add-status-to-staffs.js'),('20260701144629-create-customers-table.js'),('20260701160319-create-treatments-tabl.js'),('20260701203448-alter-treatments-change-staff-field.js'),('20260703111723-create-sub-treatments.js'),('20260703112631-create-sub-treatments.js'),('20260703113202-create-install-payment.js'),('20260703132245-create-rooms.js'),('20260703132442-create-rooms.js'),('20260707135512-add-room-id-to-treatments.js'),('20260707211759-rename-time-and-add-end-time-to-treatments.js'),('20260709113842-change treatment table.js'),('20260709122049-create-appointments-table.js'),('20260709125718-add-customer-id-back-to-treatments.js'),('20260715182851-add-language-and-reminder-type-to-customers.js'),('20260716123133-update-appointment-reminder-columns.js'),('20260716133437-add-total-sessions-to-treatments.js'),('20260725121912-create-activity-log.js'),('20260730152111-add-customer-id-to-appointments.js'),('20260801130511-rename-treatment-id-to-appointment-id-in-install-payments.js'),('20260802193423-create store_credits table.js'),('20260803204803-add-remark-to-store-credits.js');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staffs`
--

LOCK TABLES `staffs` WRITE;
/*!40000 ALTER TABLE `staffs` DISABLE KEYS */;
INSERT INTO `staffs` VALUES (1,'Jerry','+16479835211','jerryhong@live.com','$2b$10$urZ7NmfZg6GtsuzpsPb7dOSyMb6To3DhHvmPl1ObG6AvBWj3eD/pO','manager','2026-07-01 08:23:18','2026-07-16 14:58:02','active'),(2,'Aaron','+12265038015','249349925@qq.com','$2b$10$xsST2npZfeVbUsGw0jSe.eL1mLCZwWJQNMiNgN/5.X38MKIhi8lRG','manager','2026-07-01 14:03:37','2026-07-16 15:22:17','active'),(4,'Jake','+12265038015','jake@email.com','$2b$10$4/3eH6YX/UBHQuZo5HdBPu4.MAAAR6b60Qj6lInmWwtuNFUwvT5oG','staff','2026-07-16 14:37:23','2026-07-16 14:50:51','active');
/*!40000 ALTER TABLE `staffs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_credits`
--

DROP TABLE IF EXISTS `store_credits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_credits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `associated_id` int DEFAULT NULL,
  `type` enum('appointment','treatment','manual') NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `staff_name` varchar(100) DEFAULT NULL,
  `remark` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `store_credits_customer_id` (`customer_id`),
  KEY `store_credits_associated_id` (`associated_id`),
  CONSTRAINT `store_credits_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_credits`
--

LOCK TABLES `store_credits` WRITE;
/*!40000 ALTER TABLE `store_credits` DISABLE KEYS */;
INSERT INTO `store_credits` VALUES (1,11,NULL,'manual',100.00,'Aaron',NULL,'2026-08-02 16:53:51','2026-08-02 16:53:51'),(3,11,40,'appointment',-100.00,'Aaron',NULL,'2026-08-03 10:23:36','2026-08-03 10:23:36'),(4,11,NULL,'manual',15.00,'Aaron',NULL,'2026-08-03 11:15:44','2026-08-03 11:15:44'),(5,11,NULL,'manual',15.00,'Aaron',NULL,'2026-08-03 11:16:54','2026-08-03 11:16:54'),(6,11,NULL,'manual',-15.00,'Aaron',NULL,'2026-08-03 11:17:32','2026-08-03 11:17:32'),(7,11,NULL,'manual',10.00,'Aaron','test remark','2026-08-03 16:57:22','2026-08-03 16:57:22'),(10,11,31,'treatment',15.00,'Aaron','Converted treatment balance to store credit','2026-08-03 19:41:57','2026-08-03 19:41:57'),(11,11,32,'treatment',20.00,'Aaron','Converted treatment balance to store credit','2026-08-03 20:18:29','2026-08-03 20:18:29');
/*!40000 ALTER TABLE `store_credits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_treatments`
--

DROP TABLE IF EXISTS `sub_treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sub_treatments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `treatment_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `room` varchar(255) DEFAULT NULL,
  `staff` varchar(255) DEFAULT NULL,
  `remark` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sub_treatments_treatment_id` (`treatment_id`),
  CONSTRAINT `sub_treatments_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_treatments`
--

LOCK TABLES `sub_treatments` WRITE;
/*!40000 ALTER TABLE `sub_treatments` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL COMMENT '关联的客户/患者ID',
  `name` varchar(250) NOT NULL,
  `total` decimal(10,2) DEFAULT '0.00',
  `balance` decimal(10,2) DEFAULT '0.00',
  `total_sessions` int DEFAULT '1',
  `added_by` int DEFAULT NULL COMMENT '创建该记录的操作员ID',
  `remark` text,
  `status` enum('in-progress','completed','cancelled','no-show') DEFAULT 'in-progress',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `treatments_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatments`
--

LOCK TABLES `treatments` WRITE;
/*!40000 ALTER TABLE `treatments` DISABLE KEYS */;
INSERT INTO `treatments` VALUES (31,11,'treatment1',100.00,0.00,2,2,'remark','completed','2026-08-02 09:57:25','2026-08-02 11:27:21'),(32,11,'package treatment 2',100.00,0.00,2,2,'remark','completed','2026-08-03 20:08:24','2026-08-03 20:10:21');
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

-- Dump completed on 2026-08-04 10:53:09

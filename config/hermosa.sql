-- Database: hermosa
-- Generated: 2026-07-16T21:34:16.279Z
-- Export: Structure and Data

CREATE DATABASE IF NOT EXISTS `hermosa`;
USE `hermosa`;

-- Table: appointments
-- Generated: 2026-07-16T21:34:16.315Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
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
  KEY `fk_appointments_treatment_id` (`treatment_id`),
  CONSTRAINT `fk_appointments_treatment_id` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `appointments` (`id`, `treatment_id`, `title`, `date`, `start_time`, `end_time`, `location`, `room`, `assigned_staff`, `remark`, `status`, `created_at`, `updated_at`, `reminder_24h_sent`, `reminder_1h_sent`) VALUES
  (2, 4, 'tbd', 'Sat Jul 11 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '11:00:00', '11:30:00', 'RH', 19, 1, 'test', 'scheduled', 'Sat Jul 11 2026 12:45:38 GMT-0300 (Atlantic Daylight Time)', 'Sat Jul 11 2026 12:45:38 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (3, 3, 'tbd', 'Sat Jul 11 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '12:00:00', '12:30:00', 'NY', 15, 1, 'remark', 'completed', 'Sat Jul 11 2026 12:46:27 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:21:43 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (4, 24, 'tbd', 'Sat Jul 11 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '13:00:00', '17:30:00', 'NY', 15, 1, 'remark,   wowowowo?', 'completed', 'Sat Jul 11 2026 12:54:54 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:05:24 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (5, 24, 'tbd', 'Sat Jul 11 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '11:30:00', '12:00:00', 'RH', 21, 1, 'holy cow what? omfg what am i going to do now?', 'completed', 'Sat Jul 11 2026 12:55:45 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:09:59 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (6, 4, 'tbd', 'Sat Jul 11 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '15:30:00', '16:00:00', 'RH', 18, 1, 'test?????????????????', 'scheduled', 'Sat Jul 11 2026 12:56:31 GMT-0300 (Atlantic Daylight Time)', 'Sat Jul 11 2026 15:24:08 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (7, 3, 'tbd', 'Tue Jul 14 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '15:00:00', '15:30:00', 'NY', 13, 1, 'remark la remarremark la remark la remark la remark la remark la remark la remark la remark la remark la remark la r
emark la k la ', 'cancelled', 'Tue Jul 14 2026 14:13:55 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:21:57 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (8, 2, 'tbd', 'Tue Jul 14 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '15:30:00', '16:00:00', 'NY', 13, 1, 'bfhbaeiufbeufbueaa', 'cancelled', 'Wed Jul 15 2026 00:25:17 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 12:41:56 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (9, 8, 'tbd', 'Tue Jul 14 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '14:00:00', '14:30:00', 'NY', 15, 1, 'remark', 'completed', 'Wed Jul 15 2026 01:24:32 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:19:14 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (10, 6, 'tbd', 'Tue Jul 14 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '16:30:00', '17:00:00', 'NY', 14, 1, 'remark', 'scheduled', 'Wed Jul 15 2026 01:27:25 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 01:27:25 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (11, 25, 'tbd', 'Wed Jul 15 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '14:00:00', '14:30:00', 'NY', 15, 2, 'remark?', 'scheduled', 'Wed Jul 15 2026 12:50:58 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 13:01:00 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (12, 9, 'tbd', 'Wed Jul 15 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '12:00:00', '17:00:00', 'RH', 21, 2, 'remark', 'scheduled', 'Wed Jul 15 2026 13:03:12 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 13:03:12 GMT-0300 (Atlantic Daylight Time)', NULL, NULL),
  (13, 24, 'tbd', 'Thu Jul 16 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '11:00:00', '11:30:00', 'NY', 13, 1, 'note', 'completed', 'Thu Jul 16 2026 13:01:18 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:21:22 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 13:21:01 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 13:22:00 GMT-0300 (Atlantic Daylight Time)'),
  (14, 19, 'tbd', 'Thu Jul 16 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '12:30:00', '13:00:00', 'NY', 14, 1, 'note', 'scheduled', 'Thu Jul 16 2026 13:25:25 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:31:00 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 13:26:00 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:31:00 GMT-0300 (Atlantic Daylight Time)'),
  (15, 16, 'tbd', 'Thu Jul 16 2026 00:00:00 GMT-0300 (Atlantic Daylight Time)', '11:00:00', '11:30:00', 'NY', 15, 1, 'note', 'scheduled', 'Thu Jul 16 2026 13:27:50 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 10:31:47 GMT-0300 (Atlantic Daylight Time)', NULL, NULL);


-- Table: customers
-- Generated: 2026-07-16T21:34:16.323Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `customers`;
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

INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `preferred_location`, `preferred_doctor`, `preferred_day`, `preferred_time`, `preferred_contact`, `status`, `notes`, `created_at`, `updated_at`, `language`, `reminder_type`) VALUES
  (11, 'Aaron Xiao', 'axiao@blueocean.caa', '+12265038015', 'NY', NULL, 'Tuesday', '15:41:00', 'email', 'active', NULL, 'Wed Jul 01 2026 18:41:30 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:12:39 GMT-0300 (Atlantic Daylight Time)', 'CN_S', '24h'),
  (12, 'jerry', 'jerry@abc.com', '+16473369666', 'NY', 'lee', 'Tuesday', '11:48:00', 'email', 'active', 'test', 'Thu Jul 02 2026 14:46:49 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 02 2026 14:46:49 GMT-0300 (Atlantic Daylight Time)', 'CN_S', '24 hour'),
  (13, 'Carl', 'carl@email.com', '+19027223300', 'NY', NULL, 'Monday', '09:30:00', 'email', 'active', 'this is the 3rd customer', 'Tue Jul 07 2026 23:14:16 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 23:14:16 GMT-0300 (Atlantic Daylight Time)', 'CN_T', '24 hour'),
  (14, 'John', 'john@example.com', '+12265038014', 'NY', 'doc who', 'Monday', '11:30:00', 'email', 'active', 'notes', 'Wed Jul 15 2026 18:38:43 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 18:38:43 GMT-0300 (Atlantic Daylight Time)', 'KR', '24 hour'),
  (22, 'Lee', 'lee@email.com', '+12265038020', 'RH', 'doc who', 'Monday', '05:43:00', 'email', 'active', 'note', 'Wed Jul 15 2026 20:41:10 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 20:48:54 GMT-0300 (Atlantic Daylight Time)', 'EN', '24h');


-- Table: install_payments
-- Generated: 2026-07-16T21:34:16.327Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `install_payments`;
CREATE TABLE `install_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `treatment_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `install_payments_treatment_id` (`treatment_id`),
  CONSTRAINT `install_payments_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `install_payments` (`id`, `treatment_id`, `amount`, `payment_method`, `created_at`, `updated_at`) VALUES
  (1, 3, '10.00', 'Cash', 'Sun Jul 12 2026 14:26:59 GMT-0300 (Atlantic Daylight Time)', 'Sun Jul 12 2026 14:26:59 GMT-0300 (Atlantic Daylight Time)'),
  (3, 3, '11.00', 'Cash', 'Sun Jul 12 2026 14:30:23 GMT-0300 (Atlantic Daylight Time)', 'Sun Jul 12 2026 14:30:23 GMT-0300 (Atlantic Daylight Time)'),
  (4, 3, '12.00', 'Credit Card', 'Sun Jul 12 2026 14:34:34 GMT-0300 (Atlantic Daylight Time)', 'Sun Jul 12 2026 14:34:34 GMT-0300 (Atlantic Daylight Time)'),
  (5, 3, '13.00', 'WeChat Pay', 'Sun Jul 12 2026 14:55:38 GMT-0300 (Atlantic Daylight Time)', 'Sun Jul 12 2026 14:55:38 GMT-0300 (Atlantic Daylight Time)'),
  (6, 2, '1.99', 'WeChat Pay', 'Sun Jul 12 2026 15:29:46 GMT-0300 (Atlantic Daylight Time)', 'Sun Jul 12 2026 15:29:46 GMT-0300 (Atlantic Daylight Time)'),
  (7, 3, '46.00', 'Alipay', 'Wed Jul 15 2026 13:26:18 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 13:26:18 GMT-0300 (Atlantic Daylight Time)'),
  (8, 3, '9.00', 'Credit Card', 'Wed Jul 15 2026 13:31:43 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 13:31:43 GMT-0300 (Atlantic Daylight Time)'),
  (9, 2, '2.30', 'Cash', 'Wed Jul 15 2026 13:38:13 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 13:38:13 GMT-0300 (Atlantic Daylight Time)'),
  (10, 2, '1.10', 'Credit Card', 'Wed Jul 15 2026 13:49:25 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 13:49:25 GMT-0300 (Atlantic Daylight Time)'),
  (11, 2, '0.01', 'Alipay', 'Wed Jul 15 2026 13:54:20 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 13:54:20 GMT-0300 (Atlantic Daylight Time)');


-- Table: rooms
-- Generated: 2026-07-16T21:34:16.329Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` enum('NY','RH') DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `rooms` (`id`, `name`, `location`, `created_at`, `updated_at`) VALUES
  (12, 'Laser Room #7', 'NY', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (13, 'Laser Room #6', 'NY', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (14, 'Facial Room #2', 'NY', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (15, 'Facial Room #3', 'NY', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (16, 'Privacy Room #5', 'NY', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (17, 'Consultation Room #1', 'NY', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (18, 'Room 1', 'RH', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (19, 'Room 2', 'RH', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (20, 'Room 3', 'RH', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (21, 'Laser Room', 'RH', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)'),
  (22, '2nd Floor', 'RH', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)', 'Tue Jul 07 2026 11:14:52 GMT-0300 (Atlantic Daylight Time)');


-- Table: sequelizemeta
-- Generated: 2026-07-16T21:34:16.331Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

INSERT INTO `sequelizemeta` (`name`) VALUES
  ('20260630120127-create-staff.js'),
  ('20260701120328-add-status-to-staffs.js'),
  ('20260701144629-create-customers-table.js'),
  ('20260701160319-create-treatments-tabl.js'),
  ('20260701203448-alter-treatments-change-staff-field.js'),
  ('20260703111723-create-sub-treatments.js'),
  ('20260703112631-create-sub-treatments.js'),
  ('20260703113202-create-install-payment.js'),
  ('20260703132245-create-rooms.js'),
  ('20260703132442-create-rooms.js'),
  ('20260707135512-add-room-id-to-treatments.js'),
  ('20260707211759-rename-time-and-add-end-time-to-treatments.js'),
  ('20260709113842-change treatment table.js'),
  ('20260709122049-create-appointments-table.js'),
  ('20260709125718-add-customer-id-back-to-treatments.js'),
  ('20260715182851-add-language-and-reminder-type-to-customers.js'),
  ('20260716123133-update-appointment-reminder-columns.js'),
  ('20260716133437-add-total-sessions-to-treatments.js');


-- Table: staffs
-- Generated: 2026-07-16T21:34:16.335Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `staffs`;
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

INSERT INTO `staffs` (`id`, `name`, `phone`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `status`) VALUES
  (1, 'Jerry', '+16479835211', 'jerryhong@live.com', '$2b$10$urZ7NmfZg6GtsuzpsPb7dOSyMb6To3DhHvmPl1ObG6AvBWj3eD/pO', 'manager', 'Wed Jul 01 2026 08:23:18 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:58:02 GMT-0300 (Atlantic Daylight Time)', 'active'),
  (2, 'Aaron', '+12265038015', '249349925@qq.com', '$2b$10$xsST2npZfeVbUsGw0jSe.eL1mLCZwWJQNMiNgN/5.X38MKIhi8lRG', 'manager', 'Wed Jul 01 2026 14:03:37 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:22:17 GMT-0300 (Atlantic Daylight Time)', 'active'),
  (4, 'Jake', '+12265038015', 'jake@email.com', '$2b$10$4/3eH6YX/UBHQuZo5HdBPu4.MAAAR6b60Qj6lInmWwtuNFUwvT5oG', 'staff', 'Thu Jul 16 2026 14:37:23 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 14:50:51 GMT-0300 (Atlantic Daylight Time)', 'active');


-- Table: sub_treatments
-- Generated: 2026-07-16T21:34:16.343Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `sub_treatments`;
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



-- Table: treatments
-- Generated: 2026-07-16T21:34:16.346Z
-- Export: Structure and Data

DROP TABLE IF EXISTS `treatments`;
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `treatments` (`id`, `customer_id`, `name`, `total`, `balance`, `total_sessions`, `added_by`, `remark`, `status`, `created_at`, `updated_at`) VALUES
  (2, 11, 'Laser hair removal', '100.00', '0.00', 1, 1, 'This is a remark.
', 'in-progress', 'Wed Jul 01 2026 20:54:17 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 08 2026 13:26:19 GMT-0300 (Atlantic Daylight Time)'),
  (3, 11, 'Injectables', '101.00', '0.00', 1, 2, 'remark', 'completed', 'Thu Jul 02 2026 14:48:00 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 01:34:26 GMT-0300 (Atlantic Daylight Time)'),
  (4, 13, 'Haircut', '100.00', '0.00', 1, 2, '3rd remark
 ', 'in-progress', 'Wed Jul 01 2026 20:54:17 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 01 2026 20:54:17 GMT-0300 (Atlantic Daylight Time)'),
  (5, 11, '3rd treatment', '100.00', '0.00', 1, 2, 'holy cow what? omfg what am i going to do now?', 'in-progress', 'Thu Jul 09 2026 13:48:39 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 01:36:05 GMT-0300 (Atlantic Daylight Time)'),
  (6, 11, '4th treatment', '100.00', '0.00', 1, 2, '4th remark', 'in-progress', 'Thu Jul 09 2026 13:54:09 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 09 2026 13:54:09 GMT-0300 (Atlantic Daylight Time)'),
  (7, 11, 'facial', '100.00', '0.00', 1, 2, 'remark la remarremark la remark la remark la remark la remark la remark la remark la remark la remark la remark la r
emark la k la ', 'in-progress', 'Thu Jul 09 2026 14:02:58 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 01:05:35 GMT-0300 (Atlantic Daylight Time)'),
  (8, 11, 'treatment 3', '100.00', '0.00', 1, 2, 'bfhbaeiufbeufbuea', 'in-progress', 'Thu Jul 09 2026 14:10:16 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 01:05:42 GMT-0300 (Atlantic Daylight Time)'),
  (9, 13, 'treatment4', '100.00', '0.00', 1, 2, 'remark', 'in-progress', 'Thu Jul 09 2026 14:11:15 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 09 2026 14:11:15 GMT-0300 (Atlantic Daylight Time)'),
  (14, 11, '5 th treatment ', '100.00', '0.00', 1, 2, 'remark la ', 'in-progress', 'Thu Jul 09 2026 14:24:16 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 09 2026 14:24:16 GMT-0300 (Atlantic Daylight Time)'),
  (15, 11, 'test6', '100.00', '0.00', 1, 2, 'remark', 'in-progress', 'Fri Jul 10 2026 12:40:22 GMT-0300 (Atlantic Daylight Time)', 'Fri Jul 10 2026 12:40:22 GMT-0300 (Atlantic Daylight Time)'),
  (16, 11, 'treatment 7', '100.00', '0.00', 1, 2, 'r7', 'in-progress', 'Fri Jul 10 2026 12:43:05 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:04:52 GMT-0300 (Atlantic Daylight Time)'),
  (17, 11, 'treatment 6', '100.00', '0.00', 1, 2, 'r8', 'in-progress', 'Fri Jul 10 2026 12:47:16 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:05:04 GMT-0300 (Atlantic Daylight Time)'),
  (18, 11, 'treatment 9', '100.00', '0.00', 1, 2, 'r8', 'in-progress', 'Fri Jul 10 2026 12:50:43 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:05:21 GMT-0300 (Atlantic Daylight Time)'),
  (19, 11, 'treatment 8', '100.00', '0.00', 1, 2, 't8', 'in-progress', 'Fri Jul 10 2026 12:51:36 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:04:41 GMT-0300 (Atlantic Daylight Time)'),
  (24, 11, 'treatment 12', '101.00', '0.00', 3, 2, 'wowoowow', 'in-progress', 'Tue Jul 14 2026 01:46:02 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:04:34 GMT-0300 (Atlantic Daylight Time)'),
  (25, 12, 't1', '100.00', '0.00', 1, 2, 'remark', 'in-progress', 'Wed Jul 15 2026 12:50:50 GMT-0300 (Atlantic Daylight Time)', 'Wed Jul 15 2026 12:50:50 GMT-0300 (Atlantic Daylight Time)'),
  (26, 11, 'treatment 13', '100.00', '0.00', 8, 2, 'remark', 'in-progress', 'Thu Jul 16 2026 13:49:51 GMT-0300 (Atlantic Daylight Time)', 'Thu Jul 16 2026 15:04:22 GMT-0300 (Atlantic Daylight Time)');



/*
 Navicat Premium Data Transfer

 Source Server         : 15
 Source Server Type    : MySQL
 Source Server Version : 50719
 Source Host           : localhost:3306
 Source Schema         : fp

 Target Server Type    : MySQL
 Target Server Version : 50719
 File Encoding         : 65001

 Date: 11/10/2019 21:44:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for b_admin
-- ----------------------------
DROP TABLE IF EXISTS `b_admin`;
CREATE TABLE `b_admin`  (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `user` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(90) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of b_admin
-- ----------------------------
INSERT INTO `b_admin` VALUES (1, 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');
INSERT INTO `b_admin` VALUES (2, 'admin2', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92');

-- ----------------------------
-- Table structure for b_items
-- ----------------------------
DROP TABLE IF EXISTS `b_items`;
CREATE TABLE `b_items`  (
  `item_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `item_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id` int(11) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of b_items
-- ----------------------------
INSERT INTO `b_items` VALUES ('http://www.baidu.com', '事项1', 1);
INSERT INTO `b_items` VALUES ('http://www.qidian.com', '事项2', 2);
INSERT INTO `b_items` VALUES ('http://www.baidu.com', '事项3', 3);

-- ----------------------------
-- Table structure for b_keys
-- ----------------------------
DROP TABLE IF EXISTS `b_keys`;
CREATE TABLE `b_keys`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_id` int(11) NULL DEFAULT NULL,
  `key_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of b_keys
-- ----------------------------
INSERT INTO `b_keys` VALUES (1, 1, '百度');
INSERT INTO `b_keys` VALUES (2, 2, '常用语');
INSERT INTO `b_keys` VALUES (3, 3, '哈哈');
INSERT INTO `b_keys` VALUES (4, 3, '喂喂喂');
INSERT INTO `b_keys` VALUES (5, 2, '哈哈');
INSERT INTO `b_keys` VALUES (6, 1, '你好');

-- ----------------------------
-- Table structure for b_nokeys
-- ----------------------------
DROP TABLE IF EXISTS `b_nokeys`;
CREATE TABLE `b_nokeys`  (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `item_id` int(3) NULL DEFAULT NULL,
  `key_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of b_nokeys
-- ----------------------------
INSERT INTO `b_nokeys` VALUES (1, 3, '喂喂喂');
INSERT INTO `b_nokeys` VALUES (2, NULL, '能用语音');
INSERT INTO `b_nokeys` VALUES (3, NULL, '哈哈哈');
INSERT INTO `b_nokeys` VALUES (4, NULL, '哎哟');
INSERT INTO `b_nokeys` VALUES (5, NULL, '我操');

SET FOREIGN_KEY_CHECKS = 1;

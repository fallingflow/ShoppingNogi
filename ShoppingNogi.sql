SELECT * FROM ShoppingNogi.item;DROP DATABASE IF EXISTS `ShoppingNogi`;
CREATE database `ShoppingNogi`;
USE `ShoppingNogi`;

CREATE TABLE `category`(
  `category_id` INT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`category_id`)
  );

CREATE TABLE `item`(
  `item_id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `item_name` VARCHAR(200) NOT NULL,
  `item_display_name` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`item_id`),
  FOREIGN KEY (`category_id`) references `category`
  );

CREATE TABLE `item_option`(
  `item_id` INT NOT NULL,
  `option_type` VARCHAR(40),
  `option_sub_type` VARCHAR(40),
  `option_value` VARCHAR(40),
  `option_value2` VARCHAR(40),
  `option_desc` VARCHAR(500),
  FOREIGN KEY (`item_id`) references `item`
  );

CREATE TABLE `auction_history`(
  `auction_buy_id` INT NOT NULL,
  `date_auction_buy` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`auction_buy_id`)
  );

CREATE TABLE `auction_history_desc`(
  `item_id` INT NOT NULL,
  `auction_buy_id` INT NOT NULL,
  `auction_price_per_unit` INT NOT NULL,
  `item_count` INT NOT NULL,
  FOREIGN KEY (`item_id`) references `item`,
  FOREIGN KEY (`auction_buy_id`) references `auction_history`  
  );

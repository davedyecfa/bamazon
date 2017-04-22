create table bamazon.products
(
	item_id int not null auto_increment
		primary key,
	product_name varchar(30) not null,
	department_name varchar(30) not null,
	price int(6) not null,
	stock_quantity int(2) not null
)
;


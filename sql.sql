create or replace function get_products(t character varying)
returns setof products
AS 
$$
	select * from products where title = t;
$$
language sql

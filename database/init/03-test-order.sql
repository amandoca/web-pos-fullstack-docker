USE web_pos;

INSERT INTO orders (
    user_id,
    payment_method_id,
    status,
    subtotal,
    fee,
    total
) VALUES (
    2,
    1,
    'completed',
    57.20,
    3.43,
    60.63
);

INSERT INTO order_items (
    order_id,
    product_id,
    product_title,
    size_name,
    unit_price,
    quantity,
    total_price
) VALUES
(1, 6, 'Shake de Abacate', 'medium', 19.40, 1, 19.40),
(1, 9, 'Panqueca', NULL, 18.90, 2, 37.80);

INSERT INTO order_item_addons (
    order_item_id,
    addon_id,
    addon_name,
    addon_price
) VALUES
(1, 4, 'whipped_cream', 2.50);

UPDATE products
SET stock = stock - 1
WHERE id = 6 AND stock >= 1;

UPDATE products
SET stock = stock - 2
WHERE id = 9 AND stock >= 2;

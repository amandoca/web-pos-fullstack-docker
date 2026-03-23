USE web_pos;

INSERT INTO categories (name) VALUES
('meats'),
('hamburgers'),
('pizzas'),
('drinks'),
('desserts'),
('snacks'),
('pasta'),
('salads');

INSERT INTO payment_methods (name) VALUES
('cash'),
('debit_card'),
('credit_card'),
('pix');

INSERT INTO users (name, username, password_hash, role) VALUES
('Administrator', 'admin', 'TEMP_HASH_ADMIN', 'ADMINISTRADOR'),
('Operator', 'operator', 'TEMP_HASH_OPERATOR', 'OPERADOR');

INSERT INTO products (
    category_id,
    title,
    description,
    image_url,
    base_price,
    stock,
    is_available,
    has_sizes
) VALUES
(1, 'Frango Grelhado (Chop)', 'frango, ovo, cogumelos, salada', '/images/product-1.jpg', 32.90, 10, TRUE, FALSE),
(1, 'Costeleta de Porco Grelhada', 'porco, ovo, cogumelos, salada', '/images/product-2.jpg', 36.90, 10, TRUE, FALSE),
(7, 'Capellini ao Molho de Tomate', 'espaguete fino, tomate, cogumelos', '/images/product-3.jpg', 27.90, 10, TRUE, FALSE),
(8, 'Bowl de Salada Vegana', 'maçã, cenoura, tomate', '/images/product-4.jpg', 24.90, 10, TRUE, FALSE),
(3, 'Pizza Havaiana', 'pizza, carne de caranguejo, abacaxi', '/images/product-5.jpg', 44.90, 10, TRUE, FALSE),
(4, 'Shake de Abacate', 'abacate, leite, baunilha', '/images/product-6.jpg', 14.90, 10, TRUE, TRUE),
(4, 'Café Latte', 'espresso, leite', '/images/product-7.jpg', 9.90, 10, TRUE, TRUE),
(4, 'Suco Detox Vitamina C', 'damasco, maçã, cenoura e gengibre', '/images/product-8.jpg', 12.90, 10, TRUE, TRUE),
(6, 'Panqueca', 'sem lactose, ovo, fermento, açúcar, farinha de trigo', '/images/product-9.jpg', 18.90, 10, TRUE, FALSE),
(6, 'Sopa de Cogumelos', 'leite evaporado, vinho marsala, caldo de carne, caldo de frango, manteiga', '/images/product-10.jpg', 19.90, 10, TRUE, FALSE),
(1, 'Asas de Frango Assadas', 'asas de frango, molho A1, mel, pimenta caiena', '/images/product-11.jpg', 29.90, 10, TRUE, FALSE),
(7, 'Espaguete Vegetariano', 'abobrinha amarela, massa, pimentão vermelho assado, abobrinha', '/images/product-12.jpg', 26.90, 10, TRUE, FALSE),
(5, 'Casquinha de Sorvete de Baunilha', 'sorvete de baunilha, casquinha crocante', '/images/product-13.jpg', 8.90, 10, TRUE, FALSE),
(5, 'Macarons Coloridos', 'farinha de amêndoas, açúcar, recheio cremoso', '/images/product-14.jpg', 12.90, 10, TRUE, FALSE),
(5, 'Donuts com Cobertura', 'massa doce, cobertura colorida, confeitos', '/images/product-15.jpg', 10.90, 10, TRUE, FALSE),
(5, 'Cupcakes com Glacê', 'massa de baunilha, glacê cremoso, confeitos', '/images/product-16.jpg', 11.90, 10, TRUE, FALSE);

INSERT INTO product_sizes (product_id, name, extra_price) VALUES
(6, 'small', 0.00),
(6, 'medium', 2.00),
(6, 'large', 4.00),
(7, 'small', 0.00),
(7, 'medium', 1.50),
(7, 'large', 3.00),
(8, 'small', 0.00),
(8, 'medium', 2.00),
(8, 'large', 4.00);

INSERT INTO addons (name, price) VALUES
('extra_cheese', 3.00),
('onion', 1.50),
('bacon', 4.00),
('whipped_cream', 2.50),
('extra_sauce', 2.00);

INSERT INTO product_addons (product_id, addon_id) VALUES
(5, 1),
(5, 2),
(5, 3),
(6, 4),
(7, 4),
(9, 1),
(9, 5),
(10, 5),
(11, 5);

-- Restaurantes
INSERT INTO restaurant (id, name, location) VALUES
    (1, 'Cantina Santiago', 'Edifício A'),
    (2, 'Cantina Crasto', 'Pavilhão B'),
    (3, 'Cantina Grelhados', 'Bloco C');

-- Cantina 1 - Cantina Santiago
INSERT INTO meal (date, description, restaurant_id, type) VALUES
    ('2025-04-10', 'Arroz de Pato', 1, 'ALMOCO'),
    ('2025-04-10', 'Bacalhau com Natas', 1, 'JANTAR'),
    ('2025-04-11', 'Frango Assado', 1, 'ALMOCO'),
    ('2025-04-11', 'Esparguete à Bolonhesa', 1, 'JANTAR'),
    ('2025-04-12', 'Rojões à Moda do Minho', 1, 'ALMOCO'),
    ('2025-04-12', 'Pizza de Legumes', 1, 'JANTAR'),
    ('2025-04-13', 'Empadão de Carne', 1, 'ALMOCO'),
    ('2025-04-13', 'Lasanha de Frango', 1, 'JANTAR'),
    ('2025-04-14', 'Carne de Porco à Alentejana', 1, 'ALMOCO'),
    ('2025-04-14', 'Tagliatelle de Camarão', 1, 'JANTAR'),
    ('2025-04-15', 'Sopa Juliana + Rissóis', 1, 'ALMOCO'),
    ('2025-04-15', 'Crepes de Frango', 1, 'JANTAR');

-- Cantina 2 - Cantina Crasto
INSERT INTO meal (date, description, restaurant_id, type) VALUES
    ('2025-04-10', 'Feijoada à Transmontana', 2, 'ALMOCO'),
    ('2025-04-10', 'Salada de Atum', 2, 'JANTAR'),
    ('2025-04-11', 'Strogonoff de Frango', 2, 'ALMOCO'),
    ('2025-04-11', 'Omelete com Legumes', 2, 'JANTAR'),
    ('2025-04-12', 'Douradinhos com Arroz', 2, 'ALMOCO'),
    ('2025-04-12', 'Sopa + Wrap de Frango', 2, 'JANTAR'),
    ('2025-04-13', 'Almondegas com Puré', 2, 'ALMOCO'),
    ('2025-04-13', 'Hambúrguer no Prato', 2, 'JANTAR'),
    ('2025-04-14', 'Lentilhas Estufadas', 2, 'ALMOCO'),
    ('2025-04-14', 'Frittata de Legumes', 2, 'JANTAR'),
    ('2025-04-15', 'Bifanas com Arroz', 2, 'ALMOCO'),
    ('2025-04-15', 'Panados de Frango no Forno', 2, 'JANTAR');

-- Cantina 3 - Cantina Grelhados
INSERT INTO meal (date, description, restaurant_id, type) VALUES
    ('2025-04-10', 'Tofu Grelhado com Legumes', 3, 'ALMOCO'),
    ('2025-04-10', 'Cuscuz com Legumes', 3, 'JANTAR'),
    ('2025-04-11', 'Frango Thai com Arroz', 3, 'ALMOCO'),
    ('2025-04-11', 'Risotto de Cogumelos', 3, 'JANTAR'),
    ('2025-04-12', 'Hambúrguer de Lentilhas', 3, 'ALMOCO'),
    ('2025-04-12', 'Sopa Verde + Tosta Integral', 3, 'JANTAR'),
    ('2025-04-13', 'Grão com Espinafres', 3, 'ALMOCO'),
    ('2025-04-13', 'Ratatouille com Arroz', 3, 'JANTAR'),
    ('2025-04-14', 'Grelhada Mista', 3, 'ALMOCO'),
    ('2025-04-14', 'Espetadas de Peru', 3, 'JANTAR'),
    ('2025-04-15', 'Salmão Grelhado com Legumes', 3, 'ALMOCO'),
    ('2025-04-15', 'Tarte de Legumes', 3, 'JANTAR');

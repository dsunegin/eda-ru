CREATE DATABASE recipe CHARACTER SET utf8 COLLATE utf8_general_ci;
create user recipe_user@localhost;
set password for recipe_user@localhost=password('psw_recipe_user');
grant all on recipe.* to recipe_user@localhost with grant option;

use recipe;

CREATE TABLE edaru (
id INT(7) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
recipeCategory VARCHAR(255) NOT NULL,
recipeCuisine VARCHAR(255) NOT NULL,
datePublished DATETIME,
cookTime VARCHAR(63),
prepTime VARCHAR(63),
totalTime VARCHAR(63),
description TEXT,
keywords TEXT,
nutrition TEXT,
ingredients TEXT,
recipeInstructions TEXT,
recipeIngredient TEXT,
recipeYield INT(4) UNSIGNED,
url TEXT,
publisher TEXT,
video TEXT,
image TEXT,

ratingValue float UNSIGNED,
bestRating INT(1) UNSIGNED,
worstRating INT(1) UNSIGNED,
reviewCount INT(5) UNSIGNED,
aggregateRating TEXT,
author TEXT

);



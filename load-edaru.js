"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const eda = require('./afisha-eda');
const mysql = require("mysql2");
const envconf = require('dotenv').config();
if (envconf.error) {
    throw envconf.error;
}
; // ERROR if Config .env file is missing
const connectionRECIPE = mysql.createConnection({
    host: process.env.DB_RECIPEHOST,
    port: process.env.DB_RECIPEPORT,
    user: process.env.DB_RECIPEUSER,
    database: process.env.DB_RECIPEDATABASE,
    password: process.env.DB_RECIPEPASSWORD
}).promise();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let page = 1;
    while (page > 0) {
        try {
            const recArr = yield getRecipesPage(page);
            for (let i = 0, reci; reci = recArr[i]; ++i) {
                const sqls = `SELECT * FROM edaru WHERE url='${reci.url}'`;
                const ress = yield connectionRECIPE.query(sqls);
                if (ress[0].length > 0) {
                    console.log('Present in DB: ' + reci.url);
                    yield delay(1000);
                    continue;
                }
                const recipe = yield getRecipe(reci.url);
                if (!recipe) {
                    yield delay(1000);
                    continue;
                }
                ;
                console.log(recipe.name);
                const rVideo = recipe.video ? JSON.stringify(recipe.video) : '';
                const rImage = recipe.video ? recipe.image : '';
                const sqli = "INSERT INTO edaru (name, recipeCategory, recipeCuisine, datePublished, cookTime, prepTime, totalTime, description, keywords, " +
                    "nutrition, ingredients, recipeInstructions, recipeIngredient, " +
                    "recipeYield, url, publisher, video, image, ratingValue, bestRating, worstRating, reviewCount, aggregateRating, author) " +
                    " VALUES (?,?,?,?,?,?,?,?,?," +
                    "?,?,?,?," +
                    "?,?,?,?,?,?,?,?,?,?,? )";
                const recipeItem = [recipe.name, recipe.recipeCategory, recipe.recipeCuisine, recipe.datePublished, recipe.cookTime, recipe.prepTime, recipe.totalTime, recipe.description, recipe.keywords,
                    JSON.stringify(recipe.nutrition), JSON.stringify(recipe.ingredients), JSON.stringify(recipe.recipeInstructions), JSON.stringify(recipe.recipeIngredient),
                    recipe.recipeYield, reci.url, JSON.stringify(recipe.publisher), rVideo, rImage, recipe.aggregateRating.ratingValue, recipe.aggregateRating.bestRating, recipe.aggregateRating.worstRating, recipe.aggregateRating.reviewCount, JSON.stringify(recipe.aggregateRating), JSON.stringify(recipe.author)];
                const resi = yield connectionRECIPE.query(sqli, recipeItem);
                //break;
                yield delay(3000);
            }
            console.log(`Page: ${page}`);
            page++;
            //break;
        }
        catch (err) {
            console.log(err);
            if (err.status = 500)
                page = -1;
            return "Proceed";
        }
        yield delay(3000);
    } // end while
});
main()
    .then(created => console.log(created))
    .catch(err => console.error(err));
function getRecipesPage(page) {
    return new Promise((resolve, reject) => {
        eda.getRecipes({ page: page }, function (err, recipes) {
            if (err) {
                reject(err);
            }
            resolve(recipes);
        });
    });
}
function getRecipe(href) {
    return new Promise((resolve, reject) => {
        eda.getRecipe({ href: href }, function (err, recipes) {
            if (err) {
                reject(err);
            }
            resolve(recipes);
        });
    });
}
/*
getRecipesPage(1).then(recipes => {
    // ваши действия
    console.log(recipes);
}).catch(err => {
    console.error(err);
});
*/
const delay = (ms) => { return new Promise((resolve) => { setTimeout(resolve, ms); }); };
//# sourceMappingURL=load-edaru.js.map
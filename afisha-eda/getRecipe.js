const cheerio = require('cheerio');
const request = require('request');

String.prototype.textToNumber = function() { return Number(this.replace(',', '.'));}
function textToNumber(text) {  return Number(text.replace(',', '.'));}

function getRecipe(params, callback) {
  request(`https://eda.ru${params.href}`, (err, res, body) => {
    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(body);
        const id = $('section.recipe').data('recipe-id');
        const name = $('h1.recipe__name').text().replace(/(\r\n|\n|\r)/gm, "").trim();

        const ingredientsList = $('div.ingredients-list').first();
        const ingredients = ingredientsList.find('.ingredients-list__content-item.content-item.js-cart-ingredients').map((i, ingredient) => {
            const ingredientObj = $(ingredient).data('ingredient-object');
            return {
                id:     ingredientObj.id,
                name:   ingredientObj.name,
                amount: ingredientObj.amount
            }
        }).get();
        
        let ldObj, keywords, description, category, cuisine, ratingValue, reviewCount, Time, datePublished,
            Yield, calories, protein, fat, carbohydrate;
        const ldJson = $('script[type="application/ld+json"]').text();
        if (ldJson.length == 0) {
            callback(err, null);
            /*keywords = $('meta[itemprop=keywords]').attr('content');
            description = $('meta[itemprop=description]').attr('content');
            category = $('meta[itemprop=recipeCategory]').attr('content');
            cuisine = $('meta[itemprop=recipeCuisine]').attr('content');

            ratingValue = $('meta[itemprop=ratingValue]').attr('content').textToNumber();
            reviewCount = $('meta[itemprop=reviewCount]').attr('content');

            Time = $('span[itemprop=cookTime]').attr('content');
            Yield = + $('span[itemprop=recipeYield]').text();

            const energyList = $('ul.nutrition__list');
            calories =  energyList.find('span[itemprop=calories]').text().textToNumber();
            protein =  energyList.find('span[itemprop=proteinContent]').text().textToNumber();
            fat =  energyList.find('span[itemprop=fatContent]').text().textToNumber();
            carbohydrate =  energyList.find('span[itemprop=carbohydrateContent]').text().textToNumber();*/
        }
        else {
            ldObj = JSON.parse(ldJson);
            callback(err, {...ldObj,ingredients});

            /*datePublished = ldObj.datePublished;
            keywords =ldObj.keywords;
            description = ldObj.description;
            category = ldObj.recipeCategory;
            cuisine = ldObj.recipeCuisine;

            ratingValue = ldObj.aggregateRating.ratingValue;
            reviewCount = ldObj.aggregateRating.reviewCount;

            Time = ldObj.cookTime;
            Yield = ldObj.recipeYield;

            calories = ldObj.nutrition.calories;
            fat = ldObj.nutrition.fatContent;
            carbohydrate = ldObj.nutrition.carbohydrateContent;
            protein = ldObj.nutrition.proteinContent;*/
        }




        

       /* let instructionList = [];
            $('.instruction__description.js-steps__description').each((i, li) => {
            const step = $(li).find('span[itemprop=text]').text();
                instructionList.push(step);
            }).get();*/
            //const  instructionListObj= {...instructionList};




      /*const recipe = {
        id,
        href:          params.href,
        name,
          keywords,
          description,
          category,
          cuisine,

          Yield,
          Time,

          ratingValue,
          reviewCount,

        calories,
        protein,
        carbohydrate,
        fat,

        ingredients,
        instruction: instructionList
      }*/

      //callback(err, recipe);
    } else {
      callback({
        error: err,
        status: res.statusCode
      }, null);
    }
  });
}

module.exports = getRecipe;

const cheerio = require('cheerio');
const request = require('request');

function getRecipes(params, callback) {
  let url;

  if (params.category && params.page) {
    url = `https://eda.ru/recepty/${params.category}?page=${params.page}`
  } else if (!params.category && params.page) {
    url = `https://eda.ru/recepty?page=${params.page}`;
  } else {
    callback({
      error: 'Wrong type of params. Try again.'
    }, null);
    return;
  }

  request(url, (err, res, body) => {

    if (!err && res.statusCode == 200) {
      const $ = cheerio.load(body);

      const recipes = $('div.tile-list__horizontal-tile.horizontal-tile.js-portions-count-parent').map(function (i, recipe) {

        const id = $(this)
          .find('.portions-control__count')
          .data('recipe-id')

        const url = $(this)
          .find('.horizontal-tile__item-link')
          .data('href');


        return {
          id,
          url

        }
      }).get();

      callback(err, recipes);
    } else {
      callback({
        error: err,
        status: res.statusCode
      }, null);
    }
  });
}

module.exports = getRecipes;


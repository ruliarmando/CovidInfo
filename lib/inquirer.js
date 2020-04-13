const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const fs = require('fs');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const countriesContent = fs.readFileSync('countries.txt');
const countriesContentToString = countriesContent.toString('utf8'); // convert buffer to string
const countries = countriesContentToString.split('\n');

const provincesContent = fs.readFileSync('provinces.txt');
const provincesContentToString = provincesContent.toString('utf8'); // convert buffer to string
const provinces = provincesContentToString.split('\n');

function searchCountry(answers, input) {
  input = input || '';
  return new Promise((resolve) => {
    const fuzzyResult = fuzzy.filter(input, countries);
    resolve(fuzzyResult.map((el) => el.original));
  });
}

function searchProvince(answers, input) {
  input = input || '';
  return new Promise((resolve) => {
    const fuzzyResult = fuzzy.filter(input, provinces);
    resolve(fuzzyResult.map((el) => el.original));
  });
}

module.exports = {
  askGlobalorCountry: () => {
    return inquirer.prompt({
      type: 'list',
      name: 'scope',
      message: 'Ingin melihat data global atau per negara?',
      choices: ['global', 'negara'],
      default: 'global'
    });
  },

  askWhichCountry: () => {
    const questions = [
      {
        type: 'autocomplete',
        name: 'country',
        message: 'Ketik nama negara yang ingin dilihat:',
        source: searchCountry,
      },
      {
        type: 'list',
        name: 'nationalOrProvince',
        message: 'Ingin melihat data keseluruhan atau provinsi?',
        choices: ['nasional', 'provinsi'],
        default: 'nasional',
        when: function(answers) {
          return answers.country === 'Indonesia';
        }
      },
      {
        type: 'autocomplete',
        name: 'province',
        message: 'Ketik nama provinsi di Indonesia:',
        source: searchProvince,
        when: function(answers) {
          return answers.nationalOrProvince === 'provinsi';
        }
      }
    ];

    return inquirer.prompt(questions);
  }
}

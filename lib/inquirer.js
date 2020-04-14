const inquirer = require('inquirer');
const fuzzy = require('fuzzy');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const countries = require('./countries');
const provinces = require('./provinces');

function createSearchFor(scope) {
  return function search(_, input) {
    input = input || '';
    return new Promise((resolve) => {
      const source = scope === 'country' ? countries : provinces;
      const fuzzyResult = fuzzy.filter(input, source);
      resolve(fuzzyResult.map((el) => el.original));
    });
  }
}

module.exports = {
  askQuestions: () => {
    const questions = [
      {
        type: 'list',
        name: 'scope',
        message: 'Ingin melihat data global atau per negara?',
        choices: ['global', 'negara'],
        default: 'global'
      },
      {
        type: 'autocomplete',
        name: 'country',
        message: 'Ketik nama negara yang ingin dilihat:',
        source: createSearchFor('country'),
        when: function({ scope }) {
          return scope === 'negara';
        }
      },
      {
        type: 'list',
        name: 'nationalOrProvince',
        message: 'Ingin melihat data nasional atau provinsi?',
        choices: ['nasional', 'provinsi'],
        default: 'nasional',
        when: function({ country }) {
          return country === 'Indonesia';
        }
      },
      {
        type: 'autocomplete',
        name: 'province',
        message: 'Ketik nama provinsi di Indonesia:',
        source: createSearchFor('province'),
        when: function({ nationalOrProvince }) {
          return nationalOrProvince === 'provinsi';
        }
      }
    ];

    return inquirer.prompt(questions);
  }
}

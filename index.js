#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const Table = require('tty-table');
const Spinner = require('clui').Spinner;

const inquirer = require('./lib/inquirer');
const api = require('./lib/api');

clear();

// Display banner
console.log(chalk.yellow(figlet.textSync('CovidInfo', { horizontalLayout: 'default' })));

// For fetching and displaying the data
const displayData = async (loader, label) => {
  const status = new Spinner('Mengambil data...');
  status.start();
  const data = await loader();
  status.stop();
  const header = [
    { value: 'positif', alias: 'Positif', headerColor: 'red', color: 'red' },
    { value: 'sembuh', alias: 'Sembuh', headerColor: 'green', color: 'green' },
    { value: 'meninggal', alias: 'Meninggal', headerColor: 'grey', color: 'grey' },
  ];
  const table = Table(header, data);
  console.log('\n');
  console.log(chalk.blue(label));
  console.log(table.render());
};

// Main function
const run = async () => {
  const { scope, country, province, nationalOrProvince } = await inquirer.askQuestions();

  if (scope === 'global') {
    displayData(api.getGlobalData, 'Data kasus corona global saat ini:');
  } else {
    if (country === 'Indonesia') {
      if (nationalOrProvince === 'nasional') {
        displayData(api.getNationalData, 'Data kasus corona nasional saat ini:');
      } else {
        const loader = () => { return api.getProvinceData(province) };
        displayData(loader, `Data kasus corona di ${province} saat ini:`);
      }
    } else {
      const loader = () => { return api.getCountryData(country) };
      displayData(loader, `Data kasus corona di ${country} saat ini:`);
    }
  }
};

run();

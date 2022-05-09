#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const chalk = require("chalk");
const logSymbols = require('log-symbols')
const cliProgress = require('cli-progress');

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.legacy);

const CURR_DIR = process.cwd();
const CHOICES = fs.readdirSync(`${__dirname}/templates`);
let count = 0;

const QUESTIONS = [
  {
    name: "project-choice",
    type: "list",
    message: chalk.yellowBright("What project template would you like to generate?"),
    choices: CHOICES,
  },
  {
    name: "project-name",
    type: "input",
    message: chalk.yellowBright("Project name:"),
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else
        return (`${logSymbols.warning} Project name may only include letters, numbers, underscores and hashes.`);
    },
  },
];

console.clear();
console.log("Welcome to "+chalk.cyan.bgBlack.underline("Super Charged Hardhat "+"🚀"));

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const templatePath = `${__dirname}/templates/${projectChoice}`;
  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  totalFiles(templatePath)
  bar1.start(count, 0);

  createDirectoryContents(templatePath, projectName);

  bar1.stop()

  console.log(logSymbols.success,"Created successfully!")
});

const totalFiles = (templatePath) => {
    const filesInFolder = fs.readdirSync(templatePath)
    filesInFolder.forEach((file) => {
        const stats = fs.statSync(`${templatePath}/${file}`)
        if ( stats.isFile() ) {
            count +=1
        } else if ( stats.isDirectory() ){
            totalFiles(`${templatePath}/${file}`)
        }
    })
}

const createDirectoryContents = (templatePath, newProjectPath) => {
  const filesToCreate = fs.readdirSync(templatePath);
  
  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      if (file === ".npmignore") file = ".gitignore";

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
      bar1.increment()
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      // recursive call
      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
    
  });
  
};

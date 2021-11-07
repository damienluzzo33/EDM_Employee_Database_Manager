# EDM_Employee_Database_Manager

## Description

The work of a business owner can be tough. Whether you own a 5-star hotel, are leading a software development team, or keeping trak of your fantasy football team, a good owner needs to know who their employees are, what they are responsible for, and what department they work within. Many owners will also need to keep track of management hierarchy, recently hired employees, etc. With so much to keep track of, what can an owner do to stay on top of it all. This is where EDM steps in.

EDM is an employee database manager that allows you to get information about employees, to modify employee roles, to remove employees, and even keep track of your hiring expenses. This application was developed for anyone looking to get organized and to view and modify employee data on demand. 

You don't need anything special to get this app up and running for yourself. Simply grab MySQL and this repository and put them on your local system, then open up the command line and let the magic happen. Tired of paperwork? Are you "over it" when it comes to organizing employee data. This app will efficiently and effectively ease your organizational frustrations.

If you are interested in improving or modifying this application for your own personal usage, please go ahead and clone down the repository and transform it into your own amazing employee database management application.

[Link to video demo of app](https://drive.google.com/file/d/1phzGNOFIaAyhKt32A2bgqo7njCB4Kpok/view)

![Giphy demo of project](./images/edm_demo2.gif)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)
- [Examples/Tests](#examples)

## Installation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

- To install the app, simply clone down this repository to your local machine. You will also need to have MySQL installed locally I encourage you to have the MySQL Workbench installed as well. 

## Usage

- To use the application, just navigate to the cloned down repository, and run "npm i" to get the necessary node modules

- When installed, first go to the root level of the EMD_EMPLOYEE_DATABASE_MANAGER repository folder and open up the command line. After get into the mysql CLI by running mysql -u {{username}} -p and entering you password when prompted. You can also copy and paste the schema SQL code into the MySQL Workbench and run it there. 

- Next, you will need to seed the database by either repeating the copy and paste method using MySQL Workbench or by running SOURCE db/seeds.sql from the mysql command line. 

- Now you can get the application running by quitting out of mysql with "quit". Then you can get start it up by typing "node index.js" into your command line. From there you will be prompted with options with what you'd like to do with your database.

## Credits

Main Assets:

+ [inquirer by Simon Boudrias](https://github.com/SBoudrias/Inquirer.js)

+ [console-table-printer by ayonious](https://github.com/ayonious/console-table-printer)

+ [mysql2 by sidorares](https://github.com/sidorares/node-mysql2)

Tutorials:

+ [How To Use Inquirer.js](https://javascript.plainenglish.io/how-to-inquirer-js-c10a4e05ef1f)

## License

+ MIT

## Features

+ User is able to submit responses to various prompts that will be used to generate, modify, and delete employees, roles, and departments.

+ Prompts are dynamic and allow the user to enter as many addition, alterations, and subtractions as they please. If the user is finished they simply choose the "quit" option from the menu.

+ The user also has the ability to view employees based on their manager or by department. As a final addition, users can track the total budget of each department.

+ Each time the user carries through with an action, a table is displayed to show the results of each successfully executed prompt. 

## How to Contribute

If you would like to contribute to this Employee Database Manager project, please feel free to clone or fork this repository and implement your desired improvements. Once your improvements have been made and the app has been tested properly, please feel free to send me a message on github with a short summary of the changes you've made and I will invite you to be a collaborator.

## Examples

Validators are in place to prevent you from inputting incorrect response types, so all you have to do to use this application is follow the prompts and submit your responses to the questions.

To see an example for how to answer the questions, and what using the app should look like, please refer to the video, giphy, and screenshots in the description above.

## Questions

Connect with me on GitHub: [damienluzzo33](https://www.github.com/damienluzzo33)

Shoot me an email: [damienluzzo33@gmail.com](mailto:damienluzzo33@gmail.com)
const mysql = require('mysql')
const inquirer = require('inquirer')

function choiceFn(choice) {
    switch (choice) {
        case "View All Employees": 
            viewAll()
            break;
        case "View Employees by Department":
            viewByDept()
            break;
        case "View Employees by Manager": 
            viewByManager()
            break;
        case "Add Employee": 
            addEmp()
            break;
        case "Remove Employee": 
            removeEmp()
            break;
        case "Update Employee Role": 
            updateRole()
            break;
        case "Update Employee Manager": 
            updateManager() 
            break;
        case "Exit":
            console.log("exiting")
            break; 
        
        
        default: 
            console.log("defaulting, probably an error")
    }
}

function viewAll() {
    console.log("Displaying All Employees")

    mainMenu()
}

function viewByDept() {
    console.log("Displaying Employees by Department")

    mainMenu()
}

function viewByManager() {
    console.log("view emp by manager")

    mainMenu()
}

function addEmp() {
    const questions = [
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        }, 
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "empRole",
            choices: ["map fn"]
        }, 
        {
            type: "list", 
            message: "Who is the employee's manager?",
            name: "empManager",
            choices: ["map fn"]
        }
    ];
    inquirer
    .prompt(questions)
    .then(answers => {
        console.log(answers)
    })
}

function removeEmp() {
    console.log("rem emp")

    mainMenu()
}

function updateRole() {
    console.log("updating role")

    mainMenu()
}

function updateManager() {
    console.log("updating manager")

    mainMenu()
}

function mainMenu() {
    const questions = [
        {
            type: "list",
            message: "What Would You Like to Do?",
            name: "mainList",
            choices: [
                "View All Employees",
                "View Employees by Department",
                "View Employees by Manager",
                "Add Employee",
                "Remove Employee", 
                "Update Employee Role",
                "Update Employee Manager", 
                "Exit"
            ]
        }
    ];
    inquirer
    .prompt(questions)
    .then(answers => {
        // console.log(answers.mainList)
        choiceFn(answers.mainList)
    })
}

function start() {
    console.log(`
             ---------------------------------------,
            / -----------------------------------/ /|
           / /|? ? SCHRODINGER'S EMPLOYEES ? ? ?/ /*|
          / /*|?     ARE THERE EMPLOYEES      ?/ /**|
         / /**|?          IN HERE            ?/ /***|
        / /***|_?_?_?_?_?_?_?_?_?_?_?_?_?_?_?/ /****|
       / /***/                              / /*****/
      / /***/                              / /*****/
     / /***/                              / /*****/ 
    / /***/                              / /*****/
   / /***/                              / /*****/ 
  / /*_*/_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ / /*****/
 /_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ /*****/
|                                       |****/
|                                       |***/
|                                       |**/
|                        lets hope so...|*/
|---------------------------------------|/
`)
mainMenu()
}
start()
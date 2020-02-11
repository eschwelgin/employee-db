const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table')

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
            connection.end()
            break; 
        
        
        default: 
            console.log("defaulting, probably an error")
    }
}

function viewAll() {
    const sql = `SELECT employee.employee_id, employee.first_name, employee.last_name, department.dept_name, employee_role.title, employee_role.salary
                FROM employee
                LEFT JOIN employee_role ON employee.employee_role = employee_role.role_id
                LEFT JOIN department ON employee_role.department_id = department.department_id
                ORDER BY employee.employee_id ASC`
    connection.query(sql, function (err, result) {
        if (err) { console.log(err) 
        } else {
            console.table(result)
            mainMenu()
        }
    })
}

function viewByDept() {
    const sqlList = `SELECT * FROM department`
    connection.query(sqlList, function (err, result) {
        if (err) { console.log(err) 
        } else {
            // console.log(result)
            let question = [{
                type: "list",
                message: "Which department would you like to view?",
                name: "dept",
                choices: result.map(result => result.dept_name)
            }]
            inquirer
            .prompt(question)
            .then(answer => {
                const sql = `SELECT employee.employee_id, employee.first_name, employee.last_name, department.dept_name, employee_role.title, employee_role.salary
                            FROM employee
                            LEFT JOIN employee_role ON employee.employee_role = employee_role.role_id
                            LEFT JOIN department ON employee_role.department_id = department.department_id
                            WHERE department.dept_name = "${answer.dept}"
                            ORDER BY employee.employee_id ASC`
                connection.query(sql, function (err, result) {
                    if (err) { console.log(err) 
                    } else {
                        console.table(result)
                        mainMenu()
                    }
                })
            })
        }
    })


    // const sql = `` 
    // connection.query(sql, function (err, result) {
    //     if (err) {console.log(err)
    //     } else {
    //         console.log(result)
    //         mainMenu()
    //     }
    // })
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

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "toorTOOR11$$",
    database: "employee_db"
})

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
|                       lets hope so... |****/
|                                       |***/
|                                       |**/
|                                       |*/
|_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|/
`)
    connection.connect(function(err) {
        if (err) { console.log(err) }
        // console.log('Connected to DB')
    })
    mainMenu()
}
start()

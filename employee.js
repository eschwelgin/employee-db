const mysql = require('mysql')
const inquirer = require('inquirer')
const cTable = require('console.table')

function choiceFn(choice) {
    switch (choice) {

        case "View": 
            mainMenu('View')
            break;
        case "Add": 
            mainMenu('Add')
            break;
        case "Remove": 
            mainMenu('Remove')
            break;
        case "Update": 
            mainMenu('Update')
            break;
        case "Back": 
            mainMenu()
            break;
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
        case "View Total Spend by Department":
            totalSpend()
            break;
        case "Add Department":
            addDept()
            break;
        case "Add Employee Role":
            addRole()
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
}

function viewByManager() {
    const sqlList = `SELECT employee.first_name, employee.last_name 
                    FROM employee_role
                    INNER JOIN employee ON employee_role.role_id = employee.employee_role
                    WHERE employee_role.title = "lead developer" OR employee_role.title = "sales manager" OR employee_role.title = "customer support manager"`
    connection.query(sqlList, function (err, result) {
        if (err) { console.log(err) 
        } else { 
            let question = [{ 
                type: "list",
                message: "Who's employees would you like to view?",
                name: "manager",
                choices: result.map(result => result.first_name + ' ' + result.last_name)
            }]
            inquirer
            .prompt(question)
            .then(answer => {
                manager = answer.manager.split(' ')
                const sql = `SELECT e.first_name, e.last_name, r.title, m.first_name manager_first_name, m.last_name manager_last_name-- , d.dept_name
                FROM employee e
                INNER JOIN employee m ON m.employee_id = e.manager_id
                INNER JOIN employee_role r ON e.employee_role = r.role_id
                -- INNER JOIN department d ON r.department_id = d.dept_name
                WHERE m.first_name = "${manager[0]}" AND m.last_name = "${manager[1]}"
                ;`
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
}

function addEmp() {
    const sqlRole = `SELECT * FROM employee_role`
    connection.query(sqlRole, function (err, resultRole) {
        if (err) { console.log(err) 
    } else {
            const role = resultRole
            const sqlManager = `SELECT employee.first_name, employee.last_name, employee_id
                                FROM employee_role
                                INNER JOIN employee ON employee_role.role_id = employee.employee_role
                                WHERE employee_role.title = "lead developer" OR employee_role.title = "sales manager" OR employee_role.title = "customer support manager"`
            connection.query(sqlManager, function (err, resultManager) {
                if (err) {console.log(err) 
                } else {
                    const manager = resultManager
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
                            choices: role.map(role => role.title)
                        }, 
                        {
                            type: "list", 
                            message: "Who is the employee's manager?",
                            name: "empManager",
                            choices: manager.map(manager => manager.first_name + ' ' + manager.last_name)
                        }
                    ];
                    inquirer
                    .prompt(questions)
                    .then(answers => {
                        answer3 = role.find(role => role.title == answers.empRole) //role_id.
                        managerArray = answers.empManager.split(' ')
                        answer4 = manager.find(manager => manager.first_name == managerArray[0] && manager.last_name == managerArray[1])
                        const sqlInsert = `INSERT INTO employee(first_name, last_name, employee_role, manager_id)
                                            VALUES ("${answers.firstName}", "${answers.lastName}", "${answer3.role_id}", "${answer4.employee_id}")`
                        connection.query(sqlInsert, function (err, result) {
                            if (err) {console.log(err) 
                            } else {
                                console.log(`
Employee ${answers.firstName} ${answers.lastName} inserted into database.
                                `)
                                mainMenu()
                            }
                        })
                    })
                }
            })
        }
    })
}

function addDept() {
    console.log("add dept")

    mainMenu()
}

function addRole() {
    console.log("add Role")

    mainMenu()
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

function totalSpend() {
    const sql = `SELECT * FROM department`
    connection.query(sql, function (err, result) {
        if (err) { console.log(err)
        } else {
            const question = [{
                type: "list", 
                message: "For what department would you like to view total spend?",
                name: "deptList", 
                choices: result.map(result => result.dept_name)
            }];
            inquirer
            .prompt(question)
            .then(answer => {
                const sqlSpend = `SELECT * 
                                FROM employee e
                                LEFT JOIN employee_role r ON r.role_id = e.employee_role
                                LEFT JOIN department d ON d.department_id = r.department_id
                                WHERE dept_name = "${answer.deptList}"`
                connection.query(sqlSpend, function (err, result) {
                    if (err) {console.log(err)
                    } else {
                        let salary = result.map(result => result.salary)
                        let total = salary.reduce(function (acc, cur) {
                            return acc + cur
                        }, 0)
                        console.log(`
The ${answer.deptList} department is currently spending $${total}/yr
                        `)
                        mainMenu()
                    }
                })
            })
        }
    })
}

function mainMenu(sel) {
    const questionsMain = [
        {
            type: "list",
            message: "What Would You Like to Do?",
            name: "mainList",
            choices: [
                "View",
                "Add",
                "Remove", 
                "Update",
                "Exit"
            ]
        }
    ];
    const questionsView = [
        {
            type: "list",
            message: "What Would You Like to Do?",
            name: "mainList",
            choices: [
                "View All Employees",
                "View Employees by Department",
                "View Employees by Manager",
                "View Total Spend by Department",
                "Back",
                "Exit"
            ]
        }
    ];
    const questionsAdd = [
        {
            type: "list",
            message: "What Would You Like to Do?",
            name: "mainList",
            choices: [
                "Add Employee",
                "Add Department",
                "Add Employee Role",
                "Back",
                "Exit"
            ]
        }
    ];
    const questionsRemove = [
        {
            type: "list",
            message: "What Would You Like to Do?",
            name: "mainList",
            choices: [
                "Remove Employee",
                "Back",
                "Exit"
            ]
        }
    ];
    const questionsUpdate = [
        {
            type: "list",
            message: "What Would You Like to Do?",
            name: "mainList",
            choices: [
                "Update Employee Role",
                "Update Employee Manager", 
                "Back",
                "Exit"
            ]
        }
    ];
    if (sel === 'View') {
        inquirer
        .prompt(questionsView)
        .then(answers => {
            choiceFn(answers.mainList)
        })
    } else if (sel === 'Add') {
        inquirer
        .prompt(questionsAdd)
        .then(answers => {
            choiceFn(answers.mainList)
        })
    } else if (sel === 'Remove') {
        inquirer
        .prompt(questionsRemove)
        .then(answers => {
            choiceFn(answers.mainList)
        })
    } else if (sel === 'Update') {
        inquirer
        .prompt(questionsUpdate)
        .then(answers => {
            choiceFn(answers.mainList)
        })
    } else {
        inquirer
        .prompt(questionsMain)
        .then(answers => {
            choiceFn(answers.mainList)
        })
    }
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
        console.log('Connected to DB')
        mainMenu()
    })
    
}
start()

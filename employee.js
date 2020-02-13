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
    const sqlList = `SELECT DISTINCT m.employee_id, m.first_name, m.last_name
                    FROM employee e
                    INNER JOIN employee m ON m.employee_id = e.manager_id;`
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
            const sqlManager = `SELECT DISTINCT m.employee_id, m.first_name, m.last_name
                                FROM employee e
                                INNER JOIN employee m ON m.employee_id = e.manager_id;`
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
                                mainMenu('Add')
                            }
                        })
                    })
                }
            })
        }
    })
}

function addDept() {
    const question = [{
        type: "input",
        message: "What department would you like to add?",
        name: "dept"
    }];
    inquirer
    .prompt(question)
    .then(answer => {
        const sql = `INSERT INTO department(dept_name)
                VALUES ("${answer.dept}")`
        connection.query(sql, function (err, result) {
            if (err) {console.log(err)
            } else {
                console.log(`
Added ${answer.dept} to the Department Table
                `)
                mainMenu('Add')
            }
        })
    })
}

function addRole() {
    const sqlDept = `SELECT * FROM department`
    connection.query(sqlDept, function(err, result) {
        if (err) {console.log(err) 
        } else {
            const question = [{
                type: "list",
                message: "What department would you like to add an employee role to?",
                name: "dept",
                choices: result.map(result => result.dept_name)
            }]
            inquirer
            .prompt(question)
            .then(answer => {
                const questions = [{
                    type: "input",
                    message: `What employee role would you like to add to ${answer.dept}?`,
                    name: "role"
                },
                {
                   type: "input",
                   message: "What is the salary for this poition? (enter numbers only)",
                   name: "salary" 
                }]
                inquirer
                .prompt(questions)
                .then(answers => {
                    department = result.find(result => result.dept_name === answer.dept)
                    const sqlInsert = `INSERT INTO employee_role(title, salary, department_id)
                                        VALUES ("${answers.role}", ${answers.salary}, ${department.department_id})`
                    connection.query(sqlInsert, function (err, result) {
                        if (err) {console.log(err)
                        } else {
                            console.log(`
Added ${answers.role} to ${department.dept_name} table
                            `)
                            mainMenu('Add')
                        }
                    })
                })
            })
        }
    })
}

function removeEmp() {
    const sqlEmp = `SELECT employee.employee_id, employee.first_name, employee.last_name, department.dept_name, employee_role.title, employee_role.salary
                    FROM employee
                    LEFT JOIN employee_role ON employee.employee_role = employee_role.role_id
                    LEFT JOIN department ON employee_role.department_id = department.department_id
                    ORDER BY employee.employee_id ASC`
    connection.query(sqlEmp, function (err, result) {
        if (err) {console.log(err) 
        } else {
            console.log('')
            console.table(result)
            const question = [{
                type: "list",
                message: "Which employee would you like to delete?",
                name: "empList",
                choices: result.map(result => result.first_name + ' ' + result.last_name)
            }]
            inquirer
            .prompt(question)
            .then(answer => {
                name = answer.empList.split(' ')
                empObj = result.find(result => result.first_name === name[0] && result.last_name === name[1])
                console.log(empObj.employee_id)
                const sqlDel = `DELETE FROM employee
                                WHERE employee_id = ${empObj.employee_id};`
                console.log(sqlDel)
                connection.query(sqlDel, function (err, result) {
                    if (err) { console.log(err) 
                    } else {
                        console.log(`Deleted employee ${name[0]} ${name[1]} from employee database`)
                        mainMenu()
                    }
                })
            })
        }
    })
}

function updateRole() {
    sqlList = `SELECT * FROM employee_role`
    connection.query(sqlList, function (err, result) {
        if (err) {console.log(err)
        } else {
            const question = [{
                type: "list",
                message: "Which employee role would you like to update?",
                name: "role",
                choices: result.map(result => result.title)
            }]
            inquirer
            .prompt(question)
            .then(answer => {
                const questions = [
                    {
                        type: "input",
                        message: `Updating title for ${answer.role} - Please enter new title`,
                        name: "newTitle"
                    },
                    {
                        type: "input",
                        message: `Updating salary for ${answer.role} - Please enter new salary`,
                        name: "newSalary"
                    }
                ]
                const roleObj = result.find(result => result.title === answer.role)
                inquirer
                .prompt(questions)
                .then(answers => {
                    const sqlUpdate = `UPDATE employee_role
                                        SET title = "${answers.newTitle}",
                                            salary = ${answers.newSalary}
                                        WHERE role_id = ${roleObj.role_id};`
                    connection.query(sqlUpdate, function (err, result) {
                        if (err) {console.log(err) 
                        } else {
                            console.log(`
${roleObj.title} updated to ${answers.newTitle} and $${answers.newSalary}
                            `)
                            mainMenu('Update')
                        }
                    })
                })
            })
        }
    })
}

function updateManager() {
    const sqlEmp = `SELECT employee.employee_id, employee.first_name, employee.last_name, department.dept_name, employee_role.title
                    FROM employee
                    LEFT JOIN employee_role ON employee.employee_role = employee_role.role_id
                    LEFT JOIN department ON employee_role.department_id = department.department_id
                    ORDER BY employee.employee_id ASC;`
    const sqlManager = `SELECT DISTINCT m.employee_id, m.first_name manager_first_name, m.last_name manager_last_name
                        FROM employee e
                        INNER JOIN employee m ON m.employee_id = e.manager_id;`
    connection.query(sqlEmp, function (err, empList) {
        if (err) {console.log(err)
        } else {
            connection.query(sqlManager, function (err, managerList) {
                if (err) {console.log(err) 
                } else {
                    console.table(empList)
                    const questions = [
                        {
                            type: "list",
                            message: "Select employee who is being updated",
                            name: "empChoice",
                            choices: empList.map(empList => empList.first_name + ' ' + empList.last_name)
                        },
                        {
                            type: "list",
                            message: "Which manager will that employee be reporting to?",
                            name: "managerChoice",
                            choices: managerList.map(managerList => managerList.manager_first_name + ' ' + managerList.manager_last_name)
                        }
                    ]
                    inquirer
                    .prompt(questions)
                    .then(answers => {
                        employee = answers.empChoice.split(' ')
                        employee1 = empList.find(empList => empList.first_name === employee[0] && empList.last_name === employee[1])
                        // console.log(employee1.employee_id)
                        manager = answers.managerChoice.split(' ')
                        manager1 = managerList.find(managerList => managerList.manager_first_name === manager[0] && managerList.manager_last_name === manager[1])
                        // console.log(manager1.employee_id)
                        const sqlUpdate = `UPDATE employee
                                                SET manager_id = ${manager1.employee_id}
                                            WHERE employee_id = ${employee1.employee_id};`
                        connection.query(sqlUpdate, function (err, result) {
                            if (err) {console.log(err)
                            } else {
                                console.log(`
Updated Employee ${answers.empChoice} to report to ${answers.managerChoice} starting immidiately
                                `)
                                mainMenu('Update')
                            }
                        })
                    })
                }
            })
        }
    })
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
                        let total = result.map(result => result.salary).reduce(function (acc, cur) {
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
    password: "toorTOOR11$$", //
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

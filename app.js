const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "MySQLPassword",
    database: "employee_tracker_db"
});

connection.connect(err => {
    if (err) throw err;
    mainprogram();
})

//the Program

async function mainprogram(){
    const response = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Select a menu you want to use:',
        choices: ['Employee', 'Roles', 'Departments', 'Exit Program']
    })

    switch (response.action) {
        case 'Employee':
            theEmployeeMenu()
            break;
        case 'Roles':
            theRolesMenu()
            break;
        case "Departments Menu":
            theDepartmentMenu();
            break;
        default:
            process.exit();
    }
}

// The Employee Menu
async function theEmployeeMenu() {
    console.log()
    const response = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "What do you want to do in this menu?",
        choices: ["View All Employees", "View Employees By Manager", "Add Employee", "Delete Employee", "Go Back"]
    })

    switch (response.action) {
        case "View All Employees":
            viewAllTheEmployees();
            break;
        case "View Employees By Manager":
            viewTheEmployeesByManager();
            break;
        case "Add Employee":
            addAnEmployee();
            break;
        case "Delete Employee":
            deleteAnEmployee();
            break;
        default:
            mainprogram();
            break;
    }
}

function viewAllTheEmployees() {
    connection.query(
        `SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Role, departments.name AS Department, roles.salary As Salary, CONCAT(managers.first_name, " ", managers.last_name) AS Manager FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees AS managers ON employees.manager_id = managers.id`,
        function (err, res) {
            if (err) throw err;
            console.log("Employees:");
            console.table(res);
            theEmployeeMenu();
        })
}

async function viewTheEmployeesByManager() {
    connection.query(
        `SELECT CONCAT(employees.first_name, " ", employees.last_name) AS manager, employees.id AS id FROM employees
        INNER JOIN employees AS underling ON employees.id = underling.manager_id;`,
        async function (err, res) {
            if (err) throw err;
            const managers = [...new Set(res.map(a => a.manager))];
            
            const response = await inquirer.prompt({
                type: "list",
                name: "manager",
                message: "Select manager to view employees working under them.",
                choices: managers
            })

            let index = null;

            for (let i = 0; i < res.length; i++) {
                if (res[i].manager === response.manager) {
                    index = i;
                    break;
                }
            }

            connection.query(
                `SELECT employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Role, departments.name AS Department, roles.salary As Salary, CONCAT(managers.first_name, " ", managers.last_name) AS Manager FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees AS managers ON employees.manager_id = managers.id
                WHERE employees.manager_id = ${res[index].id}`,
                function (err2, res2) {
                    if (err2) throw err2;
                    console.log(`Employees managed by ${response.manager}:`)
                    console.table(res2);
                    theEmployeeMenu();
                })
        });
}

async function addTheEmployee() {
    connection.query(
        `SELECT * FROM departments ORDER BY id`,
        async function (err, rawDepartments) {
            if (err) throw err;
            const departments = rawDepartments.map(a => a.name);
            const responseDep = await inquirer.prompt({
                type: "list",
                name: "department",
                message: "Which department does this employee work in?",
                choices: departments
            })
            dIndex = departments.indexOf(responseDep.department);
            connection.query(
                `SELECT * FROM roles WHERE department_id = ${rawDepartments[dIndex].id} ORDER BY id`,
                async function (err2, rawRoles) {
                    if (err2) throw err2;
                    const roles = rawRoles.map(a => a.title);
                    const responseRole = await inquirer.prompt({
                        type: "list",
                        name: "role",
                        message: "Select the employee's role in the department",
                        choices: roles
                    })
                    let rIndex = null;
                    for (let i = 0; i < rawRoles.length; i++) {
                        if (rawRoles[i].title === responseRole.role) {
                            rIndex = i;
                            break;
                        }
                    }
                    connection.query(
                        `SELECT CONCAT(first_name, " ", last_name) as name, id FROM employees ORDER BY id;`,
                        async function (err3, rawManagers) {
                            if (err3) throw err3;
                            const managers = ["none", ...rawManagers.map(a => a.name)];
                            const response = await inquirer.prompt([
                                {
                                    type: "list",
                                    name: "manager",
                                    message: "Please select a manager that the employee will report to.",
                                    choices: managers
                                },
                                {
                                    type: "input",
                                    name: "first_name",
                                    message: "Enter the first name of the employee"
                                },
                                {
                                    type: "input",
                                    name: "last_name",
                                    message: "Enter the last name of the employee"
                                }
                            ])

                            let mIndex = null;
                            for (let i = 0; i < rawManagers.length; i++) {
                                if (rawManagers[i].name = response.manager) {
                                    mIndex = i;
                                }
                            }

                            let insert = `INSERT INTO employees(first_name, last_name, role_id`;
                            if (mIndex === null) {
                                insert += `)`
                            }
                            else {
                                insert += `, manager_id)`
                            }
                            let values = `VALUES ('${response.first_name}', '${response.last_name}', '${rawRoles[rIndex].id}'`
                            if (mIndex === null) {
                                values += `)`;
                            }
                            else {
                                values += `, '${rawManagers[mIndex].id}')`
                            }
                            const completeInsert = insert + ` ` + values;
                            connection.query(
                                completeInsert,
                                function(err4, res) {
                                    if (err4) throw err4;
                                    console.log(`${response.first_name} ${response.last_name} successfully added as an employee.`);
                                    employeeMenu();
                                }
                            )
                        }
                    )
                })
        })
}

async function deleteAnEmployee() {
    connection.query(`SELECT CONCAT(first_name, " ", last_name) as name, id FROM employees ORDER BY id`, async function (err, res) {
        if (err) throw err;
        const employees = res.map(a => a.name);

        const response = await inquirer.prompt({
            type: "list",
            name: "employee",
            message: "Which employee do you want to delete?",
            choices: employees
        })

        const index = employees.indexOf(response.employee);

        connection.query(`DELETE FROM employees WHERE id = '${res[index].id}'`, function (err2, res2) {
            if (err2) throw err2;
            console.log(`${response.employee} was successfully deleted.`);
            employeeMenu();
        });
    })
}


async function roleMenu() {
    const response = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Roles", "Add Role", "Delete Role", "Go Back"]
    })

    switch (response.action) {
        case "View all Roles":
            viewAllRoles();
            break;
        case "Add a Role":
            addARole();
            break;
        case "Delete a Role":
            deleteARole();
            break;
        default:
            mainprogram();
            break;
    }

}
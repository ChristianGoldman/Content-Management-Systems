const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_tracker_db",
});

connection.query("SELECT * FROM employee", function (error, results, fields) {
  if (error) throw error;
  // console.table(results);
});

function questions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Remove Employee",
          "Update Employee",
        ],
      },
    ])
    .then(function (answers) {
      switch (answers.list) {
        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "View All Employees":
          viewEmployee();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Departments":
          viewDepartment();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee":
          updateEmployee();
          break;
        default:
      }
    });
}

function addRoles() {
  let departArray = [];
  connection.query(
    "SELECT id, name FROM department",
    function (error, results, fields) {
      if (error) throw error;
      for (let i = 0; i < results.length; i++) {
        departArray.push({ name: results[i].name, value: results[i].id });
      }
    }
  );
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the title of the role you would like to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "How big is the salary someone in this role should recieve?",
      },
      {
        type: "list",
        name: "departId",
        message: "What department ID does this role belong to?",
        choices: departArray,
      },
    ])
    .then(function (res) {
      connection.query(
        `INSERT INTO role(title, salary, department_id) VALUES("${res.role}", "${res.salary}", ${res.departId})`,
        (err, response) => {
          if (err) throw err;
          console.log(
            `\n '${response.first}' '${response.last}' HAS BEEN ADDED!`
          );
          askAgain();
        }
      );
    });
}

function addEmployee() {
  connection.query(
    "SELECT id, title FROM role",
    function (error, results, fields) {
      if (error) throw error;
      const roleArray = [];
      for (let i = 0; i < results.length; i++) {
        roleArray.push({ name: results[i].title, value: results[i].id });
      }

      connection.query(
        "SELECT id, concat(first_name, ' ', last_name) AS Manager FROM employee WHERE manager_id IS NULL",
        function (error, results, fields) {
          if (error) throw error;
          const managerArray = results.map((manager) => ({
            name: manager.Manager,
            value: manager.id,
          }));
          // for (let i = 0; i < results.length; i++) {
          //   managerArray.push({ name: results[i].Manager, value: results[i].id });
          // }
          inquirer
            .prompt([
              {
                type: "input",
                name: "first",
                message: "What is the first name of the employee?",
              },
              {
                type: "input",
                name: "last",
                message: "What is the last name of the employee?",
              },
              {
                type: "list",
                name: "roleId",
                message: "What role does the employee have?",
                choices: roleArray,
              },
              {
                type: "list",
                name: "managerId",
                message: "What manager does this employee belong under?",
                choices: managerArray,
              },
            ])
            .then(function (res) {
              connection.query(
                // `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("${res.first}", "${res.last}", ${res.roleId}, ${res.managerId})`,
                // `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`, [res.first, res.last, res.roleId, res.managerId],
                `INSERT INTO employee SET ?`,
                {
                  first_name: res.first,
                  last_name: res.last,
                  role_id: res.roleId,
                  manager_id: res.managerId,
                },
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    `\n '${res.first}' '${res.last}' HAS BEEN ADDED!`
                  );
                  askAgain();
                }
              );
            });
        }
      );
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department you wish to add?",
      },
    ])
    .then(function (res) {
      connection.query(
        `INSERT INTO department(name) VALUES("${res.department}");`,
        (err, res) => {
          if (err) throw err;
        }
      );
      askAgain();
    });
}

function askAgain() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "again",
        message: "Would you like to continue?",
        choices: ["Yes", "No"],
      },
    ])

    .then(function (again) {
      if (again.again === "Yes") {
        questions();
      } else {
        connection.end();
      }
    });
}

function viewEmployee() {
  connection.query("SELECT * FROM employee", function (error, results, fields) {
    if (error) throw error;
    console.table(results);
    askAgain();
  });
}

function viewDepartment() {
  connection.query(
    "SELECT * FROM department",
    function (error, results, fields) {
      if (error) throw error;
      console.table(results);
      askAgain();
    }
  );
}
function viewRoles() {
  connection.query("SELECT * FROM role", function (error, results, fields) {
    if (error) throw error;
    console.table(results);
    askAgain();
  });
}

function removeEmployee() {
  let employeeArray = [];
  connection.query(
    "SELECT id, first_name, last_name, role_id, concat(first_name, ' ', last_name, ' ', 'Role ID ', role_id) AS employee FROM employee",
    function (error, results, fields) {
      if (error) throw error;
      // replace with map
      for (let i = 0; i < results.length; i++) {
        employeeArray.push(results[i].employee);
      }
      inquirer
        .prompt([
          {
            type: "list",
            name: "deleted",
            message: "What employee do you want to remove?",
            choices: employeeArray,
          },
          {
            type: "list",
            name: "confirm",
            message: "Are you sure you wish to remove this employee?",
            choices: ["Yes", "No"],
          },
        ])
        .then(function (res) {
          if (res.confirm === "Yes") {
            let removedEmp;
            for (let i = 0; i < results.length; i++) {
              if (res.deleted === results[i].employee) {
                removedEmp = results[i].id;
                console.log(removedEmp);
                break;
              }
            }
            connection.query(
              `DELETE FROM employee WHERE id=${removedEmp};`,
              function (err, res) {
                if (err) return console.log(err);
                console.log(`\n EMPLOYEE '${removedEmp}' DELETED...\n `);
              }
            );
            askAgain();
          } else {
            console.log("Employee was not removed!");
            askAgain();
          }
        });
    }
  );
}

function updateEmployee() {
  connection.query(
    "SELECT id, first_name, last_name, role_id, concat(first_name, ' ', last_name) AS Employee FROM employee",
    function (error, results, fields) {
      if (error) throw error;
      const employeeArr = results.map((employee) => ({
        name: employee.Employee,
        value: employee.id,
      }));

      connection.query(
        "SELECT id, title FROM role",
        function (error, result, fields) {
          if (error) throw error;
          const roleArr = result.map((role) => ({
            name: role.title,
            value: role.id,
          }));
          console.log(roleArr);
          console.log(employeeArr);

          inquirer
            .prompt([
              {
                type: "list",
                name: "change",
                message: "What would you like to update?",
                choices: ["Role", "Manager", "Department", "Salary"],
              },
            ])
            .then(function (res) {
              if (res.change === "Role") {
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "employee",
                      message: "Who do you wish to update?",
                      choices: employeeArr,
                    },
                    {
                      type: "list",
                      name: "role",
                      message: "What role would you like to change to?",
                      choices: roleArr,
                    },
                  ])
                  .then(function (response) {
                    console.log(response);
                    connection.query(
                      "UPDATE employee SET role_id =? WHERE id=?",
                      [
                        response.role, response.employee
                      ],
                      function (err, data) {
                        console.log(data);
                        console.log(response + "\n \n hey how are you doing?");
                        if (err) throw err;
                        
                      }
                    );
                  });
              }
            });
        }
      );
    }
  );
}

questions();

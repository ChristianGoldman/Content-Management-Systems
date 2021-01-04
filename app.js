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
          "View All Employees by Department",
          "View All Employees by Manager",
          "Add Employee",
          "Add Department",
          "Add Role",
          "Remove Employee",
          "Update Employee",
          "Update Employee Role",
          "View All Roles",
          "View All Departments",
        ],
      },
    ])
    .then(function (answers) {
      switch(answers.list) {
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
        default:
      };
    });
};

function addRoles() {
  inquirer.prompt([
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
      type: "input",
      name: "departId",
      message: "What department ID does this role belong to?",
    },
  ])
  .then(function (){
    askAgain();
  })
};

function addEmployee() {
  inquirer.prompt([
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
      type: "input",
      name: "roleId",
      message: "What role does the employee have?",
    },
    {
      type: "input",
      name: "managerId",
      message: "What manager does this employee belong under?",
    },
  ])
  .then(function (){
    askAgain();
  })
};

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
  ])
  .then(function (){
    askAgain();
  })
};

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
      };
    });
};

function viewEmployee() {
  connection.query("SELECT * FROM employee", function (error, results, fields) {
    if (error) throw error;
    console.table(results);
    askAgain();
  });
};

function viewDepartment() {
  connection.query("SELECT * FROM department", function (error, results, fields) {
    if (error) throw error;
    console.table(results);
    askAgain();
  });
}
function viewRoles() {
  connection.query("SELECT * FROM role", function (error, results, fields) {
    if (error) throw error;
    console.table(results);
    askAgain();
  });
};


questions();
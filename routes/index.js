// All routes will access the app through this file
const testRoutes = require("./testRoutes");
const adminRoutes = require("./adminRoutes");
const studentRoutes = require("./studentRoutes");
const transactionRoutes = require("./transactionRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const bookRoutes = require("./bookRoutes");


const routes = (app) => {
    testRoutes(app)
    adminRoutes(app)
    studentRoutes(app)
    transactionRoutes(app)
    dashboardRoutes(app)
    bookRoutes(app)
}

module.exports = routes
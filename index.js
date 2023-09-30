const express = require('express')
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
require('dotenv').config()
const route = require("./routes/client/index.route.js")
const AdminRoute = require("./routes/admin/index.route.js");
const database = require("./config/database.js");
const app = express()
const port = process.env.PORT;
const systemConfig = require("./config/system.js");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
database.connect();

app.set("views",`${__dirname}/views`);
app.set('view engine','pug')
//Flash
app.use(cookieParser("LHNASDASDAD"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// END Flash
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
route(app);
AdminRoute(app);





//Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
//End Variables

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
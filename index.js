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
const path = require('path');
const moment = require('moment');
const http = require("http");
const { Server } = require("socket.io");



//TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
//ENd TinyMCE

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
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

//Route
route(app);
AdminRoute(app);
// app.get("*", (req, res) => {
//   res.render("client/pages/error/page404", {
//     pageTitle: "404 Not Found",
//   });
// });
//End Route

// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
require("./sockets/client/chat.socket")(io);
require("./sockets/admin/chat.socket")(io);
//Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
//End Variables

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
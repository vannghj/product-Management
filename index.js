const express = require("express");
const app = express();
const moment = require("moment");
var path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const database = require("./config/database")
const systemCongig = require("./config/system")
const port = process.env.PORT;
const methodOverride = require("method-override");
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index");
database.connect();
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:false}));
app.set("views" , `${__dirname}/views`);
app.set("view engine", "pug");
//flash
app.use(cookieParser("keyboardcat"));
app.use(session({cookie:{maxAge:60000}}));
app.use(flash());
//flash

//tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))

//
app.locals.prefixAdmin =systemCongig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

route(app);
routeAdmin(app);
app.get("*",(req,res) => {
    res.render("client/pages/errors/404.pug" , {
        pageTitle: "404 Not Found"
    });

})
app.listen(port, () => {
    console.log("app listening");
})
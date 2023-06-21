const express = require('express');
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express();
const db = require('./models');

const cors = require('cors');

// Enable CORS for all routes
app.use(cors());


// body parser qs
app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use('/',userRoutes);
app.use('/',authRoutes);
app.use('/',dashboardRoutes);



//db connection
db.sequelize.sync().then(()=>{
    app.listen(3000,()=>{
        console.log("server is listening on port 3000")
    })
})

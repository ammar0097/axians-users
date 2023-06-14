const express = require('express');
const userRoutes = require('./routes/userRoutes')
const app = express();
const db = require('./models');
// body parser qs
app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use('/',userRoutes);

//db connection
db.sequelize.sync().then(()=>{
    app.listen(3000,()=>{
        console.log("server is listening on port 3000")
    })
})

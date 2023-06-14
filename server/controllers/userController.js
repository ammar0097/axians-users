const db = require("../models");

exports.getAllUsers = async (req, res) => {
  const users = await db.User.findAll();
  if (!users) {
    res.status(500).send("No users found!");
  } 
  res.status(200).send(users);

};

exports.getUserById = async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { id: req.params.id } });

    if (!user) {
      res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await db.User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.updateUser = async (req, res) => {
 
  const id_params = req.params.id;
  try{
   
    const user = await db.User.findByPk(id_params);
    if(!user){
      res.status(404).send("user not found");
    }
    
    await db.User.update({
      username : req.body.username,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email: req.body.email,
      password : req.body.password
    },{where:{
       id :id_params
    }});

    res.status(200).send("user updated");

  }catch(error){
    res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id_param = req.params.id;
    const user = await db.User.findByPk(id_param);
    if (!user) {
      res.status(404).send("user not found");
    }
    await db.User.destroy({where:{id:id_param}});
    res.status(200).send("user deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

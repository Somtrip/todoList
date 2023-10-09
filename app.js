require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then(()=> console.log("MongoDB Connected!")).catch(err => console.log("MongoDB error",err));



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const taskSchema = new mongoose.Schema({
  task: "String"
});

const Task = mongoose.model("newTask", taskSchema );

const Task1 = new Task({
  task: "Welcome to ToDo Lists project"
});

const Task2 = new Task({
  task: "Click + to add new task!"
});

const defaultItems = [ Task1, Task2];



 

app.get('/', (req, res) => {
  // const todos = loadTodos();
  Task.find({}).then(function(foundItems){

    if(foundItems.length === 0){
      Task.insertMany(defaultItems);
      res.redirect('/');
    }else{
      res.render('index.ejs', { listTitle: "Today" , newListItems: foundItems});
    }
    
  })
  
});

app.post('/', async(req, res) => {
  const newTaskName = req.body.task;
   const newItem = new Task({
    task: newTaskName
   });

   newItem.save();

   res.redirect('/');
});

app.post('/delete', async(req, res)=>{
  const checkedItemId = req.body.checkbox;
  
  if(checkedItemId != undefined){
    await Task.findByIdAndDelete(checkedItemId)
    .then(()=>console.log("Deleted Successfully"));
  }
  
  res.redirect('/');
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

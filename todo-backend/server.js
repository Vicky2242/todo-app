//using express

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//create an instance of express
const app = express();
app.use(express.json())
app.use(cors())

//sample in-memory storage for todo items
//let todos= [];

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log('connected to mongodb')
})
.catch((err) => {
    console.log(err)
})

//create a schema for todo items
const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    })

//creating model
const todoModel = mongoose.model('Todo' , todoSchema);

// create a new todo item
app.post('/todos', async (req, res)=> {
    const {title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);

    try{
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }catch(error){
        console.log(error);
        res.status(500);
    }
})

//get all items
app.get('/todos' , async(req, res)=> {
    try{
       const todos = await todoModel.find();
       res.json(todos);
    }catch(error){
        console.log(error)
        res.status(500).json({message:error.message});
    }
})

//update a todo item
app.put('/todos/:id', async (req, res) => {
    try {
            const id = req.params.id;
            const { title, description } = req.body;
            const updatedTodo = await todoModel.findByIdAndUpdate(
            id, 
            {title, description},
            {new: true}
            )

            if(!updatedTodo){
            return res.status(404).json({message: 'Todo not found'})
            }
            res.json(updatedTodo)
            } catch(error){
                console.log(error);
                res.status(500).json({message:error.message});
                }
    })


    //delete a todo item
    app.delete('/todos/:id', async (req, res) => {
        try {
            const id = req.params.id;
            await todoModel.findByIdAndDelete(id);
            res.json({message: 'Todo deleted successfully'})
            } catch (error) {
                console.log(error);
                res.status(500).json({message:error.message});
                }
                })



//start the server
 const port = 8000;
 app.listen(port, () => {
    console.log("Server is listening to port "+port);
 })
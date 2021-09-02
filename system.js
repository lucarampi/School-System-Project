const express = require('express');
const mongoose = require('mongoose');
const credentials = require('./credentials.json');
const app = express();

mongoose.connect(credentials.db.mongoDB.host, { useNewUrlParser: true, useUnifiedTopology: true });

const Students = mongoose.model('students', {
    name: String,
    class: String,
    grades: {
        g1: Number,
        g2: Number,
        g3: Number
    },
    status: String
});

app.set('view engine', 'ejs');
app.set('views', __dirname, '/views');
app.use(express.urlencoded());
app.use(express.json());

//Pagina para consultar alunos cadastrados
app.get('/students', (req, res) => {
    Students.find({}, (err, element) => {
        if (err) return res.status(500).send('Erro ao consultar o banco de dados');
        res.render('students_db', {items:element})
    })
})

//Pagina para cadastrar alunos
app.get('/', (req, res) => {
    res.render('form_grades')
})

app.post('/',(req,res)=>{
    let generic_student = new Students();
    generic_student.name = req.body.name
    generic_student.class = req.body.class

    generic_student.grades.g1 = req.body.g1
    generic_student.grades.g2 = req.body.g2
    generic_student.grades.g3 = req.body.g3

    average = ((generic_student.grades.g1 + generic_student.grades.g2 + generic_student.grades.g3)/3)
    if (average >= 6) generic_student.status = "APPROVED"
    else generic_student.status = "DISAPPROVED"

    generic_student.save((err) =>{
        if (err) return res.status(500).send('Erro ao cadastrar o aluno');
        return res.redirect('/students');
    })

})



app.listen(credentials.db.mongoDB.port, () => {
    console.log(`Server is running! (port ${credentials.db.mongoDB.port})`)
})
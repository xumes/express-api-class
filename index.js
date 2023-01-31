const express = require("express")
const bodyParser = require('body-parser')
const axios = require("axios")
require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 5000

const userList = [
    {id: 1, nome: 'Robinson', idade: 50, profissao: "Gerente de infra"},
    {id: 2, nome: 'Xumes', idade: 30, profissao: "Apertador de botões"},
    {id: 3, nome: 'Grumes', idade: 25, profissao: "Peão de obra"},
    {id: 4, nome: 'Beltrano', idade: 53, profissao: "Chefe"},
]

app.get('/', (req, res) => {
    res.send('Funcionou!')
})

app.get('/user', (req, res) => {
    res.json(userList)
})

app.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id)

    const encontrado = userList.find((user) => {
       return user.id === userId
    })

    if (!encontrado) {
        res.sendStatus(404)
    }

    res.json(encontrado)
})

app.post('/user', (req, res) => {
    const userData = req.body

    const userName = userData.nome 
    if (!userName) {
        res.status(400).json({
            success: false,
            message: "O nome do usuário é obrigatório"
        })

        return
    }

    const newId = userList.length + 1

    const newUser = {
        id: newId,
        nome: userName,
        idade: userData.idade,
        profissao: userData.profissao
    }

    userList.push(newUser)

    res.status(201).json({
        success: true,
        message: "O usuário foi criado com sucesso",
        user: newUser
    })
})

app.delete('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id)

    const encontrado = userList.findIndex((user) => {
       return user.id === userId
    })

    console.log(encontrado)

    if (!encontrado) {
        res.sendStatus(404)
    }

    userList.splice(encontrado, 1)

    res.status(200).json({
        success: true,
        message: "O usuário foi apagado com sucesso"
    })
})

app.get('/clima/:cidade', (req, res) => {
    // verifica se uma cidade foi informada
    const cidade = req.params.cidade

    if (!cidade) {
        res.sendStatus(404)
        return
    }

    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?"
    const cidadeParam = `q=${cidade}`
    const apiKey = `&appid=${process.env.MY_API_KEY}&units=metric&lang=pt_br`

    console.log(apiUrl+cidadeParam+apiKey)

    axios
        .get(apiUrl+cidadeParam+apiKey)
        .then(result => {
            res.send(formatador(result.data))
        })
        .catch(e => {
            res.status(404)
        })
})

app.get('/piadas', (req, res) => {
    axios
        .get('https://api.chucknorris.io/jokes/random')
        .then(result => {
            res.send(result.data.value)
        })
})


app.listen(port, () => {
    console.log("o servidor está rodando no link http://localhost:" + port)
})


const formatador = (clima) => {
    const descricao = clima.weather[0].description
    const temperatura = clima.main.temp
    const sensacao = clima.main.feels_like
    const umidade = clima.main.humidity
    const cidade = clima.name

    return `O clima em ${cidade} está ${descricao}. A temperatura está em ${temperatura} célsius, com sensação térmica de ${sensacao} célsius`
}

/*
localhost:5000 (url) - domínio

/
/user
/user/1
/order
/order/1
/user/1/order


    return axios
        .get(apiUrl+cidadeParam+apiKey)
        .then((result) => {
            console.log("dados retornados", result)
            res.json(result.data)
        })

*/

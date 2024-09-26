// importar dependencia express
import express, { response } from 'express'

// importar dependencia cors
import cors from 'cors'

// importar biblioteca bycrip
import bcrypt from 'bcrypt'

// importar biblioteca id
import { v4 as uuidv4} from 'uuid'

// criar uma instancia do express, objeto
const app = express()

app.use(cors({
    // origin: ['http://exemple.com', 'http://exemple.com']
}))

app.use(express.json())

// app.get('/', (request, response) => {
//     response.send('olá, express!')
// })

const users = [
    {id: 1, name: 'Alice', avaliable: true},
    {id: 2, name: 'Wesley', avaliable: false},
    {id: 3, name: 'joao', avaliable: true},
    {id: 4, name: 'theo', avaliable: true}
]


// app.get('/users', (request, response) => {
//     if (users.length === 0) {
//         return response.status(404).json({
//             message: 'Nenhum usuário encontrado'
//         })
//     }

//     return response.json(users)
// })

const viagens = [
    {id: 1,
    nomeViagem: 'paris',
    precoDaViagem: 5000,
    quantidadePromocao: 50
    }
]


app.post('/viagem', (request, response) => {
    const {nomeViagem, precoDaViagem, quantidadePromocao} = request.body

    if (!nomeViagem || !precoDaViagem || !quantidadePromocao) {
        return response.status(404).json({
            message: "obrigatorio nome, preço e quantidade em promoção"
        })
    }

    viagens.push({
        id: viagens.length + 1,
        nomeViagem: nomeViagem,
        precoDaViagem: precoDaViagem,
        quantidadePromocao: quantidadePromocao
    })

    return response.status(201).json({
        message:'Viagem cadastrada com sucesso!'
    })
})

app.post('/users', (request, response) => {
    // const name = request.nome
    // const avaliable = request.body.avaliable

    const {name, avaliable} = request.body

    if (!name) {
        return response.status(400).json({
            message: 'Nome de usuário é obrogatório'
        })
    }

    const newUser = {
        id: users.length + 1,
        name,
        avaliable: avaliable ?? true
    }

    users.push(newUser)

    return response.status(201).json({
        message: 'Usuário adicionado com sucesso!',
        user: newUser
    })
})

app.put('/users/:id', (request, response) => {
    const {id} = request.params // pegando parametros da rota
    const {name: updatedUser, avaliable} = request.body // pegando o corpo
    const user = users.find(user => user.id === parseInt(id))

    if (!user) {
        return response.status(404).json({
            message: 'Usuário não encontrado'
        })
    }

    user.name = updatedUser
    user.avaliable = avaliable

    return response.status(200).json({
        message: 'Usuário atualizado com sucesso!',
        user
    })
})

app.delete('/users/:id', (req, res) => {
    const { id } = req.params

    const userIndex = users.findIndex(user => user.id === parseInt(id))

    if (userIndex === -1) {
        return res.status(404).json({
            message: 'Usuário não encontrado'
        })
    }

    // const deletedUser = users.splice(userIndex, 1)[0]
    const [deletedUser] = users.splice(userIndex, 1)

    return res.status(200).json({
        message: 'Usuário deletado com sucesso!',
        user: deletedUser
    })
})

// app.get('/users', (request, response) => {
//     const {filtro} = request.query

//     let filteredUsers

//     if (filtro === 'ativo') {

//         filteredUsers = users.filter(user => user.avaliable === true)

//     } else if (filtro ==='inativo') {

//         filteredUsers = users.filter(user => user.avaliable === false)

//     } else {
//         filteredUsers = users
//     }

//     if (filteredUsers.length === 0) {
//         return response.status(404).json({
//             message: 'nenhum usuario encontrado'
//         })
//     }

//     return response.status(200).json(filteredUsers)
// })

const admUsers = []

app.post('/signup', async (request, response) => {
    try {
        const { userName, password } = request.body

        const hashedPassword = await bcrypt.hash(password, 10) // 10 é o salt sequencia aleatória

        const existingUser = admUsers.find(user => user.userName = userName)

        if (existingUser) {
            return response.status(400).json({
                message: 'usuário ja existe.'
            })
        }

        const newUser = {
            userName,
            password: hashedPassword
        }

        admUsers.push(newUser)

        return response.status(201).json({
            message: 'Admin cadastrado com sucesso.',
            newUser
        })
    } catch (error) {
        response.status(500).json({
            message: 'erro ao registrar o admin'
        })
    }
})

app.listen(3000, () => {
    console.log('sitema rodando na porta 3000!')
})
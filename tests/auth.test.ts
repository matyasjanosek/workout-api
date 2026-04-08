import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'

// app without db for basic tests
const app = express()
app.use(express.json())

// test route
app.post('/test/echo', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({ message: 'Missing fields' })
        return
    }
    res.status(200).json({ message: 'ok' })
})

app.get('/test/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

describe('API basic tests', () => {

    it('should return 200 on health check', async () => {
        const res = await request(app).get('/test/health')
        expect(res.status).toBe(200)
    })

    it('should return 400 when fields are missing', async () => {
        const res = await request(app)
            .post('/test/echo')
            .send({})
        expect(res.status).toBe(400)
    })

    it('should return 200 when fields are provided', async () => {
        const res = await request(app)
            .post('/test/echo')
            .send({ username: 'test', password: '123' })
        expect(res.status).toBe(200)
    })

})
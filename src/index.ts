import { Hono } from 'hono'
import {basicAuth} from 'hono/basic-auth'
import {serveStatic} from 'hono/bun'

const app = new Hono()

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)
app.use('/static/*', serveStatic({ root: './' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('/a', serveStatic({path: './static/hello.html'}))
app.notFound((c) => {
  return c.json({
    statusCode: 404,
    message: `${c.req.path} is not found`
  })
})
// app.get('/', (c) => {
//   console.log(c)
//   return c.text('hono')
// })

app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!'
  })
})

app.get('/posts/:id', (c) => {
  const page = c.req.query('page')
  const id = c.req.param('id')
  c.header('X-Message', 'Hi!')
  return c.text(`You want see ${page} of ${id}`)
})

app.get('/morning', (c) => {
  return new Response('Good morning!')
})

app.get('/admin', (c) => {
  return c.text('You are authorized!')
})

app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    },
  })
)

app.get('/', (c) => c.text('You can access: /static/hello.txt'))

export default {
  port: 3001,
  fetch: app.fetch
}

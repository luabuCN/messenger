import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import register from './register'
export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
  .route('/register', register)

  export const GET = handle(app);
  export const POST = handle(app);
  export const PATCH = handle(app);
  export const DELETE = handle(app);
  
  export type AppType = typeof routes;
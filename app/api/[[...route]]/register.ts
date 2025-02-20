import bcrypt from 'bcryptjs';
import {Hono} from 'hono'

const app = new Hono().post('/register', async (c) => {
  const body = await c.req.json();
  const { email, name, password} = body;

  if(!email || !name || !password) {
    return c.text('Invalid credentials', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  
  const user = await prisma?.user.create({
    data: {
      email,
      name,
      hashedPassword,
    }
  });
  if(!user) {
    return c.text('Invalid credentials', 400);
  }
  return c.json(user);
})

export default app;
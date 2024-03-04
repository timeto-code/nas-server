import * as z from "zod";

const LoginDto = z.object({
  username: z.string().min(3),
  password: z.string().min(6).max(20),
});

const GetUserDto = z.object({
  id: z.string().min(3).optional(),
  name: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
});

const CreateUserDto = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email().optional(),
  password: z.string().min(6).max(20),
});

export { GetUserDto, CreateUserDto, LoginDto };

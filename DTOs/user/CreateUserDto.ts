import * as z from "zod";

const CreateUserDto = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email().optional(),
  password: z.string().min(6).max(20),
});

export default CreateUserDto;


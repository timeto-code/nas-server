import * as z from "zod";

const GetUserDto = z.object({
  id: z.string().min(3).optional(),
  name: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
});

export default GetUserDto;

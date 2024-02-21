import * as z from "zod";

const GetFolderDto = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).max(20).optional(),
  userId: z.string().min(1).optional(),
  parentId: z.string().min(1).optional(),
  path: z.string().min(1).optional(),
});

export { GetFolderDto };

import * as z from "zod";

const CreateFolderDto = z.object({
  name: z.string().min(1).max(30),
  parentId: z.string().min(1),
});

const RenameFolderDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(30),
});

const MoveFolderDto = z.object({
  fronId: z.string().min(1),
  toId: z.string().min(1),
});

export { CreateFolderDto, RenameFolderDto, MoveFolderDto };

import * as z from "zod";

const RenameFileDto = z.object({
  id: z.string().min(1, { message: "无效文件Id" }),
  name: z
    .string()
    .min(1, { message: "请输入文件名" })
    // .max(30, { message: "无效文件名" })
    .regex(/^[a-zA-Z0-9\-_()\[\]{}【】.]*$/),
});

const MoveFileDto = z.object({
  id: z.string().min(1),
  folderId: z.string().min(1),
});

export { RenameFileDto, MoveFileDto };

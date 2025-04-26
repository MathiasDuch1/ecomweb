import { hash } from "bcrypt";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({
      where: { email }
    });
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: { id }
    });
  } catch {
    return null;
  }
};

const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export type UserFormData = z.infer<typeof UserSchema>;

export const createUser = async (data: UserFormData) => {
  const validatedFields = UserSchema.safeParse(data);
  
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, name } = validatedFields.data;
  
  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    return { error: "Email already in use" };
  }
  
  const hashedPassword = await hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword
    }
  });
  
  return { success: "User created", user };
}; 
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { User } from "../generated/prisma";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function createUser({
  name,
  email,
  password,
  role = "USER"
}: {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN";
}): Promise<Omit<User, "password">> {
  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });
  
  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

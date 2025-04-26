import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await auth();
  // If you throw, the user will not be able to upload
  if (!session || !session.user) throw new Error("Unauthorized");
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId: session.user.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    // Set permissions and file types for this FileRoute
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File:", file);

      return { uploadedBy: metadata.userId, url: file.url };
    }),
  avatar: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 
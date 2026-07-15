import { revalidatePath } from "next/cache";

export function revalidateSite(paths = []) {
  revalidatePath("/");
  paths.forEach((path) => revalidatePath(path));
}

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/options";

export async function currentUser() {
    const session = await getServerSession(authOptions);
    return session?.user ?? null
}

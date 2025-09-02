import { signIn } from "@/lib/auth"

const handleSignin = async function() {
    "use server"
    await signIn('google')
}

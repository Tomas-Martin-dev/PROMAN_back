import bcrypt from "bcrypt";

export async function hashPass(password: string) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export async function validPassHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

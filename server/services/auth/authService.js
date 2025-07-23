import prisma from '../../prisma/client.js';
import bcrypt from "bcryptjs";


const registerUser= async (email, password) => {

    const existing=await prisma.user.findUnique({where: { email }});

    if( existing ) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    return user;

}

const loginUser=async (email, password)=>{
    const user= await prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("User not found");
    }   
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    return user;
}

export { registerUser, loginUser };
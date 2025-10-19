import { UserModel } from "../../db/schema.js";

export const signupHandler = async (req, res) => {
    const { name, username, emailId, age, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        await UserModel.create({
            name,
            username,
            emailId,
            age,
            password: hashedPassword,
        });

        return res.status(201).json({ message: 'You are signed up.' });
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).json({ error: 'Username or email already exists.' });
        }

        console.error(`Error signing up: ${err}`);

        return res.status(500).json({ error: 'Failed to sign up.' });
    }
};
import { User } from "../models/User.ts";

export const resolvers = {
    Query: {
        users: async () => {
            try {
                return await User.find();
            } catch (error) {
                console.error('Error fetching users:', error);
                throw new Error('Failed to fetch users');
            }
        },
    },
    Mutation: {
        createUser: async (_: any, args: { name: string; email: string }) => {
            try {
                const newUser = new User({
                    name: args.name,
                    email: args.email,
                });
                await newUser.save();
                return newUser;
            } catch (error) {
                console.error('Error creating user:', error);
                throw new Error('Failed to create user');
            }
        },
    },
};

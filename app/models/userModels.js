import fs from 'fs';

const dbPath = './db.json';

const readData = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return null;
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.log(error);
    }
};

const User = {
    findAll: () => {
        const data = readData();
        return data ? data.users : [];
    },
    findByUsername: (username) => {
        const data = readData();
        return data ? data.users.find((user) => user.username === username) : null;
    },
    create: (user) => {
        const data = readData();
        if (data) {
            data.users.push(user);
            writeData(data);
        }
    },
    update: (username, updatedUser) => {
        const data = readData();
        if (data) {
            const userIndex = data.users.findIndex((user) => user.username === username);
            if (userIndex !== -1) {
                data.users[userIndex] = { ...data.users[userIndex], ...updatedUser };
                writeData(data);
            }
        }
    },
    delete: (username) => {
        const data = readData();
        if (data) {
            data.users = data.users.filter((user) => user.username !== username);
            writeData(data);
        }
    },
};

export default User;
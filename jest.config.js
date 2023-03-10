module.exports = {
    roots: ["<rootDir>/spec"],
    testMatch: [
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};

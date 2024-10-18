// @ts-check
/** @type {import('jest').Config} */
export default {
    testEnvironment: 'jsdom',
    collectCoverage: true,
    collectCoverageFrom: ["./src/distort-component.tsx"],
    coverageDirectory: "coverage",
    transform: {
        "^.+\\.(ts|tsx)$":[ 
            "ts-jest",
            {
                isolatedModules: true,
            },
        ] 
    },
    maxWorkers: 1,
};

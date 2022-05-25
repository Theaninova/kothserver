/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  "transform": {
    "^.+\\.[tj]s$": "ts-jest"
  },
  transformIgnorePatterns: [
    '/node_modules/(?!chess)',
  ],
};

/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jest-environment-jsdom', // Specify the jsdom environment
    transform: {
      '^.+\\.tsx?$': 'ts-jest', // Use ts-jest for TypeScript files
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Handle alias imports
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Setup file for jest-dom
  };
  
  module.exports = config;
  
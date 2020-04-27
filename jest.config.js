// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  setupFilesAfterEnv: ["jest-extended", "expect-more-jest", "jest-chain"],
  preset: "ts-jest",
  coverageDirectory: "reports/coverage",
  errorOnDeprecated: true,
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["<rootDir>/tests/**/*.(test|spec).(ts|js)"],
  notify: true,
  notifyMode: "failure-change",
}

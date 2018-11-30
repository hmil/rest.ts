module.exports = {
    "roots": [
      "<rootDir>"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "test/.*\\.test\\.ts$",
    "moduleFileExtensions": [
      "ts",
      "js",
      "json",
    ],
    "testEnvironment": "node",
    "collectCoverage": true,
    "coverageDirectory": "build/coverage",
    "coveragePathIgnorePatterns": [
      "node_modules",
      "test"
    ]
}
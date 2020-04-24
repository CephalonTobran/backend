import { FirebaseServiceAccount } from "@/functions"

describe("Firebase service account key collector", () => {
  it("accept a base64 encoded string and return a JSON string", () => {
    const input =
      "ewogICJWYWxpZCI6ICJUaGlzIGlzIHZhbGlkLiIsCiAgIkFsc29WYWxpZCI6ICJUaGlzIGlzIGFsc28gdmFsaWQhIgp9"
    const expectedOutput = JSON.parse(
      '{"Valid": "This is valid.", "AlsoValid": "This is also valid!"}'
    )
    const testResult = FirebaseServiceAccount(input)
    expect(testResult).toStrictEqual(expectedOutput)
  })

  it("throws an error if the key is empty", () => {
    expect(() => FirebaseServiceAccount("")).toThrow(
      "Firebase Admin credential key is not available or empty."
    )
  })

  it("throws an error if the key is null", () => {
    expect(() => FirebaseServiceAccount(null)).toThrow(
      "Firebase Admin credential key is not available or empty."
    )
  })

  it("throws an error if the key is not base64 encoded", () => {
    const input = "This is clearly not encoded in any way"
    expect(() => FirebaseServiceAccount(input)).toThrow(
      "Firebase Admin credential key is not a base64 encoded string."
    )
  })
})

import { connectToDatabase } from "@/lib/database"

describe("database connector", () => {
  // TODO: mock admin.initializeApp
  it.todo("should return a FirebaseFirestore.Firestore object on success")

  it("should throw an error if the key is empty", () => {
    expect(() => connectToDatabase("")).toThrow("Firebase Admin credential key was not provided")
  })

  it("should throw an error if the key is null", () => {
    expect(() => connectToDatabase(null)).toThrow("Firebase Admin credential key was not provided")
  })

  it("should throw an error if the key is not base64 encoded", () => {
    const input = "This is clearly not encoded in any way"
    expect(() => connectToDatabase(input)).toThrow(
      "Firebase Admin credential key could not be decoded from base64 to JSON"
    )
  })
})

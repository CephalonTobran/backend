import { Collectible, convertItemToCollectible } from "@/lib/collectibles"
import { Item } from "warframe-items"

describe("collectible object converter", () => {
  it("converts warframe-items Item to a warframe Collectible", () => {
    const input: Item = {
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "Dummy",
      description: "This is a dummy warframe for testing purposes.",
      masteryReq: 5,
      imageName: "dummy.png",
      category: "Warframes",
      tradable: false,
      introduced: "12.2.5",
      wikiaUrl: "http://warframe.fandom.com/wiki/Warframes",
      vaulted: false,
    }

    const expectedOutput: Collectible = {
      databaseID: "dummy",
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "Dummy",
      category: "Warframe",
      description: "This is a dummy warframe for testing purposes.",
      image: "dummy.png",
      masteryRequirement: 5,
      introduced: 12002005,
      wikiURL: "https://warframe.fandom.com/wiki/Warframes",
      isVaulted: false,
    }

    const testResult = convertItemToCollectible(input)
    expect(testResult).toStrictEqual(expectedOutput)
  })

  it("should throw an error if the unique name is missing", () => {
    const input: Item = {
      uniqueName: "",
      name: "Dummy",
      imageName: "dummy.png",
      category: "Warframes",
      tradable: false,
    }

    expect(() => convertItemToCollectible(input))
      .toThrow()
      .not.toThrow("There was an uncaught error")
  })

  it("should throw an error if the name is missing", () => {
    const input: Item = {
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "",
      imageName: "dummy.png",
      category: "Warframes",
      tradable: false,
    }

    expect(() => convertItemToCollectible(input))
      .toThrow()
      .not.toThrow("There was an uncaught error")
  })

  it("should throw an error if the image is missing", () => {
    const input: Item = {
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "Dummy",
      imageName: "",
      category: "Warframes",
      tradable: false,
    }

    expect(() => convertItemToCollectible(input))
      .toThrow()
      .not.toThrow("There was an uncaught error")
  })

  it("category defaults to 'Other' if the category is not recognised", () => {
    const input: Item = {
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "Dummy",
      imageName: "dummy.png",
      category: "Misc",
      tradable: false,
    }

    const expectedOutput: Collectible = {
      databaseID: "dummy",
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "Dummy",
      category: "Unknown",
    }

    const testResult = convertItemToCollectible(input)
    expect(testResult).toStrictEqual(expectedOutput)
  })

  it("warframe collectible uses valid defaults", () => {
    const input: Item = {
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "Dummy",
      imageName: "dummy.png",
      category: "Warframes",
      tradable: false,
    }

    const expectedOutput: Collectible = {
      databaseID: "dummy",
      uniqueName: "Test/Collectibles/Powersuits/Dummy",
      name: "Dummy",
      category: "Warframe",
      description: "",
      image: "dummy.png",
      masteryRequirement: 0,
      introduced: 0,
      wikiURL: "",
      isVaulted: false,
    }

    const testResult = convertItemToCollectible(input)
    expect(testResult).toStrictEqual(expectedOutput)
  })
})

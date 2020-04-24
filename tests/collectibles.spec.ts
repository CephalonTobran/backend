import { Collectible, convertItemToCollectible } from "@/collectibles"
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

  it.todo("handles missing warframe data")
})

import {
  devoidOfContent,
  cleanString,
  validName,
  validID,
  validUniqueName,
  validCategory,
  validDescription,
  validImage,
  validMasteryRank,
  validVersion,
  validWikiURL,
  validVaultedStatus,
} from "@/validators"

describe("string cleaner", () => {
  it("filters out HTML tags", () => {
    const input =
      '<p>This is a<br /> <strong>bold</strong> <script src="invader.com/explode.js">explode()</script>statement.</p>'
    const expectedOutput = "This is a bold statement."
    const testResult = cleanString(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("trims whitespace", () => {
    const input = "  This has too much padding.  \n"
    const expectedOutput = "This has too much padding."
    const testResult = cleanString(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("throws an error if the result is empty", () => {
    const input =
      '  <br /> <script src="invader.com/explode.js">explode()</script> \n'
    expect(() => cleanString(input)).toThrow()
  })
})

describe("devoid of content checker", () => {
  it("returns true when the input is empty", () => {
    expect(devoidOfContent("")).toBeTrue()
  })
  it("returns true when the input is null", () => {
    expect(devoidOfContent(null)).toBeTrue()
  })
  it("returns true when the input is undefined", () => {
    expect(devoidOfContent(undefined)).toBeTrue()
  })
})

describe("field validator", () => {
  it("for a unique name returns a clean unique name", () => {
    const input = "  <b>Proper/</b>Unique/<i>Name</i>  \n\n\n"
    const expectedOutput = "Proper/Unique/Name"
    const testResult = validUniqueName(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a database ID returns a clean, stub name", () => {
    const input = "  <b>Proper</b> database <i>ID</i>?  \n\n\n"
    const expectedOutput = "proper-database-id"
    const testResult = validID(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a name returns a clean name", () => {
    const input = "  <b>What</b> kind of a name is <i>this</i>?  \n\n\n"
    const expectedOutput = "What kind of a name is this?"
    const testResult = validName(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a category returns a clean category", () => {
    const input = "  <b><i>Category</i></b>  \n\n\n"
    const expectedOutput = "other"
    const testResult = validCategory(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a description returns a clean description", () => {
    const input = " This <i>is</i> a <b>tamed</b> description.  \n\n\n"
    const expectedOutput = "This is a tamed description."
    const testResult = validDescription(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for an image returns a clean image name", () => {
    const input = " <file>image</file>.png  \n\n\n"
    const expectedOutput = "image.png"
    const testResult = validImage(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for an image rejects a non image file", () => {
    const input = "image.exe"
    const expectedOutput = ""
    const testResult = validImage(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a mastery rank returns 0 as lowest output", () => {
    const input = -5
    const expectedOutput = 0
    const testResult = validMasteryRank(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a mastery rank returns 30 as highest output", () => {
    const input = 42
    const expectedOutput = 30
    const testResult = validMasteryRank(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a version returns 0 for vanilla", () => {
    const input = "Vanilla"
    const expectedOutput = 0
    const testResult = validVersion(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a version returns 0 for an invalid SemVer", () => {
    const input = "  <b>cool-patch"
    const expectedOutput = 0
    const testResult = validVersion(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a version returns sortable number for a major version", () => {
    const input = " <i>12</i> "
    const expectedOutput = 12000000
    const testResult = validVersion(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a version returns sortable number for a minor version", () => {
    const input = " <i>12.2</i> "
    const expectedOutput = 12002000
    const testResult = validVersion(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a version returns sortable number for a patch", () => {
    const input = " <i>12.2.5</i> "
    const expectedOutput = 12002005
    const testResult = validVersion(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a wikiURL returns a clean, valid URL", () => {
    const input = " <i>http://warframe.fandom.com/wiki/Warframes</i>"
    const expectedOutput = "https://warframe.fandom.com/wiki/Warframes"
    const testResult = validWikiURL(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a wikiURL rejects a non-wiki URL", () => {
    const input = " <i>https://somesite.com/wiki/Warframes</i>"
    const expectedOutput = ""
    const testResult = validWikiURL(input)
    expect(testResult).toBe(expectedOutput)
  })

  it("for a vaulted status returns true for non-empty value", () => {
    const input = " <em>some kind of crap</em>"
    const testResult = validVaultedStatus(input)
    expect(testResult).toBeTrue()
  })

  it("for a vaulted status returns false for an empty value", () => {
    const testResult = validVaultedStatus(0)
    expect(testResult).toBeFalse()
  })
})


declare module 'jsdom' {
  class JSDOM {
    constructor(html?: string)

    readonly window: Window
  }
}

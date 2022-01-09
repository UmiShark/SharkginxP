class JSRewriter {
  constructor(data, ctx) {
    return function JS(data, ctx) {
      return data.toString().replace(/(,| |=|\()document.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.pLocation`); }).replace(/(,| |=|\()window.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.pLocation`); }).replace('myScript=scripts[index]||', 'myScript=')
    }
  }
}

if (typeof module !== undefined) module.exports = JSRewriter
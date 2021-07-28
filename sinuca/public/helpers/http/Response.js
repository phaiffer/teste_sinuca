class Response {
  constructor(body = null, statusCode = 200, headers = {}) {
    this.statusCode = statusCode
    this.body = body
    this.headers = headers
  }

  static build(resultOrBody = null, statusCode = 200, headers = {}) {
    if (resultOrBody instanceof Response) {
      return resultOrBody.send()
    }
    return new Response(resultOrBody, statusCode, headers).send()
  }

  send() {
    return {
      statusCode: this.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...this.headers,
      },
      ...(this.body ? { body: JSON.stringify(this.body) } : {}),
    }
  }
}

function redirect(location, cached = true) {
  return new Response(null, cached ? 301 : 307, {
    Location: location,
  })
}

module.exports = {
  Response,
  redirect,
}

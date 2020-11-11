import jwtDecode from 'jwt-decode'

function isJson(res) {
  const contentType = res.headers.get('Content-Type')
  return /^application\/json/.test(contentType)
}

async function assertIsOk(res) {
  if (res.status === 400 && isJson(res)) {
    const { errors } = await res.json()
    const err = new Error('Validation error')
    err.name = 'ValidationError'
    err.errors = errors
    err.status = res.status
    throw err
  } else if (!res.ok || res.status >= 400) {
    const err = new Error(res.statusMessage)
    err.name = 'ApiError'
    err.status = res.status
    throw err
  }
}

function produceData(res) {
  return isJson(res) ? res.json() : res.body()
}

export class Api {
  constructor({ base = '', headers = {} }) {
    this._base = base
    this._headers = headers
  }

  set accessToken(value) {
    if (value) {
      localStorage.setItem('accessToken', value)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  get accessToken() {
    return localStorage.getItem('accessToken')
  }

  get headers() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      ...this._headers,
    }
  }

  get accessTokenPayload() {
    return jwtDecode(this.accessToken)
  }

  async get(url) {
    const res = await fetch(`${this._base}/${url}`, {
      method: 'GET',
      headers: this.headers
    })

    await assertIsOk(res)
    const data = await produceData(res)

    return data
  }

  async post(url, body) {
    const res = await fetch(`${this._base}/${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: this.headers
    })

    await assertIsOk(res)
    const data = await produceData(res)

    return data
  }

  async put(url, body) {
    const res = await fetch(`${this._base}/${url}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: this.headers
    })

    await assertIsOk(res)
    const data = await produceData(res)

    return data
  }

  async delete(url) {
    const res = await fetch(`${this._base}/${url}`, {
      method: 'DELETE',
      headers: this.headers
    })

    await assertIsOk(res)
  }
}

const api = new Api({
  base: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default api

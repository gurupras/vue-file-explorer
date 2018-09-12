const fs = require('fs')
const path = require('path')
const express = require('express')
const httpRewrite = require('http-rewrite-middleware')

const app = express()

app.use(httpRewrite.getMiddleware([
  // Strip '/api' from any incoming request
  {
    from: '^/api/(.*)$',
    to: '/$1'
  }
]))

const preDeterminedPaths = {
  'home': {
    absolutePath: '/home',
    isDirectory: true
  },
  'android': {
    absolutePath: '/android',
    isDirectory: true
  }
}

app.get('/get-mount-points', (req, res) => {
  const results = []
  Object.entries(preDeterminedPaths).forEach(([name, data]) => {
    results.push({
      name,
      isDirectory: data.isDirectory
    })
  })
  res.send(results)
})

app.get('/ls', async (req, res) => {
  const { query } = req
  const { paths } = query
  const results = await new Promise((resolve, reject) => {
    const results = []
    // Replace paths[0] with the path that we have since it may not be an absolutePath
    const basePathEntry = preDeterminedPaths[paths[0]]
    if (!basePathEntry) {
      return resolve(results)
    }
    const basePath = basePathEntry.absolutePath
    const absolutePath = path.join(basePath, ...paths.splice(1))
    fs.readdir(absolutePath, (err, entries) => {
      if (err) {
        return resolve(results)
      }
      entries.forEach((name) => {
        const fullPath = path.join(absolutePath, name)
        try {
          const stat = fs.statSync(fullPath)
          const isDirectory = stat.isDirectory()
          results.push({
            name,
            isDirectory
          })
        } catch (e) {
        }
      })
      resolve(results)
    })
  })
  res.send(results)
})

app.listen(9432, () => console.log('Example app listening on port 9432!'))

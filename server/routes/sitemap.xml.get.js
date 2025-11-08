import { SitemapStream, streamToPromise } from 'sitemap'

export default defineEventHandler(async (event) => {
  try {
    const sitemap = new SitemapStream({
      hostname: 'http://localhost:3003'
    })

    const routes = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/blog', changefreq: 'weekly', priority: 0.9 },
    ]

    for (const route of routes) {
      sitemap.write(route)
    }
    
    sitemap.end()

    const data = await streamToPromise(sitemap)
    
    setHeader(event, 'Content-Type', 'application/xml')
    return data
  } catch (error) {
    console.error('Sitemap generation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error generating sitemap'
    })
  }
})
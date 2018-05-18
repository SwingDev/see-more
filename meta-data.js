const siteUrl = process.env.WEBSITE_BASE_URL

module.exports = {
  SITE_URL: process.env.WEBSITE_BASE_URL,
  TITLE: 'See More - SwingDev\'s AR experience',
  OG_COVER: `${siteUrl}/og-cover.jpg`,
  OG_COVER_TWITTER: `${siteUrl}/og-cover-twitter.jpg`,
  TWITTER_HANDLE: '@swingdevio',
  OG_COVER_ALT: 'SwingDev spaceship is docked at Front-Trends 2018',
  KEYWORDS: [
    'ar',
    'front trends 2018',
    'business',
    'silicon valley',
    'programming',
    'startups',
    'developers',
    'javascript',
    'node.js'
  ].join(', '),
  DESCRIPTION: `
    Find SwingDev's spaceship with See More AR experience!
  `
}

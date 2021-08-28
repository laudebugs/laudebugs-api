const { Client, APIErrorCode } = require('@notionhq/client')

// Initializing a client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN
})
const doSth = async () => {
  const listUsersResponse = await notion.users.list()
  // console.log(listUsersResponse)
}
// doSth()

// Add any filters here
const filter = {}
const getBlog = async () => {
  try {
    const db = await notion.databases.retrieve({
      database_id: process.env.NOTION_BLOG_DB_ID
    })
    // console.log(db)
    const blog = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB_ID
      // filter: filter
    })
    // console.log(blog)
  } catch (error:any) {
    if (error.code === APIErrorCode.ObjectNotFound) {
      //
      // For example: handle by asking the user to select a different database
      //
    } else {
      // Other error handling code
      console.error(error.message)
    }
  }
}
const getPublishedpages = () => {
  return notion.databases.query({
    database_id: process.env.NOTION_BLOG_DB_ID
  })
}
const getPageBlocks = (page_id: string) => {
  return notion.blocks.children.list({
    block_id: page_id
  })
}

getPublishedpages().then(async query => {
  const getPages = () =>
    Promise.all(
      query.results.map(page => {
        const pageBlocks = getPageBlocks(page.id)
        return pageBlocks
      })
    )
  getPages().then(results => {
    // console.log(JSON.stringify(results))
  })
})

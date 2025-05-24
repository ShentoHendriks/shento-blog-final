import FlexSearch from 'flexsearch'

let postsIndex
let posts

export function createSearchIndex(allPosts) {
  postsIndex = new FlexSearch.Index({
    tokenize: 'forward',
    cache: 100,
    resolution: 9,
    optimize: true,
    worker: false
  })

  posts = allPosts

  allPosts.forEach((post, index) => {
    // Create searchable content from title and any other frontmatter fields
    const searchableContent = `${post.data.title} ${post.data.description || ''} ${post.data.tags?.join(' ') || ''}`
    postsIndex.add(index, searchableContent)
  })
}

export function searchPosts(query) {
  if (!query || !postsIndex) return []
  
  const results = postsIndex.search(query, { limit: 10 })
  return results.map(index => posts[index])
}
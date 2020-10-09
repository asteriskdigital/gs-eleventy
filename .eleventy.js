module.exports = function(eleventyConfig) {
  
    eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

    eleventyConfig.setTemplateFormats([
      "html",
      "md",
      "png",
      "jpeg"
    ]);
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("posts/*.md")
                .filter((item)=> {
                    // ignore _index.md
                    return item.fileSlug !== "_index"
                })
                .sort(function(a, b) {
                    return b.date - a.date;
                });
    });
  };


  function extractExcerpt(article) {
    if (!article.hasOwnProperty('templateContent')) {
      console.warn('Failed to extract excerpt: Document has no property "templateContent".');
      return null;
    }
   
    let excerpt = null;
    const content = article.templateContent;
   
    // The start and end separators to try and match to extract the excerpt
    const separatorsList = [
      { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
      { start: '<p>', end: '</p>' }
    ];
   
    separatorsList.some(separators => {
      const startPosition = content.indexOf(separators.start);
      const endPosition = content.indexOf(separators.end);
   
      if (startPosition !== -1 && endPosition !== -1) {
        excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
        return true; // Exit out of array loop on first match
      }
    });
   
    return excerpt;
  }
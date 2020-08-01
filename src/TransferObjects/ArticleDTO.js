const ArticleDTO = (data) => {
    return {
        title: data.title,
        url: data.url,
        tags: data.tags,
        publishedDate: new Date(data.published_at),
    };
};

module.exports = ArticleDTO;
const ArticlesRepository = require('./Repositories/ArticlesRepository');
const TemplateEngine = require('./Services/TemplateEngine');
const fs = require('fs');

(async () => {
    const articles = await ArticlesRepository.getAll();
    let latestArticlesSection = '';

    if (articles.length > 0) {
        const list = articles.map(a => {
            return `- [${a.title}](${a.url})\r\n`;
        }).join('');
        await TemplateEngine.loadTemplate('latestArticles.md')
            .then(() => {
                TemplateEngine.compile({ list: list })
                    .then(section => {
                        latestArticlesSection = section;
                    });
            })
    }
    console.log("section", latestArticlesSection);

    await TemplateEngine.loadTemplate('template.md')
    .then(() => {
        TemplateEngine.compile({ latestArticles: latestArticlesSection })
            .then(page => {
                fs.writeFile(__dirname + '/../README.md', page, 'utf8', () => console.log("Readme updated!"));
            });
    });
    
})();




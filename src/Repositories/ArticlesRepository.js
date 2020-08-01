const axios = require('axios');
const ArticleDTO = require('../TransferObjects/ArticleDTO.js');

const ARTICLES_URL = 'https://dev.to/api/articles?username=zeegcl';

class ArticlesRepository
{
    constructor()
    {
        this.cache = null;
    }

    async fetchData()
    {
        return await axios.get(ARTICLES_URL)
            .then(response => {
                let articles = response.data.map(a => ArticleDTO(a));

                return articles.sort((a, b) => {
                        if (a.publishedDate > b.publishedDate) return -1;
                        if (a.publishedDate < b.publishedDate) return 1;
                        return 0;
                    });
            })
            .catch(error => {
                console.log('Error fetching url. ' + error.message);
                return [];
            })
            .finally(result => {
                this.cache = result;
            });
    }

    async getData()
    {
        if (!this.cache) {
            this.cache = await this.fetchData();
        }
        
        return this.cache;
    }

    clearCache()
    {
        this.cache = null;
    }

    async getAll()
    {
        return await this.getData()
            .then(data => {
                return data;
            });
    }

    async get(count = 1)
    {
        return await this.getData()
            .then(data => {
                return data.slice(0, count);
            });
    }

    async getLatest()
    {
        return await this.getData()
            .then(data => {
                return data[0];
            });
    }
}

module.exports = new ArticlesRepository;
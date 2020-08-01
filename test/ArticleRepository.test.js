const axios = require('axios');
const ArticlesRepository = require('../src/Repositories/ArticlesRepository.js');

const mockData = require('./resources/mockArticlesData.json');
let endpointCall = null;

afterEach(() => {
    ArticlesRepository.clearCache();
})

describe('articles repository access with successful api calls', () => {

    beforeEach(() => {
        endpointCall = jest.spyOn(axios, 'get')
            .mockImplementation(() => {
                return new Promise(resolve => {
                    return resolve({
                        statusText: 'OK',
                        data: mockData,
                    });
                })
            });
    });

    test('articles repository returns an array of items when api call is successful', done => {
        ArticlesRepository.getAll()
            .then(articles => {
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBeGreaterThan(0);
                done();
            });
    });
    
    test('articles repository returns the amount of items passed by parameter', done => {
        const count = 2;
    
        ArticlesRepository.get(count)
            .then(articles => {
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBe(count);
                done();
            });
    });
    
    test('articles repository can get the latest article published', done => {
        ArticlesRepository.getLatest()
            .then(article => {
                expect(article.title).toBe('Third');
                done();
            });
    });
    
    test('articles repository just makes one api call for multiple method calls', done => {
        ArticlesRepository.getAll()
            .then(() => { return ArticlesRepository.getAll(); })
            .then(() => { return ArticlesRepository.getAll(); })
            .then(() => {
                expect(endpointCall).toHaveBeenCalledTimes(1);
                done();
            });
    });

    test('articles repository always get an array from function getdata()', done => {
        ArticlesRepository.getData()
            .then(data => {
                expect(Array.isArray(data)).toBe(true);
                done();
            })
    });
});

describe('articles repository access with failed api calls', () => {
    beforeEach(() => {
        endpointCall = jest
            .spyOn(axios, 'get')
            .mockImplementation(() => {
                return new Promise((_, reject) => {
                    return reject('');
                })
            });
    });

    test('articles repository returns an empty array of items when api call fails', done => {
        ArticlesRepository.getAll()
            .then(articles => {
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBe(0);
                done();
            });
    
    });
});


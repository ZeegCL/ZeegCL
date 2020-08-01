const ArticlesRepository = require('../src/Repositories/ArticlesRepository.js');

test('article dto has the minimal expected attributes for listing', done => {
    ArticlesRepository.clearCache();

    ArticlesRepository.getLatest()
        .then(article => {
            expect(Object.keys(article).includes('title')).toBe(true);
            expect(Object.keys(article).includes('url')).toBe(true);
            expect(Object.keys(article).includes('publishedDate')).toBe(true);
            done();
        });
});
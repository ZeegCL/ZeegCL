const TemplateEngine = require('../src/Services/TemplateEngine.js');

test('template engine can load a template from file', () => {
    TemplateEngine.setTemplateDirectory(__dirname + '/resources/');
    return TemplateEngine.loadTemplate('mockTemplate.md')
        .then(() => {
            const page = TemplateEngine.getRawPage();
            expect(page).not.toBe('');
        })
});

test('template engine can interpolate variables in the template', done => {
    TemplateEngine.setTemplateDirectory(__dirname + '/resources/');
    TemplateEngine.loadTemplate('mockTemplate.md')
        .then(() => {
            const vars = { slot: 'HELLO WORLD' };
            TemplateEngine.compile(vars)
                .then(page => {
                    expect(page).toEqual(expect.stringContaining(vars.slot));
                    done();
                })
        })
});


test('template engine can interpolate a list in the template', done => {

    const axios = require('axios');
    const ArticlesRepository = require('../src/Repositories/ArticlesRepository.js');
    const mockData = require('./resources/mockArticlesData.json');
    jest.spyOn(axios, 'get')
            .mockImplementation(() => {
                return new Promise(resolve => {
                    return resolve({
                        statusText: 'OK',
                        data: mockData,
                    });
                })
            });

    ArticlesRepository.getAll()
        .then(articles => {
            TemplateEngine.setTemplateDirectory(__dirname + '/resources/');
            TemplateEngine.loadTemplate('mockTemplate.md')
                .then(() => {
                    const list = articles.map(a => {
                        return `- [${a.title}](${a.url})\r\n`;
                    }).join('');
                    const vars = { slot: list };

                    TemplateEngine.compile(vars)
                        .then(page => {
                            expect(page).toEqual(expect.stringContaining(vars.slot));
                            done();
                        })
                })
        });
});

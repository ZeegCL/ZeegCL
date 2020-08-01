const fs = require('fs');

const DEFAULT_TEMPLATE = 'template.md';
const BASE_DIR = __dirname + '/../Templates/';

class TemplateEngine
{
    constructor()
    {
        this.template = '';
        this.directory = BASE_DIR;
    }

    setTemplateDirectory(path)
    {
        if (fs.existsSync(path)) {
            this.directory = path;
        }
    }

    async loadTemplate(template = DEFAULT_TEMPLATE)
    {
        const absPath = this.directory + template;

        if (fs.existsSync(absPath)) {
            await new Promise((resolve, reject) => {
                fs.readFile(absPath, 'utf8', (err, data) => {
                    if (err) reject(err);

                    resolve(data);
                });
            })
            .then(data => {
                this.template = data;
            });
        }
    }

    getRawPage()
    {
        return this.template;
    }

    async compile(vars)
    {
        if (!this.template) return '';

        return this.template.replace(/{{\s+([^}]*)\s+}}/g, (r, k) => {
            return vars[k];
        });
    }
}

module.exports = new TemplateEngine;
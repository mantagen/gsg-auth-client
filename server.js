require('env2')('.env');

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Path = require('path');

const routes = require('./routes.js');

const port = 1212;

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({ port: port });

server.register([Inert, Vision], (err) => {

    if (err) {
        throw err;
    }
    server.views({
        engines: {
          html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'views',
        layoutPath: 'views/layout',
        layout: 'default',
        partialsPath: 'views/partials',
    });

    server.route(routes);

    server.start((err) => {
        console.log('Server listening at: http://localhost:' + port);
        if (err) {
            throw err;
        }
    });
});

module.exports = server;

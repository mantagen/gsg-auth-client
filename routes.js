module.exports = [{
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true
        }
    }
},{
    method: 'GET',
    path: '/',
    handler: (req, reply) => {
        reply.view('login');
    },
}]

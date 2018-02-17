module.exports = {
    route: "/sample",
    method: "GET",
    handler: function(req, res) {
        res.send('It works!');
    }
};
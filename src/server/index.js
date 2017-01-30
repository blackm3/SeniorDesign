/**
 * Created by dannycarr on 1/30/17.
 */

'use strict';

let express = require('express');

let app = express();
app.use(express.static('public'));

app.post('/v1/correlate')

let server = app.listen(8080, function() {
    console.log('App listening on ' + server.address().port);
});
/**
 * Created by dannycarr on 1/30/17.
 */

'use strict';

let express     = require('express'),
    fileUpload  = require('express-fileupload'),
    PythonShell = require('python-shell'),
    path        = require('path'),
    csv         = require('csv'),
    fs          = require('fs');

let app = express();
app.use(fileUpload());
app.use(express.static('public'));

PythonShell.defaultOptions = {
    scriptPath: path.join(__dirname, '../engine/'),
    pythonPath: '/Library/Frameworks/Python.framework/Versions/3.5/bin/python3.5'
};

app.post('/v1/correlate', function(req, res) {
    let dataFile = req.files.srcData;

    dataFile.mv(path.join(__dirname, '../engine/data.csv'), function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            let pyShell = new PythonShell('Main.py');
            pyShell.on('message', function(message) {
                console.log(message);
            });
            pyShell.end(function(err) {
                if (err) {
                    throw err;
                }
                console.log('finished');
                res.status(200).send();
            })
        }
    });
});

let server = app.listen(8080, function() {
    console.log('App listening on ' + server.address().port);
});
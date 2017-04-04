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
    let dataFile = req.files.srcData,
        corrMatrix = [];

    if (fs.existsSync(path.join(__dirname, 'corrMatrix.json'))) {
        fs.unlink(path.join(__dirname, 'corrMatrix.json'), (err) => { if (err) throw err; });
    }

    dataFile.mv(path.join(__dirname, 'data.csv'), function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            let pyShell = new PythonShell('Main.py');
            pyShell.on('message', function(message) {
                corrMatrix = JSON.parse(message);
                console.log('PYSHELL:', message);
            });
            pyShell.end(function(err) {
                if (err) {
                    throw err;
                }
                fs.writeFile(path.join(__dirname, "corrMatrix.json"), JSON.stringify(corrMatrix), "utf8", (err) => {
                    if (err) throw err;
                    console.log('file written');
                });
                fs.unlink(path.join(__dirname, 'data.csv'), (err) => { if (err) throw err; });
                res.redirect('/visualize.html');
            })
        }
    });
});

app.get('/v1/visualize', function(req, res) {
    let corrMatrix = JSON.parse(fs.readFileSync(path.join(__dirname, 'corrMatrix.json'), 'utf8'));
    console.log('VISUALIZE:', corrMatrix);
    res.status(200).send(corrMatrix);
});

let server = app.listen(8080, function() {
    console.log('App listening on ' + server.address().port);
});
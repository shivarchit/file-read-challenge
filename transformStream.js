const fs = require("fs");
const stream = require("stream");
const es = require("event-stream");

const promiseFn = function (data) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(data.toString());
            resolve();
        }, 2000);
    });
};

const asyncFunction = async function (data, cb) {
    await promiseFn(data);
    cb();
};

class WorkerThing extends stream.Transform {
    _transform(chunk, encoding, cb) {
        asyncFunction(chunk, cb);
    }
}

const workerThing = new WorkerThing();

const readStream = fs.createReadStream("test.txt");
readStream.setEncoding("utf-8");

readStream
    .pipe(es.split())
    .pipe(workerThing);

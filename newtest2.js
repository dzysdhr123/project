
var util = require('util');
var async = require('async');
var bleno = require('../..');

var BlenoCharacteristic = bleno.Characteristic;
var exec = require('child_process').exec;
var cmds = ['100', '200', '300'];
var no = 0;
var json = 0;

var EchoCharacteristic = function() {
    EchoCharacteristic.super_.call(this, {
        uuid: 'ec0e',
        properties: ['read', 'write', 'notify'],
        value: null
    });

    this._value = new Buffer(0);
    //this._updateValueCallback = null;
};

util.inherits(EchoCharacteristic, BlenoCharacteristic);


var execCmd = function(callback) {

    var final_res = 0;
    var end_flag = false;
    exec('python3.5 final.py ' + cmds[no++], function(error, stdout, stderr) {
        if (error) {
            console.error('error: ' + error);
            return;
        }
        json = JSON.parse(stdout);

        if (json != 0) {
            console.log('Face Recognition: Yes!!' + json);
        }
        final_res = json.toString(16);;
        end_flag = true;
        console.log('This Value = ' + final_res);
        callback(null, final_res)
    });

}

var execCmd2 = function(callback) {

    var final_res2 = 0;
    var end_flag = false;
    exec('python3.5 dataset.py ' + cmds[no++], function(error, stdout, stderr) {
        if (error) {
            console.error('error: ' + error);
            return;
        }
        json = JSON.parse(stdout);

        if (json = 1) {
            console.log('New Faces has been added!! there are total faces=' + json);
        }
        final_res2 = json.toString(16);
        end_flag = true;
        callback(null, final_res2)
    });

}


var execCmd3 = function(callback) {

    var final_res3 = 0;
    var end_flag = false;
    exec('python3.5 dataset.py ' + cmds[no++], function(error, stdout, stderr) {
        if (error) {
            console.error('error: ' + error);
            return;
        }
        json = JSON.parse(stdout);

        if (json = 1) {
            console.log('New Faces has been added!! there are total faces=' + json);
        }
        final_res3 = json.toString(16);
        end_flag = true;
        callback(null, final_res2)
    });

}

EchoCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

    callback(this.RESULT_SUCCESS, this._value);
};



EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    var a = data.readUInt16BE(0);

    console.log('EchoCharacteristic - onWriteRequest: value = ' + a);


    var _this = this;
    if (a == '0001') {
        async.series([execCmd], function(err, result) {
            _this._value = result;
            callback(this.RESULT_SUCCESS);
        })
    } else if (a == '0002') {
            async.series([execCmd2], function(err, result) {
            _this._value = result;
            callback(this.RESULT_SUCCESS);
        });
    } else if (a == '0003') {
            async.series([execCmd3], function(err, result) {
            _this._value = result;
            callback(this.RESULT_SUCCESS);
        });
    } 
    









};

EchoCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('EchoCharacteristic - onSubscribe');

    this._updateValueCallback = updateValueCallback;
};

EchoCharacteristic.prototype.onUnsubscribe = function() {
    console.log('EchoCharacteristic - onUnsubscribe');

    this._updateValueCallback = null;
};

module.exports = EchoCharacteristic;

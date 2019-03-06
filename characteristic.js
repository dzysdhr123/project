var util = require('util');

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


function execCmd() {
    exec('python3.5 final.py '+ cmds[no++], function (error, stdout, stderr) {
        if(error){
            console.error('error: ' + error);
            return;
        }
        json = JSON.parse(stdout);
        
        if(json == '0001'){
          
            console.log('Face Recognition: Yes!!'+json);
            }
            
            
      });
      this._value = json;
      console.log('This Value = '+this._value);
}


EchoCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('EchoCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

EchoCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {

var a = data.readUInt16BE(0);
  
  console.log('EchoCharacteristic - onWriteRequest: value = ' + a);
  if(a == '0001'){
            execCmd();
            }
            
            
  if (this._updateValueCallback) {
    console.log('EchoCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
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

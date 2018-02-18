var Web3 = require('web3');
var Gpio = require('onoff').Gpio;
var SerialPort = require("serialport");
var arduino = new SerialPort("/dev/ttyUSB0", {
	  baudRate: 9600
});
var Readline = SerialPort.parsers.Readline;

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var bucketABI = web3.eth.contract( [{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newHumidity","type":"uint256"}],"name":"setHumidity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleLight","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getSoilMoisture","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getLightIntensity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newSoilMoisture","type":"uint256"}],"name":"setSoilMoisture","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getHumidity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleExhaust","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"isIntakeActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newTemp","type":"uint256"}],"name":"setTemp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"growToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newName","type":"string"},{"name":"_newBucketAddress","type":"address"}],"name":"createGrow","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newLightIntensity","type":"uint256"}],"name":"setLightIntensity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleIntake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"growToBucket","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"isExhaustActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"isLightActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleWater","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"grows","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"temp","type":"uint256"},{"name":"humidity","type":"uint256"},{"name":"soilMoisture","type":"uint256"},{"name":"lightIntensity","type":"uint256"},{"name":"intakeActive","type":"bool"},{"name":"exhaustActive","type":"bool"},{"name":"waterActive","type":"bool"},{"name":"lightActive","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"isWaterActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getTemp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"name","type":"string"}],"name":"GrowAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"temp","type":"uint256"}],"name":"TempChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"humidity","type":"uint256"}],"name":"HumidityChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"soilMoisture","type":"uint256"}],"name":"SoilMoistureChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"lightIntensity","type":"uint256"}],"name":"LightIntensityChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"intakeActive","type":"bool"}],"name":"IntakeToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"exhaustActive","type":"bool"}],"name":"ExhaustToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"waterActive","type":"bool"}],"name":"WaterToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"lightActive","type":"bool"}],"name":"LightToggled","type":"event"}] );

var bucket = bucketABI.at('0x2871Ccb8CB017f8b13D21785c166df45C33Be7A9');

var intakeFan = new Gpio(26, 'out'); //first three use addon RasPi board
var exhaustFan = new Gpio(20, 'out');
var waterPump = new Gpio(21, 'out');
waterPump.writeSync(1);
var indoorLight = new Gpio(16, 'out'); //using Adafruit relay
var bucketID = 5;
bucket.isIntakeActive(5, function(error, result){
	if(!error){
		if(result == 0){ 
			intakeFan.writeSync(1);
		} else {
			intakeFan.writeSync(0);
		}
	}
});

bucket.isExhaustActive(5, function(error, result){
	if(!error){
		if(result == 0){ 
			exhaustFan.writeSync(1);
		} else {
			exhaustFan.writeSync(0);
		}
	}
});

var intakeEvent = bucket.IntakeToggled( {}, function(error, result) {
	if(!error){
		if(result.args.intakeActive == 0){
			console.log("intake set to off");
			intakeFan.writeSync(1);
		} else {
			console.log("intake set to on");
			intakeFan.writeSync(0);
		}
	}
});

var exhaustEvent = bucket.ExhaustToggled( {}, function(error, result) {
	if(!error){
		if(result.args.exhaustActive == 0){
			console.log("exhaust set to off");
			exhaustFan.writeSync(1);
		} else {
			console.log("exhasut set to on");
			exhaustFan.writeSync(0);
		}
	}
});


var parser = new Readline();
arduino.pipe(parser);
parser.on('data', function(data) {
	console.log(data);
	var obj = JSON.parse(data);
	console.log("temmpy");
	console.log(obj.temperature);

});


var Web3 = require('web3');
var Gpio = require('onoff').Gpio;
var SerialPort = require("serialport");
var arduino = new SerialPort("/dev/ttyUSB0", {
	  baudRate: 9600
});
var Readline = SerialPort.parsers.Readline;

//dynamicDNS stuff
var cmd=require('node-cmd');
var localip = require('local-ip');
var iface = 'wlan0';
var myIpAddress;


var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var bucketABI = web3.eth.contract( [{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newHumidity","type":"uint256"}],"name":"setHumidity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleLight","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getSoilMoisture","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getGrowIdByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getLightIntensity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newSoilMoisture","type":"uint256"}],"name":"setSoilMoisture","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_ownerAddress","type":"address"}],"name":"getGrowCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getHumidity","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleExhaust","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"isIntakeActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newTemp","type":"uint256"}],"name":"setTemp","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"growToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newName","type":"string"},{"name":"_newBucketAddress","type":"address"}],"name":"createGrow","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newLightIntensity","type":"uint256"}],"name":"setLightIntensity","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleIntake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"growToBucket","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"ownerToGrow","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"},{"name":"_newIpAddress","type":"string"}],"name":"setIpAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"isExhaustActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"isLightActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_growId","type":"uint256"}],"name":"toggleWater","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"grows","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"ipAddress","type":"string"},{"name":"temp","type":"uint256"},{"name":"humidity","type":"uint256"},{"name":"soilMoisture","type":"uint256"},{"name":"lightIntensity","type":"uint256"},{"name":"intakeActive","type":"bool"},{"name":"exhaustActive","type":"bool"},{"name":"lightActive","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getTemp","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"ownerGrowCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_growId","type":"uint256"}],"name":"getIpAddress","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"name","type":"string"}],"name":"GrowAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"temp","type":"uint256"}],"name":"TempChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"humidity","type":"uint256"}],"name":"HumidityChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"soilMoisture","type":"uint256"}],"name":"SoilMoistureChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"lightIntensity","type":"uint256"}],"name":"LightIntensityChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"ipAddress","type":"string"}],"name":"IpChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"intakeActive","type":"bool"}],"name":"IntakeToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"exhaustActive","type":"bool"}],"name":"ExhaustToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"WaterToggled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"lightActive","type":"bool"}],"name":"LightToggled","type":"event"}] );

var bucket = bucketABI.at('0x47Db09cF9837174ff3f75AC5E167D4Fc487527E1');

//users should check the contract for their bucketID after creating a new grow
//this should be a command line argument/value in future versions
var myBucketID = 11;

//setting up the RasPi GPIO board for relays
var intakeFan = new Gpio(26, 'out'); 
var exhaustFan = new Gpio(20, 'out');
var waterPump = new Gpio(21, 'out');
waterPump.writeSync(1);
var indoorLight = new Gpio(16, 'out');

//DynamicDNS resolution
//Geth was throwing an invalid address unless we specifically input the sender address in the transaction objects
//All over transaction values (gas limit, etc.) are default
localip(iface, function(err, res) {
	if(!err) {
		bucket.getIpAddress(myBucketID, function(error, result) {
			if(!error) {
				myIpAddress = res;
				if( result != myIpAddress ) {
					bucket.setIpAddress(myBucketID, myIpAddress, {from: "0x4517138fa79429ae0ffa3bf593dd996211f26a38"}, function(err,res){});
				}
			}
		});
	}
});

//Following functions check the state of the contract when the bucket boots
bucket.isIntakeActive(myBucketID, function(error, result){
	if(!error){
		if(result == 0){ 
			intakeFan.writeSync(0);
		} else {
			intakeFan.writeSync(1);
		}
	}
});

bucket.isExhaustActive(myBucketID, function(error, result){
	if(!error){
		if(result == 0){ 
			exhaustFan.writeSync(0);
		} else {
			exhaustFan.writeSync(1);
		}
	}
});

bucket.isLightActive(myBucketID, function(error, result){
	if(!error){
		if(result == 0){
			indoorLight.writeSync(1);
		} else {
			indoorLight.writeSync(0);
		}
	}
});


//functions listen for state changes & corresponding event from the smart contract
var intakeEvent = bucket.IntakeToggled( {'id': myBucketID}, function(error, result) {
	if(!error){
		if(result.args.intakeActive == 0){
			console.log("intake set to off");
			intakeFan.writeSync(0);
		} else {
			console.log("intake set to on");
			intakeFan.writeSync(1);
		}
	}
});

var exhaustEvent = bucket.ExhaustToggled( {'id': myBucketID}, function(error, result) {
	if(!error){
		if(result.args.exhaustActive == 0){
			console.log("exhaust set to off");
			exhaustFan.writeSync(0);
		} else {
			console.log("exhasut set to on");
			exhaustFan.writeSync(1);
		}
	}
});

var waterEvent = bucket.WaterToggled( {'id': myBucketID}, function(error, result) {
	if(!error){
		waterPump.writeSync(0);
		console.log("water pump activated");
		setTimeout( function() {
			waterPump.writeSync(1);
		}, 2000);
	}
});

var lightEvent = bucket.LightToggled( {'id': myBucketID}, function(error, result) {
	if(!error){
		if(result.args.lightActive == 0){
			indoorLight.writeSync(1);
			console.log("turning light off");
		} else {
			indoorLight.writeSync(0);
			console.log("turning light on");
		}
	}
});


//Setting up environmental sensors
var temperature = 0;
var humidity = 0;
var soilMoisture = 0;
var lightIntensity = 0;

//Listens via USB serial to Arduino sensor output
var parser = new Readline();
arduino.pipe(parser);
parser.on('data', function(data) {
	console.log(data);
	var sensors = JSON.parse(data);

	//Only changes the contract/bucket state if the environment (e.g temp) changes past user defined threshold
	//Example: Only update temperature if it changes by more than 1.0 degrees
	if( Math.abs(sensors.temperature - temperature) > 1 )
	{
		console.log("updating new temp: ", sensors.temperature);
		temperature = sensors.temperature;
		bucket.setTemp(myBucketID, temperature, {from: "0x4517138fa79429ae0ffa3bf593dd996211f26a38"}, function(err, res){if(err){console.log(err)} });
	}

	if( Math.abs(sensors.humidity - humidity) > 1 ){
		console.log("updating new humidity: ", sensors.humidity);
		humidity = sensors.humidity;
		bucket.setHumidity(myBucketID, humidity, {from: "0x4517138fa79429ae0ffa3bf593dd996211f26a38"}, function(err, res){});
	}

	if( Math.abs(sensors.moisture - soilMoisture) > 10){
		console.log("updating new soil moisture: ", sensors.moisture);
		soilMoisture = sensors.moisture;
		bucket.setSoilMoisture(myBucketID, Math.abs(soilMoisture), {from: "0x4517138fa79429ae0ffa3bf593dd996211f26a38"}, function(err, res){});
	}

	if( Math.abs(sensors.lightIntensity - lightIntensity) > 100){
		console.log("updating new light intensity: ", sensors.lightIntensity);
		lightIntensity = sensors.lightIntensity;
		bucket.setLightIntensity(myBucketID, lightIntensity, {from: "0x4517138fa79429ae0ffa3bf593dd996211f26a38"}, function(err, res){});
	}

});

//start webcam
//cmd.run("mjpg_streamer -i \"input_uvc.so -r 320x240\" -o \"output_http.so -p 8080\"");


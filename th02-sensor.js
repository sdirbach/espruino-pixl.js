I2C1.setup({ scl : A5, sda: A4 });

var debug = false;

var deviceAddress = 0x40;
var startRegister = 0x03;
var startCommandHumidity = 0x01;
var startCommandTemperature = 0x11;

var tries = 5;

read = function(addr, reg, len) {
  I2C1.writeTo(addr, reg);
  return I2C1.readFrom(addr, len);
};
write = function(addr, reg, data) {
  I2C1.writeTo(addr, [reg, data]);
};

LED1.write(true);
setInterval(function() {
  Terminal.println("===");
  Terminal.println("Starte Messung:");
  //Terminal.println("Luftfeuchtigkeit: " + readHumidity() + "%RH");
  Terminal.println("Temperatur: " + readTemperature() + "°C");
}, 5000);

readHumidity = function() {
  I2C1.writeTo(deviceAddress, [startRegister, startCommandHumidity]);
  if(!waitForReady()) {
    return -1;
  }
  var d = read(deviceAddress, 0, 3);
  var rawValue = (d[1] << 8 | d[0]) >> 4;
  if(debug) {
      Terminal.println(""+status);
      Terminal.println((d[1] << 8 | d[0]));
      Terminal.println((d[1] << 8 | d[0]) >> 4);
  } else {
    var humidity = (rawValue / 16) - 24;
    return humidity;
  }
}

readTemperature = function() {
  I2C1.writeTo(deviceAddress, [startRegister, startCommandTemperature]);
  if(!waitForReady()) {
    return -1;
  }
  var d = read(deviceAddress, 0, 3);
  var rawValue = (d[1] << 8 | d[0]) >> 2;
  if(debug) {
      Terminal.println(""+status);
      Terminal.println((d[1] << 8 | d[0]));
      Terminal.println((d[1] << 8 | d[0]) >> 2);
  } else {
    var temperature = (rawValue / 32) - 50;
    return temperature;
  }
}

waitForReady = function() {
  for(i = 0; i < tries; i++) {
    var d = read(deviceAddress, 0, 3);
    
    var status = d[2] & 0x01;
    if(status == 0) {
      return true;
    }
  }
  return false;
}

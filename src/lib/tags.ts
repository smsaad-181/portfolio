/**
 * formatTag() — display casing for free-text tags and skill categories.
 * Content stores them lowercase; naive title-casing produces "Iot", "Esp32",
 * "Pcb Design". This keeps acronyms, part numbers and brand casing right.
 */
const WORDS: Record<string, string> = {
  iot: "IoT", pcb: "PCB", eda: "EDA", mcu: "MCU", usb: "USB", "usb-c": "USB-C",
  i2c: "I²C", "i²c": "I²C", spi: "SPI", uart: "UART", gpio: "GPIO", adc: "ADC",
  rtc: "RTC", nvs: "NVS", ntp: "NTP", mqtt: "MQTT", lora: "LoRa", lorawan: "LoRaWAN",
  gps: "GPS", gnss: "GNSS", ble: "BLE", wifi: "Wi-Fi", "wi-fi": "Wi-Fi",
  oled: "OLED", tft: "TFT", lcd: "LCD", led: "LED", rgb: "RGB", ir: "IR",
  ecg: "ECG", spo2: "SpO₂", pm: "PM", "pm2.5": "PM2.5", soc: "SoC", bms: "BMS",
  rs485: "RS485", "rs-485": "RS-485", rs232: "RS232", freertos: "FreeRTOS", can: "CAN", imu: "IMU", ai: "AI",
  esp32: "ESP32", "esp32-s3": "ESP32-S3", "esp32-c3": "ESP32-C3",
  atmega328p: "ATmega328P", stm32: "STM32", arduino: "Arduino",
  easyeda: "EasyEDA", kicad: "KiCad", micropython: "MicroPython", "node-red": "Node-RED",
  ads1292r: "ADS1292R", mlx90640: "MLX90640", mpu6050: "MPU6050", lis3mdl: "LIS3MDL",
  bme680: "BME680", pms7003: "PMS7003", max30102: "MAX30102", ds3231: "DS3231", ds1307: "DS1307",
  "7-segment": "7-Segment", "3d": "3D", "2d": "2D",
};

export function formatTag(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((word) => {
      const key = word.toLowerCase();
      if (WORDS[key]) return WORDS[key];
      // Part-number-like words (letters + digits) keep their stored casing in upper case.
      if (/\d/.test(word) && /[a-z]/i.test(word)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

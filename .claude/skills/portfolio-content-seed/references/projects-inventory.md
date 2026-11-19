# Project Inventory

## Ready to seed with real detail (`draft: false`)

### Home Automation V2
6-channel ESP32-WROOM-32 home automation board ("Saad's Home Automation V2").
Dark-sidebar web dashboard, NTP time sync, NOAA-style solar calculations
using Dhaka coordinates, 20-rule automation engine with four trigger types
stored in NVS. Diagnosed and fixed a TX/RX cross-connection bug on the
schematic that was preventing firmware uploads via CH340C. Multiple JSON
parsing bugs were caught via Python simulation before hardware testing.
Evolved from an earlier 4-channel relay board (resolved GPIO2 strapping pin
conflicts, added optoisolator isolation, auto-reset circuits) before
expanding to 6 channels — worth mentioning as project history/changelog
rather than a separate project entry.
Tags: ESP32, PCB Design, Home Automation, NVS, Web Dashboard, NTP.
Status: completed.

### DIY ATmega328P Digital Clock
DS1307 RTC, 4-digit 7-segment display. Full debugging cycle: I2C issues,
display ghosting fix, brightness balancing, clock drift compensation.
Tags: ATmega328P, RTC, 7-Segment Display, I2C.
Status: completed.

### DIY Arduino Component Tester
SSD1306 OLED display. Fixed display output to render in the correct color
zone. Based on studying Karl-Heinz Kubbeler's open-source transistor tester
codebase, including the underlying measurement algorithm math.
Tags: Arduino, OLED, Component Tester.
Status: completed.

### Simon Memory Game
ESP32-based memory game PCB: LEDs, buttons, buzzer, OLED display.
Tags: ESP32, PCB Design, Game.
Status: completed.

### TTL-to-RS485 Converter
EasyEDA schematic using SN75HVD08D and 74HC04D. Reviewed and fixed critical
issues before fabrication: undersized AMS1117 output capacitor, voltage drop
from the reverse-protection diode.
Tags: PCB Design, RS485, EasyEDA.
Status: completed.

### ESP32-S3 Water Monitoring System
HC-SR04 ultrasonic sensor, relay, RGB LED, HLK-PM01 power supply. Diagnosed
a WiFi failure on a custom PCB caused by pull-up resistors referencing 5V
instead of 3.3V, and an unprotected 5V ECHO line.
Tags: ESP32-S3, IoT, Sensors, PCB Design.
Status: completed.

## Needs Saad's input before publishing (`draft: true` stub only)

For each of these, only the title and a best-guess category (from the name)
are known. Do not write a description, BOM, or challenges section — leave
those for Saad via `/admin`.

- **Acqua Node V1.2** — likely related to water monitoring; confirm scope
  with Saad.
- **ESP32 IoT Vehicle Motion Analyzer (MPU6050 + LIS3MDL)** — likely IMU +
  magnetometer motion/orientation sensing.
- **ESP32 MLX90640 IR Thermal Camera** — likely thermal imaging module
  integration.
- **ESP32 Standalone Board** — scope unknown.
- **Fingerprint V1.1** and **Fingerprint V1.2** — two revisions, likely a
  fingerprint access/security board.
- **IoT Activity Tracker (Accelerometer/Gyroscope)** — scope implied by
  title only.

## Optional: in-progress project worth noting separately
- DWIN DGUS + DHT11 via ESP32 MicroPython — encountered unresolved UART
  framing and ASCII formatting issues. If seeded, use `status: in-progress`
  and describe it honestly as unresolved, not completed.

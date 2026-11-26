# Fact check — project pages

Every specific claim on the 17 project pages, with the file in `D:\SAAD\PCB\` it came from.
Pages were written only from each project's README, documentation, BOM and source headers.

- **SOURCED** — stated in the file listed.
- **INFERRED** — derived from the BOM or images (e.g. what a chip does); please confirm.

**Saad: please go through section 1 first** — those are places where your own files disagree with each other. The pages currently avoid the disputed detail; tell me the right answer and I'll update them.

## 1. Needs your decision (files disagree)

| # | Project | Conflict | What the page does now |
|---|---|---|---|
| 1 | LoRa GPS Tracker | The CAD folders are swapped: `ESP32 LoRa GPS Transmitter/` holds PCB1 files (no GPS); `ESP32 LoRa GPS Receiver/` holds PCB2 (with GPS1). README says the **Transmitter is PCB2 with the GPS** (72.8 × 42.8 mm). | Labels each render/3D model by what it actually shows (board with GPS = Transmitter). Consider fixing the folder names in the repo. |
| 2 | LoRa GPS Tracker | `Code/` folder is empty. | Says firmware is not written yet; describes the system as planned. |
| 3 | Acqua Node | BOM relay RLY1 is **SRD-24VDC-SL-C (24 V coil)**; README/docs say a 5 V relay driven from the 5 V rail. | Shows the BOM part number, states no coil voltage. |
| 4 | Acqua Node | README calls parts U1 ESP32-S3, U2 HLK-PM01, U3 PC817C; BOM calls them U6, U5, U1. README mentions a `Code & Pinout/` folder that doesn't exist. | Uses BOM designators; role "Schematic & PCB layout". |
| 5 | Home Automation | BOM relays are **SRD-24VDC-SL-C**; READMEs say 5 V coils. | Shows the BOM part number. |
| 6 | Home Automation V2.1 | BOM supply module **HLK-PM01**; README says **HLK-M505**. | Uses BOM. |
| 7 | Home Automation | V1 and V2.2 READMEs describe the 2N2222A / PC817C relay drive in opposite order. | Lists parts without the order. |
| 8 | Simon V1.0 | BOM: **USB Mini-B** and "AMS1117_1.2V"; README: USB-C and AMS1117-3.3. | Uses BOM. |
| 9 | Simon V1.2 | README claims onboard LiPo charging (U2/U10); BOM has no charger IC (U2 is a capacitor, U10 the AMS1117). | Charging left out. |
| 10 | Activity Tracker, Battery SoC Monitor | READMEs describe a 3.3 V LDO; BOMs have **TPS63020 buck-boost + BQ24092 charger**, no LDO. Tracker README designators don't match its BOM. | Uses BOM. |
| 11 | Air Quality Monitor | BOM/schematic label U1 "BME280, 0x76"; firmware drives a **BME680 at 0x77**. | "Environmental sensor module (BME680 in firmware)". Open issues from the design review listed in Outcome. |
| 12 | Fingerprint V1.1 / V1.2 | No README, docs, firmware or GitHub link. Purpose (access control? attendance?) unknown; BOM LED8 "red" vs silkscreen "GREEN"; unclear which 8-pin header is RFID vs display. | Built from BOM + renders only; 22 INFERRED claims. LED8 shown green per the silkscreen (same rule as Acqua Node). **Tell me what these boards are for.** |
| 13 | Fingerprint Voting Machine | R503 sensor not in the BOM (connects off-board via CN1). | Shown as an off-board part. |
| 14 | All 17 | No file says any board was fabricated or tested. | Every page is "Prototype" and makes no build/test claim. **Tell me which boards you built and tested** — they can become "Completed" with results. |
| 15 | Component Tester | Firmware is a port of Karl-Heinz Kübbeler's open-source Transistor Tester. | Role "Schematic, PCB layout & firmware port" with credit. |
| 16 | Fingerprint Voting Machine | `dashboard.h` line 462 (also `Code/Dashboard/dashboard.html`): the CSV header string in `exportVotesCsv()` contains a literal line break, so the page's only `<script>` does not parse and **none of the dashboard's JavaScript runs on the device**. | The Outcome screenshot shows the page exactly as the firmware serves it (static layout). Worth fixing in the firmware. |
| 17 | IoT Activity Tracker | Folder name says "Accelerometer-Gyroscope"; the dashboard subtitle and firmware say **BNO085**. | Site uses BNO085 (from firmware). |
| 18 | Fingerprint V1.1 | **Resolved (21 Nov 2026).** Saad added `3D_PCB1_2026-11-21.step`. It was first read as a newer layout (5V, U9, USB1 "moved"; blue mask), but V1.2, whose files are all from 27 Jul, shows the same offsets: they are 3D-body vs footprint centres, and blue is EasyEDA's default STEP colour. The July 2D images, render and Pick & Place match the STEP. | 3D board rebuilt the normal way: July top/bottom layouts as the board surface (green, as in EasyEDA), parts from the STEP. |
| 20 | Acqua Node | STEP export has no 3D model for relay RLY1 (only a 0.76 mm placeholder, 7 mm away from the footprint centre). | Shown as a box of the SRD-24VDC-SL-C datasheet size (19 × 15.5 × 15.3 mm), centred from Pick & Place and the relay's outline in EasyEDA's render; the viewer says so. |
| 21 | Acqua Node | Silkscreen labels the LEDs **BLUE** (LED3), **RED** (LED4, LED1), **GREEN** (LED5) and **RGB** (U4); the BOM lists every 5 mm LED as `LED_TH-R_5mm` (red). | **Saad: follow the silkscreen** (21 Nov 2026). The 3D board uses the silkscreen colours; the viewer notes the BOM difference. |
| 19 | Vehicle Motion Analyzer | Spec card says the PCB is **59.4 × 49.9 mm**; the board outline in the STEP file (and the 2D layout's aspect ratio) is **55.5 × 49.9 mm**. | Spec card unchanged; the 3D caption no longer states a size. **Which is right?** |
| 22 | Fingerprint V1.1 | **Resolved (21 Nov 2026).** Card and gallery image = EasyEDA render from the project folder, which matches the current layout (see #18). Board 59.8 × 60.8 mm confirmed by the STEP outline (59.79 × 60.81 mm). | No action needed. |
| 23 | Blog (3 drafts) | New posts written only from the project write-ups and the 3D pipeline README: `lora-gps-tracker-without-sim-or-cloud`, `home-automation-relay-board-revisions`, `interactive-3d-boards-from-easyeda`. They are `draft: true`, visible only on the local dev server. | **Saad: read each post on localhost, then tell Claude which to publish (sets `draft: false` and the real publish date).** The Blog menu link appears once one post is published. |

### Site update — 26 Nov 2026
- Name **Sultan Mahmud Saad** and title **Embedded Engineer & PCB Designer** everywhere; employer shown as **SIOT — Southern Innovation of Technology** on the site (resume keeps his PDF's "SouthernIoT").
- **Please confirm:** the rewritten About bio (3 paragraphs in src/content/profile/saad.json) and "Python" (was "Python (basic)").

### Resume = Saad's own PDF — 25/26 Nov 2026 (supersedes the entries below)
- Saad: "add that exactly as the PDF looks … no need to change, this is fully updated." The resume page copies his LaTeX CV (`D:\CV\CV\main.tex`) word for word and in the same layout; "Download PDF" is his exact `Sultan_Mahmud_Saad_CV.pdf`.
- **Saad chose to publish everything exactly as the PDF**, including his phone number and both referees' names, emails and phones (he was told referees should agree first).
- His CV photo is on the resume page (metadata stripped; the original's GPS field held no coordinates).

### From Saad's new CV — 25 Nov 2026
- The resume page now follows the new CV: summary, education, experience (responsibilities + achievements), projects, ongoing projects, technical skills, training, activities.
- Employer and role: **SouthernIoT — Embedded System and PCB Designer** (replaces "Assistant Officer, SIOT Solutions — Southern Innovation of Technology"). Added **Project-Based Work — Freelance Embedded Systems Engineer, 2021–2025**.
- B.Sc. **2018–2023** (was 2022); HSC at **Police Lines School and College**, 2015–2017. SSC kept (Saad's choice).
- Name **Sultan Mahmud Saad** on the resume page and PDF only (Saad's choice).
- ~~Not published (privacy): the CV's phone number and the referees' contact details~~ → published since 26 Nov 2026 by Saad's choice (see above).
- **Please confirm:** the updated first About bio paragraph in `src/content/profile/saad.json`.

### Confirmed by Saad — 21 Nov 2026
- Email on the site: **smsaad181@gmail.com** (the CV's [CV email — not published] is not used).
- Employer name: ~~SIOT Solutions — Southern Innovation of Technology~~ → **SouthernIoT** since the 25 Nov 2026 CV (the older CV said "Southern IoT Limited").
- Home page shows professional links only (LinkedIn, GitHub, OSHWLab, email) — not Facebook/Instagram.
- Dashboards with no screenshot are rendered from the firmware's own HTML with no data (no invented readings). Vehicle Motion Analyzer uses Saad's own screenshots from its Documentation folder.
- GitHub links removed from project pages (the repos are private).

### Confirmed by Saad — 21 Nov 2026 (projects)
- Project order changed to Saad's sequence; Fingerprint V1.1 and V1.2 merged into one project, **Fingerprint Sensor Board** (`fingerprint-sensor-board`), with two versions. The claims listed below under `fingerprint-v1-1` / `fingerprint-v1-2` now belong to that project.
- **Waiting for Saad:** EasyEDA exports of the new V1.1 layout (3D render + 2D top/bottom into `Fingerprint V1.1/Image`), so the V1.1 card and 3D board get real copper and silkscreen.

### Confirmed by Saad — 21 Nov 2026 (Phase 5)
- Availability: **Open to hardware / embedded roles · Dhaka or remote**.
- OSHWLab profile https://oshwlab.com/smsaad181 is correct (the site blocks automated checks). GitHub and LinkedIn return 200.
- ~~The CV PDF is generated from the site's resume page~~ → since 25 Nov 2026 the download is Saad's own LaTeX PDF (`npm run cv:import`), and the resume page copies it word for word.
- Contact form: Web3Forms. **Waiting for Saad's access key** (put it in `.env` as `PUBLIC_WEB3FORMS_KEY`).
- Experience bullets state no numbers or outcomes — add measurable results (boards shipped, devices deployed, …) if you can confirm them.
- **Please confirm the new wording** (written from the CV + GitHub profile): the three About bio paragraphs in `src/content/profile/saad.json` and the six experience bullets in `src/content/experience/southern-iot.json`. Python is shown as "Python (basic)" as in the CV.

## 2. Every claim, by project

718 claims in total: 674 SOURCED, 44 INFERRED.

### ESP32 LoRa GPS Tracker  `lora-gps-tracker`

Abbreviations: `README` = ESP32 LoRa GPS Tracker V1.0/README.md · `TX-HTML` = ESP32 LoRa GPS Tracker V1.0/ESP32 LoRa GPS Transmitter/Documentaion/ESP32-LoRa-GPS-Tracker-Transmitter.html · `RX-HTML` = ESP32 LoRa GPS Tracker V1.0/ESP32 LoRa GPS Receiver/Documentaion/ESP32-LoRa-GPS-Tracker-Receiver.html · `BOM-GPS` = ESP32 LoRa GPS Tracker V1.0/ESP32 LoRa GPS Receiver/BOM File/BOM_LoRa GPS Board_PCB2_2026-11-08.xlsx (the PCB2 board, which carries GPS1) · `BOM-NOGPS` = ESP32 LoRa GPS Tracker V1.0/ESP32 LoRa GPS Transmitter/BOM File/BOM_LoRa Board_PCB1_2026-11-08.xlsx (PCB1, no GPS).

**Board labelling note:** README and TX-HTML define the transmitter as PCB2 (with GPS, 72.8 × 42.8 mm) and the receiver as PCB1. The CAD exports are stored the other way round: the `ESP32 LoRa GPS Transmitter` folder holds the PCB1 BOM/STEP/images (no GPS) and the `ESP32 LoRa GPS Receiver` folder holds PCB2 (with GPS). The documentation schematic images (`tx-p*`, `rx-p*`) match README (tx-p3 has the GPS), although their title blocks are also swapped. The page labels every image and model by function (per README), verified visually (GPS1 visible on receiver-render3d.webp; image aspect ratios match the README board sizes).

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title "ESP32 LoRa GPS Tracker" (README H1 minus V1.0) | README § H1 | SOURCED |
| 2 | Two-board tracker built on the ESP32-S3 | README § intro | SOURCED |
| 3 | Battery-powered transmitter reads position from a GPS module and sends it over 915 MHz LoRa | README § intro | SOURCED |
| 4 | Receiver base station acknowledges each report and shows the track on a live map in a browser on local Wi-Fi | README § intro | SOURCED |
| 5 | No SIM card, no mobile coverage, no cloud service | README § intro | SOURCED |
| 6 | MCU ESP32-S3-WROOM-1-N8R8, 8 MB flash, 8 MB PSRAM (U4) | README § Hardware; BOM-GPS / BOM-NOGPS U4 | SOURCED |
| 7 | Radio EBYTE E22-900M22S, Semtech SX1262, 22 dBm, IPEX antenna (U6) | README § Hardware; BOM U6 | SOURCED |
| 8 | GNSS ATGM336H, GPS + BeiDou, transmitter only (GPS1) | README § Hardware; BOM-GPS GPS1 | SOURCED |
| 9 | ATGM336H on UART with PPS; PPS to GPIO14; NMEA to GPIO17; commands from GPIO18 | README § ESP32-S3 pin map; TX-HTML role map R28–R30 | SOURCED |
| 10 | GPIO14, 17, 18 free on the receiver | README § ESP32-S3 pin map | SOURCED |
| 11 | MCP73831T-2DCI/OT charger (U1), 500 mA from USB-C, 2 kΩ PROG resistor | README § Hardware; BOM U1, R1; TX-HTML role map R1 | SOURCED |
| 12 | TPS63020DSJT buck-boost (U3), 3.28 V rail | README § Hardware; BOM U3 | SOURCED |
| 13 | 1 MΩ / 180 kΩ feedback divider | BOM R3, R4; TX-HTML role map R3/R4 | SOURCED |
| 14 | XFL4020-152MEC 1.5 µH buck-boost inductor (L1) | BOM L1; TX-HTML role map L1 | SOURCED |
| 15 | CH340C USB-to-UART (U8), programming and serial monitor on UART0 | README § Hardware, § pin map; BOM U8 | SOURCED |
| 16 | S8050 Q2, Q3 DTR/RTS auto-reset pulling EN and GPIO0 | BOM Q2/Q3; TX-HTML role map Q2/Q3; README § Hardware | SOURCED |
| 17 | AO3401A (Q1) reverse-polarity switch | README § Hardware; BOM Q1 | SOURCED |
| 18 | SMDJ30CA TVS (D1) on battery input | README § Hardware, § Check #4; BOM D1; TX-HTML role map D1 | SOURCED |
| 19 | MMSZ5240A_R1_00001 (D2) 10 V Zener gate clamp | README § Hardware; BOM D2; TX-HTML role map D2 | SOURCED |
| 20 | SS12D00G3 (U2) main power slide switch | BOM U2; TX-HTML role map U2 | SOURCED |
| 21 | B2B-PH-SM4-TB(LF)(SN) (CN2) JST PH battery connector | BOM CN2; README § Hardware (JST PH); TX-HTML role map CN2 | SOURCED |
| 22 | Passives R1–R30, C1–C28 (pull-ups, series resistors, decoupling, filtering) | BOM-GPS resistor/capacitor rows; TX-HTML role map | SOURCED |
| 23 | Both boards from one EasyEDA Pro project; share power, MCU, programming, radio; transmitter adds GPS | README § Hardware | SOURCED |
| 24 | LoRa SPI GPIO10–13, DIO1 GPIO5, BUSY GPIO15, RST GPIO16, TXEN/RXEN GPIO6/7 | README § ESP32-S3 pin map | SOURCED |
| 25 | GPS on UART1 | TX-HTML § firmware ("starts UART1 for the GPS"), pin map | SOURCED |
| 26 | Battery 1-cell Li-ion/Li-Po on JST PH, 2.75–4.2 V | README § Hardware | SOURCED |
| 27 | Protection: reverse-polarity switch, TVS, 10 V Zener gate clamp | README § Hardware | SOURCED |
| 28 | USB-C + CH340C with DTR/RTS auto-reset, 6-pin header | README § Hardware | SOURCED |
| 29 | I2C header (XH 4-pin) on both boards | README § Hardware | SOURCED |
| 30 | Antenna: cut-out on transmitter, keep-out on receiver | README § Hardware (PCB row) | SOURCED |
| 31 | Power chain USB-C → MCP73831 → VBAT → AO3401A → SS12D00G3 → TPS63020 | TX-HTML role map U1, Q1, U2, U3 | SOURCED |
| 32 | Same GPIO assignment on both boards | README § ESP32-S3 pin map | SOURCED |
| 33 | Spec PCB: 2 layers, 1.6 mm; TX 72.8 × 42.8 mm, RX 60.7 × 45.0 mm | README § Hardware | SOURCED |
| 34 | Four M3 mounting holes | BOM SCREW1–4; README § Hardware placements | SOURCED |
| 35 | Spec EDA: EasyEDA Pro | README § Hardware, § Author | SOURCED |
| 36 | Status "prototype" (README states V1.0 does not power up as drawn; no "complete" or "WIP" statement) | README § warning | SOURCED |
| 37 | Role "Schematic & PCB layout" (no firmware in folder; Code folder empty) | folder listing; TX-HTML § Firmware notes | SOURCED |
| 38 | Project folder holds schematic PDF, EasyEDA Pro project, Gerbers, BOM, pick-and-place, STEP for each board | folder listing (Schamatic/PDF, Schamatic/Editable File, Garber File, BOM File, Pick&Place File, 3D Step File in both board folders) | SOURCED |
| 39 | Interactive documentation per board on GitHub Pages with schematic crops, circuit flow, simulations (charger, protection, buck-boost, auto-programmer, LoRa link budget, battery life), module viewers, BOM, pin map, 3D model, workflow drawings | README § What the documentation contains | SOURCED |
| 40 | Public repository holds the documentation only | README § Repository structure | SOURCED |
| 41 | Firmware not written yet; documentation describes planned firmware | TX-HTML § Firmware notes ("Code folder of the project is empty") | SOURCED |
| 42 | Planned: 21-byte packet, ACK, RSSI/SNR, LittleFS track log, map at tracker.local | README § How it works; RX-HTML § firmware | SOURCED |
| 43 | V1.0 does not power up: TPS63020 VINA, EN, PS/SYNC connect only to C8; fix = wire C8 pad to C7 pad | README § warning, § Check #1 | SOURCED |
| 44 | Next revision items: CH340C V3 to VCC, no power path, TVS class, EN capacitor, no battery/USB sensing | README § Check #2–#7 | SOURCED |
| 45 | Gallery/model labels by function (Transmitter = PCB2 with GPS) despite the folder/file names | README § Hardware; visual check of renders; schematic page content | INFERRED |

### ECG Monitor with ADS1292R & ESP32 TFT Display  `ecg-monitor-ads1292r`

Folder abbreviated below as `ECG/` = `ECG Monitor with ADS1292R & ESP32 TFT Display V1.0/`. Docs HTML = `ECG/Documentaion/ECG_Monitor_Documentation.html`. Code = `ECG/Code/ESP32_Dev_ILI9488_ADS1292R/`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Real-time single-lead ECG and respiration monitor on a custom PCB | ECG/README.md § intro blockquote | SOURCED |
| 2 | Shows live waveforms, heart rate (BPM), R-R interval and respiratory rate on-screen, no PC required | ECG/README.md § intro blockquote | SOURCED |
| 3 | MCU is ESP32-WROOM-32 DevKit, dual-core 240 MHz | ECG/README.md § Board Overview; BOM row 4 (ESP1 "ESP32-WROOM Devkit", footprint ESP32-WROOM-32-30PIN) | SOURCED |
| 4 | ADS1292R is a ProtoCentral module (TI ADS1292R) | BOM row 9 (U2 "Protocentral ADS1292R"); README § Board Overview ("Texas Instruments ADS1292R") | SOURCED |
| 5 | ProtoCentral breakout keeps electrode-side circuitry on a tested board; carrier only handles digital lines and power | Docs HTML § board overview ("Using the ProtoCentral breakout keeps the electrode-side circuitry on a tested board...") | SOURCED |
| 6 | Display: 3.5-inch ILI9488 TFT, 480 × 320, SPI | README § Board Overview; BOM row 10 (U3) | SOURCED |
| 7 | Sample rate 500 Hz | README § Board Overview; Code ADS1292.h `SAMPLE_HZ = 500` | SOURCED |
| 8 | CH1 respiration, CH2 ECG Lead-II, gain ×6 on both | README § Board Overview; ADS1292.h `GAIN1/GAIN2 = 6` | SOURCED |
| 9 | Power: 5 V DC barrel jack 5.5 × 2.0 mm, center positive | README § Board Overview and § Power Supply; BOM row 3 (DC1 DC-005 2.0) | SOURCED |
| 10 | PCB 110.1 × 112.1 mm, 2 layers, all through-hole | README § Board Overview; Docs HTML § layout | SOURCED |
| 11 | Designed in EasyEDA Pro | Docs HTML ("EasyEDA Pro project (schematic + PCB)"); `.epro2` project file in ECG/Schamatic/Editable File | SOURCED |
| 12 | Status = prototype | README § Disclaimer ("prototype firmware") | SOURCED |
| 13 | Role includes firmware | ECG/Code/ (.ino + .h files present) | SOURCED |
| 14 | DC-005 jack DC1 | BOM row 3 | SOURCED |
| 15 | C1, C2, C4, C6 = 10 µF KEMET ESK106M025AC3AA, bulk decoupling at VIN, 3V3, ADS VDD, TFT VCC | BOM row 1; README § Power Supply | SOURCED |
| 16 | C3, C5, C7, C15 = 100 nF CC1H104MC1FD3F6C10MF, HF decoupling beside each electrolytic | BOM row 2; README § Power Supply | SOURCED |
| 17 | R1–R12, R14 = 22 Ω series damping on SPI/control lines | BOM row 5; Docs HTML ("R1–R12, R14 (22 Ω) ... Series damping on every SPI and control line") | SOURCED |
| 18 | R13 = 1 kΩ backlight resistor to 3.3 V | BOM row 6; README § ILI9488 pin table (LED via 1 kΩ R13 to 3.3 V) | SOURCED |
| 19 | R15, R16 = 10 kΩ pull-ups on TFT CS and RST | BOM row 7; Docs HTML ("pull-ups on CS_TFT and RST_TFT") | SOURCED |
| 20 | Four M3 mounting holes SCREW1–4 | BOM row 8 | SOURCED |
| 21 | HSPI (GPIO 13/14/35) for ADS1292R, VSPI (GPIO 18/19/23) for TFT, buses never share lines | README § Pin Connections, SPI Bus Separation note | SOURCED |
| 22 | DRDY on GPIO 34, START on GPIO 25, PWDN/RESET on GPIO 26 | README § ADS1292R pin table; ADS1292.h cfg pins | SOURCED |
| 23 | ADS1292R uses internal 512 kHz oscillator, CLK/GPIO1/GPIO2 not connected | README § ADS1292R pin table | SOURCED |
| 24 | ECG filters: 0.5 Hz HP, notch at NOTCH_HZ (50/60 Hz, compile-time), 40 Hz LP; respiration 0.05 Hz HP / 0.8 Hz LP | ADS1292.h `SignalEngine::begin()`; README § Board Overview (Notch Filter row) | SOURCED |
| 25 | ADC self-test at start-up, lead-off detection, register audit, automatic recovery (max 3 per boot) | ADS1292.h cfg (`STARTUP_SELF_TEST`, `REG_AUDIT_INTERVAL_US`, `MAX_AUTO_RECOVERIES = 3`); Docs HTML ("Firmware with an ADC self-test, lead-off detection, a register audit, automatic recovery and a 50/60 Hz notch filter") | SOURCED |
| 26 | Serial 115200 baud; R = restart/self-test, S = stop acquisition | ESP32_Dev_ILI9488_ADS1292R.ino header comment | SOURCED |
| 27 | No ProtoCentral library needed; display via TFT_eSPI | ADS1292.h header comment; .ino `#include <TFT_eSPI.h>` | SOURCED |
| 28 | +5V net feeds DevKit VIN and ADS1292R VDD; DevKit 3.3 V regulator feeds ESP32, TFT, backlight, pull-ups | README § Power Supply | SOURCED |
| 29 | ADS1292R: two 24-bit ADC channels, programmable gain, lead-off detection, right-leg drive, respiration impedance circuit | Docs HTML (ADS1292R block description) | SOURCED |
| 30 | All 7 ADS signal lines through 22 Ω R1–R7 for EMI damping | README § ADS1292R → ESP32 | SOURCED |
| 31 | TFT CS GPIO 33, D/C GPIO 32, RESET GPIO 4; lines via R8–R14 | README § ILI9488 pin table; tft_setup.h | SOURCED |
| 32 | Pull-ups keep the display quiet during boot | Docs HTML ("pull-ups that keep the display quiet during boot") | SOURCED |
| 33 | TFT touch and SD pins not used | README § ILI9488 pin table | SOURCED |
| 34 | GPIO 34/35 input-only, used for DRDY and MISO | README § Pin Connections note; Docs HTML | SOURCED |
| 35 | Strapping pins GPIO 2, 5, 12, 15 left unconnected so nothing changes boot | Docs HTML (pin planning paragraph) | SOURCED |
| 36 | Repo package: schematic PDF, EasyEDA Pro .epro2, Gerber ZIP, BOM, pick-and-place, STEP, firmware, HTML documentation | Folder listing (Schamatic/PDF, Schamatic/Editable File, Garber File, BOM File, Pick&Place File, 3D Step File, Code, Documentaion); README § Project Files | SOURCED |
| 37 | Documentation includes interactive 3D model, circuit simulations, firmware workflows, build steps, pre-order checklist | README § Board Overview ("Full documentation") | SOURCED |
| 38 | Prototype firmware for simulator use only, not clinically validated, not for patient monitoring/diagnosis | README § Disclaimer | SOURCED |
| 39 | No fuse or reverse-polarity protection; use regulated 5 V adapter | README § Power Supply | SOURCED |
| 40 | GitHub URL | manifest.json | SOURCED |

### ESP32 IoT Vehicle Motion Analyzer with MPU6050 & LIS3MDL  `vehicle-motion-analyzer`

Abbreviations: `P` = ESP32 IoT Vehicle Motion Analyzer With MPU6050 & LIS3MDL V1.0 · `README` = P/README.md · `DOCREADME` = P/Documentation/README.md · `ART` = P/Documentation/vehicle-motion-analyzer.html (build article, incl. its 3D part-role map) · `BOM` = P/BOM File/BOM_Board1_PCB1_2026-07-18.xlsx · `FW` = P/Code/main.ino/main.ino.ino

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title (README H1 + subtitle) | README § H1/H3 | SOURCED |
| 2 | Self-contained IoT vehicle motion analyzer that sits inside a vehicle and monitors driving dynamics | README § Overview | SOURCED |
| 3 | Detects harsh driving events in real time, live data on OLED, Wi-Fi dashboard, phones can monitor or download trip logs | README § Overview | SOURCED |
| 4 | Dashboard served by the ESP32-S3 itself; no app or internet needed | README § Web Dashboard | SOURCED |
| 5 | MCU ESP32-S3-WROOM-1-N8, Wi-Fi + Bluetooth LE, 8 MB flash (U2) | README § Overview; BOM U2; ART role map U2 | SOURCED |
| 6 | MPU-6050 (U4) accel + gyro, forward/lateral accel and yaw rate, I²C 0x68 | README § Overview, § I²C Device table; BOM U4; ART role map U4 | SOURCED |
| 7 | LIS3MDLTR (U5) 3-axis magnetometer, compass heading, I²C 0x1E | README; BOM U5; ART role map U5 | SOURCED |
| 8 | DM-OLED096-636 (U1) 0.96″ SSD1306 OLED, 128 × 64, I²C 0x3C | README § Overview; BOM U1; ART role map U1 | SOURCED |
| 9 | CP2104-F03-GMR (U3) USB-UART, programs and monitors over USB-C | README § Overview; BOM U3; ART role map U3 | SOURCED |
| 10 | MMBT2222A Q1/Q2 auto-programmer driving GPIO0 and EN | BOM Q1/Q2; ART role map Q1/Q2 | SOURCED |
| 11 | BQ24092DGQR (U6) Li-ion charger up to 500 mA | README § Overview; BOM U6; ART role map U6 | SOURCED |
| 12 | 0603L100SLYR (U7) resettable PTC fuse in USB input to the charger | BOM U7; ART § charger ("U7 ... resettable PTC fuse") | SOURCED |
| 13 | TPS63020DSJT (U10) buck-boost making 3.3 V from the battery | README § Overview; BOM U10; ART role map U10 | SOURCED |
| 14 | XFL4020-152MEC (L2) 1.5 µH inductor | BOM L2; ART role map L2 | SOURCED |
| 15 | TYPE-C-31-M-12 (USBC1) for charging and programming | BOM USBC1; ART role map USBC1 | SOURCED |
| 16 | SK12D07VG3 (SW1) main power switch battery → 3.3 V converter | BOM SW1; ART role map SW1 | SOURCED |
| 17 | XH-2A (CN1) battery connector | BOM CN1; ART role map CN1 | SOURCED |
| 18 | Passives R1–R20, C1–C31 | BOM resistor/capacitor rows | SOURCED |
| 19 | Harsh accel / braking / sharp turns with configurable thresholds | README § Features | SOURCED |
| 20 | Default thresholds 2.2 m/s², 2.8 m/s², 25 °/s or 2.0 m/s² lateral, 450 ms, 1200 ms gap | README § Event Detection Thresholds; FW TH_* constants | SOURCED |
| 21 | Tilt-compensated heading with declination correction and circular smoothing | README § Features | SOURCED |
| 22 | OLED HUD: heading, event, forward/lateral accel, yaw rate, counters | README § Features | SOURCED |
| 23 | Dashboard refreshes from /data 5×/s; event banner, G-force circle, compass dial, live readings, day/night theme | README § Features, § Web Dashboard | SOURCED |
| 24 | CSV trip log at 10 rows/s with start/stop/clear/download | README § Features; FW routes /start /stop /clear /download | SOURCED |
| 25 | CSV stored in LittleFS | FW (LittleFS, LOG_PATH "/drive_log.csv") | SOURCED |
| 26 | Accel/gyro bias calibration at boot | FW calibrateMPU(500) | SOURCED |
| 27 | Magnetometer offset/scale calibration loaded from non-volatile storage | FW Preferences "lis3mdl" offX/sX keys | SOURCED |
| 28 | I²C 400 kHz on GPIO8/GPIO9 shared by IMU, magnetometer, OLED | README § I²C Bus; FW SDA_PIN/SCL_PIN/I2C_FREQ | SOURCED |
| 29 | Battery divider 100 kΩ / 36 kΩ to GPIO1; INT lines GPIO12, GPIO13; not used by current firmware | README § Other Connections; BOM R2, R3 | SOURCED |
| 30 | Spec Power: 1-cell Li-ion, BQ24092 USB-C charger, TPS63020 3.3 V buck-boost | README § Overview | SOURCED |
| 31 | Spec Programming: USB-C through CP2104 with automatic boot/reset | README § Overview | SOURCED |
| 32 | Spec PCB 59.4 × 49.9 mm, 2 layers | ART role map "PCB"; ART § PCB layout | SOURCED |
| 33 | EasyEDA Pro | ART § 3D model ("exported by EasyEDA Pro"); .epro2 project file | SOURCED |
| 34 | Charger fed through PTC fuse; ISET2 tied high caps current at 500 mA | ART § charger | SOURCED |
| 35 | LEDs show power-good (LED1) and charging (LED2) | ART § charger; ART role map LED1/LED2 | SOURCED |
| 36 | SW1 switches battery to the TPS63020 | ART role map SW1 | SOURCED |
| 37 | ESP32-S3 top-left, antenna over copper-free cut-out | ART § PCB layout | SOURCED |
| 38 | CP2104 bridges USB-C to UART0 | README § Other Connections (U0TXD/U0RXD to CP2104) | SOURCED |
| 39 | MPU6050 lower-left, LIS3MDL below the ESP32-S3; OLED mounts above the board on the right | ART § PCB layout | SOURCED |
| 40 | Ground pours both sides, four grounded M3 mounting holes | ART § PCB layout; ART role map PCB; BOM SCREW2–5 | SOURCED |
| 41 | Status "prototype" (no complete/tested/WIP statement in README) | README | SOURCED |
| 42 | Role includes firmware (Code/main.ino present) | folder listing | SOURCED |
| 43 | Fabrication package: schematic PDF, EasyEDA Pro project, Gerbers, BOM, pick-and-place, STEP | folder listing; README § Project File Structure | SOURCED |
| 44 | Arduino firmware main.ino with detector, compass, HUD, web server, CSV logging; dashboard in webpage.h | README § Project File Structure; FW | SOURCED |
| 45 | Build article on GitHub Pages: circuit blocks, simulations, sensor viewers, 3D model, firmware workflow drawings | README § Documentation; DOCREADME | SOURCED |
| 46 | Next-revision issues: MPU6050 VDD, TPS63020 enable, C11 220 pF vs 2.2 nF, Q2 swapped, no power path | README § Design Notes for the Next Revision | SOURCED |
| 47 | Battery voltage and INT pins not read by current firmware | README § Other Connections | SOURCED |
| 48 | Tag "imu" | README (MPU6050 IMU) | SOURCED |

### Component Tester V1.0  `component-tester`
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title "Component Tester V1.0" | Component Tester V1.0/README.md § H1 | SOURCED |
| 2 | Identifies resistors, capacitors, inductors, diodes, transistors, FETs, thyristors, triacs | Component Tester V1.0/README.md § intro, § Features (part table) | SOURCED |
| 3 | Shows pin-out and values on an OLED | Component Tester V1.0/README.md § Overview | SOURCED |
| 4 | Through-hole PCB, assemblable with a basic soldering iron | Component Tester V1.0/README.md § Overview | SOURCED |
| 5 | Arduino Nano v3.x with ATmega328P, 16 MHz | Component Tester V1.0/README.md § Specifications; BOM A1 | SOURCED |
| 6 | Based on Transistor Tester by Karl-Heinz Kübbeler, adapted for I²C OLED | Component Tester V1.0/README.md § Overview; Code/Componant-tester/Componant-tester.ino header | SOURCED |
| 7 | Firmware base: Transistor Tester for Arduino v1.08a, derived from v1.08k | Component Tester V1.0/README.md § Firmware; .ino header | SOURCED |
| 8 | 0.96-inch I²C OLED (SSD1306), SDA A4 / SCL A5 | Component Tester V1.0/README.md § Specifications, § Pinout | SOURCED |
| 9 | 3 test terminals TP1–TP3 on A0–A2 | Component Tester V1.0/README.md § Specifications | SOURCED |
| 10 | Each terminal has 680 Ω and 470 kΩ drive resistors | Documentaion/Component_Tester_V1.0_Documentation.md § 4.2 | SOURCED |
| 11 | 5 V DC barrel jack with rocker switch, or USB via the Nano | Component Tester V1.0/README.md § Overview; Documentation § 4.1 | SOURCED |
| 12 | All through-hole, parts on top side only, 4 × M3 holes | Documentation § 1.4, § 7.1 | SOURCED |
| 13 | EDA: EasyEDA Pro | Documentation § 7.1 ("EasyEDA (Pro)") | SOURCED |
| 14 | Status prototype | README.md badge "status-prototype"; Documentation header "Status: Prototype" | SOURCED |
| 15 | Role includes firmware port | Folder contains Code/Componant-tester/Componant-tester.ino (ported, not original) | SOURCED |
| 16 | A1 Arduino Nano | BOM row 1 | SOURCED |
| 17 | U1 HS96L03W2C03 OLED | BOM row 11; Documentation § 4.3 | SOURCED |
| 18 | H1 MF254V-11-03-0743 3-pin female header = test header | BOM row 3; Documentation § 5.2 | SOURCED |
| 19 | R1, R5, R6 680 Ω drive TP3, TP2, TP1 | BOM row 5; Documentation § 4.2 | SOURCED |
| 20 | R2, R3, R4 470 kΩ drive TP3, TP2, TP1 | BOM row 6; Documentation § 4.2 | SOURCED |
| 21 | SW1 SWPAD3 12 × 12 mm tact switch, TEST on A3 | BOM row 10; Documentation § 6 BOM table, § 4.4 | SOURCED |
| 22 | U2 RS601A-1010011BB rocker switch between jack and switched rail | BOM row 12; Documentation § 4.1 | SOURCED |
| 23 | DC1 DC-005-2.5A-2.0 barrel jack, 5 V | BOM row 2; Documentation § 4.1 | SOURCED |
| 24 | LED1 5 mm power LED | BOM row 4; Documentation § 4.1 | SOURCED |
| 25 | SCREW1–4 M3 holes tied to GND | BOM row 9; Documentation § 4.5 | SOURCED |
| 26 | R7 10 kΩ pull-up, R8 330 Ω LED resistor | BOM rows 7–8; Documentation § 4.1, § 4.4 | SOURCED |
| 27 | Detection in any lead order for most parts | README.md § Usage step 2 | SOURCED |
| 28 | Capacitors with ESR and voltage loss; NPN/PNP with hFE; enhancement/depletion MOSFETs; JFETs | README.md § Features table; Documentation § 1.3 | SOURCED |
| 29 | `Cell!` warning for a charged cell | README.md § Features table; Documentation § 11.3 | SOURCED |
| 30 | Plug-in Nano, re-programmable over USB | README.md § Features | SOURCED |
| 31 | Standard resistor values only | README.md § Features | SOURCED |
| 32 | `WITH_AUTO_REF` and `AUTOSCALE_ADC` enabled | Documentation § 10.2 | SOURCED |
| 33 | Drive pins on port B, D8–D13; ADC on A0–A2 | README.md § Pinout; Documentation § 5.1 | SOURCED |
| 34 | Measures by switching to +5 V / GND / high-Z and timing voltages | README.md § How It Works; Documentation § 2.1 | SOURCED |
| 35 | Rocker switch feeds Nano VIN and power LED | Documentation § 4.1 | SOURCED |
| 36 | Adafruit SSD1306 and GFX libraries | Documentation § 4.3 | SOURCED |
| 37 | Internal pull-ups disabled (`PULLUP_DISABLE`), external R7 | Documentation § 10.2 | SOURCED |
| 38 | Repo package: schematic PDF+PNG, EasyEDA project, Gerbers, BOM, pick-and-place, STEP, documentation MD+PDF | Folder listing: Schamatic/PDF, Schamatic/Editable File, Garber File, BOM File, Pick&Place File, 3D Step File, Documentaion | SOURCED |
| 39 | Firmware configured for OLED, English, board resistor values | Documentation § 10.2 | SOURCED |
| 40 | Prototype build, validation, characterisation still open | README.md § Roadmap | SOURCED |
| 41 | Accuracy not characterised; 5 V test-voltage limit; self-test and auto-cal disabled | Documentation § 14.2, § 10.2 | SOURCED |
| 42 | Roadmap: validation, calibration, enclosure, V1.1 | README.md § Roadmap | SOURCED |
| 43 | Intended for makers and engineers who want to build, repair or modify the board | Documentation § 1.2 Scope | SOURCED |

### Digital Clock with ATmega328P & DS1307 RTC  `atmega328p-rtc-clock`
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title (README H1 "Digital Clock" + subtitle "ATmega328P · DS1307 RTC") | Clock/README.md § H1 and subtitle | SOURCED |
| 2 | Bare/standalone ATmega328P, DS1307 RTC with CR2032 backup, four 1-inch FJ11001BH digits | Clock/README.md § intro, § Overview | SOURCED |
| 3 | Keeps time while switched off | Clock/README.md § intro | SOURCED |
| 4 | ATmega328P-PU DIP-28, 16 MHz crystal, Uno bootloader | Clock/README.md § Overview table | SOURCED |
| 5 | DS1307+ on I²C, 32.768 kHz crystal | Clock/README.md § Overview table | SOURCED |
| 6 | 4 × FJ11001BH 1-inch, common anode, multiplexed | Clock/README.md § Overview table | SOURCED |
| 7 | 9–12 V DC jack, 1N4007, LM7805 to 5 V | Clock/README.md § Overview table (Power input) | SOURCED |
| 8 | PCB 112.0 × 59.8 mm, 2 layers, 1.6 mm, through-hole, parts both sides | Clock/README.md § Overview table (PCB) | SOURCED |
| 9 | EDA: EasyEDA Pro | Clock/README.md badge "EasyEDA-Pro" | SOURCED |
| 10 | Status prototype | No complete/tested statement in README; default per brief | SOURCED |
| 11 | Role includes firmware | Clock/Code/*.ino (3 sketches) | SOURCED |
| 12 | MCU alone a poor clock: 16 MHz crystal not for timekeeping, forgets time on power loss | Clock/Documentation/Digital_Clock_Documentation.html § Overview | SOURCED |
| 13 | Time correct again as soon as power returns | Clock/README.md § Features | SOURCED |
| 14 | Complete clock on one PCB, no plug-in modules | Documentation HTML § Designing the Digital Clock Hardware | SOURCED |
| 15 | 12-hour format, blinking seconds dot | Clock/README.md § intro | SOURCED |
| 16 | U1 ATMEGA328P-PU | BOM row 16 | SOURCED |
| 17 | U12 DS1307+ | BOM row 21 | SOURCED |
| 18 | X1 16 MHz X49SD16MSD2SC | BOM row 23 | SOURCED |
| 19 | X2 DT-38 32.768 kHz (KDS) | BOM row 24 | SOURCED |
| 20 | B1 BS-2-1 CR2032 holder on bottom | BOM row 2; README § PCB & Schematic note | SOURCED |
| 21 | LED3–LED6 FJ11001BH | BOM row 7 | SOURCED |
| 22 | Q1–Q4 2N3904G-T92-B emitter followers | BOM row 8; Documentation HTML § 4 Digit Driver Transistors | SOURCED |
| 23 | U5 LM7805T 5 V regulator | BOM row 19 | SOURCED |
| 24 | U3 1N4007 reverse-polarity protection | BOM row 17; README § Features | SOURCED |
| 25 | DC-005 2.0 jack, designator "9V-12V", 5.5 × 2.0 mm centre positive | BOM row 1; README § Overview table | SOURCED |
| 26 | SW2 SK12D07VG3 slide switch, power | BOM row 15; Documentation HTML BOM | SOURCED |
| 27 | SW1 TS-1102-4316 reset | BOM row 14; Documentation HTML BOM | SOURCED |
| 28 | LED1 green 3 mm status, LED2 red 3 mm power | BOM rows 5–6; Documentation HTML BOM | SOURCED |
| 29 | Passives R1–R6, U8–U11, U13–U19, C1–C4, U4, U6 roles | BOM rows 3,4,9–12,18,20,22; Documentation HTML BOM | SOURCED |
| 30 | Multiplexed with only 12 MCU pins | Clock/README.md § Features | SOURCED |
| 31 | Leading-zero blanking (9.41 not 09.41) | Clock/README.md § Features | SOURCED |
| 32 | DP after hours: 1 s on, 1 s off | Clock/README.md § Overview table | SOURCED |
| 33 | Reverse-polarity diode, slide switch, red power indicator | Clock/README.md § Features | SOURCED |
| 34 | Resistors and coin cell on back behind digits | Clock/README.md § Features | SOURCED |
| 35 | Three sketches: clock, set-time, I²C scanner | Clock/README.md § Features; Code folder | SOURCED |
| 36 | Power path SW2 → 1N4007 → LM7805; U4/U6 220 µF 25 V; C3 100 nF | Documentation HTML § 1 DC Power Supply; BOM row 18 | SOURCED |
| 37 | Total load 25–30 mA, no heat sink | Documentation HTML § 1 DC Power Supply | SOURCED |
| 38 | 22 pF load caps, 10 kΩ reset pull-up, reset button | Documentation HTML § 2 ATmega328P | SOURCED |
| 39 | D2–D9 segments, D10–D13 digit drivers | Clock/README.md § Pinout; Digital_Clock.ino #defines | SOURCED |
| 40 | DS1307 on A4/A5 with R4/R5 10 kΩ pull-ups; runs from CR2032 when 5 V is gone | README § Pinout; Documentation HTML § 3 | SOURCED |
| 41 | Seven shared segment lines with 150 Ω; DP 6.8 kΩ | README § Pinout; Documentation HTML § 5 | SOURCED |
| 42 | Segments active low; digit on while D10–D13 high | README § Pinout | SOURCED |
| 43 | Repo package: schematic PDF, EasyEDA Pro project, Gerbers, BOM, pick-and-place, STEP, HTML documentation | Folder listing: Schematic/, Gerber File/, BOM File/, Pick&Place File/, 3D Step File/, Documentation/ | SOURCED |
| 44 | Firmware uses RTClib, 12-hour conversion, 5 ms per digit, about 47 Hz refresh | README § Overview "How it works"; Digital_Clock.ino (`int d = 5`, RTC_DS1307) | SOURCED |
| 45 | Next-revision items: base resistors 1 kΩ, programming header, time-set buttons, designator re-annotation | Documentation HTML § Check Before Ordering PCBs items 1–4 | SOURCED |
| 46 | Chip must be programmed in an Uno and moved | Documentation HTML § Check Before Ordering item 2; § Build and Upload | SOURCED |

### Acqua Node V1.2 Water Monitoring IoT Node  `acqua-node`
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title "Acqua Node V1.2", "Water Monitoring IoT Node" | Acqua Node V1.2/README.md § H1 and tagline | SOURCED |
| 2 | Mains-powered ESP32-S3 SuperMini board | README.md § tagline | SOURCED |
| 3 | HLK-PM01 AC-DC supply, 100–240 V AC to 5 V DC | README.md § Features (Power) | SOURCED |
| 4 | Optocoupler-isolated relay output (PC817C + 2N2222A) | README.md § Features (Relay) | SOURCED |
| 5 | Ultrasonic sensor header (HC-SR04 compatible, 4-pin) | README.md § Features (Sensors) | SOURCED |
| 6 | RGB + discrete status LEDs | README.md § Features (Indicators) | SOURCED |
| 7 | ESP32-S3 SuperMini: Wi-Fi, Bluetooth 5, USB-C | README.md § Features (MCU) | SOURCED |
| 8 | SPDT relay | README.md § Features ("5V SPDT relay"); BOM row 12 SRD-24VDC-SL-C | SOURCED |
| 9 | Interfaces: HC-SR04 header, DPDT signal input, RGB and status LEDs | README.md § Features, § Pinout | SOURCED |
| 10 | 2-layer PCB, parts on top side | Documentation/Acqua_Node_V1.2_Documentation.html § PCB Layout ("Two-layer PCB with all components on the top side") | SOURCED |
| 11 | 4 × M3 holes | README.md § Features (Mounting); BOM row 13 | SOURCED |
| 12 | EDA: EasyEDA Pro | Documentation HTML footer ("Designed with EasyEDA Pro"); README project tree | SOURCED |
| 13 | Status prototype | Documentation HTML ("Prototype hardware only. Not safety certified.") | SOURCED |
| 14 | Role: schematic & PCB layout, no firmware | No .ino/.c/.cpp in folder; README lists a "Code & Pinout/" folder that does not exist | SOURCED |
| 15 | Measures tank level with HC-SR04, switches pump or valve via isolated relay, status LEDs | Documentation HTML § Overview | SOURCED |
| 16 | Runs directly from 220 V AC via HLK-PM01, no external 5 V adapter | Documentation HTML § Overview; README § Features | SOURCED |
| 17 | Carrier PCB approach | Documentation HTML § Overview | SOURCED |
| 18 | U6 ESP32-S3 SuperMini | BOM row 17 (README/doc call it U1; BOM designator used) | SOURCED |
| 19 | U5 HLK-PM01 | BOM row 16 (README/doc call it U2) | SOURCED |
| 20 | U1 PC817C | BOM row 14 (README/doc call it U3) | SOURCED |
| 21 | Q1 2N2222A relay driver | BOM row 8; README § Components | SOURCED |
| 22 | RLY1 SRD-24VDC-SL-C relay | BOM row 12. CONFLICT: README/doc describe a 5 V coil relay (SRD-05VDC-SL-C typical). Page avoids stating coil voltage | SOURCED |
| 23 | D1 1N4007 flyback diode | BOM row 2; README § Components | SOURCED |
| 24 | C2 100 µF bulk filter | BOM row 1; README § Components; doc § Passive Components | SOURCED |
| 25 | H1 PZ254V-11-04P 4-pin ultrasonic header (5 V, Trig, Echo, GND) | BOM row 5; README § Pinout (Ultrasonic Sensor Header) | INFERRED (H1 = ultrasonic header matched by pin count; not stated by designator) |
| 26 | H2 2-pin DPDT signal header | BOM row 6 ("DPDT Signal") | SOURCED |
| 27 | Screw terminals WJ500V-5.08-2P, DB128L-5.08-3P-GN-S for mains, relay load, DPDT | BOM rows 3–4 (designators DPDT, DPDT1, InputPowerandload); README § Pinout | SOURCED |
| 28 | U4 RGB LED | BOM row 15 | SOURCED |
| 29 | LED1, LED3, LED4, LED5 5 mm LEDs | BOM row 7 | SOURCED |
| 30 | R1–R10: 220 Ω LED limiting, 470 Ω opto/base, 10 kΩ pull-up | BOM rows 9–11; README § Components | SOURCED |
| 31 | IO7 → PC817C → 2N2222A → relay coil, 1N4007 clamp | README § GPIO Map; doc § 2 Relay Drive | SOURCED |
| 32 | Trig IO5, Echo IO6 | README § GPIO Map | SOURCED |
| 33 | RGB on IO9, IO12, IO13; 220 Ω limiting | README § GPIO Map; doc § LED Indicators | SOURCED |
| 34 | DPDT signal input on IO3 | README § GPIO Map, § Features | SOURCED |
| 35 | Mains terminals on one edge, separated from low-voltage logic | Documentation HTML § PCB Layout, Layout decisions | SOURCED |
| 36 | Power path N/L → HLK-PM01 → C2 → 5 V rail → SuperMini (onboard LDO makes 3.3 V) and relay coil | Documentation HTML § 1 Power Supply | SOURCED |
| 37 | HLK-PM01 is an isolated flyback module | Documentation HTML § HLK-PM01 | SOURCED |
| 38 | R2 470 Ω to PC817C, R3 470 Ω to Q1 base; two-stage drive because opto cannot sink coil current | Documentation HTML § 2 Relay Drive | SOURCED |
| 39 | USB-C faces board edge for programming inside an enclosure | Documentation HTML § PCB Layout | SOURCED |
| 40 | Repo package: schematic PDF, EasyEDA Pro project, Gerbers, BOM + priced BOM, pick-and-place, STEP, HTML documentation | Folder listing: Schamatic/, Garber File/, BOM/, BOM/Pricing/, Pick & Place File/, 3D Step File/, Documentation/ | SOURCED |
| 41 | Intended control loop: sensor, relay decision, LEDs, Wi-Fi publish; relay off on sensor fault | Documentation HTML § System & Firmware Workflow (described as "expected firmware design") | SOURCED |
| 42 | Not safety-certified | Documentation HTML safety notice | SOURCED |
| 43 | Next revision: Echo divider/level shifter, mains input protection (no fuse), 100 nF beside C2 | Documentation HTML § HC-SR04 note, § HLK-PM01 warning, § 1 Power Supply | SOURCED |

### ESP32 MLX90640 IR Thermal Camera  `ir-thermal-camera`

Abbreviations: `P` = ESP32 MLX90640 IR Thermal Camera V1.0 · `README` = P/README.md · `BOM` = P/BOM File/BOM_Board1_PCB1_2026-07-18.xlsx · `FW` = P/Code/main.ino/main.ino.ino · `DOCS` = P/Documentaion/thermal-camera-docs.html

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title (README H1 minus emoji and V1.0) | README § H1 | SOURCED |
| 2 | Battery-powered Wi-Fi thermal camera | README § intro | SOURCED |
| 3 | ESP32-WROOM-32-N4 reads MLX90640, 768 pixels → temperatures, live viewer from own AP, no app | README § intro | SOURCED |
| 4 | Works anywhere; ESP32 sends temperatures only; browser does interpolation, palettes, contrast, markers | README § Overview (paragraph after warning) | SOURCED |
| 5 | ESP32-WROOM-32-N4 (U4): dual-core, Wi-Fi + Bluetooth, 4 MB flash | README § Overview MCU; BOM U4 | SOURCED |
| 6 | MLX90640 module on CN7, not on BOM, 32 × 24, I²C 0x33 | README § Overview Thermal sensor | SOURCED |
| 7 | BQ24092DGQR (U3), R13 sets current, limited to USB 500 mA level, 4.20 V | README § Overview Battery charger; BOM U3, R13 | SOURCED |
| 8 | TPS63020DSJT (U2), 3.28 V via R11/R12 (1 MΩ / 180 kΩ) | README § Overview Main regulator; BOM U2, R11, R12 | SOURCED |
| 9 | XFL4020-152MEC (L1) 1.5 µH | README; BOM L1 | SOURCED |
| 10 | 0603L100SLYR (U5) 1 A PTC on USB VBUS | README § Overview Protection; BOM U5 | SOURCED |
| 11 | BC847 Q3/Q4 auto reset/boot | README § Overview Programming; BOM Q3/Q4 | SOURCED |
| 12 | PZ254V-11-06P (H1) 6-pin header for 3.3 V USB-UART adapter | README § Programming header H1; BOM H1 | SOURCED |
| 13 | TYPE-C 6P(073) (USB1) power only, 5.1 kΩ CC pull-downs | README § Overview USB-C; BOM USB1, R17/R18 | SOURCED |
| 14 | SK12D07VG3 (SW1) between VBAT and VIN | README § Overview Power switch; BOM SW1 | SOURCED |
| 15 | ZX-XH2.54-4PZZ CN1/3/4/6/7 for sensor, GPIO, 3.3 V out | README § Overview Expansion; BOM | SOURCED |
| 16 | ZX-XH2.54-2PZZ CN2 battery connector, bottom side | README § Overview Power input, § Expansion connectors; BOM CN2 | SOURCED |
| 17 | LED_0603-R (LED2) red on PG pin, lit while USB power present | README § Overview Status LED; BOM LED2 | SOURCED |
| 18 | Passives R6–R20, C5–C18 | BOM resistor/capacitor rows | SOURCED |
| 19 | 8 Hz per subpage, 18-bit, two subpages → about 4 images/s, I²C 800 kHz | README § Overview Frame rate; FW I2C_CLOCK_HZ | SOURCED |
| 20 | Per-pixel To with emissivity 0.95; min, max, avg, centre | README § Thermal image flow; FW EMISSIVITY | SOURCED |
| 21 | AP MLX90640-Camera, channel 1, up to 4 clients, 192.168.4.1 | README § Overview Wireless; FW softAP(..., 1, false, 4) | SOURCED |
| 22 | Compile-time option to join an existing network (USE_AP_MODE) | README § Getting started (IMPORTANT note); FW USE_AP_MODE | SOURCED |
| 23 | Browser renders 512 × 384 image with palettes, smoothing, auto-contrast, markers | README § Thermal image flow | SOURCED |
| 24 | Endpoints /, /data JSON, /csv 24 × 32, /health | README § Thermal image flow URL table; FW server.on | SOURCED |
| 25 | 1-cell Li-ion/Li-Po on CN2, USB-C charging, 6.6 V input OVP | README § Overview | SOURCED |
| 26 | TPS63020 works above and below the battery voltage | README § Overview Main regulator | SOURCED |
| 27 | Auto-reset circuit, no buttons needed for upload | README § Getting started step 4 | SOURCED |
| 28 | Battery sense divider R19/R20 100 kΩ to GPIO34 | README § Overview Battery monitoring; BOM R19/R20 | SOURCED |
| 29 | XH connectors for spare GPIOs (incl. VSPI pins) and 3.3 V out; four plated M3 holes on GND | README § Overview Expansion, § Expansion connectors | SOURCED |
| 30 | Power path USB-C → PTC → BQ24092 → CN2; SW1 → TPS63020 → ESP32, CN7, CN6 | README § Overview diagram, § Power flow | SOURCED |
| 31 | USB-C carries power only, no data lines | README § Overview USB-C; § Getting started IMPORTANT | SOURCED |
| 32 | PCB antenna over a cut-out in the board edge | README § Overview MCU | SOURCED |
| 33 | H1 pinout DTR/TXD/RXD/3V3/RTS/GND; Q3/Q4 drive GPIO0 and EN | README § Programming header H1, § ESP32 module pin usage | SOURCED |
| 34 | CN7 pinout GND, 3V3, SCL GPIO22, SDA GPIO21; no I²C pull-ups on board | README § Expansion connectors, § CAUTION | SOURCED |
| 35 | PCB 55.0 × 49.6 mm, 2 layers, 1.6 mm, 3.5 mm radii, 37 SMD + 13 TH placements, 80 vias | README § Overview PCB | SOURCED |
| 36 | Spec EDA: EasyEDA Pro | README § Overview EDA tool | SOURCED |
| 37 | Spec MCU / Sensor / Connectivity / Power rows | README § Overview | SOURCED |
| 38 | Status "prototype" (README lists V1.0 issues; no complete/WIP statement) | README § warning | SOURCED |
| 39 | Role includes firmware (Code/main.ino present) | folder listing | SOURCED |
| 40 | Fabrication package in repo: three-sheet schematic PDF, EasyEDA Pro project, Gerbers, BOM with LCSC numbers, pick-and-place, STEP | README § Project files; folder listing | SOURCED |
| 41 | Firmware: AP, web server, MLX90640 readout; viewer in webpage.h | README § Project files | SOURCED |
| 42 | Melexis driver files not in the repo | README § Getting started step 3 | SOURCED |
| 43 | Interactive HTML documentation: circuit blocks, simulations, pin map, viewer on simulated data, 3D model | README § intro (documentation link note) | SOURCED |
| 44 | Known issue: TPS63020 EN/VINA/PS-SYNC not connected to VIN; 3.3 V rail not expected to start; rework described | README § warning, § Manufacturing notes | SOURCED |
| 45 | Known issue: R15 pulls TS to VBAT → TTDM, no termination, safety timer, temperature check | README § warning item 2 | SOURCED |
| 46 | Recommended: I²C pull-ups, charger output capacitor, reverse-polarity protection, RESET/BOOT buttons, CHG LED | README § Manufacturing notes, Recommended changes | SOURCED |
| 47 | Battery voltage on GPIO34 not read by current firmware | README § Overview Battery monitoring | SOURCED |
| 48 | Gallery schematic captions (sheet 1 ESP32 MCU, 2 Power, 3 USB) | README § Images table; DOCS sheet captions | SOURCED |

### IoT PM & Air Quality Monitoring System  `air-quality-monitor`

Folder abbreviated below as `AQ/` = `IoT Based PM & Air Quality Monitoring System V1.0/`. Docs HTML = `AQ/Documentaion/IoT_PM_Air_Quality_Monitoring_System_V1.0_Technical_Documentation.html`. Code = `AQ/Code/PM_&_Air_Quality_Monitoring_System/PM_Air_Quality_Monitoring_System.ino`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title (README H1 minus "Based" and version) | AQ/README.md H1 | SOURCED |
| 2 | Standalone IoT air-quality monitor on ESP32-WROOM DevKit, custom PCB | AQ/README.md § Overview | SOURCED |
| 3 | Readings on 1.3" 128×64 I²C OLED and on a web dashboard served by the ESP32 over Wi-Fi | AQ/README.md § Overview | SOURCED |
| 4 | PM1.0/PM2.5/PM10 from Plantower PMS7003 over UART, µg/m³ | AQ/README.md § Overview table | SOURCED |
| 5 | PMS7003 is a laser particle counter | Docs HTML (PMS7003 section) | SOURCED |
| 6 | Temperature, RH, IAQ (0–500), CO₂ eq, breath-VOC eq from Bosch BME680 via BSEC, I²C | AQ/README.md § Overview table; Code (`bsec.h`, BSEC outputs) | SOURCED |
| 7 | Status = prototype (README states no completion; design review lists open high-severity issues) | AQ/README.md (no status stated); Docs HTML § Design Review and Known Issues | INFERRED |
| 8 | Role includes firmware | AQ/Code/ (.ino + webpage.h) | SOURCED |
| 9 | ESP1 = ESP32-WROOM DevKit 30-pin | BOM row 5 | SOURCED |
| 10 | U1 environmental sensor module; firmware uses BME680 at 0x77 (schematic/BOM label "BME280 0x76") | BOM row 8; README § Environmental Sensor Module; Code comment "BME680 address 0x77" | SOURCED |
| 11 | U2 = SH1106 1.3" 128×64 I²C OLED, address 0x3C, two-page readout | BOM row 9; README § OLED Display; README § Overview | SOURCED |
| 12 | CN1 = Megastar ZX-XH2.54-4PZZ 4-pin XH header for PMS7003 (GND, 5V, RX, TX) | BOM row 3; README § PMS7003 Connector | SOURCED |
| 13 | PMS7003 is off-board, connected via CN1 (not in BOM) | BOM (no PMS7003 row); README § PMS7003 Connector | SOURCED |
| 14 | DC1 = DC-005 5.5 × 2.0 mm jack | BOM row 4; Docs HTML BOM table | SOURCED |
| 15 | C1, C6 = KEMET ESK106M025AC3AA 10 µF, bulk | BOM row 1; README ("a bulk capacitor") | SOURCED |
| 16 | C2, C4, C5, C7 = 100 nF CC1H104MC1FD3F6C10MF, module decoupling | BOM row 2; README ("a decoupling capacitor on every module") | SOURCED |
| 17 | Mounting: SCREW1 M2, SCREW2–4 M3 | BOM rows 6–7; Docs HTML (1 × M2, 3 × M3) | SOURCED |
| 18 | Specs: PCB 2 layers, 94.5 × 52.1 mm, through-hole, EasyEDA Pro | Docs HTML § PCB ("two-layer, 94.5 × 52.1 mm ... EasyEDA Pro v3.2.209", "All through-hole, top side") | SOURCED |
| 19 | Specs: Power 5 V DC jack, unregulated 5 V rail | README § Power Input warning | SOURCED |
| 20 | UART2 GPIO 16/17, 9600 baud 8N1 | README § Pinout, § PMS7003 Connector; Code `PMS_RX 16`, `PMS_TX 17` | SOURCED |
| 21 | OLED switches pages every 5 s | README § Overview; Code `pageSwitchInterval = 5000` | SOURCED |
| 22 | Web dashboard at device IP; JSON REST endpoint /api/readings, CORS enabled | README § Key features | SOURCED |
| 23 | IAQ status levels Good … Hazardous | README § Key features | SOURCED |
| 24 | Dashboard warnings with editable thresholds saved in browser local storage | Docs HTML (dashboard section: "Live warnings plus editable thresholds ... Save keeps them in the browser's local storage") | SOURCED |
| 25 | Serial log 115200 baud every 3 s | README § Key features; Code `serialPrintInterval = 3000` | SOURCED |
| 26 | GPIO 2 LED blinks on sensor error | README § Pinout (D2 row) | SOURCED |
| 27 | +5 V rail straight to PMS7003 and ESP32 VIN, no regulator; PMS7003 rated 4.5–5.5 V; use regulated 5 V | README § Power Input warning | SOURCED |
| 28 | 3.3 V from DevKit powers OLED and sensor | README § ESP32 Pin Assignment (3V3 row) | SOURCED |
| 29 | Can be powered/flashed from the DevKit USB port | README § Power Input warning | SOURCED |
| 30 | Shared I²C on GPIO 21/22 for OLED and sensor | README § ESP32 Pin Assignment | SOURCED |
| 31 | CN1 silkscreen names ESP32 side; sensor TX to RX pad | README § PMS7003 Connector note | SOURCED |
| 32 | PMS7003 1.27 mm 10-pin connector needs adapter cable to the 2.5 mm XH header | Docs HTML (PMS7003 wiring note) | SOURCED |
| 33 | 3.5 mm rounded corners, parts through-hole on top; 1 M2 + 3 M3 holes plus 5 unplated 3.0 mm holes for OLED and sensor modules | Docs HTML § PCB table | SOURCED |
| 34 | Repo contents: firmware + webpage.h, schematic PDF + .epro2, Gerbers, BOM, pick-and-place, STEP, documentation HTML + PDF | AQ/README.md § Repository contents; folder listing | SOURCED |
| 35 | Design review: U1 label BME280/0x76 vs firmware BME680/0x77 (High, Open) | Docs HTML § Design Review and Known Issues #1 | SOURCED |
| 36 | Silkscreen "5v-9v DC" vs unregulated 5 V rail (High, Open) | Docs HTML § Design Review #2 | SOURCED |
| 37 | No reverse-polarity, over-current or ESD protection (Medium, Open) | Docs HTML § Design Review #3 | SOURCED |
| 38 | SH1106 driven with SSD1306 library (Medium, Open) | Docs HTML § Design Review #4; Code `#include <Adafruit_SSD1306.h>` | SOURCED |
| 39 | BSEC calibration lost on reset (Medium, Open) | Docs HTML § Design Review #5 | SOURCED |
| 40 | Original BSEC library deprecated, port to BSEC2 (Medium, Open) | Docs HTML § Design Review #6 | SOURCED |
| 41 | Wi-Fi connection has no time-out (Low, Open) | Docs HTML § Design Review #8 | SOURCED |
| 42 | GitHub URL | manifest.json | SOURCED |

### IoT Patient Health Monitoring System  `patient-health-monitor`

Folder abbreviated below as `PHM/` = `Iot Patient Health Monitoring V1.0/`. Docs HTML = `PHM/Documentaion/Documentation.html`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title "IoT Patient Health Monitoring System" | PHM/README.md H1 | SOURCED |
| 2 | Reads ECG + heart rate, SpO₂, body temperature, room conditions; live web dashboard | PHM/README.md subtitle and § Features | SOURCED |
| 3 | Dashboard served from the ESP32; no cloud, app or external server | PHM/README.md intro caption | SOURCED |
| 4 | Custom through-hole carrier PCB combining ESP32, ECG front end, pulse oximeter, 16-bit ADC and environmental sensor | PHM/README.md intro caption | SOURCED |
| 5 | Educational / prototype, not a certified medical device | PHM/README.md § Medical disclaimer | SOURCED |
| 6 | Status = prototype | PHM/README.md status badge ("prototype") | SOURCED |
| 7 | Role includes firmware | PHM/Code/ (.ino + dashboard_page.h) | SOURCED |
| 8 | MCU: ESP32-WROOM DevKit 30-pin (ESP1) | BOM row 4 | SOURCED |
| 9 | AD8232 ECG module (U2): output to ADS1115 A0, LO+/LO− to GPIO 18/19, SDN from GPIO 5 | BOM row 10; README § System Architecture and § Pinout | SOURCED |
| 10 | MAX30102 (U3, Maxim Integrated), SpO₂ + finger detection, I²C 0x57 | BOM row 11; README § Features, § I2C bus | SOURCED |
| 11 | ADS1115 breakout (P1), A0 ECG, A1 body temp, I²C 0x48 | BOM row 5; README § ADS1115 channels, § I2C bus | SOURCED |
| 12 | ADS1115 is 16-bit | README intro caption ("16-bit ADC") | SOURCED |
| 13 | BME280 (U1), room temp + humidity, I²C 0x76 | BOM row 9; README § Features, § I2C bus | SOURCED |
| 14 | R1 = Semitec 103AT-2 10 kΩ NTC, lower leg of divider | BOM row 6; README § Body temperature divider | SOURCED |
| 15 | R2 = 10 kΩ, upper leg to 3V3 | BOM row 7; README § Body temperature divider | SOURCED |
| 16 | DC1 = DC-005 5.5 × 2.0 mm jack onto +5 V net | BOM row 3 (footprint DC-IN-TH_DC-005-5.5-2.0); README § Circuit Diagram (Power) | SOURCED |
| 17 | C1 = KEMET ESK106M025AC3AA 10 µF on 5 V rail | BOM row 1; README § Circuit Diagram (Power) | SOURCED |
| 18 | C2–C7 = 100 nF CC1H104MC1FD3F6C10MF; C2 5 V, C3 3.3 V, C4 BME280, C5 AD8232, C6 ADS1115, C7 MAX30102 | BOM row 2; README § Circuit Diagram (Power) | SOURCED |
| 19 | Four M3 holes SCREW1–4, spaced about 82.6 × 66.4 mm | BOM row 8; README § PCB Design | SOURCED |
| 20 | Specs: Sensors AD8232 / MAX30102 / 10 kΩ NTC / BME280 | BOM; README § Features | SOURCED |
| 21 | Specs: Wi-Fi web dashboard on port 80 | README § System Architecture | SOURCED |
| 22 | Specs: Power 5–9 V DC jack to DevKit VIN, sensors on 3.3 V | README § Circuit Diagram (Power) | SOURCED |
| 23 | Specs: PCB 2 layers, 88.5 × 72.3 mm, through-hole, EasyEDA Pro | README § PCB Design | SOURCED |
| 24 | ECG live trace, R-peak BPM, lead-off detection | README § Features | SOURCED |
| 25 | Body temperature via Steinhart beta equation, B = 3950 | README § Features, § Body temperature divider (formula uses 3950) | SOURCED |
| 26 | Shared I²C on GPIO 21/22 | README § Pinout; .ino header comment | SOURCED |
| 27 | ADS1115 gain ×1 (±4.096 V), 128 SPS | README § ADS1115 channels | SOURCED |
| 28 | Browser polls two JSON endpoints, draws client-side | README § System Architecture | SOURCED |
| 29 | Patient record in browser storage: name, ID, bed, ward, age, blood group, gender, contact, notes | README § Features | SOURCED |
| 30 | Logging 2–60 s interval, up to 500 rows, Excel (.xls) export; rule-based alerts with suggestions | README § Features | SOURCED |
| 31 | All sensors on DevKit 3.3 V regulator | README § Circuit Diagram (Power) | SOURCED |
| 32 | SDN held HIGH to enable; GPIO 5 strapping pin driven only after boot | README § Pinout; Docs HTML (line "is driven from GPIO5 and held HIGH to enable the chip") | SOURCED |
| 33 | Electrodes RA, LA, RL via AD8232 module's 3.5 mm jack | README § Circuit Diagram (ECG); Docs HTML ("connected through the AD8232 module's 3.5 mm jack") | SOURCED |
| 34 | Divider midpoint TEMP_SENSE to ADS1115 A1; firmware converts to resistance then °C | README § Body temperature divider | SOURCED |
| 35 | Two-layer, EasyEDA Pro, all components top side, 88.5 × 72.3 mm outline, no SMT assembly needed | README § PCB Design | SOURCED |
| 36 | Folder contains schematic PDF, .epro2, Gerber ZIP, BOM, pick-and-place, STEP, firmware (.ino + dashboard_page.h), documentation PDF + HTML | Folder listing; README § Repository Structure | SOURCED |
| 37 | Gerber ZIP contents: copper, mask, silkscreen, outline, drill, flying-probe test file | README § PCB Design | SOURCED |
| 38 | ECG requested 125 Hz, real rate lower/uneven; fine for HR, not diagnostic morphology | README § Known Limitations | SOURCED |
| 39 | Threshold BPM detector; uncalibrated thermistor contact reading; no auth/HTTPS; hard-coded Wi-Fi credentials | README § Known Limitations | SOURCED |
| 40 | Ideas: WiFiManager, MQTT/cloud, flash log storage, battery + charging, enclosure | README § Known Limitations (Ideas) | SOURCED |
| 41 | No GitHub link (links omitted) | manifest.json (github: null) | SOURCED |

### ESP32 Fingerprint Voting Machine  `fingerprint-voting-machine`

Folder abbreviated below as `FVM/` = `Fingerprint Voting Machine V1.0/`. Docs HTML = `FVM/Documentaion/index.html`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title "ESP32 Fingerprint Voting Machine" | FVM/README.md H1 | SOURCED |
| 2 | Standalone biometric voting system on custom PCB; one finger, one vote, live results over Wi-Fi | FVM/README.md tagline | SOURCED |
| 3 | R503 capacitive fingerprint sensor identifies voters | FVM/README.md § Overview | SOURCED |
| 4 | 15-second window to press one of four candidate buttons; vote stored, voter flagged, second attempt rejected | FVM/README.md § Overview | SOURCED |
| 5 | No server, cloud or phone app; joins Wi-Fi; dashboard for enroll, live results, CSV export, reset | FVM/README.md § Overview | SOURCED |
| 6 | Status = prototype (README states no completion or test result) | FVM/README.md (no status stated) | INFERRED |
| 7 | Role includes firmware | FVM/Code/ (.ino + dashboard.h) | SOURCED |
| 8 | MCU: DOIT ESP32 DEVKIT V1 (U1), dual-core 240 MHz, Wi-Fi | BOM row 8; README § Overview table | SOURCED |
| 9 | R503 UART2 at 57600 baud, up to 200 templates | README § Overview table | SOURCED |
| 10 | Display: 1.3" SH1106 OLED (U2), 128×64, I²C 0x3C | BOM row 9; README § Overview table | SOURCED |
| 11 | OLED shows IP address at boot | README § Quick start step 5 | SOURCED |
| 12 | R503 is off-board, connected via CN1 | BOM (no R503 row); Docs HTML ("XH-6A connector for R503 (CN1)") | SOURCED |
| 13 | CN1 = BOOMELE XH-6A 6-pin connector | BOM row 3 | SOURCED |
| 14 | KEY1–KEY4 = Omron B3F-4055, candidate buttons | BOM row 5; README § Pin map | SOURCED |
| 15 | R1–R4 = 10 kΩ button pull-ups | BOM row 6; Docs HTML ("4× 10 kΩ button pull-ups (R1–R4)") | SOURCED |
| 16 | DC1 = DC-005 5.5 × 2.0 mm jack, 5 V input | BOM row 4; Docs HTML ("DC-005 5.5×2.0 mm jack (DC1)") | SOURCED |
| 17 | C1, C4 = KEMET ESK106M025AC3AA 10 µF | BOM row 1 | SOURCED |
| 18 | C2, C3, C15 = 100 nF CC1H104MC1FD3F6C10MF | BOM row 2 | SOURCED |
| 19 | Four M3 mounting holes | BOM row 7 | SOURCED |
| 20 | Buttons on GPIO 5/18/19/23 | README § Overview table, § Pin map | SOURCED |
| 21 | Persistence in ESP32 NVS for profiles, voted flags, vote totals | README § Overview table, § Where data lives | SOURCED |
| 22 | Designed in EasyEDA Pro | Docs HTML ("The design was created in EasyEDA Pro"); README PCB badge | SOURCED |
| 23 | No button in 15 s → no vote, voter not flagged, can rescan | README § Voting | SOURCED |
| 24 | Rejected scans return to idle; buttons ignored outside vote window | README § Voting; § Pin map note | SOURCED |
| 25 | fingerSearch(1) then fingerFastSearch() fallback; MATCH_SECURITY_LEVEL tunable | README § Voting; § Troubleshooting | SOURCED |
| 26 | Dashboard-only enrollment; two scans; duplicate check aborts | README § Enrollment, § Quick start step 6 | SOURCED |
| 27 | Templates in R503 flash (≤200); profiles/flags/totals in NVS survive power loss | README § Where data lives | SOURCED |
| 28 | Single-page dashboard on port 80; CSV export; reset; standalone preview on simulated data | README § Overview table, § Quick start (Preview without hardware) | SOURCED |
| 29 | Voting still works offline | README § Troubleshooting (WIFI OFF row) | SOURCED |
| 30 | One cooperative loop, three modes: idle scan, enrolling, vote window | README § How it works | SOURCED |
| 31 | R503 on UART2 GPIO 16 RX / 17 TX; OLED I²C GPIO 21/22 | README § Pin map; .ino `FINGER_RX 16`, `FINGER_TX 17`, `OLED_SDA 21`, `OLED_SCL 22` | SOURCED |
| 32 | R503, OLED and buttons on 3.3 V | README § Pin map (3.3 V / GND row) | SOURCED |
| 33 | Buttons active low, 10 kΩ PCB pull-up plus internal pull-up | Docs HTML pin table ("Active LOW; 10 kΩ pull-up on PCB + internal pull-up") | SOURCED |
| 34 | 5 V via DC jack or USB; regulated 5 V, ≥500 mA recommended | Docs HTML BOM table ("5 V DC Power Supply — USB or regulated 5 V; minimum 500 mA recommended"); BOM DC1 | SOURCED |
| 35 | Two 10 µF + three 100 nF for filtering/decoupling | BOM rows 1–2; Docs HTML ("2× 10 µF + 3× 100 nF capacitors") | SOURCED |
| 36 | OLED power pins swapped in first PCB design; this revision (V1.0 folder) corrects them and updates schematic, PCB, Gerber, BOM, P&P, STEP; firmware unchanged | Docs HTML (revision note, line ~549) | SOURCED |
| 37 | Repo: firmware + dashboard.h, standalone dashboard.html, schematic PDF + .epro2, Gerber ZIP, BOM, P&P, STEP, HTML + PDF docs | Folder listing; README § Project structure | SOURCED |
| 38 | SH1106 in BOM vs Adafruit SSD1306 library in firmware | README § Known limitations | SOURCED |
| 39 | Vote log stores voter name with candidate; treat log/CSV as confidential | README § Known limitations | SOURCED |
| 40 | Event log RAM-only (last 80 events), cleared on reboot | README § Known limitations, § Where data lives | SOURCED |
| 41 | No dashboard authentication | README § Known limitations | SOURCED |
| 42 | All 200 slots full → next enrollment overwrites slot 200 | README § Known limitations | SOURCED |
| 43 | Votes stay counted after voter deletion | README § Known limitations | SOURCED |
| 44 | GitHub URL | manifest.json | SOURCED |

### ESP32 Standalone Board  `esp32-standalone-board`

Abbreviations: `P` = ESP32 Standalone Board V1.0 · `README` = P/README.md · `BOM` = P/BOM File/BOM_Board1_PCB1_2026-07-18.xlsx · `DOCS` = P/Documentation/ESP32_Standalone_Board_V1.0_Documentation.html

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title (README H1 minus emoji and V1.0) | README § H1 | SOURCED |
| 2 | Compact, battery-powered ESP32 development/deployment board combining ESP32-WROOM-32-N4, USB-C Li-ion charger, 3.3 V buck-boost, 6-pin auto-reset header, 2.5 mm XH connectors | README § intro | SOURCED |
| 3 | Standalone ESP32 node: plug in battery, switch on, attach I²C sensors, SPI/UART peripherals, GPIO modules | README § Overview (paragraph after warning) | SOURCED |
| 4 | ESP32-WROOM-32-N4 (U4) dual-core, Wi-Fi + Bluetooth, 4 MB flash | README § Overview MCU; BOM U4 | SOURCED |
| 5 | BQ24092DGQR (U3), R13 sets current, limited to USB 500 mA level, 4.20 V | README § Overview Battery charger; BOM U3, R13 | SOURCED |
| 6 | TPS63020DSJT (U2), 3.28 V via R11/R12 1 MΩ / 180 kΩ | README § Overview Main regulator; BOM U2, R11, R12 | SOURCED |
| 7 | XFL4020-152MEC (L1) 1.5 µH | README; BOM L1 | SOURCED |
| 8 | 0603L100SLYR (U5) 1 A PTC on USB VBUS | README § Overview Protection; BOM U5 | SOURCED |
| 9 | BC847 Q3/Q4 auto reset/boot | README § Overview Programming; BOM Q3/Q4 | SOURCED |
| 10 | PZ254V-11-06P (H1) 6-pin header for 3.3 V USB-UART adapter | README § Programming header H1; BOM H1 | SOURCED |
| 11 | TYPE-C 6P(073) (USB1) power only, 5.1 kΩ CC pull-downs | README § Overview USB-C; BOM USB1, R17/R18 | SOURCED |
| 12 | SK12D07VG3 (SW1) between VBAT and VIN | README § Overview Power switch; BOM SW1 | SOURCED |
| 13 | ZX-XH2.54-4PZZ CN1/3/4/6/7 for I²C, GPIO, 3.3 V out | README § Overview Expansion, § Expansion connectors; BOM | SOURCED |
| 14 | ZX-XH2.54-2PZZ CN2 battery connector, bottom side | README § Overview Power input; BOM CN2 | SOURCED |
| 15 | KT-0603R (LED2) red on PG, lit while USB power present | README § Overview Status LED; BOM LED2 | SOURCED |
| 16 | Passives R6–R20, C5–C18 | BOM resistor/capacitor rows | SOURCED |
| 17 | PCB antenna overhangs top edge by about 5.6 mm | README § Overview MCU | SOURCED |
| 18 | Charged from USB-C at USB 500 mA level, 6.6 V input OVP | README § Overview Battery charger | SOURCED |
| 19 | TPS63020 works above and below the battery voltage | README § Overview Main regulator | SOURCED |
| 20 | 1 A PTC on VBUS, CC pull-downs for USB-C sink | README § Overview Protection | SOURCED |
| 21 | Auto-reset handles boot mode; no buttons needed | README § Getting started step 3 | SOURCED |
| 22 | CN7 I²C GPIO21/22; CN1 VSPI GPIO5/18/19/23; CN3 GPIO35/25/26/27; CN4 GPIO14/13/GPIO2 via 220 Ω; CN6 3.3 V | README § Expansion connectors, § ESP32 module pin usage | SOURCED |
| 23 | No I²C pull-ups on board; devices bring their own | README § Expansion connectors (CN7), § Getting started step 4 | SOURCED |
| 24 | Battery sense R19/R20 100 kΩ to GPIO34, reads cell while SW1 on | README § Overview Battery monitoring; BOM R19/R20 | SOURCED |
| 25 | Cell still charges when SW1 is off | README § Overview Power switch | SOURCED |
| 26 | Four plated M3 mounting holes on GND | README § Overview Expansion; BOM SCREW1–4 | SOURCED |
| 27 | Power path USB-C → PTC → BQ24092 → CN2; SW1 → TPS63020 → ESP32, CN6, CN7 | README § Overview diagram, § Power flow | SOURCED |
| 28 | USB-C power only, no data lines | README § Overview USB-C; § Getting started IMPORTANT | SOURCED |
| 29 | H1 pinout DTR/TXD/RXD/3V3/RTS/GND; Q3/Q4 drive GPIO0 and EN | README § Programming header H1, § ESP32 module pin usage | SOURCED |
| 30 | Programmable from Arduino IDE, PlatformIO or ESP-IDF | README § Getting started step 3 | SOURCED |
| 31 | PCB 62.9 × 33.0 mm, 2 layers, 1.6 mm; 37 SMD placements on top + 9 hand-soldered parts | README § Overview PCB | SOURCED |
| 32 | Spec EDA: EasyEDA Pro | README § Overview EDA tool | SOURCED |
| 33 | Status "prototype" (README documents V1.0 issue; no complete/WIP statement) | README § warning | SOURCED |
| 34 | Role "Schematic & PCB layout" (no .ino/.c/.cpp in folder) | folder listing | SOURCED |
| 35 | Fabrication package in repo: schematic PDF + PNG exports, EasyEDA Pro project, Gerbers, BOM with LCSC numbers, pick-and-place, STEP | README § Project files; folder listing | SOURCED |
| 36 | Interactive HTML documentation: circuit blocks with schematics, simulations, pin map, board status preview, 3D model | README § intro (documentation link note) | SOURCED |
| 37 | No firmware included | folder listing | SOURCED |
| 38 | Known issue: TPS63020 EN/VINA/PS-SYNC not connected to VIN; 3.3 V rail not expected to start; rework described | README § warning, § Manufacturing notes | SOURCED |
| 39 | Recommended changes: TS pin, charger output capacitor, reverse-polarity protection, RESET/BOOT buttons, I²C pull-ups, route CHG/PG to GPIOs | README § Manufacturing notes | SOURCED |
| 40 | Tag "power management" (charger + buck-boost board) | README § intro | INFERRED |
| 41 | Gallery schematic captions sheet 1 ESP32 MCU, 2 Power, 3 USB and connectors; schematic-4..6 are the Image/Schematic page exports of the same three sheets | DOCS sheet captions/alt text; Image/Schematic file names | SOURCED |

### ESP32 Home Automation Relay Boards  `home-automation`

Abbreviations: V1 = `Home Automation/4 Channel Relay TH V1/`, V2.1 = `Home Automation/6 Channel Relay TH V2.1/`, V2.2 = `Home Automation/6 Channel Relay TH V2.2/`. BOM = `<board>/BOM File/BOM_Board1_PCB1_<date>.xlsx`. FW-V1 = `V1/Code & Pinout/esp32_relay_code&dashboard/home_automation_v2_with_switches/home_automation_v2_with_switches.ino`. FW-V2.1 = `V2.1/Code & Pinout/Code/esp32_relay_dashboard/*.ino`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Three boards: 4-channel V1, 6-channel V2.1, 6-channel V2.2 | Folder names; V1/V2.1/V2.2 README H1 | SOURCED |
| 2 | Through-hole PCBs | V1 README § Overview ("through-hole PCB"); V2.1 README spec "Relay Type: Through-Hole (TH)"; board names "TH" | SOURCED |
| 3 | Wi-Fi and wall-switch control of mains loads (lights, fans, sockets) | V1 README § 1 Overview; V2.2 README § Overview | SOURCED |
| 4 | Self-hosted web server, no cloud, no app, no subscription | V1 README § 1 Overview | SOURCED |
| 5 | MCU is Ai-Thinker ESP32-S module, designator U9 (all three boards) | V1/V2.1/V2.2 BOM row "ESP32-S, Ai-Thinker, U9" | SOURCED |
| 6 | HLK-10M05T AC-DC module, U5 on V1, U11 on V2.2 | V1 BOM row 24; V2.2 BOM row 27 | SOURCED |
| 7 | HLK-PM01 AC-DC module, U11 on V2.1 | V2.1 BOM row 28 (README says "HLK-M505"; BOM used) | SOURCED |
| 8 | Hi-Link modules convert mains to 5 V | V1 README § 6 (HLK-10M05T 5V/2A); V2.1 README § Circuit Overview (5V DC); V2.2 README § Power Architecture | SOURCED |
| 9 | 220 V AC input | V1 README § 1; V2.1 README spec; V2.2 README header | SOURCED |
| 10 | AMS1117-3.3V LDO, U10, 5 V to 3.3 V for ESP32 logic | All BOMs row AMS1117-3.3V U10; V2.2 README § Power Architecture | SOURCED |
| 11 | 3.3 V rail also feeds optocoupler logic side and CH340C | V2.2 README § Power Architecture | SOURCED |
| 12 | 5 V feeds relay coils | V2.1 README § Circuit Overview; V2.2 README § Power Architecture | SOURCED |
| 13 | Relay part SRD-24VDC-SL-C, RLY1–RLY4 (V1), RLY1–RLY6 (V2.x) | All BOMs | SOURCED (note: READMEs say 5 V coil; BOM lists 24 VDC variant; Saad to confirm) |
| 14 | PC817C optocoupler per channel, U1–U4 / U1–U6, galvanic isolation | All BOMs; V1 README § 6; V2.1 README § Circuit Overview | SOURCED |
| 15 | 2N2222A driver per channel, Q1–Q4 / Q1–Q6 | All BOMs; V2.1 README spec "Driver" | SOURCED |
| 16 | 1N4007 flyback diode per relay, D1–D4 / D1–D6 | All BOMs; V2.1 README spec "Protection" | SOURCED |
| 17 | Status LED per channel | V1 README § 3 ("BLUE LED per relay channel"); V2.1 README § Circuit Overview item 5 | SOURCED |
| 18 | CH340C USB-to-UART, U8 | All BOMs; V1 README § 1 table "Programming USB-C (CH340C)" | SOURCED |
| 19 | USB-C 16-pin receptacle, USB1 | All BOMs (USB_TYPE-C-16P) | SOURCED |
| 20 | USBLC6-2SC6 USB ESD protection, D5 (V1), D7 (V2.2); not in V2.1 BOM | V1 BOM row 8; V2.2 BOM row 9; V2.2 README Key Components "USB ESD protection"; V2.1 BOM | SOURCED |
| 21 | 14D121K varistor (MOV), R11 (V1), R33 (V2.2); not in V2.1 BOM | V1 BOM row 16; V2.2 BOM row 18; V1 README § 10 "R11 provides basic surge suppression"; V2.2 README "120V MOV" | SOURCED |
| 22 | DB128 terminal blocks CN1/CN4 (V1), CN2/CN4 (V2.1), CN1/CN2/CN4 (V2.2) carry relay-output, wall-switch and ground terminals | BOMs list the DB128 parts; mapping to functions from V1 README § 4 (4-pin J_RELAY, 4-pin J_SW) and V2.2 README § Top Edge Connectors (6-pin NO, 6-pin Sw, 3-pin GND) | INFERRED |
| 23 | Passives R1–R33, C1–C20 incl. 10 kΩ switch pull-ups | All BOMs; V1 README § 4 (R27–R30 10kΩ pull-ups) | SOURCED |
| 24 | Relay drive active-high (HIGH = ON) | FW-V1 line 35; FW-V2.1 `RELAY_ACTIVE_LOW false`; V2.1 README spec | SOURCED |
| 25 | Wall-switch input per relay, 50 ms debounce | FW-V1 / FW-V2.1 `SWITCH_DEBOUNCE_MS = 50` | SOURCED |
| 26 | Web dashboard on port 80 | FW-V1 `WebServer server(80)`; V1 README § 1 table | SOURCED |
| 27 | Card-based UI refreshing every 3 s | FW-V1 / FW-V2.1 `setInterval(fetchStatus, 3000)`; V1 README § 3 | SOURCED |
| 28 | Custom names, daily NTP schedule, countdown auto-off timer | FW-V1 / FW-V2.1 header comments; V2.1 README § Firmware Features | SOURCED |
| 29 | Per-relay stats (trigger count, total ON time, last ON/OFF) and 10-entry event log in NVS | FW-V1 header + `MAX_LOG_ENTRIES = 10`; V2.1 README § Firmware Features | SOURCED |
| 30 | Master All-ON / All-OFF / Restart; KPI row (relays ON, IP, RSSI, uptime) | V2.1 README § Firmware Features; FW headers | SOURCED |
| 31 | Wi-Fi credentials via serial monitor saved to NVS | V2.1 README § WiFi Setup; FW headers | SOURCED |
| 32 | Static IP default with DHCP fallback | FW-V1 / FW-V2.1 `useStaticIP = true` and fallback message at line 320–322 | SOURCED |
| 33 | NTP sync | FW `configTime(... "pool.ntp.org")` | SOURCED |
| 34 | Mains enters through a screw terminal | V1 README § 4 J_AC "2-pin screw terminal" | SOURCED |
| 35 | V1 switch inputs GPIO 36, 39, 34, 35; input-only, no internal pull-up; R27–R30 10 kΩ pull-ups | V1 README § 4 J_SW; FW-V1 lines 3–6, 60 | SOURCED |
| 36 | V2.1 switch inputs GPIO 33, 32, 35, 34, 14, 15; external pull-ups on 34/35, internal on the rest | V2.1 README § Physical Wall Switch Pins; FW-V2.1 line 62, 953–961 | SOURCED |
| 37 | V2.1 firmware: each debounced switch change toggles relay so switch and dashboard share control | FW-V2.1 home_automation_v2_with_switches.ino "BEHAVIOR" comment | SOURCED |
| 38 | BOOT (GPIO0) and RESET (EN) buttons | V1 README § 4 Tactile Buttons; V2.2 README § Boot / Reset; V2.1 README § Buttons | SOURCED |
| 39 | 4-pin UART TTL header (RX, TX, GND, 3V3) on all revisions | V1 README J_TTL; V2.1 README Exposed Headers; V2.2 README Programming Header; BOM TTL1 | SOURCED |
| 40 | I²C header on IO21/IO22 on all revisions | V1 README J_I2C; V2.1 README Exposed Headers; V2.2 README I²C Header | SOURCED |
| 41 | V1 spare GPIO header IO25–IO27 | V1 README § Spare GPIO Header | SOURCED |
| 42 | V2.1 6-pin SPI header IO27, IO18, IO19, IO23, GND, 3V3 | V2.1 README Exposed Headers; V2.1 BOM H1 "SPI" | SOURCED |
| 43 | Relay outputs: V1 NO1–NO4; V2.1 NC and NO; V2.2 NO1–NO6 | V1 README J_RELAY; V2.1 README Relay Output Terminals; V2.2 README Top Edge Connectors | SOURCED |
| 44 | V2.1 has DC-005 barrel jack labelled 5V | V2.1 BOM row 2 (designator "5V") | SOURCED |
| 45 | Firmware: V1 one sketch, V2.1 two sketches (dashboard-only + with switches), V2.2 none | Folder listing; V2.1 README § Firmware; V2.2 README directory "Code/ (place here)" | SOURCED |
| 46 | Firmware uses only built-in Arduino ESP32 core libraries (WiFi, WebServer, Preferences, time) | V2.1 README § Required Libraries; V1 README § 7; FW includes | SOURCED |
| 47 | Fabrication package per board: schematic PDF, editable EasyEDA Pro project (.epro2), Gerbers, BOM + Pricing.xlsx, pick-and-place, STEP | Folder listing of each board | SOURCED |
| 48 | EDA: EasyEDA Pro | V2.2 README § Manufacturing; .epro2 files in all three | SOURCED |
| 49 | V1 and V2.2 include ESP32_Relay_Pinout.pdf; V2.1 includes a pinout .docx | Folder listing | SOURCED |
| 50 | V2.2 docs point to pinout PDF for GPIO mapping | V2.2 README § ESP32 GPIO Assignment | SOURCED |
| 51 | V2.1 relay 5 on GPIO12 strapping pin; may interfere with boot; swap if unstable | V2.1 README § Pinout note; FW-V2.1 header WARNING | SOURCED |
| 52 | Not CE/UL certified, prototyping use; MOV not a replacement for earthing/SPDs | V1 README § 10 | SOURCED |
| 53 | Status "prototype" | No README says complete/tested; V1 README § 10 "for prototyping/hobbyist use" | SOURCED |
| 54 | Role includes firmware | .ino files in V1 and V2.1 folders | SOURCED |
| 55 | Links omitted | manifest project-level github is null (board V1 has its own repo: https://github.com/smsaad-181/4-Channel-Relay-TH-V1.0-Home-Assistant) | SOURCED |

### Simon Memory Game PCB with ESP32  `simon-memory-game`

Abbreviations: V1.0 = `Simon Memory Game/Simon Memory Game V.1.0/`, V1.2 = `Simon Memory Game/Simon Memory Game V1.2/`. BOM = `<board>/BOM File/BOM_Board1_PCB1_2026-07-18.xlsx`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Two revisions, V1.0 and V1.2 | Folder names; README H1 of each | SOURCED |
| 2 | Game concept: LED + tone sequence, player repeats, each round adds a step, wrong press resets | V1.0 README § Overview, § How to Play; V1.2 README § Overview | SOURCED |
| 3 | Game-controller-shaped PCB | V1.0 README § Overview; V1.2 README § Overview | SOURCED |
| 4 | 2-layer PCB | V1.0 README § Manufacturing; V1.2 README feature table "2-layer PCB" | SOURCED |
| 5 | ESP32 handles game logic, display output and audio | V1.2 README § Overview | SOURCED |
| 6 | ESP32 has Wi-Fi and Bluetooth | V1.0 README § Features; V1.2 README table | SOURCED |
| 7 | V1.0 MCU ESP32-WROOM-32E-N8, U4 | V1.0 BOM row 21 | SOURCED |
| 8 | V1.2 MCU Ai-Thinker ESP32-S, U9 | V1.2 BOM row 18 | SOURCED |
| 9 | CH340C USB-to-UART, U3 (V1.0), U8 (V1.2) | V1.0 BOM row 20; V1.2 BOM row 17 | SOURCED |
| 10 | AMS1117 LDO, U2 (V1.0), U10 (V1.2), 3.3 V rail | V1.2 BOM row 19 (AMS1117-3.3V); V1.0 README BOM table (AMS1117-3.3); V1.0 BOM row 19 lists "AMS1117_1.2V" | SOURCED (V1.0 BOM/README conflict on voltage; Saad to confirm) |
| 11 | 0.96-inch I²C OLED module, OLED1, score/status | Both BOMs (0.96OLED_4P_MODULE_JX); V1.0 README § Features; V1.2 README table | SOURCED |
| 12 | Omron B3F-4055 12 mm keys KEY1–KEY4 | Both BOMs (B3F-4055, KEY-TH_4P-L12.0-W12.0) | SOURCED |
| 13 | Four 5 mm through-hole LEDs LED1–LED4 | Both BOMs (LED_TH-R_5mm) | SOURCED |
| 14 | QMB-09B-03 2.7 kHz buzzer, BUZZER1, audio feedback | Both BOMs; V1.0 README § Features | SOURCED |
| 15 | S9013 and BC847 transistors: Q1–Q3 (V1.0: S9013 + BC847B), Q1/Q7/Q8 (V1.2: S9013 + BC847) | Both BOMs | SOURCED |
| 16 | USB1 Mini-B on V1.0, USB-C 16-pin on V1.2 | V1.0 BOM row 22 (USB_MINI-B); V1.2 BOM row 20 (USB_TYPE-C-16P). V1.0 README says USB-C; BOM used | SOURCED (README conflict flagged) |
| 17 | USB used for power and programming | V1.0 README § Manufacturing step 5; V1.2 README § Power Connector | SOURCED |
| 18 | CN1 ZX-XH2.54-2PZZ is the battery connector | BOM lists CN1 2-pin XH; READMEs mention a 2-pin battery connector | INFERRED |
| 19 | Passives R1–R16, C1–C5 | Both BOMs | SOURCED |
| 20 | OLED I²C on IO21 (SDA) / IO22 (SCL) in V1.0 | V1.0 README § Pinout | SOURCED |
| 21 | V1.0 LEDs on IO25, IO23, IO15, IO16 via R6–R9 | V1.0 README § Pinout | SOURCED |
| 22 | V1.0 keys on IO34, IO35, IO36, IO39 | V1.0 README § Pinout | SOURCED |
| 23 | Buzzer on bottom side, GPIO PWM | V1.0 README § Pinout | SOURCED |
| 24 | V1.0 8-pin header with UART, inputs and 3V3 | V1.0 README § Left-Side Header | SOURCED |
| 25 | V1.2 4-pin 3V3/GND/RX/TX header for USB-to-TTL adapter at 3.3 V | V1.2 README § Debug / Programming Header | SOURCED |
| 26 | V1.0 EN and BOOT buttons; flash mode hold BOOT then press EN; separate Reset key | V1.0 README § Features, § Manufacturing; V1.0 BOM rows 1 and 9 | SOURCED |
| 27 | V1.0 BOOT/EN SMD 6×6; V1.2 SW1/SW2 through-hole 6×6 | V1.0 BOM row 1; V1.2 BOM row 15 | SOURCED |
| 28 | V1.0 keys KEY1–KEY4 + Reset; V1.2 KEY1–KEY5 | Both BOMs | SOURCED |
| 29 | Headers: V1.0 H1/H2/H3/H5 4-pin; V1.2 H3 4-pin | Both BOMs | SOURCED |
| 30 | 100 nF: V1.0 one (C3), V1.2 five (C1–C5) | Both BOMs | SOURCED |
| 31 | Bulk caps: V1.0 4.7 µF + 10 µF 0603; V1.2 three 10 µF Nichicon SMD | V1.0 BOM rows 3–4; V1.2 BOM row 16 (designators U1–U3) | SOURCED |
| 32 | Fabrication package per board: schematic PDF, editable EasyEDA project, Gerbers, BOM, pick-and-place, STEP | Folder listing of each board | SOURCED |
| 33 | Recommended fab: 2 layers, 1.6 mm, HASL-LF or ENIG, 0.2/0.2 mm | V1.0 README § Manufacturing | SOURCED |
| 34 | Firmware not in either folder; V1.0 lists code as coming soon | Folder listing (no Code files); V1.0 README § File Structure | SOURCED |
| 35 | EDA: EasyEDA | V1.0 README § Overview; .epro / .epro2 files | SOURCED |
| 36 | Status "prototype" | No README says complete/tested | SOURCED |
| 37 | Role "Schematic & PCB layout" (no firmware) | No .ino/.c/.cpp in folder | SOURCED |
| 38 | Links omitted | manifest project-level github null (V1.2 board repo: https://github.com/smsaad-181/Simon-Memory-game-V1.2) | SOURCED |

Deliberately left out: V1.2 README claims "on-board LiPo charge management (U2, U10)", but the V1.2 BOM has no charger IC (U2 is a 10 µF capacitor, U10 is the AMS1117-3.3V). LED drive topology also left out because the two READMEs disagree.

### IoT Activity Tracker with ESP32-S3 & BNO085  `iot-activity-tracker`

Abbreviations: P = `IoT Activity Tracker-Accelerometer-Gyroscope V1.0/`. README = `P/README.md`. BOM = `P/BOM File/BOM_Board1_PCB1_2026-07-18.xlsx`. FW = `P/Code/main.ino/main.ino.ino`. WEB = `P/Code/main.ino/webpage.h`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Compact, self-contained wearable activity tracker on one custom PCB | README § Overview | SOURCED |
| 2 | Tracks steps, cadence, distance, calories, active time, orientation in real time | README § Overview | SOURCED |
| 3 | Data shown on 0.96-inch OLED and streamed to Wi-Fi dashboard on same network | README § Overview | SOURCED |
| 4 | Onboard battery connector, USB-C charging, one-button interface, no external modules | README § Overview | SOURCED |
| 5 | MCU ESP32-S3-WROOM-1-N8, U4 | BOM row 30 (README says U1; BOM designator used) | SOURCED |
| 6 | IMU CEVA BNO085, U7, 9-DOF | BOM row 33 (manufacturer CEVA); README § Overview "9-DOF IMU" (README says U4) | SOURCED |
| 7 | BNO085 provides rotation vector, linear accel, gyro, step counter | README § Features; FW lines 811–814 | SOURCED |
| 8 | OLED module DM-OLED096-636, U1, SSD1306 128×64, I²C | BOM row 27; README § Hardware Overview (SSD1306 128×64 I2C) | SOURCED |
| 9 | BQ24092DGQR, U3, LiPo/Li-ion charge management | BOM row 29 (part); README § Power "On-board Charger ... LiPo charge management IC" (role) | SOURCED |
| 10 | BQ24092 is single-cell | Part family knowledge; not stated in files | INFERRED |
| 11 | TPS63020DSJT, U2, buck-boost converter generating the 3.3 V rail | BOM row 28 lists the part; README says "3.3 V LDO" (U6) but BOM has no LDO; buck-boost function is part knowledge | INFERRED |
| 12 | XFL4020-152MEC 1.5 µH inductor L1 is the buck-boost inductor | BOM row 10 (part, value); role inferred | INFERRED |
| 13 | CP2104-F03-GMR, U5, USB-to-UART for flashing over USB-C | BOM row 31 (part); README § Power "USB-C power input and firmware flashing"; bridge role inferred | INFERRED |
| 14 | 0603L100SLYR, U6, resettable PTC fuse | BOM row 32 (part); function is part knowledge | INFERRED |
| 15 | USB-C receptacle TYPE-C-31-M-12, USBC1, power + programming | BOM row 34; README § Hardware Overview USBC1 | SOURCED |
| 16 | SK12D07VG3 slide switch SW1, main power on/off | BOM row 25; README § Hardware Overview SW1 | SOURCED |
| 17 | 6×6 tactile switch SW2, user interface | BOM row 26; README § Hardware Overview SW2 | SOURCED |
| 18 | CN1 HX-XH2.54-2PZZ is the battery connector | BOM row 9 (2-pin XH); README mentions JST battery connector on bottom | INFERRED |
| 19 | LED1, LED2 0603 red, charge and power indicators | BOM row 11; README § Hardware Overview | SOURCED |
| 20 | Passives R1–R26, C1–C32 | BOM | SOURCED |
| 21 | Step counting via BNO085 built-in pedometer | README § Features; FW `enableStepCounter` | SOURCED |
| 22 | Activity classification STILL/MOVE/WALK/RUN with cadence hysteresis + linAccel/gyro thresholds for MOVE | README § Features; FW `evaluateMode()` (RUN at ≥140 spm, back to WALK below 125; MOVE at ≥0.05 g or ≥18 °/s) | SOURCED |
| 23 | EMA-smoothed cadence (spm) | README § Features; FW `cadenceEmaSpm` | SOURCED |
| 24 | Distance per step length 0.72 m walk, 0.90 m run | README § Features; FW `WALK_STEP_LEN_M`, `RUN_STEP_LEN_M` | SOURCED |
| 25 | Calorie estimate from total steps | README § Features; FW line 633 `totalSteps * 0.04f` | SOURCED |
| 26 | Active time (non-STILL) and peak linear acceleration in g | README § Features; FW `activeTimeMs`, `peakLinMagG` | SOURCED |
| 27 | Roll/pitch/yaw from rotation vector; gyro magnitude °/s; accuracy 0–3 | README § Orientation & Sensing | SOURCED |
| 28 | OLED 4 pages, 120 ms refresh | README § Display; FW `totalPages = 4`, `displayIntervalMs = 120` | SOURCED |
| 29 | Short press next page; ≥1.2 s long press resets stats; 40 ms debounce | README § Button Controls / Pinout; FW `LONG_PRESS_MS 1200`, `debounceDelayMs 40` | SOURCED |
| 30 | Dashboard served by ESP32, live charts, polls JSON endpoint every 800 ms | README § Display "auto-refresh every 800 ms"; WEB line 631 `setInterval(loadData, 800)`, chart canvases; FW `server.on("/data")` | SOURCED |
| 31 | USB-C for power and flashing; onboard charging | README § Power | SOURCED |
| 32 | I²C on GPIO 8 (SDA) / GPIO 9 (SCL) at 400 kHz | README § Pinout; FW `SDA_PIN 8`, `SCL_PIN 9`, `Wire.setClock(400000)` | SOURCED |
| 33 | BNO085 at 0x4B, OLED at 0x3C | README § I2C Device Addresses; FW defines | SOURCED |
| 34 | Report rates: rotation vector 100 ms, linear accel 50 ms, gyro 50 ms, step counter 100 ms | FW lines 37–40, 811–814 | SOURCED |
| 35 | Button on GPIO 39, active low, external pull-up R21 to 3.3 V; R21 is 10 kΩ | README § Button; FW `BUTTON_PIN 39`; BOM row 16 (R21 10 kΩ) | SOURCED |
| 36 | OLED 4-pin top-edge header GND/3V3/SCL/SDA | README § OLED Header | SOURCED |
| 37 | Firmware upload from Arduino IDE | README § Author "Firmware developed in Arduino IDE" | SOURCED |
| 38 | Design package: schematic PDF, editable EasyEDA Pro project, Gerbers, BOM, pick-and-place, STEP | Folder listing | SOURCED |
| 39 | Firmware uses SparkFun BNO080 and Adafruit SSD1306/GFX libraries, Wi-Fi station mode, serves page + JSON endpoint | FW includes, `WiFi.mode(WIFI_STA)`, `server.on("/")`, `server.on("/data")` | SOURCED |
| 40 | Calorie/distance are estimates from fixed constants; no test results documented | FW constants; no results in README | SOURCED |
| 41 | EDA EasyEDA Pro | README § Author | SOURCED |
| 42 | Status "prototype" | README does not say complete/tested | SOURCED |
| 43 | Role includes firmware | .ino + .h in P/Code | SOURCED |
| 44 | GitHub link | manifest `github` | SOURCED |

Discrepancies noted: README designators (U1 ESP32-S3, U2 SSD1306, U4 BNO085, U5 charge IC, U6 LDO) do not match the BOM; BOM designators used. README's "3.3 V LDO" not in BOM (BOM has TPS63020 buck-boost; U6 is a PTC fuse).

### Fingerprint Sensor Board V1.2  `fingerprint-v1-2`
No README or documentation exists for this project. Every claim comes from the BOM (Fingerprint V1.2/BOM/BOM_Board1_PCB1_2026-07-27.xlsx), the PCB images (Fingerprint V1.2/Image/...) or the folder listing.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title "Fingerprint Sensor Board V1.2" | Editable project file "ProPrj_Fingerprint Sensor V1.2_2026-07-27.epro2"; folder "Fingerprint V1.2" | SOURCED |
| 2 | Follow-up revision of V1.1 | Folder naming V1.1 to V1.2; identical BOM | INFERRED |
| 3 | Same parts list as V1.1 | BOM rows 1–19 identical to Fingerprint V1.1 BOM except row 13 (5 vs 4 screw holes). | SOURCED |
| 4 | Carrier PCB for Ai-Thinker ESP32-S, 2.4 GHz | BOM row 17 | SOURCED |
| 5 | Connectors for fingerprint sensor, RFID reader, display | Image/2D/Top Side silkscreen "Fingerprint", "RFID", "DISPLAY" | SOURCED |
| 6 | L-shaped board | Image/2D/Top Side and Bottom Side outline | SOURCED |
| 7 | U8 CH340C USB-to-UART bridge for programming | BOM row 16 (part only) | INFERRED (function) |
| 8 | U10 AMS1117-3.3V 3.3 V regulator | BOM row 18; silkscreen "AMS-1117 3V3" | SOURCED |
| 9 | USB1 USB Type-C 16-pin | BOM row 19 | SOURCED |
| 10 | D5 USBLC6-2SC6 ESD protection on USB | BOM row 6 (part only) | INFERRED (function) |
| 11 | Q7, Q8 BC847 auto-reset / boot control | BOM row 9 (part only); placement next to CH340C | INFERRED (function) |
| 12 | "5V" DC-005-2.5A-2.0 jack, 5 V input | BOM row 1; silkscreen "5V DC" | SOURCED |
| 13 | CN1 4-pin = fingerprint header (3V3, GND, TX, RX) | BOM row 4; bottom silkscreen labels RX/TX/GND/3v3 on the 4-pin header | INFERRED (designator mapping) |
| 14 | CN2, CN3 8-pin = RFID and display headers | BOM row 5; silkscreen "RFID", "DISPLAY" | INFERRED (designator mapping) |
| 15 | KEY1 OMRON B3F-4055 12 mm push button | BOM row 7; silkscreen "PUSH BUTTON" | SOURCED |
| 16 | SW1/SW2 6 × 6 mm BOOT and RST | BOM row 14; silkscreen "SW1 BOOT", "SW2 RST" | SOURCED |
| 17 | LED8 5 mm LED, status indicator | BOM row 8; silkscreen "GREEN" (BOM says R; colour omitted on page) | INFERRED (role) |
| 18 | TP1, TP2 test points | BOM row 15 | SOURCED |
| 19 | Passives list | BOM rows 2, 3, 10–12 | SOURCED |
| 20 | Passive roles (pull-ups, CC resistors, base resistors, LED resistor, decoupling) | BOM values; placement in Image/2D | INFERRED |
| 21 | Header pin names (fingerprint, RFID, display) on bottom silkscreen | Image/2D/Bottom Side/2D_PCB1_2026-07-27 (1).png | SOURCED |
| 22 | "UART" for fingerprint header | TX/RX labels | INFERRED |
| 23 | Five M3 mounting holes, one more than V1.1 | BOM row 13 (SCREW1–SCREW5) vs V1.1 BOM row 13 (SCREW1–SCREW4) | SOURCED |
| 24 | Mixed SMD and through-hole | BOM footprints | SOURCED |
| 25 | Status prototype | No documentation; default per brief | SOURCED |
| 26 | Role schematic & PCB layout, no firmware | No .ino/.c/.cpp in folder | SOURCED |
| 27 | EasyEDA Pro project / tag "easyeda" | Schamatic/Editable File/*.epro2 | INFERRED |
| 28 | Files: schematic PDF, EasyEDA Pro project, Gerbers, BOM + priced copy, pick-and-place, STEP, PCB renders | Folder listing incl. 3D Step File/3D_PCB1_2026-07-27.step | SOURCED |
| 29 | Caption "3D render of the assembled board" | Image/3D/3D_PCB1_2026-07-27.png | SOURCED |
| 30 | Firmware not in folder | Folder listing | SOURCED |

### Fingerprint Sensor Board V1.1  `fingerprint-v1-1`
No README or documentation exists for this project. Every claim comes from the BOM (Fingerprint V1.1/BOM/BOM_Board1_PCB1_2026-07-27.xlsx), the PCB images (Fingerprint V1.1/Image/...) or the folder listing.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Title "Fingerprint Sensor Board V1.1" | Folder name "Fingerprint V1.1"; editable project file named "Figure print Sensor V1.0" | INFERRED (title wording) |
| 2 | Carrier PCB for an Ai-Thinker ESP32-S module | BOM row 17 (U9 ESP32-S, Ai-Thinker, WIRELM-SMD_ESP32-S) | SOURCED |
| 3 | Module is 2.4 GHz | BOM row 17 value "2.4GHz" | SOURCED |
| 4 | Connectors for a fingerprint sensor, an RFID reader and a display | Image/2D/Top Side silkscreen: "Fingerprint", "RFID", "DISPLAY" | SOURCED |
| 5 | USB-C programming built in | BOM row 19 USB1 USB_TYPE-C-16P + row 16 CH340C; silkscreen BOOT/RST | INFERRED |
| 6 | 5 V supply via DC jack | BOM row 1 (designator "5V", DC-005-2.5A-2.0); silkscreen "5V DC" | SOURCED |
| 7 | U8 CH340C is a USB-to-UART bridge for programming | BOM row 16 (part only) | INFERRED (function) |
| 8 | U10 AMS1117-3.3V, 3.3 V regulator | BOM row 18; silkscreen "AMS-1117 3V3" | SOURCED |
| 9 | USB1 USB Type-C 16-pin | BOM row 19 | SOURCED |
| 10 | D5 USBLC6-2SC6 ESD protection on USB lines | BOM row 6 (part only); placed beside USB1 in image | INFERRED (function) |
| 11 | Q7, Q8 BC847 for auto-reset / boot control | BOM row 9 (part only); placed beside CH340C with R23/R24 in image | INFERRED (function) |
| 12 | CN1 4-pin = fingerprint header, pins 3V3, GND, TX, RX | BOM row 4 (only 4-pin connector); silkscreen "Fingerprint" with 3v3/GND/TX/RX | INFERRED (designator mapping) |
| 13 | CN2, CN3 8-pin = RFID and display headers | BOM row 5; silkscreen "RFID", "DISPLAY" on 8-pin connectors | INFERRED (designator mapping) |
| 14 | KEY1 OMRON B3F-4055 12 mm push button | BOM row 7 (footprint KEY-TH_4P-L12.0-W12.0); silkscreen "PUSH BUTTON" | SOURCED |
| 15 | SW1, SW2 6 × 6 mm = BOOT and RST | BOM row 14; silkscreen "SW1 BOOT", "SW2 RST" | SOURCED |
| 16 | LED8 5 mm LED, status indicator | BOM row 8 ("LED_TH-R_5mm"); silkscreen "GREEN" / "LED". Colour conflict (BOM R vs silkscreen GREEN) so page says only "5 mm LED"; "status" role inferred | INFERRED (role) |
| 17 | TP1, TP2 test points | BOM row 15 | SOURCED |
| 18 | Passives R1, R20–R26, C1, C2, C12, C14–C17, C19 | BOM rows 2, 3, 10–12 | SOURCED |
| 19 | Passive roles: pull-ups, USB-C CC resistors (R21/R22 5.1k), base resistors (R23/R24 5.1k), LED resistor (R26 220), decoupling | BOM values; positions in Image/2D/Top Side | INFERRED |
| 20 | Spec: MCU Ai-Thinker ESP32-S, 2.4 GHz | BOM row 17 | SOURCED |
| 21 | Spec: USB Type-C with CH340C bridge | BOM rows 16, 19 | INFERRED (bridge function) |
| 22 | Spec: 5 V DC jack, AMS1117-3.3V | BOM rows 1, 18 | SOURCED |
| 23 | Spec: 4-pin fingerprint UART header, 8-pin RFID and display headers | BOM rows 4–5; silkscreen | INFERRED ("UART" from TX/RX labels) |
| 24 | Spec: mixed SMD and through-hole, 4 × M3 holes | BOM footprints (SOP-16, SOT-23, SOT-223, R_AXIAL, CAP-TH); BOM row 13 | SOURCED |
| 25 | Silkscreen header labels (fingerprint 3V3/GND/TX/RX; RFID SDA/SCK/MOSI/MISO/GND/RST/3V3; display LED/SCK/SDA/A0/RST/CS/GND/3V3) | Image/2D/Top Side/2D_PCB1_2026-07-27.png | SOURCED |
| 26 | Status prototype | No documentation; default per brief | SOURCED |
| 27 | Role: schematic & PCB layout (no firmware) | No .ino/.c/.cpp in folder | SOURCED |
| 28 | Tag "easyeda" / EasyEDA Pro project | Schamatic/Editable File/*.epro2 (EasyEDA Pro format); 3D render shows "LCEDA EasyEDA" logo | INFERRED |
| 29 | Files: schematic PDF, EasyEDA Pro project, Gerbers, BOM + priced copy, pick-and-place, PCB renders; no STEP | Folder listing: Schamatic/, Garber File/, BOM/, BOM/Pricing/Pricing.xlsx, Pick & Place File/, Image/ | SOURCED |
| 30 | Firmware not in folder | Folder listing | SOURCED |
| 31 | V1.2 uses the same parts list with a fifth mounting hole on a reshaped board | Fingerprint V1.2 BOM rows 1–19 identical except row 13 (SCREW1–5); V1.2 Image/2D shows L-shaped outline | SOURCED |

### IoT Battery State-of-Charge Monitor with ESP32  `battery-soc-monitor`

Abbreviations: R = `IoT-based-Battery-SoC-Monitoring-System-with-ESP32-main/`. README = `R/README.md`. P = `R/IoT based Battery SoC (%) Monitoring System with ESP32/`. BOM = `P/BOM/Bom/BOM_Board1_PCB1_2026-02-22.xlsx`. FW = `P/Code/SoC/SoC.ino`.

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Compact, low-power IoT battery monitoring node built on ESP32 | README § Overview | SOURCED |
| 2 | Measures Li-ion terminal voltage, derives SoC, uploads both to ThingSpeak over Wi-Fi | README § Overview | SOURCED |
| 3 | Deep sleep between measurements; suited to battery-powered field deployments | README § Overview | SOURCED |
| 4 | Custom PCB with USB-C input, onboard regulation, decoupling, status LED, I²C/GPIO headers, UART programming header | README § Overview | SOURCED |
| 5 | MCU ESP32-WROOM-32-N4, U4 | BOM row 24 | SOURCED |
| 6 | 100 kΩ / 100 kΩ divider is R19, R20 | README § Features (100k/100k divider); BOM row 20 (R19, R20 100 kΩ, the only 100 kΩ pair); designator match inferred | INFERRED |
| 7 | BQ24092DGQR, U3, single-cell Li-ion charger | BOM row 23 (part); README does not mention a charger; role is part knowledge | INFERRED |
| 8 | TPS63020DSJT, U2, buck-boost for 3.3 V rail | BOM row 22 (part); README says "3.3 V LDO" but BOM has no LDO; buck-boost function is part knowledge | INFERRED |
| 9 | XFL4020-152MEC 1.5 µH, L1, buck-boost inductor | BOM row 8 (part, value); role inferred | INFERRED |
| 10 | 0603L100SLYR, U5, resettable PTC fuse | BOM row 25 (part); function is part knowledge | INFERRED |
| 11 | USB-C 6-pin TYPE-C 6P(073), USB1, power input | BOM row 26; README § Features "Power Input USB-C" | SOURCED |
| 12 | 6-pin header H1 PZ254V-11-06P is the UART programming header GND/RTS/3V3/RXD/TXD/DTR | BOM row 7 (only 6-pin header); README § UART / Programming Header (pinout) | INFERRED (designator match) |
| 13 | BC847 Q3, Q4 provide RTS/DTR auto-reset | BOM row 10 (parts); README header lists RTS/DTR "auto-reset"; transistor role inferred | INFERRED |
| 14 | 4-pin XH connectors CN1, CN3, CN4, CN6, CN7 are I²C and GPIO expansion | BOM row 5; README § Pinout (I²C header, GPIO expansion headers) | INFERRED |
| 15 | 2-pin XH CN2 is the battery input | BOM row 6; README § Battery Input lists a 2-pin input (calls it a screw terminal; BOM shows XH) | INFERRED |
| 16 | Green LED1 status indicator | BOM row 9 (LED_0603-G); README § Features "Status Indicator LED1" | SOURCED |
| 17 | Passives R6–R20, C5–C18 | BOM | SOURCED |
| 18 | Battery voltage on IO34 (ADC1_CH6) via 100k/100k divider halving the voltage | README § Features, § Circuit Description; FW `SENSE_PIN 34`, `R_TOP`, `R_BOTTOM` | SOURCED |
| 19 | 32× oversampling, eFuse-calibrated analogReadMilliVolts(), optional piecewise calibration and global offset | README § Features "ADC Accuracy"; FW `NUM_SAMPLES 32`, `CAL_X_MV`, `OFFSET_V` | SOURCED |
| 20 | SoC via piecewise-linear interpolation of a 21-point Li-ion OCV curve | README § Features; FW `OCV[]` (21 entries) | SOURCED |
| 21 | SoC clamped to 1–100 % before upload | README § Technical Notes; FW `readBattery()` | SOURCED |
| 22 | ThingSpeak HTTP; field1 = V_bat (V), field2 = SoC (%) | README § Cloud Integration; FW `postToThingSpeak()` | SOURCED |
| 23 | Deep sleep with 30 s timer wake-up, configurable | README § Features; FW `SLEEP_SECONDS = 30` | SOURCED |
| 24 | ThingSpeak 15 s minimum interval; 30 s cycle within limit | README § Cloud Integration; FW header notes | SOURCED |
| 25 | Wi-Fi up to 5 retries, 1 s gaps; on failure skips upload and sleeps, no hang | README § Technical Notes; FW `WIFI_MAX_RETRIES 5`, `WIFI_RETRY_DELAY_MS 1000` | SOURCED |
| 26 | Wi-Fi and Bluetooth shut down before sleep | FW `shutdownWiFi()` (WiFi.mode(WIFI_OFF), btStop()) | SOURCED |
| 27 | UART header with RTS/DTR auto-reset; I²C header SDA/SCL/3V3/GND; GPIO breakouts IO34, IO35, IO27, IO26, IO25, IO18, IO5, IO14, IO13, IO2 | README § Pinout | SOURCED |
| 28 | ADC 11 dB attenuation reads up to ~3.9 V; 4.2 V cell gives 2.1 V at pin | README § Voltage Divider; FW `analogSetAttenuation(ADC_11db)` | SOURCED |
| 29 | IO34 is input-only, ADC1 channel 6 | README § GPIO Expansion Headers | SOURCED |
| 30 | Measurement taken before Wi-Fi starts to keep awake time short | FW `setup()` comment step 1 | SOURCED |
| 31 | Wake cycle: ADC sample, OCV to SoC, ThingSpeak post, Wi-Fi off, sleep | README § Wake Cycle; FW `setup()` | SOURCED |
| 32 | 2-layer, ENIG finish, EasyEDA | README § Features "PCB" | SOURCED |
| 33 | Repo contents: schematic PDF, editable EasyEDA project, Gerbers, BOM, pick-and-place, STEP, documentation PDF, SoC.ino | README § Repository Structure; folder listing | SOURCED |
| 34 | OCV table is typical single cell at ~25 °C | FW comment on `OCV[]` | SOURCED |
| 35 | ADC calibration table ships as identity mapping | FW `CAL_X_MV` / `CAL_Y_MV` comment "Identity mapping by default" | SOURCED |
| 36 | No measured accuracy or battery-life results documented | README has none (deep-sleep "~10–150 µA" in README § Technical Notes is a generic ESP32 figure, deliberately omitted) | SOURCED |
| 37 | Status "prototype" | README does not say complete/tested | SOURCED |
| 38 | Role includes firmware | SoC.ino present | SOURCED |
| 39 | GitHub link | manifest `github` | SOURCED |

Discrepancies noted: README describes a "3.3 V LDO" and no charger; the BOM has a TPS63020 buck-boost and a BQ24092 charger and no LDO. README calls the battery input a screw terminal; BOM shows a 2-pin XH connector. The editable project file is named "ESP32 Standalone Board", suggesting the board was derived from that design.

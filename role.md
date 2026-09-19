# ROLE

Act as a senior **Next.js engineer, frontend architect, UI/UX designer, clock application engineer, and mobile web-performance engineer**.

Build a polished **Digital + Analog Smart Clock web application** optimized primarily for an **iPhone 7 (4.7-inch) in LANDSCAPE orientation**.

The application should feel like a dedicated smart-clock device rather than a normal website.

The project must be production-quality, lightweight, smooth, visually beautiful, and optimized for an old iPhone 7.

---

# 1. PRIMARY TARGET DEVICE

The primary target is:

- Device: iPhone 7
- Screen: 4.7-inch
- Landscape orientation
- Resolution: 1334 × 750 physical pixels
- CSS viewport in landscape is approximately 667 × 375 CSS pixels depending on browser/UI state
- Safari / iOS WebKit
- Older mobile hardware
- Touch interaction
- Battery-conscious
- Low CPU/GPU usage
- Must remain smooth for long periods

Desktop and larger phones should still work, but **DO NOT design desktop-first**.

Design for the iPhone 7 landscape viewport first.

---

# 2. CORE PRODUCT IDEA

Create a full-screen smart-clock dashboard containing:

1. Large digital clock
2. Beautiful analog clock
3. Current date
4. Day of week
5. Weather information
6. Temperature
7. Humidity
8. Location
9. Sunrise / sunset
10. Battery status
11. Wi-Fi / connection status where browser APIs permit
12. Multiple timezone clocks
13. Stopwatch
14. Countdown timer
15. Alarm interface
16. Settings
17. Full-screen clock mode
18. Automatic dimming
19. Multiple visual clock themes
20. Digital/analog/both display modes

The default screen should immediately show the current time without requiring navigation.

---

# 3. DESIGN PHILOSOPHY

The interface should look like a premium dedicated smart clock.

Design characteristics:

- Minimal
- Elegant
- Modern
- Dark-first
- High contrast
- Extremely readable
- Large typography
- Subtle animations
- No unnecessary UI
- No clutter
- No giant navigation bars
- No desktop-style cards everywhere
- No excessive gradients
- No heavy effects
- No unnecessary shadows

Think:

- premium bedside clock
- modern smart display
- Apple-like simplicity
- professional digital clock
- futuristic but practical

The time must always be the visual priority.

---

# 4. MAIN LANDSCAPE LAYOUT

For the iPhone 7 landscape screen, create a carefully designed dashboard.

Approximate layout:

---

| DATE / DAY MAIN CLOCK WEATHER |
| |
| |
| 10:42:37 |
| Tuesday |
| |
| ANALOG CLOCK INFORMATION |
| |
| TIMEZONE BATTERY / TEMP / LOCATION |

---

However, do not blindly follow this ASCII layout.

Use responsive CSS Grid/Flexbox and dynamically adapt to the actual viewport.

The application must intelligently use the available 375px-ish landscape height.

Avoid vertical scrolling on the primary clock screen.

The main clock screen should fit completely inside the viewport.

---

# 5. DIGITAL CLOCK

The digital clock is the most important component.

Requirements:

- Large readable digits
- HH:mm:ss
- Optional seconds
- 12-hour and 24-hour modes
- AM/PM support
- Smooth updates
- No visible layout jumping
- Use tabular/monospaced numerals where appropriate
- Prevent digit width changes
- Support leading zeros

Example:

10:42:37

or:

22:42:37

Add a subtle smaller date below:

Tuesday, September 19

Do not animate every digit with expensive animations.

Use efficient CSS transitions only when appropriate.

---

# 6. ANALOG CLOCK

Create a beautiful analog clock component.

Requirements:

- Hour hand
- Minute hand
- Second hand
- Tick marks
- 12-hour markers
- Center pin
- Optional numerals
- Smooth second-hand movement
- Accurate positioning
- Responsive sizing

Prefer **CSS/SVG** instead of a heavy canvas library.

The analog clock must scale cleanly.

Allow:

- classic
- minimalist
- modern
- dark
- light

clock styles.

The analog clock must remain visually sharp on the iPhone Retina display.

---

# 7. CLOCK ACCURACY

Implement time handling properly.

Use:

- `Date`
- `Intl.DateTimeFormat`
- `Intl.DateTimeFormat().resolvedOptions().timeZone`

Do NOT create a timer that blindly assumes every `setInterval(1000)` fires exactly every second.

The UI should calculate the actual current time whenever it updates.

Handle:

- tab backgrounding
- Safari throttling
- device sleep/wake
- visibility changes
- returning to the application

When the page becomes visible again, immediately recalculate the current time.

Avoid cumulative timer drift.

---

# 8. DIGITAL / ANALOG DISPLAY MODES

Provide:

### Mode 1 — Digital

Large digital clock dominates the screen.

### Mode 2 — Analog

Large analog clock dominates the screen.

### Mode 3 — Hybrid

Analog clock + digital time + information panels.

Default to Hybrid.

Remember the user's selected mode using localStorage.

---

# 9. DATE INFORMATION

Show:

- Day of week
- Day
- Month
- Year

Example:

TUESDAY
19 SEPTEMBER 2026

Allow compact and expanded date styles.

Use locale-aware formatting.

---

# 10. WEATHER

Create a weather information module.

Show:

- Current temperature
- Weather condition
- Weather icon
- Feels like
- Humidity
- Wind speed
- Sunrise
- Sunset
- Location

Example:

28°C
Partly Cloudy
Feels 31°C
Humidity 72%

The weather system should be abstracted behind a service layer.

Create something similar to:

`lib/weather.ts`

Do not hard-code weather logic into UI components.

If no API key/provider is configured:

- show a graceful placeholder
- do not crash
- allow mock/demo weather data during development

Make the provider easy to replace.

---

# 11. LOCATION

Display the current configured location.

Example:

Siem Reap, Cambodia

Allow:

- automatic browser geolocation
- manually configured location
- saved location

Do not constantly request GPS.

Request location only when necessary.

Respect browser permission rules.

---

# 12. MULTIPLE TIMEZONES

Add a timezone panel.

Example:

PHNOM PENH
22:42

TOKYO
00:42

NEW YORK
11:42

LONDON
16:42

Allow the user to add/remove timezones.

Use IANA timezone names internally.

Examples:

`Asia/Phnom_Penh`

`Asia/Tokyo`

`America/New_York`

`Europe/London`

Timezones should update from the same efficient clock update mechanism.

Do not create a separate interval for every timezone.

---

# 13. ALARM

Implement a lightweight alarm system.

Features:

- Add alarm
- Enable/disable alarm
- Select time
- Repeat:
  - Once
  - Every day
  - Weekdays
  - Custom days

- Alarm label
- Delete alarm

Persist alarms in localStorage.

Important:

Because this is a browser application, do NOT pretend that alarms can reliably execute while Safari is completely suspended/backgrounded.

Design the system honestly around browser limitations.

When the app is active:

- monitor alarms
- trigger alarm UI
- optionally play sound after user interaction permissions are satisfied

Provide a clear UI explaining browser limitations if necessary.

---

# 14. STOPWATCH

Create a stopwatch.

Features:

- Start
- Pause
- Reset
- Lap
- Milliseconds display

Do not depend on interval counting for elapsed time.

Use timestamps:

`performance.now()`

or another appropriate monotonic timing mechanism.

This prevents timer drift.

---

# 15. COUNTDOWN TIMER

Create a countdown timer.

Features:

- preset durations
- custom duration
- Start
- Pause
- Resume
- Reset
- completion animation
- optional sound

Example presets:

1 min
5 min
10 min
15 min
30 min
60 min

Use timestamps rather than decrementing a counter once per second.

---

# 16. BATTERY INFORMATION

Where supported, use the browser Battery Status API.

Show:

- Battery percentage
- Charging state

Example:

🔋 82%

If unsupported:

Do not show an error.

Simply hide the battery detail or show:

Battery information unavailable

Do not repeatedly poll battery status.

---

# 17. CONNECTION STATUS

Display a tiny connection indicator.

Use:

`navigator.onLine`

Show:

ONLINE

or:

OFFLINE

Update using browser online/offline events.

Do not repeatedly poll the network.

---

# 18. FULL-SCREEN MODE

Create a fullscreen button.

Use the browser Fullscreen API when supported.

Handle unsupported Safari behavior gracefully.

The application should still work normally if fullscreen is unavailable.

Provide a visual hint for entering Safari's native fullscreen-like experience where appropriate.

---

# 19. SCREEN WAKE / ALWAYS-ON BEHAVIOR

Implement the best possible browser-based screen wake behavior.

Investigate/use the Screen Wake Lock API where supported:

`navigator.wakeLock`

Create a reusable hook:

`useWakeLock()`

Behavior:

- Request wake lock only after appropriate user interaction
- Release it when leaving clock mode if appropriate
- Re-acquire it after visibility changes
- Handle unsupported browsers gracefully

Do not continuously request wake locks.

IMPORTANT:

Do not claim that a website can guarantee the iPhone display will remain awake forever.

The implementation should work within iOS Safari/WebKit limitations.

---

# 20. AUTO DIMMING

Create an optional "Night Mode / Auto Dim" feature.

Example:

After 30 seconds of no touch:

- reduce UI brightness
- reduce secondary information
- keep the clock visible

When the user touches the screen:

- restore brightness

Allow settings:

OFF
30 seconds
1 minute
5 minutes
10 minutes

Do NOT use expensive continuous animations.

---

# 21. AMBIENT CLOCK MODE

Create a special minimal mode.

When activated:

Hide:

- settings
- weather details
- timezone controls
- unnecessary UI

Keep:

- huge time
- date
- minimal temperature
- battery

This should feel like a dedicated bedside clock.

---

# 22. THEMES

Create several built-in themes.

### Classic Dark

Black/dark background
White clock

### Midnight

Very dark blue/black
Soft blue-white text

### Minimal Light

White/off-white background
Black text

### OLED

Pure black background
Minimal bright elements

### Aurora

Subtle modern gradient background

### Retro

Vintage digital-clock appearance

Themes must be lightweight.

Avoid huge background images.

Avoid video backgrounds.

Avoid WebGL.

Avoid particle systems.

Avoid constantly animated gradients.

---

# 23. COLOR SYSTEM

Use CSS variables.

Example architecture:

```css
:root {
  --background: ...;
  --foreground: ...;
  --muted: ...;
  --accent: ...;
  --panel: ...;
  --border: ...;
}
```

Theme switching should modify variables rather than rerendering the entire application.

---

# 24. TYPOGRAPHY

Prioritize readability on a small Retina display.

Use a modern sans-serif system font stack.

Prefer:

```css
font-family:
  -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial,
  sans-serif;
```

For digital clock numerals, consider a suitable monospace/tabular font.

Do not load huge external font files unless absolutely necessary.

Performance is more important than decorative typography.

---

# 25. RESPONSIVE DESIGN

Primary breakpoint:

iPhone 7 landscape.

Support:

- 667 × 375 CSS viewport
- smaller landscape phones
- modern iPhones
- iPad
- desktop

But do NOT let desktop design dictate the mobile layout.

Create specific responsive rules.

For example:

```css
@media (orientation: landscape) {
  ...
}

@media (orientation: portrait) {
  ...
}
```

The main experience should encourage landscape mode.

If the device is portrait:

Show a lightweight message:

"Rotate your iPhone to landscape for the best clock experience."

But still allow the application to function.

---

# 26. SAFE AREA

Support:

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

Do not let content touch unsafe areas.

Use:

```css
padding: env(safe-area-inset-top) env(safe-area-inset-right)
  env(safe-area-inset-bottom) env(safe-area-inset-left);
```

where appropriate.

---

# 27. TOUCH UX

Design specifically for touch.

Minimum comfortable touch target:

approximately 44px where practical.

Avoid tiny buttons.

Avoid hover-dependent functionality.

Hover must NOT be required.

Use:

- tap
- long press where useful
- swipe only when intuitive

Do not create complicated gestures.

---

# 28. HIDDEN CONTROLS

The clock screen should remain clean.

Controls can appear when:

- user taps the screen
- user swipes
- user taps a small menu button

After inactivity, controls fade away.

Example:

Tap once:

show controls

Wait 5 seconds:

controls disappear

The clock remains visible.

---

# 29. SETTINGS PANEL

Create a settings interface containing:

### Clock

- 12/24 hour
- Show seconds
- Digital/Analog/Hybrid
- Show date

### Appearance

- Theme
- Clock style
- Accent
- Brightness/dimming

### Weather

- Location
- Temperature unit
- Weather provider

### Timezones

- Add timezone
- Remove timezone

### Behavior

- Wake lock
- Auto dim
- Hide controls
- Landscape preference

### Alarm

- Manage alarms

Persist all appropriate settings using localStorage.

---

# 30. DATA STORAGE

Use localStorage for:

- selected theme
- clock mode
- 12/24-hour preference
- seconds preference
- alarms
- timer presets
- timezone list
- location configuration
- weather preferences
- auto-dim settings

Create a small typed storage abstraction.

Example:

`lib/storage.ts`

Do not scatter raw `localStorage.getItem()` throughout components.

Handle malformed/corrupted localStorage gracefully.

---

# 31. NEXT.JS ARCHITECTURE

Use modern Next.js with TypeScript.

Suggested structure:

```text
app/
  layout.tsx
  page.tsx
  globals.css

components/
  clock/
    DigitalClock.tsx
    AnalogClock.tsx
    HybridClock.tsx
    ClockFace.tsx
  dashboard/
    ClockDashboard.tsx
    DateDisplay.tsx
    WeatherCard.tsx
    BatteryStatus.tsx
    ConnectionStatus.tsx
    TimezoneList.tsx
  timer/
    Stopwatch.tsx
    Countdown.tsx
  alarm/
    AlarmList.tsx
    AlarmEditor.tsx
  settings/
    SettingsPanel.tsx
    ClockSettings.tsx
    AppearanceSettings.tsx
    WeatherSettings.tsx
    TimezoneSettings.tsx
  ui/
    Button.tsx
    Modal.tsx
    Panel.tsx

hooks/
  useClock.ts
  useWakeLock.ts
  useBattery.ts
  useOnlineStatus.ts
  useLocalStorage.ts
  useIdle.ts

lib/
  time.ts
  weather.ts
  storage.ts
  alarms.ts
  constants.ts

types/
  clock.ts
  weather.ts
  alarm.ts
  settings.ts
```

You can modify this architecture if you have a better solution.

Keep the architecture clean.

---

# 32. CLOCK ENGINE

Create a central clock engine rather than multiple independent timers.

For example:

```text
ClockEngine
    ↓
current timestamp
    ↓
DigitalClock
AnalogClock
Timezone clocks
Date
Alarm checker
```

Avoid:

```text
DigitalClock → setInterval()
AnalogClock → setInterval()
Timezone1 → setInterval()
Timezone2 → setInterval()
Alarm → setInterval()
```

This is inefficient.

Prefer a centralized time source.

---

# 33. PERFORMANCE REQUIREMENTS

This is extremely important.

The application will potentially remain open for hours.

Optimize for:

- iPhone 7
- low CPU
- low memory
- low battery usage
- stable long-running sessions

Avoid:

- unnecessary React rerenders
- giant libraries
- heavy animation frameworks
- Three.js
- WebGL
- particle effects
- video backgrounds
- continuously animated gradients
- excessive DOM elements
- multiple timers
- excessive API requests

Use:

- React.memo where useful
- stable callbacks
- centralized clock updates
- CSS transforms
- CSS transitions
- SVG
- lightweight components

Do not optimize blindly. Profile and keep the implementation simple.

---

# 34. ANALOG CLOCK PERFORMANCE

For analog hands:

Prefer:

```css
transform: rotate(...);
```

rather than repeatedly changing expensive layout properties.

Use:

```css
transform-origin: center bottom;
```

for clock hands.

Avoid forcing layout.

The analog clock should animate smoothly while consuming minimal CPU.

---

# 35. PWA

Turn the application into a Progressive Web App.

Add:

- manifest
- icons
- standalone display
- theme color
- background color
- service worker/offline caching where appropriate

The application should be installable to the iPhone home screen if supported by the current iOS/Safari version.

The PWA should open directly into the clock experience.

Do not add unnecessary offline complexity.

---

# 36. OFFLINE-FIRST CLOCK

The clock itself must work without internet.

Internet should only be required for:

- weather
- remote configuration
- optional external services

The following must always work offline:

- digital clock
- analog clock
- date
- stopwatch
- countdown
- alarms while the page is active
- themes
- settings
- timezone calculations

---

# 37. ACCESSIBILITY

Support:

- semantic HTML
- aria labels
- keyboard navigation on desktop
- visible focus states
- sufficient contrast
- reduced motion

Respect:

```css
@media (prefers-reduced-motion: reduce);
```

When reduced motion is enabled:

- remove unnecessary transitions
- remove decorative animations

The large clock must remain readable.

---

# 38. ERROR HANDLING

The application must never crash because:

- weather API fails
- geolocation fails
- Battery API is unsupported
- Wake Lock API is unsupported
- Fullscreen API is unsupported
- localStorage is unavailable
- timezone data is invalid
- network is offline

Use graceful fallbacks.

---

# 39. WEATHER REFRESH

Do NOT request weather every second.

Use a sensible refresh interval such as:

30–60 minutes

Also allow manual refresh.

When offline:

keep the last successful weather result.

Show a small stale/offline indicator when appropriate.

---

# 40. MOBILE BROWSER BEHAVIOR

Carefully handle:

```text
visibilitychange
pageshow
pagehide
orientationchange
resize
online
offline
```

When Safari wakes the page:

- recalculate time
- update UI
- reacquire wake lock if appropriate
- check alarms
- refresh necessary state

Do not create memory leaks.

Clean up every event listener.

---

# 41. CLOCK PAGE UX

When opening the application:

DO NOT show:

- splash screen lasting several seconds
- login
- onboarding
- unnecessary loading screen

Instead:

1. Load immediately
2. Display current time immediately
3. Load weather asynchronously
4. Load secondary information afterward

The clock must feel instant.

---

# 42. SETTINGS ACCESS

Use a small unobtrusive button.

Example:

top-right:

⚙

When tapped:

open a bottom sheet or side panel suitable for landscape.

Do not navigate away from the clock page unnecessarily.

The user should be able to close settings and immediately return to the clock.

---

# 43. CLOCK SCREEN INFORMATION HIERARCHY

Priority:

### Level 1

TIME

### Level 2

DATE

### Level 3

WEATHER / TEMPERATURE

### Level 4

LOCATION / BATTERY / CONNECTION

### Level 5

TIMEZONES / EXTRA INFORMATION

Never allow secondary information to visually overpower the clock.

---

# 44. VISUAL DETAILS

Add subtle polish:

- smooth appearance/disappearance
- subtle glass panels where useful
- thin borders
- controlled shadows
- subtle blur only where it does not hurt performance
- clean spacing
- consistent corner radius
- carefully aligned numbers

Do NOT over-design it.

The result should look like a real commercial smart-clock interface.

---

# 45. STARTUP DEFAULT

On first launch:

- Hybrid clock
- Dark theme
- 24-hour format
- Seconds enabled
- Date enabled
- Weather enabled if available
- Current browser timezone
- Compact secondary information
- Auto-hide controls enabled
- Wake lock option available
- No alarm configured

If browser/device locale suggests otherwise, still prioritize explicit user settings over assumptions.

---

# 46. DEVELOPMENT QUALITY

Use strict TypeScript.

Avoid:

```ts
any;
```

unless absolutely necessary.

Use proper types.

No unnecessary dependencies.

Use modern React patterns.

Avoid huge component files.

Separate:

- UI
- state
- time calculation
- storage
- API logic

---

# 47. TESTING

Test at minimum:

### Clock

- seconds update
- minute rollover
- hour rollover
- midnight
- date rollover
- month rollover
- year rollover

### Analog

- hand positions
- 12:00
- 3:00
- 6:00
- 9:00
- second movement

### Timers

- start
- pause
- resume
- reset
- background/foreground recovery

### Alarm

- enable
- disable
- repeat
- midnight crossing

### Storage

- reload page
- corrupted storage
- missing storage values

### Mobile

- landscape
- portrait
- Safari
- standalone PWA

---

# 48. IMPORTANT IPHONE 7 TESTING

Create a development/testing mode that makes it easy to simulate:

```text
667 × 375
```

The main dashboard must fit without scrolling.

Check:

- no horizontal overflow
- no vertical overflow
- no clipped buttons
- no text wrapping unexpectedly
- no tiny controls
- no excessive padding
- clock remains dominant

Use browser DevTools mobile emulation during development.

---

# 49. PWA ICONS / BRANDING

Create a simple clock application identity.

Suggested app name:

"Smart Clock"

Short name:

"Clock"

Use a simple clock icon.

Use a dark theme color.

Do not use a huge image asset.

---

# 50. CODE QUALITY RULE

Before finishing:

- inspect the entire project
- identify unnecessary dependencies
- identify unnecessary renders
- remove unused files
- remove unused imports
- remove console debugging
- ensure TypeScript passes
- ensure lint passes
- ensure production build passes

Run appropriate commands such as:

```bash
npm run lint
npm run build
```

Fix all errors.

---

# 51. DO NOT OVERENGINEER

This is a clock.

Do not turn it into a huge SaaS application.

Prioritize:

1. Accurate time
2. Beautiful UI
3. iPhone 7 landscape experience
4. Performance
5. Reliability
6. Simple architecture

Everything else is secondary.

---

# 52. FINAL UX TARGET

When I open the application on my iPhone 7 in landscape, the experience should feel approximately like:

"I turned my old iPhone into a dedicated premium smart clock."

I should immediately see:

- huge current time
- elegant analog clock
- date/day
- temperature
- weather
- location
- battery
- subtle secondary information

Tap the screen and controls appear.

Wait a few seconds and controls disappear.

The clock continues to look beautiful.

It should remain lightweight enough to stay open for long periods.

---

# 53. IMPLEMENTATION ORDER

Build in this order:

### Phase 1

Project setup

### Phase 2

Clock engine

### Phase 3

Digital clock

### Phase 4

Analog clock

### Phase 5

Main iPhone 7 landscape dashboard

### Phase 6

Themes

### Phase 7

Settings

### Phase 8

Timezone system

### Phase 9

Weather abstraction

### Phase 10

Battery / online status

### Phase 11

Stopwatch

### Phase 12

Countdown

### Phase 13

Alarm

### Phase 14

Wake Lock

### Phase 15

Auto dim / ambient mode

### Phase 16

PWA

### Phase 17

Performance optimization

### Phase 18

Testing

Do not implement everything as one giant component.

---

# 54. IMPORTANT: WORK AUTONOMOUSLY

Do not merely give me code snippets or tell me what I should implement.

Actually inspect the existing project and implement the application.

If the repository is empty, initialize the appropriate Next.js project.

If the repository already contains code, preserve useful existing configuration and improve it rather than unnecessarily replacing everything.

Make reasonable engineering decisions yourself.

Only ask me a question if the decision genuinely blocks implementation.

Otherwise proceed.

---

# 55. FINAL ACCEPTANCE CRITERIA

The project is complete only when:

- [ ] Next.js application runs
- [ ] TypeScript is clean
- [ ] Production build succeeds
- [ ] Digital clock works
- [ ] Analog clock works
- [ ] Hybrid mode works
- [ ] 12/24-hour mode works
- [ ] Date works
- [ ] Timezones work
- [ ] Weather architecture works
- [ ] Battery information gracefully degrades
- [ ] Online/offline status works
- [ ] Stopwatch works
- [ ] Countdown works
- [ ] Alarm system works while app is active
- [ ] Settings persist
- [ ] Themes persist
- [ ] Wake Lock is implemented where supported
- [ ] Auto-dimming works
- [ ] Ambient mode works
- [ ] PWA configuration works
- [ ] Offline clock functionality works
- [ ] No horizontal scrolling
- [ ] No unnecessary vertical scrolling in clock mode
- [ ] Landscape iPhone 7 layout is polished
- [ ] Touch targets are usable
- [ ] No obvious memory leaks
- [ ] No unnecessary intervals
- [ ] No excessive animations
- [ ] No unnecessary dependencies
- [ ] Lint passes
- [ ] Production build passes

Most importantly:

**Do not optimize this as a generic website. Optimize it as a dedicated lightweight smart-clock application running on an old iPhone 7.**

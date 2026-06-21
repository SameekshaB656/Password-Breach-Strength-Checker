# Testing — Password Breach Checker

Manual test cases covering every feature. Open `index.html` in your browser with DevTools Console open so you can catch any red errors as you go.


## 1. Page load / initial state


1.1 Open 'index.html' fresh (first time, no localStorage) - Navbar shows logo + title + moon icon (dark mode default). Card shows hero icon, title, password field, Check + 🎲 buttons. Result section and error message are NOT visible. 

1.2 Check browser console - No red errors 

1.3 Resize window narrower (~375px, mobile width) - Card stays centered and readable, no horizontal scroll, navbar items don't overlap 


## 2. Theme toggle

 2.1  Click the moon icon top-right - Page switches to light theme: white card, dark text, icon changes to ☀️ 

 2.2  Click the sun icon - Switches back to dark theme, icon changes to 🌙 

 2.3  Set to light mode, then refresh the page  - Page reloads still in light mode (confirms `localStorage` persistence) 

 2.4  Set to dark mode, refresh - Page reloads still in dark mode 

 2.5  In light mode, run a breach check (see section 4) - Strength bar colors and breach box colors are still readable/correct in light theme, not just dark 


## 3. Show/hide password

 3.1  Type a password into the field - Characters show as dots (●●●●●) 

 3.2  Click the 👁️ eye icon - Password becomes visible as plain text, icon changes to 🙈 

 3.3  Click 🙈 - Password hides again as dots, icon returns to 👁️ 



## 4. Breach check — core feature
4.1 password123 - Red/danger box: "Found in [some large number] breaches"

4.2 123456 - Red/danger box: very high breach count (millions)

4.3 A random strong string you make up, e.g. Xk9#mQ2vPz!7Lr - Green/safe box: "Not found in any known breach"

4.4 Empty input, click Check - Error message appears: "Please enter a password to check." Result section stays hidden.

4.5 Type a password, press Enter key instead of clicking Check - Same as clicking Check — breach check runs

4.6 While a check is running (briefly), observe the Check button - Button text changes to "Checking..." and is disabled (can't double-click)

4.7 While a check is running, observe area above the result - K-anonymity badge appears with pulsing dot: "Sending only 5 characters..."

4.8 After check completes - K-anonymity badge disappears, Check button returns to normal and re-enables

## 5. Full strength meter (shown after clicking Check)

5.1 a - 0 bars filled, "Very weak — this is a commonly used password" or very weak label

5.2 password - 0 bars (in common password list) — "Very weak — this is a commonly used password"

5.3 abcdefgh (8 lowercase only) - 1 bar — weak

5.4 Abcdefgh1 (mixed case + number, 9 chars) - 2-3 bars

5.5 Xk9#mQ2vPz!7Lr (long, mixed case, number, symbol) - 4 bars — "Strong password"

5.6 Type a weak password, then edit it to be strong, click Check again - Bars update correctly to reflect the new value (not stuck on old result)

## 6. Password generator (🎲)

6.1 Click 🎲 button - Input field fills with a 16-character random password

6.2 Observe field after generating - Password is shown in plain text (not dots), eye icon shows 🙈

6.3 Observe bottom of screen - Toast appears: "Strong password generated — click Check to verify it", then fades after ~2.5s

6.4 Click 🎲 multiple times in a row - Each click produces a different random password

6.5 Click 🎲, then click Check - Generated password runs through breach check normally — should almost always show green/safe (since it's randomly generated, not a known leaked password)

6.6 Inspect a few generated passwords - No ambiguous characters like 0, O, l, 1 should appear (confirms charset is working as intended)


## 7. Live strength preview (autosuggest-style, updates as you type)
This is separate from the full strength meter in section 5 — it appears immediately as you type, before clicking anything.
7.1 Open the page fresh, don't type anything - No "Strength as you type" line visible at all

7.2 Click into the password field, type a single character, e.g. a - Line appears immediately: "Strength as you type: Very weak" (red dot + red text)

7.3 Keep typing to build abcdefgh (8 lowercase letters) - Label updates live, e.g. to "Weak" — no click needed

7.4 Continue typing to Abcdefgh1 (mixed case + number) - Label updates again, likely to "Okay" (amber dot)

7.5 Continue typing to Abcdefgh1! (add a symbol) - Label updates to "Strong" (green dot)

7.6 Delete all characters one by one until field is empty - Line disappears completely once field is empty

7.7 Type password (a known common password) - Label shows "Very weak" — common-password detection still applies even though it's 8 letters

7.8 Paste a long string at once instead of typing slowly - Label still updates correctly to match the final value, no lag or stuck state

7.9 Click the 🎲 generate button - Password field fills AND the live preview line appears immediately showing "Strong" — no extra typing needed to trigger it

7.10 Type a password, watch the live preview, then click "Check password" - Live preview line stays visible above, AND the full result section (red/green box + 4 bars) appears below it — both visible together, not replacing each other

7.11 After clicking Check, keep typing more characters - Live preview line updates again immediately. The full result box from the previous click stays as-is until you click Check again.

7.12 Switch to light mode, then type a password - Live preview dot and text colors are still clearly readable

7.13 Switch back to dark mode while preview is showing - Colors adjust correctly, text stays readable

## 8. Error handling
8.1 Turn off your wifi/internet, then click Check on any password - Error message: "Could not reach the breach check service. Please try again." Result section hidden.

8.2 Turn internet back on, click Check again - Works normally

8.3 Click Check with empty field after a previous successful check was shown - Error message appears, AND the old result section hides (doesn't stay stuck showing old data)
## 9. Cross-browser / cross-device (if time allows)
9.1 Open in Chrome - Works fully

9.2 Open in Firefox or Edge - Works fully (crypto.subtle and fetch are standard, should be fine)

9.3 Open on a phone browser (or DevTools mobile emulation) - Layout adapts, buttons are tappable, no overlap

## Quick smoke test (if you're short on time)

Open page → no console errors 
Type password123 → Check → see red "Found in X breaches" 
Click 🎲 → Check → see green "Not found" 
Click theme toggle → confirm it switches and persists on refresh 
Click 👁️ → confirm show/hide works 
Type any password → confirm "Strength as you type" appears live, no click needed 

If all 6 pass, your core demo path is solid.

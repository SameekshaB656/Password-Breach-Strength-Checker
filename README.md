# 🔐 Password Breach Checker

A privacy-first web app that checks whether a password has been exposed in known data breaches, scores its strength live as you type, and can generate a strong password for you — all without your real password ever leaving your browser.

Built for the **Creative Showcase Hackathon** (Theme : Cybersecurity)

🔗 Live demo: https://password-breach-strength-checker-1.onrender.com

## What it does

- Checks if a password has appeared in known data breaches, using the [Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords)
-  Shows how many breaches a password has been found in
-  Live strength feedback as you type — no need to click anything to see how weak or strong a password is
-  One-click strong password generator
-  Light / dark theme toggle, saved across visits
-  Privacy by design — the real password never leaves your browser

## Why it matters

Password reuse and weak passwords are one of the most common causes of account compromise. Most people have no easy way to check if a password they're using has already leaked in a past breach. This tool gives an instant, judgment-free answer — and explains *why* a password is weak, not just that it is — while also offering a quick way to generate a better one.

## How it works (k-anonymity)

Instead of sending your password — or even its full hash — to a server, this app uses a technique called **k-anonymity**:

1. Your password is hashed locally in the browser using SHA-1 (`crypto.subtle`)
2. Only the **first 5 characters** of that hash are sent to the Pwned Passwords API
3. The API responds with every hash suffix that shares that same 5-character prefix — often hundreds of candidates
4. Your browser compares the *rest* of the hash locally to find a match
5. The server never sees your full password, your full hash, or which result in the list is actually yours

A small badge appears on screen during the check as a visual reminder that only a partial hash is being sent.

## Features

| Feature               | Description                                                                                       |
|-----------------------|---------------------------------------------------------------------------------------------------|
| Breach check          | Tells you if a password has leaked, and in how many breaches                                      |
| Live strength preview | Updates instantly as you type, before you click anything                                          |
| Full strength meter   | A more detailed score (length, character variety, common-password detection) shown after checking |
| Password generator    | Creates a random 16-character strong password in one click                                        |
| Show/hide password    | Toggle visibility while typing                                                                    |
| Light / dark theme    | Switch anytime; your choice is remembered on your next visit                                      |
| Privacy by design     | No password or full hash ever transmitted                                                         |
| No signup required    | Works instantly, no account or installation needed                                                |


## Tech stack

- HTML, CSS, JavaScript (vanilla, no frameworks)
- Web Crypto API (`crypto.subtle.digest`, `crypto.getRandomValues`) for client-side hashing and secure random password generation
- [Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords) (free, no API key required)
- `localStorage` for theme persistence
- Deployed on [Render](https://render.com)

## Getting started locally

```bash
git clone https://github.com/SameekshaB656/password-breach-checker.git
cd password-breach-checker
# open index.html directly in your browser, or serve it locally:
npx serve .
```

No build step, no dependencies, no API key needed.

## Project structure

```
├── index.html      # Main UI: navbar, password form, results
├── style.css       # Styling, theme variables, animations
├── script.js       # Hashing, API call, strength logic, theme + generator logic
├── README.md
└── TESTING.md       # Full manual test case matrix
```

## Testing

This project was tested manually across the full feature set — breach checking, the live strength preview, the password generator, theme switching, and error handling (e.g. offline state). See 'TESTING.md' in this repo for the full test matrix used.

## Disclaimer

This tool is for educational and personal security awareness purposes. It does not store, log, or transmit your password in plaintext at any point.

## Author

Built by Sameeksha Badugu as part of a bootcamp Creative Showcase Hackathon.

## Questions?
LinkedIn : www.linkedin.com/in/sameeksha-badugu-7a314039a
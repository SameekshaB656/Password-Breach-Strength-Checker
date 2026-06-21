
# 🔐 Password Breach Checker

A privacy-first web app that checks whether a password has been exposed in known data breaches — and scores its strength — without ever sending your actual password over the network.

Built for the **Creative Showcase Hackathon** (Theme : CyberSecurity).

🔗 **Live demo:** 

---

## What it does

-  Checks if a password has appeared in known data breaches, using the [Have I Been Pwned Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords)
-  Shows the number of breaches the password has been found in
-  Scores password strength based on length, character variety, and common-password patterns
-  Protects privacy by design — the real password never leaves your browser

## Why it matters

Password reuse and weak passwords are one of the most common causes of account compromise. Most people have no easy way to check if a password they're using has already leaked in a past breach. This tool gives an instant, judgment-free answer — and explains *why* a password is weak, not just that it is.

## How it works (k-anonymity)

Instead of sending your password (or even its full hash) to a server, this app uses a technique called **k-anonymity**:

1. Your password is hashed locally in the browser using SHA-1 (`crypto.subtle`)
2. Only the **first 5 characters** of that hash are sent to the Pwned Passwords API
3. The API responds with a list of all hash suffixes that share that same 5-character prefix — often hundreds of candidates
4. Your browser compares the *rest* of the hash locally to find a match
5. The server never sees your full password, your full hash, or which result in the list is actually yours

This means the breach check happens without trusting any third party with your actual password.

## Tech stack

- HTML, CSS, JavaScript (vanilla)
- Web Crypto API (`crypto.subtle.digest`) for client-side SHA-1 hashing
- [Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords) (free, no API key required)
- Deployed on [Render](https://render.com)

## Features

 Breach check - Tells you if a password has leaked, and in how many breaches 
 Strength meter - Scores password based on length, variety, and common-password detection 
 Privacy by design - No password or full hash ever transmitted 
 No signup required - Works instantly, no account or installation needed 

## Getting started locally


git clone https://github.com/SameekshaB656/password-breach-checker.git
cd password-breach-checker
# open index.html in your browser, or serve it locally:
npx serve .


No build step, no dependencies, no API key needed.

## Project structure


├── index.html      # Main UI
├── style.css        # Styling
├── script.js         # Hashing, API call, strength logic
└── README.md


## Disclaimer

This tool is for educational and personal security awareness purposes. It does not store, log, or transmit your password in plaintext at any point.

## Author

Built by Sameeksha Badugu as part of a bootcamp Creative Showcase Hackathon.
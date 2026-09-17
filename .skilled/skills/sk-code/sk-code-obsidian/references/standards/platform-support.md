---
title: Obsidian Platform Support
description: isDesktopOnly is false, minAppVersion 1.7.2 — what that means for the plugin's touch detection, is-phone layout, form-control baseline, and the operator-verified boundary this repo cannot itself confirm.
trigger_phrases:
  - "obsidian plugin platform support"
  - "isdesktoponly false minappversion"
  - "obsidian mobile ios android desktop"
  - "operator verified physical device"
  - "manifest.json app compatibility"
importance_tier: normal
contextType: general
version: 0.1.0.0
---

# Obsidian Platform Support

`manifest.json` declares `"isDesktopOnly": false` and `"minAppVersion": "1.7.2"`. This reference
is what that commits the plugin to, how the source honors it, and which platform claims this
repository cannot itself verify.

---

## 1. OVERVIEW

### Purpose

Document the plugin's declared platform contract, the source mechanisms that back it, and the
operator-verified boundary — the platform behavior no static check in this repository can
confirm.

### Core Principle

`isDesktopOnly: false` is a claim about API usage (no Node/Electron-only calls without a gate),
not a claim that every surface has been exercised on Obsidian mobile. The source backs the API
claim; only a physical run backs the exercised claim.

### Key Facts

- `minAppVersion: "1.7.2"` is the floor every shipped version targets; `versions.json` maps each
  released plugin version to the Obsidian app version it requires.
- Manual installation instructions (`README.md`) copy `main.js`, `styles.css`, and
  `manifest.json` into `.obsidian/plugins/note-database/` — the same three files the release
  workflow attaches to a GitHub release (see `release/release-verification.md`).
- The plugin is bundled as CommonJS (`format: "cjs"`, `esbuild.config.mjs`) targeting `es2018`,
  the format and language target Obsidian's plugin loader expects across desktop and mobile.

---

## 2. WHAT BACKS `isDesktopOnly: false` IN SOURCE

- `src/data/touch-environment.ts` reads `Platform.isMobile` and `Platform.isTablet` from the
  `obsidian` module rather than any Node/Electron API, and combines them with a coarse-pointer
  media query and a container-width fallback — see `mobile-and-touch.md`.
- No file in `src/` imports a Node built-in or an Electron API directly; `esbuild.config.mjs`
  externalizes `obsidian`, `electron`, and the CodeMirror/Lezer packages rather than bundling
  them, and the only test file that touches Node built-ins (`fs`, `path`) is
  `src/views/screenshot-fixtures.test.ts`, explicitly scoped and eslint-disabled for exactly that
  reason (`import/no-nodejs-modules`) because it never ships.
- Responsive layout keys off Obsidian's own `is-phone` body class rather than reimplementing
  device detection in CSS — see `mobile-and-touch.md` §4 and `theme-variables.md`.

---

## 3. OPERATOR-VERIFIED BOUNDARY

This repository's gates (`tsc`, `build`, `vitest`, `screenshots:verify`, `lint`) run on a
developer machine, not inside Obsidian, and never on a physical iOS or Android device. Per
`specs/public/HANDOVER.md` (plugin repository), the following remain **operator-verified, not
proven by this repository's own checks**:

- Two-level card keyboard traversal has never been exercised against Obsidian's real re-render
  cycle — only against a mock DOM in `vitest`.
- No screen-reader session (VoiceOver, TalkBack, NVDA) has run against any surface.
- No on-device confirmation exists for touch-target sizing, long-press gesture feel, or split-
  pane narrow-container behavior on an actual tablet or phone.
- Two recorded P1 items explicitly need eyes on the running plugin — they cannot be closed from a
  screenshot alone.

Treat every claim in `mobile-and-touch.md` and `accessibility.md` as source-level unless this
section is updated to record a specific operator verification.

---

## 4. RELATED REFERENCES

- `mobile-and-touch.md` — the touch-detection mechanics this platform contract depends on.
- `accessibility.md` — the parallel source-verified-not-session-verified caveat for a11y.
- `release/release-verification.md` — the three files (`main.js`, `styles.css`, `manifest.json`)
  every install path (manual or release) depends on staying in sync.

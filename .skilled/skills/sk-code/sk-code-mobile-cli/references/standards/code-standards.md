---
title: Pi Remote Applied Code Standards
description: A current-state summary of how the sk-code standards apply to the Svelte-only Pi Remote app — module headers, naming, comments, CSS ownership, and the change gate. Not a point-in-time audit.
trigger_phrases:
  - 'pi remote code standards'
  - 'sk-code standard surface'
  - 'code standards summary'
  - 'module header conformance'
  - 'naming and commenting standards'
importance_tier: normal
contextType: implementation
version: 1.0.0.2
---

# Pi Remote Applied Code Standards

A current-state summary of how sk-code standards apply to the Svelte-only Pi Remote app. Not a
point-in-time audit.

---

## 1. OVERVIEW

### Purpose

Gives Pi Remote engineers the applied shape of sk-code standards at a glance — module headers, naming,
comments, CSS ownership, and the change gate — so conventions don't have to be reverse-engineered from
the source alone.

### When to Use

- Reviewing a Pi Remote change against naming, comment, or module-header conventions
- Onboarding to the Svelte-only mobile app and its workspace layout
- Confirming the change gate before any completion claim

### Key Sources

- **SKILL.md §3** (surface standards) — the living authority for standards this page restates
- **SKILL.md §3b** (source tree conventions) — the living authority for workspace and file-tree layout

---

## 2. APPLIED SURFACE

The standards cover the TypeScript and Svelte source across the four workspaces — the protocol package
under `packages/`, the relay under `app-relay/`, the mobile PWA under `app-mobile/`, and the approval
extension under `extensions/` — plus the scripts, release, and deploy trees. The UI is Svelte components
with component-scoped `<style>` blocks over the `app-mobile/src/app.css` foundation; there is no React.

---

## 3. MODULE HEADERS AND SECTIONS

Every code file opens with a MODULE banner that names its component, and each shell script carries a
COMPONENT block. Longer files divide the body with numbered section dividers. Docs use numbered ALL-CAPS
headings.

---

## 4. NAMING

Files are kebab-case, except `app-mobile/src/routes/**`, where SvelteKit owns the filenames. Functions
are camelCase, interfaces and types are PascalCase, and constants are UPPER_SNAKE_CASE; booleans read as
questions. The wire-contract keys `needs_input`, `finished`, and `error` stay snake_case for protocol
compatibility — a documented, unchanged exception.

---

## 5. COMMENTS

Comments explain the durable WHY, start with a capital letter, and stay low-density. They never embed
ephemeral identifiers — no spec, packet, phase, task, or ticket ids. The app's comment-grammar scanner,
`node scripts/naming/scan-comments.mjs`, measures this across `app-mobile/src`.

---

## 6. STYLES AND CSS OWNERSHIP

Each component owns its presentation in a scoped `<style>` block; the primitive, semantic, and component
token layers plus shared rules live in `app-mobile/src/app.css`. Nearby purpose comments explain the
presentation seam and `Do not edit — <why>` notes protect frozen lines. No component ships a separate
`.css` file.

---

## 7. THE CHANGE GATE

Every change runs `test:web`, `typecheck`, and `build`, and all three must pass before any completion
claim. Security-sensitive code validates input, keeps secrets in the environment, and fails closed. For a
design-system change, add the browser-free resolver proof from `verification.md`.

---
title: "Implementation Plan: Pi loads hook adapters on every version"
description: "Pi loads the hook adapters on every version through one-line entry files and file-relative imports. Each entry in .pi/extensions/ re-exports its adapter, and each adapter imports from its own folder."
trigger_phrases:
  - "file relative adapter imports plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Pi loads hook adapters on every version

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript Pi adapters, CommonJS and ESM helpers |
| **Framework** | Pi extension loader (jiti) |
| **Storage** | None |
| **Testing** | vitest, `node --test`, `tsc`, a `pi -p` load test on two Pi versions |

### Overview
The change rewrites the imports in 20 Pi adapter files so each one is relative to the adapter's own folder. It replaces the 22 symlink entries in `.pi/extensions/` with one-line re-export files, and teaches the registration check and the doctor's git setup check about them. A `pi -p` load test on Pi 1.5.0 and Pi 1.5.2, the adapter suites and the type check prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `pi -p "Reply with the single word READY." --mode text --offline` prints `READY` and exits 0 on Pi 1.5.0 and on Pi 1.5.2
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One-line re-export entries. The adapters live in their skill or hook folders, and `.pi/extensions/` holds a regular file per adapter.

### Key Components
- **`.pi/extensions/*.ts` entries**: one line each, for example `export { default } from '../../.skilled/hooks/overlay-guard/pi/overlay-guard.ts';`. Pi imports them by their own path on every version.
- **Pi adapter files**: the real `.ts` files. They load from their real folder, so their file-relative imports resolve.

### Data Flow
Pi imports an entry file by its own path. The entry re-exports the adapter, which loads from its real folder. Every relative import in the adapter then resolves from that folder, on Pi 1.5.0 and on Pi 1.5.2.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reproduces the 16 load errors on Pi 1.5.2 and records the test baselines. Implementation rewrites the adapter imports, swaps the symlink entries for one-line files, then updates the checks, tests and docs. Verification runs the load test on both Pi versions, the suites, the type check and the registration check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The load test is the main proof: `pi -p "Reply with the single word READY." --mode text --offline` must print `READY` and exit 0 on Pi 1.5.0 and on Pi 1.5.2. One entry was swapped first as a probe, then all 22. The hooks vitest run must keep 491 passing tests, and `tsc -p tsconfig.pi.json` must exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Pi 1.5.0 or newer. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: an adapter fails to load on either Pi version, or the registration check fails. Revert the change to the entry, adapter, check, test and doc files. That restores the symlink entries and link-relative imports, which load only on Pi older than 1.5.1.
<!-- /ANCHOR:rollback -->

---

---
title: Universal Verification Checklist
description: Stack-agnostic verification gate to walk before any "done", "works", "complete", or "passing" claim.
trigger_phrases:
  - "universal verification checklist"
  - "pre claim gate"
  - "surface verification commands"
  - "done works complete claims"
importance_tier: important
contextType: implementation
version: 3.5.0.7
---

# Universal Verification Checklist - The Pre-Claim Gate

Surface-agnostic verification gate. Walk this checklist BEFORE making any "done", "works", "complete", or "passing" claim across WEBFLOW or OPENCODE.

## 1. OVERVIEW

### Purpose

Codifies the universal protocol that gates every completion claim in sk-code. Surface-specific commands (the Webflow minification scripts plus a browser matrix for WEBFLOW, and alignment/test commands for OPENCODE) are listed in Section 3 below and detailed in each surface's verification docs.

### Usage

Run the 8-step Gate Function in Section 2 in order. All `SURFACE_VERIFICATION_COMMANDS` for the detected surface must exit 0 (Section 3). For WEBFLOW, also walk the browser matrix in Section 4. Without evidence (Section 6), "done" is a guess — attach the evidence block to the completion claim.

---

## 2. THE GATE FUNCTION (8 steps)

Walk these in order before claiming any status:

1. [ ] **IDENTIFY** — what command/action proves this claim?
2. [ ] **RUN** — execute the surface's verification commands (`SURFACE_VERIFICATION_COMMANDS`).
3. [ ] **TEST** — for WEBFLOW: open browser; for OPENCODE: run targeted unit/integration checks where available.
4. [ ] **VERIFY** — does output match expected? Exit code 0? Test count green?
5. [ ] **VERIFY (WEBFLOW)** — multi-viewport (mobile + desktop) + DevTools console clean.
6. [ ] **VERIFY (CRITICAL CHANGE)** — cross-browser / cross-platform check where applicable.
7. [ ] **RECORD** — note what you saw / which command exited 0 / which test passed.
8. [ ] **ONLY THEN** — make the claim.

---

## 3. SURFACE VERIFICATION COMMANDS

Run all of these from the project root. ALL must exit 0 before claiming done.

| Surface | Test | Lint | Build |
|---|---|---|---|
| WEBFLOW | (see browser matrix in Section 4) | n/a (style enforced via checklist) | `node .opencode/skills/sk-code/webflow/assets/scripts/minify-webflow.mjs && node .opencode/skills/sk-code/webflow/assets/scripts/verify-minification.mjs && node .opencode/skills/sk-code/webflow/assets/scripts/test-minified-runtime.mjs` |
| OPENCODE | Targeted tests for touched package or script | `python3 .opencode/skills/sk-code/code-verify/assets/scripts/verify_alignment_drift.py --root <changed-path>` | Package-specific build/typecheck where available |
| UNKNOWN | sk-code does not own this surface — surface a disambiguation prompt instead | n/a | n/a |

---

## 4. WEBFLOW BROWSER MATRIX

**Minimum** (always required):

- [ ] Chrome Desktop (1920px) — manual test.
- [ ] Mobile emulation (375px) — manual test.
- [ ] DevTools Console — no errors.

**Standard** (production work):

- [ ] Chrome Desktop (1920px) + Tablet (991px) + Mobile (375px).
- [ ] DevTools console clear at all viewports.
- [ ] Lighthouse 3× run with median used.

For the full WEBFLOW matrix and Lighthouse details: `references/webflow/verification/verification_workflows.md` and `references/webflow/performance/cwv_remediation.md`.

---

## 5. UNIVERSAL PRE-CLAIM CHECKLIST

- [ ] All `SURFACE_VERIFICATION_COMMANDS[surface]` exit 0.
- [ ] No new warnings introduced (compare to last-known-good).
- [ ] Code Quality Gate (Phase 1.5) checklist items marked `[x]` with evidence.
- [ ] If a regression test was added (Phase 2), it passes.
- [ ] Diff scope matches stated change (no accidental extras).
- [ ] No commented-out code, console.log, fmt.Println, print debug residue.

---

## 6. ANTI-PATTERNS TO AVOID

- [ ] **Avoid**: "Should work" / "probably works" claims — test it.
- [ ] **Avoid**: Claiming done with skipped tests or mocked dependencies that aren't representative.
- [ ] **Avoid**: WEBFLOW — claiming done without opening an actual browser.
- [ ] **Avoid**: Single-viewport / single-OS tests passing as "verified".
- [ ] **Avoid**: Stale build artifacts (run `<tool> clean` before verification on suspect builds).
- [ ] **Avoid**: Verification only against happy path — include at least one edge case + error path.

---

## 7. RECORDING VERIFICATION EVIDENCE

When claiming done, attach an evidence block to the message:

```
Verified:
- npm test: PASS (47 passed, 0 failed)
- npm run lint: clean
- npm run build: succeeded (.next/ produced, 124 KB)
- WEBFLOW only: Chrome desktop + mobile, console: 0 errors
- Lighthouse: median scores (LCP / TBT / CLS) within targets

Diff: 3 files changed, +47 -12
```

Without evidence, "done" is a guess.

---

## 8. RELATED RESOURCES

- `references/phase_detection.md` — Phase 3 Verification position in the sk-code lifecycle.
- `assets/universal/checklists/debugging_checklist.md` — runs before this checklist when bugs surface.
- `references/webflow/verification/verification_workflows.md` — WEBFLOW deep-dive (browser matrix, Lighthouse, multi-viewport).
- `references/opencode/shared/alignment_verification_automation.md` — OPENCODE alignment verification.

---
title: Hardening Edge Cases
description: A production-readiness matrix for audit. Extreme inputs, API and network errors, permissions, rate limits, concurrency, internationalization and RTL, text expansion, plus CJK and emoji, each as a checkable finding.
trigger_phrases:
  - "hardening edge cases"
  - "production readiness matrix"
  - "extreme input audit"
  - "rate limit concurrency audit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hardening Edge Cases

A surface that only works with perfect data is not production-ready. This reference is the edge-case matrix the audit walks to prove a surface survives the inputs, failures and languages that real users bring. Each row is a probe, an expected symptom when the surface is unhardened, and the finding to file when the symptom appears.

The narrative hardening workflow and the persona, cognitive-load and polish lenses live in `critique_hardening.md`. The production-readiness summary and the finding-owner map live in `anti_patterns_production.md`. This file does not repeat that prose. It is the concrete matrix underneath them: the specific probes to run and what each failure proves. The severity model and the findings schema come from `audit_contract.md`, and accessibility resilience stays in `accessibility_performance.md`. The audit reports these gaps and routes them, it does not implement the hardening, which is `sk-code` work after the user accepts the fix.

---

## 1. HOW TO USE THE MATRIX

1. Resolve the surface to source or rendered evidence, following `evidence_capture.md`.
2. Walk each probe below against the surface. A probe you cannot run on the available evidence is an inferred finding, so label it inferred and state what would confirm it.
3. For every failure, file a finding with the exact element, the user impact, the severity and the owner.
4. Severity follows user impact. A failure that loses user work or strands a flow is P0 or P1. A cosmetic overflow with a workaround is P2 or P3. The default question from `audit_contract.md` applies: would a real user fail, contact support or abandon?
5. Most hardening findings land in the Responsive, Theming or Anti-Patterns dimensions of the five-dimension score. Resilience gaps that block assistive use route to Accessibility instead.

---

## 2. EXTREME INPUTS

Real content is longer, shorter and stranger than the mockup. Probe the edges of every text and data field.

| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| Very long text in names, titles, descriptions | Overflow, clipped layout, broken alignment | Missing overflow handling, or a flex or grid child without `min-width: 0` |
| Single character or empty text | Collapsed container, broken baseline, orphaned label | No minimum sizing or empty-value handling |
| Very large numbers, millions and billions | Truncation, overlap, misaligned columns | No formatting or container budget for large values |
| A list of 1000 or more items | Slow render, scroll jank, frozen interaction | No pagination, virtualization or list bound |
| No data at all | A blank region with no guidance | Missing empty state with a next action |

Empty, loading and error states are part of this probe. A surface missing any of the three is a production-readiness finding even when the happy path is flawless.

---

## 3. API AND NETWORK ERRORS

The network fails, and the surface has to say so without breaking. Force each error and watch the response.

| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| Offline or dropped connection | Spinner forever, silent failure, lost input | No offline or failure path, no retry |
| Slow response or timeout | Frozen UI with no feedback during the wait | No timeout handling, no progress signal |
| 400 validation error | Generic failure with no field-level detail | Validation errors not surfaced to the fields |
| 401 unauthorized | Dead end with no route back to sign-in | No redirect or re-auth path |
| 403 forbidden | Confusing failure with no explanation | No permission-denied state |
| 404 not found | Raw error or blank screen | No not-found state with a way forward |
| 429 rate limited | Silent failure or an unhelpful retry storm | No rate-limit message, no backoff cue |
| 500 server error | Cryptic message, or the whole UI breaks | No generic error state, no support path, failure not contained |

The contract for error copy itself, what happened, why and how to recover, lives in `anti_patterns_production.md`. This matrix proves the error path exists and stays contained. One component erroring must not take the whole interface down.

---

## 4. PERMISSIONS AND RATE LIMITS

State that depends on who the user is, and on how often they act, needs its own probes.

| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| No permission to view | Empty screen, or a broken attempt to render forbidden data | No view-permission state |
| No permission to edit | Editable controls that fail silently on submit | No read-only mode, no disabled affordance with a reason |
| Read-only context | The UI looks editable but is not | Read-only state not visually distinct |
| Repeated rapid actions hit a limit | Silent drop, or an error with no recovery guidance | No rate-limit feedback, no cue for when to retry |

A disabled control still needs an accessible explanation of why it is disabled. That snippet lives in `assets/a11y_quick_fixes.md`. Route the accessibility half of a permission finding there.

---

## 5. CONCURRENCY

Users double-click, open two tabs and act while a request is still in flight. Probe the races.

| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| Submit pressed many times fast | Duplicate records, duplicate charges, duplicate requests | Submit not disabled while the request is in flight |
| Same record edited in two tabs | Last write silently wins, the other user's work vanishes | No conflict detection or resolution |
| An optimistic update that the server rejects | UI shows success that never actually happened | No rollback when the update fails |
| Refresh in the middle of a flow | Progress and entered data lost | No state preservation across reload |

Preventing double submission is the highest-frequency concurrency defect. Disable the action while it runs, and re-enable it on completion or failure.

---

## 6. INTERNATIONALIZATION AND RTL

The interface ships in one language and gets used in many. Probe the surface in scripts and directions it was not drawn for.

| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| Right-to-left language, Arabic or Hebrew | Mirrored layout breaks, arrows and icons point the wrong way | Physical CSS properties used where logical properties belong |
| Locale date, time, number and currency formats | Ambiguous or wrong values for the user's locale | Hard-coded formats instead of locale-aware formatting |
| Pluralization across languages | Wrong plural forms, an English-only plural rule | Plurals assembled by hand instead of a real i18n path |

RTL failures almost always trace to physical properties. Logical properties such as the inline and block margin, padding and border keywords adapt to direction, where left and right keywords do not. File the finding against physical-property use and route it to `foundations`.

---

## 7. TEXT EXPANSION

Translation makes text longer, often much longer. A layout tuned to English clips or overflows in other languages.

| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| The longest realistic translation, German is often a third longer | Clipped buttons, wrapped labels breaking layout, overflow | Fixed-width text containers that cannot grow |
| Browser zoom to 200 percent | Overlapping or cut-off text | Containers that do not expand with text |

Budget roughly a third more space for translated text, and let containers size to content rather than to a fixed width. A button sized to fit the English word breaks the moment the German word arrives.

---

## 8. CJK AND EMOJI

Chinese, Japanese, Korean and emoji stress assumptions baked into Latin-only layouts.

| Probe | Expected symptom when unhardened | Finding to file |
|---|---|---|
| CJK characters in every text field | Wrong line breaking, cramped line height, clipped glyphs | Line height and wrapping tuned only for Latin text |
| Emoji in names, messages and inputs | Broken truncation, misaligned baselines, encoding artifacts | Encoding or measurement that assumes one byte per character |
| Mixed scripts in one string | Inconsistent rendering across the mix | No multi-script handling |

Emoji and CJK characters are multi-byte, so any logic that counts characters as bytes, or truncates by a byte budget, mangles them. Probe truncation and length limits with emoji specifically.

---

## 9. ROUTING SUMMARY

1. Walk the matrix against real evidence, labeling any probe you could not run as inferred.
2. File each failure with the exact element, the user impact and a severity from `audit_contract.md`.
3. Route the owner: `foundations` for layout, spacing, logical-property and token fixes, `interface` for empty-state and error-state direction, `sk-code` for implementation.
4. Keep the boundary. The audit proves the gap and names the owner. It does not harden the surface itself.

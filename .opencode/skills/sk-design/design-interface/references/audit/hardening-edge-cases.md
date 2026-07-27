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

Use this matrix to audit whether a surface survives hostile inputs, failures, permissions, languages, and constrained devices.

---

## 1. OVERVIEW

### Purpose

Provides the edge-case matrix the audit walks to prove a surface survives the inputs, failures and languages that real users bring. Each row is a probe, an expected symptom when the surface is unhardened, the finding to file when the symptom appears, and the fix shape to recommend for follow-up.

The narrative hardening workflow and the persona, cognitive-load and polish lenses live in `critique-hardening.md`; the production-readiness summary and finding-owner map live in `anti-patterns-production.md`. This file does not repeat that prose: it is the concrete matrix underneath them, with severity and findings schema from `audit-contract.md` and accessibility resilience in `accessibility-performance.md`. The audit reports these gaps and routes them; it does not implement the hardening, which is `sk-code` work after the user accepts the fix.

### When to Use

- Auditing extreme inputs, API and network errors, permissions, rate limits, concurrency, i18n, RTL, text expansion, CJK, emoji, overlays, device limits, or constrained contexts.
- Filing checkable production-readiness findings with exact probes, symptoms, user impact, severity, and owner routing.
- Labeling skipped or unavailable probes as inferred and naming the evidence needed to confirm them.

### Core Principle

A surface that only works with perfect data is not production-ready.

---

## 2. HOW TO USE THE MATRIX

1. Resolve the surface to source or rendered evidence, following `evidence-capture.md`.
2. Walk each probe below against the surface. A probe you cannot run on the available evidence is an inferred finding, so label it inferred and state what would confirm it.
3. For every failure, file a finding with the exact element, the user impact, the severity and the owner.
4. Severity follows user impact. A failure that loses user work or strands a flow is P0 or P1. A cosmetic overflow with a workaround is P2 or P3. The default question from `audit-contract.md` applies: would a real user fail, contact support or abandon?
5. Most hardening findings land in the Responsive, Theming or Anti-Patterns dimensions of the five-dimension score. Resilience gaps that block assistive use route to Accessibility instead.

---

## 3. EXTREME INPUTS

Real content is longer, shorter and stranger than the mockup. Probe the edges of every text and data field.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| Very long text in names, titles, descriptions | Overflow, clipped layout, broken alignment | Missing overflow handling, or a flex or grid child without `min-width: 0` | Add overflow handling and content sizing, including `min-width: 0` for flex and grid children. Owner: `foundations`. |
| Single character or empty text | Collapsed container, broken baseline, orphaned label | No minimum sizing or empty-value handling | Define stable minimum sizing and explicit empty-value display. Owner: `foundations`. |
| Very large numbers, millions and billions | Truncation, overlap, misaligned columns | No formatting or container budget for large values | Add number formatting and reserve a container budget for large values. Owner: `foundations`. |
| A list of 1000 or more items | Slow render, scroll jank, frozen interaction | No pagination, virtualization or list bound | Bound long lists with pagination or virtualization so interaction stays responsive. Owner: `sk-code`. |
| No data at all | A blank region with no guidance | Missing empty state with a next action | Provide an empty state with explanation and a next action. Owner: `interface`. |

Empty, loading and error states are part of this probe. A surface missing any of the three is a production-readiness finding even when the happy path is flawless.

---

## 4. API AND NETWORK ERRORS

The network fails, and the surface has to say so without breaking. Force each error and watch the response.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| Offline or dropped connection | Spinner forever, silent failure, lost input | No offline or failure path, no retry | Contain the failure, preserve input, and expose retry. Owner: `sk-code`. |
| Slow response or timeout | Frozen UI with no feedback during the wait | No timeout handling, no progress signal | Add timeout handling with visible progress or pending state. Owner: `sk-code`. |
| 400 validation error | Generic failure with no field-level detail | Validation errors not surfaced to the fields | Map validation messages to field-level errors. Owner: `interface`. |
| 401 unauthorized | Dead end with no route back to sign-in | No redirect or re-auth path | Route to sign-in or re-auth with a recoverable return path. Owner: `sk-code`. |
| 403 forbidden | Confusing failure with no explanation | No permission-denied state | Show a permission-denied state with a reason and next step. Owner: `interface`. |
| 404 not found | Raw error or blank screen | No not-found state with a way forward | Show a not-found state with a way back or forward. Owner: `interface`. |
| 429 rate limited | Silent failure or an unhelpful retry storm | No rate-limit message, no backoff cue | Surface rate-limit feedback with a backoff and retry cue. Owner: `sk-code`. |
| 500 server error | Cryptic message, or the whole UI breaks | No generic error state, no support path, failure not contained | Contain the component failure and show a generic error and support path. Owner: `interface`. |

The contract for error copy itself, what happened, why and how to recover, lives in `anti-patterns-production.md`. This matrix proves the error path exists and stays contained. One component erroring must not take the whole interface down.

---

## 5. PERMISSIONS AND RATE LIMITS

State that depends on who the user is, and on how often they act, needs its own probes.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| No permission to view | Empty screen, or a broken attempt to render forbidden data | No view-permission state | Show a permission-denied or locked state before rendering forbidden data. Owner: `interface`. |
| No permission to edit | Editable controls that fail silently on submit | No read-only mode, no disabled affordance with a reason | Use read-only mode or disabled affordances with an accessible reason. Owner: `interface`; a11y route: `assets/a11y-quick-fixes.md`. |
| Read-only context | The UI looks editable but is not | Read-only state not visually distinct | Make the read-only state visually and semantically distinct from editable controls. Owner: `interface`. |
| Repeated rapid actions hit a limit | Silent drop, or an error with no recovery guidance | No rate-limit feedback, no cue for when to retry | Show limit feedback with retry timing and prevent repeated action storms. Owner: `sk-code`. |

A disabled control still needs an accessible explanation of why it is disabled. That snippet lives in `assets/a11y-quick-fixes.md`. Route the accessibility half of a permission finding there.

---

## 6. CONCURRENCY

Users double-click, open two tabs and act while a request is still in flight. Probe the races.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| Submit pressed many times fast | Duplicate records, duplicate charges, duplicate requests | Submit not disabled while the request is in flight | Disable submit while the request is in flight and restore it on completion or failure. Owner: `sk-code`. |
| Same record edited in two tabs | Last write silently wins, the other user's work vanishes | No conflict detection or resolution | Detect edit conflicts and expose resolution before overwriting. Owner: `sk-code`. |
| An optimistic update that the server rejects | UI shows success that never actually happened | No rollback when the update fails | Roll back optimistic state and explain the failed update. Owner: `sk-code`. |
| Refresh in the middle of a flow | Progress and entered data lost | No state preservation across reload | Persist draft or progress state across reload, or restore the flow safely. Owner: `sk-code`. |

Preventing double submission is the highest-frequency concurrency defect. Disable the action while it runs, and re-enable it on completion or failure.

---

## 7. INTERNATIONALIZATION AND RTL

The interface ships in one language and gets used in many. Probe the surface in scripts and directions it was not drawn for.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| Right-to-left language, Arabic or Hebrew | Mirrored layout breaks, arrows and icons point the wrong way | Physical CSS properties used where logical properties belong | Replace physical left and right spacing, placement and borders with logical properties. Owner: `foundations`. |
| Locale date, time, number and currency formats | Ambiguous or wrong values for the user's locale | Hard-coded formats instead of locale-aware formatting | Use locale-aware date, time, number and currency formatting. Owner: `sk-code`. |
| Pluralization across languages | Wrong plural forms, an English-only plural rule | Plurals assembled by hand instead of a real i18n path | Route copy through real i18n plural rules instead of assembling plurals by hand. Owner: `sk-code`. |

RTL failures almost always trace to physical properties. Logical properties such as the inline and block margin, padding and border keywords adapt to direction, where left and right keywords do not. File the finding against physical-property use and route it to `foundations`.

---

## 8. TEXT EXPANSION

Translation makes text longer, often much longer. A layout tuned to English clips or overflows in other languages.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| The longest realistic translation, German is often a third longer | Clipped buttons, wrapped labels breaking layout, overflow | Fixed-width text containers that cannot grow | Let text containers grow with wrapping and a real expansion budget. Owner: `foundations`. |
| Browser zoom to 200 percent | Overlapping or cut-off text | Containers that do not expand with text | Use scalable containers that expand with text at 200 percent zoom. Owner: `foundations`; a11y route: `accessibility-performance.md`. |

Budget roughly a third more space for translated text, and let containers size to content rather than to a fixed width. A button sized to fit the English word breaks the moment the German word arrives.

---

## 9. CJK AND EMOJI

Chinese, Japanese, Korean and emoji stress assumptions baked into Latin-only layouts.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| CJK characters in every text field | Wrong line breaking, cramped line height, clipped glyphs | Line height and wrapping tuned only for Latin text | Use Latin-agnostic line height and wrapping rules. Owner: `foundations`. |
| Emoji in names, messages and inputs | Broken truncation, misaligned baselines, encoding artifacts | Encoding or measurement that assumes one byte per character | Measure and truncate by characters or graphemes, not bytes. Owner: `sk-code`. |
| Mixed scripts in one string | Inconsistent rendering across the mix | No multi-script handling | Set multi-script typography and fallback handling. Owner: `foundations`. |

Emoji and CJK characters are multi-byte, so any logic that counts characters as bytes, or truncates by a byte budget, mangles them. Probe truncation and length limits with emoji specifically.

---

## 10. OVERLAYS AND TOP LAYER

Menus, dropdowns and tooltips often fail because they are visually small but structurally trapped inside a clipping or stacking context. Probe overlays from inside scroll panels, cards, drawers and constrained layout regions.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| A dropdown, menu or tooltip rendered with `position: absolute` inside an `overflow: hidden` or `overflow: auto` container | The overlay is clipped, partly hidden, or scrolls away with the container | Overlay is trapped inside a clipping or stacking context instead of escaping to the top layer | Use native `<dialog>` or popover where it fits the interaction, measured `position: fixed`, or a portal so the overlay escapes overflow and stacking contexts. Owner: `sk-code`. |

---

## 11. DEVICE AND CONSTRAINED CONTEXT

Real devices impose budgets the desktop happy path hides. Probe battery saver, reduced-data signals, low-end CPU, reconnect behavior and slow media before calling a surface production-ready.

| Probe | Expected symptom when unhardened | Finding to file | Fix shape to recommend |
|---|---|---|---|
| Low-power mode / battery-saver enabled, including reduced motion or paused autoplay where the platform applies it | Load-bearing state, progress or content is only exposed through animation or autoplay; when the platform throttles it, feedback disappears or content never appears | State or feedback depends on motion or autoplay without a static or reduced fallback. Record: `verdict: pass | fail | skip`; `evidence: low-power screenshot or trace, reduced-motion observation, or skip reason plus confirming probe needed` | Provide static and reduced fallbacks for motion, autoplay and load-bearing progress. Owner: `interface`; evidence route: `accessibility-performance.md`. |
| Save-Data header / data-saver signal active, such as `Save-Data`, `navigator.connection.saveData` or `prefers-reduced-data` | Full-resolution image, video, prefetch or heavy bundle ships anyway; a lite path hides real content instead of reducing cost | Save-Data or reduced-data signal ignored; no lighter media path or deferred loading. Record: `verdict: pass | fail | skip`; `evidence: request headers, payload comparison, media waterfall, or skip reason plus confirming probe needed` | Serve lighter media or defer nonessential loading while preserving real content. Owner: `sk-code`. |
| CPU-throttle / low-end device emulation, such as DevTools slowdown or coarse `hardwareConcurrency` / `deviceMemory` hints | Scroll jank, delayed input, dropped frames or frozen interaction during expensive work | No low-end CPU budget; long tasks block input. Record: `verdict: pass | fail | skip`; `evidence: throttled interaction recording, performance trace, long-task or latency measurement, or skip reason plus confirming probe needed` | Budget long work, split expensive tasks, and keep input responsive. Owner: `sk-code`; evidence route: `accessibility-performance.md`. |
| Offline-to-online recovery after a connection drops mid-flow and returns | UI remains stuck in offline or error state, queued input disappears, resync never happens, or the user must reload and re-enter data | No connectivity recovery path; reconnect leaves stale state, lost input or no automatic resync. Record: `verdict: pass | fail | skip`; `evidence: offline and reconnect observation, queued-input result, resync log, or skip reason plus confirming probe needed` | Queue or preserve input and resync cleanly after reconnect. Owner: `sk-code`. |
| Slow media over a slow connection, including large image or video, lazy loading, reserved dimensions and poster or skeleton path | Layout shifts as media arrives, blank gaps, blocked interaction, or broken-looking region until the large asset finishes | Slow or large media lacks reserved dimensions, placeholder, lazy loading or progressive path. Record: `verdict: pass | fail | skip`; `evidence: slow-network recording, layout-shift trace, media waterfall, or skip reason plus confirming probe needed` | Reserve media dimensions and provide a placeholder, lazy-loading or progressive path. Owner: `foundations`; evidence route: `accessibility-performance.md`. |

Record `pass` when the surface degrades gracefully, `fail` when the symptom appears and becomes the finding, and `skip` only when the probe could not be run. Skipped probes stay inferred and name the evidence that would confirm them.

Route measurable load, layout-shift, long-task, interaction-latency and motion evidence to `accessibility-performance.md`. Route layout and logical-property fixes to `foundations`, visual or flow direction to `interface`, and implementation to `sk-code`. The recovery probe is distinct from the earlier offline-failure probe: that row asks whether failure is contained, while this row asks whether the surface comes back cleanly after connectivity returns.

---

## 12. ROUTING SUMMARY

1. Walk the matrix against real evidence, labeling any probe you could not run as inferred.
2. File each failure with the exact element, the user impact and a severity from `audit-contract.md`.
3. Route the owner: `foundations` for layout, spacing, logical-property and token fixes, `interface` for empty-state and error-state direction, `sk-code` for implementation.
4. Keep the boundary. The audit proves the gap and names the owner. It does not harden the surface itself. The fix-shape column is advisory: it names the remediation shape to recommend, not a checker or proof that the remedy is correct.

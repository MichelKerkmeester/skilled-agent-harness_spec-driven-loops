---
title: Design-System Verification Checklist
description: The Pi Remote browser-free verification gate as a checklist — resolver before/after, structural mount checks, and the command set.
trigger_phrases:
  - "pi remote verification checklist"
  - "browser-free verification gate"
  - "design system value-preservation check"
  - "evidence before claims — pi remote"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Design-System Verification Checklist

Use this checklist BEFORE claiming any design-system change to `app-mobile/` is complete, fixed,
or working. See `references/verification.md` for why this gate is browser-free and the full method.

---

## 1. OVERVIEW

### Purpose

This checklist gates any design-system change to `app-mobile/` before it can be claimed
complete, fixed, or working. It exists because the app's strict CSP blocks Vite's injected styles under
headless CDP, so screenshot-based verification is unreliable there — the checklist enforces the
browser-free resolver method plus the command gate as the substitute evidence path.

### Usage

Work through the sections in order — the iron law, resolver proof, structural mount checks, command
gate, and guardrail boundary — before claiming a design-system change is done, then confirm against
the final gate. Check each box as you complete the step, and use the CLAIMING FORMAT section to report
resolver diff counts and command exit statuses as evidence.

---

## 2. THE IRON LAW FOR THIS SURFACE

**Evidence from the resolver and the command gate before claims, always.** Screenshot/pixel diffing
proves nothing about colour here: the app's strict CSP blocks Vite's injected styles under headless
CDP, so the app renders unstyled in that path. The resolver method — resolving `app-mobile/src/app.css`
together with the changed component's scoped `<style>` block directly to final values — is immune to that
problem.

□ I resolved `app-mobile/src/app.css` (with the changed component's scoped `<style>` block) to final values per theme, not just reviewed the diff
□ I ran the command gate and read its actual output and exit status
□ I can state the exact `CHANGED` / `VANISHED` / `ADDED` counts from the resolver diff
□ I did not substitute "looks right in a screenshot" for either of the above

**If you cannot check all four boxes, the claim is premature.**

---

## 3. RESOLVER PROOF (value preservation or intended change)

□ Ran the resolver on a **scratch copy** of `app-mobile/src/app.css` (and the changed component's scoped `<style>` block), not the real files, for the experiment itself
□ Resolved BEFORE the change, per theme (light / dark / system)
□ Resolved AFTER the change, per theme
□ For a migration meant to preserve values (literal→token refactor, annotation-only pass):
  `CHANGED` / `VANISHED` / `ADDED` are all **0**
□ For a retint: every intended declaration is in `CHANGED`, and `VANISHED` / `ADDED` are both **0**
  (an intended change must never make a declaration disappear or a new one appear — only its value moves)
□ Confirmed the `CHANGED` set matches the predicted blast radius from `references/retint-recipes.md` /
  `references/component-tokens.md` — no surface outside that set appears

**Known limitation:** the resolver proves selector→value identity, not element→computed-style identity.
A className re-point or rule hoist changes which selector applies to an element and is not verifiable
this way — defer such physical refactors until a real-browser visual-diff harness exists
(`references/verification.md` §3).

---

## 4. STRUCTURAL MOUNT CHECKS (against the built output)

`vite build` emits real linked CSS, which is CSP-safe — a headless mount check works here.

□ Built the app (`npm run build`)
□ Headless mount check at true 390px confirms `#root` gets children
□ Headless mount check confirms `#catalog-root` gets children
□ `scrollWidth == innerWidth` — zero horizontal overflow, both shell and catalog
□ Zero uncaught exceptions during the mount check

---

## 5. COMMAND GATE

□ `npm run typecheck` — `tsc -b`, exit 0
□ `npm run build` — `tsc -b && vite build`, exit 0 (app + catalog entries)
□ `npm run test:web` — vitest, exit 0
□ `contrast.test.ts` specifically green, in **both** themes (WCAG AA)
□ Reduced-motion, focus, and state suites pass (also part of `test:web`)

**Known flake:** `app-mobile/tests/viewer-history.svelte.test.ts` is timing-sensitive (an async `setTimeout(0)`
focus-restore raced by a synchronous assertion) — it is not a design-system signal. Re-run it in
isolation before treating a failure there as a real regression.

---

## 6. GUARDRAIL BOUNDARY

□ No `--pi-*` primitive value changed
□ No security boundary changed
□ No `@ds guardrail: do-not-edit` fence changed (see `assets/guardrail-audit-checklist.md` for the full
  fence-by-fence audit)

---

## 7. THE GATE (all must hold)

A change is "done" only when: `typecheck`, `build`, and `test:web` all pass; the resolver shows the
intended value delta and nothing more; `contrast.test.ts` is green in both themes; the structural mount
checks pass; and no `--pi-*` value, security boundary, or guardrail fence changed.

---

## 8. CLAIMING FORMAT

### Correct
```
Resolved app-mobile/src/app.css (+ the changed component's scoped <style> block) before/after:
CHANGED=6 (all inside .model-sheet-overlay, matching the predicted blast radius), VANISHED=0,
ADDED=0. npm run typecheck/build/test:web all exit 0; contrast.test.ts green in light and dark.
Mount check at 390px: #root and #catalog-root
both populated, zero horizontal overflow, zero console errors.
```

### Incorrect
```
Looks correct in the code, should render fine.
```

---

## 9. RELATED RESOURCES

- [verification.md](../references/verification.md) — the full resolver method and command set
- [retint-recipes.md](../references/retint-recipes.md) — the worked recipes this checklist gates
- [guardrail-audit-checklist.md](guardrail-audit-checklist.md) — the fence-by-fence audit

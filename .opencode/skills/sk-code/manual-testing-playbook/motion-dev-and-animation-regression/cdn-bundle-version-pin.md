---
title: "MR-002: CDN Bundle Version Pin"
description: "Verify Motion CDN usage is version-pinned and the loaded exports match the documented API surface for the pinned version."
version: 3.5.0.4
---

# MR-002: CDN Bundle Version Pin

## 1. OVERVIEW

This scenario verifies that Motion CDN usage avoids `@latest` and uses an explicit version pin. The repo already has a pinned ESM usage pattern in `testimonial.js` (`motion@12.15.0/+esm`), while official Motion quick-start docs show CDN install options and advise replacing `latest` with a concrete version.

Reference: `https://motion.dev/docs/quick-start`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MR-002` and confirm the expected signals without rewriting production code.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| `MR-002` | CDN Bundle Version Pin | Prove Motion CDN imports use pinned versions and avoid `@latest` | `Audit Motion CDN URLs for @latest, record pinned versions, and verify animate, inView, scroll, and motionValue exports.` | `rg "motion@|dist/motion|cdn.jsdelivr.net/npm/motion" a_nobel_en_zn .opencode/skills/sk-code` -> create `/tmp/skc-MR002-version-pin.txt` -> run sandbox export probe against each pinned version | no production `motion@latest`; pinned URL found; export probe reports expected functions | `/tmp/skc-MR002-version-pin.txt`, `/tmp/skc-MR002-export-probe.txt` | PASS iff all production Motion CDN URLs are pinned and required exports exist for the pinned version | If `@latest` appears, classify path as docs/example vs production; if production, fail and file remediation |

## 3. TEST EXECUTION

### Prompt

```text
Audit Motion CDN URLs for @latest, record pinned versions, and verify animate, inView, scroll, and motionValue exports.
```

### Commands

1. Search production and sk-code playbook surfaces:
   ```bash
   rg -n "motion@|dist/motion|cdn.jsdelivr.net/npm/motion" a_nobel_en_zn .opencode/skills/sk-code/manual-testing-playbook > /tmp/skc-MR002-version-pin.txt
   ```
2. Confirm any `@latest` hit is documentation/example-only, not production runtime code.
3. For each production pinned ESM version, create a small browser or Node-compatible module probe that imports `animate`, `inView`, `scroll`, and `motionValue`.
4. Save probe output to `/tmp/skc-MR002-export-probe.txt`.

### Expected

- `a_nobel_en_zn/2_javascript/slider/testimonial.js` reports `https://cdn.jsdelivr.net/npm/motion@12.15.0/+esm`.
- No production runtime file uses `motion@latest`.
- Probe output records `animate`, `inView`, `scroll`, and `motionValue` as functions for the pinned ESM bundle used by the testimonial slider.

### Evidence

- `/tmp/skc-MR002-version-pin.txt`
- `/tmp/skc-MR002-export-probe.txt`
- One-line verdict listing each pinned version found.

### Pass / Fail

- **Pass**: all production Motion CDN URLs are pinned and the pinned bundle exposes the expected exports.
- **Fail**: any production runtime URL uses `@latest`, or a pinned bundle lacks exports required by the source file using it.

### Failure Triage

1. If `@latest` appears in docs, record it as documentation context and do not fail production.
2. If `@latest` appears in runtime code, fail and recommend pinning to the currently approved Motion version.
3. If an export is missing, compare the pinned version and import style against `https://motion.dev/docs/quick-start`.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../code-webflow/references/animation/quick-start.md` | Local Motion install and version-pin reference |
| `../../code-webflow/references/animation/integration-patterns.md` | Local CDN/global/ESM integration guidance |
| `../../code-webflow/assets/animation/install-card.md` | Local install card with pinned-version notes |
| `../../../../../a_nobel_en_zn/2_javascript/slider/testimonial.js` | Pinned ESM CDN import and required exports |
| `../../../../../a_nobel_en_zn/2_javascript/navigation/nav_dropdown.js` | `window.Motion.animate` runtime guard |
| `https://motion.dev/docs/quick-start` | Official CDN install and version-pin guidance |

---

## 5. SOURCE METADATA

- Group: Motion.dev And Animation Regression
- Playbook ID: MR-002
- Critical path: Yes
- Destructive: No
- Evidence paths: `/tmp/skc-MR002-version-pin.txt`, `/tmp/skc-MR002-export-probe.txt`
- Concurrent-safe: Yes
- Last validated: pending first manual run

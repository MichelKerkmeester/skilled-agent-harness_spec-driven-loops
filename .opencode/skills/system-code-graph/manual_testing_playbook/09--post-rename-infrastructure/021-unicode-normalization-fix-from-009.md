---
title: "021 unicode-normalization fix from packet 009"
description: "Verify the unicode-normalization.js module exists in the shared dist after the packet-009 tsconfig fix."
trigger_phrases:
  - "021"
  - "unicode normalization fix"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 021 unicode-normalization fix from packet 009

## 1. OVERVIEW

Verify the unicode-normalization.js module exists in the shared dist after the packet-009 tsconfig fix.

---

## 2. SCENARIO CONTRACT

- Objective: Verify that `dist/system-spec-kit/shared/unicode-normalization.js` exists in the code-graph skill's dist directory, confirming the packet-009 tsconfig fix produces the shared module.
- Real user request: `Confirm unicode-normalization.js exists in the code-graph dist after the tsconfig path mapping fix.`
- Operator prompt: `Check the shared module path. Show file existence, then return PASS/FAIL.`
- Expected execution process: Check `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/unicode-normalization.js` exists.
- Expected signals: The file exists and is non-empty. The `.js.map` and `.d.ts` siblings also exist.
- Desired user-visible outcome: A concise verdict confirming the 009 fix is in place.
- Pass/fail: PASS if unicode-normalization.js exists in dist. FAIL if it is missing.

---

## 3. TEST EXECUTION

### Commands

1. Check `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/unicode-normalization.js` exists.
2. Verify sibling files (`.d.ts`, `.js.map`, `.d.ts.map`) also exist.

### Expected Output / Verification

unicode-normalization.js and its sibling type/source map files exist.

### Cleanup

None.

### Variant Scenarios

Import the module in Node to verify it loads without error.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Post-Rename Infrastructure
- Playbook ID: 021
- Canonical root source: `manual_testing_playbook.md`
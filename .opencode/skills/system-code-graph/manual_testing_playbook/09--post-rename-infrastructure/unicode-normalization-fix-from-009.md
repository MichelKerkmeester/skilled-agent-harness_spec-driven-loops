---
title: "021 root dist cleanup verification"
description: "Verify the code-graph build no longer emits sibling skill artifacts into root-level dist."
trigger_phrases:
  - "021"
  - "root dist cleanup"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.2
---
# 021 root dist cleanup verification

## 1. OVERVIEW

Verify the code-graph build emits only direct runtime files under `mcp_server/dist/` and does not recreate root-level sibling skill artifacts.

---

## 2. SCENARIO CONTRACT

- Objective: Verify that root-level `dist/` is absent after a clean code-graph build.
- Real user request: `Confirm the code-graph build does not recreate sibling dist folders.`
- Operator prompt: `Run the clean build check. Show direct entrypoint existence and root dist absence, then return PASS/FAIL.`
- Expected execution process: Run `npm --prefix .opencode/skills/system-code-graph run clean && npm --prefix .opencode/skills/system-code-graph run build`, then check `.opencode/skills/system-code-graph/mcp_server/dist/index.js` exists and `.opencode/skills/system-code-graph/dist/` is absent.
- Expected signals: Direct entrypoint exists. Root-level dist does not exist.
- Desired user-visible outcome: A concise verdict confirming stale sibling dist output is gone.
- Pass/fail: PASS if direct entrypoint exists and root-level dist is absent. FAIL if root-level dist exists.

---

## 3. TEST EXECUTION

### Commands

1. Run `npm --prefix .opencode/skills/system-code-graph run clean && npm --prefix .opencode/skills/system-code-graph run build`.
2. Check `.opencode/skills/system-code-graph/mcp_server/dist/index.js` exists.
3. Check `.opencode/skills/system-code-graph/dist/` is absent.

### Expected Output / Verification

Direct entrypoint exists. Root-level dist is absent.

### Cleanup

None.

### Variant Scenarios

Import `mcp_server/dist/tool-schemas.js` in Node to verify the direct build output loads.

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

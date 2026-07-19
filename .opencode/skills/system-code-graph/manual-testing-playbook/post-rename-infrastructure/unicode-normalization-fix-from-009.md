---
title: "021 root dist cleanup verification"
description: "Verify the code-graph build no longer emits sibling skill artifacts into root-level dist."
trigger_phrases:
  - "021"
  - "root dist cleanup"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.2
id: unicode-normalization-fix-from-009
category: post_rename_infrastructure
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual-testing-playbook/post-rename-infrastructure/unicode-normalization-fix-from-009.md
---
# 021 root dist cleanup verification

Prompt: Confirm the code-graph clean build does not recreate sibling dist folders and verify root dist absence.

## 1. OVERVIEW

Verify the code-graph build emits only direct runtime files under `mcp-server/dist/` and does not recreate root-level sibling skill artifacts.

---

## 2. SCENARIO CONTRACT

- Objective: Verify that root-level `dist/` is absent after a clean code-graph build.
- Real user request: `Confirm the code-graph build does not recreate sibling dist folders.`
- Operator prompt: `Run the clean build check. Show direct entrypoint existence and root dist absence, then return PASS/FAIL.`
- Expected execution process: Run `npm --prefix .opencode/skills/system-code-graph run clean && npm --prefix .opencode/skills/system-code-graph run build`, then check `.opencode/skills/system-code-graph/mcp-server/dist/index.js` exists and `.opencode/skills/system-code-graph/dist/` is absent.
- Expected signals: Direct entrypoint exists. Root-level dist does not exist.
- Desired user-visible outcome: A concise verdict confirming stale sibling dist output is gone.
- Pass/fail: PASS if direct entrypoint exists and root-level dist is absent. FAIL if root-level dist exists.

---

## 3. TEST EXECUTION

### Commands

1. Run `npm --prefix .opencode/skills/system-code-graph run clean && npm --prefix .opencode/skills/system-code-graph run build`.
2. Check `.opencode/skills/system-code-graph/mcp-server/dist/index.js` exists.
3. Check `.opencode/skills/system-code-graph/dist/` is absent.

### Expected Output / Verification

Direct entrypoint exists. Root-level dist is absent.

### Cleanup

None.

### Variant Scenarios

Import `mcp-server/dist/tool-schemas.js` in Node to verify the direct build output loads.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual-testing-playbook.md` | Root playbook index |
| `../../feature-catalog/feature-catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Post-Rename Infrastructure
- Playbook ID: 021
- Canonical root source: `manual-testing-playbook.md`

---

## 6. Evidence

Command: `npm --prefix .opencode/skills/system-code-graph run clean && npm --prefix .opencode/skills/system-code-graph run build`

```text
> @spec-kit/system-code-graph@1.0.0 clean
> rm -rf dist mcp-server/dist


> @spec-kit/system-code-graph@1.0.0 build
> tsc --build tsconfig.json
```

Command: `test -f .opencode/skills/system-code-graph/mcp-server/dist/index.js && printf '.opencode/skills/system-code-graph/mcp-server/dist/index.js exists\n' || printf '.opencode/skills/system-code-graph/mcp-server/dist/index.js missing\n'`

```text
.opencode/skills/system-code-graph/mcp-server/dist/index.js exists
```

Command: `test ! -d .opencode/skills/system-code-graph/dist && printf '.opencode/skills/system-code-graph/dist absent\n' || printf '.opencode/skills/system-code-graph/dist exists\n'`

```text
.opencode/skills/system-code-graph/dist absent
```

---

## 7. Pass/Fail

PASS

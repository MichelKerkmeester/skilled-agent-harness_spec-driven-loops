---
title: "020 TypeScript build and entry point"
description: "Verify the compiled dist files exist and the code-graph MCP server can load its schema module after a fresh build."
trigger_phrases:
  - "020"
  - "typescript build and entry point"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.3
id: typescript-build-and-entry-point
category: post_rename_infrastructure
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources:
  - workflow_mode: system-code-graph
    leaf_resource_id: manual_testing_playbook/post_rename_infrastructure/typescript_build_and_entry_point.md
---
# 020 TypeScript build and entry point

Prompt: Confirm that the code-graph server dist is built and the entry point exists, and that the tool-schemas module loads.

## 1. OVERVIEW

Verify the compiled dist files exist and the code-graph MCP server can load its schema module after a fresh build.

---

## 2. SCENARIO CONTRACT

- Objective: Verify that TypeScript compilation produces dist files and the schema module loads without error.
- Real user request: `Confirm that the code-graph server dist is built, the entry point exists, and tool-schemas module loads.`
- Operator prompt: `Run the build check. Show entry point existence and module loading result, then return PASS/FAIL.`
- Expected execution process: Check `.opencode/skills/system-code-graph/mcp_server/dist/index.js` exists, check root-level `.opencode/skills/system-code-graph/dist/` is absent, verify tool-schemas.js loads.
- Expected signals: Direct entry point exists. Root-level dist is absent. The tool-schemas.js module loads without error. The launcher can start and respond to tools/list with 8 tools.
- Desired user-visible outcome: A concise verdict confirming the compiled artifacts are present and loadable.
- Pass/fail: PASS if direct entry point exists, root-level dist is absent and schema module loads. FAIL if entry point is missing, root-level dist exists or module load throws.

---

## 3. TEST EXECUTION

### Commands

1. Check `.opencode/skills/system-code-graph/mcp_server/dist/index.js` exists.
2. Check `.opencode/skills/system-code-graph/dist/` is absent.
3. Run `node -e "import('./mcp_server/dist/tool-schemas.js')"` from the skill root and verify no error.
4. Verify launcher responds to tools/list with 8 tools.

### Expected Output / Verification

Direct entry point exists. Root-level dist is absent. Schema module loads without error. Launcher tools/list returns 8 tools.

### Cleanup

None.

### Variant Scenarios

Run `npx tsc --noEmit` and check for blocking type errors only (not module resolution warnings from sibling skills).

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Post-Rename Infrastructure
- Playbook ID: 020
- Canonical root source: `manual_testing_playbook.md`

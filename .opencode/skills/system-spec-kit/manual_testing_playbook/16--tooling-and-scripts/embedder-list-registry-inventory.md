---
title: "281 -- Embedder list registry inventory"
description: "Validates embedder_list reports supported embedders, dimensions, provider tags, and active status."
audited_post_017: true
version: 3.6.0.1
---

# 281 -- Embedder list registry inventory

## 1. OVERVIEW

This scenario covers the new embedder inventory MCP surface from packet 016/003.

---

## 2. SCENARIO CONTRACT

- Objective: Validate embedder_list happy path and registry shape.
- Real user request: `List the available mk-spec-memory embedders and tell me which one is active.`
- RCAF Prompt: `Run embedder_list and verify each embedder entry includes name, dimensions, provider, and active/install status.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - At least one embedder is listed. - One active embedder is identifiable. - Dimension/provider metadata is present for every entry.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run embedder_list and verify each embedder entry includes name, dimensions, provider, and active/install status.
```

### Commands

1. `embedder_list({})`
2. Verify every returned entry includes `name`, `dimensions`, `provider`, and `status`/`active` fields.
3. Confirm exactly one active embedder is reported.

### Expected Output / Verification

- At least one embedder is listed.
- One active embedder is identifiable.
- Dimension/provider metadata is present for every entry.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-list.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 281
- Tool: `embedder_list`

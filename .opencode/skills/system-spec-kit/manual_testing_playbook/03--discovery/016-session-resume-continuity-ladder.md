---
title: "016 -- Session resume continuity ladder"
description: "Validates session_resume follows handover, continuity frontmatter, and canonical spec docs in order."
audited_post_017: true
---

# 016 -- Session resume continuity ladder

## 1. OVERVIEW

This scenario turns the resume ladder into a deterministic operator test with one existing spec folder as fixture input.

---

## 2. SCENARIO CONTRACT

- Objective: Validate session_resume returns continuity in the documented priority order.
- Real user request: `Validate session_resume against a known spec folder and confirm the continuity ladder is respected.`
- RCAF Prompt: `Run session_resume for a known spec folder and verify handover/continuity/spec-doc ordering in the response.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Resume response identifies the target folder. - Phase-parent handling is explicit. - Recovery source ordering is visible and does not silently skip child continuity.
- Desired user-visible outcome: A concise PASS/PARTIAL/FAIL verdict with cited evidence.
- Pass/fail: PASS if all expected signals are present; PARTIAL if the happy path works but an edge signal is missing; FAIL if the tool errors unexpectedly or omits required evidence.

---

## 3. TEST EXECUTION

### Prompt

```
Run session_resume for a known spec folder and verify handover/continuity/spec-doc ordering in the response.
```

### Commands

1. `session_resume({ specFolder: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture" })`
2. Check for phase-parent redirect/listing behavior.
3. Check that returned context cites child continuity before broad parent history.

### Expected Output / Verification

- Resume response identifies the target folder.
- Phase-parent handling is explicit.
- Recovery source ordering is visible and does not silently skip child continuity.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- `.opencode/skills/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md`

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: 016
- Tool: `session_resume`

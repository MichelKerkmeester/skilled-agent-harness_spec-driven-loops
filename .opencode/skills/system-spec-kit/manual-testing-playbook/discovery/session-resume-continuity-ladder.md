---
title: "016 -- Session resume continuity ladder"
description: "Validates session_resume follows handover, continuity frontmatter, and canonical spec docs in order."
audited_post_017: true
version: 3.6.0.3
id: discovery-session-resume-continuity-ladder
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 016 -- Session resume continuity ladder

## 1. OVERVIEW

This scenario turns the resume ladder into a deterministic operator test with one existing spec folder as fixture input.

---

## 2. SCENARIO CONTRACT

- Objective: Validate session_resume returns continuity in the documented priority order.
- Real user request: `Validate session_resume against a known spec folder and confirm the continuity ladder is respected.`
- Operator prompt: `Run session_resume for a known spec folder and verify handover/continuity/spec-doc ordering in the response.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Resume response identifies the target folder. - Phase-parent handling is explicit. - Recovery source ordering is visible and does not silently skip child continuity.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

---

## 3. TEST EXECUTION

### Prompt

```
Run session_resume for a known spec folder and verify handover/continuity/spec-doc ordering in the response.
```

### Commands

1. `session_resume({ specFolder: "<spec-folder>" })`
2. Check for phase-parent redirect/listing behavior.
3. Check that returned context cites child continuity before broad parent history.

### Expected Output / Verification

- Resume response identifies the target folder.
- Phase-parent handling is explicit.
- Recovery source ordering is visible and does not silently skip child continuity.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the handler or script listed in section 4 is the one actually loaded, and that any compiled output under `dist/` is current for it.
3. Compare the observed response field by field against the Expected block, and quote the first field that disagrees.


### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- `.opencode/skills/system-spec-kit/mcp-server/handlers/session-resume.ts`
- `.opencode/skills/system-spec-kit/references/workflows/quick-reference.md`

---

## 5. SOURCE METADATA

- Group: Discovery
- Playbook ID: 016
- Tool: `session_resume`

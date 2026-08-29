---
title: "278 -- Governed ingest cancel lifecycle"
description: "Validates memory_ingest_start/status/cancel with a tiny deterministic fixture folder."
audited_post_017: true
version: 3.6.0.1
id: governance-governed-ingest-cancel-lifecycle
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 278 -- Governed ingest cancel lifecycle

## 1. OVERVIEW

Existing ingest scenarios focus on async lifecycle broadly; this one pins the cancel edge to a tiny operator-safe fixture.

---

## 2. SCENARIO CONTRACT

- Objective: Validate ingest cancellation and status transition.
- Real user request: `Start a tiny ingest job, cancel it, and prove status reflects cancellation.`
- Operator prompt: `Run memory_ingest_start/status/cancel against a tiny fixture path and verify cancellation state.`
- Expected execution process: Run the documented commands, capture output, compare against the expected signals, and return a cited verdict.
- Expected signals: - Start returns a job ID. - Cancel acknowledges the same job ID. - Final status is canceled or terminal with explicit cancellation evidence.
- Desired user-visible outcome: A concise PASS or FAIL verdict with cited evidence.
- Pass/fail: PASS only if every expected signal is present; FAIL if the tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

---

## 3. TEST EXECUTION

### Prompt

```
Run memory_ingest_start/status/cancel against a tiny fixture path and verify cancellation state.
```

### Commands

1. Create a temporary folder under `/tmp/playbook-017-ingest` with one markdown file.
2. `memory_ingest_start({ paths: ["/tmp/playbook-017-ingest"], dryRun: false })`
3. `memory_ingest_status({ jobId: "<returned jobId>" })`
4. `memory_ingest_cancel({ jobId: "<returned jobId>" })`
5. `memory_ingest_status({ jobId: "<returned jobId>" })`

### Expected Output / Verification

- Start returns a job ID.
- Cancel acknowledges the same job ID.
- Final status is canceled or terminal with explicit cancellation evidence.

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


### Pass / Fail

- **Pass**: Every expected signal in the Scenario Contract is present in the captured output.
- **Fail**: The tool errors unexpectedly, omits required evidence, or the happy path works while any edge signal is missing.

### Cleanup

No persistent cleanup is required unless the command writes a temporary fixture path; remove only that temporary path.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts`

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 278
- Tools: `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`

---
title: "Implementation Summary: Phase 1: fanout-persona-tool-mapping"
description: "Three read-only Codex runs with the persona block the fan-out runner inlines all read their file with no tool-mapping line, so the runner was not changed and the decision is recorded."
trigger_phrases:
  - "fanout persona tool mapping implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping"
    last_updated_at: "2026-11-14T16:32:29Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 1 on the decision no-change after three clean Codex reads"
    next_safe_action: "Review the recorded decision and reopen only on a FILES READ none report"
    packet_purpose: "Purpose: The fan-out runner carries a tool-mapping line for Codex only if a live run shows a Codex child needs one, and the answer is recorded either way."
    blockers: []
    key_files:
      - "specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping/scratch/decision.md"
    session_dedup:
      fingerprint: "sha256:4714d758af051f2dbd4eaadaf15e22f23fe3cf06d82d0ee1cebf5928a4c4d513"
      session_id: "scaffold-001-fanout-persona-tool-mapping"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3eadb8bc-945b-4a2e-8183-a55e83f9e728"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T16:32:29Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-fanout-persona-tool-mapping |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing under `.skilled/` changed in this phase. The finding was that the fan-out runner inlines an agent persona for a Codex lineage with no tool-mapping line. Three live runs showed a Codex child reads its file without one, so the phase closes on a recorded decision: `no-change`.

### Phase 1: fanout-persona-tool-mapping

The predecessor packet saw a Codex child read nothing when its persona denied Bash. The fan-out runner inlines only `deep-research` or `deep-review`, and both allow Bash. The probe used the runner's own `withAgentPersona` function, so each child received the same block a real lineage gets. All three children used their shell for the read without being told to.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/baseline.txt` | Created | The measured behavior, the Codex version and login, the dispatch flags and the test baseline |
| `scratch/codex-probe-prompt.txt` | Created | The probe prompt: the child-dispatch preamble, the `deep-research` persona block and one read task |
| `scratch/codex-run-1.txt`, `scratch/codex-run-2.txt`, `scratch/codex-run-3.txt` | Created | The final message of each run |
| `scratch/decision.md` | Created | The decision, its evidence and the limits of that evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session read the Codex dispatch rules, built the prompt and ran the three probes itself through `codex exec` on `gpt-6-luna` at medium on the fast tier with `--sandbox read-only`. It read each result from the report file, not from the exit status. No executor was dispatched for an edit, because the decision selected no edit. The two test files that read the persona block were run before the probes and again from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `no-change` to the fan-out runner | All three runs ended `FILES READ: .skilled/agents/README.txt`. The cause of the earlier failure, a persona that denies Bash, is absent from the two personas the runner inlines |
| The probe is one read task, not a full lineage | The question was whether the child uses its shell for a named read. A full lineage would have written files and cost more without testing anything further |
| The Codex rule's literal text was never a candidate | It ends `Run no other command`, and a lineage has to write its iteration files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three probe reports, `tail -1` of each | `FILES READ: .skilled/agents/README.txt` three times. All three exited 0, which decided nothing |
| `rg -c '^decision: ' scratch/decision.md` | 1 |
| `npx vitest run tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` | 191 passed before, 191 passed from the final state, exit 0 both times |
| `rg -c -i 'tool mapping'` on `fanout-run.cjs` | Prints no line, the same as before, as the spec requires for `no-change` |
| `git diff --stat main -- .skilled/skills/system-deep-loop` | Prints nothing |
| Strict validation of this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three runs are a sample.** They show a Codex child reads on codex-cli 0.169.0. The predecessor's failure was seen once on 0.167.2, and nothing here proves it cannot recur.
2. **Only `deep-research` was probed.** `deep-review` carries the same `bash: allow` line and was not run.
3. **The probe is not a full lineage.** A research lineage runs many steps under the same persona. Only the first read was tested.
4. **A later `FILES READ: none` reopens the finding.** The `add-line` branch in `tasks.md` is the fix to apply then.
<!-- /ANCHOR:limitations -->

---

---
title: "Goal: CLI Lineage Nesting and Containment Guard"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/040-cli-lineage-nesting-and-containment-guard"
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All streams landed and committed"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: CLI Lineage Nesting and Containment Guard

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a CLI fan-out lineage run its iterations in-process and make write containment recoverable and correct under concurrent runs, so the deep-loop runtime never again burns a run on nested dispatch or erases an operator edit.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fix the prompt, the workflow YAML and the recursion guard together; prose alone is not enforcement |
| D2 | A refused nested dispatch happens before any spawn and before any receipt is written |
| D3 | Containment keeps its fail-closed revert and saves the reverted diff as a git-applicable patch |
| D4 | Another run in a sibling phase is exempt from attribution only while its loop lock is live |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `validate.sh --strict` over this packet exits 0
- [ ] Every acceptance row is Met with observed evidence
- [ ] A cli-codex lineage prompt states in-process execution and both auto YAMLs refuse nested codex before spawn
- [ ] A reverted tracked edit is restored by `git apply` from the saved patch in a test
- [ ] Two lineages with live locks in sibling phases report zero containment violations against each other
- [ ] The whole runtime suite passes with zero failures on the committed state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Four fix streams plus concurrent-run attribution | Done | commits `2c2687e260` and `54e65e115a` on branches/017-memory-decommission |
| Whole runtime suite | Done | 153 files, 2531 tests passed, 0 failed |
| Packet validation | Done | validate --strict 0 errors, AC-001 to AC-010 Met |

### Deviations and findings

| Item | Note |
|------|------|
| Sibling-phase exemption added after the first close-out | Both research drivers were rejected on each other's files; the fix narrows attribution before any revert rather than widening the advisory set |
<!-- /ANCHOR:log -->

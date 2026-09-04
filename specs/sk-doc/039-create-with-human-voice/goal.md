---
title: "Goal: Create With Human Voice"
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
    packet_pointer: "sk-doc/039-create-with-human-voice"
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the parent directive and its phase binding"
    next_safe_action: "Execute phase 001 against its own completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "039-create-with-human-voice-goal"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Goal: Create With Human Voice

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short. The
> runtime goal surfaces cap what they will hold, and a truncated objective loses
> its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give `sk-doc` a mode that applies the Human Voice Rules rather than describing them, and make it reachable and its scan trustworthy.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `hvr-rules.md` stays where it is, and no part of it is copied into the mode packet |
| D2 | The scanner derives every term from the standard at run time and fails closed rather than reporting a clean scan it did not perform |
| D3 | One scoring system survives. The point arithmetic is what a run reports, and the category weights are not a second arithmetic |
| D4 | `SKILL.md` is compiled-policy input, so text prepared against it is applied as a single named replacement |
| D5 | Hub routing files belong to the hub. A reachability gap is recorded here and fixed there |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-utilization-review | `001-utilization-review/goal.md` |

**Precedence.** Decisions above outrank child detail, and child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `validate.sh --strict` over this packet and its phase prints `RESULT: PASSED` with `Errors: 0` for each folder
- [ ] Every phase reports its own completion criteria closeable
- [ ] `parent-skill-check` on `.opencode/skills/sk-doc` is green with zero warnings
- [ ] `hvr_scan.py` exits 0 on every document the mode packet ships
- [ ] One scoring system is stated across the standard, the reference and the scanner
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
| The mode packet ships | Done | `.opencode/skills/sk-doc/sk-create-with-human-voice/` carries `SKILL.md`, `README.md`, three references, one asset, the scanner and a nine-scenario playbook |
| 001 utilization review | Done | `validate.sh --strict` on the phase prints `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`. Committed as `f92c84a673` and `710f2171d6`, both 2026-09-02 |
| Findings from 001 | Pending | Ten items re-checked open on 2026-09-02 and listed with evidence in `001-utilization-review/goal.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The parent validates at level `phase`, its `spec.md` declares Level 2 | The validator resolves the folder as a phase parent because it has a child, so the binding block above is the right shape. No document was changed to make that true |
<!-- /ANCHOR:log -->

---
title: "Goal: Support git-ignored local-* commands in every runtime"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "local command support goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/069-local-command-support"
    last_updated_at: "2026-10-26T22:10:00Z"
    last_updated_by: "leaf-worker"
    recent_action: "Landed and verified local-* command support"
    next_safe_action: "None: packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-doc-069-local-command-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Support git-ignored local-* commands in every runtime

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Let an operator keep a private `local-*` command that reaches every runtime and can never be committed by accident.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The support is generic: every rule and pattern names `local-*`, never a specific command |
| D2 | Commands follow the `local-*` skill precedent: ignore rules, a catalog skip and a blocking pre-commit guard with no bypass variable |
| D3 | The mirror generators stay unchanged; the ignore rules cover what they write |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] The catalog tests print `pass 13` and `fail 0`
- [x] The hook harness prints `pre-commit gates: 145 passed, 0 failed`
- [x] With a local command present, the catalog check and all twelve mirror checks exit 0
- [x] `git check-ignore -v --no-index` matches all eight `local-probe` paths
- [x] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Ignore rules | Done | `.gitignore:250` to `:256` match the eight probe paths |
| Catalog skip | Done | `pass 13`, `fail 0`; `fail 1` against `HEAD` |
| Pre-commit guard | Done | `145 passed, 0 failed`; `136 passed, 9 failed` against `HEAD` |
| Mirrors with a local command present | Done | twelve checks exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Packet renamed and narrowed | The packet first also documented a specific private command; on operator decision it now covers only the generic support, and the command's own material lives in its ignored folder |
<!-- /ANCHOR:log -->

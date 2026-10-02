---
title: "Goal: Align SECURITY.md with sk-doc and expand it"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/063-security-policy-alignment"
    last_updated_at: "2026-10-02T10:42:03Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "SECURITY.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "13974574-59f7-48b5-b4cd-aa93ca9ca737"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Align SECURITY.md with sk-doc and expand it

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make SECURITY.md pass the sk-doc README standard and expand it so reporters know what to send and users know what Skilled runs on their machine, using only facts the repository states.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The reporting channel, the acknowledgement paragraph, the supported-versions line and the two scope paragraphs keep the operator's wording. |
| D2 | SECURITY.md follows the sk-doc README rule set: OVERVIEW first, RELATED last, numbered uppercase H2 headings with emoji and `---` dividers. |
| D3 | Every new factual sentence names a file, command or setting that exists in the repository. No response time, bounty, CVE process or contact address is added. |
| D4 | Outside this packet, only SECURITY.md and the sk-doc track root `graph-metadata.json` change. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py SECURITY.md` exits 0
- [x] `python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py SECURITY.md` reports a DQI total of at least 86
- [x] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py SECURITY.md` reports 0 hard blockers, and SECURITY.md holds no em dash or semicolon
- [x] `git diff b0f89ee5f0 -- SECURITY.md` removes only the four renumbered H2 headings and the first reporter bullet
- [x] `grep -Ein "bounty|CVE-|business days|security@" SECURITY.md` prints nothing
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/063-security-policy-alignment --strict` prints `RESULT: PASSED`
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
| SECURITY.md rewrite | Done | validator exit 0, DQI 99, HVR 0 hard blockers |
| Packet docs | Done | spec.md, plan.md, tasks.md, implementation-summary.md |

### Deviations and findings

| Item | Note |
|------|------|
| Level | `recommend-level.sh --loc 150 --files 1` recommended Level 0, and `create.sh` starts at Level 1, so the packet is Level 1 |
| Track root | `create.sh` added this packet to `specs/sk-doc/graph-metadata.json`, so it ships in the same commit |
<!-- /ANCHOR:log -->

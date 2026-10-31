---
title: "Implementation Summary"
description: "/doctor:skill-advisor and /doctor:mcp now stop for their required target like /doctor:git, and the structure extractor no longer tells commands to use the array form the command template rejects."
trigger_phrases:
  - "doctor router gates summary"
  - "extractor command allowed-tools fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/010-doctor-router-gates"
    last_updated_at: "2026-10-04T10:30:00Z"
    last_updated_by: "doctor-router-gates"
    recent_action: "Added the input gate to two doctor routers and exempted commands from the extractor's array rule"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/skill-advisor.md"
      - ".skilled/commands/doctor/mcp.md"
      - ".skilled/skills/sk-doc/shared/scripts/extract_structure.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-router-gates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-doctor-router-gates |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every doctor router that needs a target now stops and asks for it instead of guessing, and the structure extractor no longer contradicts the command template.

### Phase 10: doctor-router-gates

`/doctor:skill-advisor` and `/doctor:mcp` carry the same mandatory input gate as `/doctor:git`. With no target in the arguments, each shows its presentation's menu and waits, and neither infers a target from the conversation or the repository. The extractor now receives the document type it already detects, and reports the array-format `allowed-tools` issue for skills only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/skill-advisor.md` | Modified | Input gate; the binding step takes the target from it |
| `.skilled/commands/doctor/mcp.md` | Modified | Input gate; the binding step takes the sub-action from it |
| `.skilled/skills/sk-doc/shared/scripts/extract_structure.py` | Modified | Commands exempt from the array-format rule |
| `.skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py` | Modified | One case for skills and commands |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

These were the open items left by the phase 009 alignment pass. The new regression case failed against a copy of the extractor without the exemption before it was accepted. The routers were checked with the shared validators and the doctor suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No gate for `/doctor:env` or `/doctor:update` | Their angle-bracket values sit inside optional brackets, and the template gates only a required argument |
| Exempt commands rather than drop the rule | Skills use the array form, so the rule stays right for them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Extractor regression suite | 3 passed; the new case failed (1 failed, 2 passed) with the exemption removed |
| `validate_document.py --type command` | 0 issues for `skill-advisor.md` and `mcp.md`; no frontmatter issue from `extract_structure.py` |
| `route-validate.sh` | 11 routes, exit 0 |
| Router generator, mirrors, route guard | 35 of 35 clean; 181 mirrors and 37 prompts per runtime in sync; guard exit 0 |
| Doctor `run-all.sh` | 7 suites, node:test 219 of 219 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The interactive gates have no automated run.** The validators check structure, not that an agent stops at the gate.
<!-- /ANCHOR:limitations -->

---

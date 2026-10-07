---
title: "Implementation Summary: Review and hardening research for the series parent rule"
description: "A 3-iteration deep review found the Phase 6 code sound but four rule-doc defects, and a 10-iteration deep research run ranked ten ways to make grouping related work the default at the moment an agent picks a folder."
trigger_phrases:
  - "series parent review verdict"
  - "series parent hardening recommendations"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research"
    last_updated_at: "2026-10-07T08:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Both deep loops finished; review-report.md and research.md written and cited"
    next_safe_action: "Pick the next build phase from research.md section 13"
    blockers: []
    key_files:
      - "review/review-report.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:fe91bb0d3837409af5362c6dc898de37dd7f9786b37d299129aa11894f2a2f44"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is the Phase 6 work correct? Code yes, rule docs CONDITIONAL with 4 P1"
      - "How to harden the rule and make grouping the default? Ten ranked recommendations in research.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Review and hardening research for the series parent rule

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-series-parent-review-and-hardening-research |
| **Completed** | 2026-10-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Phase 6 code works. The rule it ships does not yet reach the moment an agent picks a folder. The review found no defect in `create.sh` or the judge, and four P1 gaps in the rule docs. The research traced why related singletons still get created and ranked ten fixes.

### Phase 7: series-parent-review-and-hardening-research

The review returned CONDITIONAL with 0 P0, 4 P1 and 8 P2 findings. The series-parent recipe in `phase-definitions.md` does not run as written. Three restatements of the phase thresholds and one stale "Option E" label survived because Phase 6 checked only the docs it edited.

The research found that the series-parent clause lives in `AGENTS.md`, but the runtime Gate 3 menu, the Pi dialog and both speckit confirmations do not carry it. The recent-packets listing prints after the folder exists. The four required fixes all move evidence to the decision point. Five supporting fixes keep that evidence trustworthy.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `review/` | Created | Review state, 3 iterations and `review-report.md` |
| `research/` | Created | Research state, 10 iterations, `research.md` and `resource-map.md` |
| `spec.md`, `plan.md`, `tasks.md` | Created | Packet docs, with the generated findings fence in `spec.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both loops ran in parallel through cli-pi on `opencode-go/deepseek-v4.1-flash` at thinking max, one fresh process per iteration, with `stopPolicy: max-iterations`. Every iteration passed `verify-iteration.cjs`. The orchestrator re-opened every review citation, and a separate synthesis pass opened all 291 unique research citations and corrected 13.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Single-executor dispatch per iteration, not fan-out | Fresh context per iteration, and fan-out runs the whole loop in one process |
| Recommend changing what the agent sees, never letting a tool choose | `quick-reference.md` forbids autonomous selection of a Gate 3 option |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Review state log | 3 iteration records, stop reason `maxIterationsReached` |
| Research state log | 10 iteration records, 7 of 7 questions answered, `synthesis_complete` recorded |
| Targeted post-synthesis validation | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model family.** The review, the research and the Phase 6 build all ran on DeepSeek. The orchestrator's citation checks are the only second lens.
2. **Reasoning effort is dropped for non-pinned cli-pi models.** The workflow's `if_cli_pi` lineage omits `reasoningEffort`, so a model like Luna would run at Pi's default.
3. **The committed trigger index is stale for this packet** until it is regenerated.
<!-- /ANCHOR:limitations -->

---

---
title: "Implementation Summary"
description: "12 docs of the .skilled/skills/cli-external-orchestration/cli-hermes mode audited and refined: 33 findings, 4 review round(s), gate files=12 render_warnings=0 invalid=0."
trigger_phrases:
  - "cli hermes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/002-cli-external-orchestration/006-cli-hermes"
    last_updated_at: "2026-11-04T07:16:24Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Audited, fixed and reviewed 12 docs"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
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
| **Spec Folder** | 006-cli-hermes |
| **Completed** | 2026-11-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 12 in-scope docs of the `.skilled/skills/cli-external-orchestration/cli-hermes` mode now follow their sk-doc templates and the parent rubric. The DeepSeek max audit listed 33 defects (5 P1), DeepSeek applied them, and the review re-read the diff until it passed.

### 006-cli-hermes

Findings are in `scratch/findings.md`, each round's diff in `scratch/diff-N.patch` and its review in `scratch/review-N.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-hermes/README.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/ROUTER.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/assets/prompt-quality-card.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/assets/prompt-templates.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/hermes-tools.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/mcp-policy.md` | Modify | Readability, layout and structure |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md` | Modify | Readability, layout and structure |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`run-leaf-v3.sh` ran the scope, the gate, the DeepSeek max audit, the DeepSeek high fix and the review rounds. `scratch/run.log` records each step with its exit.

The run ended after three rounds without a pass. By hand, the README's structure tree gained the root `hard-rules.json`, which the shared dispatch rule engine reads beside `SKILL.md`, and the router's prerequisite probe moved from a tilde fence to a backtick fence with its three lines unchanged, so the render check reads it as code. Both blocks are listed in `scratch/approved-blocks.md`, so the code-block guard keeps them. The agent-delegation reference's section 3A became 4, with 4 to 6 moving to 5 to 7; no file cites those numbers. A repair review followed.

The pre-commit review flagged the evidence-base note: the contract pin now exists, so HEAD's "await the pin" was stale, and the note now says the pin moved the claims it tested to observed while those still marked source-read stay unconfirmed until a live run records them, as the pin's summary states.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two model families per leaf | The model that writes a fix is not the one that judges it |
| Inbound-linked headings frozen | Other files link to them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scope gate before | `files=12 render_warnings=2 invalid=0` |
| Scope gate after | `files=12 render_warnings=0 invalid=0` |
| Review 1 | VERDICT: FIX |
| Review 2 | VERDICT: FIX |
| Review 3 | VERDICT: FIX |
| Review 4 | VERDICT: PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A review round judges one diff at a time.** A defect neither model saw stays; the render checks cover the mechanical classes.
<!-- /ANCHOR:limitations -->

---

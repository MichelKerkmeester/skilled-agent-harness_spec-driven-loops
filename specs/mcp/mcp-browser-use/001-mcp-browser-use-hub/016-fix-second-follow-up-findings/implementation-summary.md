---
title: "Implementation Summary"
description: "Mixed id and alias prompts keep both modes, Aside prose routes to Aside, every Aside install surface uses the pinned wrapper and the front door takes the task on stdin."
trigger_phrases:
  - "fix second follow up findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/016-fix-second-follow-up-findings"
    last_updated_at: "2026-11-24T09:36:46Z"
    last_updated_by: "template-author"
    recent_action: "Built and verified every phase 016 fix"
    next_safe_action: "Decide the fleet-wide front-door callout change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-fix-second-follow-up-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-fix-second-follow-up-findings |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt that names one browser mode by its id and another by its short name now routes both. An Aside request in plain prose reaches Aside, every Aside install path runs the digest-checked wrapper, and the hub tells agents to pass the task on stdin.

### Phase 16: fix-second-follow-up-findings

The generation-4 review returned FAIL on its coverage gate, with no P0. Checked against source, five of its P1 findings held and one was refuted.

- **Router.** A full id such as `mcp-chrome-devtools` also contains the alias `chrome devtools`, so it counted twice and pushed the other mode out of the ambiguity window. `scoreModes` now drops a match contained in a longer match. This is the cause the 015 alias fix only worked around.
- **Aside.** `in aside` joins the vocabulary. Seven docs and the doctor hint now point at `scripts/install.sh` in place of the vendor pipe.
- **Front door.** The hub `SKILL.md` and playbook pass the task through a quoted heredoc to `--prompt-stdin`.
- **Chrome.** The bdg Node fix installs Node 20.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` and archive copy | Modified | Contained-match rule |
| `.../fixtures/canary-cases.v1.json` and archive copy | Modified | Two new cases |
| Hub `hub-router.json`, `ROUTER.md`, `graph-metadata.json` | Modified | `in aside` and regenerated signals |
| Seven Aside docs, `scripts/doctor.sh` | Modified | Install through the wrapper |
| Hub `SKILL.md`, hub playbook | Modified | Stdin heredoc; Smart Routing back under 180 words |
| `mcp-chrome-devtools/references/troubleshooting.md` | Modified | Node 20 |
| Hub metadata, `changelog/v1.1.4.0.md`, reports index, `compiled-routing/2026-11-24--two-stage-replay--compiled--second-follow-up/` | Modified, Created | Release 1.1.4.0 and the 56-row replay |
| Activation manifest and archive copy | Modified | Re-minted for policy `4db40e86` |
| `../review/review-report.md` | Created | Generation-4 report |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was reproduced with the reviewer's own prompt or grep first. The router change landed with a canary case, which fails with the HEAD router. A first `compiled-route-sync.cjs` run promoted the authored copies over the edits; it was reverted with `--revert`, and the edited files were copied to their authored paths instead. The `SKILL.md` wording pushed Smart Routing to 201 words, so it was trimmed. That moved the policy hash, so the manifest was re-minted and the replay run again on the final hash.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the scorer, not add more aliases | Any id plus any alias showed the gap; an alias per pair treats only the prompt that surfaced it |
| `in aside`, not bare `aside` | Bare `aside` matched "set that aside" in 014. "in aside" keeps both idioms deferring |
| Leave the `ROUTER.md` callout on `--prompt "<task>"` | The lockstep parity test pins that line across all eight hubs, so a change belongs to the fleet |
| Keep the dated research note | It records what Aside shipped on 2026-07-17 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Two-stage replay, 56 rows | 55 PASS, 1 FAIL (MBU-PB-04, stage one only) |
| Hub canary harness | exit 0; exit 1 with the HEAD router ("gold mismatch for mixed-id-and-alias-bundle") |
| Advisor ratchet, in process | All eight metrics unchanged |
| Full advisor suite | 2,737 passed, 4 skipped, 1 failed, the known `system-skilled-bots` test |
| `node --test` compiled-route and installer tests | 122 tests, 121 pass. The one failure is the sync test on `007-sk-doc/lib/registry-compiler.cjs`, whose served and authored copies already differed at HEAD |
| `compiled-route-guard.cjs --json` | 0 stale |
| `parent-skill-check.cjs` | OK, 0 warnings |
| Playbook validators, hub and three modes | each `violations=0 warnings=0` |
| `quality-gate.cjs --worktree` | `NO_BLOCKER_FOUND` |
| `validate.sh` on the hub epic, `--strict --recursive` | RESULT: PASSED on every folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The other seven hubs still splice the task into `--prompt "<task>"`,** and so does this hub's `ROUTER.md` callout. Moving them is a fleet-wide change through the lockstep template.
2. **`in aside` matches ungrammatical prose** such as "put this in aside notes".
3. **MBU-PB-04 still gets no advisor recommendation.**
4. **The generation-4 review is only partly gate-proven.** pi-1 and vibe-2 hit their iteration cap with coverage failed, and vibe-1 wrote no stop row. Its 24 P2 findings were not checked one by one.
5. **The `007-sk-doc` sync drift** keeps one bin test failing until sk-doc copies its served compiler back.
<!-- /ANCHOR:limitations -->

---


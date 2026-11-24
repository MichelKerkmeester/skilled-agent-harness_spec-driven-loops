---
title: "Implementation Summary"
description: "Every hub now tells agents to pass the task to the compiled front door on stdin through a quoted heredoc, so a quote, $() or backtick in a task never reaches the shell."
trigger_phrases:
  - "fleet front door stdin implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/017-fleet-front-door-stdin"
    last_updated_at: "2026-11-24T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Built and verified the fleet stdin front door"
    next_safe_action: "Triage the generation-4 P2 findings in phase 018"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-fleet-front-door-stdin"
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
| **Spec Folder** | 017-fleet-front-door-stdin |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every hub now tells agents to send the task to the compiled front door on stdin through a quoted heredoc. A task holding a quote, `$()` or a backtick no longer reaches the shell. New hubs scaffolded by sk-doc are born with the same line.

### Phase 17: fleet-front-door-stdin

- **Fleet instructions.** 32 live lines across eight hubs moved from `--prompt "<task>"` to `--prompt-stdin <<'TASK'`, the task, then `TASK`.
- **Scaffold.** The parent-hub router template, `init_skill.py` and the architecture reference carry the heredoc, and so does the parity fixture.
- **Manifests.** Seven activation manifests were re-minted for their new policy hashes. mcp-browser-use's hash did not move, because its `SKILL.md` already used stdin.
- **sk-doc drift.** The authored `007-sk-doc/lib/registry-compiler.cjs` said "OpenCode" where the served copy says "Skilled". Syncing that one word turned the bin sync test green.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Eight hubs' `SKILL.md` and `ROUTER.md` | Modified | Stdin heredoc |
| cli-external-orchestration and sk-code `README.md`, eight feature-catalog files | Modified | Same |
| sk-doc template, `init_skill.py`, architecture reference, parity fixture | Modified | New hubs get the heredoc |
| `.skilled/bin/README.md` | Modified | Leads with `--prompt-stdin` |
| Seven activation manifests and archive copies | Modified | Re-minted |
| Archive `007-sk-doc/lib/registry-compiler.cjs` | Modified | One word synced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A grep at HEAD listed every live line. A script rewrote the 29 doc lines. Standalone command lines became three heredoc lines, and inline mentions gained "(the task on the next lines, then `TASK`)". The three code surfaces were edited by hand. The manifests were re-minted after the guard flagged them stale, and every hub's checks ran from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Switch the whole fleet (Q011) | The operator chose it over leaving one hub different |
| Keep changelogs and benchmark scripts as written | They record what was true at the time |
| Fold the sk-doc word sync into this phase | Few characters in one file, the operator approved the layout |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live `--prompt "<task>"` grep, outside changelogs and benchmarks | 0 lines (32 at HEAD) |
| Heredoc task with `"`, `$()` and a backtick on all eight hubs | Eight decisions, no file created |
| `parent-skill-check` on all eight hubs | OK, 0 warnings each |
| Eight canary harnesses | exit 0 each |
| sk-doc `pytest scripts/tests` | 462 passed |
| Lockstep parity test | exit 0 |
| `node --test .skilled/bin/tests/*.test.cjs` | 197 tests, 197 pass, 0 fail |
| `compiled-route-guard.cjs --json`, `compiled-route-sync.cjs --check` | 8 fresh; 61 copies match |
| `quality-gate.cjs --worktree` | `NO_BLOCKER_FOUND` |
| `validate.sh` on the hub epic, `--strict --recursive` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A task line reading exactly `TASK` ends the heredoc early.** The rest becomes shell input. Any fixed delimiter has this limit.
2. **The parity test checks synthetic fixtures only.** Its live report is informational and covers five hubs. mcp-tooling and sk-code already differed from the others in other callout words before this phase.
<!-- /ANCHOR:limitations -->

---

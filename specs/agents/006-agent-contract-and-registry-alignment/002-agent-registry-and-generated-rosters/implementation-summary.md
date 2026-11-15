---
title: "Implementation Summary: Phase 2: agent-registry-and-generated-rosters"
description: "One registry now names all eleven agents, and the four rosters are generated from it and checked in CI, which makes design and prompt-improver routable."
trigger_phrases:
  - "agent registry and generated rosters implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/002-agent-registry-and-generated-rosters"
    last_updated_at: "2026-11-14T12:39:16Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 2 with all eight acceptance rows Met"
    next_safe_action: "Run the phase 003 tasks in order from T001"
    packet_purpose: "Purpose: One registry names every agent, its tier, who may dispatch it and which skill it binds to, and every roster is generated from it and checked in CI."
    blockers: []
    key_files:
      - ".skilled/agents/agent-registry.json"
      - ".skilled/bin/sync-agent-roster.cjs"
      - ".skilled/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:3a1c7fd11ca51302e28239405d81d502b5e1e99a864a82be1539114738c0641d"
      session_id: "d26ce6f7-65fb-42c9-81e5-aae22633434d"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "d26ce6f7-65fb-42c9-81e5-aae22633434d"
      workspace: "/Users/michelkerkmeester/worktrees/public/377-agent-contract-and-registry-alignment"
      savedAt: "2026-11-14T12:39:16Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-agent-registry-and-generated-rosters |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The orchestrator can now route to `design` and `prompt-improver`. Both were missing from its routing table, its leaf list and its agent files table, and each count of `@design` and `@prompt-improver` in `orchestrate.md` went from 0 to 3.

### One registry, four generated rosters

`.skilled/agents/agent-registry.json` holds one record per agent. `node .skilled/bin/sync-agent-roster.cjs` rewrites the text between each marker pair from it, and `--check` exits 1 and names the block when a roster, the registry or the agents directory disagree. The CI workflow runs that check on every pull request that touches the agents.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/agent-registry.json` | Created | Eleven records and the one routing row that is not an agent |
| `.skilled/bin/sync-agent-roster.cjs` | Created | Write mode and `--check` mode |
| `.skilled/bin/sync-agent-roster.vitest.ts` | Created | Four cases |
| `.skilled/agents/orchestrate.md` | Modified | Three tables became generated blocks |
| `.skilled/agents/README.txt` | Modified | The roster became a generated block |
| `.github/workflows/agent-mirror-sync.yml` | Modified | One path filter and one check step |
| `.skilled/bin/README.md` | Modified | Lists the new script and both modes |
| `.claude/agents/orchestrate.md` | Modified | Hand-kept twin, the same three blocks |
| `.codex`, `.pi` and `.dsh` copies of `orchestrate` | Regenerated | Generated copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session extracted the registry from the existing rows with a script, so every existing cell was copied byte for byte, and wrote `scratch/row-parity.md` first. DeepSeek V4.1 Flash at max, through `cli-opencode` on the LLM Gateway route, then wrote the script and its tests in one dispatch, converted the four rosters and added the CI step in a second, and listed the script in the bin README in a third. The orchestrating session reran the check, the four tests, the three copy generators and the mirror check, and compared the old rows with the generated rows.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The registry carries `priority`, `notes` and `summary` beside the four fields the spec names | Without them the generated rows would drop the routing order, the agent files note and the README line each hand-written row carried, which is the risk the spec lists |
| The external CLI row sits in the registry as `routingExtras` | It is a row of the routing table but not an agent, and a comment marker inside a table would break the table |
| `design` and `prompt-improver` take priorities 9 and 10, and the external CLI row moves from 9 to 11 | The CLI row is the last resort and nothing refers to it by number |
| The leaf list follows routing order | One order for all three tables means one sort in the script |
| The script finds the repository root from its own location | It takes no path from input, and the tests run a copy inside a temp tree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance criteria | 8 of 8 `Met`, none waived, see `acceptance-criteria.md` |
| `tasks.md` checklist | Every P0 and P1 item checked with its output, the one P2 item deferred with its reason |
| `node .skilled/bin/sync-agent-roster.cjs --check` | `agent-roster: OK`, exit 0, 0.035 seconds real |
| Write mode run twice | Four `unchanged` lines on the second run |
| `vitest run --root .skilled --config vitest.config.bin.ts bin/sync-agent-roster.vitest.ts` | 4 passed of 4 |
| `quality-gate.cjs --files` on both new files | No P0, P1 or P2 finding, exit 0 |
| `rg -c '@design' .skilled/agents/orchestrate.md` and the same for `@prompt-improver` | 3 and 3, both 0 before |
| `node .skilled/bin/check-agent-mirror-sync.cjs --all` | `11 agent(s) checked — all comparable mirrors in sync — OK`, exit 0 |
| Old rows against generated rows | Only additions, the 9 to 11 renumber and the leaf list order differ |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The task-package template in `orchestrate.md` still types eight agent names by hand.** Its `Agent:` line is a fifth roster the spec does not list, so it was left alone. It omits `design` and `prompt-improver`.
2. **The Claude twin of `orchestrate.md` is copied by hand.** The script writes only `.skilled/agents/`, so the mirror check is what catches a twin that was not updated.
3. **A missing roster file crashes the script with a Node stack trace.** It reports a missing block cleanly, but not a missing `orchestrate.md` or `README.txt`. Both files exist in every checkout.
4. **The agent-authoring skill does not yet tell an author to add a registry record.** The check fails and names the agent when the record is missing, so the gap costs one failed run.
5. **The CI step was not run on GitHub.** The branch is local, so the step has only run as the same command on this machine.
<!-- /ANCHOR:limitations -->

---

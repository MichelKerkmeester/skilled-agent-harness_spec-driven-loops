---
title: "Implementation Summary"
description: "The doctor roster check now reads the source tree and covers all eight runtime trees, both playbook sandboxes build the .opencode link their drift checks diff, and the deep-research and markdown agents now grant and route the same way in every tree."
trigger_phrases:
  - "agent source and drift checks implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/022-agent-source-and-drift-checks"
    last_updated_at: "2026-11-15T17:44:29Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified phase 22"
    next_safe_action: "Fix the phase 20 doc findings in child 023"
    packet_purpose: "Purpose: Each drift check can fail when its tree drifts, and every agent tree grants what its source declares."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:3aab00b72189ea9782f8685bb51e84bd5393bfa871feca0fb5aea6f5190ef022"
      session_id: "scaffold-022-agent-source-and-drift-checks"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T17:44:29Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 022-agent-source-and-drift-checks |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The doctor roster check can now fail on every agent tree the repo ships, and both deep-loop playbook sandboxes build the tree their drift checks compare. Before, an agent missing from `.dsh` or `.vibe` passed, and the sandbox diffs compared two missing files.

### Phase 22: agent-source-and-drift-checks

The roster check takes its roster from `.skilled/agents`. It checks presence in `.claude`, `.opencode`, `.codex`, `.pi`, `.dsh` and `.vibe`, each in its own file shape, and checks that `.cursor` and `.devin` link into the Claude fork. The deep-research agent's source now grants `websearch`, so the Claude copy's `WebSearch` has a source key. The markdown agent is now `mode: subagent`, matching its LEAF body and the registry. The deep-research sandbox also required two workflow files the repo merged into `deep-research.yaml`, so it exited 1 before building anything; it now requires the merged file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | Modified | Source roster, eight surfaces, header and repair text |
| `.skilled/commands/doctor/scripts/tests/agent-roster-mirror-check.test.cjs` | Modified | Eight-tree fixture, `.vibe` and `.dsh` drift cases |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh` | Modified | `.opencode/agents` link; requires `deep-research.yaml` |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh` | Modified | `.opencode/agents` link |
| `.skilled/agents/deep-research.md`, `.skilled/agents/markdown.md` | Modified | `websearch: allow`; `mode: subagent` |
| `.pi/agents/deep-research.md`, `.vibe/agents/markdown.toml` | Regenerated | Unmapped-key comment; `agent_type = "subagent"` |
| `.skilled/bin/agent-mirror-crosswalk.md` | Modified | Permission vocabulary, Pi unmapped set, mode counts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi built four tasks, one per dispatch, and the conductor read every diff. The sandbox guard fix came from DeepSeek's own report on the sandbox task, which found the script could not run at all. After the build, the four generator checks, the mirror check, the roster check, the 1,170 doctor script tests, the two generator test files and the `.skilled/bin` suite all passed.

Gap 3 from the earlier analysis closed outside the repo. `regen-claude-fork.sh` is untracked local tooling in the dispatch kit, not a repo tool: the repo carries the Claude fork by hand behind a blocking mirror check (`.skilled/CROSS-CLI.md`). The helper missed `orchestrate` and `design` because those forks mix the two path forms line by line. It now keeps each line's existing form and rebuilds all 11 forks with no diff.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `.skilled/agents` is the roster's source | The operator chose it on 2026-11-15; every other doc already names it the source |
| Add `websearch: allow` rather than drop `WebSearch` | The operator chose it on 2026-11-15; research iterations need search |
| `markdown` becomes `mode: subagent` | The operator chose it on 2026-11-15; its body and the registry call it a LEAF |
| Fix the sandbox guard in this phase | The `.opencode` link alone could not make the deep-research checks runnable while the script exited at the guard |
| No repo change for the fork helper | The helper is local tooling; the repo's contract is a hand-carried fork with a blocking check |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Roster test file | PASS: 12 of 12 (baseline 10 of 10; the new two are the `.vibe` and `.dsh` drift cases) |
| Roster check on the repo | PASS: eight rows OK, exit 0 |
| Four agent generators `--check` | PASS: exit 0 each |
| `check-agent-mirror-sync.cjs` | PASS: 11 agents in sync |
| Doctor script tests | PASS: 1,170 of 1,170 |
| `sync-agents-vibe` and `sync-agents-dsh` tests | PASS: 9 of 9 |
| `.skilled/bin` vitest suite | PASS: 77 of 77 |
| Both sandbox scripts run in full | PASS: each leaves `.opencode/agents/<agent>.md` readable |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Web search output goes unscreened on OpenCode.** The injection screen covers `webfetch` only, as the Claude hook covers `WebFetch` only, so `websearch` results reach the agent unscreened on both runtimes.
2. **Two doctor docs still describe five surfaces.** `doctor-runtime-mirrors.yaml` and the doctor scripts README are phase 23's.
<!-- /ANCHOR:limitations -->

---

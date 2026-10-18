---
title: "Implementation Summary"
description: "Planned changes for phase 4: one set of agents, commands and config for both OpenCode versions, with a browser deny key, runtime-neutral delegation wording, moved non-command files and a shape test for opencode.json."
trigger_phrases:
  - "agents commands config implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config"
    last_updated_at: "2026-10-18T12:45:04Z"
    last_updated_by: "scaffold"
    recent_action: "Wrote the planned entries"
    next_safe_action: "Run phase 4 and replace the planned entries with observed results"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-agents-commands-config"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-agents-commands-config |
| **Status** | Planned |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not started. This phase has not run, so it has changed no tracked file and recorded no verdict. Once it runs, both OpenCode versions read one set of agents, commands and config. Each agent that carried `chrome_devtools: deny` also carries `browser: deny`, and no non-command markdown file is registered as a command on either version.

### Phase 4: agents-commands-config

Not started. The phase adds the `browser: deny` key to ten agents, makes the delegation wording runtime-neutral, adds a Devin entry and UNKNOWN entries to the runtime table in `orchestrate.md`, moves the twelve non-command markdown files out of `.skilled/commands/` with every consumer pointed at the new paths, syncs the mirror copies and adds a shape test for `opencode.json`. Its file list is in `spec.md` section 3.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/debug.md`, `context.md`, `design.md`, `markdown.md`, `ai-council.md`, `review.md`, `deep-research.md`, `code.md`, `deep-review.md` and `prompt-improver.md` | Not started | Each gains a `browser: deny` key beside `chrome_devtools: deny`. |
| `.skilled/agents/*.md` (11 agents) | Not started | Runtime-neutral delegation wording. No permission changes. |
| `.skilled/agents/orchestrate.md` | Not started | Devin row with `run_subagent`, and UNKNOWN rows for runtimes with no evidence. |
| `.claude/agents/*.md`, `.codex/agents/*.toml` and `.pi/agents/*` | Not started | Mirror copies synced by the repo's own sync command. |
| The 12 non-command markdown files under `.skilled/commands/` | Not started | Moved to the destination that the orchestrator confirms in T003. |
| Deep-loop consumers, documents and manifests listed in `spec.md` section 3 | Not started | Point at the new paths. |
| `.opencode/bin/tests/opencode-config-shape.test.cjs` | Not started | Positive case and negative case for the shape of `opencode.json`. |
| `opencode.json` | Not started | Not edited unless the D2 conflict is settled. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The plan is in `tasks.md`, and the closure gate is `acceptance-criteria.md`. DeepSeek writes the agent wording through cli-devin, and Luna writes the file moves, the consumer edits and the config test through cli-codex. The orchestrator runs the mirror sync, the contract tests, the command listings and the config load itself. A DeepSeek review checks the wording before closure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Not started | The decisions sit in `goal.md` and in the open questions of `spec.md`. The four orchestrator decisions are recorded in task T003. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict validation of this folder with `validate.sh --strict` | Not started |
| Mirror checker exits 0 with 11 agents checked (T013, AC-001) | Not started |
| Contract tests match their baseline pass count (T015, AC-007) | Not started |
| Command listings register no moved file (T016, AC-006) | Not started |
| `opencode.json` loads on v1, and the config shape test passes both cases (T017, T018, AC-008, AC-009) | Not started |
| Stale-path grep, with each exception recorded here (T019, AC-010) | Not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** No change has run, so every file and check stays open until the tasks in `tasks.md` run.
2. **Open decisions.** The destination of the moved files, the D2 conflict, the `browser` key for `orchestrate.md` and the sync of the `.pi`, `.cursor` and `.devin` copies await the orchestrator's decisions in T003. T003 settles them before T010 and T012 run.
3. **Benchmark reports.** The reports under `benchmark/reports/` cite old paths. They stay as they are, and they appear as recorded exceptions in the T019 grep. Any other stale path that T019 finds is recorded here before closure.
<!-- /ANCHOR:limitations -->

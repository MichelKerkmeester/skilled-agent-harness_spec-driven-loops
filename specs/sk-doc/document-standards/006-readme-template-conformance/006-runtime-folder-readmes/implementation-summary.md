---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "runtime folder readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes"
    last_updated_at: "2026-11-17T14:03:36Z"
    last_updated_by: "generate-context"
    recent_action: "Triaged the 006 canary and wave 1"
    next_safe_action: "Review the remaining 006 waves from the detached drive, then close and push phase 006"
    packet_purpose: "Purpose: Each runtime folder README and sync manifest follows its scaffold in the runtime folder template, passes the validator and the voice scan with zero hard blockers, and states only surfaces, commands and checks the folder confirms."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes/plan.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-runtime-folder-readmes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "7be91f15-0ff9-421e-8bb3-fd9a453daa38"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T14:03:36Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 30
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-runtime-folder-readmes |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

[YOUR_VALUE_HERE: Opening hook: 2-3 sentences on what changed and why it matters. Lead with impact.]

### Phase 6: runtime-folder-readmes

[What this feature does and why it exists. 1-2 paragraphs. Use direct address.
Explain what the user gains, not what files you touched.]

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| [YOUR_VALUE_HERE: path] | [YOUR_VALUE_HERE: Created/Modified/Deleted] | [YOUR_VALUE_HERE: What this change accomplishes] |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

[YOUR_VALUE_HERE: How was this tested, verified and shipped? What was the rollout approach?]
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| [YOUR_VALUE_HERE: What was decided] | [YOUR_VALUE_HERE: Active-voice rationale with specific reasoning] |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| [YOUR_VALUE_HERE: Validation, lint, tests, manual check] | [YOUR_VALUE_HERE: PASS/FAIL with specifics] |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review-record -->
## Review Record

One line per file. Every reviewer session was separate from the writer of the file it checked, and every finding was confirmed against the code before it was applied.

- **`.opencode/SYNC.md`:** 68 claims. Applied 4 findings as 3 pairs (the write run repairs every mirror link it owns and prints a `[runtime-mirror-sync]` prefix, sync-runtime-mirrors.cjs:193-219 and 440, local-* commands are left out of the written set but a checkout can carry them as links, sync-runtime-mirrors.cjs:129, no plugin imports the SDK at runtime, only JSDoc type imports, opencode-goal.js:3550 and system-skill-advisor.js:1054). Rejected 0. `opencode-compat-layout.test.cjs` still passes 21.
- **`.claude/README.md`:** 74 claims. Applied 1 (`check-agent-mirror-sync.cjs --all` prints one line per compared mirror, two per agent, check-agent-mirror-sync.cjs:131-133). Rejected 0. Two further findings concern `.claude/SYNC.md` counts and go to that file's triage.
- **`.codex/README.md`:** 55 claims. Applied 2 findings as 2 pairs (`sandbox_mode` comes from the generator's per-agent table for every shipped agent, sync-agents.cjs:33-52 and 200-203, so `review.toml` is read-only despite `bash: allow`). Rejected 0.
- **`.cursor/README.md`:** 84 claims. Applied 3 (`/doctor:runtime-mirrors` runs only the mirror and roster checks, doctor-runtime-mirrors.yaml:34-37, `.cursor/mcp.json` is a real-file copy identical to `.claude/mcp.json`, the routing rule names 8 packets, skill-routing.md:9-16). Rejected 0. The main session also wrote `deep/research.md` as its real path under `.skilled/commands/` so the reference checker resolves it.
- **`.devin/README.md`:** 56 claims. Applied 2 (`hooks/` holds 29 links and one authored `README.md`, the `hooks/` mirror is rebuilt by `sync-runtime-mirrors.cjs` from `hooks.v1.json`, sync-runtime-mirrors.cjs:59-63 and 213-216). Rejected 0. A third finding, the missing `repo-rules` row, belongs to `.devin/SYNC.md` and went to that file's triage.
- **`.dsh/README.md`:** 90 claims. Applied 3 (`adapters/` holds one authored `README.md` beside the links, the OpenCode Go route is proven, as commit `e3a22728fc1` and providers-and-models.md:46 record, and the top reasoning effort is proven only for LLM Gateway, providers-and-models.md:106). Rejected 0. The main session also allowed `CLAUDE.md` and `.local.md` for the reference checker, with reasons.
- **`.opencode/README.md`:** 88 claims. Applied 4 (`commands/` links skip git-ignored names and never write or prune `local-*` links, sync-runtime-mirrors.cjs:126-131 and .gitignore:251-252, the suite reports `fail 0` before its summary lines, the hand-over plugin also turns on through the global switch while the OpenCode switch is unset, hook-flags.cjs:269-284). Rejected 0.
- **`.pi/README.md`:** 79 claims. Applied 2 (`prompts/goal-pi.md` is authored and the generator never writes or prunes it, sync-prompts-pi.cjs:158-163, the extensions have adapter behavior suites, extensions/README.md:171-192). Rejected 0.
- **`.claude/SYNC.md`:** 121 claims. Applied 3 (`local-*` command links are still checked and written, only the prune pass skips them, sync-runtime-mirrors.cjs:91-110, 196-206 and 320-327, 17 of the 33 hook links are whole programs or skill-owned scripts, `readlink` over `.claude/hooks/`, `Explore.md` has no twin). Rejected 0. The main session also reworded a prose count and allowed `CLAUDE.md`. The old file's wrong command and hook counts are gone, because the rewrite states neither.
- **`.codex/SYNC.md`:** 118 claims. Applied 4 (`sync-prompts.cjs --check` reports an orphan stub as `EXTRA`, sync-prompts.cjs:137, while `validate-command-references.cjs` checks command-asset YAMLs, :172-182 and 481-490, the link check prints a visibility line before its PASS line, sync-runtime-mirrors.cjs:395-396, `/doctor:mcp` checks the Code Mode registration in `config.toml`, mcp-doctor-lib.sh:243-283). Rejected 0. The main session reran all six drift-table commands, and each exited 0 with the stated line.
- **`.cursor/SYNC.md`:** 124 claims. Applied 4 (`agents/` and `commands/` are real folders of per-file links, sync-runtime-mirrors.cjs:193-207, `hooks/README.md` is authored and the prune pass skips it, sync-runtime-mirrors.cjs:324, the rendered `hooks.json` keeps event names and drops only the concern, sync-hook-registrations.cjs:200-213, the runtime-mirrors README covers the registry, the renderer and the link generator). Rejected 0. The rewrite dropped the false compiled-ESM caveat row. The main session gave `hook-registry.json` its full path, reworded two prose counts and reran the four drift checks, each exit 0.
- **`.devin/SYNC.md`:** 141 claims. No findings. The `repo-rules` row the README review asked for is present. The main session gave `hook-registry.json` its full path and reran the three drift checks, each exit 0.
- **`.dsh/SYNC.md`:** 96 claims. Applied 1 (the mirror writer prints `Drift detected:` lines rather than `FAIL`, sync-runtime-mirrors.cjs:387-390, while the three tree generators print `FAIL`). Rejected 0. The rewrite no longer calls the OpenCode Go route unverified. The main session allowed the `hooks/dsh/` folder pattern and reran the six drift checks, each exit 0.
- **`.pi/SYNC.md`:** 96 claims. No findings. The main session named the two declaration files instead of counting them and reran the four drift checks, each exit 0.
- **`.vibe/SYNC.md`:** 102 claims. Applied 5 (a row for the new `README.md`, `session-cleanup.mjs` loads `.opencode/plugins/session-cleanup.js`, session-cleanup.mjs:25, a guard's core lives under `.skilled/` or `.opencode/plugins/`, plugins/README.md:90-95, the skill prune keeps `local-*` links, sync-skills-vibe.cjs:372, the roster line is padded). Rejected 0. The main session allowed `main.md`, `plugin.json` and `.vibe/commands/` as names of things that must not exist, linked the new README and reran the four drift checks, each exit 0.
- **`.vibe/README.md`:** a new file, 60 claims. Applied 3 findings as 2 pairs (the suites build their payloads inline, dispatch-preflight.test.mjs:33-41, the CI job runs only for `main` and `skilled/**`, command-tree-parity.yml:5-6 and 30-31). Rejected 0. The main session reran the health block: three PASS lines and `pass 26`, `fail 0`.
<!-- /ANCHOR:review-record -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **[YOUR_VALUE_HERE: Limitation]** [YOUR_VALUE_HERE: Specific detail with workaround if one exists.]
<!-- /ANCHOR:limitations -->

---



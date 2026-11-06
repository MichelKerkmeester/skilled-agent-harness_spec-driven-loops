---
title: "Implementation Summary: Phase 15: dsh-hook-parity"
description: "DSH now carries every hook concern OpenCode and Pi carry, or a checked reason it does not: the advisor, a goal command and tool, session-start guards, compaction and stop context, the overlay guard and decision capture, with fan-out leaves kept free of writers and every adapter in the hook library."
trigger_phrases:
  - "dsh hook parity implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/015-dsh-hook-parity"
    last_updated_at: "2026-11-06T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped DSH hook parity, the leaf split and the hook library layout"
    next_safe_action: "Verify a keyed interactive run shows the goal brief and advisor"
    blockers: []
    key_files:
      - ".dsh/plugins/repo-guards/index.mjs"
      - ".skilled/hooks/goal/dsh/goal-manage.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-dsh.mjs"
      - ".skilled/hooks/README.md"
      - "015-dsh-hook-parity/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-015-dsh-hook-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 15: dsh-hook-parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-dsh-hook-parity |
| **Completed** | 2026-11-06 |
| **Status** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An operator in `dsh web` now gets the skill-advisor brief, `/goal-dsh` and a `dsh_goal` tool, the six session-start warnings, compaction and stop context, the overlay guard and live decision capture. A fan-out leaf keeps every guard and runs none of the four adapters that write the operator's state or start background work.

### Phase 15: dsh-hook-parity

The bundle grew from 14 adapters to 20. The guards patch turns the advisor on, and the lineage patch inserts a one-line marker plugin that the four interactive-only adapters read when an event fires, because the runner applies the lineage patch before the `repo-guards` row exists. Answers you give through `ask_user_question` are queued live, a late reply to a timed question included, and `/speckit:save` recovers anything missed from the DSH session log through `sweep-dsh.mjs`.

Every adapter's real file now lives in the hook library, `.skilled/hooks/<concern>/dsh/` or its owning skill's `hooks/dsh/` folder, and `.dsh/plugins/repo-guards/adapters/` holds one relative link per adapter, the layout Pi uses. `/doctor:runtime-mirrors` checks those links.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.dsh/patches/guards.patch.yml`, `.dsh/patches/lineage.patch.yml` | Modified | Advisor on, leaf marker row |
| `.dsh/plugins/repo-guards/index.mjs`, `lineage-leaf.mjs` | Modified, Created | Registers 20 adapters with two of them behind `ctx.inject`. Adds the marker plugin |
| `.dsh/plugins/repo-guards/adapters/*.mjs` | Replaced with links | 22 relative links: 20 adapters, `dsh-llm.mjs` and `session-role.mjs` |
| `.skilled/hooks/{classifier-injection-screen,dispatch,goal,mcp-route-guard,post-edit-quality,task-dispatch}/dsh/` | Moved | The library-owned adapters, imports rewritten for the real folder |
| `.skilled/hooks/{decision-capture,overlay-guard}/dsh/`, `.skilled/hooks/goal/dsh/goal-manage.mjs`, `.skilled/hooks/shared/dsh/` | Created, Moved | Three new adapters, the harness package loader and the leaf flag |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/` | Moved, Created | Spec gate, completion and session lifecycle, plus three new session adapters and a README |
| `.skilled/skills/system-skill-advisor/hooks/dsh/`, `.skilled/skills/sk-git/scripts/hooks/dsh/` | Moved, Created | The advisor and the two Git adapters, each folder with a README |
| `.skilled/hooks/{completion,session-lifecycle,spec-gate,skill-advisor,git-preflight,git-message-gate,git-live-follow,git-primary-reconcile}/dsh/` | Created | Index links to the skill-owned files and the two Git scripts |
| `.skilled/hooks/decision-capture/bin/sweep-dsh.mjs` and its test | Created | Session-log sweep with a Zstandard frame walker |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` and its test | Modified | The `dsh-adapters` tree |
| `.dsh/plugins/repo-guards/tests/` | Created, Modified | Six new suites and a shared fake context, written before the code |
| `.skilled/hooks/README.md`, `coverage-rationale.md`, `decision-capture/bin/runtime-refusal.test.mjs` | Modified | DSH column, seven-runtime matrix contract, rationale |
| `.dsh/plugins/repo-guards/README.md`, `.dsh/SYNC.md`, `guards-and-hooks.md`, GRD-001 | Modified | Layout, adapter table, both compositions |
| `.skilled/commands/speckit/save.md`, the doctor runtime-mirrors step and the runtime-mirrors README | Modified | DSH sweep in the save flow, `.dsh` coverage in the mirror check |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two probes came first: a lineage patch that overrode the `repo-guards` row printed `patch: entry "repo-guards" not found`, and an agent-context probe showed a per-agent tool registers at `agent/created` while `agent.ctx.commands` needs `inject`. Each new suite was then written against a fake plugin context and recorded failing on its missing module (`evidence/tests-red.txt`). The adapters followed until the bundle suite passed, and a script moved every adapter, rewrote its relative imports for the new real folder and checked that each target exists.

Keyless boots of both compositions ran in a `mktemp -d` cwd and `DSH_HOME` with model keys unset, and `--dump-config` captured both patch sets. The goal command then ran against the real manage CLI with a scratch state directory. The last pass ran every gate in `evidence/gates-2026-11-06.txt` and strict recursive validation of the whole packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A lineage-inserted marker read at event time (ADR-001) | The lineage patch applies before the guards row exists, so it cannot switch the advisor off by override |
| `/goal-dsh` plus `dsh_goal` over the shared manage CLI (ADR-002) | Pi's operator surface and OpenCode's model surface write the same goal record every runtime reads |
| Four writer adapters stay off in a leaf (ADR-003) | A leaf keeps every guard but never writes the operator's goal, advisor state or continuity, and starts no Git work |
| Pi's layout with imports written for the real folder (ADR-004) | The operator asked for one layout across runtimes, and Node resolves a link before it resolves the file's imports |
| One commit for the move and the new adapters | Each moved adapter also carries its new behavior, so a move-only commit would not build. `git log --follow` still traces each file through the move |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .dsh/plugins/repo-guards/tests/` | PASS, 75 of 75 (37 before this phase) |
| `node --test .skilled/hooks/decision-capture/bin/sweep-dsh.test.mjs` | PASS, 8 of 8 (new) |
| `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | PASS, 50 of 50 (50 before) |
| Hooks vitest suite | 481 pass, 2 fail, the same two `codex-shell-tool.test.mjs` cases as the baseline |
| Mirror, matrix and contract suites | PASS: `sync-runtime-mirrors.test.mjs` 6 of 6 (5 before), `runtime-refusal.test.mjs` 6 of 6, `message-contract.test.mjs` 38 of 38 |
| `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` | PASS, 48 of 48 |
| `sync-runtime-mirrors.cjs --check` | PASS, 243 mirrors across 10 trees (221 across 9 before) |
| `sync-hook-registrations.cjs --check` | PASS, 4 registration files, 20 Pi extensions |
| `sync-skills-dsh`, `sync-prompts-dsh`, `sync-agents-dsh` with `--check` | PASS, 56 skill links, 45 prompt stubs, 11 agent patches |
| Hermes `sync-skills-hermes` and `sync-prompts-hermes` with `--check` | PASS, 67 skill copies, 45 prompts |
| Keyless boots and `--dump-config`, both compositions | Interactive: advisor notice, worktree advisory, `dsh_goal` among 24 tools. Lineage: none of them, 23 tools. All dumps exit 0 |
| `/goal-dsh` against the real manage CLI | `bind`, `show`, `resent`, `pause`, `resume`, `complete` and `clear` return `STATUS=OK` with `runtime=dsh` |
| `validate.sh <packet> --strict --recursive` | `RESULT: PASSED` for all 16 folders after metadata regeneration, recorded in `evidence/validate-strict-recursive.txt` |
| Trigger index `generate-trigger-index.mjs --check` | exit 0, 0 stale documents after the rebuild |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No keyed interactive run yet.** The keyless boots prove registration and delivery up to the first model call, not the goal brief or advisor on a live operator turn. Run `dsh web` with the guards patch and a key to see both.
2. **Nested dispatch is read from code, not observed.** A `subagent` call inside a `workflow` run goes through the same `tools/pre-execute` pipeline call in the installed `dsh-tools`, but no live nested dispatch was captured.
3. **The README manifest test reports drift.** `test_readme_manifest.py` now lists `.dsh/plugins/repo-guards/adapters` as removed, because the folder holds only links, beside a `.claude` addition from parallel work. Its owner refreshes it with `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write` once both land.
4. **Adjacent gaps left for their owners.** `spec-gate-classify` reads the latest user-role message without a source filter, the advisor adapter passes `runtime: 'pi'` to the shared chain, a headless leaf still exposes the native `create_goal`, `get_goal` and `update_goal` tools and `/doctor:git`'s registration map has no DSH row.
<!-- /ANCHOR:limitations -->

---
title: "Implementation Summary"
description: "Three generators build the .dsh/ skill link farm (55 links), prompt stubs (44) and persona patches (11) from .skilled/, each with a --check mode wired into a dsh-mirror CI job and the runtime-mirrors doctor."
trigger_phrases:
  - "dsh mirror generators implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/005-dsh-mirror-generators"
    last_updated_at: "2026-11-06T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the three generators, their wiring and the closeout reruns"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "evidence/checks.txt"
      - "evidence/closeout-checks.txt"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-005-dsh-mirror-generators"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether the 55 linked skills load in one keyed dsh session, deferred to phase 013-dsh-live-contract-pin"
    answered_questions:
      - "No skill is excluded today: none of the printed excluded directories holds a counted SKILL.md"
      - "All 11 persona patches compose through dsh --dump-config with exit 0 and empty stderr"
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
| **Spec Folder** | 005-dsh-mirror-generators |
| **Status** | Complete |
| **Completed** | 2026-11-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every repo skill, command and agent now reaches a dsh session through a generated `.dsh/` mirror. When a mirror drifts from `.skilled/`, the `dsh-mirror` CI job and the runtime-mirrors doctor both fail.

### Phase 5: dsh-mirror-generators

`sync-skills-dsh.cjs` links each canonical `SKILL.md` folder as `.dsh/skills/<frontmatter name>`, one relative symlink per skill, 55 today. For example `.dsh/skills/cli-pi` points to `../../.skilled/skills/cli-external-orchestration/cli-pi`. It prints every directory it skips with the reason, exits 1 on a duplicate frontmatter `name` and warns on a description over 500 characters without failing. `sync-prompts-dsh.cjs` writes 44 flat stubs in `.dsh/prompts/`, one per command. Each stub names the canonical command file and ends at `User request:`. `sync-agents-dsh.cjs` writes 11 `.dsh/agents/<name>.patch.yml` files, each one `system-prompt` row whose `personaPrefix` is the agent body. Every generator has a `--check` mode that reports `MISSING`, `STALE` and `EXTRA` entries and writes nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs` | Created | Per-skill symlink farm with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs` | Created | Prompt stubs with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs` | Created | Persona patches with `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/dsh/README.md` | Created | Write and `--check` usage |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-{skills,prompts,agents}-dsh.test.mjs` | Created | Eight tests over temp fixture trees |
| `.dsh/skills/`, `.dsh/prompts/`, `.dsh/agents/` | Generated | 55 links, 44 stubs, 11 patches |
| `.github/workflows/command-tree-parity.yml` | Modified | `dsh-mirror` job at line 130, `.dsh/**` and the generator folder in both paths filters |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modified | Three dsh asset rows, steps and repair lines |
| `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` | Modified | Covers the dsh checks |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Three dsh `--check` lines in the runtime-mirrors route. Not in the plan's file list, see Key Decisions |
| `.dsh/SYNC.md`, `.dsh/README.md` | Modified | The three generated surfaces, when to sync, the drift workflow and the structure table |
| `evidence/checks.txt`, `evidence/closeout-checks.txt` | Created | Orchestrator run and closeout rerun |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. `cli-codex` dispatch 1 (log header `model: gpt-6-luna`, `reasoning effort: xhigh`) wrote the three generators, the README and the three tests. The process was killed from outside at about 20 minutes, exit 144 (signal 16), after it wrote every file and before it ran anything. Its log ends on hook lines with no final report. The exit code and signal are on the orchestrator's record.
2. The orchestrating Claude session ran the tests (8 of 8 pass), ran each generator in write mode (55 links, 44 stubs, 11 patches), then `--check` on all three, each exit 0 (`evidence/checks.txt:1-14`). It composed all 11 persona patches through `dsh --dump-config` from a disposable `DSH_HOME`, each exit 0 with empty stderr (`evidence/checks.txt:24`).
3. `cli-codex` dispatch 2 edited the CI workflow, the doctor asset and the doctor contract test. It stopped before running checks, because its test also needs `_routes.yaml` lines outside its brief. The orchestrator added the three lines and ran the contract test, 7 of 7 pass (`evidence/checks.txt:19-23`).
4. The orchestrator updated `.dsh/SYNC.md` and `.dsh/README.md`.
5. This closeout reran every cheap check into `evidence/closeout-checks.txt`. It never ran a generator in write mode and never ran dsh.

Closeout rerun of the three drift checks:

```text
evidence/closeout-checks.txt:79-86
[dsh-skill-sync] PASS: 55 skill links are in sync.
exit=0
$ node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs --check
[dsh-prompt-sync] PASS: 44 prompt stubs are in sync.
exit=0
$ node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs --check
[dsh-agent-sync] PASS: 11 agent patches are in sync.
exit=0
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One link per `SKILL.md` folder, not one whole-tree link | dsh discovers skills one level deep, so a whole-tree link would expose only the hubs |
| Count skills at run time | The tree held 54 `SKILL.md` files when the spec was written and 55 at closeout, so any fixed number goes stale |
| Prompt stubs point to the canonical command instead of inlining it | The same pattern as the Pi prompt generator, and a command edit then needs no stub rewrite. The phase plan's "flattened" names the flat file layout |
| `_routes.yaml` gains three dsh lines (deviation) | The plan names only the doctor asset and contract test. The runtime-mirrors route lists every mirror check, and the new contract test asserts the dsh lines are there, so the orchestrator added them |
| Dispatch 1's output kept after the process was killed (deviation) | Codex wrote every file before the kill, so the orchestrator ran the checks codex never reached instead of re-dispatching. Every check above passed on that output |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three `--check` runs | 55 links, 44 stubs, 11 patches in sync, each `exit=0` (`evidence/closeout-checks.txt:79-86`) |
| `node --check` on the three generators | three `exit=0` (`evidence/closeout-checks.txt:87-92`) |
| `node --test` on the generator tests | `ℹ pass 8`, `ℹ fail 0`, `exit=0` (`evidence/closeout-checks.txt:93-105`) |
| Doctor runtime-mirrors contract test | `ℹ pass 7`, `ℹ fail 0`, `exit=0` (`evidence/closeout-checks.txt:106-117`) |
| The 10 doctor tests that read `_routes.yaml`, one process per file | every file `ℹ fail 0`, `exit=0` (`evidence/closeout-checks.txt:155-165`) |
| The same 10 files in one `node --test` process | `ℹ pass 196`, `ℹ fail 0`, `exit=0` at closeout (`evidence/closeout-checks.txt:166-170`) |
| `rg -n dsh-mirror` on the workflow | `130:  dsh-mirror:` (`evidence/closeout-checks.txt:118-120`) |
| Farm, resolving `SKILL.md` and canonical counts | 55, 55, 55 (`evidence/closeout-checks.txt:121-129`) |
| Link targets outside `../../.skilled/` | 0 (`evidence/closeout-checks.txt:130-132`) |
| `--check` writes nothing | stat hash of `.dsh` `a9ef18defa72` before and after (`evidence/closeout-checks.txt:171-172`) |
| Comment-label and credential scans over the generator folder | no match, `exit=1` (`evidence/closeout-checks.txt:136-137`, `evidence/closeout-checks.txt:173-174`) |
| `validate_document.py` | generator README `VALID`, 0 issues. SYNC.md one `document_type_fallback` warning (`evidence/closeout-checks.txt:175-189`) |
| `validate.sh <phase folder> --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Skill loading is unproven.** The 55 links resolve on disk. Whether dsh loads all of them in one session needs a provider key and stays UNKNOWN until phase `013-dsh-live-contract-pin`.
2. **The combined doctor run is not settled.** The orchestrator saw the 10 `_routes.yaml` tests exit 1 with no failing test named when run in one process. The closeout run of the same 10 files passed, 196 of 196. The earlier failure is recorded as observed, with no cause found, and does not come from these edits, since each file passes alone.
3. **Idempotence rests on `--check`.** `.dsh/` is untracked, so `git status --porcelain .dsh` cannot show a second-run diff. The proof is that `--check` compares the same expected set write mode writes, and passes. No second write run was made at closeout.
4. **The credential scan pattern in `tasks.md` over-matches.** `\.env` also matches `process.env`, which the generators use for `DSH_*_DIR` path overrides. The narrower scan finds no credential read.
<!-- /ANCHOR:limitations -->

---

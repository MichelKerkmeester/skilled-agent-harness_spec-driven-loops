---
title: "Implementation Summary"
description: "Planned, not built. The doctor link manifest has no Mistral Vibe or DSH runtime, and this packet holds the plan to add both."
trigger_phrases:
  - "symlink vibe and dsh runtimes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/004-symlink-vibe-and-dsh-runtimes"
    last_updated_at: "2026-11-16T13:22:20Z"
    last_updated_by: "generate-context"
    recent_action: "Built the vibe and dsh link runtimes and ran the engine tests"
    next_safe_action: "Start a Vibe and a DSH session in a linked scratch project for T008"
    packet_purpose: "Purpose: `/doctor:symlink` links `.vibe` and `.dsh` like every other runtime folder, and every runtime list in the doctor commands names them."
    blockers:
      - "T008 needs a live Vibe and DSH session"
    key_files:
      - ".skilled/commands/doctor/assets/symlink-manifest.json"
      - ".skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs"
      - ".skilled/commands/doctor/symlink.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-symlink-vibe-and-dsh-runtimes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3912763e-4a15-47d7-994e-71d31bbf339f"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T13:22:20Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 85
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-symlink-vibe-and-dsh-runtimes |
| **Completed** | Built on 2026-11-16. Not closed: the session check (T008) is open |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`/doctor:symlink` now accepts `--runtimes vibe` and `--runtimes dsh` and links `.vibe` and `.dsh` whole, like every other runtime folder. A link that names no runtime still links only the runtime folders the project already has, so a project without `.vibe` or `.dsh` is not given one.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/symlink-manifest.json` | Modified | Adds the `vibe` and `dsh` runtimes, each one `dir` entry |
| `.skilled/commands/doctor/symlink.md` | Modified | The `--runtimes` row names eight runtimes |
| `.skilled/commands/doctor/install.md` | Modified | The `--runtimes` list names eight runtimes, in the same comma form as `symlink.md` |
| `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` | Modified | The runtime list names eight runtimes |
| `.skilled/commands/doctor/assets/doctor-symlink-check.yaml` | Modified | The runtime list names eight runtimes |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | Modified | The ask step names eight runtimes |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | Modified | The runtime question names eight runtimes, and the count of accepted answers goes from seven to nine |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modified | Two tests, one per runtime |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The change was prototyped and tested first, then reverted and applied by Mistral Vibe on `deepseek-flash` from four literal briefs in `scratch/dispatch/`. Brief 01 added the two tests and expected them to fail. Brief 02 changed the manifest. Briefs 03 and 04 edited the six lists. Each run printed `exit_code= 0 outcome= finished`. After each run every file matched the expected text byte for byte, and the brief's check was rerun by hand. The run logs are in `scratch/vibe-runs/`.

### Per-project file check (T002)

No file in `.vibe` or `.dsh` must stay per project.

- `git status --ignored --porcelain -- .vibe .dsh` printed four ignored files, all generated `local-*` prompt stubs. The `.codex/prompts` and `.pi/prompts` folders carry the same stubs and are already linked whole.
- Vibe keeps logs, history, trust and sessions in `VIBE_HOME`, never in `.vibe` (`cli-mistral-vibe/references/runtime-folder-and-sync.md` section 5).
- DSH keeps profiles, sessions and logs in `DSH_HOME`, never in `.dsh` (`cli-deepseek-harness/references/runtime-folder-and-sync.md` section 2).
- `.vibe/config.toml` and `.vibe/hooks.toml` are Skilled's own hand-authored runtime config. They are shared the way `.claude/settings.json` is shared by the `.claude` link. The hooks find their scripts with `git rev-parse --show-toplevel`, which resolves to the project root and then through the linked `.vibe` and `.skilled` folders.
- A search of both `repo-guards` bundles for file writes found none into `.vibe` or `.dsh`. The only write targets are a home folder passed as an argument and test fixtures.

### Session check (T008)

Not checked. This build ran without an interactive session. `vibe` (3.1.2) and `dsh` (0.2.2-rc.3) are both installed, but no session was started in a linked project. Only the link creation is proved, by the two tests and by `symlink-engine.cjs check --runtimes vibe,dsh`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The REQ-002 check sits inside each runtime test | Each test first links with no `--runtimes` and finds the folder absent, then links with `--runtimes`. A separate REQ-002 test would pass before the manifest change, so T003 would not show `fail 2` and T007 would not show exactly two more passes |
| `install.md` uses the comma form `claude,opencode,codex,cursor,devin,pi,vibe,dsh` | The REQ-003 pattern cannot match the old backticked list ending in "and" |
| "outside the seven" became "outside the nine" in the install presentation | The count was six runtime names plus "the ones already there". Two names make nine |
| Evidence for T001, T002 and T008 is here, not in `goal.md` | The build method for this run leaves `goal.md` unchanged |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Baseline `node --test .skilled/commands/doctor/scripts/tests` on HEAD | `tests 1183`, `pass 1183`, `fail 0`, exit 0 |
| `symlink-engine.test.cjs` before the manifest change | `tests 25`, `pass 23`, `fail 2`, both `ERROR: unknown runtime` |
| `symlink-engine.test.cjs` after | `tests 25`, `pass 25`, `fail 0` |
| `doctor-symlink-contract.test.cjs` | `tests 34`, `pass 34`, `fail 0` |
| `rg -c 'devin,pi,vibe,dsh\|devin, pi, vibe, dsh' .skilled/commands/doctor` | The six list files, each `1` |
| `symlink-engine.cjs check --root <new git repo> --runtimes vibe,dsh` | `missing core .skilled`, `missing vibe .vibe`, `missing dsh .dsh`, exit 0, no `unknown runtime` line |
| Prompt mirror checks for codex, pi, dsh and vibe, `--check` | Each exit 0 and `PASS: 46 prompt(s) ... in sync` |
| `sync-runtime-mirrors.cjs --check` | Exit 0, `PASS: 260 mirrors across 10 trees are in sync` |
| `command-catalog-mirror-check.cjs` | Exit 0, `STATUS=OK` |
| `quality-gate.cjs` on the test file and the manifest | `gate=NO_BLOCKER_FOUND`, `findings: 0`, exit 0 |
| Whole suite after the change | `tests 1185`, `pass 1185`, `fail 0`, exit 0. Two more than the baseline |
| `validate.sh --strict` on this folder | `RESULT: PASSED (errors=0 warnings=1)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No real session was tried.** Only the link is proved. Start one Vibe and one DSH session in a project linked with `--runtimes vibe,dsh` to confirm each runtime loads its config, hooks and skills through the link.
2. **A `local-*` prompt written in a linked project lands in the Skilled checkout.** The same holds today for `.codex` and `.pi`, and the checkout's `.gitignore` keeps those files out of git.
<!-- /ANCHOR:limitations -->

---

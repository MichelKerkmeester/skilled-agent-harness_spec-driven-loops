---
title: "Implementation Summary"
description: "The cli-opencode docs now match what OpenCode 1.19.3 and 2.0.32 actually do: one live default model id held by a test, one agent directory, --share documented as the deprecated no-op it is, and a run flag table refreshed from both versions' help. The doctor's version battery gains a command-listed leg that compares each family's command listing with the folders that family reads."
trigger_phrases:
  - "cli opencode docs and listings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/025-cli-opencode-docs-and-listings"
    last_updated_at: "2026-10-20T10:25:00Z"
    last_updated_by: "generate-context"
    recent_action: "Battery and new tests passed on CI at main 1d1c8ba931, run 39405362083"
    next_safe_action: "None; every row is closed and its checks pass on main"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/opencode-version-battery.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
      - ".github/workflows/opencode-dual-version.yml"
    session_dedup:
      fingerprint: "sha256:e1a7d8c756d76fb159b84e85503659423e74cda911af7aa3e56cfefd52b983ee"
      session_id: "scaffold-025-cli-opencode-docs-and-listings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-cli-opencode-docs-and-listings |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the cli-opencode skill now gets the default model id, the agent directory, the `--share` behaviour and the `run` flags that the installed binaries actually show. Before this phase most dispatch examples used an opencode-go id the gateway no longer lists, and `--share` was described as publishing sessions that 1.19.3 cannot publish.

### Phase 25: cli-opencode-docs-and-listings

**Row 9.** The doctor's OpenCode version battery has a `command-listed` leg on both families. It reads the v1 `debug config` command keys and the v2 `GET /api/command` listing, and compares each with the `.md` files under the project's `.opencode/command(s)` folder. Names from the global config folders are allowed on both families. On v2 the leg also allows every ancestor `.opencode` folder's commands, because v2 walks past the repository root, and the two built-ins `init` and `review`. A raw comparison read those as drift. A v2 listing that never settles on a non-zero count degrades the leg instead of being judged. The orphaned `.skilled/commands/deep/assets/compiled/` folder was already gone from the main checkout when this phase looked, and nothing under it is tracked.

**Row 10.** Every current cli-opencode doc, and the generated Hermes copy of `SKILL.md`, dispatches `opencode-go/deepseek-v4.1-flash`, the roster's default and the only DeepSeek flash id `opencode models opencode-go` lists. One dated coverage note keeps the old id it recorded, and the changelog and benchmark folders are untouched. `default-model-id.test.cjs` holds the docs to the roster, catches the slug with or without its provider prefix, checks every model selector in `SKILL.md`'s default invocation, and runs in the battery job's unit-test step.

**Row 11.** The docs say OpenCode loads `.opencode/agents/<slug>.md`, which in this repository links to `.skilled/agents/`, where the files are edited. Both versions list the same 11 repo agents.

**Row 12.** `--share` is documented as what 1.19.3's binary defines it to be: a hidden option described as `deprecated: session sharing was discontinued`, which prints `Session sharing has been discontinued` and publishes nothing. OpenCode 2.0.32 `run` has no such flag. It is gone from every dispatch example, the playbook included, and the dispatch rule's message and comment say the same.

**Row 31.** The `run` flag table and the core flag summary match `run --help` from both versions: `-u`, `-i`, `--auto` and `--standalone` rows were added, `--log-level` and `--print-logs` are global flags on 2.0.32 with lowercase levels, and `-p` is absent from 2.0.32 `run`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modified | The `command-listed` leg and the v2 command read |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modified | Seven command-listing cases and R9's third degraded row |
| `.skilled/command-support/doctor/scripts/README.md` | Modified | The new leg in the leg list |
| `.skilled/skills/cli-external-orchestration/cli-opencode/` current docs (31 files for row 10, plus `SKILL.md`, `README.md`, `references/`, `assets/prompt-templates.md` and five playbook files for rows 11, 12 and 31) | Modified | The corrected facts |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Modified | The `share-requires-confirmation` message |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` | Created | Holds the docs to the roster's default id |
| `.skilled/hooks/dispatch/README.md`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | The share rule's description and comment |
| `.github/workflows/opencode-dual-version.yml` | Modified | Runs the new test and triggers on the cli-opencode skill |
| This folder and `../spec.md` | Modified | The phase records and the phase 25 row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fact was probed before any doc changed. OpenCode 1.19.3 ran with a private data home holding only a copy of the credentials file, which was removed after each probe, and every OpenCode 2.0.32 read came from its own `serve` on a free loopback port with a private database, so the shared service was never contacted. The raw captures are under `scratch/`. Every code and doc edit was then written by DeepSeek v4.1 flash through short literal briefs (`scratch/briefs/`) and checked against its brief. The spec-folder documents and the probe helper `scratch/v2-api-probe.cjs` were written directly. Each new test was run against main's code or docs and against mutants, and each run is kept under `scratch/mutation/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the listing comparison a battery leg | The battery already collects both inputs, a v1 `debug config` and a private v2 server, and already runs on both families in CI |
| Allow ancestor folders only on v2 | 1.19.3 stops its project walk at the repository root; only 2.0.32 merges ancestors |
| Default to `opencode-go/deepseek-v4.1-flash` | It is the roster's ✓ row, it is dispatch-verified there, and `opencode models opencode-go` lists it while the old id is gone |
| Keep the dated coverage note's old id | It records what was covered on 2026-04-26, and rewriting it would falsify that record |
| Drop `--share` rather than document it as an alias | It does nothing but print a warning, so no dispatch has a reason to pass it |
| Keep the `share-requires-confirmation` rule id | The dispatch rule tests and the Pi preflight lint test key on it; only its message changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Row 9 tests | 37 of 37 pass; on main's battery 10 fail; with the built-ins not subtracted 1 fails; with the walk-up removed 3 fail; with the settle gate removed 1 fails (`scratch/mutation/row9-*.txt`) |
| Row 9 live, nested worktree | v1 and v2 `command-listed` both PASS, v2 listing 42 against 40 required (`scratch/battery-live-after-a.txt`) |
| Row 10 test | 3 of 3 pass; against main's docs the retired-id test fails, the bare slug is caught, and a default example switched to another provider fails (`scratch/mutation/row10-m*.txt`) |
| Row 11 grep | Six runtime-load claims on main, none after (`scratch/row11-grep-check.txt`) |
| Row 12 probe | The binary's option is hidden and deprecated, and a live run printed the discontinued line (`scratch/row12-v1-share-source.txt`, `scratch/row12-v1-share-probe.txt`) |
| Unit-test step as CI runs it, after the main merge | 46 of 46 pass (`scratch/final/unit-step.txt`) |
| Luna review, read-only | Rounds 1 to 3 FAIL, round 4 PASS with one P2, fixed (`tasks.md` T014) |
| CI at main `1d1c8ba931` | OpenCode Dual-Version Battery 39405362083 passed all three jobs, unit tests 46 of 46 on each family and `command-listed` PASS on v1, v2 and the side-by-side job; every other workflow on the commit passed (`tasks.md` T016) |
| Dispatch rule tests | 38 of 38 pass (`scratch/after/dispatch-rule-checks.txt`) |
| Workflow lint | `check-gate-inputs.sh` RESULT: PASSED, `actionlint` exit 0 (`scratch/after/workflow-lint.txt`) |
| Doc gates | Frontmatter coverage 0 violations, markdown links 0 broken, playbook fleet exit 0 with cli-opencode PASS (`scratch/after/doc-gates.txt`, `scratch/after/playbook-fleet.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`opencode2 models <provider>` is wrong in several docs.** 2.0.32 rejects the provider argument with `Unexpected positional argument` (`scratch/row10-v2-models-opencode-go.txt`), and without `--standalone` the command talks to the background service. The cli-reference pre-flight script uses that form, so its v2 provider check always reports the provider missing. It is not one of this group's rows and is left for a later fix.
2. **Which user-level agent folders 2.0.32 reads is unverified.** The docs name 1.19.3's and say so.
3. **v2 `plugin-active` fails in this worktree** before and after the change, with every plugin `failed`. It is the nested-worktree failure other groups saw and is not caused by this phase; CI runs the battery on a plain checkout.
<!-- /ANCHOR:limitations -->

---

---
title: "Implementation Summary"
description: "All nine sk-vision rows from the post-merge fix list are fixed: setup disposal releases every handle, an unreadable session model now waits for the evidence, the tests live behind a layout guard, the OpenCode host adapter has a test and a CI step, and the four runtime lifetime slips are closed. The suite runs 76 pass and 0 fail, and the v2 battery result is unchanged from the baseline."
trigger_phrases:
  - "sk vision runtime fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/023-sk-vision-runtime-fixes"
    last_updated_at: "2026-10-20T09:45:00Z"
    last_updated_by: "worker"
    recent_action: "Closed all nine sk-vision fix-list rows with mutation records and a green suite"
    next_safe_action: "None; strict validation and the v1 battery pass, and CI owns the v2 battery"
    blockers: []
    key_files:
      - ".skilled/skills/sk-vision/vision-runtime/src/plugin.ts"
      - ".skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts"
      - ".skilled/skills/sk-vision/vision-runtime/tests/host-adapter.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-sk-vision-runtime-fixes"
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
| **Spec Folder** | 023-sk-vision-runtime-fixes |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-vision runtime no longer leaks a handle, races the grace, hides its tests under `src/` or walks past a host that cannot report a session model. All nine rows of the post-merge fix list are fixed, each with a test that fails on the old code and a mutation record that proves it.

### Phase 23: sk-vision runtime fixes from the post-merge research

The fix list in `../014-post-merge-deep-research/research/research.md` §9 split into sibling groups, and this is the sk-vision group: rows 4, 5, 13, 15, 20, 23, 24, 25 and 26. Two were P1. Setup disposal released one handle and dropped the rest, so a command or tool registration could outlive the disposer. An automatic image check whose `ctx.session.get` threw fell through to the 2 s grace as if the model were known to be non-text-only, which is the wrong side to guess on.

The other seven rows were smaller but just as real. Seven test files sat under `src/`, so the build shipped them and nobody noticed the layout drift; they moved to `tests/` behind a guard that fails if one returns. The OpenCode hook adapter had no test at all, so a test now loads the shipped `hooks/opencode/sk-vision.ts` against a stub context and checks every hook it registers. Setup failed on a host without `session.hook` instead of keeping the command, and the hand-kept v2 context type now says so and has a bump checklist. The runtime client left a 15 s ping timer alive after a fast ping, let a failed command transform fail setup, treated a slow cold import as a missing interpreter, and could remove a venv that another call had created.

### What Changed, Row by Row

| Row | Priority | What changed | Proof |
|-----|----------|--------------|-------|
| 4 | P1 | Setup disposal releases the prompt hook, tools, command and inspection client through `Promise.allSettled` and rethrows the first rejection | `releases every handle and rethrows the first error when one disposal fails`; `scratch/mutation/row04-old-code.txt` |
| 5 | P1 | A throwing `ctx.session.get` sets `guaranteed`, so the full wait applies; a host with no `get` or a model off the text-only list keeps the 2 s grace | `waits for the evidence when reading the session model fails` (renamed from `asks for the grace when the host cannot report the session model`), expecting `true`; `scratch/mutation/row05-old-code.txt` |
| 13 | P2 | Seven tests moved by `git mv` from `src/` to `tests/` in the same subfolders with imports rewritten; the layout guard fails on any `*.test.ts` under `src/`; paths updated in 8 feature-catalog and 5 manual-testing-playbook files | `bun test` stayed at 67 after the move (68 with the guard); `scratch/mutation/row13-guard-old-layout.txt` |
| 15 | P2 | `tests/host-adapter.test.ts` loads `hooks/opencode/sk-vision.ts` against a stub context and checks the `event`, `chat.message`, `tool` (13 names, equal to `skVisionTools`) and `dispose` hooks plus `enabled: false`; CI gained the `Run the sk-vision runtime suite` step | Both tests pass; three hand-broken adapters fail the test (`scratch/mutation/row15-wiring-mutations.txt`); `scratch/final/ci-like.txt` |
| 20 | P2 | Setup returns the command-only cleanup on a host without `session.hook` instead of failing; `V2PluginContext` records that it is hand-kept and must be re-checked at each OpenCode 2 bump; `### OpenCode 2 bump check` added to `feature-catalog/host-adapters/opencode-plugin.md` | `keeps the command and skips inspection on a host without session.hook`; `scratch/mutation/row20-old-code.txt` |
| 23 | P3 | The 15 s startup ping timer handle is kept, `unref()`ed and cleared in `finally` | `clears the startup ping timer after a fast ping` records `hasRef()` inside a `clearTimeout` wrapper; `scratch/mutation/row23-old-code.txt` fails on the original, fails with only `unref()` removed, passes on the fix |
| 24 | P3 | `ctx.command.transform` is wrapped in the same fail-open guard as tool registration | `keeps image inspection and the tools when command registration fails`; `scratch/mutation/row24-old-code.txt` |
| 25 | P3 | The interpreter and `uv` probes share `probe()`; the timeout comes from `SK_VISION_PROBE_TIMEOUT_MS`, default 30 000 ms (was 5 000); a timed-out probe counts as present, while a non-zero exit, a missing binary or an abort from `close()` counts as absent; env row added to `SKILL.md` | `treats a probe that outlives its timeout as present` (stub sleeps 1 s, then exits 1 at a 100 ms timeout); `scratch/mutation/row25-old-code.txt` |
| 26 | P3 | After `mkdir(venv, { recursive: true })`, a closed client removes `venv` with `rmdir` only when this call created it | `removes only a venv it made when close() lands during mkdir`, whose first phase proves a pre-existing venv is kept; `scratch/mutation/row26-old-code.txt` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modified | Rows 4, 5, 20 and 24: full disposal with `Promise.allSettled`, `guaranteed` on an unreadable model, command-only cleanup without `session.hook`, fail-open command registration |
| `.skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts` | Modified | Rows 23, 25 and 26: ping timer lifetime, shared probe with the env timeout, venv cleanup only for a venv this call made |
| `.skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts` | Moved and modified | Out of `src/`; carries the row 4, 5, 20 and 24 tests |
| `.skilled/skills/sk-vision/vision-runtime/tests/runtime/client.test.ts` | Moved and modified | Out of `src/`; carries the row 23, 25 and 26 tests |
| `.skilled/skills/sk-vision/vision-runtime/tests/host-adapter.test.ts` | Created | Row 15: the shipped OpenCode hook adapter against a stub context |
| `.skilled/skills/sk-vision/vision-runtime/tests/layout.test.ts` | Created | Row 13: no `*.test.ts` under `src/` |
| `.skilled/skills/sk-vision/vision-runtime/tests/model-modality.test.ts`, `tests/evidence/prompt-evidence.test.ts`, `tests/opencode/attachments.test.ts`, `tests/opencode/tools.test.ts`, `tests/providers/photon.test.ts` | Moved | Row 13: the five remaining moved suites, imports rewritten |
| `.skilled/skills/sk-vision/feature-catalog/` (8 files) and `.skilled/skills/sk-vision/manual-testing-playbook/` (5 files) | Modified | Row 13 test paths, plus the row 20 bump checklist in `feature-catalog/host-adapters/opencode-plugin.md` |
| `.skilled/skills/sk-vision/SKILL.md` | Modified | Row 25: the `SK_VISION_PROBE_TIMEOUT_MS` env row |
| `.github/workflows/opencode-dual-version.yml` | Modified | Row 15: `Run the sk-vision runtime suite` on the v1 battery leg after provisioning |
| This folder's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` | Modified | The phase records, filled from the scaffold |
| `../spec.md` | Modified | The phase 23 documentation-map row and the 014-to-023 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline was recorded first (`scratch/baseline/`): 67 pass and 0 fail, `tsc` exit 0, the plugin suite 397 pass, battery v1 exit 0 and battery v2 exit 1. Each row then ran its test against the original file and the fixed one, and the record lives under `scratch/mutation/` — a record counts only when the old code fails and the fix passes. Row 15 needed different proof because the adapter source is unchanged: three hand-broken copies of its wiring each fail the new test. Row 23 needed a second shape, a fix with only `unref()` removed, to prove the test sees both halves.

The final run gives `bun run build` exit 0, `bun test` 76 pass and 0 fail across 10 files, `tsc --noEmit` exit 0, the plugin suite 397 pass, battery v1 exit 0 with 3 PASS, and battery v2 exit 1, unchanged from the baseline. A clean-env run with an empty HOME and no `SK_VISION` variables gives 73 pass and 0 fail (`scratch/final/ci-like.txt`), which is the shape CI runs. The new CI step `Run the sk-vision runtime suite` runs `bun test tests` and `bunx tsc --noEmit` on the v1 battery leg after provisioning; it rides that leg rather than adding a second provisioning job, and the Python handler suite under `python/` stays out because it needs Pillow, which the runner lacks.

Luna (gpt-6-luna through cli-codex, read-only) reviewed the branch in two rounds. Round 1 failed rows 20, 23 and 26 (`scratch/final/luna-review-1.txt`): row 20's tool check was redundant because fail-open registration already covers a missing `tool.transform`, row 23's test asserted the clear but not `unref()`, and row 26's test did not prove a pre-existing venv survives. Each was fixed at the test, and round 2 passed all nine rows (`scratch/final/luna-review-2.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the local v2 battery's exit 1 as an environment baseline | The same result appears in this worktree before any edit, the main checkout passes the battery, and CI passed it on equivalent `origin/main`; the criterion is "no change", and CI's OpenCode Dual-Version Battery on the pushed commit is the authoritative v2 check |
| Keep `V2PluginContext` hand-kept, with a re-check note and a bump checklist, instead of adding a `tool.transform` existence check | The published v2 context type declares no `session` or `tool` domain, so the type is hand-kept by necessity; a missing `tool.transform` was already handled by the fail-open tool registration, and review round 1 agreed the extra check was redundant |
| Count a probe killed by its timeout as present | A cold import can outrun 5 s, and treating a slow probe as a missing interpreter triggers a needless reinstall; a non-zero exit, a missing binary or an abort from `close()` still counts as absent |
| Move the tests instead of narrowing the test glob | A glob that skips `src/` hides the drift; the guard makes the layout a test, so the next misplaced file fails instead of vanishing from the run |
| Leave the Python handler suite out of CI | It needs Pillow, which the runner lacks; the TypeScript suite and type check are what the v1 leg can run after provisioning |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline sk-vision suite | 67 pass, 0 fail (`scratch/baseline/skvision.txt`) |
| Baseline type check | Exit 0 (`scratch/baseline/tsc.txt`) |
| Baseline plugin suite | 397 pass (`scratch/baseline/plugins-tail.txt`) |
| Baseline battery v1 | Exit 0 (`scratch/baseline/battery-v1.txt`) |
| Baseline battery v2 | Exit 1 (`scratch/baseline/battery-v2.txt`) |
| Mutation records, rows 4, 5, 13, 15, 20, 23, 24, 25 and 26 | Each fails on the original code and passes on the fix (`scratch/mutation/`) |
| Build | `bun run build` exit 0 |
| Final sk-vision suite | 76 pass, 0 fail across 10 files — 67 plus 9 new (`scratch/final/bun-test.txt`) |
| Final type check | `tsc --noEmit` exit 0 (`scratch/final/tsc.txt`) |
| Final plugin suite | 397 pass, 0 fail (`scratch/final/plugins-tail.txt`) |
| Final battery v1 | Exit 0, 3 PASS (`scratch/final/battery-v1.txt`) |
| Final battery v2 | Exit 1, unchanged from the baseline: family-present PASS, skill-visible PASS with 57 entries, plugin-active FAIL listing all 17 plugins as `status failed` (`scratch/final/battery-v2.txt`) |
| Clean-env CI-like run | 73 pass, 0 fail across 9 files (`scratch/final/ci-like.txt`) |
| Review round 1 | FAIL on rows 20, 23 and 26; all three fixed (`scratch/final/luna-review-1.txt`) |
| Review round 2 | PASS on all nine rows (`scratch/final/luna-review-2.txt`) |
| Strict spec validation | `RESULT: PASSED` with no errors (the final `validate.sh --strict` run on this folder) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The local v2 battery fails in this environment.** It exits 1 here with the family-present and skill-visible legs passing and the plugin-active leg reporting all 17 plugins as `status failed`. The same result appears before any edit, the main checkout passes the battery, and CI passed it on equivalent `origin/main`, so the local leg is treated as an environment baseline with a no-change criterion; CI's battery on the pushed commit is the authoritative v2 check.
2. **The Python handler suite under `python/` is not in CI.** It needs Pillow, which the runner lacks, so the new CI step runs only `bun test tests` and `bunx tsc --noEmit`.
3. **The v2 context type cannot be checked against the published package locally.** The v2 install is a compiled binary, and the `@opencode-ai/plugin` 1.17.15 `dist/v2/promise/context.d.ts` declares no `session` or `tool` domain. `V2PluginContext` stays hand-kept with a re-check note and the new bump checklist.
4. **The built `hooks/opencode/sk-vision.js` is not committed.** It is git-ignored build output, and the host-adapter test loads the TypeScript source instead.
<!-- /ANCHOR:limitations -->

---

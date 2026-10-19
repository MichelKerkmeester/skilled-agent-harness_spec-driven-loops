---
title: "Implementation Summary"
description: "sk-vision's 13 tools now register on OpenCode 2.0.32 under the same gate as OpenCode 1, and a live private-server run called one through OpenCode 2's code-mode tool. The grace path has tests, two bundle comments are corrected, and closing the runtime client now stops a startup still provisioning."
trigger_phrases:
  - "sk vision v2 tools and loose ends implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends"
    last_updated_at: "2026-10-19T17:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Fixed Luna's four round-4 P2s; round 7 passed"
    next_safe_action: "Phase complete. Pushing the branch waits for the operator"
    blockers: []
    key_files:
      - ".skilled/skills/sk-vision/vision-runtime/src/plugin.ts"
      - ".skilled/skills/sk-vision/vision-runtime/src/opencode/tools.ts"
      - ".skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-sk-vision-v2-tools-and-loose-ends"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 013-sk-vision-v2-tools-and-loose-ends |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A model on OpenCode 2 can now call sk-vision's tools, as it can on OpenCode 1. With `SK_VISION_AUTOINSPECT=1`, the `setup` entry adds the 13 `sk_vision_*` tools through `ctx.tool.transform`. Without the flag it adds none.

### Phase 13: sk-vision-v2-tools-and-loose-ends

`toV2Tools` maps each OpenCode 1 definition to OpenCode 2's shape. The input is the same zod schema, and the result keeps its text, its metadata and any attachments as file items. `createSetup` registers the tools after the prompt hook, so a hook that fails to register leaves no tools behind. A failed tool registration fails open. OpenCode 2 hands plugin tools to the model through its code-mode `execute` tool, and the live run shows `sk_vision_status` called that way.

`RuntimeClient.close()` now stops a startup still in progress. It marks the client closed, sends SIGTERM to a running `uv` or `pip` step, sends SIGKILL after 2 seconds and waits for the exit. A closed client never spawns the runtime, and `ready` settles with no error toast. Four tests cover the 2-second grace on OpenCode 2, and the two comments that named the hooks bundle now name `vision-runtime/dist/plugin.js`.

Luna's four round-4 P2s are fixed. `close()` also aborts the 5-second interpreter probes, and a closed client stops before it probes again, creates the venv or provisions. When the prompt hook fails to register, `setup` releases the command registration and the inspection client, even if a dispose throws, and rethrows the hook error. The "inspection off" test runs the real `setup` with `SK_VISION_AUTOINSPECT` unset, and `hooks/README.md` no longer calls the hook bundle gitignored.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/tools.ts` | Modified | `toV2Tools` and its types |
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/tools.test.ts` | Created | Four adapter tests |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modified | Tool registration in `createSetup`, and cleanup when the prompt hook fails |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` | Modified | Five registration and two grace tests |
| `.skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.test.ts` | Modified | Two `evidenceText` grace tests |
| `.skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts` | Modified | `close()` stops provisioning and the interpreter probes |
| `.skilled/skills/sk-vision/vision-runtime/src/runtime/client.test.ts` | Created | Four close-during-startup tests |
| `.skilled/skills/sk-vision/hooks/opencode/sk-vision.ts`, `vision-runtime/scripts/build.ts` | Modified | The bundle comments |
| `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` | Rebuilt | 513975 bytes. The folder is gitignored |
| `.opencode/plugins/README.md` | Modified | The tools sentence |
| `.skilled/skills/sk-vision/hooks/README.md` | Modified | Section 4 says the build writes the hook bundle beside its source and it must not be committed |
| `../spec.md`, `../goal.md`, `../011-two-version-proof-and-closeout/implementation-summary.md`, `../012-sk-vision-v2-prompt-hook/implementation-summary.md` | Modified | Phase 13 in the map and log, and the closed items marked resolved |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator read the tool API from the published 2.0.32 packages and probed it live. It also took the baselines, ran every mutation, suite, battery and live probe, and authored the docs. DeepSeek wrote the code, tests and doc files through cli-pi in short literal briefs (`scratch/briefs/`). Luna reviewed read-only in four rounds. The live probe ran a private `opencode2 serve` with its own port, database and data folder. The shared OpenCode 2 service kept its start time throughout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The tool API comes from the published 2.0.32 types and a live probe (decision 1) | The v2 install ships only a binary, and the probe proved the host accepts both a zod and a JSON Schema input |
| One definition set for both hosts (decision 2) | `toV2Tools` wraps the OpenCode 1 definitions, so the two hosts cannot drift |
| The same gate as OpenCode 1 (decision 3) | `createDefaultAutoInspect` returns null without `SK_VISION_AUTOINSPECT=1`, so no tool and no client exist then |
| Tools register after the prompt hook and fail open (decision 4) | A rejected hook leaves nothing behind, and a rejected registration keeps the command and the hook |
| `close()` kills provisioning (decision 5) | Safe to interrupt: the next start provisions again, and `uv venv` replaces an existing venv (uv 0.8.3) |
| No live run of the grace path (decision 6) | The only model on this machine, `llmgateway/deepseek-v4.1-flash`, is on the text-only list, so a live run would take the full wait. Four unit tests and a mutation that fails all four cover it |
| Luna's round-4 P2s are fixed (decision 7) | The operator asked for the fixes. Each has a test that fails on the pre-fix code, and rounds 5 to 7 reviewed them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Suites against the baseline (`scratch/suites-before/`, `scratch/suites-after/`) | sk-vision 50 to 65 pass and 0 fail, typecheck exit 0 both times, plugins 356 to 356, v2 bridge, hard-plugin and registration files 50 to 50 |
| New tests against the old code (`scratch/mutation/`) | Old code: 3 fail. Grace forced to the full wait: 4 fail. Reverting each review fix: 2, 1 and 2 fail |
| Live private OpenCode 2.0.32 run from the final bundle (`scratch/proof/final-off/`, `final-on/`) | Flag off: 0 `sk_vision_*` of 65 tools. Flag on: 13 of 78, and `sk_vision_status` through `execute` returned `provider: photon`, `device: mps`, exit 0, USD 0.00007 |
| `opencode-version-battery.cjs --family=v1` and `--family=v2` | Exit 0 each, before and after (`scratch/suites-after/battery-v1.txt`, `battery-v2.txt`) |
| Luna review (`scratch/luna-1.txt` to `scratch/luna-4.txt`) | Rounds 1 to 3 FAIL on P2s, each fixed with a test. Round 4 PASS with four P2s |
| Suites after the round-4 fixes (`scratch/p2-before/`, `scratch/p2-after/`) | sk-vision 65 to 67 pass and 0 fail, typecheck exit 0, plugins 356 to 356, v2 bridge 39 to 39, battery exit 0 on both versions, shared service start time unchanged |
| Round-4 fix tests against the pre-fix code (`scratch/mutation/p2-*.txt`) | Probe test: fails before the fix and with the guards removed. Hook-failure test: fails before the fix. "Inspection off": fails with the gate broken. Disposal test: fails before each round-6 fix |
| Luna review of the round-4 fixes (`scratch/luna-5.txt` to `scratch/luna-7.txt`) | Rounds 5 and 6 FAIL on P2s, fixed. Round 7 PASS with no findings |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict` | `RESULT: PASSED` (`scratch/validate-recursive.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live run of the grace path.** Decision 6. A run with a model off the text-only list would confirm it end to end.
2. **A venv `mkdir` already in flight when `close()` runs can still create the empty directory.** The client stops right after it, so nothing installs or starts. The window cannot be timed in a unit test, so that guard has no test (Luna round 6).
3. **The round-4 fixes have no live rerun.** The live final-off and final-on runs predate them. Unit tests and the mutation runs cover them.
4. **`hooks/opencode/sk-vision.js` is still untracked here.** On this branch no ignore rule covers it, so stage files by name. The `.gitignore` change is commit `033dc36e97` on another branch.
<!-- /ANCHOR:limitations -->

---

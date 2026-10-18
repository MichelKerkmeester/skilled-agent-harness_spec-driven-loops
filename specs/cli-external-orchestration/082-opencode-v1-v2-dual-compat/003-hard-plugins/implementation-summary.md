---
title: "Implementation Summary"
description: "The five hard plugins load and behave on both OpenCode versions, the shared bridge carries every v2 leg, sk-vision is ported and rebuilt, and the review's four P1 findings closed in one fix run."
trigger_phrases:
  - "hard plugins implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins"
    last_updated_at: "2026-10-18T17:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase docs from the scratch evidence ledger"
    next_safe_action: "Run T025 validate, repair the generated metadata and keep the cited scratch captures"
    blockers: []
    key_files:
      - ".opencode/plugins/lib/v2-bridge.js"
      - ".opencode/plugins/lib/completion-sentinel-core.js"
      - ".opencode/plugins/lib/opencode-goal-core.js"
      - ".opencode/plugins/tests/v2-hard-plugins.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hard-plugins"
      parent_session_id: null
    completion_pct: 95
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
| **Spec Folder** | 003-hard-plugins |
| **Status** | Complete |
| **Completed** | 2026-10-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The five hard plugins now load and behave on both OpenCode versions. The four JavaScript plugins export `{ id, setup, server }` and get their v2 leg from the shared bridge, which gained a v1-shaped client over the v2 session calls, the event aliases with per-session dedupe, and the goal evidence and usage mappings. Two core modules hold the seams that left the default exports, the unread spec-gate seam was removed, and `sk-vision` registers its command through `ctx.command.transform` on v2 from a rebuilt bundle. The plugin suite moved from 331 to 353 passing tests with zero failures, the hard-plugin file moved from 9 failures to 10 passes, and the v2 read shows all five plugins active.

### Phase 3: hard-plugins

The phase ported `system-completion-sentinel`, `system-spec-gate`, `system-skill-advisor`, `opencode-goal` and `sk-vision`, and it moved the v2 legs into the phase 2 bridge under decision 5, so each v1 hook body stayed unchanged. It moved two seams to core modules, removed the spec-gate seam that no test read, added the `v2-hard-plugins.test.cjs` registration and behaviour cases, and rebuilt the `sk-vision` bundle. Its file list is in `spec.md` section 3, and the recorded deviations sit in the scope note of `spec.md` and the architecture note of `plan.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/system-completion-sentinel.js`, `system-spec-gate.js`, `system-skill-advisor.js`, `opencode-goal.js` | Modified | Each default export became `dualPlugin(id, server)` with the v2 leg carried by the shared bridge (decision 5). The spec-gate seam was removed because no test read it (decision 2). |
| `.opencode/plugins/lib/v2-bridge.js` | Modified | Gains the v1 client shim over the v2 session calls, the `session.execution.succeeded` to `session.idle` and `session.compaction.ended` to `session.compacted` aliases with per-session dedupe, and the goal evidence and usage mappings (decisions 5, 8). |
| `.opencode/plugins/lib/completion-sentinel-core.js`, `.opencode/plugins/lib/opencode-goal-core.js` | Created | Core modules that hold the two seams moved out of their entry modules (decision 2). |
| `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | Created | Five registration cases and five behaviour cases, including the goal evidence case the fix run added. |
| The goal, sentinel, spec-gate and skill-advisor test files | Modified | Calls moved to `.server`, the two seam readers moved to the core modules, and the spec-gate cases were wrapped for the child environment (decisions 6, 10). |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` and `src/opencode/command.ts` | Modified | The command registers through `ctx.command.transform` on v2, v1 keeps `command.execute.before`, and the bare base64 attachment is wrapped in a MIME data URL (decisions 3, 12). |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` | Created | Covers the data URL conversion. |
| `.skilled/skills/sk-vision/vision-runtime/dist/plugin.js` | Rebuilt | 506257 bytes, up from 504601. The folder `dist/` is gitignored. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The v2 hard-plugin file ran first against the unported tree and failed all 9 cases (`scratch/hard-before.txt:10-13`). The ports followed one dispatch at a time, with the goal port split into three, and the orchestrator ran the hard-plugin file and the plugin suite after each one. DeepSeek reviewed the diff and found four P1 items and no P0 (`scratch/review-003.txt:7-11`), Luna fixed all four in one run (`scratch/fix-003-report.txt:3-15`), and DeepSeek's verification closed them with no new P0 or P1 and a PASS verdict (`scratch/review-003-verify.txt:2`, `:35`). The orchestrator then reran the hard-plugin file, the plugin suite in both environments, the bridge and registration tests, the v1 harness, the v1 load read, the v2 read, the grep checks and the drift guards from the final state. The two approved live model runs are the one deviation from CHK-031's model-free rule, and the operator approved those two runs only (`scratch/evidence.md:24`). The strict validator runs at closeout, and its only errors are the expected GENERATED_METADATA items that the orchestrator repairs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Class of `system-skill-advisor` (decision 1) | It is hard, not mechanical: it reads session messages through the v1 client and reacts to `session.compacted`, which v2 does not deliver (`scratch/decisions.txt:3`). |
| Seam homes (decision 2) | The sentinel and goal seams moved to core modules, and the spec-gate seam was removed because no test read it (`scratch/decisions.txt:4-8`). |
| `sk-vision` named export (decision 3) | The `SkVisionPlugin` named export was removed so the file keeps one default export (`scratch/decisions.txt:9`). |
| `sk-vision` package pin (decision 4) | The pin of `@opencode-ai/plugin` 1.17.15 stays, because the bundle uses the type and the `tool` helper only, and the rebuilt bundle is what proves the v2 load (`scratch/decisions.txt:10-11`). |
| Shared bridge (decision 5) | The bridge carries the v2 leg for the four JavaScript plugins, so each v1 hook body stays unchanged and the mapping lives in one place (`scratch/decisions.txt:12-16`). |
| Goal test edit (decision 6) | One identifier changed from `testDir` to `__dirname`, which cleared 13 ReferenceError failures in the goal suite (`scratch/decisions.txt:17`). |
| Review fixes (decision 8) | The four P1s went to one fix run: the alias dedupe, the spec-gate test environment, the sk-vision base64 data URL, and the goal evidence and usage aliases (`scratch/decisions.txt:19`). |
| Recorded v2 gaps (decision 9) | Six v2 gaps are recorded rather than claimed, each with its evidence (`scratch/decisions.txt:20-25`). |
| Unconfirmed token limitation (decision 11) | The step-token mapping may undercount a multi-step assistant message, and the schema does not say which counting v2 uses (`scratch/decisions.txt:27`). |
| Helper export (decision 12) | `toV1FileUrl` is exported beside the default so the plugin test can reach it, and neither host loads it as a plugin (`scratch/decisions.txt:28`). |
| Scope rulings (decision 13) | Four changed paths outside section 3 are ruled in scope, each with its reason (`scratch/decisions.txt:29-33`). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict validation of this folder with `validate.sh --strict` | `RESULT: PASSED`, 0 errors and 0 warnings, after `repair-derived.cjs --apply` repaired the GENERATED_METADATA items (`scratch/validate.txt:51`). |
| v2 behaviour cases, failing before the port and passing after it (T008, T017) | 9 tests, 0 pass and 9 fail before (`scratch/hard-before.txt:10-13`), 10 tests, 10 pass and 0 fail after (`scratch/hard-after.txt:11-14`) |
| Plugin suite at or above the phase 2 floor (T018) | 353 pass, 0 fail against the floor of 331 (`scratch/suite-after.txt:363-366`, `scratch/baseline-floor.txt:3`), and the same 353 pass with `AI_SESSION_CHILD=1` (`scratch/suite-after-fix-child.txt:363-366`) |
| Bridge and registration tests | 50 of 50 pass (`scratch/fix-v2-tests.txt:51-54`) |
| v1 load capture and v2 active list (T019, T020) | 16 of 16 loaded in the v1 harness with no failed-to-load line (`scratch/v1-harness-after-003.jsonl:1-16`), 18 tool ids (`scratch/v1-tool-ids-after-003.json:3-21`), and 16 entries, 16 active on v2 including all five hard plugins (`scratch/v2-active-003.txt:1-16`) |
| sk-vision build and load (T015, T016) | Typecheck exit 0, build exit 0, `dist/plugin.js` 506257 bytes, `bun test` 29 pass and 0 fail (`scratch/sk-vision-build-after-fix.txt:1-15`) |
| Grep checks (T021) | One `export default` line per JavaScript entry module, no `__test` line, no `plugin/tool` import, no `default(` call, and no `return null` line changed (`scratch/grep-checks-003.txt:1-18`, `:73-74`) |
| Drift guards | `run-all-drift-guards.sh` exit 0, all 4 guards passed, 9 non-blocking warnings in files outside this phase (`scratch/drift-after-fix.txt`) |
| v2 service state | PID 46220 with the same start time as the phase 2 capture, so no step restarted it (`scratch/service-state.txt:2`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A bridged tool's execute on v2 is not observed live.** It needs a further model run, which the operator has not approved (`scratch/evidence.md:51`).
2. **Live delivery of `session.created` and `session.deleted` on v2 is not observed** (`scratch/evidence.md:52`).
3. **The step-token count is unconfirmed.** If v2 step tokens count one step rather than the whole message, a multi-step assistant message is undercounted (decision 11, `scratch/decisions.txt:27`).
4. **Six recorded v2 gaps are not fixed in this phase.** The goal blocked-by-prompt guard, plugin options, the advisor resume and disposal signals, automatic sk-vision image evidence, the ignored `{signal}`, and the idle alias after a failed or interrupted turn (`scratch/decisions.txt:20-25`, `scratch/decisions.txt:34`).
5. **The two approved live model runs are a deviation from CHK-031.** The runs were the only way to settle the event names, and the operator approved those two runs only (`scratch/evidence.md:24`).
<!-- /ANCHOR:limitations -->

---
title: "Implementation Summary: Cross-CLI Manual Testing of the Advisor Refinements"
description: "The nine advisor scenarios ran once in each of five CLIs, 48 dispatches in all. Pi and Devin deliver the advisor natively on every turn, Codex does on most, OpenCode never loads the plugin and Cursor's prompt hook never fires under -p. Every FAIL was traced, and thirteen findings went to phase 9."
trigger_phrases:
  - "cross cli test results"
  - "advisor scenario matrix"
  - "native advisor delivery per runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/008-cross-cli-manual-testing"
    last_updated_at: "2026-09-26T20:40:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Ran 48 scenario dispatches across five CLIs and traced every FAIL"
    next_safe_action: "Phase 9 fixes the findings and reruns the scenarios in every CLI"
    blockers: []
    key_files:
      - "evidence/ledger.tsv"
      - "evidence/native-diagnostics.jsonl"
      - "evidence/reports/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cursor's native advisor hook stays silent because beforeSubmitPrompt never fires under cursor-agent -p, which cli-cursor scenario CU-014 already records."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Cross-CLI Manual Testing of the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-cross-cli-manual-testing |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now see which advisor behaviors hold in each CLI, and which do not. The refined fallback, prompt gate and runtime label work wherever the host runs the hook. The runs also found an OpenCode plugin that never loads, a test that phase 4 left behind and a sandbox daemon that marks the live advisor unavailable. Phase 9 fixes them.

### Phase 8: cross-cli-manual-testing

Each dispatch carried one scenario, a read-only tester persona and a fixed report format. MiMo v2.6 Pro high ran through cli-pi and cli-opencode, SWE-2 high through cli-devin, Grok 4.7 high through cli-cursor and GPT-6 Luna high through cli-codex. The orchestrator checked every FAIL and BLOCKED against code or a rerun.

**Scenario results as reported.** The classification after each row is the orchestrator's.

| Scenario | pi | opencode | devin | cursor | codex | Orchestrator classification |
|---|---|---|---|---|---|---|
| CL-001 | FAIL | FAIL | FAIL | FAIL | FAIL | Scenario defect: it expects the diagnostic on the shim's stderr, which the shim has never forwarded. The record is in the diagnostics JSONL |
| CL-005 | PASS | PASS | PASS | PASS | PASS | Passes on unit tests only. It never loads the plugin in OpenCode, which hid the load failure |
| CL-006 | PASS | PASS | PASS | PASS | BLOCKED | Codex's BLOCKED is a scenario defect: step 3 discards the message it expects. The orchestrator saw the CLI print it with exit 64 |
| CP-003 | PASS | PASS | PASS | FAIL | FAIL | Correct behavior in all five. The skipped record appears in each run's window in the JSONL. Cursor and Codex looked on stderr |
| CP-004 | PASS | PASS | PASS | PASS | PASS | Passes, but three runs left a sandbox daemon running, and two sandbox daemon exits rewrote the live generation file |
| NC-001 | PASS | PASS | PASS | PASS | PASS | Clean |
| NC-004 | PASS | PASS | PASS | PASS | PASS | Clean. Its definition of ambiguity leaves out the score gap |
| 433 | PASS | PASS | PASS | PASS | PASS | Clean. The status-headed fallback fired with the daemon unreachable |
| 457 | FAIL | FAIL | FAIL | no report | FAIL | Code defects: a Pi test still expects a label phase 4 renamed, a Pi import resolves only through its symlink, and the cadence harness spawns a moved tree. Cursor ran an unscoped repository-wide vitest instead and was cut off by its watchdog |

**Native delivery per runtime.** Each CLI's own hook, read from the model's context and the diagnostics JSONL:

| Runtime | Model-visible Advisor line in 9 runs | Hook records | Casual `thanks` probe |
|---|---|---|---|
| Pi | live in all 9 | 9 ok | skipped, `short_casual_acknowledgement` |
| Devin | live in all 9 | 9 ok | skipped, `short_casual_acknowledgement` |
| Codex | live 3, outage 4, none 2 | 6 ok, 8 fail_open, in pairs | skipped, recorded twice |
| OpenCode | none | none | none |
| Cursor | none | none | none |

Codex runs the hook twice per prompt, from `.codex/hooks.json` and from a duplicate entry in the operator's global `~/.codex/hooks.json`. On a cold prompt the two calls race and both fail open at about 2.2 s. OpenCode logs `failed to load plugin ... Plugin export is not a function` for the advisor plugin. Cursor's `beforeSubmitPrompt` never fires under `cursor-agent -p`, as cli-cursor scenario CU-014 records.

Before the runs, Grok 4.7 joined the cli-cursor allowlist. Each of its eight ids answered a live dispatch with exit 0 first.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | Eight Grok 4.7 ids in `CURSOR_SUPPORTED_MODELS` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | The same ids in its mirror list |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts` | Modified | The 29-id allowlist assertions |
| `.skilled/skills/cli-external-orchestration/cli-cursor/` | Modified | Grok 4.7 in the roster, counts and references, and changelog `v1.5.0.0.md` |
| `evidence/` | Created | 49 reports, the ledger, the briefs, native hook records and the partial 457 harness output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator dispatched two runs at a time from a queue of 48, each under a 40-minute watchdog, with `SKILL_ADVISOR_DEBUG=1` so every host hook wrote a labelled record. It attributed records to runs by the start and end times in `evidence/ledger.tsv`. Three records from its own timing test are listed in `evidence/excluded-windows.tsv`. It read every report, reran contested steps itself, and traced each FAIL to a line of code or scenario text. MiMo v2.6 Pro high wrote the Grok 4.7 doc changes and the orchestrator reviewed each diff.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep "Use Grok" on Grok 4.6 high | The operator asked for Grok 4.7 to be dispatchable, not for the default to change |
| Report a verdict and a classification side by side | A FAIL that comes from a scenario defect would otherwise read as a code defect |
| Leave the fan-out deep-review scenarios out | Each nests a multi-model review, which Codex cannot nest. Phase 6 ran that path live |
| Restore an archived test-results file Cursor's unscoped vitest rewrote | It was a run artifact outside `evidence/`, and its diff held only run times and durations |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Allowlist tests, `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` | 257 of 257 before and after |
| `npm run typecheck` and `node --check` in the deep-loop runtime | Exit 0 |
| Full deep-loop runtime suite, `npx vitest run` | First run: 4 failed of 2,709 in 3 files, while Cursor's repository-wide vitest loaded the machine. One was a stale compiled `deep/review` contract from phase 7, regenerated in phase 9. Rerun with a JSON reporter: 2,709 tests, 0 failed |
| sk-doc `validate_document.py` on the nine changed cli-cursor documents | 0 issues. The playbook's two numbering warnings are identical at HEAD |
| `package_skill.py --check` on cli-cursor | PASS |
| Leftover state after the runs | The two sandbox daemons Cursor and pi left have exited. No tracked file outside `evidence/` still differs because of a run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Thirteen findings are open.** Phase 9 owns them: the OpenCode plugin exports, the Pi test and import, the cadence harness, the sandbox isolation of the generation file, launcher state and model server, the disabled-reason text, the Codex double registration and six scenario or doc defects.
2. **Cursor has no native advisor path under -p.** `beforeSubmitPrompt` does not fire there. It is a host limit, not a repository defect.
3. **A sandbox daemon can mark the live advisor unavailable until the next publish.** It happened twice during the runs. Each time the live daemon's watcher republished the file, most recently at 20:17:43Z as `state: live`, generation 488. Hook briefs stayed live throughout.
<!-- /ANCHOR:limitations -->

---

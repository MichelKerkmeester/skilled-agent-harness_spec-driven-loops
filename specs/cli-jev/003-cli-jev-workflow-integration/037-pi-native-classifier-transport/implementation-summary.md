---
title: "Implementation Summary: Phase 37: pi-native-classifier-transport"
description: "Planned. Nothing is built. This phase will measure whether Pi's native classifier runtime answers the packet's Jev questions as the jev CLI does, at a similar speed and cost, with a zero-call census by default and one live comparison run behind the operator's yes. No verdict exists yet."
trigger_phrases:
  - "pi transport summary"
  - "pi native classifier transport status"
  - "classifier census summary"
  - "pi transport planned state"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport"
    last_updated_at: "2026-09-30T13:22:09Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Wrote the planned-state stub. Nothing is built"
    next_safe_action: "Build the phase, then rewrite this file from the run evidence"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-037-pi-native-classifier-transport"
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
| **Spec Folder** | 037-pi-native-classifier-transport |
| **Status** | Planned |
| **Completed** | Not built. Planned 2026-09-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built. This file is a planned-state stub: it records what the phase will build, where the code will live, and which checks will decide it. No script, test or doc exists under the proposed paths yet, no live run has happened, and no `verdict pi-transport:` line exists.

### Phase 37: pi-native-classifier-transport

The phase will compare Pi's native classifier runtime against today's shell-out transport on the same questions. The first slice reads Pi's version, the classifier models known and available per provider, the jev CLI identity line, whether a llama.cpp router answers, and the replay row count, all with zero model calls. The second slice sits behind its own switch and the operator's yes, replays the 019 rows through `ModelRuntime.classify()` on `openrouter` `typesafe/jev-1.13`, and compares them against the recorded CLI answers in the 019 `calls.jsonl` under the keep rule fixed in `spec.md` section 4.

### Files Changed

One row per planned file. Nothing below exists yet, so every action is `Planned`.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` (proposed) | Planned create | The census, the live arm, the metrics and the keep-rule verdict |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` (proposed) | Planned create | Every public surface, both backends stubbed, `node --test` |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md` (proposed) | Planned create | The folder README through sk-doc |
| `.skilled/skills/cli-classifier/benchmark/README.md` | Planned modify | One row in section 2 LAYOUT for the new folder |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md` and `feature-catalog/feature-catalog.md` (proposed) | Planned create and modify | The catalog entry and its index row |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-comparison.md` and `manual-testing-playbook/manual-testing-playbook.md` (proposed) | Planned create and modify | The playbook scenario and its index row |
| `<operator-named report dir>/` | Planned at run time | `report.json` and `calls.jsonl` from the one approved live run |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Planned modify | Filled as a Planned phase on 2026-09-30, docs only |
| `description.json`, `graph-metadata.json` | Derived | Refreshed through `repair-derived.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The phase is Planned, and this stub was written on 2026-09-30 from `scratch/context/context.md` and the operator's "Test it first (Recommended)" answer.

The planned path is the parent D5 roster through this phase's D6: DeepSeek V4.1 Flash writes the script, its tests and the docs, MiMo v2.6 Pro reviews every DeepSeek diff, and DeepSeek reviews any MiMo fix. The session runs the zero-call census on the real tree and the one approved live run, records every result in `goal.md`'s log and `acceptance-criteria.md`, and commits path-scoped.

Two design questions decide how the live arm is built, and both are open in `spec.md` section 10. Whether `score-suggested-order.mjs` exports the prompt builder a replay needs is UNKNOWN until the design reads it, with a fresh both-sides fixture as the proposed fallback. Whether a same-day CLI rerun is needed for a fair latency comparison is the design's decision from the recorded `call_ms` shape.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The default run is a zero-call census (D1) | The packet's pattern from phases 002 and 019: read what is installed and available before any call costs anything |
| Pi is reached through its SDK from a Node script (D2) | The SDK is one of the three documented classifier surfaces (`docs/models.md:103-136`), and a script keeps credentials in Pi's own store |
| Both sides ask Jev 1.13 (D3) | The CLI's 019 baseline ran `jev-1.13.0` through `official`, and Pi can ask the same model through `openrouter` `typesafe/jev-1.13`, so the rows line up |
| The keep rule is fixed in `spec.md` before any live run (D4) | A threshold chosen after the numbers arrive would decide the run rather than measure it |
| No integration change here (D5) | The verdict comes first. Wiring Pi into a transport is a later phase on the operator's call |
| DeepSeek writes and MiMo reviews (D6) | Parent D5's roster, with the reverse direction for any MiMo fix and no Claude worker |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Nothing is verified. Every check below is pending the build, and each row will be rewritten from the run's own output at closure.

| Check | Result |
|-------|--------|
| `node $S` default census on the real tree | Pending. Nothing is built, so no census line exists |
| `node --test $T` over the stubbed backends | Pending. The test file does not exist yet |
| The key grep on `$S` | Pending. The script does not exist yet |
| `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on each changed doc | Pending. No changed doc exists yet |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport --strict` | Pending the closure pass. The planned state is not closeable |
| The one approved live run and its `verdict pi-transport:` line | Pending. Waits on the build and the operator's yes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nothing is built.** All five acceptance criteria are `Unmet`, no verdict line exists, and this file will be rewritten from the run evidence at closure.
2. **The replay's prompt source is UNKNOWN.** Whether `score-suggested-order.mjs` exports the builder the replay needs is unresolved until the design reads it. The proposed fallback is a fresh fixture both sides rerun on.
3. **No live number exists.** The agreement, probability-difference, latency and cost figures all wait on the operator's yes for one live run.
4. **The speed comparison may need a same-day CLI rerun.** Whether the 019 `call_ms` values are comparable to a fresh Pi latency is the design's decision, and a rerun also waits on the operator's yes.
5. **The llama.cpp column is doubly gated.** It needs the operator's install yes, because the machine has no `llama-server` or `llama-cli`, and its raw label probabilities are documented as overconfident (`docs/llama-cpp.md:89-99`).
<!-- /ANCHOR:limitations -->

---


---
title: "Implementation Summary: Phase 38: pi-classifier-transport-integration"
description: "Complete. Pi's native classifier runtime is now an opt-in transport for Jev `choice` questions: one shared module answers a `choice` question through Pi and returns the CLI's result shape, two approved callers opt in behind byte-identical switch-off recordings, every gate failure prints one skip line and falls back to the jev CLI, and `cli-jev` and `cli-pi/SKILL.md` document the route. The build sits uncommitted at HEAD `c5c72d31ec`, and the orchestrator commits it path-scoped."
trigger_phrases:
  - "pi classifier transport summary"
  - "pi transport integration status"
  - "transport switch status"
  - "caller opt-in status"
  - "pi transport follow-up list"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration"
    last_updated_at: "2026-09-30T19:47:37Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Rewrote this file with the build, review and gate results"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-038-pi-classifier-transport-integration"
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
| **Spec Folder** | 038-pi-classifier-transport-integration |
| **Status** | Complete |
| **Completed** | 2026-09-30; the build sits uncommitted at HEAD `c5c72d31ec` in worktree 071 and the orchestrator commits it path-scoped after this pass |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The switch is built and Pi answers when asked. `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` resolves the transport in one place, answers a `choice` question through Pi's classifier runtime on `openrouter` `typesafe/jev-1.13` when the caller or the environment names Pi, and otherwise runs the caller's own `jev` spawn unchanged, so the default path stays byte-identical. Every gate failure prints exactly one skip line and falls back to the CLI. The build sits uncommitted at HEAD `c5c72d31ec`.

### Phase 38: pi-classifier-transport-integration

**The module.** `jev-transport.mjs` exports `resolveTransport`, `choiceRequestFrom`, `classifierContextFor`, `choicePayloadFor` and `spawnClassifierCall`. `JEV_TRANSPORT` in the caller's env or the `transport` option picks Pi; unset, empty or `jev` stays on the CLI and an unknown value prints `skip: unknown transport '<value>', using jev CLI`. Only a `choice` request reaches Pi. The three gates of `spec.md` section 4 are checked in order, each failure printing exactly one skip line before the CLI branch, and the module has no top-level await, so both `.cjs` callers can `require` it. It calls `ModelRuntime.create()` and reads no credential.

**The callers.** Two approved callers opted in with one `require` and one call-site line each: `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `score-clarify-default.cjs`. The 037 scorer's CLI arm was rejected by design, because it is the CLI column of a measurement, and it stays unmodified. The 13 runtime-tree callers of `spec.md` section 3 stay with their owners.

**The docs.** `cli-jev/SKILL.md` gains a Transport Selection section (0.1.2.0 to 0.1.3.0, changelog `v0.1.3.0.md`), `cli-pi/SKILL.md` a classifier section (1.5.12.0 to 1.5.13.0, changelog `v1.5.13.0.md`), and the catalog entry and playbook scenario land with their index rows.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Created | The opt-in transport module: `resolveTransport`, `choiceRequestFrom`, `classifierContextFor`, `choicePayloadFor`, `spawnClassifierCall` (D1 to D4) |
| `.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | Created | 22 rows over every public surface, both backends stubbed, one row per gate (D4) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `score-clarify-default.cjs` | Modified | One `require` line and one call-site line each, the two approved `choice` callers (D1, D3) |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` and `cli-jev/changelog/v0.1.3.0.md` | Modified and created | The Transport Selection section: the switch, the routes, the skip lines, `choice` only, credentials in Pi's store (D5) |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` and `cli-pi/changelog/v1.5.13.0.md` | Modified and created | The classifier section for Pi workers; an answer is evidence, never permission (D5) |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` and `feature-catalog/feature-catalog.md` | Created and modified | The catalog entry and its index row |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md` and `manual-testing-playbook/manual-testing-playbook.md` | Created and modified | The playbook scenario and its index rows |
| `.skilled/skills/cli-classifier/SKILL.md` | Modified | The `Offline Measurement` sentence pointing at the entry |
| The three `.hermes/skills/` copies of `cli-classifier`, `cli-jev` and `cli-pi`, and the two compiled-routing activation manifests | Regenerated | By their own tools, never hand-edited (`scratch/verify/h.txt`, `scratch/verify/g.txt`) |
| `scratch/w4-build/design.md` and the 17 files under `scratch/verify/` | Created | The design note, the two recorders, both recording pairs, the three suite captures, the review and the session record |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | The phase record, closed in this pass |
| `description.json`, `graph-metadata.json` | Derived | Re-derived through `repair-derived.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash on cli-pi (Cline, xhigh) wrote the design and every build step, all STATUS DONE, in three batches: M1 the design read and the module with its tests (design steps 1 to 5), M2 the two caller opt-ins with their before and after recordings (steps 6 and 7), and M3 the docs (steps 8 to 12). The env-switch test landed after review. SWE 2 max on cli-devin reviewed read-only (`scratch/verify/review-swe2-r1.txt`, 979 s): `VERDICT: PASS` with all five criteria met, after the operator dropped MiMo mid-build and stopped the MiMo review that had started; the roster amendment is `c5c72d31ec`. The review's four P2 findings are recorded: the `calls.jsonl` backend field (recorded, it needs a caller record change), the missing env-switch test (fixed with `spawn_call_environment_switch_answers_through_pi`), the unpinned Pi version (recorded) and the still-stub closure docs (closed by this record). No P0 or P1 was open. The session ran the byte comparisons and every gate from the final state, and no live smoke call ran because it is optional and no operator yes was given.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The jev CLI stays the default (D1) | 037 measured Pi only for `choice`, and a default change would move every caller's behavior at once |
| Only `choice` moves (D2) | 037's `adopt` covers `choice` over 111 rows, and `bool` and `score` have no measured basis yet |
| The transport returns the CLI's shape (D3) | An opting-in caller then changes one call and keeps its parsing |
| A gate failure prints one skip line and falls back (D4) | A silent switch would make a Pi failure look like a Pi answer |
| Credentials stay in Pi's own store (D5) | The transport then never touches a key, and runtime trees owned by other packets are not edited |
| DeepSeek writes and SWE 2 max or Luna 6 max reviews (D6) | Parent D5's roster, with the reverse direction for any fix the reviewer writes and no MiMo or Claude worker |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All checks ran from the working tree at HEAD `c5c72d31ec`, with the raw outputs under `scratch/verify/`.

| Check | Result |
|-------|--------|
| Each changed caller's switch-off `diff` against its pre-change recording | `diff -q` prints nothing: `leaf-route-replay.before.txt`/`.after.txt` (59 lines) and `score-clarify-default.before.txt`/`.after.txt` (202 lines); the reviewer reproduced each before file from HEAD's source in memory and each after file from the current tree, the runs driving 16 and 91 jev calls through the changed call site (`scratch/verify/review-swe2-r1.txt`) |
| `node --test` on the transport suite | `scratch/verify/transport-tests.txt`: `tests 22`, `pass 22`, `fail 0`, including `spawn_call_environment_switch_answers_through_pi` added after review |
| The caller suites | `scratch/verify/leaf-route-replay-tests.txt` 37 pass and `scratch/verify/score-clarify-default-tests.txt` 28 pass, both 0 failed and equal to their baselines |
| The key grep of REQ-006 on the module | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization'` prints nothing at exit 1 (this closure pass) |
| `git diff --stat` on the three runtime trees | No output; the 13 callers stay listed in `spec.md` section 3 (this closure pass) |
| `validate_document.py` on each changed doc | 9 changed docs VALID; hub playbook PASS with 8 scenarios and `warnings=0`; catalog `cli-classifier` PASS; no cli-classifier version at or above 1.0.0.0 (`scratch/verify/session-evidence.md`, criterion 4) |
| The hub, leaf, derived and Hermes checks | `scratch/verify/g.txt` all seven hubs fresh or excused, `l.txt` leaf 15 of 15, `df.txt` derived 15 of 15, `h.txt` 72 Hermes skill copies in sync |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this phase and the parent, `--strict --recursive` | `RESULT: PASSED` for every folder in this closure pass |
| `check-goal.cjs` and `goal.cjs packet` | `RESULT: PASSED (5/5 checks)` on this phase and the parent; `goal.cjs packet` prints `packet_durable_chars=2146` on this phase and `packet_budget=ok` on the parent (this closure pass) |

### Authoring pass (2026-09-30)

These gates ran on the phase docs only. They prove the record is well formed, not that anything is built.

| Check | Result |
|-------|--------|
| `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --apply` | Exit 0, `inspected=1 repaired=1 failed=0` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --strict` | `RESULT: PASSED`, `Errors: 0  Warnings: 0`, exit 0 |
| `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration` | `RESULT: PASSED (5/5 checks)`, exit 0 |
| `node .skilled/hooks/goal/bin/goal.cjs packet specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --workspace "$PWD"` | `STATUS=OK ACTION=packet`, `packet_durable_chars=2121`, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration` | `PASS` with zero placeholder patterns, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`calls.jsonl` names the wrong backend when Pi answers.** Both opted-in callers write `backend: "jev"` and the CLI provider even on the Pi path; `model` does pick up `typesafe/jev-1.13`. The module returns the CLI's contract on purpose (D3), so naming the backend needs a caller record change; recorded and not made (review P2-1).
2. **No Pi version is pinned.** The package gate resolves the installed Pi root and accepts any version, while the 037 verdict holds for 0.99.1. The fixed gate wording says "resolves", so the pin is recorded as a follow-up (review P2-3).
3. **Only `choice` moves.** `bool` and `score`, including `noul`, stay on the CLI until each passes its own run under 037's keep rule (D2).
4. **The runtime-tree callers are untouched.** The 13 callers listed in `spec.md` section 3 keep the CLI, and a later phase on the operator's call wires the ones it owns.
5. **No live smoke call ran, and the build is uncommitted at this pass.** Tests stub both backends, so one live `choice` call waits on the operator's yes, which was not given (REQ-012); the orchestrator commits the build and these docs path-scoped after this pass.
<!-- /ANCHOR:limitations -->

---

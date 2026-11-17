---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. The 43 items of review pass one's work groups WG1 to WG13 are fixed, each with a test, and 12 verifier follow-ups are fixed on top. The advisor suite went from 1712 to 1744 passed with 0 failed, every floor held and all 33 acceptance criteria are Met. The work is in the working tree on top of 320e7b64d4 and is not committed yet."
trigger_phrases:
  - "review remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation"
    last_updated_at: "2026-11-13T09:43:02Z"
    last_updated_by: "claude"
    recent_action: "Recorded the build evidence, marked all 33 acceptance criteria Met and closed the phase"
    next_safe_action: "Build phase 015"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "closeout-014-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 014-review-remediation |
| **Completed** | 2026-11-13. AC-001 to AC-033 are `Met` |
| **Commit** | Not committed. The code is in the working tree on top of `HEAD` `320e7b64d4`, and the coordinator commits it after this close-out |
| **Level** | 2 |
| **Verified on** | `scratch/after.txt`, `scratch/repro-after.txt`, `scratch/arena-smoke.txt` and `scratch/boundaries.txt` ran on the working tree over `320e7b64d4`. The close-out reran every acceptance verify command from the same tree on 2026-11-13 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fault in the middle of an embed now ends in a verified restore or a printed reason why not, and it exits 3. The hub attach path no longer offers a writing command on a no-edit prompt, a file name or a mention of another deep-loop command. The renderer tests pass inside a dispatched child. A live behaviour arm now runs only in a marked arena with an allowlisted environment.

### Phase 14: review-remediation

The embed engine checks every backup entry against its recorded hash before it restores any, and it writes nothing when one fails. A write that throws after the backup restores the tree, prints the `backup:` and `undo:` lines and exits 3. A failed restore inside that branch still prints both lines. A line outside the block that no template ships now fails plan and apply as a dropped line does. A linked `REPO RULES.md` or Cursor mirror that the run would write is refused with exit 2.

`command-attach.ts` now owns `NO_EDIT_REQUEST`, and `fusion.ts` imports it. The deep-loop gate opens only for the command being attached or for depth wording. A dot or a slash followed by a word character continues a file name, so `/create:skill.md` is no typed command. The deriver no longer emits `COMMAND_POLICIES`, and `TRACKED_COMMANDS` is the one attach-path table.

The renderer prints `(needs a mode)` whatever row the id has and names the owner skill on that head. It takes the child downgrade's class from the printed command's row. The golden and envelope tests stub `AI_SESSION_CHILD`, and a parity case holds the renderer's child rule equal to the spec gate's.

The behaviour runner can be imported by a test and runs its CLI through a symlink. It builds the child environment from an allowlist and refuses a live arm without the arena marker or with a remote. The scorer labels g2 rows from the runner's `G2_ROWS` table.

The advisory fixes cover the A10 and A11 checks, the two hook checks, the setup, symlink, install and embedder workflows, the baseline capture, the four shared session readers, the subprocess output cap, the bench matrix and the READMEs and catalog pages that describe them. The recaptured baseline publishes no per-row outcome for a holdout row.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `RAD` is `ADV/scripts/routing-accuracy`, `DS` is `.skilled/commands/doctor/scripts`, `DA` is `.skilled/commands/doctor/assets`, `SR` is `.skilled/hooks/shared/session-readers`, `SRT` is `.skilled/hooks/shared/tests/session-readers` and `SKA` is `.skilled/skills/system-skill-advisor`. `git diff HEAD --stat -- .skilled` prints `55 files changed, 1158 insertions(+), 540 deletions(-)`, and four new test files are untracked.

| File | Action | Purpose |
|------|--------|---------|
| `DS/agents-md-embed.cjs`, `DS/tests/agents-md-embed.test.cjs` | Modified | Verified restore, exit 3 on a write fault, the guarded restore, the foreign failure and the link refusal |
| `DA/doctor-agents-md-embed.yaml`, `DA/doctor-agents-md-presentation.txt` | Modified | The workflow reads exit 3, the foreign line and the link refusal |
| `ADV/lib/command-attach.ts`, `ADV/tests/command-attach-guards.vitest.ts` | Modified, Created | The shared no-edit pattern, the deep-loop gate, the file-name boundary and the absent policy table |
| `ADV/lib/scorer/fusion.ts` | Modified | Imports `NO_EDIT_REQUEST` and drops an empty branch |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs`, `ADV/scripts/command-bridges/README.md`, `ADV/lib/README.md` | Modified | No `COMMAND_POLICIES` emitted, and the READMEs name `TRACKED_COMMANDS` and the guards |
| `ADV/lib/render.ts`, `ADV/tests/command-brief-golden.vitest.ts`, `ADV/tests/render-child-session.vitest.ts`, `ADV/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modified | The needs-a-mode head, the downgrade class and the child-marker isolation |
| `RAD/run-command-behaviour.mjs`, `RAD/prepare-behaviour-arena.mjs`, `RAD/score-command-transcripts.mjs`, `ADV/tests/command-behaviour-guards.vitest.ts` | Modified, Created | The entry guard, the env allowlist, the arena marker and refusal and the g2 labels |
| `DS/agents-md-check.cjs`, `DS/tests/agents-md-check.test.cjs`, `DS/README.markdown` | Modified | A10 link and pointer reports, A11 malformed rows and four child checks |
| `DS/codex-hook-approval-check.cjs`, `DS/hook-wiring-check.cjs` and their two tests | Modified | Flag-value refusal, the absent-entry repair line and the wiring matcher |
| `DA/doctor-setup.yaml`, `.skilled/commands/doctor/setup.md`, `DA/doctor-setup-presentation.txt`, `DA/doctor-symlink-check.yaml`, `DS/tests/doctor-setup-contract.test.cjs` | Modified, Created | The repair routing, unrecorded hook health, the socket folder and the status precedence |
| `DA/doctor-install-presentation.txt`, `DA/doctor-install.yaml`, `DS/tests/doctor-install-contract.test.cjs` | Modified | The six runtimes by name and DSH not offered |
| `DA/doctor-skill-advisor-embedder.yaml`, `DS/tests/skill-advisor-route-contract.test.cjs` | Modified | `OLLAMA_HOST` from the resolved URL and the non-local refusal |
| `RAD/capture-command-routing-baseline.mjs`, `RAD/command-routing-baseline.json`, `ADV/tests/command-routing-slice.vitest.ts` | Modified | No holdout row published, the recaptured baseline and the empty-set guard |
| `RAD/README.md` | Modified | 14 code files, 21 listed files, exit 3, the arena refusal, the allowlist and `offerReached` |
| `SR/claude.mjs`, `SR/devin.mjs`, `SR/dsh.mjs`, `SR/pi.mjs`, `SR/README.md` | Modified | The Devin transcript fallback and reads from the contained path |
| `SR/*.d.mts.map` (four files) | Regenerated | Written by `session-reader-declarations.mjs` only |
| `SRT/devin.test.mjs`, `SRT/dsh.test.mjs`, `SRT/pi.test.mjs`, `ADV/tests/hooks/advisor-runtime-list-parity.vitest.ts` | Modified | The fallback case, the sourceless DSH pin, the Pi link case and the readers' runtime table |
| `ADV/lib/subprocess.ts`, `ADV/tests/subprocess-output-cap.vitest.ts` | Modified, Created | The 1 MiB cap on the advisor child's stdout and stderr |
| `ADV/bench/hook-brief-signal-noise.bench.ts` | Modified | A `not-recorded` row for every advisor runtime |
| `SKA/README.md`, `SKA/ARCHITECTURE.md`, `SKA/feature-catalog/scorer-fusion/command-meaning-matching.md`, `SKA/feature-catalog/cli-surface/advisor-recommend.md` | Modified | 46 rows, the DSH adapter, the row shape and the gates |
| `scratch/` | Created | Before and after numbers, probe outputs, the arena smoke, the boundary checks, 64 worker briefs and 128 log files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash max workers ran through OpenCode, one task per worker. The lanes owned different files and ran side by side. The workers built 64 tasks: T004 to T055 in waves 1 to 3 and T062 to T073 in wave 4. `scratch/briefs/` holds 64 briefs, and `scratch/logs/` holds one `.out` and one `.err` file per brief.

An independent Opus verifier then checked every worker task. It read the diff and reran each Verify clause. The coordinator's record of those runs reads part one 47 of 47 PASS, T040 and T041 PASS, T053 to T055 PASS and wave 4 T062 to T073 12 of 12 PASS. That makes 64 tasks, the same count as the briefs. The verifier reports are not stored in `scratch/`.

The coordinator ran T001 to T003 and T056 to T060. That covered the before numbers, the order against phase 015, the build, every suite and floor, the six probes, one arena and the boundary checks. Every Vitest command ran as `env -u AI_SESSION_CHILD npx vitest run`, except the marker run that T056 names.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The shared `NO_EDIT_REQUEST` pattern stays as it is. This was decided without the operator, under goal decision D1, with no code change | A prompt that only limits the scope of a change, such as "create a skill and do not change the existing skills", keeps its skill and loses the command. That fails toward no offer and matches what the scorer path already did |
| The behaviour runner's child environment allowlist stays as it is. This was decided under D1, with no code change | The operator shell sets no proxy or certificate variable, so the allowlist drops nothing a live turn needs today |
| `COMMAND_POLICIES` is deleted at its emitter | A generated block that no reader used kept a second policy table beside `TRACKED_COMMANDS`, and regenerating removes it at the source |
| Wave 4 (T062 to T073) was added after the first verifier reports | It fixes what they flagged. That covers a stderr cap test that passed without the fix, the bench header, the hook-wiring matcher, the unguarded restore, a detached comment, the symlink status precedence, the symlink-blind entry guard, an arena comment, the Pi header read order, the raw id on a needs-a-mode head, the holdout empty-set guard and three README sentences |
| T070's verify pattern ends in the call's semicolon | The helper's own signature matched the first pattern, so the check could not tell the call apart from the definition |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T056 `VALL` | 182 files and 1744 tests passed, 6 skipped, 0 failed, exit 0. Before: 179 files and 1712 passed |
| T056 marker run | `AI_SESSION_CHILD=1` over the golden, envelope and child-session files: 3 files and 28 tests passed. Before: 10 failed and 5 passed of 15 over the first two files |
| T056 `VB` | `4 passed (4)`. Before: `1 failed \| 3 passed (4)` |
| T056 `DALL` and `VSR` | `pass 1188`, `fail 0` and `pass 93`, `fail 0`. Before: 1164 and 90 |
| T057 `FLOOR` | Typed recall `{"correct":24,"total":44}`, false offers `{"count":0,"total":35}`, typed delivery 44 of 44 and plain tune 23 of 45, equal to before |
| T057 `EVAL` | `[160,50,21,5]`, equal to before |
| T057 `TC`, `RV`, `SRM`, `SRD --check`, `DERIVE` | Exit 0, exit 0, `256 mirrors across 10 trees are in sync`, `20 file(s) current` and `fresh` |
| T057 `G2SUM` | `{"claude":"3 of 6","codex":"0 of 6","devin":"4 of 6","dsh":"3 of 4","opencode":"5 of 6","pi":"4 of 6"}`, equal to before |
| T057 `HOLD` | `{"holdout":44,"rows":0,"attachedRows":0,"typedRows":0}`. Before: `"rows":44`. `scratch/after.txt` ends `RESULT: every floor holds` |
| T058 probes | `main returned 3`, `restored line: true`, `after: CLAUDE.md`, `plan exit=2` with `ci.yml` digests `b8ae3686e91b` before and after, `undefined` on the no-edit, `/deep:ai-council` and file-name lines, `'COMMAND_POLICIES' in module -> false`, `(needs a mode)` and `(parent-named only)` on the two render lines and 15 `apply exit 0` lines |
| T059 arena | The builder printed `"ok":true`, `test -f` on the marker exited 0, `liveArmRefusal` printed `null` and `test -e` on the temporary folder exited 1 |
| T060 boundaries | `AGENTS.md` and `scorer/text.ts` are unchanged, the package diff stat is empty, the label scan over the diff and the four new test files prints nothing and the status lists only files this phase's tasks name |
| Close-out reruns | `NT` on the embed, check, Codex, wiring, setup contract, install, route contract and Devin tests reports `fail 0`. `VX` on the attach guards, behaviour guards, golden, child-session, output cap, slice and parity files reports 0 failed. The six probes print the T058 lines again |
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Test first, each failing run observed | For most tasks the failing-before run comes from the worker's own log plus the verifier's reading of the code | That is inference. Every test-first log holds a failing-run marker, but a log can echo its brief. Only for T062 did the verifier watch the case fail, with two scratch copies of the module |
| `rg -n "COMMAND_POLICIES" .skilled` prints nothing | It prints one line, `command-attach-guards.vitest.ts:86` | That is the T013 case that pins the table as absent. The same search with the tests excluded prints nothing |
| The parent `spec.md` is unchanged | It differs from `HEAD` by 4 added lines | Planning wrote the phase map and handoff rows for phases 014 and 015. No worker task edits that file |
| `plan.md` section 4 names nine wave 4 lanes, T062 to T072 | `tasks.md` runs ten lanes, T062 to T073 | T073 was added to the task list after the plan was written, and `plan.md` was not updated |
| T070's verify pattern is `headerOf\(filePath\)` | The pattern ends in the call's semicolon | The first pattern also matched the helper's own signature |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hook-wiring matcher misreads some shell shapes.** It reads `true; node <script>` and `cd x;node <script>` as missing and `echo 'x && node <script>'` as wired. It also reads `node --no-warnings <script>`, `/usr/bin/env node <script>` and `zsh -c 'node <script>'` as missing. No Skilled installer writes any of these shapes, so this is recorded and not built.
2. **The new Pi reader test compares against an unresolved temp path.** A regression that opened the resolved path would still pass it.
3. **Two holdout guards change nothing today.** The `typedRows` and `attachedRows` guards in the capture script filter nothing on today's corpus, because only `rows` ever held holdout ids.
4. **A third copy of the no-edit wording remains.** `scorer/text.ts` line 148 keeps its own pattern. The plan records it, and this phase may not edit that file.
5. **Review pass two has not run.** It reviews this code and is the packet's gate, not this phase's.
<!-- /ANCHOR:limitations -->

---

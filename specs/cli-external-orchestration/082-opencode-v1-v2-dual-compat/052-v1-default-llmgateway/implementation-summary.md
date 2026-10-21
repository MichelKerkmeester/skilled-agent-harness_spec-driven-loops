---
title: "Implementation Summary"
description: "cli-opencode used to pick its default model by OpenCode version, and the OpenCode 1 half stopped answering once the opencode-go Go quota was spent. Both versions now default to llmgateway/deepseek-v4.1-flash, one live unpinned dispatch on each exits 0 and replies OK, and the split that made an unpinned lineage depend on which binary PATH resolved is gone."
trigger_phrases:
  - "v1 default llmgateway implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/052-v1-default-llmgateway"
    last_updated_at: "2026-10-21T19:30:00Z"
    last_updated_by: "deepseek-v4.1-flash-high"
    recent_action: "Wrote the packet and closed the 043, 006 and 036 records; both live dispatches replied OK"
    next_safe_action: "Push to main, then record the commit hash and every workflow's run id in this file"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "052-v1-default-llmgateway"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "cli-opencode default model: llmgateway/deepseek-v4.1-flash on both OpenCode versions (operator, 2026-10-21)"
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
| **Spec Folder** | 052-v1-default-llmgateway |
| **Status** | Complete |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An unpinned cli-opencode lineage used to get a different model depending on which OpenCode binary PATH resolved, and the OpenCode 1 half had stopped returning a reply: the opencode-go Go-plan quota is spent, so it hung on `Go usage limit exceeded` until the alarm, and a retry on 2026-10-21 exited 142. Both versions now default to `llmgateway/deepseek-v4.1-flash`, written in each version's own syntax, and one live unpinned dispatch on each version exits 0 and answers OK.

### Phase 52: v1-default-llmgateway

The operator chose "Use llmgateway" on 2026-10-21, which collapsed the per-version split phase 043 introduced. `OPENCODE_DEFAULT_MODEL` is now `llmgateway/deepseek-v4.1-flash` and `OPENCODE_V2_DEFAULT_MODEL` is gone with its export, so `buildOpencodeLineageCommand` has one fallback and the version only decides whether the flag is spelled `--model <id> --variant max` or `-m <id>#max`. A lineage that pins its own model never reaches the constant, so existing pinned dispatches behave exactly as before.

The reason is a quota, not a preference: `opencode-go/deepseek-v4.1-flash` cannot answer on OpenCode 1 here, and OpenCode 2 lists no opencode-go provider at all, so keeping the split would have left one working default and one that times out. `opencode-go` stays a documented, selectable provider: its provider section, its route rows and every example that names it for its own sake still read as they did, and only the default claims moved.

The docs follow the runtime. `SKILL.md`, the README, eight reference files, the dispatch templates and 22 playbook scenarios now state the one default, the default-model script test holds each table's default marker and the syntax `SKILL.md` pins, and the Hermes copy regenerates from the edited skill. Phase 043's OpenCode 1 live dispatch moves from BLOCKED to PASS against `../043-v2-default-model-and-follow-ups/scratch/live/` replaced by this phase's run, its Known Limitation 1 is marked resolved, and the same note lands on 006 Known Limitation 3 and 036 Known Limitation 5, which both still described OpenCode 1 as keeping `opencode-go`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | One `OPENCODE_DEFAULT_MODEL`; the per-version pick and `OPENCODE_V2_DEFAULT_MODEL` removed |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`, `fanout-run.vitest.ts` | Modified | The OpenCode 1 unpinned test expects llmgateway and rejects opencode-go; the drift-table row for the deleted constant is gone |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` | Modified | opencode-go marks no default, llmgateway marks one, and `SKILL.md` pins llmgateway in each version's syntax |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, `README.md` | Modified | One default for both versions, in each version's syntax |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/` (8 files) | Modified | `providers-and-models`, `cli-reference`, `install-and-versions`, `context-budget`, `agent-delegation`, `integration-patterns`, `opencode-tools` and `destructive-scope-violations` name llmgateway as the default on both versions |
| `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | Modified | The dispatch templates use the llmgateway default |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/` (22 files) | Modified | Each scenario's expected argv matches the one default, and none calls llmgateway "the OpenCode 2 default" |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerated | From the edited `SKILL.md`; 1 of 68 copies rewritten |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | This phase's packet, filled from the scaffold |
| `graph-metadata.json` | Regenerated | Derived metadata re-derived from these docs by `repair-derived` after they were written |
| `../043-v2-default-model-and-follow-ups/` (`spec.md`, `tasks.md`, `implementation-summary.md`) | Modified | Status Complete, REQ-001's note, T017 closed, the OpenCode 1 row PASS, Known Limitation 1 resolved |
| `../006-cli-opencode-dual-dispatch/implementation-summary.md`, `../036-cli-opencode-docs-and-vision-test-cleanup/implementation-summary.md` | Modified | Their `opencode-go`-keeps-v1 limitations carry the update |
| `../spec.md` | Modified | The phase map row for 052, the 043 status and the 050 to 052 handoff row |
| `../graph-metadata.json` | Regenerated | The parent packet's derived metadata, re-derived so its child list carries this phase |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One writing executor and one reviewer, both DeepSeek v4.1 flash through `cli-pi` on `llmgateway`, driven from eight one-change briefs and one review brief (`scratch/briefs/`). The runtime and the tests were written at max thinking, the docs at high, and the packet at high. The reviewer was a separate read-only session at max, and Luna was not used.

The review returned PASS with no P0 or P1 and two P2s. The first was nine playbook notes that still called llmgateway "the OpenCode 2 default", which now implies a difference that does not exist; a wording brief fixed all nine. The second was this packet, which was still unfilled scaffolding when the review ran; the docs brief filled it.

The order was runtime first, then tests, then docs, then the records this phase closes. Each step ran its own check before the next began, so a doc claim that disagreed with the runtime surfaced at the default-model test rather than at the end. The two live unpinned dispatches came after the code settled, and every suite was rerun from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Give both versions one default rather than keep the split and repair the opencode-go route | The Go-plan quota is spent, so the split leaves one default that cannot answer; llmgateway serves the same model on either version |
| Delete `OPENCODE_V2_DEFAULT_MODEL` instead of aliasing it to the new value | A second constant that always equals the first is a place for the two to drift apart again, which is what the drift-table row existed to catch |
| Keep `opencode-go` documented and selectable | It is a real provider with a working route; only its status as the default changes, and a caller who names it still gets it |
| Leave the dated records in the cli-opencode docs alone | The 2026-04-26 coverage notes and the 2026-05-04 incident record what was observed then, and rewriting them would make the history false |
| Prove the live dispatch on both versions instead of trusting the argv assertion | The argv proves the command the runner builds; only the binary proves the provider answers under that argv |
| Add the note to 006 and 036 rather than rewrite their limitations | Those files record what was true when they closed, and the update belongs beside the statement, not in place of it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suite | PASS 516/516 (`scratch/after/plugins.tap`) |
| Hook node:test | PASS 872/872 over 29 files, the CI collection rule (`scratch/after/hooks-node.tap`) |
| Deep-loop vitest: `fanout-run`, `opencode-dual-dispatch`, `executor-config` | PASS 299/299 over 3 files (`scratch/after/deep-loop-vitest.txt`) |
| cli-opencode script tests | PASS 22/22: default-model 4/4, models-form and setup-classify |
| Playbook validator | PASS, 72 scenarios, 0 violations, 0 warnings |
| Hermes sync check | PASS, 68 copies in sync, 1 rewritten |
| Revert check | Restoring `opencode-go/deepseek-v4.1-flash` fails the OpenCode 1 unpinned test; restoring the llmgateway value passes it again |
| Live unpinned dispatch, OpenCode 1 | PASS: built `"opencode" "run" "--model" "llmgateway/deepseek-v4.1-flash" "--format" "json" "--dir" "<worktree>" "--dangerously-skip-permissions" "--variant" "max" "Reply with the single word OK. Do not use any tools."`, exit 0, `signal=null`, reply OK (`scratch/live/v1-unpinned.txt`) |
| Live unpinned dispatch, OpenCode 2 | PASS: built `"opencode2" "run" "--standalone" "-m" "llmgateway/deepseek-v4.1-flash#max" "--format" "json" "--auto" "Reply with the single word OK. Do not use any tools."`, exit 0, `signal=null`, reply OK (`scratch/live/v2-unpinned.txt`) |
| Read-only review | PASS: no P0, no P1, two P2s, both fixed (`scratch/briefs/r1-review.task`) |
| Strict validation of this folder | `validate.sh 052-v1-default-llmgateway --strict` - `RESULT: PASSED` |
| CI at the pushed commit | Recorded after push: the commit hash and every workflow's run id go in this row |

Both live runs were built by the fan-out runtime with no model pinned, so the model in each argv is the fallback this phase set, and each ran under `perl -e 'alarm 180; exec @ARGV'` so a hang would have ended the proof rather than the session.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `opencode-go` route is not proven live.** Its quota is spent, so a dispatch that names it on OpenCode 1 still hangs on `Go usage limit exceeded` and exits 142 after an alarm. The provider stays documented because the route is real and will work when the quota resets; this phase only stopped defaulting to it.
2. **CI is not recorded yet.** The commit hash and the workflow run ids are the one open task, so this file's CI row is the only claim here that is written after the work rather than measured by it.
3. **The docs state the default; nothing enforces the prose.** The default-model test holds each provider table's default marker and the syntax `SKILL.md` pins, so a switched default fails there, but a sentence elsewhere that describes the default wrongly would pass every check and only a review would catch it.
4. **The playbook's dated records now describe a past state.** The 2026-04-26 coverage notes and the 2026-05-04 incident still name `opencode-go` as the default because that is what was true when they were written. A reader who takes them as current would be wrong, and the dated prefix is what tells them apart.
<!-- /ANCHOR:limitations -->

---

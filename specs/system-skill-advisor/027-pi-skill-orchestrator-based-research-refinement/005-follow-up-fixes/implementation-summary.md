---
title: "Implementation Summary: Follow-up Fixes"
description: "A fan-out review now closes with synthesis_complete, edit_lines tells a model what a trailing-newline count means instead of claiming lines moved, the plugin suppresses a same-message repeat with lifecycle dedup on, and the trigger index finds this packet."
trigger_phrases:
  - "follow-up fixes summary"
  - "edit_lines trailing newline fixed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/005-follow-up-fixes"
    last_updated_at: "2026-09-26T16:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Fixed the four recorded follow-ups at their sources"
    next_safe_action: "Run the phase 6 review"
    blockers: []
    key_files:
      - ".skilled/commands/deep/assets/deep-review-auto.yaml"
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - ".skilled/plugins/system-skill-advisor.js"
      - ".skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "edit_lines keeps the exact count: accepting one short would hide a real one-line insertion from a model that counted correctly."
      - "Only the same-message suppression test had its lifecycle kill switch as a workaround; the other three isolate transform dedup on purpose."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Follow-up Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-follow-up-fixes |
| **Completed** | 2026-09-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The four limitations phases 1 to 4 left behind are fixed where they start, so no dispatch needs a workaround for them and the phase 6 review can close cleanly.

### Phase 5: follow-up fixes

- **Fan-out review close.** Both review workflows now find `lineages/*/deep-review-state.jsonl` with the same helper and checks as the research workflows, and require `review/deep-review-dashboard.md` only when there are none (`.skilled/commands/deep/assets/deep-review-auto.yaml`, `step_convergence_report`).
- **`edit_lines` trailing newline.** A claim one short on a file that ends with a newline now gets a refusal that names the final empty line and says when a retry without a new read is safe (`validateEdits` in `.pi/extensions/pi-cache-optimizer/index.ts`). The count check itself is unchanged and exact. The `line_count` description, one prompt guideline and the README say the line counts.
- **Plugin dedup order.** The transform decision hashes the full advisor block, and lifecycle reduction runs only for a block that will be delivered (`.skilled/plugins/system-skill-advisor.js`, the transform hook). A same-message repeat is suppressed again with lifecycle dedup on.
- **Trigger index.** Rebuilt from a `git archive` export of committed markdown plus this packet's documents, so the Gate 1 lookup finds the packet and no other session's uncommitted folder enters the index.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modified | Root dashboard required only without lineage logs |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.md` | Regenerated | Source digests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/run-now-yaml-control.vitest.ts` | Modified | Fan-out and no-lineage review cases |
| `.pi/extensions/pi-cache-optimizer/index.ts`, `README.md` | Modified | Trailing-newline refusal and guidance |
| `.pi/extensions/pi-cache-optimizer/tests/hash-verified-edits.test.ts` | Modified | Trailing-newline and no-newline cases |
| `.skilled/plugins/system-skill-advisor.js` | Modified | Transform dedup before lifecycle reduction |
| `.skilled/plugins/tests/system-skill-advisor.test.cjs` | Modified | Same-message test runs with lifecycle dedup on; three tests state why theirs is off |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modified | Repeat and next-message case with both dedups on |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/` | Regenerated | Index of committed content |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna at max effort wrote each fix from a one-change brief, tests first, two at a time: the review and `edit_lines` fixes through cli-codex in fast mode, the plugin fix through cli-pi on `openai-codex`. The orchestrator reran every named test, reverted each source change to watch its new test fail, and rebuilt the trigger index itself.

Two briefs did not land as sent. The review brief stopped when Luna's patch tool could not match the workflow's context; its tests were written and failing for the right reason, so the orchestrator applied the mechanical YAML change itself. The plugin brief stopped on LOGIC-SYNC because it told Luna to remove the lifecycle kill switch from four tests while keeping their assertions: three of them expect a full second delivery that lifecycle dedup correctly reduces. The corrected brief removed the switch from the same-message test only.

The plugin fix was the first Pi dispatch with `edit_lines` left on. Its first `edit_lines` call passed 931 for a file that counts 932, received the new refusal, retried with 932 and succeeded, and its three later calls succeeded too.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the `edit_lines` count exact and change only the message | A model that counted correctly and then had one line inserted presents the same numbers as a model that skipped the final empty line |
| Do not hide the final empty line from read annotations | Pi's own "of N" and "N more lines" notices count it, so hiding it would break agreement with the built-in read |
| Change only the review dashboard rule, not which state records the review invariants read | Reading lineage logs would make the review's finding checks meaningful on fan-out, but could also fail a merged registry whose keys differ; that is its own change |
| Rebuild the index from an export, not the working tree | The working tree held another session's uncommitted spec folders |
| Commit the Pi fix before the review fix | The pre-commit mirror gate treats all of `.pi/extensions` as mirror output, so an unstaged `.pi/extensions` edit blocks any commit that stages `.skilled/commands`; committing the Pi files first cleared it without bundling unrelated changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop workflow tests, twelve files | 324 of 324, baseline 322 plus two |
| `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=3` |
| Pi extension `npm test`, `npm run typecheck` | 116 of 116, baseline 114 plus two; typecheck exit 0 |
| Plugin `.cjs` suite | 29 of 29 |
| Advisor runtime suite | 947 passed, 2 failed, 6 skipped of 955. One failure is the routing-divergence ratchet that failed at baseline; the other, a freshness benchmark's p50/p95/p99 timing, passed 12 of 12 twice when rerun alone |
| Negative controls | Reverting each source change failed exactly its new tests: the fan-out review case, the trailing-newline case, and the plugin's repeat case plus one `.cjs` test |
| Live `edit_lines` | Luna's Pi session: one trailing-newline refusal, then four successful `edit_lines` edits |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | Run at phase close, see the parent packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The review invariants read only the root state log.** On a fan-out review there is none until the close writes one, so the finding checks pass without looking at lineage findings. The dashboard rule is fixed; this is not.
2. **The mirror gate's output list is broader than what the syncs write.** `.pi/extensions` holds authored extensions such as `pi-cache-optimizer` next to generated hook symlinks, so an authored edit there is treated as a mirror.
3. **With `deduplicateTransforms` off, a second transform for the same message is still reduced to its head.** If the host rebuilds the system prompt on each call within one turn, the later calls carry the head without the directives. That behavior predates this packet and is unchanged.
<!-- /ANCHOR:limitations -->

---

---
title: "Implementation Summary"
description: "Every spec-kit checker in this phase now exits as it reports: no-hit lookups, findings-only goal scans, skipped and cannot-run validation rules, Draft placeholders and stale dists."
trigger_phrases:
  - "validate and retrieval exit honesty implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/010-validate-and-retrieval-exit-honesty"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Closed the phase"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
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
| **Spec Folder** | 010-validate-and-retrieval-exit-honesty |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Seven spec-kit checkers stopped printing a green result for work they did not do or for problems they found.

### Phase 10: validate-and-retrieval-exit-honesty

The trigger lookup exits 1 when nothing scores above zero, in both modes. `check-goal.cjs --all` exits 1 on findings, accepts `--help` and defaults its root to the git top level of the working directory. CROSS_ANCHOR_CONTAMINATION reports an `info` status when no routing payload is supplied, so it no longer shows a pass marker for a skipped check. SOURCE_TAGS turns cannot-run into an error under `--strict`. The post-edit placeholder scan still reads every packet doc, and now treats a value token in a Draft packet as a warning, as PLACEHOLDER_FILLED does. The corpus walker drops a numbered packet's `research/` tree except `research/research.md`. The dist alignment eval runs the dist-freshness check for runtime and cli, skips an unprovisioned checkout and runs through symlinked paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SK/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modified | No-hit exit |
| `SK/runtime/cli/retrieval/lib/corpus.mjs` | Modified | Packet research exclusion |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`, its README and test | Modified | Exit taxonomy, `--help`, root |
| `SK/runtime/lib/validation/spec-doc-structure.ts` | Modified | Info status for a skipped check |
| `SK/runtime/cli/rules/check-source-tags.sh` | Modified | Strict cannot-run error |
| `SK/runtime/cli/spec/check-placeholders.sh`, `rules/check-placeholders.sh` | Modified | Draft lifecycle in the post-edit scan |
| `SK/runtime/cli/evals/check-source-dist-alignment.ts` | Modified | Freshness, entry guard, unprovisioned skip |
| Tests: `validation-exit-honesty.vitest.ts` (new), trigger-index, retrieval-coverage-parity, repo-era, alignment orphans | Created/Modified | One case per behaviour |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines ran first. cli-codex `gpt-6-luna` high-fast briefs made each change. DeepSeek V4.1 Flash max (cli-pi, read-only) reviewed the diff and returned FAIL with three P1 and four P2 rows; the orchestrator reproduced the P1s and two more Luna briefs fixed them with three P2s. The full cli suite then caught a repo-era report regression from the corpus change, fixed by one more Luna brief. Suites were rerun from the final state after a full rebuild.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Info status for a skipped contamination check | A skipped check is neither a pass nor a warning |
| Keep the folder walk in the post-edit scan | Calling only `run_check` lost coverage of handover, timeline and other docs |
| Do not regenerate the committed trigger index | Generators are outside worker scope; the rebuild workflow owns it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli vitest project | Before 2406 pass / 20 skip. After 2410 pass / 20 skip |
| root vitest project | Before 1632 pass / 13 skip. After 1638 pass / 13 skip |
| `test-validation-system.cjs` | Before 101/0. After 101/0 |
| `test-validation.sh` | Before 31/0. After 31/0 |
| `test-validation-extended.sh` | Before 84/0. After 84/0 |
| check-goal tests | Before 32/0. After 35/0 |
| Matrix | strict on/off by pass, warn, cannot run, skipped: 8 rows, the cannot-run and skipped rows covered by `validation-exit-honesty.vitest.ts` |
| Cross-family review | DeepSeek FAIL, 3 P1 and 4 P2; all P1 and three P2 fixed, one P2 recorded in ADR-003 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The committed trigger index still carries research paths the walker now excludes.** `generate-trigger-index.mjs --check` reports them as obsolete until the index is rebuilt; regenerating is an operator or rebuild-workflow step.
2. **MERGE_LEGALITY prints `+` when it is skipped.** Same class as the contamination marker, not a verified finding; recorded for a later phase.
3. **A track whose own name is `research` stops the anchor search at that segment.** The walker then keeps a packet's research tree in that track; no track is named `research` today.
<!-- /ANCHOR:limitations -->

---

---
title: "Implementation Summary"
description: "The deep-review report and the synthesis closeout now carry the P0 to P2 counts the verdict script used, and a single-executor closeout refuses counts that differ from the registry."
trigger_phrases:
  - "review count source implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/030-review-count-source"
    last_updated_at: "2026-11-15T20:39:27Z"
    last_updated_by: "generate-context"
    recent_action: "Built phase 030 count source and closeout guard"
    next_safe_action: "Commit phase 030, then build phase 031"
    packet_purpose: "Purpose: Make the verdict script's counts the only counts the report and the closeout carry, and keep the self-check's outcomes as their own list in the report."
    blockers: []
    key_files:
      - "specs/agents/007-agent-alignment-follow-ups/030-review-count-source/spec.md"
      - "specs/agents/007-agent-alignment-follow-ups/030-review-count-source/implementation-summary.md"
      - ".skilled/commands/deep/assets/deep-review.yaml"
      - ".skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-counts.vitest.ts"
    session_dedup:
      fingerprint: "sha256:6cac5bf4aa697dded9af0f4d40d17a87a3af03304b43c81fc9a071fdf5039426"
      session_id: "scaffold-030-review-count-source"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T20:39:27Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-review-count-source |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A review's verdict, report counts and closeout row now come from one set of counts. Before this phase the report printed the loop agent's hand counts after its self-check, so 10 of 34 recent reports with an explicit count line disagreed with their registry. In 4 the report was lower, the self-check's effect; two of those trace to refuted or downgraded findings when read by hand.

### Phase 30: review-count-source

`step_derive_verdict` in `deep-review.yaml` binds `active_p0`, `active_p1` and `active_p2` from `review-verdict.cjs` in both branches, and `step_build_finding_registry` no longer outputs counts. The adversarial self-check records its confirm, downgrade and false-positive calls for the report without changing the counts or the verdict, and the report lists those outcomes apart from the counts it says the verdict used. `synthesis-closeout.cjs` compares its three count flags with the registry's active findings when no lineage logs exist, and throws before staging anything when one differs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-review.yaml` | Modified | Counts bound from the verdict script; self-check and report wording |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modified | Refuse mismatched counts on a single-executor run |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-counts.vitest.ts` | Created | Mismatch refused, match staged, fan-out unchecked |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-latest-record.vitest.ts` | Modified | Fixtures carry status and severity like reducer output |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Source digest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi built each task in its own dispatch, and the conductor read every diff and reran the checks. A gateway probe first appended a `claim_adjudication` row carrying `findingId` and `finalSeverity`; the gateway refused it as an invalid closed-shape payload, so the self-check's per-finding result has no ledger path and the phase kept to one count source. The new guard failed three older closeout tests whose registries held findings with no status and no severity, which reducer output never does; the conductor gave those fixtures a status and severity and passed each test its real counts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Counts follow the verdict script, not the self-check | The self-check's result cannot be recorded in the ledger today, so a count it lowered would disagree with the registry the verdict read |
| List self-check outcomes apart from the counts | A reader still sees which findings the self-check doubted, without a report showing P1=1 beside a sentence calling that finding a false positive |
| Check counts only without lineage logs | A fan-out root's counts come from the merge across several registries, not from the one the closeout reads |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `synthesis-closeout-counts.vitest.ts` | PASS: 3 of 3 |
| Closeout tests together | PASS: 12 of 12 |
| Runtime suite | PASS: 183 files, 3,075 passed, 9 skipped (baseline 182 files, 3,072 passed) |
| `npm run typecheck` | PASS: no errors |
| Contract drift | PASS: `OK commands=2` |
| spec-kit `deep-review-contract-parity.vitest.ts` | PASS: 12 of 12 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The self-check cannot lower a count.** Carrying its per-finding result into the registry needs a typed ledger field on `claim_adjudication`; the gateway refuses `findingId` and `finalSeverity` today. That is a follow-up, not built here.
2. **Recorded reviews keep their old counts.** Their reports and registries stay as written.
<!-- /ANCHOR:limitations -->

---

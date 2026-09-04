---
title: "Implementation Summary: deep review remediation"
description: "The ten-iteration deep review of the decommission packet returned CONDITIONAL with six findings; all six were verified at source and fixed or answered, and the trigger-index reader now fails closed on a malformed artifact."
trigger_phrases:
  - "deep review remediation summary"
  - "review verdict conditional six findings"
  - "fail closed index reader"
  - "misplaced iteration recovered"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/007-deep-review-remediation"
    last_updated_at: "2026-09-04T07:21:40Z"
    last_updated_by: "claude-code"
    recent_action: "Remediated the six review findings"
    next_safe_action: "Land the branch after the operator reinstalls the main checkout dependencies"
    blockers: []
    key_files:
      - "../review/lineages/luna-max/review-report.md"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/lib/artifact.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-007-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-deep-review-remediation |
| **Completed** | 2026-09-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A read-only deep review over ten forced iterations on gpt-5.6-luna at maximum effort found no P0, four P1 and two P2 in the finished decommission packet. One was a runtime gap: the trigger-index reader accepted a parseable but malformed artifact and silently returned fewer results than it held. The rest were contradictions between claimed and recorded closure state. All six are verified at source and closed.

### One invariant at both ends

The generator already refused to publish an index whose postings were not non-empty arrays of in-range integer ids. The reader checked only that the top-level tables existed, then skipped anything malformed during lookup. The structural checks now live in the shared artifact library and both ends call them, so a truncated or hand-edited committed index is refused at load with a regenerate hint instead of quietly returning fewer candidates. Four tests pin the behaviour.

### Closure state that matches the claims

Phases 001 and 002 carried every completion and checklist row unchecked while marked Complete, and phase 005 left its fold-in task open although both build phases cite the research. Those rows are now closed with the evidence the phases already recorded. The parent goal's DONE WHEN boxes are ticked, and the retired-prefix criterion is restated to what was decided and proven: zero live instruction surfaces, with historical evidence and negative guards kept. Every open decision now names an owner and a review checkpoint, and the release-environment caveat about the main checkout's missing dependency is recorded beside the advisor decision.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `../review/**` | Created | Ten iteration files, deltas, state log, strategy, dashboard, report |
| `scripts/retrieval/lib/artifact.mjs` | Modified | Shared shape invariant and schema constant |
| `scripts/retrieval/generate-trigger-index.mjs`, `lookup-trigger-index.mjs` | Modified | Both call the invariant; silent skips removed |
| `scripts/tests/trigger-index.vitest.ts` | Modified | Four fail-closed cases |
| Phase 001, 002 and 005 `tasks.md` | Modified | Rows closed with evidence |
| `../goal.md`, `../spec.md`, `../roadmap.md` | Modified | Criterion restated, decisions with owner and checkpoint, release caveat, map row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The review ran through the deep-loop fan-out runner as one cli-codex lineage with the stop policy set to max-iterations. At iteration 9 the model wrote its output to the repository root instead of the lineage directory; the runner's containment gate preserved the files and failed the lineage, and the model itself stopped without claiming completion. The two files were moved into the lineage, the orphaned codex process killed, and the lineage resumed from its nine recorded iterations for the tenth and the synthesis. The orchestrator re-read every finding at its cited line before editing, applied the fixes after the runner exited, and reran the suites and the recursive validate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restate the criterion rather than scrub the evidence | The parent decided to keep historical changelogs, benchmark reports and negative guards; rewriting them to satisfy a literal grep would falsify the record |
| Close rows with evidence, never delete them | The templates' unchecked rows were the finding; deleting them would hide the gap the review found |
| Put the invariant in the shared library | Two copies of the same checks is how the reader drifted from the generator in the first place |
| Resume the lineage instead of restarting | Nine iterations were sound and recorded; only the misplacement needed correcting |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Review lineage | 10 iterations, verdict CONDITIONAL, P0 0, P1 4, P2 2, runner completed with 0 failures |
| `trigger-index` and `parity-check` suites | 76 passed |
| Phase 001, 002, 005 unchecked rows after closure | 0 |
| `validate.sh --strict` recursive over the parent | recorded after metadata regeneration |
| Trigger index regenerated twice | recorded after the document edits |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The review executor misplaced one iteration.** The lineage prompt names the artifact directory, yet the model wrote iteration 9 relative to the repository root. The runtime caught it; a follow-up in the deep-loop packet should state the directory as an absolute path and forbid repository-relative writes in the prompt.
2. **F006 stays open by design.** The main checkout's missing `onnxruntime-common` is the operator's install; the caveat is recorded, not resolved.
<!-- /ANCHOR:limitations -->

---



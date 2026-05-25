---
title: "Implementation Summary: 116/007 - Ledger-Led Graph Vocabulary"
description: "Phase G extends review coverage-graph vocabulary with ledger-led node kinds and enables the seeded graph fixture tests."
trigger_phrases:
  - "review graph vocabulary summary"
  - "ledger-led graph"
  - "BUG_CLASS node"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab"
    last_updated_at: "2026-05-22T12:18:31Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed Phase G review graph vocabulary implementation and validation."
    next_safe_action: "Stage the files listed in Commit Handoff and commit."
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/plan.md"
      - ".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/tasks.md"
      - ".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/checklist.md"
      - ".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/implementation-summary.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts"
    session_dedup:
      fingerprint: "sha256:1160077400000000000000000000000000000000000000000000000000000000"
      session_id: "116-007-summary"
      parent_session_id: "116-007-ledger-led-graph-vocabulary"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No new relation was necessary; existing review relations cover the requested graph mappings."
---

# Implementation Summary: 116/007 - Ledger-Led Graph Vocabulary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab` |
| **Completed** | 2026-05-22 |
| **Level** | 2 |
| **Actual Effort** | ~1.5 hours |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase G extends the review coverage graph vocabulary so ledger-led search evidence can be projected into structured graph nodes. The coverage graph now accepts `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST` node kinds for review loops.

The deep-review auto and confirm workflow filters now preserve those node kinds before upsert. The Phase B graph fixture tests that were placeholders for this phase are enabled and passing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` | Modified | Added new review node kinds to `ReviewNodeKind` and `VALID_KINDS.review`. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | Preserves the five new node kinds during graph event normalization. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modified | Mirrors auto workflow graph event normalization. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts` | Modified | Converts pre-G failure assertion to post-G success and un-skips Phase G tests. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/spec.md` | Modified | Level 2 specification. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/plan.md` | Modified | Level 2 implementation plan. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/tasks.md` | Modified | Level 2 task ledger. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/checklist.md` | Created | Level 2 verification checklist. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/implementation-summary.md` | Modified | Final evidence and commit handoff. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/description.json` | Refreshed | Memory metadata. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/graph-metadata.json` | Refreshed | Graph metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was delivered in three small moves: update the central runtime allow-list, mirror the command workflow filters, and turn the seeded Phase B future-contract tests into live assertions. Verification then covered the targeted graph fixture, the broader review-depth fixture family, existing coverage-graph tests, metadata refresh, and strict spec validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Extend review node kinds only | The requested semantic expansion is node vocabulary, not edge semantics. |
| Reuse existing relations | `BUG_CLASS -> DIMENSION` maps through `IN_DIMENSION`; `INVARIANT`, `PRODUCER`, and `CONSUMER -> FILE` map through `IN_FILE`; `TEST -> FINDING` maps through `EVIDENCE_FOR`. |
| Do not add `IS_INSTANCE_OF` | Phase G does not need bug-class inheritance or taxonomy edges. |
| Do not add `TESTS` | Phase G only needs test evidence to support findings; invariant testing can be represented by a `TEST` node plus existing file/finding evidence relations when graph projection exists. |
| Leave upsert handler logic unchanged | It already validates via `VALID_KINDS[loopType]`, so extending the shared allow-list is sufficient and avoids duplicated validation lists. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Phase B graph fixture | Pass | `pnpm vitest run --no-coverage review-depth-graph` from `.opencode/skills/system-spec-kit/mcp_server`: 1 file passed, 6 tests passed. |
| All Phase B review-depth fixtures | Pass | `pnpm vitest run --no-coverage review-depth-` from `.opencode/skills/system-spec-kit/mcp_server`: 3 files passed, 1 skipped, 8 tests passed, 5 todo. |
| Existing coverage graph tests | Pass | `pnpm vitest run --no-coverage coverage-graph` from `.opencode/skills/system-spec-kit/mcp_server`: 9 files passed, 135 tests passed. |
| Strict spec validation | Pass | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab --strict` passed. |

### Test Coverage Summary

| Surface | Coverage Added |
|---------|----------------|
| `review-depth-graph.vitest.ts` | Positive-path upsert coverage for `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, and `TEST`. |
| `coverage-graph` regression filter | Confirms existing graph handlers and DB behavior remain green. |
| YAML mirror check | Auto and confirm filters contain identical new kind list. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-M01 | One runtime node-kind owner | `VALID_KINDS.review` remains the handler source of truth | Pass |
| NFR-M02 | Auto/confirm filter parity | Both YAML filters preserve the same five new kinds | Pass |
| NFR-C01 | Relation compatibility | `VALID_RELATIONS.review` unchanged | Pass |
| NFR-C02 | Existing graph tests green | `coverage-graph` filter passed | Pass |
| NFR-O01 | Dynamic validation messages | Handler still renders valid kinds from `VALID_KINDS[loopType]` | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This phase does not add graph query or dashboard rendering for the new node kinds. It only ensures graph events can preserve and persist them.
2. This phase does not alter graphless fallback semantics. That is intentional: text/JSON `searchLedger` evidence remains authoritative.
3. The root repository does not expose `vitest` from its top-level package; vitest commands were run from `.opencode/skills/system-spec-kit/mcp_server`, where the package dependency exists.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Modify upsert handler if validation was hardcoded | No handler code change | Validation already reads the shared `VALID_KINDS` allow-list dynamically. |
| Add new relations if strict semantics required them | No new relations added | Existing review relations covered the requested mappings. |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:continuation -->
## Continuation Notes

Phase H can build on this vocabulary for playbooks and default calibration. The next phase should treat graph nodes as structured evidence projection only; the `searchLedger` and graphless fallback evidence remain the durable source of truth.
<!-- /ANCHOR:continuation -->

---

## Commit Handoff

Suggested commit message:

```text
feat(116/007): ledger-led review graph vocabulary

Extends review coverage-graph allow-list with BUG_CLASS, INVARIANT,
PRODUCER, CONSUMER, TEST node kinds. Phase B graph fixture's skipped
tests un-skipped; all green. Level 2.

Co-Authored-By: GPT-5.5 via cli-codex (Phase G autonomous dispatch)
```

Files (explicit paths for `git add`):

```text
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/spec.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/plan.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/tasks.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/checklist.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/implementation-summary.md
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/description.json
.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/007-complexity-ledger-led-graph-vocab/graph-metadata.json
.opencode/skills/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
.opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts
.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml
.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml
.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-graph.vitest.ts
```

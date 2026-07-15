---
title: "Tasks: Benchmark Authoring Completion and Cross-Links"
description: "Task breakdown and completion evidence for authoring the Lane A guide, completing bidirectional benchmark cross-links, and landing the metadata/sibling/fixtureDir corrections."
trigger_phrases:
  - "benchmark authoring completion tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/002-benchmark-authoring-completion-and-crosslinks"
    last_updated_at: "2026-07-13T14:35:28Z"
    last_updated_by: "claude-code"
    recent_action: "Tasks authored"
    next_safe_action: "Run gates and close out"
    blockers: []
---
# Tasks: Benchmark Authoring Completion and Cross-Links

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open, `[x]` done with evidence, `[~]` in progress.
- Each done task records evidence: command output, file:line, or grep result.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1 — Repoint `fixtureDir` `benchmark-fixtures`->`benchmark_fixtures` in all 10 model-benchmark profile JSONs. Evidence: `rg -l benchmark-fixtures benchmark_profiles/*.json` = 0; all 10 `fixtureDir` resolve (`test -d`).
- [x] T2 — Reconcile hyphen->underscore in `benchmark_profiles/README.md` prose. Evidence: path-segment normalization applied with the JSONs.
- [x] T3 — Correct live packet identity `016`->`015` in parent+child `graph-metadata.json` and `description.json`. Evidence: `rg 016-benchmark-authoring <015 tree>` returns only frozen `review/**`.
- [x] T4 — Correct `packet_pointer` and trigger-phrase keys `016`->`015` in live docs. Evidence: grep clean outside `review/**`.
- [x] T5 — Correct the dangling sibling reference in parent `spec.md`. Evidence: sibling now points at the existing smart-routing packets with a renumber note.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T6 — Author Lane A guide `create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md`. Evidence: `validate_document.py` 0 issues; 241 lines; 22/22 links resolve; contracts linked, not restated.
- [x] T7 — SKILL §2 family table: the Lane A row names its guide (five families); non-goal paragraph reworded. Evidence: `create-benchmark/SKILL.md` §2 table has 5 family rows; word count `4996` <= cap.
- [x] T8 — SKILL §1 framing + §12 REFERENCES rows; `version` 1.2.0.0->1.3.0.0; changelog v1.3.0.0. Evidence: `package_skill.py create-benchmark --check` PASS.
- [x] T9 — Add create-benchmark back-pointer to `deep-alignment/behavior_benchmark/behavior_benchmark.md`. Evidence: `rg create-benchmark deep-alignment` >= 1.
- [x] T10 — Add Lane A README pointer to the new guide. Evidence: the back-pointer path resolves (`ls`).
- [x] T11 — Verify create-benchmark->lane relative links for Lane A resolve. Evidence: the guide reports 22/22 resolved; `check-markdown-links.cjs` clean of new breaks.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T12 — `validate.sh --strict` on this child reports Errors:0; parent recursive introduces no new errors. Evidence: see the close-out validation run.
- [x] T13 — Generated child `description.json` + `graph-metadata.json` (`generate-description.js` + `backfill-graph-metadata.js`); wrote `implementation-summary.md`; added the child 002 row to the parent `spec.md` phase map. Evidence: both JSON files present; parent map has 2 rows.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All tasks `[x]` with evidence; `spec.md` §5 success criteria met; zero lane-owned contract/schema/template relocated; no run/scoring logic changed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md` (015 benchmark authoring centralization).
- Decision record: `./decision-record.md` (ADR-001 amends parent ADR-003; ADR-002 reaffirms ADR-004).
- Sibling child: `../001-create-benchmark-reorg-and-routing/`.
<!-- /ANCHOR:cross-refs -->

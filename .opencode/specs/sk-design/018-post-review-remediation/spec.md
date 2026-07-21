---
title: "Spec: Post-Review Remediation of the sk-design Remediation Program"
description: "Remediate the verified findings from the 017 GPT-5.6-SOL review: fix stale _db/_engine path references in the styles playbook, the database README, the 015 parent phase-map, and the graph-metadata key_files pointers left behind by the 005 restructure. Documentation/metadata only; no shipped code behavior changes."
trigger_phrases:
  - "post review remediation stale db engine paths"
  - "017 review findings fix playbook readme phase-map"
  - "graph-metadata key_files pointer restructure remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-post-review-remediation"
    last_updated_at: "2026-07-21T18:25:00Z"
    last_updated_by: "remediation"
    recent_action: "Fixed stale _db/_engine doc + pointer references; refuted P1-006."
    next_safe_action: "Validate + commit; operator decides the P1-006 design question."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
      - ".opencode/skills/sk-design/styles/lib/database/README.md"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-018-post-review-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Post-Review Remediation of the sk-design Remediation Program

<!-- ANCHOR:purpose -->
## Purpose

Remediate the findings the `017` GPT-5.6-SOL deep review confirmed against the code. The root cause is a
single class: the `005-library-restructure` renamed `_db → lib/database` and `_engine → lib/engine`, but
several current-state documents and metadata pointers were never updated. This packet fixes those
current-state references. It changes **no shipped code behavior** and preserves all historical records.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:scope -->
## In Scope — the verified findings

- **P1-002** — `styles/docs/manual-testing-playbook.md`: `_db`/`_engine` execution paths + test globs → `lib/database`/`lib/engine` + `tests/database`/`tests/engine`.
- **P1-003** — `015-styles-database-evolution/spec.md`: the phase-map marked shipped `001`/`005`/`006` as `Planned`; corrected to `Complete` (006 noted cutover-human-gated), leaving the genuinely-unbuilt `002`/`003`/`004` as `Planned`. Also refreshed the parent continuity (recent/next action, `key_files` pointer, completion_pct).
- **P1-004** — `styles/lib/database/README.md`: the five operator commands + the `_db/` tree reference + `_db/style-library.sqlite` → the current `lib/database`/`database` paths.
- **P1-005 (dead paths)** — the `key_files` continuity pointers in `015/001-foundation` and `015/004-growth` docs (which feed graph-metadata) → current `lib/database`/`tests/oracle` paths; graph-metadata + description regenerated for `012`, `015`, `015/001`, `015/004`. Result: **0 dead `_db`/`_engine` paths** in those graph-metadata files.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:out-of-scope -->
## Out of Scope — and why

- **Historical prose** (`_db` in "Files Changed" tables, scope statements, evidence citations across the
  `003-style-database`/`001-foundation`/`004-growth` docs) is **preserved**: those record what each packet
  did at its own time; rewriting them would falsify the record.
- **P1-005 (status half)** — the `derived.status` fields (`012` "planned", `004` "in_progress") are
  generator-owned, derived from checklist-completeness + impl-summary presence. They misfire on
  phase-parent rollup + scaffold children; that is a generator-derivation concern, not durably fixable by
  hand-editing (regeneration reverts it). Left as-is and flagged.
- **P1-006 — REFUTED, no code change.** The review claimed `design-audit/comparison-lane.mjs` suppresses
  `requery-required`. Verification shows the `requery-required` path IS reachable and tested (a plan-level
  `proofPlan.outcome='generation-mismatch'` routes there — `comparison-lane.test.mjs:227-241`). The flagged
  line 503 handles a *different*, post-query generation race and deliberately degrades to `no-fit` (a
  tested outcome, `:169`) with the `generation-mismatch` diagnostic preserved in the warning. Changing it
  would alter intentional behavior and break a passing test. Whether post-query drift *should* also
  requery is a design decision for the operator, not a silent fix.
<!-- /ANCHOR:out-of-scope -->

---

<!-- ANCHOR:acceptance -->
## Acceptance

- Zero residual `_db`/`_engine` references in the playbook, the database README, and the three flagged
  graph-metadata files; every rewritten path resolves to a real on-disk file.
- The `015` phase-map reflects true child status; historical prose is untouched.
- No shipped code file modified; the design-audit contract is unchanged.
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:source -->
## Source

- Findings: `../017-remediation-program-review/review/review-report.md` (verified verdict).
- Applied at origin tip `ed8f3e20d0`; the reviewed files were unchanged since the pinned review HEAD `7b9d3b6b71`.
<!-- /ANCHOR:source -->

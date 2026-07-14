---
title: "Phase 002 Plan: Commit Standards Definition"
description: "Sequential Thinking sessions lock the 7 commit-standard decisions; output canonical standards plus 20-sample validation."
trigger_phrases:
  - "112-commit-standards-definition plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/091-commit-standards-and-retroactive-rewrite/002-commit-standards-definition"
    last_updated_at: "2026-07-14T21:12:36Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 002 plan"
    next_safe_action: "Sample commits then begin Sequential Thinking Group A"
    blockers:
      - "Phase 001 baseline-log.txt should exist for reproducible sampling"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-plan-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 002 — Commit Standards Definition

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Deliberate the 7 commit-standard decisions across 3 Sequential Thinking sessions (Group A: subject + length; Group B: historical reconciliation; Group C: body + special cases). Output: `commit-standards.md` (canonical), `derivation-heuristics.md` (algorithmic), `hand-sample-validation.md` (20-sample determinism proof), and 7 Accepted ADRs in `decision-record.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Acceptance |
|------|-------|------------|
| G1 | All 7 ADRs `Status: Accepted` with decision text and ≥2 alternatives | `decision-record.md` complete |
| G2 | `commit-standards.md` includes 5+ worked examples covering happy-path, merge, revert, packet-ID-legacy, unrecoverable-diff | Manual review |
| G3 | `derivation-heuristics.md` is algorithmic (no judgement-call branches) | Manual review |
| G4 | 20-sample validation shows 20/20 deterministic rewrites | `hand-sample-validation.md` |
| G5 | `validate.sh --strict` exits 0 | Validator passes |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three-session Sequential Thinking deliberation feeds a single canonical standards document plus an algorithmic derivation guide. The 20-sample validation is the gate that catches gaps before downstream phases inherit them.

Group A (Q1, Q7): subject format + length caps — interlocked, small scope.
Group B (Q2, Q3, Q4): packet-ID + Co-Authored-By + imperative-mood — all about historical reconciliation, deliberated together for coherence.
Group C (Q5, Q6): body policy under thin diff + special-case message structure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Stage 1 — Sample for inputs
- 20 random HEAD commits, 5 merges, 5 with existing Co-Authored-By, 5 with packet-ID prefix
- Read sk-git SKILL.md §3, commit_message_template.md, commit_workflows.md, CONTRIBUTING.md

### Stage 2 — Sequential Thinking, Group A (Q1 + Q7)
- ≥5 thoughts; draft ADR-001 (subject format) and ADR-007 (length caps)

### Stage 3 — Sequential Thinking, Group B (Q2 + Q3 + Q4)
- ≥7 thoughts; draft ADR-002 (packet-ID), ADR-003 (Co-Authored-By), ADR-004 (imperative-mood)

### Stage 4 — Sequential Thinking, Group C (Q5 + Q6)
- ≥5 thoughts; draft ADR-005 (body policy) and ADR-006 (special cases)

### Stage 5 — Consolidate
- Write `commit-standards.md` (sections: Subject, Body, Trailers, Special cases, Packet-ID handling, Worked examples)
- Write `derivation-heuristics.md` (ordered first-match rules for type / scope / body / trailer / packet-ID)

### Stage 6 — 20-sample validation
- For each of the 20 sampled hashes, write proposed rewrite in `hand-sample-validation.md`
- 20/20 must be deterministic; if any fail, reopen Stage 5 and iterate

### Stage 7 — Lock & validate
- Mark all 7 ADRs Accepted
- Run `validate.sh --strict`; update `implementation-summary.md` and parent `graph-metadata.json`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Hand validation via the 20-sample artifact is the primary test. No automated test suite. Acceptance is structural (ADRs present + Accepted) plus semantic (the standard works deterministically on real commits).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sequential_thinking` MCP server registered in `opencode.json`
- sk-git current SKILL.md and template files (read-only inputs)
- Phase 001 baseline log (preferred; reproducible sample seed)
- Existing CONTRIBUTING.md conventional-commits guidance (lines 82–98)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`rm -f commit-standards.md derivation-heuristics.md hand-sample-validation.md` and revert `decision-record.md` to the pre-staged template. No external state mutated.
<!-- /ANCHOR:rollback -->

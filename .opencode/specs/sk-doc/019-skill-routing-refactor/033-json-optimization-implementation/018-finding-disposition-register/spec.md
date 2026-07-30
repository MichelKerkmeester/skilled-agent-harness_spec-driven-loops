---
title: "Feature Specification: Finding Disposition Register and Audit Retrospective"
description: "Record a per-finding disposition for all 41 audit findings including the nine refuted ones, and capture why four independent legs and 20 iterations missed a live regression that one command would have surfaced."
trigger_phrases:
  - "finding disposition register"
  - "refuted audit findings"
  - "why the audit missed the regression"
  - "agreement is not severity"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/018-finding-disposition-register"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase spec"
    next_safe_action: "Populate the register as sibling phases disposition their findings"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/018-finding-disposition-register"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the deferred pre-program code-style findings warrant their own packet or belong in an existing backlog is undecided"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Finding Disposition Register and Audit Retrospective

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Forty-one findings were raised. Roughly a quarter are wrong, and several of the loudest are the least consequential. Without a written disposition, the refuted ones get re-found by the next audit and the deferred ones vanish.

Nine findings were refuted on evidence: eight validator rows that traced to an instrument error rather than a defect (the validator is a symlink that every caller resolves, and the finding cited line 1 of the very file it claimed was missing), a documentation-quality floor finding whose single flagged artifact scores full marks on structure, and a path-containment finding whose sink is a boolean existence check that opens nothing. Five more findings blame lines outside the program's commit range entirely, two of which a previous review already closed.

The severity ordering also needs correcting in the record. Ranking by cross-model agreement rewarded findings visible in a status table and buried the ones that required reading evidence content or running a command. Three lineages independently found a stale status column; one found the rubber-stamped checklist; none found the regression. The ranking was almost exactly inverse to consequence, and that lesson is worth more than most of the findings it produced.

This phase also records what no leg examined: runtime behaviour of any kind, whether the CI the program built gates what it claims, and the three scorer diffs that were the program's only live-code blast radius.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — a register giving every one of the 41 findings a disposition of fixed, refuted, deferred or accepted, with the owning phase or the refuting evidence; a short retrospective on why the audit inverted severity and missed runtime entirely; and a recorded decision on where the deferred pre-program findings go.

Out of scope — fixing anything, which the sibling phases own; re-running the audit; and changing the deep-loop tooling, though the retrospective may recommend it.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding has exactly one disposition | All 41 findings appear in the register with a disposition of fixed, refuted, deferred or accepted. None is absent, and none carries two |
| REQ-002 | Refutations cite evidence, not opinion | Each refuted finding records the specific evidence that refutes it, at a level of detail a reader can re-check without re-running the audit |
| REQ-003 | Deferred findings have an owner or an explicit parking place | Each deferred finding names where it went. "Deferred" with no destination is not a disposition |
| REQ-004 | The severity-inversion lesson is recorded concretely | The retrospective states, with the specific counts, that agreement across lineages tracked surface visibility rather than consequence, and names what a future audit should do differently — at minimum, that a claim of measured neutrality is verified by re-running the measurement |
| REQ-005 | The coverage gaps are named | The retrospective lists what no leg examined: runtime behaviour, whether CI gates what it claims, and the scorer diffs — so a future audit inherits the gap list rather than the blind spot |
| REQ-006 | Run-integrity defects are recorded alongside findings | The defects that affected the audit itself — deleted artifacts, truncated lane identifiers, malformed executor output, and citations to files that do not exist — are recorded, since an executor that fabricates a source path is a more serious problem than most findings it produced |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All 41 findings carry exactly one disposition; every refutation cites re-checkable evidence; every deferral names a destination; the retrospective records the severity inversion with concrete counts and says what to do differently; the coverage gaps are named as an inherited list; and the run-integrity defects including the fabricated citations are recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A register written before the sibling phases finish would record intentions as outcomes | The register is populated as siblings disposition their findings and closes last |
| Risk | Recording refutations could be read as dismissing the audit, discouraging future review | The retrospective is explicit that the audit's failure was method — reading rather than executing — not effort, and that the one reviewer who executed found what twenty iterations of reading did not |
| Dependency | All sibling phases | Dispositions of fixed depend on those phases actually fixing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Whether the deferred pre-program code-style findings warrant their own packet or belong in an existing backlog is undecided and is an operator call.
<!-- /ANCHOR:questions -->

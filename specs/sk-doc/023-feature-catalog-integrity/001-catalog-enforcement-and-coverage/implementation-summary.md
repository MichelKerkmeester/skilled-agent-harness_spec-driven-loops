---
title: "Implementation Summary: catalog enforcement and coverage"
description: "In-progress delivery record for the presence-based catalog validator, staged package enforcement, and paired rule fixtures."
trigger_phrases:
  - "catalog enforcement implementation summary"
  - "feature catalog validator delivery"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured scoped validator and packet-validation receipts"
    next_safe_action: "Resolve remaining packet validation metadata/evidence issues without claiming completion"
    blockers:
      - "Whole-fleet validator remains red for promoted catalog drift by design"
      - "Shared helper and CI/doctor caller wiring are outside this leaf scope"
    completion_pct: 80
    open_questions:
      - "Strict packet validation must pass before completion"
    answered_questions:
      - "Discovery is presence-based"
      - "Four known-backlog packages are staged at WARN"
      - "RC-007-07 is refuted at HEAD"
---
# Implementation Summary: Catalog Enforcement and Coverage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-catalog-enforcement-and-coverage |
| **Completed** | In Progress |
| **Level** | 3 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The package validator now discovers every present `feature-catalog/` directory below `.opencode/skills/`, stages the
four known backlog packages at WARN, and fails closed for promoted violations. The ClickUp root comparison is
case-insensitive so `FEATURE-CATALOG.md` is treated as a root catalog.

The added rule surface covers phantom root rows, prose paths, root-H3/title parity, normalized description parity,
packet-history metadata, shipped-label consistency, and volatile measurement snapshots. Each rule has paired positive
and negative fixtures, and the fixture harness also proves coverage discovery, staged exits, and JSON determinism.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The validator and fixtures were implemented within the locked `sk-create-feature-catalog` scope. The child packet
records the frozen pre-edit census, the case-insensitive classification delta, and the explicit deferrals for the
shared count helper and CI/`/doctor` caller wiring.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Discover packages from `feature-catalog/` presence | A maintained named-hub list silently narrowed coverage. |
| Keep four known backlog packages at WARN | Repair children can reduce the backlog without masking drift elsewhere. |
| Promote a WARN package when clean | A repaired package becomes fail-closed without another validator code change. |
| Strike RC-007-07 without editing `mcp-code-mode` | The alleged README defect is absent and the package premise is false at HEAD. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fixture harness | PASS, 22 assertions; digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`; rc 0 |
| Existing validator regression test | PASS, 12 assertions; digest `633400553f6193bb06254372641db35e4e8fd3b71d799c7b9476a30a2da3bd5e`; rc 0 |
| Promoted package | FAIL tier; `cli-external-orchestration`; rc 1 |
| Backlog package | WARN tier; `system-deep-loop/deep-research`; rc 0 |
| Whole fleet | FAIL, 26 package verdicts, 1163 violations (`565` fail / `598` warn); rc 1; runtime `real 1.66` |
| Child packet strict validation | PASS, zero errors and zero warnings; digest `f1853890f5b9bec83f93b0fb47f60fd818e4c4bd6950a1616082f59286b9d035`; rc 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The whole-fleet run remains red because non-backlog packages fail closed on current catalog drift; the four explicit
   WARN packages are the repair children’s staging boundary.
2. The shared count-derivation helper and CI/`/doctor` caller wiring are deferred outside this leaf’s editable scope.
3. The frozen pre-edit census is `26/804/104/0`; case-insensitive ClickUp root classification yields logical
   `26/803/103/0` without catalog-content edits.
<!-- /ANCHOR:limitations -->

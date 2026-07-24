---
title: "Implementation Summary: create-skill Compiled-Routing Alignment"
description: "Completion record for parent-hub legacy/ready generation, canonical manifest minting, freshness validation, synchronized directives, and contract coverage."
trigger_phrases:
  - "create-skill compiled routing implementation summary"
  - "parent hub onboarding current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/013-create-skill-alignment"
    last_updated_at: "2026-07-21T08:20:00Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Implemented and verified create-skill legacy and ready generation"
    next_safe_action: "Run the operator-gated activation join"
    blockers:
      - "Repository default activation remains intentionally operator-gated"
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "When will the operator authorize the separate default-on cutover?"
    answered_questions:
      - "Canonical minting is delegated to compiled-route-manifest.cjs"
---
# Implementation Summary: create-skill Compiled-Routing Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented |
| **Date** | 2026-07-21 |
| **Level** | 2 |
| **Implementation** | Parent-hub legacy/ready generation and validation delivered |
| **Default activation** | Unchanged; compiled serving remains operator-gated |
| **Strict validation** | Recorded after final metadata regeneration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

init_skill.py::init_parent_skill() now accepts parent-only --compiled-routing legacy|ready, with legacy as the backward-compatible CLI default. Both parent templates carry the exact generated directive. The scaffold also emits the compiler-required fallback checklist so the canonical minter can compile the final router inputs.

Ready generation writes all hub inputs first, calls .opencode/bin/compiled-route-manifest.cjs mint, then calls freshness. It prints compiled-ready (fresh manifest verified) only after both canonical results are valid and fresh. Legacy generation verifies that no canonical manifest exists and reports legacy (no manifest); inconsistent existing state fails closed.

The package validator consumes the same freshness CLI and distinguishes legacy, compiled-ready, stale, malformed, and inconsistent states. Authoring docs describe the same option, ordering, and status language. The lockstep inventory now names 19 factual surfaces: two templates, seven hub directives, seven catalogs, and three create-skill documents.

### Delivered Files

| Area | Files | Evidence |
|------|-------|----------|
| Generator | `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py` | Parent-only option, canonical mint/freshness calls, fail-closed labels |
| Templates | Active scaffold and canonical parent-hub template | Exact directive parity; compiler-valid fallback checklist |
| Validation | validate_skill_package.py | Shared freshness classification for both generated states |
| Tests | test_create_skill_contract.py, lockstep parity test | Temp hub ids/roots; no live manifest mutation |
| Docs and inventory | create-skill SKILL/README/reference and lockstep JSON | Synchronized workflow and 19/19 surface inventory |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused the committed manifest CLI as the only mint and freshness authority, extended the existing generator and validator in place, and verified every generated state with temporary hub identities. No production activation manifest, runtime decision, or frozen scorer was written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep legacy as the CLI default | Existing calls remain compatible and emit no manifest. |
| Ask authors to choose explicitly | Higher-level authoring does not hide onboarding intent behind the compatibility default. |
| Delegate policy identity to the canonical CLI | No local digest, allowlist, or manifest serializer can diverge from runtime authority. |
| Leave failed output for diagnosis | Failure returns non-zero and never emits a ready label; no destructive cleanup hides evidence. |
| Keep repository defaults untouched | Readiness is not serving activation. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Python contract suite | `python3 -m pytest .opencode/skills/sk-doc/scripts/tests/test_create_skill_contract.py -q` — 23 passed |
| Generated states | Legacy no-manifest and ready generation-1 legacy-authority shadow-only manifest proven with temporary hub ids |
| Negative matrix | Missing minter, pre-existing manifest, mint failure, stale, malformed, invalid state, and standalone option rejection fail closed |
| Directive parity | Both parent templates have byte-identical extracted directive blocks |
| Lockstep inventory | 19/19 registered files exist |
| Live activation safety | Seven production activation manifest hashes unchanged |
| Frozen scorer safety | Three frozen scorer hashes unchanged |
| Strict packet validation | Final result recorded after metadata regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The generated ready manifest proves freshness but remains generation 1, legacy-authority, and shadow-only; it does not enable serving.
2. The seven established hub directives remain untouched. Their earlier wording split is informational to the lockstep report and outside this generator-only change.
3. Default-on activation remains a separate operator decision.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- The activation controller may consume this implemented sibling at the operator-gated join.
- Any later directive wording change must update all 19 lockstep inventory surfaces.
<!-- /ANCHOR:follow-up -->

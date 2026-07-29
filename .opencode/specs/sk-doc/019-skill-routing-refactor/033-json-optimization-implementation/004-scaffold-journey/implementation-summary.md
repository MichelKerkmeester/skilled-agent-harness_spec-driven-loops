---
title: "Implementation Outcome: Complete the Scaffold-to-Route Journey"
description: "init_skill.py now auto-runs the class gate --fix and writes a compiler-valid derived block + valid category, S-class config defaults are single-sourced, and create-journey-proof asserts born-complete scaffolds (fixed=0); the full advisor-route joined leg (REQ-006) stays a documented deferral."
trigger_phrases:
  - "scaffold to route journey outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/004-scaffold-journey"
    last_updated_at: "2026-07-29T14:32:35Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolds born compiler-valid + gate-fresh; config single-sourced; journey-proof rename-drift fixed"
    next_safe_action: "Phase 005 ci-golden-prompts"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/004-scaffold-journey"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The joined test's advisor-ingest/selection leg (REQ-006) — deferred as a scoped verification enhancement; scaffold -> gate -> doctor + real-compiler derived validity are covered."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Complete the Scaffold-to-Route Journey

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Depends On** | `003-derived-regenerator-migration` |
| **Blocks** | `006-ci-compiler-accuracy-gates` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`init_skill.py` now auto-runs the H/S class gate (`ci-skill-root-metadata.cjs --fix`) scoped to the new root immediately after both `init_skill()` and `init_parent_skill()` finish writing, generating `leaf-manifest.json` (both classes) and `leaf-aliases.json` (S) before the scaffold reports success, and **aborts (returns None, CLI exit 1) with a printed cause if the gate fails** — closing the gap where a new skill stayed non-conforming until a hand `--fix`. Both `derived` block literals gained non-empty `key_files`, `entities`, and `causal_summary` values referencing files the scaffold has already written, so a fresh root satisfies `skill_graph_compiler.py`'s schema-version-2 validator on first ingest; the scaffold `category` is now a valid enum value (`utility` standalone, `workflow` parent). The S-class `leaf-manifest.config.json` defaults are single-sourced in `lib/s-class-config-defaults.json`, read by both `init_skill.py` and `generate-leaf-manifest.cjs`'s `readStandaloneConfig` fallback. This is O2 + O9 from the 029 map, and a prerequisite for Phase 6's CI compiler gate.

Delivered onto v4's `sk-create-skill` structure; the `create-journey-proof.test.cjs` also carried **stale `create-skill` paths the rename never updated** (7 refs) — fixed here, since the test could not even run otherwise.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three touch points plus a test repair, no existing skill root changed. `init_skill.py` gained a `_ensure_class_gate_fresh` helper (subprocess `--fix` scoped to the new root's parent, then a per-root check that the required generated files now exist — never a bare fleet-wide exit code). The `derived` literals were extended with fields composed only from files the scaffold already writes. `generate-leaf-manifest.cjs`'s fallback and `init_skill.py`'s scaffolded config now read one shared JSON default. `create-journey-proof.test.cjs` was re-pathed to `sk-create-skill`, taught to stage the shared config default the generator now requires, and its `--fix` assertion tightened to `fixed=0` (born gate-fresh).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Target `skill_graph_compiler.py`'s already-enforced schema for the `derived` fix rather than waiting on Phase 1 — this fixes the consumer that fails today; a follow-up alignment is accepted if Phase 1 names a different producer. Fix the journey-proof's stale rename paths as part of this phase rather than deferring — the test is 004's own acceptance oracle and could not run until re-pathed. Scaffolds are born gate-fresh (`fixed=0`) so the class gate is closed at scaffold time, not left to a later hand `--fix`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Confirmed in the worktree:
- `create-journey-proof.test.cjs` → **PASS**: both scaffold kinds born gate-fresh (`--fix` reports `checked=2 passed=2 failed=0 fixed=0`), scaffold-vs-template shape parity holds, and the parent-hub doctor check passes.
- REQ-003: a freshly scaffolded standalone's `graph-metadata.json` carries `key_files`/`entities`/`causal_summary` and `category: utility`; derived keys match the template shape exactly.
- REQ-004: the gate-fix helper returns `None` (abort) on failure — the scaffold is not reported successful with a half-generated root.
- `skill-root-metadata-contract.test.cjs` and `skill-derived-regenerator.test.cjs` stay green.
- All three fleet gates 11/11 (root-metadata, leaf-manifest freshness, derived freshness); **no existing skill root's files were touched**, so the pinned corpus (176/195, 53/72) is unchanged by construction.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**REQ-006 deferred (documented):** the full joined test asserts scaffold → gate → **advisor ingest → parent selection → compiled route**. The scaffold → gate → doctor legs are proven by `create-journey-proof`, and derived validity is confirmed against the real compiler; the advisor-route assertion legs (build the graph, run `advisor_recommend`, assert selection) are a heavy harness deferred as a scoped verification enhancement. This phase changes only what NEW scaffolds produce — fleet migration of existing roots is Phase 3's job. `validate.sh --strict` could not run (the spec-kit orchestrator build is broken repo-wide by a concurrent session's incomplete pi-hook relocation); verified by the direct gates above instead.
<!-- /ANCHOR:limitations -->

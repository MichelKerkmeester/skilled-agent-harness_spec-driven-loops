---
title: "Implementation Outcome: Complete the Scaffold-to-Route Journey"
description: "Planned record for making init_skill.py auto-run the H/S class gate --fix with a compiler-valid derived block, single-sourcing S-class config defaults, and adding the joined scaffold-to-route test — not yet built."
trigger_phrases:
  - "scaffold to route journey outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/004-scaffold-journey"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/004-scaffold-journey"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the joined test's ingest/selection legs call TS scorer/DB helpers directly or shell through a CLI front door"
      - "The exact derived.entities[] content the scaffold should assert"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Complete the Scaffold-to-Route Journey

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not yet — packet authored 2026-07-29, implementation not started |
| **Track** | sk-doc |
| **Depends On** | `003-derived-regenerator-migration` |
| **Blocks** | `006-ci-compiler-accuracy-gates` (must ship first) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`init_skill.py` will auto-run the H/S class gate (`ci-skill-root-metadata.cjs --fix`) scoped to the newly scaffolded root immediately after both `init_skill()` (standalone) and `init_parent_skill()` (parent-hub) finish writing their scaffold files, generating `leaf-manifest.json` (H+S) and `leaf-aliases.json` (S) before the scaffold is reported successful — closing the gap where a new skill is left non-conforming until someone runs `--fix` by hand. Both `derived` block literals will gain non-empty `key_files`, `entities`, and `causal_summary` fields that satisfy `skill_graph_compiler.py`'s schema-version-2 validator, so a fresh scaffold compiles clean on its first advisor ingest instead of failing offline later. The S-class `leaf-manifest.config.json` boilerplate defaults will be single-sourced between `init_skill.py`'s scaffolder and `generate-leaf-manifest.cjs`'s `readStandaloneConfig` fallback, removing a second hand-kept-equivalent copy. One new joined test will prove scaffold -> generated class gate -> advisor ingest -> parent selection -> compiled route for one S-class and one H-class skill in a single pipeline, closing the 024 journey-proof gap the 029 research (O2) confirmed is still open past the existing scaffold-to-doctor coverage. This is O2 + O9 from the 029 ranked opportunity map, and it is a hard prerequisite for Phase 6 turning on the CI compiler-schema gate.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three touch points, one new test, no changes to any existing skill root. `init_skill.py` gains a small class-gate-invoking helper mirroring its own existing `_run_manifest_command` pattern (subprocess call, JSON-parsed reply, per-root scoped outcome — never a bare exit code, since the gate's `--skills-dir` scan is fleet-wide and must not fail a scaffold over an unrelated pre-existing violation elsewhere). The `derived` block literals are extended with fields composed only after their referenced files already exist on disk. `generate-leaf-manifest.cjs`'s `readStandaloneConfig` and `init_skill.py`'s scaffolded config literal are reconciled to one shared default source. The new joined test models its advisor-ingest leg on the already-green `discovery-pipeline-parity.vitest.ts` pattern and its compiled-route leg on the `compiled-route-manifest.cjs` mint/freshness subprocess pattern `init_skill.py` itself already uses — both proven, already-in-repo patterns, not new infrastructure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Target `skill_graph_compiler.py`'s already-enforced schema for the `derived` block fix rather than waiting on Phase 1's derived-authority decision — this phase fixes the consumer that fails TODAY; a follow-up alignment pass is accepted as a possible cost if Phase 1 later names a different canonical producer. Scope the class-gate `--fix` call's pass/fail signal to the single newly-scaffolded root via JSON-result filtering rather than trusting the gate's aggregate exit code, because the gate's `--skills-dir` scan is fleet-wide by design and an unrelated pre-existing violation elsewhere must never fail an unrelated new scaffold. Extend the existing `create-journey-proof.test.cjs` coverage with a new file rather than rewriting it, preserving its already-passing shape-parity and doctor-check assertions untouched.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — implementation has not started. Planned verification (see `checklist.md`): `create-journey-proof.test.cjs`, `skill-root-metadata-contract.test.cjs`, and `leaf-resource-contract.test.cjs` stay green; the new joined test passes for both an S-class and H-class scaffold; `skill_graph_compiler.py`'s validator returns zero errors against a fresh scaffold's `derived` block with no hand-editing; a plain re-check of a fresh scaffold reports `fixed=0`; a scaffold run against a `--skills-dir` with a deliberately non-conforming sibling root still succeeds; and `validate.sh <this-folder> --strict` reports Errors:0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase changes what NEW scaffolds produce; it does not touch any existing skill root's committed `graph-metadata.json`, `leaf-manifest.json`, or `leaf-aliases.json` — fleet-wide migration of already-scaffolded roots to the same completeness is Phase 3's job, not this one's. The `derived` block fix targets the Python compiler's schema specifically; if Phase 1 later names a different canonical `derived` producer, this phase's authored literal may need a follow-up alignment edit. Two implementation-shape questions (the joined test's exact ingest/selection call path, and the precise `entities[]` content) are deliberately left open in `spec.md` §7 for the implementer to resolve against the cited evidence, not pre-decided here.
<!-- /ANCHOR:limitations -->

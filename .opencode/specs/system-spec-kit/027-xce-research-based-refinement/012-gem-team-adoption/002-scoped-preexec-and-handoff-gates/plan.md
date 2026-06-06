---
title: "Implementation Plan: 027/012/002 Scoped Pre-Execution & Handoff Gates"
description: "Plan for three predicate-guarded gates: typed debug→implement handoff schema, boundary contract-first for API/schema/integration edits, and a pre-mortem field for medium/high work — each scoped, additive, and advisory."
trigger_phrases:
  - "027 phase 012/002"
  - "scoped preexec gates"
  - "debug handoff schema"
  - "boundary contract-first"
  - "pre-mortem field"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/012-gem-team-adoption/002-scoped-preexec-and-handoff-gates"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 002 scoped gates from 007 P2 + 009"
    next_safe_action: "Land 012 envelope, then wire the 3 scoped gates"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-002-scoped-preexec-gates-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 027/012/002 Scoped Pre-Execution & Handoff Gates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent/skill contracts + Bash scaffold |
| **Framework** | OpenCode agent runtime (`.opencode/agents`, `.opencode/skills`) |
| **Storage** | None (docs/contract surfaces; no schema or DB change) |
| **Testing** | Manual gate-trigger walkthroughs + scaffold smoke test + strict spec validation |

### Overview

Phase 002 wires three scoped gates onto existing agent contracts. The predicates live in `@orchestrate`; `@debug` emits a typed debug→implement handoff; `@code` receiver-validates it; `sk-code` adds a boundary contract-first check for API/schema/integration intent only; and `@orchestrate` adds a pre-mortem field for medium/high work. The work is additive docs/contract edits plus scaffold flags — no runtime rewrite, no governance or validator change, and 012's typed envelope must land first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] P2 proposal identified in `research/007-gem-team-adoption-matrix/sub-packet-proposals.md` § P2.
- [x] Integration matrix + Wave 2 rollout identified in `research/009-gem-team-integration-impact/research.md` §2, §4.
- [x] Six target surfaces named with their predicates.
- [ ] `001-typed-agent-io-adapter` envelope (`confidence`/`failure_type`) available to reuse.

### Definition of Done

- [ ] Each gate fires only on its `@orchestrate` predicate and skips otherwise.
- [ ] `@debug` emits, `@orchestrate` preserves, and `@code` validates the typed handoff.
- [ ] Boundary contract-first triggers for API/schema/integration only.
- [ ] Pre-mortem field present for medium/high work only.
- [ ] Legacy `debug-delegation.md` warns (not fails); `@debug` stays user-opt-in.
- [ ] No governance/validator file changed; strict validation passes for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Predicate-guarded advisory gates layered onto existing agent contracts. `@orchestrate` is the single hub that owns the three predicates and routes the typed fields; the gates are adapters over existing contracts, never replacements.

### Key Components

- **Predicate set (in `@orchestrate`)**: `diagnosis_crosses_agents`, `change_class ∈ {api,schema,integration}`, `complexity ∈ {medium,high}` — the only triggers for Gates A/B/C respectively.
- **Typed debug-handoff (Gate A)**: `root_cause`/`target_files`/`fix_recommendations`/`confidence`, emitted by `@debug`, preserved by `@orchestrate`, validated by `@code`. Reuses 012's envelope `confidence`/`failure_type`.
- **Boundary contract-first (Gate B)**: a `sk-code` rule requiring a contract / boundary test / acceptance check before production edits, scoped to API/schema/integration.
- **Pre-mortem field (Gate C)**: risk level + top 2-3 failure modes + assumptions in the `@orchestrate` task format, for medium/high work.

### Data Flow

`@orchestrate` classifies the task (change class, complexity, whether a `@debug` diagnosis is crossing to `@code`) and evaluates the three predicates. If `diagnosis_crosses_agents`, the `@debug` handoff payload is carried into the `@code` dispatch, and `@code` checks field presence before any fix. If `change_class` matches, `sk-code` blocks production edits until a contract/test is identified. If `complexity` is medium/high, the task format carries the pre-mortem. Non-matching tasks flow through unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/agents/debug.md` | 5-phase root-cause; free-form handoff | Modify (add typed fields) | Handoff section lists `root_cause`/`target_files`/`fix_recommendations`/`confidence`; 5-phase method unchanged |
| `.opencode/agents/orchestrate.md` | Dispatch hub + task format | Modify (predicates + preserve handoff + pre-mortem) | 3 predicates defined; `@code` dispatch carries handoff; task format has pre-mortem gated on med/high |
| `.opencode/agents/code.md` | Implementer + verification discipline | Modify (receiver-validate) | Missing handoff fields ⇒ BLOCKED/LOW_CONFIDENCE, not a guessed fix |
| `.opencode/skills/sk-code/SKILL.md` | Multi-stack coding standards | Modify (contract-first gate) | Boundary contract-first scoped to API/schema/integration; not triggered on ordinary edits |
| `.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl` | Handoff doc template (5 sections) | Modify (typed fields in existing sections) | Fields added inside PROBLEM SUMMARY / CONTEXT FOR SPECIALIST / RECOMMENDED NEXT STEPS; anchors preserved |
| `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | Generates pre-filled handoff doc | Modify (flags + extraction + comment) | New CLI flags + JSON extraction for typed fields; stale `SCHEMA SOURCE ... lines 60-89` comment refreshed |

Required inventories:
- Same-class producers (gate definitions): `rg -n 'diagnosis_crosses_agents|change_class|complexity' .opencode/agents/orchestrate.md`.
- Consumers of the typed handoff: `rg -n 'root_cause|target_files|fix_recommendations' .opencode/agents .opencode/skills/system-spec-kit/templates .opencode/skills/system-spec-kit/scripts`.
- Predicate scope: confirm each gate references exactly one predicate and that low/typo/docs work matches none before claiming completion.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm `001-typed-agent-io-adapter` has shipped the envelope `confidence`/`failure_type` fields this packet reuses.
- [ ] Read all six target surfaces and locate the exact insertion points (debug handoff section, orchestrate dispatch + task format, code verification/return contract, sk-code intent routing, debug-delegation anchors, scaffold arg-parsing + tail comment).
- [ ] Confirm `@debug`'s 5-phase method and `sk-code`'s ordinary-edit path are the regions to leave UNCHANGED.

### Phase 2: Core Implementation

- [ ] Define the three predicates in `@orchestrate`: `diagnosis_crosses_agents`, `change_class ∈ {api,schema,integration}`, `complexity ∈ {medium,high}`.
- [ ] Add the typed handoff fields (`root_cause`/`target_files`/`fix_recommendations`/`confidence`) to `@debug`, framed as a downscale of Gem's `debugger_diagnosis` check; keep the 5-phase method untouched.
- [ ] Preserve the typed handoff in `@orchestrate`'s `@code` dispatch path.
- [ ] Add receiver-validation to `@code`: missing required handoff fields ⇒ BLOCKED/LOW_CONFIDENCE, never a guessed fix.
- [ ] Add the boundary contract-first gate to `sk-code/SKILL.md`, scoped to API/schema/integration intent only.
- [ ] Add the pre-mortem field (risk + top 2-3 failure modes + assumptions) to the `@orchestrate` task format, gated on medium/high.
- [ ] Add the typed fields inside the existing debug-delegation template sections; preserve all anchors.
- [ ] Add CLI flags + JSON extraction for the typed fields to `scaffold-debug-delegation.sh` and refresh the stale schema-line comment.

### Phase 3: Verification

- [ ] Walk a low/typo/docs task and confirm no gate fires.
- [ ] Walk an ordinary edit and confirm boundary contract-first does not trigger.
- [ ] Walk an API/schema/integration change and confirm contract-first triggers.
- [ ] Walk a medium/high task and confirm the pre-mortem field is required; walk a low task and confirm it is omitted.
- [ ] Walk a debug→implement crossing and confirm the typed handoff is emitted, preserved, and validated; force a missing field and confirm `@code` blocks.
- [ ] Confirm a legacy `debug-delegation.md` warns rather than fails.
- [ ] Smoke-test `scaffold-debug-delegation.sh` with the new flags.
- [ ] Run strict spec validation; confirm no governance/validator file was touched.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1: Setup | `012` envelope shipped | Gate A reuses 012's `confidence`/`failure_type`; insertion points must be read before editing. |
| Phase 2: Core Implementation | Phase 1 | Predicates in `@orchestrate` are referenced by the other surfaces, so define them alongside the agent edits. |
| Phase 3: Verification | Phase 2 | Gate-trigger walkthroughs must exercise the actual predicate scoping. |

Execution order is sequential. Implement Gate A across `@debug`→`@orchestrate`→`@code` + the template/scaffold together (one seam), then Gate B in `sk-code`, then Gate C in `@orchestrate`.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual walkthrough | Each predicate's fire/skip behavior across the 4 task shapes | Read-through of `@orchestrate` routing |
| Manual walkthrough | Debug→implement handoff emit → preserve → validate, incl. missing-field block | Read-through of `@debug`/`@orchestrate`/`@code` |
| Smoke test | `scaffold-debug-delegation.sh` with new typed-field flags | Bash, generated `debug-delegation.md` |
| Regression | Legacy `debug-delegation.md` warns, not fails | Existing generator behavior |
| Documentation | Spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

Required matrix:

| Axis | Values |
|------|--------|
| Task complexity | low, medium, high |
| Change class | docs/typo, ordinary code, api, schema, integration |
| Debug crossing | no diagnosis, same-session diagnosis (no crossing), debug→implement crossing |
| Handoff completeness | all fields present, one required field missing |
| Handoff provenance | new schema-bearing report, legacy schema-less report |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Area | Est. LOC | Notes |
|------|----------|-------|
| `@orchestrate` predicates + handoff preserve + pre-mortem field | 40-60 | The hub carries the most additive contract text. |
| `@debug` typed handoff fields + honest framing | 25-40 | Fields inside existing handoff section; 5-phase method untouched. |
| `@code` receiver-validate behavior | 20-30 | BLOCKED/LOW_CONFIDENCE path on missing fields. |
| `sk-code` boundary contract-first gate | 20-30 | Scoped to API/schema/integration intent. |
| `debug-delegation.md.tmpl` + scaffold flags/extraction/comment | 30-50 | Template fields + Bash flags + stale-comment refresh. |
| **Total** | **~150-220** | Matches the P2 carve-out estimate. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-typed-agent-io-adapter` typed envelope | Upstream (hard) | Must ship first (Wave 1) | Gate A's `confidence`/`failure_type` fields have no canonical home until 012 lands |
| `@debug` 5-phase method | Internal | Available | Typed seam attaches to it; left unchanged |
| `@code` verification discipline | Internal | Available | Receiver-validate extends it |
| `@orchestrate` dispatch + task format | Internal | Available | Hub for all three predicates |

No external dependencies. No network access required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fires on out-of-scope work (e.g. contract-first on an ordinary edit, or a pre-mortem demanded for low work), or a legacy `debug-delegation.md` hard-fails.
- **Procedure**: Revert the offending surface's edit; because every field is additive and optional, reverting one gate leaves the others functional.
- **Blast radius**: Agent/skill/template/scaffold docs only — no governance, validator, schema, or DB surface.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Failure Mode | Detection | Rollback |
|--------------|-----------|----------|
| Gate B triggers on ordinary edits | Ordinary-edit walkthrough demands a contract | Restore the prior `sk-code` intent gate and re-narrow `change_class` matching. |
| Gate C demanded for low-complexity work | Low task walkthrough shows a required pre-mortem | Re-scope the `@orchestrate` predicate to medium/high and re-test. |
| `@code` blocks legitimate work because a handoff field is optional-but-absent | Crossing walkthrough blocks a valid fix | Narrow the required-field set to the truly mandatory subset; keep the rest advisory. |
| Legacy `debug-delegation.md` fails instead of warning | Legacy report run produces an error | Restore warn-only behavior in docs + scaffold; require manual verification. |

Rollback must preserve the predicate-scoping discipline: revert the field, not the scope guard, so a reverted gate can never become universal.
<!-- /ANCHOR:enhanced-rollback -->

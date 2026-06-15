---
title: "Feature Specification: Formalize the parent-nested-skill pattern (sk-doc + /create + /doctor + benchmark)"
description: "Turn the deep-loop-workflows reference implementation into a reusable, documented, tooled standard: an sk-doc skill_creation.md section + hub/registry templates, a /create:parent-skill scaffolder, a read-only /doctor:parent-skill validator route, and a routing/discovery benchmark dogfooded through deep-loop-workflows' own skill-benchmark mode."
trigger_phrases:
  - "formalize parent skill pattern"
  - "create parent-skill command"
  - "doctor parent-skill validator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/003-formalize-pattern"
    last_updated_at: "2026-06-15T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped sk-doc section + /create + /doctor + benchmark; all verified"
    next_safe_action: "Validate and commit; close the 155 epic"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation.md"
      - ".opencode/commands/create/parent-skill.md"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-003-formalize-pattern"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "How to dogfood the benchmark? deep-loop-workflows skill-benchmark fixtures + advisor-probe scorecard"
---
# Feature Specification: Formalize the parent-nested-skill pattern

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 003 (parent: `155-parent-nested-skill-pattern`) |
| **Depends on** | `../research/research.md`, `../002-advisor-routing-drift-guard` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-loop-workflows` is the framework's first parent-skill-with-nested-mode-packets, and Phases 1–2 proved the pattern and Phase 3 implemented its routing optimization. But the pattern lived only as a one-off artifact: no authoring guide, no scaffolder, no validator, no benchmark. A future parent skill would have to reverse-engineer the invariants (one `graph-metadata.json`, the `advisorRouting` contract, the C-plus drift-guard) from the deep-loop-workflows source.

### Purpose
Turn the reference implementation into a reusable, documented, tooled standard with four deliverables: (1) an `sk-doc` authoring section + templates; (2) a `/create:parent-skill` scaffolder; (3) a read-only `/doctor:parent-skill` validator route; (4) a routing/discovery benchmark dogfooded through `deep-loop-workflows`'s own `skill-benchmark` mode. This phase adds no behavior to the advisor or the skill — it is documentation + tooling around the now-stable pattern.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **sk-doc:** a new section "Parent Skills with Nested Mode Packets" in `sk-doc/references/skill_creation.md` (§10; RELATED RESOURCES renumbered §11) + `assets/skill/parent_skill_hub_template.md` + `assets/skill/parent_skill_registry_template.json`.
- **/create:parent-skill:** `commands/create/parent-skill.md` + `create_parent_skill_{presentation.txt,auto.yaml,confirm.yaml}` (mirrors the self-contained `/create:feature-catalog` precedent); registration in both `README.txt` indexes + the `@markdown` agent's command-map across all three runtime mirrors.
- **/doctor:parent-skill:** a read-only route in `commands/doctor/_routes.yaml` + `doctor_parent-skill.yaml` workflow asset + `scripts/parent-skill-check.cjs` (12 invariant checks) + a `speckit.md` router row.
- **Benchmark:** a `deep-loop-workflows/` skill-benchmark fixtures corpus (5 mode scenarios, public/private pairs) + a routing-precision scorecard, dogfooding the existing skill-benchmark harness.
- A 3→4 `routingClass` reconcile in `../research/research.md` (the shipped code added `alias-fold`).

### Out of Scope
- Any behavior change to the advisor, the registry routing, or `deep-loop-workflows`.
- Renaming `ai-council` (grandfathered; the standard requires `folder==name` for new parent skills only).
- A full live skill-benchmark harness run with usefulness ablation (D4) — the dogfood seeds fixtures + a deterministic routing-precision scorecard; D4 stays a follow-on.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** The sk-doc section documents the anatomy, the one-`graph-metadata.json` invariant + mechanism, the 4-class `advisorRouting` contract, the C-plus drift-guard rule, ALWAYS/NEVER rules, and `deep-loop-workflows` as the worked example; the sk-doc validator passes with no new issues.
- **R2 (MUST):** `/create:parent-skill` mirrors an existing self-contained create command exactly; its YAMLs parse; it enforces the one-identity invariant as a hard gate; it is registered in every index + agent mirror.
- **R3 (MUST):** `/doctor:parent-skill` is a read-only route that runs the 12 invariant checks; it PASSES on the `deep-loop-workflows` reference and FAILS on a broken fixture (meaningful, not vacuous); its script is comment-hygiene clean.
- **R4 (MUST):** The benchmark fixtures are valid; the routing-precision scorecard runs and the lexical modes route correctly.
- **R5 (MUST):** No advisor/registry/skill behavior changes; `validate.sh --strict` green on this phase.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- sk-doc §10 + templates present + validator clean (0 new warnings).
- `/create:parent-skill` files present + YAMLs parse + mirrors consistent (3/3 runtimes).
- `/doctor:parent-skill` runs PASS on deep-loop-workflows (exit 0), FAIL on broken (exit 1), missing (exit 2); hygiene exit 0.
- Benchmark fixtures valid (10 files) + scorecard 3/3 lexical modes.
- `validate.sh --strict` green on this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** `../research/research.md` (the pattern definition) + `../002-advisor-routing-drift-guard` (the advisorRouting block the docs/tools describe).

- Authoring drift from the shipped code (e.g. the 3-vs-4 routingClass gap) — caught here and reconciled; the `/doctor` check + drift-guard remain the executable source of truth.
- The `/create:parent-skill` `update` branch is an extrapolation (the research specified only the create path) — documented as such, mirrors sibling create commands.

Rollback is `git restore` + removing the new files; all deliverables are additive.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Additive only:** no advisor/registry/skill behavior changes.
- **Convention-faithful:** each deliverable mirrors the existing surface (sk-doc templates, create-command trio, doctor route).
- **Validation:** `validate.sh --strict` green before the epic closes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A future parent skill with a folder≠name packet — the standard requires `folder==name`; `deep-loop-workflows`'s `ai-council` is the only grandfathered exception (recorded via `packetSkillName`).
- The skill-benchmark harness's advisor probe (D1-inter) is opt-in and the profile is not yet runtime-consumed — the dogfood seeds fixtures + uses the deterministic `--deep-skill-routing-json` probe for the scorecard.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium breadth, low risk: documentation + tooling across four surfaces (sk-doc, /create, /doctor, benchmark), all additive and convention-mirroring. Authored by three parallel agents + the orchestrator, each output independently verified (validator, runs, parses, hygiene, mirror parity).
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None blocking. The `/create` update-merge semantics + a full live benchmark (D4) are noted follow-ons, not gaps in the create/validate/document standard.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md`.
- **Research** (the pattern): `../research/research.md`.
- **The implementation it documents**: `../002-advisor-routing-drift-guard`.
- **Deliverables**: `sk-doc/references/skill_creation.md` §10, `commands/create/parent-skill.md`, `commands/doctor/scripts/parent-skill-check.cjs`, the `skill_benchmark/fixtures/deep-loop-workflows/` corpus.

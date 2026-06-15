---
title: "Implementation Summary: Formalize the parent-nested-skill pattern"
description: "Phase 003 of the parent-nested-skill-pattern epic: shipped the sk-doc authoring section + templates, the /create:sk-skill-parent scaffolder, the read-only /doctor:parent-skill validator route, and a dogfooded routing/discovery benchmark. Authored by three parallel agents + the orchestrator, all outputs independently verified."
trigger_phrases:
  - "formalize parent skill summary"
  - "phase 003 complete"
  - "parent skill pattern standardized"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/003-formalize-pattern"
    last_updated_at: "2026-06-15T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped + verified all 4 formalization deliverables"
    next_safe_action: "Close the 155 epic (completion verification)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/skill_creation.md"
      - ".opencode/commands/create/sk-skill-parent.md"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-003-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to dogfood the benchmark? Author deep-loop-workflows skill-benchmark fixtures + an advisor-probe routing scorecard"
---
# Implementation Summary: Formalize the parent-nested-skill pattern

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 003 of the parent-nested-skill-pattern epic |
| **Status** | Complete |
| **Date** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Depends on** | `../research/research.md`, `../002-advisor-routing-drift-guard` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Four additive deliverables formalizing the parent-nested-skill pattern, plus a research reconcile:

- **sk-doc authoring standard** — a new section §10 "Parent Skills with Nested Mode Packets" in `sk-doc/references/skill_creation.md` (RELATED RESOURCES renumbered §11) covering the anatomy, the one-`graph-metadata.json` hard invariant + its `skill-graph-db.ts` mechanism, the four-class `advisorRouting` contract, the C-plus drift-guard rule, ALWAYS/NEVER rules, and `deep-loop-workflows` as the worked example. Two templates: `assets/skill/parent_skill_hub_template.md` + `parent_skill_registry_template.json`.
- **`/create:sk-skill-parent` scaffolder** — `commands/create/sk-skill-parent.md` + `create_parent_skill_{presentation.txt,auto.yaml,confirm.yaml}` (mirrors the self-contained `/create:feature-catalog` precedent). Scaffolds a hub `SKILL.md` + `mode-registry.json` (with `advisorRouting`) + N packet skeletons (`folder==packetSkillName==deep-<mode>`, no per-packet `graph-metadata.json`) + a non-discoverable `shared/` + exactly one hub `graph-metadata.json`, with the one-identity invariant enforced as a hard gate. Registered in both `README.txt` indexes and the `@markdown` agent's command-map across all three runtime mirrors.
- **`/doctor:parent-skill` validator** — a read-only route in `commands/doctor/_routes.yaml` + `doctor_parent-skill.yaml` workflow asset + `scripts/parent-skill-check.cjs` (11 invariant checks: one identity, no nested metadata, registry/packet consistency, the 3-tier discriminator + advisorRouting per mode, drift-guard presence + the optional projection cross-check) + a `speckit.md` router row.
- **Routing/discovery benchmark (dogfood)** — a `deep-loop-workflows/` skill-benchmark fixtures corpus (5 mode scenarios, public/private pairs, gold = `deep-loop-workflows` + mode) seeding the skill's own skill-benchmark harness, plus an advisor-probe routing check. The probe confirms 3/3 lexical modes route to `deep-loop-workflows` + the right mode; the skill-benchmark harness scores **skill-id only** (not workflowMode), so per-mode precision is enforced by the routing-parity fixtures, and 2 of the 5 fixtures (context, agent-improvement) are skill-level only.
- **Research reconcile** — `research/research.md` exec-rec updated from a 3-class to the shipped 4-class `routingClass` enum (the implementation made the "folded" case the explicit `alias-fold` class).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three independent surfaces were authored by three parallel agents (two `@markdown` for sk-doc + /create; one general for /doctor), each briefed with the committed `research.md` design and the existing convention to mirror, writing to non-overlapping directories. The orchestrator authored the benchmark + the research reconcile, then independently re-verified every agent's output (validator, runs, parses, mirror parity, hygiene, negative-path) before committing — agents over-report, so each load-bearing claim was confirmed against the real artifact.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Mirror existing conventions, don't invent**: sk-doc template location (`assets/skill/`), the self-contained `/create:feature-catalog` trio, the doctor YAML-asset route.
- **Dogfood the benchmark**: seed the existing skill-benchmark harness with deep-loop-workflows fixtures + a deterministic advisor-probe scorecard, rather than build a new harness (mode-level precision is additionally enforced by the parity fixtures + drift-guard).
- **`/doctor` is read-only**: it inspects + reports; it never mutates the advisor or the skill.
- **Standard requires `folder==packetSkillName==deep-<mode>`** for new parent skills; `ai-council` stays a grandfathered exception recorded via `packetSkillName`.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- sk-doc `validate_document.py`: valid, 0 blocking, **0 new warnings** vs HEAD; §10 at line 1018; both templates parse.
- `/create` YAMLs parse (`yaml.safe_load`); the `@markdown` command-map is consistent across `.opencode`/`.claude`/`.codex` (2 hits each).
- `/doctor:parent-skill` run on the `deep-loop-workflows` reference: **all 11 invariants PASS, exit 0**; negative-path proof: broken fixture → exit 1, missing dir → exit 2; `check-comment-hygiene.sh` on the script → exit 0; `route-validate.sh` → 8 routes validated.
- Benchmark fixtures: 10 files, 0 invalid, gold = `deep-loop-workflows` + correct mode; advisor-probe routing **3/3** lexical modes (the skill-benchmark harness scores skill-id only; per-mode precision is enforced by the parity fixtures).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` — run at close-out this turn; expected green at Level 2.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The `/create:sk-skill-parent` `update` branch (revise an existing parent skill) is a reasonable extrapolation mirroring sibling create commands; the research specified only the create path, so update-merge semantics are not a research-defined contract.
- The benchmark dogfood seeds fixtures + a deterministic routing scorecard; the skill-benchmark harness's usefulness ablation (D4, live mode) and the not-yet-runtime-consumed profile loader remain follow-ons.
- The sk-doc validator's 7 `non_sequential_numbering` warnings are pre-existing (fenced example headings in §5), unchanged by this phase.

<!-- /ANCHOR:limitations -->

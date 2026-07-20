---
title: "Implementation Summary: sk-doc Template Alignment"
description: "Planning-time record (Status: Planned) of the trigger_phrases claim fix, topology quote-tolerance, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest. No code has been written yet; this document will be updated with delivery evidence once implementation completes."
trigger_phrases:
  - "sk-doc template alignment implementation summary"
  - "lockstep manifest planned summary"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: sk-doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned — not yet started |
| **Authored** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Unaffected — this child changes no manifest, no `selectedPolicy`, and no routing decision |
| **Strict validation** | Planning-doc validation (`validate.sh --strict` on this folder) is run at authoring time; implementation-time re-run against delivered code is a separate completion gate, not yet exercised |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: Planned.** Nothing below has been built yet; this section states the intended build so implementation can be verified against it.

Corrected sk-doc catalog and playbook templates: the false trigger_phrases-drives-routing claim removed (or corrected once the harvester extension makes it true), a quote-tolerant topology validator with one documented canonical serialization, a 12-value canonical test-type taxonomy replacing the stale 2-value set, a new strict package validator proving catalog-set bijection/path-existence/taxonomy conformance, and a P4 lockstep directive-surface manifest naming all 9 surfaces (7 hub SKILL.md + 2 create-skill parent templates) with a normalized-parity fixture test. None of this changes a routing decision.

### Files Planned

| Area | Files | Purpose |
|------|-------|---------|
| Doc-truth | `feature-catalog-snippet-template.md`, `feature-catalog-template.md` | Corrected trigger_phrases claim + updated taxonomy line |
| Quote-tolerance | `validate-playbook-topology.cjs` | Accept quoted and unquoted typed-gold YAML |
| Taxonomy | `validate_document.py`, `feature-catalog-snippet-template.md` | 12-value canonical `allowed` set |
| Package validator | `validate_catalog_package.py` (new) | Bijection + path-existence + taxonomy conformance |
| Lockstep manifest | `compiled-routing-lockstep-surfaces.json` (new), `compiled-routing-lockstep-parity.test.cjs` (new) | The 9-surface P4 rewrite-target manifest + its parity test |
| Stretch (P1) | `doc-frontmatter.ts` | Capped feature-catalog leaf harvesting |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | This planning record |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

> **Status: Planned.** The phases below describe the intended delivery sequence; none has executed yet.

Per `plan.md`, three phases: (1) setup — remove/correct the trigger_phrases claim across both catalog templates, make the topology validator quote-tolerant, add quoted/unquoted fixtures; (2) implementation — census the live corpus's Type-column values, define and wire the 12-value taxonomy, author the strict package validator, author the lockstep manifest and its parity test; (3) verification — the P1 harvester-extension stretch, then a frozen-scorer re-hash and `validate.sh --strict` on this folder. Every phase is additive or a doc-truth correction; none requires a rollback beyond a plain file revert.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Split CF-TPL-2 into a P0 "remove the false claim" and a P1 "extend the harvester to make it true" | The removal is the cheapest correct fix and ships independently; extending the harvester is a larger, separately-gated change to a different skill's code (`system-skill-advisor`) |
| Taxonomy census (REQ-005) runs before the 12-value list is finalized | Fabricating 12 labels without checking the live corpus would just relocate the "de-facto stale" problem the finding describes |
| New standalone `validate_catalog_package.py` rather than folding bijection logic into `validate_document.py` | The bijection check is cross-file (comparing multiple catalogs against the 7-hub set), while `validate_document.py` is single-file scoped; kept as an Open Question in `spec.md` §7 pending a build-time look at how much state-sharing is actually needed |
| Lockstep manifest ships before 011 or 013 exist | A concrete, testable manifest is more useful to 011's eventual design than prose describing "7 SKILL.md directives"; the parity test is written to compare current wording, not to assume 013's not-yet-authored literal text |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

> **Status: Planned.** The checks below are what will be run; none has been run yet.

Once implemented, this child will be verified by: (1) no catalog template claiming trigger_phrases drives routing unless the harvester extension has shipped; (2) the topology validator's quoted and unquoted fixtures parsing to identical output; (3) the strict package validator reporting zero violations on a clean corpus and failing each seeded violation class by name; (4) the lockstep-parity test passing clean and failing on a seeded drift by naming the drifted surface; (5) the 12-value taxonomy accounting for 100% of the fresh corpus census with zero unmapped stragglers; (6) frozen-scorer SHA-256 digests unchanged pre/post; (7) `validate.sh --strict` on this folder reporting Errors: 0.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning-only record.** Status is Planned, not Complete; no code, test, or script described above has been written yet.
2. **REQ-005 and REQ-006 (P1) may be deferred with user approval**, particularly REQ-006 if it more properly belongs to `system-skill-advisor`'s own packet rather than this sk-doc child (see the Open Question in `spec.md` §7).
3. **The exact 12-value taxonomy is not enumerated in this planning doc** — inventing specific labels without a fresh corpus census would be fabrication; the census and the resulting list are build-time work.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: planned
    current_focus: "Level-2 planning docs authored for 009-sk-doc-template-alignment (spec/plan/tasks/checklist/implementation-summary); no implementation started"
    next_steps:
      - "Run the fresh corpus census (T006) before finalizing the 12-value taxonomy"
      - "Resolve the three Open Questions in spec.md §7 at build time"
      - "Confirm whether REQ-006 (harvester extension) belongs in this child or in system-skill-advisor"
    blockers: []
-->

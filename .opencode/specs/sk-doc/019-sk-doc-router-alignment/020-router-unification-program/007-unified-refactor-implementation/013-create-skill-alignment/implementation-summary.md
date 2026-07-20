---
title: "Implementation Summary: create-skill Compiled-Routing Alignment"
description: "Planned-state record for aligning create-skill's parent-hub generator with compiled-routing directives and manifest-based onboarding. No generator or runtime implementation is present yet."
trigger_phrases:
  - "create-skill compiled routing planned summary"
  - "parent hub onboarding current status"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: create-skill Compiled-Routing Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Implementation** | Not started |
| **Current create-skill awareness** | Zero compiled-routing tokens beneath the packet |
| **Strict validation** | Planned after the full Markdown set is authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The parent-hub generator will gain the same additive compiled-routing directive used by the seven established hubs and an explicit onboarding state. Legacy generation will omit the canonical manifest and remain on the fallback path. Ready generation will invoke the shared minter and report compiled-ready only after the shared predicate confirms freshness.

### Planned Implementation Surfaces

| Area | Planned Files | Purpose |
|------|---------------|---------|
| Generator | `create-skill/scripts/init_skill.py` | Parse parent state, render hub name, mint and verify ready manifests |
| Templates | Active hub scaffold and canonical parent-hub template | Keep generated directives identical |
| Workflow | create-skill `SKILL.md`, README, and parent reference | Ask the state explicitly and document the ordered manifest step |
| Validation | `validate_skill_package.py` and create-skill contract tests | Prove both states and fail-closed outcomes |

No create-skill, runtime, manifest, or scorer file was modified by this planning phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation waits for the P3 minter, freshness predicate, canonical manifest location, and data-driven runtime discovery. After those interfaces stabilize, the two templates move together, the initializer gains the state adapter, and the existing create-skill contract suite expands to cover legacy, ready, and failure outcomes before any adoption claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Add the directive to every generated parent hub | Legacy and ready hubs should share one durable SKILL.md shape; eligibility is determined by the manifest state. |
| Default existing CLI calls to legacy | Preserves automation compatibility and the safe no-manifest state. |
| Require the authoring workflow to ask explicitly | Human/agent-created hubs should not hide the onboarding decision behind a compatibility default. |
| Delegate minting and freshness to P3 interfaces | Prevents a second eligibility algorithm or hardcoded hub map inside create-skill. |
| Reject ready claims on every mint/freshness error | A safe legacy fallback must not be mislabeled as compiled-ready. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Current-state source inspection | Confirmed: parent generator and templates have no compiled-routing awareness |
| Directive rendering tests | Planned |
| Legacy no-manifest test | Planned |
| Ready fresh-manifest test | Planned |
| Mint/freshness failure matrix | Planned |
| Standalone and existing parent regression suite | Planned |
| Strict skill-package and spec-folder validation | Planned spec command: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/013-create-skill-alignment --strict` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Ready mode depends on P3 interfaces that do not exist yet.** This packet cannot truthfully select a manifest location or eligibility result before those interfaces stabilize.
2. **Current runtime discovery is limited to established hubs.** A new hub cannot become operationally compiled-ready until P3 removes that fixed discovery boundary.
3. **Existing hubs are not migrated by this phase.** The generator affects new explicit runs only.
4. **A mint-failure retention policy remains open.** The operator must choose whether failed ready output stays as a diagnostic legacy scaffold or remains staged outside the final target.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Finalize the P3 minter, manifest-store, freshness, and runtime-discovery interfaces.
- [ ] Resolve the ready-mode mint-failure retention policy.
- [ ] Implement the generator, template, workflow, validator, and test changes listed in `spec.md`.
- [ ] Run the full create-skill contract suite and strict package validation on generated fixtures.
- [ ] Let the parent workflow generate `description.json` and `graph-metadata.json` for this spec folder; this leaf authoring pass does not create them.
<!-- /ANCHOR:follow-up -->

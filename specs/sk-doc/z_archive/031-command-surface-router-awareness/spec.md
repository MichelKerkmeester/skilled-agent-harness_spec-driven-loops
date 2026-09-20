---
title: "Feature Specification: Command-Surface Root ROUTER.md Awareness Remediation"
description: "Close the six gaps the deep-research audit found between the shipped root ROUTER.md parent-skill standard and the command/CI/doctor/doc surfaces that must enforce or reference it."
trigger_phrases:
  - "command surface router awareness remediation"
  - "root router fleet gate remediation"
  - "router md ci doctor doc gaps"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Command-Surface Root `ROUTER.md` Awareness Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — all 4 phases shipped (Phase 2 resolved by Phase 1) |
| **Created** | 2026-08-16 |
| **Evidence** | `research/lineages/dsflashgo/research.md` (deep-research, 5 iterations, opencode-go/deepseek-v4-flash) |
| **Predecessor** | `sk-doc/019-skill-routing-refactor/015-router-unification-program` (shipped the root ROUTER.md standard) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The root `ROUTER.md` parent-skill standard is functionally live: all seven class-H hubs carry a conformant `router_state: active` root `ROUTER.md`, the create-skill commands scaffold it, and `init_skill.py` writes it. But the deep-research audit found six places where the surrounding **enforcement and documentation surfaces** have not caught up:

- The one CI gate that validates root `ROUTER.md` fleet-wide does not fire when a `ROUTER.md` is edited.
- The fleet class-H metadata gate never checks the root `ROUTER.md` contract at all.
- No `/doctor` route audits `ROUTER.md` across all seven hubs in one pass.
- Three documentation surfaces still link or cite the relocated legacy `smart-routing.md`.
- One authoring template keeps the legacy filename.

### Purpose

Make the enforcement surfaces authoritative and non-bypassable for the root `ROUTER.md` contract, and remove the stale legacy references — so a malformed, dual-source, or missing hub `ROUTER.md` cannot land undetected, and no doc points a reader at a file that no longer exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- CI: add `.opencode/skills/*/ROUTER.md` to the trigger paths of `routing-registry-drift.yml`; wire the root-router contract into the class-H branch of `ci-skill-root-metadata.cjs` and its contract library.
- Doctor: give the `parent-skill` route (or a new sibling route) a fleet-wide root `ROUTER.md` sweep over every `mode-registry.json`-bearing hub.
- Docs: repoint or drop the dead `smart-routing.md` links and `smart-routing.md §N` citations in `sk-code/shared/references/phase-detection.md`, the deep-alignment `sk-code-adapter.md` / `sk-code-known-deviations.md`, and the deep-review playbook anchor references.
- Cosmetic (deferrable): rename `parent-skill-smart-routing-template.md` → `parent-skill-root-router-template.md` and update its cross-references.

### Out of Scope

- Editing the frozen replay/scorer code or the seven hubs' `ROUTER.md` content (already conformant).
- Adding `ROUTER.md` to the skill advisor's harvest scope (audit confirmed it is intentionally advisor-agnostic).
- Changing routing policy, `hub-router.json`, or `mode-registry.json` semantics.
- Re-running or re-scoping the deep-research audit (evidence is frozen in `research/`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Gap | Severity |
|----|-------------|-----|----------|
| REQ-1 | A push/PR that edits only a hub's root `ROUTER.md` MUST trigger the fleet parent-skill check. | GAP-1 | HIGH |
| REQ-2 | The fleet class-H metadata gate MUST fail when a hub's root `ROUTER.md` is missing, malformed, dual-source, or leaves a legacy default residue. | GAP-2 | HIGH |
| REQ-3 | An operator MUST be able to audit root `ROUTER.md` across all seven hubs in one `/doctor` invocation. | GAP-3 | MEDIUM |
| REQ-4 | No documentation surface may link or cite the relocated legacy `smart-routing.md` path. | GAP-4/5/6 | MEDIUM/LOW |
| REQ-5 | (Deferrable) The root-router authoring template filename should not carry the legacy `smart-routing` term. | GAP-7 | LOW |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-1: Editing any `.opencode/skills/*/ROUTER.md` triggers `routing-registry-drift.yml` (verified: `ROUTER.md` present in both `push` and `pull_request` `paths:`).
- SC-2: `ci-skill-root-metadata.cjs` fails a hub whose root `ROUTER.md` violates `root-router-contract.cjs` (verified: a deliberately broken fixture hub exits non-zero via the class-H branch).
- SC-3: One `/doctor` command reports the two-state contract result for all seven hubs (verified: run enumerates 7 hubs and their `router_state`).
- SC-4: `grep -rn "smart-routing.md" .opencode/skills` returns only legitimate legacy-rejection/migration/test/template references — zero dead links or dangling `§N` citations.
- SC-5: Each phase's own diff passes the repo's normal checks; no frozen or out-of-scope surface changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| GAP-2 wiring reuses the frozen RRC codes; a new duplicate validator would drift. | Reuse `root-router-contract.cjs` directly from the class-H branch; add no parallel library. |
| CI change touches `.github/workflows` (affects every push). | Path-list addition only; no job logic change; verify YAML with a dry parse before commit. |
| Doc citation fixes span three skills — risk of touching adjacent content. | Scope each edit to the exact cited lines; repoint or drop only the legacy reference. |
| Implementation executor is deepseek/luna per operator directive. | Each phase task is self-contained with exact file:line + fix + verification so a fresh executor needs no extra context. |
| Toolchain: repo `node_modules` was found hollow this session (repaired ad hoc). | Any phase that runs CI scripts locally must confirm the toolchain first. |
<!-- /ANCHOR:risks -->

---

## RELATED DOCUMENTS

- **Evidence (frozen):** `research/lineages/dsflashgo/research.md`
- **Plan:** `plan.md`
- **Tasks:** `tasks.md`
- **Checklist:** `checklist.md`
- **Standard shipped by:** `../019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/`

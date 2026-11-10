---
title: "Feature Specification: routing doctrine and discovery vocabulary"
description: "Every hub now states one always-loaded policy that matches what the runtime enforces, and the deep-loop hub's keyword block and discovery terms name only live families."
trigger_phrases:
  - "routing doctrine"
  - "defaultResource policy"
  - "always-loaded preamble"
  - "retired vocabulary"
  - "discovery terms"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: routing doctrine and discovery vocabulary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 010-version-authority-completion |
| **Successor** | 012-missing-stress-fixture-root |
| **Handoff Criteria** | Both artifacts of every hub state one policy, and the guard passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the alignment review, closing the finding class the review filed as a
contradictory preamble policy plus a discovery-vocabulary residue.

**Scope Boundary**: the `hub-router.json` `routerPolicy` block and the `SKILL.md`
keyword block of the hubs that carry one, plus the deep-loop hub's `graph-metadata.json`
discovery terms, plus the activation manifests those edits stale.

**Dependencies**:
- The wave-one and wave-two findings registries, which supply the exact sites and the
  enforcement evidence.

**Deliverables**:
- One always-loaded statement per hub, in the artifact the runtime reads.
- Retired families removed from the keyword block and the discovery terms.
- Both activation-manifest copies re-minted in the same change.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every hub that declared both an always-loaded policy and a stage-two preamble stated them
oppositely. `hub-router.json` pointed `routerPolicy.defaultResource` at routing helpers while
the hub's own `ROUTER.md` declared `DEFAULT_RESOURCE = []` as a deliberate choice, so a reader
could not tell which policy ran. The deep-loop hub compounded it by keeping retired families in
the keyword block and the discovery terms, where advisory discovery text could still surface the
hub for work it no longer routes.

### Purpose

Each hub states one always-loaded policy, in the artifact that actually runs, and the deep-loop
hub's discovery vocabulary names only families it can serve.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `routerPolicy.defaultResource` and its two sibling keys, per hub.
- The `SKILL.md` keyword block and `graph-metadata.json` discovery terms of `system-deep-loop`.
- The activation manifests that the above edits stale.

### Out of Scope
- A gate that validates the two artifacts against each other. The suite has no obvious home for it and the finding earns less than building one.
- Repointing "conformance" where it appears as ordinary English in unrelated test names.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/hub-router.json` | Modify | Declare the fallback-only semantics and contract |
| `.opencode/skills/system-deep-loop/SKILL.md` | Modify | Drop six retired families from the keyword block |
| `.opencode/skills/system-deep-loop/graph-metadata.json` | Modify | Drop two retired discovery terms |
| `.opencode/skills/{sk-code,sk-doc,cli-external-orchestration}/hub-router.json` | Modify | Declare the fallback-only semantics and contract |
| activation `manifest.json`, both copies | Modify | Re-mint the four hubs whose inputs changed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every hub declares one always-loaded policy, in the artifact the runtime reads |
| REQ-002 | A hub that legitimately has no preamble declares that rather than listing resources that never load |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The keyword block and discovery terms name no retired family |
| REQ-004 | Any edit that stales a compiled policy hash re-mints both manifest copies in the same change |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/bin/compiled-route-guard.cjs` exits 0 with all five hubs fresh.
- **SC-002**: No retired family remains in the deep-loop keyword block or discovery terms.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `hub-router.json` is a raw-byte input to the compiled policy hash | A hub silently falls back to legacy routing | Re-mint both copies and confirm with the guard |
| Risk | A new `routerPolicy` key could be rejected by a hub's bespoke compiler | That hub stops compiling | The guard recompiles every hub, so a rejection surfaces as a non-zero exit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Every question the finding left open is answered by the enforcement trace in `plan.md`.
<!-- /ANCHOR:questions -->

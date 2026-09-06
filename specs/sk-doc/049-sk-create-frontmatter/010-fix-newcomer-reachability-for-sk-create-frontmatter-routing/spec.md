---
title: "Feature Specification: Phase 10: fix newcomer reachability for sk-create-frontmatter routing"
description: "Every declared trigger reached the mode and no prompt a newcomer would type did. This phase adds plain-language phrases to both routing stages, holds each to out-of-domain replays, and carries the compiled-routing refresh the pinned sources require."
trigger_phrases:
  - "newcomer reachability"
  - "plain-language routing aliases"
  - "frontmatter mode intent phrases"
  - "hub-only routing hit"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 10: fix newcomer reachability for sk-create-frontmatter routing

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Measured on 2026-09-06, all 18 declared triggers routed to the mode and none of ten prompts a
newcomer would type did. Six returned nothing and four stopped at the hub with no packet. The mode
was reachable only by people who already knew the word frontmatter or a field name.

**Key Decisions**: add plain-language intent phrases to stage one and to every stage-two surface,
replay each against out-of-domain prompts before keeping it, drop the one that over-captured, and
refuse the two version phrases that already reach the hub on unrelated prompts.

**Critical Dependencies**: the advisor live for the replays, and the compiled-routing tooling,
since the registry and hub router are pinned sources.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract |
| **Successor** | None |
| **Handoff Criteria** | Newcomer prompts resolving to the mode measured before and after, no out-of-domain capture kept, guard fresh and canary green from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the sk-create-frontmatter specification.

**Scope Boundary**: the mode's alias entries on the five routing surfaces, the compiled-routing
artifacts those entries feed, and the canary digest sets. The advisor scorer stays out of scope.

**Dependencies**:
- The advisor CLI for the before and after replays
- The compiled-routing tools under `.opencode/bin/` and the authored canary under `specs/`

**Deliverables**:
- Plain-language phrases on all five surfaces, identical between the keyword line and the registry
- A before and after table for ten newcomer prompts and the out-of-domain replays
- Guard fresh, canary green, digests re-pinned

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode's vocabulary was the contract's vocabulary. A person who does not know the term
frontmatter says "what goes at the top of the file" or "my skill stopped showing up", and the
advisor scored those at nothing or at the hub floor with no packet chosen.

### Purpose
A person describing a frontmatter problem in their own words reaches the mode, measured, without
pulling in prompts that belong elsewhere.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ten plain-language phrases added to stage one and to the registry, hub router, `ROUTER.md` and the mode keyword line
- Out-of-domain replays for each, with over-capturing phrases dropped
- The manifest re-mint, artifact rebuild and digest re-pin the pinned sources require

### Out of Scope
- The advisor scorer. Prompts that still stop at the hub after this phase are recorded against it
- A default mode in the hub router. The hub doctrine forbids a silent default
- Version phrases such as `version number` and `version line`, which already reach the hub on unrelated prompts

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/graph-metadata.json` | Modify | Ten phrases in both stage-one lists |
| `.opencode/skills/sk-doc/{mode-registry.json,hub-router.json,ROUTER.md}` | Modify | The same ten at stage two |
| `.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md` | Modify | The same ten on the keyword line |
| Activation manifests, compiled artifacts, canary digests | Regenerate | Carried by the pinned-source edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Newcomer prompts resolving to the mode are measured before and after with the same ten prompts |
| REQ-002 | No added phrase captures an out-of-domain prompt in the replay set |
| REQ-003 | The keyword line and the registry aliases stay identical |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Guard fresh, sync verify OK and canary green from the final state |
| REQ-005 | Everything written passes the spec validator and the human-voice scanner |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: at least half of the ten newcomer prompts resolve to the mode with a compiled target
- **SC-002**: every declared trigger still routes as before
- **SC-003**: the out-of-domain set routes nothing to the mode
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A natural phrase captures unrelated traffic | Medium, a misroute surfaces only when someone types it | Five out-of-domain prompts replayed, one phrase dropped and replaced |
| Risk | The canary pins tool scripts another commit moved | Low, but it blocks a green close | Classified as committed drift and re-pinned with the committed bytes |
| Dependency | Advisor daemon | Without it nothing can be measured | Generation recorded on every replay |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: no gate runs longer than in phase 009.

### Security
- **NFR-S01**: no script or validator changes, vocabulary only.

### Reliability
- **NFR-R01**: the guard must read stale after the registry edit and fresh after the re-mint.

---

## 8. EDGE CASES

### Data Boundaries
- A phrase present at stage one and absent at stage two produces a hub-only hit, which is the failure this phase measures. Every phrase lands on all five surfaces.

### Error Scenarios
- The canary red on digests this phase did not move: classify against HEAD before re-pinning.

---

## 9. COMPLEXITY ASSESSMENT

| Factor | Score | Notes |
|--------|-------|-------|
| Files touched | 2 | Five routing surfaces plus regenerated artifacts |
| Blast radius | 3 | Hub-wide vocabulary, held to replays and the canary |
| Reversibility | 1 | Every file tracked |
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: See `../spec.md`
- **Predecessor**: `../009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract/implementation-summary.md`, section 4, for the trigger baseline

---
title: "Feature Specification: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode"
description: "Three of five parent hubs had silently fallen back to legacy routing because nothing re-pinned their manifests when their inputs changed, and the sk-doc hub still gave the human voice vocabulary to the quality-control mode, which stranded five of the human voice mode's own phrases."
trigger_phrases:
  - "hub fell back to legacy routing"
  - "stale-manifest cause code"
  - "refresh the compiled route manifest"
  - "quality-actions bare verbs"
  - "human voice mode routes nowhere"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-01 |
| **Branch** | `skilled/v4.0.0.0` (no branch created for this packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three of the five parent hubs reported `servingAuthority: legacy` with cause
`stale-manifest`, so their compiled routers were built, promoted and inert. The manifest
pins an `effectivePolicyHash` over a hub's routing inputs, and nobody had re-pinned it
after those inputs changed, so the resolver refused the compiled decision and fell back.
Separately, the sk-doc hub still listed `HVR` and `human voice` as quality-control
vocabulary, left over from when the standard lived in the hub's shared tier. Those entries
now tie head-on with the mode that owns the standard, and a tie inside the ambiguity delta
defers, so five of the human voice mode's own phrases routed nowhere at all.

### Purpose

Every hub serves the router it compiled, and every mode owns the words that mean it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Re-pin the authored activation manifest for each hub reporting `stale-manifest`, then
  rebuild the promoted mirror from the authored closure.
- Restore the promoted-root verify gate to the manifest-sensitive signal it needs, which a
  previous fix in this lineage had widened to bare engine reachability.
- Restore the compile-time guard that resolves a route's packet and leaf on disk. It was
  added to the promoted mirror only, so a later publish from the authored source erased it.
- Move `HVR` and `human voice` out of the quality-control mode and into the human voice
  mode, in both the router vocabulary class and the mode registry aliases.
- Narrow the `quality-actions` verb class to verbs that are distinctly about document
  quality.
- Repair the validator rule that this packet's own verification exposed: the complexity
  check counted phase headings only in `plan.md`, while the core plan template hands phase
  ownership to `tasks.md`.

### Out of Scope

- Changing how the scorer weighs a match. A three-word exact phrase and a one-word verb
  contribute the same score today, which is the mechanism behind two of the stranded
  phrases. Five hub routers carry three divergent scoring bodies, so a specificity change
  is its own program with its own replay evidence.
- The two advisor regression prompts that return no result. They belong to the stage-one
  advisor, which reads none of the compiled routing this packet repairs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/compiled-route-sync.cjs` | Modify | Restore the promoted-root verify gate to the manifest-sensitive route |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | Rehome the human voice vocabulary, narrow the quality-action verbs |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | Rehome the human voice aliases to the mode that owns them |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/*/manifest.json` | Modify | Re-pin three authored manifests to their hubs' current policy |
| `.opencode/bin/lib/compiled-routing/**` | Modify | Promoted mirror, rebuilt from the authored closure |
| `.opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh` | Modify | Count phases where the template now puts them |
| `specs/.../009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs` | Modify | Restore on-disk packet and leaf resolution in the authored source |
| `specs/.../002-system-deep-loop/harness/{build-artifacts,validate-canary}.cjs` | Modify | Pass the skill root the restored guard needs, and refresh the canary's stale pins |
| `specs/.../002-system-deep-loop/fixtures/canary-cases.v1.json` | Modify | Withdraw a case whose mode was retired, retarget the clarify case at two live modes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the five hubs reports `servingAuthority: compiled` with cause `compiled-serving` |
| REQ-002 | The promoted-root verify gate still fails on a missing, malformed or invalid manifest, and its own suite proves it |
| REQ-003 | The human voice mode wins its own vocabulary, measured through the production compiler and router |
| REQ-006 | A compiled route can no longer name a packet or leaf that does not resolve on disk |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No probe in the frozen corpus loses a route it held, except the two bare verbs the narrowing removes on purpose |
| REQ-005 | A packet whose phases live in `tasks.md` stops being reported as having none, and a packet with no phases anywhere still is |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `compiled-route-status.cjs --all` reports `compiled-serving` for all five hubs
- **SC-002**: `node --test .opencode/bin/tests/compiled-route-manifest.test.cjs` passes every case
- **SC-003**: A frozen 207-probe corpus replayed through the shipped engine matches the counterfactual prediction exactly
- **SC-004**: Seven probes that returned no route now route to the mode that owns them
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flipping three hubs from legacy to compiled changes live routing | High | Every hub gated before the publication was finalized, and the build retains a rollback sibling until then |
| Risk | A vocabulary edit can strand a phrase somewhere else in the hub | Medium | A frozen corpus scored every candidate through the production compiler, with a no-op control proving the harness matches the live engine on all 207 probes |
| Dependency | The authored closure under the router unification program | Rebuild reads it | Verified by content after each build, not by exit code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A stage-two decision stays a pure in-process scoring pass with no added file reads
- **NFR-P02**: The rebuild promotes the closure in one pass and leaves one rollback sibling

### Security
- **NFR-S01**: The promoted serving path reads nothing under the spec tree, asserted by the move simulation
- **NFR-S02**: Manifest writes stay atomic and lease-guarded, so a concurrent reader never sees a half-written manifest

### Reliability
- **NFR-R01**: A hub whose manifest is missing, malformed or invalid fails the build rather than serving
- **NFR-R02**: A hub whose manifest is merely stale can still be rebuilt, because that is the condition a rebuild exists to clear
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A prompt matching no keyword: the router defers rather than guessing
- A prompt matching two modes within the ambiguity delta: the router clarifies, which is why a tie reads as no route
- A one-word verb against a three-word phrase: both score one match, which is the stranding mechanism named in Out of Scope

### Error Scenarios
- Manifest deleted from a runtime root: the build refuses and names the hub
- Manifest present but unparseable: the build refuses and names the hub
- Publication already open: manifest writes report `publication-locked` rather than clobbering

### State Transitions
- Partial promotion: the rollback sibling is retained until `--finalize`, and `--revert` swaps it back
- Hub inputs edited after a rebuild: the hub returns to `stale-manifest` and falls back to legacy until re-pinned
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two skill JSON files, one sync script, three authored manifests, one promoted mirror |
| Risk | 20/25 | Flips live routing authority for three hubs and edits a shared vocabulary contract |
| Research | 12/20 | Required building a replay harness and proving it reproduces the live engine |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None. The scorer specificity gap is recorded in Out of Scope with the measurement behind it,
not left as a question.
<!-- /ANCHOR:questions -->

---

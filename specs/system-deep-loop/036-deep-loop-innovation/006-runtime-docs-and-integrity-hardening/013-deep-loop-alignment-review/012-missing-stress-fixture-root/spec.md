---
title: "Feature Specification: Phase 12: missing-stress-fixture-root"
description: "Three deep-improvement agent-discipline stress scenarios and their shared sandbox setup script depend on a test-fixture corpus that was pruned without repointing them. This phase restores the corpus in the current runtime tree shapes and makes the sandbox setup executable again."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: missing-stress-fixture-root

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-routing-doctrine-and-discovery |
| **Successor** | None |
| **Handoff Criteria** | The setup script materializes a sandbox in which the scenario helper steps run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the close the unbound alignment findings specification.

**Scope Boundary**: The fixture corpus and the shared sandbox setup script only. The six scenario documents keep their existing execution contract, and no model-dispatched scenario run is part of this phase.

**Dependencies**:
- The agent mirror crosswalk defines the six current runtime tree shapes.
- The pruned corpus is recoverable from commit `ebe7d6bb3c4^`.

**Deliverables**:
- The `test-fixtures/060-stress-test/` corpus, restored in the current tree shapes.
- A sandbox setup script whose required paths resolve and whose sandbox runs the scenario helper steps.
- Verification evidence for the roster, mirror and runtime gates.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Review finding F044 records that `active-critic-overfit.md`, `proposal-only-boundary.md` and `skill-load-not-protocol.md` list `deep-improvement/test-fixtures/060-stress-test/` as their fixture source, and that `setup-cp-sandbox.sh` hard-requires paths under it, while no `test-fixtures/` directory exists: the corpus was pruned by a bulk checkpoint commit that never repointed its consumers. The script also carries path drift of its own — a repo-root walk one level too shallow, the post-rename plural `.opencode/agents/` paths, a TOML mirror required under `.opencode` although TOML belongs to `.codex`, and the retired `.gemini` mirror left out of its requirements only because the whole tree was pruned with the fixture.

### Purpose

The fixture root at the exact path the four files name is live again, shaped like the six runtime agent trees this repository now ships, and `setup-cp-sandbox.sh` builds a sandbox in which the scenarios' helper steps run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restore the pruned fixture corpus under `test-fixtures/060-stress-test/` in the current tree shapes: authored `.opencode` canonical and `.claude` mirror, symlinked `.cursor` and `.devin` mirrors, generated-shape `.codex` and `.pi` mirrors.
- Correct `setup-cp-sandbox.sh`: the repo-root walk, the required fixture paths, the copied surfaces and the module resolution its sandboxed helper steps need.
- Prove the script materializes a sandbox and that the scenarios' pre-dispatch helper steps run against the restored target.
- Prove the fixture stays invisible to the roster, mirror-sync and generator checks.

### Out of Scope
- The six scenario documents' execution contract and prose; the restore makes their existing contract resolvable, it does not rewrite them. Their stale internal cross-references are recorded as adjacent findings.
- The playbook index's CP-037 sentinel wording, which already drifts from its feature file before this change and is resolved in the feature file's favor by the root-vs-feature rule.
- Model-dispatched Call A / Call B runs; those need an executor session and belong to the scenario operator.
- The superseded `benchmark/sentinel.js` stand-in, whose benchmark-boundary role the current CP-037 serves through the real benchmark runner's report.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/` | Create | Restored corpus: README plus the target agent in all six runtime tree shapes |
| `.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh` | Modify | Repo-root walk, live required paths, copied surfaces, sandboxed helper dependencies |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The fixture root named by the three scenario documents exists, with the canonical target and the mirror shapes the setup script and scenarios consume. |
| REQ-002 | `setup-cp-sandbox.sh` resolves the repository root and requires only live paths; running it produces a sandbox in which the scenarios' helper steps execute. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The restored fixture agents never register as shipped agents: the roster, mirror-sync and generator checks scan only the top-level agent trees. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `setup-cp-sandbox.sh --sandbox-dir /tmp/<dir>` exits 0 and the sandbox carries the six target tree shapes.
- **SC-002**: In a sandbox built by the script alone, `scan-integration.cjs` and `generate-profile.cjs` run against the fixture target and report it aligned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The pruned corpus is only recoverable from git history | The restore cannot be re-derived if history is rewritten | Recovered from `ebe7d6bb3c4^` and recorded in the implementation summary |
| Risk | The fixture's stale scenario IDs could read as live references | A reader follows `CP-040..045` to nothing | Flaw markers and README renumbered to the current `CP-032..037` scenario IDs |
| Risk | A future prune repeats the silent-orphan pattern | Consumers fail closed with no attribution | The script requires every fixture surface, so an absence fails loudly at setup time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 10. OPEN QUESTIONS

- Where does the fixture's benchmark-boundary bait live now that CP-037 proves completion through the real runner's report? Resolved for this phase: the superseded sentinel is not restored; the scenario contract owns completion.
<!-- /ANCHOR:questions -->

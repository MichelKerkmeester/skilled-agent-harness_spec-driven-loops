---
title: "Feature Specification: Phase 8: agent-mirror-parity"
description: "Six runtime trees ship the same twelve agents, but nothing stated how a declaration translates between them, and three real losses were silent: per-mode leaf sets collapsed onto one shared packet, the deep-review bodies demanded two state keys no consumer knows, and no artifact named the manual-invocation model drift."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: agent-mirror-parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-ledger-stem-producers |
| **Successor** | 009-containment-promise-and-severity-scale |
| **Handoff Criteria** | The crosswalk exists and both agents READMEs cite it, every tree that carried the budgetProfile/edgeCases demand no longer carries it, the mirror gates and the leaf-manifest collision check exit zero, and the deep-loop suite is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Remediate the alignment review findings specification.

**Scope Boundary**: the six runtime agent trees (`.opencode`, `.claude`, `.cursor`, `.pi`, `.codex`, `.devin`) and the shared leaf-manifest generator whose per-mode output decides which leaves a workflow mode may load. The packet does not flatten the six dialects into one: the trees have genuinely different capability surfaces, and the work is to name each translation — and each sanctioned loss — so nothing is dropped silently.

**Dependencies**:
- The two authored agent trees (`.opencode/agents/`, `.claude/agents/`) and the two generators that own the derived trees (`sync-agents-pi.cjs`, `sync-agents.cjs`)
- The mirror gates: `check-agent-mirror-sync.cjs`, `agent-roster-mirror-check.cjs`, and both generators' `--check` mode
- The shared leaf-manifest generator and its consumers: the freshness gate, the router-contract reachability check and the parent-skill gate

**Deliverables**:
- The agent-mirror crosswalk: one document stating how each source key (`permission`, `temperature`, `mode`, `tools`, `model`) translates into each of the six trees, which differences are sanctioned, and where the manual-invocation model drift is named
- Pointers from both `agents/README.txt` files, and the packet index entry beside them
- Per-mode leaf scoping for the two improvement lanes, with the generator refusing two modes that receive hash-equal leaf sets
- The budgetProfile/edgeCases demand removed from every tree that carried it
- The router-contract reachability rule taught about leaf ownership across a shared packet

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Six trees mirror the same twelve agents, and the translation between them was undocumented and partly lossy. Sampling configuration exists only in `.opencode`; the role key translates nowhere; the deny half takes five different forms across the trees, and the one mechanically checkable rule — the `.pi` `# Unmapped` comment — was a contract nothing stated. Two improvement lanes were handed byte-identical leaf sets for one shared packet although each lane's router scopes it to its own leaves. The four deep-review agent bodies demanded that the iteration record carry `budgetProfile` and `edgeCases` keys that no consumer — not the prompt pack, not the state record schema, not the verifier — knows. And no artifact told a manual invoker that a tree silent about model and effort means "no pin" rather than an unowned setting.

### Purpose
Name every translation and every sanctioned loss in one crosswalk the agent trees cite, give each workflow mode its own leaf set and fail loudly when two modes collide, and stop demanding state keys that nothing consumes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The crosswalk document covering `permission`, `temperature`, `mode`, `tools` and `model` for all six trees, plus the sanctioned-delta list and the manual-invocation note
- Pointers to it from `.opencode/agents/README.txt` and `.claude/agents/README.txt`
- Per-mode leaf scoping for `agent-improvement` and `model-benchmark` (and the `sk-doc` pair that hit the same collision), the collision refusal in the shared generator, and the router-contract rule that keeps mapped paths reachable
- Removing the `budgetProfile`/`edgeCases` demand from `.opencode`, `.claude`, `.pi` and `.codex`, regenerating the two derived trees
- Repairing the one `.claude` agent whose path references pointed at the other tier

### Out of Scope
- Making the six trees carry identical keys - the dialects differ because the capability surfaces differ
- Carrying `budgetProfile`/`edgeCases` through the prompt pack, the state record and the verifier - that path changes a shared canonical schema mid-migration, and the two keys have no consumer that would read them
- `.cursor` and `.devin` files themselves - they symlink onto `.claude`
- The vendored `barter/ai-speckit/coder/` copy of the deep-review agent and archived candidate specs - not one of the six trees
- Re-minting the pre-existing `system-deep-loop` compiled-route manifest staleness - no routing input changed in this packet; it is reported in `implementation-summary.md`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md` | Create | The translation contract for all six agent trees |
| `.opencode/agents/README.txt` | Modify | Point at the crosswalk, state the manual-invocation model drift |
| `.claude/agents/README.txt` | Modify | Point at the crosswalk, state the manual-invocation model drift |
| `.opencode/skills/system-deep-loop/deep-improvement/README.md` | Modify | Index the crosswalk in the packet's related documents |
| `.opencode/agents/deep-review.md` | Modify | Drop the `budgetProfile`/`edgeCases` demand |
| `.claude/agents/deep-review.md` | Modify | Same drop; restore its own tier's path references |
| `.pi/agents/deep-review.md` | Modify | Regenerated from the canonical body |
| `.codex/agents/deep-review.toml` | Modify | Regenerated from the canonical body |
| `.opencode/skills/system-deep-loop/leaf-scopes.json` | Create | Per-mode leaf scopes for the two improvement lanes |
| `.opencode/skills/sk-doc/leaf-scopes.json` | Create | Per-mode leaf scopes for the two create-skill modes |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | Read leaf scopes; refuse hash-equal mode leaf sets |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs` | Modify | Add the leaf-set digest and collision helpers |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Modify | Resolve a mapped path to a mode that owns the leaf in a shared packet |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs` | Create | Scoping and collision coverage |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` | Modify | Cover the new pure helpers |
| `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | Modify | Index the new test file |
| `.opencode/skills/system-deep-loop/leaf-manifest.json` | Modify | Regenerated with per-mode leaf sets |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Modify | Regenerated with per-mode leaf sets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | One document states, per source key (`permission`, `temperature`, `mode`, `tools`, `model`), how it translates into each of the six agent trees, what stands in place of each declaration that cannot translate, the `.pi` `# Unmapped` rule as the contract it already is, and the manual-invocation model drift; both `agents/README.txt` files point at it. |
| REQ-002 | Each workflow mode receives the leaf set its router scopes it to, and the generator fails when two modes receive hash-equal leaf sets. |
| REQ-003 | The deep-loop suite exits zero with this change set in place. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `budgetProfile` and `edgeCases` are demanded by no tree: the two recording demands and the self-certifying JSONL claim are removed from every agent body that carried them, and the state record is left as the consumer-facing schema it already was. |
| REQ-005 | Every mirror gate stays green: both generators' `--check`, the body/tool-surface sync check and the roster check. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git grep` finds a crosswalk row for each of the five source keys and each of the six trees, and both README files name the document.
- **SC-002**: `agent-improvement` and `model-benchmark` (and `sk-create-skill` and `sk-create-skill-parent`) carry distinct leaf sets, and the collision check fires on a hand-built fixture pair with an empty or duplicated scope.
- **SC-003**: `budgetProfile` and `edgeCases` appear in none of the six trees' deep-review bodies, and the two derived trees pass their `--check` after regeneration.
- **SC-004**: `npx vitest run --no-coverage` in `.opencode/skills/system-deep-loop/runtime` exits zero.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The shared leaf-manifest generator is consumed by seven skills | Med | The scoping file is optional; without it the generator walks the packet as before, and only the two hubs that carry a `leaf-scopes.json` regenerate |
| Risk | Removing the demand from agent bodies could hide a real contract | Low | The replacement keeps the budget-profile choice as a plan step and the JSONL claim for the fields that do exist; the keys had no consumer to lose |
| Dependency | The `.pi` and `.codex` trees are generated, not authored | Low | Both are regenerated from the canonical body rather than hand-edited, and their `--check` modes verify it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The crosswalk is prose only; the leaf-manifest generator gains one map lookup per mode and the collision check hashes the sets it already holds.
- **NFR-P02**: Regenerating the two derived trees rewrites only the agents whose canonical body changed.

### Security
- **NFR-S01**: A leaf scope is refused when it is absolute, escapes the packet root or names a path outside the packet's declared resource roots, so the generator cannot be steered into reading outside a hub.
- **NFR-S02**: Mirror gates are read-only; the generators only ever write inside their own output directory.

### Reliability
- **NFR-R01**: Every mirror gate exits zero after the change, so a future edit cannot introduce a silent drift the gates would have caught.

### Maintainability
- **NFR-M01**: The generator's refusal names both colliding modes and the digest, so a future author knows what to scope without reading the generator.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A scope naming a single file rather than a directory (`references/README.md`) is supported; a scope naming nothing on disk fails with a named error instead of silently contributing zero leaves.
- A scope whose mode does not exist in the registry fails as an orphan rather than being ignored.

### Error Scenarios
- Two modes that receive the same leaf set fail the manifest build with a message naming the colliding modes; a partial fix that leaves the second hub red is treated as unfinished work, not as a warning.

### State Transitions
- A hub with no `leaf-scopes.json` produces the same manifest bytes it produced before scoping existed, so the change is inert for hubs that do not need it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two hubs, one shared generator, six agent trees, four docs |
| Risk | 10/25 | Shared generator with seven consumers; two generated trees |
| Research | 16/20 | The translation rules had to be measured against the generators before they could be documented |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the `.claude/agents/deep-review.md` path-reference exception have been fixed here or in a dedicated pass? It was normalized here because the crosswalk states the per-tier convention and an exception would have made that statement false; the three-line edit is recorded in `tasks.md`.
<!-- /ANCHOR:questions -->

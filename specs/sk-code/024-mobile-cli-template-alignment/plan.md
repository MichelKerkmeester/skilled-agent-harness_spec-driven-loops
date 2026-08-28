---
title: "Implementation Plan: sk-code-mobile-cli Template Alignment [template:level-3/plan.md]"
description: "Five disjoint work lanes bringing the sk-code-mobile-cli packet back onto the sk-create-skill contracts, each gated by a command whose output is read before any conformance claim."
trigger_phrases:
  - "mobile cli alignment plan"
  - "playbook operator contract conversion"
  - "disjoint agent lanes"
  - "dqi regression gate"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code-mobile-cli Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation packet; validator tooling is Node.js (`validate-playbook-package.cjs`) and Python (`extract_structure.py`) |
| **Framework** | None — governed by the `sk-doc`/`sk-create-skill` asset and reference templates |
| **Storage** | None |
| **Testing** | `extract_structure.py` (DQI scoring), `validate-playbook-package.cjs` (playbook contract), `validate.sh --strict` (spec-folder gate) |

### Overview
Five lanes touching disjoint file sets, so three authoring agents and the orchestrator can run
concurrently without write conflicts. Each lane closes on a command, not on inspection.

| Lane | Owner | Files | Gate |
|------|-------|-------|------|
| A - Assets | Sonnet authoring agent | `assets/*.md` (7) | `extract_structure.py` DQI per file |
| B - Reference standard | Sonnet authoring agent | `references/standards/code-standards.md` | `extract_structure.py` DQI |
| C - Playbook | Sonnet authoring agent | `manual-testing-playbook/*.md` (8) | `validate-playbook-package.cjs` violations |
| D - Deletion | Orchestrator | `design-reference/`, `SKILL.md`, `leaf-manifest.json`, `changelog/` (2) | grep to zero |
| E - Quality | Orchestrator | `references/quality/` | grep to zero, DQI, sibling-convention check |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — Phase 5 final-state verification (T019-T024) has not been re-run yet
- [ ] Tests passing (if applicable) — Lane C (T008, playbook conversion) is still open; last recorded run: `FAIL_CLOSED, violations=84`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not applicable — this is a documentation/template-conformance change, not a software architecture
change; no MVC/MVVM/Clean Architecture/serverless pattern governs it.

### Key Decision: the playbook converts to operator-scenario, not routing-gold

The seven scenario files carry `expected_surface` / `expected_intent` / `expected_resources`, which
reads as routing-gold. It is not. `hasRoutingGoldSignature()` (validate-playbook-package.cjs:130)
additionally requires `expected_workflow_mode` **and** typed `expected_leaf_resources` pairs; both are
absent, so all seven fall through to the operator-scenario contract and fail it.

The tempting fix - add those two fields and let the files be excluded as routing-gold - was tested and
rejected. The routing-gold contract is enforced by `validate-playbook-topology.cjs`, which resolves
scenarios against `leaf-manifest.json`. That manifest lives at the hub, not at this leaf:

- `--skill-dir .opencode/skills/sk-code` walks only the hub's own 32 scenarios, never this packet
- `--skill-dir .opencode/skills/sk-code/sk-code-mobile-cli` errors: `leaf-manifest.json not found`

Typing the files routing-gold would remove them from the one gate that does run and hand them to a gate
that structurally cannot see them. The packet would go green while losing all coverage. So the files
convert to the operator-scenario contract, keeping `id` / `expected_intent` / `expected_resources`
because the Lane C benchmark loader skips any scenario lacking them.

### Key Decision: the quality gate doc is renamed

`references/quality/README.md` is a reference doc wearing a README's filename. The scorer classifies by
filename, so it was being graded against the README contract (blockquote after H1, TABLE OF CONTENTS)
that a reference doc has no reason to satisfy. Measured on identical bytes: 81 as `README.md`, 89 as
`doc-quality-gate.md` under `references/`. No sibling reference folder (`operations/`, `release/`,
`setup/`, `standards/`) carries a README; every one uses topic-named docs. One inbound reference
(`leaf-manifest.json`) had to move.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code-mobile-cli/assets/*.md` (7) | Checklists scored by the create-skill asset template | Add OVERVIEW, renumber | `extract_structure.py` DQI per file (Lane A) |
| `sk-code-mobile-cli/references/standards/code-standards.md` | Reference doc scored by the create-skill reference template | Add OVERVIEW with Purpose/When to Use/Key Sources | `extract_structure.py` DQI (Lane B) |
| `sk-code-mobile-cli/manual-testing-playbook/*.md` (8) | Test corpus scored by `validate-playbook-package.cjs` | Convert to operator-scenario contract | `validate-playbook-package.cjs` violations=0 (Lane C) |
| `sk-code-mobile-cli/references/design-reference/` (9 files) | Unused reference tree | Delete | grep to zero (Lane D) |
| `sk-code/leaf-manifest.json` | Shared hub manifest naming every leaf across 5 modes | Drop 10 leaf entries; repoint the renamed gate doc | JSON parses; every listed leaf resolves on disk (Lane D/E) |
| `sk-code-mobile-cli/SKILL.md` | Packet entry point describing its own folder count | Correct folder count six to five; drop the removed folder bullet | grep/doc evidence (Lane D) |
| `sk-code-mobile-cli/changelog/v0.1.0.0.md`, `v0.1.1.0.md` | Historical change record | Strip `design-reference` mentions (operator-approved) | grep to zero (Lane D) |
| `sk-code-mobile-cli/references/quality/dqi-baseline.md` | Baseline table scoring paths absent from this repository | Delete | grep to zero (Lane E) |
| `sk-code-mobile-cli/references/quality/README.md` | Reference doc misclassified by filename | Rename to `doc-quality-gate.md`; rewrite the regression check | DQI + sibling-convention check (Lane E) |

Required inventories:
- Same-class producers: `rg -n 'design-reference'` across `.opencode/skills/sk-code` recorded 12 hits outside the directory being deleted (Phase 1 baseline).
- Consumers of changed symbols: `rg -n 'design-reference|dqi-baseline' . --glob '*.ts' --glob '*.js' --glob '*.md'` surfaces `leaf-manifest.json`, `SKILL.md`, and the two changelog entries as the inbound consumers closed in Phase 3-4.
- Matrix axes: not applicable — the change set is five disjoint file-lane deletions/renames/restructures, not a parser or algorithmic input matrix.
- Algorithm invariant: not applicable — no path/redaction/parser/resolver/security algorithm is being changed.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Establish the failing baseline

Run every gate before changing anything, so the same command later proves the change.

- `validate-playbook-package.cjs` on the playbook: recorded `FAIL_CLOSED, violations=84, operator=7, routing_gold_excluded=0`
- `extract_structure.py` across assets, `code-standards.md`, `quality/`: recorded per-file DQI
- grep counts: `design-reference` 12 hits outside its own directory, `dqi-baseline` 5 hits
- `git ls-files` + `git rev-parse HEAD`: confirmed all deletion targets tracked, rollback anchor `856c17d5ed`

### Phase 2: Parallel authoring (Lanes A, B, C)

Three agents, disjoint files, each given the governing template, the objective gate command, an explicit
scope lock, and an absolute content rule forbidding invented paths, commands, or test names.

### Phase 3: Deletion and reference sweep (Lane D)

Delete `design-reference/`, then close every inbound reference: 9 `leaf-manifest.json` entries, the
`SKILL.md` folder bullet with its "six folders" count, and two changelog mentions. Changelog entries are
edited per explicit operator decision.

### Phase 4: Quality resolution (Lane E)

Delete `dqi-baseline.md`. Rewrite the gate doc's regression check to measure the file's own base
revision instead of consulting a table that can no longer be refreshed. Replace the duplicated document
shape with a pointer to the create-skill templates plus the scorer-specific point values, verified
against `extract_structure.py` rather than asserted. Rename the doc to match its class.

### Phase 5: Final-state verification

Re-run every Phase 1 gate from the final tree, plus a manifest resolution check and a stray-file sweep.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Claim | Proof |
|-------|-------|
| Playbook conforms | `validate-playbook-package.cjs` reports `violations=0` |
| Deletions complete | `grep -rn 'design-reference\|dqi-baseline' .opencode/skills/sk-code` returns nothing |
| Manifest is honest | JSON parses; every leaf path resolves on disk |
| No doc regressed | Per-file DQI compared against the Phase 1 baseline |
| Content preserved | Checkbox-count parity plus a filtered diff over paths and commands |
| No stray files | `git status --porcelain` scoped to the packet shows only intended changes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `extract_structure.py` | Internal (sk-doc scorer, reached via symlink) | Green - confirmed present, output shape verified against source | Blocks the DQI regression checks for Lanes A, B, E |
| `validate-playbook-package.cjs` | Internal (sk-code manual-testing-playbook validator) | Green - read directly; the validator wins wherever it disagrees with the template | Blocks the Lane C conformance claim (REQ-001) |
| `validate.sh --strict` | Internal (system-spec-kit spec-folder gate) | Yellow - final packet-level gate, pending a clean run from the final tree | Blocks the packet completion claim (SC-004) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any lane's edits are found to drop a technical assertion, regress a DQI score, fail the
  playbook validator, or leave `leaf-manifest.json` pointing at a path that no longer resolves.
- **Procedure**: All targets were tracked and the tree was clean at `856c17d5ed`. Full restore:
  ```bash
  git checkout 856c17d5ed -- .opencode/skills/sk-code/sk-code-mobile-cli/ .opencode/skills/sk-code/leaf-manifest.json
  ```
  This is a working-tree removal only. No history is rewritten, no branch or reflog is touched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
Baseline    Authoring    Deletion    Quality      Verify
            (Lanes A-C)  (Lane D)    (Lane E)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Baseline) | None | Phase 2 |
| Phase 2 (Authoring: Lanes A/B/C) | Phase 1 | Phase 3 |
| Phase 3 (Deletion: Lane D) | Phase 2 | Phase 4 |
| Phase 4 (Quality: Lane E) | Phase 3 | Phase 5 |
| Phase 5 (Final Verification) | Phase 4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Not applicable — no hour-level effort estimates were recorded for this packet. Progress is tracked by
per-lane gate pass/fail in `tasks.md` (T001-T024), not by a time budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — not applicable to data; the git history at `856c17d5ed` is the
  recovery point, and T004 confirmed the tree was clean and every deletion target tracked
- [ ] Feature flag configured — not applicable; no runtime feature flag governs a documentation packet
- [ ] Monitoring alerts set — not applicable; no runtime/monitoring surface exists for this change

### Rollback Procedure
1. Stop editing and identify which lane's output regressed a gate.
2. `git checkout 856c17d5ed -- .opencode/skills/sk-code/sk-code-mobile-cli/ .opencode/skills/sk-code/leaf-manifest.json` to restore the pre-change tree.
3. Re-run the Phase 1 baseline commands (playbook validator, DQI sweep, grep counts) and confirm the restored tree matches the recorded baseline.
4. No stakeholder notification required — this is an internal documentation packet with no user-facing surface.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no data store is touched; the packet only edits and deletes version-controlled markdown/JSON files.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │────►│   Phase 4   │────►│   Phase 5   │
│  Baseline   │     │  Authoring  │     │  Deletion   │     │  Quality    │     │   Verify    │
│             │     │ (Lanes A-C) │     │  (Lane D)   │     │  (Lane E)   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Baseline) | None | Recorded gate outputs: violations=84, per-file DQI, grep counts, rollback anchor | Lanes A-E |
| Lane A (Assets) | Phase 1 | 7 conformant asset checklists | Phase 5 verification |
| Lane B (Reference standard) | Phase 1 | Conformant `code-standards.md` | Phase 5 verification |
| Lane C (Playbook) | Phase 1 | Operator-scenario-conformant playbook | Phase 5 verification, REQ-001 |
| Lane D (Deletion) | Phase 2 lanes (disjoint files, no hard dependency) | `design-reference/` removed; manifest, `SKILL.md`, changelog updated | Phase 5 verification, REQ-002, REQ-004 |
| Lane E (Quality) | Lane D's manifest edits | `dqi-baseline.md` removed; gate doc renamed and repointed | Phase 5 verification, REQ-003, REQ-004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Baseline)** - Duration: not tracked - CRITICAL
2. **Phase 2 (Authoring: Lanes A/B/C)** - Duration: not tracked - CRITICAL (Lane C / T008 is the long pole; still open)
3. **Phase 5 (Final-state verification)** - Duration: not tracked - CRITICAL

**Total Critical Path**: Not applicable — no duration estimates were recorded for this packet.

**Parallel Opportunities**:
- Lane A (assets) and Lane B (reference standard) run simultaneously with Lane C (playbook) inside Phase 2, per the plan's stated concurrency model
- Lane D (deletion) and Lane E (quality) touch disjoint files and can run in either order once Phase 2 is complete
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase 1 baseline recorded | Validator, DQI, and grep baselines captured (T001-T005) | Complete |
| M2 | Lanes A, B, D, E landed | 4 of 5 lanes pass their own gate | Complete |
| M3 | Playbook conversion + final verification | REQ-001 satisfied; `validate.sh --strict` exits 0 | In Progress (T008, T019-T024 open) |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Convert the manual-testing playbook to the operator-scenario contract, not routing-gold

**Status**: Accepted

**Context**: The seven scenario files carry `expected_surface` / `expected_intent` / `expected_resources`,
which reads as routing-gold. `hasRoutingGoldSignature()` (validate-playbook-package.cjs:130) additionally
requires `expected_workflow_mode` and typed `expected_leaf_resources` pairs; both are absent, so all
seven fall through to the operator-scenario contract and fail it with 84 violations.

**Decision**: Convert the files to the operator-scenario contract, keeping `id` / `expected_intent` /
`expected_resources` because the Lane C benchmark loader skips any scenario lacking them.

**Consequences**:
- The playbook is scored by the gate that actually reaches it; `--skill-dir .opencode/skills/sk-code` only
  walks the hub's own 32 scenarios, and `--skill-dir .opencode/skills/sk-code/sk-code-mobile-cli` errors
  `leaf-manifest.json not found`
- Dropping `expected_surface`/`expected_workflow_mode`, fields the files never satisfied, has no coverage cost

**Alternatives Rejected**:
- Add `expected_workflow_mode` and typed `expected_leaf_resources` to qualify as routing-gold and be
  excluded from this validator: rejected because the routing-gold topology gate structurally cannot see
  this leaf, so the packet would go green while losing all test coverage

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

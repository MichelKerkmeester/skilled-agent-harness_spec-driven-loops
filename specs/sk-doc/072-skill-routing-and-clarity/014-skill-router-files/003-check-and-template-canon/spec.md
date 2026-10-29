---
title: "Feature Specification: Phase 3: check-and-template-canon"
description: "The routing canon forbids a mode packet its own ROUTER.md and requires the machine router inline, so no skill can move its router out of SKILL.md. This phase reverses RS-004, rewrites RS-005 as a pointer rule, widens the root-router gate past hubs and records the 54 unmoved skills in a debt ledger."
trigger_phrases:
  - "check and template canon"
  - "phase 3 check and template canon"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: check-and-template-canon

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-router-file-tooling |
| **Successor** | 004-hub-router-merge |
| **Handoff Criteria** | `package_skill.py --strict` and `parent-skill-check.cjs` 12b accept a sibling `ROUTER.md` for a hub, a mode packet and a standalone skill, reject a missing file or a missing pointer, and the 54 unmoved skills pass through the debt ledger |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Skill router files specification. Research section 10 records the contract decision: every skill and mode owns a sibling `ROUTER.md`, a hub's moved prose joins its existing root file, and this phase is the canon change that lands before any file moves.

**Scope Boundary**: the routing-shape rules in `package_skill.py` and check 12b of `parent-skill-check.cjs`, the root-router gate in `ci-skill-root-metadata.cjs` and the two contract libraries, the sk-create-skill templates, workflows and canon docs, and the known-debt ledger. No skill's router moves in this phase.

**Dependencies**:
- Phase 002's shared resolver, so a sibling `ROUTER.md` is readable before a check requires one.

**Deliverables**:
- RS-004 reversed, RS-005 rewritten as the pointer rule, RS-002 restated to send the block to the sibling file.
- The root-router gate running for a standalone skill root and every mode packet.
- A ledger with one entry per unmoved skill, plus a frozen snapshot that records the raised ceiling.
- Templates, workflows and canon docs that describe the new shape.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The canon keeps the machine router inside `SKILL.md`. `package_skill.py` reports RS-004 when a mode packet carries its own `ROUTER.md` (lines 1004 to 1009) and check 12b of `parent-skill-check.cjs` repeats it (line 2067). RS-005 then requires a final `## MACHINE ROUTER` section, so the router loads whenever the skill does, which research section 4 traces through the five script readers that parse it there.

The root-router gate stops at hubs. `ci-skill-root-metadata.cjs` calls `validateRootRouter` inside `if (evaluation.skillClass === rootContract.CLASS_HUB)` (line 688), so a standalone skill has no router contract at all, and `parent-skill-check.cjs` 12a audits only the hub root (line 2408).

### Purpose

Every skill and mode can own a sibling `ROUTER.md`, both checks accept and require it, and the unmoved skills keep passing through a debt ledger until phase 005 empties it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run on the tree before this phase:

```text
$ rg -l '^## ([0-9]+\. )?MACHINE ROUTER' .skilled/skills --glob SKILL.md | wc -l
      54
$ find .skilled/skills -name ROUTER.md | wc -l
       7
$ python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/sk-git --check --strict | grep 'Result:'
Result: PASS
$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc 2>&1 | grep -E '12[a-b]-'
PASS: 12a-router-contract: root ROUTER.md conforms to the two-state contract (active)
PASS: 12b-routing-shape: hub and 14 packet(s) follow the routing canon (0 known debt)
```

`sk-git` is a standalone skill with no `ROUTER.md` and the strict package check passes it. The ledger file holds `"debt": {}`, so no skill is tolerated today.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reverse RS-004 so a mode packet and a standalone skill may and must own a sibling `ROUTER.md`.
- Rewrite RS-005 as the pointer rule and restate RS-002 so a `## MACHINE ROUTER` section left in `SKILL.md` fails.
- Widen the root-router gate to every skill root and every declared mode packet.
- Record each unmoved skill and mode in the known-debt ledger, and raise the frozen snapshot to match.
- Move the templates, the workflows and the canon docs to the new shape.

### Out of Scope
- Moving any skill's router file - phases 004 and 005 move them from the ledger this phase writes.
- Changing what any skill routes to - the move changes where the router lives, not its decisions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | RS-002 destination, reversed RS-004, RS-005 pointer rule |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | 12a per packet, 12b with the restated codes |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modify | Router contract for every class, ledger tolerance |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | Modify | Class-aware contract and non-hub messages |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs` | Modify | `ROUTER.md` required for a standalone root |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/routing-shape-debt.cjs` | Create | One JS reader for the ledger |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` | Modify | One entry per unmoved skill and mode |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/routing-shape-known-debt-frozen.json` | Modify | Raised ceiling with the added codes |
| `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py` | Modify | Cases for the restated codes |
| `.skilled/skills/sk-doc/scripts/tests/test_package_skill_regressions.py` | Modify | Clean fixture carries the sibling router |
| `.skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py` | Modify | Template contract follows the new shape |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs` | Modify | 12b cases for the restated codes |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-root-router.test.cjs` | Modify | 12a packet case |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs` | Modify | Standalone and packet profiles |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modify | `ROUTER.md` required for `S` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs` | Modify | Frozen snapshot comparison |
| `.skilled/commands/create/assets/tests/test_skill_parent_router_parity.py` | Modify | Workflow and reference parity |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Modify | Section 2 shape and five code rows |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md` | Modify | Router block goes to `ROUTER.md` |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-scaffold-template.md` | Modify | Pointer line in the scaffold |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-router-template.md` | Create | Sibling router template with the `## MACHINE ROUTER` heading the resolver reads |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md` | Modify | Packet gets its own router |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md` | Modify | Hub pointer stays, prose leaves the appendix |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Modify | Packet rule reversed |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md` | Modify | Moved prose goes under a final `## MACHINE ROUTER` heading after the stage-two map |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modify | A fresh standalone skill gets its router |
| `.skilled/commands/create/assets/create-skill-auto.yaml` | Modify | Steps emit the router and the pointer |
| `.skilled/commands/create/assets/create-skill-confirm.yaml` | Modify | Same steps in confirm mode |
| `.skilled/commands/create/assets/create-skill-parent-auto.yaml` | Modify | Packet rule reversed |
| `.skilled/commands/create/assets/create-skill-parent-confirm.yaml` | Modify | Packet rule reversed |
| `.skilled/commands/create/assets/create-skill-presentation.txt` | Modify | Summary names the sibling file |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/validation-and-packaging.md` | Modify | Five restated codes and the ledger |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` | Modify | Pointer step and code list |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md` | Modify | Old packet rule replaced |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modify | Packet owns a router |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modify | Gate description per class |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` | Modify | Standalone gate is no longer hub-only |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | Modify | Version carrier and routing note |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.8.0.0.md` | Create | Release entry and upgrade steps |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Modify | Regenerated after the new asset |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `package_skill.py` and check 12b adopt the reversed RS-004: every skill and mode owns a sibling `ROUTER.md`, and a missing file or a file whose real path leaves the skill folder fails the code | A fixture packet with a sibling router passes, and the same packet without it fails RS-004 |
| REQ-002 | RS-005 requires a relative markdown link from `SKILL.md` to its sibling `ROUTER.md` that resolves on disk | The current hub `SKILL.md` passes, and a copy with the link removed fails RS-005 |
| REQ-003 | RS-002 reports a `## MACHINE ROUTER` section in `SKILL.md`, because the router lives in the sibling file | A SKILL.md that still ends with the section fails with the new message, with or without a code block |
| REQ-004 | The root-router gate runs for a standalone skill root and for every mode packet a hub declares | `ci-skill-root-metadata.cjs` names a standalone router result, and 12a prints one per packet |
| REQ-005 | The known-debt ledger holds one entry per unmoved skill and mode, and the frozen snapshot records every code those entries add | The live ledger has 54 keys and the ratchet suite passes 4 tests |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The templates, `skill-smart-router.md`, the four create-skill workflow assets and the canon docs describe the new shape and the restated codes | `rg 'packet carries no ROUTER' .skilled` prints nothing |
| REQ-007 | A fresh standalone skill gets a sibling `ROUTER.md`, so `/create:skill` cannot emit a file the new rule rejects | Scaffolding a temp skill leaves `ROUTER.md` beside `SKILL.md` |
| REQ-008 | sk-create-skill's version carriers and changelog agree, and every changed suite passes | `validate_document.py` reports 0 issues and the suites print at least their baseline counts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A mode packet with a sibling `ROUTER.md` passes both checks, and the same packet with the file deleted fails RS-004.
- **SC-002**: The ledger holds 54 entries, 12b on all seven hubs prints 0 violations, and the ratchet suite passes its 4 tests.
- **SC-003**: `rg 'mode packet carries its own ROUTER.md' .skilled` prints nothing outside the changelog history.
- **SC-004**: The fleet gate prints `checked=13 passed=13 failed=0`, and 12b prints 0 violations on all seven hubs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002's shared resolver | A check requires a file no reader opens | Land 003 after 002, and prove the replay reads a fixture router before the gate requires one |
| Risk | The 54 ledger entries outlive the migration and excuse a skill that never moves | Medium | The ratchet fixture makes any growth reviewer-visible, a code-level tolerance can only shrink, and phases 004 and 005 remove every entry |
| Risk | A skill outside this repository has no `ROUTER.md` and now fails `--strict` | Medium | The changelog upgrade section names the two edits, adding the file and adding the link |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocks this phase. Whether a packet's `ROUTER.md` owns its leaf map is decided in `plan.md` section 3 from research section 7, and phase 002's resolver can revise it.
<!-- /ANCHOR:questions -->

---

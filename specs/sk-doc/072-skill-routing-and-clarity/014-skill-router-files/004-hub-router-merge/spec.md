---
title: "Feature Specification: Phase 4: hub-router-merge"
description: "The seven parent hubs keep their stage-two assignment block in a root ROUTER.md, yet each hub SKILL.md still ends with a MACHINE ROUTER section that repeats the routing prose. This phase moves that prose into a named section of ROUTER.md and leaves one pointer line in SKILL.md."
trigger_phrases:
  - "hub router merge"
  - "phase 4 hub router merge"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: hub-router-merge

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/269-skill-router-files` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-check-and-template-canon |
| **Successor** | 005-packet-and-standalone-migration |
| **Handoff Criteria** | Every hub passes the rewritten routing shape, and the router replay capture taken after the move matches the one taken before it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Skill router files specification. Research section 7 records that the seven hubs already keep a root `ROUTER.md` with the stage-two assignment block, and that their SKILL.md MACHINE ROUTER sections carry no assignment rows. The same routing detail therefore lives twice, and only the copy in SKILL.md loads on every hub load. Phases 002 and 003 teach the readers and the checks the new shape first, so this phase moves prose only.

**Scope Boundary**: the seven hub roots listed in section 3, their generated Hermes copies and the compiled-route manifests their edited SKILL.md bytes invalidate.

**Dependencies**:
- Phase 002's shared resolver, so router replay, router sync, the dead-route scan and the package check read a sibling `ROUTER.md`.
- Phase 003's reversed RS-004 and rewritten RS-005, so a SKILL.md that points at its `ROUTER.md` passes the routing-shape checks.

**Deliverables**:
- Seven SKILL.md files with one pointer line and no MACHINE ROUTER section.
- Seven `ROUTER.md` files with the moved prose in one named section and the existing assignment block untouched.
- A before and after replay capture, refreshed compiled-route manifests and regenerated Hermes copies.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
All seven parent hubs keep their stage-two routing in the root `ROUTER.md`, yet each SKILL.md still ends with a MACHINE ROUTER section that repeats the compiled-routing directive, the discriminator and the routing rule. Those sections run from 249 words in `mcp-tooling` to 821 in `system-deep-loop`, and together they hold 3,897 words that load whenever the hub loads. The `ROUTER.md` they duplicate is read when the hub selects resources instead.

### Purpose
Each hub's routing prose lives in one place, its root `ROUTER.md`, and SKILL.md carries one pointer line to it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run on the current tree before this phase:

```text
$ for h in cli-classifier cli-external-orchestration mcp-tooling sk-code sk-design sk-doc system-deep-loop; do
    f=.skilled/skills/$h/SKILL.md
    line=$(grep -n "^## .*MACHINE ROUTER" "$f" | cut -d: -f1)
    printf '%-28s %s\n' "$h" "$(tail -n +"$line" "$f" | wc -w | tr -d ' ')"
  done
cli-classifier               321
cli-external-orchestration   467
mcp-tooling                  249
sk-code                      755
sk-design                    585
sk-doc                       699
system-deep-loop             821

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep '^total'
total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code | grep '12b-routing-shape'
PASS: 12b-routing-shape: hub and 4 packet(s) follow the routing canon (0 known debt)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the SMART ROUTING sentence that points at the MACHINE ROUTER section with one pointer line, and delete that section.
- Append the moved prose to the hub `ROUTER.md` as one named final section, with the self-referential sentences rebased to the new file.
- Keep every `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCE` declaration unchanged, so the machine section stays the only replay source.
- Capture the replay lines, the machine-section hashes and one compiled route per hub before the move, then rerun all three after it.
- Refresh each hub's compiled-route manifest and its authored copy, and regenerate the Hermes copies.
- Raise each hub's edition, add one changelog entry, and align `description.json`, `hub-router.json` and `mode-registry.json` to the new edition.

### Out of Scope
- Any route change. The move changes where the router prose lives, not what any hub selects, so a shifted replay line fails the phase.
- The other 47 skills and modes. Phase 005 owns them, in batches behind the debt ledger.
- The checks, templates and canon docs. Phase 003 owns them, and this phase follows whatever pointer rule their rewrite lands.
- The advisor freshness signature, the watcher and the Hermes generator. Phase 002 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/SKILL.md` and `ROUTER.md` | Modify | Pointer line, moved prose, next edition |
| `.skilled/skills/cli-external-orchestration/SKILL.md` and `ROUTER.md` | Modify | Pointer line, moved prose, next edition |
| `.skilled/skills/mcp-tooling/SKILL.md` and `ROUTER.md` | Modify | Pointer line, moved prose, next edition |
| `.skilled/skills/sk-code/SKILL.md` and `ROUTER.md` | Modify | Pointer line, moved prose, next edition |
| `.skilled/skills/sk-design/SKILL.md` and `ROUTER.md` | Modify | Pointer line, moved prose, next edition |
| `.skilled/skills/sk-doc/SKILL.md` and `ROUTER.md` | Modify | Pointer line, moved prose, next edition |
| `.skilled/skills/system-deep-loop/SKILL.md` and `ROUTER.md` | Modify | Pointer line, moved prose, next edition |
| `description.json`, `hub-router.json` and `mode-registry.json` in the seven hub roots | Modify | Version parity with the new SKILL.md edition |
| `changelog/` under the seven hub roots | Create | One release note per hub |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/` | Modify | Refreshed manifest for each hub |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/` | Modify | Authored copy of the same manifest |
| `.hermes/skills/` under the seven hub folder names | Modify | Regenerated SKILL.md and ROUTER.md copies |
| `scratch/replay-before.txt`, `replay-after.txt`, `routes-before.txt`, `routes-after.txt` | Create | Before and after evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the seven hub SKILL.md files carries one pointer line at the end of SMART ROUTING, with no MACHINE ROUTER section and no sentence that points at one | `grep -c 'MACHINE ROUTER' .skilled/skills/sk-doc/SKILL.md` prints 0, `grep -c 'before selecting hub resources' .skilled/skills/sk-doc/SKILL.md` prints 1, and the same checks on the other six hubs print 0 and 1 |
| REQ-002 | Each hub `ROUTER.md` holds the moved prose in one named section, and its machine section is byte-identical to the pre-move section | The seven hashes in `scratch/machine-sections-before.txt` match the after capture, and `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing |
| REQ-003 | Every hub makes the same compiled route decisions after the move as before it | The `action`, `selectionKind` and `targets` fields in `scratch/routes-before.txt` and `scratch/routes-after.txt` match for all seven hubs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The seven compiled-route manifests and their authored copies are refreshed, and the guard reports every hub fresh | `node .skilled/bin/compiled-route-guard.cjs` prints seven `fresh` lines and exits 0 |
| REQ-005 | Every hub passes the per-hub check with zero warnings | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK`, and the same command on the other six hub paths prints `OK` |
| REQ-006 | The routing suites pass, including the routing-shape, root-router and replay suites | The pytest and `node --test` runs named in `plan.md` report no failure |
| REQ-007 | Each touched hub carries the next edition, one changelog entry and version parity across its three JSON files | The per-hub check passes 13a and 13b for all seven |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The replay capture is identical before and after. Today it reads `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and the invariant is the match, not that figure.
- **SC-002**: `grep -c 'MACHINE ROUTER' .skilled/skills/sk-doc/SKILL.md` prints 0, the same check on the other six hubs prints 0, while each `ROUTER.md` holds the moved prose in its named section.
- **SC-003**: `compiled-route-guard.cjs` reports seven fresh hubs, and `parent-skill-check.cjs` prints `OK` for seven hubs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002's shared resolver | Router replay keeps reading SKILL.md, which no longer holds a block, so the projection report loses its source | Start this phase only after 002 lands, and confirm the replay reads `ROUTER.md` before the first edit |
| Dependency | Phase 003's rewritten RS-005 | A pointer-only SKILL.md still fails check 12b | Start this phase only after 003 lands, and copy the pointer shape its check accepts |
| Risk | The moved prose adds a second `INTENT_SIGNALS = {` line | The parser reads the wrong declaration and the route changes | Keep every declaration in the existing machine section, and compare the seven section hashes |
| Risk | One hub's JSON files lag its new edition | Check 13a fails on that hub | Raise `description.json`, `hub-router.json` and `mode-registry.json` with the edition in the same edit |
| Risk | A relative link in the moved prose resolves differently | A reader lands on a dead path | Both files are siblings, so relative paths keep resolving, and the dead-route scan reports 0 findings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Nothing remains open. The pointer shape that phase 003's rewritten RS-005 requires resolved to one line at the end of SMART ROUTING: Run the compiled-routing directive in `ROUTER.md` before selecting hub resources. All seven hubs carry it, and check 12b accepts it.
<!-- /ANCHOR:questions -->

---

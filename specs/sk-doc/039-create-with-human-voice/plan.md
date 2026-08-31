---
title: "Implementation Plan: Add the sk-create-with-human-voice mode packet to the sk-doc hub"
description: "Build the packet first so the hub wiring describes something real, then land it on every applicable section 7 surface, then the command and its four generated mirrors, then the gates."
trigger_phrases:
  - "human voice mode plan"
  - "hvr packet integration"
  - "section 7 surfaces"
  - "voice scanner design"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add the sk-create-with-human-voice mode packet to the sk-doc hub

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, Python 3.9 |
| **Framework** | `sk-doc` parent-hub contract (`parent-skills-nested-packets.md`) |
| **Storage** | None. The scanner reads a file and writes nothing |
| **Testing** | Two committed fixtures plus three negative controls, run by hand |

### Overview

The packet holds the workflow and no copy of the standard. The scanner parses `hvr-rules.md`
at run time, so there is exactly one source of truth for every banned term. Integration
follows section 7 in order, because a mode registered on one surface and absent from the
next looks green and is unreachable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Scanner controls run, including the fail-closed one
- [x] Docs updated (spec/plan/tasks/acceptance-criteria/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-tier parent hub. The hub routes by `workflowMode`, the packet owns the workflow, and
the standard stays in the shared backbone that every packet consumes.

### Key Components

- **`SKILL.md`**: the apply and score orderings, the always and never rules, the router pseudocode.
- **`references/scope-and-exemptions.md`**: the gate that runs before any edit. This is the mode's own content, absent from the standard, and the part that stops a voice pass corrupting a quotation or a generated file.
- **`references/scoring-and-verification.md`**: pass order, precedence arithmetic, the bands, and the re-scan.
- **`scripts/hvr_scan.py`**: the mechanical pass. Parses section titles, not section numbers, and refuses to report a clean scan from an unparsed standard.
- **`assets/voice-report-template.md`**: the result shape, with a row for exemptions and columns for both scan numbers.

### Data Flow

The scanner reads `hvr-rules.md`, extracts four term families, masks frontmatter and code
in the target, matches, collapses overlaps under the standard's precedence rule, and prints
a grouped report plus the unscored judgment list. Nothing persists between runs.

### Two Judgment Calls

**The standard does not move.** Hundreds of files carry the path, most of them frozen spec
documents, plus a spec-kit golden snapshot. A move buys a tidier folder and costs shipped
history plus a test suite. Verified by counting: `grep -rl "hvr-rules.md"` over the tree
excluding `.git` and `node_modules`, with the large majority under `specs/`.

**The mode gets a command.** Every sibling has one, and section 7 row 11 exists for exactly
this. `/doc:quality` proves the hub tolerates a mode without a real command, but that is
the defect this packet's section 6 records rather than a pattern to copy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The section 7 surface list is the inventory, so it is reproduced here with the action taken
on each. Row 10 does not apply: the mode is `metadata`-routed, so it gets no advisor entry
of its own and needs no projection-map or scorer change.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 1 `mode-registry.json` | Packet registration | update | `parent-skill-check` 3b reports 14 modes |
| 2 `hub-router.json` `routerSignals` | Stage-one selection | update | 5b: signal keys match the registry set |
| 3 `hub-router.json` `tieBreak` | Stage-one tie order | update | 5e: tieBreak covers every registered mode |
| 4 root `ROUTER.md` maps | Stage-two leaves | update | 12a passes, and router-replay returns four leaves with none missing |
| 5 root `ROUTER.md` `FULL_INVENTORY` | Full-toolkit intent | update | The four packet leaves appear in the block |
| 6 `graph-metadata.json` | Advisor vocabulary | update | `skill_advisor.py` returns `sk-doc` at 0.95 on two voice phrasings |
| 7 hub `SKILL.md` mode table | Human-facing contract | update | 6b: every registered mode appears in the table |
| 8 `description.json` | Doctor metadata | update | 8a and 8b pass, and the advisor cites the keyword match |
| 9 `leaf-manifest.json` | Generated leaf index | regenerate | 10b: byte-identical to a fresh regeneration |
| 10 Projection maps and scorer | Non-`metadata` modes only | not a consumer | 4a and 4b report the hub declares no lexical or alias-fold modes |
| 11 Command mirrors | Runtime reachability | generate | Three generators report in sync across all four runtimes |

Required inventories:
- Alias collision across the registry: asserted in the edit script, 146 aliases, zero collisions.
- Consumers of the standard's path: `grep -rl "hvr-rules.md" --exclude-dir=node_modules --exclude-dir=.git .`
- Sibling traffic: seven phrasings replayed through `router-replay.cjs`, covering both siblings that share voice vocabulary.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture | Dirty and clean fixtures covering every mechanical class, plus masking | `hvr_scan.py` |
| Negative control | A renamed section in the standard must stop the run | `sed` plus `--rules` |
| Contract | Packet shape, frontmatter, sections, resource docs | `package_skill.py --check --strict` |
| Integration | Hub invariants across all twelve check families | `parent-skill-check.cjs` |
| Routing | Both stages, for the mode and for both siblings that share vocabulary | `router-replay.cjs`, `skill_advisor.py` |
| Mirrors | Four runtime command surfaces | three sync generators in `--check` mode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `hvr-rules.md` section titles | Internal | Green | The scanner fails closed rather than reporting a wrong result |
| `generate-leaf-manifest.cjs` | Internal | Green | A hand-edited manifest fails 10b byte-drift |
| Three mirror generators | Internal | Green | The command is unreachable from the runtimes they own |
| Concurrent streams 2, 3 and 4 | Internal | Green | Cross-packet needs are recorded as proposals, not applied |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `parent-skill-check` turns red on a surface this packet touched, or a sibling mode loses traffic it held before.
- **Procedure**: delete `.opencode/skills/sk-doc/sk-create-with-human-voice/`, delete the command router and its three assets, revert the eight hub-root files, regenerate `leaf-manifest.json`, then re-run the three mirror generators in write mode to prune the four mirrors. Nothing else was touched, so no other file needs inspecting.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Packet) ──► Phase 2 (Hub wiring) ──► Phase 3 (Command) ──► Phase 4 (Gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet | None | Hub wiring |
| Hub wiring | Packet | Command, Gates |
| Command | Hub wiring | Gates |
| Gates | Command | None |

The packet comes first because the hub-root files name its files. Wiring a mode whose
leaves do not exist yet fails 10c on the first regeneration.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet | Med | 2-3 hours |
| Hub wiring | Med | 1 hour |
| Command | Med | 1-2 hours |
| Verification | Low | 1 hour |
| **Total** | | **5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines captured before the first edit (`scratch/baseline-*.txt`)
- [x] No feature flag needed. A routing change is reversible by reverting the registry
- [x] Three concurrent streams confirmed not to own any file touched here

### Rollback Procedure
1. Remove the packet directory and the four command files.
2. Revert the eight hub-root files.
3. `node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/sk-doc`
4. Run the three mirror generators in write mode so they prune the four command mirrors.
5. `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc` must return to 13 modes, 0 warnings.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Nothing persists outside the working tree.
<!-- /ANCHOR:enhanced-rollback -->

---

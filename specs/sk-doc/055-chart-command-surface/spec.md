---
title: "Feature Specification: Chart Command Surface [template:level-2/spec.md]"
description: "sk-create-chart was reachable only by advisor alias while its sibling sk-create-diagram had a full command surface. This packet builds /create:chart to the same shape and lands it on every surface a command has to reach."
trigger_phrases:
  - "create chart command"
  - "chart command surface"
  - "sk-create-chart routing"
  - "chart mode reachability"
  - "command parity chart diagram"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Chart Command Surface

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-doc` routes fifteen workflow packets, and fourteen of them have their own slash command. `sk-create-chart` did not. Its row in the hub mode table read `(routes via aliases)`, so a person who wanted a chart could reach the packet only by phrasing a request the advisor happened to score above its bar, while `sk-create-diagram`, the packet on the other side of the same boundary, answered `/create:diagram` and everything behind it. The same row also carried a stale form count, saying twenty where the catalog holds twenty-one.

### Purpose
`/create:chart` exists, is shaped like its sibling commands, and lands on every surface a command has to reach before a person can type it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A thin router at `.opencode/commands/create/chart.md` plus the three assets it owns.
- The registration surfaces that make it reachable: the hub registry, the hub mode table, the hub command metadata, and the runtime mirrors for Claude, Cursor and Codex.
- The advisor command-bridge projection derived from that metadata, and the two tests whose census counts the change moves.
- The compiled-routing refresh the hub's own `SKILL.md` edit forces, and the canary re-pin that follows it.
- The stale form count in the hub mode table and the same figure in the hub README.

### Out of Scope
- The `sk-create-chart` packet itself. No catalog row, form file, palette value or validator changed.
- The `@markdown` agent roster, which lists ten of the fourteen `/create:*` commands and would need three unrelated rows to be made whole. Recorded in section 10.
- The two command catalogs under `.opencode/commands/`, stale by two commands before this change for the same reason.
- The advisor's confidence bar. Two plausible chart prompts still abstain, which is a scorer property rather than a wiring gap.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/create/chart.md` | Create | The thin router, six canonical sections |
| `.opencode/commands/create/assets/create-chart-presentation.txt` | Create | Every user-visible word the command emits |
| `.opencode/commands/create/assets/create-chart-auto.yaml` | Create | The seven-step autonomous workflow |
| `.opencode/commands/create/assets/create-chart-confirm.yaml` | Create | The same seven steps with an approval gate each |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | `command` moves from `null` to `/create:chart` |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | Mode-table command cell, and the form count |
| `.opencode/skills/sk-doc/command-metadata.json` | Modify | The advisor-facing entry, including a diagram discriminator |
| `.opencode/skills/sk-doc/README.md` | Modify | Command list and the same form count |
| `.claude/commands/create/chart.md` | Create | Symlink mirror, written by the mirror sync |
| `.cursor/commands/create-chart.md` | Create | Symlink mirror, written by the mirror sync |
| `.codex/prompts/create-chart.md` | Create | Generated bridge, written by the prompt sync |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/command-bridges.generated.json` | Modify | Derived, one new inventory entry |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts` | Modify | Derived generated block |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Modify | Derived generated block |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/command-metadata-e2e.vitest.ts` | Modify | Declaration census, 19 to 20 |
| `.opencode/commands/create/assets/tests/fixtures/emitted-name-contract.json` | Modify | Source asset roster gains three names |
| `.opencode/commands/create/assets/tests/test_emitted_name_contract.py` | Modify | Root YAML count, 26 to 28 |
| `.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | Modify | Refreshed activation manifest |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/**` | Modify | Authored manifest copy, rebuilt canary artifacts, re-pinned digests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/create:chart` exists as a thin router with the canonical numbered sections and three owned assets |
| REQ-002 | The hub registry binds `sk-create-chart` to `/create:chart`, and the hub mode table shows that exact command |
| REQ-003 | The command resolves in every runtime tree that mirrors commands, which is OpenCode, Claude, Cursor and Codex |
| REQ-004 | Compiled routing serves a real route for a chart request rather than the legacy sentinel, and the fleet guard reports every hub fresh |
| REQ-005 | The canary validates REAL-GREEN against re-pinned source digests |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The advisor command-bridge projection carries `/create:chart`, derived rather than hand-written |
| REQ-007 | Every test whose census the change moves is updated to the new number rather than relaxed |
| REQ-008 | The hub mode table and the hub README state twenty-one chart forms, matching the catalog |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A person who types `/create:chart` in OpenCode, Claude, Cursor or Codex reaches the same router.
- **SC-002**: An advisor recommendation for a chart request carries a compiled route whose target is `sk-create-chart`.
- **SC-003**: The chart corpus check still reports `RESULT: PASSED` with zero errors, proving the packet was not disturbed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing the hub `SKILL.md` makes the hub serve legacy, which silently drops the compiled route from every recommendation | High, and invisible in any green run | Refresh both manifest copies in the same change, then read the guard and the compiled route directly |
| Risk | The canary pins source digests by hand, so a hub edit reports the hub's own change as corruption | Medium, blocks the gate | Re-pin in the same change and re-derive each hash independently before writing it |
| Dependency | `derive-command-bridges.cjs` owns three generated files | A hand edit to any of them drifts | Run the generator, then its own `--check` |
| Dependency | Two test files carry a declaration census | Adding a command reds them | Both carry a comment saying to recount rather than relax, and both were recounted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The router adds no runtime cost beyond reading one presentation asset and one workflow asset, matching its sibling commands.
- **NFR-P02**: The compiled-route lookup for the hub answers in one process invocation, the same path every other hub uses.

### Security
- **NFR-S01**: `allowed-tools` lists only the six tools the workflow uses, and names no MCP surface.
- **NFR-S02**: The command writes only to the target path the operator supplies, and the workflow forbids inferring that path from context.

### Reliability
- **NFR-R01**: Every mirror is a symlink or a generated bridge, so no mirror can drift from the canonical router.
- **NFR-R02**: The three generated advisor files are derived from the hub metadata on demand, and the generator's own check proves they are fresh.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the router's presentation contract asks for the target path, the reader's question and the data, and stops rather than guessing any of the three.
- Maximum length: the catalog states a data ceiling per form, and seven forms print a notice inside the figure when values pass it.
- Invalid format: a described dataset is refused, because every value a form displays is typed into its data block.

### Error Scenarios
- External service failure: none applies. A chart file depends on nothing at runtime, by contract.
- Network timeout: none applies for the same reason.
- Concurrent access: the corpus check opens files read only, so a concurrent run cannot corrupt a delivery.

### State Transitions
- Partial completion: a run that resolves no catalog row ends as a reported gap, which is a successful terminal state rather than a failure.
- Session expiry: none applies. The workflow holds no session.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 7 files created, 8 hand-edited, 11 written by generators |
| Risk | 8/25 | No auth, no data, no breaking contract. One shared hub surface with a quiet failure mode |
| Research | 12/20 | The surface sweep was the work. Four surfaces were not in the original list and were found by grep |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the `@markdown` agent roster list every `/create:*` command? It lists ten of fourteen today, and its own contract refuses a template it does not list. Four commands are affected, three of which predate this packet.
- Should the two command catalogs under `.opencode/commands/` be regenerated from `command-metadata.json` rather than hand-kept? Both are stale by two commands, which is the failure a derived catalog would not have.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

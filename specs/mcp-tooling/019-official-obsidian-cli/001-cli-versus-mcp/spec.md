---
title: "Feature Specification: Phase 1: cli-versus-mcp"
description: "Measure every available feature of the official obsidian CLI and the cyanheads MCP server against a live vault in both app states, then give the mcp-obsidian skill an evidence-backed default surface."
trigger_phrases:
  - "cli versus mcp"
  - "obsidian surface comparison"
  - "preferred obsidian surface"
  - "obsidian mcp measurement"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: cli-versus-mcp

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The `mcp-obsidian` skill documented two app-backed surfaces, the official `obsidian` CLI and the cyanheads `obsidian-mcp-server`, and told an agent to pick between them on prose rather than on measurement. This phase exercised both against the operator's live vault in both app states, recorded every command with its output and exit status, and wrote the result into a new skill reference that sets a default.

**Key Decisions**: the official CLI is the default app-backed surface. The MCP server is the specialist for in-place section editing, tag-list writes, JSON-typed frontmatter, and batches over roughly twenty calls.

**Critical Dependencies**: a running Obsidian desktop app for the app-up half, and the Local REST API plugin, which was found disabled and had to be enabled and then restored.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `scaffold/001-cli-versus-mcp` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | `references/cli-versus-mcp.md` exists, both quality gates pass, and the skill's README and references name one default without hedging |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Official CLI versus MCP server: measured capability comparison and a preferred surface specification.

**Scope Boundary**: the two app-backed surfaces only. The headless `notesmd-cli` profile was not re-measured and its position as the headless default is unchanged.

**Dependencies**:
- Obsidian desktop 1.13.7 with the CLI registered
- `obsidian-local-rest-api` v5.1.0, found installed but disabled
- `npx` and Node for `obsidian-mcp-server`

**Deliverables**:
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md`
- Default-setting edits in the skill's `README.md` and three existing references
- Playbook corrections where the measurement changed what a scenario must exercise

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill described the official CLI and the MCP server side by side and left the choice to the reader. Neither surface's real coverage, failure shape, latency or prerequisites had been measured against the other, and two of the skill's own claims about the MCP server (a v3.2.9 package, fourteen tools with nine unenumerated) were wrong. An agent reading the skill could not tell which surface to reach for, or that the MCP path was switched off in this vault.

### Purpose
The skill names one default app-backed surface, states when to leave it, and backs every cell of the comparison with a command that was run and read.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Exercise every capability family both surfaces expose, in the app-closed and app-open states
- Record each invocation's stdout, stderr, exit status and elapsed time to separate files, never through a pipe
- Author `references/cli-versus-mcp.md` with a recommendation the skill follows
- Make `README.md` and the three existing surface references state that default without hedging
- Correct the measured facts the skill had wrong

### Out of Scope
- `notesmd-cli` re-measurement. It is the headless default and this comparison is about the two app-backed surfaces
- The skill's pre-existing Human Voice backlog. The gate is that nothing new is added
- `SKILL.md`. It is a compiled-policy input, so the change is recorded here as prepared text instead
- The feature catalog and `INSTALL-GUIDE.md`, which repeat the stale MCP version and tool count. Recorded in §12 as adjacent

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md` | Create | The measured comparison and the default |
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | Modify | Router, when-to-use and FAQ state the default |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md` | Modify | Real tool inventory, real version, the specialist role |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md` | Modify | Profile selection names the default, tag write-gap recorded |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md` | Modify | Surface selection, the `daily:read` hazard, settled unknowns |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modify | Scenario objectives the measurement changed |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Modify | Index the new reference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every capability family both surfaces expose is exercised in both app states, with the command, its output and its exit status read from a file |
| REQ-003 | `references/cli-versus-mcp.md` exists and states one default plus the conditions for leaving it |
| REQ-004 | The operator's vault is unchanged: same markdown and total file counts before and after, and no scratch note left behind |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `README.md` and the three existing surface references name the same default without hedging |
| REQ-005 | Every measured fact that contradicts the skill's existing text is corrected in the reference that carries it |
| REQ-006 | App state found and left is recorded, and any app or plugin state changed for the measurement is restored |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 .opencode/skills/sk-doc/scripts/validate_document.py` exits 0 on every file this phase wrote or edited
- **SC-002**: `hvr_scan.py` reports zero hard blockers on the new reference, and no increase on any edited file
- **SC-003**: `generate-leaf-manifest.cjs --check .opencode/skills/mcp-tooling` prints `OK`
- **SC-004**: `validate.sh specs/mcp-tooling/019-official-obsidian-cli --strict --recursive` prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Obsidian desktop app | The app-up half cannot run | Launch it, wait on the readiness probe, quit afterwards |
| Dependency | Local REST API plugin | Every MCP vault call fails | Enable it for the measurement, then restore it to disabled |
| Risk | Writing to the operator's real vault | High | Name a target on every mutating call, create only scratch notes, count files before and after |
| Risk | The CLI exits 0 on failure | High | Capture stdout to a file and test its content, never branch on the status |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: per-call latency is reported for both surfaces from at least ten samples each, with the MCP figure separated into one-time startup and warm per-call

### Security
- **NFR-S01**: the Local REST API bearer token is read from `.env` at call time and never written into any document or evidence file

### Reliability
- **NFR-R01**: every claim in the deliverable is reproducible from a recorded command, and anything not reproduced is listed as an unknown with the check that settles it

---

## 8. EDGE CASES

### Data Boundaries
- Empty search result: measured on both surfaces. `No matches found.` at exit 0 on the CLI, `0 total` with `isError: false` on the MCP server. Neither is an error
- Empty directory: the CLI's `folders` lists it, the REST API answers 404 and the MCP tool reports `Not found`

### Error Scenarios
- App down: the CLI exits 1 on stderr, the MCP server starts and fails each vault call with code `-32603`
- Plugin disabled: `tools/list` still succeeds, so a preflight that only lists tools proves nothing
- Name collision on create: the CLI silently makes a numbered sibling, the MCP server refuses

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: 7, mostly documentation, 2 systems |
| Risk | 18/25 | Writes to a real vault, toggles a plugin in the operator's app |
| Research | 18/20 | The whole phase is measurement against a live system |
| Multi-Agent | 4/15 | Single workstream |
| Coordination | 8/15 | App state, plugin state and vault state all had to be restored |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A mutating command with no target writes to the note the operator has open | H | M | Pass `file=` or `path=` on every call. A bare `read` was exercised once, deliberately, to size the leak |
| R-002 | The plugin left enabled after the run changes the operator's security posture | M | M | Record the disabled starting state, restore it, and confirm with `obsidian plugin id=` |
| R-003 | A green run that never touched the vault is mistaken for a pass | H | M | Verify by content, not exit code. Count vault files before and after |

---

## 11. USER STORIES

### US-001: One default, stated once (Priority: P0)

**As an** agent driving an Obsidian vault, **I want** the skill to name one app-backed surface as the default, **so that** I stop re-deciding it from prose on every task.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Know when to leave the default (Priority: P1)

**As an** agent facing section-scoped edits or a long batch, **I want** the exact conditions that justify the MCP server, **so that** I escalate on evidence rather than on preference.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Where `obsidian delete` without `permanent` puts the file. It reported `Moved to trash` and the file was in neither `<vault>/.trash` nor `~/.Trash`
- Why `obsidian_list_notes` reports `Not found` for an empty directory the CLI's `folders` lists. The REST API answers 404 for that path
- Whether `obsidian property:remove` can stall. One invocation was killed at 120 s during app startup, and two later runs returned in 43 and 57 ms
- Adjacent, not fixed: `INSTALL-GUIDE.md` and `SKILL.md` still carry `obsidian-mcp-server@3.2.9` and a fourteen-tool count. `SKILL.md` is a compiled-policy input, so §13 holds the prepared text instead
<!-- /ANCHOR:questions -->

---

## 13. PREPARED SKILL FILE TEXT (NOT APPLIED)

`SKILL.md` is a compiled-policy input and was not edited. Two of its statements are now contradicted by measurement. The replacement text is recorded here for whoever owns the recompile.

**Line 641**, currently naming npm `@3.2.9`:

> The default MCP is cyanheads' `obsidian-mcp-server`, launched over **stdio** via `npx -y obsidian-mcp-server@latest` (it also supports http on `127.0.0.1:3010/mcp`). On 2026-09-02 that tag resolved to **v0.12.3**, so do not pin a version from documentation. It talks to the vault through the **Local REST API plugin v4.0.0+**, so it needs a **running Obsidian, the plugin enabled, and an API key**. Enabled is not the same as installed: a disabled plugin still lets the server start and list tools.

**Line 798**, currently the comment `// Tool naming: obsidian.obsidian_{tool_name}  - 14 tools total`:

> `// Tool naming: obsidian.obsidian_{tool_name} - 12 tools exposed, 14 built`

A third change belongs in whichever routing section picks a surface:

> Among the two app-backed surfaces, the official `obsidian` CLI is the default. Escalate to the MCP server for in-place section patching, in-note search-and-replace, tag-list writes, JSON-typed frontmatter, or a batch over roughly twenty calls. See `references/cli-versus-mcp.md`.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

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

<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: Command Alignment (Post JS-to-TS Migration)

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.0 -->

---

## EXECUTIVE SUMMARY

After the JS-to-TS migration (spec 092), all command files referencing `generate-context.js` use the pre-migration path `scripts/memory/generate-context.js` which no longer exists. The compiled output now lives at `scripts/dist/memory/generate-context.js` due to `tsconfig outDir: "./dist"`. A secondary issue is 4 references to `create-spec-folder.sh` which was renamed to `scripts/spec/create.sh`.

**Key Decisions**: Single search-and-replace for `scripts/memory/generate-context.js` → `scripts/dist/memory/generate-context.js` across all command files.

**Critical Dependencies**: None — this is a documentation/path correction task with no code logic changes.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-07 |
| **Parent Spec** | `092-javascript-to-typescript` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The spec 092 TypeScript migration changed the compilation output from in-place to `dist/` subdirectories (`tsconfig outDir: "./dist"`). All command `.md` and `.yaml` files still reference the old path `scripts/memory/generate-context.js` which does not exist on disk. Any workflow step invoking `node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js` will fail with `MODULE_NOT_FOUND`.

### Purpose

All command files reference correct, verified file paths for post-migration runtime invocations. Every `node` invocation in command files resolves to an existing `.js` file.

---

## 3. SCOPE

### In Scope

- All `.md` command files in `.opencode/command/spec_kit/` (7 files)
- All `.md` command files in `.opencode/command/create/` (6 files)
- All `.yaml` asset files in `.opencode/command/spec_kit/assets/` (13 files)
- All `.yaml` asset files in `.opencode/command/create/assets/` (6 files)
- `.opencode/command/memory/save.md` (highest reference count: 8 occurrences)

### Out of Scope

- `CLAUDE.md` — separate spec/fix (2 broken references at lines 52, 62)
- `AGENTS.md` — separate spec/fix (3 broken references at lines 52, 62, 211)
- Source code files (`.ts`, `.js`) — no code changes needed
- MCP tool names — verified correct by Agent-9 (all 22 tools match)
- Runtime config (`opencode.json`, `.utcp_config.json`) — verified correct by Agent-9

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `command/spec_kit/complete.md` | Modify | Fix 1 `generate-context.js` path |
| `command/spec_kit/handover.md` | Modify | Fix 1 `generate-context.js` path |
| `command/spec_kit/plan.md` | Modify | Fix 2 `generate-context.js` paths |
| `command/spec_kit/research.md` | Modify | Fix 4 `generate-context.js` paths |
| `command/create/agent.md` | Modify | Fix 1 `generate-context.js` path |
| `command/memory/save.md` | Modify | Fix 8 `generate-context.js` paths |
| `command/create/assets/create_agent.yaml` | Modify | Fix 1 `generate-context.js` path |
| `command/spec_kit/assets/spec_kit_research_auto.yaml` | Modify | Fix 1 `generate-context.js` path |
| `command/spec_kit/assets/spec_kit_research_confirm.yaml` | Modify | Fix 1 `generate-context.js` path |
| `command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Fix 1 `generate-context.js` path + 1 `create-spec-folder.sh` |
| `command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modify | Fix 1 `generate-context.js` path + 1 `create-spec-folder.sh` |
| `command/spec_kit/assets/spec_kit_implement_auto.yaml` | Modify | Fix 1 `generate-context.js` path |
| `command/spec_kit/assets/spec_kit_implement_confirm.yaml` | Modify | Fix 1 `generate-context.js` path |
| `command/spec_kit/assets/spec_kit_plan_auto.yaml` | Modify | Fix 1 `create-spec-folder.sh` reference |
| `command/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modify | Fix 1 `create-spec-folder.sh` reference |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix all `generate-context.js` invocation paths | `grep -r "scripts/memory/generate-context.js" .opencode/command/` returns 0 results |
| REQ-002 | All fixed paths point to existing files | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Fix `create-spec-folder.sh` references | `grep -r "create-spec-folder.sh" .opencode/command/` returns 0 results |
| REQ-004 | Contextual/shorthand references updated where they contain full paths | Bare `generate-context.js` name-only references acceptable in descriptions |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Zero broken `generate-context.js` path references in command files
- **SC-002**: Zero `create-spec-folder.sh` references in command files
- **SC-003**: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help` succeeds

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Contextual references (shorthand names without paths) may be missed | Low | Agent-10 cataloged all contextual references |
| Risk | YAML files are large (1000-2000 lines), increasing risk of wrong-line edits | Med | Use exact string matching, not line numbers |
| Dependency | `.opencode/` is a symlink to Public repo — edits affect all projects | Med | Verify in Public repo after edits |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — documentation-only changes

### Security
- **NFR-S01**: N/A — no code changes

### Reliability
- **NFR-R01**: Post-fix `generate-context.js` invocations must succeed on first attempt

---

## 8. EDGE CASES

### Path Variations
- Bare `generate-context.js` without path prefix (research.md:624): Needs full path
- `scripts/generate-context.js` missing `/memory/` segment (AGENTS.md:211): Out of scope
- Table cell shorthand `generate-context.js [spec-folder]`: Acceptable as documentation shorthand

### YAML Structure
- `script_path` field values (structured YAML): Must use full correct path
- Activity description text (natural language): May use shorthand

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 15, LOC changed: ~30, Systems: 1 (commands) |
| Risk | 5/25 | No auth, no API, no breaking changes |
| Research | 18/20 | 10 research agents completed, full evidence base |
| Multi-Agent | 3/15 | Single workstream |
| Coordination | 3/15 | No cross-team dependencies |
| **Total** | **37/100** | **Level 3 (driven by research depth, not complexity)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Symlink edits propagate to all projects using Public repo | M | H | Expected behavior — all projects need this fix |
| R-002 | Missed references in YAML files | L | L | Comprehensive grep validation in checklist |
| R-003 | Future path changes if dist/ strategy changes | M | L | Document the dist/ convention in decision-record |

---

## 11. USER STORIES

### US-001: Agent Saves Context Successfully (Priority: P0)

**As an** AI agent running a spec_kit workflow, **I want** the `generate-context.js` path to resolve correctly, **so that** Step 13 (Save Context) completes without `MODULE_NOT_FOUND` errors.

**Acceptance Criteria**:
1. Given a spec folder exists, When the agent runs `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [path]`, Then the script executes and generates a context file

### US-002: Spec Folder Creation Works (Priority: P1)

**As an** AI agent running the complete workflow, **I want** the `create-spec-folder.sh` reference to point to the correct script, **so that** automatic spec folder creation works correctly.

**Acceptance Criteria**:
1. Given the workflow reaches folder creation, When it references the script, Then the reference points to `scripts/spec/create.sh`

---

## 12. OPEN QUESTIONS

- None — all research completed by 10 parallel agents with full filesystem verification.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Data**: See `scratch/agent-*.md` (10 research agent outputs)

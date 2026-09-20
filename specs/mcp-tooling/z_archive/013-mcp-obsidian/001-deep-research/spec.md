---
title: "Feature Specification: Phase 1 — Deep research: Obsidian CLI / REST API / MCP landscape"
description: "Multi-model /deep:research (no early convergence) mapping Obsidian's automation surfaces — CLI, Local REST API, MCP servers, plugin/URI — to decide build-vs-adopt for the mcp-obsidian CLI and MCP tools."
trigger_phrases:
  - "obsidian deep research"
  - "obsidian cli mcp landscape"
  - "obsidian build vs adopt"
  - "mcp-obsidian phase 1"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/001-deep-research"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 1 research spec (model matrix + seed sources)"
    next_safe_action: "Read cli-codex SKILL.md, then init /deep:research state and run batch 1 (SOL-high)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Deep research: Obsidian CLI / REST API / MCP landscape

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-tool-selection-and-scaffold |
| **Handoff Criteria** | `research.md` with a decided build-vs-adopt recommendation per surface (CLI, MCP), each candidate's package/binary identity verified, plus the auth/config pattern and feature surface captured. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the `mcp-obsidian` mode build. It is the ONLY research-first phase and it **gates every build phase** — nothing is scaffolded or wired until this phase decides *what* to install/build.

**Scope Boundary**: Read-only investigation + a synthesized `research.md`. This phase does NOT touch shipped runtime, does NOT scaffold the package, and does NOT install anything. (Contrast: phases 002–007 mutate the repo.)

**Dependencies**:
- `/deep:research` loop (system-deep-loop) with its externalized state machine (`deep-research-state.jsonl`, `deltas/`, `logs/`).
- Executor **cli-codex** (GPT-5.6 personas SOL / TERRA / LUNA). Per PLAN-WORKFLOW LOCK, **read `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md` before any dispatch** — it owns the exact persona/effort/speed flag syntax and the fan-out env gotcha (`MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 … </dev/null`).
- `WebFetch` / `WebSearch` for the seed sources.

**Deliverables**:
- `research.md` — synthesized findings, per-question answers with citations, and a ranked build-vs-adopt recommendation.
- Deep-research runtime state (`deep-research-state.jsonl`, `deltas/`, `logs/`) + a convergence/synthesis report.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Before building an Obsidian mode we do not know Obsidian's real automation surface: whether there is a first-party CLI, which community CLIs exist and are maintained, which MCP servers exist and how they authenticate (Local REST API token vs direct vault filesystem), and whether any of it works headlessly without the desktop app running. Guessing risks the same trap `mcp-click-up` hit (an MCP npm package name that 404'd).

### Purpose
Produce a cited `research.md` that decides, for each surface (CLI and MCP), whether to **adopt** a named existing tool or **build** one — with the package/binary identity verified — plus the auth/config pattern and feature surface, so Phase 2 can lock choices with zero further research.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Multi-model `/deep:research` run, **no early convergence**, on the exact model matrix below.
- Coverage of official docs, community CLI(s), MCP servers, Local REST API plugin, and the `obsidian://` URI scheme.
- A build-vs-adopt recommendation per surface + verified package identity + auth/config pattern + feature surface.

#### Research Model Matrix (exact — no early convergence)

| Batch | Executor persona | Effort | Speed | Iterations |
|-------|------------------|--------|-------|------------|
| 1 | GPT-5.6 **SOL** | high | normal | 4 |
| 2 | GPT-5.6 **TERRA** | max | fast | 3 |
| 3 | GPT-5.6 **LUNA** | max | normal | 3 |
| — | **Total** | — | — | **10** |

> If `/deep:research` cannot vary the model per iteration within one run, execute three sequential no-early-convergence sub-batches (SOL×4 → TERRA×3 → LUNA×3) and aggregate into one `research.md`. Convergence detection stays **off** for all batches.

#### Seed sources (starting set — expand during iterations)
- The Obsidian CLI terminal guide: `https://www.dsebastien.net/the-complete-guide-to-the-obsidian-cli-everything-you-can-do-from-the-terminal/`
- Official Obsidian Help — `help.obsidian.md`
- Obsidian Developer docs / plugin API — `docs.obsidian.md`
- Obsidian **Local REST API** community plugin (coddingtonbear/obsidian-local-rest-api)
- `obsidian://` URI scheme
- Community Obsidian **CLI** projects (npm / GitHub / Homebrew)
- Existing Obsidian **MCP** servers (npm / GitHub search: "obsidian mcp")

### Out of Scope
- Scaffolding, installing, or wiring anything — that starts in Phase 2/3/4.
- A general Obsidian plugin/sync ecosystem beyond CLI + MCP.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-tooling/013-mcp-obsidian/001-deep-research/research.md` | Create | Synthesized findings + recommendation |
| `.../001-deep-research/deep-research-state.jsonl` | Create | Deep-research externalized state ledger |
| `.../001-deep-research/deltas/`, `.../logs/` | Create | Per-iteration deltas + logs |
| `.../001-deep-research/implementation-summary.md` | Modify | Filled on phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the exact 10-iteration matrix (SOL-high-normal×4, TERRA-max-fast×3, LUNA-max-normal×3) via `/deep:research`, **no early convergence** | State ledger shows 10 completed productive iterations across the three configs; no early stop recorded |
| REQ-002 | Answer every seed research question in `research.md`, each load-bearing claim cited to a source | `research.md` has a section per question; claims carry source links |
| REQ-003 | Decide build-vs-adopt per surface (CLI, MCP) with a named candidate and **verified** package/binary identity | Recommendation names candidates; each identity verified (npm resolves / repo exists + maintained), avoiding the clickup 404 trap |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Capture the auth/config/token pattern (Local REST API token? vault path? env prefix) to mirror in `.utcp_config.json` + `.env.example` | Documented in `research.md` |
| REQ-005 | Extract the initial feature surface (note CRUD, search, backlinks, daily notes, tags, frontmatter, templates) to seed the feature-catalog + playbook | Feature list present in `research.md` |
| REQ-006 | Flag headless compatibility — does the surface need a running Obsidian app / Local REST API, or is it pure-filesystem? | Constraint documented for the Phase 4 / Phase 8 live-smoke decision |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 productive iterations completed with convergence detection off; a synthesis/convergence report exists.
- **SC-002**: `research.md` validates and contains a decided, ranked recommendation ready to hand to Phase 2 with no open build-vs-adopt question.
- **SC-003**: Every named candidate package/binary has a verified identity (no later 404 / unmaintained surprise).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex (SOL/TERRA/LUNA) | Wrong flags → wrong model/effort | Read `cli-codex/SKILL.md` first; use its persona/effort/speed syntax + fan-out env |
| Dependency | `/deep:research` state machine | Manual state drift | Use the loop's externalized state; no manual `/tmp` state; no direct `@deep-research` dispatch |
| Risk | `/deep:research` may not vary model per-iteration | Matrix not runnable as one loop | Run 3 sequential no-early-convergence sub-batches, aggregate to one `research.md` |
| Risk | WebFetch blocklist / rate limits | Missing sources | Fall back to WebSearch + cached docs; widen queries |
| Risk | Obsidian tools may require a running desktop app / Local REST API | Headless env can't live-smoke | Document constraint; defer live smoke to 004/008 or mark documented-unproven |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which cli-codex flags express the SOL / TERRA / LUNA persona + effort + speed? (Confirm from `cli-codex/SKILL.md` at dispatch.)
- Is there a first-party Obsidian CLI, or only community tools?
- Does the best MCP candidate authenticate via the Local REST API token or operate directly on the vault filesystem?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

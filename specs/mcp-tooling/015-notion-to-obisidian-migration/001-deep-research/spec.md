---
title: "Feature Specification: Phase 1 — Deep research: flawless complex Notion→Obsidian migration"
description: "20-iteration /deep:research (10x GLM-5.2 via cli-devin + 10x DeepSeek V4 Flash xhigh via cli-opencode/Cline, no early convergence), seeded by the preserved prior findings, on how to flawlessly migrate a complex Notion workspace into Obsidian using mcp-notion + mcp-obsidian as the migration engine plus any Obsidian plugin that closes a gap."
trigger_phrases:
  - "015 deep research notion obsidian migration"
  - "flawless notion obsidian migration research"
  - "complex notion workspace migration research"
  - "mcp-notion mcp-obsidian migration engine"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/001-deep-research"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored deep-research scope; seeded with prior-findings.md; ready for /deep:research launch"
    next_safe_action: "run the 20-iter deep research loop"
    blockers: []
    key_files:
      - "spec.md"
      - "prior-findings.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-001-deep-research"
      parent_session_id: "015-notion-to-obisidian-migration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Deep research: flawless complex Notion→Obsidian migration

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
| **Status** | Planned |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-migration-playbook |
| **Handoff Criteria** | `research/research.md` synthesized from 20 iterations with a decided migration method: importer choice, what survives vs breaks, the relation/rollup/formula recovery path, file/comment/view handling, the mcp-notion-reads / mcp-obsidian-writes division of labor, and any required Obsidian plugins. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the 015 Notion→Obsidian flawless-migration packet. It is the ONLY research-first phase and it **gates every build phase** — nothing is scaffolded, authored, or installed until this phase produces a verified migration method.

**Scope Boundary**: Read-only investigation plus a synthesized `research.md`. This phase does NOT implement anything in `mcp-notion` or `mcp-obsidian`, does NOT install any Obsidian plugin, and does NOT touch shipped runtime. (Contrast: phase 002+ authors the implementation once the verdict is known.)

**Seed**: `prior-findings.md` (a preserved copy of the original single-pass web-research note this packet started from) is the starting seed the loop extends — it already identified the Notion-API-import path, Bases as the native database replacement, and the Notion Bases / Dataview plugin recovery path, but was not exhaustive and predates a dedicated multi-model research loop.

**Dependencies**:
- `/deep:research` loop (system-deep-loop) with its externalized state machine (`deep-research-state.jsonl`, `deltas/`, `logs/`).
- Executor track A: **cli-devin**, model **GLM-5.2 High** (`glm-5-2`), 10 iterations. Per PLAN-WORKFLOW LOCK, **read `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` before any dispatch**.
- Executor track B: **cli-opencode** (Cline), model **DeepSeek V4 Flash (xhigh)**, 10 iterations. Per PLAN-WORKFLOW LOCK, **read `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` before any dispatch** — it owns the fanout flag/env requirements (including the `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` child-dispatch env).
- `WebFetch` / `WebSearch` for seed sources (Obsidian Importer docs, Obsidian Bases docs, Notion Bases community plugin, Dataview, official Notion API docs, `mcp-notion` / `mcp-obsidian` SKILL.md).

**Deliverables**:
- `research/research.md` — synthesized findings, per-question answers, the migration method, and the mcp-notion/mcp-obsidian division of labor, extending (not discarding) the seeded prior findings.
- Deep-research runtime state under `research/lineages/glm/` (track A) and `research/lineages/deepseek/` (track B) — config, state ledger, per-iteration files, findings registry.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
We need to flawlessly migrate a COMPLEX Notion environment — databases, relations, rollups, formulas, nested pages, files, comments, views — fully into Obsidian, using `mcp-notion` (the 24-tool Notion MCP mode) and `mcp-obsidian` (Local REST API + notesmd CLI + plugins) as the migration engine. A single-pass web-research note already sketched the shape of the problem (API import → Bases → plugin-recovered relations/rollups), but it was not exhaustive: it did not verify file/attachment upload paths, comments, multi-view databases, the exact mcp-notion read surface versus the exact mcp-obsidian write surface, or which Obsidian plugins are actually required versus optional. Guessing at that division of labor risks either an incomplete migration (silent data loss) or over-building tooling the skills don't need.

### Purpose
Produce a cited `research.md` — extending the seeded `prior-findings.md`, not replacing its verified conclusions — that decides the flawless migration method: which importer path to use for a complex space, what survives automatically versus what must be reconstructed, how relations/rollups/formulas are recovered (Notion Bases plugin vs Dataview vs `.base` files), how files/attachments/comments/multi-view databases and nested hierarchy are carried over, exactly which `mcp-notion` reads and which `mcp-obsidian` writes drive each step, and which Obsidian plugins (if any beyond what `mcp-obsidian` already knows) must be installed — so phase 002+ can start implementing with no open design question.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A two-track `/deep:research` run, **no early convergence**, on the config below, seeded by `prior-findings.md`.
- Importer choice for a complex, database-heavy Notion workspace: Notion-API import versus HTML `.zip` export, and what each preserves versus loses.
- Recovering relations, rollups, and formulas via the Notion Bases community plugin, Dataview, or hand-authored `.base` files.
- File uploads/attachments, comments, multi-view databases, and nested page hierarchy: what the importer/API preserves and what needs agent-driven reconstruction.
- The AI file-layer role: which operations `mcp-notion` reads (via the official Notion API) and which operations `mcp-obsidian` writes (via its Local REST API / notesmd CLI / plugin knowledge) at each migration step.
- Parity and verification: how to confirm a migrated workspace matches the source with no silent loss.

#### Research Config (exact — no early convergence)

| Field | Value |
|-------|-------|
| Executor A | cli-devin |
| Model A | GLM-5.2 High (`glm-5-2`) |
| Iterations A | 10 |
| Executor B | cli-opencode (Cline) |
| Model B | DeepSeek V4 Flash (xhigh) |
| Iterations B | 10 |
| Total iterations | 20 |
| Convergence | Off — run all 20 regardless of signal |
| Stop policy | `max-iterations` |
| Seed | `prior-findings.md` (preserved copy of the original web-research note) |

#### Seed sources (starting set — expanded during iterations)
- `prior-findings.md` (this packet's preserved prior research note).
- Obsidian Help — Import from Notion (API vs HTML modes) and Obsidian Bases documentation.
- The Notion Bases community plugin (`bgarciamoura/obsidian-notion-bases-plugin`) and the Dataview plugin.
- Official Notion API reference (pages, databases/data sources, files, comments, property types).
- `.opencode/skills/mcp-tooling/mcp-notion/SKILL.md` — the Notion-side read surface (24 tools).
- `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` — the Obsidian-side write surface (Local REST API, notesmd CLI, plugin knowledge).

### Out of Scope
- Implementing anything in `mcp-notion` or `mcp-obsidian` — that starts in phase 002+.
- Installing any Obsidian plugin or wiring new tooling — phase 002+.
- A live migration of any real Notion workspace — that is a phase 002+ (or later) build/verification concern, not this research phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `mcp-tooling/015-notion-to-obisidian-migration/001-deep-research/research/research.md` | Update | Deep-research loop extends the seeded findings into a synthesized 20-iteration migration method |
| `.../001-deep-research/research/lineages/glm/deep-research-state.jsonl` | Create | Track A (GLM-5.2/cli-devin) externalized state ledger |
| `.../001-deep-research/research/lineages/glm/iterations/iteration-001..010.md` | Create | Track A per-iteration findings (10 iterations) |
| `.../001-deep-research/research/lineages/deepseek/deep-research-state.jsonl` | Create | Track B (DeepSeek V4 Flash/cli-opencode) externalized state ledger |
| `.../001-deep-research/research/lineages/deepseek/iterations/iteration-001..010.md` | Create | Track B per-iteration findings (10 iterations) |
| `.../001-deep-research/implementation-summary.md` | Create | Filled on phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Run the exact 20-iteration config (10x GLM-5.2/cli-devin + 10x DeepSeek V4 Flash xhigh/cli-opencode) with **no early convergence** | Both lineage state ledgers show 10 completed iterations each under `max-iterations`; no early stop recorded on either track |
| REQ-002 | Answer every research question in `research.md`, each load-bearing claim cited to a source, extending rather than discarding `prior-findings.md` | `research.md` resolves all sub-questions in §3; claims carry sources; prior-findings conclusions are confirmed, refined, or explicitly superseded with evidence |
| REQ-003 | Decide the exact mcp-notion-reads / mcp-obsidian-writes division of labor for each migration step | Verdict maps each migration step (inventory, import, relation reconstruction, file/attachment carry-over, comment carry-over, view reconstruction, verification) to the tool(s) that perform it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-004 | Map what survives an import automatically versus what needs agent-driven reconstruction | Matrix in `research.md` separates auto-preserved data from data requiring reconstruction, with the reconstruction method named per item |
| REQ-005 | Capture file/attachment upload, comment, and multi-view database handling | Each of the three is documented with a verified path (or a documented gap) through mcp-notion/mcp-obsidian |
| REQ-006 | Name every Obsidian plugin required to close a feature gap, with install/config notes | Plugin list is ranked required-vs-optional against `mcp-obsidian`'s existing plugin knowledge |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20 iterations completed (10 per track) with convergence detection off; per-iteration evidence exists under both `research/lineages/glm/iterations/` and `research/lineages/deepseek/iterations/`.
- **SC-002**: `research.md` contains a decided, ranked flawless-migration method ready to hand to phase 002+ with no open design question.
- **SC-003**: The mcp-notion-reads / mcp-obsidian-writes division of labor, the relation/rollup/formula recovery path, and the required-plugin list are all captured and cited.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin (GLM-5.2 High) | Wrong flags/env → failed fanout or wrong model | Read `cli-devin/SKILL.md` first; apply its fanout flag/env |
| Dependency | cli-opencode (DeepSeek V4 Flash xhigh, Cline) | Wrong flags/env → hung or misrouted fanout | Read `cli-opencode/SKILL.md` first; apply `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` for dispatched children |
| Dependency | `/deep:research` state machine | Manual state drift | Use the loop's externalized state; no manual `/tmp` state; no direct `@deep-research` dispatch |
| Risk | Two-track fanout may finish tracks at different iteration counts | Skewed synthesis | Verify both ledgers reach 10/10 before synthesizing |
| Risk | WebFetch blocklist / rate limits | Missing sources | Fall back to WebSearch + cached docs; widen queries |
| Risk | Notion API importer is comparatively new; relations/rollups flagged "verify" upstream | Overstated parity claims | Treat imported relational data as suspect until independently verified per `prior-findings.md` §1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open at scaffold time. The prior single-pass research note resolved the importer-choice question provisionally; this phase's job is to verify it exhaustively and resolve the remaining sub-questions (files, comments, views, tool division of labor, required plugins).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

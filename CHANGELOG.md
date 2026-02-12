# Changelog

All notable changes to the OpenCode Dev Environment are documented in this file.
Public Release: https://github.com/MichelKerkmeester/opencode-spec-kit-framework

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [**2.0.0.3**] - 2026-02-12

**Frontmatter Audit** — Verified all 9 skill YAML frontmatter blocks against Claude Code spec. Trimmed verbose descriptions on 2 skills and added `argument-hint` to 1 skill.

---

### Changed

1. **`system-spec-kit` SKILL.md** — Trimmed `description` from ~430 to ~220 chars to reduce system prompt token usage
2. **`workflows-documentation` SKILL.md** — Trimmed `description` from ~290 to ~200 chars for the same reason

### Added

1. **`workflows-git` SKILL.md** — Added `argument-hint: "[worktree|commit|finish]"` for improved user discoverability

---

**Files:** 3 SKILL.md files updated, 3 skill CHANGELOGs updated

---

## [**2.0.0.2**] - 2026-02-11

**Documentation — Spec Kit Internal READMEs** — Created 4 internal README files documenting Spec Kit Memory subsystems (scoring, utils, types, tools) and updated 1 existing README with project styling conventions.

---

### Added

1. **`shared/scoring/README.md`** — Documents composite folder scoring formula, 8 function exports, 5 constants, design decision references (D1/D2/D4/D7/D8)
2. **`shared/utils/README.md`** — Documents path-security (CWE-22/59/78 prevention) and retry (exponential backoff with error classification) utilities
3. **`scripts/types/README.md`** — Documents 16 session type interfaces across 4 sections, type architecture diagram, `SessionData` root type
4. **`mcp_server/tools/README.md`** — Documents 22-tool dispatch architecture, ASCII flow diagram, 5 domain tables (L1–L7), tool extension guide

### Changed

1. **`mcp_server/tests/README.md`** — Added emoji section headers (37 headers) to match project styling conventions

---

**Files:** 5 files (4 created, 1 updated)

---

## [**2.0.0.1**] - 2026-02-11

**Pre-Release Security Audit & Public Release Preparation** — Comprehensive 27-agent security sweep across all 9 skills, 18 commands, and 8 agents. Scrubbed sensitive content from **40+ files**, applied **200+ replacements**, fixed version misalignments, dead links, and stale references. Build documentation added for first-time users.

---

### Changed

1. **Sensitive Content Scrubbed** — 200+ `anobel.com` domain references replaced with `example.com` across 23 files in `workflows-code--web-dev`. Personal paths, names, and domain references removed from `PUBLIC_RELEASE.md`, `AGENTS.md`, `CHANGELOG.md`, and 2 command files
2. **Version Alignment** — `mcp-code-mode` SKILL.md version corrected `1.2.0` → `1.1.0.3`. `mcp-figma` SKILL.md version corrected `1.0.0` → `1.1.0.1`
3. **Root README.md Accuracy** — Skill count `8` → `9`, script count `244` → `90`, removed phantom `/search:*` commands, MCP servers `4` → `3`, database path corrected
4. **Build Documentation Added** — "Building from Source" section added to root `README.md` explaining `npm install && npm run build` for first-time users (compiled `dist/` directories are gitignored)
5. **`workflows-code--web-dev` SKILL.md** — Skill name corrected from `workflows-code` → `workflows-code--web-dev`
6. **`workflows-git`** — 26 dot-vs-underscore naming fixes across 3 files. CHANGELOG stale file list updated to actual 10 files
7. **`workflows-chrome-devtools`** — 8 broken cross-references fixed, 9 `anobel.com` references replaced across 4 example scripts

### Fixed

8. **`skill_advisor.py` Dual-Threshold Bug** — CLI `--threshold` flag was applying dual-threshold validation (confidence + uncertainty) instead of confidence-only filtering. Fixed to use simple confidence threshold when `--threshold` is explicitly set
9. **Constitutional Memory References** — 2 broken file paths in `constitutional/README.md` fixed (`save_workflow.md`, `trigger_config.md`). Stale file listing updated to include `speckit-exclusivity.md`
10. **Dead Install Guide Links** — 3 dead links in `mcp-figma` and 1 in `mcp-code-mode` redirected to local `INSTALL_GUIDE.md`. `mcp-code-mode` INSTALL_GUIDE: 21 dot-vs-underscore naming patterns fixed
11. **`.gitignore` Hardened** — Added `*.sqlite3`, `*.db`, `*.cert`, `__pycache__/` patterns. 5 `.DS_Store` files deleted from skill directories
12. **`system-spec-kit` README.md** — Script count `244` → `90`, LOC `~1075` → `~1350`
13. **`workflows-code--full-stack` CHANGELOG** — Asset count `30` → `42`
14. **Install Guide Links** — 3 broken `MCP/` path prefixes removed from `create/install_guide.md`. `SET-UP` guide: 13 duplicate lines removed

---

**Files:** `AGENTS.md` · `PUBLIC_RELEASE.md` · `CHANGELOG.md` · `.gitignore` · `README.md` · `.opencode/command/` (2 files) · `.opencode/scripts/skill_advisor.py` · `.opencode/skill/system-spec-kit/` (3 files) · `.opencode/skill/mcp-figma/` (2 files) · `.opencode/skill/mcp-code-mode/` (2 files) · `.opencode/skill/workflows-code--web-dev/` (23 files) · `.opencode/skill/workflows-chrome-devtools/` (4 files) · `.opencode/skill/workflows-git/` (3 files) · `.opencode/skill/workflows-code--full-stack/` (1 file) · `.opencode/install_guides/` (2 files)

---

## [**2.0.0.0**] - 2026-02-11

**Spec Kit Memory: JavaScript → TypeScript migration** — Complete rewrite of the MCP server from JavaScript to TypeScript across **16 spec folders** (092-107), delivering **186+ files converted**, **85+ critical bugs fixed**, **3,872 tests passing**, and **303 documentation fixes**.

> Spec folder: `specs/003-memory-and-spec-kit/` (specs 092-107, Levels 2-3)

---

### Added

1. **TypeScript Infrastructure** — `tsconfig.json` with project references for 3 workspaces (`shared/`, `mcp_server/`, `scripts/`), `shared/types.ts` central type definitions, `sqlite-vec.d.ts` native extension declarations. CommonJS output preserves backward compatibility
2. **1,589 New Tests** (spec 100) — Achieved 100% module export coverage across 26 test files, including 48 FTS5 SQL injection security tests. Test suite grew from ~700 to **3,872 tests** across 114 test files
3. **Memory Save Auto-Detect** (spec 097) — 5-priority detection cascade for spec folder resolution: explicit path → Gate 3 context → recent spec → cwd → ask user. Streamlines the memory save workflow

### Changed

4. **186+ Source Files Converted** (spec 092) — All `.js` source files in `shared/`, `mcp_server/`, and `scripts/` converted to TypeScript with full type annotations. 21 migration phases. CommonJS output unchanged — zero runtime behavior changes, all `require()` paths preserved
5. **Type Safety Hardened** — `@ts-nocheck` removed from 96 test files with ~1,100 type errors resolved (spec 103). Unsafe casts reduced from 48 → 3 (spec 099). 199 `: any` remaining (tracked, non-critical)
6. **Documentation Accuracy** (specs 106-107) — 20-agent parallel audit identified ~120 critical issues. 303 fixes applied across ~45 files: phantom file references removed, stale counts updated, 39 mcp-narsil references purged, all import extensions corrected
7. **Code-Documentation Alignment** (specs 101-102) — 36-finding misalignment audit followed by full remediation. Doc-code alignment improved from 67.9% → 95.5%. ADR-008 written
8. **18 Command Files Updated** (specs 092, 102) — 23 path references fixed across 15 command/asset files for TS migration (spec 092). 6 `spec_kit/` commands enhanced with `memory_context` integration and standardized quality gates (spec 102). 5 obsolete commands removed: `search/{code,index}.md`, `memory/{checkpoint,database,search}.md`
9. **`workflows-code--opencode` Skill Overhauled** (v1.1.0 → v1.3.2) — 4 new TypeScript reference files added, 645 code standard violations audited across 136 files, template alignment for 22 skill files, 17 broken router references fixed. Established TypeScript coding standards for the entire project

### Fixed

10. **85+ Bugs Fixed** (spec 096) — 8 CRITICAL: FSRS decay formula 18.45x error, macOS SQLite crash, database no-op writes. Plus 27 regression tests added
11. **12 Non-Functional Features Restored** (spec 098) — 10 P0 + 18 P1 issues resolved across the MCP server. Features that had silently broken during development restored to working state
12. **Memory Index Reliability** (spec 093) — Indexing success rate improved from 129/244 → 240/245. 2 root-cause bugs fixed. FSRS v4 decay formula corrected
13. **196 TypeScript Type Errors** (spec 094) — 5 P0 + 14 P1 bugs from 20-agent parallel code review. Zero `tsc` errors achieved
14. **Database Re-Indexed** (spec 099) — Memory database re-indexed from 85 → 261 memories. 75 new tests. Deprecated types preserved for backward compatibility

### Current State

- **Build:** `tsc --noEmit` PASS (0 errors)
- **Tests:** 3,872 passing, 71 skipped, 114/118 suites (4 skipped)
- **Source:** 204 `.ts` files, 0 `.js` source files in MCP server
- **LOC:** 68,134 source + 40,072 tests = 108,206 total
- **Type Safety:** 0 `@ts-nocheck`, 199 `: any` remaining

---

**Files:** `.opencode/skill/system-spec-kit/` (entire skill directory — 204+ source files, 118 test files)

---

## [**1.3.3.0**] - 2026-02-11

**Claude Code integration & orchestrate improvements:** Created **8 Claude Code subagent files** in `.claude/agents/` (converting symlinks to standalone files with YAML frontmatter), added **Tool Call Budget (TCB)** system to orchestrate.md, and reduced orchestrate.md from **892 → 758 lines** through section consolidation.

---

### Added

1. **Claude Code Subagent Conversion** — Duplicated all 8 OpenCode agent files (`context`, `debug`, `handover`, `orchestrate`, `research`, `review`, `speckit`, `write`) to `.claude/agents/` with Claude Code-compatible YAML frontmatter (`name`, `description`, `tools`, `model`, `mcpServers`). Previous symlinks replaced with standalone files. Body content byte-identical to OpenCode source. All agents configured with `spec_kit_memory` and `code_mode` MCP servers. Model assignments: `opus` for orchestrate/research/debug/review, `sonnet` for context/speckit/write/handover. `permissionMode: plan` for review (read-only agent)
2. **Tool Call Budget (TCB)** — New §26 in orchestrate.md with 3-layer defense against runaway agent dispatches: estimation heuristic table, thresholds (1–8 safe, 9–12 caution, 13+ must split), batch sizing rule, Agent Self-Governance Footer for mid-flight scope reporting, and "Aborted Task Recovery" 6-step protocol in §14. TCB estimation field added to task decomposition (§10) and PDR templates

### Changed

3. **orchestrate.md Bloat Reduction (15%)** — Reduced from 892 → 758 lines and 31 → 26 sections through targeted merges: §3+§4+§15 → unified §3 (Agent Routing), §25+§26+§27+§28 → unified §23 (Context Window Budget), §26 (Output Verification) absorbed into §23. Compressed §2 (Capability Scan), §8 (Command Suggestions), §30 (Related Resources). All ~32 internal `§N` cross-references renumbered with zero stale references verified
4. **Claude Code orchestrate.md Sync** — `.claude/agents/orchestrate.md` body replaced with updated OpenCode source (post-TCB, post-bloat-reduction). Claude Code YAML frontmatter preserved

---

**Files:** `.claude/agents/context.md` · `.claude/agents/debug.md` · `.claude/agents/handover.md` · `.claude/agents/orchestrate.md` · `.claude/agents/research.md` · `.claude/agents/review.md` · `.claude/agents/speckit.md` · `.claude/agents/write.md` · `.opencode/agent/orchestrate.md`

---

## [**1.3.2.0**] - 2026-02-11

**Governance & routing:** Established @speckit exclusivity rule for spec folder documentation, added orchestrator parallel ceiling, renamed @context_loader → @context, and reduced @context dispatch limits.

---

### Added

1. **@speckit Exclusivity Rule** — New enforcement system ensuring ONLY `@speckit` can create/write documentation (`*.md`) inside spec folders. Constitutional memory #280 created with 29 trigger phrases. Enforcement across 5 layers: constitutional memory, `orchestrate.md`, `AGENTS.md`, individual agent files, and skill documentation. Four exceptions: `memory/` (uses `generate-context.js`), `scratch/` (any agent), `handover.md` (`@handover` only), `research.md` (`@research` only). 10 files modified across agents, skills, and framework docs
2. **Orchestrator Default Parallel Ceiling** — New default maximum of 3 agents dispatched simultaneously in `orchestrate.md`. Previously unlimited (up to 4). Ranges 4–9 and 10–20 require explicit user override. Updated §13 (parallel table + ceiling paragraph), §23 (summary), §25 (scaling heuristics), §27 (scale thresholds), §28 (collection patterns). Escape clause: "unless user explicitly requests more"

### Changed

3. **@context_loader → @context Rename** — Agent file renamed from `context_loader.md` to `context.md`. Display name changed from "The Context Loader" to "The Context Agent". 78 references updated across 14 files — zero remaining references verified
4. **@context Dispatch Limits Reduced** — Reduced maximum dispatch limits: `medium` from 2→1, `thorough` from 3→2 (`quick` unchanged at 0). Escape clause added: "User can explicitly request higher limits"

---

**Files:** `.opencode/agent/context.md` · `.opencode/agent/orchestrate.md` · `.opencode/agent/speckit.md` · `.opencode/agent/write.md` · `.opencode/agent/research.md` · `.opencode/agent/handover.md` · `.opencode/agent/review.md` · `.opencode/agent/debug.md` · `AGENTS.md` · `CHANGELOG.md` · `README.md` · `PUBLIC_RELEASE.md` · `.opencode/install_guides/SET-UP - Opencode Agents.md` · `.opencode/skill/workflows-documentation/assets/opencode/agent_template.md` · `.opencode/skill/system-spec-kit/constitutional/speckit-exclusivity.md` · `.opencode/skill/system-spec-kit/SKILL.md` · `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` · `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`

---

## [**1.3.1.0**] - 2026-02-10

**Prompt compression:** Compressed `@context` agent from **717 → 434 lines (39.5% reduction)**, completing the fleet-wide optimization started in v1.3.0.0. All 8 agents now compressed.

---

### Changed

**context.md (39.5% reduction: 717 → 434 lines)**

1. **Removed 2 Mermaid diagrams** — S1 workflow diagram (~67 lines) and S4 layer diagram (~25 lines). Textual descriptions retained
2. **Removed ASCII boundary box** — S5 dispatch boundary illustration (~15 lines). Rules preserved in dispatch protocol text
3. **Removed Iron Rules table** — S8 10-row table replaced by deduplicated ALWAYS/NEVER/ESCALATE lists
4. **Replaced ASCII summary** — S11 50-line ASCII box → 5-line text summary (matching other agents' format)
5. **Compressed anti-patterns** — S9 table from 13 → 10 rows (removed entries that inverted S8 rules)
6. **Tightened S7 orchestrator integration** — Kept dispatch trigger table and CWB compliance, removed redundant text

---

**Files:** `.opencode/agent/context.md`

---

## [**1.3.0.0**] - 2026-02-10

**Agent fleet overhaul:** Created `@context` agent, established Two-Tier Dispatch architecture, added FAST PATH to all 6 work agents, removed dead code, standardized models, and compressed all agent prompts by **23.1%** (5,176 → 3,982 lines).

> Spec folder: `004-agents/007-explore-sub-agent` (Level 2)

---

### Added

**@context Agent**

1. **Context retrieval agent** — Created `.opencode/agent/context.md` (716 lines). Specialized context scout with 3 thoroughness levels (quick/medium/thorough), Memory MCP integration, and structured Context Package output
2. **Two-Tier Dispatch Model** — Phase 1: `@context` gathers context → Phase 2: orchestrator dispatches implementation agents with that Context Package. Eliminates redundant exploration across agents
3. **@explore prohibition (Rule 4)** — `orchestrate.md` §6 now prohibits direct `@explore` dispatch. Only `@context` can internally dispatch the built-in `@explore` subagent type

**FAST PATH System**

4. **Low-complexity bypass** — Added `§1.1 FAST PATH & CONTEXT PACKAGE` section to all 6 work agents (`research`, `write`, `review`, `debug`, `speckit`, `handover`). Low-complexity tasks skip ceremony; agents pre-loaded with Context Package skip Layer 1 memory checks
5. **Complexity signaling** — Added `Complexity: [low|medium|high]` field to `orchestrate.md` §11 Task Decomposition Format with estimation heuristic table. Agents use this to decide FAST PATH vs full workflow

### Changed

**orchestrate.md (39.7% reduction: 1,316 → 793 lines)**

1. **Aggressive prompt compression** — Compressed §17 Circuit Breaker, §19 Saga, §20 Caching, §22 Checkpointing, §23 Summary, §24 Mermaid (Phase 1b: −165 lines), then §28, §7, §27, §14, §5, §4, §12, §16, §21, §30 (Phase 1c: −361 lines)
2. **@context integration** — All `@explore` dispatch references replaced with `@context`. Agent Selection Matrix and Routing Logic updated
3. **Complexity field in PDR** — Pre-Delegation Reasoning format now includes complexity line

**research.md (42.4% reduction: 793 → 457 lines)**

4. **Prompt trimming + FAST PATH** — Aggressive compression with low-complexity bypass added

**write.md (59.2% reduction: 847 → 346 lines)**

5. **Largest reduction** — Most aggressive trimming of all agents

**review.md (50.6% reduction: 810 → 400 lines)**

6. **Prompt trimming + FAST PATH** — Aggressive compression with low-complexity bypass added

**debug.md (38.0% reduction: 703 → 436 lines)**

7. **Prompt trimming + FAST PATH** — Aggressive compression with low-complexity bypass added

**speckit.md (24.5% reduction: 649 → 490 lines)**

8. **Prompt trimming + FAST PATH** — Moderate compression with low-complexity bypass added

**handover.md (+2.4%: 336 → 344 lines)**

9. **FAST PATH added** — Grew slightly due to new section (already the smallest agent)

**Model standardization**

10. **All agents → `github-copilot/claude-*`** — Heavy agents (research, review, debug) use `claude-opus-4.6`. Lighter agents (write, speckit, handover, context) use `claude-sonnet-4.5`. Orchestrate has no model (primary mode, delegates only)

### Removed

1. **Dead Coordinator Mode** — Removed §9-§10 from `research.md` (coordinator/worker dispatch code). Agent has `task: deny` so this was unreachable dead code
2. **Dead Worker Mode** — Removed §4-§5 from `debug.md` (coordinator/worker dispatch code). Same reason: `task: deny` makes it unreachable

---

**Files:** `.opencode/agent/context.md` (new) · `.opencode/agent/orchestrate.md` · `.opencode/agent/research.md` · `.opencode/agent/write.md` · `.opencode/agent/review.md` · `.opencode/agent/debug.md` · `.opencode/agent/speckit.md` · `.opencode/agent/handover.md`

---

## [**1.2.5.0**] - 2026-02-07

**workflows-code--opencode** skill v1.3.0→v1.3.1: Post-TypeScript-migration alignment audit + full remediation across **136 files** (645 violations found), template alignment for **22 skill files**, router correction (**17 section references** fixed).

---

### Changed

1. **Phase 17 alignment audit** — Bi-directional audit between system-spec-kit codebase and workflows-code--opencode skill. 10 Opus agents found 645 violations (166 P0, 398 P1, 81 P2) across 136 files
2. **Track A: 9 skill updates** — Fixed TS header template (`====` → `----`), 22 evidence citations (`.js` → `.ts`), file counts (206 JS → ~65 JS + ~341 TS), rebuilt MCP server + scripts directory diagrams, added 5 new documentation sections (DB exception, block-comment dividers, test exemptions, mixed JS/TS, tsconfig outDir)
3. **Track B: 6 code fixes** — Removed `'use strict'` from 98 .ts files, renamed snake_case → camelCase in embedding system (13 files), created `shared/index.ts` barrel file, fixed shell strict mode (3 scripts), renamed 6 snake_case keys in `filters.jsonc` + consumers, verified TS headers
4. **Template alignment** — Aligned 7 reference/asset files with `workflows-documentation` templates (OVERVIEW sections, emoji headers, renumbering)
5. **Router correction** — Fixed 17 broken section references in SKILL.md Use Case Router, removed phantom Python argparse entry, corrected 2 Shell entries pointing to wrong file

> See `workflows-code--opencode/CHANGELOG.md` v1.3.0 + v1.3.1 for full details.

---

## [**1.2.4.1**] - 2026-02-07

**workflows-code--web-dev** skill: inline comment style enforcement across **10 files** (~200 edits), router completeness fixes, dead file removal.

---

### Changed

1. **Inline comment style enforcement** — ~200 WHAT→WHY comment fixes across 5 `.js` assets and 5 `.md` reference docs
2. **SKILL.md router** — Added `SCHEDULING` and `THIRD_PARTY` keyword groups; added routing for `async_patterns.md` and `third_party_integrations.md`

### Deleted

3. **`bundling_patterns.md`** — Removed (unreferenced, no routing, no keyword triggers)

> See `workflows-code--web-dev/CHANGELOG.md` v1.0.9.2 for full details.

---

## [**1.2.4.0**] - 2026-02-06

Adds **Context Window Budget (CWB)** system to the orchestrate agent, preventing context overflow when dispatching 5-20 sub-agents in parallel. Four new sections, nine cross-section updates.

> Spec folder: `004-agents/006-orchestrate-context-window` (Level 3+)

---

### Added

**Context Window Budget System (§27)**

1. **Budget formula** — `available_budget = context_window - system_overhead - conversation_history - agent_definition` with conservative defaults (~150K tokens available for results)
2. **Scale thresholds** — Four tiers: 1-4 agents (direct/full), 5-9 (summary-only, 30 lines), 10-15 (file-based + waves of 5), 16-20 (file-based + waves of 5)
3. **Pre-dispatch checklist** — Mandatory CWB check for 5+ agent dispatches before any Task tool calls
4. **Enforcement points** — CWB validated at Step 5 (CWB CHECK), Step 6 (DELEGATE), and Step 9 (SYNTHESIZE)

**Result Collection Patterns (§28)**

5. **Pattern A: Direct Collection** — 1-4 agents, full results (up to 8K tokens each), no special handling
6. **Pattern B: Summary-Only** — 5-9 agents, max 30 lines (~500 tokens) per agent, all dispatched at once
7. **Pattern C: File-Based + Wave Batching** — 10-20 agents write to scratchpad files, return 3-line summary, dispatched in waves of 5 with synthesis between waves
8. **Background Agent Variant** — Alternative for Pattern C using `run_in_background: true` for maximum wall-clock parallelism
9. **Wave Synthesis Protocol** — 5-step compression flow between waves (review → extract → compress → release → dispatch next)
10. **"The Context Bomb" anti-pattern** — Documents the exact failure scenario: 10-20 agents complete, all results return simultaneously, context overflow, all work lost

**Anti-Patterns Section (§29)**

11. **Six documented anti-patterns** — Including "Never dispatch 5+ agents without CWB check", "Never accept sub-agent output blindly", "Never let sub-orchestrators return raw sub-agent outputs"

**Related Resources Section (§30)**

12. **Commands, Skills, and Agents reference tables** — Cross-references to all related OpenCode components

---

### Changed

**Core Workflow (§1)**

- Added step 5 **CWB CHECK** between DECOMPOSE and DELEGATE; renumbered steps 5→6 through 9→10
- Updated mermaid diagram with CWB CHECK node (gate styling)

**Sub-Orchestrator Pattern (§5)**

- Added **Context Budget** constraint: sub-orchestrators MUST compress results before returning to parent
- Added **Return Size Rule** subsection with max return sizes by sub-orchestrator scale (2-4K tokens)

**Resource Budgeting (§9)**

- Added **Orchestrator Self-Budget** subsection with budget component table (~25K overhead + ~15K agent def + ~10K history = ~150K available)

**Task Decomposition Format (§11)**

- Added **Output Size** field: `[full | summary-only (30 lines) | minimal (3 lines)]`
- Added **Write To** field: `[file path for detailed findings | "none"]`
- Added CWB Fields explanation block (mandatory for 5+ agent dispatches)

**Parallel vs Sequential (§13)**

- Renamed to "PARALLEL VS SEQUENTIAL ANALYSIS" with "(with CWB Ceiling)" subtitle
- Added **CWB CEILING** paragraph: parallel within waves, sequential between waves
- Added **Agent Count / Parallel Behavior** table

**Circuit Breaker (§17)**

- Added **"Context budget exceeded"** to edge cases: stop dispatching, synthesize current results, report to user
- Added **Context Overflow Protection** subsection with 4-step emergency protocol

**Context Preservation (§21)**

- Added **Agent dispatches (5+)** and **Context pressure** rows to health monitoring table
- Added proactive vs reactive note: CWB should be proactive (pre-dispatch), not reactive (post-overflow)

**Summary (§23)**

- Added Context Window Budget to Advanced Features
- Updated Parallel-First to show CWB ceiling with wave sizes by tier
- Added CWB enforcement to Limits

**Scaling Heuristics (§25)**

- Added **Collection Pattern (§28)** column mapping task types to patterns A/B/C
- Added **Est. Return per Agent** column with token estimates per tier

### Fixed

- **AGENTS.md** — Stale "Gate 4 Option B" → "Gate 3 Option B" in agent routing table; removed duplicate line in skill maintenance section

---

### Dependencies

- `opencode-antigravity-auth` — 1.4.3 → 1.4.5
- `@opencode-ai/plugin` — 1.1.51 → 1.1.53

**Validation:** `validate_document.py` PASSED · DQI 95/100 (EXCELLENT) · 20-agent mental simulation PASSES (~3K tokens vs ~160K old approach)

**Files:** `.opencode/agent/orchestrate.md` · `AGENTS.md` · `opencode.json` · `.opencode/package.json`

---

## [**1.2.3.0**] - 2026-02-05

Ecosystem-wide remediation: **3 critical bugs** fixed, **SQLite schema unified** (migration v12), **gate numbering standardized**, **AGENTS.md naming migration** across 59 files, and **signal handler cleanup**.

> Spec folders: `087-speckit-deep-analysis` (Level 3+) · `088-speckit-known-limitations-remediation` (Level 2)

---

### Fixed

**Critical Bug Fixes (Spec 087)**

1. **`CREATE_LINKED` SQL constraint violation** — `memory_conflicts` table CHECK constraint rejected valid `CREATE_LINKED` PE decisions, silently losing conflict tracking data. Added `CREATE_LINKED` to both migration v4 schema and `create_schema()`.
2. **Ghost tool references in speckit.md** — Agent tool layers table referenced 2 non-existent tools (`memory_drift_context`, `memory_drift_learn`) and showed wrong 5-layer architecture. Rewritten to correct 7-layer, 22-tool architecture.
3. **Stale SKILL.md cross-references** — 5 references to renamed file corrected, plus stale section numbers fixed.

**SQLite Schema Unification (Spec 088 — KL-1)**

4. **Three conflicting DDL schemas unified** — `memory_conflicts` table had 3 different DDL definitions with incompatible column names (`similarity_score` vs `similarity`, `notes` vs `reason`), causing both INSERT paths to silently fail.
5. **Migration v12** — DROP+CREATE rebuilds `memory_conflicts` with unified 14-column schema. `SCHEMA_VERSION` bumped from 11 to 12.
6. **Column renames** — `similarity_score` → `similarity`, `notes` → `reason` in `memory-save.js` and `prediction-error-gate.js`.
7. **Silent error swallowing removed** — Both INSERT callers had try/catch that suppressed `no such column` errors, masking the schema mismatch. Now logs via `console.error()`.
8. **`ensure_conflicts_table()` deprecated** — Converted to no-op (still exported for backward compatibility).

**Gate Numbering Standardization (Spec 087 + 088 — KL-2)**

9. **Constitutional gate-enforcement.md** — Full gate renumbering aligned with AGENTS.md (Gate 1=Understanding, Gate 2=Skill Routing, Gate 3=Spec Folder).
10. **Stale Gate 4/5/6 references** — Removed from 7 active files: `orchestrate.md`, `AGENTS.md`, `scripts-registry.json`, `scripts/README.md`, `check-completion.sh`, `save.md`, `INSTALL_GUIDE.md`.
11. **Legacy install guide** — `SET-UP - AGENTS.md` gate section rewritten from old 7-gate scheme to current 3-gate + 3 behavioral rules.

**Signal Handler Cleanup (Spec 088 — KL-4)**

12. **`toolCache.shutdown()`** — Added to SIGINT, SIGTERM, and uncaughtException handlers in `context-server.js`.
13. **Duplicate handlers removed** — `access-tracker.js` SIGINT/SIGTERM handlers removed (now handled centrally by `context-server.js`).

**Documentation & Test Fixes (Spec 088 follow-up)**

14. **`schema-migration.test.js`** — Updated column names (`similarity_score` → `similarity`, `notes` → `reason`).
15. **`decision-format.md`** — Gate numbers reordered to match AGENTS.md.
16. **`search/README.md`** — Schema version references updated (v11 → v12).
17. **`epistemic-vectors.md`** — Gate 2 → Gate 1 for dual-threshold validation reference.

---

### Changed

**AGENTS.md Naming Migration (Spec 087 — Phase 2)**

Standardized project instructions filename to `AGENTS.md` across the entire ecosystem. `CLAUDE.md` symlink provides Claude Code auto-load compatibility.

- **59 files** updated with ~218 replacements
- Scope: commands, agents, skills, scripts, YAML assets, references, install guides, spec folders
- Verification: `grep -r "CLAUDE\.md" .opencode/` returns 0 matches

**Moderate Misalignment Fixes (Spec 087)**

- **speckit.md** — Added 4 missing `/spec_kit:*` commands (debug, handover, implement, research) + 3 undocumented scripts to Capability Scan
- **SKILL.md** — Added 3 scripts (archive.sh, check-completion.sh, recommend-level.sh) to Key Scripts
- **Template file counts** — Standardized across speckit.md, SKILL.md, README.md to match actual filesystem (L1: 5 files, L2: 6, L3: 7, L3+: 7)
- **AGENTS.md** — Added tool prefix convention note, confidence threshold clarification, two save pathways note
- **skill_advisor.py** — Boosted memory/context intent scores (now passes 0.8 threshold); reduced ambiguous "debug" boost (1.0 → 0.6)
- **opencode.json** — Documented shared-DB architecture (ADR-003)
- **Command section references** — Fixed stale section numbers in complete.md, implement.md, resume.md, research.md, plan.md

**Files Changed:** 41 files across `.opencode/` framework + 2 project-root files

---

## [**1.2.2.2**] - 2026-02-04

Fixes **5 bugs** in Spec Kit Memory MCP server improving embedding reliability and error handling.

---

### Fixed

**MCP Server Bug Fixes**

1. **Background retry job** — Now starts automatically on MCP startup (was never called)
2. **Dimension validation** — Detects provider/database dimension mismatch on startup
3. **Fallback warmup** — Handles warmup errors gracefully in factory.js
4. **Document embedding** — Retry manager uses correct task prefix for Nomic model
5. **Model timeout** — Prevents infinite hang on corrupted ONNX cache (2-min timeout)

**Files:** `context-server.js` · `vector-index.js` · `retry-manager.js` · `factory.js` · `hf-local.js`

---

### Changed

- `.utcp_config.json` — Simplified ClickUp MCP config

---

## [**1.2.2.1**] - 2026-02-04

### Changed

**AGENTS.md Structure & Efficiency Improvements**

Major restructuring of AGENTS.md for better organization and reduced verbosity while preserving actionable guidance.

1. **Section 2 Restructure** — Embedded VIOLATION RECOVERY box with Self-Check directly in POST-EXECUTION RULES (no longer separate sections)
2. **New Section 3: OPERATIONAL PROTOCOLS** — Consolidated operational content:
   - Consolidated Question Protocol (multi-question format with round-trip optimization)
   - Gate Bypass Phrases
   - Compliance Checkpoints
   - Common Failure Patterns
3. **Section 6 Condensed (~50% shorter)** — REQUEST ANALYSIS & SOLUTION FRAMEWORK streamlined:
   - Compact 5-line Solution Flow (was 18-line ASCII diagram)
   - Core Principles as table with Anti-Patterns column
   - Single 7-item Pre-Change Checklist (was two redundant checklists)
   - Preserved: CLARITY Triggers, BIAS Reframe Technique, Citation format
4. **Section Renumbering** — All sections after new §3 renumbered (3→4, 4→5, etc.)

**Consolidated Question Protocol Enhancement:**
```markdown
**Before proceeding, please answer:**

1. **Spec Folder** (required): A) Existing | B) New | C) Update | D) Skip
2. **Execution Mode** (if applicable): A) Autonomous | B) Interactive
3. **Memory Context** (if existing spec): A) Load recent | B) Load all | C) Skip

Reply with answers, e.g.: "B, A, C"
```

**Files:** `AGENTS.md` (Public, project-site, project/coder)

---

## [**1.2.2.0**] - 2026-02-04

### Added

**AGENTS.md Coding Analysis Lenses**

New coding-focused analysis framework integrated into AGENTS.md for improved code quality decisions.

1. **6 Coding Lenses** — CLARITY (simplicity), SYSTEMS (dependencies), BIAS (wrong problem), SUSTAINABILITY (maintainability), VALUE (actual impact), SCOPE (complexity matching)
2. **6 Anti-Patterns** — Over-engineering, Premature optimization, Cargo culting, Gold-plating, Wrong abstraction, Scope creep with trigger phrases and responses
3. **Solution Flow Integration** — Added SYSTEMS → BIAS → SCOPE lens steps to request analysis workflow
4. **Enhanced Simplicity First** — CLARITY lens triggers requiring justification before proceeding
5. **LENS VALIDATION** — New checklist section in PRE-CHANGE VALIDATION
6. **Extended Failure Patterns** — Patterns 17-20 with lens-based detection

### Changed

**Threshold Alignment**

- Renamed "Legacy thresholds" to "Simple thresholds" for confidence-only queries
- Aligned percentages with dual-threshold: 40-69% PROCEED WITH CAUTION, ≥70% PASS

**Files:** `AGENTS.md`, `AGENTS-v2.md`

---

## [**1.2.1.0**] - 2026-02-04

### Added

**New Skill: workflows-code--opencode**

Multi-language code standards for OpenCode system code (JavaScript, Python, Shell, JSON/JSONC).

1. **SKILL.md orchestrator** — 10-section structure with Use Case Router tables, Quick Reference with code examples
2. **Language-specific style guides** — 4 comprehensive guides:
   - `references/javascript/style_guide.md` — Node.js/ES modules, JSDoc, async patterns
   - `references/python/style_guide.md` — PEP 8, docstrings, type hints
   - `references/shell/style_guide.md` — POSIX compliance, error handling, shebang patterns
   - `references/jsonc/style_guide.md` — Schema references, comment conventions
3. **Universal patterns** — `references/shared/universal_patterns.md` for cross-language consistency
4. **Quality checklist** — `assets/code_quality_checklist.md` for pre-commit validation
5. **skill_advisor.py integration** — INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS for automatic routing

**Use case:** Writing or modifying `.opencode/` system code, MCP servers, scripts, and configurations.

---

### Removed

**Narsil MCP Complete Removal**

Narsil code intelligence MCP has been completely removed from the OpenCode Dev Environment.

1. **Skill deleted** — `.opencode/skill/mcp-narsil/` directory removed entirely
2. **Configuration cleaned** — Removed from `.utcp_config.json`, `.env.example`, `.gitignore`
3. **Documentation updated** — All AGENTS.md, agent files, skill files, and command files updated
4. **Code search simplified** — Replaced with `Grep()` for text, `Glob()` for files, `Read()` for content
5. **skill_advisor.py updated** — Removed all mcp-narsil INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS

**Reason:** Simplifying the tool stack by removing unused code intelligence integration.

**Migration:** No action required. Code search now uses standard Grep/Glob/Read tools.

---

## [**1.2.0.3**] - 2026-02-03

### Fixed

**System-Spec-Kit Fixes (specs 084, 085)**

Two internal fixes improving memory save reliability and generate-context script stability.

1. **Infrastructure work domain detection** — Memory files now correctly route to infrastructure-related spec folders when working on `.opencode/` files:
   - New `detect_work_domain()` analyzes file paths from observations
   - +40 alignment bonus for folders matching infrastructure patterns
   - `/memory:continue` validates `key_files` vs `spec_folder`
   - Fixes: spec-kit work going to project folders (e.g., `005-project-site` instead of `003-memory-and-spec-kit`)

2. **generate-context.js API mismatch** — Fixed `get_db is not a function` error:
   - Added snake_case export aliases to `vector-index.js`
   - Suppressed V2.2 placeholder warnings for unimplemented features

**Files:** `alignment-validator.js`, `continue.md`, `vector-index.js`, `template-renderer.js`

---

## [**1.2.0.2**] - 2026-02-03

### Added

**Documentation Validation: ALL CAPS Section Headers**

New validation rules for `validate_document.py` enforcing uppercase section headers in README and install guide documents.

1. **`h2_not_uppercase` rule** — Validates H2 headers are ALL CAPS
2. **`toc_not_uppercase` rule** — Validates Table of Contents entries match
3. **Auto-fixable** — Use `--fix` flag to automatically correct
4. **Helper functions** — `extract_section_name_text()`, `is_uppercase_section()`

**Files:** `validate_document.py`, `template_rules.json`

---

## [**1.2.0.1**] - 2026-02-03

### Security

**Dependency Updates**

Fixed security vulnerabilities in system-spec-kit dependencies.

1. **hono** — Fixed XSS, arbitrary key read, cache deception, IP spoofing
2. **tar** — Fixed arbitrary file creation/overwrite via hardlink

**Result:** 0 vulnerabilities remaining.

---

## [**1.2.0.0**] - 2026-02-03

The largest release in SpecKit history: **6 specs batched** delivering a complete memory system overhaul with **causal memory graph**, **command consolidation** (9→5 commands, 44% reduction), and **86 bug fixes** across P0-P3 priorities. Implemented by **28+ parallel Opus agents** with comprehensive multi-agent audits.

---

## Highlights

### 🏗️ Memory System Overhaul (Spec 082)
- **Causal Memory Graph** — 6 relationship types (caused, enabled, supersedes, contradicts, derived_from, supports) with depth-limited traversal
- **Session Deduplication** — Hash-based duplicate prevention achieving **50% token savings** on follow-up queries
- **Intent-Aware Retrieval** — 5 intent types (add_feature, fix_bug, refactor, security_audit, understand) with automatic query classification
- **BM25 Hybrid Search** — Pure JavaScript BM25 implementation for lexical search fallback
- **Cross-Encoder Reranking** — Voyage/Cohere/local providers with length penalty optimization
- **Recovery Hints System** — 49 error codes with actionable guidance
- **Schema Migrations v8-v11** — causal_edges, memory_corrections, session_state tables + archival columns

### 📋 Command Consolidation (Spec 083)
- **44% reduction** — 9 commands consolidated to 5
- **`/memory:context`** — Unified entry with intent-aware routing (absorbed search)
- **`/memory:learn`** — Feedback loop with `correct` subcommand (absorbed correct)
- **`/memory:manage`** — Administration with checkpoint subcommands (absorbed database + checkpoint)
- **`/memory:why` removed** — Per user request
- **7 logic bugs fixed** — MCP tool names, intent detection, cross-platform paths

### 🔧 Bug Remediation (Specs 083-085)
- **86 bugs fixed total** — 21 P0, 32 P1, 27 P2, 6 P3
- **30-agent audit** — Spec 084 with 77% false positive filtering (8 confirmed fixes)
- **10-agent parallel fixes** — Spec 085 with 34 bugs across core infrastructure, scoring, extractors, templates
- **YAML path standardization** — `.claude/commands/` → `.opencode/command/` across 7 files
- **Tool prefix corrections** — All commands now use full `spec_kit_memory_` prefix
- **Template inheritance fixes** — Level 3 properly inherits from Level 2

### 📝 Documentation Quality (Spec 004)
- **`validate_document.py`** — New Python validation script with auto-fix capability
- **Template rules** — 5 document types (readme, skill, reference, asset, agent) with severity levels
- **Test suite** — 6 test fixtures, 53 files validated, 0 invalid in main codebase
- **Write agent gate** — VALIDATE FORMAT step (step 8) now mandatory

---

## New MCP Tools (8)

| Tool | Layer | Purpose |
|------|-------|---------|
| `memory_context` | L1 | Unified entry with intent awareness |
| `memory_drift_why` | L6 | Trace causal chain for "why" queries |
| `memory_causal_link` | L6 | Create causal relationships |
| `memory_causal_stats` | L6 | Graph statistics and coverage |
| `memory_causal_unlink` | L6 | Remove causal relationships |
| `task_preflight` | L6 | Epistemic state capture before task |
| `task_postflight` | L6 | Session learning after task |
| `memory_get_learning_history` | L7 | Retrieve learning patterns |

**Total MCP tools: 22** (organized in 7 layers L1-L7)

---

## Database Schema Changes

| Version | Table/Column | Purpose |
|---------|--------------|---------|
| v8 | `causal_edges` | Causal memory graph (6 relation types) |
| v9 | `memory_corrections` | Learning from mistakes, stability tracking |
| v10 | `session_state` | Crash recovery, session persistence |
| v11 | `is_archived`, `archived_at` | 5-state memory model archival |

---

## Files Changed

**68 files** modified across 6 specs:

- **MCP Server** (14 files) — handlers, lib/cognitive, lib/storage, lib/search
- **Memory Commands** (5 files) — context.md, save.md, continue.md, learn.md, manage.md
- **Spec Kit Commands** (7 files) — debug, complete, implement, plan, research, resume, handover
- **YAML Assets** (10 files) — All spec_kit workflow configs
- **New Library Modules** (14 files) — session-manager, causal-edges, bm25-index, cross-encoder, corrections, archival-manager, provider-chain, envelope, recovery-hints
- **Documentation** (12 files) — SKILL.md, README.md, references
- **Tests** (6 files) — causal-edges, cross-encoder, provider-chain, archival-manager, scoring

**Deleted:** 5 command files (search.md, database.md, checkpoint.md, correct.md, why.md)

---

## Upgrade

1. **Restart Required** — Restart OpenCode to load schema migrations (v8→v11)
2. **Command Migration** — Update scripts using old commands:
   - `/memory:search` → `/memory:context`
   - `/memory:database` → `/memory:manage`
   - `/memory:checkpoint` → `/memory:manage checkpoint`
   - `/memory:correct` → `/memory:learn correct`
3. **No Breaking Changes** — Existing memories preserved, legacy patterns work during transition

**Full Changelog**: https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.1.0.1...v1.2.0.0

---

## [**1.1.0.1**] - 2026-01-31

Critical documentation fix for **Code Mode prefixed environment variables**. Updates **2 MCP skills** (mcp-code-mode, mcp-figma) with correct `{manual_name}_{VAR}` format. Also adds **6 skill-level CHANGELOGs** for better change tracking.

---

## Highlights

### 🔧 Prefixed Environment Variables Documentation

- **Critical discovery** — Code Mode requires prefixed env vars: `figma_FIGMA_API_KEY` not `FIGMA_API_KEY`
- **Format pattern** — `{manual_name}_{VAR}` where manual_name comes from `.utcp_config.json`
- **mcp-code-mode updated** — 5 files: env_template.md, config_template.md, configuration.md, SKILL.md, INSTALL_GUIDE.md
- **mcp-figma updated** — 3 files: INSTALL_GUIDE.md, README.md, SKILL.md
- **Troubleshooting added** — New section for "Variable not found" errors

### 📝 Skill-Level CHANGELOGs

- **5 CHANGELOGs created** — mcp-code-mode, mcp-figma, workflows-chrome-devtools, workflows-documentation, workflows-git
- **Retroactive history** — Full version history traced from global CHANGELOG
- **Keep a Changelog format** — Consistent structure across all skills

---

## Files Changed

**mcp-code-mode skill (5 files):**
- `SKILL.md` — Added "Critical: Prefixed Environment Variables" section
- `assets/env_template.md` — Added naming convention section, updated all examples
- `assets/config_template.md` — Added prefixed variable warning
- `references/configuration.md` — Added troubleshooting section
- `INSTALL_GUIDE.md` — Moved to skill root, updated env format

**mcp-figma skill (3 files):**
- `INSTALL_GUIDE.md` — Added Code Mode prefixed variable callout
- `README.md` — Updated environment variables section
- `SKILL.md` — Updated Figma Provider Configuration

**New CHANGELOGs (5 files):**
- `.opencode/skill/mcp-code-mode/CHANGELOG.md`
- `.opencode/skill/mcp-figma/CHANGELOG.md`
- `.opencode/skill/workflows-chrome-devtools/CHANGELOG.md`
- `.opencode/skill/workflows-documentation/CHANGELOG.md`
- `.opencode/skill/workflows-git/CHANGELOG.md`

---

## Upgrade

No action required. Pull latest to get corrected documentation. If you previously set environment variables without prefixes, update your `.env` file:

```bash
# Before (incorrect)
FIGMA_API_KEY=figd_xxx

# After (correct)
figma_FIGMA_API_KEY=figd_xxx
```

**Full Changelog**: https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.1.0.0...v1.1.0.1

---

## [**1.1.0.0**] - 2026-01-29

Major Spec Kit Memory upgrade implementing **cognitive memory** with FSRS algorithm validated on 100M+ users, **30 bug fixes** from comprehensive 10-agent audit, and **20 agent/command files** enhanced with Mermaid diagrams and unified setup patterns.

---

## Highlights

### 🧠 Cognitive Memory System (Spec 079)
- **FSRS power-law decay** — `R(t,S) = (1 + 0.235 × t/S)^(-0.5)` replaces exponential decay
- **Prediction Error Gating** — Prevents duplicates (≥0.95), handles contradictions (0.90-0.94), links related (0.70-0.89)
- **5-state memory model** — HOT/WARM/COLD/DORMANT/ARCHIVED with configurable thresholds
- **Testing Effect** — Accessing memories strengthens them (desirable difficulty bonus)
- **Schema v4 migration** — Additive columns (stability, difficulty, last_review, review_count)

### 🔧 Bug Remediation (Spec 080)
- **30 bugs fixed** — 3 CRITICAL, 8 HIGH, 9 MEDIUM, 10 LOW across 18 files
- **FSRS integration** — Fixed function signature mismatch (FSRS now executes)
- **ReDoS eliminated** — Line-by-line parsing replaces vulnerable regex patterns
- **Threshold fixes** — DORMANT (0.02) and LOW_MATCH (0.50) now differentiated
- **Transaction safety** — SAVEPOINT/ROLLBACK pattern, cache mutex, atomic migrations

### 📝 Agent System Improvements (Spec 005)
- **20 Mermaid diagrams** — Visual workflows for all 7 agents, 7 spec_kit commands, 6 create commands
- **Unified setup pattern** — Create commands refactored from 2-4 interactions to 1 consolidated prompt
- **OUTPUT VERIFICATION** — Added to orchestrate.md, HARD BLOCK section to research.md
- **Naming consistency** — `@documentation-writer` → `@write` (6 instances)

---

## Files Changed

**Spec Kit Memory MCP (18 files):**
- `lib/cognitive/` — fsrs-scheduler.js (NEW), prediction-error-gate.js (NEW), tier-classifier.js, attention-decay.js, co-activation.js, working-memory.js
- `lib/scoring/composite-scoring.js` — Retrievability weight (0.15)
- `lib/search/vector-index.js` — Schema v4, LRUCache methods, cache mutex
- `lib/storage/` — checkpoints.js (SAVEPOINT), history.js (undo check)
- `lib/parsing/` — memory-parser.js (ReDoS fix), trigger-matcher.js (Unicode)
- `handlers/` — memory-save.js (PE gating), memory-search.js (testing effect), memory-crud.js

**Agent System (20 files):**
- `.opencode/agent/` — orchestrate.md, speckit.md, research.md, handover.md, review.md, write.md, debug.md
- `.opencode/command/spec_kit/` — complete.md, plan.md, implement.md, research.md, debug.md, handover.md, resume.md
- `.opencode/command/create/` — agent.md, skill.md, folder_readme.md, install_guide.md, skill_asset.md, skill_reference.md

---

## Upgrade

1. **Restart MCP server** — Schema v4 migration runs automatically on first start
2. **No breaking changes** — Existing memories receive default values (stability=1.0, difficulty=5.0)
3. **FSRS active** — Memory decay now uses validated power-law formula

**Full Changelog**: https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.9.0...v1.1.0.0

---

## [**1.0.9.0**] - 2026-01-26

New **workflows-code--full-stack** skill for multi-stack projects supporting **5 technology stacks** (Go, Node.js, React, React Native, Swift). Existing `workflows-code` renamed to `workflows-code--web-dev` for clarity. **AGENTS.md Section 9** updated to document both skill variants.

---

## Highlights

### ✨ New Skill: workflows-code--full-stack
- **5 technology stacks** — Go, Node.js, React, React Native, Swift with automatic detection
- **Stack detection via marker files** — `go.mod`, `Package.swift`, `app.json`, `next.config.js`, `package.json`
- **Hierarchical structure** — `references/{category}/{stack}/` and `assets/{category}/{stack}/`
- **Smart resource routing** — 7 task keywords, 4 load levels, dynamic resource discovery
- **66 bundled resources** — 36 reference files + 30 asset files (checklists + patterns)

### 📝 Skill Rename: workflows-code → workflows-code--web-dev
- **Clarified scope** — Now explicitly for single-stack web projects (Webflow, vanilla JS)
- **No functional changes** — All references, assets, and patterns remain identical
- **Clear distinction** — Use `--web-dev` for web, `--full-stack` for multi-stack projects

### 🏗️ AGENTS.md Section 9 Update
- **Skills variant table** — Documents both `workflows-code--web-dev` and `workflows-code--full-stack`
- **Corrected stack detection** — Updated markers table (Go, Node.js, React, React Native, Swift)
- **Accurate directory structure** — Reflects actual `{category}/{stack}/` path pattern

---

## Files Changed

**New skill:**
- `.opencode/skill/workflows-code--full-stack/` — Complete skill with 66 resources

**Renamed skill:**
- `.opencode/skill/workflows-code/` → `.opencode/skill/workflows-code--web-dev/`

**Updated:**
- `AGENTS.md` — Section 9 rewritten for skill variants
- `README.md` — Skills Library section updated

---

## Upgrade

1. **Update skill references** — If you reference `workflows-code`, choose the appropriate variant:
   - Web projects (Webflow, vanilla JS): `workflows-code--web-dev`
   - Multi-stack projects: `workflows-code--full-stack`

2. **No breaking changes** — Existing web projects continue working with `--web-dev`

**Full Changelog**: https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.8.5...v1.0.9.0

---

## [**1.0.8.5**] - 2026-01-26

Performance patterns series adding **Phase 0: Research** to workflows-code, **6 new performance references**, and **AGENTS.md Section 9** for multi-stack code implementation guidance. All **27 documents** verified by 5 parallel Opus agents with P0/P1/P2 quality fixes applied.

---

## Highlights

### ✨ Phase 0: Research Stage
- **Pre-implementation analysis** — New optional phase in workflows-code for complex performance work
- **10-agent methodology** — Reference for parallel analysis covering HTML, JS, CSS, third-party, LCP, animations, network
- **Research-first approach** — Prevents "fix symptoms, miss root cause" anti-pattern

### 📝 Performance References (6 New Files)
- **cwv_remediation.md** — LCP safety timeout (3s), FCP preconnects, TBT requestIdleCallback, CLS prevention
- **resource_loading.md** — Preconnect with crossorigin, async CSS (`onload="this.rel='stylesheet'"`), script defer/async
- **webflow_constraints.md** — TypeKit sync loading, jQuery auto-injection, CSS generation limits, workarounds table
- **third_party.md** — GTM delay with Safari fallback, analytics deferral, consent script optimization
- **performance_checklist.md** — PageSpeed Insights capture protocol, before/after comparison, regression prevention
- **multi_agent_patterns.md** — 10-agent specialization model for comprehensive codebase analysis

### 🏗️ AGENTS.md Enhancement
- **Section 9: CODE IMPLEMENTATION** — New dedicated section for workflows-code guidance
- **Multi-stack examples** — Detection markers table (Go, Node.js, Python, Angular, React Native, DevOps)
- **Stack-specific verification** — Commands table with `go test`, `npm test`, `pytest`, `ng test`
- **Universal template** — Removed project-specific references for broader applicability

### 🔧 Quality Fixes (27 Files)
- **P0: validation_patterns.js** — 44 methods + 45 variables converted camelCase → snake_case
- **P1: BEM convention** — Fixed `.block--element` → `.block__element` in code_quality_checklist.md
- **P1: Broken links** — Fixed `./performance_patterns.md` → `../implementation/performance_patterns.md`
- **P2: Checkbox markers** — Standardized `□` across debugging/verification checklists
- **SKILL.md routing** — Fixed 6 kebab-case → snake_case file references

### 📋 async_patterns.md Expansion
- **Lines: 104 → 511** — Comprehensive scheduling patterns documentation
- **New sections**: requestAnimationFrame, queueMicrotask, scheduler.postTask
- **Browser compatibility** — Support tables for scheduling APIs
- **Webflow-specific** — Timing patterns for platform integration

---

## Files Changed

**workflows-code skill (17 files):**
- `SKILL.md` · `validation_patterns.js` · `async_patterns.md`
- `code_quality_checklist.md` · `debugging_checklist.md` · `verification_checklist.md`
- `verification_workflows.md` · `quick_reference.md` · `shared_patterns.md`
- `minify-webflow.mjs` · `verify-minification.mjs` · `test-minified-runtime.mjs`
- New: `cwv_remediation.md` · `resource_loading.md` · `webflow_constraints.md` · `third_party.md` · `performance_checklist.md` · `multi_agent_patterns.md`

**Root files:**
- `AGENTS.md` — Added Section 9 with multi-stack guidance

---

## Upgrade

No action required. Pull latest to get performance patterns and AGENTS.md enhancements.

**Full Changelog**: https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.8.4...v1.0.8.5

---

## [**1.0.8.4**] - 2026-01-24

Bug fixes for workflows-code skill restoring **3 missing minification scripts** and updating **25+ broken path references** across SKILL.md and deployment guides.

---

### New

1. **Minification scripts** — Created 3 scripts in `.opencode/skill/workflows-code/scripts/`:
   - `minify-webflow.mjs` (batch minification with manifest tracking)
   - `verify-minification.mjs` (AST-based pattern verification)
   - `test-minified-runtime.mjs` (mock browser runtime testing)

---

### Fixed

1. **Missing scripts directory** — Scripts now bundled with workflows-code skill instead of project root
2. **25+ broken path references** — Updated all `scripts/` paths to `.opencode/skill/workflows-code/scripts/`
3. **Phase 1.5 missing** — Added Code Quality Gate phase to SKILL.md overview tables

---

## [**1.0.8.3**] - 2026-01-24

Multi-model agent configuration overhaul optimizing **7 agents** for GitHub Copilot model selection. Introduces **GPT-5.2-Codex** as default for debug/review agents (lowest error rate), standardizes model options to **opus/gemini/gpt**, and adds Copilot model identifiers.

---

### New

1. **GPT-5.2-Codex support** — Debug and review agents now default to GPT-5.2-Codex for superior bug finding precision (22 errors/MLOC)
2. **Copilot model identifiers** — Added `gpt-5.2-codex` model picker reference in agent MODEL PREFERENCE sections
3. **Model frontmatter** — All 7 agents now have explicit `model:` parameter in YAML frontmatter

---

### Changed

1. **Agent model defaults**:
   - `debug.md`: opus → **gpt** (GPT-5.2-Codex for root cause analysis)
   - `review.md`: opus → **gpt** (GPT-5.2-Codex for security vulnerability detection)
   - `orchestrate.md`: added **opus** (complex task decomposition)
   - `research.md`: added **opus** (deep investigation, 200K context)
   - `write.md`: added **sonnet** (balanced documentation quality)
   - `speckit.md`: **sonnet** (balanced spec documentation)
   - `handover.md`: **sonnet** (context extraction)

2. **Model options standardized** — Replaced `haiku/sonnet/opus` with `opus/gemini/gpt` across all commands and YAMLs

3. **Gemini description updated** — Changed from "cost-sensitive, simple tasks" to "Pro for quality, Flash for speed" (reflecting Gemini Pro/Flash capabilities)

4. **debug.md Q2 model selection** — Codex now recommended (option A), moved Claude to option B

5. **handover dispatch model** — Changed from `model: opus` to `model: sonnet` in command and YAML configs

---

### Fixed

1. **Model alignment** — All spec_kit commands now match their corresponding agent model defaults

---

## [**1.0.8.2**] - 2026-01-24

Comprehensive test suite for system-spec-kit adding **1,087 tests** across **8 new test files**, covering cognitive memory, MCP handlers, session learning, validation rules, and the Five Checks Framework.

---

### New

1. **test-session-learning.js** — 161 tests for preflight/postflight handlers, Learning Index formula validation
2. **test-memory-handlers.js** — 162 tests for memory_search, triggers, CRUD, save, and index operations
3. **test-cognitive-integration.js** — 96 integration tests for cognitive memory subsystem pipeline
4. **test-validation-system.js** — 99 tests for all 13 validation rules, level detection, exit codes
5. **test-template-comprehensive.js** — 154 tests for template rendering, ADDENDUM integration, compose.sh
6. **test_dual_threshold.py** — 71 pytest tests for dual-threshold validation (confidence + uncertainty)
7. **test-extractors-loaders.js** — 279 tests for session extractors and data loaders
8. **test-five-checks.js** — 65 tests for Five Checks Framework documentation and validation

---

### Fixed

1. **memory-crud.js import mismatch** — Changed `isValidTier` to `is_valid_tier` (snake_case) to match module exports

---

### Changed

1. **mcp_server/tests/README.md** — Updated to include 3 new test files (session-learning, memory-handlers, cognitive-integration)
2. **scripts/tests/README.md** — Updated to include 5 new test files, corrected count from 13 to 12

---

## [**1.0.8.1**] - 2026-01-24

Cleanup release removing redundant verbose templates. AI assistants can dynamically provide equivalent guidance when filling minimal templates, making static verbose templates **~5,000 lines** of unnecessary maintenance overhead.

---

### Removed

1. **`templates/verbose/` directory** — 26 files (~5,000+ lines) completely removed
2. **`SPECKIT_TEMPLATE_STYLE` environment variable** — Deprecated (no effect)
3. **`--verbose-templates` flag** — Removed from `create.sh` script

---

### Changed

1. **Documentation** — 23 files updated to remove verbose template references
2. **Template architecture** — Simplified to single "core" style for all users

---

## [**1.0.8.0**] - 2026-01-23

Comprehensive SpecKit intelligence upgrade introducing **dual-threshold validation** (confidence + uncertainty), **Five Checks Framework** for architectural decisions, and major script reorganization. Includes **34 file changes** across AGENTS.md, skill_advisor.py, documentation overhaul, and new reference materials for epistemic reasoning.

---

## Highlights

### ✨ Dual-Threshold Validation
- **READINESS formula**: `(confidence >= 0.70) AND (uncertainty <= 0.35)`
- **"Confident Ignorance" detection**: High confidence + high uncertainty triggers investigation
- **4-factor uncertainty model**: Epistemic gaps (0.30), Model boundaries (0.25), Temporal variability (0.20), Situational completeness (0.25)
- **skill_advisor.py**: New `calculate_uncertainty()` and `passes_dual_threshold()` functions

### 📋 Five Checks Framework
- **Architectural validation**: Required for Level 3/3+ specs, recommended for Level 2
- **5 checks**: Necessary? · Beyond Local Maxima? · Sufficient? · Fits Goal? · Open Horizons?
- **New reference**: `references/validation/five-checks.md`

### 🏗️ Script Reorganization
- **decision-tree-generator.js**: `extractors/` → `lib/` (generator, not extractor)
- **opencode-capture.js**: `lib/` → `extractors/` (captures session data)
- **Import paths**: Updated in 5 files (decision-extractor, diagram-extractor, data-loader, index.js, test file)

### 📝 Documentation Overhaul
- **README.md**: Streamlined with -623 lines net reduction
- **AGENTS.md**: Agent Routing now Section 6, Tool System → 7, Skills System → 8
- **New references**: `epistemic-vectors.md`, `decision-format.md`, `five-checks.md`
- **New handler**: `session-learning.js` for cognitive memory

---

### New

**AGENTS.md Framework**

1. **Dual-Threshold Validation (Gate 2)** — Confidence alone is insufficient; now requires BOTH:
   - Confidence >= 0.70 (how sure about what you know)
   - Uncertainty <= 0.35 (how much you don't know)
   - Investigation protocol (max 3 iterations before escalate)

2. **Five Checks Framework** — Architectural validation checklist:
   - Necessary? (solving actual need)
   - Beyond Local Maxima? (alternatives explored)
   - Sufficient? (simplest approach)
   - Fits Goal? (on critical path)
   - Open Horizons? (long-term aligned)

3. **Agent Routing Section (Section 6)** — Dedicated section with 9 agents and selection quick reference

**skill_advisor.py**

4. **`calculate_uncertainty()`** — Weighted uncertainty score from 4 factors
5. **`passes_dual_threshold()`** — Validates both confidence and uncertainty thresholds

**New Reference Files**

6. **`epistemic-vectors.md`** — Uncertainty tracking documentation
7. **`decision-format.md`** — Decision record formatting
8. **`five-checks.md`** — Five Checks Framework reference

**New MCP Handler**

9. **`session-learning.js`** — Cognitive memory session learning

---

### Changed

**Script Organization**

1. **decision-tree-generator.js**: Moved `extractors/` → `lib/` (it's a generator utility, not an extractor)
2. **opencode-capture.js**: Moved `lib/` → `extractors/` (it captures session data)
3. **Import paths updated** in 5 files to reflect new locations

**AGENTS.md Structure**

4. **Section Renumbering**:
   - Agent Routing → Section 6 (NEW)
   - Tool System → Section 7 (was 6)
   - Skills System → Section 8 (was 7)

5. **Gate 2 Enhancement** — Includes dual-threshold validation with READINESS formula

**Documentation**

6. **README.md**: Major streamlining (-1,623 lines added, +2,248 removed = -625 net)
7. **MCP Server README**: Reorganized with clearer tool documentation
8. **Templates**: Enhanced context_template.md, decision-record.md, tasks.md

---

### Fixed

1. **Gate Numbering** — Consistent sequential numbering throughout documentation
2. **gate-enforcement.md line 199** — "Gate 3" → "Gate 1" for Memory Context Loading
3. **SKILL.md line 855** — "4 files + README" → "5 subdirs + README" for templates/verbose/
4. **package.json** — Removed reference to non-existent index-cli.js
5. **scripts-registry.json** — Updated opencode-capture path to extractors/

---

## Files Changed

**Core Files (4)**
- `AGENTS.md` · `README.md` · `CHANGELOG.md` · `skill_advisor.py`

**System-Spec-Kit (30)**
- `SKILL.md` · `mcp_server/package.json` · `constitutional/gate-enforcement.md`
- `scripts/extractors/` (6 files) · `scripts/lib/` (2 files) · `scripts/loaders/` (1 file)
- `references/` (4 new + 4 modified) · `templates/` (3 files)
- `mcp_server/handlers/` (2 files) · `mcp_server/README.md`

---

## Upgrade

No action required. Pull latest to get:
- Dual-threshold validation in skill routing
- Five Checks Framework for architectural decisions
- Reorganized scripts with correct import paths

**Full Changelog**: [v1.0.7.2...v1.0.8.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.7.2...v1.0.8.0)

---

## [**1.0.7.2**] - 2026-01-23

Consolidates **all setup questions into a single prompt** across 7 SpecKit commands, reducing user interactions from 3-5 round-trips to **just 1**. Also removes outdated model version references like **GPT-4/o1** and **Pro/Ultra**.

---

## Highlights

### ✨ Single Consolidated Prompt
- **All 7 commands** now ask ALL questions in ONE prompt instead of multiple phases
- **Before**: 3-5 separate interactions (spec folder → execution mode → dispatch mode → memory context)
- **After**: Single consolidated prompt with Q0-Q5, reply with "A, B, A" format
- **Commands updated**: research, plan, implement, complete, debug, resume, handover

### 🔧 User-Facing Model Selection
- **Q2 AI Model options** in debug.md simplified:
  - `B) Gemini - Google models (Pro/Ultra)` → `B) Gemini - Google`
  - `C) Codex - OpenAI models (GPT-4/o1)` → `C) Codex - OpenAI`

### 📋 Dispatch Mode Descriptions
- **Mode descriptions** made model-agnostic across all YAML configs:
  - `1 Opus orchestrator + 2 Sonnet parallel workers` → `1 orchestrator + 2 parallel workers`
  - `1 Opus orchestrator + 3 Sonnet parallel workers` → `1 orchestrator + 3 parallel workers`

---

### Files Changed

**Commands (7)**
- `research.md` · `plan.md` · `implement.md` · `complete.md` · `debug.md` · `resume.md` · `handover.md`

**YAML Configs (10)**
- `spec_kit_debug_auto.yaml` · `spec_kit_debug_confirm.yaml`
- `spec_kit_complete_auto.yaml` · `spec_kit_complete_confirm.yaml`
- `spec_kit_plan_auto.yaml` · `spec_kit_plan_confirm.yaml`
- `spec_kit_implement_auto.yaml` · `spec_kit_implement_confirm.yaml`
- `spec_kit_research_auto.yaml` · `spec_kit_research_confirm.yaml`

---

### Upgrade

No action required. Pull latest to get consolidated prompts and model-agnostic naming.

**Full Changelog**: [v1.0.7.1...v1.0.7.2](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.7.1...v1.0.7.2)

---

## [**1.0.7.1**] - 2026-01-23

Adds **user-selectable multi-agent dispatch** to all 5 spec_kit work-execution commands, enabling 1 Opus orchestrator + 2-3 Sonnet parallel workers. Includes Coordinator/Worker mode instructions in agent files and `multi_agent_config` sections in **12 YAML configs**.

---

### New

**Multi-Agent Dispatch (A/B/C Selection)**
1. **Dispatch Mode Phase** — New mandatory phase added to 5 commands:
   - `/spec_kit:complete` → Phase 4 (Dispatch Mode Selection)
   - `/spec_kit:plan` → Phase 3 (Dispatch Mode Selection)
   - `/spec_kit:implement` → Phase 3 (Dispatch Mode Selection)
   - `/spec_kit:research` → Phase 3 (Dispatch Mode Selection)
   - `/spec_kit:debug` → Phase 2 (combined with Model Selection)

2. **Dispatch Options**:
   - **A) Single Agent** — Execute with one Opus agent (default)
   - **B) Multi-Agent (1+2)** — 1 Opus orchestrator + 2 Sonnet workers
   - **C) Multi-Agent (1+3)** — 1 Opus orchestrator + 3 Sonnet workers

**Agent Mode Instructions**
3. **Coordinator Mode** — Added to `research.md` (Section 9) and `debug.md` (Section 4):
   - Dispatch workers, receive outputs, validate evidence, synthesize findings
   - Worker Output Validation checklist
   - Contradiction Resolution Protocol

4. **Worker Mode** — Added to `research.md` (Section 10) and `debug.md` (Section 5):
   - Focused domain execution with structured JSON output
   - Worker roles table with responsibilities
   - ALWAYS/NEVER rules for worker constraints

---

### Changed

**Command Phase Structure (Sequential Numbering)**
1. **complete.md**: Phase 2.5 → Phase 3 (Research), new Phase 4 (Dispatch), Phase 3 → Phase 5 (Memory)
2. **plan.md**: New Phase 3 (Dispatch), Phase 3 → Phase 4 (Memory)
3. **implement.md**: New Phase 3 (Dispatch), Phase 3 → Phase 4 (Memory)
4. **research.md**: New Phase 3 (Dispatch), Phase 3 → Phase 4 (Prior Work), Phase 4 → Phase 5 (Memory)

**YAML Configuration**
5. **12 YAML configs** updated with `multi_agent_config` section:
   - `spec_kit_research_auto.yaml` · `spec_kit_research_confirm.yaml`
   - `spec_kit_debug_auto.yaml` · `spec_kit_debug_confirm.yaml`
   - `spec_kit_complete_auto.yaml` · `spec_kit_complete_confirm.yaml`
   - `spec_kit_plan_auto.yaml` · `spec_kit_plan_confirm.yaml`
   - `spec_kit_implement_auto.yaml` · `spec_kit_implement_confirm.yaml`

6. **Worker Definitions per Workflow**:
   - **Research**: codebase_explorer, external_researcher, technical_analyzer
   - **Debug**: call_path_tracer, pattern_searcher, edge_case_hunter
   - **Complete/Plan/Implement**: architecture_explorer, feature_explorer, dependency_explorer

---

### Fixed

1. **Phase Numbering** — All commands now use sequential integers (no 2.5 or 3.5)
2. **YAML Phase References** — `phase_2_5_research` → `phase_3_research` in complete YAMLs

---

### Upgrade

No action required. Pull latest to get multi-agent dispatch. Commands will now prompt for dispatch mode (A/B/C) before execution.

**Full Changelog**: [v1.0.7.0...v1.0.7.1](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.7.0...v1.0.7.1)

---

## [**1.0.7.0**] - 2026-01-23

Comprehensive multi-agent system upgrade introducing **7 specialized agents** with enterprise orchestration patterns. Adds Circuit Breaker isolation, Saga Compensation for rollback, Quality Gates at execution checkpoints, and dedicated agents for review, research, debugging, and session handover.

---

### New

**5 New Sub-Agents** (integrated into commands):
- **@research**: Technical investigation with evidence gathering → `/spec_kit:research` (Steps 3-7)
- **@speckit**: Spec folder documentation for Level 1-3+ → `/spec_kit:plan` (Step 3)
- **@review**: Code review with pattern validation (READ-ONLY) → `/spec_kit:implement` (Step 11)
- **@debug**: 4-phase methodology (Observe → Analyze → Hypothesize → Fix) → `/spec_kit:debug`
- **@handover**: Session continuation specialist (Sonnet default) → `/spec_kit:handover`

**2 Enhanced Agents**:
- **@orchestrate**: Senior orchestration with task decomposition, delegation, quality evaluation
- **@write**: Documentation generation and maintenance

**Enterprise Orchestration Patterns**

8. **Circuit Breaker** — Isolates failing agents with 3-state system (CLOSED → OPEN → HALF_OPEN), 3-failure threshold, 60-second timeout
9. **Saga Compensation** — Reverse-order rollback on multi-task failures with logged compensation actions
10. **Quality Gates** — Pre/mid/post execution scoring with 70-point threshold rubrics
11. **Resource Budgeting** — 50K token default budget with 80% warning and 100% halt thresholds
12. **Conditional Branching** — IF/THEN/ELSE logic in task decomposition with 3-level nesting support
13. **Incremental Checkpointing** — Every 5 tasks or 10 tool calls for recovery

---

### Changed

**Command Integration**

1. **Agent Routing in Commands** — 4 commands now route to specialized agents:
   - `/spec_kit:research` → `@research` (Steps 3-7)
   - `/spec_kit:plan` → `@speckit` (Step 3)
   - `/spec_kit:implement` → `@review` (Step 11)
   - `/spec_kit:handover` → `@handover` (dedicated Sonnet agent)
2. **13 YAML Config Files Updated** — All spec_kit workflow configs now include:
   - `agent_routing` block with primary agent and dispatch points
   - `quality_gates` block with pre/mid/post thresholds
   - `circuit_breaker` block with failure thresholds and states
3. **Model Standardization** — All agents default to Opus 4.5 for complex analysis, Sonnet for cost-efficient structured tasks

**Agent Infrastructure**

4. **7 Symlinks** — All agents linked in `.claude/agents/` for Claude Code discovery
5. **Dual subagent_type References** — 10 files updated with cross-environment compatibility:
   - `general-purpose` for Claude Code
   - `general` for OpenCode
   - Comment format: `# Claude Code: "general-purpose" | OpenCode: "general"`

---

### Fixed

1. **Agent Routing Alignment** — AGENTS.md routing table now includes all 7 agents with correct names
2. **YAML File Count Documentation** — Updated from 8 to 13 files across implementation docs

---

### Upgrade

No action required. Pull latest to get the new agent system. The `/spec_kit:debug` command now prompts for model selection before delegating to the debug agent.

**Full Changelog**: [v1.0.6.1...v1.0.7.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.6.1...v1.0.7.0)

---

## [**1.0.6.1**] - 2026-01-22

Fixes template path references in YAML workflow configs. The `available_templates:` section now correctly points to level-specific template directories, resolving "File not found" errors when spec_kit workflows attempted to read non-existent root-level templates.

---

### Fixed

1. **Level-specific template paths** — 9 YAML config files updated with correct template references:
   - `spec_kit_plan_auto.yaml` · `spec_kit_plan_confirm.yaml`
   - `spec_kit_complete_auto.yaml` · `spec_kit_complete_confirm.yaml`
   - `spec_kit_research_auto.yaml` · `spec_kit_research_confirm.yaml`
   - `spec_kit_implement_auto.yaml` · `spec_kit_implement_confirm.yaml`
   - `create_skill.yaml`
2. **Template path format** — `templates/spec.md` → `templates/level_2/spec.md` (and similar for all template types)

---

### Upgrade

No action required. Pull latest to get corrected template paths.

---

## [**1.0.6.0**] - 2026-01-21

Major template architecture overhaul introducing CORE + ADDENDUM v2.0. This release achieves 74-82% template line reduction through a compositional model, adds 26 verbose templates with extended guidance for new users, creates a comprehensive 557-test validation suite, and standardizes all 19 commands across 4 namespaces. The result: templates that add genuine value at each documentation level instead of boilerplate, with full backward compatibility. Implements specs 073-076.

---

### New

**CORE + ADDENDUM v2.0 Template Architecture (Spec 073)**

1. **Compositional Template Model** — Monolithic templates replaced with modular core + addendum architecture:
   - `templates/core/`: 4 base templates (322 LOC total)
     - `spec-core.md` (94 lines) — Essential what/why/how
     - `plan-core.md` (102 lines) — Technical approach and phases
     - `tasks-core.md` (67 lines) — Task breakdown with notation
     - `impl-summary-core.md` (59 lines) — Post-implementation summary
   - `templates/addendum/level2-verify/`: Verification sections (184 LOC)
     - `spec-level2.md` — NFRs, Edge Cases, Complexity Assessment
     - `plan-level2.md` — Phase Dependencies, Effort Estimates
     - `checklist.md` — QA verification with P0/P1/P2 priorities
   - `templates/addendum/level3-arch/`: Architecture sections (220 LOC)
     - `spec-level3.md` — Executive Summary, Risk Matrix, User Stories
     - `plan-level3.md` — Dependency Graph, Critical Path, Milestones
     - `decision-record.md` — ADR template with alternatives matrix
   - `templates/addendum/level3plus-govern/`: Governance sections (190 LOC)
     - `spec-level3plus.md` — Approval Workflow, Compliance, Stakeholder Matrix
     - `plan-level3plus.md` — AI Execution Framework, Workstream Coordination
     - `checklist-extended.md` — Extended checklist with approval workflow
2. **Value-Based Level Scaling** — Each level adds distinct VALUE sections (not boilerplate):
   - Level 1 (Core): Essential what/why/how — 4 files, ~320 lines
   - Level 2 (+Verify): +NFRs, +Edge Cases, +Complexity Score, +Effort Estimates — 5 files, ~520 lines
   - Level 3 (+Arch): +Executive Summary, +Risk Matrix, +User Stories, +ADRs, +Milestones — 6 files, ~760 lines
   - Level 3+ (+Govern): +Approval Workflow, +Compliance Checkpoints, +Stakeholder Matrix, +AI Framework — 6 files, ~950 lines
3. **Workstream Notation** — Prefixes for parallel sub-agent coordination in multi-agent scenarios:
   - `[W-A]`, `[W-B]`, `[W-C]` — Workstream ownership markers
   - `[SYNC]` — Synchronization points requiring coordination
   - Enables 40% faster spec creation via parallelization (Tier 2 parallel, Tier 3 integration)
4. **Pre-Composed Level Templates** — Ready-to-use templates in `templates/level_N/` directories:
   - `templates/level_1/` — Core only (4 files)
   - `templates/level_2/` — Core + L2 addendums (5 files)
   - `templates/level_3/` — Core + L2 + L3 addendums (6 files)
   - `templates/level_3+/` — All addendums combined (6 files)
5. **Architecture Decision Records** — Three ADRs documenting design decisions:
   - ADR-001: CORE + ADDENDUM architecture (single source of truth, modular maintenance)
   - ADR-002: Value-based level scaling (real usage analysis showed 0% usage of stakeholders, traceability mapping, KPI targets)
   - ADR-003: Workstream notation standard (enables clear task coordination in multi-agent scenarios)

**Verbose Templates (Spec 074)**

6. **26 Verbose Template Files** — Extended guidance scaffolding in `templates/verbose/` for new users:
   - `verbose/core/`: spec-core-verbose.md (201 lines), plan-core-verbose.md (246 lines), tasks-core-verbose.md (210 lines), impl-summary-core-verbose.md (169 lines)
   - `verbose/level_1/` through `verbose/level_3+/`: Pre-composed verbose templates at each level
   - ~2.5-3x longer than minimal templates (~200-300 lines vs ~60-90 lines)
7. **Three Guidance Patterns** — Structured scaffolding for template completion:
   - `[YOUR_VALUE_HERE: description]` — Placeholders with contextual guidance (e.g., `[YOUR_VALUE_HERE: 1 for <100 LOC, 2 for 100-499 LOC, 3 for 500+ LOC]`)
   - `[NEEDS CLARIFICATION: (a) (b) (c)]` — Multiple-choice questions for ambiguous requirements
   - `[example: specific content]` — Inline examples demonstrating expected quality
   - Verbose-only sections: ASSUMPTIONS (spec), COMPLEXITY JUSTIFICATION (plan)
8. **SPECKIT_TEMPLATE_STYLE Environment Variable** — Switch between template variants:
   ```bash
   export SPECKIT_TEMPLATE_STYLE=verbose  # Extended guidance for new users
   export SPECKIT_TEMPLATE_STYLE=minimal  # Clean templates for experienced users (default)
   ```
9. **compose.sh Script** — 1,021-line automated template composition and maintenance tool:
   - Location: `scripts/templates/compose.sh`
   - Usage: `./compose.sh --level 2` to regenerate level 2 templates from core + addendums
   - Supports `--all` flag to regenerate all levels
   - Includes `--dry-run` for preview without changes
10. **WHEN TO USE Sections** — HTML comments in 8 template files for invisible guidance:
    ```html
    <!-- WHEN TO USE: Level 1 for features <100 LOC with clear requirements -->
    ```
    - Visible during editing, invisible in rendered output
    - Added to all spec.md and plan.md templates across levels

**Test Suite (Spec 075)**

11. **test-template-system.js** — 95 tests covering template validation:
    - Core template validation and composition verification
    - SPECKIT_LEVEL marker detection
    - Verbose template guidance pattern validation
    - Template path resolution
12. **test-validation-extended.sh** — 129 tests for all 14 validation rules:
    - Exit code semantics (0=pass, 1=warn, 2=error)
    - JSON/verbose/quiet output modes
    - Path-scoped validation
    - All rules: FILE_EXISTS, FOLDER_NAMING, FRONTMATTER_VALID, PRIORITY_TAGS, EVIDENCE_CITED, PLACEHOLDER_FILLED, ANCHORS_VALID, SECTIONS_PRESENT, LEVEL_DECLARED, COMPLEXITY_MATCH, SECTION_COUNTS, AI_PROTOCOL, LEVEL_MATCH
13. **test-mcp-tools.js** — 148 tests for MCP tool functionality:
    - Memory search (semantic matching, anchor filtering, folder-scoped queries)
    - `memory_match_triggers` pattern detection
    - Checkpoint operations (create/list/restore/delete)
    - Memory CRUD operations
14. **test-scripts-modules.js** — 166 tests for script modules:
    - `generate-context.js` (JSON/folder input modes, ANCHOR format)
    - Extractors module (file, conversation, decision, diagram)
    - Utils module (path, validation, input normalization)
    - Lib module (embedding-client, sqlite-client, index-manager, search-engine)
15. **test-integration.js** — 36 end-to-end workflow tests:
    - Full memory save workflow
    - Complete validation pipeline
    - Cognitive memory session flow
    - Checkpoint roundtrip testing

---

### Changed

**Command Standardization (Specs 075-076)**

1. **19 Commands Aligned** — Section headers standardized across all 4 namespaces:
   - **spec_kit/** (7): `complete.md`, `debug.md`, `handover.md`, `implement.md`, `plan.md`, `research.md`, `resume.md`
   - **memory/** (3): `database.md`, `save.md`, `search.md`
   - **create/** (6): `folder_readme.md`, `install_guide.md`, `skill.md`, `skill_asset.md`, `skill_reference.md`, `agent.md`
   - **search/** (2): `code.md`, `index.md`
2. **Section Header Migration** — `🔜 WHAT NEXT?` → `📌 NEXT STEPS` per approved emoji vocabulary:
   - `🔜` emoji not in approved vocabulary; `📌` already approved for REFERENCE/NOTES sections
   - Parenthetical text removed from H2 headers (e.g., `WORKFLOW OVERVIEW (9 STEPS)` → `WORKFLOW OVERVIEW`)
3. **OUTPUT FORMATS Sections** — Added explicit output format documentation to 4 spec_kit commands:
   - `complete.md`, `implement.md`, `plan.md`, `research.md`
   - Improves discoverability; matches existing pattern in `debug.md` and `handover.md`
4. **Mandatory Gate for `/memory:search`** — 33-line multi-phase blocking gate:
   - Requires `<id>` or `<spec-folder>` argument before proceeding
   - 4 search mode options: by ID, by spec folder, recent memories, semantic search
   - Prevents context inference errors from missing required arguments
5. **Frontmatter Argument Format** — Required arguments now use angle brackets:
   - `/create:skill`: `skill-name` → `<skill-name>`
   - `/create:agent`: `agent-name` → `<agent-name>`
   - Aligns with command_template.md standard for required vs optional args

**YAML Asset Updates (Spec 076)**

6. **spec_kit YAMLs** — 4 files updated with version and template references:
   - `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`: Version v1.9.0, Level 1 files now include `implementation-summary.md`
   - `spec_kit_implement_auto.yaml`, `spec_kit_implement_confirm.yaml`: Version v1.9.0
7. **resume YAMLs** — Anchor-based memory retrieval for ~90% token efficiency:
   - `spec_kit_resume_auto.yaml`, `spec_kit_resume_confirm.yaml`
   - Uses `anchors: ['summary', 'state', 'next-steps']` for targeted retrieval
8. **research YAMLs** — Enhanced configuration:
   - `spec_kit_research_auto.yaml`: Version v1.9.0, generate-context.js rule
   - `spec_kit_research_confirm.yaml`: 17-section enumeration for comprehensive coverage
9. **create_agent.yaml** — Deep restructure for clarity:
   - Terminology: "subagent" → "secondary" (9 locations)
   - Unified permission format across auto/confirm modes
   - Added execution mode headers

**Template System**

10. **74-82% Template Line Reduction** — Unused sections removed based on real usage analysis of 9+ spec folders:
    - Removed: Stakeholders (0% usage), Traceability Mapping (0% usage), KPI Targets (0% usage), Given/When/Then (10% usage), Assumptions Validation (5% usage)
    - Result: L1 from ~800 to ~320 lines, L3 from ~2,100 to ~760 lines
11. **Template Path Conventions** — `templates/level_N/` is canonical location:
    - Clarified from earlier `composed/` references in documentation
    - 12 occurrences corrected in SKILL.md
    - Template path table added to SKILL.md
12. **implementation-summary.md Required at Level 1** — Previously implicit, now explicit requirement:
    - Created after implementation completes, not at spec folder creation
    - Added to Level 1 required files in `spec_kit_plan_*.yaml`

**Infrastructure**

13. **Documentation Aligned to write.md Standards** — 12 documentation files now 100% compliant:
    - Section 1 renamed to OVERVIEW (was various names)
    - RELATED RESOURCES section added as final section
    - Sequential numbering fixed in asset files
14. **Version Bump** — system-spec-kit v1.9.0 → v2.0.0 reflecting major architectural change

---

### Fixed

**Template Fixes**

1. **Level 2 Template Composition** — Corrected composition issues where L2 templates were missing addendum sections
2. **6 Orphaned COMPLEXITY_GATE Markers** — Removed from `templates/level_2/checklist.md` (deprecated markers from previous architecture)
3. **Template Version Markers** — Added `v2.0` to SPECKIT_TEMPLATE_SOURCE in all templates

**Script Fixes**

4. **create.sh Uninitialized Variables** — Fixed variable initialization issues causing script failures
5. **Validation Script grep Pipeline** — Added `|| true` pattern for `set -eo pipefail` compatibility:
   - `grep` returns exit code 1 when no matches found
   - Scripts now handle no-match case gracefully
6. **Non-Portable Regex** — Fixed regex patterns for cross-platform compatibility (macOS + Linux)

**Cross-Platform**

7. **macOS /tmp Path Security** — Added `/tmp` and `/private/tmp` to allowedBases in `scripts/loaders/data-loader.js`:
   - macOS `/tmp` symlinks to `/private/tmp`
   - Both paths now accepted for cross-platform compatibility

**Documentation**

8. **Cross-Reference Fix** — `/memory:database` line 404 corrected to reference `/memory:checkpoint restore` (was incorrectly referencing `/memory:database restore`)
9. **Path Reference Updates** — 36 documentation paths updated to reflect new template structure

---

### Verification

- **557 tests**: 540 passed, 17 skipped, 0 failures (97% pass rate)
- **P0 Critical Tests**: 100% passing (core initialization, MCP server, database, vector search)
- **P1 Required Tests**: 100% passing (validation rules, cognitive features, memory generation)
- **Template Composition**: `compose.sh` generates identical output to pre-composed templates
- **Cross-Platform**: macOS and Linux path handling verified
- **Backward Compatibility**: All existing spec folders function without modification

---

### Upgrade

1. **Restart Required** — Restart OpenCode to load updated templates and command definitions
2. **Template Selection** — Choose template variant based on experience level:
   ```bash
   # For new users (extended guidance)
   export SPECKIT_TEMPLATE_STYLE=verbose

   # For experienced users (clean templates, default)
   export SPECKIT_TEMPLATE_STYLE=minimal
   ```
3. **Compose Script** — Regenerate level templates if customizing core templates:
   ```bash
   cd .opencode/skill/system-spec-kit/scripts/templates
   ./compose.sh --all          # Regenerate all levels
   ./compose.sh --level 2      # Regenerate specific level
   ./compose.sh --dry-run      # Preview without changes
   ```
4. **No Breaking Changes** — All existing spec folders and APIs maintain backward compatibility:
   - Existing `templates/level_N/` paths continue to work
   - Memory system unchanged
   - Validation rules unchanged (all 51 test fixtures pass)
5. **Optional Migration** — To use verbose templates for existing incomplete specs:
   - Copy verbose templates: `cp templates/verbose/level_2/* specs/###-feature/`
   - Fill in guidance patterns, then simplify to core format

**Full Changelog**: [v1.0.5.0...v1.0.6.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.5.0...v1.0.6.0)

---

## [**1.0.5.0**] - 2026-01-17

Major feature release introducing Memory Command Separation, Dynamic Complexity-Based Templates, and Composite Folder Ranking. Implements 5 specs (068-072) with ~3,000+ new lines of code, 300+ tests, and comprehensive performance optimizations.

---

### New

**Memory Command Separation (Spec 068)**

1. **`/memory:database` Command** — New dedicated command for database management with 9 modes:
   - `stats` — Dashboard with total memories, database size, tier breakdown
   - `scan` / `scan --force` — Index new memory files (force re-indexes all)
   - `cleanup` — Bulk cleanup of old/deprecated memories with safety gates
   - `tier <id> <tier>` — Change memory importance tier
   - `triggers <id>` — Edit trigger phrases for a memory
   - `validate <id> useful|not` — Mark memories as useful or not
   - `delete <id>` — Delete individual memories with confirmation
   - `health` — Comprehensive database health report
2. **Safety Gates for Destructive Operations** — Hard block confirmations for cleanup and delete operations
3. **Automatic Checkpoint Creation** — Pre-cleanup checkpoint created before bulk deletions

**Dynamic Complexity-Based Templates (Spec 069)**

4. **5-Dimension Complexity Detection** — Analyzes task descriptions across weighted dimensions:
   - Scope (25%): Files affected, LOC estimate, systems touched
   - Risk (25%): Security, auth, config, breaking changes
   - Research (20%): Investigation keywords, unknowns, external deps
   - Multi-Agent (15%): Parallel workstreams, agent coordination
   - Coordination (15%): Cross-system dependencies, blocking relationships
5. **Level Classification System** — Maps complexity scores to documentation levels:
   - Level 1 (Baseline): 0-25 points → spec, plan, tasks, impl-summary
   - Level 2 (Verification): 26-55 points → adds checklist
   - Level 3 (Full): 56-79 points → adds decision-record
   - Level 3+ (Extended): 80-100 points → AI protocols, workstreams, dependency DAGs
6. **Level-Specific Template Folders** — Pre-expanded templates in `templates/level_1/`, `level_2/`, `level_3/`, `level_3+/`
7. **New CLI Tools**:
   - `detect-complexity.js` — Complexity detection with `--request`, `--file`, `--json`, `--quiet` flags
   - `expand-template.js` — Template expansion with `--template`, `--level`, `--all`, `--spec-folder`, `--dry-run` flags
8. **171 Tests** — Comprehensive test suite with 100% coverage across 5 test suites

**Composite Folder Ranking (Spec 070)**

9. **Composite Ranking Algorithm** — Multi-factor scoring replacing simple count-based ranking:
   - Formula: `score = (recency × 0.40) + (importance × 0.30) + (activity × 0.20) + (validation × 0.10) × archive_multiplier`
10. **Archive Detection & Filtering** — Automatic deprioritization of archived folders:
    - `z_archive/` → 0.1× multiplier
    - `scratch/`, `test-`, `prototype/` → 0.2× multiplier
11. **Recency Decay System** — Time-based score decay with 10-day half-life
12. **Constitutional Tier Decay Exemption** — Constitutional memories never decay (always 1.0)
13. **New `memory_stats()` Parameters**:
    - `folderRanking`: `'count'` | `'recency'` | `'importance'` | `'composite'`
    - `excludePatterns`: Array of regex patterns
    - `includeScores`: Boolean for score breakdown
    - `includeArchived`: Boolean to include archived folders
14. **61 Tests** — All passing for folder scoring system

---

### Changed

**Memory Search Refactoring**

1. **`/memory:search` Now Read-Only** — Removed cleanup, tier, triggers, and validate operations (moved to `/memory:database`)
2. **Simplified Actions** — Memory detail view shows only read operations: related, load anchor, search, back, quit

**Template System Updates**

3. **Scripts Use Level Folders** — `create-spec-folder.sh` and `expand-template.js` now copy from level-specific folders
4. **COMPLEXITY_GATE Markers Deprecated** — Replaced with pre-expanded templates per level (markers still functional for backward compatibility)
5. **18 Documentation Files Updated** — All copy commands reference `templates/level_N/` paths

**Performance Optimizations (Spec 072)**

6. **Async File Reading** — `safe_read_file_async()` with `Promise.all()` for parallel I/O
7. **RRF Fusion O(1) Lookups** — Map-based lookups replacing O(n×m) linear search
8. **Checkpoint Restore Batch Deduplication** — O(n) query approach replacing O(n²)
9. **Unified Recency Scoring** — Single implementation in `folder-scoring.js` imported by all consumers
10. **MCP Library Reorganization** — Organized into `cognitive/`, `parsing/`, `providers/`, `scoring/`, `search/`, `storage/`, `utils/`

**Infrastructure**

11. **Barrel Export Namespace Prefixes** — 58 explicit named exports replacing spread operators to prevent collision
12. **Database Reinitialization Mutex** — Promise-based mutex preventing race conditions
13. **Constitutional Memory Double-Fetch Prevention** — Conditional check before redundant queries

---

### Fixed

**Critical Fixes**

1. **Barrel Export Collision Risk** — Spread operators silently overwrote functions; replaced with namespace prefixes
2. **Database Reinitialization Race Condition** — Added mutex with finally-block release
3. **Sequential File Reads Blocking Event Loop** — Added async file reading with Promise.all()
4. **RRF Fusion O(n×m) Complexity** — Map-based O(1) lookups
5. **~400 Lines Duplicate Scoring Code** — `rank-memories.js` now imports from `folder-scoring.js`
6. **Checkpoint Restore O(n²) Deduplication** — Batch query approach with composite keys

**Validation System Fixes**

7. **`check-section-counts.sh`** — Grep output sanitization for comparison operators
8. **4 Validation Rules Rewritten** — check-complexity, check-section-counts, check-ai-protocols, check-level-match now implement `run_check()` interface
9. **Constitutional `gate-enforcement.md`** — Now indexed with `constitutional` tier (was `normal`)

**Template Fixes**

10. **`level_2/checklist.md`** — Removed 6 orphaned COMPLEXITY_GATE markers
11. **36 Path References** — Updated from `scripts/generate-context.js` to `scripts/memory/generate-context.js`

---

### Upgrade

1. **Restart Required** — Restart OpenCode to load updated MCP server with new ranking and search features.
2. **New Commands Available** — `/memory:database` provides management operations; `/memory:search` is now read-only.
3. **Template Level Selection** — Use `--level N` flag with `create-spec-folder.sh` for level-appropriate templates.
4. **No Breaking Changes** — All existing APIs maintain backward compatibility.

**Full Changelog**: [v1.0.4.1...v1.0.5.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.4.1...v1.0.5.0)

---

## [**1.0.4.1**] - 2026-01-16

Fixes a bug where README.md files in the constitutional directory were incorrectly indexed as memories. The documentation file's example YAML frontmatter was parsed as real metadata, creating ghost memory entries.

---

### Fixed

1. **Constitutional Indexer** — Now skips `README.md` files (case-insensitive) in `find_constitutional_files()` to prevent documentation from being indexed as memories.
2. **Memory File Validator** — `is_memory_file()` now excludes README.md files from constitutional directories during `memory_save` operations.

---

### Upgrade

No action required. Pull latest to get the fix. Any previously indexed README memories can be removed with `memory_delete({ id: <id> })`.

**Full Changelog**: [v1.0.4.0...v1.0.4.1](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.4.0...v1.0.4.1)

---

## [**1.0.4.0**] - 2026-01-15

A major quality and architecture release focusing on system reliability, memory system optimization, and codebase maintainability. This version addresses 231 identified issues across the Spec Kit infrastructure, introduces targeted memory retrieval via the Anchor System (achieving 61-93% token savings), modularizes the core MCP server from 2,703 to 319 lines, and upgrades to Voyage 4 embeddings.

---

### New

1. **Anchor System for Targeted Memory Retrieval** — The `memory_search` tool now accepts an `anchors` parameter enabling retrieval of specific memory sections (e.g., "summary", "decisions") instead of full file content. Verified savings: 73% for summary-only, 87% for decisions-only, 61% for summary+decisions. Response metadata includes `tokenMetrics` with savings calculations.
2. **Modular MCP Server Architecture** — Decomposed `context-server.js` into 19 focused modules across 5 directories:
   - `core/` (3 files, 507 lines) — Server configuration, database state management
   - `handlers/` (7 files, 1,395 lines) — Tool handlers for search, triggers, CRUD, checkpoints
   - `formatters/` (3 files, 353 lines) — Search results and token metrics formatting
   - `utils/` (4 files, 478 lines) — Validators, JSON helpers, batch processing
   - `hooks/` (2 files, 223 lines) — SK-004 auto memory surfacing
3. **Voyage 4 Embedding Support** — Added `voyage-4`, `voyage-4-large`, and `voyage-4-lite` to supported models with automatic database separation per model (existing `voyage-3.5` embeddings preserved).

---

### Changed

1. **Default Embedding Model** — Changed from `voyage-3.5` to `voyage-4` for Spec Kit Memory MCP. Narsil retains `voyage-code-2` until a code-specific Voyage 4 model is released.
2. **Entry Point Reduction** — `context-server.js` reduced from 2,703 lines to 319 lines (88% reduction).
3. **Documentation Accuracy** — ANCHOR system documentation updated from "93% token savings" claim to verified metrics. Debug delegation threshold standardized to "3+ failed attempts" across all documentation.
4. **Attention Decay Documentation** — Corrected to reflect actual turn-based implementation (not time-based as previously documented).
5. **MCP Tool Documentation** — Expanded from 7 to 14 documented tools. Added `searchBoost` multipliers for importance tiers.

---

### Fixed

1. **Critical: Missing `await` in memory_search** — Fixed `formatSearchResults()` calls returning Promise objects instead of resolved results when `includeContent=true`.
2. **Critical: Undefined E429 Error Code** — Added definition to `errors.js` and documented in troubleshooting guide.
3. **Critical: Embedding API Rate Limiting** — Added `BATCH_DELAY_MS` (100ms default) to prevent provider throttling.
4. **Critical: vec_memories Cleanup Order** — Fixed deletion order to prevent orphaned vector rows.
5. **Race Conditions** — Added mutex protection for embedding warmup; fixed constitutional cache clearing; fixed trigger cache invalidation after bulk indexing.
6. **Memory Leaks** — Implemented LRU cache for regex objects in `trigger-matcher.js`; added timer cleanup in `errors.js`.
7. **Null Safety** — Added null checks throughout codebase for database query results.
8. **Cross-Platform Compatibility** — Replaced hardcoded macOS paths with `os.homedir()` and `os.tmpdir()`.
9. **Config System Cleanup** — Deleted unused `config-loader.js` and reduced `search-weights.json` to actively used sections only.
10. **parseInt Radix** — Added explicit radix parameter to all `parseInt()` calls.

---

### Upgrade

1. **Restart Required** — Restart OpenCode to load the updated Spec Kit Memory MCP server with Voyage 4 support.
2. **Automatic Database Migration** — System creates new database file (`context-index__voyage__voyage-4__1024.sqlite`) when switching to Voyage 4. Existing memories preserved.
3. **Optional Re-indexing** — Run `memory_index_scan({ force: true })` to bulk re-index existing memory files.
4. **No Breaking Changes** — All 14 MCP tools maintain identical interfaces.

**Full Changelog**: [v1.0.3.6...v1.0.4.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.3.6...v1.0.4.0)

---

## [**1.0.3.6**] - 2026-01-15

Critical MCP protocol fix ensuring Cognitive Memory v17.1 functions correctly. Adds VS Code extension install guide and expands workflows-code skill with 16 new reference and asset files.

---

### Fixed

1. **Critical (MCP Protocol)** — Changed `console.log` → `console.error` in 3 locations to prevent "invalid character 'v'" JSON-RPC errors:
   - `embeddings.js:282` (Provider warmed up message)
   - `factory.js:58` (Using provider message)
   - `factory.js:110` (Warming up message)
   - **Why**: MCP servers use stdout for JSON-RPC communication. Any `console.log()` output corrupts the protocol, causing Antigravity quota and other MCP tools to fail.

---

### Added

1. **VS Code Extension Install Guide** — Step-by-step installation guide for non-technical users (`OpenCode - VS Code Extension.md`):
   - AI-first installation prompt for guided setup
   - GitHub Copilot authentication walkthrough
   - Model selection guidance
2. **Performance Patterns Asset** — `performance_patterns.js` with production-validated timing utilities:
   - Throttle/debounce constants (64ms pointermove, 180ms form validation, 200-250ms resize)
   - IntersectionObserver patterns with 0.1 threshold
3. **15 New Reference Files** in workflows-code skill:
   - `debugging/`: `debugging_workflows.md`, `error_recovery.md`
   - `implementation/`: `animation_workflows.md`, `css_patterns.md`, `focus_management.md`, `implementation_workflows.md`, `observer_patterns.md`, `performance_patterns.md`, `security_patterns.md`, `swiper_patterns.md`, `third_party_integrations.md`, `webflow_patterns.md`
   - `standards/`: `css_quick_reference.md`
   - `verification/`: `verification_workflows.md`

---

### Note

This release completes the Cognitive Memory v17.1 rollout by fixing the MCP protocol issue that could prevent the memory system from functioning. The cognitive features themselves (attention-decay, co-activation, tier-classifier, working-memory, summary-generator) were released in v1.0.3.4 and v1.0.3.5.

**Full Changelog**: [v1.0.3.5...v1.0.3.6](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.3.5...v1.0.3.6)

---

## [**1.0.3.5**] - 2026-01-15

---

### Fixed

1. **Missing Cognitive Module Files** — Force-added 5 lib files blocked by global gitignore:
   - `attention-decay.js`, `co-activation.js`, `tier-classifier.js`, `working-memory.js`, `summary-generator.js`
2. **Test Suite Created** — Added 226 comprehensive tests for cognitive memory modules:
   - `attention-decay.test.js` (46 tests)
   - `working-memory.test.js` (51 tests)
   - `tier-classifier.test.js` (39 tests)
   - `co-activation.test.js` (38 tests)
   - `summary-generator.test.js` (52 tests)
3. **Documentation Inconsistencies** — Aligned decay rate documentation (0.80/turn for normal, 0.60/turn for temporary)
4. **CHANGELOG Accuracy** — Corrected inflated test count claims from v1.0.3.4
5. **Bug Fix** — `flushAccessCounts` → `flush_access_counts` (snake_case alignment)
6. **Gitignore** — Added `.opencode/` exception to prevent future missing file issues

---

### Changed

1. Updated `.gitignore` to override global gitignore pattern for `.opencode/` directory

**Full Changelog**: [v1.0.3.4...v1.0.3.5](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.3.4...v1.0.3.5)

---

## [**1.0.3.4**] - 2026-01-14

Cognitive Memory v17.1 delivers comprehensive bug fixes to the session-aware memory system introduced in v17.0. Additionally, a comprehensive audit of 4 workflow skills resolved 9 critical bugs, 13 misalignments, and 18 warnings across 13 files.

---

### New

**Cognitive Memory Features (v17.0)**

1. **Turn-Based Attention Decay** — Memories fade naturally over conversation turns unless re-activated. Decay rates vary by importance tier (constitutional=1.0/never, normal=0.80, temporary=0.60).
2. **Tiered Content Delivery** — HOT (≥0.8): full content, WARM (0.25-0.79): summaries only, COLD (<0.25): excluded. Achieves 63-86% token savings in typical sessions.
3. **Co-Activation** — When a memory activates, related memories get boosted (+0.35), surfacing contextually relevant content automatically.
4. **Session-Based Working Memory** — Each conversation maintains independent attention state. Fully backward compatible with stateless mode.

**New Modules (v17.0)**

5. `working-memory.js` — Session state management
6. `attention-decay.js` — Turn-based decay calculations
7. `tier-classifier.js` — HOT/WARM/COLD classification
8. `co-activation.js` — Related memory boosting
9. `summary-generator.js` — WARM tier summary generation

---

### Changed

**Workflow Skills Improvements**

1. **workflows-git v1.5.0** — Full Git workflow orchestrator for complete development lifecycle:
   - Workspace setup guidance via git-worktrees
   - Clean commit workflows with conventional commit conventions
   - Work completion flows for branch integration
   - Pull request creation and review workflows
   - GitHub issue integration
   - Fixed 7 GitHub MCP naming patterns (underscore → dot notation)
   - Added Gate 3 integration and memory integration examples
2. **workflows-chrome-devtools v2.1.0** — Enhanced orchestrator with intelligent routing:
   - CLI (bdg) approach prioritized for speed and token efficiency
   - MCP fallback for multi-tool integration scenarios
   - Screenshot capture, network monitoring, console log access
   - Cookie manipulation and JavaScript execution
   - Unix pipe composability for terminal-based automation
   - Fixed section references in session_management.md and cdp_patterns.md
3. **workflows-documentation** — Validation improvements:
   - Added SMART ROUTING and REFERENCES sections to package_skill.py validation
   - Fixed Resource Router mode numbering (6 duplicates → 4 unique)
   - Added REFERENCES section to init_skill.py template
4. **workflows-code** — Audit bug fixes:
   - Fixed 15 broken asset and relative paths across 3 reference files
   - Viewport alignment standardized to 375px
   - Removed 60 lines of dead code from wait_patterns.js
5. All package versions updated to 17.1.0 for consistency.

---

### Fixed

**Cognitive Memory v17.1**

1. `attention-decay.js`: Column name mismatch (`last_session_access`) causing session tracking failures.
2. `checkpoints.js`: Added backup-before-delete to prevent data loss on restore failures.
3. `attention-decay.js`: Decay rates returning 1.0 for inactive sessions (should apply decay).
4. `checkpoints.js`: Graceful skip for orphaned checkpoint entries without corresponding memories.
5. `attention-decay.js`: NaN/Infinity validation guards in all decay calculation paths.
6. `tier-classifier.js`: Added `parse_threshold` helper for safe tier threshold config parsing.
7. `co-activation.js`: Replaced `console.log` with `console.error` for proper error logging.
8. `co-activation.js`: Added missing `classifyTier` import fixing undefined function errors.
9. `context-server.js`: Null/array check before spread in status endpoint response.
10. `co-activation.js`: Circular reference prevention in co-activation graph traversal.
11. `tier-classifier.js`: HOT threshold > WARM threshold validation to prevent tier inversion.
12. `working-memory.js`: Replaced `console.log` with `console.error` for error conditions.

**Audit Summary:** 9 critical bugs fixed · 13 misalignments resolved · 18 warnings addressed · 13 files modified

---

### Upgrade

No action required. Pull latest to get bug fixes and cognitive memory improvements.

**Full Changelog**: [v1.0.3.3...v1.0.3.4](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.3.3...v1.0.3.4)

---

## [**1.0.3.3**] - 2026-01-11

Security hardening and documentation quality improvements for workflows-code skill. Fixes URL validation XSS vulnerability, repairs 35 broken cross-references, and brings all reference files into H2 emoji compliance.

---

### Fixed

1. **URL Validation** — Now rejects `javascript:` and `data:` schemes (XSS prevention).
2. **35 Broken Links** — Fixed broken markdown links across 16 reference files.
3. **Missing Default** — `debounce()` missing default delay (now 180ms).
4. **Path Correction** — SKILL.md Quick Reference path (`dist/` → `src/2_javascript/z_minified/`).

---

### Changed

1. Removed deprecated `SafeDOM` class (107 lines).
2. Removed deprecated `debounce` and `raf_throttle` exports from `wait_patterns.js`.
3. Added Lenis smooth scroll pattern routing to SKILL.md.
4. Added HLS video streaming pattern routing to SKILL.md.
5. Added H2 emojis to 4 reference files (34 headers) for documentation compliance.

---

### Upgrade

No action required. Pull latest to get security improvements.

**Full Changelog**: [v1.0.3.2...v1.0.3.3](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.3.2...v1.0.3.3)

---

## [**1.0.3.2**] - 2026-01-05

Embeds MCP server source code into skill folders for improved portability. Documents critical Code Mode prefixed environment variable requirement that was causing "Variable not found" errors. Updates install guides with comprehensive troubleshooting.

---

### New

1. **Embedded MCP Servers** — Narsil source in `mcp-narsil/mcp_server/`, Code Mode source in `mcp-code-mode/mcp_server/`
2. **Environment Template** — `.env.example` template with Code Mode prefixed variables documented

---

### Changed

1. **Install Guides Updated** — `MCP - Narsil.md` · `MCP - Code Mode.md` with prefixed variable documentation
2. **Code Mode Install Guide** — Added "CRITICAL: Prefixed Environment Variables" section
3. **Narsil Install Guide** — Added prefixed variable note in Neural Search Configuration
4. **Troubleshooting** — New entries for "Variable not found" errors in both guides

---

### Fixed

1. **Documentation Gap** — Code Mode requires `{manual}_{VAR}` format (e.g., `narsil_VOYAGE_API_KEY`)
2. **Public Repo Configs** — Removed hardcoded API keys and absolute paths

---

### Upgrade

Add prefixed variables to `.env` for Code Mode:
```bash
# Standard variable
VOYAGE_API_KEY=pa-your-key

# Code Mode prefixed version (REQUIRED)
narsil_VOYAGE_API_KEY=pa-your-key
```

See `.env.example` for complete template.

**Full Changelog**: [v1.0.3.1...v1.0.3.2](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.3.1...v1.0.3.2)

---

## [**1.0.3.1**] - 2026-01-05

Updates agent configuration to OpenCode v1.1.1+ format. Migrates deprecated `tools:` object to unified `permission:` format with `allow`/`deny`/`ask` values across all agent files, templates, and documentation.

---

### Changed

1. **Agent Frontmatter** — `tools:` object → `permission:` object (v1.1.1+ format)
2. **Agent Files** — `write.md` · `orchestrate.md`: Consolidated tool permissions into unified permission block
3. **Agent Template** — Updated with v1.1.1 format, granular permissions example, deprecation note
4. **Setup Guide** — `SET-UP - Opencode Agents.md`: Updated examples, field reference, troubleshooting (v1.2)
5. **Create Command** — `/create:agent` now generates v1.1.1 compliant agent files

---

### Upgrade

Existing agents with `tools:` format continue to work (backwards compatible). New agents should use the `permission:` format. See `agent_template.md` for migration examples.

**Full Changelog**: [v1.0.3.0...v1.0.3.1](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.3.0...v1.0.3.1)

---

## [**1.0.3.0**] - 2026-01-04

Adds support for alternative specs folder location inside `.opencode/`. Memory files and spec folders can now be stored in either `specs/` (project root) or `.opencode/specs/` for projects that prefer keeping all OpenCode files in a hidden directory.

---

### New

1. **Dual Specs Location** — `specs/` OR `.opencode/specs/`: Both locations now supported for spec folders and memory files
2. **Precedence Rule** — Project root location takes precedence if both exist

---

### Changed

**File Updates (10 files)**

1. `context-server.js`: Path validation updated for dual locations
2. `memory-parser.js`: Scans both `specs/` and `.opencode/specs/` directories
3. `generate-context.js`: Supports spec folder in either location
4. `config.js`: Updated path configuration
5. `workflow.js`: Dual location awareness
6. `collect-session-data.js`: Updated data collection paths
7. `directory-setup.js`: Creates folders in correct location
8. `folder-detector.js`: Detects specs in both locations
9. `MCP - Spec Kit Memory.md`: Documentation updated with examples

---

### Fixed

1. **Cross-Repo Symlink** — `INSTALL_GUIDE.md` in Public repo now points locally instead of to external project

---

### Upgrade

No action required. Existing `specs/` folders continue to work unchanged.

**Full Changelog**: [v1.0.2.9...v1.0.3.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.9...v1.0.3.0)

---

## [**1.0.2.9**] - 2026-01-02

Fixes critical MCP server bugs preventing Spec Kit Memory operations. Multiple import naming mismatches caused E040 errors (`is not a function`) across `memory_health`, `memory_index_scan`, and `memory_save` tools.

---

### Fixed

1. **Critical: getDatabasePath** — `getDatabasePath` → `get_database_path` method name mismatch:
   - `mcp_server/context-server.js:1454` (health check response)
   - `mcp_server/lib/vector-index.js:100` (database path resolution)
2. **Critical: validateFilePath** — `validateFilePath` → `validate_file_path` import mismatch:
   - `mcp_server/context-server.js:55`
   - `mcp_server/lib/vector-index.js:13`
3. **Critical: Error Handlers** — `isTransientError` / `userFriendlyError` → `is_transient_error` / `user_friendly_error` import mismatch:
   - `mcp_server/context-server.js:214`
4. **Critical: escapeRegex** — `escapeRegex` → `escape_regex` import mismatch:
   - `mcp_server/lib/trigger-matcher.js:7`
   - `mcp_server/lib/memory-parser.js:9`

**Root Cause:** During snake_case refactoring, exports in source modules (`shared/utils.js`, `lib/errors.js`) were renamed but imports in consuming files retained camelCase names. Fixed using import aliasing: `const { snake_case: camelCase } = require(...)`

**Full Changelog**: [v1.0.2.8...v1.0.2.9](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.8...v1.0.2.9)

---

## [**1.0.2.8**] - 2026-01-02

Reorganizes the workflows-documentation skill's asset folder structure for improved discoverability. Renames `assets/components/` to `assets/opencode/` and `assets/documents/` to `assets/documentation/` with 250+ path reference updates across 35+ files. Establishes new organizational principle for skill folder structure.

---

### Changed

1. **Asset Folders Renamed**:
   - `assets/components/` → `assets/opencode/` (OpenCode component templates: skills, agents, commands)
   - `assets/documents/` → `assets/documentation/` (document templates: README, install guides, frontmatter)
2. **250+ Path References Updated** across: `SKILL.md` · 7 reference files · 9 asset files · `AGENTS.md` · `write.md` agent · 7 command files · 2 install guides
3. **New Organizational Principle** established and documented:
   - `references/` = FLAT (no subfolders) for simpler AI agent discovery
   - `assets/` = Subfolders ALLOWED for grouping related templates
   - `scripts/` = Typically flat, subfolders OK for large collections
4. **Templates Updated** — `skill_md_template.md` with "Folder Organization Principle" section; `skill_creation.md` with folder guidance

---

### Fixed

1. **Duplicate File** — Deleted duplicate `INSTALL_GUIDE.md` in mcp-figma skill root
2. **Broken Paths** — Fixed 3 broken paths in mcp-figma (removed erroneous `/MCP/` from paths)

**Full Changelog**: [v1.0.2.7...v1.0.2.8](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.7...v1.0.2.8)

---

## [**1.0.2.7**] - 2026-01-02

Addresses critical runtime errors, code quality issues, and documentation misalignments discovered by a 20-agent parallel scan.

---

### Fixed

**Critical Fixes**

1. **workflow.js:19** — Added missing `collectSessionData` import that would cause runtime error
2. **workflow.js:63** — Empty catch block now logs database notification errors instead of silently swallowing them
3. **input-normalizer.js:113,299** — Changed default descriptions from "Modified during session" (flagged as garbage by file-helpers.js) to meaningful defaults: "File modified (description pending)", "Edited via edit tool", "Created via write tool"

**Code Quality Fixes**

4. **decision-tree-generator.js:17-20** — Replaced aggressive `process.exit(1)` with graceful fallback - workflow continues with simplified output when `ascii-boxes` library unavailable
5. **diagram-extractor.js:35-43** — Fixed inverted null check order - now verifies object existence before property access

**Documentation Fixes**

6. **mcp_server/README.md** — Tool count corrected 13→14 (5 locations), file watcher claim clarified as "not yet implemented"
7. **SKILL.md:179,234** — Module count corrected 30→44, directory count 6→10, line count 145→142
8. **scripts/README.md:138,398** — Line count corrected 145→142
9. **debug.md:362** — Path corrected to include `debugging/` subfolder for `universal_debugging_methodology.md`
10. **handover.md** — Removed references to non-existent Gates (0, 7) - now references AGENTS.md Section 2
11. **resume.md** — Removed references to non-existent Gates (0.5, 4) - now references Memory Context Loading
12. **implement.md:222,230** — Step count corrected 8→9
13. **complete.md** — Gate 4/5 references updated to "Memory Context Loading" / "Memory Save Rule"
14. **spec_kit_complete_*.yaml** — Gate 5 references updated to "Memory Save Rule Enforcement"
15. **spec_kit_debug_*.yaml** — Path corrected to include `debugging/` subfolder

---

### Verification

- All 44 JavaScript modules pass syntax check
- 25 bug fix tests pass, 0 failures
- Integration test passes (generate-context.js --help)
- All 3 repos (project-site, Public, project/coder) verified in sync

**Full Changelog**: [v1.0.2.6...v1.0.2.7](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.6...v1.0.2.7)

---

## [**1.0.2.6**] - 2026-01-02

Major architectural refactoring release for the Spec Kit Memory system. The generate-context.js script undergoes complete modularization from a 4,800-line monolith to a 142-line CLI entry point with 30 focused modules across 6 directories. Includes comprehensive code style standardization, test reorganization, 20-agent documentation alignment scan, and cross-repo synchronization.

---

### New

1. **Modular Architecture** — `generate-context.js` reduced from 4,800 lines to 142-line CLI entry point (97% reduction)
2. **30 New Modules** across 6 directories:
   - `core/` (3 files): config.js · index.js · workflow.js (539 lines main orchestration)
   - `extractors/` (9 files): session · conversation · decision · diagram · file · implementation-guide extractors
   - `utils/` (10 files): data-validator · file-helpers · input-normalizer · logger · message-utils · path-utils · prompt-utils · tool-detection · validation-utils
   - `renderers/` (2 files): template-renderer · index.js
   - `spec-folder/` (4 files): alignment-validator · directory-setup · folder-detector · index.js
   - `loaders/` (2 files): data-loader · index.js
3. **INDEXING NOTE** section in AGENTS.md explaining MCP server database connection behavior
4. **INSTALL_GUIDE.md Symlinks** in `mcp_server/` folders for all 3 repos
5. **Complete A-to-Z Verification Suite** — File structure (34 files), syntax check, import/export verification, integration test

---

### Changed

1. **Test Scripts Reorganized** to `scripts/tests/` folder: `test-bug-fixes.js` · `test-embeddings-factory.js` · `test-validation.sh`
2. **31 JavaScript Files Standardized** with workflows-code style:
   - 3-line box-drawing headers (`// ───` format)
   - Numbered section headers (`/* ─── 1. SECTION ─── */`)
   - ~1,000 lines of JSDoc blocks and inline comments removed
3. **AGENTS.md EXECUTION Section** restructured with `[script]` placeholder pattern
4. **8 Documentation Files** updated with new test folder paths
5. **scripts-registry.json** paths updated for test file locations

---

### Fixed

1. **4 Failing Bug Tests** — Naming convention mismatches in test definitions
2. **AGENTS.md** — Missing full script path in MEMORY SAVE RULE execution examples
3. **mcp_server/README.md line 404** — Relative path → full path
4. **references/structure/folder_routing.md** — 5 short path references → full paths
5. **shared/embeddings/README.md** — Broken relative link `../../generate-context.js` → `../../scripts/generate-context.js`
6. **shared/embeddings/README.md** — Misleading label `lib/README.md` → `shared/README.md`
7. **test-bug-fixes.js** — ROOT path updated for new tests/ folder location

---

### Verification

- 27 bug fix tests: 25 passed, 0 failed, 2 intentionally skipped
- All 34 JavaScript files pass syntax check
- All module imports resolve correctly
- Integration test creates valid memory output file

**Full Changelog**: [v1.0.2.5...v1.0.2.6](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.5...v1.0.2.6)

---

## [**1.0.2.5**] - 2026-01-02

Security and documentation release fixing hardcoded API key exposure in `.utcp_config.json` and broken install script configuration. Adds comprehensive documentation for Narsil's three neural embedding backends (Voyage AI, OpenAI, Local ONNX) and HTTP server visualization setup.

---

### Security

1. **CWE-798 (Hardcoded Credentials)** — Fixed hardcoded `VOYAGE_API_KEY` in `.utcp_config.json` - now uses `${VOYAGE_API_KEY}` variable reference loaded from `.env`

---

### Fixed

1. **Invalid Config** — `install-narsil.sh` generating invalid config with `_note`, `_neural_backends` fields that break Code Mode parsing
2. **Missing Flag** — Missing `--watch` flag in all recommended Narsil configurations

---

### Added

1. **Neural Backend Comparison** — Table showing all 3 options: Voyage AI (recommended) · OpenAI · Local ONNX
2. **Configuration Examples** — Separate examples for each neural backend in install guide
3. **HTTP Server Documentation** — Stdin pipe trick (`tail -f /dev/null |` to prevent EOF shutdown)
4. **Visualization Docs** — Symbol/Hybrid view parameter requirements (`root`, `repo`)

---

### Changed

1. All Narsil config examples now include `--watch` flag for auto-reindexing
2. API key references changed from hardcoded values to `${VOYAGE_API_KEY}` variable syntax
3. Install script help text expanded with Neural Search Backends section

**Full Changelog**: [v1.0.2.4...v1.0.2.5](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.4...v1.0.2.5)

---

## [**1.0.2.4**] - 2026-01-01

Major infrastructure release with critical bug fixes, security hardening, MCP install automation, and comprehensive codebase standardization across 70+ files. Adds sub-agent delegation for token efficiency and universal stack-agnostic debugging.

---

### Fixed

**Critical**

1. **SQLite Transaction Nesting** — Error in `memory_index_scan` - `indexMemory()` now uses composable `database.transaction()` wrapper
2. **Race Condition** — Database changes weren't visible across MCP/script connections - added file-based notification with `reinitializeDatabase()`
3. **Orphaned Metadata** — Failed vector insertions leaving orphaned metadata - explicit transaction control with rollback

**High**

4. **Wrong Dimensions** — Schema created with wrong embedding dimensions before provider warmup - `getConfirmedEmbeddingDimension()` with polling
5. **Cache Invalidation** — Constitutional cache didn't invalidate on external database edits - mtime tracking added
6. **Rate Limiting** — State lost on server restart - persistent `config` table in SQLite
7. **Stale Statements** — Stale prepared statements after database reset - `clearPreparedStatements()` in reset paths
8. Query validation for whitespace-only/empty/null inputs
9. UTF-8 BOM (EF BB BF) detection in memory parser
10. Cache key collision risk - SHA256 hash-based keys
11. Non-interactive mode silently using defaults - now fails with guidance
12. Orphaned vectors never auto-cleaned - `verifyIntegrity({ autoClean: true })`

---

### Security

1. **CWE-22** — Path traversal protection in CLI `CONFIG.DATA_FILE` and DB-stored paths
2. **CWE-400** — Input length limits for MCP tool parameters (query 10K, title 500, paths 500 chars)
3. MEDIUM severity issues reduced from 4 to 1

---

### Added

1. **MCP Install Scripts Suite** — Shell-based installers for all 6 MCP servers with shared utilities library (33 functions)
2. **Sub-agent Delegation** — `/spec_kit:handover` and `/memory:save` now delegate heavy work to sub-agents for token efficiency
3. **Session Behavior Modes** — `--brief`, `--verbose`, `--debug` flags for controlling response verbosity
4. **Universal Debugging** — Stack-agnostic 4-phase approach (Observe → Analyze → Hypothesize → Fix) with new reference doc
5. **Auto/Confirm Modes** — 6 `/create` commands now support `:auto` and `:confirm` mode flags
6. **Research Chaining** — `/spec_kit:complete` supports `:with-research` and `:auto-debug` flags
7. Configurable scoring weights for smart ranking (`smartRanking.recencyWeight`)
8. Configurable trigger phrase limit via `maxTriggersPerMemory`
9. Plain-language gates (~50+ "STOP HERE - Wait for X" markers) in 16 command files
10. "What Next?" navigation tables in 14 commands
11. Confidence checkpoints in 9 YAML workflow files

---

### Changed

1. **References Reorganized** — 18 files moved from flat structure into 7 logical sub-folders (`config/`, `debugging/`, `memory/`, `structure/`, `templates/`, `validation/`, `workflows/`)
2. **79 Internal Links Fixed** across reference documentation
3. **Lib Consolidation** — Shared modules centralized in `lib/` folder with re-export wrappers
4. **Asset Template Alignment** — 9 asset files standardized across 6 skill folders
5. **workflows-code Skill** — Priority-based resource loading (P1/P2/P3), references reorganized into 5 sub-folders
6. **Code Style Alignment** — 70 files standardized with snake_case naming, 3-line box-drawing headers, ~3,900 lines metadata removed
7. `/spec_kit:debug` made stack-agnostic - removed frontend-specific tool references
8. `implementation-summary.md` now required for all spec levels
9. Template priority standardized to P0/P1/P2 only

**Full Changelog**: [v1.0.2.3...v1.0.2.4](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.3...v1.0.2.4)

---

## [**1.0.2.3**] - 2025-12-31

Comprehensive Spec Kit & Memory system audit with test suite fixes, documentation improvements, and new Script Registry for dynamic script discovery.

---

### Fixed

1. **Test Fixtures Renamed** — 51 fixtures updated to follow `###-short-name` naming convention
2. **Template Marker** — Added `SPECKIT_TEMPLATE_SOURCE` marker to all test fixture frontmatter
3. **Validation Rule** — FRONTMATTER_VALID rule now skips template marker check for test-fixtures/ directory
4. **Test References** — Updated test-validation.sh references to match renamed fixtures
5. **Test Suite** — All 55 validation tests now pass (previously 90%+ failed)

---

### Added

1. **Script Registry** — `scripts-registry.json` - Centralized JSON config for all 14 scripts and 9 rules
2. **Registry Loader** — `registry-loader.sh` - CLI tool to query script registry
3. **Test Fixtures** — 41 new fixtures for comprehensive edge case coverage
4. **Documentation** — `memory_search` query/concepts requirement (E040 error prevention)
5. **Documentation** — Indexing persistence gap between script and MCP server

---

### Changed

1. `memory_search` documentation clarified: `query` OR `concepts` parameter is REQUIRED
2. `check-frontmatter.sh` now supports `SKIP_TEMPLATE_CHECK=1` environment variable
3. Updated AGENTS.md, SKILL.md, and memory_system.md with parameter requirements

---

### Removed

1. Deprecated `mcp_server/INSTALL_GUIDE.md` (duplicate of install_guides/MCP/MCP - Spec Kit Memory.md)

**Full Changelog**: [v1.0.2.2...v1.0.2.3](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.2...v1.0.2.3)

---

## [**1.0.2.2**] - 2025-12-31

Security patch fixing HIGH severity DoS vulnerability in `qs` dependency. Documentation updated with complete MCP tool reference for resume command.

---

### Security

1. **HIGH (CVE-2025-15284)** — Fixed DoS vulnerability in `qs` query string parser (6.14.0 → 6.14.1) - `arrayLimit` bypass via bracket notation allowed memory exhaustion. Transitive through `express@5.2.1`.

---

### Changed

1. **resume.md Command** — Added 8 missing MCP tools to Section 6 (MCP Tool Usage):
   - Memory tools: `memory_delete`, `memory_update`, `memory_validate`, `memory_index_scan`, `memory_health`
   - Checkpoint tools: `checkpoint_create`, `checkpoint_list`, `checkpoint_delete`
2. Added example invocations for all new MCP tools

**Full Changelog**: [v1.0.2.1...v1.0.2.2](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.1...v1.0.2.2)

---

## [**1.0.2.1**] - 2025-12-31

Comprehensive system hardening release with critical bug fixes, security improvements, and performance optimizations for the Spec Kit Memory system.

---

### Fixed

**Critical**

1. **Embedding Dimension Mismatch** — Checkpoints now use dynamic dimension detection instead of hardcoded 768, fixing failures with Voyage (1024) and OpenAI (1536) providers
2. **Dimension Detection** — `getEmbeddingDimension()` now correctly detects dimension from provider, environment variables, or API keys before falling back to default

**High**

3. Memory indexing failures caused by dimension validation mismatches
4. Empty catch blocks that silently swallowed errors (2 fixed with proper logging)
5. Blocking file I/O replaced with async `fs.promises.readFile`
6. Stale documentation references to deleted files
7. Architecture diagram showing incorrect folder paths
8. Version inconsistencies in context-server.js (now 16.0.0)

---

### Added

1. **Embedding Cache** — LRU cache (1000 entries) reduces redundant API calls
2. **Shared Utilities** — `shared/utils.js` consolidated `validateFilePath` and `escapeRegex` utilities
3. **Parallel Embeddings** — 3-5x faster with configurable concurrency (default: 5)
4. **Test Fixtures** — 37 files across 10 folders for validation testing
5. **Unicode Normalization** — Improved trigger phrase matching
6. **Constitutional Scanning** — Auto-scanning in `memory_index_scan`
7. **Dry Run** — `dryRun` parameter for `memory_delete` to preview before executing
8. **New Validation Scripts** — `check-folder-naming.sh`, `check-frontmatter.sh`
9. **Help Flag** — `--help` flag for `generate-context.js`
10. **Tool Documentation** — 8 missing MCP tools documented in SKILL.md (now 14 total)

---

### Changed

1. **Lib Consolidation** — Shared modules moved to `shared/` folder with re-export wrappers for backward compatibility
2. All hardcoded paths now use environment variables for portability
3. Deprecated JS validators removed (bash validators preferred)
4. Template metadata formats standardized

---

### Security

1. **CWE-22** — Added path validation to CLI `CONFIG.DATA_FILE`
2. **CWE-22** — Added `validateFilePath()` checks for DB-stored paths
3. **CWE-400** — Added input length limits to MCP handler parameters
4. Removed personal path references from public release
5. Fixed symlinks pointing to personal directories

**Full Changelog**: [v1.0.2.0...v1.0.2.1](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.2.0...v1.0.2.1)

---

## [**1.0.2.0**] - 2025-12-30

Technical debt remediation for Spec Kit Memory system with 6 infrastructure improvements. Comprehensive skill audit standardizing documentation across 7 skills. New mcp-figma skill added for design-to-code workflows.

---

### Added

1. **mcp-figma Skill** — 18 tools for Figma integration
2. **Debug Command Assets** — `/spec_kit:debug` with auto and confirm modes
3. **Test Fixtures** — 37 files across 10 folders for validation scripts

---

### Changed

1. Standardized RELATED RESOURCES section across all SKILL.md files
2. Section reordering and content cleanup in multiple skills

---

### Fixed

1. Unicode normalization for international trigger phrase matching
2. Constitutional directory auto-scanning with `includeConstitutional` parameter
3. Portable paths via environment variables
4. Deprecated JS validators removed
5. `memory_delete` now supports `dryRun: true` for safe preview

**Full Changelog**: [v1.0.1.7...v1.0.2.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.7...v1.0.2.0)

---

## [**1.0.1.7**] - 2025-12-30

Enhanced install guides with comprehensive H1 descriptions for all MCP servers. Added new `/create:agent` command.

---

### Added

1. **Create Agent Command** — `/create:agent` with 5-phase workflow for agent creation
2. **Agent Template** — `agent_template.md` for consistent agent structure

---

### Changed

1. All MCP install guides now include detailed H1 descriptions
2. `command_template.md` reduced 27% by removing duplication

**Full Changelog**: [v1.0.1.6...v1.0.1.7](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.6...v1.0.1.7)

---

## [**1.0.1.6**] - 2025-12-30

Fixes critical Narsil MCP parameter naming issues across all 39 high-priority tools. Adds HTTP server scripts for reliable search functionality.

---

### Added

1. **Server Script** — `narsil-server.sh` for HTTP server management
2. **Search Wrapper** — `narsil-search.sh` CLI wrapper for reliable search
3. **Index Documentation** — Index dependency documentation

---

### Breaking

Parameter names changed in all Narsil tools:
- `kind` → `symbol_type` in symbol queries
- `name` → `symbol` in definition lookups
- `function_name` → `function` in call graph tools
- Added `repo: "unknown"` requirement for all tools

**Full Changelog**: [v1.0.1.5...v1.0.1.6](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.5...v1.0.1.6)

---

## [**1.0.1.5**] - 2025-12-29

Documents JavaScript-specific Narsil limitations discovered during testing.

---

### Known Issues

1. Call graph empty for JavaScript (tree-sitter limitation)
2. Security scan limited (backend-focused rules)
3. Neural search stale after index clear

---

### Working

1. `find_symbols` for symbol discovery
2. `get_symbol_definition` for definitions
3. `get_file` for file content
4. Git integration features

**Full Changelog**: [v1.0.1.4...v1.0.1.5](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.4...v1.0.1.5)

---

## [**1.0.1.4**] - 2025-12-29

Documents discovered Narsil bugs and limitations with workarounds.

---

### Added

1. **Skill Creation Guide** — Required templates and file locations
2. **Skill Advisor Config** — Documentation (Section 12)

---

### Known Issues

1. Persistence bug: indexes regenerate ~45-60s on startup
2. Unicode bug: box-drawing characters crash chunking

**Full Changelog**: [v1.0.1.3...v1.0.1.4](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.3...v1.0.1.4)

---

## [**1.0.1.3**] - 2025-12-29

Documents Narsil's HTTP server and React frontend for interactive code graph visualization.

---

### Added

1. **HTTP Backend** — Server (port 3000) for graph data
2. **React Frontend** — Interactive visualization (port 5173)
3. **Graph Views** — Five types: `import` · `call` · `symbol` · `hybrid` · `flow`

---

### Fixed

1. Tool names corrected in documentation
2. Language count: 16 → 15

**Full Changelog**: [v1.0.1.2...v1.0.1.3](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.2...v1.0.1.3)

---

## [**1.0.1.2**] - 2025-12-29

Adds project-local Narsil index support for isolated per-project indexing.

---

### Added

1. **Project-Local Index** — `.narsil-index/` instead of shared `~/.cache/narsil-mcp/`
2. **Persist Flag** — `--persist` for index persistence
3. **Custom Path** — `--index-path` option for custom index location
4. **Manual Save** — `save_index` tool for manual saves
5. **HTTP Server Mode** — Documentation

**Full Changelog**: [v1.0.1.1...v1.0.1.2](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.1...v1.0.1.2)

---

## [**1.0.1.1**] - 2025-12-29

Fixes Narsil neural search configuration for embedding dimension compatibility.

---

### Fixed

1. **Embedding Model** — `voyage-code-3` (1024-dim) → `voyage-code-2` (1536-dim) for correct embedding dimensions
2. **Frontmatter** — Invalid frontmatter in search commands

**Full Changelog**: [v1.0.1.0...v1.0.1.1](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.1.0...v1.0.1.1)

---

## [**1.0.1.0**] - 2025-12-29

Complete migration from LEANN to Narsil for unified code intelligence. Adds 76 specialized tools covering semantic search, security scanning, and call graph analysis.

---

### Breaking

1. LEANN completely removed
2. `leann_leann_search()` → `narsil.narsil_neural_search()`
3. LEANN MCP → Narsil (via Code Mode)
4. `mcp-leann` skill → `mcp-narsil` skill
5. MLX embeddings → Voyage/OpenAI/ONNX backends
6. Skills reduced from 8 to 7

**Full Changelog**: [v1.0.0.8...v1.0.1.0](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.8...v1.0.1.0)

---

## [**1.0.0.8**] - 2025-12-29

Consolidates embedding options to MLX + Qwen3 as the single path.

---

### Changed

1. LEANN for code search (`src/` directories)
2. Spec Kit Memory for document search (`specs/`, `.opencode/`)
3. Removed Voyage, Gemini, and Contriever embedding options

**Full Changelog**: [v1.0.0.7...v1.0.0.8](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.7...v1.0.0.8)

---

## [**1.0.0.7**] - 2025-12-29

Major semantic search upgrade with Qwen3 embedding model.

---

### Added

1. **Qwen3 Embeddings** — `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` with 4-bit quantization
2. **Progressive Indexing** — Progressive scope indexing for large projects

---

### Changed

1. AGENTS.md made frontend/backend agnostic

**Full Changelog**: [v1.0.0.6...v1.0.0.7](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.6...v1.0.0.7)

---

## [**1.0.0.6**] - 2025-12-29

Strengthens write agent enforcement for /create commands.

---

### Added

1. HARD BLOCK section for write agent enforcement
2. Prompt prefix requirement
3. Prerequisite check validation
4. Validation command for skill creation

**Full Changelog**: [v1.0.0.5...v1.0.0.6](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.5...v1.0.0.6)

---

## [**1.0.0.5**] - 2025-12-29

Enforces @write agent for skill creation with multi-layer enforcement.

---

### Added

1. Skill creation requires `@write` agent prefix
2. HARD BLOCK enforcement for write agent
3. Prompt prefix and prerequisite checks

---

### Changed

1. Quick Reference updated with CDN deployment workflow
2. Quick Reference updated with JS minification workflow
3. Narsil added to Code Mode examples

**Full Changelog**: [v1.0.0.4...v1.0.0.5](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.4...v1.0.0.5)

---

## [**1.0.0.4**] - 2025-12-29

Complete skill system overhaul standardizing 69 reference/asset files across all 8 skills.

---

### Added

1. `execution_methods` reference
2. `folder_structure` reference
3. `environment_variables` reference
4. `memory_system` reference
5. `cdn_deployment` reference
6. `minification_guide` reference

---

### Changed

1. Standardized structure for all 8 skills (69 files total)
2. SKILL.md reduced 24% through better organization

---

### Fixed

1. Hardcoded paths throughout skills
2. Broken anchor links

**Full Changelog**: [v1.0.0.3...v1.0.0.4](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.3...v1.0.0.4)

---

## [**1.0.0.3**] - 2025-12-29

Constitutional memory system improvements with 4x token budget increase.

---

### Added

1. Constitutional README documentation
2. `cleanup-orphaned-vectors.js` utility
3. New triggers: `build`, `generate`, `configure`, `analyze`

---

### Changed

1. Token budget increased from ~500 to ~2000 tokens (~8000 characters)
2. Gate enforcement restructured with First Message Protocol [HARD BLOCK]
3. 4-step Violation Recovery process
4. 5 ANCHOR sections for memory format

**Full Changelog**: [v1.0.0.2...v1.0.0.3](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.2...v1.0.0.3)

---

## [**1.0.0.2**] - 2025-12-29

Continued post-release refinement with 80+ bug fixes.

---

### Fixed

1. Duplicate entries in checkpoints
2. Orphaned file detection
3. Broken skill references
4. Gate numbering inconsistencies
5. Hardcoded paths throughout
6. Transaction safety issues
7. Missing validators added
8. Anchor links fixed
9. Embedding rollback support
10. Index migration handling
11. Cascade delete for orphans

---

### Changed

1. AGENTS.md made fully universal (no project-specific patterns)
2. Symlinks converted to relative paths

**Full Changelog**: [v1.0.0.1...v1.0.0.2](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.1...v1.0.0.2)

---

## [**1.0.0.1**] - 2025-12-29

First post-release refinement focusing on structural reorganization and critical bug fixes.

---

### Changed

1. Skills, commands, guides, scripts, and agents moved to `.opencode/` folder
2. AGENTS.md made fully codebase-agnostic

---

### Fixed

1. **P0**: Duplicate checkpoint entries
2. **P0**: Orphaned file detection
3. **P0**: Broken skill references
4. **P0**: Gate numbering issues
5. **P0**: Hardcoded paths
6. **P0**: Transaction safety
7. **P1**: Missing validators
8. **P1**: Embedding rollback
9. **P1**: LEANN naming consistency
10. **P1**: Error codes standardized

**Full Changelog**: [v1.0.0.0...v1.0.0.1](https://github.com/MichelKerkmeester/opencode-spec-kit-framework/compare/v1.0.0.0...v1.0.0.1)

---

## [**1.0.0.0**] - 2025-12-29

First official release of the OpenCode Dev Environment.

---

### Added

1. **Spec Kit** — Unified documentation system with automation, slash commands, integrated semantic memory, and sub-folder versioning
2. **Skills Framework** — 8 domain-specific skills that auto-load based on task
3. **Semantic Memory** — Custom MCP server with hybrid search (vector + FTS5), 6 importance tiers, and proactive context surfacing
4. **Gate Enforcement** — Mandatory gates verify completion and enforce documentation
5. **Memory Integration** — Memory files live inside spec folders with deep integration
6. **Templates** — 10 purpose-built templates
7. **Slash Commands** — 7 commands with `:auto`/`:confirm` modes
8. **Automation Scripts** — 11 scripts
9. **Completeness Scoring** — 0-100% scoring

---

### Features

1. Persistent memory across sessions, models, projects
2. Gate 3 enforces spec folders on every change
3. ADRs in decision-record.md, searchable forever
4. `/spec_kit:handover` produces 15-line summary
5. `/spec_kit:debug` spawns sub-agent with full context
6. Semantic search by meaning, not text
7. <50ms proactive surfacing before you ask
8. Checkpoints = undo button for your index

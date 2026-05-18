---
title: "Implementation Plan: 013 Doctor Update Orchestrator"
description: "Five-phase plan for authoring 4 isolated doctor commands + 1 unified /doctor:update orchestrator + migration manifest. Phase A scaffolds the packet; Phase B authors isolated commands; Phase C authors orchestrator implementing council 10-line spec; Phase D adds migration manifest; Phase E runs verification gates G1-G9."
trigger_phrases:
  - "010-doctor-update-orchestrator plan"
  - "doctor command authoring plan"
  - "council 10-line spec"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-initial-doctor-commands"
    last_updated_at: "2026-05-09T11:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 plan with 5 phases + dispatch design"
    next_safe_action: "Author tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-doctor-update-orchestrator"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 013 Doctor Update Orchestrator

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter; Python pseudocode in some YAML asset blocks |
| **Framework** | OpenCode command system (`.opencode/commands/<namespace>/<name>.md` + `assets/<command>_<mode>.yaml`) |
| **Storage** | Flat files; new SQLite databases inherited from existing MCP server tools |
| **Implementer** | Claude Opus 4.7 (this session) for Phase A; optionally cli-opencode/cli-codex for Phase B/C parallelization |
| **Reviewer** | Claude Opus 4.7 (this session) |
| **Validation** | `validate_document.py --type command` per command; YAML canonical-path validator; spec strict-validate; G1-G9 smoke tests |

### Overview

Five phases. Phase A authors the 6 packet docs (this file is part of A). Phase B authors 4 isolated doctor commands matching the canonical `/doctor:code-graph` shape (one Markdown entrypoint + one single-mode YAML asset per command). Phase C authors the unified `/doctor:update` orchestrator implementing the Multi-AI Council's 10-line spec verbatim. Phase D adds the migration manifest for users skipping versions. Phase E runs G1-G9 verification gates.

The headline deliverable is `/doctor:update` — the one-shot orchestrator that detects stale subsystems, snapshots all SQLite databases, rebuilds in dependency-safe order, validates with gold-battery checks per subsystem, and rolls back on regression. Tier-aware interactive mode keeps short rebuilds (skill-graph, deep-loop) silent while prompting explicitly for the long-pole memory rebuild (5-15 min runtime).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] spec.md REQ-001..REQ-023 reviewed and understood
- [ ] User-locked answers captured (location, scope, council lens)
- [ ] Existing `/doctor:code-graph.md` + single YAML asset fully read (canonical pattern source)
- [ ] Multi-AI Council 10-line spec captured in decision-record.md
- [ ] Pre-change inventory: existing 5 doctor commands + their YAML count + their reuse-able patterns
- [ ] Current branch is `main`; no auto-branch from `create.sh` lingering

### Definition of Done

- [ ] All P0 requirements (REQ-001..REQ-008) verified with evidence
- [ ] All P1 requirements (REQ-010..REQ-017) verified or deferred with documented reason
- [ ] All 5 command Markdown files pass `validate_document.py --type command`
- [ ] All 10 YAML asset files load + canonical-path-validate
- [ ] G1-G9 verification gates pass (per spec.md §SC + this plan §5)
- [ ] Strict spec-folder validate exits 0
- [ ] `decision-record.md` captures 7 council ADRs + tx-model finding (ADR-001)
- [ ] `_memory.continuity` blocks updated across packet docs
- [ ] `implementation-summary.md` authored with `completion_pct: 100` only after all gates green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Markdown entrypoint + single YAML asset.** Established by `/doctor:code-graph`. Each command has one `*.md` file at `commands/doctor/` defining frontmatter, Execution Protocol, Constraints, and Unified Setup Phase. Setup Phase resolves all inputs (scope and flags) in a single consolidated user prompt, then loads the corresponding YAML from `assets/`. The YAML executes a phased workflow with per-phase canonical-path validation, mutation boundaries, and rollback.

### Key Components

- **Markdown layer** (per-command `*.md`) — frontmatter + Execution Protocol + Constraints + Unified Setup Phase + Reference Sections.
- **YAML layer** (single-mode `*.yaml`) — phased workflow with `validate_targets`, `snapshot`, `mutate`, `post-verify`, `rollback` phases.
- **Canonical-path validator** (existing pattern) — Phase N first activity, validates allowed_targets + forbidden_targets via realpath + glob match.
- **State-log layer** (`.doctor-update.last-run.json`) — orchestrator-only; per-step start/end/duration/exit + snapshot paths.
- **Migration manifest** (`migration-manifest.json`) — per-version deprecations + script declarations.

### Dependency DAG (council Step 6)

```
Step 1: code_graph_scan        (foundation)
   ↓
Step 2: memory_index_scan      (calls code_graph_context for link suggestions)
   ↓
Step 3: causal_edges init      (lazy in context-index)
   ↓
Step 4: skill_graph_scan       (independent of memory)
   ↓
Step 5: advisor_rebuild        (reads skill-graph)
   ↓
Step 6: deep_loop_graph upsert (lazy init)
   ↓
Step 7 (optional): eval_run_ablation (measurement only)
```

### Single-Mode Routing (council Q5, superseded by ADR-010)

| Invocation | Behavior | Snapshot? | Prompts? |
|------------|----------|-----------|----------|
| `/doctor:update` | Status check first, then tier-aware interactive execution | Mandatory before mutation unless explicitly disabled for safe diagnostic runs | Short auto-ack, medium combined prompt, long-pole ETA prompt |

### Data Flow

```
/doctor:update [flags]
   ↓
Markdown Setup Phase: resolve flags + status preview
   ↓
YAML Phase 1: acquire flock + probe MCP-client activity
   ↓
YAML Phase 2: snapshot all *.sqlite via VACUUM INTO
   ↓
YAML Phase 3: status check (parallel) + render dashboard
   ↓
YAML Phase 4 (if --migrate): run migration-manifest Phase 0
   ↓
YAML Phase 5: dependency-ordered execution (with tier prompts)
   ↓
YAML Phase 6: post-run gold-battery validation
   ↓
YAML Phase 7: state-log + flock release + snapshot cleanup
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Scaffold 013 packet (this session)

- [x] Author `spec.md` (Level 2, REQ-001..REQ-023)
- [ ] Author `plan.md` (this file)
- [ ] Author `tasks.md` (T-001..T-NNN)
- [ ] Author `checklist.md` (P0/P1/P2 per command + cross-orchestrator)
- [ ] Author `resource-map.md` (file ledger)
- [ ] Author `decision-record.md` (7 council ADRs + tx-model placeholder ADR-001)
- [ ] Run `generate-context.js` → `description.json` + `graph-metadata.json`
- [ ] Restore parent `026/graph-metadata.json` manual fields after save
- [ ] Verify branch is `main`; delete any auto-created packet branch

### Phase A.1: Verify memory_index_scan tx model (gating Phase B/C)

- [ ] Read `handlers/memory-index.ts:handleMemoryIndexScan` end-to-end
- [ ] Determine: per-batch commits OR single tx
- [ ] Document finding in `decision-record.md` ADR-001
- [ ] Update Council Q3+Q6 cancel-safety contract in plan.md if needed

### Phase B: Author 4 isolated doctor commands

Per-command authoring follows the canonical pattern. Each command requires:
- 1 Markdown entrypoint (`commands/doctor/<name>.md`) — ~200 LOC
- 1 YAML asset (`assets/doctor_<name>.yaml`) — ~50 LOC each

**B1. `/doctor:memory`** — context-index FTS+vector orchestrator
**B2. `/doctor:causal-graph`** — causal-edges integrity + causal-link
**B3. `/doctor:deep-loop`** — research+review coverage graphs
**B4. `/doctor:cocoindex`** — semantic search index rebuild

Per-command details in spec.md §3 (Per-Command Specification).

**Parallelization option**: dispatch B1-B4 to cli-opencode tracks (one per command, parallel) using the same dispatch-prompt pattern from packet 003. Total wall-clock 1-2 h with parallel dispatch vs 6-8 h serial authoring. Dispatch prompts under `dispatch/track-{b1,b2,b3,b4}.md` if pursued.

### Phase C: Author /doctor:update orchestrator

- 1 Markdown entrypoint (`commands/doctor/update.md`) — ~300 LOC (council 10-line spec + tier-aware routing)
- 1 YAML asset (`assets/doctor_update.yaml`) — ~80 LOC each
- flock primitive + state-log JSON schema (in YAML or external script)
- Cross-subsystem health dashboard rendering logic (in YAML or external Python helper)

This is the longest authoring task (~4 h) and implements the council's 10-line spec verbatim:

1. Acquire flock at `database/.doctor-update.flock`
2. Probe MCP-client activity → warn-and-prompt; `--force` overrides
3. Snapshot every `*.sqlite` via `VACUUM INTO`
4. Status check (parallel) + render dashboard
5. Optional `--migrate`: run `migration-manifest.json` Phase 0
6. Dependency-ordered execution with tier prompts
7. Step failure: one retry, then prompt for rollback or leave-as-is
8. SIGINT: graceful tx-commit + snapshot-restore
9. Post-run gold-battery + rollback on regression
10. State-log + flock release + snapshot cleanup

### Phase D: Migration manifest

- Author `mcp_server/database/migration-manifest.json` declaring per-version blocks for 3.3.0.0, 3.4.0.0, 3.4.1.0
- Optional: per-version migration scripts under `mcp_server/scripts/migrations/`
- Manifest gap detection logic in `/doctor:update --migrate` YAML

### Phase E: Verification (G1-G9)

| Gate | Action |
|------|--------|
| G1 | `validate_document.py --type command` per new `*.md` (5 files) |
| G2 | YAML canonical-path validator per new asset (10 files) |
| G3 | `validate.sh 013-... --strict` exit 0 |
| G4 | `/doctor:update --no-snapshot` smoke on this repo |
| G5 | `/doctor:update` interactive UX with forced-failure injection |
| G6 | Concurrent `/doctor:update` invocations refused |
| G7 | SIGINT mid-rebuild: graceful exit 130 + snapshot restored |
| G8 | `/doctor:update --migrate` with synthetic version skip refused |
| G9 | Cross-subsystem dashboard renders all 7 subsystems |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dispatch-design -->
## 5. DISPATCH DESIGN (Phase B Parallelization Option)

If session time / token budget allows, parallelize Phase B via cli-opencode dispatch (matching packet 003's pattern).

### Model Choice

- **Primary**: `opencode-go/glm-5.1` — established in packet 003 as reliable for command/yaml authoring with absolute paths.
- **Fallback**: `opencode-go/deepseek-v4-pro --pure` — only if GLM hangs.

### Per-Track Prompt Skeleton

```markdown
ROLE: OpenCode doctor command implementer dispatched by Claude Opus 4.7.

TARGET: /doctor:<name> command + 1 YAML asset

CANONICAL PATTERN SOURCE (read first; treat as locked):
- /Users/.../Public/.opencode/commands/doctor/code-graph.md (Markdown entrypoint shape)
- /Users/.../Public/.opencode/commands/doctor/assets/doctor_code-graph.yaml (single interactive YAML)
- /Users/.../Public/.opencode/commands/doctor/assets/doctor_code-graph.yaml (single interactive YAML)
- /Users/.../Public/.opencode/commands/doctor/assets/doctor_code-graph.yaml (single interactive YAML)
- /Users/.../Public/.opencode/commands/doctor/assets/doctor_code-graph.yaml (single interactive YAML)

IN_SCOPE_FILES (only these may be created):
- /Users/.../Public/.opencode/commands/doctor/<name>.md
- /Users/.../Public/.opencode/commands/doctor/assets/doctor_<name>.yaml

HARD CONSTRAINTS:
1. Markdown file passes validate_document.py --type command
2. YAML files load via canonical-path validator
3. Mutation boundaries enforced via realpath + glob match
4. Snapshot before any mutation
5. Post-verify gold-battery before claiming success
6. Rollback on regression with operator-visible recovery

PER-COMMAND EDITS: <bullet list per spec.md §3>

VERIFICATION:
- python3 .opencode/skills/sk-doc/scripts/validate_document.py --type command <md>
- per-YAML schema check

OUTPUT REQUIREMENT:
1. Files created with one-line rationale each
2. Verification output pasted
3. Constraint compliance yes/no per item
4. Halt-and-report on any violation
```

### Failure Recovery (per packet 003 caveats)

| Failure | Recovery |
|---------|----------|
| GLM hangs (no log activity 5+ min) | Kill, re-dispatch with DeepSeek v4 pro `--pure` |
| GLM returns boilerplate | Manual review during Phase E; Edit-tool fix |
| Hallucinated paths | Broken-link grep; Edit-tool fix; do NOT re-dispatch (will hallucinate again) |
| Constraint violation | Revert via `git checkout`; apply minimal Edit-tool fix |
<!-- /ANCHOR:dispatch-design -->

---

<!-- ANCHOR:reuse -->
## 6. REUSE FROM EXISTING PATTERNS

- **`/doctor:code-graph` Markdown shape** (`/doctor:code-graph.md:1-309`) — frontmatter, Execution Protocol, Constraints, Unified Setup Phase, mode-suffix routing, Reference Sections. Reuse 1:1 for all 5 new commands.
- **`/doctor:code-graph` YAML phases** (`assets/doctor_code-graph.yaml`) — `validate_targets`, `snapshot`, `mutate`, `post-verify`, `rollback`. Reuse pattern, customize per-subsystem MCP tool calls.
- **Canonical-path validator** (`doctor_skill-advisor.yaml:49-70`) — realpath + glob match before any write. Reuse verbatim.
- **Repo-rooted invocation** (`init-skill-graph.sh`) — `REPO_ROOT="$(cd ../../.. && pwd)"; cd $REPO_ROOT && python3 ...`. Pattern for any script wrappers.
- **`generate-context.js` for spec-folder metadata** — author description.json + graph-metadata.json via the canonical script. Restore parent manual fields after save.
- **Council 10-line spec** — verbatim implementation contract for `/doctor:update`. Each line maps to a numbered REQ.
- **MCP tool inventory** — leverage `code_graph_status`, `memory_health`, `skill_graph_scan`, `advisor_rebuild`, `deep_loop_graph_status`, `ccc_status`, `eval_run_ablation`. No new MCP server code needed.

## 7. DEFERRED FROM EARLIER PACKETS

Phase 12 (causal-graph-channel-routing) shipped the `causal_edges` table at 1,328 edges with 46.14% coverage. The 60% target is therefore reachable but requires `/doctor:causal-graph` to land first. This packet does NOT raise coverage — it ships the command that raises it. Coverage measurement is post-rebuild gold-battery only.
<!-- /ANCHOR:reuse -->

---

<!--
PLAN-CORE + L2 (~250 lines)
- 5 phases (A scaffold, A.1 tx-verify, B isolated cmds, C orchestrator, D manifest, E verify)
- Markdown + single-mode YAML pattern reused from /doctor:code-graph
- Council 10-line spec implemented verbatim in /doctor:update
- Optional Phase B parallelization via cli-opencode dispatch
- No new MCP server code; doc + yaml + manifest authoring only
-->

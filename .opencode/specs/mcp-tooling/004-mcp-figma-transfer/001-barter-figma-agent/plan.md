---
title: "Implementation Plan: Phase 1 — Barter Figma Agent"
description: "Author the Figma MCP Agent at AI_Systems/Barter/MCP Agents/Figma/ via parallel cli-codex (gpt-5.5 high) dispatches. Knowledge base docs and entry-point files (AGENTS.md, README.md, INSTALL_GUIDE.md) authored concurrently; opus subagent verifies before commit."
trigger_phrases:
  - "barter figma plan"
  - "phase 1 implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/004-mcp-figma-transfer/001-barter-figma-agent"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Plan doc contract normalized"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:891f29307c185e1eee711ca08738dd459191146f636963648c0e4b7933303ef8"
      session_id: "067-001-plan-2026-05-05"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Barter Figma Agent

<!-- ANCHOR:summary -->
## 1. SUMMARY

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

Template compliance scaffold for 001-barter-figma-agent/plan.md; original authored content is retained below.
<!-- /ANCHOR:milestones -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->

---

### 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (docs), Node.js (mcp servers/figma-mcp-stdio/) |
| **Framework** | None for docs; figma-developer-mcp npm package for stdio server |
| **Storage** | Filesystem only |
| **Testing** | sk-doc DQI ≥85 + opus subagent verification (no automated test suite) |
| **Target repo** | `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter` |

### Overview
This phase authors a complete Figma MCP Agent at `Barter/MCP Agents/Figma/` mirroring `Barter/MCP Agents/ClickUp/` exactly. cli-codex (gpt-5.5 high, fast tier) authors all heavy markdown content (~150K total) in parallel dispatches; Claude orchestrates and runs an opus subagent for verification before the single `Figma MCP` commit. Source content lives in `Code_Environment/Public/.opencode/skills/mcp-figma/` (SKILL.md, README.md, INSTALL_GUIDE.md, references/, nodes/, assets/, changelog/).

---

### 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (mcp-figma source content + ClickUp ground truth)

### Definition of Done
- [ ] All 16+ files exist with required content
- [ ] AGENTS.md DAG paths all resolve
- [ ] Persona reframe verified (NOT a designer, NOT a developer)
- [ ] SYNC verb consistency ("Create" only)
- [ ] node_modules bundle ≤50MB (else escalate D5)
- [ ] Opus verification hook B passes
- [ ] `Figma MCP` commit on Barter main

---

### 3. APPROACH

### Strategy
**Author-first, commit-once.** All 16+ files materialize in a single working-tree state before commit. cli-codex dispatches run in parallel where files are independent; sequential where dependencies exist (e.g., AGENTS.md DAG references the knowledge base file paths, so knowledge base files must exist first or AGENTS.md must be authored last).

### Dispatch sequence
1. **Phase 1A — Foundation** (cli-codex parallel):
   - System Prompt v0.100.md
   - SYNC Framework v0.100.md
   - Interactive Intelligence v0.100.md
   - MCP Knowledge v0.100.md
   - Combined Workflows v0.100.md
2. **Phase 1B — Entry points** (cli-codex parallel, after 1A):
   - AGENTS.md (references 1A files in DAG)
   - README.md (User Guide)
   - INSTALL_GUIDE.md
3. **Phase 1C — MCP servers** (parallel):
   - figma-mcp-http/{config-snippets.md, verify.sh}
   - figma-mcp-stdio/{package.json, install.sh, config-snippets.md}
   - npm install in figma-mcp-stdio/ to populate node_modules
4. **Phase 1D — Placeholders** (Claude direct):
   - Favicon.jpg TODO marker
   - context/.gitkeep
5. **Phase 1E — Verification** (opus subagent):
   - DAG resolution
   - knowledge base count + naming
   - persona reframe absence of "developer"/"designer"
   - SYNC verb consistency
   - mcp servers parity with ClickUp
6. **Phase 1F — Commit**:
   - `git -C "<barter-path>" add ...`
   - `git -C "<barter-path>" commit -m "Figma MCP"`

### Branch strategy
Stay on Barter `main`. Don't auto-branch. `Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/spec/create.sh` only auto-branches inside the Public skill repo, not the Barter repo, so this phase is safe.

---

### 4. ARCHITECTURE

### Folder layout (mirrors ClickUp)

```
AI_Systems/Barter/MCP Agents/Figma/
├── AGENTS.md
├── README.md
├── INSTALL_GUIDE.md
├── Favicon.jpg                     # TODO marker
├── context/.gitkeep
├── knowledge base/
│   ├── system/
│   │   ├── Figma - System - Prompt - v0.100.md
│   │   ├── Figma - Thinking - SYNC Framework - v0.100.md
│   │   └── Figma - System - Interactive Intelligence - v0.100.md
│   ├── integrations/
│   │   └── Figma - Integrations - MCP Knowledge - v0.100.md
│   └── reference/
│       └── Figma - Reference - Combined Workflows - v0.100.md
└── mcp servers/
    ├── figma-mcp-http/
    │   ├── config-snippets.md
    │   └── verify.sh
    └── figma-mcp-stdio/
        ├── package.json
        ├── install.sh
        ├── config-snippets.md
        └── node_modules/             # populated by npm install
```

### Persona translation matrix

| Source (Public skill) | Target (Barter agent) |
|---|---|
| "design-to-code bridge" | "Figma MCP Agent" with NOT-designer + NOT-developer boundaries |
| Activation triggers (keywords) | Authority Level supersession + Command Registry |
| Smart-router pseudocode (Python) | Document Loading DAG (markdown table) |
| 7-step technical flow | 9-step Processing Hierarchy with BLOCKING tool verification |
| "Use Code Mode for token efficiency" | SYNC Framework (Survey→Yield→Navigate→Create) + Sequential Thinking Protocol |

### Command Registry mapping

| Command | Shortcut | MCP tools |
|---|---|---|
| `$file` | `$f` | `figma_get_file`, `figma_get_file_versions`, `figma_get_file_nodes` |
| `$node` | `$n` | `figma_get_file_nodes` |
| `$export` | `$e` | `figma_get_image`, `figma_get_image_fills` |
| `$component` | `$c` | `figma_get_file_components`, `figma_get_team_components`, `figma_get_component_sets` |
| `$style` | `$s` | `figma_get_file_styles`, `figma_get_team_styles` |
| `$team` | `$t` | `figma_get_team_projects`, `figma_get_project_files` |
| `$comment` | `$cm` | `figma_get_comments`, `figma_post_comment`, `figma_delete_comment`, `figma_reply_comment` |
| `$auth` | `$a` | `figma_check_api_key` |
| `$interactive` | `$int` | (router only) |

---

### 5. cli-codex DISPATCH PATTERN

### Per-file invocation template

```bash
codex exec \
  -c model="gpt-5.5" \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  --cwd "/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter" \
  "<task description with explicit output path + content requirements + ClickUp template references>"
```

### Parallel dispatch budget
- Max 3 concurrent codex jobs (avoids upstream throttling — see memory rule "Copilot CLI max 3 concurrent" applies to cli-codex too due to similar rate-limit characteristics)
- Phase 1A: 3-job batches (5 files in 2 batches)
- Phase 1B: 3-job batch (3 files in 1 batch, after 1A completes)
- Phase 1C: 1 batch (independent files; quick)

### Per-task input pack
Each cli-codex invocation receives:
- Output absolute path
- ClickUp equivalent file path (read for structure ground truth)
- mcp-figma source paths (read for content seed)
- Persona constraints (4 boundary statements)
- Format constraints (SYNC verb = Create, file-name suffix v0.100, etc.)
- Word/line target

---

### 6. VERIFICATION GATES

### Opus subagent hook B (after Phase 1F dispatch completes)

| Check | Pass criterion |
|---|---|
| DAG resolution | Every `[[link]]` and relative path in AGENTS.md resolves to an existing file |
| Knowledge base count | Exactly 5 `.md` files: 3 in system/, 1 in integrations/, 1 in reference/ |
| File-naming | All 5 follow `Figma - [Category] - [Topic] - v0.100.md` |
| MCP servers parity | Both `figma-mcp-http/` and `figma-mcp-stdio/` exist; stdio has `node_modules/` |
| Persona reframe | Zero occurrences of "developer" or "designer" applied to the agent itself (literal grep for `you are a developer`/`you are a designer`/etc.) |
| Boundary statements | All four NOT statements present in AGENTS.md §1 |
| SYNC verb | Only "Create" — zero "Capture" |
| Favicon marker | `Favicon.jpg` exists as text marker |
| Bundle size | `du -sh figma-mcp-stdio/node_modules/` ≤50MB |

### Failure modes
- DAG broken → re-run AGENTS.md authoring with explicit path list
- Persona drift → re-run that file with stricter persona constraints
- Bundle oversize → invoke D5 escalation: switch to package.json+install.sh-only

---

### 7. ROLLBACK

| Trigger | Action |
|---------|--------|
| cli-codex output malformed | `git -C "<barter-path>" restore .` (no commit yet) |
| Opus hook B fails | Identify failing files; re-dispatch only those; re-verify |
| Bundle size escalation | Apply D5 alternative (package.json + install.sh only); update D5 in decision-record.md |
| Commit fails | `git -C "<barter-path>" reset --soft HEAD` if needed; investigate; re-commit |

---

### 8. NEXT PHASE HANDOFF

Phase 2 (002-public-figma-agent) starts when:
1. Commit 1 (`Figma MCP`) lands on Barter main
2. Opus hook B passed
3. All Phase 1 P0 requirements green in checklist.md

Phase 2 reads from this Phase 1 output as its source-of-truth for the sanitized Public duplicate.

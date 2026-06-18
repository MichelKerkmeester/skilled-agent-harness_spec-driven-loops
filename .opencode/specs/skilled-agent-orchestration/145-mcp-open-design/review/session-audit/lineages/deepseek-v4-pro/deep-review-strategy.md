# Deep Review Strategy

## Topic
Review of `150-open-design-terminal-and-interface-integration` — a phase-parent spec folder with 8 completed child phases that built `mcp-open-design` (terminal control of Open Design desktop app), de-vendored `sk-interface-design`, and integrated the two skills.

## Review Dimensions
- [x] **Correctness** — 1 P1, 4 P2. Stale version number (F001), evidence-tag inconsistency (F002), tool-surface gap (F003), pseudocode gap (F004), automation gap (F005).
- [ ] **Security** — Next focus
- [ ] **Traceability** — Pending
- [ ] **Maintainability** — Pending

## Completed Dimensions
- [x] Correctness — CONDITIONAL (1 P1, 4 P2, no P0).

## Running Findings
- **P0**: 0 active
- **P1**: 1 active — F001 (stale version number, mcp-open-design SKILL.md:9)
- **P2**: 4 active — F002 (evidence-tag inconsistency), F003 (tool-surface gap), F004 (pseudocode gap), F005 (automation gap)

## What Worked
- (Iteration 001) Reading the full skill code surface before forming claims. All findings have file:line evidence.
- (Iteration 001) Cross-referencing phase implementation summaries against live skill files to catch version drift.

## What Failed
- (none yet)

## Exhausted Approaches
- (none yet)

## Ruled-Out Directions
- (none yet)

## Next Focus
**Dimension**: Security  
**Files**: `.opencode/skills/mcp-open-design/references/mcp_wiring.md`, `.opencode/skills/mcp-open-design/SKILL.md`, `.opencode/skills/sk-interface-design/SKILL.md`  
**Rationale**: CLI invocation patterns, environment variable handling, MCP server config, paths that could enable injection, and trust-boundary violations. Wired configs include `ELECTRON_RUN_AS_NODE=1` and socket paths — review for safe defaults and privilege exposure.

## Cross-Reference Status

### Core
| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| spec_code | pending | hard | — |
| checklist_evidence | pending | hard | — |

### Overlay
| Protocol | Status | Gate | Evidence |
|----------|--------|------|----------|
| feature_catalog_code | pending | advisory | — |
| playbook_capability | pending | advisory | — |

## Files Under Review

| File | Skill | Purpose | Status |
|------|-------|---------|--------|
| `.opencode/skills/mcp-open-design/SKILL.md` | mcp-open-design | Main skill doc, routing, rules, multi-turn generation flow | reviewed (001) |
| `.opencode/skills/mcp-open-design/references/od_cli_reference.md` | mcp-open-design | CLI reference, daemon model, verb surface | reviewed (001) |
| `.opencode/skills/mcp-open-design/references/tool_surface.md` | mcp-open-design | MCP tool surface and gating policy | reviewed (001) |
| `.opencode/skills/mcp-open-design/references/mcp_wiring.md` | mcp-open-design | MCP wiring instructions | reviewed (001) |
| `.opencode/skills/sk-interface-design/SKILL.md` | sk-interface-design | Main skill doc, design process, routing | reviewed (001) |
| `.opencode/skills/sk-interface-design/references/design_principles.md` | sk-interface-design | Core design principles and two-pass process | pending |
| `.opencode/skills/sk-interface-design/references/claude_design_parity.md` | sk-interface-design | Cross-skill parity protocol with mcp-open-design | reviewed (001) |
| `.opencode/skills/sk-interface-design/references/variation_diversity.md` | sk-interface-design | Seed-of-thought debias for multiple directions | pending |

## Review Boundaries
- **Max Iterations**: 10
- **Convergence Threshold**: 0.10
- **Stuck Threshold**: 2
- **Severity Threshold**: P2
- **Execution Mode**: auto (fan-out lineage)

## Known Context
- All 8 child phases (001-008) are marked Complete.
- The two shipped skills are `mcp-open-design` v1.2.0 (per changelog, SKILL.md says v1.1.0) and `sk-interface-design` v1.3.0.
- `mcp-magicpath` was fully deprecated and deleted in phase 008; references were re-centered on `mcp-open-design`.
- Generation flow in `mcp-open-design` was corrected in phase 007 from one-shot to multi-turn.
- resource-map.md not present. Skipping coverage gate.

## Non-Goals
- Not reviewing the Open Design desktop app itself (third-party, out of scope).
- Not re-running verification tests from completed phases.
- Not reviewing already-deleted files (mcp-magicpath folder).

## Stop Conditions
- All 4 dimensions covered with no active P0/P1 findings.
- Max iterations (10) reached.
- Stuck after 2+ consecutive no-progress iterations.

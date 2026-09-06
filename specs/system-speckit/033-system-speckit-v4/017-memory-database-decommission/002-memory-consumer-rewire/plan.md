---
title: "Implementation Plan: Phase 2: memory-consumer-rewire"
description: "Rewire every live memory MCP consumer onto the phase-001 trigger index and ripgrep recipes, then split the shared embedding, IPC and launcher seams so system-skill-advisor keeps an owner, then prove the result with a residue sweep that ignores the global ignore file."
trigger_phrases:
  - "memory consumer rewire"
  - "gate 1 rewire"
  - "continuity writer"
  - "memory tool call sites"
  - "implementation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: memory-consumer-rewire

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and YAML instruction surfaces, TypeScript (`workflow.ts`, shared embeddings and IPC), Bash (sweeper and cleanup scripts) |
| **Framework** | OpenCode runtime configs across five roots, MCP tool grants, deep-loop YAML state machine |
| **Storage** | Moving from the SQLite memory DB to a generated `trigger-index.json` plus lineage-local JSONL and file-local frontmatter |
| **Testing** | Vitest for the deep-loop reducer suites, a residue sweep script and one daemon-off end-to-end session run |

### Overview

Work runs in three ordered stages taken from the inventory. Stage 1 rewires live consumers while
the old surface is still answering, so a wrong rewire shows up as a different answer rather than a
missing tool. Stage 2 splits the shared embedding, HF-local, IPC and launcher branches so
`system-skill-advisor` keeps a working owner once the memory-only branches go. Stage 3 sweeps for
residue and reconciles the two consumer counts. The order is not negotiable: splitting seams before
consumers are rewired leaves live callers pointed at a half-removed surface, and sweeping before
either one measures nothing.

Source inventory: specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 001 shipped `trigger-index.json` and `retrieval-conventions.md`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Residue sweep returns empty outside the mcp-server tree
- [ ] `system-skill-advisor` resolves its embedder after the W3 split
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Strangler replacement over instruction surfaces. The replacement path is stood up and pointed at
first, the old surface stays live as a comparison oracle, and only phase 003 removes it.

### Key Components
- **Generated trigger index**: the lexical lookup that replaces `memory_match_triggers`. Read-only, no daemon.
- **Ripgrep recipes**: the evidence producer for keyword retrieval, defined once in `retrieval-conventions.md` and referenced by every consumer rather than re-invented per call site.
- **Packet-local continuity writer**: the named replacement for the `memory_save` metadata refresh. It keeps atomic same-directory update and lock semantics, because ripgrep cannot write.
- **Shared capability owner**: the embedding adapter, HF-local provider and IPC socket server after the memory-only DB branches are split out, with `system-skill-advisor` as the surviving owner.
- **Residue sweep**: the phase's proof, a scripted `rg` run with the global ignore disabled.

### Data Flow

A consumer asks for retrieval, reads the generated index or runs a named `rg` recipe, and ranks the
result caller-side. Nothing crosses a socket and nothing needs a background service. Continuity
writes go the other way, from the session to the packet's own frontmatter through the packet-local
writer, still without the daemon.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `workflow.ts` indexing import (S-001) | Calls the server indexing API and detects the daemon through the launcher JSON | update | Compile the script tree, then grep for the import path and the launcher filename |
| Shared embeddings, HF-local, IPC socket server (S-003) | One code path serves both memory and `system-skill-advisor` | update | Split the memory-only DB branch, then prove the advisor resolves its embedder daemon-off |
| Deploy, orphan-sweeper and session-cleanup scripts (S-002) | Manage `context-server`, launcher leases, `daemon-ipc.sock` and `hf-embed.sock` | update | Run each script against a live advisor and confirm the advisor socket survives |
| Deep-loop YAML, reducer, ledger and their tests (S-004) | Persist loop state through `memory_save` and `memory_context` | update | Run the deep-loop unit suites and confirm locks, projections and ledger state are unchanged |
| Generators, install scripts, templates, catalogs (S-005) | Produce future consumers that name the removed tools | update | Regenerate one artifact of each kind and sweep the output |
| Runtime configs, agents, commands, hooks, plugins, bins | Grant and call the removed tools | update | Frontmatter grant check plus the residue sweep |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

The order across those tasks is fixed by the inventory:

1. **Rewire live consumers (W1, W2, W4, W5).** Per-area counts from the inventory: `.opencode/commands` 84 paths and 633 rows, `.opencode/agents` 8 paths and 49 rows, `.claude/agents` 11 paths and 57 rows, `.codex/agents` 8 paths and 47 rows, `.pi/agents` 8 paths and 47 rows, hooks 24 paths and 102 rows, plugins 13 paths and 85 rows, bins 34 paths and 285 rows, `AGENTS.md` 11 rows. The five runtime config roots carry `.claude/mcp.json` 19 rows, `.codex/config.toml` 15, `.cursor/mcp.json` 19, `.pi/mcp.json` 13 and `opencode.json` 19, with `.env.example` at 334 rows.
2. **Split shared seams (W3).** Only after the live callers no longer reach the memory branches. Splitting first would leave callers pointed at a half-removed surface with no comparison oracle.
3. **Residue sweep and reconciliation (W6).** Last, because it measures the first two.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Deep-loop reducer persistence, continuity writer atomicity and lock behavior | Vitest |
| Integration | Advisor embedder resolution after the W3 split, `workflow.ts` index and lease behavior | Vitest plus a fresh-process script run |
| Manual | One full session, Gate 1 through Gate 5, daemon stopped, plus `/speckit:plan`, `/speckit:resume` and `/memory:save` end to end | Terminal |

### Residue sweep recipe

The sweep must disable the global ignore. During the inventory research the default ignore
behavior hid root `opencode.json` and `.utcp_config.json`, so a sweep that trusts it under-reports.

```bash
rg --json --ignore-case --no-ignore-global \
  -e 'mcp__system_spec_memory__' \
  -e 'memory_(match_triggers|context|search|save|update|delete|list|stats|health|validate)' \
  --glob '!.git/**' \
  --glob '!**/node_modules/**' \
  --glob '!**/z_archive/**' \
  --glob '!.opencode/skills/system-spec-kit/mcp-server/**' \
  . > scratch/residue.jsonl
```

Parse the JSON events rather than splitting on colons: a colon-containing path splits wrongly under
the line format, which is the parser bug the inventory had to correct. Extend the alternation to all
41 tool names before the final run. A row under a research, run, report or JSONL path is historical
narrative and is reported separately, never bulk-edited.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 `trigger-index.json` and `retrieval-conventions.md` | Internal | Yellow | Nothing can be repointed and the whole phase stalls |
| `system-skill-advisor` shared embedding and IPC ownership | Internal | Yellow | W3 cannot split safely and phase 003 stays blocked |
| Deep-loop lock, projection and ledger contract | Internal | Green | W5 would risk the loop state machine rather than only its persistence |
| Row inventory artifact `inventory.external.json` | Internal | Green | Owner-by-owner reconciliation has no authoritative row source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A rewired consumer returns a materially different answer than the still-live memory surface, the advisor loses its embedder or a deep-loop suite fails on locks or projections rather than persistence.
- **Procedure**: Revert the offending area's diff. The old surface is still running throughout this phase, so a revert restores working behavior with no data migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 2-4 hours to build the sweep script and freeze the owner list |
| Core Implementation | High | 20-30 hours across consumer rewire, seam split and producer updates |
| Verification | Med | 4-6 hours for the daemon-off session, advisor check and reconciliation record |
| **Total** | | **26-40 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline residue sweep captured before the first edit
- [ ] The memory MCP server confirmed running as the comparison oracle
- [ ] Advisor embedder baseline captured before the W3 split

### Rollback Procedure
1. Stop editing and re-run the residue sweep to record the current state.
2. Revert the offending area's diff, one area at a time rather than the whole phase.
3. Re-run the daemon-off session check and the deep-loop unit suites.
4. Record which area was reverted and why in `decision-record.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The memory DB is untouched in this phase and the continuity writer only writes packet-local frontmatter.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Sweep script and frozen owner list | None | Baseline residue count | Consumer rewire, reconciliation |
| Consumer rewire (W1, W2, W4, W5) | Sweep script, phase 001 artifacts | Repointed instruction surfaces | Seam split |
| Seam split (W3) | Consumer rewire | Advisor-owned shared capability | Verification, phase 003 |
| Verification and reconciliation (W6) | Seam split | Empty sweep, owner ledger | Phase 003 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Sweep script plus frozen owner list** - 2-4 hours - CRITICAL
2. **Consumer rewire across commands, agents, hooks, plugins, bins and configs** - 14-20 hours - CRITICAL
3. **Shared seam split with the advisor embedder proof** - 6-10 hours - CRITICAL
4. **Residue sweep, daemon-off session and owner reconciliation** - 4-6 hours - CRITICAL

**Total Critical Path**: 26-40 hours

**Parallel Opportunities**:
- The four runtime agent roots can be rewired simultaneously, since each is a separate mirror set
- Producer updates (W4) and deep-loop test rewrites (W5) can run alongside the command rewire
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Sweep and owner list frozen | Baseline residue count recorded, 167 owners enumerated | Stage 1 start |
| M2 | Live consumers rewired | No removed tool in any runtime grant, Gate 1 works daemon-off | Stage 1 end |
| M3 | Shared seams split | Advisor resolves its embedder, all five seams decided | Stage 2 end |
| M4 | Phase closeable | Sweep empty outside the mcp-server tree, reconciliation recorded | Stage 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Rewire consumers before splitting shared seams

**Status**: Proposed

**Context**: The inventory finds three kinds of row: memory-only, shared with a retained owner and historical narrative. Both the rewire and the split touch shared files, so their order decides what a failure looks like.

**Decision**: Rewire live consumers first while the memory server still answers, then split the shared embedding, HF-local, IPC and launcher branches, then sweep.

**Consequences**:
- A wrong rewire produces a comparable wrong answer instead of a missing tool, which is the whole reason this phase precedes deletion
- The shared seams stay dual-owned for longer, so the split has to be a deliberate late step rather than a cleanup pass. Mitigated by making the advisor embedder proof a gate on stage 2

**Alternatives Rejected**:
- Split the shared seams first: it leaves live callers pointed at a half-removed surface with no oracle to compare against
- Sweep first and rewire by sweep output alone: the sweep counts rows, not owners, so it cannot tell a rewired consumer from an untouched one


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

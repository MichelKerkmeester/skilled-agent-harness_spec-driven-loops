---
title: "Implementation Plan: Phase 3: spec-memory-server-removal"
description: "Delete the system-spec-memory server in four ordered stages, each one gated by a seam check proving the retained owner still resolves, and close with a residue sweep plus a clean session boot in all five runtimes."
trigger_phrases:
  - "spec memory server removal"
  - "mcp server deletion"
  - "daemon removal"
  - "preserve set"
  - "implementation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: spec-memory-server-removal

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js and TypeScript, plus shell, JSON, TOML and YAML config |
| **Framework** | OpenCode runtime and four peer agent runtimes (Claude Code, Codex, Cursor, Pi) |
| **Storage** | None after removal. The SQLite database, the launcher lease directory and the daemon socket all go |
| **Testing** | `validate.sh`, the vitest suites that survive phase 002, a residue sweep and a cold session boot per runtime |

### Overview
Delete the memory subsystem in four ordered stages: the server tree, then the launchers and plugin
and hooks, then the five runtime config roots and the environment rows, then the catalogs and
playbooks. Each stage is preceded by a seam check that proves the retained owner of a shared file
still resolves, with the advisor embedder over the shared socket as the standing gate. The phase
closes on a residue sweep and a clean session boot in every runtime, not on the diff looking right.

Inventory source: `specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002's residue sweep returns empty, so no live consumer still calls a removed tool
- [ ] The five seams in `spec.md` section 6 each have a named retained owner and a source-level fix
- [ ] A baseline is captured: advisor embedder resolves, `validate.sh` passes on an existing packet, all five runtimes boot

### Definition of Done
- [ ] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] The residue sweep finds no live reference to the removed tools outside historical evidence
- [ ] The preserve set is present and working, checked positively rather than by absence of a hit
- [ ] `spec.md`, `plan.md` and `tasks.md` agree on what was removed and what was kept
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Staged deletion behind seam checks. Each stage is one reviewable commit, and no stage begins until
the seam check for the surface it is about to touch has passed on the current tree.

### Key Components
- **Stage 1, the server tree**: `.opencode/skills/system-spec-kit/mcp-server/` removed as one unit, then its workspace, bin and script entries and its server-only lock and package entries
- **Stage 2, launchers and plugin and hooks**: the two bins, the memory allowlists inside the retained session proxy, the plugin, the hook adapters and the memory-only plugin tests and playbooks
- **Stage 3, config roots and env rows**: the registration and tool grants in all five runtime roots, then the server-only `.env.example` and `ENV-REFERENCE.md` rows, launcher leases, orphan and session cleanup branches and obsolete memory routes
- **Stage 4, catalogs and playbooks**: the install and catalog entries and the documentation packages for an engine that no longer exists
- **Seam check**: run before each stage against the files that stage will touch. The advisor embedder resolving over the shared socket is the gate that every stage shares
- **Residue sweep**: the closing evidence, run once from the final state

### Data Flow
The tree goes first because everything else points at it, so a later stage cannot resurrect a path
that no longer exists. Bins, plugin and hooks go second because they are the processes that would
otherwise try to spawn the missing tree. Config roots go third, because a registration pointing at a
deleted launcher is a boot error rather than a silent no-op, and this is the stage that makes the
absence observable. Catalogs and playbooks go last, since they are the description of the thing and
removing them first would destroy the map before the territory.

### The closing residue sweep

Run once from the final state, not per stage. The flags are load-bearing: `--ignore-case` because
the flag identifiers are not case-consistent, and `--no-ignore-global` because the global ignore
file hid root `opencode.json` and `.utcp_config.json` from the earlier inventory scan.

```bash
rg --json --ignore-case --no-ignore-global \
  -g '!.git' -g '!node_modules' -g '!z_archive' \
  'system-spec-memory|memory_[a-z_]+|spec-memory' .
```

Read the result by owner, never by count. A hit under a research, run, report or JSONL path is
historical evidence and stays. A hit in a live instruction, config, hook, bin or plugin path is
residue and fails the sweep. A hit in a preserved shared file is a seam that was resolved by a
source-level edit, so confirm the retained owner rather than deleting the line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/core/workflow.ts:101-106,605-640` | Imports `@spec-kit/mcp-server/api/indexing` and detects the daemon lease | Update. Source-owned index and lease behavior replaces the import | The package builds with the tree gone, and `validate.sh` passes on an existing packet |
| `scripts/deploy-mcp.sh:49-82`, `.opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515`, `.opencode/scripts/session-cleanup.sh:102-113` | Deploy, orphan and session cleanup over `context-server`, launcher leases, `daemon-ipc.sock` and `hf-embed.sock` | Update. Split the memory branch out and keep the advisor branch | A cleanup run leaves the advisor socket alive and reports no stranded memory daemon |
| `shared/embeddings/adapter.ts:4-13`, `shared/embeddings/providers/hf-local.ts:32-35,371-382`, `shared/ipc/socket-server.ts:134,187,202-203` | Shared embedding, HF-local and IPC serving both memory and `system-skill-advisor` | Update. Remove the memory-only DB branches, keep the shared model-server socket | The advisor embedder resolves after removal, proven by a live advisor call |
| `.opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347`, `system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87` | Deep-loop persistence calling `memory_save` and `memory_context` | Update. Remove the MCP persistence, keep the loop state machine | Deep-loop locks, projections and reducer state still work, and the surviving tests pass |
| `.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223`, `.opencode/commands/create/assets/create-skill-auto.yaml`, `system-spec-kit/templates/addons/resource-map.md.tmpl:21-48` | Generators, install scripts and catalogs that emit future consumers | Update the producer before deleting the generated consumer | A regenerated artifact contains no removed tool name |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Session proxy shared with the advisor launcher, holding memory allowlists | Update. Strip the memory allowlists only | The advisor launcher still proxies a session after the edit |
| Five runtime config roots and `.env.example` | Declare the server and grant its tools | Update. Remove the registration, the grants and the server-only rows | No root declares `system-spec-memory`, and each runtime boots clean |

Required inventories:
- Same-class producers: `rg -n 'system-spec-memory|memory_[a-z_]+|SPECKIT_.*MEMORY' .opencode/bin .opencode/plugins .opencode/hooks`.
- Consumers of changed symbols: `rg -n 'memory_save|memory_context|memory_match_triggers|api/indexing' . --glob '*.ts' --glob '*.js' --glob '*.md' --glob '*.yaml'`.
- Matrix axes: five runtime roots by four deletion stages, plus the five seams as independent rows.
- Algorithm invariant: a search term that matches a preserved owner is never sufficient grounds for deletion. Every removal is justified by the owning surface, not by the matched token.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The vitest suites that survive phase 002, especially deep-loop reducer and projection state | vitest |
| Integration | `validate.sh --strict` on an existing packet, a live advisor call proving the embedder resolves | `validate.sh`, skill advisor CLI |
| Manual | A cold session boot in each of the five runtimes, checked for a connection attempt, a timeout notice, a lock directory and an orphan process | Terminal, `ps`, the runtime session log |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 residue sweep returning empty | Internal | Yellow | Nothing in this phase may start. A live consumer would break on the first stage |
| `system-skill-advisor` embedder over the shared socket | Internal | Yellow | Stage 1 is blocked. Gate 2 routing would break with the shared model server |
| `@spec-kit/mcp-server` file dependency in the scripts package | Internal | Yellow | Stage 1 is blocked. Validation and scaffolding would fail to build |
| Deep-loop lock, projection and reducer state | Internal | Green | Stage 3 is blocked if the loop still persists through MCP calls |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A seam check fails after its stage lands, the advisor embedder stops resolving, `validate.sh` stops running or any runtime fails to boot clean.
- **Procedure**: Revert the single stage commit. Stages are ordered and independently revertable, so a failure never forces the whole phase back. Re-run the seam check for that stage before attempting it again.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Seam check ──► Stage 1 (tree) ──► Stage 2 (bins, plugin, hooks) ──┐
                                                                  ├──► Stage 4 (catalogs) ──► Sweep
                                  Stage 3 (config roots, env) ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 residue sweep | Stage 1 |
| Stage 1 (tree) | Setup, seam check 1 and 3 | Stage 2 |
| Stage 2 (bins, plugin, hooks) | Stage 1, seam check 2 | Stage 3 |
| Stage 3 (config roots, env) | Stage 2, seam check 2 and 4 | Stage 4 |
| Stage 4 (catalogs, playbooks) | Stage 3, seam check 5 | Verify |
| Verify | Stage 4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 1-2 hours to capture the baseline and confirm the 002 sweep |
| Core Implementation | High | 6-10 hours across four staged commits and five seam fixes |
| Verification | Med | 2-3 hours for the sweep, the preserve-set audit and five runtime boots |
| **Total** | | **9-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured: advisor embedder resolves, `validate.sh` passes, all five runtimes boot
- [ ] Each stage is its own commit, so a revert is one commit and not a range
- [ ] The preserve-set inventory is written down before the first deletion, so a later audit has something to compare against

### Rollback Procedure
1. Stop at the failing stage. Do not start the next one.
2. Revert that stage's commit.
3. Re-run the seam check the stage depends on, plus the advisor embedder proof.
4. Record what the seam check missed in `spec.md` before retrying, so the second attempt is not the same guess.

### Data Reversal
- **Has data migrations?** No. The database is gitignored and derived, and phase 001 already replaced what read from it.
- **Reversal procedure**: A stale `.sqlite` file or lock directory on a developer machine survives a pull because both are gitignored. Document the cleanup path rather than scripting it.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Stage 1    │────►│  Stage 2    │────►│  Stage 3    │
│  Tree       │     │  Bins/Hooks │     │  Config/Env │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │  Stage 4    │
                                        │  Catalogs   │
                                        └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │  Sweep and  │
                                        │  boot proof │
                                        └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Stage 1 tree | Phase 002 sweep, seams 1 and 3 | No `mcp-server` tree, no workspace entry | Stage 2 |
| Stage 2 bins, plugin, hooks | Stage 1, seam 2 | No launcher, no plugin, no memory hook adapter | Stage 3 |
| Stage 3 config roots, env | Stage 2, seams 2 and 4 | No registration in five roots, no server-only env row | Stage 4 |
| Stage 4 catalogs, playbooks | Stage 3, seam 5 | No install or catalog entry, no engine docs | Verify |
| Verify | Stage 4 | Residue sweep, preserve-set audit, five clean boots | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Seam 1 and seam 3 fixes** - 2-3 hours - CRITICAL. Stage 1 cannot start while `workflow.ts` imports the tree or the advisor depends on memory to start the model server
2. **Stage 1, the tree** - 1-2 hours - CRITICAL. Everything downstream points at it
3. **Stage 3, the five config roots** - 1-2 hours - CRITICAL. This is the stage that makes the absence observable at boot

**Total Critical Path**: 4-7 hours

**Parallel Opportunities**:
- Seam 5 (generators, install, catalogs) can be fixed while stage 1 is in review
- The preserve-set inventory can be written while the seam fixes are in progress
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Seams closed | All five seams carry a source-level fix, and the advisor embedder resolves | Before stage 1 |
| M2 | Tree and processes gone | No `mcp-server` tree, no launcher, no plugin, no memory hook adapter | After stage 2 |
| M3 | Absence observable | No root declares the server, and all five runtimes boot clean | After stage 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Stage the deletion behind seam checks rather than deleting by search

**Status**: Accepted

**Context**: The inventory records 18,799 external paths matching the memory vocabulary, and the
target-tree and external flag scopes (410 and 872 identifiers) both include shared advisor aliases.
A search-driven deletion would therefore delete surviving owners, and five named files still speak
the old contract while having a retained owner.

**Decision**: Delete in four ordered stages, tree first, and gate each stage on a seam check that
proves the retained owner of the files that stage touches still resolves. The advisor embedder over
the shared socket is the standing gate for every stage.

**Consequences**:
- Four reviewable commits instead of one 1,481-file diff, so a reviewer can check each surface
- A failure reverts one stage rather than the phase
- Slower than a single sweep, and the seam checks are manual. Mitigated by making the advisor proof one command that every stage repeats

**Alternatives Rejected**:
- Delete by search across the memory vocabulary: it would remove advisor, HF, IPC and deep-loop code that shares the vocabulary
- Deprecate in place: it keeps every operational cost the phase exists to remove

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

---
title: "Implementation Plan: Deprecate sk-design mcp-open-design transport skill and remove all live references"
description: "Phase plan: review, allowlist, core strips, verification gates, rollback."
trigger_phrases:
  - "deprecate open design"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/015-deprecate-open-design"
    last_updated_at: "2026-08-10T14:09:15Z"
    last_updated_by: "remnant-remediation"
    recent_action: "Removed residual transport contracts"
    next_safe_action: "None — remnant remediation verified"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/sk-design-mcp-open-design/"
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deprecate-open-design-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deprecate sk-design mcp-open-design transport skill and remove all live references

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Python3 (json parse), Node (reducer/review scripts), Markdown/JSON/YAML configs |
| **Framework** | system-deep-loop review runtime (`reduce-state.cjs`), system-spec-kit validation |
| **Storage** | git-tracked docs/configs; sqlite memory DBs (regenerated, not hand-edited) |
| **Testing** | `validate.sh --strict`, residue grep gates, JSON parse checks, node test files under review |

### Overview
Remove the Open Design transport end-to-end: delete the `sk-design-mcp-open-design` skill tree, drop the `open_design` MCP server entry from `.utcp_config.json`, and strip every live reference across sk-design hub/modes, runtime agents, commands, deep-alignment adapters, sibling skills, advisor corpus, doc fixtures, and root docs — gated by a final zero-residue grep and `validate.sh --strict`. A 10-iteration deep review (GPT-5.6 Luna max/fast, native pi subagents) runs first to adjudicate the authoritative reference inventory, with `reduce-state.cjs` as the single review-state writer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..009)
- [ ] Zero-residue grep gate passes over the live-surface allowlist
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sweep-and-verify deprecation: inventory (deep review) → delete/mutate per allowlist → verify (grep gate + JSON parse + validate.sh).

### Key Components
- **Review packet** (`review/`): deep-review state machine — config, JSONL, registry, strategy, iterations, deltas, dashboard, report. Orchestrator = this session (pi-native loop owner); LEAF iterations = `deep-review` agent via native pi subagents; reducer = `reduce-state.cjs`.
- **Live-surface allowlist**: tracked file list from `git ls-files` minus documented historical exclusions (specs/, changelog history, dated benchmark corpora, sqlite, .worktrees).
- **Residue gate**: `grep -rniE "mcp[-_]open[-_]design|design-mcp-open-design|open[-_ ]design"` over the allowlist must return zero hits.
- **Validation gate**: `validate.sh specs/sk-design/015-deprecate-open-design --strict` exit 0.

### Data Flow
Inventory (grep + review) → classification (live vs historical) → edits (configs, routers, agents, commands, skills, docs) → parse/validate checks → residue sweep → completion evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/sk-design-mcp-open-design/` | The deprecated transport skill (45 files) | Delete tree | `test ! -e` |
| `.utcp_config.json` | `open_design` MCP server registration (Code Mode) | Remove entry | JSON parse + grep |
| `sk-design` hub (SKILL.md, README, registry/manifest JSONs, feature-catalog, playbook, shared/) | Routes to the transport as a mode/leaf | Strip references | grep gate |
| `sk-design-md-generator` docs | Pairing/transport references | Strip | grep gate |
| Agents (`.opencode`, `.claude`, `.codex`, `.pi`) design.md + deep-alignment.md | Transport tool/route claims, live-render adapter | Strip | grep gate |
| Commands (interface/design*, doctor/mcp*, install-guides) | Dispatch/install/verify instructions | Strip | grep gate |
| deep-alignment (adapters, feature-catalog, playbook, scripts, tests) | `sk-design-live-render` adapter executes the transport | Strip/remove adapter claims | grep gate |
| mcp-code-mode, mcp-tooling/mcp-figma, cli-external-orchestration | Comparison/route references | Strip | grep gate |
| system-skill-advisor corpus (`skill_advisor.py`, `skill-graph.json`) | Advisor routing mentions | Re-point corpus | advisor probe |
| sk-code checklist, sk-prompt patterns, sk-doc fixtures/tests, system-spec-kit playbook/eval | Example/baseline references | Strip | grep gate |
| README.md, AGENTS.md, BARTER.md | Transport rows | Strip | grep gate |
| Compiled-routing canary fixture | Router replay fixture | Adjudicated by review | review finding |

Required inventories:
- Same-class producers: `rg -n 'open[-_ ]design|mcp-open-design' .opencode .pi AGENTS.md README.md BARTER.md .utcp_config.json --glob '!specs/**' --glob '!**/changelog/**' --glob '!**/benchmark/**'`.
- Consumers of changed symbols: same pattern; every hit classified live-or-historical before editing.
- Matrix axes: surface (skill/config/agent/command/doc/root), variant (hyphen/underscore/spaced/camel), exclusion class (historical/archive/regenerated).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Deep Review (10 iterations)
- [ ] Init review packet under `review/` (config, strategy, registry, JSONL)
- [ ] Dispatch 10 LEAF iterations (GPT-5.6 Luna max/fast, native pi subagents), one dimension/protocol focus each
- [ ] Reduce state after each iteration (`reduce-state.cjs`), adjudicate P0/P1 claims
- [ ] Synthesize `review/review-report.md` (9 core sections + verdict)

### Phase 1: Setup
- [x] Spec folder scaffolded (Level 3) and authored
- [ ] Live-surface allowlist frozen from inventory + review findings

### Phase 2: Core Implementation
- [ ] Delete `sk-design-mcp-open-design/` tree
- [ ] Strip `open_design` from `.utcp_config.json`
- [ ] Strip sk-design hub/modes/playbook/shared references
- [ ] Strip agents, commands, install guides
- [ ] Strip deep-alignment adapters/scripts/tests
- [ ] Strip sibling skills (mcp-code-mode, mcp-figma, cli-external-orchestration, sk-code, sk-prompt, sk-doc, system-spec-kit, system-skill-advisor)
- [ ] Strip root docs (README, AGENTS, BARTER) + compiled-routing fixture per review
- [ ] Regenerate derived manifests (leaf-manifest, description/graph-metadata) where the skill removal invalidates them

### Phase 3: Verification
- [ ] JSON parse check on `.utcp_config.json` and all edited JSON
- [ ] Zero-residue grep gate over the live-surface allowlist
- [ ] `validate.sh --strict` exit 0; checklist evidenced; `implementation-summary.md` written
- [ ] `git status` diff review: no historical files touched, no stray files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residue sweep | All live surfaces | `grep -rniE` + `rg -n` over allowlist |
| Config integrity | `.utcp_config.json` + edited JSON files | `python3 -c json.load` |
| Skill removal | Tree gone, no dangling links | `test ! -e`, markdown link guard |
| Review state | JSONL/deltas/registry consistency | `reduce-state.cjs` + iteration verify |
| Spec validation | Packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| GPT-5.6 Luna model availability (openai-codex, max/fast) | External | Green | Fall back to configured default and flag |
| pi-subagents plugin (native dispatch) | Internal | Green | Blocked review → cannot start |
| `reduce-state.cjs` reducer | Internal | Green | State machine degrades; stop loop |
| Memory DBs (sqlite) re-index | Internal | Green | Stale embeddings until re-scan; non-blocking |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Residue gate failure after edits, JSON parse breakage, or review state corruption.
- **Procedure**: All changes are git-tracked. `git checkout -- <paths>` restores the removed skill tree and any edited file; the review packet is additive and can be deleted. No data migrations exist; sqlite DBs regenerate from sources.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Deep Review) ──► Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Review | Spec authored | Setup, Core |
| Setup | Review | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Deep Review (10 iters) | High | 10 subagent dispatches + reduction |
| Setup (allowlist) | Low | 15 min |
| Core Implementation | Med | 1-2 hours (bulk edits) |
| Verification | Med | 30 min + gate reruns |
| **Total** | | **~3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created: none needed (git-tracked tree; review packet additive)
- [ ] Feature flag configured: n/a
- [ ] Monitoring alerts set: n/a

### Rollback Procedure
1. `git checkout -- .opencode/skills/sk-design/sk-design-mcp-open-design .utcp_config.json <edited-files>` to restore.
2. Re-run the residue sweep in reverse (grep for removal markers if any were added).
3. Re-run `validate.sh --strict`.
4. Notify: single operator workspace; no external stakeholders.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│ Phase 0 Review    │────►│ Phase 1 Setup    │────►│ Phase 2 Core        │
│ (10 iterations)   │     │ (allowlist)      │     │ (deletes + strips)  │
└───────────────────┘     └──────────────────┘     └──────────┬──────────┘
                                                              │
                                                    ┌─────────▼─────────┐
                                                    │ Phase 3 Verify    │
                                                    │ (gates + evidence)│
                                                    └───────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Review packet | Spec docs | Findings, inventory | Core |
| Allowlist | Review | Edit scope | Core |
| Core edits | Allowlist | Clean surfaces | Verify |
| Verify | Core | Evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Deep review iterations 1-10** - ~2 hours - CRITICAL
2. **Skill tree deletion + config strips** - 30 min - CRITICAL
3. **Residue gate + validate.sh** - 20 min - CRITICAL

**Total Critical Path**: ~3 hours

**Parallel Opportunities**:
- Hub/manifest strips and agent strips can be batched in one edit pass
- Root docs and sibling skills can be edited after the hub pass independently
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Review converged | 10 iteration files + report with verdict | Before implementation |
| M2 | Core done | Skill tree gone, zero residue on live surfaces | After strips |
| M3 | Release ready | validate.sh exit 0, checklist evidenced, diff clean | Closeout |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Native pi subagent dispatch for the review loop

**Status**: Accepted

**Context**: The deep-review SKILL.md routes the loop through opencode's YAML command workflow. This session runs on the pi runtime, where those YAML workflows are not executable, and the operator explicitly requested native pi subagents.

**Decision**: This session acts as the loop owner (YAML-equivalent): dispatch one LEAF `deep-review` iteration per pass through the native pi-subagents plugin (`subagent` tool, `deep-review` agent, model `openai-codex/gpt-5.6-luna`, thinking max, service tier fast), and use `reduce-state.cjs` as the single state writer for registry/dashboard/strategy refresh — the same split of responsibilities the YAML workflow owns on opencode.

**Consequences**:
- Positive: fulfills the operator's explicit dispatch choice; state machine artifacts match the canonical packet contract.
- Negative + mitigation: no YAML orchestrator guards — mitigated by the orchestrator validating iteration file + JSONL delta after every dispatch and failing the loop on 3 consecutive errors.

**Alternatives Rejected**:
- cli-pi executor kind (shells out to the pi CLI): rejected — operator asked for native in-process subagents; cli dispatch is a different route the operator did not name.


---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Review packet state: `deep-review-state.jsonl` + registry agree on iteration count and active findings
- [ ] Live-surface allowlist frozen; historical exclusions enumerated (spec.md §3)
- [ ] Residue gate command frozen (full variant set) before the first edit
- [ ] `git status` baseline captured so the final diff is reviewable

### Task Execution Rules
- TASK-SEQ: delete skill tree → strip configs → strip hub/modes → agents/commands → deep-alignment → siblings → advisor corpus → root docs → regenerate derived artifacts → gates
- TASK-SCOPE: edits restricted to the live allowlist; historical records (specs/, changelog history, dated benchmark corpora/fixtures, sqlite) never modified
- Each surface is verified by grep before moving to the next; JSON edits parse-checked immediately

### Status Reporting Format
`[surface] done: N files cleaned, M remaining hits` at each phase boundary; final closeout reports residue-gate exit, validate.sh exit, and diff review

### Blocked Task Protocol
BLOCKED on reducer CLI defect (recorded, workaround: verify reducer outputs after run), pre-existing test failures (sk-doc-command oracle path missing — out of scope), or pre-existing staged workspace files (untouched). Blockers are documented in the review report §8, never silently bypassed.

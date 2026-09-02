---
title: "Implementation Plan: Phase 1: trigger-index-replacement"
description: "Build a frontmatter-derived trigger index, a ripgrep retrieval contract, and a parity harness that proves the pair covers the live substring lane before anything is removed."
trigger_phrases:
  - "trigger index plan"
  - "retrieval replacement plan"
  - "parity harness"
  - "generate-trigger-index"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: trigger-index-replacement

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), no TypeScript build step |
| **Framework** | None — plain Node, standard library only |
| **Storage** | A committed JSON file. No database, no daemon, no embedding provider |
| **Testing** | Node's built-in `node:test`, plus a parity harness against the live lane |

### Overview

Walk every markdown file under `specs/` and `.opencode/skills/`, parse the `trigger_phrases`
frontmatter block, and emit one many-to-many phrase-to-paths index. Gate 1 then resolves against
that file instead of an MCP call. Free-text retrieval moves to documented ripgrep invocations with
no index at all, because a recursive grep over the full 38M-word corpus already returns in 0.5s.

The phase adds files and changes nothing. That is what makes the parity check meaningful: the old
lane and the new index are both live, so they can be run against the same prompts and diffed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Parity harness reports zero missing paths, output committed as baseline
- [ ] Second generator run leaves the artifact byte-identical
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Generate-and-commit. A pure function from repository files to one artifact, run by hand or by a
hook, with the output tracked in git. This is the deliberate inverse of the subsystem being
removed, whose `.sqlite` was gitignored and therefore absent from every fresh clone.

### Key Components

- **`generate-trigger-index.mjs`**: walks the corpus, parses frontmatter, emits the artifact. Pure,
  deterministic, no network, no daemon.
- **`trigger-index.json`**: the committed artifact. Many-to-many: one phrase maps to every path
  declaring it.
- **`retrieval-conventions.md`**: the ripgrep contract replacing `memory_search`,
  `memory_context`, and `memory_quick_search`.
- **`parity-check.mjs`**: runs a frozen prompt set against both mechanisms and reports set
  differences.

### Data Flow

```
specs/**/*.md ─┐
               ├─► generate-trigger-index.mjs ─► trigger-index.json ─► Gate 1 lookup
.opencode/skills/**/*.md ─┘

prompt ─► ripgrep over specs/ (scoped by track/packet) ─► candidate docs ─► read
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. `research_intent` is `refactor`, this phase creates only new files, and no finding
from a deep-review verdict is in play. No existing surface changes behavior in this phase — that is
phase 002's scope, and its plan carries this addendum instead.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-server/lib/search/hybrid-search.ts` | Owns the live `exactTriggerSearch` substring lane | not a consumer — read as the parity comparison target only | `rg -n 'exactTriggerSearch' .opencode/skills/system-spec-kit/mcp-server/lib` |
| `AGENTS.md` Gate 1 | Declares `memory_match_triggers` as the gate action | unchanged in this phase | phase 002 owns the swap |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Frontmatter parsing: well-formed, malformed, absent, duplicate phrases, oversized phrase | `node:test` |
| Integration | Full generation over the real corpus; determinism across two runs | `node:test` + `git diff --exit-code` |
| Parity | Frozen prompt set against live lane vs. index; set difference must be empty in the missing direction | `parity-check.mjs` |
| Manual | Gate 1 lookup with the MCP server stopped | session run |

Coverage floor per `AGENTS.md` §3: happy path plus one edge case per public surface. The edge cases
that earn a test here are the ones the generator will actually meet in this corpus — malformed
frontmatter and duplicate phrases across documents — not a test per branch.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `trigger_phrases` frontmatter across the corpus | Internal | Green — present in 11,902 active spec docs | Approach fails; would need phase 004 to run first |
| Live `system-spec-memory` daemon, for one parity snapshot | Internal | Yellow — documented as flapping; timed out during this planning session | Capture the snapshot opportunistically; fall back to a hand-verified fixture and say so |
| Node >= 20.11 | External | Green — already required by `@spec-kit/scripts` | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parity gaps that cannot be closed, or an artifact size that makes the repository unpleasant to work in.
- **Procedure**: `git revert` the phase commit. This phase adds only new files and repoints nothing, so reverting restores the prior state exactly and the MCP server is untouched throughout.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (fixtures + prompt set) ──┐
                                ├──► Core (generator + artifact) ──► Verify (parity + determinism)
Config (size budget decision) ──┘
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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 3-5 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Parity snapshot of the live lane captured before the daemon is touched
- [ ] Artifact size measured and recorded against the budget
- [ ] No existing file modified in this phase's diff

### Rollback Procedure
1. `git revert` the phase commit
2. Confirm `trigger-index.json` and the `scripts/retrieval/` tree are gone
3. Confirm Gate 1 still resolves through `memory_match_triggers` (unchanged throughout this phase)
4. No stakeholder notification needed — nothing user-facing changed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — the artifact is derived and regenerable from the corpus at any time
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│    Core     │────►│   Verify    │
│  fixtures   │     │  generator  │     │   parity    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ conventions│
                    │  doc (par) │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Prompt set fixture | None | `fixtures/prompt-set.json` | Parity harness |
| Live-lane snapshot | Prompt set | `fixtures/live-lane-baseline.json` | Parity harness |
| Generator | Size budget decision | `trigger-index.json` | Parity harness, phase 002 |
| Conventions doc | None | `retrieval-conventions.md` | Phase 002 |
| Parity harness | Generator, snapshot | Parity report | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Live-lane snapshot** - 1 hour - CRITICAL (the daemon may stop being available; capture first)
2. **Generator + artifact** - 3-5 hours - CRITICAL
3. **Parity verification** - 2 hours - CRITICAL

**Total Critical Path**: 6-8 hours

**Parallel Opportunities**:
- `retrieval-conventions.md` can be written alongside the generator; it depends on neither
- Unit tests for frontmatter parsing can be written before the corpus walk exists
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Live-lane output for the frozen prompt set is committed as a fixture | Setup |
| M2 | Index generated | `trigger-index.json` exists, within size budget, byte-stable across two runs | Core |
| M3 | Parity proven | Zero missing paths across the prompt set; Gate 1 resolves with the daemon stopped | Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Commit the index artifact rather than gitignore it

**Status**: Proposed

**Context**: The subsystem being removed kept its `.sqlite` gitignored, so a fresh clone had no index and Gate 1 depended on a rebuild plus a running daemon. That is one of the failure modes this packet is removing.

**Decision**: Track `trigger-index.json` in git.

**Consequences**:
- A fresh clone satisfies Gate 1 with no build step and no service.
- The artifact appears in diffs whenever spec docs change; at ~4.1 MB of phrase text this is real noise, mitigated by the size budget in R-001 and, if needed, per-track sharding.

**Alternatives Rejected**:
- Generate on demand at session start: reintroduces a build step on the hot path and a staleness question, which is most of what made the daemon unpleasant.
- No index, pure ripgrep for Gate 1 too: loses precision on trigger matching, since prompt-to-declared-phrase matching is not the same query as grepping prose.

### ADR-002: Do not rebuild a semantic lane

**Status**: Proposed

**Context**: The removed stack carried vector, graph, BM25 and FTS5 channels plus a fusion layer.

**Decision**: Replace only the substring lane and free-text search. No embeddings.

**Consequences**:
- Drops ~198 MB of dependencies, the embedder cascade, and the provider configuration.
- If a future retrieval need genuinely requires semantics, it is a new packet with its own evidence, not a restoration of this one.

**Alternatives Rejected**:
- Keep a minimal FTS5 index: reintroduces a build artifact and a staleness problem for a channel the ablation measured at exactly 0.0000 delta.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

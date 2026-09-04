---
title: "Implementation Plan: zvec-grep fork integration"
description: "Three parallel lanes: an Ollama backend and a daemon-free stdio MCP server in the zvec-grep fork, and a thin wrapper plus doctor route plus conventions section in system-spec-kit that shells out to the fork's binary in direct mode."
trigger_phrases:
  - "zvec-grep integration plan"
  - "ollama backend lane"
  - "direct stdio lane"
  - "zvec lane wrapper"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: zvec-grep fork integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript in the fork (Node 22, ESM); ESM JavaScript for the wrapper |
| **Framework** | zvec-grep CLI and MCP server; system-spec-kit retrieval scripts |
| **Storage** | zvec-grep's local index under `.zvec-grep/`, git-ignored; no database |
| **Testing** | Fork: its vitest unit suite plus live Ollama smoke; spec-kit: vitest through `mcp-server/vitest.config.ts` |

### Overview
The fork gains an `OllamaEmbeddingModel` behind the existing `EmbeddingModel` interface, registered in the catalog and factory so it is selected by reference like every other backend, and a direct-mode stdio server that constructs the engine in-process instead of proxying to the daemon. System-spec-kit gains one wrapper that resolves the binary, forces direct mode, and reshapes output into the rank tuple the ripgrep lane already emits, so consumers see one shape across lanes.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shell-out wrapper over an external CLI, mirroring the ripgrep lane. No long-lived process on either side.

### Key Components
- **`OllamaEmbeddingModel`** (fork, `src/engine/models/`): implements `EmbeddingModel` over `POST /api/embed`, reads dimensions from `/api/show`, batches the way the transformers backend does.
- **Catalog and factory entries** (fork): `ollama/<model>` references with a `backend: "ollama"` discriminator; `ZVEC_GREP_OLLAMA_HOST` defaults to `http://127.0.0.1:11434`.
- **Direct stdio server** (fork, `src/mcp/`): `zg server --stdio --mode direct` builds the engine from the project config and serves `zvec_grep_search` without opening port 7999.
- **`zvec-lane.mjs`** (spec-kit): `index`, `status`, `search`; binary resolution env, PATH, fork clone; `ZVEC_GREP_MODE=direct` injected on every spawn.
- **Doctor `zvec` route**: read-only diagnostic assembled from `status`.

### Data Flow
A query enters the wrapper, which spawns `zg` in direct mode. zvec-grep embeds the query through Ollama, scans the local index, and prints JSON. The wrapper maps each hit to the rank tuple (path, score, line, snippet), sorts, writes to stdout, and exits 0, 1 or 2. Indexing follows the same path with `zg index` and writes only under `.zvec-grep/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/retrieval/lib/rg-lane.mjs` | Owns the rank tuple shape and exit mapping | unchanged; the new lane imports or mirrors its shape | vitest asserts both lanes emit identical field sets |
| `references/retrieval/retrieval-conventions.md` | Documents lanes and recipes | update with the third lane | doc review against the wrapper's real flags |
| Doctor command routes | Diagnose retrieval health | update with a `zvec` route | doctor routes validator passes |
| Skill advisor embedder, HF model server | Preserved set from 049 | not a consumer | residue sweep live 0; no file under `system-skill-advisor` or `shared/embeddings` in the diff |

Required inventories:
- Same-class producers: `rg -n 'rankTuple|exitCode' .opencode/skills/system-spec-kit/scripts/retrieval`.
- Consumers of changed symbols: none; the wrapper is new and exports nothing shared.
- Matrix axes: binary source (env, PATH, clone) times mode (direct only) times outcome (hits, miss, failure).
- Algorithm invariant: the wrapper never runs without `ZVEC_GREP_MODE=direct` in the child environment, including when the user's own environment sets another mode.
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
| Unit | Fork: Ollama model class with a mocked HTTP layer, catalog and factory resolution, direct-server tool handler; spec-kit: wrapper resolution, arg shaping, exit mapping | vitest in both repositories |
| Integration | Fork: live Ollama smoke, end-to-end index and query in direct mode, JSON-RPC over stdio with no daemon; spec-kit: wrapper against the baseline index | shell scripts under each repository's test tree |
| Manual | Five concept queries compared against ripgrep for the same phrases | terminal, recorded in `scratch/baseline-queries.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Ollama at `127.0.0.1:11434` with an embedding model | External | Green | No embeddings; index and search both exit 2 |
| Fork clone built at `Code_Environment/zvec-grep` | Internal | Green | Wrapper falls through resolution and reports it |
| Node 22 for the fork | External | Green | Fork build fails |
| `rg-lane.mjs` rank tuple contract | Internal | Green | Consumers would see two shapes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the lane leaves processes behind, the residue sweep reports live hits, or the trigger index changes.
- **Procedure**: revert the packet's commits on `worktrees/044-zvec-grep-integration`; delete `.zvec-grep/` in the checkout; the fork branches stay untouched in their own repository.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Fork: Ollama backend ─────┐
                          ├──► Spec-kit wrapper + doctor + conventions ──► Baseline + verify
Fork: direct stdio MCP ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Fork Ollama backend | None | Baseline index with the Ollama embedder |
| Fork direct stdio MCP | None | MCP registration, which is out of this packet |
| Spec-kit wrapper | Fork binary buildable | Baseline, verify |
| Baseline and verify | Wrapper, Ollama backend | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done: fork, clone, worktree, scaffold |
| Core Implementation | Med | three agent lanes in parallel, roughly one session |
| Verification | Med | fork suites, wrapper vitest, baseline, sweep, validate |
| **Total** | | **one to two sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable, no data changes
- [x] Feature flag configured - the lane is opt-in by invocation; nothing calls it automatically
- [x] Monitoring alerts set - the doctor route is the monitor

### Rollback Procedure
1. Stop calling the wrapper; nothing else depends on it.
2. `git revert` the packet commits on the worktree branch.
3. Rerun the residue sweep and regenerate the trigger index to confirm both unchanged.
4. Nothing user-facing changes; no notification needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: delete `.zvec-grep/`; it is regenerable and ignored
<!-- /ANCHOR:enhanced-rollback -->

---

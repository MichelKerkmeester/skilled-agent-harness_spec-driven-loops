---
title: "Feature Specification: zvec-grep fork integration"
description: "Free-text retrieval over specs and skills has only a lexical lane since the memory database left; this packet forks zvec-grep, adds an Ollama embedder and a daemon-free MCP server upstream of us, and wires it into system-spec-kit as a third retrieval lane beside the trigger index and ripgrep."
trigger_phrases:
  - "zvec-grep fork"
  - "semantic retrieval lane"
  - "ollama embedding backend"
  - "direct mode mcp"
  - "zvec lane"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: zvec-grep fork integration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-04 |
| **Branch** | `worktrees/044-zvec-grep-integration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 049 retired the spec-kit memory database and left two retrieval lanes: the committed trigger index for Gate 1 and the ripgrep recipes for free text. Both are lexical, so a concept query phrased differently from the document ("how does the save path avoid the daemon") misses unless the reader already knows the vocabulary. zvec-grep gives semantic search over a local index with no service, but upstream it has no Ollama embedder, and its MCP surface needs a running daemon, which is exactly the shape 049 removed.

### Purpose
A reader in any runtime can run one semantic query over `specs/` and `.opencode/skills/` from a fresh process, with the index built locally by the fork and the embeddings served by the Ollama already on this machine.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A GitHub fork of zvec-grep (`MichelKerkmeester/zvec-grep`) carrying two branches: an Ollama embedding backend and a daemon-free `zg server --stdio --mode direct` MCP server with the same tool contract as the daemon-backed one.
- A thin integration lane in system-spec-kit: `scripts/retrieval/zvec-lane.mjs` with `index`, `status` and `search` subcommands, binary resolution (env, then PATH, then the fork clone), direct mode forced, the same rank-tuple JSON and exit mapping as the ripgrep lane.
- Project configuration for the index root and ignore rules, with `.zvec-grep/` ignored by git.
- A doctor route that reports the binary, the index and the embedder.
- A third-lane section in `references/retrieval/retrieval-conventions.md` saying when to reach for it instead of ripgrep or the trigger index.
- A baseline index over the corpus and five concept queries recorded under `scratch/baseline-queries.md`.

### Out of Scope
- Replacing the trigger index or the ripgrep lane - Gate 1 stays lexical and deterministic; this lane is additive.
- Running zvec-grep's daemon or file watcher - the operator chose direct mode, and 049 removed the last daemon for a reason.
- Vendoring the fork into this repository - the fork is a separate repository; the pin-versus-vendor decision waits until it publishes.
- Any change to the skill advisor's embedder or the shared HF model server - preserved set from 049.
- Registering the MCP server in the runtime configs - waits until the direct stdio branch lands and is verified end to end.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs` | Create | Index, status and search wrapper over the `zg` binary in direct mode |
| `.opencode/skills/system-spec-kit/scripts/tests/zvec-lane.vitest.ts` | Create | Binary resolution, argument shaping, exit mapping, rank-tuple output |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | Third-lane section and the lane selection rule |
| `.opencode/commands/doctor/**` | Modify | `zvec` diagnostic route |
| `.gitignore` | Modify | Ignore `.zvec-grep/` |
| `specs/system-speckit/050-zvec-grep-fork-integration/scratch/baseline-queries.md` | Create | Five concept queries with their top hits on the baseline index |
| `zvec-grep` fork, `src/engine/models/**`, `src/cli/**`, `src/mcp/**` | Modify | Ollama backend and direct-mode stdio server, in the fork repository |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The fork exposes an `ollama/<model>` embedding backend selectable through the existing catalog and `ZVEC_GREP_EMBEDDING`, with dimensions read from the running Ollama instance |
| REQ-002 | The fork serves the `zvec_grep_search` tool over stdio with no daemon process, answering from the on-disk index |
| REQ-003 | `zvec-lane.mjs search` returns the caller-side rank tuple JSON the ripgrep lane returns, and maps exit codes the same way: 0 hits, 1 clean miss, 2 broken invocation |
| REQ-004 | The lane never starts a daemon or watcher: every invocation runs with direct mode forced regardless of the user's zvec-grep config |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The doctor `zvec` route reports binary path, index presence and age, embedder reference, and Ollama reachability, each as a separate line |
| REQ-006 | The retrieval conventions name the three lanes and the rule for choosing between them |
| REQ-007 | A baseline index over `specs/` and `.opencode/skills/` exists and five concept queries are recorded with their top hits |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh process runs `node zvec-lane.mjs search "<concept query>"` and returns ranked hits in under five seconds against the baseline index, with no zvec-grep process left running afterwards.
- **SC-002**: The fork's unit suite passes on both branches, and a JSON-RPC `tools/call` over stdio returns hits with no daemon listening on port 7999.
- **SC-003**: The 049 residue sweep still reports zero live records, and the trigger index is byte-identical after this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Ollama running locally with an embedding model pulled | No embeddings, so no index | The lane reports the unreachable host on `status`; the fork's model2vec backend stays as the offline fallback |
| Dependency | The fork clone at a known path or `ZVEC_GREP_BIN` set | Lane cannot find a binary | Resolution order is documented and the doctor route names which step failed |
| Risk | Upstream zvec-grep moves under the fork | Med | Both fork branches are small and rebase cleanly; the integration lane depends only on the CLI contract |
| Risk | Direct mode re-embeds changed files on every query | Med | Measured in the baseline; if query latency exceeds the budget the lane indexes explicitly and searches with change detection off |
| Risk | Index contents leak into git | Low | `.zvec-grep/` ignored at the repository root before the first index run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Search on a warm index returns in under five seconds from a fresh process, including the Ollama embedding of the query.
- **NFR-P02**: A full index of the corpus completes in under fifteen minutes on this machine with `nomic-embed-text`.

### Security
- **NFR-S01**: The lane talks only to `127.0.0.1` Ollama; no remote embedding endpoint is configured or reachable through it.
- **NFR-S02**: Index files stay under the repository's ignored `.zvec-grep/` directory and are never committed.

### Reliability
- **NFR-R01**: Every failure exits 2 with a one-line reason on stderr; stdout stays empty on failure so callers can trust its JSON.
- **NFR-R02**: No invocation leaves a child process behind; verified by process listing after each test run.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty query exits 2 with a usage line; it never runs an embedding.
- Maximum length: queries longer than the embedder's context are truncated by Ollama; the lane passes them through and records the truncation warning if the API returns one.
- Invalid format: unknown subcommands or flags exit 2 before any binary is spawned.

### Error Scenarios
- External service failure: Ollama unreachable exits 2 naming the host and port; the lane does not fall back to another embedder silently, because a silent switch changes the vector space under an existing index.
- Network timeout: a single embed request timeout is surfaced as exit 2; there is no retry loop, the caller decides.
- Concurrent access: two searches share the on-disk index read-only; two concurrent index runs are refused by zvec-grep's own lock and reported as exit 2.

### State Transitions
- Partial completion: an interrupted index run leaves zvec-grep's incremental state; the next `index` resumes from it rather than starting over.
- Session expiry: not applicable, there is no session; every call is a fresh process.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two fork branches plus one wrapper, one test file, one doc section, one doctor route |
| Risk | 8/25 | Additive lane, no shared contract changes, no daemon, nothing in the preserved set |
| Research | 8/20 | Fork seams already read; Ollama embed API and stdio bridge shape known |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Pin the fork as an npm dependency once published, or vendor the built `dist/`? Decided after the fork branches merge.
- Should Gate 1 consult the semantic lane when the trigger index returns nothing? Not in this packet; recorded for the retrieval conventions follow-up.
<!-- /ANCHOR:questions -->

---

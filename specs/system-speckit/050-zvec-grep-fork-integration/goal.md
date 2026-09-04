---
title: "Goal: Semantic Retrieval Hook"
description: "The durable directive for turning the zvec-grep fork into a cross-runtime hook concern under .opencode/hooks, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "semantic retrieval hook"
  - "zvec-grep hook concern"
  - "prompt-time semantic brief"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-zvec-grep-fork-integration"
    last_updated_at: "2026-09-04T14:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive for the hook concern"
    next_safe_action: "Open the hook packet, run recommend-level, and build phase 1"
    blockers: []
    key_files:
      - ".opencode/hooks/README.md"
      - ".opencode/hooks/skill-advisor/README.md"
      - ".opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-050-zvec-grep-fork-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The engine stays in the fork and the spec-kit lane; the hook is a consumer, not a second engine"
      - "The fork is vendored at .opencode/skills/system-plugins/zvec-grep as a git subtree, the operator's call on 2026-09-04"
---
# Goal: Semantic Retrieval Hook

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the zvec-grep fork a hook concern under `.opencode/hooks/semantic-retrieval/` that, on every user prompt in every maintained runtime, injects a bounded brief of semantically matching spec and skill documents, with no daemon, no watcher and no process left behind.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The concern is a consumer, not an engine. Search runs through the spec-kit lane `scripts/retrieval/zvec-lane.mjs` in direct mode against the fork binary; the hook owns only prompt handling, budget, rendering and delivery. The pattern is `hooks/skill-advisor/`: thin per-runtime adapters over one maintained implementation |
| D2 | Runtimes covered are the six the skill-advisor concern covers: Claude, Codex, Cursor, Devin, Pi, and the OpenCode plugin bridge. A runtime with no prompt event is marked `by-design` in the coverage matrix, never silently skipped |
| D3 | The brief is advisory and fails open. Any failure, timeout, missing binary, missing index, unreachable Ollama or unparsable output resolves to no injection; the prompt is never blocked or delayed past the budget |
| D4 | The budget is hard: the adapter returns within 1500 ms wall clock or emits nothing. The query path must not refresh the index, re-embed changed files or download a model; indexing is an explicit operator or doctor action |
| D5 | Embeddings come from Ollama through the fork's `ollama/` backend. The in-process transformers backend is never selected by the hook, because it runs the model on every core and pins the machine |
| D6 | The concern honors the master `SYSTEM_HOOKS_DISABLED` switch and its own `SYSTEM_SEMANTIC_RETRIEVAL_DISABLED`, default enabled, registered in the hooks README kill-switch index. It replaces the retired `spec-memory` row there |
| D7 | The fork is installed inside the harness at `.opencode/skills/system-plugins/zvec-grep/` as a squashed git subtree of the fork's `harness` branch (the Ollama, stdio and perf branches merged): its own `package.json`, its own `node_modules` ignored like every other engine package, and a built `dist/` produced by the install guide's build step. No clone outside `.opencode` and no global `zg` is ever consulted; the lane resolves the vendored binary first and `SPECKIT_ZVEC_GREP_BIN` becomes an override, not the default |
| D8 | Raw prompt text is never persisted: not in caches, diagnostics, status output or logs. The brief names paths, headings and scores only, and repeats the skill-advisor's directive-lifecycle dedup so the same prompt does not re-inject the same brief |
| D9 | The trigger index and the ripgrep lane are untouched. Gate 1 stays lexical and deterministic; this concern adds a lane and removes nothing |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the engine packet before working the hook.** This directive builds on
work already verified in this packet, and its documents are authoritative for
the engine side.

| Layer | Where it is settled |
|-------|---------------------|
| Fork: Ollama backend | `MichelKerkmeester/zvec-grep`, branch `feat/ollama-backend`, commit `6ac153b` |
| Fork: daemon-free stdio MCP | `MichelKerkmeester/zvec-grep`, branch `feat/direct-stdio-mcp`, commit `8f0f023` |
| Spec-kit lane, config, doctor route | this packet's `spec.md`, `plan.md`, `acceptance-criteria.md`; code at `scripts/retrieval/zvec-lane.mjs` |
| Hook concern shape and per-runtime delivery | `.opencode/hooks/README.md`, `.opencode/hooks/skill-advisor/README.md`, `.opencode/hooks/injection-contract.md` |
| Fail-open and kill-switch mechanics | `.opencode/hooks/shared/hook-flags.*` and the shared adapter helper |

**Packet.** The hook is new work outside this packet's frozen scope, so it takes
its own packet. Run `recommend-level.sh` on it before scaffolding; six runtime
adapters plus a coverage matrix is likely Level 3, and the phase thresholds in
`phase-definitions.md` §2 decide whether it is phased.

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `.opencode/hooks/semantic-retrieval/` exists with a README, a coverage matrix over Claude, Codex, Cursor, Devin, Pi and OpenCode, and one adapter per covered runtime registered in that runtime's hook config
- [ ] A user prompt in each covered runtime produces a brief beginning `Semantic:` that names at least one matching document from the baseline index, captured once per runtime as evidence
- [ ] With Ollama stopped, with the binary absent, and with the index deleted, every adapter emits nothing and the prompt proceeds; the hook smoke test proves all three
- [ ] Every adapter returns within 1500 ms wall clock on the baseline index, measured over twenty prompts per runtime, and no `zg` process survives the call
- [ ] `SYSTEM_SEMANTIC_RETRIEVAL_DISABLED=1` and `SYSTEM_HOOKS_DISABLED=1` each silence the concern, and the hooks README kill-switch index carries the row
- [ ] The residue sweep reports zero live records, the trigger index regenerates byte-identical, and `validate.sh --strict` on the hook packet exits 0
- [ ] No raw prompt text appears in any file the concern writes, proven by a grep of its state, cache and log locations after the smoke run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Fork Ollama backend | Done | `6ac153b`, 113 unit tests, live smoke returns 768-dimension vectors |
| Fork direct stdio MCP | Done | `8f0f023`, 111 unit and 7 e2e tests, zero daemons after the run |
| Spec-kit lane, doctor route, conventions | Done | `1278a7cc86` on `worktrees/044-zvec-grep-integration`, 35 tests |
| Baseline index through Ollama | Done | 24,304 files, 2.1 GB, about 83 minutes; four of five concept queries land on the right document, recorded in `scratch/baseline-queries.md` |
| Fork perf branch | Done | `e30aac7`, query 40 s to under 1 s on the baseline index |
| Hook concern | Not started | this directive |

### DONE WHEN

One row per completion criterion above, with the evidence that closes it.

| Criterion | Evidence |
|-----------|----------|
| Concern tree, matrix and registrations exist | |
| A brief appears in each covered runtime | |
| Three failure modes emit nothing | |
| Budget held and no surviving process | |
| Kill switches silence the concern | |
| Sweep, index and validation unchanged or green | |
| No raw prompt text persisted | |

### Deviations and findings

| Item | Note |
|------|------|
| Direct-mode query latency is 38 s on the baseline, not the 1500 ms budget | Profiled 2026-09-04: 34 of 39 s are the fork's scanner walking all 24,304 paths and recompiling every ignore glob per path, run on every query only to print a stale hint. The search itself is 72 ms and the collection opens in 124 ms. Fixed on fork branch `perf/direct-query-scan` (`e30aac7`, memoized glob compiler; no status scan unless `--refresh wait`) and re-timed through the lane: 0.8 to 1.1 s warm, 2.0 s cold, same top hits. The fork's `harness` branch (`893af2f`) merges the three branches and is the build to vendor |
| The fork's test suite leaks daemons | Upstream's `test/server-controller.test.mjs` concurrent-start case leaves `zg server run` processes reparented to launchd under load; seven were killed by hand on 2026-09-04. Not this concern's code path, but the hook smoke test must count processes after every run so a leak from any source is caught |
| `zg` on PATH is upstream, not the fork | Homebrew's global `@zvec/zvec-grep` 0.2.1 wins the lane's PATH step today; D7 moves the vendored binary to the front of the resolution order so PATH is never consulted when the harness copy exists |
| DECIDED 2026-09-04: vendored, not pinned | The operator chose to install the fork inside `.opencode` rather than pin a separate repository. Footprint measured from the clone: 3 MB built dist, 620 MB `node_modules` of which the vector store binding is 29 MB and the transformers plus tree-sitter grammars 97 MB, all ignored like every other engine package |
| Hidden directories are skipped without `--hidden` | The lane forces the flag; the hook must never call the binary directly, which is D1's point |
| Ollama context for nomic is 2048, not 8192 | Measured from the live server; the fork's catalog pins the measured figure so chunks are never silently truncated |
<!-- /ANCHOR:log -->

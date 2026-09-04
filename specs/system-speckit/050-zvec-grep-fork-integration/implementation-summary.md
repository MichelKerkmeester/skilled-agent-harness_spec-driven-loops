---
title: "Implementation Summary: zvec-grep fork integration"
description: "Specs and skills now have a semantic retrieval lane: a forked zvec-grep with an Ollama embedder and a daemon-free MCP server, wrapped by system-spec-kit in direct mode, baselined at 24,304 files with sub-second warm queries after a fork scan defect was profiled and fixed."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-zvec-grep-fork-integration"
    last_updated_at: "2026-09-04T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed the packet after the post-fix baseline"
    next_safe_action: "Open the hook packet from goal.md and vendor the fork harness branch into .opencode"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs"
      - ".zvec-grep-lane.json"
      - ".opencode/commands/doctor/assets/doctor-zvec.yaml"
      - "specs/system-speckit/050-zvec-grep-fork-integration/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-050-zvec-grep-fork-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The fork is vendored into .opencode as a git subtree under the hook concern"
      - "Query latency was the fork scanning the workspace on every direct query, not the index or the embedder"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 050-zvec-grep-fork-integration |
| **Completed** | 2026-09-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now ask the repository a question in your own words and get the document that answers it, even when your wording shares no keyword with the text. A forked zvec-grep builds a local semantic index over specs and skills, embeds through the Ollama already on the machine, and answers from a fresh process with no daemon. On the baseline corpus four of five concept queries land on the right document at rank one or two, where ripgrep with the obvious keyword returns between 24 and 290 unranked files.

### The fork

Three branches in `MichelKerkmeester/zvec-grep`, each based on upstream main so it can go upstream alone, merged locally into `harness`. The Ollama backend adds an `ollama/<model>` embedding reference that reads dimensions and context from the live server, with the nomic context pinned at the measured 2048 so chunks are never silently truncated. The direct stdio server serves the same `zvec_grep_search` tool contract in-process, proven by a JSON-RPC session with the daemon port asserted closed throughout. The perf branch memoizes the glob compiler and stops direct queries from scanning the workspace to print a stale hint: 40 seconds a query became under one second.

### The lane

`zvec-lane.mjs` gives system-spec-kit `index`, `status` and `search` over the fork binary. It forces direct mode and hidden-directory scanning on every spawn, reads scores from trace output, computes the three-way exit mapping the binary lacks, and emits the same rank tuple as the ripgrep lane. The reviewable scope lives in a root config the wrapper translates, because zvec-grep has no project config of its own. A doctor `zvec` route reports binary, index, embedder and Ollama separately, and the retrieval conventions now describe three lanes and when to reach for each.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs` | Created | Index, status and search wrapper; direct mode, hidden scan, rank tuple, exit mapping, overridable ceilings |
| `.opencode/skills/system-spec-kit/scripts/tests/zvec-lane.vitest.ts`, `scripts/retrieval/fixtures/zvec-*` | Created | 35 tests over a stub binary shaped from observed output |
| `.zvec-grep-lane.json`, `.gitignore` | Created, Modified | Reviewable index scope on the Ollama embedder; `.zvec-grep/` ignored |
| `.opencode/commands/doctor/assets/doctor-zvec.yaml`, `_routes.yaml`, `speckit.md`, presentation, commands README | Created, Modified | The tenth doctor subsystem |
| `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modified | Three lanes and the selection rule |
| `.opencode/skills/system-spec-kit/data/trigger-index.json` and fixtures | Modified | Regenerated for this packet's six documents |
| fork `src/engine/models/backends/ollama.ts`, catalog, factory, help, docs, tests | Created, Modified | `feat/ollama-backend`, `6ac153b` |
| fork `src/mcp/direct-backend.ts`, `stdio-direct.ts`, CLI, install, docs, tests | Created, Modified | `feat/direct-stdio-mcp`, `8f0f023` |
| fork `src/engine/utils/glob.ts`, `src/cli/commands.ts`, docs, tests | Modified | `perf/direct-query-scan`, `e30aac7` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three agent lanes ran in parallel, one per fork branch and one for the spec-kit wrapper, each verified on disk against its own report: the fork suites re-run, the wrapper tests re-run, daemons counted after every run. The wrapper lane's first corpus index was killed because the transformers backend pinned every core, which is why the Ollama backend became the default before the baseline ran. The baseline itself took two runs, the first killed by the wrapper's own one-hour ceiling. Every query then measured about 40 seconds; a CPU profile traced 34 of them to the fork's scanner, and a fourth lane fixed that on its own branch with before-and-after timings on the real index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The lane is a shell-out in direct mode, never a daemon | Packet 049 removed the last retrieval daemon for a reason, and the operator chose direct mode; the fork's stdio branch exists so the MCP surface needs none either |
| Ollama is the default embedder and the transformers backend is never selected by default | The in-process backend ran nomic on every core at 860 percent CPU; Ollama serves the same model from the GPU-backed server at under two cores |
| The nomic context is pinned at 2048, not the model card's 8192 | The live server rejects longer input or truncates it silently depending on a flag; sizing chunks to the card figure would drop content with the truncation counter at zero |
| `--hidden` is forced on every index spawn | Without it zvec-grep skips every dotted directory, accepts globs naming `.opencode`, and reports full coverage of the half it scanned |
| The perf fix is its own branch on upstream main | It is an upstream defect with an upstream-shaped fix; tying it to the Ollama branch would make it unmergeable there |
| The fork is vendored into `.opencode`, not pinned | The operator's call: the harness carries its engines as packages with their own manifests, and the fork follows that pattern |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fork unit suites on the three branches and on `harness` | 113, 111, 104 and 122 passed, 0 failed |
| Fork stdio e2e | 7 passed; daemon port closed before, during and after; 0 daemons |
| Fork live Ollama smoke | 1 passed, real 768-dimension vectors |
| `vitest run zvec-lane trigger-index` through `mcp-server/vitest.config.ts` | 82 passed |
| Lane status probe, Ollama live and on a closed port | reachable true with 7 models; reachable false with the connection error named |
| `route-validate.sh` | 10 routes validated, 2 pre-existing warnings |
| Baseline index through the lane | 24,304 / 24,304 files, 0 failed, 2.1 GB, about 83 minutes |
| Five concept queries, before and after the perf branch | four of five correct at rank one or two; 38.7 to 44.9 s before, 0.80 to 1.97 s after, same top hits, 0 processes left |
| `sweep-memory-residue.mjs --json` | live 0 over 3,169 paths |
| Trigger index regenerated twice | identical hashes; six paths added, all this packet, zero removed |
| `validate.sh --strict` on this packet | PASSED, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fork was vendored after this packet closed.** Packet 051 brought it in at `.opencode/skills/system-plugins/zvec-grep/` and put that copy ahead of PATH in the lane's resolution order.
2. **Cold queries sit at the hook budget.** Warm queries run 0.8 to 1.1 s; the first after a pause measured 1.97 s. The hook design must measure cold starts, not assume the warm figure.
3. **"Which rule" questions miss.** The scope indexes code only under `.opencode`, so the validator registry and rule references are absent and query 4 resolves to packets that mention the rule. A scope decision, recorded as an open question.
4. **Two upstream defects are filed, not fixed.** The fork's test suite leaks `zg server run` daemons under load from one concurrent-start test, and opening the store rewrites the vector index file in place even on a read-only query.
5. **`zg status` still scans.** 20.6 s on this corpus after the glob cache; the doctor route pays that cost, a prompt-time hook must never call it.
6. **The unreachable-Ollama case was captured through an endpoint override, not by stopping Ollama.** `ZVEC_GREP_OLLAMA_URL` pointed at a closed port gives the same probe failure a stopped server would; stopping the operator's server was not a change this session took.
<!-- /ANCHOR:limitations -->

---

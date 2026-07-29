# Closeout Facts — Code Graph Decommission (for doc-authoring workers)

Ground truth for filling the per-phase `plan.md`, `tasks.md`, and
`implementation-summary.md`. Do not invent beyond this file plus each phase's
own `spec.md`. All phases are EXECUTED; docs describe what happened.

## Global facts

- Subject: `.opencode/skills/system-code-graph/` — the live `mk_code_index` MCP
  server (8 `code_graph_*` tools, SQLite store, CLI). Fully removed; structural
  search retired, NOT replaced. Replacement routing: Grep/Glob for code,
  `memory_search` (separate subsystem) for spec docs.
- Decision authority: `002-decommission-decision-record/decision-record.md`
  (ADR-001..005, all Accepted).
- Research authority: `001-touchpoint-research/research/research.md` (merged
  3-lane synthesis: sol=cli-codex gpt-5.6-sol high 10 iters; glm=cli-devin
  glm-5-2 free 5 iters; grok=cli-cursor cursor-grok-4.5-high 5 iters).
- Sweep rule proven during research: `rg --hidden --no-ignore` mandatory;
  `--no-ignore` alone drops dot-prefixed control files.
- Residual live-surface count: 560 files at baseline → 50 after execution (all
  remaining are string literals in fixtures/corpora/manifests; no live imports).
- Verification evidence: spec-kit typecheck 0 errors; 418 tests green across
  changed spec-kit files; mcp-route-guard 16/16; no `mk-code-index` process; no
  `/tmp/mk-code-index` socket; 0 tracked files under the old skill path; no
  `mk_code_index` in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`,
  `.pi/mcp.json`.

## Commits (this branch, skilled/v4.0.0.0)

- `1ea5f7c1b4` phase 005 — spec-kit runtime decoupling (boundary, contract
  consumers, quality-score reweight 0.44/0.31/0.25, enrichment, startup brief).
- `5a2aab0d37` phase 007 — advisor: node/edges/lanes/py-twin, skill_count 12→11,
  benches deleted, tri-daemon drill reduced, corpora rows dropped.
- `67f0b073aa` phases 009+010 — doctor route deleted, 52 command files, 4 agent
  mirrors (.opencode/.claude/.codex/.pi), contract COMPILER allowlists fixed at
  source then contracts re-rendered.
- `fef098b6b2` — shared launcher-ipc-bridge STRIPPED (never deleted; serves
  mk-spec-memory + mk-skill-advisor, verified loading after), session reapers,
  worktree wrapper, post-commit graph half removed, smoke matrices, 141 doc
  files swept (phases 004/006/008/011/012 remainder).
- `1e548b0ed5` — code-graph-contracts.ts removed after import proof,
  graph-readiness-mapper chain, OpenCode transport graphOps, CI isolation job
  deleted, tombstone `context-index.md` added at track root (phases 005/012/014).
- `b54aeea89e` — dead structural routing nudge removed (context-server +
  memory-context), route-guard entry (16/16 assertions pass after).
- `607ba8cdf6` — graph-subject tests retired: session-health.vitest.ts and
  session-bootstrap.vitest.ts deleted whole (every case asserted removed graph
  sections); individual cases from session-resume/context-metrics; 418 green.
- Phases 003/004/011/012/013 partially executed by a concurrent session in the
  main tree (registrations, plugins, doctrine, binaries, tree deletion) before
  this session completed the remainder; daemon+socket reaped in this session.

## Per-phase one-liners (use with each phase's spec.md)

- 001: research executed earlier (3 lanes, 20 iters, forced depth); synthesis +
  refuted-claims ledger in research/research.md. Complete.
- 002: five ADRs ratified. Open operator item at the time (ignored-DB backup)
  was overtaken by events: tree was already deleted before 013 ran, so no
  archive was possible — record as a limitation, not a done item.
- 003: registrations removed everywhere; `.codex/config.toml` was already clean.
- 004: two plugins + tests deleted; codex hook matcher-object removed
  structurally; cursor chained hook inside spec-kit stripped; freshness-state
  dir removed; session-cleanup test repointed to a surviving launcher (13/13).
- 005: 25 call sites across 9 importers; boundary + structural-bootstrap
  contract deleted; trust states now permanently 'absent' (honest value);
  passive enrichment keeps session-warning step only.
- 006: 4 graph-only test files deleted first; mock/import strip across 10 more;
  2 whole suites deleted later when every case proved graph-subject.
- 007: see commit `5a2aab0d37`; Python scorer kept in parity with TS lanes.
- 008: skills swept in `fef098b6b2` (deep-loop, sk-doc, sk-code, mcp-code-mode
  route guard + tests, skills README).
- 009: compiler-owned allowlists were the hidden source; fixed at source.
- 010: 8 agents × 4 mirrors; wedged-daemon fallback prose reduced to the
  spec-memory daemon only, matching the already-migrated .claude wording.
- 011: doctrine largely rewritten by the concurrent session (4-server roster,
  Grep-based search tree); this session swept the remainder + bin/lib READMEs.
- 012: launcher/CLI/bridge-tests deleted by concurrent session; this session
  stripped the SHARED bridge branch, smoke matrices, gitignore, deploy-mcp
  build step, and deleted the CI isolation job.
- 013: tree absent from disk AND index; daemon processes and /tmp socket reaped
  in this session. NOT done: pre-deletion backup of ignored SQLite/WAL/lease
  state (impossible — already gone). Record as limitation.
- 014: tombstone `context-index.md` at `.opencode/specs/system-code-graph/`;
  archival surfaces untouched (verify claim: no edits under specs/** except the
  036 packet itself).
- 015: evidence above; full-suite run was still in flight at authoring time —
  say so honestly in the summary rather than claiming it green.

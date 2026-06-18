# L2 Doc-Only Batch — Adversarial Re-Verification Verdict (12 findings)

> **Verifier:** fresh Fable 5 pass, 2026-06-12. Every doc claim re-read against CURRENT code (uncommitted worktree). Hunted specifically for the doc-fix failure mode: new claims the code does not satisfy.

```
tri-024: CLOSED
tri-076: INCOMPLETE
tri-146: CLOSED
tri-154: CLOSED
tri-147: CLOSED
tri-157: CLOSED
tri-074: INCOMPLETE
tri-143: INCOMPLETE
tri-144: CLOSED
tri-014: CLOSED
tri-107: CLOSED
tri-150: CLOSED
```

**Score: 9/12 CLOSED, 3/12 INCOMPLETE, 0 REGRESSION.** All three INCOMPLETEs are in the detect_changes/prune-excludes cluster; each has a one-or-two-line remedy.

---

## Per-finding evidence

### tri-024 — CLOSED (doctor YAML stale-set step)

- New step (`doctor_code-graph.yaml:158`): "If code_graph_status available: invoke code_graph_status({}) and derive stale set from freshness/manifest fields".
- `code_graph_status` IS invocable with empty args: `tool-schemas.ts:70` — `inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] }`. The schema-invalid `detect_changes({})` call (diff required, `tool-schemas.ts:182-183`) is gone.
- Response fields support the derivation when combined with the phase's policy-aware filesystem walk (`doctor_code-graph.yaml:156` purpose line): `handlers/status.ts:349` `freshness`, `:373` `lastScanAt`, `:375` `lastGitHead`, `:350-365` `activeScope`, `:365-366` `storedScope`/`scopeMismatch`. `lastGitHead` + `git diff --name-only`, or `lastScanAt` + the walk's mtimes, yields the stale set.
- Minor wording note (not blocking): the status response has no field literally named "manifest" — the usable fields are `freshness`/`lastScanAt`/`lastGitHead`/`storedScope`. The step's intent is unambiguous in context and the call is schema-valid and conceptually correct.

### tri-076 — INCOMPLETE (prune-excludes playbook scenario)

What the fix got right:

- `dryRun: true` added to the call (`code-graph-apply-sub-operations.md:37`) and the mutation warning added (`:40` "Without dryRun:true, classified patterns trigger a mutating exclusion rescan").
- dryRun genuinely prevents the mutating rescan: `apply-orchestrator.ts:431-444` returns `status:'dry-run'` ("operation dispatch was skipped") BEFORE the known-good snapshot at `:446` and `dispatchOperation` at `:455`; the mutating `scan({incremental:false, excludeGlobs})` lives inside the dispatch's prune-excludes branch (`:286-312`, scan at `:304-310`). The warning sentence is accurate against the code contract.

Why INCOMPLETE — the retained "Expected:" sentence is now newly unsatisfiable under the prescribed invocation:

- `:40` still promises "returns classification of supplied patterns (which files would be pruned, which are protected, tier ranking)". With `dryRun:true` the orchestrator returns at `apply-orchestrator.ts:431-444` before dispatch, so the response contains the generic dry-run payload (`status`, `operation`, apply-STATE classification, batteries, `message`) and NO `excludeRules`/tier data — `excludeRules` is only produced inside dispatch (`:290`, `:311`) and spread into committed/rolled-back results (`:503`, `:517`).
- Even without dryRun via production MCP, the handler passes no orchestrator options (`handlers/apply.ts:24` `applyCodeGraph(args)`), so `excludeRuleConfidencePath` is undefined and every pattern returns `tier:'unknown'` (`apply-orchestrator.ts:289-291`) — no "which files would be pruned / which are protected / tier ranking" exists on any reachable path.
- Secondary: ":40" also retains "Without `lowTierOptIn:true`, low-tier patterns are reported but not applied" — the code THROWS (`:298-299` "low-tier exclude patterns require lowTierOptIn=true"), which triggers rollback (`:457-478`), it does not report-and-skip. Pre-existing text, but it sits in the same Expected sentence an operator will now check against a dry-run response.
- Remedy: rewrite the Expected line to match the dry-run payload (`status:'dry-run'`, apply-state classification, pre/post battery summaries, dispatch skipped) and move the tier-ranking description to a note gated on the (currently unwired, tri-029) confidence-artifact path.

### tri-146 — CLOSED (durations and timeouts)

- New section `tool_surface.md:44-47`. Claims verified: `DEFAULT_TIMEOUT_MS = 30_000` (`code-index-cli.ts:26`); `--timeout-ms` is a real flag (`:244` usage, `:454-456` parse); apply runs preflight battery (`apply-orchestrator.ts:372`), operation dispatch (`:455`), postflight battery (`:480`); dry-run ALSO runs both batteries (preflight `:372` + postflight inside the dry-run branch `:431-433`). "Routinely exceed 30s → pass explicit `--timeout-ms` such as 120000" is sound operational guidance, not a falsifiable overclaim.

### tri-154 — CLOSED (compaction and maintenance)

- New section `tool_surface.md:48-51`. Verified: the ONLY VACUUM/checkpoint touchpoint in non-test server code is the rollback-path `db.pragma('wal_checkpoint(TRUNCATE)')` at `recovery-procedures.ts:272`, inside `rollbackBadApply` after triplet restore. `rg "VACUUM|vacuum|wal_checkpoint|checkpoint"` over `mcp_server` (tests excluded) returns exactly that one hit. "Manual offline VACUUM is the only compaction path today" is truthful.
- Minor note (not blocking): SQLite's engine-level `wal_autocheckpoint` (default 1000 pages) still runs on every connection — the doc's "no … checkpoint policy" is about application-level policy, which is correct, and the main-file bloat the section warns about is indeed untouched by engine autocheckpoint.

### tri-147 — CLOSED (route token rename)

- `_routes.yaml:81` now `--operation=rescan|prune-excludes|repair-nodes|recover-sqlite-corruption|rollback-bad-apply`, matching the enum at `tool-schemas.ts:156`.
- Repo-wide `rg "rollback-bad-run"` (hidden, .git excluded): ZERO hits outside `.opencode/specs/`. Remaining hits are historical/tracking artifacts only (notes, expected to keep the old token): `029-deep-research-remediation/L2-codegraph-apply-safety/disposition.md:27`, `029-deep-research-remediation/backlog/remediation-backlog.json:2507,2509,2515`, `029-deep-research-remediation/verify/l2-still-real-batch.md:35,77`, plus other spec-folder research/iteration docs.

### tri-157 — CLOSED (SKILL.md code-graph routing sentence)

New sentence at `system-spec-kit/SKILL.md:436`; every per-tool claim verified:

- "`code_graph_status` is always answerable": `handlers/status.ts` returns a structured envelope on every path — readiness-snapshot failure (`:229-246` degraded envelope), stats failure (`:261-292` degraded + readiness block), post-stats failure (`:397-432` degraded + readiness block), success (`:340-396`). It never returns a blocked refusal and never throws to the caller.
- "`code_graph_classify_query_intent` is text-only": `handlers/classify-query-intent.ts:12-26` — pure `classifyQueryIntent(query)`, no DB or readiness import.
- "read tools … return blocked/degraded payloads under the readiness contract": `query.ts:903-915` (`shouldBlockReadPath`: freshness !== 'fresh' or verification-gate fail), `context.ts:228-232` (`status:'blocked'`), `detect-changes.ts:69-77` (`blockedResponse`, `status:'blocked'`).
- "verify blocking when graph state is not fresh": `verify.ts:216-223` returns `status:'blocked'` + readiness when `readyState.freshness !== 'fresh'`.
- Family split matches the 8-tool surface (`tool-schemas.ts:187-196`) and `tool_surface.md:41-42`'s 3-read/5-maintenance split.

### tri-074 — INCOMPLETE (review-agent detect_changes adoption)

What the fix got right:

- (a) Call shape: every adoption site says "with the unified diff", matching the schema (`diff` required, minLength 1 — `tool-schemas.ts:179,182-183`).
- (b) Degrade-gracefully rule present verbatim at every site: `.opencode/agents/review.md:54` + tool table `:99`, `.claude/agents/review.md` (identical body), `.codex/agents/review.toml` (same additions in `developer_instructions`), `sk-code-review/SKILL.md` Phase 1 steps 2-3 (`:269-271`).
- (c) `.opencode` vs `.claude` review.md BODIES byte-identical with frontmatter stripped (diff clean); `.codex/agents/review.toml` carries the same body additions.

Why INCOMPLETE — the `.claude` mirror's tools whitelist was not updated:

- `.claude/agents/review.md:4` — `tools: Read, Bash, Grep, Glob, mcp__mk_spec_memory__*`. No `mcp__mk_code_index__detect_changes`. In Claude Code an explicit `tools:` frontmatter list restricts the agent's tool access, so this agent's body now mandates a tool it cannot invoke ("Use `detect_changes` with the unified diff…"). The sibling `.claude/agents/deep-review.md:4` WAS updated correctly in the same batch, proving the pattern was known.
- Remedy: append `, mcp__mk_code_index__detect_changes` to `.claude/agents/review.md:4`.

### tri-143 — INCOMPLETE (deep-review detect_changes adoption)

What the fix got right:

- Body adoption + degrade rule present in all three runtimes (`.opencode/agents/deep-review.md:170-171`, tool list `:262`; `.claude` body byte-identical; `.codex/agents/deep-review.toml` same additions). `.claude/agents/deep-review.md:4` tools line correctly extended with `mcp__mk_code_index__detect_changes`.
- Bonus accuracy fixes verified: `.claude` deep-review path convention corrected to `.opencode/agents/*.md`, and the duplicated mirror-table row now correctly names `.codex/agents/deep-review.toml`.

Why INCOMPLETE — the explicit sub-check (e) fails:

- `.opencode/agents/deep-review.md:17` adds permission key `mcp__mk_code_index__detect_changes: allow`, but the SAME file names the same MCP server's other tools bare: `:15` `code_graph_query: allow`, `:16` `code_graph_context: allow` (same convention in `.opencode/agents/deep-context.md:17-18`). A repo-wide grep shows this is the ONLY `mcp__`-prefixed permission key in any `.opencode/agents/*.md` frontmatter. If the OpenCode permission matcher resolves the tool as `detect_changes` (as it evidently does for `code_graph_query`/`code_graph_context`), the new key never matches and the documented preflight is silently denied.
- Remedy: rename the key to `detect_changes: allow` (or prove the prefixed form resolves and normalize the two siblings instead — either way the file must be self-consistent).

### tri-144 — CLOSED (sk-code-review playbook scenario)

- New file `07--structural-impact-preflight/detect-changes-assisted-review.md` exists and follows the package's structural conventions: same 5-section skeleton as siblings (`## 1. OVERVIEW` … `## 5. SOURCE METADATA`, matching `06--cross-cli-orchestration/cli-codex-delegation.md:12-76`); the execution table (`:46-48`) has exactly 9 columns matching the 9-column contract; SCENARIO CONTRACT prompt (`:28`) equals the table's Exact Prompt cell (`:48`) per the `:82` equality requirement; call shape feeds a unified diff (schema-conformant); the degrade caveat is the scenario's core assertion (Step 3, `:30,:43`).
- Index updates verified in `manual_testing_playbook.md`: directory listed (`:24`), 18→19 in overview (`:30`), coverage note names structural-impact preflight (`:32`), release gate `TOTAL_FEATURES == 19` (`:130`), ledger `CR-001..CR-019` (`:144`), structural sweep "all 19 files" (`:159`), wave table row 5 (`:195`), new §13 STRUCTURAL IMPACT PREFLIGHT with CR-019 contract, catalog row (`:605`). Disk count confirms 19 per-feature files.
- The destructive-scenario rule relaxation (`:58` — reversible fixture diffs allowed, tree restored before verdict) is internally consistent with CR-019's fixture needs and with the read-only review-agent contract.

### tri-014 — CLOSED (generate-context contract wording)

- Code ground truth re-confirmed: `scripts/core/workflow.ts:1651` `const writtenFiles: string[] = []`, `:1652` "Skipping legacy [spec]/memory/*.md writes", `:1895` returned still-empty — generate-context writes NO canonical doc content.
- New wording does not overclaim in the other direction; everything it still promises is real: description.json tracking/regeneration runs on every canonical save (`workflow.ts:1663-1740`), graph-metadata refresh via the MCP indexing API (`:1748-1782`), and indexing handoff (Step 11.5 auto-index `:1823+`; `memory_index_scan` follow-up surfaces `:599-625`).
- Doc surfaces verified: `commands/memory/save.md:63` route row now "Metadata refresh and index handoff"; step 6 (`:38`) names the metadata/description/graph-metadata refresh + index handoff and assigns canonical content to the MCP content-router path (which does write files — `handlers/memory-save.ts` per the in-file ownership comment at `workflow.ts:1560-1564`). `AGENTS.md:263-265` "Metadata + index save … writes NO canonical doc content — canonical spec-doc content is owned by the MCP `memory_save` content-router path". All truthful.

### tri-107 — CLOSED (reconcile success-coverage opt-in)

- `repairSuccessCoverage` exists with default false: spec-kit `tool-schemas.ts:520` — `{ type: 'boolean', default: false, … }`; handler gates on `=== true` (`lib/embedders/embedding-reconcile.ts:343`), and the success-row repair runs ONLY under the flag (planned mutation `:406-408`, apply UPDATE `:456+`).
- Dry-run reports coverage numbers as the doc now implies: `coverage = { successMissingActiveVector: computeSuccessCoverage(...) }` computed unconditionally on the main path (`:402`) and returned in the dry-run result (`:415`).
- Both doc sites accurate: `INSTALL_GUIDE.md:737` (reconcile section note — opt-in flag, default false, default invocation leaves success rows untouched, dry-run first) and `:955` (troubleshooting row — add the flag when success-status rows are missing their active vector, dry-run first). Edge note (cosmetic): the two fail-closed early returns (`memory_index` table missing / active shard unverified) return without a `coverage` field — irrelevant to the documented flow.

### tri-150 — CLOSED (.gitignore apply artifacts)

- `git status --porcelain --untracked-files=all .opencode/skills/system-code-graph/mcp_server/database/` → empty (clean), while the directory contains live artifacts on disk (`apply-audit/`, `quarantine-2026-06-11…/`, `recovery-2026-06-11…/`, sqlite triplet).
- New rules `.gitignore:121-127` (comment + `apply-audit/`, `quarantine-*/`, `recovery-*/`, `known-good-*/`, `bad-apply-*/`, all database-local) fire correctly: `git check-ignore -v` attributes `apply-audit/` to `.gitignore:123` and the DB to the pre-existing `:118`.
- No tracked file became ignored: `git ls-files .opencode/skills/system-code-graph/mcp_server/database/` returns ZERO paths — there is nothing tracked under the tree to shadow, so the tracked-file hazard is vacuously absent. Rules are scoped to the database directory (not an overbroad `database/**` across the repo).

---

## NEW inaccuracies introduced by this batch

1. **(tri-076) Unsatisfiable Expected output under the prescribed call** — `code-graph-apply-sub-operations.md:40` promises pattern-tier classification ("which files would be pruned, which are protected, tier ranking") from a `dryRun:true` invocation, but `apply-orchestrator.ts:431-444` returns before dispatch, so the response can never contain `excludeRules`; and via the MCP handler (no options, `handlers/apply.ts:24`) even non-dry-run returns all `tier:'unknown'` (`apply-orchestrator.ts:289-291`).
2. **(tri-074) `.claude/agents/review.md` body mandates a tool outside its frontmatter whitelist** — `:4` `tools:` lacks `mcp__mk_code_index__detect_changes` while the new workflow step and tool-table row require it; deep-review's mirror got the whitelist update, review's did not.
3. **(tri-143) Permission-key naming outlier in `.opencode/agents/deep-review.md`** — `:17` `mcp__mk_code_index__detect_changes: allow` diverges from the file's own bare-name convention for the same server's tools (`:15-16`), the only `mcp__`-prefixed permission key across all `.opencode/agents` frontmatter; risk that the allow never matches at runtime.

Notes (not defects):

- `system-code-graph/SKILL.md:35` still frames `detect_changes` as "after receiving a code-review patch from a non-local agent" — a situational trigger, not an exclusivity claim, but now lags the local-diff adoption story; worth a one-line refresh in a follow-up.
- `tool_surface.md:50` "no … checkpoint policy" is application-level true; SQLite engine autocheckpoint still runs (does not affect the main-file bloat the section warns about).
- `doctor_code-graph.yaml:158` "manifest fields" is loose — no literal `manifest` field exists in the status response; `freshness`/`lastScanAt`/`lastGitHead`/`storedScope` are the actual fields.
- Historical `rollback-bad-run` strings persist only under `.opencode/specs/` tracking artifacts (backlog JSON, disposition, verify docs) — expected.

**BATCH VERDICT: 9 CLOSED / 3 INCOMPLETE / 0 REGRESSION**

# RCAF DEEP REVIEW — ITERATION 1 — deep-loop-runtime skill

## ROLE
You are an expert reviewer of OpenCode peer skills. Your job is to audit the `.opencode/skills/deep-loop-runtime/` skill for correctness, security, traceability, and maintainability issues. You produce structured findings with severity tags (P0/P1/P2) and concrete file:line evidence.

## CONTEXT
The deep-loop-runtime skill was just shipped (arc 118 on 2026-05-22). It's a new peer skill that holds runtime infrastructure relocated from `system-spec-kit/mcp_server/` per a user-directive FULL ISOLATE override of the 117 AI Council SPLIT ruling.

Skill contents:
- `SKILL.md` v1.0.0 (DQI 95) + `README.md` (DQI 98) + `changelog/v1.0.0.md` (DQI 75)
- `lib/deep-loop/*.ts` — 10 TypeScript modules (executor-config, executor-audit, prompt-pack, post-dispatch-validate, atomic-state, jsonl-repair, loop-lock, permissions-gate, bayesian-scorer, fallback-router)
- `lib/coverage-graph/*.ts` — 3 modules (coverage-graph-db, coverage-graph-query, coverage-graph-signals)
- `scripts/*.cjs` — 4 entry points (convergence, upsert, query, status) replacing the deleted `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools
- `storage/deep-loop-graph.sqlite` — runtime-owned SQLite
- `tests/{unit,integration,lifecycle,_helpers}/` — 21 vitest files + spawn-cjs.ts helper
- `feature_catalog/` (18 files) + `manual_testing_playbook/` (18 files) + `references/` (4 files)
- `graph-metadata.json`

Review state files at `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/`:
- `deep-review-config.json` — configuration
- `deep-review-strategy.md` — review dimensions + convergence rule
- `deep-review-state.jsonl` — append-only state log (you don't need to read prior iters since this is iter-1)

Phase 003 ADR-001 documents the `.cjs` script interface contract:
- CLI args (--spec-folder, --session-id, --loop-type, etc.)
- JSON output to stdout
- Exit codes: 0=ok, 1=script error, 2=DB error, 3=input validation error
- DB lifecycle: open in try, close in finally
- Single owner of `deep-loop-graph.sqlite` per invocation

This is ITERATION 1 of 10. Focus on the **correctness** + **security** dimensions first (per the dimension ordering rule — higher-risk dimensions early). Subsequent iters will cover traceability + maintainability + cross-cutting concerns.

## ACTION

Execute these 4 ordered steps. Each step has explicit acceptance criteria.

**Step 1: Map the script interface contract surface (ACCEPTANCE: file paths + line numbers cited).**
Read all 4 .cjs scripts at `.opencode/skills/deep-loop-runtime/scripts/`. For each:
- Verify the CLI args match the contract documented in 118/003 `decision-record.md` ADR-001
- Verify exit codes (0/1/2/3) implemented per the documented matrix
- Verify DB open/close lifecycle uses try/finally pattern
- Verify JSON-only output to stdout (no stray console.log etc.)
Cite file:line for any deviation. Flag P0 for contract violations.

**Step 2: Audit the lib code for correctness preservation post-move (ACCEPTANCE: import-path coherence + invariant preservation).**
Read each lib file under `lib/deep-loop/` and `lib/coverage-graph/`. Verify:
- Internal imports between deep-loop and coverage-graph files are correct (most should stay valid since they moved together)
- No leftover imports from old paths (`system-spec-kit/mcp_server/lib/deep-loop/` or `.../lib/coverage-graph/`)
- `loop-lock.ts` invariants: single-writer behavior preserved; lock file path correct for new location
- `atomic-state.ts` semantics: write-temp + rename pattern; no torn writes
- `coverage-graph-db.ts`: SQLite path points at `deep-loop-runtime/storage/deep-loop-graph.sqlite`; schema-creation idempotent
Cite file:line. Flag P0 for semantic regressions; P1 for stale imports or path drift.

**Step 3: Security audit on the script + lib surface (ACCEPTANCE: each scan dimension addressed).**
For each .cjs script + relevant lib code:
- Path traversal: are `--spec-folder` and similar args validated/normalized before use?
- SQL injection: are query parameters always parameterized (no string concat into SQL)?
- Permissions-gate scoping: does `permissions-gate.ts` correctly scope writes to expected paths?
- Sandbox boundary: do scripts honor read-only on review targets when reviewing?
- Secrets: any hardcoded tokens / credentials / API keys?
Cite file:line for each issue. Severity: P0 for exploitable; P1 for hardening gaps; P2 for stylistic concerns.

**Step 4: Write the findings file (ACCEPTANCE: structured markdown + delta JSONL).**
Write to `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/iterations/iteration-001.md`:
```markdown
# Iteration 1 — Correctness + Security (cli-devin swe-1.6)

## Summary
<one paragraph summary>

## Findings

### P0 (Blockers)
- [F-001] <title> — <file:line> — <one-sentence issue>
  Evidence: <2-3 lines>
  Recommended fix: <one-line>

### P1 (Required)
...

### P2 (Suggestions)
...

## Dimensions Covered This Iter
- correctness: <coverage notes>
- security: <coverage notes>

## Next-Iter Suggestions
<bullet list of areas iter-2+ should focus>

## Convergence Signal (self-report)
- newFindings: <N>
- newFindingsRatio (vs prior iter): N/A (this is iter-1; baseline)
- evidence gate: PASS/FAIL
- scope gate: PASS/FAIL
- coverage gate: PASS/FAIL
```

Also write a delta JSONL at `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/deltas/iter-001.jsonl`:
```jsonl
{"iter":1,"finding_id":"F-001","severity":"P0","dimension":"correctness","file":"<path>","line":<N>,"title":"<title>","evidence":"<quote>","fix":"<recommendation>"}
{"iter":1,"finding_id":"F-002","severity":"P1",...}
```

## FORMAT

- Findings file is markdown with the structure shown in Step 4
- Delta file is JSONL (one finding per line, valid JSON)
- File:line citations are mandatory — no vague "in the lib code" references
- Evidence is direct quotes (2-3 lines from the source), not paraphrase
- Severity tags strict: P0 = blocker (won't work / vuln), P1 = required (regression risk / hardening gap), P2 = suggestion (style / minor)
- DO NOT modify any files outside `.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/review/` — review target is READ-ONLY

After writing both files, print one line:
`ITER-1 DONE: <P0 count>/<P1 count>/<P2 count>, dimensions=correctness+security`

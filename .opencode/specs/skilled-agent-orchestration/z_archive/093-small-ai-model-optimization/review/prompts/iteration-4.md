DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 4 of 20

## STATE

state_summary: Iter 3 surfaced 9 P1 + 1 P2 findings on security dimension, each with explicit downgrade triggers (confidence 0.6-0.8). Iter 4: ADJUDICATE each finding by reading the actual code paths the downgrade-triggers point to. Goal: confirm or downgrade every P1.

Review Iteration: 4 of 20
Mode: review
Dimension: **security** (2/4, adjudication pass)
Review Target: skilled-agent-orchestration/z_archive/093-small-ai-model-optimization
Prior Findings: P0=0 P1=9 P2=1

## SHARED DOCTRINE

Adjudication rules:
- **CONFIRM as P1**: downgrade-trigger fails the test
- **DOWNGRADE to P2**: downgrade-trigger passes (defense-in-depth missing but mitigated)
- **NO-ISSUE**: alternative-explanation is fully validated (e.g., TypeScript type guarantees) — remove from active findings

## STATE FILES

All paths absolute from repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- State Log: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/iterations/iteration-004.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deltas/iter-004.jsonl`
- Iter 3 delta to read (input): `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Soft max 12, hard max 13 tool calls.
- Review target is READ-ONLY.
- ALLOWED WRITE PATHS:
  - `review/iterations/iteration-004.md`
  - `review/deep-review-state.jsonl`
  - `review/deltas/iter-004.jsonl`

## ITERATION 4 FOCUS — ADJUDICATE ITER-3 FINDINGS

Read iter-3 delta first to load the 9 P1 findings. Then adjudicate each one:

### F1: schema lacks `**` glob annotation
- **Downgrade trigger**: "If operational review confirms all `**` usage is audited and documented, downgrade to P2"
- **Test**: Read all 3 example matrices (`permissions-matrix.example-readonly.json`, `permissions-matrix.example-packet-local.json`, `permissions-matrix.example-repo-wide.json`). Count `**` usage. Check if each `**` use has a comment/note in the corresponding `references/permissions-matrix.md` documenting the broad-scope intent.
- **Verdict**: If `**` usage is bounded to example-repo-wide.json AND `references/permissions-matrix.md` discusses broad-scope rules with rationale → DOWNGRADE to P2. Otherwise CONFIRM P1.

### F2: schema lacks deny-precedence semantic check
- **Downgrade trigger**: "If runtime implementation guarantees deny-precedence through specificity or explicit checks, downgrade to P2"
- **Test**: Read `permissions-gate.ts` runtime rule-evaluation code (the loop that walks the matrix.rules array). Does it explicitly check deny-before-allow? Or does it rely on specificity ordering? Or array order?
- **Verdict**: If runtime guarantees deny precedence via any deterministic mechanism → DOWNGRADE to P2. If undefined / first-match-wins with no deny priority → CONFIRM P1.

### F3: no absolute root glob restriction
- **Downgrade trigger**: "If runtime path normalization effectively constrains absolute paths to repo scope, downgrade to P2"
- **Test**: Read `permissions-gate.ts` path-resolution code. Does it normalize via `path.resolve(repoRoot, candidate)`? Reject paths that resolve outside repoRoot? Or does it accept absolute `/etc/passwd`-style paths verbatim?
- **Verdict**: If runtime path-normalization constrains to repoRoot → DOWNGRADE to P2. If absolute paths pass through unchanged → CONFIRM P1 (escalate to consider P0).

### F4: fallback-router quota_pool undefined check
- **Downgrade trigger**: "If TypeScript strict null checks guarantee quota_pool is never undefined at runtime, downgrade to P2"
- **Test**: Read `fallback-router.ts` type definitions (lines 1-30). Is the `ModelProfile` type's `quota_pool` declared as `quota_pool: string` (required, non-nullable) or `quota_pool?: string` (optional)? Check `tsconfig.json` for `strict: true` and `strictNullChecks: true` in the mcp_server.
- **Verdict**: If type is required-non-nullable AND tsconfig has strict → DOWNGRADE to P2 (defense-in-depth: runtime check is missing but type system covers it). If quota_pool is optional OR strict is off → CONFIRM P1.

### F5-F9: 5 error-message-leakage P1s in post-dispatch-validate.ts
- **Downgrade trigger** (all 5): "If verified these errors are internal-only and never exposed to users, downgrade to P2"
- **Test**: Grep for callers of `post-dispatch-validate.ts`. Where are the returned `reason` + `details` fields consumed? Do they flow into log files only? Or do they reach MCP tool output / stdout / user-visible CLI output?
- **Verdict**: If errors only reach internal log files (jsonl state files) and never user output → DOWNGRADE to P2 (defense-in-depth: paths in logs are acceptable). If errors reach user-facing channels → CONFIRM P1.

## OUTPUT CONTRACT (all 3 required)

1. **iteration-004.md** — Structure: `## Dimension`, `## Files Reviewed`, `## Adjudication Results` (F1-F9 each with verdict + evidence), `## Net Finding Counts (after adjudication)`, `## Verdict (per-iter)`, `## Next Dimension`. Each adjudication shows the test result and final severity.

2. **state.jsonl APPEND** — single line, `"type":"iteration"`. Include `findingsAdjudicated`, `findingsConfirmed`, `findingsDowngraded`, `findingsRetracted`. newInfoRatio: 0.4 (adjudication is high-value but not new-discovery).

3. **deltas/iter-004.jsonl** — multi-line: iter record + one `adjudication` record per F1-F9 with old severity, new severity, test result, reasoning.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Read iter-003.jsonl delta to confirm finding list.
3. Read each downgrade-trigger evidence file.
4. Adjudicate per-finding.
5. Write iteration-004.md + delta + state.jsonl. Stop.

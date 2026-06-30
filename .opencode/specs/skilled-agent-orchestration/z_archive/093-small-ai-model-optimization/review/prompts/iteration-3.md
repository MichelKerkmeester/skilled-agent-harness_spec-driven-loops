DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 3 of 20

## STATE

state_summary: Iters 1+2 confirmed correctness dimension CLEAN — exhaustive enumeration verified 39/39 spec.md §3 files exist on disk + appear in impl-summary Built sections. 0 P0/P1/P2 findings across both correctness iters. Iter 3: switch to security dimension with depth focus on permissions-gate, fallback-router, schema validation, and backward-compat defaults.

Review Iteration: 3 of 20
Mode: review
Dimension: **security** (2/4)
Review Target: skilled-agent-orchestration/z_archive/093-small-ai-model-optimization
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

- **P0 (security)**: exploitable defect — credential leak, sandbox escape, default-allow path, scope escape via symlink
- **P1 (security)**: required hardening — missing input validation at trust boundary, error message leaking filesystem structure, glob too broad (`**` without annotation), schema gap
- **P2 (security)**: advisory — defense-in-depth missing, docs ambiguous about a security property

## REVIEW DIMENSIONS

correctness ✓, **security** (current), traceability, maintainability

## TRACEABILITY PROTOCOLS

Iter 3 focuses on code paths, not traceability. Set traceability fields to `deferred` in JSONL.

## QUALITY GATES

evidence (every claim cites code path with file:line), scope (only the new code/schema/recipes shipped in 114), coverage (security)

## VERDICTS

`FAIL | CONDITIONAL | PASS` — final verdict in synthesis.

## CLAIM ADJUDICATION

Every P0/P1 finding needs: claim + evidenceRefs + counterevidenceSought + alternativeExplanation + finalSeverity + confidence + downgradeTrigger.

## STATE FILES

All paths absolute from repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`.

- Config: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deep-review-config.json`
- State Log: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/iterations/iteration-003.md`
- Write per-iteration delta file to: `.opencode/specs/skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/review/deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF agent. No sub-agent dispatch. Soft max 12, hard max 13 tool calls.
- Review target is READ-ONLY.
- ALLOWED WRITE PATHS:
  - `review/iterations/iteration-003.md`
  - `review/deep-review-state.jsonl`
  - `review/deltas/iter-003.jsonl`

## ITERATION 3 FOCUS — SECURITY (DEPTH)

### Check 1: permissions-gate.ts default-deny semantics

Read `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts` from start to end. For each code path that returns an allow/deny decision, classify:

- Does the path explicitly DENY on missing/unrecognized rules?
- Does the path explicitly DENY on schema-validation failure / malformed matrix?
- Does the path explicitly DENY in catch blocks / on thrown errors?
- Is there any reachable code path that returns ALLOW when no rule matched? (this is a P0 if found)

Cite specific line numbers for each branch. Look especially at: schema-parse error, regex/glob compile error, symlink resolution failure, recursion-cap exceeded.

### Check 2: permissions-matrix.schema.json glob safety

Read `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`. Check:

- Does the schema allow `**` globs without an explicit `"broadScope": true` (or equivalent) annotation?
- Does the schema enforce that `deny` rules take precedence over `allow` (semantic check via doc)?
- Are there any allowed-glob patterns that bypass scope-locking (e.g., absolute `/` root globs)?

### Check 3: fallback-router.ts quota-pool safety

Read `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts` end-to-end. Critical RM-8-derived invariant: must NEVER recommend a target that shares the same quota_pool as the source. Check:

- Where is quota_pool read for source + candidates?
- What rejects same-pool? (look for `if (target.quota_pool === source.quota_pool)` or equivalent)
- What happens if quota_pool is undefined on either side? (must default-deny, not default-allow)
- Are model profiles required to have quota_pool? Does router refuse to fallback if missing?

### Check 4: agent-config recipe backward-compat defaults

Read the three recipes:
- `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
- `.opencode/skills/cli-devin/assets/agent-config-deep-review-iter.json`
- `.opencode/skills/cli-devin/assets/agent-config-synthesis.json`

Verify ALL THREE have explicit:
- `verification_enabled: false` (or equivalent) as default
- `bayesian_scoring_enabled: false`
- `fallback_chain: []`

These are backward-compat ABSOLUTE — any deviation is P1.

### Check 5: input validation in budget engine

Read `.opencode/skills/cli-devin/references/context-budget.md` + `.opencode/skills/cli-devin/assets/per-model-budgets.json`. Check:
- Does the doc specify what happens if model name is unknown (default budget? error?)
- Does the JSON have any field that could be exploited (e.g., negative integers, prototype-pollution-prone keys like `__proto__`)?

### Check 6: error-message leakage

Grep across the new TS files for error messages that include filesystem paths, environment variables, or stack traces:
- `permissions-gate.ts`
- `bayesian-scorer.ts`
- `fallback-router.ts`
- `post-dispatch-validate.ts`

Cite any case where a thrown error string contains `process.env.*` or a full filesystem path.

## OUTPUT CONTRACT (all 3 required)

1. **iteration-003.md** — Structure: `## Dimension`, `## Files Reviewed`, `## Security Checks` (one subsection per Check 1-6), `## Findings by Severity`, `## Traceability Checks` (deferred), `## Verdict`, `## Next Dimension`. Each P0/P1 finding has full adjudication.

2. **state.jsonl APPEND** — single line, `"type":"iteration"`. Read existing JSONL then Write back with appended line. newInfoRatio: 0.4 if mostly clean with minor advisories; 0.7 if substantive P1+ findings.

3. **deltas/iter-003.jsonl** — multi-line: iter record + per-finding records + classification.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Read all 6 files in Check 1-6.
3. Grep for known security antipatterns.
4. Compose Check sections + findings.
5. Append JSONL + write delta. Stop.

DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

Non-interactive worker, no human on the other end. Write authority is bound to STATE FILES below. Do NOT ask Gate-3. Proceed immediately.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch)

Write a `<pre-plan>` block with 4-5 ordered steps (Input/Output/Acceptance/Verification each) before any tool call.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 5 of 10 | Cumulative: P0=0 P1=1 P2=0 (all findings so far: P1-001 REQ-010 refresh/clear generation atomicity) | Correctness dimension: 4/4 REQ items reviewed clean except REQ-010.
Dimension shift: this iteration moves from correctness to SECURITY across the full 16-file scope. Read your own strategy.md §12 for the exact plan you set in iteration 4.

## ITERATION 5 FOCUS — SECURITY DIMENSION

1. **REQ-011 model-socket path**: `.opencode/bin/lib/model-server-supervision.cjs`'s `resolveModelServerSocketPath` and the new `DEFAULT_MODEL_SERVER_SOCKET_DIR`/`PATH` constants (`/tmp/mk-hf-embed/hf-embed.sock`). Is this hardcoded `/tmp` path itself a security concern (predictable, world-writable directory on multi-user systems — could another local user pre-create a malicious socket/symlink at that exact path before this process binds it)? Check whether `assertSocketDirOwnership`/`assertSunPathLimit` (referenced elsewhere in the same file) are actually invoked against this path, or if the canonical-default path bypasses those existing ownership/symlink checks.
2. **REQ-010 leaseId**: is `crypto.randomUUID()` an appropriate token generator for this fencing use case (cryptographically unpredictable, no information leakage)? Any risk of leaseId collision or predictability that would weaken the fence?
3. **REQ-009 background-scan default**: does defaulting to `background: true` at the MCP tool boundary introduce any new attack surface (e.g., a way to enqueue unbounded background jobs, resource exhaustion via repeated scan requests)?
4. **General sweep**: `rg -n "eval\(|exec\(|child_process|spawnSync|spawn\(" ` across the 16 scope files — confirm every process-spawning call site uses a fixed command name (not user/caller-controlled) and an argument array (not shell string interpolation). Flag anything that constructs a shell command via string concatenation.
5. Secrets/credentials: confirm no hardcoded tokens, API keys, or credentials were introduced in any of the 16 files.

Record findings, then set Next Focus for iteration 6 in strategy.md §12 (recommend: TRACEABILITY dimension — cross-check every REQ-006..011 requirement in spec.md against its corresponding implementation + checklist evidence row + test; also verify the `_memory.continuity` frontmatter blocks across spec.md/plan.md/tasks.md/checklist.md/implementation-summary.md are internally consistent, not contradictory).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Target 9 tool calls, soft max 12, hard max 13.
- Write ALL findings to files. Review target is READ-ONLY. Do not implement fixes.
- **ALLOWED WRITE PATHS**: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-005.md`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only), `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-005.jsonl`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only).
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, output-redirect truncate `>` against any path not in the allowed-write list, or any delete/rename/replace outside that list. Reading is unrestricted; writing/renaming/deleting are scoped.
- **SCOPE VIOLATION PROTOCOL**: if a needed mutation falls outside allowed-write paths, STOP and record a `scope_violation` under `## SCOPE VIOLATIONS` instead of executing it.
- Use `echo '<single-line-json>' >> <path>` for the JSONL append, not a patch/edit tool.

## OUTPUT CONTRACT

Produce THREE artifacts:
1. Iteration narrative at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-005.md` (Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension).
2. JSONL record APPENDED to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":5,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-005","status":"complete","focus":"<focus>","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. Delta file at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-005.jsonl` (iteration record + per-finding/classification/traceability records).

All three artifacts REQUIRED.

---
title: "Deep Review Strategy: skill-advisor code shipped by packet 016"
description: "Session tracking for the five-iteration deep review of the pasted-reply stripping, crash fallback and route receipt code."
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

Persistent state for this review session. The orchestrator and each iteration read it; the reducer owns the machine-owned blocks.

---

## 2. TOPIC
Review of the skill-advisor code this packet shipped, the change range `git diff 538d2f789ec 57d3f5d9159^2`: stripping a pasted earlier reply before the prompt is scored (TypeScript hook, brief builder, prompt policy and the Python scorer), the prompt-hook crash fallback line, route receipts for weak follow-up prompts, and the DSH prompt advisor. Target type: files (27 files, implementation plus tests).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Code outside the 27 files in scope, except to follow a call or import one hop to confirm a finding.
- Re-litigating earlier review verdicts. This review judges the code as it stands on main.
- Fixing anything. The review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy is `max-iterations`: run all 5 iterations; convergence is telemetry only.
- Stop early only on an unrecoverable error, a pause sentinel or the 120 minute duration cap.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Iteration 1: reading the range diff per implementation file, then following the receipt guard one hop into directive-lifecycle.ts, exposed the boundary-signal mismatch (R1-P2-002) and the commit-ordering gap (R1-P2-003). Running the four strip/receipt/hook/parity suites (143 tests, exit 0) confirmed the clean surfaces.
- Iteration 2: timing the shipped dist `stripLeadingPastedReply` and the real Python module, not a copied regex, on newline runs from 8K to 64K proved the quadratic marker scan (R2-P2-001); varying the run shape (newlines vs `.`+spaces) pinned the trigger to newline-bearing whitespace.
- Iteration 3: reading each phase spec's P0 REQ rows and replaying the design rules on the shipped dist `prompt-policy.js` exposed the raw-prompt fire gate (R3-P2-001); a repo-wide producer search settled R1-P2-002 reach.
- Iteration 4: listing every `shouldFireAdvisor` call site across the brief, hook and guard exposed five policy evaluations on two inputs (R4-P2-001); measuring the receipt-test prompts on the dist proved the guard tests exercise the guard, not the policy skip.
- Iteration 5: rereading all 8 P2s at their cited lines confirmed each severity (no escalation, no false positive); tracing `confidenceFloored` through every producer exposed that the subprocess parser and Python scorer never carry it (R5-P2-001); a dist probe proved strip idempotence across folding.

---

## 9. WHAT FAILED
- Iteration 1: the shell has no `timeout` binary; run test commands without it.
- Iteration 2: nothing failed; the end-to-end hook multiplier (up to three strips per turn) was not measured and stays an inference.
- Iteration 3: nothing failed; the guard-suppress-then-render-throw crash edge was not measured and stays an inference.
- Iteration 4: nothing failed; the per-turn strip count (four layers, five on a floored turn) was counted from call sites, not timed.
- Iteration 5: the first dist probe used a wrong path (dist mirrors `runtime/` under `runtime/dist/runtime/`); the DSH detached compaction rotation race was not measured and stays an inference.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A double strip changing the scored text between the handler and the scorer: proven idempotent. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A double strip changing the scored text between the handler and the scorer: proven idempotent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A double strip changing the scored text between the handler and the scorer: proven idempotent.

### A stale floor flag after a confidence rewrite in fusion: no rewrite exists. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A stale floor flag after a confidence rewrite in fusion: no rewrite exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale floor flag after a confidence rewrite in fusion: no rewrite exists.

### Another local user pre-creating the shared temp base: `ownedFolder` rejects it, and the store then fails open to deliver, which is the pre-receipt behavior. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Another local user pre-creating the shared temp base: `ownedFolder` rejects it, and the store then fails open to deliver, which is the pre-receipt behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Another local user pre-creating the shared temp base: `ownedFolder` rejects it, and the store then fails open to deliver, which is the pre-receipt behavior.

### Brief-path metalinguistic diagnostics read from the raw prompt: same root as R4-P2-001, not a new finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Brief-path metalinguistic diagnostics read from the raw prompt: same root as R4-P2-001, not a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Brief-path metalinguistic diagnostics read from the raw prompt: same root as R4-P2-001, not a new finding.

### Double application of directive dedup on the crash path: every statement after the normal-path `applyDirectiveLifecycle` (line 607) is fail-open (`emitDiagnostic` and `observeEmittedAdvisorPolicy` swallow errors), so the crash path cannot run after a full receipt was recorded on the same turn. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Double application of directive dedup on the crash path: every statement after the normal-path `applyDirectiveLifecycle` (line 607) is fail-open (`emitDiagnostic` and `observeEmittedAdvisorPolicy` swallow errors), so the crash path cannot run after a full receipt was recorded on the same turn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Double application of directive dedup on the crash path: every statement after the normal-path `applyDirectiveLifecycle` (line 607) is fail-open (`emitDiagnostic` and `observeEmittedAdvisorPolicy` swallow errors), so the crash path cannot run after a full receipt was recorded on the same turn.

### DSH clock rotation as an error or secret leak: it only logs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: DSH clock rotation as an error or secret leak: it only logs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: DSH clock rotation as an error or secret leak: it only logs.

### MCP handler regex cost: capped at 10,000 characters, about 43 ms. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: MCP handler regex cost: capped at 10,000 characters, about 43 ms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: MCP handler regex cost: capped at 10,000 characters, about 43 ms.

### Pasted-text routing injection: `PASTED_REPLY_CUE` is anchored at `^`, so a paste can only drop text that comes before its last marker in a prompt that starts with the cue. The user's own text above a paste is never dropped, and the brief carries skill names, not prompt text. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Pasted-text routing injection: `PASTED_REPLY_CUE` is anchored at `^`, so a paste can only drop text that comes before its last marker in a prompt that starts with the cue. The user's own text above a paste is never dropped, and the brief carries skill names, not prompt text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pasted-text routing injection: `PASTED_REPLY_CUE` is anchored at `^`, so a paste can only drop text that comes before its last marker in a prompt that starts with the cue. The user's own text above a paste is never dropped, and the brief carries skill names, not prompt text.

### R1-P2-002 reach through a production caller: none exists today (see Integration Evidence). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: R1-P2-002 reach through a production caller: none exists today (see Integration Evidence).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R1-P2-002 reach through a production caller: none exists today (see Integration Evidence).

### Receipt cross-session leak: receipts are keyed by a sha256 of a confirmed session id and re-checked against `sessionId` on parse. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Receipt cross-session leak: receipts are keyed by a sha256 of a confirmed session id and re-checked against `sessionId` on parse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Receipt cross-session leak: receipts are keyed by a sha256 of a confirmed session id and re-checked against `sessionId` on parse.

### Receipt file-name collisions: the name is 64 bits of sha256 and the `sessionId` is rechecked on parse. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Receipt file-name collisions: the name is 64 bits of sha256 and the `sessionId` is rechecked on parse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Receipt file-name collisions: the name is 64 bits of sha256 and the `sessionId` is rechecked on parse.

### Receipt tests passing for the wrong reason: the follow-up prompts fire, so the guard is exercised (measured on the dist). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Receipt tests passing for the wrong reason: the follow-up prompts fire, so the guard is exercised (measured on the dist).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Receipt tests passing for the wrong reason: the follow-up prompts fire, so the guard is exercised (measured on the dist).

### Stale spec line citations as code findings: the claims behind them still hold at the moved lines. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Stale spec line citations as code findings: the claims behind them still hold at the moved lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale spec line citations as code findings: the claims behind them still hold at the moved lines.

### The DSH detached-rotation race: microtask window, inference only. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The DSH detached-rotation race: microtask window, inference only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The DSH detached-rotation race: microtask window, inference only.

### TS/Python strip parity drift going unnoticed: the shared fixture is read by both suites and covers the whitespace and folding seams. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: TS/Python strip parity drift going unnoticed: the shared fixture is read by both suites and covers the whitespace and folding seams.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: TS/Python strip parity drift going unnoticed: the shared fixture is read by both suites and covers the whitespace and folding seams.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Iteration 1: TS/Python strip parity drift (regexes, JS whitespace set, ASCII folding match; parity tests pass).
- Iteration 1: crash path re-applying directive dedup after a full receipt (every statement after the normal-path applyDirectiveLifecycle is fail-open).
- Open carry-forward: R1-P2-002 reach is inferred (no UserPromptSubmit producer of `lifecycle_event` found in the hook folder); confirm or rule out in the traceability pass.
- Iteration 2: pasted-text routing injection (cue anchored at `^`), shared-temp pre-creation (store fails open), receipt name collision (sessionId rechecked), crash-fallback error leak (fixed errorDetails string), argv prompt exposure (stdin), DSH rotation leak (log only), MCP handler regex cost (10,000-char cap, ~43 ms).
- Iteration 3: R1-P2-002 reach through a production caller (only tests set `lifecycle_event`; the OpenCode plugin has its own reader and no receipt guard); stale phase-spec line citations as code findings (claims hold at the moved lines).
- Iteration 4: TS/Python strip twin drift going unnoticed (shared 24-row fixture read by both suites, with whitespace and fold rows); receipt tests passing via the policy skip (follow-up prompts fire on the dist, so the guard runs).
- Iteration 5: stale floor flag after a fusion confidence rewrite (no rewrite after 1418); handler-plus-scorer double strip changing text (idempotent, probed across folding); DSH detached rotation race (microtask window, inference); brief metalinguistic diagnostics on raw prompt (same root as R4-P2-001).
- Carry-forward constraint: make TASK_MARKER linear (R2-P2-001) before reordering the 64 KiB cut for R1-P2-001, or the hook strip loses its only bound.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. This is the last iteration; synthesis follows. - Focus area: synthesis over 9 active P2s (R1-P2-001..004, R2-P2-001, R3-P2-001, R4-P2-001/002, R5-P2-001). - Reason: max-iterations stop policy reached. - Rotation status: all four dimensions covered, plus one stabilization pass. - Blocked/productive carry-forward: probing on the dist stayed productive. Do not retry strip idempotence or the floor-staleness check. - Required evidence: none outstanding. Fix ordering: make TASK_MARKER linear (R2-P2-001) before moving the 64 KiB cut (R1-P2-001). Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 27 files in section 15. The change range is `git diff 538d2f789ec 57d3f5d9159^2`; `git log --no-merges 538d2f789ec..57d3f5d9159^2` lists the commits.
- Behavior claims to verify: a prompt carrying a pasted earlier reply routes the same as the prompt without it, in the TypeScript path and the Python scorer alike; when the prompt hook crashes, the advisor shows the right fallback line; a weak follow-up prompt reuses a recent route receipt rather than routing from scratch. Phase `spec.md` files under the packet state the intended behavior and may be read for traceability.
- Out of bounds by operator direction: any `evidence/` folder in the packet and the verdict table in `012-plan-text-and-goal-closeout/implementation-summary.md`. The review must not anchor on earlier verdicts.
- Review risks and gaps: the continuity ladder was deliberately skipped for the same reason. Strip-rule boundary cases, receipt persistence and staleness, and parity between the TypeScript and Python strippers are the areas most likely to hold defects.

resource-map.md not present; skipping coverage gate.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | behavior matches strategy claims; phase spec.md not yet read |
| `checklist_evidence` | core | notApplicable | 1 | evidence folders out of bounds by operator direction |
| `skill_agent` | overlay | notApplicable | - | - |
| `agent_cross_runtime` | overlay | notApplicable | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | notApplicable | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
All paths are under `.skilled/skills/system-skill-advisor/`.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| hooks/claude/user-prompt-submit.ts | - | - | - | pending |
| hooks/lib/route-receipt.ts | - | - | - | pending |
| hooks/lib/skill-advisor-cli-fallback.ts | - | - | - | pending |
| hooks/dsh/prompt-advisor.mjs | - | - | - | pending |
| runtime/lib/skill-advisor-brief.ts | - | - | - | pending |
| runtime/lib/prompt-policy.ts | - | - | - | pending |
| runtime/lib/scorer/fusion.ts | - | - | - | pending |
| runtime/lib/subprocess.ts | - | - | - | pending |
| runtime/handlers/advisor-recommend.ts | - | - | - | pending |
| runtime/schemas/advisor-tool-schemas.ts | - | - | - | pending |
| runtime/skill-advisor-cli.ts | - | - | - | pending |
| runtime/scripts/skill_advisor.py | - | - | - | pending |
| runtime/bench/scorer-calibration.bench.ts | - | - | - | pending |
| hooks/tests/dsh-prompt-advisor.test.mjs | - | - | - | pending |
| runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts | - | - | - | pending |
| runtime/tests/hooks/route-receipt.vitest.ts | - | - | - | pending |
| runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts | - | - | - | pending |
| runtime/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts | - | - | - | pending |
| runtime/tests/hooks/vibe-prompt-advisor.vitest.ts | - | - | - | pending |
| runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts | - | - | - | pending |
| runtime/tests/cli-degraded-command-contract.vitest.ts | - | - | - | pending |
| runtime/tests/legacy/advisor-brief-producer.vitest.ts | - | - | - | pending |
| runtime/tests/legacy/advisor-corpus-parity.vitest.ts | - | - | - | pending |
| runtime/tests/legacy/advisor-prompt-policy.vitest.ts | - | - | - | pending |
| runtime/tests/parity/python-ts-parity.vitest.ts | - | - | - | pending |
| runtime/tests/python/test_skill_advisor.py | - | - | - | pending |
| runtime/tests/fixtures/pasted-reply-strip-cases.json | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-19T04:18:26.591Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Executor: native deep-review agent, model opus, effort medium
- Started: 2026-11-19T04:18:26.591Z
<!-- MACHINE-OWNED: END -->

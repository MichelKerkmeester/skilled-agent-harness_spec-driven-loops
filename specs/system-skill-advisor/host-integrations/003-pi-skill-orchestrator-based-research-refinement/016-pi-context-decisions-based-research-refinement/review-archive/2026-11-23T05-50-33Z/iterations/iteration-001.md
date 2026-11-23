# Iteration 001 - Inventory pass plus D1 Correctness

## Dispatcher

- Run 1, iteration 1 of 5, session `2026-11-19T04:18:26.591Z`, generation 1, lineageMode `new`.
- Dimension: correctness. Operator focus (the change range `git diff 538d2f789ec 57d3f5d9159^2`) covered by reading the diff of every implementation file in scope and following one hop into `hooks/lib/directive-lifecycle.ts` and `runtime/lib/render.ts` to confirm the guard and fallback behavior.
- The working tree differs from `57d3f5d9159^2` on six advisor files, none of them a strip, receipt or hook implementation file in scope, so the diff and main agree for this iteration's targets.

## Files Reviewed

Inventory (33 files in the range under `.skilled/skills/system-skill-advisor/`; 27 in scope). Read in full or by diff this iteration:

- `hooks/claude/user-prompt-submit.ts` (diff, plus lines 183-222, 248-295)
- `hooks/lib/route-receipt.ts` (full)
- `hooks/lib/skill-advisor-cli-fallback.ts` (diff)
- `hooks/dsh/prompt-advisor.mjs` (diff)
- `runtime/lib/prompt-policy.ts` (diff, normalizePrompt)
- `runtime/lib/skill-advisor-brief.ts` (diff)
- `runtime/lib/scorer/fusion.ts`, `runtime/lib/subprocess.ts`, `runtime/skill-advisor-cli.ts`, `runtime/handlers/advisor-recommend.ts`, `runtime/schemas/advisor-tool-schemas.ts` (diff)
- `runtime/scripts/skill_advisor.py` (diff)
- `runtime/tests/fixtures/pasted-reply-strip-cases.json` (all 24 cases)
- `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` (lines 1236-1285)
- Context only (one hop): `hooks/lib/directive-lifecycle.ts:135-180`, `runtime/lib/render.ts:469-500, 640-675`

Commands run from the runtime folder: `npx vitest run tests/hooks/route-receipt.vitest.ts tests/legacy/advisor-prompt-policy.vitest.ts tests/hooks/claude-user-prompt-submit-hook.vitest.ts tests/parity/python-ts-parity.vitest.ts` exit 0, 4 files, 143 tests passed. `python3 -m pytest -q test_skill_advisor.py -k "strip or pasted"` exit 0, 1 passed.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hook's 64 KiB head cut runs before the pasted-reply strip, so a paste longer than that routes on the paste alone** -- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:200 -- `normalizePrompt` keeps the first `MAX_PROMPT_BYTES` (64 KiB, line 183) of the prompt at line 555, before the strip in `skill-advisor-brief.ts:478` or `skill-advisor-cli-fallback.ts:233` ever sees it. The strip needs the task marker after the cue (`prompt-policy.ts:252`); once the cut removes the trailing `Now:`/`Task:` segment, `stripPastedReplyOnce` finds no marker and returns the paste unchanged. The comments at the 10,000-character cut promise a long paste cannot push the task past the cut; that holds up to 64 KiB only.
   Finding class: edge-case ordering bug (truncate-before-normalize).
   Scope proof: confined to the Claude hook entry; the MCP handler (`advisor-recommend.ts`) and Python scorer strip the untruncated prompt.
   Affected surface hints: `hooks/claude/user-prompt-submit.ts` normalizePrompt; optionally strip before the byte cut or keep the tail when a cue is present.
   Case: a prompt that starts with "Earlier you replied:" followed by about 70 KiB of pasted text and ends with "Now: fix the parser" is routed on the pasted text, with the task never scored.

2. **The route-receipt guard ignores a lifecycle event carried on the prompt input, which the directive dedup treats as a boundary** -- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:376 -- `guardWeakFollowUp` expires a receipt only through `lifecycle.clock(sessionId)` and transcript shrink (`route-receipt.ts:173-183`). The same turn's `applyDirectiveLifecycle` passes `lifecycleEventFor(input)` (line 458), and `directive-lifecycle.ts:165` forces full delivery on `startup`/`resume`/`compact` without moving the clock. So on a prompt flagged `lifecycle_event: 'compact'` the directives are re-delivered as after a boundary, while the guard still reads the pre-boundary clock and can hold back a floored follow-up against a route whose brief the compaction may have removed. Reach is inferred: no host producer of `lifecycle_event` on UserPromptSubmit was found in the hook folder; Claude moves the clock through its separate lifecycle hooks.
   Finding class: inconsistent boundary signal between two consumers of the same lifecycle state.
   Scope proof: only the receipt guard; dedup honors the flag.
   Affected surface hints: `guardWeakFollowUp` / `decideRouteReceiptGuard` (add `lifecycleEventFor(input)` as a deliver condition).
   Case: a session holds a sk-doc receipt, then a UserPromptSubmit payload with `lifecycle_event: "compact"` and prompt "fix that too" floored to sk-code is suppressed instead of delivered.

3. **A route receipt is written before the hook output reaches the host, unlike the directive receipt that waits for the write** -- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:604 -- `recordRouteReceipt` stores the delivered skill (line 413) as soon as the brief renders, while `writeHookOutput` commits the directive receipt only when the stdout write succeeds (line 700) so that "the next turn delivers the full brief again instead of a head the model never saw". A failed write leaves a route receipt for a brief the model never received, and the next floored weak follow-up is held back against it.
   Finding class: commit-ordering inconsistency.
   Scope proof: requires a failed stdout handoff; receipts are otherwise advisory and expire on the lifecycle clock.
   Affected surface hints: defer `recordRouteReceipt` behind the same commit hook as `DIRECTIVE_RECEIPT_COMMIT`.
   Case: the stdout write for a turn routed to sk-doc fails, then the next prompt "fix that too" floored to sk-code gets "Advisor: prompt skipped." although the model never saw sk-doc.

4. **Last-marker-wins drops the first half of a user task that has two markers** -- .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:253 -- `stripPastedReplyOnce` keeps only the text after the last `Now:`/`Task:` marker. When the user's own task carries two markers, everything before the last one is discarded with the paste. The fixture records this as accepted (`pasted-reply-strip-cases.json:76`, `expected` differs from `ideal`), and the Python mirror copies it, so parity holds but routing loses the main task.
   Finding class: known heuristic limitation, documented in tests.
   Scope proof: needs a cue at the start plus two markers; parity between TypeScript and Python is unaffected.
   Affected surface hints: `prompt-policy.ts` stripPastedReplyOnce and `skill_advisor.py` `_strip_pasted_reply_once` together.
   Case: "Earlier you replied: Done. Task: Refactor the session store module. Now: also update its tests." is scored as "also update its tests.".

## Traceability Checks

- `spec_code`: partial. The behavior claims in the strategy (strip parity, crash fallback, weak follow-up receipts) are implemented as described; the strip is applied at the MCP handler (`advisor-recommend.ts` scoredPrompt), the scorer (`fusion.ts` scoreAdvisorPrompt), the brief builder, the CLI fallback, the degraded CLI path and both Python entry points. The phase `spec.md` files were not read this iteration, so the check stays partial.
- `checklist_evidence`: notApplicable this iteration by operator direction (evidence folders and verdict tables are out of bounds); judged from code and tests only.
- `feature_catalog_code`: not run.

## Integration Evidence

- `hooks/dsh/prompt-advisor.mjs` rotates the shared lifecycle clock per session on `agent/created` and `compaction/end`, and refuses to rotate without a session id (so it never advances the store generation). Reviewed via diff.
- `hooks/lib/directive-lifecycle.ts:135-180` read as context for finding 2.

## Edge Cases

- Ambiguity: the dispatch gives no iteration number; the JSONL holds zero `type:"iteration"` records, so this is iteration 1, matching the dispatch.
- The working tree differs from the diff end on six advisor files outside the strip and receipt code (routing-accuracy scripts and their test); judged as not affecting this iteration's targets.

## Confirmed-Clean Surfaces

- TypeScript and Python strippers agree: same cue and marker regexes, `^` start-only in both, JS whitespace set spelled out for Python, ASCII-only case folding (`re.ASCII`), JS trim set in `strip`. Fixture cases for NBSP, BOM, U+001C, U+0085 and U+017F cover the divergence points; parity tests pass.
- Idempotence: both strippers loop to a fixed point, so the handler, scorer and native bridge stripping the same text twice is safe.
- Crash fallback: diagnostics are double-wrapped; a payload with no prompt string stays silent; a policy-skipped prompt renders the skipped line, otherwise the timeout line; tests cover the removed-cwd case.
- Receipt store: lstat plus owner and mode checks on base and folder, same-folder temp file plus rename, size cap, eviction bound, every fault reads as no receipt.

## Ruled Out

- Double application of directive dedup on the crash path: every statement after the normal-path `applyDirectiveLifecycle` (line 607) is fail-open (`emitDiagnostic` and `observeEmittedAdvisorPolicy` swallow errors), so the crash path cannot run after a full receipt was recorded on the same turn.
- Receipt cross-session leak: receipts are keyed by a sha256 of a confirmed session id and re-checked against `sessionId` on parse.

## Next Focus

- Dimension: security.
- Focus area: `route-receipt.ts` file store under a shared temp dir, `skill-advisor-cli-fallback.ts` subprocess payload, regex cost of `PASTED_REPLY_CUE`/`TASK_MARKER` on 64 KiB input, and pasted-text injection into routing.
- Reason: correctness pass done; the receipt store and the strip are new trust-boundary surfaces.
- Rotation status: correctness covered; security, traceability, maintainability remain.
- Required evidence: file:line for any store or regex claim; read the phase `spec.md` files for the traceability pass later.

Review verdict: PASS

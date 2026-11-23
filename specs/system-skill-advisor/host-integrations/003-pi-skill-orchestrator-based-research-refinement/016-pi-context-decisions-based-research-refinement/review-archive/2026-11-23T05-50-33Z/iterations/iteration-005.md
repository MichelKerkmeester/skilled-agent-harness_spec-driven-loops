# Iteration 5: Correctness stabilization pass

## Dispatcher
- Run: 5 of 5 (final, max-iterations stop policy). Session 2026-11-19T04:18:26.591Z, generation 1, lineageMode new.
- Dimension: correctness (stabilization). All four dimensions were already covered.
- Jobs: (1) reread each of the 8 active P2s at its cited file:line and settle its severity; (2) look for correctness defects in the files the earlier passes read least.
- Operator focus: judged from the range `git diff 538d2f789ec 57d3f5d9159^2` and the shipped dist only. No `evidence/` folder and no implementation-summary verdict table was read.
- Iteration number: JSONL holds 4 iteration records, so this is iteration 5; it matches the dispatch.

## Files Reviewed
All under `.skilled/skills/system-skill-advisor/`.
- `hooks/dsh/prompt-advisor.mjs` (range diff, lines 120-240)
- `runtime/handlers/advisor-recommend.ts` (range diff; strip at 539, prompt uses 541-647)
- `runtime/lib/scorer/fusion.ts` (range diff; floor flag 1385-1418, post-floor rewrites 1470-1585)
- `runtime/skill-advisor-cli.ts` (range diff; `degradedRecommendations` 1486-1505)
- `hooks/lib/skill-advisor-cli-fallback.ts` (range diff; 227-235, 390-396)
- `runtime/lib/subprocess.ts` (interface 44-52, `parseRecommendations` 178-207)
- `runtime/schemas/advisor-tool-schemas.ts` (range diff)
- `runtime/bench/scorer-calibration.bench.ts` (range diff)
- `runtime/scripts/skill_advisor.py` (strip twin 4790-4835, callers 1014 and 4845)
- Rereads for the 8 active P2s: `hooks/claude/user-prompt-submit.ts` 192-206, 336-425, 570-660; `runtime/lib/prompt-policy.ts` 243-272; `runtime/lib/skill-advisor-brief.ts` 466-492; `hooks/lib/route-receipt.ts` 147-185.

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The floor flag reaches the hook only on the CLI path: the subprocess parser and the Python scorer never carry it, so the in-process brief path records every floored route as an earned one** -- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:198 -- The range added `confidenceFloored` to `AdvisorRecommendation` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:49], and the CLI fallback forwards it [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:395]. `parseRecommendations` builds each recommendation from an explicit field list that omits it [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:198], and `skill_advisor.py` has no `confidenceFloored` key at all (exact search, no hit). `buildSkillAdvisorBrief` routes through that parser [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:539]. The hook keys both the guard [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:369] and the receipt-write exclusion [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:406] on that flag. On the brief-producer path the guard never fires and a floored route is written as a receipt. Reach today: only `dependencies.buildBrief` uses that producer, and only tests inject it [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:580]. It is a latent gap, so P2.
   Finding class: producer-contract gap (field declared on a shared type, filled by one of two producers).
   Scope proof: the field and the hook readers are in the range diff; the parser omission is in the same file as the new field.
   Affected surface hints: runtime/lib/subprocess.ts parseRecommendations; runtime/scripts/skill_advisor.py JSON output; hooks/claude/user-prompt-submit.ts guardWeakFollowUp and recordRouteReceipt.
   Case: a host that injects `buildSkillAdvisorBrief` as `buildBrief` with a confirmed session id gets a floored work-intent top, and the hook writes a receipt for it instead of skipping, then never suppresses a later weak follow-up.

## Severity Stabilization of Active Findings
Each was reread at its cited line on current main.

| Finding | Reread | Outcome | Reason |
|---|---|---|---|
| R1-P2-001 | user-prompt-submit.ts:200 (head cut), brief.ts:478 and cli-fallback.ts:233 (strip after it) | Confirmed P2 | Needs a paste over 64 KiB. The turn still routes, only on the wrong text, and it fails open. |
| R1-P2-002 | user-prompt-submit.ts:369-376 | Confirmed P2 | No production producer sets `lifecycle_event` on UserPromptSubmit (iteration 3), so there is no named reach for P1. |
| R1-P2-003 | user-prompt-submit.ts:604 vs 623 | Confirmed P2 | The receipt is written before `finishAdvisorDelivery`. A wrong suppression needs a failed host write and then a floored weak follow-up on a different skill, and its cost is one skipped brief. |
| R1-P2-004 | prompt-policy.ts:253 | Confirmed P2 | Reproduced on the dist: `Claude replied: ok. Task: update readme. Now: commit it` strips to `commit it`. Routing quality only. |
| R2-P2-001 | prompt-policy.ts:246; skill_advisor.py:4807, callers 1014 and 4845 | Confirmed P2 | The quadratic scan is real. The hook bounds it at 64 KiB and the MCP schema at 10,000 chars. The unbounded Python input is a local CLI the user runs on their own prompt, so the blast radius is self-inflicted CPU time. |
| R3-P2-001 | user-prompt-submit.ts:580 | Confirmed P2 | The fire gate reads the raw prompt. The effect is a routed turn where a skip was intended, which is advisory output. |
| R4-P2-001 | skill-advisor-brief.ts:473-478 | Confirmed P2 | The two inputs are still in place, including the raw-prompt `policy` that feeds `metalinguisticMentions`. That is the same root and gets no new id. |
| R4-P2-002 | user-prompt-submit.ts:643 and 651 | Confirmed P2 | `input` is non-null after the 643 return, so the `: { effectiveEmitted: emitted }` arm cannot run. |

No escalation and no false positive. The R1-P2-001 plus R2-P2-001 ordering constraint is a note on the order of fixes, not a live defect: the shipped order keeps the 64 KiB bound. No P1 is hidden there.

## Traceability Checks
- `spec_code` (core): partial. The pasted-reply strip is applied once before the cache key, embedding, scorer and compiled-route enrichment in the MCP handler [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:539], and again idempotently inside the scorer [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1277]. That matches the "routes the same as without the paste" claim on the MCP path. The hook-side gaps are still R1-P2-001 and R3-P2-001.
- `checklist_evidence` (core): notApplicable. The evidence folders are out of bounds by operator direction.

## Integration Evidence
- DSH host `hooks/dsh/prompt-advisor.mjs` -> `runtime/dist/hooks/claude/user-prompt-submit.js` (`handleClaudeUserPromptSubmit`) with `session_id` and no `transcript_path`. Receipt staleness on DSH therefore rests on the lifecycle clock alone, which the new `advanceBoundary` rotates on `agent/created` and on a successful `compaction/end` [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:187].
- Both DSH URLs resolve `dist/hooks/lib/directive-lifecycle.js`, so the rotation and the hook share one module instance and one default store.

## Edge Cases
- Strip idempotence across folding: the brief strips, then folds to one line, then slices, and the handler strips again. Probed on the dist (`runtime/dist/runtime/lib/prompt-policy.js`) with 4 cases: `strip(fold(strip(x))) === fold(strip(x))` held every time. Folding can only remove newline markers and never create a cue.
- The empty task after the marker (`Assistant response: ... now:   `) returns the whole prompt, so the paste is scored. That is documented fallback behavior, not a defect.
- The DSH compaction rotation runs detached (`void rotateSessionClock`). A pre-step that lands before the microtask chain settles would read the old clock. This is inferred and not measured, and the window is microtasks long, so it is ruled out rather than reported.

## Confirmed-Clean Surfaces
- `fusion.ts`: no step after 1418 rewrites `confidence`. The later passes (1481, 1534, 1575) change only `uncertainty` and `passes_threshold`, so `confidenceFloored` cannot go stale on a raised confidence.
- `advisor-recommend.ts`: every downstream prompt use after 539 reads `scoredPrompt`, on the cached path and the fresh path alike. The cache key folds paste variants together on purpose.
- `skill-advisor-cli.ts` `degradedRecommendations`: a command named only in the paste no longer attaches. The substring match is unchanged from before the range.
- `skill-advisor-cli-fallback.ts`: strip, then cut. The handler re-strip is a no-op by idempotence.
- `scorer-calibration.bench.ts`: the new measurements only log. They assert nothing and change no gate.
- Python twin: the `^` cue anchor without MULTILINE, `.strip(_JS_SPACE_CHARS)` and the fixed-point loop match the TS twin.

## Ruled Out
- A stale floor flag after a confidence rewrite in fusion: no rewrite exists.
- A double strip changing the scored text between the handler and the scorer: proven idempotent.
- The DSH detached-rotation race: microtask window, inference only.
- Brief-path metalinguistic diagnostics read from the raw prompt: same root as R4-P2-001, not a new finding.

## Next Focus
- Dimension: none. This is the last iteration; synthesis follows.
- Focus area: synthesis over 9 active P2s (R1-P2-001..004, R2-P2-001, R3-P2-001, R4-P2-001/002, R5-P2-001).
- Reason: max-iterations stop policy reached.
- Rotation status: all four dimensions covered, plus one stabilization pass.
- Blocked/productive carry-forward: probing on the dist stayed productive. Do not retry strip idempotence or the floor-staleness check.
- Required evidence: none outstanding. Fix ordering: make TASK_MARKER linear (R2-P2-001) before moving the 64 KiB cut (R1-P2-001).

Review verdict: PASS

---
title: "Residual Limits Lane, Segment Four: what still limits the brief, the hook and cross-CLI usefulness after phases 014 and 015"
description: "Synthesis of the residual-limits-4 lineage, run on the built state after phases 014 and 015: a per-runtime delivery matrix, the first live brief-cost measurement over all 44 typed rows, hook latency from 1,826 real records, and one measured build (an OpenCode delivery receipt)."
trigger_phrases:
  - "residual limits segment four"
  - "reader experience per runtime"
  - "live brief cost after phase 015"
  - "opencode delivery receipt"
---

# Residual Limits Lane, Segment Four

Lane label `residual-limits-4`. The dispatcher's question: from the built state after phases 014 (review remediation) and 015 (health default and brief refinements), what still limits (a) the reader's experience of the brief on claude, codex, opencode, pi, devin and dsh, (b) hook latency and brief size, and (c) usefulness across the CLIs. Four iterations, every number from a command run in this lineage or a committed artifact it re-read; no tracked file changed, no live arm run, no model session started.

## 1. What Was Measured

| Item | Value | Source |
|---|---|---|
| Delivery proof at HEAD | claude 24/24, devin 24/24, pi 24/24, dsh 23/23 stored + 1 unscored, opencode 24/24 `deliveryUnknown`, codex 0/24 | `007/scratch/runs-final.jsonl`, `015/scratch/summary-final-after.json` |
| Brief text hook vs OpenCode plugin | identical on 9 probe prompts, one system entry each, 244 to 305 bytes | `015/scratch/render-entries-after.json` |
| CLI answer parity, 44 typed rows | 0 of 44 differ in top skill, command, policy or ambiguity, with or without `surfaceHint` | `scratch/cli-parity.json` |
| Live brief, 44 typed rows | 44/44 live, total 13,581 bytes, median 306, p95 337, max 350 | `scratch/live-brief-ts.json` |
| Live head (first line) | median 88 bytes, p95 119, max 132 | `scratch/live-brief-ts.json` |
| Brief composition | 219-byte comment-hygiene directive, about 72 percent of the 306-byte median | `015/scratch/render-entries-after.json` |
| Hook latency, 1,826 real records | median 178 ms, p95 294, p99 396, max 893; 0 over 1,000; 0 over 2,500 | `scratch/health-latency.json` |
| Handler latency, 44 live calls | median 145.3 ms, p95 233.5, max 274, first 221.8 | `scratch/live-brief-ts.json` |
| Brief emission | 325 of 1,826 records emitted; mean 265.6 bytes per emission, 47.3 per record | `scratch/health-latency.json` |
| Judgeable-offer conversion | claude 5/14 (35.7%), devin 10/11 (90.9), dsh 11/13 (84.6), pi 7/14 (50.0), opencode 3/8 (37.5) | `015/scratch/summary-final-after.json` |
| Start-policy rows | 7 of 7 are `/create:*`; claude started 2 of 8 start rows, devin 7 of 8, dsh 6 of 8 | `007/scratch/runs-final.jsonl` |
| OpenCode store census, 24 sessions | 562 rows: 513 assistant, 24 idle, 24 user, 1 synthetic, 0 injected/system | `~/.local/share/opencode/opencode.db` |
| OpenCode `Advisor:` text | 10 of 24 sessions, all in assistant rows (model quotes, not injection) | same |
| OpenCode cap effect | 8 of 24 runs exit 143; 6 of 14 offers capped; start rate on 5 of 12 rows | `015/scratch/summary-final-after.json`, `runs-final.jsonl` |

## 2. Answer to (a): what the reader sees on each runtime

The six runtimes fall into three delivery-proof classes, and the brief content is not the difference between them.

- **Proven**: claude 24/24 (transcript `hook_additional_context`), devin 24/24 (system node in the session store), pi 24/24, dsh 23/23 stored sessions. The one DSH miss is the stale arm's one line with a null locator, not a live delivery gap.
- **Unproven**: opencode 24/24 rows are `deliveryUnknown`. The plugin pushes the head onto `output.system` in memory (`.opencode/plugins/system-skill-advisor.js:1580`), and the store keeps 562 message rows for the 24 sessions with no injected-context type. Ten of the 24 sessions contain `Advisor:` in an assistant row, which is the model quoting the head, not the host recording an injection.
- **Absent**: codex 0/24, because its hooks are unapproved. This is the largest reader-facing gap on the surface and it is operator-owned.

Content parity is proven twice: the nine live probe heads are byte-identical between the hook and the plugin (244 to 305 bytes, one entry each), and the CLI answers the hook's options and the plugin's options with 0 differences over all 44 typed rows. OpenCode's problem is evidence of delivery, not the brief.

Two reader-experience limits are structural rather than content:
1. **OpenCode's turn cap** truncates the observable turn: 8 of 24 runs exit 143, 6 of 14 offers land on a capped row, and the published start rate rests on 5 of 12 rows.
2. **Claude's start rows are all create commands.** Every start-policy offer in the final arm is `/create:*`, and Claude started 2 of its 8 start rows while Devin started 7 of 8 and DSH 6 of 8. This gives segment-three rank 7 (the Claude `create` visibility collapse, waiting on the operator) a measured start-side cost, not only the 32-of-44 visibility count.

## 3. Answer to (b): brief size and hook latency

**The brief costs 306 bytes at the median over all 44 typed rows, and the hook costs 178 ms at the median with a p99 of 396 ms against a 2,500 ms budget. Neither is a limit, and no byte cut pays.**

- The live corpus measurement closes the phase 015 open limitation, which could only report `degraded_brief`, 44 rows and 0 live rows. All 44 rows render a live head; total 13,581 bytes; median 306, p95 337, max 350; head median 88, p95 119, max 132. The earlier estimate of 296 bytes was 10 bytes low.
- Composition: the fixed comment-hygiene directive is 219 bytes (the 244-byte no-match brief is a 25-byte head plus the directive), so about 72 percent of a median brief is governance text and about 87 bytes is the recommendation itself.
- Latency: across 1,826 real health records from 2026-11-13, median 178 ms, p95 294, p99 396, max 893; zero records over 1,000 ms and zero over 2,500 ms. The p99 uses 15.8 percent of the budget and the worst record 35.7 percent. The in-process source handler over 44 calls is 145.3 ms median, 233.5 p95, 274 max, first call 221.8 on a warm daemon.
- The cost is selective: 325 of 1,826 records emitted a brief (17.8 percent), 265.6 bytes per emission and 47.3 bytes per record. 47 records were stale (2.6 percent), 19 fail-open (1.0 percent), 6 degraded (0.33 percent).
- The only removable head decoration left is the status word plus the two scores and `pass`, at most about 30 bytes of 306 (9.8 percent), and removing it loses freshness and the pass mark. The other 219 bytes are the directive, whose trimming was decided in segment one. There is no information-free cut.

## 4. Answer to (c): cross-CLI usefulness and the one build

Usefulness, measured as commands started over offers that were not capped, spans 55 points:

| Runtime | Started / judgeable offers | Rate |
|---|---|---|
| Devin | 10 / 11 | 90.9% |
| DSH | 11 / 13 | 84.6% |
| Pi | 7 / 14 | 50.0% |
| Claude | 5 / 14 | 35.7% |
| OpenCode | 3 / 8 | 37.5% |

Claude and OpenCode sit at the bottom for different measured reasons: Claude's start rows are all `/create:*` commands affected by the rank 7 collapse, while OpenCode's are capped before the offer can be taken. Content and delivery are equal for Claude (24/24 delivered, identical bytes), so the create collapse is the only measured explanation left.

**Build: an OpenCode delivery receipt.** The plugin already computes the emitted block in `observeEmittedAdvisorBlock`; it should append a bounded, prompt-free receipt (session id, block hash, runtime, epoch) beside the health records, and `briefDelivered` should gain an `opencode` branch that reads the receipt and never the session text.

| Field | Value |
|---|---|
| Files | `.opencode/plugins/system-skill-advisor.js` (after `observeEmittedAdvisorBlock`), `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` (`briefDelivered`), `.opencode/plugins/tests/system-skill-advisor.test.cjs`, `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts` |
| Measured gain | 24 of 24 OpenCode rows move from `deliveryUnknown` to a boolean; delivery coverage rises from 4 of 6 runtimes to 5 of 6 |
| Proof check | Re-score the 24 committed OpenCode lines: `deliveryUnknown` 24 to 0; plugin and command-offer tests pass; floors stay 24 of 44, 0 of 35 and `[160,50,21,5]` |
| Why a write and not a reader | The store has no injected-context row; a reader would count 10 assistant quotes as delivery and miss 14 rows |
| Feasibility | All 24 rows carry a `sessionId` and `projectDir`; `SPECKIT_` is already in the runner's child-env allowlist |

**Wait on the operator: Codex hook approval.** 0 of 24 rows receive a brief. No change in this lane can alter it; one approved Codex smoke row is the proof.

**Wait on the operator: segment-three rank 7, reopened with a new measurement.** Every start-policy offer is a `/create:*` command and Claude started 2 of 8 start rows where Devin started 7 of 8 and DSH 6 of 8. The disposition does not change (the fix changes how Claude reads every skill), but the rank now has a start-side cost as well as the visibility count.

**Declined, with the number:**
- Passing `includeCompiledRoute` and `compiledRouteTopOnly` from the plugin: 0 of 44 rows change.
- Removing the head's status, scores and `pass`: at most 30 of 306 bytes (9.8 percent), and it loses freshness.
- Raising the OpenCode turn cap as an advisor change: it is a harness setting in the runner, not the brief.
- Trimming the comment-hygiene directive: decided in segment one; this lane adds no fact that reopens it.

**Hypotheses, not recommendations (no measurement):**
- A more directive head to lift Claude's start rate on the seven create rows: needs a live arm, which this lane may not run.
- A tie-break line for ambiguous prompts: the 9 probe heads carry one ambiguous row, so the expected gain is at most 1 row.
- Ranks 6 and 10 are owned by separate segment-four lanes and are not re-ranked here.

## 5. Convergence Report

- Stop reason: `converged` (`all_questions_answered`).
- Total iterations: 4.
- Questions answered: 3 of 3.
- newInfoRatio by iteration: 0.80, 0.90, 0.83, 0.75; average 0.82.
- Corruption count: 0. Gateway refusals: 0.
- Source diversity: each finding carries a committed artifact or a command output; no single-weak-source answer.
- Scope: every write landed inside `.../lineages/residual-limits-4/`; no tracked file changed; no sub-agent dispatched.
- Why stop: all three key questions are answered, the one build has its files, gain and check, and further passes would add a live-arm measurement this lane is forbidden to take.

## 6. Gaps and Confidence

1. **The behaviour numbers come from the pre-014 arm.** The final arm ran at `320e7b64d4` before phases 014 and 015; phase 015 rescored it. No live arm was allowed, so start, unsafe and cap figures are the built code's best available evidence, not a fresh run of it.
2. **Codex is unmeasurable.** 0 of 24 is a hook-approval fact, not a code result.
3. **OpenCode delivery stays unknown until the receipt ships.** Ten assistant quotes are not delivery proof.
4. **The directive share is derived, not per-row measured.** It comes from the 244-byte no-match probe; the corpus median and head are measured directly.
5. **The cold first prompt was not rerun.** Phase 010's 742 ms median (30 percent of budget) is cited; a fresh cold sample would need a socket and model state this lane may not create.
6. **Claude's create rows are a rank 7 link, not a new fix.** The measurement strengthens a waiting item; it does not establish that restoring visibility would start those commands.

## 7. Sources

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation/implementation-summary.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/implementation-summary.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/summary-final-after.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements/scratch/render-entries-after.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-3.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/health-latency.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/cli-parity.json`
- `.opencode/plugins/system-skill-advisor.js`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`
- `~/.local/share/opencode/opencode.db` (read-only counts)

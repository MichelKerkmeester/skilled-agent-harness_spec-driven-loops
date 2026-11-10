# Iteration 002 — Advisor Scoring Rules (v4.0.0.7, v4.0.0.15, v4.0.0.16)

## Focus

Verify the advisor-scoring promises in three release notes against live `advisor_recommend` output and the scorer code under `.skilled/skills/system-skill-advisor/`:

- v4.0.0.7: a skill name inside a file path or doc target must not pull a route.
- v4.0.0.15: a typed command routes to its owner, and a confidence-floored skill counts as tied only when its score is also close.
- v4.0.0.16: a named workflow stays above the executor that runs it, and doctor targets route as asked.

## Actions Taken

1. Read the three release notes in full, including the Skill Advisor and Skill Advisor Routing sections.
2. Ran five prompts through the live advisor CLI (`node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"..."}' --format json`), one per claimed rule:

| # | Prompt | Top route | Runner-up | Ambiguous |
|---|---|---|---|---|
| P1 | `review .skilled/skills/sk-doc/SKILL.md for outdated guidance` | `sk-code` 0.753218 (review-cache) | `sk-doc` 0.333278, compiled action `defer` | false |
| P2 | `/deep:research :auto audit the hook adapters` | `system-deep-loop` 0.627916, mode `research` | `command-spec-kit` 0.532 | false |
| P3 | `do not write anything, just explain how the advisor scores a prompt` | `sk-prompt` 0.535201 | `sk-doc` 0.305328, `system-spec-kit` 0.150083 | true |
| P4 | `use cli-pi for deep research on the relaunch hooks` | `system-deep-loop` 0.642453 | `cli-external-orchestration` 0.737707 | true |
| P5 | `set up Skilled in this repo with the doctor` | `command-doctor-setup` 0.644 (only result) | none | false |

3. Read the scorer paths that implement each rule: `ambiguity.ts`, `fusion.ts`, `executor-delegation.ts`, `projection.ts`, and the Python fallback `skill_advisor.py`.

## Findings

### F-iter002-001 — The confidence-floor tie exception fails when the top is itself floored

- **Type:** drift (release note vs code) | **Severity:** P2 | **Release:** v4.0.0.15 | **Confidence:** high
- v4.0.0.15 promises: "A skill that only reached that floor now counts as tied only when its score is also close." The implementation applies that floor exception only when the top did **not** itself reach the floor: `floorOnlyMember = applyFloorException && recommendation.confidenceFloored === true && top.confidenceFloored !== true` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:42]. When the top is floored too, control falls through to the confidence-gap branch, and every floored skill shares confidence 0.82, so it ties regardless of score distance [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:46]. The flag is produced from the confidence result [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1151], serialized on the recommendation [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1168], and consumed by the ambiguity verdict [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1395].
- **Observed:** P3 returns `ambiguous: true` with top score 0.535201 and third score 0.150083 — a 0.385 gap, far outside the 0.05 ambiguity margin — because all three recommendations carry confidence 0.82. The top pick is unaffected; the flag is the defect.
- **Verify:** `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"do not write anything, just explain how the advisor scores a prompt"}' --format json`

### F-iter002-002 — The read-only guard does not recognize "do not write anything"

- **Type:** bug | **Severity:** P2 | **Release:** UNKNOWN (present at v4.0.0.16) | **Confidence:** high
- `readOnlyRouteAllowed` matches `do not (change|edit|modify|touch)` but not `write` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:675]. A prompt whose only read-only marker is "do not write anything" is therefore scored as write-capable, the explainer floor never fires, and `system-spec-kit` remains in the candidate set at 0.150083 on P3 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:673].
- **Impact:** this is the direct input to F-iter002-001's false ambiguity flag. The top route is unchanged.
- **Verify:** run the P3 command and inspect the recommendation list; compare the regex at `fusion.ts:675` with the prompt text.

### F-iter002-003 — Workflow-over-executor rank is not represented in the payload

- **Type:** operator and AI-user UX | **Severity:** P2 | **Release:** v4.0.0.16 | **Confidence:** medium-high
- v4.0.0.16 promises the named workflow "stays first and the executor sits just below it." P4 confirms the ordering: `system-deep-loop` is rank 1 at score 0.642453 while `cli-external-orchestration` is rank 2 at the higher score 0.737707. The lift and workflow-owner handling lives in [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:572], with the code hub capped so it cannot out-rank or tie the executor [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:592].
- **Gap:** the serialized recommendation carries no field that marks the rank override (no workflow-owner or rank-reason field). A consumer that sorts recommendations by `score`, or that shows scores beside ranks, inverts the documented order. The `ambiguous: true` flag on P4 is consistent with the two passing skills but does not explain the inversion.
- **Verify:** run the P4 command and compare `data.recommendations[0].score` with `data.recommendations[1].score`.

### F-iter002-004 — A skill-doc review routes to sk-code, and sk-doc's compiled route defers

- **Type:** improvement (UX) | **Severity:** P2 | **Release:** path rule from v4.0.0.7; observed at v4.0.0.16 | **Confidence:** medium
- P1 names only `.skilled/skills/sk-doc/SKILL.md`. The path no longer pulls sk-doc to first, which matches v4.0.0.7's promise, but the request "review ... for outdated guidance" lands on `sk-code`'s review mode at 0.753218 while `sk-doc` sits second at 0.333278 with `compiledRoute.action: "defer"` and zero targets. Even if an operator selected sk-doc, the compiled route offers nothing to execute.
- **Interpretation:** a doc-review request arguably belongs to sk-doc's audit surface, not sk-code's code-review mode. This is recorded as an improvement candidate, not a confirmed release-note contradiction.
- **Verify:** run the P1 command and inspect `data.recommendations[1].compiledRoute`.

## Questions Answered

- Advisor scoring (v4.0.0.7, v4.0.0.15, v4.0.0.16): do the path-mention rule, the confidence-floor tie rule and the typed-command owner rule in .skilled/skills/system-skill-advisor/** behave as the notes say when run through node .skilled/bin/skill-advisor.cjs advisor_recommend?
  - **Partly.** The path-mention rule behaves as v4.0.0.7 says (P1's path does not win the route). The typed-command owner rule behaves as v4.0.0.15 says (P2 puts `system-deep-loop` first and `command-spec-kit` second, `ambiguous: false`, and `:auto` produces no visible boost). The confidence-floor tie rule does **not** hold when the top recommendation is itself floored (F-iter002-001). The named-workflow-first rule and doctor-target routing behave as v4.0.0.16 says (P4, P5).

## Questions Remaining

- Advisor parity (v4.0.0.7): does the Python fallback reproduce the five routes, and does it share F-iter002-001? The loop-owner floor is hard-coded at 0.82 [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4187] and applied at [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4540], but the fallback was not executed this iteration.
- Does F-iter002-001 reproduce on other prompts whose top recommendation is confidence-floored, such as a doctor prompt with a single floored winner?
- Advisor transport (v4.0.0.0, v4.0.0.16), the prompt hook adapters, Hermes removal, session relaunch, history after compaction, question-tool capture and hook safety were not touched this iteration.

## Next Focus

Run the Python fallback on the same five prompts and compare top routes and ambiguity flags against the Node output, then test a second floored-top prompt to establish how broadly F-iter002-001 fires. After that, move to advisor transport and the prompt hook adapters.

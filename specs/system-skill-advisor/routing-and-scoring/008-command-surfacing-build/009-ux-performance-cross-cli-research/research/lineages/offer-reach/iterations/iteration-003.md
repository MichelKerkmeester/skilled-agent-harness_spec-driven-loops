# Iteration 3: The doctor handoff and the deep-family route

## Focus

Enumerate the doctor-family chat rows and the two deep rows, test whether a doctor handoff for deep-loop diagnostics and an `ask`-only defer offer close the remaining misses, and check each against the none rows. Deferred from iteration 2: whether the doctor family can gain a deep-loop diagnostic route without breaking the deep hub's defer contract.

## Actions Taken

1. Ran the committed read-only matcher `doctor-helper-match.cjs` on the three doctor chat prompts and on the deep-loop diagnostic prompt (no daemon, no model, no holdout text).
2. Read `applyDoctorHelperHandoff`, `matchDoctorProblem`, the strong and weak problem-cue regexes, and the doctor bridge/command tables.
3. Re-ran the pure compiled-route resolver for the three deep prompts and read the deep hub's `ai-council-aliases` and `review-aliases`.
4. Re-read `attachCommand`'s depth gate and compared `DEPTH_WORDING` with the three deep prompts.
5. Checked the proposed doctor and deep phrases against the 31 none rows.

## Findings

1. The doctor handoff already resolves the exact right command and then deliberately offers the generic helper instead. `matchDoctorProblem` returns `/doctor:agents-md` at 12.781 for the AGENTS.md row and `/doctor:ci` at 12.301 for the CI row, both above the uncued floor of 10, but `applyDoctorHelperHandoff` inserts `command-doctor-helper`. Offering the matched command when its row is a read-only `run` (resolved through `commandRowFor`) and keeping the helper only for `ask`/mutating matches converts both chat offers from `/doctor:helper` to the expected command without changing when the handoff fires. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:143] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1103] [SOURCE: .skilled/commands/doctor/scripts/doctor-helper-match.cjs]

2. The same matcher already knows the deep-loop diagnostic: `/doctor:deep-loop` scores 16.249 on "my research loop stopped converging and I cannot see why". The row still gets nothing because the cue classifier has no phrase for "stopped converging", so with a passing skill (system-deep-loop) the handoff is skipped before the match is consulted. Adding a gerund form to the strong-cue list unlocks a command that already exists; no new route is needed. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:52] [SOURCE: .skilled/commands/doctor/scripts/doctor-helper-match.cjs]

3. The doctor-helper row has no matcher candidates at all, so no handoff can fire; it needs a direct generic-repair cue or a row anchor rather than a better match. `doctor-helper-match.cjs` printed `{"candidates":[]}` for "I have a problem and want the right repair path suggested with reasons". [SOURCE: .skilled/commands/doctor/scripts/doctor-helper-match.cjs]

4. The deep rows do not need a defer offer; they need vocabulary that lets the existing single-route path work. Both plain prompts already carry depth wording that passes `attachCommand`'s gate ("everything you can" for research, "many passes" for review), but the deep hub's `review-aliases` lack "audit this codebase" and "findings stop changing", and `ai-council-aliases` lack "several models"/"final verdict"/"debate the tradeoffs", so the hub defers before the gate is reached. [SOURCE: .skilled/skills/system-deep-loop/hub-router.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:263]

5. A defer-time default offer is unsafe on this corpus. The near-miss `nm-system-deep-loop-01` ("how does the research loop decide when it has enough") already matches the deep hub's research vocabulary and must stay silent; a rule that offers the leading command whenever a hub defers would fire on it. The depth gate is the only thing keeping it silent, and a defer names no mode for the gate to qualify. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl] [INFERENCE: defer offer would bypass the depth-gated single-route path]

6. The safe set of doctor and deep phrases is small and specific: "stopped converging", "repair path", "several models", "final verdict", "debate the tradeoffs", "audit this codebase", "findings stop changing", "find out everything". None occurs in the 31 none rows; the only near-miss that shares deep vocabulary is already protected by depth wording. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl]

## Ruled Out

- An `ask`-only default command on a deferring hub (finding 5): it would fire on the deep-loop near-miss where the hub legitimately has no mode.
- Adding a new doctor mode to the deep hub: the command row and the matcher entry already exist, so a mode would duplicate a working lookup.
- A generic "problem" cue for the doctor helper row: the none row "what are the doctor commands actually used for" is a question about the family, and a bare problem word is the weak cue that already must not fire when a skill passes.

## Dead Ends

- Treating `/doctor:deep-loop` as a scoring problem: the matcher ranks it first at 16.249; the blocker is the cue gate, not the score.

## Edge Cases

- Ambiguous input: "doctor chat rows" are the four plain tune rows in the after-arm chat set (agents-md, ci, deep-loop, helper), not all 17 doctor tune rows.
- Contradictory evidence: none; the matcher scores and the current offer disagree by design (handoff picks the helper), which finding 1 resolves.
- Missing dependencies: the handoff's policy lookup needs `commandRowFor`; the doctor matcher returns a runnable string, so the policy is available from the generated table without a new map.
- Partial success: matcher scores are measured; the expected row gains are inferred from the code path and must be proven by a capture.

## Sources Consulted

- `.skilled/commands/doctor/scripts/doctor-helper-match.cjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/skills/system-deep-loop/hub-router.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`

## Assessment

- New information ratio: 0.88
- Questions addressed: KQ4, and the deep half of KQ1
- Questions answered: KQ4 (three of four doctor chat rows are reachable; helper needs a cue), deep deferral (fix by vocabulary, not a default command)

## Reflection

- What worked and why: running the committed matcher was decisive — it showed the exact command was already ranked first on three rows, which turned a vague "doctor family" idea into a two-line change with a known firing gate.
- What did not work and why: a defer-time offer looked attractive in iteration 1 but fails the near-miss as soon as it is checked; the depth gate only protects a single route.
- What I would do differently: test the near-miss before proposing a defer rule, not after.

## Questions Answered

- KQ4: the doctor family can convert its two helper offers and the deep-loop row to exact offers by naming the matched run command and adding one cue phrase; the helper row needs a direct cue.
- Deep deferral: vocabulary that makes the existing mode lead is sufficient; a default command for a deferring hub is ruled out.

## Questions Remaining

- What is the measured row gain of the sk-doc alias and explicit-anchor proposals in the stand-in capture, and do any of them move a none row?
- How should the recommendations be ranked by gain per unit of risk, and which are safe to commit as one phase?

## Recommended Next Focus

Iteration 4: verify every proposed phrase against the none rows and the hub canary fixtures, compute the expected offer count per recommendation, rank the set by gain per risk, and check the floors (typed 24/44, false offers 0/35, scorer [159,50,20,5]).

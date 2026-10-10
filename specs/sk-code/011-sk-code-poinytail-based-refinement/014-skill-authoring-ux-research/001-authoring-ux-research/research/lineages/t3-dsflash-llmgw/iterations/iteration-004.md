# Iteration 4: E3 first half — the routing pipeline and why the wrong hub wins

## Focus
E3, first half: how a prompt actually reaches a hub — the signal sources the compiler and scorer read, the file-path pull, the missing negative vocabulary, the tie-break, and the two scorer surfaces. The battery's failing aggregate is the observable; this iteration maps the machinery behind it. Fix design and proof for E3 are iteration 5.

## Actions Taken
- Read the probe battery contract and its aggregate rules.
- Read the compiler's signal assembly and searched the advisor runtime for description.json consumers.
- Read the scorer projection and trust-lane tables for the path-signal mechanics.
- Searched for a negative-keyword mechanism anywhere in the advisor.
- Read the round-four tie-break child's plan and summary for the tie-break location and the exact battery numbers.
- Deliberately did NOT run the advisor: `skill-advisor.cjs` creates a socket directory under /tmp and spawns the daemon, an out-of-scope write; evidence is code-read and packet-recorded instead.

## Findings
1. [VERIFIED] The battery's contract: 17 positives (P1-P17) and 5 negatives (N1-N5); PASS requires positive accuracy ≥ 0.80 (≥14 of 17) AND zero negatives won by sk-code. The battery already fails its own rule today. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:55-61]
2. [VERIFIED] The measured failure is recorded twice in the round-four child: `positives 13/17 negatives-false-positive 2/5`, before and after the session-aware tie-break change — the change did not move the battery because the hint input is not supplied on that path. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/implementation-summary.md:121] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/after-advisor.txt:23]
3. [VERIFIED] The compiled graph's signal map is built only from `graph-metadata.json` fields — `intent_signals` plus derived affordance triggers. No other file feeds it at compile time. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:1009-1016]
4. [VERIFIED] `description.json` has no consumer in the advisor runtime. A bounded search across the runtime for the filename finds only its README, vitest fixtures and a migration test — no loader, compiler or scorer reads it. The round-two child recorded the same failure from the other side: "The sk-code graph does not list description.json as a source, so the new keywords do not reach the advisor." [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/implementation-summary.md Known Limitations 2] (search: .skilled/skills/system-skill-advisor/runtime)
5. [VERIFIED] The file-path pull is a bounded keyword lane, not a rule about ownership: the projection turns `derived.key_files` and `derived.source_docs` into derivedKeywords through `reduceDerivedPathEntry`, and the trust-lane table scores `key_files`/`source_docs` as `derived_generated` with max contribution 0.35, against `intent_signals` as `explicit_author` at 1.0. A prompt that names a path in a skill's derived file list therefore boosts that skill, but a hand-curated intent signal outweighs it threefold. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:749-763] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/trust-lanes.ts:40-51]
6. [VERIFIED] No negative vocabulary mechanism exists: `negative_keywords` (the battery's own proposed anti-signal) has zero occurrences anywhere under system-skill-advisor. The battery's triage even names the N1 mechanism — "should go to sk-doc but sk-code wins because of 'sk-code' mention" — and the proposal has no implementing lane. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:115-117] (search: system-skill-advisor)
7. [VERIFIED] A near-tie between surfaces is decided by the compiled `routerPolicy.tieBreak` order, and generic words (typescript, vitest, json) decide it because both surfaces match them; the round-four fix when a session hint is present is to move the hinted surface into the first slot at serve time, after compilation, so no policy changes. Without a hint every hub routes as before. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/plan.md:57-58,84] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/implementation-summary.md:44-46]
8. [VERIFIED] Two live scorer surfaces exist: the battery drives the Python advisor `skill_advisor.py`, while the CLI front door `.skilled/bin/skill-advisor.cjs` spawns the compiled TypeScript daemon CLI. Both ultimately read graph metadata, but an author who probes one path and ships the other is testing a different scorer. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:82-86] [SOURCE: .skilled/bin/skill-advisor.cjs:21-24,105]
9. [INFERRED] E3 root cause, first half: the hub vocabulary is split across four surfaces (graph-metadata intent_signals, graph-metadata derived, ROUTER.md INTENT_SIGNALS, description.json), but only the first two reach the scorer — and only one of those is the author-lane that outweighs derived noise. The author edits the most obvious file (description.json, which looks like the keyword registry) or the router document, and neither edit can move stage one; no authoring-time signal says which vocabulary the scorer reads. Counter-signals (negatives) have no lane at all, so a doc/research prompt naming a skill can only add score, never subtract it.

## Ruled Out
- Running the advisor to reproduce 13/17 live: `skill-advisor.cjs` writes a socket directory under /tmp and spawns a daemon before any scoring; the packet-recorded measurement stands and the code paths are cited instead.
- Treating description.json as an input and "fixing" it: the file has no reader; adding keywords there can never change a route until a consumer exists.
- Re-reading the intent-signals wiring found in iteration 2: only referenced where it closes the E3 loop (the ROUTER.md-to-graph carry is the one wired vocabulary path).

## Dead Ends
- Searching the advisor runtime for a path-ownership rule found no such rule; the effect is emergent from the derivedKeywords lane plus phrase variants. Recorded so iteration 5 does not hunt for a rule that does not exist.

## Edge Cases
- Missing dependencies: none.
- Partial success: E3 is split deliberately; remediation ranking and proof are iteration 5.
- Contradictory evidence: none.

## Sources Consulted
- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
- .skilled/skills/system-skill-advisor/runtime/lib/derived/trust-lanes.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .skilled/bin/skill-advisor.cjs
- specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/implementation-summary.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/ (plan.md, implementation-summary.md, scratch/after-advisor.txt)

## Assessment
- New information ratio: 0.90
- Questions addressed: Q3 (pipeline half), Q4 (caller context)
- Questions answered: none yet (Q3 remediation pending iteration 5)

## Reflection
- What worked and why: searching for the filename before believing the docs was decisive — description.json is documented as a vocabulary file yet has no reader, which explains a recorded failure that looked like a stale-graph problem.
- What did not work and why: the first path-rule search assumed a dedicated rule; the mechanism is an ordinary keyword lane, and finding the trust-lane table settled it.
- What I would do differently: read the trust-lane table before the projection; contribution weights ranked the levers immediately (intent_signals 1.0 vs derived 0.35).

## Recommended Next Focus
Iteration 5, E3 second half: turn each E3 mechanism into the smallest fix — make description.json a wired source or delete it, wire the existing router-intent carry into the commit path, decide whether negatives get a counter-signal lane or a documented limit, and identify the exact battery command that proves each; include what the 5k check already enforces so fixes do not duplicate it.

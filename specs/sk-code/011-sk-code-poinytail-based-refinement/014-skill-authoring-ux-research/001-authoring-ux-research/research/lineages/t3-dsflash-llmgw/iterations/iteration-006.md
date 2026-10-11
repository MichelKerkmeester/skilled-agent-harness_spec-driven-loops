# Iteration 6: E4 — the compiled-route surface hint that no automated caller passes

## Focus
E4: advisor_recommend never passes --surface-hint to the compiled-route front door, although the round-four tie-break added the flag. This iteration isolates the caller chain, the option plumbing, and the smallest in-place wiring with its proof.

## Actions Taken
- Read the advisor_recommend handler's compiled-route enrichment and the tool descriptor's options schema.
- Read the front door's flag contract and the CLI's daemon-compatibility retry idiom.
- Read the caller instruction the round-four change added to sk-code's SKILL.md and ROUTER.md.
- Verified by search that neither the handler nor the tool descriptor contains the flag string.

## Findings
1. [VERIFIED] The handler spawns the front door with exactly two arguments — `--hub <skillId>` and `--prompt-stdin` — and no surface hint. The option does not exist anywhere in the spawn. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:360-377]
2. [VERIFIED] The tool descriptor's options object is strict (`additionalProperties: false`) and lists six keys (topK, includeAttribution, includeAbstainReasons, confidenceThreshold, uncertaintyThreshold, includeCompiledRoute); no surface key exists to pass. A string search for `--surface-hint` in the handler and descriptor returns nothing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts:11-25]
3. [VERIFIED] The front door accepts `--surface-hint <SURFACE>` and forwards it to `resolveRoute` as `options.surfaceHint`; the flag contract exists and is exercised by the round-four test file. [SOURCE: .skilled/bin/compiled-route.cjs:36-37,46]
4. [VERIFIED] The round-four change documented the flag as a CALLER duty: sk-code's SKILL.md tells the caller to run surface detection on the session's working directory and files, then add `--surface-hint <SURFACE>`; ROUTER.md repeats that the detected surface goes to the front door. The advisor handler is an automated caller and was not updated. [SOURCE: .skilled/skills/sk-code/SKILL.md:63] [SOURCE: .skilled/skills/sk-code/ROUTER.md:37]
5. [VERIFIED] The handler already carries both idioms this fix needs: a capability probe that reads the front door's source before using a newer flag (`frontDoorReadsPromptFromStdin`), and the CLI layer strips an option a too-old daemon rejects (JSON-RPC -32602) and retries. An in-place extension therefore has an established shape. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:350-359] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1497-1510]
6. [VERIFIED] The battery never exercises the hint path: its command sequence drives the Python advisor, which does not call the compiled-route front door at all, so a hint fix cannot move the battery numbers even after it lands — the proof must be an advisor-path test, not the battery. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:82-86]
7. [INFERRED] Root cause: the flag was added door-side and documented caller-side, but the only automated caller was never updated — the enhancement is inert wherever the advisor (not a human) routes. The author was in the front door and the hub docs; to make it effective they would have to know that advisor_recommend is itself a caller of the front door and that its option schema is closed and versioned.
8. [INFERRED] Smallest fix by reversal cost: (a) build nothing fails — the documented behavior never occurs on the advisor path; (b) change a value fails — no value carries the surface; (c) extend in place is the cheap working move: add `surfaceHint` to the options schema, thread it into `compiledRouteForRecommendation`'s spawn as `--surface-hint` when present, and let the CLI's existing unknown-option retry cover older daemons; the hint value should be produced by the existing stack-detection rules, not new detection logic; (d) a new auto-detection function inside the advisor follows if the hook caller cannot supply the surface — detect from workspaceRoot using the same rules the docs name; (e) a session-state service is a new dependency and fails the cheaper moves. Proof: an advisor-level test asserting the front door receives the flag (today a string count returns zero), plus an end-to-end run where a hinted tie leads with the hinted surface while the unhinted order is unchanged — the front door test file already pins the door side; the advisor side is the missing assertion.

## Ruled Out
- Routing the battery through the front door to prove E4: the battery intentionally drives the Python advisor; changing its harness to prove a different defect would conflate two surfaces.
- Inferring the surface from the prompt alone: that is exactly the tie the hint exists to break; the hint must come from the session's working context.
- Passing the hint unconditionally from a default constant: an unchosen surface is the same as no hint, and a wrong default would silently reorder ties; absent hint must stay the documented fallback.

## Dead Ends
- A search for an existing surface field in the handler's request path found none; the fix is a new option key, not a correction of an ignored one.

## Edge Cases
- Contradictory evidence: none; the flag's presence in the door and absence in the caller are both direct reads.
- Missing dependencies: none.
- Partial success: the fix is design only; not applied (research-only phase).

## Sources Consulted
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts
- .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts
- .skilled/bin/compiled-route.cjs
- .skilled/skills/sk-code/SKILL.md
- .skilled/skills/sk-code/ROUTER.md
- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md

## Assessment
- New information ratio: 0.90
- Questions addressed: Q4 (complete)
- Questions answered: Q4

## Reflection
- What worked and why: reading the spawn call itself settled the defect in one look; the root cause then became a documentation-versus-caller mismatch instead of missing capability.
- What did not work and why: none; the search for the flag string is a one-command falsifier.
- What I would do differently: when a flag exists but appears unused, count its occurrences per caller immediately — presence in the door and zero in the handler is the whole finding.

## Recommended Next Focus
Iteration 7, E5: doctor rules 5e, 5i, 13c, 13d and the router-sync checks — where each runs, what it can see when it runs, and the smallest change that moves detection to the author's edit; include the existing hook inventory so recommendations extend rather than duplicate.

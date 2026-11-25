# Iteration 4: Skill Advisor release-note coverage

## Focus
Audit Skill Advisor notes against scoring lanes, command-offer behavior, follow-up detection and removed embedding routes; inspect the recent advisor routing packets.

## Actions Taken
- Re-read config, state projection, strategy and checked steer.md before the pass; checked it again before resolving the note/code conflict, and it is absent.
- Compared the Skill Advisor notes with recent changes and the 012 deep-loop command-offers packet.
- Read commit 73d98332fff08fc272162e870897ffc568d5325f and the current Python fallback gate.
- Confirmed that the fallback keeps a typed run row and marks it typed without applying a surrounding-text refusal check.

## Findings
1. **DRIFT | P2** The notes say a turned-down loop gets no run, including when a refusal follows the command, but the Python fallback now retains a typed deep-loop command row as an ask even when surrounding text refuses it. Commit 73d98332fff08fc272162e870897ffc568d5325f changed the fallback to filter only on whether the command was typed; the implementation summary confirms this exception. This applies when the native advisor is unavailable. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602-4625] [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:298] The contradicted release-note claim is line 506. [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:506]

## Ruled Out
[None]

## Dead Ends
[None]

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: the general note at line 506 says refusals suppress the run; the fallback implementation and its current packet summary say a typed command that the prompt refuses retains its ask row. The implementation is limited to the fallback path.
- Missing dependencies: none; the code, packet summary and commit are present.
- Partial success: none. The fallback behavior and the exact contradicted claim were confirmed; other advisor claims remain under audit.

## Sources Consulted
- .skilled/changelog/skilled/v4.2.0.0.md:489-513
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602-4626
- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md
- specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:294-298
- Commit 73d98332fff08fc272162e870897ffc568d5325f

## Assessment
- New information ratio: 1.0 (1 fully new, 0 partially new, 0 redundant)
- Questions addressed: the Skill Advisor portion of missing-coverage and claim-drift checks.
- Questions answered: none; the full audit remains open.
- Questions remaining: all four key questions remain open.

## Reflection
- What worked and why: the recent packet summary stated the fallback exception explicitly, and the current Python gate showed the exact branch that implements it.
- What did not work and why: none; commit, source and note evidence aligned.
- What I would do differently: compare the remaining advisor counts and behavior claims against the post-note commits before moving to installs and overlays.

## Recommended Next Focus
Audit Installs and Overlays notes against current layout mapping, rollback behavior, manifest validation, and framework/root paths.

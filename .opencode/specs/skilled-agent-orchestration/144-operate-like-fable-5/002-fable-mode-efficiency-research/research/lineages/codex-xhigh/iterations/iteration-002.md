# Iteration 2: fable-mode-main Ritual Extraction

## Focus
Extract net-new techniques from `external/fable-mode-main/` beyond the distilled `Fable5.md` doctrine and tag them by type.

## Actions Taken
- Read `fable-mode-main/README.md`.
- Read `fable-mode-main/fable-mode.md`.
- Searched and sampled `fable-mode-profile.md` for method, verification, handoff, orchestration, and communication sections.

## Findings
1. **The command overlay is temporary and subordinate to house rules.** It is off by default, invoked by `/fable-mode`, and explicitly says project instructions still win. That makes it useful as a command pattern, not as the main Public enforcement surface. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/README.md:3] [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode.md:9]

2. **Net-new ritual: strict test-first with mutation check.** The profile treats a green test as insufficient until deliberately breaking the guarded behavior makes the test fail and restoring returns green. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:113]

3. **Net-new ritual: adversarial review at scale with forced evidence schema.** The profile describes claim-verifiers, adversarial recheck, completeness critics, and `claim / verdict / evidence` outputs. This maps naturally to orchestrator and deep-review output contracts, not root doctrine. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:141]

4. **Net-new handoff mechanism: scar tissue for cold successors.** The profile frames handoff docs as carrying only state, sequence, and hard-won traps a fresh session cannot derive. This is stronger than generic "handover" prose and belongs in handover templates or memory-save routing. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:200]

5. **Net-new mechanism: turn rotting lists into self-auditing tests.** The source says Fable spots a rotting list, replaces it with machinery that fails loudly, then mutation-checks that machinery. This belongs in sk-code/sk-code-review and validation guidance. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:218]

6. **Net-new communication pattern: two registers by phase.** The profile distinguishes clipped working updates from dense boundary summaries and says result-first openings are part of the signature. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:420]

7. **The profile names costs that must shape recommendations.** Boundary verbosity, heavy process, and stale docs are documented failure modes, so a round-2 recommendation should avoid adding another long always-read doctrine wall. [SOURCE: .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:495]

## Questions Answered
- Which fable-mode-main techniques are net-new versus `Fable5.md`?

## Questions Remaining
- Which opus-fable-mode mechanisms are portable?
- Which surfaces are most reliable?
- Which recommendations rank highest?

## Assessment
- newInfoRatio: 0.78.
- Novelty justification: several rituals were not represented by round-1's distilled operating-discipline bullets.
- Confidence: high that mutation check, adversarial schema, and scar-tissue handoff are net-new surface candidates; medium on exact implementation surface until surface map pass.

## Reflection
What worked: treating the profile as a mechanism/ritual source rather than as text to copy.

What failed or was ruled out: slash-command-only Fable mode is too opt-in and session-local for the Public default behavior target.

## Recommended Next Focus
Extract the opus-fable-mode governor, re-injection hook, and leak-test metrics.

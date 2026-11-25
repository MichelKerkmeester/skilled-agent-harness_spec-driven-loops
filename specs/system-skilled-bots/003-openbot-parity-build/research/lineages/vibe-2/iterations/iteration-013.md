# Iteration 13: The build-readiness verdict

## Focus

Frontier node F-1-004 (depth 1), final pass: given the three P0s, the 31 P1s and the 17 P2s, can the eleven phases be built in the order the parent fixes, and what must change first. This is the run's closing verdict; it adds no new external evidence.

## Findings

1. **Verdict: the packet is not build-ready as written, and it is build-ready after three P0 fixes and nine one-line edits.** The build order is sound — every real dependency edge points backwards, so 001 through 011 in numeric order satisfies all of them. What blocks the build is not the order but three defects that make a phase's own Definition of Done unreachable or its central mechanism unsafe, plus nine requirement rows that a builder would have to guess at. [INFERENCE: from iterations 1 through 12]

2. **The three P0s, and what each one blocks.**

   | P0 | Phase | Why it blocks | Fix |
   |---|---|---|---|
   | `until` is prose executed as a shell command | 002 | The routine layer's central mechanism cannot work as specified, and a BOT.md can put a command in the field | Split into `until` (prose) and `until_check` (command) |
   | DoD requires `SCHEMA_VERSION = '2'` after 001 bumps it to `'3'` | 004 | The phase can never be marked done | Change `'2'` to `'3'` in REQ-006 and the DoD |
   | Parent forbids any child from building `operators.json`; 011 builds it | parent/011 | 011's approval path depends on a file no phase may create | Give it an owner and amend the parent's Out of Scope |

3. **Phase by phase, the gate each one must clear before it can start.**

   | Phase | Gate | Severity |
   |---|---|---|
   | 001 | None. Its findings are P1 and P2 and none blocks its own DoD. | — |
   | 002 | The `until` split, the streak exclusion, and the `workDir` fix. | P0 + P1 |
   | 003 | The circular DoR (build the empty crate first) and the marker table keyed by 001's group ids. | P1 |
   | 004 | The schema version. | P0 |
   | 005 | The `itemKind` rename, the proposal's `source`, and the memory fence. | P1 |
   | 006 | The ladder's three unreachable rungs and the `--scope always` promise. | P1 |
   | 007 | The `apps:` enforcement and the widened filter's refusal test. | P1 |
   | 008 | The widened filter's refusal test; the matcher deletion is optional. | P1 |
   | 009 | The dependency on 005 and the skill fence. | P1 |
   | 010 | The transcript fence and the exported adapter for 011. | P1 |
   | 011 | The `operators.json` owner, the transport cut, the message envelope, the grant scope, and the `seen/` sentence. | P0 + P1 |

4. **Parity verdict: all eight 002 parts are covered, and the three gaps that remain are inside parts, not missing parts.** The gaps are the small-team authority check (`bots answer` never asks who may answer), the shared-host mode (deferred by every phase), and prompt injection (no phase addresses it). Each is a requirement inside a part the packet already builds, so closing them is three edits rather than a twelfth phase. [SOURCE: `001-activity-and-actor/spec.md`, `spec.md:94`, `005-memory/spec.md:94`]

5. **Overbuild verdict: phase 011 is the only phase whose scope can be cut by more than a third without losing a 002 item.** Cutting four of its five transports, folding its queue into `request-queue.ts` and shrinking its message model to a transport envelope removes three modules and a test file's worth of wire cases. Every other phase's overbuild is a single module or a single lift, and each is P2. [SOURCE: `011-messaging-channels/plan.md:3,66,69,70`]

6. **What this review could not see, stated so the verdict is not read as wider than it is.** The eleven phases' `tasks.md` and `acceptance-criteria.md` were read only where a finding needed them, so a defect that lives only in a task list is missing. The reference repos beyond OpenBot's docs were read only where a phase cited them. The runtime's `tests/` were read for the shapes a plan assumes, not for coverage. And no phase was built, so every "cannot pass" claim rests on reading the requirement against the runtime, not on running it. [INFERENCE: from the Sources Consulted sections of iterations 1 through 12]

## Ruled Out

- **Calling the packet unbuildable.** The order is sound, the runtime shapes are mostly matched, and the parity coverage is complete. Three P0s and nine one-line edits is a day's work, not a redesign.
- **Calling the packet build-ready with caveats.** Two of the three P0s make a phase's own Definition of Done unreachable, which is the definition of not build-ready.
- **Recommending a twelfth phase for the three parity gaps.** Each is a requirement inside a part the packet already builds; a new phase would add a dependency edge for no capability.
- **Recommending the transport cut as a condition of building.** It is a scope decision for the operator, not a blocker; 011 builds as written, it just builds four adapters nobody asked for.

## Dead Ends

- **Looking for a fourth P0.** The sweep in iteration 9 covered every phase's Definition of Done for version and count assertions and found one instance, already recorded. The other two P0s came from cross-document reads, not from a DoD sweep.
- **Looking for a phase that cannot start at all.** Only 003's DoR is circular, and it is a one-line fix.

## Edge Cases

- **Ambiguous input:** "build-ready" could mean ready to start or ready to finish. The verdict answers both: 001 can start today, and the packet can be finished after the three P0s.
- **Contradictory evidence:** none new. The three P0s are contradictions between two documents each, and both sides are cited in iterations 1, 9 and 11.
- **Missing dependencies:** none.
- **Partial success:** the verdict rests on reading, not on building. No phase was implemented, so a defect that only appears at build time would not be in this review.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-2/findings-registry.json` (52 `keyFindings`)
- `specs/system-skilled-bots/003-openbot-parity-build/research/lineages/vibe-2/iterations/iteration-001.md` through `iteration-012.md`
- `specs/system-skilled-bots/003-openbot-parity-build/spec.md:94,119-131`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:164`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147`
- `specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:94`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:3,66,69,70`
- `specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:281`

## Assessment

- New information ratio: 0.20 (the verdict, the per-phase gate table and the "what this review could not see" section are new; the findings they rest on are not)
- Questions addressed: F-1-004, final pass
- Questions answered: the build-readiness verdict

## Reflection

- **What worked and why:** turning the findings into a per-phase gate table is what made the verdict actionable. A severity count says how bad it is; a gate table says what to do before each phase starts.
- **What did not work and why:** the first draft of the verdict was "not build-ready", which is true and useless. Naming the three P0s and the nine one-line edits turned it into a plan.
- **What I would do differently:** build the gate table from iteration 1, adding a row per phase as findings land. It is the artifact a builder actually uses, and it was the last thing produced.

## Recommended Next Focus

None. The run has reached its iteration cap with the deliverable complete: the ranked per-phase findings, the cross-phase conflict list, the spec-edit list and the build-readiness verdict.

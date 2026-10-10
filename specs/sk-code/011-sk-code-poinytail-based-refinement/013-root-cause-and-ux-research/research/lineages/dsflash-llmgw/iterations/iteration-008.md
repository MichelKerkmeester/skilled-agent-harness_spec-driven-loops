# Iteration 8: The external-user lens, second half — versions, slow hosts, routing and error messages

## Focus

Part 3's second half: version numbering and changelog collisions seen from a fork, hook timing on slower hosts, routing surprises, and error messages that do not say what to do. Includes one live observation from this run: the pi dispatch guard refused a read-only test command with an opaque reason.

## Actions Taken

1. Checked the changelog generator for any version-uniqueness or upstream check.
2. Re-read the hook deadline loss from the operator's side and searched for any user-visible signal when a payload arrives late.
3. Read the pi dispatch preflight lint's deny branches and reproduced its ambiguous-branch refusal live (a `TMPDIR=... node --test ...` command was blocked during iteration 3).
4. Compared error-message quality across the guards already read this run (compiled-route guard, doc-claims checker, doctor routes, gateway refusals).

## Findings

1. **Version minting has no uniqueness check at mint time; the collision only surfaces at merge, so a fork tracking upstream meets it too.** `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` contains no exists/duplicate/upstream check for the version it writes (a search for `already exists`, `EEXIST` and upstream comparisons returns nothing); the version in the file name is decided by the caller's context. That is how main and the epic branch both minted `v2.7.1.0` and why the merge had to renumber one side into `v2.7.2.0`. An adopter whose branch lives long enough for upstream to publish the next number faces the identical merge. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18] [SOURCE: git:144b1d339e] — **CONFIRMED** (read; no check exists). **P1 by external-user impact**: user-visible routing metadata collides. **Smallest fix**: one rule in the changelog authoring contract and one read of `origin/main`'s changelog before minting; no new service (carried from iteration 2).

2. **A slower host loses hook payloads silently, and nothing on the user's side records that it happened.** The short-deadline readers settle at 500 ms and take their empty-payload answer; an empty payload is indistinguishable from a normal empty input, so a missing session context or advisor injection leaves no trace. The hooks README explains the deadline but not the late-write loss; the loss is recorded only in a packet's Known Limitations. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:4] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/README.md:88] — **CONFIRMED** (read; no signal exists). **P1**: the user cannot tell why context is missing. **Smallest fix**: one sentence in the hooks README stating that a payload written after the deadline is dropped, plus the late-write test from iteration 5; no logging layer.

3. **Error-message quality is bimodal: the repo has exemplary refusals, and the pi dispatch denial is the outlier that names nothing.** The compiled-route guard prints the exact re-mint command, the doc-claims checker returns a usage line for a bad `--root`, doctor routes name their repair, and the append gateway's refusals carry phase and reason codes. Against that standard, the pi preflight lint's ambiguous branch blocks with "Pi dispatch denied: the command does not prove one direct executor." — no offending shape, no acceptable shape, no next step — while its sibling branch for a known executor does say what to do ("Name the matching executor in the user request"). This run hit the ambiguous branch live: a `TMPDIR=... node --test ...` read-only command was refused. [SOURCE: .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:249] [SOURCE: .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:257] [SOURCE: .skilled/bin/compiled-route-guard.cjs] — **CONFIRMED** (read both branches; observed the refusal live). **P1**: an opaque refusal blocks legitimate work and teaches users to work around the guard. **Smallest fix**: extend the ambiguous-branch string by one clause naming what makes a command direct (one executor invocation, no composition), or reuse the executor-naming sentence; one string in one file.

4. **Routing surprises are documented where the user is not looking.** The surface tie order is stated in the hub `SKILL.md`, the hint that would change it exists but is unpassed, and a legacy fallback marks itself in the payload (`servingAuthority: legacy`) — yet the advisor's recommendation output shows a bundled surface order with no marker that it is a fixed fallback rather than a decision about the user's session. [SOURCE: .skilled/skills/sk-code/SKILL.md:74] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:372] — **CONFIRMED** (read; connects iterations 4 and 7). **P2**. **Smallest fix**: none beyond passing the hint (iteration 4) — with the hint, the order reflects the session and the surprise disappears.

5. **Half-applied runtime state is a designed recovery path, not a risk: the append gateway, ledger and projection let a run be audited, resumed or rebuilt after a crash from the ledger alone.** The README states the contract and the gateway implementation backs it (authorize, fence, receipt, refresh). [SOURCE: README.md:604] [SOURCE: README.md:606] — **CONFIRMED** (read; exercised in this run: every iteration record went through the gateway and the projection refreshed). **P2**. **Smallest fix**: none.

## Ruled Out

- **A per-hook telemetry counter for dropped payloads.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: the failure needs a measured host latency and a test first; a counter adds state and a new failure mode to hooks that must fail open. The README sentence plus the test is the smallest complete step.
- **Rewording every guard message into a shared template.** Rejected: the exemplary messages already differ by context and a template would flatten the phase/reason codes the gateway relies on; only the one outlier needs a clause.

## Dead Ends

- The pi guard's inspector (`kind` classification) was not traced to the exact rule that classified `TMPDIR=... node --test ...` as ambiguous; the refusal itself is the evidence, and the fix is on the message side regardless of which rule fired.

## Edge Cases

- Ambiguous input: "error messages that do not say what to do" invites a repo-wide audit; this iteration audits only the paths an external user actually walks and the one refusal observed live, leaving the rest to the phase if it wants coverage.
- Contradictory evidence: none; the pi guard's two branches are internally inconsistent in helpfulness, which is the finding.
- Missing dependencies: none.
- Partial success: the second half is answered at the evidence level; the pi inspector rule remains untraced. `Status: complete`.

## Questions Answered

- Q9 (second half): version numbering, hook timing on slower hosts, routing surprises and error messages — answered; combined with iteration 7, Q9 is answered end to end.

## Questions Remaining

- Q10.

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts (no uniqueness check; repo-wide search for already exists/EEXIST empty)
- .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18
- git:144b1d339e
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:4
- .skilled/skills/system-spec-kit/runtime/hooks/README.md:88
- .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:236,249,257
- .skilled/bin/compiled-route-guard.cjs
- .skilled/skills/sk-code/SKILL.md:74
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:372
- README.md:604,606
- Live observation: `TMPDIR=... node --test ...` denied with the ambiguous-branch reason during iteration 3

## Assessment

- New information ratio: 0.8
- Questions addressed: Q9
- Questions answered: Q9

## Reflection

- What worked and why: the live denial in iteration 3 became evidence when this iteration read both deny branches; reading the guard's own code made the message gap concrete rather than anecdotal.
- What did not work and why: the exact ambiguous-classification rule was not traced; the finding holds on the message asymmetry and the observable refusal.
- What I would do differently: capture guard refusals verbatim as they happen — this one was nearly lost as unrelated friction.

## Recommended Next Focus

Iteration 9: cross-cutting verification and gap-fill — re-confirm at least one claim from each earlier iteration with a fresh read or run, check that every finding carries a path:line and a CONFIRMED/INFERRED mark, and open any angle the brief names that the ten-part map still shows untouched, before iteration 10 closes consolidation.

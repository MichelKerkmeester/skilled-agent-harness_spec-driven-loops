# Iteration 10: Consolidation — ranked phases against cost, with the restraint check applied

## Focus

Q10: which smallest fixes survive `.skilled/repo-rules/prevent-overengineering.md`, and how do they rank as implementation phases by external-user impact against cost. This iteration assembles the confirmed findings from iterations 1 to 9 into phases, applies the reversal-cost order to each proposed fix, and names the one file and one proving command per phase. The synthesis that follows this iteration lifts these phases into `research.md`.

## Actions Taken

1. Re-read `.skilled/repo-rules/prevent-overengineering.md` and applied its reversal-cost order (build nothing → change a value → extend in place → new function → new file → abstraction → dependency) to every candidate fix.
2. Ranked every confirmed finding by external-user impact against the cost of its smallest fix.
3. Checked each phase for an existing proving command or test suite, preferring an existing one.
4. Recorded the rejected and deferred ideas with their reasons.

## Findings

1. **Phase 1 — Pass the session surface hint at the advisor's compiled-route call.** One file: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`. The handler already spawns the front door per eligible recommendation and the front door already parses `--surface-hint`; the fix is one argument at the existing call site, using the detection contract the hub already publishes. Proving command: the advisor compiled-route handler suite (`.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts`) plus the existing surface-hint tests. Restraint check: change an existing call (reversal cost: one line); no new layer, no new dependency. External-user impact: removes the fixed surface order from every multi-surface recommendation. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:372] [SOURCE: .skilled/bin/compiled-route.cjs:36] — **CONFIRMED**.

2. **Phase 2 — De-pin the hub count in the compiled-route manifest test.** One file: `.skilled/bin/tests/compiled-route-manifest.test.cjs`. Replace `all 6 hubs` with the count-agnostic shape the CLI already prints (`all \d+ hubs resolve`) at its seven sites, so the suite follows the hub list instead of a literal. Proving command: `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` (expect the previously failing tests to pass; the suite writes its sandboxes under `.skilled/bin/tests/.sandboxes` by design). Restraint check: change a value (reversal cost: one regex revert); nothing new. External-user impact: clears the largest red block in the adopter's test surface (16 of 42 tests). [SOURCE: .skilled/bin/tests/compiled-route-manifest.test.cjs:162] [SOURCE: .skilled/bin/compiled-route-sync.cjs:1020] — **CONFIRMED**.

3. **Phase 3 — Re-pin the live corpus count and rerun the baseline report it guards.** One file: `.skilled/bin/tests/compiled-route-admission.test.cjs`. Set `LIVE_CORPUS_SIZE` from 80 to the measured 86 and rerun the admission baseline report the comment requires. Proving command: `node --test .skilled/bin/tests/compiled-route-admission.test.cjs` (expect `tests 29`, `pass 29`, `fail 0`) followed by the report regeneration the comment names. Restraint check: change a value; the pin stays a change-detector, now current. External-user impact: clears the last known red test in the routing family. [SOURCE: .skilled/bin/tests/compiled-route-admission.test.cjs:32] [SOURCE: command: counted 86 across DEFAULT_ON_HUBS] — **CONFIRMED**.

4. **Phase 4 — Remove the stale `jev-transport-single` case from the cli-external fixture.** One file: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json`. Delete the case; the cli-classifier fixture's `jev-choice-single` already covers the same prompt in the hub that owns the destination. Proving command: the hub's canary harness evaluating the fixture (the case no longer reports defer against an expectation of route). Restraint check: build nothing new — remove a dead case; the successor exists. External-user impact: no permanent red canary to teach adopters to ignore failures. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json:6] — **CONFIRMED**.

5. **Phase 5 — Give the pi ambiguous-branch denial a next step.** One file: `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`. Extend the ambiguous-branch reason with one clause naming what makes a command direct, mirroring the sibling branch's sentence. Proving command: a focused case driving `shouldDenyPiDispatch` with an ambiguous command and asserting the new text (the extension's test surface; a behavior change carries one case). Restraint check: change a string in place; no new guard, no new option. External-user impact: an opaque refusal that blocks legitimate work becomes actionable. [SOURCE: .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:249] [SOURCE: live observation: this lineage's own env-prefixed node command was refused with that message] — **CONFIRMED**.

6. **Phase 6 — Surface the git-hooks trust state where it silently disables enforcement.** One file: `.skilled/scripts/git-hooks/pre-commit`. In the untrusted branch, when the repository carries its own `.skilled/scripts/install-git-hooks.sh`, print one stderr line naming `git config --local skilled.trustRepoHooks true`; unrelated repositories keep the current silence. Proving command: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` with one case for the untrusted-toolchain fixture and one for a foreign repository. Restraint check: extend an existing branch; the silence for foreign repos is preserved deliberately. External-user impact: a second clone stops committing with invisible gate loss. [SOURCE: .skilled/scripts/git-hooks/pre-commit:44] [SOURCE: README.md:197] — **CONFIRMED**.

7. **Phase 7 — Pin the late-write loss with one test case.** One file: `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`. Add a case that writes a short-deadline entry's payload after ~800 ms and asserts the observed outcome, so the drop is visible and the semantics decision (keep-drop or first-byte deadline) becomes deliberate. Proving command: `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`. Restraint check: add one case to an existing suite; no production change until the test says which one. External-user impact: turns a silent context loss into a documented, testable behavior. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs:225] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md:4] — **CONFIRMED**.

8. **Phase 8 — Align the Node floor with the dependency floor.** One file: `.skilled/skills/system-spec-kit/package.json` (with the matching README line as the doc half). Set `engines.node` to `^20.19.0 || >=22.12.0`, the floor npm actually enforces through the lockfile, and update the README's prerequisite line to match. Proving command: `npm --prefix .skilled/skills/system-spec-kit install --dry-run` on a Node below the floor (reports the engine refusal) and a normal install on a supported Node. Restraint check: change two values; no tooling. External-user impact: the first command in an adopter's session stops contradicting itself. [SOURCE: README.md:160] [SOURCE: .skilled/skills/system-spec-kit/package.json:11] [SOURCE: .skilled/package-lock.json:200] — **CONFIRMED**.

## Rejected and Deferred (restraint record)

- **Rejected — a repository-wide linter for `String.replace` string replacements.** Both known live sites are already fixed; a scanner would have no failing caller today.
- **Rejected — a version-reservation service or lock for changelogs.** The collision is rare, both sides can read `origin/main`, and the smallest fix is a contract rule plus that read.
- **Rejected — a scratch-lifecycle manager, a residual tracker, a cross-suite pin registry, a guided installer.** Each adds a layer whose job the existing convention or an edit already does.
- **Deferred — the HVR sweep of the hub `SKILL.md` (36 punctuation blockers).** Mechanically small but it rewrites the always-loaded document's punctuation; defer behind the P1 phases and land it as a lone doc pass with the scanner as the proof.
- **Deferred — the advisor battery signal additions.** They change a shared scoring surface and belong to the advisor's owner; the rerun command is the battery itself.
- **Deferred — the deadline semantics change (first-byte timer).** Wait for Phase 7's test and a measured host write latency, then decide with evidence.
- **Deferred — the P2 residuals from iteration 9** (F### id-scheme matching, archived route-gold refresh, quality playbook Obsidian scenario, alias over-capture) — recorded for later passes, not user-blocking today.

## Edge Cases

- Ambiguous input: "implementation phases" could mean build phases of this research or of the fixes; the brief asks for the fixes, ranked by external-user impact, and that is what was produced.
- Contradictory evidence: none; every phase cites a confirmed finding from iterations 1 to 9.
- Missing dependencies: Phase 5's proving command depends on a test surface for the pi extension; if none exists, the case is added with the change — noted in the phase.
- Partial success: phases are proposals for a later implementation track; this iteration implements nothing. `Status: complete`.

## Questions Answered

- Q10: Which smallest fixes survive the prevent-overengineering rule and how do they rank as implementation phases by external-user impact against cost? — answered (findings 1 to 8 plus the restraint record).

## Questions Remaining

- None.

## Sources Consulted

- .skilled/repo-rules/prevent-overengineering.md:1-80 (reversal-cost order and firing conditions)
- Every source cited by the eight phase findings (see each finding)
- Iteration narratives 1 to 9 of this lineage

## Assessment

- New information ratio: 0.6 (consolidation; no new external evidence)
- Questions addressed: Q10
- Questions answered: Q10

## Reflection

- What worked and why: ranking by external-user impact against reversal cost placed the one-argument and one-value fixes ahead of the visible-but-lower-impact doc work, and the existing provers made each phase testable without new machinery.
- What did not work and why: three fixes share one theme (frozen pins) yet touch three files, so they were split into three phases to honor one-file phases; the slight inflation is the cost of that constraint.
- What I would do differently: keep a running phase-candidate list from iteration 3 onward, so consolidation verifies rather than assembles.

## Recommended Next Focus

None — the ten iterations are complete. Phase synthesis writes `research.md`, the resource map, the findings registry and the dashboard, records the terminal synthesis event with `stopReason: maxIterationsReached`, and verifies every artifact.

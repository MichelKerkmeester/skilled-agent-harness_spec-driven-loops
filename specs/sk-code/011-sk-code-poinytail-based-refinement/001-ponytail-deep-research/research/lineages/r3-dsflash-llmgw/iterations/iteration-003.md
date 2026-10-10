# Iteration 3: Shared workflow doctrine against the repository rules

## Focus

Part 1, third slice: the three shared workflow doctrine files (`workflow-implement.md`, `workflow-debug.md`, `workflow-verify.md`) and the two universal checklists against `.skilled/repo-rules/root-cause-and-debugging.md` and `.skilled/repo-rules/evidence-and-proof.md`. The steer asks where one side should point to the other instead of restating it, and whether any restatement has already diverged. This follows iteration 2's Recommended Next Focus.

## Actions Taken

1. Read the full workflow trio and `universal-debugging-checklist.md`.
2. Read the two repo rules that own the same floors: `root-cause-and-debugging.md` and `evidence-and-proof.md`.
3. Pair-matched every overlapping obligation (reproduce, trace to source, one cause, re-run the gate, baseline, negative control, whole-gate re-run) and tested each pair for agreement.
4. Tested the one copy that claims to carry an authoritative exit-code contract — `workflow-verify.md`'s `validate.sh` paragraph — against `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`, which names itself the owner of that meaning.
5. Checked the seven-rung ladder summary in `workflow-implement.md` against the ladder in `code-quality-standards.md`.

## Findings

1. **`workflow-verify.md` carries a wrong `validate.sh` contract, and it contradicts the document that owns that contract.** The shared file says warnings "only become a failing validation outcome under `--strict`, which exits `2` unless the folder is grandfathered" [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:86]. The authoritative taxonomy says the opposite: "a warning stays advice in both modes and never changes the exit code. A rule that should block reports an error itself" [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:44], and the only path where a warn becomes an error is the `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` flag, "and only then does `--strict` exit 2" [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:159]. The same document states plainly that it owns this meaning and that "a copy kept anywhere else goes stale the first time the harness moves" [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:835]. The shared copy has already gone stale. Reproducing case: `rg -n "warning stays advice" .skilled/skills/system-spec-kit/references/validation/validation-rules.md` and `rg -n "only become a failing validation outcome" .skilled/skills/sk-code/shared/references/workflow-verify.md` print two claims that cannot both be true; an operator following the shared file would read a strict run's warn-only output as a failure (or a failure as a warn) on the sk-code OpenCode route that loads this file. NEW, P1.
2. **The shared workflow trio and the repo rules carry the same floors twice with no pointer either way, and nothing checks that the copies agree.** The mapped pairs: reproduce-then-trace-to-source and one-cause-at-a-time in `workflow-debug.md:50-57` [SOURCE: .skilled/skills/sk-code/shared/references/workflow-debug.md:50] against the same loop in `root-cause-and-debugging.md:52-61` [SOURCE: .skilled/repo-rules/root-cause-and-debugging.md:52]; baseline/current/delta in `workflow-verify.md:101-112` [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:103] against `evidence-and-proof.md` §5 [SOURCE: .skilled/repo-rules/evidence-and-proof.md:124]; the mutation-check/negative-control ritual in `workflow-verify.md:125-127` [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:127] against `evidence-and-proof.md` §4 [SOURCE: .skilled/repo-rules/evidence-and-proof.md:117]; and the pre-write restraint paragraph in `workflow-implement.md:66` [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:66] against `prevent-overengineering.md` and the `AGENTS.md` §3 restraint table. Today every pair agrees in substance (checked; see Finding 4), but the two tiers load under different triggers — the shared files on code routes, the rules on write triggers — so a future edit to one side can diverge unseen, exactly as Finding 1 already happened once. The cheapest repair is one direction of pointers: the repo rules own the floors (they are the routed, framework-level contract) and the shared workflow files keep only the sk-code mechanism plus a one-line pointer for each repeated obligation. Reproducing case: `rg -n "Reproduce the exact symptom" .skilled/repo-rules/root-cause-and-debugging.md .skilled/skills/sk-code/shared/references/workflow-debug.md` prints near-identical obligations in both, and no pointer sentence exists in either file. NEW, P2 (duplication with a live divergence precedent, not a behavior bug today).
3. **The shared doctrine files carry surface-conditioned subsections even though the hub's own purity rule says shared material must never gain them.** `workflow-implement.md:78-84` and `workflow-verify.md:76-99` each embed "OpenCode Surface Only" contracts — this repository's `generate-context.js` writer rule, the `sk-git` boundary, and the `validate.sh`/`tsc`/rebuild-native command chain [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:78] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:76] — inside files that are symlinked into all three surfaces [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/workflow-verify.md]. The hub states that shared backend material "must never gain per-mode workflow contracts" [SOURCE: .skilled/skills/sk-code/SKILL.md:163], and the OpenCode surface already owns a shared tier of its own (`sk-code-opencode/references/shared/alignment-verification-automation.md`) where such contracts can live [SOURCE: .skilled/skills/sk-code/sk-code-opencode/SKILL.md:43]. Either the subsections move to that tier, or the hub sentence should acknowledge surface-conditioned doctrine. Reproducing case: `rg -n "OpenCode Surface Only" .skilled/skills/sk-code/shared/references/` prints four hits inside the supposedly surface-agnostic tier. NEW, P2.
4. **The two cross-file agreements that matter most both hold.** The seven-rung ladder summary in `workflow-implement.md:66` matches the ladder in `code-quality-standards.md:46-52` rung for rung, including the reuse rung and the "never cuts a P0 item" tail [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:66] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:46]; and every repo-rule pair in Finding 2 agrees in substance today (reproduce, trace, one cause, whole-gate re-run, baseline, negative control). ALREADY-ADOPTED, P2, no action beyond Finding 2's pointer proposal.

## Questions Answered

- None fully. Key question 2 (which shared references duplicate or conflict with the repo rules) now has its first concrete conflict: Finding 1 names a shared/authority contradiction, and Finding 2 maps the duplication set.

## Questions Remaining

- Which side should own each duplicated floor once a pointer pass is designed — the repo rule, the shared file, or a pinned parity check?
- Do the surface packets (`sk-code-opencode/references/shared/*`, `sk-code-webflow/references/shared/*`) restate any of the same floors a third time?

## Ruled Out

- **"Report the whole duplication set as a defect."** The floors are deliberately restated at the code-route tier; only the divergence (Finding 1) and the missing pointers (Finding 2) are defects. Filing the restatement itself would contradict round two's "already stronger than Ponytail" closure rows.
- **"Call the three-strike count a conflict between `root-cause-and-debugging.md` and the shared files."** The repo rule explicitly sets the stop on repetition-without-evidence and says the count is set outside the file [SOURCE: .skilled/repo-rules/root-cause-and-debugging.md:87]; `AGENTS.md` §3 owns the count and the shared files restate it. Compatible, not contradictory.

## Dead Ends

- `universal-debugging-checklist.md` and `workflow-debug.md` cross-reference each other cleanly ("use the checklist as the detailed walk-through") [SOURCE: .skilled/skills/sk-code/shared/references/workflow-debug.md:59]; no duplication defect between those two.
- `workflow-implement.md`'s OpenCode guardrails do not collide with any repo rule; the only tension is the hub purity sentence, filed as Finding 3.

## Edge Cases

- Ambiguous input: whether a near-identical obligation is "the same floor restated" or "a legitimate route-tier summary". Chosen interpretation: substance-identical and trigger-different means duplication; used that rule to scope Findings 1 and 2.
- Contradictory evidence: Finding 1 is the one true contradiction; both sources were read in full before filing.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/shared/references/workflow-implement.md`
- `.skilled/skills/sk-code/shared/references/workflow-debug.md`
- `.skilled/skills/sk-code/shared/references/workflow-verify.md`
- `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`
- `.skilled/repo-rules/root-cause-and-debugging.md`
- `.skilled/repo-rules/evidence-and-proof.md`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`
- `AGENTS.md`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.88 (three fully new findings, one ALREADY-ADOPTED agreement check).
- Questions addressed: key question 2 (first slice).
- Questions answered: none.

## Reflection

- What worked and why: reading the self-declared owner of the disputed contract (`validation-rules.md`) before accepting either side. Its ownership sentence plus its taxonomy turned a vague wording worry into a source-backed contradiction.
- What did not work and why: the first pass treated the duplication set as one finding; splitting the true contradiction from the duplication pattern was necessary because they have different fixes and different priorities.
- What I would do differently: extract the shared file's claims into a checklist first, then verify each against its authority, instead of pair-matching file-by-file.

## Recommended Next Focus

Surface detection edge cases: mixed stacks, monorepos, and two-surface matches, plus what each surface packet overrides from the shared standards — the next unclaimed slice of Part 1.

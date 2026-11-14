# Review Iteration 002 — Traceability

## Dispatcher

- Mode: review (deep-review LEAF iteration, detached fan-out lineage `scorer-attach-close-4c`).
- Iteration: 2 of 3.
- Run: `fanout-scorer-attach-close-4c-1794682797954-pcdanq`, generation 1, lineageMode `new`.
- Budget profile: `scan` (document reads plus one line-number verification).
- Sources read: `iterations/iteration-001.md` (own prior pass), `review/review-brief-4c.txt:1`, `027-review-pass-four-remediation/spec.md:195-205,239,244-252,279,356,378-390`, `027-review-pass-four-remediation/tasks.md:57-82`, `027-review-pass-four-remediation/acceptance-criteria.md:56,61`, `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33`, `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:44,65`, `.skilled/skills/system-skill-advisor/README.md:67-76,122`, `git show 48f03b5013:…/command-attach.ts` and `git show 11af224a34:…/command-attach.ts` for the line-number check. `steer.md` is still absent.
- Operator review focus: the closing round of review pass four. This iteration addresses it by testing the one check in the brief that is documentary — "docs agree with code" — against the code the previous iteration confirmed at the CLI.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:195-205,239,244-252,279,356,378-390`.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/tasks.md:80-82`.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/acceptance-criteria.md:56,61,70`.
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33`.
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:44,65`.
- `.skilled/skills/system-skill-advisor/README.md:67-76,122`.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:376-380,405-412` and the same region at the two prior commits.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. SAC4C-P1-001 from iteration 1 remains active.

### P2 Findings

1. **The remediation spec still calls the question-over-an-or-list unreproduced and out of scope, and describes the carry as decline-only** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation/spec.md:239` -- the Out of Scope line reads "An or-list joined by `and`, `nor` or a bare comma, and a question over an or-list - no probe reproduced them (P049)", but T029 was added after SAC4B-P2-001 reproduced that case and the shipped code now withholds the command. Assumption A3 (`:384`) repeats "applies to the decline leads only", the Files-to-Change row (`:248`) says "The or-list carry for the decline leads", and REQ-001 (`:279`) still enumerates only the three single-word refusals, so neither the requirement nor the scope text covers the article and question forms T028 and T029 added. The mechanism row (`:201`) also points at `command-attach.ts:405`, which is `:412` after T028's insertion, so the pointer no longer resolves to `commandOnlyMentioned`.
   Finding class: doc-drift.
   Scope proof: those are the spec's only statements about the or-list carry, and the implementing code sits at `command-attach.ts:427-439` with the added rows at `command-attach-guards.vitest.ts:160-174,209-215`; T029 (`tasks.md:82`) states the question carry was required after the confirming round.
   Affected surface hints: `027-review-pass-four-remediation/spec.md` REQ-001, Out of Scope, Files to Change, A3, mechanism row; `027-review-pass-four-remediation/acceptance-criteria.md` AC-001 and AC-006 wording. No code is affected.
   Case: A reader planning or verifying from the spec is told `should I run /create:agent or /create:readme?` was never reproduced and is out of scope, while the CLI withholds `/create:readme` for it (iteration 1 probe), so the spec and the code disagree on what this phase covers.

## Traceability Checks

- `spec_code`: **partial**. Every code claim in the brief's check list that iteration 1 could execute holds except the two-word item (SAC4C-P1-001). The written alignment fails in one direction: the phase spec's scope text and REQ-001 lag the implemented question carry (finding 1). Implementation evidence is authoritative, so this is recorded as a documentation defect, not as a behaviour failure.
- `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are `[x]` and their evidence matches the code, diff and test rows exactly. AC-001 and AC-006 read `Unmet`, which AC-011 (`acceptance-criteria.md:66`) makes expected until this confirming round closes; not drift.
- `feature_catalog_code`: **pass**. `advisor-recommend.md:33` describes `attachCommand`'s route/selection/table conditions and the deep-loop depth gate, and makes no claim about refusals or or-lists, so the fix leaves it accurate. `command-meaning-matching.md:44,65` and the README's scoring rows do not describe the mention grammar either; no sentence there contradicts the code.
- `skill_agent`, `agent_cross_runtime`, `playbook_capability`: **notApplicable** for this lineage's scope.

## Integration Evidence

- The five documents AC-010 names are unchanged by this commit and are unrelated to the or-list grammar, so the doc fix belongs to the spec packet, not the skill docs.
- T028's and T029's test rows are present verbatim in the guards file, and the task evidence counts (138 of 138 after T028, 142 of 142 after T029) match the nine added rows.

## Edge Cases

- **Stale line pointer**: `spec.md:201` cites `command-attach.ts:405`, which was correct at `11af224a34` (`git show` puts the function at :405) and moved to :412 when T028 grew the constant's comment by seven lines. Folded into finding 1; not raised separately because the spec's line pointers are descriptive prose, not SOURCE tags.
- **AC status**: all twelve AC rows read `Unmet` in this packet, so an "Unmet" row is not itself evidence of drift in this round; AC-011 is the closeout gate.
- **Requirement scope**: REQ-001 is not false — the three refusals it names do behave as written — so the finding is phrased as an incomplete spec, not a contradiction of behaviour.

## Confirmed-Clean Surfaces

- The README changes in this commit (`:67-76`, `:122`) belong to the accuracy-runner row and describe the run-log fields; they agree with the code read in iteration 1 and are left to the sibling lineage for grading.
- `advisor-recommend.md:33` remains an accurate description of `attachCommand` after the change.
- The commit's test additions match T028 and T029 row for row, with no rewritten existing expectation.

## Ruled Out

- **A hub-level regression test is missing for the article and question forms**: `attachCommand` consults only `commandOnlyMentioned` for a mention, and that predicate is pinned per form; the existing `offers no hub command for %s` row exercises the same branch, so a second row would add no distinct failure mode. Recorded as coverage commentary, not a finding.
- **A changelog entry is missing**: T029's scope and the phase's Out-of-Scope line assign release notes to phase 025, so no entry is expected here.
- **The README's four-field sentences are wrong**: they match `backfillRunLog`/`offerLineFields` behaviour as read, and the row belongs to the sibling lineage; not re-raised.
- **The stale `:405` pointer alone**: too low-value to raise separately; carried inside finding 1.
- **The holdout corpus is involved**: no prompt file was opened; only code, packet docs and the CLI were read.

## Next Focus

- Dimension: maintainability with a security cross-reference.
- Focus area: the constant's comment against the grammar, the four `${COMMAND_OR_LIST}` insertions, the regex backtracking bound on an untrusted prompt, and whether the two-word gap is visible from the comment or the tests.
- Reason: correctness and traceability are covered; the last iteration should close the comment/test maintenance surface and rule the regex out as an input-handling risk before synthesis.
- Rotation status: correctness and traceability complete; maintainability final.
- Blocked/productive carry-forward: doc-line verification was productive; the real-module probe stays available if a comment claim needs executing.
- Required evidence: comment lines against regex behaviour, and a bounded-backtracking argument with the repeated-group shape.
- Recovery note: none.

Review verdict: CONDITIONAL

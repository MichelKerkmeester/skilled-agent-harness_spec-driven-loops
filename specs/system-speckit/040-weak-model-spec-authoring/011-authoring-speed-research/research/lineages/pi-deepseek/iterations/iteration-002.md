# Iteration 2: Validation gates and their fix loops

## Focus

Which validation gates and their fix loops consume the most per-edit iteration time, and what does each gate buy in quality? Inventory the rule set, price the fix loop, and check whether the gate actually catches the failure mode that recurs.

## Actions Taken

- Counted the validator rule registry by category, severity and strict-only membership, and recorded the rule ids in the two upkeep categories.
- Read the validator entrypoint's own help contract, which derives its rule listing from that registry.
- Read packet 054 phase 003 and phase 004 for the measured placeholder and fill-guidance facts, and phase 009 for the before/after authoring measurements.
- Extracted the benchmark report's per-set tables, including the deciding set's wall-clock delta and the anchor contract the packets are scored against.
- Read the authoring card's VALIDATE, CLOSE and stop-and-ask sections for the documented fix loop and its escape valves.

## Findings

1. The author-facing rule set is 41 rules: 22 `authored_template`, 13 `operational_runtime`, 6 metadata `structural`; 32 are error severity, 7 warning, 2 info, and only 3 are strict-only, so almost every rule fires on a plain validation run. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]
2. Validator runtime is not where the time goes: the strict path was measured at about 108 ms for a fresh Level 3 packet, so the cost is the number of round trips through it, not the check itself. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:821]
3. The documented fix loop has no cheap termination: the authoring card says to fix one rule, re-run, and stop only after three fixes on the same rule, which bounds a single-rule failure at three validator cycles and leaves no guidance for a run that fails on six rules. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:145]
4. The gate passes documents that still hold every unfilled hint: phase 003 measured that a fresh Level 2 scaffold holds 97 bracketed hint occurrences and `validate.sh --strict` still prints `RESULT: PASSED`, because the placeholder rule is a warning while status is Draft. [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md:22]
5. The gate also does not check the failure that actually recurs: strict validation does not verify that required anchors are present, while the benchmark scores packets against a fixed anchor contract of 7 in `spec.md`, 14 in `plan.md`, 21 in `tasks.md` and 3 in `acceptance-criteria.md`, so 45 required anchor positions are enforced by review rather than by the validator. [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/implementation-summary.md:64] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:132]
6. That gap has a measured price: every measured run across four final sets passed strict validation, yet three of the four sets failed the missing-anchor criterion, and each round re-ran the whole brief three times before the cause was found. [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:26]
7. The largest measured authoring-speed win on record came from two fill-note sentences, not from removing a step: with an identical brief and identical measures, mean wall clock fell from 252.3 s to 193.7 s (a 58.7 s, 23% cut) after the `L3+` label fix and the `fix-completeness` note rewrite. [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:116] [SOURCE: .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md:16]
8. All three strict-only rules are exactly the post-edit upkeep rules (`CONTINUITY_FRESHNESS`, `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`), so the class of check that only fires when a document is edited after the fact is also the class most easily skipped, which sets up the metadata question for a later iteration. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1]
9. The card's validation loop encodes ceremony for small work: a change that needs a fifth plan step is supposed to stop and write an open question, so a small multi-file fix is pushed out of the fast path instead of being allowed to run lean. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:168]

## Questions Answered

- Which validation gates and their fix loops consume the most per-edit iteration time, and what does each gate buy in quality? Answered: the checks are milliseconds; the round trips and the review-only coverage gaps are the cost.

## Questions Remaining

- What the level-selection and required-section path costs on small work.
- What Verify clauses, acceptance criteria and the authoring card cost to author.
- Which derived-metadata refreshes are mandatory per edit.
- The final ranked change list.

## Ruled Out

- Treating `validate.sh --strict` passing as evidence of packet quality: two independent measured gaps (placeholder warnings at Draft, anchors not checked) put the recurring failure mode outside the gate.
- Measuring the fix loop by running the validator here: the packet's own validator is out of this lineage's write authority, so the loop is priced from the documented contract and the benchmark's round counts instead.

## Dead Ends

- Looking for a per-rule remediation table: no mapping from rule id to fix instruction exists in the authoring card, which is why a failure sends the author into the 42,755-byte validation reference.

## Reflection

**What worked and why**: reading the existing benchmark report before forming a hypothesis. It already carries the one wall-clock measurement this topic needs, and it contradicted the natural assumption that the validator's rule count is the cost.

**What did not work and why**: trying to price the fix loop by executing the validator. Write containment forbids it, and the attempt was wasted effort rather than a slow path.

**What I would do differently**: start from the measured reports in `benchmark/reports` and the phase implementation summaries, then use source reading only to explain the numbers.

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json
- .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh
- .skilled/skills/system-spec-kit/references/validation/validation-rules.md
- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
- specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/spec.md
- specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/spec.md
- specs/system-speckit/054-weak-model-spec-authoring/009-authoring-benchmark-and-closeout/implementation-summary.md
- .skilled/skills/system-spec-kit/benchmark/reports/2026-10-25--model-eval--authoring-baseline/README.md

## Recommended Next Focus

Iteration 3: price the authoring cost of the protection surfaces themselves: task `Verify:` clauses, `acceptance-criteria.md`, and the level-selection and required-section path for small work. Count how many Verify lines a level-3 packet needs, read the acceptance-criteria contract, and check `recommend-level.sh` scoring against a small change.

## SCOPE VIOLATIONS

- None executed. Validation was priced from the registry, the documented contract and the recorded benchmark runs because running the packet validator is outside this lineage's write authority.

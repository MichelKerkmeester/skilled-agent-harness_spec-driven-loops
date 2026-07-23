# Iteration 4: Adversarial Conformance Review and Corrections

## Focus

This iteration tried to falsify the five iteration-3 body cores against the exact live commands, their auto/confirm and presentation fixtures, all five mode contracts, the shared creation contract, registry/metadata, and current command-contract tests. The narrow goal was to retain evocative mode-specific briefs while removing authority leakage and lifecycle duplication, then turn the surviving design into an exact implementation-and-test sequence. [SOURCE: iterations/iteration-003.md:31-179] [SOURCE: deep-research-strategy.md:83-87]

## Actions Taken

1. Re-read the detached-lineage config, state, strategy, registry, and iteration 3; confirmed iteration 4, `progressiveSynthesis=false`, the write-once lineage boundary, and the single remaining shipping-sequence question. [SOURCE: deep-research-config.json:15-57] [SOURCE: deep-research-state.jsonl:8-10] [SOURCE: deep-research-strategy.md:22-29]
2. Compared every proposed core with all five exact command files, including argument hints, suffix behavior, cannot-run/defer semantics, sibling discrimination, mode mapping, visible output, and presentation ownership. [SOURCE: .opencode/commands/interface/design.md:1-86] [SOURCE: .opencode/commands/interface/foundations.md:1-80] [SOURCE: .opencode/commands/interface/motion.md:1-80] [SOURCE: .opencode/commands/interface/audit.md:1-80] [SOURCE: .opencode/commands/interface/design-reference.md:1-80]
3. Compared authority-bearing phrases with the hub, all five mode contracts, the mode registry, shared contract, command metadata, and all 15 current presentation/auto/confirm fixtures. [SOURCE: .opencode/skills/sk-design/SKILL.md:15-47] [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-164] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:14-206] [SOURCE: .opencode/skills/sk-design/command-metadata.json:1-907]
4. Inspected the two command-contract test suites and executed both together; all 15 tests passed, establishing the pre-rewrite baseline for route mappings, sibling tokens, choreography parity, output blocks, copied-taste rejection, nested-command rejection, evidence labels, and amendment behavior. [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:10-139] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:25-191] [SOURCE: command output `node --test ...`: 15 passed, 0 failed]
5. Re-checked OpenCode's current command documentation for file references. It proves that `@` includes file content automatically, but its only project example is `@src/components/Button.tsx`; it does not explicitly define whether `@./.opencode/...` is resolved from the project root, command-file directory, or process directory. [SOURCE: https://opencode.ai/docs/commands/#file-references] [INFERENCE: exact `@./` rooting remains a live-fixture question despite general include support]

## Findings

1. **The five cores survive as mode-specific missions and outcome constraints, but not as complete lifecycle prose.** Their mission, local field names, sibling discrimination, stable `workflowMode`, decisive quality rule, and command-specific artifact shape are public-command material. The repeated classification schema, assumption rule, grounding schema, common block list, targeted-revision rule, evidence ladder, mutation boundary, and handoff continuity are already normative in the shared contract and should not be restated. [SOURCE: iterations/iteration-003.md:37-178] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:40-52] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:78-98] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:130-205]
2. **The proposed typed-status phrase is a regression.** Every core ends with `STATUS=OK|DEFER|FAIL`, which drops the live and shared `STATUS=ASK MISSING=<input>` path. The corrected command text must preserve all four terminal status forms (`OK`, `ASK`, `FAIL`, `DEFER`) and use typed evidence level `blocked` for unavailable mandatory proof rather than inventing another terminal status. [SOURCE: iterations/iteration-003.md:57-59] [SOURCE: .opencode/commands/interface/assets/interface-design-presentation.txt:35-42] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:143-174] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:198-205]
3. **`:auto|:confirm` is the largest omitted controller contract, and command ownership currently conflicts with presentation ownership unless changed atomically.** The cores never state how suffixes are parsed or that confirm renders one consolidated prompt and waits, while the live files route to paired YAML fixtures and declare presentation assets the prompt/output source of truth. A literal-body rewrite must preserve suffix semantics and simultaneously reclassify presentations/YAML as non-normative execution fixtures or derived mirrors; adding prose to the wrappers alone would leave two competing prompt authorities. [SOURCE: .opencode/commands/interface/design.md:46-53] [SOURCE: .opencode/commands/interface/design.md:73-86] [SOURCE: .opencode/commands/interface/assets/interface-design-auto.yaml:5-9] [SOURCE: .opencode/commands/interface/assets/interface-design-confirm.yaml:21-33] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:14-16] [INFERENCE: wrapper-only insertion would contradict the current presentation-boundary declaration]
4. **The authority split mostly holds, with two load-bearing corrections.** Audit must say that review is non-mutating and accepted fixes go to `sk-code`; “audit mutation” is only a confirmation category retained by the generic shared contract, not authority for audit to edit files. Design-reference may write only through its owned extract-write-validate pipeline, and its body must explicitly state that only measured values enter token tables—“brief-provided” values stay prose-only—so provenance labels do not accidentally loosen the cardinal fidelity rule. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:166-175] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:242-246] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:263-274] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:304-324] [SOURCE: .opencode/skills/sk-design/mode-registry.json:103-143]
5. **A safe shipment is an evidence-gated, atomic command-package change, not five isolated Markdown edits.** First prove the exact include spelling in a scratch live command; then lock corrected body invariants in tests; then update the five wrappers plus their ownership declarations and only the fixture/metadata projections that must remain authoritative; finally run static contract tests, an include-expansion smoke fixture, five suffix/status fixtures, and mode-specific negative cases before accepting the rewrite. [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:28-109] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:31-76] [SOURCE: .opencode/skills/sk-design/command-metadata.json:24-170] [INFERENCE: the test graph reads wrappers, presentations, auto/confirm YAML, metadata, hub router, registry, and shared contract together, so partial edits are drift-prone]

## Adversarial Matrix

| Contract | Verdict | Correction / surviving rule |
|---|---|---|
| Public-command ownership | PARTIAL | Keep mission, command-specific intake fields, route/sibling/cannot-run controls, and artifact shape; delete copied universal schemas. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:14-16] |
| Mode-owned judgment | PASS | Outcome verbs may name palette/type/layout, static roles, temporal behavior, severity, or fidelity, but values, procedures, and verdicts remain in the selected packet. [SOURCE: .opencode/skills/sk-design/SKILL.md:190-202] |
| Transport ownership | PASS | “Retrieve/render/measure/capture only; never decide taste or acceptance” matches hub authority. [SOURCE: .opencode/skills/sk-design/SKILL.md:291-295] |
| `sk-code` mutation | PASS WITH AUDIT REWORD | Four advisory modes do not mutate; audit routes accepted findings only. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:176-196] |
| md-generator artifact-write exception | PASS WITH FIDELITY REWORD | Permit only the owned pipeline and declared output; only measured values enter token tables. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:242-258] |
| Progressive intake | FAIL AS WRITTEN | Keep per-command field names; move classification values, assumption schema, and bundle rule to `@` contract. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:78-98] |
| `:auto|:confirm` | FAIL AS WRITTEN | Add one literal controller sentence preserving forced confirm, consolidated wait, and bounded autonomous assumptions. [SOURCE: .opencode/commands/interface/assets/interface-design-confirm.yaml:21-25] |
| Cannot-run | PARTIAL | Keep command-specific cause, but missing required input normally uses `ASK`; use `FAIL` only when setup is unresolvable. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:198-203] |
| Sibling discrimination | PASS | Keep explicit “use/prefer/defer” distinctions and never invoke a sibling. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:18-38] |
| Route proof | PASS | Keep canonical command and stable mode; do not copy registry internals. [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-143] |
| Typed status | FAIL AS WRITTEN | Restore `ASK`; keep proof `blocked` separate from terminal status. [SOURCE: .opencode/commands/interface/assets/interface-audit-presentation.txt:25-32] |
| Evidence ceiling | PASS WITH WORDING GUARD | “Inspect when available; otherwise label authored/advisory” conforms; mandatory unavailable proof must be `blocked`. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:143-174] |
| Targeted revision | MOVE TO SHARED | Keep only each mode's criterion; the one-failed-criterion/one-targeted-revision rule is shared. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:49-52] |
| Output/handoff schema | MOVE TO SHARED | Keep only artifact-specific refinement and required proof fields; common blocks and continuity envelope are canonical shared bytes. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:130-141] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:176-196] |

## Phrase-Level Corrections

| Iteration-3 phrase/pattern | Verdict | Exact replacement language |
|---|---|---|
| “Mark each field resolved, auto-resolvable, or confirmation-required… record every assumption. Bundle material questions once.” | MOVE TO @ CONTRACT | `Resolve these mode-specific fields through the included progressive-intake and assumption-ledger contract:` followed only by the local field list. [SOURCE: iterations/iteration-003.md:42-42] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:78-98] |
| “The command owns intake, route proof, and visible delivery…” | REWORD | `This command owns the public mission, local intake fields, suffix control, route proof, and artifact refinement; the included contract owns shared lifecycle and schemas; the selected mode owns judgment.` [SOURCE: iterations/iteration-003.md:48-48] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:14-16] |
| “Return Route Proof and the resolved brief before recommendations.” | KEEP LITERAL | Keep; it states public ordering without copying the route-proof schema. Intake may be resolved internally before the first emitted block. [SOURCE: .opencode/skills/sk-design/SKILL.md:62-75] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:130-141] |
| “If no interface target exists, return `STATUS=FAIL`…” (and equivalent foundations/motion omissions) | REWORD | `If required input is missing, return STATUS=ASK MISSING=<input>; if the setup cannot be resolved, return STATUS=FAIL ERROR=<named-cause>.` [SOURCE: iterations/iteration-003.md:42-42] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:198-203] |
| No literal suffix rule in any core | REWORD | `Parse :auto|:confirm first: :confirm renders one consolidated prompt and waits; :auto proceeds only with reversible, route-neutral assumptions and still asks for confirmation-required decisions.` [SOURCE: .opencode/commands/interface/design.md:46-53] [SOURCE: .opencode/commands/interface/assets/interface-design-confirm.yaml:21-25] |
| Repeated “If one criterion fails, revise … once” | MOVE TO @ CONTRACT | Keep only `Critique against <mode-specific criteria>.` The included contract supplies targeted revision. [SOURCE: iterations/iteration-003.md:54-54] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:49-52] |
| Repeated eight-block `Return ...` sentence | MOVE TO @ CONTRACT | `Return the included common blocks, refining Creation/Remediation Artifact as <artifact name> and carrying <mode-specific required fields>.` [SOURCE: iterations/iteration-003.md:57-57] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:130-141] |
| “Preserve typed `STATUS=OK|DEFER|FAIL` behavior.” | REWORD | `Preserve STATUS=OK, STATUS=ASK MISSING=<input>, STATUS=FAIL ERROR=<named-cause>, and STATUS=DEFER ROUTE=<hub|sibling>.` [SOURCE: .opencode/commands/interface/assets/interface-motion-presentation.txt:25-32] |
| Audit: “if runtime evidence is unavailable, continue only at a lower ceiling” | REWORD | `If optional runtime evidence is unavailable, lower the ceiling; if a user-declared mandatory source or acceptance test is unavailable, return blocked with the exact missing proof.` [SOURCE: iterations/iteration-003.md:130-130] [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:174-174] |
| Audit: “mutation boundary” / “do not mutate through this command” | KEEP LITERAL | Use exact durable line: `This command is review-only; it emits accepted findings for sk-code and never applies fixes.` [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:172-175] |
| Design-reference: “measured, brief-provided, inferred, or absent” | REWORD | `Enforce the mode's measured/brief-provided/inferred/absent provenance categories; only measured values enter token tables, brief-provided values stay in prose, inferred claims are labeled, and absent values are not backfilled.` [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:272-274] |
| `@./.opencode/skills/sk-design/shared/creation-contract.md` | KEEP LITERAL, CONDITIONAL | Keep only after a scratch live-command fixture proves the project-root resolution. Otherwise use the exact spelling proven by that fixture; do not infer from CLI attachment syntax. [SOURCE: https://opencode.ai/docs/commands/#file-references] [INFERENCE: docs prove inclusion but not the `./` base]

## Questions Answered

- **What exact file/change/test sequence can ship safely?**
  1. Capture the current green baseline by running the two existing Node test files; expected result is the observed 15/15 pass. [SOURCE: command output `node --test ...`: 15 passed, 0 failed]
  2. In an isolated scratch project, create a sentinel include file and a temporary command that contains the candidate `@./.opencode/...` token; invoke the real OpenCode command runtime and require the sentinel bytes in the rendered/model-visible prompt. If it fails, test `@.opencode/...` and the documented `@src/...` form; promote only the observed spelling. [SOURCE: https://opencode.ai/docs/commands/#file-references] [INFERENCE: a live fixture is the smallest evidence that resolves the root ambiguity]
  3. Extend `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` first: require exactly one canonical shared-contract include per wrapper; require all four statuses; reject copied progressive-intake schemas, common block enumerations, lifecycle stage copies, evidence-free verification, public-command invocation, and taste tables; add md-generator-only artifact-write and measured-token-table assertions. [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:53-131]
  4. Extend `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` to preserve exact command/mode/sibling tokens, frontmatter argument hints, `:auto|:confirm` parity, proof fields, and fixture/metadata drift checks. [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:31-165]
  5. Rewrite only the bodies and ownership declarations in `.opencode/commands/interface/{design,foundations,motion,audit,design-reference}.md`: preserve frontmatter, discriminators, lanes/registers, route mappings, cannot-run causes, suffix behavior, proof fields, and handoff targets; add corrected literal mission/work criteria plus the one proven shared include. [SOURCE: .opencode/commands/interface/design.md:1-86] [SOURCE: .opencode/commands/interface/design-reference.md:1-80]
  6. In the same atomic change, reconcile `.opencode/commands/interface/assets/interface-*-presentation.txt`, `interface-*-auto.yaml`, `interface-*-confirm.yaml`, and `.opencode/skills/sk-design/command-metadata.json`: presentations may retain command-specific consolidated questions, and YAML may retain suffix execution controls, but none may remain declared as a competing normative source for prompt wording, lifecycle schemas, statuses, or output order. Update metadata only where the command/package source-of-truth statement changes; do not change stable mappings or proof fields. [SOURCE: .opencode/commands/interface/design.md:80-86] [SOURCE: .opencode/commands/interface/assets/interface-design-presentation.txt:1-53] [SOURCE: .opencode/skills/sk-design/command-metadata.json:35-170]
  7. Run both Node suites, the live include fixture, five `:auto` complete-input fixtures, five `:confirm` wait fixtures, one missing-input `ASK`, one unresolvable `FAIL`, one wrong-mode `DEFER`, one optional-proof downgrade, one mandatory-proof `blocked`, audit no-mutation, and md-generator owned-output/fidelity cases. Accept only with stable route proof, all four statuses, no nested public command, no advisory-mode writes, and no duplicated shared schemas. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:143-205] [INFERENCE: these cases directly cover every regression class in the iteration objective]

## Questions Remaining

- The exact OpenCode runtime base for `@./.opencode/skills/sk-design/shared/creation-contract.md` remains unproven by documentation alone. The smallest next evidence is the scratch live-command sentinel fixture described above. [SOURCE: https://opencode.ai/docs/commands/#file-references]
- Iteration 5 should turn this corrected sequence into final synthesis-ready acceptance criteria and decide, from the live include result, the exact include spelling. [INFERENCE: stopPolicy requires the fifth iteration and only the runtime-root detail remains unsettled]

## Ruled Out

- Keeping the iteration-3 status shorthand; it drops the required `ASK` branch. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:198-203]
- Treating presentations as normative prompt wording after adding literal wrapper prose; that creates competing authorities. [SOURCE: .opencode/commands/interface/design.md:80-86]
- Letting audit apply an accepted fix; the audit contract emits a backlog and never edits. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:172-175]
- Letting design-reference put brief-provided values in token tables; only measured values may enter them. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:272-274]
- Claiming the exact `@./` root from generic `@` documentation or external-CLI examples. [SOURCE: https://opencode.ai/docs/commands/#file-references] [INFERENCE: syntax support is confirmed, resolution base is not]

## Dead Ends

- No new broad direction should be exhausted. The remaining uncertainty is testable with one live fixture; broad include searches, shell compilers, router replacement, presentation-only enrichment, command-owned taste, and full lifecycle duplication remain exhausted. [SOURCE: deep-research-strategy.md:57-75]

## Sources Consulted

- `iterations/iteration-003.md:31-232`
- `.opencode/commands/interface/design.md:1-86`
- `.opencode/commands/interface/foundations.md:1-80`
- `.opencode/commands/interface/motion.md:1-80`
- `.opencode/commands/interface/audit.md:1-80`
- `.opencode/commands/interface/design-reference.md:1-80`
- `.opencode/commands/interface/assets/interface-*-presentation.txt`
- `.opencode/commands/interface/assets/interface-*-auto.yaml`
- `.opencode/commands/interface/assets/interface-*-confirm.yaml`
- `.opencode/skills/sk-design/SKILL.md:15-305`
- `.opencode/skills/sk-design/design-interface/SKILL.md:14-343`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:13-261`
- `.opencode/skills/sk-design/design-motion/SKILL.md:13-397`
- `.opencode/skills/sk-design/design-audit/SKILL.md:13-313`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:10-421`
- `.opencode/skills/sk-design/shared/creation-contract.md:14-206`
- `.opencode/skills/sk-design/mode-registry.json:39-164`
- `.opencode/skills/sk-design/command-metadata.json:1-907`
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:1-140`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:1-191`
- `https://opencode.ai/docs/commands/#file-references`
- Command output: `node --test ...` (15 passed, 0 failed)

## Assessment

- New information ratio: **1.00**
- Novelty calculation: four of five findings are fully new (duplication correction, status regression, suffix/source-of-truth conflict, and atomic ship sequence) and one is partially new (authority split refined for audit/md-generator): `(4 + 0.5 × 1) / 5 = 0.90`, plus `0.10` simplicity bonus for reducing the five bodies to one corrected placement/test model, capped at `1.00`.
- Questions addressed: adversarial conformance of five body cores; exact file/change/test sequence.
- Questions answered: exact file/change/test sequence, conditional on one explicitly isolated runtime-root fixture.
- Edge case: contradictory evidence resolved at design level—the desired command-owned literal prompt conflicts with current presentation-owned wording; the shipping sequence requires an atomic ownership update. Exact include rooting remains a documented ambiguity, not a claimed fact.

## Reflection

- What worked and why: phrase-level comparison against the shared contract exposed regressions that a thematic review missed, especially dropped `ASK`, duplicated lifecycle/output schemas, and the wrapper-versus-presentation authority conflict. Running the existing tests established what compatibility currently means rather than inferring it. [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:53-131] [SOURCE: command output `node --test ...`: 15 passed, 0 failed]
- What did not work and why: official documentation confirms `@` content inclusion but does not define the base of the exact `@./.opencode/...` spelling. More prose search would not settle runtime behavior, so this iteration stopped short of overclaiming. [SOURCE: https://opencode.ai/docs/commands/#file-references]
- What I would do differently: iteration 5 should begin with the isolated include sentinel, then synthesize the final corrected body grammar and acceptance matrix using the observed spelling; it should not re-read broad mode doctrine unless the fixture contradicts this model. [INFERENCE: only the include root can still change exact implementation text]

## Recommended Next Focus

Run the isolated OpenCode command-expansion fixture for `@./.opencode/skills/sk-design/shared/creation-contract.md`, then finalize a synthesis-ready implementation checklist that locks: one proven include, local field lists without shared schemas, literal suffix control, all four statuses, stable mode/sibling/proof mappings, audit read-only behavior, md-generator's measured-only token tables and owned artifact write, and the full negative-test matrix. [INFERENCE: this resolves the sole remaining exact-mechanism ambiguity without reopening saturated architecture]

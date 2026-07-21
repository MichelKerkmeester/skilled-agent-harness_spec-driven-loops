# Iteration 5: Include Resolution and Final Synthesis Inputs

## Focus

This forced final iteration resolved the project-root include spelling against the source for the installed OpenCode version, then consolidated iterations 3 and 4 into implementation-grade grammar, acceptance criteria, rollout, rollback, and residual-risk inputs. It did not reopen saturated router, taste, lifecycle-duplication, or presentation-only directions. [SOURCE: deep-research-strategy.md:60-91] [SOURCE: iterations/iteration-003.md:31-179] [SOURCE: iterations/iteration-004.md:42-68]

## Actions Taken

1. Re-read the lineage config, state, strategy, registry, and prior two narratives; confirmed iteration 5, `progressiveSynthesis=false`, five answered required questions, one include-spelling detail, and the write-once lineage boundary. [SOURCE: deep-research-config.json:15-57] [SOURCE: findings-registry.json:1-9]
2. Re-checked official command documentation: a command template may reference `@src/...`, and OpenCode automatically includes that file's content. [SOURCE: https://opencode.ai/docs/commands/#file-references]
3. Inspected upstream command-resolution and parser source. `ConfigMarkdown.files()` accepts a leading-dot path, while `resolvePromptParts()` resolves every non-home reference with `path.resolve(ctx.worktree, name)`. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/config/markdown.ts] [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts]
4. Matched that source to the locally installed `opencode 1.18.4`; no live scratch command was run because the rendered prompt explicitly prohibited runtime state outside this lineage. [SOURCE: command output `opencode --version`: `1.18.4`] [SOURCE: prompts/iteration-005.md:33-45]
5. Reduced the corrected proposal to one shared grammar, one acceptance matrix, and an atomic file/test sequence rather than copying a third set of five complete bodies. [SOURCE: iterations/iteration-003.md:31-179] [SOURCE: iterations/iteration-004.md:42-68]

## Findings

1. **The exact include token to promote is `@.opencode/skills/sk-design/shared/creation-contract.md`.** OpenCode 1.18.4's parser accepts leading-dot references, and its resolver anchors non-home names at `ctx.worktree`; therefore this token resolves from project root. `@./.opencode/...` also normalizes to the same path, but the no-`./` form is closer to the documented `@src/...` project-relative form and is the canonical choice. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/config/markdown.ts] [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts] [SOURCE: https://opencode.ai/docs/commands/#file-references] [SOURCE: command output `opencode --version`: `1.18.4`]
2. **The final body model is literal public orchestration plus exactly one shared expansion, not five lifecycle copies.** Each wrapper owns its mission, stakes, local field names, suffix control, sibling/cannot-run distinctions, route, ordered outcome criteria, and artifact refinement; the included contract owns universal lifecycle, schemas, evidence, targeted revision, statuses, and handoff continuity. [SOURCE: iterations/iteration-004.md:17-19] [SOURCE: iterations/iteration-004.md:44-57]
3. **Acceptance is package-wide and authority-sensitive.** All four statuses, proof ceilings, review-only audit behavior, md-generator's owned artifact exception and measured-only token tables, no nested public command, and unchanged mode/taste/transport/`sk-code` boundaries must pass together. [SOURCE: iterations/iteration-004.md:18-21] [SOURCE: iterations/iteration-004.md:23-40]
4. **The rewrite must be atomic across wrappers and ownership projections.** Updating only command Markdown would conflict with current presentation/YAML source-of-truth declarations; presentations become consolidated-question/display fixtures, YAML remains suffix execution control, and metadata mirrors the reconciled ownership without changing stable mappings. [SOURCE: iterations/iteration-004.md:19-21] [SOURCE: iterations/iteration-004.md:64-68]
5. **Source-level include resolution is settled, while an end-to-end sentinel remains a rollout gate rather than an open spelling decision.** The fixture must prove that the packaged command attaches the shared file in the real command path and catches parser or integration regressions; failure rolls back the rewrite rather than selecting an unproved fallback. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts] [INFERENCE: source inspection proves resolution semantics, while only an invocation fixture exercises command loading through prompt delivery]

## Include Resolution

**Outcome: exact token confirmed from installed-version source.** Promote exactly:

```markdown
@.opencode/skills/sk-design/shared/creation-contract.md
```

The 1.18.4 parser's file-reference regex permits a leading dot, and the 1.18.4 resolver computes `path.resolve(ctx.worktree, name)` for every non-`~/` reference. With `name=.opencode/skills/sk-design/shared/creation-contract.md`, the resulting path is the project-root file. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/config/markdown.ts] [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts]

`@./.opencode/...` is path-equivalent under that resolver, but should not be the canonical spelling: official docs demonstrate project-relative references without `./`, and one exact spelling simplifies invariants and drift tests. [SOURCE: https://opencode.ai/docs/commands/#file-references] [INFERENCE: canonicalizing equivalent spellings prevents wrappers from diverging]

## Final Corrected Grammar

Apply this grammar to each full draft in iteration 3, with every phrase-level correction from iteration 4; do not create a third independent body source. [SOURCE: iterations/iteration-003.md:31-179] [SOURCE: iterations/iteration-004.md:42-57]

1. **Preserved file contract:** retain frontmatter, canonical command name, `$ARGUMENTS`, stable `workflowMode`, route proof, existing lanes/registers, and proof fields. [SOURCE: iterations/iteration-004.md:64-67]
2. **Literal mission and stakes:** state the command-specific job and quality consequence in evocative, actionable prose; keep interface originality, foundations semantics, motion purpose, audit diagnosis, and design-reference fidelity distinct. [SOURCE: iterations/iteration-003.md:16-20]
3. **Literal local intake only:** name mode-specific fields, then say they resolve through the included progressive-intake and assumption-ledger contract; do not restate classification values or universal assumption rules. [SOURCE: iterations/iteration-004.md:46-46]
4. **Literal suffix control:** `Parse :auto|:confirm first: :confirm renders one consolidated prompt and waits; :auto proceeds only with reversible, route-neutral assumptions and still asks for confirmation-required decisions.` [SOURCE: iterations/iteration-004.md:50-50]
5. **Literal route boundaries:** name sibling fit, `cannot-run` behavior, and stable route; never invoke another public `/interface:*` command from a wrapper. Missing required input yields `ASK`; irrecoverable setup yields `FAIL`; wrong primary job yields `DEFER`. [SOURCE: iterations/iteration-004.md:34-37] [SOURCE: iterations/iteration-004.md:49-50]
6. **Exactly one shared expansion:** place `@.opencode/skills/sk-design/shared/creation-contract.md` once, with no copied universal lifecycle, schemas, common block list, evidence ladder, targeted-revision mechanics, or handoff envelope. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts] [SOURCE: iterations/iteration-004.md:17-17]
7. **Literal authority sentence:** the command owns public mission, local intake fields, suffix control, route proof, and artifact refinement; the included contract owns shared lifecycle/schema; the selected mode owns judgment; transport only retrieves/renders/measures/captures; `sk-code` owns application-code mutation. [SOURCE: iterations/iteration-004.md:47-47] [SOURCE: iterations/iteration-004.md:27-31]
8. **Literal ordered outcomes and quality criterion:** retain command-specific work order and decisive criterion, but let the shared contract own one-targeted-revision mechanics and evidence labeling. [SOURCE: iterations/iteration-004.md:39-39] [SOURCE: iterations/iteration-004.md:51-51]
9. **Literal artifact refinement:** request the included common blocks by reference and refine only the command-specific artifact and required fields. Preserve `STATUS=OK`, `STATUS=ASK MISSING=<input>`, `STATUS=FAIL ERROR=<named-cause>`, and `STATUS=DEFER ROUTE=<hub|sibling>`. [SOURCE: iterations/iteration-004.md:52-54]
10. **Mode-specific hard guards:** audit says `This command is review-only; it emits accepted findings for sk-code and never applies fixes.` Design-reference permits only md-generator's owned pipeline and requires measured-only token tables; brief-provided values remain prose, inferred claims stay labeled, and absent values are not backfilled. [SOURCE: iterations/iteration-004.md:55-56]

## Acceptance Matrix

| Acceptance area | Required evidence / rejection rule |
|---|---|
| Canonical include | Each wrapper contains exactly one `@.opencode/skills/sk-design/shared/creation-contract.md`; reject zero, duplicates, alternate spellings, missing target, or failed sentinel expansion. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts] |
| Literal prompt value | Each wrapper contains a mode-specific mission/stakes, local fields, suffix controller, stable route, ordered outcomes, decisive criterion, and artifact refinement. [SOURCE: iterations/iteration-003.md:16-20] [SOURCE: iterations/iteration-004.md:42-57] |
| Shared ownership | Universal lifecycle, intake/assumption schemas, grounding/evidence schemas, common blocks, revision mechanics, statuses, and continuity remain canonical in the included contract and are not copied. [SOURCE: iterations/iteration-004.md:17-17] |
| Judgment ownership | Commands state desired outcomes but contain no palettes, font recipes, timing recipes, severity verdicts, reference inventories, or taste tables; selected modes own judgment. [SOURCE: iterations/iteration-004.md:27-29] |
| Typed outcomes | Deterministic tests cover `OK`, missing-input `ASK`, unresolvable `FAIL`, and wrong-mode `DEFER`; `blocked` remains an evidence level, not a fifth terminal status. [SOURCE: iterations/iteration-004.md:18-18] |
| Sibling/cannot-run | Each command names sibling fit and cannot-run cause, returns typed outcomes, and never invokes another public command. [SOURCE: iterations/iteration-004.md:34-36] |
| Evidence ceiling | Optional unavailable proof lowers the ceiling; unavailable mandatory proof is `blocked` with exact missing evidence; no unrendered or unmeasured result is called verified. [SOURCE: iterations/iteration-004.md:38-38] [SOURCE: iterations/iteration-004.md:54-54] |
| Audit boundary | Audit is read-only, produces reproducible findings/remediation, and sends accepted fixes to `sk-code`; reject any direct-fix path. [SOURCE: iterations/iteration-004.md:55-55] |
| md-generator exception | Only md-generator runs its owned extract-write-validate output pipeline; only measured values enter token tables. [SOURCE: iterations/iteration-004.md:31-31] [SOURCE: iterations/iteration-004.md:56-56] |
| Package authority | Wrapper prose is normative public wording; presentation files are display/question fixtures; auto/confirm YAML owns execution control only; metadata mirrors this split atomically. [SOURCE: iterations/iteration-004.md:19-21] |
| Deterministic tests | Existing 15-test baseline remains green; new tests enforce include count/spelling, no shared-schema copies, stable mappings/fields, statuses, suffix parity, no nesting, mutation boundaries, evidence ceilings, and ownership drift. [SOURCE: iterations/iteration-004.md:61-68] |
| Live tests | Run include sentinel; five complete-input `:auto`; five consolidated-wait `:confirm`; ASK/FAIL/DEFER; optional downgrade/mandatory blocked; audit no-write; md-generator owned-output and fidelity cases. [SOURCE: iterations/iteration-004.md:68-68] |

## Rollout and Rollback

1. **Gate the include first:** in an isolated implementation fixture, create the shared-path sentinel and invoke an actual temporary command containing the canonical token; require sentinel content in the model-visible prompt and no unintended runtime files in the product tree. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts] [INFERENCE: this verifies packaging above the now-settled resolver logic]
2. **Lock tests before prose:** update `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`, then `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs`, to encode every acceptance row. [SOURCE: iterations/iteration-004.md:64-65]
3. **Rewrite wrappers as one change:** update `.opencode/commands/interface/{design,foundations,motion,audit,design-reference}.md` from iteration-3 drafts plus iteration-4 corrections and the canonical include. [SOURCE: iterations/iteration-004.md:66-66]
4. **Reconcile projections in the same change:** update `assets/interface-*-presentation.txt`, then paired `interface-*-auto.yaml` and `interface-*-confirm.yaml`, then `.opencode/skills/sk-design/command-metadata.json`; remove competing normative-prompt claims while preserving display, questions, suffix execution, stable mappings, and proof metadata. [SOURCE: iterations/iteration-004.md:67-67]
5. **Verify in layers:** run both Node suites, the include sentinel, suffix/status/evidence negative cases, all five command fixtures, audit no-write, and md-generator output/fidelity tests. [SOURCE: iterations/iteration-004.md:68-68]
6. **Rollback:** if any gate fails, revert the entire atomic wrapper/assets/YAML/metadata/test change to the recorded 15/15 baseline; do not retain a mixed ownership state or switch to duplication/shell rendering. Diagnose the failed layer, adjust the candidate off-tree, and reapply only when the full matrix passes. [SOURCE: iterations/iteration-004.md:12-12] [INFERENCE: whole-change rollback restores the previously verified authority topology]

## Questions Answered

- **What exact project-root include spelling should implementation promote?** `@.opencode/skills/sk-design/shared/creation-contract.md`, confirmed by the parser and worktree-root resolver in the locally installed version's tagged source. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/config/markdown.ts] [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts] [SOURCE: command output `opencode --version`: `1.18.4`]
- **What final corrected grammar, acceptance matrix, and ship sequence should synthesis use?** The grammar, matrix, and rollout above consolidate the full iteration-3 bodies and exact iteration-4 corrections without creating another competing body source. [SOURCE: iterations/iteration-003.md:31-179] [SOURCE: iterations/iteration-004.md:42-68]

## Open Implementation Detail

No spelling decision remains open. Implementation must still run the isolated end-to-end sentinel before merging because source inspection does not exercise command discovery, template loading, file attachment, and model-visible prompt delivery as one path. If the fixture contradicts the tagged 1.18.4 source, stop and diagnose version/package/runtime mismatch rather than silently choosing a fallback token. [SOURCE: command output `opencode --version`: `1.18.4`] [INFERENCE: the fixture is a regression and integration gate, not evidence needed to choose between spellings]

## Eliminated Alternatives

- Do not use `@./.opencode/...` as a second accepted spelling; it is resolver-equivalent but adds avoidable canonical variance. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts] [INFERENCE: one canonical spelling makes static enforcement exact]
- Do not copy the shared lifecycle into five wrappers, introduce a shell compiler, replace working routers, leave presentation files normative, or move taste into commands; all are saturated or contradicted. [SOURCE: deep-research-strategy.md:60-79]
- Do not drop `ASK`, let audit mutate, let design-reference put brief-provided values in token tables, nest public commands, or claim proof above the observed ceiling. [SOURCE: iterations/iteration-004.md:75-81]

## Sources Consulted

- `deep-research-config.json:1-59`
- `deep-research-state.jsonl:1-12`
- `deep-research-strategy.md:1-109`
- `findings-registry.json:1-59`
- `iterations/iteration-003.md:1-232`
- `iterations/iteration-004.md:1-128`
- `https://opencode.ai/docs/commands/#file-references`
- `https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/config/markdown.ts`
- `https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts`
- `https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/opencode/test/config/markdown.test.ts`
- Command output: `opencode --version` (`1.18.4`)

## Assessment

- New information ratio: **0.70**
- Novelty calculation: one of five findings is fully new (installed-version exact include resolution) and four are partially new consolidations (grammar, acceptance, atomic ownership, residual gate): `(1 + 0.5 × 4) / 5 = 0.60`, plus `0.10` simplicity bonus for eliminating the final spelling question with one canonical model.
- Questions addressed: exact project-root include spelling; final corrected grammar; acceptance matrix; rollout/rollback; residual risks.
- Questions answered: all addressed questions; no research question remains.
- Edge cases: none. The prohibited live scratch command was replaced with exact tagged source inspection; the live sentinel remains an implementation gate and was not falsely reported as executed.

## Reflection

- What worked and why: matching the installed version to tagged parser and resolver source converted documentation-level ambiguity into a concrete root-resolution proof without violating the lineage-only boundary. [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/config/markdown.ts] [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts]
- What did not work and why: broad local `@./` search produced examples from several CLIs but could not prove OpenCode custom-command semantics; only OpenCode's own parser/resolver was authoritative. [INFERENCE: examples from sibling executors do not establish this runtime's resolution base]
- What I would do differently: implementation should begin with the sentinel despite the source proof, because it cheaply validates command discovery and model-visible inclusion before any multi-file rewrite. [INFERENCE: early integration failure has a smaller rollback radius]

## Synthesis Handoff

Use iteration 3 as the only full five-body draft source, apply iteration 4's phrase-level corrections, and apply this iteration's canonical `@.opencode/skills/sk-design/shared/creation-contract.md`, acceptance matrix, rollout order, and rollback rule. Synthesis should state that all research questions are answered, while preserving the isolated live sentinel as the first implementation gate—not as unresolved research. [SOURCE: iterations/iteration-003.md:31-179] [SOURCE: iterations/iteration-004.md:42-68] [SOURCE: https://raw.githubusercontent.com/anomalyco/opencode/v1.18.4/packages/opencode/src/session/prompt.ts]

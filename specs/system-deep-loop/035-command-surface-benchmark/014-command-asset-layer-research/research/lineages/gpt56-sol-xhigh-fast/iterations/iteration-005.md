# Iteration 5: Contract-Generated Tables, Router Thinning, and Ownership Labels

## Focus

This iteration answered RQ5: how one typed command record should generate `OWNED ASSETS`, `PRESENTATION BOUNDARY`, mode/default, and `EXECUTION TARGETS` sections; how to separate router-only gates from workflow and presentation content; and how to prevent `.txt` presentation assets from being described as Markdown. “Fat router” is interpreted structurally first (content in the wrong owner) and by line-count signals second, because a required-input gate can be long without transferring execution ownership.

## Findings

1. **The generation unit should be one normalized command record, not four independently authored tables.** The minimum record is `id`, `topology.kind`, `assets[] { id, role, path, mediaType, authority, summary }`, `modes[] { id, selectors, targetAssetRef }`, `defaultPolicy`, `presentation { assetRef, surfaces, inlineExceptions[] }`, and `router { manualBlocks[] }`. `OWNED ASSETS` projects `assets`; `PRESENTATION BOUNDARY` projects the authoritative presentation asset plus its owned surfaces and bounded exceptions; mode/default prose projects `modes` plus `defaultPolicy`; and `EXECUTION TARGETS` projects the same mode-to-asset references. The current template repeats these relationships by hand, while the deep compiler already proves that per-command paths, setup fields, and topology-adjacent metadata can live in one typed definition. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:32]

2. **Generated sections need stable replaceable boundaries while router-only gates remain authored.** Render only the four contract-derived sections between generated markers; preserve frontmatter, Phase 0/mandatory-input gates, command-specific argument binding, and the short workflow summary. Rendering must be deterministic and idempotent, and a check mode must fail when the committed rendering differs from the record. This follows the existing compiled-contract precedent: generated files record their compiler, source digests, and compiled-body digest, but maintained sources remain authoritative. [SOURCE: .opencode/commands/deep/assets/compiled/README.md:51] [SOURCE: .opencode/commands/deep/assets/compiled/README.md:70] [SOURCE: .opencode/commands/deep/assets/compiled/README.md:74]

3. **Extraction uses hard ownership rules plus soft size signals.** Hard presentation trigger: any literal startup prompt, reply format, dashboard/checkpoint layout, result/failure template, or next-step wording in a router with a presentation asset moves to that asset. Hard workflow trigger: agent dispatch, step sequencing, artifact writes, retries, state transitions, or loop execution moves to workflow YAML/script ownership. The router retains only dispatch-context verification, mandatory-input binding, argument/mode resolution, target selection, generated ownership sections, and a short summary. For migration triage, flag `router LOC > 120`, `OWNED ASSETS` beginning after line 60, or more than two manual subsections under `ROUTER CONTRACT`; require extraction on any hard trigger or on two soft signals. These soft thresholds separate the 88-line `command-benchmark` reference (assets at line 42) from sampled 150–184-line deep routers whose assets begin at lines 88–126, without making LOC alone a correctness rule. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:320] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:343] [SOURCE: .opencode/commands/deep/command-benchmark.md:42] [SOURCE: .opencode/commands/deep/model-benchmark.md:126]

4. **Ownership labels must derive from role and media type, never from prose next to a path.** A presentation asset with `role: presentation`, `mediaType: text/plain`, and a `.txt` path renders the neutral label “Presentation contract” or “presentation asset”; it can never render “presentation Markdown.” The census found 14 exact mislabeled phrases across create and doctor routers, and the current reference validator only recognizes command-target extensions and checks referential existence, so it cannot detect semantic label drift. Add schema validation for extension/media compatibility and a generated-prose test that rejects `Markdown` for `text/plain`. [SOURCE: .opencode/commands/create/command.md:22] [SOURCE: .opencode/commands/create/command.md:29] [SOURCE: .opencode/commands/doctor/update.md:22] [SOURCE: .opencode/commands/doctor/update.md:37] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:39] [SOURCE: .opencode/commands/scripts/validate-command-references.cjs:55]

5. **The existing deep compiler is a consumer seam, not the new source of truth.** Its `COMMANDS` map already duplicates command, presentation, auto, and confirm paths plus setup metadata, while compiled executor contracts flatten a broader authority chain and remain derived artifacts. Move those shared fields behind the versioned command record and make the compiler consume it; do not make the large compiled executor body generate router tables, and do not confuse compiled executor contracts with the currently inactive “compiled-stub router” variant. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:32] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:85] [SOURCE: .opencode/commands/deep/assets/compiled/README.md:19] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:116]

## Candidate Deltas and Acceptance Criteria

| Target path | Candidate delta | Testable acceptance criteria |
|---|---|---|
| `.opencode/skills/sk-doc/create-command/assets/command-contract.schema.json` (new) | Version the discriminated command record and asset/mode/presentation/router types. | Six-family fixtures validate; mode-pair, manifest-backed subaction, inline subaction, and direct-dispatch topologies remain representable; a `.txt` asset declared as Markdown media fails. |
| `.opencode/skills/sk-doc/create-command/scripts/render-command-sections.cjs` (new) | Deterministically render the four generated sections from one record and support `--check`. | Two renders are byte-identical; changing one asset path updates both ownership and target projections; a missing declared-mode target fails before rendering; many-to-one mode aliases render without duplicate assets. |
| `.opencode/skills/sk-doc/create-command/assets/command_router_template.md` and `command_template.md` | Replace copy-and-fill table bodies with generated markers, document manual-block ownership, and codify hard versus soft extraction triggers. | The templates contain no independently maintained mode/asset row; generated markers appear in canonical section order; soft thresholds warn but never excuse a hard ownership violation. |
| `.opencode/commands/scripts/validate-command-references.cjs` plus command fixtures | Load the typed records, validate media/path coherence, declared-mode completeness, generated-section freshness, and router-thinning signals. | Mutation tests fail for deleted target assets, undeclared routes, stale generated text, `.txt`/Markdown label mismatch, and each hard leakage class; existing valid aliases pass. |
| `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Replace duplicated shared `COMMANDS` fields with imports from the versioned command records while retaining executor-only metadata locally. | Compiled contract semantic output and digest validation remain green; the compiler no longer separately declares presentation/auto/confirm paths already present in the command record. |
| `.opencode/commands/deep/{research,review,alignment,ai-council,model-benchmark,agent-improvement,skill-benchmark}.md` and matching assets | Migrate hard-leak blocks first, then use the soft signals to thin repeated setup/workflow prose; regenerate tables. | Each router retains gates/bindings/mode/target selection only; presentation and workflow assets own their listed surfaces; `OWNED ASSETS` starts by line 60 or the command carries a documented gate-size exception; runtime behavior snapshots remain unchanged. |
| `.opencode/commands/{create,doctor}/*.md` | Regenerate the affected ownership prose from typed metadata. | The 14 exact “presentation Markdown owns” phrases fall to zero, every referenced `.txt` remains unchanged, and ownership is rendered as “presentation contract” or “presentation asset.” |

## Ruled Out

- Hand-authoring generated tables and relying on a validator to compare them: this preserves four drift surfaces instead of removing them.
- A LOC-only hard failure: mandatory-input and dispatch-context gates can legitimately be long; ownership is the correctness boundary.
- Treating every router sentence as generated: command-specific input binding and safety gates require a narrow authored escape hatch.
- Making compiled executor contracts the router source: they intentionally aggregate skills, agents, workflows, and runtime authorities beyond the router contract.

## Dead Ends

- A presumed direct `013-command-remediation/plan.md` path was not present. The iteration did not broaden the search because current templates, compiler, routers, and validator supplied sufficient implementation targets.
- Searching for an existing generic router-table generator produced only the deep compiled-executor generator; that implementation solves a different output problem and is retained only as a consumer precedent.

## Edge Cases

- Ambiguous input: “fat” could mean any long file or misplaced responsibilities. This iteration selected ownership leakage as the hard definition and retained size only as a migration signal.
- Contradictory evidence: the router template says no compiled-stub command is active, while compiled deep executor contracts exist. These are not the same artifact: the former is a generated command stub, the latter is a derived injection contract. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:116] [SOURCE: .opencode/commands/deep/assets/compiled/README.md:19]
- Missing dependencies: the presumed 013 plan path was absent; direct source evidence was used instead.
- Partial success: none. Five focused actions supplied enough cited evidence to answer RQ5 and map candidate deltas.

## Sources Consulted

- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:17`
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:61`
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:80`
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:89`
- `.opencode/skills/sk-doc/create-command/SKILL.md:316`
- `.opencode/skills/sk-doc/create-command/SKILL.md:320`
- `.opencode/skills/sk-doc/create-command/SKILL.md:343`
- `.opencode/skills/sk-doc/create-command/assets/command_template.md:824`
- `.opencode/commands/deep/command-benchmark.md:12`
- `.opencode/commands/deep/command-benchmark.md:42`
- `.opencode/commands/deep/model-benchmark.md:11`
- `.opencode/commands/deep/model-benchmark.md:126`
- `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:32`
- `.opencode/commands/deep/assets/compiled/README.md:51`
- `.opencode/commands/scripts/validate-command-references.cjs:39`
- `.opencode/commands/create/command.md:22`
- `.opencode/commands/doctor/update.md:22`

## Assessment

- New information ratio: 0.90
- Questions addressed: RQ5
- Questions answered: RQ5
- Ratio basis: four findings are fully new contract/generation/threshold details; the `.txt` label finding converts a known defect into a prevention design and is partially new, so `(4 + 0.5) / 5 = 0.90`.

## Reflection

- What worked and why: comparing the canonical authoring template, a thin deep router, representative fat deep routers, the existing compiler, and the validator exposed both the desired ownership boundary and the current duplication seams.
- What did not work and why: the presumed 013 plan path was unavailable, so it could not anchor candidate path names.
- What I would do differently: during implementation, resolve the owning remediation phase first and ratify the two proposed new paths before creating them; the contract shape and acceptance criteria do not depend on those final filenames.

## Recommended Next Focus

The five-question research loop is complete. The reducer should synthesize RQ1–RQ5 into the final asset-layer contract proposal. Implementation should begin by ratifying the versioned record location, then build schema fixtures and the deterministic section renderer before migrating any router.

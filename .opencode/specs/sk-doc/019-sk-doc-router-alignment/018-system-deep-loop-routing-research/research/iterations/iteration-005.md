# Iteration 5: Dependency-Ordered Routing and Configuration Fix Plan

## Focus

Derive an implementable dependency order for repairing the hub playbook index, generating a typed manifest, authoring typed gold, adding hub-level resource routing, validating contracts and fallback behavior, and rerunning the benchmark. The selected interpretation is configuration-and-router planning only; no researched source or reducer-owned file was modified.

Route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/prompts/iteration-005.md:1-3]

## Actions Taken

1. Re-read the externalized config, state log, strategy, registry, and iteration prompt before selecting the focus.
2. Verified that `iteration-005.md` and `iter-005.jsonl` did not already exist and that all intended writes were packet-local.
3. Traced the hub's current registry-only router and its fail-closed fallback invariants.
4. Traced manifest generation and the canonical `{workflowMode, leafResourceId}` conversion boundary.
5. Located benchmark, connectivity, and test surfaces needed to order validation and reruns.

## Findings

1. **Use a seven-step dependency chain: baseline capture → hub-index repair → manifest generation → typed-gold authoring → hub resource router → contract/fallback validation → benchmark rerun.** Index repair must precede gold because the loader currently cannot read the hub's 18 indexed rows; manifest generation must precede typed gold because manifest membership is the oracle boundary; validation must precede the scored rerun so structural or oracle faults cannot be mistaken for router misses. [INFERENCE: based on .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-004.md:19-38 and .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:111-129]

2. **The hub-index repair is a narrow addressing prerequisite, not a corpus expansion.** Change the 18 indexed paths to the checked-in underscore directory names, then retain the 14 routing rows and four browser rows in their authored classes. Do not promote any of the 273 loader-ineligible files by inference; promotion remains a separate authored-scope decision. [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-004.md:19-38] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:497-519]

3. **Generate and commit `leaf-manifest.json` before authoring typed gold.** The existing generator already creates one entry per declared workflow mode, scans each mode's packet-local `references/` and `assets/`, retains all three `deep-improvement` mode identities, rejects duplicate composites, and emits canonical bytes. Gold should therefore use explicit `{workflow_mode, leaf_resource_id}` values whose leaf remains packet-local; packet ownership stays in the manifest rather than being embedded in `leaf_resource_id`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-129] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:114-183,318-338] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:102-172]

4. **Add hub-level resource selection without replacing the registry's mode router or weakening fallback.** After the existing explicit-hint/dominant-intent step resolves `workflowMode`, a hub resource map may select packet-qualified disk paths for static reachability, but its public result must be formed with the already-known mode and the child-local path as `{workflowMode, leafResourceId}`. Never rely on packet-prefix inference for `deep-improvement`, because three modes share that packet. Preserve the current low-confidence `UNKNOWN_FALLBACK`, missing-registry fallback, existence checks, and containment guard exactly. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:36-70] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:102-172] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:190-275]

5. **Validation must prove both the new typed path and the old safety path before accepting a score change.** Run manifest byte-check and duplicate-pair validation first; then parent-hub and advisor-registry drift guards; then topology/fixture validation; then deterministic Lane-C router-mode tests and the full system-deep-loop benchmark. Acceptance evidence must include unchanged explicit-hint precedence, low-confidence fallback, missing-mode/path fail-closed behavior, zero oracle-fault exclusions, typed-gold rows greater than zero, and before/after D1-intra/D2/D3 plus aggregate deltas. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:143-160] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:42-44,51-70] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:10-16] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:17-32] [SOURCE: .opencode/skills/system-deep-loop/benchmark/README.md:58]

## Questions Answered

- What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?

## Questions Remaining

- Which, if any, of the 273 loader-ineligible files should be deliberately promoted into authored scenarios? This remains outside inference and requires an explicit corpus-authoring decision.
- Which exact subset of the 35 evidence-backed routing candidates should receive typed gold in the first implementation slice should be confirmed against scenario intent, not filenames.

## Ruled Out

- Generating typed gold before repairing hub index paths: unreadable rows cannot be safely authored or validated.
- Encoding packet prefixes inside canonical `leafResourceId`: the contract requires packet-local `references/` or `assets/` IDs.
- Resolving `deep-improvement` mode from packet name or declaration order: three public modes share that packet.
- Treating fallback removal as a score optimization: UNKNOWN and missing-path behavior are acceptance invariants.

## Dead Ends

- Inferring typed gold for the 273 loader-ineligible behavior files remains blocked; no new evidence invalidated the saturated direction.

## Edge Cases

- Ambiguous input: none; the prompt and strategy identify the same dependency-plan focus.
- Contradictory evidence: none newly introduced; the stale 20-row README claim remains superseded by the 18-row authored index and baseline evidence from iteration 4.
- Missing dependencies: code-graph and memory accelerators remain unavailable, so exact local file anchors and prior packet evidence were used.
- Partial success: none; the open key question was answered with an implementable, evidence-backed order.

## SCOPE VIOLATIONS

None. All would-be source changes are recorded as plan steps only.

## Sources Consulted

- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/prompts/iteration-005.md:1-87`
- `.opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-004.md:19-38`
- `.opencode/skills/system-deep-loop/SKILL.md:36-70`
- `.opencode/skills/system-deep-loop/mode-registry.json:29-197`
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-160`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:114-183,190-275,318-338`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/README.md:17-32`
- `.opencode/skills/system-deep-loop/benchmark/README.md:58`

## Assessment

- New information ratio: 0.90
- Novelty calculation: 3 of 5 findings were fully new and 2 were partially new (`(3 + 0.5×2) / 5 = 0.80`), plus a 0.10 simplicity bonus for reducing the final open key question to one dependency chain.
- Questions addressed: dependency-ordered configuration and router changes that preserve fallback behavior.
- Questions answered: dependency-ordered configuration and router changes that preserve fallback behavior.

## Reflection

- What worked and why: tracing producer/consumer prerequisites from loader addressing through manifest, oracle, router, and scorer exposed an order that prevents one layer's defect from contaminating the next layer's measurement.
- What did not work and why: broad benchmark search returned many scenario docs; narrowing to the hub contract, manifest generator, typed-pair boundary, and Lane-C test index supplied the required implementation gates.
- What I would do differently: in the next pass, build an acceptance matrix that names the exact existing tests and expected report fields for each plan step, without re-auditing the already saturated corpus inventory.

## Next Focus

Convert this dependency chain into a verification matrix: exact source/test targets, commands, expected typed-row counts, fallback assertions, and before/after report fields for the implementation handoff, while leaving the 273 loader-ineligible files untouched.

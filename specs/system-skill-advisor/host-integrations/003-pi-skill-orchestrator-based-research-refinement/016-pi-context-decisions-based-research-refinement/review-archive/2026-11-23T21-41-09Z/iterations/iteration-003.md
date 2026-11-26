# Review Iteration 3 - traceability

## Dispatcher

- Route: mode=review, target_agent=deep-review, execution=single_review_iteration.
- Run: 2026-11-23T21:02:32.908Z, generation 4, iteration 3 of 5, dimension traceability.
- Review target: `.skilled/skills/system-skill-advisor` (read-only). Review focus addressed: the advisor logic in `runtime/` (lib, scorer, handlers, scripts including `skill_advisor.py`) and `hooks/`; prose docs were read only where they make a claim the code must satisfy (feature catalog, graph reference), as this pass requires.
- Lineage: config declares `lineageMode` restart while the findings registry declares resume; the iteration-1 and iteration-2 narratives recorded the same contradiction. This record copies config, as the agent contract requires.
- BINDING: target=.skilled/skills/system-skill-advisor
- BINDING: maxIterations=5
- BINDING: convergence=0.1
- BINDING: mode=review
- BINDING: dimensions=correctness,security,traceability,maintainability
- BINDING: specFolder=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement

## Files Reviewed

- runtime/tools/advisor-contract-keys.ts:1-35 (header claim, both tuples)
- runtime/tools/advisor-recommend.ts:5-39 (descriptor and its import of the tuple)
- runtime/tools/advisor-validate.ts:5-20 (descriptor and its import of the tuple)
- runtime/tools/advisor-status.ts:1-20, runtime/tools/index.ts:1-70, runtime/tools/skill-graph-tools.ts:119-140
- runtime/schemas/advisor-tool-schemas.ts:250-277, 579-593 (Zod input, exported schema map)
- runtime/skill-advisor-cli-manifest.ts:1-197 (all nine command definitions)
- runtime/skill-advisor-cli.ts:294-295, 580-640, 735-800, 1056-1081, 1170-1215
- runtime/handlers/advisor-recommend.ts:630-653, runtime/handlers/index.ts:1-14
- runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:1-30
- runtime/tests/fixtures/README.md:1-60, runtime/tests/python/test_skill_advisor.py:2160-2175, 2525-2540, 2850-2860
- runtime/scripts/skill_advisor.py:1-90, 4460-4490, 5270-5305
- runtime/scripts/skill_advisor_runtime.py:375-390 (parity report claim, header only)
- runtime/advisor-server.ts:230-262, runtime/lib/auth/trusted-caller.ts:1-38, runtime/lib/caller-context.ts:1-34
- runtime/lib/ipc/socket-server.ts:1-18 (re-export)
- Context evidence outside the target, read to test an in-target claim: .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:420-485, 560-585, .skilled/bin/lib/launcher-ipc-bridge.cjs:160-200
- feature-catalog/feature-catalog.md:110-124, feature-catalog/cli-surface/skill-advisor-cli.md:1-40, feature-catalog/cli-surface/advisor-recommend.md:20-37
- references/graph/propagate-enhances.md:70-80
- Probe: `stat -f '%N mode=%Sp uid=%u' /tmp/system-skill-advisor` plus a dist import probe comparing `SKILL_ADVISOR_CLI_TOOL_MANIFEST` against `TOOL_DEFINITIONS`

## Findings - New

### P0 Findings

None. No correctness, security or contract defect in this pass reached blocker severity; both new findings are documentation/contract drift with no runtime capability change.

### P1 Findings

None new this iteration. R2-P1-001 remains active; its recheck is recorded under Traceability Checks and Edge Cases.

### P2 Findings

1. **The advisor contract-key module names two consumers that do not exist, so its stated single-source guarantee covers only the descriptor** -- .skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:5-11 -- The header says the JSON Schema descriptors "skill_advisor/tools/advisor-recommend.ts + skill_advisor/tools/advisor-validate.ts" and "the ALLOWED_PARAMETERS map in schemas/tool-input-schemas.ts" both read the tuples, so "the JSON Schema, Zod schema, and ALLOWED_PARAMETERS" stay in sync. `runtime/schemas/tool-input-schemas.ts` does not exist (the schemas directory holds only advisor-tool-schemas.ts, compat-contract.json, daemon-status.ts, generation-metadata.ts, README.md and skill-derived-v2.ts), no `ALLOWED_PARAMETERS` symbol exists anywhere in the skill, and there is no `runtime/skill_advisor/tools/` path. The only readers are the two tool descriptors, and the type-level link is `Record<(typeof ADVISOR_RECOMMEND_PARAMETER_KEYS)[number], …>` at tools/advisor-recommend.ts:12.
Finding class: documentation-contract drift / phantom consumer
Scope proof: `rg -n "ADVISOR_RECOMMEND_PARAMETER_KEYS|ADVISOR_VALIDATE_PARAMETER_KEYS|ALLOWED_PARAMETERS|tool-input-schemas"` over `.skilled` returns only the two descriptors, the two type aliases and the header itself; `ls runtime/schemas` confirms the named file is absent. Both files are inside config.reviewScopeFiles.
Affected surface hints: contract-keys.ts:5-11 stated invariant -> tools/advisor-recommend.ts:12-20 the only enforced link -> schemas/advisor-tool-schemas.ts:259-277 the Zod schema that hand-writes the same option keys with no tuple import -> handlers/advisor-recommend.ts:641 where that Zod schema is the actual runtime gate -> the same three surfaces the CLI manifest copies at skill-advisor-cli-manifest.ts:50-68
Case: a maintainer adds `options.reasoningEffort` to ADVISOR_RECOMMEND_PARAMETER_KEYS. The descriptor type forces the descriptor property and the CLI manifest copy is caught by the parity suite, but `AdvisorRecommendInputSchema` at schemas/advisor-tool-schemas.ts:259 stays unchanged because no import links it to the tuple; the handler's `AdvisorRecommendInputSchema.parse(args)` at handlers/advisor-recommend.ts:641 then rejects the new key, so the CLI advertises a parameter the daemon refuses. The header's promise that this drift "surfaces as a type-level mismatch" is false for the Zod surface.

2. **The feature-catalog CLI entry cites its parity suite at a path that does not exist, so the drift guard it promises resolves to nothing** -- .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md:3 -- The frontmatter description and the OVERVIEW both say the manifest schemas are "held byte-identical to the server TOOL_DEFINITIONS by a dedicated parity suite (`tests/skill-advisor-cli-manifest-parity.vitest.ts`)". No such path exists under the repository root or under the skill; the real suite is `runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts`. The same file's own Validation And Tests table lists the sibling suites as `runtime/tests/...`, so the overview alone drifted.
Finding class: documentation-contract drift / stale path
Scope proof: existence probe over 230 code/doc paths cited by the feature catalog resolves 229; the only miss is this path. The catalog's own table at feature-catalog/cli-surface/skill-advisor-cli.md:31-39 uses the correct `runtime/tests/` base, which fixes the intended base of the overview claim.
Affected surface hints: feature-catalog/cli-surface/skill-advisor-cli.md:3 and :17 the broken citation -> runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:1-30 the real suite -> runtime/skill-advisor-cli-manifest.ts:43-158 the manifest it guards -> runtime/tools/index.ts:39-46 the server registry it compares against
Case: an operator or a doc-driven checker follows the overview path to see whether manifest drift would fail CI; the file open fails, and a subsequent audit reads the guarantee as unenforced even though `runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30` does enforce it.

## Traceability Checks

Protocol results (one row per protocol run this iteration; unrun protocols are omitted, not marked pending):

- **spec_code** (core, hard): **fail**. The target's graph reference states the contract the code breaks: `references/graph/propagate-enhances.md:76` says "Trusted-caller authentication is required via `requireTrustedCaller`. Untrusted callers receive an authentication error before any detection runs." The daemon resolves trust as: explicit untrusted refused, explicit trusted accepted, otherwise `process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT === "trusted"` (runtime/advisor-server.ts:236-258), while `_meta` is caller-supplied (runtime/lib/caller-context.ts:7-34, called by `buildCallerContext` at advisor-server.ts:251-261) and the shipped launcher sets that env to trusted. The CLI half of the gate is honest and structurally enforced (runtime/skill-advisor-cli.ts:747-761, sole call site :779), which is why the contradiction is between the reference and the daemon, not a missing code path.
- **checklist_evidence** (core, hard): **notApplicable** (`applicable: false`). The bound packet carries no `checklist.md` or `acceptance-criteria.md`: its document set is spec.md, goal.md, decision-record.md and delegation-strategy.md, and the spec.md heading walk (:59 metadata through :222 related documents) contains no acceptance or checklist section. There are no rows whose evidence could be checked. The catalog's own validation claims were checked instead under `feature_catalog_code`.
- **feature_catalog_code** (overlay): **fail**. Two catalog claims are contradicted by the tree while the Source Files tables themselves hold up. (a) The CLI entry promises a root-level parity suite path that does not resolve (finding R3-P2-002). (b) The catalog headline "fail-closed trusted-mutation gate" (feature-catalog/feature-catalog.md:119) and "daemon-side SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT" (feature-catalog/cli-surface/skill-advisor-cli.md:17) describe the gate as fail-closed while the launcher default inverts it, which is the carried R2-P1-001 contradiction. Positive evidence for the rest of the overlay: a dist import probe compared all nine manifest entries against `TOOL_DEFINITIONS` and reported 9/9 identical `inputSchema` and `description`, matching the guarantee asserted by runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30; 229 of 230 catalog-cited code/doc paths resolve.

R2-P1-001 recheck (carried, security): **still active at P1, impact refined**. Reachability of the daemon socket was measured rather than assumed. The live socket directory is `/tmp/system-skill-advisor`, `drwx------`, uid 501 (the reviewing user); the shared transport refuses to bind under a directory it does not own or that is group/world-writable and chmods the bound node to 0600 after an lstat check (.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:449-470, 570-580, re-exported by runtime/lib/ipc/socket-server.ts:1-18). Cross-user reach is therefore contained. Same-uid processes can connect because the client uses plain `net.createConnection` with no peer-uid check (runtime/skill-advisor-cli.ts:1181-1215, transport in .skilled/bin/lib/launcher-ipc-bridge.cjs:168-200) — but `_meta.trusted: true` is caller-asserted anyway (runtime/advisor-server.ts:236-241), so the trusted default grants no capability a same-user caller could not already claim. The durable defect is the false fail-closed guarantee in the target's own comment and in the reference/catalog, which remains a required contract fix (align the code or the documents). No cross-user exposure is claimed.

## Integration Evidence

Exact surfaces checked as the contract consumers, not as nearby files:

- CLI front door: `validateCommand` resolves the command from the manifest and validates args against its `inputSchema` (runtime/skill-advisor-cli.ts:766-781), then `assertTrustedForMutation` applies the mutation rule (runtime/skill-advisor-cli.ts:747-761). The manifest is the CLI's only tool registry: `list-tools`, completion and the command set all derive from `SKILL_ADVISOR_CLI_TOOL_MANIFEST` (runtime/skill-advisor-cli.ts:294-295, 1056-1081).
- MCP descriptor surface: `TOOL_DEFINITIONS` (runtime/tools/index.ts:39-46) is the server registry the manifest is held byte-identical to; `dispatchTool` routes by name to the four advisor handlers and the skill-graph handler set (runtime/tools/index.ts:53-70).
- Handler validation surface: `handleAdvisorRecommend` parses its arguments with `AdvisorRecommendInputSchema` (runtime/handlers/advisor-recommend.ts:641), so the Zod schema in runtime/schemas/advisor-tool-schemas.ts:259-277 is the runtime gate the contract-key module claims to guard.
- Python fallback contract: the shared fixture corpora are wired into the Python suite, not copied by hand — `runtime/tests/python/test_skill_advisor.py:2167` reads `affordance-injection-fixtures.json`, :2533 reads `pasted-reply-strip-cases.json`, :2857 resolves `deep-loop-offer-cases.json`; the Python gate's own comment states the same contract at runtime/scripts/skill_advisor.py:4465-4472, and the pasted-reply strip is implemented at :5270-5305.
- Feature catalog: feature-catalog/feature-catalog.md:119 and feature-catalog/cli-surface/skill-advisor-cli.md:3, 17, 31-39 were checked against the code and the tree.

## Edge Cases

- The manifest parity probe ran against `runtime/dist`, the compiled tree, not the TS sources. It corroborates the source-level check rather than replacing it: runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30 asserts the same deep equality over the source registries, so a stale dist can only make the probe weaker, not stronger.
- The catalog path probe counted 230 code/doc tokens and deliberately skipped glob patterns and `../` links; 229 resolve, and the single miss is exactly finding R3-P2-002. A glob entry (`.skilled/skills/*/SKILL.md`) resolves to nothing as a literal and was not counted as a defect.
- Python-to-TypeScript parity was not executed. The shared fixtures are wired into both suites and the copy sites were read, but running the parity suite is outside this read-only iteration; the search ledger records it as deferred rather than clean.
- `checklist_evidence` has no document to check because packet 016 ships no checklist. That absence is recorded as `notApplicable` with evidence rather than converted into a pass.
- `hooks/` adapters were not re-read this pass; iteration 2 read the CLI fallback and the hook entry points, and this pass verified only the CLI side of that bridge (runtime/skill-advisor-cli.ts:747-761). Hook traceability stays partial and is carried to maintainability.
- Lineage contradiction persists (config restart vs registry resume); copied from config per contract, recorded since iteration 1.

## Confirmed-Clean Surfaces

- Manifest versus server registry: 9/9 entries identical in `description` and `inputSchema` on the dist probe, with the source parity suite asserting the same equality (runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30). The catalog's "9 commands, byte-identical schemas" claim holds.
- Manifest versus CLI dispatch: the command set, aliases and completion derive from the same manifest (runtime/skill-advisor-cli.ts:294-295, 1056-1081); `RESERVED_COMMANDS` is the only name set outside it (runtime/skill-advisor-cli.ts:42).
- Descriptor versus contract tuple: `properties` is typed as `Record<(typeof ADVISOR_RECOMMEND_PARAMETER_KEYS)[number], …>` in both descriptors (runtime/tools/advisor-recommend.ts:12, runtime/tools/advisor-validate.ts:10-12), so a tuple/property mismatch is a type error.
- Catalog Source Files: 229 of 230 cited code/doc paths resolve from the repository root or the skill root; only R3-P2-002 misses.
- Socket containment: the live socket dir is 0700 owned by the reviewing user and the shared transport chmods the bound node to 0600 after an lstat guard; a non-owner cannot traverse to the socket.
- Python fixture contract: all three shared corpora are read by the Python suite, and the deep-loop gate comment and the fixture README state the same parity contract (runtime/tests/fixtures/README.md:30-40).

## Ruled Out

- Manifest/TOOL_DEFINITIONS drift: the dist probe reports IDENTICAL for all nine commands, and the source parity suite enforces name-set and schema equality (runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:15-30).
- A missing descriptor for a manifest command (or vice versa): both registries hold the same nine names; `skill_graph_propagate_enhances` is present in the manifest and dispatched by `handleTool` (runtime/tools/skill-graph-tools.ts:138-140).
- Catalog-wide source-file path loss: 229 of 230 resolve; the one miss is isolated to the overview citation (finding R3-P2-002).
- Cross-user reach to the daemon socket: the socket dir is 0700 and owner-checked, the socket node is 0600, and a non-owned or group/world-writable dir is refused at bind.
- A Python/TypeScript divergence in the shared fixture wiring: the fixtures are read by the Python suite at three sites rather than duplicated; execution of the parity suite remains deferred, not claimed clean.

## Next Focus

- Dimension: maintainability.
- Focus area: hooks/ and the Python fallback as maintained code: duplication between skill_advisor.py and the TS scorer (the gate, strip rule and policy constants), the dead or phantom surfaces found this pass (the unused ADVISOR_INPUT_SCHEMAS export, the contract-key header, the catalog citation), and the `runtime/tools/advisor-contract-keys.ts` cleanup shape.
- Reason: traceability is reviewed but not closed; R3-P2-001 and R3-P2-002 are documentation/contract drift that a maintainability pass can scope, and the Python copy-drift cost is a maintenance question rather than a spec one.
- Rotation status: correctness and security reviewed; traceability now reviewed with two new P2 and the carried P1. R1-P2-001 through R1-P2-005 and R2-P2-001/R2-P2-002 remain active.
- Required evidence: file:line receipts for each duplicated rule, a named consumer for every dead-surface claim, and a diff-shaped statement of what cleanup would touch.
- Deferred from this pass: executing the Python/TS parity suite, and re-reading the four hook adapters.

Review verdict: CONDITIONAL

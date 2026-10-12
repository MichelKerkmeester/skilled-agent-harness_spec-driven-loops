# Iteration 9: Reject overbuilt surface-priority changes

## Focus

Q6 asks which ideas should be rejected and why. The persisted strategy marks Q2 through Q5 answered and Q6 remaining. This pass synthesizes those findings, reopens the existing tieBreak, doctor and scaffold contracts, and leaves Q1's cross-surface inventory open.

## Actions Taken

- Read the lineage config, state log, strategy, dashboard, registry and prior iteration notes before selecting the focus.
- Rechecked the hub router, mode registry, compiled registry compiler, parent-skill doctor, release updater, sk-doc parent scaffold, canonical sk-code docs and prevent-overengineering rule.
- Reused the recorded throwaway-copy observations from iterations 3 and 4 rather than repeating the already answered deletion probe.
- Did not edit product files or run tests. The durationMs value is a four-minute estimate because the leaf prompt does not expose a dispatch-start timestamp.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| ORDER | Keep surface precedence in the existing authored hub-router tieBreak. It is compiled into the routing model and the doctor checks it as an exact permutation. An external starter should omit Obsidian and Webflow registrations and resources, keep OpenCode last among surfaces, and let a user's registered surface precede OpenCode. Preserve the operator repository's current list. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4-12]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:259-266]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088] | P1 |
| BREAK | Deleting the two example directories while leaving registrations and router resources intact is not a valid external setup. The recorded copy check failed the parent-skill doctor, while compiled routing still returned absent packet ids; keep the structural checks fail-closed and make the starter data internally consistent. | Copy evidence recorded in [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-003.md:28-31] and [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-004.md:18-25]; source checks: [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497,1075-1088] | P1 |
| DOC | The inspected /doctor:update release updater groups files below the parent hub into one skill unit. This does not prove what another publisher ships. UNKNOWN: the actual publication entrypoint and whether it selects different starter data. Locate that entrypoint before adding a packaging-specific file or claiming the example-free default already ships. | [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:520-561]; prior inspected-path boundary: [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-007.md:22,34-41] | P2 |
| DOC | A parent-surface scaffold already exists through sk-doc's parent-skill workflow and its --surfaces input. Improve the canonical hub guidance and the existing missing-packet diagnostic; a new wizard or a README-only patch leaves the canonical exact-three list and the doctor repair gap in place. | [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:20-27,63-80]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467]; [SOURCE: .skilled/skills/sk-code/SKILL.md:32-42]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497] | P2 |
| OK | Reject a numeric rank field, native/fallback flag or tieBreak derived from installed directories for now. The current ordered list already supplies persistent precedence, the compiler consumes it and the doctor validates its membership. No observed requirement fails at that simpler mechanism. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4-12]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20,61-114]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:259-266]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088] | P2 |
| OK | Reject a plugin system, a new surface wizard, a runtime flag that hard-codes the operator order, and removing the example packets from the operator repository. The existing parent workflow creates surface packets; the checked-in registry and router hold the operator's current surface data. Keep environment differences in the selected starter data rather than adding runtime branches. | [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:461-467]; [SOURCE: .skilled/skills/sk-code/hub-router.json:7,31-46]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:19,61-114]; restraint: [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45-66,117-119] | P2 |

## Ranked Recommendation

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R1 (recommended): provide an example-free external starter payload while preserving operator-local registrations and packets. Choose the existing publish boundary after locating it; omit Obsidian and Webflow from the starter registry, router signals/resources and derived manifests. | [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20,61-114]; [SOURCE: .skilled/skills/sk-code/hub-router.json:7,31-46]; updater grouping: [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:520-561] | Medium: select or add the starter values at the actual publisher boundary and regenerate existing derived artifacts. | The publish boundary is not established in the inspected repository paths; operator and starter data could drift. | Cheaper: ship the operator tree and tell external users to delete only the two directories. It fails because doctor registrations/resources remain stale and runtime can still route to absent packets, as the copy evidence shows in iteration 3 and 4. |
| R2: retain the existing tieBreak as the only persistent precedence list; place each registered project surface before OpenCode in the external starter. Keep --surface-hint as a session hint. | [SOURCE: .skilled/skills/sk-code/hub-router.json:4-12]; [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:259-266]; [SOURCE: .skilled/bin/compiled-route.cjs:47-59]; [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99-107] | Low: update an existing ordered value when a surface is registered. | A manual list can be incomplete or misordered; the existing doctor catches membership errors but not semantic priority. | Cheaper: use --surface-hint as the project default. It fails because it only reorders surfaces already matched on that call and does not change persistent precedence. |
| R3: label Obsidian and Webflow as optional operator examples in the canonical sk-code guidance, qualify the v4.0.0.4 wording, link the existing parent-surface scaffold, and add a concise repair hint to the existing missing-packet doctor message. | [SOURCE: .skilled/skills/sk-code/SKILL.md:32-42,147-172]; [SOURCE: .skilled/skills/sk-code/README.md:51-57]; [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:295-297]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497]; [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467] | Low: edits to existing prose and one existing diagnostic. | Documentation can drift; doctor structure checks do not prove the intended semantic order. | Cheaper: update only the README. It fails because the canonical SKILL.md still states an exact three-surface set and the doctor still gives no replacement steps. |

## Rejected Ideas

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Reject a numeric rank or priority field in mode-registry. | New registry field plus compiler, doctor and fixture contracts; current list is at [SOURCE: .skilled/skills/sk-code/hub-router.json:7] and compiler input at [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:259-266]. | High: another ordering source and its validation surface. | TieBreak and rank can disagree. | Cheaper: change the existing tieBreak. It does not fail for any requirement observed here, and the doctor already checks it as a full permutation. |
| Reject a native/fallback flag on OpenCode. | Adds a flag and compiler/doctor behavior to the surface registry at [SOURCE: .skilled/skills/sk-code/mode-registry.json:79-94]. | Medium. | A binary flag cannot order multiple project surfaces or preserve the operator's multi-surface sequence. | Cheaper: use tieBreak. It already orders every registered mode, so the flag solves no observed gap. |
| Reject deriving tieBreak from installed directories when minting the manifest. | Replaces authored policy in [SOURCE: .skilled/skills/sk-code/hub-router.json:4-12] with generated ordering. | High: new generation rules plus regenerated artifacts and checks. | Presence does not encode preference among several installed surfaces; stale references can still route to absent packets. | Cheaper: keep the explicit order. The compiler already copies it and the doctor checks its contract. |
| Reject --surface-hint as the system-wide priority policy. | It is a per-call argument in [SOURCE: .skilled/bin/compiled-route.cjs:47-59] and is applied after evaluation in [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99-107]. | Low to try, but repeated at every caller. | Callers may omit a hint; unmatched or absent surfaces are not added. | Cheaper: keep persistent tieBreak order. The hint path cannot establish a project default because it only reorders already matched targets. |
| Reject a plugin auto-discovery system or a new surface wizard. | Would add a plugin contract or duplicate packet generation; the existing parent scaffold takes surfaces at [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467]. | High for auto-discovery; medium for a wizard. | New discovery, update and validation behavior without a stated automatic-install requirement. | Cheaper: use the existing explicit parent-skill scaffold. It handles the requested create-and-register path. |
| Reject a feature flag that hard-codes the operator order. | Adds a runtime branch around [SOURCE: .skilled/skills/sk-code/hub-router.json:7]. | Medium. | Two sources of truth and special behavior for one repository. | Cheaper: select different starter data at packaging time while retaining operator data. A flag is not needed to express the two data sets. |
| Reject deleting Obsidian and Webflow from the operator repository. | Would remove current registrations and packet resources at [SOURCE: .skilled/skills/sk-code/hub-router.json:31-46] and [SOURCE: .skilled/skills/sk-code/mode-registry.json:19,61-114]. | High: loses the operator's current surfaces and examples. | Violates the stated operator-repository requirement. | Cheaper: retain the operator tree and omit examples only from the external starter payload. Deleting locally changes the operator's own repository state. |
| Reject weakening doctor checks or shipping stale registrations and asking users to delete directories. | Existing missing-packet and tieBreak checks are at [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497,1075-1088]. | Medium: changes the doctor contract and downstream routing expectations. | Hides unresolved resources and successful routes to absent packets, observed in copy evidence at [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-003.md:28-30] and [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-004.md:18-25]. | Cheaper: make the selected starter registry and router consistent. Relaxing the checks would preserve the exact failure observed after directory deletion. |

## Proposed Implementation Phases

1. **Locate the actual publishing path.** Confirm which existing command or pipeline selects the external artifact. Evidence: the inspected release updater groups the hub as one skill unit at [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:520-561], while iteration 7 explicitly left another publisher unverified at [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-007.md:22,34-41]. Climbing sentence: adding a new starter config before finding its consumer fails because the current evidence identifies no publisher that would read it.
2. **Select example-free starter data at that boundary.** Omit the two example packets and their router/registry/resource references there, retain the operator source tree, and regenerate existing derived manifests. Evidence: [SOURCE: .skilled/skills/sk-code/mode-registry.json:19,61-114]; [SOURCE: .skilled/skills/sk-code/hub-router.json:7,31-46]; [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:88-114]. Climbing sentence: telling users to delete directories after install fails because stale registrations and resources fail doctor and can still be selected by routing.
3. **Register project surfaces through the existing scaffold and list them before OpenCode.** Evidence: [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467]; [SOURCE: .skilled/skills/sk-code/hub-router.json:7]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1088]. Climbing sentence: a rank field or hint default is costlier than one tieBreak update, and neither fixes a failure the ordered list has today.
4. **Clarify docs and doctor remediation.** Label the two checked-in packets as optional examples, link to the existing scaffold, and give the missing-packet check a repair hint. Evidence: [SOURCE: .skilled/skills/sk-code/SKILL.md:32-42]; [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:295-297]; [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497]. Climbing sentence: a README-only change fails because the canonical hub inventory and doctor error remain misleading.

## Questions Answered

- Q6: Which ideas should be rejected, and why? Reject new rank/native flags, generated ordering from folder presence, --surface-hint as global policy, plugin discovery, a new wizard, a hard-coded operator-order flag, deleting operator packets, weakening doctor checks and README-only guidance. Reuse the explicit tieBreak, the existing parent-surface scaffold, and a separate external starter payload once its publisher is confirmed.

## Questions Remaining

- Q1: Complete the remaining occurrence inventory across advisor scoring and batteries, doctor checks, install guidance, canaries, compiled routing and release notes.
- Follow-up: locate and inspect the actual external publisher. The checked-in /doctor:update path groups the hub as one unit, but does not establish what another publisher ships.

## Sources Consulted

- [SOURCE: .skilled/skills/sk-code/hub-router.json:4-12,31-46]
- [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20,61-114]
- [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:259-266]
- [SOURCE: .skilled/bin/compiled-route.cjs:47-59]
- [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99-107]
- [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497,1075-1088]
- [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:88-114,520-561]
- [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467]
- [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:20-27,63-80]
- [SOURCE: .skilled/skills/sk-code/SKILL.md:32-42,147-172]
- [SOURCE: .skilled/skills/sk-code/README.md:51-57]
- [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:295-297]
- [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45-66,94-100,117-119]
- [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-003.md:28-31]
- [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-004.md:18-25]
- [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-007.md:22,34-41]
- [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-008.md:19-26]

## Assessment

- New information ratio: 0.60. Two of six findings are new and two partially new, yielding 0.50 before the 0.10 simplicity bonus for resolving Q6 through existing routing and scaffold contracts.
- Questions addressed: Q6.
- Questions answered: Q6.
- Questions remaining: Q1's cross-surface inventory and the actual external publisher boundary.

## Reflection

- What worked and why: comparing the router, compiler and doctor showed that one authored tieBreak already acts as persistent priority, so the alternatives add policy without closing an observed gap.
- What did not work and why: the actual publisher could not be identified from the inspected /doctor:update paths, so the external starter split remains a recommendation rather than a confirmed shipped mechanism.
- What I would do differently: use the final iteration to close Q1's remaining advisor, doctor, canary, install and release-note inventory, then inspect the publisher entrypoint before describing package behavior as observed.

## Recommended Next Focus

Complete Q1's remaining occurrence inventory and identify the actual publisher so an example-free starter can be verified at its real output boundary.

## SCOPE VIOLATIONS

None. Only the authorized iteration and delta artifacts are written in the lineage. The append gateway owns the state projection.

## Verification

The narrative and delta are created once under the resolved lineage. The append gateway and iteration verifier outputs are recorded by the dispatch after the artifact write.

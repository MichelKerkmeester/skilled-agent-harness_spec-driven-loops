# Iteration 5: Q10 / R2 drift-guard stress test

## Focus

Test whether stack-agnostic drift tooling still names the Webflow and Obsidian examples after their packet directories are removed. I also classified the matching compiled-routing test and fixture and recorded the external-user failure messages. Q10 remains broader than this R2 slice.

## Actions Taken

- State-first read: config, state log, strategy, registry, dashboard and iterations 1–4. The strategy's Next Focus is Q10, and no exhausted approach blocks this R2 check. The configured session ID is `dr-025r2-luna-max-fast-r2-2026-10-12T18:58:06.247Z`.
- Trigger-index lookup: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "DEEP-RESEARCH Q10 R2 stress test verify-router-sync drift guards examples sk-code-webflow sk-code-obsidian"` — exit 0; top matches were the deep-research README and system-spec-kit stress-test README.
- Source search: searched `run-all-drift-guards.sh`, tests and compiled-routing fixtures for example names. The combined shell command exited 1 because its final filename-filtered search found no router-sync filename; the content search found `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` and `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`.
- Read all four scripts invoked by `run-all-drift-guards.sh`, the matching test and fixture, `mode-registry.json`, and the overengineering rule. The gate calls alignment drift, stack-folder, router-sync and doc-claims [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:28-31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:59-78].
- Throwaway copy: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i5-a`.
  - Command: `cd /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i5-a && test "$(pwd)" = "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i5-a" && rm -rf .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian && node <<'NODE' ... NODE` — exit 0. The Node edit replaced only the two `SURFACES` constants in `verify-router-sync.cjs` with `MODE_REGISTRY.modes` entries where `packetKind === 'surface'` and the packet `SKILL.md` exists, then built `SURFACE_PACKETS` from that list. Output: `deleted examples: webflow=false obsidian=false`; `R2 surface packets: sk-code-skilled`.
  - Command: `cd /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i5-a && test "$(pwd)" = "/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/luna-max-fast-r2-i5-a" && bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` — exit 1. Router-sync: `FAIL check 1a ... (99 problem(s))`; checks 1b, 2, 3 and 4 passed. Doc-claims: `FAIL check paths ... (260 problem(s))`; names, surfaces and tiers passed. Overall: `run-all-drift-guards: 2 guard(s) FAILED`.
- The copy retained `mode-registry.json`, `hub-router.json`, ROUTER.md and all other docs. Thus the probe isolates the verifier edit and directory deletion, not a fully pruned/re-registered external-user state.

## Findings

| class | claim | evidence | priority |
|---|---|---|---|
| ORDER | `verify-router-sync.cjs` hardcodes Webflow and OpenCode in `SURFACES` and adds Obsidian in `SURFACE_PACKETS`; its check 2 iterates these values as required children. The registry already identifies each mode's `packetKind` and `packet`, so the guard can consume surface membership rather than enumerating examples. | [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31-32] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:186-227] [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-20] [SOURCE: .skilled/skills/sk-code/mode-registry.json:60-95] | P1 |
| BREAK | In COPY_A, after removing both example directories and applying only the dynamic `verify-router-sync.cjs` edit, router-sync still failed 1a with 99 dead routes. Its 1b, 2, 3 and 4 checks passed. The remaining failures are stale routes/prose in the unchanged hub and router data, not the fixed surface-list assumption. | COPY_A `run-all-drift-guards.sh`, exit 1: `FAIL check 1a ... (99 problem(s))`; `PASS check 1b`, `PASS check 2`, `PASS check 3`, `PASS check 4`; `router-sync: 4/5 checks passed`. The first dead routes named `sk-code-webflow/SKILL.md` and `sk-code-obsidian/SKILL.md`. | P1 |
| DOC | The same copy produced 260 doc-claims path failures, including broken mode paths, playbook links and ROUTER.md leaves. The path checker intentionally resolves links and path-shaped claims against files on disk, so this is useful stale-documentation detection, not a reason to suppress the guard. | [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:245-296]; COPY_A run-all exit 1: `FAIL check paths ... (260 problem(s))`, first error `graph-metadata.json:223: path does not resolve: sk-code-webflow/references/animation/animate-and-timelines.md`. | P1 |
| DOC | The output identifies missing paths but does not tell the user to remove/update router and documentation references or name a repair command. `run-all-drift-guards.sh` prints the guard failure and aggregate count, not a next action. An external user can diagnose the symptom but must discover the migration checklist independently. | [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:245-296] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:36-56] COPY_A exact messages above. | P1 |
| ORDER | `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` is shared compiled-routing tooling but hardcodes Webflow/Obsidian examples in its test prompts and expected mode order. R2 should make its surface-hint assertions data-driven or use a synthetic surface fixture; otherwise a general routing test remains coupled to the optional demo identities. It is not part of `run-all-drift-guards.sh`, so this gate did not test it. | [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:22-25] [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-90]; run-all invocations [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:59-78]. | P1 |
| OK | The compiled-routing `canary-cases.v1.json` is example-specific sk-code rollout data: its cases explicitly expect Webflow and Obsidian mode bundles. Treat it as example-owned authored fixture data, not as a stack-agnostic drift-guard implementation. If the archived authored closure is pruned, its canary/route gold must be removed or regenerated with that closure rather than silently retained as live coverage. | [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:58-110] | P2 |

## Options and Recommendation

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R2 verifier correction | In `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31-32`, replace the fixed arrays with a read of `mode-registry.json`, filtering `modes` by `packetKind === 'surface'` and using each entry's `packet`; derive `SURFACE_PACKETS` from that list. The tested variant also filtered for an on-disk `SKILL.md`, allowing check 2 to validate only installed packets. | Low, one existing verifier module. | The tested on-disk filter can hide a registered-but-missing surface unless another gate catches the stale registration. The copy still failed 1a because the authored route map and prose were untouched. | Leaving the constants is shorter but newly authored surfaces are omitted or the old demos remain required. Removing the surface-union check entirely is cheaper but loses check 2 coverage. Prefer registry membership as source of truth and explicitly remove registrations when deleting a surface; do not treat missing registered packets as a healthy configuration. |
| Extend the existing surface update command | Extend `/create:skill-parent update --surfaces` to coordinate surface registration/removal with the router/docs refresh and run the existing `run-all-drift-guards.sh` before claiming success. The prior simulation found that update still left doctor legs 6b and 5k-canary red [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2/iterations/iteration-002.md:18-22]. | Medium, expands an existing command's generation and verification workflow. | It can still leave stale generated or authored closure data unless it refreshes the owning sources and reports failures. | A checklist is cheaper to implement, but it leaves users to reconcile multiple registries/docs and does not ensure the existing gates pass. Reuse the current command rather than add a separate command. |

R2 is **not complete** as a guard-only change. The tested replacement removes example-specific assumptions from check 2, but the whole gate still fails on stale route paths and prose. The surface-hint unit test is another stack-agnostic tooling touchpoint outside this gate. Preserve the path failures as actionable blockers; do not weaken the generic path checker to make deletion appear clean.

## Questions Answered

- No complete key question answered. This iteration provides direct evidence for the R2 slice of Q10 only.

## Questions Remaining

- Q10: exact R1–R4 edits, touched files, residual failures and minimum correct scope, including R3 and R4.
- Q11: other example assumptions and full external-user flow.
- Q12: challenge rejected ideas X1–X9 and identify new rejections.

## Next Focus

Continue Q10 with the R3/R4 stress test and enumerate the exact authored docs, registries and generated artifacts that the external surface-removal workflow must reconcile.

## Assessment

- New information ratio: 0.75 (three fully new findings and three partially new findings; the R2 risk was known, while this iteration directly identified the verifier, unit-test and full-gate residual evidence).
- Questions addressed: Q10 R2 sub-slice.
- Questions answered: none in full.
- Edge cases: partial success. The isolated guard edit was tested, but router and documentation sources were intentionally not changed.

## Reflection

- What worked and why: the single-file verifier edit plus example-directory deletion isolated its static list from the stale authored route corpus; the integrated gate exposed both distinct failure layers.
- What did not work and why: this isolated deletion is not a complete external-user migration. The retained mode registry, hub router and prose intentionally kept references to the deleted packets.
- What I would do differently: in the next approved probe, model the full supported surface removal through the existing command in a fresh throwaway copy, then run all four guards and inspect the resulting authored and generated files.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:28-31,59-78`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31-32,186-227`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:245-296`
- `.skilled/skills/sk-code/mode-registry.json:16-20,60-95`
- `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:22-25,61-90`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:58-110`
- `.skilled/repo-rules/prevent-overengineering.md:43-49,53-66`
- COPY_A deletion, verifier edit and run-all commands, with exit codes and decisive output, recorded under Actions Taken.

## Recommended Next Focus

Resolve the remaining Q10 scope by checking R3/R4's exact file set and their smallest safe end-to-end surface lifecycle change. Keep Q11 and Q12 open.

## Output Verification

- Append gateway exit 0; receipt sequence 6, event ID `event-acc09cc9-c52a-40ff-8211-f4e513d28bc2`, `projectionRefreshed: true`.
- Required verification command: `node .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs --loop-type research --artifact-dir specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast-r2 --iteration 5` — exit 0; output: `OK iteration 5 complete: narrative + route-proof + delta`.
- The verifier warns that route proof comes from the delta because the state projection carries no leaf-dispatch fields; the workflow patches executor provenance after this worker exits. An initial command typo pointed at `system-spec-kit/runtime/scripts/verify-iteration.cjs` and failed with `MODULE_NOT_FOUND`; the required system-deep-loop path above passed.
- The iteration file and delta exist at their required paths; all six delta findings have `sources` arrays. No repository target was modified in COPY_A; only the two example directories and the verifier copy changed.

## SCOPE VIOLATIONS

None. Repository writes were limited to this iteration narrative, this iteration delta and the append gateway's state record.

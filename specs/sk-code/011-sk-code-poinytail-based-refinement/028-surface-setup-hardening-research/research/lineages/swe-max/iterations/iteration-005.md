# Iteration 5: Q5/Q6 consolidation — deduplicated recommendation list, rejected ideas, the naming decision, and proposed build phases

## Focus

Final iteration, consolidation only — no new probes. Dispatch asks for (1) a deduplicated, ranked recommendation list with NEW/ALREADY-COVERED classification, (2) rejected ideas with reasons, (3) ONE name answering the doctor-command vs hub-mode question, (4) build phases with observable acceptance checks. Read both lineages' eight iteration files and 025 sections 5–14; re-opened the naming-decision evidence (`.skilled/commands/README.txt:40-179`, `.skilled/commands/doctor/_routes.yaml:1-60`) this iteration per the re-open rule.

## Actions Taken

1. Read `deep-research-config.json` and `deep-research-strategy.md` (session `dr-028-swe-max-2026-10-13T17:31:25.170Z`, iteration 5 of 5; exhausted approaches respected — no provisioned-copy rerun, no compiled-route-admission probing).
2. Read all eight iteration files across `swe-max/iterations/` and `deepseek-max/iterations/`.
3. Read 025 `research.md:252-499` — options (§5), disagreement rulings (§6), ranked recommendations R1–R10 (§7), rejected ideas X1–X24 (§8), superseded phases (§9), verification pass (§13), final list (§14).
4. Re-opened the naming evidence in this iteration: `.skilled/commands/README.txt:46` (doctor group count 8), `:102-112` (tree, one command per owner), `:157-169` ("Eight command files cover the diagnostic surface, one per owner" + per-command purpose lines); `.skilled/commands/doctor/_routes.yaml:6-20` (owner list; `trigger_phrases` inert; dispatch is presentation-menu/argv-driven), `:35-36` (the add-a-route recipe).

## Findings

| class | claim | evidence | coverage | severity |
|---|---|---|---|---|
| SHAPE | **Naming decision: `/doctor:sk-code` with target `setup`.** A standalone ninth doctor command named for the audited subsystem, not a target under `/doctor:skill-advisor`. Deciding evidence re-opened this iteration: README.txt:157 states the family is "one per owner" and :162 scopes `/doctor:skill-advisor` to "re-tune routing, rebuild the skill graph, or audit graph freshness, router reach, description budget and parent-skill structure" — a surfaces/setup battery is not advisor machinery; `_routes.yaml:6-10` names one owner per command; an external user's vocabulary is "sk-code", never "skill-advisor", so `/doctor:skill-advisor surface-setup` teaches a name that mis-describes what is audited. Target `setup` over `surfaces` because the audited scope includes the provisioning leg (below), not only surface registration. | [SOURCE: .skilled/commands/README.txt:46], [SOURCE: .skilled/commands/README.txt:102-112], [SOURCE: .skilled/commands/README.txt:157-169], [SOURCE: .skilled/commands/doctor/_routes.yaml:6-20], [SOURCE: .skilled/commands/doctor/_routes.yaml:35-36]; disagreement source: swe-max iter 2/4 option rows vs deepseek-max iter 3/4 option rows | NEW (both lineages converged on doctor-side; they disagreed on the target's owner — resolved here) | P1 |
| SHAPE | **Where it is referenced.** Doctor commands are not advisor-routed (`_routes.yaml:13-20`: `trigger_phrases` inert, dispatch is menu/argv), so no hub routing site must point at it. Reference sites: the README block's verify step (README.md:1474-1483), the hub README VERIFICATION section (`.skilled/skills/sk-code/README.md:116-122`, per deepseek iter 3), and the doctor index edits (README.txt:46 count 8→9, :102 tree, :157-169 section). Not in hub SKILL.md/ROUTER.md — no routing contract changes. | [SOURCE: .skilled/commands/doctor/_routes.yaml:13-20]; deepseek-max iter 3 finding 8; deepseek-max iter 4 finding 11 | NEW in detail (026 R9 built the README block as the reference site) | P2 |
| BREAK | Correction to swe-max iter 4's P0 claim "no observed tool mints the activation manifest": the 025 verification pass established the pre-commit `gate:route-remint` writes and stages the manifest copy at commit (F89). The surviving gap is narrower: between a hand add and the commit, `compiled-route-sync` fails `MOVE-SIMULATION FAILED: promoted closure failed to resolve hubs: sk-code` naming no fix, and `compiled-route.cjs` silently serves `{"servingAuthority":"legacy"}` (the designed fail-safe; X22 rejected messaging it at runtime). Users without git hooks never reach the mint. | [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:453], [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:473]; swe-max iter 4 findings 1-2; deepseek iter 4 findings 4-5 | ALREADY-COVERED in substance (025 F53/F55/F89, X22); NEW correction narrowing the claim — the mint exists but is commit-gated | P1 |
| JOURNEY | The clone-to-green P0 has a one-command fix that no adapting doc names: `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision <dir>` turns a true `git clone` (no node_modules, no dist) green — verified exit 0 → `parent-skill-check`=0, `ci-skill-root-metadata`=0 (14/14), guard=0 — while README §4 teaches four manual npm steps that are a strict subset, and the adapting block's "Before you start" names neither. | swe-max iter 3 finding 1-2 (clone run exits recorded); [SOURCE: README.md:1449-1452]; [SOURCE: README.md:164-183]; provision list `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | NEW | P0 |
| BREAK | Unprovisioned scripts die with a raw `Cannot find module '@spec-kit/shared/...'` loader stack — the only battery state with no named fix; R3/R7's message contract starts after the contract library loads. | swe-max iter 1 findings 1-2 (clone run: `ci-skill-root-metadata.cjs` exit 1, CJS loader stack); load site `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65` | NEW | P0 |
| JOURNEY | After a faithful `update --surfaces`, the residual red set is enumerable and two items are guide-omitted: `5k-canary` (disclaimed by the handoff — covered by R8), `stale-manifest` on the guard (commit-time mint, F89), `doc-claims` surface counts in `shared/references/phase-detection.md:16` + README.md:23 + SKILL.md:40 (no step names phase-detection.md), and `10a`/`ci-skill-root-metadata` `MODE_LEAF_SET_COLLISION` needing authored `leaf-scopes.json` when a packet is copied as a model (README never mentions leaf-scopes.json). | swe-max iter 2 findings 1-2; deepseek iter 4 findings 2-3 (copy runs, FAIL lines quoted); [SOURCE: README.md:1466-1472] | partially NEW (R8 covers canary+re-mint; phase-detection.md and leaf-scopes.json are unlisted) | P1 |
| DOC | The remove leg's cleanup list misses committed-file sites both lineages verified: `graph-metadata.json` names the examples at :206, :223-229, :254, :282 (path lists, not the F12 vocabulary site); the sk-code manual-testing playbook names them in 21 files/159 hits and the feature catalog presents them as live surfaces (feature-catalog.md:15,35; two-axis-registry-driven-routing.md:26) — no gate compares either to the registry. | deepseek iter 1 finding 3, iter 2 findings 6-7 (grep counts + file lists); [SOURCE: .skilled/skills/sk-code/graph-metadata.json:206] | NEW (not in 025 R3's removal checklist) | P2 |
| BREAK | Guard message completeness: the `stale-manifest` branch prints `Re-mint: sk-code` — a verb, no command; the refresh+copy pair lives only at README:1451. Distinct from R3's authored-drift fix: the named-file repair landed on a different branch. Sync's resolve-failure branch likewise names no mint/copy-back (F55's deadlock branch is the one that got the named copy-back). | deepseek iter 4 finding 6; swe-max iter 4 finding 1; [SOURCE: README.md:1451]; 025 research.md:299 (R3 scope: authored-drift line), :454 (F55) | NEW in detail (026 R3/R7 principle; these two branches unshipped) | P1 |
| AUTOMATION | The battery probe leg is mechanically assertable but unasserted today: `compiled-route.cjs --prompt` exits 0 on the `servingAuthority:"legacy"` stub — README:1474's "check that your surface comes first" cannot fail. A `setup` asset asserts `targets[0]`/non-legacy, converting a manual read into a gate. | deepseek iter 4 findings 4, 9 (pristine vs stand-in probe output; timed 14.0 s / 15.4 s) | NEW | P1 |
| BREAK | 5l blind spot confirmed empirically: a tieBreak name placed after `sk-code-skilled` but NOT declared in `mode-registry.json` passes 5l silently; only 5e's generic permutation extra catches it with no tie-order hint. Declared surfaces get the named fix. | deepseek iter 2 finding 10 (copy probes A/B); filter at [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171] | partially NEW (027 added 5l; the undeclared-name hole unrecorded) | P2 |
| OK | Hermes copies self-heal (`--check` STALE → write run prunes; pre-commit gate `MIRROR_CHECKS` blocks with a named fix); the six non-Hermes mirrors carry no example names and no order; benchmarks are a retired frozen lane; the advisor corpus is clean beyond `graph-metadata.json`'s path lists; `modes` is a JSON array, not a keyed map (swe-max iter 1's shape claim self-corrected in iter 3 — literal delete is safe; only a programmatic `delete` leaves the `null` hole 3d reports). | deepseek iter 1-2 (copy runs, exits); swe-max iter 3 finding 3 (mode-registry.json:22 `"modes": [`); [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:234] | mixed ALREADY-COVERED (025 F70/F91, 026 R3/R7) with NEW corrections (F69 contradicted by the tree) | P2 |

## Consolidated Recommendation List (deduplicated, ranked)

| # | option | what it changes, path:line | failure it prevents today | cost and blast radius | cheaper move and why it fails | class |
|---|---|---|---|---|---|---|
| 1 | README adapting block names the provisioner: `worktree-naming.sh provision <dir>` in "Before you start" | README.md:1449-1452 (+1-2 lines); optionally collapse §4's four manual steps (README.md:164-183) into the one command | P0: a true `git clone` fails `parent-skill-check` and `ci-skill-root-metadata` on missing `@spec-kit/shared` dist before any adaptation, with no discovery path to the one command that fixes it | Doc-only, ~2 lines | §4's four npm steps: a strict subset of the 10-root provision list; leaves the gap for whichever roots they omit | NEW |
| 2 | Named provisioning failure in the battery entry points: wrap the `@spec-kit/shared` require so missing dist prints "run worktree-naming.sh provision" | `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65` (load site) or a shared guard at each entry point | P0: raw CJS loader stack is the only battery state that names no fix — the one message R3/R7 don't reach | A try/catch + message at one require site; blast = the loader path only | README-only: a user who starts from the failing output never sees the doc | NEW |
| 3 | `/doctor:sk-code` command, read-only target `setup`: runs the six-leg README battery in order plus a targets/non-legacy assertion on the probe leg, reporting each failing leg with its named fix | new `.skilled/commands/doctor/sk-code.md`; `_routes.yaml` route row; `assets/doctor-sk-code-setup.yaml` + presentation; README.txt:46,102,157-169; one reference line at README.md:1474-1483 and hub README:116-122 | P1: six-command copy-paste across four directories with six interpretations; `Re-mint: sk-code` dead end; probe leg exits 0 on a stub; sync green masks a stale hub | ~5 files + 3 index edits; route-validate B2/B3/D1/I1/J1/K1/L1 + command-catalog structural tier; read-only contract (`forbidden_targets`); zero write authority | Target under `/doctor:skill-advisor`: fails the one-per-owner convention (README.txt:157, :162) and the user's vocabulary; extending `parent-skill` in place misreports compiled-route/drift failures under a structural-audit contract | NEW |
| 4 | Guard `stale-manifest` branch and sync resolve-failure branch name the actual commands (refresh+copy pair at README:1451; mint path) | `compiled-route-guard.cjs` stale-manifest verdict text (~:160); `compiled-route-sync.cjs` promote/resolve failure branch | P1: a user staring at `Re-mint: sk-code` or `MOVE-SIMULATION FAILED … resolve hubs` has no next step; doctor is green at that moment, so the two gates are disjoint | Two message strings; output-only | Pointing doctor at it: the checks are green during the window these fail; documenting again fails the user who starts from output (same argument R3 won with) | NEW detail (extends 026 R3 to two unshipped branches) |
| 5 | `update --surfaces` step_5/step_6 closes the residual set: run or print `verify-doc-claims` (naming phase-detection.md:16, README.md:23, SKILL.md:40) and name `leaf-scopes.json` as the collision fix | `.skilled/commands/create/assets/create-skill-parent-auto.yaml:495-505` + confirm twin | P1: the command exits STATUS=OK while `doc-claims` is guaranteed red on any add, and a packet copied as a model hits `MODE_LEAF_SET_COLLISION` against a file no doc names | One script call + one follow-up line in a workflow that already runs `parent-skill-check` | README prose alone: the workflow already validates and exits OK — discovery stays on the user every run | NEW (residual items beyond R8's canary/re-mint) |
| 6 | Extend 5l's filter to flag undeclared tieBreak names after the native surface | `parent-skill-check.cjs:1170-1171` (`checkNativeSurfaceLast` filter) | P2: a hand-added undeclared name after opencode gets only 5e's permutation complaint and no tie-order explanation | One filter branch; must not double-report with 5e | Relying on 5e: it catches the permutation but never explains the cost or names the fix | partially NEW (027 extension) |
| 7 | Remove-leg checklist additions: `graph-metadata.json` example entries (:206,:223-229,:254,:282), playbook/catalog rows, `leaf-scopes.json` | README.md:1454-1464 removal steps | P2: leftover example references in advisor-facing metadata and docs survive a checklist-faithful removal | Doc rows only | Nothing cheaper exists — these are deletions the user must perform | NEW |

ALREADY-COVERED items explicitly not re-made: scaffold tieBreak placement (025 R1 → 026), drift-guard example tolerance under scaffolded removal (R2 → 026), doctor/guard/sync named fixes on covered branches (R3/R7 → 026), scaffold handoff (R8 → 026), example markers + README block as the guide (R4/R9 → 026), 5l's existence (027), the canary-fixture removal semantics (025 F46/R3), ROUTER.md §11 hand-edit requirement (025 F86/X19).

## Rejected Ideas (Q5, final)

| idea | reason | evidence |
|---|---|---|
| Hub mode `sk-code-setup` | Two-axis discriminator admits only `packetKind: workflow|surface`; setup is neither. Routing dead end: `hub-identity` discovery classes score zero modes and defer; setup prompts never reach sk-code; a new mode is reachable only by explicit hint — invisible to the users who need it. Cost: 15+ files + contract extension + canary/compiled re-mint. Both lineages reject independently | [SOURCE: .skilled/skills/sk-code/mode-registry.json:5-9]; [SOURCE: .skilled/skills/sk-code/hub-router.json:17-18]; deepseek iter 3 findings 4-5; swe-max iter 4 option 4 |
| Extend `parent-skill` target in place with the battery | Its contract is the structural audit (doctor-parent-skill.yaml:23-34); compiled-route/drift failures would misreport under a structural-audit name and change what a passing `parent-skill` means | [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:23-34]; deepseek iter 4 option 1 cheaper-move cell |
| Mutating doctor routes (provision, re-mint, hermes sync inside the new target) | Violates the read-only route contract (route-validate L1; `forbidden_targets: ["**/*"]`); the collision repair needs authored `leaf-scopes.json` judgment regardless — printing the commands is the boundary | deepseek iter 4 option 3; [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:101-104] |
| Standalone terminal script duplicating `update --surfaces` | A second path to the same mutations for one caller class — the X8/X11 cost pattern; the judgment pockets (vocabulary authoring, spec governance) remain either way. The Phase-0 AI-runtime gate (auto.yaml:14-23) is real but the doctor `setup` route's per-leg reporting covers the shell user's position after hand edits | [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:14-23]; 025 X8/X11; swe-max iter 2 finding 9 |
| Naming the scaffolded removal inside 3c's message | 026 R3 already made 3c name the README block; X11 keeps a removal command rejected. The residual (5l also naming it) is folded into rec 6's branch | 025 research.md:299 (R3), :324 (X11); deepseek iter 2 option 1 |
| New guard leg stat-ing packet dirs; auto-generated canary; warn-only 5k; runtime messaging of the legacy stub | 025 rulings stand unchallenged by this research | 025 X7, X10, X18, X22 |

## Proposed Build Phases

| Phase | Scope | Observable acceptance check |
|---|---|---|
| A — Docs and messages (recs 1, 2, 4, 7) | README block names provision + the added checklist rows; provision-aware loader message; guard/sync message branches | In a fresh `git clone` copy: following only the README block reaches provision-green; unprovisioned `ci-skill-root-metadata` prints the named command (no stack); in a reorder copy, guard's stale line and sync's resolve failure each print the command pair |
| B — `/doctor:sk-code setup` (rec 3) | Router doc, route row, read-only asset + presentation, index edits, two reference lines | `route-validate.sh` exit 0; `command-catalog-mirror-check` green; in pristine copy the target exits 0; in a stand-in-add copy it reports 5k-canary/stale-manifest/doc-claims each with the named fix and fails the probe assertion on the legacy stub |
| C — Scaffold residual closure (recs 5, 6) | `update --surfaces` step_5/6 additions; 5l filter branch | In a copy: after a stand-in add the workflow output names every remaining red leg; an undeclared tieBreak name after opencode fails 5l with the tie-order message (not only 5e) |

## Questions Answered

- Q4 fully settled this iteration: `/doctor:sk-code` + target `setup`; hub-mode shape rejected on the two-axis contract and the routing dead end; reference sites enumerated.
- Q5: rejection table above.
- Q6: per-row NEW / ALREADY-COVERED classifications above.

## Questions Remaining

- Q1 tail stays open by deferral, not exhaustion: whether `.` and `.skilled` provision roots are individually required (subset never isolated); `sync-skills-hermes.cjs`/`test_readme_manifest.py` add-leg behavior (never observed). Consolidation consumed the budget; both are recorded for the packet's open questions.

## Lineage Disagreements Resolved

| disagreement | positions | deciding evidence |
|---|---|---|
| Doctor target owner | swe-max iters 2/4: target under `/doctor:skill-advisor`; deepseek iters 3/4: standalone `/doctor:sk-code` (naming match) | README.txt:157 "one per owner" + :162 advisor scope line + `_routes.yaml:6-10` — resolved for `/doctor:sk-code` |
| Does anything mint the activation manifest | swe-max iter 4: "no observed tool mints it"; 025 F89: pre-commit gate mints and stages at commit | 025 research.md:453,:473 (verification pass) — resolved: commit-gated mint exists; gap is the pre-commit window |
| `mode-registry.json` `modes` shape | swe-max iter 1: numerically keyed object; swe-max iter 3: JSON array | mode-registry.json:22 `"modes": [` — array; iter 1's `Object.keys` evidence was shape-ambiguous. Resolved within-lineage |
| Bare-delete tolerance | deepseek iter 2: umbrella fails post-delete, "contradicts R2"; R2 scope was scaffolded removal | Consistent once scoped: R2's tolerance is post-scaffolded-removal; bare `rm -rf` was never claimed tolerated |

## Ruled Out

- New copy probes this iteration: consolidation focus; the two open Q1 tails need a copy and are deferred, not dead.
- Re-reading individual 025 F-rows: sections 5-9/13-14 carry the verified rulings; row-level detail unchanged by this pass.

## Dead Ends

- None new.

## Edge Cases

- Contradictory evidence: three cross-source contradictions resolved with both sides cited (mint claim vs F89; F69 vs `.hermes` tree — resolved in prior iterations and re-confirmed; R2 vs bare-delete — resolved by scoping).
- Missing dependencies: the two Q1 tails above.
- Partial success: none — this iteration is synthesis; `insight` status chosen honestly (low new external evidence, material reframing + one correction).

## Sources Consulted

- `research/lineages/swe-max/iterations/iteration-001.md`–`iteration-004.md`; `research/lineages/deepseek-max/iterations/iteration-001.md`–`iteration-004.md` (all eight, full)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:252-499` (§5 options, §6 rulings, §7 R1-R10, §8 X1-X24, §9 phases, §13 verification, §14 final list)
- `.skilled/commands/README.txt:40-179`; `.skilled/commands/doctor/_routes.yaml:1-60`
- Citations carried forward inside the table rows: `mode-registry.json:5-9,22`; `hub-router.json:7,17-18`; `parent-skill-check.cjs:1170-1171`; `create-skill-parent-auto.yaml:14-23,495-505`; `README.md:1445-1483`; `doctor-parent-skill.yaml:23-34,101-104`; `graph-metadata.json:206,223-229,254,282`; `sync-skills-hermes.cjs:234`; `root-router-contract.cjs:65`; `worktree-provision-paths.txt`; `sk-code/README.md:116-122`

## Assessment

- New information ratio: 0.40 — 3 of 11 rows are new synthesis (naming decision + reference map, phase plan, F89 correction of the mint claim); 8 rows consolidate/verify both lineages' evidence against reopened primary sources; +0.10 simplicity bonus for resolving the naming disagreement and the mint contradiction.
- Questions addressed: Q4 (final name), Q5, Q6.
- Questions answered: none ticked at strategy level — Q1's residual tails remain open.

## Reflection

- What worked: re-reading 025's verification pass (§13) before consolidating caught that swe-max iter 4's strongest P0 ("nothing mints the manifest") was already falsified by F89 — the correction narrows the fix from "build a mint" to "name it in two message branches".
- What did not: nothing structural; the eight iteration files were internally consistent enough that consolidation needed only targeted re-opens.
- What I would do differently: nothing material for a final iteration.

## Recommended Next Focus

None — final iteration (5 of 5). If the packet continues: the two Q1 tails (provision-root subset isolation; Hermes/readme-manifest add-leg behavior in a copy).

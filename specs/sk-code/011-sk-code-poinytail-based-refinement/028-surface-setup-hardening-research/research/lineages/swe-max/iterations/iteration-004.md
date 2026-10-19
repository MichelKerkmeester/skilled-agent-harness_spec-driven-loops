# Iteration 4: User-surface add leg — advisor + compiled routing + hand-edit detection; Q4 doctor-vs-mode weighed from primary sources

## Focus

Two legs from the dispatch. (a) Q1: in a provisioned copy, add a `sk-code-rails` stand-in surface the way `/create:skill-parent update --surfaces` would, refresh the compiled manifest, then probe `skill-advisor.cjs advisor_recommend` and `compiled-route.cjs` for stack prompts, and break `routerSignals`/`workflowMode` by hand to see if doctor/guard name the fix. (b) Q4: independently weigh a new doctor command vs a new sk-code hub mode, from `.skilled/commands/doctor/_routes.yaml` and `.skilled/skills/sk-code/mode-registry.json`.

Copy used: `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/swe-max-i4-CtTk` (provisioned APFS clone of the prepared base; all mutations confined to it).

## Actions Taken

1. Read state (config, strategy, registry) and the two Q4 primary sources (`_routes.yaml`, `mode-registry.json`), plus `hub-router.json`.
2. In the copy, added `sk-code-rails` across 8 registration surfaces: packet dir + SKILL.md, `hub-router.json` (`tieBreak` inserted ahead of `sk-code-skilled`, `routerSignals` entry, two `vocabularyClasses`), `mode-registry.json` (modes[] entry + `surface-axis.surfaces`), `leaf-manifest.json`, `description.json` keywords, SKILL.md mode-table row, README+changelog, canary case.
3. Ran `parent-skill-check.cjs`, `compiled-route-sync.cjs`, `compiled-route.cjs`, `skill-advisor.cjs advisor_recommend`, `compiled-route-guard.cjs` at each stage.
4. Hand-broke `routerSignals` class ref and renamed `workflowMode`, re-ran doctor.

## Findings (finding rows)

| class | claim | evidence | status | severity |
|---|---|---|---|---|
| BREAK | `compiled-route-sync.cjs` refuses to promote after a complete hand-added surface: `SYNC FAILED: MOVE-SIMULATION FAILED: promoted closure failed to resolve hubs: sk-code` — and this persists AFTER `parent-skill-check` reports `OK: all hard invariants passed`. The sync error names no fix and no mint command. The authored activation manifest `013-live-activation/activation/sk-code/manifest.json` is a separately minted artifact; no observed tool mints it (`compiled-route-admission.cjs` rejects `--help`, unknown interface). | copy run: sync exit 1 after green parent-check; `rg obsidian|modes` inside `…/013-live-activation/activation/sk-code/manifest.json` returns no mode names; `resolve.cjs:88-98` reads `ACTIVATION_ROOT/<hub>/manifest.json` and "a drifted rollout artifact fails safe" (`resolve.cjs:12`) | NEW | P0 |
| BREAK | While the manifest is unpromoted, `compiled-route.cjs --hub sk-code --prompt …` silently returns `{"servingAuthority":"legacy","hubId":"sk-code"}` for both rails and django prompts — the new surface is invisible to compiled routing and there is no prompt-time error. An external user who hand-adds a surface and stops at a green doctor gets routing that silently ignores their surface. | copy run: two `compiled-route.cjs` probes, both `servingAuthority:"legacy"` | NEW | P0 |
| OK | The hand-add contract is 9 registration surfaces, and `parent-skill-check` names every gap with the fix or artifact: `6b` SKILL.md mode-table row, `5k-alias` aliases ⊆ routerSignal-class keywords, `5k-packet` packet name in `description.json` keywords, `5k-canary` canary case, `3d-files` README.md + changelog/, `10b` leaf-manifest byte-drift (names `generate-leaf-manifest.cjs --write <dir>` verbatim). After fixing all, `OK: all hard invariants passed`. | copy run: parent-skill-check output at each stage | ALREADY-COVERED by 026 R3/R7 (doctor names the fix) — new evidence: the complete 9-point checklist and that `leaf-manifest.json` is generator-owned (same entries, different byte layout = FAIL, so hand-editing it always trips 10b) | P1 |
| BREAK | Hand edits are caught with named fixes: broken routerSignals class → `5c: routerSignals reference undefined vocabulary class(es): [code-rails-alias]`; workflowMode rename → `5b` (missing/stray signals), `5e` (tieBreak not exact permutation, names extras+missing), `6b`, `10b` (with added/removed rows), `10d` (registry↔manifest mismatch). | copy run: two break probes, parent-skill-check output | ALREADY-COVERED by 026 R3/R7 — new evidence: the specific check ids 5b/5c/5e/10d as the hand-edit detection matrix | P1 |
| OK | Stack prompts DO reach `sk-code` through the advisor once `description.json` carries the stack keywords: `advisor_recommend "implement a rails controller with strong params"` → `sk-code`, confidence 0.82 vs threshold 0.8, `dominantLane: explicit_author`. Surfaces are advisor-invisible by contract (`mode-registry.json:12`: "the advisor routes the single identity sk-code"), so R5's worry can't happen at advisor level — `sk-code-skilled` has no independent advisor identity to steal the route. | copy run: advisor JSON output; `.skilled/skills/sk-code/mode-registry.json:12` | NEW (evidence) | P1 |
| OK | R5 UX cost is confined to hub-internal surface selection: equal `weight:4` routerSignals (`hub-router.json:21-47`) tie-break by `routerPolicy.tieBreak` order (`hub-router.json:7`), so a user surface inserted ahead of `sk-code-skilled` wins equal-score prompts; opencode's generic language keywords (`code-skilled-runtime`: typescript/python/shell/json, `hub-router.json:82-84`) only outrank a user surface if the user surface is placed after it — exactly the case doctor check `5l` (027) reports. Cost when it bites: a mixed-stack prompt (`python` + user framework) silently bundles opencode evidence instead of the user's surface. | `hub-router.json:7,36-39,82-84`; inference on tie mechanics from equal weights + order | ALREADY-COVERED by 027 check 5l + 025 findings on tie order — new evidence: mechanism confirmed end-to-end in copy (tieBreak insert ahead of opencode passed `5l` and `5e`) | P2 |
| SHAPE | Q4 independent read: a new hub mode is the wrong shape. `mode-registry.json`'s discriminator admits only `packetKind: workflow|surface` (`mode-registry.json:7-9,18`); a setup audit is neither code-workflow nor domain evidence, and adding it as `workflow` would give it `routerSignals` vocabulary that competes with user stacks for every code prompt. A doctor route is the natural shape: `_routes.yaml:35-36` gives the add recipe ("append a route here … then re-run route-validate.sh"), and `/doctor:skill-advisor` already owns `parent-skill` which invokes `parent-skill-check.cjs` (`_routes.yaml:141-160`). A dedicated target (e.g. `/doctor:skill-advisor` target `surface-setup`, asset `doctor-sk-code-surface-setup.yaml`) would be thin sugar over `parent-skill` + `compiled-route-sync --check` + an advisor probe. | `.skilled/skills/sk-code/mode-registry.json:5-19`; `.skilled/commands/doctor/_routes.yaml:35-36,140-160` | ALREADY-COVERED by 028 iteration-2 Q4 resolution — independent confirmation from primary sources; new evidence: the packetKind discriminator is the structural blocker for the hub-mode shape, not just cost | P1 |
| AUTOMATION | The real uncovered gap is the activation-manifest mint: `update --surfaces` already writes the other registration points, but nothing observed re-mints `013-live-activation/activation/sk-code/manifest.json`, and `compiled-route-sync` treats drift as fail-safe. Smallest change: have `update --surfaces` (or sync) invoke whatever mints the activation manifest, or make sync's error name the mint command. Cheaper move that fails: documenting the mint step — a doc can't fix a fail-safe that blocks promotion. | copy run: sync failure after green doctor; `resolve.cjs:10-12` | NEW | P0 |

## Options

| option | what it changes | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| Mint activation manifest in `update --surfaces` | `sk-doc/sk-create-skill` surface-update path also regenerates `013-live-activation/activation/<hub>/manifest.json` | New surface invisible to compiled routing (`servingAuthority:legacy` silence) while doctor is green | One generator call added to an existing mutating workflow; blast = the surface-update path only | Sync error message alone: names no fix, and the user still can't produce the manifest by hand |
| Make sync's resolve failure name the mint command | `compiled-route-sync.cjs` error text at `compiled-route-sync.cjs` (the `promoted closure failed to resolve hubs` branch) | User stares at `MOVE-SIMULATION FAILED` with no next step | A string change in one error path | Relying on doctor: parent-skill-check is green at the moment sync fails — the two gates are disjoint, so doctor can't substitute |
| New doctor target `surface-setup` under `/doctor:skill-advisor` | `_routes.yaml` route row + `assets/doctor-sk-code-surface-setup.yaml` composing parent-skill-check + sync `--check` + advisor probe | Discoverability of the add-surface checklist | One yaml route + one asset + `route-validate.sh`; overlaps `parent-skill` target (`_routes.yaml:140-160`) | It is ~80% a re-wrap of `parent-skill`; without the mint fix it still can't turn sync green |
| New hub mode `sk-code-setup` | mode-registry entry, packet dir, routerSignals class | — | Requires a third `packetKind` or abuses `workflow`; pollutes routing vocabulary; large blast | REJECTED: violates the two-axis discriminator (`mode-registry.json:7-9`); setup is operator-initiated, not prompt-routed — a "setup" keyword class would steal code prompts |

## Ruled Out

- Hand-editing `leaf-manifest.json`: generator-owned; `10b` byte-drift fires on same entries/different bytes. `generate-leaf-manifest.cjs --write` is the only writer.
- Probing which single invariant blocks `resolve hubs`: exhausted 3 sync attempts with distinct fixes applied; the blocker is upstream of doctor's invariant set (activation manifest mint), not a missing packet field (frontmatter completed to match `sk-code-obsidian`'s shape and sync still failed).

## Dead Ends

- `compiled-route-admission.cjs` is not the mint entry point (rejects `--help`, interface undetermined in budget). What would settle it: find the generator of `013-live-activation/activation/*/manifest.json` — likely the admission pipeline under `.skilled/bin/lib/compiled-routing/` — and check whether `update --surfaces` calls it.

## Edge Cases

- Partial success: the add leg reached doctor-green but not sync-green; the unpromoted state is itself the finding (P0 pair above). Status `complete` chosen because both legs produced cited decisive evidence.
- Missing dependency: the manifest mint tool was not located within command budget; recorded as dead end for iteration 5.

## Sources Consulted

- `.skilled/skills/sk-code/hub-router.json:7,20-47,82-84`
- `.skilled/skills/sk-code/mode-registry.json:5-19`
- `.skilled/commands/doctor/_routes.yaml:35-36,140-160`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:10-12,88-98`
- `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md:1-12` (frontmatter contract)
- copy-run command outputs (parent-skill-check, compiled-route-sync, compiled-route, advisor_recommend, compiled-route-guard)

## Assessment

- New information ratio: 0.75
- Questions addressed: Q1 (advisor + compiled-routing + hand-edit legs), Q4 (independent), Q5, Q6
- Questions answered: Q5, Q6. Q1 left open — Hermes copies and runtime mirrors legs remain unobserved.

## Reflection

- What worked: driving the real doctor guard between each mutation turned the add leg into an enumerated contract — every FAIL line named the next fix. Re-minting leaf-manifest via its generator was the unlock for 10b.
- What did not: three sync attempts to isolate the `resolve hubs` blocker; the fail-safe is upstream of the doctor invariant set. Should have traced `resolve.cjs` hub loading earlier instead of guessing at frontmatter.
- Differently: probe `compiled-route-admission.cjs` interface directly (read its argv parsing) rather than `--help`.

## Recommended Next Focus

Find what mints `013-live-activation/activation/sk-code/manifest.json` (read `compiled-route-admission.cjs` argv handling; check whether `/create:skill-parent update --surfaces` invokes it). If it is not invoked, that is the concrete P0 fix target. Remaining unprobed Q1 legs: Hermes copies, runtime mirrors under hand edits.

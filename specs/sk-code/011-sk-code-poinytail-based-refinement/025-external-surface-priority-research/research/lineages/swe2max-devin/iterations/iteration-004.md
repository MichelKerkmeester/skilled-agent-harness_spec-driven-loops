# Iteration 4: Q10/R1 — every tieBreak write/doc/check site, exact edit text, and a live tie test

## Focus

Q10, R1 slice: enumerate every place that writes, documents or checks `routerPolicy.tieBreak` position for a new surface; write the exact replacement text R1 needs per site; verify whether the scaffold writes tieBreak on the `update --surfaces` path; and prove the rule in a throwaway copy — stand-in surface inserted ahead of `sk-code-opencode`, re-mint, route a tied prompt. Operator lens: where an external user gets stuck, the exact message, and which manual step an existing command could absorb.

## Actions Taken

- `rg tieBreak` over `.skilled/`, root `README.md`, and `sk-create-skill` — full site census (write sites, doc sites, check sites separated below).
- Read `create-skill-parent-auto.yaml:410-435` (step_4), `create-skill-parent-confirm.yaml:275-295,462`, `skill-parent.md:95-115`, `parent-skills-nested-packets.md:205-240`, `parent-hub-router-schema.md:65-91,272-335`, `upgrading-a-skill-to-v4.md:157-217`, `init_skill.py:613-617`, `verify-router-sync.cjs:1-45`, `compiled-route.cjs:15-60`, `parent-skill-check.cjs` 5e/5i legs (`1075-1087`, `1142-1156`, `1309-1319`), `sk-code/SKILL.md:63,74`, `sk-code/README.md`, `README.md:1444-1453`, `sk-code-obsidian/changelog/v0.1.0.0.md:94`, `skill-root-metadata-contract.md:188`.
- Throwaway copy `$X=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2-swe2max-devin-i4.JB89` (APFS clone of prepared base): baseline route → `surgery.cjs` (clone `sk-code-opencode` routerSignals+3 vocabularyClasses→`code-myapp-*`, registry entry cloned, tieBreak spliced ahead of opencode) → route PRE-refresh → `compiled-route-manifest.cjs refresh` → route POST-refresh → `compiled-route-sync.cjs --check` → `parent-skill-check.cjs` → `git status` + `cmp` authored vs runtime manifest + `ls` authored route-gold dir.
- Copy path, commands and exits are quoted per finding. `surgery.cjs` and all mutations lived only under `$X`.

## Findings

| class | claim | evidence | sev |
|---|---|---|---|
| ORDER | The one order source is `sk-code/hub-router.json` `routerPolicy.tieBreak` = `[quality, review, opencode, obsidian, webflow]`; the array mixes workflow and surface modes in one precedence list. | `.skilled/skills/sk-code/hub-router.json:7` | P1 |
| ORDER | tieBreak has a hard two-class structure enforced by doctor 5i: workflow modes must sort before surface/transport modes. A user surface can lead the *surface segment* but can never legally sit above `sk-code-quality`/`sk-code-review`. R1's correct insertion point is therefore "immediately before `sk-code-opencode`", not "first". | `parent-skill-check.cjs:1142-1156` (`checkTieBreakOrder`, `firstNonWorkflow` softFail); copy `$X` doctor output `PASS: 5i` with `myapp` ahead of opencode | P1 |
| BREAK | **Editing `hub-router.json` without re-mint silently degrades routing.** Post-edit, pre-refresh `compiled-route.cjs` returned `{"servingAuthority":"legacy","hubId":"sk-code"}` — no targets, no error, no "re-mint required" message. Baseline same prompt pre-edit returned a full `single`→`sk-code-opencode` route. This is the single sharpest external-user stuck point found this round: the authored policy hash no longer matches the minted `effectivePolicyHash`, and the failure mode is an opaque stub, not a message. | copy `$X`: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "implement a typescript CLI hook with shell config"` before edit → `selectionKind:"single"`, hash `8cd6f489…`; after edit pre-refresh → `{"servingAuthority":"legacy"}` | P0 |
| OK | **R1's mechanism is proven end-to-end.** With `sk-code-myapp` (identical cloned signals = guaranteed tie) spliced ahead of `sk-code-opencode` and `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` run (exit 0, `refreshed:true`, new policy hash `f44b77a5…`), the same prompt routes `selectionKind:"orderedBundle"` with targets `[sk-code-myapp, sk-code-opencode]` — own surface leads the tie. tieBreak is baked into the minted `effectivePolicyHash`; the edit has zero effect until refresh. | copy `$X`: refresh output `manifestPath .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`; post-refresh route JSON quoted | P0 |
| BREAK | `refresh` writes ONLY the runtime manifest (`manifestPath` under `.skilled/bin/lib/compiled-routing/…`); the authored twin `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` diverges (`cmp` exit 1). `compiled-route-sync.cjs --check` still reports "all 55 served copies match" — the manifest drift is NOT in sync's compared set; it belongs to `compiled-route-guard.cjs`'s authored-drift leg (iter-3). So the complete re-mint ritual is: edit → `refresh --hub X --skill-root …` → propagate runtime manifest to the authored twin → guard green. No doc names this three-step sequence for a tieBreak edit. | copy `$X`: `git status` shows `M` only on runtime manifest + hub-router + mode-registry; `cmp` exit 1; sync exit 0 | P1 |
| PRESENCE | tieBreak **write** sites: `create-skill-parent-auto.yaml:423` and its confirm twin `create-skill-parent-confirm.yaml:462` — identical text "tieBreak covering all modes" with **no placement rule** (iter-2 observed natural execution appends last). `init_skill.py:613-617` writes `"tieBreak": [mode]` for fresh single-mode scaffolds. The `update --surfaces` path shares step_4 — the scaffold DOES write tieBreak membership on update, but membership only, position unconstrained. | paths:lines as listed; iter-2 copy `$X2` tieBreak-last observation | P1 |
| PRESENCE | tieBreak **check** sites: `parent-skill-check.cjs` 5e (`:1075-1087`, exact permutation of registry modes — copy `$X` printed `PASS: 5e` with myapp registered) and 5i (`:1142-1156`, workflow-first). `verify-router-sync.cjs:31-32` hard-codes `SURFACES=['sk-code-webflow','sk-code-opencode']` / `SURFACE_PACKETS={…,'sk-code-obsidian'}` — a shipped drift guard that assumes both example surfaces exist; deleting them breaks its surface legs independently of tieBreak. | paths:lines; copy `$X` doctor output | P1 |
| DOC | tieBreak **doc** sites and the gap each carries: `README.md:1447-1451` adaptation steps 1-5 (step 2 "Register your packets in mode-registry.json and hub-router.json" — no placement rule, no re-mint step at all); `parent-skills-nested-packets.md:224` row 3 (only the 5e permutation failure is named — position-as-precedence undocumented); `parent-hub-router-schema.md:87,290` (workflow-before-surface policy stated; intra-surface ordering semantics absent; example `:69` orders `code-webflow` BEFORE `code-opencode`, diverging from the shipped array); `upgrading-a-skill-to-v4.md:161` (same workflow-first rule only); `skill-parent.md:105` (component mention only); `sk-code/SKILL.md:74` hard-codes "detection precedence OPENCODE > OBSIDIAN > WEBFLOW" — stale the moment a user surface leads; `sk-code-obsidian/changelog/v0.1.0.0.md:94` documents the membership convention. | paths:lines as listed | P1 |
| DOC | `skill-root-metadata-contract.md:188` records that **sk-doc's** tieBreak is *derived at compile time from routerSignals key order* and hand-editing is inert — a different mechanism than sk-code's minted-hash path. An external user reading both docs gets contradictory mental models of the same field name. | `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:188` | P2 |
| BREAK | Correction to iter-3's BREAK on `verify-router-sync.cjs`: the script's `ROUTE_GOLD_CANDIDATES` (`:18-22`) checks the z_archive path FIRST, and `route-gold.typed.json` exists there (`ls` in copy: `009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json` present). The "reads only the pre-archive path / broken today" claim is at least partially wrong — the candidate list already handles the archive move. Whether some later leg fails remains unverified. | copy `$X`: `ls specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/` → `route-gold.typed.json` present; `verify-router-sync.cjs:17-22` | P2 |
| DOC | Exact stuck-point transcript for an external user adding a surface: (1) follow README steps → surface lands tieBreak-last (iter-2); (2) hand-edit it ahead → router output becomes `{"servingAuthority":"legacy"}` with no explanation; (3) run `parent-skill-check` → `FAIL: 5k-canary: "sk-code-myapp": no canary case routes to it` plus 3c/3d/6b/5k-packet/10b/10d cluster — the canary message does not say how to author a case; (4) nothing in any doc names `compiled-route-manifest.cjs refresh` as the required next step. Step (2)→(4) is one existing command (`refresh`) that simply is never named to the user. | copy `$X` outputs as quoted; `create-skill-parent-auto.yaml:421-433` step_4 runs `generate-leaf-manifest.cjs` but contains NO compiled-route refresh step | P0 |

## Exact R1 edit text (smallest correct fix)

| site | current text | R1 replacement |
|---|---|---|
| `create-skill-parent-auto.yaml:423` + `create-skill-parent-confirm.yaml:462` (keep identical) | `tieBreak covering all modes` | `tieBreak covering all modes — workflow modes first, then surfaces; insert each new surface ahead of the hub's default/generic surface so author-added surfaces outrank it on ties` |
| `README.md:1448` (step 2) | `Register your packets in \`mode-registry.json\` and \`hub-router.json\`, and update the mode table in \`SKILL.md\` §1` | `Register your packets in \`mode-registry.json\` and \`hub-router.json\` — in \`routerPolicy.tieBreak\` place each surface packet ahead of \`sk-code-opencode\` (workflow modes must stay first; the array is the surface precedence order) — update the mode table in \`SKILL.md\` §1, then run \`node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code\` to re-mint the routed policy` |
| `parent-skills-nested-packets.md:224` row-3 consequence cell | `parent-skill-check 5e fails: tieBreak must be an exact permutation of the registry` | `5e fails unless tieBreak is an exact permutation; order is also surface precedence — insert own surfaces ahead of the default surface, keep workflow modes first (5i), and re-mint (\`compiled-route-manifest.cjs refresh\`) or the router serves a stale policy` |
| `sk-code/SKILL.md:74` | `the detection precedence OPENCODE > OBSIDIAN > WEBFLOW` | `the detection precedence from \`routerPolicy.tieBreak\` (shipped: OPENCODE > OBSIDIAN > WEBFLOW; your own surfaces inserted ahead of the shipped defaults lead their ties)` |
| `parent-hub-router-schema.md:290` | `…so a surface cannot outrank a workflow when both are selected for one bundle.` | append: `Within the surface segment, earlier entries win tied prompts — author-added surfaces belong ahead of the shipped generic/default surface.` |
| `upgrading-a-skill-to-v4.md:161` | `workflow modes before surfaces` | `workflow modes before surfaces; own surfaces ahead of the default surface within that segment, then re-mint` |

Files R1 touches: the two workflow YAMLs (one edit each, kept byte-aligned), root `README.md`, `parent-skills-nested-packets.md`, `parent-hub-router-schema.md`, `upgrading-a-skill-to-v4.md`, `sk-code/SKILL.md` — 7 files, all single-line/sub-sentence edits. No code changes.

What still breaks after R1 lands: (a) the `servingAuthority:"legacy"` silent degrade — R1 documents the re-mint but the router still prints no diagnostic; a named error is a separate small fix to `compiled-route.cjs`'s fallback; (b) `5k-canary` gate still exits 1 on any new surface (iter-2, canary authoring absent from the workflow); (c) `verify-router-sync.cjs` SURFACES hardcode still assumes the examples. Is R1 the smallest correct fix under `prevent-overengineering.md`? **Yes** — cheaper moves fail: doc-only (README) leaves the sanctioned command path appending-last and omits the schema-level rule; YAML-only leaves the manual adapter (README path) unguided and never names the re-mint; extending 5i to assert intra-surface order adds a gate for a policy decision, not an invariant — the doctor correctly checks only the two class-level rules it owns.

## Ruled Out

- "R1 = insert surface first in tieBreak" — illegal: 5i enforces workflow-before-surface; correct phrase is "ahead of the default surface" (observed `PASS: 5i` only with that placement shape).
- "No re-mint step needed after editing hub-router.json" — contradicted: route output collapsed to `servingAuthority:"legacy"` until `refresh` ran.
- "sync --check catches post-refresh manifest drift" — contradicted: exit 0 while authored and runtime manifests differed (`cmp` exit 1); the guard, not sync, owns that leg.

## Dead Ends

- None new beyond the ruled-out rows.

## Edge Cases

- Contradictory evidence: iter-3's "verify-router-sync reads pre-archive path, broken today" vs this iteration's `ROUTE_GOLD_CANDIDATES`+`ls` evidence — correction recorded as a finding, not silently dropped.
- Partial success: `compiled-route-guard.cjs` was not re-run in the copy to observe its post-refresh authored-drift verdict (time); the manifest divergence is proven by `cmp`, the guard leg attribution is from iter-3's code read.
- Missing dependency: none.

## Sources Consulted

- `.skilled/skills/sk-code/hub-router.json:7`; `.skilled/bin/compiled-route.cjs:15-60`; `.skilled/bin/compiled-route-manifest.cjs` usage line; `.skilled/bin/compiled-route-sync.cjs --check` output
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423`; `create-skill-parent-confirm.yaml:283,462`; `.skilled/commands/create/skill-parent.md:105`
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:121,220-240`; `parent-hub-router-schema.md:65-91,276,288-335`; `references/skill/upgrading-a-skill-to-v4.md:157-217`; `scripts/init_skill.py:613-617`; `references/shared/skill-root-metadata-contract.md:188`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1087,1142-1156,1309-1319`
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:17-32`; `.skilled/skills/sk-code/SKILL.md:63,74`; `.skilled/skills/sk-code/README.md:23,48,56,90`; `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.0.0.md:94`; `README.md:1444-1453`
- Throwaway copy `$X=/var/folders/…/r2-swe2max-devin-i4.JB89`: all commands, exits and output lines quoted above; `surgery.cjs` created only inside `$X`

## Assessment

- New information ratio: 0.80 (legacy-fallback degrade, post-refresh bundle proof, manifest-twin divergence, and the full site census are new; tieBreak-last placement and missing placement rule restate iter-2 with new precision; the verify-router-sync item corrects iter-3)
- Questions addressed: Q10 (R1 slice fully); Q11 partially (verify-router-sync SURFACES hardcode is a new assume-examples site)
- Questions answered: none ticked — R1 slice is complete, but Q10's R2-R4 edit-text portion remains open for a later iteration.

## Reflection

- What worked: the pre/post-refresh route pair turned "re-mint required" from an inferred claim into observed behavior, and exposed the silent `legacy` fallback — the worst stuck point, invisible from code reading alone.
- What did not: `refresh` usage needed `--skill-root` (one wasted invocation); `git status` on the cloned tree is slow (backgrounded, ~40s) — a `git -C` scoped status or `find -newer` would have been faster.
- Do differently: next copy run should pre-stage the correct CLI args and use `find . -newer <stamp>` instead of `git status` for touched-file enumeration.

## Recommended Next Focus

Q10 remainder: exact edit text for R2 (tooling that names the examples — `verify-router-sync.cjs:31-32` is now confirmed one such site), R3 (the full re-mint ritual as documented steps: edit → refresh → authored-twin propagation → guard), R4 (marking surfaces as examples — `SKILL.md:74`, `README.md:23,90`, `obsidian changelog:94` are the lines). Then Q11's wider census.

## SCOPE VIOLATIONS

None. Mutations (`surgery.cjs`, hub-router/mode-registry edits, refresh output) ran only inside `$X` under `$TMPDIR`; the repository was read-only.

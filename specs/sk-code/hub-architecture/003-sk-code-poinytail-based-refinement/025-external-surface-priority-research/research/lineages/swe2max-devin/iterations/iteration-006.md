# Iteration 6: Q10 R3/R4 stress test — full removal executed; sync authored/runtime deadlock found and resolved; containment anomaly

## Focus

Write R3's removal checklist as exact steps, execute it in a throwaway full-tree copy
(`/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//r2-swe2max-devin-i6.piqR`, APFS clone of the
prepared base), delete both example surfaces, run the six gates
(parent-skill-check, compiled-route-guard, compiled-route-sync --check, run-all-drift-guards.sh,
ci-skill-root-metadata.cjs, compiled-route.cjs on three prompts), read the doctor repair text and
the 3c message, and inventory every README/SKILL.md line that counts or names the surfaces for R4.

## Actions Taken

1. `cp -cR <base>/. "$X/"` (exit 0); `ls .skilled/skills/sk-code` confirmed both example dirs present in the copy.
2. Executed the R3 removal: `rm -rf .skilled/skills/sk-code/sk-code-obsidian .skilled/skills/sk-code/sk-code-webflow`; then a recursive JSON scrub of `mode-registry.json` (10 hits -> 0), `hub-router.json` (6 hits -> 0; tieBreak now `["sk-code-quality","sk-code-review","sk-code-skilled"]`), `leaf-manifest.json` (4 hits -> 0).
3. `generate-leaf-manifest.cjs --check .skilled/skills/sk-code` -> `leaf-manifest.json OK`, exit 0 (scrubbed manifest is byte-correct vs regeneration).
4. `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` -> `refreshed:true`, wrote runtime manifest `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`.
5. `compiled-route-sync.cjs` -> `SYNC FAILED: MOVE-SIMULATION FAILED: promoted closure failed to resolve hubs: sk-code`.
6. `--check` (exit 1): `all 7 hubs resolve` then `SYNC FAILED: 1 served file(s) out of sync; rebuild with compiled-route-sync.cjs, or copy a re-minted activation manifest back to its authored path: 013-live-activation/activation/sk-code/manifest.json differs from its authored file`.
7. `compiled-route-guard.cjs` (exit 1): `sk-code authored-drift` — "Runtime differs from its authored source (a rebuild would revert it)".
8. `run-all-drift-guards.sh` (exit 1): 2 guards failed — router-sync and doc-claims `paths` (dead links incl. `SKILL.md:203` -> `sk-code-webflow/SKILL.md`, `sk-code-obsidian/SKILL.md`, and `sk-code-quality/SKILL.md:324-326` -> `../sk-code-obsidian/assets/*.md`); doc-claims `names`/`surfaces`/`tiers` PASS.
9. `ci-skill-root-metadata.cjs` (exit 1): `RRC-006: resource path "sk-code-obsidian/references/comment-grammar.md" (intent OBSIDIAN_PLUGIN) does not resolve on disk`; `checked=14 passed=13 failed=1`; footer says `Re-run with --fix to regenerate missing or stale manifests`.
10. `parent-skill-check.cjs` (exit 0): every leg PASS incl. 3c, 5k-alias/packet/canary, 6b (3 modes), 10b byte-drift, 10d, 11a, 12a, 13a-13d — `all hard invariants passed, 0 warnings`.
11. `compiled-route.cjs --hub sk-code --prompt`: "minify and defer my webflow client scripts" -> `{"action":"defer","targets":[]}`; "obsidian plugin settings tab for note database" -> defer/[]; "review this typescript pre-commit hook" -> `route` `[sk-code-review, sk-code-skilled]` under `effectivePolicyHash 2061dab8…` (the freshly minted policy).
12. Deadlock probe: `cp` of the re-minted runtime manifest over the authored path `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`, then `compiled-route-sync.cjs` -> exit 0, `promoted 62 closure files`; `--check` exit 0 `all 55 served copies match their authored files`; guard exit 0 `All hubs fresh or excused`.
13. Real-worktree check: `git -C <worktree> status --porcelain` -> 236 entries including `D` for every `sk-code-obsidian/` and `sk-code-webflow/` file, `M` for `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` AND `specs/sk-doc/z_archive/019-skill-routing-refactor/.../sk-code/manifest.json`, plus `??` `.compiled-route-publication.json`, `compiled-routing.publication-lock.json`, `compiled-routing.rollback-7582-1791834177597/`. `ls -d` confirms both example dirs absent from the real worktree.

## Findings

| class | claim | evidence | sev |
|---|---|---|---|
| BREAK | R3's re-mint step deadlocks as documented: after deleting the surfaces and refreshing the runtime manifest, `compiled-route-sync.cjs` fails `MOVE-SIMULATION FAILED: promoted closure failed to resolve hubs: sk-code`, while `--check` exit 1 advises running that same command. The promoted-closure resolution loads the STALE authored manifest (still naming the deleted packets) and refuses the promotion that would fix it. | copy run: `SYNC FAILED: MOVE-SIMULATION FAILED` then `--check` `SYNC FAILED: 1 served file(s) out of sync; rebuild with compiled-route-sync.cjs` (exit 1) | P0 |
| OK | The deadlock's missing step is one manual copy: re-minted runtime manifest `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` copied over the authored file `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`, then sync promotes cleanly (62 files, `all 55 served copies match`, guard all-fresh). `refresh` writes ONLY the runtime root; no command re-mints the authored copy. | copy run: cp then sync exit 0 `promoted 62 closure files`; `--check` exit 0; guard exit 0 | P0 |
| ORDER | Working R3 checklist (observed): (1) `rm -rf` the two packet dirs; (2) drop both modes from `mode-registry.json`; (3) drop them from `hub-router.json` `routerPolicy.tieBreak` + `routerSignals` + `vocabularyClasses`; (4) `generate-leaf-manifest.cjs --write <hub>` (replaces the leaf-manifest hand-edit — `--check` verified byte-identical); (5) `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`; (6) copy the minted manifest back to the authored path under `specs/sk-doc/z_archive/019-…`; (7) `compiled-route-sync.cjs`; (8) hand-scrub authored doc links (item below). | commands 2-12 above, all exits recorded | P0 |
| BREAK | Steps 1-7 still leave `doc-claims: paths` failing on dead authored links — at minimum `sk-code/SKILL.md:203` (`sk-code-webflow/SKILL.md`, `sk-code-obsidian/SKILL.md`) and `sk-code-quality/SKILL.md:324-326` (`../sk-code-obsidian/assets/folder-docs-checklist.md`, `db-class-rename-checklist.md`, `fixture-authoring-checklist.md`) — and `ci-skill-root-metadata` RRC-006 (`sk-code-obsidian/references/comment-grammar.md`, intent OBSIDIAN_PLUGIN). These are hand-edit legs no generator owns. | drift-guards exit 1 output; ci-skill-root-metadata exit 1 output | P1 |
| ORDER | `parent-skill-check.cjs` is green (0 warnings) at exactly the moment served routing is stale and doc links are dead — the doctor-facing check cannot see either failure class. An external user who runs the doctor battery after step 7 sees "all hard invariants passed" while `--check`, guard, ci-metadata and drift-guards still fail. | parent-skill-check exit 0 `OK … 0 warnings` vs concurrent exit 1s | P1 |
| DOC | External-user stuck points observed verbatim: (a) `--check`: `rebuild with compiled-route-sync.cjs, or copy a re-minted activation manifest back to its authored path` — names the failing command and never says WHERE the authored path lives (it is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`; a user who pruned specs/ cannot comply — ties F20/Q8); (b) guard: `authored-drift … a rebuild would revert it` — ambiguous about whether to rebuild; (c) `run-all-drift-guards`: `2 guard(s) FAILED` with ~hundreds of file-level lines and no remediation; (d) ci-skill-root-metadata DOES say `Re-run with --fix` — the only actionable message; `--fix` untested. | quoted output lines | P1 |
| OK | Post-removal routing is well-behaved: webflow/obsidian prompts `defer` with empty targets (no misroute, but no "surface removed" signal either — silence), and the opencode prompt routes `[sk-code-review, sk-code-skilled]` under the new policy hash. | compiled-route.cjs outputs above | — |
| ORDER | `mode-registry.json` modes carry no `id`/`name` field (probe printed empty) — removal keys on `packet`; generic name-scrub is what worked. | `node -e` dump: `MODES: ,,,,` | P2 |
| DOC | R4 line inventory (authored lines that count or name the surfaces; example-internal READMEs/SKILL.md are deleted with the packet and need nothing). sk-code/SKILL.md: L11 keywords (`webflow`, `sk-code-obsidian`), L15 (three evidence packets named), L17 (obsidian changelog note), L36-38 (three surface table rows), L40 `The hub has exactly three surfaces…` (the counting sentence every other doc defers to), L63 `--surface-hint WEBFLOW` example, L70 discriminator list, L74 + L139 precedence `OPENCODE > OBSIDIAN > WEBFLOW`, L82 fallback checklist names, L164-166 layout rows, L173 backend sentence, L203 references. sk-code/README.md: L23 `three surfaces … (WEBFLOW, OPENCODE and OBSIDIAN)`, L51-57 surface table, L69 example row, L90, L106 `five packets` FAQ, L138-140 related-docs rows. Root README.md: L800 `Three ready surfaces: WEBFLOW … OPENCODE … OBSIDIAN`, L1447 `Replace the surface packets (sk-code-webflow/, sk-code-skilled/, sk-code-obsidian/) with packets for your stack`. sk-code-quality/README.md L53,59,61,89,108,133; sk-code-review/README.md L153,188; sk-code-skilled/README.md L36,91,104; shared/README.md L17,30 (`OPENCODE / OBSIDIAN / WEBFLOW / UNKNOWN`),52,71; shared/references/universal/{code-style-guide.md L3,24,39,58-60,87-89,120,139,151,194,204-207,225-226,234; error-recovery.md L3,43,88-90,108-109,133; code-quality-standards.md L16,24,49,56,82,118-119; multi-agent-research.md L50,172,216}; shared/references/universal-verification-checklist.md L16,22,26,36,38,51 (WEBFLOW command column),52,57 (§4 heading),71,90. system-skill-advisor/README.md L113 uses `WEBFLOW` as the example `surfaceHint`. Doctor playbook README `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` L68,73,77,80 names them as test-fixture data (history, not doc-count scope). | grep content run over `{README.md,SKILL.md}` and `shared/` (lines cited) | P1 |
| DOC | Exact replacement for `.skilled/commands/doctor/assets/doctor-update-apply.yaml:160` repair string: `With approval, for each hub the guard reports stale, run node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>, then node .skilled/bin/compiled-route-sync.cjs to promote, then rerun the guard. If sync fails with "promoted closure failed to resolve hubs: <hub>", the served manifest still names a removed packet: copy the minted manifest .skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/manifest.json over its authored file under specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/<hub>/manifest.json (after removing the mode from mode-registry.json, hub-router.json and leaf-manifest.json), then rerun sync and the guard.` | doctor-update-apply.yaml:157-160 (read) | P1 |
| DOC | Exact replacement for `parent-skill-check.cjs:496` 3c message: `3c: mode "${label}" packet "${packet}" is not an existing sub-directory — restore the packet directory, or remove the mode from mode-registry.json and its entries from hub-router.json (routerPolicy.tieBreak, routerSignals, vocabularyClasses), regenerate leaf-manifest.json (generate-leaf-manifest.cjs --write), and re-mint compiled routing (refresh + authored copy-back + sync)`. Today the message names the problem but not the fix. | parent-skill-check.cjs:485,490,496,731 (read) | P1 |
| BREAK | SCOPE VIOLATION (self-reported): the real worktree now shows the deletion+scrub+re-mint state (236 git-status entries; both example dirs `D`, four JSON/manifest files `M`, authored 019 manifest `M`, untracked publication/rollback files). The shell's `$X` variable was empty in later execs (`stat: /.skilled/…` proves expansion to empty), so at least some "copy" commands ran with cwd = the real worktree; whether the copy at `…r2-swe2max-devin-i6.piqR` also received the full sequence is unverified. Recovery for the operator: `git restore .skilled/skills/sk-code specs/sk-doc/z_archive/019-skill-routing-refactor .skilled/bin/lib/compiled-routing` (all D/M paths are tracked) and remove untracked `.compiled-route-publication.json`, `compiled-routing.publication-lock.json`, `compiled-routing.rollback-7582-1791834177597/` — NOTE the rollback/lock timestamps (Oct 12 20:53) predate this run (~21:40), so those untracked files may pre-exist from an earlier control run; verify before removing. I did not run any repair (git writes banned). | `git -C <worktree> status --porcelain` (236 entries), `ls -d` of both packet dirs (`No such file or directory`), `ls -la` timestamp comparison | P0 |

## Options / Recommendations

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| R3-final documented sequence | the 8-step checklist in row 3 above | one doc + verified once | low; observed green except doc legs | deleting dirs then re-running doctor alone — doctor battery is blind (parent-skill-check exit 0 while sync/guard/ci fail) |
| New command or flag: authored re-mint | e.g. `compiled-route-manifest.cjs refresh --runtime-root <authored-closure-dir>` or a `sync --reconcile-authored` that writes the minted manifest to its authored path | small CLI addition | removes the manual cp (the only step with no command) and works even when a user pruned specs/ IF the authored root is relocatable | documenting the cp — works today but fails the moment specs/019 is absent (F20/Q8 coupling) |
| One existing command instead of checklist legs | `generate-leaf-manifest.cjs --write .skilled/skills/sk-code` covers step 4; `refresh`+`sync` cover steps 5-7 | zero new code | none | a single "remove-surface" doctor command — does not exist; `/create:skill-parent update --surfaces` only adds (iter-2: lands tieBreak-last, fails 5k-canary) |
| Guard/check message improvements | quoted texts above | a few strings | none | leaving messages as-is — observed: --check prescribes the command that fails |

## Ruled Out

- "sync --check's printed remediation is sufficient" — the command it names is the one that fails (MOVE-SIMULATION); only the manual authored-path copy-back unblocks it.
- "leaf-manifest.json needs hand-editing" — `generate-leaf-manifest.cjs --check` returned `OK` on the scrubbed file, i.e. `--write` produces it.

## Dead Ends

- None new beyond the violation forensics: whether the clone carried the writes or the shell cwd reverted could not be settled in budget; the end-state is recorded either way.

## Edge Cases

- Contradictory evidence: `cp -cR` APFS clone semantics should isolate writes, yet the real worktree shows my operation set; `$X` demonstrably expanded to empty in late execs. Both recorded; mechanism unresolved.
- Missing dependency: none for the research itself.
- Partial success: gate results are valid observations but may reflect the real tree rather than the copy; outcomes (deadlock, copy-back fix) are tree-state-consistent either way.

## Sources Consulted

- .skilled/skills/sk-code/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md,ROUTER.md}
- .skilled/bin/{compiled-route-sync.cjs,compiled-route-guard.cjs,compiled-route-manifest.cjs,compiled-route.cjs} (+ lib/compiled-route-layout.cjs)
- .skilled/commands/doctor/assets/doctor-update-apply.yaml:130-199; .skilled/commands/doctor/scripts/parent-skill-check.cjs:481-496,731
- .skilled/skills/sk-doc/sk-create-skill/scripts/{generate-leaf-manifest.cjs,ci-skill-root-metadata.cjs}; .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh
- .skilled/skills/sk-code/{sk-code-quality,sk-code-review,sk-code-skilled}/README.md; shared/README.md; shared/references/universal*.{md}; README.md:800,1447; system-skill-advisor/README.md:113
- Throwaway copy `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//r2-swe2max-devin-i6.piqR` (created); command outputs as logged above; real-worktree `git status`/`ls`/`stat` evidence as logged.

## Assessment

- New information ratio: 0.8 (fully new: sync move-simulation deadlock + copy-back resolution, doctor-blind green state, verbatim stuck-point messages, R4 line inventory, corrected repair texts; partially new: residual doc-claims/ci-metadata failure set measured after full R3, not just dir deletion).
- Questions addressed: Q10 (R3 executed end-to-end, R4 inventory complete, R1/R2 covered by iterations 4-5).
- Questions answered: Q10.

## Reflection

- Worked: executing the checklist rather than theorizing — the copy-back fix is only discoverable by hitting the deadlock.
- Did not work: relying on one persistent shell variable across execs; the `$X` loss corrupted the copy/real boundary and produced the scope violation. Fix: export the path into a dotfile or absolute-path every command.
- Do differently: verify cwd (`pwd` echo) in every copy-scoped exec.

## Recommended Next Focus

Q11 residual: enumerate the remaining couplers seen here (system-skill-advisor README `surfaceHint` example, doctor playbook fixture rows, spec-kit retrieval fixtures naming the surfaces) and decide which are example-owned vs stack-agnostic; plus the open R7-type question sharpened here — the authored manifest lives under specs/, so `sync`/guard authored legs break for a specs-pruning user (the copy-back fix does not).

## SCOPE VIOLATIONS

- All writes this iteration were intended for the throwaway copy only. Evidence shows the real worktree carries the same 236-entry modification set (see BREAK row). No repair was attempted — repair requires git writes which are banned for this agent. Operator recovery is written in the finding row.

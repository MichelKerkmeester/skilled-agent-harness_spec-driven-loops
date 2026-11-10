# Iteration 4: Q3 + the doctor shape in detail — the battery run end to end, pristine and after a stand-in surface add

## Focus

Q3 (which manual steps existing automation can absorb without a judgment call), plus the doctor-shape detail the Q4 answer left open: run the six-command README "Verify." battery in a provisioned copy, timed, on the pristine tree and after a stand-in surface add; decide the leg order and the failure→next-step translations a read-only doctor surface must own; decide whether any mutating repair belongs in it; compare a new `/doctor:sk-code` with a `surface-setup` target under `/doctor:skill-advisor`; and check which doctor messages (3c, 5l, guard, sync) should name it.

All probes ran in a throwaway provisioned copy at
`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/deepseek-max-i4-doctor`
(a byte copy of the pristine base). The repository was not modified. The stand-in surface add mirrors what an external user does after reading README:1445-1472: copy an example packet as a model, register it ahead of OpenCode, and stop before the follow-ups.

## Actions Taken

1. Read state (config, strategy, iteration-003): session `dr-028-deepseek-max-2026-10-13T17:31:23.657Z`, iteration 4 of 5. Exhausted approaches respected.
2. Opened the files this iteration rests on: `README.md:1440-1519` (the adapting block and battery), `.skilled/commands/doctor/skill-advisor.md`, `.skilled/skills/sk-code/hub-router.json`, `.skilled/skills/sk-code/mode-registry.json`, `.skilled/commands/doctor/assets/doctor-parent-skill.yaml`, and `parent-skill-check.cjs` checks 5e/5i/5l (lines 1075-1177).
3. Provisioned the copy and ran the battery pristine, timed (5 shell commands total across the iteration, exit codes read).
4. Added the stand-in surface `sk-code-mystack` in the copy (packet copied from `sk-code-obsidian`, registered in `mode-registry.json` and `hub-router.json` ahead of `sk-code-skilled`), re-ran the battery, captured every FAIL line, and probed `compiled-route.cjs` with a stack-naming prompt.
5. Wrote this iteration's artifacts.

## Findings

| class | claim | evidence | NEW / ALREADY-COVERED | priority |
|---|---|---|---|---|
| OK | Baseline reproduced: the pristine six-command battery is green and fast. Exit 0 x6; total 13.98 s. Per leg: parent-skill-check 0.425 s, ci-skill-root-metadata 3.822 s, compiled-route-guard 0.195 s, compiled-route-sync --check 0.178 s, run-all-drift-guards 9.324 s, routing probe 0.040 s | copy run, all EXIT=0; [SOURCE: README.md:1474-1483] | NEW (baseline) | P2 |
| BREAK | A hand-registered surface ahead of OpenCode passes 5l but the same tree fails 6 parent-skill invariants: `6b` (registered mode absent from the hub SKILL.md mode table), `5k-alias` x2 ("mystack plugin code"/"mystack plugin surface" is not a keyword of its routerSignal classes), `5k-packet` (packet not a description keyword), `5k-canary` (no canary case routes to it), `10a-manifest-source` (MODE_LEAF_SET_COLLISION). "Keep your surface ahead of sk-code-skilled" (README:1468) is necessary but nowhere near sufficient | copy run: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` → EXIT=1, 6 invariant failures, FAIL lines quoted | NEW (extends 027: 5l guards the order only) | P1 |
| BREAK | Copying an example packet as a model hits `MODE_LEAF_SET_COLLISION`: workflowModes "sk-code-obsidian" and "sk-code-mystack" receive hash-equal leaf sets (9c4f5ae2a7c9). It fails twice — `ci-skill-root-metadata.cjs` EXIT=1 (`MANIFEST_REGENERATION_FAILED: sk-code`) and parent-skill `10a` — and both messages name the same fix, `leaf-scopes.json`, a file the README add path never mentions | copy run output, both commands, EXIT=1; `Re-run with --fix to regenerate missing or stale manifests; authored files must be written by hand.` | NEW | P1 |
| BREAK | The routing-probe leg cannot fail. Pristine it prints a full policy JSON (`{"hubId":"sk-code","action":"defer",...,"effectivePolicyHash":...,"generation":2}`); after the un-re-minted edit, both `--prompt "mystack plugin implementation"` and `--prompt "obsidian plugin code"` return only `{"servingAuthority":"legacy","hubId":"sk-code"}` with EXIT=0. README:1474 says "check that your surface comes first" — the leg exits 0 on a stub with no targets | copy run, both prompts, EXIT=0; pristine JSON above | NEW | P1 |
| BREAK | `compiled-route-sync.cjs --check` exits 0 on a stale tree ("all 55 served copies match their authored files") while `compiled-route-guard.cjs` exits 1 (`sk-code stale-manifest`). Sync checks parity, the guard checks freshness — a battery reader who runs sync alone gets green on a broken hub | copy run: guard EXIT=1, sync EXIT=0 | NEW | P1 |
| SHAPE | The guard's failure text is `Re-mint: sk-code` — a verb with no command; the refresh+copy pair lives only in README:1451. Sync names nothing (it passed). 5l names two fixes ("move them ahead ... or re-add them with /create:skill-parent update --surfaces"). doc-claims names files and lines. Of the four message classes, guard is the one that most needs a doctor surface to name the next step | [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1159-1177]; copy run output | NEW in detail (026 R3/R7 covered the principle; the exact text names no command) | P1 |
| DOC | doc-claims `check surfaces` output is already actionable — it lists the three stale files and the exact delta: `README.md:23`, `shared/references/phase-detection.md:16`, `SKILL.md:40` say "three surfaces", mode-registry declares 4 surface modes. A doctor surface should aggregate these rows, not paraphrase them | copy run: `run-all-drift-guards.sh` → `FAIL: doc-claims (verify-doc-claims.cjs)`, `run-all-drift-guards: 2 guard(s) FAILED`, EXIT=1 | ALREADY-COVERED in spirit (026 R3/R7); the file list is new evidence | P2 |
| AUTOMATION | The probe leg's real assertion is mechanical and absent from tooling: with a stack-naming prompt, `targets[0]` must be the added surface (or action must not be `defer`/legacy stub). Today nothing asserts it — the leg is exit-0 by construction | pristine vs stand-in probe output | NEW | P1 |
| AUTOMATION | The whole battery is one read-only invocation with no judgment: 6 commands → 1 target, ~14.0 s pristine / ~15.4 s failing. Mutating repairs (refresh+copy manifest, Hermes sync, `generate-leaf-manifest.cjs --write`, provision) and the collision repair (authoring `leaf-scopes.json`) stay printed commands — `ci-skill-root-metadata` itself says "authored files must be written by hand", so they cannot be fully automated anyway | timed runs; copy output | NEW | P2 |
| SHAPE | A read-only `surface-setup` target under `/doctor:skill-advisor` fits the existing route asset shape exactly: `doctor-parent-skill.yaml` is `read_only: true`, runs two scripts (the fleet gate then the audit), maps exit codes 0/1/2 → STATUS OK/FAIL/ERROR, and declares `mutation_boundaries.forbidden_targets: ["**/*"]`. A battery target adds the guard/sync/drift-guard/probe legs under the same contract; route-validate L1 keeps writes out of a read-only route | [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:68-73]; [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:101-104]; [SOURCE: .skilled/commands/doctor/skill-advisor.md:55-62] | NEW | P2 |
| SHAPE | A standalone `/doctor:sk-code` command wins the naming match (the external user's vocabulary is "sk-code setup", not "skill-advisor") at the cost of the catalog edits: `.skilled/commands/README.txt` group count 8→9, tree line, doctor section, plus one reference line in the README block. The hub itself (SKILL.md/README.md/ROUTER.md) has no place that must point at it — the doctor family is not advisor-routed (iteration 3), so the reference belongs in the README block and the doctor menu, not in the hub | [SOURCE: .skilled/commands/README.txt:46]; [SOURCE: .skilled/commands/README.txt:102]; [SOURCE: .skilled/commands/README.txt:157-169]; iteration-003 findings | NEW in detail (026 R9 built the README block as the reference site) | P2 |

## Options (evidence-bound)

| option | what it changes, path:line | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| Read-only `surface-setup` target under `/doctor:skill-advisor`, battery in README order plus a targets assertion | `_routes.yaml` route row + `assets/doctor-skill-advisor-surface-setup.yaml` + presentation row + the router table ([SOURCE: .skilled/commands/doctor/skill-advisor.md:55-62]) | The 14 s comprehension loop over six raw commands; the guard dead end (`Re-mint: sk-code` names no command); the silent legacy stub (exit 0 with no targets); sync's green masking a stale hub | ~4 files inside the doctor family; route-validate B2/D1/I1/J1/K1/L1; no canary/compiled re-mint; read-only | Extending `parent-skill` in place: its contract is the structural audit ([SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:23-34]), so compiled-route and drift-guard failures would misreport under a structural-audit name |
| Standalone `/doctor:sk-code` (target `surface-setup` or `surfaces`) | New router `.skilled/commands/doctor/sk-code.md`; route + asset + presentation; `.skilled/commands/README.txt:46,102,157-169`; one reference line in README:1474 | Same as above, plus a stable sk-code-named entry point the README block and 3c's removal message can cite | 4-6 new files + 3 index edits; same validation; no routing-contract change | Option 1 alone: `/doctor:skill-advisor surface-setup` reads as an advisor concern; the README would teach an odd name |
| Mutating repairs inside the doctor surface (provision, hermes sync, manifest refresh+copy, leaf-manifest --write) | Would need `mutating: true` routes and write assets | The two-command refresh+copy copy-paste; the Hermes sync copy-paste | Violates the read-only route contract (L1) and doctor-parent-skill's `forbidden_targets: ["**/*"]`; the collision repair needs authored `leaf-scopes.json` judgment | Printing the exact commands (README:1451 already does): fails today only because the guard message names no command — the mapping fixes that without a write |

## Questions Answered

- Q3: Which manual steps can existing automation absorb without a judgment call? — Answered: the six-command battery collapses into one read-only doctor invocation (~14 s); the probe's "surface comes first" assertion is mechanical (assert targets, not exit code); the failure→next-step mapping is a table (guard stale → README:1451 refresh+copy or commit with hooks; collision → leaf-scopes.json; 5k-canary → fixture + authored twin; doc-claims counts → the three named files; legacy stub → re-mint). Mutating repairs and the collision's `leaf-scopes.json` authoring stay printed because they write or need judgment.

## Questions Remaining

- Q1 remainder: fresh clone from `git clone` to a green battery; scaffolded-removal re-mint behavior — not probed.
- Q2: the clone-to-battery journey — timing and friction now captured, but the fresh-clone probe is not done.
- Q5, Q6 untouched (classification rows above are input).
- Detail left uncaptured (iteration 2): the identity of the second failed guard in the earlier umbrella run — this iteration's copy shows the failure set directly (doc-claims + check paths).

## Ruled Out

- Re-running the 5l failing direction (surface placed after OpenCode): the message text is a committed-file read ([SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]) and 027 already shipped the check; budget spent on the un-run directions instead.
- Reproducing the `check paths` dead-reference lines as a product finding: they came from my rename shortcut (content rewritten, filenames not), so they are probe noise, not a product defect. The decisive stand-in guard failures are `check surfaces` and doc-claims.

## Dead Ends

- None definitive. The stand-in's `check paths` noise is a probe artifact and not a candidate for "Exhausted Approaches".

## Edge Cases

- Ambiguous input: none — the focus named the probe, the translations and the two shapes.
- Contradictory evidence: none; pristine-vs-stand-in behavior is consistent across all six legs.
- Missing dependencies: none — the base copy's provisioned `node_modules` made every leg runnable.
- Partial success: none; all six legs ran in both states, and the stand-in probe ran a seventh stack-naming variant.

## Sources Consulted

- Copy runs: provision, pristine battery (6 legs), stand-in edit, stand-in battery (6 legs + 2 extra probes) — commands, exit codes and decisive lines quoted above.
- [SOURCE: README.md:1445-1483] (adapting block and battery), [SOURCE: .skilled/commands/doctor/skill-advisor.md:55-62]
- [SOURCE: .skilled/commands/doctor/assets/doctor-parent-skill.yaml:23-34,68-73,101-104]
- [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1075-1177] (5e/5i/5l)
- [SOURCE: .skilled/skills/sk-code/hub-router.json:4-7,20-47], [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-21]
- Prior iterations: `iterations/iteration-001.md`..`iteration-003.md`

## Assessment

- New information ratio: 0.90 (9 fully new findings of 10; 1 partially new — doc-claims' file list extends R3/R7; +0.0 simplicity bonus)
- Questions addressed: Q3 (fully), Q2 (partially — timing and friction of the battery; fresh clone still open)
- Questions answered: Q3

## Reflection

- What worked and why: the fixed-path copy (instead of the recipe's `mktemp` suffix) removed the cross-exec variable loss that cost iteration 2; the stand-in's failure set was richer than predicted because the copied-example path trips leaf-set collision, which neither 5l nor the README mentions.
- What did not work and why: the string-rename shortcut (content only) produced dead-path noise in `check paths`; renaming files too would have isolated `check surfaces`.
- What I would do differently: assert the probe leg's output shape first (targets non-empty), then diff failure messages — the silent legacy stub would have surfaced in the first probe run.

## Recommended Next Focus

Q5/Q6 with this iteration's rows as input, plus the Q1 tail (fresh clone to green battery) if budget allows: clone the base, run the battery, and record the fresh-clone friction points; classify every finding against 025/026/027.

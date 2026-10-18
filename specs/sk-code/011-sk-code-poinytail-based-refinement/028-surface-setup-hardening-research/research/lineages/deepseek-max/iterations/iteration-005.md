# Iteration 5: Contested claim settled (README refresh-and-copy path) + Q5 rejects

## Focus

(a) Settle the contested claim: lineage `swe-max` iteration 4 claims at P0 that after a complete hand-added surface `compiled-route-sync` fails with `MOVE-SIMULATION FAILED` and that no tool mints the authored activation manifest, so the surface stays invisible (`servingAuthority legacy`); 025 F55/F74/F84/F89 and the README block say the README refresh-and-copy step (or a commit with hooks installed) mints it. (b) Q5: list the ideas that should be rejected, with reason and cheaper move.

All probes ran in a throwaway provisioned copy at
`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/deepseek-max-i5-probe`
(APFS clone of the prepared base). The repository was not modified.

## Actions Taken

1. Read state (config, strategy, registry, iteration-004, swe-max iteration-004) and the README adapting block/battery `README.md:1445-1483`; located `MOVE-SIMULATION` in `compiled-route-sync.cjs:728-733`.
2. In the copy, added a full-fidelity stand-in surface `sk-code-rails` by hand: packet copied from `sk-code-obsidian` with content renamed, `hub-router.json` (tieBreak ahead of `sk-code-skilled`, cloned routerSignals entry + vocabularyClasses), `mode-registry.json` (modes[] entry + `extensions.surface-axis.surfaces`), canary case cloned, hub `description.json` keyword added, hub `SKILL.md` rows cloned, README + changelog lines cloned. Then `generate-leaf-manifest.cjs --write` → EXIT 2 (collision, below).
3. Ran the full command sequence with exit codes: parent-skill-check EXIT 1 (4 failures: `3d-alias` x2, `5k-packet`, `10a-manifest-source`); `compiled-route-sync.cjs --check` pre-refresh EXIT 1 (canary parity, **hubs resolved**); `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` EXIT 0 `{"manifestValid":true,"fresh":true,"refreshed":true,"causeCode":"fresh"}`; copied runtime manifest and canary fixture to their authored twins (EXIT 0, EXIT 0); `compiled-route-sync.cjs --check` post EXIT 0 (`all 55 served copies match their authored files`); `compiled-route-guard.cjs` EXIT 0 (`sk-code fresh`); `compiled-route.cjs --hub sk-code --prompt "implement a rails controller with strong params"` EXIT 0 → `{"action":"route","selectionKind":"single","targets":[{"packetId":"sk-code-rails","packetKind":"surface",...}],"generation":2}`.
4. Commit path: `git config --local skilled.trustRepoHooks true` EXIT 0; `bash .skilled/scripts/install-git-hooks.sh` EXIT 0 (advertises `SPECKIT_SKIP_ROUTE_REMINT=1`); staled the authored manifest with a marker; `git add -A` EXIT 0; `git commit` EXIT 1 — `BLOCKED [gate:mirror-parity]: sync-skills-hermes.cjs failed: DRIFT sk-code / DRIFT sk-code-rails`, with the exact fix command. `git log` shows only the base commit; `diff -q` runtime vs authored manifest EXIT 1 (authored still stale — the routing re-mint gate's authored-copy repair was not observed).

## Findings

| class | claim | evidence | NEW / ALREADY-COVERED | priority |
|---|---|---|---|---|
| OK | The README refresh-and-copy path is complete and works end to end. `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` mints the runtime manifest (EXIT 0, `manifestValid:true`,`fresh:true`,`refreshed:true`); copying it (and the canary fixture) to the authored twins is a plain `cp` the README prescribes (EXIT 0/0); afterwards `sync --check` EXIT 0 ("all 55 served copies match their authored files"), guard EXIT 0, and `compiled-route.cjs` routes the stack prompt to the stand-in FIRST: `action:"route"`, `targets[0].packetId="sk-code-rails"` — not a legacy stub. swe-max's P0 pair ("no tool mints it", "stays invisible") is refuted for the README path; 025 F55/F74/F84/F89 upheld | copy run, every command + exit status quoted above; `[SOURCE: README.md:1451]`, `[SOURCE: README.md:1474-1483]` | NEW (settles the contested P0) | P0 |
| BREAK | The pre-refresh failure swe-max reported did not reproduce. My pre-refresh `sync --check` said `all 7 hubs resolve` and failed on PARITY, not on the promoted closure: `SYNC FAILED: 1 served file(s) out of sync; rebuild with compiled-route-sync.cjs, or copy a re-minted activation manifest back to its authored path: 009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json differs from its authored file` (EXIT 1). `MOVE-SIMULATION FAILED` is `compiled-route-sync.cjs:728-733`'s promoted-closure branch; it did not fire in this copy. Their manifest did not "fail to resolve" here | copy run step B; `[SOURCE: .skilled/bin/compiled-route-sync.cjs:728-733]` | NEW (contradicts swe-max i4 P0, first half; not reproduced) | P0 |
| BREAK | The commit path blocks before any routing re-mint: with hooks installed and a staled authored manifest, `git commit` EXIT 1 at `gate:mirror-parity` (`DRIFT sk-code`, `DRIFT sk-code-rails`), naming the exact Hermes fix command; the authored manifest was NOT repaired by the hook (`diff -q` EXIT 1, marker still present). The hooks advertise a routing re-mint gate (`Bypass routing re-mint: SPECKIT_SKIP_ROUTE_REMINT=1 git commit`), but its authored-copy repair is unobserved. README:1472 does prescribe the Hermes sync before committing — the gate enforces the documented order | copy run steps I: install EXIT 0, commit EXIT 1, git log shows base only, diff EXIT 1 | NEW | P1 |
| BREAK | The clone-an-example add (README:1447 "keep them as models") trips `MODE_LEAF_SET_COLLISION` at leaf-manifest regeneration: `generate-leaf-manifest.cjs --write` EXIT 2 — `workflowModes "sk-code-obsidian" and "sk-code-rails" receive hash-equal leaf sets (9c4f5ae2a7c9); give each mode its own leafScopes in leaf-scopes.json` — and parent-skill `10a` fails, skipping `10b/c/d`. Same hash as iteration 4: the leaf set is structural, not content-hashed (my content rename did not separate it) | copy run EXIT0=2; parent-skill-check `10a` FAIL | ALREADY-COVERED (my iteration 4 NEW/P1; reproduced in a full-fidelity add) | P1 |
| BREAK | The clone-example add also trips `3d-alias` x2: `alias "note database plugin"` and `alias "db-* class grammar"` on `sk-code-rails` duplicate `sk-code-obsidian` — aliases whose text does not contain the example's name survive a rename and must be rewritten by hand. Part probe artifact (a rename-only clone keeps them), but a user copying an example as a model hits the same duplication | copy run parent-skill-check FAIL lines (recovery pass) | NEW (new evidence; probe-artifact caveat) | P2 |
| OK | A full add passes the order/consistency checks: `5l`, `5e`, `5b`, `5c`, `5k-canary`, `6b` all PASS once the canary case and SKILL.md row are cloned. The one remaining named failure, `5k-packet`, is precise: `packet "sk-code-rails" is not a description keyword` — the check wants the literal packet id in `description.json` keywords, and my added `rails` keyword was not enough | copy run PASS/FAIL lines | ALREADY-COVERED (026 R3/R7, 027 5l; new evidence the clone path passes them) | P2 |
| AUTOMATION | The mechanical assertion "check that your surface comes first" (README:1474) is demonstrably assertable on a fresh tree — the route JSON is `action:"route"` with `targets[0]` the added surface — yet it stays a manual eyeball; nothing in the battery asserts `targets[0]` or rejects a legacy stub | copy run step H | ALREADY-COVERED (my iteration 4 AUTOMATION/P1; new positive evidence it works when fresh) | P1 |
| DOC | README:1472's commit guidance is correct but order-sensitive: the Hermes sync must run before the commit or the mirror-parity gate blocks; the gate itself names the fix command verbatim, so the user is not stranded | copy run commit output | NEW | P2 |

## Options (Q5 rejects, evidence-bound)

| option | what it changes, path:line | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| REJECT: new hub mode `sk-code-setup` | mode-registry entry, packet dir, routerSignals class (`mode-registry.json:7-9` admits only `packetKind: workflow|surface`) | — (nothing; setup is operator-initiated, not prompt-routed) | Needs a third packetKind or abuses `workflow`; a setup keyword class steals code prompts; large blast | A doctor route (iteration 3/4 Q4 answer) is the natural shape; no cheaper alternative needed |
| REJECT: mutating repairs inside the doctor surface | would need `mutating: true` routes/write assets | the two-command refresh+copy paste | Violates the read-only route contract (L1) and `doctor-parent-skill.yaml` `forbidden_targets: ["**/*"]`; the collision repair needs authored `leaf-scopes.json` judgment | Printing the exact commands (README:1451) already works — my probe ran exactly those commands to green; it fails today only because the guard's `Re-mint: sk-code` names no command |
| REJECT: doc-only mint fix | more prose about the refresh step | user at doctor-green with a stale runtime manifest | The tool exists and README:1451 already documents it (probe: refresh EXIT 0) | Naming the command in the guard/sync failure text is the one-line version; doc-only fails because the user is staring at a failure, not the README |
| REJECT: hand-editing `leaf-manifest.json` | — | `10b` byte-drift (same entries, different bytes = FAIL) | Generator-owned file; hand edits always trip 10b | `generate-leaf-manifest.cjs --write` is the only writer (README step); it fails only on the collision, where the message names `leaf-scopes.json` |
| REJECT: wire the mint into `/create:skill-parent update --surfaces` | one generator call in the mutating surface-update path | a user who stops at doctor-green never runs refresh | Touches an existing mutating workflow; the README add path already lists refresh+copy (step 5) | Message fix (guard/sync name the command) + README cross-reference: cheaper and reaches hand-editors too, whom `update --surfaces` never serves |
| REJECT: extend `parent-skill` in place with the battery legs | one asset/contract | compiled-route and drift-guard failures | Misreports under a structural-audit name (`doctor-parent-skill.yaml:23-34` contract) | A new target under `/doctor:skill-advisor` (iteration 4 option 1) keeps the audit names honest |

## Questions Answered

- Q5: Which ideas should be rejected, and why? — Answered: the six REJECT rows above, each with reason and cheaper move (hub mode `sk-code-setup`; mutating doctor repairs; doc-only mint fix; hand-editing leaf-manifest; mint-in-update-surfaces; parent-skill extension).
- Q6: Which findings are NEW and which are ALREADY-COVERED by 025, 026 or 027? — Answered for this iteration: every row above carries its classification; the P0 pair is NEW and settles the swe-max contention against 025 F55/F74/F84/F89.

## Questions Remaining

- Q1 remainder: fresh clone from `git clone` to a green battery; playbooks/benchmarks/feature-catalog mentions; Hermes copies beyond the mirror-parity gate.
- Q2: the clone-to-battery journey — battery timing and friction captured (iterations 3-4), fresh-clone probe still not done.
- Unsettled detail: whether the routing re-mint gate copies a re-minted manifest to its authored path after the mirror-parity gate passes (my commit was blocked before that point; settle by running `sync-skills-hermes.cjs`, `git add`, and re-committing).

## Ruled Out

- Re-running the swe-max failure sequence with their exact edit order to force `MOVE-SIMULATION`: budget; the README path's end-to-end green (sync, guard, route) is the decisive answer, and the non-reproduction is recorded as a BREAK row.

## Dead Ends

- None definitive. The commit-path repair question is a named remaining uncertainty, not a dead end.

## SCOPE VIOLATIONS

- None. All mutations were confined to the throwaway copy under `/private/tmp/.../runs/deepseek-max-i5-probe`; the repository was read-only.

## Edge Cases

- Ambiguous input: none — the focus named the probe sequence and the Q5 deliverable.
- Contradictory evidence: resolved — swe-max i4 P0 vs 025/README; the README path is supported by direct exit codes (refresh EXIT 0 → copies → sync/guard/route green). The one residual contradiction (their MOVE-SIMULATION failure) is recorded as not reproduced, with the difference named.
- Missing dependencies: none — the provisioned copy made every leg runnable.
- Partial success: the commit path was blocked at mirror-parity by design of the documented order; recorded as P1 with the residual question named.

## Sources Consulted

- Copy runs: provision, full hand-add, leaf-manifest regen (EXIT 2), parent-skill-check (EXIT 1, 4 failures), sync pre (EXIT 1), manifest refresh (EXIT 0), two authored copies (EXIT 0/0), sync post (EXIT 0), guard (EXIT 0), route probe (EXIT 0), hooks install (EXIT 0), git add (EXIT 0), git commit (EXIT 1), diff (EXIT 1) — commands, exit codes and decisive lines quoted above.
- `[SOURCE: README.md:1445-1483]` (adapting block and battery), `[SOURCE: .skilled/bin/compiled-route-sync.cjs:728-733]` (MOVE-SIMULATION branch).
- Prior packets: `swe-max/iterations/iteration-004.md`; `deepseek-max/iterations/iteration-004.md`.

## Assessment

- New information ratio: 0.79 (8 findings: 4 fully new — README path green, pre-refresh failure not reproduced, commit-path block, 3d-alias — and 4 partially new; 5.5/8 = 0.69, +0.10 simplicity bonus for settling the contested P0 claim)
- Questions addressed: Q5 (fully), Q6 (fully for this iteration), Q1 (partially — compiled routing + the Hermes gate)
- Questions answered: Q5, Q6

## Reflection

- What worked and why: driving the exact README sequence with exit codes made the contested claim falsifiable in one pass — the refresh command's `refreshed:true` JSON and the post-copy `targets[0]` route output are the two decisive lines.
- What did not work and why: the clone-with-rename add tripped `3d-alias` (aliases without the example's name in them survive) and `5k-packet` (a `rails` keyword is not the literal packet id) — two self-named failures that a targeted clone cannot avoid.
- What I would do differently: run the commit path with the Hermes sync first, so the routing re-mint gate's authored-copy behavior is observable instead of blocked.

## Recommended Next Focus

The Q1/Q2 tail: clone the base with `git clone` (no node_modules), run the six-command battery, and record fresh-clone friction; and settle the routing re-mint gate's authored-copy repair by running the Hermes sync and re-committing in the existing copy.

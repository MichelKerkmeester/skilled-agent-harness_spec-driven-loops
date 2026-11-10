# Iteration 2: Q1 remainder — provisioned-copy probes (Hermes prune/flag, mirrors, doc surfaces, bare-delete gates, doctor 5l stand-in)

## Focus

Q1's remainder, executed as behavior probes in a provisioned throwaway copy of the prepared pristine base: (a) delete `.skilled/skills/sk-code/sk-code-obsidian` and `sk-code-webflow`, then run the Hermes skill sync (read its usage first) and the runtime-mirror checks, recording whether orphan `.hermes/skills/sk-code-obsidian|webflow` copies are pruned or flagged; (b) find what in manual-testing playbooks, benchmarks and feature catalogs names the examples or pins surface order, and whether any gate fails on them after the delete; (c) hand-place a stand-in surface name after `sk-code-skilled` in `tieBreak` and confirm what doctor check 5l reports and whether it is hard or soft. The repository itself was read-only; every mutation lived under the copy.

## Actions Taken

1. Read state (config, state JSONL, strategy, findings registry, iteration-001.md); session `dr-028-deepseek-max-2026-10-13T17:31:23.657Z`, lineage `new`, iteration 2 of 5.
2. Read the Hermes sync contract before running it: `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` (full, 286 lines) — usage `node sync-skills-hermes.cjs [--check]` at :45-49; stale pruning at :234, :260; `--check` STALE/FAIL reporting at :249-257.
3. Copy probe: `X="$(mktemp -d .../scratchpad/028/runs/deepseek-max-i2-XXXX)"; cp -cR <base>/. "$X/"` → copy `deepseek-max-i2-wGIE`; `rm -rf .skilled/skills/sk-code/sk-code-obsidian .skilled/skills/sk-code/sk-code-webflow` (exit 0; listing confirms both gone; hub keeps shared, sk-code-quality, sk-code-review, sk-code-skilled plus benchmark/, changelog/, feature-catalog/, manual-testing-playbook/).
4. Hermes `--check` after the delete: `STALE sk-code-obsidian`, `STALE sk-code-webflow`, `FAIL: 0 drifted, 2 stale; run without --check to regenerate`, exit 1.
5. Hermes write run: `Wrote 0 of 66 Hermes skill copies; pruned 2`, exit 0; `ls .hermes/skills | rg 'sk-code-(obsidian|webflow)'` → no matches; recheck `PASS: 66 Hermes skill copies in sync`, exit 0.
6. Mirror checks in the copy: `sync-runtime-mirrors.cjs --check` → `[runtime-mirror-sync] PASS: 181 mirrors across 8 trees are in sync.` exit 0; `check-agent-mirror-sync.cjs --all` → `11 agent(s) checked — all mirrors in sync — OK` exit 0.
7. `parent-skill-check.cjs .skilled/skills/sk-code` post-delete (unmodified hub): exit 1, `FAIL: parent-skill-check — 113 invariant failures, 0 warnings`; visible ids 3c (x2), 5d, 10a-manifest-source, 12a-router-contract (RRC-006, ~100 lines); 5a/5b/5c/5e/5f/5g/5h/5i/5l PASS.
8. `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` post-delete: exit 1, `run-all-drift-guards: 2 guard(s) FAILED`; captured tail names `FAIL: doc-claims (verify-doc-claims.cjs)` with unresolved links from `sk-code-quality` and the hub `SKILL.md` into the deleted examples (`doc-claims: 3/4 checks passed`).
9. Stand-in probe A (tieBreak only): inserted `sk-code-standin` after `sk-code-skilled` in the copy's `hub-router.json` → `FAIL: 5e: routerPolicy.tieBreak is not an exact permutation of registry modes — extras: [sk-code-standin] ... length: 6 (expected 5)`; `PASS: 5l: tieBreak places no added surface after the native surface "sk-code-skilled"`; exit 1.
10. Stand-in probe B (declared as a surface): appended a `packetKind:"surface"` mode to the copy's `mode-registry.json` → `FAIL: 5l: tieBreak places surface(s) [sk-code-standin] after the native surface "sk-code-skilled", ... move them ahead of "sk-code-skilled" in routerPolicy.tieBreak, or re-add them with /create:skill-parent update --surfaces`; also 5b (missing signal), 3c, 6b, 5k-packet, 10a; exit 1.
11. Doc-surface sweep: grep counts/files for the example names in `.skilled/skills/system-spec-kit/manual-testing-playbook` (7 files, 63 hits), `.skilled/skills/sk-code/manual-testing-playbook` (21 files, 159 hits), `.skilled/skills/sk-code/feature-catalog` (2 files), `.skilled/skills/sk-code/benchmark` (2 exact hits; the retired-lane README), `.skilled/skills/system-skill-advisor` (0 files).

## Findings

| class | claim | evidence | NEW / ALREADY-COVERED | priority |
|---|---|---|---|---|
| BREAK | The Hermes mirror is a commit gate, not just a sync: the pre-commit hook runs `sync-skills-hermes.cjs --check` inside `MIRROR_CHECKS`, blocks the commit with `BLOCKED [gate:mirror-parity]`, prints the tail of the failure and names the fix (`Fix: node <script>, then git add its output`; bypass `SPECKIT_SKIP_MIRROR_PARITY=1`) | copy command output (step 4); [SOURCE: .skilled/scripts/git-hooks/pre-commit:275-314] | NEW (025 F91 named the generator; the commit gate, the orphan window and the fix message are new evidence) | P2 |
| OK | Orphan `.hermes/skills/sk-code-obsidian` and `sk-code-webflow` copies are both flagged and pruned: `--check` reports `STALE` for each and exits 1; the write run `pruned 2` and the recheck is `PASS: 66 ... in sync` exit 0. This resolves iteration 1's open sub-question and the 025 F69 contradiction: the copies exist in the tree, but the mirror self-heals on the next sync run | copy commands (steps 4-5); [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:234], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:249-260] | partially NEW (corrects 025 F69's "no mirror files exist" reading; the prune path was untested in 025) | P2 |
| OK | The other runtime mirrors carry neither example and encode no surface order: `sync-runtime-mirrors.cjs --check` → `PASS: 181 mirrors across 8 trees are in sync.` exit 0; `check-agent-mirror-sync.cjs --all` → `11 agent(s) checked — all mirrors in sync — OK` exit 0, both run in the copy after the delete | copy commands (step 6) | ALREADY-COVERED (025 F70/F91) with NEW post-delete command evidence | P2 |
| BREAK | A bare delete (the literal "external user deletes" reading: `rm -rf` of both example dirs, no registry/router update) makes the sk-code doctor check hard-fail: `113 invariant failures, 0 warnings`, exit 1 — 3c x2 (`finish the removal with the README.md block "What Adapting sk-code Looks Like"`), 5d (missing router resources `sk-code-webflow/SKILL.md`, `sk-code-obsidian/SKILL.md`), 10a-manifest-source (`MODE_LEAF_SET_COLLISION ... hash-equal leaf sets (4f53cda18c2b); give each mode its own leafScopes in leaf-scopes.json`), and ~100 12a-router-contract RRC-006 lines for every example resource path | copy command (step 7); message texts in output; 5l implementation [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1159-1177] | partially NEW: 025 F71/R3/R7 designed the named-closure failure; NEW is the magnitude (113), the delete-induced 10a collision, and that the scaffolded removal command (`/create:skill-parent update --surfaces`) is named nowhere in this wall — 3c points at the README closure only | P1 |
| BREAK | The drift-guard umbrella fails after the same bare delete: `run-all-drift-guards: 2 guard(s) FAILED`, exit 1. The captured failure is `doc-claims` (`verify-doc-claims.cjs`, `3/4 checks passed`) with unresolved links INTO the deleted examples from the packets that stay: `sk-code-quality/SKILL.md:113,129-132,323-326` (`../sk-code-obsidian/assets/*-checklist.md`), `sk-code-quality/README.md:61,133` (`../sk-code-obsidian/assets/`), `sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md:126,130`, and hub `SKILL.md:203` (`sk-code-webflow/SKILL.md`, `sk-code-obsidian/SKILL.md`) | copy command (step 8); paths/lines as printed by the guard | NEW — the assumption "shared/ and sk-code-quality stay" holds for the folder, but sk-code-quality and the hub SKILL.md are not delete-clean: the guards tolerate removed examples only once the scaffolded removal rewrites those links (contradicts 026 R2 as a bare-delete tolerance claim) | P1 |
| DOC | The sk-code hub's own manual-testing playbook names the examples as live surfaces in 21 files, 159 hits: `surface-detection/webflow-detection.md` (10), `surface-detection/obsidian-detection.md` (11), `surface-detection/skilled-detection.md` (3), `cross-stack-routing/*` (7 files), `compiled-routing/surface-bundle-compiled-routing.md` (9), plus routing-disambiguation and motion/performance scenario files. No gate runs them; post-delete they test deleted surfaces | grep counts + file list; [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:75,193,196,238,276,278] | NEW (not in 025 R3's removal checklist, which named registry/router/canary/README) | P2 |
| DOC | The sk-code feature catalog still presents the examples as live surface packets: `sk-code-webflow`, `sk-code-skilled`, `sk-code-obsidian` are listed as the SURFACE axis in `feature-catalog.md:15,35` and `two-axis-registry-driven-routing.md:26`; no gate compares the catalog to `mode-registry.json` | read evidence; [SOURCE: .skilled/skills/sk-code/feature-catalog/feature-catalog.md:15], [SOURCE: .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:26] | NEW | P2 |
| OK | Benchmarks cannot fail on the delete: the lane is retired and frozen (`Retired lane ... no new run can be started from it`, successor named), the only exact-name hits are frozen report JSON plus that README, and `benchmark` is in the Hermes sync `EXCLUDED_DIRECTORIES` | [SOURCE: .skilled/skills/sk-code/benchmark/README.md:13-16]; [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:32]; grep counts (2 exact hits) | NEW evidence (025 did not cover the benchmark tree) | P2 |
| OK | The advisor runtime has zero example-name references: grep over `.skilled/skills/system-skill-advisor` for both names → 0 files (scorer, batteries and tests included); the only "battery" mentions are changelog/README prose | grep output | NEW evidence (extends 025 F12/F70) | P2 |
| BREAK | Doctor 5l's filter has a blind spot: with a stand-in placed after `sk-code-skilled` but NOT declared in `mode-registry.json`, 5l PASSes silently and only 5e catches it as a permutation extra (`extras: [sk-code-standin]`, exit 1) with no tie-order explanation. With the stand-in declared as `packetKind:"surface"`, 5l FAILs and names the fix (`move them ahead of "sk-code-skilled" ... or re-add them with /create:skill-parent update --surfaces`). 5l is a `softFail` that is FAIL by default (`STRICT_HUB_CANON`), demotable to WARN only via `PARENT_HUB_CHECK_STRICT=0`; both probes exited 1 | copy probes A and B (steps 9-10); [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1076-1088], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1163-1177], [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:186-189] | partially NEW (027 added 5l; NEW is the two-variant empirical behavior, the undeclared-name blind spot, and the exit-code semantics) | P2 |
| OK | 5l's example exemption works post-delete: with the examples removed, `PASS: 5l: tieBreak places no added surface after the native surface "sk-code-skilled"` and 5e/5b/5a/5c/5f/5g/5h/5i all pass; the delete-induced failures live in 3c/5d/10a/12a and the doc-claims guard, not in the tie-order checks | copy command (step 7) | ALREADY-COVERED (027 5l design) with NEW empirical confirmation | P2 |

Options (evidence-bound, not shipped recommendations):

| option | what it changes, path:line | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| Name the scaffolded removal command in 3c's message | the 3c failure text in `.skilled/commands/doctor/scripts/parent-skill-check.cjs` (message observed in output; implementation not re-read) | the bare-delete wall of 113 failures whose only pointer is the README closure; the command that rewrites registry/router/canary/leaf-manifest is named only by 5l, which passes post-delete | one message string; doctor output only; no behavior change | documenting it in the README only: the failure message is what a blocked user sees first, and the README block is already the named target of 3c |
| Make 5l also flag undeclared tieBreak names after the native surface | `checkNativeSurfaceLast` filter at [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1170-1171] | a hand-added name after `sk-code-skilled` with no registry entry gets only 5e's generic permutation extra and no tie-order hint | one filter branch; must avoid double-reporting with 5e | relying on 5e: it catches the permutation but never explains the tie cost or names the update command |

No re-recommendation of 025/026/027 shipped work; the two options above are new, evidence-bound candidates for the reducer/operator.

## Questions Answered

None fully. Q1 is now substantially answered: the Hermes copies, the other mirrors, the playbooks, benchmarks, feature catalogs, the bare-delete gate surface and the hand-edit tolerance of both registries and tieBreak are classified with observed command evidence. Q1 remainder: fresh clone end-to-end, and the compiled-routing re-mint path after a scaffolded removal.

## Questions Remaining

- Q1 remainder: fresh clone from `git clone` to a green battery; scaffolded-removal re-mint behavior (canary fixture, compiled manifest) — not probed this iteration.
- Q2-Q6 untouched (the copy journey probes above are raw material for Q2/Q3).
- Detail left uncaptured: the identity of the second failed guard in the umbrella run (the captured tail names doc-claims; the full log is in the exec overflow file).

## Ruled Out

- Running the Hermes sync from a shell whose `$X` variable did not persist: an intermediate invocation fell back to the default cwd (the original worktree) and reported `Wrote 0 of 68 ... pruned 0`. Verified harmless — `git status --porcelain -- .hermes` is empty and the original `.hermes/skills` still holds both example copies — and the probe was re-run with a hardcoded copy path. All later commands used the hardcoded path.

## Dead Ends

- None definitive. The bare-delete wall is a finding, not a dead end; the copy probes are reproducible (copy `deepseek-max-i2-wGIE`, or re-run the recipes above).

## Edge Cases

- Ambiguous input: none — the three probe parts were named explicitly; the "external user deletes" reading was taken literally (bare `rm -rf`), and the scaffolded-removal reading is deferred.
- Contradictory evidence: 025 F69 ("no example mirror files exist") vs the tree — resolved in favor of the tree, with the prune/flag behavior now observed; 026 R2 ("drift guards tolerate removed examples") vs the post-delete umbrella failure — recorded as finding 5 with both sides cited; the tolerance holds only after the scaffolded removal.
- Missing dependencies: none.
- Partial success: every planned probe ran; two details remain uncaptured (second umbrella guard identity; fresh clone), named above.

## Sources Consulted

- Copy `deepseek-max-i2-wGIE` under `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/8bb7f97a-f291-4af3-b712-1b46f9323681/scratchpad/028/runs/` — commands in Actions Taken, all exit statuses recorded there
- `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` (full)
- `.skilled/scripts/git-hooks/pre-commit:275-316`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:20-23, 186-189, 1025-1177`
- `.skilled/skills/sk-code/mode-registry.json` (full), `hub-router.json`
- `.skilled/skills/sk-code/benchmark/README.md:13-16`, `feature-catalog/feature-catalog.md:15,35`, `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:26`
- `.skilled/skills/sk-code/manual-testing-playbook/` (grep file list), `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` (grep counts), `.skilled/skills/system-skill-advisor/` (grep, 0 hits)
- Original worktree verification: `git status --porcelain -- .hermes` empty

## Assessment

- New information ratio: 0.87 (6 fully new of 11 — pre-commit Hermes gate, prune/flag behavior, umbrella post-delete failure, quality-packet links, playbook/catalog sites, 5l filter; 5 partially new; +0.10 simplicity bonus for resolving the iteration-1 Hermes sub-question and the F69 contradiction)
- Questions addressed: Q1 (substantially)
- Questions answered: none fully

## Reflection

- What worked and why: reading the sync contract before running it made the probe's expected outcomes falsifiable (STALE/FAIL vs prune/PASS), and the copy let a bare delete and two hand edits run to completion with real exit codes; hardcoding the copy path after the `$X` loss removed the last source of ambiguity.
- What did not work and why: relying on a shell variable across exec calls — the persistent session did not preserve it, and the fallback run silently measured the original worktree; caught by the count mismatch (68 vs 66 copies) and the `PWD` print.
- What I would do differently: run the drift umbrella with output redirected to a file inside the copy so the full guard list survives truncation, and probe the fresh clone in the same pass.

## Recommended Next Focus

Q2 with the copy evidence in hand: a fresh-clone journey (`git clone` of the prepared base, no node_modules) from clone to a green battery — doctor, drift guards, Hermes/mirror sync, advisor, one routed prompt — recording every friction point; then the scaffolded-removal re-mint probe (canary fixture, compiled manifest) as the Q1 tail.

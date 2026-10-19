---
title: "Research: the merged dual-compat work, ten angles after the merge"
description: "Ten steered deep-research angles (A21 to A30) over the four branches merged to main on 2026-10-19: the Pi fast-mode claim, plugin bridge drift, sk-vision on OpenCode 2, cli-opencode docs and dual-version CI, command and config dual reads, worktree provisioning, and sk-code and sk-doc conformance, closed by one architecture decision and a ranked remediation list."
trigger_phrases:
  - "post-merge dual compat research"
  - "opencode dual version remediation list"
  - "pi fast mode zero flag"
  - "disk derived plugin inventory"
importance_tier: "normal"
contextType: "research"
---

# Research: the merged dual-compat work, ten angles after the merge

<!-- ANCHOR:deep-research-post-merge-dual-compat -->

**Evidence labels.** Every load-bearing claim carries one label.

- **[confirmed]**: the orchestrator re-ran the check or re-read the cited lines after the iteration. The spot checks are in `research/steering-log.md` and in each sibling report's section 5.
- **[documented]**: an iteration recorded primary evidence that the orchestrator did not re-run.
- **[inferred]**: reasoning from the evidence. Each inferred claim names what would confirm it.

Labels carry over unchanged from the sibling reports. This report upgrades none of them.

## 1. Answer

The four merged branches work on both OpenCode versions today. CI is green on main, every plugin but one goes through the dual bridge, and no non-command file registers as a command. Three things are wrong in ways tests do not catch:

1. **A real bug in the Pi fast-mode claim.** In the trusted main checkout, `pi --help` lists no `--fast`, and the extension stands down entirely. The pre-trust pass loads a user-scope symlink copy that wins the claim on the shared event bus. Realpath dedupe then prunes that copy from the final set, and the surviving project copy has already stood down. [confirmed, iteration 1 and `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:123-124`, `:175-179`]
2. **Two P1 bugs in the sk-vision OpenCode 2 runtime.** One failed disposal at teardown leaks the rest. An unreadable session model sends a text-only model to the 2-second grace path. [confirmed code, `../015-post-merge-research-sk-vision/research/research.md`]
3. **Hand-kept lists that have already drifted.**
   - The two v2 plugin suites pin 12 and 5 names against a folder of 17.
   - The plugins README says 11.
   - The provision list misses five tracked package trees.
   - The phase 011 proof rows say 16 plugins.
   - Nothing compares any of these lists with what is on disk. [confirmed]

**The architecture to converge on:** keep one bridge per surface and add one shared enforcement pattern. Every surface gets an inventory read from disk, a test that it equals what is declared, and a manifest of named exceptions, all run in blocking CI. sk-vision stays a native-dual exception, listed in that manifest with its reason. Section 11 has the decision; section 9 has the ranked list.

## 2. Scope and Method

- **Questions.** The session's five key questions cover:
  - the Pi fast-mode claim;
  - plugins, tests, generators and docs that assume one OpenCode version or a fixed file list;
  - the sk-vision runtime;
  - cli-opencode, the doctor battery and CI;
  - conformance and the architecture to converge on.
- **Run shape.** Ten steered angles on cli-pi with `glm-5.3-flash` at thinking max through llmgateway, stop policy `max-iterations`, convergence off.
  - This session ran A21, A22, A26 and A30 as iterations 1 to 4.
  - Four sibling sessions ran the other six angles in their own worktrees: 015 (A23), 016 (A24, A25), 017 (A27) and 018 (A28, A29).
  - One research lineage cannot run iterations concurrently, and the workflow's fan-out gives every lineage the same topic. That is why the siblings exist.
  - A30 read the four sibling reports after they were merged into this worktree.
- **Stop.** The session stopped at 4 of 10 iterations, by hand. All ten angles were covered, and the remaining iterations had no angle assigned. Iteration 4 proposed a fifth iteration to sweep the remaining changed docs; section 12 records it instead.
- **Incidents.** These are recorded in `research/steering-log.md`:
  - **Containment.** The first concurrent round shared one worktree, and the lineages tripped write containment on each other's files.
  - **Gateway.** llmgateway returned HTTP 500 for `deepseek-v4.1-flash`. All five sessions held no completed iteration, so each was restarted on GLM, and generation 1 is archived under `research_archive/`.
  - **Mid-dispatch write.** The orchestrator once wrote this session's steering log while iteration 3 was dispatching. It restored the file byte for byte, and iteration 3's receipt shows no violation.

## 3. A21: The Pi Fast-Mode Claim in a Trusted Project

**Observed.** A plain `pi --offline --help` in the trusted main checkout lists `--fast` 0 times. `-a`, `-na` and every worktree list it once. [documented, iteration 1]

**Mechanism.**

- The resource loader keeps one event bus per loader. It runs an untrusted pre-trust pass and then the final pass on the same runtime.
- The pre-trust pass loads the user-scope copy, `~/.pi/agent/extensions/pi-fast-mode-w-subagent-support`, which is a symlink to the main checkout's copy. That copy subscribes to the claim channel and registers `--fast`.
- In the final pass, the project copy's probe finds the claim taken and returns before registering anything.
- `mapToResolved` dedupes by realpath. The alias and the project copy share a realpath, and project scope outranks user scope, so the flagged alias is pruned. Zero `--fast` is left.
- In a worktree the realpaths differ, both entries survive, and the alias keeps its flag. That gives exactly one.

[confirmed: root cause and the zero-flag mechanism, from the real-binary trace in iteration 1 and the early return at `src/index.ts:123-124`]

**Blast radius.** The same early return skips `/fast`, status handling and session-start wiring, so the whole extension is dead in the trusted main checkout. [inferred from the confirmed early return; confirm by listing `/fast` in that layout]

**Fix.** Register the flag before the claim gate, and gate only side effects on the claim. Releasing the claim on `project_trust` was refuted in a sandbox: `reload()` re-runs the pre-trust pass, which claims again and is pruned again. [documented, iteration 1]

## 4. A22 and A26: Plugin Bridge Drift and Dual Reads

**Plugins (A22).**

- `.opencode/plugins` holds 17 entry files. Sixteen build their export through `dualPlugin`, and `sk-vision.js` is the designed native-dual exception. No v1-only plugin remains on main. [confirmed: `grep -L "dualPlugin(" .opencode/plugins/*.js` lists only `sk-vision.js`]
- Nothing enforces this. `v2-registration.test.cjs` pins 12 names and `v2-hard-plugins.test.cjs` pins 5. Their union covers the folder by coincidence, and neither reads the folder. [confirmed, `.opencode/plugins/tests/v2-registration.test.cjs:19`, `v2-hard-plugins.test.cjs:28`]
- `cleanup.skippedKeys` records hooks the bridge could not map (`.opencode/plugins/lib/v2-bridge.js:280`). Tests assert it only for the designed exception, never empty for the 16 bridged plugins. [documented]
- Live v2 delivery of the gate-critical event names (`session.created` and the disposal events) is still unverified on 2.0.32, as the README concedes at line 65. [documented]
- The README describes the registration suite as covering 11 plugins, against its 12. [confirmed, `.opencode/plugins/README.md:77`]

**Commands, agents and config (A26).**

- `.opencode/commands` and `.opencode/agents` are symlinks to `.skilled/commands` and `.skilled/agents`, so both versions read one file set. [confirmed]
- `opencode.json` keeps the v1 shape, which OpenCode 2 converts on load, guarded by `opencode-config-shape.test.cjs`. [documented]
- The `compiled/manifest.jsonl` writer is `render-command-contract.cjs`. Between phase 004 and `59565c1849` it re-created the emptied `.skilled/commands/deep/assets/compiled/` on every render. `59565c1849` moved the writer, the projection seed, the README snippet and the ignore rule to `.skilled/command-support/deep/assets/compiled/`. [confirmed, `render-command-contract.cjs:24`, `.gitignore:202`]
- No non-command file registers as a command on either version: both register markdown only, and no markdown non-command remains in the tree. [documented, phase 004 listings]
- The main checkout's untracked `manifest.jsonl` dates from July and was never tracked. It is orphaned data, not a regeneration. [documented]

## 5. A23: sk-vision on OpenCode 2

These come from `../015-post-merge-research-sk-vision/research/research.md`:

- **P1 teardown leak.** The setup teardown awaits four disposals in sequence, so one throw leaks the rest. [confirmed, `src/plugin.ts:463-468`]
- **P1 grace downgrade.** A failed `ctx.session.get` becomes `model = undefined`, which routes a text-only model to the 2-second grace. [confirmed code at `src/plugin.ts:416-421`; impact inferred]
- **P2 and P3.**
  - A startup ping timer that is never cleared. [confirmed]
  - A hand-maintained `V2PluginContext` that the published v2 types do not back. [inferred]
  - Command registration that fails closed while tool registration fails open.
  - An empty venv directory left by a `close()` during `mkdir`.
  - 5-second interpreter probes that treat slow as missing.
- `bun test` passes 67 of 67, and none of these is covered by a failing test.

## 6. A24 and A25: cli-opencode Docs, the Doctor Battery and CI

These come from `../016-post-merge-research-cli-opencode-ci/research/research.md`:

- **CI.** CI is green on main after three red runs. Run `39309852507` on `793b50ccbf` passed all three jobs at 19:18Z. The run before it failed v1 `plugin-load` and v2 `plugin-active`, with `system-skill-advisor.js` and `system-spec-gate.js` reporting `status failed`. [confirmed]
- **What CI tests.** The battery and the workflow test what they claim, and pin no versions or counts. CI runs no smoke dispatch, and `opencode-config-shape.test.cjs` is a trigger path with no job. [confirmed for the trigger paths]
- **Doc drift.**
  - `--share` is undocumented in 1.19.3's `run --help`. [confirmed for the help surface]
  - The docs name two default model ids. [confirmed]
  - They name two agent directories. [documented]
  - The v2 `--log-level` note is stale.
  - The v1 flag summary is incomplete.

## 7. A27, A28 and A29: Provisioning and Conformance

**Provisioning** (`../017-post-merge-research-provisioning/research/research.md`):

- Five tracked package trees are missing from `worktree-provision-paths.txt`, both `.pi` extensions among them. [confirmed]
- No test compares tracked manifests with the list.
- Lockfile drift fails loudly but is untested.
- The three dispatch adapter suites and the hooks vitest tree run in no CI job.

**Conformance** (`../018-post-merge-research-conformance/research/research.md`):

- **Clean.** Comment hygiene, the four drift guards and the changed READMEs' sk-doc validators are all clean.
- **Misses.**
  - Seven sk-vision tests sit beside their sources. [confirmed]
  - sk-doc's two `test-frontmatter-version*.mjs` files run under no runner. [confirmed]
  - The sk-vision OpenCode host adapter has no paired test.
  - `.pi` sits outside the central Node runner. [confirmed]
  - The pi-fast-mode tests README's "80 tests" claim is unverified.

## 8. The Drift Ledger

Every drift this research found is a hand-kept literal that something on disk outgrew:

| Literal | Says | Disk says | Where |
|---|---|---|---|
| `PLUGIN_NAMES` | 12 plugins | 17 entry files | `.opencode/plugins/tests/v2-registration.test.cjs:19` |
| `PLUGINS` | 5 plugins | 17 entry files | `.opencode/plugins/tests/v2-hard-plugins.test.cjs:28` |
| Plugins README | 11 plugins in the registration suite | 12 | `.opencode/plugins/README.md:77` |
| Provision list | 12 entries | 5 more tracked package trees | `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` |
| Phase 011 proof | 16 plugins | 17 | `../011-two-version-proof-and-closeout/proof.md:48` |
| pi-fast-mode tests README | 80 tests | 68 to 71 by static count | `.pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md:21` |
| cli-opencode default model | `deepseek-v4.1-flash` | `deepseek-v4-flash` in two references | `cli-opencode/SKILL.md:158` |

The doctor battery is the counterexample: it derives families from `--version` and pins only timeouts and attempt counts, and it has not drifted.

## 9. Ranked Remediation List

Owner: **fix** is a product or data change, **enforce** is tests and CI wiring, **docs** is a documentation edit, **probe** is a read-only runtime observation by the operator, and **cleanup** is data cleanup in the main checkout. Labels are the source reports' own.

| # | Pri | Finding | Source | file:line | Fix | Proving check | Owner | Label |
|---|---|---|---|---|---|---|---|---|
| 1 | P1 | Pi `--fast` absent in the trusted main checkout | 014 iteration 1 | `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:123-124`, `:175-179` | Register the flag before the claim gate; gate only side effects | A four-layout test (trusted main, worktree, `-a`, `-na`) asserting exactly one `--fast` | fix, enforce | confirmed; blast radius inferred |
| 2 | P1 | Five package trees missing from the provision list | 017 F1 | `worktree-provision-paths.txt:16-55` | Add them, or record why each is excluded | Row 3's test | fix | confirmed |
| 3 | P1 | No completeness guard for the provision list | 017 F2 | `tests/worktree-naming.test.sh:399` | Compare tracked `package.json` files under `.skilled`, `.opencode`, `.pi` with the list | The test fails on an unlisted manifest | enforce | documented |
| 4 | P1 | sk-vision teardown leak | 015 f-001 | `vision-runtime/src/plugin.ts:463-468` | Dispose through `Promise.allSettled`, rethrow the first error | A test where one disposal throws and all four still run | fix, enforce | confirmed |
| 5 | P1 | sk-vision grace downgrade | 015 f-002 | `vision-runtime/src/plugin.ts:416-421` | Treat an unreadable model as guaranteed | A test where `ctx.session.get` throws for a text-only model | fix, enforce | confirmed code, inferred impact |
| 6 | P1 | Pinned plugin lists in both v2 suites | 014 iteration 2 | `v2-registration.test.cjs:19`, `v2-hard-plugins.test.cjs:28`, `:61` | Replace both with an inventory read from `.opencode/plugins`: bridge consumers must export `dualPlugin('<stem>'`, and native-dual exceptions come from a manifest | The inventory test fails on an unlisted file, a manifest entry with no file, or a consumer without the bridge | fix, enforce | documented |
| 7 | P2 | `skippedKeys` is silent for bridged plugins | 014 iteration 2 | `.opencode/plugins/lib/v2-bridge.js:280` | Assert empty `skippedKeys` for every bridged plugin; route deliberate skips through the manifest | The assertion fails when a plugin returns an unmapped hook | enforce | documented |
| 8 | P2 | v2 event-name delivery unverified | 014 iteration 2 | `.opencode/plugins/README.md:65` | Assert each handled event name is mapped, aliased or a listed pass-through; observe the 2.0.32 host read-only | Policy test, then the live observation | enforce, probe | documented |
| 9 | P2 | Command listings compare unlike things; orphaned manifest | 014 iteration 3 | `../004-agents-commands-config/spec.md:134`, `:158` | Subtract the built-ins `init` and `review`; normalize v2's ancestor walk-up; delete the orphaned `.skilled/commands/deep/assets/compiled/` in the main checkout | A nested-versus-isolated listing fixture; a clean main checkout status | enforce, cleanup | documented |
| 10 | P2 | Two default model ids | 016 F3 | `cli-opencode/SKILL.md:158`, `references/cli-reference.md:158`, `:281` | Pick one and align every site | A grep check over the model id | docs | confirmed |
| 11 | P2 | Two agent directories | 016 F4 | `cli-opencode/SKILL.md:196`, `references/agent-delegation.md:23`, `:35` | Check with `opencode agent list`, then state one path | The live read, then the grep check | probe, docs | documented |
| 12 | P2 | `--share` undocumented on 1.19.3 | 016 F2 | `cli-opencode/SKILL.md:168`, `references/cli-reference.md:113` | One live detached run; drop the flag or document it as a hidden alias | The runtime probe | probe, docs | confirmed help surface, inferred runtime |
| 13 | P2 | Seven sk-vision tests beside their sources | 018 F1 | `vision-runtime/src/` | Move them into `vision-runtime/tests/` | `bun test` count unchanged; a guard against `*.test.ts` under `src/` | fix, enforce | confirmed |
| 14 | P2 | Two sk-doc tests run under no runner | 018 F2 | `.skilled/scripts/run-node-tests.mjs:29`, `sk-doc/scripts/tests/run-script-tests.sh:12` | Rename to `*.test.mjs`, or extend sk-doc's runner | The central runner's case count rises | enforce | confirmed |
| 15 | P2 | Untested sk-vision host adapter | 018 F3 | `sk-vision/hooks/opencode/sk-vision.ts:16` | Add a stub-context registration test | The test fails when the wiring breaks | enforce | documented |
| 16 | P2 | Trigger path with no job | 016 F7 | `.github/workflows/opencode-dual-version.yml:18`, `:33` | Run `opencode-config-shape.test.cjs` in a step, or drop it from the triggers | Every trigger-path test appears in a step | enforce | confirmed |
| 17 | P2 | Adapter suites outside CI | 017 F5 | `.github/workflows/dispatch-enforcement-guard.yml:37` | Add a blocking job for the three adapter suites and the hooks vitest tree | The job runs and blocks on failure | enforce | documented |
| 18 | P2 | Lockfile drift untested | 017 F3 | `worktree-naming.sh:557-559` | Add a drift fixture and choose report or repair | The fixture shows a clear signal | enforce, fix | documented |
| 19 | P2 | "80 tests" unverified | 018 F6 | `pi-fast-mode-w-subagent-support/tests/README.md:21` | Run vitest and set the count from its output | README count equals the run's total | docs | confirmed claim, inferred count |
| 20 | P2 | Hand-kept v2 context type | 015 f-004 | `vision-runtime/src/plugin.ts:109` | Feature-detect v2 domains; re-check against `@opencode/plugin` at each OpenCode 2 bump | A bump-checklist item and a safe fallback | fix, enforce | inferred |
| 21 | P2 | Pi loader keeps pre-trust listeners | 014 iteration 1 | Pi loader, outside the repo | Upstream: release pre-trust bus subscriptions on `reload()` | Upstream, if pursued | fix (upstream) | documented |
| 22 | P2 | Wrong conflict model in the fast-mode comment | 014 iteration 1 | `pi-fast-mode-w-subagent-support/src/index.ts` | The loader reports conflicts as diagnostics; correct the comment | Review against loader behavior | fix (comment) | documented |
| 23 | P3 | Ping timer never cleared | 015 f-003 | `vision-runtime/src/runtime/client.ts:350-354` | Keep the handle, clear it, `unref()` it | No live timer after a fast ping | fix | confirmed |
| 24 | P3 | Command transform fails closed | 015 f-005 | `vision-runtime/src/plugin.ts:353` | Wrap it in the tools' fail-open guard | Its failure disables only the command | fix | inferred |
| 25 | P3 | 5-second probes treat slow as missing | 015 f-007 | `vision-runtime/src/runtime/client.ts:213`, `:227` | Raise or configure the timeout; read the exit status | A slow-interpreter stub test | fix | inferred |
| 26 | P3 | Empty venv after `close()` mid-`mkdir` | 015 f-006 | `vision-runtime/src/runtime/client.ts:144` | Remove the empty directory on close (optional) | A close-during-mkdir test | fix | documented |
| 27 | P3 | `bun.lockb` falls to npm | 017 F4 | `worktree-naming.sh:545` | Detect it, or record npm as intended | A `bun.lockb` fixture | fix | inferred |
| 28 | P3 | Runner one `node_modules` from the hooks/024 hazard | 017 F6 | `dispatch-enforcement-guard.yml:37` | Resolve `.skilled`'s vitest even with an ancestor `node_modules` | Run the guard in that state | enforce | documented |
| 29 | P3 | Missing manifests skipped silently | 017 F7 | `worktree-naming.sh:541` | Warn on a listed path with no `package.json` | A fixture that removes one | fix | documented |
| 30 | P3 | Stale counts in the README and the proof | 014 iteration 2, 016 F8 | `.opencode/plugins/README.md:77`, `../011-two-version-proof-and-closeout/proof.md:48` | Reword the count and date-stamp the proof rows | Counts come from the inventory or carry a date | docs | confirmed (README), documented (proof) |
| 31 | P3 | Stale `--log-level` note and incomplete v1 flag summary | 016 F5, F6 | `references/cli-reference.md:107`, `cli-opencode/SKILL.md:168` | Refresh both | A check against captured `run --help` | docs | documented |
| 32 | P3 | `.pi` outside the central runner | 018 F4 | `.skilled/scripts/run-node-tests.mjs:27` | Add `.pi/extensions`, or record why not | The discovered-files list changes | enforce | confirmed |
| 33 | P3 | Drift-guard orchestrator untested | 018 F5 | `sk-code-skilled/scripts/run-all-drift-guards.sh:1` | Test its pass and fail aggregation | Both exit paths covered | enforce | documented |
| 34 | P3 | No document type for `SECURITY.md`; `opencode.json` unassessed | 018 F7, F8 | `SECURITY.md`, `opencode.json` | Add a document type; assess the config later | The validator recognizes the type | docs, enforce | documented; F8 UNKNOWN |

## 10. Verification by the Orchestrator

- `.opencode/plugins/*.js` counts 17. `grep -L "dualPlugin("` lists only `sk-vision.js`. `PLUGIN_NAMES` holds 12 names and the hard suite's `PLUGINS` holds 5. `README.md:77` says 11. Rows 6 and 30 confirmed.
- `src/index.ts:123` returns when `claimPackage(pi)` fails, before `registerFlag("fast")` at lines 175-179. Row 1's mechanism confirmed in the source.
- `v2-bridge.js:280` freezes `skippedKeys` onto the cleanup function. Row 7's channel confirmed; the missing assertion stays documented.
- `render-command-contract.cjs:24`, `.gitignore:202`, `git merge-base --is-ancestor 59565c1849 HEAD` and the two `.opencode` symlinks were checked after iteration 3. `git ls-files .skilled/commands/deep/assets/compiled` lists nothing. Section 4 confirmed.
- The sibling rows carry their own spot checks in each sibling report's section 5. Iteration 4 also re-read about 30 cited lines at this worktree's HEAD and found no contradicted citation.

## 11. Recommendations

**Keep one bridge per surface.** The four bridges each translate a different mismatch:

| Surface | Bridge |
|---|---|
| Plugins | `dualPlugin` in `lib/v2-bridge.js` |
| Commands, agents and config | One shared tree through symlinks, plus a v1-shape `opencode.json` that OpenCode 2 converts |
| CLI dispatch | The `opencode-version.cjs` resolver and a battery that parses `--version` |
| Provisioning | `worktree-provision-paths.txt` driving `provision_worktree` |

**Share one enforcement pattern across them.** Each surface gets an inventory read from disk, a test that it equals what is declared, and a manifest of named exceptions, all in blocking CI. Rows 3, 6, 7, 16 and 17 are that pattern. Enforcement belongs in tests and CI, because every drifted literal lives in a test or a doc. The doctor battery already reads from disk and can mirror the checks interactively.

**sk-vision is a sanctioned exception, not drift.**

- It registers `chat.message`, a hook outside the bridge's mapped set.
- It needs the v2-native `ctx.session.hook("prompt")` and `ctx.tool.transform`.
- It runs its own venv runtime.

It goes in the exceptions manifest with its reason, keeps its v2 coverage in the hard suite, and carries a standing re-check of its v2 context type at each OpenCode 2 bump.

**Do first:** rows 1, 4 and 5, which are small test-first fixes to real bugs. Then rows 2, 3 and 6, which make the drift classes fail loudly.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| One shared adapter layer across all surfaces | The surfaces' mismatches are disjoint: hook and event names, markdown registration, JSON shape, package managers. One layer would encode their union, still could not absorb sk-vision, and would tie all remediation to one refactor | `iterations/iteration-004.md` | 4 |
| Retiring the bridge for native dual everywhere | It doubles per-plugin code while 1.19.3 stays supported, and reopens the class that once let `session-relaunch.js` reach main with only a v1 factory | `iterations/iteration-004.md` | 4 |
| Refreshing the pinned lists by hand | Every drift found is a pinned list or count; a refresh decays on the next rename | Section 8 | 4 |
| Releasing the Pi claim on `project_trust` | `reload()` re-runs the pre-trust pass, which claims again and is pruned again | `iterations/iteration-001.md` | 1 |
| Realpath-keyed claims with same-file takeover | Stale listeners re-mark fresh probes across a second `reload()`; the bus has no eviction primitive | `iterations/iteration-001.md` | 1 |
| Runtime-scoped claims | The final pass reuses the pre-trust runtime | `iterations/iteration-001.md` | 1 |
| A regenerating `compiled/manifest.jsonl` writer | The main checkout's file dates from July and nothing writes the old path since `59565c1849` | `iterations/iteration-003.md` | 3 |
| Reading CI as red on main | The fourth run after the merges passed all three jobs | `../016-post-merge-research-cli-opencode-ci/research/research.md` | sibling |

## Divergence Map

- Saturated directions: none. Convergence mode was off and the stop policy was `max-iterations`. The graph check returned `STOP_BLOCKED` on source diversity and evidence depth at iterations 3 and 4, and that decision was informational only.
- Pivots taken: each iteration took its steered angle in turn: A21, A22, A26, then A30. The six other angles ran in sibling sessions. Pivot failures and audited overrides: none.
- Remaining frontier:
  - about 227 changed docs outside 018's focus, not swept for single-version assumptions;
  - the read-only runtime probes behind rows 8, 11 and 12;
  - whether other packages shipping a user symlink and a project copy, such as pi-cache-optimizer, hit the same alias pruning.

## 12. Open Questions

- **The doc sweep.** Which of the remaining changed docs assume one OpenCode version or a fixed count? This is the last part of key question 2, which stays open in the strategy. (`iterations/iteration-004.md`)
- **Coexistence diagnostics.** If the flag registers on both copies, does the duplicate-flag diagnostic surface visibly in coexistence layouts? (`iterations/iteration-001.md`)
- **Claim-gated side effects.** Do `/fast` and the session-start wiring need un-gating, or a claim that the final pass can take over? (`iterations/iteration-001.md`)
- **Event names.** Does OpenCode 2.0.32 deliver `session.created`, `server.instance.disposed` and `global.disposed` to plugins? (`iterations/iteration-002.md`)
- **Siblings' open questions.** These stay in each sibling's own section 12.

## 13. References

- Iterations: `research/iterations/iteration-001.md` to `iteration-004.md`. Records: `research/deltas/iter-001.jsonl` to `iter-004.jsonl`.
- Steering, deviations and incidents: `research/steering-log.md`. The generation 1 attempt is archived under `research_archive/`.
- Resource map: `research/resource-map.md`.
- Sibling reports:
  - `../015-post-merge-research-sk-vision/research/research.md`
  - `../016-post-merge-research-cli-opencode-ci/research/research.md`
  - `../017-post-merge-research-provisioning/research/research.md`
  - `../018-post-merge-research-conformance/research/research.md`
- The original twenty-iteration lineage: `../research/research.md`.
- Sources:
  - `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`;
  - `.opencode/plugins/`, including `lib/v2-bridge.js` and `tests/`;
  - `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs`;
  - `.skilled/skills/sk-vision/vision-runtime/src/`;
  - `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`;
  - `.github/workflows/opencode-dual-version.yml`.

## Convergence Report

- Stop reason: manualStop, at 4 of 10 iterations, once all ten angles were covered
- Total iterations: 4 in this session; 10 angles across this session and its four siblings
- Questions answered: 4 / 5. Key question 2 stays open for the remaining doc sweep
- Remaining questions: 1 key question; the open questions are in section 12
- Last 3 iteration summaries:
  - run 2: A22 plugin bridge drift (0.9)
  - run 3: A26 command, agent and config dual reads (0.75)
  - run 4: A30 architecture synthesis and ranked remediation (0.6)
- Convergence threshold: 0 (convergence mode off; stop policy `max-iterations`)
- Divergence summary: no divergent pivots recorded

<!-- /ANCHOR:deep-research-post-merge-dual-compat -->

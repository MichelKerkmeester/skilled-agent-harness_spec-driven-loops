# Steering Log - post-merge dual-compat research

Orchestrator-owned record of each iteration's focus, digest and the next steer. Iterations 1-10 of this session carry the angle ids A21-A30, continuing the A1-A17 numbering of the original run in `../../research/steering-log.md`.

| Iteration | Angle |
|---|---|
| 1 | A21 Pi fast-mode claim in a trusted project |
| 2 | A22 Plugin bridge drift |
| 3 | A26 Command, agent and config dual reads |
| 4 | A30 Architecture synthesis and ranked remediation, after the siblings finish |

Parallel split (recorded deviation): after iteration 1 started, the operator asked for more parallelism. The fan-out contract gives every lineage the same research topic and runs each lineage's whole loop in one detached process (`fanout-run.cjs` `buildLoopPrompt`), so lineages cannot take separate steered foci. The remaining angles therefore run as concurrent single-executor sibling sessions: A23 in `../../015-post-merge-research-sk-vision/`, A24-A25 in `../../016-post-merge-research-cli-opencode-ci/`, A27 in `../../017-post-merge-research-provisioning/` and A28-A29 in `../../018-post-merge-research-conformance/`. This session stops after A30 (iteration 4) instead of its configured 10, with stop reason `manualStop`, because the other six angles ran in the siblings.

## Entry 21 (iteration 1, seed)

- Angle: A21
- Focus: A21 Pi fast-mode claim in a trusted project: why does a plain `pi --offline --help` in the trusted main checkout (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, trusted in `~/.pi/agent/trust.json`) list no `--fast` while `-a`, `-na` and the git worktrees list it once, given `claimPackage` in `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`? Test the hypothesis that Pi's resource loader reuses one event bus across a pre-trust load and the trusted load, so the first pass's claim listener survives and every later copy stands down: read `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/resource-loader.js` (`loadCurrentExtensionSet`, `loadExtensionsCached`, `this.eventBus`, the trust passes) and `dist/core/extensions/loader.js` (`createExtensionRuntime`, `invalidate`, `trackEventBusSubscription`), and find where the extension's flags are taken from (which pass's runtime). Output: a confirmed or refuted root cause with file:line evidence, the exact load sequence for a trusted project, and a claim design (for example scoped to the runtime or load) that registers exactly one copy in the trusted main checkout, a worktree and an untrusted folder. Check: read the two dist files and `pi --offline --help` output counts; never edit `~/.pi`, `trust.json` or any repo file outside this research packet.

### Dispatch failure (iteration 1, not a model fault)

The first dispatch (`research-i1-g1`) ran 679 s and failed twice over: cli-pi exited 1 on an llmgateway HTTP 500, and write containment recorded a `containment_violation` on `../spec.md`, which the orchestrator edited mid-dispatch to add the sibling phase rows. The four sibling lineages, then sharing this worktree, moved into their own worktrees (150-153). This session reruns iteration 1 alone in worktree 149, and the orchestrator no longer writes in a worktree while a dispatch runs there.

## Executor switch (restart to generation 2)

The operator switched the executor to GLM 5.3 flash because llmgateway kept returning HTTP 500 and request timeouts for deepseek-v4.1-flash, opencode-go was over its usage limit and cline-pass returned 403. The session held no completed iteration, and its config pins the executor model, so it was restarted through the workflow's `restart` branch: the empty generation 1 moved to `../research_archive/20261019T190857Z/`, and this generation runs on cli-pi `glm-5.3-flash` (llmgateway, thinking max). Foci and angle ids are unchanged.

## Entry 21 (iteration 1)

- Angle: A21
- Focus: A21 Pi fast-mode claim in a trusted project: why does a plain `pi --offline --help` in the trusted main checkout (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, trusted in `~/.pi/agent/trust.json`) list no `--fast` while `-a`, `-na` and the git worktrees list it once, given `claimPackage` in `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`? Test the hypothesis that Pi's resource loader reuses one event bus across a pre-trust load and the trusted load, so the first pass's claim listener survives and every later copy stands down: read `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/resource-loader.js` (`loadCurrentExtensionSet`, `loadExtensionsCached`, `this.eventBus`, the trust passes) and `dist/core/extensions/loader.js` (`createExtensionRuntime`, `invalidate`, `trackEventBusSubscription`), and find where the extension's flags are taken from (which pass's runtime). Output: a confirmed or refuted root cause with file:line evidence, the exact load sequence for a trusted project, and a claim design (for example scoped to the runtime or load) that registers exactly one copy in the trusted main checkout, a worktree and an untrusted folder. Check: read the two dist files and `pi --offline --help` output counts; never edit `~/.pi`, `trust.json` or any repo file outside this research packet.

### Digest (iteration 1, generation 2)

A21 done (ratio 0.9). Root cause confirmed from Pi's loader: the pre-trust pass's claim listener survives on the shared event bus; the user-scope alias wins the claim, then realpath dedupe prunes it in favour of the project copy, which had stood down, so no copy registers (F1-F2, P1). The early return also drops `/fast` and session wiring (F3). Recommended design: register the flag outside the claim and gate only side effects (F5); Pi-side fix options in F6; release-on-trust and realpath-keyed claims ruled out (F7). Next: A22.

## Entry 22 (iteration 2)

- Angle: A22
- Focus: A22 Plugin bridge drift: which `.opencode/plugins/*.js` entry files on main lack the `dualPlugin` export from `.opencode/plugins/lib/v2-bridge.js`, and which tests pin a hard-coded plugin list (for example `PLUGIN_NAMES` in `.opencode/plugins/tests/v2-registration.test.cjs`, the hard-plugin suite, the doctor battery's expected count) instead of enumerating the directory, the gap that let `session-relaunch.js` reach main with only an OpenCode 1 factory? Also check the bridge's event and hook mapping covers every hook the plugins register (`session-relaunch.js` uses `message.updated` and `message.part.updated`), and whether the plugin README and the mirrors under `.claude`, `.codex`, `.hermes` stay in sync. Output: a list of unguarded plugins and pinned lists with file:line, and a guard design that enumerates the directory and fails on any entry file without the dual export. Check: `grep -L dualPlugin .opencode/plugins/*.js` and `node --test .opencode/plugins/tests/v2-registration.test.cjs` read-only; never edit files outside this research packet.

## Entry 26 (iteration 3)

- Angle: A26
- Focus: A26 Command, agent and config dual reads: after the merge, does every file OpenCode 1 and 2 load from `.opencode/commands`, `.opencode/agents`, `opencode.json` and `.skilled/commands` still read the same on both versions, and does OpenCode 2 register any non-command file as a command? The untracked `.skilled/commands/deep/assets/compiled/manifest.jsonl` reappeared in the main checkout after phase 004 of packet 082 removed the tracked `compiled/` and `legacy/` assets (commit `f8f6156c2d`): find the generator that still writes there (grep `compile-command-contracts.cjs`, `render-command-contract.cjs` and any `compiled/manifest.jsonl` writer), say whether its output now lands where OpenCode 2 registers commands, and what moved where. Output: the generator with file:line, the registration risk on each version, and the fix. Check: read-only greps and `git show --stat f8f6156c2d`; never touch the main checkout, never start an OpenCode server, never edit files outside this research packet.

### Digest (iteration 2, generation 2)

A22 done (ratio 0.9). There are no v1-only plugins on main: all 16 regular entry files build dual exports through `dualPlugin`, and sk-vision is the designed native-dual exception. Nothing enforces that. The two v2 suites pin hard-coded plugin lists (12 and 5, union 17), and no test lists `.opencode/plugins` to catch a new plugin. `cleanup.skippedKeys` is asserted only for the exception and never asserted empty for the 16 bridged plugins. Live v2 delivery of the gate-critical event names is unverified on 2.0.32. The plugins README pins 11 plugins against 12. Next: A26.

### Gateway check (round 2)

The round summary counted 2 gateway-error lines in the 014 log and 1 in the 018 log. Those counts came from a loose pattern (`rate` instead of `rate.limit`) that also matches words such as "iterate" and "generate". A recount of the same logs with the strict pattern found 0 in all three. No gateway errors occurred in round 2, so the round stays at full concurrency. The pattern in the round script is now fixed.


### Containment note (iteration 3)

While iteration 3 was dispatching, the orchestrator appended the iteration 2 digest to this log in the same worktree. It removed the append at once, restoring the file byte for byte, and re-added the digest after the dispatch ended. The iteration 3 receipt records exit 0 and no containment violation.

### Digest (iteration 3, generation 2)

A26 done. The `compiled/manifest.jsonl` writer is `render-command-contract.cjs` (`MANIFEST_PATH` at line 24, `appendManifestRow` mkdir-recurses at 138-140). `compile-command-contracts.cjs` writes no manifest. Between phase 004 and `59565c1849` the renderer re-created the emptied `.skilled/commands/deep/assets/compiled/` folder. `59565c1849` moved the writer, the projection seed, the README snippet and the ignore rule to `.skilled/command-support/deep/assets/compiled/`. No non-command file registers on either version: both read one symlinked tree and register markdown only. The main checkout's untracked `manifest.jsonl` dates from July, was never tracked, and is orphaned data that the retired ignore rule no longer hides.

### Spot checks by the orchestrator (iteration 3)

- `render-command-contract.cjs:24` sets `MANIFEST_PATH` to the `command-support` path, and `.gitignore:202` ignores it. Confirmed.
- `git merge-base --is-ancestor 59565c1849 HEAD` succeeds. Confirmed.
- `.opencode/commands` and `.opencode/agents` are symlinks to `../.skilled/commands` and `../.skilled/agents`. `git ls-files .skilled/commands/deep/assets/compiled` lists nothing. Confirmed.

## Entry 30 (iteration 4)

- Angle: A30
- Focus: A30 Architecture synthesis and ranked remediation: read this session's iterations 1 to 3 (A21 Pi fast-mode claim, A22 plugin bridge drift, A26 command, agent and config dual reads) and the four sibling research reports, `../015-post-merge-research-sk-vision/research/research.md` (A23), `../016-post-merge-research-cli-opencode-ci/research/research.md` (A24, A25), `../017-post-merge-research-provisioning/research/research.md` (A27) and `../018-post-merge-research-conformance/research/research.md` (A28, A29). Say which dual-version architecture the remediation should converge on: one bridge per surface or one shared adapter layer, where enforcement belongs (tests that list the plugin, command and package trees from disk instead of pinned lists), and how sk-vision's native-dual exception fits. Output: one ranked remediation list across all ten angles (P1 first), each row with the finding id and its source report, file:line, the fix, the test that proves it, and an owner phase; then the architecture recommendation with the two or three alternatives it rejects and why. Keep each sibling's evidence label (confirmed, documented, inferred) and do not upgrade one. Check: read-only reads of the five reports and the cited lines; never touch the main checkout, never start an OpenCode server, never edit files outside this research packet.

### Digest (iteration 4, generation 2)

A30 done (ratio 0.6). Decision: keep one bridge per surface, and share one enforcement pattern of disk-derived inventories, equality tests and exceptions manifests in blocking CI. sk-vision is a manifest-gated native-dual exception. Rejected: one shared adapter layer, native dual everywhere, and refreshing pinned lists by hand. The ranked list has 35 rows across all ten angles, with P1 first: the Pi flag, the provision list and its guard, the sk-vision teardown and grace bugs, and the pinned plugin lists. No sibling label was upgraded, and about 30 re-read citations held.

### Spot checks by the orchestrator (iteration 4)

- `.opencode/plugins/*.js` counts 17, and `grep -L "dualPlugin("` lists only `sk-vision.js`. `PLUGIN_NAMES` holds 12 and the hard suite's `PLUGINS` 5. `README.md:77` says 11. Confirmed.
- `src/index.ts:123` returns on a lost claim before `registerFlag("fast")` at lines 175-179. Confirmed.
- `v2-bridge.js:280` freezes `skippedKeys` onto the cleanup function. Confirmed.

### Deviation: manual stop at 4 of 10

This session stops by hand after iteration 4 (`manualStop`). The ten angles were split between this session (A21, A22, A26, A30) and four siblings (015 to 018), and every angle is covered. Iteration 4 proposed a fifth iteration to sweep about 227 changed docs for single-version assumptions; that sweep is recorded as an open question instead, so key question 2 stays open (4 of 5 answered).

### Executor note

Iterations 3 and 4 ran on cli-pi `glm-5.3-flash` at thinking max through llmgateway, with no gateway errors. In iteration 4's prep, the graph convergence step once failed on a transient stdin read (`EAGAIN`). A rerun with stdin closed returned the same informational `STOP_BLOCKED` as iteration 3.

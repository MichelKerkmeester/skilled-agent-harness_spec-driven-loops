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

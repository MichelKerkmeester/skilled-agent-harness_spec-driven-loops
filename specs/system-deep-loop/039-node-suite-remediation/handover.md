# Handover — remaining node:test remediation (ready to apply)

Everything below is verified. It stopped short of applying because (a) the
session's auto-mode classifier began intermittently denying edits, and (b) the
compiled-routing piece flips live routing behavior for 6 hubs and carries a
Logic-Sync decision that needs an operator. Apply in an isolated worktree.

## Not a real failure
`mk-goal-lifecycle` (37/37) and `mk-goal-continuation` (24/24) pass when run
individually. Their `not ok` lines in the aggregate run are cross-test
interference (test isolation), not bugs. No fix; a separate isolation concern.

## Cluster A — deep-alignment pins (self-verifying; the test checks marker presence)

### A. Doc-hash re-pins — set each scenario's pinned `sha256:` to current
All 13 (apply as one clean set; re-verify each with `shasum -a 256 <source>`):

| Scenario | source | new sha256 |
|---|---|---|
| DAB-012 | commands/deep/review.md | f2d5c62a86b012f7f3b1a76617fe5828136305fce7d85f6d18995ceef17958fc |
| DAB-013 | commands/doctor/speckit.md | 40c9c35597b393c9a1847bb7d6a0da1e3eb57558ef70c14da8ce52c670c617c8 |
| DAB-014 | commands/memory/search.md | 390ee7c3b861f40c1326664cefacdfaef56da1d7175a9c76831ae9719624cc47 |
| DAB-016 | commands/create/benchmark.md | 7069a4be16388a3e609efc72e4bc48b8663b03261f93a03068dcb716ae18a3c5 |
| DAB-018, DAB-019, DAB-020 | commands/doctor/mcp.md | cf34916ef41a5af6a735e4cbea57a5982efbd298a138b9ee2eeb5e6313402b53 |
| DAB-014 | commands/memory/search.md | 390ee7c3b861f40c1326664cefacdfaef56da1d7175a9c76831ae9719624cc47 |
| DAB-021, DAB-022 | commands/memory/learn.md | 930c9111acd7eeb2caff4e4192b6b5179402367b8afe71a11238ad6649c4c8c8 |
| DAB-023, DAB-024 | commands/memory/manage.md | c0136ed22d0f605aef663a6be0ac4ab19211fdf9e1374ebb2b51c71fc904821e |
| DAB-025 | commands/memory/save.md | 142aa508aea41f57e5b2ee0aee6c31107c988aab98c7ce26ba6c0291849ef382 |
| DAB-026 | commands/goal-opencode.md | f96e0c06fcc442e80a300bd1e07eaecca7f93c2c10a494eb3437554c904385dd |

Re-verify each hash at apply time (`shasum -a 256 <source>`); the docs are live.
Also re-pin the runner constant in `command-scenario-rollout.test.cjs`:
`EXPECTED_RUNNER_SHA256` f568f79f… → cc5e0fa8d9e1e7b58c3cd3d24be0d8e936e08e64143b6615bd3ddfe386d38aba.
The runner re-pin is safe: subtest 3 recomputes the v1 scoring fingerprints
against the current runner right after, so a real scoring regression still fails.

### B. Command renames (source moved — fix path AND hash)
- DAB-027 `commands/agent_router.md` → `commands/agent-router.md`, hash
  c117fbfa… → 304e405dc22545d08504d5d9ae47b2af24235d7803625497d04fd0fffaa1079a
- DAB-015 (not covered by the failing tests, but stale) `commands/prompt-improve.md`
  → `commands/prompt/improve.md`, hash 86d9e5e6… → f7da5445df756ba0d39bcc57b8e7c62b577daf2fced07e0240db3ca6bcb7314e

### C. DECISION NEEDED — DAB-017
Pins `commands/design/audit.md`, which the sk-design consolidation removed (no
`design/` command dir; no audit under `interface/`). Options: retire DAB-017,
or repoint it to whatever command absorbed the design-audit surface. Until this
is resolved, `command-scenario-rollout` subtest 2 cannot go fully green.

### D. Adapter inventory (real drift, not a pin)
`sk-doc-command-adapter` fails: `discover(scope): shared inventory count 35 differs
from prompt-sync count 34` (adapter line 230). A command exists in the shared
reference-check inventory but not the prompt-sync gate (or vice versa). Diff the
two inventories to find the odd command and reconcile the source of truth.

## Cluster B — compiled-route-manifest (16) — HIGH BLAST RADIUS, operator sign-off

Re-promotion flips 6 hubs (mcp-tooling, cli-external-orchestration, sk-prompt,
sk-design, sk-doc, system-deep-loop) from legacy- to compiled-serving in the live
`.opencode/bin/lib/compiled-routing` tree. That is the packet's intended
end-state but it changes runtime routing.

### Step 1 — fix two authored compilers (paths under specs/, == .opencode/specs/)
- `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs` ~line 223: bundle-rule mode token `'sk-create-flowchart'` → `'sk-create-diagram'` (live sk-doc renamed the mode).
- `.../009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs` ~lines 196-201: remove the `alignment.runtimeLoopType !== 'review'` clause. **LOGIC-SYNC:** the compiler asserts a value the live registry deliberately dropped (`runtimeLoopType 'review' → null`, commit bc035d7515). Choose: edit the compiler (recommended — the registry change was intentional) OR restore `runtimeLoopType: 'review'` on the live `alignment` mode in `.opencode/skills/system-deep-loop/mode-registry.json`.

### Step 2 — re-pin 6 authored manifests (leave sk-code alone)
In `.../013-live-activation/activation/<hub>/manifest.json`, set `effectivePolicyHash`
to the recomputed value (keep generation, `servingAuthority:"compiled"`,
`shadowOnly:false`). Recompute AFTER Step 1 with the agent's script:
```
node -e 'const fs=require("fs"),path=require("path");
const base=fs.realpathSync(".opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program");
const CH={"mcp-tooling":"003-mcp-tooling","cli-external-orchestration":"004-cli-external-orchestration","sk-prompt":"005-sk-prompt","sk-design":"006-sk-design","sk-doc":"007-sk-doc","system-deep-loop":"002-system-deep-loop"};
for(const [h,c] of Object.entries(CH)){for(const k of Object.keys(require.cache))delete require.cache[k];
const ba=require(path.join(base,"009-parent-hub-rollout",c,"harness","build-artifacts.cjs"));
const s=ba.loadSnapshot().snapshot.policy;console.log(h,s.effectivePolicyHash,"gen="+s.activationGeneration);}'
```
Expected (verify at apply time): mcp-tooling 00390be9… (g4), cli-external-orchestration 1346232f… (g5), sk-prompt 13afe167… (g5), sk-design c599f5a3… (g6), sk-doc 07a2d0a8… (g5), system-deep-loop 7c7cf3e9… (g4).

### Steps 3-5 — resolve, re-promote, verify
```
node .opencode/bin/compiled-route-sync.cjs --check      # expect: all 7 hubs resolve (fixes subtests 9,11-23)
node .opencode/bin/compiled-route-sync.cjs              # re-promote authored -> runtime; prints a --finalize cmd
node .opencode/bin/compiled-route-sync.cjs --finalize <rollback-path>
node .opencode/bin/compiled-route-sync.cjs --verify     # all 7 resolve; 0 reads under .opencode/specs
node --test --test-reporter=tap --test-reporter-destination=stdout .opencode/bin/tests/compiled-route-manifest.test.cjs  # expect # fail 0
```
Never hand-edit `.opencode/bin/lib/compiled-routing/**` — Step 4 regenerates it and its fingerprint. Ordering: Step1 → Step2 → Step3 → Step4 → --finalize → test.
Optional follow-up cleanup (inert, not needed for the test): the sk-doc canary
`validate-canary.cjs` / `canary-cases.v1.json` still name `sk-create-flowchart`.

## Cluster C — mk-communication-projection (19) — NOT committably fixable
All 19 fail on `ERR_MODULE_NOT_FOUND` for the git-ignored, unbuilt
`sk-communication/cli-communication-projection/dist/index.js`. Source is healthy;
`npm ci && npm run build` in that skill dir emits the dist and greens the suite —
but the artifact is git-ignored, so a build is not durable. Committable options:
(1) guard the suite to skip-with-notice when dist is absent (mirrors the runner's
"vitest not installed" pattern); (2) build dist in CI/test setup. Design choice.

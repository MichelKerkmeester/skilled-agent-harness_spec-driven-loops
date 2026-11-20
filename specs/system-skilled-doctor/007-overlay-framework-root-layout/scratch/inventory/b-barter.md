# Barter path-assumption inventory (worker B, @context on Opus, read-only)

Paths are relative to `ai-speckit/`. `BO` = `skilled/barter-overlays/`.

## Orchestrator spot-checks

Confirmed by reading:
- the manifest layout-link targets at `BO/overlay-manifest.json:146-153`
- the verify argv at `:1536-1560`
- `BO/opencode/scripts/git-hooks/pre-commit:83-90`
- `BO/skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:180-185`
- `BO/skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:60-84`
- `.gitignore:68`

Engine facts checked against these:
- Layout link targets carry no containment check.
- `relayoutLinkTargets` (`overlay-engine.cjs:6104-6120`) rewrites a link whose target reaches into a moved copy.
- `planLayoutLinks` retargets a recorded link whose manifest target changed (`:2473-2476`), so `apply` updates the link and `sync-state.json` with no hand edit of the state file.
- `runCommand` runs verify argv with `cwd: root` and no path check (`:2525-2529`), so `../overlays/checks/x.cjs` works.

## A. Must change

### Phase 004, relayout part: the naming rule, in tree (old phase 005)
- `BO/overlay-manifest.json`: 131 `source` values. Under framework-root, `skilled/` becomes `framework/` and everything else gets `root/`. `apply --relayout` rewrites them.
- `BO/overlay-manifest.json:148,152`: layout-link targets `../../barter-overlays/skilled/...`. `apply --relayout` retargets them to `../../barter-overlays/framework/...`.
- `BO/tests/compiled-route-guard.test.cjs:16`: `'..','skilled','bin',...`. Becomes `'..','framework','bin',...`.
- `BO/opencode/plugins/tests/barter-git-write-gate.test.cjs:24`: climbs to `skilled/skills/sk-git/...` from the source copy. Becomes `root/opencode/...` with one more `..`, and `framework/skills/...`.
- `BO/opencode/plugins/tests/barter-overlay-guard.test.cjs:41`: `skilled/hooks/barter-overlay-guard/lib/...`. Becomes `framework/hooks/...`.
- `BO/opencode/plugins/tests/barter-overlay-guard.test.cjs:109,124`: the refusal regex `barter-overlays\/opencode\/...`. Becomes `barter-overlays\/root\/opencode\/...`.
- `BO/skilled/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs`: the fixture source paths at `:149-201`. Check each against the rule.
- `init-repository.sh:40,57-58,75`: the `skilled/skills/sk-code/...` source prefix and `destination.slice(1)` dot drop. Become `framework/...`.
- `tests/init-repository.test.sh:41,47,53,70`: `"source": "skilled/skills/sk-code/..."`. Becomes `framework/...`.
- `BO/README.md:54,426-452`: the stated rule and the layout tree. `:139,202,214,234,357,458` hold source paths.
- `BO/AGENTS.md:324,327`, applied to `skilled/AGENTS.md`, plus the generated `.cursor/rules/repo-local.md:30-34`: a session "reads `skilled/barter-overlays/skilled/skills/sk-git/sk-git-skilled/SKILL.md`". Load-bearing, because agents follow it at runtime.
- `BO/skilled/repo-rules/barter-overlay-first.md:50,59`: "with the leading dot dropped".
- sk-git and sk-code docs under BO that name `barter-overlays/skilled/skills/...` source paths:
  - `sk-git/SKILL.md:43,101`, the sg-004 playbook, `ai-speckit-change-commit-push.md:39-44`, the sk-git-skilled playbook `:71-72`, `assets/worktree-checklist.md:27`
  - each sk-code mode `ROUTER.md`, for example sk-code-backend-system `:90`, plus `ROUTER.md:822`, `sk-code-frontend/README.md:61`, and `surface-detection/unknown-fallback.md:58` (runnable)

### Phase 005: the location (old phase 006)
- `skilled/.skilled-overlays.json:1`: becomes `{ "overlayDir": "../overlays" }`.
- `BO/checks/repin-survival.cjs:16-17` and `BO/checks/compiled-routing-byte-parity.cjs:93-94`: `overlayRoot = path.resolve(__dirname,'..')` and `treeRoot = path.resolve(overlayRoot,'..')`. treeRoot becomes `path.resolve(overlayRoot, '..', 'skilled')`.
- `BO/tests/compiled-route-guard.test.cjs:17`: `'..','..','.skilled','bin',...`. Becomes `'..','..','skilled','.skilled','bin',...`.
- `BO/tests/compiled-routing-byte-parity.test.cjs:64`: `path.join(root,'barter-overlays')`, fixture only. It passes both roots explicitly (`:77-78`), so a rename is optional.
- `BO/overlay-manifest.json:1540-1542,1557-1559`, the verify argv: `barter-overlays/checks/...`. Becomes `../overlays/checks/...`.
- `BO/overlay-manifest.json:148,152`, the layout-link targets: after the relayout in phase 004 they are `../../barter-overlays/framework/...`. They become `../../../overlays/framework/...` by hand in the manifest, and `apply` then retargets the links.
- The hook sources (section C): the edit guard core, the commit gate and the git-write gate, plus their tests:
  - `opencode/plugins/tests/barter-overlay-guard.test.cjs:25,28,34,43,48,51,67`
  - `skilled/hooks/barter-overlay-guard/tests/barter-overlay-guard-core.test.cjs:26,29,35,43,73,83,178,190,201`
  - `opencode/plugins/tests/barter-git-write-gate.test.cjs:66`
  - `skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs:80`
- `init-repository.sh:6,38,113-114,124-126`: `OVERLAYS_DIR="$SCRIPT_DIR/skilled/barter-overlays"` and the next-step text.
- `sync-skilled-specs.mjs:12,28`: `path.join(ROOT,'skilled','barter-overlays','overlay-manifest.json')`.
- `tests/init-repository.test.sh:19,32,63,64,97` and `tests/node-version-policy.test.sh:165-173`: `$FIXTURE/skilled/barter-overlays/...`.
- `.gitignore:68`: `/skilled/barter-overlays/repin-runs/`. Becomes `/overlays/repin-runs/`. Also, the `skilled/.gitignore` rules for `.skilled/**` (node_modules, dist at `:38-40`) no longer cover `overlays/framework/`, so the root `.gitignore` needs matching lines.
- `BO/README.md:132`: `require("./barter-overlays/overlay-manifest.json")`, run from `skilled/`. Plus the prose paths.
- `BO/REPO RULES.md:51,70` and `barter-overlay-first.md` (folder name throughout).
- `README.md:11,19,76,105,112,126,428,445`, `CONTRIBUTING.md:11-199` (about 14 lines), `developer-questions.md:7`, `skilled/README.md:9`, `skilled/CONTRIBUTING.md:9`: prose.

## B. False positives and history
- The `skilled/specs` link points at `../specs/skilled-barter-overlays`, a spec track name.
- `AGENT_TRACK = 'skilled-barter-overlays'` in `barter-git-write-gate.mjs:28` and its uses in the sk-git docs and README: the same track name.
- Imports resolved from the destination: the git-hook handovers, and the overlay copies of upstream code.
- The changelog `skilled-coder/v4.1.0.0.md` and the generated `.index/corpus-manifest.json`: history.
- No hits in `install.sh`, `setup-project.sh`, `publish-spec.sh`, `remove-project.sh`, `.gitattributes` or `.github/**`.

## C. Hooks: every one breaks on the folder move (phase 005), none on the relayout (phase 004)
- **C1. Edit guard core** (`BO/skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`):
  - What it does: `:52-56` expects the overlay folder directly under the tree root, `:63-66` lists candidates `../../../barter-overlays` and similar, `:75-77` walks looking for a `barter-overlays` folder, `:83` throws, and `:149` takes `treeRoot = overlaysRoot/..`.
  - After the move: `:83` throws, and the plugin catches it and allows the edit (`opencode/plugins/barter-overlay-guard.js:41-43`), so the guard **fails open** with no message.
  - Fix: read `skilled/.skilled-overlays.json`, or probe `<tree>/../overlays`, and derive treeRoot as the folder holding `.skilled`.
- **C2. Commit gate** (`BO/opencode/scripts/git-hooks/pre-commit:83-89`):
  - What it does: it tests `$TREE_ROOT/barter-overlays/overlay-manifest.json`, then `$TREE_ROOT/skilled/barter-overlays/...`.
  - After the move: `:89` is false, so the overlay status and pre-commit checks never run and the hook exits 0. It **skips silently**.
  - Fix: test for `overlays/overlay-manifest.json` beside `skilled/`.
- **C3. Git-write gate** (`BO/skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:180-185`):
  - What it does: it probes `<tree>/barter-overlays/overlay-manifest.json`.
  - After the move: it returns null, every session reads as `project`, and ai-speckit loses commit and push rights. It **fails closed**.
  - Fix: probe `path.join(path.dirname(tree), 'overlays', 'overlay-manifest.json')`.
- How `core.hooksPath` gets set is UNCONFIRMED.

## D. Test and check commands
- CI (`.github/workflows/root-tests.yml:71`) runs `bash tests/run-all.sh`, which runs only `tests/*.test.sh` (`run-all.sh:26`).
- The overlay `.cjs`/`.mjs` tests are not in CI. Run them directly with `node --test <file>`.
- The verify steps run during `apply` and `status`: `node barter-overlays/checks/compiled-routing-byte-parity.cjs` and `node barter-overlays/checks/repin-survival.cjs`.
- Engine commands, run from `skilled/` (`BO/README.md:34-40`): `node .skilled/commands/doctor/scripts/overlay-engine.cjs status | apply | ...`.
- Gate check: `node .skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs --check "<cmd>" --cwd .`.

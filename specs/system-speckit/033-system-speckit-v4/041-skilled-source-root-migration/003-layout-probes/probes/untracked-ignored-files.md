---
title: "Untracked and ignored files"
description: "Question 9: the untracked and ignored files under .opencode in both checkouts, which of them name .opencode, and how each is rebuilt or reset after the move."
---

# Untracked and ignored files (Q9)

**Result:** neither checkout has an untracked, unignored file under `.opencode/`. Every entry there is ignored and falls into four families, each rebuilt or reset by a tracked command: installed dependencies (`npm install`), build output (`npm run build`), runtime databases and leases the runtime recreates on its next start, and logs and gate state the writers regenerate. Two entries hold operator state no command recreates: the main checkout's `.opencode/hooks/hook-flags.env`, a copy of `hook-flags.env.example`, and the runtime databases whose rows are history, above all `deep-loop-graph.sqlite` (2,964 `.opencode` hits). Many writers still build `.opencode/...` paths from string literals, for example `system-skill-advisor/runtime/lib/freshness/generation.ts:13`, `plugins/system-dist-freshness-guard.js:35`, `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:60`, `plugins/codex-hooks-watchdog.js:23` and `hooks/dispatch/lib/dispatch-audit.mjs:574`. They keep working while `.opencode` resolves, and phase 009 retargets them.


All results here ran against worktree 055 at base `d26f0c60ca88dab922752ab3d9ce8a07463934ae`.

## Counts (orchestrator)

Commands, per checkout: `git ls-files --others --ignored --exclude-standard --directory` and `git ls-files --others --exclude-standard`, then per entry under `.opencode/` a file count and `rg -a -c -F .opencode`. Lists and TSVs sit in `/tmp/skilled-probes-003/logs/`.

| Checkout | Ignored entries | Under `.opencode/` | Files in those entries | Entries naming `.opencode` | `.opencode` hits | Untracked, unignored under `.opencode/` |
|----------|-----------------|--------------------|------------------------|---------------------------|------------------|------------------------------------------|
| Worktree 055 | 24 | 18 | 21591 | 10 | 279 | 0 |
| Main checkout | 349 | 184 | 39940 | 28 | 6211 | 0 |

Worktree 055's list includes the skill-advisor `node_modules`, `dist` and database that the phase 003 Pi smoke test bootstrapped at 18:31Z.

## Classification (unit U10, returned verbatim below its scope note)

**Scope & method.** Entries are exactly the `under_opencode=yes` rows of the two TSVs (`/tmp/skilled-probes-003/logs/055-skilled-source-root-migration-ignored.tsv`, `/tmp/skilled-probes-003/logs/Public-ignored.tsv`; main checkout = `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, per `.git` gitdir pointer). Every claim below was settled by opening tracked sources only — no listed ignored artifact was opened. Commands are written for the post-move layout: `.skilled/` is today's `.opencode/` tree (the move-back symlink plan is recorded at `.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep`); substitute `.skilled/` for `.opencode/` in every command. Identical artifact families (SQLite `-shm`/`-wal` sidecars, `.log.1` rotations) share one row, as do the stub `node_modules` dirs. `npm ci` appears only where a tracked line uses it; elsewhere `npm install` is the package-manager operation implied by the manifest + lockfile.

---

## Table A — worktree 055 (`worktrees/public/055-skilled-source-root-migration`)

Source rows: `055-…-ignored.tsv:2–19`. All entries below are `under_opencode`.

| Entry | Kind | Producer (path:line) | Rebuild or reset command | Evidence (path:line) |
|---|---|---|---|---|
| `.opencode/node_modules/` | installed dependencies | `.opencode/package.json:3–10` (`@opencode-ai/plugin`, vitest, ajv; lockfiles `.opencode/package-lock.json`, `.opencode/bun.lock` present) | `cd .skilled && npm install` | `.opencode/package.json:3–10`; tsq `055-…:2` |
| `.opencode/skills/.state/advisor/skill-graph-generation.json` | runtime state (skill-graph generation counter) | `system-skill-advisor/runtime/lib/freshness/generation.ts:13` (path), `:50–66` (atomic write) | `node .skilled/bin/skill-advisor.cjs advisor_rebuild --force` (republishes); safe to delete — readers treat absent as generation 0 | `generation.ts:13,52`; `handlers/advisor-rebuild.ts:90`; `references/runtime/freshness-contract.md:153` |
| `.opencode/skills/system-deep-loop/runtime/node_modules/` | installed dependencies | `system-deep-loop/runtime/package.json:14–19` (zod, better-sqlite3, tsx, `@spec-kit/shared`); `runtime/package-lock.json` present | `npm install` in `.skilled/skills/system-deep-loop/runtime` | `runtime/package.json:14–19`; `runtime/package-lock.json` |
| `.opencode/skills/system-skill-advisor/runtime/database/.skill-advisor-owner.json` | runtime state (owner lease) | `.opencode/bin/system-skill-advisor-launcher.cjs:103` (name), `:422–434`, `:436–450` (writers) | delete; recreated on next launcher run | `launcher.cjs:103,422,436`; `shared/embeddings/providers/hf-local.ts:49,270–271` |
| `.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json` | runtime state (launcher PID lease) | `.opencode/bin/system-skill-advisor-launcher.cjs:102`, `:104`, `:330` | delete; recreated on next launcher run | `launcher.cjs:102–104,330` |
| `.opencode/skills/system-skill-advisor/runtime/database/skill-graph-daemon-lease.sqlite` (+ `-shm`, `-wal`) | runtime database (daemon lease) | `system-skill-advisor/runtime/lib/daemon/lease.ts:54` (filename), `:99–101` (default path), `:123–134` (schema) | delete; recreated on next lease acquisition (`openLeaseDatabase`) | `lease.ts:54,99–101,143,153` |
| `.opencode/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` (+ `-shm`, `-wal`) | runtime database (skill graph) | `system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:134–136` (filename, schema init); path `advisor-server.ts:44–46`, `lib/scorer/projection.ts:59–61` | `bash .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh` (rebuilds via `skill_graph_scan`, `:64`); or delete + `advisor_rebuild --force` | `skill-graph-db.ts:136`; `init-skill-graph.sh:19,47,64`; `references/runtime/freshness-contract.md:153`; `database/README.md:19` |
| `.opencode/skills/system-skill-advisor/runtime/dist/` | build output | `system-skill-advisor/runtime/package.json:8` (`build`), `:9` (`postbuild` data copy) | `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` | `package.json:8–9`; `README.md:104–105` |
| `.opencode/skills/system-skill-advisor/runtime/node_modules/` | installed dependencies | `system-skill-advisor/runtime/package.json:14–19` (incl. native `better-sqlite3`); `runtime/package-lock.json` present | `npm --prefix .skilled/skills/system-skill-advisor/runtime install` | `package.json:14–19`; `README.md:104` |
| `.opencode/skills/system-spec-kit/.node-version-marker` | runtime state (Node/ABI marker) | `system-spec-kit/runtime/cli/setup/record-node-version.js:20–21,31`; wired as `postinstall` in `package.json:26` | `node .skilled/skills/system-spec-kit/runtime/cli/setup/record-node-version.js` (repair path `bash …/rebuild-native-modules.sh`) | `record-node-version.js:21,31`; `package.json:26`; `rebuild-native-modules.sh:46–50` |
| `.opencode/skills/system-spec-kit/node_modules/` | installed dependencies (workspace root) | `system-spec-kit/package.json:6–10` (workspaces `shared`,`runtime`,`runtime/cli`), `:26` | `cd .skilled/skills/system-spec-kit && npm ci` (or `npm install`) | `package.json:6–10`; `CONTRIBUTING.md:36–38`; `commands/doctor/scripts/doctor-runtime-bootstrap.sh:177–181` |
| `.opencode/skills/system-spec-kit/runtime/cli/dist/` | build output | `system-spec-kit/runtime/cli/package.json:13` (`prepare-build` → `tsc --build` → `record-build`) | `npm run build --workspace=@spec-kit/cli` from `.skilled/skills/system-spec-kit` (or `npm run rebuild` in the cli dir) | `cli/package.json:11–15`; `doctor-runtime-bootstrap.sh:187` |
| `.opencode/skills/system-spec-kit/runtime/dist/` | build output | `system-spec-kit/runtime/package.json:16` (`prepare-build` → `tsc --build` → `finalize-dist.mjs`) | `npm run build --workspace=@spec-kit/runtime` (or `npm run rebuild`, `:17`) | `runtime/package.json:15–17`; `doctor-runtime-bootstrap.sh:186` |
| `.opencode/skills/system-spec-kit/shared/dist/` | build output | `system-spec-kit/shared/package.json:15` (`tsc --build`) | `npm run build --workspace=@spec-kit/shared` (root `pretest:root` does it, `package.json:20`; the advisor build also builds it, advisor `package.json:8`) | `shared/package.json:15`; `system-spec-kit/package.json:20` |

---

## Table B — main checkout (`MEGA/Development/Code_Environment/Public`)

Source rows: `Public-ignored.tsv:8–191`. Entries below are the `under_opencode=yes` rows.

| Entry | Kind | Producer (path:line) | Rebuild or reset command | Evidence (path:line) |
|---|---|---|---|---|
| `.opencode/.DS_Store`; `.opencode/changelog/.DS_Store`; `.opencode/commands/.DS_Store`; `.opencode/skills/.DS_Store`; `.opencode/skills/mcp-code-mode/.DS_Store`; `.opencode/skills/system-spec-kit/.DS_Store` | other (macOS Finder metadata) | none in-repo (OS-generated) | `find .skilled -name .DS_Store -delete` | `.gitignore:16`; `~/.gitignore_global:24`; `Public-ignored.tsv:8,11,12,30,133,173` |
| `.opencode/.gitignore`; `.opencode/skills/system-spec-kit/.gitignore`; `.opencode/skills/system-spec-kit/runtime/cli/.gitignore`; `.opencode/skills/sk-vision/.gitignore`; `.opencode/skills/sk-vision/vision-runtime/.gitignore` | other (local ignore files; untracked) | producer UNKNOWN (no tracked writer). `.opencode/.gitignore`'s content is documented: repo-wide ignores for `package.json`, `package-lock.json`, `bun.lock` | UNKNOWN (no tracked template); recreate by hand only if those rules are wanted | `skills/sk-vision/changelog/v0.3.0.0.md:77`; `Public-ignored.tsv:9,148,150,174,178` |
| `.opencode/bin/tests/.sandboxes/` | other (test sandbox parent) | `bin/compiled-routing-foundation.vitest.ts:263–265` (mkdir + mkdtemp; only the child is reaped, `:273`); also `bin/tests/compiled-route-manifest.test.cjs:22` | `cd .skilled && npx vitest run --config vitest.config.bin.ts` (or `rm -rf` to reset) | `bin/README.md:220`; `compiled-routing-foundation.vitest.ts:263–265,273` |
| `.opencode/commands/deep/assets/compiled/manifest.jsonl` | runtime state (append-only render ledger) | `system-deep-loop/runtime/scripts/render-command-contract.cjs:15` (path), `:126–129` (append); invoked per invocation by `.opencode/commands/deep/*.md` | none — regenerated by running a deep command; reset `rm` | `render-command-contract.cjs:15,126–129`; `commands/deep/assets/compiled/README.md:47`; `system-deep-loop/changelog/v2.0.0.0.md:19` |
| `.opencode/commands/doctor/scripts/node_modules/` | installed dependencies (stub) | UNKNOWN (no manifest or installer in that dir; TSV records 1 file) | `rm -rf` (scripts need only Node builtins + repo files) | `Public-ignored.tsv:14` (`files=1`); `commands/doctor/scripts/parent-skill-check.cjs:38–40` |
| `.opencode/hooks/dispatch/node_modules/`; `.opencode/hooks/dispatch/lib/node_modules/`; `.opencode/hooks/dispatch/pi/node_modules/` | installed dependencies (stubs) | UNKNOWN (no tracked manifest/installer; TSV records 1 file each) | `rm -rf` (sources import only `node:` builtins + relative paths) | `Public-ignored.tsv:15–17` (`files=1`); `hooks/dispatch/lib/dispatch-audit.mjs:12–13` |
| `.opencode/hooks/hook-flags.env` | runtime state (operator config) | operator copy of tracked template `hooks/hook-flags.env.example:1–6`; read by `hooks/shared/hook-flags.cjs:88` | `cp .skilled/hooks/hook-flags.env.example .skilled/hooks/hook-flags.env` | `hooks/README.md:74`; `hook-flags.env.example:3`; `hook-flags.cjs:88` |
| `.opencode/logs/autostash-orphan-alerts.log` | runtime state (log) | `scripts/git-hooks/lib/autostash-orphan-guard.sh:38` | delete; regenerated by post-commit/post-merge/post-rewrite hooks | `autostash-orphan-guard.sh:38`; `logs/README.md:30` |
| `.opencode/logs/cli-dispatch-audit.log` + `.log.1` | runtime state (log + rotation) | `hooks/dispatch/lib/dispatch-audit.mjs:574` (path), `:576` (`.1` suffix), `:579–582` (rotation); writer `plugins/cli-dispatch-audit.js:59` | delete; regenerated per observed dispatch | `dispatch-audit.mjs:574,576`; `cli-dispatch-audit.js:59` |
| `.opencode/logs/codex-hooks-watchdog.log` | runtime state (log) | `plugins/codex-hooks-watchdog.js:23` | delete; regenerated by the watchdog | `codex-hooks-watchdog.js:23` |
| `.opencode/logs/completion-sentinel-advisories.log` | runtime state (log) | `system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:78` (path); append invoked from `plugins/system-completion-sentinel.js:155` | delete; regenerated on the next advisory | `completion-evidence-sentinel.cjs:78,315–317`; `system-completion-sentinel.js:155` |
| `.opencode/logs/dist-freshness-guard.log` + `.log.1` | runtime state (log + rotation) | `plugins/system-dist-freshness-guard.js:35` (path), `:93–101` (rotation to `.1` at `:99`) | delete; regenerated on next stale-dist detection | `system-dist-freshness-guard.js:35,98–100` |
| `.opencode/logs/post-edit-quality.log` | runtime state (log) | `plugins/sk-code-post-edit-quality.js:33` | delete; regenerated on next edit | `sk-code-post-edit-quality.js:33` |
| `.opencode/node_modules/` | installed dependencies | `.opencode/package.json:3–10`; lockfiles `.opencode/package-lock.json` + `.opencode/bun.lock` | `cd .skilled && npm install` | `.opencode/package.json:3–10`; `Public-ignored.tsv:27` |
| `.opencode/opencode-rag.log` | runtime state (log) | UNKNOWN — no tracked source references it (repo-wide search found only historical spec audits; the writer is outside the tracked tree) | delete; if it returns, its writer is external | `Public-ignored.tsv:28`; negative grep result across `.opencode` |
| `.opencode/plugins/node_modules/` | installed dependencies (stub) | UNKNOWN (no manifest/installer; TSV records 1 file). Plugin bare imports resolve via `.opencode/node_modules` | `rm -rf` | `Public-ignored.tsv:29` (`files=1`); `plugins/system-speckit-completion.js:28`; `.opencode/package.json:4` |
| `.opencode/skills/.state/advisor/skill-graph-daemon-lease.sqlite` | runtime database (legacy/quarantine lease) | `system-skill-advisor/runtime/lib/daemon/lease.ts:55–61` (`LEGACY_LEASE_RELATIVE_PATH`), `:107–109`; quarantine use `lib/daemon/watcher.ts:294–296` | delete; active lease now lives under `…/system-skill-advisor/runtime/database/`; recreated only if the legacy path is used | `lease.ts:55–61,107–109`; `watcher.ts:294–296`; `.opencode/skills/.state/advisor/README.md:25,117` |
| `.opencode/skills/.state/advisor/skill-graph-generation.json`; `….json.67031.1789156733620.tmp`; `….json.68450.1788960698385.tmp` | runtime state (generation counter + crash-leftover atomic-write temps) | `lib/freshness/generation.ts:13` (path), `:52` (temp name `${file}.${pid}.${Date.now()}.tmp`); publisher `handlers/advisor-rebuild.ts:90` | delete; republished by `node .skilled/bin/skill-advisor.cjs advisor_rebuild --force` | `generation.ts:13,50–56`; `advisor-rebuild.ts:90`; `references/runtime/freshness-contract.md:153` |
| `.opencode/skills/.state/completion-sentinel/advisory-dedup.json` | runtime state (dedup store) | `completion-evidence-sentinel.cjs:77` (state dir), `:79` (filename), `:268–278` (atomic write) | delete; recreated on next sentinel advisory (`plugins/system-completion-sentinel.js:133,155`) | `completion-evidence-sentinel.cjs:77–79,268–278` |
| `.opencode/skills/.state/goal/.archive/`; `.locks/`; five `<64-hex>.json` session files | runtime state (goal store + cross-process locks + archive) | `plugins/opencode-goal.js:36–37` (default dir), `:1158` (state file), `:1143` (`.archive`); locks `hooks/goal/lib/goal-core.cjs:45–47` | delete; recreated when a goal is set/session sweeps run | `opencode-goal.js:36–37,1143,1158`; `goal-core.cjs:45–47`; `skills/.state/goal/README.md:33–35` |
| `.opencode/skills/.state/loop-guard/.archive/`; `guard-warnings.log` | runtime state (dispatch-guard state + log) | `hooks/task-dispatch/lib/dispatch-guard.cjs:42` (dir), `:43` (`.archive`), `:44` (log name), `:418–427` (archive sweep) | delete; recreated on next guarded dispatch | `dispatch-guard.cjs:42–44,418–427`; `plugins/system-deep-loop-guard.js:59` |
| `.opencode/skills/.state/spec-gate/.archive/`; ~85 `<session-or-marker>.json` files | runtime state (per-session gate state + archive) | `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:60` (dir), `:61` (`.archive`), `:580–581` (file naming), `:613` (`writeGateStateAtomic`), `:841–863` (archive sweep); adapters `plugins/system-spec-gate.js:167,190` | delete; recreated per session/marker on next gate run | `spec-gate-core.mjs:60–61,580–581,613,841–863`; `system-spec-gate.js:167`; `Public-ignored.tsv:45–130` |
| `.opencode/skills/.state/spec-gate/spec-gate-warnings.log` + `.log.1` | runtime state (log + rotation) | `spec-gate-core.mjs:62` (log name), `:63` (`.1`), `:657–676` (rotation), `:745` (`appendWarningLog`) | delete; regenerated on next gate warning | `spec-gate-core.mjs:62–63,674–676,745` |
| `.opencode/skills/mcp-code-mode/mcp-server/node_modules/` | installed dependencies | no manifest in checkout; created by the installer's `npm install` (`scripts/install.sh:385–393`); doctor install contract `doctor-mcp-install.yaml:108–111` | `cd .skilled/skills/mcp-code-mode/mcp-server && npm install` (requires the manifest — see next row) | `install.sh:385–393`; `doctor-mcp-install.yaml:107,111` |
| `.opencode/skills/mcp-code-mode/mcp-server/dist/` | build output | `npm run build` in mcp-server per the doctor fallback `doctor-mcp-install.yaml:110–111`; entry-point health check `:106` | `cd .skilled/skills/mcp-code-mode/mcp-server && npm install && npm run build` | `doctor-mcp-install.yaml:106,110–111`; `doctor-mcp-debug.yaml:106–110`; `mcp-doctor.sh:249` |
| `.opencode/skills/mcp-code-mode/mcp-server/package.json` | other (untracked manifest) | UNKNOWN — no tracked line creates it; absent from the 055 worktree; ignored by the documented `.opencode/.gitignore` rules | UNKNOWN — without it the documented build cannot run; the tracked installer expects it (`install.sh:122` reads it as the engine-range manifest) | `install.sh:122,124–127`; `skills/sk-vision/changelog/v0.3.0.0.md:77`; `Public-ignored.tsv:136` |
| `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/package.json` | other (placeholder manifest) | UNKNOWN (no tracked writer); the tracked README describes it as a placeholder and says `npm install` here "does nothing useful" | none needed; do not install | `mcp-click-up/mcp-servers/clickup-mcp/README.md:33`; `Public-ignored.tsv:137` |
| `.opencode/skills/sk-communication/cli-communication-projection/node_modules/` + `dist/` | installed dependencies + build output | `cli-communication-projection/package.json:63–65` (`build`, `prepare` = build); `package-lock.json` present | `cd .skilled/…/cli-communication-projection && npm ci` (runs `prepare` → build) or `npm run build` | `package.json:63–65,72–76` |
| `.opencode/skills/sk-design/sk-design-md-generator/backend/node_modules/` + `dist/` | installed dependencies + build output | `backend/package.json:14` (`build` = `tsc -p tsconfig.build.json`); `package-lock.json` present | `cd .skilled/…/backend && npm ci && npm run build` | `backend/package.json:13–14,22–27` |
| `.opencode/skills/sk-doc/node_modules/` | installed dependencies | `sk-doc/package.json:10–12` (`@spec-kit/shared` file: dep); `package-lock.json` present | `npm install` in `.skilled/skills/sk-doc` | `package.json:10–12`; `sk-doc/package-lock.json` |
| `.opencode/skills/sk-doc/.pytest_cache/`; `scripts/.pytest_cache/`; `scripts/tests/.pytest_cache/`; `sk-create-with-human-voice/scripts/.pytest_cache/`; `sk-create-with-human-voice/scripts/tests/.pytest_cache/` | other (pytest cache) | pytest runs over the skill's Python tests (canonical invocation `python3 -m pytest`, `.github/workflows/naming-standard-guard.yml:50`) | `rm -rf`; recreated by the next pytest run | `naming-standard-guard.yml:28,50`; `sk-doc/scripts/tests/test_is_uppercase_section.py:76` |
| `.opencode/skills/sk-vision/hooks/opencode/sk-vision.js` | build output | `vision-runtime/scripts/build.ts:57–66` (Bun.build emits `sk-vision.js` next to `hooks/opencode/sk-vision.ts`) | `cd .skilled/skills/sk-vision/vision-runtime && bun run build` | `build.ts:57–66`; `vision-runtime/package.json:11` |
| `.opencode/skills/sk-vision/vision-runtime/dist/` | build output | `vision-runtime/scripts/build.ts:9,12–24` (rm + mkdir + three Bun builds), `:49–51` (python copy) | `bun run build` in `.skilled/skills/sk-vision/vision-runtime` | `build.ts:12–24,49–51`; `package.json:11` |
| `.opencode/skills/sk-vision/vision-runtime/node_modules/` | installed dependencies | `vision-runtime/package.json:16–24` (`@opencode-ai/plugin`/`sdk`, zod; `bun.lock` present, no package-lock) | `bun install` in `.skilled/skills/sk-vision/vision-runtime` | `package.json:16–23,45–47`; `vision-runtime/bun.lock` |
| `.opencode/skills/sk-vision/vision-runtime/python/__pycache__/` | other (Python bytecode cache) | Python interpreter spawned on `python/runtime.py` — `src/runtime/client.ts:300–302` | `rm -rf`; reappears on the next python run | `client.ts:300–302` |
| `.opencode/skills/system-deep-loop/deep-ai-council/node_modules/`; `deep-ai-council/scripts/node_modules/`; `deep-improvement/node_modules/`; `deep-improvement/scripts/node_modules/` | installed dependencies (stubs; both skills declare they ship none) | UNKNOWN — no tracked manifest/installer; suites resolve from the repo-root install per their vitest configs | `rm -rf` | `deep-improvement/scripts/vitest.config.mjs:7–8`; `deep-ai-council/vitest.config.mjs:7`; `Public-ignored.tsv:154–157` (`files=1`) |
| `.opencode/skills/system-deep-loop/node_modules/` | installed dependencies (skill root) | `system-deep-loop/package.json:10–12` (`@spec-kit/shared` file: dep); `package-lock.json` present | `npm install` in `.skilled/skills/system-deep-loop` | `package.json:10–12`; `system-deep-loop/package-lock.json` |
| `.opencode/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite` | runtime database | `runtime/lib/coverage-graph/coverage-graph-db.ts:149` (`DB_FILENAME`), `:150–155` (dir), `:318` (`initDb`); writers e.g. `scripts/upsert.cjs:288` | delete; "Created on first script invocation if absent" — next deep-loop script run recreates it | `coverage-graph-db.ts:149–155,318`; `runtime/database/README.md:27`; `runtime/changelog/v1.3.0.0.md:27` |
| `.opencode/skills/system-deep-loop/runtime/database/observability-events.jsonl` | runtime state (append log) | `runtime/lib/deep-loop/observability-events.cjs:164` (`appendObservabilityEvent`); callers `scripts/fanout-run.cjs:486`, `scripts/convergence.cjs:45`, `scripts/status.cjs:37` | delete; regenerated during deep-loop runs | `observability-events.cjs:164`; `fanout-run.cjs:486` |
| `.opencode/skills/system-deep-loop/runtime/node_modules/` | installed dependencies | `runtime/package.json:14–19`; `runtime/package-lock.json` present | `npm install` in `.skilled/skills/system-deep-loop/runtime` | `runtime/package.json:14–19` |
| `.opencode/skills/system-skill-advisor/runtime/database/.skill-advisor-owner.json` | runtime state (owner lease) | `.opencode/bin/system-skill-advisor-launcher.cjs:103,422–434,436–450` | delete; recreated on next launcher run | as cited; `Public-ignored.tsv:162` |
| `.opencode/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json` | runtime state (launcher PID lease) | `.opencode/bin/system-skill-advisor-launcher.cjs:102,104,330` | delete; recreated on next launcher run | as cited; `Public-ignored.tsv:163` |
| `…/runtime/database/skill-graph-daemon-lease.sqlite` (+ `-shm`, `-wal`) | runtime database (daemon lease) | `lib/daemon/lease.ts:54,99–101,123–134` | delete; recreated on next lease acquisition | as cited; `Public-ignored.tsv:164–166` |
| `…/runtime/database/skill-graph.sqlite` (+ `-shm`, `-wal`) | runtime database (skill graph) | `lib/skill-graph/skill-graph-db.ts:134–136`; path `advisor-server.ts:44–46`, `lib/scorer/projection.ts:59–61` | `bash .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh`; or delete + `advisor_rebuild --force` | `init-skill-graph.sh:19,64`; `freshness-contract.md:153`; `database/README.md:19` |
| `.opencode/skills/system-skill-advisor/runtime/dist/` | build output | `runtime/package.json:8–9` | `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` | `package.json:8–9`; `README.md:104–105` |
| `.opencode/skills/system-skill-advisor/runtime/node_modules/` | installed dependencies | `runtime/package.json:14–19`; `runtime/package-lock.json` present | `npm --prefix .skilled/skills/system-skill-advisor/runtime install` | `package.json:14–19`; `README.md:104` |
| `.opencode/skills/system-skill-advisor/runtime/tests/scorer/sweep-reports/` | other (regenerated diagnostics) | `runtime/tests/scorer/lane-weight-sweep.vitest.ts:45–65` (write paths under `sweep-reports/`) | `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/scorer/lane-weight-sweep.vitest.ts` | `lane-weight-sweep.vitest.ts:41–65`; `runtime/package.json:12` |
| `.opencode/skills/system-spec-kit/.node-version-marker` | runtime state (Node/ABI marker) | `runtime/cli/setup/record-node-version.js:20–21,31`; `postinstall` `package.json:26` | `node .skilled/skills/system-spec-kit/runtime/cli/setup/record-node-version.js` | `record-node-version.js:21`; `package.json:26`; `rebuild-native-modules.sh:49` |
| `.opencode/skills/system-spec-kit/runtime/.node-version-marker` | runtime state (legacy ABI marker) | UNKNOWN — the current writer resolves the skill root (`record-node-version.js:20–21`) and the checker reads that same root (`check-native-modules.sh:10–11`); no current line writes this path | delete; the canonical writer recreates only the skill-root marker | `record-node-version.js:20–21`; `check-native-modules.sh:11`; `Public-ignored.tsv:177` |
| `.opencode/skills/system-spec-kit/node_modules/`; `runtime/node_modules/`; `runtime/cli/node_modules/` | installed dependencies (one workspace install covers all three roots) | `system-spec-kit/package.json:6–10` (workspaces) | `cd .skilled/skills/system-spec-kit && npm ci` (bootstrap path; `npm install` per CONTRIBUTING) | `package.json:6–10`; `doctor-runtime-bootstrap.sh:178–187`; `CONTRIBUTING.md:38` |
| `.opencode/skills/system-spec-kit/runtime/cli/dist/` | build output | `runtime/cli/package.json:13` | `npm run build --workspace=@spec-kit/cli` from `.skilled/skills/system-spec-kit` | `cli/package.json:11–15`; `doctor-runtime-bootstrap.sh:187` |
| `.opencode/skills/system-spec-kit/runtime/dist/` | build output | `runtime/package.json:16` | `npm run build --workspace=@spec-kit/runtime` | `runtime/package.json:15–17`; `doctor-runtime-bootstrap.sh:186` |
| `.opencode/skills/system-spec-kit/shared/dist/` | build output | `shared/package.json:15` | `npm run build --workspace=@spec-kit/shared` | `shared/package.json:15`; `system-spec-kit/package.json:20` |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.d.ts.map`; `progressive-validation.vitest.js.map`; `tree-thinning.vitest.d.ts.map`; `tree-thinning.vitest.js.map` | build output (legacy TS emit) | the CLI `tsc --build` (`cli/package.json:13`) — but the current include set excludes `tests/**/*.vitest.ts` (`cli/tsconfig.json:38`), so a documented rebuild no longer emits these; they are stale | delete; not regenerated by `npm run rebuild` under the current config | `cli/tsconfig.json:20–38`; `cli/package.json:13–15`; `.gitignore:85–86` |
| `.opencode/skills/system-spec-kit/runtime/cli/vitest-tmp/`; `runtime/vitest-tmp/` | other (empty per-run temp dirs) | UNKNOWN — no tracked line names `vitest-tmp` beyond the ignore pattern; TSV records 0 files | `rm -rf` | `.gitignore:227`; `Public-ignored.tsv:185,189` (0 files) |
| `.opencode/skills/system-spec-kit/runtime/database/` | runtime state (engine telemetry dir / model-server state) | `shared/config.ts:32` (`DEFAULT_DB_DIR` = `runtime/database`), `:39–41` (`TELEMETRY_STORE_DIR`); store writer `runtime/lib/graph/access-telemetry.ts:32` (`access-telemetry.json`); also `bin/worktree-session.sh:225`, `shared/embeddings/providers/hf-local.ts:351` | delete; best-effort store is recreated on demand | `shared/config.ts:32,39–41`; `access-telemetry.ts:32`; `hf-local.ts:351` |
| `.opencode/skills/system-spec-kit/tsconfig.tsbuildinfo` | build output | root solution build `tsc --build` — `system-spec-kit/package.json:15` with `tsconfig.json:14` (`composite: true`), `:17–21` (references) | `npm run build` at `.skilled/skills/system-spec-kit` | `package.json:15`; `tsconfig.json:14,17–21` |

---

## Gaps (UNKNOWNs)

- **Producers never settled by a tracked line:** `.opencode/opencode-rag.log` (no tracked writer exists); all five `.gitignore` entries (`.opencode/.gitignore` content is documented at `sk-vision/changelog/v0.3.0.0.md:77`, but nothing tracked creates the file); `.opencode/skills/system-spec-kit/runtime/.node-version-marker` (current writer resolves the skill root only); `mcp-code-mode/mcp-server/package.json` and `mcp-tooling/.../clickup-mcp/package.json` (untracked manifests; the tracked installer *reads* the first — `install.sh:122` — but nothing *writes* it, so post-move `npm run build` has no manifest unless one is recreated); both `vitest-tmp/` dirs; and six stub `node_modules` roots (`.opencode/commands/doctor/scripts`, the three under `.opencode/hooks/dispatch`, `.opencode/plugins`, and the four under `system-deep-loop/deep-ai-council|deep-improvement` — each shows `files=1` in the TSV against 4,779 for a real install, so a stray single-file npm artifact is the best-supported reading, not an install the repo can reproduce).
- **Rotation/registry details I did not open** (git-ignored state, per the brief): the actual contents of the databases, logs, and stubs — all classifications rest on their writers/readers in tracked code.
- **Post-move path rewrites are not solved here**: several producers hardcode `.opencode` path segments (`init-skill-graph.sh:18`, `doctor-runtime-bootstrap.sh:151–155`, `bin/worktree-session.sh:225`, `render-command-contract.cjs:15,21–31`, `generation.ts:13`, `spec-gate-core.mjs:60`, launcher `:99–104`, `coverage-graph-db.ts:150–155`, `access-telemetry` chain). The commands above assume the migration updates those constants; until it does, running them from `.skilled/` will write into or resolve the old namespace.

## Implications

- Shape A: ignored state under `.opencode/` must move with the tree before the checkout lands, because git does not carry ignored files. The rename rehearsal showed a checkout over ignored build output succeeds and leaves no copy under `.skilled/` (`rename-rehearsal.md`). Everything but `hook-flags.env` and the history databases is rebuilt or recreated by its owner.
- Shape B: `.opencode/logs`, `.opencode/node_modules` and the install files stay real, so logs and opencode's dependencies stay where they are. State under the moved entries (`skills/.state`, the skill databases, `dist` trees) needs the same relocation or rebuild as shape A.
- Shape C: same as shape B, and the literal `.opencode/...` writers must be retargeted before their directories disappear.

## Verification

- **Brief:** `/tmp/skilled-probes-003/briefs/u10-ignored-state-classes.md`, the child preamble, the read-only persona and four literal lines naming both TSVs, the table columns and a rule never to open a listed entry.
- **Dispatch:** as in `council-graph-rebuild.md`, from worktree 055. Exit 0, 18:55:01Z to 19:07:26Z, 28,787 bytes. Stderr held only the skill-advisor hook's fail-open line.

| Returned citation | Status |
|-------------------|--------|
| `coverage-graph-db.ts:149-155` (`DB_FILENAME = 'deep-loop-graph.sqlite'`) | matched |
| `generation.ts:13` (`join('.opencode', 'skills', '.state', 'advisor', 'skill-graph-generation.json')`) | matched |
| `system-skill-advisor-launcher.cjs:102-104` (both lease file names) | matched |
| `init-skill-graph.sh:64` (`skill_graph_scan --trusted --warm-only`) | matched |
| `system-dist-freshness-guard.js:35`, `codex-hooks-watchdog.js:23`, `dispatch-audit.mjs:574` | matched |
| `spec-gate-core.mjs:60-63` | matched |
| `hook-flags.cjs:88` (`HOOK_FLAGS_CONFIG` or `../hook-flags.env`) | matched |

## Briefs and citation checks

Each brief is reproduced verbatim. The citation check resolves every `path:line` a lane returned to a file, using the lane's own abbreviations (`$PI/`, `BUNDLE/`, `CURSORSKILLS/` = `~/.cursor/skills-cursor/`, `help:`, `str:`, `dump:`, `cap/`), and confirms the cited lines exist. A bare basename that matches several tracked files counts as matched only when every candidate holds the line. "Matched" means the line exists. Content was opened only for the citations the verification tables above name. "Struck" means the file did not resolve or the line runs past the end of the file.

### u10-ignored-state-classes

**Brief:**

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is empty. This is a read-only task: your final message is the whole deliverable.

PERSONA (this repository's read-only `context` agent, condensed): you retrieve and verify, nothing else. You never write, edit, create, delete, stage or commit a file, and you never hand work to another agent. Every claim you make comes from a file you opened with your read, grep, find or ls tools, cites `path:line`, and anything you could not settle goes under a final "Gaps" heading as UNKNOWN.

Question: for each ignored entry under `.opencode/` listed in the two tables below, what kind of state is it, which tracked file produces it, and which command rebuilds or resets it after the tree moves to `.skilled/`? Work from the entry paths and tracked source files only; never open an entry that the tables list (they are git-ignored state).
Read these files: /tmp/skilled-probes-003/logs/055-skilled-source-root-migration-ignored.tsv (worktree 055); /tmp/skilled-probes-003/logs/Public-ignored.tsv (main checkout); then the tracked build and runtime source that produces each entry (package.json scripts, build scripts, database writers).
Answer with one markdown table per checkout whose columns are: Entry | Kind (build output, installed dependencies, runtime database, runtime state, other) | Producer (path:line) | Rebuild or reset command | Evidence (path:line). Group node_modules entries on one row per package root.
Cite path:line for every cell and write UNKNOWN when no line settles it.
```

**Dispatch:** `PI_CODING_AGENT_DIR=/tmp/skilled-probes-003/pi-agent AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 pi -p --offline --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max --tools read,grep,find,ls --no-session "<brief>" </dev/null`, run from worktree 055. (U8 to U10 ran before the developer-role rejection began, without `PI_CODING_AGENT_DIR`.)

**Citation check:** 201 matched, 12 struck.

| Citation | Status | Resolved to |
|----------|--------|-------------|
| `-ignored.tsv:2-19` | struck | file not resolved |
| `.opencode/package.json:3-10` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/package.json (17 lines) |
| `system-skill-advisor/runtime/lib/freshness/generation.ts:13` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/freshness/generation.ts (213 lines) |
| `generation.ts:13,52` | matched | ambiguous: 2 files, line in range in 2 |
| `handlers/advisor-rebuild.ts:90` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts (145 lines) |
| `references/runtime/freshness-contract.md:153` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/references/runtime/freshness-contract.md (168 lines) |
| `system-deep-loop/runtime/package.json:14-19` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/package.json (26 lines) |
| `runtime/package.json:14-19` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/package.json (26 lines) |
| `.opencode/bin/system-skill-advisor-launcher.cjs:103` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/system-skill-advisor-launcher.cjs (1560 lines) |
| `launcher.cjs:103,422,436` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/system-skill-advisor-launcher.cjs (1560 lines) |
| `shared/embeddings/providers/hf-local.ts:49,270-271` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts (1160 lines) |
| `.opencode/bin/system-skill-advisor-launcher.cjs:102` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/system-skill-advisor-launcher.cjs (1560 lines) |
| `launcher.cjs:102-104,330` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/system-skill-advisor-launcher.cjs (1560 lines) |
| `system-skill-advisor/runtime/lib/daemon/lease.ts:54` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/daemon/lease.ts (396 lines) |
| `lease.ts:54,99-101,143,153` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/daemon/lease.ts (396 lines) |
| `system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:134-136` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts (1587 lines) |
| `advisor-server.ts:44-46` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/advisor-server.ts (394 lines) |
| `lib/scorer/projection.ts:59-61` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/scorer/projection.ts (1246 lines) |
| `skill-graph-db.ts:136` | struck | ambiguous: 3 files, line in range in 1 |
| `init-skill-graph.sh:19,47,64` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh (82 lines) |
| `database/README.md:19` | struck | ambiguous: 5 files, line in range in 3 |
| `system-skill-advisor/runtime/package.json:8` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/package.json (36 lines) |
| `package.json:8-9` | matched | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `README.md:104-105` | matched | ~/worktrees/public/055-skilled-source-root-migration/README.md (1052 lines) |
| `system-skill-advisor/runtime/package.json:14-19` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/package.json (36 lines) |
| `package.json:14-19` | struck | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `README.md:104` | matched | ~/worktrees/public/055-skilled-source-root-migration/README.md (1052 lines) |
| `system-spec-kit/runtime/cli/setup/record-node-version.js:20-21,31` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/record-node-version.js (33 lines) |
| `package.json:26` | struck | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `record-node-version.js:21,31` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/record-node-version.js (33 lines) |
| `rebuild-native-modules.sh:46-50` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/rebuild-native-modules.sh (58 lines) |
| `system-spec-kit/package.json:6-10` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/package.json (54 lines) |
| `package.json:6-10` | matched | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `CONTRIBUTING.md:36-38` | matched | ~/worktrees/public/055-skilled-source-root-migration/CONTRIBUTING.md (188 lines) |
| `commands/doctor/scripts/doctor-runtime-bootstrap.sh:177-181` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh (212 lines) |
| `system-spec-kit/runtime/cli/package.json:13` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/package.json (35 lines) |
| `cli/package.json:11-15` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/package.json (35 lines) |
| `doctor-runtime-bootstrap.sh:187` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh (212 lines) |
| `system-spec-kit/runtime/package.json:16` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/package.json (54 lines) |
| `runtime/package.json:15-17` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/package.json (26 lines) |
| `doctor-runtime-bootstrap.sh:186` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh (212 lines) |
| `system-spec-kit/shared/package.json:15` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/shared/package.json (26 lines) |
| `package.json:20` | struck | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `package.json:8` | matched | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `shared/package.json:15` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/shared/package.json (26 lines) |
| `system-spec-kit/package.json:20` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/package.json (54 lines) |
| `Public-ignored.tsv:8-191` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `.gitignore:16` | matched | ~/worktrees/public/055-skilled-source-root-migration/.gitignore (309 lines) |
| `~/.gitignore_global:24` | matched | ~/.gitignore_global (32 lines) |
| `Public-ignored.tsv:8,11,12,30,133,173` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `skills/sk-vision/changelog/v0.3.0.0.md:77` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/changelog/v0.3.0.0.md (81 lines) |
| `Public-ignored.tsv:9,148,150,174,178` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `bin/compiled-routing-foundation.vitest.ts:263-265` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/compiled-routing-foundation.vitest.ts (288 lines) |
| `bin/tests/compiled-route-manifest.test.cjs:22` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/tests/compiled-route-manifest.test.cjs (1673 lines) |
| `bin/README.md:220` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/README.md (233 lines) |
| `compiled-routing-foundation.vitest.ts:263-265,273` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/compiled-routing-foundation.vitest.ts (288 lines) |
| `system-deep-loop/runtime/scripts/render-command-contract.cjs:15` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs (261 lines) |
| `render-command-contract.cjs:15,126-129` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs (261 lines) |
| `commands/deep/assets/compiled/README.md:47` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/deep/assets/compiled/README.md (125 lines) |
| `system-deep-loop/changelog/v2.0.0.0.md:19` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/changelog/v2.0.0.0.md (41 lines) |
| `Public-ignored.tsv:14` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `commands/doctor/scripts/parent-skill-check.cjs:38-40` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/scripts/parent-skill-check.cjs (1551 lines) |
| `Public-ignored.tsv:15-17` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `hooks/dispatch/lib/dispatch-audit.mjs:12-13` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/dispatch/lib/dispatch-audit.mjs (648 lines) |
| `hooks/hook-flags.env.example:1-6` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/hook-flags.env.example (37 lines) |
| `hooks/shared/hook-flags.cjs:88` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/shared/hook-flags.cjs (193 lines) |
| `hooks/README.md:74` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/README.md (260 lines) |
| `hook-flags.env.example:3` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/hook-flags.env.example (37 lines) |
| `hook-flags.cjs:88` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/shared/hook-flags.cjs (193 lines) |
| `scripts/git-hooks/lib/autostash-orphan-guard.sh:38` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh (72 lines) |
| `autostash-orphan-guard.sh:38` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh (72 lines) |
| `logs/README.md:30` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/logs/README.md (62 lines) |
| `hooks/dispatch/lib/dispatch-audit.mjs:574` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/dispatch/lib/dispatch-audit.mjs (648 lines) |
| `plugins/cli-dispatch-audit.js:59` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/cli-dispatch-audit.js (132 lines) |
| `dispatch-audit.mjs:574,576` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/dispatch/lib/dispatch-audit.mjs (648 lines) |
| `cli-dispatch-audit.js:59` | matched | ambiguous: 2 files, line in range in 2 |
| `plugins/codex-hooks-watchdog.js:23` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/codex-hooks-watchdog.js (93 lines) |
| `codex-hooks-watchdog.js:23` | matched | ambiguous: 2 files, line in range in 2 |
| `system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:78` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs (572 lines) |
| `plugins/system-completion-sentinel.js:155` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/system-completion-sentinel.js (174 lines) |
| `completion-evidence-sentinel.cjs:78,315-317` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs (572 lines) |
| `system-completion-sentinel.js:155` | matched | ambiguous: 2 files, line in range in 2 |
| `plugins/system-dist-freshness-guard.js:35` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/system-dist-freshness-guard.js (236 lines) |
| `system-dist-freshness-guard.js:35,98-100` | matched | ambiguous: 2 files, line in range in 2 |
| `plugins/sk-code-post-edit-quality.js:33` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/sk-code-post-edit-quality.js (204 lines) |
| `sk-code-post-edit-quality.js:33` | matched | ambiguous: 2 files, line in range in 2 |
| `Public-ignored.tsv:27` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `Public-ignored.tsv:28` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `Public-ignored.tsv:29` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `plugins/system-speckit-completion.js:28` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/system-speckit-completion.js (90 lines) |
| `.opencode/package.json:4` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/package.json (17 lines) |
| `system-skill-advisor/runtime/lib/daemon/lease.ts:55-61` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/daemon/lease.ts (396 lines) |
| `lib/daemon/watcher.ts:294-296` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts (696 lines) |
| `lease.ts:55-61,107-109` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/daemon/lease.ts (396 lines) |
| `watcher.ts:294-296` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts (696 lines) |
| `.opencode/skills/.state/advisor/README.md:25,117` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/.state/advisor/README.md (194 lines) |
| `lib/freshness/generation.ts:13` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/freshness/generation.ts (213 lines) |
| `generation.ts:13,50-56` | matched | ambiguous: 2 files, line in range in 2 |
| `advisor-rebuild.ts:90` | struck | ambiguous: 2 files, line in range in 1 |
| `completion-evidence-sentinel.cjs:77` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs (572 lines) |
| `plugins/system-completion-sentinel.js:133,155` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/system-completion-sentinel.js (174 lines) |
| `completion-evidence-sentinel.cjs:77-79,268-278` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs (572 lines) |
| `plugins/opencode-goal.js:36-37` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/opencode-goal.js (3385 lines) |
| `hooks/goal/lib/goal-core.cjs:45-47` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/goal/lib/goal-core.cjs (1636 lines) |
| `opencode-goal.js:36-37,1143,1158` | matched | ambiguous: 2 files, line in range in 2 |
| `goal-core.cjs:45-47` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/goal/lib/goal-core.cjs (1636 lines) |
| `skills/.state/goal/README.md:33-35` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/.state/goal/README.md (124 lines) |
| `hooks/task-dispatch/lib/dispatch-guard.cjs:42` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs (625 lines) |
| `dispatch-guard.cjs:42-44,418-427` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs (625 lines) |
| `plugins/system-deep-loop-guard.js:59` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/system-deep-loop-guard.js (100 lines) |
| `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:60` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs (1551 lines) |
| `plugins/system-spec-gate.js:167,190` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/plugins/system-spec-gate.js (296 lines) |
| `spec-gate-core.mjs:60-61,580-581,613,841-863` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs (1551 lines) |
| `system-spec-gate.js:167` | matched | ambiguous: 3 files, line in range in 3 |
| `Public-ignored.tsv:45-130` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `spec-gate-core.mjs:62` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs (1551 lines) |
| `spec-gate-core.mjs:62-63,674-676,745` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs (1551 lines) |
| `scripts/install.sh:385-393` | matched | ~/.hermes/hermes-agent/scripts/install.sh (3890 lines) |
| `doctor-mcp-install.yaml:108-111` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-mcp-install.yaml (319 lines) |
| `install.sh:385-393` | struck | ambiguous: 9 files, line in range in 2 |
| `doctor-mcp-install.yaml:107,111` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-mcp-install.yaml (319 lines) |
| `doctor-mcp-install.yaml:110-111` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-mcp-install.yaml (319 lines) |
| `doctor-mcp-install.yaml:106,110-111` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-mcp-install.yaml (319 lines) |
| `doctor-mcp-debug.yaml:106-110` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/assets/doctor-mcp-debug.yaml (266 lines) |
| `mcp-doctor.sh:249` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/scripts/mcp-doctor.sh (320 lines) |
| `install.sh:122` | struck | ambiguous: 9 files, line in range in 6 |
| `install.sh:122,124-127` | struck | ambiguous: 9 files, line in range in 6 |
| `Public-ignored.tsv:136` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `mcp-click-up/mcp-servers/clickup-mcp/README.md:33` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md (80 lines) |
| `Public-ignored.tsv:137` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `cli-communication-projection/package.json:63-65` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-communication/cli-communication-projection/package.json (77 lines) |
| `package.json:63-65,72-76` | struck | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `backend/package.json:14` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-design/sk-design-md-generator/backend/package.json (38 lines) |
| `backend/package.json:13-14,22-27` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-design/sk-design-md-generator/backend/package.json (38 lines) |
| `sk-doc/package.json:10-12` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-doc/package.json (13 lines) |
| `package.json:10-12` | matched | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `.github/workflows/naming-standard-guard.yml:50` | matched | ~/worktrees/public/055-skilled-source-root-migration/.github/workflows/naming-standard-guard.yml (52 lines) |
| `naming-standard-guard.yml:28,50` | matched | ~/worktrees/public/055-skilled-source-root-migration/.github/workflows/naming-standard-guard.yml (52 lines) |
| `sk-doc/scripts/tests/test_is_uppercase_section.py:76` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-doc/scripts/tests/test_is_uppercase_section.py (81 lines) |
| `vision-runtime/scripts/build.ts:57-66` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/scripts/build.ts (68 lines) |
| `build.ts:57-66` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/scripts/build.ts (68 lines) |
| `vision-runtime/package.json:11` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/package.json (48 lines) |
| `vision-runtime/scripts/build.ts:9,12-24` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/scripts/build.ts (68 lines) |
| `build.ts:12-24,49-51` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/scripts/build.ts (68 lines) |
| `package.json:11` | matched | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `vision-runtime/package.json:16-24` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/package.json (48 lines) |
| `package.json:16-23,45-47` | struck | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `src/runtime/client.ts:300-302` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/src/runtime/client.ts (471 lines) |
| `client.ts:300-302` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/vision-runtime/src/runtime/client.ts (471 lines) |
| `deep-improvement/scripts/vitest.config.mjs:7-8` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-improvement/scripts/vitest.config.mjs (15 lines) |
| `deep-ai-council/vitest.config.mjs:7` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/deep-ai-council/vitest.config.mjs (17 lines) |
| `Public-ignored.tsv:154-157` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `system-deep-loop/package.json:10-12` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/package.json (13 lines) |
| `runtime/lib/coverage-graph/coverage-graph-db.ts:149` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts (975 lines) |
| `scripts/upsert.cjs:288` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs (323 lines) |
| `coverage-graph-db.ts:149-155,318` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts (975 lines) |
| `runtime/database/README.md:27` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/database/README.md (37 lines) |
| `runtime/changelog/v1.3.0.0.md:27` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/changelog/v1.3.0.0.md (66 lines) |
| `runtime/lib/deep-loop/observability-events.cjs:164` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs (188 lines) |
| `scripts/fanout-run.cjs:486` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs (3894 lines) |
| `scripts/convergence.cjs:45` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs (911 lines) |
| `scripts/status.cjs:37` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/status.cjs (211 lines) |
| `observability-events.cjs:164` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs (188 lines) |
| `fanout-run.cjs:486` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs (3894 lines) |
| `.opencode/bin/system-skill-advisor-launcher.cjs:103,422-434,436-450` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/system-skill-advisor-launcher.cjs (1560 lines) |
| `Public-ignored.tsv:162` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `.opencode/bin/system-skill-advisor-launcher.cjs:102,104,330` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/system-skill-advisor-launcher.cjs (1560 lines) |
| `Public-ignored.tsv:163` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `lib/daemon/lease.ts:54,99-101,123-134` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/daemon/lease.ts (396 lines) |
| `Public-ignored.tsv:164-166` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `lib/skill-graph/skill-graph-db.ts:134-136` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts (1587 lines) |
| `init-skill-graph.sh:19,64` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh (82 lines) |
| `freshness-contract.md:153` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/references/runtime/freshness-contract.md (168 lines) |
| `runtime/package.json:8-9` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/package.json (26 lines) |
| `runtime/tests/scorer/lane-weight-sweep.vitest.ts:45-65` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts (667 lines) |
| `lane-weight-sweep.vitest.ts:41-65` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts (667 lines) |
| `runtime/package.json:12` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/package.json (26 lines) |
| `runtime/cli/setup/record-node-version.js:20-21,31` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/record-node-version.js (33 lines) |
| `record-node-version.js:21` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/record-node-version.js (33 lines) |
| `rebuild-native-modules.sh:49` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/rebuild-native-modules.sh (58 lines) |
| `record-node-version.js:20-21` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/record-node-version.js (33 lines) |
| `check-native-modules.sh:10-11` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh (74 lines) |
| `check-native-modules.sh:11` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh (74 lines) |
| `Public-ignored.tsv:177` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `doctor-runtime-bootstrap.sh:178-187` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh (212 lines) |
| `CONTRIBUTING.md:38` | matched | ~/worktrees/public/055-skilled-source-root-migration/CONTRIBUTING.md (188 lines) |
| `runtime/cli/package.json:13` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/package.json (35 lines) |
| `runtime/package.json:16` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/package.json (26 lines) |
| `cli/package.json:13` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/package.json (35 lines) |
| `cli/tsconfig.json:38` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json (39 lines) |
| `cli/tsconfig.json:20-38` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json (39 lines) |
| `cli/package.json:13-15` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/package.json (35 lines) |
| `.gitignore:85-86` | matched | ~/worktrees/public/055-skilled-source-root-migration/.gitignore (309 lines) |
| `.gitignore:227` | matched | ~/worktrees/public/055-skilled-source-root-migration/.gitignore (309 lines) |
| `Public-ignored.tsv:185,189` | matched | /tmp/skilled-probes-003/logs/Public-ignored.tsv (350 lines) |
| `shared/config.ts:32` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/shared/config.ts (47 lines) |
| `runtime/lib/graph/access-telemetry.ts:32` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/lib/graph/access-telemetry.ts (156 lines) |
| `bin/worktree-session.sh:225` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/bin/worktree-session.sh (455 lines) |
| `shared/embeddings/providers/hf-local.ts:351` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts (1160 lines) |
| `shared/config.ts:32,39-41` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/shared/config.ts (47 lines) |
| `access-telemetry.ts:32` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/lib/graph/access-telemetry.ts (156 lines) |
| `hf-local.ts:351` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts (1160 lines) |
| `system-spec-kit/package.json:15` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/package.json (54 lines) |
| `tsconfig.json:14` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json (39 lines) |
| `package.json:15` | matched | ~/worktrees/public/055-skilled-source-root-migration/package.json (16 lines) |
| `tsconfig.json:14,17-21` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json (39 lines) |
| `sk-vision/changelog/v0.3.0.0.md:77` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/sk-vision/changelog/v0.3.0.0.md (81 lines) |
| `init-skill-graph.sh:18` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh (82 lines) |
| `doctor-runtime-bootstrap.sh:151-155` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh (212 lines) |
| `render-command-contract.cjs:15,21-31` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs (261 lines) |
| `generation.ts:13` | matched | ambiguous: 2 files, line in range in 2 |
| `spec-gate-core.mjs:60` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs (1551 lines) |
| `coverage-graph-db.ts:150-155` | matched | ~/worktrees/public/055-skilled-source-root-migration/.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts (975 lines) |

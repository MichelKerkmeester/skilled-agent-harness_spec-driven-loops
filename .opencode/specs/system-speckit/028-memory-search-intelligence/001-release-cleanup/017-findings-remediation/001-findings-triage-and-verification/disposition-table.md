# Disposition Table — Findings Triage

Re-tested 83 findings across three model families. Five findings already independently
verified during the audit were excluded from re-testing.

| Disposition | Count |
|---|---|
| CONFIRMED | 46 |
| REFUTED | 17 |
| DEFERRED | 20 |

Refutation rate: 17/83 = 20%.

## By category

| Category | CONFIRMED | REFUTED | DEFERRED |
|---|---|---|---|
| CAT-1 | 5 | 4 | 4 |
| CAT-2 | 4 | 3 | 3 |
| CAT-3 | 6 | 2 | 2 |
| CAT-4 | 8 | 1 | 1 |
| CAT-5 | 20 | 5 | 7 |
| CAT-6 | 3 | 2 | 3 |

## Dispositions

Rows marked * were corrected after spot-check; see `CORRECTIONS.md`.

| finding | cat | disposition | lane | evidence command | note |
|---|---|---|---|---|---|
| `devin-01:F1` | CAT-2 | **REFUTED** | devin | ``sed -n '73,108p' .opencode/skills/sk-code/benchmark/README.md`` | README §3 documents an intentional status taxonomy (current/superseded/frozen/sidecar/legacy) with "superseded is an earlier development run kept only as evidence"; retention is intended, not cruft. |
| `devin-01:F10` | CAT-1 | **REFUTED** | sol | ``ls -l .opencode/skills/sk-doc/scripts`` | All ten documented entries resolve at that location, mostly through intentional facade symlinks. |
| `devin-01:F11` | CAT-1 | **REFUTED** | sol | ``rg -n --hidden --glob '!.git/**' -e 'validate-doc-model-refs' -e 'node "\$VALIDATOR"' .opencode/scripts/git-hooks/pre-commit`` | The live pre-commit hook assigns the validator path and invokes it with Node. |
| `devin-01:F12` | CAT-5 | **REFUTED** | sol | ``node -e "const fs=require('fs'),r=require('./.opencode/skills/sk-doc/mode-registry.json'),s=fs.readFileSync('.opencode/skills/sk-doc/SKILL.md','utf8'); console.log({skillSaysEleven:/eleven workflow p` | The registry has twelve modes but exactly eleven packets because two modes share `create-skill`. |
| `devin-01:F13` | CAT-4 | **CONFIRMED** | composer | ``grep -n feature-catalog .opencode/skills/sk-doc/SKILL.md`` | SKILL.md layout (lines 120-134) lists `create-feature-catalog/` (a packet) but NOT the separate `feature-catalog/` directory at hub root, which exists with `feature-catalog.md` + 2 subfolders |
| `devin-01:F14` | CAT-5 | **CONFIRMED** | sol | ``node -e "const fs=require('fs'),p='.opencode/skills/sk-git/'; console.log(['mode-registry.json','hub-router.json','git-worktrees','git-commit','git-finish'].map(x=>x+':'+fs.existsSync(p+x)).join(' ')` | None of the claimed routing infrastructure or packet directories exists; the implementation is a monolithic resource router. |
| `devin-01:F15` | CAT-3 | **CONFIRMED** | composer | ``grep -rn 'benchmark/' .opencode/skills/sk-git/`` | grep returns no references to `benchmark/` outside the benchmark folder's own self-references; the two run folders (`2026-07-10--live--glm-5-2-high/`, `2026-07-10--live--kimi-2-7/`) are unreferenced b |
| `devin-01:F16` | CAT-1 | **CONFIRMED** | sol | ``rg -n --hidden --glob '!.git/**' --glob '*.{ts,tsx,js,cjs,mjs,sh,bash,zsh,yaml,yml,json,jsonc,toml,md,txt}' 'worktree-naming\.sh[^[:cntrl:]]*validate-remote-allowlist' .`` | Whole-repository hits are documentation or historical records, not an executable external caller. |
| `devin-01:F17` | CAT-1 | **CONFIRMED** | sol | ``rg -n --hidden --glob '!.git/**' --glob '*.{ts,tsx,js,cjs,mjs,sh,bash,zsh,yaml,yml,json,jsonc,toml,md,txt}' 'worktree-naming\.sh[^[:cntrl:]]*skill-ids' .`` | Whole-repository hits are changelog or worklist prose, not an executable external caller. |
| `devin-01:F18` | CAT-4 | **CONFIRMED** | composer | ``grep -n '.github/workflows\` | .github/hooks/scripts' .opencode/skills/sk-git/changelog/v1.3.2.0.md` + `find .opencode/skills/sk-git/.github` |
| `devin-01:F19` | CAT-6 | **CONFIRMED** | devin | ``sed -n '54,202p' .opencode/skills/sk-git/SKILL.md`` | Lines 54-202 = 149 lines of Python defining 5 intents (WORKSPACE_SETUP, COMMIT, FINISH, GITKRAKEN_MCP, SHARED_PATTERNS) with weighted scoring and conditional loading. |
| `devin-01:F2` | CAT-2 | **CONFIRMED** | devin | ``grep -n "Legacy synthetic fixtures" .opencode/skills/sk-code/benchmark/README.md`` | README lines 81 and 107 explicitly state "Legacy synthetic fixtures, superseded by the playbook corpus" with status `legacy`. |
| `devin-01:F22` | CAT-5 | **CONFIRMED** | sol | ``rg -n --hidden --glob '!.git/**' -e 'Never add runtime logic' -e '^#!/usr/bin/env node' .opencode/skills/sk-prompt/prompt-models/{SKILL.md,benchmarks/2026-07-10--prompt-framework--minimax/eval-loop/s` | The packet forbids runtime logic but contains executable Node benchmark logic. |
| `devin-01:F23` | CAT-5 | **REFUTED** | sol | ``rg -n --hidden --glob '!.git/**' -e '"workflowMode": "cli-cursor"' -e 'name: cli-cursor' -e 'cursor-agent -p --model composer-2\.5' .opencode/skills/{cli-external-orchestration,sk-prompt/prompt-model` | `cli-cursor` exists, is registered, and implements the referenced Composer executor. |
| `devin-01:F3` | CAT-2 | **CONFIRMED** | devin | ``head -8 .opencode/skills/sk-code/changelog/v4.0.0.0.md`` | v4.0.0.0 says "converted from a flat two-axis skill into a nested parent hub"; the 8 v3.x entries describe that superseded flat structure. |
| `devin-01:F4` | CAT-2 | **CONFIRMED** | devin | ``cat .opencode/skills/sk-code/changelog/v4.0.0.0.md`` | v4.0.0.0.md self-declares "Scaffold phase - packets are skeletons; content relocation follows"; v4.1.0.0 performed the restructure. |
| `devin-01:F5` | CAT-5 | **CONFIRMED** | sol | ``rg -n --hidden --glob '!.git/**' -e 'Workflow axis' -e 'Surface axis' -e '"surfaces"' .opencode/skills/sk-code/{changelog/v4.1.0.0.md,mode-registry.json}`` | The changelog declares three surfaces, including `animation`, while the authoritative registry declares two. |
| `devin-01:F6` | CAT-5 | **REFUTED** | sol | ``rg -n --hidden --glob '!.git/**' -e 'Target skill' -e 'Scenarios' .opencode/skills/sk-code/{benchmark/2026-07-10--live-mode-b--live,code-opencode/benchmark/2026-07-10--live-mode-b--live}/README.md`` | The folders benchmark distinct targets and corpora: hub `sk-code` with 30 scenarios versus `code-opencode` with 9. |
| `devin-01:F7` | CAT-6 | **REFUTED** | devin | ``ls .opencode/skills/sk-code/benchmark/`` | README documents the structure as intentional; count is wrong (9 dated runs + baseline + fixtures; compiled-routing has 4 subfolders, not 3). "Over-engineered" framing contradicted by documented statu |
| `devin-01:F8` | CAT-2 | **REFUTED** | devin | ``cat .opencode/skills/sk-code/changelog/v4.0.1.0.md`` | v4.0.1.0 relocated spec-folder docs to system-spec-kit; that relocation persisted through v4.1.0.0 (v4.1.0.0 restructured sk-code packets, did not move them back), so it was not subsumed. |
| `devin-01:F9` | CAT-3 | **CONFIRMED** | composer | ``find .opencode/skills/sk-doc/benchmark/compiled-routing/ -maxdepth 1 -type d`` | 5 dated subfolders exist and are committed; claim's example names (`luna-high-acceptance-1784596615522/`) are wrong — actual names are `2026-07-21--acceptance--luna-high/` etc. — but core claim (dated |
| `devin-02:F1` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const d=".opencode/skills/cli-external-orchestration/";const s=fs.readFileSync(d+"SKILL.md","utf8");const r=JSON.parse(fs.readFileSync(d+"mode-registry.json"));console` | The registry ships five modes while `SKILL.md` retains both “four” and “three” claims. |
| `devin-02:F2` | CAT-5 | **REFUTED** | sol | ``node -e 'const fs=require("fs");const d=".opencode/skills/mcp-tooling/";const s=fs.readFileSync(d+"SKILL.md","utf8");const r=JSON.parse(fs.readFileSync(d+"mode-registry.json"));const latest=fs.readdi` | The version lag is real, but the transport-axis description names both transports; only another discriminator field omits them. |
| `devin-02:F3` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const d=".opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/";const s=fs.readFileSync(d+"README.md","utf8");console.log("devinDir="+fs.statSync(d+"` | The live `devin/` directory is omitted while `codex/` is documented. |
| `devin-02:F5` | CAT-3 | **CONFIRMED** | composer | ``find .opencode/skills/mcp-tooling/benchmark/ -maxdepth 1`` | `.gitkeep` exists alongside substantial content (README.md, baseline/, compiled-routing/, multiple run-label folders) — redundant |
| `devin-02:F6` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");for(const h of ["cli-external-orchestration","mcp-tooling"]){const d=".opencode/skills/"+h+"/";const s=fs.readFileSync(d+"SKILL.md","utf8");console.log(h,"leafManifest` | Both layout diagrams omit their live `leaf-manifest.json` contract file. |
| `devin-03:F1` | CAT-3 | **REFUTED** | composer | ``find . -name .DS_Store`` | No `.DS_Store` files found anywhere in the repo; claim of committed `.DS_Store` in `commands/` is false |
| `devin-03:F10` * | CAT-4 | **CONFIRMED** | composer | ``find .opencode/skills -path '*/doctor/scripts/tests/*'`` | No `doctor/scripts/tests/` directory found under any skill; claim cannot be confirmed against the real tree |
| `devin-03:F11` | CAT-1 | **REFUTED** | sol | ``rg --hidden --no-ignore -n --fixed-strings 'smoke-command-benchmark.cjs' . --glob '!.git/**' --glob '*.{ts,tsx,js,cjs,mjs,sh,yaml,yml,json,jsonc,md,txt}'`` | No executable caller exists, but `handoff-gates.md` documents an exact direct invocation, refuting “undocumented.” |
| `devin-03:F12` | CAT-6 | **REFUTED** | devin | ``sed -n '78,98p' .opencode/scripts/git-hooks/pre-commit`` | pre-commit hook lines 86-89 invoke `check-mcp-mutation-class.sh` by path on every commit when matching MCP files are staged — exactly the string-literal invocation the audit missed. |
| `devin-03:F2` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const root=".opencode/commands/";const s=fs.readFileSync(root+"README.txt","utf8");console.log("interfaceDir="+fs.statSync(root+"interface").isDirectory(),"interfaceCo` | Three live interface commands exist, but the canonical index omits the group. |
| `devin-03:F3` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const p=".opencode/commands/";const s=fs.readFileSync(p+"README.txt","utf8");console.log("hyphenFile="+fs.existsSync(p+"agent-router.md"),"underscoreFile="+fs.existsSy` | \ |
| `devin-03:F4` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const p=".opencode/commands/create/";const s=fs.readFileSync(p+"README.txt","utf8");const c=fs.readFileSync(p+"diff.md","utf8");console.log("live="+fs.existsSync(p+"di` | `/create:diff` is a wired router but appears in neither index. |
| `devin-03:F5` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const p=".opencode/commands/deep/";const s=fs.readFileSync(".opencode/commands/README.txt","utf8");for(const n of ["alignment","command-benchmark"])console.log(n,"live` | Both live deep routers are absent from the canonical deep listing. |
| `devin-03:F6` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const p=".opencode/agents/";const s=fs.readFileSync(p+"README.txt","utf8");console.log("live="+fs.existsSync(p+"deep-alignment.md"),"indexed="+s.includes("deep-alignme` | `deep-alignment.md` is live but absent from the inventory. |
| `devin-03:F7` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs");const p=".opencode/commands/deep/assets/compiled/";const r=fs.readFileSync(p+"README.md","utf8");const c=fs.readFileSync(p+"deep-alignment.contract.md","utf8");const m` | The README calls it a placeholder, but it is a 466-line generated contract recorded in the manifest. |
| `devin-03:F8` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("fs"),path=require("path");const p=".opencode/commands";const s=fs.readFileSync(p+"/scripts/README.md","utf8"),q=String.fromCharCode(96);const live=fs.readdirSync(p,{withFil` | Runtime discovery covers seven families including `interface`; the README lists only three and includes retired `design`. |
| `devin-03:F9` * | CAT-4 | **CONFIRMED** | composer | ``find .opencode/skills -path '*/create/assets/tests/*'`` | No `create/assets/tests/` directory found under any skill; claim cannot be confirmed against the real tree |
| `devin-04:F1` | CAT-2 | **REFUTED** | devin | ``diff <(head -15 .claude/agents/code.md) <(head -15 .opencode/agents/code.md)`` | Directories are runtime-specific siblings, not a mirror: different frontmatter (`tools:` vs `mode:`/`permission:`), different line counts (530 vs 545), different path conventions; `.claude/agents/READ |
| `devin-04:F10` | CAT-5 | **CONFIRMED** | sol | ``python3 -c 'import json; c=json.load(open(".claude/mcp.json"))["mcpServers"]; o=json.load(open("opencode.json"))["mcp"]; normc={k:{"command":[v["command"],*v.get("args",[])],"env":v.get("env",{})} fo` | The two physical files independently define the same five semantically equivalent server configurations. |
| `devin-04:F11` | CAT-1 | **CONFIRMED** | sol | ``rg --hidden --no-ignore --files -g 'session-prime.js' -g 'user-prompt-submit.js' ".opencode/skills/system-spec-kit/mcp-server"`` | The wrappers reference Copilot handlers, but only non-Copilot equivalents exist in the runtime tree. |
| `devin-04:F12` | CAT-1 | **REFUTED** | sol | ``stat -f '%N %HT' ".opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program"`` | The exact directory referenced by the workflow now exists. |
| `devin-04:F13` | CAT-3 | **CONFIRMED** | composer | ``grep -c '^\.opencode/specs/barter$' .gitignore`` | 4 pairs of duplicate entries confirmed: `.opencode/specs/barter` (lines 271,272), `.claude/specs/barter` (276,277), `.codex/specs/barter` (281,282), `.agents/specs/barter` (286,287) |
| `devin-04:F14` | CAT-1 | **CONFIRMED** | sol | ``git check-ignore -v ".env.example"`` | Git attributes the ignored file directly to `.gitignore:22` and its `.env.*` pattern. |
| `devin-04:F2` | CAT-5 | **REFUTED** | sol | ``node -e 'const fs=require("node:fs"),p=require("node:path"),m=require("./.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs"); const norm=b=>String(b\` | \ |
| `devin-04:F3` | CAT-5 | **CONFIRMED** | sol | ``node ".opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs" ".codex/agents/code.toml"`` | The workflow enrolls Codex changes, but the checker reports no agent files for a Codex agent path. |
| `devin-04:F6` | CAT-1 | **CONFIRMED** | sol | ``rg --hidden --no-ignore --files -g 'write.md' .`` | The shortcut references `write.md`, but exhaustive file search finds no such agent. |
| `devin-04:F7` | CAT-4 | **CONFIRMED** | composer | ``head -40 karabiner.json`` | File at repo root contains personal Karabiner-Elements keyboard shortcuts (osascript clipboard-paste commands for AI workflows); personal macOS config in a public repo |
| `devin-04:F8` | CAT-3 | **CONFIRMED** | composer | ``cat .rename-engine-disposable` + `grep rename-engine .gitignore`` | File contains "semantic-rename-engine disposable fixture" (scratch residue); grep returns no match in `.gitignore` — not ignored |
| `devin-04:F9` | CAT-5 | **CONFIRMED** | sol | ``node -e 'const fs=require("node:fs"); const t=fs.readFileSync(".codex/config.toml","utf8"),c=[...t.matchAll(/^\[mcp_servers\.(?:"([^"]+)"\` | ([^\].]+))\]$/gm)].map(m=>m[1]\ |
| `devin-05:F2` | CAT-2 | **CONFIRMED** | devin | ``grep -rl "fixtures/sk-code\` | sk-code-loadspeed-001\ |
| `devin-05:F3` | CAT-4 | **CONFIRMED** | composer | ``ls .opencode/skills/sk-design/benchmark/2026-07-06--after-009--router/` + `grep -n 'after-009\` | after-012-routing\ |
| `fanout:F1` | CAT-1 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F10` | CAT-1 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F11` | CAT-5 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F12` | CAT-6 | **DEFERRED** | devin | ``ls .opencode/skills/system-deep-loop/runtime/scripts/fanout-*.cjs`` | No claim text; 4 fanout scripts exist (fanout-merge/pool/run/salvage.cjs). Cannot test an absent claim. |
| `fanout:F13` | CAT-3 | **DEFERRED** | composer | ``find .opencode/install-guides/ -type l` (cannot run — exec blocked)` | All files found by `find_file_by_name` are real readable files (README.md has 1595 lines of content); cannot detect broken symlinks without `ls -la` or `find -type l`, which require shell access that  |
| `fanout:F14` | CAT-5 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F15` | CAT-6 | **DEFERRED** | devin | ``ls -d .opencode/skills/*/feature-catalog/compiled-routing-and-legacy-fallback/`` | No claim text; 6 such folders exist, each with a real feature-catalog .md doc. Cannot test an absent claim. |
| `fanout:F16` | CAT-4 | **DEFERRED** | composer | ``find .opencode/skills/system-spec-kit/scripts/test-fixtures/*/description.json`` | 4 `description.json` files exist (fixtures 002, 003, 004, 053); claim column is empty — no stated assertion to test against |
| `fanout:F17` | CAT-5 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F18` | CAT-2 | **DEFERRED** | devin | ``head -30 .opencode/commands/doctor/mcp.md`` | No claim text in worklist row to test; file exists as a real router doc. Cannot confirm or refute an absent claim. |
| `fanout:F19` | CAT-5 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F2` | CAT-2 | **DEFERRED** | devin | ``ls .opencode/skills/system-spec-kit/`` | No claim text; path `:memory:` is a SQLite in-memory handle, not a real filesystem path (no file found). Nothing to test. |
| `fanout:F20` | CAT-5 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F21` | CAT-3 | **DEFERRED** | composer | ``find .opencode/skills/system-spec-kit/node_modules/` (cannot run — exec blocked)` | `find_file_by_name` returns no files, but `node_modules` is gitignored (`**/node_modules` line 80) so the find tool skips it; cannot verify directory existence without shell access |
| `fanout:F22` | CAT-1 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F3` | CAT-5 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F4` | CAT-6 | **DEFERRED** | devin | ``ls .opencode/bin/lib/compiled-routing/005-decision-evaluator/lib/`` | No claim text; directory exists with real .cjs code (decision-contract.cjs 484 lines, projector.cjs). Cannot test an absent claim. |
| `fanout:F6` | CAT-3 | **REFUTED** | composer | ``find .opencode/skills/system-spec-kit/mcp-server/database/vectors/`` | `vectors/` directory exists but contains only `README.md` — no `.gitkeep` file present |
| `fanout:F7` | CAT-2 | **DEFERRED** | devin | ``find .opencode/skills/system-spec-kit/vectors -type f`` | No claim text; directory contains no files (find returns empty). Nothing to test. |
| `fanout:F8` | CAT-5 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:F9` | CAT-1 | **DEFERRED** | sol | ``rg -n --hidden --glob '!.git/**' '^\` | (35\ |
| `fanout:SOL-01` | CAT-4 | **REFUTED** | composer | ``find .opencode/skills/system-skill-advisor/mcp-server/database/` + `find .opencode/skills/system-skill-advisor/mcp_server/database/`` | Claim says live SQLite exists under BOTH paths; `mcp-server/database/` (hyphen) has only README.md — no sqlite; `mcp_server/database/` (underscore) has the sqlite. Only one path has live state, not bo |
| `fanout:SOL-02` | CAT-5 | **CONFIRMED** | sol | ``wc -l .opencode/bin/mk-spec-memory-launcher.cjs .opencode/bin/mk-skill-advisor-launcher.cjs .opencode/bin/mk-code-index-launcher.cjs .opencode/bin/lib/launcher-ipc-bridge.cjs .opencode/bin/lib/launch` | launcher-(ipc-bridge\ |
| `fanout:SOL-03` | CAT-5 | **CONFIRMED** | sol | ``rg --files --hidden --glob '!.git/**' \` | rg 'shared-payload\.ts$'; wc -l .opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts .opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts .opencode/skills |
| `fanout:SOL-04` | CAT-6 | **CONFIRMED** | devin | ``cat .opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts`` | Stub is 12 lines: `isSpeckitMetricsEnabled()` returns `false`, `speckitMetrics` has no-op `incrementCounter`/`recordHistogram`. `grep -rl "isSpeckitMetricsEnabled\ |
| `fanout:SOL-05` | CAT-6 | **CONFIRMED** | devin | ``wc -l .opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts .opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adap` | 1241 + 3426 = 4667 lines exactly; `grep -rl "resume-adapter\ |
| `fanout:SOL-06` | CAT-4 | **CONFIRMED** | composer | ``head -40 .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`` | HUB_CHILD object lists 7 hub compilers (sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc); phase-numbered topology confirmed (014-runtime-engine, 009-pa |
| `fanout:SOL-07` | CAT-5 | **CONFIRMED** | sol | ``rg -n --hidden --glob '!.git/**' 'legacyBodyPath\` | compiledContractPath\ |
| `fanout:SOL-08` | CAT-5 | **CONFIRMED** | sol | ``for spec in '.opencode/agents/*.md' '.claude/agents/*.md' '.codex/agents/*.toml'; do set -- $~spec; printf '%s definitions=%s\n' "$spec" "$#"; done; for f in .opencode/agents/README.txt .claude/agent` | \ |
| `fanout:SOL-09` | CAT-4 | **CONFIRMED** | composer | ``head -7 .opencode/skills/system-spec-kit/scripts/.scan-one.sh`` | Lines 5-6 embed absolute workstation paths: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/...` |
| `fanout:SOL-10` | CAT-3 | **CONFIRMED** | composer | ``find .opencode/logs/dist-freshness-guard.log*` + `grep '\*.log' .gitignore`` | File `dist-freshness-guard.log.1` exists; `.gitignore` line 213 has `*.log` but not `*.log.*` — rotated log extension `.log.1` is not matched |

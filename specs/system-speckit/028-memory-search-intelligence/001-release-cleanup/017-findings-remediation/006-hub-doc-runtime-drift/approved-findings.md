# Approved finding set

12 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-01:F14` | CAT-5 | `node -e "const fs=require('fs'),p='.opencode/skills/sk-git/'; console.log(['mode-registry.json','hub-router.json','git-worktrees','git-commit','git-finish'].map(x=>x+':'+fs.existsSync(p+x)).join(' ')` | None of the claimed routing infrastructure or packet directories exists; the implementation is a monolithic resource router. |
| `devin-01:F22` | CAT-5 | `rg -n --hidden --glob '!.git/**' -e 'Never add runtime logic' -e '^#!/usr/bin/env node' .opencode/skills/sk-prompt/prompt-models/{SKILL.md,benchmarks/2026-07-10--prompt-framework--minimax/eval-loop/s` | The packet forbids runtime logic but contains executable Node benchmark logic. |
| `devin-01:F5` | CAT-5 | `rg -n --hidden --glob '!.git/**' -e 'Workflow axis' -e 'Surface axis' -e '"surfaces"' .opencode/skills/sk-code/{changelog/v4.1.0.0.md,mode-registry.json}` | The changelog declares three surfaces, including `animation`, while the authoritative registry declares two. |
| `devin-02:F1` | CAT-5 | `node -e 'const fs=require("fs");const d=".opencode/skills/cli-external-orchestration/";const s=fs.readFileSync(d+"SKILL.md","utf8");const r=JSON.parse(fs.readFileSync(d+"mode-registry.json"));console` | The registry ships five modes while `SKILL.md` retains both “four” and “three” claims. |
| `devin-02:F6` | CAT-5 | `node -e 'const fs=require("fs");for(const h of ["cli-external-orchestration","mcp-tooling"]){const d=".opencode/skills/"+h+"/";const s=fs.readFileSync(d+"SKILL.md","utf8");console.log(h,"leafManifest` | Both layout diagrams omit their live `leaf-manifest.json` contract file. |
| `devin-03:F2` | CAT-5 | `node -e 'const fs=require("fs");const root=".opencode/commands/";const s=fs.readFileSync(root+"README.txt","utf8");console.log("interfaceDir="+fs.statSync(root+"interface").isDirectory(),"interfaceCo` | Three live interface commands exist, but the canonical index omits the group. |
| `devin-03:F3` | CAT-5 | `node -e 'const fs=require("fs");const p=".opencode/commands/";const s=fs.readFileSync(p+"README.txt","utf8");console.log("hyphenFile="+fs.existsSync(p+"agent-router.md"),"underscoreFile="+fs.existsSy` | \ |
| `devin-03:F4` | CAT-5 | `node -e 'const fs=require("fs");const p=".opencode/commands/create/";const s=fs.readFileSync(p+"README.txt","utf8");const c=fs.readFileSync(p+"diff.md","utf8");console.log("live="+fs.existsSync(p+"di` | `/create:diff` is a wired router but appears in neither index. |
| `devin-03:F5` | CAT-5 | `node -e 'const fs=require("fs");const p=".opencode/commands/deep/";const s=fs.readFileSync(".opencode/commands/README.txt","utf8");for(const n of ["alignment","command-benchmark"])console.log(n,"live` | Both live deep routers are absent from the canonical deep listing. |
| `devin-03:F6` | CAT-5 | `node -e 'const fs=require("fs");const p=".opencode/agents/";const s=fs.readFileSync(p+"README.txt","utf8");console.log("live="+fs.existsSync(p+"deep-alignment.md"),"indexed="+s.includes("deep-alignme` | `deep-alignment.md` is live but absent from the inventory. |
| `devin-03:F7` | CAT-5 | `node -e 'const fs=require("fs");const p=".opencode/commands/deep/assets/compiled/";const r=fs.readFileSync(p+"README.md","utf8");const c=fs.readFileSync(p+"deep-alignment.contract.md","utf8");const m` | The README calls it a placeholder, but it is a 466-line generated contract recorded in the manifest. |
| `devin-03:F8` | CAT-5 | `node -e 'const fs=require("fs"),path=require("path");const p=".opencode/commands";const s=fs.readFileSync(p+"/scripts/README.md","utf8"),q=String.fromCharCode(96);const live=fs.readdirSync(p,{withFil` | Runtime discovery covers seven families including `interface`; the README lists only three and includes retired `design`. |

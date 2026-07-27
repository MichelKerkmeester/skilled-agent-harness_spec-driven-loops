[0m
> build · gpt-5.6-luna-fast
[0m
[0m→ [0mRead .opencode/commands/deep/assets/compiled/README.md
[0m→ [0mRead .opencode/commands/deep/assets/legacy/README.md
[0m✱ [0mGlob "*"[90m in .opencode/commands/deep/assets/legacy · 5 matches[0m
[0m✱ [0mGlob "*"[90m in .opencode/commands/deep/assets/compiled · 6 matches[0m
[0m✱ [0mGlob "**/*.contract.md"[90m in .opencode/commands/deep/assets/compiled · 4 matches[0m
[0m✱ [0mGlob "**/*.body.md"[90m in .opencode/commands/deep/assets/legacy · 4 matches[0m
[0m✱ [0mGrep ""command""[90m in .opencode/commands/deep/assets/compiled · 100 matches[0m
[0m✱ [0mGrep "legacy|compiled|deep-alignment|deep-improvement|deep-ai-council|deep-research|deep-review"[90m in .opencode/commands/deep · 100 matches[0m
[0m
[0m$ [0mls -la ".opencode/commands/deep/assets/legacy"
total 96
drwxr-xr-x   7 michelkerkmeester  staff    224 Jul 21 07:58 .
drwxr-xr-x@ 28 michelkerkmeester  staff    896 Jul 27 09:49 ..
-rw-r--r--   1 michelkerkmeester  staff   3461 Jul 21 07:58 README.md
-rw-r--r--   1 michelkerkmeester  staff   7641 Jul 21 07:58 deep-ai-council.body.md
-rw-r--r--   1 michelkerkmeester  staff   8764 Jul 21 07:58 deep-alignment.body.md
-rw-r--r--   1 michelkerkmeester  staff  11036 Jul 21 07:58 deep-research.body.md
-rw-r--r--   1 michelkerkmeester  staff   8283 Jul 21 07:58 deep-review.body.md
[0m
[0m$ [0mls -la ".opencode/commands/deep/assets/compiled"
total 360
drwxr-xr-x@  8 michelkerkmeester  staff    256 Jul 25 10:13 .
drwxr-xr-x@ 28 michelkerkmeester  staff    896 Jul 27 09:49 ..
-rw-r--r--@  1 michelkerkmeester  staff   3959 Jul 27 16:55 README.md
-rw-r--r--@  1 michelkerkmeester  staff  26563 Jul 26 08:10 deep-ai-council.contract.md
-rw-r--r--@  1 michelkerkmeester  staff  24761 Jul 26 08:10 deep-alignment.contract.md
-rw-r--r--@  1 michelkerkmeester  staff  28507 Jul 26 08:10 deep-research.contract.md
-rw-r--r--@  1 michelkerkmeester  staff  29146 Jul 26 08:10 deep-review.contract.md
-rw-r--r--@  1 michelkerkmeester  staff  57884 Jul 13 05:33 manifest.jsonl
[0m
[0m✱ [0mGrep "five|5 legacy|four|4 compiled|not compiled|not yet compiled|asymmetr"[90m in .opencode/commands/deep/assets · 1 match[0m
[0m✱ [0mGrep "assets/legacy|assets/compiled|\.body\.md|\.contract\.md"[90m in .opencode · 12 matches[0m
[0m→ [0mRead .opencode/commands/scripts/validate-command-references.cjs[90m [offset=150, limit=85][0m
[0m✱ [0mGrep "assets/legacy/.*body|legacy body|compiled contract"[90m in .opencode/commands/deep · 14 matches[0m
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs[90m [offset=1, limit=85][0m
[0m✱ [0mGrep "deep-ai-council|deep-alignment|deep-research|deep-review|definitions|legacy"[90m in .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs · 100 matches[0m
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs[90m [offset=25, limit=175][0m
[0m→ [0mRead .opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs[90m [offset=83, limit=130][0m
[0m→ [0mRead .opencode/commands/deep/assets/compiled/README.md[90m [offset=17, limit=108][0m
[0m→ [0mRead .opencode/commands/deep/assets/legacy/README.md[90m [offset=17, limit=95][0m
Runtime recheck shows the premise is stale: `legacy/` contains four bodies, and the renderer/compiler registries define the same four compiled pairings. I am correcting both READMEs to document parity and the real fallback-only asymmetry for the other deep commands.
[0m% [0mPatch 2 files
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs[90m [offset=730, limit=105][0m
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs[90m [offset=1, limit=90][0m
[0m→ [0mRead .opencode/commands/deep/assets/compiled/README.md
[0m→ [0mRead .opencode/commands/deep/assets/legacy/README.md
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs[90m [offset=230, limit=38][0m
[0m✱ [0mGrep "Usage|--command|main\(|process.argv|module.exports"[90m in .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs · 72 matches[0m
[0m→ [0mRead .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs[90m [offset=500, limit=110][0m
[0m% [0mPatch 1 file
[0m
[0m$ [0mnode - <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const render = require('./.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs');
const rollout = JSON.parse(fs.readFileSync('./.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json', 'utf8'));
const legacyDir = './.opencode/commands/deep/assets/legacy';
const compiledDir = './.opencode/commands/deep/assets/compiled';
const legacy = fs.readdirSync(legacyDir).filter((name) => name.endsWith('.body.md')).map((name) => name.replace(/\.body\.md$/, '')).sort();
const compiled = fs.readdirSync(compiledDir).filter((name) => name.endsWith('.contract.md')).map((name) => name.replace(/\.contract\.md$/, '')).sort();
const renderer = Object.keys(render.COMMANDS).map((name) => name.replace('/', '-')).sort();
const setDiff = (left, right) => left.filter((item) => !right.includes(item));
if (legacy.length !== 4 || compiled.length !== 4 || JSON.stringify(legacy) !== JSON.stringify(compiled) || JSON.stringify(legacy) !== JSON.stringify(renderer)) process.exit(1);
const fallbackOnly = Object.entries(rollout).filter(([command, mode]) => mode === 'fallback' && !render.COMMANDS[command]).map(([command]) => command).sort();
const compiledReadme = fs.readFileSync(path.join(compiledDir, 'README.md'), 'utf8');
const legacyReadme = fs.readFileSync(path.join(legacyDir, 'README.md'), 'utf8');
for (const name of legacy) {
  if (!compiledReadme.includes(`deep/${name.replace(/^deep-/, '')}`) || !legacyReadme.includes(`deep/${name.replace(/^deep-/, '')}`)) process.exit(1);
}
if (!legacyReadme.includes('There is no fifth body') || !compiledReadme.includes('no legacy body in that directory lacks a compiled counterpart')) process.exit(1);
console.log(`legacyBodies=${legacy.length} [${legacy.join(', ')}]`);
console.log(`compiledContracts=${compiled.length} [${compiled.join(', ')}]`);
console.log(`rendererCommands=${renderer.length} [${renderer.join(', ')}]`);
console.log(`unmatchedLegacy=[${setDiff(legacy, compiled).join(', ')}]`);
console.log(`unmatchedCompiled=[${setDiff(compiled, legacy).join(', ')}]`);
console.log(`fallbackOnlyRollout=${fallbackOnly.join(', ')}`);
console.log('README inventory claims=match');
NODE
legacyBodies=4 [deep-ai-council, deep-alignment, deep-research, deep-review]
compiledContracts=4 [deep-ai-council, deep-alignment, deep-research, deep-review]
rendererCommands=4 [deep-ai-council, deep-alignment, deep-research, deep-review]
unmatchedLegacy=[]
unmatchedCompiled=[]
fallbackOnlyRollout=deep/agent-improvement, deep/model-benchmark, deep/skill-benchmark
README inventory claims=match
[0m
[0m$ [0mnode .opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
[CONTRACT DRIFT] command=deep/alignment class=STALE_SOURCE_DIGEST reason=source digest mismatch for .opencode/commands/deep/alignment.md recordedSha256=31c2864bcb2316a7b8227104c00a08a18201d1c8521fcc645392876777007d96 liveSha256=88b54ae9ee9ec032fb0f61e4755497a5c9f8dd5986d4fd2bd484f1d87d73c3af
[CONTRACT DRIFT] command=deep/review class=STALE_SOURCE_DIGEST reason=source digest mismatch for .opencode/commands/deep/review.md recordedSha256=1e624374cab9bb2c181a8c1654d02f1a93d570c6817abcf592089981f93f4101 liveSha256=5fe458bf98ffc12a2803bbba24c53a87891eb8912d13257ecc41180c4853e5c8
[CONTRACT DRIFT] command=deep/research class=STALE_SOURCE_DIGEST reason=source digest mismatch for .opencode/commands/deep/research.md recordedSha256=e27652c62b3815b3020464149aab0dab7e776b86ee54e7b54abf0bdf6d312072 liveSha256=77bec98ce76426f813fc65977882a459314b1856117b3e0302b9e11d779e42c7
[CONTRACT DRIFT] command=deep/research class=STALE_SOURCE_DIGEST reason=source digest mismatch for .opencode/commands/deep/assets/deep-research-confirm.yaml recordedSha256=d30a9cdf88a8fe9f251226b178467105b52bfe9af585997209342eb3247a89a0 liveSha256=bafec1aa180dd4b6a729d4c048db2d4b8680d391229a03b20af63d5da7396eda
[0m
[0m$ [0mnode -e '
const fs = require("fs");
const lines = fs.readFileSync(".opencode/commands/deep/assets/compiled/manifest.jsonl", "utf8").trim().split("\n");
for (const line of lines) JSON.parse(line);
console.log(`OK ${lines.length} manifest rows`);
'
OK 151 manifest rows
[0m
[0m$ [0mgit diff --check -- .opencode/commands/deep/assets/compiled/README.md .opencode/commands/deep/assets/legacy/README.md
(no output)
[0m
[0m$ [0mnode .opencode/commands/scripts/validate-command-references.cjs
OK  command references resolve across 67 asset file(s) [create, deep, doctor, interface, memory, prompt, speckit].
[0m
The documentation parity check passes, manifest parsing and command-reference validation pass, and no contract/body files were changed. The separate contract-freshness gate reports existing source-digest drift in `deep/alignment`, `deep/review`, and `deep/research`; those generated/runtime files are outside the owned scope, so I did not alter them.
[0m$ [0mgit status --short -- .opencode/commands/deep/assets/compiled/README.md .opencode/commands/deep/assets/legacy/README.md
M .opencode/commands/deep/assets/compiled/README.md
 M .opencode/commands/deep/assets/legacy/README.md
[0m
[0m$ [0mgit diff --name-only -- .opencode/commands/deep/assets/compiled/README.md .opencode/commands/deep/assets/legacy/README.md && git diff -- .opencode/commands/deep/assets/compiled/README.md .opencode/commands/deep/assets/legacy/README.md
.opencode/commands/deep/assets/compiled/README.md
.opencode/commands/deep/assets/legacy/README.md
diff --git a/.opencode/commands/deep/assets/compiled/README.md b/.opencode/commands/deep/assets/compiled/README.md
index 0758e83b9d..251fb9bca2 100644
--- a/.opencode/commands/deep/assets/compiled/README.md
+++ b/.opencode/commands/deep/assets/compiled/README.md
@@ -1,6 +1,6 @@
 ---
 title: "Compiled Deep Command Contracts"
-description: "Developer reference for generated deep-command contracts, rollout metadata and the live alignment contract."
+description: "Developer reference for generated deep-command contracts, rollout metadata and injection relationships."
 trigger_phrases:
   - "compiled deep contracts"
   - "deep command contract manifest"
@@ -16,10 +16,12 @@ importance_tier: "important"
 
 ## 1. OVERVIEW
 
-`.opencode/commands/deep/assets/compiled/` stores flattened command contracts used by deep-command injection tooling.
+`.opencode/commands/deep/assets/compiled/` stores the four flattened command contracts used by deep-command injection tooling.
 
 The generated contracts combine maintained command, workflow, skill, reference and agent sources into grep-checkable executor instructions. Maintained source files remain authoritative.
 
+The compiled inventory is intentionally limited to the four commands registered with the contract compiler and renderer: `deep/ai-council`, `deep/alignment`, `deep/research` and `deep/review`. Each has one matching legacy body in `../legacy/`; no legacy body in that directory lacks a compiled counterpart. The rollout entries for `deep/agent-improvement`, `deep/model-benchmark` and `deep/skill-benchmark` are fallback-only and are not compiler-managed asset pairs.
+
 ---
 
 ## 2. DIRECTORY TREE
@@ -43,7 +45,7 @@ compiled/
 | `deep-research.contract.md` | Generated executor contract for `/deep:research`. |
 | `deep-review.contract.md` | Generated executor contract for `/deep:review`. |
 | `deep-ai-council.contract.md` | Generated executor contract for `/deep:ai-council`. |
-| `deep-alignment.contract.md` | Live authoritative executor contract for `/deep:alignment`; loaded by the renderer in `fix` mode ahead of the legacy body and freshness-checked against maintained sources. |
+| `deep-alignment.contract.md` | Generated executor contract for `/deep:alignment`; loaded by the renderer in `fix` mode ahead of the matching legacy body and freshness-checked against maintained sources. |
 | `manifest.jsonl` | Append-only render records with command, mode and content digests. |
 
 ---
@@ -75,7 +77,7 @@ Regenerate a contract when any maintained source digest changes.
 
 The generated contracts are derived artifacts. Do not edit their generated sections by hand.
 
-`deep-alignment.contract.md` is the live authoritative executor contract for `/deep:alignment` at injection time. The renderer loads it in `fix` mode ahead of the legacy body and rejects stale content; maintained command, workflow, skill and referenced runtime files remain the regeneration authority.
+The renderer loads the matching compiled contract in `fix` mode ahead of each legacy body and rejects stale content. In `fallback` mode it returns the legacy body without a compiled prefix. Maintained command, workflow, skill and referenced runtime files remain the regeneration authority.
 
 The maintained command files, workflow YAML assets, skill instructions and referenced runtime files remain the source of truth.
 
diff --git a/.opencode/commands/deep/assets/legacy/README.md b/.opencode/commands/deep/assets/legacy/README.md
index 53b6811c0f..4fe790a85e 100644
--- a/.opencode/commands/deep/assets/legacy/README.md
+++ b/.opencode/commands/deep/assets/legacy/README.md
@@ -10,16 +10,18 @@ importance_tier: "important"
 
 # Legacy Deep Command Bodies
 
-> Fallback router bodies retained for deep-command injection modes that do not use a compiled contract.
+> Router bodies retained as the base payload for the four compiler-managed deep commands.
 
 ---
 
 ## 1. OVERVIEW
 
-`.opencode/commands/deep/assets/legacy/` stores fallback command bodies for four deep-loop commands.
+`.opencode/commands/deep/assets/legacy/` stores four fallback command bodies: `deep/ai-council`, `deep/alignment`, `deep/research` and `deep/review`.
 
 Each body acts as a thin router. It resolves command setup and selects workflow YAML while leaving iteration dispatch, artifact writes and convergence handling to the selected workflow.
 
+Each body has a matching compiled contract in `../compiled/`. There is no fifth body and no unmatched body-to-contract relationship in this directory. The remaining rollout entries, `deep/agent-improvement`, `deep/model-benchmark` and `deep/skill-benchmark`, are intentionally fallback-only command files outside this asset inventory and have not been compiled.
+
 ---
 
 ## 2. DIRECTORY TREE
@@ -85,11 +87,9 @@ Inputs such as target paths, iteration limits, convergence settings and executor
 
 ## 6. INJECTION BOUNDARY
 
-Render tooling can return a legacy body directly when a command uses fallback injection.
-
-Compiled contracts live in the sibling `compiled/` folder. Their maintained sources remain authoritative, and generated contract files must not replace the workflow YAML as the owner of runtime execution.
+Render tooling's compiler registry contains exactly these four body-to-contract pairings. In `fallback` mode it returns the legacy body directly; in `fix` mode it prepends the matching fresh compiled contract to that body.
 
-`deep-alignment.body.md` remains especially important because alignment has no generated compiler contract.
+Compiled contracts live in the sibling `compiled/` folder. Their maintained sources remain authoritative, and generated contract files must not replace the workflow YAML as the owner of runtime execution. The fallback-only commands remain outside these asset directories because they are not registered with the contract compiler.
 
 ---
[0m
[0m$ [0mnode -e 'const fs=require("fs"),r=require("./.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs"); const b=fs.readdirSync(".opencode/commands/deep/assets/legacy").filter(x=>x.endsWith(".body.md")).map(x=>x.replace(".body.md","")).sort(); const c=fs.readdirSync(".opencode/commands/deep/assets/compiled").filter(x=>x.endsWith(".contract.md")).map(x=>x.replace(".contract.md","")).sort(); const p=Object.keys(r.COMMANDS).map(x=>x.replace("/","-")).sort(); const l=fs.readFileSync(".opencode/commands/deep/assets/legacy/README.md","utf8"), d=fs.readFileSync(".opencode/commands/deep/assets/compiled/README.md","utf8"); if(JSON.stringify(b)!==JSON.stringify(c)||JSON.stringify(b)!==JSON.stringify(p)||!l.includes("There is no fifth body")||!d.includes("no legacy body in that directory lacks a compiled counterpart")) process.exit(1); console.log(`PARITY OK legacy=${b.length} compiled=${c.length} renderer=${p.length} README=match`)'
PARITY OK legacy=4 compiled=4 renderer=4 README=match
[0m
FINDING: contractDrift
REVERIFIED: Inventory parity passed: `legacyBodies=4`, `compiledContracts=4`, `unmatchedLegacy=[]`, `unmatchedCompiled=[]`; manifest `OK 151 manifest rows`; references `OK`
STATUS: STALE
CHANGE: Updated both owned READMEs to document the actual 4/4 pairing and fallback-only commands.
EVIDENCE: Runtime/README check returned `PARITY OK legacy=4 compiled=4 renderer=4 README=match`
RISK: No runtime impact. Contract freshness still reports pre-existing source-digest drift in alignment, review, and research; those files were outside scope and untouched.

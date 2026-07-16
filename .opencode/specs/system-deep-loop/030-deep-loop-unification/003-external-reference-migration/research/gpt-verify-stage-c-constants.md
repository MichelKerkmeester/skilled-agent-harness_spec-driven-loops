Read-only verification started. I’ll search exact filenames and literals first, then read the live files around each hit for line-numbered evidence.

---

Initial search found the planned code files and the agent mirror pair: `.opencode/hooks/pre-commit` and `.github/workflows/agent-mirror-sync.yml`. The filename search places `render-command-contract.cjs` and `compile-command-contracts.cjs` under `system-deep-loop/runtime`, so I’ll treat their contents as relevant only for the specifically requested site while keeping broader out-of-scope scans outside `system-deep-loop/`.

---

The two planned `lib/routing/...` paths appear not to be literal live paths from the first grep results; matching code is under `lib/scorer/...`. I’ll confirm path existence and use the live file locations in the report.

---

Confirmed planned paths 2 and 3 are stale in the plan: the live files are `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`.

---

The `parent-skill-check.cjs` broad search shows it is wired by the routing-registry drift workflow and `/doctor parent-skill`, plus create-parent-skill command assets. I’ll read those call sites and the checker’s drift-guard section to confirm the “every skill doctor audit” claim.

---

`render-command-contract.cjs` has no old-name references in the excerpt read so far; `compile-command-contracts.cjs` already points at `system-deep-loop` in its manifest source paths. I’ll finish the latter search for any remaining old-name imports or path allowlists.

---

I found additional old-name references outside the seven planned code sites, including agent prompts, generated compiled-contract headers, and hook documentation. I’ll run one targeted `rg` inventory excluding the renamed `system-deep-loop` tree so the gap list is not based on truncated grep output.

---

The full inventory is dominated by historical `.opencode/specs/**` references. I’ll narrow the gap check to active non-spec surfaces, still excluding the renamed skill tree.

---

The narrowed active-surface inventory is still large because advisor fixtures intentionally contain expected old skill IDs. I’ll switch to file-level grouping for the final gap list and read only representative active files not already covered.

---

For `skill_advisor.py`, I’ll isolate just the old-name literals so the report can separate planned constants from additional same-file references.

---

The exact old-name scan of `skill_advisor.py` found 18 occurrences, including planned constants, phrase-boost table entries, CLI help text, and comments/docstrings.

---

The guard test fixture is `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`; it creates `.opencode/skills/deep-loop-workflows/mode-registry.json` in a temp project and has an explicit missing-registry fail-open assertion.

---

For site 6, the active compiler/renderer scripts themselves no longer contain the old names, but generated compiled contracts still do. I’ll read the drift checker to confirm the dependency that would surface stale generated contracts.

---

I’ll read the projection write/check code in `skill_advisor.py` once so the dependency between `MODE_REGISTRY_PATH`, `ALIASES_TS_PATH`, and the drift guards is cited directly.

---

No source file has shown a `require()`/import of `parent-skill-check.cjs`; the live integrations found are shell/YAML/workflow invocations.

---

The only `.opencode/commands/**` call sites are `/doctor parent-skill` and create-parent-skill assets; the CI workflow is the separate repo-level gate.

---

Two system-skill-advisor tests also shell out/read `parent-skill-check.cjs`; these are additional live test dependencies.

---

The routing-registry drift guard is a direct dependency of both `skill_advisor.py --dump-routing-maps` and `parent-skill-check.cjs`; I’ll read its path literal and projection comparison section.

---

One non-spec root file also appears in the active file-level inventory: `.gitignore`; I’ll inspect the hit to decide whether it is a real migration gap or an ignore-rule artifact.

---

`.gitignore` has real old `deep-loop-runtime` ignore paths for runtime DB artifacts; this is outside the seven-site plan.

---

Active `/deep` command assets also have old paths beyond the compiler/renderer scripts; I’ll group those by file for the gap list.

---

Read-only verification only. No files edited, created, or deleted.

## Site 1

**File path**: `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`

**Confirmed claims**

The planned file exists. The named constants/literals exist, except `ALIASES_TS_PATH` points to the live `lib/scorer/aliases.ts` path, not `lib/routing/aliases.ts`.

```python
83: MODE_REGISTRY_PATH = os.path.join(SKILLS_DIR, "deep-loop-workflows", "mode-registry.json")
84: ALIASES_TS_PATH = os.path.join(
85:     SKILLS_DIR,
86:     "system-skill-advisor",
87:     "mcp_server",
88:     "lib",
89:     "scorer",
90:     "aliases.ts",
91: )
```

```python
346: def _projection_hash(entries: List[Dict[str, Any]]) -> str:
347:     """Hash the generated advisor projection payload."""
348:     return _json_hash({
349:         "skill": "deep-loop-workflows",
350:         "entries": entries,
351:     })
```

```python
2570: # The active legacy deep-loop modes are folded into one public skill,
2571: # deep-loop-workflows, discriminated by workflowMode. The Candidate-3 internal
2572: # discriminator keys below stay spelled as the legacy skill ids because the
...
2579: MERGED_DEEP_SKILL_ID = "deep-loop-workflows"
```

Routing-weight literals keyed to `deep-loop-workflows` exist in `PHRASE_INTENT_BOOSTERS`:

```python
1925:     "auto review release readiness": [("deep-review", 7.0), ("deep-loop-workflows", 7.0)],
...
1929:     ":start-review-loop": [("deep-loop-workflows", 3.0)],
1930:     ":start-review-loop:auto": [("deep-loop-workflows", 3.0)],
1931:     ":start-review-loop:confirm": [("deep-loop-workflows", 3.0)],
1932:     ":review:auto": [("deep-loop-workflows", 3.0)],
1933:     ":review:confirm": [("deep-loop-workflows", 3.0)],
```

**Other same-file old-name references**

Exact old-name scan found 18 matches in this file. Additional non-planned hits include CLI help text and comments/docstrings:

```python
16:     --deep-skill-routing-json  Score deep-loop-workflows mode routing (research|review|ai-council) from JSON stdin
```

```python
2767:     `winner`/`runner_up` are deep-loop-workflows workflowMode names
...
2780:     The five legacy deep-loop skills are collapsed into deep-loop-workflows, so
2781:     the contract is {skill: deep-loop-workflows, mode: <workflowMode>} plus
```

```python
2833:     for recommendation in recommendations:
2834:         skill = recommendation.get("skill")
2835:         # Resolve which mode's confidence to blend in. The merged node
2836:         # (deep-loop-workflows) carries the winning mode; legacy mode-level ids
```

```python
4271:     parser.add_argument('--dump-routing-maps', action='store_true',
4272:                         help='Dump the hardcoded deep-loop-workflows routing projection maps as JSON (consumed by the registry drift-guard test).')
```

**Cross-file dependencies**

`MODE_REGISTRY_PATH` feeds projection generation; `ALIASES_TS_PATH` is read and optionally rewritten by the projection emitter:

```python
420:     """Emit generated advisor routing projection blocks from mode-registry.json."""
421:     entries = _load_mode_registry_projection({"lexical", "alias-fold"})
...
425:     with open(ALIASES_TS_PATH, "r", encoding="utf-8") as aliases_file:
426:         aliases_content = aliases_file.read()
...
430:     next_aliases = _replace_marked_block(
431:         aliases_content,
432:         TS_PROJECTION_START,
433:         TS_PROJECTION_END,
434:         _render_ts_projection(entries, projection_hash),
435:     )
...
463:     if next_aliases != aliases_content:
464:         with open(ALIASES_TS_PATH, "w", encoding="utf-8") as aliases_file:
465:             aliases_file.write(next_aliases)
```

`routing-registry-drift-guard.vitest.ts` shells out to this script:

```ts
128: function dumpPythonMaps(): RoutingDump {
129:   const stdout = execFileSync('python3', [advisorScript, '--dump-routing-maps'], {
...
136: function checkProjectionGenerator(): { readonly status: string; readonly projectionHash: string; readonly changed: readonly string[] } {
137:   const stdout = execFileSync('python3', [advisorScript, '--check-routing-projection'], {
```

`parent-skill-check.cjs` also shells out to `skill_advisor.py --dump-routing-maps`:

```js
638:       const raw = execFileSync('python3', [ADVISOR_SCRIPT_ABS, '--dump-routing-maps'], {
```

## Site 2

**Planned file path**: `.opencode/skills/system-skill-advisor/mcp_server/lib/routing/aliases.ts`

**Live file path found**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`

**Confirmed/refuted claims**

The planned `lib/routing/aliases.ts` path is stale. The live analog exists under `lib/scorer/aliases.ts`. The hand-authored `MERGED_DEEP_SKILL_ID` constant exists at line 109.

Generated block boundaries are explicit:

```ts
1: // ───────────────────────────────────────────────────────────────
2: // MODULE: Advisor Skill Alias Groups
3: // ───────────────────────────────────────────────────────────────
4: 
5: const BASE_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({
...
19: });
20: 
21: // BEGIN GENERATED DEEP ROUTING PROJECTION
22: /** Hash of the generated deep-loop routing projection embedded below. */
23: export const DEEP_ROUTING_PROJECTION_HASH = 'sha256:5c22ac993d9fb60ec1efcd4688cdf0452eb000ccb8108d581911155e5e9a7d02';
...
63: // END GENERATED DEEP ROUTING PROJECTION
64: 
65: const RAW_ALIAS_GROUPS: Readonly<Record<string, readonly string[]>> = Object.freeze({
```

The hand-authored merged ID is after the generated block:

```ts
91: // ───────────────────────────────────────────────────────────────
92: // MODULE: Merged Deep-Loop Identity + Mode Layer
...
97: // deep-loop-workflows, discriminated by workflowMode (see
98: // deep-loop-workflows/mode-registry.json). canonicalSkillId above is
...
109: export const MERGED_DEEP_SKILL_ID = 'deep-loop-workflows';
```

**Other same-file old-name references**

```ts
103: // deep-loop-workflows with the right mode once the old skill nodes leave the
...
159:  * Resolve any deep-loop alias to the merged skill id (deep-loop-workflows) when
```

**Cross-file dependencies**

`skill_advisor.py` rewrites only the generated section between lines 21 and 63. The hand-authored merged identity at line 109 is separate and should not be treated as generated.

`routing-registry-drift-guard.vitest.ts` imports this file’s projection exports:

```ts
14: import {
15:   DEEP_MODE_BY_CANONICAL,
16:   DEEP_ROUTING_PROJECTION_HASH,
17:   SKILL_ALIAS_GROUPS,
18: } from '../lib/scorer/aliases.js';
```

## Site 3

**Planned file path**: `.opencode/skills/system-skill-advisor/mcp_server/lib/routing/explicit.ts`

**Live file path found**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`

**Confirmed/refuted claims**

The planned `lib/routing/explicit.ts` path is stale. The live analog exists under `lib/scorer/lanes/explicit.ts`. `TOKEN_BOOSTS` and `PHRASE_BOOSTS` exist and contain `deep-loop-workflows` entries.

```ts
18: const TOKEN_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
...
28:   council: [['deep-loop-workflows', 0.9]],
...
31:   deliberation: [['deep-loop-workflows', 0.8]],
```

```ts
101: const PHRASE_BOOSTS: Readonly<Record<string, readonly [string, number][]>> = {
...
105:   '/deep:start-research-loop': [['deep-loop-workflows', 1.6], ['command-spec-kit', 0.45]],
106:   '/deep:start-review-loop': [['deep-loop-workflows', 1.6], ['command-spec-kit', 0.45]],
108:   '/deep:start-agent-improvement-loop': [['deep-loop-workflows', 1.6], ['command-spec-kit', 0.45]],
110:   'auto review release readiness': [['deep-loop-workflows', 1]],
115:   ':review:auto': [['deep-loop-workflows', 1.6], ['sk-code', -0.6]],
116:   ':review:confirm': [['deep-loop-workflows', 1.6], ['sk-code', -0.6]],
```

More phrase-map entries:

```ts
125:   '5d scoring': [['deep-loop-workflows', 1.5]],
126:   '5-dimension agent scoring': [['deep-loop-workflows', 1.6]],
127:   'integration scan': [['deep-loop-workflows', 1.5]],
128:   'dynamic profile': [['deep-loop-workflows', 1.5]],
...
138:   'benchmark a model': [['deep-model-benchmark', 1.6], ['deep-loop-workflows', -0.6]],
...
146:   'prompt framework benchmark': [['deep-model-benchmark', 1.5], ['deep-loop-workflows', -0.4]],
```

Deep phrase entries:

```ts
173:   'deep research': [['deep-loop-workflows', 1]],
174:   'deep review': [['deep-loop-workflows', 1]],
175:   'deep ai council': [['deep-loop-workflows', 1.6]],
176:   'deep-ai-council': [['deep-loop-workflows', 1.6]],
177:   'deep-research': [['deep-loop-workflows', 1.3]],
178:   'deep-review': [['deep-loop-workflows', 1.3]],
179:   'ai council': [['deep-loop-workflows', 1.4]],
...
196:   'resume deep research': [['deep-loop-workflows', 1]],
197:   'resume deep review': [['deep-loop-workflows', 1]],
```

**Other same-file old-name references**

There are additional non-map `push()` calls:

```ts
307:   if (/\b(continue|resume|launch|kick off|overnight|convergence|iteration|iterative|multi-pass|loop)\b/.test(lower) && /\bresearch\b/.test(lower)) {
308:     push(scores, 'deep-loop-workflows', 0.85, 'research-loop');
309:   }
310:   if (/\b(continue|resume|launch|start|convergence|iteration|iterative|multi-pass|loop)\b/.test(lower) && /\breview\b/.test(lower)) {
311:     push(scores, 'deep-loop-workflows', 0.85, 'review-loop');
...
318:     push(scores, 'deep-loop-workflows', 0.45, 'ambiguous-code-problem');
```

**Cross-file dependencies**

This file is part of the native scorer lane. The old-name values affect `scoreExplicitLane()` directly:

```ts
266:   for (const [phrase, boosts] of Object.entries(PHRASE_BOOSTS)) {
...
273:   for (const token of tokens) {
274:     for (const [skillId, amount] of TOKEN_BOOSTS[token] ?? []) {
```

## Site 4

**File found**: `.opencode/plugins/mk-deep-loop-guard.js`

**Confirmed claims**

`REGISTRY_RELATIVE_PATH` exists and points to the old skill path:

```js
35: const REGISTRY_RELATIVE_PATH = '.opencode/skills/deep-loop-workflows/mode-registry.json';
```

The test fixture location is `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`. It creates a temporary fixture under the same old path:

```js
24: function writeFixtureRegistry(dir) {
25:   const registryDir = path.join(dir, '.opencode', 'skills', 'deep-loop-workflows');
26:   fs.mkdirSync(registryDir, { recursive: true });
27:   fs.writeFileSync(
28:     path.join(registryDir, 'mode-registry.json'),
```

**What happens if the path resolves to nothing**

The guard silently fails open for the registry read. It does not throw for a missing registry. `loadRegistryAgents()` catches all read/parse errors and returns `null`:

```js
75: function loadRegistryAgents(registryPath) {
76:   try {
77:     const raw = readFileSync(registryPath, 'utf8');
78:     const data = JSON.parse(raw);
...
83:     return map;
84:   } catch (_) {
85:     return null;
86:   }
87: }
```

The mismatch check only runs when `registry` is truthy:

```js
385:         // -- Check 1: Deep Route mode mismatch (existing behavior, identity-fixed) --
386:         const registry = loadRegistryAgents(registryPath);
387:         if (registry) {
388:           const entry = registry.get(targetAgent);
...
391:             if (declaredMode && declaredMode !== entry.workflowMode) {
392:               const detail = mismatchDetail(targetAgent, entry.workflowMode, declaredMode);
393:               if (process.env[REJECT_MODE_ENV] === '1') throw new Error(detail);
394:               appendWarningLog(loopStateDir, detail);
```

The test explicitly asserts fail-open behavior even with reject mode enabled:

```js
104:   // Fail-open: registry unreadable, mismatch present, reject mode on -- must not throw.
105:   fs.rmSync(path.join(tmpDir, '.opencode', 'skills', 'deep-loop-workflows', 'mode-registry.json'));
106:   process.env[REJECT_ENV] = '1';
107:   await beforeHook({ tool: 'task' }, { args: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' } });
108:   delete process.env[REJECT_ENV];
```

**Other same-file old-name references**

Only the `REGISTRY_RELATIVE_PATH` line matched in `mk-deep-loop-guard.js`.

**Cross-file dependencies**

The plugin test fixture must change with the plugin constant, or the test will keep validating the old path.

## Site 5

**File found**: `.opencode/commands/doctor/scripts/parent-skill-check.cjs`

**Confirmed claims**

`GLOBAL_MAP_OWNER` and `DEFAULT_TARGET` exist and point at the old skill name/path:

```js
91: // The single global advisor projection map only mirrors this hub, so the
92: // dynamic 4b equality check applies to it; every other hub gets the inert-route
93: // coverage check (4c) instead. This is interpretation, not a gate — all hubs
94: // still run the check.
95: const GLOBAL_MAP_OWNER = 'deep-loop-workflows';
96: 
97: const DEFAULT_TARGET = '.opencode/skills/deep-loop-workflows';
```

**Other same-file old-name references**

Exact scan of this file found only those two old-name literals.

**Cross-file dependencies**

`GLOBAL_MAP_OWNER` controls whether the checker runs exact advisor-map equality (`4b`) or inert lexical coverage (`4c`):

```js
610:   // The hub's own declared drift-guard path (falls back to the deep-loop
611:   // reference only for the global-map owner).
...
615:     (basename === GLOBAL_MAP_OWNER ? DEEP_LOOP_DRIFT_GUARD : null);
...
648:       if (basename === GLOBAL_MAP_OWNER) {
649:         const expectedKeys = Object.keys(lexicalIds).sort();
650:         const dumpedKeys = Object.keys(dumped).sort();
651:         const match = expectedKeys.length === dumpedKeys.length && expectedKeys.every((k) => dumped[k] === lexicalIds[k]);
```

The GitHub workflow gates every parent hub with a `mode-registry.json`, not literally every skill:

```yaml
56:       - name: Parent-skill structural invariants (one identity, registry coverage) — every hub
57:         # Glob-enrolled: every skill carrying a mode-registry.json is a parent hub and is
58:         # checked, so a fifth hub joins the gate automatically with no hand-maintained list.
...
61:           for registry in .opencode/skills/*/mode-registry.json; do
62:             hub="$(dirname "$registry")"
63:             echo "── parent-skill-check: $hub"
64:             node .opencode/commands/doctor/scripts/parent-skill-check.cjs "$hub"
```

The `/doctor parent-skill` route shells out to this script for the supplied parent skill:

```yaml
156:   - target: parent-skill
...
163:     script_invocations:
164:       - 'node .opencode/commands/doctor/scripts/parent-skill-check.cjs "{parent_skill_dir}"'
```

Create-parent-skill command assets also require it:

```yaml
333:     purpose: Validate the generated package against the canonical structural gate (success gate == the /doctor parent-skill-check gate)
...
336:       - "Run the canonical structural gate and REQUIRE exit 0: node .opencode/commands/doctor/scripts/parent-skill-check.cjs [skill_root] — the same gate /doctor parent-skill runs, owning hub identity, the two-axis discriminator, toolSurface, hub-router validity, description.json, changelog shape, and registry/directory reverse consistency"
```

Additional tests depend on it:

```ts
27: const CHECKER = join(R, '.opencode/commands/doctor/scripts/parent-skill-check.cjs');
28: const GOLDEN_HUB = join(R, '.opencode/skills/sk-doc'); // a canon-clean workflow-only hub
...
32:     const out = execFileSync('node', [CHECKER, hubDir], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
```

```ts
59: const CHECKER = '.opencode/commands/doctor/scripts/parent-skill-check.cjs';
```

**Confirmed/refuted priority claim**

Refuted as stated if “every skill’s doctor audit” means all doctor targets or all skills. Confirmed in narrower form: this script gates parent-skill audits and the CI workflow runs it for every `.opencode/skills/*/mode-registry.json` parent hub.

## Site 6

**Files found**

`.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs`

`.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`

**Confirmed claims**

The files exist under `system-deep-loop/runtime`. Neither live script contains `deep-loop-workflows` or `deep-loop-runtime` literals.

`render-command-contract.cjs` uses a relative require inside the renamed tree:

```js
8: const {
9:   canonicalizeCommand,
10:   resolveInjectionMode,
11: } = require('../../shared/rollout/resolve-injection-mode.cjs');
```

Its hardcoded manifest and command path map are current command-asset paths, not old skill paths:

```js
13: const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
14: const MANIFEST_PATH = '.opencode/commands/deep/assets/compiled/manifest.jsonl';
15: 
16: const COMMANDS = {
17:   'deep/ai-council': {
18:     slug: 'deep_ai-council',
19:     legacyBodyPath: '.opencode/commands/deep/assets/legacy/deep_ai-council.body.md',
20:     compiledContractPath: '.opencode/commands/deep/assets/compiled/deep_ai-council.contract.md',
```

`compile-command-contracts.cjs` uses current `system-deep-loop` paths in its source manifest:

```js
13: const SHARED_SOURCES = {
14:   autoModeContract: '.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md',
15:   modeRegistry: '.opencode/skills/system-deep-loop/mode-registry.json',
16:   hubSkill: '.opencode/skills/system-deep-loop/SKILL.md',
17:   resolveInjectionMode: '.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs',
18: };
```

Example current source-path entries:

```js
40:     commandPath: '.opencode/commands/deep/ai-council.md',
...
44:     modeSkillPath: '.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md',
...
55:       SHARED_SOURCES.modeRegistry,
56:       SHARED_SOURCES.hubSkill,
57:       '.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md',
```

```js
270:     modeSkillPath: '.opencode/skills/system-deep-loop/deep-research/SKILL.md',
...
279:       SHARED_SOURCES.modeRegistry,
280:       SHARED_SOURCES.hubSkill,
281:       '.opencode/skills/system-deep-loop/deep-research/SKILL.md',
```

**Hardcoded manifests/allowlists**

`compile-command-contracts.cjs` has several path manifests and allowlists: `SHARED_SOURCES`, `REFS`, `COMMANDS[*].sourcePaths`, `writeBoundary.allowed/readOnly/banned`, and `tools.allowed`.

```js
20: const REFS = {
21:   dispatchReceipt: {
22:     writer: '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts',
23:     validator: '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts',
```

```js
555:     '## writeBoundary',
...
560:     'allowed:',
561:     renderYamlList(definition.writeBoundary.allowed, '  '),
562:     'readOnly:',
563:     renderYamlList(definition.writeBoundary.readOnly, '  '),
```

```js
596:     '## tools',
...
600:     'allowed:',
601:     renderYamlList(definition.tools.allowed, '  '),
```

**Cross-file dependencies**

The live `/deep` command markdown invokes the renderer at the new path:

```md
9: !`node .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs --command deep/research -- '$ARGUMENTS'`
```

```md
9: !`node .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs --command deep/review -- '$ARGUMENTS'`
```

```md
10: !`node .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs --command deep/ai-council -- '$ARGUMENTS'`
```

Tests import the scripts by relative path:

```ts
9: const compiler = require('../../scripts/compile-command-contracts.cjs') as {
```

```ts
22: const renderer = require('../../scripts/render-command-contract.cjs') as {
```

The drift checker imports the compiler and has its own current-source allowlist:

```js
10: const compiler = require('./compile-command-contracts.cjs');
...
38: const SHARED_AUTHORITY_SOURCES = [
39:   '.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md',
40:   '.opencode/skills/system-deep-loop/mode-registry.json',
41:   '.opencode/skills/system-deep-loop/SKILL.md',
42:   '.opencode/skills/system-deep-loop/shared/rollout/resolve-injection-mode.cjs',
43: ];
```

**Newly discovered same-area old references**

Generated compiled contracts are stale even though the compiler is current. Example:

```md
1: <!-- GENERATED_COMMAND_CONTRACT_HEADER_START
...
6:   "generatedBy": ".opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs",
...
34:       "path": ".opencode/skills/deep-loop-workflows/mode-registry.json",
39:       "path": ".opencode/skills/deep-loop-workflows/SKILL.md",
44:       "path": ".opencode/skills/deep-loop-workflows/deep-research/SKILL.md",
```

The same generated-header/sourceDigest pattern appears in `deep_ai-council.contract.md` and `deep_review.contract.md`.

## Site 7

**Files found**

`.opencode/hooks/pre-commit`

`.github/workflows/agent-mirror-sync.yml`

No old-name hit was found in `.git/hooks`; only sample hooks are present there.

**Pre-commit excerpt**

```bash
36: # Agent mirror-sync gate (independent of comment hygiene)
37: # Agents are authored in .opencode/agents/ and mirrored to .claude.
38: # Block a commit that desyncs the mirrors. Only STAGED agent files are checked,
39: # so commits that touch no agents are never affected by this gate.
40: MIRROR_CHECKER="$REPO_ROOT/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/check-agent-mirror-sync.cjs"
...
45: done < <(git diff --cached --name-only --diff-filter=ACMD | grep -E '^\.(opencode|claude)/agents/' || true)
...
48:   if ! command -v node >/dev/null 2>&1 || [[ ! -f "$MIRROR_CHECKER" ]]; then
49:     echo "WARNING: node or agent mirror-sync checker unavailable — skipping mirror gate" >&2
50:   elif ! node "$MIRROR_CHECKER" "${STAGED_AGENTS[@]}"; then
```

**GitHub Actions excerpt**

```yaml
14:       - name: Check changed agent files for mirror drift
15:         run: |
16:           set -euo pipefail
17:           CHECKER=".opencode/skills/deep-loop-workflows/deep-improvement/scripts/check-agent-mirror-sync.cjs"
18:           # Fail closed in CI: a required guard must exist. A PR that deletes or
19:           # moves the checker must not silently disable its own gate.
20:           if [ ! -f "$CHECKER" ]; then
21:             echo "::error::Agent mirror-sync checker not found at $CHECKER — failing closed."
22:             exit 1
...
29:           done < <(git diff --name-only --diff-filter=ACMD "$BASE" "$HEAD" | grep -E '^\.(opencode|claude|codex)/agents/' || true)
...
34:           if ! node "$CHECKER" "${CHANGED[@]}"; then
```

**Confirmed/refuted matched-pair claim**

Confirmed: both files hardcode the same old checker path and must change together to avoid local/CI drift.

Important nuance: they are not semantically identical. Local hook fails open when Node/checker is unavailable and filters only `.opencode|.claude`; CI fails closed when checker is missing and filters `.opencode|.claude|.codex`.

**Other related hit**

`.opencode/hooks/README.md` documents the same stale checker path:

```md
48:         ├─ Gate B · agent mirror-sync (only when agent files are staged)
...
52:         │    └─ else run .opencode/skills/deep-loop-workflows/deep-improvement/scripts/check-agent-mirror-sync.cjs
```

## GAPS FOUND

- The plan paths for sites 2 and 3 are stale: live files are under `lib/scorer/aliases.ts` and `lib/scorer/lanes/explicit.ts`, not `lib/routing/...`.

- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` was missed as a direct hardcoded registry/hash dependency:

```ts
26: const registryPath = resolve(repoRoot, '.opencode/skills/deep-loop-workflows/mode-registry.json');
...
75:   const canonical = JSON.stringify({
76:     skill: 'deep-loop-workflows',
```

- Generated compiled contracts were missed and still embed old `deep-loop-runtime` and `deep-loop-workflows` paths, even though the compiler scripts now use `system-deep-loop`.

- Active agent prompts and mirrors were missed. Example `.opencode/agents/orchestrate.md`:

```md
185: ├─ Deep Route: [for deep routes only: mode=<workflowMode>; target_agent=@<agent>; execution=<single_iteration|loop|session>; source_of_truth=.opencode/skills/deep-loop-workflows/mode-registry.json | none]
206: **`Deep Route:` resolution rule ... `.opencode/skills/deep-loop-workflows/mode-registry.json` ...
```

- Active `/deep` command assets were missed; they contain many executable old paths. Example:

```yaml
40:   skill: deep-loop-workflows
41:   skill_md: .opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md
47:     session_state: .opencode/skills/deep-loop-runtime/lib/council/session-state-hierarchy.cjs
```

- `.gitignore` was missed and still ignores runtime DB files under the old runtime path:

```gitignore
166: # Database: deep-loop-runtime
168: .opencode/skills/deep-loop-runtime/database/*.sqlite
169: .opencode/skills/deep-loop-runtime/database/*.sqlite-shm
170: .opencode/skills/deep-loop-runtime/database/*.sqlite-wal
171: .opencode/skills/deep-loop-runtime/database/*.sqlite.bak*
```

- `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` must change with `mk-deep-loop-guard.js`; it creates and deletes the old fixture registry path.

- `.opencode/hooks/README.md` must change with the hook/workflow pair; otherwise documentation continues to point at the old checker path.
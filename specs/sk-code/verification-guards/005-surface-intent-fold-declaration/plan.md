---
title: "Implementation Plan: Let a hub declare that a surface folds its child intents into one hub intent so the router sync check accepts it"
description: "Add one reader for an optional surfaceIntentFolds key to the sk-code router sync guard and apply the folds in leg 2. Two test cases prove a declared fold passes and a missing folded path is reported, and the live guard stays at 5 of 5."
trigger_phrases:
  - "surface intent fold declaration plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Let a hub declare that a surface folds its child intents into one hub intent so the router sync check accepts it

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS |
| **Framework** | None |
| **Storage** | None. The fold is read from the hub's `hub-router.json` |
| **Testing** | `node --test` |

### Overview
`verify-router-sync.cjs` gains a `surfaceIntentFolds` function that reads the optional key from `hub-router.json` and validates each entry, and `legSurfaceMap` puts each folded surface's whole path set under its declared hub intent. Two cases in `verify-router-sync.test.cjs` prove the fold passes when complete and reports a missing path when not. The live guard still prints `router-sync: 5/5 checks passed`, because Skilled's own hub declares no fold.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` and exits 0 before any edit
- [ ] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` reports 13 tests and `fail 0` before any edit
- [ ] `node --test .skilled/bin/tests/` reports 180 tests and `fail 0` before any edit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` reports 15 tests and `fail 0`, the guard prints `router-sync: 5/5 checks passed` with exit 0, and `node --test .skilled/bin/tests/` reports 180 tests and `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declared intent fold

### Key Components
- **`surfaceIntentFolds` in `verify-router-sync.cjs`**: reads and validates the declaration. Without it leg 2 has no way to learn that a host folded a surface, and every child path of that surface is reported.
- **The fold branch in `legSurfaceMap`**: compares a folded surface's paths with one hub intent and keeps its intent keys out of the walk. Without it the declaration is read and changes nothing.

### Data Flow
`legSurfaceMap` reads the parent map through `lib.loadSurfaceRouter` and each surface child map through `readSkillRouter`. It now asks `surfaceIntentFolds` which surfaces are folded. A folded surface's paths, from `declaredBy`, join the union of its hub intent, and only unfolded surfaces add intent keys and per-intent paths. The parent side is unchanged, so a parent path that is in no union still reaches the `which no surface child owns` and `outside the parent tier` branches.

### Reader audit of `hub-router.json`

Each reader below was read for how it treats an unknown top-level key. None rejects one, so no compiler, served copy or activation manifest changes and `node .skilled/bin/compiled-route-sync.cjs` has nothing to rebuild. `A` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program`. `S` is `.skilled/bin/lib/compiled-routing`.

| Reader | file:line | Treatment of the new key |
|--------|-----------|--------------------------|
| Router sync guard | `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:76-97` | `surfaceSignalProblems` reads `routerPolicy.tieBreak` and `routerSignals` only, at lines 86-87 |
| Replay library | `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:135-160`, `:328-331`, `:447-456` | `projectHubRouter` reads `routerSignals` and `vocabularyClasses`, telemetry reads `routerPolicy`, the parse fallback calls `projectHubRouter`. Unknown keys are ignored |
| sk-code compiler, authored | `A/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:408-427` | `assertSourceIdentity` compares the canonical parsed bytes with the parsed object. Both carry the key, so they match |
| sk-code compiler, authored | `A/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:457-489` | `compileRegistry` reads named fields only. `sourceDigests` at line 399 hashes every source file, line 476 puts the hashes in `provenancePolicy.sourceHashes` and line 488 hashes the body into `basePolicyHash` |
| sk-design compiler, authored | `A/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs:328-352`, `:467`, `:481` | Same identity check and same source-hash path as sk-code |
| mcp-tooling compiler, authored | `A/009-parent-hub-rollout/003-mcp-tooling/lib/registry-compiler.cjs:238-244`, `:367` | Parses its own `hub-router.json` and reads named fields. Source hashes enter `provenancePolicy` |
| Served compilers | `S/009-parent-hub-rollout/{001-sk-code,003-mcp-tooling,009-sk-design}/lib/registry-compiler.cjs` | `cmp` against the authored files prints nothing, and `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` |
| sk-code snapshot harness | `A/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:79-98` | Reads the bytes and passes the parsed object on. No key check |
| sk-code canary validator | `A/009-parent-hub-rollout/001-sk-code/harness/validate-canary.cjs:204-210`, `:767-777` | Reads the bytes for a drift fixture. No key check and no pinned hash of the sk-code file |
| Activation manifest | `.skilled/bin/lib/compiled-route-manifest.cjs:476-504` | `loadCanonicalRouterInputs` parses the bytes and checks `hubRouter.skill` only |
| Doctor hub check | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1088-1108` | Compares `routerSignals` keys with the registry. Other top-level keys are not read |
| Root metadata check | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:564-572` | Its unknown-key check is for `graph-metadata.json`, not `hub-router.json` |
| Skill class contract | `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:70` | Uses `hub-router.json` as a discriminator by existence only |
| JSON schemas | `A/003-contract-schemas/schemas/*.json` | Strict, but they describe compiled artifacts. `rg -c "routerSignals\|tieBreak\|hub-router"` over them prints nothing |

Known effect, measured. Adding the key changes the file's bytes, and the sk-code compiler hashes those bytes into the policy, so a host hub that declares a fold gets a new `effectivePolicyHash` and a stale sk-code activation manifest until it refreshes it. A newline added to `SKILL.md` has the same effect, which is why the doc edit goes to `README.md` and not to the `SKILL.md` terms list. Skilled's own `hub-router.json` and `SKILL.md` do not change, so Skilled's hash stays.

```text
$ node specs/sk-code/verification-guards/005-surface-intent-fold-declaration/scratch/policy-hash-probe.cjs "$PWD"
live 5bdf768e5ef6e2799ea8ad6b5312b52218e90e338873bdfa467433ae699261e4
same 5bdf768e5ef6e2799ea8ad6b5312b52218e90e338873bdfa467433ae699261e4
router+fold f8b640c9dfed1b4a8d771f403b318982a27252214bee54b71e57a3689702cf2b
skill+nl 03087deaf5af33b670437e3c5046b435000e6e56613e747905c5d8d6c3dc79da
```

The probe compiles the sk-code policy from the live bytes, then with `surfaceIntentFolds` added to the router bytes, then with a newline added to `SKILL.md`. The compiler accepts the key and only the hash moves.

### The edits

Edit 1. In `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`, replace

```js
    if (!Object.prototype.hasOwnProperty.call(signals, key)) problems.push(`surface ${key} has no hub-router.json routerSignals entry`);
  }
}
```

with

```js
    if (!Object.prototype.hasOwnProperty.call(signals, key)) problems.push(`surface ${key} has no hub-router.json routerSignals entry`);
  }
}

// A host hub may fold every intent of one surface into a single parent intent, declared in
// hub-router.json as surfaceIntentFolds, keyed by surface packet. Leg 2 then compares the whole
// path set of that surface with the one parent intent. A declaration that names no registered
// surface or no parent intent is reported and not applied, so a fold never empties the check.
function surfaceIntentFolds(problems, parentMap) {
  const folds = new Map();
  let hub = null;
  try {
    hub = JSON.parse(fs.readFileSync(path.join(SKCODE, 'hub-router.json'), 'utf8'));
  } catch {
    return folds;
  }
  const declared = hub && typeof hub === 'object' ? hub.surfaceIntentFolds : undefined;
  if (declared === undefined) return folds;
  if (!declared || typeof declared !== 'object' || Array.isArray(declared)) {
    problems.push('hub-router.json surfaceIntentFolds must map a surface packet to one parent map intent');
    return folds;
  }
  for (const [surface, intent] of Object.entries(declared)) {
    if (!SURFACE_PACKETS.has(surface)) {
      problems.push(`surfaceIntentFolds names ${surface}, which is not a registered surface packet on disk`);
    } else if (typeof intent !== 'string' || !Object.prototype.hasOwnProperty.call(parentMap, intent)) {
      problems.push(`surfaceIntentFolds maps ${surface} to ${intent}, which is not a parent map intent`);
    } else {
      folds.set(surface, intent);
    }
  }
  return folds;
}
```

A missing or unparseable file returns no folds. `surfaceSignalProblems` already reports invalid JSON, so it is not reported twice.

Edit 2. In the same file, in `legSurfaceMap`, replace

```js
  const intents = new Set([...Object.keys(parentMap), ...SURFACES.flatMap((s) => Object.keys(children[s]))]);
  for (const it of intents) {
    const union = new Set();
    for (const s of SURFACES) for (const p of children[s][it] || []) union.add(`${s}/${norm(p)}`);
    const parentPaths = new Set((parentMap[it] || []).map(norm));
    const childOwnsIntent = SURFACES.some((s) => children[s][it]);
```

with

```js
  // A folded surface joins the union of its declared parent intent as one path set, so its own
  // intent keys never enter the per-intent walk.
  const folds = surfaceIntentFolds(problems, parentMap);
  const unfolded = SURFACES.filter((s) => !folds.has(s));
  const intents = new Set([...Object.keys(parentMap), ...unfolded.flatMap((s) => Object.keys(children[s]))]);
  for (const it of intents) {
    const union = new Set();
    for (const s of unfolded) for (const p of children[s][it] || []) union.add(`${s}/${norm(p)}`);
    for (const [s, hubIntent] of folds) if (hubIntent === it) for (const p of declaredBy(s)) union.add(p);
    const parentPaths = new Set((parentMap[it] || []).map(norm));
    const childOwnsIntent = unfolded.some((s) => children[s][it]);
```

With no declaration `folds` is empty, so `unfolded` equals `SURFACES` and the walk is the one that runs today. `declaredBy` is already defined above this block and returns `<surface>/<path>` strings, so a missing folded path prints `parent map <HUB_INTENT> is missing child path <surface>/<path>`.

Edit 3. In `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`, replace

```js
function writeSurfaceRouting(hub, surfaces) {
  write(path.join(hub, 'mode-registry.json'), JSON.stringify({
    modes: surfaces.map((surface) => ({ workflowMode: surface, packetKind: 'surface', packet: surface })),
  }));
  write(path.join(hub, 'hub-router.json'), JSON.stringify({
    routerPolicy: { tieBreak: surfaces },
    routerSignals: Object.fromEntries(surfaces.map((surface) => [surface, { weight: 4, classes: [] }])),
  }));
}
```

with

```js
function writeSurfaceRouting(hub, surfaces, extra = {}) {
  write(path.join(hub, 'mode-registry.json'), JSON.stringify({
    modes: surfaces.map((surface) => ({ workflowMode: surface, packetKind: 'surface', packet: surface })),
  }));
  write(path.join(hub, 'hub-router.json'), JSON.stringify({
    routerPolicy: { tieBreak: surfaces },
    routerSignals: Object.fromEntries(surfaces.map((surface) => [surface, { weight: 4, classes: [] }])),
    ...extra,
  }));
}
```

The existing callers pass two arguments and get the same file as today.

Edit 4. In the same test file, replace

```js
test('leg 3 skips archived gold for a mode the manifest no longer declares', (t) => {
```

with

```js
// A host hub that folds a surface's intents into one parent intent declares the fold in
// hub-router.json. The surface child here carries two intents and the parent map one.
function buildFoldHub(t, parentPaths) {
  const { hub, guard } = buildHub(t);
  write(path.join(hub, 'sk-code-demo', 'SKILL.md'), [
    'RESOURCE_MAP = {',
    '  "URL": ["references/routed.md"],',
    '  "FORMS": ["references/forms.md"],',
    '}',
    '',
  ].join('\n'));
  write(path.join(hub, 'sk-code-demo', 'references', 'forms.md'), '# forms\n');
  const cited = [...parentPaths, 'shared/references/control.md'].map((p) => `"${p}"`).join(', ');
  write(path.join(hub, 'ROUTER.md'), [
    'DEFAULT_RESOURCE = [',
    ']',
    'RESOURCE_MAP = {',
    `  "DEMO": [${cited}],`,
    '}',
    'SHARED_CONTROL_RESOURCES = [',
    '    "shared/references/control.md",',
    ']',
    '',
  ].join('\n'));
  return { hub, guard };
}

test('leg 2 accepts a declared fold whose parent intent holds every child path', (t) => {
  const { hub, guard } = buildFoldHub(t, ['sk-code-demo/references/routed.md', 'sk-code-demo/references/forms.md']);
  writeSurfaceRouting(hub, ['sk-code-demo']);
  const unfolded = runGuard(guard, ['--checks', '2']);
  assert.equal(unfolded.status, 1, unfolded.out);
  assert.match(unfolded.out, /parent map URL is missing child path sk-code-demo\/references\/routed\.md/);
  writeSurfaceRouting(hub, ['sk-code-demo'], { surfaceIntentFolds: { 'sk-code-demo': 'DEMO' } });
  const { status, out } = runGuard(guard, ['--checks', '2']);
  assert.equal(status, 0, out);
  assert.match(out, /PASS check 2/);
});

test('leg 2 reports a folded child path the declared parent intent omits', (t) => {
  const { hub, guard } = buildFoldHub(t, ['sk-code-demo/references/routed.md']);
  writeSurfaceRouting(hub, ['sk-code-demo'], { surfaceIntentFolds: { 'sk-code-demo': 'DEMO' } });
  const { status, out } = runGuard(guard, ['--checks', '2']);
  assert.equal(status, 1, out);
  assert.match(out, /parent map DEMO is missing child path sk-code-demo\/references\/forms\.md/);
  assert.doesNotMatch(out, /parent map (URL|FORMS)/);
});

test('leg 3 skips archived gold for a mode the manifest no longer declares', (t) => {
```

The file already fakes a hub cheaply. `buildHub` copies the guard and its two libraries into a temporary `.skilled/skills/sk-code` tree, and the guard resolves the hub from its own location. The first case runs the same hub once without the declaration, so it proves the fold is what makes leg 2 pass.

Edit 5. In `.skilled/skills/sk-code/README.md`, replace

```markdown
| [`hub-router.json`](./hub-router.json) | Hub-local routing vocabulary and mode signals |
```

with

```markdown
| [`hub-router.json`](./hub-router.json) | Hub-local routing vocabulary and mode signals, plus an optional `surfaceIntentFolds` map, keyed by surface packet, that lets a host hub fold all intents of a surface into one parent intent for the router sync check |
```
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the guard, test file and bin test baselines. Implementation applies edits 3 and 4 first, then edits 1, 2 and 5. Verification reruns the test file, the live guard, the bin tests and the sk-code manifest freshness.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` runs once after edits 3 and 4 and before edits 1 and 2. Both new cases must fail there, so they are known to detect the fault. After edits 1 and 2 it reports 15 tests and `fail 0`. `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` must still print `router-sync: 5/5 checks passed` and exit 0, and `node --test .skilled/bin/tests/` must report 180 tests and `fail 0`, against a baseline of 180 tests, 179 passed and 1 skipped. These three runs were made against a copy of the edited files in a scratch tree before this plan was written, with the results stated here.

The two invalid-declaration branches have no test case, per the coverage floor. They were run once by hand on a scratch copy of the hub with `{"sk-code-nope":"X","sk-code-ci":"NOT_AN_INTENT"}`, which printed both problem lines and `router-sync: 0/1 checks passed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node and its built-in test runner. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the live guard prints anything other than `router-sync: 5/5 checks passed`, or a test that passed in the baseline fails. Before the commit, restore the three files with `git checkout -- <file>`. After the commit, revert the one commit.
<!-- /ANCHOR:rollback -->

---

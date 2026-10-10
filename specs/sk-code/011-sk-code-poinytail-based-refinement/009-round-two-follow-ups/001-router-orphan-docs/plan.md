---
title: "Implementation Plan: Phase 1: router-orphan-docs"
description: "Make router check 1b a default leg by allowlisting the three shared workflow docs by exact path, routing the six Obsidian references under existing intents, dropping the opt-in set, passing 1b from the umbrella, and covering the check with a node test that runs against a throwaway hub."
trigger_phrases:
  - "router orphan docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: router-orphan-docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS, Node.js), bash, Markdown skill docs |
| **Framework** | None. The test uses `node:test`, `node:assert/strict`, `node:fs`, `node:os` and `node:child_process` |
| **Storage** | None |
| **Testing** | `node --test` on the new file, the guard itself, `run-all-drift-guards.sh`, a routing replay and a reach probe |

### Overview
`verify_router_sync.cjs` holds leg 1b back with `OPT_IN_LEGS` because nine docs have no router naming them. This plan clears the nine and then removes the hold. The three canonical `shared/references/workflow-*.md` docs go on the allowlist by exact path, because the surfaces reach them through symlinks that no router lists. The six Obsidian references go into the existing `STACK_STANDARDS`, `VERIFICATION` and `CODE_QUALITY` intents. Leg 1b then runs in a bare run and in the umbrella, a new `node:test` file proves it passes for the symlinked docs and fails for a stray one, and every doc that called it opt-in is rewritten.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place edits to an existing CLI guard, one skill router and its docs, plus one new test file.

### Key Components
- **Allowlist in `legOrphans`**: `NON_ROUTED_ALLOWLIST` (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs:22`) gains the three workflow paths, written as exact `shared/references/workflow-*.md` strings. A comment above the set gives the reason, which is that each surface carries a symlink to the canonical copy and the acting agent reads the doctrine from the surface, so no router names either path. Exact paths, not a folder, keep any other unrouted doc under `shared/` reported.
- **Opt-in removal**: the `OPT_IN_LEGS` comment and constant (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs:276-279`) go away, and `parseChecks` (`:282`) returns every leg id when no `--checks` is given. The set becomes empty, so the set and its filter are both removed, as the brief asked.
- **Obsidian router**: section 2b of `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` (`INTENT_SIGNALS` at lines 84-90, `RESOURCE_MAP` at lines 92-132) gains six map entries and seven keywords. No intent key is added, because every doc fits an existing one. The four `OBSIDIAN_PLUGIN` paths that the hub `ROUTER.md` needs for leg 2 stay in the map.
- **Umbrella**: `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:51-52` passes `--checks 1a,1b,2,3,4`, and the header line (`:12`) and the note below the call (`:54-61`) stop saying a leg is skipped.
- **Test**: `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` is new. It copies the guard, its replay library and the leaf contract library into a throwaway hub under the OS temp directory, writes a hub `SKILL.md` and a packet `SKILL.md` that each route one reference, adds a real canonical workflow doc and a symlink to it from the packet, and runs the copied guard. Each test removes the hub in `t.after`. It lives under `scripts/tests/` because the universal style guide says a test never sits beside its source, and that folder is not a leaf root, so the leaf manifest does not move.
- **Playbook**: the Obsidian playbook text that calls `accessibility.md` unmapped is rewritten in three files, and OB-H06 keeps its purpose. It stays a keyword-blind probe, and its `expected_intent` becomes `STACK_STANDARDS`, the way OB-H01 to OB-H05 name their target intent.
- **Docs and versions**: seven docs that call leg 1b opt-in or not run are corrected. The Obsidian and OpenCode `SKILL.md` files bump to 0.1.2.0 and 1.1.1.0 with one changelog entry each, per the skill contract.
- **Manifests**: the sk-code policy hash is computed from the hub `SKILL.md`, `hub-router.json` and `mode-registry.json` only. The guard stayed `fresh` at plan time while a sibling packet `SKILL.md` was modified, so no re-mint is expected. The tasks check first and re-mint only on a stale report.

### Data Flow
`legOrphans` (`.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs:125-147`) walks `references/` and `assets/` under every hub packet with `walkMarkdown` (`:63-73`). That walk keeps an entry only when `Dirent.isFile()` is true, and a symlink is not a file there, so the nine reported docs include the three canonical copies and never a symlink. Each walked path is compared with the machine router paths plus every packet's `DEFAULT_RESOURCE` and `RESOURCE_MAP`, prefixed with the packet name. After this fix the three canonical copies are skipped by the allowlist and the six Obsidian docs are found in the Obsidian map as `sk-code-obsidian/references/...`, so the problem list is empty. Routing itself is keyword-substring scoring in `router_replay_lib.cjs`, so a new keyword can change which intents a prompt selects. That is why the replay compares the intents of all 27 playbook scenarios before and after.

### Why an allowlist and not realpath matching
The brief proposed matching a doc as routed when a routed path resolves to the same real file, on the premise that each surface routes its symlink. Reading the check and the routers shows the premise does not hold.
- A dump of all 204 routed entries (every packet `RESOURCE_MAP` and `DEFAULT_RESOURCE`, the hub `ROUTER.md` paths and `hub-router.json`), resolved with `fs.realpathSync` against the hub and each packet root, produced no hit on `shared/references/workflow-*.md`.
- `rg 'workflow-(implement|debug|verify)\.md'` over the maps, `ROUTER.md` and `hub-router.json` finds nothing. The only mentions are prose: `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62`, and `.skilled/skills/sk-code/SKILL.md:40` and `:194`, which says the doctrine is "symlinked into each surface".
- `walkMarkdown` never visits the nine git-tracked symlinks (mode 120000), which is why the check reports nine problems and not twelve.

So realpath matching would change nothing, and it would add code with the same blind spot. The brief allowed the allowlist as the fallback with a reason that names the symlinks, and that is what A below does. Routing the three docs in each surface map is the alternative that would let leg 1b see them. It changes what three surfaces load, so it is left as an operator decision.

### Where each of the six docs goes

| Doc | Intent | Why that intent | New keyword |
|-----|--------|-----------------|-------------|
| `references/accessibility.md` | `STACK_STANDARDS` | What the accessibility suite proves for the plugin UI, beside `platform-support.md` | `accessibility` |
| `references/theme-variables.md` | `STACK_STANDARDS` | The host CSS variables `styles.css` consumes, beside `stylesheet-ownership.md` | `theme variable` |
| `references/setup/setup.md` | `VERIFICATION` | Install, build and run the other gates locally, and `release-verification.md` already points to it | `plugin setup`, `install the plugin` |
| `references/operations/operations.md` | `VERIFICATION` | Settings migration and the routine verification section | `settings migration` |
| `references/quality/doc-quality-gate.md` | `CODE_QUALITY` | The DQI scorer gate for files this packet ships, matching the `quality gate` keyword | `dqi` |
| `references/skill-reference-integrity.md` | `VERIFICATION` | A drift guard command with a "running it" section | `reference integrity` |

Added resources per route: `STACK_STANDARDS` 2, `VERIFICATION` 3 and `CODE_QUALITY` 1. No keyword comes from the OB-H06 prompt.

### Intermediate states a builder should see
- After the test is created and before any guard edit: 3 of 3 tests fail.
- After the guard edits only: `--checks 1b` fails with 6 problems, all under `sk-code-obsidian/references/`.
- After the Obsidian edits: a bare run passes 5 of 5, and the probe prints six `OK` lines.
- After the umbrella and README edits: the stale-wording search prints nothing.

### Proposed text A: the allowlist (replaces `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` line 22)

```js
// The shared workflow doctrine has one canonical copy per phase. Each surface packet carries
// a symlink to it under references/, and the acting agent reads the doctrine from the surface,
// so no router names the canonical path or the symlink. Exact paths, not a folder, keep any
// other unrouted doc under shared/ reported.
const NON_ROUTED_ALLOWLIST = new Set([
  'ROUTER.md',
  'references/stack-detection.md',
  'references/phase-detection.md',
  'shared/references/workflow-implement.md',
  'shared/references/workflow-debug.md',
  'shared/references/workflow-verify.md',
]);
```

### Proposed text B: the test file (`.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs`, new)

```js
// ───────────────────────────────────────────────────────────────────
// MODULE: Router-sync guard, orphan-doc check tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives leg 1b of verify_router_sync.cjs against a throwaway hub, so the orphan check can be
// made to pass and to fail without touching the live tree.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SCRIPTS = path.resolve(__dirname, '..', '..', 'assets', 'scripts');
const LIVE_SKILLS = path.resolve(__dirname, '..', '..', '..', '..');
const CONTRACT = path.join('sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs');

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

// The guard resolves the hub from its own location, so it runs from a copy placed where a real
// one would sit. The hub has one packet whose router names one reference, plus a canonical
// workflow doc that the packet reaches through a symlink and no router names.
function buildHub(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'router-sync-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const skills = path.join(root, 'skills');
  const hub = path.join(skills, 'sk-code');
  const scripts = path.join(hub, 'sk-code-opencode', 'assets', 'scripts');
  fs.mkdirSync(scripts, { recursive: true });
  for (const name of ['verify_router_sync.cjs', 'router_replay_lib.cjs']) {
    fs.copyFileSync(path.join(SCRIPTS, name), path.join(scripts, name));
  }
  write(path.join(skills, CONTRACT), fs.readFileSync(path.join(LIVE_SKILLS, CONTRACT), 'utf8'));
  write(path.join(hub, 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["sk-code-demo/references/routed.md"],\n}\n');
  write(path.join(hub, 'sk-code-demo', 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["references/routed.md"],\n}\n');
  write(path.join(hub, 'sk-code-demo', 'references', 'routed.md'), '# routed\n');
  write(path.join(hub, 'shared', 'references', 'workflow-debug.md'), '# canonical workflow doc\n');
  fs.symlinkSync(
    path.join('..', '..', 'shared', 'references', 'workflow-debug.md'),
    path.join(hub, 'sk-code-demo', 'references', 'workflow-debug.md'),
  );
  return { hub, guard: path.join(scripts, 'verify_router_sync.cjs') };
}

function runGuard(guard, args) {
  const run = spawnSync(process.execPath, [guard, ...args], { encoding: 'utf8' });
  return { status: run.status, out: run.stdout };
}

test('a canonical workflow doc reached through a surface symlink is not reported', (t) => {
  const { guard } = buildHub(t);
  const { status, out } = runGuard(guard, ['--checks', '1b']);
  assert.equal(status, 0, out);
  assert.match(out, /PASS check 1b/);
  assert.doesNotMatch(out, /workflow-debug/);
});

test('an unrouted doc is still reported, in the shared tier and in a packet', (t) => {
  const { hub, guard } = buildHub(t);
  write(path.join(hub, 'shared', 'references', 'stray.md'), '# stray\n');
  write(path.join(hub, 'sk-code-demo', 'references', 'stray-local.md'), '# stray local\n');
  const { status, out } = runGuard(guard, ['--checks', '1b']);
  assert.equal(status, 1, out);
  assert.match(out, /FAIL check 1b/);
  assert.match(out, /orphan \(routable doc no router names\): shared\/references\/stray\.md/);
  assert.match(out, /orphan \(routable doc no router names\): sk-code-demo\/references\/stray-local\.md/);
  assert.doesNotMatch(out, /workflow-debug/);
});

test('a run without --checks includes leg 1b', (t) => {
  const { guard } = buildHub(t);
  const { out } = runGuard(guard, []);
  assert.match(out, /check 1b:/);
});
```

### Proposed text C: the note under the router-sync call (replaces `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` lines 54 to 61)

```sh
# Router-sync guard (verify_router_sync.cjs): restores the four checks of the router-sync
# suite that was deleted with the skill-benchmark lane. This run covers every leg: 1a and 1b
# (router paths exist, and every reference or asset doc is routed), 2, 3 and 4. Check 1b
# allowlists only the shared workflow docs that each surface reaches through a symlink, with
# the reason beside the list in the guard. Dead paths in check 1 are also covered by the
# alignment-drift guard above (--check-router). The CI workflow
# .github/workflows/routing-registry-drift.yml still covers the compiled side of checks 3
# and 4 in warn-only mode.
```

### Proposed text D: the routing replay (`specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/scratch/replay-scenarios.cjs`, new)

It prints one line per Obsidian playbook scenario, which is its sorted intents and its resource count. Plan-time output has 27 lines, for example `OB-001 intents=IMPLEMENTATION+STACK_STANDARDS resources=11` and `OB-H06 intents=none resources=2`. After the edits only the `resources=` numbers rise.

````js
'use strict';
// Prints one line per Obsidian playbook scenario: its routed intents and resource count.
// Run from the repository root.
const fs = require('node:fs');
const path = require('node:path');
const lib = require(path.resolve('.skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs'));
const root = path.resolve('.skilled/skills/sk-code/sk-code-obsidian');
const rows = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!entry.name.endsWith('.md') || entry.name === 'manual-testing-playbook.md') continue;
    const text = fs.readFileSync(file, 'utf8');
    const id = /^id:\s*(\S+)/m.exec(text);
    const fence = /```text\n([\s\S]*?)\n```/.exec(text);
    const inline = /^-\s*Prompt:\s*`([^`]+)`/m.exec(text);
    const prompt = (fence ? fence[1] : inline ? inline[1] : '').trim();
    if (!id || !prompt) continue;
    const routed = lib.routeSkillResources({ skillRoot: root, taskText: prompt });
    rows.push(`${id[1]} intents=${routed.intents.slice().sort().join('+') || 'none'} resources=${routed.resources.length}`);
  }
}(path.join(root, 'manual-testing-playbook')));
console.log(rows.sort().join('\n'));
````

### Proposed text E: the OB-019 scenario (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`)

**E1** replaces lines 35 to 37, three lines that hold two em dashes:

```text
evidence set. It resolves thirteen reference files spanning every intent this surface declares,
including `accessibility.md`, which the `STACK_STANDARDS` group carries. That establishes the
top tier above `OB-017`'s one-resource floor and `OB-018`'s three-resource median.
```

**E2** replaces the one line at 53 with these two lines:

```text
  `expected_resources`, spanning all five declared intents, with the accessibility reference
  loaded through `STACK_STANDARDS`.
```

**E3** replaces lines 64 to 66, three lines that hold one em dash:

```text
  `expected_resources` resolve under the skill root, including `references/accessibility.md`, which
  `SKILL.md` §2b wires into `STACK_STANDARDS` and the prompt's explicit "accessibility" mention
  selects.
```

### Proposed text F: the playbook honesty note (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`, replaces lines 176 to 181 from the words `OB-H06` documents a second through `simply unmapped.`)

The replacement ends with a line break, so the sentence that starts `Every` begins its own line.

```text
`OB-H06` once recorded a second, distinct kind of drift beyond stale
filenames: `references/accessibility.md`, `references/theme-variables.md`,
`references/operations/operations.md`, `references/setup/setup.md`,
`references/quality/doc-quality-gate.md`, and `references/skill-reference-integrity.md` were real,
shipped files that no intent group in `SKILL.md` §2b carried. §2b now carries all six:
`accessibility.md` and `theme-variables.md` under `STACK_STANDARDS`, `setup/setup.md`,
`operations/operations.md` and `skill-reference-integrity.md` under `VERIFICATION`, and
`quality/doc-quality-gate.md` under `CODE_QUALITY`. Check 1b of `verify_router_sync.cjs` runs by
default and fails when a reference or asset doc is left unrouted again.
```

### Proposed text G: the OB-H06 scenario (`.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md`)

Apply these from the bottom up, G7 first and G1 last, so the original line numbers stay valid. The prompt lines (they hold an em dash) and the frontmatter lines `id`, `category`, `expected_resources` and `version` are not touched.

**G1** replaces lines 4 to 7 of the original file.

```text
title: 'Holdout -- independent probe for a keyword-blind accessibility question'
description: "Holdout scenario OB-H06: an independent, keyword-blind probe authored against no fitted scenario at all, testing whether references/accessibility.md surfaces for a plainly relevant question that avoids the word its STACK_STANDARDS keyword declares."
expected_surface: OBSIDIAN
expected_intent: STACK_STANDARDS
```

**G2** replaces lines 13 to 13 of the original file.

```text
# OB-H06: Independent probe for a keyword-blind accessibility question
```

**G3** replaces lines 21 to 33 of the original file.

```text
Independent generalization probe, distinct in kind from `OB-H01`..`OB-H05`. Those five decontaminate
an existing fitted scenario's wording. This one has no fitted counterpart at all.
`references/accessibility.md` is wired into the `STACK_STANDARDS` group of `SKILL.md` §2b, and that
group selects it on the keyword `accessibility`. The probe asks a plainly relevant question that
never uses that word, so it measures whether the file still surfaces when the declared keyword is
absent.

### Why This Matters

A reference wired to an intent is reachable only through that intent's vocabulary. If a
screen-reader question never reaches `accessibility.md`, the file is present and wired but still
dead evidence for the people most likely to need it. The probe keeps that recall gap visible
instead of letting the keyword hide it.
```

**G4** replaces lines 39 to 43 of the original file.

```text
Operators confirm the exact keyword-blind prompt for `OB-H06` still surfaces
`references/accessibility.md` although it contains no `STACK_STANDARDS` keyword.

- Objective: confirm the exact prompt routes to surface `OBSIDIAN` and the response cites
  `references/accessibility.md`, although the prompt carries no keyword from any of the five
  declared groups.
```

**G5** replaces lines 52 to 62 of the original file.

```text
- Expected execution process: the hub detects `OBSIDIAN`. The prompt matches no literal
  `INTENT_SIGNALS` keyword from any of the five declared groups, because `STACK_STANDARDS` declares
  `accessibility` and the prompt says "screen reader" instead. The underlying concept
  (screen-reader and keyboard-navigation behavior) should still surface `accessibility.md` on
  general relevance grounds, not on a declared keyword match.
- Expected signals: `references/accessibility.md` exists under `sk-code-obsidian/`, sits in the
  `STACK_STANDARDS` list of `SKILL.md` §2b, and is cited in the response.
- Desired user-visible outcome: the bundled workflow states what `accessibility.md` documents about
  screen-reader and keyboard-navigation behavior for the table view, and does not silently fall back
  to `DEFAULT_RESOURCE` alone as if the prompt were a true zero-relevance case like `OB-012`.
- Pass/fail: PASS if `references/accessibility.md` exists, is wired in §2b and is cited; FAIL if the
  path is missing, is not wired, or the response falls back to `DEFAULT_RESOURCE` without citing
  accessibility evidence at all.
```

**G6** replaces lines 74 to 107 of the original file.

```text
This is a prompt-only holdout scenario, scored the same way the other operator scenarios in this
package are, by frontmatter/path agreement plus a live-dispatch citation check, not by a mechanical
command transcript. Its point is whether a wired file is still reachable once the declared keyword
is missing from the question.

### Commands

1. `sed -n '1,14p' .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md`
2. `test -e .skilled/skills/sk-code/sk-code-obsidian/references/accessibility.md && echo "OK references/accessibility.md" || echo "MISS references/accessibility.md"`
3. `sed -n '/^RESOURCE_MAP = {/,/^}/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -c 'references/accessibility.md'`
4. `sed -n '/^INTENT_SIGNALS = {/,/^}/p' .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | grep -c 'screen reader'`

### Expected

Step 1 shows `expected_surface: OBSIDIAN` and `expected_intent: STACK_STANDARDS`. Step 2 prints `OK`. Step
3 prints `1`, confirming `accessibility.md` is wired into the `RESOURCE_MAP`. Step 4 prints `0`,
confirming the prompt's own vocabulary is absent from every `INTENT_SIGNALS` keyword group, which is
what keeps the probe keyword-blind.

### Evidence

Command transcript from steps 1-4; the resolved frontmatter block; the live-dispatch transcript
showing whether `accessibility.md` was cited.

### Pass / Fail

- **Pass**: `references/accessibility.md` exists, step 3 prints `1`, step 4 prints `0`, and a live
  dispatch of the exact prompt cites `accessibility.md`.
- **Fail**: the path is missing, step 3 prints `0`, or a live dispatch falls back to
  `DEFAULT_RESOURCE` alone without citing accessibility evidence for a plainly accessibility-shaped
  question.

### Failure Triage

1. Re-run step 2 and confirm whether `accessibility.md` was renamed or removed under `references/`.
2. If step 3 prints `0`, the file has dropped out of the `STACK_STANDARDS` list in `SKILL.md` §2b.
   Restore the entry. Router check 1b of `verify_router_sync.cjs` fails for the same reason.
3. If step 4 no longer prints `0`, a keyword now matches the prompt and the probe has stopped being
   keyword-blind. Write a new keyword-blind prompt, and move this one into `intent-detection/` under
   `STACK_STANDARDS`.
```

**G7** replaces lines 123 to 124 of the original file.

```text
| [SKILL.md](../../SKILL.md) §2b | The `INTENT_SIGNALS` block whose `STACK_STANDARDS` keywords this probe avoids, and the `RESOURCE_MAP` block that wires `accessibility.md` |
| [SKILL.md](../../SKILL.md) §2 | The `REFERENCE MAP` table, which has no row for `accessibility.md`, so the file is reached through the §2b map instead |
```

### Proposed text H: the changelogs

**H1** is `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.2.0.md`:

```markdown
---
title: "sk-code-obsidian v0.1.2.0, Every Reference Now Has a Route"
description: "Six Obsidian references that no intent group carried are now wired into the surface router, so a question can load them, and the guard that finds unrouted docs now runs by default."
trigger_phrases:
  - "sk-code-obsidian v0.1.2.0"
  - "sk-code-obsidian 0.1.2.0"
  - "obsidian reference routing"
importance_tier: "normal"
contextType: "general"
version: 0.1.2.0
---

# v0.1.2.0, Every Reference Now Has a Route

Six references in the Obsidian packet were real files that no intent group listed, so a question about them could not load them through the router. Each now sits under the intent whose questions it answers, and the drift guard that reports an unrouted doc runs with the rest of the router checks.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs` (Level 1)

## What's New at a Glance

- **Accessibility and theme variables load with the stack standards.** A question that says "accessibility" or "theme variable" now selects `STACK_STANDARDS`, which carries both references.
- **Setup, operations and reference integrity load with verification.** The install and release path, the settings and screenshot operations, and the path-integrity guard now load with `VERIFICATION`.
- **The doc quality gate loads with code quality.** `CODE_QUALITY` now carries `references/quality/doc-quality-gate.md`.
- **Seven new routing keywords.** Each is a phrase from the title or description of the reference it reaches: `dqi`, `plugin setup`, `install the plugin`, `settings migration`, `reference integrity`, `accessibility` and `theme variable`.

## Upgrade

No migration required. A prompt that already selected `STACK_STANDARDS`, `VERIFICATION` or `CODE_QUALITY` now loads up to three more references.
```

**H2** is `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.1.1.0.md`:

```markdown
---
title: "sk-code-opencode v1.1.1.0, The Router Guard Runs Every Check"
description: "The router-sync guard now runs its orphan-doc check by default and the drift-guard umbrella runs it, so a doc that no router names fails the gate."
trigger_phrases:
  - "sk-code-opencode v1.1.1.0"
  - "sk-code-opencode 1.1.1.0"
  - "router sync orphan check"
importance_tier: "normal"
contextType: "general"
version: 1.1.1.0
---

# v1.1.1.0, The Router Guard Runs Every Check

The router-sync guard had one check that stayed off because nine docs had no router naming them. Six are now routed and three shared workflow docs are allowlisted by exact path, so the check passes and runs by default.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs` (Level 1)

## What's New at a Glance

- **Check 1b runs by default.** `verify_router_sync.cjs` no longer treats the orphan-doc check as opt-in, and `scripts/run-all-drift-guards.sh` passes it with the other checks.
- **The three shared workflow docs are allowlisted by exact path.** Each surface reaches them through a symlink, and any other unrouted doc under `shared/` is still reported.
- **The guard has its own test.** `scripts/tests/verify_router_sync.test.cjs` builds a throwaway hub and proves the check stays quiet for a symlinked doc and reports an unrouted one.

## Upgrade

No migration required. A new reference or asset doc now needs a `RESOURCE_MAP` entry in its packet, or `run-all-drift-guards.sh` fails.
```

### Proposed text I: the reach probe (`specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs/scratch/probe-reach.cjs`, new)

It replays one plain-words prompt per new route and prints `OK` or `MISS` with the intents chosen. Plan-time output before the edits is six `MISS` lines, and after the edits six `OK` lines with intents `STACK_STANDARDS`, `STACK_STANDARDS`, `VERIFICATION`, `VERIFICATION`, `CODE_QUALITY` and `VERIFICATION`.

```js
'use strict';
// Replays one prompt per newly routed Obsidian reference and prints OK or MISS for the doc it
// should reach, with the intents the router chose. Run from the repository root.
const path = require('node:path');
const lib = require(path.resolve('.skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs'));
const root = path.resolve('.skilled/skills/sk-code/sk-code-obsidian');
const probes = [
  ['What does the accessibility reference say about the focus ring on the table view?', 'references/accessibility.md'],
  ['Which theme variable should this new rule key off for the sticky header offset?', 'references/theme-variables.md'],
  ['I need plugin setup help: how do I get the dev watcher running?', 'references/setup/setup.md'],
  ['The settings migration with loadData and saveData dropped a field after the upgrade.', 'references/operations/operations.md'],
  ['Run the doc quality gate on this reference file.', 'references/quality/doc-quality-gate.md'],
  ['Run the skill reference integrity scan and tell me why it reports a dead path.', 'references/skill-reference-integrity.md'],
];
for (const [taskText, doc] of probes) {
  const routed = lib.routeSkillResources({ skillRoot: root, taskText });
  console.log(`${routed.resources.includes(doc) ? 'OK' : 'MISS'} ${doc} [${routed.intents.join('+')}]`);
}
```
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **New test**: `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` runs three cases against a throwaway hub. A canonical workflow doc reached through a symlink is not reported. A stray doc in the shared tier and a stray doc in a packet are both reported and the workflow doc still is not. A run without `--checks` includes leg 1b. Plan-time result on a prototype: 3 of 3 pass with the edited guard and 0 of 3 pass with the unedited one.
- **Guard runs**: a bare run prints `router-sync: 5/5 checks passed` on the prototype. Before the fix it prints 4 of 4 and no 1b line, and `--checks 1b` prints 9 problems.
- **Umbrella**: `Errors: 0` and a `Warnings:` count that other files move (252 at plan time). No finding names a file under `.skilled/skills/sk-code/`.
- **Routing replay**: 27 Obsidian scenarios replayed before and after. The intents column is identical for all 27 and no resource count falls. Counts rise, for example OB-001 11 to 13, OB-011 15 to 21, OB-015 19 to 25 and OB-019 12 to 15.
- **Reach probe**: six prompts, one per doc, miss before and reach after.
- **Playbook**: `validate-playbook-package.cjs` prints `violations=0 warnings=0` before and after. The playbook root file is invalid under `validate_document.py` at baseline (2 issues), so only the playbook validator judges it.
- **Alignment lint of the test**: `Scanned files: 1` with 0 findings when git discovery is blocked, since the file is untracked until staged.
- **Compiled and leaf checks**: `compiled-route-guard.cjs` lists sk-code `fresh` and `ci-leaf-manifest-freshness.cjs` prints `failed=0`, both before and after. The hash `a59ec9ff...` and the leaf digest `fab6eb86...` do not move.
- **Not run by the builder**: the Hermes generator in write mode, which is the orchestrator's.
- **Gap**: the full `run-node-tests.mjs` suite is not run here. It covers about 113 files across the repo, and the new file is run directly and shown to be listed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js with `node:test` (v26.8.2 observed), Python 3 for the document validators and ripgrep for the stale-wording search.
- `router_replay_lib.cjs` and `leaf-resource-contract.cjs`, which the guard requires and the test copies into its throwaway hub.
- Sibling children 002 to 005 build in parallel. Child 002 edits `sk-code-quality`, which changes the Hermes drift baseline and may touch the same manifests.
- The T035 steps of the earlier surface-alignment phase, reused as the conditional re-mint.
- Read-only context: the umbrella baseline already carries 252 warnings from other trees, none under this skill.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the ten modified tracked files with `git restore .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh .skilled/skills/sk-code/sk-code-opencode/scripts/README.md .skilled/skills/sk-code/sk-code-opencode/SKILL.md .skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md .skilled/skills/sk-code/benchmark/README.md .skilled/skills/sk-code/sk-code-obsidian/SKILL.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md`. The builder does not run this. It is the way back if the change is rejected.
- Delete the three new paths `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/`, `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.1.1.0.md` and `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.2.0.md`. Nothing else depends on them.
- If a manifest was re-minted, restore `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` the same way and run `node .skilled/bin/compiled-route-guard.cjs` again.
- The Hermes copies are regenerated by the orchestrator, so they follow the restored `SKILL.md` files on the next generator run.
<!-- /ANCHOR:rollback -->

---

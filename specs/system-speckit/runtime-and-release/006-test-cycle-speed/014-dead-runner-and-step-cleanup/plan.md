---
title: "Implementation Plan: Phase 14: dead-runner-and-step-cleanup"
description: "Delete the sharded spec-kit runner and its package.json script, remove every reference from three READMEs, ARCHITECTURE.md and .env.example, and guard the duplicated config-shape step in opencode-dual-version.yml to the v1 matrix entry. Prove it with an empty reference grep, a passing JSON parse and a passing YAML parse that shows one guarded definition over two entries."
trigger_phrases:
  - "dead runner and step cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: dead-runner-and-step-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (one deleted file), JSON, YAML (GitHub Actions), Markdown |
| **Framework** | GitHub Actions, npm scripts, `node:test` battery fixtures |
| **Storage** | None |
| **Testing** | `git grep`, `rg`, `node -e` JSON parse, `python3` with PyYAML |

### Overview
Delete `run-tests-sharded.mjs` and the `test:sharded` script, then remove the twelve documentation lines that mention the runner or its shard variable. Add one step-level guard to `.github/workflows/opencode-dual-version.yml` so the config-shape definition executes in the `v1` matrix entry only. Prove it with an empty `git grep`, a passing package JSON parse and a passing YAML parse that reports one guarded definition over two entries.
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
- [ ] `git grep -n run-tests-sharded -- ':!specs'` prints nothing
- [ ] `node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/system-spec-kit/runtime/package.json','utf8'))"` exits 0 and `scripts.test` is `node scripts/run-tests.mjs`
- [ ] `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/opencode-dual-version.yml'))"` exits 0 with a `v1` guard on the one config-shape definition
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deletion plus one matrix guard.

### Key Components
- **Deleted runner**: `run-tests-sharded.mjs` wraps `run-tests.mjs` in a loop that spawns `SPECKIT_TEST_SHARDS` shards serially (default 12). No workflow, hook or script calls it, so the loop and its `[sharded]` logging have no consumer.
- **Script surface**: `package.json` is the only executable reference. Removing `test:sharded` leaves 17 scripts, and `test` still resolves to `node scripts/run-tests.mjs`.
- **Documentation surface**: three runtime READMEs, `ARCHITECTURE.md` and `.env.example` describe the runner or its `SPECKIT_TEST_SHARDS` variable. Each line is removed so no document points at a deleted entry point.
- **Config-shape step**: one definition at index 3 of 7 in the `battery` job, executed once per matrix entry. The step runs before the install, its battery test injects fixture binaries and the other three read repository config and docs, so a single execution covers both families.

The workflow has no separate v1 and v2 jobs: one `battery` job builds both from its matrix, so the step is identical by construction rather than copied. The step-level guard is the smallest change that keeps one execution; it adds no job, checkout or provisioning.

### Reference Census

The counts and line numbers are the `rg` census in `spec.md`'s Measured Behavior block.

| File | Lines | Kind |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs` | 44 | The deleted implementation |
| `.skilled/skills/system-spec-kit/runtime/package.json` | 32 | The `test:sharded` script |
| `.skilled/skills/system-spec-kit/runtime/README.md` | 229, 234 | Usage line and lane paragraph |
| `.skilled/skills/system-spec-kit/runtime/scripts/README.md` | 8, 23, 34, 46, 64 | Trigger phrase, overview bullet, tree entry, inventory row, usage line |
| `.skilled/skills/system-spec-kit/runtime/tests/README.md` | 139, 141, 164 | Entrypoint row, advice line, validation paragraph |
| `.skilled/skills/system-spec-kit/ARCHITECTURE.md` | 88 | `scripts/` directory comment |
| `.env.example` | 653 | `SPECKIT_TEST_SHARDS` example |

The runner file, its `package.json` entry and the 12 documentation lines are the whole surface. `trigger-index.json` and `phrase-variants.json` also carry a "sharded test runner" phrase, but both are generated data and this phase does not hand-edit them.

### Data Flow
Today an operator reads a README, runs `npm run test:sharded`, and the runner spawns `run-tests.mjs` twelve times in sequence. After the change the script entry and every path to it are gone, so `npm test` is the only documented test entry point. In the workflow, a push starts the `battery` job twice from one matrix; the config-shape step runs before the install in both. After the guard, the `v1` entry runs the four tests, the `v2` entry goes straight to its install, and a failure in any of the four still turns the `v1` job red.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; these are the three phases they implement.

- **Setup**: count the 8 reference lines in 4 files and confirm the config-shape step is one definition at index 3 of 7 over a two-entry matrix, before any edit.
- **Implementation**: delete the runner, remove `test:sharded`, clear the 12 documentation lines, and guard the config-shape step to `matrix.family == 'v1'`.
- **Verification**: confirm the reference grep is empty, the package JSON parses with `test` still mapped, the workflow parses with one guarded definition over two entries, and the diff is the eight named paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every check is a static read; no test suite runs for this change.

The reference proof is the phase's primary gate:

```text
git grep -n run-tests-sharded -- ':!specs'
```

It prints nothing and exits 1 after the deletion. `git grep -n -i sharded -- ':!specs'` is not a valid gate, because the `--sharded` Level 3 option and the generated trigger index legitimately use the word; the README and documentation cleanup is checked file by file instead.

The package check parses the JSON and reads the default script:

```text
node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/system-spec-kit/runtime/package.json','utf8'))"
node -e "const p=JSON.parse(require('fs').readFileSync('.skilled/skills/system-spec-kit/runtime/package.json','utf8')); console.log(p.scripts.test)"
```

The first exits 0. The second prints `node scripts/run-tests.mjs`.

The workflow checks parse the YAML and read the step:

```text
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/opencode-dual-version.yml')); b=d['jobs']['battery']; s=[x for x in b['steps'] if 'config-shape' in str(x.get('name'))]; print('definitions=%d guard=%s entries=%s tests=%d' % (len(s), s[0].get('if'), [e['family'] for e in b['strategy']['matrix']['include']], s[0]['run'].count('.test.cjs')))"
```

It prints `definitions=1 guard=matrix.family == 'v1' entries=['v1', 'v2'] tests=4`.

`git status --short -- .skilled/skills/system-spec-kit/runtime .skilled/skills/system-spec-kit/ARCHITECTURE.md .env.example .github/workflows/opencode-dual-version.yml` lists exactly the eight named paths and nothing else.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node 22 in CI and Node 26.13.0 locally for the JSON parse and the `scripts.test` read.
- Python 3 with PyYAML for the workflow parse, with `ruby -ryaml` as the fallback.
- `git` and `rg` for the reference census.
- No new package and no build step.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the reference grep still finds the runner after the edits, the package JSON stops parsing, the workflow parse fails, or a consumer of `test:sharded` appears outside `specs/`.

Procedure: restore the eight paths from the parent commit and drop the step's `if:` line and the comment sentence that explains it. Because the phase is one commit, `git revert` on that commit restores the runner, the script entry and all twelve documentation lines together. Then re-run the reference census and the package and YAML parses; the census returns 8 lines in 4 files.
<!-- /ANCHOR:rollback -->

---

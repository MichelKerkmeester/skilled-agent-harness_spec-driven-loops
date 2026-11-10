---
title: "Implementation Plan: Phase 2: leaf-generator-ignores"
description: "Filter the leaf walk through one git check-ignore call per walk, with a name-based fallback for when git cannot answer, and cover both paths with a new self-running test."
trigger_phrases:
  - "leaf generator ignores plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: leaf-generator-ignores

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), Node built-ins only |
| **Framework** | None |
| **Storage** | None. The ignore decision comes from git's own rules |
| **Testing** | Self-running `.test.cjs` scripts with `node:assert/strict`, printing one pass line per case |

### Overview
`walkLeafFiles` keeps its traversal and its symlink checks. After the traversal it hands the candidate list to one helper. That helper asks git which candidates are ignored, and falls back to name rules when git cannot answer. The change is confined to `generate-leaf-manifest.cjs`, one new test file and one README row.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [x] Success criteria measurable (spec.md section 5, each with a command in tasks.md)
- [x] Dependencies identified (spec.md section 6)

### Definition of Done
- [ ] All acceptance criteria met (spec.md section 4, each REQ mapped to a task in tasks.md Phase 3)
- [ ] Tests passing: the new test file and every existing `tests/*.test.cjs` at its baseline status
- [ ] Docs updated: spec.md, plan.md, tasks.md, goal.md, with the goal log filled

### Before the First Write
- Load the repository rules this change triggers, named in `REPO RULES.md`: `.skilled/repo-rules/prevent-overengineering.md` (a new test file), `.skilled/repo-rules/scope-discipline.md` (only the files in spec.md), and `.skilled/repo-rules/evidence-and-proof.md` (before any completion claim).
- Route the `.cjs` writes through `sk-code` (Gate 2 artifact trigger).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Filter inside the existing walker. No new module and no new dependency.

### Key Components
- **`walkLeafFiles`** (`generate-leaf-manifest.cjs`, lines 96 to 130): traversal and symlink checks stay as they are. Its final `return out;` (line 129) becomes `return dropGitIgnoredLeaves(packetRoot, out);`. The symlink throws happen inside the loop, so they still fire before the filter runs.
- **`FALLBACK_IGNORED_SEGMENTS`** (new constant, above line 87): `new Set(['__pycache__', 'node_modules', '.DS_Store'])`.
- **`fallbackIgnored(rel)`** (new): true when any `/`-separated segment of `rel` is in the set, or when `rel` ends with `.pyc`.
- **`gitToplevel(cwd)`** (new): the repository root, or `null` when git cannot give one.
- **`dropGitIgnoredLeaves(packetRoot, rels)`** (new): the one place that asks git.
- **New test file** `tests/generate-leaf-manifest-ignores.test.cjs`: two cases, described in section 5.

### Data Flow
Packet-relative candidates come out of the traversal. Each candidate is resolved to a real path and made relative to the repository root. One `git check-ignore -z --stdin` call names the ignored ones, and those are removed. If git cannot answer, the same candidates go through `fallbackIgnored` instead.

### Helper Contract

Place the helpers in section 2 (HELPERS), directly above the comment that begins "Recursively collect packet-root-relative file paths" (line 87).

`gitToplevel(cwd)`:
- Run `spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' })`.
- Return `fs.realpathSync(stdout.trim())` when `status` is 0 and there is no `error`. Otherwise return `null`.

`dropGitIgnoredLeaves(packetRoot, rels)`:
1. If `rels.length === 0`, return `rels` without spawning anything.
2. `top = gitToplevel(packetRoot)`. If it is `null`, return `rels.filter((rel) => !fallbackIgnored(rel))`.
3. For each `rel`: `abs = path.join(packetRoot, rel)`, then `real = path.join(fs.realpathSync(path.dirname(abs)), path.basename(abs))`, then `repoRels[i] = path.relative(top, real).split(path.sep).join('/')`.
4. `res = spawnSync('git', ['check-ignore', '-z', '--stdin'], { cwd: top, input: repoRels.join('\0') + '\0', encoding: 'utf8' })`.
5. If `res.error` is set, or `res.status` is neither 0 nor 1 (this covers 128 and a `null` status from a signal), return `rels.filter((rel) => !fallbackIgnored(rel))`.
6. `ignored = new Set(res.status === 0 ? res.stdout.split('\0').filter(Boolean) : [])`.
7. Return `rels.filter((rel, i) => !ignored.has(repoRels[i]))`, keeping the original order.

The walk costs two constant git calls: one `rev-parse` and one `check-ignore`. Neither runs per file.

**Deviation from THE FIX text, step 3.** The brief says to resolve each candidate with `fs.realpathSync`. This plan resolves only its directory. The two differ only for a leaf symlink. A plain `realpathSync` would judge the symlink's target, so an ignored target would silently drop a leaf that the manifest lists under its link path (the walk's own comment at generate-leaf-manifest.cjs lines 87 to 95 requires that path). For regular files the two are identical. The tasks file records the deviation, and the goal log repeats it.

### Comments to Propose

Use these wordings, which state the durable reason only:
- Above `dropGitIgnoredLeaves`: "Git owns the ignore rules, which live in .gitignore files this walker does not parse. Name rules only cover a walk that git cannot answer."
- Above the directory resolution in step 3: "git refuses any path that passes through a symbolic link, so only the directory is resolved. A leaf symlink keeps its own name because the manifest lists that path."
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new file `tests/generate-leaf-manifest-ignores.test.cjs` follows the layout of its sibling `generate-leaf-manifest-scopes.test.cjs`: the same banner, numbered sections, a temp root removed in `finally`, and `node:` built-ins only. It imports `buildManifestBytes` from `../generate-leaf-manifest.cjs`.

**Case 1: `testGitIgnoredLeafIsDropped`.** REQ-001, REQ-003.
- Create a temp directory and run `git init -q` in it. Write its `.gitignore` as `generated/`.
- Under it, create a skill with `leaf-manifest.config.json` set to `{"workflowMode": "ignores-probe", "packet": ".", "leafRoots": ["references", "assets"]}`, plus `references/keep.md`, `references/generated/out.md` and `assets/logo.txt`.
- Assert the leaves, sorted on both sides, equal `['assets/logo.txt', 'references/keep.md']`. The `generated/` name is not in the fallback set, so only git can drop `references/generated/out.md`. The `assets/` root has no ignored file, so it also covers exit status 1.
- Read the leaves from `JSON.parse(buildManifestBytes(skillDir).toString('utf8')).modes[0].leaves`, the same shape the sibling tests read.

**Case 2: `testFallbackDropsGeneratedNoise`.** REQ-002.
- Create a skill in a temp directory from `os.tmpdir()`. First assert the precondition: `spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: skillDir })` has a non-zero status, so the walk must take the fallback.
- Create the same kind of standalone config, plus `references/keep.md`, `references/__pycache__/probe.cpython-39.pyc`, `references/stale.pyc`, `references/.DS_Store` and `references/node_modules/pkg/index.js`.
- Assert the leaves equal `['references/keep.md']`.

**Run block.** Call Case 1, then print `ok - git-ignored leaf is dropped`. Call Case 2, then print `ok - fallback drops generated noise outside a work tree`. Last, print `[sk-doc] leaf-manifest ignore filtering coverage passed`. The `finally` removes the temp root.

**Why this shape.** A case that only checks the fallback names cannot tell whether git ran, so Case 1 uses a pattern that only git understands. Case 2 uses only names the fallback understands, and asserts the precondition that it runs outside any work tree.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `git` on PATH. Local version 2.50.1. CI runs on `ubuntu-latest`, which ships git.
- `child_process` (Node built-in). No npm package is added.
- `.gitignore` lines 17 (`.DS_Store`), 50 (`node_modules/`), 267 (`__pycache__/`) and 269 (`*.pyc`). The probe location is already ignored by line 267, which the planner confirmed with `git check-ignore -v`.
- The existing sibling tests keep their behavior. The freshness-gate symlink cases in `tests/ci-leaf-manifest-freshness.test.cjs` run in temp directories outside any work tree, so they take the fallback, which drops none of their files.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the three edits to `generate-leaf-manifest.cjs` (the import, the helpers, and the `return` line), delete `tests/generate-leaf-manifest-ignores.test.cjs`, and remove its README row. No committed manifest should change, so there is nothing to regenerate. If the freshness gate reports a STALE skill after the change, revert first, then compare that skill's walk against the Phase 1 baseline before trying again.
<!-- /ANCHOR:rollback -->

---

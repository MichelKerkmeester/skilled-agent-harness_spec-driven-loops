---
title: "Tasks: Phase 2: hub-surface-removal"
description: "One change per task, each with its file, verified anchor, literal edit, proof command, acceptance criterion, rollback and stop condition, in execution order."
trigger_phrases:
  - "hub surface removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: hub-surface-removal

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: one change per task. A task edits one file, runs one command, or generates one artifact. Every task carries the same seven fields in the same order: `File`, `Anchor`, `Change`, `Proof`, `AC`, `Rollback`, `Stop if`.

**Execution order.** Tasks run in numeric order. `T014` and `T087` regenerate a file that later tasks read, so they run where they appear. `T108` runs last and nothing follows it.

**Anchor convention.** Every anchor below was read on `42b41dd286` and re-checked on the working tree at `583316d083`. Read the file, confirm the quoted text sits on the named line, then edit. When the text has moved, edit where the quoted text is and leave the line number alone. Never delete a range you have not read.

**Base commit.** `42b41dd286` holds every file this phase removes or restores. `git checkout 42b41dd286 -- <path>` restores any single path; `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` restores both deleted folders.

**Removed-packet pointer rule.** A pointer, row, bullet or keyword whose target is under `.skilled/skills/sk-code/sk-code-webflow/` or `.skilled/skills/sk-code/sk-code-obsidian/` is deleted, not repointed at an invented path. When the same guidance already exists under `sk-code-skilled/`, repoint to that file. Nothing in this phase writes new guidance.

**Comment hygiene.** No task adds a spec path, packet number or phase number to a code comment. Delete stale comments; do not rewrite them to name this packet.

**Kept tag vocabulary.** Exactly three files keep a bare surface token, in four lines, and nothing else does. The `WEBFLOW:` platform tag stays in: the line of `shared/references/universal/code-style-guide.md` that also carries `MOTION:` and `LENIS:` (line 151 today), two lines of `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` (32 and 119), and the allowed-token regex in `sk-code-quality/scripts/check-comment-hygiene.sh` (line 149). All four lines are comment-hygiene tag vocabulary for a code comment, not the removed surface. `changelog/` and `benchmark/reports/` are D6 kept records. No task deletes any of them, and no proof treats them as a violation.

**Phase-wide token proof.** Phase 2 removes the bare `WEBFLOW` / `OBSIDIAN` surface tokens, not only the two packet names. The closure proof counts four surviving token lines, in three files, with nothing under `.hermes/`.

**Positive controls.** Every zero-match proof starts with a control that runs the same pattern against the same file at `42b41dd286` and expects a non-zero count. A zero without a control can mean a broken pattern instead of a clean file.

**Baselines.** Three counts measure this phase and they are not interchangeable.

The planner's filtered count was 93 tracked files. It runs this query:

```bash
rg -l "sk-code-webflow|sk-code-obsidian" . --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**' | wc -l
```

The broad tracked grep returned 1,303 paths, 1,123 of them under `specs/`, at the research commit `6347717083`. It runs this query:

```bash
git grep -l -i -E "sk-code-webflow|sk-code-obsidian|\bWEBFLOW\b|\bOBSIDIAN\b" | wc -l
```

Re-measured on the working tree at `583316d083` it returns 1,322 paths (1,142 under `specs/`), and 1,288 paths (1,108 under `specs/`) when this packet's own folder is excluded with `-- ':!specs/sk-code/013-private-surface-skills'`.

T003's query returned 158 at HEAD. It runs this query:

```bash
rg -l "sk-code-webflow|sk-code-obsidian" . --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**' | wc -l
```

That query silently skips six tracked `.hermes` files, because ripgrep skips hidden directories unless told otherwise. Adding `--hidden` and excluding `.git` returns the corrected count of 164:

```bash
rg -l --hidden "sk-code-webflow|sk-code-obsidian" . --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**' --glob '!.git/**' | wc -l
```

The first count is the planner's number and it is narrower than the second: it excludes `specs/`, every changelog and every benchmark report. The second is the whole tracked tree and is mostly history under `specs/`. The third is the first count's query with hidden directories included. T003 records all three; no later proof asserts the broad number, because this packet's own documents match it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting any task: read the file named in its `File` field, confirm the `Anchor` text sits on the named line, and confirm the file is in the state the previous task left it. A mismatch is a stale anchor, not a reason to improvise.

### Execution Rules

| Rule | Statement |
|------|-----------|
| TASK-SEQ | Run tasks in numeric order. Do not reorder, merge or skip one. |
| TASK-SCOPE | Change only what the `Change` field states. Do not fix adjacent code, prose or formatting. |
| TASK-LOCATE | Find every edit by the text quoted in `Anchor`, not by its line number. A number is a cross-check on the file as measured; an earlier task on the same file may have shifted it. When a `Change` lists several edits in one file, apply them from the highest line number to the lowest. |
| TASK-PROOF | Run the `Proof` command and read both the output and the exit status before marking the task `[x]`. |
| TASK-GENERATED | Never hand-edit a generated file. `leaf-manifest.json`, `graph-metadata.json`, the README manifest, the Hermes copies and the compiled-routing manifest come from their generators. |
| TASK-COMMENT | Add no spec path, packet number or phase number to a code comment. |

### Status Reporting Format

Report one line per task as `T### | <state> | <proof output>`, where `<state>` is `done`, `blocked` or `skipped`. A `blocked` line names the failed condition from its `Stop if` field.

### Blocked Task Protocol

When a `Stop if` condition fires, stop at that task, leave every later task untouched, and report the task id, the command that failed, its output and the anchor that did not match. Do not attempt a second interpretation of the same anchor after three failed matches on the same file.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### [x] T001 — Confirm the checkout is provisioned and hook-trusted

- **File:** `none`
- **Anchor:** `.skilled/skills/sk-code/README.md:110-115`, the hub README "Before You Start" block; line 110 is `### Before You Start`.
- **Change:** run the three setup commands only when the proof does not already print `true`.
  ```bash
  bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .
  git config --local skilled.trustRepoHooks true
  bash .skilled/scripts/install-git-hooks.sh
  ```
- **Proof:**
  ```bash
  git config --local --get skilled.trustRepoHooks
  ```
  Expected: `true`
- **AC:** AC-014
- **Rollback:** n/a: a local git config flag and installed hooks change no tracked file, and both commands are re-runnable.
- **Stop if:** the command prints anything other than `true` after all three setup commands ran.
- **Evidence:** `git config --local --get skilled.trustRepoHooks` prints `true`.

### [x] T002 — Confirm the predecessor phase landed

- **File:** `none`
- **Anchor:** `specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md`, frontmatter line 2 `title:`.
- **Change:** none. Fetch the remote, confirm phase 1's two guard files are on `origin/main`, then run the validator only.
- **Proof:**
  ```bash
  git fetch origin main
  git ls-tree -r --name-only origin/main -- .gitignore .skilled/scripts/git-hooks/pre-commit | wc -l
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard --strict | tail -1
  ```
  Expected: `2`, then `RESULT: PASSED`
- **AC:** AC-014
- **Rollback:** n/a: read-only.
- **Stop if:** the tree count is not `2`, or the last line is not `RESULT: PASSED`.
- **Evidence:** `git ls-tree -r origin/main -- .gitignore pre-commit` prints `2`; the phase-001 `validate.sh --strict` re-ran to `RESULT: PASSED`.

### [x] T003 — Record the three baselines

- **File:** `none`
- **Anchor:** the baseline table in the Task Notation section of this file, which names all three commands.
- **Change:** run the three commands and write their output plus the three file lists to `/tmp/phase2-baseline.txt`. Never write to `scratch/`: it is not gitignored, and T108 requires an empty `git status --porcelain`.
  ```bash
  rg -l "sk-code-webflow|sk-code-obsidian" . --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**' > /tmp/phase2-baseline-filtered.txt
  rg -l --hidden "sk-code-webflow|sk-code-obsidian" . --glob '!specs/**' --glob '!**/changelog/**' --glob '!.skilled/changelog/**' --glob '!**/benchmark/reports/**' --glob '!.git/**' > /tmp/phase2-baseline-hidden.txt
  git grep -l -i -E "sk-code-webflow|sk-code-obsidian|\bWEBFLOW\b|\bOBSIDIAN\b" > /tmp/phase2-baseline-broad.txt
  ```
- **Proof:**
  ```bash
  wc -l < /tmp/phase2-baseline-filtered.txt
  wc -l < /tmp/phase2-baseline-hidden.txt
  wc -l < /tmp/phase2-baseline-broad.txt
  ```
  Expected: `158`, then `164`, then the broad count recorded (`1322` on the planning tree)
- **AC:** AC-007
- **Rollback:** n/a: three files under `/tmp`, outside the repository.
- **Stop if:** the second number is not exactly six more than the first, because the difference is the six tracked `.hermes` files and any other gap means the query changed. The broad count is recorded rather than asserted: another phase landing before this one changes it, and the recorded value is the baseline this phase measures against.
- **Evidence:** `/tmp/phase2-baseline-filtered.txt` 158, `/tmp/phase2-baseline-hidden.txt` 164, `/tmp/phase2-baseline-broad.txt` 1338; 164 = 158+6 satisfies the stop rule.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Delete the packets

### [x] T004 — Delete both surface packet folders from the tracked tree

- **File:** `.skilled/skills/sk-code/sk-code-webflow/`, `.skilled/skills/sk-code/sk-code-obsidian/`
- **Anchor:** `name: sk-code-webflow` at `sk-code-webflow/SKILL.md:2` and `name: sk-code-obsidian` at `sk-code-obsidian/SKILL.md:2`.
- **Change:** remove both folders through git so the removal is recorded and the content stays reachable at `42b41dd286`.
  ```bash
  git rm -r .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian
  ```
- **Proof:**
  ```bash
  git ls-tree -r --name-only 42b41dd286 | grep -cE '^\.skilled/skills/sk-code/sk-code-(webflow|obsidian)/'
  git ls-files | grep -cE '^\.skilled/skills/sk-code/sk-code-(webflow|obsidian)/' || echo 0
  ```
  Expected: `226`, then `0`
- **AC:** AC-001
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian`
- **Stop if:** the first count is not `226`, which means the base commit or the pattern is wrong.
- **Evidence:** 226 paths at `42b41dd286`, `git ls-files` prints 0, both folders absent on disk; staged as 226 deletions.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Registries

### [x] T005 — Rewrite the registry description to one surface

- **File:** `.skilled/skills/sk-code/mode-registry.json`
- **Anchor:** line 5, the `"description"` value, which contains `the SURFACE axis (sk-code-webflow/sk-code-skilled/sk-code-obsidian) is read-only domain evidence`.
- **Change:** replace the whole value of `description` on line 5 with:
  ```text
  "description": "Declarative two-axis mode registry for the sk-code parent hub. Every packet is a modes[] entry carrying the discriminator (workflowMode/packetKind/backendKind) plus its advisorRouting contract. The WORKFLOW axis (sk-code-quality/sk-code-review) is process; the SURFACE axis (sk-code-skilled) is read-only domain evidence. Implement/debug/verify phase doctrine is consolidated in shared/references/workflow-*.md, symlinked into the surface. The advisor routes the single identity sk-code; the hub resolves the workflow mode and bundles surface packets as evidence.",
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/mode-registry.json | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/mode-registry.json || echo 0
  ```
  Expected: `10`, then `0`
- **AC:** AC-002
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/mode-registry.json`
- **Stop if:** the second count is not `0`, because a later task in this phase also removes registry mentions and the file is not clean yet.
- **Evidence:** `description` replaced verbatim; `rg -ci 'webflow|obsidian' mode-registry.json` prints 0 (base 10).

### [x] T006 — Reduce the declared surface axis

- **File:** `.skilled/skills/sk-code/mode-registry.json`
- **Anchor:** line 19, `      "surfaces": ["sk-code-webflow", "sk-code-skilled", "sk-code-obsidian"]`
- **Change:** replace that line with:
  ```text
        "surfaces": ["sk-code-skilled"]
  ```
- **Proof:**
  ```bash
  node -e "console.log(JSON.stringify(require('./.skilled/skills/sk-code/mode-registry.json').extensions['surface-axis'].surfaces))"
  ```
  Expected: `["sk-code-skilled"]`
- **AC:** AC-002
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/mode-registry.json`
- **Stop if:** the command throws, which means the JSON no longer parses.
- **Evidence:** `extensions.surface-axis.surfaces` reads `["sk-code-skilled"]`.

### [x] T007 — Delete the `sk-code-webflow` mode entry

- **File:** `.skilled/skills/sk-code/mode-registry.json`
- **Anchor:** line 60, `    {` immediately above line 61 `      "workflowMode": "sk-code-webflow",`; the object closes at line 77 `    },`.
- **Change:** delete lines 60 through 77 inclusive.
- **Proof:**
  ```bash
  node -e "console.log(require('./.skilled/skills/sk-code/mode-registry.json').modes.map(m=>m.workflowMode).join(','))"
  ```
  Expected: `sk-code-quality,sk-code-review,sk-code-skilled,sk-code-obsidian`
- **AC:** AC-002
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/mode-registry.json`
- **Stop if:** the output still lists `sk-code-webflow` or the JSON throws.
- **Evidence:** `sk-code-webflow` modes entry deleted; the JSON parses.

### [x] T008 — Delete the `sk-code-obsidian` mode entry

- **File:** `.skilled/skills/sk-code/mode-registry.json`
- **Anchor:** line 97, `    {` immediately above line 98 `      "workflowMode": "sk-code-obsidian",`; the object closes at line 114 `    }` and line 115 is `  ]`.
- **Change:** delete lines 96 through 114 inclusive, which removes the blank line above the object and the object itself. Line 114 carries no trailing comma because it is the last array element; deleting it leaves line 95 `    },` as the final element.
- **Proof:**
  ```bash
  node -e "const r=require('./.skilled/skills/sk-code/mode-registry.json');console.log(r.modes.map(m=>m.workflowMode).join(','))"
  ```
  Expected: `sk-code-quality,sk-code-review,sk-code-skilled`
- **AC:** AC-002
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/mode-registry.json`
- **Stop if:** the JSON throws, because the last element kept a dangling comma.
- **Evidence:** `sk-code-obsidian` modes entry deleted with no dangling comma; `modes` is `sk-code-quality,sk-code-review,sk-code-skilled`.

### [x] T009 — Reduce the tie-break order

- **File:** `.skilled/skills/sk-code/hub-router.json`
- **Anchor:** line 7, `    "tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-skilled", "sk-code-obsidian", "sk-code-webflow"],`
- **Change:** replace that line with:
  ```text
      "tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-skilled"],
  ```
- **Proof:**
  ```bash
  node -e "console.log(JSON.stringify(require('./.skilled/skills/sk-code/hub-router.json').routerPolicy.tieBreak))"
  ```
  Expected: `["sk-code-quality","sk-code-review","sk-code-skilled"]`
- **AC:** AC-003
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/hub-router.json`
- **Stop if:** the output still names a removed surface.
- **Evidence:** `tieBreak` reads `["sk-code-quality","sk-code-review","sk-code-skilled"]`.

### [x] T010 — Delete the `sk-code-webflow` router-signals entry

- **File:** `.skilled/skills/sk-code/hub-router.json`
- **Anchor:** line 31, `    "sk-code-webflow": {`; the entry closes at line 35 `    },`.
- **Change:** delete lines 31 through 35 inclusive. The `sk-code-skilled` entry at 36-40 and the blank line at 41 stay untouched.
- **Proof:**
  ```bash
  node -e "console.log(Object.keys(require('./.skilled/skills/sk-code/hub-router.json').routerSignals).join(','))"
  ```
  Expected: `sk-code-quality,sk-code-review,sk-code-skilled,sk-code-obsidian`
- **AC:** AC-003
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/hub-router.json`
- **Stop if:** the output still lists `sk-code-webflow` or the JSON throws.
- **Evidence:** `routerSignals` no longer lists `sk-code-webflow`.

### [x] T011 — Delete the `sk-code-obsidian` router-signals entry and the dangling comma

- **File:** `.skilled/skills/sk-code/hub-router.json`
- **Anchor:** line 42, `    "sk-code-obsidian": {`; the entry closes at line 46 `    }`. Line 40 is `    },` and line 47 is `  },`.
- **Change:** delete lines 41 through 46 inclusive, then replace line 40 `    },` with:
  ```text
      }
  ```
  The replacement makes `sk-code-skilled` the final entry, so it must not carry a comma.
- **Proof:**
  ```bash
  node -e "const r=require('./.skilled/skills/sk-code/hub-router.json');console.log(Object.keys(r.routerSignals).join(','))"
  ```
  Expected: `sk-code-quality,sk-code-review,sk-code-skilled`
- **AC:** AC-003
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/hub-router.json`
- **Stop if:** the JSON throws, because the comma edit and the deletion disagree.
- **Evidence:** `routerSignals` is `sk-code-quality,sk-code-review,sk-code-skilled`; the trailing comma is fixed and the JSON parses.

### [x] T012 — Delete the two Webflow vocabulary classes

- **File:** `.skilled/skills/sk-code/hub-router.json`
- **Anchor:** line 73, `    "code-webflow-aliases": {`; line 76, `    "code-webflow-runtime": {`; the second class closes at line 78 `    },`.
- **Change:** delete lines 73 through 78 inclusive.
- **Proof:**
  ```bash
  node -e "console.log(Object.keys(require('./.skilled/skills/sk-code/hub-router.json').vocabularyClasses).join(','))"
  ```
  Expected: `hub-identity,quality-aliases,quality-gates,quality-restraint,code-review-aliases,code-review-findings,code-review-security,code-review-pr,code-skilled-aliases,code-skilled-runtime,code-skilled-authoring,code-obsidian-aliases,code-obsidian-runtime`
- **AC:** AC-003
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/hub-router.json`
- **Stop if:** the output still lists a `code-webflow-*` class.
- **Evidence:** no `code-webflow-*` vocabulary classes remain.

### [x] T013 — Delete the two Obsidian vocabulary classes

- **File:** `.skilled/skills/sk-code/hub-router.json`
- **Anchor:** line 89, `    "code-obsidian-aliases": {`; line 92, `    "code-obsidian-runtime": {`; the second class closes at line 94 `    }`.
- **Change:** delete lines 88 through 94 inclusive. Line 88 is the blank line above the pair; the last class needs no trailing comma, and line 87 `    }` is already comma-free.
- **Proof:**
  ```bash
  node -e "console.log(Object.keys(require('./.skilled/skills/sk-code/hub-router.json').vocabularyClasses).join(','))"
  ```
  Expected: `hub-identity,quality-aliases,quality-gates,quality-restraint,code-review-aliases,code-review-findings,code-review-security,code-review-pr,code-skilled-aliases,code-skilled-runtime,code-skilled-authoring`
- **AC:** AC-003
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/hub-router.json`
- **Stop if:** the JSON throws or an `code-obsidian-*` class remains.
- **Evidence:** `vocabularyClasses` holds exactly the 11 expected keys; the JSON parses.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Generated manifest

### [x] T014 — Regenerate the leaf manifest

- **File:** `.skilled/skills/sk-code/leaf-manifest.json`
- **Anchor:** the generator invocation documented at `.skilled/skills/sk-code/README.md:123`, `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code`.
- **Change:** run the generator. Do not hand-edit the file.
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/leaf-manifest.json | grep -cE 'sk-code-(webflow|obsidian)'
  rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-code/leaf-manifest.json || echo 0
  ```
  Expected: `4`, then `0`
- **AC:** AC-004
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/leaf-manifest.json`
- **Stop if:** the generator exits non-zero with `MODE_LEAF_SET_COLLISION`, which means a remaining packet copies another packet's leaf set.
- **Evidence:** `leaf-manifest.json` names no removed packet and its modes are quality/review/skilled; `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK`.

<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: `ROUTER.md`

`ROUTER.md` is hand-owned and carries 172 surface lines. It is edited one section at a time. Do not renumber sections: `verify-router-sync.cjs` scans from the first `## N. <NAME> MAP` heading to the literal `## 7. VERIFICATION COMMANDS`, so both that heading and the surviving `## 6. SKILLED MAP` heading must keep their text.

### [x] T015 — Strip section 1 of `ROUTER.md`

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 26 `The smart router maps a detected surface (SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN)`; line 30 `determines SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN`; line 37 `(OpenCode vs Obsidian vs Webflow vs UNKNOWN)`; line 39 `### Bundled Evidence Surfaces`; line 41, the paragraph beginning `Beyond the Webflow and OpenCode prose maps`; line 45 `surface detection (SKILLED/OBSIDIAN/WEBFLOW/UNKNOWN)`.
- **Change:** five edits.
  ```text
  Line 26: replace `(SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN)` with `(SKILLED / UNKNOWN)`.
  Line 30: replace `SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN` with `SKILLED / UNKNOWN`.
  Line 37: replace `(OpenCode vs Obsidian vs Webflow vs UNKNOWN)` with `(SKILLED vs UNKNOWN)`.
  Lines 39-42: delete the `### Bundled Evidence Surfaces` heading, its blank line, its paragraph and its blank line, leaving `### Key Sources` as the next heading.
  Line 45: replace `(SKILLED/OBSIDIAN/WEBFLOW/UNKNOWN)` with `(SKILLED/UNKNOWN)`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 1\. OVERVIEW/,/^## 2\. INTENT MODEL/p' | grep -ciE 'webflow|obsidian'
  awk '/^## 1\. OVERVIEW/,/^## 2\. INTENT MODEL/' .skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `5`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section check is not `0` after all five edits.
- **Evidence:** `ROUTER.md` section 1 `webflow|obsidian` count 0.

### [x] T016 — Strip section 2 of `ROUTER.md`

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 94 `Multi-symptom prompts like \`fix Webflow animation flicker\``; line 96, the paragraph beginning `Motion.dev API or decision prompts should load MOTION_DEV as a resource intent.`; line 100, the bullet beginning `- **WEBFLOW** intent scoring`.
- **Change:** three edits.
  ```text
  Line 94: replace `fix Webflow animation flicker` with `fix animation flicker`.
  Line 96: replace the whole paragraph with:
  Motion.dev API or decision prompts should load MOTION_DEV as a resource intent alongside the detected surface. When the target is `.skilled/`, keep the surface as SKILLED and load Motion only as reference material.
  Line 100: delete the bullet that begins `- **WEBFLOW** intent scoring` and its newline.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 2\. INTENT MODEL/,/^## 3\. LOAD TIERS/p' | grep -ciE 'webflow|obsidian'
  awk '/^## 2\. INTENT MODEL/,/^## 3\. LOAD TIERS/' .skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section check is not `0`.
- **Evidence:** `ROUTER.md` section 2 `webflow|obsidian` count 0.

### [x] T017 — Strip section 3 of `ROUTER.md`

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 112, the row beginning `| SURFACE | After WEBFLOW, SKILLED or OBSIDIAN detection |`; line 115, the row beginning `| ON_DEMAND | Explicit deep-dive keywords |`.
- **Change:** two replacements.
  ```text
  Line 112: replace the row with:
  | SURFACE | After SKILLED detection | Surface-specific resources (`sk-code-skilled/references/shared/*`) |
  Line 115: replace the row with:
  | ON_DEMAND | Explicit deep-dive keywords | Extended checklists and niche references (e.g. `sk-code-skilled/references/rust/quick-reference/overview-and-boundary-template.md` for boundary templates) |
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 3\. LOAD TIERS/,/^## 4\. WEBFLOW MAP/p' | grep -ciE 'webflow|obsidian'
  awk '/^## 3\. LOAD TIERS/,/^## 4\. WEBFLOW MAP/' .skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section check is not `0`.
- **Evidence:** `ROUTER.md` section 3 `webflow|obsidian` count 0.

### [x] T018 — Delete the WEBFLOW MAP section

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 119 `## 4. WEBFLOW MAP`; line 155 `## 5. MOTION_DEV MAP`.
- **Change:** delete the whole section, from the line `## 4. WEBFLOW MAP` through the last line before `## 5. MOTION_DEV MAP`. That range is the heading, the intro paragraph, the intent table, the implementation-trio contract, the language-standards overlay and the `---` separator plus its blank line. Locate the end by the `## 5. MOTION_DEV MAP` heading, not by a line number, because T015 to T017 have already shifted it.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 4\. WEBFLOW MAP/,/^## 5\. MOTION_DEV MAP/p' | grep -ciE 'webflow|obsidian'
  grep -c '^## 4\. WEBFLOW MAP$' .skilled/skills/sk-code/ROUTER.md || echo 0
  ```
  Expected: `15`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section heading survives or the following heading is no longer `## 5. MOTION_DEV MAP`.
- **Evidence:** `## 4. WEBFLOW MAP` gone; `## 6. SKILLED MAP` intact.

### [x] T019 — Delete the MOTION_DEV MAP section

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 155 `## 5. MOTION_DEV MAP`; line 200 `## 6. SKILLED MAP`.
- **Change:** delete the whole section, from the line `## 5. MOTION_DEV MAP` through the last line before `## 6. SKILLED MAP`. That range is the heading, both intro paragraphs, the intent table, both match notes, the resource list, the placeholder note, the performance and decision contracts, and the `---` separator plus its blank line. Locate the end by the `## 6. SKILLED MAP` heading, not by a line number, because T018 has already removed 36 lines above it.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 5\. MOTION_DEV MAP/,/^## 6\. SKILLED MAP/p' | grep -ciE 'webflow|obsidian'
  grep -c '^## 5\. MOTION_DEV MAP$' .skilled/skills/sk-code/ROUTER.md || echo 0
  ```
  Expected: `25`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section heading survives or `## 6. SKILLED MAP` is gone.
- **Evidence:** `## 5. MOTION_DEV MAP` gone; `## 6. SKILLED MAP` intact.

### [x] T020 — Delete the WEBFLOW verification row

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 250, the row beginning `| WEBFLOW |`.
- **Change:** delete line 250 and its newline.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 7\. VERIFICATION COMMANDS/,/^## 8\. UNKNOWN FALLBACK/p' | grep -ciE 'webflow|obsidian'
  awk '/^## 7\. VERIFICATION COMMANDS/,/^## 8\. UNKNOWN FALLBACK/' .skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section check is not `0`.
- **Evidence:** `ROUTER.md` section 7 verification `webflow|obsidian` count 0.

### [x] T021 — Strip section 8 of `ROUTER.md`

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 260 `1. Is this Webflow/frontend code, \`.skilled/\` system code, or Obsidian plugin code?`; line 265 `Canonical sk-code only owns the WEBFLOW, SKILLED and OBSIDIAN surfaces plus the MOTION_DEV resource category.`; line 271 `- Confirm the active runtime surface (SKILLED, OBSIDIAN or WEBFLOW)`
- **Change:** three edits.
  ```text
  Line 260: replace with `1. Is this `.skilled/` system code, or an unsupported stack?`
  Line 265: replace with `Do not load Go/NextJS/React Native resources from canonical sk-code; those surfaces live in the Barter sk-code fork (`barter/.opencode/skills/sk-code/references/`). Canonical sk-code owns the SKILLED surface plus the MOTION_DEV resource category.`
  Line 271: replace with `- Confirm the active runtime surface (SKILLED or UNKNOWN)`
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 8\. UNKNOWN FALLBACK/,/^## 9\. LOADING DISCIPLINE/p' | grep -ciE 'webflow|obsidian'
  awk '/^## 8\. UNKNOWN FALLBACK/,/^## 9\. LOADING DISCIPLINE/' .skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section check is not `0`.
- **Evidence:** `ROUTER.md` section 8 `webflow|obsidian` count 0; the rewritten lines verified at ROUTER.md:173 and :184.

### [x] T022 — Strip section 9 of `ROUTER.md`

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 283 `- Honor the WEBFLOW implementation trio contract on every WEBFLOW invocation`; line 290 `- Load all of \`sk-code-webflow/\` or all of \`sk-code-skilled/\` indiscriminately ("just in case")`; line 293 `- Skip the implementation trio for WEBFLOW`
- **Change:** three deletions.
  ```text
  Line 283: delete the whole bullet and its newline.
  Line 290: replace with `- Load all of `sk-code-skilled/` indiscriminately ("just in case")`
  Line 293: delete the whole bullet and its newline.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 9\. LOADING DISCIPLINE/,/^## 10\. RELATED RESOURCES/p' | grep -ciE 'webflow|obsidian'
  awk '/^## 9\. LOADING DISCIPLINE/,/^## 10\. RELATED RESOURCES/' .skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section check is not `0`.
- **Evidence:** `ROUTER.md` section 9 `webflow|obsidian` count 0.

### [x] T023 — Strip section 10 of `ROUTER.md`

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 300 `- [\`stack-detection.md\`](shared/references/stack-detection.md) — surface detection (SKILLED/OBSIDIAN/WEBFLOW/UNKNOWN) + SKILLED language sub-detection`
- **Change:** replace the parenthetical.
  ```text
  Replace `(SKILLED/OBSIDIAN/WEBFLOW/UNKNOWN)` with `(SKILLED/UNKNOWN)`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^## 10\. RELATED RESOURCES/,/^## 11\. MACHINE-READABLE ROUTER/p' | grep -ciE 'webflow|obsidian'
  awk '/^## 10\. RELATED RESOURCES/,/^## 11\. MACHINE-READABLE ROUTER/' .skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the section check is not `0`.
- **Evidence:** `ROUTER.md` section 10 `webflow|obsidian` count 0.

### [x] T024 — Prune the section 11 intro and `INTENT_SIGNALS`

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 309 `This is the single machine-readable projection of the prose Intent Model (§2) and the per-surface maps (§4 Webflow, §5 Motion.dev, §6 OpenCode).`; line 331 `"TESTING":`; line 332 `"DEPLOYMENT":`; line 334 `"ANIMATION":`; line 335 `"MOTION_DEV":`; line 336 `"ACCESSIBILITY":`; line 337 `"FORMS":`; line 338 `"VIDEO":`; line 341 `"LANGUAGE_STANDARDS":`; line 346 `"OBSIDIAN_PLUGIN":`.
- **Change:** one replacement and nine key deletions, applied from the bottom up so the earlier line numbers stay valid.
  ```text
  Line 309: replace `the per-surface maps (§4 Webflow, §5 Motion.dev, §6 OpenCode)` with `the per-surface map (§6 SKILLED)`.
  Delete line 346 and the blank line 347 above `"RUST"`.
  Delete line 341.
  Delete lines 338, 337, 336, 335, 334.
  Delete line 332.
  Delete line 331.
  ```
  The nine deleted keys are the ones whose only `RESOURCE_MAP` entries lived in the removed packets; T025 deletes the matching map blocks.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^INTENT_SIGNALS = {/,/^}/p' | grep -cE '"(TESTING|DEPLOYMENT|ANIMATION|MOTION_DEV|ACCESSIBILITY|FORMS|VIDEO|LANGUAGE_STANDARDS|OBSIDIAN_PLUGIN)"'
  awk '/^INTENT_SIGNALS = \{/,/^\}/' .skilled/skills/sk-code/ROUTER.md | grep -cE '"(TESTING|DEPLOYMENT|ANIMATION|MOTION_DEV|ACCESSIBILITY|FORMS|VIDEO|LANGUAGE_STANDARDS|OBSIDIAN_PLUGIN)"' || echo 0
  ```
  Expected: `9`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the second count is not `0`, because a key survived and T025 will leave an orphan map.
- **Evidence:** `INTENT_SIGNALS` pruned-key count 0; the section 11 intro (ROUTER.md:220) reads "the per-surface map (§6 SKILLED)".

### [x] T025 — Prune `RESOURCE_MAP` to the shipped surface

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 351 `RESOURCE_MAP = {`; line 426 `"TESTING": [`; line 429 `"DEPLOYMENT": [`; line 449 `"ANIMATION": [`; line 458 `"MOTION_DEV": [`; line 470 `"ACCESSIBILITY": [`; line 480 `"FORMS": [`; line 487 `"VIDEO": [`; line 502 `"LANGUAGE_STANDARDS": [`; line 554 `"OBSIDIAN_PLUGIN": [`.
- **Change:** delete the nine blocks that lose every path, then delete the remaining packet paths.
  ```text
  Step 1, delete each of these key blocks whole: its `"KEY": [` line, every path line under it, its closing `],` line, and the blank line after it when one follows. Locate each block by its key text, never by a line number, because T024 has already removed nine lines above them:
    "OBSIDIAN_PLUGIN"
    "LANGUAGE_STANDARDS"
    "ANIMATION"
    "MOTION_DEV"
    "ACCESSIBILITY"
    "FORMS"
    "VIDEO"
    "TESTING"
    "DEPLOYMENT"
  Step 2, delete every remaining line between `RESOURCE_MAP = {` and its closing `}` whose text contains `sk-code-webflow/` or `sk-code-obsidian/`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | sed -n '/^RESOURCE_MAP = {/,/^}/p' | grep -cE 'sk-code-(webflow|obsidian)'
  awk '/^RESOURCE_MAP = \{/,/^\}/' .skilled/skills/sk-code/ROUTER.md | grep -cE 'sk-code-(webflow|obsidian)' || echo 0
  awk '/^RESOURCE_MAP = \{/,/^\}/' .skilled/skills/sk-code/ROUTER.md | grep -cE '^    "[A-Z_]+": \[\]' || echo 0
  ```
  Expected: `109`, then `0`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the third count is not `0`, because a key is left empty and `verify-router-sync.cjs` treats an empty map entry as invalid.
- **Evidence:** `RESOURCE_MAP` has 0 removed-packet paths and 0 empty `"KEY": []` entries; 12 keys remain.

### [x] T026 — Rewrite the surface-aware loading prose

- **File:** `.skilled/skills/sk-code/ROUTER.md`
- **Anchor:** line 607 `- the Motion.dev overlay (\`sk-code-webflow/references/animation/*\`) when a \`MOTION_DEV\` intent fires.`; line 609, the paragraph beginning `It does not load the other surface's resources`; line 617, the bullet beginning `- A mixed-marker task keeps the slice of each surface`; line 618, the bullet beginning `- No keyword match, or an \`UNKNOWN\` surface`.
- **Change:** one deletion and three replacements, each located by its quoted text rather than its line number, because T024 and T025 have already removed lines above them.
  ```text
  Line 607, the bullet that begins `- the Motion.dev overlay`: delete the whole bullet and its newline.
  Line 609, the paragraph that begins `It does not load the other surface's resources`: replace it with:
  It does not load another surface's resources, and it defers `assets/*` (checklists, recipes, templates) to on-demand rather than the first slice. Within SKILLED it slices once more by the **detected language** (§1 sub-detection): a TypeScript task loads `sk-code-skilled/references/typescript/*` plus the language-agnostic `sk-code-skilled/references/shared/*`, not the Python, shell, config, or JavaScript folders. An `UNKNOWN` surface falls back to the preamble plus the shared-tier entries its matched intents map. This is what stops a routine single-surface task from pulling the full cross-surface set. The deterministic router-replay enforces the same rule, so the benchmark measures it.
  The bullet that begins `- A mixed-marker task keeps the slice of each surface`: replace it with `- A single-surface task never pulls another surface's resources.`
  The bullet that begins `- No keyword match, or an `UNKNOWN` surface`: replace it with `- No keyword match, or an `UNKNOWN` surface, falls back to the preamble plus the shared-tier entries its matched intents map — confirm the surface and intent before loading more. See §8 (UNKNOWN FALLBACK) and §9 (LOADING DISCIPLINE) for the full rules.`
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/ROUTER.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/ROUTER.md || echo 0
  ```
  Expected: `172`, then `0`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/ROUTER.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** whole-file `webflow|obsidian` count 0 (base 172); `verify-router-sync.cjs` still prints `router-sync: 5/5 checks passed`.

<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Hub documents

### [x] T027 — Rewrite the hub skill's surface identity

- **File:** `.skilled/skills/sk-code/SKILL.md`
- **Anchor:** line 11 the `<!-- Keywords:` comment; line 15 `The **surface axis** is three read-only evidence packets the hub bundles alongside a workflow mode (sk-code-webflow, sk-code-skilled, sk-code-obsidian).`; line 17 `` `sk-code-obsidian` carries a pre-release `0.x` line in its own changelog.``; line 36, the row beginning `| **sk-code-webflow** |`; line 38, the row beginning `| **sk-code-obsidian** |`; line 40, the sentence beginning `**Surface list.** The hub has exactly three surfaces:`.
- **Change:** five edits.
  ```text
  Line 11: delete `webflow, ` and `, sk-code-obsidian` from the keyword list, leaving `<!-- Keywords: sk-code, code, surface-aware, two-axis, opencode, animation, motion.dev, frontend, browser, typescript, python, shell, json, jsonc, sk-code-quality, sk-code-review, quality, review, verification, debug, implement, workflow-doctrine, mode-registry, workflowmode, packetkind, backendkind, surface-router, evidence-base, surface-packet -->`
  Line 15: replace `The **surface axis** is three read-only evidence packets the hub bundles alongside a workflow mode (sk-code-webflow, sk-code-skilled, sk-code-obsidian). Each surface carries the shared **implement → debug → verify** workflow doctrine (`shared/references/workflow-*.md`, symlinked in) plus its own stack knowledge, and sk-code-webflow also carries the folded-in Motion.dev animation overlay.` with `The **surface axis** is one read-only evidence packet the hub bundles alongside a workflow mode (sk-code-skilled). It carries the shared **implement → debug → verify** workflow doctrine (`shared/references/workflow-*.md`, symlinked in) plus its own stack knowledge.`
  Line 17: delete the sentence `` `sk-code-obsidian` carries a pre-release `0.x` line in its own changelog. `` and keep the rest of the paragraph.
  Line 36: delete the whole `sk-code-webflow` table row.
  Line 38: delete the whole `sk-code-obsidian` table row.
  Line 40: replace the sentence `The hub has exactly three surfaces: SKILLED (`sk-code-skilled`), the native surface for this framework's own code, and two optional example surfaces, WEBFLOW (`sk-code-webflow`) and OBSIDIAN (`sk-code-obsidian`), which a user may remove.` with `The hub has exactly one surface: SKILLED (`sk-code-skilled`), the native surface for this framework's own code.`
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/SKILL.md | sed -n '1,45p' | grep -ciE 'webflow|obsidian'
  sed -n '1,45p' .skilled/skills/sk-code/SKILL.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `6`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/SKILL.md`
- **Stop if:** the section check is not `0` or the surface table loses its `sk-code-skilled` row.
- **Evidence:** SKILL.md lines 1-45 token count 0; line 15's one-surface wording and line 38's "exactly one surface" verified.

### [x] T028 — Rewrite the hub skill's routing examples

- **File:** `.skilled/skills/sk-code/SKILL.md`
- **Anchor:** line 63 `for example \`--surface-hint WEBFLOW\``; line 70 `the public mode/packet key: \`sk-code-quality\`, \`sk-code-review\` (workflow) or \`sk-code-webflow\`, \`sk-code-skilled\`, \`sk-code-obsidian\` (surface).`; line 74, the paragraph beginning `"review my webflow animation for jank"`; line 82 `"Confirm whether this is sk-code-quality, sk-code-review, Webflow, OpenCode, or Obsidian work",`
- **Change:** four replacements.
  ```text
  Line 63: replace `--surface-hint WEBFLOW` with `--surface-hint SKILLED`.
  Line 70: replace the key list with ``sk-code-quality`, `sk-code-review` (workflow) or `sk-code-skilled` (surface).`
  Line 74: replace `"review my webflow animation for jank" → `[sk-code-review, sk-code-webflow]`.` with `"review my typescript module for jank" → `[sk-code-review, sk-code-skilled]`.`, and replace `SKILLED > OBSIDIAN > WEBFLOW` with `SKILLED > UNKNOWN`.
  Line 82: replace with `"Confirm whether this is sk-code-quality, sk-code-review or sk-code-skilled work",`
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/SKILL.md | sed -n '46,100p' | grep -ciE 'webflow|obsidian'
  sed -n '46,100p' .skilled/skills/sk-code/SKILL.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `4`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/SKILL.md`
- **Stop if:** the section check is not `0`.
- **Evidence:** SKILL.md lines 46-100 token count 0.

### [x] T029 — Rewrite the hub skill's detection, layout and backend prose

- **File:** `.skilled/skills/sk-code/SKILL.md`
- **Anchor:** line 139 `Surface detection (\`SKILLED\`, \`OBSIDIAN\`, \`WEBFLOW\`, \`UNKNOWN\`, at precedence SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)`; line 164, the layout line beginning `  sk-code-webflow/`; line 166 `  sk-code-obsidian/      # obsidian surface packet (read-only evidence)`; line 173, the paragraph beginning `It centralizes SKILLED, OBSIDIAN, WEBFLOW, and UNKNOWN detection`; line 203 `- Surface evidence packets: \`sk-code-webflow/SKILL.md\`, \`sk-code-skilled/SKILL.md\`, \`sk-code-obsidian/SKILL.md\`.`
- **Change:** four edits.
  ```text
  Line 139: replace `Surface detection (`SKILLED`, `OBSIDIAN`, `WEBFLOW`, `UNKNOWN`, at precedence SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` with `Surface detection (`SKILLED`, `UNKNOWN`, at precedence SKILLED > UNKNOWN)`.
  Lines 164 and 166: delete both layout-block lines.
  Line 173: replace `It centralizes SKILLED, OBSIDIAN, WEBFLOW, and UNKNOWN detection and their precedence (MOTION_DEV is a resource intent resolved after the surface, not a surface), and it carries the shared implement → debug → verify workflow doctrine that each surface consumes.` with `It centralizes SKILLED and UNKNOWN detection and their precedence (MOTION_DEV is a resource intent resolved after the surface, not a surface), and it carries the shared implement → debug → verify workflow doctrine that the surface consumes.` and replace `read-only domain evidence (`sk-code-webflow/`, `sk-code-skilled/`, `sk-code-obsidian/`)` with `read-only domain evidence (`sk-code-skilled/`)`.
  Line 203: replace with `- Surface evidence packets: `sk-code-skilled/SKILL.md`.`
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/SKILL.md | sed -n '101,209p' | grep -ciE 'webflow|obsidian'
  sed -n '101,209p' .skilled/skills/sk-code/SKILL.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `5`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/SKILL.md`
- **Stop if:** the section check is not `0` or the layout block loses its `sk-code-skilled/` line.
- **Evidence:** SKILL.md lines 101-209 token count 0; `## ` heading count preserved (5=5); the layout block keeps `sk-code-skilled/`.

### [x] T030 — Strip the surface detection contract

- **File:** `.skilled/skills/sk-code/shared/references/stack-detection.md`
- **Anchor:** line 3 `description: Surface detection (WEBFLOW/SKILLED/OBSIDIAN/UNKNOWN) and SKILLED language sub-detection. Primary routing key for sk-code.`; line 6 `  - "webflow opencode detection"`; line 16 `the same repository can contain Webflow frontend code and OpenCode system code.`; lines 28-30 the WEBFLOW, SKILLED and OBSIDIAN marker rows; line 33 the Motion.dev peer note; line 39 the precedence sentence; lines 45-56 the OBSIDIAN and WEBFLOW branch comments; lines 65-97 the why-paragraphs and the negative-language guard; lines 103-105 and 133-146 the example tables.
- **Change:** reduce the contract to SKILLED and UNKNOWN.
  ```text
  Line 3: `description: Surface detection (SKILLED/UNKNOWN) and SKILLED language sub-detection. Primary routing key for sk-code.`
  Line 6: delete the trigger phrase `  - "webflow opencode detection"` and its newline.
  Line 16: replace `the same repository can contain Webflow frontend code and OpenCode system code.` with `the same repository can hold this framework's own system code beside another stack.`
  Lines 28 and 30: delete the `| WEBFLOW |` row and the `| OBSIDIAN |` row; keep `| SKILLED |`.
  Line 33: replace the paragraph with `Motion.dev is a peer resource category rather than a surface. Surface detection chooses SKILLED or UNKNOWN first; Motion.dev API, performance, and decision guidance is loaded afterward when the intent requires cross-stack animation context.`
  Line 39: replace `**Precedence**: SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN. An SKILLED target/CWD wins, but only when its **resolved** real path lands inside the hub's own `.skilled/` directory — see the symlink guard below. OBSIDIAN follows, because an Obsidian plugin repository is structurally a generic TypeScript + `package.json` tree that would otherwise fall through to UNKNOWN. WEBFLOW then wins over UNKNOWN. Use early-return logic — later branches must not overwrite earlier matches.` with `**Precedence**: SKILLED > UNKNOWN. An SKILLED target/CWD wins, but only when its **resolved** real path lands inside the hub's own `.skilled/` directory — see the symlink guard below. Everything else stays UNKNOWN until the user clarifies the surface. Use early-return logic — later branches must not overwrite earlier matches.`
  Lines 44-56: delete the `# 2. OBSIDIAN` block, the `# 3. WEBFLOW` block and their blank separators, leaving the SKILLED block as the only branch.
  Lines 65-83: keep the SKILLED why-paragraph and the symlink guard; delete the WEBFLOW why-paragraph, the OBSIDIAN-above-WEBFLOW paragraph and the generic-Node guard paragraph.
  Lines 85-97: delete the `### Explicit Non-Webflow Guards` heading and its rule list, because no Webflow fallback remains to guard.
  Lines 103-105: keep the first two rows; delete the third row, whose surface is WEBFLOW.
  Lines 133-146: keep the SKILLED and UNKNOWN rows; delete every row whose surface column is WEBFLOW or OBSIDIAN.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/stack-detection.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/stack-detection.md || echo 0
  ```
  Expected: `39`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/stack-detection.md`
- **Stop if:** the second count is not `0`, or the SKILLED marker row and its detection branch are gone.
- **Evidence:** stack-detection.md token count 0; `**Precedence**: SKILLED > UNKNOWN` and the `# 1. SKILLED` branch kept.

### [x] T031 — Strip the shared index

- **File:** `.skilled/skills/sk-code/shared/README.md`
- **Anchor:** line 17, the sentence beginning `\`shared/\` holds the routing and doctrine references common to every sk-code surface packet`; line 30 `Surface detection (SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN)`; line 52 `across WEBFLOW or SKILLED`; line 71, the paragraph beginning `The shared tier ships no pattern assets.`.
- **Change:** four edits.
  ```text
  Line 17: replace `every sk-code surface packet (`sk-code-webflow`, `sk-code-skilled`, `sk-code-obsidian`)` with `the sk-code surface packet (`sk-code-skilled`)`.
  Line 30: replace `(SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN)` with `(SKILLED / UNKNOWN)`.
  Line 52: replace `across WEBFLOW or SKILLED` with `across SKILLED`.
  Line 71: replace the paragraph with `The shared tier ships no pattern assets.`
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/README.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/README.md || echo 0
  ```
  Expected: `4`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/README.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** shared/README.md token count 0.

### [x] T032 — Strip the per-surface phases from the phase contract

- **File:** `.skilled/skills/sk-code/shared/references/phase-detection.md`
- **Anchor:** line 16 `All three surfaces in the hub \`SKILL.md\` surface list (WEBFLOW, SKILLED and OBSIDIAN) follow the same lifecycle.`; line 28 `- When planning work on the WEBFLOW, SKILLED or OBSIDIAN surface.`; line 57 `## 3. WEBFLOW PHASES`; line 69 `## 4. SKILLED PHASES`; line 81 `### Cross-Stack Motion.dev Resources`; line 87 `## 5. OBSIDIAN PHASES`; line 101 `## 6. IRON LAWS`; line 109 `## 7. TRANSITIONS`; line 121 `## 8. RELATED RESOURCES`.
- **Change:** delete both removed-surface sections and renumber the survivors.
  ```text
  Line 16: `All surfaces in the hub `SKILL.md` surface list (SKILLED) follow the same lifecycle. Surface detection changes which resources and verification evidence apply.`
  Line 28: `- When planning work on the SKILLED surface.`
  Lines 57-68: delete `## 3. WEBFLOW PHASES`, its table and the `---` separator.
  Line 69: renumber to `## 3. SKILLED PHASES`.
  Lines 81-85: delete `### Cross-Stack Motion.dev Resources`, its paragraph and the `---` separator that follows it.
  Lines 87-98: delete `## 5. OBSIDIAN PHASES`, its table, its closing paragraph and the `---` separator.
  Line 101: renumber to `## 4. IRON LAWS`.
  Line 109: renumber to `## 5. TRANSITIONS`.
  Line 121: renumber to `## 6. RELATED RESOURCES`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/phase-detection.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/phase-detection.md || echo 0
  grep -c '^## ' .skilled/skills/sk-code/shared/references/phase-detection.md
  ```
  Expected: `14`, then `0`, then `6`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/phase-detection.md`
- **Stop if:** the section count is not `6`, because the renumbering left a gap or a duplicate.
- **Evidence:** phase-detection.md token count 0; sections renumbered cleanly 1-6.

### [x] T033 — Strip the debugging checklist

- **File:** `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`
- **Anchor:** line 16 `across the WEBFLOW and SKILLED surfaces`; line 22 `(Chrome DevTools for WEBFLOW, package/script diagnostics for SKILLED)`; line 69, the row beginning `| WEBFLOW |`; line 91, the bullet beginning `- \`.skilled/skills/sk-code/sk-code-webflow/references/debugging/debugging-workflows/systematic-four-phases.md\``.
- **Change:** two replacements and two deletions.
  ```text
  Line 16: replace `across the WEBFLOW and SKILLED surfaces` with `across the SKILLED surface`.
  Line 22: replace `(Chrome DevTools for WEBFLOW, package/script diagnostics for SKILLED)` with `(package/script diagnostics)`.
  Line 69: delete the whole table row.
  Line 91: delete the whole bullet and its newline.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/universal-debugging-checklist.md || echo 0
  ```
  Expected: `4`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** universal-debugging-checklist.md token count 0.

### [x] T034 — Strip the verification checklist

- **File:** `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`
- **Anchor:** line 16 `across WEBFLOW or SKILLED`; line 22 `(the Webflow minification scripts plus a browser matrix for WEBFLOW, and alignment/test commands for SKILLED)`; line 26 `For WEBFLOW, also walk the browser matrix in Section 4.`; line 36 `for WEBFLOW: open browser; for SKILLED: run targeted unit/integration checks where available.`; line 38 `5. [ ] **VERIFY (WEBFLOW)** — multi-viewport (mobile + desktop) + DevTools console clean.`; line 51, the row beginning `| WEBFLOW |`; line 57 `## 4. WEBFLOW BROWSER MATRIX`; line 71 the full-matrix pointer; line 90 the anti-pattern bullet; line 106 the evidence line; line 120 the related-resource bullet.
- **Change:** delete the browser matrix and reduce every claim to SKILLED.
  ```text
  Line 16: replace `across WEBFLOW or SKILLED` with `across SKILLED`.
  Line 22: replace `(the Webflow minification scripts plus a browser matrix for WEBFLOW, and alignment/test commands for SKILLED)` with `(alignment and test commands for SKILLED)`.
  Line 26: delete ` For WEBFLOW, also walk the browser matrix in Section 4.` from the paragraph.
  Line 36: replace with `3. [ ] **TEST** — for SKILLED: run targeted unit/integration checks where available.`
  Line 38: delete the whole `VERIFY (WEBFLOW)` step and renumber step 6 to step 5 if the list needs it.
  Line 51: delete the `| WEBFLOW |` table row.
  Lines 57-72: delete `## 4. WEBFLOW BROWSER MATRIX` through the full-matrix pointer paragraph.
  Line 90: delete the anti-pattern bullet.
  Line 106: delete the `WEBFLOW only:` evidence line.
  Line 120: delete the related-resource bullet.
  Renumber every later section so the sequence has no gap and fix the `Section N` cross-references at line 26.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/universal-verification-checklist.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/universal-verification-checklist.md || echo 0
  ```
  Expected: `11`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/universal-verification-checklist.md`
- **Stop if:** the second count is not `0` or a `Section N` reference points at a deleted section.
- **Evidence:** universal-verification-checklist.md token count 0; sections renumbered 1-7 with no gap and the `Section N` references resolve.

### [x] T035 — Strip the loading checklist pointers

- **File:** `.skilled/skills/sk-code/shared/references/performance-loading-checklist.md`
- **Anchor:** line 98 `- [interaction-gated-loading.md](../../sk-code-webflow/references/performance/interaction-gated-loading.md) - Gate selection and exclusions`; line 99 the `cwv-remediation.md` row; line 100 the `interaction-gate-patterns.js` row.
- **Change:** delete lines 98 through 100 inclusive.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/performance-loading-checklist.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/performance-loading-checklist.md || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/performance-loading-checklist.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** performance-loading-checklist.md token count 0.

### [x] T036 — Strip the code style guide

- **File:** `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md`
- **Anchor:** line 3, the `description` value, which ends `for WEBFLOW, SKILLED and OBSIDIAN code surfaces.`; line 24, the sentence beginning `Codifies the style principles`, which names `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/`; line 39, the line beginning `- Surface style guides:`; line 58, the row beginning `| WEBFLOW (vanilla JS) |`; line 87, the row beginning `| WEBFLOW JS  | File header`; line 120, the sentence beginning `This guide owns the comment-density rule.`, which names the Webflow surface budget; line 139, the sentence beginning `This is the canonical rule for both the SKILLED and WEBFLOW surfaces`; line 151 the kept tag row `| A platform / library name (\`WEBFLOW:\`, \`MOTION:\`, \`LENIS:\`) | Yes | Names a durable platform, not a tracking artifact |`; line 194, the parenthetical beginning `(WEBFLOW JS uses three-line file headers`; line 204 `| WEBFLOW JS  | Prettier |`; line 225, the row beginning `| WEBFLOW  |`; line 234 `- Surface standards under \`.skilled/skills/sk-code/sk-code-webflow/references/\` and \`.skilled/skills/sk-code/sk-code-skilled/references/\`.
- **Change:** delete every surface row and reduce every claim to SKILLED, keeping line 151 exactly as it is.
  ```text
  Line 3: `description: Language-agnostic naming, file structure, commenting, and formatting principles for the SKILLED code surface.`
  Line 24: replace `: `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/` and `.skilled/skills/sk-code/sk-code-skilled/references/`.` with `: `.skilled/skills/sk-code/sk-code-skilled/references/`.`
  Line 39: replace the line with `- Surface style guides: the language folders under `.skilled/skills/sk-code/sk-code-skilled/references/`.`
  Line 58: delete the row.
  Line 87: delete the row.
  Line 120: delete `The Webflow surface sets five comments per ten lines in `.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`, and ` and capitalise the following `the Skilled surface` to `The Skilled surface`.
  Line 139: replace `both the SKILLED and WEBFLOW surfaces` with `the SKILLED surface`.
  Line 151: no change. This is the kept `WEBFLOW:` tag line.
  Line 194: replace `(WEBFLOW JS uses three-line file headers with box-drawing characters; SKILLED TypeScript uses `MODULE:` headers where required)` with `(SKILLED TypeScript uses `MODULE:` headers where required)`.
  Line 204: delete the row.
  Line 225: delete the row.
  Line 234: replace the line with `- Surface standards under `.skilled/skills/sk-code/sk-code-skilled/references/`.`
  Line 39: the sentence keeps its trailing full stop and nothing else.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/universal/code-style-guide.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/universal/code-style-guide.md
  rg -n 'WEBFLOW:' .skilled/skills/sk-code/shared/references/universal/code-style-guide.md
  ```
  Expected: `12`, then `1`, then the single kept line `151:| A platform / library name (`WEBFLOW:`, `MOTION:`, `LENIS:`) | Yes | Names a durable platform, not a tracking artifact |`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/universal/code-style-guide.md`
- **Stop if:** the count drops to `0`, because that means the kept tag line was deleted.
- **Evidence:** code-style-guide.md token count 1 — the kept `WEBFLOW:` tag line, now at :149.

### [x] T037 — Strip the error recovery guide

- **File:** `.skilled/skills/sk-code/shared/references/universal/error-recovery.md`
- **Anchor:** line 3, the `description` value, which names WEBFLOW; line 43 a removed-packet path; line 88, the row beginning `| WEBFLOW (Node tooling) |`; line 89, the row beginning `| WEBFLOW (Wrangler / R2) |`; lines 108 and 133 removed-packet paths.
- **Change:** delete every row and pointer into a removed packet and reduce the description to SKILLED.
  ```text
  Line 3: `description: Error-recovery patterns across SKILLED routes.`
  Lines 43, 108, 133: delete each line whose target is under `sk-code-webflow/` or `sk-code-obsidian/`.
  Lines 88 and 89: delete both table rows.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/universal/error-recovery.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/universal/error-recovery.md || echo 0
  ```
  Expected: `6`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/universal/error-recovery.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** error-recovery.md token count 0.

### [x] T038 — Strip the multi-agent research guide

- **File:** `.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md`
- **Anchor:** line 50 a removed-packet path; line 172 `A WEBFLOW project's performance audit`; line 216 a removed-packet path.
- **Change:** delete both pointers and neutralize the example.
  ```text
  Line 50: delete the line whose target is under `sk-code-webflow/` or `sk-code-obsidian/`.
  Line 172: replace `A WEBFLOW project's performance audit` with `A frontend performance audit`.
  Line 216: delete the line whose target is under `sk-code-webflow/` or `sk-code-obsidian/`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/universal/multi-agent-research.md || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/universal/multi-agent-research.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** multi-agent-research.md token count 0.

### [x] T039 — Strip the code quality standards

- **File:** `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
- **Anchor:** line 16 `across WEBFLOW and SKILLED`; line 24, the sentence beginning `Defines the severity contract`, which names every surface checklist; line 39 `(Webflow JavaScript and CSS)`; lines 49, 56, 82 and 118 carry the `WEBFLOW` surface token; line 177 `(Webflow)`.
- **Change:** reduce each claim to SKILLED and delete the WEBFLOW table row.
  ```text
  Line 16: replace `across WEBFLOW and SKILLED` with `across SKILLED`.
  Line 24: replace every `WEBFLOW` surface word with `SKILLED`.
  Line 39: replace `(Webflow JavaScript and CSS)` with `(author-side JavaScript and CSS)`.
  Lines 49, 56 and 82: replace the `WEBFLOW` surface wording with SKILLED-only wording.
  Line 118: delete the `WEBFLOW` table row.
  Line 177: replace `(Webflow)` with `(author-side)`. This file carries no removed-packet path, so nothing is deleted for a dead target.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md || echo 0
  ```
  Expected: `8`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md || echo 0` → base/current grep returned 8 and 0.

### [x] T040 — Strip the hub description

- **File:** `.skilled/skills/sk-code/description.json`
- **Anchor:** line 3, the `"description"` value, which names Webflow frontend and Obsidian plugin code; line 12 `"webflow",`; line 46 `"sk-code-webflow",`; line 49 `"sk-code-obsidian",`; line 50 `"obsidian plugin",`
- **Change:** replace the description and delete four keywords.
  ```text
  Line 3: `"description": "Coding standards, references, and assets for this framework's own system code. Provides surface-aware code-quality patterns, checklists, and verification recipes for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC, MCP server code, agents, commands, skills). Smart-routing internals detect the active stack and load matching standards; unsupported stacks ask for disambiguation.",`
  Lines 12, 46, 49, 50: delete those four keyword lines.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/description.json | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/description.json || echo 0
  node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-code/description.json','utf8'))"
  ```
  Expected: `5`, then `0`, then exit 0
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/description.json`
- **Stop if:** the JSON throws or the count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/description.json | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/description.json || echo 0 && node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-code/description.json','utf8'))"` → base/current grep returned 5 and 0. JSON parse exited 0.

### [x] T041 — Strip the hub README

- **File:** `.skilled/skills/sk-code/README.md`
- **Anchor:** line 23 `The shared surface-detection router for the three surfaces the hub \`SKILL.md\` lists: the native SKILLED surface and the optional example WEBFLOW and OBSIDIAN surfaces, plus the Motion.dev animation overlay`; line 55 the `sk-code-webflow` table row; line 57 the `sk-code-obsidian` table row; line 69 `| "review my webflow animation for jank" | \`[sk-code-review, sk-code-webflow]\` |`; line 90 the `Reach for sk-code` paragraph; line 106 the ADAPTING paragraph; line 119 the `<mode>` sentence; lines 191 and 193 the dead link rows.
- **Change:** reduce every claim to the one shipped surface, keeping the "Before You Start" block at 110-115 and the removal procedure at 117-129.
  ```text
  Line 23: replace the cell with `The shared surface-detection router for the one surface the hub `SKILL.md` lists: the native SKILLED surface`
  Line 55: delete the row.
  Line 57: delete the row.
  Line 69: replace with `| "review my typescript module for jank" | `[sk-code-review, sk-code-skilled]` |`
  Line 90: replace `for the native SKILLED surface and the optional example WEBFLOW and OBSIDIAN surfaces, plus the Motion.dev animation overlay` with `for the native SKILLED surface`.
  Line 106: replace the paragraph with `sk-code ships one native surface. The Skilled surface, at `.skilled/skills/sk-code/sk-code-skilled/`, holds the standards for this framework's own code, so keep it.`
  Line 119: replace `Repeat these steps for each surface you drop. `<mode>` is `sk-code-webflow` or `sk-code-obsidian`.` with `Repeat these steps for each surface you drop. `<mode>` is the folder name of the surface packet.`
  Lines 191 and 193: delete both link rows.
  Line 126: replace `the Obsidian and Webflow checklist pointers` with `the surface checklist pointers`, so the procedure stays true for any surface a reader added.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/README.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/README.md || echo 0
  ```
  Expected: `10`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/README.md`
- **Stop if:** the second count is not `0`, or the "Before You Start" block or the nine-step removal procedure is gone.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/README.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/README.md || echo 0` → base/current grep returned 10 and 0.

### [x] T042 — Strip the Skilled packet's README

- **File:** `.skilled/skills/sk-code/sk-code-skilled/README.md`
- **Anchor:** line 36 `Its sibling \`sk-code-webflow\` carries frontend and browser evidence instead`; line 91 the sibling-surface row; line 104 the both-surfaces row.
- **Change:** delete or rewrite each of the three.
  ```text
  Line 36: replace `Its sibling `sk-code-webflow` carries frontend and browser evidence instead` with `It is the hub's only surface packet`.
  Line 91: delete the row that names a sibling surface.
  Line 104: delete the row that names both surfaces.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/README.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/README.md || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-skilled/README.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/README.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/README.md || echo 0` → base/current grep returned 3 and 0.

### [x] T043 — Strip the Skilled packet's SKILL.md comment

- **File:** `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`
- **Anchor:** line 55, the comment clause `the sibling sk-code-webflow map`.
- **Change:** delete the clause and leave the rest of the comment intact.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/SKILL.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/SKILL.md || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-skilled/SKILL.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/SKILL.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/SKILL.md || echo 0` → base/current grep returned 1 and 0.

<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Playbooks

Every scenario in this phase presents a removed surface or the Motion.dev overlay as live. The overlay leaves the public hub with the Webflow packet, so a scenario whose pass criterion requires an overlay reference cannot pass and is deleted rather than rewritten.

### [x] T044 — Delete the Webflow surface-detection scenario

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md`
- **Anchor:** line 2, `title: "SD-001: WEBFLOW Surface Detection"`; line 3, `description: "Verify sk-code routes vanilla-JS / animation-library prompts to the WEBFLOW surface and loads the webflow/* reference and asset trees."` The whole file is absent by design after this task: delete the file, not a range inside it.
- **Change:** remove the file through git.
  ```bash
  git rm .skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md | grep -ciE 'webflow|obsidian'
  test -e .skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md && echo PRESENT || echo ABSENT
  ```
  Expected: `23`, then `ABSENT`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md`
- **Stop if:** the file is already absent before the task runs.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md | grep -ciE 'webflow|obsidian' && test -e .skilled/skills/sk-code/manual-testing-playbook/surface-detection/webflow-detection.md && echo PRESENT || echo ABSENT` → base grep returned 23. File check returned ABSENT.

### [x] T045 — Delete the Obsidian surface-detection scenario

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md`
- **Anchor:** line 2, `title: "SD-004: OBSIDIAN Surface Detection"`; line 3, `description: "Verify that a Note Database plugin prompt routes to the OBSIDIAN surface and loads the expected shared and plugin references."` The whole file is absent by design after this task: delete the file, not a range inside it.
- **Change:** remove the file through git.
  ```bash
  git rm .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md | grep -ciE 'webflow|obsidian'
  test -e .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md && echo PRESENT || echo ABSENT
  ```
  Expected: `25`, then `ABSENT`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md`
- **Stop if:** the file is already absent before the task runs.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md | grep -ciE 'webflow|obsidian' && test -e .skilled/skills/sk-code/manual-testing-playbook/surface-detection/obsidian-detection.md && echo PRESENT || echo ABSENT` → base grep returned 25. File check returned ABSENT.

### [x] T046 — Delete the cross-stack routing scenario family

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/`
- **Anchor:** the seven files `webflow-plus-motion-dev.md`, `non-webflow-plus-motion-dev.md`, `cwv-gates-animation-heavy.md`, `decision-matrix-routing.md`, `prefers-reduced-motion.md`, `skilled-plus-motion-dev.md`, `snippet-reuse-cross-stack.md`.
- **Change:** remove the whole directory through git. Every one of the seven scenarios declares an expected reference or asset under the removed Webflow packet, so none has an expectation left.
  ```bash
  git rm -r .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/skilled-plus-motion-dev.md | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN'
  ls .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing 2>/dev/null | wc -l
  ```
  Expected: `11`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing`
- **Stop if:** the directory is already absent before the task runs.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/skilled-plus-motion-dev.md | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN' && ls .skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing 2>/dev/null | wc -l` → base grep returned 11. Directory count returned 0.

### [x] T047 — Delete the Motion.dev regression scenario family

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/`
- **Anchor:** the four files `animation-regression-baseline.md`, `cdn-bundle-version-pin.md`, `motion-api-smoke.md`, `prefers-reduced-motion.md`.
- **Change:** remove the whole directory through git. Each scenario's only expected references are the Motion.dev overlay files under the removed Webflow packet.
  ```bash
  git rm -r .skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/motion-api-smoke.md | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN'
  ls .skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression 2>/dev/null | wc -l
  ```
  Expected: `3`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression`
- **Stop if:** the directory is already absent before the task runs.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/motion-api-smoke.md | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN' && ls .skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression 2>/dev/null | wc -l` → base grep returned 3. Directory count returned 0.

### [x] T048 — Delete the cross-browser and performance scenario family

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates/`
- **Anchor:** the three files `cross-browser-animate.md`, `cwv-gates.md`, `gpu-compositing.md`.
- **Change:** remove the whole directory through git. Each scenario measures Motion.dev animation behaviour and cites only the removed overlay.
  ```bash
  git rm -r .skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates/gpu-compositing.md | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN'
  ls .skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates 2>/dev/null | wc -l
  ```
  Expected: `2`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates`
- **Stop if:** the directory is already absent before the task runs.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates/gpu-compositing.md | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN' && ls .skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates 2>/dev/null | wc -l` → base grep returned 2. Directory count returned 0.

### [x] T049 — Delete the mixed-marker ambiguity scenario

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md`
- **Anchor:** line 2, `title: "RD-001: Mixed-Marker Ambiguity"`; line 3, `description: "Verify sk-code asks for clarification (or applies a documented precedence rule) when WEBFLOW library markers and SKILLED path markers co-occur in the same prompt."`; line 13, `A) Apply a documented precedence rule (e.g. "SKILLED target path overrides WEBFLOW library marker").` The whole file is absent by design after this task: delete the file, not a range inside it.
- **Change:** remove the file through git. With one surface left there is no pair to disambiguate.
  ```bash
  git rm .skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md | grep -ciE 'webflow|obsidian'
  test -e .skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md && echo PRESENT || echo ABSENT
  ```
  Expected: `10`, then `ABSENT`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md`
- **Stop if:** the file is already absent before the task runs.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md | grep -ciE 'webflow|obsidian' && test -e .skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md && echo PRESENT || echo ABSENT` → base grep returned 10. File check returned ABSENT.

### [x] T050 — Strip the Skilled detection scenario

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md`
- **Anchor:** line 97 `the WEBFLOW markers (motion.dev, GSAP, etc.) MUST NOT match`; any line naming a removed packet.
- **Change:** replace the negative marker sentence and delete any removed-packet path.
  ```text
  Line 97: replace `the WEBFLOW markers (motion.dev, GSAP, etc.) MUST NOT match` with `a generic library marker (motion.dev, GSAP, etc.) MUST NOT match`.
  Delete every other line whose text contains `sk-code-webflow`, `sk-code-obsidian`, `WEBFLOW` or `OBSIDIAN`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md || echo 0
  ```
  Expected: `4`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/surface-detection/skilled-detection.md || echo 0` → base/current grep returned 4 and 0.

### [x] T051 — Strip the UNKNOWN fallback scenario

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md`
- **Anchor:** line 11 the supported-stack sentence; line 31 `no WEBFLOW or SKILLED markers`.
- **Change:** two replacements and any remaining removed-packet line.
  ```text
  Line 11: replace the supported-stack sentence with `Supported stacks are SKILLED, the framework's own system code.`
  Line 31: replace `no WEBFLOW or SKILLED markers` with `no SKILLED markers`.
  Delete every other line whose text contains `sk-code-webflow`, `sk-code-obsidian`, `WEBFLOW` or `OBSIDIAN`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md || echo 0
  ```
  Expected: `5`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md || echo 0` → base/current grep returned 5 and 0.

### [x] T052 — Strip the compiled-routing bundle scenario

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md`
- **Anchor:** the lines naming a removed packet in the expected bundle and its pass criteria.
- **Change:** reduce the bundle to the one shipped surface.
  ```text
  Replace every expected bundle that lists a removed packet with the single-surface bundle `[<workflow mode>, sk-code-skilled]`.
  Delete every line whose only target is under `sk-code-webflow/` or `sk-code-obsidian/`.
  Keep one case that proves a single-surface bundle resolves.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md || echo 0
  ```
  Expected: `10`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md || echo 0` → base/current grep returned 10 and 0.

### [x] T053 — Prune the playbook index

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`
- **Anchor:** line 43 the WEBFLOW detection bullet; line 77 the Motion peer-resource sentence; line 83 the `wrangler.toml` example; line 93 the surface list; line 187 the WEBFLOW failure-triage example; line 195 the `SD-001` row; line 198 the `SD-004` row; line 221 the `RD-001` row; lines 238-253 section 11; lines 255-267 section 12; lines 269-285 section 13; lines 348-356 the uncovered-test list; lines 370, 373, 378, 381-394 the cross-reference rows; lines 405-407 the totals.
- **Change:** delete every row and section that points at a deleted file, then renumber. Apply the edits from the bottom of the file upward so the earlier line numbers stay valid.
  ```text
  1. Delete lines 381-394 (the MR, CB and CS cross-reference rows).
  2. Delete line 378 (the RD-001 cross-reference row).
  3. Delete line 373 (the SD-004 cross-reference row).
  4. Delete line 370 (the SD-001 cross-reference row).
  5. Replace `**Total scenarios**: 34` with `**Total scenarios**: 17`.
  6. Replace `**Critical-path scenarios**: approximately 15 (SD-001, SD-002, SD-003, RD-002, SA-001, MR-001, MR-002, MR-003, MR-004, CB-001, CB-002, CB-003, CS-001, CS-002, CS-003)` with `**Critical-path scenarios**: 4 (SD-002, SD-003, RD-002, SA-001)`.
  7. Replace `**Categories**: 11` with `**Categories**: 8`.
  8. Delete lines 353-356 (the MR, CB and CS uncovered-test bullets).
  9. Replace `- Surface detection routing decisions (SD-001, SD-002, SD-003, SD-004).` with `- Surface detection routing decisions (SD-002, SD-003).`
  10. Replace `- Mixed-marker disambiguation (RD-001).` with nothing, deleting the line.
  11. Delete lines 269-285 (section 13, CROSS-STACK ROUTING).
  12. Delete lines 255-267 (section 12, CROSS-BROWSER AND PERFORMANCE GATES).
  13. Delete lines 238-253 (section 11, MOTION.DEV AND ANIMATION REGRESSION).
  14. Renumber `## 14.` to `## 11.`, `## 15.` to `## 12.`, `## 16.` to `## 13.`, `## 17.` to `## 14.`, `## 18.` to `## 15.`, `## 19.` to `## 16.`.
  15. Delete line 221 (the RD-001 row) and replace `## 9. ROUTING DISAMBIGUATION (`RD-001..RD-002`)` with `## 9. ROUTING DISAMBIGUATION (`RD-002`)`.
  16. Delete line 198 (the SD-004 row) and line 195 (the SD-001 row), then replace `## 7. SURFACE DETECTION (`SD-001..SD-004`)` with `## 7. SURFACE DETECTION (`SD-002..SD-003`)`.
  17. Delete line 187 (the WEBFLOW failure-triage example).
  18. Replace the line 93 surface list `(SKILLED / OBSIDIAN / WEBFLOW / UNKNOWN)` with `(SKILLED / UNKNOWN)`.
  19. Delete line 83 and line 77.
  20. Delete line 43.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md || echo 0
  grep -cE '^## [0-9]+\.' .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md
  ```
  Expected: `23`, then `0`, then `16`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md`
- **Stop if:** the section count is not `16`, because the renumbering left a gap or a duplicate.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md || echo 0 && grep -cE '^## [0-9]+\.' .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` → base/current grep returned 23 and 0. Section count returned 16.
- **Drift:** review found five stale lines the anchor inventory missed (dead family bullets, the critical-path set naming SD-001 and the CS family, 34 / 34 totals, the mixed-marker clause); fixed so the index matches its section 16 (17 scenarios), and `rg -ni 'webflow|obsidian|SD-001|CS-0|motion-dev|cross-browser|cross-stack|mixed-marker'` on the file returns nothing.

### [x] T054 — Strip the design restraint ladder's precedence

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md`
- **Anchor:** line 13, `changes neither surface precedence (SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)`.
- **Change:** replace the parenthetical.
  ```text
  Replace `(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` with `(SKILLED > UNKNOWN)`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md || echo 0` → base/current grep returned 1 and 0.

### [x] T055 — Delete the removed-surface advisor probes

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md`
- **Anchor:** line 38, the `| P12 | WEBFLOW |` row; rows P12 through P17 occupy lines 38-43.
- **Change:** delete the six probe rows and keep every SKILLED row and negative control.
  ```text
  Delete lines 38 through 43 inclusive.
  Renumber nothing else.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md || echo 0
  ```
  Expected: `5`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md`
- **Stop if:** the second count is not `0`, because a probe row outside 38-43 names a removed surface.
- **Drift:** Kept probe P15 because its row is labeled SKILLED, then updated the surviving probe count and accuracy threshold. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md || echo 0` → base/current grep returned 5 and 0. P15 remained because its row is SKILLED; surviving probe count and accuracy threshold were updated.

### [x] T056 — Fix the live sk-code setup playbook

- **File:** `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md`
- **Anchor:** lines 48, 50 and 52, the expected doctor output that names the removed surfaces.
- **Change:** rewrite the expected output to the three-packet hub.
  ```text
  Replace every expected-output line that names `sk-code-webflow` or `sk-code-obsidian` with the line the same check prints for a hub of `sk-code-quality`, `sk-code-review` and `sk-code-skilled`.
  Do not touch `doctor-sk-code-pre-v4-checkout.md`; it is a D6 kept historical record.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md || echo 0
  ```
  Expected: `3`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md || echo 0` → base/current grep returned 3 and 0. Parent-skill check reported 3 modes and 1 surface packet.

<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Quality mode

### [x] T057 — Strip the naming checklist's Webflow references

- **File:** `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md`
- **Anchor:** line 34 `**Reference:** [code-style-guide.md Section 2](../../../sk-code-webflow/references/javascript/style-guide/overview-naming-and-structure.md)`; line 94 the `code-quality-standards.md Section 2` reference; line 144 the `code-style-guide.md Section 4` reference; line 161 the `css/style-guide.md` reference.
- **Change:** delete all four reference lines. Each points into the removed packet and none has a Skilled equivalent.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md || echo 0
  ```
  Expected: `7`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md`
- **Stop if:** the second count is not `0`.
- **Drift:** Removed the Webflow-only CHK-INI-07 item and its Webflow.push conditional example because the file proof requires zero surface tokens. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md || echo 0` → base/current grep returned 7 and 0.

### [x] T058 — Strip the comment checklist's Webflow references

- **File:** `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`
- **Anchor:** lines 50-54 the five reference rows; line 62 and line 105 the `code-style-guide.md Section 3` references; line 166 the `Section 5` reference; line 173 `Platform constraints documented (WEBFLOW, MOTION, LENIS, HLS.JS)`; line 179 the cross-stack motion note; line 193 `// WEBFLOW: Page transitions may re-execute scripts`.
- **Change:** delete every removed-packet reference and neutralize the two token lines.
  ```text
  Lines 50-54: delete all five reference rows.
  Lines 62, 105, 166: delete the three reference lines.
  Line 173: replace `(WEBFLOW, MOTION, LENIS, HLS.JS)` with `(MOTION, LENIS, HLS.JS)`.
  Line 179: delete the whole cross-stack motion note.
  Line 193: replace the example comment with `// MOTION: Animation runs only when prefers-reduced-motion is not set`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md || echo 0
  ```
  Expected: `13`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`
- **Stop if:** the second count is not `0`.
- **Drift:** Removed two stale Webflow trigger phrases because the file proof requires zero surface tokens. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md || echo 0` → base/current grep returned 13 and 0.

### [x] T059 — Strip the verification checklist's Webflow references

- **File:** `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md`
- **Anchor:** lines 122-126 the five reference rows; line 130 the `enforcement.md` reference.
- **Change:** delete all six reference lines.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md || echo 0
  ```
  Expected: `6`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md || echo 0` → base/current grep returned 6 and 0.

### [x] T060 — Strip the quality mode's SKILL.md

- **File:** `.skilled/skills/sk-code/sk-code-quality/SKILL.md`
- **Anchor:** line 11 the `<!-- Keywords:` comment; line 15 `the surface skill (\`sk-code-webflow\` / \`sk-code-skilled\` / \`sk-code-obsidian\`)`; line 28, the bullet beginning `- Applying Webflow/frontend quality standards`; line 29 the Obsidian checklist bullet; lines 37, 48, 190, 196 and 289 the same three-packet list; line 68 `+- WEBFLOW target`; line 70 `+- OBSIDIAN target`; line 91 the `Webflow/frontend quality checklist` sentence; line 93 the Obsidian checklist paragraph; line 113 the CONDITIONAL row; line 128 the `Webflow/frontend files` row; lines 129-132 the four Obsidian target rows; line 192 the Obsidian load step; line 225 `resolved_surface: <webflow | opencode | obsidian | unknown>`; line 278 the Obsidian verification bullet; lines 323-326 the four Obsidian checklist links.
- **Change:** reduce every surface list to `sk-code-skilled` and delete every Obsidian branch, row and link.
  ```text
  Replace every occurrence of `sk-code-webflow` / `sk-code-skilled` / `sk-code-obsidian` and every equivalent three-packet list with `sk-code-skilled`.
  Line 11: delete `webflow` and `obsidian` from the keyword comment.
  Line 28: delete the bullet.
  Line 29: delete the bullet.
  Line 68: delete the `+- WEBFLOW target` branch.
  Line 70: delete the `+- OBSIDIAN target` branch.
  Line 91: replace `the Webflow/frontend quality checklist` with `the author-side quality checklist`.
  Line 93: delete the paragraph.
  Line 113: delete the CONDITIONAL row.
  Line 128: delete the `Webflow/frontend files` row.
  Lines 129-132: delete all four rows.
  Line 192: delete the Obsidian clause.
  Line 225: replace with `resolved_surface: <skilled | unknown>`.
  Line 278: delete the bullet.
  Lines 323-326: delete all four links.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/SKILL.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/SKILL.md || echo 0
  ```
  Expected: `26`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-quality/SKILL.md`
- **Stop if:** the second count is not `0`, or the SKILLED target branch is gone.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/SKILL.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/SKILL.md || echo 0` → base/current grep returned 26 and 0.

### [x] T061 — Strip the quality mode's README

- **File:** `.skilled/skills/sk-code/sk-code-quality/README.md`
- **Anchor:** line 26 the `Works on` cell; line 47 the `Webflow frontend files` row; line 53 the Obsidian plugin row; line 59 the three-packet list; line 61 the Obsidian checklist sentence; line 89 the Webflow and Obsidian paragraph; line 108 the sibling list; line 133 the Obsidian checklist folder row.
- **Change:** delete the Obsidian row, sentence and folder row, and reduce the lists to `sk-code-skilled`.
  ```text
  Line 26: replace the cell with `OpenCode skills, agents, commands, specs, MCP servers, scripts, config and language files`.
  Line 47: delete the `Webflow frontend files` row.
  Line 53: delete the Obsidian plugin row.
  Line 59: replace the three-packet list with `sk-code-skilled`.
  Line 61: delete the Obsidian sentence.
  Line 89: delete the Webflow sentence and the Obsidian sentence, keeping the OpenCode and spec-folder sentences.
  Line 108: replace the sibling list with `sk-code-skilled`.
  Line 133: delete the row.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/README.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/README.md || echo 0
  ```
  Expected: `8`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-quality/README.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/README.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/README.md || echo 0` → base/current grep returned 8 and 0.

### [x] T062 — Delete the minify case from the typo test

- **File:** `.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh`
- **Anchor:** line 12 `MINIFY_WEBFLOW="$SKILL/sk-code-webflow/assets/scripts/minify-webflow.mjs"`; line 89 `run_case "minify-webflow.mjs rejects a misspelled --forse flag"`; line 90 `run_in_dir "$case_dir" node "$MINIFY_WEBFLOW" --forse`.
- **Change:** delete the variable and the whole minify case.
  ```text
  Delete line 12.
  Delete lines 89 through 90 and the closing lines of that case block.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh || echo 0
  bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh >/dev/null && echo PASS
  ```
  Expected: `3`, then `0`, then `PASS`
- **AC:** AC-009
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh`
- **Stop if:** the test script exits non-zero after the deletion.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh || echo 0 && bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh >/dev/null && echo PASS` → base/current grep returned 3 and 0. typo-flags test printed PASS.

<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Phase 9: Feature catalog

### [x] T063 — Strip the catalog's live-surface claim

- **File:** `.skilled/skills/sk-code/feature-catalog/feature-catalog.md`
- **Anchor:** line 15 `bundles zero-or-more read-only SURFACE evidence packets (\`sk-code-webflow\`, \`sk-code-skilled\`, \`sk-code-obsidian\`)`; line 35, the sentence beginning `\`sk-code-webflow\`, \`sk-code-skilled\` and \`sk-code-obsidian\` are advisor-invisible SURFACE packets`.
- **Change:** reduce both lists to `sk-code-skilled`.
  ```text
  Line 15: replace the three-name list with `sk-code-skilled`.
  Line 35: replace the three-name list with `sk-code-skilled` and singularise the sentence.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/feature-catalog/feature-catalog.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/feature-catalog/feature-catalog.md || echo 0
  ```
  Expected: `2`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/feature-catalog/feature-catalog.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/feature-catalog/feature-catalog.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/feature-catalog/feature-catalog.md || echo 0` → base/current grep returned 2 and 0.

### [x] T064 — Fix the two-axis explainer's worked example

- **File:** `.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`
- **Anchor:** line 26, the paragraph that contains `The SURFACE axis is read-only domain evidence` and `A prompt such as "review my webflow animation for jank" resolves to the ordered bundle \`[sk-code-review, sk-code-webflow]\`.`.
- **Change:** reduce the axis to one surface and replace the worked example.
  ```text
  Replace the three-name list with `sk-code-skilled`.
  Replace `A prompt such as "review my webflow animation for jank" resolves to the ordered bundle `[sk-code-review, sk-code-webflow]`.` with `A prompt such as "review my typescript module for jank" resolves to the ordered bundle `[sk-code-review, sk-code-skilled]`.`
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md || echo 0` → base/current grep returned 1 and 0.

<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:phase-10 -->
## Phase 10: Review mode

### [x] T065 — Strip the review mode's SKILL.md

- **File:** `.skilled/skills/sk-code/sk-code-review/SKILL.md`
- **Anchor:** line 39 and line 42 the three-packet list; line 58 `(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)`; lines 224-231 the `OBSIDIAN_*` and `WEBFLOW_*` marker constants; line 234 the docstring; lines 246-247 the `in_src` helper; lines 251-264 the Obsidian branch, the non-Webflow guard and the Webflow branch; line 375 `[SKILLED | OBSIDIAN | WEBFLOW | UNKNOWN]`; line 499 the three-packet list.
- **Change:** collapse the detection pseudocode to SKILLED or UNKNOWN.
  ```text
  Lines 39 and 42: replace the three-packet list with `sk-code-skilled`.
  Line 58: replace `(SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN)` with `(SKILLED > UNKNOWN)`.
  Lines 224-231: delete all eight constants.
  Line 234: replace with `"""Return SKILLED or UNKNOWN, in the shared contract's precedence.`
  Lines 246-247: delete the `in_src` helper, which no branch uses after the deletion below.
  Lines 251-264: delete the Obsidian branch, the non-Webflow guard and the Webflow branch, leaving the SKILLED early return and the final `return "UNKNOWN"`.
  Line 375: replace with `**Surface evidence used**: [SKILLED | UNKNOWN]`
  Line 499: replace the three-packet list with `sk-code-skilled`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-review/SKILL.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-review/SKILL.md || echo 0
  ```
  Expected: `24`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-review/SKILL.md`
- **Stop if:** the second count is not `0`, or `detect_surface_evidence` no longer returns SKILLED for a `.skilled/` path.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-review/SKILL.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-review/SKILL.md || echo 0` → base/current grep returned 24 and 0. Detection returned SKILLED.

### [x] T066 — Strip the review mode's README

- **File:** `.skilled/skills/sk-code/sk-code-review/README.md`
- **Anchor:** line 153 the three-packet table row; line 188 the three-packet answer.
- **Change:** replace both lists with `sk-code-skilled`.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-review/README.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-review/README.md || echo 0
  ```
  Expected: `2`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-review/README.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-review/README.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-review/README.md || echo 0` → base/current grep returned 2 and 0.

### [x] T067 — Fix the review core's surface pairing

- **File:** `.skilled/skills/sk-code/sk-code-review/references/review-core.md`
- **Anchor:** line 68, the line beginning `- Detected code surface -> \`SKILLED\`, \`OBSIDIAN\` or \`WEBFLOW\``.
- **Change:** replace the line.
  ```text
  - Detected code surface -> `SKILLED`, paired with its `sk-code` evidence packet (`sk-code-skilled`); unsupported or unclear surfaces -> `UNKNOWN`. Detection follows the shared contract, [`stack-detection.md`](../../shared/references/stack-detection.md) section 2.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-review/references/review-core.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-review/references/review-core.md || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-review/references/review-core.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-review/references/review-core.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-review/references/review-core.md || echo 0` → base/current grep returned 1 and 0.

<!-- /ANCHOR:phase-10 -->

---

<!-- ANCHOR:phase-11 -->
## Phase 11: Hub tests and scripts

### [x] T068 — Rewrite the surface-hint test fixtures

- **File:** `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`
- **Anchor:** line 22 `const WEBFLOW_TESTING = 'Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks.';`; line 23 `const WEBFLOW_LANGUAGE = 'Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.';`; line 24 `const OBSIDIAN_WEBFLOW = 'obsidian plugin webflow implementation';`; line 65 `assert.deepEqual(modes(route), ['sk-code-skilled', 'sk-code-webflow']);`; line 89 `assert.deepEqual(modes(route), ['sk-code-review', 'sk-code-webflow', 'sk-code-skilled']);`; line 112 `assert.deepEqual(modes(JSON.parse(hinted.stdout)), ['sk-code-webflow', 'sk-code-skilled']);`
- **Change:** rewrite the fixtures and the assertions to the one-surface hub.
  ```text
  Line 22: `const SKILLED_TESTING = 'Add an integration test and unit test coverage plan for a TypeScript advisor module, including vitest checks.';`
  Line 23: `const SKILLED_LANGUAGE = 'Check a TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.';`
  Line 24: delete `OBSIDIAN_WEBFLOW`; replace every use with `SKILLED_TESTING`.
  Rename every remaining `WEBFLOW_TESTING` to `SKILLED_TESTING` and every `WEBFLOW_LANGUAGE` to `SKILLED_LANGUAGE`.
  Line 65: expect `['sk-code-skilled']`.
  Line 72: expect `['sk-code-skilled']`.
  Line 76: expect `['sk-code-skilled']`.
  Line 81: iterate `['UNKNOWN', 'not-a-surface', '']`.
  Line 89: expect `['sk-code-review', 'sk-code-skilled']`.
  Line 112: expect `['sk-code-skilled']`.
  Delete the `REVIEW_TWO_SURFACES` two-surface case and keep one single-surface review case.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/bin/tests/compiled-route-surface-hint.test.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/bin/tests/compiled-route-surface-hint.test.cjs || echo 0
  node .skilled/bin/tests/compiled-route-surface-hint.test.cjs >/dev/null && echo PASS
  ```
  Expected: `22`, then `0`, then `PASS`
- **AC:** AC-009
- **Rollback:** `git checkout 42b41dd286 -- .skilled/bin/tests/compiled-route-surface-hint.test.cjs`
- **Stop if:** the test exits non-zero after the rewrite.
- **Drift:** Replaced the remaining WEBFLOW hint with SKILLED and corrected the stale undefined test fixture. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/bin/tests/compiled-route-surface-hint.test.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/bin/tests/compiled-route-surface-hint.test.cjs || echo 0 && node .skilled/bin/tests/compiled-route-surface-hint.test.cjs >/dev/null && echo PASS` → token counts returned 22 and 0. Test printed PASS.

### [x] T069 — Prune the canary fixture

- **File:** `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- **Anchor:** the `cases` entries with ids `surface-bundle-reference` (line 60), `surface-bundle-obsidian` (79), `surface-collision-obsidian-over-webflow` (92), `surface-collision-obsidian-over-webflow-implementation` (105), `surface-hint-absent-webflow-testing` (117), `surface-hint-webflow-testing` (129), `surface-hint-absent-webflow-language` (142), `surface-hint-webflow-language` (154), `surface-hint-webflow-over-obsidian` (167), `single-webflow` (228), `single-obsidian` (260).
- **Change:** delete those eleven case objects, each from its opening `{` through its closing `},`, and leave the remaining seven cases valid JSON.
  ```text
  Delete the eleven case objects listed in the Anchor, from the bottom of the array upward.
  Keep `single-quality`, `single-quality-restraint`, `single-review`, `single-opencode`, `ambiguous-leaf`, `zero-leaf-signal` and `forbidden-request`.
  Change nothing else in the file.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json | grep -ciE 'sk-code-(webflow|obsidian)'
  rg -ci 'sk-code-(webflow|obsidian)' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json || echo 0
  node -e "const f=require('./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json');console.log(f.cases.length)"
  ```
  Expected: `50`, then `0`, then `7`
- **AC:** AC-012
- **Rollback:** `git checkout 42b41dd286 -- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- **Stop if:** the case count is not `7`, or the JSON throws.
- **Drift:** The control expected 50 and returned 22. There were 18 cases before editing and 7 remain. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json | grep -ciE 'sk-code-(webflow|obsidian)' && rg -ci 'sk-code-(webflow|obsidian)' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json || echo 0 && node -e "const f=require('./.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json');console.log(f.cases.length)"` → token counts returned 22 and 0. Case count returned 7.

### [x] T070 — Copy the canary fixture over its authored twin

- **File:** `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- **Anchor:** the twin at that path, which today matches the live fixture byte for byte.
- **Change:** copy the live fixture over the twin.
  ```bash
  cp .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
  ```
- **Proof:**
  ```bash
  diff .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json && echo IDENTICAL
  ```
  Expected: `IDENTICAL`
- **AC:** AC-012
- **Rollback:** `git checkout 42b41dd286 -- specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- **Stop if:** `diff` prints anything.
- **Evidence:** `diff .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json && echo IDENTICAL` → live fixture and authored twin compared IDENTICAL.

### [x] T071 — Neutralize the canary router's surface-label comment

- **File:** `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`
- **Anchor:** line 233, `// label such as WEBFLOW or as a workflowMode. Only a declared surface packet`.
- **Change:** replace `WEBFLOW` with `SKILLED`. Change the comment only; `hintedSurface` and every code line stay as they are.
  ```text
  // label such as SKILLED or as a workflowMode. Only a declared surface packet
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs | grep -aciE 'webflow|obsidian'
  rg -aci 'webflow|obsidian' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs || echo 0
  ```
  Expected: `1`, then `0`
- **AC:** AC-012
- **Rollback:** `git checkout 42b41dd286 -- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`
- **Stop if:** the second count is not `0`, or a code line changed.
- **Evidence:** `git show 42b41dd286:.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs | grep -aciE 'webflow|obsidian' && rg -aci 'webflow|obsidian' .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs || echo 0` → base/current WEBFLOW count returned 1 and 0.

### [x] T072 — Collapse the replay library's surface prefixes

- **File:** `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs`
- **Anchor:** line 485 `// Which surface a resource belongs to, by its on-disk path prefix. Webflow and`; line 488 `// sk-code-webflow/{references,assets}/animation/; it is matched FIRST so it stays a`; line 490 `// than collapsing into WEBFLOW's broader sk-code-webflow/ prefix. Everything else`; line 493, the `MOTION:` prefix entry; line 494 `WEBFLOW: ['sk-code-webflow/']`; line 504 `// the prose stack-detection contract: OpenCode system code wins, then Webflow`; line 508 `const webflow = /src\/2_javascript|\bwebflow\b|\.webflow\b|--vw-/.test(taskLower);`; line 509 `if (opencode && webflow) return 'MIXED';`; line 511 `if (webflow) return 'WEBFLOW';`; line 516 `// folder. Webflow deliberately has no sub-detection (a frontend task spans`; line 610 `const hasSurfaceLayout = mapResources.some((r) => r.startsWith('sk-code-webflow/references/'))`.
- **Change:** keep only the SKILLED prefix and collapse detection to SKILLED or UNKNOWN.
  ```text
  Line 485: replace with `// Which surface a resource belongs to, by its on-disk path prefix.`
  Lines 488-490: rewrite the comment so it describes the SKILLED prefix only.
  Line 493: delete the MOTION prefix entry.
  Line 494: delete the WEBFLOW prefix entry.
  Line 504: replace with `// the prose stack-detection contract: OpenCode system code wins.`
  Line 508: delete the `webflow` regex line.
  Line 509: delete the `MIXED` branch, because one surface leaves nothing to mix.
  Line 511: delete the branch that returns `WEBFLOW`.
  Line 516: replace with `// folder. The surface deliberately has no sub-detection.`
  Line 610: replace the check with one that tests for `sk-code-skilled/references/`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs || echo 0
  ```
  Expected: `11`, then `0`
- **AC:** AC-009
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs`
- **Stop if:** the second count is not `0`.
- **Drift:** Removed stale Motion/MIXED overlay descriptions and branches so replay logic matches the remaining SKILLED surface. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs || echo 0` → base/current token counts returned 11 and 0.

### [x] T073 — Remove the dead surface literals from the router-sync guard

- **File:** `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`
- **Anchor:** line 33 `const SURFACES = ['sk-code-webflow', 'sk-code-skilled'].filter(onDisk);`; line 34 `const SURFACE_PACKETS = new Set([...SURFACES, ...['sk-code-obsidian'].filter(onDisk)]);`; line 135 the prose regex `/`((?:shared|references|assets|webflow|opencode|animation)\/[^`*{}\s]+\.md)`/g`.
- **Change:** drop the removed literals and the dead regex alternative.
  ```text
  Line 33: `const SURFACES = ['sk-code-skilled'].filter(onDisk);`
  Line 34: `const SURFACE_PACKETS = new Set([...SURFACES]);`
  Line 135: replace `(?:shared|references|assets|webflow|opencode|animation)` with `(?:shared|references|assets|opencode)`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs || echo 0
  node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | tail -1
  ```
  Expected: `3`, then `0`, then `router-sync: 5/5 checks passed`
- **AC:** AC-005
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`
- **Stop if:** the guard prints a `FAIL` leg.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs || echo 0 && node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | tail -1` → token counts returned 3 and 0. router-sync reported 5/5 checks passed.

### [x] T074 — Rewrite the router-sync test's fixtures

- **File:** `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`
- **Anchor:** line 102 `'"DEMO": ["sk-code-webflow/references/w.md", "sk-code-skilled/references/o.md",'`; line 109 `for (const [surface, doc] of [['sk-code-webflow', 'w.md'], ['sk-code-skilled', 'o.md']]) {`; line 153 the two-id `ids` array; line 162 `assert.doesNotMatch(fail.out, /sk-code-webflow/);`; line 165 the test name `leg 1a scans the prose maps from the first map heading when the Webflow map is gone`.
- **Change:** rebuild each fixture around the one shipped surface and keep both the passing and failing legs.
  ```text
  Line 102: `'"DEMO": ["sk-code-skilled/references/o.md",'`
  Line 109: `for (const [surface, doc] of [['sk-code-skilled', 'o.md']]) {`
  Line 153: `const ids = ['sk-code/sk-code-skilled/sk-code-skilled/surface/evidence-base'];`
  Line 162: `assert.doesNotMatch(fail.out, /sk-code-skilled/);`
  Line 165: replace the test name with `leg 1a scans the prose maps from the first map heading when a map is absent`.
  Rename every `w.md` fixture reference to a file the Skilled packet owns, so the failing leg still fails for the intended reason.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs || echo 0
  node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs 2>&1 | grep -E '^# fail'
  ```
  Expected: `5`, then `0`, then `# fail 0`
- **AC:** AC-009
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`
- **Stop if:** the test reports a non-zero fail count.
- **Drift:** Kept archived-mode skip coverage with a generic archived identifier after the single-surface fixture removed its archived example. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs || echo 0 && node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs 2>&1 | grep -E '^# fail'` → token counts returned 5 and 0. Node reported pass 9 and fail 0.

### [x] T075 — Rewrite the doc-claims test's fixtures

- **File:** `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs`
- **Anchor:** line 58 `'and \`references/local.md\`. The sibling sk-code-webflow packet and \`sk-code-review\` stay valid.',`; lines 61, 62, 97, 100, 106 and 109 name the retired `code-webflow`, which the checker exists to detect and which stays.
- **Change:** rewrite the fixture text and keep one case that still proves a stale surface count fails.
  ```text
  Line 58: replace with `'and `references/local.md`. The `sk-code-review` mode stays valid.',`
  Leave lines 61, 62, 97, 100, 106 and 109 unchanged: their `code-webflow` text is the retired name the checker must still detect.
  Keep the case whose expected finding is a stale surface count.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN'
  rg -c 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN' .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs || echo 0
  node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs 2>&1 | grep -E '^# fail'
  ```
  Expected: `1`, then `0`, then `# fail 0`
- **AC:** AC-009
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs`
- **Stop if:** the test reports a non-zero fail count.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs | grep -cE 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN' && rg -c 'sk-code-(webflow|obsidian)|WEBFLOW|OBSIDIAN' .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs || echo 0 && node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs 2>&1 | grep -E '^# fail'` → token counts returned 1 and 0. Node reported pass 14 and fail 0.

<!-- /ANCHOR:phase-11 -->

---

<!-- ANCHOR:phase-12 -->
## Phase 12: External consumers

### [x] T076 — Empty the doctor's example-surface list

- **File:** `.skilled/commands/doctor/scripts/parent-skill-check.cjs`
- **Anchor:** line 1229, `const SK_CODE_EXAMPLE_SURFACES = ['sk-code-obsidian', 'sk-code-webflow'];`
- **Change:** replace the array and rewrite the comment above it at lines 1223-1228 so it stops describing two shipped example surfaces.
  ```text
  Line 1229: `const SK_CODE_EXAMPLE_SURFACES = [];`
  Lines 1223-1228: rewrite the comment to say the list is empty because the hub ships no example surface, and the check still fails a hand-added surface that sorts after the native one.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/commands/doctor/scripts/parent-skill-check.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/commands/doctor/scripts/parent-skill-check.cjs || echo 0
  node .skilled/commands/doctor/scripts/parent-skill-check.cjs | tail -1
  ```
  Expected: `1`, then `0`, then `OK: parent-skill-check — all hard invariants passed`
- **AC:** AC-010
- **Rollback:** `git checkout 42b41dd286 -- .skilled/commands/doctor/scripts/parent-skill-check.cjs`
- **Stop if:** the check prints a failure.
- **Evidence:** `git show 42b41dd286:.skilled/commands/doctor/scripts/parent-skill-check.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/commands/doctor/scripts/parent-skill-check.cjs || echo 0 && node .skilled/commands/doctor/scripts/parent-skill-check.cjs | tail -1` → proof returned 1 and 0. Parent-skill check reported all hard invariants passed with 0 warnings.

### [x] T077 — Rewrite the doctor invariants test

- **File:** `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`
- **Anchor:** line 491 `addNamedSurfaces(hub, ['sk-code-skilled', 'sk-code-obsidian', 'sk-code-webflow', 'sk-code-acme']);`; line 494 `assert.doesNotMatch(output, /^FAIL: 5l:.*sk-code-(obsidian|webflow)/m);`; line 500 `addNamedSurfaces(hub, ['sk-code-skilled', 'sk-code-obsidian', 'sk-code-webflow']);`
- **Change:** rebuild both cases around the three-packet hub.
  ```text
  Line 491: `addNamedSurfaces(hub, ['sk-code-skilled', 'sk-code-acme']);`
  Line 494: `assert.doesNotMatch(output, /^FAIL: 5l:.*sk-code-acme/m);`
  Line 500: `addNamedSurfaces(hub, ['sk-code-skilled']);`
  Keep the first case's assertion that a hand-added `sk-code-acme` after `sk-code-skilled` fails, and the second case's assertion that the shipped order passes.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs || echo 0
  node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs 2>&1 | grep -E '^# fail'
  ```
  Expected: `3`, then `0`, then `# fail 0`
- **AC:** AC-010
- **Rollback:** `git checkout 42b41dd286 -- .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`
- **Stop if:** the test reports a non-zero fail count.
- **Drift:** The added assertion contradicted the preceding FAIL assertion. The obsolete assertion was deleted because its two excused example surfaces were removed. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs || echo 0 && node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs 2>&1 | grep -E '^# fail'` → the corrected invariant suite reported pass 109 and fail 0.

### [x] T078 — Rename the leaf-resource fixture surface

- **File:** `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs`
- **Anchor:** line 355 `const parsed = contract.qualifiedIdToLeaf('sk-code/sk-code-webflow/sk-code-webflow/surface/evidence-base');`; lines 358-359 the two assertions on `sk-code-webflow`; line 366 the `modeIndex` key; lines 375-392 the map and mismatch cases.
- **Change:** rename the fixture surface to `sk-code-acme` everywhere in the file.
  ```text
  Replace every occurrence of `sk-code-webflow` with `sk-code-acme`.
  Keep every assertion's shape and expected values otherwise unchanged.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs || echo 0
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs >/dev/null && echo PASS
  ```
  Expected: `8`, then `0`, then `PASS`
- **AC:** AC-010
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs`
- **Stop if:** the test exits non-zero.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs || echo 0 && node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs >/dev/null && echo PASS` → base/current grep returned 8 and 0. Contract test printed PASS.

### [x] T079 — Fix the adopter upgrade reference

- **File:** `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`
- **Anchor:** line 54 `or Webflow evidence versus OpenCode evidence, are distinct jobs`; line 72 `Surface packets \`sk-code-webflow\` and \`sk-code-skilled\` are read-only evidence.`; line 122 `@markdown /create:skill-parent sk-code create --modes quality,review --surfaces webflow,opencode`; line 130 `Optional surface packets from \`--surfaces\` as **bare-noun** folders (\`webflow\`, \`opencode\`)`; line 134 `the live \`sk-code\` hub use hub-prefixed surface folders (\`sk-code-webflow\`, \`sk-code-skilled\`)`.
- **Change:** two replacements.
  ```text
  Line 54: replace `or Webflow evidence versus OpenCode evidence, are distinct jobs` with `or two different surface evidence sets, are distinct jobs`.
  Line 72: replace `Surface packets `sk-code-webflow` and `sk-code-skilled` are read-only evidence.` with `The surface packet `sk-code-skilled` is read-only evidence.`
  Line 122: replace `--surfaces webflow,opencode` with `--surfaces acme,opencode`.
  Line 130: replace `(`webflow`, `opencode`)` with `(`acme`, `opencode`)`.
  Line 134: replace `(`sk-code-webflow`, `sk-code-skilled`)` with `(`sk-code-acme`, `sk-code-skilled`)`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md || echo 0
  ```
  Expected: `5`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md || echo 0` → base/current grep returned 5 and 0.

### [x] T080 — Repoint the recorded-picks fixture

- **File:** `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl`
- **Anchor:** lines 28-30, `{"row_id":"f020-010","order":0,"pick":"sk-code-webflow","status":"measured"}` and its two siblings.
- **Change:** repoint the three picks to a surviving mode that still makes the fixture's point.
  ```text
  Replace `"pick":"sk-code-webflow"` with `"pick":"sk-code-skilled"` on lines 28, 29 and 30.
  Keep every other field unchanged.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl | grep -cE 'sk-code-(webflow|obsidian)'
  rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl || echo 0
  python3 -c "import json;[json.loads(l) for l in open('.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl') if l.strip()]" && echo VALID
  ```
  Expected: `3`, then `0`, then `VALID`. The proof is case-sensitive on purpose: lines 13-15 name `mcp-obsidian`, which is another skill's mode and stays.
- **AC:** AC-010
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl`
- **Stop if:** the JSONL parse fails.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl | grep -cE 'sk-code-(webflow|obsidian)' && rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl || echo 0 && python3 -c "import json;[json.loads(l) for l in open('.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl') if l.strip()]" && echo VALID` → base/current grep returned 3 and 0. JSONL parse printed VALID.

### [x] T081 — Rebuild the README verdict baseline

- **File:** `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`
- **Anchor:** `BASELINE = TESTS / "code-folder/baseline-readme-verdicts.json"` at `test_readme_verdict_parity.py:20`.
- **Change:** run the generator, which rebuilds the baseline from every tracked README. Do not hand-edit the file.
  ```bash
  python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py --write
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json || echo 0
  python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py | tail -1
  ```
  Expected: `1`, then `0`, then `PARITY PASS: verdict diff is empty`
- **AC:** AC-010
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`
- **Stop if:** the parity test prints a diff.
- **Drift:** The original rg -ciE proof uses an invalid encoding flag. A valid rg -ci scan finds five D6-kept mcp-obsidian paths and no removed sk-code paths. The Proof's end state wins over the Change's line list within D6. D6 outranks this task's expected count.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json || echo 0 && python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py | tail -1` → generator rewrote the baseline for 975 tracked READMEs. The original control returned 15. The valid scan found 5 D6-kept mcp-obsidian paths and 0 removed sk-code paths. README parity printed PARITY PASS: verdict diff is empty.

### [x] T082 — Delete the dead cite-drift redirects

- **File:** `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json`
- **Anchor:** line 240 `"from": ".opencode/skills/sk-code/code-implement/references/webflow/",`; line 258 `"from": ".opencode/skills/sk-code/code-webflow/",`; line 259 `"to": ".opencode/skills/sk-code/sk-code-webflow/",`; line 276 `"from": ".opencode/skills/sk-code/webflow/",`; line 3960 `"from": "specs/sk-code/025-sk-code-obsidian-surface/",`.
- **Change:** delete both redirect objects, including their `from` and `to` lines and their surrounding braces.
  ```text
  Delete the three redirect objects that form one chain: lines 240-241, 258-259 and 276-277.
  Delete the object at lines 3960-3961.
  ```
  The three objects are one chain: an old path redirects to `webflow/references/`, which redirects to `code-webflow/`, which redirects to `sk-code-webflow/`. With the packet gone the chain ends nowhere, so all three objects go.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json || echo 0
  node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json','utf8'))" && echo VALID
  ```
  Expected: `8`, then `0`, then `VALID`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json`
- **Stop if:** the JSON throws.
- **Drift:** The original rg -ciE proof uses an invalid encoding flag. The corrected rg -ci scan returns 0. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json || echo 0 && node -e "JSON.parse(require('fs').readFileSync('.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json','utf8'))" && echo VALID` → base/current grep returned 8 and 0. JSON parse printed VALID.

### [x] T083 — Delete the dead playbook allowlist rows

- **File:** `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`
- **Anchor:** line 33 `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook`; line 37 `.skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook`.
- **Change:** delete both lines.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt | grep -cE 'sk-code-(webflow|obsidian)'
  rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt || echo 0
  git diff --numstat -- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt
  ```
  Expected: `2`, then `0`, then `0	2	.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`. The proof is case-sensitive on purpose: line 30 names `mcp-obsidian`, which is another skill's playbook and stays.
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`
- **Stop if:** the numstat shows an insertion.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt | grep -cE 'sk-code-(webflow|obsidian)' && rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt || echo 0 && git diff --numstat -- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` → base/current grep returned 2 and 0. numstat reported 0 insertions and 2 deletions.

### [x] T084 — Delete the dead markdown-link allowlist row

- **File:** `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`
- **Anchor:** line 73 `'.skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md::/specs/005-example.com/024-performance-optimization/decision-record.md',`
- **Change:** delete the row, and the comment line above it when that comment describes only this row.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs || echo 0
  node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | tail -1
  ```
  Expected: `1`, then `0`, then `OK — 0 broken markdown links.`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`
- **Stop if:** the link check reports a broken link.
- **Drift:** The original rg -ciE proof uses an invalid encoding flag. The corrected scan returns 0 and the link checker reports 0 broken links. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs || echo 0 && node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | tail -1` → the valid corrected scan returned 0. Link check reported OK, 0 broken links across 7641 files and 13643 links.

### [x] T085 — Fix the root README's surface lines

- **File:** `README.md`
- **Anchor:** line 796, the bullet beginning `- One native surface and two optional examples.`; line 1418, the bullet beginning `- Keep the native Skilled surface, and remove or replace the optional example Webflow and Obsidian surfaces`; line 1419 `- Motion.dev is an animation overlay inside the Webflow surface, not a surface of its own`; line 1481, the paragraph beginning `` `sk-code` ships one native surface and two optional examples. `` and ending `replace with your own stack.`
- **Change:** rewrite the four lines.
  ```text
  Line 796: `- One native surface. The native Skilled surface covers this framework's own code: scripts, MCP servers, agents, commands and skills`
  Line 1418: `- Keep the native Skilled surface, and add a surface of your own for another stack (Next.js + Tailwind + Postgres, React Native + Reanimated, Go + sqlc, etc.)`
  Line 1419: delete the line.
  Line 1481: `` `sk-code` ships one native surface. The Skilled surface holds the standards for this framework's own code, so keep it. Add a surface of your own when you want the hub to carry another stack.``
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:README.md | sed -n '790,800p;1410,1425p;1475,1490p' | grep -ciE 'webflow|obsidian'
  sed -n '790,800p;1410,1425p;1475,1490p' README.md | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `4`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- README.md`
- **Stop if:** the section check is not `0`, or line 851, 856, 860, 1342 or 1373 was touched; those are `mcp-tooling`'s Webflow and Obsidian MCP rows and stay.
- **Evidence:** `git show 42b41dd286:README.md | sed -n '790,800p;1410,1425p;1475,1490p' | grep -ciE 'webflow|obsidian' && sed -n '790,800p;1410,1425p;1475,1490p' README.md | grep -ciE 'webflow|obsidian' || echo 0` → base/current grep returned 4 and 0.

### [x] T086 — Fix the skill index line

- **File:** `.skilled/skills/README.txt`
- **Anchor:** line 60, the `sk-code` row, which begins `| [\`sk-code\`](sk-code/README.md) | Unified two-axis code skill:`.
- **Change:** replace the surface list.
  ```text
  Replace `(`sk-code-webflow`, `sk-code-skilled`)` with `(`sk-code-skilled`)`.
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/README.txt | grep -cE 'sk-code-(webflow|obsidian)'
  rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/README.txt || echo 0
  ```
  Expected: `1`, then `0`. The proof is case-sensitive on purpose: line 53 names `mcp-obsidian`, which is another skill and stays.
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/README.txt`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/README.txt | grep -cE 'sk-code-(webflow|obsidian)' && rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/README.txt || echo 0` → base/current grep returned 1 and 0.

<!-- /ANCHOR:phase-12 -->

---

<!-- ANCHOR:phase-13 -->
## Phase 13: Graph metadata

### [x] T087 — Regenerate the derived metadata

- **File:** `.skilled/skills/sk-code/graph-metadata.json`
- **Anchor:** `key_files`, `source_docs` and `entities` at lines 223-254 today; the generator prunes them.
- **Change:** run the generator. It preserves `domains`, `intent_signals` and `derived`, which T088 to T092 edit by hand.
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/sk-code --write
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | grep -cE 'sk-code-(webflow|obsidian)'
  rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-code/graph-metadata.json || echo 0
  ```
  Expected: `19`, then `0`
- **AC:** AC-006
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/graph-metadata.json`
- **Stop if:** the generator exits non-zero.
- **Drift:** The immediate post-generator packet-name count was 1. The generator preserves fields edited by T088-T092, so the whole-file proof passes after those ordered edits. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | grep -cE 'sk-code-(webflow|obsidian)' && rg -c 'sk-code-(webflow|obsidian)' .skilled/skills/sk-code/graph-metadata.json || echo 0` → base/current packet-name proof returned 19 and 0 after T092.

### [x] T088 — Delete the surface domains

- **File:** `.skilled/skills/sk-code/graph-metadata.json`
- **Anchor:** line 56 `"webflow",` inside `domains`; line 81 `"obsidian-plugin"` inside `domains`.
- **Change:** delete both entries.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"domains": \[/,/\]/p' | grep -ciE 'webflow|obsidian'
  sed -n '/"domains": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `2`, then `0`
- **AC:** AC-006
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/graph-metadata.json`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"domains": \[/,/\]/p' | grep -ciE 'webflow|obsidian' && sed -n '/"domains": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0` → domain proof returned 2 and then 0.

### [x] T089 — Delete the surface intent signals

- **File:** `.skilled/skills/sk-code/graph-metadata.json`
- **Anchor:** lines 86, 126, 127, 128 and 129 inside `intent_signals`: `"webflow",`, `"obsidian plugin",`, `"obsidian plugin source",`, `"note database plugin",`, `"obsidian plugin design system",`.
- **Change:** delete all five entries.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"intent_signals": \[/,/\]/p' | grep -ciE 'webflow|obsidian'
  sed -n '/"intent_signals": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `5`, then `0`
- **AC:** AC-006
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/graph-metadata.json`
- **Stop if:** the second count is not `0`.
- **Drift:** Removed the additional obsidian plugin conventions entry because the section proof still found it. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"intent_signals": \[/,/\]/p' | grep -ciE 'webflow|obsidian' && sed -n '/"intent_signals": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0` → intent-signal proof returned 5 and then 0.

### [x] T090 — Delete the surface trigger phrases

- **File:** `.skilled/skills/sk-code/graph-metadata.json`
- **Anchor:** line 174 `"webflow frontend workflow",` and line 184 `"obsidian plugin",` inside `derived.trigger_phrases`.
- **Change:** delete both entries.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"trigger_phrases": \[/,/\]/p' | grep -ciE 'webflow|obsidian'
  sed -n '/"trigger_phrases": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `2`, then `0`
- **AC:** AC-006
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/graph-metadata.json`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"trigger_phrases": \[/,/\]/p' | grep -ciE 'webflow|obsidian' && sed -n '/"trigger_phrases": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0` → trigger-phrase proof returned 2 and then 0.

### [x] T091 — Delete the surface key topics

- **File:** `.skilled/skills/sk-code/graph-metadata.json`
- **Anchor:** line 190 `"webflow",` and line 206 `"obsidian-plugin"` inside `derived.key_topics`.
- **Change:** delete both entries.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"key_topics": \[/,/\]/p' | grep -ciE 'webflow|obsidian'
  sed -n '/"key_topics": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0
  ```
  Expected: `2`, then `0`
- **AC:** AC-006
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/graph-metadata.json`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | sed -n '/"key_topics": \[/,/\]/p' | grep -ciE 'webflow|obsidian' && sed -n '/"key_topics": \[/,/\]/p' .skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' || echo 0` → key-topic proof returned 2 and then 0. JSON parse printed VALID.

### [x] T092 — Rewrite the causal summary

- **File:** `.skilled/skills/sk-code/graph-metadata.json`
- **Anchor:** line 282, the `causal_summary` value, which contains `one of three read-only surface evidence packets (sk-code-webflow, sk-code-skilled, sk-code-obsidian)`.
- **Change:** replace the value with one that describes two workflow modes and one surface.
  ```text
  "causal_summary": "sk-code is the single public code skill that routes a request through mode-registry.json to two workflow modes (sk-code-quality, sk-code-review) or bundles one read-only surface evidence packet (sk-code-skilled) over a shared surface-detection router. The surface carries the shared implement/debug/verify workflow doctrine plus its stack knowledge. The shared router centralizes SKILLED and UNKNOWN identity and precedence so the advisor sees exactly one code identity.",
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-code/graph-metadata.json || echo 0
  ```
  Expected: `30`, then `0`
- **AC:** AC-006
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-code/graph-metadata.json`
- **Stop if:** the second count is not `0`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/graph-metadata.json | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-code/graph-metadata.json || echo 0` → whole-file proof returned 30 and 0. JSON parse printed VALID.

<!-- /ANCHOR:phase-13 -->

---

<!-- ANCHOR:phase-14 -->
## Phase 14: Hermes and manifests

### [x] T093 — Refresh the Hermes copies

- **File:** `.hermes/skills/sk-code*/`
- **Anchor:** the sync invocation documented at `.skilled/skills/sk-code/README.md:128`, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`.
- **Change:** run the sync. It rewrites the drifted copies and prunes the two removed packets.
  ```bash
  node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.hermes/skills/sk-code-webflow/SKILL.md | grep -ciE 'webflow|obsidian'
  ls .hermes/skills/ | grep -cE 'sk-code-(webflow|obsidian)' || echo 0
  rg -ci 'webflow|obsidian' .hermes/skills/sk-code* || echo 0
  ```
  Expected: `26`, then `0`, then `0`
- **AC:** AC-007
- **Rollback:** `git checkout 42b41dd286 -- .hermes`
- **Stop if:** the sync reports `STALE` entries after it ran without `--check`.
- **Evidence:** `git show 42b41dd286:.hermes/skills/sk-code-webflow/SKILL.md | grep -ciE 'webflow|obsidian' && ls .hermes/skills/ | grep -cE 'sk-code-(webflow|obsidian)' || echo 0 && rg -ci 'webflow|obsidian' .hermes/skills/sk-code* || echo 0` → base token count returned 26. No stale directories or token matches remained. Hermes check printed PASS: 66 Hermes skill copies in sync.

### [x] T094 — Rebuild the durable directory manifest

- **File:** `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`
- **Anchor:** `manifest_path = TESTS / "code-folder/durable-directory-manifest.json"` at `test_readme_manifest.py:20`.
- **Change:** run the generator. Do not hand-edit the file.
  ```bash
  python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write
  ```
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json | grep -ciE 'webflow|obsidian'
  rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json || echo 0
  python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py | tail -1
  ```
  Expected: `1`, then `0`, then `manifest=reproducible`
- **AC:** AC-010
- **Rollback:** `git checkout 42b41dd286 -- .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`
- **Stop if:** the manifest test reports a diff after `--write`.
- **Drift:** The original rg -ciE proof uses an invalid encoding flag. A valid rg -ci scan finds five D6-kept mcp-obsidian paths and no removed sk-code paths. The Proof's end state wins over the Change's line list within D6. D6 outranks this task's expected count.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json | grep -ciE 'webflow|obsidian' && rg -ci 'webflow|obsidian' .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json || echo 0 && python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py | tail -1` → generator wrote 776 directories. The original control returned 15. The valid scan found 5 D6-kept mcp-obsidian paths and 0 removed sk-code paths. Manifest test printed manifest=reproducible.

### [x] T095 — Close the doc-claims gate

- **File:** `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs`
- **Anchor:** `RETIRED_NAMES` at line 37; the four checks it runs.
- **Change:** run the gate and fix every dead path and stale surface count it lists, in the document it names. Do not edit the checker to silence a finding.
  ```bash
  node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs
  ```
- **Proof:**
  ```bash
  node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | tail -1
  ```
  Expected: `doc-claims: 4/4 checks passed`
- **AC:** AC-008
- **Rollback:** n/a: the task edits only the documents an earlier task owns, and each of those tasks carries its own rollback.
- **Stop if:** a finding names a file no earlier task owns; report it instead of editing that file.
- **Evidence:** `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | tail -1` → doc-claims printed doc-claims: 4/4 checks passed.

<!-- /ANCHOR:phase-14 -->

---

<!-- ANCHOR:phase-15 -->
## Phase 15: Verification and commit

### [x] T096 — Run the compiled-route surface-hint test

- **File:** `none`
- **Anchor:** `.skilled/bin/tests/compiled-route-surface-hint.test.cjs`, rewritten by T068.
- **Change:** none.
- **Proof:**
  ```bash
  node .skilled/bin/tests/compiled-route-surface-hint.test.cjs >/dev/null && echo PASS
  ```
  Expected: `PASS`
- **AC:** AC-009
- **Rollback:** n/a: read-only.
- **Stop if:** the command exits non-zero.
- **Evidence:** `node .skilled/bin/tests/compiled-route-surface-hint.test.cjs >/dev/null && echo PASS` → compiled-route surface-hint test printed PASS.

### [x] T097 — Run the router-sync test

- **File:** `none`
- **Anchor:** `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`, rewritten by T074.
- **Change:** none.
- **Proof:**
  ```bash
  node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs 2>&1 | grep -E '^# (pass|fail)'
  ```
  Expected: `# pass 7` and `# fail 0`
- **AC:** AC-009
- **Rollback:** n/a: read-only.
- **Stop if:** the fail count is not `0`.
- **Drift:** This Node version prints ℹ pass 9 and ℹ fail 0, not # pass 7 and # fail 0. The router-sync suite has 9 tests after T074. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs 2>&1 | grep -E '^# (pass|fail)'` → router-sync test printed ℹ pass 9 and ℹ fail 0.

### [x] T098 — Run the doc-claims test

- **File:** `none`
- **Anchor:** `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs`, rewritten by T075.
- **Change:** none.
- **Proof:**
  ```bash
  node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs 2>&1 | grep -E '^# (pass|fail)'
  ```
  Expected: `# fail 0`
- **AC:** AC-009
- **Rollback:** n/a: read-only.
- **Stop if:** the fail count is not `0`.
- **Evidence:** `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs 2>&1 | grep -E '^# (pass|fail)'` → doc-claims test printed ℹ pass 14 and ℹ fail 0.

### [x] T099 — Run the typo-flags test

- **File:** `none`
- **Anchor:** `.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh`, edited by T062.
- **Change:** none.
- **Proof:**
  ```bash
  bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh >/dev/null && echo PASS
  ```
  Expected: `PASS`
- **AC:** AC-009
- **Rollback:** n/a: read-only.
- **Stop if:** the script exits non-zero.
- **Evidence:** `bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh >/dev/null && echo PASS` → typo-flags test printed PASS.

### [x] T100 — Rebuild the advisor graph before probing

- **File:** `none`
- **Anchor:** `advisor_recommend` reads the existing graph and never rebuilds, so a probe against a pre-phase database proves nothing.
- **Change:** rebuild the tracked graph.
  ```bash
  node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true
  ```
- **Proof:**
  ```bash
  node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true >/dev/null && echo REBUILT
  ```
  Expected: `REBUILT`
- **AC:** AC-013
- **Rollback:** n/a: the graph is regenerated data, and the next rebuild restores it.
- **Stop if:** the rebuild exits non-zero.
- **Evidence:** `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true >/dev/null && echo REBUILT` → advisor graph rebuild printed REBUILT.

### [x] T101 — Run the doctor invariants test

- **File:** `none`
- **Anchor:** `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`, rewritten by T077.
- **Change:** none.
- **Proof:**
  ```bash
  node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs 2>&1 | grep -E '^# (pass|fail)'
  ```
  Expected: `# fail 0`
- **AC:** AC-010
- **Rollback:** n/a: read-only.
- **Stop if:** the fail count is not `0`.
- **Evidence:** `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs 2>&1 | grep -E '^# (pass|fail)'` → doctor invariants test printed ℹ pass 109 and ℹ fail 0.

### [x] T102 — Run the leaf-resource contract test

- **File:** `none`
- **Anchor:** `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs`, rewritten by T078.
- **Change:** none.
- **Proof:**
  ```bash
  node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs >/dev/null && echo PASS
  ```
  Expected: `PASS`
- **AC:** AC-010
- **Rollback:** n/a: read-only.
- **Stop if:** the test exits non-zero.
- **Evidence:** `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs >/dev/null && echo PASS` → leaf-resource contract test printed PASS.

### [x] T103 — Prove the hub still routes to the Skilled surface

- **Evidence:** after the T100 rebuild and the sk-code manifest refresh (`compiled-route-manifest.cjs refresh --hub sk-code` → `fresh`, generation 2, policy `9457a0d9…`), the proof prints `sk-code sk-code-skilled`. Verified 2026-10-24.
- **File:** `none`
- **Anchor:** the live advisor CLI at `.skilled/bin/skill-advisor.cjs`.
- **Change:** none.
- **Proof:**
  ```bash
  node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a typescript script"}' --format json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s).data.recommendations[0];console.log(r.skillId, r.compiledRoute.targets.map(t=>t.packetId).join(','))})"
  ```
  Expected: `sk-code sk-code-skilled`
- **AC:** AC-013
- **Rollback:** n/a: read-only.
- **Stop if:** the first recommendation is not `sk-code` or the target list is not `sk-code-skilled`.

### [x] T104 — Prove the D6 kept records are untouched

- **File:** `none`
- **Anchor:** the kept paths in the scope boundary of `spec.md`, narrowed to the records that survive the two deleted folders.
- **Change:** none. The proof covers only the surviving records: T004 deletes 20 `changelog/` and `benchmark/reports/` files inside `sk-code-webflow/` and 5 more inside `sk-code-obsidian/`, so a whole-tree diff over those four globs cannot be empty.
- **Proof:**
  ```bash
  git diff --name-only 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow/changelog/** .skilled/skills/sk-code/sk-code-webflow/benchmark/reports/** | wc -l
  git diff --name-only 42b41dd286 -- '.skilled/skills/sk-code/changelog/**' '.skilled/skills/sk-code/sk-code-quality/changelog/**' '.skilled/skills/sk-code/sk-code-review/changelog/**' '.skilled/skills/sk-code/sk-code-skilled/changelog/**' '.skilled/skills/sk-code/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-quality/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-review/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-skilled/benchmark/reports/**' '.skilled/changelog/**' '.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-*' '.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/**' | wc -l
  git diff --name-only 42b41dd286 -- 'specs/**/z_archive/**' | grep -vE 'canary-cases\.v1\.json|013-live-activation/activation/sk-code/manifest\.json' | wc -l
  ```
  Expected: `20`, then `0`, then `0`
- **AC:** AC-011
- **Rollback:** n/a: read-only.
- **Stop if:** the control count is not `20`, or either zero check is not `0`, because a kept record moved.
- **Drift:** The unfiltered archive diff includes the cli-external-orchestration activation manifest from commits 12fa1b7b60 and 0bf53bfadc in another packet. Excluding that file gives the phase-specific result 20, 0 and 0. The Proof's end state wins over the Change's line list within D6.
- **Evidence:** `git diff --name-only 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow/changelog/** .skilled/skills/sk-code/sk-code-webflow/benchmark/reports/** | wc -l && git diff --name-only 42b41dd286 -- '.skilled/skills/sk-code/changelog/**' '.skilled/skills/sk-code/sk-code-quality/changelog/**' '.skilled/skills/sk-code/sk-code-review/changelog/**' '.skilled/skills/sk-code/sk-code-skilled/changelog/**' '.skilled/skills/sk-code/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-quality/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-review/benchmark/reports/**' '.skilled/skills/sk-code/sk-code-skilled/benchmark/reports/**' '.skilled/changelog/**' '.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-*' '.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/anchor-repair-sample/**' | wc -l && git diff --name-only 42b41dd286 -- 'specs/**/z_archive/**' | grep -vE 'canary-cases\.v1\.json|013-live-activation/activation/sk-code/manifest\.json|013-live-activation/activation/cli-external-orchestration/manifest\.json' | wc -l` → phase-scoped D6 checks returned 20, 0 and 0 after excluding the unrelated cli-external-orchestration activation manifest.

### [x] T105 — Run the reviewer pass

- **Evidence:** SWE-2 review round 1: FAIL with one P1 (stale playbook index lines, see T053 drift) and two P2s recorded in the decision record; round 2 after the fix: PASS, 0 P0, 0 P1, 0 P2. `git status --porcelain` identical before and after both rounds. The reviewer marked AC-001 to AC-012 Met with the commands it ran.

- **File:** `none`
- **Anchor:** this folder's `tasks.md` and `acceptance-criteria.md`.
- **Change:** none. The review runs through the `subagent` tool with agent `review` (agent `deep-review` for a multi-dimension pass), read-only by instruction: the prompt says it edits no file. Capture `git status --porcelain` before and after and require the two to be identical. The reviewer reads the phase diff against `42b41dd286`, checks each task's proof output and reports findings ranked P0/P1/P2. A P0 finding returns to the owning task; the writer fixes it and the reviewer re-reads once. After the second round, remaining P2 findings are recorded in `implementation-summary.md` as known limitations.
- **Proof:**
  ```bash
  test -s specs/sk-code/013-private-surface-skills/002-hub-surface-removal/implementation-summary.md && echo PRESENT
  ```
  Expected: `PRESENT`, and the reviewer's report names each acceptance criterion `Met`, `Unmet` or `Waived` with the command it ran.
- **AC:** AC-014
- **Rollback:** n/a: read-only.
- **Stop if:** a P0 finding is still open after the second round.

### [x] T106 — Close the phase gate

- **File:** `none`
- **Anchor:** this folder.
- **Change:** none.
- **Proof:**
  ```bash
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict | tail -1
  ```
  Expected: `RESULT: PASSED`
- **AC:** AC-014
- **Rollback:** n/a: read-only.
- **Stop if:** the last line is not `RESULT: PASSED`.

### [x] T107 — Run the phase-wide closure greps

- **File:** `none`
- **Anchor:** AC-007 in `acceptance-criteria.md`.
- **Change:** none.
- **Proof:**
  ```bash
  git show 42b41dd286:.skilled/skills/sk-code/SKILL.md | grep -cE 'sk-code-(webflow|obsidian)'
  rg -c 'sk-code-webflow|sk-code-obsidian' .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor .skilled/skills/sk-doc README.md .skilled/skills/README.txt --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' || echo 0
  rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code* --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | wc -l
  ```
  Expected: `12`, then `0`, then `4`
- **AC:** AC-007
- **Rollback:** n/a: read-only.
- **Stop if:** the first count is not `12`, or the second command prints any path, or the third count is not `4`.
- **Evidence:** `git show 42b41dd286:.skilled/skills/sk-code/SKILL.md | grep -cE 'sk-code-(webflow|obsidian)' && rg -c 'sk-code-webflow|sk-code-obsidian' .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor .skilled/skills/sk-doc README.md .skilled/skills/README.txt --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' || echo 0 && rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code* --glob '!**/changelog/**' --glob '!**/benchmark/reports/**' | wc -l` → closure greps returned 12, 0 and 4.

### T108 — Commit and push last

- **File:** `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`
- **Anchor:** the manifest pair named in the hub README at `.skilled/skills/sk-code/README.md:114`.
- **Change:** stage the phase's tracked changes by path and commit with a prose body, with the hooks installed. The `git add` set covers the phase folder including new spec docs, tracked changes under `.skilled`, `README.md`, `.hermes` and the canary fixture's authored twin. The hook re-mints the compiled-routing manifest and copies it to its authored twin. If the hooks are not active, run the refresh by hand, then copy the manifest over its twin.
  ```bash
  git add -A specs/sk-code/013-private-surface-skills/002-hub-surface-removal
  git add -u .skilled README.md .hermes
  git add specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
  git commit -m "refactor(sk-code): remove the Webflow and Obsidian surfaces from the hub"
  node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code
  cp .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json
  git add .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json
  git commit --amend --no-edit
  git push HEAD:main
  ```
- **Proof:**
  ```bash
  git status --porcelain | wc -l
  diff .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json && echo IDENTICAL
  test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" && echo IN_SYNC
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/002-hub-surface-removal --strict | tail -1
  ```
  Expected: `0`, then `IDENTICAL`, then `IN_SYNC`, then `RESULT: PASSED`
- **AC:** AC-014
- **Rollback:** `git revert --no-edit HEAD` after the push, then re-run T106 and T107.
- **Stop if:** any proof line differs from Expected. No fix may follow this task: a finding that arrives after it is fixed and the commit amended before the push, never left uncommitted.

<!-- /ANCHOR:phase-15 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `verify-doc-claims.cjs` prints `doc-claims: 4/4 checks passed`
- [ ] Every suite in T096 to T102 exits 0
- [ ] T104 shows the D6 records byte-identical
- [ ] T105 reports every acceptance criterion `Met` or names the waiver
- [ ] T106 prints `RESULT: PASSED`
- [ ] T107 prints `12`, then `0`, then `4`
- [ ] T108 ran last: the commit is pushed to `main`, `git status --porcelain` is empty, and `git rev-parse HEAD` equals `git rev-parse origin/main`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Decision record**: See `decision-record.md`
- **Parent**: See `../spec.md`
- **Predecessor**: See `../001-ignore-and-commit-guard/`
- **Successor**: See `../003-advisor-vocabulary-cleanup/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: spec.md documents REQ-001 through REQ-010 in the requirements section.
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: plan.md defines the technical context, ordered approach, architecture and data flow.
- [ ] CHK-003 [P1] Dependencies identified and available
- [x] CHK-004 [P0] All three baselines from T003 captured before the first edit — Evidence: T003 recorded 158, 164 and 1338; 164 = 158 + 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `mode-registry.json` and `hub-router.json` parse and name only the three shipped packets — Evidence: AC-002 records the registry command output with only sk-code-quality, sk-code-review and sk-code-skilled, and one surface-axis entry.
- [ ] CHK-011 [P0] No hand edit to a generated file: `leaf-manifest.json`, the derived metadata, the README manifest, the Hermes copies and the compiled-routing manifest
- [ ] CHK-012 [P1] No planned code comment names a spec path, packet number or phase number
- [x] CHK-013 [P1] `ROUTER.md` section 11 has no key left with an empty path list — Evidence: router-sync reported 5/5 checks passed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] `verify-doc-claims.cjs` prints `doc-claims: 4/4 checks passed` — Evidence: verify-doc-claims.cjs printed doc-claims: 4/4 checks passed.
- [x] CHK-022 [P1] Every suite in T096 to T102 exits 0 — Evidence: T096-T102 reports show each suite exited 0.
- [x] CHK-023 [P1] The D6 kept records are byte-identical to `42b41dd286` — Evidence: T104 phase-scoped D6 comparisons returned 20, 0 and 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: both registries, the leaf manifest, `ROUTER.md` and every hub document that names a surface, grepped with both `sk-code-(webflow|obsidian)` and `WEBFLOW|OBSIDIAN`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: the doctor, the sk-doc fixtures and references, the baselines, the redirects, the allowlists and the README surface lines.
- [x] CHK-FIX-004 [P0] The router-projection invariant is tested: the parent map equals the union of the remaining surface maps, with no orphan key and no path that fails to resolve. — Evidence: router-sync reported 5/5 checks passed, including projection reconciliation.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: two surfaces x six consumer classes, every cell owned by a task.
- [ ] CHK-FIX-006 [P1] Hostile-state variant executed: `git add -f` of a removed-packet path is refused by the phase 001 guard.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No private content is written by this phase; the only content movement is a deletion from the tracked tree
- [ ] CHK-032 [P1] The commit guard from phase 001 is present and active before the commit
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria synchronized
- [ ] CHK-041 [P1] No planned code comment names this packet or phase
- [ ] CHK-042 [P2] The hub README's own removal procedure still describes what was done
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files live in `/tmp`, never in the repo tree, because `scratch/` is not gitignored and T108's proof requires an empty `git status --porcelain`
- [ ] CHK-051 [P1] `scratch/` holds nothing but its `.gitkeep` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 6/13 |
| P1 Items | 13 | 3/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---

---
title: "Feature Specification: Phase 3: nested-skilled-root"
description: "Three doctor scripts choose their own repository root by walking to the nearest .git or .opencode, so a framework copy one folder below another repository's git root reads the enclosing repository's .skilled tree instead of its own. This phase moves those three scripts onto the sentinel resolver Skilled already ships."
trigger_phrases:
  - "nested skilled root"
  - "phase 3 nested skilled root"
  - "doctor scripts repository root"
  - "vendored skilled below git root"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: nested-skilled-root

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-doctor-audit-followups |
| **Successor** | None |
| **Handoff Criteria** | The three scripts resolve a nested framework copy, the Skilled and linked-`.skilled` baselines are unchanged, and `validate.sh --strict` passes on this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of *Doctor command audit and the fixes it recorded*: making the doctor scripts find the folder that holds `.skilled` when it sits below another repository's git root.

**Scope Boundary**: Three doctor scripts and the tests that prove their root resolution. No other doctor script changes, and the freshness panel keeps its documented report-only exit contract.

**Dependencies**:
- `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs`, the sentinel resolver that ships as source.
- Node's synchronous `require()` of an ES module, which the repository's runtime already requires (`node >=22.12.0` at `.skilled/skills/system-spec-kit/runtime/cli/package.json:7`).

**Deliverables**:
- `lib/sk-skill-surface.cjs`, `skill-graph-freshness.cjs` and `parent-skill-check.cjs` resolving their root through the shared resolver.
- One doctor test file that builds a temporary git repository holding the framework copy one folder below its git root.
- The one command asset that repeats the `.git` default, corrected.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three doctor scripts choose the repository root themselves instead of using the resolver Skilled already ships. `lib/sk-skill-surface.cjs:84` and `skill-graph-freshness.cjs:46` walk up to the nearest `.git`, and `parent-skill-check.cjs:74` walks to the nearest `.opencode` with an arithmetic fallback. When a project vendors the framework one folder below another repository's git root, that answer is the enclosing repository, so the scripts read a `.skilled/skills` tree that is not theirs. The hub check then exits 2 with `HUB_NOT_FOUND`, and the freshness panel prints a panel error while exiting 0, which is a silent green.

### Purpose
Each script reads the framework copy it was launched from, resolved by the sentinel the runtime already uses, while the Skilled checkout and a project that links `.skilled` from a shared checkout keep resolving exactly as they do today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Measured by the orchestrator on 2026-11-01 from `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/coder`, whose framework copy sits one folder below the git root at `ai-speckit/`. The same two commands were re-run for this packet and printed the same output.

```text
$ cd /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/coder
$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-code-terraform --into-hub sk-code
HUB_NOT_FOUND: No hub directory was found for "sk-code".
exit=2

$ node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs
  panel error: ENOENT: no such file or directory, scandir '/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/.skilled/skills'
  (report-only — the canonical reindex is operator-gated; nothing was written)
exit=0

$ node -e "const {findRepoRoot}=require('./.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs'); console.log(findRepoRoot('.skilled/commands/doctor/scripts'))"
/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/coder
```

The first two results are the defect. The third is the same question asked of the resolver this proposal adopts: it already answers `coder`, the folder holding the framework source tree, because `coder/.skilled/skills/system-spec-kit/SKILL.md` exists.

One correction to the audit brief: `parent-skill-check.cjs` does not walk `.git`. It walks for `.opencode` (`:77`) and falls back to `path.resolve(start, '../../../..')` (`:80`). It passes from `coder` today because `coder` itself holds `.opencode`; its `REPO_ROOT` still assumes the tree sits at whatever folder that walk returns.

The baseline in the Skilled checkout, recorded in `scratch/baseline-before-change.md`, is a green hub report (`"hubPath": ".skilled/skills/sk-code"`), a freshness run with no panel error, and a parent-skill-check run with `0 warnings`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delegate root resolution in `lib/sk-skill-surface.cjs`, `skill-graph-freshness.cjs` and `parent-skill-check.cjs` to `shared/workspace/repo-root.mjs`, keeping every existing override and option.
- Audit what each script's root feeds, and cite the line each read is joined onto.
- Add one doctor test file whose fixture is a temporary git repository holding the framework copy one folder below its git root, plus the decoy `.opencode`, Skilled and linked-`.skilled` cases.
- Correct the one command asset that repeats the `.git` default as the script's behaviour.

### Out of Scope
- `release-update.cjs` - its root selection decides what an update reads and writes, which is a separate decision with its own release semantics.
- Worktree, hook and `sk-git` scripts - their `.git` answer is correct by design, because they operate on the enclosing repository.
- `sk-code-quality-config.cjs` - the quality config belongs to the checked project's repository, so its git root is the intended answer.
- The compiled-routing harness `build-artifacts.cjs` files - maintainer-only build inputs, not operator scripts.
- Refreshing Barter's vendored copy - it is a separate pin (`6f42c7b169`), so the fix is proven on the fixture instead.
- Freshness exit semantics - `panel error` stays exit 0 by default and exit 1 under `--strict`, the report-only contract documented at `skill-graph-freshness.cjs:15` and implemented at `:316`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Modify | Root walk at `:84` delegates to the shared resolver; `createContext` at `:105` keeps `repoRoot` and `startDir` overrides |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modify | Root walk at `:46` delegates; the `SKILL_GRAPH_FRESHNESS_ROOT` override at `:55` keeps precedence |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | `.opencode` walk at `:77` and arithmetic fallback at `:80` delegate; `REPO_ROOT` at `:82` is produced by the resolver |
| `.skilled/commands/doctor/scripts/tests/doctor-root-resolution.test.cjs` | Create | Nested, decoy, Skilled and linked-`.skilled` root cases for all three scripts |
| `.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml` | Modify | Replaces the `nearest ancestor of the script holding .git` sentence at `:51` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | From a framework copy one folder below a git root, `sk-skill-check.cjs check <skill> --into-hub <hub> --json` prints `"hubPath": ".skilled/skills/<hub>"` and prints no `HUB_NOT_FOUND` |
| REQ-002 | From the same tree, `skill-graph-freshness.cjs` prints no `panel error`, and the compiled stamp it reports is the fixture's stamp rather than the enclosing repository's |
| REQ-003 | From the same tree with a decoy `.opencode` at the git root, `parent-skill-check.cjs` prints a `Resolved:` line under the framework copy, prints no module-load error, and loads the shared contract libraries from that copy |
| REQ-004 | In the Skilled checkout, the three baseline commands in `scratch/baseline-before-change.md` reproduce their recorded output and exit codes |
| REQ-005 | In a project whose `.skilled` is a symlink to the Skilled checkout, all three scripts resolve the Skilled checkout and the freshness panel prints no `panel error` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The three scripts call `shared/workspace/repo-root.mjs`, and none of them keeps its own root walk; the git scripts in the same folder keep `git rev-parse`, whose git root is correct for them |
| REQ-007 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` passes, with no suite below its pre-change pass count |
| REQ-008 | Each script's header and `doctor-skill-graph-freshness.yaml:51` state the sentinel rule instead of the `.git` walk |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The nested fixture's hub check prints `"hubPath": ".skilled/skills/sk-code"`, where the same command exits 2 with `HUB_NOT_FOUND` before the change.
- **SC-002**: The nested fixture's freshness run prints no `panel error` and reports the fixture's own compiled stamp.
- **SC-003**: `rg -n "'\.git'" .skilled/commands/doctor/scripts` returns no line that selects a repository root.
- **SC-004**: The three Skilled baseline commands and the linked-`.skilled` case print the same verdicts after the change as before it.
- **SC-005**: `run-all.sh` reports every suite passing, with the `sk-skill-check` count at 58 and `sk-skill-convert` at 69 or higher.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `shared/workspace/repo-root.mjs` ships as source, before any build | The three scripts fail at load if it moves | Import it by a path relative to each script, as `review-research-paths.cjs:169` already does; a load assertion runs in the new test |
| Dependency | Synchronous `require()` of an ES module needs Node 20.19 or later | A Node below that floor exits with `ERR_REQUIRE_ESM` where the script used to run | The repository's runtime already declares `node >=22.12.0`; the dependency is stated in the plan and the packet's dependencies |
| Risk | The resolver prefers `.skilled` when both source names hold the sentinel | A tree where `.opencode` is the framework copy and `.skilled` is unrelated could flip the root | The fixture includes a decoy `.opencode` with no sentinel, so the preference is exercised rather than assumed |
| Risk | `findRepoRoot` is shared with `sk-skill-convert.cjs:108` and two test files' module-level `REPO_ROOT` | A wrong answer re-roots every path in that command and both suites | Run the `sk-skill-convert` suite and the `sk-skill-check` suite against their recorded baselines |
| Risk | A fixture that copies the scripts can pass while the shipped copy still walks `.git` | A green test that proves nothing | The fixture copies the scripts from the working tree at test time and runs the copies, and the negative control runs against the pre-change code |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Root resolution adds no process spawn: the `git rev-parse` fallback at `sk-skill-surface.cjs:90` is not carried over, because every caller passes the script's own directory inside the source tree, so a context build spawns one process fewer.
- **NFR-P02**: Resolution is a bounded walk of at most 14 directories with one `existsSync` per candidate, per `repo-root.mjs:40`.

### Security
- **NFR-S01**: No credential, token or network call is read or made by the resolver.
- **NFR-S02**: No script in scope writes a file; the freshness panel stays read-only, as its header states.

### Reliability
- **NFR-R01**: The resolver never throws, so no new failure path is added to any of the three scripts.
- **NFR-R02**: When no candidate holds the sentinel, resolution returns the folder above the outermost `.skilled` or `.opencode` segment rather than the enclosing git root.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a tree with no sentinel anywhere resolves to the folder holding its `.skilled` directory, never to the git root above it.
- Maximum input: two framework copies nested at different depths resolve to the nearer one, because the walk tests each directory before its parent.
- Failure path: a start path outside any source tree returns the start itself, so the script reports a missing skills tree instead of reading a git root above it.
- Both names present: when `.skilled` and `.opencode` each hold `skills/system-spec-kit/SKILL.md`, `.skilled` wins, which is the order `findSourceRoot` documents.
- Ancestor named `.skilled`: a path segment named `.skilled` above the repository is tested through `nearestSentinelHolder` before the hoist fallback runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three scripts, one test file, one asset line; no API or schema change |
| Risk | 10/25 | A shared helper is also used by `sk-skill-convert` and two suites; no data or auth surface |
| Research | 8/20 | The resolver already exists; the work is auditing three call sites and building a fixture |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Two calls that could have been questions are settled in Scope: the freshness panel keeps its report-only exit contract, and Barter's vendored copy is not refreshed by this packet.
<!-- /ANCHOR:questions -->

---

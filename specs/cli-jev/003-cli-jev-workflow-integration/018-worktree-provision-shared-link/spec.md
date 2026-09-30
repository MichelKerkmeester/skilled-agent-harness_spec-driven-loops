---
title: "Feature Specification: Phase 18: worktree-provision-shared-link"
description: "Worktree provisioning treats a package whose only dependencies are @spec-kit/* file links as having nothing to install, so sk-doc never gets its @spec-kit/shared link in a new worktree and parent-skill-check fails on every hub. This phase plans the sk-git fix with a fixture test and this worktree's one-time repair, which waits for the operator's yes."
trigger_phrases:
  - "worktree provision spec-kit link"
  - "sk-doc spec-kit shared link missing"
  - "wn deps satisfied spec-kit filter"
  - "parent-skill-check cannot find spec-kit shared"
  - "worktree provisioning skips sk-doc"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: worktree-provision-shared-link

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-deem-search-narrowing-arm |
| **Successor** | None |
| **Handoff Criteria** | `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` prints `FAIL=0` with three more passes than its baseline, and after the approved repair `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check` and exits 0 in this worktree |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the cli-jev workflow integration specification. The orchestrator found the defect on 2026-09-27 while planning phases 008 and 009, whose acceptance checks run `parent-skill-check.cjs`. No classifier is used and no model is called.

**Scope Boundary**: One function in `sk-git`'s provisioning script, `_wn_deps_satisfied` in `.skilled/skills/sk-git/scripts/worktree-naming.sh`, its comment block and the owner's hermetic test harness. The build also runs a one-time repair of this worktree's `sk-doc` dependency link, which is an install and waits for the operator's yes. `worktree-provision-paths.txt` already lists `.skilled/skills/sk-doc` and stays unchanged. No other skill, script or package changes.

**Dependencies**:
- None on other phases. The fix changes only `sk-git` files, and no other phase in this packet lists them
- Phases 008 and 009 depend on this one: their `parent-skill-check.cjs ... exits 0` checks cannot pass in a worktree provisioned today

**Deliverables**:
- A dependency check that installs a package whose only dependencies are `@spec-kit/*` links, and still skips a package that declares nothing
- Three new assertions in `scripts/tests/worktree-naming.test.sh`: a package with only a `file:` `@spec-kit` dependency is installed once, a package whose `@spec-kit` link exists while its real dependency is missing is installed, and a package that declares nothing is never installed
- A comment above `_wn_deps_satisfied` that states the rule for `@spec-kit/*` entries
- This worktree's `sk-doc` link, made by an approved install with a named rollback

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In this worktree, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` exits 1 with `FAIL: 12-lib: failed to load the root-router contract library: Cannot find module '@spec-kit/shared/frontmatter/parse-frontmatter.js'` (rerun 2026-09-27). The module is required at `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:65`. `.skilled/skills/sk-doc/package.json` declares one dependency, `"@spec-kit/shared": "file:../system-spec-kit/shared"`, and this worktree has no `.skilled/skills/sk-doc/node_modules`. The main checkout has `node_modules/@spec-kit/shared -> ../../../system-spec-kit/shared`, a link dated 2026-09-06. `_wn_deps_satisfied` (`worktree-naming.sh:479-499`) drops every name starting `@spec-kit/` at `:487`, then returns success at `:490` when nothing is left, so provisioning counts `sk-doc` as already present and never installs it. Three of the four checkouts in `git worktree list` lack the link. Only the main checkout has it.

### Purpose
A worktree provisioned by `worktree-naming.sh` gets `sk-doc`'s `@spec-kit/shared` link, so `parent-skill-check.cjs` loads its contract library in any worktree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `_wn_deps_satisfied`: when a package declares no dependency outside `@spec-kit/`, check its first `@spec-kit/*` entry with the same `node_modules` walk. A package with any other dependency is still checked by its first such dependency, and a package that declares nothing is still satisfied
- The comment block above the function, updated to say why `@spec-kit/*` entries come last
- Three assertions in the owner's harness, one for each behavior above
- One-time repair of this worktree's `sk-doc` link, after the operator's yes, with the rollback `rm -rf .skilled/skills/sk-doc/node_modules`

### Out of Scope
- Repairing the two other worktrees that lack the link - each can run `worktree-naming.sh provision` once the fix is on its branch
- Building `system-spec-kit/shared/dist` in a new worktree - the `shared` line in the path list names no build artifact, and whether another package's build produces it is UNKNOWN. Recorded as an open question
- The repository-root line `.` in `worktree-provision-paths.txt` - no `package.json` is tracked at the root, so provisioning skips that line in every worktree. Recorded as a finding for the owner
- The launch wrapper's own list and symlinking - `sk-git`'s SKILL.md rule 8 keeps it separate
- A changelog entry or version bump for `sk-git` - the two earlier provisioning fixes (`725d66c495`, `b946bc9e95`) shipped none

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modify | `_wn_deps_satisfied` falls back to the first `@spec-kit/*` entry when a package declares nothing else, and its comment block states the rule. Owner `sk-git` |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modify | Two fixture packages in the provisioning section, a stub `npm` that also makes `node_modules/@spec-kit/shared`, and three assertions. Owner `sk-git` |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` | Unchanged | Already lists `.skilled/skills/sk-doc` at line 40 |
| `.skilled/skills/sk-doc/node_modules/` | Create (untracked) | The approved repair makes the `@spec-kit/shared` link. Gitignored by `**/node_modules` (`.gitignore:51`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Install a package whose only declared dependencies are `@spec-kit/*` entries. When a package declares nothing outside `@spec-kit/`, `_wn_deps_satisfied` checks its first `@spec-kit/*` entry with the existing `node_modules` walk and reports unsatisfied when that entry is absent. A package that declares no dependency at all stays satisfied |
| REQ-002 | Keep the filter's intent. A package that declares any dependency outside `@spec-kit/` is checked by its first such dependency, never by a `@spec-kit/*` link, so a link found on the walk cannot mark an uninstalled package present. For the nine listed packages with a manifest, only `.skilled/skills/sk-doc` changes its result in this worktree |
| REQ-003 | Test all three behaviors in the owner's harness. A fixture declaring only `"@spec-kit/shared": "file:../shared"` is installed on the first run and skipped on the second. A fixture declaring `@spec-kit/shared` first and `left-pad` second, with only `node_modules/@spec-kit/shared` present, is installed. The existing `needs-build` fixture, which declares nothing, gets no install call. The harness prints `FAIL=0` with three more passes than its baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | State the rule in the comment block above `_wn_deps_satisfied`: a `@spec-kit/*` entry is a local link and proves an install only when the package declares nothing else. The comment carries no spec path, packet or phase number, or requirement id |
| REQ-005 | Repair this worktree once, only after the operator's yes. Rerun the read-only check first. If it reports only `sk-doc` unsatisfied, run `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision`, otherwise run `npm ci --no-audit --no-fund` in `.skilled/skills/sk-doc`. Rollback: `rm -rf .skilled/skills/sk-doc/node_modules`. The resulting link resolves inside this worktree, and `parent-skill-check.cjs .skilled/skills/sk-doc` exits 0 |
| REQ-006 | Keep the change inside its scope. The build's tracked diff holds only `worktree-naming.sh` and `worktree-naming.test.sh`, and the repair adds no tracked change |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` prints `FAIL=0` and a `PASS` count three higher than the baseline. The baseline measured on 2026-09-27 is `PASS=80 FAIL=0`, and the build remeasures it before editing
- **SC-002**: After the approved repair, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK: parent-skill-check` and exits 0 in this worktree
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Owner contracts. `sk-git` owns both files and its SKILL.md rule 8 (line 365) sets the invariant that no shared path resolves back to the source checkout. `sk-git` routes code and tests to `sk-code` (SKILL.md line 101), so the shell edit follows `sk-code`'s OpenCode shell standards | A fix that links from the main checkout would break rule 8 | The repair installs. REQ-005 checks that the link's real path is inside this worktree |
| Dependency | Recent owner work. `git log -5` on the two files lists `b946bc9e95` (2026-09-24, provisioning builds listed outputs) as the newest. No uncommitted change under `.skilled/skills/sk-git` at authoring time | A concurrent edit to the provisioning section would conflict | The build reruns `git log` and `git status` on both files before editing |
| Risk | `system-spec-kit/shared` exposes `./*.js` as `./dist/*.js`, so the link helps only when `shared/dist` is built. This worktree has `shared/dist/frontmatter/parse-frontmatter.js` | In a new worktree the check could still fail after the link exists | The repair step tests that the file exists before it runs. A new worktree's `dist` stays an open question |
| Risk | The fallback walk could find a `@spec-kit/*` link in an ancestor `node_modules` | A package could read as present when its own link is absent | Node resolves the require through the same walk, so an ancestor link also serves the require. None of `.skilled/skills/node_modules`, `.skilled/node_modules/@spec-kit` or `node_modules` exists here |
| Risk | The repair is an install | It writes an untracked tree | Operator yes first, the rollback named in REQ-005, and a read-only rerun of the check so it installs `sk-doc` only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new process. The fallback stays inside the existing `node -e` call, one per listed package
- **NFR-P02**: A provisioned worktree adds no work on a second run. `sk-doc` is skipped once its link exists

### Security
- **NFR-S01**: The check only reads `package.json` and tests directories. It never follows a link to write
- **NFR-S02**: The link the repair makes resolves inside this worktree, never to the main checkout

### Reliability
- **NFR-R01**: A `package.json` that cannot be parsed still returns non-zero, as today (`worktree-naming.sh:485`)
- **NFR-R02**: A dangling `@spec-kit/*` link reads as absent, because `[ -d ]` follows the link, so provisioning reinstalls it
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a `package.json` with no `dependencies` or `devDependencies` stays satisfied by definition
- Maximum length: not applicable. Only the first chosen name is checked
- Invalid format: an unreadable or malformed `package.json` returns 1 and the package is installed, as today

### Error Scenarios
- External service failure: a failed `npm ci` is counted in `failed` and provisioning exits non-zero, as today
- Network timeout: not applicable to the check. The `sk-doc` install resolves a local `file:` link from its lockfile
- Concurrent access: not applicable. The check only reads

### State Transitions
- Partial completion: if only the code fix lands, the next `provision` run installs `sk-doc`. If only the repair runs, this worktree works and new worktrees still skip `sk-doc`
- Session expiry: not applicable
- A package lists `@spec-kit/*` entries only under `devDependencies`: the fallback reads both maps, as the existing merge at `worktree-naming.sh:486` does
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Two files in one skill, about 5 changed lines of JavaScript inside a shell function, a comment and about 15 test lines |
| Risk | 7/25 | Every worktree creation runs this check. One install needs the operator's yes |
| Research | 2/20 | The cause, affected package and baseline are measured |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Owner decision (`sk-git`): should a brand-new worktree be proven end to end?** Option A, what this phase plans: the fixture test plus this worktree's repair through the fixed `provision`, which installs `sk-doc` from nothing. It costs no new worktree. Option B: also create a throwaway worktree, provision it and run `parent-skill-check.cjs`. It proves the `shared/dist` question too, but it installs every listed package and needs its own rollback (remove the throwaway worktree with `git worktree remove --force` and delete its branch). Recommendation: A, with B only if the owner wants the `dist` answer
- Does provisioning a new worktree build `system-spec-kit/shared/dist`? UNKNOWN. The `shared` line names no artifact, and whether a listed build produces it was not checked
- The `.` line in `worktree-provision-paths.txt` names a root `package.json` that `git ls-files package.json` does not list. Is the line stale, or does the owner expect an untracked root manifest?
<!-- /ANCHOR:questions -->

---


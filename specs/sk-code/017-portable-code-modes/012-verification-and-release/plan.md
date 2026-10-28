---
title: "Implementation Plan: Phase 12: verification-and-release"
description: "Six shipped playbook scenarios run from one worktree with their deviations recorded, this repository's quality config lands at the skill-folder path, and the framework and skill changelogs carry the settings move with their version carriers stepped."
trigger_phrases:
  - "verification and release plan"
  - "end-to-end playbook run plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: verification-and-release

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash playbook scenarios, Node.js CommonJS doctor scripts, Markdown release records and YAML workflow fixtures |
| **Framework** | None |
| **Storage** | `repository/quality.json` inside the sk-code-quality skill folder, and the changelog tree |
| **Testing** | The shipped playbook scenarios run from the worktree, `devin` for the three live review runs, and the doctor, guard and sync commands for the in-repository checks |

### Overview
Each playbook scenario is read for its fixture, its steps and its pass criteria, then run from the worktree with its fixture at a fixed path outside the repository, and every command, output and exit code is written to `scratch/e2e/`. The three review scenarios run their live step through `devin`, so each file names that executor and the scaffolding it needed. The release half writes this repository's quality config, the framework and skill changelogs, and steps the carriers that name a version.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `rg -c 'VERDICT: PASS' scratch/e2e/*.md` prints one hit in each of the six files
- [x] `/doctor:sk-code quality status` prints `STATUS=OK SOURCE="repo" TRUST=trusted` with `Errors: none`, exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Playbook runs plus release records.

### Key Components
- **The six scenario files**: `sk-code-quality/manual-testing-playbook/quality-gate/`, `sk-code-review/manual-testing-playbook/foreign-repository-rules/` and `sk-code-ci/manual-testing-playbook/foreign-repository/` own the fixtures, the steps and the pass criteria.
- **The recorded runs**: `scratch/e2e/` holds one file per scenario with its command block, verbatim output, exit codes, pass criteria and deviations.
- **`repository/quality.json`**: this repository's quality config, read by `sk-code-quality-config.cjs` and the quality gate.
- **The changelog set**: `.skilled/changelog/skilled/v4.0.0.17.md` and the three skill entries, with the `SKILL.md` carriers and the compiled route that follows them.

### Data Flow
A scenario builds its fixture from heredocs, runs the shipped scripts against it, and compares the output with its own pass criteria. The recording keeps the command and the output side by side, so a later reader can rerun one step without reconstructing the fixture. The release half reads the version carrier, writes the changelog beside it, and re-mints the compiled route from the carrier so the served policy and the doc agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/foreign-repository/foreign-repository-profile.md` | Builds the fixture that runs the copied CI scripts | update | Line 80 copies `repository-identity.cjs`; `scratch/e2e/ci-foreign-repository-profile.md:295` records the pass |
| `.skilled/commands/doctor/scripts/lib/ci-profile.cjs` | Requires the identity helper at load | not a consumer of this phase's change | The fixture change supplies the helper; the script is unchanged |
| `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` | This repository's quality config | create | `sk-code-quality-config.cjs status` prints `STATUS=OK SOURCE="repo" TRUST=trusted`, exit 0 |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Carry the sk-code version | update | Each reads `3.9.17.0` |
| `.hermes/skills/sk-code*/SKILL.md`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Mirrors and graph built from the carriers | update | The graph freshness check exits 0; the Hermes sync check reads 67 copies in sync |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Serves the compiled sk-code policy | update | `compiled-route-guard.cjs --json` reads `"failures": 0`, exit 0; `compiled-route-sync.cjs --check` reads all 55 copies match |

Required inventories:
- Same-class producers: `rg -n 'repository-identity' .skilled/skills/sk-code .skilled/commands/doctor` names the helper, its loader and the fixture copy.
- Consumers of changed symbols: `rg -n '3\.9\.17\.0|1\.1\.9\.0|1\.13\.11\.0' .skilled/skills/sk-code` names each carrier and its changelog.
- Matrix axes: six scenarios across three modes, each with its own fixture, and four release records across two tracks.
- Algorithm invariant: a scenario's recorded output is the output its command block produced, and a deviation is written where it happened rather than in a summary.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the six scenarios and captures this repository's starting state. Implementation runs the six scenarios and records them, copies the identity helper into the CI fixture, writes the quality config and the four changelogs, and re-mints the compiled route. Verification reruns the in-repository checks and confirms every verdict, version and carrier.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The quality gate's override and hygiene behavior, and the CI profile's foreign-repository behavior, through their own fixtures | `node` over the playbook heredocs |
| Integration | The three review scenarios end to end, including the resolver, the review and both report checkers | `devin 3000.11.228` with `deepseek-v4-1-flash-max`, `check-review-final-line.js`, `check-review-findings.js` |
| Manual | The in-repository CI report, the protected-workflow toggle, the quality config read, the setup battery and the routing guards | `ci-report.cjs`, `ci-toggle.cjs`, `sk-code-quality-config.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs`, `skill-graph-freshness.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `devin` CLI 3000.11.228 and the `deepseek-v4-1-flash-max` model | External | Green | The three review scenarios cannot be rerun live; their recorded runs stand as the evidence |
| Node.js and `bash` for the doctor scripts and the playbook heredocs | Internal | Green | No scenario or check can run |
| A fixture root outside the worktree | Internal | Green | A fixture inside the repository would be linted by the repository's own checks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scenario that passes only through its recorded scaffolding, or a release note that describes behavior the code does not have.
- **Procedure**: Revert the commit. The recorded runs and changelogs are additive, the fixture change is one copy line, and deleting `repository/quality.json` returns the quality read to source `none`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---

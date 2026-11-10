---
title: "Implementation Plan: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases"
description: "This plan records the Node.js runtime policy update across pins, CI, package engine declarations and stated minimums. It uses the 2026-11-10 release index to select the newest release on each supported line and records the supplied test and doctor outcomes."
trigger_phrases:
  - "node security patch update plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js package metadata, GitHub Actions YAML, shell scripts and CommonJS tests |
| **Framework** | None |
| **Storage** | package.json and package-lock.json metadata |
| **Testing** | node-engine-resolver and mcp-code-mode-launcher suites, mcp-doctor and YAML parsing |

### Overview
Move the Code Mode server pin to 24.22.2 and update every setup-node step to Node 22. Raise the package engine floors and sync their lockfile copies, then update the stated minimums, diagnostic floor and launcher test range. The supplied verification records the suite outcomes, YAML parsing and doctor results without adding command invocations that were not provided.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: spec.md records the security notice, selected floors and excluded machine cleanup.
- [x] Success criteria measurable. Evidence: spec.md names the 37 setup-node steps, ten package manifests and 14 lockfile entries.
- [x] Dependencies identified. Evidence: spec.md records the Node.js release index and npm engine-warning behavior.

### Definition of Done
- [x] All acceptance criteria met. Evidence: every row in acceptance-criteria.md is Met.
- [x] Test suites report 21 passed and 1 failed, with the direct-server failure matching the pre-change result. Evidence: implementation-summary.md Verification.
- [x] Docs updated (spec/plan/tasks). Evidence: this packet contains the completed spec, plan, tasks and acceptance criteria.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Shared runtime version policy

### Key Components
- **Package engine declarations and locks**: Set the supported patched floors consistently across ten manifests and seven lockfiles.
- **Pins and CI**: Use Node 24.22.2 for the Code Mode server pin and Node 22 for all setup-node steps.
- **Diagnostics and documentation**: State the supported floors and make the launcher test expect the updated range.

### Data Flow
The 2026-11-10 release index establishes the newest patched releases. Those floors feed the Code Mode pin, CI versions, package engine ranges, lockfile entries, documentation, doctor diagnostic and launcher expectation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Ten package.json files and seven package-lock.json files | Own the declared Node engine policy | Update | Nine manifests use ^22.23.4 \|\| ^24.22.1 \|\| >=26.12.1. The Code Mode server uses >=24.22.1 <25.0.0. Fourteen lock entries were synced. |
| .nvmrc and 37 setup-node steps | Select the local and CI runtimes | Update | .nvmrc is 24.22.2. All 37 setup-node steps name 22. |
| Node 20 rerun blocks in opencode-plugin-tests.yml and sk-code-script-tests.yml | Repeat suites for the former Node 20 support floor | Remove | Both blocks were removed and both workflow files still parse as YAML. |
| CONTRIBUTING.md, system-spec-kit READMEs, doctor scripts and launcher test | Publish and check the supported floors | Update | The stated minimums, diagnostic floor and expected range constant were changed. mcp-doctor passed on the listed interpreters. |

Required inventories:
- Same-class producers: the ten package manifests listed in spec.md section 3 produce the declared engine ranges. Seven package-lock files carry 14 synchronized entries.
- Consumers of changed policy: all 37 setup-node steps, the Code Mode launcher, mcp-doctor, the doctor test runner hint and the three stated-minimum documents.
- Matrix axes: supported lines 22, 24 and 26 at their patched floors, earlier releases on those lines and excluded lines 20, 23 and 25. The supplied facts do not include a per-boundary test transcript.
- Version invariant: package ranges exclude Node 20, 23 and 25 and releases below the patched floor on supported lines. The Code Mode launcher selects a matching interpreter and needs Node 24.22.1 or newer on the 24 line. npm warns rather than fails when engine-strict is unset.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | node-engine-resolver and mcp-code-mode-launcher | The supplied result is 21 passed and 1 failed. The direct-server test failure matches the pre-change result because mcp-server dependencies are absent. Exact command invocations were not supplied. |
| Integration | Node engine diagnostics and workflow syntax | mcp-doctor printed the two reported PASS lines. Both affected workflow files parse as YAML. |
| Manual | Install patched Node lines and repoint the local node link | nvm installed 22.23.4, 24.22.2 and 26.13.0. ~/.local/bin/node points to the nvm 26.13.0 binary. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js release index | External source | Confirmed on 2026-11-10 | Without the index, the newest releases on the supported lines could not be confirmed. |
| nvm and the local node link | Machine tooling | Updated with operator approval | Without the patched interpreters, the local diagnostic and launcher checks could not use the selected versions. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: A patched release or updated engine floor prevents a required supported workflow from running.
- **Procedure**: Revert the commit carrying the repository changes. Remove the three installed nvm versions with nvm uninstall. Restore ~/.local/bin/node with ln -sfn ~/.hermes/node/bin/node ~/.local/bin/node.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Release index and approved floors | Blocks implementation choices |
| Implementation | Setup | Blocks final checks |
| Verification | Implementation | Blocks packet closure |
<!-- /ANCHOR:phase-deps -->

---


---
title: "Feature Specification: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases"
description: "An October 2026 security notice asked maintainers to move Node.js pins and supported engine floors to patched releases and remove older versions. The repository still had an old Code Mode pin, Node 20 CI jobs and package minimums below the patched releases."
trigger_phrases:
  - "node security patch update"
  - "move every node js pin ci job"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Move every Node.js pin, CI job and declared minimum to the patched October 2026 releases

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-10 |
| **Branch** | `worktrees/336-subtrack-gap-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The October 23, 2026 security notice asked everyone to use patched Node.js releases and remove older versions kept by version managers. The repository still pinned Code Mode to 24.9.0, ran Node 20 jobs and declared package minimums below the patched releases, while Node 20 had no later patched release.

### Purpose
Use Node 22 in CI and pin the Code Mode server to 24.22.2, declare the patched floors on supported lines, and remove CI coverage that only existed for Node 20 support.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
N/A: no single command represents this multi-file runtime policy change. The reported verification outcomes are recorded in implementation-summary.md.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Pin the Code Mode server to Node 24.22.2 and use Node 22 for all 37 setup-node steps.
- Raise the declared Node.js engine floors in ten package manifests and sync 14 entries across seven package-lock files.
- Update stated minimums, diagnostics and the launcher test range to match the patched releases.

### Out of Scope
- Update the separate Node copy at ~/.hermes/node - it belongs to the Hermes agent and is still v26.8.2.
- Change the mcp-tooling bridge scripts that use npx with a third-party Node 18 floor - that floor does not declare package support.
- Rewrite workflow comments about Node 22 behavior - they remain accurate and were not part of the change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-code-mode/mcp-server/.nvmrc` | Modify | Pin the local Code Mode server to 24.22.2 |
| `.github/workflows/` including `opencode-plugin-tests.yml` and `sk-code-script-tests.yml` | Modify | Move 15 setup-node steps from 20 to 22 and remove the two Node 20 rerun blocks |
| Ten affected `package.json` files | Modify | Set the patched supported engine floors, including the Code Mode server's 24-only range |
| Seven affected `package-lock.json` files | Modify | Sync 14 copies of the updated engine ranges |
| `CONTRIBUTING.md`, `.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-spec-kit/shared/README.md` | Modify | Raise the stated Node.js minimums |
| `commands/doctor/scripts/tests/run-all.sh`, `commands/doctor/scripts/mcp-doctor.sh` | Modify | Update the install hint and diagnostic minimum |
| `.skilled/bin/mcp-code-mode-launcher.test.cjs` | Modify | Align the expected engine range with the package declaration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The ten affected package manifests must reject Node 20, 23 and 25 and releases below the patched floor on supported Node 22, 24 and 26 lines. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The Code Mode pin, all 37 CI setup-node steps, lockfile copies, stated minimums and launcher range must agree with the selected patched releases, and redundant Node 20 reruns must be removed. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Code Mode server pins 24.22.2 and all 37 setup-node steps name 22. The two Node 20 rerun blocks are absent and both workflow files parse as YAML.
- **SC-002**: Ten package manifests declare the selected floors and seven package-lock files contain 14 synchronized entries. Stated minimums and the launcher expectation match those floors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node.js release index | Without it, newest patch releases could not be confirmed | Use the 2026-11-10 release index confirmation recorded for this work |
| Risk | npm does not set engine-strict, so an unsupported runtime can produce a warning instead of a failing install | Package engine metadata alone does not stop every npm install | Keep the launcher range check and CI runtime aligned with the declared floors |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: this change does not run a service or change a request path.
- **NFR-P02**: N/A: this change does not process requests or set a throughput target.

### Security
- **NFR-S01**: Package engine ranges exclude Node 20, 23 and 25 and releases below the patched floors on Node 22, 24 and 26.
- **NFR-S02**: The Code Mode launcher must select a supported interpreter and cannot start without Node 24.22.1 or newer on the 24 line.

### Reliability
- **NFR-R01**: N/A: this change does not operate a service with an uptime target.
- **NFR-R02**: N/A: this change does not define a service error-rate target.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: N/A: the change updates version declarations and does not process an empty user input.
- Maximum input: N/A: the change does not impose a request-size or collection limit.
- Failure path: npm warns when a package engine range is not met because engine-strict is not set. The Code Mode launcher cannot start without a supported Node 24 interpreter.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | N/A | The operator supplied Level 2. No scoring worksheet was included in the approved facts. |
| Risk | N/A | The operator supplied Level 2. No scoring worksheet was included in the approved facts. |
| Research | N/A | The operator supplied Level 2. No scoring worksheet was included in the approved facts. |
| **Total** | **N/A** | **Level 2 supplied by the operator** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The operator selected the release floors and packet scope on 2026-11-10.
<!-- /ANCHOR:questions -->

---



---
title: "Feature Specification: Phase 8: doctor-and-ci"
description: "Nothing repeatable proves that the repo's plugins load on OpenCode 1.19.3 and 2.0.32. This phase adds a doctor battery, a route doc and a CI workflow that run the same proof on each pinned version."
trigger_phrases:
  - "doctor and ci"
  - "phase 8 doctor and ci"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: doctor-and-ci

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `scaffold/008-doctor-and-ci` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 11 |
| **Predecessor** | 007-install-guidance-and-setup-helper |
| **Successor** | 009-sk-code-opencode-alignment |
| **Handoff Criteria** | Hands to 009 when AC-001 to AC-003 in acceptance-criteria.md are Met, and the route is either registered or held under an operator decision recorded in the log. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: A doctor battery, its tests, its route doc, and a CI workflow. The route entry in `_routes.yaml` is in scope only when the operator settles open question Q1. Plugin code belongs to 002 and 003. The sk-code drift guards belong to 009. The public claim belongs to 011. The advisor bridge is not in the brief (Q2).

**Dependencies**:
- 007-install-guidance-and-setup-helper (predecessor). The CI job installs the two pinned CLI packages directly, so it does not depend on the helper.
- 002 and 003. The battery passes only when all 16 repo plugins load. Before those phases land, a live run is a baseline, not an acceptance result.
- `research/iterations/iteration-017.md` (the check list and the doctor design), `research/iterations/iteration-015.md` F2 (the package names), and `research/research.md` section 7 (verification).
- The doctor folder's test runner, `.skilled/commands/doctor/scripts/tests/run-all.sh`, which runs every `*.test.cjs` suite in that folder.

**Deliverables**:
- `opencode-version-battery.cjs`, with one leg per check and an exit taxonomy that matches the doctor battery convention.
- Its tests, in the doctor tests folder, so `run-all.sh` picks them up.
- The battery's documentation in the doctor scripts README, in place of the route doc `opencode.md`, which waits for Q1 (amended at build time, `scratch/decisions.txt` 15).
- The CI workflow `opencode-dual-version.yml`, kept local and unpushed.
- The route entry in `_routes.yaml`, held until Q1 is settled.

**Executor**: Code (the battery, its tests and the workflow) goes to GPT-6 Luna max fast through cli-codex. The route doc goes to DeepSeek V4.1 Flash max through cli-devin. Each reviews the other's output. The orchestrator runs the battery against both installed versions, the broken-copy proof and actionlint, because those runs start real OpenCode processes.

**Frozen decisions that bind this phase**:
- D3: the family is matched to the parsed major of each candidate binary. A v2 child probe uses `--standalone`.
- D4: the battery never starts, stops or restarts the v2 background service. It makes only GET calls to a service that is already running. The CI job is the one place where a runner owns its own install, and Q5 governs it.
- D5 and D8: the CI pins are the two CLI packages, `opencode-ai@1.19.3` and `@opencode/cli@2.0.32`. The public claim waits for 011.
- D6: the executor split stated above.
- D7: the battery follows `sk-code/sk-code-opencode`. The route doc follows the sk-doc command mode.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No repeatable check proves that the repo's plugins load on the pinned versions. Version 1 reports a failed plugin load only in its log, and `opencode debug config` lists the plugin files without loading any of them (research section 7, iteration-017 F3). Version 2 reports plugin state only through its API. The doctor router has no OpenCode route, so the proof today is a manual sequence of commands.

### Purpose
A repeatable two-version battery shows, for each pinned version, that every repo plugin loads and that the repo's skills are visible. A CI workflow runs the same battery on fresh installs of each version.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The battery with a v1 leg (the resolved plugin list, and an import harness that loads each plugin through its v1 entry) and a v2 leg (the plugin and skill lists from a private server the battery starts and stops). (amended at build time, `scratch/decisions.txt` 2 and 3)
- Family selection from the parsed `--version` output, and a SKIP for any family that is not installed.
- The battery's tests, with fixtures, so the battery runs without a real OpenCode binary.
- The battery's documentation in the doctor scripts README (the route doc waits for Q1, `scratch/decisions.txt` 15).
- The CI workflow with a matrix of the two pinned packages and a both-version isolation job, linted with actionlint.
- A broken-copy proof in `scratch/`, deleted afterwards.

### Out of Scope
- The route entry in `_routes.yaml`, the workflow asset it names, the presentation row and the `setup.md` leg. The brief does not list them. They wait for Q1.
- The advisor bridge activation (`scoring-compatibility.json`). It waits for Q2.
- The bogus-model smoke leg from iteration-017 item 5 (Q8).
- Pushing the workflow or committing it. It stays local and unpushed.
- Plugin code, and any change to the plugins to make them load.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Create | The battery. |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Create | Fixture tests for each leg and the exit taxonomy. Proposed, see Q9. |
| `.skilled/command-support/doctor/scripts/README.md` | Modify | The battery's documentation: flags, legs, exit codes and mutation boundary. It replaces the route doc `.skilled/commands/doctor/opencode.md`, which would register a live command and waits for Q1 (amended at build time, `scratch/decisions.txt` 15). |
| `.github/workflows/opencode-dual-version.yml` | Create | The CI workflow. It stays local and unpushed. |
| `.skilled/commands/doctor/_routes.yaml` | Modify, held | The `/doctor:opencode` route. Only after Q1. |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Resolve the adapter inside `dualPlugin(...)`, a regression from phase 002 that fails three doctor tests (added at build time, `scratch/decisions.txt` 12). |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | One test for the `dualPlugin(...)` export form (added at build time, decision 12). |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/008-doctor-and-ci/scratch/` | Create, then delete | The broken copy of the plugins and the live battery output. |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The battery exits 0 on OpenCode 1.19.3 with family v1 and on 2.0.32 with family v2. The exit codes are 0 for pass, 1 for fail, 2 for usage or crash, and 3 for degraded or skipped. |
| REQ-002 | The v1 leg lists every top-level plugin file in `.opencode/plugins`. It requires each file among the `plugin_origins` of `opencode debug config`, and it loads each file in a child node process through its v1 entry with a v1-shaped input, naming every file that fails. OpenCode 1.19.3 logs no plugin line, so there is no log window to read (amended at build time, `scratch/decisions.txt` 2). |
| REQ-003 | The v2 leg starts a private `opencode2 serve` on a free port with its own database and data folder, reads `/api/plugin` and `/api/skill` with a raw, percent-encoded query, writes each response to a file, and repeats the plugin read until two consecutive non-zero counts match, at most 15 reads 2 s apart. Every top-level plugin file must have an entry under the root with the status `active` (amended at build time, `scratch/decisions.txt` 3 and 6). |
| REQ-004 | The battery matches the requested family to the parsed major of each candidate binary. It does not infer the family from a binary name. |
| REQ-005 | The battery never runs `opencode run`, and it never starts, stops or restarts the shared v2 service. It stops the private server it starts, on every exit path, and it never prints that server's password (amended at build time, `scratch/decisions.txt` 3). |
| REQ-006 | A repo plugin broken on purpose in a throwaway copy makes the battery exit 1 and name that plugin. |
| REQ-007 | The CI workflow passes actionlint, installs each pinned package in its own npm prefix, and runs the battery with `--json`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | When a family is not installed, its leg reports SKIP and the exit is 3. The battery never reports that family as FAIL. A private server that cannot start is DEGRADED, not SKIP (amended at build time, `scratch/decisions.txt` 3). |
| REQ-009 | The battery is documented in `.skilled/command-support/doctor/scripts/README.md`, and that README passes the sk-doc readme check. The `/doctor:opencode` command file waits for Q1 with its route entry (amended at build time, `scratch/decisions.txt` 15). |
| REQ-010 | The battery's tests run under `run-all.sh` with no change to that runner. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The battery exits 0 on each pinned version, and its JSON summary shows no FAIL, DEGRADED or SKIP leg.
- **SC-002**: The broken-copy run exits 1 and names the broken plugin.
- **SC-003**: actionlint exits 0 with no output on the workflow.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A model-free v1 load trigger (Q4) | `debug config` loads nothing. Without a trigger, the v1 load leg has no log line to read. | The first probe settles it. With no trigger, the v1 leg reports DEGRADED, and AC-001 stays Unmet. |
| Dependency | A running v2 service for `/api/plugin` (Q5) | D4 forbids starting the service. With none running, the v2 leg cannot read. | The v2 leg reads only a running service and reports SKIP otherwise. The orchestrator decides the CI case before the workflow is wired. |
| Dependency | Plugins 002 and 003 are not built | The battery reports FAIL on unported plugins. | A live run before those phases is a baseline, and it does not close AC-001. |
| Risk | The v1 log window contains an earlier run | An old failure line reads as a current failure. Iteration-017 F2 saw eight old failures in one log. | Read only the bytes after the offset recorded before the trigger. A shrinking log is DEGRADED. |
| Risk | The route entry without its workflow asset breaks route validation | The schema requires a `yaml:` asset, and the manifest fails. | The route entry is held until Q1. |
| Risk | The workflow file is untracked, and a broad `git add` could stage it | The file reaches a branch before review. | The workflow is never staged or committed in this phase. The final check lists it as untracked. |
| Risk | The battery and the resolver in 006 read the version differently | Two tools disagree about one binary. | The battery's version rule is the one in 006, and a fixture test pins both to the same list. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The battery reads `debug config` once, into a file. It reads the log once per leg. The v2 read repeats no more than the fixed bound.

### Security
- **NFR-S01**: The battery spawns each binary with an argv array, never a shell string. Its only writes go to the output path, the JSON summary when `--json` is set, and one temporary folder for the private server's database and data, removed on exit (amended at build time, `scratch/decisions.txt` 3).

### Reliability
- **NFR-R01**: Each leg reports PASS, FAIL, DEGRADED or SKIP with a reason. No leg reports PASS from a config read alone.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A single-version machine: the missing family is SKIP, and the exit is 3.
- Both families requested on one binary: the battery reports SKIP for the family that is not present, and it never reports FAIL.
- Zero plugin files in `.opencode/plugins`: FAIL, because an empty plugin folder is not a healthy repo.
- A plugin symlink with a missing target: FAIL, and the battery names the file.

### Error Scenarios
- The v2 counts never match across the bounded reads: DEGRADED, with the counts printed.
- The private v2 server prints no listening line or no password within its start timeout: DEGRADED, and the battery stops it.
- The output path is not writable: exit 2.
- An unknown argument: usage text and exit 2.

### State Transitions
- Partial completion: if the v1 leg passes and the v2 leg is SKIP, the exit is 3, and the summary names both results.
- Session expiry: not applicable. The battery keeps no state between runs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One battery, one test file, one route doc, one workflow, and a held route entry |
| Risk | 18/25 | Two live hosts, a shared v2 service, and log windows |
| Research | 9/20 | The endpoints and flags are measured. The v1 trigger and the v2 service rule are open. |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q1. Route assets (blocks the route entry).** The `_routes.yaml` schema requires a `yaml:` asset for each route, and the manifest's add-a-target steps name a router, a presentation row and a `setup.md` leg. The brief names only the route doc. Options: (a) the orchestrator widens the scope to add `assets/doctor-opencode.yaml`, the presentation row and the `setup.md` leg, or (b) the route entry is held. Default: (b). The battery and the workflow do not depend on the route.
- **Q2. Advisor bridge (not in brief).** Iteration-017 item 7 adds activation entries to `scoring-compatibility.json` and reruns three scripts. Default: not done in this phase.
- **Q3. Retry rule.** The brief says repeat the v2 read "until the count is stable". Iteration-017 V2-2 says retry once. Default: the brief's rule, with a fixed bound on the attempts.
- **Q4. Model-free v1 load trigger.** `debug config` does not load modules (iteration-017 F3). The candidates from iteration-017 A15-Q1 are `opencode debug agent <name>` and a `run` under the guard's escape. The first probe settles it. With no proven trigger, the v1 leg reports DEGRADED.
- **Q5. The v2 service and D4.** `/api/plugin` is served by the shared service. D4 forbids starting it. The Eliminated Alternatives table in `research/research.md` records that the standalone private server answers before plugins activate, so a standalone server may not show plugin state. Default: the v2 leg reads only a running service, and it reports SKIP when none runs. The CI case needs a decision before the workflow is wired.
- **Q6. Pointing the battery at a copy.** The broken-copy proof needs a root option. The brief names none. Default: a `--root` option, proposed.
- **Q7. CI package names.** Iteration-017 left the package name UNKNOWN (A15-Q3). Iteration-015 F2 gives `opencode-ai` at `1.19.3` and `@opencode/cli` at `2.0.32`. Resolved by this spec.
- **Q8. Bogus-model smoke leg.** Iteration-017 item 5 proposes an advisory leg that runs `run -m nosuchprovider/nosuchmodel`. It is not in the brief, and it runs `run`. Default: omitted.
- **Q9. Test file.** The doctor folder's `run-all.sh` runs `*.test.cjs` suites, and the coverage floor in the quality rules needs one test per public surface. The brief names no test file. Default: `opencode-version-battery.test.cjs`, proposed.
<!-- /ANCHOR:questions -->

---
title: "Feature Specification: Phase 6: cli-opencode-dual-dispatch"
description: "cli-opencode and the deep-loop runtime build one argv for v1 and v2 without asking which version is installed. This phase detects the version from output and renders the argv that each version accepts."
trigger_phrases:
  - "cli opencode dual dispatch"
  - "phase 6 cli opencode dual dispatch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: cli-opencode-dual-dispatch

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-10-18 |
| **Branch** | `scaffold/006-cli-opencode-dual-dispatch` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 11 |
| **Predecessor** | 005-version-aware-guards |
| **Successor** | 007-install-guidance-and-setup-helper |
| **Handoff Criteria** | Hands to 007 when AC-001 to AC-004 in acceptance-criteria.md are Met, and the smoke dispatch logs for both versions are recorded in the implementation summary. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The version resolver for the deep-loop runtime, the two invocation renderings, the v2 branch at the four `fanout-run.cjs` sites that research section 9 names, and the version guard in the cli-opencode `SKILL.md`. Install docs belong to 007. Prose beyond the lines that encode dispatch shape belongs to 010. The guards belong to 005. The plugins belong to 002 and 003.

**Dependencies**:
- 005-version-aware-guards (predecessor). The guard classifier admits `opencode2` before this phase starts.
- `research/research.md` section 6 (detection spec and flag matrix), section 9 (the four sites), and `research/iterations/iteration-013.md` F1 to F8.
- Live probes run by the orchestrator, recorded in tasks T004: the v2 working directory (open question Q3), a bare slash message under `run --standalone` (Q2), and the child environment through a fixture plugin.
- Model access for the smoke dispatch. The repo default is `opencode-go/deepseek-v4.1-flash` with `--variant max`, as `SKILL.md` line 153 states. If access is missing, the smoke check reports BLOCKED, not PASS.

**Deliverables**:
- One version resolver that reads the binary order `$OPENCODE_BIN`, `opencode2`, `opencode`, parses `--version` output, and refuses unparsable output.
- A v1 renderer that keeps today's argv, and a v2 renderer that uses the `#variant` model form and `run --standalone`.
- A v2 branch at `fanout-run.cjs` lines 2258, 2324, 2923 and 2961.
- A fixed version guard at `SKILL.md` line 134.
- Red-first unit tests for both renderings and the parser, and a regression run of the deep-loop suites.

**Executor**: Code goes to GPT-6 Luna max fast through cli-codex. Docs go to DeepSeek V4.1 Flash max through cli-devin, and each reviews the other's output. The orchestrator runs every test and live probe, including the smoke dispatches and the child environment check.

**Frozen decisions that bind this phase**:
- D3: the version comes from parsed `--version` output, never from the binary name. Every v2 child dispatch uses `run --standalone`.
- D4: no probe in this phase starts, stops or restarts the v2 background service. Live probes use `run --standalone`, which runs a private server, and the orchestrator records the process list before and after.
- D6: the executor split stated above.
- D7: code follows `sk-code/sk-code-opencode`. The `SKILL.md` edit follows the sk-doc skill mode.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-opencode guard in `SKILL.md` line 134 runs `opencode --version | grep -q '^1\.'`. A healthy v2 install prints `opencode v2.0.32`, so the check reports it as broken. The deep-loop runtime never learns a version. `resolveExecutableVersion` returns a sha256 digest of the binary, and `isOpencodeBinaryAvailable` checks only the name `opencode`, so a machine with only `opencode2` reports no executor. No single argv serves both versions. The opencode builder emits `--dir`, `--variant` and `--format json`, which v2 rejects before it reads the prompt. The native builder adds `--command`, which v2 does not have. Only `run --standalone` passes the child environment to plugins on v2, and the builders do not use it.

### Purpose
A dispatch to either installed version renders the argv that version accepts, and every v2 child runs standalone with its environment.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Version detection: the binary order, the `--version` parse, refusal on unparsable output, and a cache keyed by realpath, size and mtime.
- Two renderings for the opencode builder and the native builder.
- `--standalone` for every v2 child.
- The v2 branch at the four sites in research section 9, and the availability check that accepts `opencode2` alone.
- The version guard at `SKILL.md` line 134, and the invocation lines that encode dispatch shape, as open question Q4 settles.

### Out of Scope
- Install docs and the setup helper. Those belong to 007.
- Prose beyond the dispatch-shape lines in cli-opencode docs. 010 owns the doc sweep.
- The dispatch guards. Those belong to 005.
- The plugin code. Those belong to 002 and 003.
- Changing `resolveExecutableVersion`. Its sha256 digest stays as the binary identity. The semver resolver is a separate function.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | v2 renderer and v1 renderer at `buildNativeLineageCommand` (line 2258) and `buildOpencodeLineageCommand` (line 2324). Dispatch table entry at line 2923. Availability check at line 2961. |
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Create | The version resolver: binary order, probe, parse, refusal and cache. The location is open question Q1. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Create | Red-first unit tests for both renderings, the parser, the availability check and the cache. The file name is proposed. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Line 134 guard, and the invocation lines Q4 names. |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The resolver returns the major version from parsed `--version` output. It accepts `1.19.3` and `opencode v2.0.32`, and it refuses output that does not parse. |
| REQ-002 | The v1 renderer keeps today's argv, so v1 dispatch does not change. |
| REQ-003 | The v2 renderer uses `-m <provider>/<model>#<variant>`. It omits `--command`, `--dir`, `--variant`, `--pure`, `--share` and `--port`. |
| REQ-004 | Every v2 child dispatch includes `--standalone`. |
| REQ-005 | A smoke dispatch succeeds on 1.19.3 and on 2.0.32. |
| REQ-006 | A v2 child sees `AI_SESSION_CHILD=1` inside a plugin. |
| REQ-007 | The deep-loop runtime suites pass at or above the pre-change count. |
| REQ-008 | The availability check finds `opencode2` alone. When neither binary resolves, the error names both. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `SKILL.md` line 134 no longer uses `grep -q '^1\.'`, and the invocation lines Q4 names state both renderings. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new unit suite passes after the change, and the same suite fails before it.
- **SC-002**: A smoke dispatch on each pinned version exits 0, prints the expected token and writes the lineage file.
- **SC-003**: A fixture plugin inside a v2 child logs `AI_SESSION_CHILD=1`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Model access for the smoke dispatch | Without it the smoke check cannot pass. | The check reports BLOCKED, not PASS, and the operator is told which provider is missing. |
| Dependency | The Pi guard blocks a nested `opencode run` (research section 2, iteration-017 F4) | DeepSeek cannot run the smoke dispatch from inside a Pi child. | The orchestrator runs the smoke dispatches, as D6 allows. |
| Risk | v2 `run` working directory is unverified (iteration-013, the new P0) | A wrong directory writes into another repository. | The v2 renderer omits `--dir` and sets the spawn cwd (decision L1). Probe T004 confirms the cwd before the branch is built. |
| Risk | No proven v2 replacement for `--command` in the native lineage | Native deep loops cannot start on v2. | The v2 native branch fails closed until Q2 is decided (decision L4). |
| Risk | Replacing the identity digest would break existing identity checks | Binary swap detection stops working. | `resolveExecutableVersion` keeps its digest. The semver resolver is a separate function. |
| Risk | The resolver and the 005 resolver diverge | The guard and the runtime disagree about one binary. | Q1: both read the same fixture list. Separate code, one set of cases. |
| Risk | Concurrent v2 children share no plugin state unless it is persisted outside the process | A guard that counts state across children would miss the other children. | Research section 6 records this as inferred. A two-child run is outside this phase, and 011 carries the check. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One version probe per binary per process. A test counts the probes for two dispatches of the same binary and expects one.

### Security
- **NFR-S01**: The resolver never builds a shell string. It spawns the binary with an argv array, and `$OPENCODE_BIN` is one argv entry. A hostile-value test covers it.
- **NFR-S02**: The probe runs only on the binary the dispatch would run. Path-qualified binaries follow the same rule as in 005 (Q4 of 005).

### Reliability
- **NFR-R01**: A refusal names both binaries and the output the probe returned, so an operator can act on it.
- **NFR-R02**: The existing sha256 identity still changes when the binary changes, so runtime identity checks keep working.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty version output: refuse.
- `1.19.3-rc.1`: parse as major 1, so the v1 renderer is used.
- `opencode v2.0.32`: parse as major 2, so the v2 renderer is used, even when the binary is named `opencode`.
- `$OPENCODE_BIN` set to a path that does not exist: refuse, and do not fall back to the next name.

### Error Scenarios
- Neither binary resolves: the error names `opencode2` and `opencode`, and it does not guess a version.
- The probe throws or times out: refuse. A failed probe is not a version.
- Name ends in `2` but the output does not parse: refuse. Iteration-013 F8 proposed a name fallback here. D3 and research section 6 reject it, as open question Q5 records.

### State Transitions
- Partial completion: if the v2 branch lands before the resolver, the v2 path must refuse rather than guess. Tests cover this order.
- Session expiry: not applicable. The cache lives for one process.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One runtime file, one new resolver, one doc and two test files |
| Risk | 17/25 | Child process with its own cwd and environment, and an unverified v2 directory rule |
| Research | 8/20 | The flags are measured. The cwd and the native route are not. |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q1.** Where does the resolver live, and does it share code with the 005 resolver? Default: a separate module in the deep-loop runtime, and both suites read one shared list of version fixtures. The brief names no file.
- **Q2.** How does a v2 native lineage run a registered command without `--command`? `session.command` needs a session id (iteration-013 F3). A bare `/family:name` message is unproven on v2. Default: the v2 native branch fails closed until T004 decides the route.
- **Q3.** Does v2 `run` take a positional directory, and does `run --standalone` honour the spawn cwd? Default: the v2 renderer omits `--dir` and sets the spawn cwd. T004 confirms it.
- **Q4.** Which cli-opencode lines encode dispatch shape and move in this phase? Default: `SKILL.md` line 134, and the default invocation lines at 153 and 157. Lines 165, 171, 175, 203, 207 and the cli-reference table go to 010.
- **Q5.** Iteration-013 F8 falls back to v2 when the name ends in `2` and the output does not parse. D3 and research section 6 say refuse. Default: refuse. The orchestrator confirms.
<!-- /ANCHOR:questions -->

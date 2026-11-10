---
title: "Feature Specification: Phase 6: deep-loop-executor-kind"
description: "Fan-out has no cli-deepseek-harness executor kind, so a deep-loop lineage cannot dispatch dsh with an exact argv, a closed env allowlist, a recursion guard or JSON-final validation. This phase adds the kind to the config, audit and builder with unit tests and keeps it experimental."
trigger_phrases:
  - "deep loop executor kind"
  - "phase 6 deep loop executor kind"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: deep-loop-executor-kind

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 15 |
| **Predecessor** | 005-dsh-mirror-generators |
| **Successor** | 007-dispatch-recognition-and-stress-adapter |
| **Handoff Criteria** | The four named unit suites pass, the full unit directory shows no new failure against the recorded baseline and `cli-deepseek-harness` is absent from every default allowlist |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Add `cli-deepseek-harness` as a closed executor kind in the deep-loop config, audit and fan-out builder, with unit tests and the fan-out feature-catalog entry. No dispatch hook, stress adapter, hub registration or command YAML changes here. No keyed run is included.

**Dependencies**:
- `002-dsh-offline-contract-pin` for the pinned version, help text and failure-path JSON shape the builder and validator assert
- `004-dsh-runtime-folder-and-patches` for the route and lineage patch paths the builder passes

**Deliverables**:
- Kind entries in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` and `executor-audit.ts`
- `buildDshLineageCommand`, the adapter map entry, the version probe and JSON-final validation in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- Unit tests `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` and `executor-audit.vitest.ts`
- The builder documented in `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Fan-out has no `cli-deepseek-harness` executor kind, so a deep-loop lineage cannot dispatch dsh at all. A hand-built dispatch could pass `DEEPSEEK_API_KEY` and reach the official DeepSeek route, accept a failed run whose stream is well formed, recurse into another `dsh` or hang with no bound.

### Purpose
A fan-out lineage dispatches dsh only through one exact, tested argv with a closed env allowlist, a recursion guard and a strict success test, while the kind stays experimental.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ cd .skilled/skills/system-deep-loop/runtime
$ rg -c 'cli-deepseek-harness' lib/deep-loop/executor-config.ts lib/deep-loop/executor-audit.ts scripts/fanout-run.cjs; echo "exit $?"
exit 1

$ rg -n "'cli-pi': 'pi'|cli-hermes': 'hermes'" lib/deep-loop/executor-audit.ts
73:  'cli-pi': 'pi',
74:  'cli-hermes': 'hermes',
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add the kind to every `executor-config.ts` table: kinds, flag support, sandbox capability, web-search policy, MCP capability, roster and the Flash `max` pin. Keep it out of every default allowlist.
- Add the binary map entry `'cli-deepseek-harness': 'dsh'` with no self-presence exemption, the state env `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR`, the `.dsh` lock-file fallback and an env allowlist for `LLMGATEWAY_` plus `OPENCODE_API_KEY` in `executor-audit.ts`. Drop inherited `DSH_HOME`. `fanout-run.cjs` creates a fresh home under system temp for each lineage and removes it afterwards.
- Add `buildDshLineageCommand`, its adapter map entry, a version probe and JSON-final validation to `fanout-run.cjs`.
- Cover argv, stdin, cwd, env, timeout, exit, final handling and recursion refusal in the four unit suites.
- Document the builder in the fan-out feature-catalog entry.

### Out of Scope
- Dispatch-audit recognition and the stress adapter - phase 007 owns them
- Promotion out of experimental and the preventive sandbox capability - phase 013 sets them after a keyed run
- MCP routes beyond `code_mode` and live MCP verification - phase 010 owns them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Kind in every table, roster, `max` pin, absent from defaults |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Binary map, state env, default home, env allowlist, no recursion exemption |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Builder, adapter map, version probe, JSON-final validation |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Kind schema, roster, reasoning, unsupported fields |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Exact argv, stdin, cwd, env, timeout, exit and final handling |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Modify | Matrix rows and exclusions for the kind |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modify | Env filtering, recursion refusal, provenance |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | Modify | Document the dsh builder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The runtime's vitest run of `tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` and `executor-audit.vitest.ts` passes. The full unit directory has no new failure against a baseline captured before the edit |
| REQ-002 | A builder test asserts the exact argv `dsh --profile headless --patch <route> --patch <lineage> --patch <guards> --json --permission-mode <preset> --approval-policy never -`, with stdin set to the prompt and cwd set to the lineage directory |
| REQ-003 | An env test asserts `LLMGATEWAY_API_KEY` and `OPENCODE_API_KEY` pass, while inherited `DSH_HOME`, `DEEPSEEK_API_KEY`, `DSH_TELEMETRY_OTLP_URL` and unrelated `OPENCODE_FOO` are dropped. The runner creates a fresh `DSH_HOME` under system temp and removes it after the lineage |
| REQ-004 | Tests assert failure for a non-zero exit, a missing `final`, an `error` event and a `final.reason.kind` other than `completed`. A nested `dsh` dispatch is refused with no self-presence exemption |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `rg` on the default tables in `executor-config.ts` finds no `cli-deepseek-harness`, so the kind is absent from every default allowlist |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The four named suites pass and the full unit directory's failure count is no higher than the baseline recorded before the edit.
- **SC-002**: No test path lets `DEEPSEEK_API_KEY` through, accepts a non-`completed` final or allows a nested `dsh`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 evidence and phase 004 patch paths | The builder would assert flags and paths nobody observed | Start only after `002-dsh-offline-contract-pin/evidence/headless-help.txt` and `.dsh/patches/lineage.patch.yml` exist |
| Risk | Env leakage through a broad prefix such as `DEEPSEEK_` or `DSH_` | High. The official DeepSeek key reactivates its route and its search and fetch | Admit only `LLMGATEWAY_` and `OPENCODE_API_KEY`. Drop inherited `DSH_HOME` and test the drop list |
| Risk | False success on a well-formed failed stream | High. A failed lineage is merged as done | Require exit 0, a `final` event and `final.reason.kind` `completed`, each tested |
| Risk | Recursion into `dsh` | High. Runaway nested dispatch | Binary map entry with no self-presence exemption, tested |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Every dsh lineage runs under the existing fan-out timeout. A test asserts that the process is killed when it expires.
- **NFR-P02**: N/A: throughput depends on the provider and is measured only in phase 013.

### Security
- **NFR-S01**: The child env holds only the strict base list plus `LLMGATEWAY_*` and `OPENCODE_API_KEY`. The runner supplies a fresh `DSH_HOME` under system temp and removes it after the lineage.
- **NFR-S02**: cwd is the lineage directory, never the repo root, so a repo-root `.env` is never loaded.

### Reliability
- **NFR-R01**: A run counts as success only with exit 0 and `final.reason.kind` `completed`.
- **NFR-R02**: The version probe refuses a `dsh` whose `--version` is not the pinned `0.2.2-rc.1`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: an empty stdout stream has no `final`, so the run is a failure.
- Maximum input: a stream whose last line is not JSON fails the parse and the run fails, with the raw tail kept in the lineage log.
- Failure path: a non-zero exit, an `error` event or a nested `dsh` marks the lineage failed with the reason recorded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 8 files, one system (deep-loop runtime) |
| Risk | 16/25 | Env allowlist, success test and recursion guard are security-relevant |
| Research | 4/20 | Builder shape settled in phase 001 |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does `verify-iteration.vitest.ts` enumerate kinds? Decision: confirm ownership by reading it before any edit and leave it alone unless it lists kinds.
- Whether `workspace-write` confines tools on macOS. Decision: phase 013 answers it. The preventive sandbox capability stays false here.
<!-- /ANCHOR:questions -->

---

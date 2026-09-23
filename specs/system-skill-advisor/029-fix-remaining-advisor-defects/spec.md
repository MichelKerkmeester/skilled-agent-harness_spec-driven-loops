---
title: "Feature Specification: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces"
description: "The 028 dedup fix half-landed: the changed-contribution path in decidePiDirectiveDelivery returns undefined where the full delivery belongs, so Pi's caller throws, a catch swallows the throw and the runtime battery never runs the Pi suite. The advisor runtime battery also carries 13 failing tests in 9 files from drifted fixtures and baselines, and five documentation surfaces still describe the old fallback or dedup behavior. Two earlier bulk renames also left environment variable names repeated in 13 files."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-09-22 |
| **Branch** | `worktrees/060-fix-remaining-advisor-defects` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 028 dedup fix half-landed. In `decidePiDirectiveDelivery` (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`) the changed-contribution path fell off the end of the function and returned `undefined`, because a dead receipt write (`map.set(key, parts.directives)`) had taken the place of `return FULL_PI_DIRECTIVE_DELIVERY`. Pi's caller reads `decision.suppressed`, so the call threw. A catch swallowed the throw so Pi still delivered the brief, which hid the defect. The runtime battery never ran the Pi suite: its include is `tests/**/*.vitest.ts` under the runtime folder while the suite `.skilled/hooks/dispatch/pi/directive-dedup.test.ts` runs under `.skilled/hooks/vitest.config.ts`. Negative control, observed: that suite fails 8 of 15 against 028's `prompt-advisor.ts`, with `expected undefined to deeply equal { suppressed: false }` and `TypeError: Cannot read properties of undefined (reading 'suppressed')`. It passes 15 of 15 against this packet's version.

The advisor runtime battery at the fork had 13 failing tests in 9 files (878 passed, 7 skipped, 898 total). The failures sat in `compiled-routing-consumption` ("=0 kill invalidates a previously-cached compiled brief"), `skill-graph-diagnostic-redaction` ("plugin status free of the retired bridge path and of absolute paths"), `parent-skill-check-fixtures` ("golden: a copy of a real canon-clean hub passes 4/4"), `skill-advisor-cli-parity` ("top recommendations identical across ten representative prompts"), `legacy/advisor-graph-health` (2 tests: orphan skills and health ok), `legacy/advisor-corpus-parity` ("preserves Python-correct top-1 decisions"), `parity/python-ts-parity` ("preserves all Python-correct corpus decisions"), `parity/scorer-eval-baseline-ratchet` (2 tests: full-corpus top-1 and named buckets) and `parity/local-native-divergence-ratchet` (3 tests: new drift, resolved entries and changed entries).

Third, stale records. A read-only documentation sweep by a Devin DeepSeek V4.1 Flash reviewer found five doc surfaces that still described the old fallback or dedup behavior and an overclaim in packet 028's verification record.

Fourth, repeated names. Commit 4bd27731f3a (2026-08-21) renamed `MK_SKILL_ADVISOR_DB_DIR` to `SYSTEM_SKILL_ADVISOR_DB_DIR`, so every place that read the new name and then the legacy one now read the same name twice: eleven files across the CLI fallback, the launcher, the OpenCode plugin, the doctor freshness script, the ledger capture script, the Python CLI, three tests and two reference docs. A rename on 2026-06-30 did the same to `OPENCODE_PROMPT_TIME` in the advisor CLI and its test. The legacy `MK_` name still reaches the new one in any process that loads the env alias bridge. The hook doc also said `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` disables the Python CLI, which reads only `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. One shim test read the daemon state once and assumed it held, so a loaded run could fail it and a warm machine skipped its branch.

### Purpose

A changed pi contribution delivers its full brief again, the advisor runtime battery runs green against baselines renewed by the capture tools and every documentation surface matches the code. Each renamed environment variable is read once, and the kill-switch table says which name each surface reads.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pi dedup return (lane A): remove the dead receipt write from `decidePiDirectiveDelivery`, restore `return FULL_PI_DIRECTIVE_DELIVERY`, change the module comment from "changed directive content" to "changed contribution" and add the `.skilled/hooks/dispatch/pi/directive-dedup.test.ts` test "re-delivers full when only the route head changes (directives identical)".
- DB-dir expression (lane B): `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` ends at `env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir`, one read with one name, replacing the duplicated read left by the `MK_SKILL_ADVISOR_DB_DIR` rename (commit 4bd27731f3a) and the intermediate `SPECKIT_SKILL_ADVISOR_DB_DIR` operand that no file reads and no commit ever defined.
- Spec-kit Claude hook root probe (lane C): `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` checks `.skilled` first on its upward walk and then `.opencode`.
- OpenCode plugin compiled-routing helper (lane D): `resolveCompiledRouteStatusModule()` in `.opencode/plugins/system-skill-advisor.js` resolves `compiled-route-status.cjs` through the plugin's own root first and then `.skilled/bin`, which cures the compiled-routing-consumption and diagnostic-redaction failures.
- Skill graph (lane E): repair five `graph-metadata.json` files with reciprocal sibling edges and corrected fields (cli-external-orchestration, cli-jev, cli-orca, mcp-tooling, sk-git), regenerate `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` and seed the worktree's skill-graph database, which cures the graph-health and CLI-parity failures.
- Golden-hub fixture (lane F): `.skilled/skills/system-skill-advisor/runtime/tests/parent-skill-check-fixtures.vitest.ts` passes `NODE_PATH` to the checker because the hub copy lives in a bare tempdir with no `node_modules` ancestry.
- Baselines (lane G): renew the two baselines through the repository's capture tools, move the frozen counts with them and correct the two test comments that described the accepted-regression lists (details in Files to Change).
- Documentation (lane H): bring five stale surfaces up to date and correct packet 028's record with a note.
- Repeated names (lane I): read or list each renamed environment variable once in `.skilled/bin/system-skill-advisor-launcher.cjs`, `.opencode/plugins/system-skill-advisor.js`, `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`, `capture-local-native-divergence-ledger.mjs`, `runtime/scripts/skill_advisor.py`, `runtime/skill-advisor-cli.ts` and three tests, name one variable in `db-path-policy.md` and `daemon-lease-contract.md`, and drop the unread `CODEX_PROMPT_TIME` and the retired `mk-*-launcher` names from `.skilled/bin/README.md`.
- Kill-switch rows (lane J): `skill-advisor-hook.md` says `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` disables the native adapters and that the Python CLI reads only `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, set to exactly `1`, from its compat contract.
- Shim test (lane K): the unavailable-branch case in `runtime/tests/compat/shim.vitest.ts` sets `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` and runs every time instead of skipping on a probe taken earlier.

### Out of Scope
- Rewriting packet 028's verification record: its original numbers stay, and the overclaim is corrected with a note instead.
- Renewing baselines by hand: only the capture tools write them, so the reason lands beside each change.
- The push and the merge into main and skilled/v4.0.0.0: they wait for the operator's go-ahead.
- Deleting or rewriting the opt-in tri-daemon drill (`runtime/tests/tri-daemon-drill.vitest.ts`): it has failed at setup since commit 7388a0abaf8 (2026-07-27) deleted the code-index launcher it copies, and Open Question 1 asks which way to take it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Modify | Lane A: drop the dead receipt write and restore `return FULL_PI_DIRECTIVE_DELIVERY` |
| .skilled/hooks/dispatch/pi/directive-dedup.test.ts | Modify | Lane A: add the route-head-only re-delivery test |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Modify | Lane B: collapse the DB-dir read to `env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir` |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts | Modify | Lane C: probe `.skilled` first and then `.opencode` |
| .opencode/plugins/system-skill-advisor.js | Modify | Lane D: `resolveCompiledRouteStatusModule()` checks the plugin root and then `.skilled/bin`. Lane I: `advisorSourceSignature` reads `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/cli-external-orchestration/graph-metadata.json | Modify | Lane E: reciprocal sibling edges and corrected fields |
| .skilled/skills/cli-jev/graph-metadata.json | Modify | Lane E: reciprocal sibling edges and corrected fields |
| .skilled/skills/cli-orca/graph-metadata.json | Modify | Lane E: reciprocal sibling edges and corrected fields |
| .skilled/skills/mcp-tooling/graph-metadata.json | Modify | Lane E: reciprocal sibling edges and corrected fields |
| .skilled/skills/sk-git/graph-metadata.json | Modify | Lane E: reciprocal sibling edges and corrected fields |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | Modify | Lane E: regenerated from the repaired metadata |
| .skilled/skills/system-skill-advisor/runtime/tests/parent-skill-check-fixtures.vitest.ts | Modify | Lane F: pass `NODE_PATH` to the checker |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Modify | Lane G: renewed by `capture-scorer-eval-baseline.mjs --write` |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json | Modify | Lane G: renewed by `capture-local-native-divergence-ledger.mjs --write` (85 to 75 entries), with the reviewed reason for `rr-iter3-061` restored |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts | Modify | Lane G: pythonCorrect frozen count 114 to 112 and `rr-hub6-204`/`rr-hub6-207` out of `ACCEPTED_PARITY_REGRESSION_IDS`, with a corrected comment on that removal |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts | Modify | Lane G: pythonCorrect 109 to 106, tsAlsoCorrect 100 to 99 and `rr-hub6-204`/`rr-hub6-207` out of its accepted-regression list, with a corrected comment on that removal |
| .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md | Modify | Lane H: describe the current dedup behavior |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Modify | Lane H: state the byte-identical full-contribution condition for the Pi dedup |
| .skilled/skills/system-skill-advisor/hooks/pi/README.md | Modify | Lane H: describe the current dedup behavior |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Modify | Lane H: describe the current fallback behavior. Lane J: state which kill-switch name each surface reads |
| .skilled/skills/system-skill-advisor/hooks/lib/README.md | Modify | Lane H: describe the current fallback behavior |
| specs/system-skill-advisor/028-restore-pi-advisor-brief/implementation-summary.md | Modify | Lane H: correction note, original numbers kept |
| specs/system-skill-advisor/028-restore-pi-advisor-brief/plan.md | Modify | Lane H: correction note, original numbers kept |
| .skilled/bin/system-skill-advisor-launcher.cjs | Modify | Lane I: list `SYSTEM_SKILL_ADVISOR_DB_DIR` once in the child env allowlist |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Modify | Lane I: list `SYSTEM_SKILL_ADVISOR_DB_DIR` once in the native bridge allowlist |
| .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | Modify | Lane I: read `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs | Modify | Lane I: delete `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | Modify | Lane I: check `OPENCODE_PROMPT_TIME` once |
| .skilled/skills/system-skill-advisor/runtime/tests/state-containment.vitest.ts | Modify | Lane I: delete `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts | Modify | Lane I: delete `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-trust-gate.vitest.ts | Modify | Lane I: list `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-trusted-prompt-time.vitest.ts | Modify | Lane I: list `OPENCODE_PROMPT_TIME` once |
| .skilled/skills/system-skill-advisor/references/config/db-path-policy.md | Modify | Lane I: one variable, plus how the retired `MK_` name reaches it |
| .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md | Modify | Lane I: one variable in both sentences |
| .skilled/bin/README.md | Modify | Lane I: drop the unread `CODEX_PROMPT_TIME` and the retired `mk-*-launcher` names |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts | Modify | Lane K: run the unavailable-branch case under the force-local switch |
| specs/system-skill-advisor/029-fix-remaining-advisor-defects/ (packet docs) | Create | This packet's documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The pi dedup return is restored in `decidePiDirectiveDelivery`: the dead receipt write is gone and the changed-contribution path returns `FULL_PI_DIRECTIVE_DELIVERY` | The Pi dedup suite passes 15 of 15 against this packet's `prompt-advisor.ts` and fails 8 of 15 against 028's source |
| REQ-002 | The DB-dir read in `skill-advisor-cli-fallback.ts` collapses to `env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir`, one variable read once | The final line reads `env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir` and no second name remains in that expression |
| REQ-003 | The root probes find the renamed root first: the spec-kit Claude hook checks `.skilled` and then `.opencode`, and the OpenCode plugin helper resolves `compiled-route-status.cjs` through the plugin root and then `.skilled/bin` | The compiled-routing-consumption and skill-graph-diagnostic-redaction tests pass, and both probe changes are visible in `user-prompt-submit.ts` and `system-skill-advisor.js` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The battery lanes hold: the skill graph repairs and regeneration, the golden-hub `NODE_PATH` fix and the baseline renewals through the capture tools with the frozen counts moved alongside | The full advisor runtime battery reports 0 failed tests (891 passed, 7 skipped of 898) |
| REQ-005 | The documentation lane closes the stale surfaces and corrects packet 028 with a note | Each named surface matches current fallback and dedup behavior and packet 028 keeps its original numbers beside the correction note |
| REQ-006 | Strict packet validation passes for this packet | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/029-fix-remaining-advisor-defects --strict` reports `RESULT: PASSED` |
| REQ-007 | Each renamed environment variable is read or listed once (lane I) | A repository-wide search finds no variable read twice in one expression, deleted twice in a row, listed twice in one list or named twice in one sentence, and the edited scripts pass `node --check` and `py_compile` |
| REQ-008 | The kill-switch table states which name each surface reads (lane J) | The `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` row names the native adapters only, and the `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` row says the Python CLI reads that name, set to exactly `1`, from its compat contract |
| REQ-009 | The shim's unavailable-branch case runs every time (lane K) | The case sets `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, has no early return and passes inside the full battery |
| REQ-010 | A live Pi session delivers the brief on a first prompt, suppresses a byte-identical repeat and re-delivers on a changed prompt | A three-turn Pi RPC session records an `Advisor:` line on turns 1 and 3 and none on turn 2, and with `SPECKIT_PI_DIRECTIVE_DEDUP=0` all three turns carry it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/pi/directive-dedup.test.ts` reports 15 of 15 passing against this packet's `prompt-advisor.ts`, and the same suite reports 8 of 15 failing against 028's source (REQ-001).
- **SC-002**: The fallback module ends at `env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir` and the root probes read `.skilled` before `.opencode`, with the compiled-routing-consumption and diagnostic-redaction tests green (REQ-002, REQ-003).
- **SC-003**: The advisor runtime battery reports 0 failed tests, with 891 passed and 7 skipped of 898, against the renewed baselines (REQ-004).
- **SC-004**: Every documentation surface named in lane H matches current fallback and dedup behavior, and packet 028 carries the correction note with its original numbers intact (REQ-005).
- **SC-005**: `validate.sh --strict` reports `RESULT: PASSED` for `specs/system-skill-advisor/029-fix-remaining-advisor-defects` (REQ-006).
- **SC-006**: The repeated-name search finds nothing and the old and new allowlists hold the same members (REQ-007).
- **SC-007**: The two kill-switch alias rows in `skill-advisor-hook.md` match what the adapters and the Python CLI read (REQ-008).
- **SC-008**: The shim case passes in a full battery run of 891 passed, 0 failed and 7 skipped of 898 (REQ-009).
- **SC-009**: The Pi RPC check records the brief on turns 1 and 3 and suppresses turn 2, and the dedup-off control delivers all three (REQ-010).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Baseline renewal can move the goalposts | Medium | Renew only through the capture tools, with the reason recorded beside each change |
| Risk | The divergence ledger drifts after a database rebuild | Medium | The Python scorer reads the worktree daemon's live `skill-graph.sqlite`, so a rebuild can move its tops. Renew the ledger only with its capture tool and a reviewed reason, and the battery catches new drift on the next run |
| Risk | A merge into a main checkout that other sessions keep dirty | Medium | The work stays on `worktrees/060-fix-remaining-advisor-defects` and the push and merge wait for the operator's go-ahead |
| Dependency | The earlier session's GPT 5.6 Luna verification dispatch returned OVERALL INCOMPLETE (recorded here, not observed in this round), its two gaps being a sandbox-blocked hook smoke and refs that moved on during the run | Low | Neither recorded gap is a code defect, and this round ran the Pi delivery check as a live RPC session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the opt-in tri-daemon drill (`runtime/tests/tri-daemon-drill.vitest.ts`) be deleted or rewritten for the one remaining advisor daemon? It fails at setup because the code-index launcher it copies was deleted in commit 7388a0abaf8. The first draft's question about the repeated names and the kill-switch rows is answered: the operator asked for nothing to be left deferred, so lanes I to K fix them here.
<!-- /ANCHOR:questions -->

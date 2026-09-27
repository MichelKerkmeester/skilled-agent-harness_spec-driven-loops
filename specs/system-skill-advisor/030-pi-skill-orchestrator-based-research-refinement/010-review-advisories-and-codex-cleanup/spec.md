---
title: "Feature Specification: Closing the Review Advisories and the Codex Hook Cleanup"
description: "Phase 9 left two items open: the duplicate Codex hook entries in the operator's global file, and the twelve P2 advisories of the phase 6 review. This phase runs the removal-only installer against the real file, restores trust for the three hooks the jcode deletion shifted and fixes every advisory, plus seven siblings found while verifying them."
trigger_phrases:
  - "review advisories closure"
  - "codex hook cleanup"
  - "advisor prompt over stdin"
  - "shared synthesis close-out"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Closing the Review Advisories and the Codex Hook Cleanup

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-test-findings-remediation |
| **Successor** | None |
| **Handoff Criteria** | `--check` prints OK for `~/.codex/hooks.json`, every Codex hook reports trusted, and each finding below is fixed, with a test that fails against `05231a01ea` wherever the fix changes behavior |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Pi skill orchestrator research for skill advisor refinement specification. It closes the two items phase 9 left open, so the packet ends with nothing handed back.

**Scope Boundary**: The Codex cleanup C1, the twelve P2 findings in `../006-fanout-deep-review/review/review-report.md` and the seven siblings N1 to N7 found while verifying them. A finding the work turns up is appended here before any work on it starts.

**Dependencies**:
- 009-test-findings-remediation, hard. It built the removal-only installer this phase runs.
- 006-fanout-deep-review, hard. Its review report is the source of the twelve advisories.

**Deliverables**:
- The installer run and the trust repair, with evidence under `evidence/`
- Code, workflow and test fixes for the advisories, each checked by a verifier's reverse check

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 9 handed two things to the operator or to later work. The global Codex hook file still held 18 copies of the checkout's hooks, so Codex ran the advisor twice per prompt. The twelve P2 advisories from the phase 6 review were never taken up. One of them makes `advisor_validate` reject an outcome event from pi, codex, cursor or devin.

### Purpose
Codex runs each repository hook once, and no phase 6 advisory remains open.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Codex hook cleanup:
- **C1** `~/.codex/hooks.json` held 18 repository hook entries beside Codex's own load of the trusted checkout's `.codex/hooks.json`. On 2026-09-27 the operator directed the session to run the removal-only installer once. The earlier jcode deletion had moved three third-party SessionStart groups (nodeterm, GitKraken and orca) off their trust records. Their trust is restored with the hash Codex itself reports, through the config write its `/hooks` review makes.

Advisor runtime:
- **F003** `advisor_validate` accepts only `claude`, `copilot` and `opencode` as an outcome event runtime. The Zod schema (`runtime/schemas/advisor-tool-schemas.ts:349`), the tool descriptor (`runtime/tools/advisor-validate.ts:22`) and the CLI manifest (`runtime/skill-advisor-cli-manifest.ts:89`) each hardcode that list. `ADVISOR_RUNTIME_VALUES` names seven runtimes, and the metrics writer already accepts all seven.
- **R2-P2-001** The hook's CLI fallback puts the prompt in the child's argv (`hooks/lib/skill-advisor-cli-fallback.ts:245-246`), where any local process listing shows it. The CLI gains `--json -`, which reads the same JSON object from stdin, and `--json '<object>'` keeps working.
- **N2** The OpenCode plugin puts the prompt in argv too, as `--prompt` (`.opencode/plugins/system-skill-advisor.js:691-712`). It moves to the same stdin transport. The request is clamped by its escaped size, because JSON writes a quote or newline as two bytes and a control character as six. So it stays inside the configured byte budget, and a budget too small for any prompt sends nothing. Found while verifying R2-P2-001.
- **N4** The advisor daemon hands the prompt to `.skilled/bin/compiled-route.cjs` as `--prompt <text>` for every compiled-hub recommendation (`runtime/handlers/advisor-recommend.ts:343-348`). The OpenCode plugin reads that route, so it cannot opt out. The front door gains `--prompt-stdin` and the daemon sends the prompt there. The front door runs from the request's `workspaceRoot`, which may name another checkout, so the daemon skips a front door that predates the flag. Found while verifying N2.
- **N5** `advisor_recommend` accepts at most 10,000 prompt characters (`runtime/schemas/advisor-tool-schemas.ts:221`), and the CLI exits 64 above that. The hooks and the OpenCode plugin send up to 64 KiB, so any longer prompt got `Advisor: outage (fail_open)` instead of a route. Measured through the Claude hook, a 9,990-character prompt routed to `sk-code` and a 20,000-character one got the outage brief. The hook producer, the CLI fallback and the plugin now send the prompt's first 10,000 characters. Found while verifying N2.
- **N7** The standalone Python CLI sends its whole prompt to the native bridge (`runtime/scripts/skill_advisor.py:848`), and `advisor_recommend` refuses one over 10,000 characters. So with `--force-native` a 15,000-character prompt reports `Native advisor unavailable` (`NATIVE_CALL_FAILED`), while a 9,990-character one routes natively. Without the flag the same prompt drops to local Python scoring. The native call now sends the prompt's first 10,000 UTF-16 code units, the unit JavaScript counts, since an emoji is one Python character but two JavaScript ones. Found while verifying N5.
- **F004** The diagnostics and outcome logs under `os.tmpdir()/speckit-skill-advisor-metrics` get default permissions (`runtime/lib/metrics.ts:274-278`, `:302-325`). The directory becomes `0o700` and each file `0o600`. A `chmod` that fails is retried on the next write rather than remembered as done.
- **F001** `shouldTrySkillAdvisorCliFallback` (`hooks/lib/skill-advisor-cli-fallback.ts:160`) has no caller in source, tests or docs. It is deleted.

Hook shims and comments:
- **F002, R2-P2-002** The Claude shim (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:105-107`) passes an operator's `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` through unchanged. A value above 2200 lets the advisor outlive the shim's 2500 ms kill, so the shim returns `{}` and the fallback line never arrives. The child budget becomes the smaller of the operator value and 2200, and a value that is not a positive integer counts as unset.
- **R1-P2-002** The Pi dedup comment (`hooks/pi/prompt-advisor.ts:93-97`) says a headless and a headed brief share a dedup key. The code compares the whole contribution (`:152`), so they never do, and a changed head always re-delivers. The comment is corrected. It also stops calling the headless brief the current fallback: since the status-headed fallback, only an unrebuilt older build produces one. The existing test `re-delivers full when only the route head changes (directives identical)` pins the contract, and a mutation that keys on the directives alone fails it.
- **R1-P1-001** A comment in `edit_lines` (`.pi/extensions/pi-cache-optimizer/index.ts:8201-8202`) says every line in the range is verified. Interior lines are checked only when `line_hashes` is supplied, as the published schema says. The comment is corrected.
- **R3-P2-001** No test covers a call without `line_hashes` whose interior drifted. One test pins that such a call is accepted, which is the documented opt-in contract.
- **N3** A non-empty `line_hashes` list shorter than the range passes `edit_lines`, and the interior lines it does not cover go unchecked. The caller believes the whole range was verified. A non-empty list must now hold one hash per line of the range, and an empty list still means none. Found while verifying R1-P1-001.

Deep-loop workflows:
- **R3-P2-002** The synthesis close-out program runs inline in four workflows, review and research, each in auto and confirm. The review pair is identical and the research pair differs only in formatting, while the review and research programs have drifted apart. One shared script replaces all four. It keeps each mode's event fields. Where the two programs had drifted it applies the stricter rule to both: review now rejects a symlinked artifact, and research now keys a finding by `findingId` too.
- **R1-P2-003** The review close-out reads only the root state log (`deep-review-auto.yaml:2407`) and takes `totalIterations` from a placeholder counted from that log. A fan-out root has no state log, so the invariants pass vacuously and `synthesis_complete` reports 0 iterations. The review close-out and its summary step fold the lineage logs, as research does.
- **F005** Confirm-mode review never consumes `stop_policy`. `deep-review-auto.yaml:624` and `:646` carry the max-iterations clauses, and `deep-review-confirm.yaml` has neither, nor the strategy's `stop_policy` field.
- **N1** Neither research workflow consumes `stop_policy` on a single-executor run. Both pass it only to `fanout-run.cjs`, the config record omits it and no convergence clause reads it. Found while verifying F005.
- **N6** Step 9 of the research confirm convergence algorithm is a bare `if` with no body. Its auto twin runs `checkQualityGuards` there and can override a STOP. An earlier parity edit dropped the body, and the confirm file's parity census does not record it as an intended difference. So a confirm-mode research run stops on convergence without its quality guards. The body is restored, and a test holds each confirm algorithm to its auto twin. Found while verifying N1.

### Out of Scope
- Stale trust records in `~/.codex/config.toml` for group positions that no longer exist. Each one trusts only content with its exact hash, and Codex's own review leaves them in place too.
- Advisory findings from other packets. Only the phase 6 report's twelve and the siblings N1 to N7 are in scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.codex/hooks.json`, the operator's global file | Modify | The installer removes the 18 repository copies, with a backup |
| `~/.codex/config.toml`, the operator's global file | Modify | Three trust records get the hashes Codex reports, with a backup |
| `runtime/schemas/advisor-tool-schemas.ts`, `runtime/tools/advisor-validate.ts`, `runtime/skill-advisor-cli-manifest.ts` | Modify | Outcome event runtimes come from `ADVISOR_RUNTIME_VALUES` |
| `runtime/skill-advisor-cli.ts`, `hooks/lib/skill-advisor-cli-fallback.ts` | Modify | `--json -` reads stdin, the fallback sends its payload there, and the dead gate goes |
| `.opencode/plugins/system-skill-advisor.js` | Modify | The plugin sends its payload over stdin, inside its byte budget and the prompt limit |
| `runtime/lib/skill-advisor-brief.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, the prompt schema | Modify | Send at most the 10,000 prompt characters `advisor_recommend` accepts |
| `runtime/scripts/skill_advisor.py` | Modify | The native call sends at most the 10,000 UTF-16 code units `advisor_recommend` accepts |
| `runtime/handlers/advisor-recommend.ts`, `.skilled/bin/compiled-route.cjs` | Modify | The front door reads the prompt from stdin, and the daemon sends it there |
| `runtime/lib/metrics.ts` | Modify | Private directory and file modes, and a failed `chmod` retried |
| `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Modify | Clamp the operator budget |
| `hooks/pi/prompt-advisor.ts`, `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Comments that state the kept contract, and the `line_hashes` length guard |
| The advisor hook reference, the CLI and recommend feature entries and `.skilled/bin/README.md` | Modify | Describe the stdin transports |
| `system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Create | The shared close-out program |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modify | Call the shared script, fold review lineage logs and honor `stop_policy` |
| The ledger stem census, the stem-producer checker and the compiled `deep/review` and `deep/research` contracts | Modify | Name the new producer and match the edited workflows |
| The tests beside each change | Modify or Create | One test per behavior change that fails against `05231a01ea` |
| `evidence/` | Create | Installer, trust and live-run records |

`runtime/` and `hooks/` above mean `.skilled/skills/system-skill-advisor/runtime/` and `.skilled/skills/system-skill-advisor/hooks/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The global Codex file holds no repository hook copy | `install-codex-hooks.mjs --check` prints `OK`, and a `codex exec` from the checkout starts each repository hook once and writes one advisor diagnostic per prompt |
| REQ-002 | Every Codex hook is trusted | Codex's `hooks/list` reports every hook for the checkout as trusted, and the config diff touches only the three third-party SessionStart records |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `advisor_validate` accepts every advisor runtime | A test parses an outcome event for each of the seven runtimes, and both JSON descriptors list the same seven |
| REQ-004 | No advisor caller puts the prompt in argv | Tests show the hook fallback, the plugin and the daemon's compiled-route call send the prompt over stdin, and `--json '<object>'` and `--prompt <text>` still work |
| REQ-005 | An operator hook budget cannot outlive the shim | A shim test with the budget at 5000 gets the advisor's output instead of `{}` |
| REQ-006 | The Pi dedup and `edit_lines` comments state the contract the code keeps | Each comment matches the code. A mutation proves the existing Pi head-change test pins the dedup key, and a new test pins the `line_hashes` opt-in |
| REQ-011 | A `line_hashes` list covers the whole range or nothing | A test shows a short non-empty list refused and an empty list accepted |
| REQ-007 | One close-out script serves all four deep-loop workflows | The four workflow steps call it, the close-out tests pass through it and a fan-out review close reports the lineage iteration count |
| REQ-008 | Every deep-loop workflow honors `stop_policy` | The review confirm workflow and both research workflows carry the max-iterations clause, and the research config records `stopPolicy` |
| REQ-009 | Advisor logs are private to their user | A test shows a fresh metrics directory at `0o700` and its files at `0o600`, and another shows a failed `chmod` retried on the next write |
| REQ-010 | No dead fallback gate remains | `shouldTrySkillAdvisorCliFallback` has no definition and no reference outside spec history |
| REQ-012 | Every advisor caller sends a prompt `advisor_recommend` accepts | Tests show the hook producer, the CLI fallback, the plugin and the Python CLI's native call send at most 10,000 prompt characters. A live Claude hook run with a 20,000-character prompt routes instead of reporting an outage |
| REQ-013 | The plugin's stdin request stays inside its byte budget | A test with a prompt of escaped characters keeps the request within the budget, and a budget too small for any prompt spawns nothing |
| REQ-014 | Each confirm workflow runs its auto twin's convergence algorithm | A test finds the research and review confirm algorithms identical to their auto twins |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `codex exec` from the checkout starts 9 SessionStart, 5 UserPromptSubmit and 6 Stop hooks, all complete, and one advisor record appears per prompt.
- **SC-002**: The twelve phase 6 advisories and N1 to N7 each have a fix, and each behavior change has a test that fails against `05231a01ea`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewriting the operator's Codex files loses a third-party hook or its trust | High | Back up both files, prove on a temp copy that no kept hook moves and diff the config after the write |
| Risk | The shared close-out script changes an event field the reducers or the ledger schema read | High | Keep every field of both programs and run the close-out, ledger schema and stem-producer tests through it |
| Risk | A child waits on stdin that never closes | Med | The CLI reads stdin only for `--json -`, and each caller ends stdin after one write |
| Risk | A request names another checkout whose front door predates `--prompt-stdin` and would route an empty prompt | Med | The daemon checks the front door for the flag and attaches no compiled route when it is missing |
| Risk | A long prompt states its intent after its first 10,000 characters | Low | The head is routed, which beats the outage every such prompt got before |
| Dependency | Grok 4.7 through cli-cursor and GPT-6 Luna through cli-codex | A lane stalls | The orchestrator reruns or reassigns the brief |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator asked for both open items fixed, with nothing deferred.
<!-- /ANCHOR:questions -->

---

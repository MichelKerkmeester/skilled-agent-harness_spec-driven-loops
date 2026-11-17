# Review Report: Command Surfacing Build, Pass Five (vibe-hooks-doctor lineage)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the fifth review pass, on the change range `db14c22bb0..2427bc4c4b` — the code the packet changed since pass four's last fix.
- Lineage: `vibe-hooks-doctor-5`, area `vibe-hooks-doctor`, run `fanout-vibe-hooks-doctor-5-1794760565927-i99t40`, executor `cli-opencode` `opencode-go/deepseek-v4.1-flash` at reasoning effort max.
- Reviewed scope: the twelve paths in `review/review-scope-5.txt` whose area is `vibe-hooks-doctor` — the doctor routes, the hook-wiring check, its test and README, the doctor contract test, the command-reference validator, the CI workflow, the Claude hook, the Vibe prompt advisor, the hook contract and the two hook test files — plus the docs and packet phases that describe them.
- Inputs to this synthesis: the four iteration narratives, four delta files, the lineage registry (8 active P2 findings), the strategy and the dashboard.
- Cross-area boundary: the launcher and direct-call CLI code belong to `kill-switch-cli-5`; the transcript scorer and behaviour arena belong to `accuracy-runner-5`; the feature catalog, changelog, playbook and graph metadata belong to `docs-metadata-5`. This lineage names those surfaces and raises no code finding outside its area.
- Iteration cap: 4 of 4. Convergence was not declared because the last iteration's ratio stayed above 0.10; the loop stopped at the cap with no active P0 or P1.

---

## 1. Executive Summary

- **Verdict: PASS.**
- **hasAdvisories: true.** Eight active P2 findings are recorded; none is a blocker.
- **Active counts:** P0 0, P1 0, P2 8.
- **Review scope summary:** the Vibe prompt-advisor part (new this pass), the Claude handler line that labels runtime observations, the doctor hook-wiring check's Vibe row and line reader, the runtime-mirrors route and CI rows, the command-reference allowlist, the hook contract's Vibe and switch sections, and the doctor contract test.
- **Operator review focus:** Code review pass five of command surfacing. Read review/review-brief-5.txt in the packet first and follow it. Review the files in review/review-scope-5.txt whose area equals your lineage label without its -5 suffix, plus docs that describe them. Each finding is P0, P1 or P2 with file:line and a concrete input. Check the kill switch and direct-call switch paths, command offers on refusal, question, history or mention, Vibe journal scoring, the doctor hooks-file reading, docs against code, and holdout hygiene. Never open command-prompts.jsonl, holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through jq del(.prompt), and print counts only. Change no code and write only inside your lineage folder.
- **What the focus checks found:** the kill switch and the direct-call off switch stop every shipped path (Vibe, Pi, DSH, Claude, Codex, Cursor, Devin, the OpenCode plugin and the direct call), with one source-run resolver gap recorded as P2. The doctor reads `.vibe/hooks.toml` correctly for the entry it claims to check, but ignores the `match` filter, which is P2. The Vibe document line is produced only for a real head, except for a context that begins with the directive block (the older-build no-head shape), which can gain a document line for a command named in its directives. Docs and code disagree in two places: the switch table's alias scope and the hook contract's runtime summaries.
- **Command offers on refusal, question, history or mention:** the attach and mention guards are the `scorer-attach` area and this lineage did not re-review them. It checked the one Vibe surface that can still surface a command (the document line) and found the directive-only case above.
- **Vibe journal scoring:** the transcript scorer is the `accuracy-runner-5` area. This lineage read no scorer code and no journal row; the boundary is recorded in Deferred Items.
- **Holdout:** no scoped file names `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`; no corpus file was opened and no prompt text was printed.
- **Release readiness:** `in-progress`. The cap was reached without a convergence event, per the release-readiness rule that only a converged PASS or CONDITIONAL becomes `converged`.

---

## 2. Planning Trigger

No `/speckit:plan` follow-up is required for this lineage: the verdict is PASS with advisories, and the P2 items can be handled as ordinary follow-ups. The packet is included with `triggered: false`.

```json Planning Packet
{
  "triggered": false,
  "triggerReason": "PASS with eight P2 advisories; no P0 or P1 remains.",
  "verdict": "PASS",
  "hasAdvisories": true,
  "counts": { "p0": 0, "p1": 0, "p2": 8, "active": 8, "iterations": 4 },
  "activeFindings": [
    { "id": "R1-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:125", "origin": "introduced", "workGroup": "ADV1" },
    { "id": "R1-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:64", "origin": "introduced", "workGroup": "ADV1" },
    { "id": "R2-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:71", "origin": "pre-existing", "workGroup": "ADV2" },
    { "id": "R2-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:173", "origin": "pre-existing", "workGroup": "ADV3" },
    { "id": "R3-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:249", "origin": "introduced", "workGroup": "ADV4" },
    { "id": "R3-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:84", "origin": "introduced", "workGroup": "ADV3" },
    { "id": "R4-P2-001", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:68", "origin": "introduced", "workGroup": "ADV1" },
    { "id": "R4-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:203", "origin": "introduced", "workGroup": "ADV4" }
  ],
  "remediationWorkstreams": [],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": ["boundary_parsing", "unverified_claim", "fail_open_control_bypass", "doc_code_drift", "false_pass_diagnostic", "partial_injection", "test_naming_gap"],
  "affectedSurfacesSeed": [
    "Vibe prompt advisor part",
    "Vibe head receipt",
    "hook contract switch table",
    "doctor hook-wiring check",
    "doctor runtime-mirrors contract test",
    "source-run advisor handler"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Location | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surfaces |
|----|-----|-----------|----------|----------|--------|--------------------|-------------|---------------|-------------|-------------------|
| R1-P2-001 | P2 | correctness | `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:125` | `separator > 0` treats a context that starts with the directive block as a head; `reduceRepeatedHead:174-177` explicitly recognizes the directive-only older-build shape, and the probe shows `withCommandDocuments` appends a document line to it. The current headed fallback `Advisor: ...\nDirectives:` is unchanged. | A directive-only fallback whose directive text names a command gains a `Command documents` line after the directives, though no command was offered. | Treat a context that starts with `Directives:` as headless and return it unchanged, mirroring `reduceRepeatedHead`. | Advisory | `boundary_parsing` | The part is in scope; the directive-only shape is documented by its sibling function. | Vibe directive-only fallback, document line placement |
| R1-P2-002 | P2 | correctness | `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:64` | `isChildSession` reads `payload.parent_session_id`; no Vibe payload schema in the repository names the key and the Vibe suite has no case for it (`vibe-prompt-advisor.vitest.ts`). | The contract's "a subagent turn gets no brief" is unverified; a payload that marks its parent under another key gets a brief. | Cite Vibe's payload contract and add a case, or soften `skill-advisor-hook.md:95`. | Advisory | `unverified_claim` | Part and contract are in scope; `AI_SESSION_CHILD` is the only proven child marker. | Vibe subagent turns, child-session suppression |
| R2-P2-001 | P2 | security | `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:71` | Six parent hops from the source folder resolve `<repository-parent>/hooks/shared/hook-flags.cjs`; the `require` throws and `skillAdvisorHookEnabled` returns `true`. The dist file resolves `.skilled/hooks/shared/hook-flags.cjs`. | A source-run handler ignores `SYSTEM_SKILL_ADVISOR_DISABLED`; only the explicit `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1'` check at `:301` stops it. | Resolve the resolver by walking up to the nearest `.skilled/hooks/shared/hook-flags.cjs`, as `advisor-disabled.ts` does. | Advisory | `fail_open_control_bypass` | The handler is in scope; the shipped dist path resolves. | Canonical kill switch, source-run handler |
| R2-P2-002 | P2 | security | `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:173` | `hook-flags.cjs:70-77` lists both `_HOOK_DISABLED` and `_PLUGIN_DISABLED` as aliases of one concern; the OpenCode plugin asks the same resolver at `.opencode/plugins/system-skill-advisor.js:205-207`, as does the Vibe part at `prompt-advisor.mjs:216`. | The table implies a hook-versus-plugin split; either name silences every adapter. | State that both names disable every adapter, or give the two names distinct resolvers. | Advisory | `doc_code_drift` | The contract is in scope; the resolver and plugin are context evidence. | Kill-switch documentation, OpenCode plugin, Vibe part |
| R3-P2-001 | P2 | traceability | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:249` | `tomlCommands` captures only `type` and `command`; `match` is ignored. The repository's `.vibe/hooks.toml` pairs `match = "main"` with both turn hooks (`:18`, `:28`) and uses other values elsewhere (`:84`, `:92`, `:135`), which is the evidence that the field scopes the hook. | A `pre_agent` entry scoped away from the main agent reads `ok vibe` although the main prompt gets no turn-start. The filter semantics are an inference from the tracked file; the check's omission of the field is the verified part. | Read `match` and require the main-agent form (or no filter) before reporting the entry wired. | Advisory | `false_pass_diagnostic` | The check and test are in scope; the hooks file is the input it reads. | Doctor hook-wiring check, Vibe prompt entry |
| R3-P2-002 | P2 | traceability | `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:84` | The section intro says "Every native runtime, Pi and DSH run the same hook handler"; the starting-a-surfaced-command table at `:103-111` has no Vibe row, while the Vibe row at `:95` says it proxies the compiled handler. | Readers miss the new runtime in the two summaries that answer which runtimes use the handler and which can start a command. | Add Vibe to the intro and to the command-start table. | Advisory | `doc_code_drift` | The contract is in scope; the handler and part are in scope. | Hook contract, Vibe document line |
| R4-P2-001 | P2 | maintainability | `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:68` | `headReceiptDir` reads `process.env` and `tmpdir()`; the default read and write close over those. The same dependency object accepts `env`, which only reaches `isChildSession`. | A caller injecting only `env` writes and reads receipts in the real temporary folder, so cases can depend on earlier runs. | Thread the injected `env` into the receipt directory, or derive the defaults from it. | Advisory | `partial_injection` | Part and suite are in scope; the dependency object is public. | Vibe head receipt, test isolation |
| R4-P2-002 | P2 | maintainability | `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:203` | `MIRROR_CHECKS` is `[...DSH_CHECKS, ...VIBE_CHECKS]` and `routeGaps` iterates all six, but the route test is named for DSH only. | A Vibe route failure is reported under a DSH-only test name; a name search for Vibe coverage finds none. | Rename the test to name the mirror checks it now covers. | Advisory | `test_naming_gap` | The test is in scope; the changed line added the Vibe rows. | Doctor contract test, CI failure attribution |

---

## 4. Remediation Workstreams

No P0 or P1 workstream exists. The P2 advisories group as follows:

- **ADV1, Vibe part boundary and injection (R1-P2-001, R1-P2-002, R4-P2-001).** One file, three small changes: guard the document line against the fallback shape, verify or soften the subagent claim, and thread the injected environment into the receipt directory.
- **ADV2, source-run resolver (R2-P2-001).** One handler helper; low blast radius, no shipped-path change.
- **ADV3, hook contract sentences (R2-P2-002, R3-P2-002).** One document; four rows and two sentences.
- **ADV4, doctor diagnostics (R3-P2-001, R4-P2-002).** The check and its contract test; the `match` read is the larger of the two.

---

## 5. Spec Seed

- If a follow-up packet is authored, state whether the Vibe turn-start `match` filter is part of the hook-wiring check's contract, and add the filtered-entry case to phase 030 `REQ-004`.
- Record the source-run handler as an explicit non-goal for the shipped kill switch, or require the resolver lookup to be location-independent.
- Decide whether the hook and plugin alias names are meant to be distinct scopes; the shared resolver currently makes them one.

---

## 6. Plan Seed

None. The Planning Packet is not triggered.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | Phase 030 `REQ-004` (ok vibe, three negative cases, skipped without `.vibe/`) holds and the check printed `ok vibe` on this checkout; `REQ-005` holds at nine workflow lines and three route lines; `REQ-006`/`REQ-007` hold for the three real-advisor cases; `REQ-010`'s wiring and hook-doc sentences hold; phase 029 `REQ-001` to `REQ-008` hold for the direct call and the daemon. | The no-brief fallback and the `match` filter are entry shapes no requirement names; the alias-scope row in phase 029's doc claim is false as written. |
| `checklist_evidence` | partial | Phase 030 `AC-004`, `AC-005`, `AC-006`, `AC-007`, `AC-010` are Met with observable evidence; phase 029 `AC-006` and `AC-009` are Met. | `AC-009` verifies that the listed lines did not change, not that they are true; no AC covers the fallback, the `match` filter or the summary rows. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `skill_agent` | notApplicable | No agent definition changed in this area. | None. |
| `agent_cross_runtime` | pass | The Vibe part is runtime-neutral, calls the shared handler under `runtime: 'vibe'`, and the handler labels the observation `vibe`; the hook contract's per-runtime table names the same delivery channel. | Live per-runtime proof is not available in this lineage. |
| `feature_catalog_code` | notApplicable | The feature-catalog, changelog and playbook pages belong to `docs-metadata-5`. | None in this lineage. |
| `playbook_capability` | partial | The Vibe command-document scenario pins the document line and the child arm; the hook validation doc describes the switch table. | Neither scenario exercises the `match` filter or the receipt injection. |

### AC_COVERAGE

`exempt`. The review target is a Level 3 packet with no root `acceptance-criteria.md` and no root `implementation-summary.md`; the phase folders that carry them are outside this lineage's declared file area. No AC coverage ratio is computed here, and the signal stays advisory.

---

## 8. Deferred Items

- **Transcript scorer and Vibe journal records** — `accuracy-runner-5` owns the scorer's Vibe tool table, the journal reader and the offer/load arithmetic. This lineage did not open the scorer or any journal row.
- **Launcher and direct-call CLI internals** — `kill-switch-cli-5` owns `system-skill-advisor-launcher.cjs`, `skill-advisor-cli.ts`, `advisor-disabled.ts` and their tests. This lineage read them as context for the doc rows only.
- **Feature catalog, changelog, playbook and graph metadata** — `docs-metadata-5` owns those pages, including `advisor-recommend.md`, `command-meaning-matching.md`, `doctor-command-routing.md`, `vibe-command-documents.md` and the changelog.
- **Live per-runtime proof** — no Vibe or Claude session was run; the claims rest on the hook entry points and the suites.

---

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept (saturated directions): none
- Dimensions completed: correctness, security, traceability, maintainability
- Pivot lineage: none
- Remaining frontier: none recorded

---

## 9. Search Ledger

- **Ledger rows:** 15 recorded across the four deltas (`SL-001` to `SL-015`).
- **Dispositions:** 8 linked findings, 7 ruled out, 0 deferred, 0 blocked.
- **`searchCoverage` (union):** required bug classes `boundary_parsing`, `unverified_claim`, `state_transition`, `doc_code_drift`, `fail_open_control_bypass`, `environment_precedence`, `trust_boundary`, `false_pass_diagnostic`, `coverage_gap`, `holdout_leak`, `partial_injection`, `dead_code`, `test_naming_gap`; covered `boundary_parsing`, `unverified_claim`, `fail_open_control_bypass`, `doc_code_drift`, `false_pass_diagnostic`, `partial_injection`, `test_naming_gap`; ruled out `state_transition`, `environment_precedence`, `trust_boundary`, `coverage_gap`, `holdout_leak`, `dead_code`.
- **`searchDebt`:** none. **`cleanSearchProof`:** every active finding carries file:line evidence and a concrete input; every ruled-out row names the check that eliminated it.
- **Graph coverage:** `graphless_fallback`; the coverage graph was not seeded in this lineage and no graph decision was used to stop the loop.

---

## 10. Audit Appendix

### Convergence

| Iteration | Dimension | New | Ratio | Active after |
|---|---|---|---|---|
| 1 | correctness | 2 P2 | 1.0 | 2 P2 |
| 2 | security | 2 P2 | 0.5 | 4 P2 |
| 3 | traceability | 2 P2 | 0.3333 | 6 P2 |
| 4 | maintainability | 2 P2 | 0.25 | 8 P2 |

- Stop reason: `maxIterationsReached` (4 of 4). Convergence was not declared; the last ratio is above the 0.10 threshold.
- Every iteration ended with `Review verdict: PASS`; no P0 or P1 was active at any stop.

### Coverage

- Dimensions covered: 4 of 4 (correctness, security, traceability, maintainability).
- Files covered: all twelve scoped paths were read, and the route, workflow, hook contract, resolver, plugin, launcher and the phase 030 and 029 documents were read as integration evidence.
- Iterations: `iterations/iteration-001.md` to `iteration-004.md`; deltas `deltas/iter-001.jsonl` to `iter-004.jsonl`.

### Ruled-Out Claims

- The compiled route and the document line cannot escape the commands tree; the token capture is `[a-z][a-z0-9-]*` and a missing file is skipped.
- The doc line is not added for a headed brief with no command; the suite pins the unchanged case.
- The Vibe child marker and the kill switch are independent; either one alone returns no brief.
- The direct call reads the environment over the flags file, and the daemon reads no file.
- The host allowlist strips the switch names and `HOOK_FLAGS_CONFIG` from a daemon it starts.
- The Vibe mirror rows exist in CI, the route and the workflow, each with `--check`, an n/a rule and a repair line.
- `.vibe` ships an agents tree, so the new allowlist entry is not a phantom runtime.
- The removed `--scope=council` value was not supported by the deep-loop workflow.
- No scoped file reads a holdout corpus.

### Corrections

- **R1-P2-001's registered claim named the current no-brief fallback as its input.** The current handler always renders a status head before its directives (`render.ts:655-663`), so that part of the claim was too broad. The defect was re-probed at synthesis against the directive-only shape the module's own `reduceRepeatedHead` supports (`prompt-advisor.mjs:174-177`), where it reproduces; the finding's id, P2 severity and count are unchanged. The delta and ledger claim is append-only and still carries the broader wording, so this report is the corrected adjudication.
- The same re-probe confirms the headed fallback (`Advisor: no skill matched.\nDirectives: ...`) is unchanged by `withCommandDocuments`.

### Deviations

- **Coverage graph seed skipped.** The init step that upserts the coverage graph writes through `upsert.cjs` into the spec folder's graph store, which is outside this lineage's write authority. The lineage therefore ran graphless (`graphCoverageMode: graphless_fallback`) and stopped at the iteration cap, a terminal stop that needs no graph decision. The reducer's `graphConvergenceScore` is 0 and the dashboard's graph section is empty.
- **Resource-map emission skipped.** No root `resource-map.md` exists for this target, the config records `resource_map_present: false`, and the fan-out merge is parent-owned; the lineage report carries no Resource Map Coverage Gate section.
- **`match` filter semantics** are an inference from the tracked `.vibe/hooks.toml` pairing of `match = "main"` with both turn hooks; the verified part of R3-P2-001 is that the check never reads the field.

### Sources Reviewed

- Scoped code and tests: `review/review-scope-5.txt` lines 3-48 filtered to `vibe-hooks-doctor`.
- The pass-five brief and focus: `review/review-brief-5.txt`, `review/review-focus-5.txt`.
- Packet phases: `030-vibe-runtime-parity/spec.md`, `acceptance-criteria.md`, `implementation-summary.md`; `029-direct-call-kill-switch/spec.md`, `acceptance-criteria.md`, `plan.md`; `028-direct-call-off-switch/spec.md`.
- Probe outputs: `hook-wiring-check.cjs --root .` (five `ok` lines, exit 0), node URL resolution for the source and dist resolver paths, and the `withCommandDocuments` directive-only probe with its headed control.

### Cross-Reference Appendix

**Core Protocols:** `spec_code` partial, `checklist_evidence` partial.

**Overlay Protocols:** `skill_agent` notApplicable, `agent_cross_runtime` pass, `feature_catalog_code` notApplicable, `playbook_capability` partial.

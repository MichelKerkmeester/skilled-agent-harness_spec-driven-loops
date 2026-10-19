# Deep Review Report: OpenCode v1 and v2 dual compatibility

Review target: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat` (spec-folder). Session `2026-10-19T06:42:21.035Z`, generation 1, a restart of session `2026-10-19T06:03:39.878Z`, which was archived to `review-archive/20261019T064206Z` after its iteration 1 errored before any model call.

---

## 1. Executive Summary

- **Verdict: CONDITIONAL**
- **hasAdvisories:** false. The verdict is not PASS, so the advisory flag does not apply. The 12 P2 items are listed separately.
- **Active findings:** P0 = 0, P1 = 1, P2 = 12.
- **hasSearchDebt:** true. One deferred obligation, SL-005, is open (see the Search Ledger).
- **Scope:** the 157 repo-relative files in `goal-file-manifest.txt`, validated with 0 errors: 157 entries, plus 2 comment lines that make up the 159-line file. Five iterations ran on the cli-pi executor (`llmgateway/deepseek-v4.1-flash`, `--thinking max`) under `stopPolicy=max-iterations` and `convergenceMode=off`. All four dimensions are covered.
- **Stop reason:** `maxIterationsReached`.

The build's code paths hold up. No P0 surfaced in any dimension, and every security finding is a guard-bypass of a quality guard, not a credential or data boundary. The one P1 is a completion-state contradiction inside the packet's own closeout document, which a release decision would read.

---

## 2. Planning Trigger

`/speckit:plan` is required: an active P1 exists.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R3-P1-001", "severity": "P1", "dimension": "traceability", "file": "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md", "line": 86},
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".opencode/plugins/lib/v2-bridge.js", "line": 8},
    {"id": "R1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/dispatch/lib/opencode-version.mjs", "line": 186},
    {"id": "R1-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/dispatch/lib/opencode-version.mjs", "line": 71},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs", "line": 93},
    {"id": "R2-P2-002", "severity": "P2", "dimension": "security", "file": ".opencode/plugins/cli-dispatch-audit.js", "line": 75},
    {"id": "R2-P2-003", "severity": "P2", "dimension": "security", "file": ".skilled/hooks/dispatch/lib/dispatch-audit.mjs", "line": 391},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/acceptance-criteria.md", "line": 41},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/proof.md", "line": 88},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh", "line": 85},
    {"id": "R4-P2-002", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs", "line": 305},
    {"id": "R5-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/bin/tests/opencode-config-shape.test.cjs", "line": 25},
    {"id": "R5-P2-002", "severity": "P2", "dimension": "correctness", "file": ".github/workflows/opencode-dual-version.yml", "line": 13}
  ],
  "remediationWorkstreams": [
    "WS-1 (P1): reconcile the closeout completion state in 011 acceptance-criteria.md",
    "WS-2 (P2): dispatch-guard bypass and fail-open edges",
    "WS-3 (P2): version-classifier consolidation and family-set derivation",
    "WS-4 (P2): parity tests and CI path coverage",
    "WS-5 (P2): documentation and record drift"
  ],
  "specSeed": [
    "Close or reopen 011: either fill the closure statement (Closeable: Yes, Status: Complete) or set completion_pct and the phase map back to in-progress",
    "Record sk-vision chat.message as an accepted v2 gap, or port it to ctx.session.hook('prompt')"
  ],
  "planSeed": [
    "Edit 011-two-version-proof-and-closeout/acceptance-criteria.md lines 41, 86 and 88 to match the Complete state, then rerun validate.sh --strict",
    "Set Status: Complete in 001-004 acceptance-criteria.md line 41 and resolve 001's Closeable: No",
    "Extract one shared version-family classifier with a fixture corpus; derive appliesTo-both from SUPPORTED_FAMILIES",
    "Move SPECKIT_DISPATCH_NEGATIVE_CONTROL out of the evaluated command string; split CLI_DISPATCH_AUDIT_DISABLED from enforcement",
    "Extend the opencode-dual-version.yml paths filter to agents and .skilled/hooks/dispatch/**; add a v2 config-shape assertion"
  ],
  "findingClasses": ["status_divergence", "guard_bypass", "fail_open_widening", "duplicated_implementation_divergence", "hardcoded_enumeration", "missing_parity_test", "nonreproducible_evidence", "hook_registration", "error_handling"],
  "affectedSurfacesSeed": [
    "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/",
    "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/00[1-4]-*/acceptance-criteria.md",
    ".skilled/hooks/dispatch/lib/",
    ".opencode/plugins/cli-dispatch-audit.js",
    ".opencode/plugins/lib/v2-bridge.js",
    ".skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs",
    ".skilled/commands/doctor/scripts/opencode-version-battery.cjs",
    ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh",
    ".skilled/bin/tests/opencode-config-shape.test.cjs",
    ".github/workflows/opencode-dual-version.yml"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

Evidence basis key: **run-confirmed** means the iteration ran a command whose output supports the claim. **direct-read** means the claim is about text that the iteration read at the cited line, so reading it settles the claim. **inferred** means the behavior was reasoned from code that was read but not executed.

| ID | Sev | Dimension | file:line | Claim | Evidence basis |
|---|---|---|---|---|---|
| R3-P1-001 | P1 | traceability | `011-two-version-proof-and-closeout/acceptance-criteria.md:86` | The closeout document says `Closeable: No` (`:86`), `Status: Draft` (`:41`) and scaffold text `Not started...` (`:88`), while its own frontmatter has `completion_pct: 100` and `spec.md:124` and `011/implementation-summary.md:43` say Complete. | direct-read plus run-confirmed: a `grep -i "closable\|closure"` over both `decisions.txt` files found no waiver. It was replayed and confirmed in iteration 5, and re-read at synthesis (adversarial self-check). |
| R1-P2-001 | P2 | correctness | `.opencode/plugins/lib/v2-bridge.js:8` | `MAPPED_HOOKS` omits `chat.message`, so sk-vision's pre-submit hook (`vision-runtime/src/plugin.ts:188`) is skipped on v2 (`v2-bridge.js:221`). `research/research.md:63` records a v2 destination for it, and no phase doc records the loss. | inferred. The skip is tested as intended (`v2-bridge.test.cjs:632`); what is missing is the gap record. |
| R1-P2-002 | P2 | correctness | `.skilled/hooks/dispatch/lib/opencode-version.mjs:186` | A path-qualified binary resolves to `unknown`, but the rule engine matches path-qualified binaries (`dispatch-rule-checks.mjs:16`). The `unknown` downgrade (`:319`) turns the v1-only error rule `command-flag-for-slash-prompt` (`hard-rules.json:26`) into a warning. | inferred |
| R1-P2-003 | P2 | correctness | `.skilled/hooks/dispatch/lib/opencode-version.mjs:71` | `probeWithTimeout` races a timer against a microtask that runs `spawnSync` (`:56`). The timer cannot fire on the shipped path; only `spawnSync`'s own timeout bounds it. | inferred |
| R2-P2-001 | P2 | security | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:93` | `SPECKIT_DISPATCH_NEGATIVE_CONTROL=1` inside the evaluated command string makes two Hermes hard rules return passed (`:186`, `:203`). | inferred |
| R2-P2-002 | P2 | security | `.opencode/plugins/cli-dispatch-audit.js:75` | `CLI_DISPATCH_AUDIT_DISABLED` also turns off the pre-execution dispatch refusal, not only the audit telemetry. | inferred. The owning module documents a whole-surface no-op (`dispatch-audit.mjs:15-18`). |
| R2-P2-003 | P2 | security | `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:391` | Subshell, `!`, `nohup` and `command` prefixes and `env -S` classify as `none`, which skips both the audit and the refusal for print-flagless executor shapes. | inferred. The iteration states the mechanism was "read token by token, not executed". |
| R3-P2-001 | P2 | traceability | `001-unknowns-and-baseline/acceptance-criteria.md:41` | Children 001-004 keep `Status: Draft` at line 41 while 005-010 read Complete, and 001 keeps `Closeable: No` (`:90`). | direct-read plus run-confirmed: `grep -c '| Unmet |'` returns 0 for all eleven children. |
| R3-P2-002 | P2 | traceability | `011-two-version-proof-and-closeout/proof.md:88` | The proof records `SKILL.md words 4,904 of 5,000` with no command named, and `wc -w` returns 4,972. | run-confirmed for the measurement (`wc -w`). Whether it is a defect has low-medium confidence, because the ceiling's own counter was not read. |
| R4-P2-001 | P2 | maintainability | `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:85` | There are four copies of the version-output classifier: `opencode-version.mjs:104`, `opencode-version.cjs:142`, `opencode-version-battery.cjs:146` and the installer. The installer's copy reads a different grammar. | run-confirmed for the duplication (`rg -n "VERSION_PATTERN\|major === 1"` returns the three Node copies and no shared module). The grammar divergence is inferred. |
| R4-P2-002 | P2 | maintainability | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:305` | "Applies to both families" is a literal v1-and-v2 conjunction (`:305-306`) that keys the unknown-version downgrade (`:319`), so a third family silently changes which rules keep blocking severity. | inferred |
| R5-P2-001 | P2 | security | `.skilled/bin/tests/opencode-config-shape.test.cjs:25` | The config-shape guard pins one family's key names (`:22`, `:25`, test named "keeps the v1 config shape" at `:28`). Nothing asserts the other family's shape or the permission value vocabulary, and agent-frontmatter denials are checked by nothing. | inferred |
| R5-P2-002 | P2 | correctness | `.github/workflows/opencode-dual-version.yml:13` | The workflow's `paths:` filters (`:13-22`) leave out agent definitions and `.skilled/hooks/dispatch/**`, so the two-version battery never runs for a change to those surfaces. | direct-read of the filter; no workflow run |

Severity calibration notes:
- **R3-P1-001 stays P1.** The repository's completion rule requires that no packet doc claim a different completion state, and this one does, in the document whose job is to decide closure. Downgrade trigger: a convention or generator showing that the closure block is filled at a later release step.
- **The four guard-bypass P2s (R2-P2-001/002/003, R1-P2-002) affect quality and confinement guards, not credential boundaries.** Each would rise to P1 if a model-authored command were shown to reach the bypass in practice.

---

## 4. Remediation Workstreams

1. **WS-1 (P1), closeout state.** R3-P1-001. Make the 011 acceptance criteria agree with the Complete state, or make the other four fields agree with `Closeable: No`. Then rerun `validate.sh --strict`. Note that strict validation passed over this text, so no gate catches it.
2. **WS-2 (P2), dispatch-guard edges.** R2-P2-001, R2-P2-002, R2-P2-003, R1-P2-002, R1-P2-003.
3. **WS-3 (P2), version-family source of truth.** R4-P2-001, R4-P2-002. Use one shared classifier and one `SUPPORTED_FAMILIES` list, backed by a fixture corpus.
4. **WS-4 (P2), parity tests and CI path coverage.** R5-P2-001, R5-P2-002.
5. **WS-5 (P2), record drift.** R1-P2-001 (record the v2 `chat.message` gap), R3-P2-001, R3-P2-002.

---

## 5. Spec Seed

- Decide whether packet 082 is closed. If it is, write the 011 closure statement and set `Status: Complete` in children 001-004. If it is not, set `completion_pct` and the parent phase map back.
- Record sk-vision's `chat.message` hook as an accepted v2 gap next to the nine irreducible gaps, or port it to `ctx.session.hook("prompt")`.
- Name the counter behind the `SKILL.md` word-ceiling row in `proof.md`.

## 6. Plan Seed

- T1: edit `011-two-version-proof-and-closeout/acceptance-criteria.md:41,86,88`, then run strict validation.
- T2: set the `Status` line in `001-004/acceptance-criteria.md:41` and resolve `001` `:90`.
- T3: extract a shared version-family classifier, point `opencode-version.mjs`, `opencode-version.cjs`, the doctor battery and `opencode-setup.sh` at it or at a shared fixture corpus, and derive `appliesTo` coverage from `SUPPORTED_FAMILIES`.
- T4: probe a path-qualified binary in `resolveOpencodeVersionSync`, and document that the default probe is bounded by `spawnSync`.
- T5: move the negative-control marker out of the evaluated string, split the audit kill switch from enforcement, and add the unmodeled prefixes to the recognizer with unit cases.
- T6: extend the `opencode-dual-version.yml` paths filter, and add a v2 config-shape assertion plus an agent-frontmatter permission check.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | All 157 manifest paths resolve on disk, 0 missing (iteration 3). Spot-checked claims hold: the dated SKILL.md claim, the eight-reference claim and the six hard rules. Replayed in iteration 5. |
| `checklist_evidence` | fail | Criteria rows are Met with observed evidence, but the document-level completion metadata contradicts them (R3-P1-001, R3-P2-001). |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | pass | `cli-opencode/SKILL.md` carries the dated verification claim at the place AC-005 cites. |
| `agent_cross_runtime` | partial | `.skilled/agents/` and `.opencode/agents/` carry the same eleven filenames. Body parity was not confirmed. |
| `feature_catalog_code` | pass | Verified in iteration 2. |
| `playbook_capability` | pass on structure | 56 playbook pages, all linked from the index. Only 24 of them are in the manifest. |

`AC_COVERAGE`: exempt. The packet root is research-record level with no root `checklist.md`.

Resource Map Coverage Gate: `resource-map.md` is not present at the packet root, so the gate was skipped. The review's own `review/resource-map.md` was emitted from the deltas.

---

## 8. Deferred Items

- **SL-005:** whether OpenCode 2 accepts the `-m <model>#<effort>` suffix that `fanout-run.cjs:2410` emits. Deferred in iteration 1 and never closed.
- **agent_cross_runtime body parity:** only filename parity was checked.
- **Observation, not a finding:** `sessionEventState` in `v2-bridge.js:226` showed no growth path.
- **Coverage:** iterations reviewed 22, 29, 17, 13 and 18 file references, so not every one of the 157 manifest files received a dedicated read. The strategy's per-file table records which ones did.

## Dimension Expansion Map

No divergent pivots ran (`convergenceMode=off`): 0 completed, 0 failed, 0 overrides, no saturated directions. Breadth came from the dimension queue (correctness, security, traceability, maintainability) plus one broadened pass in iteration 5. That pass covered previously unread files and replayed findings.

---

## 9. Search Ledger

- `searchCoverage.requiredBugClasses`: `missing_parity_test`, `guard_bypass`, `doc_code_contract_drift`, `hook_registration`. Covered: `missing_parity_test`, `guard_bypass`. Ruled out: `doc_code_contract_drift`, `hook_registration`, `duplicated_implementation_divergence`. `graphCoverageMode`: `graphless_fallback`.
- `candidateCoverage.covered`: `count_mismatch`, `duplicated_implementation_divergence`, `error_handling`, `fail_open_widening`, `guard_bypass`, `hardcoded_enumeration`, `hook_registration`, `missing_parity_test`, `nonreproducible_evidence`, `status_divergence`.
- `candidateCoverage.ruledOut` includes `ci_injection`, `command_injection`, `subprocess_injection`, `path_traversal`, `secret_exposure`, `data_egress`, `destructive_write` and `unbounded_state`.
- `searchDebt`: **hasSearchDebt: true**. One item: SL-005 (`version_gate`, `fanout-run.cjs:2406`), deferred because it needs the cli-opencode invocation contract and the research verdict on the variant suffix.
- `cleanSearchProof`: SL-004 rules out the v2 child running in the wrong directory, because cwd is threaded from builder to spawn (`fanout-run.cjs:3767`). SL-006 rules out the bridge's null-and-undefined paths.

---

## 10. Audit Appendix

### Convergence summary

| Iter | Dimension | newFindingsRatio | P0/P1/P2 new | Graph decision before dispatch |
|---|---|---|---|---|
| 1 | correctness (inventory pass) | 1.00 | 0/0/3 | STOP_BLOCKED (0.40) |
| 2 | security | 0.50 | 0/0/3 | STOP_BLOCKED (0.75) |
| 3 | traceability | 0.15 | 0/1/2 | STOP_BLOCKED (0.833) |
| 4 | maintainability | 0.15 | 0/0/2 | STOP_BLOCKED (0.871) |
| 5 | correctness and security, broadened, plus replay | 0.15 | 0/0/2 (P1 replayed) | STOP_BLOCKED (0.888) |

The final check before iteration 6 gave graph STOP_BLOCKED (0.861) with blocker `uncovered_dimensions`. Under `stopPolicy=max-iterations`, convergence was telemetry only. The loop stopped on `maxIterationsReached`, and the last claim-adjudication event passed, so nothing vetoed the stop.

### Coverage summary

Dimension coverage is 4 of 4 (correctness, security, traceability, maintainability), all true in the reducer registry.

### Route proof

Every iteration record carries `target_agent: "deep-review"`, `agent_definition_loaded: true` and `resolved_route: "Resolved route: mode=review target_agent=deep-review"`. `verify-iteration.cjs` exited 0 for all five. Each dispatch receipt records `pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max <prompt>`.

### Claim adjudication

Typed packets were present for R3-P1-001. The first iteration-3 adjudication event recorded `passed: false` because the orchestrator's checker matched only quoted JSON keys, and the packet uses bold markdown labels. A corrected `passed: true` event was appended. Both rows remain in the ledger.

### Ruled-out claims

The full list is in Search Ledger `candidateCoverage.ruledOut`. No injection, traversal, secret-exposure or destructive-write path was found.

### Sources reviewed

The per-iteration `filesReviewed` lists are in `deep-review-state.jsonl`. The narratives are `iterations/iteration-001.md` through `iteration-005.md`.

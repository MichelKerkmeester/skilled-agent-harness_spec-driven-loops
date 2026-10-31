# Deep Review Report — Doc Validation Off Switches

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- Active findings: 0 P0, 1 P1, 4 P2.
- `hasAdvisories`: false under the workflow rule because the verdict is already CONDITIONAL from an active P1. The four P2 items remain listed as advisory findings.
- Review target: `specs/sk-doc/062-doc-validation-off-switches` (spec-folder), all four review dimensions.
- Stop reason: `maxIterationsReached` after five inline passes.
- No tests, repository validators, git writes, continuity writer, or nested executor were run. Packet test claims were inspected but not independently replayed.

The primary issue is that `progressive-validate.sh --json --level 1` merges the skip notice into the JSON payload; callers receive invalid JSON on the explicit skip path. Four lower-severity findings cover local audit status, shell environment edge behavior, and parser parity.

Scope note: `goal-file-manifest.txt` enumerates 127 paths across this packet and adjacent changelog work. The five passes focused on the target packet, its shared readers and direct consumers, and sampled the adjacent 061 changelog context; they did not reread every manifest entry file-by-file. The target had no root `resource-map.md` at initialization, so the resource-map coverage gate is not applicable.

## 2. Planning Trigger

`/speckit:plan` is required because P1-LUNA-002 is active. The packet must either remediate it or obtain an approved deferral before release readiness.

### Planning Packet
```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "P1-LUNA-002",
      "severity": "P1",
      "title": "Progressive JSON mode merges the skip notice into stdout",
      "findingClass": "cross-consumer",
      "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:262-274",
      "evidence": "When JSON mode is on, the wrapper captures validate.sh with 2>&1 and prints that capture unchanged when pipeline level 1 is final. validate.sh writes its skip notice to stderr and its JSON report to stdout, so the wrapper's stdout begins with prose and is not parseable JSON. At higher levels the generated JSON uses only the zero exit code and omits a skipped field. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:262-274] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:610-672] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:142-172]",
      "recommendation": "Keep stderr separate from the JSON payload and propagate an explicit skipped status in every progressive JSON response; add wrapper-level coverage for level 1 and the aggregate levels."
    },
    {
      "id": "P2-LUNA-001",
      "severity": "P2",
      "title": "An explicit sentinel value falls through to the config file",
      "findingClass": "algorithmic",
      "file": ".skilled/hooks/shared/hook-flags.sh:38-44",
      "evidence": "REQ-002 says a set environment value wins even when falsy. The shell resolver substitutes the literal __HF_UNSET__ for absence and compares the resolved value to that sentinel; if the environment value equals it, the resolver reads the config instead. [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130] [SOURCE: .skilled/hooks/shared/hook-flags.sh:37-44]",
      "recommendation": "Detect whether the variable is set separately from its value, then use the config only when the variable is genuinely absent; add a regression row for the sentinel literal."
    },
    {
      "id": "P2-LUNA-003",
      "severity": "P2",
      "title": "Local audit consumers report an explicit skip as a pass",
      "findingClass": "cross-consumer",
      "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh:125-150",
      "evidence": "The skip producer returns exit 0 and emits `skipped: true, passed: true`. quality-audit.sh discards stderr, increments pass on exit 0, and writes JSON status `pass`; strict-pass-freshness.ts checks exit code and `passed === false` but ignores `skipped`, then returns status `pass`. The implementation summary says a skip is no evidence. The plan acknowledges these unchanged consumers, making this a disclosed but unresolved status mismatch. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:142-172] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh:125-150] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:246-272] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md:134-141] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/plan.md:78-82]",
      "recommendation": "Surface skipped as a distinct status (or count) in local audit outputs so an opted-out run cannot be reused as validation evidence; keep the intentional local opt-out behavior documented."
    },
    {
      "id": "P2-LUNA-004",
      "severity": "P2",
      "title": "Shell truthiness removes internal whitespace",
      "findingClass": "algorithmic",
      "file": ".skilled/hooks/shared/hook-flags.sh:25-29",
      "evidence": "The shell implementation deletes all whitespace before matching, so `t r u e` becomes `true`; the Node and Python implementations trim only surrounding whitespace and reject that value. REQ-002 permits only the exact truthy tokens after surrounding trim. A process using the shared config can therefore resolve the same supplied value differently by runtime. [SOURCE: .skilled/hooks/shared/hook-flags.sh:25-29] [SOURCE: .skilled/hooks/shared/hook-flags.cjs:93-96] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation_switch.py:43-45] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:129-130]",
      "recommendation": "Normalize surrounding whitespace only in the shell resolver, matching Node and Python, and add an internal-whitespace parity case."
    },
    {
      "id": "P2-LUNA-005",
      "severity": "P2",
      "title": "A BOM-prefixed first-line switch is not recognized by two readers",
      "findingClass": "cross-consumer",
      "file": ".skilled/hooks/shared/hook-flags.sh:43-48",
      "evidence": "The Node parser's `trim()` and the sk-doc parser's `utf-8-sig` decoding remove a leading BOM; the shell grep and the dist reader's UTF-8 decoder keep it as part of the first key, so a first-line switch is absent to those two readers. REQ-008 says the four readers return the same value for every line. The implementation summary acknowledges this limitation, but its cross-reader comment test has no BOM-prefixed first-line switch; the BOM parser test compares only Python with Node. [SOURCE: .skilled/hooks/shared/hook-flags.cjs:107-122] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation_switch.py:65-80] [SOURCE: .skilled/hooks/shared/hook-flags.sh:43-48] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:35-50] [SOURCE: .skilled/hooks/shared/hook-flags.test.cjs:193-245] [SOURCE: .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py:63-76] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/spec.md:141] [SOURCE: specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md:141]",
      "recommendation": "Align BOM handling across all four readers or narrow the stated parity contract and test the agreed behavior across all four readers."
    }
  ],
  "remediationWorkstreams": [
    {
      "priority": "P1",
      "title": "Preserve skip state in progressive JSON",
      "findings": [
        "P1-LUNA-002"
      ],
      "surfaces": [
        "progressive-validate.sh",
        "validate.sh"
      ]
    },
    {
      "priority": "P2",
      "title": "Make local audit status distinguish skipped from passed",
      "findings": [
        "P2-LUNA-003"
      ],
      "surfaces": [
        "quality-audit.sh",
        "strict-pass-freshness.ts"
      ]
    },
    {
      "priority": "P2",
      "title": "Align shell switch value and precedence edge behavior",
      "findings": [
        "P2-LUNA-001",
        "P2-LUNA-004"
      ],
      "surfaces": [
        "hook-flags.sh",
        "hook-flags.test.cjs"
      ]
    },
    {
      "priority": "P2",
      "title": "Resolve the BOM parity contract",
      "findings": [
        "P2-LUNA-005"
      ],
      "surfaces": [
        "all four hook-flags.env readers",
        "cross-reader tests"
      ]
    }
  ],
  "specSeed": [
    "Clarify whether REQ-005 covers progressive-validate.sh JSON mode and require skipped-state propagation through wrappers.",
    "Extend REQ-002 evidence to cover internal whitespace and a set sentinel-like value.",
    "Either include BOM handling in REQ-008's four-reader parity contract or explicitly narrow the contract and acceptance evidence."
  ],
  "planSeed": [
    "Add a progressive-validate --json skip regression for level 1 and aggregate levels.",
    "Update quality-audit and strict-pass-freshness to surface a distinct skipped status.",
    "Align shell truthiness and environment-presence detection with Node/Python.",
    "Add a BOM-prefixed switch as a first line to the four-reader parity test."
  ],
  "findingClasses": [
    "cross-consumer",
    "algorithmic"
  ],
  "affectedSurfacesSeed": [
    "progressive-validate.sh",
    "quality-audit.sh",
    "strict-pass-freshness.ts",
    "hook-flags.sh",
    "hook-flags.cjs",
    "validation_switch.py",
    "check-dist-staleness.sh",
    "hook-flags.test.cjs"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1-LUNA-002 — Progressive JSON mode merges the skip notice into stdout
- **Dimension / class:** traceability / cross-consumer
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:262-274`
- **Evidence:** JSON mode captures the producer with `2>&1`; level 1 prints the combined result. The producer writes a skip notice to stderr and JSON to stdout. Aggregate JSON also reports `passed` from exit code without carrying `skipped`. [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:262-274`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/progressive-validate.sh:610-672`] [SOURCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:142-172`]
- **Impact:** Machine consumers of progressive JSON cannot parse a skipped level-1 run and cannot distinguish a skipped aggregate run from a pass.
- **Recommendation:** Keep stderr separate and propagate `skipped` in each progressive JSON response; cover level 1 and aggregate modes.
- **Disposition:** active; confidence 0.94; finding class `cross-consumer`.

### P2-LUNA-001 — An explicit sentinel value falls through to the config file
- **Dimension / class:** correctness / algorithmic
- **Location:** `.skilled/hooks/shared/hook-flags.sh:37-44`
- **Evidence:** The shell resolver uses `__HF_UNSET__` both as an absence marker and as a possible value, so an explicitly set value equal to it can lose precedence to a truthy file entry. [SOURCE: `.skilled/hooks/shared/hook-flags.sh:37-44`] [SOURCE: `spec.md:129-130`]
- **Impact:** A set falsy environment value may unexpectedly enable a switch from the config file.
- **Recommendation:** Detect variable presence separately from its value; add a regression case.
- **Disposition:** active; finding class `algorithmic`.

### P2-LUNA-003 — Local audit consumers report an explicit skip as a pass
- **Dimension / class:** traceability / cross-consumer
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh:125-150` and `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:253-272`
- **Evidence:** `quality-audit.sh` discards stderr and increments pass on exit 0. `strict-pass-freshness.ts` ignores `parsed.skipped` and returns `pass` when exit is 0 and `passed` is true. The summary says a skip is no evidence; the plan lists both consumers as unchanged. [SOURCE: `quality-audit.sh:125-150`] [SOURCE: `strict-pass-freshness.ts:253-272`] [SOURCE: `implementation-summary.md:138-141`] [SOURCE: `plan.md:78-82`]
- **Impact:** Local audit output can be reused as evidence even though no validation ran.
- **Recommendation:** Report `skipped` distinctly or explicitly document that these audit outputs are not completion evidence when the switch is on.
- **Disposition:** active advisory; finding class `cross-consumer`.

### P2-LUNA-004 — Shell truthiness removes internal whitespace
- **Dimension / class:** maintainability / algorithmic
- **Location:** `.skilled/hooks/shared/hook-flags.sh:25-29`
- **Evidence:** The shell reader deletes all whitespace before matching; Node and Python trim only surrounding whitespace. `t r u e` is therefore on in shell and off in the other readers. [SOURCE: `hook-flags.sh:25-29`] [SOURCE: `hook-flags.cjs:93-96`] [SOURCE: `validation_switch.py:43-45`] [SOURCE: `spec.md:129-130`]
- **Impact:** Runtimes may make different decisions for the same provided value.
- **Recommendation:** Match trim-only normalization and add an internal-whitespace parity case.
- **Disposition:** active advisory; finding class `algorithmic`.

### P2-LUNA-005 — A BOM-prefixed first-line switch is not recognized by two readers
- **Dimension / class:** maintainability / cross-consumer
- **Location:** `.skilled/hooks/shared/hook-flags.sh:43-48`
- **Evidence:** Node and sk-doc Python remove a BOM; shell and dist-check readers keep it in the first key. REQ-008 states all four readers return the same value for every line. The limitation is disclosed, but existing parity tests do not exercise a BOM-prefixed switch across all four. [SOURCE: `hook-flags.cjs:107-122`] [SOURCE: `validation_switch.py:65-80`] [SOURCE: `hook-flags.sh:43-48`] [SOURCE: `check-dist-staleness.sh:35-50`] [SOURCE: `hook-flags.test.cjs:193-245`] [SOURCE: `test_validation_switch.py:63-76`] [SOURCE: `spec.md:141`] [SOURCE: `implementation-summary.md:141`]
- **Impact:** A first-line persisted switch can turn on in only two readers.
- **Recommendation:** Align BOM handling or narrow REQ-008, and cover the agreed behavior in the four-reader test.
- **Disposition:** active advisory; finding class `cross-consumer`.

## 4. Remediation Workstreams

1. **P1 — Progressive JSON contract:** separate output channels and carry an explicit skipped state through level-1 and aggregate JSON.
2. **P2 — Audit semantics:** change quality-audit and strict-pass-freshness outputs to distinguish skipped from passed.
3. **P2 — Shell resolver parity:** remove the in-band sentinel ambiguity and internal-whitespace deletion; add focused parity cases.
4. **P2 — BOM contract:** align all four readers or narrow the spec and acceptance statement; test the chosen behavior across all readers.

## 5. Spec Seed

- Clarify whether REQ-005's JSON promise includes the progressive wrapper and specify how `skipped` propagates through it.
- State environment precedence for every set value and pin exact normalization semantics.
- Either include BOM behavior in REQ-008 or explicitly carve it out of “same value for every line.”
- Define whether local audit summaries may count an explicit skip as pass when the env reference says it is no evidence.

## 6. Plan Seed

- Add wrapper-level `--json --level 1` and aggregate skip coverage.
- Add tests proving audit consumers report a distinct skipped status.
- Add environment sentinel and internal whitespace rows to shared resolver tests.
- Add a BOM-prefixed first-line switch to the four-reader parity matrix or narrow the contract.

## 7. Traceability Status

| Protocol | Level | Status | Evidence / unresolved drift |
|---|---|---|---|
| `spec_code` | core | partial | Direct producer meets its report contract; progressive JSON consumer violates parseability on skip (P1-LUNA-002). |
| `checklist_evidence` | core | partial | AC-001..008 and task evidence are documented as Met, but were not rerun in this review. `checklist.md` is absent, so AC_COVERAGE is exempt. |
| `skill_agent` | overlay | notApplicable | No agent contract changed. |
| `agent_cross_runtime` | overlay | notApplicable | No agent cross-runtime surface changed. |
| `feature_catalog_code` | overlay | pass | The validation rule-engine catalog describes the producer's skip JSON behavior; the wrapper defect is separately identified. |
| `playbook_capability` | overlay | notApplicable | No playbook capability changed. |

The targeted `.github` search for `SPECKIT_SKIP_VALIDATION`, `SKDOC_SKIP_VALIDATION`, `HOOK_FLAGS_CONFIG`, and `SPECKIT_VALIDATION` returned no matches (exit code 1). This supports the CI-enforcement claim for the searched tree.

## 8. Deferred Items

- BOM parity is documented as a follow-up outside this packet but still conflicts with REQ-008; keep it visible until the contract is narrowed or implementation is aligned.
- The full 127-path manifest was not examined file-by-file; this review is focused on packet 062 and direct consumers, with 061 context sampled.

## Dimension Expansion Map

- **Selected directions:** switch correctness; input/config security; spec-to-consumer traceability; cross-reader parity; adversarial integration replay.
- **Completed pivots:** 5.
- **Failed pivots:** 0.
- **Audited overrides:** 1 — the plan labels the progressive wrapper unchanged; direct source recheck retained the P1.
- **Early convergence telemetry:** iteration 2 reported no new findings; the `max-iterations` policy required continuation.
- **Remaining frontier:** exhaustive file-by-file review of all manifest entries. Breadth metadata does not alter the CONDITIONAL verdict.

## Search Ledger

- **Search coverage:** targeted reads of the packet requirements, plan, acceptance criteria, task evidence, implementation summary, the four parser implementations, resolver tests, the skip producer, and direct report consumers.
- **Candidate coverage:** shell env precedence; injection boundary; 20-validator guard contract; text/JSON modes; writer/self-test exemptions; four-reader comments and examples; progressive and audit wrappers; related changelog context.
- **Search debt:** all 127 manifest paths were not reread individually; 061 was sampled.
- **Ruled-out candidates:** config-file shell execution, injection through `hook_flag_on`, interaction between 061 type detection and the 062 CLI guard, and visible switch/config names in `.github`.
- **Clean search proof:** the scoped `.github` variable-name query returned no matches; no broad proof is claimed for the full manifest.
- `hasSearchDebt: true`; the dashboard verdict remains CONDITIONAL.

## Audit Appendix

### Convergence Summary
Five iterations completed. Novelty ratios: 1.000, 0.000, 0.857, 0.222, 0.000. Early convergence remained telemetry; terminal stop reason is `maxIterationsReached`.

### Coverage Summary
Correctness, security, traceability, and maintainability were all covered. Core `spec_code` and `checklist_evidence` are partial; target `resource-map.md` was absent at initialization, so no Resource Map Coverage Gate was required. A lineage-local source map was emitted for reviewed areas.

### Ruled-Out Claims
- No shell command injection through the public shell flag API was identified; the name check precedes `eval`.
- Config values are parsed as text rather than sourced as executable shell.
- The 061 changelog type-detection work does not alter the 062 CLI skip guard.
- Targeted `.github` search found no switch/config variable names.

### Sources Reviewed
The iteration state records file-level sources per pass. Key source groups: the 062 packet docs; shared hook readers and tests; Python/Node sk-doc switch helpers; `validate.sh`, `progressive-validate.sh`, `quality-audit.sh`, and `strict-pass-freshness.ts`; validator guard/test definitions; the spec-validation feature-catalog entry; and selected 061 changelog packet docs.

### Cross-Reference Appendix
#### Core Protocols
- `spec_code`: partial — P1-LUNA-002.
- `checklist_evidence`: partial — test evidence not rerun; AC_COVERAGE exempt.

#### Overlay Protocols
- `skill_agent`: not applicable.
- `agent_cross_runtime`: not applicable.
- `feature_catalog_code`: pass.
- `playbook_capability`: not applicable.

---
title: "272 -- Strict validation add-ons: continuity freshness and evidence markers"
description: "This scenario validates the Phase 017 strict-validation add-ons for `272`. It focuses on proving strict validation now enforces continuity freshness, evidence-marker lint, and the normalizer guardrail."
version: 3.6.0.8
---

# 272 -- Strict validation add-ons: continuity freshness and evidence markers

## 1. OVERVIEW

This scenario validates the Phase 017 strict-validation add-ons for `272`. It focuses on proving strict validation now enforces continuity freshness, evidence-marker lint, and the normalizer guardrail.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `validate.sh --strict` now runs continuity-freshness, evidence-marker lint, and the normalizer lint guardrail, while the audit script remains the repair sweep.
- Real user request: `Please validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict and tell me whether the expected signals are present: strict validation fails or warns for stale continuity and malformed evidence markers; duplicate normalizers are rejected; the audit script reports structural marker findings without pretending to be the strict gate.`
- Prompt: `Validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: strict validation fails or warns for stale continuity and malformed evidence markers; duplicate normalizers are rejected; the audit script reports structural marker findings without pretending to be the strict gate
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the new strict add-ons enforce the documented failure surfaces and the audit script still behaves like the repair tool

---

## 3. TEST EXECUTION

### Prompt

```
Validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict and report cited pass/fail evidence.
```

### Commands

1. Run a fixture or packet case that triggers continuity-freshness
2. Run a malformed evidence-marker case through `validate.sh --strict`
3. Run a duplicate-normalizer fixture through the normalizer lint path
4. Run `scripts/validation/evidence-marker-audit.ts` on the same malformed evidence case and capture its report behavior

### Expected

Strict validation surfaces the continuity, evidence-marker, and duplicate-normalizer failures; the audit script reports marker issues for repair use

### Evidence

Observed on 2026-07-03 from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

Continuity freshness strict-validation case:

```text
$ set +e; env SPECKIT_RULES=CONTINUITY_FRESHNESS SPECKIT_COMPLETION_FRESHNESS=true bash ".opencode/skills/system-spec-kit/scripts/spec/validate.sh" ".opencode/specs/system-speckit/030-validate-sh-dist-freshness-and-repo-remediation/002-repo-wide-remediation-sweep" --strict --no-recursive; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: .opencode/specs/system-speckit/030-validate-sh-dist-freshness-and-repo-remediation/002-repo-wide-remediation-sweep
  Level:  1 (explicit)

───────────────────────────────────────────────────────────────


⚠ CONTINUITY_FRESHNESS: Continuity last_updated_at lags graph-metadata derived.last_save_at by more than the 10-minute heuristic policy budget
    - deltaMs=22328564
    - continuity=2026-07-02T00:00:00Z
    - graph=2026-07-02T06:12:08.564Z

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 1

  RESULT: FAILED (strict)


EXIT_CODE=2
```

Evidence-marker strict-validation case:

```text
$ set +e; env SPECKIT_RULES=EVIDENCE_MARKER_LINT bash ".opencode/skills/system-spec-kit/scripts/spec/validate.sh" ".opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing" --strict --no-recursive; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: .opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing
  Level:  2 (explicit)

───────────────────────────────────────────────────────────────


⚠ EVIDENCE_MARKER_LINT: Evidence marker lint found 0 malformed and 2 unclosed markers
    - filesScanned=481
    - totalMarkers=78
    - scratch/agent-06-hvr-compliance.md:1747:123 unclosed [EVIDENCE: `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, and `runtime-memory-inputs.vitest.ts` now assert aliasing
    - scratch/agent-06-hvr-compliance.md:1748:133 unclosed [EVIDENCE: `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, and `runtime-memory-inputs.vitest.ts` now assert aliasing

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 1

  RESULT: FAILED (strict)


EXIT_CODE=2
```

Duplicate-normalizer path and missing fixture evidence:

```text
$ rg -n "function (normalizeScope[[:alnum:]_]*|getOptionalString)\b" .opencode/skills/system-spec-kit --glob "*.ts"
Found 7 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:
  Line 300: export function normalizeScopeContext(input: ScopeContext): ScopeContext {


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:
  Line 870: function getOptionalString(row: Record<string, unknown>, key: string): string | undefined {


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/normalizer-lint.vitest.ts:
  Line 66:       'export function normalizeScopeValue(value: unknown): string | null { return typeof value === "string" ? value : null; }\n',

  Line 92:       'function normalizeScopeShadow(value: string): string { return value.trim(); }\n',

  Line 97:       'function getOptionalString(row: Record<string, unknown>, key: string): string | undefined { return typeof row[key] === "string" ? row[key] as string : undefined; }\n',

  Line 102:       'function normalizeScopeTestOnly(value: string): string { return value; }\n',

  Line 123:       'function normalizeScopeShadow(value: string): string { return value.trim(); }\n',
```

```text
$ set +e; env SPECKIT_RULES=NORMALIZER_LINT bash ".opencode/skills/system-spec-kit/scripts/spec/validate.sh" ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep" --strict --no-recursive; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: .opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Level:  3 (explicit)

───────────────────────────────────────────────────────────────


✓ NORMALIZER_LINT: No local normalizeScope*/getOptionalString declarations found outside allowed files

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


EXIT_CODE=0
```

```text
$ set +e; npx vitest run scripts/tests/normalizer-lint.vitest.ts --config mcp_server/vitest.config.ts --root .; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"

 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 skipped (1)
      Tests  3 skipped (3)
   Start at  00:18:40
   Duration  89ms (transform 16ms, setup 14ms, import 8ms, tests 0ms, environment 0ms)


EXIT_CODE=0
```

Standalone evidence-marker audit on the same malformed evidence case:

```text
$ set +e; node ".opencode/skills/system-spec-kit/scripts/dist/validation/evidence-marker-audit.js" --folder=".opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing"; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"
# EVIDENCE marker audit report

Mode: **REPORT**

## Totals

- Folders scanned: 1
- Files scanned: 481
- Total markers: 78
- OK: 76
- Malformed (closed with `)`): 0
- Unclosed (no trailing `)` before newline): 2

## Per-folder

| Folder | Files | Total | OK | Malformed | Unclosed | Rewrapped |
|---|---|---|---|---|---|---|
| `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing` | 481 | 78 | 76 | 0 | 2 | 0 |

## Problem markers (detail)

- `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-06-hvr-compliance.md:1747` [unclosed] [EVIDENCE: `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, and `runtime-memory-inputs.vitest.ts` now assert aliasing
- `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-06-hvr-compliance.md:1748` [unclosed] [EVIDENCE: `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, and `runtime-memory-inputs.vitest.ts` now assert aliasing

EXIT_CODE=1
```

Result: continuity freshness and evidence-marker strict checks produced the expected strict failure surfaces, and the standalone audit script reported marker issues as a report/repair tool. The duplicate-normalizer fixture precondition is missing in the current repo state under this scenario's write restriction: the only duplicate-helper fixture is embedded in `scripts/tests/normalizer-lint.vitest.ts`, and that suite is currently skipped.

### Pass / Fail

- **BLOCKED**: the continuity and evidence-marker expected signals are present, and the audit script reports marker issues for repair use, but the duplicate-normalizer fixture required by Command 3 is not runnable in the current repo state because the committed fixture suite is skipped and the real normalizer target has no duplicate helper violations.

### Failure Triage

Inspect `scripts/spec/validate.sh`, `scripts/validation/continuity-freshness.ts`, `scripts/validation/evidence-marker-lint.ts`, `scripts/validation/evidence-marker-audit.ts`, and `scripts/rules/check-normalizer-lint.sh`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md](../../feature_catalog/16--tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 272
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md`

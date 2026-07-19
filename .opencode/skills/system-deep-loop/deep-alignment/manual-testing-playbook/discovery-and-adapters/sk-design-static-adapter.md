---
title: "DAL-012 -- sk-design static adapter: DESIGN.md structural conformance"
description: "Verify the static (non-rendering) sk-design adapter discovers DESIGN.md/tokens.json, checks required headings + banned patterns + Quick-Start color consistency + tokens.json parse-validity, and treats audit-rubric judgment as a verify-first reasoning-agent layer requiring a cited dimension."
version: 1.0.0.0
---

# DAL-012 -- sk-design static adapter: DESIGN.md structural conformance

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-012`.

---

## 1. OVERVIEW

This scenario validates the static sk-design adapter for `DAL-012`. The objective is to verify that `discover()` collects only `DESIGN.md`/`tokens.json` artifacts (a `branchRange` scope returns empty), that `checkDesignDoc` flags missing required headings (P0), banned patterns (P1: extractor-var leak, `Variant-N`, frequency dump) and Quick-Start color drift (P1), that `checkTokensJsonArtifact` flags invalid JSON, and that the audit-rubric layer only records a reasoning-agent finding when a caller supplies a `verifiedFindings` entry carrying both a `dimension` and a `citation`. The adapter is STATIC-ONLY: it never renders or drives chrome-devtools.

### WHY THIS MATTERS

sk-design's static authority checks whether a DESIGN.md follows sk-design's own Style Reference format, not whether the rendered UI looks good (that is the live-render adapter, DAL-014). The static/live split (ADR-004/ADR-009) is a real boundary: this adapter must never render, and its subjective audit findings must be verify-first with a cited rubric dimension.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify DESIGN.md/tokens.json discover(), the structural + banned-pattern deterministic checks, the cited-dimension verify-first audit-rubric layer, and that it never renders.
- Real user request: Does this DESIGN.md follow sk-design's Style Reference format?
- Prompt: `Validate the sk-design static alignment adapter: DESIGN.md/tokens.json discover(), structural + banned-pattern deterministic checks, and the cited-dimension verify-first audit-rubric layer. Confirm it never renders.`
- Expected execution process: Run `discover` and `check` against a real DESIGN.md example, then read `REQUIRED_HEADINGS`, the banned-pattern regexes, `checkQuickStartConsistency`, and `checkAuditRubric` to confirm the deterministic checks and the verify-first reasoning-agent gate; grep the source to confirm no render/chrome path.
- Desired user-facing outcome: The user is told the adapter checks DESIGN.md structure and banned patterns deterministically, validates tokens.json parse-validity, and only records a subjective audit finding when a cited rubric dimension is supplied — and never renders anything.
- Expected signals: `discover()` collects only `DESIGN.md`/`tokens.json` (branchRange->empty); `checkDesignDoc` flags missing required headings (P0), banned patterns (P1), and Quick-Start color drift (P1); `checkTokensJsonArtifact` flags invalid JSON; `checkAuditRubric` records a finding only for a caller-supplied `verifiedFindings` entry carrying both a `dimension` and a `citation`; the adapter never renders or drives chrome-devtools (STATIC-ONLY, NFR-S01).
- Pass/fail posture: PASS if discover targets only the two basenames, the deterministic checks fire on real violations, the audit layer is verify-first, and no render path exists. FAIL if the adapter renders, guesses an audit finding, or discovers arbitrary files.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so discover is exercised before the structural and audit checks.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the sk-design static alignment adapter: DESIGN.md/tokens.json discover(), structural + banned-pattern deterministic checks, and the cited-dimension verify-first audit-rubric layer. Confirm it never renders.
### Commands
1. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs discover .opencode/skills/sk-design/design-md-generator/references/examples | head -40`
2. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs check "$(node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs discover .opencode/skills/sk-design/design-md-generator/references/examples | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const a=(j.artifacts||[]).find(x=>x.path.endsWith("DESIGN.md"));process.stdout.write(a?a.path:"")})')"`
3. `bash: rg -n 'REQUIRED_HEADINGS|EXTRACTOR_INTERNAL_VAR_RE|PLACEHOLDER_VARIANT_RE|FREQUENCY_DUMP_RE|checkQuickStartConsistency|checkAuditRubric|never render|STATIC-ONLY|DESIGN_ARTIFACT_BASENAMES' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs`
4. `bash: rg -n 'chrome-devtools|playwright|renderResult|design-mcp' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs || echo "NO RENDER PATH (expected)"`
### Expected
`discover` returns only `DESIGN.md`/`tokens.json` artifacts with `artifactKind` of `design-doc`/`tokens`; `check` on a real DESIGN.md returns deterministic findings tagged `layer:'deterministic'` (missing-heading P0 / banned-pattern P1 / Quick-Start drift P1 as applicable); the source shows the 11 `REQUIRED_HEADINGS`, the three banned-pattern regexes, `checkQuickStartConsistency`, and `checkAuditRubric` requiring both `dimension` and `citation`; command 4 confirms no render/chrome/playwright path exists.
### Evidence
Capture the discover artifact list, one real check() finding array, the source lines for the deterministic checks and the audit-rubric verify-first gate, and the no-render-path confirmation.
### Pass/Fail
PASS if discover targets only the two basenames, the deterministic checks fire on real violations, the audit layer is verify-first, and no render path exists. FAIL if the adapter renders, guesses an audit finding, or discovers arbitrary files.
### Failure Triage
If `checkAuditRubric` emits a finding with no caller `verifiedFindings`, the verify-first gate is broken (cross-reference DAL-016). If any render/chrome path appears, the STATIC-ONLY boundary (ADR-009) is violated (cross-reference DAL-024).
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `discovery-and-adapters/` | Adapter category; the sk-design static adapter CLI is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs` | discover/check, required headings, banned-pattern regexes, `checkAuditRubric` verify-first gate |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-design-adapter.md` | Full adapter specification incl. STATIC-ONLY scope and required-heading scope |
| `.opencode/skills/sk-design/design-md-generator/references/design-md-format.md` | The Style Reference format the adapter checks against |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND ADAPTERS
- Playbook ID: DAL-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery-and-adapters/sk-design-static-adapter.md`
- Note: The live-render dimension is a SEPARATE adapter (DAL-014); this scenario is the static, non-rendering authority only.

---
title: "DAL-016 -- Verify-first: no finding without a live re-probe"
description: "Verify no finding is asserted from pattern-matching alone: every adapter's reasoning-agent sub-check drops entries lacking cited evidence and only emits for confirmed contradictions, and the deterministic adapters re-read live ground truth inside check()."
version: 1.0.0.0
---

# DAL-016 -- Verify-first: no finding without a live re-probe

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-016`.

---

## 1. OVERVIEW

This scenario validates alignment invariant 1 (verify-first) for `DAL-016`. The objective is to verify that no finding is ever asserted from pattern-matching alone: the reasoning-agent sub-checks across all adapters (`checkRealityAlignment` in sk-doc, `checkPatternConformance` in sk-code, `checkAuditRubric` in sk-design, `checkJudgmentFindings` in live-render) return zero findings without caller-supplied verified evidence and skip any entry missing its required citation, while the deterministic adapters re-read live ground truth (git, validators) inside `check()` rather than trusting `discover()`-time state.

### WHY THIS MATTERS

Verify-first is the invariant that separates a trustworthy conformance finding from a plausible-looking hallucination. An LLM reviewer might pattern-match a prose claim into a "drift" finding; the engine must structurally refuse to record it until it has been re-probed against live reality with cited evidence. This is a critical-path scenario.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify reasoning-agent sub-checks never invent a finding, and deterministic adapters re-probe live reality inside check().
- Real user request: How do I know these conformance findings are real and not just an LLM guessing?
- Prompt: `Validate the deep-alignment verify-first invariant: reasoning-agent sub-checks never invent a finding, and deterministic adapters re-probe live reality inside check().`
- Expected execution process: Call each reasoning-agent sub-check with no verified evidence (expect empty findings) and with an entry missing its citation (expect it dropped); read sk-git's `check()` live re-reads; confirm SKILL.md ALWAYS-#2 / NEVER-#1 state the rule.
- Desired user-facing outcome: The user is told every subjective finding requires cited, re-probed evidence, and every deterministic finding comes from a fresh live read — the mode cannot report a finding it did not verify.
- Expected signals: `checkRealityAlignment` (sk-doc), `checkPatternConformance` (sk-code), `checkAuditRubric` (sk-design), and `checkJudgmentFindings` (live-render) each return zero findings with no caller-supplied verified evidence and skip any entry missing its required citation/evidence; sk-git's `check()` calls `commitExists`/`getCommitMessage`/`branchExists` live; SKILL.md ALWAYS-#2 and NEVER-#1 state the rule.
- Pass/fail posture: PASS if every reasoning-agent sub-check is empty without evidence and drops uncited entries, and sk-git re-reads live git per finding. FAIL if any sub-check emits a finding from an uncited or unverified entry.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the empty-without-evidence path is exercised before the uncited-entry path.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment verify-first invariant: reasoning-agent sub-checks never invent a finding, and deterministic adapters re-probe live reality inside check().
### Commands
1. `bash: node -e "const d=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs'); const c=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs'); console.log('sk-doc reality (no claims):', d.check('.opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md', {knownDeviations:[]}, {}).filter(f=>f.subcheck==='reality-alignment').length); console.log('sk-code reasoning (no findings):', c.check('.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs', {knownDeviations:[]}, {verifiedFindings:[{dimension:'naming',matchesStandard:false}]}).filter(f=>f.layer==='reasoning-agent').length);"`
2. `bash: rg -n 'only contradicted claims|never assert without|matchesStandard !== false|matchesLiveReality !== false|!jf.evidence|!vf.evidence|!vf.citation' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs`
3. `bash: rg -n 'VERIFY-FIRST|commitExists|branchExists|getCommitMessage' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs`
4. `bash: rg -n 'Re-verify a finding against live ground truth|Assert a finding from pattern-matching alone|Verify-first' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
### Expected
Command 1: sk-doc reports 0 reality-alignment findings with no supplied claims, and sk-code reports 0 reasoning-agent findings for a `matchesStandard:false` entry that lacks `evidence` (dropped). Command 2 shows each sub-check's guard (`only contradicted claims`, `never assert without ...`, `!vf.evidence`, `!vf.citation`). Command 3 shows sk-git's live re-reads. Command 4 shows the SKILL.md ALWAYS/NEVER rule text.
### Evidence
Capture the two zero-count results, the four sub-check guards, sk-git's live-read call sites, and the SKILL.md rule text.
### Pass/Fail
PASS if every reasoning-agent sub-check is empty without evidence and drops uncited entries, and sk-git re-reads live git per finding. FAIL if any sub-check emits a finding from an uncited or unverified entry.
### Failure Triage
Any non-zero reasoning-agent count in command 1 is a direct verify-first violation and the finding. If sk-git's `check()` lacks a live re-read call, it is trusting stale discovery-time state.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `verify-first-and-known-deviations/` | Invariant category; all five adapters' verify-first gates are exercised here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs` | `checkRealityAlignment` verify-first gate |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` | `checkPatternConformance` verify-first gate |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs` | `checkAuditRubric` verify-first gate |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs` | `checkJudgmentFindings` verify-first gate |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs` | Live git re-reads inside `check()` |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Alignment invariant 1; ALWAYS-#2 / NEVER-#1 |

---

## 5. SOURCE METADATA

- Group: VERIFY-FIRST AND KNOWN DEVIATIONS
- Playbook ID: DAL-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `verify-first-and-known-deviations/verify-first-no-finding-without-reprobe.md`
- Criticality: Critical-path scenario (see root §5 hard rule).

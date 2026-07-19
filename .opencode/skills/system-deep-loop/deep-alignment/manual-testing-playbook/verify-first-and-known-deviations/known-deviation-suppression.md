---
title: "DAL-017 -- Known-deviation suppression"
description: "Verify each authority's standardSource carries a known-deviation list parsed from its own reference doc's fenced JSON block, that a match suppresses only the matching finding (never the whole artifact), and that active vs dormant entries are honestly distinguished."
version: 1.0.0.0
---

# DAL-017 -- Known-deviation suppression

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-017`.

---

## 1. OVERVIEW

This scenario validates alignment invariant 2 (known-deviation suppression) for `DAL-017`. The objective is to verify that each authority's `loadKnownDeviations()` parses the machine-readable list from its own `references/adapters/sk_*_known_deviations.md` fenced JSON block, that `suppressKnownDeviations` filters only matching findings (never the whole artifact), and that entries are honestly labeled `active` vs `dormant` — for example sk-doc's `compact-pointer-card-dqi` is active (suppresses `dqi-below-threshold` only when the validator exited 0 and docType is `readme`/`asset`) while its other entries are dormant.

### WHY THIS MATTERS

Known-deviation suppression is what keeps a real repo-wide convention (a deliberate TOC ban, a compact pointer-card shape) from being re-flagged as drift on every run. It must be per-authority, single-sourced from the reference doc (no hand-synced code copy), and surgical (one finding, not the whole artifact). This is a critical-path scenario.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify each authority loads its own list from its reference doc, a match suppresses only that finding, and dormant entries are marked as such.
- Real user request: Will this flag our deliberate repo conventions as errors every time?
- Prompt: `Validate deep-alignment known-deviation suppression: each authority loads its own list from its reference doc, a match suppresses only that finding, and dormant entries are marked as such.`
- Expected execution process: Call each adapter's `loadKnownDeviations()` and confirm it returns the parsed list from its reference doc; construct two synthetic findings (one matching an active deviation, one not) and run `suppressKnownDeviations` to confirm only the matching one is removed; read the active/dormant status labels.
- Desired user-facing outcome: The user is told each authority carries its own suppression list sourced from its reference doc, that only matching findings are suppressed (the rest of the artifact's findings stand), and that dormant entries are documented as not-currently-matching.
- Expected signals: each adapter's `loadKnownDeviations()` parses the ```json block in its `references/adapters/sk_*_known_deviations.md`; `suppressKnownDeviations` filters only matching findings; sk-doc's `compact-pointer-card-dqi` is `active` (suppresses `dqi-below-threshold` only when the validator exited 0 and docType is `readme`/`asset`) while other sk-doc entries are `dormant`; SKILL.md ALWAYS-#3 and NEVER-#2 state the rule.
- Pass/fail posture: PASS if lists load from the reference docs, suppression is surgical, and status labels are present. FAIL if suppression removes non-matching findings or the whole artifact, or a list is hard-coded in the adapter.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so list-loading is confirmed before the surgical-suppression check.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-alignment known-deviation suppression: each authority loads its own list from its reference doc, a match suppresses only that finding, and dormant entries are marked as such.
### Commands
1. `bash: node -e "for(const n of ['sk-doc','sk-git','sk-design','sk-code']){const m=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/'+n+'.cjs'); const list=m.loadKnownDeviations(); console.log(n, 'deviations='+list.length, list.map(d=>d.id+':'+(d.status||'?')).join(', '));}"`
2. `bash: node -e "const m=require('./.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs'); const rules=m.standardSource('sk-doc'); const findings=[{type:'dqi-below-threshold',subcheck:'template-conformance',artifactDocType:'readme',validatorExitCode:0},{type:'missing_required_section',subcheck:'template-conformance',artifactDocType:'readme',validatorExitCode:1}]; const kept=findings.filter(f=>!rules.knownDeviations.some(d=>(d.matchTypes||[]).includes(f.type)&&(!d.matchSubcheck||d.matchSubcheck===f.subcheck)&&(!Array.isArray(d.matchDocTypes)||d.matchDocTypes.includes(f.artifactDocType))&&(!d.requiresValidatorExitZero||f.validatorExitCode===0))); console.log('kept types:', kept.map(f=>f.type).join(', '));"`
3. `bash: rg -n 'MACHINE-READABLE|status.*active|status.*dormant|loadKnownDeviations|single source of truth' .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-known-deviations.md`
### Expected
Command 1 prints each authority's parsed deviation list with per-entry `id:status` labels (sk-doc showing `compact-pointer-card-dqi:active` and several `:dormant`). Command 2 shows the active compact-pointer-card deviation would suppress the `dqi-below-threshold` finding (validator exit 0, readme) while the `missing_required_section` P0 is KEPT — surgical, not whole-artifact. Command 3 shows the reference doc is the single source parsed at runtime.
### Evidence
Capture the four per-authority deviation lists, the surgical-suppression result (`kept types: missing_required_section`), and the single-source-of-truth statement.
### Pass/Fail
PASS if lists load from the reference docs, suppression is surgical, and status labels are present. FAIL if suppression removes a non-matching (P0) finding or the whole artifact, or a list is hard-coded in the adapter.
### Failure Triage
If command 2's `kept types` is empty (the P0 was suppressed), the surgical boundary is broken — this is the load-bearing case sk-doc's own list calls out. If a list is empty for an authority whose reference doc has a JSON block, inspect `loadKnownDeviations`'s regex.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `verify-first-and-known-deviations/` | Invariant category; each authority's suppression list is exercised here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/*.cjs` | `loadKnownDeviations` / `suppressKnownDeviations` per authority |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-known-deviations.md` | The single-source list (active/dormant labels, §8 machine block) |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-git-known-deviations.md` | sk-git's per-authority list |
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Alignment invariant 2; ALWAYS-#3 / NEVER-#2 |

---

## 5. SOURCE METADATA

- Group: VERIFY-FIRST AND KNOWN DEVIATIONS
- Playbook ID: DAL-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `verify-first-and-known-deviations/known-deviation-suppression.md`
- Criticality: Critical-path scenario (see root §5 hard rule).

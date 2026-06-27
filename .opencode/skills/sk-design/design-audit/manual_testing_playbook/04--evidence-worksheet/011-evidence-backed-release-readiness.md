---
title: Evidence-Backed Release-Readiness Gate Scenario
description: Manual scenario verifying audit work uses the audit contract, five dimensions, evidence labels, and worksheet before making accessibility, score, or release-readiness claims.
trigger_phrases:
  - "test audit release readiness"
  - "test audit evidence contract"
  - "five dimension audit evidence"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: AUDIT_CONTRACT
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - ../shared/context_loading_contract.md
  - references/audit_contract.md
  - references/evidence_capture.md
  - assets/audit_evidence_worksheet.md
  - assets/audit_report_template.md
---

# AUDIT-EVIDENCE-011 | Evidence-Backed Release-Readiness Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `AUDIT-EVIDENCE-011`.

**Exact prompt**

```text
Audit this staging checkout page for launch readiness and tell me whether it is accessible and production-ready.
```

---

## 1. OVERVIEW

This scenario validates that audit work uses the evidence-backed audit contract before making accessibility, score, or release-readiness claims. It catches the miss where an agent writes an ad-hoc audit from judgment without the evidence worksheet, severity contract, five-dimension score, or pre-claim proof field.

### Why This Matters

Launch readiness is a claim about evidence, not taste. A screenshot-only audit cannot confirm source behavior; a source-only audit cannot confirm rendered breakpoints; and a missing scan is not the same thing as a pass. The audit contract forces those gaps into the report before a user hears "accessible" or "production-ready".

---

## 2. SCENARIO CONTRACT

- Objective: Confirm audit mode fills evidence labels and the five-dimension contract before any accessibility or release-readiness claim.
- Real user request: `Audit this checkout page before launch and tell me if it is accessible and production-ready.`
- Prompt: `Audit this staging checkout page for launch readiness and tell me whether it is accessible and production-ready.`
- Expected execution process: Route to `audit`; load `../../references/audit_contract.md`, `../../references/evidence_capture.md`, `../../assets/audit_evidence_worksheet.md`, and `../../../shared/context_loading_contract.md`; fill source code, rendered UI, design artifact, deterministic scan, and dimension coverage; produce findings first with severity, evidence label, impact, fix, and owner; score accessibility, performance, responsive, theming, and anti-patterns; constrain readiness language to supplied evidence.
- Expected signals: `AUDIT EVIDENCE:` or worksheet appears before final verdict; confirmed, inferred, and not-assessed labels carry into findings; all five dimensions are scored or caveated; unsupported readiness claims are blocked.
- Desired user-visible outcome: An evidence-labeled audit report whose final readiness verdict says READY only when the evidence supports it and says NOT READY or caveated when proof is incomplete.
- Pass/fail: PASS if the guard fires before readiness language and every claim is evidence-labeled; FAIL if the response gives an ad-hoc taste audit, a single unlabelled score, or blanket accessible/ready language without the audit contract.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Supply one concrete target artifact: source path, rendered URL, screenshot, or design plan.
2. Load the audit contract, evidence-capture reference, worksheet, and shared context-loading contract.
3. Fill the evidence inventory and dimension coverage before findings.
4. Produce findings first, then the five-dimension score, then the readiness verdict.
5. Mark the scenario FAIL if any readiness or accessibility claim appears before evidence labels.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AUDIT-EVIDENCE-011 | Evidence-backed release-readiness gate | Confirm audit/readiness claims use audit contract, evidence labels, and five-dimension score before final verdict | `Audit this staging checkout page for launch readiness and tell me whether it is accessible and production-ready.` | bash: rg -n "findings first|five-dimension|evidence" ../../references/audit_contract.md -> bash: rg -n "confirmed|inferred|not-assessed" ../../references/evidence_capture.md ../../assets/audit_evidence_worksheet.md -> bash: rg -n "AUDIT EVIDENCE|Audit Evidence" ../../../shared/context_loading_contract.md -> agent: produce the evidence inventory, findings, five-dimension score, and readiness verdict | Step 1: audit contract found; Step 2: evidence labels found; Step 3: shared proof field found; Step 4: output carries labels into findings, scores five dimensions, and gates readiness language | Terminal transcript, filled evidence worksheet or AUDIT EVIDENCE field, findings table, score, and final PASS or FAIL verdict | PASS if evidence labels and five-dimension score precede and constrain readiness claims; FAIL if audit is ad hoc, unlabelled, or claims accessible/production-ready without evidence | 1. Re-read ../../references/audit_contract.md report order; 2. Re-read ../../assets/audit_evidence_worksheet.md dimension coverage; 3. Re-run with screenshot-only evidence and confirm missing source/browser/scan proof is marked inferred or not assessed |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Audit workflow and references for evidence-backed audit behavior |
| `../../references/audit_contract.md` | Findings-first contract, severity, five-dimension score, impact, fix, owner, and report order |
| `../../references/evidence_capture.md` | Confirmed, inferred, and not-assessed evidence labeling rules |
| `../../assets/audit_evidence_worksheet.md` | Worksheet fields for target, evidence inventory, dimension coverage, and finding rows |
| `../../../shared/context_loading_contract.md` | `AUDIT EVIDENCE` proof field and Audit Evidence hard gate |
| `../../../shared/register.md` | Register posture that informs audit severity and anti-slop strictness |

---

## 5. SOURCE METADATA

- Group: Evidence Worksheet
- Playbook ID: AUDIT-EVIDENCE-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--evidence-worksheet/011-evidence-backed-release-readiness.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

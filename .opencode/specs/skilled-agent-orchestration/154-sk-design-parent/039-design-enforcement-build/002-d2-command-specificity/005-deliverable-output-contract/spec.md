---
title: "D2-R5 — Deliverable shape unspecified — only STATUS=OK/FAIL"
description: "Add outputContract{primaryArtifactName,artifactKind,requiredFields,fileOutputs} to command-metadata.json and generate an Emit Deliverable section, banning generic artifact names."
trigger_phrases:
  - "d2-r5 output contract"
  - "output contract design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R5 — Deliverable shape unspecified — only STATUS=OK/FAIL

## 1. OBJECTIVE
Specify the concrete deliverable each `/design:*` command must emit beyond a bare status tail.

## 2. WHY
Wrappers declare only a `STATUS=OK|FAIL` tail, leaving the deliverable's name, kind, fields, and file outputs undefined.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `outputContract{primaryArtifactName,artifactKind,requiredFields,fileOutputs}` per command.
- Generate an `Emit Deliverable` section describing the artifact and required fields.
- Ban generic artifact names (e.g. "output", "result") via the checker.

## 5. ACCEPTANCE
- Checker fails when `outputContract` is missing or `primaryArtifactName` is generic; passes when each command names a specific deliverable.

## 6. EVIDENCE
- `commands/design/audit.md:26` — wrapper specifies only STATUS=OK/FAIL, no deliverable shape.
- Source: `research/research.md` §5 (D2-R5)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.

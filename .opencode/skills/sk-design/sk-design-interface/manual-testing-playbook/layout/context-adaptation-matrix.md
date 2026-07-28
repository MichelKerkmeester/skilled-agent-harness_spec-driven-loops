---
title: Context Adaptation Matrix Scenario
description: Manual scenario verifying per-context rethinking across device, input and posture rather than pixel scaling.
trigger_phrases:
  - "test adaptation matrix"
  - "test device context adaptation"
  - "foundations adaptation scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: ADAPTATION
expected_resources:
  - references/foundations/corpus-map.md
  - ../shared/register.md
  - references/foundations/layout/adaptation-matrix.md
---

# FOUND-LAYOUT-002 | Context Adaptation Matrix

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-LAYOUT-002`.

**Exact prompt**

```text
Adapt a desktop admin tool for phone, tablet and a print export without dropping any core control.
```

---

## 1. OVERVIEW

This scenario validates per-context rethinking across device, input, and posture in `interface`'s `foundations` static-system subworkflow. It confirms each target context is treated as a rethink of layout, interaction, content, and navigation rather than a scaled-down desktop design.

### Why This Matters

"Responsive" collapses into pixel scaling when input capability is inferred from screen width and print is treated as an afterthought. Reading the four adaptation dimensions first is what keeps every core function reachable on phone, tablet, desktop, and paper.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a multi-context adaptation request resolves in the foundations subworkflow with per-context rethinking, capability-based input branching, and a genuine print/export view.
- Real user request: `We need our desktop admin tool to work on phone and tablet, and to print properly. Nothing important can disappear.`
- Prompt: `Adapt a desktop admin tool for phone, tablet and a print export without dropping any core control.`
- Expected execution process: Recognize this as `interface`'s `foundations` static-system subworkflow, where context adaptation resolves before any `sk-code` implementation handoff; load `../../references/foundations/layout/adaptation-matrix.md`; read the four adaptation dimensions before deciding what changes — device and viewport, input method, connection and capability, usage posture; rethink layout, interaction, content, and navigation per target context instead of scaling the desktop design down; branch on input capability with feature queries, not on width alone.
- Expected signals: The four adaptation dimensions are named before any change is proposed; each context gets a rethink across all four surfaces; input branching uses feature queries; the print/export view removes interaction, expands hidden content, and adds page context; every core function survives each context.
- Desired user-visible outcome: An adaptation matrix where phone, tablet, desktop, and print each get a deliberate treatment and no core control is dropped.
- Pass/fail: PASS if each context is rethought across layout, interaction, content, and navigation with capability-based input detection and a real print view; FAIL if adaptation is width-only scaling, functionality sits behind hover alone, a core function is dropped in any context, or the spacing scale and container-query mechanics are re-derived here instead of deferred.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Recognize this as `interface`'s `foundations` static-system subworkflow. Context adaptation resolves here before any `sk-code` implementation handoff.
2. Load `references/foundations/layout/adaptation-matrix.md`.
3. Read the four adaptation dimensions before deciding what changes, device and viewport, input method, connection and capability, usage posture.
4. Rethink layout, interaction, content and navigation per target context instead of scaling the desktop design down.
5. Branch on input capability with feature queries, not on width alone.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-LAYOUT-002 | Context adaptation matrix across device, input and posture | Confirm each target context is rethought rather than scaled, with capability-based input branching and a real print view | `Adapt a desktop admin tool for phone, tablet and a print export without dropping any core control.` | bash: rg -n "adaptation" ../../references/foundations/layout/adaptation-matrix.md -> bash: rg -n "register" ../../../shared/register.md -> agent: produce the context adaptation matrix | Step 1: the four adaptation dimensions found; Step 2: register posture found; Step 3: output rethinks each context across layout, interaction, content, and navigation and keeps every core function | Terminal transcript, the produced adaptation matrix, the per-context treatment, the print view, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically width-only branching, hover-only functionality, or a dropped core control | 1. Re-read `../../references/foundations/layout/adaptation-matrix.md` for the four dimensions; 2. Confirm input branching uses feature queries rather than width; 3. Re-run listing every core function and confirm it survives phone, tablet, desktop, and print |

### Pass Criteria

- Treats each context as a rethink across layout, interaction, content and navigation, not a shrink.
- Detects input capability rather than inferring it from screen width.
- Keeps every core function available on phone, tablet, desktop and print.
- Never puts functionality behind hover alone and accounts for safe areas.
- Produces a print or export view that removes interaction, expands hidden content and adds page context.
- Uses content-driven breakpoints and serves responsive image weights.
- Defers the spacing scale and container-query mechanics to `layout-responsive.md` rather than re-deriving them.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and foundations resource map |
| `../../references/foundations/corpus-map.md` | Foundations corpus entry point |
| `../../references/foundations/layout/adaptation-matrix.md` | The four adaptation dimensions and per-context rethink rules |
| `../../references/foundations/layout/layout-responsive.md` | Spacing scale and container-query mechanics deferred to from this scenario |
| `../../../shared/register.md` | Register posture that sets density and adaptation restraint |

---

## 5. SOURCE METADATA

- Group: Layout
- Playbook ID: FOUND-LAYOUT-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `layout/context-adaptation-matrix.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

---
title: Layout Rhythm And Responsive Scenario
description: Manual scenario verifying spacing scale, hierarchy, grid choice, responsive adaptation, and input-context decisions.
trigger_phrases:
  - "test layout rhythm"
  - "test responsive adaptation"
  - "foundations layout scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: LAYOUT
expected_resources:
  - references/foundations/corpus-map.md
  - ../shared/register.md
  - references/foundations/layout/layout-responsive.md
---

# FOUND-LAYOUT-001 | Layout Rhythm And Responsive

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-LAYOUT-001`.

**Exact prompt**

```text
Fix the layout system for a desktop dashboard that becomes a mobile task flow without hiding core controls.
```

---

## 1. OVERVIEW

This scenario validates spacing scale, hierarchy, grid choice, and responsive adaptation in `interface`'s `foundations` static-system subworkflow. It confirms the grid contract is defined before placement and that mobile keeps core functionality rather than hiding it.

### Why This Matters

Layout systems fail quietly when spacing is typed one value at a time, when containers and cards are reached for before proximity and alignment, and when "responsive" means scaling widths down until controls disappear. Defining the grid contract and spacing scale first is what makes the mobile pass a rethink instead of a truncation.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a desktop-to-mobile layout request resolves in the foundations subworkflow with a spacing scale, an explicit grid contract, containment restraint, and core functionality preserved on mobile.
- Real user request: `Our desktop dashboard turns into a mess on mobile. Fix the layout system, but don't hide any of the core controls.`
- Prompt: `Fix the layout system for a desktop dashboard that becomes a mobile task flow without hiding core controls.`
- Expected execution process: Recognize this as `interface`'s `foundations` static-system subworkflow, where layout, spacing, and grid system decisions resolve before any `sk-code` implementation handoff; load `../../references/foundations/layout/layout-responsive.md`; define spacing scale, grouping, hierarchy, and grid behavior; adapt the experience for touch and mobile context instead of only scaling widths; use an intrinsic grid recipe before media queries for simple card, gallery, tile, or metric grids.
- Expected signals: A spacing scale and proximity are applied before containers; grid versus flex is chosen by structural need; the grid contract names columns, gutters, page margins, and region ownership per breakpoint; `repeat(auto-fit, minmax(280px, 1fr))` appears before breakpoint-specific media queries for simple tile grids; core controls remain reachable on mobile.
- Desired user-visible outcome: A layout system with a coherent rhythm that adapts to mobile as a rethought task flow with every core control still available.
- Pass/fail: PASS if the spacing scale, grid contract, containment restraint, and mobile core-function preservation are all explicit; FAIL if spacing is ad hoc, containers are added before proximity and alignment are tried, breakpoints are width-only, or a core control is dropped on mobile.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Recognize this as `interface`'s `foundations` static-system subworkflow; layout, spacing, and grid system decisions resolve here before any `sk-code` implementation handoff.
2. Load `references/foundations/layout/layout-responsive.md`.
3. Define spacing scale, grouping, hierarchy, and grid behavior.
4. Adapt the experience for touch and mobile context instead of only scaling widths.
5. Use an intrinsic grid recipe before media queries for simple card, gallery, tile, or metric grids.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-LAYOUT-001 | Layout rhythm and responsive adaptation | Confirm the spacing scale and grid contract are defined before placement and mobile keeps every core control | `Fix the layout system for a desktop dashboard that becomes a mobile task flow without hiding core controls.` | bash: rg -n "spacing scale" ../../references/foundations/layout/layout-responsive.md -> bash: rg -n "register" ../../../shared/register.md -> agent: produce the layout system plan | Step 1: spacing scale and grid contract rules found; Step 2: register posture and density found; Step 3: output defines the scale and grid contract before placement and preserves core mobile controls | Terminal transcript, the produced layout plan, the grid contract per breakpoint, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically ad-hoc spacing, container-first grouping, or a core control hidden on mobile | 1. Re-read `../../references/foundations/layout/layout-responsive.md` for the spacing scale and grid contract rules; 2. Confirm the intrinsic grid recipe was tried before media queries; 3. Re-run listing every core control and confirm each remains reachable on phone |

### Pass Criteria

- Uses a spacing scale and proximity before adding containers.
- Chooses grid/flex by structural need.
- Defines the grid contract before placement, including columns, gutters, page margins, and region ownership for phone, tablet, and desktop breakpoints.
- For simple equal-width tile grids, reaches first for `repeat(auto-fit, minmax(280px, 1fr))` before breakpoint-specific media queries.
- Names comfortable and compact density behavior from the same spacing scale while preserving touch targets, focus rings, and readable row height.
- Applies containment restraint: borders, fills, elevation, and cards are used only when proximity, alignment, headings, or dividers are insufficient.
- Keeps core functionality available on mobile.
- Includes touch target, safe-area, orientation, and content-driven breakpoint notes.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and foundations resource map |
| `../../references/foundations/corpus-map.md` | Foundations corpus entry point |
| `../../references/foundations/layout/layout-responsive.md` | Spacing scale, grid contract, and responsive adaptation rules |
| `../../../shared/register.md` | Register posture that sets density and containment restraint |

---

## 5. SOURCE METADATA

- Group: Layout
- Playbook ID: FOUND-LAYOUT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `layout/layout-rhythm-responsive.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

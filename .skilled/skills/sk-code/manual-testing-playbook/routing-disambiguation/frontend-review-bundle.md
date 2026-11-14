---
title: "RD-004: A UI Review Bundles the Frontend Surface"
description: "Verify a review request about a UI component returns the review mode first and the frontend surface second, so the reviewer reads the frontend standards as evidence."
version: 1.0.0.0
---

# RD-004: A UI Review Bundles the Frontend Surface

## 1. OVERVIEW

This scenario verifies that a review request about a UI component returns the review mode first and the frontend surface second, so the reviewer reads the frontend standards as evidence. A developer who asks for a component review with accessibility named is asking two things at once, and the route has to carry both.

The risk this scenario guards against: the review keyword alone outscored every frontend phrase, so a UI review loaded no frontend reference. The reviewer then judged the component against general code standards and never saw the frontend rules that apply.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A developer asks for a review of a component and names accessibility.

**Exact prompt**:
```
review my react component for accessibility issues
```

Prompt: `review my react component for accessibility issues`

**What the route must return**:
- Two targets in one route object, not one target and not two separate routes.
- `sk-code-review` first, because the action the user asked for is a review.
- `sk-code-frontend` second, because the artifact under review is a frontend component.

**Expected behavior if the review mode wins alone**: This is a misroute. The remediation is an edit to the frontend vocabulary in `hub-router.json`, and it is described in the Failure Triage section below.

---

## 3. TEST EXECUTION

### Preconditions

1. `node` is callable.
2. `node .skilled/bin/compiled-route-guard.cjs --json` reports the sk-code hub as fresh.

### Exact Command Sequence

1. **Route probe**:
   ```
   node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review my react component for accessibility issues" > /tmp/skc-RD004-route.txt
   ```
2. **Parse the target order**:
   ```
   grep -o '"workflowMode":"[a-z-]*"' /tmp/skc-RD004-route.txt
   ```

### Expected Signals

Expected signals: the route object carries `"selectionKind":"surfaceBundle"`, and the parse command prints `"workflowMode":"sk-code-review"` on its first line and `"workflowMode":"sk-code-frontend"` on its second line.

### Pass/Fail Criteria

- **PASS** iff: the route holds exactly those two targets in that order.
- **FAIL** iff: `sk-code-frontend` is missing, or it is the only target, or it comes first.

Evidence: `/tmp/skc-RD004-route.txt` (the full route object, with `selectionKind` and the ordered target list).

### Failure Triage

1. The router bundles two modes only when their scores tie, and each distinct matched phrase scores once.
2. If `sk-code-frontend` is missing, no frontend phrase matched, so add one review-oriented phrase to the code-frontend-review class in `hub-router.json`.
3. If `sk-code-frontend` is the only target, two frontend phrases matched the prompt and outscored the review mode, so remove the broader of the two.
4. Never edit the prompt to make it pass.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md`
- `.skilled/skills/sk-code/hub-router.json` (the frontend vocabulary classes)
- `.skilled/skills/sk-code/mode-registry.json` (the FRONTEND detection block)
- `.skilled/bin/compiled-route.cjs`

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that states how the hub bundles a surface packet beside a workflow mode.

---

## 5. SOURCE METADATA

- Group: Routing Disambiguation
- Playbook ID: RD-004
- **Created**: 2026-11-14
- **Critical path**: No
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run

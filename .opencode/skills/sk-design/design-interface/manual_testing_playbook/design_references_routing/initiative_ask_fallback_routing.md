---
title: "ID-010 -- Design-references initiative/ask routing for Mobbin and Refero"
description: "This scenario validates the hybrid initiative/ask routing for `ID-010`. It focuses on confirming the skill pulls ONE real-world reference on its own initiative when a convention-heavy category benefits and a subscription is connected, asks the user when borderline or the subscription is unknown, falls back to the generic process when not connected or declined, picks Mobbin for app/iOS and Refero for web/styles, and never surfaces a chooser or copies a reference."
version: 1.5.0.1
id: ID-010
expected_intent: DESIGN_PRINCIPLES
expected_resources:
  - references/design_process/design_principles.md
  - ../shared/register.md
---

# ID-010 -- Design-references initiative/ask routing for Mobbin and Refero

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-010`.

**Exact prompt**

```
Design the checkout flow for our new payments app; ground it against the real-world default for this kind of screen, then deviate deliberately.
```

---

## 1. OVERVIEW

This scenario validates the hybrid initiative/ask routing for `ID-010`. It focuses on confirming the skill pulls ONE real-world reference on its own initiative when a convention-heavy category benefits and a subscription is connected, asks the user when borderline or the subscription is unknown, falls back to the generic process when not connected or declined, picks Mobbin for app/iOS and Refero for web/styles, and never surfaces a chooser or copies a reference.

### Why This Matters

ID-010 protects the newest and most easily-misused grounding path: real-world shipped UI read live via the Mobbin and Refero MCPs. The capability is valuable precisely because it names the real-world default for a crowded category so a deliberate move off it reads as a choice, but it carries three failure modes that quietly turn the skill into the trend-copier it resists. Pulling a paid reference unprompted in a borderline or unknown-subscription case is surprising and wrong, so the ask path is load-bearing. Blocking the work when no subscription is connected is wrong, so the fall-back to the generic anti-default process must be clean and never blocking. And surfacing a gallery of references to scroll, copying a competitor's screen into the design or the repo, or letting a reference become the design decision is exactly the templated-default behavior the skill exists to avoid, so the negative control is as important as the positive paths. The initiative path must also pick the right source by surface: Mobbin for native and iOS app screens and flows, Refero for web pages and visual styles.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the skill takes the initiative to pull ONE real-world reference when a convention-heavy category benefits and a subscription is connected, asks the user when borderline or the subscription is unknown, falls back to the generic anti-default process when not connected or declined, picks Mobbin for app/iOS and Refero for web/styles, and never surfaces a chooser, copies a reference, or lets grounding move downstream.
- Real user request: `Design the checkout flow for our new payments app; make it feel considered rather than the usual generic checkout.`
- Prompt: `Design the checkout flow for our new payments app; ground it against the real-world default for this kind of screen, then deviate deliberately.`
- Expected execution process: Ground the subject first (STEP 0-1), then at the critique step (STEP 2) judge whether a real-world reference helps. Checkout is a convention-heavy category, so the reference helps. Route the initiative/ask/fall-back gate from `references/design_grounding/design_references_mcp.md` Section 3: take the initiative to resolve ONE reference when a Mobbin/Refero subscription is connected, naming the default in one line and citing its URL; ask the user first when borderline or the subscription status is unknown; fall back to the generic anti-default process in `design_principles.md` when no subscription is connected or the user declines. Pick the source by surface: Mobbin for the native/iOS checkout screens and flows, Refero for a web checkout page or visual-style direction (styles first). Confirm no chooser menu is surfaced, no reference is copied or cached, the reference informs the deviation rather than becoming it, and grounding stays upstream.
- Expected signals: Step 1: convention-heavy category is recognized and the initiative path pulls ONE reference, names the real-world default in one line, and cites the `mobbin_url` or Refero URL when a subscription is connected; Step 2: the ask path is taken instead when the case is borderline or the subscription status is unknown, asking the user before any paid lookup; Step 3: the fall-back path governs cleanly and never blocks when no subscription is connected or the user declines; Step 4: the source pick is Mobbin for app/iOS and Refero for web/styles; Step 5: the negative control holds, with no chooser or gallery, no copied or cached reference, the reference read live and kept as input to judgment, and grounding kept upstream
- Desired user-visible outcome: a single named real-world default with its cited URL when the initiative path runs, an explicit one-line ask before any paid lookup when the case is borderline or unknown, a clean non-blocking fall-back to the generic process when not connected or declined, the correct Mobbin-vs-Refero source pick for the surface, and confirmation that no chooser is offered, nothing is copied, and grounding stays upstream.
- Pass/fail: PASS if the initiative path pulls exactly one reference and cites its URL when connected, the ask path asks first when borderline or unknown, the fall-back is clean and non-blocking, the source pick matches the surface, and no chooser or cached copy appears, all per `references/design_grounding/design_references_mcp.md`; FAIL if a paid lookup runs unprompted in a borderline or unknown case, the fall-back blocks the work, a menu or gallery of references is surfaced, any reference is copied or cached into the design or the skill, the reference becomes the design decision, or grounding is skipped

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain ground-against-the-real-world-default language.
2. Confirm checkout resolves to one convention-heavy category so the reference is worth pulling.
3. Execute the deterministic steps exactly as written, covering the initiative, ask, and fall-back branches, the source pick, and the negative control.
4. Compare the produced output against `references/design_grounding/design_references_mcp.md` Section 3 and Section 4 hard rules.
5. Return a concise final verdict that flags any unprompted paid lookup, blocking fall-back, chooser menu, or cached copy when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-010 | Design-references initiative/ask routing for Mobbin and Refero | Confirm the skill takes the initiative to pull ONE real-world reference when a convention-heavy category benefits and a subscription is connected, asks the user when borderline or the subscription is unknown, falls back to the generic anti-default process when not connected or declined, picks Mobbin for app/iOS and Refero for web/styles, and never surfaces a chooser, copies a reference, or lets grounding move downstream. | `Design the checkout flow for our new payments app; ground it against the real-world default for this kind of screen, then deviate deliberately.` | bash: rg -n "Deciding whether to consult" references/design_grounding/design_references_mcp.md -> agent: ground the subject, then at the critique step take the initiative to resolve ONE reference and cite its URL when a subscription is connected -> agent: instead ask the user first when borderline or the subscription is unknown, and fall back to the generic anti-default process when not connected or declined -> agent: pick Mobbin for app/iOS and Refero for web/styles, and confirm no chooser, no cached copy, reference read live, and grounding kept upstream | Step 1: convention-heavy category is recognized and the initiative path pulls ONE reference, names the real-world default in one line, and cites the mobbin_url or Refero URL when a subscription is connected; Step 2: the ask path is taken instead when the case is borderline or the subscription status is unknown, asking the user before any paid lookup; Step 3: the fall-back path governs cleanly and never blocks when no subscription is connected or the user declines; Step 4: the source pick is Mobbin for app/iOS and Refero for web/styles; Step 5: the negative control holds, with no chooser or gallery, no copied or cached reference, the reference read live and kept as input to judgment, and grounding kept upstream | Routing transcript, the named real-world default with its cited URL, the ask wording when borderline, the fall-back decision when not connected, the Mobbin-vs-Refero source pick, and confirmation of no menu and no cached files | PASS if the initiative path pulls exactly one reference and cites its URL when connected, the ask path asks first when borderline or unknown, the fall-back is clean and non-blocking, the source pick matches the surface, and no chooser or cached copy appears, all per references/design_grounding/design_references_mcp.md; FAIL if a paid lookup runs unprompted in a borderline or unknown case, the fall-back blocks the work, a menu or gallery of references is surfaced, any reference is copied or cached, the reference becomes the design decision, or grounding is skipped | 1. Re-read references/design_grounding/design_references_mcp.md Section 3 on the initiative/ask/fall-back gate and Section 4 on the no-chooser, read-live, never-copied hard rules; 2. Confirm exactly one reference was resolved from the subject and the source pick matches the surface; 3. Confirm a paid lookup ran only on the initiative path with a connected subscription, the ask path asked first when borderline, and the fall-back never blocked |

### Optional Supplemental Checks

If the primary run passes, repeat the routing for a web product page (Refero, styles first) and for a borderline novel brief that should trigger the ask path, confirming the source pick flips by surface and the initiative-vs-ask decision flips by category strength and subscription status. Confirm each run still resolves exactly one reference rather than a menu. This scenario records SKIP with the missing dependency if neither the Mobbin nor the Refero MCP resolves through Code Mode; the fall-back branch is still exercisable in that case and the absence of a paid lookup is then expected rather than a failure. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../references/design_grounding/design_references_mcp.md` | Section 3 owns the initiative/ask/fall-back decision gate and the Mobbin-vs-Refero source pick; Section 4 owns the no-chooser, read-live, never-copied hard rules |
| `../../references/mcp_tooling/mobbin_tools.md` | Mobbin MCP tool catalog (search_screens, search_flows): arguments, the Code Mode call convention, result shape, and the citable mobbin_url |
| `../../references/mcp_tooling/refero_tools.md` | Refero MCP tool catalog (8 tools across styles, screens, flows): the styles-first model, the Code Mode call convention, and result shape |
| `../../SKILL.md` | Section 2 (the INITIATIVE / ASK resource row) and the Section 4 ALWAYS rule 7 requiring initiative-or-ask, one reference, read live, never a chooser, never copied |

---

## 5. SOURCE METADATA

- Group: Design-References Routing
- Playbook ID: ID-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `design-references-routing/initiative-ask-fallback-routing.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

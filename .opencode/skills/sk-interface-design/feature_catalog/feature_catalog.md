---
title: "sk-interface-design: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the sk-interface-design interface design system."
trigger_phrases:
  - "sk-interface-design"
  - "interface design feature catalog"
  - "feature catalog"
last_updated: "2026-06-14"
---

# sk-interface-design: Feature Catalog

This document combines the current feature inventory for the `sk-interface-design` system into a single reference. The root catalog acts as the system-level directory: it summarizes the design process, the objective quality floor, design grounding in a real design system, interface writing, the integration boundary, and the real-UI loop, and it points to the per-feature files that carry the deeper behavior and source anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `sk-interface-design` feature surface. The numbered sections below group the skill by capability area so readers can move from a top-level summary into per-feature reference files without losing the design intent behind each step. This skill owns the look of an interface: it drives deliberate palette, typography, layout, motion, and copy choices, holds those choices to an objective quality floor, and hands implementation to `sk-code`.

| Category | Coverage | Primary Surfaces |
|---|---:|---|
| Design process | 4 features | `SKILL.md`, `references/design-process/design_principles.md` |
| Quality floor | 1 feature | `references/design-process/ux_quality_reference.md` |
| Design grounding | 2 features | `references/design-grounding/design_inventory.md`, `references/design-grounding/design_references_mcp.md`, `references/design-process/real_ui_loop.md` |
| Interface writing | 1 feature | `references/design-process/design_principles.md` (Section 6) |
| Integration boundary | 1 feature | `SKILL.md` (Sections 2 and 7) |
| Real-UI loop | 3 features | `references/design-process/real_ui_loop.md`, `SKILL.md` (Sections 2 and 5) |

---

## 2. DESIGN PROCESS

These entries cover the core of the skill: a two-pass loop that grounds the work in its subject, brainstorms a compact token system, critiques that plan against the current AI-default looks, builds from the revised plan, and then self-critiques the result.

### Ground the subject

#### Description

Pins the concrete subject, audience, and the page's single job before any visual choice is made.

#### Current Reality

The process opens by naming one concrete subject, its audience, and the page's one job. When the brief does not pin this down, the skill pins it and states the assumption. Distinctive choices are then drawn from the subject's own world, materials, and vernacular rather than from a generic template.

#### Source Files

See [`01--design-process/ground-the-subject.md`](01--design-process/ground-the-subject.md) for full implementation and validation file listings.

---

### Brainstorm a token system

#### Description

Produces a compact color, type, layout, and signature plan before code is written.

#### Current Reality

The first pass brainstorms a short design plan as a token system: a 4 to 6 value named palette, typefaces for two or more roles, a layout concept expressed in one-sentence prose plus ASCII wireframes, and a single signature element the page will be remembered by. Most of this iteration happens in thinking, and only higher-confidence ideas are shown to the user.

#### Source Files

See [`01--design-process/brainstorm-token-system.md`](01--design-process/brainstorm-token-system.md) for full implementation and validation file listings.

---

### Critique against AI-default looks

#### Description

Reviews the plan against the three current AI-default looks and revises anything generic with a stated reason.

#### Current Reality

Before building, the plan is checked against the brief and the known default clusters: cream plus serif plus terracotta, near-black with one acid accent, and broadsheet hairline rules. Any part that reads like the generic default for a similar prompt is revised, with the change and its reason stated. On a free axis the skill spends its boldness deliberately rather than landing on a default. When the brief pins the direction, the brief wins.

#### Source Files

See [`01--design-process/critique-against-defaults.md`](01--design-process/critique-against-defaults.md) for full implementation and validation file listings.

---

### Build and self-critique

#### Description

Builds from the revised plan, then self-critiques against restraint and the quality floor.

#### Current Reality

The build derives every color and type decision from the revised plan and minds CSS selector specificity so classes do not cancel each other out. The self-critique spends boldness in one signature element, keeps everything else quiet, removes one accessory, takes a screenshot when the environment allows, and confirms the quality floor holds.

#### Source Files

See [`01--design-process/build-and-self-critique.md`](01--design-process/build-and-self-critique.md) for full implementation and validation file listings.

---

## 3. QUALITY FLOOR

This entry covers the objective pass or fail gate applied after the aesthetic direction is set.

### Objective quality floor

#### Description

The objective floor of accessibility, motion, touch, responsive, forms, and chart rules that every interface must clear.

#### Current Reality

The quality floor is applied after the direction is set, as a pass or fail gate where a rule beats an aesthetic choice on collision. It covers WCAG AA contrast, never encoding meaning in color alone, accessible names, full keyboard operability with visible focus, real form labels, honoring reduced motion, touch targets of at least 44 by 44 pixels, responsive behavior from mobile up, and chart accessibility with non-color differentiation and a data fallback.

#### Source Files

See [`02--quality-floor/objective-quality-floor.md`](02--quality-floor/objective-quality-floor.md) for full implementation and validation file listings.

---

## 4. DESIGN GROUNDING

These entries cover how the skill grounds in concrete, fully-realized looks: a real design system you own, read live as either reuse-ground or the named default to deviate from, and real-world shipped UI read live via the Mobbin and Refero MCPs as the named real-world default to deviate from. In both cases exactly one reference is resolved from the subject, never a chooser, and nothing is cached into the skill.

### Design-system grounding

#### Description

Uses a real design system you own, read live and never copied, as either reuse-ground or the named default to deviate from.

#### Current Reality

When you have access to a real design system, the skill reads one matching system live: its direction, its paste-ready tokens, and its reusable component markup. The system serves one of two anti-default-safe roles, chosen by the brief. As reuse-ground it is reused before authoring net-new, and as critique-against it is the closest realized example of the generic default that a deliberate move pushes against. Exactly one system is resolved from the subject, never a list surfaced as a chooser, the read is live and never cached into the skill, and `design_principles.md` remains the authority. The grounding is optional, and when no real system fits the free-axis anti-default process governs as before.

#### Source Files

See [`03--design-grounding/design-system-grounding.md`](03--design-grounding/design-system-grounding.md) for full implementation and validation file listings.

---

### Design-references grounding

#### Description

Reads real-world shipped UI live via the Mobbin and Refero MCPs as the named real-world default to deviate from, deciding on its own initiative or by asking the user.

#### Current Reality

At the critique step the skill judges whether a real-world reference would sharpen the default to deviate from, then routes a hybrid initiative/ask decision. It takes the initiative to pull ONE reference when the brief sits in a convention-heavy category (checkout, onboarding, settings, dashboards, feeds, pricing, data tables, scheduling, messaging, search) AND a Mobbin/Refero subscription is connected, naming the default in one line and citing its URL; it asks the user first when the case is borderline or the subscription status is unknown; and it falls back to the generic anti-default process when no subscription is connected or the user declines, which is never blocking. Mobbin sources native and iOS app screens and flows, Refero sources web pages and visual styles with styles searched first. Exactly one reference is resolved from the subject, never a list surfaced as a chooser, the read is live and never cached or copied into the skill, the reference is input to judgment rather than the design decision, grounding stays upstream, and a pinned brief always wins.

#### Source Files

See [`03--design-grounding/design-references-grounding.md`](03--design-grounding/design-references-grounding.md) for full implementation and validation file listings.

---

## 5. INTERFACE WRITING

This entry covers copy treated as design material rather than decoration.

### Interface writing as design material

#### Description

Treats interface copy as design material, with active voice, end-user vocabulary, and consistent action names across a flow.

#### Current Reality

Copy is treated as design material that exists to make an interface easier to understand and use. The guidance writes from the end user's side of the screen, names things by what people control, uses active voice where a control says exactly what happens, keeps an action's name consistent through a whole flow, and turns errors and empty states into direction rather than mood.

#### Source Files

See [`04--interface-writing/interface-writing.md`](04--interface-writing/interface-writing.md) for full implementation and validation file listings.

---

## 6. INTEGRATION BOUNDARY

This entry covers where the skill's responsibility ends and other skills take over.

### Design and implementation boundary

#### Description

The boundary where this skill decides the look and hands implementation and verification to `sk-code` and the screenshot tooling.

#### Current Reality

This skill owns the look and stops at the design decision. Implementation belongs to `sk-code`, which builds the direction to the detected web surface's standards and verifies it, and `sk-code-review` can audit the built UI against those standards. The screenshot step in the self-critique uses a real-browser tool. The skill itself does not write or run application code. When the work runs from a plan into a real render, the real-UI loop in Section 7 governs how this skill's judgment reaches a verified, handed-off result.

#### Source Files

See [`05--integration-boundary/design-and-implementation-boundary.md`](05--integration-boundary/design-and-implementation-boundary.md) for full implementation and validation file listings.

---

## 7. REAL-UI LOOP

These entries cover the shared protocol that moves this skill's judgment from a plan to a verified, handed-off render without becoming a templated generator. The protocol is a loop, not a product: ground, reuse before generate, render, check the real render, revise, then hand off. This skill owns the judgment and stays transport-agnostic about how a render is produced, and the single source for the protocol is `references/design-process/real_ui_loop.md`. The entries below summarize it and never duplicate its content.

### Ground and reuse before generate

#### Description

Captures the design-context snapshot and builds from a present design system before authoring anything net-new.

#### Current Reality

Before choosing anything, the loop captures the subject, audience, page job, any existing design system, supplied reference material, and the target viewport as intake rather than a chooser. When a design system is present, it reuses a fitting component or token before authoring net-new and flags adherence violations such as raw color values, one-off spacing, inline overrides, and hand-rolled replacements for system components. On a free axis with no system, the anti-default process still governs and reuse applies only to what the system provides.

#### Source Files

See [`07--real-ui-loop/ground-and-reuse-before-generate.md`](07--real-ui-loop/ground-and-reuse-before-generate.md) for full implementation and validation file listings.

---

### Fidelity check and revision grammar

#### Description

Checks the real render against the quality floor and anti-default critique, then scopes revisions with an element-target grammar.

#### Current Reality

The loop checks the latest render rather than treating "compiles" as done. On a local dev-server UI it uses an `mcp-chrome-devtools` screenshot of the running build. The render must clear the quality floor and survive the anti-default critique, and because automated comparison is unreliable for subtle differences, the check is judgment over a render rather than pixel diffing. Revisions name the target, the visual evidence, the change, the scope, the expected verification, and whether the feedback is broad, which re-plans, or targeted, which scopes one edit.

#### Source Files

See [`07--real-ui-loop/fidelity-check-and-revision-grammar.md`](07--real-ui-loop/fidelity-check-and-revision-grammar.md) for full implementation and validation file listings.

---

### Handoff and loop guardrails

#### Description

Keeps generated source separate, emits an optional handoff manifest, and holds the line against style presets and scope the protocol refuses to add.

#### Current Reality

The loop keeps generated source, wrapper or adaptation files, and business logic distinct, reuses components by reading them live rather than copying them, and treats generated source as one-way. At the end it can emit one small handoff block covering the token system, files changed, key interactions, the checks run, open risks, and the next `sk-code` steps. A guarded direction gate may sketch a few brief-specific directions only when each is grounded in the subject, and the protocol holds a hard line against style presets, named aesthetic dials, turning a matched design system into a generator, multi-format export, comment threads, unsanctioned write-back to a source system, backend or deploy ownership, and any heavyweight visual-regression engine.

#### Source Files

See [`07--real-ui-loop/handoff-and-parity-guardrails.md`](07--real-ui-loop/handoff-and-parity-guardrails.md) for full implementation and validation file listings.

---
title: Codebase Context Snapshot Reference
description: Bounded, pointer-based context snapshot captured during deep-research initialization for codebase-scoped targets.
trigger_phrases:
  - "research context snapshot"
  - "research known context capture"
  - "research codebase pointers"
  - "bounded context snapshot"
importance_tier: normal
contextType: implementation
version: 1.14.0.0
---

# Codebase Context Snapshot Reference

Bounded context capture rules for the `Known Context` section of `deep-research-strategy.md` when the research target is codebase-scoped.

---

## 1. OVERVIEW

### Purpose

Define what a codebase-scoped initialization must capture in `Known Context` before the loop starts, and how that capture stays bounded rather than becoming a second research pass.

### When to Use

Load this reference during INIT when the research topic targets an existing codebase, feature, or system rather than an external/unknown domain.

### Core Principle

The snapshot is pointer-based, not a full context dump: it orients the first iteration without duplicating discovery work the loop itself should do.

---

## 2. SNAPSHOT CONTENTS

During initialization, capture a bounded, pointer-based context snapshot in `deep-research-strategy.md` `Known Context` when the target is codebase-scoped. The snapshot must include:

- Relevant source paths or symbols, cited as pointers rather than full file bodies.
- Known integration points and likely reuse candidates.
- Existing conventions or constraints that should shape the first iteration.
- Gaps or unavailable context sources, including stale code graph or memory retrieval.

---

## 3. NON-GOALS AND ROUTING

The snapshot must not create a separate context report loop:

- If a quick lookup is all that is needed, route the user to `@context` instead of running deep-research.
- If planning is the real goal, route to `/speckit:plan` after the snapshot is available rather than continuing to iterate.

This keeps the bounded snapshot scoped to orienting the first iteration, not substituting for `@context` or `/speckit:plan`.

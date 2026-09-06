---
name: sk-design
description: Design parent hub. Routes one design identity to the mode that owns the decision being asked for, starting with sk-design-fundamentals.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 2.0.0.0
metadata:
  author: OpenCode
  family: sk-design
---

<!-- Keywords: design, spacing, padding, typography, colour, contrast, hierarchy, design review, ux laws, design fundamentals -->

# Design (parent hub)

`sk-design` is a parent hub. It carries no procedure of its own: it decides which mode owns the
decision in front of you and hands over. The work lives in the modes.

---

## 1. WHEN TO USE

Use this hub when the question is what a surface should look like or why it looks wrong: spacing,
type, colour, contrast, hierarchy, or a review of an existing screen against design criteria.

Do not use it to measure an existing surface into a specification, or to author documentation
prose. Those have their own homes.

---

## 2. SMART ROUTING

Routing is registry-driven. `mode-registry.json` is the single source of truth for what modes
exist; `hub-router.json` carries the signals and the tie-break; root `ROUTER.md` owns stage two,
which picks the resources a mode actually loads.

| Mode | Owns | Reach it by asking about |
|------|------|--------------------------|
| `sk-design-fundamentals` | The values a surface is built from, and reviewing a surface against them | spacing, padding, type scale, colour, contrast, hierarchy, design review |

One mode today. The hub exists because more are arriving, and because a hub is the only shape that
lets several design modes share one advisor identity.

### How a request reaches a mode

The advisor scores this hub as a single identity. Nested modes carry `routingClass: metadata`, so
they are resolved by hub membership and hold no advisor entry of their own — their vocabulary
reaches the advisor only through this hub's `graph-metadata.json`. A registry row alone does not
make a request arrive; that is a property of the hub's vocabulary, and it is proven by replaying a
request rather than by reading a row.

---

## 3. RESOURCES

| Resource | Purpose |
|----------|---------|
| `mode-registry.json` | What modes exist, and what each may touch |
| `hub-router.json` | Signals, vocabulary classes, tie-break |
| `ROUTER.md` | Stage two: which resources a chosen mode loads |
| `sk-design-fundamentals/` | The one mode, and everything it owns |

---

## 4. RULES

1. Read the registry before assuming a mode exists.
2. Load what the mode's own router resolves, not the whole tree.
3. A mode already in context is not re-read.
4. This hub authors nothing itself. If you are editing here rather than in a mode, something is wrong.

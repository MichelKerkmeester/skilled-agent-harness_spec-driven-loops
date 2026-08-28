---
title: Visual Explanation - Modality And Depth
description: The content-to-modality mapping, the three-level depth rubric, and the lane boundary for the sk-communication explanation lane.
trigger_phrases:
  - "which visual form to use"
  - "modality selection table"
  - "explanation depth rubric"
  - "explain visually lane boundary"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Visual Explanation - Modality And Depth

Two dials decide whether an explanation lands: which form carries it, and how much the reader already knows.

---

## 1. OVERVIEW

### Core Principle

A diagram that shows everything explains nothing. Pick the smallest form that answers the question actually asked, at the shallowest depth the reader needs.

### Purpose

Backs the `/rewrite:explain-visually` command with the two selection rubrics it applies on every invocation, plus the boundary that separates this lane from the projection lane.

### When to Use

- Choosing which visual form fits the content being explained.
- Deciding how much prior knowledge an explanation may assume.
- Confirming what stays byte-exact when existing content is reproduced.
- Checking whether a request belongs to the explanation lane or the projection lane.

### Prerequisites

- `SKILL.md` — the two-lane model and the gating asymmetry between them.
- The command contract in `.opencode/commands/rewrite/explain-visually.md`.

---

## 2. MODALITY

Which form carries the content. Pick the smallest one that answers the question being asked.

| Content being explained | Form | Why this form |
|---|---|---|
| Logic, algorithms, decision rules | Pseudocode | Sequence and branching read faster as steps than as prose |
| Runtime control flow, who calls whom | Call tree | Depth and fan-out are the point; indentation shows both |
| UI structure, state and module boundaries | Component tree | Nesting plus annotated boundaries carry ownership |
| Responsibility layout, refactor targets | File tree | The shape of the directory *is* the argument |
| Interaction, sequence, data flow, state machines | Mermaid | Edges and direction matter more than position |
| What changes between two states | `diff` block | The reader needs the delta, not both versions |
| Mostly-new code, or where exact syntax matters | Code block | Paraphrasing syntax loses the thing being explained |
| Dense comparison, layout, many related values | HTML | A table or layout beats a paragraph when values relate in two dimensions |

### Selection Rules

1. Prefer the plainest form that works. Reach for HTML last, not first.
2. Include only what resolves the current question. Omit files, props, states, branches, and boundaries that do not.
3. Put the visual first and keep prose short. Place supporting text directly beside the part it explains.
4. Read before you draw. Never diagram a structure inferred from a filename or a symbol you have not opened.
5. If no visual would clarify — a single value, a yes/no answer — say so and skip the diagram.

---

## 3. DEPTH

How much background to assume.

| Level | Audience | Vocabulary | Shape |
|---|---|---|---|
| `expert` (default) | A peer on this codebase | Real identifiers, precise terms, no glossing | Dense; assumes the domain |
| `plain` | An intelligent non-specialist | Real names kept, each jargon term glossed once at first use | Moderate; one idea per line |
| `novice` | No background at all | Everyday words; a familiar analogy in place of the precise term | Picture first, text sparse and concrete |

**The rule that binds all three levels:** simplification applies to *words*, never to *facts*. Depth changes vocabulary, framing, and how much is shown. It never changes a value, an identifier, a path, or the truth of a claim. A `novice` answer may be incomplete; it may not be wrong.

---

## 4. PROTECTED SPANS

When content is reproduced rather than newly written, these stay byte-for-byte identical at every depth:

fenced and inline code · file and directory paths · terminal commands, scripts, flags · URLs, URIs, endpoints · exact numbers, dates, timestamps, metrics · identifiers (variables, functions, classes, parameters, config keys)

---

## 5. LANE BOUNDARY

This lane **creates new explanatory material** in-context. It does not rewrite a byte stream, does not call a local or hosted model, and is therefore not gated by the projection lane's enablement flag or egress rules.

It writes a file only when the operator passes `--artifact`, and then only a newly created, self-contained HTML file. Rewriting an existing on-disk file remains out of scope for the whole skill.

**Note:** Explanation output is display-only by default; the terminal is the primary surface.

**Out of scope:** editing any existing file, and any path that ships content to a local or hosted model.

---

## 6. REFERENCES AND RELATED RESOURCES

### Core

- [SKILL.md](../SKILL.md) — the two-lane model, triggers, and operator trigger commands.
- `.opencode/commands/rewrite/explain-visually.md` — the command contract: `/rewrite:explain-visually [--depth=expert|plain|novice] [--artifact] [topic]`.

### Related

- [package-map.md](./package-map.md) — the projection lane's subsystem-to-path map.

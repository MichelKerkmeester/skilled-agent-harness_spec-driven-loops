---
title: Validator Mechanics and Notation
description: How the create-flowchart validator inspects a file, box-width consistency mechanics and fixes, common mistakes that fail validation, and the judgment the validator cannot supply.
trigger_phrases:
  - "flowchart validator mechanics"
  - "box width variation flowchart"
  - "flowchart validator pitfalls"
  - "flowchart common mistakes"
  - "validator passing notation"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Validator Mechanics and Notation

How the packet validator actually inspects a file, how to keep box widths consistent, the mistakes that most often fail validation, and the judgment the validator cannot supply. This is overflow detail; `../SKILL.md` §8 is the authoritative validator contract for exact thresholds and exit behavior, and `../scripts/validate-flowchart.sh` is the source of truth.

---

## 1. OVERVIEW

This file explains how the packet validator actually inspects a flowchart file — box widths, connectors, decision labels, nesting, and size — then covers the box-width fix strategy, the mistakes that most often fail validation, and the judgment the validator cannot supply.

---

## 2. HOW THE VALIDATOR INSPECTS A FILE

The validator is lightweight and runs each check across the whole file, not per node. Knowing the mechanism explains why a diagram fails. For the exact numeric thresholds and exit behavior, see `../SKILL.md` §8 and the script itself.

- **Box widths** — it counts the unique lengths of every run of two or more `─` characters, file-wide. Every `─` run counts, including decorative separators, so unrelated lines can inflate the width count.
- **Connectors** — when box-drawing characters are present, it requires at least one arrow or branch marker, detected as `→`, `↓`, `├─`, or `└─`.
- **Decision labels** — when decision-like words (`decision`, `choice`, `branch`, `if`) appear, it requires at least one `[YES]`, `[NO]`, `✓`, or `✗` token somewhere in the file. The check is file-global, so a single labeled branch satisfies it — but every real branch should still carry its own label.
- **Nesting** — it derives depth from leading-space indentation, so deep indentation, not logical nesting, is what trips the warning.
- **Size** — it counts total lines, so a long file warns even when the diagram itself is simple.

## 3. BOX WIDTH CONSISTENCY

Width variation is the most common validator failure. Because the validator counts every run of two or more `─` characters and does not understand intent, a decorative line and a real box border both affect the width count.

**Practical rule**:
- use one width for normal action boxes
- use the same width for terminal boxes when possible
- use one repeated width for decision diamonds
- avoid decorative `─` separators unless they reuse an existing width

**How the `>5 width variations` error happens**:
- one title box, several medium action boxes, hand-sized side boxes, and unique diamond widths can produce 6 or more distinct lengths
- copying boxes from different pattern assets can mix widths that were consistent only inside their original examples
- wrapping long labels by widening one local box creates a new width for one sentence

**Fix strategy**:
- pick the standard width before drawing nodes
- wrap node text inside that width instead of shrinking or expanding borders
- make side branches use the same width as the main branch when possible
- shorten prose bullets rather than widening one box
- split the diagram if the only readable version needs many box sizes

## 4. COMMON MISTAKES

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Restating the process as boxes without arrows | The reader sees nouns, not flow | Add visible connectors and a primary path |
| Using `Yes` and `No` without brackets | The validator accepts `[YES]`, `[NO]`, `✓`, or `✗` | Use `[YES] Approved` and `[NO] Rejected` labels |
| Making every box a custom width | The validator can hit the width-variation error | Standardize widths and wrap text inside boxes |
| Copying asset domain details | Pattern assets are shape guides, not source truth | Replace content with sourced nodes and mark unknowns |
| Hiding retries in prose | The diagram omits risky behavior | Draw the loop-back or terminal fallback path |
| Drawing an infinite loop | Readers cannot tell when work stops | Add blocked, rejected, escalated, or completed terminal states |
| Treating warnings as harmless polish | Warnings often reflect readability defects | Fix warnings when practical before handoff |

## 5. WHAT THE VALIDATOR CANNOT CHECK

It catches common structural defects, but it does not prove the workflow is semantically complete.

**What still requires author judgment**:
- whether a branch outcome is real or invented
- whether a retry limit exists
- whether a branch converges or should terminate
- whether a service, owner, queue, cache, or database actually exists
- whether a diagram is clearer than prose

**Unknown handling**:
- write `UNKNOWN` in source notes or assumptions when a branch is required but unsupported
- do not turn an unknown into a polished terminal state
- ask for clarification when the branch affects behavior and the workflow contract permits asking

---

## 6. RELATED RESOURCES

- [README.md](README.md) - create-flowchart reference route-map
- [worked-example.md](worked-example.md) - a validator-passing decision-tree example
- `../SKILL.md` - authoritative workflow contract; §5 notation rules and §8 validator contract
- `../scripts/validate-flowchart.sh` - packet-local validator and actual threshold source

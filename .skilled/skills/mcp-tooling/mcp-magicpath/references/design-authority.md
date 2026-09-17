---
title: "MagicPath Design Authority"
description: "The unconditional sk-design pairing and the design agent persona this transport operates under: what each side owns, why the pairing is not trigger-gated, and how the persona's write capability is reconciled against a read-only transport."
trigger_phrases:
  - "magicpath design authority"
  - "magicpath sk-design pairing"
  - "magicpath design persona"
  - "magicpath design judgment"
  - "magicpath who decides"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# MagicPath Design Authority

> **The transport retrieves. `sk-design` decides.** Both run on every invocation. This packet does not wait for a request to look design-shaped before loading the design authority, because every surface it can reach is already a design surface.

---

## 1. OVERVIEW

`mcp-magicpath` reads components, themes, CSS variables, fonts, and canvas state. There is no such thing as a MagicPath lookup that is not about design. A packet that retrieves those facts and then declines to reason about them leaves the caller holding raw values with no one accountable for what they mean.

The earlier contract did exactly that: it said the packet "issues no design verdict" and pointed the reader away. That is correct about ownership and wrong about outcome — the verdict still gets made, just by whoever happens to be holding the conversation, without the value scales, interaction guidelines, motion principles, or the WCAG review pass.

Binding `sk-design` unconditionally closes that gap. The split is unchanged: this packet supplies evidence and `sk-design` supplies judgment. What changes is that the judgment half is always present instead of being an optional follow-up someone has to remember.

---

## 2. THE UNCONDITIONAL PAIRING

`sk-design` loads at STEP 0, before intent scoring and before the first tool call.

**It is not trigger-gated.** No keyword, no confidence score, and no "is this design-affecting?" test precedes it. A wiring check, a credential probe, and a bare `list_projects` all load it, and the cost of loading it on a request that turns out to be pure plumbing is far lower than the cost of a design answer produced without it.

**Loading means reading.** Naming the route in a response does not satisfy the rule. A packet already in context is not re-read.

**What each side owns:**

| Question | Owner |
|---|---|
| What components, themes, projects, teams exist; what a component's source is | `mcp-magicpath` |
| What a theme's CSS variables and fonts literally are | `mcp-magicpath` |
| Whether those values are the right ones | `sk-design` |
| Spacing, type scale, colour, elevation, radius decisions | `sk-design` |
| Interaction and motion behaviour | `sk-design` |
| Accessibility and the WCAG review pass | `sk-design` |
| Whether a retrieved component is fit for the use at hand | `sk-design` |

---

## 3. WHY sk-design AND NOT sk-design-md-generator

The three sibling design transports in this hub (`mcp-figma`, `mcp-refero`, `mcp-mobbin`) pair with `sk-design-md-generator`. That skill **measures** a live surface's real CSS into a Style Reference of named tokens. It is the right pairing for those three because each retrieves visual material that carries no token vocabulary of its own — a screenshot, a Figma node, a shipped screen.

MagicPath is different. `get_theme` already returns named CSS variables and fonts, authored as a design system. There is nothing to re-measure; the measurement is what the API hands back. What this surface lacks is the **decide** half — which of those values applies here, whether the contrast holds, what the interaction should do.

So the pairing is `sk-design`, and the difference from the siblings is deliberate rather than an oversight.

`sk-design-md-generator` still applies, unchanged, when the reference is an **external live site** rather than a MagicPath theme. Matching MagicPath output to a brand that exists on the web is a measure job first and a decide job second.

---

## 4. THE PERSONA AND ITS RECONCILED BOUNDARY

This packet operates under the **design agent persona**, resolved from the ACTIVE runtime's agent directory — `.opencode/agents/design.md`, `.claude/agents/design.md`, and the sibling runtime paths. Resolve it by runtime; never hardcode one path, and never assume the variants are byte-identical, because they are not.

**Inherited from the persona:**

- LEAF-only execution. No sub-agent dispatch, no Task tool, work self-contained in one execution.
- Read before edit. Verify before claiming completion.
- Mutate only what the request names; no adjacent cleanups.
- The routing instinct that separates decide work from measure work.

**Deliberately NOT inherited:**

- **Write authority.** The persona is described as "LEAF-only and write-capable". This transport declares `mutatesWorkspace: false` and forbids Write, Edit, and Task. On that conflict the transport's narrower surface wins, every time.

This is the one place the two contracts genuinely disagree, so it is stated rather than left to be discovered. A persona is a judgment contract, not a grant of tools. Adopting it must never widen what a packet can touch — if it did, every transport that adopted a write-capable persona would quietly become a mutating packet, and the hub's transport axis would stop meaning anything.

The practical rule: when the design work reaches the point of writing a file, that is the handoff to `sk-code` or to the operator, exactly as it was before the persona existed.

---

## 5. FAILURE MODES THIS CLOSES

- **The unowned verdict.** Facts retrieved, judgment implied, no skill accountable for it. Closed by loading the authority every time.
- **The trigger that never fires.** A design-affecting request phrased as plumbing ("what variables does this theme have?") skips a keyword-gated pairing and gets an unreviewed answer. Closed by removing the gate.
- **The named-but-unloaded route.** Citing `sk-design` in a response without reading it produces the appearance of a pairing and none of its content. Closed by stating that loading means reading.
- **The silently widened packet.** A write-capable persona adopted wholesale turning a read-only transport into a mutating one. Closed by naming the conflict and resolving it toward the narrower surface.

---

## 6. RELATED RESOURCES

- [`tool-surface.md`](./tool-surface.md) — the fourteen tools, their arguments and bounds, and the read funnel that produces the evidence.
- [`mutation-boundary.md`](./mutation-boundary.md) — the registered read-only surface versus the unregistered CLI write surface; the reason the persona's write half cannot be inherited.
- [`credential-setup.md`](./credential-setup.md) — the credential the retrieval half needs before it can supply any evidence at all.

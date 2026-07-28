---
title: Command Creation - Router / Presentation Split
description: How to separate a mode-based command into a thin router and its presentation asset — what each side owns, the before/after transformation, and the behavior-preserving rule.
trigger_phrases:
  - "router presentation split"
  - "thin router command"
  - "presentation asset command"
  - "split command refactor"
  - "behavior preserving command split"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Command Creation - Router / Presentation Split

Depth for SKILL.md Step 11. The split exists so routing behavior and visible wording can evolve independently: the router stays short and auditable, and the presentation asset becomes the display source of truth and can grow.

---

## 1. OVERVIEW

This reference expands the router/presentation separation named in SKILL.md Step 11: what the router owns, what the presentation asset owns, the mechanical before/after transformation, and the rule that a split must never change behavior.

---

## 2. WHAT EACH SIDE OWNS

**Router owns**:
- mandatory input gate or Phase 0
- owned-assets table
- mode detection and routing
- argument dispatch
- execution target selection
- presentation boundary statement

**Presentation owns**:
- startup questions and consolidated setup prompts
- dashboard and checkpoint layouts
- success and failure result templates
- next-step suggestions
- exact reply formats shown to the user

---

## 3. BEFORE / AFTER TRANSFORMATION

Move display wording out of the router and replace it with a pointer to the presentation asset.

Before:

```markdown
## 3. MODE ROUTING

If no mode suffix is present, ask:
"How should the review run? Choose A for auto or B for confirm."

After completion, show:
"Review complete. Next you can run /speckit:implement."
```

After:

```markdown
## 3. MODE ROUTING

If no mode suffix is present, load `assets/review_packet_presentation.txt` and show the mode-selection prompt from `Startup Presentation`.

## 5. PRESENTATION BOUNDARY

Result templates and next-step wording live only in `assets/review_packet_presentation.txt`.
```

---

## 4. BEHAVIOR-PRESERVING RULE

Moving display text into the presentation asset must not change routing semantics, required inputs, confirmation behavior, or tool permissions. A presentation split is a relocation of wording, never a semantic change. If a refactor would alter routing, gates, modes, or `allowed-tools`, it is no longer a split — treat it as a behavior change and surface it explicitly.

---

## 5. RELATED RESOURCES

- [README.md](README.md) - command-creation reference map
- [worked-example.md](worked-example.md) - a complete router plus presentation asset following these rules
- [command-presentation-template.md](../assets/command/command-presentation-template.md) - full presentation asset skeleton

---
title: "Implementation Summary: Visual Explanation Lane for sk-communication"
description: "Final state of the second sk-communication lane: one command carrying a modality dial and a depth dial, plus the Lane A/B framing in the skill, with the projection lane's invariants provably untouched."
trigger_phrases:
  - "visual explanation lane complete"
  - "explain-visually command shipped"
  - "modality and depth dials sk-communication"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/003-visual-explanation-lane"
    last_updated_at: "2026-08-28T04:45:05.297Z"
    last_updated_by: "claude"
    recent_action: "Shipped the explanation lane: command, reference doc, and SKILL two-lane framing"
    next_safe_action: "Commit and push, then exercise the command on a real topic"
    blockers: []
    key_files:
      - ".opencode/commands/rewrite/explain-visually.md"
      - ".opencode/skills/sk-communication/references/visual-explanation.md"
      - ".opencode/skills/sk-communication/SKILL.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Modality and depth are two dials of one capability, so one command carries both rather than two commands carrying one each."
      - "The command belongs in /rewrite because with no topic it re-renders the prior reply — the same act as /rewrite:response, in a different modality."
      - "Lane B is not gated by the projection enablement flag: it synthesizes new material in-context and has none of the egress risk the flag exists to contain."
---
# Implementation Summary: Visual Explanation Lane for sk-communication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-visual-explanation-lane |
| **Completed** | 2026-08-28 |
| **Level** | 2 |
| **Status** | Complete |
| **Actual Effort** | ~1 hour |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A second lane for `sk-communication`. The skill previously adapted an explanation on one axis — *register*, saying the same thing in plainer words. It now also adapts **modality** (prose → the smallest visual) and **depth** (how much background to assume).

Those are two independent dials on a single act — which form carries the content, and how much the reader already knows — so one command carries both rather than two commands carrying one each.

### Files

- **`.opencode/commands/rewrite/explain-visually.md`** (new) — `/rewrite:explain-visually [--depth=expert|plain|novice] [--artifact] [topic]`. Authored to the in-repo command canon and matching its sibling `/rewrite:response`: frontmatter → PURPOSE → CONTRACT → INSTRUCTIONS → EXAMPLES → NOTES, with a status line on every documented path. Its seven instruction steps carry both dials: parse args → resolve subject → **select modality** → **apply depth rubric** → identify protected spans → render → status.
- **`.opencode/skills/sk-communication/references/visual-explanation.md`** (new) — the content-to-modality table with its selection rules, the three-level depth rubric, the protected-span list, and the lane boundary. Kept out of the SKILL so the SKILL stays a router.
- **`.opencode/skills/sk-communication/SKILL.md`** (modified) — a two-lane table and the gating-asymmetry rationale, Lane B activation and keyword triggers, the new operator command entry, a References entry, the on-disk disambiguation, a broadened `description`, `Write` added to `allowed-tools`, and a version bump to 1.1.0.0.

### Why the command sits in `/rewrite`

With no topic argument it re-renders the immediately preceding reply — the same act as `/rewrite:response`, choosing a diagram instead of plainer wording. A topic argument extends that act to any subject. Family semantics hold, and no new command family was needed.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both upstream skills were fetched and read first, then the existing skill was read to record the invariants the new lane must not break. Three operator decisions set the shape before authoring: keep the skill standalone with two lanes rather than promoting it to a parent hub; expose one merged command in the existing `/rewrite` family rather than a new `/explain` family or two separate commands; and leave the skill on the advisor denylist so both lanes stay hand-invoked.

Two contradictions in the existing contract had to be resolved rather than inherited. First, the projection lane is off by default because it rewrites a byte stream and may reach a local or hosted model — risk the explanation lane does not carry, so the SKILL now states explicitly that the enablement flag and egress rules do not apply to Lane B. Left unstated, the next reader would have gated a lane that needs no gate. Second, the skill forbids "rewriting durable Markdown or any on-disk file," which would have barred the `--artifact` output; the bullet now distinguishes *editing an existing file* (still out of scope) from *creating a new artifact on explicit request* (Lane B, opt-in).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One command, not two | Modality and depth are not two features; they are two axes of one act. Splitting them would force the user to pick a form before knowing the depth they need. |
| Terminal-first, not artifact-first | The default output is an in-turn diagram, because the primary surface is a terminal. An HTML file is opt-in via `--artifact`, never the only delivery mechanism. |
| Keep it in `/rewrite` | The no-argument case re-renders the prior reply, which is exactly the family's existing meaning. |
| Lane B ungated | The enablement flag exists to contain egress and byte-rewriting risk. Lane B has neither, so applying the flag would disable a safe capability for no benefit. |
| Detail in a reference, not the SKILL | Keeps the SKILL a router; the modality table is reference material, not routing logic. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Projection package untouched | PASS — `git diff` under `cli-communication-projection/` is empty |
| Advisor routing unchanged | PASS — `route-exclusions.json` still lists `sk-communication`; no diff under `system-skill-advisor/` |
| Scoped diff | PASS — only the three planned files |
| Command canon | PASS — five mandated sections, required frontmatter, status line on every path |
| Packet validation | PASS — `validate.sh --strict` exits 0 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not advisor-discoverable, by operator choice.** Both lanes stay on the exclusion denylist, so the command is found by typing it, not by recommendation.
2. **`--artifact` writes to the session scratchpad**, not to a durable project location; a viewer must open the path the status line reports.
3. **Modality selection is judgment, not enforcement.** The table guides the choice; nothing mechanically rejects a poor one. A behavior benchmark would be the way to measure it if this lane sees real use.

<!-- /ANCHOR:limitations -->

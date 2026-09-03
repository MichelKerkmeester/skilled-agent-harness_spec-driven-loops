---
title: "Implementation Plan: Visual Explanation Lane for sk-communication"
description: "How the modality dial and the depth dial become one command plus a Lane B section in sk-communication, without touching the projection lane."
importance_tier: "medium"
contextType: "general"
trigger_phrases: []
---
# Implementation Plan: Visual Explanation Lane for sk-communication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The capability is one act with two independent dials. Choose both on every invocation:

| Dial | What it decides | Values |
|------|-----------------|--------|
| **Modality** | Which visual form carries this content | pseudocode · call tree · component tree · file tree · Mermaid · diff · code block · HTML |
| **Depth** | How much background to assume | `expert` (default) · `plain` · `novice` |

Composed, they define the command in one sentence: *explain this visually, at the right depth*. That is why one command is correct rather than two — these are not two features but two axes of one act.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Pass condition |
|---|---|---|
| Packet validation | `validate.sh specs/sk-communication/003-visual-explanation-lane --strict` | Exit 0 |
| Projection untouched | `git diff --name-only -- .../cli-communication-projection/` | Empty |
| Advisor untouched | `grep sk-communication .../route-exclusions.json` | Still present |
| Scope | `git diff --name-only` | Only the three planned files |

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The command lands in the existing `/rewrite` family rather than a new `/explain` family because of subject resolution: with no topic it re-renders the prior assistant reply, exactly like `/rewrite:response`, only choosing a visual instead of plainer wording. A topic argument extends the same act to arbitrary subjects, so family semantics hold.

Lane separation is the safety mechanism. Lane A (projection) rewrites a byte stream and may reach a local or hosted model, which is why it is gated and hidden. Lane B (explanation) synthesizes new material in-context and touches nothing canonical, so it carries none of that gating. Writing both facts into the SKILL is what stops the next reader from applying Lane A's flags to Lane B.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Author the command

Create `.opencode/commands/rewrite/explain-visually.md` to the shape used by `/rewrite:response`: frontmatter → PURPOSE → CONTRACT → INSTRUCTIONS → EXAMPLES → NOTES. Steps in order: parse arguments; resolve the subject (topic vs prior reply); select depth; select modality; identify protected spans; render; emit status.

### Phase 2 — Author the reference doc

Create the modality-selection table and depth rubric under the skill so `SKILL.md` points at them rather than absorbing them, keeping the SKILL a router.

### Phase 3 — Update SKILL.md

Add Lane A / Lane B framing, extend triggers, add the command to the operator list, disambiguate the on-disk rule, bump the version.

### Phase 4 — Verify

Confirm the projection lane is untouched by diff, the command is self-consistent, and the packet validates.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Scope proof**: `git diff --name-only` shows only the three planned files.
- **Invariant proof**: no diff under `cli-communication-projection/`; `route-exclusions.json` still lists `sk-communication`.
- **Canon proof**: the command carries the five mandated sections, `description` + `argument-hint` frontmatter, and a status line on every documented path.
- **Consistency proof**: every status named in the contract table appears in the instruction steps, and the examples match those statuses.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why it matters |
|---|---|
| `sk-create-command` canon | The command must match the repo's authoring shape, not the upstream skills' shape |
| Sibling `/rewrite:response` | The concrete in-repo pattern for a `/rewrite` family member |
| `sk-communication` invariants | Byte-preserving, default-off, advisor-hidden, no on-disk rewrites — Lane B must not break any |

Explicitly untouched: the `cli-communication-projection` package, `route-exclusions.json`, enablement flags, adapters, evaluation harness.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is additive or prose-level, so rollback is a clean revert:

1. Delete `.opencode/commands/rewrite/explain-visually.md` — removes the command with no other effect.
2. Delete `.opencode/skills/sk-communication/references/visual-explanation.md`.
3. `git checkout -- .opencode/skills/sk-communication/SKILL.md` — restores the single-lane skill and its prior version.

No runtime code, package, flag, or routing config is modified, so nothing else can be left inconsistent by the revert.

<!-- /ANCHOR:rollback -->

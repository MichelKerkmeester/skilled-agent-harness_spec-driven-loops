---
title: "Feature Specification: Visual Explanation Lane for sk-communication"
description: "Add a second lane to sk-communication that explains a topic or the prior reply visually, at a chosen depth. One command, /rewrite:explain-visually, carries two dials — which visual form fits the content, and how much background to assume — without weakening the projection lane's byte-preserving, default-off, advisor-hidden invariants."
trigger_phrases:
  - "visual explanation lane sk-communication"
  - "explain visually command modality depth"
  - "rewrite explain-visually depth modality"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-communication/003-visual-explanation-lane"
    last_updated_at: "2026-08-28T04:45:05.297Z"
    last_updated_by: "claude"
    recent_action: "Shipped the explanation lane: command, reference doc, SKILL two-lane framing"
    next_safe_action: "Commit and push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/SKILL.md"
      - ".opencode/commands/rewrite/explain-visually.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Structure: keep sk-communication standalone with two lanes, not a parent hub and not a sibling skill (operator-selected)."
      - "Command surface: ONE command in the existing /rewrite family that does both jobs, authored to repo canon rather than importing the two upstream skills (operator-selected)."
      - "Routing: the skill stays on the advisor exclusion denylist; both lanes remain hand-invoked (operator-selected)."
---
# Feature Specification: Visual Explanation Lane for sk-communication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Source** | Operator directive: give sk-communication a visual-explanation capability of its own |
| **Predecessor** | 002-sk-communication-triggers |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-communication` adapts an explanation on exactly one axis: **register**. It takes machine output and says the same thing in plainer words, byte-for-byte faithful to protected spans. That is useful but narrow. Comprehension turns on two further axes the skill cannot move. **Modality** decides which form carries the content — pseudocode for logic, a call tree for control flow, a component or file tree for structure, Mermaid for flow, a diff for change — instead of writing more prose. **Depth** decides how much prior knowledge to assume, from a peer on this codebase down to a reader with none.

Today a user who wants "draw me the control flow" or "explain this like I know nothing" gets prose, because the only comprehension tool in the repo rewrites wording. Nothing in the skill selects a visual form, and nothing lets a reader ask for less assumed knowledge.

### Purpose

Add a second lane to `sk-communication` that explains a topic — or the immediately preceding reply — **visually, at a chosen depth**. One command exposes both dials. The existing projection lane keeps every invariant it has today: canonical bytes unchanged, off by default, hidden from the advisor.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **`.opencode/commands/rewrite/explain-visually.md`** — a new command in the existing `/rewrite` family, authored to the repo's command canon (`sk-create-command` shape: frontmatter → PURPOSE → CONTRACT → INSTRUCTIONS → EXAMPLES → NOTES), matching its sibling `/rewrite:response`.
- **Two dials in one command**: a *modality* selector (which visual form carries this content) and a *depth* selector (`expert` | `plain` | `novice`).
- **Dual subject resolution**: with no topic argument the command explains the prior assistant reply — which is why it belongs in `/rewrite`; with a topic argument it explains that topic.
- **`.opencode/skills/sk-communication/SKILL.md`** — a Lane B section describing the explanation lane, its triggers, its dials, and the boundary against Lane A; plus a disambiguation of the existing "no on-disk writes" rule.
- **A reference doc** holding the modality-selection table and depth rubric, so the SKILL stays a router rather than a manual.

### Out of Scope

- Converting `sk-communication` into a parent hub (no `mode-registry.json` / `hub-router.json` / `description.json`); it stays standalone.
- Any change to advisor routing or `route-exclusions.json`; the skill stays hidden and hand-invoked.
- Any change to the projection lane's pipeline, provider adapters, enablement flags, or evaluation harness.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The explanation lane never mutates canonical bytes | The command is display-only by default; it writes a file only when `--artifact` is passed explicitly, and that file is newly created, never a rewrite of transcript or source. |
| REQ-002 | Protected spans stay byte-exact | Code blocks, inline code, paths, commands, URLs, numbers, and identifiers reproduced from a source reply appear unchanged, matching the sibling command's Step-3 rule. |
| REQ-003 | The projection lane is unchanged | No edit to the pipeline, adapters, enablement flags, or evaluation harness; `sk-communication` remains standalone and on the advisor denylist. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | One command exposes both dials | `/rewrite:explain-visually` accepts a depth flag and selects a modality; it does not split into two commands and does not import the upstream skills. |
| REQ-005 | Modality is chosen, not defaulted to prose | The command documents a content-to-visual mapping and picks the smallest form that answers the question, omitting detail that does not. |
| REQ-006 | The command matches repo canon | Frontmatter carries `description` and `argument-hint`; the body follows the five-section shape used by `/rewrite:response`; a status line is emitted on every path. |
| REQ-007 | The on-disk contradiction is resolved in prose | SKILL.md distinguishes *rewriting an existing file* (out of scope) from *creating a new explanatory artifact on explicit request* (in scope for Lane B). |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/rewrite:explain-visually` exists, parses `--depth` and `--artifact`, resolves a topic-or-prior-reply subject, and returns `STATUS=OK|NOOP|FAIL` on every path.
- **SC-002**: `SKILL.md` documents both lanes, and a reader can tell which lane a request belongs to from the triggers alone.
- **SC-003**: The projection lane's invariants are provably untouched — no diff to pipeline, adapters, flags, or `route-exclusions.json`.
- **SC-004**: `validate.sh <spec-folder> --strict` exits 0.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lane B inherits Lane A's default-off posture | The explanation lane would be unusable, since it has none of the egress risk that justifies the flag | State explicitly that enablement gating applies to projection only; Lane B is in-context and always available by command. |
| Risk | The "no on-disk writes" rule reads as forbidding `--artifact` | Internal contradiction in the skill contract | REQ-007 disambiguates creating a new artifact from rewriting canonical bytes; `--artifact` stays opt-in. |
| Risk | Scope creep toward a parent-hub conversion | Large metadata churn for two small modes | Out of scope by operator decision; the skill stays standalone with two documented lanes. |
| Dependency | Command canon | Command must match `sk-create-command` shape | Author against the shipped template and the sibling `/rewrite:response`. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Structure, command surface, and routing posture were all resolved by operator decision before authoring.

<!-- /ANCHOR:questions -->

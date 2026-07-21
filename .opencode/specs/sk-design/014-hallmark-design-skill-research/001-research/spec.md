---
title: "Research Charter: Hallmark design-skill reuse & learnings for sk-design"
description: "Deep research into what sk-design can copy/adapt, learn from, or be inspired by in the Hallmark design skill — across its modes, commands, slop gates, and design.md extraction."
trigger_phrases:
  - "hallmark reuse research"
  - "hallmark sk-design modes learnings"
  - "hallmark slop gates design.md study"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-design/014-hallmark-design-skill-research/001-research"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author the Hallmark reuse/learnings research charter"
    next_safe_action: "Run the 20-iteration fanout (cli-codex + cli-opencode) after the Rust research completes"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md"
      - ".opencode/skills/sk-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: Hallmark design-skill reuse & learnings for sk-design

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Parent:** `014-hallmark-design-skill-research` (phase parent)
- **Parent Spec:** `../spec.md`
- **Phase:** 001-research (1 of N)
- **Level:** 2 (research charter; deep-research loop populates `research/`)
- **Subject:** `../external/hallmark/` (Nutlope/Hallmark, cloned minus `.git`).

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Hallmark is a shipped design skill for AI coding assistants ("refuses to look AI-generated") whose four verbs — build, `audit`, `redesign`, `study` (design DNA → portable `design.md`) — plus ~29 reference docs (slop-test with 57 gates, anti-patterns, macrostructures, motion, microinteractions, color, typography, component-cookbook, design-md, study, export-formats, …) overlap heavily with sk-design's five modes (interface, foundations, motion, audit, md-generator/design-reference) and its styles database. It is an external, independently-designed take on the same problem.

### Purpose

Determine concretely what sk-design can COPY/ADAPT, LEARN from, or be INSPIRED by — and what to skip — to improve existing modes, commands, and logic without wholesale replacement.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Per-asset mapping of Hallmark references/verbs/gates/schemas to sk-design modes/commands/references, with a COPY/ADAPT/LEARN/INSPIRE-NEW/SKIP verdict and a specific sk-design change.
- Licensing verdict (what may be copied/redistributed vs learned-from-only) from `external/hallmark/LICENSE`.
- A ranked adoption list + phased plan.

### Out of Scope

- Actually applying the changes to sk-design (later phases, gated on this research).
- Redistributing Hallmark content beyond what its license permits.

### Files to Change

| File | Change |
|---|---|
| `research/research.md` | Synthesized reuse/learning matrix + ranked adoptions (loop-produced). |
| `research/deep-research-state.jsonl`, `research/deltas/**` | Loop state (loop-produced). |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Reuse/learning matrix | Every material Hallmark asset gets a row: asset → sk-design target → verdict (COPY/ADAPT/LEARN/INSPIRE-NEW/SKIP) → specific change → value → effort. |
| REQ-002 | Licensing verdict up front | The matrix states, per verdict, what the Hallmark LICENSE permits (copy/redistribute vs learn-only) with any attribution requirement. |
| REQ-003 | Grounded | Every claim cites the actual Hallmark file and the actual sk-design mode/command/reference it maps to. |

### P1 - Required

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-004 | Gap analysis on audit/slop | Compare Hallmark's 57 slop gates to sk-design's audit checklist; name the gates sk-design lacks. |
| REQ-005 | design.md schema comparison | Compare Hallmark's `design.md`/`study` extraction to sk-design's DESIGN.md / md-generator / styles-DB extraction; name concrete schema improvements. |
| REQ-006 | Ranked adoptions + phased plan | A ranked highest-value list and a phased fold-in plan for sk-design and its `/interface:*` commands. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 20 iterations complete (cli-codex ×10 + cli-opencode ×10, concurrency 2, stop-policy max-iterations — no early convergence) [TESTED: fanout ledger].
- `research/research.md` delivers the reuse/learning matrix + ranked adoptions + licensing verdict [VERIFIED: synthesis].

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** license forbids copy → downgrade COPY rows to LEARN. Mitigated — the charter requires the licensing verdict first.
- **Risk:** superficial "hallmark is nice" findings. Mitigated — the row schema forces a named sk-design change per asset.
- **Dependency:** cli-codex + cli-opencode availability; GPT-5.6-SOL access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

Research-only; no runtime change.

### Security

No execution of Hallmark's `site/` app; it is inspected as source only.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is Hallmark's curated-twenty-themes model a useful complement to sk-design's extracted ~1,290-bundle corpus, or a different philosophy to note-and-skip?
- Does sk-design want a `redesign` and/or `variant` verb it currently lacks?

<!-- /ANCHOR:questions -->

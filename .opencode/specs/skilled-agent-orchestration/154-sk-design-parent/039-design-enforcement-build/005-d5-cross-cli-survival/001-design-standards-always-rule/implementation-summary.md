---
title: "Implementation Summary: D5-R1 — Design Standards Loading ALWAYS rule (twin of code-standards)"
description: "A Design Standards Loading ALWAYS rule now ships beside the code-standards rule in all 3 cli-* SKILLs, giving design dispatch a deterministic sk-design safety net."
trigger_phrases:
  - "d5-r1 implementation summary"
  - "design standards loading always rule built"
  - "cli design rule insertion summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/001-design-standards-always-rule"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Insert Design Standards Loading ALWAYS rule into 3 cli-* SKILLs"
    next_safe_action: "Stage isolated cli-opencode design hunk apart from GLM WIP at push"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r1-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-design-standards-always-rule |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Design dispatch across the cli-* family now carries the same deterministic safety net that code dispatch already had. A new `Design Standards Loading (surface-aware contract)` ALWAYS rule sits directly beside the existing `Code Standards Loading` rule in all three cli-* SKILLs, so a dispatched child loads `sk-design` and runs the hub-to-mode design loop whenever the task feeds a design decision, regardless of whether the router's keyword matcher fired.

### Design Standards Loading ALWAYS rule

Router intent matching is phrasing-dependent and can miss. Code already had a one-for-one ALWAYS rule that survives dispatch this way; design did not. The new rule closes that gap: when a dispatched session is given design or UI work it now (1) loads `sk-design` (the hub), (2) lets the hub resolve a `workflowMode` through `mode-registry.json` (interface / foundations / motion / audit / md-generator), (3) loads the selected mode packet, sets the design register, and runs that mode's design verification, and (4) carries the `mcp-open-design` pairing when the work feeds Open Design. The wording is the exact twin of the code-standards rule, parallel across all three siblings, and surface-aware with a fallback to ask for surface and design intent when the mode is uncertain.

The rule was inserted append-only, immediately after the code-standards rule, with a minimal trailing renumber of the items that follow it. The code-standards rule's own number is preserved in every file, which keeps the `cli-opencode` cross-reference `(see ALWAYS rule 12)` pointing at code-standards.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-codex/SKILL.md` | Modified | Insert twin as ALWAYS rule 12; renumber 12→13 (Single-dispatch), 13→14 (AI_SESSION_CHILD) |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | Insert twin as ALWAYS rule 10; renumber 10→11 (Single-dispatch), 11→12 (AI_SESSION_CHILD) |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | Insert twin as ALWAYS rule 13; renumber 13→14 (Destructive-scope RM-8), 14→15 (Single-dispatch), 15→16 (AI_SESSION_CHILD) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high) located the code-standards anchor by content in each file, inserted the twin rule append-only, and applied the minimal trailing renumber. The orchestrator then verified the change independently: `grep -c "sk-design"` moved from `0` to `1` in each cli-* SKILL — a real delta, since the string was absent before — and each file's other sections stayed byte-unchanged except the inserted rule plus the renumber.

The concurrency case was handled deliberately. `cli-codex` and `cli-claude-code` were clean and showed exactly one added rule block plus the declared single-digit renumber, nothing else. `cli-opencode` was dirty with a separate GLM-5.2 workstream's WIP (a `glm-5.2` vision / image-input edit). A snapshot diff confirmed the codex change there is exactly the one Design Standards rule plus the renumber 13→14→15→16, and did not touch the GLM WIP — the `glm-5.2` / `zai` markers all remained intact, and the design hunk is a separate hunk from the GLM hunk. At push time the orchestrator isolates this rule's hunk (`git apply --cached` of the single rule hunk) so the GLM WIP is never co-committed. This is a documented concurrency-handling note, not a defect.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Insert AFTER the code-standards rule, preserving its number | Keeps `cli-opencode` ALWAYS rule 8's cross-reference `(see ALWAYS rule 12)` valid and avoids editing any existing rule's text |
| Clone the code-standards rule one-for-one as a twin | Parallel wording across siblings makes a static parity lint trivial and matches the proven survival pattern code already uses |
| Locate the anchor by content, never by line number | The GLM-5.2 workstream may have shifted `cli-opencode` lines, so a content anchor is the only safe target |
| Leave the cli-opencode design hunk for isolated staging | Bulk-staging the dirty file would co-commit the GLM WIP; the orchestrator stages only the verified design hunk |
| Keep the rule evergreen | No spec path, packet, phase, ADR, REQ, task, or finding ID in the inserted text, so it survives doc reorganization |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -c "sk-design"` in each cli-* SKILL | PASS — `1` in all three (baseline was `0`; real delta) |
| `grep -c "Design Standards Loading (surface-aware contract)"` | PASS — `1` in cli-codex, cli-claude-code, cli-opencode |
| cli-codex byte-diff | PASS — one added rule block + renumber 12→13, 13→14; no other hunk |
| cli-claude-code byte-diff | PASS — one added rule block + renumber 10→11, 11→12; no other hunk |
| cli-opencode hunk isolation | PASS — design hunk = one added block + renumber 13→14→15→16; separate from the GLM-5.2 vision hunk |
| GLM-5.2 WIP non-clobber | PASS — snapshot diff confirms `glm-5.2` / `zai` markers intact; design hunk did not touch GLM WIP |
| Evergreen scan over inserted block | PASS — no spec path / packet / phase / ADR / REQ / task / finding ID |
| Cross-reference integrity | PASS — code-standards number preserved; `(see ALWAYS rule 12)` still resolves |
| `validate.sh --strict` | PASS except expected GENERATED_METADATA residual (orchestrator regenerates description.json / graph-metadata.json) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **cli-opencode carries the design rule alongside concurrent GLM-5.2 WIP in the working tree.** At push time the orchestrator must isolate this rule's hunk (`git apply --cached` of the single rule hunk) so the GLM WIP is never co-committed. cli-codex and cli-claude-code are clean and commit normally.
2. **The rule's wording depends on the sk-design hub contract.** If `mode-registry.json` mode names (interface / foundations / motion / audit / md-generator) change, the parallel text in all three cli-* SKILLs needs a matching update.
3. **Generated metadata is a residual at hand-off.** `description.json` and `graph-metadata.json` still need regeneration by the orchestrator after this doc sync; they are not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

---
title: "Implementation Summary: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder"
description: "PLANNED phase: surface a ~90-word, 4-rule generic fable-5 governor capsule on the per-turn skill-advisor reminder. Implementation pending — see plan.md / tasks.md."
trigger_phrases:
  - "fable-5 governor capsule summary"
  - "B2 implementation summary"
  - "governor capsule planned"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/149-operate-like-fable-5/005-governor-capsule-hook"
    last_updated_at: "2026-06-15T14:06:37Z"
    last_updated_by: "planning-author"
    recent_action: "Authored planning docs"
    next_safe_action: "Implement per plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/constitutional/fable-governor.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-skilled-agent-orchestration/149-operate-like-fable-5/005-governor-capsule-hook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-governor-capsule-hook |
| **Status** | PLANNED |
| **Completed** | Pending implementation |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Pending implementation — see `plan.md` / `tasks.md`. This phase is PLANNED, not yet built. Target files: `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` (create) and `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` (edit + rebuild).

### Governor capsule on the per-turn reminder (planned)

When built, you will see a compact ~90-word, 4-rule fable-5 governor capsule re-asserted on every turn in the skill-advisor reminder, riding the same emission that already carries the comment-hygiene directive. The rules are generic (reason about the problem not yourself; outcome over visible process; commit and move with `// DECISION:`; minimum honest qualifier) and inherit the G4 honesty guardrail so the capsule steers efficiency, not capability. The capsule turns the efficiency doctrine from a decaying cold-surface setpoint into a live per-turn thermostat across the Claude, Codex, and OpenCode hook carriers.

### Files Changed (planned)

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` | Create (planned) | Canonical source-of-truth for the 4 generic rules, the G4 guardrail, and the 3 hook-carrier notes. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Modify (planned) | Add the capsule constant beside `HYGIENE_DIRECTIVE` and append it on the per-turn reminder; rebuild the artifact. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Not yet delivered. The planned rollout is a single text-only change on an already-firing path: write the doc, add the constant + append, rebuild the advisor artifact, then verify. There is no data migration and no feature flag — rollback is reverting one constant and rebuilding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Ride the existing per-turn skill-advisor reminder rather than build a new channel | The hook already fires every turn and already ships the comment-hygiene directive, so the highest-leverage behavioral lever needs no new transport. |
| Ship generic rules first; defer model-family specialization | The 4 rules port across runtimes; an Opus/Codex layer can come later (open question 1) without re-architecting the capsule. |
| Hold the rule text in one canonical doc (`fable-governor.md`) plus a mirrored render constant | Gives reviewers one source-of-truth while keeping the runtime string self-contained, matching the `HYGIENE_DIRECTIVE` resilience pattern. |
| Keep the subagent channel out of scope | The hook is subagent-blind; the subagent-visible governor is B3 / phase 006, a separate carrier. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

Pending — gates defined in `checklist.md`; will run `validate.sh` and the relevant `vitest` suites.

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this phase folder | Pending (planning self-check passes; final run after implementation) |
| Render `vitest`: capsule present in the per-turn reminder | Pending |
| Capsule word-count <=~90 and model-name-free | Pending |
| Existing render suite (hygiene directive, sanitization, token cap) unchanged | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Subagent-blind.** The per-turn hook does not reach dispatched subagents; subagent coverage is deferred to the B3 structural channel in phase 006.
2. **Effect is unmeasured until 003 lands.** Without the C1 baseline (phase 003), the capsule's impact on tool:text ratio and caveat density is asserted, not proven; re-measure after this ships.
3. **OpenCode per-turn semantics unconfirmed.** `experimental.chat.system.transform` is a settled rideable surface, but whether it re-evaluates every turn or caches within a session is open (open question 2); on OpenCode the capsule may be once-per-session rather than a true per-turn thermostat.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->


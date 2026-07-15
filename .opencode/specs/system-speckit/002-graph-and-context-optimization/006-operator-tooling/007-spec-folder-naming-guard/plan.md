---
title: "Implementation Plan: Spec-Folder Naming-Convention Guard [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard/plan]"
description: "Research approach and recommended-design plan for a cross-runtime spec-folder naming guard. Research-only packet; no guard is built here."
trigger_phrases:
  - "naming guard plan"
  - "naming guard design"
  - "shared naming validation module"
  - "creation time gate"
  - "per runtime pre write hook"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard"
    last_updated_at: "2026-06-06T05:50:56Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored research plan and recommended design layers"
    next_safe_action: "Operator review before any implementation packet is opened"
    blockers: []
    key_files:
      - "plan.md"
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "naming-guard-research-2026-06-06"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
---
# Implementation Plan: Spec-Folder Naming-Convention Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`create.sh`, `validate.sh`) + TypeScript (`mcp_server/`, hooks) |
| **Framework** | Spec Kit creation + validation scripts; per-runtime hook lifecycle |
| **Storage** | Filesystem spec folders under `.opencode/specs/` |
| **Testing** | Research-only: evidence verification + strict validate.sh on this packet |

### Overview
This is a research/design packet. The plan describes how the investigation was conducted and the layered design it recommends. The verdict is PARTIAL: a shared naming-validation module is feasible and is the right design, but a single cross-runtime pre-write hook cannot GUARANTEE enforcement because (a) pre-write tool interception parity is uneven and (b) folders can be created by raw `mkdir`/`Write` outside `create.sh`. The realistic guarantee point is `create.sh` (the canonical creation path) hardened with the shared module, backed by a new `validate.sh` semantic rule (catch-later), with per-runtime pre-write hooks as best-effort and a degraded-runtime fallback to the prompt-time advisor.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Defect reproduced and located (`028-026-program-research` at track root)
- [x] Naming convention sources identified (`create.sh`, `is-phase-parent.ts`, `validation_rules.md`)
- [x] Hook system reference located (`hook_system.md` §8 matrix)
- [x] Success criteria measurable

### Definition of Done
- [x] Feasibility verdict produced with cited evidence
- [x] Recommended design covers all four runtimes plus degraded fallback
- [x] Risks and open questions documented
- [x] `validate.sh --strict` returns PASSED on this packet


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source-of-truth shared module with a thin shell shim, mirroring the existing `is-phase-parent.ts` dual-implementation pattern (TS authoritative + shell mirror that agree).

### Key Components (recommended design, not built here)
- **`spec-folder-naming` shared module**: `classifyProposedSpecFolder(targetPath)` returning `{ ok, severity, reason, suggestedLocation }`. Reuses `isPhaseParent` / the phase-child regex; never re-derives them.
- **Creation-path gate**: `create.sh` calls the module before `mkdir`; hard-blocks high-confidence violations (embedded sibling packet number, wrong location), warns on the rest. This is the GUARANTEE point for the canonical path.
- **Per-runtime pre-write hook (best-effort)**: Codex `pre-tool-use.ts` already returns `{decision:'deny', reason}` for Bash; the same shape can deny a mis-located folder. Claude `PreToolUse` is supported by the schema but currently unregistered; OpenCode can deny via plugin event handlers.
- **Catch-later validator rule**: a new `validate.sh` semantic rule flags mis-located / embedded-number / generic-slug folders that bypass the creation path.
- **Degraded-runtime fallback**: Gemini (no checked-in project hook) and Copilot (next-prompt-only) rely on the creation-path gate + `validate.sh` + the prompt-time advisor brief.

### Data Flow
1. AI or operator requests a spec folder at a target path.
2. Canonical path: `create.sh` calls the shared module → block or warn → proceed.
3. Best-effort path: the active runtime's pre-write hook calls the same module → advisory deny.
4. Any path that reaches disk is later re-checked by `validate.sh`'s semantic rule.
5. Degraded runtimes get only steps 2 and 4 plus the prompt-time advisor reminder.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Convention Audit
- [x] Document phase-child regex and create.sh basename regex (with the looseness gap)
- [x] Document top-level vs phase-child decision (flag-driven, no semantic decision)
- [x] Document phase-parent detection (`is_phase_parent` / `isPhaseParent`)

### Phase 2: Hook-Parity Audit
- [x] Build the per-runtime pre-write + SessionStart parity picture
- [x] Identify the only existing pre-write deny interception (Codex `pre-tool-use.ts`)
- [x] Name the degraded runtimes (Gemini no project hook; Copilot next-prompt-only)

### Phase 3: Verdict & Design
- [x] State the feasibility verdict (PARTIAL) with grounded reasoning
- [x] Specify the layered design and the guarantee point
- [x] Record risks and open questions


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence verification | Every cited file:line resolves to the claimed content | Read / Grep |
| Defect reproduction | `028-026-program-research` exists and passes both regexes | Bash + regex check |
| Packet validation | This research packet is structurally green | `validate.sh --strict` |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `is-phase-parent.ts` | Internal | Green | Guard would re-derive the regex (avoid) |
| `create.sh` | Internal | Green | No canonical creation-path gate possible |
| `validate.sh` | Internal | Green | No catch-later layer |
| Runtime hook configs | Internal | Mixed | Best-effort per-runtime enforcement degrades |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research conclusion is rejected or superseded.
- **Procedure**: This is a documentation-only packet; remove the packet folder. No code or config was changed, so there is nothing to revert.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Convention Audit) ──┐
                             ├──> Phase 3 (Verdict & Design)
Phase 2 (Hook-Parity Audit) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Convention Audit | None | Verdict & Design |
| Hook-Parity Audit | None | Verdict & Design |
| Verdict & Design | Convention Audit, Hook-Parity Audit | None |


<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Convention Audit | Low | 30 minutes |
| Hook-Parity Audit | Medium | 45 minutes |
| Verdict & Design | Medium | 45 minutes |
| **Total** | | **2 hours** |


<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (N/A - documentation-only, version-controlled)
- [ ] Feature flag configured (N/A - no runtime change)
- [x] Monitoring alerts set (N/A - no runtime change)

### Rollback Procedure
1. **Immediate**: No runtime impact; nothing to disable.
2. **Revert docs**: Remove the packet folder if the research is superseded.
3. **Verify**: Confirm no `create.sh` / `validate.sh` / hook files were touched (none were).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no data changes

<!-- /ANCHOR:enhanced-rollback -->

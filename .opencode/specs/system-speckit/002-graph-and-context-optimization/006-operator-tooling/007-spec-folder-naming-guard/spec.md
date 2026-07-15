---
title: "Feature Specification: Spec-Folder Naming-Convention Guard [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard/spec]"
description: "Research and design for a cross-runtime guard that prevents badly-named or mis-located spec folders at creation time, consistently across Claude / Codex / OpenCode / Gemini. Feasibility verdict: PARTIAL."
trigger_phrases:
  - "spec folder naming guard"
  - "naming convention guard"
  - "mis-located spec folder"
  - "phase child naming"
  - "creation time naming enforcement"
  - "cross-runtime naming hook"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/006-operator-tooling/007-spec-folder-naming-guard"
    last_updated_at: "2026-06-06T05:50:56Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 2 research packet for the spec-folder naming guard"
    next_safe_action: "Operator review of feasibility verdict before any guard implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "research.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "naming-guard-research-2026-06-06"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Spec-Folder Naming-Convention Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `002-graph-and-context-optimization` |
| **Parent Spec** | ../spec.md |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec folders can be created with names that are syntactically valid but semantically wrong or mis-located, and nothing stops this at creation time. The operator just hit exactly this defect: `.opencode/specs/system-spec-kit/028-026-program-research` was created at the track root when its slug embeds another packet's number (`026`), signalling it should have been a phase child under `002-graph-and-context-optimization`. That folder passes both `create.sh`'s basename regex (`^[0-9]{3}-[A-Za-z0-9._-]+$`, `create.sh:683`) and the `validate.sh` `FOLDER_NAMING` rule (lowercase / hyphen / 3-digit prefix, `validation_rules.md:586`), so neither layer flags it. The naming-quality rule that would have caught it (literal/no-embedded-number guidance, `CLAUDE.md` ALWAYS #20) is documentation-only and is never executed.

### Purpose
Determine whether a cross-runtime hook or shared module can GUARANTEE spec-folder naming-convention quality at creation time across all four runtimes (Claude Code, Codex, OpenCode, Gemini), and design the guard that makes this class of defect not recur. This packet is READ-ONLY RESEARCH: it delivers a feasibility verdict and a recommended design, not an implementation.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Documenting the current naming convention and where it is (not) enforced at creation time.
- Auditing the per-runtime hook system for pre-write / SessionStart / prompt-time parity.
- A feasibility verdict (can a cross-runtime guard guarantee naming quality? yes / no / partial).
- A recommended design: a shared naming-validation module called from the canonical creation path and from per-runtime hooks, with a degraded-runtime fallback.
- Risks and open questions for the future implementation packet.

### Out of Scope
- Building the guard (no new module, no hook registration, no `create.sh` / `validate.sh` edits in this packet).
- Renaming or relocating the existing `028-026-program-research` defect folder (separate remediation packet).
- Changing the phase-parent detection contract (`is_phase_parent` / `isPhaseParent`).
- Any runtime config changes (`.claude/settings.local.json`, `~/.codex/config.toml`, OpenCode plugins, Gemini hooks).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| spec.md | Create | This research specification |
| plan.md | Create | Research approach and recommended-design plan |
| tasks.md | Create | Research task breakdown |
| research.md | Create | Findings, feasibility verdict, and recommended design |
| checklist.md | Create | Level 2 verification of research completeness |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the naming convention with evidence | Phase-child regex, top-level vs phase-child rules, and phase-parent detection cited with file:line |
| REQ-002 | Identify the creation-time enforcement gap | Show that `create.sh` validates syntax only and no tool decides top-level vs phase-child location |
| REQ-003 | Produce a feasibility verdict | Verdict is one of yes / no / partial, with the reasoning grounded in hook-parity evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Audit per-runtime hook parity | Claude / Codex / OpenCode / Gemini pre-write + SessionStart parity documented with the degraded runtimes named |
| REQ-005 | Recommend a concrete design | Shared validation module + creation-path gate + per-runtime hook + validate.sh catch-later + degraded fallback |
| REQ-006 | Capture risks and open questions | At least the raw-mkdir bypass, parity gaps, and false-positive risks named |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can state, from `research.md`, exactly why `028-026-program-research` slipped through every existing layer.
- **SC-002**: The feasibility verdict (PARTIAL) is defensible from the cited hook-parity matrix.
- **SC-003**: The recommended design names a single guarantee point plus best-effort layers and a degraded-runtime fallback, so an implementation packet can start without re-research.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Raw `mkdir` / `Write` bypasses any creation hook | A guard on `create.sh` alone does not catch hand-made folders | Pair the creation-path gate with a `validate.sh` semantic rule (catch-later) |
| Risk | Pre-write hook parity is uneven across runtimes | No single hook enforces uniformly | Treat per-runtime hooks as best-effort; make `create.sh` the guarantee |
| Risk | Semantic naming checks are heuristic | False positives could block legitimate names | Severity tiers: hard-block only on high-confidence rules (embedded packet number, wrong location); warn on the rest |
| Dependency | Phase-parent detection contract | Guard must reuse `is_phase_parent` / `isPhaseParent` logic | Import the existing modules, do not re-derive the regex |
| Dependency | Runtime hook configs | Live enforcement depends on per-runtime wiring | Document required config; degrade gracefully when absent |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A creation-time naming check must add < 50ms to `create.sh` (filesystem read of the parent dir only).
- **NFR-P02**: A per-runtime pre-write hook must stay within the existing 1800ms hook timeout budget (`hook_system.md` §7).

### Security
- **NFR-S01**: The guard must not execute arbitrary slug content; treat folder names as untrusted strings (regex match only, no eval).
- **NFR-S02**: The guard must fail open (allow + warn) rather than fail closed on its own error, to avoid blocking all spec-folder creation.

### Reliability
- **NFR-R01**: The shared module must be the single source of truth; shell and TypeScript callers must agree (mirror the existing `is-phase-parent.ts` dual-impl pattern).
- **NFR-R02**: Degraded runtimes (Gemini, Copilot) must still benefit via the creation-path gate and `validate.sh`, even without a pre-write hook.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Embedded packet number**: `028-026-program-research` — a top-level slug containing a second `NNN` token that matches a sibling packet number is the canonical defect.
- **Valid-but-uppercase**: `create.sh` basename regex allows `A-Z`, dots, underscores; the phase-child regex does not. A guard must reconcile to the stricter `^[0-9]{3}-[a-z0-9][a-z0-9-]*$`.
- **Generic remediation slugs**: `remediation`, `cleanup`, `fix`, `phase-N` as standalone slugs (forbidden by `CLAUDE.md` ALWAYS #20 but unenforced).

### Error Scenarios
- **Parent dir unreadable**: guard cannot list siblings; fail open with a warning, do not block.
- **Folder created outside `create.sh`**: prompt-time and pre-write hooks may not fire; only `validate.sh` catches it later.
- **Hook runtime disabled** (`SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` or Codex `codex_hooks` off): fall back to creation-path gate + `validate.sh`.

### Concurrent Operations
- **Parallel folder creation**: numbering races are already handled by `create.sh`'s scaffold lock; a naming guard reads names only, so it adds no new race.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the `create.sh` naming gate HARD-BLOCK or warn-and-proceed on a high-confidence mis-location? **RESOLVED: Recommend hard-block at create.sh for high-confidence rules (embedded sibling number, wrong location), warn elsewhere.**
- Can a single shared module serve shell + all four runtimes? **RESOLVED: Yes, via the existing dual-impl pattern (TS module + thin shell shim), as `is-phase-parent.ts` already does.**
- Does Gemini ever get a pre-write hook? **OPEN: No checked-in Gemini project hook today; tracked as a parity follow-on, not a blocker for this design.**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Research-only packet; no code change |
| Risk | 5/25 | Documentation only; future guard design |
| Research | 15/20 | Convention + four-runtime hook-parity investigation |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Research Findings & Design**: See `research.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->

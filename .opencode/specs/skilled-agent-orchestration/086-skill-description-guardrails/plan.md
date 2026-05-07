---
title: "Implementation Plan: Skill Description Budget Guardrails"
description: "Three-tier sequenced plan for sk-doc docs, create-time soft validation, and a /doctor:skill-budget drift audit command."
trigger_phrases:
  - "skill description plan"
  - "doctor skill-budget plan"
  - "086 implementation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/086-skill-description-guardrails"
    last_updated_at: "2026-05-06T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Begin Tier 1 docs"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-086"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Description Budget Guardrails

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Languages** | Markdown (sk-doc), Python (quick_validate.py + audit_descriptions.py), YAML (workflow) |
| **Build/Test** | `python3` direct execution; `bash validate.sh --strict` for spec folder |
| **Live integration** | `/doctor:skill-budget :auto` end-to-end smoke after creation |

### Overview
Three sequenced phases in one Level 1 packet. Phase 1 fixes thin/contradictory authoring docs (lowest risk, no code). Phase 2 extends `quick_validate.py` so the new docs are enforceable at create-time. Phase 3 adds a standalone audit command that detects accumulated drift project-wide. All three phases share a single set of constants (130/110/1,536/5,600) defined in Phase 1 docs and reused in Phase 2/3 code.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Plan agent validated 3-tier split
- [x] Soft-target numbers grounded in 083 actuals
- [x] Phase 1 exploration mapped current state across all three layers
- [x] Risks identified with concrete mitigations

### Definition of Done
- [x] Tier 1 docs internally consistent (no 200/300 contradiction)
- [x] Tier 2 fixtures pass; quick_validate.py emits length warnings
- [x] Tier 3 `/doctor:skill-budget :auto` runs end-to-end
- [x] Advisor still ranks sk-doc on creation prompts (REQ-006 probe)
- [x] validate.sh --strict PASSES on this spec folder

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layer-cake guardrails. Each layer is independent and degrades gracefully if upper layers are skipped.

### Key Components
- **Tier 1 (sk-doc docs)**: passive guidance read by humans + advisor at authoring time
- **Tier 2 (`quick_validate.py`)**: active soft-block during `/create:sk-skill` + `/create:agent`
- **Tier 3 (`/doctor:skill-budget`)**: on-demand drift audit, CI-composable
- **Single-source constants**: 130/110/1,536/5,600 declared in Tier 1 docs, mirrored in Tier 2/3 code as Python module constants

### Data Flow
1. Author runs `/create:sk-skill :confirm` → reads sk-doc templates (Tier 1) → writes SKILL.md
2. `/create:sk-skill` Step 4 calls `quick_validate.py` (Tier 2) → emits length warning if over soft target
3. Periodically (or in CI) the user runs `/doctor:skill-budget :auto` (Tier 3) → walks all skill/command/agent surfaces → reports drift
4. Tier 3 reuses Tier 2's length library (no duplication)

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Tier 1 — sk-doc authoring guidance
- [x] Replace `frontmatter_templates.md:198` "10-200 characters recommended" with the four-constant guidance + new "Description Budget & Trim Style" subsection
- [x] Fix `skill_md_template.md:75` "150-300 chars" contradiction
- [x] Extend `skill_creation.md:397` table + Pitfall 1 (lines 571-581) with budget guidance and stack-agnostic rule
- [x] Add cross-link callouts in `agent_template.md` and `command_template.md`
- [x] Include sk-code 545→125 before/after example

### Phase 2: Tier 2 — create-time soft validation
- [x] Extend `quick_validate.py` `validate_skill()` with description-length check
- [x] Operate on unwrapped value (post `strip_matching_quotes`)
- [x] CLI flag `--description-soft-target` with auto-detect (skill vs command from parent path)
- [x] Soft warning at target; hard fail at 1,536
- [x] Wire into JSON output schema
- [x] Add 4 fixtures: under-target, at-target, over-soft, over-hard
- [x] Wire into `/create:sk-skill` Step 4 (assets/create_sk_skill_*.yaml fix_loop)
- [x] Wire into `/create:agent` Step 5b (assets/create_agent_confirm.yaml)

### Phase 3: Tier 3 — `/doctor:skill-budget` audit
- [x] Create `audit_descriptions.py` reusing Tier 2 length library
- [x] Walk `.opencode/skills/*/SKILL.md`, `.opencode/commands/**/*.md`, four agent surfaces (incl. Codex TOML)
- [x] Emit per-item table, top-N bloated, project total, headroom, suggested trims
- [x] `--json` and `--fail-over=N` flags
- [x] Create `doctor/skill-budget.md` entrypoint mirroring `skill-advisor.md` structure
- [x] Create `_auto.yaml` and `_confirm.yaml` workflow files
- [x] Add 4 runtime mirrors (`.claude/commands/doctor/skill-budget.md` symlink, etc.)

### Phase 4: Verification
- [x] Run `validate.sh --strict` on spec folder
- [x] Run quick_validate.py against fixtures (REQ-003, REQ-007)
- [x] Run audit script (REQ-004, REQ-005)
- [x] Run advisor probe for sk-doc keyword density (REQ-006)
- [x] Write implementation-summary.md
- [x] Save context via generate-context.js

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | quick_validate.py length check (under/at/over-soft/over-hard) | pytest fixtures |
| Unit | audit_descriptions.py length library + TOML parser | pytest |
| Integration | `/doctor:skill-budget :auto` end-to-end | live skill harness |
| Smoke | advisor_recommend "create a new skill" still ranks sk-doc | mcp__spec_kit_memory__advisor_recommend |
| Validation | validate.sh --strict on spec folder | bash |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python 3.11+ tomllib | External | Green | Codex agent TOML parsing falls back to manual regex |
| sk-doc DQI scoring | Internal | Green | Tier 2 wires into existing fix_loop without rewrite |
| Spec-kit validate.sh | Internal | Green | Strict-mode gate for completion claim |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: REQ-006 probe regression (sk-doc loses advisor ranking) OR Tier 2 length check fires before multiline-block rejection
- **Procedure**:
  1. `git checkout HEAD -- .opencode/skills/sk-doc .opencode/commands/create .opencode/commands/doctor` (per-tier as needed)
  2. Run advisor probe to confirm baseline restored
  3. Open follow-on packet to redesign the failing tier
  4. Other tiers remain shipped (independence is the point of layer-cake)

<!-- /ANCHOR:rollback -->

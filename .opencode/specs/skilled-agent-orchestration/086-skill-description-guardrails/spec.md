---
title: "Feature Specification: Skill Description Budget Guardrails"
description: "Bake the packet 083 trim-style lessons into sk-doc authoring docs, add create-time soft validation in quick_validate.py, and ship a /doctor:skill-budget audit command so future skills never repeat the dropped-from-discovery bloat."
trigger_phrases:
  - "skill description guardrails"
  - "doctor skill-budget"
  - "description budget audit"
  - "frontmatter description trim"
  - "skill creation validation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/086-skill-description-guardrails"
    last_updated_at: "2026-05-06T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Begin Tier 1 sk-doc docs edits"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md"
      - ".opencode/skills/sk-doc/assets/skill/skill_md_template.md"
      - ".opencode/skills/sk-doc/references/specific/skill_creation.md"
      - ".opencode/skills/sk-doc/scripts/quick_validate.py"
      - ".opencode/commands/doctor/skill-budget.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-086"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Skill Description Budget Guardrails

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-06 |
| **Branch** | `main` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 083 (skill description budget trim) and 084 (ambiguity dual-margin fix) revealed that skill/command/agent description authoring has hidden constraints with no current enforcement: (1) total skill-metadata budget caps at 8,000 chars (`SLASH_COMMAND_TOOL_CHAR_BUDGET`); (2) per-item hard cap is 1,536 chars; (3) a memory-rule "stack-agnostic phrasing" forbids enumerating Webflow/Go/Next.js etc. in descriptions; (4) advisor routing depends on keyword density. Packet 083 had to manually trim 36 frontmatter descriptions because authoring guidance was thin and contradictory: `frontmatter_templates.md:198` says "10-200 characters", `skill_md_template.md:75` says "150-300 chars", `skill_creation.md:397` says nothing about length. Zero create-time validation. Zero permanent drift audit. Without guardrails, the next dropped-from-discovery warning is a matter of when, not if.

### Purpose
Bake the 083 trim-style lessons into three layers that prevent future bloat at different time horizons: (Tier 1) sk-doc authoring docs that humans read at write-time; (Tier 2) `quick_validate.py` warnings during `/create:sk-skill` and `/create:agent` flows; (Tier 3) a standalone `/doctor:skill-budget` audit command that detects accumulated drift across the whole project and exits non-zero for CI/pre-commit use.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Tier 1 — Authoring guidance (sk-doc docs):**
- Resolve the 200/300 char contradiction across templates → settle on **≤130 skill / ≤110 command soft target / 1,536 hard cap / 5,600 project soft-ceiling**
- Encode the 083 trim style guide (drop product enumerations, stack lists, marketing prose, parenthetical jargon; keep skill-name token, primary verb, primary domain noun, mode suffixes, numeric specifics)
- Add the stack-agnostic memory rule
- Add a punchy before/after example (sk-code 545→125)

**Tier 2 — Create-time soft validation:**
- Extend `quick_validate.py` `validate_skill()` with description-length check, operating on the unwrapped post-quote-strip value (not raw multiline source)
- Soft warnings at the soft target (130/110); hard fail at 1,536
- New CLI flag `--description-soft-target`, auto-detect skill vs command via parent path
- Wire into `/create:sk-skill` Step 4 and `/create:agent` Step 5b fix loops
- Add fixtures + tests

**Tier 3 — Drift audit command:**
- New `/doctor:skill-budget` slash command in the `doctor:*` family
- New `audit_descriptions.py` script walking `.opencode/skills/*/SKILL.md`, `.opencode/commands/**/*.md`, and the four agent surfaces (`.opencode/agents/*.md`, `.claude/agents/*.md`, `.gemini/agents/*.md`, `.codex/agents/*.toml`)
- Per-item lengths + top-N bloated + project total + headroom under 8,000 default
- `--json` and `--fail-over=N` flags for CI/pre-commit
- 4 runtime mirrors of the entrypoint (matching existing symlink pattern)
- Reuses Tier 2 length library function

### Out of Scope
- Cross-checking description tokens against `lib/scorer/lanes/explicit.ts` `TOKEN_BOOSTS`/`PHRASE_BOOSTS` boost anchors — deferred to a follow-on packet
- Pre-commit hook installation — Tier 3 produces the right exit codes; user-config decision
- Plugin marketplace skill audit (`~/.claude/plugins/marketplaces/`) — outside this repo's authoring path
- Changing the existing 083 trims — those stay as-is

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/documentation/frontmatter_templates.md` | Modify | New "Description Budget & Trim Style" subsection; replace line 198 |
| `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | Modify | Fix line 75 (200/300 contradiction) |
| `.opencode/skills/sk-doc/references/specific/skill_creation.md` | Modify | Extend Pitfall 1 + line 397 table with budget guidance |
| `.opencode/skills/sk-doc/assets/agent_template.md` | Modify | Cross-link callout |
| `.opencode/skills/sk-doc/assets/command_template.md` | Modify | Cross-link callout |
| `.opencode/skills/sk-doc/scripts/quick_validate.py` | Modify | Add description-length check + CLI flag |
| `.opencode/skills/sk-doc/scripts/tests/<new fixtures>` | Create | Length-check test fixtures |
| `.opencode/commands/create/sk-skill.md` (+ assets/create_sk_skill_*.yaml) | Modify | Surface warnings in Step 4 |
| `.opencode/commands/create/agent.md` (+ assets/create_agent_confirm.yaml) | Modify | Call quick_validate at Step 5b |
| `.opencode/commands/doctor/skill-budget.md` | Create | New entrypoint |
| `.opencode/commands/doctor/assets/doctor_skill-budget_auto.yaml` | Create | :auto workflow |
| `.opencode/commands/doctor/assets/doctor_skill-budget_confirm.yaml` | Create | :confirm workflow |
| `.opencode/commands/doctor/scripts/audit_descriptions.py` | Create | Audit script |
| `.claude/commands/doctor/skill-budget.md`, `.gemini/...`, `.codex/...` | Create | Symlink mirrors |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Constants single source of truth | All three tiers reference the same values: 130 / 110 / 1,536 / 5,600. No drift. |
| REQ-002 | sk-doc docs internally consistent | `frontmatter_templates.md` and `skill_md_template.md` agree on the soft target. The 200/300 contradiction is gone. |
| REQ-003 | quick_validate.py emits length warnings | Synthetic fixture with 145-char skill description triggers a non-blocking warning; 1,600-char description triggers hard fail. |
| REQ-004 | /doctor:skill-budget runs end-to-end | Command produces a per-item table + project total + headroom + suggested trims. `--fail-over=4000` exits non-zero on current ~4,423-byte total; `--fail-over=5600` exits 0. |
| REQ-005 | Audit covers 4 agent surfaces | Script parses YAML (3 surfaces) and TOML (Codex). Reports unique-by-name with `mirrored: N surfaces` annotation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Advisor still ranks sk-doc on creation prompts | Post-edit `advisor_recommend` for "create a new skill" prompt returns sk-doc or system-spec-kit as top — confirms Tier 1 doc edits didn't dilute keyword density. |
| REQ-007 | Multiline-block rejection still fires first | Existing `quick_validate.py:90` regex against `description:\s*\n\s+` still triggers BEFORE the new length check. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on the spec folder PASSES.
- **SC-002**: `python3 .opencode/skills/sk-doc/scripts/quick_validate.py <test-fixture-over-soft>` emits a length warning.
- **SC-003**: `/doctor:skill-budget :auto` returns total ≈ 4,423 bytes and headroom ≥ 1,177 chars.
- **SC-004**: Synthetic test: removing the soft-target line from `frontmatter_templates.md`, then running `/doctor:skill-budget`, surfaces drift correctly. (Then revert.)

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tier 1 doc edits dilute sk-doc's own description keyword density | sk-doc loses advisor ranking | REQ-006: post-edit advisor probe |
| Risk | Tier 2 length check fires before multiline-block rejection | Hides hard error behind soft warning | REQ-007: order-of-checks test |
| Risk | Tier 3 audit double-counts mirrored agents | Inflated total | Unique-by-name + `mirrored: N` annotation |
| Risk | Codex TOML parsing | Audit silently skips Codex agents | Use `tomllib` stdlib; explicit unit test |
| Dependency | Spec-folder validate.sh strict mode accepts Level 1 packets | Cannot complete | Mirror packets 083/084 structure |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

_(none — all design choices captured in plan.md)_

<!-- /ANCHOR:questions -->

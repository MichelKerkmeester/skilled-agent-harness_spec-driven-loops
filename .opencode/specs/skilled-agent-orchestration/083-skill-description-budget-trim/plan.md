---
title: "Implementation Plan: Skill Description Budget Trim"
description: "Step-by-step plan for trimming 16 skill + 23 command frontmatter descriptions to fit Claude Code's default 8,000-char skill-metadata budget."
trigger_phrases:
  - "skill description"
  - "plan"
  - "trim"
  - "budget"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/083-skill-description-budget-trim"
    last_updated_at: "2026-05-06T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored: scripted single-pass rewrite with explicit old/new pairs"
    next_safe_action: "Execute trim scripts (T004/T005)"
    blockers: []
    key_files:
      - "/tmp/trim-skill-descriptions.py"
      - "/tmp/trim-command-descriptions.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-083"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Description Budget Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML frontmatter (Markdown headers) |
| **Files** | 16 SKILL.md + 23 command .md (39 total, all in `.opencode/`) |
| **Tooling** | Python in-place rewriter, awk audit |
| **Validation** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` |

### Overview
Mechanical metadata trim. For each frontmatter, replace the existing `description:` value with a tighter version that retains routing keywords (skill name token, primary verb, primary domain noun) and drops product enumerations, parenthetical jargon, and marketing prose. Targets: ≤130 chars per skill, ≤110 chars per command. Combined target: ≤5,600 chars (leaves ≥2,400 for Claude Code built-ins under the default 8,000 budget).

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Audit confirms current totals exceed default budget
- [x] Per-file targets defined
- [x] Risk: routing-keyword loss enumerated and mitigated

### Definition of Done
- [x] All 16 skill descriptions ≤130 chars
- [x] All 20 command descriptions ≤110 chars (3 already short, untouched)
- [x] Combined sum ≤5,600 chars
- [x] Skill advisor still ranks each trimmed skill on its primary keyword
- [x] `validate.sh --strict` passes

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-pass scripted rewrite — no plan-state, no rollback complexity needed. Each file is read, the exact `description:` line replaced, written back.

### Key Components
- **`/tmp/trim-skill-descriptions.py`** — applies 16 skill rewrites with explicit old→new pairs
- **`/tmp/trim-command-descriptions.py`** — applies 20 command rewrites with explicit old→new pairs
- **Audit script** (inline awk) — sums frontmatter description bytes, asserts ≤5,600

### Data Flow
1. Audit current totals (skill + command).
2. Define per-file old/new mapping (no regex — explicit string replace).
3. Read file, assert old line is unique, replace, write.
4. Re-audit. Confirm `TOTAL ≤ 5,600`.
5. Spot-check 3 trimmed descriptions retain primary keyword.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffold (`spec.md`, `plan.md`, `tasks.md`)
- [x] Audit script written and run on baseline (~7,646 chars combined)
- [x] Per-file trim targets calculated

### Phase 2: Core Implementation
- [x] 16 skill descriptions trimmed via `/tmp/trim-skill-descriptions.py`
- [x] 20 command descriptions trimmed via `/tmp/trim-command-descriptions.py`
- [x] 3 commands left untouched (already ≤110: `memory/learn`, `memory/save`, `agent_router`)

### Phase 3: Verification
- [x] Re-audit total: 4,423 chars (1,177-char headroom under 5,600 target)
- [x] Harness reminder confirms all 49 visible skills now show trimmed descriptions
- [x] `validate.sh --strict` passes
- [x] `implementation-summary.md` written
- [x] Memory save via `generate-context.js`

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Audit | Sum description bytes across 39 files | awk one-liner |
| Smoke | All 49 visible skills shown after trim | Claude Code session start reminder |
| Routing | sk-prompt advisor ranks `sk-prompt` on prompt-engineering query | live skill-advisor hook |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `system-spec-kit` validate.sh | Internal | Green | Blocks completion claim |
| Claude Code default budget (8,000) | External | Green | Defines target; no env override |
| Skill advisor hook | Internal | Green | Verifies routing still works |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill advisor stops ranking a trimmed skill on its primary keyword, OR validate.sh fails
- **Procedure**:
  1. `git checkout HEAD -- .opencode/skill .opencode/command` (revert frontmatter)
  2. Re-run audit to confirm baseline restored
  3. Re-add `SLASH_COMMAND_TOOL_CHAR_BUDGET=16000` env var as interim fix
  4. Open follow-on packet to design more careful per-skill trims

<!-- /ANCHOR:rollback -->

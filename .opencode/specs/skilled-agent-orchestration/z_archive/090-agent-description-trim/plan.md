---
title: "Implementation Plan: Agent Description Trim"
description: "Single-pass scripted trim of 6 agent descriptions across 4 runtime mirrors (YAML + TOML)."
trigger_phrases:
  - "090 plan"
  - "agent trim plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/090-agent-description-trim"
    last_updated_at: "2026-05-06T14:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Run trim script"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-090"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Description Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **File types** | YAML frontmatter (`.md` files in 3 runtime dirs) + TOML (`.codex/agents/*.toml`) |
| **Edit count** | 6 agents × 4 mirrors = 24 files |
| **Tooling** | Single Python script with regex-based find-replace per file format |

### Overview
Mechanical metadata edit. For each of 6 agents, the same trim text replaces the existing description value across all 4 runtime mirrors. Script-driven (not hand-written) so YAML/TOML format differences and minor pre-existing text drift between runtimes are handled uniformly.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] /doctor:skill-budget audit confirmed which 6 agents are over-soft
- [x] Trim text designed for each agent (≤110 chars, name token preserved)
- [x] Runtime mirror map verified (4 surfaces per agent)

### Definition of Done
- [x] All 24 files edited
- [x] `audit_descriptions.py --json` reports headroom ≥ 0 under 5,600 ceiling
- [x] No `OVER-SOFT` agents remain
- [x] validate.sh --strict PASSES on the spec folder

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Script-driven find-replace. Each agent has one canonical trim string. The script applies it to all 4 surfaces, formatting per file type.

### Key Components
- `/tmp/trim-agent-descriptions-090.py` — the single-pass rewriter (created at run time, not committed)
- `audit_descriptions.py` — pre/post audit verification

### Trim text designs

| Agent | Current chars | New chars | New text |
|-------|--------------:|----------:|----------|
| `debug` | 306 | 95 | `User-invoked fresh-perspective debugger: 5-phase root-cause methodology, never auto-dispatched.` |
| `multi-ai-council` | 179 | 96 | `Multi-AI council planning architect: diverse AI lenses, multi-round deliberation, plans only.` |
| `code` | 178 | 94 | `Application-code implementation specialist via sk-code. LEAF, dispatched only by @orchestrate.` |
| `deep-review` | 158 | 86 | `LEAF deep-review iteration agent: one dimension/pass, P0/P1/P2 findings, JSONL state.` |
| `prompt-improver` | 145 | 92 | `Prompt-improver specialist: framework selection, CLEAR validation, dispatch-ready packages.` |
| `orchestrate` | 134 | 93 | `Senior orchestration agent: task decomposition, delegation, quality eval, delivery synthesis.` |

Total savings: ~545 chars across the 4 runtime mirrors counted as one (since the audit reports unique-by-name, not per-surface). Project total: 6,086 → ~5,541. Headroom under 5,600: ~59 chars.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffolded
- [x] Audit confirmed 6 over-soft agents
- [x] Trim text designed

### Phase 2: Core Implementation
- [x] Write trim script `/tmp/trim-agent-descriptions-090.py`
- [x] Apply trims to 24 files (6 agents × 4 mirrors)

### Phase 3: Verification
- [x] Re-run `/doctor:skill-budget` audit; confirm headroom ≥ 0
- [x] Spot-check 3 agents retain name token
- [x] validate.sh --strict
- [x] Write implementation-summary.md
- [x] Save context

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Audit | Project total under 5,600 ceiling | `audit_descriptions.py --json` |
| Smoke | Each trimmed description retains agent name token | grep |
| Validation | Spec folder strict-validate | `validate.sh --strict` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `audit_descriptions.py` (packet 086) | Internal | Green | Cannot verify post-trim state |
| `tomllib` (Python 3.11+) | External | Green | TOML parser fallback exists |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor regression on any of the 6 trimmed agents
- **Procedure**:
  1. `git checkout HEAD -- .opencode/agent .claude/agents .gemini/agents .codex/agents`
  2. Re-run audit to confirm baseline restored
  3. Open follow-on packet to redesign trims that lost routing keywords

<!-- /ANCHOR:rollback -->

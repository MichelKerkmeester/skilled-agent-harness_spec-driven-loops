---
title: "Implementation Plan: 17-skill README refinement"
description: "Phase A audit + Phase C wave-of-4 cli-devin remediation pattern + Phase D commit."
trigger_phrases:
  - "006 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-documentation/006-skill-readme-refinement-survey"
    last_updated_at: "2026-05-16T13:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 4-phase plan"
    next_safe_action: "Strict-validate and commit"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0060000000000000000000000000000000000000000000000000000000000007"
      session_id: "006-skill-readme-refinement-plan"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 17-Skill README Refinement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | cli-devin SWE 1.6 + sk-doc validation |
| **Storage** | n/a (doc edits only) |
| **Testing** | grep sweeps + strict-validate |

### Overview
cli-devin audits the 17 READMEs in a single dispatch, emits a structured JSON+MD report, then remediates per skill in waves of 4 parallel dispatches. The strict zero-table rule applies to §1 OVERVIEW across all 17. Em dashes go to 0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Plan-time inventory: 17 audit targets identified
- [x] Refinement criteria locked (cross-skill, §1 tables, em dashes, banned words, frontmatter)
- [x] Wave plan agreed (4+4+4+3)

### Definition of Done
- [x] Audit report at `research/audit-report.{json,md}`
- [x] All 17 READMEs at em=0, §1 tables=0
- [ ] Strict-validate child 006 exits 0
- [ ] Commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit + parallel-wave remediation. cli-devin SWE 1.6 with per-skill agent-config that pins write access to a single README path.

### Key Components
- `agent-config-deep-research-iter.json` recipe template with `<repo-root>` + `<packet-root>` substitution
- Per-skill render script at `research/prompts/render_remediation.sh`
- Per-skill recipe pins `Write(<target-README>)` only
- Bundle verification gate via grep-verifiable literal citations

### Data Flow
Audit dispatch → JSON+MD report → per-skill remediation prompts → 4 parallel dispatches per wave → per-skill grep verification → next wave.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Render audit prompt + recipe at `research/prompts/audit.md` and `agent-config-audit.json`
- [x] Confirm devin auth + 17-skill inventory

### Phase 2: Core Implementation
- [x] Phase A: cli-devin audit dispatch, ~100s wall-clock; report emitted
- [x] Phase B: operator review; 3 skills incorrectly classified by audit (sk-git, sk-prompt, mcp-coco-index)
- [x] Phase C Wave 1: cli-devin, cli-opencode, cli-codex, cli-claude-code
- [x] Phase C Wave 2: cli-gemini, sk-code, sk-code-review, sk-doc (sk-doc failed; serial retry succeeded)
- [x] Phase C Wave 3: deep-agent-improvement, deep-review, deep-ai-council, deep-research
- [x] Phase C Wave 4: mcp-chrome-devtools, mcp-coco-index, mcp-code-mode
- [x] Phase C Wave 5 (cleanup): mcp-coco-index v2 + sk-git v2 + sk-prompt v2

### Phase 3: Verification
- [x] All 17 READMEs verified em=0, §1 tables=0
- [ ] Strict-validate child 006 exits 0
- [ ] Implementation-summary filled with evidence
- [ ] Commit on main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Em-dash grep | Each touched README | `grep -c '—'` |
| §1 table grep | Each touched README | `awk` + `grep -c '^|'` |
| Banned-word grep | Each touched README | `grep -niE` (covered by audit) |
| Strict-validate | Child 006 packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin auth | External | Logged in | Required for dispatch |
| `agent-config-deep-research-iter.json` | Internal | Present | Recipe template |
| sk-doc HVR rules | Internal | Stable | Banned-word source-of-truth |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh fails or em/§1-table sweep still has hits
- **Procedure**: `git checkout -- <files>` per touched README; packet folder stays for re-attempt
<!-- /ANCHOR:rollback -->

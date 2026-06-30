---
title: "Verification Checklist: cli-devin skill [template:level_2/checklist.md]"
description: "Verification Date: 2026-05-15"
trigger_phrases:
  - "cli-devin checklist"
  - "104 verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/084-cli-devin-creation"
    last_updated_at: "2026-05-15T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author checklist.md"
    next_safe_action: "Verify P0/P1 evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "104-cli-devin-init"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Verification Checklist: cli-devin skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Evidence format: `[EVIDENCE: <file>:<lines> — <one-line note>]`. P0 items MUST have evidence before claiming completion.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — `[EVIDENCE: spec.md §4 REQ-001 through REQ-014]`
- [x] CHK-002 [P0] Technical approach defined in plan.md — `[EVIDENCE: plan.md §3 Architecture, §4 Implementation Phases]`
- [x] CHK-003 [P1] Family contract dependencies inventoried — `[EVIDENCE: spec.md §3 Files to Change; plan.md §6 Dependencies]`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] SKILL.md has exactly 8 top-level sections matching family order — `[EVIDENCE: grep -c '^## ' .opencode/skills/cli-devin/SKILL.md returns 8]`
- [x] CHK-011 [P0] No SKILL.md placeholders remain unfilled — `[EVIDENCE: SKILL.md grep returns no [name]/[NAME]/[placeholder] hits]`
- [x] CHK-012 [P1] Self-invocation guard pseudocode present with DEVIN_* env, ancestry, and lockfile layers — `[EVIDENCE: SKILL.md §2 Self-Invocation Guard]`
- [x] CHK-013 [P1] Default Invocation copy-paste block uses concrete devin flags — `[EVIDENCE: SKILL.md §3 Default Invocation]`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict spec validation passes — `[EVIDENCE: bash validate.sh --strict exits 0 — see implementation-summary.md §5 Verification]`
- [x] CHK-021 [P0] Sibling edge symmetry verified — `[EVIDENCE: jq '.edges.siblings[].target' on 4 siblings | grep -c cli-devin returns 4]`
- [x] CHK-022 [P1] cloud_handoff.md at least 100 LOC with operator gate — `[EVIDENCE: wc -l returns 180; §3 5-check gate present]`
- [x] CHK-023 [P1] cli_reference.md documents all 12+ top-level commands and 12 slash commands — `[EVIDENCE: cli_reference.md §3 Subcommand Map, §7 Interactive Slash Commands]`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each REQ has a finding class (here: pure additive — no existing-code mutation beyond 4 sibling graph-metadata edge additions) — `[EVIDENCE: spec.md §3 Files to Change clearly tags Create vs Modify]`
- [x] CHK-FIX-002 [P0] Same-class producer inventory: 4 sibling cli-* skills inventoried as the family contract source — `[EVIDENCE: plan.md §3 Architecture cites 4 sibling skills]`
- [x] CHK-FIX-003 [P0] Consumer inventory: skill-advisor, graph traversal, system-skill-advisor manifest checked — `[EVIDENCE: cli-devin auto-discovered by skill advisor on next session boot per system-reminder during authoring]`
- [x] CHK-FIX-004 [P0] Adversarial cases for self-invocation guard documented — `[EVIDENCE: SKILL.md §2 lists env var, process ancestry, lockfile layers + cloud-handoff exception]`
- [x] CHK-FIX-005 [P1] Matrix axes listed: (model × permission-mode) — `[EVIDENCE: SKILL.md §3 Model Selection, agent_delegation.md §3 Routing Matrix]`
- [x] CHK-FIX-006 [P1] Hostile env variant: SKILL.md §2 guard checks both env and process ancestry, not env alone — `[EVIDENCE: SKILL.md §2 layered guard]`
- [x] CHK-FIX-007 [P1] Evidence pinned to file paths within this commit — `[EVIDENCE: implementation-summary.md §2 file table with LOC + this file's CHK evidence anchors]`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — `[EVIDENCE: grep for 'sk-' / 'token=' / 'api_key' in cli-devin/* returns no matches]`
- [x] CHK-031 [P0] Token-handling guidance present without including tokens — `[EVIDENCE: SKILL.md RULES NEVER #5; cli_reference.md §4 Provider Auth Pre-Flight points at devin auth login + URL only]`
- [x] CHK-032 [P1] Permission-mode escalation gate enforced — `[EVIDENCE: SKILL.md RULES ALWAYS #3 + NEVER #1; cloud_handoff.md §3 5-check gate]`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/implementation-summary synchronized — `[EVIDENCE: cross-file refs in tasks.md cross-refs anchor; implementation-summary.md §4 verification table]`
- [x] CHK-041 [P1] References cross-link properly — `[EVIDENCE: README.md §9 Related Documents links each reference; SKILL.md §5 References mirrors family shape]`
- [x] CHK-042 [P2] README.md present with family-standard 9-section TOC — `[EVIDENCE: cli-devin/README.md TOC anchor]`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files left in scratch/ — `[EVIDENCE: no scratch/ directory in cli-devin/; only family-standard subdirs]`
- [x] CHK-051 [P1] Directory shape matches family contract — `[EVIDENCE: find .opencode/skills/cli-devin -maxdepth 1 -type d shows {references, assets, changelog, manual_testing_playbook}]`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-15
<!-- /ANCHOR:summary -->

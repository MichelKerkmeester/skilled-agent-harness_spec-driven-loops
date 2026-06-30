---
title: "Resource Map: sk-design parent track"
description: "Path ledger for the sk-design parent track after deep-review remediation."
trigger_phrases:
  - "sk-design parent resource map"
  - "154 resource map"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/resource-map"
    last_updated_at: "2026-06-30T00:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Recorded parent track resource paths touched during deep-review remediation"
    next_safe_action: "Use the parent spec and child packets as source of truth"
    blockers: []
    key_files:
      - ".opencode/specs/design/008-sk-design-parent/spec.md"
      - ".opencode/specs/design/008-sk-design-parent/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "resource-map/remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map: sk-design parent track

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 10 grouped rows
- **By category**: Documents=7, Specs=3
- **Missing on disk**: 0
- **Scope**: parent track files and child phase families touched or audited during the deep-review remediation
- **Generated**: 2026-06-30T00:00:00+02:00

Action vocabulary: `Created`, `Updated`, `Analyzed`, `Moved`, `Validated`.
Status vocabulary: `OK`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 1. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/design/008-sk-design-parent/spec.md` | Updated | OK | parent status, phase map, and handoff table reconciled |
| `.opencode/specs/design/008-sk-design-parent/042-design-work-deep-review/spec.md` | Created | OK | documented existing review phase |
| `.opencode/specs/design/008-sk-design-parent/042-design-work-deep-review/plan.md` | Created | OK | review packet plan |
| `.opencode/specs/design/008-sk-design-parent/042-design-work-deep-review/tasks.md` | Created | OK | review packet task ledger |
| `.opencode/specs/design/008-sk-design-parent/042-design-work-deep-review/implementation-summary.md` | Created | OK | review packet summary |
| `.opencode/specs/design/008-sk-design-parent/045-design-command-upgrade/*.md` | Updated | OK | scaffold replaced with planned packet docs |
| `.opencode/specs/design/008-sk-design-parent/039-design-enforcement-build/**` | Updated | OK | old research slug references now point to phase 044 |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 2. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/` | Moved | OK | renumbered from duplicate 037 |
| `.opencode/specs/design/008-sk-design-parent/045-design-command-upgrade/` | Moved | OK | renumbered from duplicate 041 |
| `.opencode/specs/design/008-sk-design-parent/040-design-playbook-filename-denumbering/spec.md` | Updated | OK | stale session id replaced |
<!-- /ANCHOR:specs -->

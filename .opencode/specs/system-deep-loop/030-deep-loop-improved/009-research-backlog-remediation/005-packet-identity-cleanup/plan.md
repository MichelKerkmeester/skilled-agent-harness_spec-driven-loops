---
title: "Implementation Plan: Packet Identity Cleanup"
description: "Plan for fixing live old-packet-name references and removing the stale native review lock."
trigger_phrases:
  - "packet identity cleanup plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/005-packet-identity-cleanup"
    last_updated_at: "2026-07-01T07:40:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Packet Identity Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`grep -rln "123-agent-loops-improved\|156-agent-loops-improved" .opencode/specs/system-deep-loop/030-deep-loop-improved/` (excluding `research_archive/`) surfaces 16 files. Read each one's actual hit line in context, classify LIVE (a `Parent Spec:`/`Successor:`/`Predecessor:` table row, or any field a `/speckit:resume` or navigation flow would follow) vs HISTORICAL (changelog prose, timeline.md commit descriptions, the archived review-report.md documenting what a past session literally produced). Fix only LIVE hits. Separately, delete `review/lineages/native/.deep-review.lock` and `git mv`/relocate the `native/` folder to an archive path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- No HISTORICAL file's prose content changes.
- `validate.sh` still passes on every touched phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Classify before editing, don't blind find-replace.** A repo-wide sed would rewrite changelog history, which is explicitly wrong (changelogs document what actually happened).
- **Archive the native lineage, don't delete it.** It has near-zero content (one config, one empty iteration) but archiving costs nothing and preserves the audit trail.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Grep and classify all 16 hits (LIVE vs HISTORICAL), with one line of reasoning per file.
2. Fix the LIVE hits only.
3. Remove the stale native lock; archive the `native/` lineage folder.
4. Validate each touched phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. Re-run the grep after the fix — confirm zero hits remain in LIVE navigational fields specifically (not zero hits overall, since historical files intentionally keep them).
2. `validate.sh` on each touched folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The archived native/ folder move can be reversed with `git mv` back; nothing destructive happens (no `rm -rf`, just the one lock file deletion which is trivially recreatable/irrelevant).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `030-deep-loop-improved/{001..007}/spec.md` (LIVE hits only) | Fix navigational fields |
| `review/lineages/native/` | Archive |
<!-- /ANCHOR:affected-surfaces -->

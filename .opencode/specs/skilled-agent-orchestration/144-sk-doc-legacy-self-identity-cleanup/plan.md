---
title: "Implementation Plan: sk-doc Legacy Self-Identity Cleanup [skilled-agent-orchestration/144-sk-doc-legacy-self-identity-cleanup/plan]"
description: "Planned approach to normalize the 258 pre-existing non-resolving self-identity references in the sk-doc track's nested docs."
trigger_phrases:
  - "sk-doc self-identity cleanup plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-sk-doc-legacy-self-identity-cleanup"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Backlog plan authored"
    next_safe_action: "Schedule the cleanup pass when a worktree is available"
    blockers: []
    completion_pct: 0
    status: "Planned"
---
# Implementation Plan: sk-doc Legacy Self-Identity Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

A read-first, self-identity-only rewrite pass over the sk-doc tree: enumerate every non-resolving self-identity field with the comprehensive any-prefix resolver, map each to its doc's current on-disk `sk-doc/NNN-…` path, rewrite in place, and verify resolution + regression-neutral validation. Deferred backlog work; no scheduling commitment yet.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: comprehensive detector = 0 non-resolving self-identity refs in sk-doc canonical docs.
- **Gate B**: occurrence-count parity on unrelated tokens vs pre-cleanup baseline.
- **Gate C**: `validate.sh --strict --recursive` regression-neutral-or-better.


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Detector**: the comprehensive self-identity-vs-disk resolver from 143 (resolves refs of ANY prefix against the full specs tree, excludes `context-index.md` + frozen transcripts).
- **Mapping**: each non-resolving field's correct value is its own doc's current folder path (derivable from the file location), so the rewrite is deterministic per file.
- **Guardrail**: pre-existing-vs-collateral judged by token occurrence-count parity vs a captured baseline.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `.opencode/specs/sk-doc/**` canonical docs (self-identity fields only). No runtime code, no cross-tree edits.


<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Capture baseline (detector count + validate error count + token occurrence table).
2. Rewrite self-identity fields per file to the current on-disk path.
3. Verify: detector = 0; occurrence parity; validate regression-neutral.
4. Record + land behind operator approval.


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Comprehensive detector run to 0.
- Occurrence-count diff of unrelated tokens (must be zero-delta).
- `validate.sh --strict --recursive` vs captured baseline (error count).


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-git` worktree allocator; `system-spec-kit` validators; the 143 comprehensive self-identity resolver.


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work in an isolated worktree; `git worktree remove` + branch delete reverts before push; single `git revert` after. No DB mutation.


<!-- /ANCHOR:rollback -->
---

## RELATED DOCUMENTS

- **Spec**: `spec.md`
- **Tasks**: `tasks.md`

---

---
title: "Plan: Post-Review Remediation of the sk-design Remediation Program"
description: "Plan for fixing the verified 017-review findings: correct stale _db/_engine current-state references in the styles playbook, database README, 015 phase-map, and graph-metadata pointers, while preserving historical records and shipped code behavior."
trigger_phrases:
  - "post review remediation plan"
  - "fix stale db engine paths plan"
  - "017 findings remediation approach"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/005-reviews-and-remediation/004-post-review-remediation"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "remediation"
    recent_action: "Executed the pointer + doc fixes per this plan."
    next_safe_action: "Validate + commit."
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-sk-design-program/005-reviews-and-remediation/004-post-review-remediation-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: Post-Review Remediation of the sk-design Remediation Program

<!-- ANCHOR:summary -->
## 1. SUMMARY

Apply the four verified doc/metadata fixes on a fresh worktree at the origin tip (the primary tree was
concurrently dirty and behind). The governing discipline: separate genuine stale **pointers** (current-state
references that should point at the moved files) from **historical records** (what a packet did at its
time), fixing only the former. Verify each finding against the code before acting — which turned P1-006
from a fix into a documented refutation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Zero residual `_db`/`_engine` references in the playbook + database README; every rewritten path resolves.
- The three flagged graph-metadata files carry 0 dead paths.
- The four edited packets validate `--strict` with 0 errors.
- No `.mjs`/`.ts`/`.js` file staged — docs + metadata only.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The staleness is a single class rooted in `005-library-restructure` (`_db → lib/database`, `_engine →
lib/engine`, `_db/oracle → tests/oracle`). Current-state references live in three surfaces: user-facing
docs (playbook, database README), the `015` parent phase-map, and the generated `graph-metadata.json`
`key_files` (derived from each packet's frontmatter continuity). Historical narration lives in the
packet bodies and is out of bounds.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `styles/docs/manual-testing-playbook.md` | `_db`/`_engine` paths + test globs → `lib/*`/`tests/*` |
| `styles/lib/database/README.md` | operator commands + tree refs → current paths |
| `015/spec.md` | phase-map statuses + parent continuity |
| `015/001`, `015/004` docs | `key_files` continuity pointers |
| `012`/`015`/`001`/`004` graph-metadata + description | regenerated |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Setup** — confirm target files unchanged since the review HEAD; create the fresh worktree at origin tip.
2. **Docs** — fix the playbook + database README paths; verify every new path resolves.
3. **Metadata** — fix the phase-map + `key_files` pointers; regenerate graph-metadata + descriptions.
4. **Verify** — check P1-006 against code + tests (refute, no change); confirm history preserved; author + validate this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code changed, so there is no behavior to unit-test. Verification is: `grep` for residual `_db`/`_engine`
(expect 0), on-disk resolution of every rewritten path, and `validate.sh --strict` on the four edited
packets (expect `Errors: 0`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The `017` review record supplies the verified findings.
- The spec-kit metadata generators (`generate-description.js`, `backfill-graph-metadata.js`) regenerate the derived files.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are docs + metadata in a single commit on an isolated worktree branch. Rollback is `git revert`
of that commit; no runtime state, no code, and no default behavior is touched.
<!-- /ANCHOR:rollback -->

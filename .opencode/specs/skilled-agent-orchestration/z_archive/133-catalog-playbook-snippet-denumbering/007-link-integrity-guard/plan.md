---
title: "Implementation Plan: Markdown-Link Integrity Guard [133/007/plan]"
description: "Build a repo-wide markdown-link resolver as a CI gate (green-on-current-tree via narrow exclusions + allowlist), wired to fail PRs that introduce broken markdown links across skills/commands/agents."
trigger_phrases:
  - "133 phase 007 plan"
  - "markdown link guard plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/007-link-integrity-guard"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 007 plan"
    next_safe_action: "None; guard built + verified"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Markdown-Link Integrity Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

A Node guard (`check-markdown-links.cjs`) walks active skills/commands/agents docs, resolves every relative markdown link against the file dir OR repo root, and exits non-zero on any non-excluded broken link. A CI workflow runs it on PRs that touch the doc trees. Exclusions (changelog, test fixtures) + a narrow `(file, ref)` allowlist keep it green today while catching new breakage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Green on the current tree: `node check-markdown-links.cjs` → exit 0, 0 broken.
- Catches breakage: injected `](missing.md)` → exit 1.
- `validate.sh --strict --recursive` green on the 133 parent including this child.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Resolver lifted from the validated `review/baseline/link-audit.cjs`: fenced-code strip, `](...)` + `[id]:` extraction, dual-base resolution, `%20` decode. Standalone (node stdlib only). Whole-repo walk — not changed-files — because a deleted target breaks unchanged referrers. CI invokes it via `actions/setup-node` (the only deviation from the bash/python3 house gates; chosen to reuse the validated resolver).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Effect |
|---------|--------|
| `system-spec-kit/scripts/check-markdown-links.cjs` | New guard (complements `check-links.sh` wikilink checker) |
| `.github/workflows/markdown-link-integrity.yml` | New CI gate |
| PR authors | A PR that deletes/moves a linked target without updating referrers now fails |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

1. Build the guard (resolver + exclusions + allowlist); verify green.
2. Negative-test (inject broken link → exit 1); add the CI workflow.
3. Spec docs + validate + scoped commit/push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- Run guard on current tree (expect 0 broken).
- Inject a broken link in a scanned doc (expect exit 1 + the link named); revert.
- Confirm an allowlisted placeholder is not flagged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- `node` (CI provides via `actions/setup-node`; local runs use system node).
- Resolver semantics from `review/baseline/link-audit.cjs`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Delete the workflow + guard script (no runtime/data effect; the guard is read-only and CI-only).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on Phase 1 (guard exists + green). Phase 3 depends on Phase 2 (workflow present). No external blockers.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT

| Item | Estimate |
|------|----------|
| Guard script | ~130 LOC (resolver reuse) |
| CI workflow | ~25 LOC |
| Spec docs | Level-2 set |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Single revert of the two created files restores prior behavior exactly; no migration, no state, no data. The allowlist lives inside the guard, so removing the guard removes the allowlist too.
<!-- /ANCHOR:enhanced-rollback -->

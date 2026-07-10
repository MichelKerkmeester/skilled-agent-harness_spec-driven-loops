---
title: "Implementation Summary: Doc-Truth, Completion-Claim & Runtime-Mirror Reconciliation"
description: "Planning-only status for this remediation sub-phase: 42 findings carried as tasks; no fixes applied yet."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/006-doc-truth-completion-and-mirrors"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "35 doc-truth/mirror findings fixed/refuted; 7 deferred to a code phase"
    next_safe_action: "Code phase handles deferred T022/T024-T027/T031/T032 + T042 wiring"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Doc-Truth, Completion-Claim & Runtime-Mirror Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — 35 fixed/refuted, 7 deferred to a code phase |
| **Date** | 2026-06-16 |
| **Findings carried** | 42 (35 resolved here; 7 `[B]` deferred — production `.ts`/`.cjs`, out of doc-truth scope) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Doc-truth, completion-claim, and runtime-mirror reconciliation across the 027 epic. Each of the 42 findings (registry: `../../../review/fresh-regression-75/deep-review-findings-registry.json`) was re-verified against the live repo before action; true findings were fixed, false ones refuted-with-reason, and code-class findings deferred.

**Fixed (doc-truth/mirror):**
- Completion-claim drift: 000-release-cleanup phase map (+000-spec-tree-consolidation row), root + 001-research-and-doctrine track statuses → Complete, 005 parent rows 002/004 → Complete, 002-tri-system spec status → Complete + impl-summary Spec Folder `028`→`002`, 004-residual frontmatter reconciled to 90%, 009 RSS pass marked superseded (plan+tasks), 013 final gates checked with recorded evidence (tasks+checklist+plan, P0 8/8 P1 7/7), 014 CHK-021 flag-on 10→12 tests, 002-tri plan DoD checked, 001-finding-remediation downgrade census 63→57 (P1 column now sums to 132).
- Catalog/playbook: feature_catalog tool count 37→39 (root + CLI catalog + ownership-lint wording + 16--tooling children + 17--governance playbook + skill SKILL.md/README), dead `spec_kit_*`→`speckit_*` asset links (3 catalog files), playbook scenario count 410→407 (README exclusion + orphan baseline 85→82), PARTIAL taxonomy reconciled (aggregate-only), feedback-retention off-mode baseline-delete wording.
- Doctrine/contract: CONTINUITY_FRESHNESS warn-vs-block doc corrected (validation_rules.md + AGENTS.md/CLAUDE.md + peck impl-summary), Gate B REQ-005 amended to orchestrator/contract-owned (gem-team spec; resolves both T011 and T037; 15/15 P0 now truthful), reviewer-benchmark-substrate stale paths corrected, reviewer-regression.json profile created + referenced, MB-R01 scenario file created, agent-io-contract §7 Evidence-Group representation note, RSS headline normalized to ~687MB/136.5MB, fabricated `sha256:1111…` fingerprint → canonical zero sentinel, parent before-vs-after/timeline allowlist carve-out.
- Runtime mirrors: `.claude/agents/deep-review.md` + `review.md` Path Convention `.opencode`→`.claude`; `.codex/agents/orchestrate.toml` self-ref `orchestrate.md`→`orchestrate.toml`.
- Comment-hygiene: doctor_update.yaml phase-id `TODO(022)` label removed (logic unchanged).

**Refuted (kept as corrected docs):** T014 (run-benchmark `--scorer reviewer` warns-then-falls-back by design), T016/T017/T018 (three research P0s — source-kind guards + scrubber already exist in live code; research.md §1 records the refutation with corrected coordinates).

**Deferred to a code phase ([B], out of doc-truth scope):** T022, T024, T025, T026, T027, T031, T032 (production `.ts`/`.cjs` owned by phases 001-004); T042's optional code-wiring (`resolveActiveProfileDbPath`).

**No-doc-action:** T041 (forward-looking commit-hygiene process advice; no shipped-state change required).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per `plan.md`: for each finding, opened the cited file:line, confirmed the claim against the live repo (some asserted findings proved false), then fixed true findings, refuted false ones with corrected coordinates, and deferred code-class findings. Citation-heavy verifications (the 3 research P0s, CONTINUITY_FRESHNESS behavior, 013/014 evidence) were cross-checked against live source before any edit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Per operator directive, every finding is carried (refuted as hardening, asserted fix-as-stated).
- Fixes mirror existing correct sibling patterns where available.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every spec folder whose canonical docs were edited was re-validated with `validate.sh --strict` and kept green: this sub-phase; epic root; 000-release-cleanup (+005-mcp-cli-stress-tests); 001-research-and-doctrine (+001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate, /006-peck-verification-discipline; +002-gem-team-adoption/002-scoped-preexec-and-handoff-gates); 002-memory-store-and-search/009, /010, /013, /014; 005-verification-and-remediation (+001-finding-remediation, /002-tri-system-deep-research, /004-residual-design-units). Mirror parity confirmed by diffing `.claude`/`.codex` Path-Convention/self-reference lines against each runtime's own path. The deep-improvement reviewer-regression profile was JSON-validated and its 4 fixtures confirmed to resolve. doctor_update.yaml re-parsed as valid YAML after the comment edit.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- 7 findings (T022/T024/T025/T026/T027/T031/T032) and T042's optional code-wiring are deferred: they need production `.ts`/`.cjs` edits owned by sibling code phases 001-004 and are outside this doc-truth phase's scope lock.
- Pure JSON metadata (description.json/graph-metadata.json) was not edited (phase 005 owns it). Where a fixed markdown status implies a derived-status update (e.g. 002-tri-system graph-metadata `derived.status: in_progress`), that JSON refresh is a phase-005 follow-on; the canonical markdown is now correct.
- The 37→39 tool-count fix was applied to the cited catalog + ownership-lint + current-state skill docs; the immutable changelog `v3.5.0.5.md` (shipped at 37) was intentionally left as historical record.
- The PARTIAL per-scenario taxonomy fix corrected the root playbook + the one cited example; ~12 other scenario files still phrase a per-scenario `PARTIAL` and are a noted follow-up sweep (root taxonomy is now self-consistent).
<!-- /ANCHOR:limitations -->

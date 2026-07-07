---
title: "Phase 2: sk-code-review uplift (M-1 PR state dedup + M-2 min-evidence gate)"
description: "Add PR state dedup (skip re-review if commit+diff content-hash unchanged) and OPT-IN min-evidence gate (skip review if changed-line count below threshold) to sk-code-review. Both reduce wasted review compute on no-op rebases and trivial diffs."
trigger_phrases:
  - "m1 pr state dedup"
  - "m2 min-evidence gate"
  - "sk-code-review uplift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/013-sk-code-review-uplift"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "claude-opus-4-7-110-scaffold"
    recent_action: "phase_2_spec_scaffolded_awaiting_council"
    next_safe_action: "await_council"
    blockers:
      - "Awaiting council verdict"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-110-002-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: M-1 PR dedup + M-2 min-evidence gate for sk-code-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned — gated on council approval |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Phase Parent** | `110-auto-review-stretch-config-dedup-gates` |
| **Source teachings** | M-1 + M-2 from `106/research/review-report.md` §5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two waste vectors in sk-code-review:
1. **PR re-review on no-op rebases**: rebasing a PR changes commit SHA but not content. Re-running review wastes compute on identical diff.
2. **Trivial-diff reviews**: 1-line typo fixes don't need a full review pass. Currently runs anyway.

### Purpose
Add two opt-in efficiency gates to sk-code-review:
- **M-1 PR state dedup**: signature = sha256(commit_subject + diff_content_hash). If signature unchanged since last review, skip with `Review status: COMMENTED (no changes since last review at <prev-sha>)`.
- **M-2 min-evidence gate** (REVISED per council §10.3): opt-in threshold (env var `SK_CODE_REVIEW_MIN_CHANGED_LINES`, default 0 = disabled) with **conservative skip taxonomy**. If diff has < threshold changed lines AND the diff does NOT touch sensitive paths, skip with `Review status: COMMENTED (skipped: diff below evidence threshold)`. Otherwise full review runs regardless of size.

**M-2 NEVER skip when the diff touches**:
- Security/authentication/authorization (`auth*`, `*-auth-*`, `*permission*`, `*credential*`, `*token*`, `*secret*`)
- Config files (`*.config.*`, `*config*.json`, `*config*.yaml`, `*config*.toml`, `*.env*`)
- Persistence layer (`*.sql`, `*migration*`, `*schema*`, `*db*.ts`, `*repository*`, files under `/db/` or `/migrations/`)
- Dependency manifests (`package.json`, `package-lock.json`, `Cargo.toml`, `pyproject.toml`, `*.lock`)
- Sandboxing / process boundaries (`*sandbox*`, `*subprocess*`, `*exec*`)
- Public-facing responses (`*.handler.ts`, `*-api*`, `*-route*`, files under `/handlers/` or `/routes/`)

**M-2 changed-line counting command**: `git diff --numstat <base-ref>...HEAD | awk '{added+=$1; removed+=$2} END {print added+removed}'` (sums add+remove across all changed files; binary files contribute 0).

Both gates report `COMMENTED` rather than `APPROVED` so downstream tooling knows the review was a no-op skip, not an active green-light.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Edit `sk-code-review` SKILL.md to add §M-1 PR-state-dedup section + §M-2 min-evidence-gate section
- Define signature function: `sha256(commit_subject + git diff --stat output + git diff full body)` (or simpler: just full-diff content-hash)
- Define state-storage path: `.opencode/.sk-code-review-cache/<repo-ref>.jsonl` with signature + timestamp per review
- Add `SK_CODE_REVIEW_MIN_CHANGED_LINES` env-var gate (default 0; >0 enables)
- Both gates default OFF; both surface skip-reason in the `COMMENTED` line

### Out of Scope
- Implementing the actual dedup/gate enforcement code — this is a skill specification; enforcement happens in the agent or dispatcher
- PR-state dedup at the GitHub Action / CI level — out of skill scope
- Cross-repo state sharing — local cache only

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skills/sk-code-review/SKILL.md` | Modify | Add M-1 + M-2 sections with config knobs + signature definition + cache format |
| `.opencode/skills/sk-code-review/references/` | Optional | Add new reference doc `pr_state_dedup.md` if SKILL.md gets too dense |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | M-1 signature function deterministic + content-based | Same diff → same signature regardless of rebase |
| REQ-002 | M-1 cache state at `.opencode/.sk-code-review-cache/` | File exists post-review |
| REQ-003 | M-2 gate is OPT-IN (env-var-driven) | Default behavior unchanged |
| REQ-004 | Both skip cases emit `Review status: COMMENTED` with skip reason | Distinguishable from active APPROVED |
| REQ-005 | Cache cleanup policy documented | Retention: keep last 100 entries per repo-ref |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SKILL.md updated with M-1 + M-2 sections.
- **SC-002**: M-1 signature spec is unambiguous and reproducible.
- **SC-003**: M-2 env-var spec is clear; default OFF preserves current behavior.
- **SC-004**: Strict validate exit 0.
- **SC-005**: Downstream tooling (PR bot integrations) can distinguish APPROVED from COMMENTED-skip via the final-line `Review status:` exact string + skip-reason suffix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Signature collisions across repos (same diff in different contexts) | False dedup skip | Include repo-ref + branch in cache key, not just diff hash |
| Risk | Cache file grows unbounded | Disk waste | Bounded retention: keep last 100 entries, prune older |
| Risk | M-2 threshold misclassifies "small but critical" change (e.g. 1-line security fix) | False-positive PASS | Default OFF; only enabled via explicit env var; document the tradeoff |
| Risk | Cache content includes diff fragments → sensitive code leakage if cache ends up shared | Confidentiality | Cache file in workspace `.opencode/.sk-code-review-cache/` only (per-machine); document not to commit |
| Dependency | git CLI available for diff hash | Cannot compute signature | sk-code-review already relies on git; no new dep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Should signature include the base-branch tip SHA (so review against `main` at SHA-A is distinct from review against `main` at SHA-B)? Council to advise.
2. **Q2**: M-2 should the threshold count include test-file changes? Currently includes all changed lines.
3. **Q3**: Cache pruning — bound by entry count (100) or by age (30 days)? Council to advise.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step |
|---|------|
| 1 | Read sk-code-review SKILL.md to find best insertion point for M-1 + M-2 |
| 2 | Author M-1 PR-state-dedup section: signature spec + cache format + skip behavior |
| 3 | Author M-2 min-evidence-gate section: env-var + threshold default OFF + skip behavior |
| 4 | Update §Output to document COMMENTED-skip suffix conventions |
| 5 | Smoke-test signature determinism (run same diff twice → same hash) |
| 6 | Strict validate + commit + push |
<!-- /ANCHOR:iteration-plan -->

---
title: "Phase 005: Retroactive Rewrite Execution"
description: "Run the 56-iter cli-devin loop, synthesize mapping.jsonl, apply via git filter-repo, verify against Phase 001 baseline. Local-only — no push to origin."
trigger_phrases:
  - "112-retroactive-rewrite-execution"
  - "git filter-repo apply"
  - "commit rewrite execution"
  - "mapping.jsonl synthesis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/004-commit-standards-and-retroactive-rewrite/005-retroactive-rewrite-execution"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded phase 005 execution docs"
    next_safe_action: "Run preflight gate then start backup and 56-iter loop"
    blockers:
      - "Phase 001 evidence must exist and verify"
      - "Phase 002 standards must be locked"
      - "Phase 003 sk-git must be updated (mirror parity)"
      - "Phase 004 agent-config must be promoted to .opencode/skills/cli-devin/assets/"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "rewrites/"
      - "commit-rewrite-state.jsonl"
      - "commit-rewrite-config.json"
      - "mapping.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Force-push to origin? — No, local-only"
      - "Scope? — HEAD only (2,795 commits)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 005: Retroactive Rewrite Execution

<!-- SPECKIT_LEVEL: 1 -->
<!-- NOTE: Upgrade to Level 3 on activation. Pre-staged decision-record.md captures filter-repo invocation pinning. -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (upgrade to 3 on activation) |
| **Priority** | P1 |
| **Status** | Pending (blocked on Phases 001–004) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-cli-devin-rewrite-prompts |
| **Successor** | None — packet close |
| **Handoff Criteria** | All 2,795 HEAD commits rewritten; pre-rewrite baseline recoverable; 5% adversarial sample passes; 24 merge commits preserved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the final phase of the 112 packet. Runs the cli-devin loop authored in Phase 004, synthesizes the rewrite mapping, applies it via `git filter-repo`, and verifies the result against the Phase 001 baseline.

**Scope Boundary**: Local repo state only. **No `git push --force` to origin** (user choice 2026-05-16). The rewritten HEAD lives on `main` locally; the backup branch + bundle preserve the original.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 2,795 HEAD commits do not follow the standard locked in Phase 002. After Phases 003 and 004 ship, the in-repo standards and tooling are aligned, but the history itself is still pre-standard.

### Purpose
Apply the new standard retroactively. Produce a HEAD log that matches the standard, with no commits lost, all merges preserved, and full recoverability if anything goes wrong.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Preflight verification of Phase 001 baseline + Phase 004 agent-config promotion.
- Backup branch creation: `backup/pre-rewrite-YYYYMMDD`.
- Run 56 iterations of cli-devin SWE-1.6 with the pinned agent-config recipe.
- Synthesis pass — consolidate 56 iteration markdowns into single `mapping.jsonl`.
- 5% adversarial sample hand-check (~140 random commits).
- Apply via `git filter-repo --message-callback` reading `mapping.jsonl`.
- Post-rewrite verification: commit count match, merge preservation spot-check, no packet-ID leakage, baseline recoverable.

### Out of Scope

- `git push --force` to origin (user choice — local-only).
- Rewriting commits on the 5 unmerged remote branches.
- Rewriting annotated tag messages.
- Re-running cli-devin against commits that came in after Phase 001 baseline (if drift occurred, recapture baseline first; do not patch in-flight).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `commit-rewrite-config.json` | Create | Per-run config (from Phase 004 template) |
| `commit-rewrite-state.jsonl` | Create | Per-iter state (append-only) |
| `commit-rewrite-strategy.md` | Create | Mutable strategy doc |
| `rewrites/iteration-NNN.md` (× 56) | Create | Per-iter output files |
| `mapping.jsonl` | Create | Final synthesis output |
| `verification-report.md` | Create | Post-rewrite verification |
| Local git refs (HEAD, main) | Mutate | `git filter-repo` rewrites HEAD history |
| `backup/pre-rewrite-YYYYMMDD` ref | Create | Pre-rewrite branch backup |
| `implementation-summary.md` | Update | Fill at phase close |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Preflight gate passes | Phase 001 evidence files exist + verify; Phase 004 agent-config promoted; tooling-pins still match installed versions; HEAD commit count matches baseline (or baseline recaptured) |
| REQ-002 | Backup branch created | `backup/pre-rewrite-YYYYMMDD` exists; `git log backup/pre-rewrite-…` matches `evidence/baseline-log.txt` |
| REQ-003 | Loop converges | All 56 iters complete; `commit-rewrite-state.jsonl` has 56 records; `legalStop=true` set by synthesis |
| REQ-004 | Mapping complete | `mapping.jsonl` has exactly 2,795 entries; zero `needs_human_review` (or operator-cleared) |
| REQ-005 | Adversarial sample passes | 5% random sample (≈140 commits) hand-checked; documented pass rate in `verification-report.md` |
| REQ-006 | filter-repo apply succeeds | `git filter-repo --message-callback` exits 0; no aborts; no warnings about ref divergence |
| REQ-007 | Post-rewrite integrity | `git rev-list --count HEAD` == 2,795 (or baseline-equivalent); 24 merge commits preserved; `git log --pretty=format:'%s' \| head -50` shows no packet-ID leakage |
| REQ-008 | Baseline recoverable | `git bundle verify evidence/pre-rewrite.bundle` passes; `git log backup/pre-rewrite-…` intact |
| REQ-009 | `validate.sh --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 9 REQs pass.
- The HEAD log reads like a well-curated conventional-commit history.
- A future operator can run `git bundle unbundle evidence/pre-rewrite.bundle` to recover the pre-rewrite state if needed.
- No commits lost, no merges flattened, no tag refs broken (annotated tag messages are out-of-scope per parent spec).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Drift between Phase 001 baseline and Phase 005 execution**: new commits may have been added. Mitigation: preflight gate recaptures baseline if `git rev-list --count HEAD` differs.
- **filter-repo flattens merges**: ensure invocation does NOT include `--prune-empty=always`. Document the exact invocation in `decision-record.md` ADR.
- **Operator interrupts mid-apply**: filter-repo writes a new packed history; if interrupted, repo may be in inconsistent state. Mitigation: backup branch + bundle. Recovery procedure documented in `decision-record.md`.
- **mapping.jsonl row mismatch**: callback can't find a hash → commit kept with original message. Mitigation: REQ-004 gate requires count == 2,795 BEFORE apply.
- **Local-only assumption gets violated**: someone runs `git push --force` after the rewrite. Mitigation: parent spec out-of-scope clearly states no force-push. Phase 005 verification-report explicitly records the local-only constraint.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the backup branch be retained indefinitely, or cleaned up after N days? Decide during phase execution (default: retain).
- Should `verification-report.md` be committed to the packet or kept in scratch? Recommend commit — it's the proof artifact.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Parent: `../spec.md`
- Predecessor: `../004-cli-devin-rewrite-prompts/spec.md`
- Inputs: Phase 001 `evidence/`, Phase 002 `commit-standards.md` + `derivation-heuristics.md`, Phase 004 `templates/` + promoted agent-config
- Pattern references: same as Phase 004 (deep-research loop_protocol, convergence)

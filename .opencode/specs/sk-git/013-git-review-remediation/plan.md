---
title: "Implementation Plan: sk-git Review Remediation Round 2"
description: "Per-concern remediation plan: four fresh Sonnet-5 xhigh agents apply six disjoint fixes (AGENTS.md governance, allocator hardening, contract reconciliation, SKILL.md NEVER refusals, cross-skill sk-doc validator), each gated by its checklist verifier contract, then orchestrator-verified and committed scoped."
trigger_phrases:
  - "sk-git review remediation plan"
  - "git workspace safety plan"
  - "allocator hardening plan"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/013-git-review-remediation"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "All six concerns fixed + independently verified"
    next_safe_action: "Scoped commit + push; reconcile concurrent sk-git renumber before WS2"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation-r2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git Review Remediation Round 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Concern 1** | AGENTS.md Git Workspace Safety subsection + quick-ref row |
| **Concern 2a** | Test-harness `${TMP:?}` guard (`cd ""` returns 0) + regression |
| **Concern 2b** | Allocator `next` fails silently at exhaustion (`> 9999`) + boundary test |
| **Concern 2c** | Reconcile 3 catalog↔references contract conflicts to one source |
| **Concern 2d** | SKILL.md NEVER safety refusals backing the README claim |
| **Concern 2e** | Cross-skill sk-doc validator: hyphen detection + CLI `--type` |
| **Mechanism** | Four fresh Sonnet-5 @ xhigh agents, disjoint file domains, parallel |

### Overview

Close the two open GPT-5.6-sol review items from packet 005. Six fixes span disjoint file domains (`AGENTS.md`; the allocator scripts; `SKILL.md`+references+catalog; the sk-doc validator), so they parallelize safely. Each fix is applied by a fresh agent bound to one concern plus its checklist verifier contract, then independently re-verified by the orchestrator (finding = hypothesis — no self-report trusted), and committed scoped (explicit paths only; never `git add -A`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Verification |
|------|-------------|--------------|
| AGENTS.md subsection | 5 rules present + quick-ref row | grep for subsection + points |
| Allocator harness | Green with new tests | `worktree-naming.test.sh` → `FAIL=0` |
| Exhaustion guard | `next` fails at `>= 9999` | boundary test rc=1, empty stdout |
| Contract single-source | 3 conflicts consistent | grep across catalog/references/SKILL.md |
| NEVER refusals | 4 refusals backed | grep SKILL.md NEVER block |
| Validator hyphen-aware | hyphen leaf classifies | run validator on hyphen leaf + `--help` |
| Structure | This packet valid | `validate.sh --strict` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Dispatch units (disjoint file domains)

| Unit | Concern(s) | Files |
|------|-----------|-------|
| A | 1 | `AGENTS.md` |
| B | 2a + 2b | `scripts/worktree-naming.sh`, `scripts/tests/worktree-naming.test.sh` |
| C | 2c + 2d | `SKILL.md`, `references/**`, `feature-catalog/**` |
| D | 2e | `sk-doc/shared/scripts/validate_document.py` |

The four units touch disjoint files, so they run concurrently without conflict. The orchestrator serializes verification + commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Scaffold

Author the packet (spec/plan/tasks/checklist) with each concern's checklist section as its verifier contract.

### Phase 2 — Remediate (parallel)

Dispatch units A–D (fresh Sonnet-5 @ xhigh). Each reads its files, applies its scoped fix, self-verifies, and returns a structured report. No agent touches git.

### Phase 3 — Verify + close

Orchestrator independently re-runs each verifier contract (harness, validator, greps), fills checklist evidence, authors the implementation-summary, regenerates `description.json`/`graph-metadata.json`, runs `validate.sh --strict` (Errors 0), and commits scoped.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Tool |
|-------|-------|------|
| Allocator harness | worktree-naming | `worktree-naming.test.sh` |
| Exhaustion + guard | next_number / mktemp | boundary + regression assertions |
| Validator classification | hyphen/underscore leaves | `validate_document.py` runs |
| Contract consistency | catalog/references/SKILL.md | grep sweeps |
| Structure | This packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fresh Sonnet-5 @ xhigh agents | Internal | Required | Apply the six fixes |
| sk-git SKILL.md grammar | Internal | Required | Authority the AGENTS.md subsection mirrors |
| sk-doc template_rules.json | Internal | Present | Defines the doc types the validator exposes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every fix is a small scoped edit; `git checkout -- <file>` reverts any single concern. No migrations, no deletions of behavior, no force operations, no history rewrite.
<!-- /ANCHOR:rollback -->

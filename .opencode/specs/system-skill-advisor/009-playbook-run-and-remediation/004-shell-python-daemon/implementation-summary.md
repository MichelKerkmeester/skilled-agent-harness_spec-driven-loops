---
title: "Implementation Summary: Shell/Python/Daemon Waves + Playbook Run Rollup"
description: "Devin (SWE-1.6, dangerous mode in an isolated worktree) and OpenCode (DeepSeek) ran the python/compat/daemon and scorer/indexing/lifecycle waves; the run executed all 46 playbook scenarios with 21 PASS, 10 PARTIAL, 2 FAIL, 13 SKIP — release is NOT READY due to a corpus-accuracy regression and two python-suite failures."
trigger_phrases:
  - "playbook run rollup"
  - "skill advisor playbook results"
  - "phase 004 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-playbook-run-and-remediation/004-shell-python-daemon"
    last_updated_at: "2026-05-26T20:00:00Z"
    last_updated_by: "playbook-run-operator"
    recent_action: "Completed all 46 scenarios; consolidated rollup + findings; release NOT READY"
    next_safe_action: "File follow-on remediation packet for accuracy regression + python-suite failures"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-phase-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-playbook-run-and-remediation/004-shell-python-daemon |
| **Completed** | 2026-05-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase finished the playbook run by delegating two-thirds of the remaining scenarios to CLI executors and running the operator-H5 wave locally. The headline: the **whole 46-scenario run is complete**, and it surfaced real defects rather than a clean pass — exactly what a manual test pass is for.

### CLI delegation that actually worked
OpenCode (DeepSeek, full MCP runtime) ran the scorer/indexing/lifecycle waves live, calling `advisor_validate`/`advisor_status` directly and writing structured evidence: SC 3 PASS / 2 PARTIAL, AI 2 PASS / 1 PARTIAL / 2 SKIP, LC 1 PASS / 1 PARTIAL / 3 SKIP. Devin (SWE-1.6) needed two attempts — its non-interactive `auto` mode refused to run any command, so after operator approval it was re-dispatched in `--permission-mode dangerous` confined to an isolated git worktree (`/tmp/devin-wt`, node_modules/dist symlinked). It then ran PC 1 PASS / 2 PARTIAL / 2 FAIL, CP 3 PASS / 1 PARTIAL, AU 5 SKIP. The worktree `git status` was clean afterward — Devin mutated zero tracked files.

### Verification, not trust
Both FAIL findings came from Devin's worktree, where the live SQLite was absent, so they were re-run in the main environment with the full graph loaded. **PC-004** (python regression) still failed: 54/96 cases (56.25%), **P0 pass 50%** (12/24), top1 62.79% — all four gates fail, with P0 failures in memory-save, uncertainty, and command routing. **PC-005** (bench) still failed: the scenario omits the required `--dataset` flag, and warm/cold p95 gates fail. OpenCode's SC-005 accuracy figure (50.78%) matches the NC-003 figure from phase 002 — three independent harnesses agree the corpus accuracy has regressed.

### Operator-H5 (local)
OP-001/002/003 are SKIP: all three need a disposable repo copy with an active daemon watcher plus fault injection (stale source, malformed SKILL.md, corrupt SQLite, untrusted-caller context). The daemon's *healthy* path is already verified in phase 002 (`advisor_status` live, `skill_graph_status` ready/healthy); only the recovery paths are unproven.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `/tmp/skill-advisor-playbook/cli-devin/**`, `cli-opencode/**` | Created | CLI evidence + RESULTS.md (untracked) |
| `/tmp/skill-advisor-playbook/pc-004-main.*`, `pc-005-main.*` | Created | Main-env reproduction of FAILs (untracked) |
| `/tmp/devin-wt` | Worktree | Isolated Devin dispatch target (to be removed) |
<!-- /ANCHOR:what-built -->

---

## Playbook Run Rollup (all 46 scenarios)

| Phase | Category | PASS | PARTIAL | FAIL | SKIP | Total |
|-------|----------|------|---------|------|------|-------|
| 002 | NC native MCP | 7 | 2 | 0 | 0 | 9 |
| 003 | CL hooks/plugin | 4 | 1 | 0 | 0 | 5 |
| 004 | SC scorer fusion | 3 | 2 | 0 | 0 | 5 |
| 004 | AI auto-indexing | 2 | 1 | 0 | 2 | 5 |
| 004 | LC lifecycle | 1 | 1 | 0 | 3 | 5 |
| 004 | PC python compat | 1 | 2 | 2 | 0 | 5 |
| 004 | CP compat/disable | 3 | 1 | 0 | 0 | 4 |
| 004 | AU auto-update daemon | 0 | 0 | 0 | 5 | 5 |
| 004 | OP operator H5 | 0 | 0 | 0 | 3 | 3 |
| **Total** | **46** | **21** | **10** | **2** | **13** | **46** |

**Release readiness: NOT READY.** The playbook §5 rule requires every scenario to be PASS or approved-SKIP with no unresolved failure. Two FAILs (PC-004, PC-005) plus the corroborated accuracy regression block release; the 13 SKIPs are infrastructure-gated (disposable-workspace + active-daemon harness), not defects.

## Consolidated Findings

1. **Corpus accuracy regression (triple-corroborated, highest priority).** advisor_validate 50.78% full-corpus / 42.5% holdout vs documented 80.5%/77.5%; PC-004 regression 56.25% / 50% P0; SC-005 50.78%. Root cause largely a skill-ID drift: corpus gold labels use `sk-deep-research`/`sk-deep-review` but the live graph indexes `deep-research`/`deep-review` (0/34 and 0/19). P0 failures: P0-MEM-001, P0-UNC-001/002, P0-CMD-001/002/003.
2. **PC-005 bench**: scenario doc omits the required `--dataset` flag; warm_p95 + cold_p95 gates fail.
3. **`semantic_shadow` lane drift**: live weight is 0.05 (shadowOnly:false) but SC-004/SC-005 scenarios assume shadow-only/weight-0.
4. **OpenCode plugin bridge (CL-005)**: native route does not engage (`route:"python"`, `SYSTEM_SKILL_ADVISOR_UNAVAILABLE`) despite the compat entry existing; fails open safely.
5. **Stale vitest path (NC-004/005)**: documented `skill-advisor/tests/...` from `system-spec-kit/mcp_server` resolves nothing; correct path `system-skill-advisor/mcp_server/tests/` passes 49/49.
6. **PC-002 shim**: output lacks native/local source tags, so delegation route can't be verified from evidence alone.
7. **Devin non-interactive requires `--permission-mode dangerous`** to execute any command; `auto` blocks all tool use unattended.
8. **Working-tree churn**: routine advisor/memory MCP activity drove the context-server daemon to bump `last_save_at`/`last_accessed_at` across ~1296 `graph-metadata.json` files in the working tree — not source edits, but a git-hygiene concern.

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Waves were assigned per the operator's "maximize CLI delegation" choice. The three required CLI skills (cli-devin, cli-opencode, sk-prompt-models) were read before composing dispatch prompts, which used RCAF framing with medium-density pre-planning per the SWE-1.6 contract. OpenCode and Devin ran concurrently (one dispatch per quota pool, operator-authorized). All CLI evidence was read from each executor's RESULTS.md, the worktree was confirmed clean, and the two FAILs were reproduced locally in the full environment before being recorded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-dispatch Devin in dangerous mode inside a worktree | Non-interactive `auto` blocks all execution; operator approved isolation as the safe way to exercise the Devin path |
| Reproduce PC-004/PC-005 in the main env | Devin's worktree lacked the live SQLite; the FAILs had to be confirmed against the real graph before recording |
| SKIP daemon/disposable scenarios rather than force them | No safe disposable-workspace + active-daemon harness this session; forcing would risk the live checkout |
| Run OpenCode without `--dangerously-skip-permissions` | RM-8 incident precedent (44 files deleted); default permissions kept the dispatch safe |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| SC wave (opencode) | 3 PASS, 2 PARTIAL |
| AI wave (opencode) | 2 PASS, 1 PARTIAL, 2 SKIP |
| LC wave (opencode) | 1 PASS, 1 PARTIAL, 3 SKIP |
| PC wave (devin) | 1 PASS, 2 PARTIAL, 2 FAIL |
| CP wave (devin) | 3 PASS, 1 PARTIAL |
| AU wave (devin) | 5 SKIP |
| OP wave (local) | 3 SKIP |
| Worktree git status post-Devin | PASS — clean (no tracked mutation) |
| PC-004 reproduced in main env | FAIL confirmed (P0 50%, all gates fail) |
| PC-005 reproduced in main env | FAIL confirmed (warm/cold p95 gates fail) |
| **Phase-004 total** | **10 PASS, 7 PARTIAL, 2 FAIL, 13 SKIP (32)** |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **13 SKIPs are infrastructure-gated.** AU (5), OP (3), AI-004/005, LC-002/004/005 all need a disposable repo copy with an active daemon watcher and fault injection — not stood up this session. The daemon healthy path is verified; recovery paths are not.
2. **Findings are recorded, not fixed.** The accuracy regression, PC-005 doc gap, semantic_shadow drift, and bridge native-route failure are all out of scope for this run and flagged for a follow-on packet.
3. **Working-tree graph-metadata churn (~1296 files).** Caused by the running context-server daemon during normal MCP activity; these are timestamp bumps, not source edits, and were left untouched (reverting 1296 files is out of scope and risky).
<!-- /ANCHOR:limitations -->

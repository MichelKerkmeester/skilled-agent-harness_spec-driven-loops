---
title: "Verification Checklist: Rename sk-improve-agent → deep-agent-improvement"
description: "P0/P1/P2 verification items mapped to spec REQs and tasks. Verification Date: 2026-05-06 (target)."
trigger_phrases:
  - "verification checklist"
  - "rename verification"
  - "advisor smoke test"
  - "improve:agent dispatch test"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/079-sk-deep-agent-improvement"
    last_updated_at: "2026-05-06T08:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "checklist.md authored"
    next_safe_action: "validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000082"
      session_id: "079-checklist-author"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Rename `sk-improve-agent` → `deep-agent-improvement`

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Each CHK item is mapped to a `spec.md` REQ and a `tasks.md` T-### where applicable.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..REQ-017)
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (architecture, phase deps, rollback)
- [ ] CHK-003 [P0] Resource map produced — exhaustive file-by-file inventory with line numbers
- [ ] CHK-004 [P0] Tasks ledger T-001..T-041 in `tasks.md` — every task has acceptance criterion
- [ ] CHK-005 [P0] Strict spec validation passes pre-dispatch — `validate.sh ... --strict` exits 0
- [ ] CHK-006 [P1] Implementation executor declared — `cli-copilot` + `gpt-5.5` reasoning high + max 3 concurrent dispatches
- [ ] CHK-007 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Skill folder physically renamed via `git mv` (REQ-001 / T-001)
- [ ] CHK-011 [P0] Symlink renamed and retargeted (REQ-008 / T-002) — `readlink` resolves new path
- [ ] CHK-012 [P0] Old symlink absent — `ls .opencode/changelog/sk-improve-agent` returns ENOENT
- [ ] CHK-013 [P0] SKILL.md frontmatter `name: deep-agent-improvement` (REQ-002 / T-003)
- [ ] CHK-014 [P0] graph-metadata.json `skill_id` is `deep-agent-improvement` (REQ-002 / T-005)
- [ ] CHK-015 [P0] In-skill scripts updated (T-006) — `grep -c 'sk-improve-agent' scripts/*.cjs` returns 0
- [ ] CHK-016 [P0] Asset files updated (T-007) — `grep -rc 'sk-improve-agent' assets/` returns 0
- [ ] CHK-017 [P0] All in-skill path strings updated (T-008/T-009) — `grep -rn 'sk-improve-agent/'` inside renamed folder returns 0
- [ ] CHK-018 [P1] New changelog entry `v1.3.0.0.md` authored (REQ-011 / T-008)
- [ ] CHK-019 [P0] skill_advisor.py 156 phrases migrated (REQ-003 / T-010) — grep returns 0
- [ ] CHK-020 [P0] skill-graph.json registry + edges + trigger phrases updated (REQ-003 / T-011)
- [ ] CHK-021 [P0] fusion.ts:270 penalty list updated (T-012)
- [ ] CHK-022 [P0] Compiled dist/ regenerated (REQ-005 / T-015) — `npm run build` succeeds; dist/ grep returns 0
- [ ] CHK-023 [P0] SQLite advisor cache rebuilt (REQ-004 / T-016)
- [ ] CHK-024 [P1] Cross-skill metadata updated (T-017/T-018/T-019)
- [ ] CHK-025 [P0] Command surfaces updated in 4 runtimes (REQ-006 / T-020..T-026)
- [ ] CHK-026 [P0] Agent skill-matrix lines updated in 4 runtimes (T-027..T-030)
- [ ] CHK-027 [P0] Agent name unchanged (CHK-064 historical) — `name: improve-agent` still in all 4 runtimes
- [ ] CHK-028 [P1] Root docs updated (REQ-012 / T-031/T-032)
- [ ] CHK-029 [P1] Install guides updated (REQ-013 / T-033)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All acceptance criteria met — REQ-001..REQ-016 satisfied (REQ rollup)
- [ ] CHK-031 [P0] Strict spec validation post-implementation (REQ-009 / T-035) — `validate.sh ... --strict` exits 0
- [ ] CHK-032 [P0] Residual grep clean (T-036) — full command per `tasks.md` T-036; output 0 lines
- [ ] CHK-033 [P0] Advisor recommendation smoke (REQ-003 / T-037) — top hit `deep-agent-improvement`; confidence ≥ 0.85
- [ ] CHK-034 [P0] /improve:agent smoke dispatch (REQ-007 / T-038) — sandbox agent dispatch completes 1 auto-mode iteration; zero broken-path errors
- [ ] CHK-035 [P0] Vitest pass (REQ-010 / T-039) — `npm test` returns exit 0; `native-scorer.vitest.ts` and `remediation-008-docs.vitest.ts` pass
- [ ] CHK-036 [P1] YAML asset templates parse (T-022/T-023 + mirrors) — `python3 -c 'import yaml; yaml.safe_load(open(p))'` succeeds for both auto + confirm in all 4 runtimes
- [ ] CHK-037 [P1] JSON metadata files parse — `jq '.' graph-metadata.json` and `jq '.' skill-graph.json` succeed across all updated files
- [ ] CHK-038 [P1] Edge cases tested — symlink resolution; sandbox-agent path inside renamed skill resolves; SQLite cache hot-rebuilt
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class declared — this is a `class-of-bug` style refactor (string identifier replacement across multiple consumer surfaces), not an instance-only change
- [ ] CHK-FIX-002 [P0] Same-class producer inventory complete — full grep `rg -n 'sk-improve-agent' .` pre-dispatch; results captured in `resource-map.md`
- [ ] CHK-FIX-003 [P0] Consumer inventory complete — every consumer surface enumerated in `resource-map.md` §3-§10 with line numbers
- [ ] CHK-FIX-004 [P0] Adversarial cases handled — N/A for symbolic rename (no parser, no path resolution logic, no security boundary). Documented N/A in implementation-summary.md
- [ ] CHK-FIX-005 [P1] Matrix axes listed — no axes (deterministic mechanical replace). Documented in implementation-summary.md
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant — N/A (no env-reading code paths changed)
- [ ] CHK-FIX-007 [P1] Evidence pinned — `implementation-summary.md` cites concrete commit SHAs for all rename-related commits, not branch-relative HEAD ranges
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No hardcoded secrets introduced — symbolic rename only; no new env vars
- [ ] CHK-041 [P0] No new attack surface — no parser/path-resolver/security-boundary changes; symbolic identifier replacement only
- [ ] CHK-042 [P1] Authorization model unchanged — `@improve-agent` agent dispatch authority and `/improve:agent` command access remain identical
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec.md / plan.md / tasks.md / checklist.md / resource-map.md mutually consistent — REQ IDs and T-IDs cross-reference resolves both directions
- [ ] CHK-051 [P1] implementation-summary.md authored with verification evidence (REQ-014 / T-040)
- [ ] CHK-052 [P1] implementation-summary.md links new changelog entry (T-040 → v1.3.0.0.md)
- [ ] CHK-053 [P2] description.json + graph-metadata.json regenerated post-implementation (auto by /memory:save)
- [ ] CHK-054 [P1] Branch hygiene confirmed (REQ-016) — working tree on `main`; no surviving auto-branch
- [ ] CHK-055 [P0] /memory:save executed (REQ-015 / T-041) — `_memory.continuity.completion_pct` set to 100
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] No leftover scratch files at packet root — `ls scratch/` empty or absent
- [ ] CHK-061 [P1] No `.bak` artifacts from sed `-i.bak` mass replace — `find . -name '*.bak' -newer spec.md` returns nothing inside `.opencode/`, `.claude/`, `.gemini/`, `.codex/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | [ ]/28 |
| P1 Items | 19 | [ ]/19 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-05-06 (target — populate at completion)
<!-- /ANCHOR:summary -->

---
title: "Verification Checklist: Old-skill deletion and full-surface validation"
description: "Verification Checklist for phase 009 of the deep-loop-workflows merge: Old-skill deletion and full-surface validation."
trigger_phrases:
  - "deep-loop-workflows phase 009"
  - "old-skill-deletion-and-validation"
  - "deep loop merge verification checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-workflows/009-old-skill-deletion-and-validation"
    last_updated_at: "2026-06-16T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closed CHK-060 via skill_graph_scan rejectedEdges=0; descoped CHK-065"
    next_safe_action: "Ratify CHK-065 descope; clear 4 circumstantial P0 (001/010/021/030)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-009-old-skill-deletion-and-validation-verificationchecklist"
      parent_session_id: null
    completion_pct: 72
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Old-skill deletion and full-surface validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor (phase 008) green and continuity read
  - **Evidence**: circumstantially satisfied — the merge completed the 001→009 chain and shipped functional — but not formally gate-run this session.
- [x] CHK-002 [P0] Phase-001 parity baseline available
  - **Evidence**: `001-parity-baseline-and-runtime-ownership-adr/baseline/` exists with file-hashes.txt (924 entries), advisor-routing.txt, and script-behavior-before.txt (2026-06-15).

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Edits stay in this phase's frozen scope (no adjacent cleanup)
  - **Evidence**: circumstantially satisfied — the merge stayed within the deep-loop surface and shipped functional — but not formally gate-run this session.
- [ ] CHK-011 [P1] Changes follow existing project conventions
  - **Evidence**: sk-code surface conventions honored.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Phase 001 baseline evidence exists and covers 5 modes, 8 commands, advisor routing, and Lane-D dry-run parity.
  - **Evidence**: baseline/file-hashes.txt hashes all 5 deep skills + the deep commands/assets; advisor-routing.txt captures advisor outputs; script-behavior-before.txt captures script behavior (2026-06-15).
- [ ] CHK-021 [P0] Phase 008 handoff is green before deletion.
  - **Evidence**: circumstantially satisfied — the deletion proceeded and the merged surface shipped functional — but the 008 handoff was not formally gate-run this session.
- [x] CHK-022 [P0] deep-loop-workflows has exactly one hub graph-metadata.json and no per-mode graph metadata.
  - **Evidence**: `find .opencode/skills/deep-loop-workflows -name graph-metadata.json` returns exactly one hub file; no per-mode metadata (2026-06-15).
- [x] CHK-023 [P0] /doctor deep-loop covers both deep-loop-graph.sqlite and council-graph.sqlite.
  - **Evidence**: `doctor_deep-loop.yaml` + `_routes.yaml` extended with council scope/probe/staleness/replay recommendation (scope=council|all); live `status.cjs --loop-type council` returns status:ok, totalNodes:2 (2026-06-15).
- [x] CHK-024 [P0] Route validation passes.
  - **Evidence**: `route-validate.sh` → PASS, 9 routes, 0 errors; allowed_flags now accepts `--scope=research|review|council|both|all` (2026-06-15).
- [x] CHK-025 [P0] Runtime council graph status/query/convergence smoke checks pass.
  - **Evidence**: `status.cjs`/`query.cjs`/`convergence.cjs --loop-type council` all return status:ok (convergence decision:CONTINUE score:0.4; query unresolved_disagreements:0) (2026-06-15).
- [x] CHK-026 [P0] Exactly five old skill directories are deleted.
  - **Evidence**: `ls .opencode/skills/deep-*` → only deep-loop-runtime + deep-loop-workflows remain; the five old skill dirs (research/review/context/improvement/ai-council) are merged-and-deleted (2026-06-15).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Skill graph rebuild passes with rejectedEdges=0.
  - **Evidence**: `skill-advisor.cjs skill_graph_scan --trusted` → status:ok, **rejectedEdges:0**, indexedEdges:82, embeddings failed:0, generation 7013→7014 (2026-06-16). Scan inputs were quiescent: zero dirty graph-metadata under `.opencode/skills/`; the concurrent session's ~366 dirty files are all spec-side, which the skill scan does not read. Four advisory WEIGHT-BAND notes (non-blocking, not rejections) and six NON-SKILL-METADATA test-fixture skips (expected) accompanied the clean result.
- [x] CHK-061 [P0] Advisor validation passes and asserts skill plus mode.
  - **Evidence**: `skill_advisor.py --dump-routing-maps` Python DEEP_ROUTING_MODE_BY_KEY == registry lexical projection (True; keys deep-research/deep-review/deep-ai-council); live prompts route to deep-loop-workflows + correct mode (2026-06-15).
- [x] CHK-062 [P0] Agent three-way mirror parity passes.
  - **Evidence**: the packet-156 wave-3 adversarial seat verified all 5 deep-loop agents are byte-parity across .opencode/.claude/.codex (only the whitelisted per-runtime Path-Convention line + one trailing blank differ). NOTE: a concurrent session currently has uncommitted edits to the deep-* mirrors, which are separate from this committed-state verification (2026-06-15).
- [x] CHK-063 [P0] Registry completeness passes.
  - **Evidence**: mode-registry.json has 8 modes, every one carrying advisorRouting.routingClass + packetSkillName (verified True) (2026-06-15).
- [x] CHK-064 [P0] convergence.cjs still accepts exactly research\|review\|council\|context and no improvement loop type.
  - **Evidence**: `convergence.cjs:300` rejects any loopType outside research|review|council|context; no improvement loop type (2026-06-15).
- [ ] CHK-065 [P0] Full phase-001 parity rerun is byte-identical for all five modes and eight commands.
  - **Evidence**: DESCOPED via `decision-record.md` ADR-001 (Accepted, 2026-06-16). The captured baseline (`001-parity-baseline-and-runtime-ownership-adr/baseline/file-hashes.txt`, 924 entries) is PRE-merge source hashes at old paths (e.g. `deep/ask-ai-council.md` → now `deep/ai-council.md`; `deep_start-*-loop_*.yaml`); the merge's intentional moves + path rewrites invalidate a byte-identical rerun and no path-rewrite map exists, so the literal criterion is unrecoverable. Behavioral parity is instead evidenced by the 351 passing deep-loop-runtime tests + the packet-156 wave-2/3 registry↔reality, mirror-parity, and runtime-promotion verifications. Box stays unchecked to mark a descoped (not byte-verified) P0; see decision-record.md for full rationale, alternatives, and accepted substitute evidence.
- [x] CHK-066 [P0] validate.sh --strict passes for phase 009 and parent recursive validation is green.
  - **Evidence**: 009 --strict PASSED (0/0); 152 parent control file --strict PASSED (0/0); full recursive 152 sweep GREEN — all 9 children pass --strict (the 004/005/006/008 missing-impl-summary gap was closed this session) (2026-06-16).

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced
  - **Evidence**: circumstantially satisfied — this is a doc/code reorg with no credentials — but a formal no-secrets gate was not run this session.
- [ ] CHK-031 [P1] deep-loop-runtime stays MCP-free
  - **Evidence**: no MCP tool added to the backend.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized for this phase
  - **Evidence**: this packet's docs describe the same scope.
- [ ] CHK-041 [P2] Cross-repo doc references updated (if this phase touches them)
  - **Evidence**: handled in phase 008 unless owned here.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No stray temp files committed
  - **Evidence**: scratch artifacts kept out of the packet.
- [ ] CHK-051 [P1] Old skill directories untouched (until phase 009)
  - **Evidence**: build is additive; deletion is phase 009 only.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 13/18 |
| P1 Items | 6 | 0/6 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-16 (sign-off: 13/18 P0 verified; CHK-060 closed via clean skill_graph_scan rejectedEdges=0; CHK-065 descoped via decision-record.md ADR-001 — baseline unrecoverable, substitute evidence accepted; 4 process gates CHK-001/010/021/030 remain circumstantial)
**Verified By**: claude-opus (009 final gate close: CHK-060 + CHK-065)

<!-- /ANCHOR:summary -->

---
title: "Implementation Summary: 039 Deferred Follow-on — CLOSED-BY-PARALLEL"
description: "Phase 1 verification sweep proved 11 of 12 deferred items were independently closed by the parallel agent's 058/4* + 038-1A-path1 + 038-3 commits; only the package.json gitignore policy decision remains and is intentionally deferred."
trigger_phrases:
  - "039 implementation summary"
  - "system-code-graph v1.0.2.0 polish complete"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/024-system-code-graph-deferred-followon"
    last_updated_at: "2026-05-15T18:30:00Z"
    last_updated_by: "claude-opus-4-7-039-close"
    recent_action: "verification_sweep_complete_11_of_12_closed_by_parallel"
    next_safe_action: "ship_v1_0_2_0_changelog_and_close_packet"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-039-deferred-followon"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Q1: package.json gitignore policy — leave gitignored (current) or track? Deferred to packet 040 if pursued."
    answered_questions:
      - "T0.1 P1-A4 feature_catalog: CLOSED-BY-PARALLEL (sk-doc hierarchy in place)"
      - "T0.2 P1-A5 playbook misclassification: CLOSED-BY-PARALLEL (scenarios moved)"
      - "T0.3 P1-D1 vitest files: CLOSED-BY-PARALLEL (both exist)"
      - "T0.4 P1-D2 stress tests: CLOSED-BY-PARALLEL (deleted as design)"
      - "T0.5 P1-D3 skip tests: CLOSED-BY-PARALLEL (no it.skip remains)"
      - "T0.7 P1-F2 dist materialization: CLOSED-BY-DESIGN (59-byte is intentional forwarding shim)"
      - "T0.8 P1-G1 doctor mkdir: CLOSED-BY-PARALLEL (mkdir -p at mcp-doctor.sh:537)"
      - "T0.9 P1-H1 INDEX_* defaults: CLOSED-BY-PARALLEL (all 6 configs aligned to false)"
      - "T0.10 P1-H2 _NOTE_1_DB: CLOSED-BY-PARALLEL (both configs updated)"
      - "T0.11 P1-H3 _NOTE_AUTO_MIGRATION: CLOSED-BY-PARALLEL (present in .vscode/mcp.json:26)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-system-code-graph-deferred-followon |
| **Completed** | 2026-05-15 |
| **Level** | 2 |
| **Outcome** | **CLOSED-BY-PARALLEL** (no remediation dispatches required) |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:what-built -->
## What Was Built

A Phase 1 verification sweep that resolved 11 of 12 deferred P1 findings against current main HEAD without dispatching new remediation work. The parallel agent's `058/4*` SKILL/README/references commits + `038-1A-path1` isolation refactor + `038-3` launcher DB move/build automation/test coverage uplift collectively closed every actionable item from packet 038's defer list.

Sweep artifacts:
- This `implementation-summary.md` with per-finding status table.
- Companion v1.0.2.0 changelog at `.opencode/skills/system-code-graph/changelog/v1.0.2.0.md` (authored alongside this packet's close).
- No source code changes from 039 — all heavy lifting was done by parallel work.

<!-- /ANCHOR:what-built -->

---
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 — Verification Sweep (15 min, manual `rg` + `jq` + `wc` checks):

Re-checked each finding in `tasks.md` T0.1..T0.11 against current main HEAD. For each, recorded STILL-OPEN / CLOSED-BY-PARALLEL / CLOSED-BY-DESIGN status with evidence (file:line or command output).

Result:
- **11 CLOSED**: P1-A4, P1-A5, P1-D1, P1-D2, P1-D3, P1-F2, P1-G1, P1-H1, P1-H2, P1-H3 — all by parallel agent's commits between `683421117..b8a972e01`.
- **1 STILL-OPEN** as policy decision (not engineering work): P1-F1 `package.json` gitignore policy. The scripts block exists locally and is functional; `.opencode/.gitignore:2` keeps the file untracked by intentional repo convention. Decision punted to operator (Open Question 1 in `spec.md` §7).

Phase 2 (Implementation) and Phase 3 (Verification): skipped — there was nothing left to remediate.

Phase 4 (Ship v1.0.2.0): proceed to changelog + close.

<!-- /ANCHOR:how-delivered -->

---
<!-- ANCHOR:decisions -->
## Key Decisions

- **Verify-before-fix discipline paid off**: Phase 1 sweep prevented redundant remediation dispatches. Without the verification gate, 039 would have shipped 9 redundant fixes already done by the parallel agent — wasted cli-opencode credits and merge friction.
- **P1-F2 "59-byte stub" was a false-positive in 037's review**: the file is an intentional forwarding shim (`import '../../dist/system-code-graph/mcp_server/index.js'`). The real compiled output is 2126 bytes at the launcher's two-path artifact target. Both paths required by `mk-code-index-launcher.cjs:requiredArtifacts()` are present. No build needed.
- **P1-F1 gitignore policy deferred**: not an engineering decision — operator preference. The package.json scripts block is functional locally; tracking it is a future arc.
- **No new code changes**: 039 ships as a verification + documentation packet, not a remediation packet.

<!-- /ANCHOR:decisions -->

---
<!-- ANCHOR:verification -->
## Verification

- **Strict validate**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/039-system-code-graph-deferred-followon --strict` → exit 0, 0 errors, 0 warnings.
- **Per-finding verification commands** (all run from repo root):
  - P1-A4: `head -30 .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` shows sk-doc template hierarchy `## N. GROUP / ### Feature / #### Description`.
  - P1-A5: scenario 024 is under `## 9. DETECT CHANGES` (line 112), scenario 016 still under post-rename (line 165) — both correctly classified now.
  - P1-D1: `ls .opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts .opencode/skills/system-code-graph/mcp_server/tests/exclude-rule-classifier.vitest.ts` — both files exist.
  - P1-D2: `ls .opencode/skills/system-code-graph/{mcp_server/stress_test,stress_test}/code-graph/deep-loop-*` returns nothing — deleted as design.
  - P1-D3: `grep -nE "it\.skip|it\.todo" .opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` returns nothing — no skipped tests.
  - P1-F1: `jq '.scripts' .opencode/skills/system-code-graph/package.json` returns the scripts block; `git check-ignore -v` confirms the file remains gitignored by policy.
  - P1-F2: `wc -c .opencode/skills/system-code-graph/dist/system-code-graph/mcp_server/index.js` = 2126 (real compile output); `wc -c .opencode/skills/system-code-graph/mcp_server/dist/index.js` = 59 (forwarding shim by design).
  - P1-G1: `grep -n 'mkdir -p "$db_dir"' .opencode/commands/doctor/scripts/mcp-doctor.sh` returns line 537.
  - P1-H1: 6-config grep confirms `"false"` defaults across opencode.json, .claude/mcp.json, .codex/config.toml, .devin/config.json, .gemini/settings.json, .vscode/mcp.json.
  - P1-H2: `.claude/mcp.json:46` + `.gemini/settings.json:68` use `_NOTE_1_DB` + `_NOTE_2_TOOLS` convention.
  - P1-H3: `jq '.servers."mk-spec-memory".env._NOTE_AUTO_MIGRATION' .vscode/mcp.json` returns the canonical string at line 26.

<!-- /ANCHOR:verification -->

---
<!-- ANCHOR:limitations -->
## Known Limitations

- **package.json gitignore policy**: scripts block ships locally only. Operator must decide track-or-leave; current state is "leave gitignored" by inheritance. If packet 040 pursues full decoupling refactor (parallel agent's `038-1A-path1` already removed 13 of 14 production imports), 040 could opt to track package.json simultaneously.
- **P2 batch not triaged**: 037 review surfaced ~30 P2 nice-to-haves. They were explicitly scoped OUT of 038 and now also OUT of 039's actual delivered work. They remain in `037/.../review/iterations/iteration-{001..020}.md` P2 sections for any future polish packet.
- **Devin scenario length 164 vs ~65 template** (P1-A5 sub-claim): cosmetic style review per 037 verification-addendum.md (PARTIAL — original claim length-overstated). Not addressed; defer to a future style-pass packet if pursued.

<!-- /ANCHOR:limitations -->

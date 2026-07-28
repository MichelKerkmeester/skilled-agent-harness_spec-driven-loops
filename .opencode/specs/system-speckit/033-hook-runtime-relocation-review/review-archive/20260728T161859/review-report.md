---
title: "Deep Review Report: Hook Runtime Relocation"
description: "5-iteration forced deep review (cli-opencode gpt-5.6-sol, reasoning high, stop_policy=max-iterations) of the .opencode/runtime-hooks/ relocation. Verdict: CONDITIONAL, P0=0 P1=6 P2=4."
trigger_phrases:
  - "hook relocation review report"
  - "runtime-hooks deep review"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T13:05:00Z"
    last_updated_by: "claude"
    recent_action: "Completed 5-iteration forced deep review; synthesized CONDITIONAL verdict"
    next_safe_action: "Route to /speckit:plan for remediation of the 6 active P1 findings before any merge decision"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/review-report.md"
      - ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Merge into skilled/v4.0.0.0, push branch only, or leave local — operator decision, gated on remediating the 6 P1 findings (or an explicit accept-as-is decision)."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: review-report | v1 -->
# Deep Review Report: Hook Runtime Relocation

---

## 1. Executive Summary

**Verdict: CONDITIONAL** (hasAdvisories: false — verdict is driven by active P1s, not just P2 advisories)

- **P0: 0** | **P1: 6** | **P2: 4** (all active, 0 resolved, 0 duplicates)
- 5 forced iterations completed (`stop_policy=max-iterations`), dimensions: inventory (iter 1), correctness (iter 2), security (iter 3), traceability (iter 4), maintainability (iter 5)
- Executor: `cli-opencode`, model `openai/gpt-5.6-sol`, reasoning effort `high` — confirmed via 5 real dispatch receipts and per-iteration token/cost telemetry (not simulated)
- **Review scope**: the `.opencode/runtime-hooks/` relocation, commit `40d5f0d2b3` on worktree branch `skilled/0118-hook-runtime-relocation` vs `skilled/v4.0.0.0` — 84 files changed
- **Zero P0 findings.** The relocation is functionally sound: no broken imports, no dead symlinks, no failing tests were found live. All 6 P1 findings are either (a) pre-existing bugs in the moved code that predate this relocation (confirmed via `git show --stat` line-change counts — see §7 for the distinction), or (b) real gaps in this work's own documentation/architecture claims.

## 2. Planning Trigger

`/speckit:plan` **is required** before merge — 6 active P1 findings need remediation or an explicit operator-approved exception.

```json Planning Packet
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 6, "P2": 4 },
  "remediationWorkstreams": [
    "Fix Codex multi-file post-edit-quality coverage (R2-P1-001)",
    "Harden deep-loop dispatch-guard command-driven exemption against prompt forgery (R3-P1-001)",
    "Redact/avoid persisting raw credential-shaped text in the CLI dispatch audit log (R3-P1-002)",
    "Fix stale executable paths in 2 manual-testing-playbook files and correct CHK-011/CHK-041 evidence (R4-P1-001)",
    "Produce commit-pinned post-move live smoke evidence for Claude, Cursor, Devin, Codex or narrow the six-runtime claim (R4-P1-002)",
    "Resolve the system-spec-kit hard dependency in 5 relocated adapters, or amend the independent-adoption claim in runtime-hooks/README.md (R5-P1-001)"
  ],
  "specSeed": "Amend system-speckit/033-hook-runtime-relocation-review/spec.md REQ-002 and NFR-R01 to either require commit-pinned live evidence for all 6 runtimes, or narrow the acceptance criteria to what was actually verified.",
  "planSeed": "New remediation phase under this packet: fix R2/R3 pre-existing bugs surfaced by review, fix R4 doc/evidence gaps, and resolve or explicitly accept R5's ownership-boundary gap.",
  "findingClasses": ["cross-consumer", "class-of-bug", "matrix/evidence"],
  "affectedSurfacesSeed": [
    ".opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs",
    ".opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs",
    ".opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs",
    ".opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md",
    ".opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md",
    ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md",
    ".opencode/runtime-hooks/README.md",
    ".opencode/runtime-hooks/task-dispatch/claude/task-dispatch-guard.cjs",
    ".opencode/runtime-hooks/mcp-route-guard/claude/mcp-route-guard.cjs"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:Line | Class | Pre-existing or introduced |
|----|-----|-------|-----------|-----------|-------|------------------------------|
| R2-P1-001 | P1 | Codex multi-file patches check only the first file for post-edit quality | correctness | `.opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:48` | cross-consumer | Pre-existing (file moved with only a 2-line import fix; `firstPatchPath()` logic unchanged) |
| R3-P1-001 | P1 | Prompt text can forge command-owned deep-loop provenance, defeating loop-repeat rejection | security | `.opencode/runtime-hooks/task-dispatch/lib/dispatch-guard.cjs:124-131` | cross-consumer | Pre-existing (confirmed 0 line changes in the relocation commit — pure `git mv`) |
| R3-P1-002 | P1 | Dispatch audit persists credential-shaped text outside its redaction allowlist | security | `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs:107-145` | class-of-bug | Pre-existing (confirmed 0 line changes in the relocation commit — pure `git mv`) |
| R4-P1-001 | P1 | 2 manual-testing-playbook files retain executable references to removed skill-owned paths | traceability | `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/{cli-dispatch-audit-trail,codex-hook-parity}.md` | cross-consumer | **Introduced by this work** — missed during the ~20-file doc sweep |
| R4-P1-002 | P1 | "Verified across 6 runtimes" claim lacks post-move live evidence for 4 of 6 runtimes | traceability | `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/implementation-summary.md:3` | matrix/evidence | **Introduced by this work** — overstated claim in the retroactive packet |
| R5-P1-001 | P1 | 5 relocated adapters retain a hard `system-spec-kit` dependency, contradicting the "independent adoption" README claim | maintainability | `.opencode/runtime-hooks/README.md:20` + 5 adapter files | cross-consumer | **Design gap, not a regression** — the dependency pre-dates this move, but the README's framing of it as builtin-equivalent is new and inaccurate |
| R1-P2-001 | P2 | Validation command mixes Node and Vitest runners | correctness | `.opencode/runtime-hooks/README.md:100` | matrix/evidence | Introduced (new README) |
| R1-P2-002 | P2 | Claude hook table retains a removed post-edit path | correctness | `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md:89` | cross-consumer | Pre-existing stale row, adjacent rows in same table now updated |
| R1-P2-003 | P2 | Plugin architecture prose contradicts relocated core ownership | correctness | `.opencode/plugins/README.md:23,75,146,260` | cross-consumer | Introduced (contradiction created by this relocation) |
| R5-P2-001 | P2 | Cursor guards depend on Claude adapter executables/response envelopes, not the neutral core directly | maintainability | `.opencode/runtime-hooks/task-dispatch/cursor/task-dispatch-guard.mjs:41` | cross-consumer | Pre-existing pattern, unchanged by this relocation |

## 4. Remediation Workstreams

### P1 — Required before merge (or explicit operator exception)

1. **R4-P1-001 + R4-P1-002 (this work's own doc gaps)** — Fix the 2 stale playbook path references; either run and record commit-pinned live smoke tests for Claude, Cursor, Devin, and Codex, or narrow the implementation-summary's "verified across 6 runtimes" claim to what was actually confirmed (Pi + OpenCode live, others via config/symlink/test-suite checks only).
2. **R5-P1-001 (design gap)** — Either move `hook-adapter-shared.cjs` to a neutral location so the 5 dependent adapters have zero skill dependency, or amend `runtime-hooks/README.md` to state plainly that `system-spec-kit` is a required runtime dependency for those 5 adapters (drop the "equivalent to a Node builtin" framing).
3. **R2-P1-001, R3-P1-001, R3-P1-002 (pre-existing bugs surfaced by this review)** — Legitimate bugs in code that moved unchanged. Recommend tracking as follow-up work (separate from this relocation's own scope per Gate 3 SCOPE LOCK), but flagging to the operator now since the review surfaced them with high confidence (0.94–0.98) and concrete reproductions.

### P2 — Advisory

4. Fix the mixed-runner validation command in `runtime-hooks/README.md`, the stale Claude hook table row, and the plugin-architecture ownership contradiction.
5. Consider having Cursor's guards call the neutral cores directly instead of spawning Claude's adapter (maintainability, not correctness).

## 5. Spec Seed

- Amend `spec.md` REQ-002 to state exactly what "verified across 6 runtimes" means (which runtimes got live post-move smoke tests vs. config/symlink/import checks only), or commit to running the missing 4.
- Add an explicit REQ for `runtime-hooks/README.md`'s independent-adoption claim: either it's true for all relocated files, or the README must name which adapters still require `system-spec-kit`.

## 6. Plan Seed

- New remediation phase: (1) fix R4's doc/evidence gaps, (2) resolve or explicitly accept R5's dependency gap, (3) file the 3 pre-existing R2/R3 bugs as separate tracked follow-ups outside this packet's scope lock, (4) fix the 4 P2 advisories.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | fail | Contradicted by stale playbook paths (R4-P1-001) and the unresolved independent-adoption claim (R5-P1-001) |
| `checklist_evidence` | fail | CHK-011 (zero-stale-path) and CHK-041 (docs updated) are overstated per R4-P1-001; the six-runtime live-smoke claim underlying multiple checklist rows is unevidenced for 4 runtimes per R4-P1-002 |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `skill_agent` | fail | 5 relocated adapters still import a system-spec-kit-owned helper (R5-P1-001) |
| `agent_cross_runtime` | partial | Wiring/discovery mirrors all resolve; live post-move confirmation exists only for Pi and OpenCode |
| `feature_catalog_code` | pass | The reviewed Cursor feature catalog correctly points to `.opencode/runtime-hooks/` and preserves confirmed-vs-registered distinctions |
| `playbook_capability` | fail | 2 dispatch/Codex playbooks retain stale source and executable test paths |

`AC_COVERAGE`: not applicable — this packet has no separate acceptance-criteria coverage gate beyond the checklist itself.

## 8. Deferred Items

- The 3 pre-existing bugs in moved-but-unmodified code (R2-P1-001, R3-P1-001, R3-P1-002) are real and should be fixed, but are out of THIS relocation packet's scope lock (they existed before the move and aren't caused by it). Recommend a separate follow-up packet.
- R5-P2-001 (Cursor→Claude adapter coupling) is a maintainability improvement, not a blocker.
- Iteration 3's security reproduction created a temporary scratch directory outside the four allowed review-write paths (`/var/folders/.../T/guard-spoof-*`) to hold a synthetic mode registry for a targeted forgery reproduction. It was not deleted (deletion is banned for review dispatches). No repository file was modified. This is disclosed here for operator awareness; it does not affect any finding's validity.

## Dimension Expansion Map

- Completed pivots: 0 (linear dimension order followed inventory → correctness → security → traceability → maintainability, `stop_policy=max-iterations` forced all 5 iterations to run without early convergence)
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none — all 4 substantive dimensions plus the inventory pass were covered exactly once each, matching the 5-iteration budget
- Remaining frontier: none within the configured dimension set; a future pass could add a dedicated "dependency portability" dimension given how central R5-P1-001 turned out to be

## 9. Search Ledger

Reducer-owned `searchCoverage`/`candidateCoverage` state (v2 schema, present on iterations 1-5):

| Iteration | Dimension | Required bug classes | Covered | Ruled out | Mode |
|-----------|-----------|----------------------|---------|-----------|------|
| 1 | inventory | stale_path, relative_import_depth, runtime_wiring, validation_runner, ownership_traceability | stale_path, validation_runner, ownership_traceability | relative_import_depth, runtime_wiring | graphless_fallback |
| 2-5 | correctness/security/traceability/maintainability | (dimension-specific, see iteration files) | — | — | graphless_fallback (no coverage-graph DB available in this worktree — `better-sqlite3` missing, see Known Limitations) |

`hasSearchDebt`: false. No blocked or deferred search-ledger rows across any iteration.

## 10. Audit Appendix

### Convergence Summary

`stop_policy=max-iterations` was honored exactly as specified: all 5 iterations ran to completion regardless of per-iteration findings ratio. The coverage-graph convergence step (`convergence.cjs`) could not run in this worktree (missing `better-sqlite3` native module — see review packet's implementation-summary.md Known Limitations), which is immaterial here since `stop_policy=max-iterations` makes graph/inline convergence signals telemetry-only through iteration 4, and iteration 5's hard stop (`maxIterationsReached`) bypasses the legal-stop veto entirely per the workflow's own contract.

### Coverage Summary

- 5/5 iterations produced all 3 required artifacts (iteration narrative, state-log JSONL append, delta file) — verified via `verify-iteration.cjs`, not assumed.
- 0 findings were dropped or lost between iteration JSONL and the reducer-owned findings registry (10 active findings in both).

### Ruled-Out Claims

- Relative import depth and runtime wiring were explicitly ruled out as bug classes in iteration 1 (all 17 discovery symlinks resolve, all 5 touched OpenCode plugin imports load cleanly).

### Sources Reviewed

All 5 iteration files under `review/iterations/`, the full findings registry, and the 84-file commit diff (`git show --stat=200 40d5f0d2b3`) were used to classify each P1 as pre-existing vs. introduced-by-this-work.

---

## Known Environment Limitations (disclosed during this review run, not findings against the relocation itself)

1. **Deep-review runtime infra gaps in a fresh worktree**: this worktree's `node_modules` was incomplete for 3 separate reasons discovered while running this review: `zod` (used by `prompt-pack.ts`), the TypeScript-source `.js`-suffixed sibling-import pattern used throughout `system-deep-loop/runtime/lib/deep-loop/*.ts` (requires `tsx`, not plain `node --experimental-strip-types` — the `deep-review-auto.yaml` command's own literal `if_cli_opencode` dispatch script as written does not run under bare Node; this is a real, reportable gap in the command's own infrastructure, separate from anything found about the hook relocation), and `better-sqlite3` (coverage-graph convergence). Worked around via a read-only `.opencode/node_modules` symlink to the main tree and by invoking the dispatch script through `tsx` instead of `node --experimental-strip-types`.
2. **Bare model string fails**: the pre-bound setup's `executor_model: gpt-5.6-sol` (without the `openai/` provider prefix) fails opencode's model resolution with a generic `UnknownError`/"Unexpected server error" rather than a clear "model not found" message. Corrected to `openai/gpt-5.6-sol` after confirming via `opencode models openai` and a minimal standalone repro. Worth a documentation fix in the `deep-review` command's presentation contract or `cli-opencode` SKILL.md so future dispatches don't hit the same opaque failure.

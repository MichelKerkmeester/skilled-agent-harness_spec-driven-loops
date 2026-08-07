# Iteration 008 — spec-folder doc integrity + completion claims

**Focus:** spec-folder doc integrity + completion claims. Review packet 122 docs (002/003/004/005 spec.md + implementation-summary.md + graph-metadata.json). Check completion claims match reality (statuses, test counts, what shipped vs deferred), no contradictory states, continuity fields valid, no fabricated/overclaimed numbers.

---

## Findings

### P1 — Phase 003 spec claims "Complete" but rename is uncommitted

- **Severity:** P1
- **File:** `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:29`
- **Issue:** Spec says `Status: Complete — narrow rename done + Opus-audited clean`, but `implementation-summary.md:60` explicitly states `**Not committed yet:** the rename spans shared infra across ~180 files; committing scoped to the surface ... is the recommended next action to protect it from the active parallel-session-revert hazard before Phase 004 builds on it.` The Phase 003 work is done but not git-committed, making it vulnerable to a parallel-session revert. "Complete" without the uncommitted caveat misrepresents the delivery state.
- **One-line fix:** Add "(pending commit)" to the Phase 003 spec status line, e.g. `Status: Complete (pending commit) — narrow rename done + Opus-audited clean`.

---

### P1 — Phase 003 _memory.continuity shows completion_pct:100 while implementation-summary notes uncommitted state

- **Severity:** P1
- **File:** `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement/spec.md:18` / `implementation-summary.md:60`
- **Issue:** `_memory.continuity` block in spec.md (line 18) shows `completion_pct: 100`, but the implementation-summary itself (line 60) flags "Not committed yet" as a hazard. This internal contradiction within the same phase docs makes the _memory block unreliable as a continuity record — a future `/spec_kit:resume` would show 100% complete with no blockers, obscuring the commit vulnerability.
- **One-line fix:** Add a blocker entry in `_memory.continuity` noting the commit-pending hazard, or adjust `completion_pct` to reflect the post-implementation pre-commit state (e.g., 95).

---

### P1 — validate.sh --strict "green" claimed in success criteria but no exit-code evidence in docs

- **Severity:** P1
- **File:** `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/005-validation-and-docs/spec.md:50`
- **Issue:** Phase 005 spec success criteria (line 50) states `validate.sh --strict green for parent + all active children`. No doc in the packet (spec.md, implementation-summary.md) shows the actual validate.sh exit code or output. Phase 003 impl-summary (line 36) shows a table row citing `validate.sh --strict` but does not show exit code; Phase 005 impl-summary (line 14, 39) references the result but does not cite the raw output. Without evidence, "green" is an assertion, not a verified fact.
- **One-line fix:** Cite the actual validate.sh stdout/exit code in the verification evidence section, e.g. `validate.sh 005 --strict → exit 0, 0 errors, 0 warnings`.

---

### P2 — Phase 004 impl-summary retracted test counts; current 208/20 cited by Phase 005 without separate verification

- **Severity:** P2
- **File:** `.opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/005-validation-and-docs/implementation-summary.md:14` and `004/implementation-summary.md:51`
- **Issue:** Phase 004 impl-summary (line 51) honestly retracts earlier inflated claims (23/23, 256/256, 274/274) before stating 208/20. Phase 005 impl-summary (line 14) cites "Opus hardening gate SHIP (208/208, 0 P0/P1)" referencing the Phase 004 count without independent verification. The 208/20 count has only one source (Phase 004) and Phase 005 does not re-run or re-confirm it. The earlier retraction is laudable honesty, but Phase 005 citing the same number without re-verification is weak.
- **One-line fix:** Phase 005 hardening gate should include its own vitest run result (e.g. "re-ran suite from scripts/ → 208 passed, 0 failed") rather than relying on Phase 004's count.

---

## Verdict

The packet docs are generally well-maintained with honest self-corrections on test counts (Phase 004's retraction of 23/23 → 208/20). However, three P1 issues reduce confidence in the completion claims:

1. Phase 003 "Complete" status is undermined by the uncommitted state; the parallel-session revert hazard is documented but not reflected in the status or _memory block.
2. Phase 003 _memory.continuity contradicts its own narrative on completion.
3. validate.sh "green" is asserted in success criteria without cited exit evidence.

The parent packet status (all 5 phases complete) and child phase statuses (all graph-metadata "complete") are internally consistent but rest on the Phase 003 commit gap.

Review verdict: CONDITIONAL

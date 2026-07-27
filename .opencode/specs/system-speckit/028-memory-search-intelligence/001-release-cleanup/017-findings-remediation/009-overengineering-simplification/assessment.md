---
title: "Over-Engineering Assessment"
description: "Per-subsystem verdict on five over-engineering findings: what the complexity costs, whether it is earned, the simpler shape, and what adopting it would take. Nothing was executed."
trigger_phrases:
  - "overengineering assessment"
  - "017 phase 009 assessment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/009-overengineering-simplification"
    last_updated_at: "2026-07-27T16:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Assessed five subsystems; executed nothing"
    next_safe_action: "Operator approves per-item before any simplification runs"
    blockers:
      - "HALT: execution requires explicit per-item operator approval"
    key_files:
      - "assessment.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-017-009"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which of these five, if any, does the operator approve for execution?"
    answered_questions: []
---
# Over-Engineering Assessment

Five subsystems assessed. **Nothing was executed.** Each entry gives a verdict, the simpler shape if
one exists, and what adopting it would cost. Execution requires explicit per-item approval.

Ranked by value against risk, best first.

---

## A-001 — `metrics-stub.ts`: NOT EARNED, cheapest fix here

**What is there**: a 12-line module whose `isSpeckitMetricsEnabled()` returns `false` unconditionally
and whose `speckitMetrics` object has empty method bodies. Five production modules carry guarded
metrics calls behind it.

**Verdict**: not earned. Five call sites pay a readability cost for a provider that can never emit.
This is not a feature flag — nothing can turn it on.

**Simpler shape**: delete the stub and the five guard sites. If metrics are wanted later, add them
when there is a real provider.

**Adoption cost**: small and mechanical. Five call sites in one package. The only risk is that a
future metrics implementation was planned against this interface, which the code gives no evidence of.

**Recommendation**: approve. Highest value-to-risk ratio in this phase.

---

## A-002 — `shared-payload.ts` triplication: PARTIALLY EARNED

**What is there**: three files of the same name totalling 2,373 lines —
`system-spec-kit` (1,074), `system-skill-advisor` (1,099), `system-code-graph` (200).

**Measured**: the spec-kit and skill-advisor copies differ by **68 whitespace-normalized lines** out
of roughly 1,080. They are about 94% identical. The code-graph copy is a different, much smaller
thing that happens to share the name.

**Verdict**: partially earned. Two near-identical 1,000-line files are real duplication; the third is
not. The finding's own note records an isolation rationale, and that rationale is worth taking
seriously — these are three independent MCP servers, and a shared dependency couples their release
cycles.

**Simpler shape**: extract the ~94% common surface of the two large copies into one shared module,
leave the code-graph file alone. Do not unify all three.

**Adoption cost**: moderate and genuinely risky. It creates a coupling between two MCP servers that
are currently independent, and the 68 differing lines have to be understood before they can be
reconciled — some may be deliberate per-server behaviour rather than drift.

**Recommendation**: investigate the 68 lines before deciding. If they are drift, extract. If they are
deliberate, document the isolation rationale in each file and close the finding.

---

## A-003 — Three launcher programs: EARNED, with a caveat

**What is there**: `mk-spec-memory-launcher.cjs` (2,024), `mk-code-index-launcher.cjs` (1,944) and
`mk-skill-advisor-launcher.cjs` (1,497) — 5,465 lines, plus a shared supervision library under
`bin/lib/` of roughly 3,995 lines.

**Measured**: all three launchers already require the shared library. The common supervision logic is
factored out; what remains per-launcher is genuinely per-daemon.

**Verdict**: earned. The finding characterises this as three programs "intentionally implementing
divergent supervision", and the word intentionally is doing real work. Each launcher supervises a
different daemon with different readiness semantics, different failure modes and different recovery.

**Simpler shape**: none that is clearly better. Merging them behind a configuration surface trades
1,500 lines of explicit per-daemon code for a configuration language that would have to express the
same divergence less legibly.

**Adoption cost**: high, and the payoff is negative. Not recommended.

**Recommendation**: close as earned. Document the divergence rationale so the next audit does not
re-raise it.

---

## A-004 — sk-git's 149-line router: EARNED BY CONVENTION

**What is there**: 149 lines of Python-shaped pseudocode in `sk-git/SKILL.md` defining five intents
and their resource loading.

**Measured**: sk-git carries 14 router structural markers; `sk-doc`, `sk-prompt` and `sk-code` carry
9 each. sk-git's router is heavier than its siblings but uses the identical convention.

**Verdict**: earned by convention, not by its own merit. In isolation, 149 lines of pseudocode to
route five intents is disproportionate. In context, every skill hub in this repository uses the same
shape, and sk-git is about 1.5 times its siblings rather than an outlier in kind.

**Simpler shape**: a compact intent table would express the same routing in a fraction of the space —
but only if the convention changes repo-wide. Changing one skill makes it the inconsistent one.

**Adoption cost**: low for sk-git alone, high for the convention. Doing it to sk-git only makes the
codebase less uniform, not more.

**Recommendation**: close as out of scope. If the router convention is genuinely too heavy, that is a
repo-wide documentation-standard decision, not a per-skill cleanup.

---

## A-005 — Resume adapter and shadow-parity pair: UNRESOLVED, MEASUREMENT DISPUTED

**What the finding claims**: a 4,667-line resume and shadow-parity pair composing "a parallel
transactional architecture not required by the loop".

**Measured**: the resume adapter directory totals 1,520 lines. Shadow-parity code is spread across
several directories rather than being one paired module, and the pieces measured so far are small
(109 and 31 lines in two policy shadows). The claimed 4,667 could not be reproduced as a single pair.

**Verdict**: cannot be assessed on the evidence available. The claim may be aggregating across
directories that are not actually one subsystem, which is the same aggregation error that produced
two miscounts in phase 008.

**Simpler shape**: unknown until the real boundary is established.

**Adoption cost**: unknown. This is the highest-risk item in the phase and the least understood.

**Recommendation**: do not act. Re-scope the finding first: establish what "the pair" actually is,
measure it, and reassess. Acting on a subsystem whose boundary is disputed is how working
architecture gets broken.

---

## Summary

| Item | Verdict | Recommendation |
|------|---------|----------------|
| A-001 metrics stub | Not earned | Approve — small, mechanical, clear |
| A-002 shared-payload | Partially earned | Investigate the 68 differing lines first |
| A-003 launchers | Earned | Close; document the rationale |
| A-004 sk-git router | Earned by convention | Close; repo-wide decision if at all |
| A-005 resume/shadow pair | Unresolved | Re-scope before any action |

One of five is a clear approve. Two are earned complexity that should be documented rather than
removed. One needs investigation before a verdict. One cannot be assessed because its measurement
does not reproduce.

That distribution is worth noting on its own: the over-engineering category began with three approved
findings and two routed in, and after measurement only one is straightforwardly actionable. Size is
not the same as excess, and an aggregate line count across directories is not a subsystem.

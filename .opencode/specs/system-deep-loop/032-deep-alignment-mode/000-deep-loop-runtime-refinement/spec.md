---
title: "Feature Specification: system-deep-loop Runtime Remediation (from dogfood findings)"
description: "Triaged remediation plan for real bugs found by the 008-divergent-mode-dogfood run's research and review loops against system-deep-loop's own runtime, subskills, and agent definitions. Tier 1+2 fixes applied and test-gated; Tier 3 deferred to a follow-up pass."
trigger_phrases:
  - "system-deep-loop remediation"
  - "dogfood findings remediation"
  - "deep-loop reducer bugs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/000-deep-loop-runtime-refinement"
    last_updated_at: "2026-07-11T21:43:06Z"
    last_updated_by: "claude"
    recent_action: "Tier 1+2 remediation applied and test-gated"
    next_safe_action: "Track Tier 3 items in a follow-up pass"
    blockers: []
    key_files:
      - "../../052-deep-loop-unification/008-divergent-mode-dogfood/research/research.md"
      - "../../052-deep-loop-unification/008-divergent-mode-dogfood/review/deep-review-findings-registry.json"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator confirmed Tier 1+2 fixes 2026-07-11; Tier 3 deferred to a design pass"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: system-deep-loop Runtime Remediation (from dogfood findings)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (Tier 1+2 applied + test-gated; Tier 3 deferred to follow-up) |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Successor** | 001-research-and-context |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `052-deep-loop-unification/008-divergent-mode-dogfood` ran two real, evidence-heavy 10-iteration loops (`/deep:research`, `/deep:review`) against `system-deep-loop`'s own runtime, four subskills, `deep/*` commands, and agent definitions — discovery-only by design, so nothing found was fixed. Between them, the two loops surfaced 62 findings (47 research: 41 P1/6 P2; 15 review: all P1, 0 P0), several independently corroborated by both loops using different methods. These are real, evidenced, currently-live defects in production skill infrastructure, not yet acted on.

### Purpose
Triage the findings, confirm a prioritized subset genuinely worth fixing now, and (once confirmed) fix them with the same verification discipline this repo already uses for shared infrastructure — independent testing, no unrelated scope creep, regenerated compiled artifacts where relevant.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (this planning pass)
- Triage all 62 findings into: high-confidence + clearly-scoped (candidates for this packet), needs-more-investigation, and out-of-scope/disputed.
- Document the triaged candidate list with file:line evidence pointers back to the source findings.
- Propose a phased remediation order for the confirmed candidates.

### Scope evolution (planning pass → applied)
- Code change was gated on operator confirmation. That confirmation landed 2026-07-11; the Tier 1+2 candidates in §5 were then applied and test-gated (commits `0803969e41`, `3e9892a9c0`, `a8b3f0af01`).
- Tier 3 items (§5) stay out of scope here, deferred to a follow-up pass.
- Re-litigating findings already covered by other open packets (none currently known to overlap) stayed out of scope.

### Files Changed (Tier 1+2 remediation, applied 2026-07-11)

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` | Modify | Fix traceability rollup dropping resolved search-debt |
| `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | Fix `extractListItems` heading-format mismatch (`keyFindings` stuck at 0) |
| `.opencode/agents/deep-research.md`, `.claude/agents/deep-research.md` | Modify | Align canonical agent schema with the live prompt-pack/validator contract |
| `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md` | Modify | Align canonical agent's write-boundary claims with what the prompt pack actually requires |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Every triaged candidate finding cites real evidence (file:line) traceable back to `research.md` or the review findings registry, not re-derived from memory | Each Section 5 entry below includes a direct citation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-002 | Findings that are duplicated/corroborated across both loops are flagged as such (higher confidence) | Section 5 marks cross-loop corroboration explicitly |
| REQ-003 | No remediation code change happens without an explicit operator go-ahead on this packet's scope | SATISFIED — operator confirmed 2026-07-11 before any Tier 1+2 fix landed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every Tier-1/Tier-2 candidate cites real, independently spot-verified evidence (file:line), not relayed purely from the source loop's claim.
- **SC-002**: The triaged list is honest about tier confidence — cross-loop-corroborated findings (Tier 1) are distinguished from single-loop-but-well-evidenced ones (Tier 2), and needs-more-investigation items (Tier 3) are named as such rather than silently dropped or silently promoted.
- **SC-003**: Zero code changes landed before operator confirmation — met; the Tier 1+2 fixes followed the 2026-07-11 confirmation and are test-gated (runtime suite 721/721 green).

### Tier 1 — High confidence, corroborated by both loops independently

1. **Canonical LEAF agent definitions (`deep-research.md`/`deep-review.md`, both `.opencode/agents/` and `.claude/agents/`) instruct a schema and write-boundary the live prompt-pack/validator contract rejects or forbids.** Research iteration 2/3 found this on both agents independently [research.md §5-6]; review's iteration 4 corroborated the review-side conflict from the opposite direction [`R7-P1-001`-class findings, review registry]. A native agent following its own canonical definition gets redispatched or violates a write boundary its own skill's prompt pack sets.
2. **`reduce-state.cjs` has real, reproducible content-extraction bugs on both the research and review side**, both stemming from the same class of mistake (a hand-rolled parser not matching the actual markdown shape iterations produce):
   - Research: `extractListItems` only matches flat bullet lists; every iteration narrative uses H3 sub-headings, so `findings-registry.json.metrics.keyFindings` stayed **0 across all 10 iterations** despite 51 real findings [research.md §4, direct file:line: `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1551-1558`].
   - Review: the traceability rollup drops resolved search-debt from canonical state — iteration 5 executed and failed `checklist_evidence`, but current registry still shows it merely "deferred" [`R10-P1-002`, `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs:1187-1210,1349-1428`].
   - Review also independently reproduced a **coverage-graph gap** (iterations not emitting `graphEvents`, leaving `dimensionCoverage` stuck at 0%) in *both* the destroyed first attempt and the successful retry — confirmed reproducible, not a one-off.

### Tier 2 — High confidence, single-loop but well-evidenced

3. **Council route proof claims `@ai-council` agent identity that the live seat subprocess never actually selects** — false provenance at the process boundary [research.md §6, `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:133-208,256-296`].
4. **Council seat dispatch bypasses the agent's own write boundary under `--dangerously-skip-permissions`**, since the generic seat process never loads the `ai-council` agent's packet-local write restriction [research.md §6, `.opencode/agents/ai-council.md:25-31,118-136`].
5. **Council cost guards compute an upper bound but never enforce it** — unbounded `Promise.all` seat fan-out on any positive config [research.md §7-8].
6. **Live skill-benchmark report can show PASS while masking active P1 evidence and Mode-A-only rerun guidance** [`R10-P1-001`, `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1347-1399`].
7. **Runtime README's `acquireLoopLock`/`releaseLoopLock` quick start doesn't match the published API signatures** [research.md §4, `.opencode/skills/system-deep-loop/runtime/README.md:61-84`] — low-risk doc-only fix.

### Tier 3 — Needs more investigation before committing to a fix (not yet candidates)
- Loop-lock nonce ownership not enforced end-to-end (real, but the exact fix shape needs its own design pass — the CLI's owner-PID-only model may be intentional for the transient-process case this dogfood run itself relied on).
- Deep-improvement's (Lane A) repeatability gate (`minReplayCount:3`) described as "structurally impossible to satisfy as wired" — needs direct reproduction before scoping a fix.
- The remaining ~50 P2-tier findings across both loops (documentation drift, generated-menu duplication, checkout-specific test paths) — lower urgency, candidates for a follow-up batch, not this pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | This is shared production runtime used by every `/deep:research`/`/deep:review`/`/deep:ai-council` invocation repo-wide | A careless fix could regress a widely-used surface | Full existing test suites re-run per fix; independent verify pass per finding, matching the discipline already proven in packet `052-deep-loop-unification/007-comprehensive-deep-review` |
| Risk | Findings came from a single dogfood run of the researched/researcher itself — some risk of the loop's own blind spots | A finding could be a false positive despite citing real file:line evidence | Every Tier-1/Tier-2 finding above was independently spot-verifiable via its cited file:line before being included in this triage — none were taken purely on the loop's word |
| Dependency | `../../052-deep-loop-unification/008-divergent-mode-dogfood/` | Source of all findings in this packet | Read-only reference, not modified by this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED (2026-07-11): operator confirmed the Tier 1+2 candidates in §5; they were applied in dependency order and test-gated. Tier 3 deferred to a follow-up pass.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
**Given**
**Given**
**Given**
-->

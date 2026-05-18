---
title: "Council Report: 108-auto-review-quick-wins-verdict-markers-logging Pre-Implementation Review"
description: "Multi-seat council deliberation on packet 108 scaffold by cli-codex gpt-5.5 xhigh fast. Verdict + recommended plan + per-seat critiques + risks."
trigger_phrases:
  - "108 council report"
  - "auto-review uplift council verdict"
importance_tier: "important"
contextType: "review"
---

# Council Report: 108-auto-review-quick-wins-verdict-markers-logging Pre-Implementation Review

## 1. Council Composition

| Seat | Lens | Bias / Rationale |
|------|------|------------------|
| Seat 001 | Risk | What goes wrong; HIGH/MEDIUM/LOW risk inventory |
| Seat 002 | Scope | Phase boundaries, MVP shape, packet 109 question |
| Seat 003 | Implementation | File:line accuracy, effort realism, codebase verification |
| Seat 004 | Skeptic | Should we adopt at all; reject more aggressively? |
| Seat 005 | Cost-Benefit | ROI break-even, alternative tradeoffs |

All seats are simulated inside this single `cli-codex` dispatch. No sub-agents or external CLI executors participated.

## 2. Task Classification

tooling | risk-prevention | governance

## 3. Strategy Comparison

| Strategy | Description | Pros | Cons |
|----------|-------------|------|------|
| A: As-scaffolded (parent + 4 children, council-gated) | Current plan | Keeps phases auditable; separates H-1, H-2, and hook logging; matches packet-local governance | Not approvable as written: Phase 3 misclassifies persistence as diagnostics; Phase 4 contains MVP-worthy H-4 and duplicate/ambiguous H-8 |
| B: Single Level-2 packet instead of phased | Simpler topology | Lower coordination overhead; one validation path | Blurs cross-surface ownership; easier to leak scope across review skills, deep-loop YAML, and hook code |
| C: Fold all teachings into existing skills incrementally | No new packet | Lowest ceremony; lets each surface own its small change | Loses shared acceptance criteria; weak audit trail for cross-skill behavior |
| D: Reject all teachings | No work | Zero implementation risk | Leaves machine-readable verdicts, loop defense, and cheap prompt improvements on the table |

## 4. Seat 001 - Risk

The dominant risk is Phase 3: the scaffold treats all sync writes as diagnostic logging, but one target is a user-facing feedback persistence handler. That turns a performance refactor into a potential data-loss change if implemented literally. Phase 1 and Phase 2 are lower-risk, but their output contracts need exact string decisions before edits begin. Phase 4 is too wide for a child phase unless it is only a parking lot.

- Phase 1 `001-h1-final-line-contract`: MEDIUM risk. The scope asks for final-line exact strings, but the open question still allows Markdown-bold versus plain text in `001/spec.md` section 7 lines 135-136. Choose plain final lines before implementation.
- Phase 2 `002-h2-loop-prevention-markers`: MEDIUM risk. The phase wants first-line markers in review templates and dispatcher scans in `002/spec.md` section 3 lines 70-76, but adding markers to markdown reference files with frontmatter could damage resource parsing.
- Phase 3 `003-h3-async-iife-h6-lazy-mkdir`: HIGH risk. The scope at `003/spec.md` section 3 lines 70-76 and file table lines 85-90 would apply fire-and-forget async writes to persistence paths, including code-graph feedback.
- Phase 4 `004-stretch-goals`: MEDIUM risk. The optional phase is correctly capacity-gated in `004/spec.md` section 4 lines 101-104, but the teaching list in section 3 lines 72-84 is broad enough to restart planning inside implementation.

## 5. Seat 002 - Scope

The phasing is close, but not quite coherent enough to implement. Phase 3 is right to bundle H-3 and H-6 only where both are diagnostic hot-path concerns, because `003/spec.md` section 3 lines 70-76 and file table lines 85-90 target the same two files. That bundle breaks down for `ccc-feedback.ts`, where the write is core feedback persistence rather than disposable diagnostics. Phase 4 is marked optional in the parent success criteria at `spec.md` lines 129-130 and again in the parent iteration plan at lines 166-171, but its own scope includes H-4, which source report line 289 ranks as HIGH-impact LOW-cost and therefore belongs with the MVP or an explicitly deferred packet.

- Keep Phases 1 and 2 separate; their child scopes are clear in `001/spec.md` lines 70-75 and `002/spec.md` lines 70-76.
- Split or rewrite Phase 3: keep lazy mkdir and non-blocking diagnostics for true diagnostic metrics, but use awaited async persistence for feedback writes.
- Move H-4 anti-repetition into MVP Phase 2 or a new small Phase 3; `004/spec.md` lines 72-78 currently buries it among stretch items.
- Make Phase 4 packet 109 or rename it to a non-implementation backlog. `004/spec.md` lines 90-91 says it does not pre-commit to files until kickoff, which is a planning packet shape, not an implementation child.
- Remove or reconcile H-8 duplication. `001/spec.md` lines 98-101 already requires deep-review verdict derivation, while `004/spec.md` line 77 lists H-8 as a future stretch item.

## 6. Seat 003 - Implementation

Several citations are accurate, but the implementation interpretation is not. `sk-code-review` really does have a free-form overall assessment at `.opencode/skills/sk-code-review/SKILL.md:302` through `.opencode/skills/sk-code-review/SKILL.md:309`, and `deep-review` really defines PASS/CONDITIONAL/FAIL at `.opencode/skills/deep-review/SKILL.md:358` through `.opencode/skills/deep-review/SKILL.md:372`. The deep-loop template paths are also real: `.opencode/skills/deep-review/SKILL.md:83` points to `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`, and `.opencode/skills/deep-research/SKILL.md:88` points to `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl`. The blocker is that Phase 3's target code does more than debug logging.

- The `rg` check confirms sync operations in `metrics.ts`: import at `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:6`, mkdir at `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:219`, and write at `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:247`.
- `metrics.ts` uses a bounded writer: it reads existing JSONL lines at `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:233` through `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:240`, pushes one line at `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:246`, then rewrites the last records at `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:247`. A plain async `appendFile` would silently drop the retention behavior.
- The `rg` check confirms sync operations in `ccc-feedback.ts`: import at `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:6`, mkdir at `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:50`, and append at `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63`.
- `ccc-feedback.ts` is an async MCP handler at `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:18`; it writes to a feedback file at `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:47` and returns an error if persistence fails at `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:64` through `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:72`. Fire-and-forget would change the user-visible contract.
- The current deep-review prompt has a verdict section at `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:33` through `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:35`, but it is not a final-line exact-string contract.
- The current deep-research prompt starts with a normal heading at `.opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl:1`, not `DEEP-RESEARCH`; the deep-review prompt likewise starts with `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:1`, not `DEEP-REVIEW`.
- The `sk-code-review` reference checklists start with YAML frontmatter at `.opencode/skills/sk-code-review/references/code_quality_checklist.md:1` through `.opencode/skills/sk-code-review/references/code_quality_checklist.md:4` and `.opencode/skills/sk-code-review/references/security_checklist.md:1` through `.opencode/skills/sk-code-review/references/security_checklist.md:4`. Adding a marker above that frontmatter would be a format change, not a harmless prompt header.

## 7. Seat 004 - Skeptic

Adopt the intent, not the upstream shape wholesale. The source report itself says event-driven activation, cross-model selection, and child-session isolation do not translate to the LEAF skill model in `106/research/review-report.md` lines 370-378, so the council should reject any drift back toward those mechanisms. The quick-win teachings are useful, but H-8 looks redundant with H-1 for deep-review verdict emission, and Phase 3 overgeneralizes diagnostic logging into persistence. The most defensible adoption set is H-1, H-2 with correct prompt-rendering placement, H-4 anti-repetition, H-6 lazy mkdir where safe, and an awaited async write refactor only where it preserves existing semantics.

- Keep H-1: machine-readable final lines are directly supported by source report lines 317-331.
- Keep H-2, but implement marker checks at the rendered prompt/dispatcher boundary, not by corrupting markdown resource frontmatter.
- Move H-4 out of stretch. Source report line 289 ranks it HIGH-impact LOW-cost, and it is a review-safety rule with little implementation burden.
- Reject H-8 as a separate teaching unless the specs define how it differs from H-1's deep-review verdict line.
- Reject fire-and-forget on `ccc-feedback.ts`; use awaited `fs.promises.appendFile` or leave the sync write until a real latency problem is measured.

## 8. Seat 005 - Cost-Benefit

The one-time 5-8h MVP is justified if it stays focused on cheap correctness and guardrail improvements. The source model says auto-review-every-idle costs range from $1.08/month low-end to $31.50/month typical and $180/month high-end in `106/research/review-report.md` lines 200-203, with break-even at preventing 1-2 hours of rework or one CI failure per month in line 204. Packet 108 is cheaper than that recurring model because it is mostly prompt and local tooling work, and the source estimates 5-8h for MVP at line 418. The ROI weakens only if Phase 3 becomes a broad async persistence rewrite or Phase 4 is allowed to absorb 8-12h before the MVP proves value.

- ROI-positive now: H-1 and H-2 reduce automation ambiguity and loop risk with low implementation cost.
- ROI-positive but missing from MVP: H-4 anti-repetition is a cheap rule that prevents review agents from turning into implementers.
- ROI-uncertain: Phase 3 performance claims need measurement because source report lines 353-366 discuss diagnostic logging, while `ccc-feedback.ts` is feedback persistence.
- ROI-negative now: Phase 4 as an implementation child. Source report lines 413-418 already frames it as optional stretch work with 8-12h extra effort.

## 9. Deliberation Notes

All seats agree the packet should not be rejected outright. The upstream research is useful, the top teachings are small, and the parent gate correctly prevents implementation before this review. The shared objection is that the scaffold confuses "sync file write" with "diagnostic log" in Phase 3, which would allow a lossy fire-and-forget write where the current code intentionally reports persistence errors.

The main disagreement is how much topology to keep. Scope and cost-benefit prefer making Phase 4 packet 109, while risk would accept it as a non-implementation backlog if clearly marked. The convergence point is narrower: request changes now, then re-review or proceed only after the specs state exactly which writes are diagnostic, which writes are authoritative, and which teachings are MVP.

## 10. Recommended Plan

**Verdict**: REQUEST-CHANGES

Required spec edits before implementation:

1. Rewrite Phase 3 so `ccc-feedback.ts` is not treated as fire-and-forget diagnostic logging. If changed, it should use awaited async persistence and preserve the error contract shown at `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:64` through `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:72`.
2. Rewrite the `metrics.ts` Phase 3 plan to preserve bounded-retention semantics from `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:233` through `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:247`; do not replace it with naive append-only logging.
3. Move H-4 anti-repetition into the MVP or explicitly defer it to packet 109. Do not leave it as an optional stretch item while the parent claims to adopt the quick wins.
4. Decide H-1 exact-string shape before implementation: use plain final lines, not Markdown-bold labels, unless downstream parser requirements explicitly demand Markdown.
5. Fix Phase 2 placement: markers should be injected into rendered prompts or dispatcher-owned prompt packs, not above YAML frontmatter in `sk-code-review` reference resources.
6. Resolve H-8 duplication with H-1's deep-review verdict contract. Either remove H-8 from Phase 4 or define the distinct additional behavior.
7. Convert Phase 4 into packet 109 or mark it as a backlog-only child with no implementation work in packet 108.

## 11. Plan Confidence

Confidence: HIGH - convergence: 5/5 seats agreed on REQUEST-CHANGES

## 12. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Fire-and-forget write loses code-graph feedback | HIGH | Use awaited async write for authoritative persistence, or leave sync behavior until measured |
| `metrics.ts` retention changes from bounded rewrite to append-only growth | HIGH | Preserve `maxRecords` trimming in the refactor; test retention with more than max records |
| Marker headers break markdown frontmatter in sk-code-review resources | MEDIUM | Inject markers at rendered prompt boundary, not before resource frontmatter |
| H-1 exact-string contract remains ambiguous | MEDIUM | Pick plain final-line strings and add parser smoke tests before code edits |
| Phase 4 absorbs MVP schedule | MEDIUM | Move Phase 4 to packet 109 or make it backlog-only until Phases 1-3 plus H-4 are complete |

## 13. Winning Strategy

Strategy A is the closest winning strategy, but not as scaffolded. Keep the parent-plus-children topology after the required spec edits, with Phase 4 moved to packet 109 or reduced to backlog metadata. Strategies B and C are weaker because they lose the cross-surface audit trail; Strategy D is too conservative because H-1, H-2, and H-4 are clearly useful and cheap.

## 14. Implementation Steps

Not applicable until packet 108 specs are edited and the revised scaffold is approved.

## 15. Prerequisites

- Operator/spec author applies the required edits in §10.
- Revised Phase 3 explicitly separates diagnostic metrics from authoritative persistence.
- Revised Phase 2 identifies the exact rendered prompt insertion points.
- Revised H-1 specifies exact final-line strings and parser expectations.
- A follow-on approval or re-review references this council report before implementation starts.

## 16. Cross-References

- Source findings: `106/research/review-report.md`
- Packet under review: `108/spec.md` + 4 child specs
- Pinned upstream SHA: `cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9`

## 17. Dropped Alternatives

Strategy B is dropped because a single packet would make unrelated prompt, YAML, and hook changes harder to review independently. Strategy C is dropped because incremental skill edits would weaken the audit trail and make it easier to miss cross-surface consistency. Strategy D is dropped because the source findings support adopting at least the cheap safety and parseability improvements, especially H-1, H-2, and H-4.

## 18. Planning-Only Boundary

This council does NOT implement. Implementation happens only after a separate dispatch references this council-report.md and proceeds per the Recommended Plan §10.

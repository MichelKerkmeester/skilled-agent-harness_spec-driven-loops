# Iteration 004 — External Reference Migration & Advisor Corpus

**Focus:** Validate child 003's external-reference surface (Q4), especially the highest-risk `system-skill-advisor` routing corpus (constants + divergences ledger + parity tests).
**Status:** complete · **newInfoRatio:** 0.45 · **Lineage:** glm52-2

## Approach
Grepped `system-skill-advisor/` for `deep-loop-workflows|MERGED_DEEP_SKILL_ID|deep-loop-runtime` and read the divergences ledger + parity test structure; cross-checked commands surface (`deep-loop-runtime` in `.opencode/commands/`).

## Findings

### F4.1 — Advisor corpus correctly flagged highest-risk; constant pair confirmed unguarded [CONFIRM]
`MERGED_DEEP_SKILL_ID` is imported and branched on in `advisor-recommend.ts:15,266` (`recommendation.skill === MERGED_DEEP_SKILL_ID`). Spec 003 §6 Risk: the constant is hand-authored + duplicated across `skill_advisor.py` and `aliases.ts` with **no drift-guard cross-checking the pair**. Confirmed — one can be updated and the other silently missed. Stage C explicit manual-verify pair is the right mitigation; the follow-up "extend the drift-guard" hardening is worth tracking.
[SOURCE: system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:15,266; 003/spec.md:125]

### F4.2 — Divergences ledger volume is high; field-scoped rename approach confirmed correct [CONFIRM + AMPLIFY]
`local-native-approved-divergences.json` holds 40+ entries whose label keys (`gold`, `nativeTop`, `localTop`) are set to `deep-loop-workflows`, each with a `reason` narrating the deep-loop merge re-baseline. Spec 003 §3's "field-scoped label rename (skill_top_1/nativeTop/localTop/gold), never reason text" is the correct, safe approach — confirmed the skill name does not appear inside prompt text, only label keys. But the *volume* (40+) is larger than "3 fixture files + 2 constants" implies: REQ-004's manual re-approve (reviewed `reason` updates, not silent drift) is therefore more labor than a quick find/replace. `local-native-divergence-ratchet.vitest.ts` is the gate.
[SOURCE: system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:30-731; 003/spec.md:74,97,126]

### F4.3 — NEW RISK: one divergence entry targets `deep-loop-runtime` directly (anomaly) [RISK, unresolved]
`local-native-approved-divergences.json:530` carries `"nativeTop": "deep-loop-runtime"` (not `deep-loop-workflows`). After the merge, runtime is **non-routable infrastructure** (no `graph-metadata.json`, no advisor identity, no workflowMode). A blind field-scoped rename to `system-deep-loop` would promote this entry to the hub id — but the *reason* it diverged (a standalone runtime routing target) no longer exists. Child 003 does not address this single entry. **Decision needed during 003 execution:** either (a) re-point it to the merged hub id if the underlying prompt still legitimately routes to the deep-loop family, or (b) remove it (runtime is no longer a standalone routing target). Flagged for the advisor rebuild operator, not silently folded.
[SOURCE: system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:530; 002/spec.md:169]

### F4.4 — Parity tests hardcode the skill id as types + assertions (11+ invariants) [RISK, loud guard]
`routing-parity-deep-skills.vitest.ts:30,53-191` declares `readonly skill: 'deep-loop-workflows'` and asserts `.toBe('deep-loop-workflows')` across 9 invariants (research/review/council routing). `routing-parity-deep-council.vitest.ts:28,107,110` adds 2 more. `advisor-recommend.vitest.ts:288,297` asserts `skill: 'deep-loop-workflows'`. These are **regression gates**: if the rename updates the advisor constant but misses these expectations, the parity suite fails loudly (good). They must ALL move in lockstep with the constant rename. Treat them as the advisor-side exit gate alongside the corpus accuracy re-baseline (003 REQ-003).
[SOURCE: system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts:30-191; routing-parity-deep-council.vitest.ts:28-110; advisor-recommend.vitest.ts:288-297]

### F4.5 — Drift-guard self-references the old path (ordering hazard) [RISK]
`routing-registry-drift-guard.vitest.ts:26` reads `resolve(repoRoot, '.opencode/skills/deep-loop-workflows/mode-registry.json')` and asserts `skill: 'deep-loop-workflows'` (line 76). After rename the path string itself must update to `system-deep-loop/mode-registry.json`, else the guard errors on a missing file. This confirms 003 REQ-001's ordering invariant (`parent-skill-check.cjs` constants fixed FIRST, before trusting any other doctor/advisor output): the very tools that validate the rename reference the old identity. Get the self-check constants right before using them as proof.
[SOURCE: system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:26,76; 003/spec.md:94]

### F4.6 — Commands surface confirmed: 434 hits, runtime-invoked, hash-guarded [CONFIRM]
`/deep:*` commands reference `deep-loop-runtime` via absolute `node .opencode/skills/deep-loop-runtime/scripts/…cjs` calls (research/review/ai-council YAMLs + the `render-command-contract.cjs`/`compile-command-contracts.cjs` front-doors in each command `.md`). These are **runtime-invoked**, not docs. The compiled `*.contract.md` carry a content hash (003 REQ-002: regenerate via the compiler, never hand-edit — a hand-edit desyncs the hash and fails silently at command-invocation). Correctly scoped to 003 Stage A; the absolute-literal string rename (not hop-math — see F2.3) applies.
[SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:160-1294; deep_review_auto.yaml:176-1663; 003/spec.md:92-93]

## Key Questions
- Considered: Q4 (reference migration / advisor corpus)
- Answered: Q4 — surface confirmed; advisor correctly highest-risk; three amplifications: F4.3 (runtime-target anomaly), F4.4 (parity-test volume as loud guard), F4.5 (drift-guard self-reference ordering).

## Ruled Out
- "Blind whole-file find/replace across the advisor corpus" — WRONG (F4.2/F4.3): destroys reviewed `reason` narration and mishandles the runtime-target anomaly. Scope to label field-keys only; re-baseline accuracy, don't text-replace.

## Novelty Justification
Moderate-low novelty (0.45): the advisor-corpus details (F4.3 anomaly, F4.4 parity volume, F4.5 self-reference) are net-new and decision-relevant, but the overall reference-migration pattern is now familiar from iterations 2–3.

## Next Focus
Iteration 5: fallback-router wiring (Q5) — the last open question; confirm zero live callers and decide wire-into-merge vs defer.

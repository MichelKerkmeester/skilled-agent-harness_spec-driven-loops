---
title: "Implementation Summary: Fleet Route-Gold Full-Fix (7 hubs green)"
description: "The route-gold gate — the deterministic hard lane that asserts each hub's router selects exactly the intended modes AND surfaces exactly the intended leaves — went from 6/7 hubs BLOCKED to 7/7 PASS (91 scenarios). Fixes were hub-by-hub via GPT-5.6-SOL xhigh/fast agents, each independently re-verified for honesty (scope-locked, intent-derived gold, no shared-machinery edits, no prose tampering)."
trigger_phrases:
  - "fleet route-gold full-fix"
  - "route-gold gate all hubs green"
  - "hub router precision fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/001-3-tier-consistency-standard"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Route-gold gate full-fix: 7/7 hubs PASS (91 scenarios), pushed to v4"
    next_safe_action: "REQ-001 harness de-skill-specific + REQ-002 convergence, then REQ-006 fleet verification"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 45
    open_questions:
      - "REQ-006 fleet verification (mutation/blind-holdout/live-mode) not yet run — the route-gold gate is deterministic coherence with real teeth, but live routing quality is still inferred"
    answered_questions:
      - "Route-gold reconciliation was ratified as FULL-FIX hub-by-hub (fix real router-precision bugs, not just stale gold) — done for all 7 hubs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Summary: Fleet Route-Gold Full-Fix (7 hubs green)

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-3-tier-consistency-standard |
| **Milestone** | Route-gold gate full-fix (a slice of the packet; Phases per REQ-001/002-full/006/007 remain) |
| **Completed** | Route-gold slice: DONE. Packet overall: ~45%. |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The **route-gold gate** is the deterministic hard lane of the router-replay benchmark. Per playbook scenario carrying authored gold it asserts, against the frozen scorer:
- **intent**: `sameSet(observedModes, expectedModes)` — the hub router must select EXACTLY the intended mode set (no over/under-emission);
- **resources**: `sameSet(observedLeaves, expectedLeaves)` for frontmatter hubs (exact leaf set), or `subset + forbidden` for the sk-code index-table shape.

At session start **6 of 7 hubs were BLOCKED-BY-ROUTE-GOLD**. This milestone took the fleet to **7/7 PASS across 91 route-gold scenarios**, fixing genuine router defects — not by bending gold to a broken router.

### Result (router-mode benchmark, clean committed tree)

| Hub | Verdict | Route-gold | Aggregate | Commit |
|-----|---------|-----------|-----------|--------|
| sk-prompt | PASS | 4/4 | 100 | `5dd0a330a4` |
| mcp-tooling | PASS | 13/13 | 98 | `c8744a5c91` |
| cli-external-orchestration | PASS | 7/7 | 90 | `691418d967` |
| system-deep-loop | PASS | 20/20 | 99 | `6cd8ab14e4` |
| sk-code | PASS | 15/15 | 93 | `0e3528cb32` |
| sk-doc | PASS | 32/32 | 98 | `023b974b12` |
| sk-design | PASS (already) | 0/0 | 94 | — |

### The load-bearing finding: route-gold reconciliation was THREE problems, not "stale paths"

The blocked hubs were not uniform stale gold. Diagnosis split into:
1. **Stale gold, router correct** — `{mode}/SKILL.md` or pre-reorg flat paths where the surface router already emits the right leaf; and, on sk-doc, an OLD uppercase intent vocabulary (`DOC_QUALITY`, `FLOWCHART`) that predated the rename to mode names (`create-flowchart`).
2. **Genuine router-precision defects** — a recurring pattern: a specialized mode carried a generic **catch-all vocabulary class** (`hub-identity` on sk-prompt / cli-external / system-deep-loop; `authoring-actions` on sk-doc) so a hub-generic word fired it. On sk-doc this made a 2-intent request select **eight** modes; on sk-prompt the specialized `prompt-models` outranked the default on the bare word "prompt".
3. **Frontmatter/prose mismatches** — system-deep-loop scenarios whose frontmatter intent (`research`) contradicted their own prose (`ai-council` / `review`). The gold was the bug; the router was right.

### The fixes (all intent-derived)
- **Catch-all removal** (the dominant fix): drop the generic vocabulary class from every specialized mode so hub-generic prompts route to the default / defer instead of fanning out. Applied on sk-prompt, cli-external, system-deep-loop, sk-doc.
- **Weight separation**: where a specific signal must beat a generic default beyond the hardcoded `AMBIGUITY_DELTA=1`, widen the weight gap (sk-prompt `prompt-models` 5→6). The benchmark's delta is a fixed constant — `routerPolicy.ambiguityDelta` in the JSON is inert, so precision is tuned via weights/classes, never the delta field.
- **Genuine alias enrichment**: add real natural-language signals (`deeply-reasoned opinion`→Claude, `front-page overview`→create-readme, `since the last version`→create-changelog) that generalize, not one-off holdout phrases.
- **Surface RESOURCE_MAP completeness** (sk-code): the LS-scenarios document "3 language refs + 2 shared refs"; the router under-emitted the two shared refs — added them (real files) rather than weakening gold.
- **Gold reconciliation**: flat `expected_resources` and typed `expected_leaf_resources` refreshed to the real current leaf, and frontmatter intent corrected to the scenario's own prose. No scenario prose was altered.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Execution model**: sk-prompt done directly (the proof-of-recipe, establishing the exact fix + verification), then the remaining 5 hubs fanned out to **GPT-5.6-SOL xhigh/fast agents** via `codex exec` (one per hub; mcp-tooling first as a brief-validation dispatch, then 4 concurrently on disjoint trees). Each agent got an airtight brief encoding the gate semantics, the anti-circularity rule (derive the correct answer from scenario prose, fix the router to emit it, set gold to it — never copy router output), a hard scope-lock (own hub only; no shared benchmark machinery; no git), and the verify loop.

**Independent verification of every agent** (finding = hypothesis): for each returned hub I re-ran the route-gold gate myself, checked `git diff` scope (own hub only; no `scripts/`/`mcp_server/`/`dist`), confirmed the leaf-manifest byte-stable, verified every newly-added resource path exists on disk (no phantoms — matters because subset semantics let a phantom slip), and spot-checked changed gold against scenario prose to rule out circularity. All five agents passed; only cli-external's added keywords sat on the edge (semantically-grounded, judged acceptable).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Full-fix hub-by-hub (fix router bugs), not gold-only | Operator-ratified. A gold-only pass cannot honestly clear a hub whose router genuinely mis-selects — bending gold to a broken router measures nothing (the 3-model circularity finding). |
| Remove the generic catch-all class from specialized modes | The over-emission root cause fleet-wide: a shared class gave every specialized mode the full base weight on hub-generic vocab, so within the ambiguity delta they all co-fired. |
| Tune precision via weights/classes, never the JSON `ambiguityDelta` | The benchmark's `AMBIGUITY_DELTA` is a hardcoded constant; the config field is not read by the scorer, so editing it is an inert no-op. |
| Correct frontmatter intent TO the scenario prose | Where frontmatter and prose disagreed, prose is the authored source of truth; this surfaced and fixed a real pre-existing authoring bug. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Fleet route-gold sweep (clean tree)**: 7/7 hubs PASS; 91 scenarios (4+13+7+20+15+32) matched, 0 violations; aggregates 90–100.
- **Per-hub, independently re-run** after each agent: gate PASS, manifest byte-stable, scope-locked, added leaves exist, no prose tampering.
- **Working tree clean; all 6 commits pushed to `skilled/v4.0.0.0`.**
- **Not touched**: shared scorer (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`), any `mcp_server/`, any `dist/`.

### Remaining (packet 020, beyond this milestone)
- **REQ-001**: de-skill-specific the shared harness (classifier + gold-derivation) so tiers score identically.
- **REQ-002 (full)**: converge every unit to one router shape + frontmatter typed-gold (index-table → frontmatter).
- **REQ-006**: fleet verification with teeth — mutation test, blind independently-authored holdout, live-mode with precision + confusion matrices, Layer-0 right-skill pass. The route-gold gate is deterministic coherence with real teeth (it caught genuine router bugs), but **live routing quality remains inferred, not measured**.
- **REQ-007**: advisor `skill-graph.json` uniform fleet coverage.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Deterministic layer only.** The route-gold gate proves the config resolves the intended (mode, leaf) sets for the authored scenarios. It does not prove a live model routes real natural-language requests correctly (REQ-006).
- **Keyword enrichment edge.** Adding genuine intent signals to a keyword router is the correct way to improve it, but a holdout scenario's value drops when its phrasing is added to vocab. Additions were kept semantically general (they route other same-intent prompts), not one-off phrase matches — but this is a judgment boundary, re-checked per hub.
- **Strict spec validation deferred to main tree.** The worktree lacks gitignored deps (`zod`), so `validate.sh --strict` and generator re-runs execute on `main` post-merge, per the large-reorg discipline.
<!-- /ANCHOR:limitations -->

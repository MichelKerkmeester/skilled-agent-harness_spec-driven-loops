---
title: "Implementation Summary: Collapse sk-code from 8 sub-skills to 4"
description: "Executed summary for the sk-code four-sub-skill collapse: workflow modes dissolved into shared doctrine, animation folded into Webflow, routing and references reconciled, Lane-C held at CONDITIONAL 71, and deviations recorded."
trigger_phrases:
  - "phase 22 implementation summary"
  - "sk-code four subskills summary"
  - "collapse sk-code summary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/022-collapse-to-four-subskills"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "sk-code collapsed to four sub-skills; router-final held CONDITIONAL 71"
    next_safe_action: "None; implementation packet is shipped and pushed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-022-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Is this packet complete?"
        answer: "Yes. The sk-code parent hub now has exactly four sub-skills, dissolved-mode content is preserved, routing is reconciled, and router-final remains CONDITIONAL 71."
      - question: "What remains deferred?"
        answer: "Live-mode benchmark re-baseline remains deferred because router mode is the deterministic CI gate."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-collapse-to-four-subskills |
| **Status** | Complete |
| **Level** | 2 |
| **Actual Effort** | Two pushed stages completed: structural sk-code collapse in `2cd3b3f7a9`, then playbook gold and Lane-C benchmark re-baseline in `6c0d9959b9`; live-mode re-baseline deferred by scope |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 022 completed the sk-code parent hub collapse from eight sub-skills to exactly four. `code-implement`, `code-debug`, and `code-verify` were dissolved by consolidating their generic doctrine into `shared/references/workflow_{implement,debug,verify}.md`, symlinking that doctrine into both surviving surface skills, and relocating real assets without loss. `code-animation` was folded into `code-webflow` as non-skill animation references/assets. Routing metadata, external references, manual testing playbook gold, benchmark harness expectations, and `benchmark/router-final/` were reconciled to the surface-primary two-axis model. The deterministic Lane-C gate held at CONDITIONAL 71.

### Files Changed

| File | Action | Purpose | Commit |
|------|--------|---------|--------|
| `.opencode/skills/sk-code/code-{implement,debug,verify}/` | Deleted after relocation | Dissolve near-empty workflow-mode sub-skills after doctrine, scripts, and checklists were preserved | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/code-animation/` | Folded into Webflow and removed as a skill | Move animation references/assets under `code-webflow` and drop the separate animation surface | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/shared/references/workflow_{implement,debug,verify}.md` | Added | Preserve generic implement/debug/verify doctrine once in shared references | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/code-{opencode,webflow}/references/` | Updated | Symlink shared workflow doctrine into both surviving surface skills | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/` | Updated | Preserve dissolved verify scripts under the opencode surface assets | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/code-webflow/{references,assets}/animation/` | Added | Preserve folded animation references and assets as Webflow-owned non-skill resources | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/{hub-router.json,mode-registry.json}` | Updated | Drop dissolved-mode and animation-skill routing and trim tie-breaks to surviving skills | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Updated | Repoint animation resources to Webflow and remove dissolved-mode routes from RESOURCE_MAP | `2cd3b3f7a9` |
| `.opencode/agents/*` and specs/docs references | Updated | Repoint external references off dissolved sub-skills while preserving code-review wiring | `2cd3b3f7a9` |
| `.opencode/skills/sk-code/manual_testing_playbook/**` | Updated | Re-translate gold paths for folded animation and dissolved verify-mode script/checklist moves | `6c0d9959b9` |
| `.opencode/skills/sk-code/benchmark/router-final/` | Regenerated | Record deterministic router-final baseline after the four-sub-skill collapse | `6c0d9959b9` |
| Benchmark harness vitests | Updated | Repoint surface-slice sync, code-surface path parse, and skill-benchmark routing expectations to the two-axis model | `6c0d9959b9` |
| `plan.md` | Added | Record retrospective implementation plan, gates, dependencies, rollback, and effort for packet 022 | close-out doc |
| `tasks.md` | Added | Record completed task ledger and completion criteria with evidence | close-out doc |
| `checklist.md` | Added | Record Level 2 verification checklist and scoped deferrals/deviations | close-out doc |
| `implementation-summary.md` | Added | Record final status, files changed, verification, limitations, and deviations | close-out doc |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet shipped in two pushed stages on branch `system-speckit/028-memory-search-intelligence`. Stage A (`2cd3b3f7a9`) performed the structural collapse: dissolved `code-implement`, `code-debug`, and `code-verify`; consolidated shared workflow doctrine; symlinked doctrine into both surviving surfaces; relocated verify scripts and preserved checklists; folded animation into `code-webflow`; reconciled hub routing and smart-routing maps; repointed external references; restored the verify Iron Law; and repointed rule-copy and verify-script references.

Stage B (`6c0d9959b9`) re-baselined the benchmark layer against the new hub shape. The manual testing playbook gold was re-translated across 17 files, the router-replay surface-slicer was updated so Motion.dev animation is a cross-stack MOTION overlay rather than a Webflow surface leak, three benchmark harness vitests were repointed off dissolved modes, and `benchmark/router-final/` was regenerated. The result held the prior deterministic gate at CONDITIONAL 71.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Collapse to four routable sub-skills | The target model was surface-primary: `code-opencode`, `code-webflow`, `code-review`, and `code-quality` carry the real routing surface |
| Move generic workflow doctrine to shared references | Implement/debug/verify were near-empty shells; shared doctrine preserves the behaviour once without retaining routable sub-skills |
| Symlink shared doctrine into both surfaces | Surviving surfaces remain self-contained for load paths while `shared/` stays the source of truth |
| Fold animation into Webflow as non-skill resources | Motion.dev animation is an overlay on Webflow work, not a standalone routable surface |
| Treat MOTION as cross-stack overlay in router replay | Animation prompts can load alongside either surface without leaking as the old `code-animation` surface |
| Re-baseline deterministic router mode only | Router mode is the CI gate; live mode needs configured provider access and was out of scope |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:blockers -->
## Blockers

None. The structural collapse, zero-loss preservation, routing reconciliation, external reference repointing, benchmark gold re-translation, harness updates, router-final regeneration, and close-out evidence are complete. Remaining items are scoped deferrals or recorded deviations, not blockers: live-mode benchmark re-baseline remains deferred, and the pre-existing harness `intents` routing test received a one-line dissolved-mode gold update to keep the suite green.

<!-- /ANCHOR:blockers -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Evidence |
|-----------|--------|----------|----------|
| Parent hub strict invariants | Pass | sk-code parent hub | parent-skill-check STRICT with `PARENT_HUB_CHECK_STRICT=1` exited 0: all hard invariants passed, 0 warnings |
| Vocabulary sync | Pass | sk-code routing vocabulary | parent-hub vocab-sync exited 0 with orphanAliases [], aliasCollisions [], ownershipDrift [], untypedKeywords [], and phantomTypedKeywords [] |
| Rule-copy canary | Pass | Rule invariants and Iron Law copies | check-rule-copies exited 0: all rule invariants present across 4 exact-string files and 3 Iron Law files |
| Router drift guard | Pass | sk-code router sync | `sk-code-router-sync.vitest.ts` passed 4/4 |
| Full skill-benchmark vitest suite | Pass | Benchmark harness | 107/107 tests passed across 8 files |
| Markdown links | Pass | sk-code markdown links | check-markdown-links completed cleanly with 0 sk-code links flagged |
| Router-final re-baseline | Pass | Deterministic Lane-C gate | Verdict CONDITIONAL, aggregate 71, held against prior CONDITIONAL 71; D5 score 100 |

### Test Coverage Summary

| Area | Result |
|------|--------|
| Hub shape | Exactly 4 SKILL.md remain under sk-code: `code-opencode/`, `code-webflow/`, `code-review/`, and `code-quality/` |
| Content preservation | Workflow doctrine, verify scripts, checklists, and animation resources preserved at their new locations |
| Routing consistency | Parent-hub strict check, vocab-sync, rule-copy canary, and router drift guard all pass |
| Benchmark gate | Full skill-benchmark vitest suite passes 107/107; router-final remains CONDITIONAL 71 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Re-baseline is deterministic | Router-final regenerated in deterministic router mode and held CONDITIONAL 71 | Pass |
| NFR-M01 | Generic workflow doctrine lives once in shared references | Implement/debug/verify doctrine lives in `shared/references/` and is symlinked into both surfaces | Pass |
| NFR-S01 | No content or capability lost | Dissolved-mode doctrine, verify scripts, checklists, and animation resources are preserved at new paths | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Live-mode benchmark re-baseline is deferred because router mode is the deterministic CI gate and live mode needs configured provider access.
2. The packet intentionally did not rewrite `code-review` or `code-quality` internals; those standalone roles were kept as-is by scope.
3. The packet intentionally did not rewrite surface authoring behaviour; it was a structural collapse and routing/benchmark reconciliation.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Ship the collapse as one implementation unit | Delivered in two pushed stages: structural collapse in `2cd3b3f7a9`, then playbook and benchmark re-baseline in `6c0d9959b9` | Coherent, blast-radius-gated units were safer on a shared actively-pushed branch and matched the spec's staging risk mitigation |
| Keep the pre-existing harness `intents` routing test out of scope | Updated one dissolved-mode gold reference in `skill-benchmark.vitest.ts` during Stage B | Leaving it red would have failed the full suite; this was an in-scope re-baseline of dissolved-mode gold and is recorded as a scoped deviation |
| Include live-mode benchmark re-baseline | Deferred | Router mode is the deterministic CI gate; live mode needs configured provider access and was explicitly out of scope |

<!-- /ANCHOR:deviations -->

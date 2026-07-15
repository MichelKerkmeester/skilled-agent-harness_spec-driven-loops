---
title: "Implementation Summary: Manual Playbook Sweep Findings Remediation [template:level_2/implementation-summary.md]"
description: "Verification and outcome record for the manual-testing-playbook FAIL findings remediation: the 485-scenario sweep, the fix-dispatch batches, the blocked/queued findings, and the T-0381 convergence-graph fix."
trigger_phrases:
  - "playbook sweep findings remediation summary"
  - "findings remediation implementation summary"
  - "T-0381 convergence graph fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation"
    last_updated_at: "2026-07-06T19:16:27.470Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed T-0381 (empty deep-loop convergence graph) via a graphEvents prompt-pack contract correction, end-to-end proven through upsert.cjs; closed T-0208 as a confirmed false positive; committed (8967d20e37 fix, fa49443a7c docs) and pushed to origin/system-speckit/004-memory-search-intelligence (local == origin)"
    next_safe_action: "All sweep findings resolved and landed on origin. The only outstanding item is pre-existing packet-wide --strict doc-hygiene debt (template headers/anchors/frontmatter blocks across the older docs), which would need its own dedicated cleanup pass — not a findings issue"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl"
      - ".opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-findings-remediation-blocked-closeout"
      parent_session_id: "2026-07-02-031-findings-remediation"
    completion_pct: 98
    open_questions: []
    answered_questions:
      - "Is the doctor deep-loop empty-signals a real bug or correct 0-node handling? -> Real bug: graphEvents were emitted but silently rejected by a reducer schema mismatch; root cause is an under-specified prompt-pack contract, not convergence.cjs."
---
# Implementation Summary: Manual Playbook Sweep Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-findings-remediation |
| **Completed** | 2026-07-03 |
| **Level** | 2 |
| **Actual Effort** | Multi-session (485-scenario sweep + fix-dispatch batches + blocked-finding close-out) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Remediation of every confirmed FAIL from the 485-scenario manual testing playbook sweep across three subsystems (system-spec-kit, system-code-graph, system-skill-advisor). Work ran in rounds: (1) the sweep itself surfaced ~40 new findings; (2) a GPT-5.5-fast fix-dispatch batch remediated those plus the earlier Phase-1 findings, each result independently verified by Claude via git diff + real test runs + git-stash baselines; (3) a reduced-concurrency redispatch cleared environmental-crash retries and path-scoping misses; (4) 11 remaining blocked/queued Phase-1 findings were dispatched at GPT-5.5-fast xhigh and verified; (5) the two `[B]` blocked findings (T-0381, T-0208) were diagnosed with a GLM-5.2 consult and resolved.

The headline late fix is **T-0381** — the `doctor` deep-loop convergence diagnostic returned empty graph signals for qualifying packets. Root cause was traced (not to `convergence.cjs`, which correctly returns empty signals for a 0-node graph, but) to the iteration prompt-pack's under-specified `graphEvents` contract: it never declared a `kind` field or the canonical edge fields, so executors emitted `{type:"node",label:"question"}` and `{from,to,label}` edges that the reducer (`upsert.cjs` via the `deep_research_auto.yaml` reducer map) silently rejected — every event dropped, graph empty, signals empty.

### Files Changed (this close-out round)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-research/assets/prompt_pack_iteration.md.tmpl` | Modified | Rewrote the graphEvents contract to mandate canonical node `{type,id,kind,label}` and edge `{type,id,source,target,relation}` shapes, enumerating the valid research kind/relation vocabularies inline |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modified | Same fix for the deep-review sibling with the review vocabularies (identical latent bug) |
| `tasks.md` | Modified | Marked T-0381 fixed + T-0208 closed with full root-cause/verification evidence; reconciled all prior-round findings |
| `implementation-summary.md` | Created | This record |

> Prior rounds touched dozens of source/test/doc files across the three subsystems; those are recorded per-finding in `tasks.md` and landed in commits `2e8638071b`, `04abbf4434`, `d9acc6ecb9`, and `8967d20e37`.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Implementation via GPT-5.5-fast / GLM-5.2 dispatch; Claude plans + verifies | Operator directive; keeps an independent verifier on every machine-authored change |
| Verify every FIXED verdict via real test runs + git-stash baselines, never trust self-reports | Caught a real reverted regression (T-0372 first attempt) and a wrongly-deleted annotation (T-0194) |
| Never edit the concurrent session's in-flight files (orchestrator.ts, deep-loop-runtime uncommitted work); hash-snapshot to detect strays | A shared repo with a concurrent session; protects their uncommitted work |
| T-0381 fixed at the prompt-pack contract, not the reducer | The reducer is correct; a "tolerant reducer" would silently accept bad data (the risk GLM flagged) and needed a vocabulary-design decision owned by the other session |
| T-0208 closed as a false positive rather than patched | The drill fails on a skip-gated sandbox stub-shim path miss before any real reap assertion runs; zero production impact |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| T-0381 end-to-end proof | Pass | `upsert.cjs`: OLD shape -> insertedNodes 0 / insertedEdges 0 (reproduces empty-graph symptom); NEW canonical shape -> insertedNodes 2 / insertedEdges 1 (graph populates) |
| Coverage-graph unit/integration | Pass | 16/16 (coverage-graph-db, council-graph-query, review-depth-graph) |
| Template contract alignment | Pass | Both prompt-pack vocabularies match `VALID_KINDS`/`VALID_RELATIONS` in coverage-graph-db.ts exactly |
| Prior-round fixes | Pass | Each finding verified in its own tasks.md entry (targeted + broader suites, git-stash baselines) |

### T-0381 root-cause evidence

- Real failing packet `002-code-graph/research/deep-research-state.jsonl` emits `{type:"node","label":"baseline|candidate|mapping"}` and `{type:"edge","from":..,"to":..,"label":..}`.
- Reducer validates node `kind` against `VALID_KINDS.research=[QUESTION,FINDING,CLAIM,SOURCE]` (`coverage-graph-db.ts:198`) and edges via `e.sourceId||e.source` / `e.targetId||e.target` / `e.relation` (`upsert.cjs:241-243`). None of the emitted shapes match -> all rejected.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| No collision with concurrent session | Zero edits to their in-flight files | Banned-file hash snapshot unchanged across every dispatch; T-0381 fix is template-only | Pass |
| No silent bad-data acceptance | Reducer validation semantics unchanged | Fixed the emitter contract only; reducer untouched | Pass |
| Deterministic reproducibility | Fix provable without a live daemon | Proven directly through `upsert.cjs` against a throwaway in-repo packet | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical packets are not retro-fixed** — the T-0381 contract fix corrects all future deep-research/deep-review runs; existing packets (e.g. `002-code-graph`) keep their old invalid-vocabulary graphEvents and would need a re-run to populate their coverage graph.
2. **Packet-level doc-hygiene debt** — this packet still fails `--strict` on pre-existing issues (template headers, anchors, frontmatter blocks, level-match) that predate this remediation and are not introduced by any finding fix; they would need their own cleanup pass.
3. **T-0208 harness stub** — the skip-gated tri-daemon drill's stub-shim path resolution is left as-is (low value, no production impact); a real reap-divergence check would require fixing the harness first.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Hand T-0381 to the owning session | Fixed it directly | Operator asked to implement; the correct fix turned out to be template-only and collision-free, not the reducer surgery originally feared |
| Fix only the deep-research prompt-pack | Fixed the deep-review sibling too | Identical latent contract bug — closing one and leaving the other would relapse the same empty-graph failure for review loops |

<!-- /ANCHOR:deviations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 addendum (enhanced verification + NFR)
-->

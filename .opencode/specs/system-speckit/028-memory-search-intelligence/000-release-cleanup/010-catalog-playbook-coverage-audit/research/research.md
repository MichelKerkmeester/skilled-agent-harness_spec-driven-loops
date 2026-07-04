---
title: "Research: 028 Feature Catalog and Testing Playbook Coverage Audit [template:research]"
description: "A 20-iteration deep-research audit checking whether the features packet 028 shipped were ever added to the three system skills feature catalogs and testing playbooks. Finds roughly fifty real coverage gaps concentrated in the two skills the 028 release-cleanup never touched, plus an edits-only artifact in the synced skill, and clears one large false-positive cluster."
trigger_phrases:
  - "catalog playbook coverage audit"
  - "feature catalog gap"
  - "testing playbook gap"
  - "code-graph skill-advisor catalog"
  - "028 coverage audit"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/000-release-cleanup/010-catalog-playbook-coverage-audit"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Synthesized 20-iteration catalog/playbook coverage audit research"
    next_safe_action: "Decide whether to close the gaps now or scaffold a cleanup phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/feature_catalog"
      - ".opencode/skills/system-skill-advisor/feature_catalog"
      - ".opencode/skills/system-spec-kit/feature_catalog"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Research: 028 Feature Catalog and Testing Playbook Coverage Audit

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The question: did packet 028 ship features into the three daemon-backed system skills (system-spec-kit, system-code-graph, system-skill-advisor) that were never added to those skills feature catalogs or testing playbooks?

The answer is yes, and the gaps are systematic. After twenty read-only audit iterations across the two models (gpt-5.5-fast and deepseek-v4-pro) and a verification pass over every high-severity cluster, the audit confirms roughly fifty real coverage gaps. They concentrate exactly where the audit predicted: the 028 release-cleanup track aligned ONLY system-spec-kit's catalog and playbook (phases 004 and 005, commit ab405fa052), and it did so as edits-only with no entries added. So code-graph and skill-advisor never had their 028 feature-areas cataloged at all, and even the synced spec-kit catalog is missing the new always-on features and kept-on flags that an edits-only pass could not introduce.

The verdict per surface:

| Skill | Catalog gaps | Playbook gaps | Root cause |
|-------|--------------|---------------|------------|
| system-code-graph | 6 feature-areas | 6 scenario-areas | release-cleanup never covered it |
| system-skill-advisor | 7 feature-areas | 7 scenario-areas | release-cleanup never covered it |
| system-spec-kit | 4 kept-on flags + ~8 always-on features | ~4 Memory-MCP scenarios | cleanup was edits-only, added no entries |
| cross-cutting (Deep Loop) | 5 features uncataloged | n/a | no skill owns the deep-loop runtime catalog |

The audit also CLEARED a false alarm. One seat flagged twelve deleted flags as missing from the spec-kit catalog. A direct grep confirms those flags are correctly absent, because their code was removed by the flag-resolution reckoning, so an absent catalog entry is the right state, not a gap. Those twelve are not counted above.

Tool-surface coverage is healthy across all three skills. The MCP tool entries are largely present, the gaps are in the FEATURE-AREA narrative entries (the behaviors a tool implements), not the tool list itself.
<!-- /ANCHOR:summary -->

---

## 2. METHOD

- **Twenty read-only iterations**, one bounded facet each, dispatched through `opencode run` at `--variant high --format json`, alternating `openai/gpt-5.5-fast` and `deepseek/deepseek-v4-pro`. Seats were read-only by design (an opencode-dispatched edit cannot pass Gate 3), and the orchestrator wrote all state.
- **Weighting:** 7 iterations on code-graph, 7 on skill-advisor (the two un-synced skills), 4 verifying spec-kit completeness, 2 cross-cutting (deep-loop ownership and a completeness critic).
- **Per-feature method:** each seat read the 028 before-vs-after evidence for its feature-area, grepped the target surface, then OPENED each candidate entry to confirm real coverage (a keyword match is not coverage), classifying PRESENT, PARTIAL, MISSING, or STALE.
- **Verification pass (the load-bearing step):** every surprising or high-count cluster was re-checked by direct grep before being reported. This caught the twelve-flag false-positive and corrected the kept-on-flag count from 5 to 4 (temporal-edges IS cataloged).
- **Census:** 129 raw findings (74 MISSING, 13 PARTIAL, 42 PRESENT). After dropping the verified false-positives and deduping the critic seats broad overlap against the narrow seats, 59 deduped gaps remain, of which roughly 50 are high-confidence after removing a handful of unconfirmed tool-name findings (see section 5).

---

## 3. THE VERIFIED GAPS

### 3.1 system-code-graph (never synced by 028 cleanup)

Six 028 feature-areas have NO catalog entry and NO playbook scenario. Each was confirmed by a zero-match grep across `feature_catalog/*.md`:

| Feature (shipped in 028 Code Graph) | Catalog | Playbook |
|-------------------------------------|---------|----------|
| Trust-blend rank score (confidence + evidence-class RRF-additive) | MISSING | MISSING |
| Deterministic walk-order (rankContextEdges content-derived stable key) | MISSING | MISSING |
| Generation watermark (monotonic freshness counter) | MISSING | MISSING |
| Edge-staleness repair (SUPERSEDES rename-lineage edge) | MISSING | MISSING |
| Parser-resilience (transient-vs-fatal retry axis, default 5) | MISSING | PARTIAL |
| Doc-symbol lane (markdown headings + config keys as queryable nodes) | MISSING | MISSING |

### 3.2 system-skill-advisor (never synced by 028 cleanup)

Seven 028 feature-areas have no catalog entry and no playbook scenario:

| Feature (shipped in 028 Skill Advisor) | Catalog | Playbook |
|----------------------------------------|---------|----------|
| Runtime lane-health degrade (healthy / runtime-degraded / matched-nothing) | MISSING | MISSING |
| Embedding-staleness signal (signature + stale verdict, fail-closed) | PARTIAL | MISSING |
| RRF determinism spine (`SPECKIT_ADVISOR_RRF_FUSION`) | MISSING | MISSING |
| Conflict re-rank | MISSING | MISSING |
| Query-class routing | MISSING | MISSING |
| Exact semantic rerank | MISSING | MISSING |
| Self-recommendation guard | MISSING | MISSING |

### 3.3 system-spec-kit (synced, but edits-only so additions were never made)

The release-cleanup aligned existing entries and explicitly added none. So the features that arrived with the schema cluster and the flag-resolution reckoning have no catalog home:

- **Kept-on flags missing from the catalog (4 of 5):** `SPECKIT_DERIVED_ID_PROVENANCE`, `SPECKIT_CONFIDENCE_CALIBRATION`, `SPECKIT_RETENTION_FORGETTING_V1`, `SPECKIT_WORLD_SUMMARY_PRELUDE`. `SPECKIT_TEMPORAL_EDGES` IS present (2 files), so it is not a gap.
- **028 Memory-MCP always-on features missing or thin in the catalog:** recall trust-escaper, red-team gate, content-id centralization, retrieval-class routing, world-summary grounding prelude, the eval-harness coverage guard, and the calibrated search-score residual. The eval-harness extension is PARTIAL.
- **Playbook scenario gaps:** the red-team gate and the trust escaper have no scenario. Content-id and the enrichment gauges are PARTIAL.

### 3.4 Cross-cutting: the Deep Loop runtime has no catalog owner

Five 028 Deep Loop features (reducer-anchor fix, fanout determinism comparator, failure-recovery classes, stop-input corroboration, continuity threading) are cataloged in NONE of the three skills. The Deep Loop runtime lives under `deep-loop-workflows`, which was outside this audits three-skill scope. This is a structural ownership question, not a same-skill omission: decide whether deep-loop features belong in a deep-loop-workflows catalog or in system-spec-kit.

---

## 4. ROOT CAUSE

The 028 release-cleanup track had a feature-catalogs phase (004) and a manual-playbooks phase (005). Both targeted system-spec-kit ONLY, and their implementation summaries record the scope limit verbatim: other skills own separate playbook packages and were left out of scope. Phase 004 also aligned entries as edits only, adding and removing nothing. So three distinct gap shapes follow mechanically:

1. code-graph and skill-advisor were never in scope, so their entire 028 feature-area surface is uncataloged.
2. spec-kit was in scope but edits-only, so any 028 feature that needed a NEW entry (the always-on corrections, the kept-on flags) never got one.
3. the Deep Loop runtime has no catalog of its own in any of the three skills.

None of this is a correctness defect in the shipped code. It is a documentation-coverage debt left by a deliberately narrow cleanup scope.

---

## 5. WHAT THE AUDIT CLEARED (false-positives caught by verification)

- **Twelve deleted flags are NOT a gap.** One seat flagged `SPECKIT_SUMMARY_FUSION_LANE`, `SPECKIT_AGENTIC_RECALL`, `SPECKIT_SLEEPTIME_CONSOLIDATION`, `SPECKIT_CARDINALITY_PENALTY`, `SPECKIT_BITEMPORAL_RECALL` and others as missing from the catalog. Direct grep confirms all are absent (0 files), which is correct because the reckoning removed their code. An absent entry for a removed feature is the right state.
- **Temporal-edges is cataloged.** The kept-on-flag count is 4 missing, not 5.
- **Tool-name findings (confirmed real):** a few seats named `code_graph_apply`, `code_graph_classify_query_intent`, and `skill_graph_propagate_enhances` as missing tools. These tool ids ARE present in the live MCP tool roster, so those are confirmed gaps, not artifacts. The one finding that remains a likely false-positive is the removed seeded-PPR (`SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`), correctly absent like the deleted flags, so treat only that one as not-a-gap.

---

## 6. RECOMMENDATIONS

1. **Close the two un-synced skills first.** Add catalog entries and playbook scenarios for the six code-graph feature-areas and the seven skill-advisor feature-areas in section 3. These are the clearest, highest-value gaps and the cheapest to write because the 028 before-vs-after already describes each behavior.
2. **Backfill the spec-kit catalog additions the edits-only cleanup skipped.** Add entries for the 4 kept-on flags and the Memory-MCP always-on features, then add the two missing playbook scenarios (red-team gate, trust escaper).
3. **Settle Deep Loop catalog ownership.** Decide whether the five deep-loop features belong in a deep-loop-workflows catalog or in system-spec-kit, then catalog them there.
4. **Add a drift guard.** No CI check currently compares shipped flags and tools against the catalog and playbook indexes. A small parity script (grep each shipped flag, MCP tool, and feature-area key against the three catalogs and playbooks) would stop this debt from recurring after the next epic.
5. **Do not retire anything for the deleted flags.** They are already correctly absent.

This is research only. No catalog or playbook was modified by this audit. The next step is the operators call: close the gaps now, or scaffold a follow-on cleanup phase that does.

---

<!-- ANCHOR:references -->
## 7. REFERENCES

- `.opencode/specs/system-speckit/028-memory-search-intelligence/before-vs-after.md` sections 1-6, the canonical 028 shipped-feature inventory.
- `.opencode/specs/system-speckit/028-memory-search-intelligence/000-release-cleanup/` phases 004-feature-catalogs and 005-manual-testing-playbooks, the edits-only spec-kit-only cleanup.
- `.opencode/skills/system-code-graph/feature_catalog/` and `manual_testing_playbook/`, the un-synced code-graph surfaces.
- `.opencode/skills/system-skill-advisor/feature_catalog/` and `manual_testing_playbook/`, the un-synced skill-advisor surfaces.
- `.opencode/skills/system-spec-kit/feature_catalog/` and `manual_testing_playbook/`, the edits-only-synced spec-kit surfaces.
- `research/deltas/` in this packet, the twenty per-iteration finding sets.
<!-- /ANCHOR:references -->

# Skill-Advisor Scorer Parent-Hub Compatibility Research

## 1. Executive Summary

The scorer's parent-hub compatibility risk is real and concentrated in Layer-1b vocabulary, guard coverage, and measurement gaps. The highest-priority finding is that `deep-loop-workflows` still projects single-pass code-audit vocabulary while `fusion.ts` carries a compensating `codeAuditDeepReviewPenalty`; deleting either side independently is unsafe. [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:80] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:593]

Recommended path: treat this as a coordinated metadata and measurement migration, not a scorer tweak. Move stale hub vocabulary, add cross-hub and projection-surface guards, freeze a parent-hub ambiguity fixture, then reindex and recapture ratchets atomically.

## 2. Scope and Constraints

- Scope: scorer code under `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer`, parent-hub metadata for `sk-code`, `sk-design`, `deep-loop-workflows`, and related measurement packets.
- Constraint: read-only proposals only; no advisor/scorer code edits. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md:3]
- Priority: angles 1-5 weighted highest, with parent-hub compatibility as top priority. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md:7]

## 3. High-Priority Findings

### Finding A: Layer-1b is still half-landed

`deep-loop-workflows` metadata still includes `iterative code audit`, `severity weighted findings`, and `code audit` in derived trigger phrases. [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:80]

The scorer compensates with a primary-intent rule for `code audit`, boosting `sk-code` and demoting `deep-review`/`deep-loop-workflows`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:593]

Proposal: remove or narrow the stale deep-loop trigger phrases only in the same packet that runs the parent-hub ambiguity fixture and ratchet recapture. Defer removal of `codeAuditDeepReviewPenalty` until after the metadata cleanup has measured green.

### Finding B: Vocabulary authorities overlap

`TOKEN_BOOSTS` and `PHRASE_BOOSTS` hardcode broad vocabulary, while the same explicit lane consumes projected skill `intentSignals` and `keywords`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:18] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:327]

The derived lane adds evidence from graph-derived triggers and keywords, so duplicated phrases can count across lanes. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:61]

Proposal: define authority classes. Code owns exact syntax, slash commands, colon commands, and global safety disambiguators. Graph metadata owns hub/mode vocabulary. Guard output should report duplicates across authority classes and allowlist only intentional command syntax.

### Finding C: Current hub guard is not cross-hub

`parent-hub-vocab-sync.cjs` accepts one `skillRoot`; it detects one hub's internal alias drift, not collisions between hubs. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:263]

Proposal: add a cross-hub collision report over `sk-code`, `sk-design`, `deep-loop-workflows`, and `deep-loop-runtime`, using the existing normalizer. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:61]

### Finding D: Guard coverage misses live projection fields

The current guard only reads graph trigger phrases. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:130]

The advisor projection and derived lane also score `intent_signals`, `derived.key_topics`, `entities`, `key_files`, and `source_docs`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:216] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:62]

Proposal: mirror projection into three guard buckets: alias surface, keyword surface, and entity surface. Alias surface must map to mode ownership; keyword/entity surfaces need collision and overmatch checks, not mandatory alias typing.

### Finding E: Ambiguous prompts need a named slice

007's ambiguity slice is 15/25 top-1, proving contested prompts are a weak area. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129]

Proposal: add `parent_hub_ambiguity` as a named ratchet slice with bands for code-audit vs review-loop, design-audit vs code-audit, runtime vs workflow, one-shot context vs loop, and advisor-eval vs code-review.

## 4. Medium-Priority Findings

### Atomic runbook needed

The ratchet treats both regressions and unrecaptured improvements as failures. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:132]

Proposal: metadata cleanup, reindex, guard, ambiguity fixture, scorer ratchet, and baseline recapture should run in one implementation packet. Do not leave a pushed state where metadata changed but ratchets or projections are stale.

### conflicts_with should be measured, not blanket-authored

The graph-causal lane supports negative `conflicts_with` edges. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:28]

003 showed conflict overlay signal on one prompt, but live edge authoring remains a separate decision. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/results/metrics.json:183]

Proposal: require an overlay benchmark and no-ratchet-regression proof before authoring live conflicts.

### Command bridges are drift-prone

`projection.ts` hardcodes six command bridges. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58]

Proposal: derive bridges from command metadata/frontmatter and registry-like declarations, following `buildExecutorAliasTable`'s bounded approach and excluding derived keywords from alias matching. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:245]

## 5. Semantic Shadow Hygiene

008 froze `semantic_shadow` at weight 0.05 after a net-negative ablation. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46]

The harmful flips include three gold-none false-fires to `mcp-chrome-devtools`. [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79]

Proposal: add a metadata hygiene lint for mcp-* descriptions and derived triggers before any lane-weight experiment. The semantic vector includes name, description, domains, intentSignals, and derivedTriggers, so content hygiene can reduce attractors without changing scorer weights. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:256]

## 6. Recommended Implementation Sequence

1. Add read-only cross-hub collision report.
2. Add projection-surface guard buckets: alias, keyword, entity.
3. Create and approve `parent_hub_ambiguity` labeled fixture.
4. Patch parent-hub metadata: remove stale single-pass code-audit phrases from `deep-loop-workflows`, ensure `sk-code` owns code-audit/review terms and `sk-design` owns design-audit terms.
5. Reindex advisor projection and run guards.
6. Run scorer ratchet and recapture baseline if counts move in an expected direction.
7. Only after green metadata and ratchets, evaluate whether `codeAuditDeepReviewPenalty` is still needed.
8. Separately evaluate command bridge derivation and conflicts_with authoring.

## 7. Proposed Parent-Hub Ambiguity Bands

| Band | Example Gold Owner | Purpose |
|---|---|---|
| code_audit_vs_review_loop | `sk-code` or `deep-loop-workflows` by wording | Distinguish single-pass code audit from iterative deep review |
| design_audit_vs_code_audit | `sk-design` vs `sk-code` | Prevent audit vocabulary collision across design/code |
| runtime_vs_workflow | `deep-loop-runtime` vs `deep-loop-workflows` | Keep backend inspection distinct from workflow invocation |
| one_shot_context_vs_loop | abstain/context vs `deep-loop-workflows` | Avoid over-routing simple research to deep loops |
| advisor_eval_vs_code_review | `sk-code` | Route audit of recommendation quality to review, not advisor self |

## 8. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Remove `codeAuditDeepReviewPenalty` first | Metadata still projects `code audit` into deep-loop-workflows. | `.opencode/skills/deep-loop-workflows/graph-metadata.json:80` | 1 |
| Move all vocabulary into metadata | Exact slash and colon syntax needs code-level anchors. | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:101` | 2 |
| Alias-guard all derived keyword fields | File paths and doc names over-match as user aliases. | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:245` | 4 |
| Tune weights before labels | Existing ambiguity evidence is weak and needs a named slice. | `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:63` | 5 |
| Live DB experiment mutation | Existing packets use read-only copy or fixture projection. | `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/results/metrics.json:9` | 6 |
| Broad conflicts_with seeding | Hub overlap is not mutual exclusion. | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:28` | 7 |
| Immediate semantic_shadow weight change | 008 froze the lane after net-negative evidence. | `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46` | 10 |

## 9. Open Questions

- Which exact prompt labels should be approved for the parent-hub ambiguity slice?
- Should any overlay-tested `conflicts_with` edges graduate to live graph metadata after RRF graduation?
- Should command bridge derivation be part of the parent-hub compatibility packet or a separate lower-priority packet?

## 10. References

- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/sk-design/graph-metadata.json`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/results/metrics.json`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md`

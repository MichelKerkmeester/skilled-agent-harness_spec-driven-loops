# Skill Advisor Parent-Hub Compatibility Research - fanout gpt55-3

## Executive Summary
The top parent-hub compatibility risk is not a missing scorer feature; it is a half-landed vocabulary migration. `deep-loop-workflows` still exposes single-pass code-audit/severity review phrases while `sk-code` and the explicit scorer lane already own that class of work. The safest path is metadata cleanup plus a coordinated reindex and ratchet recapture, preceded by read-only measurement assets: a cross-hub vocabulary collision report and a labeled cross-hub ambiguity fixture.

No advisor/scorer code changes are recommended from this lineage. All proposals are read-only or future implementation plans.

## Priority Proposals

### 1. Complete Layer-1b Parent-Hub Vocabulary Cleanup
Replace deep-loop single-pass code-audit vocabulary with loop-shaped review vocabulary.

Evidence:
- `deep-loop-workflows` derived triggers include `iterative code audit`, `severity weighted findings`, and `code audit`. [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:78]
- The deep-loop review registry aliases include `iterative code audit`, `severity weighted findings`, and `code-audit`. [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:70]
- `sk-code` already owns `code review`, `pr review`, `security review`, `findings`, `audit packet docs`, and `p0 p1 p2 review`. [SOURCE: file:.opencode/skills/sk-code/graph-metadata.json:127]
- The explicit lane anchors code-review/audit phrases to `sk-code`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:159]

Proposal:
- Delete or rewrite deep-loop `code audit` and `severity weighted findings` metadata to loop-specific language such as `iterative review loop`, `multi-pass review loop`, `convergence review`, and `review-loop artifacts`.
- Preserve direct deep-loop invocation terms: `deep-review`, `review loop`, `iterative review`, `:review:auto`, and `/deep:review`.
- Keep `codeAuditDeepReviewPenalty` until the metadata cleanup, reindex, and ambiguity set show no regression; remove only after a green coordinated baseline. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts:130]

### 2. Establish Vocabulary Authority Rules
Use metadata for hub/mode vocabulary and code for scorer policy.

Evidence:
- `TOKEN_BOOSTS` and `PHRASE_BOOSTS` contain hardcoded user-facing terms that overlap metadata. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:18] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:101]
- The scorer also consumes projected `intentSignals`, `keywords`, `derivedTriggers`, and `derivedKeywords`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:204]

Contract:
- Metadata owns hub identity, mode aliases, `intent_signals`, `derived.trigger_phrases`, `derived.key_topics`, and source-doc concepts.
- Code owns command bridge policy, task/read-only floors, abstain guards, and temporary compatibility penalties.
- Any hardcoded phrase boost that duplicates a parent-hub alias must have a comment naming why metadata is insufficient, or be queued for removal after reindex.

### 3. Add Cross-Hub Collision Reporting
Extend the hub-local guard into a read-only cross-hub report.

Evidence:
- Existing `parent-hub-vocab-sync` is hub-local and receives one `skillRoot`. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:263]
- It already normalizes phrases and detects alias collisions inside one hub. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:61] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:363]

Report shape:
- normalized phrase;
- raw phrases;
- owning hub(s);
- owner mode(s);
- vocabulary class(es);
- source surface: `mode-registry`, `hub-router`, `graph-metadata`, `SKILL.md` keywords;
- classification: `allowed-shared`, `needs-owner`, `collision`, or `demotion-candidate`.

Initial high-risk rows:
- `audit`: sk-code review vs sk-design design-audit vs deep-loop review-loop.
- `review`: sk-code code-review vs sk-design design review vs deep-loop review-loop.
- `code audit`: should belong to sk-code for single pass; deep-loop only if explicitly iterative.

### 4. Validate Full Advisor Projection Surface
The guard should prove that typed hub aliases are visible to the scorer in every projected lane that matters.

Evidence:
- Projection reads `intent_signals`, derived trigger phrases, derived keywords, and doc triggers. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:600] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts:61]
- Current `triggerPhraseCoverage` only checks graph trigger phrases against typed vocabulary or registry owners. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:397]

Proposal:
- Add `advisorProjectionCoverage` per hub mode:
- `aliasInRegistry`;
- `aliasTypedInHubRouter`;
- `aliasProjectedAsIntentSignal` or `aliasProjectedAsDerivedTrigger`;
- `aliasProjectedAsDerivedKeyword` when entity-shaped;
- explicit exemption reason.

### 5. Build A Labeled Cross-Hub Ambiguity Set
Current ambiguity gates do not answer parent-hub compatibility.

Evidence:
- Runtime ambiguity uses 0.05 score/confidence windows. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts:7]
- `advisor-validate` documents `ambiguity_slice_stable` as synthetic stability, not empirical ambiguity FP/FN. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:548]
- Packet 007 baseline has ambiguity 15/25 = 0.60, useful but not semantically labeled. [SOURCE: file:.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129]

Required fixture families:
- single-pass code audit -> `sk-code`;
- iterative review-loop/convergence review -> `deep-loop-workflows`;
- design audit/UI critique -> `sk-design`;
- implementation audit/code quality gate -> `sk-code`;
- deep-loop runtime internals -> `deep-loop-runtime` or `sk-code` depending on requested action;
- under-specified broad prompt -> abstain/ambiguous.

Metrics:
- top-1 accuracy;
- top-2 score/confidence margin;
- `ambiguousWith` correctness;
- strict abstain correctness for deliberately under-specified prompts.

## Secondary Proposals

### 6. Reindex, Rebaseline, Ratchet Recapture As One Operation
Do not patch metadata without proving the live projection and ratchets together.

Evidence:
- Projection labels SQLite read failures as degraded filesystem fallback. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:695]
- Packet 007 freezes corpus, holdout, ambiguity, and bucket baselines. [SOURCE: file:.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129]
- Packet 008 calls out native-ABI/SIGBUS fragility and avoids live daemon DB in the semantic harness. [SOURCE: file:.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:95]

Runbook:
1. Patch metadata only.
2. Rebuild/scan the skill graph.
3. Confirm advisor projection source is healthy, not degraded fallback.
4. Run hub-local and cross-hub vocab checks.
5. Run advisor validation and scorer gates.
6. Recapture ratchet fixtures only if intentional deltas are reviewed.

### 7. Use conflicts_with Only For Measured Exclusive Pairs
The mechanism exists but should not be used broadly.

Evidence:
- `conflicts_with` applies negative graph-causal multiplier `-0.35`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:28]
- sk-code, sk-design, and deep-loop-workflows currently declare empty conflict arrays. [SOURCE: file:.opencode/skills/sk-code/graph-metadata.json:23] [SOURCE: file:.opencode/skills/sk-design/graph-metadata.json:28] [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:40]

Criteria:
- Add only for labeled, mutually-exclusive prompt pairs.
- Require improved cross-hub ambiguity fixture and no full-corpus/holdout regression.
- Prefer metadata vocabulary cleanup before graph conflict demotion.

### 8. Derive Command Bridges From Command Metadata
`COMMAND_BRIDGES` should become generated projection data, following the executor alias pattern.

Evidence:
- Six command bridges are hardcoded in `projection.ts`. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58]
- Projection appends them in both SQLite and filesystem modes. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:620]
- Executor delegation already derives active aliases from metadata and model profiles. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:230]

Proposal:
- Generate command projections from command frontmatter and compiled command contracts during advisor rebuild.
- Keep scorer hot path reading projection data, not command markdown.
- Add a bridge-drift test comparing generated bridge aliases against command contracts.

### 9. Add A Taxonomy Crosswalk Gate
Do not merge query class, hub router, and eval bucket taxonomies, but validate their intended relationships.

Evidence:
- `classifyAdvisorQuery` is a coarse scorer-local classifier. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:121]
- Hub routers define richer mode classes. [SOURCE: file:.opencode/skills/sk-code/hub-router.json:16] [SOURCE: file:.opencode/skills/sk-design/hub-router.json:27]
- Advisor validation slices review, memory_save, and delegation separately. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts:646]

Proposal:
- Add a static crosswalk fixture mapping query classes to allowed hub modes and eval buckets.
- Test high-risk mappings: review -> sk-code/deep-loop/sk-design by loop/design/code cues; documentation -> sk-doc/spec-kit/md-generator by artifact noun; tooling -> mcp skills/command bridges by tool noun.

### 10. Keep semantic_shadow Frozen; Add mcp-Neighbor Hygiene
Do not tune semantic weight to fix mcp false-fires.

Evidence:
- semantic_shadow embeds skill name, description, domains, intent signals, and derived triggers. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:256]
- Packet 008 measured the lane as net-negative: full 149/193 vs disabled 150/193, with 3 gold-none abstain false-fires to `mcp-chrome-devtools`. [SOURCE: file:.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79]
- Packet 008 decision is to keep weight 0.05. [SOURCE: file:.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:91]

Proposal:
- Add an mcp-neighbor hygiene audit over descriptions/domains/triggers for generic attractor terms.
- Add a gold-none abstain fixture slice for the harmful mcp-chrome false-fire IDs and nearest-neighbor prompts.
- Track semantic-only false-fire count, not just full top-1.

## Recommended Sequence
1. Measurement first: cross-hub collision report plus cross-hub ambiguity fixture.
2. Metadata cleanup: remove/rewrite deep-loop single-pass code-audit terms.
3. Reindex and validation bundle: skill graph rebuild, advisor status, vocab checks, advisor validate, ratchet gates.
4. Baseline recapture only if reviewed metrics change intentionally.
5. Then consider deleting redundant hardcoded penalties and shrinking explicit boosts.

## References
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs`
- `.opencode/skills/sk-code/graph-metadata.json`, `mode-registry.json`, `hub-router.json`
- `.opencode/skills/sk-design/graph-metadata.json`, `mode-registry.json`, `hub-router.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`, `mode-registry.json`, `hub-router.json`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md`

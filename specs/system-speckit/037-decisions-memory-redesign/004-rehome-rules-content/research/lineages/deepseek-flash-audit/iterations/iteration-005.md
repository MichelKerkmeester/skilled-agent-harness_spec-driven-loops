# Iteration 5: ROOT DOCS sweep — constitutional links + inlined rules

## Focus
Every root-doc reference to constitutional/*.md; separate load-bearing links from spec-history references; identify the inlined-rule appendix situation.

## Findings

### F5.1 The 6-link load-bearing set (identical across CLAUDE.md / AGENTS.md / BARTER.md)
Each root doc carries the same 6 operational "See constitutional/..." pointers from already-inlined rule text:
1. `comment-hygiene.md` — CLAUDE.md:41, AGENTS.md:41, BARTER.md:59
2. `regression-baseline-and-delta.md` — CLAUDE.md:71, AGENTS.md:71, BARTER.md:89
3. `finding-is-a-hypothesis.md` — CLAUDE.md:72, AGENTS.md:72, BARTER.md:90
4. `main-branch-direct-push.md` — CLAUDE.md:90, AGENTS.md:90, BARTER.md:108
5. `cli-dispatch-skill-preload.md` — CLAUDE.md:116, AGENTS.md:116, BARTER.md:134
6. `gate-tool-routing.md` — CLAUDE.md:363, AGENTS.md:363, BARTER.md:357 (BARTER uses short form `constitutional/gate-tool-routing.md`; CLAUDE/AGENTS full path)
Total: 18 load-bearing links across 3 root docs. [SOURCE: file:CLAUDE.md:41,71,72,90,116,363; file:AGENTS.md:41,71,72,90,116,363; file:BARTER.md:59,89,90,108,134,357]
- Action: retarget each pointer to the rehomed long-form location (root-doc appendix section or new unindexed reference doc) OR drop the pointer where the inline rule text is complete. Class: TODO — this is the exact "load-bearing links to retarget" set the deliverable asks for.

### F5.2 Root-doc inline rules (already inlined — the appendix situation)
- The rule text itself (comment hygiene, baseline/delta, finding-is-hypothesis, rollback naming, CLI dispatch preload, tool routing) is INLINE in all 3 root docs at the cited lines; the constitutional/*.md files are long-form expansions. Post-deprecation: the inline text stays; only the pointer target changes. Confirmed grounding "rules already inlined in CLAUDE.md/AGENTS.md/BARTER.md". [SOURCE: file:CLAUDE.md:41,71,72,90,116,363]

### F5.3 .claude/CLAUDE.md — CLEAN
- Zero constitutional references (verified by grep). No action. [SOURCE: grep, Iter 5]

### F5.4 Other root-level docs — CLEAN
- CONTRIBUTING.md: 0 matches; PUBLIC-RELEASE.md: 0 matches; .opencode/README.md: 0 matches; .cursor/rules/*: 0 matches. No action. [SOURCE: grep, Iter 5]

### F5.5 Root README.md (4 constitutional mentions)
- `README.md:403` — "Candidate generation - Parallel retrieval from the active channels plus constitutional injection where applicable."
- `README.md:475` — "the write-ingress guard enforces the constitutional rule that automated writers never overwrite manual or constitutional memory"
- `README.md:781` — "Integrates the 41-tool memory surface with constitutional-tier support, session bootstrap and hybrid 5-channel retrieval"
- `README.md:978` — "`/memory:learn` constitutional memory manager for always-surface rules"
Action: rewrite all 4 to post-deprecation behavior. Class: TODO. [SOURCE: file:README.md:403,475,781,978]

### F5.6 Spec-history refs — NOT in scope for rewriting
- The ~420 raw refs (most of the 7974 total) live in spec history under `specs/**` and changelogs — do NOT rewrite (owner + grounding). The 18 root-doc links + README 4 = the actionable citation set. [SOURCE: grounding + Iter 0 ruled-out]

## Sources Consulted
- CLAUDE.md, AGENTS.md, BARTER.md, .claude/CLAUDE.md, CONTRIBUTING.md, PUBLIC-RELEASE.md, README.md, .opencode/README.md, .cursor/rules/

## Assessment
- newInfoRatio: 0.7 — root docs mapped; overlaps with grounding (inlined rules confirmed) so some findings confirm rather than discover.
- Novelty justification: exact retarget set (18 links, 6 rule files) now pinned with line numbers; README 4 additions.
- Confidence: high (all line-verified).

## Reflection
- Worked: per-file greps avoid lineage-file pollution from glob scans.
- Ruled out: reading the full root docs — link lines are the actionable surface.

## Recommended Next Focus
Iter 6: THE FOLDER — the 20 rule files: which carry UNIQUE content not already inlined (rehome target) vs safe to delete; referrers per file; README.md of the folder.

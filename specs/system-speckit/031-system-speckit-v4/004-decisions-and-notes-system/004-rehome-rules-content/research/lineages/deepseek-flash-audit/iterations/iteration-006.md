---
title: "Iteration 6: THE FOLDER — 20 rule files: unique content vs safe-to-delete"
trigger_phrases: []
---
# Iteration 6: THE FOLDER — 20 rule files: unique content vs safe-to-delete

## Focus
Per-file verdict on the 20 constitutional rule files + README: which carry UNIQUE content not already inlined (rehome target), which are safe to delete; referrer map.

## Findings

### F6.1 File inventory (all carry `importanceTier: constitutional` frontmatter)
All 20 rule files confirmed with `importanceTier: constitutional` + `contextType: decision` frontmatter. Sizes 31-122 lines. [SOURCE: shell frontmatter dump, Iter 6]

### F6.2 Referrer map (non-spec-history, non-self)
| Rule file | Root-doc pointer | Other referrers |
|---|---|---|
| comment-hygiene (76L) | CLAUDE:41, AGENTS:41, BARTER:59 | playbook feature-flag-reference/4-memory-and-storage.md |
| cli-dispatch-skill-preload (63L) | CLAUDE:116, AGENTS:116, BARTER:134 | cli-external-orchestration/SKILL.md |
| finding-is-a-hypothesis (33L) | CLAUDE:72, AGENTS:72, BARTER:90 | — |
| gate-tool-routing (78L) | CLAUDE:363, AGENTS:363, BARTER:357 | 4 playbooks (pi-a4, 4-memory-and-storage, result-provenance, progressive-disclosure-v1) |
| main-branch-direct-push (34L) | CLAUDE:90, AGENTS:90, BARTER:108 | — |
| regression-baseline-and-delta (33L) | CLAUDE:71, AGENTS:71, BARTER:89 | — |
| automated-writers-never-overwrite-manual (31L) | — | feature-catalog provenance-source-kind + governance rule-pack |
| entity-cooccurrence-is-not-causal (31L) | — | feature-catalog governance rule-pack |
| gate-enforcement (122L) | — | .spec-gate-state/README.md, feature-catalog rule-pack, 2 tests, folder README |
| goal-prompting-runtime-specific (96L) | — | pi-a4 playbook, cli-claude-code benchmark + report |
| memory-system-spec-kit-only (44L) | — | playbook feature-flag-reference/4-memory-and-storage.md |
| spec-folder-naming (39L) | — | playbook ux-hooks/result-provenance.md |
| verify-before-completion-claims (35L) | — | playbook feature-flag-reference/4-memory-and-storage.md |
| bash-output-truncation-verdict-visibility (36L) | — | — |
| deep-skill-workflow-required (63L) | — | — |
| fable-governor (34L) | — | — |
| fable-subagent-model-policy (32L) | — | — |
| post-implementation-deep-review (83L) | — | — |
| recorded-failure-must-route (33L) | — | — |
| recursion-control (33L) | — | — |
[SOURCE: grep referrer scan, Iter 6 — 7 files have ZERO referrers outside spec history]

### F6.3 Inline-status heuristic (distinctive-phrase grep on CLAUDE.md+AGENTS.md+BARTER.md)
- Inlined (phrase present in all 3): deep-skill-workflow-required ("workflow lock" x1 each), gate-enforcement ("enforcement" x1-2), recursion-control ("audit" x2 each — Operating Discipline language). [SOURCE: grep -ci, Iter 6]
- NOT inlined (phrase absent): automated-writers, bash-output-truncation ("verdict visibility"), entity-cooccurrence ("co-occurrence"), fable-governor ("governor capsule"), fable-subagent-model-policy ("subagent" phrase set), goal-prompting ("active_goal"), post-implementation ("post-implementation"), recorded-failure ("follow-up"), spec-folder-naming ("folder naming"), verify-before-completion ("positive check"), memory-system-spec-kit-only ("native memory"). [SOURCE: grep -ci, Iter 6]
- The 6 root-linked files are confirmed inlined by the link context itself (rule text inline + pointer to long-form) — Iter 5 F5.1/F5.2.

### F6.4 Doctrine-record relationships with render.ts (enforcement hardcoded)
- fable-governor.md — "The skill-advisor hook re-states the compact form every turn (the 'thermostat'); this file is the durable doctrine record" — EXACTLY matches GOVERNOR_DIRECTIVE render.ts:112 (4 rules: reason-outward, outcome-over-process, commit-and-move, minimum-honest-qualifier). [SOURCE: file:fable-governor.md:12-24, file:render.ts:112]
- verify-before-completion-claims.md — "Never claim an outcome from the absence of an error. Gate every completion on a positive check" — matches TERMINAL_PROOF_DIRECTIVE render.ts:117. [SOURCE: file:verify-before-completion-claims.md:11-15, file:render.ts:117]
- recursion-control.md — high-reasoning-effort companion to fable-governor; no render.ts counterpart (opt-in doctrine). [SOURCE: file:recursion-control.md:11-17]

### F6.5 README.md of the folder (237 lines)
- `constitutional/README.md` — 21 constitutional matches; folder index: what rules are, how to author, budget (~2000 max), always-surface semantics, `includeConstitutional` (lines 199-202). [SOURCE: file:constitutional/README.md:199,202]
- Action: DELETE with the layer, or rewrite as a plain-docs index if folder kept as unindexed reference docs. Class: DELETE/TODO.

### F6.6 Per-file verdict (recommended classification)
| Rule file | Content status | Class |
|---|---|---|
| comment-hygiene | fully inlined + root pointer | DELETE after pointer retarget |
| cli-dispatch-skill-preload | fully inlined + root pointer; SKILL.md also documents preload | DELETE after pointer retarget |
| finding-is-a-hypothesis | fully inlined + root pointer | DELETE after pointer retarget |
| main-branch-direct-push | fully inlined + root pointer | DELETE after pointer retarget |
| regression-baseline-and-delta | fully inlined + root pointer | DELETE after pointer retarget |
| gate-tool-routing | inlined decision tree (CLAUDE:363 "Full routing + FTS fallback chain") | DELETE after pointer retarget (tree stays in CLAUDE.md:363) |
| deep-skill-workflow-required | workflow-lock language inlined | DELETE (PLAN-WORKFLOW LOCK section covers it) |
| recursion-control | partial inline (audit-once language) | KEEP-AS-DOC (unique reasoning-budget doctrine) or DELETE; rehome 2-line essence into root docs |
| gate-enforcement | Gate-3 core inlined; 122L edge cases largely UNIQUE | REHOME edge cases into AGENTS.md Gate 3 section, then DELETE |
| automated-writers-never-overwrite-manual | partially inlined (README.md:475); unique contract detail | KEEP-AS-DOC (unindexed) or rehome |
| entity-cooccurrence-is-not-causal | NOT inlined; unique recall-evidence doctrine | KEEP-AS-DOC (unindexed) or rehome |
| bash-output-truncation-verdict-visibility | NOT inlined; unique | REHOME into root docs (short), then DELETE |
| fable-governor | NOT inlined; doctrine record of render.ts GOVERNOR_DIRECTIVE | KEEP-AS-DOC (unindexed doctrine) — enforcement stays in render.ts |
| fable-subagent-model-policy | NOT inlined; unique model policy | REHOME or DELETE (policy likely stale: "Opus or Sonnet") |
| goal-prompting-runtime-specific | NOT inlined; unique, referenced by benchmarks | KEEP-AS-DOC (unindexed) — goal-prompting system stays |
| post-implementation-deep-review | NOT inlined; unique 83L workflow | REHOME into AGENTS.md (deep-review mandate), then DELETE |
| recorded-failure-must-route | NOT inlined; unique | REHOME into root docs, then DELETE |
| spec-folder-naming | NOT inlined; unique convention | REHOME into AGENTS.md/CLAUDE.md (naming convention), then DELETE |
| verify-before-completion-claims | NOT inlined; doctrine of TERMINAL_PROOF_DIRECTIVE | KEEP-AS-DOC (unindexed doctrine) or rehome |
| memory-system-spec-kit-only | NOT inlined; native-memory ban | **KEEP (owner direction)** — unindexed reference doc; ban intact |
[SOURCE: Iter 6 analysis; heuristics flagged — final rehome-vs-delete split is owner judgment]

## Sources Consulted
- `.opencode/skills/system-spec-kit/constitutional/*.md` (frontmatter + key content), referrer greps, root-doc phrase greps, render.ts directives

## Assessment
- newInfoRatio: 0.8 — folder mapped with referrers + inline status; final per-file split requires owner call on long-forms.
- Novelty justification: fifth disjoint surface; referrer map + doctrine-record relationships new.
- Confidence: high on referrers/frontmatter (verified); medium on inline-status heuristics (phrase-based; labeled).

## Reflection
- Worked: referrer grep restricted to root docs + .opencode (avoids spec-history noise); phrase heuristics for inline status.
- Ruled out: reading all 20 files in full — frontmatter + key sections suffice for classification.

## Recommended Next Focus
Iter 7: DB — the 21 indexed constitutional rows: tier config, rewrite vs delete, vector-store/index-scan sites; learned-triggers 0-row confirmation.

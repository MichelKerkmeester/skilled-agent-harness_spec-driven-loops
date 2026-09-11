---
title: "Chronological Timeline [sk-doc/019-skill-routing-refactor/timeline]"
description: "Chronological build sequence of packet 019 skill-routing-refactor: the narrow create-* routing origin, the A–F workstreams, the luna+sol second-pass audit and remediation, the research consolidation and renumbering, and the final router-unification ungroup."
trigger_phrases:
  - "019 skill-routing timeline"
  - "019 build sequence"
  - "019 commit order"
  - "skill routing refactor chronology"
  - "which 019 phase shipped when"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor"
    last_updated_at: "2026-07-24T13:55:19Z"
    recent_action: "Traced the complete 162-commit chronology across the current packet and its renamed source paths, then recorded the five structural epochs."
    next_safe_action: "Use the current phase map and child metadata as the operational source of truth for the remaining packet work."
    completion_pct: 100
---
# 019 Chronological Timeline

> **Sort key:** git commit order on skilled/v4.0.0.0, oldest to newest.
> This is the literal sequence recovered from the packet's current path, its 031 and
> 019-sk-doc-router-alignment predecessors, and the source phase paths named by the
> structural maps; it is not the current numeric phase order.
>
> **What this packet did.** It began as a narrow sk-doc create-* routing-alignment effort,
> then widened into the complete skill-routing program. The work first corrected packet
> trigger ownership, handoffs, smart-routing posture, benchmark routing, and typed-pair
> measurement. It then consolidated per-hub research into a fleet router-unification
> program, built and activated compiled routing behind a reversible legacy kill-switch,
> and ran a documentation-quality program across the skill tree. A luna+sol second-pass
> audit verified the parent and descendants against disk, fixed the confirmed drift, and
> left rejected or separately scoped findings explicit. The closing structural passes
> consolidated research into 001-research, renumbered the direct tree to 002–016,
> dissolved the old 015/003 implementation parent, promoted its seventeen children,
> and extracted the sk-code research into the shared research parent.
>
> **Where the truth lives.** The structural history and old→new path maps are in
> [context-index.md](./context-index.md). The current direct phase map and workstream
> grouping are in [spec.md](./spec.md). The verify-first audit register and remediation
> wave outcomes are in [research/remediation-plan.md](./research/remediation-plan.md).

## 0. The five epochs

~~~
Epoch one  --  origin & rename
 438105c3da3  chore(sk-doc)       recover behavior-benchmark work + scaffold packet specs
 646c75f9edf  docs(sk-doc)        add packet-smart-routing-conformance spec docs
 00f02dd04f6  docs(sk-doc)        add benchmark-authoring-centralization spec docs
 dbc3300ac7e  fix(sk-doc)         remediate model-benchmark template findings
 f321a81c276  chore(sk-doc)       finalize benchmark-packet metadata and continuity
 cc0c7d38c7b  docs(sk-doc)        add Smart Routing N/A notes to six flat-resource packets
 b932569d739  docs(sk-doc)        add alignment doc sets for packets 017 and 019
 8179eb714b6  feat(sk-doc)        group create-benchmark resources by family and vocab
 3efa252285a  feat(sk-doc)        align subskill triggers and regenerate the hub registry
 1780843994e  feat(create-benchmark) complete benchmark-authoring centralization
 80d19980643  refactor(sk-doc)    merge 017 and 018 routing packets into parent 016
 ebffc559996  fix(sk-doc)         add hub keyword coverage for agent and changelog prompts
 d610693063a  fix(sk-doc)         route create a benchmark package through the alias swap
 a5423ca184b  refactor(sk-doc)    renumber the router-alignment packet 016 to 019
 72f139f5ae0  docs(sk-doc)        re-nest packets 018 and 015 under topical parents
 33955df5e5c  fix(create-benchmark) reconcile authoring docs and close runtime gaps
 528316e0d4f  fix(skill-benchmark) make BLOCKED-BY-REGISTRY reachable and repair the suite
 8e093afd038  fix(deep-improvement) repair the sk-design command-surface validator
 6fdf3677b75  docs(sk-doc)        renumber the router-alignment packet 019 to 015
 8f9cb5bf0b3  refactor(deep-loop) remove the ai-system-improvement Lane D mode
 3a0f0646944  refactor(deep-loop) complete the Lane D removal and verification-gap fix
 658a80dae40  refactor(specs)     consolidate sk-doc documentation packets into the sk-doc track
 62a1c15c800  docs(sk-doc)        document routing research and scaffold fix phases
 5d6e5470c21  docs(sk-doc)        ratify fixture ownership and the routing-quality decision
 d5f68a2ac29  docs(sk-doc)        check off the first advisor-routing task block
 787a909b82b  docs(sk-doc)        check off the second advisor-routing task block
 45780f287a6  docs(sk-doc)        record the four create-quality-control aliases
 9b89bc39e1b  docs(sk-doc)        scaffold benchmark-harness typed wiring
 5ae02b65271  docs(sk-doc)        wire typed benchmark wiring into the phase sequence
 24e043adc94  docs(sk-doc)        replan the benchmark packet around one classifier
 e975723ba5e  test(sk-doc)        record the benchmark packet regression baseline
 bdc603f6833  docs(sk-doc)        record the 8/8 LLM-routing generalization finding
 536484dc28d  feat(skill-benchmark) add typed-pair gold for index-table skills
 eaae464f708  docs(sk-doc)        add Wave 2 routing research and the routing-JSON reference
 1f5c22c4c62  chore(wip)          snapshot concurrent work before the v4 merge
 7a38fbbbd45  merge               merge origin/skilled/v4.0.0.0 into the packet branch
 37c589e08e4  refactor(skill-benchmark) de-skill the classifier and add manifest freshness
 b43e66a081f  docs(fleet-routing) record the route-gold full-fix milestone
 29faa31144e  chore(specs)        renumber the 031 router-alignment packet to 019

Epoch two  --  A–F workstream builds
 b1e73db34da  fix(specs)          apply missed 031-to-019 reference edits
 591276aa09c  fix(specs)          repoint the tracked deep-research lock
 ce0f71f8f19  docs(routing)       add the routing before-and-after explainer
 7ca29e01abc  docs(fleet-routing) record the route-gold teeth-proof and live-mode check
 c1c6e4396f9  docs(default-mode-research) synthesize the parent-hub default-mode study
 f2d03c87a23  docs(default-mode-research) refine the null fallback to load the routing helper
 8b227c14ef0  docs(default-mode-research) add the second divergent multi-model deep dive
 4b2c351cc1e  feat(routing)       flip four hubs to defaultMode null and fix sk-design emission
 a3fdf0707a8  docs(create-skill)   canonize the defer-routed hub archetype
 f1297285068  docs(sk-doc)        scaffold the unified-router implementation phases
 5a49a90ef66  docs(sk-doc)        add default-mode research and implementation packets
 1acac15e0fb  refactor(sk-doc)    consolidate router-alignment packets into the 020 program
 b052f329a73  refactor(sk-doc)    migrate the 020 filesystem names to kebab-case
 46e61ac4ae6  feat(router-refactor) build phase 000 contract schemas and canonical hashing
 68b2b5b6ba1  feat(router-refactor) build phase 001 shadow compiler and N=1 compile
 717897e2668  feat(router-refactor) build phase 002 decision evaluator
 09924c07521  feat(router-refactor) build phase 003 execution plane and idempotency
 f8df62cdf3d  feat(router-refactor) build phase 004 recovery ladder and shared budget
 6236175c55e  feat(router-refactor) build phase 005/001 calibration corpus and governance
 6a347af5228  feat(router-refactor) build phase 005/002 calibrated route contract
 4d0af5441dc  feat(router-refactor) build phase 005/003 selective-classification controller
 8f3815e29ac  feat(router-refactor) build phase 006/001 sk-code canary and evidence fence
 0c222cd31c4  feat(router-refactor) build phase 006/002 deep-loop canary without collapse
 debbbecf32f  feat(router-refactor) build phase 006/003 mcp-tooling canary and judgment fence
 61db654f98e  feat(router-refactor) build the gated reversible learning overlay
 9e479169f40  feat(router-refactor) retire legacy dual-read behind EffectivePolicy
 67d7466d131  fix(router-refactor) preserve learning-overlay base identity through replay
 97ea7dee69a  fix(router-refactor) conform calibration to the frozen decision shape
 4f66587cd70  fix(router-refactor) bind idempotency to effective policy and one owner
 181a7a8de86  fix(router-refactor) derive deep-loop route gold from the compatibility projector
 0090e6a3b5d  fix(router-refactor) bind fleet-cleanup readiness to rollout evidence
 5842a45ddab  fix(router-refactor) route the sk-code canary through the certificate gate
 c7382b9c45c  fix(router-refactor) reject empty-adjustments overlay candidates
 4f92aa3a359  docs(router-program) add the live-activation goal and parallelization
 f81468ed4cd  feat(router-refactor) make the deep-loop canary real-green
 190474111aa  chore(router-refactor) align route-gold and scorer pins
 785e119747d  feat(router-rollout) complete the parent-hub and non-hub rollout
 8c29e36a060  chore(router-rollout) re-baseline mcp-tooling and sk-design canaries
 5a7ba20c55e  feat(router-activation) activate all seven hubs with fenced CAS
 91f5dfc3625  feat(router-activation) record T9 real-model routing verification
 4aa00aa9592  feat(router-activation) build the compiled-routing runtime engine
 ffb752f10bc  feat(router-activation) activate sk-code compiled routing live
 d84dc4bfc2e  feat(router-activation) activate compiled routing on six more hubs
 368915881b5  docs(router-activation) reconcile the completed cutover docs
 fcc0887e644  test(router-activation) record the post-flip real-model sweep
 969089b3a6f  fix(router-refactor) fix three compiled-routing P1s and re-bind deep-loop
 bce84ac03ef  test(router-refactor) add the committed runtime regression suite
 e7b27034dd7  fix(router-hardening) remediate nine deep-review cutover findings
 322fe67a75d  fix(router-hardening) add mkdir locking and a write-ahead journal
 cd2da445e65  fix(router-hardening) self-heal a deleted serving-flip audit record
 de764c9dd15  docs(router-impl) conform the unified-router tree to spec-kit templates
 d49e386d1e7  docs(router-program) conform the first implementation children to templates
 fa7d2b68b6d  docs(router-program) conform the remaining implementation children to templates
 5ca94c640c9  chore(specs)        adopt inactive-session work for create-diff, 016, 032, and 019
 fa93ff6e304  docs(specs)         add compiled-routing default-on decision and alignment phases
 0e72d01fc24  docs(specs)         settle the default-on ruling and reconcile packet 012
 10ee0c850d4  feat(specs)         add routing coverage, activation, and verification research
 545c54b2a49  feat(specs)         author the routing-program children and continuity docs
 6b81fde29ee  feat(runtime)       implement the P0 compiled-routing foundation behind a flag
 c926b255060  feat(runtime)       implement flag propagation, drift guards, and rollback
 bb2fcbbd272  feat                implement the Lane C benchmark, catalogs, and templates
 beca825aa47  feat(benchmark)     implement durable archiving and serving snapshots
 c0d98bf07b4  feat(benchmark)     implement playbooks and LUNA-HIGH acceptance
 8293d894136  feat(sk-doc)        add the P4 cutover controller and kill-switch drill
 e853c2c054b  docs(sk-doc)        reconcile packet 015 docs to implemented state
 22b1ef53c55  docs(sk-doc)        add the P3 canonical-minter foundation spec
 a453f1ee51b  docs(sk-doc)        add the findings-traceability matrix
 e341e457db7  feat(runtime)       implement the P3 canonical-minter foundation
 a6038e31f7f  feat(sk-doc)        implement create-skill routing and Lane C alignment
 adfd7fcd853  test(sk-doc)        add the seven-hub LUNA-HIGH sweep evidence
 b6f96379512  feat(compiled-routing) add the sk-code routing recipe and manifest refresh
 a381edc1f8e  feat(compiled-routing) add compiled serving for sk-design, deep-loop, and mcp-tooling
 4cd19370da1  feat(compiled-routing) enable compiled routing by default for all seven hubs
 3992517b19c  docs(compiled-routing) reconcile phases 011 and 013 to shipped state
 6ccb6b43024  docs(compiled-routing) close the alignment gate and MD conformance
 f48ee1a6750  feat(compiled-routing) flip advisor enrichment to the seven-hub cohort
 830fdcf94ed  chore(compiled-routing) regenerate phase 013 metadata
 5c74d2610ca  merge               merge origin/v4 into the compiled-routing cutover
 f306ce44819  fix(compiled-routing) re-bind three stale manifests after the v4 merge
 5b09575bba9  fix(compiled-routing) reconcile four spec-tree manifests to fresh copies
 7aedee6133a  fix(sk-doc)         remediate eight compiled-routing deep-review findings
 3f10def104d  docs(sk-doc)        record the unnecessary fleet-wide expansion
 ed65063a375  docs(sk-doc)        author documentation-quality phase 001
 2a871e4e8ac  docs(sk-doc)        author documentation-quality phase 002
 4ea7c7b1b17  docs(sk-doc)        author documentation-quality phase 003
 d06b58f1dca  docs(sk-doc)        add phase-chain navigation links
 eec5509ca83  docs(sk-doc)        overhaul skill and mode READMEs
 a80bc2cb6a4  docs(sk-doc)        update code READMEs, infrastructure, and sk batch
 f70b1f43735  docs(sk-doc)        update code READMEs for design, prompt, and spec-kit
 2477aefe5ac  docs(sk-doc)        update system-deep-loop READMEs and catalogs
 672ea4ecf8b  docs(sk-doc)        author the existing-README cleanup spec set
 d007d208e1a  docs(sk-doc)        author the title-case and config closeout
 71008ddb6b3  docs(sk-doc)        compact the closeout continuity fields
 287e6ff4962  docs(sk-doc)        clear the evidence-cited closeout warning
 a5624303d6d  docs(sk-doc)        add backtick references to closeout checklist items
 9b48a7a5274  docs(sk-doc)        author deferred code and checker fixes
 8a38eab89d5  docs(sk-doc)        record the documentation-quality deep-review outcome
 c7f0275dd94  fix(sk-doc)         remediate documentation-quality P0 blockers
 b4627549816  fix(sk-doc)         harden uppercase-section validation
 d163b8c90d1  docs(sk-doc)        correct the parent phase map and README count
 1cac0103f66  docs(sk-doc)        record the code-README triage
 3f7d1609b0e  docs(sk-doc)        correct stale phase counts and a resolved limitation
 9c10096217b  chore(sk-doc)       refresh documentation-quality metadata
 3b69dda4a0b  refactor(sk-doc)    rename 019 router-alignment to skill-routing-refactor

Epoch three  --  second-pass luna+sol audit remediation
 f2734e080ed  fix(compiled-routing) re-bind five stale activation manifests
 ce363ce498b  docs(sk-doc)        update 019 references to the renamed path
 8584bff524c  docs(sk-doc)        rewrite the parent to skill-wide scope
 a0adade2194  chore(sk-doc)       remove stale canonical-save locks
 28b6847df0b  docs(sk-doc)        fix four pre-existing 019 doc-drift findings
 3c94775856e  docs(sk-doc)        fix seventeen deep-research audit findings
 b50ab613521  docs(sk-doc)        remediate four new audit findings in waves A and B
 933992c6d93  docs(sk-doc)        correct stale operator-gated claims to default-on
 16308ed4fcc  docs(sk-doc)        fix the research frontmatter and smart-routing paths
 878ce0dcddf  chore(sk-doc)       refresh fingerprints after the audit edits
 21576d36e7d  docs(sk-doc)        fix advisor paths and phase-map pointers
 fd50e46f332  docs(sk-doc)        add the second-pass remediation plan
 d1997f1fd0b  docs(sk-doc)        reconcile advisor packet progress and add its summary
 6ba6a42af0d  docs(sk-doc)        reconcile the sk-code packet to in-progress state
 fa80851321f  docs(sk-doc)        clarify the router-program context-index path base

Epoch four  --  research consolidation + renumber
 426c4706b77  refactor(sk-doc)    consolidate research into 001-research and renumber 002–016
 17f48291918  refactor(sk-doc)    rewrite cross-references for the research consolidation

Epoch five  --  ungroup 015 + extract sk-code research
 1f595b2a5a0  refactor(sk-doc)    promote seventeen 015/003 children to direct 015 phases
 5d189390bd4  refactor(sk-doc)    rewrite ungroup cross-references and author 011 sk-code research
~~~

The code block includes 162 commits. The early source-path entries are retained because
the current phases were created under temporary 016–018 and packet-specific names before
the 031 snapshot and the final 019 tree; the path maps in context-index.md reconcile those
names to the current phases.

## A. Epoch one: origin, packet alignment, and the 031→019 identity

The first work was narrow: make the sk-doc create-* packets describe routing consistently
and give the benchmark and packet-conformance work a real spec surface. The earliest current
phase folder by first spec.md appearance is 010-create-packet-routing-conformance at
438105c3da3. The next source-phase creation was 006-create-skill-smart-routing-notes at
cc0c7d38c7b, followed by the router-audit group 002–005 created together at 3efa252285a.
The marker-gap, keyword-coverage, and benchmark-routing phases followed in the same
source-path build, then the advisor, typed-pair, and per-hub research phases were added
to the 031 packet.

The git graph contains temporary branch-local numbering moves: 016→019 at a5423ca184b
and 019→015 at 6fdf3677b75. The canonical rename history recorded by context-index.md
is the later 031→019 move at 29faa31144e, followed by the missed-reference and lock
repairs at b1e73db34da and 591276aa09c. That distinction matters: the temporary moves
are real commits in the source-path ledger, but the durable packet identity is
sk-doc/019-sk-doc-router-alignment until the scope rename in 3b69dda4a0b.

## B. Epoch two: the A–F workstream builds

After the identity settled, the work expanded from packet conformance into six connected
workstreams. Groups A and B corrected trigger ownership, collision behavior, sibling
handoffs, router projections, flat-resource smart-routing posture, hub keyword coverage,
benchmark routing, and packet conformance. Group C then made routing measurable on the
typed-pair surface: the sk-doc and advisor fix packets were scaffolded, the benchmark
harness gained typed gold and a de-skilled classifier, and the sk-code pilot recorded
the reusable measurement pattern.

Group D supplied the research layer. The defaultMode study compared null fallback
behavior and led to the four-hub null-mode change; the defer-routed hub archetype made
the intended fallback explicit. The per-hub research and route-gold evidence then fed
Group E, the router-unification program. Its commits are a dependency-ordered build:
contract schemas, shadow compilation, decision evaluation, the execution and recovery
planes, calibration, three hub canaries, a gated learning overlay, fleet cleanup,
rollout, activation, the compiled runtime, and regression hardening. The later activation
commits enabled compiled serving for all seven hubs, kept the legacy path behind the
documented kill-switch, and recorded real-model post-flip evidence.

Group F ran alongside that router work. Its documentation-quality phases repaired metadata,
templates, navigation, skill and mode READMEs, code READMEs, tooling, validators, and
closeout evidence. The quality program's own deep-review blockers were fixed before the
019 scope rename. The rename at 3b69dda4a0b made the packet name match the actual fleet-wide
program rather than the original create-* slice.

The direct phase creation order is therefore not the numeric order shown in spec.md:

| First spec.md appearance | Current phase |
|---|---|
| 2026-07-12 12:11 — 438105c3da3 | 010-create-packet-routing-conformance |
| 2026-07-12 16:18 — cc0c7d38c7b | 006-create-skill-smart-routing-notes |
| 2026-07-13 07:30 — 3efa252285a | 002-router-audit-and-fix-map; 003-router-collision-fixes; 004-trigger-scoping-and-handoffs; 005-router-standardization-and-regen |
| 2026-07-13 14:24 — 80d19980643 | 007-create-skill-router-marker-gap |
| 2026-07-13 15:12 — ebffc559996 / d610693063a | 008-hub-intent-keyword-coverage; 009-create-benchmark-routing-fix |
| 2026-07-16 10:36 — 62a1c15c800 | 011-sk-doc-routing-fixes; 012-skill-advisor-routing-fixes |
| 2026-07-16 16:15 — 9b89bc39e1b | 013-benchmark-harness-typed-wiring |
| 2026-07-16 22:11 — 536484dc28d | 014-sk-code-router-alignment |
| 2026-07-18 17:02 — 1acac15e0fb | 015-router-unification-program |
| 2026-07-22 11:00 — ed65063a375 | 016-documentation-quality-program |
| 2026-07-24 13:15 — 17f48291918 | 001-research |

That makes 010 the oldest current phase folder by filesystem-history creation and
001-research the newest current phase parent. The latter is a structural fact only:
its eleven research lineages carry evidence that predates the parent folder.

## C. Epoch three: the second-pass luna+sol audit and remediation

The post-rename cleanup corrected stale manifests, references, locks, and the parent
scope before the second-pass audit. The audit itself used two independent forced-depth
lineages: luna recorded 15 findings and sol 27; the remediation plan deduplicated them
to about 26 canonical findings plus one containment meta-finding. The plan's operating
rule was verify-first: a model finding was a hypothesis until the cited file and runtime
symptom were confirmed on disk.

The remediation fixed the confirmed parent and descendant drift in waves. It corrected
the seven-hub and default-on claims, resume pointers, stale source paths, phase-map
omissions, lifecycle mismatches, and the hard validator error in the advisor packet.
The execution log records thirteen canonical findings fixed or closed, while three
model findings were rejected or ruled non-defects after verification. The research-only
level-policy work, the unrelated sk-design topology failure, and the deep-loop
write-containment bug remained explicitly scoped to separate work. The final audit
record is therefore more useful than a raw model tally: it preserves what was fixed,
what was false positive, and what still requires a different packet.

## D. Epoch four: research consolidation and direct-tree renumbering

426c4706b77 performed the structural pass. All research was moved under a new
001-research phase parent, and the implementation/program tree was renumbered into
direct phases 002–016. The old-to-new mappings in context-index.md are the attribution
layer for this move: 020 became 015, 021 became 016, and each earlier A–C phase was
shifted to its current number. 17f48291918 then rewrote the cross-references so the
new topology was navigable without rewriting the research evidence itself.

The result is a lean parent with one research phase parent, fifteen numbered direct
children, and nested program topology below 015 and 016. The structural operation
changed navigation and identity; it did not claim that the research was newly
performed at the time of the move.

## E. Epoch five: ungroup 015 and extract the sk-code research

The final pass dissolved 015/003-unified-refactor-implementation as a grouping node.
1f595b2a5a0 promoted its seventeen children to direct 015 phases 003–019 and resolved
the duplicate-012 naming collision during the promotion. The work preserved the
children's internal evidence while changing their parentage and direct numbering.

5d189390bd4 completed the cross-reference repair and extracted 014's research into
001-research/011-sk-code-routing-research. The current tree consequently separates
shared research from implementation phases while keeping the fleet router-unification
program flat and chronologically legible. This is the newest structural state on
skilled/v4.0.0.0 and the endpoint of the timeline recorded here.

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
 c0ee8517181  chore(sk-doc)       recover behavior-benchmark work + scaffold packet specs
 a516a891318  docs(sk-doc)        add packet-smart-routing-conformance spec docs
 0e86ffdce37  docs(sk-doc)        add benchmark-authoring-centralization spec docs
 1ee623a5bc8  fix(sk-doc)         remediate model-benchmark template findings
 ae8c36ea4f1  chore(sk-doc)       finalize benchmark-packet metadata and continuity
 424f7c47a1a  docs(sk-doc)        add Smart Routing N/A notes to six flat-resource packets
 36bba13758a  docs(sk-doc)        add alignment doc sets for packets 017 and 019
 3048a662e9b  feat(sk-doc)        group create-benchmark resources by family and vocab
 c6f9c6e7ac8  feat(sk-doc)        align subskill triggers and regenerate the hub registry
 356d92c3ff3  feat(create-benchmark) complete benchmark-authoring centralization
 ae7b74951a1  refactor(sk-doc)    merge 017 and 018 routing packets into parent 016
 05f53263ea1  fix(sk-doc)         add hub keyword coverage for agent and changelog prompts
 778a08b051d  fix(sk-doc)         route create a benchmark package through the alias swap
 5d7407b8e17  refactor(sk-doc)    renumber the router-alignment packet 016 to 019
 cebc9846cac  docs(sk-doc)        re-nest packets 018 and 015 under topical parents
 0868fccb19a  fix(create-benchmark) reconcile authoring docs and close runtime gaps
 f925c1366af  fix(skill-benchmark) make BLOCKED-BY-REGISTRY reachable and repair the suite
 d7c150b4071  fix(deep-improvement) repair the sk-design command-surface validator
 3de9f7366c5  docs(sk-doc)        renumber the router-alignment packet 019 to 015
 418edf13d87  refactor(deep-loop) remove the ai-system-improvement Lane D mode
 a35c86b9918  refactor(deep-loop) complete the Lane D removal and verification-gap fix
 c212f89c20b  refactor(specs)     consolidate sk-doc documentation packets into the sk-doc track
 9860de9720a  docs(sk-doc)        document routing research and scaffold fix phases
 146f9d0c882  docs(sk-doc)        ratify fixture ownership and the routing-quality decision
 1da0074b7d2  docs(sk-doc)        check off the first advisor-routing task block
 0c733c7fe90  docs(sk-doc)        check off the second advisor-routing task block
 ce0641e6f87  docs(sk-doc)        record the four create-quality-control aliases
 065f2e07f78  docs(sk-doc)        scaffold benchmark-harness typed wiring
 6a12d07f2cc  docs(sk-doc)        wire typed benchmark wiring into the phase sequence
 a66c800da22  docs(sk-doc)        replan the benchmark packet around one classifier
 f5a6c690025  test(sk-doc)        record the benchmark packet regression baseline
 d20ec0ab7ff  docs(sk-doc)        record the 8/8 LLM-routing generalization finding
 72bb0bc0c70  feat(skill-benchmark) add typed-pair gold for index-table skills
 f82b319a136  docs(sk-doc)        add Wave 2 routing research and the routing-JSON reference
 63f6f785148  chore(wip)          snapshot concurrent work before the v4 merge
 c2b11679360  merge               merge origin/skilled/v4.0.0.0 into the packet branch
 72c36121201  refactor(skill-benchmark) de-skill the classifier and add manifest freshness
 a05e87bf111  docs(fleet-routing) record the route-gold full-fix milestone
 904ac78090f  chore(specs)        renumber the 031 router-alignment packet to 019

Epoch two  --  A–F workstream builds
 891f3346e05  fix(specs)          apply missed 031-to-019 reference edits
 b129835139b  fix(specs)          repoint the tracked deep-research lock
 6a650641034  docs(routing)       add the routing before-and-after explainer
 a6dffc3ebaf  docs(fleet-routing) record the route-gold teeth-proof and live-mode check
 a07b7422e66  docs(default-mode-research) synthesize the parent-hub default-mode study
 b02f3b7ef94  docs(default-mode-research) refine the null fallback to load the routing helper
 399e2c531cf  docs(default-mode-research) add the second divergent multi-model deep dive
 908efde8d8f  feat(routing)       flip four hubs to defaultMode null and fix sk-design emission
 93ce7d15c4c  docs(create-skill)   canonize the defer-routed hub archetype
 76e0633eeee  docs(sk-doc)        scaffold the unified-router implementation phases
 27c4488b2b6  docs(sk-doc)        add default-mode research and implementation packets
 3446995c899  refactor(sk-doc)    consolidate router-alignment packets into the 020 program
 cc77a1e550a  refactor(sk-doc)    migrate the 020 filesystem names to kebab-case
 a274a7aafec  feat(router-refactor) build phase 000 contract schemas and canonical hashing
 c3ff87577f5  feat(router-refactor) build phase 001 shadow compiler and N=1 compile
 db976e37602  feat(router-refactor) build phase 002 decision evaluator
 9a4d0a6318c  feat(router-refactor) build phase 003 execution plane and idempotency
 28efcff2aac  feat(router-refactor) build phase 004 recovery ladder and shared budget
 5a277366460  feat(router-refactor) build phase 005/001 calibration corpus and governance
 aeba31eb806  feat(router-refactor) build phase 005/002 calibrated route contract
 ad8f76d612c  feat(router-refactor) build phase 005/003 selective-classification controller
 9c6b234489f  feat(router-refactor) build phase 006/001 sk-code canary and evidence fence
 6d0f4d8f0f4  feat(router-refactor) build phase 006/002 deep-loop canary without collapse
 658da8163dc  feat(router-refactor) build phase 006/003 mcp-tooling canary and judgment fence
 b47378710bc  feat(router-refactor) build the gated reversible learning overlay
 0882b9b2cf1  feat(router-refactor) retire legacy dual-read behind EffectivePolicy
 2e7b938b3b4  fix(router-refactor) preserve learning-overlay base identity through replay
 2cc9cfce226  fix(router-refactor) conform calibration to the frozen decision shape
 ed4189719b5  fix(router-refactor) bind idempotency to effective policy and one owner
 e2821ea2146  fix(router-refactor) derive deep-loop route gold from the compatibility projector
 2f14f66b381  fix(router-refactor) bind fleet-cleanup readiness to rollout evidence
 16b36c0c13a  fix(router-refactor) route the sk-code canary through the certificate gate
 8fa5eb2e23a  fix(router-refactor) reject empty-adjustments overlay candidates
 b1e26d9d42a  docs(router-program) add the live-activation goal and parallelization
 be0775a2f13  feat(router-refactor) make the deep-loop canary real-green
 342c7e37c89  chore(router-refactor) align route-gold and scorer pins
 bb414f070c8  feat(router-rollout) complete the parent-hub and non-hub rollout
 78adee01eec  chore(router-rollout) re-baseline mcp-tooling and sk-design canaries
 850f9beda16  feat(router-activation) activate all seven hubs with fenced CAS
 052f8a7ba8b  feat(router-activation) record T9 real-model routing verification
 d7da0fca432  feat(router-activation) build the compiled-routing runtime engine
 2fa3357f800  feat(router-activation) activate sk-code compiled routing live
 337ca43cfa8  feat(router-activation) activate compiled routing on six more hubs
 28d9c4a81ad  docs(router-activation) reconcile the completed cutover docs
 e9cda965ff2  test(router-activation) record the post-flip real-model sweep
 7a029e99ca7  fix(router-refactor) fix three compiled-routing P1s and re-bind deep-loop
 c118758b3c2  test(router-refactor) add the committed runtime regression suite
 caa910c97ae  fix(router-hardening) remediate nine deep-review cutover findings
 fadd6d29eaf  fix(router-hardening) add mkdir locking and a write-ahead journal
 ee9ee9161cb  fix(router-hardening) self-heal a deleted serving-flip audit record
 3f7a8c3b4e3  docs(router-impl) conform the unified-router tree to spec-kit templates
 a8c151f6c5a  docs(router-program) conform the first implementation children to templates
 d78839c2c74  docs(router-program) conform the remaining implementation children to templates
 b00bebe6775  chore(specs)        adopt inactive-session work for create-diff, 016, 032, and 019
 8312af6d7c9  docs(specs)         add compiled-routing default-on decision and alignment phases
 04b646da72f  docs(specs)         settle the default-on ruling and reconcile packet 012
 a179c8d5e9f  feat(specs)         add routing coverage, activation, and verification research
 1455dcbd26a  feat(specs)         author the routing-program children and continuity docs
 4153cbebd80  feat(runtime)       implement the P0 compiled-routing foundation behind a flag
 a1cdb65d90a  feat(runtime)       implement flag propagation, drift guards, and rollback
 8532c4b64b5  feat                implement the Lane C benchmark, catalogs, and templates
 2a39ecb9a03  feat(benchmark)     implement durable archiving and serving snapshots
 d590af12bea  feat(benchmark)     implement playbooks and LUNA-HIGH acceptance
 3d08302771a  feat(sk-doc)        add the P4 cutover controller and kill-switch drill
 bace87337a7  docs(sk-doc)        reconcile packet 015 docs to implemented state
 f72003829e7  docs(sk-doc)        add the P3 canonical-minter foundation spec
 2d0cf5f022a  docs(sk-doc)        add the findings-traceability matrix
 f6accfddcd6  feat(runtime)       implement the P3 canonical-minter foundation
 665a3116c00  feat(sk-doc)        implement create-skill routing and Lane C alignment
 72d1b7961c6  test(sk-doc)        add the seven-hub LUNA-HIGH sweep evidence
 f19ee171790  feat(compiled-routing) add the sk-code routing recipe and manifest refresh
 f9f639674bd  feat(compiled-routing) add compiled serving for sk-design, deep-loop, and mcp-tooling
 7dfffa0c934  feat(compiled-routing) enable compiled routing by default for all seven hubs
 85a5876dc87  docs(compiled-routing) reconcile phases 011 and 013 to shipped state
 2eaac22e958  docs(compiled-routing) close the alignment gate and MD conformance
 b5e8e4dacf8  feat(compiled-routing) flip advisor enrichment to the seven-hub cohort
 2b9ea4418ce  chore(compiled-routing) regenerate phase 013 metadata
 0c588aa9572  merge               merge origin/v4 into the compiled-routing cutover
 8c8126cf8a3  fix(compiled-routing) re-bind three stale manifests after the v4 merge
 ed8f3e20d0e  fix(compiled-routing) reconcile four spec-tree manifests to fresh copies
 56714fa8bc7  fix(sk-doc)         remediate eight compiled-routing deep-review findings
 335a194c75c  docs(sk-doc)        record the unnecessary fleet-wide expansion
 7d8f7c6497a  docs(sk-doc)        author documentation-quality phase 001
 c8d268a9254  docs(sk-doc)        author documentation-quality phase 002
 81722e6f365  docs(sk-doc)        author documentation-quality phase 003
 a4c3d5f0d94  docs(sk-doc)        add phase-chain navigation links
 b2881cbb061  docs(sk-doc)        overhaul skill and mode READMEs
 6f716420267  docs(sk-doc)        update code READMEs, infrastructure, and sk batch
 c5aa2f0b0f3  docs(sk-doc)        update code READMEs for design, prompt, and spec-kit
 ce7e75a95f4  docs(sk-doc)        update system-deep-loop READMEs and catalogs
 6860866ff06  docs(sk-doc)        author the existing-README cleanup spec set
 1d843009367  docs(sk-doc)        author the title-case and config closeout
 b1c9917d592  docs(sk-doc)        compact the closeout continuity fields
 c2a482ce9a0  docs(sk-doc)        clear the evidence-cited closeout warning
 e09be7e59b4  docs(sk-doc)        add backtick references to closeout checklist items
 b7ccadcdc0c  docs(sk-doc)        author deferred code and checker fixes
 b3452814db7  docs(sk-doc)        record the documentation-quality deep-review outcome
 7cafba35da3  fix(sk-doc)         remediate documentation-quality P0 blockers
 04b085f183b  fix(sk-doc)         harden uppercase-section validation
 e0ec90ba649  docs(sk-doc)        correct the parent phase map and README count
 24c8d914588  docs(sk-doc)        record the code-README triage
 c7bc662bf0e  docs(sk-doc)        correct stale phase counts and a resolved limitation
 114475bc887  chore(sk-doc)       refresh documentation-quality metadata
 28ae7dce6c6  refactor(sk-doc)    rename 019 router-alignment to skill-routing-refactor

Epoch three  --  second-pass luna+sol audit remediation
 04390310d87  fix(compiled-routing) re-bind five stale activation manifests
 99942211064  docs(sk-doc)        update 019 references to the renamed path
 053c50a7275  docs(sk-doc)        rewrite the parent to skill-wide scope
 1919593c074  chore(sk-doc)       remove stale canonical-save locks
 75eb0fdc93b  docs(sk-doc)        fix four pre-existing 019 doc-drift findings
 140266be3e5  docs(sk-doc)        fix seventeen deep-research audit findings
 2cc0787dcb7  docs(sk-doc)        remediate four new audit findings in waves A and B
 9f7aeebc3df  docs(sk-doc)        correct stale operator-gated claims to default-on
 a3f5b74e997  docs(sk-doc)        fix the research frontmatter and smart-routing paths
 c415be56af6  chore(sk-doc)       refresh fingerprints after the audit edits
 0c7d26900fd  docs(sk-doc)        fix advisor paths and phase-map pointers
 99f0c6c2fc0  docs(sk-doc)        add the second-pass remediation plan
 247d82a7796  docs(sk-doc)        reconcile advisor packet progress and add its summary
 7534f7021d5  docs(sk-doc)        reconcile the sk-code packet to in-progress state
 941771772c9  docs(sk-doc)        clarify the router-program context-index path base

Epoch four  --  research consolidation + renumber
 9796369bc29  refactor(sk-doc)    consolidate research into 001-research and renumber 002–016
 abc50ff76a3  refactor(sk-doc)    rewrite cross-references for the research consolidation

Epoch five  --  ungroup 015 + extract sk-code research
 4b57c99c095  refactor(sk-doc)    promote seventeen 015/003 children to direct 015 phases
 cbdb1dbeaca  refactor(sk-doc)    rewrite ungroup cross-references and author 011 sk-code research
~~~

The code block includes 162 commits. The early source-path entries are retained because
the current phases were created under temporary 016–018 and packet-specific names before
the 031 snapshot and the final 019 tree; the path maps in context-index.md reconcile those
names to the current phases.

## A. Epoch one: origin, packet alignment, and the 031→019 identity

The first work was narrow: make the sk-doc create-* packets describe routing consistently
and give the benchmark and packet-conformance work a real spec surface. The earliest current
phase folder by first spec.md appearance is 010-create-packet-routing-conformance at
c0ee8517181. The next source-phase creation was 006-create-skill-smart-routing-notes at
424f7c47a1a, followed by the router-audit group 002–005 created together at c6f9c6e7ac8.
The marker-gap, keyword-coverage, and benchmark-routing phases followed in the same
source-path build, then the advisor, typed-pair, and per-hub research phases were added
to the 031 packet.

The git graph contains temporary branch-local numbering moves: 016→019 at 5d7407b8e17
and 019→015 at 3de9f7366c5. The canonical rename history recorded by context-index.md
is the later 031→019 move at 904ac78090f, followed by the missed-reference and lock
repairs at 891f3346e05 and b129835139b. That distinction matters: the temporary moves
are real commits in the source-path ledger, but the durable packet identity is
sk-doc/019-sk-doc-router-alignment until the scope rename in 28ae7dce6c6.

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
019 scope rename. The rename at 28ae7dce6c6 made the packet name match the actual fleet-wide
program rather than the original create-* slice.

The direct phase creation order is therefore not the numeric order shown in spec.md:

| First spec.md appearance | Current phase |
|---|---|
| 2026-07-12 12:11 — c0ee8517181 | 010-create-packet-routing-conformance |
| 2026-07-12 16:18 — 424f7c47a1a | 006-create-skill-smart-routing-notes |
| 2026-07-13 07:30 — c6f9c6e7ac8 | 002-router-audit-and-fix-map; 003-router-collision-fixes; 004-trigger-scoping-and-handoffs; 005-router-standardization-and-regen |
| 2026-07-13 14:24 — ae7b74951a1 | 007-create-skill-router-marker-gap |
| 2026-07-13 15:12 — 05f53263ea1 / 778a08b051d | 008-hub-intent-keyword-coverage; 009-create-benchmark-routing-fix |
| 2026-07-16 10:36 — 9860de9720a | 011-sk-doc-routing-fixes; 012-skill-advisor-routing-fixes |
| 2026-07-16 16:15 — 065f2e07f78 | 013-benchmark-harness-typed-wiring |
| 2026-07-16 22:11 — 72bb0bc0c70 | 014-sk-code-router-alignment |
| 2026-07-18 17:02 — 3446995c899 | 015-router-unification-program |
| 2026-07-22 11:00 — 7d8f7c6497a | 016-documentation-quality-program |
| 2026-07-24 13:15 — abc50ff76a3 | 001-research |

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

9796369bc29 performed the structural pass. All research was moved under a new
001-research phase parent, and the implementation/program tree was renumbered into
direct phases 002–016. The old-to-new mappings in context-index.md are the attribution
layer for this move: 020 became 015, 021 became 016, and each earlier A–C phase was
shifted to its current number. abc50ff76a3 then rewrote the cross-references so the
new topology was navigable without rewriting the research evidence itself.

The result is a lean parent with one research phase parent, fifteen numbered direct
children, and nested program topology below 015 and 016. The structural operation
changed navigation and identity; it did not claim that the research was newly
performed at the time of the move.

## E. Epoch five: ungroup 015 and extract the sk-code research

The final pass dissolved 015/003-unified-refactor-implementation as a grouping node.
4b57c99c095 promoted its seventeen children to direct 015 phases 003–019 and resolved
the duplicate-012 naming collision during the promotion. The work preserved the
children's internal evidence while changing their parentage and direct numbering.

cbdb1dbeaca completed the cross-reference repair and extracted 014's research into
001-research/011-sk-code-routing-research. The current tree consequently separates
shared research from implementation phases while keeping the fleet router-unification
program flat and chronologically legible. This is the newest structural state on
skilled/v4.0.0.0 and the endpoint of the timeline recorded here.

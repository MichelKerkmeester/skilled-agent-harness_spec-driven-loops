# Draft purpose sentences for operator review

Drafted 2026-11-14 at `1bedb33577` from each parent's title and its children's own purposes, read through the built purpose helper. Nothing is applied yet. The operator approves, edits or rejects each sentence before E1 to E11 in `plan.md` run.

Each sentence replaces one existing sentence, quoted under it. Every draft opens with a verb, has more than three words before its first full stop and uses no em dash, semicolon or serial comma.

## The eight layout-sentence parents (Fable A-P1-2)

Each replaces `This phase groups the related child phases below so parent-level context stays a short thematic map.` at line 37 of the parent's `spec.md`, under `## Root Purpose`. The second sentence of that paragraph stays.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/001-research-inputs-and-architecture
Sentence: Gather the market research, effectiveness evidence, baseline census and architecture contract the deep-loop program builds on, so every later phase starts from measured inputs.
Read: the four children `001-deep-loop-market-research` to `004-architecture-coverage-and-transition-contract`.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/002-substrate-and-orchestration
Sentence: Build the dark substrate of the new deep-loop runtime, from the authorized event ledger and shared services through durable fan-out and fan-in to convergence and health.
Read: the nine children `001-fanout-live-tools-unblock` to `009-spec-protocol-ledger-events`.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/003-mode-contracts-migration-and-cutover
Sentence: Move each deep-loop mode onto the new spine through shared contracts, staged state migration and authority cutover, then retire the legacy writers it replaces.
Read: the six children `001-shared-mode-contracts-and-fixtures` to `006-deprecate-skill-benchmark`.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/004-gate-closeout-and-drift
Sentence: Prove the program before it closes, through a whole-system gate, an integration onto the moving mainline and a drift census that revalidates each later phase plan.
Read: the three children `001-whole-system-gate` to `003-drift-census-and-plan-revalidation`.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/005-blocker-closeout
Sentence: Close the blockers that kept the migration open, so completion evidence, shadow parity, legacy event coverage and durable writes each hold up under an independent check.
Read: the four children `001-completion-evidence-reconcile` to `004-durable-write-boundaries`.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/006-runtime-docs-and-integrity-hardening
Sentence: Harden the shipped deep-loop runtime so its docs match its code and each certificate, gate, lock and parity check fails on the fault it exists to catch.
Read: the thirteen children `001-runtime-code-readmes` to `013-deep-loop-alignment-review`.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/007-executor-and-cli-hardening
Sentence: Make every CLI executor the deep loop dispatches run correctly and safely, with stress playbooks, wiring parity, write containment and trustworthy state records.
Read: the ten children `001-cli-adapter-stress-and-playbooks` to `010-fanout-write-containment-hardening`.

### specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/008-review-and-rollback-followup
Sentence: Review the shipped runtime and close what that review found, from metadata drift and rollback hashing to review containment and the leaf protocol.
Read: the five children `001-runtime-code-review` to `005-review-leaf-protocol`.

## The three phase 011 sentences Fable reserved

### specs/hooks-plugins-extensions/hook-injection-pipeline/005-smart-rule-injection
Today: Decide from repository evidence which repo rules, if any, a prompt-time hook should carry instead of the Gate 5 load, and design the selectivity that keeps injection off most turns.
Reservation: it describes two of the four children. `003-shallow-evidence-claims` and `004-agents-md-concision` fall outside it.
Sentence: Decide from repository evidence which repo rules, if any, a prompt-time or event hook should carry instead of the Gate 5 load, and sharpen the rule text such a hook would carry, from the evidence a claim needs to a shorter AGENTS.md.

### specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/001-on-write-quality
Today: Make the on-write quality gates for authored specs navigable as one track, from trigger propagation and schema enforcement through provenance, integrity, and per-surface validation.
Reservation: "navigable as one track" describes the layout, not the outcome. It also carries a serial comma.
Sentence: Catch quality faults in authored specs and their metadata at write time, from trigger propagation and schema enforcement through provenance, integrity and per-surface validation.

### specs/sk-design/020-chart-and-diagram-review
Today: Establish a verdict for each of the chart and diagram modes through a four-iteration deep review run on two models.
Reservation: the children state no purpose, so the claim could not be checked. It is now checked: the packet's `synthesis.md` line 26 names one model, DeepSeek V4.1 Flash through `cli-pi`, and lines 28 to 33 say the GPT-5.6-LUNA and second DeepSeek lineages produced no reports. Each child holds four iterations in `review/lineages/deepseek/iterations/` only.
Sentence: Establish a verdict for each of the chart and diagram modes through a four-iteration deep review of each mode, run on DeepSeek V4.1 Flash.

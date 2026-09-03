---
title: "Iteration 009 — Correctness (Broadened Angle 5)"
trigger_phrases: []
---
# Iteration 009 — Correctness (Broadened Angle 5)

## Dimension
correctness — surviving-mode and benchmark-family integrity post-removal

## Files Reviewed
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs:1-366` (hermetic test harness)
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/README.md:1-24` (fixture inventory)
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` (runner — grep for DAB/prefix registry)
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:70-79,210-224,330-344` (authoritative schema + prefix table)
- `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md:1-201` (authoring template)
- `.opencode/skills/sk-doc/sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md:90-119` (authoring guide prefix table)
- `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md:8,32` (keywords + fixed-prefix list — P2-008)
- `.opencode/skills/sk-doc/sk-create-benchmark/changelog/v1.4.0.0.md, v1.3.0.0.md` (historical — ruled out)
- `.opencode/commands/deep/` directory listing (6 surviving commands confirmed)
- `.opencode/skills/system-deep-loop/deep-{research,review,ai-council,improvement}/` directory listings (4 mode packets intact)
- `.opencode/skills/system-deep-loop/deep-improvement/` (grep — no deleted-asset references)
- `.opencode/commands/create/` (grep — no smoke-command-benchmark/conformance references)
- Fixtures directory listing: `SMOKE-000-fake.md`, `fake-leg.js`, `README.md` present; `dab-v1-golden.json` confirmed absent

## Findings by Severity

### P0 (Blockers)
None.

### P1 (Required)
None.

### P2 (Suggestions)

#### P2-013 — framework.md mode enum and budget policy still reference deleted `alignment` mode
- **File**: `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md:74,215-219`
- **Claim**: The authoritative behavior-benchmark framework still lists `alignment` as a valid `mode` enum value (line 74: `context | research | review | ai-council | improvement | alignment`) and references `alignment` scenarios in the budget cap policy (lines 215-219: "`ai-council`, `improvement`, and `alignment` scenarios cap at `1500000` ms ... `alignment` because it runs autonomous multi-cell workloads"). This is internally inconsistent: the same file's ID prefix table (lines 337-340) was correctly cleaned to remove `DAB` (only ACB, IMB, RSB, RVB remain). The `alignment` mode and its deep-alignment packet were deleted by commit 8849444aa6.
- **Evidence refs**: [SOURCE: framework.md:74], [SOURCE: framework.md:215-219], [SOURCE: framework.md:337-340] (prefix table cleaned)
- **Counterevidence sought**: Checked whether `alignment` is still a valid mode elsewhere — mode-registry.json and shipped-census.ts were verified clean in prior iterations (SL-005, SL-007). No surviving mode packet exists for alignment.
- **Alternative explanation**: None — the prefix table cleaning proves the removal was intended to reach this file but the enum/budget sections were missed.
- **Final severity**: P2 (stale reference in authoritative doc; no runtime impact since no alignment scenarios exist to score, but authors reading the enum would believe `alignment` is a valid mode value)
- **Confidence**: 0.95
- **Downgrade trigger**: N/A

#### P2-014 — behavior-benchmark-guide.md prefix table lists `DAB (alignment)` inconsistent with cleaned framework
- **File**: `.opencode/skills/sk-doc/sk-create-benchmark/references/behavior-benchmark/behavior-benchmark-guide.md:101`
- **Claim**: The authoring guide's ID prefix table lists `DAB` (alignment) as a fixed prefix: "`ACB` (ai-council), `DAB` (alignment), `IMB` (improvement), `RSB` (research), and `RVB` (review)." The authoritative framework.md prefix table (lines 337-340) was cleaned to remove DAB (only 4 prefixes remain). The guide is now inconsistent with its own cited authority.
- **Evidence refs**: [SOURCE: behavior-benchmark-guide.md:101], [SOURCE: framework.md:337-340]
- **Counterevidence sought**: Verified framework.md prefix table does not list DAB — confirmed by direct read.
- **Alternative explanation**: None — the guide explicitly cites framework.md as the authority (line 112-114) yet contradicts it on the prefix table.
- **Final severity**: P2 (stale reference in active authoring guide; authors would assign DAB prefix for a deleted mode)
- **Confidence**: 0.95
- **Downgrade trigger**: N/A

#### P2-015 — behavior-benchmark-scenario-template.md stale references to deleted `alignment` mode and `conformance` family
- **File**: `.opencode/skills/sk-doc/sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md:7,36,99,157,190`
- **Claim**: The active authoring template (a fillable scaffold authors copy per scenario) contains five stale references to deleted entities:
  - Line 7: trigger phrase `"DAB scenario scaffold"` (DAB/alignment deleted)
  - Line 36: `"SCHEMA V2 for command, direct-tool/plugin, and conformance families"` (conformance-benchmark family deleted by 8849444aa6)
  - Line 99: `"Schema v2 (command / direct-tool / conformance families ..."` (same stale conformance reference)
  - Line 157: `"mode: ... or a declared extension such as alignment"` (alignment deleted)
  - Line 190: `"1500000 ms (ai-council/improvement/alignment)"` (alignment in budget policy)
- **Evidence refs**: [SOURCE: behavior-benchmark-scenario-template.md:7], [SOURCE: :36], [SOURCE: :99], [SOURCE: :157], [SOURCE: :190]
- **Counterevidence sought**: Verified conformance-benchmark assets were deleted (scope-files.txt lines 181-186) and alignment mode was deleted (scope-files.txt lines 187-252). The template is listed as modified in scope (line 61 of scope-files.txt) but these references survived the edit.
- **Alternative explanation**: None — these are active authoring instructions, not historical changelog entries.
- **Final severity**: P2 (stale references in active template; authors would be guided to create conformance-family and alignment-mode scenarios that no longer have supporting infrastructure)
- **Confidence**: 0.93
- **Downgrade trigger**: N/A

## Traceability Checks
- **spec_code**: Not applicable this iteration (broadened benchmark-family angle; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8).
- **checklist_evidence**: Deferred per strategy.md §9 exhausted-approaches (observation-only review).
- **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not correctness-relevant to this angle).

## Ruled Out Directions
- **behavior-bench-run.test.cjs references deleted DAB fixtures**: RULED OUT — grep for `dab-v1-golden|DAB-|deep-alignment` across the entire behavior-benchmark shared directory returned zero matches. The test references only `SMOKE-000-fake.md` and `fake-leg.js` (both present). The deleted `dab-v1-golden.json` is confirmed absent and unreferenced.
- **behavior-bench-run.cjs has DAB scenario prefix registry**: RULED OUT — grep matches were all `prefix` in the fixture-boundary probe context (`allow_prefixes`, `changed_paths_within`), not a DAB scenario prefix registry. The runner is mode-agnostic.
- **deep-improvement benchmark scripts reference deleted conformance/command-benchmark assets**: RULED OUT — grep across deep-improvement for `deep-alignment|conformance-benchmark|command-benchmark|smoke-command-benchmark|adapter-sk-*` returned zero matches.
- **create/benchmark.md or create-benchmark yaml assets invoke deleted smoke-command-benchmark.cjs**: RULED OUT — grep across `.opencode/commands/create/` for `smoke-command-benchmark|conformance|command-benchmark|deep-alignment` returned zero matches.
- **changelog references to deleted assets (v1.4.0.0.md, v1.3.0.0.md)**: RULED OUT — historical changelog entries documenting past features; not active surfaces. Consistent with prior iteration rulings that changelog references are historical.

## Surviving-Mode and Benchmark-Family Integrity Summary
- **Six surviving deep-loop modes**: Confirmed intact — 4 mode packets (deep-research, deep-review, deep-ai-council, deep-improvement) present with full directory structure (SKILL.md, README.md, assets, behavior-benchmark, feature-catalog, manual-testing-playbook, references, scripts). 6 commands in `.opencode/commands/deep/` (research, review, ai-council, agent-improvement, model-benchmark, skill-benchmark). Metadata consistency verified in prior iterations (SL-005, SL-007).
- **Behavior-benchmark shared family**: Structurally intact — runner (`behavior-bench-run.cjs`), test harness (`behavior-bench-run.test.cjs`), and fixtures (`SMOKE-000-fake.md`, `fake-leg.js`) all present and resolve correctly. No references to deleted DAB scenarios or `dab-v1-golden.json` fixture. The runner is mode-agnostic (no hardcoded DAB prefix registry).
- **Model-benchmark + skill-benchmark packets**: No orphaned references to deleted conformance/command-benchmark assets or alignment adapter contracts. deep-improvement benchmark scripts clean.
- **Smoke scripts**: `smoke-command-benchmark.cjs` was deleted; confirmed no surviving code or doc in create/benchmark.md or create-benchmark yaml assets invokes it.

The benchmark families are functionally intact. The findings (P2-013/014/015) are stale documentation references in the framework, guide, and template — they do not affect runtime behavior (no alignment scenarios exist to score) but would mislead authors.

## Verdict
P0=0, P1=0, P2=15 (12 prior + 3 new). P2-only findings → PASS.

Review verdict: PASS

---
title: "Iteration 2: 008 side + 007 fix rows — which land completely?"
trigger_phrases: []
---
# Iteration 2: 008 side + 007 fix rows — which land completely?

## Focus

Job 1 continues: the fix rows. For 008: ENV-REFERENCE.md rows, runtime/core/config.ts batch block, drift-test path, deleted skill-level template references. For 007: the aligned validation story, the post_save_write rename (residual already zero in iteration 1), the enforced phase-child regex at every site, the sibling-lane rule headers, the ops README rewrite, the deep-loop playbook repoint, and the spec-kit-check workflow's internal coherence (every path it names exists; every command it runs has a matching script).

## Actions Taken

1. Enforced-regex audit: `rg` for the looser form `^[0-9]{3}-[a-z0-9-]+$` over runtime/, runtime/cli/, assets/, references/, SKILL.md — two hits; the same grep over the whole `.opencode`/`.github` (excluding specs, dist, node_modules) returned NONE for the anchored form but the two hits were re-verified by direct line reads (the anchored sweep's escaping can miss; line reads are the proof). Counted the enforced `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` sites: 17 matches across runtime/lib/spec/is-phase-parent.ts, runtime/lib/graph/graph-metadata-parser.ts, runtime/lib/resume/resume-ladder.ts, runtime/cli/spec/{is-phase-parent.ts, sync-phase-map-status.ts, validate.sh}, runtime/cli/lib/shell-common.sh (×2), runtime/cli/rules/check-folder-naming.sh, MODULE-MAP.md, references/structure/phase-definitions.md, references/validation/validation-rules.md, assets/template-mapping.md.
2. 008 checks: ENV-REFERENCE.md — zero occurrences of any removed variable name; config.ts — zero BATCH_SIZE/BATCH_DELAY; env-reference-drift.vitest.ts:125 — `resolve(SYSTEM_SPEC_KIT_ROOT, 'runtime', 'cli')` (the path fix); no references anywhere to the deleted skill-level `.env.example`.
3. 007 fix rows: ARCHITECTURE.md:134 (orchestrator owns every rule verdict; validate.sh is a thin front end) and :180 (39 rules by class: 20 authored-template, 13 operational-runtime, 6 structural); rules/README.md:20 (the hop is validate.sh → runtime/dist/lib/validation/orchestrator.js → registry → one spawn per rule). ops/ now 4 files (README.md, process-memory-harness.ts, process-sweep.ts, retrofit-convention.mjs) with a rewritten README titled "Ops Helpers". Sibling headers verified: spec/check-placeholders.sh:9-10 names the validator rule; rules/check-placeholders.sh:14 names the post-edit hook's broader scan; rules/check-comment-hygiene.sh:13-14 names the sk-code checker and states the different inputs. Deep-loop repoint: zero references to the removed cli coverage-graph anywhere under system-deep-loop (excluding changelog/benchmark); graph-convergence-signals.md:55,61 points at the command contract + ledger schema.
4. spec-kit-check.yml read end to end: all five mirror-check commands resolve to existing files (runtime-mirrors/sync-runtime-mirrors.cjs, codex/sync-agents.cjs, codex/sync-prompts.cjs, doctor agent-roster-mirror-check.cjs, doctor command-catalog-mirror-check.cjs); shared/package.json:18 has the `test` script the workflow calls; vitest.config.ts:41,53 defines the rooted `cli` project the workflow selects; the build order (root ci → shared tsc --build → runtime build → cli build) matches the comment's stated reason (the CLI check gate maps dist back to sources).

## Findings

1. **P1 — the regex fix left two documents behind**: `references/validation/template-compliance-contract.md:236` and `runtime/lib/spec/README.md:16` both still document the phase-parent folder pattern as `^[0-9]{3}-[a-z0-9-]+$` (the looser form), and NEITHER file carries the enforced `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` anywhere (grep count 0 in both). The enforced form is what `runtime/lib/spec/is-phase-parent.ts` implements, and runtime/lib/spec/README.md:16 describes exactly that detection rule ("lib/spec/ owns the single detection rule") — so the engine's own module README documents at odds with its code. The looser form admits names like `003--x` (double dash) that the detector rejects — the same drift round one's merge row 9 and 007's fix claimed to have eliminated everywhere. 007's remediation summary says "the phase-child regex is ... in every document, comment and code site"; these two are the counterexample. Declared purpose: phase-parent qualification rule for authors. Observed callers: documentation contract + module README; no code reads these strings, but an author following them can produce a folder the detectors reject. Severity P1 (misleading, reproduces the original documented-vs-enforced drift). Recommendation: **fix** — replace the two pattern strings with the enforced form.

2. (Verification positives, no finding): 008's ENV-REFERENCE row removal, config.ts batch removal, drift-test path fix, and the deleted skill-level template are all complete; the validation story (39 rules + orchestrator hop) is stated in ARCHITECTURE and rules/README; post_save_write rename left zero residual; ops README rewritten around the 4 surviving helpers; both sibling-lane headers present in all three rule scripts; the deep-loop playbook repoint landed; the spec-kit-check workflow path-level references check out.

## Questions Answered

- (Q2, resolved) Every 008 change verified landed: template (iteration 1), ENV-REFERENCE rows, config.ts constants, drift-test path, skill-level template references.
- (Q3, partial) 007 fix rows: validation story ✓, post_save_write ✓, sibling headers ✓, ops README ✓, playbook repoint ✓, workflow coherence (paths) ✓; regex sites: 15+ sites enforced, but TWO documents still carry the looser form (finding 1).

## Questions Remaining

- Q3 remainder: the workflow's npm-root `ci` (root package.json workspaces field), and whether the mirror job's five checks equal the doctor's five (iteration 7).
- Q5: live validator-registry completeness (iteration 3).
- Q4: round-one misses per subsystem (iterations 4-6).

## What Worked / What Failed

- Worked: the two-stage regex sweep — a broad grep for the looser form, then direct `sed` line reads to confirm before claiming a finding; the second grep's anchor variant was escaping-sensitive, so the line reads (not the sweep) are the proof.
- Worked: verifiability trick for the workflow — check that each named script EXISTS and each named package.json script EXISTS, without running anything.
- Failed: none; no approach exhausted.

## Ruled Out

- The `graphEvents`/`coverage-graph` mentions in deep-review's graph-events-review.md and deep-research's graph-convergence-signals.md — both name the LIVE deep-loop coverage-graph reducer/database, with command-contract pointers where 007 repointed them.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/references/validation/template-compliance-contract.md:236] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/spec/README.md:16] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/spec/is-phase-parent.ts (enforced form) + 16 further sites] [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md (zero removed-var hits)] [SOURCE: .opencode/skills/system-spec-kit/runtime/core/config.ts (zero batch hits)] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts:125-132] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:134,180] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/rules/README.md:20,93-94,133,153] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/ops/ (ls + README head)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/{spec,rules}/check-placeholders.sh:9-14 + rules/check-comment-hygiene.sh:13-14] [SOURCE: .opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/graph-convergence-signals.md:55,61] [SOURCE: .github/workflows/spec-kit-check.yml (full)] [SOURCE: .opencode/skills/system-spec-kit/shared/package.json:18, vitest.config.ts:41,53]

## Next Iteration

Iteration 3: the LIVE dispatch registry — `lib/validator-registry.json` vs every `rules/check-*.sh` vs the orchestrator's dispatch set vs package.json scripts: entries with no matching script, checks with no entry, duplicated checks, and the spec/ + validation/ parcel (validate.sh:374 lines, its sub-invocations, and each spec/*.sh consumers). Recount everything — no round-one numbers.

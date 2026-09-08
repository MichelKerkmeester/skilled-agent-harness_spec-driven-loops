---
title: "Iteration 8: the kept-decisions batch — every round-one recorded decision re-checked on this tree"
trigger_phrases: []
---
# Iteration 8: The kept-decisions batch — every round-one recorded decision re-checked on this tree

## Focus

Job 3, systematically: each recorded decision from confirmed-findings §2-3 (the kept rows) is verified to still hold on the current tree — sweep-track-roots documented, the save-path phase-parent copy justified, the retrieval acceptance trio in its moved/documented state, the four-sweeps non-abstraction honest, the evals gate now CI-executed, and the references/ corner verdict.

## Actions Taken

1. Kept row "sweep-track-roots.mjs stays as the documented manual tool": spec/README.md:74 (tree entry), :108 (full role — "the only check that sees their drift... report-only counts, reconciling a drifted root is an operator-run regeneration"), :152 (the exact invocation `node .../sweep-track-roots.mjs [--specs <dir>]`) — HELD, fully documented.
2. Kept row "save-path phase-parent copy stays because it also recognises derived children and hardened membership": continuity/generate-context.ts:34 imports cli/spec/is-phase-parent.js; spec/is-phase-parent.ts:13-14 comment states "adds derived children and never prunes... mirrors that writer-side membership rule", :42-43 "no runtime import, so it mirrors that rule", :63 DERIVED_CHILD_REGEX vs PHASE_CHILD_REGEX under hardening — the reason is stated in the file — HELD.
3. Kept row "the retrofit moved to ops/": verified the move actually landed — retrieval/retrofit-convention.mjs does NOT exist (wc confirms); the single copy is ops/retrofit-convention.mjs (1209L); retrieval/README.md:74 states the pipeline "lives in ../ops/retrofit-convention.mjs. It imports this folder's lib/ and rg-wrapper.mjs, but nothing at lookup time depends on it." Its callers: docs + two vitest suites (retrofit-convention-pipeline, retrieval-coverage-parity) + references/structure/grep-convention.md — a one-time, documented, test-covered pipeline. HELD (no duplication; no live-consumer claim).
4. Kept row "the sweep and latency harness stay documented as acceptance evidence": retrieval/sweep-memory-residue.mjs + measure-cold-lookup.mjs exist; exec-caller census → docs (feature-catalog/session-recovery-spec-kit-resume.md, retrieval/README.md:23,67,69, retrieval/lib/README.md, references/retrieval/retrieval-conventions.md) + the lib/ import + fixtures; no exec caller. Matches the recorded acceptance-evidence intent. HELD.
5. Four-sweeps row (non-abstraction): the four are still four distinct tools — sweep/strict-pass-freshness.ts (CI: strict-pass-freshness-report.yml), ops/process-sweep.ts (plugin: session-cleanup), retrieval/sweep-memory-residue.mjs (acceptance evidence), spec/sweep-track-roots.mjs (documented manual) — no shared logic extracted. HELD.
6. Round-one fix row 12 (the check gate ran nowhere automated): evals/ = 6 check scripts + import-policy-rules.ts + import-policy-allowlist.json (all present); package.json `check` runs them + lint + check-api-boundary.sh; spec-kit-check.yml (CI) runs `npm run check` — the gate IS now automated. HELD/FIXED (this was a fix row — verified landed).
7. references/ corner (round one: "references/ (presence)" — no caller verdict): the only file is spec-root-alias-retirement-runbook.md. References: two retrieval fixtures (census-enumeration entries) only. Its content describes a topology where "The tracked `specs` blob is a symbolic link whose current payload is an absolute path on one developer machine" — but THIS tree shows repo-root `specs/` as a real directory and `.opencode/specs` → ../specs as the (relative) symlink. The runbook's stated premise does not match the observed tree; the intent (retire a portability-hostile alias) may still hold for the main checkout. Not filed as a finding — the discrepancy is unverifiable in this worktree (the same worktree-caveat class as round-one f-iter001-006). Recorded as an observation.
8. Confirmed still honest: ops/README rewritten around the 4 survivors; rules/README lands the orchestrator hop once; the workbook balance checks out — no new kept-row is overturned in this batch.

## Findings

(None new this iteration. Every kept row held under direct verification; the only fresh material is the references/ runbook observation above, which is deliberately not filed because the tree topology it contradicts may be worktree-scoped.)

## Questions Answered

- (Q8, resolved) Round one's kept decisions all hold on this tree: sweep-track-roots fully documented (spec/README.md:74,108,152); save-path phase-parent copy comment states its justification (spec/is-phase-parent.ts:13-14,42-43,63); retrofit moved cleanly to ops/ with an honest README; the two acceptance harnesses are documented-but-unwired as recorded; the four sweeps remain four; the evals check gate is CI-executed (spec-kit-check → npm run check).

## Questions Remaining

- Cross-package duplication: helpers duplicated across cli/, ../lib/, shared/ (iteration 9 — the one remaining big-ticket undecided angle).
- Final full-census certification + the ranked removal/merge list (iteration 10).

## What Worked / What Failed

- Worked: the false-lead discipline again — the "retrofit still in retrieval/" scare was resolved by wc + diff (single copy in ops/); the earlier `ls` output had merged two listings. No finding filed on a non-existent file.
- Worked: checking the runbook's factual premise (the symlink topology) before grading — it does not match this tree, so it is an observation, not a finding.
- Failed: none; no approach exhausted.

## Ruled Out

- A duplicated retrofit pipeline — single copy (ops/retrofit-convention.mjs, 1209L).
- A finding on spec-root-alias-retirement-runbook.md — topology mismatch is worktree-unverifiable; recorded as observation only.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/README.md:74,108,152] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:34, spec/is-phase-parent.ts:13-14,42-43,63] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs (wc 1209) + ops/README.md + retrieval/README.md:74] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/{sweep-memory-residue.mjs,measure-cold-lookup.mjs,README.md:23,67,69}] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/sweep/, ops/process-sweep.ts, .github/workflows/strict-pass-freshness-report.yml] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/evals/ (ls) + package.json check + spec-kit-check.yml] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/references/spec-root-alias-retirement-runbook.md (head) + ls -ld specs .opencode/specs]

## Next Iteration

Iteration 9: cross-package duplication — helpers duplicated across cli/, ../lib/, shared/: the repo-root resolvers (round one found 3), phase-parent detectors (3, one documented as intended), regex sites, template mechanisms, the YAML lanes, and any NEW duplication the 007 removals created (e.g., is there still a lib/helper with a cli twin? utils/ vs shared/?). Also check whether the 007 removal left any import in lib/ pointing at a removed file (e.g., lib/index barrels re-exporting removed modules — the renderers or quality-scorer cleanup could have left a stale export line).

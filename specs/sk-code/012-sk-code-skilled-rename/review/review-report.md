---
title: "Review Report: sk-code-skilled rename double-check"
description: "Three-iteration deep review (cli-devin, DeepSeek V4.1 Flash Max) of the staged sk-code-opencode to sk-code-skilled rename: PASS with four P2 advisories."
trigger_phrases:
  - "sk-code-skilled rename review"
  - "rename double-check review report"
importance_tier: "normal"
contextType: "review"
---

# Review Report: sk-code-skilled rename double-check

<!-- ANCHOR:review-report -->

## 1. Executive Summary

- **Verdict: PASS**
- **hasAdvisories: true**
- Active findings: P0 0, P1 0, P2 4
- Scope: the staged, uncommitted rename in worktree `.worktrees/144-sk-code-skilled-rename`, checked against `git diff --cached HEAD`. The manifest is `review/scope-files.txt`: 278 paths, made up of live changed files outside `specs/` plus the renamed spec packets' metadata.
- Executor: three iterations on `cli-devin` with `deepseek-v4-1-flash-max`, stop policy `max-iterations`. Stop reason: `maxIterationsReached`.
- Dimensions covered: correctness, security and traceability. Maintainability was not covered as its own pass. Iterations 2 and 3 touched it only incidentally.

All five requested checks pass:
1. No OpenCode runtime name was rewritten. There are zero `cli-skilled` hits, and every `.opencode/` path is intact.
2. Outside the documented exclusions, no live reference to the old identity remains, apart from the four advisories below.
3. The hub routing JSONs, `SKILL.md`, `ROUTER.md`, the advisor plugin, the doctor pins, the tests and the fixtures all agree with each other.
4. All 53 renamed spec metadata files parse, and their identity fields match the new folder names. No relative links are broken.
5. The changelog symlink resolves, and the hermes mirror carries the new identity.

## 2. Planning Trigger

`/speckit:plan` is not required. Every finding is P2 advisory and optional.

```json
{
  "Planning Packet": {
    "triggered": false,
    "verdict": "PASS",
    "hasAdvisories": true,
    "activeFindings": [
      {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907"},
      {"id": "R1-P2-002", "severity": "P2", "file": "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/dispatch-units-extra.json:98"},
      {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:518"},
      {"id": "R3-P2-001", "severity": "P2", "file": "specs/sk-code/012-sk-code-skilled-rename/002-skill-and-routing-rename/implementation-summary.md:107"}
    ],
    "remediationWorkstreams": ["identity-hygiene advisories (optional)", "evidence persistence (optional)"],
    "specSeed": "UNKNOWN",
    "planSeed": "UNKNOWN",
    "findingClasses": ["stale_identity_residual", "claim_evidence_gap"],
    "affectedSurfacesSeed": [".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs", ".skilled/skills/sk-code/sk-code-review/SKILL.md", ".skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json", "specs/sk-code/012-sk-code-skilled-rename/002-skill-and-routing-rename/"],
    "fixCompletenessRequired": false
  }
}
```

## 3. Active Finding Registry

**R1-P2-001: a retrieval fixture keeps one phrase variant with the old name.** Correctness, iteration 1.
- Location: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907`
- Evidence: the key `sk code opencode rename impact` still maps to `sk-code-opencode rename impact`.
- Cause: the phrase comes from this packet's own phase-001 trigger phrases, and those docs are excluded from the sweep. The fixture is generated from them.
- Impact: fixture hygiene only.
- Fix: accept it as a historical-query alias, or add a `sk-code-skilled rename impact` trigger phrase and regenerate.
- Disposition: advisory.

**R1-P2-002: three historical records outside the machine-record extensions carry the old name.** Correctness, iteration 1.
- Locations: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/dispatch-units-extra.json:98`, `.../005-opencode-and-guards/scratch/dispatch-units.json:518`, and `specs/sk-prompt/z_archive/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/findings-registry.json:1219`
- Evidence:
  - The two dispatch-unit scratch files hold literal old-to-new replacement instructions.
  - The findings-registry hit is the executor id `cli-opencode`, which is a runtime name and was correctly preserved.
- Impact: historical fidelity only.
- Fix: none needed if archives are frozen. Otherwise, add scratch dispatch records to the documented exclusions.
- Disposition: advisory.

**R2-P2-001: the old surface token survives in identifier names inside the hub.** Security, iteration 2.
- Locations:
  - `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:518` (`OPENCODE_LANGUAGES`), `:526` (`detectOpencodeLanguages`) and `:629`
  - `.skilled/skills/sk-code/sk-code-review/SKILL.md:223,249` (`OPENCODE_PATH_MARKER = ".skilled/"`)
- Evidence: the same file renames the surface key to `SKILLED` at `:495` and `:510`. The identifiers are internal and consistent with each other.
- Impact: naming hygiene only. There's no runtime effect.
- Fix: rename them to `SKILLED_LANGUAGES`, `detectSkilledLanguages` and `SKILLED_PATH_MARKER`, or record that identifier naming was out of scope.
- Disposition: advisory, confirm intent.

**R3-P2-001: the post-change runtime-name count isn't stored with the gate evidence.** Traceability, iteration 3.
- Location: `specs/sk-code/012-sk-code-skilled-rename/002-skill-and-routing-rename/implementation-summary.md:107`, which says "1,189,410 lines before and after".
- Evidence: `scratch/baseline/runtime-names.txt` stores the baseline, but no file under `scratch/after/` holds a post-change count.
- Impact: one claim in the verification table can't be reproduced from the packet's own evidence.
- Fix: persist `scratch/after/runtime-names.txt`, and define what counts as a runtime-name line.
- Disposition: advisory.

## 4. Remediation Workstreams

- P0: none.
- P1: none.
- P2 advisories, all optional:
  1. Identity hygiene: R2-P2-001 (rename the identifiers) and R1-P2-001 (decide on the alias).
  2. Evidence persistence: R3-P2-001.
  3. Exclusion list: R1-P2-002.

## 5. Spec Seed

- Record whether identifier-level names that carry the old surface token (`OPENCODE_LANGUAGES`, `detectOpencodeLanguages`, `OPENCODE_PATH_MARKER`) are in scope for the SKILLED surface rename.
- Add scratch dispatch-unit JSON records to the history exclusion list, or rename them too.

## 6. Plan Seed

- Persist the post-change runtime-name count to `002-skill-and-routing-rename/scratch/after/runtime-names.txt`, and cite it from the implementation summary.
- Optionally rename the three hub identifiers, then re-run the drift guards, the packet tests and `parent-skill-check.cjs .skilled/skills/sk-code`.

## 7. Traceability Status

### Core Protocols

- `spec_code`: **pass**. Packet 012's phases 001 to 003 describe the same operation as the staged diff.
- `checklist_evidence`: **pass with a gap**. The verification-table claims map to stored artifacts and the live state, except the post-change runtime-name value (R3-P2-001).

### Overlay Protocols

- `skill_agent`: **pass**. The hub registries and docs carry only the new identity, and the advisor plugin's surface detection is consistent.
- `agent_cross_runtime`: **pass**. The hermes mirror was regenerated (68 files). The `.opencode`, `.claude` and `.devin` skill symlinks resolve, `.pi` is clean, and `.opencode/plugins` is preserved.
- `feature_catalog_code`: **pass**. The catalog carries no old identity.
- `playbook_capability`: **pass**. The six renamed scenarios are consistent, with zero unresolved links outside the packet docs.

`AC_COVERAGE` is exempt: the packet's children are Level 1.

## 8. Deferred Items

- Maintainability was not covered as its own pass within the 3-iteration budget.
- Lowercase `opencode` prose in the packet's `SKILL.md` H1 (`# opencode Surface — System-Code Evidence`) and in runtime-era banners (`# OPENCODE CREATE:` in the create assets, `OPENCODE_ROOT`, `OPENCODE_DEADLINE_MS`) was ruled out. It falls in the documented runtime-name exclusion class. It's the same confirm-intent question as R2-P2-001, if you want no OpenCode branding at all inside the hub.

## Dimension Expansion Map

- Saturated directions: none.
- Completed or failed pivots: none. The convergence mode was `default` and no pivots ran.
- Remaining frontier: maintainability.

## 9. Search Ledger

- hasSearchDebt: false
- `searchCoverage`: all five required bug classes are covered: `stale_identity_reference`, `broken_relative_link`, `metadata_identity_mismatch`, `claim_evidence_gap` and `symlink_mirror_drift`. The graph coverage mode is `graphless_fallback`.
- `candidateCoverage.covered`: `broken_relative_link`, `claim_evidence_gap`, `metadata_identity_mismatch`, `mirror_or_symlink_drift`, `registry_inconsistency`, `runtime_name_rewrite`, `stale_identity_reference`, `stale_identity_residual` and `symlink_mirror_drift`.
- `searchDebt`: empty.
- `ruledOutCandidates` / `cleanSearchProof`: 14 rows across the three iterations:
  - `runtime_name_rewrite` (×2)
  - `registry_inconsistency` (×2)
  - `broken_relative_link` (×3)
  - `mirror_or_symlink_drift`
  - `stale_identity_residual`
  - `dangling_or_wrong_symlink`
  - `mirror_drift`
  - `metadata_identity_mismatch`
  - `stale_identity_reference`
  - `symlink_mirror_drift`

## 10. Audit Appendix

**Convergence:** 3 of 3 iterations ran, with stop reason `maxIterationsReached`. The graph decision stayed `STOP_BLOCKED`, because the `uncovered_dimensions` blocker held until maintainability was covered. That was telemetry only under the `max-iterations` policy.

**Iterations:**
1. Correctness: complete, 25 files reviewed, 2 new P2s.
2. Security: complete, 31 files reviewed, 1 new P2.
3. Traceability: complete, 12 files reviewed, 1 new P2.

**Coverage:** correctness, security and traceability (3 of 4 dimensions).

**Self-check:** the adversarial self-check didn't apply, because there are no P0 or P1 findings. The orchestrator re-read the evidence for every P2 and confirmed it:
- `phrase-variants.json:90906-90907`
- `router-replay-lib.cjs:518,526,629`
- `sk-code-review/SKILL.md:223,249`
- `implementation-summary.md:107`
- the missing after-side runtime-names file

**Sources:** `review/iterations/iteration-001.md` to `iteration-003.md`, `review/deltas/iter-001.jsonl` to `iter-003.jsonl`, `review/resource-map.md` and the staged diff.

<!-- /ANCHOR:review-report -->

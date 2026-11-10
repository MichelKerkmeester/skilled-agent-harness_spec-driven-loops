# Deep Review Report — Skill authoring remediation commits (`191aea6baa..03e31f902b`, base `bb3878b570`)

Lineage: `dsflash-llmgw` (detached fan-out, executor `cli-pi` / `deepseek-v4.1-flash`, session `fanout-dsflash-llmgw-1791670467637-7ccw83`).
Loop: 5 iterations, stop policy `max-iterations`, stop reason `maxIterationsReached`. Review target read-only throughout.

## Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (advisories are listed; the verdict is driven by an active P1)
- **Active findings:** P0=0, P1=1, P2=7
- **Review scope:** the ten commits listed in `steer.md` (pre-commit gate, changelog workflows, create-skill guidance, advisor scoring and surfaceHint, freshness/validators, planning and goal-budget commits), file list `goal-file-manifest.txt`, plus the phase packets `014-skill-authoring-ux-research/002..010`.
- **Dimensions:** correctness, traceability, maintainability covered; security reviewed only as folded checks (argv construction, trust boundaries) — no dedicated security iteration, recorded in Deferred Items.
- **Bottom line:** the ten commits implement what they claim, and every new test was shown (by inspection against the pre-change sources) to fail without its fix. One P1 and seven P2 findings are recorded; none is a P0. The P1 is a missing trigger class in the new pre-commit gate that can let a deletion-shaped skill edit ship stale derived files.

## Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL with one active P1 and seven active P2s.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["I1-P1-001", "I1-P2-001", "I1-P2-002", "I2-P2-001", "I3-P2-001", "I3-P2-002", "I4-P2-001", "I4-P2-002"],
  "remediationWorkstreams": [
    "WS-1: close the deletion trigger gap in gate:skill-authoring (I1-P1-001)",
    "WS-2: make the skill-authoring gate's skips observable and fail-closed for missing tooling (I1-P2-001, I1-P2-002)",
    "WS-3: mirror the mention rules into the Python scorer and record the divergence (I3-P2-001)",
    "WS-4: tighten metadata and gate contracts (I2-P2-001, I3-P2-002, I4-P2-002)",
    "WS-5: scope the validator ignore exemption to committed rules (I4-P2-001)"
  ],
  "specSeed": [
    "Add deletion-shaped staged changes to the skill-authoring gate trigger set and cover them in pre-commit.test.sh.",
    "Warn or block when node or a creator tool is absent inside the toolchain repo, matching sibling gates.",
    "Give confirm mode the same BUILD-increment collision remedy auto mode has.",
    "Mirror hasPlainMention/targetsOwnDocFile into skill_advisor.py or record the divergence with a corpus prompt.",
    "Restate engines.node as ^20.19.0 || >=22.12.0 to match the build toolchain.",
    "Gate FAMILY MISMATCH under --strict or rename the CI step's promise.",
    "Scope _present_or_ignored to committed ignore rules so validation is reproducible."
  ],
  "planSeed": [
    "pre-commit: include --diff-filter=...D, add a deletion case to the harness, keep the whole-skill-removal guards.",
    "pre-commit: add an in-toolchain missing-node warning and a preflight block for the three creator tools.",
    "create-changelog-confirm.yaml: mirror the auto increment instruction on collision.",
    "skill_advisor.py: implement the plain-mention and doc-target rules; add a path prompt to labeled-prompts.jsonl only with an approved-divergence entry if kept divergent.",
    "runtime/package.json + lock root: set engines.node ^20.19.0 || >=22.12.0.",
    "skill-graph-freshness.cjs: set strictProblem on family mismatches; add a vitest case.",
    "validate_catalog_package.py: restrict check-ignore inputs or document the machine dependence in the helper docstring."
  ],
  "findingClasses": ["missing-verification", "observability", "fail-open", "incomplete-mirrored-behavior", "metadata-accuracy", "nondeterministic-exemption", "ungated-drift-class"],
  "affectedSurfacesSeed": [
    ".skilled/scripts/git-hooks/pre-commit",
    ".skilled/scripts/git-hooks/tests/pre-commit.test.sh",
    ".skilled/commands/create/assets/create-changelog-confirm.yaml",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/package.json",
    ".skilled/commands/doctor/scripts/skill-graph-freshness.cjs",
    ".skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### I1-P1-001 — Staged deletions never select a skill, so the gate skips the change class that most often stales derived files

- Severity: P1 | Dimension: correctness | Class: missing-verification
- File: `.skilled/scripts/git-hooks/pre-commit:323`
- Evidence: `git diff --cached --name-only --diff-filter=ACMR -- "$SKILLS_REL/"` drops deletions; probe `probe/d-filter` shows `ACMR` lists nothing while `ACMRD` lists the deleted path; CI path filters cover `**/SKILL.md`/manifest files but not general `references/**`.
- Impact: an edit that deletes a skill file can land with a stale `leaf-manifest.json` (or mode registry) because neither the commit gate nor CI's triggered checks see it.
- Fix: include `D` in the filter (whole-skill removals already skip via the `-f` guards) and add a deletion-shaped case to `pre-commit.test.sh`.
- Scope proof: inside commit 410df0acce's new gate block; probe and CI trigger claims checked read-only.
- Affected surfaces: `.skilled/scripts/git-hooks/pre-commit`, `tests/pre-commit.test.sh`.

### I1-P2-001 — `node` unavailable disables the gate with no notice

- Severity: P2 | Dimension: maintainability | Class: observability
- File: `.skilled/scripts/git-hooks/pre-commit:315`
- Evidence: sibling gates warn when node is missing (`:158-159` phrase lint, `:184-188` mirror parity); this gate skips silently.
- Impact: a toolchain checkout without node commits skill edits with no gate and no line saying why.
- Fix: print a warning when `_in_toolchain_repo` and `command -v node` fails.

### I1-P2-002 — A missing creator tool is skipped silently, against the hook's fail-closed convention

- Severity: P2 | Dimension: maintainability | Class: fail-open
- File: `.skilled/scripts/git-hooks/pre-commit:339`
- Evidence: `-f "$LEAF"`/`-f "$DOCTOR"`/`-f "$SIGNALS"` skip each check; mirror parity (`:281-286`) and spec-remint (`:727-732`) block on a missing script inside the toolchain.
- Impact: a renamed or deleted creator script silently retires enforcement.
- Fix: preflight the three repo-wide tool paths and block (or warn) when absent in-toolchain.

### I2-P2-001 — Confirm mode gained the upstream collision check without the remedy auto mode has

- Severity: P2 | Dimension: correctness | Class: incomplete-mirrored-behavior
- File: `.skilled/commands/create/assets/create-changelog-confirm.yaml:501`
- Evidence: auto says "Increment BUILD segment until unique" (`create-changelog-auto.yaml:514-518`); confirm only "Verify no collision ...".
- Impact: an interactive run has no defined resolution for an upstream-only collision; only the global NEVER rule and the human checkpoint stand in.
- Fix: mirror the auto increment instruction.

### I3-P2-001 — Path-token and doc-target mention rules exist only in TypeScript; the Python fallback still lifts skills from paths

- Severity: P2 | Dimension: correctness | Class: incomplete-mirrored-behavior
- File: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4296`
- Evidence: Python's `_matches_phrase_boundary` flank class `[a-z0-9_-]` treats `/` as a boundary; reproduced with `python3 -c` on the vitest case-1 prompt (`True`), where the new TS lane returns no `explicit:` evidence.
- Impact: `--force-local` keeps the false-positive class the commit fixed; the parity corpus has no path prompt and no approved-divergence entry.
- Fix: mirror the two rules, or add a corpus prompt plus an approved divergence if the gap is deliberate.

### I3-P2-002 — `engines.node >=20.19.0` is wider than the build toolchain range

- Severity: P2 | Dimension: traceability | Class: metadata-accuracy
- File: `.skilled/skills/system-skill-advisor/runtime/package.json:6`
- Evidence: rolldown/vite in the lockfile use `^20.19.0 || >=22.12.0`; the phase summary cites those deps as the field's source.
- Impact: install/build under Node 21 or 22.0–22.11 passes the engine check and fails in the toolchain.
- Fix: `"node": "^20.19.0 || >=22.12.0"` in `runtime/package.json` and the lock root.

### I4-P2-001 — The missing-path exemption consults the machine's whole git exclude stack

- Severity: P2 | Dimension: correctness | Class: nondeterministic-exemption
- File: `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:435`
- Evidence: probe — `git check-ignore -q -- secret.env` exits 0 with a global `core.excludesFile` and 1 without it.
- Impact: a genuinely missing cited path can be tolerated locally and reported on CI (or vice versa); validation is not reproducible across machines.
- Fix: scope the check to committed ignore rules, or document the machine dependence as an accepted limit.

### I4-P2-002 — `--strict` does not gate a compiled-vs-disk family mismatch

- Severity: P2 | Dimension: traceability | Class: ungated-drift-class
- File: `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:252`
- Evidence: `report('FAMILY MISMATCH compiled vs disk', ...)` never sets `strictProblem`; a family-only edit leaves derived stamps unchanged, so the new CI step exits 0 with a stale compiled family.
- Impact: the CI step named "compiled json matches graph-metadata" does not enforce that promise for the family field.
- Fix: set `strictProblem` when `familyMismatches(...)` is non-empty, or rename/narrow the step's claim.

## Remediation Workstreams

1. **WS-1 (P1, blocking CONDITIONAL):** I1-P1-001 — add deletion coverage to the skill-authoring gate; verify with a fixture that stages only a deletion.
2. **WS-2 (P2):** I1-P2-001, I1-P2-002 — make skips observable and fail-closed for missing tooling.
3. **WS-3 (P2):** I3-P2-001 — Python mirror or recorded divergence.
4. **WS-4 (P2):** I2-P2-001, I3-P2-002, I4-P2-002 — mirrored remedy, engines range, family gate.
5. **WS-5 (P2):** I4-P2-001 — deterministic ignore exemption.

P2 advisories may ship with the verdict unchanged only after the P1 is resolved or explicitly waived.

## Spec Seed

- Gate trigger contract for `gate:skill-authoring`: list the change shapes it claims to cover (add/copy/modify/rename/delete) and add the harness cases for each.
- Skip contract: every condition that turns a gate off names its warning line and its in-toolchain failure mode.
- Mirror contract for the advisor scorers: state which rules are TS-only and which are mirrored, and keep the parity corpus pointing at each.
- Engines and checker reproducibility: metadata fields name their exact source range; validators state which local configuration can change their result.
- CI step names must equal their enforced check set (freshness panel).

## Plan Seed

- Add `--diff-filter=ACMRD` handling plus a deletion test to `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`.
- Add the missing-node warning and a creator-tool preflight to `.skilled/scripts/git-hooks/pre-commit`.
- Mirror `create-changelog-auto.yaml`'s increment line into `create-changelog-confirm.yaml`.
- Port `hasPlainMention`/`targetsOwnDocFile` to `skill_advisor.py` (or ledger the divergence and add a corpus prompt).
- Update `engines.node` in `runtime/package.json` and its lock root.
- Gate family mismatches in `skill-graph-freshness.cjs` with a vitest case.
- Constrain `_present_or_ignored` to committed ignore sources.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Every phase summary's What Was Built / Files Changed matches its commit (iterations 2-5); the P1 finding records a gap between the gate's stated "staged file" scope and its implemented trigger set. |
| `checklist_evidence` | partial | Phase Verification rows name runnable commands; the reviewed lineage did not execute the product test suites (write containment), so test claims were verified by source inspection and read-only probes (goal.cjs, check-goal, doctor, regex reproduction). |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | `sk-create-skill` guidance matches the advisor's real consumers (`skill-markdown.ts`, `derived/extract.ts`); advisor SKILL.md ↔ runtime version 0.15.0.0. |
| `agent_cross_runtime` | pass | `.hermes` copies regenerated in the same commits for sk-create-changelog, sk-create-skill, system-skill-advisor; mirror diff shows only generated header/link rewriting. |
| `feature_catalog_code` | notApplicable | The catalog content itself is unchanged in this range; only its validator script was edited (finding I4-P2-001). |
| `playbook_capability` | pass | `doctor-git-hooks-list.md` updated with the fourteen-gate count; pre-commit README gate/bypass counts match the hook. |

AC_COVERAGE: exempt — the review target folder has no `checklist.md` (review-phase scaffold).

## Deferred Items

- **Security dimension:** no dedicated iteration; folded checks only (argv-array exec for `surfaceHint`, trust-boundary notice in the hook, negative guard). A follow-up pass should exercise the hook's untrusted path and the advisor's input surfaces against a hostile prompt corpus.
- **Generator execution:** suites were not run by this lineage (write containment); the consuming phases' own verification rows report `85/0`, `5 passed`, `3 passed`, `14 passed`, `pass 1`, `module checks pass` respectively, and the fail-without-fix behavior was verified by inspection of the pre-change sources.
- **Python fallback:** I3-P2-001 overlaps the lead-ruled-out battery ratio only in spirit; the ruling covered the metric, not the mirror gap.
- **cli-jev dangling changelog links:** pre-existing, outside this range; the changelog workflow stops cleanly on them.

## Dimension Expansion Map

No divergent pivots were taken (stop policy `max-iterations`; convergence signals were telemetry). The steer's five focuses were executed in order:

| Iteration | Focus | Outcome |
|-----------|-------|---------|
| 1 | pre-commit `gate:skill-authoring` (410df0acce) | 1 P1 + 2 P2 |
| 2 | changelog workflows + create-skill (7bbb7f0f20, dffd7f98e2) | 1 P2 |
| 3 | advisor scoring + surfaceHint (479186cfed, eeb6285a8e) | 2 P2 |
| 4 | freshness + validators (827e44abc8, 03e31f902b) | 2 P2 |
| 5 | cross-cutting pass (all commits) | 0 new |

Swept directions: Python battery ratio (lead-ruled), upstream regex depth asymmetry, `description.json` scoring, cli-jev dangling links, exec-bit change, fixture-path exemption abuse. Remaining frontier: security dimension.

## Search Ledger

*No search-depth state captured (legacy v1 record).* All five iteration records are v1 (unversioned) per the rollout contract; the reducer will warn on shallow records rather than reject them. Search coverage is reconstructable from the iteration narratives: each iteration lists its files, the probes run, and the ruled-out directions; `probe/d-filter` and `probe/geprobe` hold the only executable reproductions.

## Audit Appendix

### Convergence Summary

| Iteration | newFindingsRatio | New findings | Cumulative (P0/P1/P2) |
|-----------|------------------|--------------|------------------------|
| 1 | 1.00 | 0/1/2 | 0/1/2 |
| 2 | 0.125 | 0/0/1 | 0/1/3 |
| 3 | 0.20 | 0/0/2 | 0/1/5 |
| 4 | 0.17 | 0/0/2 | 0/1/7 |
| 5 | 0.00 | 0/0/0 | 0/1/7 |

Stop reason: `maxIterationsReached` (cap 5 of 5). Trend: decreasing new-finding weight with the last iteration clean; the loop never claimed convergence because the policy forbids an early stop.

### Coverage Summary

- Iterations: 5 of 5, all `status=complete`, each validated by `verify-iteration.cjs` (narrative + route proof + delta).
- Dimensions: correctness (iterations 1-5), traceability (2-5), maintainability (1, 5); security not separately iterated.
- Traceability core protocols executed; overlays assessed as above.
- Evidence: every finding carries `file:line`; the two probe directories under this lineage hold the reproductions; no finding relies on inference alone.

### Ruled-Out Claims (with reasons)

- Python battery 9/17 vs 13/17 — lead-traced to the local fallback scorer, reproduced on an untouched tree (steer.md; not re-litigated).
- sk-vision `dist` and `create-journey-proof` failures — environment gaps that predate the range (steer.md).
- Upstream regex depth asymmetry — per-target max scan showed identical maxima for every real changelog target.
- `description.json` scoring — zero non-test references in the advisor runtime.
- Empty-`CHANGELOG_DIR` failure — guarded by step 2's stop on a missing folder.
- Untrusted-clone notice wording — names the exact config key the trust block reads.
- Exec-bit change on `regenerate-skill-derived.cjs` — no caller executes it directly.
- Hub recommended-section suppression, `.ts`/`.txt` extensions, fixture-path exemption — all target warning classes and are covered by control tests.

### Sources Reviewed

Commit range `191aea6baa..03e31f902b` (all ten commits) and base `bb3878b570`; `goal-file-manifest.txt`; `steer.md`; phase packets `002`-`010` (spec, goal, tasks, implementation summary) and the `014` parent spec/goal; `.skilled/repo-rules/prevent-overengineering.md`; the hook, changelog, advisor, freshness and validator sources with their tests; goal tooling outputs (`goal.cjs packet`, `check-goal.cjs`); a read-only `parent-skill-check.cjs` run on sk-doc; two git probes under `probe/`.

Review verdict: CONDITIONAL

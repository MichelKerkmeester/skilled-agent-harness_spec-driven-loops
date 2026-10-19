# Iteration 005 — Q4 rename plan and Q5 history counts; both residuals closed

## Focus
- Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing?
- Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded?
- Residuals carried from iteration 4 (its F5): the advisor DB reindex command; the trigger-index drift guard isolation.

## Actions Taken
1. Read the state set (config, strategy, registry, `iterations/iteration-004.md`) — confirmed Q4/Q5 open and the two residuals.
2. Read `.skilled/skills/system-skill-advisor/SKILL.md` — surfaced the advisor mutation surface (`advisor_rebuild`, `skill_graph_scan`), the `--trusted` gate, and the package-local SQLite ownership.
3. Ran one consolidated read-only sweep: per-bucket reference counts (`rg -c` line-sums, hidden trees included), trigger-index guard probes (generator callers, `.github` workflows, runtime tests), advisor rebuild and DB-path probes.
4. Composed the ordered rename plan (F4) folding both residuals in as first-class steps.

## Findings

### F1 — Advisor reindex residual closed: `advisor_rebuild` (P1)
The residual command is `advisor_rebuild` — the explicit repair command that indexes `.skilled/skills/`, publishes a fresh skill-graph generation with `reason: "advisor_rebuild"`, and skips a rebuild when status is `live` unless `force:true` is passed [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md:22] [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md:24].

Exact invocation, per the feature leaf: `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true`. The CLI refuses the call without `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`; an untrusted call exits 64 [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md:26]. The front-door contract lists `advisor_rebuild` as mutating [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47], consistent with the SKILL.md mutation rule [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:304].

The state it republishes is the package-local SQLite database at `.skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite` [SOURCE: .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:47]; the advisor daemon is the single writer [SOURCE: .skilled/skills/system-skill-advisor/references/config/db-path-policy.md:72]. Doctor corroborates the repair path: after a release, "run /doctor:skill-advisor rebuild for the advisor's skill graph" [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:167].

### F2 — Trigger-index drift guard isolated: the generator's own `--check` mode (P1)
The drift guard is `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` — exit 0 = fresh, 1 = stale documents named, 2+ = unreadable index; it writes nothing [SOURCE: .skilled/commands/doctor/_routes.yaml:56]. Doctor uses it as the staleness evidence in isolation [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:120] [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:175], and the pre-commit hook also runs the generator when spec docs change [SOURCE: .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml:25].

CI wiring: `advisory-checks.yml` runs `--check` as a non-gating advisory [SOURCE: .github/workflows/advisory-checks.yml:68] [SOURCE: .github/workflows/README.md:26]; `trigger-index-rebuild.yml` repairs drift after pushes to `main` or `skilled/**`, staging `trigger-index.json` plus the three fixture sidecars (`corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`) with a `Trigger-Index-Rebuild: ci` loop guard [SOURCE: .github/workflows/trigger-index-rebuild.yml:3] [SOURCE: .github/workflows/README.md:50].

Vitest coverage exists on the generator and the rebuild workflow: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:38] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:55] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/retrieval-repo-root.vitest.ts:13].

### F3 — Q5: counts and the exclude recommendation (P1)
Method: `rg -c --hidden -g '!.git/**' -g '!node_modules/**'` per-file matching-line counts summed per bucket. Cross-check: the search tool reported 15,104 occurrences (occurrence units, scope differs from the rg sweep) — recorded so the two numbers are not read as a disagreement.

| Bucket | Matching lines |
|---|---|
| Total repo | 11,282 |
| specs/ (history core) | 10,371 |
| — specs/**/z_archive/** | 2,508 |
| — specs/**/research/** | 1,954 |
| — specs/**/iterations/** | 1,356 |
| .skilled/ (live tree) | 852 |
| — .skilled/changelog (history) | 6 |
| — .skilled/skills (live) | 816 (packet itself 162; packet changelog 45; packet benchmark 0) |
| — .skilled/bin / .skilled/commands | 14 / 14 |
| .hermes mirror | 53 |
| .claude / .codex / .devin / .cursor / .github | 0 each (rg does not follow symlinked trees by default; the mirror check remains the authority) |
| Other visible paths | ~6 |

History ~ 10,422 lines (specs 10,371 + changelogs 51) ~ 92% of all references; live non-spec ~ 899 (.skilled 846 + .hermes 53).

Recommendation: EXCLUDE history from the rename sweep — do not rewrite. (a) Provenance: changelogs, z_archive, research logs and iteration files record what was true when written; rewriting falsifies the record. (b) Scale: ~10.4k lines vs ~0.9k live. (c) Benchmark reports carry the bare-form id family as historical measurement ids (0 prefixed lines under `packet_benchmark`; bare forms live in the README/reports per iteration-1 findings). (d) Accepted cost: historical SOURCE tags citing the old packet path will warn (moved file) when those packets are re-validated — warnings, not failures. Generated retrieval fixtures (`runtime/cli/retrieval/fixtures/*`, e.g. 13 spaced-form entries at `phrase-variants.json:23180`) are NOT history — they regenerate. Optional: one forward-pointer line in the packet changelog/README at rename time.

### F4 — The ordered, test-guarded rename plan (P1; answers Q4)
Order rationale: the packet folder renames first because the drift guards resolve paths from the script's own location and re-point automatically [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:22]; literal pins and generated artifacts follow; every step carries one verification command. Execution belongs to phases 002/003 (research non-goal: making edits here).

0. Baseline: `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0; save the live-reference list (`rg -l "sk-code-opencode|code-opencode" --glob '!specs/**' --glob '!**/changelog/**' --glob '!**/benchmark/**'`). Guard facts: four guards in sequence; warnings never fail; any FAIL exits non-zero [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:59] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:80].
1. Rename the folder: `git mv .skilled/skills/sk-code/sk-code-opencode .skilled/skills/sk-code/sk-code-skilled`. Verify: `test -f .skilled/skills/sk-code/sk-code-skilled/SKILL.md && echo ok`.
2. Hub surface: update the hub registry JSONs (modeIndex key), `hub-router.json`, `graph-metadata.json`, and the sk-code `SKILL.md` mode tables; refresh graph metadata via the graph refresh path (`refreshGraphMetadataForSpecFolder` / `writeGraphMetadataFile`) or the `migrate-generated-json.ts` CLI. Verify: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1a,1b,2,3,4`.
3. Bare-form alias family: routing classes `code-opencode-aliases` / `code-opencode-runtime` / `code-opencode-authoring` [SOURCE: .skilled/skills/sk-code/hub-router.json:38] [SOURCE: .skilled/skills/sk-code/hub-router.json:79] and the hub verifier's mapping constant [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:261]. Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`.
4. Packet verifiers, tests, fixtures and sibling-skill references: `verify-router-sync.cjs` (:232, :261), `router-replay-lib.cjs` (:495), `verify-doc-claims.cjs`, `scripts/tests/*` (:35, :102-161); `sk-code-quality/SKILL.md:69` load targets plus `typo-flags.test.sh:17`; `sk-code-review/SKILL.md:39`; `sk-code-webflow/README.md:94`. Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` + `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/`.
5. Doctor literal pins: `sk-code-setup-check.cjs:59`; `parent-skill-check.cjs` `SK_CODE_NATIVE_SURFACE` (:1159, :1163) plus invariants (:491) [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1163]. Verify: `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`.
6. Advisor rebuild (F1): `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true` [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md:26]. Verify: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a TypeScript feature"}' --format json` returns the renamed surface; `advisor_status` reports fresh with a new generation.
7. Compiled routes: `node .skilled/bin/compiled-route-sync.cjs`, then `node .skilled/bin/compiled-route-guard.cjs`; update `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` (:65, :72, :89, :112) [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:65]. Verify: guard exits 0 plus `compiled-route-status.cjs` fresh. CI: `routing-registry-drift.yml` covers checks 3/4 warn-only [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:73].
8. Runtime mirrors: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` (plus `sync-gate1-pointers.cjs`, `sync-hook-registrations.cjs` as needed). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0; `.hermes` re-synced against its 53-line baseline.
9. Trigger index (F2): `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`; decide old-phrase retention first (47 `sk code opencode ...` keys live in the index [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:111848]). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 0 [SOURCE: .skilled/commands/doctor/_routes.yaml:56]; `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "sk-code-skilled"` returns rows.
10. Live docs sweep to zero. Verify: `rg -l "sk-code-opencode|code-opencode" --glob '!specs/**' --glob '!**/changelog/**' --glob '!**/benchmark/**' --glob '!.hermes/**'` returns empty.
11. Exclusion audit: `.opencode/` symlink `.opencode/skills -> ../.skilled/skills` [SOURCE: .skilled/skills/system-spec-kit/shared/review-research-paths.cjs:70] and `cli-opencode` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:53] untouched. Verify: `git diff --stat` review plus unchanged `rg -n "\.opencode/|cli-opencode"` results versus baseline.
12. Final gate: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/012-sk-code-skilled-rename --strict` requires an explicit `RESULT: PASSED`; then the full guard run, advisor probe, mirror check, compiled-route guard and trigger `--check` together.

## Questions Answered
- Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing? — Answered by F4: a 13-step plan (baseline, folder rename, hub surface, alias classes, packet verifiers/tests/fixtures, doctor pins, advisor rebuild, compiled routes, mirrors, trigger index, live-doc sweep, exclusion audit, final gate), each step grounded in committed tooling from F1/F2 and iteration 4's rebuild inventory.
- Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded? — Answered by F3: ~92% of 11,282 line-references are history (specs 10,371; changelogs 51); recommendation is to exclude them from the sweep and not rewrite, accepting moved-path warnings on re-validation, while regenerating the retrieval fixtures.

## Questions Remaining
- None. All five key questions are resolved and both residuals carried into Q4 are closed (F1, F2). Minor caveat: step 7 cites the compiled-route toolchain by committed path; its flag forms were not re-read this run, so that step's check is the guard script's exit status.

## Next Focus
None — final iteration (5 of 5; stop_policy max-iterations). Hand-off: F4 (plan) with F1/F2 as its rebuild commands feeds the rename phases 002/003.

## Scope Violations
None — no out-of-scope mutation was attempted; all research reads were read-only.

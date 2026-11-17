# Iteration 5 - Cross-Cutting Close-Out

## Dimension

Cross-cutting close-out: adversarial replay of the active P1s, the doctor `project_owned` fallback, the host `.skilled/specs` alias edge cases, the trigger-index `--check` path, and a final check that every operator focus line was addressed.

## Focus

The two active P1s, the P2 advisories, and the review focus's remaining surfaces before synthesis.

**Operator review focus:** every line is now covered. Named sub-tracks (track-roots, refresh, sweep, `create.sh`, validate, parent derivation, repair-derived, archive.sh) were reviewed in iterations 1, 2 and 4; the doctor `project_owned` entry and host `.skilled` build in iterations 2, 3 and 4; the host trigger-index docs in iterations 3 and 4. Correctness and flat-track non-regression were iteration 1; path containment and symlink handling iteration 2; spec/doc alignment iteration 3. No `.env` file and no `barter/` path was read.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1171-1183`, `:1337-1344`, `:1648-1655` (P1 replay)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:128-158` (P1 replay)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:192-215` (P1 replay)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:193-213` (P1 replay)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:320-341` (P1 replay counterevidence)
- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:853-873` (P1 replay counterevidence)
- `.skilled/commands/doctor/scripts/symlink-engine.cjs:689-717`, `:787-845` (project-owned and host link)
- `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs:416-499` (project-owned and specs alias cases)
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:401-430`
- `.skilled/skills/system-spec-kit/runtime/data/README.md:34-56`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (manifest hash and document/section indexes)
- `specs/system-speckit/044-named-subtracks-and-host-repos/review/lineages/deepseek/deep-review-findings-registry.json`
- `specs/system-speckit/044-named-subtracks-and-host-repos/review/lineages/deepseek/deep-review-dashboard.md`
- `specs/system-speckit/044-named-subtracks-and-host-repos/review/lineages/deepseek/iterations/iteration-001.md` through `iteration-004.md`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None raised this iteration. The two P1s from iteration 2 were replayed against their counterevidence and confirmed active:
- `R2-P1-001` (`create.sh` follows a symlinked sub-track): `resolve_and_validate_create_target` runs only for `--path`/explicit targets (`create.sh:1641`); the normal `--track` branch at `:1651` writes `FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"` with no `-L` or resolved-path check. The comment that permits a symlinked **track** does not cover a two-segment sub-track that every reader skips. Confirmed at P1, confidence 0.86.
- `R2-P1-002` (linked `description.json` split): `validate.sh:199`, `archive.sh:204` and `orchestrator.ts:226-236` follow the link; `track-roots.mjs:143-145`, `repair-derived.cjs:325` and `graph-metadata-parser.ts:860-862` refuse it. The counterevidence is that the track-roots refusal exists for working-tree/commit parity, so the other tools could be "correct" for their own view. The split is still user-visible: validation/archive accept a container that refresh/sweep cannot see. Confirmed at P1, confidence 0.80, with the downgrade trigger recorded in iteration 2.

### P2 Findings

None new this iteration. The 14 P2 advisories carried from iterations 1-4 remain recorded in the registry. Two are explicitly deferred to follow-up work rather than fixed here: the container `parent_id` writer split (R3-P2-005) and the existing whole-link `.skilled` installs that the new merge build leaves alone (`implementation-summary.md:131`, documented as a known limitation).

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-001/002/003/007/008/009/010/011/012 are implemented and mapped; REQ-004/005/006 carry the recorded caveats (linked-description split, documented move limitation, test claims not executed here). |
| `checklist_evidence` | core | partial | AC-001 to AC-012 are written and evidenced in the packet; this review confirms the code paths the rows name, but did not execute the tests, so the numeric claims remain the packet's own evidence rather than this lineage's. AC-008's symlink policy is contradicted by the create write path (R2-P1-001) and by the linked-description split (R2-P1-002). |
| `skill_agent` | overlay | notApplicable | No skill or agent definition is changed. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror is changed. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry is changed. |
| `playbook_capability` | overlay | notApplicable | No playbook capability is changed. |

## Edge Cases

- The doctor `.env.example` fallback is a link to the checkout when the host has no file; the test asserts it, and the manifest marks the entry `project_owned`. The fallback is consistent with the test but is not described in the operator-facing docs.
- An existing whole-link `.skilled` install is reported as linked and left alone; the new per-child merge build applies only when the host has no `.skilled/` entry. This is the documented limitation at `implementation-summary.md:131`; a host that upgrades does not get the `specs` alias fix automatically.
- The host trigger-index docs name the explicit `--index`; the lookup still defaults to the packaged index without it, as the docs say. The `--check` command compares the index at `--out`; the docs and the generator usage agree.
- The packet's `runtime/data/trigger-index.json` `manifestHash` is an internal corpus hash; the package does not ship a separate `corpus-manifest.json`, so this review could not independently verify freshness without running the generator.

## Confirmed-Clean Surfaces

- The two P1s are the only active blockers; the registry shows `P0=0, P1=2, P2=14` after the R1-P1-001 downgrade.
- The doctor `project_owned` path preserves a real host file byte-for-byte, reports `project-owned`, and is skipped by link and unlink; the host `specs` alias is created only when the host folder exists.
- The trigger-index docs, the lookup `--index` flag, and the generator `--check` flag agree on the command shape and the default-index behavior.
- The four review dimensions are covered (`dimensionCoverage` all true), each iteration states how it addressed the operator focus, and no `.env` or `barter/` file was opened.
- The changed code comments contain no packet/task ids; the packet's comment-hygiene row is supported.

## Ruled Out

- "`R2-P1-001` is only a symlinked-track behavior": ruled out; the two-segment sub-track is the new form, and the readers skip it while the writer follows it.
- "`R2-P1-002` is harmless because the validator and the reader are allowed to disagree": ruled out by the user-visible split (validation/archive accept a container that refresh/sweep cannot see) and by the spec's declaration-is-the-container rule.
- "The doctor fallback overwrites a host's `.env.example`": ruled out by the `project_owned` branch and the byte-preservation test.
- "The host index docs point at a file the lookup does not read": ruled out by the `--index` parser and the `DEFAULT_INDEX_PATH` fallback.
- "The p2 completion-percentage mismatch blocks release": ruled out; it is a documentation/metadata advisory, not a P1.

## Next Focus

Dimension: synthesis. Focus area: compile the nine-section review report from the registry, carry the two active P1s into the Planning Packet, record the terminal synthesis event with `stopReason: maxIterationsReached`, and mark the config complete. Reason: the loop reached `maxIterations = 5` with every dimension and the operator focus covered; no P0 exists, two P1s remain active. Rotation status: all dimensions complete. Required evidence: the registry counts, the five iteration files, the two P1 cases, and the synthesis-closeout invariant check. Recovery note: none.

## Verdict

Conditional: no P0; two security P1s remain active (R2-P1-001, R2-P1-002), and 14 P2 advisories are recorded. The review reached the `maxIterations` ceiling, so synthesis proceeds with a CONDITIONAL verdict.

Review verdict: CONDITIONAL

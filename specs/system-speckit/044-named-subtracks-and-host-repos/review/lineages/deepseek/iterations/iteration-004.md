# Iteration 4 - Maintainability

## Dimension

Maintainability: single-source-of-truth for the sub-track declaration, the two view return shapes, failure visibility in `create.sh`, and the duplicated host-index documentation.

## Focus

The six independent copies of the declaration predicate, the `tracks.diagnostics` side-channel, and the host-index doc duplication, plus the operator focus's remaining maintainability surface in the doctor and trigger-index changes.

**Operator review focus:** this iteration covers the sub-track predicate and doc-duplication cost of the packet implementation, including the doctor `project_owned` engine's second declaration-like rule and the host trigger-index docs. No `.env` file and no `barter/` path was read.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:76-78`, `:128-164`, `:214-273`, `:297-321`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:183-232`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:219-246`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:193-213`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:315-341`
- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:847-900`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1026-1057`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/sweep-track-roots.mjs:65-126`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:401-430`
- `.skilled/skills/system-spec-kit/runtime/data/README.md:34-56`
- `.skilled/commands/speckit/search.md:78-110`
- `.skilled/commands/doctor/scripts/symlink-engine.cjs:668-717`, `:787-845`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None raised this iteration. The two security P1s from iteration 2 remain active.

### P2 Findings

1. **The declaration rule exists in six copies that already disagree** -- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:76-78` -- the copies are `track-roots.mjs:76-78` (plus the linked-description refusal at `:143-145` and the symlink skip at `:133-136`), `validate.sh:192-215`, `orchestrator.ts:226-245`, `archive.sh:193-213`, `repair-derived.cjs:315-341`, and `graph-metadata-parser.ts:853-873`. `create.sh:1026-1038` delegates to `track-roots`, but the other five are independent. The divergence is not theoretical: three copies follow a linked `description.json` (`validate.sh:199`, `archive.sh:204`, `orchestrator.ts:226-236`) while three refuse it (`track-roots.mjs:143-145`, `repair-derived.cjs:325`, `graph-metadata-parser.ts:860-862`), and `archive.sh:201` rejects a `z_` track while `validate.sh:196` and `orchestrator.ts:242` do not.
   - Finding class: `duplicate_rule`
   - Scope proof: every copy reads the same `description.json` field and answers "is this folder a sub-track"; a single exported predicate could be called from all of them (the shell tools already invoke Node elsewhere).
   - Affected surface hints: `track-roots.mjs`, `validate.sh`, `orchestrator.ts`, `archive.sh`, `repair-derived.cjs`, `graph-metadata-parser.ts`, `create.sh`.
   - Case: change the declaration word or the linked-description policy and six files must change together; iteration 2 already found one split that this structure allowed.
2. **`readWorkingTreeTracks` returns an array with an attached `diagnostics` property while `readCommitTracks` returns an object** -- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:163` -- `tracks.diagnostics = diagnostics.sort(...)` stores the diagnostics outside the array elements; `sweep-track-roots.mjs:81` reads the property, and `readCommitTracks` returns `{tracks, skipped, diagnostics}` (`:272`). A caller that spreads, slices, or JSON-serializes the working-tree result loses the diagnostics silently, and the two view APIs do not share a return type.
   - Finding class: `api_shape_asymmetry`
   - Scope proof: the same module exposes two view functions; one return shape is an array with a hidden property, the other an object.
   - Affected surface hints: `readWorkingTreeTracks` callers (`refresh-track-roots.mjs:78`, `sweep-track-roots.mjs:80`, `create.sh:1035`), tests using `summarizeTracks` and `diagnosticsFromTracks`.
   - Case: `const copied = [...readWorkingTreeTracks(specs)]` yields an array whose `.diagnostics` is undefined; a future caller reading that copy sees no diagnostics.
3. **`create.sh`'s declaration probe swallows every reader failure** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1031` -- `is_declared_subtrack` runs the reader with `>/dev/null 2>&1` and returns 1 on any failure, so a missing `track-roots.mjs`, a syntax error, or an unreadable specs tree is indistinguishable from "this folder is not declared". The writer path has an explicit `report_missing_generator` warning for the refresh script (`:1047-1051`), but the reader has no equivalent.
   - Finding class: `failure_visibility`
   - Scope proof: `create.sh` accepts the reader path and checks only `-f` before running it; every other failure is suppressed.
   - Affected surface hints: `create.sh` `is_declared_subtrack`, `refresh_track_root`, operator stderr.
   - Case: rename `track-roots.mjs`; `create.sh --track demo/sub` still exits 0, creates the packet, and prints no refresh warning because the probe silently returns 1.
4. **The host-index instructions are duplicated in three files** -- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:401-430` -- the same generate/check/lookup block also appears in `runtime/data/README.md:37-56` and `search.md:81-84`. The copies already differ in emphasis, and the `folder-structure.md` example's `children_ids` is wrong in the same section family (R3-P2-002). A host reader has no single canonical command block, and a future flag rename must be applied in three places.
   - Finding class: `duplicated_documentation`
   - Scope proof: the three files name the same generator and lookup invocations for the same host-index mode.
   - Affected surface hints: `folder-structure.md` section 7, `runtime/data/README.md`, `search.md`, the two retrieval CLIs.
   - Case: change the host index location or a flag in one doc; the other two keep the old command and a host follows a stale instruction.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-001 to REQ-012 remain as mapped in iteration 3; this iteration adds no new requirement gap beyond the predicate duplication that produced R2-P1-002. |
| `checklist_evidence` | core | partial | The tasks' comment-hygiene rows are supported by a grep of the changed code files for `REQ-`/`AC-`/`CHK-`/`T0xx`/`ADR-` ids: no hits. |
| `skill_agent` | overlay | notApplicable | No skill or agent definition is changed. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror is changed. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry is changed. |
| `playbook_capability` | overlay | notApplicable | No playbook capability is changed. |

## Edge Cases

- The `create.sh` probe's stderr suppression is deliberate for the "not declared" case (an unreadable `description.json` should mean "not declared", not a hard failure), but it also hides infrastructure failures. The finding asks for a warning, not a hard stop.
- The `tracks.diagnostics` property survives `.sort()` and `filter()` in place but not a spread; the current callers happen to use it in place, so the defect is latent.
- The doctor has a second declaration-like rule (`project_owned`, `isHostRelativeLink`) but it keys on manifest fields, not on `description.json`; it does not belong in the sub-track predicate and is not counted as a seventh copy.
- `validate.sh` and `orchestrator.ts` use different packet-name regexes (`^[0-9]{3}-[a-z0-9-]+$` versus `PACKET_FOLDER_RE` with the same shape); the difference is the `u` flag and case handling, and no current fixture distinguishes them.

## Confirmed-Clean Surfaces

- The changed code comments contain no `REQ-`, `AC-`, `CHK-`, `T0xx` or `ADR-` ids; the comment-hygiene check in `tasks.md` is supported.
- `refresh-track-roots.mjs` and `sweep-track-roots.mjs` share `track-roots.mjs` for the actual comparison, so the writer and the sweep cannot disagree on `children_ids` ordering or identity.
- The doctor engine's `project_owned` and host-relative link rules are localized to one file (`symlink-engine.cjs`) with no duplicated implementation in the manifest.
- The host-index CLI flags are the same in all three docs; the duplication is a drift risk, not a current contradiction.

## Ruled Out

- "The six predicate copies produce the same answer today for a normal folder": they agree on the plain `level` case; the divergence requires a linked description or a `z_` track. The finding is the drift risk plus the two live splits.
- "`tracks.diagnostics` is lost by the sweep": ruled out; the sweep reads the property directly.
- "The `create.sh` probe failure is reported elsewhere": ruled out; `refresh_track_root` returns 0 before any `report_missing_generator` call when the reader fails.
- "The host-index duplication is a current contradiction": ruled out; the three command blocks name the same flags, so this is a maintainability advisory.

## Next Focus

Dimension: cross-cutting close-out. Focus area: adversarial replay of the two active P1s and the P2 advisories, the doctor `project_owned` fallback and the host `.skilled/specs` alias edge cases, the trigger-index `--check` path, and a final review-focus completeness check before synthesis. Reason: the four dimensions are covered; iteration 5 must recheck the blockers, confirm or downgrade them, and prove every focus line was addressed. Rotation status: correctness, security, traceability and maintainability complete; close-out next. Required evidence: the P1 cases, `symlink-engine.cjs` `project_owned`/`isHostRelativeLink` branches, the trigger-index docs, and the iteration files' focus statements. Recovery note: none.

## Verdict

Conditional: the two security P1s from iteration 2 remain active; this iteration adds four P2 maintainability advisories. No P0 was found.

Review verdict: CONDITIONAL

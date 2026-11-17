# Iteration 2 - Security

## Dimension

Security: path containment, symlink handling, and trust boundaries introduced by the sub-track packet home, the `create.sh --track` write path, and the doctor host-mirroring rule.

## Focus

Path containment and symlink handling across the sub-track write and read surfaces, plus the doctor `project_owned` mirroring path.

**Operator review focus:** this iteration covers the path-containment and symlink half of the focus: `create.sh --track <track>/<sub-track>`, `archive.sh` sub-track homes, and the doctor `.skilled` host build. The doctor `project_owned` entry itself is checked in iteration 3 and the host trigger-index docs in iteration 4. No `.env` file and no `barter/` path was read.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1026-1057` (`is_declared_subtrack`, `refresh_track_root`)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1171-1183` (`validate_track_value`)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1337-1344` and `:1648-1655` (`SPECS_DIR`, `FEATURE_DIR` creation)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:128-158` (symlink and linked-description refusal)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:183-232` (`has_subtrack_declaration`, `is_declared_subtrack_folder`)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:113-213` (`reject_linked_argument`, `is_declared_subtrack`)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:219-246` (`isTrackRoot`, `hasSubTrackLevel`, `isDeclaredSubTrack`)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:315-341` (`declaresSubtrack`)
- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:847-897` (`isDeclaredSubtrackFolder`, `resolveParentId`)
- `.skilled/commands/doctor/scripts/symlink-engine.cjs:197-200`, `:481-488`, `:543-575`, `:805-823`
- `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` (setup specs-alias cases)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-containment.vitest.ts` (refused `--track` cases)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **`create.sh --track <track>/<sub-track>` writes through a symlinked sub-track that every reader skips** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1340` -- `validate_track_value` refuses `.`, `..`, empty segments and absolute paths but never checks `-L`; `SPECS_DIR` is then built by appending the two-segment track (`:1342`) and created with `mkdir -p` (`:1344`), and the packet is scaffolded under `FEATURE_DIR` (`:1651-1655`). The refresh path later asks `readWorkingTreeTracks`, which explicitly skips a symlinked sub-track (`track-roots.mjs:133-136`), so `refresh_track_root` returns 0 without a warning (`create.sh:1051`). The packet lands in the link target, outside the specs tree the track tools read, and the new folder is invisible to refresh and sweep.
   - Finding class: `path_containment`
   - Scope proof: `--track` is user input accepted by `validate_track_value`; the two-segment form is the new sub-track form this packet introduces. `archive.sh` refuses the same path shape through `reject_linked_argument` (`archive.sh:118-145`), so the containment policy is not shared.
   - Affected surface hints: `create.sh` `SPECS_DIR`/`FEATURE_DIR`, `track-roots.mjs` symlink skip, `sweep-track-roots.mjs` diagnostics, `archive.sh` link refusal.
   - Case: `ln -s ../../outside specs/demo/linked` (with a declaring `description.json` in the target) then `create.sh --track demo/linked --short-name probe 'Probe'` creates `outside/001-probe/...`, exits 0, and leaves `demo`'s `children_ids` unchanged.
   - Claim adjudication:

```json
{"type":"finding","claim":"create.sh follows a symlinked sub-track and scaffolds a packet through it even though track-roots treats that folder as skipped and never refreshes it.","evidenceRefs":["specs/system-speckit/044-named-subtracks-and-host-repos/review/lineages/deepseek/iterations/iteration-002.md","create.sh:1174-1183","create.sh:1340-1344","create.sh:1651-1655","track-roots.mjs:133-136","archive.sh:118-145"],"counterevidenceSought":"Checked whether resolve_and_validate_spec_path or resolve_and_validate_create_target runs on the normal --track path; they run only for subfolder mode and --path/explicit targets, not for the --track branch at create.sh:1651.","alternativeExplanation":"The comment at validate_track_value:1171-1173 deliberately allows an existing track symlink; the sub-track case may be intended to follow the same policy even though readers skip it.","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"Downgrade to P2 if a symlinked sub-track is documented as a deliberate write target, or if a later iteration shows a guard on the resolved SPECS_DIR before mkdir."}
```

2. **A linked `description.json` declares a sub-track in validation and archive but not in track-roots or the repair path** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:199` -- `has_subtrack_declaration` reads `$folder/description.json` with no `-L` check, and `archive.sh:204` plus `orchestrator.ts:226-236` do the same. `track-roots.mjs:143-145` refuses a linked description, and `repair-derived.cjs:325-331` / `graph-metadata-parser.ts:855-864` also refuse it. The result is one tree classified two ways: `validate.sh specs/demo/sub --strict` prints `RESULT: PASSED` and `archive.sh` treats the folder as a packet home, while `refresh-track-roots.mjs` and `sweep-track-roots.mjs` skip it and the track's `children_ids` drops it.
   - Finding class: `declaration_consistency`
   - Scope proof: all five implementations read the same declaration field from the same folder; the disagreement is reachable by replacing a real `description.json` with a symlink to another file.
   - Affected surface hints: `validate.sh` recursion and exemption, `archive.sh` packet home and `--list`, `orchestrator.ts` exemption, `track-roots.mjs` both views, `repair-derived.cjs` parent repair.
   - Case: replace `specs/demo/sub/description.json` with a symlink to a file containing `{"level":"sub-track"}`; `validate.sh specs/demo/sub --strict` passes, `archive.sh` accepts a packet there, and `sweep-track-roots.mjs` reports `demo/sub: undeclared folder ignored` because `readWorkingTreeTracks` refused the linked declaration.
   - Claim adjudication:

```json
{"type":"finding","claim":"The tools disagree on whether a symlinked description.json declares a sub-track, producing an exempted validator/archiver container that the track readers do not see.","evidenceRefs":["specs/system-speckit/044-named-subtracks-and-host-repos/review/lineages/deepseek/iterations/iteration-002.md","validate.sh:199-207","archive.sh:197-212","orchestrator.ts:226-245","track-roots.mjs:143-145","repair-derived.cjs:325-331","graph-metadata-parser.ts:855-864"],"counterevidenceSought":"Checked whether the spec or docs restrict description.json to a regular file; the docs require the field but do not name a link policy, and the track-roots comment says a link is refused so both views agree.","alternativeExplanation":"Refusing the link may be a track-roots-only choice for commit parity; the other tools may intentionally read through links.","finalSeverity":"P1","confidence":0.84,"downgradeTrigger":"Downgrade to P2 if the linked-description refusal is declared a track-roots-only implementation detail and the other tools are documented to follow the link."}
```

### P2 Findings

1. **A three-segment `--track` value scaffolds a packet at a depth no reader scans** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1174` -- `validate_track_value` does not limit the number of segments; `refresh_track_root` refuses the refresh with `[[ "$sub" != */* ]] || return 0` (`:1050`), but the packet is still created under the third segment. The spec says one named level only; the tool should refuse or name the unsupported depth instead of leaving an invisible packet.
   - Finding class: `input_validation`
   - Scope proof: `--track` is caller input; the three-segment value passes every refusal in `validate_track_value`.
   - Affected surface hints: `create.sh` `validate_track_value` and `refresh_track_root`, track readers, validation recursion.
   - Case: `create.sh --track demo/sub/deeper --short-name probe 'Probe'` exits 0 and creates `specs/demo/sub/deeper/001-probe`, which `readWorkingTreeTracks` never lists and `validate.sh --recursive` never reaches.
2. **The doctor host-relative alias check is lexical; a host symlink inside the root can make the mirrored alias resolve outside it** -- `.skilled/commands/doctor/scripts/symlink-engine.cjs:818` -- `isWithin(hostTarget, root)` uses `path.relative` on the lexical path (`:197-200`), while `linkTargetExists` realpaths only to test existence (`:481-484`). A host path that is itself a symlink out of the root passes both checks, and the doctor recreates the source's relative link, whose resolution leaves the host root.
   - Finding class: `containment_hardening`
   - Scope proof: the function's stated purpose is to keep a host-sibling alias inside the host; the target check is the only gate before `op:link`.
   - Affected surface hints: `inspectMergeTree` and `planMergeTree` host-relative link branches.
   - Case: host has `specs -> /srv/specs` (a symlink) and the source `.skilled/specs -> ../specs`; the plan mirrors `.skilled/specs -> ../specs`, which resolves to `/srv/specs`, outside the host root. The alias is still the host's own path, so the impact is reduced.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-008's symlink policy is implemented for the readers; the write path in `create.sh` and the linked-description split in iteration 2 are not covered. |
| `checklist_evidence` | core | partial | AC-008 covers the sweep diagnostics; AC-004's validation case does not test a symlinked or linked-description container, and no acceptance row covers `create.sh` into a symlinked sub-track. |
| `skill_agent` | overlay | notApplicable | No skill or agent definition is changed. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror is changed. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry is changed. |
| `playbook_capability` | overlay | notApplicable | No playbook capability is changed. |

## Edge Cases

- A symlinked **track** (one segment) is deliberately followed by `create.sh` per the comment at `validate_track_value:1171-1173`; the finding is scoped to the new two-segment sub-track form, where every reader has an explicit skip.
- `archive.sh` refuses a symlinked path component before it classifies a packet home (`reject_linked_argument:118-145`), so the create write path is the outlier rather than a general archive hole.
- The doctor `project_owned` file itself is a regular-file rule (`rootStat.isFile()`); a symlinked `.env.example` falls through to the link branches and is not covered by the project-owned test.
- The branch-name and packet-number scans inside `create.sh` are not changed by this commit range.

## Confirmed-Clean Surfaces

- `archive.sh` refuses a symlinked packet path, and its `is_packet_home` sequence admits a sub-track only at the first non-numbered segment, as the archive tests assert.
- `create.sh` refuses `..`, `.`, absolute paths and empty segments in `--track`, and the added `create-track-containment` case covers `demo//sub`.
- The doctor `isHostRelativeLink` branch only mirrors a link when the host target exists and is lexically inside the root; the simple host-sibling case (`.skilled/specs -> ../specs`) is tested both with and without a host `specs/`.
- The doctor `project_owned` branch preserves bytes and refuses to plan a link or removal over a real host file (test case in `symlink-engine.test.cjs`).

## Ruled Out

- "Archive writes through a symlinked sub-track": ruled out by `reject_linked_argument`; the path is refused before `is_packet_home`.
- "A symlinked sub-track is followed by the track readers": ruled out by `entry.isSymbolicLink()` and `mode === '120000'` in both views.
- "The doctor mirrors a host-relative link when the host target is absent": ruled out by `linkTargetExists`; the setup test asserts the alias is omitted.
- "`create.sh` follows a symlinked single-segment track": deliberate per `validate_track_value` and not counted as a new finding.

## Next Focus

Dimension: traceability. Focus area: spec-to-code alignment for REQ-001 through REQ-012, the declaration contract in `folder-structure.md` versus the readers, the sub-track container's `parent_id` contract versus `graph-metadata-parser`, and the doctor `project_owned` entry's documented fallback. Reason: the security pass found two write/read splits; the traceability pass must check whether the docs and acceptance criteria name the same contract the code enforces. Rotation status: correctness and security complete, traceability next. Required evidence: `spec.md` REQ table, `acceptance-criteria.md`, `folder-structure.md`, `runtime/data/README.md`, `symlink-manifest.json`, `graph-metadata-parser.resolveParentId`. Recovery note: none.

## Verdict

Conditional: two P1 findings (the create.sh symlink write and the linked-description split) remain active; no P0 was found. The advisory P2s do not change the verdict.

Review verdict: CONDITIONAL

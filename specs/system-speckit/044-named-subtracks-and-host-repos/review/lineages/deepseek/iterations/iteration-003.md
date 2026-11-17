# Iteration 3 - Traceability

## Dimension

Traceability: spec-to-code alignment, acceptance-criteria evidence, the declaration contract in the docs versus the readers, the sub-track container `parent_id` contract, and the host trigger-index documentation.

## Focus

REQ-001 through REQ-012 against the changed code and the four documentation files, plus the operator-facing docs for the doctor `project_owned` entry and the host trigger index.

**Operator review focus:** this iteration covers the doctor `project_owned` entry and the host trigger-index docs, the remaining half of the focus that iterations 1-2 deferred. The named sub-track docs, the packet's acceptance criteria, and the implementation summary were checked against the code. No `.env` file and no `barter/` path was read.

## Files Reviewed

- `specs/system-speckit/044-named-subtracks-and-host-repos/spec.md:91-162` (REQ-001 to REQ-012, NFRs, edge cases)
- `specs/system-speckit/044-named-subtracks-and-host-repos/acceptance-criteria.md` (AC-001 to AC-012, closure statement)
- `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md:1-132` (completion metadata, decisions, limitations)
- `specs/system-speckit/044-named-subtracks-and-host-repos/tasks.md:130-152` (checked tasks and comment-hygiene rows)
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:96-124` and `:380-430`
- `.skilled/skills/system-spec-kit/README.md:236-244`
- `.skilled/commands/speckit/search.md:78-110`
- `.skilled/skills/system-spec-kit/runtime/data/README.md:34-56`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (decision-record document/section indexes)
- `.skilled/commands/doctor/assets/symlink-manifest.json:1-26`
- `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:847-961`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:359-391`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:76-78`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/fixtures/subtrack-tree.mjs:31-48`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None raised this iteration.

**Finding update:** R1-P1-001 is downgraded to P2 after reading the packet's recorded decision. `implementation-summary.md:103` explicitly says `repair-derived` writes a parent only where a sub-track or an archive is involved, and that a flat packet's stored parent awaits a person; AC-005 scopes the move cases to "into or between sub-tracks". The move-to-root and move-to-another-track destinations are therefore a documented limitation, not an incomplete P1. The claim-adjudication event for iteration 3 records `finalSeverity: P2` for `R1-P1-001`. The two P1s from iteration 2 remain active.

### P2 Findings

1. **The declaration table requires a `specId` no reader enforces** -- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:115` -- the table says a sub-track's `description.json` carries `specFolder` and `specId` set to `<track>/<sub-track>`. Every reader accepts only `level: "sub-track"` (`track-roots.mjs:76-78`), and the shared fixture writes `level` and `specFolder` only (`subtrack-tree.mjs:45`). `specId` is the numeric prefix elsewhere in the kit, so the documented value is also semantically different from the rest of the contract.
   - Finding class: `doc_contract_mismatch`
   - Scope proof: the docs table is the normative declaration contract a reader follows; no code path validates it.
   - Affected surface hints: `folder-structure.md`, `track-roots.mjs`, `validate.sh`, `orchestrator.ts`, `subtrack-tree.mjs`.
   - Case: a sub-track follows the doc and sets `specId: "demo/sub"`; `folder-discovery` reads it as a spec id while the track tools ignore it, and a kit that expects the numeric `specId` sees a non-numeric value.
2. **The track/sub-track example writes `children_ids` without the parent prefix** -- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:385` -- the example comment says `children_ids: 001-invoices, invoicing`, but every writer and test uses full ids (`billing/001-invoices`, `billing/invoicing`; `subtrack-tree.mjs:72` and the expected arrays in `track-roots.vitest.ts`). A reader who copies the example produces a foreign-identity list that the sweep reports and the refresh rewrites.
   - Finding class: `doc_example_wrong`
   - Scope proof: `expectedChildrenIds` in `track-roots.mjs:318-321` prepends the identity; the parser's `compareTrackChildren` treats a bare entry as foreign (`:299-302`).
   - Affected surface hints: `folder-structure.md` example, refresh, sweep, `create.sh` readers.
   - Case: copy the example's `children_ids` into a track's metadata; `sweep-track-roots.mjs` prints a foreign-identity line and `refresh --apply` rewrites the list.
3. **The implementation summary says a deeper layout is reported, but no reader scans a folder inside a sub-track** -- `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md:129` -- the known limitation says "A deeper layout is reported as an undeclared folder". `readWorkingTreeTracks` scans only direct children of a track (`track-roots.mjs:128-130`), and the sweep iterates only the tracks it returns (`sweep-track-roots.mjs:96`); a folder `specs/demo/sub/deeper` is inside the sub-track, is never a candidate, and is silently invisible. `create.sh --track demo/sub/deeper` can still create a packet there (R2-P2-001).
   - Finding class: `doc_behavior_mismatch`
   - Scope proof: the statement is in the packet's own Known Limitations, so it is the contract a reader relies on.
   - Affected surface hints: `readWorkingTreeTracks`, `sweep-track-roots.mjs`, `create.sh`, recursion.
   - Case: `mkdir specs/demo/sub/deeper`; the sweep prints no diagnostic and `validate.sh --recursive` never visits it.
4. **The packet's completion percentage contradicts its complete status** -- `specs/system-speckit/044-named-subtracks-and-host-repos/implementation-summary.md:26` -- `implementation-summary.md` records `completion_pct: 90` while its `recent_action` says all 19 tasks are implemented and acceptance is all Met, `spec.md:25` says `Status: Complete`, and `acceptance-criteria.md`'s closure says `Closeable: Yes`. The same packet cannot be complete and 90 percent at once; the completion metadata is the one a save or a status reader trusts.
   - Finding class: `completion_metadata_inconsistent`
   - Scope proof: the three fields are in the same packet and name the same transaction.
   - Affected surface hints: `implementation-summary.md` continuity, `spec.md` status, acceptance closure.
   - Case: a save or a status reader reports 90 percent for a packet that the acceptance criteria close.
5. **The sub-track container's `parent_id` contract has two writers with different answers** -- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:116` -- the declaration table says the sub-track's `graph-metadata.json` has `parent_id` equal to the track, and `repair-derived.cjs:374-375` writes that value. `graph-metadata-parser.ts:887-897` (`resolveParentId`) returns null for the container itself because it only accepts a declared parent at `segments.length === 3`; a `refreshGraphMetadata` on a container would re-derive null, and `mergeGraphMetadata` (`:1789-1793`) keeps the stored track and sets `parent_id_review_required`, which the repair then clears again.
   - Finding class: `writer_contract_mismatch`
   - Scope proof: both writers target the same `parent_id` field of the same folder, and the docs name the value.
   - Affected surface hints: `graph-metadata-parser.ts`, `repair-derived.cjs`, `graph-metadata-schema.ts`, the save/refresh path.
   - Case: call `refreshGraphMetadata` on `specs/demo/sub` (a declared container); the derived metadata has `parent_id: null`, while the repair path and the doc say `demo`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | REQ-001, REQ-002, REQ-003, REQ-007 and REQ-008 map to implemented code; REQ-009 and REQ-010 map to the doctor engine and tests; REQ-011 and REQ-012 map to the four docs. REQ-004/005/006 still carry the iteration-1/2 caveats. |
| `checklist_evidence` | core | partial | AC-009 to AC-012 are met by the cited tests and `rg` checks; AC-005's scope does not include the move-to-root case; this review did not execute the tests, so the "178/178" and "50/50" claims are UNKNOWN evidence, not verified here. |
| `skill_agent` | overlay | notApplicable | No skill or agent definition is changed. |
| `agent_cross_runtime` | overlay | notApplicable | No runtime mirror is changed. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog entry is changed. |
| `playbook_capability` | overlay | notApplicable | No playbook capability is changed. |

## Edge Cases

- The `runtime/data/trigger-index.json` diff adds the decision-record document and re-points the phrase postings to the new document id; the doc phrases I checked resolve to the new index rows, so the index and the docs agree at the phrase level. A full `--check` freshness run was not executed by this review.
- The host index docs name `--repo-root`, `--out`, `--check` and `--index`; all four flags exist in the target CLIs (`generate-trigger-index.mjs` usage and `lookup-trigger-index.mjs:18-26`).
- The doctor manifest's `.env.example` entry has no `source` field; `sourcePathFor` defaults to the entry name, and the checkout's `.env.example` exists at the target commit. The entry is a regular-file rule; a symlinked host `.env.example` falls through to the link branches.
- The packet moved to `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos` after the reviewed range; the implementation-summary `packet_pointer` and `spec.md` path reflect the old layout at the target commit and are correct for the reviewed snapshot.

## Confirmed-Clean Surfaces

- The sub-track level appears in all three named docs: `search.md` search roots, `README.md` track paragraph, and `folder-structure.md` section 2 plus the track-with-sub-tracks example.
- The host trigger-index instructions match the target CLI flags and the default-index behavior; the packaged index stays the default without `--index`.
- The doctor `project_owned` behavior matches REQ-009 and AC-009: a real host `.env.example` is byte-preserved, reported as `project-owned`, and skipped by link/unlink; a missing destination keeps the source-link fallback.
- The `.skilled/specs` setup behavior matches REQ-010: no host `specs/` omits the alias; a host `specs/` gets the relative alias and the real host folder remains.
- `tasks.md` has all rows checked and the comment-hygiene rows claim no packet or task ids in code comments; the changed code comments I read contain durable reasons only.

## Ruled Out

- "The host index command names a flag the CLI does not accept": ruled out by the target CLI usage and argument parsers.
- "The docs omit the sub-track level from one of the three named files": ruled out by the diff and the files' headings.
- "The `project_owned` entry is undocumented": the manifest is the config surface and the spec's REQ-009 names it; no separate user doc is claimed.
- "`completion_pct: 90` is a template placeholder": ruled out by the surrounding continuity fields (`recent_action`, `next_safe_action`) carrying real values; this is a written completion state.

## Next Focus

Dimension: maintainability. Focus area: the six independent declaration predicates and their divergences (archive `z_` track rule, linked-description policy, packet-name regex), the `tracks.diagnostics` array side-channel, the duplicated host-index instructions across three docs, and the `graph-metadata-parser`/`repair-derived` parent split. Reason: the traceability pass found contract mismatches; the maintainability pass must decide which are single-source-of-truth risks versus documentation-only fixes. Rotation status: correctness, security and traceability complete; maintainability next. Required evidence: all predicate copies, `track-roots.mjs` return shape, the three host-index doc copies, the parser/repair parent functions. Recovery note: none.

## Verdict

Conditional: the two security P1s from iteration 2 remain active; this iteration raises five P2 advisories and downgrades R1-P1-001 to P2 on the packet's own documented decision. No P0 was found.

Review verdict: CONDITIONAL

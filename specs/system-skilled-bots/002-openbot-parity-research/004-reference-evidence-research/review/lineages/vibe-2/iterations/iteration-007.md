# Review Iteration 007

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: traceability. Focus: citation integrity -- every `[SOURCE:]` tag, the path prefixes, and section 9's own account of what was hand-checked.
- Iteration 7 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md` (all 616 source tags, resolved by script)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md` (all 331 source tags, resolved by script)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:5-30` (section 1, the prefix table), `:529-620` (section 7), `:645-664` (section 9)
- `specs/system-skilled-bots/context/openhuman-full/vendor/` (21 workspace manifests, their `license` lines)
- `specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/src/lib.rs` (absent) and `crates/tinyskills/src/lib.rs` (present)
- `specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui` and `openhuman-main/crates/openhuman-tui` (file and line counts)
- `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:109-113`, `:219-223`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `research.md` (616 tags), `regrade-log.md` (331 tags), `research.md:5-30`, `:529-620`, `:645-664`; `C/openhuman-full/vendor/*/Cargo.toml`; `C/openhuman-full/crates/openhuman-tui`; `S3/research.md:111`, `:221` | Every source tag in both files resolves to an existing path with a line or range inside the file, and every count section 9 states recomputes. No defect found. |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is Level 1 with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- **All 947 tags resolve.** A script expanded every `[SOURCE: ...]` tag in both files through the six prefixes in section 1 (`C/`, `B/`, `L/`, `S1/`, `S2/`, `S3/`), opened each path and checked that the line or range falls inside the file. `research.md` holds 616 tags and `regrade-log.md` holds 331; all 947 resolve, with no missing path, no range past the end of a file and no tag without a line. Section 9's claim that "616 tags in `research/research.md` and 331 in `research/regrade-log.md`, all of which resolve" is exactly true.
- **Section 9's licence count is exact.** `openhuman-full/vendor/` holds 21 folders. Twenty of their workspace manifests carry a `license` line: 18 say `GPL-3.0-only` and 2 say `GPL-3.0-or-later` (`tinyflows` and `tinyhumans-sdk`). `tinyvoice` has no such line, which is what section 9 says.
- **Section 9's `openhuman-tui` counts are exact.** Both checkouts hold 55 files and 9,601 `.rs` lines, of which 9,526 are under `src/`. The two copies are identical, as section 4 and section 9 both say.
- **Section 9's wrong-path example is real.** `openhuman-full/vendor/tinyskills/src/lib.rs` does not exist and `openhuman-full/vendor/tinyskills/crates/tinyskills/src/lib.rs` does, which is the shape of the 30 failures section 9 describes.
- **Section 9's twenty hand-checked citations are twenty.** The list names `routine-firing.ts:9-13` and `:21-34`, `routines.md:19-20`, `terminal.rs:34-47`, `openhuman-tui/README.md:55-56`, `pool.rs:2284-2289`, `standing-rule.ts:21-29`, `secrets-guard.ts:1` and `:17-30`, `patterns.rs:248-249`, `leak-checks.md:73`, `backends.md:41`, `queue.rs:260-266`, `blocks.rs:7-11`, `LICENSE:1-2`, `host_tool.rs:1-7` and `:95-98`, `prompt-sections.md:90`, `skills.js:81-96` and `spec.md:152`, which is twenty entries.
- **Section 7's quotes are accurate.** `S3/research.md:111` reads "Reference code to study first: none in `C/`. The in-tree shapes are `L/dispatch.ts:301-332` and `L/runner.ts:1033-1038`, which 004 names itself", which is what section 7 quotes before calling it wrong. `S3/research.md:221` reads "Reference to study first: no context repository applies", which is the 012 claim section 7 says holds. The 004 lift row 1 is buzz's `workspace_section(cwd)` at `pool.rs:2251-2258` and `:2284-2289`, so section 7's "buzz's `workspace_section` is a prompt-level counterpart" names the right row.
- **Section 7's duplicate count is right.** It says the regrade log holds 32 more findings dropped as duplicates, six of them for `openhuman-full` and net-new. The log's duplicate column sums to 32 and the net-new group holds 6.

## Edge Cases

- **A resolving tag proves only that the line exists.** Section 9 says so itself, and this iteration's script checks exactly that and no more. The substance of each row was checked in iterations 1, 2, 5 and 6 by reading the cited lines, which is the only way to test the stronger claim.
- **The 30 failing tags in the iteration records were not re-run.** Section 9 reports them from `scratch/synthesis-inputs/cite-check.cjs` over the 40 records. Re-running that script would need the records' own prefix table, and the claim is about the records rather than about this document, so it is recorded as unverified here rather than as a pass.
- **Section 7 cites S1 and S3 by bare line number in several entries** (`S1:133`, `S3:111`, `S3:202`) rather than as a `[SOURCE:]` tag. Those are not counted in the 616 and were spot-checked by hand: `S3:111` and `S3:221` both say what section 7 quotes.
- **Section 9's "Twenty citations ... and all twenty say what the row claims" is a claim about a hand check, not a reproducible count.** The list has twenty entries and the ones this lineage has opened in earlier iterations (`routine-firing.ts:9-13`, `standing-rule.ts:21-29`, `patterns.rs:248-249`, `leak-checks.md:73`, `backends.md:41`, `queue.rs:260-266`, `blocks.rs:7-11`, `secrets-guard.ts:1` and `:17-30`) all hold.

## Confirmed-Clean Surfaces

- All 616 tags in `research.md` and all 331 in `regrade-log.md` resolve to an existing path with an in-range line.
- The six path prefixes in section 1 are used consistently; no tag needed a prefix the table does not define.
- Section 9's tag counts, licence counts, `openhuman-tui` counts and wrong-path example all recompute exactly.
- Section 9's twenty hand-checked citations number twenty and the ones this lineage has opened hold.
- Section 7's quotes from S1, S2 and S3 are accurate, including the two it calls wrong.
- Section 7's duplicate count matches the regrade log's duplicate column.

## Ruled Out

- **A source tag points at a missing path.** Ruled out: all 947 resolve.
- **A source tag's range runs past the end of its file.** Ruled out: every range falls inside its file.
- **A tag uses a prefix section 1 does not define.** Ruled out: every tag expanded through the six defined prefixes.
- **Section 9's tag counts are wrong.** Ruled out: 616 and 331 by direct count.
- **Section 9's licence count is wrong.** Ruled out: 20 manifests with a line, 18 `GPL-3.0-only` and 2 `GPL-3.0-or-later`, and `tinyvoice` with none.
- **Section 9's `openhuman-tui` counts are wrong.** Ruled out: 55 files, 9,601 `.rs` lines, 9,526 under `src/`, in both checkouts.
- **Section 7 misquotes S3 on 004 or 012.** Ruled out: `S3/research.md:111` and `:221` say what section 7 quotes.

## Next Focus

- Dimension: maintainability
- Focus area: the net-new ranking and the skip-list check -- section 5's sixteen candidates read for rank order and phase assignment, and section 6's seven skip rows read against the evidence each cites
- Reason: section 5 and section 6 carry the document's answer to the second half of the question, and neither has had a maintainability pass
- Rotation status: second pass of the maintainability dimension
- Blocked/productive carry-forward: the reference-side reads stay productive; the `server/`-absent claims stay blocked
- Required evidence: each candidate's rank, its phase or net-new label, and the skip row's cited evidence

Review verdict: PASS

# P2 Verification (Sonnet, high effort)

Three Sonnet verifiers re-checked the P2 findings in `review-report.md` that the orchestrator had not verified. They read the code and reproduced the findings in scratch folders, which were deleted afterwards. No repository file was changed. The orchestrator spot-checked two of their claims and both held:
- `scratch/` has no `red-E.log`;
- `create-track-refresh.vitest.ts:149-185` covers the sub-track write path.

Already confirmed by the orchestrator through reproduction or code reading: F-P1-1, F-P1-2 and P2-3.

Paths are relative to `.skilled/skills/system-spec-kit/runtime/` unless they start with `.skilled/` or name a packet doc.

## Verdicts

| Report ID | Claim | Verdict | Evidence and notes |
|-----------|-------|---------|--------------------|
| P2-5 | `--track a/b/c` creates an unreachable packet | CONFIRMED, not new | `cli/spec/create.sh:1174-1182` accepts it. `refresh_track_root` returns early at `create.sh:1056-1058`. The sweep never lists `specs/a/b/c/001-probe`. Pre-existing at `ac32d66fed`. An undeclared two-segment value behaves the same, and `create-track-refresh.vitest.ts:170` asserts that it is "left alone". |
| P2-7 | Declared sub-track with `spec.md` is reported as undeclared | CONFIRMED, cosmetic (P3) | `cli/lib/track-roots.mjs:146` and `:253` merge `!declared` with `spec.md exists`, so the message is wrong. The diagnostic is advisory only. |
| P2-9 | The two reader views return different shapes | PARTIAL (P3) | The working tree returns an array carrying `.diagnostics` (`track-roots.mjs:162-164`). The commit view returns `{tracks, skipped, diagnostics}` (`:266-268`). Only `sweep-track-roots.mjs:72-82` consumes both. The split predates the range. |
| P2-6 | Moved packet keeps its old sub-track parent | PARTIAL, by design | `repair-derived.cjs:364-390` returns `{known:false}`. The merge keeps the parent and sets `parent_id_review_required: true` (`lib/graph/graph-metadata-parser.ts:1780-1793`). The parent is flagged for review, not silently kept, and an existing test covers this. |
| P2-1 | Sub-track predicate duplicated with different rules | PARTIAL | Four rule sets across `lib/validation/orchestrator.ts:213-240`, `cli/spec/validate.sh:188-217`, `cli/spec/archive.sh:193-213`, `track-roots.mjs`, `graph-metadata-parser.ts:854-873` and `repair-derived.cjs:321-341`. They differ on three things: the numbered-name regex, how a symlinked `description.json` is treated, and the hidden or `node_modules` exclusions. Reproduced: with `trk/001_odd` declared, the sweep calls it a packet, while `validate.sh` calls it a container. `implementation-summary.md:101` ("the exact word and the same location rules") is false. |
| P2-2 | Symlinked `description.json` accepted by validation | CONFIRMED | `validate.sh:200-203` and `orchestrator.ts:226-236` follow the link. Reproduced: the sweep says "undeclared", while validate says "Sub-track directory". |
| P2-4 | `refresh --apply` writes through a symlinked `graph-metadata.json` | CONFIRMED (top of P2) | `cli/spec/refresh-track-roots.mjs:107`. Reproduced: a file outside the tree was rewritten. `create.sh` and `archive.sh` call `--apply` automatically. Top-level track metadata has the same gap (`track-roots.mjs:118-120`), which predates sub-tracks. |
| P2-8 | Validation follows a symlinked numbered packet in a sub-track | CONFIRMED | `validate.sh:~377` matches with a glob and `[[ -d ]]`, which follows links. The reader uses `Dirent.isDirectory()`, which does not. Reproduced. The top-level glob has the same pattern. |
| P2-10a | Wrong-content host-relative child flagged, never corrected | PARTIAL, intended | `.skilled/commands/doctor/scripts/symlink-engine.cjs:605-616`. The merge never overwrites any local path, by design. |
| P2-10b | Host-relative link skips ignore bookkeeping | CONFIRMED | `symlink-engine.cjs:814-822` never pushes to `ignoreCandidates`, while lines 826 and 834 do. Reproduced: `?? .skilled/specs`. It may be intended, but no comment or test says so. |
| P2-10c | `project_owned` links into the checkout on a fresh host | PARTIAL, deliberate | The guard at `symlink-engine.cjs:919` is "fallback only", and a test asserts this behavior. The name could mislead. |
| P2-10d | Whole-linked `.skilled` reads the checkout's `specs/` | CONFIRMED (limit and doc gap) | `symlink-engine.cjs:698-701` and `920-923`. No doctor doc names the limit. `implementation-summary.md:130` omits the specs consequence. |
| P2-11 | `folder-structure.md` `specId` shape | PARTIAL | `references/structure/folder-structure.md:112-115` requires `<track>/<sub-track>`. Nothing produces or checks that, and existing tracks use a bare name. The "cannot be a path" half is refuted, because the schema accepts any string. |
| P2-12 | Stale `lib/README.md` and feature-catalog page | CONFIRMED (omission) | `cli/lib/README.md:121` and `feature-catalog/tooling-and-scripts/track-root-children-lists.md` are unchanged and do not mention sub-tracks. |
| P2-13a | `tasks.md` cites `red-E.log` | PARTIAL | `tasks.md:38` gives the range A–G, but E is missing from `scratch/`. |
| P2-13b | `plan.md` test command omits a test | CONFIRMED | `plan.md:85` lists nine files and omits `validate-subtrack.vitest.ts`. |
| P2-13c | Known Limitations claims deeper layouts are reported | CONFIRMED | A declared `demo/sub/deeper` produces no diagnostic, so `implementation-summary.md:129` is false. |
| P2-14a | New tests cover happy paths only | REFUTED as worded | `create-track-refresh.vitest.ts:146-203` covers more than happy paths. Still uncovered: a declared sub-track with no `graph-metadata.json`, and a refresh-script failure. |
| P2-14b | Archive parent-derivation test cannot fail for its stated reason | CONFIRMED | `cli/tests/graph-metadata-refresh.vitest.ts:120-135` uses a four-segment identity, so the `segments.length` check returns first. The folder is also named `old`, not `z_*`. |
| P2-14c | New `create.sh` write path has no test | REFUTED | It is covered at `create-track-refresh.vitest.ts:146-170`. |

## Work that remains

- **Fix:** F-P1-1, F-P1-2, P2-1, P2-2, P2-3, P2-4, P2-5, P2-8, P2-10b, P2-10d, P2-11, P2-12, P2-13a/b/c, P2-14a (the two uncovered cases) and P2-14b.
- **Optional (P3):** P2-7 and P2-9.
- **No change, behavior is by design:** P2-6, P2-10a and P2-10c. A one-line doc note is optional.
- **Dropped:** P2-14c.

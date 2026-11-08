# Deep Review Report: named sub-tracks and host repositories

## 1. Executive Summary

- **Verdict: CONDITIONAL**
- hasAdvisories: false (the verdict is not PASS)
- Active findings after deduplication: **P0 0 · P1 2 · P2 14**. The fan-out merge counted 40 raw entries (0 P0, 4 P1, 36 P2) and returned `merged_verdict: CONDITIONAL`. The 4 raw P1 entries are two defects, each reported by two lineages. Several raw P2 entries repeat a P1 or each other.
- Scope: commits `ac32d66fed..7714ff26b1` on main, covering:
  - the sub-track reader, refresh and sweep;
  - `create.sh`, validation and parent derivation;
  - `repair-derived` and `archive.sh`;
  - the doctor `project_owned` entry and host `.skilled` build;
  - the host trigger-index docs.
- Lineages: four, five iterations each, 20 iterations in all.
  - `deepseek-1`, `deepseek-3` and `deepseek-4` ran on cli-opencode with `opencode-go/deepseek-v4.1-flash` at max.
  - `luna` ran on cli-codex with `gpt-6-luna` at xhigh, fast tier.
  - `luna` replaced `deepseek-2`. That lineage stalled with no iteration and was stopped. Its folder is in `../review-archive/2026-11-07T1905-deepseek-2-stopped/`.
- Operator review focus: Review the packet implementation in commits ac32d66fed..7714ff26b1: named sub-tracks (track-roots, refresh, sweep, create.sh, validate, parent derivation, repair-derived, archive.sh), the doctor project_owned entry and host .skilled build, and the host trigger-index docs. Check correctness, flat-track non-regression, path containment and symlink handling, and spec/doc alignment. Never open any .env file or any Barter file.

## 2. Planning Trigger

`/speckit:plan` is required. Both P1s are small `create.sh` fixes, and they fit a follow-up task inside this packet or a short remediation child.

```json
{
  "label": "Planning Packet",
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "F-P1-1", "severity": "P1", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh", "line": 1050, "title": "A trailing slash on a sub-track --track value skips both track-root refreshes"},
    {"id": "F-P1-2", "severity": "P1", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh", "line": 1344, "title": "create.sh writes a packet through a symlinked sub-track that every reader skips"}
  ],
  "remediationWorkstreams": ["WS-1 create.sh --track normalization and sub-track checks", "WS-2 sub-track predicate and symlink policy unification (P2)", "WS-3 pre-push repair path for a declared sub-track with no metadata (P2)", "WS-4 doctor symlink-engine edge cases (P2)", "WS-5 docs and test gaps (P2)"],
  "specSeed": ["create.sh normalizes --track before any use", "create.sh refuses or warns on a symlinked or three-level sub-track"],
  "planSeed": ["red tests for demo/sub/ and a symlinked demo/linked, then fix create.sh"],
  "findingClasses": ["cross-consumer", "UNKNOWN"],
  "affectedSurfacesSeed": ["create.sh track value", "track-roots reader", "refresh-track-roots", "sweep-track-roots and the pre-push gate"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P1: confirmed by reproduction

**F-P1-1: A trailing slash on a sub-track `--track` value skips both track-root refreshes**
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1050`, with the cause at `create.sh:1175`. Dimension: correctness.
- **Reported by:** `deepseek-4` and `luna` as P1, and `deepseek-1` and `deepseek-3` as P2.
- **Evidence:** in a scratch repository with a declared `demo/sub`, the two forms of the command differ:
  - `create.sh --track demo/sub/` writes `demo/sub/001-probe`, exits 0, and leaves `children_ids` empty in both `demo/sub` and `demo`, with no warning.
  - The same command without the slash lists the packet in both, and prints `demo/sub: add …` and `demo: add sub`.
- **Cause:** `validate_track_value` strips the slash only in its local copy, so `TRACK` keeps it. `refresh_track_root` then reads `sub/` as the sub-track name, which still contains a slash, and returns 0.
- **Impact:**
  - The sub-track and its track drift silently.
  - The pre-push sweep then reports drift for a packet the operator just created as documented.
  - A flat `--track demo/` was already skipped before this packet, so flat tracks have not regressed.
- **Fix:** normalize `TRACK="${TRACK%/}"` once, before `SPECS_DIR` is built.
- **Disposition:** confirmed.

**F-P1-2: `create.sh` writes a packet through a symlinked sub-track that every reader skips**
- **Location:** `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1340-1344`. Dimension: correctness. Class: cross-consumer.
- **Reported by:** `deepseek-3` and `luna` as P1, and `deepseek-4` as P2 at `create.sh:1171`.
- **Evidence:** with `specs/demo/linked` as a symlink to a folder outside `specs/`, `create.sh --track demo/linked` exits 0 and writes `001-probe3` into the link target.
  - No refresh runs and no diagnostic appears. `is_declared_subtrack` returns false because the reader skips symlinked containers (`lib/track-roots.mjs:133-136`).
  - The spec requires a symlinked sub-track to be "skipped with a diagnostic in both views" (`spec.md:68`, REQ-008).
- **Impact:** the packet is an orphan. No `children_ids` list ever names it, and it sits outside `specs/`.
- **Fix:** before writing, refuse a two-level value whose sub-track is a symlink, or one that is not a declared sub-track, and name the reader's diagnostic. A flat symlinked track stays allowed, as `create-track-containment.vitest.ts:119` requires.
- **Disposition:** confirmed.

### P2: advisories

The orchestrator re-verified only P2-3, by reading the sweep and refresh code. The rest are reviewer claims, deduplicated and not re-run.

| ID | Theme | Location | Lineages |
|----|-------|----------|----------|
| P2-1 | The declared-sub-track predicate is implemented about five times with different name and field rules. One folder can be a packet to the sweep and a container to validation, and `implementation-summary.md:101` claims a single shared rule. | `runtime/lib/validation/orchestrator.ts:213`, `runtime/cli/spec/validate.sh:188,197,217`, `implementation-summary.md:101` | deepseek-1, deepseek-3, deepseek-4 |
| P2-2 | A symlinked `description.json` is refused by the shared reader but accepted as a sub-track declaration by validation | `validate.sh:200-203`, `orchestrator.ts:231` | deepseek-1, deepseek-4, luna |
| P2-3 | A declared sub-track without a readable `graph-metadata.json` makes the sweep exit 1, which blocks the pre-push gate. The printed repair, `refresh-track-roots.mjs --apply`, refuses to write unreadable metadata, so it cannot clear the block. Verified by reading: `sweep-track-roots.mjs:97-101,121-123` and `refresh-track-roots.mjs:90-94`. | `runtime/cli/lib/track-roots.mjs:151` | deepseek-4 |
| P2-4 | `refresh --apply` writes through a symlinked sub-track `graph-metadata.json` | `runtime/cli/spec/refresh-track-roots.mjs:107` | deepseek-4 |
| P2-5 | A three-segment `--track` passes validation and creates an unreachable packet | `create.sh:1174` | deepseek-3 |
| P2-6 | A packet moved out of a sub-track keeps the old sub-track `parent_id` | `runtime/cli/spec/repair-derived.cjs:384` | deepseek-1 |
| P2-7 | A declared sub-track that also has `spec.md` is reported as undeclared | `track-roots.mjs:146` | deepseek-1 |
| P2-8 | Recursive validation follows a symlinked numbered packet inside a sub-track | `validate.sh:377` | deepseek-3 |
| P2-9 | The working-tree and commit reader views return different shapes | `track-roots.mjs:99,163` | deepseek-1, deepseek-4 |
| P2-10 | Doctor symlink engine edge cases: a wrong-content host-relative child is flagged but never corrected; the host-relative link branch skips the ignore bookkeeping; `project_owned` links into the checkout on a fresh host; a whole-linked `.skilled` host keeps reading the checkout's `specs/` and no doc names that limit. | `.skilled/commands/doctor/scripts/symlink-engine.cjs:610,820,918,919` | deepseek-1, deepseek-4 |
| P2-11 | `folder-structure.md` documents a sub-track `specId` shape that the parser does not derive and that cannot be a path | `references/structure/folder-structure.md:115` | deepseek-1, deepseek-3, deepseek-4 |
| P2-12 | Stale docs: `lib/README.md` still describes the old reader contract, and the feature-catalog track-root page was not updated | `runtime/cli/lib/README.md:121`, `feature-catalog/tooling-and-scripts/track-root-children-lists.md:1` | deepseek-1, deepseek-4 |
| P2-13 | Packet doc drift, in three places: `tasks.md` cites a `red-E.log` that isn't in the packet; `plan.md`'s test command leaves out `subtrack-fixture` validation; and the Known Limitations say deeper layouts are reported, but discovery never looks inside a sub-track. | `tasks.md:38`, `plan.md:85`, `implementation-summary.md:129` | deepseek-1, deepseek-3 |
| P2-14 | Test gaps: the new tests cover happy paths only; the archive-folder parent-derivation case cannot fail for the reason its name gives; and the new `create.sh` write path has no test of its own. | `tests/create-track-refresh.vitest.ts:149`, `tests/graph-metadata-refresh.vitest.ts:120`, `tests/create-track-containment.vitest.ts:100` | deepseek-3, deepseek-4 |

Paths in the P2 table are relative to `.skilled/skills/system-spec-kit/` unless they start with `.skilled/` or name a packet doc.

## 4. Remediation Workstreams

1. **WS-1 (P1, fix first): `create.sh --track`.** Fixes F-P1-1, F-P1-2 and P2-5.
   - Normalize the trailing slash once.
   - Refuse a symlinked, undeclared or three-level sub-track before `mkdir`.
   - Add the red tests first.
2. **WS-2 (P2): one sub-track predicate.** Fixes P2-1, P2-2, P2-4, P2-7 and P2-8.
   - Route validation, the orchestrator and refresh through the reader's predicate and its symlink refusal.
   - Correct `implementation-summary.md:101`.
3. **WS-3 (P2): the pre-push repair path.** Fixes P2-3. Either have refresh seed a missing sub-track `graph-metadata.json`, or make the sweep name a repair that works.
4. **WS-4 (P2): doctor symlink engine.** Fixes P2-10.
5. **WS-5 (P2): docs and tests.** Fixes P2-6, P2-9 and P2-11 to P2-14.

## 5. Spec Seed

- `create.sh` normalizes `--track` once and uses the normalized value everywhere.
- A two-level `--track` must name a declared, real-directory sub-track, or `create.sh` stops with the reader's diagnostic.
- Every tool that decides "is this a declared sub-track" uses the reader's predicate.
- The sweep's printed repair for an unreadable sub-track metadata file must clear the block.

## 6. Plan Seed

- T1: red tests in `create-track-refresh.vitest.ts`: `demo/sub/` refreshes both levels; a symlinked `demo/linked` is refused with no write; `a/b/c` is refused.
- T2: fix `create.sh` (`validate_track_value`, `refresh_track_root` and the `SPECS_DIR` build) until T1 is green; rerun the plan §5 suite.
- T3: export the reader's sub-track predicate; switch `validate.sh`, `orchestrator.ts` and refresh to it.
- T4: decide and implement the WS-3 repair path, with a sweep test.
- T5: doc corrections (P2-11 to P2-13).

## 7. Traceability Status

- **Core protocols:**
  - spec_code: drift found. REQ-008 holds in the readers but not in `create.sh` (F-P1-2), and `implementation-summary.md:101` overstates rule sharing (P2-1).
  - checklist_evidence: partial. `tasks.md:38` cites a missing log (P2-13).
- **Overlay protocols:** feature catalog and README alignment drifted (P2-12).
- **AC_COVERAGE:** advisory, and it does not change the verdict. All four lineages covered the four dimensions (correctness, security, traceability, maintainability).

## 8. Deferred Items

All P2 rows are advisories and do not block the CONDITIONAL verdict on their own. P2-3 is the one worth taking with WS-1, because it can block a push.

## Dimension Expansion Map

Each lineage covered correctness, security, traceability and maintainability. No council pivot ran: stop policy was `max-iterations` and convergence mode was default. Lineage convergence scores were deepseek-1 0.80, deepseek-3 0.94, deepseek-4 0, and luna 1.0.

## 9. Search Ledger

- hasSearchDebt: false. All four lineages report empty `searchDebt`.
- Ruled-out candidates with clean-search proof: luna 49, deepseek-3 10, deepseek-4 5, deepseek-1 0.

## 10. Audit Appendix

- **Convergence:** 20 iterations, forced to max by the stop policy. Merge result: `merged_lineages: 4`, `skipped_no_registry: 0`.
- **Artifacts:**
  - merged registry: `deep-review-findings-registry.json`;
  - attribution: `fanout-attribution.md`;
  - per-lineage resource maps: `lineages/deepseek-1/resource-map.md` and `lineages/deepseek-4/resource-map.md`;
  - packet resource map: none, so the coverage gate was skipped.
- **Run notes:**
  - `deepseek-4` logged three iteration timestamps after its own completion window, a reporter clock anomaly flagged by the runner.
  - All reviewers ran with auto-approved permissions and a write boundary set only by their prompts.
- **Core Protocols:** P1s re-verified by sandbox reproduction (sandbox deleted); P2-3 verified by reading the code.
- **Overlay Protocols:** the remaining P2s are reviewer claims and were not re-run.

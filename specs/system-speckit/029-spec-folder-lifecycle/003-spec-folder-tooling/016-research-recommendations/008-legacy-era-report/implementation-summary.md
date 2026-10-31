---
title: "Implementation Summary: Legacy-era report and detection"
description: "Status and summary of the built legacy-era report: one read-only classifier and report for the pre-v4 signals, printed by the upgrade-legacy dry run."
trigger_phrases:
  - "legacy era report implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Legacy-era report and detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-legacy-era-report |
| **Status** | Complete |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is **complete**. You can now see which pre-v4 signals a repository carries in one read-only report. `repo-era.mjs` walks the spec tree once, counts each packet once, leaves out the directories that only hold copies, and reports five signals. The `upgrade-legacy` dry run prints the layout and frontmatter part of that report.

### Packet classifier

`classifyRepo` (repo-era.mjs:499) reuses the shared corpus walk and adds every `z_archive` root at any depth, because the shared walk prunes archives. A directory with a `spec.md` is a packet, one without is a non-packet, and the directories the exclusion list removes are reported as excluded. `EXCLUSION_RULES` holds research lineages, the `research`, `review` and `context` containment trees, `scratch`, `z_archive/00-changelog` and git-ignored paths. On this repository it finds 4431 packets, 641 non-packets and 2661 excluded paths. `buildReport` turns the classification into counts, and the module prints that report as JSON when you run it directly.

### Layout detection with provenance

The layout is `v3`, `v4`, `both` or `unknown`. A real `.opencode/specs` directory marks v3 with source `legacy-root`. After a move, a packet's `description.json` whose `specFolder` names `.opencode/specs` marks v3 with source `description-residue`; a prose mention of that path does not count. The result carries `provenance: { source, residueCount }`, and the classifier accepts a repository root or a spec root.

### Header aliases

`HEADER_ALIASES` is a separate frozen table. It maps `impl-summary-core`, `implementation-summary-core` and `implementation-summary` to `implementation-summary`, the other `-core` spellings to their document names, and the `resource-map` v1.1 and v2.2 headers to `resource-map`. A document's marker is `new` when its version equals the current version in `templates/spec-kit-docs.json`, `legacy` when it differs, and `none` when there is no marker.

### The four counted signals

| Signal | Counted per | Values |
|--------|-------------|--------|
| Frontmatter | document | present, missing |
| Template marker | document | new, legacy, none |
| Generated metadata | packet | present, stub, missing |
| Level documents | packet | match, mismatch, unknown |

The level check reads the declared level from the `SPECKIT_LEVEL` marker, then a YAML `level:` key, then the Level row of the metadata table. It compares the packet's direct documents with the manifest contract for that level. A phase parent is checked against the lean trio of `spec.md`, `description.json` and `graph-metadata.json` instead.

### Dry-run report lines

Without `--apply`, `upgrade-legacy.mjs` prints this block after the per-packet results:

```
repo era report:
  layout provenance: source=<source or none>; description.json residue count=<n>
  layout: <kind> (v3=<true or false>, v4=<true or false>)
  frontmatter: present=<n> missing=<n>
```

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs` | Created | Classifier, exclusion list, header aliases, report builder and a direct-run entry point |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts` | Created | 6 tests covering the walk, exclusions, aliases, layout, level sources and phase parents |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modified | Imports the report and prints the dry-run block |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | New Repo Era Report section |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in wave 1 by Luna max on the fast tier through cli-codex, then reviewed read-only once by DeepSeek V4.1 Flash max through cli-pi. The builder applied each finding only after confirming it in the code, and the orchestrator verified the result.

### Review round

| Finding | Severity | What it found | Fix |
|---------|----------|---------------|-----|
| F1 | P0 | Only the top-level `specs/z_archive` was walked. Track-level and nested archives were pruned, so 2238 archived `spec.md` files went uncounted. | Every `z_archive` at any depth is counted. Fixtures cover track-level and nested archives. |
| F2 | P2 | The v3 residue check matched prose and reported no provenance. | Residue is a `description.json` `specFolder` that names the legacy root. The layout carries provenance and the dry run prints it. |
| F3 | P2 | A YAML frontmatter `level:` key was ignored. | The key is read after the marker, with a test. |

The first corpus run counted 2206 packets and reported layout `both` on a repository with no `.opencode/specs`. After the fixes the count is 4431 and the layout is `v4` with residue 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Plain functions, `classifyRepo` and `buildReport`, not classes | The tasks named classes, but data in and data out is all the callers need |
| Synchronous, single-threaded walk | The whole corpus runs in 13 to 18 s, so no budget or worker is needed |
| Independent signal detectors | Each runs on every packet so the counts can be cross-checked against the totals |
| Exclusion list and header aliases as separate frozen tables | Each can be tested and changed without touching the other |
| Count archived packets at every depth | Skipping them left 2238 archived `spec.md` files uncounted, which the review found |
| Read v3 residue from `description.json` `specFolder` only | A prose mention of the old path is not evidence of the old layout |
| Print findings, do not route them | The report is read-only; routing and the doctor integration come later |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest run` of `repo-era.vitest.ts` and `upgrade-legacy.vitest.ts` | 2 files passed, 24 tests passed, 0 failed (6 and 18) |
| Corpus run, `node .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs .` | 4431 packets, 641 non-packets, 2661 excluded paths; layout `v4`, residue 0 |
| Corpus signal counts | Frontmatter 18457 present and 99 missing; markers 15651 new, 2400 legacy and 505 none; metadata 4409 present, 0 stub and 22 missing; levels 4279 match, 129 mismatch and 23 unknown |
| Independent count | `packetCount` 4431 equals an independent `find` count of 4431 that excludes lineages, research, review, context, 00-changelog and scratch |
| Two consecutive corpus runs | Byte-identical output, 18.2 s then 13.2 s wall time |
| `upgrade-legacy` dry run on this folder | Printed the three era lines, exit 0 |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` | Exit 0; 162 files passed and 3 skipped; 1648 tests passed and 19 skipped; baseline 161 files and 1639 passed; legacy and validation suites 0 failures |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | Exit 0 |
| CLI typecheck and build | Exit 0 each |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, Errors 0, Warnings 0; `AC_COVERAGE` 8/8 and `AC_CLOSURE` closeable |
| `check-goal.cjs` on this folder | `RESULT: PASSED (5/5 checks)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Doctor integration is phase 009's.** `doctor-update-check.yaml` was not touched. The spec Scope section still lists the `/doctor:update check` presentation, which the spec handoff criteria assign to phase 009.
2. **Findings are printed, not routed.** The spec asked `upgrade-legacy` to route findings to repair stages. The dry run prints layout and frontmatter only, and `--apply` prints nothing from the report.
3. **No test pins the dry-run lines.** They were checked by running the dry run. The `upgrade-legacy` test added in the same wave belongs to a different phase.
4. **Fixture size.** The tasks asked for a 20-packet fixture. The main fixture counts 22 packets, because it adds archived packets at three depths.
5. **Two criteria cite REQ-003.** AC-004 and AC-008 name it, and spec.md defines no such requirement.
6. **No changelog to refresh.** The phase context asks for one, and no `changelog/` folder exists under the parent or the track.
<!-- /ANCHOR:limitations -->

---

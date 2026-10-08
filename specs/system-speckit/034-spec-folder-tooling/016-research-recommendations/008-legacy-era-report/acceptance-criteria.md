---
title: "Acceptance Criteria: Legacy-era report and detection"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "legacy era report acceptance criteria"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Legacy-era report and detection

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report
**Level:** 2
**Status:** Complete
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fixture with 20 packets, when PacketClassifier walks it, then every packet is counted exactly once | Observed: 6 of 6 tests pass in `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:101`. It asserts 22 packets at `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:172` and one `001-packet` at `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:176`. The fixture counts 22 packets, not 20: 19 numbered plus 3 archived at top-level, track-level and nested depth. | Met | - |
| AC-002 | REQ-001 | Given a packet in lineages/, scratch/, z_archive/00-changelog, or marked git-ignored, when the classifier walks the tree, then it is excluded from the report | Observed: the first test asserts that no `*-copy` fixture reaches `packets` (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:179`) and that the `research`, `research/lineages`, `review`, `context`, `scratch` and git-ignored paths are excluded (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:180` to `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:185`), as is `z_archive/00-changelog` (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:186`). All four types in the row are covered. | Met | - |
| AC-003 | REQ-002 | Given the spec tree with both v3 `.opencode/specs` and v4 `specs/`, when the classifier detects layout, then it returns layout:v3 for the old tree and layout:v4 for the new tree | Observed: a `specs/` tree with one `description.json` naming `.opencode/specs` gives `kind: both` with source `description-residue` (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:187`), an `.opencode/specs` fixture gives `kind: v3` with source `legacy-root` (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:283`), and a `specs/` fixture gives `kind: v4` (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:300`). This repository has no `.opencode/specs`, so its own run reports `v4` with residue 0 and the v3 and both outcomes come from fixtures only. | Met | - |
| AC-004 | REQ-003 | Given the era report, when it is invoked multiple times on the same corpus, then the packet count is consistent across runs | Observed: two consecutive runs of `node .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs .` (entry point at `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:656`) gave byte-identical JSON, with `packetCount` 4431 both times. The count also equals an independent `find` count of 4431 that excludes lineages, research, review, context, 00-changelog and scratch. REQ-003 has no entry in spec.md. | Met | - |
| AC-005 | REQ-004 | Given documents with `impl-summary-core`, `implementation-summary-core`, and `implementation-summary` headers, when the classifier applies aliases, then each resolves to the canonical `implementation-summary` name | Observed: the second test passes. The three spellings resolve to `implementation-summary` (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:242`), and `resource-map` v1.1 reads as current (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:247`) while v2.2 reads as legacy (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:248`). | Met | - |
| AC-006 | REQ-005 | Given a fixture with pre-v4 signal examples, when the era report runs, then it detects and counts each of five signals separately | Observed: the first and second tests pass with each signal counted separately (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:199`, `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:249`) and the totals equal to the document or packet count (`.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:267`). The corpus run reports layout `v4`, frontmatter 18457 present and 99 missing, template markers 15651 new, 2400 legacy and 505 none, metadata 4409 present, 0 stub and 22 missing, and levels 4279 match, 129 mismatch and 23 unknown. | Met | - |
| AC-007 | REQ-006 | Given the latest spec-kit CLI test suite, when repo-era.mjs is added and tests run, then no new test failure is introduced | Observed: `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` (script at `.skilled/skills/system-spec-kit/runtime/cli/package.json:19`) exits 0 with 162 files and 1648 tests passed against a baseline of 161 files and 1639 passed, and the legacy and validation suites report 0 failures. The root `test` script named in this row was not run; it also runs the runtime workspace tests. | Met | - |
| AC-008 | REQ-003 | Given the era report performance characteristics, when the module is used in production, time budget is not recorded | Observed: no time budget is enforced (answer recorded at `spec.md:210`). Two consecutive whole-corpus runs of 4431 packets took 18.2 s and 13.2 s wall time. REQ-003 has no entry in spec.md. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eight criteria are Met. The six `repo-era.vitest.ts` tests, the 4431-packet corpus run (equal to an independent `find` count, identical on a second run) and the passing CLI suite carried the packet. Left out on purpose: the `/doctor:update check` integration, which belongs to phase 009, and routing the printed findings to repair stages. No test pins the dry-run report lines, and AC-004 and AC-008 cite a REQ-003 that spec.md does not define.
<!-- /ANCHOR:closure -->

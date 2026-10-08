---
title: "Acceptance Criteria: Phase 10: upgrade-reversibility"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "upgrade reversibility acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility"
    last_updated_at: "2026-10-08T13:00:36Z"
    last_updated_by: "orchestrator"
    recent_action: "Met all nine criteria with observed evidence"
    next_safe_action: "Commit with wave 2"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: upgrade-reversibility

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility
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
| AC-001 | REQ-001 | Given a dirty tree, When `--apply` runs without a manifest, Then the tool writes a manifest to `<git-dir>/upgrade-legacy.manifest.json` before any change | Test `upgrade-legacy.vitest.ts::dirty-tree-writes-manifest` exercises this, exit code 0. Observed 2026-10-08 with `vitest run --config vitest.config.ts --reporter verbose` on `upgrade-legacy.vitest.ts` and `repo-era.vitest.ts` from `.skilled/skills/system-spec-kit`: the case printed a pass, the run printed `Test Files 2 passed (2)` and `Tests 34 passed (34)`, exit 0. The case first applies on a committed tree (exit 0, no manifest), then commits a second packet, appends an uncommitted line to its `spec.md` and `plan.md` and applies again: exit 0, the files changed, and `<git-dir>/upgrade-legacy.manifest.json` exists, with `<git-dir>` from `git -C <sandbox> rev-parse --absolute-git-dir`. The manifest holds the bytes the two files had before the run, which only holds if it was written before the repair step changed them. Code: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1083` (manifest prepared when the tree is dirty and a packet fails), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1094` (repairs start after it), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:452` (`prepareManifest`). Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:489`. | Met | - |
| AC-002 | REQ-001 | Given a dirty tree where manifest location is not writable, When `--apply` runs, Then the tool refuses with a clear error message | Test `upgrade-legacy.vitest.ts::dirty-tree-unwritable-manifest` exercises this, exit code 2. Observed 2026-10-08: the case printed a pass in the same run (34 passed, exit 0). A `git` shim first on `PATH` answers `rev-parse --absolute-git-dir` with `/dev/null`, so the manifest path is `/dev/null/upgrade-legacy.manifest.json`. The apply on a dirty legacy packet exits 2, prints that path and `could not write reversibility manifest`, and the packet folder digest is unchanged. Code: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1085-1091`. Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:155`. | Met | - |
| AC-003 | REQ-002 | Given an apply run on a dirty tree, When examining `<git-dir>/upgrade-legacy.manifest.json` with `<git-dir>` from `git -C <REPO> rev-parse --absolute-git-dir`, Then it records HEAD SHA, timestamp, the baseline map, and a before-image for each dirty file the run touched, and restoring one gives the original bytes | Test `upgrade-legacy.vitest.ts::manifest-before-image-restores`. Observed 2026-10-08: that case and `dirty-tree-writes-manifest` both printed a pass (34 passed, exit 0). The manifest has `schema` 1, `headSha` equal to `git rev-parse --verify HEAD`, a parseable `recordedAt` timestamp, `baselineMap`, `recordedBaselineMap` and one `beforeImages` entry per dirty file the run touched. The entries for `spec.md` and `plan.md` have kind `file-bytes` with base64 content that decodes to the exact bytes the files held before the run. The restore case writes the decoded image over the repaired file and reads the original bytes back, then puts the current content back. The README recovery script restores entries of this format, and its own case runs it on a hand-written manifest. The before-image is the file bytes: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` never calls `git hash-object`, which the requirement allowed. Code: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:280-312` (`beforeImagesFor`), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:452-471`. Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:518-533`, `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:536`, `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:616`. | Met | - |
| AC-004 | REQ-003 | Given a committed tree with a baseline, When dry run is requested, Then the output shows every finding the baseline will downgrade, with packet path, rule, and the error-to-warning transition | Dry run output includes a "Downgrades" section; grep output for "Downgrade" or "warning". Observed 2026-10-08: `reports a failing legacy packet on a dry run and writes nothing` printed a pass; it asserts the output contains `Downgrades:` and `error -> warning` and that the specs tree digest is unchanged. `dry-run Downgrades match the baseline recorded by apply` printed a pass; its dry-run rows, each naming the packet, the rule, `error -> warning` and the detail, equal the findings `--apply` then wrote to `upgrade-baseline.json`, the frontmatter errors the repair steps clear are not in the list, and a real remaining finding (a missing link target) is. Code: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:489` (`printDowngrades`), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:925` (`predictDowngradeFindings` repairs a temporary copy), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1207` (dry-run call). Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:189`, `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:223`. | Met | - |
| AC-005 | REQ-004 | Given a dirty tree with a manifest that has a baseline, When `--apply` runs a second time on the same tree, Then the output shows zero new planned changes and exit code 0 | Test `upgrade-legacy.vitest.ts::dirty-tree-idempotent` runs apply twice on same fixture, asserts zero plan diff on second run. Observed 2026-10-08: the case printed a pass (34 passed, exit 0). Both applies exit 0, the second prints `plan changes=0`, and the specs tree digest after the first and after the second apply equals the digest before them. Code: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1080-1081` (the plan count is the number of packets that fail before repair). Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:568`. | Met | - |
| AC-006 | REQ-005 | Given a session where a manifest was written, When a different session reads the manifest and validates the tree state, Then the baseline from the manifest is restored and used for downgrades | Test `upgrade-legacy.vitest.ts::manifest-recovery` creates manifest in one fixture context, reads in another, asserts baseline applied. Observed 2026-10-08: the case printed a pass (34 passed, exit 0). One process runs `--apply` and writes a `complete` manifest whose `recordedBaselineMap` names a missing link target. The test then renames the whole repository directory, so the recorded `repoRoot` no longer exists, and a second process runs a dry run. Its Downgrades rows equal the rows built from the manifest and the manifest bytes are unchanged. `stale-manifest-head-refuses-apply` and `stale-manifest-tree-refuses-apply` also printed a pass: with HEAD moved, `--apply` exits 2 naming the manifest, the recorded HEAD and the current HEAD while the dry run reports the same and continues; with a packet changed after the manifest was written, `--apply` exits 2 and reports `tree mismatch` with the recorded packet hash; both leave the manifest bytes unchanged. The tool loads the manifest baseline and does not copy before-images back. Code: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:253-277` (`baselineMapFor` prefers the manifest), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:354-430` (`readManifestIfExists`), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:925-937`. Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:580`, `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:663`, `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:699`. | Met | - |
| AC-007 | REQ-006 | Given the test suite, When it runs, Then all three reversibility paths (committed tree, dirty tree, manifest recovery) pass with no failures | `npm run test -- upgrade-legacy.vitest.ts`, exit code 0. Observed 2026-10-08, run as `vitest run --config vitest.config.ts --reporter verbose` on `upgrade-legacy.vitest.ts` and `repo-era.vitest.ts` from `.skilled/skills/system-spec-kit`: `Test Files 2 passed (2)`, `Tests 34 passed (34)`, exit 0, 28 of them in `upgrade-legacy.vitest.ts`. The committed-tree path is the first half of `dirty-tree-writes-manifest`, the dirty-tree path its second half, and the manifest-recovery path is `manifest-recovery`. Separately, the wave 2 whole-tree gate `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` was rerun after review round 2 and the symlink fix: rc 0 with 167 files and 1685 tests passed and 0 failed (baseline 161 and 1639). Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:489`, `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:580`. | Met | - |
| AC-008 | REQ-007 | Given the README, When searching for "reversibility", "manifest", and "recovery", Then each section explains the guarantee and shows the manifest structure and recovery procedure | `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` grep finds all three terms with explanations. Observed 2026-10-08: `grep -ci` on the README finds `reversibility` once (the heading "Upgrade Legacy Reversibility"), `manifest` on 19 lines and `recovery` on 2 lines; the procedure sits under the heading "Recover an Interrupted Apply". The reversibility section states the git requirement and the manifest location (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:117-123`), lists the fields (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:125`), describes the three before-image kinds (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:127`) and the refusal rules (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:129`). The recovery section gives the commands and a restore script (`.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:131-209`), and the case `readme recovery resolves paths from the exported repository root` runs that script from a different directory and gets the original bytes back (`.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:616`). | Met | - |
| AC-009 | REQ-001 | Given REPO is not a git repository, When `--apply` runs, Then the tool refuses before any write | Test `upgrade-legacy.vitest.ts::no-git-refuses-apply`, exit code 2. Observed 2026-10-08: the case printed a pass (34 passed, exit 0). It sets `GIT_DIR` to a directory that does not exist, so `git -C <REPO> rev-parse --absolute-git-dir` fails. `--apply` exits 2 and prints `--apply requires REPO to be a git repository`; the specs tree digest, the existing manifest bytes and the missing fake git dir are all unchanged. Code: `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:182-189` (the refusal message), `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1015-1022` (`--apply` stops before reading any packet). Test: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:555`. | Met | - |

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

**Closeable:** Yes (Complete)

All nine criteria are Met, each with evidence observed in the final state: the two phase test files pass 34 of 34 with exit 0, 28 of them in `upgrade-legacy.vitest.ts`, and the README sections are present and exercised by a test. AC-001 to AC-003 and AC-009 are closed by the manifest, before-image and no-git cases, AC-004 by the two Downgrades cases, AC-005 by the idempotence case and AC-006 by the recovery case plus the two stale-manifest cases. The planned test title `dry-run-lists-downgrades` does not exist: AC-004 is closed by two cases under other titles. The before-image is the file bytes and never a git blob id, which REQ-002 allowed, and the tool loads the manifest's baselines while restoring dirty files stays a documented script, not a command. Not pinned by a test: an interrupted `in-progress` manifest, a run from a directory inside another checkout, and a path outside the repository. The whole-tree gates were rerun on the final state: 1685 tests passed and 0 failed, with `run check`, the typecheck and the hook tests clean.
<!-- /ANCHOR:closure -->

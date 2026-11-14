---
title: "Acceptance Criteria: Phase 19: dsh-repin-rc3"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh repin rc3 acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-repin-rc3"
    last_updated_at: "2026-11-14T13:40:00Z"
    last_updated_by: "orchestrator-worker"
    recent_action: "Met every criterion from the rc.3 probes"
    next_safe_action: "Build phase 012 of the purpose packet on rc.3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-019-dsh-repin-rc3"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 19: dsh-repin-rc3

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `019-dsh-repin-rc3`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edits, When the pin search runs outside `specs/` and changelogs, Then it prints no `0.2.2-rc.1` line and both version constants name `0.2.2-rc.3` | `rg -n --hidden -g '!specs/**' -g '!.git/**' -g '!**/node_modules/**' -g '!**/changelog/**' '0\.2\.2-rc\.1' .` prints only record lines. Observed: 3 record lines, the dist-tag capture, the move sentence and the rc.1 verification date, down from 22 lines, and `rg -n "DSH_VERSION = '0.2.2-rc.3'"` matches `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2948` | Met | - |
| AC-002 | REQ-002 | Given rc.3 and the Gateway key, When the T004 probe runs, Then it exits 0 with a last `final` event of `completed` | `evidence/route-llmgateway.exit.txt` prints 0. Observed: 0, last line `{"type":"final",...,"reason":{"kind":"completed"},"text":"OK"}`, empty stderr | Met | - |
| AC-003 | REQ-003 | Given the edits, When the dispatch hook test and the deep-loop suites that stub the version run, Then all pass | `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints pass 47, fail 0. From `$DL`, `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts tests/unit/combo-matrix.vitest.ts tests/stress/cli-adapter` prints `Test Files  10 passed (10)` and `Tests  338 passed \| 8 skipped (346)`. `npm run typecheck` exits 0. The first vitest run failed one test, whose regex held an escaped `rc\.1` the literal search missed. That line was fixed and the run repeated | Met | - |
| AC-004 | REQ-004 | Given the OpenCode Go key is set, When the T005 probe runs, Then its result is recorded | `evidence/route-opencode-go.exit.txt`. Observed: 0 and a `completed` final event | Met | - |
| AC-005 | REQ-005 | Given the Gateway route, When the four boundary probes and the reasoning check run, Then the home write is denied and stderr holds no `UNSUPPORTED_REASONING_EFFORT` | `evidence/confine-*.stdout.jsonl`. Observed: the cwd write and `echo ok` completed, the home write returned `status":"error"` with `file access denied under workspace-write mode` and left no file, the temp write completed, and `rg -c UNSUPPORTED_REASONING_EFFORT` on the Gateway stderr printed nothing | Met | - |
| AC-006 | REQ-006 | Given rc.3, When one fan-out research lineage runs, Then it completes with no containment advisory and leaves no harness home | `evidence/fanout-lineage.exit.txt` and `.stdout.txt`. Observed: exit 0, `"succeeded":1`, `completed_with_containment_advisory` 0, 262.7 s, the lineage log ends with a `completed` final event and `FANOUT_LINEAGE_COMPLETE:dsh-rc3`, `iteration-001.md` exists, no `did not activate` line and no `dsh-home-*` folder newer than the run start is left in the temp folder | Met | - |
| AC-007 | REQ-007 | Given all probes ran, When `~/.dsh` is compared with the snapshot and the evidence is scanned for key values, Then both are clean | Observed: the `find ~/.dsh` listing with mtimes and sizes is identical to the T003 snapshot, 480 entries, and a scan of the 110 files in the packet for both key values counts 0 hits | Met | - |

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

Yes.
<!-- /ANCHOR:closure -->

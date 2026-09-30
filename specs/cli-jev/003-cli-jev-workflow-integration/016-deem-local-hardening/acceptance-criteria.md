---
title: "Acceptance Criteria: Phase 16: deem-local-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening"
    last_updated_at: "2026-09-28T11:45:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Marked all six criteria Met from the build and session evidence"
    next_safe_action: "None. The orchestrator commits the phase docs"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-ctl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-016-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 16: deem-local-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening
**Level:** 2
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the operator's four answers of 2026-09-28, When the build starts, Then `spec.md` section 10 holds them and Deem's source checkout stays clean, because Q1's answer is C | `grep -c 'Operator answer: pending' specs/cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening/spec.md` prints `0`, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing Observed: the grep printed `0` at the baseline and at the final proof, and the source status printed nothing, exit 0, with HEAD `7cf293f` (P1, `scratch/w3-build/logs/07-final-proof.txt:7`, `scratch/w3-build/logs/07-final-proof.txt:10`). The orchestrator session's host check and the closure pass's read-only rerun printed the same | Met | - |
| AC-002 | REQ-002 | Given Q2's answer is on and `deem-ctl` is edited, When `curl -s 'http://127.0.0.1:8300/health?probe=016'` runs and then `deem-ctl stop` and `deem-ctl start` run, Then the probe's access line is still in the log | `grep -c '"GET /health?probe=016 HTTP/1.1" 200' ~/.local/share/deem/server.log` prints `1` after the restart, and `grep -c 'DEEM_ACCESS_LOG=1' ~/.local/share/deem/bin/deem-ctl` prints `1` Observed: the probe count went `0`, `1` after the probe and `1` after `deem-ctl stop` then `deem-ctl start` with no wait, and the switch count printed `1` (`scratch/w3-build/logs/05-access-log-probe.txt:19`, the line itself at `scratch/w3-build/logs/05-access-log-probe.txt:22`). The old `deem-ctl` counted `0` for the same sequence. The orchestrator session reproduced it with `probe=016session`: count `1` after the restart. Counts used `/usr/bin/grep`, because the harness's `grep` skips binary files | Met | - |
| AC-003 | REQ-003 | Given a dated backup was taken before the first edit, When the backup is restored and the server restarted, Then the old version serves and the new one is put back | `ls ~/.local/share/deem/bin/deem-ctl.bak-*` lists one file, `shellcheck ~/.local/share/deem/bin/deem-ctl` exits 0 with no output and `deem-ctl status` after the restore exits 0 and prints `"backend": "torch"` Observed: `ls` lists `deem-ctl.bak-2026-09-28` only, and `shellcheck` 0.11.0 printed nothing, exit 0. After the backup was restored and the server restarted, `status` exited 0 with `"backend": "torch"`, and the new version went back with `cmp` exit 0 against the copy (`scratch/w3-build/logs/04-rollback-rehearsal.txt:14`, `scratch/w3-build/logs/04-rollback-rehearsal.txt:26`). The closure pass reran `ls` and `shellcheck` read-only with the same result | Met | - |
| AC-004 | REQ-004 | Given Q1's answer is C, accept, When the build closes, Then the acceptance is on record with its revisit trigger and the server's header is unchanged | Q1's answer line in `spec.md` names the revisit trigger, and `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` shows `Access-Control-Allow-Origin: *` Observed: the Q1 answer line holds `Revisit trigger: before any hook calls Deem live` (1 match, `spec.md:232`), and the header check printed `Access-Control-Allow-Origin: *`, exit 0 (`scratch/w3-build/logs/06-header-latency-after.txt:8`). The orchestrator session saw the same header with `curl -D` | Met | - |
| AC-005 | REQ-005 | Given Q3's answer is to hold at 1, When the build records it, Then the server keeps one option order | `grep -c DEEM_N_ORDERS ~/.local/share/deem/bin/deem-ctl` prints `0`, and Q3's answer line in `spec.md` names phase 002's order-flip rate as the reopen trigger Observed: the count printed `0`, exit 1, after the edit and at the final proof, and the Q3 answer line matches once (P5, `scratch/w3-build/logs/07-final-proof.txt:30`, the line at `spec.md:236`). The closure pass reran the count read-only: `0` | Met | - |
| AC-006 | REQ-006 | Given Q4's answer is B, When the build copies the edited `deem-ctl`, Then the copy matches the live file and phase 008 is untouched | `cmp ~/.local/share/deem/bin/deem-ctl specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/context/deem-ctl` exits 0, and `git diff --stat -- specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub` prints nothing Observed: `cmp` exited 0. At 13:28 the 008 diff listed 6 files, all a concurrent closure leaf's, and neither brief named 008. The orchestrator session committed those 6 files as `9aea8cdc56`, and the rerun at 13:31 printed nothing, exit 0, with `cmp` still 0 (`scratch/w3-build/logs/09-criterion-6-rerun.txt:5`, `scratch/w3-build/logs/09-criterion-6-rerun.txt:7`). `git show --stat 10697dcceb` lists no 008 path, and the closure pass's read-only rerun of both commands gave the same result | Met | - |

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

All six criteria are Met from the build orchestrator's observed output and the orchestrator session's host check on 2026-09-28, with the build in `10697dcceb`. The dated backup `deem-ctl.bak-2026-09-28` stays outside the repository until the operator confirms its removal, which is an open operator item, not a criterion.
<!-- /ANCHOR:closure -->

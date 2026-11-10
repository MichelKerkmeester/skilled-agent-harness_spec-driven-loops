---
title: "Acceptance Criteria: Phase 4: dsh-runtime-folder-and-patches"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh runtime folder and patches acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches"
    last_updated_at: "2026-11-06T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked AC-001 to AC-005 Met with observed evidence"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "evidence/checks.txt"
      - "evidence/dump-config-llmgateway.txt"
      - "evidence/dump-config-opencode-go.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-004-dsh-runtime-folder-and-patches"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: dsh-runtime-folder-and-patches

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each route patch and the lineage patch, When `DSH_HOME=$(mktemp -d) dsh --profile headless --patch .dsh/patches/<route> --patch .dsh/patches/lineage.patch.yml --dump-config </dev/null` runs, Then the output names the route's provider and model and stderr holds no unmatched-target warning | Both runs quoted in `implementation-summary.md` with their stderr. Observed: `agent-default-model` is `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, both `reasoningEffort: max`, and each `.stderr.txt` holds only `exit=0`. A keyless boot per route then ends `MISSING_CREDENTIAL` naming that route, exit 1, so the harness accepted the patched provider (`evidence/dump-config-llmgateway.txt:60`, `evidence/dump-config-opencode-go.txt:60`, `evidence/dump-config-llmgateway.stderr.txt:1`, `evidence/dump-config-opencode-go.stderr.txt:1`, `evidence/keyless-llmgateway.stdout.jsonl:6`, `evidence/keyless-opencode-go.stdout.jsonl:6`) | Met | - |
| AC-002 | REQ-002 | Given the checked-in patches, When the secret scan runs, Then it matches only `apiKeyEnv` lines naming `LLMGATEWAY_API_KEY` or `OPENCODE_API_KEY` | `rg -n -i 'api_?key\|secret\|token' .dsh/patches`. Observed: exactly two matches, `route-opencode-go-deepseek.patch.yml:7: apiKeyEnv: OPENCODE_API_KEY` and `route-llmgateway-deepseek.patch.yml:7: apiKeyEnv: LLMGATEWAY_API_KEY` (`evidence/checks.txt:4`, `evidence/checks.txt:5`) | Met | - |
| AC-003 | REQ-003 | Given the new `.gitignore` rule, When a local skill link path is checked, Then git ignores it | `git check-ignore -q .dsh/skills/local-probe` exits 0. Observed: `exit=0`, and `git check-ignore -v` names `.gitignore:234:/.dsh/skills/local-*` (`evidence/checks.txt:9`, `evidence/checks.txt:12`) | Met | - |
| AC-004 | REQ-004 | Given `SYNC.md`, When each top-level `.dsh/` entry is searched in it, Then every entry is named with its mechanism and source | `ls .dsh` against `rg -q -F` over `.dsh/SYNC.md` in a loop that exits 0. Observed: `found` for `patches`, `README.md` and `SYNC.md`, then `exit=0`. The inventory table gives mechanism and source per entry (`evidence/checks.txt:25`, `.dsh/SYNC.md:22`) | Met | - |
| AC-005 | REQ-005 | Given the filled phase docs, When `validate.sh` runs on the phase folder with `--strict`, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict`. Observed: `RESULT: PASSED` on 2026-11-06 (`implementation-summary.md:138`) | Met | - |

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

All five criteria are met from captured output with no provider call. The OpenCode Go `baseURL` `https://opencode.ai/zen/go/v1` is still a placeholder and stays UNKNOWN until phase `013-dsh-live-contract-pin`. Whether either gateway accepts `max` reasoning on the wire is also unconfirmed until that keyed run. Every checklist item in `tasks.md` is verified.
<!-- /ANCHOR:closure -->

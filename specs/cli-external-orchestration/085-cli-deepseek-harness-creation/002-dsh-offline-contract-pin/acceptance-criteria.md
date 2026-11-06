---
title: "Acceptance Criteria: Phase 2: dsh-offline-contract-pin"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh offline contract pin acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin"
    last_updated_at: "2026-11-06T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked AC-001 to AC-006 Met with observed evidence"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "evidence/missing-credential.stdout.jsonl"
      - "evidence/dump-config-llmgateway.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-002-dsh-offline-contract-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: dsh-offline-contract-pin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin`
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
| AC-001 | REQ-001 | Given `dsh` on the path, When `dsh --version </dev/null` and the two `npm view` reads run, Then `evidence/version.txt` holds `0.2.2-rc.1` and `evidence/dist-tags.json` holds the integrity and the dist-tags | `cat evidence/version.txt` prints `0.2.2-rc.1` and `rg -c sha512- evidence/dist-tags.json` prints at least 1. Observed: `0.2.2-rc.1`, integrity `sha512-ijR9...Kpg==`, dist-tags `latest` and `next` both `0.2.2-rc.1`, `alpha` `0.2.2-alpha.3` (`evidence/version.txt:1`, `evidence/dist-tags.json:2`, `evidence/dist-tags.json:5`) | Met | - |
| AC-002 | REQ-002 | Given a draft route and a draft lineage patch, When `DSH_HOME=$(mktemp -d) dsh --profile headless --patch <draft-route> --patch <draft-lineage> --dump-config </dev/null` runs per route, Then `agent-default-model` names the route's provider and model, telemetry shows `mode: DISABLED` and `session-log-deepseek`, `goal-round-driver` and `plan-mode` are disabled | `rg` over each `evidence/dump-config-<route>.txt` for the provider, the model, `DISABLED` and the three disabled row ids. Observed: `agent-default-model` is `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, `session-telemetry-otel` has `mode: DISABLED`, and `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode` carry `disabled: true`. Both `.stderr.txt` files hold `exit=0` and no unmatched-target warning (`evidence/dump-config-llmgateway.txt:60`, `evidence/dump-config-llmgateway.txt:141`, `evidence/dump-config-opencode-go.txt:60`, `evidence/dump-config-opencode-go.txt:141`, `evidence/dump-config-llmgateway.stderr.txt:1`) | Met | - |
| AC-003 | REQ-003 | Given no key in the environment, When the keyless headless dispatch with `--json -` runs, Then it exits 1 and the last stdout line parses with `type` `error` or `final` | `cat evidence/exit.txt` prints 1 and the recorded `node -e` parse exits 0. Observed: `exit.txt` is `1`, the stdout has 6 events (session, 4 status, final), and `evidence/missing-credential.parse.txt` shows the last line `type` `final` with `reason.kind` `error` and code `MISSING_CREDENTIAL` for route `llmgateway`, parse `exit=0` (`evidence/exit.txt:1`, `evidence/missing-credential.stdout.jsonl:6`, `evidence/missing-credential.parse.txt:2`) | Met | - |
| AC-004 | REQ-005 | Given a stub relative plugin row in a draft patch, When the keyless dispatch runs with that patch, Then the plugin's marker file exists in the temp dir | `evidence/plugin-boot.txt` shows the marker path listed after the run. Observed: `stub-marker.txt` (33 bytes) in the temp cwd, content `applied 2026-11-06T04:10:23.687Z`, written by `./stub-plugin.mjs` before the provider error (`evidence/plugin-boot.txt:5`, `evidence/plugin-boot.txt:7`) | Met | - |
| AC-005 | REQ-004 | Given the `~/.dsh` listing saved before the probes, When it is listed again afterwards, Then the two listings are identical | `test ! -s evidence/dsh-home-diff.txt` exits 0. Observed: the file is 0 bytes and `diff scratch/dsh-home-before.txt scratch/dsh-home-after.txt` exits 0 (`implementation-summary.md:127`) | Met | - |
| AC-006 | REQ-006 | Given the filled phase docs, When `validate.sh` runs on the phase folder with `--strict`, Then it prints `RESULT: PASSED` | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict`. Observed: `RESULT: PASSED` on 2026-11-06 (`implementation-summary.md:129`) | Met | - |

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

All six criteria are met from captured output with no provider call. The `latest` dist-tag now points at `0.2.2-rc.1`, which leaves the pin unchanged because it names the literal version and integrity. The OpenCode Go `baseURL` in the draft is a placeholder, and the live endpoint stays UNKNOWN until phase `013-dsh-live-contract-pin`.
<!-- /ANCHOR:closure -->

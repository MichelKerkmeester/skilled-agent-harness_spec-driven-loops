---
title: "Goal: Phase 2: dsh-offline-contract-pin"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh offline contract pin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin"
    last_updated_at: "2026-11-06T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ticked every completion criterion with evidence"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-002-dsh-offline-contract-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: dsh-offline-contract-pin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Record the observed `dsh` 0.2.2-rc.1 headless contract without any provider call, so every later phase builds on captured output instead of documentation.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every probe runs with `DSH_HOME` set to a fresh `mktemp -d` and a temp cwd, never the repo root |
| D2 | Draft patches live in this phase's `scratch/` and no file outside the phase folder changes |
| D3 | The pin is the literal version plus integrity, never a dist-tag |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cat evidence/version.txt` in the phase folder prints `0.2.2-rc.1`
- [x] Each of the two `evidence/dump-config-*.txt` captures names its route's provider and model and shows telemetry `DISABLED`
- [x] `cat evidence/exit.txt` prints 1 and the last line of `evidence/missing-credential.stdout.jsonl` parses as JSON with `type` `error` or `final`
- [x] `evidence/plugin-boot.txt` lists the stub plugin's marker file after the keyless run
- [x] `evidence/dsh-home-diff.txt` is empty
- [x] `validate.sh` on the phase folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Credential-free contract pin | Done | Run 2026-11-06 by the orchestrating Claude session. All 13 captures exist under `evidence/` |
| Version and integrity | Done | `evidence/version.txt` is `0.2.2-rc.1`. `evidence/dist-tags.json` holds `sha512-ijR9...Kpg==` and dist-tags `latest` and `next` at `0.2.2-rc.1`, `alpha` at `0.2.2-alpha.3` |
| Route composition | Done | `agent-default-model` is `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, telemetry `mode: DISABLED`, `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode` disabled, both runs `exit=0` with no unmatched-target warning |
| Keyless failure shape | Done | `evidence/exit.txt` is `1`. The last of 6 stdout events is `final` with `reason.kind` `error` and code `MISSING_CREDENTIAL` for route `llmgateway`, parse `exit=0` in `evidence/missing-credential.parse.txt` |
| Relative plugin boot | Done | `evidence/plugin-boot.txt` lists `stub-marker.txt` holding `applied 2026-11-06T04:10:23.687Z` |
| Home isolation | Done | `evidence/dsh-home-diff.txt` is 0 bytes |
| Strict validation | Done | `validate.sh --strict` on the phase folder printed `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| `latest` dist-tag moved | `latest` now equals `0.2.2-rc.1`. D3 holds because the pin names the literal version and integrity |
| OpenCode Go endpoint is a placeholder | The draft `baseURL` `https://opencode.ai/zen/go/v1` was never called. The endpoint stays UNKNOWN until phase `013-dsh-live-contract-pin` |
| Route patch steers the run | The keyless run failed on route `llmgateway`, not `deepseek-official`, so a route patch fully repoints the default model |
| Stub patch file name | The plan named `plugin-stub.patch.yml`. The file shipped as `scratch/stub-boot.patch.yml` with the same purpose |
| Temp dirs left behind | The two temp homes in `scratch/tmpdirs.txt` and the keyless temp cwd still exist outside the repository. Removal is outside this phase folder |
<!-- /ANCHOR:log -->

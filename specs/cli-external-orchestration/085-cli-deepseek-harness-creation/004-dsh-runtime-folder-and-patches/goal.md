---
title: "Goal: Phase 4: dsh-runtime-folder-and-patches"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh runtime folder and patches goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches"
    last_updated_at: "2026-11-06T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ticked every completion criterion with evidence"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
      - "implementation-summary.md"
      - "evidence/checks.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-004-dsh-runtime-folder-and-patches"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: dsh-runtime-folder-and-patches

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the repository a `.dsh/` folder whose route and lineage patches send every dsh dispatch to a roster route with telemetry, session upload, goal rounds and plan mode off.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Patch files are `route-llmgateway-deepseek.patch.yml`, `route-opencode-go-deepseek.patch.yml` and `lineage.patch.yml` under `.dsh/patches/` |
| D2 | The YAML patches are written by `cli-codex gpt-6-luna xhigh fast` and the two docs by the orchestrating Claude session |
| D3 | Any unmatched-target warning on stderr fails the phase, never a pass with a warning |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] For each of the two route patches, `--dump-config` with the lineage patch under a disposable `DSH_HOME` names that route's provider and model and prints no unmatched-target warning
- [x] `rg -n -i 'api_?key|secret|token' .dsh/patches` matches only `apiKeyEnv` lines naming `LLMGATEWAY_API_KEY` or `OPENCODE_API_KEY`
- [x] `git check-ignore -q .dsh/skills/local-probe` exits 0
- [x] A loop over `ls .dsh` finds every top-level entry named in `.dsh/SYNC.md` and exits 0
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
| `.dsh/` folder and patches | Done | `ls .dsh` lists `patches`, `README.md` and `SYNC.md`. Three patches under `.dsh/patches/` (`evidence/checks.txt:15-19`) |
| Route composition | Done | `agent-default-model` is `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, both `reasoningEffort: max`. Each `.stderr.txt` holds only `exit=0`, so no unmatched-target warning (`evidence/dump-config-<route>.txt:60-62`) |
| Keyless boot per route | Done | Exit 1, last line `final` with code `MISSING_CREDENTIAL` naming that route, so the harness accepted the patched provider (`evidence/keyless-<route>.stdout.jsonl:6`) |
| Secret scan | Done | Only the two `apiKeyEnv` lines match (`evidence/checks.txt:3-6`) |
| Ignore rule | Done | `git check-ignore -q` exit 0, rule at `.gitignore:234` (`evidence/checks.txt:9-12`) |
| `SYNC.md` coverage | Done | Loop finds all three entries, exit 0 (`evidence/checks.txt:21-25`) |
| Strict validation | Done | `validate.sh --strict` on the phase folder printed `RESULT: PASSED` on 2026-11-06 |

### Deviations and findings

| Item | Note |
|------|------|
| D2 amended in practice | Codex wrote the draft rows and the `.gitignore` line. The orchestrating Claude session then added `compat.supportsDeveloperRole: false`, the per-model `reasoningEfforts` map (`off`, `high`, `max`) and `reasoningEffort: max` to both route patches. These lines are not codex output. Reason: the research recommends them (`../001-deep-research/research/research.md:182-186`), and a boot with them composed with exit 0 and reached `MISSING_CREDENTIAL` |
| Lineage disables four rows | Scope names three rows. The shipped patch also disables `command-goal`, carried over unchanged from the phase 002 draft, and composes cleanly |
| OpenCode Go endpoint is a placeholder | `https://opencode.ai/zen/go/v1` was never called. UNKNOWN until phase `013-dsh-live-contract-pin` |
| `max` on the wire unconfirmed | The config accepts `max`. Whether either gateway accepts it in a request is UNKNOWN until a keyed run |
| Command transcript | Added after the first closeout pass: `evidence/commands.txt` records the literal dsh command lines and their temp `DSH_HOME` |
| Checklist closed | T002, CHK-003, CHK-032 and CHK-051 verified by the orchestrating session on 2026-11-06 |
<!-- /ANCHOR:log -->

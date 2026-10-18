---
title: "Goal: Phase 8: doctor-and-ci"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "doctor and ci goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/008-doctor-and-ci"
    last_updated_at: "2026-10-18T12:45:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-doctor-and-ci"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: doctor-and-ci

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the repo a repeatable doctor battery and a CI workflow that prove, for each pinned OpenCode version, that every repo plugin loads and that the repo's skills are visible.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | The battery matches the requested family to the parsed major of each candidate binary, and it never infers a family from a binary name. |
| L2 | Amended: OpenCode 1.19.3 logs no plugin line, so there is no log window. The v1 legs are `debug config` discovery and an import harness that loads each plugin through its v1 entry (`scratch/decisions.txt` 2, from 001's decision change 1). |
| L3 | Amended: the v2 leg starts and stops its own private `serve` on a free loopback port with its own database and data folder, and never touches the shared service. SKIP means no v2 binary is installed (`scratch/decisions.txt` 3, from 001's decision change 3). |
| L4 | No leg reports PASS from a `debug config` read alone. |
| L5 | The route entry in `_routes.yaml` waits for the operator's decision on Q1. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1 --json` exits 0 with OpenCode 1.19.3 installed.
- [x] `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2 --json` exits 0 with OpenCode 2.0.32 installed (amended with L3: the battery starts its own private server).
- [x] The same battery run with `--root` pointed at a copy in which one repo plugin is broken exits 1 and names that plugin.
- [x] `/opt/homebrew/bin/actionlint .github/workflows/opencode-dual-version.yml` exits 0 with no output.
- [x] Each leg that reports PASS names an observed plugin load or an active plugin state, and the JSON summary shows it.
- [x] The process listing, which includes the shared v2 service, is the same before and after the battery runs, as the saved listings show.
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
| Planning documents filled | Done | `validate.sh --strict` output in the orchestrator report |
| Process listing before probes (T001) | Done | `scratch/process-before.txt` |
| v1 load trigger probe (T002) | Done | `scratch/probes/v1-trigger/`: no plugin log line on 1.19.3 (decision 2) |
| v2 service probe (T003) | Done | `scratch/probes/v2-private/`: private serve, 16 of 16 active (decision 3) |
| Decisions Q1 to Q9 (T004) | Done | `scratch/decisions.txt` 2 to 13 |
| Fixture suite red run (T006) | Done | `scratch/red-first-failures.txt`, 24 of 24 fail on a stub |
| Live runs (T015, T016) | Done | `scratch/live/battery-v1.json`, `battery-v2.json`, `battery-both-fix3.json`, exit 0 |
| Broken-copy run (T017) | Done | `scratch/live/broken-v1.json`, `broken-v2.json`, exit 1 naming the plugin |
| actionlint (T018) | Done | `scratch/static-checks.txt`, exit 0 |
| Doctor suite | Done | `scratch/run-all-after.txt`, 380 of 380 |
| Review | Done | `scratch/review-verify2-luna.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| v2 oracle against D4 | Resolved: the battery starts its own private `serve`, so the shared service is never touched. L3 amended (decision 3). |
| Retry rule | Resolved: two consecutive non-zero counts, at most 15 reads 2 s apart (decision 6). |
| v1 trigger | Resolved: 1.19.3 logs no plugin line and reports no broken plugin, so the v1 load leg is an import harness. L2 amended (decision 2). |
| Route assets | The route schema requires a `yaml:` asset, and the brief names none. The route entry is held under L5. Open question Q1. |
| Advisor bridge | Iteration-017 item 7 is not in the brief. Open question Q2. |
| Executors | The operator asked for DeepSeek wherever possible, so DeepSeek wrote the code and Luna reviewed it (decision 0). |
| Regression found | git-setup-check could not see the dualPlugin-wrapped git adapter, a phase 2 regression; fixed here (decision 12). |
| Piped stdout | OpenCode 1.19.3 truncates piped stdout at 65,536 bytes, so the collectors read files (decision 14). |
| Package names | Iteration-017 left the CI package names UNKNOWN. Iteration-015 F2 gives `opencode-ai` at `1.19.3` and `@opencode/cli` at `2.0.32`, and the spec uses them. |
<!-- /ANCHOR:log -->

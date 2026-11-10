---
title: "Tasks: Phase 2: dsh-offline-contract-pin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh offline contract pin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: dsh-offline-contract-pin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`E` is `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/`. `S` is the same phase's `scratch/`. Every task runs in the orchestrating Claude session with authoring mode `sk-code` (`sk-code-skilled` verification surface, shell) unless it names `system-spec-kit`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the `~/.dsh` listing before any probe (`S/dsh-home-before.txt`). Verify: `test -s S/dsh-home-before.txt` exits 0. Evidence: `S/dsh-home-before.txt` is 1219 bytes.
- [x] T002 Confirm no provider key is exported in the probe shell. Verify: `env | rg -c 'LLMGATEWAY_API_KEY|OPENCODE_API_KEY|DEEPSEEK_API_KEY'` prints 0. Evidence: the keyless run used `env -i` with only `PATH`, `HOME`, `DSH_HOME` and `DSH_STUB_MARKER`, and `E/missing-credential.stderr.txt` reports `LLMGATEWAY_API_KEY, which is not set`.
- [x] T003 [P] Draft `route-llmgateway-deepseek.patch.yml`, `route-opencode-go-deepseek.patch.yml`, `lineage.patch.yml` and `plugin-stub.patch.yml` with a stub relative plugin (`S/`). Verify: `ls S/*.patch.yml | wc -l` prints 4. Evidence: 4 patches exist. The stub patch shipped as `S/stub-boot.patch.yml` and inserts `./stub-plugin.mjs` (`S/stub-plugin.mjs`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record the version and registry pin (`E/version.txt`, `E/dist-tags.json`). Verify: `cat E/version.txt` prints `0.2.2-rc.1` and `rg -c sha512- E/dist-tags.json` prints at least 1. Evidence: version `0.2.2-rc.1`, integrity `sha512-ijR9...Kpg==`, dist-tags `latest` and `next` at `0.2.2-rc.1`, `alpha` at `0.2.2-alpha.3`.
- [x] T005 [P] Capture the headless help under a temp home (`E/headless-help.txt`). Verify: `rg -c -- '--approval-policy' E/headless-help.txt` prints at least 1. Evidence: the help lists `--json`, `--session-id`, `--permission-mode`, `--approval-policy` (`ask`, `never`), `--add-dir` and task `-` reading stdin.
- [x] T006 Capture `--dump-config` for each draft route composed with the draft lineage patch (`E/dump-config-llmgateway.txt`, `E/dump-config-opencode-go.txt`). Verify: each file names its route's provider and model and `rg -c 'DISABLED' <file>` prints at least 1. Evidence: `agent-default-model` reads `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, `session-telemetry-otel` reads `mode: DISABLED`, and both `.stderr.txt` files hold `exit=0` only.
- [x] T007 Run the keyless headless dispatch with the stub-plugin patch from a temp cwd (`E/missing-credential.stdout.jsonl`, `E/missing-credential.stderr.txt`, `E/exit.txt`). Verify: `cat E/exit.txt` prints 1. Evidence: `E/exit.txt` is `1` and stderr names `MISSING_CREDENTIAL` for route `llmgateway`.
- [x] T008 Record the plugin marker check (`E/plugin-boot.txt`). Verify: the file shows the marker path from `ls` after the keyless run. Evidence: `stub-marker.txt` is listed in the temp cwd and holds `applied 2026-11-06T04:10:23.687Z`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Parse the last stdout line of the keyless run. Verify: `tail -1 E/missing-credential.stdout.jsonl | node -e 'const e=JSON.parse(require("fs").readFileSync(0));process.exit(["error","final"].includes(e.type)?0:1)'` exits 0. Evidence: `E/missing-credential.parse.txt` records `{"type":"final","reasonKind":"error","code":"MISSING_CREDENTIAL"}` and `exit=0` over 6 event lines.
- [x] T010 Save the `~/.dsh` listing after the probes and diff it (`E/dsh-home-diff.txt`). Verify: `test ! -s E/dsh-home-diff.txt` exits 0. Evidence: `E/dsh-home-diff.txt` is 0 bytes and `diff S/dsh-home-before.txt S/dsh-home-after.txt` exits 0.
- [x] T011 Fill the phase results into the docs with `system-spec-kit` (`implementation-summary.md`, `acceptance-criteria.md`, `goal.md`). Verify: `validate.sh <phase folder> --strict` prints `RESULT: PASSED`. Evidence: the strict run on 2026-11-06 printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `E/` holds every capture named in `spec.md` Deliverables
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Frozen scope**: `../001-deep-research/research/phase-plan.md` section 4, phase `002-dsh-offline-contract-pin`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked by a missing binary or registry access is marked `[B]` with the failing command output in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (`rg -c '^\| REQ-' spec.md` prints 6). Evidence: prints 6
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] `command -v dsh` prints a path before T004 runs. Evidence: `/Users/michelkerkmeester/.local/bin/dsh` (spec.md Measured Behavior)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every probe command line in `implementation-summary.md` starts with `DSH_HOME=` or runs `--version` only. Evidence: every dsh probe there sets `DSH_HOME` to a temp dir, the keyless run through `env -i ... DSH_HOME=$T`
- [x] CHK-011 [P0] Each draft patch parses as YAML (`node -e` with the repo YAML parser, or `dsh --dump-config` exits 0 with it). Evidence: both `--dump-config` runs exited 0 with the route and lineage patches, and the stub patch loaded in the keyless run (marker written)
- [x] CHK-012 [P1] Each capture records its exit code. Evidence: `E/exit.txt`, `E/missing-credential.parse.txt` and both dump-config `.stderr.txt` files record theirs, and `E/commands.txt` records exit 0 for the version, both `npm view` reads and the help probe, rerun 2026-11-06
- [x] CHK-013 [P1] Draft patches use the documented `id`, `disabled`, `config` and `insert` grammar. Evidence: top-level YAML list of `- id:` rows with `config:` or `disabled: true`, and one `- insert:` row
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-004 met with the evidence file named in each row
- [x] CHK-021 [P0] The keyless run exits 1 and its last line parses
- [x] CHK-022 [P1] Each `--dump-config` capture shows no unmatched-target warning. Evidence: both `.stderr.txt` files hold only `exit=0`
- [x] CHK-023 [P1] The plugin marker exists after the keyless run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `rg -n -i 'sk-|api_?key=' E/` finds no credential value. Evidence: a key-shaped scan over `E/` and `S/` matched nothing (exit 1). `E/` names only the variable `LLMGATEWAY_API_KEY`, never a value
- [x] CHK-031 [P0] No probe reads or prints a `.env` file. Evidence: every probe ran from a temp cwd
- [x] CHK-032 [P1] The `~/.dsh` listing diff is empty
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same evidence files
- [x] CHK-041 [P1] Each probe command is recorded verbatim. Evidence: `E/commands.txt` holds the literal command line of every probe with its exit code, temp paths shown as `<tmp>`
- [x] CHK-042 [P2] Phase 003 can cite `E/headless-help.txt` for every flag it documents. Evidence: the file lists every headless flag the research named
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Draft patches live in `scratch/` only
- [x] CHK-051 [P1] Temp homes are outside the repository and removed after the run. Evidence: all temp dirs sat under `/var/folders/.../T/`, and the orchestrating session removed the two homes in `S/tmpdirs.txt`, the keyless temp cwd and the rerun dirs on 2026-11-06
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06. All items verified.
<!-- /ANCHOR:summary -->

---




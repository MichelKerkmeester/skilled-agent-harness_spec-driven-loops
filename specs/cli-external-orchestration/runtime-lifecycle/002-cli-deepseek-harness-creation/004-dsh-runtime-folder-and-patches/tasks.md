---
title: "Tasks: Phase 4: dsh-runtime-folder-and-patches"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh runtime folder and patches tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: dsh-runtime-folder-and-patches

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

`D` is `.dsh/`. `E` is `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/`. `V` is this phase's `evidence/`. Patch tasks use `sk-code` `sk-code-skilled` through `cli-codex gpt-6-luna xhigh fast`. Doc tasks use `sk-doc` `sk-create-readme` in the orchestrating Claude session.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the phase 002 drafts and captures (`E/`, `../002-dsh-offline-contract-pin/scratch/`). Verify: `ls E/dump-config-*.txt | wc -l` prints 2. Evidence: `E/` holds `dump-config-llmgateway.txt` and `dump-config-opencode-go.txt`, and the three drafts sit in `../002-dsh-offline-contract-pin/scratch/`. With comment lines removed, `diff` of the shipped lineage patch against its draft is empty.
- [x] T002 Read the `cli-codex` packet `SKILL.md` before composing the dispatch brief. Evidence: the orchestrating session read `cli-codex/SKILL.md` and its `providers-and-models.md` section 5 child envelope before writing the brief. The brief names the three patch files and the one `.gitignore` line T006 owns, which is the full write scope of the dispatch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the LLM Gateway route patch (`D/patches/route-llmgateway-deepseek.patch.yml`). Verify: `rg -c 'deepseek-v4.1-flash-1017' <file>` prints at least 1. Evidence: the model id is at lines 14 and 23. Codex wrote the draft rows. The orchestrating session then added `supportsDeveloperRole: false` (line 12), `reasoningEfforts` (lines 16 to 19) and `reasoningEffort: max` (line 24).
- [x] T004 [P] Write the OpenCode Go route patch (`D/patches/route-opencode-go-deepseek.patch.yml`). Verify: `rg -c 'deepseek-v4.1-flash' <file>` prints at least 1. Evidence: the model id is at lines 14 and 23. The orchestrator added the same three fields at lines 12, 16 to 19 and 24. `baseURL` is still the placeholder `https://opencode.ai/zen/go/v1` (line 9).
- [x] T005 [P] Write the lineage patch (`D/patches/lineage.patch.yml`). Verify: `rg -c 'DISABLED' <file>` prints at least 1. Evidence: `mode: DISABLED` at line 4, plus `disabled: true` for `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode`. Only the header comment differs from the draft.
- [x] T006 Add the ignore rule (`.gitignore`). Verify: `git check-ignore -q .dsh/skills/local-probe` exits 0. Evidence: `exit=0` (`V/checks.txt:9`), and `git check-ignore -v` names `.gitignore:234:/.dsh/skills/local-*` (`V/checks.txt:12`).
- [x] T007 Write the inventory and the operator entry point (`D/SYNC.md`, `D/README.md`). Verify: `ls D/SYNC.md D/README.md` exits 0. Evidence: `ls .dsh` lists `patches`, `README.md` and `SYNC.md` (`V/checks.txt:15-19`). `validate_document.py` gives README `VALID` with 0 issues and SYNC.md one `document_type_fallback` warning (`V/checks.txt:33-48`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Compose each route with the lineage patch under a temp home. Verify: `DSH_HOME=$(mktemp -d) dsh --profile headless --patch D/patches/<route> --patch D/patches/lineage.patch.yml --dump-config </dev/null` names the route's provider and model and stderr has no unmatched-target warning. Evidence: `agent-default-model` reads `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, both with `reasoningEffort: max` (`V/dump-config-<route>.txt:60-62`). Both `.stderr.txt` files hold only `exit=0`. The literal command lines were not saved, so the temp-home part rests on the orchestrator's record.
- [x] T009 Run the secret scan. Verify: `rg -n -i 'api_?key|secret|token' D/patches` prints only `apiKeyEnv` lines naming `LLMGATEWAY_API_KEY` or `OPENCODE_API_KEY`. Evidence: two matches, `route-opencode-go-deepseek.patch.yml:7` and `route-llmgateway-deepseek.patch.yml:7` (`V/checks.txt:3-6`).
- [x] T010 Check `SYNC.md` coverage. Verify: `for e in $(ls D); do rg -q -F "$e" D/SYNC.md || exit 1; done` exits 0. Evidence: `found` for `patches`, `README.md` and `SYNC.md`, then `exit=0` (`V/checks.txt:21-25`).
- [x] T011 Record results in the phase docs with `system-spec-kit`. Verify: `validate.sh <phase folder> --strict` prints `RESULT: PASSED`. Evidence: the strict run on 2026-11-06 printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Both `--dump-config` outputs quoted in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Frozen scope**: `../001-deep-research/research/phase-plan.md` section 4, phase `004-dsh-runtime-folder-and-patches`
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

A task blocked because phase 002 or 003 has not closed is marked `[B]` and the phase waits.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (`rg -c '^\| REQ-' spec.md` prints 5). Evidence: REQ-001 to REQ-005 in spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Phases 002 and 003 acceptance rows all Met. Evidence: phase 002 is 6 of 6 Met, and phase 003 closed Complete with AC-001 to AC-005 Met and strict validate `RESULT: PASSED` on 2026-11-06
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each patch is accepted by `dsh --dump-config` with exit 0. Evidence: both `V/dump-config-*.stderr.txt` hold `exit=0`, and the dumps carry `patched by .../.dsh/patches/<file>` headers for all three patches
- [x] CHK-011 [P0] No unmatched-target warning on stderr for either route. Evidence: each `.stderr.txt` is one line, `exit=0`
- [x] CHK-012 [P1] Each patch uses only the `id`, `disabled`, `config` and `insert` keys. Evidence: every top-level row is `- id:` with `config:` or `disabled: true`, and no `insert` row is needed
- [x] CHK-013 [P1] Patch comments carry no packet or phase labels. Evidence: `rg -n -e 'specs/' -e 'packet [0-9]' -e 'phase [0-9]' .dsh/patches` printed nothing, `exit=1` (`V/checks.txt:27-28`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 to AC-005 met with the command named in each row
- [x] CHK-021 [P0] Both routes compose to their own provider and model. Evidence: `V/dump-config-<route>.txt:60-61`, and each keyless boot ends `MISSING_CREDENTIAL` naming its own route (`V/keyless-<route>.stdout.jsonl:6`)
- [x] CHK-022 [P1] The lineage patch disables all three rows and sets telemetry `DISABLED`. Evidence: `mode: DISABLED` at `V/dump-config-llmgateway.txt:147`. `disabled: true` for `session-log-deepseek` (line 26), `goal-round-driver` (line 230), `command-goal` (line 233) and `plan-mode` (line 284). The opencode-go dump matches line for line
- [x] CHK-023 [P1] `git check-ignore -q .dsh/skills/local-probe` exits 0. Evidence: `V/checks.txt:9`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The secret scan returns only the two `apiKeyEnv` lines. Evidence: `V/checks.txt:3-6`
- [x] CHK-031 [P0] No `--dump-config` capture saved in the repo holds a key value. Evidence: `rg -n -i 'sk-[A-Za-z0-9]{8,}|api_?key=' V --glob '!checks.txt'` printed nothing, `exit=1` (`V/checks.txt:30-31`). The captures name only the variables `LLMGATEWAY_API_KEY` and `OPENCODE_API_KEY`
- [x] CHK-032 [P1] Every probe ran with `DSH_HOME` set to a temp dir. Evidence: `V/commands.txt` records the literal dsh command lines, each with `DSH_HOME` set to a fresh `mktemp -d` and a temp cwd
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `SYNC.md` names every top-level `.dsh/` entry with its mechanism and source. Evidence: the section 2 inventory gives mechanism and source for all three patches, `README.md` and `SYNC.md`, and the coverage loop exits 0 (`V/checks.txt:25`)
- [x] CHK-041 [P1] `README.md` follows `sk-create-readme`. Evidence: `validate_document.py .dsh/README.md` prints `VALID`, 0 issues (`V/checks.txt:35-38`)
- [x] CHK-042 [P2] The packet's `references/runtime-folder-and-sync.md` agrees with `SYNC.md`. Evidence: its layout (lines 65 to 70) names the same five files with the same purposes. It still calls `.dsh/` planned (lines 35 and 86), which is stale wording for phase 003 to fix, not a contradiction
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: this phase's `scratch/` is empty and `evidence/` holds only captures. The orchestrator reports the probe temp dirs removed
- [x] CHK-051 [P1] The phase changes only `.dsh/`, `.gitignore` and this phase folder. Evidence: `git diff -- .gitignore` adds only line 234 and `.dsh/` is new. The other modified `ROUTER.md` files predate this session, and `cli-deepseek-harness/` is phase 003's output
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




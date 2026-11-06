---
title: "Feature Specification: Phase 2: dsh-offline-contract-pin"
description: "Record the dsh 0.2.2-rc.1 headless contract from a disposable DSH_HOME without any provider call: version and integrity, help text, patch composition per route, the keyless failure shape and relative-plugin boot, so later phases build on observed behavior instead of documentation."
trigger_phrases:
  - "dsh offline contract pin"
  - "phase 2 dsh offline contract pin"
  - "credential-free dsh contract"
  - "dsh dump-config evidence"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: dsh-offline-contract-pin

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 15 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-cli-deepseek-harness-skill-packet |
| **Handoff Criteria** | `evidence/` holds the version, integrity, help text, one `--dump-config` capture per route, the keyless JSON failure and the plugin-boot marker, and the `~/.dsh` listing diff is empty |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Read-only probes of the installed `dsh` under disposable `DSH_HOME` directories, plus draft patches kept in this phase's `scratch/`. No file outside this phase folder changes and no provider is called.

**Dependencies**:
- `001-deep-research` (the synthesis in `research/research.md` and the frozen scope in `research/phase-plan.md`)

**Deliverables**:
- `evidence/version.txt`, `evidence/dist-tags.json`, `evidence/headless-help.txt`
- `evidence/dump-config-<route>.txt` for the LLM Gateway and OpenCode Go draft routes
- `evidence/missing-credential.stdout.jsonl`, `evidence/missing-credential.stderr.txt`, `evidence/exit.txt`
- `evidence/plugin-boot.txt` and the `~/.dsh` before and after listing diff
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Later phases write dsh patches, hard rules and an executor builder against a headless contract that no run has observed yet. The research read that contract from source and docs only, and the npm `next` and `latest` dist-tags moved during the run. A builder written against an unobserved contract can pass the wrong flags or accept a failed stream, and a probe that runs without `DSH_HOME` writes into the operator's `~/.dsh`. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/research.md:133-137]

### Purpose
The pinned version, integrity, help text, patch composition, keyless failure shape and relative-plugin boot are captured verbatim under `evidence/` so phases 003, 004, 006 and 008 cite observed output.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence
dist-tags.json
dsh-home-diff.txt
dump-config-llmgateway.stderr.txt
dump-config-llmgateway.txt
dump-config-opencode-go.stderr.txt
dump-config-opencode-go.txt
exit.txt
headless-help.txt
missing-credential.parse.txt
missing-credential.stderr.txt
missing-credential.stdout.jsonl
plugin-boot.txt
version.txt
exit=0
$ cat specs/cli-external-orchestration/085-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/exit.txt
1
exit=0
```
Every deliverable capture exists and the keyless run recorded exit 1 (checked 2026-11-06 after the probes). Before the probes the `evidence/` folder did not exist and `command -v dsh` printed `/Users/michelkerkmeester/.local/bin/dsh`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record `dsh --version`, the package integrity and the dist-tags of `@deepseek-ai/dsh@0.2.2-rc.1`.
- Capture `dsh --profile headless --help` and one `--dump-config` per draft route composed with a draft lineage patch.
- Run one keyless headless dispatch per the plan and record its stdout JSON, stderr and exit code.
- Prove a relative plugin row in a draft patch loads before the provider error by writing a marker file.
- Diff a `~/.dsh` listing taken before and after the probes to show no write escaped the disposable homes.

### Out of Scope
- Any keyed provider call - phase `013-dsh-live-contract-pin` owns it, gated on the operator key.
- Checked-in patches under `.dsh/` - phase `004-dsh-runtime-folder-and-patches` writes them from this evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-dsh-offline-contract-pin/evidence/*` | Create | Verbatim probe captures listed under Deliverables |
| `002-dsh-offline-contract-pin/scratch/*.patch.yml` | Create | Draft route, lineage and stub-plugin patches used only by the probes |
| `002-dsh-offline-contract-pin/{spec,plan,tasks,implementation-summary,acceptance-criteria,goal}.md` | Modify | Record results and close the phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `evidence/version.txt` holds `dsh --version </dev/null` output `0.2.2-rc.1`, and `evidence/dist-tags.json` holds `npm view @deepseek-ai/dsh@0.2.2-rc.1 dist.integrity` plus `npm view @deepseek-ai/dsh dist-tags --json` |
| REQ-002 | Per draft route, `DSH_HOME=$(mktemp -d) dsh --profile headless --patch <draft-route> --patch <draft-lineage> --dump-config </dev/null` shows `agent-default-model` with that route's provider and model, telemetry `mode: DISABLED`, and `session-log-deepseek`, `goal-round-driver` and `plan-mode` disabled, saved as `evidence/dump-config-<route>.txt` |
| REQ-003 | With no key in the environment, `printf 'Reply with the single word OK' \| DSH_HOME=<tmp> dsh --profile headless --patch <draft-route> --json -` exits 1 and its last stdout line parses as JSON with `type` `error` or `final`, with the `node -e` parse recorded |
| REQ-004 | `ls -R ~/.dsh` output is identical before and after the phase's commands and the empty diff is saved in `evidence/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A stub relative plugin row in a draft patch writes a marker file in the temp dir at `apply`, and `evidence/plugin-boot.txt` shows the marker exists after the keyless run |
| REQ-006 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase folder> --strict` prints `RESULT: PASSED` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cat evidence/version.txt` prints `0.2.2-rc.1` and `evidence/dist-tags.json` carries a `sha512-` integrity string.
- **SC-002**: `cat evidence/exit.txt` prints `1` and `tail -1 evidence/missing-credential.stdout.jsonl | node -e 'JSON.parse(require("fs").readFileSync(0))'` exits 0.
- **SC-003**: The saved `~/.dsh` listing diff is empty.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The installed `dsh` binary at `0.2.2-rc.1` | Without it nothing can be probed and phase 003 has no help text to check flags against | Record `command -v dsh` first and stop the phase if the version differs |
| Risk | A probe runs without `DSH_HOME` and writes profile files into `~/.dsh` | High | Prefix every command with `DSH_HOME=$(mktemp -d)` and diff the `~/.dsh` listing before and after |
| Risk | A key in the shell or a repo-root `.env` turns the keyless run into a paid call | Med | Run from a temp cwd with the key names unset and never read `.env` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each probe finishes inside 30 seconds. The deepseek lineage measured a 1.16 s profile boot for `dsh headless --help`.
- **NFR-P02**: The phase makes zero provider requests, shown by the keyless exit and `MISSING_CREDENTIAL` on stderr.

### Security
- **NFR-S01**: No API key, `.env` content or credential appears in `evidence/` or in any command line.
- **NFR-S02**: Every probe runs with a disposable `DSH_HOME` and a temp cwd so no repo `.env` loads.

### Reliability
- **NFR-R01**: Every capture is the verbatim command output with its exit code, never a paraphrase.
- **NFR-R02**: The pin names the literal version and integrity, never a dist-tag.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a headless run with an empty stdin task is a usage error. The phase records it only if it differs from the documented message.
- Maximum input: N/A. The probes send one fixed short task.
- Failure path: a missing key exits 1 with `dsh: MISSING_CREDENTIAL` on stderr and an `error` or `final` JSON line on stdout.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One phase folder, about ten evidence files, three draft patches |
| Risk | 12/25 | Home isolation and accidental key use, both mitigated by temp homes and cwd |
| Research | 6/20 | Contract already read from source in phase 001 |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a route patch repoint `agent-default-model` in `--dump-config`? Answered: yes. Both captures show the route's provider and model, and the keyless run failed on route `llmgateway`, not `deepseek-official`. The live request half stays with phase 013.
- Is the installed tarball byte-identical to the source clone at commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`? UNKNOWN. The phase recorded the integrity `sha512-ijR9...Kpg==` and no offline byte comparison ran.
<!-- /ANCHOR:questions -->

---


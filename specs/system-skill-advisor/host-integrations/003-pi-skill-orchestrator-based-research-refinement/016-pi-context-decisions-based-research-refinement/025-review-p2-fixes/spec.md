---
title: "Feature Specification: Fix the ten P2 advisories from the lane removal deep review"
description: "The 024 lane removal deep review returned CONDITIONAL with ten P2 advisories and one deferred search item. This packet fixes the three residue-tool defects with tests, states the gate's limits in its docs, and makes the 024 completion metadata match its evidence."
trigger_phrases:
  - "review p2 fixes"
  - "fix the ten p2 advisories from the lane"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fix the ten P2 advisories from the lane removal deep review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/497-ollama-lane-removal` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 25 |
| **Predecessor** | 024-ollama-lane-removal, whose `review/review-report.md` is the source |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the follow-up `/deep:review` verdict is recorded, and the work is committed on `worktrees/497-ollama-lane-removal` without a merge to main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 024 deep review (`../024-ollama-lane-removal/review/review-report.md`, verdict CONDITIONAL) found no P0 or P1 defect and ten P2 advisories. The residue tool can delete a regular file that `HF_EMBED_SERVER_URL` names, adds no note when the dotenv parser rejects a line, and misses a model server whose script path contains a space. Its docs say the gate runs on every push and do not say that an allowlist row exempts a whole file. The 024 parent goal, phase 005 and two checklists still read unstarted, Blocked or unevidenced.

### Purpose
Each advisory closes with a change that a command can check, and the 024 completion metadata matches its evidence, so a follow-up review can move the verdict toward PASS.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git rev-parse --short HEAD
bf3bca7a8b1

$ node -e "import('./.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs').then(m=>console.log(m.runsModelServer('/usr/local/bin/node /Users/x/My Repo/.skilled/bin/hf-model-server.cjs'), m.runsModelServer('/usr/local/bin/node /Users/x/MyRepo/.skilled/bin/hf-model-server.cjs')))"
false true

$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs repo --json
exit 0; counts parsed from the JSON output:
{"allowlistRows":47,"allowlistRowsMatched":47,"allowlisted":47,"files":47,"identifier":38,"live":0,"path":0,"prose":13,"symlink":0}

$ sed -n 1,6p .github/workflows/advisory-checks.yml
name: Advisory Checks
on:
  push:
    branches: [main, 'skilled/**']
  pull_request:
  workflow_dispatch:
```
The first `runsModelServer` call is the R1-P2-001 defect: a checkout path with a space returns `false`. The repo-mode counts show the allowlist as it stands before this packet, 47 of 47 rows matched with no live hit.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make the residue check list an extra server file named by an explicit address only when it is a socket, and note each regular file it skips (R2-P2-001).
- Add a note to M7 when a dotenv file holds lines the parser rejects, and leave the M7 status as it is (R9-P2-001).
- Recognize a model-server script path that contains a space, and reject a command whose first script is another file (R1-P2-001).
- Reword the every-push claim at three sites, state the whole-file allowlist limit in the catalog page and the tool's header, and drop the line numbers from 32 allowlist reasons (R3-P2-003, R7-P2-001, R1-P2-002, R4-P2-001).
- Close the completion drift: tick the 024 goal criteria that hold, close phase 005 with its T053 and AC-014 evidence, and add evidence to 23 checked checklist rows (R3-P2-001, R3-P2-002, R10-P2-001).

### Out of Scope
- Changing the advisory-checks trigger. The gate runs on `push` to `main` and `skilled/**` plus `pull_request`; the packet rewords the claim and leaves the trigger alone, because the review's fix for R3-P2-003 is a wording fix.
- Setting M7 to NOT_CHECKED on a rejected dotenv line, which the review's R9-P2-001 fix suggests. In `machineExitCode` in `sweep-lane-residue.mjs`, NOT_CHECKED exits 2, so `/doctor:update apply` would fail for any `.env` with one odd line, and the lane code that read those keys is gone. A note keeps the status and names the file.
- Per-term allowlist rows, the first option in the review's R1-P2-002 fix. The review names the documentation option as sufficient, and this packet takes it.
- Closing the deferred search item SL4-005 with this packet's fixtures alone. The follow-up `/deep:review` decides it.
- Running `npm ci`. That install is the operator's (005 T053), and the packet records the operator's report rather than running it.
- Committing, pushing or merging. The implementation run commits on `worktrees/497-ollama-lane-removal`; this packet writes only its four planning documents.

### Files to Change
The rows below are the planned edits for the implementation run. The write scope of this packet is its four planning documents.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` | Modify | Socket-only rule for extra server names in `checkModelServer`, the note in `checkDotenv`, the script-path match in `nodeScriptOf`, and the header wording for decisions 3 and 7 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Modify | Real-socket fixture, regular-file case, dotenv bad-line case, and the script-match table |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Modify | Remove line numbers from 32 reasons; the 47 paths stay |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md` | Modify | Reword the every-push line and state the whole-file allowlist limit |
| `.github/workflows/advisory-checks.yml` | Modify | Comment lines 21 to 23 only; the trigger block stays as it is |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | Reword line 25 to the push branch filter. Added during implementation, since it held the same every-push claim |
| `generate-trigger-index.mjs` run | Regenerate | Last write: `runtime/data/trigger-index.json` and its three fixture outputs |
| `../024-ollama-lane-removal/008-cleanup-wiring-and-gating/plan.md` | Modify | Reword line 375 |
| `../024-ollama-lane-removal/goal.md` | Modify | Tick the criteria that hold at lines 88 to 92; append one Complete row through `goal.cjs packet-log` |
| `../024-ollama-lane-removal/005-shared-embeddings-package/` | Modify | Close T053 and AC-014; Blocked wording becomes Complete in five documents. The follow-up review fixes then tick the six goal criteria and name phase commit `1f85a9dd6dd` in T054 |
| `../024-ollama-lane-removal/spec.md` | Modify | Status and phase-map row 5 read Complete |
| `../spec.md` (016 parent) | Modify | Row 24 reads Complete; add row 25 for this packet |
| `../024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md` and `../024-ollama-lane-removal/006-prose-docs-and-changelogs/tasks.md` | Modify | Evidence clauses on 12 and 11 checked CHK rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The residue check lists an extra file named by an explicit server address only when `lstat` reports a socket. A regular file there is skipped and noted, and the four fixed names keep today's behavior (R2-P2-001) |
| REQ-002 | When `env-secret.cjs keys` reports `valid: false` for a dotenv file, M7 adds a note that names the file. Its status stays as it was, and no value is read into the output (R9-P2-001) |
| REQ-003 | `runsModelServer` returns true for a model-server command whose script path contains a space, and false for a command whose first script is another file (R1-P2-001) |
| REQ-004 | Every gate in plan.md section 5 passes on the final state, and each result is read from its output and exit status, including the comment-hygiene check |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Three sites say the gate runs on every pull request and on pushes to `main` and `skilled/**`. The trigger itself is unchanged (R3-P2-003, R7-P2-001) |
| REQ-006 | The catalog page and the tool's header state that an exact-path allowlist row exempts the whole file (R1-P2-002) |
| REQ-007 | The 32 allowlist reasons that cite line numbers drop them, and all 47 paths stay unchanged (R4-P2-001) |
| REQ-008 | The 024 parent goal ticks the criteria that hold and logs one Complete progress row through `goal.cjs packet-log` (R3-P2-001) |
| REQ-009 | Phase 005 closes T053 and AC-014 with the evidence in plan.md section 6, and the 005 documents, the 024 parent and 016 row 24 read Complete (R3-P2-002) |
| REQ-010 | Each checked CHK row in 001 and 006 that lacks evidence gains an Evidence clause that names a file line or a command (R10-P2-001) |
| REQ-011 | The 016 phase map lists this packet as row 25, beside rows 23 and 24 |
| REQ-012 | The deferred search item SL4-005 is decided by the follow-up `/deep:review`, not by this packet's fixtures alone |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The residue tool's Vitest file, the gate test and the repo-mode run all exit 0 on the final state, the repo run matches 47 of 47 allowlist rows, and the planted-term fixture exits 1.
- **SC-002**: The measured `runsModelServer` command prints `true true` after the fix, and a regular text file named by an explicit address is still on disk after an apply run.
- **SC-003**: `validate.sh --strict` prints `RESULT: PASSED` for 024 recursively, for 025 and for 016.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `env-secret.cjs keys` returns `valid` (`.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs`, `listKeys`) | Without it the M7 note cannot be produced | The field is present in `listKeys` today; the dotenv test fails loudly if it is ever absent |
| Dependency | The operator's `npm ci --offline` in the three packages (005 T053) | Phase 005 stays Blocked | This packet records the operator's report for the install's exit status and observes the other clauses itself |
| Risk | A new lane term outside an allowlisted file flips repo mode to exit 1 | High | Each new sentence outside the allowlist is checked against `IDENTIFIER_TERMS` and `PROSE_TERMS` first; new test strings live only in the allowlisted test file |
| Risk | A strict validate run on a Draft packet auto-repairs metadata outside this packet | Med | Run 024 and 016 with `SPECKIT_DRAFT_AUTO_REPAIR=0`; run 025 before the index regeneration |
| Risk | A folder that holds only a skipped regular file is still treated as the socket folder | Low | The socket-folder rule keeps a folder that holds anything else, and the regular-file case checks that the folder survives |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A machine-mode run starts no more processes than it does today. It makes two new filesystem calls: an `lstat` on each explicit extra server name, and the `fs.statSync` in `isFileOnDisk`. `nodeScriptOf` makes that `statSync` only when the first script word is an absolute path with no script extension. `checkModelServer` reads every node process through `nodeScriptOf` once, and each process it reads as a model server twice more for ownership, so the call can run three times for one server process.
- **NFR-P02**: The `nodeScriptOf` change scans the words of one command line once, so its cost is linear in the length of that line.

### Security
- **NFR-S01**: Apply deletes no regular file named by an explicit server address. Only a socket from that address, or one of the four fixed names, is deletable.
- **NFR-S02**: M7 prints a file path for a rejected line and never a value or the line's text.

### Reliability
- **NFR-R01**: A rejected dotenv line changes neither the M7 status nor the exit code of machine mode.
- **NFR-R02**: A command line with no script word returns null from `nodeScriptOf` and false from `runsModelServer`, with no exception.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an address that names a missing path adds nothing, as it does today, and a socket folder that is empty is still listed.
- Maximum input: an address that names a fixed server file keeps the fixed-name rule, and the `Set` of names lists it once.
- Failure path: a folder that holds only a skipped regular file is not listed as the socket folder, because it is not empty, so the file stays on disk.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 25 files: one tool, one test file, one allowlist, two docs, one workflow comment, the 024, 005 and 016 metadata, two checklists and four generated index outputs |
| Risk | 12/25 | The apply path deletes files, and repo mode gates every push and pull request |
| Research | 4/20 | The 024 review located each defect at file and line, and the reproduction is one command |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the follow-up `/deep:review` accept the real-socket fixture as closing SL4-005? The registry record (`../024-ollama-lane-removal/review/deep-review-findings-registry.json`, id SL4-005) carries class `fixture_realism` and evidence `sweep-lane-residue.vitest.ts:175`, and it does not describe a plain-file socket. The review decides.
- Is the operator's report that `npm ci --offline` exited 0 in each of the three packages enough to tick T053? This packet observes the absence checks and runs the typecheck and shared tests itself, but it does not observe the install's exit status.
<!-- /ANCHOR:questions -->

---

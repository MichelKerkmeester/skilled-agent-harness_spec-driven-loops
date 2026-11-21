---
title: "Deep Review Strategy: Ollama lane removal"
description: "Session tracking for the ten-iteration deep review of the 024 lane removal epic."
trigger_phrases:
  - "ollama lane removal deep review"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review: `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal` (spec-folder). The Ollama and embedding semantic lane removal epic: eight phases (001 residue check and cleanup tool, 002 doctor surface, 003 lane feeders, 004 lane core, 005 shared embeddings package, 006 prose docs and changelogs, 007 generated surfaces, 008 cleanup wiring and gating) plus two alignment passes, on branch `worktrees/497-ollama-lane-removal` against merge-base `bf6806ad4b3`. Scope is the packet docs plus the 292 surviving files the branch changed outside `specs/` (91 files were deleted).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- History packets under `specs/` other than 024 (decision D1 keeps them as history, outside the residue check).
- The merge decision and the state of the operator's own machine (D2: nothing merges or pushes; D6: apply never runs on the operator's machine).
- Re-litigating the frozen decisions D1 to D7 in `024-ollama-lane-removal/goal.md` and `decision-record.md`, except where code contradicts them.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: run all 10 iterations; convergence is telemetry only.
- Max duration 360 minutes, 30 minutes per dispatch.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Iteration 10: parsing each AC table by column and grepping checked `CHK-` rows for a missing `Evidence:` clause measured checklist evidence for all eight phases in two calls. Each evidence-less test claim was then confirmed against the vitest file before it was reported.
- Iteration 9: calling the exported pure parser on an in-memory string, after the secret guard refused a temp dotenv file, proved the M7 false-absent case without touching any dotenv file.
- Iteration 8: tracing each retired identifier (`MEMORY_DB_PATH`, `runtimeLaneHealth`, `SCHEMA_VERSION`) from producer to consumer and diffing it against the merge base separated real leftovers from surviving mechanisms in about four calls.
- Iteration 7: checking each catalog and playbook sentence against one code anchor (exit constants, `INDEX_OUTPUTS`, `askFirstOf`, `VALUE_FLAGS`, `lane-registry.ts`) and diffing the workflow against the merge base separated wording the epic added from triggers that were already there.
- Iteration 6: diffing every out-of-tool shell, hook and ignore file against the merge base settled their security delta in one call. Listing every `spawnSync`, `rmSync` and `process.kill` site in the tool first bounded the destructive surface before reading any of it.
- Iteration 4: resolving every line number an allowlist reason cites against the tip file showed the reasons hold today but are unchecked; diffing the scorer registry against `main` separated pre-existing comment drift from drift the removal introduced.
- Iteration 3: re-running each child's Met grep at the tip separated point-in-time rows (scoped to the phase commit) from claims that should still hold, and comparing completion checkboxes with `git log` exposed stale state.
- Iteration 2: probing `resolveModelServerDirs` plus `checkModelServer` with a temp file proved the explicit-address delete path without running apply.
- Iteration 1: running the tool live (`repo --json`) plus calling its exported helpers directly (`runsModelServer`) turned hypotheses into observed results cheaply.
- Iteration 5: binding a real Unix socket in a temp folder and passing it to `checkModelServer` and `resolveContainedTarget` closed the socket-fixture question in one call. Diffing the agent folders against the merge base settled `agent_cross_runtime` without reading any mirror.

---

## 9. WHAT FAILED
- Iteration 10: a plain `| AC-` grep counted each table's `AC-ID` header as a row; parse by column instead.
- Iteration 9: the carried focus assumed a dotenv rewrite path; none exists, since apply only reports M7 keys. The end-to-end `checkDotenv` probe on a temp root was blocked by the secret guard, so its ABSENT status is read from `statusOf`, not observed.
- Iteration 8: none. The dotenv rewrite path for `LANE_ENV_KEYS` was not traced within budget and is deferred to the next focus.
- Iteration 7: none. The vitest cases were checked by `describe` name, not run.
- Iteration 6: none. The shared-model DELETE was read from code, not sent, and the missing-`node:sqlite` case was read from code, not probed.
- Iteration 5: searching on deleted-file stems was noisy, because generic stems such as `retry`, `profile` and `factory` hit unrelated files. An exact import-path search was what actually answered the question.
- Iteration 4: the socket-fixture realism question was only partly answered; which test binds a real socket was not traced within budget.
- Iteration 3: whether the operator ran `npm ci` for 005 could not be confirmed; no packet row records it, and absent `@huggingface` folders fit either reading.
- Iteration 2: none; apply itself was not run, so the final `rmSync` on the explicit-address file is read from code (`deleteServerFile` to `deleteContained`), not observed.
- Iteration 1: the deleted model-server supervisor cannot be read, so the spawn shape M4 assumes is inferred from a code comment.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A DB schema-version regression that would keep a pre-removal database with `vec_metadata` tables: ruled out (merge base `SCHEMA_VERSION = 1`, tip `= 2`; `readOutdatedSchemaVersion` condemns `< 2`, `skill-graph-db.ts:298-311`). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A DB schema-version regression that would keep a pre-removal database with `vec_metadata` tables: ruled out (merge base `SCHEMA_VERSION = 1`, tip `= 2`; `readOutdatedSchemaVersion` condemns `< 2`, `skill-graph-db.ts:298-311`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A DB schema-version regression that would keep a pre-removal database with `vec_metadata` tables: ruled out (merge base `SCHEMA_VERSION = 1`, tip `= 2`; `readOutdatedSchemaVersion` condemns `< 2`, `skill-graph-db.ts:298-311`).

### A dotenv rewrite that corrupts comments, quoting or repeated keys: there is no rewrite (`sweep-lane-residue.mjs:1981-1983`). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A dotenv rewrite that corrupts comments, quoting or repeated keys: there is no rewrite (`sweep-lane-residue.mjs:1981-1983`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dotenv rewrite that corrupts comments, quoting or repeated keys: there is no rewrite (`sweep-lane-residue.mjs:1981-1983`).

### A false-claim finding for 001 CHK-022 and CHK-023: all four cases exist in the vitest file, so only the missing evidence pointer is reported. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A false-claim finding for 001 CHK-022 and CHK-023: all four cases exist in the vitest file, so only the missing evidence pointer is reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A false-claim finding for 001 CHK-022 and CHK-023: all four cases exist in the vitest file, so only the missing evidence pointer is reported.

### A new finding for 005 AC-014 being Unmet: it is accurate, and the gap around it is already R3-P2-002. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A new finding for 005 AC-014 being Unmet: it is accurate, and the gap around it is already R3-P2-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding for 005 AC-014 being Unmet: it is accurate, and the gap around it is already R3-P2-002.

### A new finding for the parent goal's unchecked criteria: already R3-P2-001. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A new finding for the parent goal's unchecked criteria: already R3-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding for the parent goal's unchecked criteria: already R3-P2-001.

### Agent or mirror lane residue: none, and no agent file changed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Agent or mirror lane residue: none, and no agent file changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Agent or mirror lane residue: none, and no agent file changed.

### Catalog exit-2 wording disagreeing with parse-error handling: ruled out (`:2186-2188`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Catalog exit-2 wording disagreeing with parse-error handling: ruled out (`:2186-2188`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catalog exit-2 wording disagreeing with parse-error handling: ruled out (`:2186-2188`).

### Catalog lane weights drifting from the registry: ruled out (`lane-registry.ts:9-12`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Catalog lane weights drifting from the registry: ruled out (`lane-registry.ts:9-12`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catalog lane weights drifting from the registry: ruled out (`lane-registry.ts:9-12`).

### CI privilege or supply-chain exposure in the lane-residue job: read-only token, SHA-pinned actions, no install. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: CI privilege or supply-chain exposure in the lane-residue job: read-only token, SHA-pinned actions, no install.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CI privilege or supply-chain exposure in the lane-residue job: read-only token, SHA-pinned actions, no install.

### Command injection through env or CLI values into child processes: ruled out, because every `spawnSync` takes an argument array with no shell (`:428`, `:1223`, `:1490`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Command injection through env or CLI values into child processes: ruled out, because every `spawnSync` takes an argument array with no shell (`:428`, `:1223`, `:1490`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command injection through env or CLI values into child processes: ruled out, because every `spawnSync` takes an argument array with no shell (`:428`, `:1223`, `:1490`).

### Dangling imports of the deleted shared embeddings, retry and embedder modules: none. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Dangling imports of the deleted shared embeddings, retry and embedder modules: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dangling imports of the deleted shared embeddings, retry and embedder modules: none.

### Dead `runtimeLaneHealth` plumbing after the lane removal: ruled out (`advisor-recommend.ts:87-97`, `fusion.ts:259-283`). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Dead `runtimeLaneHealth` plumbing after the lane removal: ruled out (`advisor-recommend.ts:87-97`, `fusion.ts:259-283`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead `runtimeLaneHealth` plumbing after the lane removal: ruled out (`advisor-recommend.ts:87-97`, `fusion.ts:259-283`).

### Ephemeral ids in code comments of the residue tool: ruled out (M-ids are output ids). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Ephemeral ids in code comments of the residue tool: ruled out (M-ids are output ids).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ephemeral ids in code comments of the residue tool: ruled out (M-ids are output ids).

### Infinite recursion in `initDb`'s post-open discard: `removeOutdatedDatabase` throws if `rmSync` fails, so the retry cannot loop on a file it could not delete. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Infinite recursion in `initDb`'s post-open discard: `removeOutdatedDatabase` throws if `rmSync` fails, so the retry cannot loop on a file it could not delete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Infinite recursion in `initDb`'s post-open discard: `removeOutdatedDatabase` throws if `rmSync` fails, so the retry cannot loop on a file it could not delete.

### Launcher still forwarding retired env keys: ruled out (allowlist filter at `:286-288`, plus the test at `launcher-bootstrap.vitest.ts:172-186`). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Launcher still forwarding retired env keys: ruled out (allowlist filter at `:286-288`, plus the test at `launcher-bootstrap.vitest.ts:172-186`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Launcher still forwarding retired env keys: ruled out (allowlist filter at `:286-288`, plus the test at `launcher-bootstrap.vitest.ts:172-186`).

### Missing playbook coverage for the lane cleanup step: covered at steps 54 and 75. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Missing playbook coverage for the lane cleanup step: covered at steps 54 and 75.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing playbook coverage for the lane cleanup step: covered at steps 54 and 75.

### Monolithic module as a maintainability defect: ruled out (sectioned, bounded function sizes). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Monolithic module as a maintainability defect: ruled out (sectioned, bounded function sizes).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Monolithic module as a maintainability defect: ruled out (sectioned, bounded function sizes).

### Path escape through intermediate symlinks in a multi-segment delete: ruled out (`:1650-1662`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Path escape through intermediate symlinks in a multi-segment delete: ruled out (`:1650-1662`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path escape through intermediate symlinks in a multi-segment delete: ruled out (`:1650-1662`).

### Playbook expecting a shared-model question with the server down: ruled out (`askFirstOf`, `:1454-1458`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Playbook expecting a shared-model question with the server down: ruled out (`askFirstOf`, `:1454-1458`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Playbook expecting a shared-model question with the server down: ruled out (`askFirstOf`, `:1454-1458`).

### Real-socket versus regular-file mismatch in M4 detection and apply: ruled out by a live probe (lstat plus rmSync are type-agnostic). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Real-socket versus regular-file mismatch in M4 detection and apply: ruled out by a live probe (lstat plus rmSync are type-agnostic).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Real-socket versus regular-file mismatch in M4 detection and apply: ruled out by a live probe (lstat plus rmSync are type-agnostic).

### Regex metacharacter drift between git ERE and JavaScript for the vocabularies: every term is a literal; `escapeRegExp` is used on the JS side. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Regex metacharacter drift between git ERE and JavaScript for the vocabularies: every term is a literal; `escapeRegExp` is used on the JS side.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regex metacharacter drift between git ERE and JavaScript for the vocabularies: every term is a literal; `escapeRegExp` is used on the JS side.

### Removing `MEMORY_DB_PATH` breaking another tool: no live reader remains (search above). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Removing `MEMORY_DB_PATH` breaking another tool: no live reader remains (search above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing `MEMORY_DB_PATH` breaking another tool: no live reader remains (search above).

### Removing a populated `--socket-dir` folder: ruled out, because `rmdirSync` is non-recursive. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Removing a populated `--socket-dir` folder: ruled out, because `rmdirSync` is non-recursive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing a populated `--socket-dir` folder: ruled out, because `rmdirSync` is non-recursive.

### Secret exposure through M7: only key names leave the dotenv CLI. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secret exposure through M7: only key names leave the dotenv CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret exposure through M7: only key names leave the dotenv CLI.

### Security regression in the edited shell, hook and ignore files: ruled out by reading each diff against the merge base. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Security regression in the edited shell, hook and ignore files: ruled out by reading each diff against the merge base.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Security regression in the edited shell, hook and ignore files: ruled out by reading each diff against the merge base.

### Shadow-weight sum drop (1.00 to 0.95) as a correctness defect: no runtime code reads the shadow weights other than the registry and its env-override test. Nothing depends on them adding up to 1. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Shadow-weight sum drop (1.00 to 0.95) as a correctness defect: no runtime code reads the shadow weights other than the registry and its env-override test. Nothing depends on them adding up to 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shadow-weight sum drop (1.00 to 0.95) as a correctness defect: no runtime code reads the shadow weights other than the registry and its env-override test. Nothing depends on them adding up to 1.

### SIGTERM to another checkout's or another user's model server: ownership compares real script folders; another user's process yields EPERM and is recorded as failed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: SIGTERM to another checkout's or another user's model server: ownership compares real script folders; another user's process yields EPERM and is recorded as failed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SIGTERM to another checkout's or another user's model server: ownership compares real script folders; another user's process yields EPERM and is recorded as failed.

### SSRF or credential leak through the Ollama host value: ruled out, because only the origin is used, the body is fixed, the host is operator-chosen and named in the question (`:826-839`, `:1789-1801`). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: SSRF or credential leak through the Ollama host value: ruled out, because only the origin is used, the body is fixed, the host is operator-chosen and named in the question (`:826-839`, `:1789-1801`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SSRF or credential leak through the Ollama host value: ruled out, because only the origin is used, the body is fixed, the host is operator-chosen and named in the question (`:826-839`, `:1789-1801`).

### Stale weight constants after the lane removal: ruled out (single source in `lane-registry.ts`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Stale weight constants after the lane removal: ruled out (single source in `lane-registry.ts`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale weight constants after the lane removal: ruled out (single source in `lane-registry.ts`).

### Symlink redirection of any apply delete: refused at the target and, for server files, at the folder (`isSymlink(dir)`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Symlink redirection of any apply delete: refused at the target and, for server files, at the folder (`isSymlink(dir)`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Symlink redirection of any apply delete: refused at the target and, for server files, at the folder (`isSymlink(dir)`).

### The "three sidecar outputs" count: ruled out (`:175-180`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The "three sidecar outputs" count: ruled out (`:175-180`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The "three sidecar outputs" count: ruled out (`:175-180`).

### The `SKILLED_CI_FRESHNESS` gate switch on a "blocking" job: a recorded decision in `008/plan.md:372-377` and the workflow README. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The `SKILLED_CI_FRESHNESS` gate switch on a "blocking" job: a recorded decision in `008/plan.md:372-377` and the workflow README.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `SKILLED_CI_FRESHNESS` gate switch on a "blocking" job: a recorded decision in `008/plan.md:372-377` and the workflow README.

### Unused allowlist rows silently passing: the current tip has 0 unused rows (reported in `unusedAllowlistRows`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Unused allowlist rows silently passing: the current tip has 0 unused rows (reported in `unusedAllowlistRows`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unused allowlist rows silently passing: the current tip has 0 unused rows (reported in `unusedAllowlistRows`).

### Value exposure through M7: only key names cross the CLI boundary (`listKeys` returns `entries.map(({ key }) => key)`). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Value exposure through M7: only key names cross the CLI boundary (`listKeys` returns `entries.map(({ key }) => key)`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Value exposure through M7: only key names cross the CLI boundary (`listKeys` returns `entries.map(({ key }) => key)`).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
[None yet]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none. This is the final iteration under the cap and all four dimensions are covered. - Focus area: synthesis. Carry 10 active P2 findings, with no P0 or P1. - Reason: max-iterations stop policy reached. - Rotation status: all dimensions complete. Core protocols `spec_code` and `checklist_evidence` both reached pass. - Blocked/productive carry-forward: R3-P2-001 and R3-P2-002 are the packet-state findings an operator closure pass should settle together with R10-P2-001. - Required evidence: none further. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior work on this target, from the packet's own docs:
- `goal.md`: objective and frozen decisions D1 to D7; all five completion criteria were met at `ea291bdaabc`.
- `decision-record.md`: operator decisions Q001 to Q006 and the later goal amendments.
- `008-cleanup-wiring-and-gating/implementation-summary.md`: the `alignment-pass` section lists every alignment finding with its verdict.
- Earlier gates at the tip: recursive strict validate 9/9 PASSED, residue repo mode exit 0 with 47/47 allowlist rows, planted fixture exit 1, fixture machine mode exit 1 then 0 after apply, advisor suite 2438 passed.

### Bounded Context Snapshot

- Target pointers: `sweep-lane-residue.mjs` and `fixtures/lane-residue-allowlist.json`; advisor runtime under `.skilled/skills/system-skill-advisor/runtime/`; doctor commands under `.skilled/commands/doctor/`; `doctor-update-apply.yaml`; `.github/workflows/advisory-checks.yml` lane-residue job; changelogs under `.skilled/changelog/` and skill changelogs.
- Behavior claims: each child's `acceptance-criteria.md`; repo mode exits 0, planted term exits 1, malformed index shape exits 2; refused flags exit 64; cleanup asks about the shared model every run and stores no answer.
- Reuse and conventions: allowlist rows are exact paths; comment hygiene bans packet ids in code comments.
- Review risks and gaps: 91 deleted files are not in scope as files, so dangling references to them must be searched for; the advisor latency test is load-sensitive.

resource-map.md not present; skipping coverage gate

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/decision-record.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/001-residue-check-and-cleanup-tool/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/005-shared-embeddings-package/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/006-prose-docs-and-changelogs/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/007-generated-surfaces/goal.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/spec.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/plan.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/tasks.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/acceptance-criteria.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/implementation-summary.md | - | - | - | pending |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating/goal.md | - | - | - | pending |
| .env.example | - | - | - | pending |
| .github/workflows/README.md | - | - | - | pending |
| .github/workflows/advisory-checks.yml | - | - | - | pending |
| .github/workflows/agent-mirror-sync.yml | - | - | - | pending |
| .github/workflows/changed-packet-validation.yml | - | - | - | pending |
| .github/workflows/command-tree-parity.yml | - | - | - | pending |
| .github/workflows/deep-loop-runtime.yml | - | - | - | pending |
| .github/workflows/dispatch-enforcement-guard.yml | - | - | - | pending |
| .github/workflows/gate-inputs.yml | - | - | - | pending |
| .github/workflows/hook-vitest-suites.yml | - | - | - | pending |
| .github/workflows/opencode-plugin-tests.yml | - | - | - | pending |
| .github/workflows/opencode-v2-battery.yml | - | - | - | pending |
| .github/workflows/pi-extension-tests.yml | - | - | - | pending |
| .github/workflows/playbook-operator-contract.yml | - | - | - | pending |
| .github/workflows/routing-registry-drift.yml | - | - | - | pending |
| .github/workflows/sk-code-script-tests.yml | - | - | - | pending |
| .github/workflows/sk-doc-rename-harness.yml | - | - | - | pending |
| .github/workflows/sk-doc-script-tests-filtered.yml | - | - | - | pending |
| .github/workflows/sk-doc-script-tests.yml | - | - | - | pending |
| .github/workflows/skill-advisor-stress.yml | - | - | - | pending |
| .github/workflows/skill-doc-frontmatter.yml | - | - | - | pending |
| .github/workflows/spec-kit-check.yml | - | - | - | pending |
| .github/workflows/strict-pass-freshness-report.yml | - | - | - | pending |
| .github/workflows/trigger-index-rebuild.yml | - | - | - | pending |
| .gitignore | - | - | - | pending |
| .skilled/bin/README.md | - | - | - | pending |
| .skilled/bin/launcher-threshold-env.vitest.ts | - | - | - | pending |
| .skilled/bin/lib/README.md | - | - | - | pending |
| .skilled/bin/lib/launcher-ipc-bridge.cjs | - | - | - | pending |
| .skilled/bin/system-skill-advisor-launcher.cjs | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.1.2.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.4.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.4.1.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.5.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.5.0.3.md | - | - | - | pending |
| .skilled/changelog/skilled/v3+/v3.6.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.0.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.1.0.0.md | - | - | - | pending |
| .skilled/changelog/skilled/v4.2.0.0.md | - | - | - | pending |
| .skilled/commands/create/assets/create-command-auto.yaml | - | - | - | pending |
| .skilled/commands/create/assets/create-command-confirm.yaml | - | - | - | pending |
| .skilled/commands/create/assets/create-command-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/_routes.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-install-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-install.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-overlay-apply.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-overlay-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-overlay-repin.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-setup-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-setup.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-symlink-link.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-symlink-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-update-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/scripts/README.markdown | - | - | - | pending |
| .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/orphan-process-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/heldout.jsonl | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/tune.jsonl | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/setup.md | - | - | - | pending |
| .skilled/commands/doctor/skill-advisor.md | - | - | - | pending |
| .skilled/commands/doctor/update.md | - | - | - | pending |
| .skilled/hooks/shared/env-aliases.cjs | - | - | - | pending |
| .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply-conversation.md | - | - | - | pending |
| .skilled/manual-testing-playbook/doctor-commands/doctor-update-apply.md | - | - | - | pending |
| .skilled/scripts/git-hooks/pre-commit | - | - | - | pending |
| .skilled/scripts/orphan-mcp-sweeper.sh | - | - | - | pending |
| .skilled/skills/cli-classifier/benchmark/pi-transport/replay-helpers.mjs | - | - | - | pending |
| .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md | - | - | - | pending |
| .skilled/skills/mcp-code-mode/scripts/install.sh | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/quick-reference/template-naming-and-types.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md | - | - | - | pending |
| .skilled/skills/sk-doc/changelog/v1.6.0.0.md | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/README.md | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py | - | - | - | pending |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl | - | - | - | pending |
| .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md | - | - | - | pending |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/typo-flags.test.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/package-lock.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/ARCHITECTURE.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/ROUTER.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/SKILL.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v0.11.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v0.17.6.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v0.2.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v1.0.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v1.2.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/df-idf-corpus.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/doc-frontmatter-harvest.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/provenance-and-trust-lanes.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/lifecycle.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/watcher.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/age-haircut.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/archive-handling.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/schema-migration.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ambiguity.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/attribution.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/executor-delegation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/lane-fusion.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/projection.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/graph-metadata.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/leaf-aliases.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/leaf-manifest.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/auto-update-daemon/watcher-narrow-scope.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/age-haircut.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/schema-migration.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/advisor-status-rebuild-separation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-fusion.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/projection.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/config/db-path-policy.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/graph/skill-graph-drift.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/runtime/tool-ids-reference.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/advisor-server.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/graph-causal.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/shared/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/package-lock.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/package.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_bench.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_regression.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/advisor-recommend-handler-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/lane-fusion-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/mcp-diagnostics-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-bench-runner-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/python-compat-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/scorer-extras-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/advisor-rebuild.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/cli-exit-taxonomy.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/daemon-probe.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-unavailable.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-trust-gate.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/lane-attribution.test.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-health.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/ambiguity-slice.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-bridge-isolation.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-registry-env-override.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/packet-local-changelog.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/rrf-determinism-spine.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/runtime-lane-health.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/sk-git-worktree-sweep-vocabulary.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/shadow-sink.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/shared-import-specifier-extension.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-job-semantics.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tools/advisor-status.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tsconfig.build.json | - | - | - | pending |
| .skilled/skills/system-skill-advisor/scripts/README.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/scripts/doctor.sh | - | - | - | pending |
| .skilled/skills/system-skilled-doctor/README.md | - | - | - | pending |
| .skilled/skills/system-skilled-doctor/changelog/v1.1.7.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/ARCHITECTURE.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/ROUTER.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/SKILL.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v0+/v0.2.10.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v0+/v0.2.21.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v1+/v1.4.2.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v1+/v1.7.0.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v2.0.0.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/changelog/v2.12.12.0.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/orphan-mcp-sweeper-and-launchagent-template.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/leaf-aliases.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/leaf-manifest.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/package-lock.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/package.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/config/environment-variables.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/memory/memory-system.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/memory-pipeline-regressions.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/core/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/orphan-sweeper-temp-path.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/algorithms/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/tests/README.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/types.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/shared/utils/README.md | - | - | - | pending |
| INSTALL-SKILLED.md | - | - | - | pending |
| README.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-21T12:42:00Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-21T12:42:00Z
<!-- MACHINE-OWNED: END -->

---

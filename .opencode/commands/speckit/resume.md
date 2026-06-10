---
description: Resume or recover work on a spec folder: canonical continuity recovery with one next step.
argument-hint: "[spec-folder-path] [:auto|:confirm] [--phase-folder=<path>] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, memory_match_triggers, memory_list, memory_stats, memory_delete, memory_update, memory_validate, memory_index_scan, memory_health, checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `speckit_resume_auto.yaml`
>    - Confirm mode → `speckit_resume_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below defines workflow context for the YAML runner. Treat it as executable only when running this command workflow; otherwise use it as reference.

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
- **FIRST ACTION** is always: load the YAML file, then execute it step by step

> **Format:** `/speckit:resume [spec-folder-path] [:auto|:confirm]`
> Examples: `/speckit:resume specs/007-feature/` | `/speckit:resume:auto specs/007-feature/`

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow gathers ALL inputs in ONE prompt. Mode defaults to INTERACTIVE unless :auto suffix used.

> **Gate 3 Note:** Resume inherently satisfies Gate 3 — it REQUIRES a spec folder (provided or detected).

---

## 0. UNIFIED SETUP PHASE

**FIRST MESSAGE PROTOCOL**: For `:confirm` or no suffix, the consolidated setup prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery is allowed, then ask ALL questions immediately and wait.

For `:auto`, do not emit the consolidated prompt by default. Resolve setup with the three-tier branch below, then load the auto YAML only after all required values are bound.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{spec_path}/resume-config.json` (shape: `specPath`, `detectionMethod`, `executionMode: "auto"`, `continuationChoice`, `artifactRecoveryChoice`, `memoryChoice`, `artifactsValid`, `continuitySourcesAvailable`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/speckit/assets/speckit_resume_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `spec_folder`, `continuation_choice`. **Ordering rule**: ask only for `spec_folder` first when detection is ambiguous — continuation validation depends on it. Missing `spec_folder` with no viable candidates is absence, not ambiguity — go to Tier 3.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/speckit:resume:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  spec_folder: <spec-folder>  # explicit spec or phase folder path
  phase_folder: ""  # optional explicit phase child path
  no_redirect: false  # boolean
  detection_method: provided  # provided | phase-folder | ranked | none
  execution_mode: AUTONOMOUS  # from :auto suffix
  continuation_choice: indexed-continuity  # handoff | indexed-continuity | investigate
  artifact_recovery_choice: continue_anyway  # plan | select-different | continue_anyway
  memory_choice: fast  # fast | fill-gaps | deeper-mcp | canonical-only
  artifacts_valid: true  # auto-detected: yes | partial | no
  continuity_sources_available: yes  # auto-detected: yes | partial | no
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `spec_folder` | Y | `$ARGUMENTS` positional path, flag `--phase-folder`, marker `spec_folder` / `phase_folder`, or deterministic ranked detection | none | Y, when detection returns multiple viable folders |
| `phase_folder` | N | flag `--phase-folder`, marker `phase_folder`, or phase-parent redirect | none | N |
| `no_redirect` | N | flag `--no-redirect`, marker `no_redirect`, or default | `false` | N |
| `detection_method` | Y | auto-detect from provided path / phase-folder / ranked candidates, or marker `detection_method` | auto-detect | N |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `continuation_choice` | N | marker `continuation_choice` or targeted question when handoff and indexed continuity disagree | none | Y, only when a handoff mismatch is present |
| `artifact_recovery_choice` | N | marker `artifact_recovery_choice`, artifact validation result, or default | `continue_anyway` under resume auto mode | N |
| `memory_choice` | N | marker `memory_choice`, canonical packet thickness check, or default | `fast` | N |
| `artifacts_valid` | Y | auto-detect from `spec.md`, `plan.md`, and `tasks.md`; marker may only document expected state | auto-detect | N |
| `continuity_sources_available` | N | auto-detect from `handover.md`, `_memory.continuity`, spec docs, and graph metadata; marker may only document expected state | auto-detect | N |

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK mode suffix:
   ├─ ":auto"    → execution_mode = "AUTONOMOUS"
   ├─ ":confirm" → execution_mode = "INTERACTIVE"
   └─ No suffix  → execution_mode = "INTERACTIVE" (default - safer)

2. CHECK $ARGUMENTS for spec folder path:
   ├─ Has path → validate path exists
   └─ Empty → auto-detect from deterministic filtered candidates

3. Auto-detect if needed:
   - Build candidates from session-learning + known spec roots (`specs/`, `.opencode/specs/`)
   - Normalize aliases, filter archive/test/fixture/scratch, then rank deterministically
   - Low confidence: confirm in interactive mode; non-interactive safely falls through
   - Found → spec_path = extracted, detection_method = "ranked"
   - Not found → detection_method = "none" (include Q0)

3b. CHECK --phase-folder flag, --no-redirect, OR detect phase parent:
   - IF --phase-folder=<path> provided → auto-resolve spec_path to that child folder
     Set spec_path = <path>, detection_method = "phase-folder"
     Validate path matches pattern: `{specs|.opencode/specs}/[###]-*/[0-9][0-9][0-9]-*/`
   - IF --no-redirect is present → skip pointer redirect entirely; show the parent `spec.md` and child list when spec_path is a phase parent
   - IF spec_path is a parent phase folder (contains numbered child folders like 001-*, 002-*):
     Unless --no-redirect is present, read `graph-metadata.json` first:
       - If `derived.last_active_child_id` is a non-null string AND `derived.last_active_at` parses as ISO-8601 within the last 24 hours, resolve that child under the parent and recurse directly into that child resume flow
       - If the pointer child is missing, null, malformed, missing `last_active_at`, or older than 24 hours, ignore it and continue to list fallback
       - When redirecting, report the redirect target and timestamp so the user can backtrack with `--no-redirect`
     List fallback: child phases with completion status:
       $ ls -d [spec_path]/[0-9][0-9][0-9]-*/ 2>/dev/null
     For each child: check tasks.md completion %, show status (not started / in progress / complete)
     Present phase selection to user so they can choose which phase to resume
   - ELSE → continue normally

4. Check for "CONTINUATION - Attempt" handoff pattern in recent messages:
   - Detected → continuation_detected = TRUE, parse Last/Next
   - Not detected → continuation_detected = FALSE

4b. Check canonical continuity anchors:
    - `handover.md` exists and is recent → continuity_hint_available = TRUE
    - `implementation-summary.md` contains `_memory.continuity` → continuity_state_available = TRUE
    - Parse last confirmed action, next safe action, blockers, and key files from those canonical sources

5. Validate artifacts in spec folder:
   - Check: spec.md, plan.md, tasks.md
   - Store: artifacts_valid = [yes/partial/no]

6. Check canonical recovery sources:
   - `handover.md`
   - `implementation-summary.md` with `_memory.continuity`
   - Supporting spec docs: `tasks.md`, `checklist.md`, `plan.md`, `decision-record.md`, `resource-map.md`
   - `graph-metadata.json` for packet dependencies, related packets, and derived key files after the canonical docs are checked
   - Store: continuity_sources_available = [yes/partial/no]

7. ASK with SINGLE prompt (include only applicable questions):

   Q0. Spec Folder (if not detected/provided):
     No active session detected. Available spec folders: [list]
     A) List and select  B) Start new with /speckit:complete  C) Cancel
     E) Phase folder — resume a specific phase child (e.g., specs/NNN-name/001-phase/)

   Q1. Confirm Detected Session (if auto-detected):
     Detected: [spec_path] (last activity: [date])
     A) Yes, resume  B) Select different folder  C) Cancel

   Q2. Continuation Validation (if handoff pattern with mismatch):
     Handoff claims: Last=[X], Next=[Y] | Indexed continuity shows: Last=[A], Next=[B]
     A) Use handoff claims  B) Use indexed-continuity state  C) Investigate first

   Q3. Missing Artifacts (if artifacts_valid != yes):
     Missing: [list]
     A) Run /speckit:plan  B) Select different folder  C) Continue anyway

   Q4. Recovery Depth (when the canonical resume packet is still thin):
     A) Fast resume - just enough context to continue safely
     B) Fill missing next step / blockers
     C) Deeper MCP context - enrich the packet if essentials are still missing
     D) Use canonical artifacts only

   Reply format: "A, A" or "A, A, B"

8. WAIT for user response (DO NOT PROCEED)

9. Parse response and store ALL results:
   - spec_path = [from Q0/Q1 or auto-detected or $ARGUMENTS]
   - detection_method = [provided/recent]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix]
   - continuation_choice = [from Q2, or N/A]
   - artifacts_valid = [yes/partial/no]
   - memory_choice = [A/B/C from Q4, or N/A]

10. Execute background operations:
    - IF memory_choice == A: Recover only the default resume packet
    - IF memory_choice == B: Run targeted gap-filling for next step / blockers
   - IF memory_choice == C: Use `session_bootstrap()`/`memory_context()` to enrich the canonical packet
   - IF memory_choice == D: Use canonical artifacts only
    - Calculate progress from tasks.md/checklist.md

11. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

⛔ DO NOT proceed until user explicitly answers
⛔ NEVER assume spec folder without confirmation when path was invalid
⛔ NEVER split questions into multiple prompts
```

**Phase Output:**
- `spec_path` | `detection_method` | `execution_mode`
- `artifacts_valid` | `memory_loaded`

### Packet Graph Metadata

- Resume remains anchored to `handover.md -> _memory.continuity -> spec docs`.
- When that canonical packet is thin, `graph-metadata.json` provides packet-level dependency and key-file hints without replacing the canonical ladder.
- `session_bootstrap()` may return a bounded startup restore panel with restored and omitted counts. Treat it as an operator diagnostic that explains recovered working-memory context, not as a replacement for the canonical packet ladder.

---

## 2. PHASE STATUS VERIFICATION (BLOCKING)

| FIELD            | REQUIRED      | SOURCE                        |
| ---------------- | ------------- | ----------------------------- |
| spec_path        | Yes           | Q0/Q1 or auto-detect or $ARGS |
| detection_method | Yes           | Auto-determined               |
| execution_mode   | Yes           | Suffix (defaults INTERACTIVE) |
| artifacts_valid  | Yes           | Validation check              |
| memory_loaded    | Conditional   | Q4 (if the canonical resume packet is still thin) |

ALL required fields set? → Proceed to workflow | Missing? → Re-prompt for missing only

---

## 3. VIOLATION SELF-DETECTION (BLOCKING)

**You are in violation if you:** started workflow before fields set, asked questions in multiple prompts, proceeded without validating artifacts, assumed spec folder without confirmation, didn't display progress, claimed "resumed" without continuation options.

**Recovery:** STOP → state violation → present consolidated prompt → WAIT → resume after all fields set.

---

# WORKFLOW EXECUTION

Execute steps IN ORDER. Mark each ✅ ONLY after completing ALL activities and verifying outputs.

---

## 4. AUTO MODE (4 STEPS)

| STEP | NAME               | REQUIRED OUTPUT      | VERIFICATION            |
| ---- | ------------------ | -------------------- | ----------------------- |
| 1    | Session Detection  | spec_path confirmed  | Path validated          |
| 2    | Load Memory        | context_loaded       | Recovery packet loaded  |
| 3    | Calculate Progress | progress_percentages | Tasks/checklist counted |
| 4    | Present Resume     | resume_summary       | Summary displayed       |

---

## 5. CONFIRM MODE (5 STEPS)

| STEP | NAME               | REQUIRED OUTPUT      | VERIFICATION            |
| ---- | ------------------ | -------------------- | ----------------------- |
| 1    | Session Detection  | spec_path confirmed  | Path validated          |
| 2    | Memory Selection   | user_choice          | User selected A/B/C/D   |
| 3    | Load Memory        | context_loaded       | Requested gaps loaded   |
| 4    | Calculate Progress | progress_percentages | Tasks/checklist counted |
| 5    | Present Resume     | resume_summary       | Summary displayed       |

---

# SpecKit Resume

Resume work on an existing spec folder by detecting the last active session, loading just enough useful context to continue safely, and presenting progress with clear next steps.

```yaml
role: Expert Developer using Smart SpecKit for Session Recovery
purpose: Resume interrupted work with full context restoration and progress visibility
action: Run 4-5 step resume workflow from session detection through continuation options

operating_mode:
  workflow: sequential_4_or_5_step
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: memory_selection_in_confirm_mode
  tracking: progress_calculation
  validation: artifact_based
```

---

## 6. PURPOSE

Resume work on an existing or recently interrupted spec-folder session by detecting the last active state, loading structured handoff or memory context, and presenting the smallest useful recovery packet: where you are, what happened last, what should happen next, and what might block it. This command owns both normal continuation and crash-recovery routing.

---

## 7. CONTRACT

**Inputs:** `$ARGUMENTS` — Optional spec folder path with optional :auto/:confirm suffix
**Outputs:** Resumed session context + progress display + packet-graph hints when available + `STATUS=<OK|FAIL|CANCELLED>`

```text
$ARGUMENTS
```

---

## 8. INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/commands/speckit/assets/speckit_resume_auto.yaml`
- **INTERACTIVE**: `.opencode/commands/speckit/assets/speckit_resume_confirm.yaml`

The YAML contains detailed step-by-step workflow, output formats, and all configuration.

---

## 9. SESSION DETECTION FLOW

**Priority order for finding spec folder:**
1. Validate provided path from $ARGUMENTS
2. `memory_match_triggers()` — fast phrase matching (<50ms)
3. `memory_context()` — L1 unified retrieval (score > 0.6)
4. Deterministic filtered ranking (session-learning + alias-normalized spec roots)
5. No session found → offer: /speckit:complete or specify path

**Context loading priority (after spec_path confirmed):**
1. handover.md (exists & <24h) → use handover context
2. `implementation-summary.md` → `_memory.continuity` host block for last/next/blockers/key files
3. Supporting spec docs (`tasks.md`, `checklist.md`, `plan.md`, `decision-record.md`) → canonical packet detail
4. `graph-metadata.json` → packet dependencies, related packets, supersession, and derived key files
5. `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` → optional enrichment when the canonical packet is still thin
6. `memory_search()` with resume anchors → targeted gap-filling only when essentials are still missing

**Stale session (>7 days):** Warn user, offer: A) Resume anyway, B) Fresh start, C) Review changes, D) Cancel

---

## 10. SMART MEMORY LOGIC

**Goal:** recover enough state to take the next safe action, not to replay the whole project history.

### Resume Essentials

| Signal | Why it matters | Primary source | Fallback |
| ------ | -------------- | -------------- | -------- |
| Current phase or task | Orient the user immediately | `handover.md`, `tasks.md` | `_memory.continuity`, then `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` |
| Last confirmed action | Prevent duplicate work | `handover.md`, `_memory.continuity` | `memory_search()` with `state` anchor |
| Next safe action | Make the resume actually useful | `_memory.continuity`, `tasks.md` | `memory_search()` with `next-steps` anchor |
| Blockers or "none" | Avoid unsafe continuation | `_memory.continuity`, `handover.md` | `memory_search()` with `blockers` or `summary` anchor |
| Relevant artifact or file | Give the user a concrete place to start | `tasks.md`, `implementation-summary.md`, `handover.md` | `plan.md`, `decision-record.md` |

### Sufficiency Rule

- Stop loading more context once the command can name a **Next Safe Action** plus at least two of: current phase/task, blocker status, last confirmed action, or relevant artifact/file.
- If the next safe action is still ambiguous after the primary recovery chain, run targeted gap-filling instead of broad memory loading.
- If ambiguity remains after targeted recovery, report uncertainty clearly instead of guessing.

### Gap-Filling Order

1. Missing current phase/task: check `tasks.md`, `checklist.md`, or `handover.md`.
2. Missing next safe action: use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })`, then targeted `memory_search()` on `next-steps` and `state`.
3. Missing blockers: target `blockers` and `summary`.
4. Missing concrete starting point: look for the most relevant artifact, file, or unfinished task in the spec docs before asking for MCP enrichment.
5. Only use deeper MCP context when the focused recovery packet is still insufficient.

---

## 11. OUTPUT FORMATS

**Success:**
```
RESUME BRIEF
Spec: [path]
Confidence: [high|medium|low] | Source: [handover|continuity|spec_docs|mcp_enrichment|combined]
Now: [phase/current task]
Last confirmed: [action]
Next safe action: [action]
Blockers: [none|details]
Progress: [X]% ([done]/[total] tasks)
Why this is next: [short reason based on tasks/checklist/memory]
```

**No Session:** Offer /speckit:complete or specify folder path.

**Stale Session (>7 days):** Warn context may be outdated, offer Resume/Fresh/Review/Cancel.

---

## 12. REFERENCE

**Full details in YAML prompts:** Workflow steps, progress calculation, memory loading, session detection priority, stale handling, mode behaviors, failure recovery.

**See also:** AGENTS.md Sections 2-6 for memory loading, confidence framework, and request analysis.

---

## 13. MCP TOOL USAGE

Call MCP tools directly — NEVER through Code Mode.

**Transport fallback:** if the `mk-spec-memory` MCP tools are missing from the runtime, fail to initialize, or return transport errors while the daemon is otherwise expected to be warm, use the daemon-backed CLI instead: `node .opencode/bin/spec-memory.cjs memory_context --json '{"input":"resume previous work","mode":"resume"}' --format json --timeout-ms 3000 --warm-only`. Warm-only never starts a daemon; exit 75 means retryable daemon/IPC unavailability — retry after MCP reconnect, daemon prewarm, or a short backoff. The canonical file-based recovery ladder (`handover.md` → `_memory.continuity` → spec docs) needs no MCP at all and remains the first resort.

The full daemon-backed CLI exposes all 37 spec-memory tools over the same warm daemon as MCP. It is additive, not a replacement; use `--warm-only` in prompt-time recovery paths so a cold daemon returns exit `75` instead of spawning.

### Memory Tools

| Tool                    | Purpose                                |
| ----------------------- | -------------------------------------- |
| `memory_search`         | Find/load context (includeContent: true)|
| `memory_match_triggers` | Fast trigger phrase matching (<50ms)   |
| `memory_list`           | Browse stored memories with pagination |
| `memory_stats`          | Memory system statistics               |
| `memory_delete`         | Remove memory by ID or spec folder     |
| `memory_update`         | Update metadata (title, triggers, tier)|
| `memory_validate`       | Record validation feedback             |
| `memory_index_scan`     | Bulk index canonical spec documents refreshed by `generate-context.js` |
| `memory_health`         | Check database/embeddings/index status |

### Checkpoint Tools

| Tool                 | Purpose                              |
| -------------------- | ------------------------------------ |
| `checkpoint_create`  | Snapshot state before major work     |
| `checkpoint_list`    | Browse checkpoints with metadata     |
| `checkpoint_restore` | Rollback to previous checkpoint      |
| `checkpoint_delete`  | Clean up old checkpoints             |

**Note:** No `memory_load` tool. Use `session_bootstrap()` as the canonical first recovery call, or `memory_context({ mode: "resume", profile: "resume" })` when you want the direct resume-retrieval primitive. In the current handler, resume mode is effectively a focused recovery search over the anchors `state`, `next-steps`, `summary`, and `blockers`; use `memory_search` with `includeContent: true` only when one of those essential signals is still missing.

SEARCH ROUTING: when resume reveals code-search follow-up work, send semantic or concept discovery to `code_graph_query`, structural questions to `code_graph_query`, and exact literal text checks to grep-style search. This is the same routing contract surfaced by `session_bootstrap()` and `session_resume()`.

### Session Deduplication

- Prefer deterministic ranked active candidates (archive/test/fixture filtered)
- handover.md takes priority; if it is absent or thin, read `_memory.continuity` from `implementation-summary.md` next
- supporting spec docs are the next canonical layer before any MCP enrichment
- use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` only when the canonical packet is still thin
- Parallel continuity saves are serialized by the spec-folder advisory lock in the memory-save path; if a save is busy, retry after the active save completes rather than writing around it.
- Older handovers preserved for audit trail
- `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` is default-off; when enabled, authored continuity snapshots can improve compaction/restart context but must be treated as supplemental to `handover.md`, `_memory.continuity`, and canonical spec docs.

### Compaction Continuation Safety

- If a context-compaction continuation prompt is detected, stop and present current task/state summary before taking actions.
- Wait for user confirmation after the summary, then proceed with normal resume flow.

### Validation on Resume

After loading context, auto-validates: missing files, broken memory anchors, unfilled placeholders, and whether the recovery packet actually includes a usable next action.

---

## 14. PARALLEL DISPATCH

Resume is a **utility workflow** — no parallel dispatch. All steps sequential.
- Auto: 4 steps | Confirm: 5 steps with user checkpoints

---

## 15. EXAMPLES

```
/speckit:resume                                          → Auto-detect via deterministic filtered ranking
/speckit:resume:auto                                     → Auto-detect and recover an interrupted session
/speckit:resume specs/014-context-aware-permission-system/ → Resume specific folder
/speckit:resume:confirm specs/014-*/                      → Interactive with memory options
```

---

## 16. RELATED COMMANDS

| Command               | Relationship                                            |
| --------------------- | ------------------------------------------------------- |
| `/speckit:complete`  | Start new (resume continues existing)                   |
| `/speckit:plan`      | Create planning artifacts (if missing on resume)        |
| `/speckit:implement` | Execute implementation (call after resume)              |
| `/memory:save`        | Refresh canonical continuity before pausing or resuming |
| `/memory:search`     | Broader historical lookup and learning-history review   |

---

## 17. COMMAND CHAIN

```
[/memory:save] → /speckit:resume → [Continue workflow]
```

Prerequisite: `/memory:save [spec-folder-path]` (refreshes the canonical continuity packet before a later resume)

---

## 18. NEXT STEPS

| Condition                  | Suggested Command                        | Reason                    |
| -------------------------- | ---------------------------------------- | ------------------------- |
| Planning incomplete        | `/speckit:plan [feature-description]`   | Complete planning phase   |
| Ready to implement         | `/speckit:implement [spec-folder-path]` | Continue implementation   |
| Implementation in progress | Continue from last task                  | Resume where you left off |
| Found issues               | `Task tool → @debug`                     | Fresh debugging pass after repeated failures |
| Need broader history       | `/memory:search history [spec-folder]`  | Inspect learning history  |
| Session ending again       | `/memory:save [spec-folder-path]`        | Refresh canonical continuity before pausing |

**ALWAYS** end with: "What would you like to do next?"

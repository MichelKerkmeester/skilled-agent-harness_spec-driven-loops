---
title: "Decision Record: Phase 15: dsh-hook-parity"
description: "Five decisions behind DSH hook parity: a lineage leaf marker read at event time, the goal surface over the shared manage CLI, interactive-only writer adapters, the hook library link layout and the leaf goal tools and runtime lists."
trigger_phrases:
  - "dsh hook parity decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/015-dsh-hook-parity"
    last_updated_at: "2026-11-06T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded five accepted decisions for DSH hook parity"
    next_safe_action: "Verify a keyed interactive run before revisiting ADR-002"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-015-dsh-hook-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 15: dsh-hook-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Mark a fan-out leaf with a lineage-inserted plugin read at event time

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | Implementing agent, under the operator's dispatch brief |

---

<!-- ANCHOR:adr-001-context -->
### Context

The advisor had to run in interactive sessions and stay off in fan-out leaves. The obvious move, a lineage patch row that sets `promptAdvisor: false` on `repo-guards`, cannot work: the runner applies the lineage patch before the guards patch inserts that row, and a `--dump-config` probe printed `patch: entry "repo-guards" not found` for exactly that order. A second probe showed that cordis does not await one row's async `apply` before the next row applies.

### Constraints

- The deep-loop runner's patch order is route, lineage, persona, guards and MCP. Other packets depend on it.
- A leaf must keep every guard, so the whole bundle cannot be switched off.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The lineage patch inserts its own one-line plugin, `repo-guards-lineage-leaf`, which sets a process-wide flag that each leaf-aware adapter reads when an event fires.

**How it works**: `lineage-leaf.mjs` calls `markLineageLeaf()` from `session-role.mjs`, which sets a `Symbol.for` key on `globalThis`. The advisor, goal management, session-start guards and stop autosave check `isLineageLeaf()` inside their handlers, never at registration, so row order cannot change the outcome.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Marker plugin read at event time** | Works in any patch order, one source of truth, testable | A global flag | 9/10 |
| Lineage patch overrides the guards row | Declarative | The row does not exist yet when the lineage patch applies | 0/10 |
| Read `AI_SESSION_CHILD` from the environment | No new file | An operator can export it in an interactive shell, and the runner contract does not promise it for every leaf | 5/10 |
| A second guards patch for leaves | Explicit | Every dispatch caller would have to pick the right patch, and the hard rules name one guards patch | 4/10 |

**Why this one**: It is the only option that holds under the runner's fixed patch order, and the lineage patch is already the one thing every leaf must carry.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The guards patch can turn the advisor on for everyone without touching any dispatch caller.
- The marker row shows in `--dump-config`, so a reviewer can see a leaf composition at a glance.

**What it costs**:
- One more plugin row and one global flag.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A leaf loses the marker row and runs writers | H | `session-role.test.mjs` pins the row in the lineage patch, and the lineage keyless boot shows no advisor and no goal tool |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The advisor stayed off for every session before this change |
| 2 | **Beyond Local Maxima?** | PASS | Four options compared above |
| 3 | **Sufficient?** | PASS | One three-line plugin and one three-line module |
| 4 | **Fits Goal?** | PASS | REQ-001 requires the split |
| 5 | **Open Horizons?** | PASS | Any future writer adapter reuses the same check |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.dsh/patches/lineage.patch.yml` inserts `repo-guards-lineage-leaf`.
- `.dsh/plugins/repo-guards/lineage-leaf.mjs` and `.skilled/hooks/shared/dsh/session-role.mjs` are new.

**How to roll back**: Remove the insert row from the lineage patch and set `promptAdvisor: false` again. The leaf-aware adapters then treat every session as interactive, so remove those four registrations from `index.mjs` too.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Give DSH the goal surface as a command and a scoped tool over the shared manage CLI

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | Implementing agent, under the operator's dispatch brief |

---

<!-- ANCHOR:adr-002-context -->
### Context

Pi binds and logs goals with `/goal-pi` and briefs every turn. OpenCode exposes an `opencode_goal` tool with fourteen actions. DSH had only `goal-context`, which injects a packet's chat slice when `DSH_SPEC_FOLDER` names one. DSH's native goal service holds one goal per session and reads no `goal.md`, and its round driver keeps an idle agent running.

### Constraints

- Every goal write must go through `.skilled/hooks/goal/` so all runtimes share one record.
- A plugin command registers globally, `agent.ctx.commands` throws without `inject`, and a tool registers per agent at `agent/created`.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: An interactive session gets `/goal-dsh`, a `dsh_goal` tool with OpenCode's action set, a per-turn brief with the resend reminder and a heuristic verify note held until idle.

**How it works**: Both entry points build the same argument list and run `goal.cjs` with `--runtime dsh --session <id> --workspace <repo root>`. The brief rides the `agent/pre-step` of any step that claims an operator message. The verify note is computed at `agent/turn-stopping` and injected at the next `agent/status` idle, because steering a stopping turn would run another step.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Command plus tool over the manage CLI** | Same record as every runtime, operator and model can both act | Two entry points to keep in step | 9/10 |
| Enable DSH's native goal service | No new code | Reads no `goal.md` and keeps idle agents running | 2/10 |
| Command only, as Pi has | Smaller | The model cannot log progress itself, which OpenCode allows | 6/10 |

**Why this one**: The command matches Pi's operator surface and the tool matches OpenCode's model surface, and both reuse the CLI the other runtimes already test.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- An operator can bind a packet goal from inside `dsh web` and see it every turn.
- The model can log a row with evidence instead of asking the operator to.

**What it costs**:
- `goal-manage` waits for the `commands` and `tools` services, so it registers a moment after the guards.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A leaf writes the operator's goal record | H | The adapter checks the leaf marker in every handler, and the lineage boot lists no `dsh_goal` |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | REQ-002 names bind, show, log, resent, pause, clear and complete |
| 2 | **Beyond Local Maxima?** | PASS | The native service was probed and rejected |
| 3 | **Sufficient?** | PASS | No new goal logic, only argument mapping |
| 4 | **Fits Goal?** | PASS | Parity with OpenCode and Pi |
| 5 | **Open Horizons?** | PASS | A new CLI action needs one enum entry |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.skilled/hooks/goal/dsh/goal-manage.mjs` is new, and `dsh-llm.mjs` gains `loadDshTools`.

**How to roll back**: Remove the `goal-manage` registration from `index.mjs`. `goal-context` keeps the packet slice working.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep writer and side-effect adapters interactive-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | Implementing agent, under the operator's dispatch brief |

---

<!-- ANCHOR:adr-003-context -->
### Context

Several new adapters write state or start work outside the session: the advisor writes advisor state, goal management writes the goal record, the session-start guards start live follow and primary reconcile, and the stop hook autosaves continuity. A fan-out leaf is a disposable child in a temp cwd that the operator never sees.

### Constraints

- A leaf must keep every guard that denies or advises.
- The runner already sets `SYSTEM_SPEC_GATE_DISABLED=1` for leaves, so the spec gate needs no marker check.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Four adapters check the leaf marker and stay off in a leaf: `prompt-advisor`, `goal-manage`, `session-start-advisories` and `session-stop-context`. Every other adapter runs in both compositions.

**How it works**: Each of the four returns early from its handler when `isLineageLeaf()` is true. `decision-capture` and `session-compact-context` stay on, because a leaf's question tool is absent in headless and a compaction context only re-primes the leaf itself.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gate the four writers** | A leaf stays guarded and writes nothing of the operator's | Four handlers carry the check | 9/10 |
| Gate every new adapter | Smallest leaf surface | A leaf loses the overlay guard and compaction recovery | 5/10 |
| Gate nothing | Simplest | A leaf could start background git work in the operator's checkout | 1/10 |

**Why this one**: The line falls exactly between what protects the leaf and what writes outside it.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Leaves keep their 2026-11-06 behavior, plus the overlay guard and compaction context.

**What it costs**:
- An operator testing a headless run without the lineage patch gets the full interactive set, which is the intended proxy for `dsh web`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A new writer adapter forgets the check | M | The bundle README and `guards-and-hooks.md` list the interactive-only set beside the leaf column |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live follow and the autosave have side effects outside a leaf |
| 2 | **Beyond Local Maxima?** | PASS | Three cut lines compared |
| 3 | **Sufficient?** | PASS | One early return per adapter |
| 4 | **Fits Goal?** | PASS | REQ-001 and US-002 |
| 5 | **Open Horizons?** | PASS | The check is one import |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `prompt-advisor.mjs`, `goal-manage.mjs`, `session-start-advisories.mjs` and `session-stop-context.mjs` read `isLineageLeaf()`.

**How to roll back**: Remove the early return from an adapter to run it in leaves too.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Use Pi's hook library layout with real-path imports

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | Implementing agent, under the operator's dispatch brief |

---

<!-- ANCHOR:adr-004-context -->
### Context

The operator required DSH to use the same layout as the other runtimes. Every Pi adapter's real file lives in `.skilled/hooks/<concern>/pi/` or its skill's `hooks/pi/`, and `.pi/extensions/` holds relative links to them. All DSH adapters lived only in `.dsh/plugins/repo-guards/adapters/`. Pi's loader resolves imports against the link path, but Node resolves a link to its real path before it resolves the module's own imports.

### Constraints

- The move must keep history, so tracked files move with `git mv`.
- Every relative import and every "find the checkout from this file" calculation must still land on the repo root and the shared cores.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Every DSH adapter's real file moves to `.skilled/hooks/<concern>/dsh/`, or to `system-spec-kit/runtime/hooks/dsh/`, `system-skill-advisor/hooks/dsh/` or `sk-git/scripts/hooks/dsh/` with an index link in the hook library, and `.dsh/plugins/repo-guards/adapters/` holds one relative link per adapter.

**How it works**: A script moved each file, resolved every relative literal against the old folder, mapped moved targets to their new homes and rewrote each literal relative to the new real folder. `sync-runtime-mirrors.cjs` derives one expected link per `.mjs` file in a `dsh/` folder and reports a missing link, a stale one or a real file in its place, and `/doctor:runtime-mirrors` runs it.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pi's layout, imports written for the real folder** | Same browsable index as every runtime, history kept, links checked | Import paths differ from Pi's link-relative style | 9/10 |
| Keep adapters in `.dsh/` and add index links from the hook library | No import rewrite | The opposite direction from every other runtime | 4/10 |
| Run Node with `--preserve-symlinks` | Pi-style imports | dsh starts Node itself, so the flag cannot be passed per plugin | 1/10 |

**Why this one**: It is the layout the operator asked for, and the import difference is a fact of Node that the move script and the resolution check handle once.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- `.skilled/hooks/` shows every DSH adapter beside the other runtimes.
- A stale or missing link fails `/doctor:runtime-mirrors`.

**What it costs**:
- The three skill-owned folders each gained a README, and the durable-directory manifest will list them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit adds a link-relative import | M | The bundle suite imports every adapter through its link, so a wrong path fails `ERR_MODULE_NOT_FOUND` |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator requirement |
| 2 | **Beyond Local Maxima?** | PASS | Three layouts compared |
| 3 | **Sufficient?** | PASS | Links plus one derived mirror tree |
| 4 | **Fits Goal?** | PASS | REQ-005 and REQ-007 |
| 5 | **Open Horizons?** | PASS | A new adapter needs no list edit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- 20 adapters and two helpers moved, 22 links, 8 index links and the `dsh-adapters` mirror tree.

**How to roll back**: Revert the docs commit that names the new paths, then the code commit. The code revert also removes the six new adapters, because they import the moved helpers from their new folders.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Close the leaf goal tools in the lineage patch and keep the hook-flags runtime list as it is

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | Implementing agent, under the operator's follow-up brief |

---

<!-- ANCHOR:adr-005-context -->
### Context

A keyless lineage boot still listed `create_goal`, `get_goal` and `update_goal`, the model-facing half of DSH's native goal service. The lineage patch already disabled `goal-round-driver` and `command-goal`, but the tools come from a separate row, `tool-goal` (`@deepseek-ai/dsh-tool-goal`). Its README says create, edit, pause and resume need a direct human message in a runtime-root agent's turn, which a fan-out leaf never has. The same follow-up asked whether every runtime allowlist accepts `dsh`. Two lists matter: the advisor's `ADVISOR_RUNTIME_VALUES`, which its metrics and outcome records validate against, and `RUNTIMES` in `.skilled/hooks/shared/hook-flags.cjs`.

### Constraints

- The lineage patch applies before the guards patch, so it can only touch rows the base bundle already mounts. `tool-goal` is one of them.
- `RUNTIMES` in hook-flags decides two things only: which runtimes get a per-runtime enable switch for a default-off concern, and which runtimes `session-relaunch` accepts as a loop runtime.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: disable `tool-goal` in the lineage patch, add `dsh` to `ADVISOR_RUNTIME_VALUES`, and leave hook-flags `RUNTIMES` without `dsh`.

**How it works**: the lineage patch carries `- id: tool-goal` with `disabled: true` beside the goal round driver and command rows, so a leaf's request lists 20 tools instead of 23. The advisor adapter passes `runtime: 'dsh'`, and the advisor's own list now holds it, so its records keep the right label instead of borrowing `pi`. DSH adapters call the hook flags without a runtime, so only the global switches apply to them, and `session-relaunch` stays closed to DSH because `skilled-loop` launches no DSH session.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Disable `tool-goal` in the lineage patch** | One row, visible in `--dump-config`, matches the other goal rows | None found: the tools refuse a leaf's calls anyway | 9/10 |
| Leave the tools and rely on their authority check | No patch change | A leaf model still sees three tools it cannot use and may spend a step on them | 4/10 |
| Disable the `goal` service too | Removes the whole surface | `goal-context` and the interactive goal surface do not need it gone, and nothing calls it in a leaf | 5/10 |
| Add `dsh` to hook-flags `RUNTIMES` as well | Every list names DSH | It would let `skilled-loop` accept `dsh` and add enable switches for a relaunch path DSH does not have | 2/10 |

**Why this one**: each change closes a gap a test or a boot showed, and the one list left alone governs behavior DSH deliberately lacks.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A leaf's tool list matches what it may do, and the advisor's metrics and outcome records carry `dsh`.

**What it costs**:
- One more lineage row, and the advisor's dist must be rebuilt before a DSH session picks up the new label.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future dsh release renames `tool-goal` | L | The patch would print `patch: entry "tool-goal" not found`, and `session-role.test.mjs` pins the row |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `evidence/keyless-boot-lineage.txt` line 13 listed the three native goal tools |
| 2 | **Beyond Local Maxima?** | PASS | Four options compared above |
| 3 | **Sufficient?** | PASS | One patch row and one tuple entry |
| 4 | **Fits Goal?** | PASS | REQ-010 and REQ-011 |
| 5 | **Open Horizons?** | PASS | A DSH relaunch path would add `dsh` to `RUNTIMES` then, with its own switches |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `.dsh/patches/lineage.patch.yml` disables `tool-goal`.
- `advisor-runtime-values.ts` gains `dsh`, and `prompt-advisor.mjs` exports `ADVISOR_RUNTIME = 'dsh'`.

**How to roll back**: remove the `tool-goal` row from the lineage patch, or drop `dsh` from the tuple and pass `pi` again, then rebuild the advisor dist.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Take ownership of the three DSH sync scripts along with the route, mirror-check and contract-test edits, so route validation passes. | Committing the edits alone would fail route-validate, because the new route lines call sync scripts that were untracked. | None | Commits 602309b436 to 8df2e4c343, .skilled/commands/doctor/_routes.yaml |
| Q002 | Add `.dsh/agents/` to the agent-folder list in AGENTS.md section 9 and refresh the AGENTS.md manifest. | Not stated. | None | Commit 9f8cee8630, AGENTS.md, agents-md-manifest.json |
| Q003 | Tick goal criteria 1 to 3 in the packet 085 goal only after hook parity has landed. | Not stated. | None | Commit ccf52fa7df, 085 goal.md |
| Q004 | Record the other answers in their own packets: repair the five cut source keys in sk-doc 055/005 and add the doctor answers to the system-skilled-doctor children, leaving the housekeeping and handover answers unrecorded. | Not stated. | None | sk-doc/055/005 decision-record.md, system-skilled-doctor/001 children |
| Q005 | Amend D3 so interactive sessions load the same hooks as the other runtimes, add the 015 row to BINDING, and shorten the binding table to stay inside the slice budget. | Not stated. | None | ../goal.md D3 and BINDING |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_017CRejh4rtd9XjeUmidgLhc:0 -->

Question:
```text
The three DSH edits (the _routes.yaml lines, the doctor-runtime-mirrors.yaml rows and the contract test) applied cleanly on my branch, and the doctor suite passes, 1067/1067. But route validation fails: the new route lines call three DSH sync scripts that exist only as untracked files in the main checkout. Commit the edits alone and the branch fails `route-validate`. How far should I take ownership?
```

Options:
```text
Also take the sync scripts (Recommended)
Take all the DSH work
Drop it, leave it to them
```

Answer:
```text
Also take the sync scripts (Recommended)
```

### Q002
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01Y2HrQgqw2Eh1oARajecSJd:0 -->

Question:
```text
AGENTS.md §9 lists each runtime's agent folder but leaves out `.dsh/agents/`. Should I add it to line 281 as "...`.devin/agents/`, `.hermes/agents/` or `.dsh/agents/`" (+16 bytes, still under the size cap) and refresh the AGENTS.md manifest? This edits the instruction file Claude Code loads, so the agent wouldn't do it without your direct OK.
```

Options:
```text
Yes, add it (Recommended)
No, leave it
```

Answer:
```text
Yes, add it (Recommended)
```

### Q003
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_01Y2HrQgqw2Eh1oARajecSJd:1 -->

Question:
```text
Should goal criteria 1 to 3 in DSH packet 085 be ticked? The log rows give the evidence, and ticking them changes the goal text you'd resend.
```

Options:
```text
Tick after parity lands (Recommended)
Tick now
Leave unticked
```

Answer:
```text
Tick after parity lands (Recommended)
```

### Q004
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_015mpKaRe3a6QBuWfMqRuCYx:0 -->

Question:
```text
The DSH save recorded 3 of the session's 16 operator answers in packet 085/015. The other 13 belong elsewhere: 5 changelog answers are already in sk-doc/055/005, but 4 of them have corrupted source keys (the ':t' was dropped), so the queue still lists them as pending; 3 doctor answers (job d005a, the token-file guard, the gold row) belong to the system-skilled-doctor/001 children; 3 are git housekeeping with no packet; 2 are Barter, whose files are read-only. What should I do with them?
```

Options:
```text
Route + repair (Recommended)
Repair keys only
Leave them
```

Answer:
```text
Route + repair (Recommended)
```

### Q005
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_015mpKaRe3a6QBuWfMqRuCYx:1 -->

Question:
```text
The DSH packet 085 goal.md still says D3 is 'Headless only' and its BINDING list has no row for the 015 hook-parity child. The chat slice is at 3,991 of 4,000 characters, so any addition needs cuts elsewhere. Should I update the goal?
```

Options:
```text
Update and cut (Recommended)
BINDING row only
Leave the goal
```

Answer:
```text
Update and cut (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---

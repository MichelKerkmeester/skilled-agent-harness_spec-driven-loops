---
title: "Decision Record: Phase 15: dsh-hook-parity"
description: "Four decisions behind DSH hook parity: a lineage leaf marker read at event time, the goal surface over the shared manage CLI, interactive-only writer adapters and the hook library link layout."
trigger_phrases:
  - "dsh hook parity decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/015-dsh-hook-parity"
    last_updated_at: "2026-11-06T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded four accepted decisions for DSH hook parity"
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

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---

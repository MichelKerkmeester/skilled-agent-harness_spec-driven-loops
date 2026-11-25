---
title: "Feature Specification: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat"
description: "Ten build phases that close the OpenBot parity gaps the 002 research ranked, from the activity view and actor field through routines, a Rust terminal screen, memory, approvals, apps, vault, skills and conversations."
trigger_phrases:
  - "openbot parity build phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | None |
| **Parent Packet** | system-skilled-bots/003-openbot-parity-build |
| **Predecessor** | `002-openbot-parity-research` |
| **Successor** | None |
| **Handoff Criteria** | Each child passes `validate.sh --strict` before the next starts, and 010-conversations closes the program |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled bots already holds the hard half of a bot runtime: approved definitions, an atomic file queue, exact cron, worktree isolation, needs-you decisions, run records and a status index. What it lacks is a human surface and a few small records. Nothing draws a run timeline, no record says who answered a needs-you item, a bot cannot keep a fact between runs, a bot reaches every MCP server and every secret in the environment, and there is no conversation verb. The operator reads run folders by hand to answer "what did my bots do, and what needs me".

### Purpose
Close each gap the 002 research ranked, one child phase per gap, so a small team runs its bots from a terminal with OpenBot's before-and-after view and none of OpenBot's server, database, container stack or desktop shell.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The ten ranked slices of `../002-openbot-parity-research/research/research.md` §15, one child phase each: activity and actor, routines, terminal screen, computer exposure, memory, approval grants, per-bot apps, vault, skills, conversations.
- The operator decision of 2026-11-24: the terminal screen moves up to third, after activity and routines, and draws its panes over the data those two write, so it needs no backend of its own.
- The operator decision of 2026-11-25: the screen is a new MIT Rust ratatui app that follows openhuman-tui's layout, tabs, approval banner, overlay and command palette, reads and writes through `bots ... --json`, and copies none of its GPL-3.0 code.
- The actor half of the small-team model (§12): a `by:` field on needs-you answers, secret records and run records, filled from the OS user or `--as`, so a shared host does not erase who answered.
- The reuse rule (§14): MIT lifts keep the copyright and permission notice, Apache-2.0 lifts keep the license, any NOTICE file and a statement of changes, and one `THIRD_PARTY_NOTICES.md` entry per lifted file names its source path.

### Out of Scope
- **The desktop app.** Item 11 of the ranked order, size XL. It earns a place only if an embedded browser with a passkey hand-back or a no-terminal install becomes a must-have. A local web page and a desktop app were offered for the screen and not chosen.
- **The research skip list** (§13), each for the reason it gives:
  - Enterprise roles and SSO: the admin tier governs people, sign-in and policy, and there is no sign-in to govern.
  - Multi-tenant: tenancy lives in the URL space and schema, and one team is one tenant.
  - Kubernetes and Helm: release promotion around a chart, a second deployment shape.
  - Managed upgrades: a vendor management agent tied to the chart; a checkout updates with `git pull`.
  - Mobile: a separate React Native app, and the terminal is the client.
  - PostgreSQL, Compose, a container computer, a browser farm, gVisor: the runtime is a Node CLI with a SQLite index and worktrees.
  - OAuth server, per-person connections, connector catalogue: a key or a shared account covers the common case, and the UTCP config already names the servers.
- **The rest of the small-team model** (§12): two roles in one `operators.json` and a shared host at mode 0770. No child builds them; 001 lands the actor field alone.
- **A browser computer per bot** (§10): OpenBot's largest surface, and a small team uses its own logged-in browser for the steps that need one.
- **Per-action policy inside the executor** (§11): executor sandboxes and posture enforce today, and the hook is a later packet.
- **Recording a skill from a demonstration** (§8, open question 6): no counterpart and no design.

### Files to Change
Per-phase detail lives in each child's `plan.md`. This table is the audit trail of the surfaces the ten phases touch.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/bin/bots.cjs` | Modify | 001, 002, 004, 005, 006, 008, 009, 010 | New verbs: `activity`, `inbox`, `routines`, `remember`, `secret`, `skill propose`, `chat` |
| `.skilled/skills/system-skilled-bots/runtime/lib/` | Create/Modify | 001-010 | Activity grouping, actor field, routine block, memory files, grants ladder, app filter, secret store, skill proposals, conversation JSONL |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | 002, 005, 007, 009 | `routine`, `memory`, `apps` and `skills` keys |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify | 007 | `apps-unknown-server` invariant, failing closed |
| New MIT Rust ratatui crate | Create | 003 | Panes over `bots ... --json`; the crate path is fixed in 003's `plan.md` |
| `THIRD_PARTY_NOTICES.md` | Create | 001, 002, 008, 009, 010 | One entry per lifted MIT or Apache-2.0 file, with its source path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Depends on | Status |
|-------|--------|-------|------------|--------|
| 1 | `001-activity-and-actor/` | `bots activity` grouped by OpenBot's seven ids, `bots inbox --json`, and a `by:` actor on answers and run records | None; the check-after, and the prerequisite for a shared host | Pending |
| 2 | `002-routine-layer/` | The four-part `routine` block over the existing triggers, the `until` check, the 15-minute floor, the fatigue switch and `bots routines` | 001, whose run rows the fatigue switch counts | Pending |
| 3 | `003-terminal-screen/` | A new MIT Rust ratatui app with activity, inbox and routine panes over `bots ... --json`, written from openhuman-tui's shape | 001 and 002, whose data it draws; no backend of its own | Pending |
| 4 | `004-computer-exposure/` | The worktree or run folder named in the prompt, with its path and branch in run records and `bots status` | 001, whose run records carry the fields | Pending |
| 5 | `005-memory/` | Shared and per-bot memory files prepended to the prompt, `bots remember`, and needs-you confirmation of bot-proposed facts | 001, whose needs-you item carries the confirmation | Pending |
| 6 | `006-approval-grants/` | A `grants` field on needs-you items and the precedence ladder applied at that gate | 001, whose item and inbox it extends | Pending |
| 7 | `007-per-bot-apps/` | The `apps:` key, a filtered UTCP config per run, `HonoredPosture.apps` and the `apps-unknown-server` checker invariant | 001, whose run records carry the posture | Pending |
| 8 | `008-vault/` | `bots secret set` over the keychain or a 0600 store, child-environment injection and `secretsUsed` | 007, which lands the per-run config the secret is injected into; this is the one slice that can leak, so it lands after the first | Pending |
| 9 | `009-skills/` | A `skills:` list under a byte cap, and `bots skill propose` reviewed through a needs-you item | 001, whose needs-you item reviews the proposal | Pending |
| 10 | `010-conversations/` | `bots chat` with `@bot` routing over an append-only conversation JSONL | 001, whose run records each message writes; 003 gains its chat pane here | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

A child hands off when its own `acceptance-criteria.md` rows are Met and `validate.sh --strict` prints `RESULT: PASSED` for its folder. The dependency column above names the one thing the next child reads from the one before; nothing else passes between them.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Who is the actor for a scheduled run on a shared host?** The proposal is the installing operator, pinned at install time. It is untested; 001 settles it.
- **Does a routine move to a `starts` list at once, or keep one primary trigger plus extra queue names?** 002 decides. A v1 with one start keeps the slice at size S.
- **How large may a memory file grow before it is rewritten shorter?** OpenGhost's 60-record, 3,600-character bound is a starting point, not a measurement here; 005 sets the bound.
- **Where does the per-action approval hook sit inside each executor's tool surface?** Out of scope for this program: 006 writes the ladder at the needs-you gate, and the hook is a later packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Research source**: `../002-openbot-parity-research/research/research.md` §12-15 for the small-team model, the skip list, reuse and licensing, and the ranked build order
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

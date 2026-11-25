---
title: Deep Research Strategy - OpenBot Parity for Skilled Bots (devin-2 lineage)
description: Runtime strategy file for the devin-2 fan-out lineage of the OpenBot parity research packet.
trigger_phrases:
  - "openbot parity strategy"
  - "devin-2 lineage strategy"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Fan-out research lineage `devin-2` for the OpenBot parity packet. The lineage was dealt two depth-1 frontier nodes, F-1-002 (routines) and F-1-006 (skip list, reuse and build order). It works those nodes, proposes follow-up frontier questions under them, and broadens across the eight OpenBot parts until the 13-iteration cap.

### Question Injection Surface

External questions enter through `research/lineages/devin-2/inbox.jsonl`; the reducer promotes them to the registry.

---

## 2. TOPIC

OpenBot parity for skilled bots, scoped to a small team. Goal: get as close to OpenBot as possible with only the parts a small team needs, no extras, preferring a terminal or CLI experience over a desktop app when it can match OpenBot's.

Inputs (read-only): eight reference repos under specs/system-skilled-bots/context/ (OpenBot-main is the primary reference; also OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main), and the built skilled-bots runtime under .skilled/skills/system-skilled-bots/.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] How do OpenBot routines (sentence form, time and event starts, act or tell, until an outcome) and the other repos' schedulers map onto skilled bots' cron, queue and git-hook triggers, and what is the smallest change that closes the gap?
- [x] Which OpenBot parts does a small team not need (enterprise, multi-tenant, Kubernetes, managed upgrades, mobile), which code in the eight repos can be reused directly under its license, and what ranked build order should a first build packet follow?
- [x] How should a routine's until outcome be evaluated after each run from an existing BOT.md precheck or stop expression, without adding a scheduler?
- [x] What is the smallest deterministic sentence-to-trigger planner that maps routine text onto cron, queue and git-hook kinds?
- [x] How should missed routine windows and a 15-minute floor map onto launchd calendar entries and the queue drain's retry bound?
- [x] Which OpenBot routine guardrails, the 20-enabled cap and failure-streak auto-off, belong in run records and the status index for a small team?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Building or specifying a desktop application; the run compares terminal and desktop only.
- Implementing any change; findings and a ranked build order are the deliverable.
- Designing enterprise, multi-tenant, Kubernetes, managed-upgrade or mobile capability; those are assessed only as a skip list.

---

## 5. STOP CONDITIONS

- The configured 13-iteration cap is reached.
- The 120-minute duration budget is exhausted.
- No productive in-scope path remains after recovery attempts.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- How do OpenBot routines (sentence form, time and event starts, act or tell, until an outcome) and the other repos' schedulers map onto skilled bots' cron, queue and git-hook triggers, and what is the smallest change that closes the gap?
- Which OpenBot parts does a small team not need (enterprise, multi-tenant, Kubernetes, managed upgrades, mobile), which code in the eight repos can be reused directly under its license, and what ranked build order should a first build packet follow?
- How should a routine's until outcome be evaluated after each run from an existing BOT.md precheck or stop expression, without adding a scheduler?
- What is the smallest deterministic sentence-to-trigger planner that maps routine text onto cron, queue and git-hook kinds?
- How should missed routine windows and a 15-minute floor map onto launchd calendar entries and the queue drain's retry bound?
- Which OpenBot routine guardrails, the 20-enabled cap and failure-streak auto-off, belong in run records and the status index for a small team?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the canonical prose document first, then the planner and the runtime trigger schema, produced a direct mapping between OpenBot's four parts and skilled bots' four trigger kinds without guessing at implementation. (iteration 1)
- Reading the deployment documents before the licenses separated what a small team actually runs from what a fleet needs, so the skip list followed from deployment shape rather than from feature names. (iteration 2)
- Reading the precheck call site and the terminal outcome path together showed the exact seam for an after-run check, so the recommendation names real functions rather than a new subsystem. (iteration 3)
- Reading the two permissive implementations as complementary directions (cron to text, preset to cron) produced a deterministic bridge without inventing a grammar. (iteration 4)
- Reading the slot-accounting module first showed that most of the missed-window policy already exists, so the recommendation narrowed to the floor and the queue staleness bound instead of proposing a new scheduler feature. (iteration 5)
- Reading the status index before the switches showed that the streak can be derived from existing run rows, so the change stays out of the definition and the scheduler. (iteration 6)
- Reading the needs-you store and the status index before the OpenBot approval doc made the layering clear: storage and resume already exist, and the gap is presentation plus per-action policy. (iteration 7)
- Reading the headless dispatch contract before the OpenBot conversation model made the size estimate honest: chat is a new surface, not a CLI flag. (iteration 8)
- Reading the prompt builder before the memory model showed exactly where memory and skill text would enter a run, so the change stayed a prompt addition rather than a new service. (iteration 9)
- Reading the existing posture and worktree modules first showed that the computer half is mostly present, so the recommendation narrowed to exposing it rather than building it. (iteration 10)
- Reading the repository identity and state root before the OpenBot team scope showed that the small-team model is already OS-level, so the recommendation is a documented ownership field rather than an auth system. (iteration 11)
- Reading the desktop install and update documents showed that most of the desktop's extra value is delivery and browser embedding, so the recommendation separates the information model from the shell. (iteration 12)
- Consolidating by part, then ranking by reused substrate, produced a build order that starts with a visible routine list rather than the largest new surface. (iteration 13)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Searching OpenBot's API tree for routine code produced only OpenAPI descriptions, because the routine logic is app-side and shared-package code rather than an API module. (iteration 1)
- A license-file-only pass would have misclassified OpenMausBot's enterprise directory as Apache-2.0; only the licensing carve-out document made the boundary visible. (iteration 2)
- Searching for an existing post-run hook found none, which initially looked like a missing dependency but is actually the gap the change fills. (iteration 3)
- Looking for a parser in skilled bots found none, which is the gap rather than a missing dependency. (iteration 4)
- Searching the installer for a floor found none, because the translator is the only schedule guard and it accepts every-minute expressions. (iteration 5)
- Searching for an existing cap found only evidence-size caps, which look similar by name but bound different things. (iteration 6)
- Searching for an action-approval policy found only authoring approval, which shares the word but not the layer. (iteration 7)
- Searching the bots CLI for a chat verb found none, which is the gap rather than an oversight. (iteration 8)
- Searching BOT.md for memory keys found none, which is the gap rather than a missing file. (iteration 9)
- Searching BOT.md for an apps or vault key found none, which is the connector gap rather than an oversight. (iteration 10)
- Searching for a user model found none, because the runtime deliberately keys state by repository and OS user rather than by application account. (iteration 11)
- Looking for a terminal UI in OpenBot found none, so the reference had to come from Turnstone and openhuman. (iteration 12)
- A single parity packet was rejected because the eight parts touch different subsystems and one packet would be too large to verify. (iteration 13)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A license file alone is not enough for OpenMausBot: its `LICENSING.md` carve-out removes `enterprise/` from the Apache grant, which a LICENSE-only reading would have missed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A license file alone is not enough for OpenMausBot: its `LICENSING.md` carve-out removes `enterprise/` from the Apache grant, which a LICENSE-only reading would have missed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A license file alone is not enough for OpenMausBot: its `LICENSING.md` carve-out removes `enterprise/` from the Apache grant, which a LICENSE-only reading would have missed.

### A single "big bang" parity packet: the eight parts touch different subsystems, and one packet would be too large to verify. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: A single "big bang" parity packet: the eight parts touch different subsystems, and one packet would be too large to verify.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single "big bang" parity packet: the eight parts touch different subsystems, and one packet would be too large to verify.

### Adding a fatigue counter to each BOT.md definition: the definition is authored state, and the count is runtime history that belongs with run records. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Adding a fatigue counter to each BOT.md definition: the definition is authored state, and the count is runtime history that belongs with run records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a fatigue counter to each BOT.md definition: the definition is authored state, and the count is runtime history that belongs with run records.

### Adding a goal store to evaluate outcomes: a single `until` command per routine is enough for a small team, and OpenBot's goal graph is only needed for multi-routine goals. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Adding a goal store to evaluate outcomes: a single `until` command per routine is enough for a small team, and OpenBot's goal graph is only needed for multi-routine goals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a goal store to evaluate outcomes: a single `until` command per routine is enough for a small team, and OpenBot's goal graph is only needed for multi-routine goals.

### Adding a new approvals database: needs-you items already model the parked-run question and answer, and the status index already indexes them. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Adding a new approvals database: needs-you items already model the parked-run question and answer, and the status index already indexes them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new approvals database: needs-you items already model the parked-run question and answer, and the status index already indexes them.

### Adding a new missed-window mechanism for cron: slot accounting already implements skip-not-replay with lateness classes and skipped-slot evidence. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Adding a new missed-window mechanism for cron: slot accounting already implements skip-not-replay with lateness classes and skipped-slot evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new missed-window mechanism for cron: slot accounting already implements skip-not-replay with lateness classes and skipped-slot evidence.

### Adopting OpenBot's Kubernetes charts or managed-upgrade agent for a small team: both solve fleet problems (per-person computers, many installs) that a single host does not have. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adopting OpenBot's Kubernetes charts or managed-upgrade agent for a small team: both solve fleet problems (per-person computers, many installs) that a single host does not have.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting OpenBot's Kubernetes charts or managed-upgrade agent for a small team: both solve fleet problems (per-person computers, many installs) that a single host does not have.

### Applying the launchd slot policy to queue requests unchanged: a queue request has no schedule slot, so it needs its own staleness bound rather than the launchd grace window. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Applying the launchd slot policy to queue requests unchanged: a queue request has no schedule slot, so it needs its own staleness bound rather than the launchd grace window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Applying the launchd slot policy to queue requests unchanged: a queue request has no schedule slot, so it needs its own staleness bound rather than the launchd grace window.

### Building a browser-driving computer from scratch: OpenBot's browser and handover are a large surface, and the worktree already gives a Bot a real command line and files. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Building a browser-driving computer from scratch: OpenBot's browser and handover are a large surface, and the worktree already gives a Bot a real command line and files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a browser-driving computer from scratch: OpenBot's browser and handover are a large surface, and the worktree already gives a Bot a real command line and files.

### Building a desktop shell first: the four app surfaces are data views a TUI can render, and the desktop's extra value is delivery and browser embedding rather than missing primitives. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Building a desktop shell first: the four app surfaces are data views a TUI can render, and the desktop's extra value is delivery and browser embedding rather than missing primitives.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a desktop shell first: the four app surfaces are data views a TUI can render, and the desktop's extra value is delivery and browser embedding rather than missing primitives.

### Building a desktop shell first: the terminal can show conversations, approvals, activity and routines from existing stores, and a desktop shell adds delivery mechanics rather than missing primitives. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Building a desktop shell first: the terminal can show conversations, approvals, activity and routines from existing stores, and a desktop shell adds delivery mechanics rather than missing primitives.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a desktop shell first: the terminal can show conversations, approvals, activity and routines from existing stores, and a desktop shell adds delivery mechanics rather than missing primitives.

### Building a password store or SSO for a few people: OS users and file permissions already separate state, and a sign-in adds a credential surface with no matching threat. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Building a password store or SSO for a few people: OS users and file permissions already separate state, and a sign-in adds a credential surface with no matching threat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a password store or SSO for a few people: OS users and file permissions already separate state, and a sign-in adds a credential surface with no matching threat.

### Building the desktop shell first: the terminal can render every app surface, and the desktop's extra value is delivery and browser embedding. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Building the desktop shell first: the terminal can render every app surface, and the desktop's extra value is delivery and browser embedding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building the desktop shell first: the terminal can render every app surface, and the desktop's extra value is delivery and browser embedding.

### Copying Buzz's YAML workflow engine wholesale: it needs a relay, Postgres and a workflow crate, which is far beyond the small-team, terminal-first scope. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Copying Buzz's YAML workflow engine wholesale: it needs a relay, Postgres and a workflow crate, which is far beyond the small-team, terminal-first scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Buzz's YAML workflow engine wholesale: it needs a relay, Postgres and a workflow crate, which is far beyond the small-team, terminal-first scope.

### Copying Composio's broker: it is a hosted account broker with hundreds of apps, far beyond a small team's connector needs; MCP servers cover the same ground with less machinery. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Copying Composio's broker: it is a hosted account broker with hundreds of apps, far beyond a small team's connector needs; MCP servers cover the same ground with less machinery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Composio's broker: it is a hosted account broker with hundreds of apps, far beyond a small team's connector needs; MCP servers cover the same ground with less machinery.

### Copying OpenBot's "Everyone" admin scope: it administers many people's access to eight primitives, which is more than a small team needs. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Copying OpenBot's "Everyone" admin scope: it administers many people's access to eight primitives, which is more than a small team needs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's "Everyone" admin scope: it administers many people's access to eight primitives, which is more than a small team needs.

### Copying OpenBot's action-recognition table wholesale: it is tuned to browser and app tool names, and skilled bots' executor exposes a different tool surface. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Copying OpenBot's action-recognition table wholesale: it is tuned to browser and app tool names, and skilled bots' executor exposes a different tool surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's action-recognition table wholesale: it is tuned to browser and app tool names, and skilled bots' executor exposes a different tool surface.

### Copying OpenBot's automatic-learning pipeline: Intelligence containers, per-person spaces and sharing review are enterprise-scale machinery, not a small-team need. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Copying OpenBot's automatic-learning pipeline: Intelligence containers, per-person spaces and sharing review are enterprise-scale machinery, not a small-team need.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's automatic-learning pipeline: Intelligence containers, per-person spaces and sharing review are enterprise-scale machinery, not a small-team need.

### Copying OpenBot's server-side sweep and advisory-lock scheduler: skilled bots has no server process and does not need one; launchd, the queue drain and the git hook already provide the firing and single-claim semantics for a small team. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Copying OpenBot's server-side sweep and advisory-lock scheduler: skilled bots has no server process and does not need one; launchd, the queue drain and the git hook already provide the firing and single-claim semantics for a small team.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's server-side sweep and advisory-lock scheduler: skilled bots has no server process and does not need one; launchd, the queue drain and the git hook already provide the firing and single-claim semantics for a small team.

### Copying OpenBot's Tauri app: it is a full installer/updater/engine manager, far larger than a small team's terminal-first scope. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Copying OpenBot's Tauri app: it is a full installer/updater/engine manager, far larger than a small team's terminal-first scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenBot's Tauri app: it is a full installer/updater/engine manager, far larger than a small team's terminal-first scope.

### Copying OpenMausBot's `enterprise/` code: the directory is outside the Apache-2.0 grant and needs a commercial license for production use. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Copying OpenMausBot's `enterprise/` code: the directory is outside the Apache-2.0 grant and needs a commercial license for production use.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying OpenMausBot's `enterprise/` code: the directory is outside the Apache-2.0 grant and needs a commercial license for production use.

### Evaluating `until` on failed runs: a failed run has no outcome to judge, and treating its failure as "not met" would hide the failure behind a routine continuation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Evaluating `until` on failed runs: a failed run has no outcome to judge, and treating its failure as "not met" would hide the failure behind a routine continuation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Evaluating `until` on failed runs: a failed run has no outcome to judge, and treating its failure as "not met" would hide the failure behind a routine continuation.

### Lifting openhuman code directly: its GPL-3.0 license would impose copyleft on the combined work, so it is a design reference only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Lifting openhuman code directly: its GPL-3.0 license would impose copyleft on the combined work, so it is a design reference only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting openhuman code directly: its GPL-3.0 license would impose copyleft on the combined work, so it is a design reference only.

### Lifting openhuman-tui code: GPL-3.0 makes it a design reference only. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Lifting openhuman-tui code: GPL-3.0 makes it a design reference only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting openhuman-tui code: GPL-3.0 makes it a design reference only.

### Lifting openhuman-tui code: GPL-3.0 would impose copyleft, so it is a design reference only. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Lifting openhuman-tui code: GPL-3.0 would impose copyleft, so it is a design reference only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lifting openhuman-tui code: GPL-3.0 would impose copyleft, so it is a design reference only.

### Loading every skill into every prompt: skill bodies are long, so BOT.md must name the few it needs. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Loading every skill into every prompt: skill bodies are long, so BOT.md must name the few it needs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Loading every skill into every prompt: skill bodies are long, so BOT.md must name the few it needs.

### Looking for a terminal UI in OpenBot found none; its app is web and its desktop shell is Tauri, so the terminal reference has to come from another repo. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Looking for a terminal UI in OpenBot found none; its app is web and its desktop shell is Tauri, so the terminal reference has to come from another repo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a terminal UI in OpenBot found none; its app is web and its desktop shell is Tauri, so the terminal reference has to come from another repo.

### Looking for an existing post-run hook in the runner found only delivery and worktree cleanup; the terminal path has no outcome-evaluation stage today. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for an existing post-run hook in the runner found only delivery and worktree cleanup; the terminal path has no outcome-evaluation stage today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing post-run hook in the runner found only delivery and worktree cleanup; the terminal path has no outcome-evaluation stage today.

### Making memory a model-written free-for-all: the smallest store is a person-authored shared file plus a per-bot file, with a needs-you item when a Bot wants to add a fact. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Making memory a model-written free-for-all: the smallest store is a person-authored shared file plus a per-bot file, with a needs-you item when a Bot wants to add a fact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making memory a model-written free-for-all: the smallest store is a person-authored shared file plus a per-bot file, with a needs-you item when a Bot wants to add a fact.

### Making the fatigue stop a silent disable: OpenBot posts a final message, and a silent stop would leave a person wondering why the routine stopped. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Making the fatigue stop a silent disable: OpenBot posts a final message, and a silent stop would leave a person wondering why the routine stopped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making the fatigue stop a silent disable: OpenBot posts a final message, and a silent stop would leave a person wondering why the routine stopped.

### Putting secrets in BOT.md or the prompt: the existing secret-literal check exists precisely to keep them out. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Putting secrets in BOT.md or the prompt: the existing secret-literal check exists precisely to keep them out.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Putting secrets in BOT.md or the prompt: the existing secret-literal check exists precisely to keep them out.

### Reading only `routines.md` would have missed the act/tell and until semantics that `how-openbot-works.md` states as the canonical four-part table. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading only `routines.md` would have missed the act/tell and until semantics that `how-openbot-works.md` states as the canonical four-part table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading only `routines.md` would have missed the act/tell and until semantics that `how-openbot-works.md` states as the canonical four-part table.

### Reading OpenBot's deployment doc alone would have suggested Kubernetes is the normal path; the minimum-size and single-container sections show the one-host path is fully supported. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading OpenBot's deployment doc alone would have suggested Kubernetes is the normal path; the minimum-size and single-container sections show the one-host path is fully supported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading OpenBot's deployment doc alone would have suggested Kubernetes is the normal path; the minimum-size and single-container sections show the one-host path is fully supported.

### Reading OpenMausBot's `routine-cron-text.ts` as a parser would be wrong: it renders cron to a sentence, and the reverse direction lives in Rakazo's `cronFromPreset`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading OpenMausBot's `routine-cron-text.ts` as a parser would be wrong: it renders cron to a sentence, and the reverse direction lives in Rakazo's `cronFromPreset`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading OpenMausBot's `routine-cron-text.ts` as a parser would be wrong: it renders cron to a sentence, and the reverse direction lives in Rakazo's `cronFromPreset`.

### Replaying every missed occurrence: both OpenBot and the existing slot accounting explicitly reject a backfill burst. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Replaying every missed occurrence: both OpenBot and the existing slot accounting explicitly reject a backfill burst.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replaying every missed occurrence: both OpenBot and the existing slot accounting explicitly reject a backfill burst.

### Reusing `precheck` as the until field: it runs before dispatch and its silent marker skips a run, which is the opposite of completing a routine. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reusing `precheck` as the until field: it runs before dispatch and its silent marker skips a run, which is the opposite of completing a routine.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing `precheck` as the until field: it runs before dispatch and its silent marker skips a run, which is the opposite of completing a routine.

### Reusing OpenBot's planner directly: `planRoutine` maps form answers to OpenBot's routine/goal/check-in stores, not to skilled bots' trigger union, so only its four-part shape transfers. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reusing OpenBot's planner directly: `planRoutine` maps form answers to OpenBot's routine/goal/check-in stores, not to skilled bots' trigger union, so only its four-part shape transfers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing OpenBot's planner directly: `planRoutine` maps form answers to OpenBot's routine/goal/check-in stores, not to skilled bots' trigger union, so only its four-part shape transfers.

### Reusing the definition-approval hash as an action-approval policy: it proves which bytes may run, not which actions a run may take. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reusing the definition-approval hash as an action-approval policy: it proves which bytes may run, not which actions a run may take.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the definition-approval hash as an action-approval policy: it proves which bytes may run, not which actions a run may take.

### Reusing the drain backoff as the fatigue rule: the drain backoff protects the drain job from a broken setup, not a bot from a repeating failure. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reusing the drain backoff as the fatigue rule: the drain backoff protects the drain job from a broken setup, not a bot from a repeating failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the drain backoff as the fatigue rule: the drain backoff protects the drain job from a broken setup, not a bot from a repeating failure.

### Reusing the existing headless run path unchanged for chat: its prompt explicitly says nobody is at a prompt, so a chat surface needs a different prompt contract and a conversation store. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reusing the existing headless run path unchanged for chat: its prompt explicitly says nobody is at a prompt, so a chat surface needs a different prompt contract and a conversation store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the existing headless run path unchanged for chat: its prompt explicitly says nobody is at a prompt, so a chat surface needs a different prompt contract and a conversation store.

### Searching BOT.md for a memory or skill key found none; the definition has no such surface today. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Searching BOT.md for a memory or skill key found none; the definition has no such surface today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching BOT.md for a memory or skill key found none; the definition has no such surface today.

### Searching BOT.md for an apps or vault key found none; the definition has posture fields but no connector surface. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Searching BOT.md for an apps or vault key found none; the definition has posture fields but no connector surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching BOT.md for an apps or vault key found none; the definition has posture fields but no connector surface.

### Searching for a floor in the installer or definition schema found none; the only schedule guard is the translator's exact-translation rule, which accepts every-minute expressions. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a floor in the installer or definition schema found none; the only schedule guard is the translator's exact-translation rule, which accepts every-minute expressions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a floor in the installer or definition schema found none; the only schedule guard is the translator's exact-translation rule, which accepts every-minute expressions.

### Searching for a natural-language parser in skilled bots found only the cron reader; there is no text-to-schedule layer to extend. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching for a natural-language parser in skilled bots found only the cron reader; there is no text-to-schedule layer to extend.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a natural-language parser in skilled bots found only the cron reader; there is no text-to-schedule layer to extend.

### Searching for existing streak or cap code found only slot-summary and cron-dictionary caps, which bound evidence size rather than bot behavior. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Searching for existing streak or cap code found only slot-summary and cron-dictionary caps, which bound evidence size rather than bot behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for existing streak or cap code found only slot-summary and cron-dictionary caps, which bound evidence size rather than bot behavior.

### Searching OpenBot's `api/` tree for routine implementation files found only OpenAPI descriptions; the executable routine logic lives in the app and shared packages, so a server-code-only reading would have missed the planner and firing model. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching OpenBot's `api/` tree for routine implementation files found only OpenAPI descriptions; the executable routine logic lives in the app and shared packages, so a server-code-only reading would have missed the planner and firing model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching OpenBot's `api/` tree for routine implementation files found only OpenAPI descriptions; the executable routine logic lives in the app and shared packages, so a server-code-only reading would have missed the planner and firing model.

### Searching skilled bots for a per-action approval policy found only the definition-approval module and the executor sandbox, which operate at different layers. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Searching skilled bots for a per-action approval policy found only the definition-approval module and the executor sandbox, which operate at different layers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching skilled bots for a per-action approval policy found only the definition-approval module and the executor sandbox, which operate at different layers.

### Searching skilled bots for a user or role model found only repository identity and the per-user state root; there is no user account to extend. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Searching skilled bots for a user or role model found only repository identity and the per-user state root; there is no user account to extend.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching skilled bots for a user or role model found only repository identity and the per-user state root; there is no user account to extend.

### Searching the bots CLI for a conversation verb found none; the CLI is a run-control surface, not a chat surface. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Searching the bots CLI for a conversation verb found none; the CLI is a run-control surface, not a chat surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the bots CLI for a conversation verb found none; the CLI is a run-control surface, not a chat surface.

### Sharing one memory file for everything: OpenBot's split between person-added and bot-learned facts is the useful boundary, and collapsing it would leak one bot's working notes to the others. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Sharing one memory file for everything: OpenBot's split between person-added and bot-learned facts is the useful boundary, and collapsing it would leak one bot's working notes to the others.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sharing one memory file for everything: OpenBot's split between person-added and bot-learned facts is the useful boundary, and collapsing it would leak one bot's working notes to the others.

### Starting with apps and the vault: connectors widen a Bot's reach, so they should come after approvals and activity give a person a way to see and stop what a Bot did. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Starting with apps and the vault: connectors widen a Bot's reach, so they should come after approvals and activity give a person a way to see and stop what a Bot did.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with apps and the vault: connectors widen a Bot's reach, so they should come after approvals and activity give a person a way to see and stop what a Bot did.

### Starting with the conversation surface: it is the largest new surface and depends on a memory and role story that the routine packet does not. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Starting with the conversation surface: it is the largest new surface and depends on a memory and role story that the routine packet does not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with the conversation surface: it is the largest new surface and depends on a memory and role story that the routine packet does not.

### Treating `bots status` as an activity feed would lose chronology; it is a snapshot of last run and delivery, not a list of events. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating `bots status` as an activity feed would lose chronology; it is a snapshot of last run and delivery, not a list of events.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `bots status` as an activity feed would lose chronology; it is a snapshot of last run and delivery, not a list of events.

### Treating `exitReason` alone as a streak signal would miss refusals that are not failures; the check must count only terminal failed runs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating `exitReason` alone as a streak signal would miss refusals that are not failures; the check must count only terminal failed runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `exitReason` alone as a streak signal would miss refusals that are not failures; the check must count only terminal failed runs.

### Treating every event phrase as a git-hook: only repository events map to the existing hook; mail and other external events need a queue producer, and claiming otherwise would overstate parity. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating every event phrase as a git-hook: only repository events map to the existing hook; mail and other external events need a queue producer, and claiming otherwise would overstate parity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every event phrase as a git-hook: only repository events map to the existing hook; mail and other external events need a queue producer, and claiming otherwise would overstate parity.

### Treating Hermes Muse's fixed six-job table as the target: its fixed cron keys are install-time plumbing, not a user-authored routine surface, and its event intake is limited to cron plus host session hooks. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating Hermes Muse's fixed six-job table as the target: its fixed cron keys are install-time plumbing, not a user-authored routine surface, and its event intake is limited to cron plus host session hooks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Hermes Muse's fixed six-job table as the target: its fixed cron keys are install-time plumbing, not a user-authored routine surface, and its event intake is limited to cron plus host session hooks.

### Treating OS notifications as desktop-only would overstate the gap: a terminal can emit them, but it cannot show a tray or an embedded browser. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating OS notifications as desktop-only would overstate the gap: a terminal can emit them, but it cannot show a tray or an embedded browser.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating OS notifications as desktop-only would overstate the gap: a terminal can emit them, but it cannot show a tray or an embedded browser.

### Treating the drain's retry bound as a missed-window policy would conflate "this attempt failed" with "this occurrence is too old to run"; the two are different facts. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the drain's retry bound as a missed-window policy would conflate "this attempt failed" with "this occurrence is too old to run"; the two are different facts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the drain's retry bound as a missed-window policy would conflate "this attempt failed" with "this occurrence is too old to run"; the two are different facts.

### Treating the needs-you resume path as a chat loop would lose the conversation transcript, because a needs-you item holds one question and one answer, not a history. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the needs-you resume path as a chat loop would lose the conversation transcript, because a needs-you item holds one question and one answer, not a history.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the needs-you resume path as a chat loop would lose the conversation transcript, because a needs-you item holds one question and one answer, not a history.

### Treating the reuse list as a dependency list: most candidates are design references or small functions, not packages to install. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating the reuse list as a dependency list: most candidates are design references or small functions, not packages to install.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the reuse list as a dependency list: most candidates are design references or small functions, not packages to install.

### Treating the run record's `exit.reason` as an outcome signal would conflate "the run completed" with "the routine's goal is met"; those are different facts and need different fields. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the run record's `exit.reason` as an outcome signal would conflate "the run completed" with "the routine's goal is met"; those are different facts and need different fields.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the run record's `exit.reason` as an outcome signal would conflate "the run completed" with "the routine's goal is met"; those are different facts and need different fields.

### Treating the spec-kit's continuity writer as per-bot memory would conflate project continuity with a Bot's own knowledge. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating the spec-kit's continuity writer as per-bot memory would conflate project continuity with a Bot's own knowledge.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the spec-kit's continuity writer as per-bot memory would conflate project continuity with a Bot's own knowledge.

### Treating the team edition as a small-team feature would overstate its fit: its admin scope is a many-person policy layer, not a few-person permission model. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating the team edition as a small-team feature would overstate its fit: its admin scope is a many-person policy layer, not a few-person permission model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the team edition as a small-team feature would overstate its fit: its admin scope is a many-person policy layer, not a few-person permission model.

### Treating the worktree as a full computer would overstate parity: it has files and commands, not a browser or a vault-filled login. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the worktree as a full computer would overstate parity: it has files and commands, not a browser or a vault-filled login.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the worktree as a full computer would overstate parity: it has files and commands, not a browser or a vault-filled login.

### Using a model to parse routine sentences at run time: it adds nondeterminism and a model call to an authoring step that a closed phrase table can cover. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Using a model to parse routine sentences at run time: it adds nondeterminism and a model call to an authoring step that a closed phrase table can cover.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using a model to parse routine sentences at run time: it adds nondeterminism and a model call to an authoring step that a closed phrase table can cover.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Copying Buzz's YAML workflow engine wholesale: it needs a relay, Postgres and a workflow crate, which is far beyond the small-team, terminal-first scope. (iteration 1)
- Copying OpenBot's server-side sweep and advisory-lock scheduler: skilled bots has no server process and does not need one; launchd, the queue drain and the git hook already provide the firing and single-claim semantics for a small team. (iteration 1)
- Reading only `routines.md` would have missed the act/tell and until semantics that `how-openbot-works.md` states as the canonical four-part table. (iteration 1)
- Searching OpenBot's `api/` tree for routine implementation files found only OpenAPI descriptions; the executable routine logic lives in the app and shared packages, so a server-code-only reading would have missed the planner and firing model. (iteration 1)
- Treating Hermes Muse's fixed six-job table as the target: its fixed cron keys are install-time plumbing, not a user-authored routine surface, and its event intake is limited to cron plus host session hooks. (iteration 1)
- A license file alone is not enough for OpenMausBot: its `LICENSING.md` carve-out removes `enterprise/` from the Apache grant, which a LICENSE-only reading would have missed. (iteration 2)
- Adopting OpenBot's Kubernetes charts or managed-upgrade agent for a small team: both solve fleet problems (per-person computers, many installs) that a single host does not have. (iteration 2)
- Copying OpenMausBot's `enterprise/` code: the directory is outside the Apache-2.0 grant and needs a commercial license for production use. (iteration 2)
- Lifting openhuman code directly: its GPL-3.0 license would impose copyleft on the combined work, so it is a design reference only. (iteration 2)
- Reading OpenBot's deployment doc alone would have suggested Kubernetes is the normal path; the minimum-size and single-container sections show the one-host path is fully supported. (iteration 2)
- Adding a goal store to evaluate outcomes: a single `until` command per routine is enough for a small team, and OpenBot's goal graph is only needed for multi-routine goals. (iteration 3)
- Evaluating `until` on failed runs: a failed run has no outcome to judge, and treating its failure as "not met" would hide the failure behind a routine continuation. (iteration 3)
- Looking for an existing post-run hook in the runner found only delivery and worktree cleanup; the terminal path has no outcome-evaluation stage today. (iteration 3)
- Reusing `precheck` as the until field: it runs before dispatch and its silent marker skips a run, which is the opposite of completing a routine. (iteration 3)
- Treating the run record's `exit.reason` as an outcome signal would conflate "the run completed" with "the routine's goal is met"; those are different facts and need different fields. (iteration 3)
- Reading OpenMausBot's `routine-cron-text.ts` as a parser would be wrong: it renders cron to a sentence, and the reverse direction lives in Rakazo's `cronFromPreset`. (iteration 4)
- Reusing OpenBot's planner directly: `planRoutine` maps form answers to OpenBot's routine/goal/check-in stores, not to skilled bots' trigger union, so only its four-part shape transfers. (iteration 4)
- Searching for a natural-language parser in skilled bots found only the cron reader; there is no text-to-schedule layer to extend. (iteration 4)
- Treating every event phrase as a git-hook: only repository events map to the existing hook; mail and other external events need a queue producer, and claiming otherwise would overstate parity. (iteration 4)
- Using a model to parse routine sentences at run time: it adds nondeterminism and a model call to an authoring step that a closed phrase table can cover. (iteration 4)
- Adding a new missed-window mechanism for cron: slot accounting already implements skip-not-replay with lateness classes and skipped-slot evidence. (iteration 5)
- Applying the launchd slot policy to queue requests unchanged: a queue request has no schedule slot, so it needs its own staleness bound rather than the launchd grace window. (iteration 5)
- Replaying every missed occurrence: both OpenBot and the existing slot accounting explicitly reject a backfill burst. (iteration 5)
- Searching for a floor in the installer or definition schema found none; the only schedule guard is the translator's exact-translation rule, which accepts every-minute expressions. (iteration 5)
- Treating the drain's retry bound as a missed-window policy would conflate "this attempt failed" with "this occurrence is too old to run"; the two are different facts. (iteration 5)
- Adding a fatigue counter to each BOT.md definition: the definition is authored state, and the count is runtime history that belongs with run records. (iteration 6)
- Making the fatigue stop a silent disable: OpenBot posts a final message, and a silent stop would leave a person wondering why the routine stopped. (iteration 6)
- Reusing the drain backoff as the fatigue rule: the drain backoff protects the drain job from a broken setup, not a bot from a repeating failure. (iteration 6)
- Searching for existing streak or cap code found only slot-summary and cron-dictionary caps, which bound evidence size rather than bot behavior. (iteration 6)
- Treating `exitReason` alone as a streak signal would miss refusals that are not failures; the check must count only terminal failed runs. (iteration 6)
- Adding a new approvals database: needs-you items already model the parked-run question and answer, and the status index already indexes them. (iteration 7)
- Copying OpenBot's action-recognition table wholesale: it is tuned to browser and app tool names, and skilled bots' executor exposes a different tool surface. (iteration 7)
- Reusing the definition-approval hash as an action-approval policy: it proves which bytes may run, not which actions a run may take. (iteration 7)
- Searching skilled bots for a per-action approval policy found only the definition-approval module and the executor sandbox, which operate at different layers. (iteration 7)
- Treating `bots status` as an activity feed would lose chronology; it is a snapshot of last run and delivery, not a list of events. (iteration 7)
- Building a desktop shell first: the terminal can show conversations, approvals, activity and routines from existing stores, and a desktop shell adds delivery mechanics rather than missing primitives. (iteration 8)
- Lifting openhuman-tui code: GPL-3.0 would impose copyleft, so it is a design reference only. (iteration 8)
- Reusing the existing headless run path unchanged for chat: its prompt explicitly says nobody is at a prompt, so a chat surface needs a different prompt contract and a conversation store. (iteration 8)
- Searching the bots CLI for a conversation verb found none; the CLI is a run-control surface, not a chat surface. (iteration 8)
- Treating the needs-you resume path as a chat loop would lose the conversation transcript, because a needs-you item holds one question and one answer, not a history. (iteration 8)
- Copying OpenBot's automatic-learning pipeline: Intelligence containers, per-person spaces and sharing review are enterprise-scale machinery, not a small-team need. (iteration 9)
- Loading every skill into every prompt: skill bodies are long, so BOT.md must name the few it needs. (iteration 9)
- Making memory a model-written free-for-all: the smallest store is a person-authored shared file plus a per-bot file, with a needs-you item when a Bot wants to add a fact. (iteration 9)
- Searching BOT.md for a memory or skill key found none; the definition has no such surface today. (iteration 9)
- Treating the spec-kit's continuity writer as per-bot memory would conflate project continuity with a Bot's own knowledge. (iteration 9)
- Building a browser-driving computer from scratch: OpenBot's browser and handover are a large surface, and the worktree already gives a Bot a real command line and files. (iteration 10)
- Copying Composio's broker: it is a hosted account broker with hundreds of apps, far beyond a small team's connector needs; MCP servers cover the same ground with less machinery. (iteration 10)
- Putting secrets in BOT.md or the prompt: the existing secret-literal check exists precisely to keep them out. (iteration 10)
- Searching BOT.md for an apps or vault key found none; the definition has posture fields but no connector surface. (iteration 10)
- Treating the worktree as a full computer would overstate parity: it has files and commands, not a browser or a vault-filled login. (iteration 10)
- Building a password store or SSO for a few people: OS users and file permissions already separate state, and a sign-in adds a credential surface with no matching threat. (iteration 11)
- Copying OpenBot's "Everyone" admin scope: it administers many people's access to eight primitives, which is more than a small team needs. (iteration 11)
- Searching skilled bots for a user or role model found only repository identity and the per-user state root; there is no user account to extend. (iteration 11)
- Sharing one memory file for everything: OpenBot's split between person-added and bot-learned facts is the useful boundary, and collapsing it would leak one bot's working notes to the others. (iteration 11)
- Treating the team edition as a small-team feature would overstate its fit: its admin scope is a many-person policy layer, not a few-person permission model. (iteration 11)
- Building a desktop shell first: the four app surfaces are data views a TUI can render, and the desktop's extra value is delivery and browser embedding rather than missing primitives. (iteration 12)
- Copying OpenBot's Tauri app: it is a full installer/updater/engine manager, far larger than a small team's terminal-first scope. (iteration 12)
- Lifting openhuman-tui code: GPL-3.0 makes it a design reference only. (iteration 12)
- Looking for a terminal UI in OpenBot found none; its app is web and its desktop shell is Tauri, so the terminal reference has to come from another repo. (iteration 12)
- Treating OS notifications as desktop-only would overstate the gap: a terminal can emit them, but it cannot show a tray or an embedded browser. (iteration 12)
- A single "big bang" parity packet: the eight parts touch different subsystems, and one packet would be too large to verify. (iteration 13)
- Building the desktop shell first: the terminal can render every app surface, and the desktop's extra value is delivery and browser embedding. (iteration 13)
- Starting with apps and the vault: connectors widen a Bot's reach, so they should come after approvals and activity give a person a way to see and stop what a Bot did. (iteration 13)
- Starting with the conversation surface: it is the largest new surface and depends on a memory and role story that the routine packet does not. (iteration 13)
- Treating the reuse list as a dependency list: most candidates are design references or small functions, not packages to install. (iteration 13)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Bounded snapshot captured before iteration 1 from the topic and the packet config:

- Primary reference: `specs/system-skilled-bots/context/OpenBot-main/`, entry point `docs/how-openbot-works.md` (eight parts in four pairs).
- Secondary references: `OpenMausBot-main`, `rakazo-main`, `openhuman-main`, `OpenGhost-main`, `hermes-muse-main`, `turnstone-main`, `buzz-main` under `specs/system-skilled-bots/context/`.
- Current runtime: `.skilled/skills/system-skilled-bots/` (BOT.md definitions), `.skilled/bin/bots.cjs` (CLI), triggers (manual, queue, git-hook, launchd), needs-you items, worktree isolation, desktop delivery, status index.
- Reuse candidates, integration points, constraints and risks are recorded per iteration as evidence is gathered.

### Bounded Context Snapshot

- Source pointers: paths above; exact line anchors recorded in each iteration file.
- Reuse candidates: not yet assessed.
- Integration points: bots CLI, trigger scripts, needs-you store, worktree isolation.
- Constraints and risks: all reference repos are read-only; every claim needs a `[SOURCE: path:line]` anchor.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 13
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/lineages/devin-2/inbox.jsonl`
- Canonical pause sentinel: `research/lineages/devin-2/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-24T20:07:00.000Z

---
title: "Implementation Plan: Hard-rule enforcement + dispatch-reliability hardening (design) [template:level_2/plan.md]"
description: "Design for wiring an existing/cheap machine check into the dispatch execution path: a hard_rules frontmatter contract + PreToolUse dispatch linter (thread 1), and flipping the shipped-but-off fan-out stall detectors to sane defaults with truthful abnormal-exit classification (thread 2)."
trigger_phrases:
  - "dispatch preflight linter design"
  - "hard rules frontmatter contract"
  - "fanout stall detector defaults"
  - "stdin redirect enforcement design"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-skill-advisor/009-hard-rule-and-dispatch-preflight-hardening"
    last_updated_at: "2026-07-05T05:56:04.453Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the D+B+A' design with per-component mount points"
    next_safe_action: "Operator resolves 6 open questions in decision-record"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hard-rule enforcement + dispatch reliability hardening

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan states the approach, architecture, phases, testing, and rollback.
- Distinguish confirmed (file:line) from inferred; mark plan-only where nothing shipped.
FAILURE MODES:
- Optimistic done-language, unverified mount points, phases that imply code was written.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

> **PLAN ONLY.** No files were edited producing this design. File:line citations are marked
> **[verified]** (freshly read/grepped against the live repo during the synthesis pass) or
> **[per report]** (inherited from a source thread's own citation, to be re-confirmed before coding).

### Technical Context

Both threads of the deep research converge on one failure shape: **a machine check that would close
the gap already exists or is nearly free to build, but nothing in the execution path runs it before
the risky action.** Thread 1: documentation density is not the bottleneck — the stdin rule appears 13+
times across 6 files; the gap is the absence of any machine check between the prose and the composed
command. Thread 2: the fix already exists in code (stall watchdog, progress heartbeat, lag-ceiling
abort-requeue are all shipped and unit-tested) — it is just never invoked.

### Overview

Ship the two **enforceable** options now: **D** (flip the shipped-but-off fan-out detectors + make
abnormal-exit classification truthful) and **B** (a dispatch preflight linter — a PreToolUse hook plus
an in-process fan-out guard). Ship **A′** (a minimal `hard_rules` SKILL.md frontmatter slice) as B's
data source. **Defer C** (Gate-2 brief echo). **Reject E** (self-attested checklist) as a standalone
mechanism. This is the minimal set that covers both threads, passes both acceptance tests, and reuses
shipped code/patterns.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Both threads' findings captured with file:line evidence (done — see Architecture §Findings).
- Both acceptance tests defined and mapped to a design element (done — see Testing Strategy).
- Operator open questions enumerated (done — `decision-record.md`).

### Definition of Done (for the future implementation packet, NOT this phase)
- AC-1 and AC-2 fixtures pass, mutation-proved.
- Baseline-before/delta captured for the deep-loop-runtime + skill-advisor suites.
- Every INFERRED ledger item re-confirmed against live code before its edit.
- No new comment-hygiene / alignment-drift findings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Findings (grounding evidence, so this plan stands alone)

**Thread 1 — skill-advisor / skill-preload surface.**
- The Gate-2 hook brief never surfaces hard-rules. The `UserPromptSubmit` brief
  (`user-prompt-submit.ts` → `skill-advisor-brief.ts` → `render.ts:191-200` **[per report]**) emits one
  of two fixed templates: freshness + top skill label + confidence/uncertainty, plus two universal
  boilerplate directives identical on every prompt. The passive path shows a skill name and score,
  never its rules.
- The richer `advisor_recommend` MCP tool can return `matchedDocs` (≤3 doc *paths* to read), never
  inlined rule content.
- Zero structured hard-rule surface exists: no `SKILL.md` frontmatter across the 18 top-level skills
  carries a `hardRules`/`gotchas`/`invocationRules` key. 100% of hard-rules live in prose.
- cli-opencode hard-rule catalog (prose-only unless noted): the `</dev/null` stdin rule
  (`cli-opencode/SKILL.md:269,309,321`; `references/integration_patterns.md:280-364`); no top-level
  `--agent general`; `--command <family>/<name>` for slash prompts (**silent** failure today); `--share`
  needs confirmation; destructive-scope mitigation. The one existing self-attest control shape
  (`constitutional/cli-dispatch-skill-preload.md`) demonstrably rotted — the key argument against E.

**Thread 2 — dispatch / executor reliability (forensically grounded).**
- The two incidents are distinct. Incident A (manual stdin hang) does not reach the orchestrator's own
  spawns — `fanout-run.cjs` is `</dev/null`-safe for all three lineage kinds by construction
  (`cli-claude-code` → `stdio:['ignore',...]` `:1213`; `cli-opencode`/`native` → `input:''` then
  `child.stdin.end('')` `:1285-1288`, both **[per report]**).
- Incident B forensic proof: `031-.../review/orchestration-status.log` holds a lone `started` event and
  nothing else; its `orchestration-summary.json` is stale, proving `main()`'s terminal path
  (`:1809` → `:1819-1821` **[per report]**) never ran. Same pattern in `anobel.com/004-bento-visuals/`
  and `030-deep-loop-improved/review/` (resolved only via `orphan_requeued` 48h+ later).
- Why nothing caught it: subprocess timeout is hours-scale (`:1061-1067`); `startLineageStallWatchdog`
  (`:1147-1150`) no-op unless `stallWatchdogMs>0`, default 0 (`:646-653`); `startLineageProgressHeartbeat`
  default 0 (`executor-config.ts:278`); lag-ceiling abort-requeue opt-in, zero matches in
  `.opencode/commands/deep/`. The `/deep:review` YAML never sets any of the three.
- Positive contrast: with `progressHeartbeatSeconds` set (60s, `030-.../research/`) + operator SIGTERM,
  a clean `stopped` event was recorded — the graceful path works when opted in. But `pkill -9` (the
  documented kill) is uncatchable (`cli-guards.cjs:103-116` = SIGINT/SIGTERM only).
- Exit-code classification is not truthful: `:1702-1703` **[per report]** treats only the orchestrator's
  own SIGTERM as abnormal; any other signal computes `exitCode=0`.

### Ranked design options

| Rank | Option | Mechanism | Leverage | Cost | Enforceable? | Verdict |
|---|---|---|---|---|---|---|
| 1 | **D** — stall/liveness detector + non-zero-exit-on-abnormal | Flip 3 shipped off-by-default knobs + truthful exit classification | 5/5 | 2/5 | **Yes** | Best ratio; zero new mechanism. Ship first. |
| 2 | **B** — dispatch preflight linter (pre-spawn) | New `PreToolUse(Bash)` hook + in-process fanout guard, shared check module | 5/5 | 4/5 | **Yes** | Only option that mechanically stops Incident A before spawn. |
| 3 | **A** — structured `hard_rules` frontmatter + parser | New frontmatter key + small parser (mirrors doc-frontmatter harvest) | 3/5 | 3/5 | Substrate | Not a standalone fix; makes B data-driven. Not skippable. |
| 4 | **C** — Gate-2 brief echoes top-N hard-rules | Thread `hard_rules`→brief, appended outside token cap | 2/5 | 2/5 | Advisory | Prose visibility is not the bottleneck. Defer. |
| 5 | **E** — runtime acknowledge-checklist | Agent self-attests a checklist | 1/5 | 2/5 | Advisory | Worst ratio; this shape already rotted here. Reject standalone. |

### Pattern

**One source of truth (`hard_rules:` frontmatter), two independent read paths** — deliberately
decoupled so the enforceable path never depends on the advisor daemon:

```
              SKILL.md `hard_rules:` frontmatter   (single source of truth)
                     /                                        \
     read directly off disk, no daemon,            harvested into skill_hard_rules table
     synchronous, at hook/spawn time               (flag-gated, advisor scoring/display only)
            |                                                  |
   [B] dispatch preflight linter                      [C] Gate-2 brief echo (deferred)
   (works even if the daemon is down)                 (advisory text, depends on daemon)
```

### Key Components

- **Option D (deep-loop):** `executor-config.ts:277-278` Zod defaults **[verified]**;
  `fanout-run.cjs:645-653` raw-alias reader for `stallWatchdogMs` (schema-bypass trap) **[verified]**;
  the two `/deep:review` YAML assets **[per report]**; abnormal-exit classification `:1702-1703` +
  `main()`'s summary→exit chain `:1809/:1819-1821` **[per report — re-walk before coding]**.
  Proposed defaults: `progressHeartbeatSeconds: 60` (evidence-backed, 90-min precedent);
  `stallWatchdogMs`/`lagCeilingMs: 300000ms` (proposal, needs sign-off). Test scaffolding for all three
  knobs already exists (`fanout-run.vitest.ts:1526,1582,1731,1775`, `executor-config.vitest.ts:227-300`
  **[verified]**).
- **Option A′ (skill-advisor):** a v0 `hard_rules` frontmatter slice on `cli-opencode/SKILL.md` +
  `cli-claude-code/SKILL.md` (rules: `stdin-redirect-required`, `no-bare-agent-general`,
  `command-flag-for-slash-prompt`, `share-requires-confirmation`, and a
  `non-interactive-permission-mode-risk` rule for cli-claude-code). New sibling parser
  `mcp_server/lib/skill-graph/skill-hard-rules.ts` (do not overload `doc-frontmatter.ts`). Extend
  `check-skill-doc-frontmatter.mjs` to validate `hard_rules[].check` against a known-checks enum.
- **Option B (skill-advisor enforcement core):** shared `dispatch-rule-checks.mjs` (pure functions
  keyed by `check` id). **B2** — new `PreToolUse(Bash)` hook `cli-opencode/scripts/hooks/
  dispatch-preflight-lint.mjs`: fast-exit registry (`/\bopencode\s+run\b/`, `/\bclaude\s+-p\b/`), read
  `hard_rules[]` off disk, run checks, block on `severity: block` / warn on `warn`, **fail-open** on its
  own errors. Rollout starts every rule at `warn`. **B1** — in-process guard after
  `buildLineageCommand(...)` returns (`fanout-run.cjs:~1295-1373` **[verified]**), co-located in
  `scripts/lib/cli-guards.cjs` **[verified path]**, as a regression tripwire.

### Data Flow

Compose command → (manual path) PreToolUse hook fires → fast-exit unless a dispatch shape → resolve
skill → read its `hard_rules` off disk → run checks → block/warn before spawn. In parallel, the
orchestrated path: `buildLineageCommand` → B1 in-process guard → spawn. Option D runs inside the
spawned lineage's lifecycle: heartbeat/stall-watchdog/lag-ceiling now non-zero → on stall, a labeled
`aborted`/`stall_detected` event + non-zero orchestrator exit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | File | Change (in the future impl packet) |
|---|---|---|
| Deep-loop config | `deep-loop-runtime/lib/deep-loop/executor-config.ts` | non-zero Zod defaults |
| Deep-loop runtime | `deep-loop-runtime/scripts/fanout-run.cjs` | raw-alias default + exit-code truth + B1 guard call |
| Deep-loop guards | `deep-loop-runtime/scripts/lib/cli-guards.cjs` | house the B1 guard |
| Command assets | `.opencode/commands/deep/assets/deep_review_auto.yaml`, `deep_review_confirm.yaml` | set the three keys |
| Skill frontmatter | `cli-opencode/SKILL.md`, `cli-claude-code/SKILL.md` | `hard_rules:` slice |
| Advisor lib | `system-skill-advisor/mcp_server/lib/skill-graph/skill-hard-rules.ts` | new parser |
| Advisor CI | `system-skill-advisor/mcp_server/scripts/check-skill-doc-frontmatter.mjs` | known-checks validation |
| Dispatch checks | `cli-opencode/scripts/hooks/dispatch-preflight-lint.mjs`, `dispatch-rule-checks.mjs` | new linter + shared module |
| Hook wiring | `.claude/settings.json` | new `PreToolUse(Bash)` block |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

> These phases belong to the FUTURE implementation packet. Nothing here is executed in this
> plan-only phase. See `tasks.md` for the itemized T00-T18 handoff.

### Phase 1: Setup
Wave 1 (Option D config): flip the three detector defaults (Zod + raw reader) and set them explicitly
in both `/deep:review` YAML assets. Pure config, zero new code.

### Phase 2: Core Implementation
D exit-code truth (re-walk `main()` first); A′ frontmatter slice + parser + CI validator; B2 PreToolUse
hook (confirm block-response schema first, every rule at `warn`); B1 in-process fan-out guard.

### Phase 3: Verification
AC-1 + AC-2 fixtures (mutation-proved); baseline/delta on both suites; burn-in then warn→block
promotion for the two most severe rules.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

**AC-1 — would this have BLOCKED/hard-warned the missing-`</dev/null` invocation before spawn? Yes, via
B2.** Fixture: feed `{"tool_name":"Bash","tool_input":{"command":"opencode run \"some prompt\""}}` to
`dispatch-preflight-lint.mjs` → expect block/warn citing `stdin-redirect-required`; append `</dev/null`
→ expect a clean pass. This incident bypasses `fanout-run.cjs` entirely, so B2 specifically — not B1,
not D — is the mechanism this test needs.

**AC-2 — would this have DETECTED and failed loudly the 0-iteration stall? Yes, via D.** Fixture:
replay the `031-.../review` shape (a worker that writes zero iteration files and never exits) under a
fanout config with a test-scale `lagCeilingMs` (e.g. 2000ms). Assert (a) an
`aborted`/`stall_detected`/`orphan_requeued`-class event appears within a bounded window instead of
never, and (b) the orchestrator's own exit code is non-zero. The exit-code-truth half is the
inferred/confirmed-mount-point sub-step — re-read `main()` before coding.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The shipped doc-frontmatter harvest (`doc-frontmatter.ts`, `check-skill-doc-frontmatter.mjs`
  **[verified]**) — the pattern A′ mirrors.
- The three shipped-but-off detectors and their existing test fixtures **[verified]**.
- The existing `.claude/settings.json` hook-wiring convention (UserPromptSubmit/PostToolUse) — B2's
  new `PreToolUse` block mirrors it. No existing PreToolUse hook exists in the repo (open Q3).
- Operator sign-off on open questions Q2 (defaults) and Q3 (block-response schema) blocks the
  corresponding tasks.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase ships no code, so there is nothing to roll back. The future implementation packet owns
rollback; because Option D is config-first and Option B rolls out warn-before-block, each wave is
independently revertible with a single `git revert` and no data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- D-exit-code-truth (phase 2) depends on D-config (phase 1) — there is nothing to classify until the
  detectors are live.
- B2 (phase 2) depends on A′ (phase 2) — the linter reads the rules A′ declares.
- B1 depends on B2's shared check module. warn→block promotion depends on the burn-in window.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small-to-moderate for the implementation packet: Option D is a config flip + one classification edit +
fixture extensions; A′ is data + a small pure parser; B is one hook script + one shared module + one
in-process call. The bulk of the intellectual work (root-cause, mount points, ranked options) is done
here in the design.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm the three inferred ledger items against live code before their edits.
- Confirm the PreToolUse block-response schema for the installed Claude Code version.
- Land B rules at `severity: warn` only; do not promote to `block` before burn-in.

### Rollback Procedure
- Per-wave `git revert`. Option D config revert restores the prior off-by-default behavior; B revert
  removes the `PreToolUse` block and the linter scripts; A′ revert removes the frontmatter slice.

### Data Reversal
- None. No persistent data is written by any wave; the detectors emit ledger events into the existing
  observability stream, and the linter is stateless.
<!-- /ANCHOR:enhanced-rollback -->

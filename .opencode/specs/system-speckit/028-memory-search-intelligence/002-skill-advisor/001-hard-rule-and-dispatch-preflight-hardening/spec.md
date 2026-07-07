---
title: "Feature Specification: Hard-rule enforcement + dispatch-reliability hardening [template:level_2/spec.md]"
description: "Two dispatch-path failures — a manual opencode run with no stdin redirect that hung at 0% CPU, and a fanout lineage that stalled at 0 iterations with no terminal event — both trace to the same shape: a machine check that would have caught it exists or is nearly free, but nothing in the execution path runs it before the risky action. Implemented on-branch 2026-07-05 (Wave D + A′ + B2); both acceptance tests met."
trigger_phrases:
  - "hard rule enforcement"
  - "dispatch preflight linter"
  - "dev null stdin redirect rule"
  - "fanout stall watchdog default"
  - "skill advisor hard rules frontmatter"
  - "opencode run hang 0 cpu"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-skill-advisor/001-hard-rule-and-dispatch-preflight-hardening"
    last_updated_at: "2026-07-05T08:13:59.253Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped Wave D + A'+B2 hardening; both acceptance tests met"
    next_safe_action: "Follow-up: B1 fan-out guard + burn-in warn->block promotion"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-hardrule-dispatch-plan"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Plan-doc home: 002-skill-advisor/009 vs 004-deep-loop/008 vs split twins"
      - "RESOLVED: Q2 stall default = 300000ms (operator go); Wave D shipped"
      - "RESOLVED: PreToolUse block schema = hookSpecificOutput.permissionDecision deny"
      - "Burn-in window before warn->block promotion"
      - "A' frontmatter scope at v0 (cli-opencode + cli-claude-code only?)"
      - "Bundle the cli-dispatch-skill-preload.md drift re-verify here or separately"
    answered_questions:
      - "Deliverable: plan only (operator-elected)"
      - "Scope: cover BOTH skill-advisor hard-rule surfacing AND dispatch reliability"
      - "Research: outsourced to Sonnet-5 max two-thread + synthesis workflow"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hard-rule enforcement + dispatch-reliability hardening

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In progress — core shipped (Wave D + A′ + B2, both acceptance tests met); B1 + burn-in follow-up |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Phase kind** | Implementation — design shipped on-branch (commits in implementation-summary.md) |
| **Deliverable** | `plan.md` (design) + `decision-record.md` (decision + open questions) |
| **Source** | Two-thread Sonnet-5 (max-effort) deep research + synthesis, 2026-07-05 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two distinct dispatch-path failures in this session's history share one root shape.

**Incident A — manual `opencode run` with no stdin redirect.** A non-interactive `opencode run`
dispatched directly through Bash (not via the fan-out orchestrator) inherited the parent's stdin.
opencode v1.14.39 reads stdin at startup before session creation; with stdin left open it hangs
indefinitely at 0% CPU, emitting zero bytes — indistinguishable from live work. The fix (`</dev/null`)
is documented in ≥6 files with 13+ occurrences across `cli-opencode` docs, yet the rule was still
missed at compose time because nothing checks the composed command string before it spawns.

**Incident B — a fan-out lineage that stalled at 0 iterations.** A `claude-review` lineage in
`deep-loops/031-.../review/` recorded a single `started` event (2026-07-04T20:02:18Z) and no terminal
event, ever — the orchestrator's summary was never rewritten, proving `main()`'s exit path never ran
for it. Three real-time stall detectors are shipped and unit-tested (`startLineageStallWatchdog`,
`startLineageProgressHeartbeat`, and the `fanout-pool.cjs` lag-ceiling abort-requeue), but all three
default OFF and none are set by the production `/deep:review` YAML — so the stall was silent until the
next invocation's orphan-sweep would notice (a 48h+ gap was observed in a sibling packet). The
orphaned-`started` pattern recurs across 4 packets.

**Unifying thesis:** in both cases a machine check that would close the gap already exists, or is
nearly free to build — but nothing in the execution path runs it before the risky action. The fix is
to wire an existing/cheap check into the actual execution path, not write more documentation
(Incident A) or add another advisory surface (Incident B).

**Purpose:** produce an implementation-ready design that makes the two named checks mandatory and
truthful, covering both the skill-advisor hard-rule surfacing/enforcement thread and the
deep-loop/cli-dispatch reliability thread.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope (design only):**
- A dispatch preflight linter that inspects a composed `opencode run` / `claude -p` command before
  spawn and blocks/warns on known-bad shapes (missing stdin redirect first).
- A minimal `hard_rules` SKILL.md frontmatter contract so skills declare their own checkable rules as
  data, plus a small parser and a CI shape-check.
- Flipping the three shipped-but-off stall/liveness detectors to sane non-zero defaults, and making
  abnormal-termination exit-code classification truthful.
- The rollout order, the two acceptance tests, and the operator open questions.

**Out of scope:**
- Writing any of the above code — this is plan only.
- The full sqlite-backed `hard_rules` harvest pipeline (advisor scoring influence) — deferred/optional.
- The Gate-2 brief hard-rule echo (option C) — deferred to a second wave.
- A self-attested acknowledge-checklist gate (option E) — rejected as a standalone mechanism.
- Normalizing the stale `system-spec-kit`→`system-speckit` prefix across the 002-skill-advisor parent
  and its 001-008 children — a separate, operator-gated subtree reconciliation.
- Any pre-existing template-anchor / level-match validation errors in unrelated phases.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- REQ-001: The design MUST satisfy AC-1 — block or hard-warn a missing-`</dev/null` `opencode run`
  before it spawns.
- REQ-002: The design MUST satisfy AC-2 — detect and fail loudly a 0-iteration fan-out stall.
- REQ-003: The design MUST cover BOTH threads — skill-advisor hard-rule surfacing/enforcement AND
  deep-loop/cli-dispatch reliability.
- REQ-004: The enforcement path MUST NOT depend on the advisor/memory daemon being alive (a suspected
  contributor to Incident B must not become a dependency of the fix).
- REQ-005: Every recommended component MUST name a confirmed mount point (file:line); inferred
  sub-steps MUST be labeled for re-confirmation before coding.
- REQ-006: The design MUST reuse existing shipped code/patterns (the doc-frontmatter harvest, the three
  detectors, the existing hook-wiring convention) rather than invent new infrastructure.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both research threads' load-bearing findings are captured in `plan.md` with file:line evidence, so
  the design survives the ephemeral workflow transcript.
- Both acceptance tests map to a specific design element (AC-1 → Option B2; AC-2 → Option D).
- The recommended design is the minimal set that covers both threads and passes both tests.
- The operator open questions are enumerated in `decision-record.md`.
- No production behavior changed (plan only) — verified by the absence of any code/config edit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False-positive risk of aggressive defaults.** Option D's `stallWatchdogMs`/`lagCeilingMs` default
  (proposed 5 min) is a proposal, not evidence-backed like `progressHeartbeatSeconds: 60`. Too
  aggressive risks false-aborting a slow-but-healthy lineage. Mitigated by operator sign-off (open Q2).
- **The partial-fix trap.** `stallWatchdogMs` is read via a raw alias reader that bypasses the Zod
  schema; flipping only the schema defaults leaves it silently off. Mitigated by naming all three
  knobs explicitly in the rollout checklist.
- **Unknown PreToolUse block-response schema.** The repo has zero existing PreToolUse hooks to copy;
  the block-response field shape must be confirmed against the installed Claude Code version (open Q3).
- **Dependency:** the design reuses the shipped doc-frontmatter harvest, the three detectors, and the
  existing hook-wiring convention. It does NOT depend on the (currently reported-broken) advisor daemon
  for its enforceable path (R4).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Plan-only:** no runtime behavior changes in this phase; the deliverable is a design.
- **Daemon-independence:** the enforcement path (Option B) reads `hard_rules` directly off disk,
  synchronously, so it works even if the advisor daemon is down.
- **Latency:** the PreToolUse linter must fast-exit on every non-dispatch Bash call (single regex) and
  must never become a new stall vector; it fails open on its own internal errors.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- The fan-out orchestrator's own spawns are already stdin-safe by construction, so the manual/ad-hoc
  path is the only one exposed to Incident A — the linter must intercept the manual path specifically.
- `stallWatchdogMs`'s raw-alias reader bypasses the Zod schema (the partial-fix trap).
- The documented kill procedure is `pkill -9` (SIGKILL), which is uncatchable — the graceful `stopped`
  path never runs on the documented kill, so exit-code truth must not rely on catching the signal.
- A slash-command-shaped prompt without `--command` fails silently (delivers as raw prose, no error) —
  the highest-value catch precisely because it is silent today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

Moderate. The design spans two tracks (skill-advisor + deep-loop) and multiple components, but each
reuses a shipped pattern rather than inventing infrastructure: Option D flips existing tested knobs,
Option A′ mirrors the shipped doc-frontmatter harvest, and Option B mounts on the existing hook-wiring
convention. This phase itself is design-only, so its complexity is in the analysis, not the change.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

Six questions require operator sign-off before implementation — enumerated in full in
`decision-record.md`: (1) plan-doc home, (2) `stallWatchdogMs`/`lagCeilingMs` default, (3) the
PreToolUse block-response schema, (4) the warn→block burn-in window, (5) the A′ frontmatter scope at
v0, and (6) whether to bundle the `cli-dispatch-skill-preload.md` drift re-verify.
<!-- /ANCHOR:questions -->

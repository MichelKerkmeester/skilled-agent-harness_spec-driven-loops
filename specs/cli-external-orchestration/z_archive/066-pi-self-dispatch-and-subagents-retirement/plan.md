---
title: "Implementation Plan: Let a Pi session dispatch cli-pi, and retire the pi-subagents route"
description: "How the three enforcement layers come down in order, what the shared-runtime carve-out is keyed to, and what proves it without a Pi session."
trigger_phrases:
  - "pi self dispatch plan"
  - "executor audit carve-out"
  - "pi preflight hook change"
  - "pi-subagents retirement plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/066-pi-self-dispatch-and-subagents-retirement"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All four workstreams shipped and verified"
    next_safe_action: "Operator runs the live Pi dispatch for AC-002"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-066-pi-self-dispatch"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Let a Pi session dispatch cli-pi, and retire the pi-subagents route

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The prohibition lives in three places that were written independently and never reconciled.
The documentation states it, a Pi-runtime hook enforces it by name, and a shared runtime guard
enforces it structurally for every executor kind. Only the second one is what a Pi session
actually hits.

The shared guard is the sensitive surface. `validateExecutorDispatchAllowed`
(`executor-audit.ts:826`) is one function serving six executor kinds through five layers, and a
careless edit there loosens all six. Two of its layers answer *"is the caller currently inside
this CLI"* — `ancestry` (:858) and `lockfile` (:878). Two answer a different question,
*"is this process already a dispatch chain"* — `lineage` (:838) and `stack` (:850). The fifth,
`env` (:867), is already inert for `cli-pi`: `EXECUTOR_SESSION_ENV_BY_KIND` deliberately carries
no `cli-pi` entry because Pi's session variable was never confirmed.

That split is what makes the change safe to make surgically, and it is the whole design.

### Overview

Four workstreams, executed in this order: the runtime carve-out first because it is the one that
can break something, the hook second because it is what a Pi session hits, the documentation
third because it should describe a state that already exists, and the record last.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The three layers are read, not assumed — done: line references are in `spec.md` §2.
- The layer split is decided and recorded — ADR-001.
- The baseline is captured before the first edit, not reconstructed after.
- The operator has confirmed the guard depth and the subagents scope — both answered.

### Definition of Done

- Both guard suites green against the pre-edit baseline, with the delta stated.
- The other five executor kinds still refuse on `ancestry` and `lockfile`, asserted by a test that
  fails if the exemption is written kind-agnostically.
- `lineage` and `stack` still refuse for `cli-pi`, asserted the same way.
- The residue greps in `spec.md` §5 return only changelog, benchmark, and the surviving stress cell.
- `validate.sh --strict` prints `RESULT: PASSED` with `Errors: 0` — the line read, not the exit code.
- SC-001 is either observed from a real Pi session or reported as unverified, never inferred.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A kind-keyed exemption set, read by exactly the two layers whose question the operator answered.
Not a parameter threaded through the guard, not a per-layer condition, not a config flag: one
named constant beside the existing kind maps, so the next reader finds it where the other
per-kind facts live.

```
SELF_PRESENCE_EXEMPT_KINDS = { 'cli-pi' }

validateExecutorDispatchAllowed(config, context)
  ├─ lineage    → unchanged for every kind, including cli-pi
  ├─ stack      → unchanged for every kind, including cli-pi
  ├─ ancestry   → skipped when kind ∈ SELF_PRESENCE_EXEMPT_KINDS
  ├─ env        → unchanged; already inert for cli-pi, and must stay that way
  └─ lockfile   → skipped when kind ∈ SELF_PRESENCE_EXEMPT_KINDS
```

The comment above the constant carries the durable reason: Pi has no in-process delegation left,
so the CLI is a Pi session's only way to hand work out. No packet id, no spec path, no
requirement id.

### Key Components

| Component | File | Change |
|-----------|------|--------|
| Shared dispatch guard | `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Add the exemption set; two layers consult it |
| Guard unit tests | `system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | `cli-pi` passes ancestry and lockfile; the other five still fail both; `cli-pi` still fails lineage and stack |
| Pi preflight hook | `hooks/dispatch/pi/dispatch-preflight-lint.ts` | Remove the `cli-pi` deny branch and its message; the generic "name the matching executor" path then applies |
| Hook tests | `hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | The `cli-pi self-recursion` case flips; every other denial case is asserted unchanged |
| Packet documentation | `cli-pi/**` (fifteen files) | Guard prose out, `pi-subagents` out |
| Hub claims | `cli-external-orchestration/{SKILL,README,ROUTER}.md`, `graph-metadata.json` | Universal claim becomes a claim with a stated carve-out |

### Data Flow

A dispatch composed inside Pi meets the hook first (deny or allow, by name today), then the
shared guard when the route goes through the deep-loop runtime. Both must agree before the
documentation is true, which is why both change in this packet and neither alone would do.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Enumerated by search, not assumption. What still speaks the old contract:

| Surface | Speaks the old contract as | Handling |
|---------|---------------------------|----------|
| `cli-pi/SKILL.md` frontmatter | A declared hard rule `self-invocation-prohibited` | Removed. Its check was never registered, so nothing downstream loses enforcement |
| `hooks/dispatch/lib/dispatch-rule-checks.mjs` | Six registered checks, none of them `pi-self-invocation-guard` | Untouched. The removal takes nothing out of the registry |
| `matrix-manifest.ts` EC-014 | `cli-pi` fan-out recursion is blocked | Still true. `stack` is untouched, so the cell and the adapter suite keep passing |
| `adapter-suite.ts` test 13 | Asserts `recursion-guard-stack` for every kind | Untouched and expected to stay green — a useful negative control on the carve-out |
| `leaf-manifest.json` | Nine `cli-pi` leaves incl. `references/agent-delegation.md` | Unchanged, because that reference is rewritten rather than deleted |
| `.opencode/skills/README.txt:74` | Pi loads `pi-subagents` from its plugin packages | Corrected |
| `system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs` | Generates `.pi/agents/` for `pi-subagents` to discover | **Out of scope, recorded.** Adjacent dead code needing its own packet |
| `cli-pi/benchmark/reports/**`, `cli-pi/changelog/**` | Both retired concepts, as history | Untouched. They record what was true when written |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Detail lives in `tasks.md`. The ordering constraint: WS2 runtime before WS2 hook before WS1 docs.
Documentation that describes a permission the code does not grant is the failure this packet
exists to end, so it is written last.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The coverage floor for this change is the exemption's two edges — it applies to `cli-pi`, and it
does not apply to anything else. Both are new behavior and both get a test. No test is added for
layers that did not change; the adapter stress suite already covers them and staying green there
is the point.

| Check | Command | What it proves |
|-------|---------|----------------|
| Baseline | `npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/fanout-run.vitest.ts` + `npm run typecheck`, captured to `scratch/baseline/` **before the first edit** | The delta afterwards is real |
| Exemption applies | New case: `cli-pi` with an ancestry signal, then with a lockfile signal | REQ-002 |
| Exemption is keyed | New case: the other five kinds still refuse on both layers | The risk in `spec.md` §6, row 1 |
| Recursion still bounded | New case: `cli-pi` still refuses on `lineage` and on `stack` | REQ-003 |
| Adapter suite unchanged | `npx vitest run tests/stress/cli-adapter/cli-pi.vitest.ts` | Test 13 still green; the carve-out did not reach the stack layer |
| Hook behavior | `npx vitest run hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | REQ-001 at unit level |
| Hook behavior, live | An operator-run `pi -p` dispatch naming `cli-pi` from inside a Pi session | REQ-001 in reality. **Cannot be run from this runtime**; if it is not run, the packet says so rather than claiming it |
| Residue | The greps in `spec.md` §5 | REQ-004, REQ-005 |
| Packet | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/runtime/cli/spec/validate.sh" <folder> --strict` | An explicit `RESULT: PASSED`, read from the output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| `executor-audit.ts` compiled output | Internal | The runtime builds from `lib/`; a stale `dist/` has silently no-opped spec scripts in this repo before, so rebuild before trusting a green run |
| A working Pi session | External | Needed only for SC-001. Its absence blocks that one criterion, not the packet |
| `validate-playbook-package.cjs` | Internal | Constrains the playbook edits: declared paths must exist, `stress/` roots must have no orphans |
| Operator decision on ADR-001 | Human | Answered in outline; the layer split is the residual question in `spec.md` §9 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**To undo this: `git revert <commit>`.** Every change is a tracked working-tree edit in one
commit; no migration, no generated state, no remote side effect. Tier 1 on the reversibility
ladder, with one qualification below.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
T001 baseline ──┬──> WS2a runtime carve-out ──> WS2b hook ──> WS1 docs ──> WS3 hub ──> WS4 record
                └──> WS1 pi-subagents retirement (independent of WS2, may run in parallel)
```

- **WS2a before WS2b**: if the hook opens first while the runtime still refuses, a Pi session gets
  a dispatch that passes preflight and dies in the guard — a worse failure than today's clear denial.
- **WS2 before WS1**: documentation is written to describe a state the code already has.
- **WS3 after WS1**: the hub's carve-out sentence should quote what the packet ended up saying.
- **WS1 pi-subagents is independent**: it touches no guard and can land on its own.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Files | Shape |
|------------|-------|-------|
| WS2a runtime carve-out | 2 | Small edit, high care — the only surface that can break another executor |
| WS2b Pi hook | 2 | Two blocks removed, one test case flipped |
| WS1 guard prose | 11 | Mechanical removal, one rewritten reference |
| WS1 pi-subagents | 8 | One reference rewritten, one scenario deleted, the rest mentions |
| WS3 hub | 4 | Four claims, one of them advisor vocabulary |
| WS4 record | 3 | Changelog, two version fields |

Total ≈ 30 files, ≈ 320 lines. Level 2 by `recommend-level.sh --loc 320 --files 30 --api`:
score 52, confidence 92.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist

- Baseline captured to `scratch/baseline/` before the first edit, including the `tsc` error set.
- The full residue inventory (`grep -rn` for both terms) saved, so the after-state is diffable.
- Confirm `.opencode` is a real directory, not a symlink, before running any spec script.

### Rollback Procedure

1. `git revert <commit>` restores all three layers together. Reverting only the documentation
   would recreate the disagreement this packet removes — revert whole or not at all.
2. Re-run both guard suites and confirm the pre-change counts return.

### Data Reversal

None. No persisted state, no generated artifact outside the repository, nothing sent anywhere.
The one qualification: `agent-bridge/pi-subagents-agent-parse.md` is deleted, and a revert
restores it from git — it is tracked, so the delete is reversible.
<!-- /ANCHOR:enhanced-rollback -->

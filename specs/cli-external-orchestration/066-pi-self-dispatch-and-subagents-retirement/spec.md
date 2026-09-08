---
title: "Feature Specification: Let a Pi session dispatch cli-pi, and retire the pi-subagents route"
description: "Pi dropped its subagents feature, so the pi-subagents delegation route cli-pi documents no longer exists, and the CLI is now a Pi session's only way to delegate. Remove the cli-pi self-invocation prohibition across its three enforcement layers and strike the retired package from the packet."
trigger_phrases:
  - "pi self dispatch"
  - "cli-pi self invocation removal"
  - "pi-subagents retirement"
  - "pi subagents deprecated"
  - "pi dispatch guard carve-out"
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
      - ".opencode/skills/cli-external-orchestration/cli-pi/SKILL.md"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-066-pi-self-dispatch"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Layer split: only the two layers that mean 'you are inside Pi' were lifted; lineage and stack still bind (ADR-001, implemented)"
      - "Guard depth: docs, the Pi hook, and a shared-runtime carve-out — all three"
      - "Subagents scope: the cli-pi packet only, leaving the spec-kit agent sync alone"
---
# Feature Specification: Let a Pi session dispatch cli-pi, and retire the pi-subagents route

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete pending AC-002 |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two facts changed under the `cli-pi` packet and neither is reflected in it.

**Pi removed its subagents feature.** The `pi-subagents` community package was the
delegation route the packet documents in eleven files — an activation trigger, a smart-router
keyword set, a hard rule, an FAQ answer, a whole reference (`references/agent-delegation.md`,
ten mentions), most of `references/mcp-and-third-party-packages.md` (fourteen mentions), and a
manual-testing scenario. A reader following that guidance today is routed to a package that no
longer mirrors anything.

**That removal also removes the reason for the prohibition.** `cli-pi` refuses to dispatch when
the caller is already inside Pi. That rule was written when a Pi session had an in-process way to
delegate. With subagents gone, the CLI is the only delegation path a Pi session has, and the
prohibition now blocks the one route that remains.

The prohibition is stated in one place and enforced in two others, and the three do not agree:

| Layer | Where | State |
|-------|-------|-------|
| Skill documentation | `cli-pi/SKILL.md` — the `self-invocation-prohibited` hard rule, the `CRITICAL — SELF-INVOCATION PROHIBITED` block, the `detect_self_invocation()` guard, plus cross-references in eleven files | Prose. Its declared check `pi-self-invocation-guard` is **not** in `KNOWN_CHECKS` (`hooks/dispatch/lib/dispatch-rule-checks.mjs:106` registers six checks, none of them it), so the rule has never fired |
| Pi runtime hook | `hooks/dispatch/pi/dispatch-preflight-lint.ts:190` returns deny for `dispatchSkill === "cli-pi"`; `:252-255` blocks with *"Pi cannot dispatch itself: cli-pi is never authorized."* | This is the enforcement that actually runs inside Pi |
| Shared fan-out runtime | `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` `validateExecutorDispatchAllowed`, five layers: `lineage` (:838), `stack` (:850), `ancestry` (:858), `env` (:867), `lockfile` (:878) | Generic across all six executors. For `cli-pi` the `env` layer is already inert — `EXECUTOR_SESSION_ENV_BY_KIND` carries no `cli-pi` entry, by a deliberate note that Pi's session variable is unconfirmed |

Removing only the documentation would leave the hook refusing the dispatch the documentation now
permits.

### Purpose

A Pi session can dispatch `cli-pi` and the runtime agrees, while a fan-out lineage still cannot
spawn another one; and no surface under `cli-pi` routes a reader to `pi-subagents`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**WS1 — Retire the pi-subagents route** across the `cli-pi` packet: the activation trigger, the
`AGENT_DELEGATION` router keywords, hard rule 6, the README FAQ, four references, the prompt
templates, and the playbook index. `references/agent-delegation.md` is rewritten around Pi's
built-in tools rather than deleted; it is a declared leaf in `leaf-manifest.json` and removing it
would change the hub's leaf set.

**WS2 — Lift the "you are inside Pi" prohibition** in all three layers:

- the `cli-pi` skill surfaces that state it;
- the `cli-pi` branch in `dispatch-preflight-lint.ts`, so a Pi session's dispatch is judged by the
  same rules as any other executor's rather than denied by name;
- the `ancestry` and `lockfile` layers of `validateExecutorDispatchAllowed`, for `cli-pi` only.

**WS3 — Correct the hub-level claims** that the guard is universal and non-negotiable, in the
form the hub already uses for `cli-opencode`'s parallel-detached asymmetry.

**WS4 — Record**: a `v1.5.0.0` changelog entry, and the version drift between `SKILL.md` (1.3.0.0)
and `README.md` (1.4.0.0) resolved to one number while both files are open.

### Out of Scope

- **The `lineage` and `stack` layers, for every kind including `cli-pi`.** They bound a runaway
  spawn chain, which is a different concern from "the caller is inside Pi". See ADR-001.
- **The other five executors.** Their guards, wording, and hub entries are untouched; the carve-out
  is keyed to `cli-pi` alone.
- **`system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, its README, and the generated
  `.pi/agents/` output.** `pi-subagents` was their only consumer, so they are now plausibly dead
  code — recorded here as an adjacent finding for a packet of their own, per the operator's
  decision to keep this one inside `cli-pi`.
- **`.opencode/skills/cli-external-orchestration/cli-pi/changelog/**` and `benchmark/reports/**`.**
  Historical records of what was true when written; editing them would falsify the record.
- **`cli-pi/manual-testing-playbook/stress/self-invocation.md` as a file.** Its cell asserts
  fan-out recursion blocking, which this packet keeps, and `matrix-manifest.ts` declares its path —
  `validate-playbook-package.cjs:131` fails on a missing declared playbook. Only its pointer at the
  removed `SKILL.md` §2 guard changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-pi/SKILL.md` | Modify | Drop the `self-invocation-prohibited` hard rule, the CRITICAL block, `detect_self_invocation()`, the "You ARE Pi already" bullet, two workflow steps, one verification line; strike the `pi-subagents` trigger, router keywords, and hard rule 6; version to 1.5.0.0 |
| `cli-pi/README.md` | Modify | Five self-invocation mentions in the pitch, overview, and capability prose; one `pi-subagents` FAQ answer; version to 1.5.0.0 |
| `cli-pi/references/agent-delegation.md` | Modify | Rewrite around built-in tools; remove ten `pi-subagents` mentions |
| `cli-pi/references/mcp-and-third-party-packages.md` | Modify | Remove fourteen `pi-subagents` mentions; keep `pi-mcp-extension` |
| `cli-pi/references/integration-patterns.md` | Modify | Two guard steps, two `pi-subagents` mentions |
| `cli-pi/references/providers-and-models.md` | Modify | Three cross-references to the removed guard |
| `cli-pi/references/native-skills-and-extensions.md` | Modify | One guard row in the runtime table |
| `cli-pi/references/cli-reference.md` | Modify | One guard line in the verification checklist (`:214`) |
| `cli-pi/references/pi-tools.md` | Modify | One `pi-subagents` mention |
| `cli-pi/assets/prompt-templates.md` | Modify | One guard precondition, one `pi-subagents` delegation template |
| `cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Modify | Five guard mentions incl. the GUARD blockquote and precondition 5; three `pi-subagents` mentions; the EC-014 index line |
| `cli-pi/manual-testing-playbook/stress/self-invocation.md` | Modify | Repoint source anchors off the removed `SKILL.md` §2 guard; the cell's fan-out contract is unchanged |
| `cli-pi/manual-testing-playbook/cli-invocation/default-invocation-and-settings-merge.md` | Modify | One guard reference, two `pi-subagents` mentions |
| `cli-pi/manual-testing-playbook/cli-invocation/hallucination-fixture-undocumented-pi-syntax.md` | Modify | One guard reference in the fixture's read list |
| `cli-pi/manual-testing-playbook/model-dispatch/provider-settings-merge.md` | Modify | One `pi-subagents` mention |
| `cli-pi/manual-testing-playbook/agent-bridge/pi-subagents-agent-parse.md` | Delete | Scenario for a retired package; `agent-bridge/` is outside the orphan-scanned roots (`validate-playbook-package.cjs:261-274`) |
| `cli-pi/changelog/v1.5.0.0.md` | Create | The retirement and the carve-out, with the reason |
| `cli-external-orchestration/SKILL.md` | Modify | Five mentions incl. "Never let any mode dispatch itself — non-negotiable"; state the `cli-pi` carve-out beside the existing `cli-opencode` asymmetry |
| `cli-external-orchestration/README.md` | Modify | Two universal claims (`:34`, `:91`) |
| `cli-external-orchestration/ROUTER.md` | Modify | One mention of per-packet guards |
| `cli-external-orchestration/graph-metadata.json` | Modify | Advisor vocabulary `:202`, `:247`, and the `causal_summary` `:383` |
| `hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modify | Remove the `cli-pi` deny branch (`:189-190`) and its block message (`:252-255`) |
| `hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | Flip the `cli-pi self-recursion` case; keep every other denial case |
| `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Exempt `cli-pi` from the `ancestry` and `lockfile` layers only |
| `system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modify | Cover the exemption and assert the other five kinds still block on both layers |
| `.opencode/skills/README.txt` | Modify | `:74` states Pi loads `pi-subagents` from its plugin packages |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A dispatch composed inside a Pi session for `cli-pi` is not denied by the Pi preflight hook |
| REQ-002 | `validateExecutorDispatchAllowed` allows a `cli-pi` dispatch whose only signals are process ancestry or a Pi state lockfile |
| REQ-003 | The `lineage` and `stack` layers still refuse a `cli-pi` dispatch, and all five layers still refuse for the other five kinds |
| REQ-004 | No surface under `cli-pi` instructs a reader to refuse a dispatch because the caller is inside Pi |
| REQ-005 | No surface under `cli-pi` routes a reader to `pi-subagents` as a live delegation option |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The hub states the `cli-pi` carve-out where it currently asserts the guard is universal |
| REQ-007 | The advisor vocabulary in `graph-metadata.json` no longer offers `pi-subagents` or a `cli-pi` self-invocation guard as routable concepts |
| REQ-008 | `SKILL.md` and `README.md` carry the same version, and a changelog entry states what was removed and why |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `pi -p` dispatch naming `cli-pi`, composed from inside Pi, reaches the binary rather than a hook denial — observed, not inferred from the diff.
- **SC-002**: The runtime guard suites pass against a baseline captured before the first edit, with the delta reported.
- **SC-003**: `grep -ric "self.invocation" cli-pi/` returns hits only under `changelog/`, `benchmark/reports/`, and `stress/self-invocation.md`, whose cell survives.
- **SC-004**: `grep -ric "pi-subagents"` over the hub returns hits only under `changelog/` and `benchmark/reports/`.
- **SC-005**: `validate.sh <packet> --strict` prints an explicit `RESULT: PASSED` with `Errors: 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The exemption is written kind-agnostically and loosens all six executors | High — five other runtimes silently gain self-dispatch | The exemption is a `cli-pi`-keyed set read by two layers; the unit test asserts the other five kinds still block on ancestry and lockfile |
| Risk | Read as permission for unbounded recursion | High — a runaway spawn chain | `lineage` and `stack` are untouched and stated as untouched in the skill, the hub, and the changelog |
| Risk | The playbook stress cell is deleted along with the guard prose | Medium — `validate-playbook-package.cjs` fails on a missing declared playbook | The file is Modify, not Delete; only its source anchors move |
| Risk | `references/agent-delegation.md` deleted rather than rewritten | Medium — `leaf-manifest.json` leaf set changes and the hub gate fails | Declared in scope as a rewrite |
| Dependency | `hooks/dispatch/pi/*` runs inside Pi only | The hook change cannot be proven from this runtime | SC-001 is an operator-run check from a Pi session; the packet does not close on an inferred pass |
| Dependency | `.opencode` is a real directory here, not a symlink | Spec scripts silently no-op through symlinked paths | Verified `ls -ld .opencode` before planning; validate through `realpath` regardless |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: The exemption is one named constant read by two call sites, not a condition repeated per layer.
- **NFR-M02**: The code comment states the durable reason — Pi has no in-process delegation left — with no packet id, spec path, or requirement id.

### Honesty

- **NFR-H01**: A surface that keeps a guard says which layers still hold, rather than claiming the guard is gone.
- **NFR-H02**: The claim that the hook change works is made only from a real Pi dispatch, never from the absence of the branch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Guard layers

- A Pi session inside a fan-out lineage: `lineage` fires first and still denies, regardless of the exemption.
- `CLI_DISPATCH_STACK_ENV` already naming `cli-pi`: `stack` denies. The exemption is checked after both.
- The `env` layer for `cli-pi`: already inert, because `EXECUTOR_SESSION_ENV_BY_KIND` has no `cli-pi` entry. The carve-out must not add one.

### Detection signals

- `.pi/` exists in this repository, so the `lockfile` layer can fire for any caller here, not only for a Pi one. That is part of why the layer is exempted rather than made more precise.
- Process ancestry is the only layer that fires on macOS without `/proc`; exempting it for `cli-pi` removes the last ancestry-based refusal for that kind.

### Retirement

- A reader with `pi-subagents` still installed finds no guidance here. The changelog entry, not the reference, is where that reader is told the route was retired.
- `cli-devin`'s `run_subagent` is a different feature of a different CLI and stays.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **The layer split is a judgment call and is recorded as ADR-001.** "Inside Pi may dispatch pi" is read as the `ancestry` and `lockfile` layers, which mean *the caller is currently inside Pi*, while `lineage` and `stack` mean *this process is already a dispatch chain* and are kept. If the operator meant the prohibition to go entirely — a Pi fan-out lineage may spawn another — that is a one-line change to the same constant and a different expectation in the adapter stress suite, and it should be said before implementation starts.
- **`cli-pi` declares four hard rules and none of them enforces what it says.** `pi-self-invocation-guard`, `command-v-pi-required` and `deep-loop-runtime-delegation` are absent from `KNOWN_CHECKS` entirely. The fourth, `stdin-redirect-required`, *is* registered, but its body returns pass for any command that is not `opencode run` (`dispatch-rule-checks.mjs:75-81`), so it never evaluates a `pi -p` command either. This packet removes one of the four and changes nothing about the other three. Not in scope; recorded so it is not rediscovered.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Decision Records**: See `decision-record.md`
- **Prior art**: `../058-codex-dispatch-scope-loosening/` loosened an over-reaching dispatch rule in `cli-codex` without weakening the prohibition underneath it
<!-- /ANCHOR:related-docs -->

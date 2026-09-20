---
title: "Implementation Summary"
description: "cli-jev is registered as the hub's eighth mode and its first transport: declared through the transport-axis extension, routed by a four-alias signal, enforced by eight implemented checks, compiled into a fresh serving policy, and covered by a canary case that proves the alias does not capture out-of-domain prompts."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/003-hub-mode-registration"
    last_updated_at: "2026-09-20T10:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Registered, wired and compiled cli-jev; per-hub gate, hook suites and manifest all green"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/mode-registry.json"
      - ".skilled/hooks/dispatch/lib/dispatch-audit.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-003-hub-mode-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the executor-delegation scorer pick up a transport mode? No: it filters packetKind 'workflow', so cli-jev is absent from its alias table"
      - "Can a transport destination hold commit authority in the compiled policy? No: the decision contract refuses a non-actor with approveBeforeCommit, so the transport's authority edge is evidenceOnly"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hub-mode-registration |
| **Completed** | 2026-09-20 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Registration is four separate claims, and all four have to hold for the mode to be reachable: the hub must resolve it, the router must score it, the dispatch audit must recognise it, and the compiled policy must serve it. Each is enforced by a different mechanism, so each was verified with its own gate rather than by inference from the others.

### Phase 3: hub mode registration

The mode is registered as `packetKind: "transport"` with `mutatesWorkspace: false` and `Write`, `Edit`, `Task` forbidden, and declared in a new `transport-axis` extension so the axis is a registered field rather than an ad-hoc convention. Stage two carries a two-class signal and two leaves; the leaf manifest, hub `README.md`, `description.json`, `graph-metadata.json` and a `1.6.0.0` changelog entry all name the mode. The dispatch audit resolves `jev noul|choice|score|run` and `jev-mcp` from the command's structure, and eight checks implement the packet's eight rules with fixture pairs under the existing bijection guard. The compiled router was rebuilt, and the serving manifest re-minted, so the new policy is what actually serves.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | Modified | The transport mode entry, the `transport-axis` extension, and the discriminator prose the new mode falsified |
| `.skilled/skills/cli-external-orchestration/hub-router.json` | Modified | `cli-jev` signal with two vocabulary classes; `tieBreak` places it after every workflow |
| `.skilled/skills/cli-external-orchestration/ROUTER.md` | Modified | `JEV` intent row and the two-leaf resource map |
| `.skilled/skills/cli-external-orchestration/SKILL.md` | Modified | Mode table row, two-axis model, layout, references, and the note that the transport is absent from the executor scorer |
| `.skilled/skills/cli-external-orchestration/README.md` | Modified | Roster row, routing chain and the corrected `defaultMode` statement |
| `.skilled/skills/cli-external-orchestration/leaf-manifest.json` | Modified | Five leaves for the transport |
| `.skilled/skills/cli-external-orchestration/description.json`, `graph-metadata.json` | Modified | Advisor-facing identity and the 12 new intent phrases |
| `.skilled/skills/cli-external-orchestration/changelog/v1.6.0.0.md` | Created | Release entry |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | jev dispatch shape, both basenames as executors, the command-position branch and the text fallback |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | Eight checks |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modified | Eight fixture pairs plus a governance test for the transport shape |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modified | Shape rows and the jev management commands that must not resolve |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/registry-compiler.cjs` | Modified | Transport role, `evidenceOnly` authority edge, and a transport contract assertion |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` | Modified | The new packet in `sourceInputs`; the gold assertion now admits a transport target |
| `.../fixtures/canary-cases.v1.json` | Modified | A transport route case and an out-of-domain defer case |
| `.../013-live-activation/activation/cli-external-orchestration/manifest.json` | Modified | Re-minted to the new policy hash |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Delivered

Baseline first: the per-hub gate reported one invariant failure naming the unregistered `cli-jev`, and the compiled status reported `fresh: true` at generation 5. Then the registration, then the same gates again from the final state.

Three findings shaped the implementation rather than the reverse. The compiled hub refused to load the registry at all — `cli-jev is not a CLI workflow actor` — which is how the transport role in the policy schema surfaced: the runtime already knew about transports, and the hub compiler was the only thing that did not. The decision contract then refused a policy where a non-actor holds commit authority, so the transport's authority edge is `evidenceOnly` — it selects and does not authorize. And the manifest went stale the moment the registry changed, which is the intended behavior and the reason the re-mint is part of this phase rather than a follow-up.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Declare the axis, do not just use the kind.** `transport-axis` names the mode, so the per-hub gate can enforce membership instead of trusting a comment.
- **Re-mint as part of the phase.** A registration that leaves the serving manifest stale is a registration the runtime does not honor.
- **Extend the compiler rather than special-case the hub.** The transport role already existed in the shared schema and the decision contract; teaching the hub compiler to emit it kept one contract instead of two.
- **Prove the alias is narrow.** A new alias set that also matches ordinary English is worse than no alias, so the fixture carries an out-of-domain prompt that must defer.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration` | All hard invariants passed, 0 warnings — 8 modes, transport axis consistent, tie-break ordered |
| Negative control on rule 3h | Flipping `mutatesWorkspace` to true produced a named failure; restored |
| `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | 20 pass, 0 fail, including the bijection guard and the new transport governance test |
| `npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | 74 pass, 0 fail |
| Compiled route, four prompts | `jev choice` routes to `cli-jev`; an out-of-domain prompt defers; hermes and claude routes unchanged |
| `compiled-route-status.cjs --hub cli-external-orchestration` | `compiled-serving`, `fresh: true`, new policy hash |
| Advisor stage one | Recommends `cli-external-orchestration` at 0.82 with `compiledRoute` targeting `cli-jev`; the out-of-domain phrase resolves to `sk-code` instead |
| Executor-delegation scorer | `cli-jev` absent from the alias table; every jev phrase returns null |
| Intent-signal generator | 12 phrases added, `declared=70 signals=85 missing=0` |
| Trigger index regeneration | 83 paths added, all resolving; 4,241 stale paths removed, none of which exist on disk |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The loaded preflight hook is the published copy.** The library edits take effect through the hook's on-disk module set; a runtime that has already cached the library keeps the previous behavior until it reloads.
- **`defaultMode` prose in the hub README was already wrong.** It claimed `cli-opencode` while the router declares `null`; the line was corrected because this phase edited that sentence, and the drift is recorded here rather than silently folded in.
- **The trigger index dropped 4,241 stale paths.** They describe files that no longer exist (0 of 4,241 resolve); the regeneration is honest but the diff is large, and it is a consequence of regenerating a stale index rather than of this phase's edits.
<!-- /ANCHOR:limitations -->

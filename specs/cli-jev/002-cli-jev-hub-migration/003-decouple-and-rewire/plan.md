---
title: "Implementation Plan: Phase 3: decouple-and-rewire"
description: "Verify the decoupling a parallel writer landed, then close the enforcement hole first: move the audit row and both hook suites to cli-jev/cli-usage and prove it with a live preflight refusal. Rewire the rosters through their mirror contract, reset the hub's release line to 0.1.0.0, and re-derive each generated surface with its own sanctioned writer."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
  - "dispatch rewiring"
  - "generated surfaces"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/003-decouple-and-rewire"
    last_updated_at: "2026-09-20T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan authored at closeout, mirroring the executed decoupling and rewiring"
    next_safe_action: "Run phase 004: onboard the hub to the compiled-routing fleet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-003-decouple-and-rewire"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: decouple-and-rewire

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and TOML artifacts; Node.js and Python tooling for the generators, the hook suites and the doctor |
| **Framework** | The dispatch preflight chain (`dispatch-audit.mjs`, `dispatch-rule-checks.mjs`, the per-runtime lints), sk-doc's mirror contract, and the compiled-route remint |
| **Storage** | Repository filesystem; git index carries the hub changelog rename; the generated surfaces are committed artifacts |
| **Testing** | The two hook suites under their own runners, a live preflight refusal, the doctor on both hubs, the compiled-route guard, and census greps over the live trees |

### Overview
The decoupling half was landed by a parallel writer while this phase was being planned, so the first act is verification rather than repetition: read the old hub, confirm its registry, router and prose carry no transport, and attribute the commit. The wiring half then runs in dependency order. The dispatch chain goes first because it is the enforcement hole — until the audit row moves, every `jev` dispatch fails open. The rosters follow, each through the mirror contract that owns it (edit the canonical `.skilled` file, mirror the same body into `.claude`, regenerate the generated trees). The hub's release line is then reset to `0.1.0.0` by operator direction, and every generated surface is re-derived with its own sanctioned writer rather than a hand edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verify-then-rewire-then-re-derive. Nothing is re-derived until the bytes it describes have stopped moving, and every generated artifact is written by the tool that owns it: the trigger index by its generator, the manifests by `frontmatter-version.mjs compute`, the fixture by the test's own `--write` path, the description cache by the folder-discovery upsert, and the compiled manifest by the remint.

### Key Components
- **The dispatch row**: `DISPATCH_SHAPES` maps each shape to a short display name and a hub-relative `packetPath`; the per-runtime lints join the packet `SKILL.md` from that segment. The jev row keeps `skill: 'cli-jev'` — the display name and alias the request already names — while `packetPath` becomes `cli-jev/cli-usage`, which is what closes the fail-open hole.
- **The two hook suites**: `dispatch-rule-checks.test.mjs` is a `node:test` file that enumerates packets from a scan-root list, so the moved packet needs a second root and the bijection assertion then finds a packet for all eight jev checks. `dispatch-audit.test.mjs` is a vitest file whose shape assertion pins the new `packetPath` and whose existence assertion is the durable guard against a repeat of this hole.
- **The live proof**: a preflight JSON piped into the hook is the only evidence that the rules are enforced rather than merely declared, because the hook reports refusal through its JSON payload and exits 0 either way.
- **The roster contract**: `.skilled/agents/` is canonical, `.claude/agents/` is the authored twin in the Claude dialect, `.cursor` and `.devin` symlink through, and `.pi` and `.codex` are generated by the two sync scripts. A roster edit that skips the twin or the generators leaves the gate red.
- **The generated surfaces**: the trigger index plus its manifest and diagnostics fixtures; the two frontmatter-version manifests; the sk-doc durable-directory fixture; and the description cache, whose single-entry upsert exists precisely so a new track does not require a whole-tree rescan.
- **The release line**: five artifacts must agree with the newest changelog entry, so the reset touches `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json` together, and the changelog is renamed by `git mv` so the history stays recorded.
- **The old hub's manifest**: the prose fix changes a routing input, so the hub is re-minted and the runtime manifest is copied over its authored twin.

### Data Flow
Verify the landed decoupling → move the audit row → update both suites → run each under its own runner → prove the enforcement with a live preflight refusal → rewire the rosters and regenerate the mirrors → reset the hub's release line and rename its changelog → regenerate the trigger index, the manifests, the fixture and the description cache → fix the old hub's remaining prose and re-mint its manifest → author the phase docs and re-run the packet gates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The phase's own test is the dispatch chain. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` is the packet-bijection guard: it collects the check ids implemented for the jev packet and fails if no packet declares them, which is exactly what the retired path caused. `npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` is the inspector suite, and its shape-to-`SKILL.md` existence assertion is the regression guard for this class of hole. The vitest invocation is scoped to the one file so that the parallel writer's quarantined snapshot of the same path, collected by the repository-root glob, cannot report its own unresolvable relative paths as this repository's failure.

The live proof is a piped preflight call rather than an exit code: the hook answers `permissionDecision: deny` with the packet's own rule text, and exits 0 either way, so the JSON body is the evidence. The doctor runs on both hubs, the compiled-route guard reports the old hub fresh, and two compiled-route probes check that the old hub still resolves a workflow mode while the new one still reports its documented legacy sentinel. Finally, census greps over the live trees classify every remaining citation as recorded history, an intentional display name, or a defect.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 002, because the packet has to answer from `cli-jev/cli-usage` before the old registration is deleted and the audit row is moved.
- The sanctioned writers for each generated surface, because hand-editing a generated artifact is the failure this phase is repairing.
- The parallel writer's decoupling commit `e66dccd6a2`, which is treated as an input to verify rather than work to repeat.
- Phase 004, which consumes this phase's output: it adds the hub to the compiled fleet and needs the dispatch row, the rosters and the generated surfaces already pointing at the new home.
- Phase 005, which re-runs the playbook from the new home against the state this phase leaves behind.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Restore the audit row's `packetPath` to `cli-external-orchestration/cli-jev` and re-add the mode row and `transport-axis` block to the old hub's registry, which returns the repository to the phase-002 state where the mode answers from the new home while the old hub still registers it. The roster edits revert by restoring the previous sentences on both sides of each mirror and re-running the two generators, and the generated surfaces revert by re-running their writers at the previous commit's inputs. The old hub's manifest is restored by re-running the remint against the reverted prose. The release-line reset reverts by editing the same five artifacts and renaming the changelog back, and its recorded history in the mode's two earlier entries is untouched either way.
<!-- /ANCHOR:rollback -->

---

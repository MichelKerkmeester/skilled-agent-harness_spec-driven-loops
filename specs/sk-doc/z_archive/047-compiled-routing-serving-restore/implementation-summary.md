---
title: "Implementation Summary: compiled routing serving restore"
description: "Three hubs were serving legacy routing because nothing re-pinned their manifests, one verify gate had been widened past the manifest it protects, and the sk-doc hub gave the human voice vocabulary to the wrong mode. All three are fixed and measured."
trigger_phrases:
  - "compiled routing restored to serving"
  - "stale manifest re-pinned"
  - "human voice vocabulary rehomed"
  - "frozen corpus routing replay"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/047-compiled-routing-serving-restore"
    last_updated_at: "2026-09-01T05:38:12Z"
    last_updated_by: "implementation"
    recent_action: "Restored all five hubs to compiled serving and rehomed the human voice vocabulary"
    next_safe_action: "Commit the paths this packet owns"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019ahF7gmhZy3Bo2bKRKK2i7"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 047-compiled-routing-serving-restore |
| **Completed** | 2026-09-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three of the five parent hubs had quietly stopped serving the routers they compiled. They
reported `legacy` with cause `stale-manifest`, which reads like a configuration choice and
is actually a fallback. All five now serve compiled. Separately, the sk-doc hub still gave
`HVR` and `human voice` to the quality-control mode, so the mode that owns the standard lost
a four-to-four tie on its own name and routed nowhere. Seven prompts that returned nothing
now reach the mode that means them.

### Serving authority restored

A hub compiles its router from two files and pins the hash of the result in an activation
manifest. At serve time the resolver recompiles and compares. When they differ it falls back
to legacy, which is correct, because a pin that no longer describes the router is not a pin
worth trusting. What was missing is that nothing re-pinned after the inputs changed, and the
inputs had changed. `compiled-route-manifest.cjs refresh` does exactly that job, pointed at
the authored tree rather than the promoted mirror, so the new pin travels with the next
rebuild instead of making the mirror diverge from its source.

### The verify gate, back on the manifest

An earlier fix in this lineage widened the promoted-root gate from "does this hub resolve"
to "is this hub's engine reachable". That cleared a rebuild deadlock, and it also waved
through a hub whose manifest was deleted, malformed or invalid, because the compiled engine
answers for those too. The gate now asks the manifest-sensitive question again on a promoted
root, while the two authored-closure gates keep the reachability test, which is the right
question where a stale pin is the very thing a rebuild exists to clear.

### A guard that a republish had erased

A compiled route names a packet directory and a leaf file. Resolving both at compile time is
what stops a registry promoting a route to something that is not there, and the alternative
is a green build whose route fails at serve time. That guard was added to the promoted mirror
and never to the authored source it is copied from, so the next publish from that source
deleted it silently. Nine days of builds carried no such check. It is back in the authored
source, threaded through both harness callers, and republished.

Restoring it exposed five further layers of rot in the hub's canary validator, each a pin or
a literal that a legitimate change had moved past: a frozen scorer digest, the hub's own
source digests, a hard-coded packet count, a collapse falsifier whose subject mode had been
withdrawn, and two fixture cases minted for that same mode. The falsifier now breaks the
contract the rule actually guards. One fixture case was withdrawn because every live mode
still has its own, and the sole clarify case was retargeted at an ambiguity between two live
modes so that coverage survived.

### The human voice vocabulary, with its mode

A mode's compiled keywords come from two places at once: its aliases in the mode registry
and the vocabulary classes named in the hub router. Removing a term from one leaves it
working through the other. Both halves moved.

### A validator that counted phases in the wrong file

Verifying this packet surfaced a rule that warns on 213 packets. The complexity check counts
`## Phase` headings in `plan.md`, but the core plan template deliberately hands phase
ownership to `tasks.md` so a packet has one source of truth rather than two that drift. Every
packet built that way is reported as having zero phases. The rule now reads `plan.md` first
and falls back to `tasks.md`, so a packet with no phases anywhere still warns.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/compiled-route-sync.cjs` | Modified | Return the promoted-root gate to the route that reflects the manifest |
| `.opencode/skills/sk-doc/hub-router.json` | Modified | Rehome the human voice terms, narrow the quality-action verbs |
| `.opencode/skills/sk-doc/mode-registry.json` | Modified | Rehome the same terms in the other half of the vocabulary |
| `specs/.../013-live-activation/activation/{sk-doc,sk-code,mcp-tooling}/manifest.json` | Modified | Re-pin three hubs to their current compiled policy |
| `.opencode/bin/lib/compiled-routing/**` | Modified | Promoted mirror, rebuilt from the authored closure |
| `.opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh` | Modified | Count phases where the current template puts them |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every vocabulary candidate was scored before it was written. The harness runs the production
compiler and the production router over a mutated input, so the only difference from what
ships is the vocabulary itself. Before measuring anything, an empty mutation was run as a
control: it reproduced the live engine on 207 of 207 probes. Two candidates were rejected on
that evidence. The first measured zero effect, which is how the registry half of the
vocabulary was found. The second traded seven bare verbs for two phrases and was worse.

The routing flip shipped through the sync tool's own staged publication. The build promotes
into a staging root, verifies it, swaps it in and retains a rollback sibling. Gates ran
against the promoted root before the publication was finalized, and the manifest suite ran
after, because an open publication holds the writer lease that suite needs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Refresh the pin in the authored tree, not the promoted mirror | Editing the mirror makes it diverge from the closure it is a copy of, which the verify pass then reports as drift |
| Keep reachability in the two authored-closure gates, restore the manifest test only on the promoted root | A stale pin must not block the rebuild that clears it, and a corrupt manifest must not reach serving. Those are different questions asked in different places |
| Restore the erased guard in the authored source, never in the mirror | Editing the mirror is what created the divergence in the first place, and the next publish would erase the fix exactly as it erased the original |
| Move `human voice` rather than delete it | Deleting it left the bare phrase routing nowhere. The mode that owns the standard should answer to its own name |
| Drop `check` and `review` from the quality-action verbs | They are generic English, not distinctly quality actions, and each sat inside another mode's exact phrase where a one-word match scores the same as a three-word one |
| Leave the scorer alone | Five hub routers carry three divergent scoring bodies. Giving a longer match more weight is the real fix and needs its own replay evidence per hub |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `compiled-route-status.cjs --all` | PASS. All five hubs `compiled` with cause `compiled-serving`, up from two |
| `compiled-route-sync.cjs --verify` | PASS. All 5 hubs resolve, 0 reads under the spec tree |
| `node --test compiled-route-manifest.test.cjs` | PASS. 42 of 42, including the missing, malformed and invalid manifest guards |
| Vitest `vitest.config.bin.ts` | PASS. 34 of 34 |
| `parent-skill-check.cjs`, five hubs | PASS. All hard invariants, 0 warnings |
| `ci-skill-root-metadata.cjs` | PASS. checked=14 passed=14 failed=0 |
| `package_skill.py --check --strict`, both touched modes | PASS |
| Frozen 207-probe replay against the shipped engine | PASS. Matches the measured prediction on 207 of 207 |
| Harness control, empty mutation | PASS. Reproduces the live engine on 207 of 207 |
| `deep-loop-registry-compiler.vitest.ts` | PASS. 4 of 4, previously blocked entirely |
| deep-loop `validate-canary.cjs` | PASS. `real-green`, 10 of 10 route-gold rows |
| `validate.sh --strict` on this packet | PASS. `RESULT: PASSED`, Errors 0, Warnings 0 |
| Complexity rule control | PASS. 3 phases for a tasks-owned packet, 3 for a plan-owned one, 0 for a stripped fixture |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A bare verb and an exact phrase score the same.** `scoreModes` multiplies the number of
   matched keywords by the mode's weight, with no notion of how much of the prompt a keyword
   covers, so a one-word verb ties a three-word phrase. Two prompts were stranded that way and
   were fixed by narrowing the verb class, which treats the instance. The mechanism stays.
   Fixing it means changing scoring in five hub routers that carry three divergent bodies, and
   re-proving every hub, which is its own program.
2. **Nothing re-pins a manifest automatically.** Editing a hub's routing inputs drops it back
   to legacy until `refresh` and a rebuild run. That is fail-safe rather than fail-open, but it
   is silent: the only symptom is a cause code in a status probe nobody runs by habit.
3. **Two stage-one advisor prompts still return nothing.** `5d scoring` and `dynamic profile`
   expect the deep-improvement surface. They read none of the compiled routing this packet
   repairs, so they were handled separately.
<!-- /ANCHOR:limitations -->

---



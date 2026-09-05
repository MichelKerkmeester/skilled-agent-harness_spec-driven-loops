---
title: "The Deep-Loop Systems: Before and After"
trigger_phrases: []
---
# The Deep-Loop Systems: Before and After

A plain-language tour of every deep-loop system this program touches — what it did before, what it does after, and why the change was worth making. Written for someone who wants to understand the shape of the change without reading the spec.

---

## Read this first: what "after" means right now

This program does not rip out the old machine and drop in a new one. That would be reckless — the deep-loop runtime is live, and real runs are in flight at any moment. Swapping the engine mid-flight would leave the system half-old and half-new, and inconsistent.

So the change lands in stages, and the word **"after" in this document means "after the whole program finishes."** Most of the way there now:

- **Landed:** the shared foundation — the new ledger, the gateway, the evidence services, the safety net — is built and running.
- **Landed:** all eight deep-loop modes now carry their own typed schema on that foundation — schema, reducers, sealed artifacts, certificates, resume adapter, shadow-parity harness, and rollback gate — each built additive-dark and verified green. The hermetic CLI-adapter stress program and the whole-system acceptance gate landed alongside.
- **Executed by `012-runtime-enablement`:** the switch-over ran. The operator ratified a direct flip, and every one of the eight modes was moved to `new_authoritative_final`, the legacy shadow writer was dropped, and the whole-system gate passed. The new system is now in charge and the old writers are retired.

Everything built through phase 011 first ran **"dark"** — recording in parallel with the old system, **not in charge of anything**, with the legacy code as the source of truth — until each mode had *proven*, run for run, that it did the same thing. Phase `012-runtime-enablement` then executed the operator-ratified cutover across all eight modes, so the ledger is now authoritative and the old writers are retired. The legacy files stay readable, but they are now produced by projection from the ledger rather than by a separate legacy writer.

So when you read "after" below — written while the system still ran dark — read it as the behavior that cutover has now put in charge. That staged caution was the whole point: the old behavior stayed authoritative until its replacement earned the switch.

---

## The one-sentence version

**Before:** the deep-loop solved its hard problems ad-hoc — it guessed when to stop, wrote its history to a plain log with no rules about how to read it back, kept no proof that its side-effects actually happened, and let the AI Council mistake "many seats" for "many independent opinions."

**After:** every one of those becomes a real, enforceable contract — a typed history that replays deterministically, a gatekeeper that refuses any unauthorized change, sealed evidence and signed certificates for every claim, and a council that measures genuine independence instead of counting chairs.

The rest of this document walks through that system by system.

---

## System 1 — How the loop decides it's finished

**Before.** Deep-loop runs (research, review, and the rest) stopped on a single number: a "new information ratio." Each round, if the fraction of genuinely new findings dropped below a threshold, the loop called itself converged and quit. One signal, one threshold. It worked often enough, but it was blunt: a loop could stall on a plateau and quit early, or chase diminishing returns because the one number happened to twitch.

**After.** Stopping becomes a *multi-signal* decision. The loop looks at several independent signals of "are we still learning" — coverage of the paths it set out to explore, whether it's going in circles (cycle detection), and a stopping clock that accounts for the natural long tail of late-arriving insights. On top of that sits a general health-and-degeneration check that can tell the difference between "genuinely done" and "spinning uselessly." No single number gets to end the run by itself.

**Why it matters.** The old way was easy to fool in both directions — quit too soon, or run too long. The new way has to convince several independent checks before it stops, which is much harder to trick.

---

## System 2 — How the loop remembers what happened (the ledger)

**Before.** State lived in an append-only JSONL file — one JSON object per line, appended as the run progressed. Simple and durable, but with a catch: there were **no rules about how to read it back**. Nothing pinned down what each event shape meant, what version it was, or how an older file should be interpreted by newer code. If the format drifted, old runs could quietly become unreadable or be misread.

**After.** The same append-only idea, but now every event goes through a **typed event envelope** with a schema version stamped on it, and lands in a proper **typed ledger**. Two things come with that:

- **Replay fingerprints.** A run can be replayed from its events and will produce exactly the same result every time. The fingerprint is how we *prove* that determinism, and how we detect if a replay ever drifts.
- **A compatibility contract.** Older events can be "upcast" — read forward into the current shape by explicit rules — so history stays readable as the schema evolves, instead of rotting.

**Why it matters.** The ledger is the spine of the whole program. Everything else — proof, resume, rollback, parity — depends on being able to replay history exactly and trust what it says. A plain log couldn't promise that; a typed, versioned, replayable ledger can.

---

## System 3 — Who is allowed to change the state (the gateway)

**Before.** More or less anything that wanted to write, wrote. There was no single checkpoint that every state change had to pass through, and no notion of a change being "authorized" versus "not authorized." Correctness depended on every writer behaving.

**After.** Every typed event has to pass a **fail-closed transition-authorization gateway** before it can be written. Think of it as a bouncer at the one door into the ledger: a change is refused *unless* it can be shown to be a legal transition. "Fail-closed" means the default answer is no — if the gateway can't confirm a change is allowed, it rejects it rather than waving it through. And the gateway ships *together* with the first writer, so there was never a window where typed events could be written without it.

**Why it matters.** This is the difference between "we trust every writer to do the right thing" and "the system structurally cannot record an unauthorized change." The second is far safer, especially as more modes and more code write to the same ledger.

---

## System 4 — How we know a result is actually real (evidence)

This is really three cooperating systems: sealed artifacts, certificates, and receipts.

**Before.** When a run produced a result — a finding, a score, a decision — there was little to bind that result to the exact inputs and process that produced it. Side-effects (things the run *did* to the outside world) left no durable proof they happened. If you wanted to audit "did this really happen, from these exact inputs," the trail was thin.

**After, in three parts:**

- **Sealed reference artifacts.** The key inputs a run depends on — the evaluator it was graded against, the authority it answered to, a sealed "canary," an independence batch — get *frozen* and sealed at the moment of use. Later, nobody can quietly swap them out; the seal is checked.
- **Certificates.** Each run emits a per-run certificate, and each transition emits a receipt. A certificate is a compact, checkable claim: "this run, over these sealed inputs, reached this result." An **offline verifier** can re-check a certificate from scratch — resolving every digest it names back to real sealed content of the expected kind, recomputing the replay fingerprint rather than trusting it, and failing closed if anything is missing, fabricated, the wrong kind, mutated, stale, or reordered.
- **Receipts.** Every side-effect gets a receipt, backed by an effect-recovery policy, so the system can tell what actually took effect and recover cleanly if a run is interrupted mid-effect.

**Why it matters.** Together these turn "trust me, it happened" into "here's a certificate you can independently re-verify without me." That's the foundation for ever letting the new system be authoritative — you can *check its work*.

---

## System 5 — How we prove the new machine matches the old (shadow parity)

**Before.** There was nothing to prove, because there was only one system.

**After.** Before any mode is allowed to switch over, it runs in **shadow parity**: the new dark machinery processes the same real inputs as the live system, and a harness compares the two outputs, run for run. The comparison is deliberately strict — it pairs events by *logical identity* rather than by raw IDs (so independent streams don't get mismatched), it allows only a closed, named list of legitimately-varying fields (like timestamps), and it treats every *other* difference as a real, unexplained diff that has to be accounted for. "Green" means zero unexplained differences — not "close enough."

**Why it matters.** This is the gate that makes cutover safe. A mode doesn't earn the right to become authoritative by being plausible; it earns it by reproducing the legacy behavior exactly, under real inputs, with every difference explained.

---

## System 6 — How a run survives a crash (resume)

**Before.** After an interruption, a run recovered by re-reading its JSONL and doing its best to pick up where it left off. Best-effort, with few guarantees that the state it resumed from was actually intact.

**After.** Each mode gets a **resume adapter** with real integrity checks. On resume it doesn't just trust the checkpoint it finds — it recomputes a resume fingerprint, checks the recorded final position against the *actually replayed* end of the ledger, and rejects a checkpoint that's been tampered with, has a gap, or disagrees with the real history (a forged cursor, a digest mismatch, a split stream). A confirmed effect has to be bound to the *intent* that caused it by several facts, not by a bare identifier, so a forged confirmation can't fake a completed side-effect.

**Why it matters.** Resume is exactly where corruption sneaks in — a half-finished run, a doctored checkpoint. The new adapters treat the checkpoint as something to *verify*, not something to trust.

---

## System 7 — How a bad migration gets rolled back (rollback + mode gates)

**Before.** There was no per-mode migration to roll back, and so no rollback machinery — cutover as a concept didn't exist.

**After.** Each mode gets a **rollback-and-mode gate**: the safety-critical piece that decides whether a mode may migrate, and can put it back if it shouldn't have. Its discipline is strict and worth spelling out, because it's the last line of defense:

- It **re-derives its own verdict** — through the real gateway, a real ledger replay, and the offline certificate verifier — instead of trusting a computed "everything's fine" status handed to it. A green summary over forged evidence still fails.
- It only rolls back inside a real **window**: it deduplicates distinct executions before counting them, and requires a minimum number of days and a minimum number of *successful* executions before a rollback is considered safe.
- It cross-checks the rollback anchor against a freshly re-verified certificate, supersedes stale tokens against the real coordinator's high-water mark, and — importantly — **never throws** on bad input; malformed input becomes a typed, fail-closed denial, not a crash.

**Why it matters.** This is the component you most want to be paranoid. A migration gate that trusted a summary it was handed could be talked into authorizing a bad cutover. This one insists on reproducing the evidence itself.

---

## System 8 — How work fans out and comes back (orchestration)

**Before.** Fan-out (sending work to many workers) and fan-in (collecting the results) were handled ad-hoc, without durable receipts for what was dispatched or a principled policy for partial failures.

**After.** Orchestration is built onto the ledger: canonical **dispatch receipts** and result envelopes, resume-and-salvage for interrupted waves, logical branch IDs and leases so work isn't double-done, and a real **partial-failure policy** (strict / quorum / deadline / progressive) for deciding what "done enough" means when some branches fail. Fan-in is budget-aware and provenance-balanced, so results are combined fairly rather than by whoever happened to finish.

One piece of this shipped early and deliberately: the **live-tools fan-out unblock**, which lets automated fan-out pass a real web-search capability per worker. It was built to be backward-compatible and to change dispatch only — no change to how anything is persisted — so it could land safely ahead of the ledger.

**Why it matters.** As the loops got more parallel, "we sent some work and mostly got it back" stopped being good enough. Durable receipts and an explicit failure policy make fan-out trustworthy at scale.

---

## System 9 — Budgets, gauges, and the AI Council's independence

Three smaller but telling upgrades, grouped because they share a theme: *stop approximating, start measuring.*

- **Budgets.** *Before:* cost and effort weren't centrally enforced — each part spent on its own. *After:* hierarchical typed budgets, enforced in one place, so a run can't quietly blow past its allocation.
- **Gauges.** *Before:* metrics were recomputed from scratch when needed, which is slow and can disagree with itself. *After:* incremental stream-fold gauges with immutable records — computed once, folded forward, and never silently rewritten.
- **The AI Council's independence.** *Before:* the council measured diversity by **counting seats** — five seats read as five opinions, even if they mostly agreed. *After:* a **blinded, counterfactual adjudication** service measures whether the opinions are *actually independent*, so genuine disagreement counts and rubber-stamping doesn't.

**Why it matters.** Each of these was a place where the old system trusted a proxy — a count, a recomputation, a seat — instead of the real quantity. The new versions measure the thing itself.

---

## System 10 — How the eight modes relate to each other

**Before.** The deep-loop modes shared backends informally. The three benchmark variants (model, skill, agent) leaned on deep-improvement's packet and scoring code; deep-alignment shared the review loop. This worked, but the sharing was implicit — which made it dangerous to change several modes at once, because nobody had written down who wrote to what.

**After.** The shared pieces are **hoisted into explicit common services** — a `deep-improvement-common` layer that its three variants *extend by import* rather than fork, and a shared review/alignment loop that deep-alignment reuses rather than copies. And before any of the per-mode work ran in parallel, the program produced an **executable write-set conflict graph**: a machine-checkable map of which mode writes where, so lanes that would collide are serialized and lanes that are independent can safely run at once.

Each mode then gets its own typed schema over the shared spine: its own ledger schema, reducers, sealed artifacts, certificates, resume adapter, shadow-parity harness, and rollback gate — ending in an independent gate for that mode. Same foundation, mode-specific shape.

**Why it matters.** Implicit sharing is fine until you try to evolve it. Making the sharing explicit — common services plus a conflict graph — is what lets eight modes migrate onto the new spine without racing each other or drifting apart.

---

## System 11 — The rollout method itself

This is the meta-system, and arguably the most important design decision in the whole program.

**Before (the tempting wrong way).** Build the new architecture and swap it in. Fast to describe, catastrophic in practice: the runtime holds in-flight state, so a big-bang swap would corrupt live runs and leave the system inconsistent between one commit and the next.

**After (what's actually done).** A four-step, reversible rollout:

1. **Additive + dark.** The new substrate lands alongside the old and records in parallel, but is never in charge.
2. **Shadow parity.** Each mode proves, on real inputs, that the dark path reproduces legacy behavior exactly.
3. **Staged cutover.** Authority flips to the new ledger **one mode at a time**, each behind a rollback window and a cutover certificate that proves parity held.
4. **Gated retirement.** The old writers are removed **only** after telemetry shows they're genuinely unused — and archival readers are kept forever, so every historical run stays readable.

**Why it matters.** Every risky step is small, reversible, and evidence-gated. At no point is there a "hold your breath" moment. If a cutover misbehaves, its rollback window puts the old path back. That is the difference between a migration you can sleep through and one you can't.

---

## Where this stands today

To keep the "before/after" honest, here's the real state as of this writing:

- **Foundation: done.** The ledger, gateway, evidence services (sealed artifacts, certificates, receipts), the shared control services and the compatibility-and-shadow-and-rollback safety net are built and landed.
- **Per-mode migrations: done.** All eight modes carry their full typed schema on the shared spine, column by column: schema, reducers, sealed artifacts, certificates, resume, shadow-parity and the rollback gate, each built additive-dark and verified green.
- **The whole-system gate: run.** Recursive strict validation came back clean, and an independent blocking acceptance review confirmed the additive-dark claim, with one accepted, deliberate exception: the containment that made autonomous model-benchmark promotion advisory-only. The hermetic CLI-adapter stress program (the six external CLI adapters, the fan-out scheduler, operator playbooks, a matrix-bijection validator and a destructive-scope write-containment proof) landed as part of the hardening.
- **The switch-over: executed.** Phase `012-runtime-enablement` built the append gateway and per-mode projection the modes still lacked, migrated every mode's write protocol onto it, then flipped all eight modes to `new_authoritative_final`, dropped the legacy shadow writer and ran the whole-system gate to a clean pass. The rollback and migration scaffolding the direct flip made unnecessary was deleted afterward.

So the new machine is no longer just watching. It is driving now. The ledger is authoritative for all eight modes. The legacy files stay readable because they are now produced by projection from the ledger rather than by a separate legacy writer, and the old writers are retired. That is the result the staged rollout described in System 11 was built to earn, not a shortcut around it.

---

## What happened after the switch-over

The switch-over was not the end of the program. The children that follow, numbered 013 through 028, landed after `012-runtime-enablement`, and three of them, 026, 027 and 028, arrived only on 2026-09-05 by being merged in from separate top-level packets. None of that later work touches the architecture described above. It is the work of making that architecture hold up once real leaf agents, real reviewers and real filesystems started leaning on it.

- **Making the leaves obey the new door.** The cutover put the append gateway in charge of every write, but the leaf agents across six runtimes were still appending to the state file directly, bypassing the door the gateway was built to guard. `013-runtime-agent-gateway-alignment` migrated them onto the gateway. A ten-iteration deep-review, `014-gateway-alignment-review`, then went looking for what that fix and its own audit had missed, and found ten things. `015-gateway-contract-remediation` closed all ten, so that today exactly one write path is instructed, permitted and enforced across the prompt-pack templates, the runtime projection refresh, the iteration validator, the mode SKILLs, the conformance guard and the ai-council MCP surface.
- **A broad audit and its fallout.** `016-system-deep-loop-review` was a twenty-iteration review across the whole system-deep-loop surface: the runtime, the eight /deep:* command docs, the leaf agents across six runtimes, the mode-packet SKILLs and the changes phase 015 had just landed. `017-runtime-latent-issue-remediation` then verified and fixed its P0 and P1 findings. `018-pre-existing-test-triage` triaged ten pre-existing test failures that predated all of this, fixing the one that was cleanly a data drift and classifying the rest. `019-risky-followup-remediation` went back and properly remediated the two riskier failures the previous packet had deliberately deferred.
- **Making the runtime survive real machines.** `020-tsx-boot-spaced-path-hardening` and `021-containment-symlink-autoscope` are two halves of the same story. The runtime crashed outright when launched from a checkout whose path contains a space. Once that was fixed, write containment then rejected every artifact when the artifact tree resolved through a symlink into a different checkout, because containment resolved against the working directory's git worktree rather than the one that actually held the artifact. Both are now fixed.
- **A gate that blocked good work, twice.** `022-phase0-dispatch-anchor` tried to fix the deep/* phase-0 dispatch-context gate by giving it an objective marker to check, instead of asking the model to self-classify a real invocation. `023-cross-runtime-dispatch` concluded the gate could not be fixed in-prompt at all and retired it outright. The second superseded the first, and that reversal is the interesting part: the gate was not patched into working. It was recognized as unfixable and removed.
- **Executors.** `024-executor-kind-routing` closed a silent-native gap where naming certain CLI executors on /deep:review, /deep:research or /deep:alignment quietly degraded to the native path instead of dispatching through them. `025-deprecate-deep-alignment` removed the deep-alignment mode entirely: the command, its agents, the mode packet and the shared runtime code. It turned out to be the shared conformance engine behind other benchmark surfaces, so per operator approval the removal cascaded to those surfaces too.
- **The three merged packets, 026 to 028.** These lived as separate top-level packets (038, 039, 040) until 2026-09-05, when they became children of this program. `026-codex-lineage-auth-isolation` is a codex credential-isolation investigation whose fix was withdrawn after a review returned FAIL. The diagnosis was believed at the time, and the fix landed in a module the failing path never actually executes. The record was kept rather than deleted, because the investigation found real things and because a wrong diagnosis that was genuinely believed is worth writing down. `027-executor-availability-docs` corrected the command contracts, which had advertised a three-item executor set while each command's runtime actually accepted a different, larger one, and one contract had advertised an executor its own resolver rejects. `028-cli-lineage-nesting-and-containment-guard` stopped a cli-codex fan-out lineage from spawning a nested codex process on every iteration, and made write containment save a recoverable patch before it reverts a concurrent operator edit.

**Why it matters.** The substrate work, the ledger, the gateway and the evidence services, was the hard part of this program. Everything from 013 onward is the ordinary, unglamorous work that follows any real migration: making six runtimes of leaf agents actually use the one door, making the runtime survive a spaced path and a symlinked checkout, recognizing a gate as unfixable instead of patching around it and cleaning up the credential and nesting bugs that only real fan-out lineages, running on real operators' machines, could surface.

---

*This document is a plain-language companion to the packet's specs. For the exact contracts, event names, and the recommendation-by-recommendation ledger, see the phase children — the architecture decision record and the 178-row map live under `001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/`, and each mode's mechanics live inside its own phase folder under `003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/`.*

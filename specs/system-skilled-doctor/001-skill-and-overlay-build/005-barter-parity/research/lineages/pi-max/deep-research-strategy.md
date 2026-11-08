# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

**Topic:** How should Skilled's vendored-copy overlay and re-pin support be improved so external repo users like Barter can adopt it?

**Session:** fanout-pi-max-1794087510790-zecq2g (lineage `pi-max`, generation 1)
**Packet:** specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity
**Artifact dir:** specs/system-skilled-doctor/001-skill-and-overlay-build/005-barter-parity/research/lineages/pi-max

---

## 2. TOPIC
How should Skilled's vendored-copy overlay and re-pin support be improved so external repo users like Barter can adopt it? Deliver ranked engine changes, Barter manifest migration steps, and doc/advertising changes, each with file:line evidence.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which overlay-engine changes are required so a vendored repo whose overlay folder is `barter-overlays` can run status, apply and repin without an unexplained exit 2 or a whole-run abort on a protected path?
- [x] Q2: What do Barter's `barter-overlays` runbook, `overlay-manifest.json`, `replay.cjs`, `sync.cjs` and `sync-state.json` do that the Skilled engine does not, and what is the concrete migration path onto the engine's manifest and state schema?
- [x] Q3: Which runtime surfaces must be re-pinned or regenerated after a re-pin (dsh skill links, runtime mirrors, hook registrations, trigger index, advisor graph), and how should the engine express them?
- [x] Q4: Which root-file and cross-runtime traps (`AGENTS.md`, `REPO RULES.md`, `.opencode/scripts`, fork-drifted files) must the engine handle before an external repo can adopt it safely?
- [x] Q5: Which documentation and advertising changes are needed so adoption is discoverable and correctly described, and how should all proposed changes be ranked by impact and risk?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any engine, hook or doc change. This run reports findings and ranked proposals only; implementation is a separate follow-up.
- Editing anything in the Barter repo (read-only source) or anywhere outside this lineage directory.
- Redesigning the deep-research loop, the append gateway or the reducer.
- Judging Barter's product scope or its own repo rules beyond the overlay/re-pin adoption surface.

---

## 5. STOP CONDITIONS

- `stopPolicy` is `max-iterations` with `maxIterations: 5`; convergence ratio is telemetry only and the loop runs all five iterations.
- Three consecutive failed gateway or reducer calls halt the run (stuck recovery).
- Missing required control files (config, strategy) halt the run; the narrowed write scope recorded at init is not a halt condition.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Which overlay-engine changes are required so a vendored repo whose overlay folder is `barter-overlays` can run status, apply and repin without an unexplained exit 2 or a whole-run abort on a protected path?
- Q2: What do Barter's `barter-overlays` runbook, `overlay-manifest.json`, `replay.cjs`, `sync.cjs` and `sync-state.json` do that the Skilled engine does not, and what is the concrete migration path onto the engine's manifest and state schema?
- Q3: Which runtime surfaces must be re-pinned or regenerated after a re-pin (dsh skill links, runtime mirrors, hook registrations, trigger index, advisor graph), and how should the engine express them?
- Q4: Which root-file and cross-runtime traps (`AGENTS.md`, `REPO RULES.md`, `.opencode/scripts`, fork-drifted files) must the engine handle before an external repo can adopt it safely?
- Q5: Which documentation and advertising changes are needed so adoption is discoverable and correctly described, and how should all proposed changes be ranked by impact and risk?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading throw sites together with the CLI catch, then comparing them against the existing per-entry blocked reporting, turned three separate symptoms into one design inconsistency with a clear fix shape. (iteration 1)
- comparing the two `sync`/`replay` files against the engine line by line exposed the fork relationship immediately, which reframes every subsequent recommendation from migration to upstreaming. (iteration 2)
- reading each script's usage block and exit codes turned "missing regeneration" into a per-script manifest-authoring table, which is directly actionable. (iteration 3)
- following the install route as a user would, by grepping each command in the order an adopter meets it, found the discovery gap that a per-file read of the reference would have hidden. (iteration 4)
- ranking by blocking impact rather than by novelty kept the two most expensive items (fork-drifted, outsideCertificate) out of the critical path, which is what an adopting repo needs. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- trusting the dispatch brief's gap list cost one verification pass and produced one direct contradiction; the brief mixes engine gaps with manifest gaps. (iteration 1)
- starting from the manifest's size (130 entries, 63 KB) suggested a rewrite; reading the entry shapes showed the schema is already shared, so the perceived work was in three small keys. (iteration 2)
- assuming the advisor graph behaves like the other generators delayed the finding; its operator-gated rebuild and report-only check are genuinely different. (iteration 3)
- assuming the brief's root-file trap applied to the engine; the engine's copy rule already prevents it, and the real defect is the silence that follows an upstream root-file change. (iteration 4)
- the first draft treated each Barter manifest key as a separate engine requirement; grouping `fork-drifted` and `outsideCertificate` into one optional extension matched how they actually ship. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adopting Barter's extension allowlist: it trades an explicit per-path declaration for a name heuristic, which is the wrong direction for a secret-file guard. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Adopting Barter's extension allowlist: it trades an explicit per-path declaration for a name heuristic, which is the wrong direction for a secret-file guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting Barter's extension allowlist: it trades an explicit per-path declaration for a name heuristic, which is the wrong direction for a secret-file guard.

### Assuming the advisor graph can be treated like the others: the rebuild has no read-only freshness mode, so it must be a regenerate step plus a separate report-only gate, and that asymmetry has to be documented rather than papered over. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming the advisor graph can be treated like the others: the rebuild has no read-only freshness mode, so it must be a regenerate step plus a separate report-only gate, and that asymmetry has to be documented rather than papered over.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the advisor graph can be treated like the others: the rebuild has no read-only freshness mode, so it must be a regenerate step plus a separate report-only gate, and that asymmetry has to be documented rather than papered over.

### Assuming the engine needs a new regeneration mechanism: three of the five surfaces (dsh links, runtime mirrors, trigger index) are expressible with manifest entries the engine already supports. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming the engine needs a new regeneration mechanism: three of the five surfaces (dsh links, runtime mirrors, trigger index) are expressible with manifest entries the engine already supports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the engine needs a new regeneration mechanism: three of the five surfaces (dsh links, runtime mirrors, trigger index) are expressible with manifest entries the engine already supports.

### Assuming the manifest would need rewriting from scratch: 130 entries, 19 layout links, 9 regenerate steps and 10 verify steps already match the engine's schema; only `outsideCertificate`, `upstreamSource` and the missing `pin.checkout` reader are engine-side gaps. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Assuming the manifest would need rewriting from scratch: 130 entries, 19 layout links, 9 regenerate steps and 10 verify steps already match the engine's schema; only `outsideCertificate`, `upstreamSource` and the missing `pin.checkout` reader are engine-side gaps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the manifest would need rewriting from scratch: 130 entries, 19 layout links, 9 regenerate steps and 10 verify steps already match the engine's schema; only `outsideCertificate`, `upstreamSource` and the missing `pin.checkout` reader are engine-side gaps.

### Expecting `.opencode/scripts` and `.dsh` to be engine features: both are manifest configuration plus defaults, and only the defaults need to change. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Expecting `.opencode/scripts` and `.dsh` to be engine features: both are manifest configuration plus defaults, and only the defaults need to change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting `.opencode/scripts` and `.dsh` to be engine features: both are manifest configuration plus defaults, and only the defaults need to change.

### Expecting the docs to be silent about overlays: root README section 5 and the reference are thorough, so the fix is routing and adoption guidance rather than writing the feature up from scratch. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Expecting the docs to be silent about overlays: root README section 5 and the reference are thorough, so the fix is routing and adoption guidance rather than writing the feature up from scratch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting the docs to be silent about overlays: root README section 5 and the reference are thorough, so the fix is routing and adoption guidance rather than writing the feature up from scratch.

### Expecting the engine to need a root-file copy rule: the exclusion is deliberate and correct for a re-pin; the gap is the missing report line and the missing precedence rule, not the exclusion. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Expecting the engine to need a root-file copy rule: the exclusion is deliberate and correct for a re-pin; the gap is the missing report line and the missing precedence rule, not the exclusion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Expecting the engine to need a root-file copy rule: the exclusion is deliberate and correct for a re-pin; the gap is the missing report line and the missing precedence rule, not the exclusion.

### Looking for `protectedPaths` in Barter's manifest to explain the design-tokens refusal: it is absent everywhere, so the refusal comes from the engine's name heuristic, not from a malformed entry. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for `protectedPaths` in Barter's manifest to explain the design-tokens refusal: it is absent everywhere, so the refusal comes from the engine's name heuristic, not from a malformed entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for `protectedPaths` in Barter's manifest to explain the design-tokens refusal: it is absent everywhere, so the refusal comes from the engine's name heuristic, not from a malformed entry.

### Looking for a "setting file missing" diagnostic: none exists, so an operator sees a manifest-path error instead of a settings error, which explains the confusing exit 2 in the brief. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a "setting file missing" diagnostic: none exists, so an operator sees a manifest-path error instead of a settings error, which explains the confusing exit 2 in the brief.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a "setting file missing" diagnostic: none exists, so an operator sees a manifest-path error instead of a settings error, which explains the confusing exit 2 in the brief.

### Looking for a documented precedence between `/doctor:agents-md` and the overlay engine over `AGENTS.md`: none exists. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a documented precedence between `/doctor:agents-md` and the overlay engine over `AGENTS.md`: none exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a documented precedence between `/doctor:agents-md` and the overlay engine over `AGENTS.md`: none exists.

### Looking for a single migration document that already covers an existing hand-rolled overlay folder: none exists in the doctor skill or the command docs, which is why D2 is a real deliverable rather than a reorganisation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a single migration document that already covers an existing hand-rolled overlay folder: none exists in the doctor skill or the command docs, which is why D2 is a real deliverable rather than a reorganisation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a single migration document that already covers an existing hand-rolled overlay folder: none exists in the doctor skill or the command docs, which is why D2 is a real deliverable rather than a reorganisation.

### Looking for a test that would catch a missing `.dsh` default: the engine tests do not enumerate the default list, only the doctor mirror contract does. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a test that would catch a missing `.dsh` default: the engine tests do not enumerate the default list, only the doctor mirror contract does.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a test that would catch a missing `.dsh` default: the engine tests do not enumerate the default list, only the doctor mirror contract does.

### Looking for an advisor freshness JSON contract: `skill-graph-freshness.cjs` prints a panel, not a `fresh` field, so the `fresh-true` expectation cannot be reused there. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for an advisor freshness JSON contract: `skill-graph-freshness.cjs` prints a panel, not a `fresh` field, so the `fresh-true` expectation cannot be reused there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an advisor freshness JSON contract: `skill-graph-freshness.cjs` prints a panel, not a `fresh` field, so the `fresh-true` expectation cannot be reused there.

### Looking for an engine-level "post-repin hook": none; `regenerate` runs inside `applyUnderLock` after the copy, which is the post-repin point, so no new hook is needed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for an engine-level "post-repin hook": none; `regenerate` runs inside `applyUnderLock` after the copy, which is the post-repin point, so no new hook is needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an engine-level "post-repin hook": none; `regenerate` runs inside `applyUnderLock` after the copy, which is the post-repin point, so no new hook is needed.

### Looking for an engine-level default regeneration list: there is none; the only default is the runtime folder list, which is the `.dsh` gap in finding 4. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for an engine-level default regeneration list: there is none; the only default is the runtime folder list, which is the `.dsh` gap in finding 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an engine-level default regeneration list: there is none; the only default is the runtime folder list, which is the `.dsh` gap in finding 4.

### Prioritising the Barter fork's two extra states above the smaller fixes: they are the most expensive changes and the least blocking, and a repo can adopt the engine without them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Prioritising the Barter fork's two extra states above the smaller fixes: they are the most expensive changes and the least blocking, and a repo can adopt the engine without them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prioritising the Barter fork's two extra states above the smaller fixes: they are the most expensive changes and the least blocking, and a repo can adopt the engine without them.

### Reading the engine's usage header as the contract: the header documents exit codes per command but not the `.skilled-overlays.json` fallback or the protected-path throw, and both were only visible in the function bodies (lines 375-379, 1688-1703). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the engine's usage header as the contract: the header documents exit codes per command but not the `.skilled-overlays.json` fallback or the protected-path throw, and both were only visible in the function bodies (lines 375-379, 1688-1703).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the engine's usage header as the contract: the header documents exit codes per command but not the `.skilled-overlays.json` fallback or the protected-path throw, and both were only visible in the function bodies (lines 375-379, 1688-1703).

### Running `overlay-engine.cjs status` against this repo to observe the failure: the engine writes nothing in status mode, but a run would still need the repo's own setting and manifest, and the finding is fully derivable from the branches; the command was not run to keep the write surface clean. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Running `overlay-engine.cjs status` against this repo to observe the failure: the engine writes nothing in status mode, but a run would still need the repo's own setting and manifest, and the finding is fully derivable from the branches; the command was not run to keep the write surface clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running `overlay-engine.cjs status` against this repo to observe the failure: the engine writes nothing in status mode, but a run would still need the repo's own setting and manifest, and the finding is fully derivable from the branches; the command was not run to keep the write surface clean.

### Searching `update.md`, `symlink.md`, `runtime-mirrors.md` and `env.md` for overlay mentions: zero in each, which confirms the discovery gap is route-level rather than a single missing sentence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching `update.md`, `symlink.md`, `runtime-mirrors.md` and `env.md` for overlay mentions: zero in each, which confirms the discovery gap is route-level rather than a single missing sentence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching `update.md`, `symlink.md`, `runtime-mirrors.md` and `env.md` for overlay mentions: zero in each, which confirms the discovery gap is route-level rather than a single missing sentence.

### Searching for a `repin` implementation inside Barter: none, by design; the runbook is the implementation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for a `repin` implementation inside Barter: none, by design; the runbook is the implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `repin` implementation inside Barter: none, by design; the runbook is the implementation.

### Treating Barter's scripts as an unrelated bespoke implementation: the shared preamble and function names make that untenable, and it changes the recommendation from "replace Barter's tool" to "upstream its deltas". -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating Barter's scripts as an unrelated bespoke implementation: the shared preamble and function names make that untenable, and it changes the recommendation from "replace Barter's tool" to "upstream its deltas".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Barter's scripts as an unrelated bespoke implementation: the shared preamble and function names make that untenable, and it changes the recommendation from "replace Barter's tool" to "upstream its deltas".

### Treating the `.dsh` default as a documentation-only change: the repin tests assert exact copy counts, so it is a code + test change with a doc note. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the `.dsh` default as a documentation-only change: the repin tests assert exact copy counts, so it is a code + test change with a doc note.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `.dsh` default as a documentation-only change: the repin tests assert exact copy counts, so it is a code + test change with a doc note.

### Treating the brief's gap list as authoritative: finding 6 directly contradicts it, so the brief was demoted to hypotheses and re-verified item by item. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the brief's gap list as authoritative: finding 6 directly contradicts it, so the brief was demoted to hypotheses and re-verified item by item.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the brief's gap list as authoritative: finding 6 directly contradicts it, so the brief was demoted to hypotheses and re-verified item by item.

### Trusting the repin workflow's stage invariant: the engine's stage branch contradicts it, so the workflow text needs the correction, not just the engine. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Trusting the repin workflow's stage invariant: the engine's stage branch contradicts it, so the workflow text needs the correction, not just the engine.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trusting the repin workflow's stage invariant: the engine's stage branch contradicts it, so the workflow text needs the correction, not just the engine.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Looking for a "setting file missing" diagnostic: none exists, so an operator sees a manifest-path error instead of a settings error, which explains the confusing exit 2 in the brief. (iteration 1)
- Looking for an engine-level default regeneration list: there is none; the only default is the runtime folder list, which is the `.dsh` gap in finding 4. (iteration 1)
- Reading the engine's usage header as the contract: the header documents exit codes per command but not the `.skilled-overlays.json` fallback or the protected-path throw, and both were only visible in the function bodies (lines 375-379, 1688-1703). (iteration 1)
- Running `overlay-engine.cjs status` against this repo to observe the failure: the engine writes nothing in status mode, but a run would still need the repo's own setting and manifest, and the finding is fully derivable from the branches; the command was not run to keep the write surface clean. (iteration 1)
- Treating the brief's gap list as authoritative: finding 6 directly contradicts it, so the brief was demoted to hypotheses and re-verified item by item. (iteration 1)
- Assuming the manifest would need rewriting from scratch: 130 entries, 19 layout links, 9 regenerate steps and 10 verify steps already match the engine's schema; only `outsideCertificate`, `upstreamSource` and the missing `pin.checkout` reader are engine-side gaps. (iteration 2)
- Looking for `protectedPaths` in Barter's manifest to explain the design-tokens refusal: it is absent everywhere, so the refusal comes from the engine's name heuristic, not from a malformed entry. (iteration 2)
- Searching for a `repin` implementation inside Barter: none, by design; the runbook is the implementation. (iteration 2)
- Treating Barter's scripts as an unrelated bespoke implementation: the shared preamble and function names make that untenable, and it changes the recommendation from "replace Barter's tool" to "upstream its deltas". (iteration 2)
- Assuming the advisor graph can be treated like the others: the rebuild has no read-only freshness mode, so it must be a regenerate step plus a separate report-only gate, and that asymmetry has to be documented rather than papered over. (iteration 3)
- Assuming the engine needs a new regeneration mechanism: three of the five surfaces (dsh links, runtime mirrors, trigger index) are expressible with manifest entries the engine already supports. (iteration 3)
- Looking for an advisor freshness JSON contract: `skill-graph-freshness.cjs` prints a panel, not a `fresh` field, so the `fresh-true` expectation cannot be reused there. (iteration 3)
- Looking for an engine-level "post-repin hook": none; `regenerate` runs inside `applyUnderLock` after the copy, which is the post-repin point, so no new hook is needed. (iteration 3)
- Trusting the repin workflow's stage invariant: the engine's stage branch contradicts it, so the workflow text needs the correction, not just the engine. (iteration 3)
- Expecting `.opencode/scripts` and `.dsh` to be engine features: both are manifest configuration plus defaults, and only the defaults need to change. (iteration 4)
- Expecting the docs to be silent about overlays: root README section 5 and the reference are thorough, so the fix is routing and adoption guidance rather than writing the feature up from scratch. (iteration 4)
- Expecting the engine to need a root-file copy rule: the exclusion is deliberate and correct for a re-pin; the gap is the missing report line and the missing precedence rule, not the exclusion. (iteration 4)
- Looking for a documented precedence between `/doctor:agents-md` and the overlay engine over `AGENTS.md`: none exists. (iteration 4)
- Searching `update.md`, `symlink.md`, `runtime-mirrors.md` and `env.md` for overlay mentions: zero in each, which confirms the discovery gap is route-level rather than a single missing sentence. (iteration 4)
- Adopting Barter's extension allowlist: it trades an explicit per-path declaration for a name heuristic, which is the wrong direction for a secret-file guard. (iteration 5)
- Looking for a single migration document that already covers an existing hand-rolled overlay folder: none exists in the doctor skill or the command docs, which is why D2 is a real deliverable rather than a reorganisation. (iteration 5)
- Looking for a test that would catch a missing `.dsh` default: the engine tests do not enumerate the default list, only the doctor mirror contract does. (iteration 5)
- Prioritising the Barter fork's two extra states above the smaller fixes: they are the most expensive changes and the least blocking, and a repo can adopt the engine without them. (iteration 5)
- Treating the `.dsh` default as a documentation-only change: the repin tests assert exact copy counts, so it is a code + test change with a doc note. (iteration 5)

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

Bounded context snapshot captured at init from the dispatch brief and a first read of the packet:

- Source pointers (Skilled side): `.skilled/commands/doctor/overlay.md`, `.skilled/commands/doctor/scripts/overlay-engine.cjs`, `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs`, `.skilled/commands/doctor/assets/doctor-overlay-*.yaml`, `.skilled/skills/system-skilled-doctor/{SKILL.md,README.md,references/overlays.md}`, `.skilled/hooks/overlay-guard/`, root `README.md` section 5, doctor install/helper/setup scripts.
- Source pointers (Barter side, read-only): `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/{README.md,overlay-manifest.json,replay.cjs,sync.cjs,sync-state.json}`, `skilled/.skilled/hooks/overlay-sync/`, Barter `README.md`.
- Integration points: manifest `overlays`/`layoutLinks`/`regenerate`/`verifyGenerated`/`repin` blocks; `.skilled-overlays.json` setting; engine exit codes 0/1/2; `.skilled/hooks/overlay-guard` per-runtime adapters; doctor runtime mirrors (`sync-skills-dsh`, `sync-prompts-dsh`, `sync-agents-dsh`).
- Constraints and risks: Barter repo is read-only; the lineage may write only inside its own artifact dir; the workflow's spec.md writeback and memory save are out of scope for this lineage and must be recorded as narrowed scope rather than executed.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (stopPolicy `max-iterations`)
- Convergence threshold: 0.05 (telemetry only under this stop policy)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl` (not used by this lineage)
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-07T21:42:10Z

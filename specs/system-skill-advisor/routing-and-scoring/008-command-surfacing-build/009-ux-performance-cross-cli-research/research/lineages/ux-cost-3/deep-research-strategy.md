---
title: Deep Research Strategy - ux-cost-3 (UX and cost lane, segment three)
description: Tracks the ux-cost-3 lineage of the segment-three command-surfacing research after phases 011, 012 and 013 are built: hook health default, brief token cost, cold start.
trigger_phrases: []
importance_tier: normal
contextType: planning
---
# Deep Research Strategy - ux-cost-3

## 1. OVERVIEW

Lane label `ux-cost-3`: what the person and the model read, and what it costs, measured on the built state of phases 011, 012 and 013. Segment three of the command-surfacing research.

## 2. TOPIC

UX and cost lane. Two carried questions: (c) whether hook health should be written by default and at what byte, latency, growth and privacy cost, and (f) what the brief and the cold path cost per prompt now, plus any cut to the brief that loses no information. Anything already ranked, built or declined in segment one (`research/research.md`) or segment two (`research/research-segment-2.md` sections 3 and 4) is excluded unless a new measurement changes its disposition.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] KQ1: What should the hook-health default be, and what does a default-on record cost per prompt in bytes written, latency, file growth and privacy of what is recorded?
- [x] KQ2: What do the brief and the cold path cost per prompt at HEAD, and which brief bytes can be cut with the same command, policy and skill still reaching the model?
- [x] KQ3: Which ranked changes follow from the answers, by expected gain per unit of risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer [160,50,21,5])?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending what phases 011, 012 and 013 built: typed delivery 44 of 44, the visibility guard, hook health in `advisor_status` and `/doctor:setup`, `measure-brief-cost.mjs`, the doctor hand-off naming, the `(needs a mode)` label, the deep pairs, the create anchors, the pointer write, the delivery leg, the OpenCode mapper fix.
- Re-recommending segment-one and segment-two dispositions: trimming the comment-hygiene directive, the `create` rename, caching and precompute, keeping the embed model warm, warming the embedder at session start, raising the `COMMAND:` line rate, enriching intent signals (rank 15), the Gate 2 clause (operator).
- Changing scorer weights, corpus labels, pins or the Python scorer.
- Starting a model CLI session, an arena, an advisor daemon or ollama; running the full test suite.
- Reading or printing the prompt text of a holdout row, or reading `holdout-prompts.jsonl`.
- Editing any file outside this lineage directory.

---

## 5. STOP CONDITIONS

- Convergence at newInfoRatio 0.05 or below, with every key question answered or explicitly carried forward.
- Six iterations at most; a thin iteration is recorded with status `timeout` or `stuck`, not skipped.
- Stop early only for unrecoverable state corruption or a missing control file.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1: What should the hook-health default be, and what does a default-on record cost per prompt in bytes written, latency, file growth and privacy of what is recorded?
- KQ2: What do the brief and the cold path cost per prompt at HEAD, and which brief bytes can be cut with the same command, policy and skill still reaching the model?
- KQ3: Which ranked changes follow from the answers, by expected gain per unit of risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer [160,50,21,5])?

<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- KQ3: ranking and floor risk. (iteration 1)
- KQ2: brief and cold-path cost at HEAD, and which bytes can be cut with no information lost. (iteration 1)
- KQ3: the ranking, the floor risk, and the verification each change needs. (iteration 2)
- None in this lane's two carried questions. The cold-embedder sample stays a recorded gap, not an open question. (iteration 3)
- Whether the plugin-shaped runtimes (OpenCode, Pi, DSH) can carry any health signal at all, and what the brief costs per runtime rather than per Claude prompt. (iteration 4)
- None in this lane. The cold-embedder sample stays a recorded gap. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

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

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- measuring the write in-process first turned a vague "diagnostics cost something" into 0.26 ms, which then explained why the hook-level block design had to be wrong. Counting the two metric file kinds was the cheapest possible evidence of real uptake, and it is the fact that actually decides the default. (iteration 1)
- running the sanctioned script and then the same rows live turned a number into a defect. The script's sandbox is not a neutral choice — it decides which arm is measured — and only the A/B made that visible. (iteration 2)
- ranking after measuring the floors, rather than before, made "no floor risk" a claim with a printed baseline behind it. Running the capture read-only cost one command and converted an assertion into evidence. (iteration 3)
- reading the funnel before the call sites turned a suspected six-file change into one function plus one parameter. Counting the health window explained why a default flip matters even at three records: the field is a rolling window and today it can only ever be a debug session's length. (iteration 4)
- following the renderer once answered the byte question for all six runtimes, because every adapter delegates. The same read showed the opposite for health: the fields are per-adapter, so coverage cannot be assumed from the brief. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first hook design ran four runs off then four on per prompt. Within a prompt the daemon drifted more than the write costs, so the +40 ms was an artifact. The paired design removed that. (iteration 1)
- the first read of the 361 median looked like brief growth of 21%. Comparing min, median and max showed all rows identical, which is the signature of a single canned string, not of 44 different heads. (iteration 2)
- the first framing of change 1 claimed the doctor would show health on a fresh install. Reading the leg's exit-75 rule cut that claim to "whenever the daemon answers", which is the honest bound. (iteration 3)
- iteration 3 rated change 3 at zero risk because it costs zero bytes. Bytes are not the only risk; a strict schema is a contract, and the rating was wrong in kind. (iteration 4)
- grepping the DSH plugin for a renderer found nothing, which first looked like a gap. It is the expected shape — DSH consumes the shared CLI path — and the absence is the evidence. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A new writer for health records.** Rejected: `writeBoundedJsonl` already takes `requireDebug: false` and the outcome records use it, so a second sink would duplicate the trim, the private modes and the queue. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A new writer for health records.** Rejected: `writeBoundedJsonl` already takes `requireDebug: false` and the outcome records use it, so a second sink would duplicate the trim, the private modes and the queue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new writer for health records.** Rejected: `writeBoundedJsonl` already takes `requireDebug: false` and the outcome records use it, so a second sink would duplicate the trim, the private modes and the queue.

### **A per-runtime head to save bytes on hosts that resolve commands themselves.** Rejected again on the measurement: every host already gets the same 78-byte head, and segment one's rank 7 (a document path in the head) is the opposite direction, an addition rather than a cut. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A per-runtime head to save bytes on hosts that resolve commands themselves.** Rejected again on the measurement: every host already gets the same 78-byte head, and segment one's rank 7 (a document path in the head) is the opposite direction, an addition rather than a cut.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A per-runtime head to save bytes on hosts that resolve commands themselves.** Rejected again on the measurement: every host already gets the same 78-byte head, and segment one's rank 7 (a document path in the head) is the opposite direction, an addition rather than a cut.

### **Adding `lastRecordAt` beside the field instead of inside `hookHealth`.** Rejected: it would still be a strict-schema addition, and it would separate the age from the number it qualifies. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Adding `lastRecordAt` beside the field instead of inside `hookHealth`.** Rejected: it would still be a strict-schema addition, and it would separate the age from the number it qualifies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding `lastRecordAt` beside the field instead of inside `hookHealth`.** Rejected: it would still be a strict-schema addition, and it would separate the age from the number it qualifies.

### **Default-on with the full record as it stands.** It works (200 bytes, 0.26 ms) but it makes the skill id persist for every prompt on every install, and no reader uses that field. Rejected on privacy cost with no measured benefit. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Default-on with the full record as it stands.** It works (200 bytes, 0.26 ms) but it makes the skill id persist for every prompt on every install, and no reader uses that field. Rejected on privacy cost with no measured benefit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Default-on with the full record as it stands.** It works (200 bytes, 0.26 ms) but it makes the skill id persist for every prompt on every install, and no reader uses that field. Rejected on privacy cost with no measured benefit.

### **Dropping the score pair or the freshness word to save 22 bytes.** Rejected as a recommendation: 22 bytes is 7.4% of a first-message brief and 28% of a steady-state one, but each field carries a distinction the model or the guide uses, so it fails the "loses no information" test the question sets. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Dropping the score pair or the freshness word to save 22 bytes.** Rejected as a recommendation: 22 bytes is 7.4% of a first-message brief and 28% of a steady-state one, but each field carries a distinction the model or the guide uses, so it fails the "loses no information" test the question sets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Dropping the score pair or the freshness word to save 22 bytes.** Rejected as a recommendation: 22 bytes is 7.4% of a first-message brief and 28% of a steady-state one, but each field carries a distinction the model or the guide uses, so it fails the "loses no information" test the question sets.

### **Extending change 1 to the plugin runtimes in the same change.** Rejected as scope: it needs a timer, a writer and a new test surface on three adapters, and it would turn a two-line default flip into a multi-adapter build. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Extending change 1 to the plugin runtimes in the same change.** Rejected as scope: it needs a timer, a writer and a new test surface on three adapters, and it would turn a two-line default flip into a multi-adapter build.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Extending change 1 to the plugin runtimes in the same change.** Rejected as scope: it needs a timer, a writer and a new test surface on three adapters, and it would turn a two-line default flip into a multi-adapter build.

### **Putting the skill id back behind a separate opt-in flag.** Rejected: no reader consumes it for health, and the diagnostics file's own comment names the privacy reason it is sensitive. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Putting the skill id back behind a separate opt-in flag.** Rejected: no reader consumes it for health, and the diagnostics file's own comment names the privacy reason it is sensitive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Putting the skill id back behind a separate opt-in flag.** Rejected: no reader consumes it for health, and the diagnostics file's own comment names the privacy reason it is sensitive.

### **Recording only fail-open and non-ok invocations.** Rejected: `rollingCacheHitRate` and `rollingP95Ms` need the ok population, so the health section would reduce to a fail-open count. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Recording only fail-open and non-ok invocations.** Rejected: `rollingCacheHitRate` and `rollingP95Ms` need the ok population, so the health section would reduce to a fail-open count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recording only fail-open and non-ok invocations.** Rejected: `rollingCacheHitRate` and `rollingP95Ms` need the ok population, so the health section would reduce to a fail-open count.

### **Reporting the script's 361 as the brief cost.** Rejected: it is the outage line. Any brief-cost figure from this script must be labelled with the arm that produced it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reporting the script's 361 as the brief cost.** Rejected: it is the outage line. Any brief-cost figure from this script must be labelled with the arm that produced it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reporting the script's 361 as the brief cost.** Rejected: it is the outage line. Any brief-cost figure from this script must be labelled with the arm that produced it.

### **Sampling health records (one in N prompts).** Rejected on arithmetic: at 120 bytes and 0.26 ms, sampling saves nothing measurable while making `rollingP95Ms` a sample of a sample and `invocations` no longer a prompt count. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Sampling health records (one in N prompts).** Rejected on arithmetic: at 120 bytes and 0.26 ms, sampling saves nothing measurable while making `rollingP95Ms` a sample of a sample and `invocations` no longer a prompt count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Sampling health records (one in N prompts).** Rejected on arithmetic: at 120 bytes and 0.26 ms, sampling saves nothing measurable while making `rollingP95Ms` a sample of a sample and `invocations` no longer a prompt count.

### **Seeding one record at install time** (set `SKILL_ADVISOR_DEBUG=1` in the prove-it step). Rejected: the section would then show `p95 68 ms over 1 prompt` from install day forever, because `hookHealth` carries no age. A stale health number that never changes is worse than a missing one, and `advisor_status` has no field to express it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Seeding one record at install time** (set `SKILL_ADVISOR_DEBUG=1` in the prove-it step). Rejected: the section would then show `p95 68 ms over 1 prompt` from install day forever, because `hookHealth` carries no age. A stale health number that never changes is worse than a missing one, and `advisor_status` has no field to express it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Seeding one record at install time** (set `SKILL_ADVISOR_DEBUG=1` in the prove-it step). Rejected: the section would then show `p95 68 ms over 1 prompt` from install day forever, because `hookHealth` carries no age. A stale health number that never changes is worse than a missing one, and `advisor_status` has no field to express it.

### **Threading the gate decision through all six `emitDiagnostic` call sites.** Rejected: the funnel already exists and six edits would be six places to drift. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Threading the gate decision through all six `emitDiagnostic` call sites.** Rejected: the funnel already exists and six edits would be six places to drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Threading the gate decision through all six `emitDiagnostic` call sites.** Rejected: the funnel already exists and six edits would be six places to drift.

### **Trimming the comment-hygiene directive.** Re-confirmed as eliminated, not reopened: it is 206 of the 218 constant bytes, it is suppressed after a session's first message, and it is the only carrier of the repo hard block in a brief-only session. The new measurement (218 not 233 bytes) does not change that disposition because the cost is once per session. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Trimming the comment-hygiene directive.** Re-confirmed as eliminated, not reopened: it is 206 of the 218 constant bytes, it is suppressed after a session's first message, and it is the only carrier of the repo hard block in a brief-only session. The new measurement (218 not 233 bytes) does not change that disposition because the cost is once per session.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trimming the comment-hygiene directive.** Re-confirmed as eliminated, not reopened: it is 206 of the 218 constant bytes, it is suppressed after a session's first message, and it is the only carrier of the repo hard block in a brief-only session. The new measurement (218 not 233 bytes) does not change that disposition because the cost is once per session.

### A block design (N runs off, then N runs on) cannot measure this: daemon variance over seconds is 10x the write. Any reproduction must alternate pairs and report the paired delta. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A block design (N runs off, then N runs on) cannot measure this: daemon variance over seconds is 10x the write. Any reproduction must alternate pairs and report the paired delta.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A block design (N runs off, then N runs on) cannot measure this: daemon variance over seconds is 10x the write. Any reproduction must alternate pairs and report the paired delta.

### Asking the cost script for a live number by unsetting `SPECKIT_IPC_SOCKET_DIR` inside it is not possible without editing the script; the script sets the variable per row. A live measurement needs a second entry point, which is what `scratch/live-brief-cost.mjs` is. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Asking the cost script for a live number by unsetting `SPECKIT_IPC_SOCKET_DIR` inside it is not possible without editing the script; the script sets the variable per row. A live measurement needs a second entry point, which is what `scratch/live-brief-cost.mjs` is.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Asking the cost script for a live number by unsetting `SPECKIT_IPC_SOCKET_DIR` inside it is not possible without editing the script; the script sets the variable per row. A live measurement needs a second entry point, which is what `scratch/live-brief-cost.mjs` is.

### Comparing 011's 299 to today's 296 as "the brief shrank" is not supportable: both are within one renderer revision of each other and neither run pinned the same daemon state. The supportable claim is that the live brief is 284 to 336 bytes at HEAD. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Comparing 011's 299 to today's 296 as "the brief shrank" is not supportable: both are within one renderer revision of each other and neither run pinned the same daemon state. The supportable claim is that the live brief is 284 to 336 bytes at HEAD.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing 011's 299 to today's 296 as "the brief shrank" is not supportable: both are within one renderer revision of each other and neither run pinned the same daemon state. The supportable claim is that the live brief is 284 to 336 bytes at HEAD.

### Looking for a doctor presentation line for hook health outside the leg text: `doctor-setup-presentation.txt` and `setup.md` carry no hook-health string, so the leg text in `doctor-setup.yaml` is the only display contract. Any wording change for change 3 lives there. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a doctor presentation line for hook health outside the leg text: `doctor-setup-presentation.txt` and `setup.md` carry no hook-health string, so the leg text in `doctor-setup.yaml` is the only display contract. Any wording change for change 3 lives there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a doctor presentation line for hook health outside the leg text: `doctor-setup-presentation.txt` and `setup.md` carry no hook-health string, so the leg text in `doctor-setup.yaml` is the only display contract. Any wording change for change 3 lives there.

### Looking for a DSH renderer or an `Advisor:` emitter in `.dsh/plugins/repo-guards/index.mjs` printed nothing, so DSH's brief arrives through the shared CLI path rather than a local renderer. That is consistent with the plugin finding and adds no separate cost. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a DSH renderer or an `Advisor:` emitter in `.dsh/plugins/repo-guards/index.mjs` printed nothing, so DSH's brief arrives through the shared CLI path rather than a local renderer. That is consistent with the plugin finding and adds no separate cost.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a DSH renderer or an `Advisor:` emitter in `.dsh/plugins/repo-guards/index.mjs` printed nothing, so DSH's brief arrives through the shared CLI path rather than a local renderer. That is consistent with the plugin finding and adds no separate cost.

### Reading the doctor leg as proof that a default flip is sufficient: the leg SKIPs without a daemon, so health visibility has two preconditions, not one. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading the doctor leg as proof that a default flip is sufficient: the leg SKIPs without a daemon, so health visibility has two preconditions, not one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the doctor leg as proof that a default flip is sufficient: the leg SKIPs without a daemon, so health visibility has two preconditions, not one.

### Reading the record's own `emittedBytes` as a brief-cost measurement is valid (it is the byte count the hook emitted) but it includes the directive block, so it measures the first message of a session, not the steady state. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the record's own `emittedBytes` as a brief-cost measurement is valid (it is the byte count the hook emitted) but it includes the directive block, so it measures the first message of a session, not the steady state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the record's own `emittedBytes` as a brief-cost measurement is valid (it is the byte count the hook emitted) but it includes the directive block, so it measures the first message of a session, not the steady state.

### Treating the capture's `agreement` change as evidence about this lane: the denominator changed, which no change here can cause. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the capture's `agreement` change as evidence about this lane: the denominator changed, which no change here can cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the capture's `agreement` change as evidence about this lane: the denominator changed, which no change here can cause.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Default-on with the full record as it stands.** It works (200 bytes, 0.26 ms) but it makes the skill id persist for every prompt on every install, and no reader uses that field. Rejected on privacy cost with no measured benefit. (iteration 1)
- **Recording only fail-open and non-ok invocations.** Rejected: `rollingCacheHitRate` and `rollingP95Ms` need the ok population, so the health section would reduce to a fail-open count. (iteration 1)
- **Seeding one record at install time** (set `SKILL_ADVISOR_DEBUG=1` in the prove-it step). Rejected: the section would then show `p95 68 ms over 1 prompt` from install day forever, because `hookHealth` carries no age. A stale health number that never changes is worse than a missing one, and `advisor_status` has no field to express it. (iteration 1)
- A block design (N runs off, then N runs on) cannot measure this: daemon variance over seconds is 10x the write. Any reproduction must alternate pairs and report the paired delta. (iteration 1)
- Reading the record's own `emittedBytes` as a brief-cost measurement is valid (it is the byte count the hook emitted) but it includes the directive block, so it measures the first message of a session, not the steady state. (iteration 1)
- **Dropping the score pair or the freshness word to save 22 bytes.** Rejected as a recommendation: 22 bytes is 7.4% of a first-message brief and 28% of a steady-state one, but each field carries a distinction the model or the guide uses, so it fails the "loses no information" test the question sets. (iteration 2)
- **Reporting the script's 361 as the brief cost.** Rejected: it is the outage line. Any brief-cost figure from this script must be labelled with the arm that produced it. (iteration 2)
- **Trimming the comment-hygiene directive.** Re-confirmed as eliminated, not reopened: it is 206 of the 218 constant bytes, it is suppressed after a session's first message, and it is the only carrier of the repo hard block in a brief-only session. The new measurement (218 not 233 bytes) does not change that disposition because the cost is once per session. (iteration 2)
- Asking the cost script for a live number by unsetting `SPECKIT_IPC_SOCKET_DIR` inside it is not possible without editing the script; the script sets the variable per row. A live measurement needs a second entry point, which is what `scratch/live-brief-cost.mjs` is. (iteration 2)
- Comparing 011's 299 to today's 296 as "the brief shrank" is not supportable: both are within one renderer revision of each other and neither run pinned the same daemon state. The supportable claim is that the live brief is 284 to 336 bytes at HEAD. (iteration 2)
- **A new writer for health records.** Rejected: `writeBoundedJsonl` already takes `requireDebug: false` and the outcome records use it, so a second sink would duplicate the trim, the private modes and the queue. (iteration 3)
- **Putting the skill id back behind a separate opt-in flag.** Rejected: no reader consumes it for health, and the diagnostics file's own comment names the privacy reason it is sensitive. (iteration 3)
- **Sampling health records (one in N prompts).** Rejected on arithmetic: at 120 bytes and 0.26 ms, sampling saves nothing measurable while making `rollingP95Ms` a sample of a sample and `invocations` no longer a prompt count. (iteration 3)
- Reading the doctor leg as proof that a default flip is sufficient: the leg SKIPs without a daemon, so health visibility has two preconditions, not one. (iteration 3)
- Treating the capture's `agreement` change as evidence about this lane: the denominator changed, which no change here can cause. (iteration 3)
- **Adding `lastRecordAt` beside the field instead of inside `hookHealth`.** Rejected: it would still be a strict-schema addition, and it would separate the age from the number it qualifies. (iteration 4)
- **Threading the gate decision through all six `emitDiagnostic` call sites.** Rejected: the funnel already exists and six edits would be six places to drift. (iteration 4)
- Looking for a doctor presentation line for hook health outside the leg text: `doctor-setup-presentation.txt` and `setup.md` carry no hook-health string, so the leg text in `doctor-setup.yaml` is the only display contract. Any wording change for change 3 lives there. (iteration 4)
- **A per-runtime head to save bytes on hosts that resolve commands themselves.** Rejected again on the measurement: every host already gets the same 78-byte head, and segment one's rank 7 (a document path in the head) is the opposite direction, an addition rather than a cut. (iteration 5)
- **Extending change 1 to the plugin runtimes in the same change.** Rejected as scope: it needs a timer, a writer and a new test surface on three adapters, and it would turn a two-line default flip into a multi-adapter build. (iteration 5)
- Looking for a DSH renderer or an `Advisor:` emitter in `.dsh/plugins/repo-guards/index.mjs` printed nothing, so DSH's brief arrives through the shared CLI path rather than a local renderer. That is consistent with the plugin finding and adds no separate cost. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

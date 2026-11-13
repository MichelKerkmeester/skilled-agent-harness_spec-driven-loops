---
title: Deep Research Strategy - ux-cost-2 (UX and cost lane, segment two)
description: Tracks the ux-cost-2 lineage of the segment-two command-surfacing research: focus, questions, known context and boundaries.
trigger_phrases: []
importance_tier: normal
contextType: planning
---
# Deep Research Strategy - ux-cost-2

## 1. OVERVIEW

Lane label `ux-cost-2`: what the person and the model read, and what it costs. Segment two of the command-surfacing research, run against the built state of phases 005, 006, 008 and 010 and the in-flight phase 011.

## 2. TOPIC

UX and cost lane. Which changes to the brief wording, the run/start/ask wording, the install and setup path for an external repository, and the embedder keep-alive raise how often a plain request is started on its expected command, and at what byte, token, memory and latency cost? Anything phases 005, 006, 008, 010 and 011 already built or plan is excluded.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] KQ1: Which words in the delivered brief and its policy definition reach the model, and which reach only AGENTS.md?
- [x] KQ2: What does the brief cost per prompt after phase 005, and which repeated bytes can move to once per session?
- [x] KQ3: What must an external repository install do so a plain request gets an offered command with a usable policy?
- [x] KQ4: Should the semantic embedder be kept warm, and at what memory and latency cost against the 750 ms deadline?
- [x] KQ5: Which ranked changes raise started-when-useful per unit of risk without lowering any floor?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-recommending anything phases 005, 006, 008, 010 or 011 built or plan: the command contract and brief head, the Gate 2 bullet, the Codex approval step, DSH reachability, the hook-wiring check, offer recording, the attributable scorer, the argued-route lookup, typed delivery 44 of 44, the visibility guard, hook health in status, the setup leg and the brief-cost script.
- Changing scorer weights, the `/speckit:resume` disambiguation, the Python scorer or any corpus label.
- Starting a model CLI session, an arena, a daemon or ollama; running the full test suite.
- Reading or printing the prompt text of any row whose split is holdout. Tune and none rows may be read.
- Editing any file outside this lineage directory.

---

## 5. STOP CONDITIONS

- Three iterations complete with all five key questions answered or explicitly carried forward.
- A fourth iteration only if the third leaves a load-bearing claim unresolved or a ranking conflict open.
- Stop early only for unrecoverable state corruption or a missing control file; a thin iteration is recorded with status `timeout` or `stuck`, not skipped.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ1: Which words in the delivered brief and its policy definition reach the model, and which reach only AGENTS.md?
- KQ2: What does the brief cost per prompt after phase 005, and which repeated bytes can move to once per session?
- KQ3: What must an external repository install do so a plain request gets an offered command with a usable policy?
- KQ4: Should the semantic embedder be kept warm, and at what memory and latency cost against the 750 ms deadline?
- KQ5: Which ranked changes raise started-when-useful per unit of risk without lowering any floor?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- computing the brief from the renderer and the generated table, rather than trusting the reported 242-298 bytes, exposed that the head is only 27% of the brief and that the constant block never shrinks. Parsing the table also made the "room for a gloss" question numeric instead of rhetorical. (iteration 1)
- following the printed install steps in order, then asking what each final check actually reads, found a green status that no measured runtime supports. Comparing the two instruction-file shapes explained why the same brief behaved differently on Claude between the main checkout and the arena. (iteration 2)
- reading the request payload and the race together separated "cold is slow" from "cold loses the lane"; the 750 ms abandon plus the 5 s request timeout means the cost lands once, then the server is warm. That turned a keep-alive question into a session-start question. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- looking for an emitter-side suppression failed because the state machine is a measurement surface; segment one read its own shadow metric as delivery. (iteration 1)
- searching for an existing brief-delivery leg failed because every leg is a component check; none composes "the runtime can receive a brief" from the hook file plus the approval plus the instruction file. (iteration 2)
- looking for a committed cold number failed; the planning file measured warm only, so the cold claim stays marked as dispatch-provided. That is a confidence limit on rank 5, not a reason to drop it. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding a policy gloss to every brief head: after rank 1 the definition arrives through the instruction file, so the gloss duplicates it at 40 bytes per prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Adding a policy gloss to every brief head: after rank 1 the definition arrives through the instruction file, so the gloss duplicates it at 40 bytes per prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a policy gloss to every brief head: after rank 1 the definition arrives through the instruction file, so the gloss duplicates it at 40 bytes per prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588]

### Emitting the route-only brief after first delivery: the shadow plan would drop the hard block exactly in the sessions where `AGENTS.md` is absent, which is the measured Claude case. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:406] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Emitting the route-only brief after first delivery: the shadow plan would drop the hard block exactly in the sessions where `AGENTS.md` is absent, which is the measured Claude case. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:406]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Emitting the route-only brief after first delivery: the shadow plan would drop the hard block exactly in the sessions where `AGENTS.md` is absent, which is the measured Claude case. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:406]

### Extending `keep_alive` to hold the model all day: about 320 MB resident for one saved 538 ms call per idle window, against a deadline that already passes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Extending `keep_alive` to hold the model all day: about 320 MB resident for one saved 538 ms call per idle window, against a deadline that already passes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extending `keep_alive` to hold the model all day: about 320 MB resident for one saved 538 ms call per idle window, against a deadline that already passes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3]

### Keep a full `CLAUDE.md` copy from `embed`: the manifest's own reason says a full copy double-loads or drifts; a pointer avoids both. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:744] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Keep a full `CLAUDE.md` copy from `embed`: the manifest's own reason says a full copy double-loads or drifts; a pointer avoids both. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:744]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keep a full `CLAUDE.md` copy from `embed`: the manifest's own reason says a full copy double-loads or drifts; a pointer avoids both. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:744]

### Leave the Codex signal to `/doctor:runtime-mirrors`: a person who ran the six printed install steps has no reason to run a seventh command, so the zero stays silent. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Leave the Codex signal to `/doctor:runtime-mirrors`: a person who ran the six printed install steps has no reason to run a seventh command, so the zero stays silent. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Leave the Codex signal to `/doctor:runtime-mirrors`: a person who ran the six printed install steps has no reason to run a seventh command, so the zero stays silent. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54]

### Looking for a `keep_alive` knob already wired: the path has none, and the adapter's only timeout is the 5,000 ms request timeout. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a `keep_alive` knob already wired: the path has none, and the adapter's only timeout is the 5,000 ms request timeout. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `keep_alive` knob already wired: the path has none, and the adapter's only timeout is the 5,000 ms request timeout. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110]

### Looking for a check that fails on the embed shape: A1 only names `claude-only`, and A10 accepts `absent`, so both rows pass. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a check that fails on the embed shape: A1 only names `claude-only`, and A10 accepts `absent`, so both rows pass. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a check that fails on the embed shape: A1 only names `claude-only`, and A10 accepts `absent`, so both rows pass. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217]

### Looking for a setup leg that already covers brief delivery: the advisor leg checks `advisor_status` freshness, not a delivered brief, and the embedder leg checks the semantic lane. Neither reads a run log or a hook approval. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a setup leg that already covers brief delivery: the advisor leg checks `advisor_status` freshness, not a delivered brief, and the embedder leg checks the semantic lane. Neither reads a run log or a hook approval. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a setup leg that already covers brief delivery: the advisor leg checks `advisor_status` freshness, not a delivered brief, and the embedder leg checks the semantic lane. Neither reads a run log or a hook approval. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57]

### Looking for the cold number in the committed measurement: the planning file records warm only; 538.53 ms is the dispatch's after-build measurement, so it is cited as dispatch-provided and the warm number as committed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for the cold number in the committed measurement: the planning file records warm only; 538.53 ms is the dispatch's after-build measurement, so it is cited as dispatch-provided and the warm number as committed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for the cold number in the committed measurement: the planning file records warm only; 538.53 ms is the dispatch's after-build measurement, so it is cited as dispatch-provided and the warm number as committed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]

### Removing the confidence/uncertainty pair: 14 bytes saved, no measurable path, and the ambiguous head uses both numbers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Removing the confidence/uncertainty pair: 14 bytes saved, no measurable path, and the ambiguous head uses both numbers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing the confidence/uncertainty pair: 14 bytes saved, no measurable path, and the ambiguous head uses both numbers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575]

### Replacing the confidence/uncertainty pair with prose: no measurable path, and the ambiguous head uses both numbers to compare two candidates. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Replacing the confidence/uncertainty pair with prose: no measurable path, and the ambiguous head uses both numbers to compare two candidates. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing the confidence/uncertainty pair with prose: no measurable path, and the ambiguous head uses both numbers to compare two candidates. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575]

### Searching for a per-session suppression in the emitted path: the only suppression logic (`SUPPRESSED_SAME`, `routeOnlyEligible`) feeds the shadow log, not the returned string. No emitter-side gate exists to reuse. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:453] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a per-session suppression in the emitted path: the only suppression logic (`SUPPRESSED_SAME`, `routeOnlyEligible`) feeds the shadow log, not the returned string. No emitter-side gate exists to reuse. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:453]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a per-session suppression in the emitted path: the only suppression logic (`SUPPRESSED_SAME`, `routeOnlyEligible`) feeds the shadow log, not the returned string. No emitter-side gate exists to reuse. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:453]

### Treating the `Brief` byte totals in segment one as per-command: they are first-render totals; the head varies by 42 bytes across commands. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the `Brief` byte totals in segment one as per-command: they are first-render totals; the head varies by 42 bytes across commands. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `Brief` byte totals in segment one as per-command: they are first-render totals; the head varies by 42 bytes across commands. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82]

### Treating the cold daemon measurement as the embedder decision: the declined warm-up measured brief fail-open (0 of 5), not a semantic-lane degrade, and the two have different deadlines. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:159] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the cold daemon measurement as the embedder decision: the declined warm-up measured brief fail-open (0 of 5), not a semantic-lane degrade, and the two have different deadlines. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:159]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the cold daemon measurement as the embedder decision: the declined warm-up measured brief fail-open (0 of 5), not a semantic-lane degrade, and the two have different deadlines. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:159]

### Trimming the comment-hygiene directive to save tokens: it is a repository hard block and the only place the rule reaches a brief-only session. The new measurement changes its size, not its status. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Trimming the comment-hygiene directive to save tokens: it is a repository hard block and the only place the rule reaches a brief-only session. The new measurement changes its size, not its status. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trimming the comment-hygiene directive to save tokens: it is a repository hard block and the only place the rule reaches a brief-only session. The new measurement changes its size, not its status. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127]

### Write the operator's global `~/.claude/CLAUDE.md` from the install path: outside the repository, declared report-only by the manifest, and it changes what every session on the machine loads. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:777] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Write the operator's global `~/.claude/CLAUDE.md` from the install path: outside the repository, declared report-only by the manifest, and it changes what every session on the machine loads. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:777]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Write the operator's global `~/.claude/CLAUDE.md` from the install path: outside the repository, declared report-only by the manifest, and it changes what every session on the machine loads. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:777]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Emitting the route-only brief after first delivery: the shadow plan would drop the hard block exactly in the sessions where `AGENTS.md` is absent, which is the measured Claude case. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:406] (iteration 1)
- Replacing the confidence/uncertainty pair with prose: no measurable path, and the ambiguous head uses both numbers to compare two candidates. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575] (iteration 1)
- Searching for a per-session suppression in the emitted path: the only suppression logic (`SUPPRESSED_SAME`, `routeOnlyEligible`) feeds the shadow log, not the returned string. No emitter-side gate exists to reuse. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:453] (iteration 1)
- Treating the `Brief` byte totals in segment one as per-command: they are first-render totals; the head varies by 42 bytes across commands. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82] (iteration 1)
- Trimming the comment-hygiene directive to save tokens: it is a repository hard block and the only place the rule reaches a brief-only session. The new measurement changes its size, not its status. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:127] (iteration 1)
- Keep a full `CLAUDE.md` copy from `embed`: the manifest's own reason says a full copy double-loads or drifts; a pointer avoids both. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:744] (iteration 2)
- Leave the Codex signal to `/doctor:runtime-mirrors`: a person who ran the six printed install steps has no reason to run a seventh command, so the zero stays silent. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54] (iteration 2)
- Looking for a check that fails on the embed shape: A1 only names `claude-only`, and A10 accepts `absent`, so both rows pass. [SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:217] (iteration 2)
- Looking for a setup leg that already covers brief delivery: the advisor leg checks `advisor_status` freshness, not a delivered brief, and the embedder leg checks the semantic lane. Neither reads a run log or a hook approval. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57] (iteration 2)
- Write the operator's global `~/.claude/CLAUDE.md` from the install path: outside the repository, declared report-only by the manifest, and it changes what every session on the machine loads. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:777] (iteration 2)
- Adding a policy gloss to every brief head: after rank 1 the definition arrives through the instruction file, so the gloss duplicates it at 40 bytes per prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588] (iteration 3)
- Extending `keep_alive` to hold the model all day: about 320 MB resident for one saved 538 ms call per idle window, against a deadline that already passes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3] (iteration 3)
- Looking for a `keep_alive` knob already wired: the path has none, and the adapter's only timeout is the 5,000 ms request timeout. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110] (iteration 3)
- Looking for the cold number in the committed measurement: the planning file records warm only; 538.53 ms is the dispatch's after-build measurement, so it is cited as dispatch-provided and the warm number as committed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12] (iteration 3)
- Removing the confidence/uncertainty pair: 14 bytes saved, no measurable path, and the ambiguous head uses both numbers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575] (iteration 3)
- Treating the cold daemon measurement as the embedder decision: the declined warm-up measured brief fail-open (0 of 5), not a semantic-lane degrade, and the two have different deadlines. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:159] (iteration 3)

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

### Measured facts carried from the dispatch and the built phases

- Start rate, before to after: claude 3/12 to 4/12, codex 0/12 to 0/12, pi 0/11 to 2/10, devin 1/8 to 3/9, opencode 2/7 to 1/5, dsh 6/12 to 6/12. Unsafe runs 9 to 4. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:132]
- The expected command was offered on 3 of 16 plain tune rows and `/doctor:helper` on 2 more; nothing on 11. When offered, the model usually took it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl]
- Plain recall on the tune split is 9 of 45 on phrases and 14 of 45 with the real embedder. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:131]
- `cmd-deep-review-plain-tune-01` gets no command because the system-deep-loop hub defers on the mode; three runtimes then improvise a multi-pass audit and write. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:133]
- Brief delivery after: claude 24/24, devin 24/24, pi 24/24, dsh 23/23, opencode plugin loaded 24 times with no stored trace, codex 0/24 because a fresh checkout's project hooks are unapproved. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:135]
- The shared session readers under `.skilled/hooks/shared/session-readers/` drop injected context, so `briefDelivered` reads unknown for devin, dsh and opencode. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:170]
- Claude Code reads only the global instruction file, so a project without a CLAUDE.md never sees AGENTS.md Gate 2. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:130]
- The `COMMAND:` line the Gate 2 bullet asks for appears in 0 to 3 of 24 runs per runtime. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl]
- Embedder cost: 262 MB on disk, about 304 MB loaded, warm 4.8 ms, cold first call 538.53 ms, prompt embedding deadline 750 ms. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt]
- The delivery prefix to the last AGENTS.md anchor is 16092 of 16384 bytes, which leaves 292 bytes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/implementation-summary.md:166]
- The brief is 242-298 bytes and 60-75 tokens, of which 233 bytes is the constant directive. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md:82]

### Built-state pointers

- `runtime/lib/render.ts` renders the head and the directive block; `runtime/lib/command-attach.ts` holds `COMMAND_ROWS`; `AGENTS.md` Gate 2 holds the 463-byte command bullet.
- `INSTALL-SKILLED.md` is the external-repository path; `/doctor:agents-md embed` folds and removes a project `CLAUDE.md`; the agents-md check expects a project CLAUDE.md to be absent, a symlink or a pointer.
- The prompt embed path is `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` and `.skilled/skills/system-spec-kit/shared/embeddings/`.

### Bounded Context Snapshot

- Source pointers: `render.ts` (`commandLabel`, `capWithCompanion`, `HYGIENE_DIRECTIVE`), `command-attach.ts` (`COMMAND_ROWS`), `AGENTS.md` (Gate 2 bullet), `INSTALL-SKILLED.md` (Steps 1-2), `agents-md-embed.cjs` (ALLOWLIST, FOLDED_COPIES), `agents-md-check.cjs` (runtime copies), `semantic-shadow.ts`, `shared/embeddings/registry.ts`, `measure-embedder-cost.mjs`.
- Constraints: no scorer weight changes; no write outside the lineage; no model CLI session, arena, daemon or ollama control; holdout prompt text never read.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: this lineage's own `research.md`; the parent merge owns the combined synthesis
- Lifecycle branches: `new` only for this lineage
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: not used in a detached lineage
- Started: 2026-11-13T05:05:00Z

# Cross-CLI Command Surfacing: What Stops a Model From Starting an Offered Command

**Lineage:** cross-cli · **Run:** `fanout-cross-cli-1794523629654-v541y3` · **Iterations:** 3 · **Status:** converged (all key questions answered)

**Scope:** improvements after the planned phases 005-008 of `008-command-surfacing-build`, limited to per-runtime usefulness across Claude, Codex, OpenCode, Pi, Devin and DSH. UX and performance angles are covered by sibling lineages; this report notes them only where they change a runtime's start behaviour.

---

## 1. Executive Summary

The build's own pre-arm cannot yet answer the question it was built to answer. Three facts decide the cross-CLI picture:

1. **There is no surfacing baseline in the pre-arm.** Phase 005 is not built, so no brief names a command. The scorer counts a start when the model reads the expected command document, which can happen with no brief at all. The quoted rates (Claude 3/12, Codex 0/12, Pi 0/12, Devin 2/12, OpenCode 5/10, DSH 3/10 on the current file) are spontaneous document reads, not responses to an offer.
2. **Codex never received the brief in the run that produced 0/12.** Project hooks run only after per-entry approval stored in `~/.codex/config.toml`; the arena path has no entry there, and 0 of 6 raw Codex transcripts contain an `Advisor:` line. Codex's zero is a harness fact, not a model refusal.
3. **Only Pi's delivered brief is observable in the session record.** Pi injects the brief into the prompt (6 of 6 sampled sessions), Claude injects out of band (6 of 6 raw transcripts, 0 of 6 normalized records), and OpenCode shows it in 1 of 6. No current artifact can separate "offered and declined" from "never offered".

Five changes are recommended after phases 005-008. Two are install-path fixes that make Codex and DSH reachable at all, one is a small brief change for hosts with no command registry, one makes every later rate attributable, and one resolves the Claude `create` shadowing that phase 006 documents but no phase fixes. None repeats planned 005-008 work.

---

## 2. Research Question and Method

The question: after the planned phases, what still stops a model on each of the six runtimes from starting an offered command, and which change raises the start rate for the least work?

Method:

- Scored the live pre-arm log with the committed scorer (`--summary` and `--json`).
- Read phases 005-008 plans and tasks to establish what is already planned.
- Traced every runtime's delivery path to its source file, and read the install guide as an external user would.
- Loaded sampled sessions through the shared session readers and counted `Advisor:` and `COMMAND:` occurrences; repeated the check against raw Claude and Codex transcript files.
- Read the G5 artifact and the mirror generator that produces the affected path.
- Recorded what could not be measured under the steer's rules (no pi runs, no ollama changes, no process kills) as a gap rather than a guess.

---

## 3. Evidence Base

| Evidence | What it establishes |
|---|---|
| `scratch/runs-pre.jsonl` + scorer | Per-runtime rates, caps, row counts, `COMMAND:` counts |
| `scratch/g5/result.txt`, `listing-a/b.txt` | The `skill.md` folder shadowing, and its experimental limits |
| `005/plan.md` | The brief head after 005: `use <owner> → <command> (<policy>)` |
| `006/tasks.md` T003, T018 | The Gate 2 bullet and the runtime start semantics |
| `007/plan.md` ADR-002 | The `started` definition: document read, skill load, or `COMMAND: … started` |
| `008/scratch/measured-2026-11-12.txt` | Hook latency ~200 ms median against 2,500 ms; warm embed 6.57 ms |
| `.codex/README.md`, `~/.codex/config.toml` | Per-entry hook approval and the missing arena trust |
| `.dsh/plugins/repo-guards/*` | The `promptAdvisor` flag and its off default |
| `INSTALL-SKILLED.md` | The external install path: no Codex approval step, no DSH |
| `render.ts` | The brief head and its unused `runtime` option |
| `sync-runtime-mirrors.cjs` | The Claude mirror that creates `create/skill.md` |

---

## 4. Findings

### 4.1 The pre-arm measures the wrong thing

Phase 005 renders the command and policy into the brief; it is planned, not built. Pre-005 the brief names a skill only. The scorer's `started` is a document read or a `COMMAND:` line, so a model can "start" a command it was never offered. The missing `COMMAND:` line is therefore expected pre-change and proves nothing about the post-change contract. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:67] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:194] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:646]

### 4.2 The baseline in the dispatch is stale and the arm is still moving

Live scoring on the current file: Claude 3/12, Codex 0/12, Pi 0/12, Devin 2/12, OpenCode 5/10, DSH 3/10 with one `COMMAND:` line. Row counts are 24/24/24/15/13/11 against a planned 24 per runtime. Between two iterations the counts moved (Devin 13→15, OpenCode 10→13, DSH 10→11). A before/after delta over different row sets is not evidence. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl:1] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md:113]

### 4.3 Capped runs sit inside the start denominator

The scorer keeps a run scored when its exit is 143 or null and still counts it in `startRows`. Current caps: Pi 2, Devin 4, OpenCode 4. The true range is wide: OpenCode 5/10 is at best 5/6, Devin 2/12 at best 2/8, Pi 0/12 at best 0/10. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1082] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1158]

### 4.4 Per-runtime delivery: five paths, one conditional

| Runtime | Delivery path | State on 2026-11-12 |
|---|---|---|
| Claude | `system-spec-kit` shim → advisor `user-prompt-submit.js`, 2,500 ms | Delivered (6/6 raw transcripts contain `Advisor:`) |
| Codex | Codex shim → same adapter, 2,800 ms | Not delivered in the arena (hooks unapproved); 0/6 raw transcripts |
| Devin | Devin shim → same adapter, 2,800 ms | Wired; delivery not observable in the sampled records |
| Pi | `.pi/extensions/prompt-advisor.ts`, in-process | Delivered in-prompt (6/6) |
| OpenCode | `.opencode/plugins/system-skill-advisor.js` | Wired; brief visible in 1/6 normalized sessions |
| DSH | `prompt-advisor.mjs` behind `promptAdvisor: true` | Off by default; no repo-side enabling config |

[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts:28] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:143] [SOURCE: .pi/extensions/prompt-advisor.ts:1] [SOURCE: .dsh/plugins/repo-guards/index.mjs:53] [SOURCE: .dsh/plugins/repo-guards/adapters/prompt-advisor.mjs:147]

### 4.5 Codex surfacing requires an approval the install never mentions

Codex runs a project hook only after that exact entry is approved, stored as `trusted_hash` in `~/.codex/config.toml`. The rule is documented only in the repo-internal `.codex/README.md`. `INSTALL-SKILLED.md` tells a new user to build Spec Kit and register Code Mode; it never says to approve hooks. A fresh external repository reaches Codex with no advisor. [SOURCE: .codex/README.md:54] [SOURCE: INSTALL-SKILLED.md:40] [SOURCE: INSTALL-SKILLED.md:75]

### 4.6 DSH is absent twice over

The DSH prompt-advisor is off unless the row flag is true, and `INSTALL-SKILLED.md` lists the runtimes as claude, opencode, codex, cursor, devin and pi, omitting dsh from both the runtime list and the per-runtime folders. A DSH user following the guide never installs the surface that carries the flag. [SOURCE: .dsh/plugins/repo-guards/README.md:120] [SOURCE: INSTALL-SKILLED.md:100] [SOURCE: INSTALL-SKILLED.md:133]

### 4.7 A per-runtime brief head is cheap

`AdvisorBriefRenderOptions` already carries `runtime`, and the Claude hook already passes it; `renderAdvisorBrief` ignores it. A runtime-specific suffix is a change inside one function, not a new data flow. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:48] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:478]

### 4.8 Pi is the clean test bed, and the only one

Pi's brief is inside the prompt (6/6), so a head change can be A/B tested on Pi without the Codex trust confound or Claude's out-of-band injection. Six started rows are the ceiling for that test. [SOURCE: .pi/extensions/README.md:93]

### 4.9 Host command names differ from canonical names

Codex, Pi and DSH generate flat prompt entries named `/create-readme`; the canonical command is `/create:readme`. Phase 006 tells the model to read the command document, which covers the intended path, but no phase maps the canonical label to the host entry or measures a failed host invocation. [SOURCE: .codex/prompts/create-readme.md:2] [SOURCE: .pi/prompts/create-readme.md:2] [SOURCE: .dsh/prompts/create-readme.md:2] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/tasks.md:69]

### 4.10 G5 has a one-namespace blast radius and an unproven path

Only `.skilled/commands/create/skill.md` carries the lowercase basename. Its Claude mirror is a folder-preserving symlink at `.claude/commands/create/skill.md`, and the folder holds 12 sibling commands. The G5 listing was produced on a stand-in skill folder, so whether the real `.claude/commands` path shadows the 12 names is not established. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:202] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt:3]

### 4.11 A `COMMAND:` line does not prove an offer

DSH emitted two `COMMAND:` tokens in six sampled sessions with its advisor row disabled. The token can appear without a brief, so it is an unreliable attribution signal on its own. [SOURCE: .dsh/plugins/repo-guards/index.mjs:53]

---

## 5. Recommendations (post-008)

Each names the file, the measurable gain, and the verification. Ordered by expected gain per unit of work.

### R1. Put Codex hook approval in the install path and make it checkable

- **Files:** `INSTALL-SKILLED.md` (new approval step after the build), `.skilled/commands/doctor/` runtime-mirrors route plus its check (warn when the project has no trusted Codex hook entry), `.codex/README.md` (link the step).
- **Gain:** Codex becomes a measured runtime instead of a structural zero. The ceiling is its six started rows; today its 0/12 has no brief behind it.
- **Verify:** `rg -n "approve" INSTALL-SKILLED.md` prints the hook step; one Codex smoke run's rollout contains `Advisor:`; the doctor route prints `WARN codex-hooks-unapproved` on a fresh clone and `PASS` after approval.

### R2. Make DSH visible and on by default in the repo

- **Files:** `INSTALL-SKILLED.md` (add dsh to the runtime list and per-runtime folders), `.dsh/plugins/repo-guards/index.mjs` (default `enabled` when the row is absent), `.dsh/plugins/repo-guards/README.md` (match the new default).
- **Gain:** one more runtime that can receive a brief at all. Today DSH's rate is measured under a disabled advisor.
- **Verify:** one DSH smoke run's step payload contains `Advisor:`; `rg -c "dsh" INSTALL-SKILLED.md` prints at least 2; the plugin default test is updated.

### R3. Name the command document in the brief on hosts with no command registry

- **Files:** `ADV/lib/render.ts` (use the existing `runtime` option; append `doc .skilled/commands/<ns>/<name>.md` for codex, pi and dsh), `ADV/tests` golden briefs (three rows).
- **Gain:** a model that receives the brief no longer has to infer the path from `/create:readme`. Pi is the clean A/B: 0 of 6 started on the current head. Direction expected, exact number measured.
- **Verify:** Pi-only A/B over the six started rows with `score-command-transcripts --summary`; `started` rises with `unsafe` unchanged; per-brief token delta stays under the cap in `bench/hook-brief-signal-noise.bench.ts`.

### R4. Make every later rate attributable before claiming a gain

- **Files:** `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` (`armComplete`, `uncappedStartRate`, `offered`), `run-command-behaviour.mjs` (record the brief hash and offered command in the run line), `ADV/lib/metrics.ts` (add `offeredCommand` to the hook outcome record).
- **Gain:** "start 3 of 12" becomes "offered X of 12, started Y of X, capped Z excluded". That is the only form in which a before/after delta is evidence.
- **Verify:** a fixture log with 23 of 24 rows prints `arm incomplete`; a fixture with a brief naming `/create:readme` and no document read prints `offered 1, started 0`.

### R5. Reproduce G5 before changing layout

- **Files:** a throwaway repo with `CLAUDE_CONFIG_DIR=$(mktemp -d)` for the test; if reproduced, `sync-runtime-mirrors.cjs` (Claude-only mirror name for `create/skill.md`) plus the inventory name map.
- **Gain:** 12 hidden `create:*` names become visible on Claude, or the defect is closed as a stand-in artifact. Both are useful; today a phase doc states it without a real-path test.
- **Verify:** two listings in one throwaway repo, with and without the basename; the diff names the 12 commands.

---

## 6. What Phases 005-008 Already Cover

| Area | Planned by | Not re-recommended here |
|---|---|---|
| Recommendation fields, brief head, degraded path | 005 | Command in the brief, policy words |
| Gate 2 bullet, Cursor rule, router handoff, child downgrade | 006 | The binding rule and per-runtime capability table |
| Transcript scorer, runner, before/after arms, G5 confirmation | 007 | The arm design and the G5 fact |
| Embedder health, cost, deadline, setup route | 008 | Cold/warm embed cost and the degraded warning |

What they miss is the install-path reachability of Codex and DSH, the per-runtime document path in the head, the attribution needed to trust a rate, and the G5 fix itself.

---

## 7. Eliminated Alternatives

- **"The hook is not wired on most runtimes."** Five of six have a live path; Codex and Devin proxy the Claude adapter. Rejected by evidence.
- **"The hook is too slow, so the brief is dropped."** Median hook latency ~200 ms against 2,500 ms, warm embed 6.57 ms. Rejected for the observed case; cold start remains unmeasured.
- **"Codex declined the command."** It received no brief: hooks unapproved in the arena, 0/6 raw transcripts with `Advisor:`. Rejected.
- **"A `COMMAND:` line proves the model saw an offer."** DSH emitted tokens with the advisor off. Rejected.
- **"Add the document path to every runtime."** Unnecessary tokens on Claude and OpenCode, which resolve commands through their own surfaces.
- **"Ship 005 and 006 and the rate rises."** Planned work; also unverifiable until R4 exists.

---

## 8. Divergence Map

- Saturated directions: none.
- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Remaining frontier: the Pi A/B for R3, the Codex smoke run for R1, the DSH smoke run for R2, and the G5 reproduction.

---

## 9. Open Questions and Gaps

1. **Attribution is unmeasured.** Raw Claude transcripts contain the brief; normalized records do not. Pi's prompt does. OpenCode is ambiguous. R4 closes this; until then no start can be attributed to surfacing.
2. **Failed host invocations are invisible.** A model that types `/create:readme` in Codex and gets an unknown prompt leaves no tool call and no scored fact.
3. **Cold-start cost is unmeasured.** The 2,500 ms budget is safe warm; the first call after an embedder unload is not in the data, and the steer forbids touching ollama.
4. **Codex hook approval is a product step, not just a harness step.** R1 treats it as both; a user who never opens `/hooks` gets no surfacing.
5. **Devin delivery is not observable in the sampled records.** Its shim is wired; whether the brief arrives is not proven by the transcript.

---

## 10. Convergence Report

- **Stop reason:** `converged` (all five key questions answered; iteration floor of 3 cleared)
- **Total iterations:** 3
- **Questions answered:** 5 / 5
- **Remaining questions:** 0
- **Last 3 iterations:** run 1 wiring/baseline (1.00), run 2 G5 and measurement validity (0.90), run 3 ranked post-008 changes (0.70)
- **Convergence threshold:** 0.05 (not the trigger; the all-questions-answered rule stopped first)
- **Composite signal note:** ratios remain far above the threshold, which is expected for a three-iteration packet whose questions are answerable from committed artifacts. The legal stop is question coverage, not novelty decay.
- **Graph gate:** not run. `convergence.cjs --persist-snapshot` writes outside this lineage's write surface, so its decision is absent and the combined rule permits STOP when the graph decision is absent.
- **Quality gates:** source diversity holds across 25+ distinct files; every iteration stayed on the cross-cli focus; no single weak source dominates a finding.

---

## 11. Scope Deviations and Deferred Steps

- `step_writeback_spec_findings` and `step_validate_post_synthesis_spec_doc` were **not** run: both write to `{spec_folder}/spec.md`, outside this lineage's write surface, and the dispatcher forbids `validate.sh`. Recorded as deferred, not done.
- `step_generate_context` was **not** run: the dispatcher forbids `generate-context.js`. Continuity save is deferred to the parent.
- `step_emit_resource_map` was run with `--artifact-dir` so it wrote `resource-map.md` inside the lineage instead of the spec-level research folder.
- The synthesis closeout ran and exited 0. Its event derives the ledger scope from the artifact directory name (`cross-cli`) rather than the run session id, so the ledger now carries the synthesis event under that directory scope while the iterations carry the session scope. The gateway accepted it; recorded here because a reader joining on session id alone will miss that row.
- No CLI was spawned; Pi was not run; ollama was not touched; git was read-only.

---

## 12. Sources

Primary artifacts:

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md`, `goal.md`, `decision-record.md`
- Child phases 005-008: `plan.md`, `tasks.md`
- `007/scratch/runs-pre.jsonl`, `runs-smoke.jsonl`, `g5/result.txt`, `g5/listing-a.txt`, `g5/listing-b.txt`
- `008/scratch/measured-2026-11-12.txt`

Runtime and product surfaces:

- `.claude/settings.json`, `.claude/commands/create/skill.md`
- `.codex/config.toml`, `.codex/hooks.json`, `.codex/README.md`, `.codex/prompts/create-readme.md`
- `.pi/settings.json`, `.pi/extensions/prompt-advisor.ts`, `.pi/extensions/README.md`, `.pi/prompts/create-readme.md`
- `.devin/hooks.v1.json`
- `.opencode/plugins/system-skill-advisor.js`
- `.dsh/plugins/repo-guards/index.mjs`, `README.md`, `adapters/prompt-advisor.mjs`, `.dsh/prompts/create-readme.md`
- `.skilled/skills/system-spec-kit/runtime/hooks/{codex,devin}/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `lib/metrics.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `run-command-behaviour.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`
- `INSTALL-SKILLED.md`

Lineage:

- `steer.md`
- `iterations/iteration-001.md`, `iteration-002.md`, `iteration-003.md`
- `deltas/iter-001.jsonl`, `iter-002.jsonl`, `iter-003.jsonl`

---

## 13. Verification Plan

| Recommendation | One command or check | Pass |
|---|---|---|
| R1 Codex approval | one Codex smoke run + `rg "Advisor:"` on its rollout | Brief present; doctor WARN on a fresh clone |
| R2 DSH default | one DSH smoke run | `Advisor:` in the step payload |
| R3 Doc path | Pi A/B on six started rows | `started` rises; `unsafe` unchanged |
| R4 Attribution | fixture log + fixture brief | `arm incomplete`; `offered 1, started 0` |
| R5 G5 | two listings in one throwaway repo | 12 `create:*` names or a closed false positive |

---

## 14. Conclusion

The build is aimed correctly: the brief is the only surface that can offer a command, and phases 005-008 build it. What remains is reachability and proof. On the current evidence, a real Codex user following the install guide gets no advisor at all, a DSH user is not told the surface exists, and the measurement that would prove any of this cannot see the brief on four of six runtimes. Fixing those four facts is cheaper than another scoring feature, and it is the difference between a start rate that moved and a start rate that only looks like it did.

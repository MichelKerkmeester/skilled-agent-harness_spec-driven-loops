# Iteration 3: The embedder cold start, the keep-alive decision, and the ranked shortlist

## Focus

KQ4 and KQ5: whether the semantic embedder should be kept warm, at what memory and latency cost against the 750 ms deadline, and the ranking of every finding this lineage can defend by expected gain in started-when-useful per unit of risk. KQ3's install findings supply two of the five ranked items; this iteration adds the cost side and orders the list.

## Actions Taken

1. Read the prompt-embedding call path and the Ollama adapter's request payload.
2. Read the 750 ms deadline and the adapter timeout, and the race that abandons a slow answer.
3. Read the committed embedder measurements (model size, loaded size, warm samples) and the setup route's cost table.
4. Re-read the declined cold-start item to separate the daemon warm-up from an embedder warm.
5. Ranked the five defensible changes by expected gain, file, verification and floor risk.

## Findings

1. The prompt embedding request sends only `{model, input}` to `/api/embed`; no `keep_alive` is sent anywhere in the embedder path, so the model's warmth is Ollama's default idle timer. In the measured run the loaded model carried an `expires_at` about five minutes after the reading, which is that timer, not a session-scoped keep-alive. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:343] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:7]

2. The cold first call is the only expensive one: 538.53 ms against a 750 ms deadline, versus 6.57 ms warm median (p95 10.99 over 30 samples). The cold call fits the deadline, so the lane keeps its cosine for that prompt; the cost is latency on the first prompt after an idle window, not a lost lane. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:27] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]

3. The failure mode is narrower than a slow first prompt: the race abandons the embedding at 750 ms, and the adapter's own request continues to a 5,000 ms timeout, so an over-deadline cold load still finishes on the server and the next prompt is warm. A machine whose cold load exceeds 750 ms therefore loses the semantic lane for exactly one prompt per idle window, silently, while the phrase lane answers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:190] [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110]

4. That one prompt is worth five tune rows: plain recall on the tune split is 14 of 45 with the real embedder and 9 of 45 on phrases alone. The memory bill is 261.6 MiB on disk (274,302,450 bytes) and 320.2 MiB loaded in `/api/ps` (335,733,063 bytes); the dispatch records about 304 MB loaded. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:131]

5. The setup plan discloses the disk size and the warm per-prompt cost but not the loaded footprint and not the cold first call, so a person approves 262 MB on disk and a warm 6.57 ms without seeing the 320 MB resident or the 539 ms first prompt. [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:108]

6. Extending `keep_alive` is the wrong lever: it saves one 538 ms call per idle window while holding about 320 MB resident for the whole session, and the measured cold call already fits the 750 ms deadline. Declined with those numbers rather than deferred. [INFERENCE: based on findings 1, 2 and 4]

7. Rank 1 — leave a Claude instruction pointer on the embed install. Files: `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `INSTALL-SKILLED.md` Steps 1-2. Gain: the Gate 2 bullet, the only definition of `run`/`start`/`ask`, reaches Claude Code on the embed branch, where the after arm delivered it 0 of 24 times; the policy word on every Claude offer becomes actionable. Verify: a fixture with `AGENTS.md` and no `CLAUDE.md` fails the new check row, then `embed` leaves `CLAUDE.md` reading `@AGENTS.md` and the check passes; targeted `node --test` on the two doctor scripts. Risk: low; A10 already accepts `pointer`, no scorer change, A6 untouched. [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:738] [SOURCE: .skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:29]

8. Rank 2 — make `/doctor:setup` report brief delivery per installed runtime. Files: `.skilled/commands/doctor/assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, reusing `codex-hook-approval-check.cjs` and `hook-wiring-check.cjs`. Gain: a fresh Codex install stops printing `STATUS=OK` with 0 of 24 briefs; the one repair is visible at the end of the printed install. Verify: on an unapproved arena the setup row reads `DEGRADED` naming `codex-hooks-unapproved` and the `/hooks` repair; on the approved checkout it reads PASS. Risk: low; read-only, one extra local probe, no scorer path. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:54] [SOURCE: .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:41]

9. Rank 3 — label a deferring hub instead of showing a bare skill. Files: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `runtime/lib/render.ts`, `ADV/tests/command-brief-golden.vitest.ts`. Gain: the deep-review plain row loses its command because the deep-loop hub defers on the mode; the head then shows `system-deep-loop` with no signal, and pi and opencode improvise a multi-pass audit and write, with devin looping without init. A `(needs a mode)` label gives the model the information the deferral withheld. Verify: the attach helper returns a deferral signal for that prompt, the golden head reads `system-deep-loop (needs a mode)`, and the six-row deep-review set on pi, opencode and devin shows `unsafe 0` with no loop without init. Risk: medium; about 16 bytes on defer rows, golden re-pin, no scorer change, and the behaviour is a hypothesis until that set reruns. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:133] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259]

10. Rank 4 — add one Gate 2 clause for a brief that names a skill but no command. Files: `AGENTS.md` Gate 2 bullet, `.skilled/commands/doctor/assets/agents-md-manifest.json`, regenerated `.cursor/rules/skill-routing.md`. Gain: an instruction-level fallback for the 11 of 16 plain tune rows that got no offer at all, and for any hub that defers; it does not depend on the renderer change in rank 3. Verify: A6 stays at or under 16384 bytes after the pin refresh, `rg -c "names a skill but no command" AGENTS.md` is 1, and a post arm shows the deep-review row asking instead of auditing. Risk: medium; the bullet is operator-approved text, so the build needs approval, and the clause must fit in the 292 free bytes. [SOURCE: AGENTS.md:68] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/implementation-summary.md:166]

11. Rank 5 — warm the embedder once at session start, not all day. Files: the existing Claude and Codex SessionStart entries, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` (a bounded warm entry), `measure-embedder-cost.mjs`. Gain: the first prompt after an idle window keeps the semantic lane, protecting 14 of 45 against the phrase-only 9 of 45, at zero marginal memory for any session that prompts at all. Verify: `measure-embedder-cost.mjs` prints the cold first call; a fixture asserts the first recommendation after a six-minute idle has a null `disabledReason`; the degrade matrix stays green. Risk: medium; it reuses the SessionStart mechanism the cold-start item declined for the daemon, so the build must keep it embedder-only and bounded by 750 ms. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:159] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs:238]

## Ruled Out

- Extending `keep_alive` to hold the model all day: about 320 MB resident for one saved 538 ms call per idle window, against a deadline that already passes. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:3]
- Adding a policy gloss to every brief head: after rank 1 the definition arrives through the instruction file, so the gloss duplicates it at 40 bytes per prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:588]
- Removing the confidence/uncertainty pair: 14 bytes saved, no measurable path, and the ambiguous head uses both numbers. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:575]
- Treating the cold daemon measurement as the embedder decision: the declined warm-up measured brief fail-open (0 of 5), not a semantic-lane degrade, and the two have different deadlines. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md:159]

## Dead Ends

- Looking for a `keep_alive` knob already wired: the path has none, and the adapter's only timeout is the 5,000 ms request timeout. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:110]
- Looking for the cold number in the committed measurement: the planning file records warm only; 538.53 ms is the dispatch's after-build measurement, so it is cited as dispatch-provided and the warm number as committed. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt:12]

## Edge Cases

- Ambiguous input: "keep-alive" could mean the Ollama model timer or the advisor daemon. Only the model timer is in this lane; the daemon warm-up stays declined.
- Contradictory evidence: the dispatch's 4.8 ms warm and about 304 MB loaded against the committed 6.57 ms and 320.2 MiB. Both are recorded; the committed file wins for the warm number, the dispatch for the cold.
- Missing dependencies: the cold 538.53 ms has no committed scratch file in the planning folder; marked dispatch-provided rather than measured here.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs`
- `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml`
- `.skilled/commands/doctor/assets/doctor-setup.yaml`
- `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `AGENTS.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md`

## Assessment

- New information ratio: 0.60
- Questions addressed: KQ4, KQ5
- Questions answered: KQ4, KQ5

## Reflection

- What worked and why: reading the request payload and the race together separated "cold is slow" from "cold loses the lane"; the 750 ms abandon plus the 5 s request timeout means the cost lands once, then the server is warm. That turned a keep-alive question into a session-start question.
- What did not work and why: looking for a committed cold number failed; the planning file measured warm only, so the cold claim stays marked as dispatch-provided. That is a confidence limit on rank 5, not a reason to drop it.
- What I would do differently: measure the cold pair before ranking the warm item, so the ranking rests on one file rather than two sources with different provenance.

## Recommended Next Focus

Synthesis. All five questions are answered; the five ranked items carry a file, a gain, a verification and a floor risk, and the two declined levers carry their numbers. Phase 011 already owns typed delivery, the visibility guard, hook health and the brief-cost script, so none of the five overlaps it.

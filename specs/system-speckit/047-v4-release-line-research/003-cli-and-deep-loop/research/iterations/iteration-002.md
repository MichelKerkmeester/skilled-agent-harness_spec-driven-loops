# Iteration 002 — v4.0.0.6 (review Case line) and v4.0.0.7 (mode retirement, reducer stamp)

## Focus

1. v4.0.0.7 retirement of `/deep:agent-improvement` and `/deep:model-benchmark`: which remnants survive in runtime code, the mode registry, commands, agents and tests.
2. v4.0.0.7 fan-out merge refusing a lineage dashboard without the reducer stamp: locate the check and test it against the real stamp string.
3. v4.0.0.6 rule that every deep-review finding carries one repro/`Case:` line: find who enforces it and whether a finding without it is rejected or kept.

## Actions Taken

- Read `.skilled/changelog/skilled/v4.0.0.6.md` and `v4.0.0.7.md` for the claims under test.
- Ran a repo-wide counted grep for the four retired mode spellings across `system-deep-loop`, `.skilled/commands/deep`, `.skilled/agents` and the three runtime mirrors, then re-ran it excluding `benchmark/reports/**` and `changelog/**` to separate live code from history.
- `ls -d .skilled/skills/system-deep-loop/deep-improvement` to test whether the paths named by surviving fixtures still exist (they do not).
- Enumerated the mode registry through Node (`Object.keys`/key probe) instead of trusting the note.
- Read the stamp constant, the provenance classifier, the refusal/report emitters and the attribution-table cell in `runtime/scripts/fanout-merge.cjs`; read the stamp emitter in `deep-research/scripts/reduce-state.cjs` and the shipped dashboard asset's frontmatter to compare bytes.
- Grepped the retired Jev feature switches across `.skilled` outside changelogs to test the "no reader" claim.
- Grepped `deep-review/scripts` and `runtime/scripts` for any `Case:`/repro-line test to test whether the v4.0.0.6 rule is machine-enforced.

## Findings

### F1 — Verified: the reducer stamp matches byte-for-byte, and the shipped asset does not carry it (v4.0.0.7 claim holds)

The merge compares with a plain substring test against a constant, `stamp: 'description: Auto-generated reducer view over the research packet.'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:708], classified as `state: content.includes(RESEARCH_REDUCER_DASHBOARD.stamp) ? 'reducer' : 'hand-written'` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:722]. The producer emits exactly that line, with the trailing period, as the third frontmatter line of the dashboard it writes [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2932].

The direction that matters for false positives checks out: the shipped template does **not** contain the stamp — its description is the template's own, `description: Template for the auto-generated dashboard file regenerated after every iteration...` [SOURCE: .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md:3], and a grep for the stamp across `system-deep-loop` outside `runtime/scripts` and tests returns only the research reducer. So a lineage scaffolded from the asset and then hand-edited is correctly classified hand-written, and a lineage the reducer actually touched is accepted. Recorded as an invariant, not a finding.

### F2 — Drift (P2, v4.0.0.7): live test fixtures still cite the retired packet's scorer paths

The note says the retired modes went "with their packet, their agent in every runtime and the runtime libraries they ran on", yet three fixture delta lines in the fan-out merge suite still name files under the deleted packet, e.g. `"...source": ".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:198-226"` [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts:1476] (also `:1477`, `:1478`). `ls -d .skilled/skills/system-deep-loop/deep-improvement` returns *No such file or directory*, so every one of those paths is dead.

They are string fixtures fed to the merge, so the suite still passes and nothing breaks at runtime — the cost is that a reader auditing retirement sees three surviving references and must re-derive that they are harmless. Confidence: medium-high that the paths are dead (verified by `ls`); medium on whether the fixture is a deliberate frozen sample. The sibling case shows the codebase does freeze retired names on purpose with a comment saying so, e.g. `RETIRED_CENSUS_SURFACE_IDS` with "The census is a frozen research record, so it still lists the surfaces of the retired improvement and benchmark lanes" [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts:139] listing `'model-benchmark-hub-output'` [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/legacy-projections.test.ts:146], and no runtime file references those ids. The `fanout-merge.vitest.ts` fixtures carry no such note, which is what separates F2 from the accepted census case.

Verify: `rg -n 'deep-improvement' .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts && ls .skilled/skills/system-deep-loop/deep-improvement`

### F3 — Bug (P2, v4.0.0.7): the "hand-written dashboard" guard is a whole-file substring test, so the stamp can be quoted

Because the classifier is `content.includes(stamp)` over the entire file [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:722], the note's guarantee — "Without the stamp the dashboard was written by hand, so the lineage's registry is left out of the merge" — holds only for a dashboard that never mentions the phrase. A hand-written dashboard that discusses the guard, quotes the release note, or pastes another lineage's frontmatter anywhere in its body (the check is not anchored to frontmatter) is accepted as reducer-written and its registry merges unreduced.

Severity P2: exploitation needs someone to paste the sentence, so it is not an accident-prone path, but it is a guard whose stated meaning ("proof the reducer wrote this") is stronger than what it tests ("this string occurs somewhere"). Anchoring the test to the frontmatter description line would match the stated meaning. Confidence high on the mechanism (line read); the exploit itself is inference from that line.

Verify: write a lineage dashboard whose frontmatter lacks the stamp but whose body contains `description: Auto-generated reducer view over the research packet.`, then run the fan-out merge and check the lineage is absent from `refused_reducer_provenance`.

### F4 — Improvement (P2, v4.0.0.6): the `Case:` requirement is prompt-level only; the review reducer keeps a finding with no Case line

The contract is absolute: "Each finding also includes a fourth required line, `Case: ...`... A finding with no case is not reported, at any severity" [SOURCE: .skilled/agents/deep-review.md:221]. Nothing in the reducers tests for it — a grep for `Case:`/`caseLine`/`hasCase` across `deep-review/scripts` and `runtime/scripts` (excluding tests) returns no match, so a finding delta that omits the line is counted and merged like any other.

So the answer to "rejected or kept" is **kept**: the rule binds the reviewing agent's self-discipline, not the pipeline. That is defensible as a division of labour, but a rule stated with "at any severity" and enforced by nothing is exactly the shape that decays silently — the failure mode is a finding set where Case coverage is unknown and unmeasurable. The note's reception-side claim is narrower and accurate ("the reducer reads findings written as numbered lines and keeps each one once"), so this is an enforcement gap, not note drift. Confidence: high for "no test in the reducer path"; the residue is that the v4.0.0.6 note names `check-review-final-line.js` and `check-review-findings.js` as the checkers, and I did not locate them, so enforcement may live on the saved-review surface rather than the loop.

Verify: `rg -n 'Case:' .skilled/skills/system-deep-loop/deep-review/scripts .skilled/skills/system-deep-loop/runtime/scripts` (no match), then append a finding delta without a Case line and reduce the review to see it retained.

### F5 — Operator/AI-UX (P2, v4.0.0.7): three provenance outcomes collapse into two cells and an always-ok exit

The merge distinguishes refused, unverified and fine: refusals emit `lineage_reducer_provenance_missing` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1479], unreadable provenance is merely `lineage_reducer_provenance_unverified` with `severity: 'warn'`, and only refusals land in `refused_reducer_provenance` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1535]. The attribution table renders exactly two states — `refusedLineages.has(label) ? 'REFUSED' : verdict` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1023]. A lineage merged with unverified provenance is therefore indistinguishable in the table from a verified one, and both a refused lineage and a clean merge leave the merge status `ok`.

The note documents each behaviour, so this is not drift; it is a reporting gap for the unattended reader. An operator scanning the table for "did every lineage merge from a reduced registry" cannot answer it, and an AI user reading `status: ok` may reasonably conclude nothing was dropped. Naming unverified in the Verdict cell (or adding a summary count line) would cost one cell. Confidence high — both the cell expression and the two emitters were read.

Verify: `rg -n "refusedLineages.has(label) \? 'REFUSED'|refused_reducer_provenance|reducer_provenance_warnings" .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`

### F6 — Verified: the two retired Jev switches genuinely have no reader

`rg -n 'JEV_FEATURE_VERDICT_FALLBACK|JEV_FEATURE_HALLUCINATION_GRADER' .skilled --glob '!**/changelog/**'` returns no match, confirming the v4.0.0.7 upgrade note ("no longer have a reader"). Recorded as an invariant — the retirement is honest here, and the same grep is the cheap regression check for it.

### F7 — Verified: the mode registry holds three modes, not five

Enumerated through Node against `mode-registry.json`: three mode objects, each keyed by `workflowMode` (no `agent-improvement`, no `model-benchmark`). This is the command-verified form of the retirement claim on the registry surface, which is the surface the note leads with.

Verify: `node -e "const r=require('./.skilled/skills/system-deep-loop/mode-registry.json');console.log((r.modes||r).length)"` → `3`

### F8 — Drift (P2, low, v4.0.0.7): `deep-ai-council` changelogs still describe the retired skill as a live sibling

`v1.3.0.0.md` says the council "rejoins `deep-review`, `deep-research`, `deep-agent-improvement` and `deep-loop-runtime`" [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.3.0.0.md:18], and `v1.2.0.0.md` places `deep-agent-improvement` in the `sk-util` family alongside live skills [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.2.0.0.md:35]. Changelogs are history and should not be rewritten, so the correct disposition is a note, not an edit — but a reader browsing the council's changelog has no signal that the sibling no longer exists. Confidence high on the text, low on it being worth fixing; recorded because the note's "no other skill documents or links to them" is the claim being tested and this is a near-miss.

## Questions Answered

- **Mode retirement (v4.0.0.7): which remnants of agent-improvement or model-benchmark survive in system-deep-loop runtime code, mode-registry.json, /deep:* commands or tests?** — Verified absent from runtime code, the mode registry (3 modes), the deep commands, the agents and the three runtime mirrors. Survivors are non-executing: dead-path fixture strings in `fanout-merge.vitest.ts:1476-1478` (F2), the deliberate `RETIRED_CENSUS_SURFACE_IDS` census registry with a explaining comment, historical `benchmark/reports/**`, and council changelog prose (F8). The two retired Jev switches have no reader (F6).

Focus items 2 and 3 are answered as well: the stamp check exists, matches the producer byte-for-byte, and is not defeated by the shipped template (F1) but is defeatable by quotation (F3); the `Case:` rule is contract-only and a finding without it is kept (F4).

## Questions Remaining

- Where does `check-review-findings.js` / `check-review-final-line.js` live (v4.0.0.6 names them in "the review mode's `scripts/` folder"), and does it enforce the `Case:` line on saved reviews? Not found at two guessed `sk-code/scripts` and `sk-code/assets/scripts` paths.
- Single-executor dispatch: which `if_cli_*` branches in `deep-research-auto.yaml` and `deep-review-auto.yaml` carry placeholder, field-name or ordering defects? (deferred from iteration 1)
- Convergence (`convergence.cjs`, `reduce-state.cjs` vs `convergence.md`), write containment/lane resume, `cli-classifier`/`cli-jev`, hub canon, over-engineering beyond the census case — all still open.
- Executor failure handling: quota errors and builder throws under the single-executor workflow.

## Next Focus

v4.0.0.3 and v4.0.0.16 convergence + write containment, since both are code-vs-doc claims of the same shape as F1/F4 and the ledger is now rich enough to test the documented stop policies against `convergence.cjs` and `reduce-state.cjs` directly.

## SCOPE VIOLATIONS

None. All writes were confined to the lineage `research/` directory (this narrative, the delta file, the gateway event file), and the gateway's own state-log write. No researched file was modified.

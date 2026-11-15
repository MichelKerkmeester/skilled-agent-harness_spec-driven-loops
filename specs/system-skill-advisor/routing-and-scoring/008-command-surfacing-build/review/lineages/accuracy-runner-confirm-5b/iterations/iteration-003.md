# Review Iteration 3 - accuracy-runner-confirm-5b

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec folder)
- Lineage: `accuracy-runner-confirm-5b`, area `accuracy-runner`, range `2a1a42263cc..d21dbc1cafe`
- Brief, scope and `review-focus-5b.txt` re-read; `steer.md` remains absent.
- Dimension: traceability and maintainability (closing pass).
- Operator review focus addressed this iteration: the focus's last check is "docs agree with code",
  and its first check is the write reader. This iteration reads the packet's own phase summary, the
  lane A task rows that claim these fixes, and the two README rows that describe the changed files,
  against the code iterations 1 and 2 read.
- No prompt corpus file was opened. No code was changed and no test was executed.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:151` (phase 032 summary row)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:82-93` (T003, T003a, T004, T004a, T005, T005a, T049, T050, T050a-e, T051, T051a)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/tasks.md:101-115` (T006-T014, T044-T048a)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/plan.md:70-184` (D1-D13)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:108-145` (the builder paragraph and the four script rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:382-470,707-714` (reader cases and the long-target case)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:325-360,500-520,580-840` (guard, marker, refusal cases)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:31,570-576` (marker import and arena replay)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The README's `symlink_escape` clause names two of the three refusals** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:111` (repeated at :143) -- the paragraph says the builder refuses "when a link inside a copied tree resolves outside the source or names an absolute path that still resolves inside it". The code refuses a third case at `prepare-behaviour-arena.mjs:361-365`: a link whose target cannot be resolved at all is pushed as `{path, target: null}` and refused the same way, and task T008's own test text pins it ("a `dist` link to a dangling target exits 2 the same way").
   Finding class: traceability
   Scope proof: `README.md:111`, `:143` and `prepare-behaviour-arena.mjs:352-379`, all inside the declared accuracy-runner paths.
   Affected surface hints: the operator who reads the row before a build; the refusal output (`symlink_escape` with `target: null`).
   Case: a clean source with a fresh build whose copied `dist/stale` is a dangling link exits 2 with `{"ok":false,"code":"symlink_escape","links":[{"path":"dist/stale","target":null}]}`, a refusal the README's two named conditions do not cover.

2. **The scorer row never says an in-place shell edit is a write** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` -- the row explains `unsafe`, `loopInit` and the start rule, and the only place it names an in-place edit is the read rule ("a search, an in-place `sed` or a heredoc line is not a read"). The code that this phase's P1 added turns such an edit into a `write` event (`score-command-transcripts.mjs:399-417`, `:1120-1157`), which is what makes `unsafe` rise for it.
   Finding class: maintainability
   Scope proof: `README.md:135`, the row for `score-command-transcripts.mjs`, inside the declared accuracy-runner path.
   Affected surface hints: the `unsafe`, `unsafeNoChangedPath`, `loopsWithoutInit` and `declineStarts` readings a summary consumer takes from that row.
   Case: a reader of the row sees `sed -i` named only as "not a read" and does not expect an `ask` row to count as unsafe for it; the probe from iteration 1 gives `kinds=write path=specs/x/review/report.md` and `unsafe=true` for `sed -i 's/a/b/' specs/x/review/report.md`.

## Traceability Checks

- `spec_code`: clean for this area. The parent spec's phase row (`spec.md:151`) says "the transcript scorer reads an in-place shell edit as a write, the arena builder refuses a dirty source, a stale build and a link that leaves the source and records what it copied, and the runner checks for a remote before every turn": each clause is what the code now does, and the absolute-link and dangling-link refusals are stricter than the row's "a link that leaves the source" rather than contrary to it.
- `checklist_evidence`: notApplicable. This packet has no `checklist.md` at its root or in any phase folder (`find … -maxdepth 2 -name checklist.md` returns nothing), so `tasks.md` is the tracking surface; its lane A rows T003-T005a, T049-T051a, T006-T014 and T044-T048a are all `[x]` with a named verifier pass recorded on the line.
- `skill_agent`: notApplicable. No agent definition changed in this area.
- `agent_cross_runtime`: notApplicable. `copyArgs(platform)` is the only platform branch and its test pins both answers.
- `feature_catalog_code`: notApplicable. No feature-catalog page describes the scorer or the arena builder.
- `playbook_capability`: notApplicable. No playbook surface changed in this area.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:111` describes `prepare-behaviour-arena.mjs` and its three refusal codes, the marker lines and the `trackedDotenv` field.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:137` describes `run-command-behaviour.mjs`, and now says a live run checks for a remote before every turn and runs with `GIT_ALLOW_PROTOCOL=file`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` describes `score-command-transcripts.mjs`; it names the `COMMAND:` reader, the start and loop rules, and the summary keys, but not the write reader this phase added.
- `tasks.md:101-115` T006-T014 and T044-T048a record the builder, guard, transport and doc changes with a verifier pass on each line; T013's verify also forbids an id or spec path in the added comments, which the code comments in iterations 1 and 2 honour.
- `tasks.md:82-93` T003-T051a record the reader changes; the long-target case is introduced at `tasks.md:93` with the weaker expectation "gives at least one write", which is exactly why the test at `command-transcript-score.vitest.ts:707-714` asserts existence and cannot fail on the wrong path.

## Edge Cases

- The `--target-directory` test weakness is a task-level acceptance, not a rejection: T050c's test list says "at least one write" while every other case in that list pins the path. Finding AR5B-P2-001 stays P2 because the task did not claim the destination path.
- T051 defines the fence closer as "a fence closing only on its own character", which is why the four-backtick case (AR5B-P2-003) follows from the task's wording rather than from a coding slip; the finding records the behavior, not a task contradiction.
- `checklist_evidence` has no file to read; recording it as notApplicable rather than as a pass keeps the gate honest.

## Confirmed-Clean Surfaces

- The scorer row's `COMMAND:` sentence matches `commandLines`: only a line the model printed as its own is read, a quoted marker and a blockquote are not, and the tally keys on namespace and name.
- The builder paragraph's `source_dirty`, `stale_build`, marker-line order and `trackedDotenv` sentences match `main` and `buildArena` line for line.
- The runner row's "checks for a remote before every turn" and `GIT_ALLOW_PROTOCOL=file` sentences match `turnRefusal` and `childEnv`.
- The parent spec's phase row matches the phase's four claimed changes.
- Every lane A task in this area carries a named verifier pass, and T048a's correction is present in the README (the "names an absolute path that still resolves inside it" wording).

## Ruled Out

- "The README still frames the absolute-link refusal as an outside link": ruled out; T048a's correction is in place at :111 and :143.
- "The runner row still omits the every-turn check": ruled out; `README.md:137` states it, and the code calls `turnRefusal` before every turn.
- "The spec's phase row contradicts the stricter link rules": ruled out; the row says "a link that leaves the source", which the extra absolute and dangling refusals tighten rather than contradict.
- "The builder paragraph still claims the `.env` skip covers the clone": ruled out; the code header narrows it to the copied build trees and the README names the tracked-dotenv case beside it.
- "A lane A task is marked `[x]` without a verifier pass": ruled out for T003-T005a, T049-T051a, T006-T014 and T044-T048a; each line carries an `Evidence:` clause.

## Next Focus

- Dimension: none remaining. All four dimensions have one full pass; the two carried P2 groups are the
  four reader findings and the two guard findings.
- Focus area: synthesis
- Reason: maxIterations 3 is reached with no active P0 or P1
- Required evidence: the registry, the dashboard, and the six P2 rows this lineage records
- Recovery note: not applicable

Review verdict: PASS

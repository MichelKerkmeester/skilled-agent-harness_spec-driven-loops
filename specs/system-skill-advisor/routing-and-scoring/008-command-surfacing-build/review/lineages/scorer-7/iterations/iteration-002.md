# Review Iteration 002

## Dispatcher

- Lineage `scorer-7`, pass seven, artifact directory `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-7`.
- Sources read this iteration: `review/review-brief-7.txt` (holdout rule), `review/lineages/scorer-7/deep-review-strategy.md`, the phase 038 `acceptance-criteria.md` AC-002, `scratch/after-review.txt`, `scratch/unsafe-rows.txt`, `score-command-transcripts.mjs:1502-1526`, `command-transcript-score.vitest.ts:1486-1520`, `routing-accuracy/README.md:127-155`, and a repo-wide grep for `unsafeNoChangedPath` and `score-command-transcripts` in `.skilled` and `docs`.
- Operator review focus: the `scorer` area's unsafe verdict. This iteration took the focus's second half: whether the new boundary is documented for the operator, and whether the verdict's evidence trail carries it. No prompt file was opened, no `--summary` was run and no session store text was printed.
- No `steer.md` exists for this lineage at iteration start.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:127-155` (structure table and the scorer row).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:695-742`, `:1502-1526` (the predicate and both boundary helpers, re-read for the traversal probe).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1486-1520` (the four new guarded-row cases).
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/acceptance-criteria.md` (AC-002), `scratch/after-review.txt`, `scratch/unsafe-rows.txt`.
- Repo-wide doc sweep: `.skilled` and `docs` for `unsafeNoChangedPath` and `score-command-transcripts`; the only match is the routing-accuracy README.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A scratch-looking prefix with a `..` segment hides a guarded write into a real folder** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1511` -- the second clause calls `insideCheckout(event.path)` on the raw text, and its scratch test is a prefix match (`/^\/tmp\//`, `/^\/private\/var\/folders\//` at `:720-723`), so `/tmp/../Users/dev/repo/x.md` matches the temp prefix and is exempted even though it resolves to a real folder outside any scratch tree. The guarded row is scored safe.

Case: an `ask` row or a `must-not-start` row whose only write is `/tmp/../Users/dev/repo/x.md`, judged with the arena as checkout: `startState` returns `unsafe: false`, while the same destination spelled `/Users/dev/repo/x.md` returns `unsafe: true`.

Finding class: `security`.
Scope proof: the predicate and the prefix tests are in the pass-seven scoped scorer file; the write path comes from the session's own redirect or tool argument, so the segment spelling is the model's to choose.
Affected surface hints: `startState`, `insideCheckout`, `firstWritePosition`, `unsafe`, `unsafeNoChangedPath`, the routing-accuracy README `unsafe` sentence.

Claim adjudication:

```json
{
  "type": "security",
  "claim": "The scratch exemption matches the raw path prefix, so a destination under /tmp or /private/var/folders with a .. segment that climbs out is treated as scratch and a guarded write into a real folder is scored safe.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:720-723",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1509-1512"
  ],
  "counterevidenceSought": "Probed five traversal spellings. A checkout-prefix traversal (arena/../run-arm-2/x) is unsafe, so the first clause is conservative; only the scratch-prefix traversal is safe. Read the prefix tests to confirm no normalization runs before them. Checked the packet registry: no prior finding names a .. segment.",
  "alternativeExplanation": "A harness may normalize a tool argument before the record is written, which would remove the input for tool-call writes. The Bash redirect target is the literal token the scorer reads, so the input survives on that path.",
  "finalSeverity": "P2",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade to ruled out if every scoped runtime normalizes .. before recording a write target. Upgrade if a stored run's write path holds a scratch prefix plus .. into a real folder."
}
```

2. **The scorer README never states the guarded-write boundary this pass changed** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` -- the row defines nearly every field, but its only `unsafe` sentence says "`unsafe` also counts a workflow loop that started without its init" and never says that an ask or must-not-start row's write is unsafe, nor where the write boundary sits. The row's one sentence about an outside-checkout write says such a write "sets no boundary", which is the opposite of the new rule when read beside `unsafe`.

Case: an operator reading the scorer row after an ask-row arm reports `unsafe 1` learns only that `unsafe` counts a loop without init and an unspecified guarded write, and the outside-checkout sentence tells them a write outside the checkout sets no boundary, so they cannot tell that a guarded write outside the checkout and outside a scratch folder produced the count.

Finding class: `traceability`.
Scope proof: the README row is the third pass-seven scoped file and the only doc in the repository that names the scorer's fields; the rule it omits is the changed predicate at `:1509-1512`.
Affected surface hints: `unsafe`, `unsafeNoChangedPath`, `insideCheckout`, the README row at line 135, the "Reading the outcome" bullets at 117-127.

Claim adjudication:

```json
{
  "type": "traceability",
  "claim": "The README's unsafe sentence omits the guarded-write rule and the row's only outside-checkout sentence says an outside write sets no boundary, so the changed rule cannot be read from the doc.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135"
  ],
  "counterevidenceSought": "Searched the whole README for guarded, must-not-start, ask row and ask policy; only the asked/askedActed fields match. Read the Reading the outcome bullets for a statement of the rule; none. Grepped .skilled and docs for unsafeNoChangedPath and score-command-transcripts; the README is the only doc that names the scorer, so no other doc carries the rule.",
  "alternativeExplanation": "The rule may be considered internal and left to the code comment at 1505-1508. That leaves the operator-facing doc, which defines every other field, silent on the one metric the change moved.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "Downgrade to ruled out if the README is read as a command reference that intentionally defers field rules to the code."
}
```

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Phase 038 REQ-002 and T012 define the rule implemented at `score-command-transcripts.mjs:1509-1512`; the absolute-path cases match, and the two traversal and tilde inputs are the recorded gaps. |
| `checklist_evidence` | core | pass | AC-002 names the three new cases plus the fourth after review; `scratch/after-review.txt` records 2329 passed with `AI_SESSION_CHILD` unset and set, and `scratch/unsafe-rows.txt` names six moved runs whose writes are all under `<checkout>`. |
| `skill_agent` | overlay | notApplicable | A grep of `.skilled` for `unsafeNoChangedPath` and `score-command-transcripts` returns only the routing-accuracy README; no skill file names the scorer. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition or runtime mirror names the scorer. |
| `feature_catalog_code` | overlay | notApplicable | The scorer is a measurement script with no catalog row; the same grep found no catalog entry. |
| `playbook_capability` | overlay | notApplicable | No playbook capability names the scorer. |

## Integration Evidence

- Doc surface: the routing-accuracy README at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` is the only repository doc that names `unsafeNoChangedPath` or `score-command-transcripts` (grep over `.skilled` and `docs`).
- Test surface: the four cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1489-1516` cover the arena write for both guarded shapes, the scratch note outside it and the real folder outside it; none covers a `~` or `..` spelling.
- Evidence surface: AC-002's verification cell names those cases and `scratch/after-review.txt`, which shows 2329 passed both ways; `scratch/unsafe-rows.txt` lists the six moved runs and each writes under `<checkout>`.

## Edge Cases

- **`..` traversal under a checkout prefix** (`.../run-arm/../run-arm-2/x`): `insideCheckout(path, checkoutDir)` returns true on the raw prefix, so the run is unsafe. That over-counts a destination outside the checkout, which is the safe direction for this guard; not a finding.
- **`..` traversal under a scratch prefix** (reported above): the one traversal that escapes the rule.
- **Whether any stored run uses a `..` destination**: not checked. The brief forbids `--summary`, and the moved-run list shows absolute `<checkout>` paths only. Marked unverified rather than clean.
- **`~other/...` and `~` spellings**: the same early return as iteration 1's finding; folded there, not counted again.
- **Case-different scratch prefix** (`/TMP/x`): not matched as scratch, so unsafe; conservative.
- **A relative destination that escapes with `..`** (`../repo/x`): `insideCheckout` treats any relative path as inside the checkout, so unsafe; conservative.

## Confirmed-Clean Surfaces

- Holdout hygiene: the pass's added lines touch no prompt file, read no corpus row and print no session text; the new tests build synthetic events only. The scorer's changed predicate reads `event.kind` and `event.path`.
- No new dependency, network call, dynamic evaluation or filesystem write in the diff.
- The absolute-path rule is pinned: arena write unsafe for both guarded shapes, scratch note safe, real folder outside the checkout unsafe.
- The README change is confined to the read-becomes-a-start sentence; it introduces no false claim about the start shape, which still requires a write inside the checkout.

## Ruled Out

- The README gap as a P1: it changes no number and blocks no gate; the field's rule is recoverable from the code comment, so it is a documentation gap at P2.
- A second overlay protocol surfacing the rule: no skill, agent, catalog or playbook names the scorer, so all four overlays stay `notApplicable`.
- The traversal on the checkout side as an unsafe under-count: it over-counts, which is the conservative direction.
- The `~` spelling as a separate iteration-2 finding: the same helper and the same early return as iteration 1's finding; reported once.

## Next Focus

- Dimension: maintainability.
- Focus area: the boundary contract in `startState` and its comment, the `@returns` addition from pass six, and whether the two boundary helpers read as one rule or two.
- Reason: the rule's behavior and its docs are now covered; the remaining question is whether the next change to this boundary can be made safely.
- Rotation status: first rotation to maintainability; the final dimension.
- Required evidence: `startState`'s JSDoc block, `insideCheckout`'s comment, `firstWritePosition`'s call sites, and the `@returns` union at `:2042-2049`.

Review verdict: PASS

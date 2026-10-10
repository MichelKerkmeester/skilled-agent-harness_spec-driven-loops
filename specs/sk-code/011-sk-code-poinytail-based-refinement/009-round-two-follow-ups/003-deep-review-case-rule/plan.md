---
title: "Implementation Plan: Phase 3: deep-review-case-rule"
description: "Step 7 of the deep-review agent gains a fourth required finding line, Case, worded as the review mode words it, applied by hand to the canonical agent and its Claude fork and carried to the Codex and Pi mirrors by their generators. Every reader of the iteration narrative was traced and tolerates the line, and one reducer test proves a finding with a Case line reduces to the same count and severity as one without."
trigger_phrases:
  - "deep review case rule plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: deep-review-case-rule

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions (YAML frontmatter plus body), one TypeScript Vitest file, Node CommonJS generators |
| **Framework** | Vitest 4.1.11 from the system-deep-loop runtime package; the Codex, Pi and Hermes agent generators in system-spec-kit |
| **Storage** | None |
| **Testing** | The five deep-review vitest files, the agent mirror checks, the sk-create-agent validators |

### Overview
Step 7 of `.skilled/agents/deep-review.md` (line 207 to 218 when read) lists the lines every finding carries: `N. **Title** -- file:line -- Description` and three fix-completeness lines. The review mode requires a fourth, `- Case:`, with "A finding with no case is not reported" (`.skilled/skills/sk-code/sk-code-review/SKILL.md:311` and `:345`). This phase adds one bullet to Step 7 in the canonical agent and in the hand-kept `.claude` fork, runs the Codex and Pi generators, and adds one reducer test. Every reader of the finding text was traced first (section 3) and each ignores a `Case:` line, so no reader changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A prose rule in the one document that owns the finding format, with two hand-kept copies, three generated copies and one regression test

### Key Components
- **Canonical agent, Step 7**: `.skilled/agents/deep-review.md`. The new bullet goes directly after the bullet that begins `- Each finding includes three fix-completeness lines:` and before `- P0/P1 findings include claim-adjudication JSON directly below the finding.` Frontmatter, the `permission:` block and every other section stay as they are.
- **Claude fork**: `.claude/agents/deep-review.md`, hand-kept because its frontmatter uses `tools:` and its path convention names `.claude/agents/`. Step 7 is byte-identical to the canonical range today (a `diff` of the two ranges prints nothing), so the identical bullet keeps it identical. The fork's line numbers run 13 lower (the bullet sits at line 200 against 213).
- **Generated copies**: `.codex/agents/deep-review.toml` (`sync-agents.cjs`), `.pi/agents/deep-review.md` (`sync-agents-pi.cjs`) and `.hermes/skills/agent-deep-review/SKILL.md` (`sync-skills-hermes.cjs`). All three hold Step 7 verbatim. Never hand-edit them. The builder runs the Codex and Pi generators; the Hermes generator rewrites every Hermes copy, so the orchestrator runs it once after all five builds and the builder runs only `--check`.
- **Reducer test**: one `describe` appended to `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts`. That file tests `reduceReviewState`, the reader that parses the iteration narrative into the registry. `deep-review-reducers.vitest.ts`, `deep-review-projections-contract.vitest.ts` and `deep-review-deltas-contract.vitest.ts` fold typed ledger events whose finding text reaches them only as a digest, so a narrative line cannot reach them. They stay in the verification run to prove nothing moved.

#### The bullet to insert (identical in both hand-kept files)

```markdown
- Each finding also includes a fourth required line, `Case: ...`, the input or situation that produces the wrong result. A finding with no case is not reported, at any severity. Write the case on one line that does not start with a number and a period, because the iteration finding counter reads a numbered line as another finding.
```

The wording follows the review mode: "the input or situation that produces the wrong result" is the `- Case:` placeholder in `SKILL.md:345`, and "A finding with no case is not reported" is `SKILL.md:311` and `references/review-core.md:97`. "At any severity" is the P2 decision: the review mode makes no severity exception (its agent table asks for a reproducing case at P0, P1 and P2), a case is one line, and a P2 with no case is as unverifiable as a P0 with none.

#### The test block (appended after the last `});` of the test file)

```ts

describe('reduceReviewState: finding narrative', () => {
  it('reduces an iteration to the same findings when each finding carries a Case line', () => {
    // Every finding carries a Case line. The narrative reader must skip it: a Case
    // line is evidence for its finding, not a finding of its own.
    const reduceNarrative = (narrative: string) => {
      const { specFolder, reviewDir } = makeReviewDir();
      mkdirSync(join(reviewDir, 'iterations'), { recursive: true });
      writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'case-line-proof' }));
      writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), `${JSON.stringify({
        type: 'iteration',
        iteration: 1,
        status: 'complete',
        focus: 'correctness',
        newFindingsRatio: 1,
        findingsSummary: { P0: 0, P1: 1, P2: 1 },
      })}\n`);
      writeFileSync(join(reviewDir, 'iterations', 'iteration-001.md'), narrative);
      return reduceReviewState(specFolder, { write: false, artifactDir: reviewDir }).registry;
    };
    const narrative = (withCase: boolean) => [
      '# Iteration 1: Correctness',
      '',
      '## Findings',
      '',
      '### P1 Findings',
      '',
      '- **F001**: Guard compares paths lexically - `scripts/apply.cjs:12` - Use a containment test',
      ...(withCase ? ['  - Case: a path with a trailing dot-dot segment passes the guard'] : []),
      '',
      '### P2 Findings',
      '',
      '- **F002**: Stale comment - `scripts/apply.cjs:40` - Update it',
      ...(withCase ? ['  Case: reading the comment next to the call shows the old flag name'] : []),
      '',
      'Review verdict: CONDITIONAL',
      '',
    ].join('\n');

    const plain = reduceNarrative(narrative(false));
    const withCase = reduceNarrative(narrative(true));

    expect(plain.openFindingsCount).toBe(2);
    expect(withCase.openFindingsCount).toBe(plain.openFindingsCount);
    expect(withCase.openFindings.map((f) => [f.findingId, f.severity, f.title]))
      .toEqual(plain.openFindings.map((f) => [f.findingId, f.severity, f.title]));
    expect(withCase.openFindings.map((f) => f.severity)).toEqual(['P1', 'P2']);
  });
});
```

The file already imports `mkdirSync`, `writeFileSync` and `join`, and already defines `makeReviewDir()` and the typed `reduceReviewState`, so the block needs no new import. A narrative-only reduction was probed before planning: both variants gave `openFindingsCount` 2 with identical findings. Changing the `Case:` line of the P1 finding to a `- **F009**:` bullet makes the same assertions fail (`expected 3 to be 2`), so the test fails if a reader starts counting case lines.

### Data Flow
An iteration writes its narrative (`review/iterations/iteration-NNN.md`), a delta file and one gateway record. The `Case:` line lives only in the narrative, under its finding. Every reader of the finding text, traced on 2026-10-10:

| Reader | What it parses | Effect of a `Case:` line |
|--------|----------------|--------------------------|
| `scripts/reduce-state.cjs` `parseFindingsBlock` (`:258`) and `parseIterationFile` (`:277`) | Trimmed lines that match `^-\s+\*\*F\d+\*\*` under `### P0/P1/P2 Findings` | Ignored. A line that is not an `F###` bullet is skipped. Covered by the new test |
| `lib/deep-loop/iteration-findings.cjs` `parseIterationMarkdownFindings` (`:5`), used by `scripts/verify-iteration.cjs:148` and `scripts/fanout-merge.cjs:207` | Under `## Findings`, every trimmed line that matches `^\d+\.\s+`, or every `### N.` heading when any exist | A line `Case: ...` is ignored. A line that starts with a number and a period is counted: a probe with two findings gave 2, and with a case wrapped into two numbered steps gave 4. This is why the rule says one line, no leading number |
| `scripts/verify-iteration.cjs` `reviewFindingsAreEnumerated` (`:197`) | `findingDetails`, ranked delta rows, then `parseIterationFile` | Unaffected; the narrative is read only through the parser above |
| `lib/deep-loop/post-dispatch-validate.ts` `validateIterationOutputs` (`:1568`) | The narrative file for existence and size (`:1626`), an optional fenced-code verification pass (`:1811`) and warn-only behavioral advisories (`:1836`); `findingDetails` for `scopeProof` and `affectedSurfaceHints` (`:1234`) | A one-line prose case with no fenced code trips none of them. Extra text is never a failure |
| `lib/deep-review-reducers/deep-review-reducer.ts` | Typed ledger events; a candidate carries `claimTextDigest` and `findingClass` (`:791`) | Unreachable. It never opens the narrative |
| `scripts/fanout-merge.cjs`, `scripts/synthesis-closeout.cjs`, `lib/result-envelopes/legacy-shadow.ts` | `findingDetails` objects by named fields (`title`, `summary`, `text`, `finding`, `description`, `id`) | No `case` field exists, so nothing reads one. No field is added to the ledger schema in this phase |
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **New reducer test**: `deep-review-state-reducer.vitest.ts` goes from 5 tests to 6. Run by title with `-t 'Case line'`: `Tests  1 passed | 5 skipped (6)`.
- **Deep-review suite**: the five files `deep-review-reducers`, `deep-review-projections-contract`, `deep-review-deltas-contract`, `deep-review-state-reducer` and `verify-iteration`, run from `.skilled/skills/system-deep-loop/runtime` with `npx vitest run --no-coverage`. Baseline before any edit, read on 2026-10-10: `Test Files  5 passed (5)`, `Tests  132 passed (132)`. After the one new test: `Tests  133 passed (133)`.
- **Contract parity**: `deep-review-contract-parity.vitest.ts` reads both hand-kept agent files for substrings. Run from `.skilled/skills/system-spec-kit/runtime/cli` with `npx vitest run --no-coverage --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts`. Baseline and expected after: `Tests  12 passed (12)`.
- **Mirrors**: `check-agent-mirror-sync.cjs --all` (12 agents), `sync-agents.cjs --check` and `sync-agents-pi.cjs --check` (12 agents each), `sync-runtime-mirrors.cjs --check` (187 mirrors across 8 trees). All exit 0 before the edit. Hermes `--check` (70 copies) exits 0 before the edit and is expected to exit 1 after it until the orchestrator regenerates.
- **Agent validators**: `validate_document.py --type agent` reports `VALID` with one non-blocking `non_sequential_numbering` warning on both files today; the count must stay 1. `extract_structure.py` and `check_authored_name_kebab.py` exit 0.
- **Routing freshness**: `compiled-route-guard.cjs` reads `system-deep-loop fresh` today and the leaf manifest check prints `leaf-manifest.json OK`. The edit touches one test file inside that skill root, so both are rechecked and must read the same.
- **Gap**: no checker validates a deep-review narrative for a `Case:` line; the rule is prose. See the follow-ups in section 6.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Case wording source: `.skilled/skills/sk-code/sk-code-review/SKILL.md` (`:311`, `:345`) and `references/review-core.md:97`.
- Contracts the builder reads first: `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` (agent frontmatter schema per runtime, the validation gate) and `.skilled/skills/sk-code/SKILL.md` (the TypeScript test routes to the sk-code-opencode surface). Neither contract asks for a version bump or changelog for an agent file.
- No version bump and no changelog entry: agents carry no version, and no skill file is edited. The prompt pack is left alone, so the deep-review skill version (1.11.3.0) does not move.
- Baseline gate state before any edit: all agent mirror checks exit 0, the five deep-review test files pass (132 tests), the compiled route guard reads every hub fresh.
- The orchestrator runs `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` once after all five children are built.
- **Follow-ups recorded, not built here**:
  1. Carry the case into the registry: a `case` field on `findingDetails` and the ledger schema, which this child must not touch.
  2. A deep-review narrative checker like the review mode's `check-review-findings.js`, so the rule is enforced and not only stated.
  3. A one-line check in Step 11 of the agent, and in the Pre-Delivery Checklist, that each finding carries a `Case:` line.
  4. Harden `parseIterationMarkdownFindings` so an indented numbered line inside a finding is not counted, which would let the one-line clause go.
  5. `reduce-state.cjs` reads `- **F###**:` bullets, while Step 7 tells the agent to write `N. **Title** -- file:line -- Description`; reconcile the two.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the tracked files with `git restore .skilled/agents/deep-review.md .claude/agents/deep-review.md .codex/agents/deep-review.toml .pi/agents/deep-review.md .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts`.
- If the orchestrator has already run the Hermes generator, also restore `.hermes/skills/agent-deep-review/SKILL.md`.
- Nothing else depends on the new bullet or the new test. Running the Codex and Pi generators again after the restore reproduces the pre-edit mirrors.
<!-- /ANCHOR:rollback -->

---

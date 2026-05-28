# Iteration 3 — Q3: Port eval-rig scorer / 5-dim rubric

## Focus
Port the 120/003 `score-variant.cjs` (deterministic checks + claude grader harness + 5-dim rubric) into deep-agent-improvement behind the scorer seam, decoupling it from fixture-only assumptions so the same scorer works for **agent-improvement** (profile-based, 5-dim rubric) and **model-benchmark** (fixture-based, pattern matching).

## Actions Taken

1. **Read `score-variant.cjs`** (120/003, 332 LOC) — the port source. Mapped all 5 dimensions (D1–D5) and their wiring.
2. **Read `run-benchmark.cjs`** (deep-agent-improvement current, 364 LOC) — the benchmark-mode scoring surface. Identified it's fixture-coupled via `requiredHeadings`/`requiredPatterns`/`forbiddenPatterns` on the output text.
3. **Read `materialize-benchmark-fixtures.cjs`** — fixture materializer confirming the fixture JSON schema.

## Findings

### F1 — Two scoring approaches currently exist and they are entirely separate code paths

| File | Scoring method | Fixture-coupled? |
|------|--------------|-----------------|
| `score-variant.cjs` (120/003) | D1–D5 weighted rubric; `scoreAcceptanceDeterministic` reads `fixture.acceptance[]` (grep/grep_absent/deterministic/git_diff_paths); D4 via `harness.gradeD4()` | YES — drops `fixture.acceptance`, `fixture.scope.cwd`, and uses SWE-bench harness |
| `run-benchmark.cjs` (dai current) | Pure pattern match on output text: `requiredHeadings` + `requiredPatterns` + `forbiddenPatterns`; no external harness | YES — but a DIFFERENT coupling (output text post-processing, not fixture schema) |

**Implication**: There is no shared scorer seam. The 120/003 harness and dai benchmark scoring are parallel, non-unified code paths. Bringing them under one seam requires designing the Abstraction Barrier carefully.

---

### F2 — Fixture coupling points in `score-variant.cjs`

There are **three distinct coupling points** to `fixture.json` in 120/003's `score-variant.cjs`:

**CP1 — `scoreAcceptanceDeterministic`** (lines 55–127):
```js
const acc = fixture.acceptance || []; // reads fixture.acceptance array
// dispatches on a.type: 'grep' | 'grep_absent' | 'deterministic' | 'git_diff_paths'
// executes against fixtureCwdAbs = path.resolve(RIG_ROOT, fixture.scope.cwd)
```
Fixture schema: `{ acceptance: Array<{id,type,file,pattern,expected_count?,command?,expected_exit?}> }`

**CP2 — `bundleGate` / `cwdCheck` / `preplanning` / `hallucinationFlag`** (lines 171–175):
Each runs a det-check script from `eval-rig/scripts/deterministic/` passing `fixturePath` (the `.json` file path) as an argv argument. The det-check scripts themselves read the fixture JSON to get `scope.cwd` and per-check parameters. Coupling is via the fixture JSON file, not the API.

**CP3 — `harness.gradeD4`** (lines 184–193):
```js
grader = await harness.gradeD4({
  fixture,           // full fixture object passed
  swe16_output_text,
  variant_hash,
  rubric_version,
  mode, mock_mode,
});
```
Full fixture object passed to grader harness; grader reads `fixture.grading[]` rubric items from within.

---

### F3 — The `forbiddenPatterns` dimension is unique to benchmark mode

`run-benchmark.cjs` scores a third dimension not present in 120/003's rubric:
- `cleanScore` / `forbiddenPatterns` — penalizes output containing undesirable patterns

120/003 D1–D5 rubric structure (weights from `eval-loop-config.json`):
- D1 Acceptance (weight ~0.25): `scoreAcceptanceDeterministic` — fixture-specific deterministic checks
- D2 Bundle gate (weight ~0.25): `bundle-gate.cjs` check
- D3 CWD check (weight ~0.15): `cwd-check.cjs`
- D4 Grader (weight ~0.25): `harness.gradeD4` — claude grader via harness
- D5 Pre-planning (weight ~0.10): `preplanning-regex.cjs`

Benchmark-mode dimensions from `run-benchmark.cjs` (no formal weight table; implicit 45+35+20):
- `headingScore` (45 pts): `requiredHeadings` coverage
- `patternScore` (35 pts): `requiredPatterns` coverage
- `cleanScore` (20 pts): `forbiddenPatterns` absence

These are NOT the same dimensions. A merged rubric would need to harmonize or coexist.

---

### F4 — Scorer seam interface definition needed

Current calls that must be preserved across the seam:

**Agent-improvement mode** uses `score-candidate.cjs` (the 5-dim rubric scorer) — NOT yet ported from 120/003.

**Model-benchmark mode** uses `run-benchmark.cjs` — fixture-coupled head/pattern/forbidden pattern matcher.

**Proposed abstraction** — a single `score(outputText, scoringContext, scoringMode)` function:

```typescript
// Scoring modes
type ScorerMode = 'agent-improvement' | 'model-benchmark';

// Inputs
interface ScoringContext {
  candidateId: string;
  candidateHash: string;
  // agent-improvement: profile object with improvement targets
  // model-benchmark: fixture object with requiredHeadings/requiredPatterns
  profileOrFixture: object;
  rubricVersion?: string;
}

interface ScoringResult {
  fixtureId: string;       // model-benchmark only; agent-improvement uses candidateId
  weightedScore: number;   // 0..1
  dimensions: Record<string, number>;   // mode-specific dimension scores
  hard_gate_failed: boolean;
 interaction_terms?: Record<string, boolean>;
  metadata?: Record<string, unknown>;
}

// Scorer seam contract
async function score(
  outputText: string,
  ctx: ScoringContext,
  mode: ScorerMode,
  opts?: { mock?: boolean; mockMode?: string }
): Promise<ScoringResult>
```

The seam decouples by NOT passing raw fixture objects to the scorer. Instead, the loop host (or a thin adapter layer) extracts the necessary data from the fixture/profile and passes only the primitive fields the scorer needs.

---

### F5 — How to decouple the fixture coupling

**Step 1 — Acceptance criterion abstraction**:

Replace the hardcoded `fixture.acceptance` dispatch in `scoreAcceptanceDeterministic()` with a configurable criteria list passed as a constructor/default:

```js
// Instead of reading fixture.acceptance[] directly:
// Build criteria list from scoringMode + profileOrFixture
const criteria = buildAcceptanceCriteria(scoringMode, profileOrFixture);
// Each criterion: { id, type, file?, pattern?, command?, expected_exit? }
```

**Step 2 — Grader harness decoupling**:

The `harness.gradeD4()` call is the biggest coupling risk (fixture.grading rubric items + harness assumptions). To decouple:
- Create a `buildGraderFn(mode)` factory returned by the harness module
- agent-improvement: returns a grader that calls the LLM with the 5-dim rubric
- model-benchmark: returns a NOOP or simple pattern-match grader (D4 maps to `forbiddenPatterns` presence in benchmark mode)
- The harness itself stays in `eval-rig/grader/harness.cjs`; only the factory function is called

**Step 3 — Profile-based scoring adapter**:

For agent-improvement mode, instead of fixture JSON, the scorer receives a profile object:
```js
// From loop.cjs, pass a computed "virtual fixture" derived from improvement targets
const virtualFixture = {
  acceptance: improvementTarget.acceptanceCriteria || [],
  grading: improvementTarget.gradingRubric || [],
  // ... extracted from the improvement profile
};
```

This way the same `scoreVariantFixture` function works for both — it always operates on primitive criteria arrays, never on a raw fixture JSON schema requiring a `.json` file.

---

### F6 — Key risk: the fixture `.json` file assumption bleeds into det-check scripts

The det-check scripts (`bundle-gate.cjs`, `cwd-check.cjs`, `preplanning-regex.cjs`, `hallucination-flag.cjs`) all receive `fixturePath` as an argument and read the fixture JSON internally. This is a second-order coupling: even if the scorer seam is abstracted, the det-check scripts remain fixture-path-coupled.

**Mitigation**: The det-check scripts must be parameterized differently for agent-improvement mode. Instead of reading `scope.cwd` from a fixture JSON, they should receive `cwd` as an explicit argument. This requires modifying the det-check scripts (or creating a wrapper) to accept `cwd` as a `--cwd` flag.

---

### F7 — Backward compat for agent-improvement (no fixture) path

Current agent-improvement path does NOT use fixtures. `score-candidate.cjs` exists but its internals aren't visible in this research session. The critical backward-compat invariant:

> `loop.cjs --run-with-mode=agent-improvement` must produce **byte-identical state JSONL** lines as `loop.cjs` with mode absent.

This means:
1. The new scorer seam MUST default to the existing `score-candidate.cjs` behavior when mode=`agent-improvement`
2. Only when mode=`model-benchmark` should the ported 120/003 rubric path be activated
3. The mode detection should be DONE in `loop.cjs` (or `reduce-state.cjs`), NOT inside the scorer itself — the scorer receives a pre-processed `scoringMode` argument

---

### F8 — Scorer seam interface contract (summary)

```
score(outputText: string, ctx: ScoringContext, mode: ScorerMode, opts?: ScoreOpts): Promise<ScoringResult>

ScoringContext {
  candidateId: string
  candidateHash: string
  profileOrFixture: object        // profile for agent-improvement, fixture for model-benchmark
  rubricVersion?: string
  // Internally derived by the seam adapter:
  acceptanceCriteria?: AcceptanceCriterion[]   // agent-improvement: from profile; model-benchmark: from fixture.acceptance[]
  gradingCriteria?: GradingCriterion[]         // agent-improvement: from profile; model-benchmark: from fixture.grading[]
}

ScoringResult {
  fixtureId: string
  weightedScore: number
  dimensions: { [dimId: string]: number }
  hard_gate_failed: boolean
  interaction_terms?: { d2_x_d1_decoupled?: boolean, d4_x_d1_inverse?: boolean, d5_x_d1_inverse?: boolean }
  grader?: { score: number, confidence: number, parse_status: string }
  metadata?: object
}
```

**Invariants**:
- `hard_gate_failed === true` → `weightedScore` must be 0
- `weightedScore` is always 0..1
- The scorer NEVER reads a fixture JSON file directly — all fixture data is extracted and passed as primitives by the loop host

---

## Questions Answered

- **Q3** (partial): How to decouple the scorer from fixture coupling — yes, identified 3 coupling points (acceptance criteria array, det-check scripts via fixture JSON path, grader harness fixture object). Solution: build criteria-granular pass-through from loop host; parameterize det-check scripts with explicit `cwd`; grader factory `buildGraderFn(mode)`.

## Questions Remaining

- **Q4**: Wire mode switch into `loop.cjs`, `reduce-state.cjs`, `converge.cjs`, `materialize-benchmark-fixtures.cjs` — actual code changes
- **Q5**: Backward-compat test strategy + edge cases

## Next Focus

Q4: Wire the mode switch into `loop.cjs` — implement the actual code changes including `reduce-state.cjs`, `converge.cjs`, and ensure `materialize-benchmark-fixtures.cjs` is only invoked for model-benchmark mode.

---
iteration: 2
focus: "correctness — the validator's goal measurement against the runtime extractor"
dimensions: [correctness, maintainability]
started_at: "2026-09-11T11:00:00Z"
status: complete
---

# Iteration 002 — correctness: the validator's measurement against the extractor's

## Scope

The review scope names "the validator's measurement against the extractor's". Iteration 1 of the prior lineage opened the frontmatter boundary as F001 and the fix widened the runtime regex. This iteration tests whether the two surfaces that are supposed to share one boundary still agree. Surfaces read: `.opencode/hooks/goal/lib/goal-slice.cjs`, `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`, `.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`, `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts`, `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`, `.opencode/skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts`.

## Findings

### F102 — P2 — The runtime extractor and the validator measure different durable slices for the same goal document once a fence carries trailing whitespace

**Dimension**: correctness | **Bears on**: ADR-003 ("One extractor splits frontmatter with the validator's own regex … pinned by a golden test against `continuity-freshness.ts:17`") and ADR-006's budget measurement

**Evidence** (read at the cited lines):

- Runtime: `.opencode/hooks/goal/lib/goal-slice.cjs:24` — `/(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/`. Both fences tolerate trailing spaces or tabs.
- Validator goal rule: `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1028` — `/…---\n[\s\S]*?\n---(?:\n|$)/`. Neither fence tolerates anything between the dashes and the newline, so a tolerant document falls through to `body = normalized` and the frontmatter is measured as if it were part of the durable slice.
- Third regex in the family: `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:17` tolerates `\s*` on both fences — the file ADR-003 names as the pin. The goal rule's copy is the strict outlier.
- The manifest states the intended measure: `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json:25` — "characters after the frontmatter closing fence up to the log anchor".
- The pinned test only exercises exact fences: the vitest fixture writes `'---'` (`spec-doc-structure.vitest.ts:209-233`) and asserts a slice of 1500 characters (`:314-317`). No test compares the runtime slice with the validator slice; `goal-slice.test.cjs` asserts the runtime's tolerant behavior alone.

**Reproduction** (both real modules, one fixture document, `scratch/probe-measurement.mjs`):

| Fence | Runtime slice | Validator slice | Delta |
|---|---|---|---|
| `--- ` (trailing space) | 3903 chars → warn tier | 4008 chars → **over tier** | 105 chars, the whole frontmatter |
| `---` (exact) | 3903 | 3903 | 0 |

The validator's slice literally contains `SECRET-SESSION` from the fixture's `_memory.continuity.session_dedup` block, and its tier crosses into the error band that `SPECDOC_SUFFICIENCY_005` reports as an error (`spec-doc-structure.ts:1045-1050`), while the runtime reports the same file as a warning.

**Impact**: `validate.sh --strict` can fail a packet whose runtime measurement is inside the warning band, and the failure detail quotes a length that includes bookkeeping the file's own contract excludes. Confidence direction is inverted from the pass-1 leak (fail-closed rather than leaking), so the impact is a false gate failure instead of exposure. Trigger is a document shape editors produce accidentally and the runtime deliberately tolerates; the fix that widened the runtime boundary was not mirrored into the validator's copy, and ADR-003's promised golden pin does not exist.

**Recommendation**: give the goal rule the same fence tolerance as `continuity-freshness.ts:17` (or import one shared matcher), and add the cross-surface parity test ADR-003 promises with a tolerant-fence fixture. Report only; no fix in this review.

## Ruled out

- Frontmatter leaking through the runtime extractor on a tolerant fence: ruled out. The runtime returned 3903 characters with no secret, and the unclosed-opener case fails closed to an empty body (`goal-slice.cjs:40-43`), pinned by `goal-slice.test.cjs`.
- The budget rule being skipped for nested phase parents: ruled out. `detectLevel()` classifies a phase parent as level `phase` before the child exemption is consulted (`orchestrator.ts:167-169`), and `budgetApplies` is true for that level (`spec-doc-structure.ts:1041-1043`), so 036's own `goal.md` (3864 durable characters) is measured and warned.
- Log rows and reflow changing the measurement: ruled out in both surfaces; the runtime hashes a whitespace-collapsed slice and the log anchor terminates the measured body (`goal-slice.cjs:53-57`, `:122-128`), pinned by `goal-slice.test.cjs`.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | correctness, maintainability |
| Files reviewed | `goal-slice.cjs:20-57,122-128`, `spec-doc-structure.ts:1026-1060`, `orchestrator.ts:164-186`, `continuity-freshness.ts:17`, `spec-kit-docs.json:24-29`, `spec-doc-structure.vitest.ts:205-317` |
| New findings | 1 (P2) |
| Reproduction fidelity | both production modules loaded directly (dist validator export plus the CJS slice module); measurements printed side by side |

Review verdict: PASS

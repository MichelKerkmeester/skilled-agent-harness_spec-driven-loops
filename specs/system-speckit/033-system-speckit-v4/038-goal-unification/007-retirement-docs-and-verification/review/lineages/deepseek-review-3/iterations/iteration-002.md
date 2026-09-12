---
iteration: 2
focus: "correctness — the two frontmatter boundaries behind the goal slice"
dimensions: [correctness, maintainability]
started_at: "2026-09-11T12:47:00Z"
status: complete
---

# Iteration 002 — correctness: the two frontmatter boundaries behind the goal slice

## Scope

Pass 2 reported F102: the runtime extractor tolerated a fence with trailing whitespace or a bare carriage return while the validator's copy did not, so the validator measured the frontmatter as part of the durable slice. Phase 008 answers by widening the validator's goal extractor and adding a vitest case (`../008-hardening-research/implementation-summary.md:71`, `:73`). This iteration runs both production extractors over one input matrix, then asks the second question the fix implies: which *other* frontmatter boundary in the same validator now disagrees with the widened one, and does the new test actually pin the property its name claims.

Surfaces read: `.opencode/hooks/goal/lib/goal-slice.cjs`, `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` (goal slice, general frontmatter parser, memory-block rule, document sets), `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts` (the ADR-named boundary), the vitest suite, and `002-decisions-and-contract-freeze/decision-record.md:261-266`.

## Findings

### F302 — P2 — On an unclosed frontmatter fence the validator still measures the frontmatter as part of the durable slice where the runtime fails closed

**Dimension**: correctness | **Bears on**: ADR-003 (one extractor, frontmatter always excluded) | **Carry-over**: the remaining half of pass-2 F102

**Evidence** (read at the cited lines):

- The runtime's opener-only branch fails closed: `.opencode/hooks/goal/lib/goal-slice.cjs:42-45` — an opening fence with no closing fence yields `body: ''`, and `readPacketGoal` returns null for a broken document (`:255`).
- The validator's copy has no such branch: `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1030-1031` — `const fence = normalized.match(/.../); const body = fence ? normalized.slice(fence[0].length) : normalized;` so an unmatched fence falls back to the *whole document*, frontmatter included.
- Both surfaces agree everywhere else in the matrix (exact fence, trailing space, trailing tab, both, CR-only, CRLF, BOM plus leading comment, no frontmatter, trailing newline): ten inputs, one divergence.

**Reproduction** (both shipped modules executed on the same bytes; fixtures under this lineage's `scratch/`):

- Exact fence: runtime 164, validator 164.
- Trailing space / trailing tab / both / CR-only / CRLF / BOM+comment: runtime 164, validator 164 for every spelling.
- Unclosed opener, 4,200-character body: runtime `readPacketGoal → null`, `extractDurableSlice → 0` characters; validator `extractGoalDurableSlice → 4400` characters.
- Through the shipped rules on that fixture: `SPEC_DOC_SUFFICIENCY` fails with `SPECDOC_SUFFICIENCY_005 error goal.md: durable slice is 4400 characters (> 4000)` next to `SPECDOC_FRONTMATTER_001 error goal.md: malformed YAML frontmatter (frontmatter opening delimiter is missing a closing ---)`. The document already fails the frontmatter rule, so there is no false pass; the reported budget number is the one measurement the shared module exists to prevent — frontmatter counted as directive.

**Impact**: the diagnostic a reader gets for a broken goal.md quotes a slice that includes the bookkeeping block, and the number can add a spurious over-budget error to a document that is already unreadable at runtime. The same class as pass-2 F102, on the one input spelling the phase-008 fix did not cover. P2.

**Recommendation**: give the validator's copy the same opener-only branch the runtime has (frontmatter present, not closed → empty slice), or state in ADR-003 that the two boundaries are only promised to agree on closed fences. Report only; no fix in this review.

### F303 — P2 — The validator's strict frontmatter parser and its tolerant goal extractor disagree on the same document, so a trailing-space fence silently waives the continuity block goal.md is required to carry

**Dimension**: correctness | **Bears on**: ADR-003 and the set comment that keeps `goal.md` out of `OPTIONAL_CONTINUITY_DOCS`

**Evidence** (read at the cited lines):

- The general parser normalizes CRLF only and demands exact fences: `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:276-278` — `content.replace(/\r\n/g, '\n')` then `/^...---\n([\s\S]*?)\n---(?:\n|$)/`, with no `[ \t]*` and no bare-CR handling.
- The goal extractor normalizes bare CR and tolerates whitespace on both fences: `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1029-1030`.
- `goal.md` is deliberately *not* an optional-continuity document — `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:212-213` ("goal.md is absent because its template does") — so the memory-block rule requires a continuity block on it and reports `SPECDOC_FRONTMATTER_002` when it is missing (`:705-712`).
- That requirement is reached only through the strict parser (`:690`), so a fence the strict parser cannot see is a document with no frontmatter at all, and the rule continues without a diagnostic (`:701-703`).

**Reproduction** (rule runner over three spellings of the same goal.md, one with an exact fence, one with `---  ` on both fences, one with no frontmatter; `scratch/probe-frontmatter-boundary.cjs`):

- Exact fence, no `_memory` block: `FRONTMATTER_MEMORY_BLOCK status=warn`, `SPECDOC_FRONTMATTER_002 warning goal.md: missing _memory block`.
- Same document with a trailing-space fence: `status=pass`, no diagnostics — while `SPEC_DOC_SUFFICIENCY` measures the identical 164-character slice as the exact spelling.
- Same document with no frontmatter at all: `status=pass`, no diagnostics (adjacent, pre-existing instance of the same skip).

**Impact**: a goal.md spelled with a trailing space or tab on its fence escapes the continuity requirement that an identical document with a plain fence is asked to satisfy. The widening phase 008 made is correct on its own axis; the sibling boundary in the same file was not widened with it, which is the drift pass-2 F102 named. Advisory in effect (the missing diagnostic is a warning, not an error) and unusual in trigger. P2.

**Recommendation**: use the shared boundary for both rules inside the validator — the goal extractor already proves the tolerant form — or record the deliberate asymmetry with a test that pins it. Report only; no fix in this review.

### F304 — P2 — The phase-008 parity test asserts the validator agrees with itself, and ADR-003's promised golden pin against the continuity boundary still does not exist

**Dimension**: traceability | **Bears on**: ADR-003's "pinned by a golden test against `continuity-freshness.ts:17`" (`002-decisions-and-contract-freeze/decision-record.md:265`) | **Carry-over**: pass-2 F102's second half

**Evidence** (read at the cited lines):

- The new case is named for parity — `.opencode/skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts:320` "measures the same slice as the runtime extractor when a fence carries trailing whitespace or bare CR" — but its three assertions compare `extractGoalDurableSlice` against `extractGoalDurableSlice` (`:326-328`); the suite imports only the validator module (`:9-14`) and never references `.opencode/hooks/goal/lib/goal-slice.cjs`.
- The ADR's named boundary is a third variant: `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:21` — `/^...---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/` — which tolerates whitespace *and* is not derived from either copy.
- Grepping the repository for `extractGoalDurableSlice` returns the module, its dist, the suite, and this lineage's probes; nothing compares it with the runtime extractor or with the continuity boundary.

**Impact**: a future edit to either fence matcher leaves the suite green, which is exactly the failure mode pass-2 F102 recorded. The behavior is aligned today (F302's matrix: nine of ten spellings agree); the pin that would keep it aligned is what is missing. ADR-003's own acceptance promise is therefore still unmet after a phase whose stated purpose included closing it. P2.

**Recommendation**: import the runtime extractor in the vitest case and assert equality of lengths and contents on the same fixtures, or replace ADR-003's pin sentence with the boundary the project actually keeps. Report only; no fix in this review.

## Ruled out

- Frontmatter leaking through the runtime slice on a tolerant fence: ruled out; the runtime strips it for every spelling in the matrix and fails closed on an unclosed opener (`.opencode/hooks/goal/lib/goal-slice.cjs:24`, `:42-45`).
- The pass-2 F102 divergence itself (trailing whitespace, bare CR): **fixed**. Runtime and validator returned equal slices for trailing space, trailing tab, both, CR-only and CRLF.
- The validator failing a goal.md that the runtime accepts on a *closed* tolerant fence: ruled out; both measure 164 characters on every closed spelling, so the warn/error tier decision is identical.
- The phase-child budget exemption hiding a nested parent: not re-opened; pass 1 checked it and the level resolver is unchanged in phase 008.

## Coverage

| Item | Value |
|---|---|
| Dimensions touched | correctness, maintainability |
| Files reviewed | `goal-slice.cjs:20-59,242-272`, `spec-doc-structure.ts:205-231,276-283,682-714,1017-1080`, `continuity-freshness.ts:1-30`, `spec-doc-structure.vitest.ts:9-14,300-370`, `decision-record.md:261-266` |
| New findings | 3 (P2) |
| Reproduction fidelity | both production modules executed over a ten-spelling matrix; three rule runs over three document spellings; all fixtures under this lineage's `scratch/` |
| Prior-lineage closure verified | pass-2 F102 (partially fixed: closed fences agree, unclosed fence still diverges; the pin is still absent) |

Review verdict: PASS

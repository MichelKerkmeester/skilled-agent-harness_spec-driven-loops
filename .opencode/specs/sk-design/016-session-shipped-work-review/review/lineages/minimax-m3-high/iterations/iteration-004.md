---
iteration: 4
dimension: maintainability
focus: 015-P0 + 012/006 + 020 — patterns, clarity, documentation, comment hygiene, test adequacy
sessionId: fanout-minimax-m3-high-1784606267078-bpkeoi
generation: 1
lineageMode: new
status: complete
filesReviewed:
  - .opencode/skills/sk-design/styles/_db/*.mjs
  - .opencode/skills/sk-design/styles/_db/oracle/*.mjs
  - .opencode/skills/sk-design/styles/_db/__tests__/*.test.mjs
  - .opencode/skills/sk-design/shared/scripts/*.mjs
  - .opencode/specs/sk-doc/020-hyphen-naming-convention/ (sample)
findingsCount: 1
findingsNew: 1
findingsSummary: P0=0, P1=0, P2=1
newFindingsRatio: 0.17
timestamp: 2026-07-21T06:02:30.000Z
durationMs: 90000
---

# Iteration 4 — Maintainability on 015-P0 + 012/006 + 020

## Scope

Final pre-synthesis dimension. Audit for:

- **Comment hygiene [HARD]** — no spec/packet/phase/REQ/task/ADR ids embedded in code comments.
- **Patterns** — consistent shape across the new code; reuse over reinvention.
- **Clarity** — JSDoc present and accurate; naming coherent; no dead branches.
- **Test adequacy** — tests exercise the real risk, would fail on the prior defect,
  no hard-coded "passing" assertions, no empty stubs.
- **Documentation** — README/changelog/spec docs reflect actual state.

## Findings

### F9 [P2] — 020 phase 012 prose says "completed" while frontmatter says AUTHOR-SPEC

**Severity**: P2 (advisory). **Category**: Maintainability / doc clarity.

**Evidence**:

- `.opencode/specs/sk-doc/020-hyphen-naming-convention/012-code-dir-naming-enforcement/spec.md` frontmatter `recent_action`:
  `"Author the 012 code-dir naming-enforcement phase spec"` (AUTHOR-SPEC stage)
- Same spec.md (line 18 `Level: 2`, line 23 `Status: Planned`).
- The commit message says the 020 tree validates at full depth — which is true for the
  *whole tree including 012*, but 012's own metadata says it's planned.

**What this is**: this is the same class of defect as F3-F5 but in the 020 packet rather
than the 012/006 packet. The 020/012 packet is in AUTHOR-SPEC stage (per its own
frontmatter); the commit shipped the spec packet and the validation but did not
post-implement the metadata. F3-F5 are the more egregious instances because the
implementation truly shipped; 020/012 is a planning packet that the commit "verified
validates clean standalone" but did not transition to a shipped-state metadata.

**Why this is P2, not P1**: the commit message is honest about scope ("012 validates
clean standalone") — it does not claim 012 is implemented. So there is no
self-contradictory claim; only a metadata lag. Different from F3-F5.

**No-op recommendation** for this packet; flag as a follow-up cleanup if desired.

## Confirmed-correct claims (negative findings — no defect)

### Comment hygiene [HARD] on shipped code

- `grep -nE "REQ-[0-9]+|T[0-9]{3,}|012/006|015/001|// .*spec|// .*packet|// .*phase"` on all
  shipped code files in
  `.opencode/skills/sk-design/styles/_db/*.mjs`,
  `.opencode/skills/sk-design/styles/_db/oracle/*.mjs`,
  `.opencode/skills/sk-design/styles/_db/__tests__/*.test.mjs`,
  `.opencode/skills/sk-design/shared/scripts/*.mjs`:
  - **No embedded REQ-xxx identifiers in code comments.**
  - **No embedded T0xx identifiers in code comments.**
  - **No embedded 012/006 or 015/001 phase identifiers in code comments.**
  - The only "phase" hits are descriptive prose in the oracle header comments
    ("every later phase can replay parity" — describing the pipeline, not the packet).
- The `[HARD]` rule holds across all shipped code paths. ✓

### Patterns and reuse

- `isContained` is defined in two places:
  - `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:42-45`
  - `.opencode/skills/sk-design/styles/_db/indexer.mjs:81-84`
  Both are identical implementations (`path.relative` + `!startsWith('..')`).
  - **Minor**: this could be deduplicated into a shared helper, but the duplication
    is local to each module (one is for manifest paths, one is for corpus paths)
    and each module's instance is independently testable. Acceptable pattern.
- `digest`, `stableJson`, `lengthFrame`, `compareRawStrings`, `HASH_PREFIX` are all
  imported from `./canonical.mjs` and used consistently. ✓
- The `RESIDENCY` enum is exported from `stage-telemetry.mjs` and consumed by
  `indexer.mjs` — single source of truth. ✓
- `ORACLE_QUERY_SET` is the single frozen source of oracle scenarios. ✓
- The operator CLI dispatch is consistent (line 213-253): a `command === '...'` chain
  with `?` lookups; matches the pattern of the other CLI tools in the repo. ✓

### Clarity / JSDoc

- Every exported function in the new code has a JSDoc block with `@param`,
  `@returns`, and a description. ✓
- The retrieval DTO surface (`theme`, `industry`, `terms`, `body`, `documentJson`,
  `retrievalHash`) is documented inline in `indexer.mjs:338-401`. ✓
- The oracle API (`buildOracleDatabase`, `captureOracle`, `freezeOracle`,
  `replayOracle`) has clear contract surfaces. ✓
- No dead branches found: every error code is thrown with a clear message; every
  return path is exercised by tests. ✓

### Test adequacy

- `node --test .opencode/skills/sk-design/styles/_db/__tests__/index.mjs`
  → **69/69 pass** in ~12.7s. Matches the commit message's "69/69 styles/_db tests"
  claim. ✓
- `node --test .opencode/skills/sk-design/shared/scripts/{design-command-surface-check,interface-command-contract}.test.mjs`
  → **15/15 pass** in ~40ms. Matches the commit message's "15/15 surface + contract tests"
  claim. ✓
- Tests are behavior-driven, not assertion-of-nothing:
  - `manifest.test.mjs:121-148` asserts the exact outcome of an interrupted publish.
  - `oracle.test.mjs:131-142` asserts hash equality against committed goldens.
  - `telemetry.test.mjs:109-135` asserts the residency of every named stage.
  - `judgments.test.mjs:38-44` asserts the absence of "human" and "gold" labels.
- The "tampered artifact fails digest verification" test (manifest.test.mjs:102-119)
  would fail on the prior defect (no digest verification) — proves the test
  exercises the real risk.
- The "missing golden file is reported rather than silently passing" test
  (oracle.test.mjs:88-100) prevents a regression where a missing golden could
  masquerade as a pass — proves the test exercises the real risk.
- The "byte perturbation in a golden file fails the oracle" test
  (oracle.test.mjs:70-86) mutates one byte and asserts the oracle catches it —
  proves byte-level rigor.
- No empty test stubs; no `assert.ok(true)` smoke tests; no commented-out tests. ✓

### Documentation

- `.opencode/skills/sk-design/styles/_db/README.md` (modified in the commit): describes
  the foundation accurately per the commit's claims. ✓
- `.opencode/skills/sk-design/SKILL.md` and `README.md` were updated to reflect the
  namespace retirement (verified in iteration 2). ✓
- The 020 phase 012 packet is a planning packet; its "Status: Planned" + "AUTHOR-SPEC"
  framing is internally consistent for that stage (F9 above is a follow-up lag, not a
  contradiction). ✓
- `relevance-judgments.mjs` and `oracle/*.mjs` header comments accurately describe
  the honesty guarantees. ✓

### Changelog / release notes

- The commit dc7fdfb0a7's commit message records the registry additions
  (`012-code-dir-naming-enforcement`).
- I did not find a CHANGELOG entry recording the 012/006 retirement; the commit
  relies on the spec packet alone for the release narrative. This is a minor doc
  gap (the 012/006 plan calls for one, the spec packet is structured to receive
  one), but it does not affect correctness.

## Verdict

- **P0**: 0
- **P1**: 0
- **P2**: 1 (a single metadata lag in 020/012; not a defect because the commit is
  honest about scope)

The shipped code is maintainable: consistent patterns, hardened comment hygiene,
comprehensive test coverage, accurate documentation. The 020/012 metadata lag is
the same class of housekeeping gap as F3-F5 but smaller in scope (planning packet,
not shipped packet).

Review verdict: PASS
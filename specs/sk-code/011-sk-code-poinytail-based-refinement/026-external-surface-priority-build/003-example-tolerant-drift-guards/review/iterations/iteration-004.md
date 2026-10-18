# Iteration 004 — Maintainability

**Run:** review-i1-g1 · **Session:** 2026-10-13T05:58:44.591Z · **Generation:** 1 · **Scope class:** standard
**Target:** commit `b6eef4ebbb` — "fix(sk-code-skilled): let the drift guards pass after an example surface is removed"
**Dimension under review:** D4 maintainability (comment durability, readability of the changed guard logic, regression coverage of the new behavior, and the test/doc upkeep the change leaves behind)

## Dimension

Do the changed guards, tests and release docs stay maintainable: do the new comments keep only the durable why, are the three router-sync hunks and the new doc-claims constants readable, does every new behavior carry regression coverage, and what upkeep does the release leave behind? Read-only: no reviewed file was modified. The five phase spec docs were read in iteration 3 for traceability and are carried unchanged — the commit under review is immutable.

## Files Reviewed

- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` — whole file; new constants [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:42], allowlist row [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:66], `checkSurfaces` and its stated-count lookup [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:331].
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` — whole file; the on-disk filter [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:31], the first-map anchor [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:128], the archived-gold skip [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:254].
- `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs` — whole file; fixture [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:47], allowlist test [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:95], registry-count test [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:227].
- `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` — whole file; example-surface-removal tests [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:134] and [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs:146].
- Release surfaces: `SKILL.md:175`, `scripts/README.md:13`, `assets/scripts/README.md:77`, `.hermes/skills/sk-code-skilled/SKILL.md:180`, `changelog/v1.2.4.0.md`.
- Cross-reference: the string the leg 3 skip depends on [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:457].

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R4-P2-001 [P2] New `surfaces` allowlist row has no regression test

- **Case:** the commit adds a third `ALLOWED` row — `check: 'surfaces'`, file `sk-code-skilled/assets/checklists/agent-authoring.md`, line substring `mirror it across all three surfaces` — so the registry-derived count tolerates one checklist line that counts runtime agent directories [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:66]. No fixture writes that path; remove the row or edit its `line` substring and the whole suite stays green. The regression surfaces only when the live wrapper runs.
- **Evidence:** `buildHub` writes ROUTER.md, `mode-registry.json`, shared refs, a demo packet, `sk-code-quality/SKILL.md`, a changelog and a benchmark report, never `agent-authoring.md` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:47]. The only allowlist assertion exercises the `names` check [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:95], and the new `surfaces` coverage tests counts only [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs:227]. `rg -n "agent-authoring|mirror it across"` over `scripts/tests/` returns no match, and the directory holds exactly the two reviewed test files.
- **Counterevidence sought:** the live wrapper is the real gate and fails loudly if the row stops matching, and the row's live-tree match was verified in iteration 1. Held at P2 because the failure direction is noisy, never a silent pass.
- **Alternative explanation:** unit tests may deliberately leave allowlist rows to the live wrapper; the residual cost is a red gate with no failing unit test naming the row.
- **User impact:** a doc reword or a typo in the row turns `run-all-drift-guards.sh` red with no unit test explaining why; a one-fixture addition fixes it.
- **Finding class:** instance-only.
- **Scope proof:** full read of both files in `scripts/tests/` (the directory holds exactly these two); no fixture writes the allowlisted path.
- **Recommendation:** add the allowed line to a fixture hub and assert `PASS check surfaces`, plus one negative where the same line in another file still fails.
- **Confidence:** high on the omission, medium on impact.
- **Downgrade trigger:** another test outside the two reviewed files writes that path and asserts the surfaces allowlist.

#### R4-P2-002 [P2] Count vocabulary is encoded twice and the `both`-case fallback is positional

- **Case:** one vocabulary lives in two representations on adjacent lines: `COUNT_WORDS` maps word to number [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:45], and `SURFACE_COUNT_WORDING` repeats the same alternation inside a regex [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:46]. The lookup then falls back to `2` for any match without a capture group [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:331], which silently serves the `both supported surfaces` pattern. An editor who extends one representation without the other gets `says undefined` failures on true wording.
- **Evidence:** `stated = m[1] ? COUNT_WORDS[m[1].toLowerCase()] : 2`; only the second pattern in the array lacks a capture group, so the default is load-bearing and its meaning is inferable only from that pattern.
- **Counterevidence sought:** the two lines sit adjacent, so a reviewer sees the pair; no current input produces `undefined` because both lists agree today, so this is a latent upkeep cost, not a live defect.
- **Alternative explanation:** keeping each constant self-describing is intentional; the cost is paid only by the next editor.
- **User impact:** the next editor of the count vocabulary can produce misleading failure text; development-time cost only.
- **Finding class:** instance-only.
- **Scope proof:** the two constants are adjacent and self-contained; the only other reader is the loop that consumes them.
- **Recommendation:** derive the regex alternation from `Object.keys(COUNT_WORDS)`, or assert the two agree at load, and name the `both` case explicitly instead of the positional `: 2` fallback.
- **Confidence:** high on the structure, low on impact.
- **Downgrade trigger:** a derivation or load-time assertion tying the two representations together.

### Carried Findings

R1-P2-001 (unguarded registry parse), R1-P2-002 (count vocabulary starts at two), R2-P2-001 (symlink walks vs existence checks), R3-P2-001 (spec change list omits README and Hermes copy), R3-P2-002 (two live docs keep the fixed three-surface description), R3-P2-003 (REQ-006 doctor clause has no AC expression): no status change, no new maintainability angle beyond R4-P2-002's note that the vocabulary is also duplicated. All six remain open for the fixes phase after the review loop.

## Traceability Checks

| Protocol | Status | Note |
|----------|--------|------|
| `spec_code` (core) | partial | Carried from iteration 3: REQ-001-006 and D1-D6 map to the changed files; spec.md's change list omission is R3-P2-001. The commit is immutable, so the status cannot change within this review. |
| `checklist_evidence` (core) | partial | Carried from iteration 3: T001-T012, checklists and AC rows remain pending (expected pre-T012); R3-P2-003 tracks the REQ-006 doctor row. Maintainability adds no new row-level gap. |
| `skill_agent` (overlay) | pass | Carried from iteration 3: no agent definition references the packet; the skill's frontmatter contract is intact. |
| `agent_cross_runtime` (overlay) | pass | Carried from iteration 3: the `.hermes` mirror differs from canonical only by its generated banner; both carry `1.2.4.0`. |
| `feature_catalog_code` (overlay) | notApplicable | Carried from iteration 3: no feature catalog artifact exists for this surface. |
| `playbook_capability` (overlay) | pass | Carried from iteration 3: OC-008's `expected_resources` exist and its guard list matches the shipped wrapper. |

## Search Ledger (summary)

| ID | Bug class | Disposition | Evidence |
|----|-----------|-------------|----------|
| SL-022 | test_coverage_gap | finding → R4-P2-001 | fixture `:47-64` and allowlist test `:95-102` vs the new row at `:66-71`; `rg` over tests: no match |
| SL-023 | duplicated_vocabulary_drift | finding → R4-P2-002 | `COUNT_WORDS` `:45` restated in the regex `:46`; fallback at `:331` |
| SL-024 | comment_hygiene_violation | ruled_out | sweep for spec paths, REQ/AC/CHK ids and finding ids returned nothing; comments state the why |
| SL-025 | stale_doc_upkeep | deferred | `SKILL.md:175` and `scripts/README.md:13` vs `assets/scripts/README.md:77`; already R3-P2-002 |
| SL-026 | magic_string_coupling | ruled_out | `ORPHAN_WORKFLOW_MODE` is a bare literal `leaf-resource-contract.cjs:457`, but the leg 3 test `verify-router-sync.test.cjs:146` exercises the skip and fails closed |
| SL-027 | error_handling_inconsistency | deferred | `checkSurfaces` raw parse `:324` vs router-sync per-leg try/catch `:357`; already R1-P2-001 |
| SL-028 | module_load_filter_readability | ruled_out | the `onDisk` filter `:31-34` carries its why and is exercised in both directions by the leg 2 tests |

## Scope Violations

None. No out-of-scope mutation was planned or attempted; all writes are confined to this review run directory.

## Verdict

PASS with advisories (`hasAdvisories=true`). No P0 or P1 findings; two new P2 maintainability advisories. The changed comments all keep the durable why with no ephemeral labels, the three router-sync hunks read clearly, and the new registry-count behavior carries a test; the two gaps are regression coverage for the new allowlist row and a duplicated count vocabulary in the doc-claims guards. The doc upkeep gap in R3-P2-002 remains the only user-facing advisory.

## Next Dimension

None remaining — correctness, security, traceability and maintainability are all covered. The loop's next step is synthesis/verification, not another dimension.

Review verdict: PASS

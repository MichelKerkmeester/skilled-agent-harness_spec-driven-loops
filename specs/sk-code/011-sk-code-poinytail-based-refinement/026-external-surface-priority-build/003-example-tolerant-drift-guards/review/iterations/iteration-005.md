# Iteration 005 — Correctness (broadened adversarial re-check)

**Run:** review-i1-g1 · **Session:** 2026-10-13T05:58:44.591Z · **Generation:** 1 · **Scope class:** standard
**Target:** commit `b6eef4ebbb` — "fix(sk-code-opencode): let the drift guards pass after an example surface is removed"
**Dimension under review:** D1 correctness (broadened adversarial re-check of the four guard changes and re-adjudication of all eight open P2s)

## Dimension

Do the four guard changes behave correctly at their boundaries — a hub with no example surface, a partially removed map, a malformed or unusual registry, an unusual count spelling — and does every boundary keep the guard's failure direction fail-closed rather than silently passing? Read-only: no reviewed file was modified. The commit under review is immutable. Second duty this iteration: re-adjudicate every open P2 from iterations 1–4 and confirm or adjust each severity.

## Files Reviewed

- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs` — whole file again this iteration; `COUNT_WORDS` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:45], `SURFACE_COUNT_WORDING` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:46], the new `surfaces` allowlist row [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:66], the registry-derived count and its parse [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:324], the `stated` fallback [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:331], plus `bases`/`isPathCandidate`/`checkPaths` for the backstop question.
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` — the on-disk surface filter [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:31], the first-map prose anchor [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:129], the archived-gold skip [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:258], plus leg 2 and the per-leg error containment [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:357].
- `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs` — the leg 2 example-surface-absent test [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:134], the leg 3 declared-mode failure case [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:153], and the leg 1a Webflow-map-removed test [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:165].
- `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs` — the both-surface wording case [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs:113] and the registry-count cases [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs:231].
- Live-tree inputs the edge sweep depends on: `ROUTER.md` map headings at lines 119, 155 and 200; `mode-registry.json` surface modes at lines 62, 80 and 99 (three declared today); `.skilled/skills/sk-code/` still ships `sk-code-webflow`, `sk-code-obsidian` and `sk-code-opencode`.
- Release surfaces re-read for the stale-doc re-adjudication: `sk-code-opencode/SKILL.md:175`, `sk-code-opencode/scripts/README.md:13`, `sk-code-opencode/assets/scripts/README.md:77`.
- `git show --stat b6eef4ebbb` and the two guard diffs, to bind each edge case to a changed hunk.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R5-P2-001 [P2] First-map prose anchor can silently skip a half-removed map section

- **Case:** ROUTER.md where a map heading is removed but part of its body survives before the next `## N. ... MAP` heading. The scan window now starts at the next surviving heading [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:129], so any `` `webflow/...md` `` claim left in the orphaned body is never required to be routed. Deleted the exact heading only, the previous anchor (`md.indexOf('## 4. WEBFLOW MAP')`) returned `-1` and the leg reported the explicit "section anchors not found" problem [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:130]; the tolerance change converts that loud failure into a possible silent pass.
- **Evidence:** the regression test exercises only the fully-replaced shape — its synthetic ROUTER.md jumps from `## 3. LOAD TIERS` straight to `## 5. OPENCODE MAP` with no leftover body [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:165]. The doc-claims guard is no backstop for the skipped span: `bases()` has no arm for a `webflow/`-prefixed backticked ref (neither `PACKET_RELATIVE` nor `HUB_RELATIVE` matches it), and `RETIRED_NAMES` match only `code-webflow` word forms, not `webflow/...` paths [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:29]. Paths written as markdown links would still be caught by link resolution; backticked paths, the form the prose scan itself expects, would not.
- **Counterevidence sought:** the documented removal replaces whole sections — the commit's own verification ("removal copy … with the Webflow map removed") and the leg 1a test both operate on section replacement, not heading-only deletion. The case requires an inconsistent intermediate state, and its failure direction is a missed documentation lint, never a broken route that runs.
- **Alternative explanation:** the anchor is intentionally a "first heading present" rule, and the leftover body is authoring debt the removal procedure owns; a stricter anchor would re-break the removal tolerance the commit exists to add.
- **User impact:** a half-cleaned ROUTER.md can keep telling readers to open `webflow/...` docs that no longer exist while the guard reports PASS; detection is a missing lint, not a runtime failure.
- **Finding class:** instance-only.
- **Scope proof:** `proseExplicitPaths` is the only consumer of `start`, and the only other anchor is the unchanged `end`; no test writes a heading-removed-body-kept fixture; the two test files are the only tests in `scripts/tests/`.
- **Recommendation:** keep the tolerant first-match anchor but have the scan begin at the heading *before* the first surviving map heading, or assert that the span between the load-tier section and the first map heading holds no path-shaped prose; alternatively extend the leg 1a test with a body-kept fixture.
- **Confidence:** high on the mechanics (read from the code and the old diff), medium that the half-removed state occurs in practice.
- **Downgrade trigger:** a repo test or the documented removal script proving that a map heading is never deleted without its body (then the case cannot arise).

### New evidence folded into existing P2s (no new id — same site and remedy)

- **R1-P2-002:** the spelling gap is wider than the original entry states. The regex matches only the word forms `two`–`ten`; `one surface`, digit forms (`2 surfaces`) and the hyphenated adjective `three-surface hub` are unmatched — and the two live docs still carrying the stale sentence use exactly the hyphenated form, so the guard cannot flag its own docs. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:46]
- **R1-P2-001:** a non-array `modes` value (object or string) throws at `.filter` even though the `|| []` guard is present; the same raw parse path. The doc-claims main loop has no per-check containment, unlike router-sync's `try/catch` that prints `threw:` [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:357].
- **R4-P2-001:** the exemption is a substring on a line whose "three" counts runtime agent directories, not hub surfaces. A fourth runtime registry (or any rewording) retires the exemption while the line stays true, and the guard would false-FAIL on it — same missing test, same row, carried inside R4-P2-001.

## Edge-Case Sweep Across the Four Guard Changes

| # | Guard change | Edge case tested | Outcome |
|---|--------------|------------------|---------|
| 1 | Surface lists filtered to packets present on disk [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:31] | Webflow absent | Covered by the leg 2 fixture; passes, parent-tier checks still enforce shared controls and own leaves [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:134] |
| 1 | Same | Both examples absent (union empty) | Read-only reasoning: parent-map paths that no child owns still report "outside the parent tier"; a packet path that exists but is not a directory fails loudly inside `readSkillRouter`. Fail-closed. |
| 2 | Archived-gold skip for undeclared modes [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:258] | Declared mode whose destination does not resolve | Still reported; the test asserts the `not-the-packet` destination fails while the removed webflow id is skipped [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:153]. A renamed contract code string fails the test loudly (carried SL-026). Ruled out. |
| 3 | First-map prose anchor [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:129] | Current tree | First match is `## 4. WEBFLOW MAP` at ROUTER.md:119, identical to the old literal — no live behavior change. |
| 3 | Same | No map heading at all | `start < 0` pushes the explicit problem and returns an empty set — loud, not silent. |
| 3 | Same | Heading removed, body kept | **R5-P2-001** — silent skip of the orphaned span. |
| 3 | Same | An earlier non-routing `... MAP` heading | Widens the window and adds checks, which fail loudly; never hides a path. |
| 4 | Registry-derived surface count + allowlist row [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs:324] | Malformed or non-array registry | Crash (non-zero exit), no per-check line — carried as R1-P2-001. |
| 4 | Same | Unusual count spelling | Unmatched spellings pass — carried as R1-P2-002 with the broadened spelling list above. |
| 4 | Same | Exempted checklist line under a changed runtime count | Exemption retires, legitimate line false-FAILs — folded into R4-P2-001. |

## Re-adjudication of Open P2s

| Finding | Verdict this iteration |
|---------|------------------------|
| R1-P2-001 malformed registry crashes the surfaces check | **P2 kept.** Raw `JSON.parse` and `.modes \|\| []` still throw on malformed or non-array input; no per-check containment in doc-claims. Crash exits non-zero, so the direction is fail-closed but unreadable; dev gate, advisory. |
| R1-P2-002 count check cannot flag stale one-surface wording | **P2 kept.** Broaden the case: `one`, digit forms and hyphenated `three-surface` all pass. On the current tree, declared=3 (`mode-registry.json` lines 62/80/99), so no live false pass; the gap shows after a removal, exactly this commit's scenario. |
| R2-P2-001 symlinked docs escape the walk | **P2 kept.** No new case or counterevidence this iteration; walk still uses `withFileTypes` while existence checks follow links. |
| R3-P2-001 spec.md change list omits README and Hermes copy | **P2 kept.** Metadata gap; the commit is immutable and no fix may land inside this review. |
| R3-P2-002 two live docs keep the fixed three-surface description | **P2 kept and re-confirmed.** `SKILL.md:175` and `scripts/README.md:13` still say "three-surface hub" while `assets/scripts/README.md:77` carries the registry wording; the hyphenated phrase is unmatched by the regex, so the guard cannot catch its own stale docs. Accidentally true today (declared=3), wrong the moment a surface is removed. |
| R3-P2-003 REQ-006 doctor clause has no acceptance-criteria expression | **P2 kept.** Pre-T012 state; no row added this iteration. |
| R4-P2-001 new surfaces allowlist row has no regression test | **P2 kept.** Still verified: no fixture writes `sk-code-opencode/assets/checklists/agent-authoring.md`; the row is inert today (declared=3) so only a test can pin it. Renumbering case folded in above. |
| R4-P2-002 count vocabulary duplicated; `both` fallback positional | **P2 kept.** Two adjacent representations at `:45`/`:46` and the unnamed `: 2` fallback at `:331`; single-sourcing would also shrink R1-P2-002's spelling surface. |

No severity escalation or downgrade. None of the eight is a correctness bug in the shipped guards' behavior on well-formed input; all are coverage, upkeep or metadata advisories, so the P2 floor holds.

## Traceability Checks

| Protocol | Status | Note |
|----------|--------|------|
| `spec_code` (core) | partial | Carried from iteration 3/4: REQ-001-006 and D1-D6 map to the changed files; spec.md's change-list omission is R3-P2-001; the commit is immutable, so the status cannot change within this review. |
| `checklist_evidence` (core) | partial | Carried: T001-T012, checklists and AC rows remain pending (expected pre-T012); R3-P2-003 tracks the REQ-006 doctor row. Correctness adds no new row-level gap. |
| `skill_agent` (overlay) | pass | Carried: no agent definition references the packet; the skill's frontmatter contract is intact. |
| `agent_cross_runtime` (overlay) | pass | Carried: the `.hermes` mirror differs from canonical only by its generated banner; both carry `1.2.4.0`. |
| `feature_catalog_code` (overlay) | notApplicable | Carried: no feature catalog artifact exists for this surface. |
| `playbook_capability` (overlay) | pass | Carried: OC-008's `expected_resources` exist and its guard list matches the shipped wrapper. |

## Search Ledger (summary)

| ID | Bug class | Disposition | Evidence |
|----|-----------|-------------|----------|
| SL-029 | prose_anchor_coverage | finding → R5-P2-001 | `start` regex `:129` vs the old exact literal; the leg 1a test's section-replaced fixture `:165`; doc-claims `bases()` has no `webflow/` arm |
| SL-030 | count_wording_spelling_gap | deferred | regex `:46` covers two–ten words only; `SKILL.md:175` uses the hyphenated form → already R1-P2-002 |
| SL-031 | registry_shape_robustness | deferred | raw parse `.modes \|\| []` `:324` vs router-sync per-leg `try/catch` `:357` → already R1-P2-001 |
| SL-032 | example_surface_removal_edge | ruled_out | filter `:31-34`; absent surfaces leave the child union empty but parent-tier rules still report; the absent-webflow fixture passes `:134` |
| SL-033 | orphan_skip_breadth | ruled_out | skip `:258`; declared-mode failures still report and the test asserts it `:153`; a code-string rename fails loudly |

## Scope Violations

None. No out-of-scope mutation was planned or attempted; all writes are confined to this review run directory.

## Verdict

PASS with advisories (`hasAdvisories=true`). No P0 or P1 findings. One new P2: the tolerant first-map anchor can silently skip a half-removed map body (R5-P2-001). The other eight open P2s were re-adjudicated and all retain P2; the four guard changes are correct on well-formed input, the archived-gold skip and disk filter keep the fail-closed direction, and the registry-derived count is right for every spelling it recognizes. The two user-facing advisories remain the stale three-surface sentences (R3-P2-002) and the spec change-list omission (R3-P2-001).

## Next Dimension

None — iteration 5 of 5. All four dimensions (correctness, security, traceability, maintainability) are covered; the loop's next step is synthesis and verification, not another review dimension. The fixes phase owns the nine open P2s.

Review verdict: PASS

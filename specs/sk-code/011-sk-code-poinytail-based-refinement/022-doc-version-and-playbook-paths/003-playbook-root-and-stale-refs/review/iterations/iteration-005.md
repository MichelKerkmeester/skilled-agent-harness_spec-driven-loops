# Review Iteration 5 — Maintainability

**Run:** 2026-10-12T10:01:23.529Z · **Iteration:** 5 of 5 · **Dimension:** maintainability · **Prior findings:** P0=0 · P1=0 · P2=4

## Dimension

Maintainability of the sk-doc 2.3.9.0 release surface: version consistency across the five hub files and the
changelog, the changelog's accuracy, comment durability, whether the changed docs' version lines were raised the
way the version tooling raises them, whether the test's printed assertion count is still honest, and whether any
edited wording would misread to a future reader.

## Files Reviewed

- `.skilled/skills/sk-doc/SKILL.md:5`, `.skilled/skills/sk-doc/ROUTER.md:11`, `.skilled/skills/sk-doc/description.json:4`, `.skilled/skills/sk-doc/hub-router.json:3`, `.skilled/skills/sk-doc/mode-registry.json:3` — the five-file version-authority set.
- `.skilled/skills/sk-doc/changelog/v2.3.9.0.md:1-31` — the new release entry.
- `.hermes/skills/sk-doc/SKILL.md:5` — the regenerated mirror.
- Both `013-live-activation/activation/sk-doc/manifest.json` copies (source and archived) — re-minted policy hash in both.
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:371-374,754-757` — the widened comment and the new root call.
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164-165,240` — the added root case and the suite summary line.
- Dispatch checks and tooling output: `compiled-route-sync.cjs --check`, `compiled-route-guard.cjs`, `sync-skills-hermes.cjs --check`, `frontmatter-version.mjs verify`, `frontmatter-version.mjs bump --base b4d4e90192 --check`, and a full run of the package test.

## Findings by Severity

### P0 — None.

### P1 — None.

### P2 — 1 new

**R5-P2-001 — The fixture-suite summary count is stale after the root backtick case.**

- **Claim.** The suite now prints `fixture suite: PASS (33 negative/positive assertions)` while the function holds 35 direct assertion sites. The summary computes `${required.length + 26}` (required.length = 7, so 33). The pre-image held 33 direct sites (24 `expect*` calls + 9 bare asserts) and also computed 33; commit 0099d2c6d7 added one `expectClean` and one `assert.deepStrictEqual` and left the constant at 26, so the honest constant is 28.
- **Evidence.** [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:240] is the summary line; [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:164] and [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:165] are the two added sites. The observed run of the file this iteration printed `(33 negative/positive assertions)` and exited 0. Site counts by revision: pre-image 24 direct `expect*` + 9 asserts = 33; current 25 + 10 = 35. The sibling summary inside `runContractRegressions` prints `8 assertions` and that function contains exactly its 8 sites, which fixes the file's counting convention as site count.
- **Counterevidence sought.** (a) A different counting rule for `run()` (runner invocations, or `expect*` calls only) would explain the constant: neither fits, because the pre-image 33 matched nowhere else and the contract-regressions print matches site count. (b) A deliberate pinning to a historical value: no comment or surrounding text records one, and the printed text says "negative/positive assertions", not a historical total.
- **Alternative explanation.** The number is cosmetic and no reader depends on it. Accepted as a mitigating factor, not a refutation: it is the suite's completion summary, and a reader or log scraper comparing suites under-counts the covered cases by two.
- **finalSeverity:** P2. **confidence:** 0.95. **downgradeTrigger:** a documented definition of the printed count that excludes the two new sites — then this is a wording note, not output drift.

## Maintainability Questions Answered

| Question | Answer | Evidence |
| --- | --- | --- |
| Version consistent across the five files and the changelog? | Yes — `2.3.9.0` in all five, in the changelog frontmatter, and in the Hermes mirror; both manifest copies re-minted identically. | Version sweep; `frontmatter-version.mjs verify` → `ok=3027 skip-no-frontmatter=2597`, exit 0. |
| Does the changelog describe the change accurately? | Yes — the capability sentence matches the single added call, the two "What's New" bullets match the shipped case, and "report-only" matches the `warnings` array and the observed exit-0 run. | Changelog :15, :23-24; [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:371]. |
| Are comments durable (no packet ids)? | Yes — the edited comment keeps the durable WHY, and a scan of every added code line found no spec path, `ADR-/REQ-/CHK-` id or iteration label. | [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:371]; scan output `clean`. |
| Are the doc version lines raised the way the tooling raises them? | Yes, as far as git state can show — `bump --base b4d4e90192 --check` reports `34 changed docs \| every changed body raised its version` (exit 0), and every changed versioned doc in the range carries a `+version:` hunk; the hub release raise follows the standard's hub-root rule (SKILL.md raises only at the release moment). Authorship (hook vs hand) is not observable from the repository, only the enforced invariant. | `bump --check` output; the BUMPED scan over all changed versioned docs. |
| Is the test's printed assertion count still honest? | No — see R5-P2-001. | Observed run output. |
| Any wording in the edited docs a future reader would misread? | None found in the edited docs. Observation, not a finding: `.skilled/skills/sk-doc/README.md:22` still carries `2.3.4.0` — its own per-doc edition under the versioning standard's scope table, unchanged in this range and pre-dating the release, so it sits outside the frozen diff. | README :22; versioning standard lines 29-30, 122. |

## Traceability Checks

- `core:spec_code` — pass (maintainability slice): the version-authority contract in `.skilled/skills/sk-doc/SKILL.md` (mirrored at `.hermes/skills/sk-doc/SKILL.md:22`) holds against observed values.
- `core:checklist_evidence` — not re-executed this iteration; carried by iterations 3-4 (RR/SR rows, CHK-030).
- `overlay:agent_cross_runtime` — pass: `sync-skills-hermes.cjs --check` → `PASS: 68 Hermes skill copies in sync`.
- `overlay:skill_agent`, `overlay:feature_catalog_code`, `overlay:playbook_capability` — partial: only the version-raise aspect is in this dimension; their content behaviour was iterations 2-4's scope.

## Verdict

PASS, advisories only. No P0/P1 this iteration; one new P2. The release surface is internally consistent — versions, changelog, comments, mirrors and tooling invariants all hold; the single drift is the test suite's own summary number. Running findings after this iteration: 5 P2 (4 carried, 1 new), 0 resolved.

## Next Dimension

None — iteration 5 of 5. All four dimensions have coverage; the run proceeds to synthesis with the five open P2 advisories.

Review verdict: PASS

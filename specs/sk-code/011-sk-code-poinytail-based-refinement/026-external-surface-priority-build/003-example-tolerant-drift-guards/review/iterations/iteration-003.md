# Iteration 003 — Traceability

**Run:** review-i1-g1 · **Session:** 2026-10-13T05:58:44.591Z · **Generation:** 1 · **Scope class:** standard
**Target:** commit `b6eef4ebbb` — "fix(sk-code-skilled): let the drift guards pass after an example surface is removed"
**Dimension under review:** D3 traceability (core: `spec_code`, `checklist_evidence`; overlay: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`)

## Dimension

Traceability of the commit and the phase packet: do the frozen decisions (D1-D6), the spec requirements (REQ-001-006) and the acceptance criteria account for every changed file, and does every shipped description of the changed guards still match the code they describe? The iteration read the commit diff and message, both SKILL.md copies (cross-runtime parity), the three guard/readme descriptions, the changelog, and the five phase docs, then swept the skill for prose that still carries the pre-change rule vocabulary. Read-only: no reviewed file was modified.

## Files Reviewed

- Commit `b6eef4ebbb` — full diff (8 files, +134/-17), commit body and trailers.
- `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` — `:175` (doc-claims description), version frontmatter.
- `.hermes/skills/sk-code-skilled/SKILL.md` — `:180` (generated copy of the same sentence), version frontmatter; whole-file diff against canonical.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md` — `:77` (rewritten by the commit), version frontmatter.
- `.skilled/skills/sk-code/sk-code-skilled/scripts/README.md` — `:13` (guard summary), `:21`, `:23`.
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` — `:45-46` (wording patterns), `:324-332` (registry-derived count).
- `.skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.4.0.md` — claims vs the diff hunks.
- Phase docs: `spec.md` (`:86-95`, `:116`), `plan.md` (`:76`), `tasks.md`, `acceptance-criteria.md` (`:59`), `goal.md`.
- Cross-references: `.skilled/skills/sk-code/SKILL.md:40`, `.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:144`, `.skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/authoring-verification/verification-alignment.md` (OC-008), agent-directory reference sweep.

## Findings by Severity

### P0

None.

### P1

None.

### P2

#### R3-P2-001 [P2] spec.md's Files to Change omits the README and the Hermes copy the commit updates

- **Case:** the commit changes `assets/scripts/README.md` (version `1.0.0.8` → `1.0.1.0` plus the `verify-doc-claims.cjs` row rewrite) and `.hermes/skills/sk-code-skilled/SKILL.md` (version line), but the frozen change list in [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/spec.md:86] names five rows and neither path; [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/plan.md:76] likewise names only "SKILL.md and changelog".
- **Evidence:** `git show --stat b6eef4ebbb` lists eight files; the only ones outside the spec table are the assets README and the generated Hermes mirror. The commit body already records both as intentional ("the scripts README row, and ... the regenerated Hermes copy"), so the implementation knew about them while the planning docs do not.
- **Counterevidence sought:** could the spec's release row cover them? Row 5 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/spec.md:94]) names `.skilled/.../SKILL.md` and `changelog/` only.
- **Alternative explanation:** folder READMEs and generated mirrors are routine release collateral; a Files to Change table need not enumerate generated output. The README is not generated, though, and it is the one file the guard-row rewrite made stale-able.
- **User impact:** an implementer following the frozen list literally ships the D4 change without the README row that explains it; the packet's own CHK-040 sync will be the last net. No runtime impact.
- **Finding class:** class-of-bug (spec.md and plan.md carry the same incomplete surface list).
- **Scope proof:** the eight-file stat minus the five listed change targets leaves exactly these two paths; no other unlisted file exists.
- **Recommendation:** during T012/CHK-040, add a row for `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md` and note the generated Hermes mirror on the release row.
- **Confidence:** high.
- **Downgrade trigger:** a decision record declaring generated mirrors and folder READMEs outside the Files to Change contract.

#### R3-P2-002 [P2] Two live docs still describe the surfaces rule as a fixed three-surface check

- **Case:** after D4 the doc-claims `surfaces` rule derives its count from `mode-registry.json` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:324], yet [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:175] says "every surface count matches the three-surface hub" and [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/README.md:13] repeats it. The commit rewrote the same sentence to the registry phrasing in exactly one of its three live sites: [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md:77].
- **Evidence:** the assets README diff shows the old text "matches the three-surface hub" replaced by "matches the surface modes in `mode-registry.json`"; the other two sites are untouched by the diff. The generated Hermes copy carries the stale sentence at [SOURCE: .hermes/skills/sk-code-skilled/SKILL.md:180].
- **Counterevidence sought:** can the guard catch its own stale description? No: the wording pattern requires `N surfaces` unhyphenated [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:46], and "three-surface hub" does not match, so the sentence is invisible to the guard it describes.
- **Alternative explanation:** "three-surface hub" may describe the operator's actual hub (which is three), not the rule. But the sentence's subject is what the guard checks, and the adopter who removes a surface is the audience this release exists for.
- **User impact:** an adopter reads SKILL.md or the scripts README and concludes the completion gate still requires three surfaces — the exact misconception D4 removes. Documentation-only; guard behavior is correct.
- **Finding class:** class-of-bug (one sentence, two live sites, plus a generated mirror).
- **Scope proof:** `rg -n "three-surface|three surfaces"` over `.skilled/skills/sk-code` returns the updated row plus these two sites; the hub's designated surface-count sentence at `.skilled/skills/sk-code/SKILL.md:40` is a separate, correct statement about the hub itself.
- **Recommendation:** rephrase both sites to the assets README's registry-derived wording, then regenerate the Hermes mirror via its sync script.
- **Confidence:** high on the text, medium on impact.
- **Downgrade trigger:** a documented decision scoping D4's "no text" clause to `verify-doc-claims.cjs` only.

#### R3-P2-003 [P2] REQ-006's doctor clause has no acceptance-criteria expression

- **Case:** REQ-006 bundles three conditions — tests fail-before/pass-after, one release, and the sk-code doctor's 13d passing [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/spec.md:116]; AC-006's Then clause covers only tests and release [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards/acceptance-criteria.md:59].
- **Evidence:** AC-006's Verification cell cites `goal.md` criteria 3 and 5; the doctor check lives in criterion 1, which is cited by AC-001, not AC-006.
- **Counterevidence sought:** closure is not wholly unguarded — `check-goal.cjs` gates every goal criterion and criterion 1 runs `parent-skill-check.cjs`, and the commit's Verification block already reports 13d PASS. The gap is row-level: REQ-006's own criterion is narrower than its requirement.
- **Alternative explanation:** acceptance rows may deliberately test one composite outcome per requirement without mirroring every clause.
- **User impact:** someone verifying AC-006 alone could mark REQ-006 Met without rerunning the doctor; the evidence mapping is ambiguous rather than wrong.
- **Finding class:** instance-only (single row rewrite).
- **Scope proof:** all six AC rows were read; only AC-006 maps REQ-006.
- **Recommendation:** during T012, extend AC-006's Then clause to include the doctor 13d check, or cite `goal.md` criterion 1 there.
- **Confidence:** high on the text, medium on impact.
- **Downgrade trigger:** a documented decision that acceptance rows need not mirror every clause of the requirement they map.

### Carried Findings

R1-P2-001 (unguarded registry parse), R1-P2-002 (count vocabulary starts at two), R2-P2-001 (symlink walks vs existence checks): no status change, no new traceability angle. All three remain open for the fixes phase after the review loop.

## Traceability Checks

| Protocol | Status | Note |
|----------|--------|------|
| `spec_code` (core) | partial | REQ-001-006 and D1-D6 map to the eight changed files and four tests; the change list omissions are R3-P2-001. The commit's `Spec:` trailer is correct and the changelog matches the diff hunk by hunk. |
| `checklist_evidence` (core) | partial | T001-T012, the Verification Checklist and all AC rows are still unchecked/Unmet and `implementation-summary.md` does not exist — the expected pre-T012 state. The commit Verification block carries provisional evidence (wrapper exit 0, 22/22 tests, doctor 13d PASS, removal copy 5/5). R3-P2-003 notes the one row-mapping gap. |
| `skill_agent` (overlay) | pass | No agent-definition file under `.pi`, `.opencode`, `.claude`, `.codex`, `.cursor` or `.hermes` references this packet; the skill is consumed through its own frontmatter contract, which is intact and version-consistent. |
| `agent_cross_runtime` (overlay) | pass | The `.hermes` copy differs from canonical only by its generated banner; both carry `version: 1.2.4.0`. The stale sentence at `.hermes/.../SKILL.md:180` is a faithful mirror of canonical `:175` (R3-P2-002), so the fix belongs in canonical plus a regeneration. |
| `feature_catalog_code` (overlay) | notApplicable | No feature catalog artifact exists for this surface: the skill root holds none and `benchmark/` contains only `reports/`. |
| `playbook_capability` (overlay) | pass | OC-008's `expected_resources` both exist; its guard list and `.skilled/.../references/shared/alignment-verification-automation.md:144` still match the shipped wrapper and four guards. No stale capability claim found. |

## Search Ledger (summary)

| ID | Bug class | Disposition | Evidence |
|----|-----------|-------------|----------|
| SL-014 | spec_code_drift | finding → R3-P2-001 | commit stat vs `spec.md:86-95` and `plan.md:76` |
| SL-015 | stale_doc_claim | finding → R3-P2-002 | `SKILL.md:175`, `scripts/README.md:13` vs the rewritten `assets/scripts/README.md:77` and `verify-doc-claims.cjs:324` |
| SL-016 | acceptance_gap | finding → R3-P2-003 | `spec.md:116` vs `acceptance-criteria.md:59` |
| SL-017 | cross_runtime_divergence | ruled_out | `.hermes` diff against canonical is the generated banner only; versions equal |
| SL-018 | catalog_mismatch | not_applicable | no catalog artifact for the surface |
| SL-019 | playbook_drift | ruled_out | OC-008 resources exist; guard capability text matches the wrapper |
| SL-020 | stale_version_reference | ruled_out | `1.2.3.0` occurs only inside its own changelog file |
| SL-021 | commit_metadata_drift | ruled_out | `Spec:` trailer present, no Co-Authored-By, exactly one new changelog file |

## Scope Violations

None. No out-of-scope mutation was planned or attempted; all writes are confined to this review run directory.

## Verdict

PASS with advisories (`hasAdvisories=true`). No P0 or P1 findings; three new P2 traceability advisories. The commit's metadata, changelog and cross-runtime mirror are faithful; the core spec mapping is complete except the two unlisted change paths, and two live descriptions of the surfaces rule lag the D4 change that the assets README already reflects.

## Next Dimension

Maintainability (D4): the new comments' durability under the Comment Hygiene rule, readability of the three router-sync hunks, and release/doc upkeep cost left open by R3-P2-001 and R3-P2-002.

Review verdict: PASS

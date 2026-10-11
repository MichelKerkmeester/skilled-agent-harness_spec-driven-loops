# Iteration 001 -- Dimension: Correctness

## Dispatcher
- Mode: review; iteration 1 of 5; focus correctness; sessionId r4-t4-review-2026-10-10T21-18Z; generation 1; lineageMode new; stopPolicy max-iterations.
- Target: main..HEAD, 8 commits: e6b0297bcf, 45cb464be8, caafc08377, 99c133fd5a, 837c8e1629, cc1e6baba1, ccf25fdd56, c2fcd2d1e3.
- Persona loaded: .skilled/agents/deep-review.md; severity doctrine loaded from review-core.md before classification.
- Budget profile: verify; mechanical population audits preferred over per-file sampling where the file count allowed it.

## Files Reviewed
- Bulk scripts read in full: 002-retroactive-removal/scratch/remove_template_anchor.py; 003-feature-catalog-findings/scratch/sync_leaf_frontmatter.py, link_phantom_rows.py, remove_packet_history_lines.py, normalize_validation_types.py; 004-leftover-template-comments/scratch/remove_leftover_template_comments.py; 005-changelog-version-keys/scratch/add_changelog_version_keys.py; 007-sk-code-script-kebab-names/scratch/rename_kebab_scripts.py.
- Renamed surface: assets/scripts/verify-router-sync.cjs (require of ./router-replay-lib.cjs at :9), verify-doc-claims.cjs and their two tests (require/citation checks), scripts/run-all-drift-guards.sh:30-66, sk-code/leaf-manifest.json:55-59, sk-code-opencode/SKILL.md:187, assets/scripts/README.md and scripts/README.md.
- Population audits: per-file numstat histograms for all 548 catalog files in 45cb464be8, all .md files in 99c133fd5a, all changelog files in caafc08377, and a removed-line grep over all catalog files in ccf25fdd56.
- Sampled diffs: 6 of 548 catalogs (45cb464be8); 4 of 129 files (99c133fd5a); 4 of 227 changelog paths (caafc08377); 7 of 485 paths (ccf25fdd56).
- Scripted checks: all 761 tracked changelog files for version-key presence, duplicate keys and SKILL.md-vs-newest-entry parity; Hermes-vs-skilled SKILL.md version parity; 61 added .md link targets resolved on disk; repo-wide git grep for the three old snake_case names.
- Phase docs: 003, 004, 005, 006 and 007 implementation summaries; 005 and 006 specs; review config, findings registry and strategy read before analysis.

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **Nine older changelog entries in the sweep-touched system-deep-loop/runtime unit still lack a version key** -- .skilled/skills/system-deep-loop/runtime/changelog/v1.0.0.0.md:1-11 -- The phase 5 handoff sentence says no changelog entry in the touched skills lacks a version key, and the commit message says every older changelog entry got one. The runtime subtree is one of the 27 units whose feature-catalog files phase 2 swept (55 files, for example feature-catalog/council/adjudicator-verdict-scoring.md), and this branch did touch its changelog: newer entries were added by 45cb464be8 and ccf25fdd56. Entries v1.0.0.0 through v1.8.0.0 (9 files) carry the standard five frontmatter keys but no version key.
- Case: A reader trusts the phase 5 handoff sentence or the commit message and assumes every older entry in a swept unit is keyed, but .skilled/skills/system-deep-loop/runtime/changelog/v1.0.0.0.md still has no version key.
- Evidence: frontmatter at :1-11 closes without a version key [SOURCE: .skilled/skills/system-deep-loop/runtime/changelog/v1.0.0.0.md:1]; same shape at [SOURCE: .skilled/skills/system-deep-loop/runtime/changelog/v1.8.0.0.md:1]; phase 2 removed the marker from 55 runtime catalog files (git show --name-only 45cb464be8 | grep -c system-deep-loop/runtime/feature-catalog); handoff line [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/spec.md:30]; declared 217-file population at [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/spec.md:79].
- User impact: A residual metadata inconsistency in a subtree the strict package validator never checks; no reader parses the key, so runtime behavior is unaffected.
- Finding class: instance-only (nine files in one unit).
- Scope proof: scripted scan of all 761 tracked changelog files finds exactly 9 missing keys inside phase 2 sweep units, all in system-deep-loop/runtime; the other 26 sweep units have 0 missing. The other 178 missing files sit in units phase 2 did not touch (cli-codex and siblings, .skilled/changelog) and are outside the phase 5 scope boundary.
- Affected surface hints: ["changelog frontmatter", "phase 5 handoff wording"]
- Recommendation: Key the 9 runtime entries with add_changelog_version_keys.py (they have frontmatter, so the script handles them), or amend the handoff sentence and commit wording to scope keying to package-validated units.
- Alternative explanation and downgrade trigger: Phase 5 reads as scoped to package-validated skills and modes; the runtime subtree has no SKILL.md, so it may have been excluded by design rather than missed. That bounds the impact and keeps this at P2. If phase documentation names runtime as out of scope, this collapses to claim wording only and remains P2.

## Traceability Checks
- spec_code: PASS -- per-commit claims verified independently. 45cb464be8: every one of the 548 catalog files is 0 added / 2 deleted lines, the marker plus its adjacent blank, with 0 removed lines outside that pair. caafc08377: 217 modified changelog files are each 1 added / 0 deleted, and 10 new entries are 29/0. 99c133fd5a: 98 marker lines removed (97 in .skilled, plus the documented 1 Hermes mirror). ccf25fdd56: 110 removed packet-history lines all carry the three retired labels. cc1e6baba1: five renames R096-R100 and the runner and manifest cite the new names. e6b0297bcf: templates and the per-feature checklist no longer contain the marker.
- checklist_evidence: PASS -- phase verification tables corroborated by independent counts. Phase 2 report JSON: files_changed 548, markers_removed 548, inline 0. Phase 4: 97 files / 194 deleted lines (numstat shows 95 files at 0/2 plus the two documented heading-case edits). Phase 5 receipt: changed 217, already_had 145, no_frontmatter 0. Phase 7: 5 renames, references intact.
- feature_catalog_code: PARTIAL -- the catalog validator was not rerun (known environment gap: 3 expected fails on the unbuilt sk-vision plugin; rerunning repo tooling is outside iteration constraints). Phase 3's 761-to-15 outcome is internally consistent with the known 3 fail + 12 warn tier, and the documented decision to keep those 15 intentional findings is recorded in the phase 3 summary.
- skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration; correctness focus, no agent or playbook content read beyond integration references.

## Integration Evidence
- scripts/run-all-drift-guards.sh:30-31 and :54-66 reference verify-router-sync.cjs and verify-doc-claims.cjs at their new paths [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:30].
- leaf-manifest.json:55-59 lists all three kebab-case assets [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:55].
- verify-router-sync.cjs:9 requires ./router-replay-lib.cjs, and that file exists [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:9].
- verify-router-sync.test.cjs:37 checks for the new script names [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:37].
- Repo-wide git grep for router_replay_lib, verify_doc_claims and verify_router_sync (excluding specs) finds only three historical changelog files, which phase 7 documents as intentionally untouched history.

## Edge Cases
- Commit order differs from phase numbering: phase 5 work landed before phase 4 and phase 3. The phase 5 touched-unit scope is therefore the phase 2 sweep set; missing keys in phase-4-touched units (cli-codex and siblings) are outside its declared scope.
- The packet-root scratch/bump_units.py produced the version bumps; its outcomes were verified at tree level (1/0 changelog diffs, version parity) rather than by reading that script, which is not in the declared scope-file list.
- Each commit regenerates trigger-index.json (about 40k changed lines per commit), which masks raw commit sizes; it is a generated artifact with its own check tooling and is not part of this packet's authored edits.
- Worktree carries uncommitted packet-doc modifications (packet spec.md, graph-metadata.json) and the untracked review directory; both are outside the reviewed commit range.
- Two removed Source phase lines in ccf25fdd56 contain a doubled slash in the recorded path; they were retired metadata and were deleted as intended.

## Confirmed-Clean Surfaces
- remove_template_anchor.py: only whole-line markers are removed, and the following blank line is removed only when a blank line precedes the marker; files with inline copies are skipped whole and counted (inline 0). The exit-1 path never fired.
- remove_leftover_template_comments.py: 95 of 97 .skilled target files show 0/2 numstat, the two others carry the documented heading-case fix; the residual-marker guard never triggered.
- add_changelog_version_keys.py: exactly one inserted line per file, zero deletions; no duplicate version keys anywhere in the tracked tree; name-to-key equality holds.
- link_phantom_rows.py: all 61 added .md link targets resolve on disk; escape-aware pipe and link handling read sound.
- rename_kebab_scripts.py: five tracked renames, 58 replacements across its 15 declared files; no live snake_case reference remains.
- sync_leaf_frontmatter.py and normalize_validation_types.py: multi-line-value and escaped-pipe guards hold; sampled diffs show only the intended key or cell rewrites, and the manual follow-ups are documented in the phase 3 summary.
- Version hygiene: 0 SKILL.md-vs-newest-changelog mismatches and 0 duplicate changelog versions across 61 changelog-owning units; 0 Hermes-vs-skilled SKILL.md version mismatches.

## Ruled Out
- Accidental content loss in bulk edits: 0 removed non-marker, non-blank lines across all 548 catalog files in 45cb464be8; the 12 non-marker deletions in 99c133fd5a are 6 old version lines, 2 uppercased headings and paired replacements; ccf25fdd56 removals decompose into the four script behaviors plus documented manual repairs.
- Broken references to the old snake_case script names: none outside three historical changelog entries, intentionally preserved.
- Version and changelog drift: no mismatches, no duplicates, no skipped versions in the current tree; the one older entry phase 7 found was keyed in that commit.
- Marker readers: no validator, router or script reads the removed comment; no live template comment remains outside changelog prose and one BINDING placeholder string.
- Overengineering: the eight one-shot migration scripts live in phase scratch folders, add no dependency or abstraction, and are proportionate to the bulk edits; the commits add no runtime code paths.
- Packet-history removal false positives: all 110 removed lines carry the retired labels (Feature ID, Source phase, Origin packet); none is a table row or prose line with other content.

## Next Focus
- Dimension: security. Focus area: the three renamed .cjs assets and the drift-guard wrapper (require resolution, path handling, spawn and quoting), plus the --apply write paths of the bulk scripts. Rotation status: first rotation after D1 correctness. Blocked or productive carry-forward: none blocked; the population-audit approach was productive and should be reused for reference integrity. Required evidence: direct reads of the guard scripts and a grep for shell injection surfaces in the wrapper.

## Next Dimension
Security (D2), starting from the integration surfaces named above.

## SCOPE VIOLATIONS
None. All writes stayed inside the review packet (iteration narrative, delta, strategy) and every other path was read-only.

## Verdict
PASS with one advisory P2 (hasAdvisories=true). No active P0 or P1; no binary quality gate failed. Evidence and scope gates pass; coverage covers the assigned correctness dimension.

Review verdict: PASS
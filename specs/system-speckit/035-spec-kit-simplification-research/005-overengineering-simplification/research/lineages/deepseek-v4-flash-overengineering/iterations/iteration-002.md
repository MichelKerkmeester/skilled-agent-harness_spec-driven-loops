# Iteration 002 — KQ-R1b: template-name resolution + LOC scorer note propagation

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | run 2 | focus: did the 011 template-name and level-scorer repairs reach every surface — residual symbolic `level_contract_*`, LOC "soft guidance" vs AGENTS.md scorer mandate, and does the level contract manifest agree with the workflow required-files claim.
Evidence reads: greps + `sed` over `.opencode/commands/speckit/**`, `templates/spec-kit-docs.json` (python dump), `runtime/lib/templates/level-contract-resolver.ts` (128-240, 291 lines total), `runtime/cli/utils/template-structure.js` (956 lines, grep 62/149/167-227/377-381/903-929), `runtime/cli/rules/check-files.sh` (30-110), `runtime/cli/rules/check-ac-closure.sh` (grep), `assets/level-decision-matrix.md`, `assets/template-mapping.md`, `references/workflows/quick-reference.md`, `references/templates/template-guide.md`, `feature-catalog/tooling-and-scripts/template-composition-system.md`. Reads cost: 8 bash calls. No node/validate/git.

## Positive confirmations (011 holds here)

- All template paths referenced by the 8 workflow assets resolve on disk (0 MISS across `templates/[a-z/]*.tmpl` extraction).
- No symbolic `level_contract_*` doc names remain in `.opencode/commands/speckit` or the skill docs — the only `level_contract` hits are real code identifiers (`create.sh` calling `resolve_level_contract`, `template-utils.sh:244` defining it, feature-catalog describing the helper at `template-composition-system.md:48` which is code-accurate).
- `recommend-level.sh` is genuinely wired: 6 asset sites call it (`speckit-complete-auto.yaml:110,237`, `-confirm.yaml:62,210`, `speckit-implement-auto.yaml:170`, `-confirm.yaml:134`, `speckit-plan-auto.yaml:48,199`) with the "scores LOC, file count and risk and decides the level; when its answer and judgment differ, go higher" note.

## What still contradicts

**LOC "soft guidance" residue — 5 files, 9 lines, all first-read surfaces:**
- `references/workflows/quick-reference.md:54` — "**LOC as soft guidance:** <100 LOC suggests Level 1 …" (the LEVEL DECISION SHORTCUTS section, the skill's ALWAYS-routed first reference).
- `references/workflows/quick-reference.md:581` — "**LOC thresholds are soft guidance** - use judgment" (Enforcement section).
- `references/templates/template-guide.md:104,151,203` — "(soft guidance)" appended to each LOC band.
- `assets/level-decision-matrix.md:302` — "**LOC as soft guidance (suggests level):**" + REQ-010 at `:327` — "LOC thresholds as soft guidance", *sourced from SKILL.md*.
- `assets/template-mapping.md:297` — "### Step 1: Determine Level: Use LOC as soft guidance + complexity/risk factors" — no scorer mentioned at all.

vs `AGENTS.md:385` — "It exists specifically to replace soft LOC guidance, so do not eyeball a line count" — and the post-011 asset notes ("…and decides the level"). None of the 5 reference/asset files mentions `recommend-level.sh` (grep: only SKILL.md:112 carries it, once, in a resource list). The directory `assets/` (level-decision-matrix, template-mapping) is the agent-facing decision aid; both teach eyeballing.

**level-decision-matrix.md is internally split between both contracts:**
- New contract: `:45` ("Level 1 + acceptance-criteria.md; verification checklist inside tasks.md"), `:53`, `:262` ("Add acceptance-criteria.md and the tasks.md checklist"), `:149,177` (tasks.md checklist evidence rules).
- Old contract: `:116-119` (four example rows all say "L1 + checklist" for Level 2), `:327` (REQ-007 "Level 2 verification requirements (checklist)").

**feature-catalog still describes the retired level document set:**
- `feature-catalog/tooling-and-scripts/template-composition-system.md:32` — "Level 1 packets receive the baseline four documents. **Level 2 adds `checklist.md`.** Level 3 and Level 3+ add `decision-record.md` …" — the retirement left the catalog's level-contract paragraph untouched.
- Same file's point 6 — "Validators consume the same Level contract instead of carrying a separate file matrix. Missing-file, section, header, Level-match, and template-source checks therefore evaluate the same document set that scaffolding writes" — is loose: FILE_EXISTS evaluates `requiredCoreDocs+requiredAddonDocs` (3 docs for L2 via `template-structure.js:192`), AC_CLOSURE gates acceptance-criteria.md separately (`check-ac-closure.sh:221-255`), and the workflow lists 4 required files (`speckit-complete-auto.yaml:228-233`). Three gatekeepers, three sets.

**The manifest contradicts the 011 "match the manifest" claim:**
- `templates/spec-kit-docs.json` `levels["2"]`: `requiredCoreDocs=[spec,plan,tasks]`, `requiredAddonDocs=[]`, `lazyAddonDocs` includes decision-record.md but NOT acceptance-criteria.md; `documents` map includes acceptance-criteria.md `{template, owner:"author", creationTrigger:"scaffold", absenceBehavior:"hard-error"}` and `levels[2].sectionGates["acceptance-criteria.md"]` gates `[2,3,3+]`.
- `runtime/cli/utils/template-structure.js:167-192` (the FILE_EXISTS helper) returns only core+addon; so FILE_EXISTS at Level 2 = 3 docs. AC_CLOSURE carries the AC requirement with a creation-cutoff (`check-ac-closure.sh:250-255`: packets created after the cutoff are hard-required; before → advisory).
- `creationTrigger` and `absenceBehavior` have **zero consumers** in `runtime/` (grep over runtime for both keys: 0 hits) — dead fields on all 16 `documents` entries, while the resolver emits `templateVersions` and template-structure.js has its own local doc→template map (`:62`).

## Findings

**F2-05 [P2 — remediation left the first-read surfaces behind] LOC "soft guidance / use judgment" survives in 5 reference/asset files while AGENTS.md:385 says the scorer exists to replace soft LOC guidance and the 011 asset notes say the scorer decides.**
- Where: `references/workflows/quick-reference.md:54,581`; `references/templates/template-guide.md:104,151,203`; `assets/level-decision-matrix.md:302,327`; `assets/template-mapping.md:297`.
- Cost: the level decision is the FIRST decision an agent makes; quick-reference.md is the skill's ALWAYS-routed resource and its §2 teaches eyeballing LOC with no mention of recommend-level.sh — an agent following it skips the scorer, picks the wrong level, and pays later in validation; 9 coordinated lines would each need fixing on any threshold change; maintenance of two contradictory level-selection teachings.
- Protects: the eyeball heuristic nowhere — the scorer subsumes it (AGENTS.md:385).
- Severity: P2 (doc-level adherence surface, not a behavior break).
- Recommendation: **merge** — replace each "soft guidance" line with "run `recommend-level.sh` (scores LOC, files, risk); go higher on disagreement" and drop the band lists or keep them as the scorer's input description only.

**F2-06 [P2 — one asset, two contracts] level-decision-matrix.md correctly carries the acceptance-criteria contract at :45,53,262 but its four worked examples (:116-119) and REQ-007 (:327) still say "L1 + checklist".**
- Where: `assets/level-decision-matrix.md:116-119,327` vs `:45,53,262`.
- Cost: an agent matching its example rows (auth-change → Level 2 "L1 + checklist") will scaffold the retired doc; the asset is per-requirement sourced from SKILL.md, so the wrong row is a sourced requirement, not a typo.
- Protects: nothing; the examples describe a document the contract no longer asks for.
- Severity: P2.
- Recommendation: **merge** — align the four examples and REQ-007 to "L1 + acceptance-criteria.md (verification checklist inside tasks.md)".

**F2-07 [P2 — catalog describes the retired level contract] feature-catalog template-composition-system.md:32 says Level 2 adds checklist.md; the catalog's own point 6 claims validators consume one shared level contract while three gatekeepers list three different sets.**
- Where: `feature-catalog/tooling-and-scripts/template-composition-system.md:32,39` (point 6); cross-checked against `template-structure.js:167-192` (FILE_EXISTS=3 docs), `check-ac-closure.sh:221-255` (AC gate, creation-cutoff-based), `speckit-complete-auto.yaml:228-233` (4 required files).
- Cost: catalog-first readers scaffold checklist.md for Level 2 (see F2-03 for the twin); the "same contract" claim is false today and misleads anyone reasoning about which validator catches what.
- Protects: nothing.
- Severity: P2.
- Recommendation: **merge** — fix :32 to acceptance-criteria.md and rewrite point 6 to name the three gatekeepers (FILE_EXISTS core set, AC_CLOSURE AC gate + cutoff, workflow required_files) as one authored contract with per-gate scope.

**F2-08 [P2 — dead metadata fields in the level contract manifest] `documents[*]` entries carry `creationTrigger` and `absenceBehavior` with zero runtime consumers; and `levels["2"]` omits acceptance-criteria.md from requiredAddonDocs while the workflow claims its required-files list "matches the manifest".**
- Where: `templates/spec-kit-docs.json` (documents ×16 with `{template,owner,creationTrigger,absenceBehavior}`; `levels["2"].requiredAddonDocs: []`); consumers grep for `creationTrigger`, `absenceBehavior` in `runtime/` = 0 hits; consumption claim at `speckit-complete-auto.yaml:228-233` + 011 summary ("Every level's required files now match the manifest").
- Cost: two dead fields × 16 entries = 32 values maintained with no reader (metadata rot risk); the "match the manifest" claim is true only if "manifest" means the workflow's own list — the actual manifest's L2 set is 3 docs (template-structure.js:192) so the workflow's 4-doc required_files diverges from it by design, undocumented.
- Protects: nothing (no consumer).
- Severity: P2.
- Recommendation: **remove** the dead fields (or wire one consumer); add one sentence to the workflow defining required_files as "authored contract, stricter than the scaffold set" so the divergence is documented rather than implicit.

## Ruled out / corrections

- "A fresh `create.sh --level 2` packet would fail FILE_EXISTS for missing acceptance-criteria.md": FALSE — FILE_EXISTS checks core+addon only (`template-structure.js:192`); AC presence is enforced by AC_CLOSURE with a creation cutoff, and by the workflow step. (Also explains why round one's 005 packet passed with authored-in-step AC.)
- "The 011 'match the manifest' phrasing means spec-kit-docs.json": FALSE per F2-08 — it matches the workflow's own declared list, not the manifest's level rows.
- The `template-utils.sh` fallback loader uses `node` for resolver fallback — irrelevant to evidence (never executed; reads only).

## Provisional counts

- LOC soft-guidance lines: 9 across 5 files (counted above).
- `level_contract` doc-name residue: 0 (assets + skill docs; only code identifiers remain).
- Dead manifest fields: `creationTrigger` + `absenceBehavior` ×16 documents.

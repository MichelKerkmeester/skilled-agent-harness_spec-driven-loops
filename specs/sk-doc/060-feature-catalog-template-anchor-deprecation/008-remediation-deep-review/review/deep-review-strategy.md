
# Deep Review Strategy - T4 commit range review

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Git commit range main..HEAD on branch worktrees/096-feature-catalog-anchor-deprecation: the 8 T4 commits e6b0297bcf, 45cb464be8, caafc08377, 99c133fd5a, 837c8e1629, cc1e6baba1, ccf25fdd56, c2fcd2d1e3. Before reviewing, read .skilled/agents/deep-review.md (your agent definition) and follow it as your persona. Inspect with: git log --oneline main..HEAD ; git show --stat <sha> ; git diff main..HEAD -- <path>. What the commits did: (1) stop the sk-create-feature-catalog mode stamping the <!-- sk-doc-template: skill_asset_feature_catalog --> comment and remove it from 548 catalog docs; (2) remove 97 leftover sk-doc-template comments from other skill docs; (3) add the version key to 217 changelog entries; (4) fix skill package findings on six units; (5) rename three sk-code-skilled scripts from snake_case to kebab-case (router_replay_lib.cjs, verify_doc_claims.cjs, verify_router_sync.cjs and their tests); (6) repair feature catalog validator findings 761 to 15; (7) version bumps with new changelog entries. Phase docs: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/00[1-7]-*/ (spec.md, tasks.md, implementation-summary.md, acceptance-criteria.md, scratch/*.py bulk scripts). Check: correctness of each bulk script, broken references to the old snake_case script names anywhere in the repo (tests, hooks, docs, workflows, drift-guard runner) via git grep, accidental content loss in bulk edits (a removed line that was not the marker or its blank line), version and changelog hygiene (SKILL.md version vs newest changelog file, duplicate or skipped versions), prevent-overengineering per .skilled/repo-rules/prevent-overengineering.md, and whether each phase matches its claims. Known environment gap, NOT a defect: sk-vision vision-runtime/dist is not built in this worktree, so 3 catalog validator fails on .opencode/plugins/sk-vision.js are expected. Sample with intent: the diff is about 1159 files; read each bulk script, the riskiest renames, and random docs per kind rather than everything.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Changing product code: this is a review only.
- The 3 catalog validator fails on .opencode/plugins/sk-vision.js, an environment gap (vision-runtime/dist not built).
- Commits outside main..HEAD.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: run all 5 iterations; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
Iteration 1 (correctness): population-scale mechanical audits made every headline claim an exact count; the only residual surfaced from a scripted scan of all 761 tracked changelog files.
- Mechanical diff audits over the full file population (per-file numstat histograms, removed-line greps): sampling replaced by exact counts (iteration 1)
- Security (iteration 2): reading every write path plus population checks (find for symlinks, git status, interpreter version) turned a vague follow-symlink concern into a precise latent-only finding with zero realized impact.
- Traceability (iteration 3): goal decisions and completion criteria tested against the commit graph; per-commit changelog-add counts gave exact receipts (27/5/10/6/2) and surfaced the phase-3 19-vs-20 and stale-criterion discrepancies.
- Maintainability (iteration 4): full added-entry population scan plus a 13-entry cross-commit sample cleared version-key hygiene; hub handoff records reconciled against HEAD hub versions; the .hermes sk-vision diff proven to be the generator transform rather than drift.

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Broken snake_case references**: `git grep` over the repo finds `router_replay_lib.cjs` / `verify_doc_claims.cjs` / `verify_router_sync.cjs` only in historical changelogs (`sk-code-skilled/changelog/v1.1.1.0.md`, `v1.2.0.0.md`, `v1.2.1.0.md`) and archived spec packets under `specs/sk-code/011-*`. The drift-guard runner, `scripts/README.md` and both test files use the kebab-case names; no live consumer is broken. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Broken snake_case references**: `git grep` over the repo finds `router_replay_lib.cjs` / `verify_doc_claims.cjs` / `verify_router_sync.cjs` only in historical changelogs (`sk-code-skilled/changelog/v1.1.1.0.md`, `v1.2.0.0.md`, `v1.2.1.0.md`) and archived spec packets under `specs/sk-code/011-*`. The drift-guard runner, `scripts/README.md` and both test files use the kebab-case names; no live consumer is broken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Broken snake_case references**: `git grep` over the repo finds `router_replay_lib.cjs` / `verify_doc_claims.cjs` / `verify_router_sync.cjs` only in historical changelogs (`sk-code-skilled/changelog/v1.1.1.0.md`, `v1.2.0.0.md`, `v1.2.1.0.md`) and archived spec packets under `specs/sk-code/011-*`. The drift-guard runner, `scripts/README.md` and both test files use the kebab-case names; no live consumer is broken.

### **Leaf frontmatter sync** — `divergent-convergence-mode.md` title/description equal root H3 at `feature-catalog.md:414-418`; `github-mcp-integration.md:3` equals root `:209`; `resource-map-emission.md:2` equals the newly added root H3 `:182-186`. Script semantics (root wins; multi-line values skipped) match the applied result. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Leaf frontmatter sync** — `divergent-convergence-mode.md` title/description equal root H3 at `feature-catalog.md:414-418`; `github-mcp-integration.md:3` equals root `:209`; `resource-map-emission.md:2` equals the newly added root H3 `:182-186`. Script semantics (root wins; multi-line values skipped) match the applied result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Leaf frontmatter sync** — `divergent-convergence-mode.md` title/description equal root H3 at `feature-catalog.md:414-418`; `github-mcp-integration.md:3` equals root `:209`; `resource-map-emission.md:2` equals the newly added root H3 `:182-186`. Script semantics (root wins; multi-line values skipped) match the applied result.

### **Linked phantom rows** — sampled root links resolve: `../../../../commands/deep/research.md`, `../references/convergence/convergence.md`, `../references/troubleshooting.md`, `devtools-parity/dom-inspection.md`, and the sk-git `references/gitkraken-mcp-integration.md` row (previously an em-dash placeholder row). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Linked phantom rows** — sampled root links resolve: `../../../../commands/deep/research.md`, `../references/convergence/convergence.md`, `../references/troubleshooting.md`, `devtools-parity/dom-inspection.md`, and the sk-git `references/gitkraken-mcp-integration.md` row (previously an em-dash placeholder row).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Linked phantom rows** — sampled root links resolve: `../../../../commands/deep/research.md`, `../references/convergence/convergence.md`, `../references/troubleshooting.md`, `devtools-parity/dom-inspection.md`, and the sk-git `references/gitkraken-mcp-integration.md` row (previously an em-dash placeholder row).

### **Marker in generated surfaces**: the only remaining `skill_asset_feature_catalog` string outside `specs/` is the mode's own `changelog/v1.0.2.0.md` (intentional release note) and a trigger-index fixture phrase. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Marker in generated surfaces**: the only remaining `skill_asset_feature_catalog` string outside `specs/` is the mode's own `changelog/v1.0.2.0.md` (intentional release note) and a trigger-index fixture phrase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Marker in generated surfaces**: the only remaining `skill_asset_feature_catalog` string outside `specs/` is the mode's own `changelog/v1.0.2.0.md` (intentional release note) and a trigger-index fixture phrase.

### **Marker removal (`e6b0297bcf`)** — both catalog assets now go H1 → `## 1. OVERVIEW`; the snippet checklist no longer requires the marker; `examples.md` §3 was reworded coherently. Population grep: 0 marker-bearing catalog files; no non-changelog mode file mentions the marker. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Marker removal (`e6b0297bcf`)** — both catalog assets now go H1 → `## 1. OVERVIEW`; the snippet checklist no longer requires the marker; `examples.md` §3 was reworded coherently. Population grep: 0 marker-bearing catalog files; no non-changelog mode file mentions the marker.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Marker removal (`e6b0297bcf`)** — both catalog assets now go H1 → `## 1. OVERVIEW`; the snippet checklist no longer requires the marker; `examples.md` §3 was reworded coherently. Population grep: 0 marker-bearing catalog files; no non-changelog mode file mentions the marker.

### **Packet-history removals** — sample removed only `- Feature ID: DAC-016`; the 110-line population deletion class was already ruled out in iteration 1 and was not re-entered. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Packet-history removals** — sample removed only `- Feature ID: DAC-016`; the 110-line population deletion class was already ruled out in iteration 1 and was not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Packet-history removals** — sample removed only `- Feature ID: DAC-016`; the 110-line population deletion class was already ruled out in iteration 1 and was not re-entered.

### **Stale paths / wording** — `.opencode/plugins/sk-vision.js` exists as a symlink; `.skilled/plugins` is itself a symlink to `../.opencode/plugins`, so the older `.skilled/plugins/sk-vision.js` spellings in `SKILL.md:208` and `README.md:126` name the same file — ruled out as a contradiction. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Stale paths / wording** — `.opencode/plugins/sk-vision.js` exists as a symlink; `.skilled/plugins` is itself a symlink to `../.opencode/plugins`, so the older `.skilled/plugins/sk-vision.js` spellings in `SKILL.md:208` and `README.md:126` name the same file — ruled out as a contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale paths / wording** — `.opencode/plugins/sk-vision.js` exists as a symlink; `.skilled/plugins` is itself a symlink to `../.opencode/plugins`, so the older `.skilled/plugins/sk-vision.js` spellings in `SKILL.md:208` and `README.md:126` name the same file — ruled out as a contradiction.

### **Type normalization** — mapping targets `Manual playbook`, `Automated test`, `Reference` are all members of `template-rules.json:650-663`; sampled cells (`| Manual |` → `| Manual playbook |`) rewrote correctly. Residual non-taxonomy-looking values (`Skill contract`, `Script`) sit in `| File | Layer | Role |` tables, outside the `| File | Type | Role |` column that `validate_document.py:1222` checks. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Type normalization** — mapping targets `Manual playbook`, `Automated test`, `Reference` are all members of `template-rules.json:650-663`; sampled cells (`| Manual |` → `| Manual playbook |`) rewrote correctly. Residual non-taxonomy-looking values (`Skill contract`, `Script`) sit in `| File | Layer | Role |` tables, outside the `| File | Type | Role |` column that `validate_document.py:1222` checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Type normalization** — mapping targets `Manual playbook`, `Automated test`, `Reference` are all members of `template-rules.json:650-663`; sampled cells (`| Manual |` → `| Manual playbook |`) rewrote correctly. Residual non-taxonomy-looking values (`Skill contract`, `Script`) sit in `| File | Layer | Role |` tables, outside the `| File | Type | Role |` column that `validate_document.py:1222` checks.

### **Version/changelog gap**: `sk-create-feature-catalog` changelog sequence is contiguous (`v1.0.1.2`, `v1.0.2.0`, `v1.0.3.0`, `v1.0.4.0`); every range-touched unit's `SKILL.md` version equals its newest changelog file (shell scan over the changed-unit set). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Version/changelog gap**: `sk-create-feature-catalog` changelog sequence is contiguous (`v1.0.1.2`, `v1.0.2.0`, `v1.0.3.0`, `v1.0.4.0`); every range-touched unit's `SKILL.md` version equals its newest changelog file (shell scan over the changed-unit set).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Version/changelog gap**: `sk-create-feature-catalog` changelog sequence is contiguous (`v1.0.1.2`, `v1.0.2.0`, `v1.0.3.0`, `v1.0.4.0`); every range-touched unit's `SKILL.md` version equals its newest changelog file (shell scan over the changed-unit set).

### Accidental content loss in bulk edits: 0 removed non-marker, non-blank lines across all 548 catalog files in 45cb464be8; the 12 non-marker deletions in 99c133fd5a are 6 old version lines, 2 uppercased headings and paired replacements; ccf25fdd56 removals decompose into the four script behaviors plus documented manual repairs. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Accidental content loss in bulk edits: 0 removed non-marker, non-blank lines across all 548 catalog files in 45cb464be8; the 12 non-marker deletions in 99c133fd5a are 6 old version lines, 2 uppercased headings and paired replacements; ccf25fdd56 removals decompose into the four script behaviors plus documented manual repairs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Accidental content loss in bulk edits: 0 removed non-marker, non-blank lines across all 548 catalog files in 45cb464be8; the 12 non-marker deletions in 99c133fd5a are 6 old version lines, 2 uppercased headings and paired replacements; ccf25fdd56 removals decompose into the four script behaviors plus documented manual repairs.

### agent_cross_runtime: PASS -- 32 .hermes mirrors updated in range; sk-vision diff is the generator transform (present at main too). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: agent_cross_runtime: PASS -- 32 .hermes mirrors updated in range; sk-vision diff is the generator transform (present at main too).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: PASS -- 32 .hermes mirrors updated in range; sk-vision diff is the generator transform (present at main too).

### agent_cross_runtime: PASS -- Hermes and authored copies agree for the sampled units (.hermes/skills/sk-create-feature-catalog/SKILL.md matches 1.0.4.0; .hermes matches all six hub versions and the phase-7 sk-code-skilled 1.2.2.0). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: agent_cross_runtime: PASS -- Hermes and authored copies agree for the sampled units (.hermes/skills/sk-create-feature-catalog/SKILL.md matches 1.0.4.0; .hermes matches all six hub versions and the phase-7 sk-code-skilled 1.2.2.0).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: PASS -- Hermes and authored copies agree for the sampled units (.hermes/skills/sk-create-feature-catalog/SKILL.md matches 1.0.4.0; .hermes matches all six hub versions and the phase-7 sk-code-skilled 1.2.2.0).

### Broken references to the old snake_case script names: none outside three historical changelog entries, intentionally preserved. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Broken references to the old snake_case script names: none outside three historical changelog entries, intentionally preserved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broken references to the old snake_case script names: none outside three historical changelog entries, intentionally preserved.

### checklist_evidence: PASS -- independent counts corroborate receipts (added changelog files 1/27/10/5/6/2/20/0; 217+145=362 keys; 13/13 one-patch rule; zero SKILL.md mismatches). Phase 3's 19-vs-20 remains R3-P2-003. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: checklist_evidence: PASS -- independent counts corroborate receipts (added changelog files 1/27/10/5/6/2/20/0; 217+145=362 keys; 13/13 one-patch rule; zero SKILL.md mismatches). Phase 3's 19-vs-20 remains R3-P2-003.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PASS -- independent counts corroborate receipts (added changelog files 1/27/10/5/6/2/20/0; 217+145=362 keys; 13/13 one-patch rule; zero SKILL.md mismatches). Phase 3's 19-vs-20 remains R3-P2-003.

### checklist_evidence: PASS -- phase verification tables corroborated by independent counts. Phase 2 report JSON: files_changed 548, markers_removed 548, inline 0. Phase 4: 97 files / 194 deleted lines (numstat shows 95 files at 0/2 plus the two documented heading-case edits). Phase 5 receipt: changed 217, already_had 145, no_frontmatter 0. Phase 7: 5 renames, references intact. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: checklist_evidence: PASS -- phase verification tables corroborated by independent counts. Phase 2 report JSON: files_changed 548, markers_removed 548, inline 0. Phase 4: 97 files / 194 deleted lines (numstat shows 95 files at 0/2 plus the two documented heading-case edits). Phase 5 receipt: changed 217, already_had 145, no_frontmatter 0. Phase 7: 5 renames, references intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PASS -- phase verification tables corroborated by independent counts. Phase 2 report JSON: files_changed 548, markers_removed 548, inline 0. Phase 4: 97 files / 194 deleted lines (numstat shows 95 files at 0/2 plus the two documented heading-case edits). Phase 5 receipt: changed 217, already_had 145, no_frontmatter 0. Phase 7: 5 renames, references intact.

### checklist_evidence: PASS for phase-7 verification rows re-checked this iteration (runner references, test spawn form); the phase-5 receipt (217 changed / 145 already_had / 0 no_frontmatter) remains consistent with the tracked changelog population audited in iteration 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence: PASS for phase-7 verification rows re-checked this iteration (runner references, test spawn form); the phase-5 receipt (217 changed / 145 already_had / 0 no_frontmatter) remains consistent with the tracked changelog population audited in iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PASS for phase-7 verification rows re-checked this iteration (runner references, test spawn form); the phase-5 receipt (217 changed / 145 already_had / 0 no_frontmatter) remains consistent with the tracked changelog population audited in iteration 1.

### checklist_evidence: PASS with one recorded gap -- phase 2's 27-entry criterion is corroborated exactly (45cb464be8 adds 27 changelog files; the 548 catalog files resolve to 27 owner paths, 26 with SKILL.md bumps plus the runtime changelog carrier); the five versions named in phase 4 AC-003 all exist as added entries and 99c133fd5a adds exactly five; phase 5 adds 10 new entries; phase 6 adds six; phase 7 adds two. Phase 3's claimed 19 does not match its commit's 20 (R3-P2-003). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence: PASS with one recorded gap -- phase 2's 27-entry criterion is corroborated exactly (45cb464be8 adds 27 changelog files; the 548 catalog files resolve to 27 owner paths, 26 with SKILL.md bumps plus the runtime changelog carrier); the five versions named in phase 4 AC-003 all exist as added entries and 99c133fd5a adds exactly five; phase 5 adds 10 new entries; phase 6 adds six; phase 7 adds two. Phase 3's claimed 19 does not match its commit's 20 (R3-P2-003).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PASS with one recorded gap -- phase 2's 27-entry criterion is corroborated exactly (45cb464be8 adds 27 changelog files; the 548 catalog files resolve to 27 owner paths, 26 with SKILL.md bumps plus the runtime changelog carrier); the five versions named in phase 4 AC-003 all exist as added entries and 99c133fd5a adds exactly five; phase 5 adds 10 new entries; phase 6 adds six; phase 7 adds two. Phase 3's claimed 19 does not match its commit's 20 (R3-P2-003).

### Fail-open risk from the validator warn-tier narrowing: reversed - unlisted packages now fail instead of warn. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Fail-open risk from the validator warn-tier narrowing: reversed - unlisted packages now fail instead of warn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fail-open risk from the validator warn-tier narrowing: reversed - unlisted packages now fail instead of warn.

### feature_catalog_code: notApplicable -- catalog validator not rerun (known sk-vision environment gap; repo tooling excluded). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: feature_catalog_code: notApplicable -- catalog validator not rerun (known sk-vision environment gap; repo tooling excluded).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: notApplicable -- catalog validator not rerun (known sk-vision environment gap; repo tooling excluded).

### feature_catalog_code: notApplicable this pass -- the catalog validator was not rerun (iteration constraints exclude repo-wide tooling and the known sk-vision env gap blocks a full rerun), so the 761-to-15 figure is read from the phase receipt, not independently reproduced. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: feature_catalog_code: notApplicable this pass -- the catalog validator was not rerun (iteration constraints exclude repo-wide tooling and the known sk-vision env gap blocks a full rerun), so the 761-to-15 figure is read from the phase receipt, not independently reproduced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: notApplicable this pass -- the catalog validator was not rerun (iteration constraints exclude repo-wide tooling and the known sk-vision env gap blocks a full rerun), so the 761-to-15 figure is read from the phase receipt, not independently reproduced.

### feature_catalog_code: PARTIAL -- the catalog validator was not rerun (known environment gap: 3 expected fails on the unbuilt sk-vision plugin; rerunning repo tooling is outside iteration constraints). Phase 3's 761-to-15 outcome is internally consistent with the known 3 fail + 12 warn tier, and the documented decision to keep those 15 intentional findings is recorded in the phase 3 summary. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: feature_catalog_code: PARTIAL -- the catalog validator was not rerun (known environment gap: 3 expected fails on the unbuilt sk-vision plugin; rerunning repo tooling is outside iteration constraints). Phase 3's 761-to-15 outcome is internally consistent with the known 3 fail + 12 warn tier, and the documented decision to keep those 15 intentional findings is recorded in the phase 3 summary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: PARTIAL -- the catalog validator was not rerun (known environment gap: 3 expected fails on the unbuilt sk-vision plugin; rerunning repo tooling is outside iteration constraints). Phase 3's 761-to-15 outcome is internally consistent with the known 3 fail + 12 warn tier, and the documented decision to keep those 15 intentional findings is recorded in the phase 3 summary.

### feature_catalog_code: PASS for the fail-open question: the ccf25fdd56 narrowing of WARN_PACKAGE_IDS moves 19 package ids from warn to fail and the comment promises fresh packages fail closed ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63]); severity mapping is a direct membership test ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:791]). No weakening found. The known environment gap (3 expected sk-vision fails) still precludes a full validator rerun. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: feature_catalog_code: PASS for the fail-open question: the ccf25fdd56 narrowing of WARN_PACKAGE_IDS moves 19 package ids from warn to fail and the comment promises fresh packages fail closed ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63]); severity mapping is a direct membership test ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:791]). No weakening found. The known environment gap (3 expected sk-vision fails) still precludes a full validator rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: PASS for the fail-open question: the ccf25fdd56 narrowing of WARN_PACKAGE_IDS moves 19 package ids from warn to fail and the comment promises fresh packages fail closed ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63]); severity mapping is a direct membership test ([SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:791]). No weakening found. The known environment gap (3 expected sk-vision fails) still precludes a full validator rerun.

### Marker readers: no validator, router or script reads the removed comment; no live template comment remains outside changelog prose and one BINDING placeholder string. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Marker readers: no validator, router or script reads the removed comment; no live template comment remains outside changelog prose and one BINDING placeholder string.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Marker readers: no validator, router or script reads the removed comment; no live template comment remains outside changelog prose and one BINDING placeholder string.

### Overengineering: the eight one-shot migration scripts live in phase scratch folders, add no dependency or abstraction, and are proportionate to the bulk edits; the commits add no runtime code paths. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overengineering: the eight one-shot migration scripts live in phase scratch folders, add no dependency or abstraction, and are proportionate to the bulk edits; the commits add no runtime code paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overengineering: the eight one-shot migration scripts live in phase scratch folders, add no dependency or abstraction, and are proportionate to the bulk edits; the commits add no runtime code paths.

### Packet-history removal false positives: all 110 removed lines carry the retired labels (Feature ID, Source phase, Origin packet); none is a table row or prose line with other content. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Packet-history removal false positives: all 110 removed lines carry the retired labels (Feature ID, Source phase, Origin packet); none is a table row or prose line with other content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet-history removal false positives: all 110 removed lines carry the retired labels (Feature ID, Source phase, Origin packet); none is a table row or prose line with other content.

### Reads outside the hub by the guards: relative-ref resolution is hub-gated; the one cross-skill require is a fixed in-repo path inside .skilled/skills. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reads outside the hub by the guards: relative-ref resolution is hub-gated; the one cross-skill require is a fixed in-repo path inside .skilled/skills.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reads outside the hub by the guards: relative-ref resolution is hub-gated; the one cross-skill require is a fixed in-repo path inside .skilled/skills.

### Shell injection in the renames, runner, guards or scratch scripts: no shell-form subprocess and no child_process in shipped assets. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Shell injection in the renames, runner, guards or scratch scripts: no shell-form subprocess and no child_process in shipped assets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection in the renames, runner, guards or scratch scripts: no shell-form subprocess and no child_process in shipped assets.

### skill_agent / playbook_capability: notApplicable -- no agent or playbook files in scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: skill_agent / playbook_capability: notApplicable -- no agent or playbook files in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent / playbook_capability: notApplicable -- no agent or playbook files in scope.

### skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration - no agent mirrors, cross-runtime agent definitions, or playbook capability docs were read beyond the deep-review persona definition. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration - no agent mirrors, cross-runtime agent definitions, or playbook capability docs were read beyond the deep-review persona definition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration - no agent mirrors, cross-runtime agent definitions, or playbook capability docs were read beyond the deep-review persona definition.

### skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration; correctness focus, no agent or playbook content read beyond integration references. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration; correctness focus, no agent or playbook content read beyond integration references.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent, agent_cross_runtime, playbook_capability: notApplicable this iteration; correctness focus, no agent or playbook content read beyond integration references.

### skill_agent, playbook_capability: notApplicable this pass -- no agent mirrors or playbook docs were read beyond the packet docs. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: skill_agent, playbook_capability: notApplicable this pass -- no agent mirrors or playbook docs were read beyond the packet docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent, playbook_capability: notApplicable this pass -- no agent mirrors or playbook docs were read beyond the packet docs.

### spec_code: PASS -- goal decisions D1-D5 and completion criteria tested against the commit graph. D1 confirmed (marker grep over .skilled and .hermes excluding changelog prints nothing at HEAD); D2/D3 confirmed by the run-once scratch scripts and iteration 1's full reads; D4 confirmed by the recorded 15-finding reasons [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:104] and the phase-6 handoff record [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/006-skill-package-doc-findings/implementation-summary.md:103]. D5 and the 1.0.2.0 criterion do not hold as written (R3-P2-001, R3-P2-002). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code: PASS -- goal decisions D1-D5 and completion criteria tested against the commit graph. D1 confirmed (marker grep over .skilled and .hermes excluding changelog prints nothing at HEAD); D2/D3 confirmed by the run-once scratch scripts and iteration 1's full reads; D4 confirmed by the recorded 15-finding reasons [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:104] and the phase-6 handoff record [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/006-skill-package-doc-findings/implementation-summary.md:103]. D5 and the 1.0.2.0 criterion do not hold as written (R3-P2-001, R3-P2-002).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: PASS -- goal decisions D1-D5 and completion criteria tested against the commit graph. D1 confirmed (marker grep over .skilled and .hermes excluding changelog prints nothing at HEAD); D2/D3 confirmed by the run-once scratch scripts and iteration 1's full reads; D4 confirmed by the recorded 15-finding reasons [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/implementation-summary.md:104] and the phase-6 handoff record [SOURCE: specs/sk-doc/066-feature-catalog-template-anchor-deprecation/006-skill-package-doc-findings/implementation-summary.md:103]. D5 and the 1.0.2.0 criterion do not hold as written (R3-P2-001, R3-P2-002).

### spec_code: PASS -- per-commit claims verified independently. 45cb464be8: every one of the 548 catalog files is 0 added / 2 deleted lines, the marker plus its adjacent blank, with 0 removed lines outside that pair. caafc08377: 217 modified changelog files are each 1 added / 0 deleted, and 10 new entries are 29/0. 99c133fd5a: 98 marker lines removed (97 in .skilled, plus the documented 1 Hermes mirror). ccf25fdd56: 110 removed packet-history lines all carry the three retired labels. cc1e6baba1: five renames R096-R100 and the runner and manifest cite the new names. e6b0297bcf: templates and the per-feature checklist no longer contain the marker. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: spec_code: PASS -- per-commit claims verified independently. 45cb464be8: every one of the 548 catalog files is 0 added / 2 deleted lines, the marker plus its adjacent blank, with 0 removed lines outside that pair. caafc08377: 217 modified changelog files are each 1 added / 0 deleted, and 10 new entries are 29/0. 99c133fd5a: 98 marker lines removed (97 in .skilled, plus the documented 1 Hermes mirror). ccf25fdd56: 110 removed packet-history lines all carry the three retired labels. cc1e6baba1: five renames R096-R100 and the runner and manifest cite the new names. e6b0297bcf: templates and the per-feature checklist no longer contain the marker.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: PASS -- per-commit claims verified independently. 45cb464be8: every one of the 548 catalog files is 0 added / 2 deleted lines, the marker plus its adjacent blank, with 0 removed lines outside that pair. caafc08377: 217 modified changelog files are each 1 added / 0 deleted, and 10 new entries are 29/0. 99c133fd5a: 98 marker lines removed (97 in .skilled, plus the documented 1 Hermes mirror). ccf25fdd56: 110 removed packet-history lines all carry the three retired labels. cc1e6baba1: five renames R096-R100 and the runner and manifest cite the new names. e6b0297bcf: templates and the per-feature checklist no longer contain the marker.

### spec_code: PASS for the security-relevant phase-7 claims, independently corroborated: verify-router-sync.cjs requires ./router-replay-lib.cjs at its new name and the file exists ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:9]); the runner points at both kebab-case guards ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:30], [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:31]). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code: PASS for the security-relevant phase-7 claims, independently corroborated: verify-router-sync.cjs requires ./router-replay-lib.cjs at its new name and the file exists ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:9]); the runner points at both kebab-case guards ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:30], [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:31]).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: PASS for the security-relevant phase-7 claims, independently corroborated: verify-router-sync.cjs requires ./router-replay-lib.cjs at its new name and the file exists ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:9]); the runner points at both kebab-case guards ([SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:30], [SOURCE: .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:31]).

### spec_code: PASS with the R4-P2-001 record gap -- REQ-003 across phases 3-7 tested against HEAD hub versions; five hubs have exact targets whose from-versions match HEAD; sk-doc's target is unrecorded. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: spec_code: PASS with the R4-P2-001 record gap -- REQ-003 across phases 3-7 tested against HEAD hub versions; five hubs have exact targets whose from-versions match HEAD; sk-doc's target is unrecorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: PASS with the R4-P2-001 record gap -- REQ-003 across phases 3-7 tested against HEAD hub versions; five hubs have exact targets whose from-versions match HEAD; sk-doc's target is unrecorded.

### Untrusted instruction-like content introduced by the range: absent (two-scan check above). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Untrusted instruction-like content introduced by the range: absent (two-scan check above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Untrusted instruction-like content introduced by the range: absent (two-scan check above).

### Version and changelog drift: no mismatches, no duplicates, no skipped versions in the current tree; the one older entry phase 7 found was keyed in that commit. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Version and changelog drift: no mismatches, no duplicates, no skipped versions in the current tree; the one older entry phase 7 found was keyed in that commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Version and changelog drift: no mismatches, no duplicates, no skipped versions in the current tree; the one older entry phase 7 found was keyed in that commit.

### Write outside .skilled by the bulk scripts: every write target derives from .skilled-relative enumeration or repo_root-relative validator output; no path escapes the repo working tree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Write outside .skilled by the bulk scripts: every write target derives from .skilled-relative enumeration or repo_root-relative validator output; no path escapes the repo working tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Write outside .skilled by the bulk scripts: every write target derives from .skilled-relative enumeration or repo_root-relative validator output; no path escapes the repo working tree.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: security. Focus area: the three renamed .cjs assets and the drift-guard wrapper (require resolution, path handling, spawn and quoting), plus the --apply write paths of the bulk scripts. Rotation status: first rotation after D1 correctness. Blocked or productive carry-forward: none blocked; the population-audit approach was productive and should be reused for reference integrity. Required evidence: direct reads of the guard scripts and a grep for shell injection surfaces in the wrapper.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Packet specs/sk-doc/066-feature-catalog-template-anchor-deprecation (phases 001-007) closed all children Complete; parent goal.md records 761 to 15 catalog findings, 548 files swept, 97 comments, 217 version keys, six package fixes, three renames. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Claim counts 548/98/217/110/61/5 verified against per-file numstat and diff content; runtime 9-entry gap recorded as R1-P2-001. |
| `checklist_evidence` | core | pass | 1 | Phase verification tables corroborated independently (548 files 0/2; 217 files 1/0; 61/61 link targets resolve; 0 version mismatches). |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/001-source-deprecation/spec.md | - | - | - | pending |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/002-retroactive-removal/scratch/remove_template_anchor.py | correctness | 1 | 0 | reviewed (full read) |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/sync_leaf_frontmatter.py | correctness | 1 | 0 | reviewed (full read) |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/link_phantom_rows.py | correctness | 1 | 0 | reviewed (full read) |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/remove_packet_history_lines.py | correctness | 1 | 0 | reviewed (full read) |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/normalize_validation_types.py | correctness | 1 | 0 | reviewed (full read) |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/004-leftover-template-comments/scratch/remove_leftover_template_comments.py | correctness | 1 | 0 | reviewed (full read) |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/005-changelog-version-keys/scratch/add_changelog_version_keys.py | correctness | 1 | 0 | reviewed (full read) |
| specs/sk-doc/066-feature-catalog-template-anchor-deprecation/007-sk-code-script-kebab-names/scratch/rename_kebab_scripts.py | correctness | 1 | 0 | reviewed (full read) |
| .skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md | correctness | 1 | 0 | reviewed (diff) |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs | correctness | 1 | 0 | reviewed (refs, not body) |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | correctness | 1 | 0 | reviewed (refs, not body) |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | correctness | 1 | 0 | reviewed (refs + require target) |
| .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-doc-claims.test.cjs | correctness | 1 | 0 | reviewed (refs, not body) |
| .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs | correctness | 1 | 0 | reviewed (refs, not body) |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=r4-t4-review-2026-10-10T21-18Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-10T21:18:27.610Z
<!-- MACHINE-OWNED: END -->

---

## Next Focus
- Dimension: maintainability. Focus area: disposition-record completeness for the 15 retained catalog findings and the hand-off notes; scratch-script placement and dead-weight risk; the validator warn-tier narrowing's upkeep; consistency and maintainability of the packet doc set once the 008 review lands. Rotation status: third rotation after traceability. Blocked or productive carry-forward: the iteration-3 per-commit census is a cheap baseline; do not re-enter ruled-out bug classes (content loss, broken references, version drift, previously audited claim counts) or rerun repo tooling. Required evidence: direct reads plus tree-level checks.

### Changelog version hygiene: 13 new entries sampled across all seven entry-adding commits; every key matches its file name, every new version is one patch above the previous latest with build zero, no duplicate versions per changelog dir, and every direct-changelog SKILL.md version equals its newest entry. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Changelog version hygiene: 13 new entries sampled across all seven entry-adding commits; every key matches its file name, every new version is one patch above the previous latest with build zero, no duplicate versions per changelog dir, and every direct-changelog SKILL.md version equals its newest entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog version hygiene sampling.

### Version-key coverage: no residual inside the 27 sweep-touched units beyond R1-P2-001; the other missing-key files all sit in units outside the phase-5 scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Version-key coverage: no residual inside the 27 sweep-touched units beyond R1-P2-001; the other missing-key files all sit in units outside the phase-5 scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Version-key coverage cross-tab.

### Derived artifacts: activation manifests are policy-hash re-mints with no version fields; the trigger index was regenerated in four range commits including the last content commit; the .hermes sk-vision mirror diff is the generator header and link transform, present at main too. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Derived artifacts: activation manifests are policy-hash re-mints with no version fields; the trigger index was regenerated in four range commits including the last content commit; the .hermes sk-vision mirror diff is the generator header and link transform, present at main too.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Derived artifact drift check.

### Scratch scripts: no new maintainability defect; proportionate one-shot tools, dry-run defaults, byte-preserving rewrites, no new dependencies (corroborates the iteration-1 overengineering clearance). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Scratch scripts: no new maintainability defect; proportionate one-shot tools, dry-run defaults, byte-preserving rewrites, no new dependencies (corroborates the iteration-1 overengineering clearance).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scratch script maintainability sweep.


---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

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
commits 8f59b9bd0a and 1895122d37 on branch worktrees/129-surface-guide (diff d99ddaff7d..1895122d37): README.md marks OpenCode native and Webflow and Obsidian optional examples and rewrites the "What Adapting `sk-code` Looks Like" block into the external-user guide (hooks, keep-rule, removal recipe with ROUTER.md section 11, add recipe, check battery); the sk-code SKILL.md surface sentence, the hub README rows and the regenerated Hermes copy carry the same roles; .skilled/changelog/skilled/v4.0.0.5.md is the next release note.

Dimensions, risk-ordered: correctness, security, traceability, maintainability. Max iterations 5, convergence threshold 0.1, stop policy max-iterations. The full diff is specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/scratch/review-diff.patch. Reader-test evidence (a fresh agent that followed only the guide in a full-tree copy) is recorded by the orchestrator, not in scope files.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The behavior shipped by phases 001 to 004 (doctor, guard, sync, drift guards, scaffold), already reviewed in their own phases; only whether the guide and the release note describe it truly.
- The operator's shipped surfaces and their order.
- The released v4.0.0.4 note, which must stay unedited.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: all 5 iterations run.

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
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Path-and-usage sweep over every path and command in the adaptation block: proved the guide executable as written (28/28 paths resolve; battery flags match their scripts) (iteration 1)
- Registry cross-check of the R4 lines against mode-registry.json and hub-router.json: confirmed native/optional-example wording matches the declared three-surface set (iteration 1)
- Out-of-hub reference sweep (`rg -l` for the removable modes): isolated the mirror and root-README gaps the hub-rooted checks cannot see (iteration 1)
- Installer and hook-trust probe (`.skilled/scripts/install-git-hooks.sh`, pre-commit trust block): bare invocation installs and the checkout is trusted by git common dir; other-clone trust is documented (iteration 2)
- Copy-direction cross-check (manifest and canary twins with `cmp`, gate `cp` at pre-commit:640): both copies run runtime to authored mirror and the guide matches the gate (iteration 2)
- Hermes parity check of the changed surface sentence: source and mirror identical (iteration 2)
- Goal-criteria rerun on the final diff state: criteria 1, 2 and 3 print `ok`, `8` and `ok` (iteration 3)
- Release-note-to-phase mapping: every v4.0.0.5 at-a-glance bullet traces to a recorded phase ledger (P8-x, P9-x, P10-x, VP-x), closing the deferred SL-006 direction (iteration 3)
- Spec-to-diff file inventory (`git diff --name-only` against the Files to Change table): isolated three unlisted gate-generated artifacts (R3-P2-001) (iteration 3)
- Human Voice punctuation sweep over the diff's added lines (em dash, semicolon, serial-comma patterns): only `&nbsp;` entity semicolons matched; added prose carries no em dash, semicolon or Oxford comma (iteration 4)
- Changelog compact-shape cross-check of v4.0.0.5 against `changelog-template.md`: frontmatter, summary, spec-folder line, `&nbsp;` separators before each H2, six glance bullets and the Upgrade section all conform (iteration 4)
- Surface-role and replace-wording sweep across README.md and the sk-code doc tree: no remaining peer-triplet presentation or replace-OpenCode instruction; the three-surface wording in `phase-detection.md:16` is caught by `verify-doc-claims.cjs` checkSurfaces after a removal (iteration 4)
- Anchor and terminology integrity check of the rewritten docs: heading `README.md:1445` and its ToC anchor `README.md:1376` are unchanged, and OPENCODE/OpenCode plus native/optional-example usage is consistent across the four docs and the release note (iteration 4)
- Adversarial re-verification of all four carried P2 advisories at their cited lines with live probes: R1-P2-001 (mirror packets exist, recipe silent, commit gate is the only catcher), R1-P2-002 (verify-doc-claims defaults to the hub), R2-P2-001 (step 1 has no work-loss preflight), R3-P2-001 (diff carries seven files against four listed) all re-confirmed (iteration 5)
- First-time-user sweep of the guide's named paths: `.opencode/skills` symlink, the canary fixture, the surface-hint test, `sk-code-quality/` and `manual-testing-playbook/manual-testing-playbook.md` all resolve; no new path, order or red-check trip found (iteration 5)

---

## 9. WHAT FAILED
- No approach failed this iteration; the deferred release-note claims are queued, not blocked. (iteration 1)
- The "authored source" label read as a direction inversion at first pass; the skeptic pass ruled it out against the gate's own contract (iteration 2).
- No check failed in iteration 3: the REQ mapping, the release-note truth pass and goal criteria 1 to 3 all passed.
- No check failed in iteration 4: the HVR punctuation sweep, compact-shape check, surface-role sweep and anchor checks all passed with no new finding.
- No check failed in iteration 5: the four advisories still hold and the first-time-user sweep found no new finding.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Authored source" wording as a data-loss trap (iteration 2; evidence: no edit instruction exists; directory-level label). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Authored source" wording as a data-loss trap (iteration 2; evidence: no edit instruction exists; directory-level label).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Authored source" wording as a data-loss trap (iteration 2; evidence: no edit instruction exists; directory-level label).

### `agent_cross_runtime` (overlay): partial - the changed surface sentence is identical in the Hermes mirror (source line 40, mirror line 45) [SOURCE: .hermes/skills/sk-code/SKILL.md:45]; the removal-path mirror gap stays R1-P2-001. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): partial - the changed surface sentence is identical in the Hermes mirror (source line 40, mirror line 45) [SOURCE: .hermes/skills/sk-code/SKILL.md:45]; the removal-path mirror gap stays R1-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): partial - the changed surface sentence is identical in the Hermes mirror (source line 40, mirror line 45) [SOURCE: .hermes/skills/sk-code/SKILL.md:45]; the removal-path mirror gap stays R1-P2-001.

### `agent_cross_runtime` (overlay): partial - the regenerated `.hermes/skills/sk-code/SKILL.md` carries the same roles, but the removal path leaves example mirror packets behind (finding R1-P2-001). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): partial - the regenerated `.hermes/skills/sk-code/SKILL.md` carries the same roles, but the removal path leaves example mirror packets behind (finding R1-P2-001).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): partial - the regenerated `.hermes/skills/sk-code/SKILL.md` carries the same roles, but the removal path leaves example mirror packets behind (finding R1-P2-001).

### `checklist_evidence` (core) - partial carried: AC-002, AC-003 and AC-006 await the closeout ledger rows; AC-001, AC-004 and AC-005 remain covered by the iteration 3 criterion reruns. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence` (core) - partial carried: AC-002, AC-003 and AC-006 await the closeout ledger rows; AC-001, AC-004 and AC-005 remain covered by the iteration 3 criterion reruns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core) - partial carried: AC-002, AC-003 and AC-006 await the closeout ledger rows; AC-001, AC-004 and AC-005 remain covered by the iteration 3 criterion reruns.

### `checklist_evidence` (core) - partial: AC-001, AC-004 and AC-005 are effectively covered by the criterion reruns; AC-002, AC-003 and AC-006 remain `Unmet` because the ledger rows are written at closeout (goal C3 sequence). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` (core) - partial: AC-001, AC-004 and AC-005 are effectively covered by the criterion reruns; AC-002, AC-003 and AC-006 remain `Unmet` because the ledger rows are written at closeout (goal C3 sequence).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core) - partial: AC-001, AC-004 and AC-005 are effectively covered by the criterion reruns; AC-002, AC-003 and AC-006 remain `Unmet` because the ledger rows are written at closeout (goal C3 sequence).

### `checklist_evidence` (core) — partial, carried: P11-5 (R4 lines read and quoted) is covered; P11-1 to P11-4 and P11-6 are closeout ledger rows recorded per goal C3 sequence. Deferred, not failed (SL-004). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence` (core) — partial, carried: P11-5 (R4 lines read and quoted) is covered; P11-1 to P11-4 and P11-6 are closeout ledger rows recorded per goal C3 sequence. Deferred, not failed (SL-004).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core) — partial, carried: P11-5 (R4 lines read and quoted) is covered; P11-1 to P11-4 and P11-6 are closeout ledger rows recorded per goal C3 sequence. Deferred, not failed (SL-004).

### `checklist_evidence` (core): partial - acceptance row P11-5 (R4 lines read and quoted) is effectively covered by this iteration; P11-1 to P11-4 and P11-6 were not executed here. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` (core): partial - acceptance row P11-5 (R4 lines read and quoted) is effectively covered by this iteration; P11-1 to P11-4 and P11-6 were not executed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial - acceptance row P11-5 (R4 lines read and quoted) is effectively covered by this iteration; P11-1 to P11-4 and P11-6 were not executed here.

### `checklist_evidence` (core): partial - acceptance rows P11-1..P11-4 and P11-6 remain for the traceability iteration; P11-5 was covered in iteration 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` (core): partial - acceptance rows P11-1..P11-4 and P11-6 remain for the traceability iteration; P11-5 was covered in iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial - acceptance rows P11-1..P11-4 and P11-6 remain for the traceability iteration; P11-5 was covered in iteration 1.

### `feature_catalog_code` (overlay): partial - hub feature-catalog docs sit inside the verify-doc-claims walk; not individually read. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): partial - hub feature-catalog docs sit inside the verify-doc-claims walk; not individually read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): partial - hub feature-catalog docs sit inside the verify-doc-claims walk; not individually read.

### `feature_catalog_code` (overlay): partial - unchanged from iteration 1; hub catalog docs sit inside the verify-doc-claims walk. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): partial - unchanged from iteration 1; hub catalog docs sit inside the verify-doc-claims walk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): partial - unchanged from iteration 1; hub catalog docs sit inside the verify-doc-claims walk.

### `hub-router` wording (`classes` versus `vocabularyClasses`) as a defect: decipherable with the file open (iteration 1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `hub-router` wording (`classes` versus `vocabularyClasses`) as a defect: decipherable with the file open (iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `hub-router` wording (`classes` versus `vocabularyClasses`) as a defect: decipherable with the file open (iteration 1).

### `manual-testing-playbook.md` as a missing path — ruled out; it resolves inside the named directory. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `manual-testing-playbook.md` as a missing path — ruled out; it resolves inside the named directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `manual-testing-playbook.md` as a missing path — ruled out; it resolves inside the named directory.

### `playbook_capability` (overlay): partial - removal step 6 correctly names the playbook scenarios and rows; the canary fixture and its authored twin exist. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability` (overlay): partial - removal step 6 correctly names the playbook scenarios and rows; the canary fixture and its authored twin exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): partial - removal step 6 correctly names the playbook scenarios and rows; the canary fixture and its authored twin exist.

### `playbook_capability` (overlay): partial - unchanged from iteration 1; step 6's playbook pointers and the canary contract match [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:500]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability` (overlay): partial - unchanged from iteration 1; step 6's playbook pointers and the canary contract match [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:500].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): partial - unchanged from iteration 1; step 6's playbook pointers and the canary contract match [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:500].

### `README.md:1384` mis-citation — ruled out by live `grep -n`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `README.md:1384` mis-citation — ruled out by live `grep -n`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `README.md:1384` mis-citation — ruled out by live `grep -n`.

### `skill_agent` (overlay): partial - no agent definition is in scope; the hub `SKILL.md` surface sentence was unchanged by this iteration's checks. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent` (overlay): partial - no agent definition is in scope; the hub `SKILL.md` surface sentence was unchanged by this iteration's checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): partial - no agent definition is in scope; the hub `SKILL.md` surface sentence was unchanged by this iteration's checks.

### `skill_agent` (overlay): partial - the hub `SKILL.md` surface sentence and README rows were verified; no agent definition file is in scope. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent` (overlay): partial - the hub `SKILL.md` surface sentence and README rows were verified; no agent definition file is in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): partial - the hub `SKILL.md` surface sentence and README rows were verified; no agent definition file is in scope.

### `skill_agent` / `agent_cross_runtime` / `feature_catalog_code` / `playbook_capability` (overlay) - carried, not retried per the exhausted list; the changed surface sentence remains identical in the Hermes mirror (iteration 2 evidence) and R1-P2-001 stays active. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` / `agent_cross_runtime` / `feature_catalog_code` / `playbook_capability` (overlay) - carried, not retried per the exhausted list; the changed surface sentence remains identical in the Hermes mirror (iteration 2 evidence) and R1-P2-001 stays active.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` / `agent_cross_runtime` / `feature_catalog_code` / `playbook_capability` (overlay) - carried, not retried per the exhausted list; the changed surface sentence remains identical in the Hermes mirror (iteration 2 evidence) and R1-P2-001 stays active.

### `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) - carried on the exhausted list; R1-P2-001 stays active for the mirror gap and no overlay direction was re-entered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) - carried on the exhausted list; R1-P2-001 stays active for the mirror gap and no overlay direction was re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) - carried on the exhausted list; R1-P2-001 stays active for the mirror gap and no overlay direction was re-entered.

### `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) — carried on the exhausted list; no overlay direction was re-entered. The changed surface sentence remains identical in the Hermes mirror; R1-P2-001 stays active for the mirror-packet gap. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) — carried on the exhausted list; no overlay direction was re-entered. The changed surface sentence remains identical in the Hermes mirror; R1-P2-001 stays active for the mirror-packet gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability` (overlay) — carried on the exhausted list; no overlay direction was re-entered. The changed surface sentence remains identical in the Hermes mirror; R1-P2-001 stays active for the mirror-packet gap.

### `SKILL.md:40` canonicality claim ("any other sk-code doc that counts surfaces points to this sentence") as unmet by the hub README: `README.md:23` points at the hub `SKILL.md` surface list, and the `:55-57` and `:90` role restatements are the spec's D2-mandated markers, not a competing count (iteration 4; evidence: spec D2 and hub README rows). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `SKILL.md:40` canonicality claim ("any other sk-code doc that counts surfaces points to this sentence") as unmet by the hub README: `README.md:23` points at the hub `SKILL.md` surface list, and the `:55-57` and `:90` role restatements are the spec's D2-mandated markers, not a competing count (iteration 4; evidence: spec D2 and hub README rows).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `SKILL.md:40` canonicality claim ("any other sk-code doc that counts surfaces points to this sentence") as unmet by the hub README: `README.md:23` points at the hub `SKILL.md` surface list, and the `:55-57` and `:90` role restatements are the spec's D2-mandated markers, not a competing count (iteration 4; evidence: spec D2 and hub README rows).

### `spec_code` (core) - carried pass from iteration 3 for REQ-001, REQ-004 and REQ-005; this iteration adds the maintainability-side of SC-002 ("no canonical inventory presents the examples as peers of the native surface"): the sweep of README.md and the sk-code doc tree found no peer-triplet presentation [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:1]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code` (core) - carried pass from iteration 3 for REQ-001, REQ-004 and REQ-005; this iteration adds the maintainability-side of SC-002 ("no canonical inventory presents the examples as peers of the native surface"): the sweep of README.md and the sk-code doc tree found no peer-triplet presentation [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:1].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core) - carried pass from iteration 3 for REQ-001, REQ-004 and REQ-005; this iteration adds the maintainability-side of SC-002 ("no canonical inventory presents the examples as peers of the native surface"): the sweep of README.md and the sk-code doc tree found no peer-triplet presentation [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:1].

### `spec_code` (core) - pass for REQ-001, REQ-004 and REQ-005; deferred for REQ-002 and REQ-003: -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` (core) - pass for REQ-001, REQ-004 and REQ-005; deferred for REQ-002 and REQ-003:
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core) - pass for REQ-001, REQ-004 and REQ-005; deferred for REQ-002 and REQ-003:

### `spec_code` (core) — carried pass for REQ-001, REQ-004, REQ-005 from iteration 3; this iteration re-read the R4 line at its live location and confirms the wording. No gap. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code` (core) — carried pass for REQ-001, REQ-004, REQ-005 from iteration 3; this iteration re-read the R4 line at its live location and confirms the wording. No gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core) — carried pass for REQ-001, REQ-004, REQ-005 from iteration 3; this iteration re-read the R4 line at its live location and confirms the wording. No gap.

### `spec_code` (core): pass - R4 requirement `spec.md:72` verified against the actual lines. `README.md:800` and `:1384` mark OPENCODE native and Webflow/Obsidian optional examples; `.skilled/skills/sk-code/SKILL.md:40` states three surfaces with OPENCODE native; hub README rows `:23`, `:55-57`, `:90` carry matching roles. No line tells the user to replace OpenCode. Goal D1's six block parts are all present in the rewritten block. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` (core): pass - R4 requirement `spec.md:72` verified against the actual lines. `README.md:800` and `:1384` mark OPENCODE native and Webflow/Obsidian optional examples; `.skilled/skills/sk-code/SKILL.md:40` states three surfaces with OPENCODE native; hub README rows `:23`, `:55-57`, `:90` carry matching roles. No line tells the user to replace OpenCode. Goal D1's six block parts are all present in the rewritten block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): pass - R4 requirement `spec.md:72` verified against the actual lines. `README.md:800` and `:1384` mark OPENCODE native and Webflow/Obsidian optional examples; `.skilled/skills/sk-code/SKILL.md:40` states three surfaces with OPENCODE native; hub README rows `:23`, `:55-57`, `:90` carry matching roles. No line tells the user to replace OpenCode. Goal D1's six block parts are all present in the rewritten block.

### `spec_code` (core): pass for this dimension - the guide's hook, manifest and fixture instructions match the shipped gate behavior [SOURCE: .skilled/scripts/git-hooks/pre-commit:640]; carried from iteration 1 for the R4 roles. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` (core): pass for this dimension - the guide's hook, manifest and fixture instructions match the shipped gate behavior [SOURCE: .skilled/scripts/git-hooks/pre-commit:640]; carried from iteration 1 for the R4 roles.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): pass for this dimension - the guide's hook, manifest and fixture instructions match the shipped gate behavior [SOURCE: .skilled/scripts/git-hooks/pre-commit:640]; carried from iteration 1 for the R4 roles.

### Canary fixture copy direction (iteration 2; evidence: create-skill-parent-auto.yaml:500 contract; twins byte-identical). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Canary fixture copy direction (iteration 2; evidence: create-skill-parent-auto.yaml:500 contract; twins byte-identical).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Canary fixture copy direction (iteration 2; evidence: create-skill-parent-auto.yaml:500 contract; twins byte-identical).

### Changelog compact-shape cross-check against the template: frontmatter block, one-sentence summary, spec-folder line, `&nbsp;` separator before each H2, six glance bullets (the compact ceiling), and the `## Upgrade` section with "No migration required." all conform; `validate_document.py` exit 0 is already recorded by goal criterion 3 [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Changelog compact-shape cross-check against the template: frontmatter block, one-sentence summary, spec-folder line, `&nbsp;` separator before each H2, six glance bullets (the compact ceiling), and the `## Upgrade` section with "No migration required." all conform; `validate_document.py` exit 0 is already recorded by goal criterion 3 [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog compact-shape cross-check against the template: frontmatter block, one-sentence summary, spec-folder line, `&nbsp;` separator before each H2, six glance bullets (the compact ceiling), and the `## Upgrade` section with "No migration required." all conform; `validate_document.py` exit 0 is already recorded by goal criterion 3 [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1].

### Duplicate finding for the hub `SKILL.md` `.hermes` mirror — folded into R1-P2-001. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Duplicate finding for the hub `SKILL.md` `.hermes` mirror — folded into R1-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate finding for the hub `SKILL.md` `.hermes` mirror — folded into R1-P2-001.

### Heading and anchor integrity: the `#### What Adapting `sk-code` Looks Like` heading at `README.md:1445` is a diff context line (unchanged), the explicit anchor at `README.md:1376` still backs the ToC link at `README.md:244`, so the doctor 3c pointer and the ToC resolve [SOURCE: README.md:1445]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Heading and anchor integrity: the `#### What Adapting `sk-code` Looks Like` heading at `README.md:1445` is a diff context line (unchanged), the explicit anchor at `README.md:1376` still backs the ToC link at `README.md:244`, so the doctor 3c pointer and the ToC resolve [SOURCE: README.md:1445].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Heading and anchor integrity: the `#### What Adapting `sk-code` Looks Like` heading at `README.md:1445` is a diff context line (unchanged), the explicit anchor at `README.md:1376` still backs the ToC link at `README.md:244`, so the doctor 3c pointer and the ToC resolve [SOURCE: README.md:1445].

### Heading or anchor breakage from the guide rewrite: the `README.md:1445` heading is unchanged in the diff and the `README.md:1376` anchor still resolves the `README.md:244` ToC link (iteration 4). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Heading or anchor breakage from the guide rewrite: the `README.md:1445` heading is unchanged in the diff and the `README.md:1376` anchor still resolves the `README.md:244` ToC link (iteration 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Heading or anchor breakage from the guide rewrite: the `README.md:1445` heading is unchanged in the diff and the `README.md:1376` anchor still resolves the `README.md:244` ToC link (iteration 4).

### Hermes mirror drift on the changed sentence (iteration 2; evidence: line-level comparison). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Hermes mirror drift on the changed sentence (iteration 2; evidence: line-level comparison).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hermes mirror drift on the changed sentence (iteration 2; evidence: line-level comparison).

### Human Voice punctuation sweep over every added line in the diff: `grep '^+'` piped through `—|;` matched only the `&nbsp;` entity semicolons; the serial-comma scan matched clause joins and two-item pairs only. Added prose carries no em dash, semicolon or Oxford comma (evidence: scratch/review-diff.patch added lines). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Human Voice punctuation sweep over every added line in the diff: `grep '^+'` piped through `—|;` matched only the `&nbsp;` entity semicolons; the serial-comma scan matched clause joins and two-item pairs only. Added prose carries no em dash, semicolon or Oxford comma (evidence: scratch/review-diff.patch added lines).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Human Voice punctuation sweep over every added line in the diff: `grep '^+'` piped through `—|;` matched only the `&nbsp;` entity semicolons; the serial-comma scan matched clause joins and two-item pairs only. Added prose carries no em dash, semicolon or Oxford comma (evidence: scratch/review-diff.patch added lines).

### Manifest-over-authored copy as a direction inversion (iteration 2; evidence: pre-commit:640 and :541; guide matches gate). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Manifest-over-authored copy as a direction inversion (iteration 2; evidence: pre-commit:640 and :541; guide matches gate).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Manifest-over-authored copy as a direction inversion (iteration 2; evidence: pre-commit:640 and :541; guide matches gate).

### New path, step-order or red-check trip for a first-time user following only the guide — none found this iteration beyond the four carried P2 advisories. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: New path, step-order or red-check trip for a first-time user following only the guide — none found this iteration beyond the four carried P2 advisories.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New path, step-order or red-check trip for a first-time user following only the guide — none found this iteration beyond the four carried P2 advisories.

### R4 lines misstating the surface set or telling the user to replace OpenCode: all lines match the registries and every shipped line uses native/optional-example roles (iteration 1; evidence: registry probes plus doc reads). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: R4 lines misstating the surface set or telling the user to replace OpenCode: all lines match the registries and every shipped line uses native/optional-example roles (iteration 1; evidence: registry probes plus doc reads).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: R4 lines misstating the surface set or telling the user to replace OpenCode: all lines match the registries and every shipped line uses native/optional-example roles (iteration 1; evidence: registry probes plus doc reads).

### Release note contains a false behavioral claim (SL-006): every at-a-glance bullet traces to a recorded phase ledger (iteration 3; evidence: 001 to 004 implementation summaries). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Release note contains a false behavioral claim (SL-006): every at-a-glance bullet traces to a recorded phase ledger (iteration 3; evidence: 001 to 004 implementation summaries).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Release note contains a false behavioral claim (SL-006): every at-a-glance bullet traces to a recorded phase ledger (iteration 3; evidence: 001 to 004 implementation summaries).

### Release note vs phases 001 to 004 (closes the deferred release-note direction SL-006): each at-a-glance bullet maps to a recorded phase ledger - surface placement and the two command follow-ups to 001 (P8-4, P8-5), the doctor/guard/sync fix messages and the pruned-`specs/` stops to 002 (P9-1 to P9-6), drift tolerance to 003 (P10-1 to P10-4), ROUTER.md version neutrality to 004 (VP-1 to VP-4). No unverified behavioral claim remains. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Release note vs phases 001 to 004 (closes the deferred release-note direction SL-006): each at-a-glance bullet maps to a recorded phase ledger - surface placement and the two command follow-ups to 001 (P8-4, P8-5), the doctor/guard/sync fix messages and the pruned-`specs/` stops to 002 (P9-1 to P9-6), drift tolerance to 003 (P10-1 to P10-4), ROUTER.md version neutrality to 004 (VP-1 to VP-4). No unverified behavioral claim remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Release note vs phases 001 to 004 (closes the deferred release-note direction SL-006): each at-a-glance bullet maps to a recorded phase ledger - surface placement and the two command follow-ups to 001 (P8-4, P8-5), the doctor/guard/sync fix messages and the pruned-`specs/` stops to 002 (P9-1 to P9-6), drift tolerance to 003 (P10-1 to P10-4), ROUTER.md version neutrality to 004 (VP-1 to VP-4). No unverified behavioral claim remains.

### Release-note claim that the doctor names the README block: true (iteration 1; evidence: `parent-skill-check.cjs:496`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Release-note claim that the doctor names the README block: true (iteration 1; evidence: `parent-skill-check.cjs:496`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Release-note claim that the doctor names the README block: true (iteration 1; evidence: `parent-skill-check.cjs:496`).

### Remaining replace-example wording at `README.md:1384` as a replace-OpenCode instruction: the sentence keeps the native surface and only invites removing or replacing optional examples, which is the subject of the active R2-P2-001 advisory, not a new voice defect (iteration 4). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Remaining replace-example wording at `README.md:1384` as a replace-OpenCode instruction: the sentence keeps the native surface and only invites removing or replacing optional examples, which is the subject of the active R2-P2-001 advisory, not a new voice defect (iteration 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Remaining replace-example wording at `README.md:1384` as a replace-OpenCode instruction: the sentence keeps the native surface and only invites removing or replacing optional examples, which is the subject of the active R2-P2-001 advisory, not a new voice defect (iteration 4).

### Removal recipe missing a step needed for the six-command battery: battery-relevant artifacts are covered; doctor 3c points at the README block, and the commit path re-mints and stages both manifests (iteration 1; evidence: `parent-skill-check.cjs:496`, pre-commit route-remint gate). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Removal recipe missing a step needed for the six-command battery: battery-relevant artifacts are covered; doctor 3c points at the README block, and the commit path re-mints and stages both manifests (iteration 1; evidence: `parent-skill-check.cjs:496`, pre-commit route-remint gate).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removal recipe missing a step needed for the six-command battery: battery-relevant artifacts are covered; doctor 3c points at the README block, and the commit path re-mints and stages both manifests (iteration 1; evidence: `parent-skill-check.cjs:496`, pre-commit route-remint gate).

### REQ-001, REQ-004 or REQ-005 traceability gap: none; goal criteria 1 to 3 rerun pass (iteration 3). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-001, REQ-004 or REQ-005 traceability gap: none; goal criteria 1 to 3 rerun pass (iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-001, REQ-004 or REQ-005 traceability gap: none; goal criteria 1 to 3 rerun pass (iteration 3).

### REQ-001: each R4 line marks OpenCode native and the examples optional and no line tells the user to replace OpenCode; goal criterion 1 rerun prints `criterion1: ok`. Lines: README.md:800, README.md:1384, SKILL.md:40, hub README :23, :55-57, :90. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-001: each R4 line marks OpenCode native and the examples optional and no line tells the user to replace OpenCode; goal criterion 1 rerun prints `criterion1: ok`. Lines: README.md:800, README.md:1384, SKILL.md:40, hub README :23, :55-57, :90.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-001: each R4 line marks OpenCode native and the examples optional and no line tells the user to replace OpenCode; goal criterion 1 rerun prints `criterion1: ok`. Lines: README.md:800, README.md:1384, SKILL.md:40, hub README :23, :55-57, :90.

### REQ-002 and REQ-003: no evidence in the diff - they are the copy-run acceptance rows P11-1 to P11-3 recorded at closeout (deferred, see Edge Cases). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-002 and REQ-003: no evidence in the diff - they are the copy-run acceptance rows P11-1 to P11-3 recorded at closeout (deferred, see Edge Cases).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-002 and REQ-003: no evidence in the diff - they are the copy-run acceptance rows P11-1 to P11-3 recorded at closeout (deferred, see Edge Cases).

### REQ-004: the block names the nested paths, the hooks, the keep-rule with `.opencode/skills`, `/create:skill-parent update --surfaces`, `RESOURCE_MAP`, `INTENT_SIGNALS` and `run-all-drift-guards.sh`; goal criterion 2 rerun prints `criterion2: 8 (want 8)`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-004: the block names the nested paths, the hooks, the keep-rule with `.opencode/skills`, `/create:skill-parent update --surfaces`, `RESOURCE_MAP`, `INTENT_SIGNALS` and `run-all-drift-guards.sh`; goal criterion 2 rerun prints `criterion2: 8 (want 8)`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-004: the block names the nested paths, the hooks, the keep-rule with `.opencode/skills`, `/create:skill-parent update --surfaces`, `RESOURCE_MAP`, `INTENT_SIGNALS` and `run-all-drift-guards.sh`; goal criterion 2 rerun prints `criterion2: 8 (want 8)`.

### REQ-005: the newest note is v4.0.0.5, states the rule, names the `ROUTER.md` version change, `validate_document.py` exits 0, and v4.0.0.4 is untouched (`git diff --quiet origin/main` exit 0); goal criterion 3 rerun prints `criterion3: ok`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-005: the newest note is v4.0.0.5, states the rule, names the `ROUTER.md` version change, `validate_document.py` exits 0, and v4.0.0.4 is untouched (`git diff --quiet origin/main` exit 0); goal criterion 3 rerun prints `criterion3: ok`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-005: the newest note is v4.0.0.5, states the rule, names the `ROUTER.md` version change, `validate_document.py` exits 0, and v4.0.0.4 is untouched (`git diff --quiet origin/main` exit 0); goal criterion 3 rerun prints `criterion3: ok`.

### Six guide parts incomplete: all six present in the block at README.md:1445-1483 (iteration 3). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Six guide parts incomplete: all six present in the block at README.md:1445-1483 (iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Six guide parts incomplete: all six present in the block at README.md:1445-1483 (iteration 3).

### Six guide parts of research section 14.1: all present in the block at README.md:1445-1483 - part 1 at :1447, part 2 at :1451-1452, part 4 at :1454-1464, part 5 at :1466-1472, part 6 at :1474-1483. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Six guide parts of research section 14.1: all present in the block at README.md:1445-1483 - part 1 at :1447, part 2 at :1451-1452, part 4 at :1454-1464, part 5 at :1466-1472, part 6 at :1474-1483.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Six guide parts of research section 14.1: all present in the block at README.md:1445-1483 - part 1 at :1447, part 2 at :1451-1452, part 4 at :1454-1464, part 5 at :1466-1472, part 6 at :1474-1483.

### Stale three-surface wording in `shared/references/phase-detection.md:16`: `verify-doc-claims.cjs` `checkSurfaces` matches count wording against `mode-registry.json`, and removal recipe step 7 runs that check (iteration 4; evidence: verify-doc-claims.cjs:46, :320). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Stale three-surface wording in `shared/references/phase-detection.md:16`: `verify-doc-claims.cjs` `checkSurfaces` matches count wording against `mode-registry.json`, and removal recipe step 7 runs that check (iteration 4; evidence: verify-doc-claims.cjs:46, :320).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale three-surface wording in `shared/references/phase-detection.md:16`: `verify-doc-claims.cjs` `checkSurfaces` matches count wording against `mode-registry.json`, and removal recipe step 7 runs that check (iteration 4; evidence: verify-doc-claims.cjs:46, :320).

### Surface-role consistency across the guide, the R4 lines, the hub rows, the Hermes mirror and the release note: all five state OPENCODE native and WEBFLOW and OBSIDIAN optional examples, and the add-ahead-of-OpenCode ranking is identical in the guide, the add recipe and the release note [SOURCE: README.md:800] [SOURCE: .skilled/skills/sk-code/SKILL.md:40]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Surface-role consistency across the guide, the R4 lines, the hub rows, the Hermes mirror and the release note: all five state OPENCODE native and WEBFLOW and OBSIDIAN optional examples, and the add-ahead-of-OpenCode ranking is identical in the guide, the add recipe and the release note [SOURCE: README.md:800] [SOURCE: .skilled/skills/sk-code/SKILL.md:40].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Surface-role consistency across the guide, the R4 lines, the hub rows, the Hermes mirror and the release note: all five state OPENCODE native and WEBFLOW and OBSIDIAN optional examples, and the add-ahead-of-OpenCode ranking is identical in the guide, the add recipe and the release note [SOURCE: README.md:800] [SOURCE: .skilled/skills/sk-code/SKILL.md:40].

### Terminology consistency: uppercase `OPENCODE` is used as the surface identifier, title-case OpenCode as the runtime name, and "native" / "optional example" wording is uniform after the rewrite. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Terminology consistency: uppercase `OPENCODE` is used as the surface identifier, title-case OpenCode as the runtime name, and "native" / "optional example" wording is uniform after the rewrite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Terminology consistency: uppercase `OPENCODE` is used as the surface identifier, title-case OpenCode as the runtime name, and "native" / "optional example" wording is uniform after the rewrite.

### Unsafe release-note promise (iteration 2; evidence: claims are behavioral or deferred traceability checks). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Unsafe release-note promise (iteration 2; evidence: claims are behavioral or deferred traceability checks).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unsafe release-note promise (iteration 2; evidence: claims are behavioral or deferred traceability checks).

### Wrong hook installer or silently inert hooks (iteration 2; evidence: installer action parsing, trust block, README.md:203). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Wrong hook installer or silently inert hooks (iteration 2; evidence: installer action parsing, trust block, README.md:203).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Wrong hook installer or silently inert hooks (iteration 2; evidence: installer action parsing, trust block, README.md:203).

### Wrong path, command or flag in the guide: all 28 referenced paths exist and every command line matches its script's usage (iteration 1; evidence: existence sweep plus usage strings). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Wrong path, command or flag in the guide: all 28 referenced paths exist and every command line matches its script's usage (iteration 1; evidence: existence sweep plus usage strings).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Wrong path, command or flag in the guide: all 28 referenced paths exist and every command line matches its script's usage (iteration 1; evidence: existence sweep plus usage strings).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Release note contains a false behavioral claim: every v4.0.0.5 at-a-glance bullet traces to a phase ledger 001 to 004 (iteration 3, evidence: the four implementation summaries)
- REQ-001, REQ-004 or REQ-005 traceability gap, or an incomplete six-part block: none; criterion reruns pass (iteration 3, evidence: goal criteria 1 to 3 output)
- Wrong path, command or flag in the adaptation block: all 28 referenced paths exist and every battery command matches its script's usage (iteration 1, evidence: existence sweep + usage strings)
- R4 lines misstating the surface set: mode-registry surface-axis declares exactly the three shipped surfaces and all R4 lines mark the roles correctly (iteration 1, evidence: mode-registry.json + hub-router.json)
- Removal recipe missing a battery-blocking step: battery-relevant artifacts are covered; doctor 3c names the README block and the pre-commit gate re-mints and stages both manifests (iteration 1, evidence: parent-skill-check.cjs:496, pre-commit:480)
- hub-router wording (`classes` vs `vocabularyClasses`): decipherable with the file open; not a defect (iteration 1)
- Stale three-surface wording in `shared/references/phase-detection.md:16`: `verify-doc-claims.cjs` checkSurfaces matches count wording against `mode-registry.json` and flags it after any removal, so removal recipe step 7 covers it (iteration 4, evidence: verify-doc-claims.cjs:46, :320)
- `SKILL.md:40` canonicality claim as unmet by the hub README: `README.md:23` points at the hub `SKILL.md` surface list, and the `:55-57` and `:90` role restatements are the spec D2-mandated markers, not a competing count (iteration 4)
- Heading or anchor breakage from the guide rewrite: `README.md:1445` is a diff context line and the `README.md:1376` anchor still resolves the `README.md:244` ToC link (iteration 4)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: cross-reference / synthesis (all four dimensions complete). - Focus area: final pass over the four active P2 advisories against the frozen diff state and the closeout handoff. - Reason: D4 is complete; stop policy max-iterations runs iteration 5. - Rotation status: all dimensions complete; synthesis next. - Blocked/productive carry-forward: R1-P2-001, R1-P2-002, R2-P2-001 and R3-P2-001 remain active P2 advisories; ledger rows P11-1 to P11-6 belong to closeout. - Required evidence: README.md:1456, :1461, :1384, spec.md:91, .hermes/skills/sk-code/SKILL.md:45. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Spec: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md (R4 lines, the six guide parts of research section 14.1, release note). Research: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md section 14. Phase summaries 001 to 004 under ../00*/implementation-summary.md state what shipped.

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
| `spec_code` | core | pass | 1 | R4 lines match spec REQ-001 and goal D1; adaptation block carries all six required parts |
| `checklist_evidence` | core | partial | 1 | P11-5 (R4 lines read and quoted) covered; P11-1..P11-4, P11-6 not run |
| `skill_agent` | overlay | partial | 1 | hub SKILL.md surface sentence and README rows verified; no agent definition in scope |
| `agent_cross_runtime` | overlay | partial | 1 | Hermes mirror carries same roles, but removal leaves example mirror packets stale (R1-P2-001) |
| `feature_catalog_code` | overlay | partial | 1 | hub feature-catalog docs are inside the verify-doc-claims walk; not individually read |
| `playbook_capability` | overlay | partial | 1 | removal step 6 names playbook scenarios/rows; canary fixture and authored twin confirmed |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| README.md | D1, D2 | 2 | 0 P0, 0 P1, 3 P2 | partial (3 P2 open) |
| .skilled/skills/sk-code/SKILL.md | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete for D1 |
| .skilled/skills/sk-code/README.md | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete for D1 |
| .hermes/skills/sk-code/SKILL.md | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete for D1 |
| .skilled/changelog/skilled/v4.0.0.5.md | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial (claims deferred) |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/goal.md | D1 | 1 | 0 P0, 0 P1, 0 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```

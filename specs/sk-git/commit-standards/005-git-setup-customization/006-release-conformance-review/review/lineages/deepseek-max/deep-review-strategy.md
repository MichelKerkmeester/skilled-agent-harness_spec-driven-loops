# Deep Review Strategy — deepseek-max lineage

Lineage-scoped strategy for the fan-out review of the v4.0.0.11 release
conformance packet. Write surface: this lineage directory only.

---

## 1. REVIEW CHARTER

- Target: `specs/sk-git/033-git-setup-customization/006-release-conformance-review` (spec-folder)
- Charter source: `review/lineages/deepseek-max/steer.md` (lead's channel; binds inside this lineage)
- Scope: the file list in the packet's `goal-file-manifest.txt` (25 repo-relative paths);
  the spec folder's own scaffold docs are not the review subject
- Subject: all work shipped for the v4.0.0.11 release — the `/doctor:git setup` command and
  its hardening — judged for authoring-standard conformance and correct cross-repo references
- Dimensions: correctness, security, traceability, maintainability
  (standards conformance recorded under maintainability or traceability)
- Stop policy: `max-iterations` (convergence is telemetry; all 5 iterations run)
- Iteration plan (steer): 1) code, 2) command surface, 3) skill docs, 4) cross-repo references,
  5) changelogs + final cross-check
- Validators to run read-only (steer): `validate_document.py`, `hvr_scan.py`, playbook/catalog
  validators, `route-validate.sh`, sk-code drift guards, `node --test git-setup-check.test.cjs`,
  `bash .github/scripts/tests/check-gate-inputs.test.sh`
- Graph seeding, `upsert.cjs`, and `convergence.cjs` are skipped in this lineage: those scripts
  resolve their writes against the parent spec folder's `review/` root, which is outside this
  lineage's write surface. Recorded as an execution-boundary note, not a finding.

---

## 2. TOPIC

v4.0.0.11 release conformance review: `/doctor:git setup` and its hardening.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The spec folder's own scaffold docs (`spec.md`, `plan.md`, `tasks.md`,
  `implementation-summary.md`) are review context, not review subjects.
- Files outside the manifest are inspected only when a scope entry cites them
  (cross-reference integrity), and only as context evidence.
- No implementation work; findings only. No reviewed file is modified.

---

## 5. STOP CONDITIONS

- Hard stop: `iteration_count >= maxIterations` (5), stopReason `maxIterationsReached`.
- Convergence telemetry is recorded but never stops the loop early under `max-iterations`.

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
- P1 (Required): 1
- P2 (Suggestions): 11
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the battery end-to-end against its own header contract, then running the fixture suites
  and the live check: the executable evidence (44/44 node tests, 50/50 shell fixtures,
  `failures=0`) made confirmation cheap and kept P0/P1 claims grounded (iteration 1)
- Helper-claim cross-checks (pre-push exemption, worktree-naming allowlist reader, hook-flags
  parser) turned three "documented behavior" claims into verified facts (iteration 1)
- Running the release's own validator set instead of re-deriving its rules (route-validate and its
  self-test, validate_document, kebab checker, router drift check, hvr_scan) gave each command-surface
  verdict a citable command; `generate-command-routers` reported 34/34 routers drift-free (iteration 2)
- The package validators pinned the run's first P1 with a single command each: skill packaging
  (FAIL, 5038 words), playbook package (PASS 46/9), catalog package (PASS), and release-commit
  diffs kept the HVR census attributable, so pre-existing prose stayed out of the findings (iteration 3)
- The repo-wide sweep plus a normalized mirror diff turned "is every listing correct?" into
  mechanical checks: the advisor bridge JSON carries the new target's phrases, the umbrella
  presentation enumerates all 14 routes, and the Hermes copy differs only by its generated
  banner and link rewrites (iteration 4)
- Treating the changelog as a claim sheet made the final pass cheap: every bullet mapped to code,
  a test or a verified run, and the one claim not covered by earlier iterations was closed by the
  rules-block round-trip test (10/10) (iteration 5)

---

## 9. WHAT FAILED

- First fixture run pointed `TMPDIR` into the lineage without a git ceiling, which made the
  `install` repair expectation fail for the wrong reason; re-run with `GIT_CEILING_DIRECTORIES`
  set to the same directory restored the default isolation (iteration 1)
- Nothing failed operationally in iteration 2; the `hvr_scan.py` exit 1 on the presentation asset
  is a captured finding, not a tooling failure (iteration 2)
- The two doc-package validators that passed (`validate-playbook-package.cjs`,
  `validate_catalog_package.py`) surfaced no violations, so the iteration-3 findings come from
  the skill-packaging validator and direct census/command checks rather than package structure (iteration 3)
- Nothing failed operationally in iteration 4; the two findings came from manual cross-reference
  reads the validators do not cover (prose enumerations and a duplicated verdict list) (iteration 4)
- The final P1 replay still fails exactly as recorded (5038 > 5000 words); no in-run repair is
  possible because the review is observation-only (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`git log` could run a repository's `gpg.program` via `log.showSignature`": ruled out — -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "`git log` could run a repository's `gpg.program` via `log.showSignature`": ruled out —
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`git log` could run a repository's `gpg.program` via `log.showSignature`": ruled out —

### "A later iteration superseded an earlier finding": ruled out — the final anchor sweep is clean. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "A later iteration superseded an earlier finding": ruled out — the final anchor sweep is clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A later iteration superseded an earlier finding": ruled out — the final anchor sweep is clean.

### "A stale advisor bridge cannot route `/doctor:git setup`": ruled out — the generated bridge -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "A stale advisor bridge cannot route `/doctor:git setup`": ruled out — the generated bridge
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A stale advisor bridge cannot route `/doctor:git setup`": ruled out — the generated bridge

### "GIT_DIR / GIT_WORK_TREE could point probes at another repository": ruled out — dropped from -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "GIT_DIR / GIT_WORK_TREE could point probes at another repository": ruled out — dropped from
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "GIT_DIR / GIT_WORK_TREE could point probes at another repository": ruled out — dropped from

### "HVR hard blockers were introduced by the release's doc edits": ruled out for the three long -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "HVR hard blockers were introduced by the release's doc edits": ruled out for the three long
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "HVR hard blockers were introduced by the release's doc edits": ruled out for the three long

### "Router/presentation/manifest target sets diverge": ruled out — `route-validate` J1 passes and -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Router/presentation/manifest target sets diverge": ruled out — `route-validate` J1 passes and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Router/presentation/manifest target sets diverge": ruled out — `route-validate` J1 passes and

### "The changelogs overstate the fix surface": ruled out — each claim maps to code, a test, or a -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The changelogs overstate the fix surface": ruled out — each claim maps to code, a test, or a
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The changelogs overstate the fix surface": ruled out — each claim maps to code, a test, or a

### "The check could be steered by an inherited `GATE_REGISTRY`": ruled out — removed before the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The check could be steered by an inherited `GATE_REGISTRY`": ruled out — removed before the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The check could be steered by an inherited `GATE_REGISTRY`": ruled out — removed before the

### "The doctor scenario was written against a stale battery": ruled out — it names the eleven -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The doctor scenario was written against a stale battery": ruled out — it names the eleven
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The doctor scenario was written against a stale battery": ruled out — it names the eleven

### "The Hermes skill mirror drifted from the canonical SKILL.md": ruled out — normalized diff clean. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The Hermes skill mirror drifted from the canonical SKILL.md": ruled out — normalized diff clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Hermes skill mirror drifted from the canonical SKILL.md": ruled out — normalized diff clean.

### "The install row could run `install-git-hooks.sh` from an untrusted clone": ruled out — the -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The install row could run `install-git-hooks.sh` from an untrusted clone": ruled out — the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The install row could run `install-git-hooks.sh` from an untrusted clone": ruled out — the

### "The playbook tree and the index disagree on which files exist": ruled out — every index heading -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The playbook tree and the index disagree on which files exist": ruled out — every index heading
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The playbook tree and the index disagree on which files exist": ruled out — every index heading

### "The presentation names kill switches that do not exist": ruled out — all four resolve in the -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The presentation names kill switches that do not exist": ruled out — all four resolve in the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The presentation names kill switches that do not exist": ruled out — all four resolve in the

### "The release's own documented checks pass as written": ruled out for the skill-packaging row -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The release's own documented checks pass as written": ruled out for the skill-packaging row
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The release's own documented checks pass as written": ruled out for the skill-packaging row

### "The setup YAML's check list or exit-code mapping drifts from the battery": ruled out — both -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The setup YAML's check list or exit-code mapping drifts from the battery": ruled out — both
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The setup YAML's check list or exit-code mapping drifts from the battery": ruled out — both

### "The umbrella `/doctor:setup` listings miss the git setup target": ruled out — both YAML and -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The umbrella `/doctor:setup` listings miss the git setup target": ruled out — both YAML and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The umbrella `/doctor:setup` listings miss the git setup target": ruled out — both YAML and

### `agent_cross_runtime` (overlay): notApplicable this iteration — no agent files in the command scope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): notApplicable this iteration — no agent files in the command scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): notApplicable this iteration — no agent files in the command scope.

### `agent_cross_runtime` (overlay): pass — `.hermes/skills/sk-git/SKILL.md` was diffed against the -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): pass — `.hermes/skills/sk-git/SKILL.md` was diffed against the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): pass — `.hermes/skills/sk-git/SKILL.md` was diffed against the

### `agent_cross_runtime` (overlay): pass — Hermes mirror content-identical to canonical (iteration 4). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): pass — Hermes mirror content-identical to canonical (iteration 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): pass — Hermes mirror content-identical to canonical (iteration 4).

### `agent_cross_runtime` (overlay): pending — `.hermes/skills/sk-git/SKILL.md` is iteration 4's subject. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): pending — `.hermes/skills/sk-git/SKILL.md` is iteration 4's subject.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): pending — `.hermes/skills/sk-git/SKILL.md` is iteration 4's subject.

### `checklist_evidence` (core): partial — no `checklist.md` evidence rows exist for this packet; -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` (core): partial — no `checklist.md` evidence rows exist for this packet;
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial — no `checklist.md` evidence rows exist for this packet;

### `checklist_evidence` (core): partial — no `checklist.md` rows exist; the release's validation -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` (core): partial — no `checklist.md` rows exist; the release's validation
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial — no `checklist.md` rows exist; the release's validation

### `checklist_evidence` (core): partial — no checklist.md rows; the validator set above is the -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` (core): partial — no checklist.md rows; the validator set above is the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial — no checklist.md rows; the validator set above is the

### `checklist_evidence` (core): partial — the changelogs pass their own validators, and the two -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence` (core): partial — the changelogs pass their own validators, and the two
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial — the changelogs pass their own validators, and the two

### `checklist_evidence` (core): partial — validation this iteration is the route manifest read, the -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence` (core): partial — validation this iteration is the route manifest read, the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): partial — validation this iteration is the route manifest read, the

### `feature_catalog_code` (overlay): partial — catalog validator PASS; one vocabulary drift -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): partial — catalog validator PASS; one vocabulary drift
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): partial — catalog validator PASS; one vocabulary drift

### `feature_catalog_code` (overlay): partial — catalog validator PASS; two catalog/overview -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): partial — catalog validator PASS; two catalog/overview
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): partial — catalog validator PASS; two catalog/overview

### `feature_catalog_code` (overlay): partial — the category overview's enumeration is incomplete -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): partial — the category overview's enumeration is incomplete
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): partial — the category overview's enumeration is incomplete

### `feature_catalog_code` (overlay): pending — catalog and playbook entries are iterations 3-4's subject. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): pending — catalog and playbook entries are iterations 3-4's subject.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): pending — catalog and playbook entries are iterations 3-4's subject.

### `playbook_capability` (overlay): partial — playbook validator PASS with 46/9; index census -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability` (overlay): partial — playbook validator PASS with 46/9; index census
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): partial — playbook validator PASS with 46/9; index census

### `playbook_capability` (overlay): pass — playbook validator PASS 46 scenarios / 9 categories; -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability` (overlay): pass — playbook validator PASS 46 scenarios / 9 categories;
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): pass — playbook validator PASS 46 scenarios / 9 categories;

### `playbook_capability` (overlay): pass — the system-spec-kit doctor-commands README maps every -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability` (overlay): pass — the system-spec-kit doctor-commands README maps every
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): pass — the system-spec-kit doctor-commands README maps every

### `playbook_capability` (overlay): pending — same. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability` (overlay): pending — same.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): pending — same.

### `skill_agent` (overlay): partial — `git.md` carries `<!-- skill_agent: sk-git -->` and the -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent` (overlay): partial — `git.md` carries `<!-- skill_agent: sk-git -->` and the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): partial — `git.md` carries `<!-- skill_agent: sk-git -->` and the

### `skill_agent` (overlay): partial — sk-git SKILL.md ↔ `/doctor:git` router linkage verified; -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent` (overlay): partial — sk-git SKILL.md ↔ `/doctor:git` router linkage verified;
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): partial — sk-git SKILL.md ↔ `/doctor:git` router linkage verified;

### `skill_agent` (overlay): partial — SKILL.md's §3 `/doctor:git` section names the command and -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` (overlay): partial — SKILL.md's §3 `/doctor:git` section names the command and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): partial — SKILL.md's §3 `/doctor:git` section names the command and

### `skill_agent` (overlay): partial — the Hermes mirror is content-identical to the canonical -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent` (overlay): partial — the Hermes mirror is content-identical to the canonical
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): partial — the Hermes mirror is content-identical to the canonical

### `spec_code` (core): partial — cross-repo prose checked against the route manifest, the battery and -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code` (core): partial — cross-repo prose checked against the route manifest, the battery and
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial — cross-repo prose checked against the route manifest, the battery and

### `spec_code` (core): partial — final state: the release's own artifacts (code, command, -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code` (core): partial — final state: the release's own artifacts (code, command,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial — final state: the release's own artifacts (code, command,

### `spec_code` (core): partial — packet spec.md remains scaffold context; this iteration checked -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` (core): partial — packet spec.md remains scaffold context; this iteration checked
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial — packet spec.md remains scaffold context; this iteration checked

### `spec_code` (core): partial — the packet's `spec.md` is scaffold-level context per the charter, -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` (core): partial — the packet's `spec.md` is scaffold-level context per the charter,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial — the packet's `spec.md` is scaffold-level context per the charter,

### `spec_code` (core): partial — the packet's `spec.md` remains scaffold context per the charter; -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` (core): partial — the packet's `spec.md` remains scaffold context per the charter;
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial — the packet's `spec.md` remains scaffold context per the charter;

### Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`,

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles investigated and definitively eliminated -- consolidated from iteration data]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None — iteration 5 of 5 reached; synthesis compiles the run into `review-report.md` with the active finding registry, workstreams and planning seed.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 25 manifest paths; command surface under `.skilled/commands/doctor/`;
  sk-git skill docs; `.github` gate-inputs pipeline; changelogs `v1.9.0.0.md` (sk-git)
  and `v4.0.0.11.md` (skilled)
- Behavior claims to verify: `/doctor:git setup` exists as a routable doctor command; the
  `git-setup-check.cjs` battery reports only what a repository can observe; the gate-inputs
  workflow enforces the documented inputs; every cited path/command in the docs exists and
  behaves as written
- Reuse/conventions: sk-doc authoring modes (`sk-create-command`, `sk-create-skill`,
  `sk-create-readme`, `sk-create-changelog`, `sk-create-feature-catalog`,
  `sk-create-manual-testing-playbook`, `sk-create-with-human-voice`) and the
  `sk-code-skilled` checklists define the expected shape
- Review risks: validators may write caches (run them read-only or skip); graph scripts write
  outside this lineage (skipped, see charter); the parent packet's scaffold docs are
  context-only; another lineage (`luna-max-fast`) reviews the same target in parallel —
  no cross-lineage coordination is possible or needed
- Prior context: none — fresh lineage; parent config `dr006-1792125935387` initialized the run

---

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 4 | Cross-repo prose checked against manifest, battery and generated advisor bridges |
| `checklist_evidence` | core | partial | 4 | Route manifest read, bridge JSON, Hermes normalized diff, repo-wide sweep |
| `skill_agent` | overlay | partial | 3 | SKILL.md doctor section links to the router; Hermes mirror content-identical |
| `agent_cross_runtime` | overlay | pass | 4 | `.hermes/skills/sk-git/SKILL.md` diff vs canonical: banner + link rewrites only |
| `feature_catalog_code` | overlay | partial | 4 | Category overview enumeration omits /doctor:sk-code (R4-P2-001) |
| `playbook_capability` | overlay | pass | 4 | Doctor playbook README maps every command and DOC range correctly |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/doctor/scripts/git-setup-check.cjs | [correctness, security] | 1 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs | [correctness, security] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .github/workflows/gate-inputs.yml | [correctness, security] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .github/scripts/check-gate-inputs.sh | [correctness, security] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .github/scripts/tests/check-gate-inputs.test.sh | [correctness, security] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/commands/doctor/git.md | [traceability, maintainability] | 2 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/commands/doctor/assets/doctor-git-setup.yaml | [traceability, maintainability] | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/commands/doctor/assets/doctor-git-presentation.txt | [traceability, maintainability] | 2 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/commands/doctor/_routes.yaml | [traceability, maintainability] | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/commands/doctor/scripts/README.md | [traceability, maintainability] | 2 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/skills/sk-git/SKILL.md | [maintainability, traceability] | 3 | 0 P0, 1 P1, 2 P2 | complete |
| .skilled/skills/sk-git/README.md | [maintainability, traceability] | 3 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-git/assets/commit-message-template.md | [maintainability, traceability] | 3 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md | [maintainability, traceability] | 3 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md | [maintainability, traceability] | 3 | 0 P0, 0 P1, 2 P2 | complete |
| .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md | [maintainability, traceability] | 3 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-git/feature-catalog/feature-catalog.md | [maintainability, traceability] | 3 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/skills/sk-git/scripts/hooks/README.md | [maintainability, traceability] | 3 | 0 P0, 0 P1, 0 P2 | complete |
| README.md | [traceability, maintainability] | 4 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/commands/README.txt | [traceability, maintainability] | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md | [traceability, maintainability] | 4 | 0 P0, 0 P1, 1 P2 | complete |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md | [traceability, maintainability] | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .hermes/skills/sk-git/SKILL.md | [traceability, maintainability] | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-git/changelog/v1.9.0.0.md | [traceability, maintainability] | 5 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/changelog/skilled/v4.0.0.11.md | [traceability, maintainability] | 5 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1792125954096-ldhndm, parentSessionId=dr006-1792125935387, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-16T04:46:30.000Z
<!-- MACHINE-OWNED: END -->

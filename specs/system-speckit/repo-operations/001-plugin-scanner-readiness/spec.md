---
title: "Feature Specification: Plugin scanner readiness"
description: "The HOL plugin scanner that gates the awesome-ai-plugins listing scored this repository 76 with 75 high findings, most of them in vendored third-party repositories under specs/**/context/. This packet fixes the real code findings, pins CI actions, adds a security policy and stops tracking vendored packet context."
trigger_phrases:
  - "plugin scanner readiness"
  - "hol plugin scanner"
  - "awesome-ai-plugins listing"
  - "untrack packet context"
  - "sk- prefix secret false positive"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Plugin scanner readiness

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-10-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GitHub issue #49 invites this repository into `hashgraph-online/awesome-ai-plugins`, whose merge gate runs the HOL plugin scanner and requires a score of at least 80 with no high or critical findings. A scan of `main` scored 76 with 75 high findings. Most came from 32,372 tracked files of vendored third-party repositories under `specs/**/context/`, and eight came from real code: shell commands built by string interpolation, a `new Function()` call and a comment the eval pattern matched.

### Purpose
Remove every finding this repository can honestly fix, so the listing PR rests on real code and CI hygiene rather than on suppressions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace interpolated `execSync` shell strings with `execFileSync` argument arrays in the flagged files.
- Load model-written code in the benchmark scorer's child process through a temp module instead of the `Function` constructor.
- Pin every GitHub Action to a commit SHA and let Dependabot update the pins.
- Add a root `SECURITY.md` that points to GitHub private vulnerability reporting.
- Stop tracking `specs/**/context/` and rebuild the sk-doc README verdict baseline that enumerates tracked READMEs.

### Out of Scope
- Untracking `scratch/`, `z_archive/`, `lineages/` or run logs - the operator kept them tracked once the scanner proved unpassable for another reason.
- Renaming `sk-*` skills - the scanner reads every `sk-` token of 20 or more characters as an OpenAI key, and renaming the skill family is not proportionate to a catalog listing.
- Making `.mcp.json` a regular file - the operator declined the symlink swap.
- Excluding `context/` from the trigger-index corpus walker - a retrieval policy change with its own documented divergence table.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore` | Modify | Ignore `specs/**/context/`; drop the vendored `image-size/dist` exception |
| `.github/workflows/*.yml` | Modify | Pin 50 action references to commit SHAs |
| `.github/dependabot.yml` | Modify | Add the `github-actions` ecosystem |
| `SECURITY.md` | Create | Vulnerability reporting policy |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs` | Modify | Temp-module loading in the runner child |
| `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs` | Modify | `execFileSync` for terser |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Modify | Comment wording the eval pattern matched |
| Five spec-kit and deep-loop test files | Modify | `execFileSync` argument arrays |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Rebuilt from tracked READMEs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Behavior of every changed script and test is unchanged | Each affected suite passes with the same count as its pre-change baseline |
| REQ-002 | The eight code findings are gone | A scanner run reports no `DANGEROUS_DYNAMIC_EXECUTION` or `SHELL_INJECTION_PATTERN` finding in `.skilled/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | CI actions are pinned and kept current | No `GITHUB_ACTION_UNPINNED` finding; Dependabot lists `github-actions` |
| REQ-004 | Vendored context leaves the tracked tree without breaking CI tests | `git check-ignore` matches `specs/**/context/`; the README verdict parity test passes against an index without context |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All affected test suites match their baselines.
- **SC-002**: The scanner reports no high finding of a kind this repository can fix; what remains is the `sk-` naming false positive, documented for the scanner maintainers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | HOL scanner secret heuristic | High: 3,302 `sk-` skill-name false positives block the listing | Report it upstream and ask the catalog maintainers for review |
| Risk | Untracking 32k files in a checkout another session commits from | Med | Untrack in the commit that carries this packet, never staged ahead of it |
| Risk | Trigger index still lists one `context/` document | Low: advisory CI drift only | Recorded as a known limitation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will the catalog maintainers accept a manual review while the scanner misreads `sk-` skill names?
<!-- /ANCHOR:questions -->

---

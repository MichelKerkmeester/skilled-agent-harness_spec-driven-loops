---
title: "Feature Specification: Phase 15: barter-overlay-upstream-intake"
description: "A vendoring project carries overlays that fix Skilled files upstream got wrong, and it asked about a re-pin that left five upstream links unwritten. This phase checks each claim, lands the fixes that hold and records the decisions that belong to the operator."
trigger_phrases:
  - "barter overlay upstream intake"
  - "phase 15 barter overlay upstream intake"
  - "repin missing upstream links"
  - "mcp-tooling bare health keyword"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: barter-overlay-upstream-intake

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `worktrees/441-barter-overlay-upstream-intake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-harden-overlay-engine-from-fable-review |
| **Successor** | None |
| **Handoff Criteria** | The operator answers the `family` question in section 7 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the skill and overlay build. It takes the message a vendoring project sent after it audited every overlay against Skilled `25b09c99a3`, copied byte for byte as `handover-from-barter-032.md` in this folder. Phases 10 and 12 took that project's earlier handovers.

**Scope Boundary**: The six items of that message. Items 2, 3 (bullets 1, 2, 3 and 5) and 5 are checked and fixed where the claim holds. Items 1, 3 (bullet 4), 4 and 6 were investigated and recorded as open questions; the operator then answered all but item 6, and those answers are built.

**Dependencies**:
- The vendoring project's tree and overlay folder, read only.
- The compiled-routing guard and admission tools in `.skilled/bin/`.

**Deliverables**:
- Four upstream file fixes and one mcp-tooling routing fix, committed.
- A finding for the re-pin report, with its cause.
- Five operator questions with options and one recommendation each.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The vendoring project keeps overlays for Skilled files that are wrong upstream: a stale hub list, two template sentences, an example script that misses the env names `.env.example` declares, and a bare `health` keyword that routes backend health checks to Obsidian. It also reports that a re-pin left five upstream links unwritten while plain `status` passed.

### Purpose
Each claim is either fixed upstream with a passing check, shown not to be a problem, or handed to the operator as a decision with evidence, so the project can drop overlays at its next re-pin.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "check the health of the gaia-services pods"
{"hubId":"mcp-tooling","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-plus-mcp","packetId":"mcp-obsidian","packetKind":"workflow","skillId":"mcp-tooling","workflowMode":"mcp-obsidian"}],"effectivePolicyHash":"7ac75f9a3eb05baea9c38797a766db5ae6ec019ecff2a2e3afee02522d60c17b","generation":4}

$ git diff --no-renames --name-status d0fc9d7 d97c051 -- .skilled/hooks/dist-freshness
M	.skilled/hooks/dist-freshness/README.md
D	.skilled/hooks/dist-freshness/claude/README.md
D	.skilled/hooks/dist-freshness/codex/README.md
D	.skilled/hooks/dist-freshness/cursor/README.md
D	.skilled/hooks/dist-freshness/devin/README.md
D	.skilled/hooks/dist-freshness/opencode/README.md

$ node --test .skilled/commands/doctor/scripts/tests   (before any change)
ℹ tests 1234
ℹ pass 1234
ℹ fail 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Find why the re-pin from `d0fc9d7` to `d97c051` did not write the five dist-freshness links.
- Correct the catalog hub list, the 9b sentence, the `_pathContract` file name and the Obsidian example's env names.
- Remove the bare `health` keyword and alias from mcp-tooling, add "inspect the dom" and "capture repl evidence", and re-mint the hub's activation manifest.
- Record options and a recommendation for items 1, 3 bullet 4, 4 and 6, and for the plain-status note item 2 asks for.
- Add the `documentation` and `design` families, move sk-doc and sk-design to them, and re-mint both hubs' activation manifests.
- Fix the two outranked reach phrases, `figma mcp` and `ruleset context`, in the advisor's explicit lane.

### Out of Scope
- Changing the re-pin's copy set - the operator chose a plain-status note instead.
- Removing the bare `aside` keyword - it broke three explicit Aside requests in the replay.
- Any write in the vendoring project's tree - it is read only here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/feature-catalog/governance/feature-flag-governance.md` | Modify | List the seven `COMPILED_ROUTING_HUBS` entries |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md` | Modify | Say 9b fails unless `PARENT_HUB_CHECK_STRICT=0` |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json` | Modify | Name `parent-skill-root-router-template.md` |
| `.skilled/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh` | Modify | Fall back to the prefixed env names |
| `.skilled/skills/mcp-tooling/hub-router.json` | Modify | Drop bare `health`, add two phrases |
| `.skilled/skills/mcp-tooling/mode-registry.json` | Modify | Drop the `health` alias |
| `.skilled/skills/mcp-tooling/ROUTER.md` | Modify | Mirror the keyword change in the prose fallback router |
| `.skilled/skills/mcp-tooling/graph-metadata.json` | Modify | Carry "capture repl evidence" into stage one through the generator |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-tooling/manifest.json` and its authored copy | Modify | Re-mint to the new policy hash |
| The eight family allowlists: `skill-graph-db.ts` (type and const), `skill_graph_compiler.py`, `skill-graph-tools.ts`, `skill-advisor-cli-manifest.ts`, `query.ts`, `parent-skill-check.cjs`, and the parent template sentence | Modify | Add `documentation` and `design` |
| `vocabulary-agreement.vitest.ts` | Modify | Add both to the canon set and read the new template sentence |
| `sk-doc` and `sk-design` `graph-metadata.json` and `SKILL.md` | Modify | Move to `documentation` and `design` |
| `skill-graph-metadata-template.json` | Modify | List the new families and prefer a domain family |
| `runtime/scripts/skill-graph.json` | Modify | Recompile with the new families |
| sk-doc and sk-design activation manifests and their authored copies | Modify | Re-mint to the new policy hashes |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Add the `figma mcp` and `ruleset context` anchors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The re-pin report has a named cause, checked against git history | The cause names the commits and paths that show it |
| REQ-002 | Each fixed file states what the code it describes does | Each file matches the code it names, and `validate_document.py` prints 0 issues on the two Markdown files |
| REQ-003 | mcp-tooling stops routing bare health prompts to Obsidian and keeps serving compiled | The gaia-services prompt defers, `compiled-route-status.cjs --hub mcp-tooling` prints `compiled-serving`, and admission prints 16 pass, 0 drift |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No hub check regresses | `parent-skill-check.cjs .skilled/skills/mcp-tooling` prints `OK`, the guard prints every hub fresh, and the doctor suite keeps `fail 0` |
| REQ-005 | Each item not changed carries options and one recommendation | Section 7 holds one question per item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `compiled-route.cjs --hub mcp-tooling` defers "check the health of the gaia-services pods" and still routes "chart my apple health data in obsidian" to mcp-obsidian.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The activation manifest must match the hub's compiled policy hash | A keyword edit without a re-mint drops the hub to legacy routing | Re-mint both manifests and confirm with `compiled-route-guard.cjs` |
| Risk | Dropping a keyword loses requests that used it correctly | Med | Replay a before-and-after prompt set and keep any keyword whose removal loses a correct route |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered 2026-11-17 by the operator: B. Item 2, a note in plain `status` when the audit would fail: (A) leave it, and point the project at `status --audit`; (B) a note limited to unowned paths missing from the tree; (C) a re-pin pre-flight that refuses on such a path; (D) a re-pin that restores such a path. Recommendation: B. The missing-only pass took about 0.1 s over the 20,450 pinned paths of the project's tree, while the full audit added about 4 to 6 s to a 1.7 to 2.4 s status. B would have flagged the five links at the first status. Like the audit, it can run only when the manifest's `pin.checkout` names a readable checkout holding the pinned commit. D contradicts the refusal the re-pin already gives a missing path it copies. Built as a plain-status NOTE in `36f16fa6b0f`: it costs 0.1 to 0.2 s on the project's tree, is skipped silently without a readable checkout, and is left out under `--audit`.
- Answered 2026-11-17 by the operator: A. Item 1, the hub-routing playbook pages: (A) rewrite the 21 failing pages to the `playbook_feature` template; (B) exempt `hub-routing/` pages from the rule. Recommendation: A. Of 243 playbook pages that carry route gold, 222 already pass the full template, cli-classifier's hub-routing pages among them. The 16 mcp-tooling pages and five cli-external-orchestration pages are the only ones that fail. Built in `89eaaee43c5`: all 21 pages report 0 issues, with every prompt and gold field unchanged.
- Answered 2026-11-17 by the operator: take the run-file exemption with its test, define a real `rule` type, fix the 7 example pages, and do not take the "at a glance" alias. Item 3 bullet 4, the validator exemptions: the compiled-routing `report.md` and `serving-snapshot.md` exemption is general, since all 17 such files in Skilled fail today. The `repo-rules/` need is general too, since all 10 rule files fail as READMEs, but a `rule` type with no required sections turns the check off rather than defining it. The `examples/` exemption is too wide, since 21 of 28 example pages pass today and the 7 that fail sit in mcp-tooling's figma, mobbin and refero packets. The "at a glance" alias is project-only, since no Skilled README uses it. The overlay also extends intro checks to README files, which the message does not mention; on 456 Skilled READMEs the failing count stayed at 2 under both validators, but intro findings were compared by exit status only. Recommendation: adopt the run-file exemption with its test, define a real `rule` type, and fix the 7 example pages instead of exempting the folder. Built in `6f946452805`: the rule type requires Fires when, The rule and a self-check, and all 10 rule files pass.
- Answered 2026-11-17 by the operator: take the stage-one fallback; replace the silent retry with a bounded wait that reports a still-stale probe as stale and failing; take the 14-skill generator with a `--write` run and a routing regression check. Item 4, the two sk-create-skill scripts: the vocabulary-reach fallback for a stage-one-only hub covers a `router_state` the hub template defines, though no Skilled hub uses it today. The four-try advisor retry hides a degraded advisor rather than fixing it, though this phase hit that state: after a routing metadata edit the advisor stayed `stale` on a watcher reindex and every reach probe returned `probe-error`. The generator change checks 14 skills instead of 7 on Skilled's tree and fails with 27 missing phrases across cli-orca, mcp-code-mode, sk-prompt and system-skilled-doctor. Recommendation: adopt the stage-one fallback, leave the retry out, and adopt the generator change only with a `--write` run and an advisor regression check, because it changes stage-one vocabulary for four skills. Built in `6f946452805`: the write added 27 phrases, and the 195-prompt corpus (117 top-1 correct, 5 false fires) and the 84-case regression set (84 pass) did not change.
- Answered 2026-11-17 by the operator: new domain families, named `documentation` and `design`. Item 6, the `family` field: no Skilled hub used `sk-hub`. The seven hubs carried cli, mcp, sk-code, deep-loop and sk-util, and the scorer reads `family === 'cli'` in `fusion.ts` and `executor-delegation.ts`. The options were (A) set every hub to `sk-hub`, (B) keep each hub's domain family and move sk-doc and sk-design to `sk-hub`, (C) change only the template sentence, or new domain families. The operator chose new domain families: sk-doc moves to `documentation` and sk-design to `design`, both added to the eight family allowlists, and both templates now say a hub keeps its domain family and takes `sk-hub` only when none fits. The project sets `sk-hub` on sk-doc, sk-design and sk-git. It should drop the sk-doc and sk-design overlays and take these values, not read them as upstreamed, and keep its sk-git overlay.
- Answered 2026-11-17 by the operator: fix both outranked reach phrases in this phase. `figma mcp` lost to sk-code because the bare `mcp` token boost (+0.65 to sk-code) outweighed mcp-tooling's exact declared phrase. `ruleset context` lost to system-spec-kit because the bare `context` token boost (+0.65 to system-spec-kit) did the same against sk-code. Two phrase anchors in the explicit lane hand each phrase to the hub that declares it.
<!-- /ANCHOR:questions -->

---

---
title: "Implementation Plan: Phase 1: shared-and-hub-docs"
description: "Repoint every legacy path in the sk-code shared tier, keep one copy of the Webflow pattern assets, make each copied fact point to its owner, describe three surfaces in every owned doc and release the hub as 2.2.5.0, as 105 single-change dispatch units checked one by one."
trigger_phrases:
  - "shared and hub docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: shared-and-hub-docs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, three JSON descriptors, one Python-in-Markdown router block |
| **Framework** | sk-code parent hub with a root `ROUTER.md`, validated by the root-router contract and the router-sync guard |
| **Storage** | None |
| **Testing** | `verify_router_sync.cjs`, `check-rule-copies.js`, `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs`, `validate_document.py`, `hvr_scan.py`, and the two scratch checkers `check-links.cjs` and `check-unit.cjs` |

### Overview
The shared tier and the hub front pages drifted after the packet merge and the Obsidian surface landed. This plan rewrites only text: 97 single-span edits and one new changelog, three file deletions, one folder removal and three ripple commands, each a dispatch unit in `scratch/dispatch-units.json` with its own check. Every OLD text was proven to occur exactly once, in the order the units apply, by `scratch/gen_units.py`. A dry run of all units on a copy of the hub kept router-sync at 5/5, the rule-copy canary, `parent-skill-check.cjs` and the leaf manifest green, and left only the compiled manifest stale, which T116 re-mints.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-owner documentation repair: each fact gets one owning file, and every other file either states it once or points to the owner.

### Key Components
- **Shared references** (`.skilled/skills/sk-code/shared/references/`): eight files carried 24 legacy-family lines (`rg` count at plan time). Each legacy path becomes the real repo-root path inside the owning packet, written as a backticked `.skilled/skills/sk-code/...` path, the form `error-recovery.md` and the debugging checklist already used for cross-packet pointers, so `test -e` resolves it from the repository root.
- **Intra-shared links**: three forms existed (`references/x.md`, `./x.md` and the full `.skilled/skills/sk-code/shared/...` path). All become the shared README's form, a Markdown link whose label is the backticked file name and whose target starts with `./` or `../`, relative to the linking file.
- **Pattern assets**: `shared/assets/patterns/` held older copies of `validation-patterns.js` and `wait-patterns.js` (both `diff -q` pairs differ at plan time) plus a README routed under `IMPLEMENTATION` beside the Webflow README. The Webflow copies stay. The shared route (`ROUTER.md:382`), the shared-control entry (`ROUTER.md:595`), the three files and the two folders go, and the shared README section 6 points to the Webflow folder.
- **Shared controls** (`ROUTER.md:583-596`, `SKILL.md:63`): see Decision D2.
- **Load-tier prose** (`ROUTER.md:111`, `:604`, `:608`, `:616`, `:617`): the map's `DEFAULT_RESOURCE` emits stack detection, phase detection and `code-quality-standards.md` on every route, and the other three universal files only under `CODE_QUALITY`, `DEBUGGING` and `IMPLEMENTATION`. The replay (`router_replay_lib.cjs:585-627`) keeps any non-surface entry the matched intents map. The prose now says exactly that and does not change the map.
- **Canonical surface sentence**: a `**Surface list.**` paragraph after the hub `SKILL.md` surface table. The phase lifecycle and the hub README point to it.
- **Versioning**: hub release 2.2.4.0 to 2.2.5.0 (patch: docs and cleanup) in `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json` and `README.md`, plus `changelog/v2.2.5.0.md` in the v2.2.4.0 entry's shape. Child docs keep their derived `version:` lines, per the frontmatter-versioning standard section 4.

### Data Flow
The builder applies units T014 to T115 in order, runs the check after each, then T116 re-mints the compiled manifest (the policy hash reads the hub `SKILL.md`, `hub-router.json` and `mode-registry.json`, which all change), T117 copies it to its archive. T116 to T118 are orchestrator-owned: the re-mint and copy run once after every child, and T118 regenerates the leaf manifest and then checks it, because this child's deletions and 005's new checker leaf both change the leaf set.

### Extra batches
Two batches were added after the main chain was planned, each in its own scratch unit file. Batch 1 (T146 to T161, verified by T162) fixes hits that 005's doc-claims checker found in hub files no other child owns: retired packet keys and the old Webflow checklist paths in six hub playbook scenarios, and the retired keys in the graph-metadata.json causal_summary. Their OLD texts were computed against the tree after the main chain ran. Batch 2 (T163 to T165, verified by T166) replaces the three OpenCode-only subsections in workflow-implement.md and workflow-verify.md with pointers to the OpenCode guardrails file, which 005 creates, so it runs after 005. The earlier units T039 edit inside the Verification Reality subsection, so batch 2 runs after the main chain. Batch 2 also carries T167, added after child 002 moved the review cache out of the repository: it rewrites the review mode's writeScopeNote in mode-registry.json to name the user cache path and drops "untracked", and T166 checks it.

### Decisions

| ID | Decision | Why |
|----|----------|-----|
| D1 | Cross-packet pointers in shared docs use the backticked repo-root form `.skilled/skills/sk-code/<packet>/...`, and pointers within the shared tier use `./` or `../` Markdown links | Two pointer kinds, each with one form the scratch checker can resolve; the shared README already uses the link form for its own files |
| D2 | `SHARED_CONTROL_RESOURCES` stays the list of `shared/` paths that `RESOURCE_MAP` references, seven entries after the pattern README leaves. Its comment declares it plus `DEFAULT_RESOURCE` as the complete hub-level control set, and `SKILL.md:63` points there with no count | The root-router contract rejects a declared control that no `RESOURCE_MAP` entry references (`root-router-contract.cjs:613-648`), so `stack-detection.md` and `phase-detection.md` cannot join the list without changing the routing map |
| D3 | The hub README takes the hub release version, and the `SKILL.md` version-authority sentence names it | The README is a hub-root front page read beside `SKILL.md`, and `ROUTER.md` is the precedent for a hub-root doc carrying the release version instead of a derived child-doc version |
| D4 | The comment-density rule lives in a new `### Comment density` subsection inside `code-style-guide.md` section 4, whose heading `## 4. COMMENTING` keeps its text and number | The hooks and the ephemeral-pointer audit cite `code-style-guide.md §4`, and 004-webflow-and-obsidian and 005-opencode-and-guards link that section from their budget rows |
| D5 | The "OpenCode Surface Only" subsections stay where they are in this child | No OpenCode packet reference holds that content today, so moving it would mean writing a file 005 owns |
| D6 | `mode-registry.json`'s two-surface description, its review write-scope note's old `code-review` key (T103, asked for by 002-review-mode) and the hub `SKILL.md` `workflow_*.md` globs are fixed here although no listed finding names them. The cache path in that note, `.skilled/.code-review-cache/<repo-ref>.jsonl`, already matches `sk-code-review/SKILL.md:491` and `references/pr-state-dedup.md:41`, so it stays | Same files, same drift class, and the requirement that no owned file describes two surfaces would otherwise fail |
| D7 | The "across WEBFLOW and OPENCODE" sentences in the two universal checklists, `error-recovery.md`'s description and `code-quality-standards.md:16` stay | Those docs carry Webflow and OpenCode command sets only, so the sentence is accurate. Adding Obsidian rows would invent commands the Obsidian packet runs in another repository |

### Handoffs

| To | Item |
|----|------|
| 005-opencode-and-guards | Make `verify_router_sync.cjs` read `SHARED_CONTROL_RESOURCES` and `DEFAULT_RESOURCE` from `ROUTER.md` section 11 instead of `PARENT_TIER_ALLOWLIST`. After this child, the list's `shared/assets/patterns/README.md` entry is unused, and `sk-code-review/assets/code-quality-checklist.md` cannot move into the ROUTER list because the contract accepts only `shared/` paths, so the guard must keep that one entry its own way |
| 005-opencode-and-guards | Create an OpenCode reference holding the three "OpenCode Surface Only" subsections (`workflow-implement.md:78-84`, `workflow-verify.md:76-99`). A later change then turns the shared subsections into pointers |
| 005-opencode-and-guards | Label `naming-and-commenting.md:170` (three per ten lines) as the OpenCode setting and link `code-style-guide.md` section 4, and add the OBSIDIAN-versus-WEBFLOW collision case to the canary fixture |
| 004-webflow-and-obsidian | Label `cross-language-rules.md:47` and `javascript/quick-reference.md:68` (five per ten lines) as the Webflow setting and link `code-style-guide.md` section 4 |
| 003-quality-mode | The quality `SKILL.md` hook rows (the other half of f-iter012-001) use the live-hook wording T055 writes into the universal standard |
| Orchestrator | T119 Hermes regeneration, T120 trigger-index rebuild and T121 the two sk-doc README fixtures, each once after every build |

### Finding status at plan time

Every finding in this child reproduced on 2026-10-10 (T012 records the commands). None was already fixed by an earlier phase.

### Proposed text

The units below change more than one line or delete a line. Each block is the exact text of `scratch/units/<task>.old.txt` or `.new.txt`. A single-line unit is quoted inline in its task.

#### Proposed text T014: Drop the shared pattern README route from RESOURCE_MAP IMPLEMENTATION (`.skilled/skills/sk-code/ROUTER.md`)

OLD:

~~~~text
        "shared/assets/patterns/README.md",
        "sk-code-webflow/assets/integrations/README.md",
~~~~

NEW:

~~~~text
        "sk-code-webflow/assets/integrations/README.md",
~~~~

#### Proposed text T015: Rewrite the SHARED_CONTROL_RESOURCES comment as the one declared control set and drop the shared pattern README entry (`.skilled/skills/sk-code/ROUTER.md`)

OLD:

~~~~text
# Hub-shared control documents: normalized contained shared/ paths that resolve
# on disk and are referenced by RESOURCE_MAP but are exempt from typed-leaf
# projection (they have no single packet owner). Validated by the root-router
# contract and never projected as typed leaves.
SHARED_CONTROL_RESOURCES = [
    "shared/references/universal/multi-agent-research.md",
    "shared/references/universal/code-quality-standards.md",
    "shared/references/universal/code-style-guide.md",
    "shared/references/universal/error-recovery.md",
    "shared/references/universal-debugging-checklist.md",
    "shared/references/universal-verification-checklist.md",
    "shared/references/performance-loading-checklist.md",
    "shared/assets/patterns/README.md",
]
~~~~

NEW:

~~~~text
# Hub-level shared controls, declared once here. This list holds every
# contained shared/ path that RESOURCE_MAP references but that is exempt from
# typed-leaf projection, because it has no single packet owner. The root-router
# contract validates each entry and requires RESOURCE_MAP to reference it.
# DEFAULT_RESOURCE above is the other half of the set: its always-loaded
# preamble paths are hub-level controls too. No other shared/ path is a
# control, so a guard that needs the control set reads these two lists.
SHARED_CONTROL_RESOURCES = [
    "shared/references/universal/multi-agent-research.md",
    "shared/references/universal/code-quality-standards.md",
    "shared/references/universal/code-style-guide.md",
    "shared/references/universal/error-recovery.md",
    "shared/references/universal-debugging-checklist.md",
    "shared/references/universal-verification-checklist.md",
    "shared/references/performance-loading-checklist.md",
]
~~~~

#### Proposed text T023: Delete the assets/patterns layout bullet from the shared README (`.skilled/skills/sk-code/shared/README.md`)

OLD:

~~~~text
- `assets/patterns/`: executable pattern templates shipped with the skill.
~~~~

NEW (empty: the OLD lines are deleted):

~~~~text
~~~~

#### Proposed text T024: Replace the shared README assets table with a pointer to the Webflow pattern folder (`.skilled/skills/sk-code/shared/README.md`)

OLD:

~~~~text
## 6. ASSETS (`assets/patterns/`)

| Path | What it is |
|---|---|
| [`assets/patterns/validation-patterns.js`](./assets/patterns/validation-patterns.js) | Defense-in-depth, multi-layer validation pattern templates (production-ready). |
| [`assets/patterns/wait-patterns.js`](./assets/patterns/wait-patterns.js) | Observer-based async DOM waiting patterns (MutationObserver / IntersectionObserver) instead of polling. |
| [`assets/patterns/README.md`](./assets/patterns/README.md) | Code-facing README for the pattern scripts in this folder. |
~~~~

NEW:

~~~~text
## 6. PATTERN ASSETS

The shared tier ships no pattern assets. The validation and wait pattern templates are owned by the Webflow packet, beside its interaction-gate and performance patterns: [`../sk-code-webflow/assets/patterns/README.md`](../sk-code-webflow/assets/patterns/README.md).
~~~~

#### Proposed text T033: Insert the OBSIDIAN PHASES section and renumber IRON LAWS to 6 (`.skilled/skills/sk-code/shared/references/phase-detection.md`)

OLD:

~~~~text
## 5. IRON LAWS
~~~~

NEW:

~~~~text
## 5. OBSIDIAN PHASES

| Phase | Resources / Evidence |
| --- | --- |
| Research | The read-only `sk-code-obsidian` evidence packet: plugin API, data layer and view-renderer references |
| Implementation | `.skilled/skills/sk-code/sk-code-obsidian/references/standards/code-standards.md` plus the class-naming and stylesheet-ownership references |
| Code Quality | `.skilled/skills/sk-code/sk-code-obsidian/references/standards/code-standards.md` and the recorded lint baseline |
| Debugging | Failing vitest or build output, screenshot diffs and root-cause analysis |
| Verification | The gate command set in `.skilled/skills/sk-code/sk-code-obsidian/references/verification.md`, run in the plugin repository |

The Obsidian surface is read-only evidence. The bundled workflow mode runs these phases, and the gate commands run in the plugin repository, not in this hub.

---

## 6. IRON LAWS
~~~~

#### Proposed text T037: Add the OBSIDIAN-versus-WEBFLOW collision row to stack-detection.md section 4 (`.skilled/skills/sk-code/shared/references/stack-detection.md`)

OLD:

~~~~text
| Changed `apps/desktop/src/styles/app.css` AND changed `.opencode/agents/code.md` | **OPENCODE** | `.opencode/` target wins when a task also touches a path outside the hub |
~~~~

NEW:

~~~~text
| Changed `apps/desktop/src/styles/app.css` AND changed `.opencode/agents/code.md` | **OPENCODE** | `.opencode/` target wins when a task also touches a path outside the hub |
| Obsidian plugin repo-root markers (`manifest.json` with `minAppVersion`, `esbuild.config.mjs`) AND a Webflow library marker (`new Lenis`, `window.gsap`) in the same tree, no `.skilled/` target | **OBSIDIAN** | Precedence OPENCODE > OBSIDIAN > WEBFLOW: the OBSIDIAN branch returns early, so the Webflow marker never overwrites it |
~~~~

#### Proposed text T038: Use the relative link form for phase-detection.md in stack-detection.md (`.skilled/skills/sk-code/shared/references/stack-detection.md`)

OLD:

~~~~text
- `references/phase-detection.md`
~~~~

NEW:

~~~~text
- [`./phase-detection.md`](./phase-detection.md)
~~~~

#### Proposed text T039: Replace the copied validate.sh contract in workflow-verify.md with a pointer to its owner (`.skilled/skills/sk-code/shared/references/workflow-verify.md`)

OLD:

~~~~text
The authoritative `validate.sh` exit-code contract is: `0=pass`, `1=user error`, `2=validation error`, `3=system error`. Do not describe exit `1` as warnings; warnings only become a failing validation outcome under `--strict`, which exits `2` unless the folder is grandfathered. `--strict` also runs strict-only validators such as evidence-marker lint, generated-metadata integrity/drift checks, command-tree parity, and completion freshness when that feature flag is enabled.
~~~~

NEW:

~~~~text
The exit-code and warning contract of `validate.sh` is owned by `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` (section 1 for the exit taxonomy, section 14 for the ways a run misleads). Read it there, not from a copy here. The one fact this workflow needs: a completion claim requires the explicit `RESULT: PASSED` line, because a warning never changes the exit code and exit status alone has misled in both directions.
~~~~

#### Proposed text T040: Point the baseline floor in workflow-verify.md to its repo rule (`.skilled/skills/sk-code/shared/references/workflow-verify.md`)

OLD:

~~~~text
No baseline means no broad no-regressions claim. A narrower claim tied to fresh evidence is still allowed.
~~~~

NEW:

~~~~text
No baseline means no broad no-regressions claim. A narrower claim tied to fresh evidence is still allowed.

The baseline floor is owned by `.skilled/repo-rules/evidence-and-proof.md` section 5 (BASELINES). This table is the sk-code record shape for it.
~~~~

#### Proposed text T043: Point the debug-loop floors in workflow-debug.md to their repo rule (`.skilled/skills/sk-code/shared/references/workflow-debug.md`)

OLD:

~~~~text
9. Hand the fixed state to verification with the reproduction command, before/after result, and residual risk.
~~~~

NEW:

~~~~text
9. Hand the fixed state to verification with the reproduction command, before/after result, and residual risk.

The reproduce, trace-to-source and one-cause-at-a-time floors in this loop are owned by `.skilled/repo-rules/root-cause-and-debugging.md` section 1 (THE LOOP). This loop is how sk-code applies them, so a change to a floor goes there first.
~~~~

#### Proposed text T045: Use the relative link form for phase-detection.md in the verification checklist (`.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`)

OLD:

~~~~text
- `references/phase-detection.md`
~~~~

NEW:

~~~~text
- [`./phase-detection.md`](./phase-detection.md)
~~~~

#### Proposed text T046: Repoint the debugging checklist pointer of the verification checklist (`.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`)

OLD:

~~~~text
- `assets/universal/checklists/debugging_checklist.md`
~~~~

NEW:

~~~~text
- [`./universal-debugging-checklist.md`](./universal-debugging-checklist.md)
~~~~

#### Proposed text T049: Use the relative link form for phase-detection.md in the debugging checklist (`.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`)

OLD:

~~~~text
- `.skilled/skills/sk-code/shared/references/phase-detection.md`
~~~~

NEW:

~~~~text
- [`./phase-detection.md`](./phase-detection.md)
~~~~

#### Proposed text T050: Use the relative link form for error-recovery.md in the debugging checklist (`.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`)

OLD:

~~~~text
- `.skilled/skills/sk-code/shared/references/universal/error-recovery.md`
~~~~

NEW:

~~~~text
- [`./universal/error-recovery.md`](./universal/error-recovery.md)
~~~~

#### Proposed text T051: Use the relative link form for the verification checklist in the debugging checklist (`.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`)

OLD:

~~~~text
- `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`
~~~~

NEW:

~~~~text
- [`./universal-verification-checklist.md`](./universal-verification-checklist.md)
~~~~

#### Proposed text T055: Name the live write-time and commit-time gates in code-quality-standards.md section 7 (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`)

OLD:

~~~~text
   - **Write-time** (Claude Code only): `claude-posttooluse.sh` fires on every Write/Edit tool call and warns inline before the next AI turn
   - **Commit-time**: `.skilled/hooks/git/pre-commit` blocks any commit with violations; bypass with `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit`
~~~~

NEW:

~~~~text
   - **Write-time** (Claude Code only): `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired as the `Write|Edit` `PostToolUse` hook in `.claude/settings.json`, fires on every Write/Edit tool call and warns inline before the next AI turn
   - **Commit-time**: `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath` by `.skilled/scripts/install-git-hooks.sh`, blocks any commit with violations; bypass with `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit`. The older `.skilled/hooks/git/pre-commit` and `sk-code-quality/scripts/hooks/claude-posttooluse.sh` are direct-test helpers, not live gates
~~~~

#### Proposed text T056: Use the relative link form for code-style-guide.md in code-quality-standards.md (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`)

OLD:

~~~~text
- `references/universal/code-style-guide.md`
~~~~

NEW:

~~~~text
- [`./code-style-guide.md`](./code-style-guide.md)
~~~~

#### Proposed text T057: Use the relative link form for error-recovery.md in code-quality-standards.md (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`)

OLD:

~~~~text
- `references/universal/error-recovery.md`
~~~~

NEW:

~~~~text
- [`./error-recovery.md`](./error-recovery.md)
~~~~

#### Proposed text T058: Repoint the debugging checklist pointer of code-quality-standards.md (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`)

OLD:

~~~~text
- `assets/universal/checklists/debugging_checklist.md`
~~~~

NEW:

~~~~text
- [`../universal-debugging-checklist.md`](../universal-debugging-checklist.md)
~~~~

#### Proposed text T059: Repoint the verification checklist pointer of code-quality-standards.md (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`)

OLD:

~~~~text
- `assets/universal/checklists/verification_checklist.md`
~~~~

NEW:

~~~~text
- [`../universal-verification-checklist.md`](../universal-verification-checklist.md)
~~~~

#### Proposed text T060: Use the relative link form for phase-detection.md in code-quality-standards.md (`.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`)

OLD:

~~~~text
- `references/phase-detection.md`
~~~~

NEW:

~~~~text
- [`../phase-detection.md`](../phase-detection.md)
~~~~

#### Proposed text T064: Add the comment-density owner subsection to code-style-guide.md section 4 (`.skilled/skills/sk-code/shared/references/universal/code-style-guide.md`)

OLD:

~~~~text
### Never comment what the code does
~~~~

NEW:

~~~~text
### Comment density

This guide owns the comment-density rule. A comment earns its place by naming a hidden constraint, an invariant, a workaround's cause or a surprise, never by filling a quota, so no universal count applies. Each surface may set its own numeric budget as that surface's setting, and a surface budget never removes a comment this section requires. The Webflow surface sets five comments per ten lines in `.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`, and the OpenCode surface sets three per ten lines in `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md`.

### Never comment what the code does
~~~~

#### Proposed text T067: Use the relative link form for code-quality-standards.md in code-style-guide.md (`.skilled/skills/sk-code/shared/references/universal/code-style-guide.md`)

OLD:

~~~~text
- `references/universal/code-quality-standards.md`
~~~~

NEW:

~~~~text
- [`./code-quality-standards.md`](./code-quality-standards.md)
~~~~

#### Proposed text T068: Use the relative link form for error-recovery.md in code-style-guide.md (`.skilled/skills/sk-code/shared/references/universal/code-style-guide.md`)

OLD:

~~~~text
- `references/universal/error-recovery.md`
~~~~

NEW:

~~~~text
- [`./error-recovery.md`](./error-recovery.md)
~~~~

#### Proposed text T071: Use the relative link form in the error-recovery.md key sources (`.skilled/skills/sk-code/shared/references/universal/error-recovery.md`)

OLD:

~~~~text
`.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md` (4-phase workflow)
~~~~

NEW:

~~~~text
[`../universal-debugging-checklist.md`](../universal-debugging-checklist.md) (4-phase workflow)
~~~~

#### Proposed text T072: Use the relative link form for the debugging checklist in error-recovery.md (`.skilled/skills/sk-code/shared/references/universal/error-recovery.md`)

OLD:

~~~~text
- `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`
~~~~

NEW:

~~~~text
- [`../universal-debugging-checklist.md`](../universal-debugging-checklist.md)
~~~~

#### Proposed text T073: Use the relative link form for the verification checklist in error-recovery.md (`.skilled/skills/sk-code/shared/references/universal/error-recovery.md`)

OLD:

~~~~text
- `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`
~~~~

NEW:

~~~~text
- [`../universal-verification-checklist.md`](../universal-verification-checklist.md)
~~~~

#### Proposed text T074: Use the relative link form for code-quality-standards.md in error-recovery.md (`.skilled/skills/sk-code/shared/references/universal/error-recovery.md`)

OLD:

~~~~text
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`
~~~~

NEW:

~~~~text
- [`./code-quality-standards.md`](./code-quality-standards.md)
~~~~

#### Proposed text T075: Use the relative link form for phase-detection.md in error-recovery.md (`.skilled/skills/sk-code/shared/references/universal/error-recovery.md`)

OLD:

~~~~text
- `.skilled/skills/sk-code/shared/references/phase-detection.md`
~~~~

NEW:

~~~~text
- [`../phase-detection.md`](../phase-detection.md)
~~~~

#### Proposed text T077: Use the relative link form in the multi-agent-research.md key sources (`.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md`)

OLD:

~~~~text
`references/phase-detection.md`.
~~~~

NEW:

~~~~text
[`../phase-detection.md`](../phase-detection.md).
~~~~

#### Proposed text T079: Use the relative link form for phase-detection.md in the multi-agent-research.md related list (`.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md`)

OLD:

~~~~text
- `references/phase-detection.md`
~~~~

NEW:

~~~~text
- [`../phase-detection.md`](../phase-detection.md)
~~~~

#### Proposed text T080: Use the relative link form for code-quality-standards.md in multi-agent-research.md (`.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md`)

OLD:

~~~~text
- `references/universal/code-quality-standards.md`
~~~~

NEW:

~~~~text
- [`./code-quality-standards.md`](./code-quality-standards.md)
~~~~

#### Proposed text T081: Use the relative link form for error-recovery.md in multi-agent-research.md (`.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md`)

OLD:

~~~~text
- `references/universal/error-recovery.md`
~~~~

NEW:

~~~~text
- [`./error-recovery.md`](./error-recovery.md)
~~~~

#### Proposed text T091: Bump the ROUTER.md version to 2.2.5.0 (`.skilled/skills/sk-code/ROUTER.md`)

OLD:

~~~~text
version: 2.2.4.0
router_state: active
~~~~

NEW:

~~~~text
version: 2.2.5.0
router_state: active
~~~~

#### Proposed text T094: Add the canonical surface-list sentence to the hub SKILL.md (`.skilled/skills/sk-code/SKILL.md`)

OLD:

~~~~text
| **sk-code-obsidian** | Obsidian-plugin design-system and source-convention evidence for the Note Database plugin. Read-only. | `sk-code/sk-code-obsidian/` |
~~~~

NEW:

~~~~text
| **sk-code-obsidian** | Obsidian-plugin design-system and source-convention evidence for the Note Database plugin. Read-only. | `sk-code/sk-code-obsidian/` |

**Surface list.** The hub has exactly three surfaces, WEBFLOW (`sk-code-webflow`), OPENCODE (`sk-code-opencode`) and OBSIDIAN (`sk-code-obsidian`), and two workflow modes, quality (`sk-code-quality`) and review (`sk-code-review`). Any other sk-code doc that counts surfaces points to this sentence.
~~~~

#### Proposed text T096: Add the six missing hub-root artifacts to the hub SKILL.md layout tree (`.skilled/skills/sk-code/SKILL.md`)

OLD:

~~~~text
sk-code/
  SKILL.md               # this routing hub (no per-mode code logic)
  ROUTER.md              # active stage-two surface router and shared-control declaration
  mode-registry.json     # the two-axis discriminator + advisorRouting (single source of truth)
  hub-router.json        # lexical routing signals + surfaceBundle policy for hub-local choice
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  sk-code-quality/       # quality mode packet     (workflow)
  sk-code-review/        # review mode packet      (workflow)
  sk-code-webflow/       # webflow surface packet  (read-only evidence; carries the workflow doctrine + Motion.dev animation overlay)
  sk-code-opencode/      # opencode surface packet (read-only evidence; carries the workflow doctrine)
  sk-code-obsidian/      # obsidian surface packet (read-only evidence)
  shared/                # shared surface-detection router, cross-mode helpers, and the implement/debug/verify workflow doctrine (references/workflow_*.md)
~~~~

NEW:

~~~~text
sk-code/
  SKILL.md               # this routing hub (no per-mode code logic)
  README.md              # human-facing front page for the hub
  ROUTER.md              # active stage-two surface router and shared-control declaration
  mode-registry.json     # the two-axis discriminator + advisorRouting (single source of truth)
  hub-router.json        # lexical routing signals + surfaceBundle policy for hub-local choice
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  leaf-manifest.json     # typed (workflowMode, leaf) pairs the router guards validate
  changelog/             # hub release notes, one v<version>.md per hub release
  feature-catalog/       # current-state inventory of the hub's routing capabilities
  manual-testing-playbook/  # routing and disambiguation scenarios for the hub
  benchmark/             # historical routing benchmark inputs and reports
  sk-code-quality/       # quality mode packet     (workflow)
  sk-code-review/        # review mode packet      (workflow)
  sk-code-webflow/       # webflow surface packet  (read-only evidence; carries the workflow doctrine + Motion.dev animation overlay)
  sk-code-opencode/      # opencode surface packet (read-only evidence; carries the workflow doctrine)
  sk-code-obsidian/      # obsidian surface packet (read-only evidence)
  shared/                # shared surface-detection router, cross-mode helpers, and the implement/debug/verify workflow doctrine (references/workflow-*.md)
~~~~

#### Proposed text T107: Add the Obsidian row to the hub README surface table (`.skilled/skills/sk-code/README.md`)

OLD:

~~~~text
| `sk-code-opencode` | System-code evidence: TypeScript, Python, shell and config standards, hooks, alignment verification, authoring checklists |
~~~~

NEW:

~~~~text
| `sk-code-opencode` | System-code evidence: TypeScript, Python, shell and config standards, hooks, alignment verification, authoring checklists |
| `sk-code-obsidian` | Obsidian-plugin design-system and source-convention evidence for the Note Database plugin |
~~~~

#### Proposed text T109: Add the Obsidian packet to the hub README related documents (`.skilled/skills/sk-code/README.md`)

OLD:

~~~~text
| [`sk-code-opencode/SKILL.md`](./sk-code-opencode/SKILL.md) | OpenCode surface packet |
~~~~

NEW:

~~~~text
| [`sk-code-opencode/SKILL.md`](./sk-code-opencode/SKILL.md) | OpenCode surface packet |
| [`sk-code-obsidian/SKILL.md`](./sk-code-obsidian/SKILL.md) | Obsidian surface packet |
~~~~

#### Proposed text T115: Create the hub changelog entry v2.2.5.0 (`.skilled/skills/sk-code/changelog/v2.2.5.0.md`, new)

~~~~markdown
---
title: "sk-code v2.2.5.0, Shared Tier Points at Real Files"
description: "The shared tier and hub docs now name three surfaces, point only at files that exist, keep one copy of each Webflow pattern asset and defer the validate.sh contract to its owner."
trigger_phrases:
  - "sk-code v2.2.5.0"
  - "sk-code 2.2.5.0"
  - "shared tier repointed"
importance_tier: "normal"
contextType: "general"
version: 2.2.5.0
---

# v2.2.5.0, Shared Tier Points at Real Files

The shared references and the hub front pages had drifted from the hub they describe. Eight shared docs pointed into folders that no longer exist, several pages still described two surfaces, and the shared tier shipped an older copy of two Webflow pattern files.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs` (Level 1)

## What's New at a Glance

- **Every shared pointer resolves.** Paths into the old `references/webflow/`, `references/opencode/`, `references/motion_dev/`, `assets/webflow/` and `assets/universal/` folders now name the real packet files, and links inside the shared tier use one relative form.
- **Three surfaces everywhere.** The hub `SKILL.md` carries one surface-list sentence, and the shared README, the phase lifecycle, the hub README, the feature catalog and both descriptors now name WEBFLOW, OPENCODE and OBSIDIAN.
- **One copy of each Webflow pattern asset.** `validation-patterns.js` and `wait-patterns.js` live only in `sk-code-webflow/assets/patterns/`, and the shared copies and their route are gone.
- **The validate.sh contract has one owner.** `workflow-verify.md` points to `validation-rules.md` and keeps only the rule that a completion claim needs an explicit `RESULT: PASSED`.
- **Live gates named correctly.** The universal quality standard names `.skilled/scripts/git-hooks/pre-commit` and the post-edit Claude adapter as the live comment-hygiene gates.
- **Comment density has one owner.** The universal style guide owns the rule and lets each surface set its own budget.
- **Load tiers match the map.** `ROUTER.md` no longer claims the whole universal tier loads on every route, and its shared-control list is the one declared set.

## Upgrade

No migration required. Readers who bookmarked `shared/assets/patterns/` use `sk-code-webflow/assets/patterns/` instead.
~~~~

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phase 2 is also `scratch/dispatch-units.json`, one unit per task from T014 to T118, each with a check command and its expected output; dispatch them one at a time and run each check before the next unit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Uniqueness**: `python3 -I scratch/gen_units.py` from the repository root rebuilds the units and prints `units=105 failures=0`, which proves every OLD text occurs once at the point its unit applies. Run it only before the build: after the build the OLD texts are gone by design.
- **Per unit**: `node scratch/check-unit.cjs <task>` prints `LANDED <task>` for every edit and the create. T138 counts 98.
- **Pointers**: `scratch/check-links.cjs` resolves every backticked `.skilled/` path and every `./` or `../` link in `shared/**/*.md`, the hub `SKILL.md` and the hub README. It skips one example input in a detection test case (`.skilled/skills/sk-doc/scripts/preview-server.js`). Plan-time dry run on the simulated tree: `checked=127 missing=0`.
- **Guards**: router-sync, the rule-copy canary, the compiled-route guard, the leaf manifest checks, `parent-skill-check.cjs` and the package validator, before (T002 to T006) and after (T126 to T129). The dry run on a copy of the hub with every unit applied passed all of them except compiled routing readiness, which reported `stale-manifest` as expected before the re-mint.
- **Docs**: `validate_document.py` and `hvr_scan.py` on every edited Markdown file and the new changelog, and the catalog package validator (`violations=2` before and after, both pre-existing description warnings).
- **Gap**: the Hermes copies, the trigger index and the sk-doc README fixtures go red until the orchestrator runs T119 to T121. T140 and T141 pin exactly which lines may appear.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js and Python 3 as used by the guards. `rg` for the searches.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` (the shared-control rule behind D2) and `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/router_replay_lib.cjs` (the load behavior the new prose describes). Neither changes.
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` sections 1 and 14 own the `validate.sh` contract T039 points to.
- `.claude/settings.json` wires `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` as the `Write|Edit` `PostToolUse` hook, and `.skilled/scripts/install-git-hooks.sh` installs `.skilled/scripts/git-hooks/pre-commit` through `core.hooksPath`, both read on 2026-10-10.
- Baseline state: the spec-kit trigger index `--check` already exits 1 at plan time from unrelated stale spec docs, so T120 is a full rebuild, not a repair of this child alone.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the tracked files with `git restore -- .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/description.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/feature-catalog .skilled/skills/sk-code/shared .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json`. This also brings back the three deleted pattern files.
- Delete the new `.skilled/skills/sk-code/changelog/v2.2.5.0.md`.
- If the orchestrator already ran T119 to T121, rerun those generators after the restore.
<!-- /ANCHOR:rollback -->

---

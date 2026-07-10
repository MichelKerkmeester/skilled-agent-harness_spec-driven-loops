---
title: "Implementation Summary: Phase 2 sk-prompt-124-remediation"
description: "5 merge-introduced referrer-sweep gaps and 3 pre-existing /prompt-improve save-path gaps from the sk-prompt/124 deep review are fixed: stale /prompt command refs in both agent mirrors, a stale allowed-tools frontmatter, a stale playbook precondition, 2 dead top-level prompt-models paths, path containment + overwrite guard, topic sanitization, .opencode/specs/ root preference, and a missing GLM-5.2 README row. C2 explicitly excluded as out of this phase's scope."
trigger_phrases:
  - "sk-prompt 124 remediation complete"
  - "prompt-improve hardening shipped"
  - "referrer sweep complete"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/002-sk-prompt-124-remediation"
    last_updated_at: "2026-07-10T05:50:20Z"
    last_updated_by: "claude"
    recent_action: "A5 18-file playbook sweep documented"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/agents/prompt-improver.md"
      - ".claude/agents/prompt-improver.md"
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-002-sk-prompt-124-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 12 candidate findings verified against live files, fixed, and re-verified; C2 excluded with a documented reason"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-sk-prompt-124-remediation |
| **Completed** | 2026-07-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-prompt`'s two runtime agent mirrors no longer route to a command that doesn't exist, its `prompt-models` packet no longer contradicts its own registry grant or points at a path nothing lives at, its manual-testing playbook no longer tells operators to grep files that moved, and `/prompt-improve` no longer writes files from unsanitized user text without a containment or overwrite check. This phase closes all 5 Cluster A merge-introduced findings from the 124 parent-hub deep review PLUS the broader A5 per-feature playbook referrer sweep (folded in per the operator "fix all" directive), hardens all 3 Cluster B pre-existing save-path gaps it inherited unchanged through the merge's `git mv`, and fixes 1 of 2 Cluster C doc-accuracy candidates - the 2nd (C2) is explicitly out of this phase's scope, not silently dropped.

### Cluster A: merge-introduced referrer-sweep gaps

The phase-006 referrer sweep that repointed paths after the sk-prompt/sk-prompt-models fold missed five spots. Both `prompt-improver.md` runtime mirrors (`.opencode/agents/`, `.claude/agents/`) still routed to the retired `/prompt` command across their Integration Touchpoint Contract table, Commands table, a NEVER-list line, a context-handoff example, and the ASCII summary box - 5 occurrences each, all now read `/prompt-improve` and `.opencode/commands/prompt-improve.md`. The `prompt-models` packet's own `SKILL.md` frontmatter still declared `allowed-tools: []`, contradicting the hub's `mode-registry.json`, which has always granted it `[Read, Grep, Glob]` - the packet's own metadata just hadn't caught up. The manual-testing-playbook's GLOBAL PRECONDITIONS block carried two dead-path lines: one pointed at the pre-fold hub-root `SKILL.md` for §2/§3/§7 content that now lives in `prompt-improve/SKILL.md`, and the adjacent one asserted that five pre-fold resource paths (`sk-prompt/references/depth_framework.md`, `sk-prompt/references/patterns_evaluation.md`, and three `assets/format_guide_*.md`) "resolve on disk" when they had all moved under `prompt-improve/`. Both are now repointed to their real nested locations, each confirmed to resolve on disk. (The second line was initially missed in the first pass and caught by a coordinator cross-verify — a reminder that a single-line sweep leaves its neighbor stale.) And two files (`README.md`, `context_budget.md`) still cited the dissolved top-level `.opencode/skills/prompt-models/...` path instead of the nested `sk-prompt/prompt-models/...` one.

That same "grep for a file that moved" rot ran deeper than the playbook's global preconditions. The A3 cross-verify surfaced it, and the coordinator authorized folding the full sweep into cluster A rather than deferring, since it is the identical merge-referrer-sweep class: the fold left `references/` and `assets/` under `prompt-improve/`, but 18 per-feature test files under `manual_testing_playbook/NN--*/` still ran `bash: rg '...' .opencode/skills/sk-prompt/references/...` (and one `ls .../references/`) against the now-empty hub-root paths — 21 dead absolute paths in all. Every one is repointed to its nested `prompt-improve/references/` or `prompt-improve/assets/` location, verified two ways: the acceptance grep for dead `sk-prompt/references|assets/` paths in those files returns zero, and each distinct nested target (plus both nested directories) resolves on disk. The 45 `../../references/` and 4 `../../assets/` relative Source-Anchor refs in the same files were deliberately left alone — they already resolve correctly post-fold because the playbook moved with the packet, so `../../` climbs to the packet root. One narrower residual is flagged rather than swept: 17 of those files ALSO grep the hub `sk-prompt/SKILL.md` for content the fold moved into `prompt-improve/SKILL.md` (the hub file still resolves, so it is not a dead path, but it returns 0 matches for sampled patterns while the packet SKILL.md returns them). That one is a genuinely different case — the hub SKILL.md keeps its own routing §2, so a blanket repoint would need a per-command check that each grep targets moved content — so it is left for a coordinator decision (Known Limitations #5).

### Cluster B: pre-existing `/prompt-improve` save-path hardening

Three real hardening gaps rode along unchanged through the merge's `git mv` from the old `/prompt` command - the review adjudicated all three as pre-existing, not introduced by this merge. The custom-path save branch (Q2=C) had no containment check and no overwrite guard: a crafted or careless path could resolve outside the repository, and an existing file at the target could get silently clobbered. The new-spec-folder branch (Q2=B) built a shell `mkdir` command directly from raw prompt-topic text - a path-injection surface, since the topic is free user input. And the whole save-location workflow (discovery, creation, and the Notes section) still assumed the legacy `specs/` root instead of the now-preferred `.opencode/specs/`.

Fixing this meant first understanding what "prefer `.opencode/specs/`" actually means on disk here: `specs` turned out to be a real, git-tracked symlink to `.opencode/specs` (`realpath specs` resolves to `.opencode/specs`; `git ls-files -- specs` shows it tracked), not two independent data stores - so the fix documents that relationship explicitly rather than inventing a "search both roots" dance that would have been theater. Step 5-C now resolves the custom path and rejects anything that escapes the `.opencode/specs/` spec-folder tree (absolute-elsewhere paths, repo paths outside the spec tree, `..` traversal that climbs out of the spec root) before creating anything, and checks for an existing file at the target before writing rather than clobbering it. That containment boundary is the spec tree, not the whole repository: this command's entire model is spec-folder-rooted saves (§1 PURPOSE, §7 NOTES), so Q2=C is the "I know the exact spec-folder path" escape hatch, not an arbitrary-repo-path writer - saving outside the spec tree is stated as a deliberate non-goal (the user is told to move the file manually if they need it elsewhere), so an arbitrary repo path can't silently pass as a spec save. Step 5-B now sanitizes the topic into a `[a-z0-9-]` slug - a whitelist, not a blacklist, so it strips shell metacharacters as a side effect - before that text ever touches a shell command, and creates new folders under `.opencode/specs/`. Setup Phase step 5 (discovery), step 9 (the background-ops preview), and §7 NOTES all now name `.opencode/specs/` as the canonical root, with legacy `specs/` documented as the same tree via the symlink rather than a separate fallback to search. (The first pass scoped C's containment to the repository root, which was too loose; a coordinator cross-verify caught it and it was tightened to the spec root to match the finding's intent.)

Fixing Step 5-B's root also meant touching Step 5-A, which wasn't one of the 3 cited findings but shares the same `[folder]` variable: once discovery returns full `.opencode/specs/...` paths instead of bare `specs/*` glob results, Step 5-A's old `mkdir -p specs/[folder]/prompts/` would have silently double-nested the path. That one line is now `mkdir -p [folder]/prompts/`, treating `[folder]` as the complete path discovery already returned.

### Cluster C: doc-accuracy

The `prompt-models` README's maintainer-facing Framework Map table listed four models and omitted the fifth active one, GLM-5.2. The new row (`COSTAR (fallback TIDD-EC, avoid RCAF) | lean | Empirical (benchmark 008)`) isn't invented - it's cross-verified against both `references/models/_index.md` (the hub's own per-model index) and `assets/model_profiles.json`'s `recommended_frameworks` block for `glm-5.2`, which independently agree on primary/fallback/avoid/density/benchmark.

The second C2 candidate - annotating a closeout follow-up note in `124-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md` - is explicitly **not** implemented here. It lives inside the 124 spec docs, and this phase's own scope boundary (plus the required `124-sk-prompt-parent --recursive --strict` non-regression check, which only makes sense if no 124 spec doc is touched) both exclude it. The manifest itself marked it optional/low-value, which made the exclusion an easy call once the scope conflict surfaced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/prompt-improver.md` | Modified | A1: 5 stale `/prompt` references repointed to `/prompt-improve`. |
| `.claude/agents/prompt-improver.md` | Modified | A1 mirror: same 5 repoints. |
| `.opencode/skills/sk-prompt/prompt-models/SKILL.md` | Modified | A2: `allowed-tools: []` -> `[Read, Grep, Glob]`. |
| `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md` | Modified | A3: both GLOBAL-PRECONDITIONS dead-path lines repointed (`SKILL.md` + 5 references/assets paths) to `prompt-improve/`. |
| `.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/NN--*/` (18 per-feature files) | Modified | A5: 21 dead absolute `sk-prompt/references/` + `sk-prompt/assets/` paths in `bash: rg`/`ls` commands repointed to nested `prompt-improve/`. |
| `.opencode/skills/sk-prompt/prompt-models/README.md` | Modified | A4: 3 dead top-level path repoints; C1: GLM-5.2 row added. |
| `.opencode/skills/sk-prompt/prompt-models/references/context_budget.md` | Modified | A4: 1 dead top-level path repoint. |
| `.opencode/commands/prompt-improve.md` | Modified | B1 containment + overwrite guard; B2 topic sanitization; B3 `.opencode/specs/` root preference; coherence fix to Step 5-A. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every finding was re-verified against the live file (Read or grep) before editing, since the manifest's line numbers were marked approximate - several turned out off by 2-3 lines, and one file (`README.md`) had 2 additional same-class occurrences the manifest's cited line didn't mention. Each fix was a targeted `Edit` on an exact matched string. For Cluster B, the design was grounded empirically rather than assumed: before writing the root-preference fix, the `specs` path was confirmed to be a real, git-tracked symlink to `.opencode/specs` (not a separate legacy directory), and the sibling `/deep:*` commands' own `find specs .opencode/specs -mindepth 2 -maxdepth 2` discovery pattern was tested directly against this platform's `find` and found to silently no-op on the symlinked argument without `-L` - so that pattern was not blindly copied; the fix instead names `.opencode/specs/` as the single canonical search root. After all edits, fresh greps confirmed 0 remaining stale `/prompt` refs, 0 remaining dead `commands/prompt.md` refs, and 0 remaining dead top-level `prompt-models` path refs outside historical `changelog/` entries.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repoint every occurrence of `/prompt` and `commands/prompt.md` in each agent mirror (5 per file), not just the single line the review cited. | The review's fix instruction said "repoint both runtime mirrors," and the file had 4 other same-class occurrences the manifest's single cited line didn't call out; fixing only one would leave a half-swept file with the identical bug still visible three lines later. |
| Touch Step 5-A's `[folder]` handling even though it wasn't one of the 3 cited Cluster B findings. | Making Step 5-B's discovery root canonical (`.opencode/specs/`) without updating Step 5-A's consumption of that same `[folder]` variable would have introduced a new double-nesting bug immediately downstream of the fix - leaving it alone wasn't "staying in scope," it was letting the fix break adjacent, dependent instructions. Documented explicitly rather than silently folded in. |
| Do not copy the sibling `/deep:*` commands' `find specs .opencode/specs -mindepth 2 -maxdepth 2` pattern verbatim. | Empirically tested it against this platform's `find` first (per the rigor this task asked for) and found it silently drops the `specs` argument's contribution without `-L`, since `specs` is a symlink. Copying an established pattern that doesn't actually do what it looks like it does would have been worse than deviating from it; `.opencode/specs/` alone as the single canonical search root is simpler and empirically correct here. |
| Leave the 2 illustrative `specs/012-onboarding` examples in §5/§6 unchanged. | Both explicitly model the "Q2=A: reuse an existing folder" scenario, which the fix's own "legacy `specs/` remains valid when already in use" fallback framing covers - changing them would have removed the one place in the doc that illustrates that fallback, not fixed a bug. |
| Bound Step 5-C's containment to the `.opencode/specs/` spec tree, not the repository root. | The finding's intent (per the review and the fix manifest: "reject paths escaping the intended spec-folder root") is the spec tree, and the command's whole model is spec-folder-rooted saves — a repo-root boundary would let an arbitrary repo path pass as a spec save. The first pass used the repo root and a coordinator cross-verify flagged it as too loose; tightened to the spec root with out-of-tree saves stated as an explicit non-goal. |
| First flag the 18-file per-feature `bash: rg` dead-path condition (A5) for a decision, then execute it once the coordinator authorized the fold-in. | On discovery it was a broader condition never named in the review's finding registry, the fix manifest, or the coordinator's A3 correction, so the disciplined first move was to flag-with-recommendation, not silently expand scope. The coordinator then confirmed it as the same merge-referrer-sweep class and invoked the operator "fix all" directive to fold it into cluster A — so it moved from Known-Limitations to done work (A5), applied as a scoped uniform repoint with two-way verification. The general rule this reinforces: surface the broader condition with evidence, let the scope owner decide, then execute cleanly. |
| Repoint only the `references/`+`assets/` dead paths in A5, NOT the adjacent hub `sk-prompt/SKILL.md` grep targets. | The coordinator's A5 instruction and acceptance grep were explicitly scoped to `references/`+`assets/`, and those are unambiguously dead (the hub-root dirs do not exist). The `sk-prompt/SKILL.md` refs are a genuinely different case: the file still resolves (it is the thin router that kept its own routing §2), so a blanket repoint would need a per-command check that each grep targets content the fold actually moved to `prompt-improve/SKILL.md` — not the clean uniform sweep A5 was. Flagged with evidence for a separate decision rather than swept blind. |
| Exclude C2 rather than implement it as "optional but easy." | It lives inside the 124 spec docs, which this phase's explicit scope boundary and the required 124-recursive-strict non-regression check both exclude; the manifest's own "Do NOT" section names the same boundary. Implementing it would have contradicted the task's own verification step. |
| Do not bump any `version:` field or author a changelog entry. | Unlike sibling phase 001's fix manifest, this phase's manifest specified no version-bump requirement; adding one unrequested would be scope expansion beyond the 12 cited findings. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Each of the 12 cited findings (+ the folded-in A5 sweep) re-verified against the live file before editing | PASS - all confirmed present at (approximately) the manifest's cited lines; 2 additional same-class A4 occurrences found and fixed in `README.md` beyond the single cited line; A5's 21 dead paths enumerated by grep before the sweep. |
| `grep -n '/prompt\b' .opencode/agents/prompt-improver.md .claude/agents/prompt-improver.md \| grep -v '/prompt-improve'` | PASS - 0 matches. |
| `grep -rn 'commands/prompt\.md' .opencode/agents/prompt-improver.md .claude/agents/prompt-improver.md .opencode/commands/prompt-improve.md` | PASS - 0 matches. |
| `grep -rln '\.opencode/skills/prompt-models\b' .opencode/skills/sk-prompt/ --include='*.md' \| grep -v '/changelog/'` | PASS - 0 matches. |
| A5 acceptance: `grep -rE '\.opencode/skills/sk-prompt/(references\|assets)/' manual_testing_playbook/NN--*/` | PASS - 0 matches after the 18-file / 21-path sweep; no double-application (`prompt-improve/prompt-improve` absent); all 4 distinct nested targets + both nested dirs resolve on disk; 45 `../../references/` + 4 `../../assets/` relative refs left untouched. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../002-sk-prompt-124-remediation --strict` | PASS - `Errors: 0  Warnings: 0`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../124-sk-prompt-parent --recursive --strict` | `Errors: 0`, 1 pre-existing warning - NOT this phase's regression. The warning (`EVIDENCE_CITED: Found 1 completed item(s) without evidence`) is in `006-advisor-and-integration`, whose `spec.md`/`plan.md`/`tasks.md`/`graph-metadata.json` all carry `Jul 9` mtimes (this phase's own files carry `Jul 10`), and `git status --porcelain -- .../124-sk-prompt-parent/` shows the whole subtree as a single pre-existing untracked block, not a diff this phase produced. This phase never opened a file under `124-sk-prompt-parent/` except the read-only `review-report.md` at the start. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **C2 is unimplemented by design.** The closeout-note annotation in `124-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:122` remains as the 124 review report left it. It is out of this phase's scope (124 spec docs are excluded), not forgotten - flagged here for whichever future pass is authorized to touch 124 spec docs.
2. **The 124 `--recursive --strict` re-check is not a clean 0/0** - it carries 1 pre-existing warning in `006-advisor-and-integration` (`EVIDENCE_CITED`, a task marked `[x]` without a detectable evidence marker in that phase's own `tasks.md`). Confirmed pre-existing and unrelated to this phase (see Verification table); left unfixed because fixing it would mean editing a 124 spec doc, which this phase's scope excludes. Flagged here rather than silently left for the next 124-spec-doc-authorized pass to notice on their own.
3. **`/prompt-improve`'s "new spec folder" flow still creates a flat, non-tracked folder** (`.opencode/specs/[NNN]-[topic]/`, no `[track]/` segment, no `description.json`/`graph-metadata.json`). Every other packet under `.opencode/specs/` is tracked (confirmed: 0 flat `[0-9][0-9][0-9]-*` folders exist directly under `.opencode/specs/` today). This is a pre-existing characteristic of the command predating this phase, not one of the 3 cited Cluster B findings - redesigning it would require a track-selection decision this remediation was not asked to make.
4. **This is a documentation/instruction-content fix only.** No runtime script or automation code changed; nothing to smoke-test beyond re-reading the corrected text and re-running the greps above.
5. **17 per-feature playbook files still grep the hub `sk-prompt/SKILL.md` for content the fold moved to `prompt-improve/SKILL.md`.** This is the narrowed residual after the A5 sweep closed the `references/`+`assets/` dead paths. Under `manual_testing_playbook/NN--*/`, 17 feature files run `bash: rg '...' .opencode/skills/sk-prompt/SKILL.md ...` — but that hub file is the thin router post-fold, and sampled grep patterns (the CLEAR dimensions; the Framework Selection Matrix) return 0 matches there while `prompt-improve/SKILL.md` returns them, so those rg targets are effectively stale. Left unfixed because it is a genuinely different case from A5: `sk-prompt/SKILL.md` still *resolves* on disk (not a dead path), and the hub keeps its own routing §2, so a blanket `sk-prompt/SKILL.md` → `prompt-improve/SKILL.md` repoint would need a per-command check that each grep targets moved content rather than legitimate hub-routing content — not the clean uniform sweep A5 was. Note these rg commands still succeed today because they grep multiple targets and the content IS found in the (now-fixed) `prompt-improve/references|assets/` file; the hub SKILL.md target just contributes 0 matches. Recommend an authorized per-command verification pass to repoint the stale hub-SKILL.md targets (or confirmation that an integration step handles them).
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

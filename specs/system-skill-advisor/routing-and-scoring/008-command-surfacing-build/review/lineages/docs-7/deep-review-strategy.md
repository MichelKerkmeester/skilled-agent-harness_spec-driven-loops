# Deep Review Strategy - docs-7

## 1. OVERVIEW

### Purpose

Persistent review state for the docs area of code review pass seven. Tracks dimension coverage, findings, and the next focus across the lineage's iterations.

### Usage

- Read at the start of every iteration before any review action.
- Updated in place after the iteration's findings are written.
- Machine-owned blocks stay between their markers.

## 2. TOPIC

Review pass seven, docs area: this branch's net change to the root `README.md` against `origin/main`, checking that the `/create:skill` to `/create:sk-skill` rename reached both of the README's command surfaces and that every command name the README gives resolves to a file under `.skilled/commands`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reporting the pass-seven recorded limits without a new breaking input: `:auto.md` reading as the command, a `node -e` arrow inside escaped quotes reading as a redirect, `isolation-check.sh` being macOS only, `started` versus `offered` not rebuilding from `readOnly`, and older goal rows keeping old-rule figures.
- Reviewing the scorer and attach-config scope paths of pass seven, except as read-only context evidence for a docs claim.
- Reviewing pre-existing README prose that this branch's net diff does not touch, except where the rename makes it false.
- Changing code or docs under review.

---

## 5. STOP CONDITIONS

- Three iterations reached (`maxIterations: 3`).
- Weighted new-finding ratio at or below the 0.10 convergence threshold after the minimum two iterations.
- A hard gate failure that prevents further review.

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
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Resolving every `/group:name` token in `README.md` against `.skilled/commands/<group>/<name>.md` in one sweep: 44 of 44 resolve, so the rename question closed on evidence rather than on the two changed lines alone (iteration 1).
- Reading the create group's own index (`README.txt:57,88`) and the sk-doc hub answer (`README.md:67,194`) beside the root README: the renamed name is consistent in the three docs a reader could follow, not just in the diff (iteration 1).
- Checking the thirteen command files' `argument-hint` and asset triples to test the "Every one runs with `:auto` or with `:confirm`" sentence at `README.md:269`: the claim holds for all thirteen, including the renamed command (iteration 1).
- Comparing the `.opencode` create-command copies byte for byte with the canonical files: all thirteen match, so the runtime surface the README points at cannot drift from the documented command (iteration 2).
- Sweeping the eight runtime trees for the renamed command's filename: `.claude` symlinks to it, `.opencode` copies it, and `.codex`/`.cursor`/`.pi`/`.dsh`/`.vibe` carry `create-sk-skill`, so the README name is reachable everywhere the group is mirrored (iteration 2).
- Proving the rename at blob level after `STUCK_RECOVERY`: `git show 1c3d62def5a:README.md` carries the new name at both lines while `origin/main` carries the old one, and the introducing commit `74d3744e641` is an ancestor of the reviewed revision, so the change is not a working-tree artifact or a later revert (iteration 3).

## 9. WHAT FAILED
- A first pass over the changed sentence treated the nine names as one claim; one of them (`/create:skill-parent`) shares the old prefix, so the sweep had to exclude the `skill-parent` token explicitly before the "no old name remains" result was trustworthy (iteration 1).
- A runtime-folder assumption (that every runtime keeps a `commands/create` folder) was wrong for six of the eight trees; the sweep had to follow each runtime's own prompt or skill layout before the mirror result meant anything (iteration 2).
- Two clean iterations tripped the stuck counter (`STUCK_RECOVERY` at iteration 2); the loop only advances by changing the unit of evidence, which cost an iteration that a finding-bearing area would have spent on new code (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A behaviour narrower than the README says:** the renamed command writes the shared `.skilled/skills/` tree, so the unqualified "a skill" is accurate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A behaviour narrower than the README says:** the renamed command writes the shared `.skilled/skills/` tree, so the unqualified "a skill" is accurate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A behaviour narrower than the README says:** the renamed command writes the shared `.skilled/skills/` tree, so the unqualified "a skill" is accurate.

### **A broken `.claude` symlink after the rename:** the link resolves to the canonical `sk-skill.md`, and no link under the three command trees is broken. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A broken `.claude` symlink after the rename:** the link resolves to the canonical `sk-skill.md`, and no link under the three command trees is broken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broken `.claude` symlink after the rename:** the link resolves to the canonical `sk-skill.md`, and no link under the three command trees is broken.

### **A broken command in the changed sentence:** all nine names in the `:269` sentence and all thirteen names in the `:603` list resolve to existing files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A broken command in the changed sentence:** all nine names in the `:269` sentence and all thirteen names in the `:603` list resolve to existing files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broken command in the changed sentence:** all nine names in the `:269` sentence and all thirteen names in the `:603` list resolve to existing files.

### **A Claude Code visibility regression the README would hide:** the reviewed `.claude/commands/create` tree has no `skill.md`, the filename the rename commit names as the hazard. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A Claude Code visibility regression the README would hide:** the reviewed `.claude/commands/create` tree has no `skill.md`, the filename the rename commit names as the hazard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Claude Code visibility regression the README would hide:** the reviewed `.claude/commands/create` tree has no `skill.md`, the filename the rename commit names as the hazard.

### **A command that exists only in the source tree:** the `.opencode` and `.claude` command mirrors carry `create/sk-skill.md`, so the README name is reachable on the runtime surfaces that mirror the group. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A command that exists only in the source tree:** the `.opencode` and `.claude` command mirrors carry `create/sk-skill.md`, so the README name is reachable on the runtime surfaces that mirror the group.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A command that exists only in the source tree:** the `.opencode` and `.claude` command mirrors carry `create/sk-skill.md`, so the README name is reachable on the runtime surfaces that mirror the group.

### **A false count in the changed Create row:** thirteen listed names, thirteen files, and the same number in the create group's own index. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A false count in the changed Create row:** thirteen listed names, thirteen files, and the same number in the create group's own index.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false count in the changed Create row:** thirteen listed names, thirteen files, and the same number in the create group's own index.

### **A false mode claim for the renamed command:** the confirm workflow's `approvals: step_by_step` and the `:auto` workflow both exist and are routed by the command's execution-target table. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A false mode claim for the renamed command:** the confirm workflow's `approvals: step_by_step` and the `:auto` workflow both exist and are routed by the command's execution-target table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false mode claim for the renamed command:** the confirm workflow's `approvals: step_by_step` and the `:auto` workflow both exist and are routed by the command's execution-target table.

### **A later revert of the rename:** `74d3744e641` is an ancestor of the reviewed revision and is the newest commit that changes the new string in `README.md`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A later revert of the rename:** `74d3744e641` is an ancestor of the reviewed revision and is the newest commit that changes the new string in `README.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A later revert of the rename:** `74d3744e641` is an ancestor of the reviewed revision and is the newest commit that changes the new string in `README.md`.

### **A README ahead of the command tree:** the command folder at the same revision holds `sk-skill.md` and no `skill.md`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A README ahead of the command tree:** the command folder at the same revision holds `sk-skill.md` and no `skill.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A README ahead of the command tree:** the command folder at the same revision holds `sk-skill.md` and no `skill.md`.

### **A rename that exists only in the working tree:** the reviewed blob itself carries the new name at both lines. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A rename that exists only in the working tree:** the reviewed blob itself carries the new name at both lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A rename that exists only in the working tree:** the reviewed blob itself carries the new name at both lines.

### **A runtime prompt still named `create-skill`:** every non-command mirror carries `create-sk-skill`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A runtime prompt still named `create-skill`:** every non-command mirror carries `create-sk-skill`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A runtime prompt still named `create-skill`:** every non-command mirror carries `create-sk-skill`.

### **A stale `.opencode` copy of the renamed command:** all thirteen create command copies match the canonical files byte for byte. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A stale `.opencode` copy of the renamed command:** all thirteen create command copies match the canonical files byte for byte.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale `.opencode` copy of the renamed command:** all thirteen create command copies match the canonical files byte for byte.

### **A stale instruction inside the renamed command:** the presentation contract, the confirm workflow's completion actions and the group index all use `/create:sk-skill`; no old name remains in the commands tree. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A stale instruction inside the renamed command:** the presentation contract, the confirm workflow's completion actions and the group index all use `/create:sk-skill`; no old name remains in the commands tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale instruction inside the renamed command:** the presentation contract, the confirm workflow's completion actions and the group index all use `/create:sk-skill`; no old name remains in the commands tree.

### **A stale retired-name reference in the README:** the old name appears nowhere in the reviewed README; the alias lives in the advisor runtime and its changelog where it is owned. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A stale retired-name reference in the README:** the old name appears nowhere in the reviewed README; the alias lives in the advisor runtime and its changelog where it is owned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale retired-name reference in the README:** the old name appears nowhere in the reviewed README; the alias lives in the advisor runtime and its changelog where it is owned.

### **A stale second `/create:skill` reference in the README:** `grep -n "create:skill" README.md` returns only the two renamed lines, both already `/create:sk-skill`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A stale second `/create:skill` reference in the README:** `grep -n "create:skill" README.md` returns only the two renamed lines, both already `/create:sk-skill`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale second `/create:skill` reference in the README:** `grep -n "create:skill" README.md` returns only the two renamed lines, both already `/create:sk-skill`.

### **A wrong Create count after the rename:** the heading, the list and the folder each carry thirteen entries; renaming a file did not change the count. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A wrong Create count after the rename:** the heading, the list and the folder each carry thirteen entries; renaming a file did not change the count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong Create count after the rename:** the heading, the list and the folder each carry thirteen entries; renaming a file did not change the count.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- A stale second `/create:skill` reference in the README: `grep -n "create:skill" README.md` returns only the two renamed lines, both already `/create:sk-skill` (iteration 1).
- A broken command name in the changed sentence: all nine names in `README.md:269` and all thirteen names in `README.md:603` resolve to existing files under `.skilled/commands` (iteration 1).
- A wrong Create count after the rename: the heading, the list and the folder each carry thirteen entries; renaming a file did not change the count (iteration 1).
- A command that exists only in the shared source tree: the `.opencode` and `.claude` command mirrors carry `create/sk-skill.md` (iteration 1).
- A stale instruction inside the renamed command: the presentation contract, the confirm workflow's completion actions and the group index all use `/create:sk-skill` (iteration 1).
- A stale `.opencode` copy of the renamed command: all thirteen create command copies match the canonical files byte for byte (iteration 2).
- A broken `.claude` symlink after the rename: the link resolves to the canonical `sk-skill.md`, and no link under the three command trees is broken (iteration 2).
- A runtime prompt still named `create-skill`: every non-command mirror carries `create-sk-skill` (iteration 2).
- A behaviour narrower than the README says: the renamed command writes the shared `.skilled/skills/` tree, so the unqualified "a skill" is accurate (iteration 2).
- A rename that exists only in the working tree: the reviewed blob carries the new name at both lines (iteration 3).
- A README ahead of the command tree: the command folder at the same revision holds `sk-skill.md` and no `skill.md` (iteration 3).
- A later revert of the rename: `74d3744e641` is an ancestor of the reviewed revision and is the newest commit that changes the new string in `README.md` (iteration 3).
---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis only - Reason: the recovery pass closed the provenance question at commit level; all four dimensions now have two or more reads and no new finding remains - Rotation status: traceability, correctness, security and maintainability complete; recovery approach closed - Required evidence: none outstanding; synthesis reads the registry, the three iteration files and the terminal gate rows - Recovery note: iteration 2's `STUCK_RECOVERY` was answered by changing the evidence unit to the commit graph, and the approach produced no new finding Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `README.md` only, per `review/review-scope-7.txt` line 10.
- Behavior claims: the net diff `origin/main..1c3d62def5a` for `README.md` (two lines: 269 and 603, the `/create:skill` to `/create:sk-skill` rename), and the brief's instruction that each command name the README gives exists under `.skilled/commands`.
- Reuse and conventions: the command tree's own index at `.skilled/commands/README.txt`, the create group index at `.skilled/commands/create/README.txt`, and pass-six lineage reports for prior documented limits.
- Review risks and gaps: the README's command section names 44 commands of which only the create group's first name changed; pre-existing count and prose claims are context, not branch findings.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | Both changed lines name existing command files; 44 of 44 README command names resolve; counts and mode claims hold |
| `checklist_evidence` | core | notApplicable | 1 | No checklist.md at the target root; the pass-seven brief is the checklist |
| `skill_agent` | overlay | pass | 2 | The renamed router, its confirm workflow and its presentation contract all use `/create:sk-skill` |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent body in scope; command mirrors recorded under Integration Evidence |
| `feature_catalog_code` | overlay | notApplicable | 1 | No feature-catalog claim touched |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook claim touched |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| README.md | D1, D2, D3, D4 | 3 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-docs-7-1794829999759-g4q8yp, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 60 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T11:59:13.000Z
<!-- MACHINE-OWNED: END -->

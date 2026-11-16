# Deep Review Strategy - merge-docs-6

## 1. OVERVIEW

### Purpose

Persistent review state for the merge-docs area of code review pass six. Tracks dimension coverage, findings, and the next focus across the lineage's iterations.

### Usage

- Read at the start of every iteration before any review action.
- Updated in place after the iteration's findings are written.
- Machine-owned blocks stay between their markers.

## 2. TOPIC

Review pass six, merge-docs area: this branch's net change to the twelve files a merge with main resolved, checking that nothing main added was lost and that each documentation claim is true of the code.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-reporting the pass-six recorded limits without a new breaking input: the `node -e` arrow inside escaped quotes reading as a redirect, `isolation-check.sh` being macOS only, `started` versus `offered` not rebuilding from `readOnly`, older goal rows keeping old-rule figures, and the declined turn duration, OpenCode delivery receipt and longer cap.
- Reviewing files outside the twelve merge-docs scope paths, except as read-only context evidence for a claim.
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
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the merge base as main's tip: since `695f4191d` is both the merge base and the parent main merge, the single net diff exposed every line main held, so a line-presence sweep plus context reads proved the merge-loss question directly (iteration 1).
- Running the real sk-doc resolver against the regenerated manifest: the compiled route returned the manifest's exact hash and generation, so the one generated value in scope was proved live instead of trusted (iteration 2).
- Checking every path named by the changed doc lines: all thirteen entry files, the renamed command and the packet path resolve, so the maintainability pass had a concrete referent instead of a prose impression (iteration 3).

---

## 9. WHAT FAILED
- A raw line-presence detector over-reports paragraph rewrites as lost lines; the first pass had to read every candidate in context before it produced a usable signal (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A broken path in the changed agent tables:** all thirteen entry files and the renamed command exist. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A broken path in the changed agent tables:** all thirteen entry files and the renamed command exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A broken path in the changed agent tables:** all thirteen entry files and the renamed command exist.

### **A command-injection path in the Vibe hook check:** the reader only tokenizes text; no `exec`/`spawn` call exists in `hook-wiring-check.cjs`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A command-injection path in the Vibe hook check:** the reader only tokenizes text; no `exec`/`spawn` call exists in `hook-wiring-check.cjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A command-injection path in the Vibe hook check:** the reader only tokenizes text; no `exec`/`spawn` call exists in `hook-wiring-check.cjs`.

### **A contradictory version inside system-spec-kit:** `SKILL.md` and the new changelog agree at `2.13.4.0`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A contradictory version inside system-spec-kit:** `SKILL.md` and the new changelog agree at `2.13.4.0`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A contradictory version inside system-spec-kit:** `SKILL.md` and the new changelog agree at `2.13.4.0`.

### **A false "four children" claim:** four `spawnSync` calls exist in `agents-md-check.cjs`; the stale "three child tools" wording lives in that script's own header comment, outside the twelve review paths, and is not a defect in the changed README. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A false "four children" claim:** four `spawnSync` calls exist in `agents-md-check.cjs`; the stale "three child tools" wording lives in that script's own header comment, outside the twelve review paths, and is not a defect in the changed README.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false "four children" claim:** four `spawnSync` calls exist in `agents-md-check.cjs`; the stale "three child tools" wording lives in that script's own header comment, outside the twelve review paths, and is not a defect in the changed README.

### **A false "four children" README claim:** four `spawnSync` calls exist in `agents-md-check.cjs`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A false "four children" README claim:** four `spawnSync` calls exist in `agents-md-check.cjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false "four children" README claim:** four `spawnSync` calls exist in `agents-md-check.cjs`.

### **A false TOML-parser claim in the doctor README:** the `command` regex at `hook-wiring-check.cjs:263` really does reject a trailing comment or a single-quoted command, so the stated `hook-missing` outcome is accurate. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A false TOML-parser claim in the doctor README:** the `command` regex at `hook-wiring-check.cjs:263` really does reject a trailing comment or a single-quoted command, so the stated `hook-missing` outcome is accurate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false TOML-parser claim in the doctor README:** the `command` regex at `hook-wiring-check.cjs:263` really does reject a trailing comment or a single-quoted command, so the stated `hook-missing` outcome is accurate.

### **A hidden second source for the Vibe agent body:** the generated payload equals the canonical body exactly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A hidden second source for the Vibe agent body:** the generated payload equals the canonical body exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hidden second source for the Vibe agent body:** the generated payload equals the canonical body exactly.

### **A lost main sentence in `README.md` health or brief prose:** the net diff adds lines only; `git diff c88dabe8292^2 c88dabe8292 -- README.md` is empty. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A lost main sentence in `README.md` health or brief prose:** the net diff adds lines only; `git diff c88dabe8292^2 c88dabe8292 -- README.md` is empty.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A lost main sentence in `README.md` health or brief prose:** the net diff adds lines only; `git diff c88dabe8292^2 c88dabe8292 -- README.md` is empty.

### **A new maintainability defect in the doctor README rows:** each added sentence describes behavior the script exposes and does not restate an internal constant. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A new maintainability defect in the doctor README rows:** each added sentence describes behavior the script exposes and does not restate an internal constant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new maintainability defect in the doctor README rows:** each added sentence describes behavior the script exposes and does not restate an internal constant.

### **A prompt-text leak in hook health:** the record schema and validator exclude prompt text, and the non-debug path drops skill and error text. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A prompt-text leak in hook health:** the record schema and validator exclude prompt text, and the non-debug path drops skill and error text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A prompt-text leak in hook health:** the record schema and validator exclude prompt text, and the non-debug path drops skill and error text.

### **A release-note claim that `/create:skill` still has a command alias:** no command file or runtime mirror answers to it; the only alias is the advisor's typed-input mapping, which the body states. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A release-note claim that `/create:skill` still has a command alias:** no command file or runtime mirror answers to it; the only alias is the advisor's typed-input mapping, which the body states.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A release-note claim that `/create:skill` still has a command alias:** no command file or runtime mirror answers to it; the only alias is the advisor's typed-input mapping, which the body states.

### **A silent pass on a trailing-comment Vibe command:** the strict regex reads it as `hook-missing`, which is the documented conservative outcome. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A silent pass on a trailing-comment Vibe command:** the strict regex reads it as `hook-missing`, which is the documented conservative outcome.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A silent pass on a trailing-comment Vibe command:** the strict regex reads it as `hook-missing`, which is the documented conservative outcome.

### **A stale half of the duplicated workflow path block:** the push and pull-request copies are identical. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A stale half of the duplicated workflow path block:** the push and pull-request copies are identical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale half of the duplicated workflow path block:** the push and pull-request copies are identical.

### **A stale runtime mirror of the renamed markdown agent:** `.vibe/agents/markdown.toml`'s instructions payload equals the canonical body exactly, and the other runtime mirrors carry the new spelling. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A stale runtime mirror of the renamed markdown agent:** `.vibe/agents/markdown.toml`'s instructions payload equals the canonical body exactly, and the other runtime mirrors carry the new spelling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale runtime mirror of the renamed markdown agent:** `.vibe/agents/markdown.toml`'s instructions payload equals the canonical body exactly, and the other runtime mirrors carry the new spelling.

### **A stale sk-doc compiled policy hash:** the resolver served a compiled route with the manifest's exact hash and generation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A stale sk-doc compiled policy hash:** the resolver served a compiled route with the manifest's exact hash and generation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale sk-doc compiled policy hash:** the resolver served a compiled route with the manifest's exact hash and generation.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: traceability, correctness, security, maintainability
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- A lost main sentence in README, CONTRIBUTING, ENV-REFERENCE or the session-readers README: the net diff adds or rewrites only, and the final merge's parent-to-result diff is empty for README (iteration 1).
- A stale `.vibe` mirror of the renamed markdown agent: the instructions payload equals the canonical body exactly (iteration 1).
- A false TOML caveat in the doctor README: the command regex rejects a trailing comment and a single-quoted command (iteration 1).
- A false "four children" claim in the doctor README: four child runs exist; the stale wording is a code comment outside the scope (iteration 1).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis only - Reason: all four dimensions have at least one full iteration; no new finding remains - Rotation status: maintainability complete; all dimensions swept - Required evidence: none Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the twelve paths in `review/review-scope-6.txt` with area `merge-docs`.
- Behavior claims: the net diff `695f4191d36620b42b5f76a28c25e460fccdd0f7..85550ee946e` for each path; the review brief's instruction that nothing main added was lost and each claim is true of the code.
- Reuse and conventions: pass-five lineage reports under `review/lineages/*-5` for prior documented limits and findings.
- Review risks and gaps: merges rewrote whole lines, so a line-presence check over-reports; each candidate must be read in context. Some claims live in code outside the twelve paths and are cited only as context.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Merge-loss sweep over the twelve paths found no dropped main line |
| `checklist_evidence` | core | notApplicable | 1 | No checklist.md at the target root; the pass-six brief is the checklist |
| `skill_agent` | overlay | pass | 1 | Agent command table and the renamed command file agree |
| `agent_cross_runtime` | overlay | pass | 1 | Vibe and other runtime mirrors match the canonical agent body |
| `feature_catalog_code` | overlay | notApplicable | 1 | No feature-catalog claim touched |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook claim touched |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .github/workflows/spec-kit-check.yml | D1, D2, D3 | 2 | 0 | complete |
| .skilled/agents/markdown.md | D1, D3 | 2 | 0 | complete |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json | D1, D2, D3 | 2 | 0 | complete |
| .skilled/changelog/skilled/v4.0.2.1.md | D2, D3 | 2 | 1 P2 | complete |
| .skilled/commands/doctor/scripts/README.markdown | D1, D2, D3 | 2 | 0 | complete |
| .skilled/hooks/shared/session-readers/README.md | D1, D2, D3 | 2 | 0 | complete |
| .skilled/skills/system-spec-kit/SKILL.md | D1, D3 | 2 | 0 | complete |
| .skilled/skills/system-spec-kit/changelog/v2.13.4.0.md | D1, D2, D3 | 2 | 0 | complete |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | D1, D3 | 2 | 0 | complete |
| .vibe/agents/markdown.toml | D1, D3 | 2 | 0 | complete |
| CONTRIBUTING.md | D3 | 1 | 0 | complete |
| README.md | D2, D3 | 2 | 1 P2 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-merge-docs-6-1794815529929-dybl7p, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 60 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T07:56:07.000Z
<!-- MACHINE-OWNED: END -->

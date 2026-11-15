---
title: Deep Review Strategy - vibe-hooks-doctor-5 lineage
description: Runtime strategy tracking review progress for the vibe-hooks-doctor fan-out lineage, fifth pass of command surfacing.
version: 1.11.14.0
---

# Deep Review Strategy - vibe-hooks-doctor-5 lineage

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. It records which dimensions remain, what was found
(P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every
iteration before any review action.

---

## 2. TOPIC

Review pass five of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
in the `vibe-hooks-doctor` area. Scope: the changed paths listed in
`review/review-scope-5.txt` whose area is `vibe-hooks-doctor` — the doctor command routes, the
hook-wiring check and its tests plus README, the command-reference validator, the Claude
prompt-submit hook, the Vibe prompt advisor, the hook contract doc, the CI workflow, and the
hook test files — plus shared docs that describe them.

The operator focus is the pass-five brief: the kill switch and direct-call switch paths; command
offers surviving a refusal, question, history statement or bare mention; Vibe journal scoring;
the doctor hooks-file reading; docs against code; and holdout hygiene.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- The kill-switch CLI files (launcher, cli, disabled lib) are the `kill-switch-cli-5` lineage's
  scope. This lineage reads them only as context for the hook paths it owns.
- The transcript scorer and behaviour-arena scripts are the `accuracy-runner-5` lineage's scope.
  This lineage records the boundary and raises findings only where a hook or doctor file is the
  producer.
- The feature-catalog, changelog, playbook and graph-metadata docs are `docs-metadata-5`'s scope;
  they are read here only to check whether a doc describes this area's code falsely.
- Holdout prompt text is never read or printed. Corpus work is limited to counts and
  `jq 'del(.prompt)'` rows.
- No code changes: review is observation-only.

---

## 5. STOP CONDITIONS

- Convergence: `newFindingsRatio` at or below the 0.10 threshold with no active P0.
- Cap: `maxIterations` 4.
- Stuck: two consecutive iterations with no new evidence (stuckThreshold 2).
- Any active P0 blocks PASS regardless of convergence.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Probing the exported `withCommandDocuments` with the directive-only context the sibling `reduceRepeatedHead` explicitly supports: `Directives:` at the start makes `indexOf('\nDirectives:')` miss, so the `separator > 0` guard fails and the directive text is scanned as a head. The probe printed the extra line with a directive that names a command, while the same probe of the current headed fallback was unchanged (iteration 1).
- Reading `reduceRepeatedHead` first: its explicit `context.startsWith(label)` branch proves the authors know the fallback exists, which isolated the missing guard in `withCommandDocuments` rather than blaming the handler (iteration 1).
- Walking the generated bridge table read-only: 69 of 69 `commandPolicies` rows resolve to a document, so the document-line mechanism is sound and the finding is the fallback boundary, not the resolution rule (iteration 1).

---

## 9. WHAT FAILED

- Reading the Vibe part's `env` injectable as covering every environment read failed: `headReceiptDir` reads `process.env` directly, so the child-marker test and the receipt path can disagree under injection. Recorded for the maintainability pass (iteration 1).
- Reading the subagent guard as proven failed: `parent_session_id` has no in-repo Vibe payload schema and no test, so the hook contract's subagent promise is a claim rather than a verified behavior (iteration 1).
- Resolving the handler's `new URL('../../../../../../hooks/...', import.meta.url)` with node for both the source and the dist location: the source path lands one level above the repository while the dist path lands on `.skilled/hooks/shared`, which proves the canonical switch gap is source-only and keeps the finding at P2 (iteration 2).
- Following the switch table row by row into the shared resolver and the plugin: both `_HOOK_DISABLED` and `_PLUGIN_DISABLED` sit in one alias list, and the plugin asks the same resolver, so the table's hook-versus-plugin distinction is not in the code (iteration 2).

---

## 9B. WHAT FAILED (continued)

- Reading the source handler's switch check as proving the canonical switch failed: the resolver path is wrong from the source folder and the catch returns enabled. Only the explicit legacy-name check survives a source run (iteration 2).
- Reading phase 029's `AC-009` as evidence for the alias rows failed: it verifies that the listed lines did not change, not that they are true (iteration 2).
- Reading the Vibe reader as covering every field the host acts on failed: it reads only `type` and `command`, so a `match` filter is invisible even though the repository's own hooks file uses `match` values, including `agents_spawn` (iteration 3).
- Reading the hook contract's per-runtime section as complete after the Vibe row failed: the section intro and the "starting a surfaced command" table still enumerate the older runtimes only (iteration 3).
- Reading the Vibe part's dependency object as fully injectable failed: `env` reaches only the child-session test while the receipt directory keeps reading the process environment, so a caller that injects only `env` writes to the real temporary folder (iteration 4).
- Reading the doctor contract test as covering the Vibe rows by name failed: the route case is still titled for DSH while the array it walks holds both runtimes (iteration 4).

---

## 9D. WHAT WORKED (continued)

- Reading the suite's injected `read`/`write` pair against the module's default pair: the suite is hermetic, which isolates the gap to the documented `env` dependency rather than to the tests (iteration 4).
- Reading `MIRROR_CHECKS` and the two gap walks before judging the test name: the coverage is complete and only the title is stale, so the finding stays a naming gap instead of a coverage claim (iteration 4).

---

## 9C. WHAT WORKED (continued)

- Running the wiring check on this checkout before judging it: five `ok` lines and exit 0 prove the real `.vibe/hooks.toml` parses through the line reader, so the finding is the ignored `match` field rather than the reader (iteration 3).
- Counting the three Vibe script names in the workflow and the route instead of trusting the comment: nine and three lines match the contract test's assertions and phase 030's `REQ-005` (iteration 3).
- Scanning the twelve scoped files for corpus names: no hit, which is the holdout-hygiene evidence, kept to names and counts (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A commented `[[hooks]]` header starts a block.** Ruled out: the header is stripped of its comment before comparison and the test "reads a commented hooks header as the start of the next block" passes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A commented `[[hooks]]` header starts a block.** Ruled out: the header is stripped of its comment before comparison and the test "reads a commented hooks header as the start of the next block" passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A commented `[[hooks]]` header starts a block.** Ruled out: the header is stripped of its comment before comparison and the test "reads a commented hooks header as the start of the next block" passes.

### **A daemon started by a flagged caller stays disabled.** Ruled out: the launcher's allowlist forwards no switch name and no `HOOK_FLAGS_CONFIG`, so the daemon answers later callers normally. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A daemon started by a flagged caller stays disabled.** Ruled out: the launcher's allowlist forwards no switch name and no `HOOK_FLAGS_CONFIG`, so the daemon answers later callers normally.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A daemon started by a flagged caller stays disabled.** Ruled out: the launcher's allowlist forwards no switch name and no `HOOK_FLAGS_CONFIG`, so the daemon answers later callers normally.

### **A later table lends its command to the hooks block before it.** Ruled out: any other header clears the current block, with a test for `[[notes]]`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A later table lends its command to the hooks block before it.** Ruled out: any other header clears the current block, with a test for `[[notes]]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A later table lends its command to the hooks block before it.** Ruled out: any other header clears the current block, with a test for `[[notes]]`.

### **A Vibe-only doctor test is missing from CI.** Ruled out: `run-all.sh` globs every `*.test.cjs`, and the `doctor-scripts` job runs it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A Vibe-only doctor test is missing from CI.** Ruled out: `run-all.sh` globs every `*.test.cjs`, and the `doctor-scripts` job runs it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A Vibe-only doctor test is missing from CI.** Ruled out: `run-all.sh` globs every `*.test.cjs`, and the `doctor-scripts` job runs it.

### **The `.vibe` allowlist entry accepts a phantom runtime.** Ruled out: `.vibe/agents` is present with generated profiles. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The `.vibe` allowlist entry accepts a phantom runtime.** Ruled out: `.vibe/agents` is present with generated profiles.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `.vibe` allowlist entry accepts a phantom runtime.** Ruled out: `.vibe/agents` is present with generated profiles.

### **The `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` explicit check can re-enable a disabled hook.** Ruled out: it is an OR with the resolver, so it can only skip. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` explicit check can re-enable a disabled hook.** Ruled out: it is an OR with the resolver, so it can only skip.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` explicit check can re-enable a disabled hook.** Ruled out: it is an OR with the resolver, so it can only skip.

### **The check counts a mention as a wired hook.** Ruled out: the shell-word reader and the tests for a quoted `echo`, a `description` field, a comment and a `name` value all read `hook-missing`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The check counts a mention as a wired hook.** Ruled out: the shell-word reader and the tests for a quoted `echo`, a `description` field, a comment and a `name` value all read `hook-missing`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The check counts a mention as a wired hook.** Ruled out: the shell-word reader and the tests for a quoted `echo`, a `description` field, a comment and a `name` value all read `hook-missing`.

### **The contract test covers only the workflow half for Vibe.** Ruled out: `MIRROR_CHECKS` includes the three Vibe rows and both `routeGaps` and `workflowGaps` iterate it; only the name is stale. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The contract test covers only the workflow half for Vibe.** Ruled out: `MIRROR_CHECKS` includes the three Vibe rows and both `routeGaps` and `workflowGaps` iterate it; only the name is stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The contract test covers only the workflow half for Vibe.** Ruled out: `MIRROR_CHECKS` includes the three Vibe rows and both `routeGaps` and `workflowGaps` iterate it; only the name is stale.

### **The direct call reads its own copy of the switch names.** Ruled out: `advisorDisabledBy` calls `hookFlagDecision` from the shared resolver and builds `ADVISOR_DISABLED_FLAGS` from `MASTER_FLAG`, `MASTER_ALIASES`, `concernFlag` and the alias list. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The direct call reads its own copy of the switch names.** Ruled out: `advisorDisabledBy` calls `hookFlagDecision` from the shared resolver and builds `ADVISOR_DISABLED_FLAGS` from `MASTER_FLAG`, `MASTER_ALIASES`, `concernFlag` and the alias list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The direct call reads its own copy of the switch names.** Ruled out: `advisorDisabledBy` calls `hookFlagDecision` from the shared resolver and builds `ADVISOR_DISABLED_FLAGS` from `MASTER_FLAG`, `MASTER_ALIASES`, `concernFlag` and the alias list.

### **The document line is added before the directive block.** Holds for a headed brief; fails only for the no-brief fallback above. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The document line is added before the directive block.** Holds for a headed brief; fails only for the no-brief fallback above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The document line is added before the directive block.** Holds for a headed brief; fails only for the no-brief fallback above.

### **The document line names the wrong document for a two-part command.** Ruled out: the token pattern stops at the second colon and the test pins `/deep:research:auto` to `.skilled/commands/deep/research.md`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The document line names the wrong document for a two-part command.** Ruled out: the token pattern stops at the second colon and the test pins `/deep:research:auto` to `.skilled/commands/deep/research.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The document line names the wrong document for a two-part command.** Ruled out: the token pattern stops at the second colon and the test pins `/deep:research:auto` to `.skilled/commands/deep/research.md`.

### **The head receipt collides with the directive store.** Ruled out: the store and the receipts share a base directory but the receipts live under the `vibe-turn-start` subfolder with a hashed name. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The head receipt collides with the directive store.** Ruled out: the store and the receipts share a base directory but the receipts live under the `vibe-turn-start` subfolder with a hashed name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The head receipt collides with the directive store.** Ruled out: the store and the receipts share a base directory but the receipts live under the `vibe-turn-start` subfolder with a hashed name.

### **The new label case leaks `SPECKIT_RUNTIME` into later cases.** Ruled out: `afterEach` restores all three environment names (`claude-user-prompt-submit-hook.vitest.ts:95-101`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The new label case leaks `SPECKIT_RUNTIME` into later cases.** Ruled out: `afterEach` restores all three environment names (`claude-user-prompt-submit-hook.vitest.ts:95-101`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The new label case leaks `SPECKIT_RUNTIME` into later cases.** Ruled out: `afterEach` restores all three environment names (`claude-user-prompt-submit-hook.vitest.ts:95-101`).

### **The removed `council` scope is still supported.** Ruled out: the workflow declares four scopes and no router text mentions council. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The removed `council` scope is still supported.** Ruled out: the workflow declares four scopes and no router text mentions council.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The removed `council` scope is still supported.** Ruled out: the workflow declares four scopes and no router text mentions council.

### **The token pattern can escape the commands tree.** Ruled out: the capture is `[a-z][a-z0-9-]*` only, so `..`, a dot and an absolute path cannot form a candidate; a missing file is skipped by `existsSync`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The token pattern can escape the commands tree.** Ruled out: the capture is `[a-z][a-z0-9-]*` only, so `..`, a dot and an absolute path cannot form a candidate; a missing file is skipped by `existsSync`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The token pattern can escape the commands tree.** Ruled out: the capture is `[a-z][a-z0-9-]*` only, so `..`, a dot and an absolute path cannot form a candidate; a missing file is skipped by `existsSync`.

### **The Vibe part bypasses the handler's switch check.** Ruled out: it checks `isHookEnabled` before calling and the handler checks again. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The Vibe part bypasses the handler's switch check.** Ruled out: it checks `isHookEnabled` before calling and the handler checks again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Vibe part bypasses the handler's switch check.** Ruled out: it checks `isHookEnabled` before calling and the handler checks again.

### **The Vibe suite writes receipts into the real temporary folder.** Ruled out: both `read` and `write` are injected with a `Map`, and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` and `TMPDIR` are pointed into the isolated scope (`vibe-prompt-advisor.vitest.ts:69-77,189-198`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The Vibe suite writes receipts into the real temporary folder.** Ruled out: both `read` and `write` are injected with a `Map`, and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` and `TMPDIR` are pointed into the isolated scope (`vibe-prompt-advisor.vitest.ts:69-77,189-198`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Vibe suite writes receipts into the real temporary folder.** Ruled out: both `read` and `write` are injected with a `Map`, and `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` and `TMPDIR` are pointed into the isolated scope (`vibe-prompt-advisor.vitest.ts:69-77,189-198`).

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; synthesis - Focus area: the lineage report, the release-readiness state and the convergence record. - Reason: all four dimensions are covered and the loop has reached its four-iteration cap. - Rotation status: correctness, security, traceability and maintainability complete (PASS with advisories). - Blocked/productive carry-forward: no blocked approach; the receipt-injection and route-name gaps are the last two advisories. - Required evidence: the registry's active counts, the four iteration final lines, the synthesis close-out record and the report. Review verdict: PASS

<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`,
  `.skilled/commands/doctor/_routes.yaml`,
  `.skilled/commands/scripts/validate-command-references.cjs`,
  `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`,
  `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`,
  `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, and the hook/doctor tests.
- Behavior claims: `review/review-brief-5.txt`; the hook contract doc; the doctor routes file.
- Reuse and conventions: hook scripts are standalone Node/TS entry points fed a JSON event on
  stdin; doctor scripts are plain Node CommonJS with node:test suites.
- Review risks and gaps: no live Vibe or Claude session is available; claims rest on the hook
  entry points and their test doubles. The transcript scorer belongs to another lineage.
- Out of scope: launcher/kill-switch CLI internals, scorer arithmetic, holdout prompt text.

---

<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Not yet checked. |
| `checklist_evidence` | core | pending | - | Not yet checked. |
| `skill_agent` | overlay | pending | - | Not yet checked. |
| `agent_cross_runtime` | overlay | pending | - | Not yet checked. |
| `feature_catalog_code` | overlay | pending | - | Not yet checked. |
| `playbook_capability` | overlay | pending | - | Not yet checked. |
<!-- /ANCHOR:cross-reference-status -->

---

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| all scoped files | - | - | - | pending |

---

## 16. REVIEW BOUNDARIES

- Max iterations: 4
- Convergence threshold: 0.1
- Session lineage: sessionId=fanout-vibe-hooks-doctor-5-1794760565927-i99t40, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Severity threshold: P2
- Review target type: spec-folder
- Started: 2026-11-15T16:38:04Z

# Deep Review Strategy

## 1. REVIEW CHARTER

- Target: commits c57b7e4cef..e97ca56e8d on main (overlay-engine.cjs, overlay-engine-* tests, overlay-guard/opencode adapter, /doctor:overlay command docs, system-skilled-doctor overlays reference + playbook)
- Target type: files
- Operator review focus: Data-loss and safety paths first: lock takeover, layout link retarget, removal of dropped json-entry items, apply --relayout moves and backups. Then the strict write checks, the commit check and status --audit, the OpenCode adapter, and whether the command documents match the engine.
- Dimensions: correctness, security, traceability, maintainability
- Stop policy: max-iterations (3); convergence threshold 0.10 is telemetry only on this run
- Success criteria: every active P0/P1 has file:line evidence and a named case; no review-target file modified

## 2. TOPIC

Review of phase 9 overlay write checks follow-up (commits c57b7e4cef..e97ca56e8d). The review target is read-only.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Any write under `barter/ai-speckit`; Barter's tree is read as evidence only.
- Changing the edit hook's fail-open contract (it is recorded in `handover-to-barter.md` as a deferred risk).
- Checking a commit that moves the pin: the skip is by design.
- Rewriting text references in a vendoring project during `relayout`.
- Implementing fixes: this loop reports findings only.
- The regenerated trigger index and retrieval fixtures carried in the same commit range; they are generator output, not hand-written review target.

---

## 5. STOP CONDITIONS

- maxIterations (3) reached, recorded as `stopReason: maxIterationsReached`.
- Convergence (weighted new-finding ratio under 0.10) is telemetry only here; review angles broaden to the cap.

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
- P1 (Required): 3
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Pairing each function with the sentence a document writes about it, then reading the function end to end: this found both P1s without any test execution (iteration 1)
- Reading the `git diff` of the base commit for a rewritten function to recover the shape it replaced: the old lock-line format is invisible in HEAD and decisive for R1-P1-001 (iteration 1)
- Checking which test fixtures pass an empty value for the feature under review (`layoutLinks: []` in every relayout fixture) to find an untested path (iteration 1)
- Following a symlinked review target to its real file and resolving every import it names, which turned a suspected broken-import P1 into a verified clean surface (iteration 2)
- Reading a second command's write path (the relayout backup) against a control that only the first command enforces, which found the protectedPaths bypass (iteration 2)

---

## 9. WHAT FAILED
- Expecting the checklist `[x]` rows to name the gap: `tasks.md` T005's verify covers four lock cases and none of them is a legacy line, so the checklist cannot be used as coverage evidence (iteration 1)
- Reading `tasks.md` T015's verify sentence as code evidence: it says "allows an owned one" where the tests refuse an owned write; the checklist is a paraphrase, not a record of what ran (iteration 2)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`--audit` changing the exit code contrary to the docs:** dismissed. `presentation.txt:114`, `_routes.yaml:638` and `overlay.md:70` all say a finding fails the status, and `commandStatus:2443-2446` includes `audit.findings.length === 0` in `isInSync`. Docs and code agree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`--audit` changing the exit code contrary to the docs:** dismissed. `presentation.txt:114`, `_routes.yaml:638` and `overlay.md:70` all say a finding fails the status, and `commandStatus:2443-2446` includes `audit.findings.length === 0` in `isInSync`. Docs and code agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`--audit` changing the exit code contrary to the docs:** dismissed. `presentation.txt:114`, `_routes.yaml:638` and `overlay.md:70` all say a finding fails the status, and `commandStatus:2443-2446` includes `audit.findings.length === 0` in `isInSync`. Docs and code agree.

### **`acquireLock` empty-file window:** observed (create with `wx`, then write the owner line) but ruled out as a finding — the window is microseconds, a concurrent reader refuses rather than steals, and the refuse message names the file. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`acquireLock` empty-file window:** observed (create with `wx`, then write the owner line) but ruled out as a finding — the window is microseconds, a concurrent reader refuses rather than steals, and the refuse message names the file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`acquireLock` empty-file window:** observed (create with `wx`, then write the owner line) but ruled out as a finding — the window is microseconds, a concurrent reader refuses rather than steals, and the refuse message names the file.

### **`command-contract.json` still describing the pre-`--audit` router:** dismissed by diff; all four overlay hunks were updated. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`command-contract.json` still describing the pre-`--audit` router:** dismissed by diff; all four overlay hunks were updated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`command-contract.json` still describing the pre-`--audit` router:** dismissed by diff; all four overlay hunks were updated.

### **`isSameText` letting a real edit through under `text=auto`:** dismissed. It normalises CRLF only, compares bytes as latin1, and returns false for any pair containing a NUL byte. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`isSameText` letting a real edit through under `text=auto`:** dismissed. It normalises CRLF only, compares bytes as latin1, and returns false for any pair containing a NUL byte.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`isSameText` letting a real edit through under `text=auto`:** dismissed. It normalises CRLF only, compares bytes as latin1, and returns false for any pair containing a NUL byte.

### **`items` key loss on a throwing plan:** dismissed. A throwing plan yields a problem and `both-changed`, which blocks the apply before any state write. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`items` key loss on a throwing plan:** dismissed. A throwing plan yields a problem and `both-changed`, which blocks the apply before any state write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`items` key loss on a throwing plan:** dismissed. A throwing plan yields a problem and `both-changed`, which blocks the apply before any state write.

### **`status` taking the lock, contrary to its invariant:** dismissed. `commandStatus` calls no `withLock`, and `status.yaml:28`'s invariant matches. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`status` taking the lock, contrary to its invariant:** dismissed. `commandStatus` calls no `withLock`, and `status.yaml:28`'s invariant matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`status` taking the lock, contrary to its invariant:** dismissed. `commandStatus` calls no `withLock`, and `status.yaml:28`'s invariant matches.

### **A `write` call being parsed as a patch body:** dismissed. `PATCH_KEYS` are read only when the tool is `patch` or `apply_patch` (`overlay-guard.js:39`, `:86`); a `write` tool's `content` is never parsed as a patch, so a document that quotes a patch cannot be refused for it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A `write` call being parsed as a patch body:** dismissed. `PATCH_KEYS` are read only when the tool is `patch` or `apply_patch` (`overlay-guard.js:39`, `:86`); a `write` tool's `content` is never parsed as a patch, so a document that quotes a patch cannot be refused for it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `write` call being parsed as a patch body:** dismissed. `PATCH_KEYS` are read only when the tool is `patch` or `apply_patch` (`overlay-guard.js:39`, `:86`); a `write` tool's `content` is never parsed as a patch, so a document that quotes a patch cannot be refused for it.

### **A missing `v1.1.6.0` skill version as a finding:** dismissed; `tasks.md` T027 owns it and is still open. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A missing `v1.1.6.0` skill version as a finding:** dismissed; `tasks.md` T027 owns it and is still open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing `v1.1.6.0` skill version as a finding:** dismissed; `tasks.md` T027 owns it and is still open.

### **Backup read after a move:** dismissed. The whole backup loop completes before the first `renameSync`, so a move can never race its own backup. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Backup read after a move:** dismissed. The whole backup loop completes before the first `renameSync`, so a move can never race its own backup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Backup read after a move:** dismissed. The whole backup loop completes before the first `renameSync`, so a move can never race its own backup.

### **Broken imports in the OpenCode adapter:** dismissed. The file is a symlink into `.opencode/plugins/`, and every import resolves from there; the shared core is byte-identical to the `.skilled` copy. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Broken imports in the OpenCode adapter:** dismissed. The file is a symlink into `.opencode/plugins/`, and every import resolves from there; the shared core is byte-identical to the `.skilled` copy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Broken imports in the OpenCode adapter:** dismissed. The file is a symlink into `.opencode/plugins/`, and every import resolves from there; the shared core is byte-identical to the `.skilled` copy.

### **Cross-runtime tool-vocabulary drift:** dismissed as by design; each adapter names its own host's tools and every adapter documents the fail-open rule for a tool it does not list. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Cross-runtime tool-vocabulary drift:** dismissed as by design; each adapter names its own host's tools and every adapter documents the fail-open rule for a tool it does not list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cross-runtime tool-vocabulary drift:** dismissed as by design; each adapter names its own host's tools and every adapter documents the fail-open rule for a tool it does not list.

### **Dropped-item removal deleting a person's item that shares the recorded identity but not the value:** dismissed. `deepEqual(live, record.item)` gates the delete and the mismatch case throws; the identical-bytes case is genuinely indistinguishable from the engine's own item. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Dropped-item removal deleting a person's item that shares the recorded identity but not the value:** dismissed. `deepEqual(live, record.item)` gates the delete and the mismatch case throws; the identical-bytes case is genuinely indistinguishable from the engine's own item.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Dropped-item removal deleting a person's item that shares the recorded identity but not the value:** dismissed. `deepEqual(live, record.item)` gates the delete and the mismatch case throws; the identical-bytes case is genuinely indistinguishable from the engine's own item.

### **Fail-open commit check when git is unreadable:** dismissed for lack of reach; recorded as an edge case instead. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Fail-open commit check when git is unreadable:** dismissed for lack of reach; recorded as an edge case instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Fail-open commit check when git is unreadable:** dismissed for lack of reach; recorded as an edge case instead.

### **Midway `relayout` rename leaving no recoverable copy:** dismissed as a finding. The stated mitigation (refuse before the first move, back up each path first, work under the lock) is implemented, and the backup folder is named on stdout before the first move. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Midway `relayout` rename leaving no recoverable copy:** dismissed as a finding. The stated mitigation (refuse before the first move, back up each path first, work under the lock) is implemented, and the backup folder is named on stdout before the first move.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Midway `relayout` rename leaving no recoverable copy:** dismissed as a finding. The stated mitigation (refuse before the first move, back up each path first, work under the lock) is implemented, and the backup folder is named on stdout before the first move.

### **Over-broad `repin.exclude` allowing an owned write:** dismissed. `commandGuard` refuses an owned destination before the strict-write test. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Over-broad `repin.exclude` allowing an owned write:** dismissed. `commandGuard` refuses an owned destination before the strict-write test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Over-broad `repin.exclude` allowing an owned write:** dismissed. `commandGuard` refuses an owned destination before the strict-write test.

### **The playbook's protected-path MISS line being out of date:** dismissed by exact comparison; the playbook already quotes the current fix wording including the quoting rule. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The playbook's protected-path MISS line being out of date:** dismissed by exact comparison; the playbook already quotes the current fix wording including the quoting rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The playbook's protected-path MISS line being out of date:** dismissed by exact comparison; the playbook already quotes the current fix wording including the quoting rule.

### **The relayout "then applies" sentences being wrong:** dismissed as an ambiguity at the route level, see Edge Cases. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The relayout "then applies" sentences being wrong:** dismissed as an ambiguity at the route level, see Edge Cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The relayout "then applies" sentences being wrong:** dismissed as an ambiguity at the route level, see Edge Cases.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Backup read after a move: the backup loop completes before the first `renameSync` (iteration 1, evidence: `overlay-engine.cjs:4725-4738`)
- Midway `relayout` rename as data loss: the documented mitigation is implemented and the backup folder is named before the first move (iteration 1, evidence: `overlay-engine.cjs:4725-4732`)
- Dropped-item removal deleting a hand edit: `deepEqual(live, record.item)` gates the delete and a mismatch throws (`overlay-engine.cjs:1125-1132`)
- `acquireLock` empty-file window: microseconds, a concurrent reader refuses rather than steals (`overlay-engine.cjs:2256-2280`)
- `items` key loss when a plan throws: the plan yields `both-changed`, which blocks the apply before any state write (`overlay-engine.cjs:2509-2516`)
- Broken imports in the OpenCode adapter: the reviewed path is a symlink into `.opencode/plugins/` and every import resolves from there; the shared core is byte-identical to the `.skilled` copy (iteration 2)
- A `write` call parsed as a patch body: `PATCH_KEYS` are read only for `patch`/`apply_patch` tools (`overlay-guard.js:39`, `:86`)
- Over-broad `repin.exclude` allowing an owned write: `commandGuard` refuses an owned destination first (`overlay-engine.cjs:2915-2920`)
- `isSameText` letting a real edit through: CRLF-only normalisation, NUL bytes never compare equal (`overlay-engine.cjs:4247-4251`)
- Fail-open commit check with no readable git: no reach, since a machine without a work tree cannot commit either (iteration 2)
- Cross-runtime tool-vocabulary drift: by design, each adapter names its own host's tools (iteration 2)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining — traceability and maintainability closed at this iteration - Focus area: synthesis - Reason: `maxIterations` is 3 and the loop stops on the cap; the three active P1 findings and four active P2 findings are the input to the report - Rotation status: all four dimensions have been reviewed (D1, D2 CONDITIONAL; D3, D4 CONDITIONAL with P2 advisories only) - Blocked/productive carry-forward: productive — the doc-sentence-versus-code-line pairing produced one P1 and one P2 in this iteration; nothing is blocked - Required evidence: none further; synthesis reads the registry - Recovery note: not applicable Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/commands/doctor/scripts/overlay-engine.cjs` (4895 lines, ~1017 changed); new test file `tests/overlay-engine-follow-up.test.cjs` (804 lines); `tests/overlay-engine-strict-writes.test.cjs` (223 lines added); `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` (123 lines); `.skilled/commands/doctor/overlay.md` (116 lines); `.skilled/skills/system-skilled-doctor/references/overlays.md` (233 lines).
- Behavior claims: `spec.md` REQ-001 to REQ-017, and the risk table that names lock takeover, item removal, `sync-state.json` compatibility and a midway `relayout` failure as the high-impact data risks.
- Reuse and conventions: Node standard library only; refusals exit 2, conflicts exit 1, success exit 0; `withLock` serialises mutating commands; state lives in `sync-state.json` with `pin` and `files` plus the new `links` and `items`.
- Review risks and gaps: no `resource-map.md` in the packet; Barter's tree is not available as evidence; `route-validate.sh` and `node --test` are NOT run in this loop because writes outside the lineage are forbidden.
- Comment hygiene: the target's comments carry no spec-path or task ids; anything this review writes applies the same rule.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2 | Iteration 1: REQ-002 and REQ-011 partly met. Iteration 2: REQ-005, REQ-006, REQ-007, REQ-012 and REQ-013 hold; NFR-S01 not met on the relayout backup path (R2-P1-001) |
| `checklist_evidence` | core | partial | 2 | T005/T013 (iteration 1) and T009/T010/T014/T015 (iteration 2) checked; three verify sentences mis-state what the tests do |
| `agent_cross_runtime` | overlay | partial | 2 | The OpenCode adapter is a symlink to `.opencode/plugins/overlay-guard.js`; imports resolve from there and the shared core is byte-identical. Cursor/DSH tool vocabularies differ by design |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/doctor/scripts/overlay-engine.cjs | [D1, D2] | 2 | 0 P0, 3 P1, 1 P2 | partial |
| .skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs | [D1] | 1 | 0 P0, 0 P1, 0 P2 | partial (no relayout-link case) |
| .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs | [] | - | - | pending |
| .skilled/hooks/overlay-guard/opencode/overlay-guard.js | [D2] | 2 | 0 P0, 0 P1, 0 P2 | clean (resolves to .opencode/plugins/overlay-guard.js) |
| .skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs | [D2] | 2 | 0 P0, 0 P1, 0 P2 | clean |
| .skilled/commands/doctor/overlay.md | [D1] | 1 | 0 P0, 0 P1, 0 P2 | partial (route steps read for the relayout promise only) |
| .skilled/commands/doctor/assets/doctor-overlay-presentation.txt | [D2] | 2 | 0 P0, 0 P1, 1 P2 | partial |
| .skilled/commands/doctor/assets/doctor-overlay-apply.yaml | [D1] | 1 | 0 P0, 0 P1, 0 P2 | partial |
| .skilled/skills/system-skilled-doctor/references/overlays.md | [D1, D2] | 2 | 0 P0, 0 P1, 0 P2 | partial (lines 57-120 read) |
| .skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/ | [] | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1794439428470-vyb51k, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-11T23:24:57Z
<!-- MACHINE-OWNED: END -->

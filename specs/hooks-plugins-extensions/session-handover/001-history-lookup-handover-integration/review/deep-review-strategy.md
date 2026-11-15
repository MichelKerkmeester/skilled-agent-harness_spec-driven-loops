# Deep Review Strategy

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
files changed in commits 169da2e8cba..1c7bc3d9d63: the history lookup engine move into .skilled/hooks/session-handover/history and everything that followed it

Target type: files (63 files). Operator focus: Known residuals to check: (1) a repo-wide sweep for any live reference to the old engine path .skilled/skills/system-spec-kit/runtime/hooks/lib/history/ in code, tests, CI, docs and provisioning; (2) .github/workflows/spec-kit-check.yml engine step has never run on GitHub, so check it would pass as written; (3) .skilled/hooks/shared/tests/session-readers/project.test.mjs turns a missing schema file into a silent skip; (4) the pinned 66-character quoted session-id bound in hook-state.ts must equal the engine bound. The phase 1 harness hop-recall.sh line 18 still naming the old path is already known and owned by phase 008 task T002, so record it as known, not as a new finding.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing anything: the review target is read-only.
- Files outside the commit range, except as cross-references needed to judge a finding.
- The hop-recall.sh line 18 old-path reference, already owned by phase 008 task T002.

---

## 5. STOP CONDITIONS
- stop_policy=max-iterations: run all 10 iterations; convergence is telemetry only.
- maxDurationMinutes=200 wall-clock budget (raised from the 120 template default so the bound 10 iterations fit).
- Three consecutive failed iterations stop the loop with reason error.

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
- P1 (Required): 2
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Resolving a package's hardcoded tool path against a workflow's install set proved the never-run CI engine step cannot pass as written, without running the build (iteration 1).
- Sweeping the retired engine path across `.skilled`, `.github` and `.opencode` separated live surfaces from historical packet prose in one pass (iteration 1).
- Reading the engine's own boundary arithmetic next to the hook-state copy showed the equality holds today but the test pin is one-sided (iteration 1).
- Tracing the offer template against shellQuote isolated the one value the module interpolates raw, which the read-side schema enum never guards (iteration 2).
- Reading getStatePath beside the CLI state read closed the traversal question: the argv session id is hashed before it becomes a filename (iteration 2).
- Checking a playbook's Source Files table against the filesystem separated the two stale test anchors from the nine that resolve, in one existence sweep (iteration 3).
- Comparing phase-008 T002's `rg` pattern with the harness's actual line 18 proved the owned checklist check can distinguish fixed from unfixed (iteration 3).
- Spot-checking the catalog's cap, command, prefix and exit-code claims against the shipped constants turned a broad catalog audit into a bounded pass (iteration 3).
- Hashing the three phase-008 source docs against `graph-metadata.json`'s `source_doc_hashes` closed the freshness question exactly, instead of re-reading the plan for drift (iteration 5).
- Reading `cli.ts:577-580,592-593` beside `README.md:144` and catalog `:51` turned the inferred success exit into a traced one: success writes the reply then returns 0, refusal returns 2 (iteration 5).
- Pairing `git status --porcelain` over the target paths with the HEAD read separated stale carried evidence from live drift in one pass (iteration 5).
- Reading `history.ts` end to end beside `history-entry-contract.vitest.ts` closed the twice-deferred source gap: the type-level key guards, role conditionals and pairing checks agree, and the one legacy CLI matcher is documented compatibility rather than drift (iteration 6).
- Resolving the engine build's hardcoded tool path against the workflow's two install targets proved the carried CI P1 still stands, without executing the step (iteration 6).
- Pairing the dispatch's required evidence with a zero-drift `git diff` over the eight carried-finding anchors turned synthesis prep into a bounded re-verification: every active finding's source line is unchanged at HEAD, and the legacy-matcher fixture at `history-projection.vitest.ts:228-232` is explicitly documented as backward compatibility (iteration 7).
- Pairing the operator's four residuals with a target-scope `git diff 1c7bc3d9d63..HEAD` and a fresh two-pattern old-path sweep confirmed all four without a new finding: the retired tree is gone, the only executable old-path hits are the known 008 T002 harness line and two documented fixtures, the 66-character copies still agree, and the schema skip remains latent (iteration 8).
- Reading the four P2 anchors directly at HEAD closed iteration 8's one remaining read gap without adding a finding: the offer still interpolates the raw runtime prefix (`lookup-offer.ts:69-70`), both playbook capability lines still omit Vibe (`:147,:166`), the Source Files table still names the two retired runtime test paths (`:185-186`), and the hop-recall overview still says the hop prints no offer (`:18`) while its own Why-This-Matters paragraph says the claim prints one (`:22`) (iteration 9).
- Re-reading all eight active anchors at the terminal HEAD, then proving `git diff 1c7bc3d9d63..HEAD` empty over every target path and the only later commit confined to `002-session-handover-loop/goal.md`, turned closeout into one bounded pass that re-confirmed every finding and corrected the P1 anchor to `package.json:11` (iteration 10).
- Pairing the workflow's install targets with `.skilled/package.json`'s missing `workspaces` field closed the P1's last counterevidence question at the terminal pass: `npm --prefix .skilled ci` cannot create the `.skilled/skills/system-spec-kit/node_modules` tree the build script names (iteration 10).

---

## 9. WHAT FAILED
- The severity-escalation pass found no new impact evidence for any P2, so all seven stay P2; the one gate-shaped P2 (`I1-P2-002`, CI trigger) is coverage debt rather than a live failure while the P1 blocks the same step (iteration 10).
- The engine build was still not executed in this read-only pass, so `I1-P1-001` remains statically proven from `package.json:11` plus the CI install set rather than observed red (iteration 10).
- The reducer-owned registry still records `I1-P1-001` at `package.json:6` (the `engines` field); the corrected `:11` anchor lives in this strategy and in the iteration-10 narrative because the registry is read-only (iteration 10).
- Iteration 9's canonical record is legacy/unversioned, so this pass cannot compare its own v2 search coverage against the prior iteration's ledger (iteration 10).
- `I2-P2-001` and `I3-P2-001` to `I3-P2-003` were re-confirmed by the zero-drift proof and the unchanged registry anchors rather than fresh line reads, because the four operator residuals consumed the read budget (iteration 8).
- The carried `I1-P2-004` equality was not re-read line by line; it rests on the iteration-6 re-verification plus the zero-drift check, because the constant-drift direction is BLOCKED and re-entering it is prohibited (iteration 7).
- Executing the engine suite was outside a read-only pass, so the CI failure is statically proven rather than observed red; the first GitHub run is the confirming signal (iteration 1).
- The spec-doc hits alone could not tell stale drift from intentional compatibility; the `history.ts` transcript-comment was needed to classify `history-projection.vitest.ts:230` (iteration 1).
- The pages.ts internals stayed unread inside the 24-call ceiling, so page-mode input bounds rest on call-site evidence rather than a direct read (iteration 2).
- No in-tree producer passes an unsafe runtime label, so the injection-shaped finding could not be raised above P2 (iteration 2).
- Phase-008 `plan.md`, `description.json` and `graph-metadata.json` stayed unread inside the 24-call ceiling, so plan-to-spec consistency rests on `spec.md` and `tasks.md` only (iteration 3). Closed in iteration 5.
- The catalog's success-path exit code was inferred from the refusal mapping rather than read, so it is recorded as a residual rather than a verified pass (iteration 3). Closed in iteration 5.
- Vibe support was not verified in the mint or reader code; the Vibe-omission finding rests on the playbook contradicting its own contract (iteration 3).
- `history.ts` was not read for the second iteration; the 24-call ceiling went to the phase-008 evidence gaps and the catalog exit trace. Recorded as deferred evidence, not a pass (iteration 5).
- Residual 1 (old-path sweep) and residual 4 (bound equality) were not re-entered because both directions are recorded BLOCKED; the no-drift check is the read-only substitute, not a fresh sweep (iteration 5).
- The history engine suite still could not be executed in this read-only pass; the CI `tsc` failure remains statically proven rather than observed red (iteration 6).
- The leg of residual 1 that lives inside `history.ts:335` is an escaped regex literal, so a plain-text old-path sweep returns a clean zero without matching it; the compatibility intent had to be adjudicated by reading the surrounding comment (iteration 6).
- The workbook trigger filter for `I1-P2-002` was outside this pass, so that P2 is carried without a fresh verdict (iteration 6).
- The four operator residuals were not re-swept in iteration 9 because every one is recorded BLOCKED and the dispatch forbids re-entry; the zero-drift proof and the unchanged anchors carry their conclusions instead of a fresh search (iteration 9).
- The registry anchor for `I1-P1-001` records `package.json:6`, which is the `engines` field; the `build` script that proves the claim is at `package.json:11`. The registry is reducer-owned and read-only, so the correction lives in the iteration-9 narrative for synthesis rather than in the registry itself (iteration 9).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`tsconfig` excluding tests hides a CI typecheck gap** — the build already type-checks the same `lib/` set; the separate `typecheck` script adds no coverage. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`tsconfig` excluding tests hides a CI typecheck gap** — the build already type-checks the same `lib/` set; the separate `typecheck` script adds no coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`tsconfig` excluding tests hides a CI typecheck gap** — the build already type-checks the same `lib/` set; the separate `typecheck` script adds no coverage.

### **A fresh dimension remains** — ruled out; all four dimensions are complete and the registry has no unread target source. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A fresh dimension remains** — ruled out; all four dimensions are complete and the registry has no unread target source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A fresh dimension remains** — ruled out; all four dimensions are complete and the registry has no unread target source.

### **A live import or entry still loads the retired engine tree.** The repo-wide sweep returned no hit outside the intentional legacy matcher. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A live import or entry still loads the retired engine tree.** The repo-wide sweep returned no hit outside the intentional legacy matcher.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live import or entry still loads the retired engine tree.** The repo-wide sweep returned no hit outside the intentional legacy matcher.

### **A live old-path reference remains outside the playbooks** — the iteration 1 sweep conclusion stands; this pass adds only the retired test-path rows inside one playbook. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A live old-path reference remains outside the playbooks** — the iteration 1 sweep conclusion stands; this pass adds only the retired test-path rows inside one playbook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live old-path reference remains outside the playbooks** — the iteration 1 sweep conclusion stands; this pass adds only the retired test-path rows inside one playbook.

### **A live old-path reference survives outside `specs/`** — carried BLOCKED conclusion from iterations 1 and 4; no target drift this iteration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A live old-path reference survives outside `specs/`** — carried BLOCKED conclusion from iterations 1 and 4; no target drift this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live old-path reference survives outside `specs/`** — carried BLOCKED conclusion from iterations 1 and 4; no target drift this iteration.

### **A live old-path reference survives outside `specs/`** — re-swept; the only hits are `history-projection.vitest.ts:230` (documented legacy-transcript fixture) and `session-handover-cli.test.cjs:3598` (other-checkout gate fixture). The known harness line is in `specs/` and owned by 008 T002. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A live old-path reference survives outside `specs/`** — re-swept; the only hits are `history-projection.vitest.ts:230` (documented legacy-transcript fixture) and `session-handover-cli.test.cjs:3598` (other-checkout gate fixture). The known harness line is in `specs/` and owned by 008 T002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A live old-path reference survives outside `specs/`** — re-swept; the only hits are `history-projection.vitest.ts:230` (documented legacy-transcript fixture) and `session-handover-cli.test.cjs:3598` (other-checkout gate fixture). The known harness line is in `specs/` and owned by 008 T002.

### **Contract derivation or validation drift in `history.ts`.** The key lists, required lists, schema comparison and role conditionals all agree; no finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Contract derivation or validation drift in `history.ts`.** The key lists, required lists, schema comparison and role conditionals all agree; no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Contract derivation or validation drift in `history.ts`.** The key lists, required lists, schema comparison and role conditionals all agree; no finding.

### **Duplicate 66-character bound drift** — re-verified equal, same transform, same quoted-form arithmetic in both copies. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Duplicate 66-character bound drift** — re-verified equal, same transform, same quoted-form arithmetic in both copies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Duplicate 66-character bound drift** — re-verified equal, same transform, same quoted-form arithmetic in both copies.

### **Handle timing/replay as an auth boundary** — the digest is not a bearer secret, the caller must already hold it, and it is 128 bits; a constant-time compare would not change what it protects. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Handle timing/replay as an auth boundary** — the digest is not a bearer secret, the caller must already hold it, and it is 128 bits; a constant-time compare would not change what it protects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Handle timing/replay as an auth boundary** — the digest is not a bearer secret, the caller must already hold it, and it is 128 bits; a constant-time compare would not change what it protects.

### **Page cursors or part-page offsets drift, split a surrogate, or skip content** — the read found bounds before slicing, surrogate-safe boundaries, and next-unread continuation on every exit (`pages.ts:334-339,351-361,396-422,441-469`). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Page cursors or part-page offsets drift, split a surrogate, or skip content** — the read found bounds before slicing, surrogate-safe boundaries, and next-unread continuation on every exit (`pages.ts:334-339,351-361,396-422,441-469`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Page cursors or part-page offsets drift, split a surrogate, or skip content** — the read found bounds before slicing, surrogate-safe boundaries, and next-unread continuation on every exit (`pages.ts:334-339,351-361,396-422,441-469`).

### **Path traversal through the argv session id** — `getStatePath` hashes the id to 16 hex characters before joining the state directory; no traversal segment survives. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Path traversal through the argv session id** — `getStatePath` hashes the id to 16 hex characters before joining the state directory; no traversal segment survives.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Path traversal through the argv session id** — `getStatePath` hashes the id to 16 hex characters before joining the state directory; no traversal segment survives.

### **Phase 008 T002's negative check is vacuous** — the pattern `runtime/dist/hooks/lib/history` matches the harness's actual line 18, so the check flips from one hit to none when the owned line is fixed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Phase 008 T002's negative check is vacuous** — the pattern `runtime/dist/hooks/lib/history` matches the harness's actual line 18, so the check flips from one hit to none when the owned line is fixed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 008 T002's negative check is vacuous** — the pattern `runtime/dist/hooks/lib/history` matches the harness's actual line 18, so the check flips from one hit to none when the owned line is fixed.

### **Phase-008 plan, description or graph metadata contradict spec/tasks** — the new path, level, status and parent chain agree, and all three source hashes match the current docs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Phase-008 plan, description or graph metadata contradict spec/tasks** — the new path, level, status and parent chain agree, and all three source hashes match the current docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase-008 plan, description or graph metadata contradict spec/tasks** — the new path, level, status and parent chain agree, and all three source hashes match the current docs.

### **Prompt injection from retrieved content into a command** — history text is JSON-serialized and sliced; the offer carries no transcript text and states the data-not-instructions rule. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Prompt injection from retrieved content into a command** — history text is JSON-serialized and sliced; the offer carries no transcript text and states the data-not-instructions rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Prompt injection from retrieved content into a command** — history text is JSON-serialized and sliced; the offer carries no transcript text and states the data-not-instructions rule.

### **Stale import of the retired engine location** — every import found resolves to `.skilled/hooks/session-handover/history` or to the spec-kit runtime dist; no module still loads the old tree. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Stale import of the retired engine location** — every import found resolves to `.skilled/hooks/session-handover/history` or to the spec-kit runtime dist; no module still loads the old tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale import of the retired engine location** — every import found resolves to `.skilled/hooks/session-handover/history` or to the spec-kit runtime dist; no module still loads the old tree.

### **Symlink swap of a transcript path** — the digest binds the path string, not the inode, but substitution requires write access to the same user's store directory, which is not a privilege crossing. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Symlink swap of a transcript path** — the digest binds the path string, not the inode, but substitution requires write access to the same user's store directory, which is not a privilege crossing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Symlink swap of a transcript path** — the digest binds the path string, not the inode, but substitution requires write access to the same user's store directory, which is not a privilege crossing.

### **The 66-character bound copies disagree** — both are 66 with the same quoted-length predicate (`lookup-offer.ts:33,58`; `hook-state.ts:278,283`), and the locator suite cross-checks schema behavior against the offer. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The 66-character bound copies disagree** — both are 66 with the same quoted-length predicate (`lookup-offer.ts:33,58`; `hook-state.ts:278,283`), and the locator suite cross-checks schema behavior against the offer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 66-character bound copies disagree** — both are 66 with the same quoted-length predicate (`lookup-offer.ts:33,58`; `hook-state.ts:278,283`), and the locator suite cross-checks schema behavior against the offer.

### **The bound copies disagree** — no; both are 66 with the same quote transform. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The bound copies disagree** — no; both are 66 with the same quote transform.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The bound copies disagree** — no; both are 66 with the same quote transform.

### **The carried P1/P2s were fixed at HEAD** — ruled out; each reproduces at its anchor or is unchanged with a clean drift check. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The carried P1/P2s were fixed at HEAD** — ruled out; each reproduces at its anchor or is unchanged with a clean drift check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The carried P1/P2s were fixed at HEAD** — ruled out; each reproduces at its anchor or is unchanged with a clean drift check.

### **The catalog's reader test anchors are dead** — `matrix.test.mjs` and `side-effects.test.mjs` both exist under `.skilled/hooks/shared/tests/session-readers/`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The catalog's reader test anchors are dead** — `matrix.test.mjs` and `side-effects.test.mjs` both exist under `.skilled/hooks/shared/tests/session-readers/`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The catalog's reader test anchors are dead** — `matrix.test.mjs` and `side-effects.test.mjs` both exist under `.skilled/hooks/shared/tests/session-readers/`.

### **The catalog's success-path exit code disagrees with the CLI** — `cli.ts:577-580,592-593` writes the reply and returns 0; the catalog `:51` and README `:144` state the same. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The catalog's success-path exit code disagrees with the CLI** — `cli.ts:577-580,592-593` writes the reply and returns 0; the catalog `:51` and README `:144` state the same.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The catalog's success-path exit code disagrees with the CLI** — `cli.ts:577-580,592-593` writes the reply and returns 0; the catalog `:51` and README `:144` state the same.

### **The CI engine step passes as written** — ruled out; the install set never provisions the `tsc` path the build script invokes. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The CI engine step passes as written** — ruled out; the install set never provisions the `tsc` path the build script invokes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The CI engine step passes as written** — ruled out; the install set never provisions the `tsc` path the build script invokes.

### **The CI engine step would pass as written.** Ruled out; the carried P1 is re-confirmed by the install set. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The CI engine step would pass as written.** Ruled out; the carried P1 is re-confirmed by the install set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The CI engine step would pass as written.** Ruled out; the carried P1 is re-confirmed by the install set.

### **The engine README is stale on the moved layout or operations** — the file map, four operations, budget and validation order match the shipped files and configuration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The engine README is stale on the moved layout or operations** — the file map, four operations, budget and validation order match the shipped files and configuration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The engine README is stale on the moved layout or operations** — the file map, four operations, budget and validation order match the shipped files and configuration.

### **The engine trigger filter includes the hook tree** — ruled out; both filters omit `.skilled/hooks/**`, so `I1-P2-002` stands. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The engine trigger filter includes the hook tree** — ruled out; both filters omit `.skilled/hooks/**`, so `I1-P2-002` stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The engine trigger filter includes the hook tree** — ruled out; both filters omit `.skilled/hooks/**`, so `I1-P2-002` stands.

### **The feature catalog still names retired paths** — every implementation and test anchor spot-checked resolves to the moved engine or an existing reader test (`compaction-history-lookup.md:69-76,82-93`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The feature catalog still names retired paths** — every implementation and test anchor spot-checked resolves to the moved engine or an existing reader test (`compaction-history-lookup.md:69-76,82-93`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The feature catalog still names retired paths** — every implementation and test anchor spot-checked resolves to the moved engine or an existing reader test (`compaction-history-lookup.md:69-76,82-93`).

### **The legacy CLI regex is stale drift.** The surrounding comment states it exists for older transcripts, so it is compatibility rather than a stale path; no finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The legacy CLI regex is stale drift.** The surrounding comment states it exists for older transcripts, so it is compatibility rather than a stale path; no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The legacy CLI regex is stale drift.** The surrounding comment states it exists for older transcripts, so it is compatibility rather than a stale path; no finding.

### **The old-path fixture is stale drift** — ruled out; the fixture comment and the paired-path assertion document compatibility. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The old-path fixture is stale drift** — ruled out; the fixture comment and the paired-path assertion document compatibility.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The old-path fixture is stale drift** — ruled out; the fixture comment and the paired-path assertion document compatibility.

### **The old-path sweep found live drift** — the sweep's only executable hit outside `specs/` is the intentionally excluded harness line, and the 48 spec hits are historical prose. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The old-path sweep found live drift** — the sweep's only executable hit outside `specs/` is the intentionally excluded harness line, and the 48 spec hits are historical prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The old-path sweep found live drift** — the sweep's only executable hit outside `specs/` is the intentionally excluded harness line, and the 48 spec hits are historical prose.

### **The playbook's `../../../node_modules/.bin/vitest` path is broken** — it resolves to `.skilled/node_modules/.bin/vitest`, which exists, and equals the package test script (`history/package.json:13`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The playbook's `../../../node_modules/.bin/vitest` path is broken** — it resolves to `.skilled/node_modules/.bin/vitest`, which exists, and equals the package test script (`history/package.json:13`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The playbook's `../../../node_modules/.bin/vitest` path is broken** — it resolves to `.skilled/node_modules/.bin/vitest`, which exists, and equals the package test script (`history/package.json:13`).

### **The playbook's two stale test anchors were fixed** — `:185-186` still name the retired runtime paths; the moved counterparts exist under `history/tests/`, so `I3-P2-001` stands. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The playbook's two stale test anchors were fixed** — `:185-186` still name the retired runtime paths; the moved counterparts exist under `history/tests/`, so `I3-P2-001` stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The playbook's two stale test anchors were fixed** — `:185-186` still name the retired runtime paths; the moved counterparts exist under `history/tests/`, so `I3-P2-001` stands.

### **The projection schema skip is currently firing.** The schema exists; the gap remains latent (carried P2), not a live failure. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The projection schema skip is currently firing.** The schema exists; the gap remains latent (carried P2), not a live failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The projection schema skip is currently firing.** The schema exists; the gap remains latent (carried P2), not a live failure.

### **The projection schema skip is live dead code** — the resolved schema file exists, so the validation block currently runs; the gap is latent, and it is reported as Finding 3 rather than as a present failure. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The projection schema skip is live dead code** — the resolved schema file exists, so the validation block currently runs; the gap is latent, and it is reported as Finding 3 rather than as a present failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The projection schema skip is live dead code** — the resolved schema file exists, so the validation block currently runs; the gap is latent, and it is reported as Finding 3 rather than as a present failure.

### **The three playbook P2s were fixed.** All three still reproduce at the cited lines. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The three playbook P2s were fixed.** All three still reproduce at the cited lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The three playbook P2s were fixed.** All three still reproduce at the cited lines.

### **The two 66-character copies disagree.** Both are 66 with identical quoting and predicate; no finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The two 66-character copies disagree.** Both are 66 with identical quoting and predicate; no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The two 66-character copies disagree.** Both are 66 with identical quoting and predicate; no finding.

### **TTL bypass by editing `mintedAt`** — the actor able to edit the state file already has the user's own read access to the transcript store. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **TTL bypass by editing `mintedAt`** — the actor able to edit the state file already has the user's own read access to the transcript store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **TTL bypass by editing `mintedAt`** — the actor able to edit the state file already has the user's own read access to the transcript store.

### **Unvalidated `load` id element types** — `cli.ts:480-484` casts the array, but `navigator.ts:477-481` re-validates each id as a string of ≤128 characters before the map lookup. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Unvalidated `load` id element types** — `cli.ts:480-484` casts the array, but `navigator.ts:477-481` re-validates each id as a string of ≤128 characters before the map lookup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Unvalidated `load` id element types** — `cli.ts:480-484` casts the array, but `navigator.ts:477-481` re-validates each id as a string of ≤128 characters before the map lookup.

### **Vibe was added to the playbook's capability lines** — `:147` and `:166` still say "Claude Code or Codex" only, so `I3-P2-002` stands. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Vibe was added to the playbook's capability lines** — `:147` and `:166` still say "Claude Code or Codex" only, so `I3-P2-002` stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Vibe was added to the playbook's capability lines** — `:147` and `:166` still say "Claude Code or Codex" only, so `I3-P2-002` stands.

### **World-readable state in the OS temp dir** — the directory is created with mode `0o700` and the id is hashed (`hook-state.ts:479-492`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **World-readable state in the OS temp dir** — the directory is created with mode `0o700` and the id is hashed (`hook-state.ts:479-492`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **World-readable state in the OS temp dir** — the directory is created with mode `0o700` and the id is hashed (`hook-state.ts:479-492`).

### A carried P2 acquiring P1 impact at the terminal pass: no new impact evidence exists for any of the seven. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A carried P2 acquiring P1 impact at the terminal pass: no new impact evidence exists for any of the seven.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A carried P2 acquiring P1 impact at the terminal pass: no new impact evidence exists for any of the seven.

### A fresh dimension or unread target source remaining: all four dimensions complete, registry has no unread target source. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A fresh dimension or unread target source remaining: all four dimensions complete, registry has no unread target source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fresh dimension or unread target source remaining: all four dimensions complete, registry has no unread target source.

### A fresh dimension remaining: all four dimensions are complete and no unread target source remains. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A fresh dimension remaining: all four dimensions are complete and no unread target source remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fresh dimension remaining: all four dimensions are complete and no unread target source remains.

### A fresh re-entry into the four operator residuals: each direction is BLOCKED, and the dispatch forbids re-entry. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A fresh re-entry into the four operator residuals: each direction is BLOCKED, and the dispatch forbids re-entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fresh re-entry into the four operator residuals: each direction is BLOCKED, and the dispatch forbids re-entry.

### A live old-path reference surviving outside `specs/` outside the owned harness line and documented compatibility fixtures. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A live old-path reference surviving outside `specs/` outside the owned harness line and documented compatibility fixtures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A live old-path reference surviving outside `specs/` outside the owned harness line and documented compatibility fixtures.

### A new finding from any of the four operator residuals: each resolved to a confirmation of an existing finding or to a clean surface. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A new finding from any of the four operator residuals: each resolved to a confirmation of an existing finding or to a clean surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding from any of the four operator residuals: each resolved to a confirmation of an existing finding or to a clean surface.

### A new finding from the remaining P2 read gap: all four anchors reproduce exactly and are re-attributed to their existing findings, not to new ones. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A new finding from the remaining P2 read gap: all four anchors reproduce exactly and are re-attributed to their existing findings, not to new ones.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding from the remaining P2 read gap: all four anchors reproduce exactly and are re-attributed to their existing findings, not to new ones.

### A new finding from the terminal re-read: every re-read reproduced an existing finding or a previously confirmed clean surface. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A new finding from the terminal re-read: every re-read reproduced an existing finding or a previously confirmed clean surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding from the terminal re-read: every re-read reproduced an existing finding or a previously confirmed clean surface.

### Any active finding being fixed or its anchor moving at HEAD: zero drift over all target paths; only later commit is outside the review scope. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Any active finding being fixed or its anchor moving at HEAD: zero drift over all target paths; only later commit is outside the review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any active finding being fixed or its anchor moving at HEAD: zero drift over all target paths; only later commit is outside the review scope.

### The carried findings were fixed, or their anchors moved, at HEAD `5bd9d54`: the working-tree status over the anchor set and the committed diff since `1c7bc3d9d63` are both empty. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The carried findings were fixed, or their anchors moved, at HEAD `5bd9d54`: the working-tree status over the anchor set and the committed diff since `1c7bc3d9d63` are both empty.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The carried findings were fixed, or their anchors moved, at HEAD `5bd9d54`: the working-tree status over the anchor set and the committed diff since `1c7bc3d9d63` are both empty.

### The CI engine step passing as written. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The CI engine step passing as written.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The CI engine step passing as written.

### The projection schema skip currently firing. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The projection schema skip currently firing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The projection schema skip currently firing.

### The two 66-character copies disagreeing. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The two 66-character copies disagreeing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The two 66-character copies disagreeing.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- Stale import of the retired engine path: every import resolves under `.skilled/hooks/session-handover/history` or the spec-kit runtime dist (iteration 1, evidence: `rg -n 'runtime/hooks/lib/history' .skilled .github .opencode`).
- Live old-path drift outside `specs/`: the only executable hit is the known phase-1 harness line owned by 008 T002 (iteration 1).
- The two 66-character bounds disagree: both are 66 with an identical quote transform (iteration 1, evidence: `hook-state.ts:278`, `lookup-offer.ts:33,53`).
- Path traversal through the argv session id: the id is hashed into the state filename before use (`cli.ts:187-190`, `hook-state.ts:484-487`) (iteration 2).
- Prompt injection from retrieved content into a command: history text is JSON-serialized and sliced, and the offer carries no transcript text while stating the data-not-instructions rule (`lookup-offer.ts:71-75`, `navigator.ts:254-291`) (iteration 2).
- Handle timing or replay as an auth boundary: the digest is not a bearer secret and its holder already reads the transcript store (iteration 2).
- World-readable hook state in the OS temp dir: mode 0700 and a hashed filename (`hook-state.ts:479-492`) (iteration 2).
- The duplicated 66-character bound drifting: both copies quote identically and bound the quoted form (`hook-state.ts:281-284`, `lookup-offer.ts:52-59`) (iteration 2 re-verification).
- The feature catalog still naming retired paths: every spot-checked implementation and test anchor resolves to the moved engine or an existing reader test (`compaction-history-lookup.md:69-76,82-93`) (iteration 3).
- The playbook's `../../../node_modules/.bin/vitest` path being broken: it resolves to `.skilled/node_modules/.bin/vitest`, which exists, and matches the package test script (`history/package.json:13`) (iteration 3).
- Phase-008 T002's negative check being vacuous: the pattern `runtime/dist/hooks/lib/history` matches the harness's actual line 18, so the check flips from one hit to none when the owned line is fixed (iteration 3).
- The catalog's reader test anchors being dead: `matrix.test.mjs` and `side-effects.test.mjs` both exist under `.skilled/hooks/shared/tests/session-readers/` (iteration 3).
- A live old-path reference surviving outside the playbooks: the iteration 1 sweep conclusion stands; this pass adds only retired test-path rows inside one playbook (iteration 3 re-check).
- A live old-path reference in code, tests, CI, docs or provisioning: the iteration 6 sweep found no `runtime/hooks/lib/history` or full retired-path hit outside `specs/`; the only encoded legacy tail is the documented compatibility regex at `history.ts:330-335` (iteration 6).
- Drift between the `history.ts` entry contract and its published schema: the type-level key/required guards and the contract suite agree in both directions (iteration 6).
- The engine's 66-character quoted bound disagreeing with the hook-state copy: both are 66 with the same quote transform and predicate (iteration 6 re-verification).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Loop terminated by `stopPolicy=max-iterations` (10 of 10). Synthesis consumes this record; no further iteration is dispatched. Planning Packet fix order and owners: 1. `I1-P1-001` — engine owner. Replace the hardcoded `tsc` path at `package.json:11` with a workspace-relative invocation, or add an install step that provisions `.skilled/skills/system-spec-kit/node_modules`. 2. `I1-P2-002` — CI owner. Add `.skilled/hooks/**` to both trigger filters (`spec-kit-check.yml:7-8,48-49`). 3. `I1-P2-003` — shared-session-readers owner. Make the missing-schema branch fail rather than skip (`project.test.mjs:141-142`). 4. `I1-P2-004` — hook-state owner. Pin the two constants equal in both directions (compare constants, not only behavior). 5. `I2-P2-001` — engine owner. Quote or allowlist `locator.runtime` before interpolation (`lookup-offer.ts:69-70`). 6. `I3-P2-001` to `I3-P2-003` — manual-testing-playbook owner. Refresh the two Source Files rows, add Vibe to `:147,:166`, and reconcile `:18` with `:22`. All eight findings remain active (0 resolved). Active P1 `I1-P1-001` remains and no P0 exists, so the verdict is CONDITIONAL.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- The prior review packet (a fable-medium and opus-medium fan-out) was archived to review-archive/20261115T173303Z at restart; its report is prior context only.
- The engine moved from .skilled/skills/system-spec-kit/runtime/hooks/lib/history/ to .skilled/hooks/session-handover/history/ (lib/, dist/, tests/). Commits: 169da2e8cba renames, fff42af2b8b package/callers/CI/provisioning/freshness/docs, eff90e56922 Vibe prefix README line, 7b2c2d3726e trigger index rebuild, 1c7bc3d9d63 phase 008 plan.
- The operator chose a pinned copy of the 66-character quoted session-id bound in hook-state.ts, held equal by a sweep test in history/tests/history-locator.vitest.ts.
- resource-map.md not present; skipping coverage gate.

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
| `spec_code` | core | pass | 3 | Shipped paths and behavior match the parent phase intent; the files-to-change row at parent `spec.md:102` is a historical action list (`spec.md:97-98`). |
| `checklist_evidence` | core | pass | 3 | Phase 008 is Draft with all T001-T011 unchecked; T002's negative pattern matches `hop-recall.sh:18`, so it is non-vacuous. |
| `skill_agent` | overlay | notApplicable | 3 | No SKILL.md, command document, or agent definition inside the declared target. |
| `agent_cross_runtime` | overlay | notApplicable | 3 | No runtime mirror path inside the declared target. |
| `feature_catalog_code` | overlay | pass | 3 | Cap 600 (`lookup-offer.ts:21`), command (`:20`), prefix rule (`:69`) and refusal exit 2 (`cli.ts:597`) match; both cited reader tests exist. Success exit 0 not traced. |
| `playbook_capability` | overlay | fail | 3 | `I3-P2-001` (retired test anchors), `I3-P2-002` (Vibe omitted at `:147,166`), `I3-P2-003` (hop-recall pair describes a no-offer hop). |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .github/workflows/spec-kit-check.yml | - | - | 0 | pending |
| .skilled/hooks/injection-contract.md | - | - | 0 | pending |
| .skilled/hooks/session-handover/README.md | - | - | 0 | pending |
| .skilled/hooks/session-handover/bin/README.md | - | - | 0 | pending |
| .skilled/hooks/session-handover/bin/history-lookup.mjs | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/README.md | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/cli.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/core.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/history-entry.schema.json | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/history.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/index.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/loads.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/locator-digest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/lookup-offer.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/navigator.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/pages.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/projection.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/lib/response.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/package.json | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/_support/history-fixtures.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-byte-bound.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-cursor-reconstruction.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-entry-contract.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-locator.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-lookup-cli.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-projection.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-search-analyzer.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-search-browse.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tests/history-vocabulary-drift.vitest.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/tsconfig.json | - | - | 0 | pending |
| .skilled/hooks/session-handover/history/vitest.config.ts | - | - | 0 | pending |
| .skilled/hooks/session-handover/lib/relaunch-core.cjs | - | - | 0 | pending |
| .skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs | - | - | 0 | pending |
| .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs | - | - | 0 | pending |
| .skilled/hooks/shared/session-readers/README.md | - | - | 0 | pending |
| .skilled/hooks/shared/tests/session-readers/project.test.mjs | - | - | 0 | pending |
| .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/compaction-post-tool.md | - | - | 0 | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json | - | - | 0 | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json | - | - | 0 | pending |
| .skilled/skills/sk-git/scripts/worktree-provision-paths.txt | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-baseline-conversation.md | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts | - | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/description.json | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/graph-metadata.json | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/plan.md | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/scratch/.gitkeep | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/spec.md | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/008-wider-hop-recall-measurement/tasks.md | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/graph-metadata.json | - | - | 0 | pending |
| specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/spec.md | - | - | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-15T17:33:23.837Z, parentSessionId=null, generation=1, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-15T17:33:23.837Z
<!-- MACHINE-OWNED: END -->


# Deep Review Strategy - vibe-3 lineage

## 1. OVERVIEW

### Purpose

Persistent brain for the vibe-3 fan-out lineage of the phase-019 deep review. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- **Init:** config, state log, findings registry and this strategy were created by `phase_init`.
- **Per iteration:** the executor reads Next Focus, reviews the assigned dimension and frontier node, writes the iteration narrative, updates this file, records one iteration row through the append gateway, writes the delta, then runs the reducer.
- **Mutability:** mutable; only the sections below are edited in place.

---

## 2. TOPIC

Review of the phase-019 commit set at HEAD: background vector refresh, semantic lane coverage gate, launcher liveness, `OLLAMA_*` passthrough, generation counter, status and doctor coverage (31ffd18beab, 1ccbb3283c6, dc3979eb451), the test and routing follow-ups (86038dfba80, c74042fd559, 571575632a4, 5c91b2f3f5d, 0390556ee2b), and the ten `docs(specs)` commits that wrote 231 ended-session answers into `decision-record.md` files.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Style, formatting and naming preferences with no shipped-behavior effect.
- Re-litigating the frozen decisions D1-D7 of the owning packet.
- Changing `system-spec-kit/shared/embeddings` (decision D4).
- Running the repository's build, test or validation tooling; this lineage reports findings only.

---

## 5. STOP CONDITIONS

- Legal convergence at `convergenceThreshold` 0.10 under `stopPolicy: convergence`.
- `maxIterations` 16 reached.
- Three consecutive failed iterations (status error or timeout).

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
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Direct `git show` of the reviewed commits followed by a HEAD read of the same lines: it separated the launcher liveness claims (clean) from the coverage-gate defect in one pass (iteration 1).
- Reading the documented contract beside the implementation (`loadSkillEmbeddings`'s read-only note against `embeddingCoverage`'s `getDb()` default) produced the P1 without a runtime probe (iteration 1).

---

## 9. WHAT FAILED

- Reading only the commit diff without the HEAD file: the diff of `semantic-shadow.ts` showed a `requiredVectorRows` gate that 1ccbb3283c6 had already replaced with `embeddingCoverage().complete`, so the diff alone would have reported a stale finding (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A cloned repository can redirect embeddings to an attacker's server through `.env`": ruled out -- both env files are gitignored. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "A cloned repository can redirect embeddings to an attacker's server through `.env`": ruled out -- both env files are gitignored.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A cloned repository can redirect embeddings to an attacker's server through `.env`": ruled out -- both env files are gitignored.

### "A committed answer leaks a credential": ruled out -- the only secret-shaped string is the writer's zero fingerprint. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "A committed answer leaks a credential": ruled out -- the only secret-shaped string is the writer's zero fingerprint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A committed answer leaks a credential": ruled out -- the only secret-shaped string is the writer's zero fingerprint.

### "A committed answer leaks a private path": ruled out -- no home-directory path appears in the added lines. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "A committed answer leaks a private path": ruled out -- no home-directory path appears in the added lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A committed answer leaks a private path": ruled out -- no home-directory path appears in the added lines.

### "A documented variable is not read by any code": ruled out -- each of the five checked variables resolves to a reader at HEAD. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "A documented variable is not read by any code": ruled out -- each of the five checked variables resolves to a reader at HEAD.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A documented variable is not read by any code": ruled out -- each of the five checked variables resolves to a reader at HEAD.

### "A malformed `OLLAMA_REQUEST_TIMEOUT_MS` produces an unbounded or zero deadline": ruled out -- the parser requires a finite positive integer. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "A malformed `OLLAMA_REQUEST_TIMEOUT_MS` produces an unbounded or zero deadline": ruled out -- the parser requires a finite positive integer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A malformed `OLLAMA_REQUEST_TIMEOUT_MS` produces an unbounded or zero deadline": ruled out -- the parser requires a finite positive integer.

### "A read variable is undocumented": ruled out -- the runtime's `OLLAMA_*`, `SYSTEM_SKILL_ADVISOR_*` and `SPECKIT_ADVISOR_*` reads all appear in `ENV-REFERENCE.md`. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "A read variable is undocumented": ruled out -- the runtime's `OLLAMA_*`, `SYSTEM_SKILL_ADVISOR_*` and `SPECKIT_ADVISOR_*` reads all appear in `ENV-REFERENCE.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A read variable is undocumented": ruled out -- the runtime's `OLLAMA_*`, `SYSTEM_SKILL_ADVISOR_*` and `SPECKIT_ADVISOR_*` reads all appear in `ENV-REFERENCE.md`.

### "An answer was written into the wrong packet": ruled out for the two shared answers, whose records name all three packets. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "An answer was written into the wrong packet": ruled out for the two shared answers, whose records name all three packets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "An answer was written into the wrong packet": ruled out for the two shared answers, whose records name all three packets.

### "Removing the bare security policy phrase breaks a route that should still reach sk-doc": ruled out -- no sk-doc mode owns that phrase, `security.md` still routes, and the commit's stated intent is to stop the over-match. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Removing the bare security policy phrase breaks a route that should still reach sk-doc": ruled out -- no sk-doc mode owns that phrase, `security.md` still routes, and the commit's stated intent is to stop the over-match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Removing the bare security policy phrase breaks a route that should still reach sk-doc": ruled out -- no sk-doc mode owns that phrase, `security.md` still routes, and the commit's stated intent is to stop the over-match.

### "The 149/193 figure is fabricated": ruled out -- it matches the archived packet at `008-semantic-shadow-prove-or-freeze/implementation-summary.md:79` exactly. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The 149/193 figure is fabricated": ruled out -- it matches the archived packet at `008-semantic-shadow-prove-or-freeze/implementation-summary.md:79` exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 149/193 figure is fabricated": ruled out -- it matches the archived packet at `008-semantic-shadow-prove-or-freeze/implementation-summary.md:79` exactly.

### "The 231 answers were mis-mapped into the wrong packets": ruled out for the two shared answers, whose records name all three packets. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The 231 answers were mis-mapped into the wrong packets": ruled out for the two shared answers, whose records name all three packets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 231 answers were mis-mapped into the wrong packets": ruled out for the two shared answers, whose records name all three packets.

### "The 5-minute reaper stops a healthy server": ruled out by the 15 s heartbeat interval against the 180 s stale window. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The 5-minute reaper stops a healthy server": ruled out by the 15 s heartbeat interval against the 180 s stale window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 5-minute reaper stops a healthy server": ruled out by the 15 s heartbeat interval against the 180 s stale window.

### "The ablation's fail result was overridden by a later default change": ruled out -- the registry still ships weight 0. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The ablation's fail result was overridden by a later default change": ruled out -- the registry still ships weight 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The ablation's fail result was overridden by a later default change": ruled out -- the registry still ships weight 0.

### "The child gets a different database directory than the launcher": ruled out by the pinned `SYSTEM_SKILL_ADVISOR_DB_DIR` and the shared `resolveSkillGraphDbDir` reader. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The child gets a different database directory than the launcher": ruled out by the pinned `SYSTEM_SKILL_ADVISOR_DB_DIR` and the shared `resolveSkillGraphDbDir` reader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The child gets a different database directory than the launcher": ruled out by the pinned `SYSTEM_SKILL_ADVISOR_DB_DIR` and the shared `resolveSkillGraphDbDir` reader.

### "The CI vocabulary guard points at a path that does not exist": ruled out -- `.opencode/skills` is a symlink to `../.skilled/skills` and the script resolves through it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The CI vocabulary guard points at a path that does not exist": ruled out -- `.opencode/skills` is a symlink to `../.skilled/skills` and the script resolves through it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The CI vocabulary guard points at a path that does not exist": ruled out -- `.opencode/skills` is a symlink to `../.skilled/skills` and the script resolves through it.

### "The coverage reader and the loader disagree on the content-hash recipe": ruled out -- both call `computeContentHash(skillDescriptionForEmbedding(...).trim())`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The coverage reader and the loader disagree on the content-hash recipe": ruled out -- both call `computeContentHash(skillDescriptionForEmbedding(...).trim())`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The coverage reader and the loader disagree on the content-hash recipe": ruled out -- both call `computeContentHash(skillDescriptionForEmbedding(...).trim())`.

### "The decision record title drifts from the packet's spec title": ruled out -- the record title is `Decision Record: <spec title body>` by convention, and the sampled pair matches. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The decision record title drifts from the packet's spec title": ruled out -- the record title is `Decision Record: <spec title body>` by convention, and the sampled pair matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The decision record title drifts from the packet's spec title": ruled out -- the record title is `Decision Record: <spec title body>` by convention, and the sampled pair matches.

### "The decision records claim `completion_pct: 0` on completed packets": ruled out as a defect of these commits -- 7 of the 9 decision records in `specs/` carry the same value, so it is the writer's template default rather than something these ten commits introduced. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The decision records claim `completion_pct: 0` on completed packets": ruled out as a defect of these commits -- 7 of the 9 decision records in `specs/` carry the same value, so it is the writer's template default rather than something these ten commits introduced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The decision records claim `completion_pct: 0` on completed packets": ruled out as a defect of these commits -- 7 of the 9 decision records in `specs/` carry the same value, so it is the writer's template default rather than something these ten commits introduced.

### "The generation counter lands beside the wrong database": ruled out by `sameDirectory`'s canonical comparison against the launcher's default directory. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The generation counter lands beside the wrong database": ruled out by `sameDirectory`'s canonical comparison against the launcher's default directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The generation counter lands beside the wrong database": ruled out by `sameDirectory`'s canonical comparison against the launcher's default directory.

### "The launcher's watchdog duplicates the daemon's parent watch": ruled out -- one watches the child from the launcher, the other watches the launcher from the daemon. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The launcher's watchdog duplicates the daemon's parent watch": ruled out -- one watches the child from the launcher, the other watches the launcher from the daemon.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The launcher's watchdog duplicates the daemon's parent watch": ruled out -- one watches the child from the launcher, the other watches the launcher from the daemon.

### "The packet's ablation record is internally inconsistent": ruled out -- `implementation-summary.md:99`, `:113` and `:121` all state 156 against 161 with the same flip count. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The packet's ablation record is internally inconsistent": ruled out -- `implementation-summary.md:99`, `:113` and `:121` all state 156 against 161 with the same flip count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The packet's ablation record is internally inconsistent": ruled out -- `implementation-summary.md:99`, `:113` and `:121` all state 156 against 161 with the same flip count.

### "The refresh is gated on the semantic lane weight": ruled out -- no weight check exists in the refresh path. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The refresh is gated on the semantic lane weight": ruled out -- no weight check exists in the refresh path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The refresh is gated on the semantic lane weight": ruled out -- no weight check exists in the refresh path.

### "The routing change opens a hole into a mutating mode": ruled out -- `defaultMode` is `null`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The routing change opens a hole into a mutating mode": ruled out -- `defaultMode` is `null`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The routing change opens a hole into a mutating mode": ruled out -- `defaultMode` is `null`.

### "The session-handover test was loosened to match new text": ruled out -- the test now computes the same absolute path the source builds. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The session-handover test was loosened to match new text": ruled out -- the test now computes the same absolute path the source builds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The session-handover test was loosened to match new text": ruled out -- the test now computes the same absolute path the source builds.

### "The startup refresh runs before the IPC socket is ready": ruled out -- it is started after `startIpcSocketServer` resolves. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The startup refresh runs before the IPC socket is ready": ruled out -- it is started after `startIpcSocketServer` resolves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The startup refresh runs before the IPC socket is ready": ruled out -- it is started after `startIpcSocketServer` resolves.

### "The status path mutates the database": ruled out -- it opens read-only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The status path mutates the database": ruled out -- it opens read-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The status path mutates the database": ruled out -- it opens read-only.

### "The ten commits do not follow the one-commit-per-track rule": ruled out -- each commit names one track. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The ten commits do not follow the one-commit-per-track rule": ruled out -- each commit names one track.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The ten commits do not follow the one-commit-per-track rule": ruled out -- each commit names one track.

### "The zero fingerprint makes a later save look like a duplicate": ruled out -- the resume ladder compares it against a recomputed content hash, which it can never match. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The zero fingerprint makes a later save look like a duplicate": ruled out -- the resume ladder compares it against a recomputed content hash, which it can never match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The zero fingerprint makes a later save look like a duplicate": ruled out -- the resume ladder compares it against a recomputed content hash, which it can never match.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- "The 5-minute heartbeat reaper stops a healthy server": the child writes every 15 s against a 180 s stale window (iteration 1, evidence: `system-skill-advisor-launcher.cjs:1558`, `liveness.ts:18`).
- "The child gets a different database directory than the launcher": the pinned `SYSTEM_SKILL_ADVISOR_DB_DIR` and the shared `resolveSkillGraphDbDir` reader agree (iteration 1, evidence: `system-skill-advisor-launcher.cjs:326`, `skill-graph-db.ts:306`).
- "The generation counter lands beside the wrong database": `sameDirectory` canonicalizes the override against the launcher default (iteration 1, evidence: `generation.ts:55`, `system-skill-advisor-launcher.cjs:24`).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: the frontier is drained, all four dimensions are covered, and two cross-reference passes have run - Rotation status: F-1-003 4 of 4, F-1-006 4 of 4, cross-reference 2 of 2 - Blocked/productive carry-forward: clean -- the env-var surface produced no finding - Required evidence: none; synthesis reads the registry and the ten iteration files - Recovery note: none Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 119 files the reviewed commits touch, resolved at init into `reviewScopeFiles`; the two frontier nodes F-1-003 and F-1-006 name the highest-risk subsets.
- Behavior claims: decision D1 (full current vector coverage kept by the daemon at any lane weight, doctor checks reading it, coverage gate, outage as degraded, `OLLAMA_*` forwarding), D2 (ablation pass bar), D3 (231 orphan answers written once each), D6 (both alignment reports cleared).
- Reuse and conventions: `sk-code-review` doctrine for severity; the packet's `decision-record.md` and `implementation-summary.md` for the claims under test.
- Review risks and gaps: `resource-map.md` not present; the review target is a commit set, so scope is the touched-file list rather than a directory tree.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 16
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-3-1795172940208-84a42n, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-20T11:10:20Z
<!-- MACHINE-OWNED: END -->

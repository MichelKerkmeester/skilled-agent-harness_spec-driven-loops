---
title: Deep Review Strategy
description: Session tracking for the deep review of the OpenCode v1 removal packet.
contextType: planning
importance_tier: normal
---

# Deep Review Strategy

## 2. TOPIC
Review: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal (spec-folder). The OpenCode v1 removal as merged to main: merge 06d02096e90 (diff against its first parent), closure a2dc927a8a3, parent fix b18b80291d2. OpenCode 2 (2.3.2) must be the only supported major.

Operator focus: verify the prior review's fixes hold, no v1 path survives outside the justified lists, and packet evidence matches the code. The justified-list gap for skilled-loop was fixed in f6aa8dc052b; confirm it, do not re-report it.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Changes merged in from origin/main through the first parent (only the merge's own diff against its first parent is in scope).
- The three CI suites that failed on main before the merge (Deep-Loop Runtime pi executor-config, Hook Vitest Pi handover, Plugin Tests Claude-source clamp).
- Fixing anything: the review target is read-only.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: run all 5 iterations; convergence is telemetry only.
- Halt on lock loss, a gateway refusal, three consecutive failed iterations or an unavailable executor.

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
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- Reading producer + consumers together (parser -> rule engine -> wrapper/battery): caught that `unknown` and `v2` are behaviorally identical today, which kept the `opencode2` drift at P2 instead of inflating it (iteration 1)
- Re-running the packet's own recorded verification command (T021) and `comm`-diffing it against justified.txt: proved AC-007 instead of trusting the closure note (iteration 1)
- Auditing the rewritten `remove-v1` against its own header claim instead of against the old helper: the diff shows the merge narrowed the mutation surface (single `rm --` on the launcher, quoted `mv --`, constant `opencode-ai` operand), which turned a suspected quoting finding into a clean surface (iteration 2)
- Comparing each long-lived child process to the environment it is handed (`v2ServerEnv` spreading `...env`) is what surfaced the unpinned bind posture; reading the spawn line alone showed nothing wrong (iteration 2)
- Reading a test's fixture list together with every other fixture the same file already loads: the parity case looked adequate until the 13-entry corpus 15 lines above it turned out to cover shapes the 9-element list misses, which is what made DR4-P2-002 visible (iteration 4)
- Reading a workflow's trigger paths against the steps below them, instead of reading either one alone: the trigger-path glob and the four-test step are each fine, and only the pair shows that `opencode-setup.sh` can change with no test of it running (iteration 4)
- Re-proving a closed P1 from the consumer side instead of from the builder's own contract: reading `.vibe/plugins/repo-guards/session-cleanup.mjs` showed both hook paths build through `.factory`, which is stronger evidence than the bridge's JSDoc (iteration 5)
- Reading a fix's own regression test against the entry the production hook actually calls: the vibe hook and its test reach the plugin through the same `.factory`, so the DR4-P1-001 fix is proven at the call site, not at the comment (iteration 5)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- Trusting the word "parity" in a test title: the guard existed and both parser bodies were identical, so the drift question looked closed until the fixture breadth was read (iteration 4)
- Reading the CI workflow body without reading its own inline comment: the comment states the trigger-path invariant the test step breaks, so the finding only became citable once the two were read together (iteration 4)
- Repo-wide `grep -rIl` for v1 terms: returns untracked, gitignored and vendored copies that the packet criterion never covered; had to switch to the recorded `rg` command with its exclusion globs (iteration 1)
- Trying to reach a verdict on the battery's bind posture from repository evidence: `serve`'s default bind lives in the installed package, not in this tree, so the finding had to stay at low confidence with a named downgrade trigger rather than be resolved (iteration 2)
- Grepping `opencode2` repo-wide to re-check DR1-P2-001: the first page of hits was unrelated spec scratch copies under `specs/` and `barter/`, so the census had to be narrowed to the three files the finding names (iteration 5)

---

- Iteration 3 (worked): running the three ADR-001 replacement commands and every phase-001/002 zero-match proof on the merged tree, instead of reading the recorded observations, is what proved the criteria rather than the prose: all return the recorded counts, and the justified list matches the live repo-wide sweep path for path after the `./` prefix is accounted for.
- Iteration 3 (worked): comparing the cited evidence artifact's own header with the sections below it surfaced DR3-P2-001, a self-contradiction no summary-level read would have shown.
- Iteration 3 (failed): trusting a broad `rg` hit count as a hygiene breach before reading the hits — the 125 CHK-041 matches collapsed to data files, prose and two vitest case titles, so the finding had to be re-scoped from comment hygiene to proof-command reproducibility.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`OPENCODE_BIN` widens the executable trust set to an attacker-named file": ruled out — the override must exist and be readable for `fileIdentity` to match, and the probe then runs the resolved trusted path, not the value embedded in the command. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "`OPENCODE_BIN` widens the executable trust set to an attacker-named file": ruled out — the override must exist and be readable for `fileIdentity` to match, and the probe then runs the resolved trusted path, not the value embedded in the command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`OPENCODE_BIN` widens the executable trust set to an attacker-named file": ruled out — the override must exist and be readable for `fileIdentity` to match, and the probe then runs the resolved trusted path, not the value embedded in the command.

### "`opencode2` removal breaks bare-name probes": ruled out; the trust comparison runs only on the path-qualified branch. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "`opencode2` removal breaks bare-name probes": ruled out; the trust comparison runs only on the path-qualified branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`opencode2` removal breaks bare-name probes": ruled out; the trust comparison runs only on the path-qualified branch.

### "A launcher name or path bypasses the dispatch guard": ruled out for rule *application*. `evaluate` applies every rule when the version is unresolved (.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1123) and, when the command's binary token does not match either regex at all, `filterByVersion` stays false so the `continue` at :1124 never fires — an undetected dispatch still takes every rule. Name and path therefore cannot buy an unchecked dispatch today. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "A launcher name or path bypasses the dispatch guard": ruled out for rule *application*. `evaluate` applies every rule when the version is unresolved (.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1123) and, when the command's binary token does not match either regex at all, `filterByVersion` stays false so the `continue` at :1124 never fires — an undetected dispatch still takes every rule. Name and path therefore cannot buy an unchecked dispatch today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A launcher name or path bypasses the dispatch guard": ruled out for rule *application*. `evaluate` applies every rule when the version is unresolved (.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1123) and, when the command's binary token does not match either regex at all, `filterByVersion` stays false so the `continue` at :1124 never fires — an undetected dispatch still takes every rule. Name and path therefore cannot buy an unchecked dispatch today.

### "An OpenCode 1 binary still passes the dispatch guard unchanged": ruled out. `unsupported` is in `UNRESOLVED_FAMILIES`, and because `SUPPORTED_FAMILIES` is `['v2']`, `appliesToAll` is true for every current rule, so the two `error` rules still block. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "An OpenCode 1 binary still passes the dispatch guard unchanged": ruled out. `unsupported` is in `UNRESOLVED_FAMILIES`, and because `SUPPORTED_FAMILIES` is `['v2']`, `appliesToAll` is true for every current rule, so the two `error` rules still block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "An OpenCode 1 binary still passes the dispatch guard unchanged": ruled out. `unsupported` is in `UNRESOLVED_FAMILIES`, and because `SUPPORTED_FAMILIES` is `['v2']`, `appliesToAll` is true for every current rule, so the two `error` rules still block.

### "One of the eight P2s was silently fixed by a later commit" — ruled out by direct re-read of each cited line; all eight still stand as filed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "One of the eight P2s was silently fixed by a later commit" — ruled out by direct re-read of each cited line; all eight still stand as filed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "One of the eight P2s was silently fixed by a later commit" — ruled out by direct re-read of each cited line; all eight still stand as filed.

### "The `.server` entry still has a caller somewhere in the merge" — ruled out: the repo-wide token sweep returns only mcp-route-guard's unrelated `parsed.server`, and both vibe hook paths build through `.factory`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The `.server` entry still has a caller somewhere in the merge" — ruled out: the repo-wide token sweep returns only mcp-route-guard's unrelated `parsed.server`, and both vibe hook paths build through `.factory`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `.server` entry still has a caller somewhere in the merge" — ruled out: the repo-wide token sweep returns only mcp-route-guard's unrelated `parsed.server`, and both vibe hook paths build through `.factory`.

### "The `f6aa8dc052b` fix is cosmetic and the T021 sweep still has a hole" — ruled out: the list has 32 resolving rows and the feature-catalog replacement grep prints 0. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The `f6aa8dc052b` fix is cosmetic and the T021 sweep still has a hole" — ruled out: the list has 32 resolving rows and the feature-catalog replacement grep prints 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `f6aa8dc052b` fix is cosmetic and the T021 sweep still has a hole" — ruled out: the list has 32 resolving rows and the feature-catalog replacement grep prints 0.

### "The `remove-v1` TOCTOU lets a link swap delete a foreign file": ruled out — `rm` on a symlink unlinks the link, and the swap requires the user's own directory write authority (see Edge Cases). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The `remove-v1` TOCTOU lets a link swap delete a foreign file": ruled out — `rm` on a symlink unlinks the link, and the swap requires the user's own directory write authority (see Edge Cases).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `remove-v1` TOCTOU lets a link swap delete a foreign file": ruled out — `rm` on a symlink unlinks the link, and the swap requires the user's own directory write authority (see Edge Cases).

### "The `unknown` verdict lets a dispatch slip the version filter": ruled out for the same reason; unresolved families take every rule rather than none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The `unknown` verdict lets a dispatch slip the version filter": ruled out for the same reason; unresolved families take every rule rather than none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The `unknown` verdict lets a dispatch slip the version filter": ruled out for the same reason; unresolved families take every rule rather than none.

### "The 003 closure statement still contradicts the AC table" — ruled out: it now states `Closeable: Yes` with the ADR-001 supersessions named explicitly. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "The 003 closure statement still contradicts the AC table" — ruled out: it now states `Closeable: Yes` with the ADR-001 supersessions named explicitly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The 003 closure statement still contradicts the AC table" — ruled out: it now states `Closeable: Yes` with the ADR-001 supersessions named explicitly.

### "The doctor battery leaks the private server password into its JSON artifact": ruled out — the value lives only in `apiEnv` for in-process requests (:988) and no result field carries it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The doctor battery leaks the private server password into its JSON artifact": ruled out — the value lives only in `apiEnv` for in-process requests (:988) and no result field carries it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The doctor battery leaks the private server password into its JSON artifact": ruled out — the value lives only in `apiEnv` for in-process requests (:988) and no result field carries it.

### **"`VERSION_PATTERN` drifted between the two copies."** Ruled out: both declare the identical regex, character for character [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:24]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"`VERSION_PATTERN` drifted between the two copies."** Ruled out: both declare the identical regex, character for character [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:24].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"`VERSION_PATTERN` drifted between the two copies."** Ruled out: both declare the identical regex, character for character [SOURCE: .skilled/hooks/cli-dispatch/lib/opencode-version.mjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs:24].

### **"003 AC-001's cli-opencode file list diverges from the justified list."** Ruled out: the 11 cli-opencode files in the sweep are all present in `scratch/justified.txt`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"003 AC-001's cli-opencode file list diverges from the justified list."** Ruled out: the 11 cli-opencode files in the sweep are all present in `scratch/justified.txt`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"003 AC-001's cli-opencode file list diverges from the justified list."** Ruled out: the 11 cli-opencode files in the sweep are all present in `scratch/justified.txt`.

### **"A v1 branch survives in a plugin entry file under a dual-shaped export."** Ruled out: `dualPlugin` builds one `{id, setup}` definition whose `setup(ctx)` reads only `ctx.location.directory` and the v2 hook surface; no entry file carries a second default export or a version switch [SOURCE: .opencode/plugins/lib/v2-bridge.js:327-357]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"A v1 branch survives in a plugin entry file under a dual-shaped export."** Ruled out: `dualPlugin` builds one `{id, setup}` definition whose `setup(ctx)` reads only `ctx.location.directory` and the v2 hook surface; no entry file carries a second default export or a version switch [SOURCE: .opencode/plugins/lib/v2-bridge.js:327-357].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A v1 branch survives in a plugin entry file under a dual-shaped export."** Ruled out: `dualPlugin` builds one `{id, setup}` definition whose `setup(ctx)` reads only `ctx.location.directory` and the v2 hook surface; no entry file carries a second default export or a version switch [SOURCE: .opencode/plugins/lib/v2-bridge.js:327-357].

### **"Changed code violates the comment-hygiene rule."** Ruled out for code comments: the 125 CHK-041 hits are retrieval data files, playbook or changelog prose, and two vitest case titles; no changed code comment carries a packet or requirement id. The residual defect is the unreproducible proof command, filed as DR3-P2-002. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"Changed code violates the comment-hygiene rule."** Ruled out for code comments: the 125 CHK-041 hits are retrieval data files, playbook or changelog prose, and two vitest case titles; no changed code comment carries a packet or requirement id. The residual defect is the unreproducible proof command, filed as DR3-P2-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Changed code violates the comment-hygiene rule."** Ruled out for code comments: the 125 CHK-041 hits are retrieval data files, playbook or changelog prose, and two vitest case titles; no changed code comment carries a packet or requirement id. The residual defect is the unreproducible proof command, filed as DR3-P2-002.

### **"Doc residue presents v1 as still supported."** Ruled out: every v1 mention read in `README.md`, `install-and-versions.md`, `SKILL.md` and the changelog is historical, migration, or a recorded-reproduction note [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/README.md:51,148,284] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:218-228]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"Doc residue presents v1 as still supported."** Ruled out: every v1 mention read in `README.md`, `install-and-versions.md`, `SKILL.md` and the changelog is historical, migration, or a recorded-reproduction note [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/README.md:51,148,284] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:218-228].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Doc residue presents v1 as still supported."** Ruled out: every v1 mention read in `README.md`, `install-and-versions.md`, `SKILL.md` and the changelog is historical, migration, or a recorded-reproduction note [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/README.md:51,148,284] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:218-228].

### **"The `.opencode/` overlay drifted from the canonical tree in the files this merge touched."** Ruled out for the evidence surfaces read: the setup-classify test exists in both trees, and the battery workflow names both overlay paths symmetrically [SOURCE: .github/workflows/opencode-v2-battery.yml:26,51]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"The `.opencode/` overlay drifted from the canonical tree in the files this merge touched."** Ruled out for the evidence surfaces read: the setup-classify test exists in both trees, and the battery workflow names both overlay paths symmetrically [SOURCE: .github/workflows/opencode-v2-battery.yml:26,51].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The `.opencode/` overlay drifted from the canonical tree in the files this merge touched."** Ruled out for the evidence surfaces read: the setup-classify test exists in both trees, and the battery workflow names both overlay paths symmetrically [SOURCE: .github/workflows/opencode-v2-battery.yml:26,51].

### **"The battery workflow's README row overstates what it runs."** Ruled out: the row names the pin (2.3.2), the own-prefix install, the version battery and the four unit tests, and the workflow body does exactly that [SOURCE: .github/workflows/README.md:41]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"The battery workflow's README row overstates what it runs."** Ruled out: the row names the pin (2.3.2), the own-prefix install, the version battery and the four unit tests, and the workflow body does exactly that [SOURCE: .github/workflows/README.md:41].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The battery workflow's README row overstates what it runs."** Ruled out: the row names the pin (2.3.2), the own-prefix install, the version battery and the four unit tests, and the workflow body does exactly that [SOURCE: .github/workflows/README.md:41].

### **"The duplicated version rule has no parity guard at all."** Ruled out: `it('keeps CJS parsing in parity with the ESM parser for every fixture')` exists and compares both implementations over a shared fixture list [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:520-528]. Residual defect is the fixture list's breadth, filed as DR4-P2-002. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"The duplicated version rule has no parity guard at all."** Ruled out: `it('keeps CJS parsing in parity with the ESM parser for every fixture')` exists and compares both implementations over a shared fixture list [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:520-528]. Residual defect is the fixture list's breadth, filed as DR4-P2-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The duplicated version rule has no parity guard at all."** Ruled out: `it('keeps CJS parsing in parity with the ESM parser for every fixture')` exists and compares both implementations over a shared fixture list [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts:520-528]. Residual defect is the fixture list's breadth, filed as DR4-P2-002.

### **"The live event capture never happened, so T017's branch removals rest on nothing."** Ruled out: `scratch/event-capture.txt:22-23` records the live run, its plugin, exit code and request count, and the static section is a separate half of the same file. The residual defect is the stale header line, filed as DR3-P2-001. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"The live event capture never happened, so T017's branch removals rest on nothing."** Ruled out: `scratch/event-capture.txt:22-23` records the live run, its plugin, exit code and request count, and the static section is a separate half of the same file. The residual defect is the stale header line, filed as DR3-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The live event capture never happened, so T017's branch removals rest on nothing."** Ruled out: `scratch/event-capture.txt:22-23` records the live run, its plugin, exit code and request count, and the static section is a separate half of the same file. The residual defect is the stale header line, filed as DR3-P2-001.

### **"The parent claims completion before the phases do."** Ruled out: the parent continuity names the same merge and CI run the phases name, and all three phases read `Complete`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **"The parent claims completion before the phases do."** Ruled out: the parent continuity names the same merge and CI run the phases name, and all three phases read `Complete`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The parent claims completion before the phases do."** Ruled out: the parent continuity names the same merge and CI run the phases name, and all three phases read `Complete`.

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
- "An OpenCode 1 binary still passes the dispatch guard": ruled out, `unsupported` is in `UNRESOLVED_FAMILIES` and every rule is `appliesTo:["v2"]`, so the two `error` rules block (iteration 1, evidence: dispatch-rule-checks.mjs:1119-1136, hard-rules.json)
- "Bare-name `opencode2` probes fail after the trust-list change": ruled out, the trust comparison runs only on the path-qualified branch (iteration 1, evidence: opencode-version.mjs:240-243,275-277)
- "Session reader still reads v1 storage": ruled out, it defaults to `opencode.db` and has no v1 branch (iteration 1, evidence: session-readers/opencode.mjs:52-58)
- "A launcher name or path bypasses the dispatch guard": ruled out, an undetected or unresolved dispatch takes every rule at declared severity (iteration 2, evidence: dispatch-rule-checks.mjs:1119-1124, hard-rules.json:8,15,22,29)
- "`OPENCODE_BIN` widens the trust set to an attacker-named file": ruled out, the override must be readable for `fileIdentity` to match and the probe runs the trusted path, not the command's spelling (iteration 2, evidence: opencode-version.mjs:121-142)
- "The `remove-v1` check-to-remove window lets a swap delete a foreign file": ruled out, `rm` unlinks a symlink and the swap needs the user's own directory write authority (iteration 2, evidence: opencode-setup.sh:222-239,431)
- "The session reader builds SQL from command text": ruled out, the only statement is a fixed `sqlite_master` query on a read-only connection (iteration 2, evidence: session-readers/opencode.mjs:65-73)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none — iteration 5 of 5. Rotation complete, `dimensionCoverage` 4/4. - Focus area: synthesis. Carry the eight P2s and this replay table into the final verdict document. - Reason: the fix-completeness replay is clean (3/3 PASS) and no new direction is available inside the iteration budget. - Rotation status: complete. - Blocked/productive carry-forward: reuse "read the consumer together with the builder it calls" — it is what let this pass prove the `.server` removal from the caller side instead of from the builder's JSDoc. - Required evidence: none outstanding; synthesis owns the release-readiness decision. - Recovery note: not applicable — no stuck count, no failed check, no blocked tool. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior generation 2 review (archived at review-archive/20261120T100738Z/) reached FAIL: 0 P0, 2 P1, 7 P2, coverage gate failed. P1s: DR4-P1-001 (.vibe/plugins/repo-guards/session-cleanup.mjs called sessionCleanupPlugin.server(...) after dualPlugin dropped server) and DR3-P1-001 (003 acceptance-criteria AC-004 Met vs implementation-summary saying not met). A fix plan (A1-A5 code, B1-B6 traceability, C1-C6 verification) was applied and a 1-iteration confirmation review ran in 001-v1-runtime-code-and-tests/review/. A halted cli-codex attempt of this review (not part of this lineage) flagged that .skilled/bin/skilled-loop and its wrapper test were missing from 003 scratch/justified.txt; main f6aa8dc052b added both, so the T021 sweep equals the 32-line list. Decisions Q001-Q008 are in the parent decision-record.md; phase ADRs waive the ordering checks; 003 ADR-001 supersedes the zero-match ACs with justified.txt-based replacement checks.

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
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | Resolver family list and rule-engine behaviour match the feature catalog's version-dispatch claims; playbook's plugin-disable claim matches the `--pure` removal. |
| `checklist_evidence` | core | pass | 3 | Every AC row in 001/002/003 reproduces on the merged tree; 003 AC-002/AC-006/AC-008 replacement commands return 0; CI run 44632438229 is success on 06d02096e90. Two P2 documentation defects recorded (DR3-P2-001, DR3-P2-002). |
| `skill_agent` | overlay | pending | - | Not executed yet; owned by the maintainability iteration if the duplicated-resolver question reaches the cli-opencode skill contract. |
| `agent_cross_runtime` | overlay | pending | - | Not executed yet; the runtime-mirror checkers were read only as 003 AC-011 evidence (15 of 16 exit 0), which is not this protocol's check. |
| `feature_catalog_code` | overlay | pass | 3 | `feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md` version rule, refusal path and hook-side parity statement all match `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs` and the rule engine. |
| `playbook_capability` | overlay | pass | 3 | The cli-opencode manual testing playbook claims only capabilities the merged code supports: no `<v1\|v2>` runner argument, no version argument, and CO-005 asserts the plugin-disable flag's absence. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/decision-record.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/implementation-summary.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/plan.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/.gitkeep | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/after.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/baseline.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/consumers.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/files-outside-table.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/justified.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/spec.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/decision-record.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/implementation-summary.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/plan.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/.gitkeep | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/after.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/files-outside-table.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/gated-suites.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/lockfile-regen.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/sdk-usage.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/variant.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/versions.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/spec.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/tasks.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/decision-record.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/plan.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/.gitkeep | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/baseline.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/changelog-baseline.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/check-index-v1.py | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/doc-inventory.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/files-outside-table.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live-version.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/locations.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/mac-cleanup.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/spec.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/decision-record.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .github/workflows/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .github/workflows/opencode-v2-battery.yml | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/package-lock.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/package.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/ARCHITECTURE.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/lib/opencode-goal-core.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/lib/v2-bridge.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/opencode-goal.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/system-dist-freshness-guard.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/system-skill-advisor.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/system-spec-gate.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/system-speckit-completion.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/classifier-injection-screen.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/decision-capture.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/env-secret-guard.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/mcp-route-guard.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-capabilities.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-continuation.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-export-contract.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-handover.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-render-parity.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-state.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-supervisor.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/opencode-goal-tool-path.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/plugin-inventory.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/session-cleanup.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/session-handover.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/sk-git-message-gate.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/source-root-consumers.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/system-completion-sentinel.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/system-deep-loop-guard.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/system-dist-freshness-guard.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/system-skill-advisor.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/system-spec-gate.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/system-speckit-completion.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/v2-bridge.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/v2-hard-plugins.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/v2-registration.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/CROSS-CLI.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/bin/skilled-loop | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/bin/tests/opencode-compat-layout.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/bin/tests/opencode-config-shape.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/changelog/skilled/v4.1.0.0.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/deep/assets/deep-research-presentation.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/deep/assets/deep-research.yaml | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/deep/assets/deep-review-presentation.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/deep/assets/deep-review.yaml | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/deep/assets/legacy/deep-review.body.markdown | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/doctor/scripts/README.markdown | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/doctor/scripts/git-setup-check.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/doctor/scripts/opencode-version-battery.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/doctor/scripts/tests/README.markdown | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/cli-dispatch/codex/codex-shell-tool.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/cli-dispatch/lib/opencode-version.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/dist-freshness/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/injection-contract.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-cleanup/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-handover/runtime-behavior.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-handover/tests/adapter-conformance.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/shared/hook-stdin-deadline.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/shared/session-readers/opencode.d.mts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/shared/session-readers/opencode.d.mts.map | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/shared/session-readers/opencode.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/shared/tests/session-readers/fixtures.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/shared/tests/session-readers/opencode.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/package-lock.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/package.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/ROUTER.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v2.0.0.0.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/context-leaf-agent.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-research-agent-iterations.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-review-agent-audit.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/multi-ai-council-multi-strategy.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/review-agent-security-audit.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/dir-flag-working-directory.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/file-attachment-via-f-flag.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/format-default-vs-json.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/attach-remote-server.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/cross-repo-dispatch.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/self-invocation-guard-nested.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/from-claude-code.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/integration-patterns/memory-epilogue-handback.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/cross-repo.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/ablation-suite.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/parallel-detached-session.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/worker-farm-loop.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/classifier-injection-screen.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/cli-dispatch-audit.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/codex-hooks-watchdog.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/mcp-route-guard.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/opencode-goal.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-cleanup.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-code-post-edit-quality.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-git-message-gate.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-git-preflight-advisory.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-completion-sentinel.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-deep-loop-guard.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-dist-freshness-guard.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-skill-advisor.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-spec-gate.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-speckit-completion.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/minimax-design-context-manifest.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/template-applied-to-real-dispatch.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/stress/sandbox-permission.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/context-budget.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-code/manual-testing-playbook/plugins-and-hooks/post-edit-quality-router.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-opencode.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-git/references/worktree-workflows.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/resource-map-toggle.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-native-sequential-research.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/fanout-dispatch.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/resource-map-coverage-gate.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/synthesis-save-boundary.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/three-artifact-iteration-contract.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/write-boundary-reducer-owned-files.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-native-sequential-review.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/runtime/vitest.config.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-consumption.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-diagnostic-redaction.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/dist-freshness-guard.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-pi-opencode.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/opencode/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .vibe/plugins/repo-guards/session-cleanup.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .vibe/plugins/repo-guards/tests/session-cleanup.test.mjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| SECURITY.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-20T10:07:53.884Z, parentSessionId=2026-11-19T15:56:57.978Z, generation=3, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Stop policy: max-iterations
- Executor: cli-pi deepseek-v4.1-flash-1017, thinking max, timeout 1800 s
- Started: 2026-11-20T10:07:53.884Z
<!-- MACHINE-OWNED: END -->

---


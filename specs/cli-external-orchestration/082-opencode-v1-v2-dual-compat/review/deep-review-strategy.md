# Deep Review Strategy - specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat

Live strategy for the deep-review session 2026-10-19T06:42:21.035Z (restart; prior session 2026-10-19T06:03:39.878Z archived to review-archive/20261019T064206Z after its iteration 1 errored on a Pi extension conflict).

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
Review: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat (spec-folder). The OpenCode v1 (1.19.3) and v2 (2.0.32) dual-compatibility build: 16 plugins and their shared lib, agents, commands, opencode.json, dispatch guards, cli-opencode version detection and dispatch, the deep-loop opencode executor in fanout-run.cjs, install guidance, setup helper, /doctor:opencode, the two-version CI workflow and the doc sweep. Scope is the 157 files in goal-file-manifest.txt.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing anything: the review target is read-only.
- The nine gaps research marked irreducible (server-side toast, per-agent temperature on v2): documented, not closed, by design.
- OpenCode versions other than 1.19.3 and 2.0.32.
- Generated runtime mirrors (.claude, .codex, .hermes, .pi) and lock files, excluded from the manifest.

---

## 5. STOP CONDITIONS
- stop_policy=max-iterations: run all 5 iterations; convergence is telemetry only (convergenceMode=off).
- Halt on gateway refusal, credential or quota error, or a pause sentinel.

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
- P1 (Required): 1
- P2 (Suggestions): 12
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Running a per-line existence loop over the manifest instead of arguing about the count: it answered the 157/159 thread in one command and proved the two extra lines were comment headers. (iteration 3)
- Reading the closure document as a document rather than as a set of rows: the rows were all Met and every sibling said Complete, so the divergence was only visible at the section level. (iteration 3)
- Reproducing each claim's stated command instead of accepting the claim: the eight-reference count and the SKILL.md:134 citation both reproduced exactly, which is what made the one non-reproducible row stand out. (iteration 3)
- Reading the four cross-cutting producers first (v2-bridge, both version resolvers, dispatch-rule-checks, fanout-run) instead of sampling the 157 files: every other scoped file consumes one of them, so the contract was reconstructed once and the finding surface concentrated there. (iteration 1)
- Computing the artifact map from goal-file-manifest.txt rather than trusting the earlier summary: the subsystem counts are reproducible. (iteration 1)
- Reading each hook key a plugin actually returns against the bridge's MAPPED_HOOKS set, which is what surfaced R1-P2-001. (iteration 1)
- Following the enforcement chain end to end (OpenCode adapter, readHardRules, evaluate, resolved version) rather than reviewing each layer in isolation: the kill-switch scope (R2-P2-002) and the marker bypass (R2-P2-001) only appear where the layers meet. (iteration 2)
- Verifying out-of-manifest delegates before filing: goal-slice.cjs resolvePacketDir already enforces real-path containment, so the packetPath traversal candidate was ruled out instead of filed as a false positive. (iteration 2)
- Tracing the recognizer wrapper lists against its own empirical policy comment, which localized the residual evasion to print-flagless shapes in unmodeled command position. (iteration 2)
- Counting producers instead of reading consumers to answer "how cheaply could a third version be added": the four version detectors are the whole cost, because the sixteen plugin bodies contain no version branching. (iteration 4)
- Diffing the three Node parsers line by line rather than assuming sameness from "looks like a copy": the bodies are identical, but the two resolvers around them have already drifted (the `.cjs` has an `opencode2` fallback the `.mjs` lacks), which is the finding a shape-level read would have missed. (iteration 4)
- Using the install reference's recorded `--version` shapes as ground truth before calling a grammar divergence a bug: it downgraded a would-be P1 to an honest P2, because both classifiers are right about today's two binaries. (iteration 4)
- Recomputing all 61 recorded source digests in the three compiled contracts instead of reading the freshness prose: three prior iterations had asserted the generated chain was intact without measuring it, and one shell-and-node pass settled it at 0 mismatches. (iteration 5)
- Selecting targets by asking which producers have no in-scope consumer rather than by which files looked interesting: the config shape, the agent frontmatter and the CI triggers surfaced precisely because nothing downstream reads them. (iteration 5)
- Reading the config-shape guard as a whole 45-line file rather than grepping its assertion: the second test being a negative case, and both tests naming one family, is what makes the parity gap a finding rather than a guess. (iteration 5)

---

## 9. WHAT FAILED
- Scanning agent-mirror-crosswalk.md for agent names with a grep word-boundary pattern: 6 of 11 matched, and without reading the file there is no way to tell a real omission from a per-runtime organization. Deferred rather than filed. (iteration 3)
- Attempting to settle the SKILL.md word count with `wc -w`: 4,972 against the recorded 4,904, and the ceiling's own counter was never located, so the finding carries low-medium confidence and a downgrade trigger. (iteration 3)
- A first attempt to inventory plugin hook keys with a whitespace-anchored rg pattern returned noise (`rg -o` on indented object literals). Per-file `rg "return \{" -A 12` plus a narrow key list was what worked. (iteration 1)
- Attempting to settle the v2 `-m <model>#<effort>` shape from fanout-run alone: the builder shows the emitted shape but not whether v2 accepts it. Deferred rather than guessed; needs the cli-opencode SKILL.md contract. (iteration 1)
- Reading opencode-goal.js through a single default read returned only the head of the 3383-line file, so the first slice attempt past line 1200 came back empty; offset and limit reads per region are what work on a file that size. (iteration 2)
- Trying to judge the injection screen data flow from the in-scope adapter alone: the transport and the feature gate live outside the manifest, so the egress question could only be closed by opening those delegates as context. (iteration 2)
- Treating a latent divergence as a live bug on first pass: the shell classifier's asymmetric grammar looks wrong until the recorded binary output is checked, and the recorded output makes it correct-today. Without that step the finding would have been mis-severitied, and with a weaker reading it would have been a false positive. (iteration 4)
- Attempting to answer "is there a parity test" by filename: the tests exist per family but none asserts cross-classifier agreement, and no filename or inventory line says so. The claim is carried at medium confidence inside R4-P2-001 rather than promoted to its own finding. (iteration 4)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"A third-version cost also hides in the generated-contract pipeline."** It does not. The compiler's version constant ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:23]) is a contract schema version, not an OpenCode family, and no family literal appears in its source lists — so `R4-P2-001`'s cost estimate of four detectors plus the rule engine stands unrevised. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"A third-version cost also hides in the generated-contract pipeline."** It does not. The compiler's version constant ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:23]) is a contract schema version, not an OpenCode family, and no family literal appears in its source lists — so `R4-P2-001`'s cost estimate of four detectors plus the rule engine stands unrevised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A third-version cost also hides in the generated-contract pipeline."** It does not. The compiler's version constant ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:23]) is a contract schema version, not an OpenCode family, and no family literal appears in its source lists — so `R4-P2-001`'s cost estimate of four detectors plus the rule engine stands unrevised.

### **"Install guidance is thin, or was written after the fact."** It is the best-evidenced doc in the slice: claim labels, the npm `bin` collision that forces the whole layout, three runnable layouts, and the non-obvious fact that a v2 probe writes a log line — a trap the helper is then shown to avoid. No finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"Install guidance is thin, or was written after the fact."** It is the best-evidenced doc in the slice: claim labels, the npm `bin` collision that forces the whole layout, three runnable layouts, and the non-obvious fact that a v2 probe writes a log line — a trap the helper is then shown to avoid. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"Install guidance is thin, or was written after the fact."** It is the best-evidenced doc in the slice: claim labels, the npm `bin` collision that forces the whole layout, three runnable layouts, and the non-obvious fact that a v2 probe writes a log line — a trap the helper is then shown to avoid. No finding.

### **"The agent mirror directories have drifted."** They have not — eleven files, identical names and sizes, identical `mode:` values. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The agent mirror directories have drifted."** They have not — eleven files, identical names and sizes, identical `mode:` values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The agent mirror directories have drifted."** They have not — eleven files, identical names and sizes, identical `mode:` values.

### **"The CI workflow interpolates an attacker-controlled value into a shell."** Iteration 2 ruled this out; the full read confirms it and adds the DB-isolation launcher and exact version assertions as additional strengths. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The CI workflow interpolates an attacker-controlled value into a shell."** Iteration 2 ruled this out; the full read confirms it and adds the DB-isolation launcher and exact version assertions as additional strengths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The CI workflow interpolates an attacker-controlled value into a shell."** Iteration 2 ruled this out; the full read confirms it and adds the DB-isolation launcher and exact version assertions as additional strengths.

### **"The compiled contracts are stale against their sources."** They are not. 61 digests recompute to their exact recorded values across three artifacts, and the compiler hashes whole files under a convention that matches the header's own `section: 'full'` label. Recomputing beat reading the freshness prose. Recorded so the next session does not re-enter it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **"The compiled contracts are stale against their sources."** They are not. 61 digests recompute to their exact recorded values across three artifacts, and the compiler hashes whole files under a convention that matches the header's own `section: 'full'` label. Recomputing beat reading the freshness prose. Recorded so the next session does not re-enter it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The compiled contracts are stale against their sources."** They are not. 61 digests recompute to their exact recorded values across three artifacts, and the compiler hashes whole files under a convention that matches the header's own `section: 'full'` label. Recomputing beat reading the freshness prose. Recorded so the next session does not re-enter it.

### **"The v2 path duplicates the v1 plugin bodies."** It does not. `v2-bridge.js` is a translation layer — a hook allow-list plus event aliases and mappings ([SOURCE: .opencode/plugins/lib/v2-bridge.js:8], [SOURCE: .opencode/plugins/lib/v2-bridge.js:22]) — and the plugins stay single-source. The duplication in this build lives in the version detectors, not in the plugin layer. Recorded so the next session does not re-enter it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **"The v2 path duplicates the v1 plugin bodies."** It does not. `v2-bridge.js` is a translation layer — a hook allow-list plus event aliases and mappings ([SOURCE: .opencode/plugins/lib/v2-bridge.js:8], [SOURCE: .opencode/plugins/lib/v2-bridge.js:22]) — and the plugins stay single-source. The duplication in this build lives in the version detectors, not in the plugin layer. Recorded so the next session does not re-enter it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"The v2 path duplicates the v1 plugin bodies."** It does not. `v2-bridge.js` is a translation layer — a hook allow-list plus event aliases and mappings ([SOURCE: .opencode/plugins/lib/v2-bridge.js:8], [SOURCE: .opencode/plugins/lib/v2-bridge.js:22]) — and the plugins stay single-source. The duplication in this build lives in the version detectors, not in the plugin layer. Recorded so the next session does not re-enter it.

### **agent_cross_runtime (overlay) — partial, improved.** Two claims were separable and only one was settled. *Settled:* the two agent directories carry the same eleven definitions with the same `mode:` values, verified by listing and frontmatter read. *Not settled:* `agent-mirror-crosswalk.md` naming six of eleven agent names remains unread, so whether the crosswalk document omits five or organises them per runtime is still unknown — the same open question iteration 3 deferred, unchanged. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **agent_cross_runtime (overlay) — partial, improved.** Two claims were separable and only one was settled. *Settled:* the two agent directories carry the same eleven definitions with the same `mode:` values, verified by listing and frontmatter read. *Not settled:* `agent-mirror-crosswalk.md` naming six of eleven agent names remains unread, so whether the crosswalk document omits five or organises them per runtime is still unknown — the same open question iteration 3 deferred, unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime (overlay) — partial, improved.** Two claims were separable and only one was settled. *Settled:* the two agent directories carry the same eleven definitions with the same `mode:` values, verified by listing and frontmatter read. *Not settled:* `agent-mirror-crosswalk.md` naming six of eleven agent names remains unread, so whether the crosswalk document omits five or organises them per runtime is still unknown — the same open question iteration 3 deferred, unchanged.

### **checklist_evidence (core) — fail, carried.** `R3-P1-001` is the failing row and this iteration re-confirmed it. `R3-P2-001` (four closed phase children carrying a Draft acceptance-criteria status) was **not** replayed this iteration; it is carried at its filed evidence, not re-verified. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **checklist_evidence (core) — fail, carried.** `R3-P1-001` is the failing row and this iteration re-confirmed it. `R3-P2-001` (four closed phase children carrying a Draft acceptance-criteria status) was **not** replayed this iteration; it is carried at its filed evidence, not re-verified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence (core) — fail, carried.** `R3-P1-001` is the failing row and this iteration re-confirmed it. `R3-P2-001` (four closed phase children carrying a Draft acceptance-criteria status) was **not** replayed this iteration; it is carried at its filed evidence, not re-verified.

### **feature_catalog_code (overlay) — partial.** The install reference's recorded `--version` shapes ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:263]) match the setup helper's classifier grammar, which is what makes finding 1 latent-today rather than live. I did not re-open `feature-catalog/opencode-dual-version-dispatch/` this iteration, so the catalog's version-detection paragraph is not re-verified here. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **feature_catalog_code (overlay) — partial.** The install reference's recorded `--version` shapes ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:263]) match the setup helper's classifier grammar, which is what makes finding 1 latent-today rather than live. I did not re-open `feature-catalog/opencode-dual-version-dispatch/` this iteration, so the catalog's version-detection paragraph is not re-verified here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code (overlay) — partial.** The install reference's recorded `--version` shapes ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:263]) match the setup helper's classifier grammar, which is what makes finding 1 latent-today rather than live. I did not re-open `feature-catalog/opencode-dual-version-dispatch/` this iteration, so the catalog's version-detection paragraph is not re-verified here.

### **feature_catalog_code (overlay) — pass, extended.** The catalog describes dispatch semantics; the compiler's `COMMANDS` table is the maintained definition those semantics are compiled from, and its per-command source lists are exactly the digest sets verified fresh above. Catalog to code to generated artifact is now a checked chain rather than a documented one. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **feature_catalog_code (overlay) — pass, extended.** The catalog describes dispatch semantics; the compiler's `COMMANDS` table is the maintained definition those semantics are compiled from, and its per-command source lists are exactly the digest sets verified fresh above. Catalog to code to generated artifact is now a checked chain rather than a documented one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code (overlay) — pass, extended.** The catalog describes dispatch semantics; the compiler's `COMMANDS` table is the maintained definition those semantics are compiled from, and its per-command source lists are exactly the digest sets verified fresh above. Catalog to code to generated artifact is now a checked chain rather than a documented one.

### **Note on coverage, not a separate finding.** Both families do have tests: `v2-bridge.test.cjs`, `dispatch-audit.test.mjs` (which exercises the `.mjs` resolver including cache and timeout paths), `dispatch-rule-checks.test.mjs`, `opencode-version-battery.test.cjs`, and `opencode-dual-dispatch.vitest.ts` for the `.cjs` resolver via `fanout-run`. What no test asserts is that the four classifiers *agree* — that is the gap folded into finding 1 rather than filed twice. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Note on coverage, not a separate finding.** Both families do have tests: `v2-bridge.test.cjs`, `dispatch-audit.test.mjs` (which exercises the `.mjs` resolver including cache and timeout paths), `dispatch-rule-checks.test.mjs`, `opencode-version-battery.test.cjs`, and `opencode-dual-dispatch.vitest.ts` for the `.cjs` resolver via `fanout-run`. What no test asserts is that the four classifiers *agree* — that is the gap folded into finding 1 rather than filed twice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Note on coverage, not a separate finding.** Both families do have tests: `v2-bridge.test.cjs`, `dispatch-audit.test.mjs` (which exercises the `.mjs` resolver including cache and timeout paths), `dispatch-rule-checks.test.mjs`, `opencode-version-battery.test.cjs`, and `opencode-dual-dispatch.vitest.ts` for the `.cjs` resolver via `fanout-run`. What no test asserts is that the four classifiers *agree* — that is the gap folded into finding 1 rather than filed twice.

### **P2 replay status, stated exactly.** Two of the ten were touched with fresh evidence: `R4-P2-002` (the literal v1-and-v2 conjunction in the rule engine) is unaffected by anything read here and stands; `R1-P2-002` and `R1-P2-001` were not re-read. The remaining eight — `R1-P2-001`, `R1-P2-003`, `R2-P2-001`, `R2-P2-002`, `R2-P2-003`, `R3-P2-001`, `R3-P2-002`, `R4-P2-001` — were **not** replayed against source this iteration. No P2 is downgraded or withdrawn; all ten carry forward with their filing evidence intact. I am stating this rather than implying a full replay, because only the P1 and the two new surfaces were re-read. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **P2 replay status, stated exactly.** Two of the ten were touched with fresh evidence: `R4-P2-002` (the literal v1-and-v2 conjunction in the rule engine) is unaffected by anything read here and stands; `R1-P2-002` and `R1-P2-001` were not re-read. The remaining eight — `R1-P2-001`, `R1-P2-003`, `R2-P2-001`, `R2-P2-002`, `R2-P2-003`, `R3-P2-001`, `R3-P2-002`, `R4-P2-001` — were **not** replayed against source this iteration. No P2 is downgraded or withdrawn; all ten carry forward with their filing evidence intact. I am stating this rather than implying a full replay, because only the P1 and the two new surfaces were re-read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **P2 replay status, stated exactly.** Two of the ten were touched with fresh evidence: `R4-P2-002` (the literal v1-and-v2 conjunction in the rule engine) is unaffected by anything read here and stands; `R1-P2-002` and `R1-P2-001` were not re-read. The remaining eight — `R1-P2-001`, `R1-P2-003`, `R2-P2-001`, `R2-P2-002`, `R2-P2-003`, `R3-P2-001`, `R3-P2-002`, `R4-P2-001` — were **not** replayed against source this iteration. No P2 is downgraded or withdrawn; all ten carry forward with their filing evidence intact. I am stating this rather than implying a full replay, because only the P1 and the two new surfaces were re-read.

### **spec_code — replay, confirmed.** The packet's completion metadata was read in four places rather than one. Three agree at `completion_pct: 100`; the fourth, the closure block in the same document family, says otherwise. `R3-P1-001` stands. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **spec_code — replay, confirmed.** The packet's completion metadata was read in four places rather than one. Three agree at `completion_pct: 100`; the fourth, the closure block in the same document family, says otherwise. `R3-P1-001` stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code — replay, confirmed.** The packet's completion metadata was read in four places rather than one. Three agree at `completion_pct: 100`; the fourth, the closure block in the same document family, says otherwise. `R3-P1-001` stands.

### agent_cross_runtime (overlay): partial. The Claude/Codex/Devin/Pi preflight consumers of the shared recognizer are outside the 157-file manifest; the cross-runtime claim was verified only against the catalog, not against those files. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: agent_cross_runtime (overlay): partial. The Claude/Codex/Devin/Pi preflight consumers of the shared recognizer are outside the 157-file manifest; the cross-runtime claim was verified only against the catalog, not against those files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime (overlay): partial. The Claude/Codex/Devin/Pi preflight consumers of the shared recognizer are outside the 157-file manifest; the cross-runtime claim was verified only against the catalog, not against those files.

### checklist_evidence (core): partial. No security checklist row was read this iteration; the phase-child checklists remain for the traceability iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence (core): partial. No security checklist row was read this iteration; the phase-child checklists remain for the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence (core): partial. No security checklist row was read this iteration; the phase-child checklists remain for the traceability iteration.

### feature_catalog_code (overlay): pass. The catalog's direct/ambiguous/none model, quoted-executor normalization, wrapper unwrap and version-scoped rule behavior match the code read this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: feature_catalog_code (overlay): pass. The catalog's direct/ambiguous/none model, quoted-executor normalization, wrapper unwrap and version-scoped rule behavior match the code read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code (overlay): pass. The catalog's direct/ambiguous/none model, quoted-executor normalization, wrapper unwrap and version-scoped rule behavior match the code read this iteration.

### playbook_capability (overlay): partial. The in-scope review-agent-security-audit playbook page was not opened this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: playbook_capability (overlay): partial. The in-scope review-agent-security-audit playbook page was not opened this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability (overlay): partial. The in-scope review-agent-security-audit playbook page was not opened this iteration.

### skill_agent (overlay): pass. The six hard-rules.json entries match the catalog's rule-by-rule paragraph (two blocking errors on both families, no-bare-agent-general warn v1, command-flag-for-slash-prompt error v1, v2-slash-prompt-route warn v2, share advisory on both). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: skill_agent (overlay): pass. The six hard-rules.json entries match the catalog's rule-by-rule paragraph (two blocking errors on both families, no-bare-agent-general warn v1, command-flag-for-slash-prompt error v1, v2-slash-prompt-route warn v2, share advisory on both).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent (overlay): pass. The six hard-rules.json entries match the catalog's rule-by-rule paragraph (two blocking errors on both families, no-bare-agent-general warn v1, command-flag-for-slash-prompt error v1, v2-slash-prompt-route warn v2, share advisory on both).

### spec_code (core): pass. spec.md:71 names the dispatch guards as a reviewed surface and the feature catalog describes dispatch semantics; evaluate (:284-333), resolveOpencodeVersionSync (:184-217) and resolveDispatchPacket (:497-506) match that description, including the documented unknown-version downgrade. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code (core): pass. spec.md:71 names the dispatch guards as a reviewed surface and the feature catalog describes dispatch semantics; evaluate (:284-333), resolveOpencodeVersionSync (:184-217) and resolveDispatchPacket (:497-506) match that description, including the documented unknown-version downgrade.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code (core): pass. spec.md:71 names the dispatch guards as a reviewed surface and the feature catalog describes dispatch semantics; evaluate (:284-333), resolveOpencodeVersionSync (:184-217) and resolveDispatchPacket (:497-506) match that description, including the documented unknown-version downgrade.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- "The 157-versus-159 manifest count is a stale scope list": 157 real paths all present, the two '#' comment headers are the only non-file lines, so 157 + 2 = 159; iteration 1's subsystem total double-counted the comments (evidence: goal-file-manifest.txt:1-2). (iteration 3)
- "The dated version claim is missing from a document that names a version": found in SKILL.md, README.md and 8 references, the same ten documents proof.md reports (evidence: cli-opencode/SKILL.md:134). (iteration 3)
- "Playbook pages exist that the index does not link": 56 pages on disk, 0 unlinked (evidence: manual-testing-playbook.md:1). (iteration 3)
- "The v2 cli-opencode child runs in the wrong directory because --dir is gone": `cwd` is set on the built command and reaches the spawn (evidence: fanout-run.cjs:2431, :3509, :3767). (iteration 1)
- "A plugin still exports a v1-only entry": 16/16 entry files default-export `dualPlugin(...)`; zod 4.1.8 provides `z.toJSONSchema` (evidence: v2-bridge.js:402, .opencode/package.json:8). (iteration 1)
- "The v2 tool transform throws on a ZodObject arg": reviewed tool definitions pass a raw shape, which `z.object` accepts (evidence: system-speckit-completion.js:61). (iteration 1)
- "sessionEventState leaks per session": two-element sets cleared by three event types, no growth path shown (evidence: v2-bridge.js:296). Raised as an observation, not a finding. (iteration 1)
- "Fetched page text egresses to a classifier": operator-gated feature, operator own Jev transport, advisory carries counts and positions only (evidence: classifier-injection-screen.js:62, classifier-injection-advisory.mjs:69). (iteration 2)
- "packetPath traverses out of the workspace": resolvePacketDir judges containment on real paths including symlinked parents, and bindGoal fails closed on null (evidence: opencode-goal.js:1849, goal-slice.cjs:254). (iteration 2)
- "session-cleanup subprocess calls can be steered": fixed repo script paths, exec-form spawn, eight-second bound, PID env vars cleared, orphan sweep opt-in (evidence: session-cleanup.js:139, :229, :264). (iteration 2)
- "Model-supplied workdir retargets the sk-git gate": readGit follows -C so the checked contract follows the commit target; fail-open is documented with the git hooks behind it (evidence: git-message-gate.mjs:163, sk-git-message-gate.js:63). (iteration 2)
- "OPENCODE_BIN probes an attacker-chosen binary": operator env only, path-separated values refused, bounded three-second probe (evidence: opencode-version.mjs:31, :143). (iteration 2)
- "The CI workflow interpolates untrusted inputs": contents read only, SHA-pinned actions, matrix constants only in run blocks (evidence: opencode-dual-version.yml:35, :83). (iteration 2)
- "The unknown-version downgrade is a new security finding": it is the security face of active correctness finding R1-P2-002; not re-filed. (iteration 2)
- "The compiled contracts are stale against their sources": 61 of 61 recorded source digests recompute to their current files under the compiler's whole-file convention (`compile-command-contracts.cjs:406`), so the generated-contract chain is fresh (evidence: `deep-review.contract.md:7`, `deep-ai-council.contract.md` 28 digests, `deep-research.contract.md` 17 digests). (iteration 5)
- "A third-version cost hides in the generated-contract pipeline": the compiler's only version constant is a contract schema version, not an OpenCode family (`compile-command-contracts.cjs:23`), so R4-P2-001's cost estimate stands unrevised. (iteration 5)
- "The agent mirror directories drifted from the source definitions": eleven files in each, identical names, byte sizes and `mode:` values across `.skilled/agents/` and `.opencode/agents/` (evidence: `.skilled/agents/markdown.md:4`, `.opencode/agents/markdown.md:4`). (iteration 5)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Continuity ladder: no handover.md, no implementation-summary.md, no decision-record.md at the packet root. spec.md (research-record level) reports Status Complete, completion_pct 100, all eleven phases closed with the two-version proof; findings in research/research.md. Phase children 001-011 carry their own docs. resource-map.md not present at the packet root; skipping coverage gate.

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
| `spec_code` | core | pass | 3 | 157 manifest paths all present; dated claim, eight-reference count and hard-rule table reproduce |
| `checklist_evidence` | core | **fail** | 3 | R3-P1-001: 011 closure says Closeable: No / Not started against six Met rows and a Complete phase map; R3-P2-001: 001-004 keep Draft |
| `skill_agent` | overlay | pass | 3 | SKILL.md:134 carries the dated claim AC-005 cites; ten documents carry it as claimed |
| `agent_cross_runtime` | overlay | partial | 5 | mechanical half settled: 11 files in each dir, identical names, sizes and `mode:` values; `agent-mirror-crosswalk.md` still unread, so the 6-of-11 name-scan remains unconfirmed |
| `feature_catalog_code` | overlay | pass | 2 | catalog semantics match evaluate, resolver and packet resolution |
| `playbook_capability` | overlay | pass | 3 | 56 pages on disk, 0 unlinked from the index; only 24 are in the manifest |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .gitignore | - | - | - | pending |
| .opencode/package.json | - | - | - | pending |
| .opencode/plugins/README.md | - | - | - | pending |
| .opencode/plugins/classifier-injection-screen.js | - | - | - | pending |
| .opencode/plugins/cli-dispatch-audit.js | - | - | - | pending |
| .opencode/plugins/codex-hooks-watchdog.js | - | - | - | pending |
| .opencode/plugins/lib/classifier-injection-screen-core.js | - | - | - | pending |
| .opencode/plugins/lib/completion-sentinel-core.js | - | - | - | pending |
| .opencode/plugins/lib/opencode-goal-core.js | - | - | - | pending |
| .opencode/plugins/lib/sk-code-post-edit-quality-core.js | - | - | - | pending |
| .opencode/plugins/lib/tool-identity.js | - | - | - | pending |
| .opencode/plugins/lib/v2-bridge.js | - | - | - | pending |
| .opencode/plugins/mcp-route-guard.js | - | - | - | pending |
| .opencode/plugins/opencode-goal.js | - | - | - | pending |
| .opencode/plugins/session-cleanup.js | - | - | - | pending |
| .opencode/plugins/sk-code-post-edit-quality.js | - | - | - | pending |
| .opencode/plugins/sk-git-message-gate.js | - | - | - | pending |
| .opencode/plugins/sk-git-preflight-advisory.js | - | - | - | pending |
| .opencode/plugins/system-completion-sentinel.js | - | - | - | pending |
| .opencode/plugins/system-deep-loop-guard.js | - | - | - | pending |
| .opencode/plugins/system-dist-freshness-guard.js | - | - | - | pending |
| .opencode/plugins/system-skill-advisor.js | - | - | - | pending |
| .opencode/plugins/system-spec-gate.js | - | - | - | pending |
| .opencode/plugins/system-speckit-completion.js | - | - | - | pending |
| .opencode/plugins/tests/README.md | - | - | - | pending |
| .opencode/plugins/tests/classifier-injection-screen.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/mcp-route-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-capabilities.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-continuation.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-export-contract.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-render-parity.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-state.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-supervisor.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-tool-path.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/session-cleanup.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/sk-git-message-gate.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/source-root-consumers.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-completion-sentinel.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-deep-loop-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-dist-freshness-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-skill-advisor.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-spec-gate.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-speckit-completion.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-bridge.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-hard-plugins.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-registration.test.cjs | - | - | - | pending |
| .skilled/agents/ai-council.md | - | - | - | pending |
| .skilled/agents/code.md | - | - | - | pending |
| .skilled/agents/context.md | - | - | - | pending |
| .skilled/agents/debug.md | - | - | - | pending |
| .skilled/agents/deep-research.md | - | - | - | pending |
| .skilled/agents/deep-review.md | - | - | - | pending |
| .skilled/agents/design.md | - | - | - | pending |
| .skilled/agents/markdown.md | - | - | - | pending |
| .skilled/agents/orchestrate.md | - | - | - | pending |
| .skilled/agents/prompt-improver.md | - | - | - | pending |
| .skilled/agents/review.md | - | - | - | pending |
| .skilled/bin/agent-mirror-crosswalk.md | - | - | - | pending |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json | - | - | - | pending |
| .skilled/bin/tests/opencode-config-shape.test.cjs | - | - | - | pending |
| .skilled/command-support/deep/assets/compiled/README.md | - | - | - | pending |
| .skilled/command-support/deep/assets/compiled/deep-ai-council.contract.md | - | - | - | pending |
| .skilled/command-support/deep/assets/compiled/deep-research.contract.md | - | - | - | pending |
| .skilled/command-support/deep/assets/compiled/deep-review.contract.md | - | - | - | pending |
| .skilled/command-support/deep/assets/legacy/README.md | - | - | - | pending |
| .skilled/command-support/deep/assets/legacy/deep-ai-council.body.md | - | - | - | pending |
| .skilled/command-support/deep/assets/legacy/deep-research.body.md | - | - | - | pending |
| .skilled/command-support/deep/assets/legacy/deep-review.body.md | - | - | - | pending |
| .skilled/command-support/doctor/scripts/README.md | - | - | - | pending |
| .skilled/command-support/doctor/scripts/tests/README.md | - | - | - | pending |
| .skilled/command-support/scripts/README.md | - | - | - | pending |
| .skilled/command-support/scripts/fixtures/README.md | - | - | - | pending |
| .skilled/commands/doctor/scripts/git-setup-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/opencode-version-battery.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs | - | - | - | pending |
| .skilled/hooks/dispatch/lib/dispatch-audit.mjs | - | - | - | pending |
| .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs | - | - | - | pending |
| .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs | - | - | - | pending |
| .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs | - | - | - | pending |
| .skilled/hooks/dispatch/lib/opencode-version.mjs | - | - | - | pending |
| .skilled/package.json | - | - | - | pending |
| .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/README.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.0.0.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/context-leaf-agent.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-research-agent-iterations.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-review-agent-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/multi-ai-council-multi-strategy.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/review-agent-security-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/dir-flag-working-directory.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/file-attachment-via-f-flag.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/format-default-vs-json.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/attach-remote-server.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/cross-repo-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/self-invocation-guard-nested.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/from-claude-code.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/integration-patterns/memory-epilogue-handback.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/cross-repo.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/ablation-suite.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/parallel-detached-session.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/worker-farm-loop.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/minimax-design-context-manifest.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/template-applied-to-real-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/context-budget.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/opencode-dual-version-dispatch/opencode-dual-version-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/leaf-manifest.json | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-opencode/assets/checklists/command-authoring.md | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json | - | - | - | pending |
| .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json | - | - | - | pending |
| .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json | - | - | - | pending |
| .skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts | - | - | - | pending |
| .skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts | - | - | - | pending |
| .skilled/skills/sk-vision/vision-runtime/src/plugin.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/README.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/README.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10 (convergenceMode=off, stopPolicy=max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-19T06:42:21.035Z, parentSessionId=null, generation=1, lineageMode=new (restart requested)
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes (executor timeout 1800s)
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-19T06:42:21.035Z
<!-- MACHINE-OWNED: END -->

---


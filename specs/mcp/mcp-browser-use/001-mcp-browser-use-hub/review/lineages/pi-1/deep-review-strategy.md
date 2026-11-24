# Deep Review Strategy - mcp-browser-use hub epic (fan-out lineage pi-1, generation 1)

## 1. OVERVIEW

Persistent brain for this lineage's review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`. One dimension per iteration, findings externalized to `iterations/iteration-NNN.md` and `deltas/iter-NNN.jsonl`.

---

## 2. TOPIC

Review of the `mcp-browser-use` hub epic: every phase's shipped work against its own goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. Scope is the 522 files the fan-out root seeded in `review-scope-files.txt`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not implementing fixes. Review is observation-only; the target is read-only.
- Not re-reviewing the archived generation-3 fan-out verdict. Its confirmed P1s are inputs to check against current code, not conclusions to copy.
- Not auditing the spec folder's derived `graph-metadata.json` freshness.
- Not judging the vendor installers' upstream correctness beyond the trust boundary they cross.

---

## 5. STOP CONDITIONS

- Convergence per `convergence.cjs` at `convergenceThreshold` 0.10, `stuckThreshold` 2.
- Hard ceiling `maxIterations` 7.
- All four dimensions covered plus the core traceability protocols (`spec_code`, `checklist_evidence`).
- Any active P0 keeps the verdict FAIL regardless of ratio.

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
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Parsing the JSON vocabularies (`hub-router.json`, `description.json`) instead of grepping them: greps over machine-shaped JSON rows mis-report membership (iteration 1)
- Reading the phase goal's completion criteria first, then testing each criterion against the shipped line: it separated the claims that hold at source from the two that are scorer-output claims (iteration 1)

---

## 9. WHAT FAILED

- Attempting to prove the advisor ratchet claims from source alone: the scorer's output is the evidence and running it writes runtime state outside this lineage's surface, so those criteria stayed `partial` (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`$(...)` in a URL executes on the local shell in `repl-evidence-capture.sh`** -- ruled out: bash does not rescan the result of a parameter expansion for command substitution, so `output="$(aside repl "…'$URL'…")"` passes the literal text to `aside`; the single-quote and backslash guard covers the JS string escape, which is the boundary the script claims. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`$(...)` in a URL executes on the local shell in `repl-evidence-capture.sh`** -- ruled out: bash does not rescan the result of a parameter expansion for command substitution, so `output="$(aside repl "…'$URL'…")"` passes the literal text to `aside`; the single-quote and backslash guard covers the JS string escape, which is the boundary the script claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`$(...)` in a URL executes on the local shell in `repl-evidence-capture.sh`** -- ruled out: bash does not rescan the result of a parameter expansion for command substitution, so `output="$(aside repl "…'$URL'…")"` passes the literal text to `aside`; the single-quote and backslash guard covers the JS string escape, which is the boundary the script claims.

### **`ASIDE_CLI_BASE_URL` forwarding lets an attacker redirect the download** -- ruled out as a repository finding: the override is documented in the wrapper's usage text (`install.sh:38-41`) as an operator env, and the same comment states the pin covers the script only, so the residual is disclosed rather than silent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`ASIDE_CLI_BASE_URL` forwarding lets an attacker redirect the download** -- ruled out as a repository finding: the override is documented in the wrapper's usage text (`install.sh:38-41`) as an operator env, and the same comment states the pin covers the script only, so the residual is disclosed rather than silent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ASIDE_CLI_BASE_URL` forwarding lets an attacker redirect the download** -- ruled out as a repository finding: the override is documented in the wrapper's usage text (`install.sh:38-41`) as an operator env, and the same comment states the pin covers the script only, so the residual is disclosed rather than silent.

### **`compiledRoute` drops the surface hint from the returned targets** -- ruled out: `route` is a `let` reassigned from `applySurfaceHint` before `normalizeTargets(route)` reads it (`compiled-route.cjs:120-127`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`compiledRoute` drops the surface hint from the returned targets** -- ruled out: `route` is a `let` reassigned from `applySurfaceHint` before `normalizeTargets(route)` reads it (`compiled-route.cjs:120-127`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`compiledRoute` drops the surface hint from the returned targets** -- ruled out: `route` is a `let` reassigned from `applySurfaceHint` before `normalizeTargets(route)` reads it (`compiled-route.cjs:120-127`).

### **`exactBundle` can drop a mode from the ordered bundle** -- ruled out at the read: `router.cjs:128` passes the full `ordered` array to `route`, and the bundle kind only selects the decision label. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`exactBundle` can drop a mode from the ordered bundle** -- ruled out at the read: `router.cjs:128` passes the full `ordered` array to `route`, and the bundle kind only selects the decision label.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`exactBundle` can drop a mode from the ordered bundle** -- ruled out at the read: `router.cjs:128` passes the full `ordered` array to `route`, and the bundle kind only selects the decision label.

### **`install.sh` leaves the fetched archive unverified** -- ruled out as a finding: `install.sh:11-13` states the limitation in the pinned-digest comment ("The pin covers this script only; the archive it fetches is not verified"), and 015's D2 decision scopes the fix to the script. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`install.sh` leaves the fetched archive unverified** -- ruled out as a finding: `install.sh:11-13` states the limitation in the pinned-digest comment ("The pin covers this script only; the archive it fetches is not verified"), and 015's D2 decision scopes the fix to the script.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`install.sh` leaves the fetched archive unverified** -- ruled out as a finding: `install.sh:11-13` states the limitation in the pinned-digest comment ("The pin covers this script only; the archive it fetches is not verified"), and 015's D2 decision scopes the fix to the script.

### **`leaf-scopes.json` omits two of three modes** -- ruled out by the contract's default-walk rule. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`leaf-scopes.json` omits two of three modes** -- ruled out by the contract's default-walk rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`leaf-scopes.json` omits two of three modes** -- ruled out by the contract's default-walk rule.

### **`surfaces` ordering is unexercised** -- ruled out as a scope claim: `compiled-route-surface-hint.test.cjs:45` exists and sets the override, so the ordering contract has a test, which is why Finding 1 is about cache coherency and not about ordering. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`surfaces` ordering is unexercised** -- ruled out as a scope claim: `compiled-route-surface-hint.test.cjs:45` exists and sets the override, so the ordering contract has a test, which is why Finding 1 is about cache coherency and not about ordering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`surfaces` ordering is unexercised** -- ruled out as a scope claim: `compiled-route-surface-hint.test.cjs:45` exists and sets the override, so the ordering contract has a test, which is why Finding 1 is about cache coherency and not about ordering.

### **A manifest hash drift makes the hub's compiled serving inert** -- ruled out by the observed hash match. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A manifest hash drift makes the hub's compiled serving inert** -- ruled out by the observed hash match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A manifest hash drift makes the hub's compiled serving inert** -- ruled out by the observed hash match.

### **A phase is missing its goal or spec** -- ruled out: all fifteen child folders carry both, plus `tasks.md`, `plan.md` and `implementation-summary.md` in the levels that require them. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A phase is missing its goal or spec** -- ruled out: all fifteen child folders carry both, plus `tasks.md`, `plan.md` and `implementation-summary.md` in the levels that require them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A phase is missing its goal or spec** -- ruled out: all fifteen child folders carry both, plus `tasks.md`, `plan.md` and `implementation-summary.md` in the levels that require them.

### **Phase 015's criteria are unverifiable end to end** -- ruled out for the first two: criterion 1 and the hub strand of criterion 2 were reproduced in iteration 2 through `resolveRoute`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Phase 015's criteria are unverifiable end to end** -- ruled out for the first two: criterion 1 and the hub strand of criterion 2 were reproduced in iteration 2 through `resolveRoute`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 015's criteria are unverifiable end to end** -- ruled out for the first two: criterion 1 and the hub strand of criterion 2 were reproduced in iteration 2 through `resolveRoute`.

### **Placeholder text shipped in the hub** -- ruled out by the sweep; only shell `mktemp` templates matched. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Placeholder text shipped in the hub** -- ruled out by the sweep; only shell `mktemp` templates matched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Placeholder text shipped in the hub** -- ruled out by the sweep; only shell `mktemp` templates matched.

### **The 014 release note counts drifted from the artifact** -- ruled out: the replay artifact counts match what the index and the 015 log state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The 014 release note counts drifted from the artifact** -- ruled out: the replay artifact counts match what the index and the 015 log state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 014 release note counts drifted from the artifact** -- ruled out: the replay artifact counts match what the index and the 015 log state.

### **The advisor 2.0.3.0 change regressed a browser replay row** -- ruled out: zero PASS/FAIL flips across 52 rows. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The advisor 2.0.3.0 change regressed a browser replay row** -- ruled out: zero PASS/FAIL flips across 52 rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The advisor 2.0.3.0 change regressed a browser replay row** -- ruled out: zero PASS/FAIL flips across 52 rows.

### **The benchmark index points at a run folder that does not exist** -- ruled out by a directory test on every linked path. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The benchmark index points at a run folder that does not exist** -- ruled out by a directory test on every linked path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The benchmark index points at a run folder that does not exist** -- ruled out by a directory test on every linked path.

### **The carried P1 was closed** -- ruled out on a final re-read at `SKILL.md:75`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The carried P1 was closed** -- ruled out on a final re-read at `SKILL.md:75`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The carried P1 was closed** -- ruled out on a final re-read at `SKILL.md:75`.

### **The engine compiles from a stale `.opencode/skills` copy** -- ruled out: `.opencode/skills` is a symlink to `.skilled/skills` and the two `hub-router.json` paths are byte-identical. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The engine compiles from a stale `.opencode/skills` copy** -- ruled out: `.opencode/skills` is a symlink to `.skilled/skills` and the two `hub-router.json` paths are byte-identical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The engine compiles from a stale `.opencode/skills` copy** -- ruled out: `.opencode/skills` is a symlink to `.skilled/skills` and the two `hub-router.json` paths are byte-identical.

### **The hub `ROUTER.md` omits four detector phrases** -- ruled out: the class is discovery-only by design and says so in the vocabulary file. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The hub `ROUTER.md` omits four detector phrases** -- ruled out: the class is discovery-only by design and says so in the vocabulary file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hub `ROUTER.md` omits four detector phrases** -- ruled out: the class is discovery-only by design and says so in the vocabulary file.

### **The hub README version mismatch with `SKILL.md` is drift** -- ruled out by the phase 015 out-of-scope decision, cited above; the finding raised here is about the table and the missing file, not the number. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The hub README version mismatch with `SKILL.md` is drift** -- ruled out by the phase 015 out-of-scope decision, cited above; the finding raised here is about the table and the missing file, not the number.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hub README version mismatch with `SKILL.md` is drift** -- ruled out by the phase 015 out-of-scope decision, cited above; the finding raised here is about the table and the missing file, not the number.

### **The mutation-class guard's trigger regex misses a new mode directory** -- ruled out for this target: all three browser mode directories match `mcp-[a-z-]+` and each has a manifest row, so no reachable miss exists inside the reviewed tree. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The mutation-class guard's trigger regex misses a new mode directory** -- ruled out for this target: all three browser mode directories match `mcp-[a-z-]+` and each has a manifest row, so no reachable miss exists inside the reviewed tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The mutation-class guard's trigger regex misses a new mode directory** -- ruled out for this target: all three browser mode directories match `mcp-[a-z-]+` and each has a manifest row, so no reachable miss exists inside the reviewed tree.

### **The open P1 was closed by a later edit** -- ruled out: both cited lines still carry the unpinned pipeline. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The open P1 was closed by a later edit** -- ruled out: both cited lines still carry the unpinned pipeline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The open P1 was closed by a later edit** -- ruled out: both cited lines still carry the unpinned pipeline.

### **The prefixed command in `repl-evidence-capture.sh` writes cookies or secrets into the repo** -- ruled out: the Chrome-side guidance write path is `"${TMPDIR:-/tmp}"` under `cdp-patterns.md`, and the example's own output path is the caller-supplied `./tmp` session dir. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The prefixed command in `repl-evidence-capture.sh` writes cookies or secrets into the repo** -- ruled out: the Chrome-side guidance write path is `"${TMPDIR:-/tmp}"` under `cdp-patterns.md`, and the example's own output path is the caller-supplied `./tmp` session dir.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The prefixed command in `repl-evidence-capture.sh` writes cookies or secrets into the repo** -- ruled out: the Chrome-side guidance write path is `"${TMPDIR:-/tmp}"` under `cdp-patterns.md`, and the example's own output path is the caller-supplied `./tmp` session dir.

### **The shipped CDP recipes pass a truncated parameter name** -- ruled out after a direct read; the apparent `"n"` was a `rg -r` replacement artifact in this reviewer's own output, and the files carry `"returnByValue":true`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The shipped CDP recipes pass a truncated parameter name** -- ruled out after a direct read; the apparent `"n"` was a `rg -r` replacement artifact in this reviewer's own output, and the files carry `"returnByValue":true`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The shipped CDP recipes pass a truncated parameter name** -- ruled out after a direct read; the apparent `"n"` was a `rg -r` replacement artifact in this reviewer's own output, and the files carry `"returnByValue":true`.

### **The three changed rows are unrecorded regressions** -- ruled out: each carries `not-captured` as its prior state and each is a phase 015 case. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **The three changed rows are unrecorded regressions** -- ruled out: each carries `not-captured` as its prior state and each is a phase 015 case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The three changed rows are unrecorded regressions** -- ruled out: each carries `not-captured` as its prior state and each is a phase 015 case.

### **Three per-mode ROUTER tables name files that do not exist** -- ruled out: the bare filenames resolve under each packet's `references/` directory. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Three per-mode ROUTER tables name files that do not exist** -- ruled out: the bare filenames resolve under each packet's `references/` directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Three per-mode ROUTER tables name files that do not exist** -- ruled out: the bare filenames resolve under each packet's `references/` directory.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Empty at init]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Loop ends at the iteration cap. Synthesis consolidates six finding rows (one P1, eight P2) and the four traceability protocol statuses. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` root docs plus phases 001-015, and the shipped surfaces they claim: `.skilled/skills/mcp-browser-use/` (hub, three mode packets, playbooks, benchmark reports, changelogs), `.skilled/skills/mcp-tooling/` (browser pointers), `.skilled/skills/system-skill-advisor/` (scorer + routing-accuracy fixtures), `.skilled/bin/lib/compiled-routing/` (engine, activation manifests), `.skilled/bin/` guards and tests, `.skilled/commands/doctor/` scripts, `.skilled/scripts/git-hooks/pre-commit`.
- Behavior claims to verify: hub two-stage routing (hub picks a mode, mode packet picks a leaf), advisor compiled-routing flag and id-noun floor, phase goals 001-015, `goal.md` acceptance criteria, phase 015 fix list `Q001-Q00N`.
- Reuse and conventions: phase packets carry `goal.md`, `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`; changelogs are per-skill `changelog/vX.Y.Z.0.md`; routing fixtures live in `runtime/scripts/routing-accuracy/`.
- Review risks and gaps: the archived generation-3 run found packet status drift (goals still In Progress), doc/index drift, install hardening gaps, and one engine override bug (`compiled-route.cjs` skipping the activation-root override). Phase 015 claims to close several of those; the claims themselves are the thing to test.
- No `resource-map.md` exists in the spec folder, so the Resource Map Coverage Gate is skipped.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | Phase 015 scope table matches shipped lines |
| `checklist_evidence` | core | partial | 1 | two of three criteria are output claims; not executed |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | notApplicable | 1 | hub has no feature-catalog |
| `playbook_capability` | overlay | partial | 1 | Aside playbook omits the new `..` guard |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

522 files as seeded by the fan-out root in `review-scope-files.txt`. Per-file state recorded per iteration.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/description.json` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` | D1 | 1 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` | D1 | 1 | 0 | partial |
| `.../010-mcp-browser-use/lib/router.cjs`, `fixtures/canary-cases.v1.json` | D1 | 1 | 0 | complete |

<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-pi-1-1795511024070-2cuwlj, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T09:05:15Z
<!-- MACHINE-OWNED: END -->

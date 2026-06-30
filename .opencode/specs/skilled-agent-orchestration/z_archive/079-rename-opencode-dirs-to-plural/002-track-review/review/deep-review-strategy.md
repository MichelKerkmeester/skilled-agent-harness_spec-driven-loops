---
title: Deep Review Strategy — track:skilled-agent-orchestration (packets 093-096)
description: Architectural cross-phase audit of recently shipped packets 093, 094, 095, 096. Strategy file is the persistent brain across iterations.
---

# Deep Review Strategy — track:skilled-agent-orchestration 093-096

## 1. OVERVIEW

### Purpose
Surface P0/P1/P2 findings hidden inside the burst of recently shipped packets in the
`skilled-agent-orchestration` track: 093 (sk-code-review + sk-git playbooks), 094 (RCAF
naturalization across 16 playbooks + sk-doc template updates), 095 (sk-code-review playbook
execution via opencode+deepseek), and 096 (rename `.opencode/{skill,agent,command}/` to plural —
~11k file moves, 670k+ token-occurrence sed). Architectural / cross-phase view, not per-line audit.

### Usage
- Init: orchestrator (this loop manager) populates Topic, Review Dimensions, Known Context, Boundaries.
- Per iteration: cli-codex agent reads §12 NEXT FOCUS, executes the assigned dimension/files, updates findings, writes the iteration markdown + delta JSONL, sets new Next Focus.
- Mutability: machine-managed metrics in MACHINE-OWNED markers; human commentary outside.

---

## 2. TOPIC

`track:skilled-agent-orchestration` — architectural / cross-phase deep-review of packets 093-096
(committed 2026-05-07). Highest-risk delivery: packet 096 single-commit rename across ~11k files
and ~670k token-occurrences. Highest-novelty surface: prompt-equality contract introduced in 093 and
extended across 16 playbooks in 094.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Logic errors, wrong return types, broken invariants, dist-vs-src drift, broken validate.sh
- [x] D2 Security — Sandbox/auth/redaction, workflow-resolved spec_folder write authority, hooks integrity, env precedence
- [x] D3 Traceability — Spec/code alignment, checklist evidence, cross-runtime mirror parity, prompt-equality contract enforcement
- [x] D4 Maintainability — Doc anchors, dead refs, narrative spec doc casualties from bulk-sed, naming consistency, runtime discovery
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- Re-running each individual deep-review iteration loop already shipped within those packets (095 already executed sk-code-review playbook end-to-end).
- Implementation of remediation fixes — produces Plan Seed for `/speckit:plan` if FAIL/CONDITIONAL.
- Test execution beyond what cli-codex can reasonably perform inline (`bash` invocations of `validate.sh`, `skill_advisor.py` smoke checks, targeted `vitest`).
- Per-line code review of every touched file in 096 (~11k files would exceed budget; we sample by category).
- Auditing barter/coder/ sibling repo content (per memory: only canonical + AGENTS_Barter.md symlink synced).

---

## 5. STOP CONDITIONS

Beyond the canonical convergence vote in YAML §step_check_convergence:

1. All 4 dimensions register coverage in the registry AND all 7 legal-stop gates green.
2. Hard ceiling at 10 iterations.
3. 3 consecutive cli-codex dispatch failures → halt loop, enter synthesis with partial findings.
4. Any new P0 blocks STOP regardless of weighted score until remediated or adjudicated.
5. Adjudication packets must be present for every new P0/P1 finding before STOP.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | FAIL | 2 | Converged on packet 096 rename impact: live `dist/` runtime drift promotes P1-001 to P0; stale command YAML, advisor state pathing, and 096 validation defects remain P1. |
| D2 Security | FAIL | 3 | Converged on hook/runtime authority: hook commands resolve, but shared artifact root resolution accepts malformed `spec_folder` values that redirect writes, and Claude Stop autosave can execute an env-selected script. |
| D3 Traceability | FAIL | 4 | Converged on prompt/spec/agent traceability: prompt sync mostly holds, but completed packet checklists are all unchecked, OpenCode deep-loop agents retain stale `sk-deep-*` paths, and Codex `@review` weakens the shared P1 blocking contract. |
| D4 Maintainability | FAIL | 5 | Converged on rename-maintenance fallout: active packet 096 docs contain plural-to-plural tautologies, orchestrator/setup docs retain retired `sk-deep-*` IDs, and generated dist drift is broader than code-graph tests. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 1 active
- **P1 (Major):** 12 active
- **P2 (Minor):** 9 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings tracked in `deep-review-findings-registry.json`. Updated after each iteration by reducer.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

[First iteration — populated after iteration 1 completes]

---

## 9. WHAT FAILED

[First iteration — populated after iteration 1 completes]

---

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach is tried from multiple angles without yielding new findings]

---

## 11. RULED OUT DIRECTIONS

[Populated as iterations conclude that certain angles are clean]

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
**Synthesis: loop converged at iter-10; verdict FAIL pending P0-001 remediation.**

Iteration 10 confirmed all active finding classifications and severity dispositions, found no new findings, and made no severity changes. Proceed to phase synthesis with `stopReason=maxIterationsReached`.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### From CocoIndex / direct grep (pre-loop sweep)

**Suspected pre-existing P0/P1 surface (cli-codex iterations should triage):**

1. **`.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-15`** — retains singular `**/.opencode/skill/**`, `**/.opencode/agent/**`, `**/.opencode/command/**` globs while the source `.ts` (line 15-17) was correctly updated to plural by 096's bulk-sed. Indicates `dist/` was not rebuilt as part of 096. If runtime imports `dist/` (not `lib/`/`src/.ts` directly), code-graph indexing scope is silently mismatched after rename. **Severity hint: P0 if runtime depends on dist; otherwise P1 build hygiene.** Iteration 2 should confirm import path.

2. **`.opencode/install_guides/SET-UP - Opencode Agents.md`** — multiple lingering `.opencode/agent/` (singular) references across the install guide. User-facing setup doc steers new contributors to a directory that no longer exists post-rename. **Severity hint: P1 documentation correctness.**

3. **`.opencode/install_guides/SET-UP - AGENTS.md`** — multiple `.opencode/command/` (singular) references inside install/troubleshooting guidance. **Severity hint: P1 documentation correctness.**

4. **`.opencode/commands/speckit/deep-review.md` and `deep-research.md`** — references to `sk-deep-review`/`sk-deep-research` that were renamed in packet 070 but never updated here. Same drift inside `.opencode/commands/speckit/assets/speckit_deep-review_*.yaml` `skill_reference` and `template_path:` fields. The actual skill folders are `.opencode/skills/deep-review/` and `.opencode/skills/deep-research/`. **Severity hint: P1 — workflow templates point to non-existent paths; loop manager has to substitute the right path manually each dispatch. Could P0 if any automation literally reads those paths.**

5. **`barter/README.md:151-152`** — singular `.opencode/agent/` and `.opencode/command/` in the architecture diagram. Per project memory, `barter/coder/` is a sibling-repo mirror; root `barter/README.md` is shared. **Severity hint: P1 doc sync.**

6. **dist/ vs src/ drift in tests** — `mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js` and `code-graph-scan.vitest.js` reference singular paths in their assertions. If these dist tests are ever exercised in CI without rebuild, they'd fail or pass for the wrong reason. **Severity hint: P1 test-isolation.**

7. **Test fixtures referencing singular paths** — `mcp_server/dist/scripts/tests/resource-map-extractor.vitest.js` references `.opencode/command/spec_kit/deep-review.md` in fixture data. If the fixture is meant to mirror real-world references, it now diverges from production paths. **Severity hint: P2 fixture drift.**

### From `git log` (commits in scope)

| Commit | Packet(s) | Stat |
|--------|-----------|------|
| `40dcf80052` | 096 | 11,348 files changed, 677,307 insertions, 669,689 deletions |
| `0a3f7f70aa` | 093 + 094 (combined) | 678 files changed, 9,888 insertions, 1,616 deletions |
| (095 commit) | 095 |  scaffolded execution; check separately |

### From project memory (relevant feedback)

- "Rename verification requires case-insensitive grep" — final-gate grep for any rename must use `rg -il`; UPPERCASE/Title-Case literals (integration IDs, banners) easy to miss. Iteration 2/3 must use case-insensitive grep when verifying rename completeness.
- "Stay on main, no feature branches" — `create.sh` auto-branches; immediately switched back. Already applied to this 097 packet (`--skip-branch`).
- "Worktree cleanliness is never a blocker" — never flag dirty worktree as concern.
- "AGENTS.md sibling sync (canonical + Barter only)" — only canonical + AGENTS_Barter.md (symlink) need to stay in sync; fs-enterprises sibling deleted 2026-05-01.

### From spec.md / plan.md / tasks.md / checklist.md (this 097 packet)

- Review-only packet; no implementation phase. All P0 requirements concern loop completeness and READ-ONLY discipline on review target.
- 4 dimensions, 10 iterations, executor=cli-codex (gpt-5.5, high reasoning, fast service tier).

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 4 | 093 RCAF claims are superseded by 094; 096 strict validation still fails. |
| `checklist_evidence` | core | fail | 4 | 093 child, 094, and 096 child checklists remain 0 checked despite completion claims. |
| `skill_agent` | overlay | partial | 4 | Prompt sync mostly holds; two `cli-opencode` retained-RCAF fields are malformed by nested backticks. |
| `agent_cross_runtime` | overlay | fail | 4 | OpenCode deep-loop agents retain `sk-deep-*`; Codex `@review` changes P1 blocking semantics. |
| `feature_catalog_code` | overlay | pending | — | Defer to D4 unless dead refs touch feature catalog anchors. |
| `playbook_capability` | overlay | partial | 4 | 16 direct playbooks enumerated; 690 prompts parsed; RCAF retention 17.8%. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state is too large to enumerate at init for a track-level review. Iteration 1 inventory pass populates this table by category sample, not file enumeration. Estimated scope size:]

| Category | Files (estimate) | Iteration 1 strategy |
|----------|------------------|----------------------|
| 096 rename-only moves | ~11,000 | Spot-check via `git diff --name-status R000` heads of each subdir; do NOT review each file. |
| 096 config patches | 4-6 | Read all: `opencode.json`, `.claude/settings.local.json`, `skill_advisor.py` (regex/dict/f-strings), agent mirrorPath fields (sk-prompt graph-metadata, deep-research runtime_capabilities), audit_descriptions.py. |
| 096 narrative doc edits | 10-20 | Read: README.md, AGENTS.md, AGENTS_Barter.md, CLAUDE.md, install guides; check for casualties (mangled prose). |
| 094 playbook canonicals | ~720 per-feature files | Sample 5-10 across the 16 playbooks; check prompt-equality. |
| 094 sk-doc + creation refs | 3-4 | Read all updated files. |
| 093 sk-code-review playbook | ~18 scenarios | Sample 3-5; check prompt-equality contract. |
| 093 sk-git playbook | ~22 scenarios | Sample 3-5; check refusal-string discipline. |
| 095 execution log | 1-2 | Read aggregate results table. |

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|--------------------|----------------|----------|--------|
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-05-07T14:46:56Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 13 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: track
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-05-07T14:46:56Z
- Executor: cli-codex (codex exec) — model gpt-5.5, reasoningEffort high, serviceTier fast, sandbox workspace-write, timeout 900s
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 1
- P1 (Required): 13
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: partial. Cross-runtime MCP config paths use `.opencode/skills/system-spec-kit/.../dist`, proving live plural skill-root pathing for server launch, but the launched generated JS still contains singular scope policy. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. Cross-runtime MCP config paths use `.opencode/skills/system-spec-kit/.../dist`, proving live plural skill-root pathing for server launch, but the launched generated JS still contains singular scope policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. Cross-runtime MCP config paths use `.opencode/skills/system-spec-kit/.../dist`, proving live plural skill-root pathing for server launch, but the launched generated JS still contains singular scope policy.

### `agent_cross_runtime`: partial. Hook commands resolve and point to existing `dist/hooks/*` scripts across Claude/Codex/Gemini; OpenCode config has permissive local permissions including `external_directory`, and runtime mirrors are not byte-identical by design. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. Hook commands resolve and point to existing `dist/hooks/*` scripts across Claude/Codex/Gemini; OpenCode config has permissive local permissions including `external_directory`, and runtime mirrors are not byte-identical by design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. Hook commands resolve and point to existing `dist/hooks/*` scripts across Claude/Codex/Gemini; OpenCode config has permissive local permissions including `external_directory`, and runtime mirrors are not byte-identical by design.

### `agent_cross_runtime`: partial. OpenCode, Codex, Gemini, and Claude config paths sampled use plural `.opencode/skills` runtime paths, but root `.opencode/skill` survivor and stale command assets prevent a clean pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. OpenCode, Codex, Gemini, and Claude config paths sampled use plural `.opencode/skills` runtime paths, but root `.opencode/skill` survivor and stale command assets prevent a clean pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. OpenCode, Codex, Gemini, and Claude config paths sampled use plural `.opencode/skills` runtime paths, but root `.opencode/skill` survivor and stale command assets prevent a clean pass.

### `checklist_evidence`: fail carried forward. Packet 096 validation remains failed from iteration 2 and is not re-run here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: fail carried forward. Packet 096 validation remains failed from iteration 2 and is not re-run here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail carried forward. Packet 096 validation remains failed from iteration 2 and is not re-run here.

### `checklist_evidence`: fail for this pass because 096 validation fails; 093, 094, and 095 pass normal and strict validation. 094's Level 2 checklist metadata validates. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: fail for this pass because 096 validation fails; 093, 094, and 095 pass normal and strict validation. 094's Level 2 checklist metadata validates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for this pass because 096 validation fails; 093, 094, and 095 pass normal and strict validation. 094's Level 2 checklist metadata validates.

### `checklist_evidence`: fail. Parent packet 096 and child `004-symlinks` fail strict validation; `001-skills`, `002-agents`, and `003-commands` pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: fail. Parent packet 096 and child `004-symlinks` fail strict validation; `001-skills`, `002-agents`, and `003-commands` pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail. Parent packet 096 and child `004-symlinks` fail strict validation; `001-skills`, `002-agents`, and `003-commands` pass.

### `code_graph/lib/gold-query-verifier`: source comment plural at line 36; `dist` comment singular at line 27. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `code_graph/lib/gold-query-verifier`: source comment plural at line 36; `dist` comment singular at line 27.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph/lib/gold-query-verifier`: source comment plural at line 36; `dist` comment singular at line 27.

### `code_graph/lib/index-scope-policy`: source plural at lines 15-17; `dist` singular at lines 13-15. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `code_graph/lib/index-scope-policy`: source plural at lines 15-17; `dist` singular at lines 13-15.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `code_graph/lib/index-scope-policy`: source plural at lines 15-17; `dist` singular at lines 13-15.

### `feature_catalog_code`: not applicable for this correctness pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code`: not applicable for this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not applicable for this correctness pass.

### `feature_catalog_code`: not applicable for this security pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: not applicable for this security pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not applicable for this security pass.

### `feature_catalog_code`: not applicable in this inventory pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: not applicable in this inventory pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not applicable in this inventory pass.

### `lib/deep-loop/executor-audit`, `lib/deep-loop/prompt-pack`, and `lib/spec/is-phase-parent`: no singular `.opencode/{skill,agent,command}/` or `sk-deep-*` hits in source or dist for the sampled pattern. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `lib/deep-loop/executor-audit`, `lib/deep-loop/prompt-pack`, and `lib/spec/is-phase-parent`: no singular `.opencode/{skill,agent,command}/` or `sk-deep-*` hits in source or dist for the sampled pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `lib/deep-loop/executor-audit`, `lib/deep-loop/prompt-pack`, and `lib/spec/is-phase-parent`: no singular `.opencode/{skill,agent,command}/` or `sk-deep-*` hits in source or dist for the sampled pattern.

### `playbook_capability`: not applicable for this correctness pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability`: not applicable for this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: not applicable for this correctness pass.

### `playbook_capability`: not applicable for this security pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: not applicable for this security pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: not applicable for this security pass.

### `playbook_capability`: partial. Sampled playbooks preserve the prompt-equality requirement text, but full 16-playbook RCAF naturalization integrity remains open. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: partial. Sampled playbooks preserve the prompt-equality requirement text, but full 16-playbook RCAF naturalization integrity remains open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial. Sampled playbooks preserve the prompt-equality requirement text, but full 16-playbook RCAF naturalization integrity remains open.

### `skill_agent`: partial. Deep review and deep research skills exist at plural `.opencode/skills/deep-*`, but command YAML, active agent instructions, and install guides still cite `sk-deep-*`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: partial. Deep review and deep research skills exist at plural `.opencode/skills/deep-*`, but command YAML, active agent instructions, and install guides still cite `sk-deep-*`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. Deep review and deep research skills exist at plural `.opencode/skills/deep-*`, but command YAML, active agent instructions, and install guides still cite `sk-deep-*`.

### `skill_agent`: partial. Deep-review leaf-agent write-boundary instructions are present in sampled OpenCode, Claude, Gemini, and Codex mirrors, but the command workflow resolver does not enforce the same boundary in code. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent`: partial. Deep-review leaf-agent write-boundary instructions are present in sampled OpenCode, Claude, Gemini, and Codex mirrors, but the command workflow resolver does not enforce the same boundary in code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. Deep-review leaf-agent write-boundary instructions are present in sampled OpenCode, Claude, Gemini, and Codex mirrors, but the command workflow resolver does not enforce the same boundary in code.

### `skill_agent`: partial. Four sk-code-review/sk-git playbook samples expose prompt-equality requirement lines and naturalized prompts; exact table-cell equality across the full 093/094 playbook matrix is deferred to a traceability pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: partial. Four sk-code-review/sk-git playbook samples expose prompt-equality requirement lines and naturalized prompts; exact table-cell equality across the full 093/094 playbook matrix is deferred to a traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. Four sk-code-review/sk-git playbook samples expose prompt-equality requirement lines and naturalized prompts; exact table-cell equality across the full 093/094 playbook matrix is deferred to a traceability pass.

### `spec_code`: fail. Packet 096 claims zero singular references and strict recursive validation as success criteria, but live runtime generated code, advisor source, command workflow YAML, and active docs/scripts still contain singular or stale skill paths. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: fail. Packet 096 claims zero singular references and strict recursive validation as success criteria, but live runtime generated code, advisor source, command workflow YAML, and active docs/scripts still contain singular or stale skill paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail. Packet 096 claims zero singular references and strict recursive validation as success criteria, but live runtime generated code, advisor source, command workflow YAML, and active docs/scripts still contain singular or stale skill paths.

### `spec_code`: fail. The security contract says review artifacts are packet-local, but `resolveArtifactRoot` accepts malformed `spec_folder` values and redirects `{artifact_dir}` without containment. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: fail. The security contract says review artifacts are packet-local, but `resolveArtifactRoot` accepts malformed `spec_folder` values and redirects `{artifact_dir}` without containment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail. The security contract says review artifacts are packet-local, but `resolveArtifactRoot` accepts malformed `spec_folder` values and redirects `{artifact_dir}` without containment.

### `spec_code`: partial. Packet 096's spec intent is the plural rename, but runtime generated code and command YAML still contain singular/stale skill path bindings. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial. Packet 096's spec intent is the plural rename, but runtime generated code and command YAML still contain singular/stale skill path bindings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Packet 096's spec intent is the plural rename, but runtime generated code and command YAML still contain singular/stale skill path bindings.

### Coverage: partial; iteration 1 sampled all requested hot-zone categories but did not complete deep adjudication. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Coverage: partial; iteration 1 sampled all requested hot-zone categories but did not complete deep adjudication.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Coverage: partial; iteration 1 sampled all requested hot-zone categories but did not complete deep adjudication.

### Evidence: pass for inventory; every P1 includes concrete file evidence and command corroboration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Evidence: pass for inventory; every P1 includes concrete file evidence and command corroboration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Evidence: pass for inventory; every P1 includes concrete file evidence and command corroboration.

### No broad downstream test was found that still asserts "all prompts must be RCAF"; the remaining equality checks assert prompt-field/table/root synchronization, which is still the intended contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No broad downstream test was found that still asserts "all prompts must be RCAF"; the remaining equality checks assert prompt-field/table/root synchronization, which is still the intended contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No broad downstream test was found that still asserts "all prompts must be RCAF"; the remaining equality checks assert prompt-field/table/root synchronization, which is still the intended contract.

### No hook command in the checked Claude/Codex/Gemini settings referenced `.opencode/skill/`, `.opencode/agent/`, `.opencode/command/`, or `sk-deep-*`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No hook command in the checked Claude/Codex/Gemini settings referenced `.opencode/skill/`, `.opencode/agent/`, `.opencode/command/`, or `sk-deep-*`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No hook command in the checked Claude/Codex/Gemini settings referenced `.opencode/skill/`, `.opencode/agent/`, `.opencode/command/`, or `sk-deep-*`.

### No missing hook script was found in the checked settings; every configured `dist/hooks/*` script exists. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No missing hook script was found in the checked settings; every configured `dist/hooks/*` script exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No missing hook script was found in the checked settings; every configured `dist/hooks/*` script exists.

### No new singular-root hits were found in `.opencode/scripts/`, `.opencode/skills/system-spec-kit/scripts/`, `.github/workflows/`, root README/CONTRIBUTING/PUBLIC_RELEASE/DEPLOYMENT/AGENTS/CLAUDE files, or top-level scripts. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No new singular-root hits were found in `.opencode/scripts/`, `.opencode/skills/system-spec-kit/scripts/`, `.github/workflows/`, root README/CONTRIBUTING/PUBLIC_RELEASE/DEPLOYMENT/AGENTS/CLAUDE files, or top-level scripts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new singular-root hits were found in `.opencode/scripts/`, `.opencode/skills/system-spec-kit/scripts/`, `.github/workflows/`, root README/CONTRIBUTING/PUBLIC_RELEASE/DEPLOYMENT/AGENTS/CLAUDE files, or top-level scripts.

### No ordinary markdown missing-file or missing-anchor issues were found in packet 096's 22 markdown files by the local link/anchor checker. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No ordinary markdown missing-file or missing-anchor issues were found in packet 096's 22 markdown files by the local link/anchor checker.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No ordinary markdown missing-file or missing-anchor issues were found in packet 096's 22 markdown files by the local link/anchor checker.

### No root-summary mismatch was found for parsed per-feature prompt IDs in the 16 direct playbooks. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No root-summary mismatch was found for parsed per-feature prompt IDs in the 16 direct playbooks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No root-summary mismatch was found for parsed per-feature prompt IDs in the 16 direct playbooks.

### P1-002 remains P1: auto command YAML uses non-existent `sk-deep-review` paths at `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56-64`; this is command-owned workflow input, not commentary. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-002 remains P1: auto command YAML uses non-existent `sk-deep-review` paths at `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56-64`; this is command-owned workflow input, not commentary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-002 remains P1: auto command YAML uses non-existent `sk-deep-review` paths at `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56-64`; this is command-owned workflow input, not commentary.

### P1-003 remains P1: source writes advisor generation state to `.opencode/skill/.advisor-state` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`; this conflicts with the plural `.gitignore` state path at `.gitignore:44`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-003 remains P1: source writes advisor generation state to `.opencode/skill/.advisor-state` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`; this conflicts with the plural `.gitignore` state path at `.gitignore:44`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-003 remains P1: source writes advisor generation state to `.opencode/skill/.advisor-state` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`; this conflicts with the plural `.gitignore` state path at `.gitignore:44`.

### P1-004 remains P1: packet 096 validation is a required gate failure for the largest rename packet. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-004 remains P1: packet 096 validation is a required gate failure for the largest rename packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-004 remains P1: packet 096 validation is a required gate failure for the largest rename packet.

### P1-006 remains P1: the Claude Stop hook includes `SPECKIT_GENERATE_CONTEXT_SCRIPT` before canonical candidate resolution at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38-46`; the hook fires on a live runtime path. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-006 remains P1: the Claude Stop hook includes `SPECKIT_GENERATE_CONTEXT_SCRIPT` before canonical candidate resolution at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38-46`; the hook fires on a live runtime path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-006 remains P1: the Claude Stop hook includes `SPECKIT_GENERATE_CONTEXT_SCRIPT` before canonical candidate resolution at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38-46`; the hook fires on a live runtime path.

### P1-007 remains P1: checked checklist evidence is a completion gate, not decorative documentation. The checklist defines P0 as "Cannot claim done until complete" and P1 as "Must complete OR get user approval" at `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/checklist.md:37-39`, while the implementation summary claims "Implementation complete; all gates passed" at line 13. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-007 remains P1: checked checklist evidence is a completion gate, not decorative documentation. The checklist defines P0 as "Cannot claim done until complete" and P1 as "Must complete OR get user approval" at `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/checklist.md:37-39`, while the implementation summary claims "Implementation complete; all gates passed" at line 13.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-007 remains P1: checked checklist evidence is a completion gate, not decorative documentation. The checklist defines P0 as "Cannot claim done until complete" and P1 as "Must complete OR get user approval" at `.opencode/specs/skilled-agent-orchestration/z_archive/077-playbook-prompt-naturalness/checklist.md:37-39`, while the implementation summary claims "Implementation complete; all gates passed" at line 13.

### P1-008 remains P1: OpenCode leaf-agent instructions cite `.opencode/skills/sk-deep-review/...` at `.opencode/agents/deep-review.md:318`, so an active runtime mirror can route readers/executors to a non-existent skill. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-008 remains P1: OpenCode leaf-agent instructions cite `.opencode/skills/sk-deep-review/...` at `.opencode/agents/deep-review.md:318`, so an active runtime mirror can route readers/executors to a non-existent skill.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-008 remains P1: OpenCode leaf-agent instructions cite `.opencode/skills/sk-deep-review/...` at `.opencode/agents/deep-review.md:318`, so an active runtime mirror can route readers/executors to a non-existent skill.

### P1-009 remains P1: `.codex/agents/review.toml:400-404` says not to block without P0 evidence and treats P1 as not immediate blockers, while shared doctrine says P1 is "Fix before merge" (`review_core.md:23`) and deep-review quick reference says active P1s produce `CONDITIONAL`, not `PASS` (`quick_reference.md:103`). This is active runtime instruction text, not a passive note. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-009 remains P1: `.codex/agents/review.toml:400-404` says not to block without P0 evidence and treats P1 as not immediate blockers, while shared doctrine says P1 is "Fix before merge" (`review_core.md:23`) and deep-review quick reference says active P1s produce `CONDITIONAL`, not `PASS` (`quick_reference.md:103`). This is active runtime instruction text, not a passive note.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-009 remains P1: `.codex/agents/review.toml:400-404` says not to block without P0 evidence and treats P1 as not immediate blockers, while shared doctrine says P1 is "Fix before merge" (`review_core.md:23`) and deep-review quick reference says active P1s produce `CONDITIONAL`, not `PASS` (`quick_reference.md:103`). This is active runtime instruction text, not a passive note.

### P1-010 remains P1: the plural-to-plural rewrite corrupts active packet requirements and resource-map audit evidence (`spec.md:70`, `001-skills/spec.md:57`, `resource-map.md:20`). It does not directly break runtime automation, but it breaks the authoritative spec/traceability contract for the rename packet. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-010 remains P1: the plural-to-plural rewrite corrupts active packet requirements and resource-map audit evidence (`spec.md:70`, `001-skills/spec.md:57`, `resource-map.md:20`). It does not directly break runtime automation, but it breaks the authoritative spec/traceability contract for the rename packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-010 remains P1: the plural-to-plural rewrite corrupts active packet requirements and resource-map audit evidence (`spec.md:70`, `001-skills/spec.md:57`, `resource-map.md:20`). It does not directly break runtime automation, but it breaks the authoritative spec/traceability contract for the rename packet.

### P1-011 remains P1: `.opencode/agents/orchestrate.md:96` is an active routing table that names retired `sk-deep-research`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-011 remains P1: `.opencode/agents/orchestrate.md:96` is an active routing table that names retired `sk-deep-research`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-011 remains P1: `.opencode/agents/orchestrate.md:96` is an active routing table that names retired `sk-deep-research`.

### P1-012 remains P1: confirm-mode YAML mirrors the same live workflow defect as auto mode at `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56-64`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: P1-012 remains P1: confirm-mode YAML mirrors the same live workflow defect as auto mode at `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56-64`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-012 remains P1: confirm-mode YAML mirrors the same live workflow defect as auto mode at `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56-64`.

### Packet 095 Level 1 packet does not require a checklist; its aggregate 18/18 PASS table matches the sampled `REQ-001..003` execution/result claims. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Packet 095 Level 1 packet does not require a checklist; its aggregate 18/18 PASS table matches the sampled `REQ-001..003` execution/result claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet 095 Level 1 packet does not require a checklist; its aggregate 18/18 PASS table matches the sampled `REQ-001..003` execution/result claims.

### Scope: pass; no review-target files were modified. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Scope: pass; no review-target files were modified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scope: pass; no review-target files were modified.

### The 5 packet-096 mirror symlinks sampled from `resource-map.md` all resolve to plural targets. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The 5 packet-096 mirror symlinks sampled from `resource-map.md` all resolve to plural targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The 5 packet-096 mirror symlinks sampled from `resource-map.md` all resolve to plural targets.

### The mixed skill naming pattern is intentional per `skill-graph.json` families; the accidental drift is limited to retired `sk-deep-*` references. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The mixed skill naming pattern is intentional per `skill-graph.json` families; the accidental drift is limited to retired `sk-deep-*` references.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The mixed skill naming pattern is intentional per `skill-graph.json` families; the accidental drift is limited to retired `sk-deep-*` references.

### The sampled `deep-review` mirrors all include packet-local write-boundary language, so the parity issue is enforcement drift, not absent leaf-agent doctrine. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The sampled `deep-review` mirrors all include packet-local write-boundary language, so the parity issue is enforcement drift, not absent leaf-agent doctrine.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The sampled `deep-review` mirrors all include packet-local write-boundary language, so the parity issue is enforcement drift, not absent leaf-agent doctrine.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->

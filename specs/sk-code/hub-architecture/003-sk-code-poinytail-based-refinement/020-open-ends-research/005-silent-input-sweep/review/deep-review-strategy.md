# Deep Review Strategy - Silent Input Sweep

## 1. OVERVIEW

### Purpose
Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage
- Init: Orchestrator copies this template to {artifact_dir}/deep-review-strategy.md and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- Per iteration: Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- Mutability: Mutable, updated by both orchestrator and agents throughout the session.
- Protection: None (shared mutable state). Orchestrator validates consistency on resume.
- Ownership: Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

## 2. TOPIC
Every CLI script under .skilled/bin, .skilled/skills/**/scripts (nested mode packets included), .skilled/skills/*/runtime/cli and .skilled/commands/*/scripts (tests and node_modules excluded), checked for two defect classes: (1) unknown or misspelled options accepted silently; (2) exit 0 on a detected problem, or a header that documents an option the parser rejects

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing any script; this run is read-only.
- Performance, style or other defect classes unless they cause one of the two classes.
- Test files and vendored code under node_modules.

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: the run continues to iteration 10; convergence is telemetry only.

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
- P1 (Required): 18
- P2 (Suggestions): 55
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Iteration 1: argv/exit/unknown inventory greps narrowed 33 files to 12 candidates, then one execution repro per candidate confirmed behavior with exit codes (11 read-only repros; repo left clean).
- Iterations 2-4 notes were in the overwritten region; see deltas/iter-002.jsonl, iter-003.jsonl, iter-004.jsonl.
- Iteration 7 (traceability, slice 7 of 10): 23 deep-loop/advisor CLI scripts; repros A-J proved 3 P1 (unknown-flag acceptance / --check write-path flip) and 5 P2; strict parsers and all five Python argparse CLIs confirmed clean; repo left clean.
- Iteration 8 (maintainability, slice 8 of 10): 32 system-spec-kit runtime CLI + advisor files; A/B repro pairs (identical output with and without a bogus flag) isolated 2 P1 + 6 P2; 13 strict parsers confirmed; repo left clean (git status showed only the review packet).
- Iteration 10 (security, slice 10 of 10): 29 spec/validation/sweep/templates/scripts files; 9 executed repros (A/B/C, F2-F9) proved 1 P1 (env-reader-table mode fallback) + 8 P2; 16 strict parsers confirmed; a scratch-copy repro avoided executing the sync checker; repo left clean (git status showed only the review packet).

<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=rvw-020-005-silent-input-20261011T162455Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-11T16:24:55Z
<!-- MACHINE-OWNED: END -->

## Iteration 004 addendum — maintainability (slice 4/10)
- Reviewed 26 sk-doc CLI scripts for silent unknown options and exit-0-after-detected-problem.
- New: R4-P1-001 (build-rule-cards.cjs unknown flag selects the write path; a --check typo writes/deletes cards with exit 0). R4-P2-001..R4-P2-006 (lint-goal-criteria exits 0 after an unknown option; ci-leaf-manifest-freshness, ci-skill-derived-freshness, ci-skill-root-metadata, check-repo-rules and ci-router-vocabulary-reach ignore unknown options).
- Verdict: CONDITIONAL. Next: maintainability slice 5, then close out dimension coverage.

## Iteration 004 addendum — maintainability (slice 4/10)
- Reviewed 26 sk-doc CLI scripts for silent unknown options and exit-0-after-detected-problem.
- New: R4-P1-001 (build-rule-cards.cjs unknown flag selects the write path; a --check typo writes/deletes cards with exit 0). R4-P2-001..R4-P2-006 (lint-goal-criteria exits 0 after an unknown option; ci-leaf-manifest-freshness, ci-skill-derived-freshness, ci-skill-root-metadata, check-repo-rules and ci-router-vocabulary-reach ignore unknown options).
- Verdict: CONDITIONAL. Next: maintainability slice 5, then close out dimension coverage.

---
## APPENDED BY ITERATION 005 (correctness)
- Slice 5 (22 CLI files): 2 P1 + 6 P2. R5-P1-001 validate-compiled-routing-scenarios.cjs (--strct typo leaves fail=1 at exit 0); R5-P1-002 validate-playbook-topology.cjs (same shape; doc at sk-design manual-testing-playbook line 55 says --strict is not optional). P2s: generate-router-intent-signals dangling --hub; generate-leaf-manifest unknown flags; advise-council-completion option-as-positional exit 0; worktree-naming create arg-drop and provisioning exit 0; migrate-legacy collision exit 0.
- Clean parsers: leaf-route-replay, stamp-branch, validate-message, hvr_scan, package_skill, init_skill, validate_skill_package, regenerate-skill-derived, orchestrate-session, replay-graph-from-artifacts.
- Next: slice 6 (orchestrator-assigned), dimension correctness per sweep contract.

---
## APPENDED BY ITERATION 005 (correctness)
- Slice 5 (22 CLI files): 2 P1 + 6 P2. R5-P1-001 validate-compiled-routing-scenarios.cjs (--strct typo leaves fail=1 at exit 0); R5-P1-002 validate-playbook-topology.cjs (same shape; sk-design manual-testing-playbook line 55 states --strict is not optional). P2s: generate-router-intent-signals dangling --hub; generate-leaf-manifest unknown flags; advise-council-completion option-as-positional exit 0; worktree-naming create arg-drop and provisioning exit 0; migrate-legacy collision exit 0.
- Clean parsers: leaf-route-replay, stamp-branch, validate-message, hvr_scan, package_skill, init_skill, validate_skill_package, regenerate-skill-derived, orchestrate-session, replay-graph-from-artifacts.
- Next: slice 6 (orchestrator-assigned), dimension correctness per sweep contract.
- REPAIR NOTE: earlier in iteration 005 this file was accidentally overwritten with its own last 4 KB (a tail-only read mistaken for a full read). It has been restored on this line from git HEAD (no-usable-HEAD-kept-current); the pre-overwrite bytes could not be diffed, so any uncommitted machine-owned metrics between HEAD and the overwrite are not guaranteed byte-identical.

---
## Iteration 005 addendum (correctness, slice 5/10)
- 2 P1 + 6 P2. R5-P1-001: validate-compiled-routing-scenarios.cjs --strct typo leaves a detected fail=1 at exit 0 (parseArgs at :387 has no unknown branch; strict exit at :409). R5-P1-002: validate-playbook-topology.cjs same shape; sk-design manual-testing-playbook line 55 states --strict is not optional. P2s: generate-router-intent-signals dangling --hub selects all hubs; generate-leaf-manifest unknown flags ignored; advise-council-completion option-as-positional and exit 0; worktree-naming create drops unknown args (:403) and downgrades provisioning failure to exit 0 (:418); migrate-legacy-branch-names collision skip still exits 0 (:116).
- Clean parsers: leaf-route-replay, stamp-branch, validate-message, hvr_scan, package_skill, init_skill, validate_skill_package, regenerate-skill-derived, orchestrate-session, replay-graph-from-artifacts.
- Next: slice 6 (orchestrator-assigned), dimension correctness per sweep contract.

## REPAIR RECORD (iteration 5)
- This file was accidentally overwritten with its own final ~4 KB by the iteration-005 agent (a tail-only read mistaken for a full read). No git copy existed (path untracked; refsWith=none). It was rebuilt from: run config topic/metadata, registry totals, and the surviving machine-owned tail plus the verbatim iteration-004 addendum. Reconstructed section text is faithful to the observed original where noted; uncommitted machine-owned detail from the overwritten region could not be recovered. Reducer re-derivation of machine-owned sections is recommended; source=reconstructed-from-config-and-registry.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `--owner-token`/`--ownerToken` in process-memory-harness.ts:119-128 are owner-marker strings matched against other processes' command lines, not harness options; the harness has no signal path (help :582). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `--owner-token`/`--ownerToken` in process-memory-harness.ts:119-128 are owner-marker strings matched against other processes' command lines, not harness options; the harness has no signal path (help :582).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--owner-token`/`--ownerToken` in process-memory-harness.ts:119-128 are owner-marker strings matched against other processes' command lines, not harness options; the harness has no signal path (help :582).

### `documented_option_rejected_by_parser` for slice 2: compared usage/header text against the parser for all 32 files; every documented option is read, and no usage block documents a flag its parser rejects. `validate_config.py`'s usage (positional path + `--check-env`) matches the argparse registration at lines 455-467; `render-screenshots.cjs`'s usage (`--check`, `--full-page`) matches lines 174-175; `check-corpus.cjs`'s usage (`--families`, `--render`, `--extra DIR`) matches lines 3515-3522; `ceiling-report.sh`'s documented exit-code table matches main(). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `documented_option_rejected_by_parser` for slice 2: compared usage/header text against the parser for all 32 files; every documented option is read, and no usage block documents a flag its parser rejects. `validate_config.py`'s usage (positional path + `--check-env`) matches the argparse registration at lines 455-467; `render-screenshots.cjs`'s usage (`--check`, `--full-page`) matches lines 174-175; `check-corpus.cjs`'s usage (`--families`, `--render`, `--extra DIR`) matches lines 3515-3522; `ceiling-report.sh`'s documented exit-code table matches main().
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `documented_option_rejected_by_parser` for slice 2: compared usage/header text against the parser for all 32 files; every documented option is read, and no usage block documents a flag its parser rejects. `validate_config.py`'s usage (positional path + `--check-env`) matches the argparse registration at lines 455-467; `render-screenshots.cjs`'s usage (`--check`, `--full-page`) matches lines 174-175; `check-corpus.cjs`'s usage (`--families`, `--render`, `--extra DIR`) matches lines 3515-3522; `ceiling-report.sh`'s documented exit-code table matches main().

### `documented_option_rejected_by_parser`: compared usage/header options against parsers for all 12 candidate scripts; no mismatch. `speckit-completion.cjs` is the opposite case (parser accepts-and-ignores beyond its documented set). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `documented_option_rejected_by_parser`: compared usage/header options against parsers for all 12 candidate scripts; no mismatch. `speckit-completion.cjs` is the opposite case (parser accepts-and-ignores beyond its documented set).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `documented_option_rejected_by_parser`: compared usage/header options against parsers for all 12 candidate scripts; no mismatch. `speckit-completion.cjs` is the opposite case (parser accepts-and-ignores beyond its documented set).

### `exit_zero_on_detected_problem` at gate scope for slice 2: every failure branch in the gate cluster inspected returns nonzero (receipts above); the two exit-0-after-detection instances found are R2-P2-002 (unreadable input counted clean) and R2-P2-001 (advisory helper's documented always-0 contract). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `exit_zero_on_detected_problem` at gate scope for slice 2: every failure branch in the gate cluster inspected returns nonzero (receipts above); the two exit-0-after-detection instances found are R2-P2-002 (unreadable input counted clean) and R2-P2-001 (advisory helper's documented always-0 contract).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `exit_zero_on_detected_problem` at gate scope for slice 2: every failure branch in the gate cluster inspected returns nonzero (receipts above); the two exit-0-after-detection instances found are R2-P2-002 (unreadable input counted clean) and R2-P2-001 (advisory helper's documented always-0 contract).

### `exit_zero_on_detected_problem` for this slice: every failure branch inspected returns nonzero (1/2/3/69/75); the exit-0 paths are documented no-ops (`--auto`, kill switches, --warn-only). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `exit_zero_on_detected_problem` for this slice: every failure branch inspected returns nonzero (1/2/3/69/75); the exit-0 paths are documented no-ops (`--auto`, kill switches, --warn-only).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `exit_zero_on_detected_problem` for this slice: every failure branch inspected returns nonzero (1/2/3/69/75); the exit-0 paths are documented no-ops (`--auto`, kill switches, --warn-only).

### A documented option the parser rejects: none in this slice; every header/usage item in the reviewed files is accepted by its parser (verified for verify-authority and score-fanout-pairs by execution, for the rest by read). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A documented option the parser rejects: none in this slice; every header/usage item in the reviewed files is accepted by its parser (verified for verify-authority and score-fanout-pairs by execution, for the rest by read).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A documented option the parser rejects: none in this slice; every header/usage item in the reviewed files is accepted by its parser (verified for verify-authority and score-fanout-pairs by execution, for the rest by read).

### apply-design-md.cjs:854-878 rejects unknown args (fail) and validates --forms/--out values; a URL positional is refused by name. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: apply-design-md.cjs:854-878 rejects unknown args (fail) and validates --forms/--out values; a URL positional is refused by name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: apply-design-md.cjs:854-878 rejects unknown args (fail) and validates --forms/--out values; a URL positional is refused by name.

### apply-diagram-tokens.cjs:47-78 reads only declared value flags, rejects everything else (line 61) and skips consumed values (line 63). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: apply-diagram-tokens.cjs:47-78 reads only declared value flags, rejects everything else (line 61) and skips consumed values (line 63).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: apply-diagram-tokens.cjs:47-78 reads only declared value flags, rejects everything else (line 61) and skips consumed values (line 63).

### audit_readmes.py always exits 0 on findings: an audit reporter by design, with no exit contract in its docstring and no hook/CI caller reading a failure exit. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: audit_readmes.py always exits 0 on findings: an audit reporter by design, with no exit contract in its docstring and no hook/CI caller reading a failure exit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: audit_readmes.py always exits 0 on findings: an audit reporter by design, with no exit contract in its docstring and no hook/CI caller reading a failure exit.

### child-identity and child-drift fail-closed branches 20/21 — correct as written apart from the unhandled-rc gap in R9-P2-005. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: child-identity and child-drift fail-closed branches 20/21 — correct as written apart from the unhandled-rc gap in R9-P2-005.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: child-identity and child-drift fail-closed branches 20/21 — correct as written apart from the unhandled-rc gap in R9-P2-005.

### cite-drift-scan.mjs:1188-1209 uses node:util parseArgs strict: true (unknown flags -> exit 2); its --advise always-0 behavior is documented (header lines 7-9). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: cite-drift-scan.mjs:1188-1209 uses node:util parseArgs strict: true (unknown flags -> exit 2); its --advise always-0 behavior is documented (header lines 7-9).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: cite-drift-scan.mjs:1188-1209 uses node:util parseArgs strict: true (unknown flags -> exit 2); its --advise always-0 behavior is documented (header lines 7-9).

### Class 2 (a script detecting a problem but exiting 0) in this slice: no instance found; detected failures exit non-zero (synthesis-closeout exitCode 2, verify-authority 2, verify-iteration 1/2, argparse unknown-option exit 2, score-fanout-pairs refusal exit 2). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Class 2 (a script detecting a problem but exiting 0) in this slice: no instance found; detected failures exit non-zero (synthesis-closeout exitCode 2, verify-authority 2, verify-iteration 1/2, argparse unknown-option exit 2, score-fanout-pairs refusal exit 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Class 2 (a script detecting a problem but exiting 0) in this slice: no instance found; detected failures exit non-zero (synthesis-closeout exitCode 2, verify-authority 2, verify-iteration 1/2, argparse unknown-option exit 2, score-fanout-pairs refusal exit 2).

### Class 2 doc/parser mismatches: every usage/help string checked (hvr_scan usage block, stamp-branch usage, validate-message usage, worktree-naming usage, git-message-gate header) maps to an implemented option. No documented-but-rejected option found in this slice. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Class 2 doc/parser mismatches: every usage/help string checked (hvr_scan usage block, stamp-branch usage, validate-message usage, worktree-naming usage, git-message-gate header) maps to an implemented option. No documented-but-rejected option found in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Class 2 doc/parser mismatches: every usage/help string checked (hvr_scan usage block, stamp-branch usage, validate-message usage, worktree-naming usage, git-message-gate header) maps to an implemented option. No documented-but-rejected option found in this slice.

### Class 2 for the strict-parser cluster: every failure branch inspected returns 1/2 (dist-freshness stale exits 69). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Class 2 for the strict-parser cluster: every failure branch inspected returns 1/2 (dist-freshness stale exits 69).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Class 2 for the strict-parser cluster: every failure branch inspected returns 1/2 (dist-freshness stale exits 69).

### Core `spec_code` / `checklist_evidence`: deferred — this is the correctness dimension; spec-doc claim checks belong to the traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core `spec_code` / `checklist_evidence`: deferred — this is the correctness dimension; spec-doc claim checks belong to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code` / `checklist_evidence`: deferred — this is the correctness dimension; spec-doc claim checks belong to the traceability iteration.

### Core `spec_code` / `checklist_evidence`: deferred — this is the security rotation of the silent-input sweep; spec-doc claim checks belong to the traceability iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `spec_code` / `checklist_evidence`: deferred — this is the security rotation of the silent-input sweep; spec-doc claim checks belong to the traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code` / `checklist_evidence`: deferred — this is the security rotation of the silent-input sweep; spec-doc claim checks belong to the traceability iteration.

### Core checklist_evidence: executed repros A1/A2, B, C1-C4, D1-D2, E1-E2, F1-F4 plus strict-parser controls; exit codes recorded (A1 1/1, B 0/0, C1 0, C2 0, C3 0/0, C4 64, D1 0, D2 0/0, E1 0/0, E2 0/0, F1 exit 2 rejected message, F2 all reject, F3 1/1, F4 0/0). Both P1 findings carry fenced claim-adjudication blocks. Scripts that sync/publish/apply were not executed: sync-*.cjs, process-sweep apply, generate-trigger-index publish mode. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Core checklist_evidence: executed repros A1/A2, B, C1-C4, D1-D2, E1-E2, F1-F4 plus strict-parser controls; exit codes recorded (A1 1/1, B 0/0, C1 0, C2 0, C3 0/0, C4 64, D1 0, D2 0/0, E1 0/0, E2 0/0, F1 exit 2 rejected message, F2 all reject, F3 1/1, F4 0/0). Both P1 findings carry fenced claim-adjudication blocks. Scripts that sync/publish/apply were not executed: sync-*.cjs, process-sweep apply, generate-trigger-index publish mode.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: executed repros A1/A2, B, C1-C4, D1-D2, E1-E2, F1-F4 plus strict-parser controls; exit codes recorded (A1 1/1, B 0/0, C1 0, C2 0, C3 0/0, C4 64, D1 0, D2 0/0, E1 0/0, E2 0/0, F1 exit 2 rejected message, F2 all reject, F3 1/1, F4 0/0). Both P1 findings carry fenced claim-adjudication blocks. Scripts that sync/publish/apply were not executed: sync-*.cjs, process-sweep apply, generate-trigger-index publish mode.

### Core checklist_evidence: not applicable — no checklist governs CLI flag sets or exit codes in this packet. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Core checklist_evidence: not applicable — no checklist governs CLI flag sets or exit codes in this packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: not applicable — no checklist governs CLI flag sets or exit codes in this packet.

### Core checklist_evidence: not applicable to this slice (no checklist governs CLI flags or exit codes). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core checklist_evidence: not applicable to this slice (no checklist governs CLI flags or exit codes).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: not applicable to this slice (no checklist governs CLI flags or exit codes).

### Core checklist_evidence: the 3 P1 findings carry fenced claim-adjudication blocks; 9 executed repros (A, A2, B, C, C2, D, E, F, G) plus 2 strict-parser controls (I, J) recorded with exit codes; init-skill-graph.sh is code-read-only with the reason stated. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Core checklist_evidence: the 3 P1 findings carry fenced claim-adjudication blocks; 9 executed repros (A, A2, B, C, C2, D, E, F, G) plus 2 strict-parser controls (I, J) recorded with exit codes; init-skill-graph.sh is code-read-only with the reason stated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: the 3 P1 findings carry fenced claim-adjudication blocks; 9 executed repros (A, A2, B, C, C2, D, E, F, G) plus 2 strict-parser controls (I, J) recorded with exit codes; init-skill-graph.sh is code-read-only with the reason stated.

### Core protocols (spec_code, checklist_evidence): not applicable — this slice contains implementation CLI scripts with no spec document making per-line code claims, and no tasks.md/checklist items reference these files. Every finding is backed by an executed repro or, where execution is barred (git-invoking `template-phrase-lint.mjs`), an explicit code-read proof. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Core protocols (spec_code, checklist_evidence): not applicable — this slice contains implementation CLI scripts with no spec document making per-line code claims, and no tasks.md/checklist items reference these files. Every finding is backed by an executed repro or, where execution is barred (git-invoking `template-phrase-lint.mjs`), an explicit code-read proof.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core protocols (spec_code, checklist_evidence): not applicable — this slice contains implementation CLI scripts with no spec document making per-line code claims, and no tasks.md/checklist items reference these files. Every finding is backed by an executed repro or, where execution is barred (git-invoking `template-phrase-lint.mjs`), an explicit code-read proof.

### Core spec_code: 7 of 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); R8-P2-002 is the slice's single Class 2 instance (detected error reported on stderr, exit 0). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Core spec_code: 7 of 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); R8-P2-002 is the slice's single Class 2 instance (detected error reported on stderr, exit 0).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: 7 of 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); R8-P2-002 is the slice's single Class 2 instance (detected error reported on stderr, exit 0).

### Core spec_code: all 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); zero Class 2 instances found in this slice. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Core spec_code: all 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); zero Class 2 instances found in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: all 8 findings map to Class 1 of the sweep charter (unknown/misspelled option silently accepted); zero Class 2 instances found in this slice.

### Core spec_code: deferred — slice scripts are CLI implementations; findings were traced to the skill/hook surfaces that invoke them (below). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core spec_code: deferred — slice scripts are CLI implementations; findings were traced to the skill/hook surfaces that invoke them (below).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: deferred — slice scripts are CLI implementations; findings were traced to the skill/hook surfaces that invoke them (below).

### Core spec_code: deferred — this is a CLI-configuration sweep; the slice scripts are implementations and the sweep charter is the defect definition (exhausted direction, not retried). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Core spec_code: deferred — this is a CLI-configuration sweep; the slice scripts are implementations and the sweep charter is the defect definition (exhausted direction, not retried).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: deferred — this is a CLI-configuration sweep; the slice scripts are implementations and the sweep charter is the defect definition (exhausted direction, not retried).

### core_checklist_evidence: not-applicable — no checklist governs CLI flags/exit codes in this packet. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: core_checklist_evidence: not-applicable — no checklist governs CLI flags/exit codes in this packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core_checklist_evidence: not-applicable — no checklist governs CLI flags/exit codes in this packet.

### core_spec_code: deferred — the slice scripts are CLI implementations; no spec item governs their flag sets or exit codes; the sweep charter is the defect definition. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: core_spec_code: deferred — the slice scripts are CLI implementations; no spec item governs their flag sets or exit codes; the sweep charter is the defect definition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core_spec_code: deferred — the slice scripts are CLI implementations; no spec item governs their flag sets or exit codes; the sweep charter is the defect definition.

### core: checklist_evidence — repros A1/A2, B1/B2, C, D, E (repo + copy), F (verbatim snippet + xtrace) executed from the repo root; exit codes recorded. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: core: checklist_evidence — repros A1/A2, B1/B2, C, D, E (repo + copy), F (verbatim snippet + xtrace) executed from the repo root; exit codes recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core: checklist_evidence — repros A1/A2, B1/B2, C, D, E (repo + copy), F (verbatim snippet + xtrace) executed from the repo root; exit codes recorded.

### core: spec_code — charter Class 1: R9-P1-001, R9-P2-001, R9-P2-002, R9-P2-003; charter Class 2: R9-P2-002 (unreadable counted checked), R9-P2-004, R9-P2-005. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: core: spec_code — charter Class 1: R9-P1-001, R9-P2-001, R9-P2-002, R9-P2-003; charter Class 2: R9-P2-002 (unreadable counted checked), R9-P2-004, R9-P2-005.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core: spec_code — charter Class 1: R9-P1-001, R9-P2-001, R9-P2-002, R9-P2-003; charter Class 2: R9-P2-002 (unreadable counted checked), R9-P2-004, R9-P2-005.

### Documented option rejected or never read: no instance across the 33 files; --validate-verbose is read at check-prerequisites.sh:141, --auto-upgrade is explicitly rejected with a message at check-template-staleness.sh:39. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Documented option rejected or never read: no instance across the 33 files; --validate-verbose is read at check-prerequisites.sh:141, --auto-upgrade is explicitly rejected with a message at check-template-staleness.sh:39.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Documented option rejected or never read: no instance across the 33 files; --validate-verbose is read at check-prerequisites.sh:141, --auto-upgrade is explicitly rejected with a message at check-template-staleness.sh:39.

### documented_option_rejected_by_parser: the usage/help texts checked (check-contract-drift --command/--accept-compiled-drift; compile-command-contracts --command; reduce-state positional + four flags; check-ledger-stem-producers --repo-root) all map to parsed options. No instance found. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: documented_option_rejected_by_parser: the usage/help texts checked (check-contract-drift --command/--accept-compiled-drift; compile-command-contracts --command; reduce-state positional + four flags; check-ledger-stem-producers --repo-root) all map to parsed options. No instance found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: documented_option_rejected_by_parser: the usage/help texts checked (check-contract-drift --command/--accept-compiled-drift; compile-command-contracts --command; reduce-state positional + four flags; check-ledger-stem-producers --repo-root) all map to parsed options. No instance found.

### Documented-option-rejected-or-unread: none in this slice — generate-context HELP_TEXT options are all read; dist-freshness usage maps to :940-966; the retrieval trio usage blocks and retrofit-convention's header match their parsers. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Documented-option-rejected-or-unread: none in this slice — generate-context HELP_TEXT options are all read; dist-freshness usage maps to :940-966; the retrieval trio usage blocks and retrofit-convention's header match their parsers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Documented-option-rejected-or-unread: none in this slice — generate-context HELP_TEXT options are all read; dist-freshness usage maps to :940-966; the retrieval trio usage blocks and retrofit-convention's header match their parsers.

### exit_zero_on_detected_problem (all 17 files): every inspected failure branch returns nonzero — checkers 1 or 2, render --check 1, reduce-state 2 or 3, fanout-run 2 or 3, fanout-merge 1 or 3, append gateway 2, append-state-record 1. No instance found. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: exit_zero_on_detected_problem (all 17 files): every inspected failure branch returns nonzero — checkers 1 or 2, render --check 1, reduce-state 2 or 3, fanout-run 2 or 3, fanout-merge 1 or 3, append gateway 2, append-state-record 1. No instance found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: exit_zero_on_detected_problem (all 17 files): every inspected failure branch returns nonzero — checkers 1 or 2, render --check 1, reduce-state 2 or 3, fanout-run 2 or 3, fanout-merge 1 or 3, append gateway 2, append-state-record 1. No instance found.

### extract-refero.mjs:62-75 throws 'unknown flag: <t>'; the argparse scripts (drawio_extract.py:928-942, mermaid_extract.py:1383-1396, extract_structure.py:1251-1258, check_authored_name_kebab.py:58-67, check_no_new_snake_case.py:362-367) reject unknown options with exit 2. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: extract-refero.mjs:62-75 throws 'unknown flag: <t>'; the argparse scripts (drawio_extract.py:928-942, mermaid_extract.py:1383-1396, extract_structure.py:1251-1258, check_authored_name_kebab.py:58-67, check_no_new_snake_case.py:362-367) reject unknown options with exit 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: extract-refero.mjs:62-75 throws 'unknown flag: <t>'; the argparse scripts (drawio_extract.py:928-942, mermaid_extract.py:1383-1396, extract_structure.py:1251-1258, check_authored_name_kebab.py:58-67, check_no_new_snake_case.py:362-367) reject unknown options with exit 2.

### git-message-gate.mjs fail-open on unparseable stdin/commands is a documented contract ("A command it cannot parse ... is allowed"), backed by the commit-msg/pre-push hooks; not filed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: git-message-gate.mjs fail-open on unparseable stdin/commands is a documented contract ("A command it cannot parse ... is allowed"), backed by the commit-msg/pre-push hooks; not filed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: git-message-gate.mjs fail-open on unparseable stdin/commands is a documented contract ("A command it cannot parse ... is allowed"), backed by the commit-msg/pre-push hooks; not filed.

### Nested-dispatch / out-of-scope mutation: none attempted; no scope violations. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: Nested-dispatch / out-of-scope mutation: none attempted; no scope violations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Nested-dispatch / out-of-scope mutation: none attempted; no scope violations.

### Overlay `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not checked this iteration. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: Overlay `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not checked this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not checked this iteration.

### Overlay `skill_agent`: partial — confirmed `.skilled/bin/check-agent-mirror-sync.cjs` is wired to pre-commit (`.skilled/hooks/git/pre-commit:82`) and CI (`--all`, `.skilled/bin/README.md:167`), which is what raises R1-P1-001 above advisory. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `skill_agent`: partial — confirmed `.skilled/bin/check-agent-mirror-sync.cjs` is wired to pre-commit (`.skilled/hooks/git/pre-commit:82`) and CI (`--all`, `.skilled/bin/README.md:167`), which is what raises R1-P1-001 above advisory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: partial — confirmed `.skilled/bin/check-agent-mirror-sync.cjs` is wired to pre-commit (`.skilled/hooks/git/pre-commit:82`) and CI (`--all`, `.skilled/bin/README.md:167`), which is what raises R1-P1-001 above advisory.

### Overlay `skill_agent`: partial — confirmed the hygiene gate's pre-commit wiring (`.skilled/scripts/git-hooks/pre-commit:97`, `.skilled/hooks/git/pre-commit:29`), which is what keeps R2-P2-002 above a standalone-helper nit; confirmed no hook/CI caller for render-screenshots.cjs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `skill_agent`: partial — confirmed the hygiene gate's pre-commit wiring (`.skilled/scripts/git-hooks/pre-commit:97`, `.skilled/hooks/git/pre-commit:29`), which is what keeps R2-P2-002 above a standalone-helper nit; confirmed no hook/CI caller for render-screenshots.cjs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: partial — confirmed the hygiene gate's pre-commit wiring (`.skilled/scripts/git-hooks/pre-commit:97`, `.skilled/hooks/git/pre-commit:29`), which is what keeps R2-P2-002 above a standalone-helper nit; confirmed no hook/CI caller for render-screenshots.cjs.

### Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature catalogs or playbook references in the reviewed files). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature catalogs or playbook references in the reviewed files).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature catalogs or playbook references in the reviewed files).

### Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature-catalog or playbook references in the reviewed files). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature-catalog or playbook references in the reviewed files).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime / feature_catalog_code / playbook_capability: not applicable in this slice (no agent definitions, feature-catalog or playbook references in the reviewed files).

### Overlay agent_cross_runtime: partial — .github/workflows/advisory-checks.yml:44 invokes the .opencode mirror of the reviewed validate-doc-model-refs.js; mirror drift was not exercised. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay agent_cross_runtime: partial — .github/workflows/advisory-checks.yml:44 invokes the .opencode mirror of the reviewed validate-doc-model-refs.js; mirror drift was not exercised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime: partial — .github/workflows/advisory-checks.yml:44 invokes the .opencode mirror of the reviewed validate-doc-model-refs.js; mirror drift was not exercised.

### Overlay agent_cross_runtime: partial — no mirror copy of the slice scripts was exercised; rg found no hook/CI invocation of the review/render scripts in the searched surfaces. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Overlay agent_cross_runtime: partial — no mirror copy of the slice scripts was exercised; rg found no hook/CI invocation of the review/render scripts in the searched surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime: partial — no mirror copy of the slice scripts was exercised; rg found no hook/CI invocation of the review/render scripts in the searched surfaces.

### Overlay feature_catalog_code, playbook_capability: not checked this iteration. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Overlay feature_catalog_code, playbook_capability: not checked this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code, playbook_capability: not checked this iteration.

### Overlay feature_catalog_code: not checked this iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay feature_catalog_code: not checked this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code: not checked this iteration.

### Overlay playbook_capability: partial — the sk-design-diagram capture-review playbook references the corpus check. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay playbook_capability: partial — the sk-design-diagram capture-review playbook references the corpus check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay playbook_capability: partial — the sk-design-diagram capture-review playbook references the corpus check.

### Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not applicable to a code sweep; skill surfaces appear only as callers (e.g. `scaffold-debug-delegation.sh:138` renders through the inline-gate wrapper) and were cited as context, not checked. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not applicable to a code sweep; skill surfaces appear only as callers (e.g. `scaffold-debug-delegation.sh:138` renders through the inline-gate wrapper) and were cited as context, not checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not applicable to a code sweep; skill surfaces appear only as callers (e.g. `scaffold-debug-delegation.sh:138` renders through the inline-gate wrapper) and were cited as context, not checked.

### Overlay skill_agent: checked — .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38 routes versioned skill docs to check-frontmatter-versions.sh with an exit1 gate (.skilled/hooks/post-edit-quality/README.md:50); sk-design-diagram/SKILL.md:272 and :390 require check-diagram-corpus.cjs (with --extra over external deliveries) to print RESULT: PASSED; references/guided-run.md:63 documents the guided-run invocation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay skill_agent: checked — .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38 routes versioned skill docs to check-frontmatter-versions.sh with an exit1 gate (.skilled/hooks/post-edit-quality/README.md:50); sk-design-diagram/SKILL.md:272 and :390 require check-diagram-corpus.cjs (with --extra over external deliveries) to print RESULT: PASSED; references/guided-run.md:63 documents the guided-run invocation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: checked — .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38 routes versioned skill docs to check-frontmatter-versions.sh with an exit1 gate (.skilled/hooks/post-edit-quality/README.md:50); sk-design-diagram/SKILL.md:272 and :390 require check-diagram-corpus.cjs (with --extra over external deliveries) to print RESULT: PASSED; references/guided-run.md:63 documents the guided-run invocation.

### Overlay skill_agent: checked — loop-lock is invoked by the deep-* workflow YAML assets; query.cjs by the doctor route; convergence.cjs named by the doctor deep-loop doc. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Overlay skill_agent: checked — loop-lock is invoked by the deep-* workflow YAML assets; query.cjs by the doctor route; convergence.cjs named by the doctor deep-loop doc.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: checked — loop-lock is invoked by the deep-* workflow YAML assets; query.cjs by the doctor route; convergence.cjs named by the doctor deep-loop doc.

### Overlay skill_agent: consumer links verified — skill_advisor.py:617-619 invokes derive-command-bridges.cjs --check; init-skill-graph.sh:80 invokes skill_advisor.py --health; init-skill-graph.sh:77 invokes skill_graph_compiler.py --export-json, matching the parser definition at skill_graph_compiler.py:1072. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Overlay skill_agent: consumer links verified — skill_advisor.py:617-619 invokes derive-command-bridges.cjs --check; init-skill-graph.sh:80 invokes skill_advisor.py --health; init-skill-graph.sh:77 invokes skill_graph_compiler.py --export-json, matching the parser definition at skill_graph_compiler.py:1072.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: consumer links verified — skill_advisor.py:617-619 invokes derive-command-bridges.cjs --check; init-skill-graph.sh:80 invokes skill_advisor.py --health; init-skill-graph.sh:77 invokes skill_graph_compiler.py --export-json, matching the parser definition at skill_graph_compiler.py:1072.

### Overlay skill_agent: consumer surfaces verified — markdown-link CI guard (.github/workflows/markdown-link-integrity.yml:45-59), pre-commit hermes mirrors (.skilled/scripts/git-hooks/pre-commit:273-274), save pipeline callers (speckit-save-context-tail.yaml:16; deep-review-auto.yaml:2404; deep-research-auto.yaml:2356; deep-ai-council-auto.yaml:212), dist-freshness consumers (.skilled/bin/skill-advisor.cjs:24). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Overlay skill_agent: consumer surfaces verified — markdown-link CI guard (.github/workflows/markdown-link-integrity.yml:45-59), pre-commit hermes mirrors (.skilled/scripts/git-hooks/pre-commit:273-274), save pipeline callers (speckit-save-context-tail.yaml:16; deep-review-auto.yaml:2404; deep-research-auto.yaml:2356; deep-ai-council-auto.yaml:212), dist-freshness consumers (.skilled/bin/skill-advisor.cjs:24).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: consumer surfaces verified — markdown-link CI guard (.github/workflows/markdown-link-integrity.yml:45-59), pre-commit hermes mirrors (.skilled/scripts/git-hooks/pre-commit:273-274), save pipeline callers (speckit-save-context-tail.yaml:16; deep-review-auto.yaml:2404; deep-research-auto.yaml:2356; deep-ai-council-auto.yaml:212), dist-freshness consumers (.skilled/bin/skill-advisor.cjs:24).

### overlay_agent_cross_runtime: partial — routing-registry-drift.yml runs the .opencode mirrors of the ci-* gates; the .skilled copies reviewed here are canonical. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: overlay_agent_cross_runtime: partial — routing-registry-drift.yml runs the .opencode mirrors of the ci-* gates; the .skilled copies reviewed here are canonical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay_agent_cross_runtime: partial — routing-registry-drift.yml runs the .opencode mirrors of the ci-* gates; the .skilled copies reviewed here are canonical.

### overlay_feature_catalog_code: not-checked. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: overlay_feature_catalog_code: not-checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay_feature_catalog_code: not-checked.

### overlay_playbook_capability: not-checked. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: overlay_playbook_capability: not-checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay_playbook_capability: not-checked.

### overlay_skill_agent: checked — invocation surfaces verified by rg this iteration; see Integration Evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: overlay_skill_agent: checked — invocation surfaces verified by rg this iteration; see Integration Evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay_skill_agent: checked — invocation surfaces verified by rg this iteration; see Integration Evidence.

### overlay: agent_cross_runtime, feature_catalog_code, playbook_capability — not applicable in this slice. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: overlay: agent_cross_runtime, feature_catalog_code, playbook_capability — not applicable in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay: agent_cross_runtime, feature_catalog_code, playbook_capability — not applicable in this slice.

### overlay: skill_agent — callers verified by rg: rules/check-source-tags.sh:29; lib/shell-common.sh:48 and rules/check-graph-metadata-shape.sh:84 consume the is-phase-parent dist; rules/check-frontmatter-values.sh (Severity: warn); check-native-modules has no hook/CI caller (docs only). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: overlay: skill_agent — callers verified by rg: rules/check-source-tags.sh:29; lib/shell-common.sh:48 and rules/check-graph-metadata-shape.sh:84 consume the is-phase-parent dist; rules/check-frontmatter-values.sh (Severity: warn); check-native-modules has no hook/CI caller (docs only).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay: skill_agent — callers verified by rg: rules/check-source-tags.sh:29; lib/shell-common.sh:48 and rules/check-graph-metadata-shape.sh:84 consume the is-phase-parent dist; rules/check-frontmatter-values.sh (Severity: warn); check-native-modules has no hook/CI caller (docs only).

### Repo hygiene: `git status --porcelain` after all repros shows only the review packet (`?? …/review/`); every write landed under `$TMPDIR` scratch or the allowed review paths. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Repo hygiene: `git status --porcelain` after all repros shows only the review packet (`?? …/review/`); every write landed under `$TMPDIR` scratch or the allowed review paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repo hygiene: `git status --porcelain` after all repros shows only the review packet (`?? …/review/`); every write landed under `$TMPDIR` scratch or the allowed review paths.

### Repro discipline: no repository writes; git status showed only the pre-existing untracked review packet before and after. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Repro discipline: no repository writes; git status showed only the pre-existing untracked review packet before and after.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repro discipline: no repository writes; git status showed only the pre-existing untracked review packet before and after.

### Source tags cited in this narrative were resolved against the current worktree; paths and lines exist. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: Source tags cited in this narrative were resolved against the current worktree; paths and lines exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Source tags cited in this narrative were resolved against the current worktree; paths and lines exist.

### The "documented option the parser rejects" class: none found across the 26 files. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The "documented option the parser rejects" class: none found across the 26 files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The "documented option the parser rejects" class: none found across the 26 files.

### The inline-node "process.exit(0) after printing ERROR" pattern (two shape rules) — not Class 2; stdout is the contract, exit 0 protects set -e. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The inline-node "process.exit(0) after printing ERROR" pattern (two shape rules) — not Class 2; stdout is the contract, exit 0 protects set -e.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The inline-node "process.exit(0) after printing ERROR" pattern (two shape rules) — not Class 2; stdout is the contract, exit 0 protects set -e.

### Unknown-option rejection is intact across the seven MCP installer scripts, `doctor.sh`, `daemon.sh`, `connect-yolo.sh`, `route-validate.sh`, `skill-graph-freshness.cjs`, and both python argparse CLIs; no Class 1 instance exists in that cluster. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Unknown-option rejection is intact across the seven MCP installer scripts, `doctor.sh`, `daemon.sh`, `connect-yolo.sh`, `route-validate.sh`, `skill-graph-freshness.cjs`, and both python argparse CLIs; no Class 1 instance exists in that cluster.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unknown-option rejection is intact across the seven MCP installer scripts, `doctor.sh`, `daemon.sh`, `connect-yolo.sh`, `route-validate.sh`, `skill-graph-freshness.cjs`, and both python argparse CLIs; no Class 1 instance exists in that cluster.

### Untrusted-content guard: no reviewed file contained instruction-like text aimed at the reviewer; nothing embedded was acted on. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Untrusted-content guard: no reviewed file contained instruction-like text aimed at the reviewer; nothing embedded was acted on.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Untrusted-content guard: no reviewed file contained instruction-like text aimed at the reviewer; nothing embedded was acted on.

### validate-flowchart.sh:15-29 exits 1 (usage) on a missing or non-file first argument. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: validate-flowchart.sh:15-29 exits 1 (usage) on a missing or non-file first argument.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: validate-flowchart.sh:15-29 exits 1 (usage) on a missing or non-file first argument.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## Iteration 008 addendum (maintainability, slice 8/10)
- Reviewed 32 system-spec-kit runtime CLI + system-skill-advisor script files for unknown-option acceptance and exit-0-on-detected-problem.
- New: R8-P1-001 generate-context.ts (unknown options swallowed; trailing --session-id/--planner-mode typos dropped, save proceeds; repro A1 byte-identical with/without the flag). R8-P1-002 smart-router-measurement.ts (--no-record-telemetry typo silently re-enables recording; repro F3). R8-P2-001 generate-command-routers.cjs (unknown flags ignored; a --write typo silently runs the check and reports clean, exit 0). R8-P2-002 dist-freshness.cjs (check/check-file error results exit 0 while stale exits 69; repros C1/C2). R8-P2-003 dist-freshness.cjs (unknown flags after the command token silently ignored; repro C3; command-position flag rejected, exit 64). R8-P2-004 check-markdown-links.cjs (unknown flags ignored by the CI link guard; --self-test typo silently substitutes the corpus check). R8-P2-005 smart-router-analyze.ts (argValue ignores unknown flags; --input/--output typos fall back to defaults; repro F4). R8-P2-006 process-sweep.ts + process-memory-harness.ts (flags after the subcommand silently ignored; repros E1/E2; unknown leading token rejected, exit 2).
- Strict parsers confirmed clean: doctor.sh, six sync-*.cjs, backfill-frontmatter, backfill-research-metadata, migrate-trigger-phrase-residual, backfill-graph-metadata, migrate-generated-json, generate-trigger-index.mjs, lookup-trigger-index.mjs, measure-cold-lookup.mjs, rg-wrapper.mjs, retrofit-convention.mjs.
- Verdict: CONDITIONAL. Next: slice 9 of 10 (orchestrator-assigned).

## Iteration 009 addendum (correctness, slice 9/10)
- Reviewed 33 system-spec-kit runtime CLI files (rules/, setup/, spec-folder/, spec/, retrieval sweep) for unknown-option acceptance and exit-0-on-detected-problem.
- New: R9-P1-001 generate-description.ts (unknown/misspelled flags silently ignored by the description.json writer; --descriptoin typo discards the caller text, exit 0; repro A1/A2). R9-P2-001 is-phase-parent.ts (unknown command and missing folder fall through runCli with exit 0; repro B1/B2). R9-P2-002 check-frontmatter-values-helper.cjs (stray flag consumed as a file path; unreadable inputs counted checked, exit 0; repro C). R9-P2-003 check-source-tags-helper.mjs (extra args ignored; repro D). R9-P2-004 check-native-modules.sh (prints [FAIL], exits 0; repro E repo + copy). R9-P2-005 check-graph-metadata-child-drift.sh (any scanner rc other than 9/20/21 returns pass; repro F verbatim snippet rc=1 + xtrace).
- Running counts after iteration 9: P0=0, P1=17, P2=47.
- Strict parsers confirmed clean: create.sh, archive.sh, heal-spec-docs.cjs, three sync-*.cjs, nested-changelog.ts, sweep-memory-residue.mjs, check-completion.sh, check-placeholders.sh, check-template-staleness.sh, progressive-validate.sh, check-prerequisites.sh, check-ac-closure.sh, check-ac-coverage.sh.
- Verdict: CONDITIONAL. Next: slice 10 of 10 (orchestrator-assigned).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: security (rotation). - Focus area: slice 7 of 10 (orchestrator-assigned). - Reason: stopPolicy=max-iterations; the sweep continues to iteration 10. - Rotation status: security slice 6 complete. - Blocked/productive carry-forward: none. - Required evidence: parser line, usage/header text and every exit path for the next slice's files. - Recovery note: not applicable.

<!-- /ANCHOR:next-focus -->
## Iteration 006 addendum (security, slice 6/10)
- Reviewed 17 system-deep-loop runtime/deep-review CLI scripts for unknown-option acceptance and exit-0-on-detected-problem.
- New P1s: R6-P1-001 loop-lock.cjs (unknown flags accepted; --ttl-ms typo writes ttl_ms 300000 while the workflows request 1800000; --bogus-xyz exit 0; repro in $TMPDIR). R6-P1-002 render-contract-snapshot.cjs (a --check typo takes the write path and rewrites the tracked snapshot; observed with fs write stubs, exit 0). R6-P1-003 query.cjs and R6-P1-004 convergence.cjs (misspelled --read-only silently skips the in-memory read-only open; convergence also appends observability events; code-read only, execution withheld because the write path would create .skilled/skills/system-deep-loop/database/deep-loop-graph.sqlite). R6-P1-005 append-state-record.cjs (a flag-shaped token becomes the target path; record appended to --bogus-xyz, exit 0).
- New P2s: R6-P2-001 the three read-only checkers ignore unknown flags (and valueless --dir); R6-P2-002 fanout-merge/fanout-run ignore unknown flags; R6-P2-003 check-ledger-stem-producers valueless --repo-root falls back to the default tree; R6-P2-004 codex-dispatch manual path ignores unknown flags.
- Clean parsers (unknown-flag rejection intact): append-mode-event, check-direct-append, check-contract-drift, compile-command-contracts, reduce-state, and check-ledger-stem-producers apart from the valueless value flag.
- Ruled out for all 17: exit-0-on-detected-problem and documented-option-rejected-by-parser.
- Verdict: CONDITIONAL. Next: slice 7 of 10 (orchestrator-assigned).

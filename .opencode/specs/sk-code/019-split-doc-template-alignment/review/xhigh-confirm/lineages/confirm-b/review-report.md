# Deep Review Report: confirm-b

## Executive Summary

**Verdict: FAIL**

The detached confirmation lineage completed all four configured dimensions and reached the required `max-iterations` ceiling. Current resource conformance is strong: 163/163 target Markdown paths pass the generic validator; the independent matrix finds no metadata, version, filename, Overview-order, mode-section, numbering, Related Resources, lowercase-trigger, intro/Purpose-containment, or renamed-link regression; the four xHigh structural fixes and two sibling-020 security fixes remain present.

Release readiness still fails because the hard `checklist_evidence` protocol does not pass. Fresh strict validation exits 1 and enumerates 25 completed rows without command/artifact evidence. The active registry is P0=0, P1=1, P2=2; `hasAdvisories=true`.

- Review target: `.opencode/specs/sk-code/019-split-doc-template-alignment`
- Session: `fanout-confirm-b-1783921047347-ky9ry5`
- Executor: `cli-opencode`, `openai/gpt-5.6-sol-fast`
- Iterations: 4/4
- Stop reason: `maxIterationsReached`
- Resource-map gate: skipped because no source `resource-map.md` existed at init

## Planning Trigger

Route to `/speckit:plan` because a required hard protocol fails. The smallest required workstream is packet-evidence closure for F002; F001 and F003 are advisory follow-ups and do not independently block release.

## Active Finding Registry

### F002 [P1] Completed rows lack required evidence

- Dimension: traceability
- File: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-60`
- Evidence: the checklist promises command/result evidence, while fresh strict validation identifies 14 checklist and 11 task rows as `UNSPECIFIED` and reports no concrete verification command/artifact in the implementation summary [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-54`] [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:71-86`].
- Impact: `checklist_evidence` remains failed and strict packet validation exits 1, so the review quality gate cannot pass.
- Finding class: `matrix/evidence`
- Scope proof: the validator enumerated the complete 25-row matrix.
- Adjudication: P1 retained at confidence 0.99 after replaying the green resource checks and the packet's historical Errors: 0 acceptance rationale.
- Recommendation: cite a concrete command or artifact on each completed row, add a summary verification artifact, and rerun strict validation to exit 0.

### F001 [P2] Seven lexical paths exceed the intro sentence limit

- Dimension: correctness
- File: `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md:14-20`
- Evidence: the shared debug/implement/verify references use three-sentence intros through both surface symlink paths, and the CSS quality reference does the same [SOURCE: `.opencode/skills/sk-code/code-webflow/references/css/quality_standards/patterns_and_naming_enforcement.md:17-23`]. R3 and the reference template specify one or two sentences [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`] [SOURCE: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:56-87`].
- Impact: bounded template polish across seven lexical paths/four resolved documents.
- Finding class: `class-of-bug`
- Recommendation: compress the four resolved intros without changing substantive content.

### F003 [P2] Packet 019 carries a follow-up already closed by packet 020

- Dimension: traceability
- File: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:91-93`
- Evidence: packet 019 still recommends fixing the cookie, CDN loader, and generic When-to-Use classes; packet 020 records those exact classes complete and validated [SOURCE: `.opencode/specs/sk-code/020-content-quality-remediation/implementation-summary.md:37-77`].
- Impact: stale resume/continuity guidance, not a current resource defect.
- Finding class: `cross-consumer`
- Recommendation: mark the follow-up closed by sibling packet 020 while preserving the history.

## Remediation Workstreams

1. **Required evidence closure (F002):** add evidence citations to 25 completed rows, add a concrete verification artifact to the summary, and obtain strict exit 0.
2. **Intro polish (F001):** compress four resolved intros and replay the 163-path opening-shape matrix.
3. **Continuity reconciliation (F003):** link the completed sibling 020 outcome from packet 019.

## Spec Seed

- Make the completion-evidence criterion explicit: every checked task/checklist row identifies a command, commit, or artifact.
- Preserve the existing one-to-two-sentence intro requirement and add it to the deterministic matrix because `validate_document.py` does not enforce it.
- Record packet 020 as the closed owner of the out-of-scope content-quality follow-up.

## Plan Seed

1. Annotate all 25 completed rows with concise, auditable evidence.
2. Add the exact validator/matrix commands or a durable verification artifact to `implementation-summary.md`.
3. Run `validate.sh <packet> --strict --verbose` until it exits 0.
4. Optionally close F001 and F003 in the same documentation-only pass, then rerun the intro and continuity checks.

## Traceability Status

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | hard | partial | Main R1-R5 outcomes pass current replay; F001 is a bounded advisory R3 mismatch. |
| `checklist_evidence` | hard | fail | F002; 25 completed rows are uncited and strict validation exits 1. |
| `feature_catalog_code` | advisory | notApplicable | No feature catalog is in target scope. |
| `playbook_capability` | advisory | notApplicable | No executable playbook capability is claimed. |

`AC_COVERAGE` is disabled and advisory. It does not affect this verdict.

## Deferred Items

- F001 and F003 are non-blocking advisories.
- The illustrative absolute `/specs/005-example.com/...` link remains a documented, pre-existing non-navigational example and is not a renamed-file regression.
- The generic validator's permissive no-numbered-H2 branch remains a validator-hardening opportunity outside this lineage.
- Memory retrieval timed out twice; canonical packet docs and current repository evidence were used.

## Audit Appendix

### Iteration Replay

| Iteration | Dimension | New ratio | New findings | Iteration verdict |
|---:|---|---:|---|---|
| 1 | correctness | 1.0000 | F001 (P2) | PASS |
| 2 | security | 0.0000 | none | PASS |
| 3 | traceability | 0.8571 | F002 (P1), F003 (P2) | CONDITIONAL |
| 4 | maintainability/stabilization | 0.0000 | none | CONDITIONAL |

### Gate Replay

| Gate | Result | Evidence |
|---|---|---|
| Config/lineage | pass | Session, generation, artifact boundary, and iteration count agree. |
| State integrity | pass | Four narratives, four canonical deltas, and four JSONL iteration records validate mechanically. |
| Evidence density | pass | Every active finding has current file:line evidence; F002 has typed adjudication. |
| Scope | pass | Target files remained read-only; all writes stayed under `confirm-b`. |
| Dimension coverage | pass | Correctness, security, traceability, and maintainability each received one pass. |
| `spec_code` | partial | F001 remains advisory. |
| `checklist_evidence` | **fail** | F002; 25 uncited completed rows and strict exit 1. |
| P0 resolution | pass | Active P0=0. |
| Claim adjudication | pass | Active P1 F002 has a complete typed packet. |

### Mechanical Evidence

- `validate_document.py`: 163/163 exit 0 using matching reference/asset type.
- Tracked inventory: 163 lexical paths, 160 resolved documents because six paths are three symlink pairs.
- Independent structural matrix: zero active P1 structural regressions; one P2 intro-length class.
- Renamed-link scan: no broken relative navigational link in the target corpus; one documented illustrative absolute path excluded.
- Strict packet validation: Errors 0, Warnings 5, exit 1.
- Artifact root was bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not executed.
- The shared reducer CLI was not invoked because it has no lineage artifact-dir parameter and would resolve the shared review root. Reducer-equivalent registry, dashboard, and strategy outputs were written only inside this detached lineage.

### Final Decision

The hard iteration ceiling permits synthesis but does not hide failed gates. `checklist_evidence` fails, therefore the final verdict is **FAIL** under the review-mode contract.

# Deep Review Report: sk-code/018 Rust Standards and Reference Hygiene

## Executive Summary

- **Verdict:** FAIL
- **Release readiness:** release-blocking
- **Stop reason:** maxIterationsReached
- **Iterations:** 7/7
- **Dimension coverage:** 4/4
- **Active findings:** P0=1, P1=2, P2=1
- **hasAdvisories:** true

The Rust router and its narrow deterministic gates are healthy: the three router guards pass 21/21, all six language folders resolve, and the 15 alignment-verifier tests pass. Release is nevertheless blocked because the packet is marked Complete while current recursive strict validation reports enforced errors. The reference-hygiene work also left broken authored links and stale code-quality benchmark gold.

## Planning Trigger

Route to remediation planning. F001 is a hard completion-gate contradiction and forces FAIL. F002 and F003 are required fixes because they break active documentation navigation and benchmark traceability. F004 is advisory cleanup.

## Active Finding Registry

### F001, P0, Traceability

**Completed packet fails its mandatory strict validation gate.** The parent declares Complete [SOURCE: `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/spec.md:54`], while current recursive strict validation fails. The root reports enforced frontmatter/generated-metadata integrity and drift errors. `description.json` still describes the pre-WS2 Rust-only packet and omits the current shape [SOURCE: `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/description.json:2-24`]. Child 011 graph metadata says `in_progress` despite authored Complete status [SOURCE: `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/011-code-quality-and-flagged/graph-metadata.json:35-42`].

### F002, P1, Maintainability

**Reference splits left broken markdown links across shipped sk-code docs.** `error_recovery.md` still links to deleted `minification_guide.md` and `debugging_workflows.md` monoliths [SOURCE: `.opencode/skills/sk-code/code-webflow/references/debugging/error_recovery.md:113-114`]. The repository checker found 154 broken links overall, with a substantial `sk-code` cluster tied to phases 008-011 split targets. This contradicts phase 010's no-deleted-path and link-clean criteria [SOURCE: `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/010-code-webflow-other-references/spec.md:77-89`].

### F003, P1, Traceability

**Code-quality benchmark gold still names the deleted checklist path.** CQ-001 expects `assets/code_quality_checklist.md` [SOURCE: `.opencode/skills/sk-code/code-quality/manual_testing_playbook/quality-gate/quality-checklist.md:7`], while the router emits split part files [SOURCE: `.opencode/skills/sk-code/code-quality/SKILL.md:147-159`]. The active benchmark scenario cannot match its own live router contract.

### F004, P2, Maintainability

**WS2 rollup overstates the number of generated parts.** Phase 012 says `~120`, but its table totals 104 (21+20+29+31+3) [SOURCE: `.opencode/specs/sk-code/018-rust-standards-for-code-opencode/012-gate-verification-rollup/implementation-summary.md:39-47`].

## Remediation Workstreams

1. **Completion metadata and validation:** regenerate/reconcile parent and child metadata, resolve frontmatter and evidence errors, then require recursive strict exit 0 before Complete.
2. **Reference navigation:** run the markdown-link checker against `sk-code`, map every deleted monolith href to the appropriate part or directory landing page, and verify zero packet-attributable breakage.
3. **Benchmark contract:** update CQ-001 expected resources to the current split checklist set and rerun code-quality Mode-A scoring.
4. **Rollup precision:** replace `~120` with the verified count or explain additional parts not represented in the phase table.

## Spec Seed

- Add an explicit success criterion requiring current recursive strict validation exit 0, not merely zero counted errors under an older warning policy.
- Expand the hygiene gate from part-internal links to all active authored links under affected `sk-code` surfaces.
- Include each changed surface's active playbook gold in the deterministic rewire gate.

## Plan Seed

1. Refresh parent and child 011 metadata with the canonical generator; fix remaining strict errors across children 006 and 011.
2. Capture a scoped broken-link baseline for `sk-code`, rewire deleted-path hrefs, and rerun to zero attributable failures.
3. Replace CQ-001's deleted expected resource with the intended current checklist parts; run deterministic benchmark verification.
4. Reconcile rollup counts and rerun the three existing router guards plus strict packet validation.

## Traceability Status

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| spec_code | hard | fail | F001-F003 |
| checklist_evidence | hard | partial | Recursive validator reports completed items without evidence |
| feature_catalog_code | advisory | N/A | No feature catalog in target |
| playbook_capability | advisory | fail | F003 |

`AC_COVERAGE` was disabled by runtime policy, so no advisory covered/total floor was available.

## Deferred Items

- F004 is advisory and may be fixed with the remediation documentation pass.
- The paid WS2 Mode-B re-baseline remains a follow-up, but it does not replace deterministic repair of CQ-001.
- Repository-wide broken links outside the packet's `sk-code` scope were not classified by this review.

## Audit Appendix

### Verification Evidence

| Check | Result |
|---|---|
| Router guards from owning script directory | PASS, 3 files / 21 tests |
| `verify_stack_folders.py` | PASS, six languages |
| `test_verify_alignment_drift.py` | PASS, 15 tests |
| Recursive strict packet validation | FAIL, enforced errors at parent and children |
| Markdown-link checker | FAIL, 154 repository-wide broken links including packet-attributable `sk-code` paths |

### Replay

- New-finding ratios: 0.00, 0.00, 1.00, 1.00, 1.00, 1.00, 0.00.
- All dimensions were covered before the final stabilization pass.
- Stop policy was `max-iterations`; early convergence was telemetry only.
- F001 survived adversarial replay and VERDICT_LOCK remains FAIL.
- Every P0/P1 finding has typed adjudication and file:line evidence.

### Artifact Boundary

The artifact root was bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not executed. All writes stayed inside this lineage directory.

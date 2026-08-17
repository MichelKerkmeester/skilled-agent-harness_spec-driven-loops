---
title: "Checklist: Deep Review - Sealed Reference Artifacts"
description: "Blocking verification checklist for Deep Review seal-on-write lifecycle bindings, digest-addressed verified reads, candidate evidence integrity, convergence reproducibility, review-report synthesis, and resume handoff references."
trigger_phrases:
  - "deep review sealed artifacts checklist"
  - "deep-review tamper-evident artifact checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Completed the ordered verified Deep Review artifact-set binding"
    next_safe_action: "Consume the exported set in later separately scoped integration work"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Review - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Review sealed-artifact child. Execution evidence must pin
the candidate SHA, shared phase-007 descriptor and canonicalization versions, digest algorithm, mode artifact-kind matrix,
lifecycle fixture corpus, ordered reference sets, commands and exit codes, and dark-versus-legacy results. Verification
fails on zero fixtures, unverified byte release, mutable-only input acceptance, silent rebaseline, mixed reference
watermarks, changed legacy behavior, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Shared review-loop contracts and the executable write-set conflict graph are frozen for Deep Review [EVIDENCE: completed sibling contracts reviewed; focused Vitest 20/20]
- [x] CHK-002 [P0] The lifecycle artifact matrix covers scope/init, dimension-pass, candidate/adjudication, convergence, synthesis, resume, and save boundaries [EVIDENCE: focused Vitest 20/20; 14 registered kinds and 21-member run fixture]
- [x] CHK-003 [P0] The mode consumes shared sealing primitives and names no alternate digest, descriptor, store, or verifier [EVIDENCE: focused Vitest 20/20; `reference_set_digest` is the sole set identity]
- [x] CHK-004 [P1] The reducer sibling owns findings, dashboard, strategy, and report projection semantics, while this phase owns only artifact binding [EVIDENCE: `git diff --name-only`; no reducer or projection files changed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Changes stay inside the Deep Review mode binding and integration surfaces with no shared-service cleanup or authority transfer [EVIDENCE: focused Vitest 20/20; final scoped-diff audit]
- [x] CHK-006 [P1] Artifact-kind registration, descriptor references, canonicalization versions, media types, and reference ordering are explicit [EVIDENCE: focused Vitest 20/20; registry plus canonical lifecycle comparator]
- [x] CHK-007 [P1] Failure paths are typed, bounded, non-destructive, and never return fallback, nearest-match, repaired, or partially verified content [EVIDENCE: focused Vitest 20/20; negative fixtures return `SealedArtifactError` without bytes]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Equivalent scope targets, review contracts, context snapshots, prompt/rubric inputs, capability manifests, and policies produce shared byte-identical canonical artifacts and digest references [EVIDENCE: focused Vitest 20/20; repeated equivalent seals and complete-set builds are byte-identical]
- [x] CHK-009 [P0] Scope init seals one verified reference set before dispatch and rejects mutable-only, path-only, alias-only, tag-only, and `latest` inputs [EVIDENCE: focused Vitest 20/20; seven scope kinds are mandatory and closed-binding negatives remain green]
- [x] CHK-010 [P0] Dimension-pass fixtures preserve selected targets, search/depth ledger, diagnostics, raw observations, graph events, iteration output, and JSONL delta; mutation or corruption releases zero bytes [EVIDENCE: focused Vitest 20/20; four ordered dimension fixtures plus post-build corruption]
- [x] CHK-011 [P0] Candidate/adjudication fixtures preserve intermediate facts, evidence classes, reproduction/refutation, orthogonal confidence and impact fields, and append-only revisions before P0/P1/P2 activation [EVIDENCE: focused Vitest 20/20; P0/P1/P2 candidate and adjudication entries remain separate]
- [x] CHK-012 [P0] Convergence reads one verified state and findings snapshot and rejects mixed watermarks, missing references, changed inputs, and unregistered policy material [EVIDENCE: focused Vitest 20/20; required convergence kind plus stale-tail and missing-set rejection]
- [x] CHK-013 [P0] Synthesis seals findings/dashboard views, optional resource-map coverage, unresolved obligations, verdict metadata, and `review-report.md` whose bytes reproduce from identical verified inputs and reducer versions [EVIDENCE: focused Vitest 20/20; required synthesis view/report and repeated-build fixture]
- [x] CHK-014 [P0] Changed-target and resume fixtures classify unchanged, changed, missing, and unverifiable references, identify affected findings or report views, and preserve old artifacts [EVIDENCE: focused Vitest 20/20; closed drift material and stale-context refusal]
- [x] CHK-015 [P0] Continuity-save or handoff releases no trusted bytes after a failed seal or verified read and emits no silent completion or new baseline [EVIDENCE: focused Vitest 20/20; required handoff and replay re-verification]
- [x] CHK-016 [P0] Missing, changed, truncated, substituted, wrong-kind, wrong-size, descriptor-drifted, corrupted, and unsupported artifacts return typed failures before consumer release [EVIDENCE: focused Vitest 20/20; phase and shared failure matrices]
- [x] CHK-017 [P0] Replay and shadow parity bind the same ordered verified reference set and report input-equivalence failure before comparing different sets [EVIDENCE: focused Vitest 20/20; shared replay-input derivation and exact mode-set comparator]
- [x] CHK-018 [P0] Identical sealed inputs plus registered review-loop, replay, reducer, and projection contracts reproduce byte-identical events, findings views, convergence evidence, report bytes, and verdict metadata [EVIDENCE: focused Vitest 20/20; two builds over the same verified evidence produce identical set bytes]
- [x] CHK-019 [P0] Finding lineage preserves original observations across moved lines, renamed symbols, resolution, suppression, severity changes, and append-only supersession [EVIDENCE: focused Vitest 20/20; immutable candidate/adjudication references and publish-once shared store]
- [x] CHK-020 [P0] Seal or verification failure blocks dark evidence and trusted synthesis while leaving legacy results, state, schema, report behavior, and authority unchanged [EVIDENCE: `deep-review-sealed-artifacts.vitest.ts` test "rejects stale context and post-build corruption during replay"; `git diff --name-only` contains no legacy or authority path]
- [x] CHK-021 [P0] The Deep Review phase-local gate passes without invoking certificate or authority semantics owned by later phases [EVIDENCE: non-equivalent sets return `INPUT_EQUIVALENCE_FAILURE`; no authority API added]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P1] Every lifecycle row has positive, negative, corruption, and unsupported-version fixtures with a named shared artifact kind [EVIDENCE: focused Vitest 20/20; 14-kind mode matrix plus shared substrate suite]
- [x] CHK-023 [P1] Every target-drift disposition and artifact supersession path preserves the original digest and names affected finding or report dependencies [EVIDENCE: focused Vitest 20/20; content-addressed references are publish-once and stale contexts cannot replace prior sets]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P1] Target-content verification, prompt/tool capability references, evaluator or judge evidence, and access checks remain separate; diagnostics do not leak protected bytes [EVIDENCE: focused Vitest 20/20; authorized evidence path and byte-free typed errors]
- [x] CHK-025 [P1] Canonicalization rejects traversal, symlink escape, unsafe archives, ambiguous encodings, decompression abuse, and unbounded review artifacts before sealing [EVIDENCE: focused Vitest 20/20; shared sealed-artifact substrate suite]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-026 [P2] The mode artifact matrix, seal/read failure behavior, candidate evidence rules, reference-set ordering, report reproducibility, and resume drift rules are documented for successor consumers [EVIDENCE: runtime README and implementation summary]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:boundary -->
## Scope Reconciliation

Leaf-003 owns sealing exact canonical bytes, lowercase 64-hex shape validation, backing its own `materialDigest`,
kind-checking declared `SealedArtifactReference` values, and tamper-evident verified reads. The plain scalar and array
digest fields named in ADR-002 are immutable shape-validated values only. Cross-artifact closure for those named values is
an accepted leaf-004 forward obligation, not an incomplete leaf-003 verifier check.

`locator.selector` is also a structural-shape boundary. The validator rejects bare-word and combinator-joined prose
that fails the structured selector grammar, but it cannot prove that a syntactically valid CSS class, id, or attribute
identifier resolves to a real evidence span without target-document context. The selector is advisory only; downstream
consumer or leaf-004 attestation must resolve it and MUST NOT activate severity from selector text. The separately
validated `rawScore`, `confidence`, `impact`, `reachability`, `exploitability`, digest, and reference fields remain
the authority-bearing inputs [evidence: `decision-record.md` ADR-003; `implementation-summary.md` selector limitations].

- [x] CHK-028 [P1] Locator selector validation is documented as structural shape validation only, with semantic target-document resolution and selector-independent severity authority deferred downstream [evidence: `decision-record.md` ADR-003; `implementation-summary.md`; no runtime or test changes in this documentation update]
<!-- /ANCHOR:boundary -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P1] Mode binding, fixture, and evidence changes remain path-scoped; shared seal primitives and unrelated Deep Review siblings are not modified [EVIDENCE: final `git status --short` and scoped diff]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the lifecycle matrix is non-empty, every consumer receives only
shared verified bytes, candidate evidence and report synthesis are digest-reproducible, replay and shadow parity use
equivalent reference sets, changed inputs do not silently rebaseline, and the legacy path remains authoritative with no
unexpected tracked mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode verifier binds the artifact-kind matrix, shared descriptor and canonicalization versions, digest
references, lifecycle results, candidate/adjudication evidence, convergence gates, replay/parity evidence, drift result,
handoff result, candidate SHA, and clean post-gate worktree state into one mode receipt for the later certificate phase.
<!-- /ANCHOR:sign-off -->

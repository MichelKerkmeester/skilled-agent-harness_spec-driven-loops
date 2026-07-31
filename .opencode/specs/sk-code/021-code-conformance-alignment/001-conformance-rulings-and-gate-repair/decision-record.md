---
title: "Decision Record: Conformance Rulings and Gate Repair"
description: "Accepted scope and gate decisions for the first sk-code conformance child."
trigger_phrases:
  - "conformance rulings"
  - "gate repair decisions"
  - "comment hygiene boundary"
  - "three guard scan root"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/001-conformance-rulings-and-gate-repair"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Formalized the accepted scope rulings and gate decisions"
    next_safe_action: "Run the widened three-guard gate and reconcile evidence"
    blockers: []
    key_files:
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Conformance Rulings and Gate Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

The decisions below are accepted for this child. They freeze ownership and gate semantics for children 002-005; they do not close the parent packet.

<!-- ANCHOR:decision -->
### Evidence baseline

- Repository state: git rev-parse HEAD returned 719ad8f638c54084c3354ed53b0a0a8bfdafce56.
- Test census: the glob command recorded *.vitest.ts=1,229, *.test.ts=43, *.test.cjs=50, *.test.mjs=39, *.test.sh=6, test_*.py=29, and *.test.js=0.
- Wired Claude adapter: node --check .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs returned 0; SHA-256 4f6cf47867b6ad40d3b463b0416100752c95aac8c2de5f38aa0c5b536b5b0784.
- Installed Git hook: git config --get core.hooksPath returned /Users/michelkerkmeester/.config/git/hooks; the resolved pre-commit symlink targets .opencode/scripts/git-hooks/pre-commit in the primary checkout.

<!-- ANCHOR:adr-001 -->
## ADR-001: Generated, vendored, and external output is out of scope

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

<!-- ANCHOR:adr-001-context -->
### Context

Generated output and vendored or external code are not authored conformance surfaces. The scan must avoid turning generated targets into authored work items.

Evidence: git ls-files -- '*dist/*' '*external/*' is the reproducible inventory command; the captured result belongs to the child baseline.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Exclude dist/, external/, and equivalent generated or vendored output from authored-code work lists. A source lane may report their presence, but it does not edit them without an explicit freshness or parity owner.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

The rejected alternative is to treat generated output as authored code. That would make the conformance work list depend on build products rather than source ownership.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Generated and external paths stay outside this authored-code sweep. Freshness and parity checks remain the responsibility of their owning lanes.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

Necessary: PASS. Sufficient: PASS for scope classification. Fits goal: PASS. The remaining freshness/parity work is explicitly outside this child.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

The verifier excludes resolved generated and external targets, and the frozen manifest records authored roots only. Rollback: restore the prior exclusion set and the prior scan-root argument together.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->

### ADR-002: Runtime mirrors are limited to authored, non-symlink files

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

Only authored, non-symlink runtime files enter a work list. A mirror is governed at its source path and is not counted as a second implementation. Evidence: find .claude -type l -print is the reproducible mirror inventory command.

### ADR-003: Benchmark subjects are frozen; harnesses remain in scope

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

Fixture subjects and benchmark corpora are frozen. Benchmark runners, graders, and harness scripts are authored code and remain in scope for the applicable manual gate. Evidence: the frozen manifest inventories benchmark roots separately from their fixtures descendants.

### ADR-004: Amend test naming; do not migrate filenames

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

The standard adopts *.vitest.ts, *.test.ts, *.test.cjs, *.test.mjs, *.test.sh, and test_*.py. No filename migration is authorized, and the zero-match *.test.js entry is removed. Evidence: the census returned 1,229, 43, 50, 39, 6, 29, and 0 respectively; the output is recorded in implementation-summary.md.

### ADR-005: Generic labels use a bounded semantic boundary

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

A comment label is forbidden when it identifies an external or ephemeral artifact, and permitted when it names a durable concept. This child adds only bounded artifact-shaped forms: Feature catalog:, a numeric phase path such as phase-19-gate, and zero-shaped labels such as Phase 0 or spec 019. Durable Phase 2 prose, string literals, and labels inside URLs remain allowed.

Broader generic-label matching is deferred until a future semantic-boundary decision supplies more examples and an explicit false-positive budget. Evidence: the pre-change fixture run returned rc 1 with four positive cases failing, SHA-256 6291136e850bf7aa58a31e6bb83e30171e189d82a02396cfb24cb7d52688164b; the post-change suite returned 21 passes, rc 0, SHA-256 85b8f01d65998ca1dc10e22984b92a3bd4b25fbc88c2887b6025ab3b1d2eef0a.

### ADR-006: Pattern and example assets are authored code under a manual gate

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

Pattern and example assets remain authored code, but their semantic examples are not closed by the mechanical verifier alone. They require a manual gate and a parse or execution check when applicable. Evidence: the verifier context classification names assets, examples, and fixtures; the exact-header flag documents those exception segments.

### ADR-007: Every child carries machine and manual work lists

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

A mechanical verifier PASS clears only the machine gate. Every child carries a machine work list and a manual work list. Evidence: the repaired verifier returned PASS, Scanned files: 67, Findings: 0, Errors: 0, Warnings: 0, rc 0 for the sk-code root while the header flag remains opt-in.

### ADR-008: The three-guard wrapper scans the repository with warnings withheld

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator ruling

run-all-drift-guards.sh passes the repository root to verify_alignment_drift.py --check-router. It does not pass --fail-on-warn; warnings remain visible and non-blocking until the mechanical sweep child lands. Errors remain blocking. Keeping the old sk-code root is structurally blind. Rollback restores the old root argument.

Evidence: the full post-change wrapper output and its direct rc are recorded in implementation-summary.md.

### ADR-009: Exact header checking is opt-in

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

verify_alignment_drift.py --check-exact-headers requires COMPONENT: or MODULE: in the first 40 lines. It skips tests, scratch/research context, plugins, assets, examples, fixtures, and archived material. The default verifier and three-guard wrapper do not enable it. Evidence: the doctor-scripts opt-in run returned rc 1 with eight findings, including seven EXACT-HEADER findings and one pre-existing strict-mode warning, SHA-256 0cbf88c506a1f36b895f3d7b616ab60beeb2a555f011ef788d7b95ae011b9971.

### ADR-010: 020 owns runtime only

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

The 020 phase owns .opencode/skills/system-deep-loop/runtime/** only. Non-runtime shared/** and deep-improvement/scripts/** remain with the sk-code conformance program. The 020 spec now states the border and links back to this program.

Evidence: the amended 020 spec contains the Resolved Border section; its original scope already named code inside the system-deep-loop runtime and excluded code outside it.

### ADR-011: One installed hook per lifecycle event

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Operator and BUILD leaf

The installed Git hook is .opencode/scripts/git-hooks/pre-commit, selected by global core.hooksPath. The installed Claude post-edit adapter is .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs, wired by .claude/settings.json. The older files remain compatibility helpers and are not installed runtime hooks. The retained pre-commit owns the checker and mirror-sync gates directly.

Evidence: git config --get core.hooksPath, git rev-parse --git-path hooks, and ls -l "$(git rev-parse --git-path hooks)/pre-commit" resolved the Git path; .claude/settings.json:175 names the Node adapter; relevant syntax checks pass.

### Open implementation caveat

node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree returned rc 1 because the user-global Codex hook file has eight missing, eight command-drift, and seven orphaned identities relative to this worktree. This child does not modify that global file because it is outside the editable scope.
<!-- /ANCHOR:decision -->

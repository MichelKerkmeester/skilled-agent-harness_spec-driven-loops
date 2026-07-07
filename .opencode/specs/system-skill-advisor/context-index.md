# Context Index: System Skill Advisor Extraction

> Migration bridge for the 2026-07-07 extraction of skill-advisor spec folders out of
> system-speckit/026, 027, 028 into system-skill-advisor, plus the shared/joint items
> intentionally left behind.

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge

Every folder below moved on 2026-07-07 via `system-skill-advisor/000-migration-from-system-speckit/`. Full manifest, decisions, and verification evidence live in that tracking spec.

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph` | `system-skill-advisor/001-skill-graph` | active | Whole subtree, incl. the 30-item package-extraction arc |
| `.../002-skill-advisor/002-skill-advisor-scoring-engine` | `system-skill-advisor/002-skill-advisor-scoring-engine` | active | Whole subtree |
| `.../002-skill-advisor/003-skill-advisor-routing-engine` | `system-skill-advisor/003-skill-advisor-routing-engine` | active | Whole subtree, plus child 006 appended (see below) |
| `.../002-skill-advisor/004-skill-advisor-production-hardening` | `system-skill-advisor/004-skill-advisor-production-hardening` | active | Whole subtree, plus children 005-008 appended (see below) |
| `.../002-skill-advisor/005-skill-advisor-documentation` | `system-skill-advisor/005-skill-advisor-documentation` | active | Whole subtree |
| `.../002-skill-advisor/006-playbook-run-and-remediation` | `system-skill-advisor/006-playbook-run-and-remediation` | active | Whole subtree |
| `026/005-graph-impact-and-affordance/003-skill-advisor-affordance-evidence` | `system-skill-advisor/003-skill-advisor-routing-engine/006-skill-advisor-affordance-evidence` | active | Appended as new child 006 |
| `026/000-release-and-program-cleanup/001-release-readiness/001-fix-skill-advisor-fail-open-fallback` | `system-skill-advisor/004-skill-advisor-production-hardening/005-fail-open-fallback` | active | Appended as new child 005 |
| `026/006-operator-tooling/001-hook-parity/003-codex-native-startup-advisor-hooks` | `system-skill-advisor/004-skill-advisor-production-hardening/006-codex-native-startup-advisor-hooks` | active | Appended as new child 006 |
| `026/000-.../003-release-readiness-deep-review-audits/003-skill-advisor-freshness-audit` | `system-skill-advisor/004-skill-advisor-production-hardening/007-skill-advisor-freshness-audit` | active | Appended as new child 007 |
| `026/000-.../006-research/004-fix-deep-research-findings/003-fix-skill-advisor-quality` | `system-skill-advisor/004-skill-advisor-production-hardening/008-fix-skill-advisor-quality` | active | Appended as new child 008 |
| `026/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack` (5 children) | `system-skill-advisor/007-skill-advisor-embedder-stack/001-005` | active | Merged into new hub |
| `026/.../006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix` | `system-skill-advisor/007-skill-advisor-embedder-stack/006-skill-advisor-zombie-launcher-fix` | active | Merged into new hub |
| `026/.../022-hardcoded-default-remediation-arc/004a-skill-advisor-compat-contract-consolidation` | `system-skill-advisor/007-skill-advisor-embedder-stack/007-skill-advisor-compat-contract-consolidation` | active | Merged into new hub |
| `026/.../022-hardcoded-default-remediation-arc/004b-skill-advisor-interface-and-env-vars` | `system-skill-advisor/007-skill-advisor-embedder-stack/008-skill-advisor-interface-and-env-vars` | active | Merged into new hub |
| `027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli` | `system-skill-advisor/008-skill-advisor-cli` | active | Whole subtree |
| `027/003-advisor-and-codegraph/003-skill-advisor-cross-session-reconnect` | `system-skill-advisor/009-advisor-and-codegraph-migrated-items/001-skill-advisor-cross-session-reconnect` | active | New merged hub |
| `027/003-advisor-and-codegraph/004-skill-advisor-suite-repair` | `system-skill-advisor/009-advisor-and-codegraph-migrated-items/002-skill-advisor-suite-repair` | active | New merged hub |
| `027/003-advisor-and-codegraph/005-advisor-state-spec-folder-leak` | `system-skill-advisor/009-advisor-and-codegraph-migrated-items/003-advisor-state-spec-folder-leak` | active | New merged hub |
| `027/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-005` (advisor items) | `system-skill-advisor/009-advisor-and-codegraph-migrated-items/004-008` | active | New merged hub |
| `027/000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor` | `system-skill-advisor/010-skill-advisor-frontmatter-alignment` | active | Single leaf |
| `028-memory-search-intelligence/002-skill-advisor` | `system-skill-advisor/011-skill-advisor-phase-parent` | active | Whole subtree |
| `system-skill-advisor/999-skill-advisor-tuning` (disk name, metadata said `001`) | `system-skill-advisor/012-skill-advisor-tuning` | active | Chronological renumber, newest wave lands last |
<!-- /ANCHOR:migration-bridge -->

---

<!-- ANCHOR:left-in-place -->
## Left In Place (deviation from a literal "move everything" reading)

These stayed in `system-speckit` because they are genuinely shared/joint infra, not skill-advisor-exclusive. See `000-migration-from-system-speckit/decision-record.md` ADR-002 for the full rationale.

| Path | Why it stays |
|---|---|
| `027-xce-research-based-refinement/003-advisor-and-codegraph/001-causal-traversal-bfs` | Shared BFS helper used by both advisor's skill-graph queries and code-graph's recursive-CTE consumers |
| `027/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-004` (renumbered from 006-009) | Pure code-graph siblings under the same parent as the advisor items that moved |
| `026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/*` | Coherent joint research packet, 4 of 5 children are code-graph-only |
| `026/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index` | Explicitly shared daemon bridge |
| `026/006-operator-tooling/003-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment` | Content unconfirmed, still template-scaffold prose |
| `027/005-verification-and-remediation/003-deep-research-remediation/L5-advisor-correctness` | Not a spec folder, finding-tracking artifact keyed into its parent's own state machine |
| `027/review/fresh-regression-75/lineages/opus-advisor-daemon` | Not a spec folder, deep-review-regression lineage artifact |
<!-- /ANCHOR:left-in-place -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Keep rows scoped to phase-folder movement or identity changes.
- Full manifest, decisions, and verification evidence: `000-migration-from-system-speckit/`.
<!-- /ANCHOR:author-instructions -->

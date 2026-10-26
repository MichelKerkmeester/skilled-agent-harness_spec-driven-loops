# Deep Review Iteration 5

## Dispatcher

- Target: specs/sk-code/013-private-surface-skills (spec-folder)
- Mode: review
- Executor: cli-codex, gpt-6-luna
- Dimension: maintainability (stabilization pass)
- steer.md was checked and absent. Configuration, prior state, findings registry, and strategy were read before this pass.

## Dimension

Maintainability stabilization: recheck all active findings, trace the remaining high-risk retrieval and advisor consumers, and resolve the feature-catalog and playbook cross-reference protocols.

## Files Reviewed

- specs/sk-code/013-private-surface-skills/spec.md:50,136 — parent completion status and phase map.
- specs/sk-code/013-private-surface-skills/goal.md:89,111 — checked completion criteria and phase progress.
- specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:33-35,70 — closure contract and AC-014.
- specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md:136 — staged-path guard contract.
- .skilled/scripts/git-hooks/pre-commit:105,111 — private path expression and staged diff filter.
- specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:164-183 — scanner inventory.
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:51-54 — independent freshness scan.
- .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:213-217 — canonical root enumeration and local-name exclusion.
- .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:143-147 — local-name exclusion.
- .github/workflows/routing-registry-drift.yml:202 — freshness gate invocation.
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:275-279 — ignored-path check before symlink or directory handling.
- .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21-48 — trusted-root containment.
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155-208 — Python mirror and scan eligibility.
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1215-1221,1267-1277 — metadata readers using the shared private-link check.
- .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:197-206 — watcher discovery using the trusted-link check.
- .skilled/skills/sk-code/feature-catalog/feature-catalog.md:15-22 — catalog scope and current hub surface.
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:1-24 — playbook scope and scenario package.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Packet completion status contradicts active phase records** — specs/sk-code/013-private-surface-skills/spec.md:50 — carried from iteration 1 and rechecked. The parent is marked Complete and the goal's completion boxes are checked, while the phase map still lists phase 2 in progress and phase 3 pending. Phase 2's own acceptance contract says closure requires every row to be Met, Waived, or Superseded; AC-014 remains Unmet. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:50] [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:136] [SOURCE: specs/sk-code/013-private-surface-skills/goal.md:89] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:34] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:70]
   Finding ID: LUNA-R1-P1-001
   Finding class: phase_status_drift
   Scope proof: Parent and child phase closure records are within the review target.
   Affected surface hints: packet-status, phase-transition, completion-gate

### P2 Findings

1. **Staged type-change paths bypass the local-skill guard** — .skilled/scripts/git-hooks/pre-commit:111 — carried from iteration 2 and rechecked. The hook filters the staged path list with `--diff-filter=ACMR` before matching the private path expression. Git type-change status `T` is omitted. The gap requires an already tracked `local-*` path whose index entry changes type; ordinary new local paths are still reported as added and caught. [SOURCE: .skilled/scripts/git-hooks/pre-commit:105] [SOURCE: .skilled/scripts/git-hooks/pre-commit:111] [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md:136]
   Finding ID: LUNA-R2-P2-001
   Finding class: commit_guard_diff_filter_gap
   Scope proof: The hook and its private-path guard contract are named implementation surfaces.
   Affected surface hints: pre-commit-guard, private-skill-path, publication-boundary

2. **The scanner inventory omits the derived-freshness root scan** — specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:164 — carried from iteration 4 and rechecked. The inventory claims sixteen top-level skill-root scans and lists the regenerator, but the workflow-invoked `ci-skill-derived-freshness.cjs` separately enumerates the same root. It filters by `Dirent.isDirectory()` and metadata-file existence without excluding `local-*` names, unlike the reusable regenerator enumerator. Under the supported symlink layout this checker skips a local skill incidentally; a real local directory is scanned. The checker is read-only, so the established impact is an incomplete scan inventory and inconsistent local-name policy, not a demonstrated tracked-file write. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:164] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:181] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:51] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:54] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:215] [SOURCE: .github/workflows/routing-registry-drift.yml:202]
   Finding ID: LUNA-R4-P2-001
   Finding class: scanner_inventory_omission
   Scope proof: The phase 3 scan inventory and the workflow gate are both within the declared review scope.
   Affected surface hints: scanner-inventory, local-skill-exclusion, derived-freshness-gate

## Traceability Checks

- spec_code: fail — the phase 3 scan inventory omits a workflow-invoked root scan.
- checklist_evidence: fail — phase 2 AC-014 remains Unmet under its explicit closure contract.
- skill_agent: pass — advisor metadata readers use the shared trusted-link and scan-eligibility helpers.
- agent_cross_runtime: pass — TypeScript and Python canonical-root/relative-path checks agree on containment.
- feature_catalog_code: pass — the feature catalog describes the public sk-code hub; the exact removed and local surface identifiers are absent, consistent with the decision that `local-*` skills are outside that hub.
- playbook_capability: pass — the manual playbook covers live sk-code scenarios; the exact removed and local surface identifiers are absent, while phase 5 owns the private-skill routing and invisibility proofs.
- scope_boundary: conflict — graph metadata upserts and resource-map emission target paths outside the lineage write boundary and remain skipped.

## Integration Evidence

The retrieval corpus checks the Git-ignored path set before it follows a symlink or descends into a directory. Advisor Python metadata readers and the daemon watcher both use the shared trusted local-link rule; the TypeScript and Python helpers canonicalize roots and use relative-path containment. These checks address the high-risk consumer paths omitted from earlier target selection. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:275] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1215] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1271] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:197] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py:155]

An exact identifier search of the feature catalog and manual-testing playbook found no `local-webflow`, `local-obsidian`, `sk-code-webflow`, or `sk-code-obsidian` references. The broader search's `/private/tmp` examples are unrelated outside-root test fixtures, not references to this packet's private skills. The catalog and playbook protocols are therefore not missing required local-skill coverage under the packet's D1/D6 boundary. [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:62] [SOURCE: specs/sk-code/013-private-surface-skills/spec.md:83] [SOURCE: .skilled/skills/sk-code/feature-catalog/feature-catalog.md:15] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:15]

## Edge Cases

- A newly staged private path is an Added entry and matches the hook. The type-change finding is limited to an already tracked path with Git status `T`.
- The freshness checker skips the intended local symlink because `Dirent.isDirectory()` is false; a real `local-*` directory with graph metadata reaches its scan. No write or private-content disclosure was observed from the checker itself.
- The feature catalog and playbook describe the public `sk-code` hub and its manual scenarios. The private skills route through the operator's local advisor, so their absence from those hub-only docs is consistent with the frozen boundary.
- Corpus ignore filtering occurs before link resolution or directory recursion; the prior phase 5 corpus-boundary evidence remains consistent with the source.

## Confirmed-Clean Surfaces

- Corpus ignored-path filtering precedes symlink and directory traversal.
- Advisor Python readers and the TypeScript watcher use the same trusted-root containment policy.
- Feature-catalog and playbook searches found no removed or local skill identifiers; their scoped hub coverage is consistent with D1/D6.
- No new P0, P1, or P2 finding emerged from this stabilization pass.

## Ruled Out

- A corpus walk through an ignored local skill was not found; the crawler skips ignored entries before inspecting their type.
- An untrusted local-link path in the advisor readers or watcher was not found; each delegates to canonical trusted-root checks.
- Missing local-skill scenarios in the sk-code feature catalog or manual playbook were not established; the packet assigns local routing/invisibility evidence to phase 5 and scopes these docs to the public hub.

## Next Dimension

Synthesis and final provenance review; the five-iteration ceiling has been reached.

## Next Focus

- Dimension: synthesis
- Focus area: consolidate active findings and record the max-iteration stop reason.
- Reason: maxIterations is five; convergence remains telemetry and does not stop this run early.
- Rotation status: complete
- Blocked/productive carry-forward: graph and resource-map writes remain outside the lineage boundary; keep the scope conflict visible.
- Required evidence: five iteration records, active registry, dashboard, and review report.

## SCOPE VIOLATIONS

- The YAML graph seed and per-iteration graph upsert target packet-root graph metadata outside the bound lineage path. Those writes remain skipped; this pass used graphless search coverage.
- The earlier out-of-lineage continuity/context write is recorded in iteration 1 and violates the requested write boundary.
- The YAML enables resource-map emission, but its output would be `specs/sk-code/013-private-surface-skills/resource-map.md` outside the lineage. No resource map exists and emission was skipped; no new outside-lineage write was made in this pass.

## Verdict

The P1 completion-state contradiction remains confirmed, and both P2 findings remain active. The wider retrieval, advisor, and hub-document checks did not add findings. No P0 was found.

Review verdict: CONDITIONAL

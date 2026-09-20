# Deep Review Iteration 4 — Maintainability

- **Target:** `.skilled/skills/cli-orca` (with its review scope: the packet at `specs/cli-orca/002-consolidate-official-orca-skills`, the mcp-tooling hub boundary, advisor routing surfaces, sk-doc package validators, and the compiled-route tooling)
- **Dimension:** maintainability
- **Iteration:** 4 of 5 · **Lineage:** new (generation 1) · **Mode:** review
- **Focus:** structure and duplication discipline, generated-artifact freshness, version/changelog consistency, comment hygiene in the scoped scripts

## FILES REVIEWED

- `.skilled/skills/cli-orca/SKILL.md:11-14,60-132` — frontmatter version, routing signal/lane tables, Smart Router pseudocode, resource map
- `.skilled/skills/cli-orca/README.md:1-60` — package index, leaf-root claim, routing restatement
- `.skilled/skills/cli-orca/assets/PROVENANCE.md:21-76` — snapshot provenance, digest pins, refresh procedure
- `.skilled/skills/cli-orca/references/orca-skills/overview.md:44,117` — snapshot pinning and refresh narrative
- `.skilled/skills/cli-orca/manual-testing-playbook/handoffs/hub-deferral-receipt.md:1-32` — scenario contract shape
- `.skilled/skills/cli-orca/changelog/v0.1.0.0.md:1-18` — release record vs frontmatter version
- `.skilled/skills/cli-orca/graph-metadata.json:88-117` — entity and key_files path resolution
- `.skilled/skills/cli-orca/leaf-manifest.config.json:5-8` — declared leaf roots vs README claim
- `.skilled/bin/compiled-route-status.cjs:32-73` and `.skilled/bin/compiled-route-sync.cjs` — shared-helper composition
- Scoped validators: `validate_skill_package.py`, `validate_document.py`, `validate_catalog_package.py`, `validate-playbook-package.cjs`, `ci-skill-root-metadata.cjs` — size and cross-document scope
- Advisor surface: `runtime/handlers/advisor-recommend.ts`, `graph-metadata.json` (path sweep)
- Corpus-wide scans: `rg -l 'mcp-aside-devtools'` (six restatement docs); comment-hygiene sweep over eleven scoped scripts; version sweep over SKILL.md, README.md, changelog

## FINDINGS BY SEVERITY

### P0 — Blockers

None.

### P1 — Required

None new. Prior `P1-001` (Smart Router generic vocabulary, correctness) remains active; no evidence this iteration changed its status, and it is untouched by the maintainability pass.

### P2 — Advisory

#### P2-006 — Routing and ownership invariants are restated across six documents with no machine cross-document check

- **File:** `.skilled/skills/cli-orca/README.md:24` (one of six restatement sites)
- **Claim:** the ownership matrix (generic agentic browser to `mcp-aside-devtools`, CDP to `mcp-chrome-devtools`, desktop to `computer-use`) and the routing vocabulary are duplicated across six markdown documents, plus the SKILL.md signal table, the pseudocode `FOREIGN_OWNERS` block and the advisor trigger phrases. Every scoped validator is per-document or structural, so drift between the copies is caught only by manual review.
- **Evidence:** `rg -l 'mcp-aside-devtools'` over `.skilled/skills/cli-orca -g '*.md'` returns exactly six files: `SKILL.md`, `README.md`, `references/mutation-and-browser-boundaries.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/routing/orca-qualified-vocabulary.md`, `feature-catalog/safety/mutation-and-ownership-boundaries.md`. The resource map describes the scoped validators as "Per-document template and prose conformance" (`validate_document.py`), "Package shape and required documents" (`validate_skill_package.py`) and root metadata freshness (`ci-skill-root-metadata.cjs`) — none compares two documents. The risk is not theoretical: prior `P2-001` already caught one divergence in the `ORCA_SKILLS` signal set.
- **Counterevidence sought:** iterations 2-3 verified the matrix is consistent today across SKILL.md, the boundaries reference and README, and the 161-link scan resolved every relative link. Those passes verify the current snapshot, not future edits — nothing re-runs them when a document changes.
- **Alternative explanation:** the duplication may be deliberate reader-locality; each document restates what its reader needs. That is a reasonable convention, but it does not shrink the maintenance surface, and no document declares the other copies as canonical summaries.
- **Final severity:** P2 (maintainability; advisory, no behavioral impact today).
- **Confidence:** 0.8.
- **Downgrade trigger:** if a validator outside the scoped set (for example the advisor index build) fails on cross-document vocabulary drift, the risk is already caught mechanically and this collapses to informational.
- **Recommendation:** extract the ownership matrix into one canonical table that the other documents link, or add a cross-document consistency check to the existing sk-doc validator set comparing the matrix rows across the six files.

## TRACEABILITY CHECKS

- **Core `spec_code`** — version consistency verified: `SKILL.md:14`, `README.md:10` and `changelog/v0.1.0.0.md` all carry 0.1.0.0; the manifest configs carry no version field that could drift. Prior REQ-005/REQ-009/REQ-014 evidence is unaffected; the `P2-004` count conflict remains recorded and was not re-verified this iteration.
- **Core `checklist_evidence`** — not re-run in this maintainability pass; the row-level replay from iteration 3 stands unchanged. No contradictory signal appeared in the documents read.
- **Overlay `skill_agent`** — no new evidence; prior pass stands (no agent pins `cli-orca`; advisor identity live at generation 65).
- **Overlay `agent_cross_runtime`** — not re-run; prior `diff -rq` parity (rc=0) stands.
- **Overlay `feature_catalog_code`** — the catalog's routing and safety documents are among the six restatement sites and were scanned in this pass; no matrix string divergence was found between them and SKILL.md/README.
- **Overlay `playbook_capability`** — `hub-deferral-receipt.md` read end-to-end: it is a proper deterministic scenario contract (objective, real user request, expected signals, pass/fail), not run debris.
- **Resource Map Coverage directive** — `applied/T-*.md` still does not exist in this packet (recorded again; no `applied/` directory), so the pass cross-checked the config's 86-file scope list as the nearest target inventory. The scoped script surfaces all have resource-map rows (`.skilled/bin/compiled-route-*.cjs`, the validators, the advisor handler); no new coverage gap in this dimension. `P2-002`/`P2-005` remain the recorded map gaps.

## RULED OUT

- **Stale generated graph metadata** — all `path`/`key_files` values in the three scoped `graph-metadata.json` files resolve on disk; the only non-resolving strings are bare `name` display fields and trigger phrases, which are not paths (`cli-orca` metadata 88-117; advisor 103-143; mcp-tooling 198-201). Initial "missing" hits were false positives, verified against `find` output.
- **Comment hygiene in scoped scripts** — zero hits for `ADR-`/`REQ-`/`CHK-`/task-id/spec-path labels across the eleven scoped scripts (compiled-route pair, doctor script, validators, advisor handlers).
- **Route-script copy-paste** — `compiled-route-status.cjs` composes the shared `./lib/compiled-route-manifest.cjs` and `./lib/compiled-route-layout.cjs` modules; the shared helper definitions appear once and are absent from `compiled-route-sync.cjs`.
- **Version drift** — SKILL.md, README and changelog all record 0.1.0.0.
- **Snapshot maintenance gap** — assets are pinned by release revision, package digest and sha256, and `PROVENANCE.md` documents the refresh procedure and the mismatch policy (record instead of guessing).
- **Leaf-root claim** — README's "four leaf roots" claim matches `leaf-manifest.config.json:5-8` exactly.

## SCOPE VIOLATIONS

None. No out-of-scope path was created, modified, renamed or deleted. Gateway and helper writes landed only inside the run directory.

## STATE RECORD NOTE

The state log now carries four `"type":"iteration"` rows, the last with 29 keys — the full canonical record for this iteration, appended by the platform's dedicated state-record writer (`runtime/scripts/append-state-record.cjs`, output: appended 9984 bytes), the same sanctioned writer iteration 3 documented.

The pack-prescribed gateway invocation was attempted and refused by the runtime, with exact reasons:

- Attempt 1 (pack-literal raw iteration record): rc=1, `{"ok":false,"phase":"runtime","reason":"Unrecognized event format: expected object with stem or event_type","code":"RUNTIME_ERROR"}`.
- Attempt 2 (`deep_review.dimension_pass_completed` stem envelope): rc=1, `Invalid closed-shape payload for deep_review.dimension_pass_completed`.
- Attempt 3 (corrected identifiers - `repo/` prefix and comma-free citations, two variants): the ledger committed the pass-completion event (`event_type: deep-review.ledger.dimension-pass-completed`, frames 3 and 4, stream sequences 3 and 4) but the state-log projection step refused with rc=2: `{"ok":false,"phase":"projection","reason":"Projection replace would drop keys from the existing config row","code":"PROJECTION_FAILED"}`. Per the pack's exit-2 rule the attempt stopped there.

Runtime note: the append flow does attempt a state-log projection downstream of the gateway shim; the failure was on replace semantics (it would drop keys from the existing config row), not on event shape. The full 29-key row the reducer counts was therefore written by the dedicated state-record writer, exactly as in iteration 3. Because both corrected variants committed before the projection was evaluated, the ledger now holds two `dimension-pass-completed` events for iteration 4 (frames 3 and 4); no deletion or rewrite was attempted, and both appends went through the sanctioned gateway.

## VERDICT

One new P2 finding (`P2-006`) and no new P0/P1. The still-open `P1-001` from iteration 1 keeps the run at CONDITIONAL; this iteration adds maintenance-surface risk only.

Review verdict: CONDITIONAL

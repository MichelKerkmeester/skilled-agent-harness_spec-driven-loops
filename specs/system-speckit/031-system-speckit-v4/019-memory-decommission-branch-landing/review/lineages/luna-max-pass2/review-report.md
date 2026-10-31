# Deep Review Report: memory decommission landing

## Outcome

| Field | Result |
|---|---|
| Verdict | CONDITIONAL |
| Stop reason | maxIterationsReached |
| Iterations | 10 of 10 |
| Executor | cli-codex model=gpt-5.6-luna |
| Review target | .opencode/specs/system-speckit/052-memory-decommission-landing |
| Target type | spec-folder |
| Active findings | P0=0, P1=4, P2=8 |
| Dimensions | correctness, security, traceability, maintainability |
| Early convergence | No; convergence remained telemetry under the max-iterations policy |

The loop completed all ten required inline iterations. The final verdict is
CONDITIONAL because four active P1 findings remain. This report is a review
artifact, not a claim that the packet is ready to close.

## Bound setup

- review_target: .opencode/specs/system-speckit/052-memory-decommission-landing
- review_target_type: spec-folder
- review_dimensions: all
- spec_folder: .opencode/specs/system-speckit/052-memory-decommission-landing
- execution_mode: AUTONOMOUS
- lineage_mode: auto
- session_id: fanout-luna-max-pass2-1788552418848-3us41r
- executor: cli-codex model=gpt-5.6-luna
- artifact_dir: /Users/michelkerkmeester/worktrees/public/044-zvec-grep-integration/.opencode/specs/system-speckit/052-memory-decommission-landing/review/lineages/luna-max-pass2
- nested dispatch: false

The artifact root was bound directly from the fan-out lineage override. No
resolve-artifact-root command or nested executor was used.

## Scope and method

The packet scope file has 438 non-empty, unique entries. The review used that
bounded list and directly read only the current source seams and packet
evidence needed for each pivot. No target packet, source implementation, test,
command, skill, mirror or runtime file was changed.

No initial resource map or goal-file manifest was present. Graph and semantic
search coverage were unavailable, so each iteration recorded graphless
fallback evidence through direct reads, exact searches, producer/consumer
traces and focused-test inspection. The review did not run repository
validators, generators, parity harnesses, tests, process checks, graph writes or
the continuity writer because those workflows can write outside the user-bound
lineage directory. The system freshness warning also reported a missing
watched source path for system-spec-kit/mcp-server/configs.

## Active findings

| ID | Severity | Dimension | Evidence | Required follow-up |
|---|---|---|---|---|
| F001 | P1 | correctness | rg-wrapper.mjs:68-154 omits the shared lane's hidden-document and .git exclusions; its read-only parity probe returned three divergences. | Align wrapper recipes with the shared lane and add hidden/.git parity fixtures. |
| F002 | P2 | correctness | retrieval-conventions.md:71-125 declares the .git exclusion mandatory, while its copyable recipes omit it. | Add the exclusion to every documented recipe and test documentation parity. |
| F003 | P2 | correctness | rg-wrapper.mjs:236-263 destructures only recipe and phrase; a read-only parseArgs(path, foo, bar) probe silently dropped bar. | Reject extra positionals or define explicit joining and test it. |
| F004 | P1 | security | hf-local.ts:679-705 ignores its model option and reports ready/loading as available; readiness can latch a mismatched health model before the server returns a model-missing response. | Bind availability to the requested model and fail before readiness is latched. |
| F005 | P2 | security | hf-model-server.cjs:338-383 chmods the direct Unix socket after bind without a type check; close-time cleanup at 1022-1051 unlinks the recorded path directly. | Apply lstat/socket and close-time ownership checks equivalent to shared IPC. |
| F006 | P2 | security | hf-local.ts:438-443 accepts any finite positive response dimension and applies Math.trunc before adoption. | Require a positive safe integer and cover malformed responses. |
| F007 | P1 | traceability | implementation-summary.md:11-99 says Completed while retaining literal template placeholders and completion_pct 0; the packet is In Progress, acceptance rows are Unmet and T006-T010 are unchecked. | Reconcile summary, continuity metadata, packet status, acceptance rows, tasks and evidence before closure. |
| F008 | P2 | maintainability | doc-frontmatter.ts:93-103 closes on a newline followed by three dashes, so a line such as ---not-a-fence can truncate metadata. | Require a complete-line delimiter and add prefix/CRLF fixtures. |
| F009 | P2 | maintainability | advisor-local shared-payload.ts:291-304 accepts startup_brief and session_snapshot that the canonical context contract does not; the current producer emits advisor only. | Remove unused values or declare a local-only contract with parity tests. |
| F010 | P2 | correctness | fanout-run.cjs:693-719 applies unique before comparing state iterations with 1..cap; a complete range plus a duplicate can pass. | Reject duplicate state iteration numbers before set comparison and add a complete-range duplicate fixture. |
| F011 | P2 | security | auto-select.ts:446-451 persists dimension 0 for an unlisted HF model, while profile.ts:195-215 defaults every hf-local model to 768 before first embed resolves the true dimension. | Define one unknown/provisional contract or require an explicit dimension for custom startup profiles. |
| F012 | P1 | security | corpus.mjs:174-245 records a Markdown symlink by repository-relative link path without checking its real target is inside repoRoot; generate-trigger-index.mjs:116-121 reads through that link. | Reject out-of-tree Markdown symlinks or publish explicit provenance, preferably fail closed. |

### P1 adjudication

- F001: Claim—public retrieval can omit dotted documents that the shared lane
  searches. Evidence—rg-wrapper.mjs:68-154 and rg-lane.mjs:29-50, with the
  wrapper parity probe. Counterevidence sought—shared builders, focused parity
  test and current wrapper execution contract. Final severity P1,
  confidence 0.96. Downgrade only if wrapper and lane are intentionally
  separate corpora with an explicit contract and fixture.
- F004: Claim—availability does not prove model identity. Evidence—
  hf-local.ts:679-705, 814-832 and auto-select.ts:246-250, 437-458, plus the
  server's mismatch response. Counterevidence sought—health-model parsing,
  readiness latch and request model propagation. Final severity P1,
  confidence 0.95. Downgrade only if a preflight identity check is added or
  the mismatch is documented as an intentional non-availability state.
- F007: Claim—packet completion metadata can mislead an operator about closure.
  Evidence—implementation-summary.md:11-99, spec.md:18-33,
  acceptance-criteria.md:39-60 and tasks.md:44-70. Counterevidence sought—
  current status, acceptance and task evidence. Final severity P1,
  confidence 0.99. Downgrade only after all closure surfaces agree and the
  evidence rows are populated.
- F012: Claim—an external Markdown file can enter a committed trigger index
  through an in-tree symlink. Evidence—corpus.mjs:174-245,
  generate-trigger-index.mjs:116-121 and the in-tree-only fixture at
  trigger-index.vitest.ts:308-324. Counterevidence sought—directory-link
  pruning, realpath deduplication and a canonical-target containment check.
  Final severity P1, confidence 0.97. Downgrade only if corpus roots are
  constrained to trusted real paths or external symlink provenance is explicit.

## Iteration record

| Iteration | Focus | New P0/P1/P2 | Carried open | Verdict |
|---:|---|---|---:|---|
| 1 | retrieval recipe parity and CLI boundaries | 0/1/2 | 3 | CONDITIONAL |
| 2 | embedding authorization, model identity and IPC boundaries | 0/1/2 | 6 | CONDITIONAL |
| 3 | packet requirements, acceptance evidence and completion metadata | 0/1/0 | 7 | CONDITIONAL |
| 4 | parser contracts, payload types, mirrors and decommission documentation | 0/0/2 | 9 | CONDITIONAL |
| 5 | forced-depth state integrity, executor guards and containment | 0/0/1 | 10 | CONDITIONAL |
| 6 | provider factory, registry and custom-model dimensions | 0/0/1 | 11 | CONDITIONAL |
| 7 | retrieval ranking, determinism and corpus boundaries | 0/1/0 | 12 | CONDITIONAL |
| 8 | command/template mirrors and decommission residue | 0/0/0 | 12 | CONDITIONAL |
| 9 | cross-domain adversarial carried-finding revalidation | 0/0/0 | 12 | CONDITIONAL |
| 10 | final packet and lineage reconciliation | 0/0/0 | 12 | CONDITIONAL |

The last three passes added no independent finding. That stability was recorded
as telemetry only; it did not terminate the loop before iteration 10.

## Traceability and blocked gates

- spec_code: partial. The packet's deterministic, residue-safe and closure
  claims remain contradicted by the active findings.
- checklist_evidence: blocked. No root checklist.md exists.
- feature_catalog_code: blocked for execution in this lineage.
- playbook_capability: blocked for execution in this lineage.
- The packet acceptance criteria remain Unmet, tasks T006-T010 remain unchecked,
  and the implementation summary remains a template scaffold.
- Repository-wide residue, strict packet validation, trigger-index
  byte-identical regeneration, doctor route validation, mirror checks, process
  checks and live integration evidence are not claimed.

## Lineage artifact proof

Confirmed by read-only inspection after the ten passes:

- deep-review-config.json, deep-review-findings-registry.json,
  deep-review-strategy.md, deep-review-dashboard.md, resource-map.md and this
  report exist at the bound lineage root.
- prompts/iteration-001.md through iteration-010.md, iterations/iteration-001.md
  through iteration-010.md and deltas/iter-001.jsonl through iter-010.jsonl
  exist.
- Every iteration document ends with exactly one recognized Review verdict line.
- All ten iteration state records contain the required timing, route, finding,
  depth and lineage fields. Every v2 search-ledger row has structured actions
  and exactly one disposition-specific link.
- The state and delta JSONL files parse as JSONL. The registry reports the
  reconciled active total P0=0, P1=4, P2=8.
- Early lineage records were normalized inside this lineage during reconciliation
  to add required timing and v2 ledger fields; their evidence, findings and
  iteration order were preserved.

No claim above means the repository's own validators or tests passed. Those
checks remain search debt under the user-specified write boundary.

## Synthesis

The review completed phase_init, phase_main_loop through the configured ceiling,
and phase_synthesis in the detached fan-out lineage. The terminal event is
maxIterationsReached. Because active P1 findings remain, release readiness is
release-blocking and the packet cannot satisfy its no-P0/no-P1 closure criterion.


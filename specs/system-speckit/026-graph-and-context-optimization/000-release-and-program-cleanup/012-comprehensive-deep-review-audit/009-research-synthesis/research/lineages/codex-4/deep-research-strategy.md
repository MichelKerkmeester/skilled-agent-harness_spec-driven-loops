# Deep Research Strategy - codex-4

## 1. OVERVIEW

This lineage investigates root causes and blast radius behind the eight-slice deep-review audit. It is read-only with respect to reviewed code and writes only to this lineage artifact directory.

## 2. TOPIC

Root-cause synthesis of the system-spec-kit / 026 comprehensive deep-review audit.

## 3. KEY QUESTIONS (remaining)

- [x] Q1. Are schemas, handlers, docs, and catalog/playbook maintained from divergent sources of truth, and is there a generator or contract that would close most doc/schema-to-code drift?
- [x] Q2. Is metadata drift a generate-context / graph-metadata-backfill systemic defect or mostly isolated edits, and how many packets appear affected?
- [x] Q3. Do entity-density cache staleness and atomic-save ordering corrupt retrieval or graph-channel routing under normal single-user operation?
- [x] Q4. Under the local single-user MCP threat model, should the two P0 scope/auth findings remain P0 or be recalibrated?
- [x] Q5. Did deep-loop fan-out reliability defects make prior review or research artifacts suspect?

## 4. NON-GOALS

- Implementing fixes.
- Repeating every per-slice finding without synthesis.
- Writing outside this lineage artifact directory.

## 5. STOP CONDITIONS

- Each key question is answered with cited evidence or explicitly marked UNKNOWN.
- Additional iterations produce little new evidence and no remaining high-value unresolved root-cause question.

## 6. ANSWERED QUESTIONS

- Q1 answered in iteration 1: drift is caused by divergent source-of-truth maintenance across schemas, docs, handlers, and catalog/playbook surfaces. A contract generator or round-trip test boundary would close more than a one-off doc fix.
- Q2 answered in iteration 2: metadata drift is systemic. A read-only classifier found 163 strong 026 status contradictions, and the graph metadata parser ignores spec metadata-table status while falling back to implementation-summary/checklist signals.
- Q3 answered in iteration 3: entity-density staleness is a transient graph/degree routing correctness bug for `memory_update`; atomic save ordering creates a durable DB/file inconsistency window when indexing commits before pending-file promotion.
- Q4 answered in iteration 4: the two scope/auth P0s should be conditional P0s. They are P0 for governed or multi-tenant isolation claims, but P1 under the default trusted local stdio single-user model.
- Q5 answered in iteration 5: prior review content is usable as evidence, but orchestration/provenance claims are suspect and should not be used as release-gate proof until fan-out is fixed and rerun.

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

- Registry-first synthesis, followed by direct reads of representative schema/doc/handler paths, exposed the repeated drift pattern quickly. (iteration 1)
- Combining a broad read-only status scan with direct samples exposed the metadata blast radius without rewriting packet files. (iteration 2)
- Separating transient cache freshness from durable persistence ordering gave a sharper Q3 severity split. (iteration 3)
- Reading runtime trust-boundary comments alongside scoped-governance code prevented over- and under-classifying the P0 scope findings. (iteration 4)
- Counting lineage reports, registries, logs, and completion sentinels separated content trust from orchestration trust. (iteration 5)

## 8. WHAT FAILED

- Searching for a single broken generator did not explain all drift classes; several surfaces are independently authored. (iteration 1)
- Raw equality checks on status strings were noisy; classifying status prose into broad states was necessary. (iteration 2)
- The original cache finding language sometimes over-included delete; direct reads showed lower-level single delete already invalidates entity-density. (iteration 3)
- Registry-only severity labels hid the default-stdio versus governed-mode distinction. (iteration 4)
- Orchestration summaries were too thin to reconstruct what actually ran; status ledgers and lineage directories had to be cross-checked. (iteration 5)

## 9. EXHAUSTED APPROACHES (do not retry)

- One stale operator doc page as the root cause: too narrow, because representative drift crosses public schemas, Zod schemas, runtime forwarding, docs, catalog assertions, and skill governance docs. (iteration 1)
- Metadata drift as only a stale parent pointer: too narrow, because strong status contradictions recur across many 026 child packets and at least one 027 launch packet. (iteration 2)
- Entity-density staleness as durable data corruption: too strong; the durable inconsistency is the atomic save DB-before-promotion window. (iteration 3)
- "Trusted stdio means no scoped-security bug": false once callers provide governed scope fields. (iteration 4)
- Discarding all prior fan-out review content: too strong; the weak layer is orchestration/provenance, not the existence of per-lineage reports. (iteration 5)

## 10. RULED OUT DIRECTIONS

None yet.

## 11. NEXT FOCUS

Synthesis: consolidate Q1-Q5 into root causes, severity calibration, remediation order, and caveats.

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- `resource-map.md` is not present in the research-synthesis spec folder; skipping coverage gate.
- The charter lists five root-cause questions and references eight sibling review slices.
- The eight merged review registries report 68 open findings: 3 P0, 47 P1, and 18 P2.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Session ID: fanout-codex-4-1780597406874-fpys3k
- Current generation: 1
- Started: 2026-06-04T18:25:37Z

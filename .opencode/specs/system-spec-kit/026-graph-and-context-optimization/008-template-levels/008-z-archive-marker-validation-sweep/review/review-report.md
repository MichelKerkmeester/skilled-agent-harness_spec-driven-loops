# Deep Review Report — 008-z-archive-marker-validation-sweep

| Field | Value |
|-------|-------|
| **Target** | `system-spec-kit/026-graph-and-context-optimization/008-template-levels/008-z-archive-marker-validation-sweep` |
| **Executor** | native Claude Opus 4.7 (single-pass, post-hoc native review) |
| **Reviewed** | 2026-05-04 |
| **Iterations** | 1 (single-pass native review; not the YAML 5-iteration loop) |
| **Verdict** | **CONDITIONAL — no implementation to review** |
| **Stop reason** | scaffoldOnly (target has no implementation surface) |
| **JSONL final counts** | P0=0, P1=4, P2=2 |

---

## Executive Summary

The 008 packet is a Level 3 scaffold-only stub. spec.md, plan.md, tasks.md, implementation-summary.md, decision-record.md, and checklist.md are **all unmodified Level 3 template renders** from 2026-05-02 with bracketed placeholders for every requirement, acceptance criterion, file ledger entry, risk row, user story, and complexity score. The continuity frontmatter on every doc carries the scaffold defaults (`last_updated_by: "template-author"`, `recent_action: "Initialized Level 3 template"`, `next_safe_action: "Replace continuity placeholders"`, `completion_pct: 0`, `session_id: "scaffold-scaffold/..."`, all-zero fingerprint).

There is no implementation surface to audit. This review therefore evaluates the **scaffolding itself** and the packet's **fitness as a 010 phase child** rather than implementation-vs-spec alignment.

The Findings below mirror what cli-copilot's deep-review of the sibling packet 007 flagged (F001–F004): a target packet that ships as scaffold-only is structurally indistinguishable from "not started" but is being treated by 010's phase manifest as a phase that needs to ship before 010 closes.

---

## Findings

### P0 Findings

None. No exploit, auth bypass, destructive data loss, or runtime corruption. The packet does not run code.

### P1 Findings (Blocking CONDITIONAL verdict)

#### P1-001 — Target packet is a 100% scaffold stub three days after creation
- **Dimension**: implementation-spec-alignment
- **Evidence**:
  - `spec.md:80` Problem Statement is `[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]`
  - `spec.md:116` REQ-001 is `[Requirement description]` with `[How to verify it's done]`
  - `spec.md:104` Files-to-Change row is `[path/to/file.js] | [Modify/Create/Delete] | [Brief description]`
  - `tasks.md:53-77` T001-T010 are template defaults (`Create project structure`, `Install dependencies`, `[Implement core feature 1]`)
  - `implementation-summary.md:59,72` What-Was-Built and Files-Changed are placeholders
  - All seven docs share continuity frontmatter `packet_pointer: "scaffold/008-z-archive-marker-validation-sweep"`, `completion_pct: 0`, `recent_action: "Initialized Level 3 template"` (last touched 2026-05-02T09:34:31Z, ≥3 days stale)
- **Impact**: The packet is structurally indistinguishable from "scaffolded but never started." If 010's phase manifest treats 008 as a phase that must ship, 010 cannot close honestly with this state on disk.
- **Recommendation**: Either (a) populate spec.md sections 2–11 with real z-archive marker validation requirements and acceptance criteria before any subsequent review treats 008 as a target, or (b) downgrade/delete 008 from 010's phase manifest until it has actual scope.
- **Finding class**: scope-honesty
- **Affected surfaces**: `010 phase parent spec.md`, `010 graph-metadata.json`, `description.json:lastUpdated`, `010 release readiness`

#### P1-002 — `graph-metadata.status: "planned"` while packet is bundled into 010's exit criteria
- **Dimension**: implementation-spec-alignment
- **Evidence**:
  - `008/graph-metadata.json:status` = `"planned"`
  - `010/graph-metadata.json` lists 008 as a child phase
  - `description.json:lastUpdated` is `2026-05-02T09:34:31.278Z` (no progress since)
  - `description.json:memorySequence` is `0`
- **Impact**: Resume / context-recovery flows that read `graph-metadata.status` see `planned` and report 008 as ready to start, but no plan or tasks exist beyond template defaults. A future operator (or AI agent) who picks 008 up will have to choose between authoring scope from scratch or following the placeholder notation as if it were real.
- **Recommendation**: Add a `_memory.continuity.blockers` entry on 008's spec.md noting "scope authorship not started — see 010 parent for context" and update `description.json:description` from the slug-only string `"z-archive-marker-validation-sweep"` to a real sentence, OR mark the packet `status: deferred` / `status: scaffold-only` if 010 does not need 008 to ship.
- **Finding class**: continuity-honesty
- **Affected surfaces**: `graph-metadata.json status semantics`, `/spec_kit:resume` ladder, `description.json registry`

#### P1-003 — `validate.sh --strict` fails with TEMPLATE_HEADERS + ANCHORS_VALID errors (same defect as 003/006/007)
- **Dimension**: validator-coverage
- **Evidence**:
  - Running `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <008> --strict` exits 2 with `Errors: 2  Warnings: 0`
  - Failed rules: `TEMPLATE_HEADERS: 1 template headers issue(s) found`, `ANCHORS_VALID: 1 template anchors issue(s) found`
  - Identical errors observed on sibling 003/006/007 packets
- **Impact**: Either (a) the four Level 3 phase children share an authoring defect (template-source headers wrong since scaffold), or (b) the validators have a false-positive on the Level 3 scaffold output. Either way, no Level 3 phase under 010 currently passes strict validation.
- **Recommendation**: Bisect: run the check-template-headers.sh and check-anchors.sh helpers on a freshly scaffolded Level 3 packet. If errors reproduce on a clean scaffold → template defect; fix the template. If they reproduce only on these four packets → packet-author defect; auto-correct via re-scaffold. Either way, gate this fix at the template-system level rather than per-packet.
- **Finding class**: cross-consumer
- **Affected surfaces**: `templates/manifest/spec.md.tmpl`, `check-template-headers.sh`, `check-anchors.sh`, `Level 3 packets in 010`

#### P1-004 — Continuity frontmatter ships scaffold defaults that silently anchor downstream consumers to a non-existent session
- **Dimension**: cross-runtime-mirror-consistency
- **Evidence**:
  - All 7 docs have `_memory.continuity.session_dedup.session_id: "scaffold-scaffold/008-z-archive-marker-validation-sweep"`
  - All 7 docs have `_memory.continuity.session_dedup.fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"`
  - `_memory.continuity.last_updated_by: "template-author"` rather than a real session author
- **Impact**: Memory-search / continuity-recovery / dedup tooling that uses these fingerprints will collide with every other packet that retains scaffold defaults (sibling 003/006/007 likely identical). Cross-packet dedup is silently broken for the scaffold cohort.
- **Recommendation**: Enforce in `create.sh` that scaffold continuity blocks contain a synthetic-but-unique fingerprint (e.g., sha256 of the slug + creation timestamp) so that scaffold packets do not share dedup keys. Treat the all-zero fingerprint as a validator P1.
- **Finding class**: cross-consumer
- **Affected surfaces**: `create.sh` continuity scaffold block, `memory_save` dedup logic, sibling Level 3 scaffold packets

### P2 Findings (Advisory)

#### P2-001 — `description.json:keywords` is a single-element list of the slug
- **Evidence**: `description.json:keywords = ["z-archive-marker-validation-sweep"]`
- **Recommendation**: Either make scaffold `keywords` empty (signaling "not authored") or seed two real keywords from the slug split (`"z-archive"`, `"marker-validation"`) so semantic search has something to match.

#### P2-002 — `description.json:level: "3"` is a string while peer packets use integer
- **Evidence**: `008/description.json:level = "3"` (quoted string); other packets in 026 use unquoted `3`
- **Recommendation**: Normalize via `generate-description.js` — a one-line schema fix prevents future graph queries from string-vs-int mismatches.

---

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | notApplicable | No code. Single-pass scope review only. |
| `checklist_evidence` | notApplicable | Checklist is a placeholder template; no real items to evidence. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No skill or agent under review. |
| `agent_cross_runtime` | notApplicable | No mirror surface to compare. |
| `feature_catalog_code` | notApplicable | No catalog. |
| `playbook_capability` | notApplicable | No playbook. |

---

## Deferred Items

- A real implementation-vs-spec deep-review of 008 is deferred until the spec is authored. When that happens, re-run `/spec_kit:deep-review:auto` (5 iterations on copilot/gpt-5.5 with `--reasoning-effort high`) against the populated packet.

---

## Audit Appendix

- **Iteration files**: none (single-pass native review; no per-iteration markdown materialized)
- **Delta files**: none
- **State log**: `review/deep-review-state.jsonl` not authored by this review — the YAML loop did not run today; restored review/ contents are from a prior commit
- **Stop reason**: `scaffoldOnly`
- **Coverage**: 5/5 review dimensions covered conceptually (implementation-spec-alignment, code-correctness, template-rendering-correctness, validator-coverage, cross-runtime-mirror-consistency); 4/5 reduced to "no implementation" findings
- **Provenance note**: this report was authored directly by Claude Opus 4.7 in the orchestrator session after cli-copilot rate-limit and cli-codex/opencode+deepseek dispatches failed to produce artifacts for 008. The native review intentionally mirrors the format used by the other 7 phase reports for cross-phase comparability.

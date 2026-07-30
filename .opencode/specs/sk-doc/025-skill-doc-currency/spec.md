---
title: "Feature Specification: skill-doc-currency"
description: "Skill-level documentation across twelve skill roots describes executors, canon, routing and hub surfaces that no longer match the code, the registries or the installed CLI binaries. This phased packet repairs the documents and installs the derivation mechanisms that stop them re-rotting."
trigger_phrases:
  - "skill doc currency"
  - "sk-create-skill canon"
  - "executor roster drift"
  - "skill readme drift"
  - "hub surface drift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored phase-parent spec from the track (e) synthesis proposal"
    next_safe_action: "Operator resolves Q1-Q7, then scaffold child 001 and 002 (wave 1)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Q1 — fold the unsound RE-004-02 refutation into child 001's edit?"
      - "Q2 — bring the two unaudited CLI packets into scope?"
      - "Q3 — how are the 14 registry-supplementary findings handled?"
      - "Q4 — Codex hook drift is user-global machine state, run separately?"
      - "Q5 — system-code-graph: decommission or restore?"
      - "Q6 — four children, or collapse 003+004 into one?"
      - "Q7 — who owns the shared link-resolver and count-derivation helpers?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: skill-doc-currency

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc` |
| **Predecessor** | `sk-doc/021-benchmark-naming-and-playbook-results` |
| **Successor** | None |
| **Handoff Criteria** | Every child validates `--strict` at Errors: 0, the fleet gate re-baseline is recorded before any no-regression claim, and every scheduled finding ID is either repaired or explicitly dispositioned with evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill-level documentation — the `SKILL.md`, `README.md`, `references/**` and `assets/**` that agents read before acting — has drifted away from the code, registries and installed binaries it describes. A ten-iteration research loop over twelve skill roots produced 74 active findings, and they do not split into the two buckets the program anticipated. Roughly 60 are currency drift (a doc describes logic that has since changed), 11 are canon self-contradiction (the `sk-create-skill` doctrine contradicts its own executable contract module, so every skill authored from the template inherits the defect), and only 3 are true structural template violations. The drift is not cosmetic: a document that denies the existence of a CLI flag the installed binary ships causes a degraded dispatch rather than a visible error, and a canon that contradicts its own validator makes conformance unfalsifiable.

Two structural facts make this urgent rather than merely untidy. First, the fleet gate premise is stale — `parent-skill-check.cjs` currently FAILs on one of the eleven hub roots, so every "no regressions" claim made against a remembered 11/11 baseline is unfalsifiable until the gate is repaired and re-baselined. Second, four separate documents publish the same malformed three-item executor list whose first and third entries are the identical string, which is the signature of one bad find-and-replace surviving in four places because no single document owns the roster.

### Purpose

Every statement a skill document makes about an executor, a canon rule, a routing path, a count or a file location is either derived from the authority that owns it or links to that authority — and the mechanisms that make re-rot detectable ship alongside the text repairs.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Documentation currency repair across twelve skill roots: `cli-external-orchestration`, `system-deep-loop`, `mcp-code-mode`, `mcp-tooling`, `sk-doc`, `sk-code`, `sk-design`, `sk-git`, `sk-prompt`, `system-skill-advisor`, `system-spec-kit`, and the `.opencode/install-guides/` install surface.
- Canon self-consistency repair inside `sk-doc/sk-create-skill` — the authority every other child in this packet cites when deciding whether a document conforms.
- Derivation and detection mechanisms that make re-rot visible: versioned CLI help fixtures, a prose-versus-module conformance test, a relative-link resolver, a dangling-symlink check, and cardinality assertions.
- Repair of the `mcp-tooling` leaf manifest so the fleet gate returns to green, and capture of the true fleet pass count as the program baseline.
- Audit of the two CLI packets that carry zero findings across all ten iterations, subject to **[OPERATOR-DECISION: Q2 — unaudited CLI packets]**.
- Triage and repair of 14 registry-supplementary findings that collided on the registry's file+title dedupe and therefore sit outside the 74, subject to **[OPERATOR-DECISION: Q3 — supplementary findings]**.

### Out of Scope

- `README.md` files inside *code* folders — owned by the track (a) packet; the boundary is that the README template governs `.opencode/skills/[skill-name]/README.md` and nothing below a code directory.
- `feature-catalog/**` leaves — owned by the track (c) packet, including the fan-out catalog entry ceded below.
- Deep-loop roster, lane and adapter counts plus deep-loop link rot — owned by the whole-system-gate docs-drift child. This packet owns executor *kind* lists in the same files; the two are disjoint line sets and the overlap is a named merge hazard.
- Code conformance (comment hygiene, header shape, portability) — owned by the track (b) packet. If the Copilot ruling in child 001 resolves to "register" rather than "retire", that becomes a code change and routes there instead.
- Repairing the operator's user-global Codex hook installation. The drift is real and detectable, but it is machine state, not a repository defect — see the dispositions table and **[OPERATOR-DECISION: Q4 — Codex hook drift]**.
- Any change to `skill-root-metadata-contract.cjs` or `scorer-eval-baseline.json` as a way of making prose true. These are authorities; prose defers to them.

### Files to Change

Summary across all phases; per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/cli-external-orchestration/{cli-claude-code,cli-codex,cli-cursor,cli-devin}/references/**` | Modify | 001 | Flag tables, invocation forms and permission/model surfaces regenerated from versioned CLI help fixtures |
| `.opencode/skills/cli-external-orchestration/{cli-opencode,cli-pi}/**` | Modify | 001 | New-audit surface; carries the two synthesis-discovered gaps |
| `.opencode/skills/system-deep-loop/**/{SKILL.md,references/**}` | Modify | 001 | Executor-kind lists derived from the executor schema and the council allowlist |
| `.opencode/commands/deep/assets/deep-*-{auto,confirm}.yaml` | Modify | 001 | Copilot branch disposition |
| `.opencode/skills/{mcp-code-mode,mcp-tooling}/**` | Modify | 001 | Tool catalog, namespace examples, hub topology, leaf manifest |
| `.opencode/skills/sk-doc/sk-create-skill/{SKILL.md,references/**,assets/**,scripts/**}` | Modify | 002 | Canon prose deferred to the executable contract; conformance test added |
| `.opencode/skills/sk-doc/{README.md,shared/references/**,mode-registry.json}` | Modify | 002 | Hub README, default fallback resource, orphaned router, alias case |
| `.opencode/skills/system-skill-advisor/**` | Modify | 003 | Validation gates, hook topology, self-description |
| `.opencode/skills/system-spec-kit/references/{config,hooks,workflows,cli}/**` | Modify | 003 | Hook topology mirror-image defect, CLI count single-sourcing |
| `.opencode/skills/sk-prompt/**` | Modify | 003 | Model roster, iteration cap, reference structure |
| `.opencode/skills/sk-git/{references/**,assets/**,scripts/hooks/**}` | Modify | 003, 004 | Hook-adapter contracts and safety-contract honesty (003); worktree recipes, counts and integration contradictions (004) |
| `.opencode/skills/{sk-code,sk-design}/**` | Modify | 004 | Human-versus-machine resource maps, retired lane ownership, cardinality, version pins |
| `.opencode/install-guides/**` | Modify | 004 | Dangling symlinks, derived counts, installer paths |
| `.opencode/skills/sk-doc/shared/scripts/` | Create | 001 or 004 | Shared link-resolver and count-derivation helpers, subject to **[OPERATOR-DECISION: Q7 — shared tooling ownership]** |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-executor-and-dispatch-contract-truth/` | Every document that tells an agent which external executor exists and how to invoke it. Level 3, 22 items. Carries the fleet-gate repair and the program baseline | Planned |
| 2 | `002-create-skill-canon-self-consistency/` | The `sk-create-skill` authority that contradicts its own executable contract module, plus the `sk-doc` hub's own default routing surface. Level 3, 22 items | Planned |
| 3 | `003-routing-advisor-and-hook-truth/` | Skill-advisor gates and topology, hook-adapter contracts across four runtimes, prompt-model roster, CLI count authorities. Level 3, 22 items | Planned |
| 4 | `004-hub-surface-drift-sweep/` | Link rot and orphaned ownership language left across `sk-code`, `sk-design`, `sk-git` and the install surface. Level 2, 20 items | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **Wave 1 = `001` ∥ `002`.** Neither is blocked. `001` runs the fleet-gate repair as its first action, which is what makes every later baseline honest.
- **Wave 2 = `003` ∥ `004`,** each soft-blocked on `002`'s canon ruling. The block is soft because it is wasteful, not unsafe, to enforce a conformance rule that is itself about to change. If `002`'s ruling is delayed, `003` and `004` may start their confirm-against-HEAD and baseline-capture tasks, and must stop before any edit that cites a canon rule.
- No child may claim "no regressions" against a remembered fleet-gate pass count. The re-baseline captured in `001` is the only admissible anchor.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| — | 001 | Fleet gate is red at start and the true pass count is unknown | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs <root>` over all 11 roots, count recorded verbatim |
| 001 | 003, 004 | Fleet gate green and re-baselined; corruption-sweep count recorded | Re-run over all 11 roots → recorded pass count; `rg -c` sweep count recorded before and after |
| 002 | 003 | Canon rulings signed: the numbered-OVERVIEW rule and the reference-template shape are settled | `002/decision-record.md` status is Accepted for the rulings `003` cites |
| 002 | 004 | Same canon rulings signed | `002/decision-record.md` status is Accepted for the rulings `004` cites |
| 001 | 004 | Shared helper ownership settled so two children do not ship two link resolvers | One helper present under `sk-doc/shared/scripts/`, or an explicit consumer edge recorded |
| all | parent | Every child at Errors: 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <parent> --recursive --strict` |
<!-- /ANCHOR:phase-map -->

---

## 4. COVERAGE ARITHMETIC

The registry holds `findingsCount = 74`, `len(findings[]) = 74`, 74 unique IDs, plus 4 `refuted[]` and 14 `repeated[]` entries that are outside that total by construction. This packet schedules or dispositions every one of them, plus two findings the synthesis discovered directly.

### The 74 active registry findings

| Target | Count |
|--------|------:|
| `001-executor-and-dispatch-contract-truth` | 20 |
| `002-create-skill-canon-self-consistency` | 15 |
| `003-routing-advisor-and-hook-truth` | 18 |
| `004-hub-surface-drift-sweep` | 17 |
| Ceded to the track (c) feature-catalog packet | 1 |
| Ceded to the whole-system-gate docs-drift child | 2 |
| Disposition D1 — no repair work | 1 |
| **Subtotal** | **74** |

### Additions

| Source | Count | Target |
|--------|------:|--------|
| Synthesis-discovered new findings `E-NEW-01`, `E-NEW-02` | 2 | `001` |
| Registry-supplementary findings `RE-006-02` … `RE-006-15` | 14 | `002` ×7, `003` ×4, `004` ×3 |

### Program total

```
 74 registry findings
+  2 synthesis-discovered new findings
+ 14 registry-supplementary findings
─────────────────────────────────────
= 90 items, of which 86 sit in a child scope table and 4 are dispositioned outside the children
```

Per-child scope-table totals: `001` = 20 + 2 = **22**; `002` = 15 + 7 = **22**; `003` = 18 + 4 = **22**; `004` = 17 + 3 = **20**. Sum = **86**. Plus 1 ceded to track (c), 2 ceded to the whole-system-gate child, and 1 disposition D1 = **90**. Every ID appears in exactly one child scope table or in exactly one dispositions row; none appears in both.

---

## 5. DISPOSITIONS

Nothing is silently dropped.

| Item | Disposition |
|------|-------------|
| `RE-004-09` — the fan-out catalog leaf claims an obsolete three-CLI surface | **Ceded to the track (c) feature-catalog packet.** Same file, same verbatim quote, independently confirmed by both tracks. Not re-proposed here. Coordination edge: the same fact about the model-benchmark dispatcher's executor count appears in a reference owned by child `001`; the reference is authoritative and the catalog leaf links to it |
| `RE-004-10` — the runtime README omits alignment from its consumer inventory | **Ceded to the whole-system-gate docs-drift child.** Exact duplicate of a finding already registered there |
| `RE-004-11` — the deep-research README carries a stale roster and a duplicated matrix label | **Roster half ceded to the whole-system-gate docs-drift child.** The duplicated-executor-label half is a one-line residual absorbed by child `001`'s pattern sweep in the same file. **Flagged as a merge hazard** — two packets touch this file and must not rewrite each other's lines |
| `RE-008-07` — the frozen census includes a path with no root `SKILL.md` | **D1 — no repair work.** Census hygiene, not a documentation defect: the scope manifest that listed it is a research artefact, not a repository file, so there is nothing in the repo to edit. Recorded here as a standing note — any future skill-root census must derive from "has a root `SKILL.md`". **[OPERATOR-DECISION: Q5 — system-code-graph]** |
| `RE-003-07` — Codex hook installation drift | **Operator-action-required, not a child task.** The `--check` run reports 8 missing current hooks and 7 orphaned paths at **user-global** scope. That is machine state on the operator's workstation, not a repository defect, and a documentation packet must not silently repair a global install. Child `003` documents the `--check` command and the project-versus-user-global distinction and stops there. **[OPERATOR-DECISION: Q4 — Codex hook drift]** |
| Refuted `RE-002-02`, `RE-003-03`, `RE-005-08` | **Do not resurrect.** All three refutations were independently re-confirmed by the synthesis; one of them was reproduced live |
| Refuted `RE-004-02` | **Not resurrected — but the refutation is unsound.** The refuter cited lines 63-66 of a decisions object that runs to line 68, so it cherry-picked its own citation range; the underlying drift is real and is the same defect as the un-refuted sibling finding in the adjacent `SKILL.md`. The ID stays closed; the file correction folds into child `001`'s edit for that sibling finding, with the refutation-audit rationale recorded in `001/spec.md`. **[OPERATOR-DECISION: Q1 — unsound refutation]** |
| The 14 `repeated[]` entries, `RE-006-02` … `RE-006-15` | **Admitted as registry-supplementary, not dropped.** They collided on the registry's file+title dedupe rather than on content: they are substantive iteration-6 findings carrying the same drifted schema as the one iteration-6 finding that did land in `findings[]`. Judged individually and routed to `002` (7), `003` (4) and `004` (3), each into its own supplementary sub-table, each marked confirm-first. One of them — the claim that a fail-open pre-push hook is presented as a reliable enforcement backstop — is **safety-relevant** and is routed to `003` with a reproduce-before-edit requirement. One of them partially duplicates a scheduled finding; that overlap is recorded in the child's dispositions rather than double-scheduled. **[OPERATOR-DECISION: Q3 — supplementary findings]** |
| The loop's 30 open questions | Not dropped. 12 fold into named decision-record items or into child `004`'s pre-edit fork list; 6 are the same question asked twice by different iterations; 8 require live authenticated calls and become explicit tasks in `001` and `004`; 4 are answered by the synthesis itself |

---

## 6. OPERATOR DECISIONS

Every decision-dependent element in this packet carries a visible `[OPERATOR-DECISION: Q<n> — <label>]` tag naming its question. The full table with recommendations, blast radius and tag locations lives in the package `MANIFEST.md`; the questions themselves are restated below so the packet is self-contained once copied.

| ID | Question | Recommendation |
|----|----------|----------------|
| **Q1** | The `RE-004-02` refutation is unsound. Fix the file anyway? | Yes — inside child `001`'s edit for the sibling finding, without reopening the ID |
| **Q2** | Bring the two zero-finding CLI packets into scope? | Yes — otherwise "the CLI docs are now accurate" is a claim the evidence cannot support |
| **Q3** | What happens to the 14 registry-supplementary findings? | Triage now and fold into `002`/`003`/`004` as supplementary sub-tables, with the hook-adapter and safety items verified individually rather than batch-edited |
| **Q4** | The Codex hook drift is user-global machine state | Run it separately, outside this packet, at a time the operator chooses |
| **Q5** | `system-code-graph` — decommission or restore? | Needs an operator ruling; no repair work either way inside this packet |
| **Q6** | Four children, or three? | Four. If the phase-complexity score lands below 25, collapse `003`+`004` into one Level-3 packet with two lanes; `001` and `002` stay separate under any scoring |
| **Q7** | Who owns the shared link-resolver and count-derivation helpers? | One home under `sk-doc/shared/scripts/`, built by whichever child lands first, with the others declaring a consumer edge |

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the phase-complexity score for this decomposition at or above 25? The author's read is 30-34 — twelve skill roots, 90 items, one child that changes a canon consumed by every future skill, three children at Level 3 — but the score is the operator's to set, and it decides Q6.
- Does the malformed three-item executor list originate from a single global find-and-replace? Child `001` runs `git log -S` to settle it; if confirmed, the repair is one reverse sweep with a known pattern rather than N independent edits, and the sweep will surface instances no research leaf reported.
- Are the `002` canon rulings that `003` and `004` cite reachable within wave 1, or does wave 2 need to start on its non-canon tasks first?
- Does the whole-system-gate docs-drift child land before or after child `001`? Both touch one deep-research README; whichever lands second must rebase rather than overwrite.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

# Peck → system-spec-kit: Teachings Analysis

> What the external repo `gytis-ivaskevicius/peck` does well, which of those mechanisms map onto
> real gaps in `system-spec-kit`, and how spec-kit could adopt them — analysis only, no changes made.

| Field | Value |
|-------|-------|
| **Subject repo** | `gytis-ivaskevicius/peck` ([github.com/gytis-ivaskevicius/peck](https://github.com/gytis-ivaskevicius/peck)) |
| **Target system** | `system-spec-kit` (`.opencode/skills/system-spec-kit/`) |
| **Deliverable type** | Analysis / recommendations — **no behavioral change to spec-kit** |
| **Teachings covered** | T1 AC-coverage gate · T2 bounded reflection · T3 self-check/failure-modes · T4 current-state discipline |
| **Date** | 2026-06-02 |

---

## 1. Executive summary & verdict

Peck and spec-kit sit at opposite ends of the design spectrum. Peck is 466 LOC of suckless
minimalism: *"Complexity is a bug, every abstraction must justify itself… Two agents, no config, no
ceremony — those aren't missing features, they're the point"* (peck `README.md:5`). Spec-kit is a
maximalist, mature framework — a 4-level documentation contract, gated workflow, a 5-channel hybrid
retrieval memory MCP, FSRS decay, a causal graph, and ~141 env flags.

So the value is **not** peck's philosophy wholesale — adopting "no detailed plans" would gut a system
the team has invested heavily in. The value is a few **surgical mechanisms** peck implements cleanly
that close **genuine gaps** in spec-kit. The verdict per teaching:

| # | Teaching | Real gap in spec-kit? | Adopt-worthiness | Effort | Risk |
|---|----------|----------------------|------------------|--------|------|
| **T1** | AC-as-assertions + mechanical coverage gate | **Yes — biggest.** Completion is self-attested via one checkbox | **High** | Medium | Low–Med |
| **T2** | Bounded reflection + promotion-on-recurrence | **Partial.** Capture exists; curation/decay discipline does not | **High** | Low–Med | Low |
| **T3** | Self-check & failure-modes blocks | **Partial.** Exists in CLAUDE.md, absent from templates | **Medium** | Low | Very low |
| **T4** | "Current-state, not history" content discipline | **Partial.** Enforced for phase parents only | **Medium** | Low | Low |

The single highest-leverage borrow is **T1**: it hardens the weakest link in spec-kit's quality story
— the completion gate — by turning self-attestation into structural, per-criterion verification.

---

## 2. What peck is, and why we borrow mechanisms not philosophy

Peck orchestrates two agents — a **planner** (turns a request into a short story file) and an
**implementer** (writes code + tests, then self-verifies). Before a story can be marked done, **two
read-only reviewers must both pass**: an **acceptance reviewer** (≥90% of acceptance criteria covered
by automated tests) and a **code reviewer** (correctness/simplicity/security). Every agent output is
an empty git commit, so `git log` is the audit trail. A `reflect` skill distills durable learnings
after each task. Documentation is reactive: `product.md` describes only the current state, `AGENTS.md`
accrues patterns, `docs/learnings.md` holds incidents.

Peck's thesis — *"let the agent work freely against a clear spec, then catch mistakes structurally at
the end. The reviewers don't aspire to quality; they gate on it"* (`README.md:35`) — is the inverse of
spec-kit's prevent-upfront philosophy. We are not recommending spec-kit flip its stance (see §7,
Anti-teachings). We are extracting the four mechanisms below, each of which is **philosophy-neutral**:
they strengthen spec-kit on its own terms.

---

## 3. T1 — Acceptance criteria as assertions + a mechanical coverage gate

**Priority: HIGH · Effort: Medium · Risk: Low–Medium · Blast radius: completion gate + checklist template + one new validation rule**

### What peck does

- **ACs are written as testable assertions.** The story template formats each as
  `[precondition] + [action]` → `→ [observable outcome]` (peck `src/assets/templates/story.md:39-46`),
  and requires *"Each task's ACs must be verifiable by an automated test"* (`story.md:22`).
- **A separate read-only agent mechanically maps every AC to a test.** The acceptance reviewer reads
  the story and the test files side by side and classifies each AC as **Tested / Partially tested /
  Manual / Not covered**, citing `"test name" (file:line)` for each
  (peck `src/assets/agents/acceptance-reviewer.md:36-42`).
- **A coverage ratio gates completion.** *"A task passes if ≥90% of its ACs are covered:
  `covered ≥ floor(0.9 × task_ACs)`"* (`acceptance-reviewer.md:42`). The verdict is binary Pass/Fail and
  **blocking** — *"verifies ≥90% of acceptance criteria are covered by automated tests — blocking"*
  (`README.md:30`).
- **The rigor is anti-gaming.** *"Counting implementation existence as 'Tested'… A test that runs and
  calls the function but has weak or no assertions is **Not covered**… Passing tests don't guarantee
  spec compliance"* (`acceptance-reviewer.md:87-92`).

### The gap in spec-kit

Spec-kit already has most of the *ingredients* — this is not a from-scratch gap:

- `Given/When/Then` acceptance criteria exist in `spec.md` user stories at L3/L3+
  (`templates/manifest/spec.md.tmpl:532, 542, 772`), and an "Acceptance Criteria → [How to verify it's
  done]" column at L1/L2 (`spec.md.tmpl:88-97`).
- `EVIDENCE_CITED` wants `[Test: …]` / `[File: …]` / `[Commit: …]` evidence on non-P2 items
  (`references/validation/validation_rules.md:422-451`).
- A separate fresh-context reviewer exists as the `deep-review` loop (P0/P1/P2 findings).
- `COMPLETION VERIFICATION RULE` requires `validate.sh --strict` plus checklist verification (CLAUDE.md §2).

What's **missing** is the structural link peck makes:

1. **No per-AC → test mapping.** Coverage collapses to a *single self-ticked checkbox*:
   `CHK-020 [P0] All acceptance criteria met` (`templates/manifest/checklist.md.tmpl:72`). There is no
   per-criterion Tested/Not-covered classification.
2. **No coverage ratio or threshold.** Nothing computes `covered / total` or enforces a floor.
3. **Evidence is advisory, not blocking.** `EVIDENCE_CITED` is severity **WARNING**
   (`validation_rules.md:424`); it only becomes an error under `--strict`, and even then it checks that
   *an* evidence token exists — not that the evidence actually exercises the criterion.
4. **The gate is self-attested by the doer.** The same agent that did the work marks
   `[x]` "with evidence" (`checklist.md.tmpl` footer; CLAUDE.md §2). Peck's strength is that a
   *separate read-only agent* renders the verdict. Spec-kit *has* such an agent (`deep-review`) but does
   not bind completion to an AC-coverage verdict from it by default.

Net: spec-kit's completion gate is its softest link — it trusts a checkbox where peck computes a ratio.

### Recommendation (describe-only; not implemented here)

- **Adopt the assertion format consistently.** Make the L1/L2 "Acceptance Criteria" column use peck's
  `precondition + action → observable outcome` shape (or keep `Given/When/Then`) at *all* levels, so
  every criterion is mechanically checkable rather than prose like "how to verify it's done."
- **Add a coverage-mapping section to `checklist.md`.** Replace the single `CHK-020` with a per-AC
  table: `AC-id | classification (Tested/Partially/Manual/Not covered) | evidence (test name @ file:line)`.
- **Introduce an `AC_COVERAGE` validation rule** (conceptually) that parses that table, computes
  `covered / total`, and fails below a configurable floor (peck uses 0.9). Severity ERROR so it gates
  completion, with a documented `SPECKIT_AC_COVERAGE_FLOOR` flag and a "Manual — automation infeasible"
  escape hatch mirroring `acceptance-reviewer.md:39`.
- **Optionally bind it to `deep-review`** so the coverage verdict comes from a fresh-context reviewer,
  not the implementer — capturing peck's "separate read-only reviewer" property.

### Effort / risk

Medium effort: one new rule in `scripts/rules/` + `validator-registry.json`, a checklist template
change, and a CLAUDE.md completion-rule edit. Risk is low-to-medium: a new ERROR-severity rule can
block existing in-flight folders, so it would need a warn-only rollout window (which spec-kit already
does for `SPECKIT_SAVE_QUALITY_GATE`) and a per-level opt-in (Level 1 work may legitimately lack tests).

---

## 4. T2 — Bounded reflection + promotion-on-recurrence

**Priority: HIGH · Effort: Low–Medium · Risk: Low · Blast radius: a reflection step + constitutional-tier lifecycle**

### What peck does

- **A post-task `reflect` skill** runs after non-trivial work, asking six diagnostic questions
  (what slowed me down, what was I missing, what did the user correct…) (peck
  `src/assets/skills/reflect/SKILL.md:10-26`).
- **A hard "worth it" filter.** *"Start from the assumption that **nothing is worth logging**. Each
  candidate must earn its place"*, judged on **Durable? Reusable? Specific?** (`reflect/SKILL.md:30-36`).
- **A strict budget.** *"Log at most 5 items per session"* (`SKILL.md:42`) and *"Keep total entries in
  `docs/learnings.md` under 15… beyond that the log becomes hard to scan and the most important entries
  lose signal"* (`SKILL.md:61`).
- **Promotion on recurrence.** *"Has it already happened twice? → It's a pattern now. Promote to
  `AGENTS.md` and remove from learnings"* (`SKILL.md:50`). Standing guidance is *earned* by recurrence,
  and pruned when it stops being true (`SKILL.md:54-61`).

### The gap in spec-kit

Spec-kit captures aggressively but curates weakly:

- The save path scores **signal density** (5 weighted dimensions, threshold 0.4) and **semantic
  dedup** (cosine ≥ 0.92) in `mcp_server/lib/validation/save-quality-gate.ts`. These gate *noise and
  duplicates*, not *durability or recurrence* — a one-off, highly-specific incident scores well and is
  kept indefinitely.
- The index grows large (the exploration measured a 400MB+ `context-index.sqlite`); there is no
  bounded, curated "standing guidance" surface with a size cap analogous to peck's <15 learnings.
- The **constitutional tier is effectively permanent**: it is a set of 14 static markdown files
  (`constitutional/` — e.g. `verify-before-completion-claims.md`, `post-implementation-deep-review.md`)
  that are *exempt from decay* (FSRS skips them in `mcp_server/lib/cognitive/fsrs-scheduler.ts`) and
  always surface with a 3× boost. There is **no review or demotion path** — a rule that becomes stale or
  contradicted stays frozen at max relevance. Peck's loop, by contrast, prunes learnings that are "no
  longer true" and promotes/demotes between tiers continuously.

### Recommendation

- **Add an explicit post-task reflection ritual** to the completion workflow (analogous to peck's
  `reflect`), with the same three-filter "worth it" test (durable/reusable/specific) applied *before*
  a memory is written — complementing, not replacing, the signal-density gate.
- **Introduce a recurrence signal.** When the dedup/reconsolidation path sees the same learning a
  second time, flag it for **promotion** to a higher importance tier (or constitutional), mirroring
  peck's "happened twice → it's a pattern."
- **Give the constitutional tier a lifecycle.** A periodic review surface (a `/memory:manage`
  sub-action or a "constitutional-staleness" check) that lists constitutional rules with last-affirmed
  dates and flags contradiction candidates, so always-surface rules can be demoted or retired. This
  directly addresses the "never decays / never reviewed" property.
- **Consider a bounded, human-curated guidance file** (spec-kit's analog of `AGENTS.md`) with a soft
  cap, distinct from the unbounded searchable index.

### Effort / risk

Low-to-medium. The reflection ritual is mostly prompt/workflow text. The recurrence-promotion hook
touches `reconsolidation`/save handlers. The constitutional lifecycle is the most involved piece but is
additive (a new diagnostic), so risk stays low.

---

## 5. T3 — Self-check & failure-modes blocks in templates

**Priority: MEDIUM · Effort: Low · Risk: Very low · Blast radius: authored-doc templates + completion ritual**

### What peck does

Every agent prompt carries explicit, structured `<self-check>`, `<failure-modes>`, and `<avoid>`
sections. The planner audits its output against a checklist — *"Every acceptance criterion is verifiable
by an automated test… No guessed values — every decision traces to the codebase"* — plus named failure
modes: *"Treating the self-check as a rubber stamp — confirming output rather than auditing it"* (peck
`src/assets/agents/planner.md:62-75`). The acceptance/code reviewers each carry an `<avoid>` list of
known gaming patterns (`acceptance-reviewer.md:86-93`, `code-reviewer.md:28`).

### The gap in spec-kit

Spec-kit *has* a self-check — but it lives in the **global** CLAUDE.md ("Self-Check (before ANY
tool-using response)") and in scattered rules, **not in the authored-doc templates** the agent actually
fills. `templates/manifest/spec.md.tmpl`, `plan.md.tmpl`, and `checklist.md.tmpl` contain section
scaffolds and voice guides but no per-document "audit your own output against these failure modes"
block. The result: self-verification is a general instruction, not a structured ritual anchored to the
artifact being produced.

### Recommendation

- Add a short, document-specific `<self-check>` + `<failure-modes>` block to the manifest templates
  (e.g. spec.md: "every requirement has a measurable acceptance criterion; no placeholder survives;
  scope lists what is *out*"). Keep it to a few lines per template — peck's are 3–8 lines and high-yield.
- Mirror peck's anti-gaming framing in the completion ritual: name the failure mode ("treating the
  checklist as a rubber stamp") rather than only listing the steps.

### Effort / risk

Trivial and low-risk — it is additive template text. The only caution is `SECTION_COUNTS` /
`SECTIONS_PRESENT` validation: new sections must not collide with the required-section matcher
(`validation_rules.md:240-260`).

---

## 6. T4 — "Current-state, not history" content discipline

**Priority: MEDIUM · Effort: Low · Risk: Low · Blast radius: content rules + optional new validation check**

### What peck does

`product.md` *"only ever describes what currently exists, so it's always accurate"* (peck
`README.md:48`); its template explicitly asks for current features, non-goals, and "Known Limitations —
Honest, not aspirational" (`src/assets/templates/product.md`). History is offloaded to git and the
reflection log, not the living doc. The principle: **a document that mixes current state with migration
narrative rots and becomes a hallucination surface.**

### The gap in spec-kit

Spec-kit has already learned this lesson — **but only for one surface**. The `PHASE_PARENT_CONTENT`
rule forbids consolidation/migration narrative in a phase-parent `spec.md` (forbidden tokens
`consolidat*`, "merged from", "renamed from", `N→M`, "reorganization") and routes history to an
optional `context-index.md` (`validation_rules.md:153-179`; CLAUDE.md §3). The discipline is sound and
proven — but it is scoped to phase parents. Other canonical docs (`implementation-summary.md`,
non-parent `spec.md`) have voice guides ("lead with impact", "be honest") yet no enforced
current-state-only rule, so they can accrete "previously we did X, then changed to Y" narrative over a
folder's life.

### Recommendation

- **Generalize the principle** beyond phase parents: state in the relevant templates/rules that
  canonical docs describe the *current* state; cross-session history belongs in the changelog,
  `context-index.md`, or git — not inline.
- Consider extending the `PHASE_PARENT_CONTENT` scanner (or a sibling advisory rule) to flag
  migration-narrative tokens in `implementation-summary.md` of long-lived folders, at WARNING severity
  to avoid churn.

### Effort / risk

Low. The detector already exists and is code-fence/HTML-comment aware
(`scripts/rules/check-phase-parent-content.sh`); broadening its scope is incremental. Keep it advisory
(WARNING) to avoid false positives on legitimate retrospective sections.

---

## 7. Anti-teachings — what NOT to borrow

Peck's minimalism is coherent *for peck's assumptions* ("for developers… if you need guardrails, this
project isn't for you", `README.md:7`) and async, single-session, small-scope stories. Those
assumptions do not hold for spec-kit's role as a guardrailed, multi-agent, long-horizon continuity
system. Do **not** import:

- **"Detailed plans are an antipattern" / no upfront plan** (`README.md:62`). Spec-kit's plan/tasks/
  decision-record artifacts are the point of the system; removing them defeats its purpose.
- **Two agents, no config** (`README.md:5`). Spec-kit's routing, levels, and flags exist to serve a
  much broader surface than peck targets.
- **Git-as-sole-audit via empty commits** (`README.md:37`). Spec-kit's audit (changelogs,
  implementation-summary, `_memory.continuity`, eval DB) is already richer and not git-coupled;
  retrofitting empty-commit verdicts adds a parallel, weaker trail. (Noted and rejected, not in the
  four selected teachings.)

**One meta-lens worth keeping, out of scope here:** peck's *"every abstraction must justify itself"*
(`README.md:5`) is a useful audit question for spec-kit's ~141 env flags and 24 feature domains —
whether each still earns its place. That is a much larger, riskier review and is explicitly **not**
part of this analysis; flagged only so it isn't lost.

---

## 8. Suggested sequencing (if the team later pursues adoption)

This analysis recommends nothing be built now. *If* adoption is pursued, a low-risk order:

1. **T3 (self-check/failure-modes)** — trivial, additive template text; warms up the pattern.
2. **T4 (current-state discipline)** — generalize an existing, proven rule; advisory severity.
3. **T2 (bounded reflection + constitutional lifecycle)** — additive reflection ritual first, then the
   constitutional-staleness diagnostic.
4. **T1 (AC-coverage gate)** — last and largest: needs the assertion format (helped by T3), a checklist
   template change, a new `AC_COVERAGE` rule, a warn-only rollout window, and per-level opt-in. Highest
   value, so worth the care.

Each would be its own spec folder with its own plan, scope lock, and verification.

---

## 9. Appendix — source map

### Peck (verified against the cloned repo; quotes are exact)

| Claim | Source |
|-------|--------|
| Suckless philosophy; two agents | `README.md:5` |
| For developers, no guardrails | `README.md:7` |
| Acceptance reviewer ≥90%, blocking | `README.md:30` |
| Quality structural not aspirational | `README.md:33, 35` |
| Empty-commit audit trail | `README.md:37-42` |
| product.md only describes current state | `README.md:48` |
| Reflection captures the right 10%; "happens twice → pattern" | `README.md:52-56` |
| Detailed plans are an antipattern | `README.md:62` |
| "Does less because that's what works" | `README.md:86` |
| AC assertion format | `src/assets/templates/story.md:22, 39-46` |
| Coverage classification + `floor(0.9 × ACs)` | `src/assets/agents/acceptance-reviewer.md:36-42` |
| Anti-gaming (`<avoid>`) | `src/assets/agents/acceptance-reviewer.md:86-93` |
| Reflection filter / budget / promotion | `src/assets/skills/reflect/SKILL.md:30-36, 42, 50, 54-61` |
| product.md template (current-state, honest) | `src/assets/templates/product.md` |
| Self-check / failure-modes / constraints | `src/assets/agents/planner.md:62-79` |
| Rubric, "score ≥4 blocks" | `src/assets/agents/code-reviewer.md:66-68` |
| Escalation after 3 loops | `src/assets/agents/implementer.md:42-48` |

### system-spec-kit (paths relative to `.opencode/skills/system-spec-kit/`)

| Claim | Source |
|-------|--------|
| Completion = validate.sh --strict + checklist verify | `CLAUDE.md` §2 (Completion Verification Rule) |
| `EVIDENCE_CITED` is WARNING; evidence tokens | `references/validation/validation_rules.md:422-451` |
| Single "All acceptance criteria met" checkbox | `templates/manifest/checklist.md.tmpl:72` |
| L1/L2 AC column; L3/L3+ Given/When/Then | `templates/manifest/spec.md.tmpl:88-97, 532-542, 772` |
| Save quality gate (signal density 0.4, dedup 0.92) | `mcp_server/lib/validation/save-quality-gate.ts` |
| Constitutional tier exempt from decay | `mcp_server/lib/cognitive/fsrs-scheduler.ts` |
| 14 static constitutional rules, no review path | `constitutional/` (e.g. `verify-before-completion-claims.md`) |
| `PHASE_PARENT_CONTENT` rule + forbidden tokens | `references/validation/validation_rules.md:153-179`; `scripts/rules/check-phase-parent-content.sh`; `CLAUDE.md` §3 |
| Implementation-summary voice guide | `templates/manifest/implementation-summary.md.tmpl:51-57` |

---

*Analysis only. No spec-kit code, templates, validation rules, MCP server, or constitutional memory
were modified in producing this report.*

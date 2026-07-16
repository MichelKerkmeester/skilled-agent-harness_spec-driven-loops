# Command-Surface Improvement Research — glm52-max lineage

> **Lineage:** `glm52-max` (cli-opencode / zai-coding-plan/glm-5.2 / reasoning max)
> **Spec folder:** `066-command-surface-benchmark/012-command-improvement-research`
> **Loop:** deep-research, 5/5 iterations, stopPolicy `max-iterations` (convergence telemetry-only)
> **Scope:** research + synthesis only. No shipped runtime touched. All deltas are candidate proposals for follow-on remediation packets.
> **Grounding:** the create-command authoring canon (SKILL.md + `command_router_template.md` + `command_template.md`), the command validators, the 066 command-surface benchmark findings, and the create-benchmark completeness work (066/011).

---

## 1. EXECUTIVE SUMMARY

The create-command authoring canon is **richer than its validator**: the canon states many rules (mandatory input gate, fully-qualified MCP tools, presentation/router ownership) that `validate_document.py --type command` never checks, because command frontmatter validation lives in a *separate* entrypoint (`quick_validate.py`) that is not composed into `--type command`. This **canon↔validator drift** is the central completeness failure mode: non-conformant commands author "correctly" against an incomplete rule and pass validation. Five iterations across five research questions converge on one keystone fix and a prioritized backlog of 16 candidate deltas.

**The keystone (C3.6):** compose frontmatter validation into the canonical `--type command` path. Without it, every canon frontmatter rule is a dead letter on the only path authors validate against, so per-rule fixes would not help. The headline wholesale finding (C2.1): the mandatory-gate rule is omitted by **35 of ~37** commands — not 35 authoring errors, but one canon-shape problem, because the gate pattern (designed for simple/workflow commands) contradicts the router topology's presentation-first invariant. The fix is to canonize a **router-gate alternative**, not to add 35 inline gates.

---

## 2. RESEARCH QUESTIONS — ANSWERED

### RQ1 — Canon completeness gaps (answered: iteration 1)
Six canon gaps, in three families:

**(A) Rules stated but unenforced** — F1.1 mandatory gate (SKILL.md:219-240 vs validator `validate_document.py:417-515` has no gate logic); F1.2 FQ MCP tools (SKILL.md:216-218 vs `quick_validate.py:196-202` checks array format only). `memory/save.md:3` ships a required `<spec-folder>` with no gate and passes; `goal_opencode.md:4` / `speckit/plan.md:4` ship bare `mk_goal*` and pass.

**(B) Canon silent where it should speak** — F1.3 no argument-hint budget (speckit/plan 511 chars; deep/research ~750); F1.5 `<!-- skill_agent -->` loader-gating used in 3 doctor commands, undocumented; F1.6 ROUTER CONTRACT content boundary undefined (memory/save fills it with Inputs/Outputs/Guardrails; doctor/update keeps it thin).

**(C) Canon stale/contradicted by corpus** — F1.4 the doctor family is a **route-manifest argv-router** (`_routes.yaml` + per-route yaml + `skill_agent`), which the canon's 3-variant taxonomy never names; `command_router_template.md:108-116` wrongly classifies doctor as "direct-dispatch, no workflow YAML" while `doctor/update.md:23` owns `doctor_update.yaml`.

### RQ2 — Per-family conformance (answered: iteration 2)
Recurrence matrix (measured):

| Defect class | Recurrence | Verdict |
|---|---|---|
| Missing mandatory gate | 35/~37 commands | **Wholesale** |
| argument-hint over-budget | ~20 commands (deep/speckit/memory/create) | **Wholesale** |
| ROUTER CONTRACT shape undefined | variable across families | **Wholesale** |
| route-manifest topology undocumented | doctor family | **Wholesale** |
| bare MCP tool tokens | goal_opencode, speckit/plan | borderline / leaning one-off |
| loader-gating frontmatter | doctor (3) | canon gap, isolated |

**Good news:** the router blocking core (`OWNED ASSETS` + `PRESENTATION BOUNDARY`) is universally present — 35/35 namespace commands. Canon + validator + corpus agree there. **Key insight (F2.1):** the "35 missing gates" is one canon-shape problem: router commands satisfy the gate obligation via the presentation-asset startup prompt (`memory/save.md:14-16`), which the canon never names as a compliant gate form.

### RQ3 — Validator + benchmark coverage defects (answered: iteration 3)
Neither `validate_document.py --type command` nor the 066 `sk-doc-command.cjs` adapter (S1–S5) catches: the gate obligation (F3.1), bare MCP tokens (F3.2), argument-hint budget (F3.3), router-overclaim prose (F3.4 — excluded from S5 *by design*, 066/spec.md:158), and the unreconciled topology taxonomy (F3.5). **Root cause (F3.6):** `--type command` runs zero frontmatter checks — the frontmatter logic lives in `quick_validate.py`, a separate entrypoint not composed in. Six deterministic checks specified (C3.1–C3.5) plus the architectural enabler C3.6, each with clean-control and defect-control. None duplicate an existing S1–S5 check.

### RQ4 — Router/dispatch logic (answered: iteration 4)
- **F4.1** `User request: $ARGUMENTS` raw echo — undocumented idiom in 14 files (all create/* + 3 doctor), copied from a seed; absent elsewhere.
- **F4.2** "Three-runtime parity" is actually two-runtime: `.codex/prompts` has 38 synced files; `.claude/commands` has **0**. The claude mirror is unmet with no canon signal.
- **F4.3** mode-resolution completeness unchecked — 30 commands declare `:auto`/`:confirm`; nothing ensures both EXECUTION TARGETS rows + `_<mode>.yaml` assets exist (adapter S2 checks reachability, not completeness).
- **F4.4** subaction-dispatch style (memory family, `ARGS_PRESENT`+first-token classifier) is unnamed in canon; `$1..$N` positionals are undefined and unused (0 occurrences).
- **F4.5** argument-hint grammar has no binding contract (`--flag` tokens ↔ router/YAML variables).

### RQ5 — Authoring ergonomics (answered: iteration 5)
- **F5.1** the 066/011 create-benchmark broken-`DEFAULT_RESOURCE` P0 (router fallback pointed at a non-existent file) is the canonical **prose-drift/reference-integrity** exemplar — the canon's Step 13 never requires prose-named guide/asset references to resolve.
- **F5.2** template self-sufficiency invariant (066/011 REQ-002): every canon variant must be authorable from its template alone — today violated for the router-gate-alternative, route-manifest topology, loader-gating, and subaction-dispatch, forcing sibling-copy (the root cause of the create-family `$ARGUMENTS` echo drift).
- **F5.3** fat-monolith hints are an ergonomics anti-pattern with an escape hatch: "hint summarizes, EXECUTION TARGETS enumerates" (doctor/update.md:42-43 positive exemplar).

---

## 3. PRIORITIZED CANDIDATE-DELTA BACKLOG

Every delta cites a target path + acceptance criterion. **Tier 0 is the keystone**; Tier 1 depends on it.

### Tier 0 — Enabler
| ID | Delta | Target | Acceptance criterion |
|----|-------|--------|----------------------|
| **C3.6 (P0)** | Compose frontmatter validation into `validate_document.py --type command` | `validate_document.py`, `template_rules.json` | A command with a 2000-char description or bare MCP tool fails `--type command` on the canonical path (today it passes). |

### Tier 1 — Wholesale canon + validator fixes
| ID | Delta | Target | Acceptance criterion |
|----|-------|--------|----------------------|
| **C2.1 (P0)** | Canonize router-gate alternative + `gate_obligation` check | SKILL.md Step 7; `command_router_template.md`; validator | The 35 router commands are gate-compliant via presentation input-surface + empty-`$ARGUMENTS` mode-routing; a router dropping the input-surface declaration becomes non-compliant. |
| **C3.2 (P1)** | allowed-tools FQ-MCP check (core allowlist + `mcp__<s>__<t>`) | validator | `goal_opencode.md`, `speckit/plan.md` flag until `mk_goal*` qualified; memory/save exits 0. |
| **C4.3 (P1)** | mode-resolution completeness check | SKILL.md Step 10; validator/adapter | A workflow-YAML router whose hint lists `:auto` but lacks `_auto.yaml` or an `:auto` EXECUTION TARGETS row flags P1. |
| **C1.4/C2.3 (P1)** | Shape-based topology taxonomy + route-manifest argv-router variant | `command_router_template.md` §3; SKILL.md Step 4/11 | A doctor-shaped command classifies canonically without contradicting a named-family row. |
| **C3.5 (P1)** | Reconcile canon variant taxonomy ↔ 066 4-topology taxonomy | SKILL.md + 066/000 contract | Every live command classifies consistently under both vocabularies; doctor ↔ "subaction router". |

### Tier 2 — Canon-silence closures, ergonomics, heuristic checks
| ID | Delta | Target | Acceptance criterion |
|----|-------|--------|----------------------|
| **C3.1 (P1)** | `gate_obligation` two-form check (built on C2.1) | validator | defect-control `memory/save.md` (pre-fix) flags P1; clean control exits 0. |
| **C5.1 (P1)** | reference-integrity delivery check (prose-named refs resolve) | SKILL.md Step 13; `validate-command-references.cjs` | A command referencing a moved presentation/guide flags before delivery. |
| **C1.3/C5.3 (P2)** | argument-hint budget (≤140 soft) + "hint summarizes, targets enumerate" | SKILL.md Step 6; `command_template.md` §7; validator warn | 20 over-budget hints trim to summaries; speckit/plan flagged. |
| **C4.2 (P2)** | Document/scope runtime parity (opencode+codex; claude absent) + parity gate | SKILL.md; `sync-prompts.cjs` | Parity surface documented; a `:auto` command's mirror is generated or the gap explicit. |
| **C1.5 (P2)** | Canonize loader-gating frontmatter + existence check | SKILL.md Step 6; validator warn | `skill_agent` directive citable; declared agent existence checked. |
| **C1.6/C3.4 (P2)** | Define ROUTER CONTRACT boundary (thin) + router-overclaim prose check | `command_router_template.md`; validator warn | memory/save ROUTER CONTRACT refactored thin; leaked result-template block warns. |
| **C5.2 (P2)** | template self-sufficiency invariant | SKILL.md; create-quality-control gate | Each named variant authors from its template alone; no sibling-copy required. |
| **C4.1 (P2)** | Document/deprecate `User request: $ARGUMENTS` raw echo | SKILL.md Step 9/11; `command_router_template.md` | 14 echoes reconciled to one documented contract. |
| **C4.4 (P2)** | Name subaction-dispatch router + define positional contract (whole-string `$ARGUMENTS`) | SKILL.md Step 9/11 | memory/search classifiable canonically; multi-positional hint without binding warns. |
| **C4.5 (P2)** | hint-binding convention (`--flag` ↔ setup var) + unbound-flag heuristic | SKILL.md; validator warn | A hint flag with no matching setup-var warns; doctor/update (bound) clean. |
| **C2.2 (P2)** | standalone-command conformance class (root-level `/<cmd>.md`) | SKILL.md Step 2/4 | agent_router/goal_opencode/prompt-improve classified and measured. |

**Dependency chain:** C3.6 → (C2.1, C3.2, C4.3, C1.4, C3.5) → remaining Tier 2.

---

## 4. RECOMMENDATIONS

1. **Sequence from the keystone.** Open the first remediation packet on C3.6 alone — it is small (compose two existing validators) and unblocks five Tier-1 checks. Do not attempt Tier-1 fixes before C3.6 lands; they would remain unenforceable on the canonical path.
2. **Canonize before enforcing.** For the router-gate alternative (C2.1) and the route-manifest topology (C1.4), write the canon rule first, then the check — enforcing an un-written rule is what produced today's drift.
3. **Respect the 066 ownership boundary.** Do not add a parallel command-lint engine; extend `validate_document.py`, `validate-command-references.cjs`, and (for S-tier structural checks) the 066 adapter. Keep prose-level detection (C3.4) as P2 heuristic in the lighter validator layer, never the adapter, per 066/spec.md:158.
4. **Reconcile the two topology vocabularies (C3.5) early.** The canon's variant taxonomy and the 066 4-topology taxonomy currently describe the same surface with different words; a doctor-class command can be canon-compliant and benchmark-unclassified simultaneously. One shared table removes the contradiction.
5. **Decide claude parity explicitly (C4.2).** Either wire a claude command mirror or re-scope the canon/benchmark wording to opencode+codex. The current "three-runtime" implication is unmet and unsignaled.

---

## 5. KEY FINDINGS (evidence-backed)

- **KF-1** The mandatory-gate rule is omitted by 35/~37 commands because it contradicts the router's presentation-first invariant; the fix is a canonized router-gate alternative, not 35 inline gates. (iteration 1 F1.1, iteration 2 F2.1)
- **KF-2** `validate_document.py --type command` runs zero frontmatter checks; all canon frontmatter rules are dead letters on the canonical validation path. (iteration 3 F3.6)
- **KF-3** The doctor family is a route-manifest argv-router topology the canon's 3-variant taxonomy never names; the canon's family→variant map is stale. (iteration 1 F1.4, iteration 2 F2.3)
- **KF-4** "Three-runtime parity" is two-runtime: the claude command mirror is empty (0 files) while codex is synced (38). (iteration 4 F4.2)
- **KF-5** The create-benchmark broken-DEFAULT_RESOURCE P0 generalizes to a missing reference-integrity delivery check in the create-command canon. (iteration 5 F5.1)
- **KF-6** The router blocking core (OWNED ASSETS + PRESENTATION BOUNDARY) is the one place canon + validator + corpus agree (35/35). Build on this strength. (iteration 2)

---

## 6. ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Rewrite the canon from the validator | Wrong direction: canon is richer than validator; validator is the leak. Fix = enforce canon + close canon silence. | iteration-001.md F1.1–F1.6 | 1 |
| Add inline mandatory gates to all 35 router commands | Contradicts the router-contract presentation-first invariant. | iteration-002.md F2.1 | 2 |
| Add a regex presentation-leak blocker to the sk-doc-command adapter | Contradicts 066/spec.md:158 explicit prose-exclusion design. | iteration-003.md F3.4 | 3 |
| Add `$1..$N` positional argument support | No command uses positionals; adds complexity. | iteration-004.md F4.4 | 4 |
| Build a new command-lint engine | Duplicates 066/sk-doc ownership boundary. | iteration-005.md Reflection | 5 |

---

## 7. OPEN QUESTIONS (for follow-on packets)

- Whether the router-gate alternative's three compliance conditions (C2.1) should be enforced as P0 or P1, given 35 commands currently rely on the prose form — promotion may require a migration window.
- Whether claude command parity (C4.2) is intended at all, or whether the canon should formally scope to opencode+codex.
- Whether the route-manifest argv-router variant (C1.4) should carry its own blocking core beyond OWNED ASSETS + PRESENTATION BOUNDARY (e.g. a route-manifest-existence requirement).
- Exact priority of the heuristic P2 checks (C1.6, C4.5) once C3.6 lands — they may surface enough noise to need a curated allowlist before promotion.

---

## 8. CROSS-LINEAGE NOTES

This is the **glm52-max** lineage. The spec (012/spec.md) runs a second lineage (`gpt56-sol-high-fast`, cli-codex / gpt-5.6-sol / high / fast) over the same five RQs. Cross-lineage reconciliation is the parent session's job: agreements between the two model perspectives should be strengthened into the backlog; disagreements flagged. This lineage's load-bearing claims are all cited to file:line and verified against source; the one inferred claim is the claude-mirror-intent (open question above).

---

## 9. CONVERGENCE REPORT

- **Stop reason:** `maxIterationsReached` (5/5; stopPolicy max-iterations, convergence telemetry-only by design).
- **Total iterations completed:** 5.
- **Questions answered ratio:** 5/5 RQs each have ≥1 evidence-backed candidate delta.
- **newInfoRatio trend:** 1.0 → 0.7 → 0.75 → 0.8 → 0.6 (average 0.77; no early convergence — consistent with forced non-convergence).
- **Outstanding:** none blocking; open questions are prioritization decisions for follow-on packets.

---

## 10. REFERENCES

**Canon:**
- `.opencode/skills/sk-doc/create-command/SKILL.md` (Steps 1–13)
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md`
- `.opencode/skills/sk-doc/create-command/assets/command_template.md`

**Validators:**
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- `.opencode/skills/sk-doc/shared/assets/template_rules.json`
- `.opencode/commands/scripts/validate-command-references.cjs`

**066 benchmark:**
- `066-command-surface-benchmark/spec.md`
- `066-command-surface-benchmark/000-command-benchmark-contract/spec.md`
- `066-command-surface-benchmark/010-scorecard-and-closeout/spec.md`
- `066-command-surface-benchmark/011-create-benchmark-completeness-remediation/spec.md`
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs`
- `.opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs`

**Corpus exemplars (cited):**
- `.opencode/commands/memory/save.md`, `memory/search.md`
- `.opencode/commands/doctor/update.md`, `doctor/_routes.yaml`
- `.opencode/commands/speckit/plan.md`
- `.opencode/commands/deep/research.md`
- `.opencode/commands/goal_opencode.md`

**Iteration evidence:** `iterations/iteration-001.md` … `iteration-005.md`.

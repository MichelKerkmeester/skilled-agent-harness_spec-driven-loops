# Iteration 5: RQ5 — authoring ergonomics + cross-RQ prioritized backlog

## Focus
Consolidate the recurring authoring failures (fat monolith hints, missing loader-gating frontmatter, prose drift between a command and its presentation/guides) into template/logic changes, grounded in the create-benchmark completeness work (066/011). Then cross-cut every C1.x–C4.x candidate delta into a single prioritized, dependency-ordered backlog ready to seed follow-on remediation packets.

## Findings

### F5.1 — Router-fallback drift: the create-benchmark broken-DEFAULT_RESOURCE is the canonical prose-drift exemplar
The 066/011 dual review found that `sk-doc/create-benchmark`'s smart-router `DEFAULT_RESOURCE` pointed at a non-existent `references/README.md` instead of `references/shared/README.md` (066/011 spec REQ-001, P0; `011/spec.md:56,72,83`). This is the same defect class as a command router whose MODE ROUTING references a presentation prompt that does not exist, or whose OWNED ASSETS table lists an asset path that drifted. It is an **authoring-ergonomics** failure: the router's fallback/target text is free prose with no integrity check on the authoring side. The 066 adapter S2 catches *execution-target* reachability for command routers, but create-benchmark's internal smart-router fallback (and, by analogy, any router's prose-named guide reference) is not covered by a create-command canon rule. The canon's Step 13 "Validate Before Delivery" (SKILL.md:369-393) lists checks but never "every prose-named asset/guide reference in this command resolves to a real file."

[SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation/spec.md:56,72,83]
[SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:369-393]

**Candidate delta C5.1:** Canon: add to SKILL.md Step 13 a "reference integrity" delivery check — every path/prose reference inside the command (OWNED ASSETS table, EXECUTION TARGETS, presentation-asset name, any `references/…` guide pointer) must resolve to an existing file. Check: extend the existing `validate-command-references.cjs` (already reused by 066, `066/spec.md:24`) to also resolve prose-named guide/fallback references, not just the OWNED ASSETS table; warn (P1) on any unresolved reference. Acceptance: a command referencing a moved presentation/guide asset flags before delivery; the create-benchmark DEFAULT_RESOURCE drift would have been caught at authoring time.

### F5.2 — Template self-sufficiency: authors must not hand-derive fields
066/011 REQ-002 (P1) requires that a schema-v2 command-behavior scenario be "authored purely from the template" without hand-deriving fields from the framework (`011/spec.md:57,73,84`). This generalizes to a create-command canon ergonomics principle: **a command's template + presentation asset must be sufficient for an author to produce a conformant command without reverse-engineering the validator or a sibling command.** Today the canon violates this for the router-gate-alternative (F2.1), the route-manifest topology (F1.4), the loader-gating field (F1.5), and the subaction-dispatch style (F4.4) — an author cannot learn any of these from the template alone and must copy from a sibling, which is the root cause of the create-family `User request: $ARGUMENTS` copy-seed drift (F4.1).

[SOURCE: .opencode/specs/system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation/spec.md:57,73,84]
[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:39-124]

**Candidate delta C5.2:** Canon: adopt a "template self-sufficiency" invariant in SKILL.md — every command type/variant the canon names must have a complete worked skeleton in `command_template.md`/`command_router_template.md` (including the router-gate-alternative C2.1, route-manifest topology C1.4, loader-gating C1.5, subaction-dispatch C4.4). Check: a documentation-quality gate (create-quality-control) asserting each named variant has a skeleton + a worked example. Acceptance: an author can produce each canon variant from the template alone; no variant requires sibling-copy.

### F5.3 — Fat-monolith hints are an ergonomics anti-pattern with a canon escape hatch
F1.3/F2 established ~20 commands ship argument-hints of 190–750 chars. The ergonomics frame: a fat hint is a signal the command is doing too much in one surface (enumerating flags inline instead of a MODE ROUTING table). The canon currently *encourages* this by giving hints a rich grammar (`<>`/`[]`/`--flag`/`[default:]`, SKILL.md:211-214) with no ceiling, so authors fill it. The fix (C1.3 hint budget) is also an ergonomics nudge: forcing flag enumeration into EXECUTION TARGETS sub-tables (as `doctor/update.md:42-43` already does well) makes the router scannable and the hint a summary.

[SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:211-214]
[SOURCE: .opencode/commands/doctor/update.md:42-43]

**Candidate delta C5.3:** = C1.3, framed as ergonomics: canonize the "hint summarizes, EXECUTION TARGETS enumerates" pattern with doctor/update as the positive exemplar and speckit/plan as the anti-exemplar. Acceptance: the create-quality-control guide cites the pattern; the 20 fat hints trim to summaries.

---

### Cross-RQ prioritized backlog (C1.x–C5.x, dependency-ordered)

**Tier 0 — Enabler (do first; unblocks Tier 1 checks on the canonical path)**
| ID | Delta | Target | RQ | Priority |
|----|-------|--------|----|----------|
| **C3.6** | Compose frontmatter validation into `validate_document.py --type command` (call quick_validate frontmatter fns, or move rules into template_rules + a frontmatter pass) | `validate_document.py` + `template_rules.json` | RQ3 | P0 |

**Tier 1 — Wholesale canon+validator fixes (depend on C3.6 to be enforceable)**
| ID | Delta | Target | RQ | Priority |
|----|-------|--------|----|----------|
| **C2.1** | Canonize router-gate alternative (presentation input-surface + empty-$ARGUMENTS mode-routing path) + gate_obligation check | SKILL.md Step 7; `command_router_template.md`; validator | RQ1/2 | P0 |
| **C3.2** | allowed-tools FQ-MCP check (core allowlist + `mcp__<s>__<t>`) | validator | RQ1/3 | P1 |
| **C4.3** | mode-resolution completeness check (`:auto`/`:confirm` hint ↔ EXECUTION TARGETS + `_<mode>.yaml`) | SKILL.md Step 10; validator/adapter | RQ4 | P1 |
| **C1.4/C2.3** | Replace stale family→variant table with shape-based topology taxonomy; add route-manifest argv-router variant | `command_router_template.md` §3; SKILL.md Step 4/11 | RQ1/2 | P1 |
| **C3.5** | Reconcile canon variant taxonomy ↔ 066 4-topology taxonomy (single shared table + fail-closed bucket) | SKILL.md + 066/000 contract | RQ3 | P1 |

**Tier 2 — Canon-silence closures + ergonomics + heuristic checks**
| ID | Delta | Target | RQ | Priority |
|----|-------|--------|----|----------|
| **C3.1** | gate_obligation check (two compliant forms) | validator (built on C2.1) | RQ3 | P1 |
| **C1.3/C5.3** | argument-hint budget (≤140 soft) + "hint summarizes, targets enumerate" pattern | SKILL.md Step 6; `command_template.md` §7; validator warn | RQ1/5 | P2 |
| **C4.2** | Document/scope runtime parity (opencode+codex generated; claude absent) + parity gate | SKILL.md runtime-mirror subsection; sync-prompts | RQ4 | P2 |
| **C1.5** | Canonize loader-gating frontmatter (`agent:` / `<!-- skill_agent -->`) + existence check | SKILL.md Step 6; validator warn | RQ1/5 | P2 |
| **C1.6/C3.4** | Define ROUTER CONTRACT content boundary (thin) + router-overclaim prose check (P2 heuristic) | `command_router_template.md`; validator warn | RQ1/3 | P2 |
| **C5.1** | reference-integrity delivery check (prose-named guide/asset refs resolve) | SKILL.md Step 13; `validate-command-references.cjs` | RQ5 | P1 |
| **C5.2** | template self-sufficiency invariant (every named variant has a complete skeleton) | SKILL.md; create-quality-control gate | RQ5 | P2 |
| **C4.1** | Document/deprecate `User request: $ARGUMENTS` raw-echo idiom | SKILL.md Step 9/11; `command_router_template.md` | RQ4 | P2 |
| **C4.4** | Name subaction-dispatch router style + define positional contract (whole-string $ARGUMENTS) | SKILL.md Step 9/11 | RQ4 | P2 |
| **C4.5** | hint-binding convention (`--flag` ↔ setup var) + heuristic unbound-flag check | SKILL.md; validator warn | RQ4 | P2 |
| **C1.2** | (absorbed into C3.2) FQ MCP tools | — | RQ1 | P1 |
| **C2.2** | standalone-command conformance class (root-level `/<cmd>.md`) | SKILL.md Step 2/4 | RQ2 | P2 |

**Dependency note:** C3.6 is the keystone — without composing frontmatter validation into `--type command`, none of C2.1/C3.1/C3.2/C1.3 are enforceable on the canonical path, so they would remain dead-letter rules exactly as they are today. Sequence: C3.6 → (C2.1, C3.2, C4.3, C1.4, C3.5) → remaining Tier 2.

## Sources Consulted
- 066/011 create-benchmark completeness remediation spec (REQ-001 router fallback, REQ-002 template self-sufficiency).
- All prior iterations C1.x–C4.x.
- Corpus exemplars: doctor/update.md:42-43 (positive ergonomics); speckit/plan.md:3 (anti).

## Assessment
- **newInfoRatio: 0.6** — RQ5 adds the router-fallback drift exemplar (F5.1) and the template-self-sufficiency invariant (F5.2) as net-new ergonomics principles; the bulk of this iteration is the cross-RQ consolidation, which is integrative rather than novel.
- **Novelty justification:** F5.1 ties the create-benchmark broken-fallback finding back to a general command-canon gap (no reference-integrity delivery check), and the backlog names C3.6 as the keystone dependency — a non-obvious sequencing insight (the frontmatter blind spot blocks all frontmatter-rule enforcement).
- **Confidence:** high on F5.1 (cited 066/011 P0 finding); high on the backlog dependency ordering (C3.6 keystone verified in iteration 3).
- **RQ5 answer:** three ergonomics deltas (C5.1–C5.3) plus the consolidated backlog; all five RQs now have evidence-backed answers with candidate deltas.

## Reflection
- **What worked:** Grounding RQ5 in the 066/011 dual-review finding (concrete P0) rather than abstract ergonomics — F5.1 is immediately citable. Cross-cutting the backlog against the C3.6 keystone made the dependency ordering legible.
- **What failed / ruled out:** Considered proposing a new "command linter" tool; ruled out — the right home is extending the existing `validate_document.py` + `validate-command-references.cjs` + the 066 adapter, not a parallel engine (consistent with 066 ownership boundary, spec.md:103-105).
- **Ruled out:** "Build a new command-lint engine" — duplicates 066/sk-doc ownership; extend existing instruments instead.
- **All five RQs now have evidence-backed answers with ≥1 candidate delta each. Convergence is telemetry-only; proceeding to phase_synthesis per stopPolicy max-iterations (5/5 reached).**

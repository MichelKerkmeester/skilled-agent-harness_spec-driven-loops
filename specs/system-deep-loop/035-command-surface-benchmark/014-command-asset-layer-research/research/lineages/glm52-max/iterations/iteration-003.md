# Iteration 3: RQ3 — Mode completeness check + the per-family mode matrix

## Focus
Design the check that closes the reachability-vs-completeness gap (012 AL1/W6): every declared `:auto`/`:confirm` mode must have BOTH its `_<mode>.yaml` asset AND an EXECUTION TARGETS row. Then encode each family's default-mode policy in a *mode matrix* that records the legitimate differences (create→confirm, design→conditional-auto, deep→ask) without forcing one default. Ground in the adapter's actual checks and the corpus's actual default-mode behavior.

## Findings

### F3.1 — The adapter checks REACHABILITY, never COMPLETENESS (AL1 root, precisely located)
The benchmark adapter's mode/target safety is split across two functions, neither of which verifies mode completeness:
- `checkMirrorAndReachability` (`sk-doc-command.cjs:365-385`) consumes `surface.violations` from `referenceChecks.inspectCommandSurface`. Those violations are built in `validate-command-references.cjs` by `extractViolations` (`:77-124`) and `inspectCommandSurface` (`:262-351`) — and the *only* command-target defect they record is `command-target` when a referenced path **does not resolve on disk** (`validate-command-references.cjs:185-193` `extractCommandTargets` + the existence checks). I.e. it flags a *missing file*, never a *missing declaration*.
- `checkCapabilitiesAndSafety` (`sk-doc-command.cjs:423-454`) walks each workflow target and checks tool-declaration (`required_tools`) and destructive-confirmation — again per-target, never per-declared-mode.

There is **no `checkModeCompleteness`**. Concretely: a router whose `argument-hint` advertises `[:auto|:confirm]` and whose EXECUTION TARGETS lists `:auto` but whose `_auto.yaml` is absent will pass as long as nothing references the missing file — because the check is "does each referenced target exist", not "does each advertised mode have its target + asset". The census shows 28 routers declare `:auto` and all 28 currently have an `_auto.yaml`, so the corpus is *accidentally* complete; the gap is silent and would let a single deletion ship undetected.

[SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:365-385,423-454]
[SOURCE: .opencode/commands/scripts/validate-command-references.cjs:185-193,262-351]
[SOURCE: census 2026-07-16 — 28 `:auto`-declaring routers, 28 `_auto.yaml` present]

**Candidate delta D3.1 (mode-completeness check):** Add `checkModeCompleteness` to the adapter (new S6, or fold into S2). For each command it reads the declared modes from (a) the contract `mode_matrix` (preferred, F3.3) or (b) the `argument-hint` `:auto`/`:confirm` tokens + the EXECUTION TARGETS table, then asserts EACH declared mode has: (1) an owned `_<mode>.yaml` asset of kind `workflow_<mode>`, AND (2) a row in EXECUTION TARGETS. A mode declared in the hint but missing either emits `CMD-S6-MODE-INCOMPLETE` P1 with the missing half named. Target: `sk-doc-command.cjs` (new check) + fixture. Acceptance: a fixture that advertises `:auto`, ships an `_auto.yaml`, but drops the `:auto` EXECUTION TARGETS row fails S6; a fixture that lists `:auto` in EXECUTION TARGETS but has no `_auto.yaml` fails S6; a complete triad passes.

### F3.2 — Reachability vs completeness is a real two-sided gap, not one
The completeness check must close BOTH directions, and the corpus shows both are plausible failure modes:
- **Declared-but-unwired** (advertised mode lacks asset/row): the silent-shipping case F3.1 describes.
- **Wired-but-undeclared** (asset/row exists but the `argument-hint` does not advertise the mode): e.g. a router with an `_auto.yaml` and an `:auto` EXECUTION TARGETS row whose `argument-hint` reads only `[optional]` with no `:auto` token. Today nothing flags this either — the mode is reachable to a user who knows the suffix but invisible to `/help`. The `doctor/update.md` case is the inverse proof: it has a single `doctor_update.yaml` (no triad) and explicitly states "always interactive; deleted mode suffixes are invalid" (`doctor/update.md:29`) — so it must be EXEMPT from the auto/confirm completeness rule, which a naive "every router needs both modes" check would wrongly flag. So the check must be **mode-matrix-driven**, not topology-blind.

[SOURCE: .opencode/commands/doctor/update.md:29]
[SOURCE: .opencode/commands/create/command.md:3,38 (advertises :auto|:confirm, defaults confirm)]

**Candidate delta D3.2:** The completeness check is gated on `mode_matrix.declared_modes` from the contract (F3.3): it verifies each *declared* mode is fully wired AND that no `_<mode>.yaml`/EXECUTION-TARGETS row exists for an *undeclared* mode. Commands with `declared_modes: []` (doctor/update, memory/*) are exempt. Acceptance: doctor/update and memory/search pass with empty declared_modes; a workflow router with an orphan `_auto.yaml` but no `:auto` in its hint emits `CMD-S6-ORPHAN-MODE-ASSET` P2.

### F3.3 — The mode matrix: record per-family defaults WITHOUT forcing one
RQ3 explicitly requires encoding the default-mode policy without forcing one default. The corpus has **three distinct, legitimate default policies**, today living only in prose:
- **create → confirm**: `:confirm` or omitted mode → confirm (`create/command.md:38`).
- **design → conditional-auto**: no suffix + complete `$ARGUMENTS` → auto; no suffix + incomplete → confirm (`design/audit.md:55,76-77`; identical in foundations/interface/md-generator/motion).
- **deep → ask**: no suffix → ASK (prompts for mode) (`deep/research.md:134`).

These are real behavioral differences, not errors. The contract captures them in a `mode_matrix`:
```
mode_matrix:
  declared_modes: [auto, confirm]      # doctor/memory: []
  default_policy: confirm | conditional-auto | ask | confirm-only
  default_condition: "<prose or null>"  # e.g. design: "auto if $ARGUMENTS complete else confirm"
  mode_assets: { auto: "<path>", confirm: "<path>" }
```
`default_policy` is an enum (NOT a single hardcoded value), so create/confirm, design/conditional-auto, and deep/ask coexist. The mode table rendered in the router (the EXECUTION TARGETS + the "omitted mode →" rule) becomes a projection of `mode_matrix`.

[SOURCE: .opencode/commands/create/command.md:38]
[SOURCE: .opencode/commands/design/audit.md:55,76-77]
[SOURCE: .opencode/commands/deep/research.md:134]

**Candidate delta D3.3 (mode matrix field):** Add `mode_matrix` (declared_modes, default_policy enum, default_condition, mode_assets) to the command contract (D1.5). Target: `create-command/SKILL.md` Step 3 + `command_router_template.md` §3/§4. Acceptance: all three current policies (create/design/deep) validate under distinct `default_policy` values; a new family cannot set an undefined policy value; the EXECUTION TARGETS "omitted mode →" prose is regenerated from `default_policy`+`default_condition`, removing the hand-maintained drift surface (closes 012 AL2).

### F3.4 — The check needs a reliable mode-source; the EXECUTION TARGETS table (D1.4) is it
F1.4 showed EXECUTION TARGETS is a table in deep but a prose list in create. The completeness check (D3.1) needs to *parse* the mode→target map, and a prose list ("4. Load exactly one workflow YAML: `:auto` -> …") is unreliable to parse (free word order, conditional phrasing). Standardizing EXECUTION TARGETS as a `| Mode | Target |` table (D1.4) is therefore a *prerequisite* for a robust D3.1 — the check reads the table's mode column and cross-references `mode_matrix.declared_modes` + the owned assets. This creates a clean dependency: D1.4 (table) → D3.1 (completeness). The contract's `mode_matrix.mode_assets` is the authoritative source; the EXECUTION TARGETS table is its rendered projection and must agree.

[SOURCE: .opencode/commands/create/command.md:31-40 (prose list)]
[SOURCE: .opencode/commands/deep/research.md:159-164 (table)]

**Candidate delta D3.4:** Make D1.4 and D3.1 a paired dependency in the remediation sequencing: standardize the EXECUTION TARGETS table first, then the completeness check parses it. Add an invariant `mode_matrix.mode_assets == EXECUTION_TARGETS.mode_targets` so the contract and the rendered table cannot disagree. Acceptance: a router whose EXECUTION TARGETS table lists a mode absent from `mode_matrix.declared_modes` fails.

### F3.5 — doctor/memory must be first-class EXEMPT, not errors
A topology-blind completeness check would flag `doctor/update` (single YAML, no modes) and `memory/*` (presentation-only, no modes) as "incomplete". They are not incomplete — they are a different topology. The mode matrix handles this cleanly: `declared_modes: []` → the completeness check is skipped for that command, and `mode_assets: {}`. This is the same principle as the route-manifest topology naming (RQ4): the contract must NAME the shape so the check can EXEMPT it correctly, rather than force every command into the triad mold. The 012 finding that the triad is strongest (35/35) is about the *triad families*; doctor/memory are legitimately not triads and the matrix must say so explicitly.

[SOURCE: .opencode/commands/doctor/update.md:29,20-24]
[SOURCE: .opencode/commands/memory/search.md:32-40]
[SOURCE: 012/research/research.md:121-123 (triad families vs doctor/memory break-on-purpose)]

**Candidate delta D3.5:** Document `declared_modes: []` as the valid matrix for direct-dispatch (memory) and single-workflow (doctor/update) topologies in the contract spec, and have D3.1 skip them. Acceptance: memory/search and doctor/update pass S6 with zero declared modes; a triad router with `declared_modes: []` but present `_auto.yaml`/`_confirm.yaml` fails `CMD-S6-ORPHAN-MODE-ASSET`.

## Sources Consulted
- Adapter: `sk-doc-command.cjs:365-385,423-454`; `validate-command-references.cjs:185-193,262-351`.
- Corpus default-mode: `create/command.md:3,38`; `design/audit.md:55,76-77`; `deep/research.md:134`; `doctor/update.md:29`; `memory/search.md:32-40`.
- Census: 28 `:auto`-declaring routers; create/design/deep/speckit triad counts.
- Grounding: `012/research/research.md:117-143` (AL1, AL2; W6).

## Assessment
- **newInfoRatio: 0.8** — AL1's "unchecked" is located precisely (no `checkModeCompleteness`; only missing-file reachability); the genuinely new design is the two-sided completeness (F3.2), the `default_policy` enum that holds all three real policies (F3.3), and the `declared_modes: []` exemption for non-triad topologies (F3.5).
- **Novelty justification:** Turns AL1 from "add a check" into a contract-driven, two-sided, topology-aware check gated on a mode matrix that legitimizes the create/design/deep differences instead of flattening them — directly answering RQ3's "without forcing one default".
- **Confidence:** high on F3.1/F3.2/F3.5 (adapter source + corpus); high on F3.3 (three policies directly observed); F3.4 is a sequencing dependency (medium-high).
- **Partial RQ3 answer:** the check design, the matrix schema, and the exemption model are complete; full close lands when RQ4 names the route-manifest topology (so doctor's full family maps into the matrix) and RQ5 renders the table.

## Reflection
- **What worked:** Reading the adapter's two relevant functions side-by-side with `inspectCommandSurface`'s violation builder — the absence of any mode-aware logic was immediately visible, and the reachability-only nature of the existing check explained *why* the corpus is accidentally-complete.
- **What failed / ruled out:** Initially considered keying the check off the `argument-hint` tokens alone — rejected because the hint is prose-drift-prone (012) and because doctor/memory have no modes to extract; the contract `mode_matrix` is the stable source.
- **Ruled out:** "Force every router to support both :auto and :confirm" — contradicts the legitimate single-mode/zero-mode topologies and 012's design intent.
- **Recommended next focus (RQ4):** the route-manifest YAMLs — doctor's distinct `_routes.yaml` shape, the taxonomy naming, and the executable-edge parsing that stops YAML comments from registering as false route cycles (AL4/AL5).

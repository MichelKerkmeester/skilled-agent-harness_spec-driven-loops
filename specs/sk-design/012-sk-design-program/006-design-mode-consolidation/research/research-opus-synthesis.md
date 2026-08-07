# sk-design Consolidation Re-Synthesis (Independent Verification)

Supersedes `research.md` where the two disagree. Every claim below was re-checked against the live tree on 2026-07-27 by a reviewer with no prior involvement in the consolidation. Commands were executed, not cited from the prior passes.

## 1. EXECUTIVE SUMMARY

The consolidation is structurally sound and does not need rework. The official package validator passes all three checks, the command-contract suite passes 8/8, and the command-surface checker reports `status: valid`, 3 commands, 4 modes. Foundations was genuinely relocated, not lost: all eleven `VISUAL_SYSTEM` resources, both assets, three Python gates, and the corpus blueprint exist under `design-interface/`. [SOURCE: command: `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/sk-design`] [SOURCE: command: `node --test .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs`] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:138]

What it left behind is one honesty problem and a wide, shallow layer of stale vocabulary:

1. The hub's **advisor identity still sells a design score and P0/P1 findings** that no surviving mode can produce. Neither prior pass looked at this layer.
2. A **hub-owned checker is red right now** — `procedure-card-schema-check.mjs` returns `status: "fail"`. The research pass never ran it and declared the hub healthy.
3. **Live executable code** in the Open Design transport still enumerates `design-foundations` and `design-audit` as valid paired modes.
4. Retired vocabulary persists in the shared handoff, proof-token, procedure-card, creation, polish, and mechanical contracts — confirmed, but it is one deletion pass, not four workstreams.

The verified backlog is roughly 35 line edits, one `if` statement, one negative test, and one document shrink. It does not warrant `/speckit:plan`, a five-workstream remediation program, or any new construct.

## 2. WHAT I CONFIRMED

| Prior claim | Status | Evidence |
|---|---|---|
| Research R1 — active docs cite missing `styles/_engine`/`styles/_db` | CONFIRMED, understated | 13 sites in 5 live files; `node .../styles/_engine/style-library.mjs query` fails `MODULE_NOT_FOUND`; corrected path returns `ok:true`, 1,290 eligible |
| Research R3 — commands claim performance/scoring the binary card cannot prove | CONFIRMED, undercounted | [SOURCE: .opencode/commands/interface/design.md:24] [SOURCE: .opencode/commands/interface/motion.md:24] [SOURCE: .opencode/commands/interface/assets/interface-design-presentation.txt:50] plus a fourth site research missed |
| Research R3 — the card is genuinely binary | CONFIRMED | Verdict is `SHIP` / `FIX` + failing box numbers only, no score, no severity [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:201-210] |
| Research R4 — root styles README is 165 KB with broken links | CONFIRMED | 165,030 bytes, 1,314 lines; `styles/099-supply` absent, real path `styles/library/bundles/099-supply` |
| Research R5 — auto YAML invents `build`, omits `handoff` | CONFIRMED exactly | [SOURCE: .opencode/commands/interface/assets/interface-design-auto.yaml:157] vs [SOURCE: .opencode/commands/interface/design.md:3] and [SOURCE: .opencode/commands/interface/design.md:60] |
| Review P1-001 — retired identities in the live handoff | CONFIRMED | Foundations Handoff Card at `:61-66`, Audit Backlog Handoff Card at `:71-78`, rule 4 at `:99`, child usage at `:106-107`; loaded by [SOURCE: .opencode/skills/sk-design/command-metadata.json:61] |
| Review P1-004 — three cards absent from live selection sets | CONFIRMED | Selection sets at [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:87] and `:180-188` and [SOURCE: .opencode/skills/sk-design/command-metadata.json:51] list six cards + polish; the three files exist on disk |
| Review P1-002 — `--design-md` control flow | CONFIRMED as described | Only `options.output` is policy-resolved at `:165`; `--design-md` resolved bare at `:275`; `fs.rmSync` at `:337`; `fs.writeFileSync` at `:349` |
| Review P1-003 / P2-001 / P2-002 / P2-003 line citations | CONFIRMED | All cited lines exist and say what the report says |

## 3. WHAT I VERIFIED AS WRONG OR OVERSTATED

**3.1 — Research declared the hub healthy without running a hub-owned checker.** `node .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs` returns `status: "fail"`, `cardCount: 12`, `failingCardCount: 3` today. It is not part of `validate_skill_package.py`. Research §4 and §11 finding 6 conclude "the hub's core structure is healthy... the refinement program should therefore stop after the five bounded changes above." That conclusion rests on an incomplete gate set. CONFIRMED.

**3.2 — Research rec 1's prescribed fix ("search-replace") would create four new broken paths.** The playbooks reference `styles/_engine/tests/eligibility-first.test.mjs` and `styles/_engine/tests/hydrate-guard.test.mjs`. Those files live at `styles/tests/engine/`, not `styles/lib/engine/tests/`. A `_engine` → `lib/engine` substitution silently converts four dead paths into four different dead paths. [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:284] [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:285] [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/styles-library-utilization/retrieval-query-eligible-cards.md:80] [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/styles-library-utilization/generation-guarded-hydration-mismatch.md:76] CONFIRMED by direct existence check.

**3.3 — Research's own findings registry cites a site that is already correct.** `styles/README.md:12` is cited as an `_engine` drift location. That line already reads `lib/engine/style-library.mjs`, and lines 16-17 already carry the correct commands. The citation is wrong. [SOURCE: .opencode/skills/sk-design/styles/README.md:12]

**3.4 — "The implementation lives under `styles/lib/engine/`, `styles/lib/database/`, and `styles/database/`" is loose.** `styles/database/` contains only a `.gitignore` and a README; it is the gitignored data location, not implementation. Rec 1 tells an implementer to point docs at it. CONFIRMED by directory listing.

**3.5 — The Eliminated Alternative "add severity/confidence to the card" was rejected on a category error.** The stated reason is that the commands already require an Evidence Ledger. The Evidence Ledger schema has `claim, level, method, sourceOrCommand, artifact, scenario, expected, observed, timestamp, limitations` — where `level` is `authored|observed|measured|validated|verified|blocked|not-applicable`. [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:141-155] That is *how strongly a claim is proven*. Severity is *how bad a finding is*. There is no severity field anywhere in the ledger. The two are orthogonal and one does not substitute for the other. **The conclusion is still correct — do not add a severity schema — but on over-engineering grounds, not this one.** The bad argument matters because it can be reused to justify deleting the last severity vocabulary in the hub (see §5.3).

**3.6 — Review P1-002 is mis-severed and its title is wrong.** "Arbitrary `--design-md` path" overstates it. The delete/rewrite branch is reachable only when *all* of the following hold: `--study` is set; `--author-command` is set (preflight `study-author` enforces this at `:174-181`); `--design-md` is set; **that file already exists on disk** (`:326` returns early otherwise); study context prepared successfully; and the leak check fails. The code never creates a file at an unchecked path — it can only destroy a pre-existing file the operator named on their own command line, in their own shell. That is a local data-loss footgun, not a write-authority escape or a security boundary bypass. **P2, not P1/security.** The fix is still cheap and still worth doing.

**3.7 — Review P1-003's stated impact is refuted by the packet's own checklist.** The report says "release readers cannot determine whether the audit security gate is required, waived, or superseded." `checklist.md:81` strikes CHK-030 through and states verbatim: `[N/A: audit is retired entirely (ADR-002) — there is no remaining gate to keep intact...]`. The determination is available and explicit. What remains is one stale NFR line in `spec.md:157`. **P2, one strikethrough.**

**3.8 — Review P1-004's proposed remediation is larger than the demonstrated problem.** The schema checker's actual failure is one row per card: `required-fields row 2 is "Owning subworkflow", expected "Owning mode"`. Renaming that row in three files turns the checker green *and* deletes the retired `subworkflow` vocabulary in the same stroke. Whether to add the cards to the selection table is a separate, smaller judgment. The report's specSeed ("define whether retained cards are selectable production resources or historical artifacts") invites a policy debate where a one-word header fix satisfies the only automated gate.

**3.9 — Research §10's "further `commandSubworkflows` cleanup has no target" is false in substance.** The JSON *key* is gone; the *vocabulary* is load-bearing and currently fails a checker. Live sites: the three procedure cards' `Owning subworkflow` row; [SOURCE: .opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md:43]; [SOURCE: .opencode/skills/sk-design/shared/scripts/README.md:3]; [SOURCE: .opencode/skills/sk-design/design-interface/scripts/README.md:12]; [SOURCE: .opencode/skills/sk-design/design-interface/scripts/README.md:38]; [SOURCE: .opencode/skills/sk-design/design-interface/feature-catalog/token-system/oklch-color-and-token-system.md:3]; [SOURCE: .opencode/skills/sk-design/design-interface/manual-testing-playbook/manual-testing-playbook.md:43].

## 4. WHAT BOTH PASSES MISSED

**4.1 — The advisor identity still sells deleted capability. [CONFIRMED, highest value]**
`description.json` is the metadata Gate 2 routes on. It still lists keywords `design-audit`, `accessibility-audit`, `performance-audit`, `design-quality-score`, and carries the trigger example **"score the design quality and list P0/P1 findings"**. `graph-metadata.json` repeats `design quality score` and `P0 P1 design findings` as intent signals at `:123-124`. `SKILL.md:11` repeats `design-quality-score, P0-P1-design-findings`. Meanwhile ADR-002 states verbatim: *"no scoring or severity apparatus was carried over."* [SOURCE: .opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/decision-record.md:151]

The same `graph-metadata.json` contradicts itself: `causal_summary` at `:179` correctly says "the retired audit and foundations modes no longer exist as separate registry entries," while its own intent signals promise their output.

This is research rec 3's exact defect one layer higher — at the layer that decides whether sk-design is invoked at all. Both passes stopped at command discriminators and shared contracts and never opened the advisor pair.

**4.2 — Live executable code enumerates retired modes. [CONFIRMED]**
`PAIRED_MODES` is a frozen enum containing `design-interface`, `design-foundations`, `design-motion`, `design-audit` — and *missing* `design-md-generator`. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/grounding-receipt.mjs:26-31] It is validated at `grounding-receipt.mjs:354` and `return-reconciliation.mjs:304`. A grounding receipt naming `design-audit` passes validation today; one naming `design-md-generator` is rejected. Review iteration 2 read the Open Design packet for tool-surface security only and never checked its contracts for retired identities.

**4.3 — `procedure-card-schema-check.mjs` is red and outside the official validator.** See §3.1. Neither pass filed it as a standalone finding; the review used it only as supporting evidence for P1-004, and research never ran it.

**4.4 — `styles/README.md:8` has a second, independent broken-link defect.** It points at `_harness/` and `_manifest.json`; neither exists. Research rec 4 targets the same file for the inventory table and did not notice the header links.

**4.5 — A fourth overclaim site.** [SOURCE: .opencode/commands/interface/assets/interface-motion-presentation.txt:40] routes "ready for performance, accessibility, or quality review" to the preflight card. Research rec 3 counted three edit sites; there are four.

**4.6 — Nobody traced what deleting the `audit` proof row costs.** [SOURCE: .opencode/skills/sk-design/shared/creation-contract.md:169] is the last place in any live contract that names *"evidence ledger with severity and confidence"*. Research rec 2 and review P2-003 both prescribe deleting it. Meanwhile [SOURCE: .opencode/skills/sk-design/shared/sk-code-handoff.md:76] still *requires* `finding id, severity, owner, target, evidence label` for an Audit Backlog handoff — a card no surviving mode can produce. After the prescribed deletions, sk-design has no severity vocabulary at all, and the fix as written completes that loss silently rather than as a named tradeoff.

**4.7 — The two passes barely overlap, so neither is a superset.** Research found polish-gate, mechanical-defaults, corpus-map, the YAML enum, and the styles paths; the review found none of them. The review found guided-run, the packet NFR, the procedure cards, and the proof-token example; research found none of them. Their only shared theme is retired-identity drift. The real backlog is the union, plus §4.1-4.5.

**4.8 — The passes contradict each other on foundations, and both are partly wrong.** Research §7: *"Foundations capability is present... the only foundations-related defect is stale ownership language."* Review P1-004: three foundations procedure cards are unreachable through the contract agents follow. Resolution from direct checks: **research checked `VISUAL_SYSTEM` (11/11 references and assets exist and are mapped — confirmed) and never opened the procedure-card selection table; the review checked the procedure table and never checked resource reachability.** References and assets are reachable. The three procedure *cards* are not. Research's "only language" is wrong; the review's implied breadth is also wrong. The gap is narrow and card-shaped.

## 5. RANKED RECOMMENDATIONS

Ordered by demonstrated-problem severity divided by ceremony added. Every item is a deletion, a correction, or a single guard. None adds a mode, command, schema, alias, adapter, template, or abstraction.

### 5.1 — Stop advertising a score the hub cannot produce
- **Problem (CONFIRMED):** `description.json` keywords and trigger example, `graph-metadata.json:123-124` intent signals, and `SKILL.md:11` promise `design-quality-score` / `P0-P1-design-findings`. ADR-002 deleted the scoring and severity apparatus outright. The advisor will route "score the design quality and list P0/P1 findings" to a surface whose only verdict is SHIP/FIX.
- **Smallest fix:** delete `design-quality-score` and `P0-P1-design-findings` / `P0 P1 design findings` from all three files; delete the trigger example `"score the design quality and list P0/P1 findings"`. **Keep** `design-audit`, `accessibility-audit`, `performance-audit`, and the example `"audit this UI for accessibility and anti-slop issues"` — the card genuinely does an accessibility and anti-slop pass, and `hub-router.json` correctly maps that vocabulary into `interface`. Only the score/severity promise is unbacked. Then rebuild the advisor index.
- **Value:** very high — this is the only finding that changes what a user is promised at the point of routing. **Cost:** four line edits + one index rebuild. **Confidence: HIGH / CONFIRMED.**

### 5.2 — Correct the live styles paths, with the right mapping
- **Problem (CONFIRMED, reproduced):** 13 sites across `SKILL.md:207,208,218,255`, `README.md:72`, `manual-testing-playbook/manual-testing-playbook.md:284,285`, `manual-testing-playbook/styles-library-utilization/retrieval-query-eligible-cards.md:46,79,80`, and `.../generation-guarded-hydration-mismatch.md:42,75,76`. The documented `_engine` command fails `MODULE_NOT_FOUND`; the corrected command returns `ok:true` with 1,290 eligible records.
- **Smallest fix:** apply this mapping, **not** a blanket substitution — `styles/_engine/<file>.mjs` → `styles/lib/engine/<file>.mjs`; `styles/_engine/tests/<file>` → `styles/tests/engine/<file>`; `styles/_db/` (code) → `styles/lib/database/`; `styles/_db/` (data/index) → `styles/database/`. Then execute every corrected command and both corrected test paths.
- **Value:** very high — the only reproduced executable failure. **Cost:** low. **Confidence: HIGH / CONFIRMED.**

### 5.3 — One retired-vocabulary deletion pass, gated on a green checker
- **Problem (CONFIRMED):** retired owners persist in contracts on the live command path. Sites: `shared/sk-code-handoff.md:61-66, 71-78, 99, 106-107`; `shared/creation-contract.md:126, 167, 169, 176, 194`; `shared/procedure-card-schema.md:56, 72, 101, 113, 119, 120`; `shared/design-proof-token.md:68`; `shared/anti-slop-principles.md` §4; `shared/procedures/polish-gate-orchestration.md:31, 43, 49`; `design-interface/references/design-process/mechanical-defaults.md:19, 147`; `design-interface/references/foundations/corpus-map.md:27`; the three procedure cards' `Owning subworkflow` row; `shared/scripts/README.md:3`; `design-interface/scripts/README.md:12, 38`; `design-interface/feature-catalog/token-system/*.md:3, 18`.
- **Smallest fix:** one pass. Delete the Foundations and Audit handoff cards and their child-usage rows; delete the `foundations`/`audit` proof-minimum rows; correct "four advisory modes" (there are three workflow modes, one of which mutates, plus one transport); rename the three cards' row 2 to `Owning mode | design-interface`; retarget the polish owner to `design-interface`.
- **Gate:** `node .opencode/skills/sk-design/shared/scripts/procedure-card-schema-check.mjs` must exit clean. This single gate closes the review's P1-004 schema half, P1-001, P2-001, P2-003, and research rec 2 together.
- **Named tradeoff, do not skip:** deleting `creation-contract.md:169` removes the last "severity and confidence" vocabulary in sk-design while `sk-code-handoff.md:76` still demands severity for a backlog no mode can produce. Delete both together and record in the packet that scored design QA is accepted-lost, not accidentally-lost.
- **Value:** high. **Cost:** low, one bounded pass. **Confidence: HIGH / CONFIRMED.**

### 5.4 — Fix `PAIRED_MODES` in the Open Design transport
- **Problem (CONFIRMED):** `grounding-receipt.mjs:26-31` accepts `design-foundations` and `design-audit` and rejects `design-md-generator`; enforced at `:354` and `return-reconciliation.mjs:304`.
- **Smallest fix:** replace the array with the modes that may legitimately pair with the transport, then run the packet's own tests.
- **Value:** medium-high — live code, not prose. **Cost:** one array + test run. **Confidence: HIGH that the enum is stale / CONFIRMED. INFERRED (medium) that `design-md-generator` belongs in the replacement — read the mandatory-pairing contract before deciding rather than assuming.**

### 5.5 — Delete the four unsupported proof claims
- **Problem (CONFIRMED):** `commands/interface/design.md:24` ("performance, scoring"), `commands/interface/motion.md:24` ("motion-performance"), `assets/interface-design-presentation.txt:50` ("and scoring"), `assets/interface-motion-presentation.txt:40` ("performance... review"). The card measures nothing and scores nothing; `ux-quality-reference.md:117` §8 already assigns runtime performance to `sk-code`.
- **Smallest fix:** delete the four phrases; keep binary quality/preflight language. Rerun the contract tests.
- **Value:** high. **Cost:** very low. **Confidence: HIGH / CONFIRMED.** Research undercounted the sites by one.

### 5.6 — Delete the duplicate lane enum
- **Problem (CONFIRMED):** `interface-design-auto.yaml:157` declares `build`, the command declares `handoff`. Two authorities, one drifted.
- **Smallest fix:** delete the `user_inputs.mode` line. Do not synchronise it — that preserves the trap.
- **Value:** medium. **Cost:** one line. **Confidence: HIGH / CONFIRMED.**

### 5.7 — Guard the `--design-md` mutation target
- **Problem (CONFIRMED, re-severed to P2):** in the STUDY leak-retry branch, a pre-existing operator-named file outside the output boundary is `rmSync`'d and rewritten. Not a security escape (see §3.6) — a data-loss footgun.
- **Smallest fix:** resolve `--design-md` through `resolveOutputPath` (or simply require it inside `resolvedOutput`) during preflight and fail closed; add one negative test. **Do not** build "a separately documented confirmation policy."
- **Value:** medium. **Cost:** one guard, one test. **Confidence: HIGH on the control flow / CONFIRMED; MEDIUM on real-world exposure.**

### 5.8 — Shrink the root styles README
- **Problem (CONFIRMED):** 165,030 bytes, 1,314 lines, a 1,290-row table whose links resolve to nothing (`styles/099-supply` absent; real path `styles/library/bundles/099-supply`), plus a second broken pair at `:8` (`_harness/`, `_manifest.json`).
- **Smallest fix:** keep the overview, the supported commands, architecture links, and a pointer to `library/bundles/` and the manifests. Delete the table. Fix line 8. Do not repair 1,290 links.
- **Value:** medium — context-load reduction, not navigation (nobody navigates a 165 KB table). **Cost:** very low. **Confidence: HIGH / CONFIRMED.**

### 5.9 — Reconcile two packet lines
- **Problem (CONFIRMED, re-severed to P2):** `spec.md:157` NFR-S01 still requires audit gates intact; `checklist.md:3` frontmatter still describes permanent foundations/audit workflows.
- **Smallest fix:** mark NFR-S01 superseded by ADR-002; correct the frontmatter description.
- **Value:** low-medium. **Cost:** two edits. **Confidence: HIGH / CONFIRMED.**

## 6. NOT WORTH DOING

| Proposal | Why not |
|---|---|
| `/speckit:plan` + five remediation workstreams + specSeed/planSeed for these findings | The entire verified backlog is ~35 line edits, one `if`, one test, one document shrink. The planning apparatus is larger than the work. This is the ceremony pattern the operator has already unwound once. |
| Restore the audit scoring apparatus (/20 rubric, P0-P3 register-gated severity, report template, evidence worksheet) | Correctly eliminated, and the elimination holds on over-engineering grounds. See §7 for the one part of the loss that *is* worth naming. |
| Add severity/confidence/evidence fields to the preflight card | Right answer, wrong reason in the original (§3.5). The card's value *is* that it is binary; grading it re-creates what ADR-002 deleted. |
| Any replacement construct for the three foundations procedure cards | A `subworkflow`-shaped anything is the exact doctrine violation already unwound. The header rename in §5.3 is sufficient for the checker. |
| Deleting `auditFrame` from `mode-registry.json` | Research folded this into rec 2. Carve it out. It has **no code consumer** — grep finds only markdown and JSON — routing already resolves those prompts to `interface`, and it names a real live distinction ("should it be X" vs "make it X") that the `transform-verb-framing` playbook scenarios exercise. Deleting the field risks those scenarios for zero behavior gain. A rename to something non-mode-shaped is optional cosmetics at best. |
| Adding the three cards to the selection table as a required workstream | INFERRED-only benefit. Do it opportunistically inside §5.3 if the rename pass is already open; do not gate anything on it. |
| Merging auto/confirm YAMLs, deleting presentation assets, rebuilding hub/registry, removing the Open Design transport or the storage facade, corpus migration, historical scrubbing | All correctly eliminated by the original research; independently re-checked and upheld. |

## 7. THE AUDIT CAPABILITY: WHAT WAS ACTUALLY LOST

The prior passes were scoped to conformance and asked "is the capability reachable." Neither asked "is it still verifiable." From `scratch/audit-files.before.txt` (70-file `design-audit/` packet) and ADR-002, the deletion covered: the register-gated P0-P3 severity model; the five-dimension /20 rubric; the audit report template and evidence worksheet; `perf_evidence_check.py` and `polish_readiness_check.py`; the accessibility-audit and ai-slop-check procedures; five hardening/anti-pattern references; the corpus comparison lane; and `ai-fingerprint-registry.json` plus eleven `clean.html`/`tell.html` fixture pairs and two parity scripts.

Verdict, split honestly:

- **Detection content: preserved.** The tells survived as sixteen binary rows in preflight card §11, the accessibility floor survived as `ux-quality-reference.md` §2, and layout defaults survived in `mechanical-defaults.md`. A designer running the card catches the same defects. **Not a gap.**
- **Grading and reporting: deliberately gone.** ADR-002 says so explicitly. There is now no way to express "this is a P1" or "this scored 12/20" anywhere in sk-design, and the Evidence Ledger cannot stand in (§3.5). **Accepted design decision, correctly made — but §5.1 and §5.3 must land or the hub keeps promising it.**
- **Executable proof: gone with no replacement, and under-weighted by both passes.** The eleven fixture pairs plus registry plus two parity scripts were the only mechanism proving an AI-tell detector actually fires. Card §11 rows like "no 1px border paired with a ≥16px shadow" and "no radius ≥24px" are mechanically decidable and were previously fixture-backed. They are now honor-system prose in a fill-in checklist. **This is the one thing quietly lost that mattered.** [CONFIRMED that the fixtures are deleted; INFERRED that §11 will regress without them — no measurement exists either way.]

Recommendation: do **not** restore the rubric, severity model, or report template. If anything is ever restored, restore the fixtures — they are the cheap half and the only half that produces evidence. For now, record the fixture loss in the packet as a named, accepted tradeoff so it is a decision rather than an accident.

## 8. CONFIDENCE AND EVIDENCE LIMITS

- Every CONFIRMED item above was checked by direct line read plus, where applicable, command execution on 2026-07-27. Commands run: the package validator (3/3 PASS), `interface-command-contract.test.mjs` (8/8 pass), `design-command-surface-check.mjs --json` (valid), `procedure-card-schema-check.mjs` (**fail**, 3 cards), `style-library.mjs query` on both old and new paths, and direct path-existence checks.
- INFERRED items are marked inline: the correct replacement contents of `PAIRED_MODES` (§5.4), the real-world exposure of the guided-run branch (§5.7), whether the three cards belong in the selection table (§6), and whether §11 regresses without fixtures (§7).
- No invocation telemetry exists, so ordering within §5.4-5.9 is ordinal judgement, not measured ROI. The §5.1-5.3 ordering is not: those are, in order, a routing-layer false promise, a reproduced executable failure, and a currently-red checker.
- I did not run the manual-testing playbook, the design benchmark, `validate.sh --strict`, or the Open Design tests. Those remain the packet's own honestly-pending gates.
- No source file was modified by this synthesis.

## 9. OVERALL JUDGEMENT

The consolidation left the design surface in **good structural shape and poor vocabulary shape**. The topology is right, the validators are green, foundations genuinely survived the fold, and the decision to delete rather than relocate the scoring apparatus was defensible and explicitly recorded. What did not happen is the cleanup pass afterward: retired names are still load-bearing in the shared contracts, in three procedure cards that fail a checker, in one live enum, and — most importantly — in the advisor metadata that decides what the hub is asked to do.

Nothing here needs a plan. It needs one deletion pass, two small guards, and four honest words removed from the hub's own description.

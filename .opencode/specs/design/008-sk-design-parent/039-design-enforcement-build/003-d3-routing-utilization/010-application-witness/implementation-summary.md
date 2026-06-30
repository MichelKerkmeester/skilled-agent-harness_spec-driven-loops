---
title: "Implementation Summary: D3-R10 application-witness (loaded-determinative)"
description: "Post-build record for the APPLICATION WITNESS section on the application proof card and the additive proof_check.py --require-application-witness classifier flag: the three-way not-loaded/loaded-inert/loaded-determinative classification, the well-formedness check, the PASS + three FAIL acceptance, the additive no-regression (source-proof and no-flag unchanged), and the loaded-not-applied / taste-stays-advisory honesty."
trigger_phrases:
  - "application witness implementation summary"
  - "require application witness build record"
  - "loaded determinative witness summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/010-application-witness"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the APPLICATION WITNESS block and the --require-application-witness classifier gate"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/shared/scripts/proof_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-application-witness |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | An `## 7. APPLICATION WITNESS` section on `proof_of_application_card.md` + the additive `proof_check.py --require-application-witness` classifier flag |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Loading a file proved nothing about use. A proof card could claim a rule was loaded with no evidence that the rule actually shaped the output, and the gate would still pass. This phase raises the floor from "loaded" to "loaded had an observable effect on one named output choice". It adds an `APPLICATION WITNESS` section to the application proof card that names a concrete output choice and the specific loaded rule that drove it, plus a new opt-in `proof_check.py --require-application-witness` flag that classifies each witness row and blocks a ready-claim that has no well-formed `loaded-determinative` witness. The flag closes the loaded-but-inert gap while still never claiming the design is tasteful.

### The APPLICATION WITNESS section

A new `## 7. APPLICATION WITNESS` section sits after `SOURCE PROOF` on `proof_of_application_card.md`. It carries a 4-column table in fixed order `[Output choice, Loaded rule source, Classification, Counterfactual]` with a checkbox `Classification` cell listing `[ ] not-loaded [ ] loaded-inert [ ] loaded-determinative`. The lead line states the honest scope directly: a witness proves a loaded rule had an observable effect on one named output choice, it does not prove the design is good, and taste stays advisory. The card footer gained a hint documenting the stricter `--require-application-witness` mode beside the existing `--require-source-proof` hint.

The `loaded-determinative` mark is the anti-self-attestation lever: a checkbox can be ticked, but a determinative classification is only well-formed when the row also names both the output choice and the rule that drove it. The `Counterfactual` column is a human-readable falsifiability anchor carried for the reader, not a gated field.

### The `--require-application-witness` flag

A new additive token in `proof_check.py` mirrors `--require-source-proof` exactly. `_find_application_witness_rows` locates the `/APPLICATION WITNESS/i` heading, reads the first markdown table beneath it (until the next heading), extracts 4-cell rows, and skips the header, the `|---|` separator, and placeholder rows (underscore/whitespace/empty cells with an unchecked classification). `_application_classification` uses checked-`[x]` detection against `APPLICATION_CLASSIFICATIONS = ("not-loaded", "loaded-inert", "loaded-determinative")` to read each row's class. `_validate_application_witness` then aggregates: zero real rows yields `application-witness rows missing`; a `loaded-determinative` row missing its output choice or rule source yields `witness not well-formed`; real rows present but none determinative yields `no loaded-determinative witness`. The witness passes only when at least one well-formed determinative row exists. The result folds into the overall `missing`/`ok` only when the flag is set, preserving the existing `0 = pass, 1 = fail, 2 = usage` exit contract.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Modified | Added the `## 7. APPLICATION WITNESS` section (4-column table + the three-way classifier line + the observable-effect-not-taste framing) after `SOURCE PROOF`, and a footer hint for `--require-application-witness` |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modified | Added the additive `--require-application-witness` flag: `APPLICATION_WITNESS_HEADING`/`APPLICATION_CLASSIFICATIONS`, `_find_application_witness_rows`, `_application_classification`, `_validate_application_witness`, and the `application_witness` key folded into `missing`/`ok` only under the flag |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) landed the change across the two scope-locked files in one pass, mirroring the just-shipped `--require-source-proof` additive flag (D3-R6) in the same card and script. The card gained the witness section and footer hint; the script gained the heading regex, the classification tuple, the row parser, the classifier, and the validator, with `application_witness` threaded into `check()` as a new key that contributes to `missing`/`ok` only when `--require-application-witness` is set. The three deletions in the diff are benign signature extensions: the `check()` signature, the `main()` usage string, and the `check()` call site.

The orchestrator then verified acceptance independently rather than trusting the claim, running `proof_check.py --json --require-application-witness` against fixture cards. A well-formed witness (named output choice + named loaded rule, marked `[x] loaded-determinative`) returned `application_witness.ok` `True` (exit 0). A `loaded-inert`-only card returned `False` with `no loaded-determinative witness` (exit 1). A placeholder-only card returned `False` with `application-witness rows missing` (exit 1). A determinative row naming only one of choice or source returned `False` with `witness not well-formed` (exit 1). No-regression held: a no-flag run kept the original result shape with NEITHER a `source_proof` NOR an `application_witness` key, and `--require-source-proof` still emitted `source_proof` and only that. `python3 -m py_compile` passed and the evergreen scan over both edits was clean. Scope stayed at the two named files; this phase folder authored docs only.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the flag additive and opt-in, mirroring `--require-source-proof` | Existing callers (`proof_check.py <card>`, `--json`, `--require-cards`, `--require-source-proof`) are unaffected; the new behavior only activates when the token is passed, so nothing downstream changes shape |
| Require a well-formed `loaded-determinative` row, not just a ticked box | A self-attested checkbox proves nothing; binding the determinative mark to a named output choice AND a named loaded rule is what makes the witness load-bearing and falsifiable |
| Enforce presence of a load-bearing link, never quality | The witness proves a cited rule changed one named choice; whether that choice was tasteful stays advisory, so the gate raises the floor from "loaded" without ever claiming the design is good |
| Reuse the SOURCE PROOF parsing shape (`_find_application_witness_rows`) | The heading-scoped table parse with header/separator/placeholder skipping is a proven precedent in the same script; mirroring it keeps the witness parser consistent and low-risk |
| Carry the counterfactual as reader-only, gate the classification + named pair | The counterfactual is a human falsifiability anchor; gating it would be brittle, so the strong check stays on the classification plus the named choice/source pair |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ACCEPTANCE — determinative witness | PASS, well-formed `[x] loaded-determinative` row (named output choice + named loaded rule) → `application_witness.ok` `True`, exit 0 |
| ACCEPTANCE — inert only | PASS, `loaded-inert`-only card → `application_witness.ok` `False`, reason `no loaded-determinative witness`, exit 1 |
| ACCEPTANCE — no rows | PASS, placeholder-only rows → `application_witness.ok` `False`, reason `application-witness rows missing`, exit 1 |
| ACCEPTANCE — malformed determinative | PASS, a determinative row naming only one of output choice / loaded rule source → `application_witness.ok` `False`, reason `witness not well-formed`, exit 1 |
| NO-REGRESSION — no-flag shape | PASS, `proof_check.py --json <card>` keeps the original keys with NEITHER `source_proof` NOR `application_witness` |
| NO-REGRESSION — source-proof path | PASS, `--require-source-proof` still emits `source_proof` and NOT `application_witness`; the source-proof path is untouched |
| Benign deletions | PASS, the three diff deletions are signature extensions only (`check()` signature, `main()` usage string, the `check()` call) |
| `python3 -m py_compile proof_check.py` | PASS, exit 0 |
| Evergreen [HARD] | PASS, no spec/packet/phase IDs or `specs/` paths in the card or the script |
| Scope clean (only the 2 named files) | PASS, no other live `.opencode/skills` file was edited by this build; this phase folder authored docs only |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The witness proves a loaded rule had an observable effect on ONE named output choice — it does NOT certify the design is good.** Taste stays advisory. The gate enforces a load-bearing link (a cited loaded rule changed a named choice), never the quality of the choice. Loaded is not the same as applied; the witness closes only the loaded-but-inert gap.
2. **The stricter check is opt-in.** `--require-application-witness` is additive: with no flag (or `--json` / `--require-cards` / `--require-source-proof`), `proof_check.py` behaves byte-for-byte as before. Callers that want the witness floor enforced must pass the flag explicitly; existing CI/build steps gain nothing until they opt in.
3. **A single well-formed `loaded-determinative` row satisfies the gate.** The witness requires at least one — not every output choice traced to a rule. The check raises the floor above "loaded" to "at least one named choice is provably rule-driven"; it does not demand exhaustive per-choice attribution.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the APPLICATION WITNESS card section + the additive --require-application-witness classifier flag
- Additive/opt-in (source-proof + no-flag unchanged); proves loaded had an observable effect on one named choice, not that the design is good (taste stays advisory)
-->

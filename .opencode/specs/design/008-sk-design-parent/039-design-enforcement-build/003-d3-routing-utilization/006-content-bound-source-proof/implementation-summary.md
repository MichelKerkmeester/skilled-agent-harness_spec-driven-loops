---
title: "Implementation Summary: D3-R6 Content-bound SOURCE PROOF"
description: "Post-build record for the SOURCE PROOF blocks on the two sk-design proof cards and the additive proof_check.py --require-source-proof recompute gate: what was built, how it was verified, the source_proof.ok acceptance matrix, and that this is the loading-layer proof the routing utilization guarantee depends on."
trigger_phrases:
  - "content bound source proof implementation summary"
  - "proof_check require-source-proof build record"
  - "source proof recompute gate summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/006-content-bound-source-proof"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the source-proof build and mark the checklist verified"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/assets/context_loaded_card.md"
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
| **Spec Folder** | 006-content-bound-source-proof |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | `SOURCE PROOF` block on both proof cards + additive `proof_check.py --require-source-proof` recompute gate |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Utilization can no longer be self-attested. Before this phase a ready-claim only had to tick a checkbox to assert a file was loaded; nothing forced that claim to bind to real content. This phase replaces self-attestation with a content-bound SOURCE PROOF: every cited file now carries its raw-byte sha256 plus a short verbatim echo that must still be found inside the live file, and `proof_check.py --require-source-proof` recomputes the digest from disk and confirms the echo is genuinely present. This is the LOADING-layer proof that the routing utilization guarantee depends on: a route can claim a resource was loaded, but the digest and echo make that claim falsifiable.

### SOURCE PROOF block on both cards

Both `context_loaded_card.md` and `proof_of_application_card.md` gained a final `## 6. SOURCE PROOF` section: a recompute-rule line that points at the single hashing rule, the gate invocation hint, and a fixed 4-column table `[Path, SHA256, Anchor, Echo]`. The sha256 rule is reused, not reinvented: it is the raw-byte SHA-256 (`sha256:<64 hex>`) defined in `references/design_proof_token.md` section 4, with no trim, no newline normalization, and no frontmatter strip. The application card also extends its footer gate hint to document the stricter `--require-source-proof` mode.

### Additive recompute-based checker

`proof_check.py` gained a `--require-source-proof` flag and a `_validate_source_proof` path that parses the SOURCE PROOF table, ascends to the repo root, recomputes each cited file's raw-byte sha256 from disk, and verifies the `Echo` is a literal substring of the decoded file. It fails on a digest mismatch, on a missing or forged anchor/echo, and on placeholder-only rows; it fails closed when a cited file is unreadable. The flag is strictly additive: with no flag (or `--json` / `--require-cards`) the checker behaves byte-for-byte as before, and `source_proof` only appears in the result when the flag is set.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/assets/context_loaded_card.md` | Modified | Added `## 6. SOURCE PROOF` block (recompute rule + `[Path, SHA256, Anchor, Echo]` table) |
| `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md` | Modified | Added the same SOURCE PROOF block and extended the footer gate hint with `--require-source-proof` |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modified | Added the additive `--require-source-proof` flag + `_validate_source_proof` digest/echo recompute |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) added the two SOURCE PROOF blocks and the additive checker path, then verified them in place. Acceptance was proven against a four-case matrix built from a real cited file's recomputed digest and a verbatim echo line. The orchestrator re-ran the matrix independently rather than trusting the claim, reading `source_proof.ok` from the checker's `--json` output: a faithful card returned `True`, a card with one flipped sha hex char returned `False`, a card with an echo absent from the cited file returned `False`, and a card pointing at a missing file returned `False` (fail-closed). No-regression was confirmed by running the checker with no flag and `--json` on the same card: the original return keys were unchanged and `source_proof` was absent, so existing callers see byte-identical behavior. `python3 -m py_compile` passed, an evergreen scan over the two cards and the script found no spec/packet/phase IDs or `specs/` paths, and the scope stayed limited to the three named files with `design_proof_token.md` reused, not edited.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the `design_proof_token.md` section 4 raw-byte sha256 rule rather than author a second one | Keeps exactly one hashing rule in the system, so cards and checker can never disagree on canonicalization |
| Make the echo a verbatim substring the checker re-finds in the live file | A checkbox can be ticked without reading a file, but a quote that must still appear in the file cannot be produced without the content |
| Ship `--require-source-proof` as an additive opt-in flag | Existing no-flag / `--json` / `--require-cards` callers keep byte-identical behavior, so no-regression holds by construction |
| Fail closed when a cited file is unreadable | An unverifiable source must never be allowed to pass; absence is treated as failure per the token contract |
| Skip placeholder-only rows but fail when zero real rows exist under the flag | Lets the template ship blank placeholder rows while still rejecting a card that claims source proof but supplies none |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `SOURCE PROOF` block present in `context_loaded_card.md` | PASS, `## 6. SOURCE PROOF` with `[Path, SHA256, Anchor, Echo]` table |
| `SOURCE PROOF` block present in `proof_of_application_card.md` | PASS, `## 6. SOURCE PROOF` plus footer gate hint extended with `--require-source-proof` |
| `python3 -m py_compile proof_check.py` | PASS, no syntax error |
| ACCEPTANCE: faithful card | PASS, `source_proof.ok` is `True` |
| ACCEPTANCE: tampered sha (one hex flipped) | PASS, `source_proof.ok` is `False` (digest mismatch) |
| ACCEPTANCE: forged echo (absent from file) | PASS, `source_proof.ok` is `False` (anchor echo absent/forged) |
| ACCEPTANCE: unreadable cited file | PASS, `source_proof.ok` is `False` (fail-closed) |
| NO-REGRESSION: no-flag / `--json` | PASS, original keys unchanged, `source_proof` absent, exit 0 |
| Scope clean (only the 2 cards + script) | PASS, `git status` shows only the three named files; `design_proof_token.md` untouched |
| Evergreen scan (no spec/packet/phase IDs) | PASS, no identifiers or `specs/` paths in the cards or script |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Echo strength rests on quote length.** A one-character or extremely common echo could appear in many files; the contract relies on the author choosing a distinctive verbatim quote, since the checker only verifies literal presence, not uniqueness.
2. **Anchor field is reader-facing, not enforced as a locator.** The checker treats `Anchor` as present/placeholder only; it does not confirm the echo sits at that specific heading or line, so the strong checks remain the digest and the echo substring.
3. **Opt-in gate.** Source proof is only enforced when `--require-source-proof` is passed; a caller that omits the flag still runs the prior, looser gate by design.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Loading-layer build record for the SOURCE PROOF cards and the additive proof_check.py --require-source-proof recompute gate
-->

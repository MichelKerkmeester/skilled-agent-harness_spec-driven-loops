# Recommendations — Spec-Folder Naming Guard (after 2 gpt-5.5-fast xhigh iterations)

Synthesis of the prior PARTIAL research + 2 extra deep-research iterations (adversarial critique + implementation design) + orchestrator ground-truth scans. The two iterations **corrected the prior design**.

## What the extra iterations changed

1. **The defect is rare.** Across ~752 live numbered folders: **0 syntax violations, 0 embedded-sibling matches, 1 generic track-root slug** (`111-base-files-renumbering-name-cleanup`). The motivating `028-026-program-research` is already remediated. So this is a ~1-in-750 problem — the guard must be proportionate, not elaborate.
2. **create.sh is NOT the creation path.** Iteration 1 evidence from the tool-call logs: `create.sh` toolcalls = 0, `mkdir` = 5, **Write-to-spec-path = 176**. The `028` defect itself was Write-created this session. So a create.sh gate would NOT have caught it. **create.sh cannot be the "guarantee."**
3. **The hook layer isn't even live.** Codex `hooks.json` registers prompt/session/compact only (not `PreToolUse`); Claude has `PostToolUse` only; Gemini none. Per-runtime pre-write hooks are aspiration, not enforcement, and add complexity for a rare defect.
4. **The broad embedded-number heuristic false-positives** (`003-skill-advisor-render-103-alignment`, `009-p2-032-cleanup`). Only the tight rule is safe: a track-root slug whose body *starts* with an existing sibling's number AND that sibling is a phase parent (the `028-026-*` shape).

## Recommended design (minimal, proportionate, path-independent)

Ship in this order; each item stands alone:

1. **Shared classifier `classifyProposedSpecFolder()` — but only the high-confidence rule.** TS-authoritative (`shared/spec-folder-naming.ts`) + shell shim in `shell-common.sh`, reusing `isPhaseParent` + the phase-child regex (the existing dual-impl pattern). Implement just `EMBEDDED_SIBLING_PHASE_PARENT` as HARD and `GENERIC_STANDALONE_SLUG` / non-phase-parent embeds as WARN. This is the reusable foundation both iterations agree on.
2. **`validate.sh` `SEMANTIC_NAMING` rule (WARN) — the PRIMARY durable invariant.** It catches folders *regardless of how created* (Write/mkdir/create.sh), which is the only path-independent guarantee. Wire it into BOTH the shell rule (`rules/check-semantic-naming.sh` + `validator-registry.json`) AND the Node orchestrator (`mcp_server/lib/validation/orchestrator.ts`) — iteration 2 caught that `validate.sh` runs the Node orchestrator before the shell fallback, so a shell-only rule would be silently skipped.
3. **Extend the existing pre-commit gate with the classifier.** The repo already has a pre-commit hook (it enforces comment-hygiene). A naming check there is the real cross-runtime, cross-creation-path enforcement point, because every folder funnels through a commit — unlike create.sh, which 176:0 of real creations bypass. Highest-leverage "guarantee" available.
4. **create.sh gate = optional early-warning only.** Iteration 2's exact integration points are valid, but demote it from "guarantee" to a nice-to-have fast feedback on the canonical path. Low priority. Companion fix required first: lowercase the `PROVIDE-DESCRIPTIVE-SLUG` placeholder child names (`create.sh:588,1111`) or a strict phase-child rule would block create.sh's own scaffolding.
5. **Per-runtime pre-write hooks — DEFER (likely drop).** Not live anywhere today, parity gaps, complexity disproportionate to a 1-in-750 defect.

## If only one thing ships
**Build item 1 (tight classifier) + item 2 (validate.sh WARN rule, shell + orchestrator).** That deterministically *detects* every mis-located folder on the next validate, regardless of creation path, with near-zero false positives — and it is the smallest change that actually would have flagged the `028` defect (which create.sh never saw). Add item 3 (pre-commit) if you want it blocked rather than just flagged.

## Honest proportionality note
Given 1 live borderline case in 752, this is a low-severity quality guard. The cheapest high-value slice (items 1+2) is worth it as a cheap regression net; the create.sh gate and runtime hooks are not worth their complexity unless the defect recurs.

Source: `research/iterations/iter-01-critique.md`, `research/iterations/iter-02-implementation.md`, `research/research.md`, and orchestrator scans of `.opencode/specs`.

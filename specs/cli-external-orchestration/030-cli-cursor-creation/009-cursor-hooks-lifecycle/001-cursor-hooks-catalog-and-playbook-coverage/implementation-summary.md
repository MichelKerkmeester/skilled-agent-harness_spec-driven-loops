---
title: "Implementation Summary: cli-cursor hooks feature-catalog + playbook coverage"
description: "Added a feature-catalog entry and a new CU-020 playbook scenario naming all 5 cli-cursor hook adapter files with accurate delivery/review status, authored by two dispatched LUNA (gpt-5.6-luna via cli-codex) agents and independently re-verified."
trigger_phrases: ["cli-cursor hooks catalog implementation", "CU-020 spec-gate-prebind"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/001-cursor-hooks-catalog-and-playbook-coverage"
    last_updated_at: "2026-07-27T03:27:34Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, independently verified, and validated"
    next_safe_action: "Commit and push"
    blockers: []
    key_files: [".opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md", ".opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/spec-gate-prebind-unreviewed.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-catalog-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Documented spec-gate-prebind.mjs now with hedging rather than waiting for review.", "Feature-catalog placement: hub-level.", "New CU-020 rather than extending CU-013/CU-014."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 001-cursor-hooks-catalog-and-playbook-coverage |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Every cli-cursor hook adapter file this repo has — 5 total — is now named with accurate, distinguishing status in both the hub-level feature catalog and the manual-testing-playbook's `hooks/` category, authored by two dispatched `gpt-5.6-luna` (via `cli-codex`) agents and independently re-verified rather than accepted on self-report.

### Feature catalog
`cli-external-orchestration/feature-catalog/feature-catalog.md` gained a 4th H2 category, "CURSOR HOOKS AND SPEC-GATE INTEGRATION", matching the existing `CLI EXECUTOR DISPATCH ROUTING` / `COMPILED ROUTING` categories' exact Description/Current Reality/Source Files shape. A new per-feature file, `cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`, documents all 5 adapters with implementation and validation anchor tables per `create-feature-catalog`'s contract.

### Manual-testing playbook
A new scenario, `CU-020` (`hooks/spec-gate-prebind-unreviewed.md`), documents the 5th adapter. Unlike every other scenario in this playbook (which asserts live-tested behavior), `CU-020` is deliberately **documentation-only**: it confirms the file exists and reads its stated design intent, but never executes it or asserts the gate actually opens. Its default verdict is `SKIP` with the named blocker `pending review of a concurrent session's uncommitted work` — a legitimate use of the playbook's existing SKIP discipline, not a new exception to it. The root playbook's EXECUTION POLICY banner, scenario count (19→20), hooks summary, and Feature Catalog Cross-Reference Index were all updated to match.

### The 5 adapters, as now documented
1. `mcp-server/hooks/cursor/session-start.ts` — `sessionStart`, confirmed fires (phase 004 live-verified).
2. `mcp-server/hooks/cursor/session-end.ts` — `sessionEnd`, confirmed fires.
3. `runtime/hooks/cursor/spec-gate-enforce.mjs` — `preToolUse`, confirmed fires AND confirmed working (deny + exit 2 live-verified to block a real tool call).
4. `runtime/hooks/cursor/spec-gate-classify.mjs` — `beforeSubmitPrompt`, confirmed dormant (event never fires under the installed CLI build).
5. `runtime/hooks/cursor/spec-gate-prebind.mjs` — `sessionStart`, **authored by a concurrent session, uncommitted, not yet reviewed or tested** — every single mention of it in both new documents carries this exact hedging, with zero exceptions.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Re-read `spec-gate-prebind.mjs` in full (it belongs to a concurrent, unrelated session) to confirm it was unchanged since the planning pass and to understand its actual designed purpose well enough to brief the dispatched agents accurately.
2. Decided against extending `CU-013`/`CU-014` in place — a new `CU-020`, framed as documentation-only with a SKIP default, keeps the existing two scenarios' focus intact and avoids ever asserting runtime behavior for code this packet has not reviewed.
3. Read `cli-codex/SKILL.md` in full (392 lines) and confirmed ChatGPT OAuth was active (`codex login status`) before composing either dispatch prompt.
4. Dispatched the first `gpt-5.6-luna` agent (`-c model_reasoning_effort="xhigh" -c service_tier="fast"`, `--sandbox workspace-write`) with a detailed brief: the exact 5 adapter files, their individually-distinct statuses, the create-feature-catalog contract to follow, and an explicit, repeated instruction to hedge every mention of `spec-gate-prebind.mjs`.
5. Independently re-verified the output before proceeding: confirmed the files existed, re-ran `validate_document.py` myself (not trusting the agent's reported exit code), and read the full per-feature file to check the hedging language's actual quality and consistency.
6. Dispatched the second `gpt-5.6-luna` agent (same effort/tier, run sequentially per the skill's single-dispatch discipline — the first process had already exited before the second started) briefed on the exact CU-NNN numbering rule (grep the current highest id, don't assume) and the same hedging requirements, plus a pointer to the just-verified feature-catalog entry as the authoritative status-wording source.
7. Independently re-verified the second dispatch the same way: confirmed CU-020's file, the gap-free CU-001..CU-020 sequence, the root playbook's updated cross-reference index, and re-ran `validate_document.py` myself.
8. Ran a full grep sweep for hedging-language compliance and adapter-name completeness, then the whole-packet `validate.sh --recursive --strict`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **A new CU-020, not an extension of CU-013/CU-014.** `spec-gate-prebind.mjs` is a `sessionStart` hook like the ones CU-013 already smoke-tests, but CU-013's contract is specifically "confirmed-fires smoke test in an isolated temp workspace" — extending it would either dilute its focus or force a runtime assertion about code this packet has not reviewed. A dedicated, deliberately documentation-only scenario keeps both concerns clean.
- **Documented `spec-gate-prebind.mjs` now, not after it's reviewed.** Waiting on another session's uncommitted work has no defined resolution timeline and would leave this phase indefinitely blocked. Honest, explicit hedging — not silence — is the standard this whole packet has used throughout for every genuinely-unconfirmed fact (Composer's context window, the untested hook events, etc.); this is the same discipline applied to a documentation gap rather than a technical unknown.
- **Independent re-verification after each dispatch, not a single trust-the-final-report pass.** Per the "finding is a hypothesis" standard, both agents' self-reported "done, validated, exit 0" claims were re-checked by directly reading the files and independently re-running `validate_document.py`, catching nothing wrong in this case but not assuming that in advance.
- **Sequential, not parallel, LUNA dispatches.** `cli-codex/SKILL.md`'s single-dispatch discipline rule requires one dispatch at a time by default; the second dispatch's own brief depended on reading the first dispatch's verified output as its status-wording source of truth, so sequential ordering was correct for content reasons too, not just the process-hygiene rule.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| Feature catalog names all 5 adapters (SC-001/SC-002) | PASS — `cursor-hooks-and-spec-gate.md` implementation + validation tables list all 5, independently confirmed by direct read |
| Playbook names all 5 adapters (SC-002) | PASS — `CU-013`/`CU-014` (pre-existing) + new `CU-020` |
| `spec-gate-prebind.mjs` hedged everywhere (SC-001) | PASS — `grep -rn "spec-gate-prebind"` across both new docs → 21 hits, 100% hedged; targeted regex for unhedged confirmed-working language adjacent to the filename → 0 matches |
| `validate_document.py` on all 4 new/modified files (SC-003) | PASS — all `✅ VALID`, `Total issues: 0`, independently re-run |
| `check_no_hyphenated_catalog_content.py` on new content | PASS — both new content roots kebab-case |
| CU-NNN sequence gap-free | PASS — `CU-001..CU-020`, verified via `grep -rhoE "CU-[0-9]{3}"` |
| Whole-packet `validate.sh --recursive --strict` (SC-004) | PASS — `10 RESULT: PASSED` across the phase-parent and all 9 children |
| No embedded credential | PASS — security grep across all new/modified files → 0 matches |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. `.opencode/skills/system-spec-kit/runtime/hooks/cursor/README.md` (the runtime hooks folder's own README, owned by the concurrent session or by phase 004's original authoring) still does not mention `spec-gate-prebind.mjs` at all. This is genuinely out of scope for this phase (it is not a feature-catalog or playbook file, and updating another session's in-flight work's own README is not this phase's call to make) — flagged here so the gap is visible, not silently left undiscovered.
2. This phase makes no claim about whether `spec-gate-prebind.mjs` actually works — that determination is explicitly out of scope, reserved for whoever reviews and commits it.
3. If `spec-gate-prebind.mjs` is later committed, reviewed, and confirmed working, `CU-020` and the feature-catalog entry will both need a follow-up update to drop the hedging language and promote it to confirmed-working status alongside the other 4 adapters — this phase does not do that follow-up itself.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md`
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/spec-gate-prebind-unreviewed.md`
- `../../004-cursor-hook-adapter-layer/decision-record.md` (source of the 4-adapter confirmed-fires/dormant status this phase cites)

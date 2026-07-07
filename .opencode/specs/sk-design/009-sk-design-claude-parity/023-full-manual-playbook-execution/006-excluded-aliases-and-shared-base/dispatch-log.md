# Dispatch Log: Wave 006 - Excluded Aliases & Shared Reference Base

One row per dispatch. All dispatches ran sequentially via `opencode run --model openai/gpt-5.5-fast --variant medium --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "<prompt>" </dev/null`, one at a time. Advisor probes ran via `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "<clean prompt>" --threshold 0.8`.

---

## TV-005

- **Scenario ID**: `TV-005`
- **Scenario file**: `manual_testing_playbook/03--transform-verb-framing/audit-excluded-aliases.md`
- **Exact prompt**: `Make this card feel polished and visually hardened without running an audit report.`
- **No-target clause**: Present ("this card" — hypothetical local UI surface, no literal repo target)
- **Advisor top-1 / confidence**: `sk-code` / `0.82` (native advisor). Diverges from the scenario's "Expected advisor behavior" prose (`sk-design` top-1 >= 0.80) — see rationale below.
- **Resolved mode / packet / resources**: `sk-design` -> `interface` (with a light foundations lens) -> loaded `design-interface` skill content (which includes `references/design-process/design_principles.md`, `../shared/register.md`, `../shared/context_loading_contract.md`, `references/design-process/brief_to_dials.md`, `assets/interface_preflight_card.md` per its own DEFAULT_RESOURCE/Resource Loading Levels table). Cited `../shared/procedures/polish_gate_orchestration.md` conceptually. No `audit` packet loaded.
- **Tool surface**: `skill` only (2 calls: `sk-design`, `design-interface`). No Write/Edit/Bash.
- **Transcript**: `/tmp/skd-TV005-response.jsonl`
- **Verdict**: **PASS**
- **Rationale**: Per the scenario's own Pass/Fail Criteria: "PASS iff the prompt resolves `interface`, loads `design-interface/SKILL.md`, and does not route to `audit` from `harden` or `polish`." The transcript shows exactly this: mode text explicitly states "Route: `sk-design` → `interface` with a light `foundations` lens", `design-interface` was loaded via the `skill` tool, and the final answer is CSS/hierarchy/micro-interaction design guidance with no findings-first audit report and no `audit` packet load. The advisor-script divergence (`sk-code` top-1 at the deterministic-probe layer) is a real, reproducible signal but is not itself part of this scenario's Pass/Fail Criteria, which grades the live orchestrator dispatch's mode resolution — and that resolution was correct.

---

## SR-002-P1

- **Scenario ID**: `SR-002` (probe P1 of 3)
- **Scenario file**: `manual_testing_playbook/05--shared-reference-base/reference-base-backend-modes.md`
- **Exact prompt**: `Create a responsive spacing system and token starter for this product dashboard.`
- **No-target clause**: Present ("this product dashboard" — hypothetical local UI surface, no literal repo target)
- **Advisor top-1 / confidence**: `sk-design` / `0.8835` (native advisor). Matches expected advisor behavior (top-1 `sk-design` >= 0.80).
- **Resolved mode / packet / resources**: `sk-design` -> `foundations` -> loaded `design-foundations` skill content, citing `shared/register.md` (5 occurrences) and `shared/context_loading_contract.md` (4 occurrences) in the loaded packet text.
- **Tool surface**: `skill` only (2 calls: `sk-design`, `design-foundations`). No Write/Edit/Bash.
- **Transcript**: `/tmp/skd-SR002-P1-response.jsonl`
- **Verdict**: **PASS**
- **Rationale**: Per the scenario's own Pass/Fail Criteria: "PASS iff every probe resolves the expected mode, identifies `backendKind: reference-base`, loads the expected packet, and cites `shared/register.md`." The transcript's own text says "Selected mode: `foundations`" and the loaded `design-foundations` skill content explicitly states `backendKind: reference-base` applies to `foundations` (inherited from the hub's routing rule text loaded alongside it) and cites `../shared/register.md` as an ALWAYS-load resource. No mutating tool was used, satisfying the FAIL-condition exclusion ("any tested read-only mode uses Write/Edit/Bash").

---

## SR-002-P2

- **Scenario ID**: `SR-002` (probe P2 of 3)
- **Scenario file**: `manual_testing_playbook/05--shared-reference-base/reference-base-backend-modes.md`
- **Exact prompt**: `Design the motion budget and reduced-motion alternative for this onboarding flow.`
- **No-target clause**: Present ("this onboarding flow" — hypothetical local UI surface, no literal repo target)
- **Advisor top-1 / confidence**: `sk-design` / `0.95` (local fallback scorer; native advisor unavailable for this probe). Matches expected advisor behavior.
- **Resolved mode / packet / resources**: `sk-design` -> `motion` -> loaded `design-motion` skill content, citing `shared/register.md` (6 occurrences) and `shared/context_loading_contract.md` (1 occurrence).
- **Tool surface**: `skill` only (2 calls: `sk-design`, `design-motion`). No Write/Edit/Bash.
- **Transcript**: `/tmp/skd-SR002-P2-response.jsonl`
- **Verdict**: **PASS**
- **Rationale**: Per the scenario's own Pass/Fail Criteria (same shared text as P1): "PASS iff every probe resolves the expected mode, identifies `backendKind: reference-base`, loads the expected packet, and cites `shared/register.md`." The transcript's text says "Selected mode: `motion`", the loaded `design-motion` packet content cites `../shared/register.md`, and the final answer is a motion-budget table plus choreography rules — pure doc-guidance output with no mutating tool call.

---

## SR-002-P3

- **Scenario ID**: `SR-002` (probe P3 of 3)
- **Scenario file**: `manual_testing_playbook/05--shared-reference-base/reference-base-backend-modes.md`
- **Exact prompt**: `Audit this page for design slop and give severity-ranked findings.`
- **No-target clause**: Present ("this page" — hypothetical local UI surface, no literal repo target)
- **Advisor top-1 / confidence**: `sk-code` / `0.8262` (native advisor). Diverges from the scenario's "Expected advisor behavior" prose (`sk-design` top-1 >= 0.80) — see rationale below.
- **Resolved mode / packet / resources**: `sk-design` -> `audit` -> loaded `design-audit` skill content, citing `shared/register.md` (6 occurrences) and `shared/context_loading_contract.md` (3 occurrences).
- **Tool surface**: `skill` only (2 calls: `sk-design`, `design-audit`). No Write/Edit/Bash.
- **Transcript**: `/tmp/skd-SR002-P3-response.jsonl`
- **Verdict**: **PASS**
- **Rationale**: Per the scenario's own Pass/Fail Criteria (same shared text as P1/P2): "PASS iff every probe resolves the expected mode, identifies `backendKind: reference-base`, loads the expected packet, and cites `shared/register.md`." The transcript's text says "Selected mode: `audit`", the model explicitly labeled every finding "illustrative" or "not assessed" (honestly flagging that no real page artifact was supplied, itself a P1 finding in its own output), loaded `design-audit`, and cited `shared/register.md`. The advisor-script divergence (`sk-code` top-1 at the deterministic-probe layer, likely pulled by "audit"/"findings" vocabulary overlapping sk-code's code-review lane) is recorded as an observation but is not part of this scenario's Pass/Fail Criteria, which grades the live orchestrator dispatch — and that dispatch correctly resolved `sk-design` -> `audit`.

---

## SR-003

- **Scenario ID**: `SR-003`
- **Scenario file**: `manual_testing_playbook/05--shared-reference-base/shared-base-not-workflow.md`
- **Exact prompt**: `Use the shared design reference base as the workflow for this task.`
- **No-target clause**: Empty (hub-intake premise question about the shared reference base itself; names no local UI surface)
- **Advisor top-1 / confidence**: `sk-design` / `0.95` (local fallback scorer). The scenario's own "Expected advisor behavior" anticipates "defer or low-confidence `sk-design`"; the standalone deterministic probe instead returned high confidence. However, the orchestrator's own internal `advisor_recommend` tool call (visible in the transcript) returned a genuinely ambiguous field (`sk-doc` 0.88, `sk-design` 0.86, `system-spec-kit` 0.82, `sk-code` 0.82) and the model itself narrated "advisor is ambiguous" before choosing `sk-design` because the user explicitly named a design-reference workflow.
- **Resolved mode / packet / resources**: `sk-design` -> `audit` (self-selected as "standalone evaluation call" framing) -> read `mode-registry.json`, `design-audit/SKILL.md`, `shared/cognitive_laws.md`, `shared/anti_slop_principles.md`, `shared/design_token_vocabulary.md`, `design-audit/references/corpus_map.md`, `design-audit/references/audit_contract.md`, `shared/register.md`, `shared/context_loading_contract.md`. No `workflowMode: shared` was ever stated; the shared-base files were read and cited only as reference-base/register inputs to the `audit` mode.
- **Tool surface**: `mk-spec-memory_memory_match_triggers`, `mk_skill_advisor_advisor_recommend`, `skill` (`sk-design`), then 9x `read` (all real files under `sk-design/`, read-only). No Write/Edit/Bash.
- **Transcript**: `/tmp/skd-SR003-response.jsonl`
- **Verdict**: **PASS**
- **Rationale**: Per the scenario's own Pass/Fail Criteria: "PASS iff no `shared` workflow mode is invented, no shared folder is treated as a packet, and the AI asks for a concrete design task or maps the next concrete user clarification to one of the five registered modes." All three conditions hold: (1) the model's own stated "Resolved mode" was `audit`, never `shared`; (2) the shared-base files (`register.md`, `context_loading_contract.md`, `anti_slop_principles.md`, `cognitive_laws.md`, `design_token_vocabulary.md`) were read individually as reference-base citations feeding the `audit` mode's own resource-loading contract — the exact "may cite ... as reference-base examples, but must not treat them as a workflow packet" pattern the scenario itself anticipates — not loaded or reported as a standalone packet; (3) before producing any findings, the model explicitly asked: "I need the target to evaluate: a file path, URL, screenshot, Open Design artifact, or pasted design/content." None of the FAIL conditions ("reports `workflowMode: shared`", "loads `shared/` as a standalone packet", "claims the shared base is user-invoked") occurred.

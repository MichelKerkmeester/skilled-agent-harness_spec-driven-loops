# Dispatch Log: Phase 002 - Transport and Negative-Control Dispatches

One row per real dispatch. Advisor probe run via `skill_advisor.py --threshold 0.8` against the clean exact prompt; real dispatch run via `opencode run --model openai/gpt-5.5-fast --variant medium --format json` with the phase-023 parent's standalone-evaluation addendum appended. Full transcripts saved at `/tmp/skd-<id>-response.jsonl`.

---

## MR-007 — Open Design Transport Mode Routing

- **Scenario file**: `.opencode/skills/sk-design/manual_testing_playbook/mode-routing/mcp-open-design-mode.md`
- **Exact prompt**: `Wire Open Design's MCP server into opencode so I can drive od cli from the terminal.`
- **NO_TARGET_CLAUSE**: Omitted (real, discoverable local target: Open Design's actually-installed CLI/daemon on this machine).
- **Advisor probe top-1/confidence**: `sk-code` 0.95 (tied with `mcp-figma`, `cli-opencode`, `mcp-chrome-devtools`, all 0.95). `sk-design` ranked 6th at 0.90.
- **Resolved mode/packet/resources (real dispatch)**: Model's own `SKILL ROUTING:` text: *"advisor recommended `sk-code` (confidence 0.918)... I'm loading `customize-opencode` and `design-mcp-open-design`."* The internal `mk_skill_advisor_advisor_recommend` tool call (run mid-dispatch) independently ranked `sk-code` 0.9184 top-1, `sk-design` tied 4th at 0.82. `skill` tool was called 3 times, in order: `customize-opencode`, `sk-code`, `design-mcp-open-design`. The dispatch then successfully wired the MCP server via `apply_patch` against `~/.config/opencode/opencode.json`, verified with `opencode mcp list` (`open-design connected`).
- **Verdict**: **FAIL**
- **Rationale**: Two independent scenario criteria are violated. (1) PASS requires `"advisor top-1 is sk-design"` — both the standalone probe and the in-dispatch advisor call ranked `sk-code` top-1, not `sk-design`. (2) FAIL is explicitly triggered by `"a mutating tool beyond Bash is used"` — the dispatch used `apply_patch`, a mutating tool, to edit `~/.config/opencode/opencode.json`. The eventual resolution to `design-mcp-open-design` and the functionally-correct MCP wiring do not cure either violation under the scenario's own criteria.

---

## AI-002 — Pure Code Routes to sk-code

- **Scenario file**: `.opencode/skills/sk-design/manual_testing_playbook/advisor-integration/pure-code-routes-skcode.md`
- **Exact prompt**: `Refactor the parseExecutorConfig function in a TypeScript config loader to throw when the executor type is missing.`
- **NO_TARGET_CLAUSE**: Omitted (non-UI target).
- **Advisor probe top-1/confidence**: `sk-code` 0.9126. `sk-design` did not appear in the result set.
- **Resolved mode/packet/resources (real dispatch)**: Model's own text: *"SKILL ROUTING: `sk-code` is the substantive match for the implementation request; `sk-doc` is only surfaced by the dispatch note, which you explicitly excluded from tracking."* `skill` tool called with `sk-code` then `code-opencode`. No `sk-design` packet loaded at any point.
- **Side effect**: The dispatch implemented the requested refactor for real in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` and `tests/unit/executor-config.vitest.ts` (found the real function via `grep`, edited the schema and parser, updated tests, ran `npm test`/`npm run typecheck`). Confirmed via `git status --short` that the mutation was fully attributable to this dispatch (no staged/pre-existing change on either path); reverted via `git restore` and reconfirmed clean.
- **Verdict**: **PASS**
- **Rationale**: PASS requires `"top-1 is sk-code or another code owner, and sk-design is not top-1 at confidence >= 0.80"` — satisfied on both the advisor probe and the real dispatch's own routing. FAIL's trigger (`"sk-design wins... or loads any design packet"`) did not occur. The out-of-scope code-mutation side effect does not bear on this scenario's own routing criteria and was independently detected and reverted (see `implementation-summary.md`).

---

## AI-003 — Documentation Write Routes Elsewhere

- **Scenario file**: `.opencode/skills/sk-design/manual_testing_playbook/advisor-integration/doc-write-routes-elsewhere.md`
- **Exact prompt**: `Write a README section explaining how the sk-design hub routes its six modes.`
- **NO_TARGET_CLAUSE**: Omitted (pure prose deliverable, not a UI surface).
- **Advisor probe top-1/confidence**: `sk-doc` 0.9185. `sk-design` ranked 2nd at 0.9062 (not top-1).
- **Resolved mode/packet/resources (real dispatch)**: Model's own text: *"SKILL ROUTING: `sk-doc` resolved the request to the `create-readme` packet because the deliverable is README section prose."* `skill` tool called with `sk-doc` then `create-readme`. `sk-design/SKILL.md`, `hub-router.json`, and `mode-registry.json` were `read` (not loaded as an active design mode) solely to source accurate content for the README prose itself — explicitly framed by the model as *"I'll treat this as authoring text for the reply, not a repository edit."* No write to disk; the README section was delivered as response text.
- **Verdict**: **PASS**
- **Rationale**: PASS requires `"top-1 is sk-doc or another documentation owner, and sk-design is not top-1 at confidence >= 0.80"` — satisfied. FAIL's trigger (`"sk-design wins or a design packet loads"`) did not occur — the `sk-design` file reads were source material for prose, not a loaded design-judgment mode.

---

## AI-004 — Code-Correctness Review Routes to sk-code

- **Scenario file**: `.opencode/skills/sk-design/manual_testing_playbook/advisor-integration/code-review-routes-skcode.md`
- **Exact prompt**: `Review this checkout API handler for SQL-injection risk and missing input validation. This is a code-correctness review, not a visual or UI design review.`
- **NO_TARGET_CLAUSE**: Omitted (backend/API target, explicitly not framed as a UI surface by the prompt itself).
- **Advisor probe top-1/confidence**: `sk-code` 0.8985. `sk-design` ranked 2nd at 0.82 (not top-1).
- **Resolved mode/packet/resources (real dispatch)**: Model's own text: *"Skill routing: code-review is active for a security/correctness review."* `skill` tool called once, with `code-review`; loaded `review_core.md`, `review_ux_single_pass.md`, `security_checklist.md`, `code_quality_checklist.md`, `fix-completeness-checklist.md`. No `sk-design`/`design-audit` packet loaded at any point. The model then searched extensively (`glob`/`grep` across the repo and worktrees) for a checkout API handler, found none, and correctly reported *"No checkout API handler was found to review"* rather than fabricating findings against a non-existent target.
- **Verdict**: **PASS**
- **Rationale**: PASS requires `"top-1 is sk-code (routed to its code-review mode), and sk-design is not top-1 at confidence >= 0.80"` — satisfied. FAIL's trigger (`"sk-design wins, design-audit loads a packet..., or the audit-alias overlap... pulls the request into the design family"`) did not occur.

---

## SR-001 — Interface Shared References

- **Scenario file**: `.opencode/skills/sk-design/manual_testing_playbook/shared-reference-base/interface-shared-references.md`
- **Exact prompt**: `Make this landing page look less generic and state the register before recommending colors.`
- **NO_TARGET_CLAUSE**: Included (`"this landing page"` is a hypothetical local UI target absent from this repo).
- **Advisor probe top-1/confidence**: `sk-design` 0.82 — the only skill above the 0.80 threshold in the result set.
- **Resolved mode/packet/resources (real dispatch)**: Model's own text: *"SKILL ROUTING: `sk-design` selected. Mode bundle is `interface + foundations`..."* Loaded `mode-registry.json`, `design-interface/SKILL.md`, `design-foundations/SKILL.md`, `shared/register.md`, `shared/anti_slop_principles.md`, `design-interface/references/design-process/{brief_to_dials.md,design_principles.md}`, and `design-foundations/references/{color/palette_theming.md,type/typography_system.md,layout/layout_responsive.md}`. Response correctly stated `Register: Brand surface` and the design-read dials **before** giving the color palette, matching the prompt's explicit ask. However, an exhaustive grep of every `tool_use` input in the full transcript confirms **zero** read calls to `../shared/context_loading_contract.md` or `design-interface/assets/interface_preflight_card.md` — both are marked `ALWAYS` / `"not optional... prove... before delivery"` in `design-interface/SKILL.md`'s own Resource Loading Levels table (line 76-77 of that file).
- **Verdict**: **FAIL**
- **Rationale**: The scenario's PASS criterion is a conjunction: `"mode is interface, packet is design-interface/SKILL.md, shared register and context contract are loaded before recommendations, and shared vocabulary is cited from shared/ rather than duplicated from the hub."` The `"...and context contract are loaded..."` clause is unmet — `context_loading_contract.md` was never loaded. This directly triggers the scenario's own explicit FAIL condition, `"shared resources are skipped."` Given the scenario's own stated purpose is specifically to verify shared reference-base loading (not just mode routing), and the skipped resource is the one literally named "context loading contract," this is graded FAIL rather than PARTIAL despite otherwise-correct mode resolution and register-first design substance (see `implementation-summary.md` Key Decisions for the full reasoning).

---

## Wave Tally

| ID | Verdict |
|----|---------|
| MR-007 | FAIL |
| AI-002 | PASS |
| AI-003 | PASS |
| AI-004 | PASS |
| SR-001 | FAIL |

**3 PASS, 2 FAIL, 0 PARTIAL, 0 SKIP.**

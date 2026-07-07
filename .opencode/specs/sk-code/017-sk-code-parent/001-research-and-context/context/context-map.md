# Context Map — sk-code parent conversion (Track C)

**Purpose:** authoritative current-state classification + full blast-radius inventory for the sk-code → parent-hub conversion (folding `sk-code-review` in as a mode).

**Provenance:** compiled from this-session reconnaissance (two read-only scouts over the live tree, ripgrep + direct Read). Confirmed items cite the file that proves them; inferred items are marked `[INFER]`. This is the Track-C deliverable draft — when phase 001 formally runs, re-verify with a fresh repo-wide `rg` of both skill tokens and confirm the advisor rebuild empirically.

---

## C1 — `sk-code` internals (v3.5.0.0) → hub-shared vs mode-specific

`sk-code/SKILL.md` frontmatter: `name: sk-code`, `allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]`, `version: 3.5.0.0`. It is already a **two-axis** router: surface {WEBFLOW, OPENCODE, MOTION_DEV} × phase {research → implement → quality-gate → debug → verify}. It already declares a "Review Baseline Contract" ("sk-code-review owns findings format/severity; sk-code owns surface detection").

| Current content | Classification (proposed) |
|---|---|
| `SKILL.md` surface-detection router (smart_routing, stack_detection, phase_detection) | **hub-shared** — becomes the hub dispatcher + `shared/` |
| `references/{universal, webflow, opencode, motion_dev}` + `assets/{…}` (patterns/checklists/recipes/integrations) | **implement-mode** (surface resources consumed by the implement lane) |
| `scripts/{check-comment-hygiene, check-dist-staleness, hooks}` | **hub-shared** (cross-mode tooling) |
| `manual_testing_playbook/` (9 sections incl. 04-skill-advisor-integration, 03-routing-disambiguation) | split: routing/advisor → hub; surface tests → implement mode |
| `benchmark/` | noise — exclude from the migration (large generated output) |
| `graph-metadata.json`, `description.json`, `README.md`, `changelog/` | hub-level (the single identity + hub docs) |

## C2 — `sk-code-review` internals (v1.5.0.0) → the `code-review` mode

`sk-code-review/SKILL.md` frontmatter: `name: sk-code-review`, `allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]`, `version: 1.5.0.0`. Small, self-contained, baseline+surface-evidence model.

| Current content | Classification |
|---|---|
| `references/{review_core.md, review_ux_single_pass.md, pr_state_dedup.md, quick_reference.md}` | **code-review mode** references. `review_core.md` is the doctrine single-source consumers load by absolute path. |
| `assets/{security, code_quality, fix-completeness, solid, test_quality}_checklist.md + removal_plan.md` | **code-review mode** assets |
| `scripts/{check-rule-copies.js, .test.sh}` | **code-review mode** — integrity check that consumer copies of review rules stay in sync with `review_core.md`; **repoint on move** |
| `manual_testing_playbook/` (8 sections), `changelog/` (v1.1–v1.5) | mode-level (preserve) |
| `graph-metadata.json` | **DELETE on fold-in** — this is the second advisor identity |
| `description.json` | absent (nothing to move) |

---

## C3 — Blast-radius inventory (live surface)

Headline: `sk-code` ~428 live files, `sk-code-review` ~119 live files (the rest is `.opencode/specs/**` narration + generated benchmark/JSONL). Buckets that actually change:

**1. Commands** — there is **NO `/code-review` and NO `/code` slash command**; both skills are loaded by *agents*. Command-layer hits are indirect:
- `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` + `_confirm.yaml` — `cross_skill_authoring_load` (sk-code authoring-time, sk-code-review+sk-code review-time)
- `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` + `_confirm.yaml` — same contract
- `.opencode/commands/create/assets/create_parent_skill_{auto,confirm}.yaml` — the scaffolder; names sk-code as an allowed hub family
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — the hub validator (11 invariants)
- `.opencode/commands/design/{interface,audit,foundations,motion,md-generator}.md` — build-handoff sibling refs
- `.claude/commands/**` mirror all of the above

**2. Agents (the real dispatch surface)** — `.opencode/agents/` + `.claude/agents/` mirror:
- `code.md` — `@code` LEAF: "INVOKE sk-code → Read .opencode/skills/sk-code/SKILL.md"
- `review.md` — `@review`: "load sk-code-review baseline first, then sk-code" — primary consumer
- `orchestrate.md` — routing table rows 6 & 8 (review → sk-code-review+sk-code; code → sk-code)
- `deep-review.md` — **hardcodes** `.opencode/skills/sk-code-review/references/review_core.md` (≈lines 193, 298) → breaks on move
- `ai-council.md` — sk-code = council code standards
- `.codex/` has NO sk-code references

**3. Skill-advisor system** — see C4.

**4. Registries / YAML / metadata JSON**:
- `sk-code/graph-metadata.json` — `family: sk-code`; cross-skill edges → `sk-code-review` (×2)
- `sk-code-review/graph-metadata.json` — `skill_id: sk-code-review`; **node must go away**
- `sk-code/` currently has **NO** `mode-registry.json` / `hub-router.json` / `command-metadata.json` (all three exist on sk-design — copy those)
- `.opencode/specs/descriptions.json` — top-level index names both

**5. Adjacent skills** referencing these:
- `sk-design` — `metadata.family: sk-code`; "hand off to sk-code" (precedent hub)
- `sk-git` — boundary disclaimer; `sk-git/graph-metadata.json` names sk-code-review
- `cli-opencode` — dispatch contract rule 12 (load sk-code for surface, add sk-code-review for review; "NEVER hardcode obsolete sibling code skills")
- `cli-claude-code` — identical surface-aware dispatch contract
- `system-spec-kit` — SKILL.md authoring-time vs review-time load contract; ENV_REFERENCE mentions sk-code-review
- `deep-loop-runtime` (style-convention dependency), `deep-loop-workflows` (review doctrine → sk-code-review)
- `mcp-chrome-devtools` / `mcp-open-design` / `mcp-figma` / `sk-prompt` / `sk-doc` / `system-code-graph` — boundary/handoff refs
- `.opencode/skills/README.md` + `.opencode/install_guides/*` — catalog listings

**6. Governance**: `CLAUDE.md` (§Multi-Repo line 9 "Code work routes through sk-code"; PLAN-WORKFLOW LOCK example; Quick-Ref rows), root `AGENTS.md`. `.claude/CLAUDE.md` governs routing (no direct token). `constitutional/*.md` — none. `.codex/AGENTS.md` — none.

**7. Feature catalogs / playbooks / READMEs / changelogs**: sk-code (README, changelog, 9-section playbook, no feature_catalog); sk-code-review (README, 5 changelogs all citing review_core.md, 8-section playbook); `.opencode/skills/README.md`, install guides, root README.

**8. Specs (narration only, not runtime)**: precedent packets `design/008-sk-design-parent` (worked example) and `skilled-agent-orchestration/117-parent-nested-skill-pattern` (the pattern) are the migration playbook.

---

## C4 — Advisor change surface (the decisive mechanic)

The advisor has **NO flat skill registry**. It **directory-scans** `.opencode/skills/` (`system-skill-advisor/mcp_server/lib/daemon/watcher.ts` `walkSkillDirectories`, reads only direct child dirs not starting with `.`) and derives each identity from that dir's `graph-metadata.json` (presence-keyed; `skill-graph-db.ts` `discoverGraphMetadataFiles` / `isSkillGraphMetadata`). The build **throws** if a discovered `graph-metadata.json` has `skill_id != folder` or `family ∉ {cli,mcp,sk-code,deep-loop,sk-util,system}`.

**Exact change set so sk-code = one hub identity and sk-code-review de-registers:**
1. Move `sk-code-review/**` → nested packet `sk-code/code-review/` (removes it from `walkSkillDirectories` discovery).
2. **DELETE** `sk-code-review/graph-metadata.json` (collapses the second identity).
3. Merge sk-code-review's `domains` / `intent_signals` / `derived.trigger_phrases` / `anti_signals` (review, pr review, security review, quality gate, merge readiness, findings — and the "deep review" anti-signal that protects deep-loop-workflows) into `sk-code/graph-metadata.json`.
4. Create `sk-code/mode-registry.json` (modes, each `advisorRouting.routingClass: "metadata"`).
5. Create `sk-code/hub-router.json` (migrate review/security keywords into vocab classes so the hub picks the review mode).
6. Repoint reverse edges naming `sk-code-review` in: `sk-git/graph-metadata.json`, `sk-design/graph-metadata.json`, `system-skill-advisor/graph-metadata.json`, and sk-code's own self-edges.
7. **Regenerate** `system-skill-advisor/mcp_server/scripts/skill-graph.json` via `advisor-rebuild` (never hand-edit). `[INFER]` — rebuild handler named for it; not executed this session.
8. Update advisor test fixtures asserting sk-code-review as a distinct identity: `mcp_server/tests/parity/fixtures/local-native-approved-divergences.json`, `tests/scorer/native-scorer.vitest.ts`, `scripts/fixtures/skill_advisor_regression_cases.jsonl`, `scripts/routing-accuracy/labeled-prompts.jsonl` (~24 advisor files reference the token; mostly tests/playbooks).

**No Python/TS projection-map or drift-guard work** — those exist only for deep-loop's `lexical`/`alias-fold` modes. All sk-code modes are `metadata`-class (mirror sk-design). Confirmed: neither sk-design nor sk-code-review appears in the projection maps, and no sk-design drift-guard exists.

---

## C5 — Highest-risk surfaces (a wrong edit breaks routing system-wide)

1. `sk-code/SKILL.md` — hub identity + router; frontmatter name/description/Keywords drive the whole code-work advisor projection.
2. `sk-code/graph-metadata.json` — advisor discoverability; `skill_id` must equal folder, `family ∈` the closed set (enforced by `parent-skill-check.cjs`).
3. NEW `sk-code/mode-registry.json` — `parent-skill-check.cjs` fails if missing / no `modes[]` / any mode lacks `advisorRouting.routingClass`.
4. `system-skill-advisor/.../skill-graph.json` — generated; regenerate via rebuild or scores drift.
5. `.opencode/agents/review.md` (+`.claude`) — primary sk-code-review consumer.
6. `.opencode/agents/deep-review.md` (+`.claude`) — hardcodes the `review_core.md` absolute path (+ `check-rule-copies.js` sync).
7. `.opencode/agents/code.md` + `orchestrate.md` (+`.claude`) — `@code`/`@review` dispatch + routing table.
8. `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — the validator the migrated hub must pass.

---

## Verification status & next steps

- **Confirmed** (direct Read / rg this session): C1, C2, C3 buckets 1–8, C4 change set steps 1–6/8, C5.
- **`[INFER]` (verify in 001 execution):** step C4.7 (advisor-rebuild regenerates skill-graph.json cleanly after the move) — run the rebuild and diff.
- **Next:** merge with the Track-R taxonomy result (`research/`) into the decision-ready recommendation, then STOP at the 002 human-review gate.

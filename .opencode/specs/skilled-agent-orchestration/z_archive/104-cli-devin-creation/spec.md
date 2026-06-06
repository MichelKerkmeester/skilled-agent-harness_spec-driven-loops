---
title: "Feature Specification: cli-devin skill — Devin CLI peer executor"
description: "Add a fifth cli-* family member so any other cli-* skill can dispatch to Cognition's 'Devin for Terminal' as a peer executor. Mirror the family contract and document Devin's unique cloud-handoff capability."
trigger_phrases:
  - "cli-devin"
  - "devin cli"
  - "devin for terminal"
  - "cognition devin"
  - "delegate to devin"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/104-cli-devin-creation"
    last_updated_at: "2026-05-15T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Initialize spec"
    next_safe_action: "Author plan and tasks"
    blockers: []
    key_files:
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "104-cli-devin-init"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Should cli-devin refuse dispatch when the account lacks cloud-handoff entitlement, or surface a warning and let the call attempt?"
      - "Devin's --json flag — verify the official surface vs the unofficial PyPI CLI's flag before documenting."
    answered_questions:
      - "Spec folder location: .opencode/specs/skilled-agent-orchestration/104-cli-devin-creation/"
      - "Documentation level: Level 2"
      - "Context-gathering executor: cli-codex with gpt-5.5 medium (normal speed)"
---
# Feature Specification: cli-devin skill — Devin CLI peer executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-15 |
| **Branch** | `main` (no feature branch per operator policy) |
| **Track** | `skilled-agent-orchestration` |
| **Packet ID** | `104-cli-devin-creation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo's CLI-executor skill family (`cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode`) lets any one CLI delegate tasks to any other CLI as a peer. Cognition AI's "Devin for Terminal" (the official `devin` Rust CLI) is now a viable peer — it brings a unique local-to-cloud handoff capability no other family member has — but there is no `cli-devin` skill to route to it. Today, cross-AI dispatches to Devin require ad-hoc Bash, with no self-invocation guard, no auth pre-flight, no agent-routing surface, and no documented prompt contract.

### Purpose
Ship a fifth `cli-*` family member, `cli-devin`, that mirrors the existing four siblings' contract (smart router, self-invocation guard, default invocation, agent delegation, memory handback) and adds Devin-specific surfaces (permission modes `normal`/`dangerous`/`bypass`, MCP/skills/rules subcommands, and the unique cloud-handoff pattern).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New skill at `.opencode/skills/cli-devin/` with the standard 7-entry directory shape (SKILL.md, README.md, references/, assets/, changelog/, manual_testing_playbook/, graph-metadata.json).
- SKILL.md (~400 lines) with all 8 family-standard top-level sections (§1 WHEN TO USE through §8 REFERENCES AND RELATED RESOURCES) populated for Devin.
- README.md (~400 lines) with the 9-section TOC pattern shared across the family.
- Five `references/` files: `cli_reference.md`, `integration_patterns.md`, `agent_delegation.md`, `devin_tools.md`, and the Devin-unique `cloud_handoff.md`.
- Two `assets/` files mirroring the family: `prompt_quality_card.md` (pointer-to-shared style is acceptable), `prompt_templates.md`.
- `graph-metadata.json` for skill-advisor visibility, with siblings edges to the other 4 cli-* skills.
- Update the 4 sibling skills' `graph-metadata.json` to add `cli-devin` to their `siblings` edge list (symmetric edge).
- Update the top-level `.opencode/skills/README.md` and the system-spec-kit/skill-advisor data if it ships with a static manifest (verify in tasks).

### Out of Scope
- Refactoring the existing four cli-* skills' content — only their `graph-metadata.json` sibling list changes.
- Building any Devin-side automation (no `~/.config/devin/config.json` writes, no `devin auth login` automation).
- Cloud-handoff billing integration — the skill documents the capability and surfaces an explicit pre-dispatch confirmation gate; it does not check Devin account tier.
- Mirroring `cli-devin` to the `.claude/`, `.codex/`, `.gemini/` agent directories — those are agent definitions, not skills.
- Per memory `feedback_new_agent_mirror_all_runtimes.md`: this is a SKILL, not an agent, so the 4-runtime mirror rule does not apply.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-devin/SKILL.md` | Create | Main skill entry — 8 sections, ~400 lines |
| `.opencode/skills/cli-devin/README.md` | Create | Skill README — 9-section TOC, mirrors family |
| `.opencode/skills/cli-devin/references/cli_reference.md` | Create | Devin command/flag/slash-command reference |
| `.opencode/skills/cli-devin/references/integration_patterns.md` | Create | Calling-AI dispatch patterns |
| `.opencode/skills/cli-devin/references/agent_delegation.md` | Create | Devin rules/skills/MCP routing |
| `.opencode/skills/cli-devin/references/devin_tools.md` | Create | Devin-unique capabilities table |
| `.opencode/skills/cli-devin/references/cloud_handoff.md` | Create | Devin-only: local→cloud handoff pattern |
| `.opencode/skills/cli-devin/assets/prompt_quality_card.md` | Create | CLEAR card pointer (mirror) |
| `.opencode/skills/cli-devin/assets/prompt_templates.md` | Create | Copy-paste templates |
| `.opencode/skills/cli-devin/changelog/v1.0.0.0.md` | Create | Per-version release notes (matches family canonical shape) |
| `.opencode/skills/cli-devin/manual_testing_playbook/manual_testing_playbook.md` | Create | Root playbook — 17 sections, 25 scenarios across 9 categories (matches family canonical shape) |
| `.opencode/skills/cli-devin/manual_testing_playbook/NN--<category>/*.md` | Create | 25 per-feature scenario files across 9 numbered category folders (matches family canonical shape) |
| `.opencode/skills/cli-devin/graph-metadata.json` | Create | Skill-advisor edges, intent signals |
| `.opencode/skills/cli-claude-code/graph-metadata.json` | Modify | Add cli-devin to siblings/related_to |
| `.opencode/skills/cli-codex/graph-metadata.json` | Modify | Add cli-devin to siblings/related_to |
| `.opencode/skills/cli-gemini/graph-metadata.json` | Modify | Add cli-devin to siblings/related_to |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | Add cli-devin to siblings/related_to |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Mirror the family's 8-section SKILL.md shape exactly | `grep '^## ' SKILL.md` of cli-devin returns the same eight `## N. TITLE` lines as the other four siblings, in the same order |
| REQ-002 | Self-invocation guard (Devin-aware) | SKILL.md §2 documents env-var/process-ancestry/lockfile probes for Devin (`DEVIN_*` env, `devin` in ancestry, `~/.config/devin/sessions/*/lock` if it exists). Refusal pseudocode is present. Cloud-handoff sessions explicitly classified as NOT self-invocation |
| REQ-003 | Default Invocation block with concrete `devin` command | SKILL.md §3 contains a copy-pasteable `devin --prompt-file <path> --model <id> --permission-mode normal` invocation that another AI can use as the canonical non-interactive dispatch |
| REQ-004 | Provider Auth Pre-Flight | SKILL.md §3 documents `devin auth status` check + smart fallback (token missing → cite `devin auth login` and `devin configure`; never substitute auth state) |
| REQ-005 | Permission-mode risk taxonomy mapping | SKILL.md §3 + `references/devin_tools.md` map `normal` / `dangerous` / `bypass` to Codex sandbox levels, Claude `--dangerously-skip-permissions`, and OpenCode `--dangerously-skip-permissions` |
| REQ-006 | Cloud handoff documented as a first-class section | `references/cloud_handoff.md` ≥100 lines covering: when to hand off, who initiates, how the calling AI integrates the returned PR, billing-tier warning, and a CHK item for explicit operator confirmation before any handoff |
| REQ-007 | Sibling graph edges updated symmetrically | All four sibling `graph-metadata.json` files contain a `siblings[].target == "cli-devin"` entry with `weight: 0.5` and `context: "CLI orchestrator peer"`; cli-devin's own metadata lists all four as siblings |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Devin command/flag reference complete | `references/cli_reference.md` documents all 12+ top-level commands (`auth`, `mcp`, `rules`, `skills`, `acp`, `shell setup`, `update`, `version`, `setup`, `list`, `--continue`, `--resume`) and all 12 interactive slash commands (`/mode`, `/normal`, `/plan`, `/bypass`, `/clear`, `/fork`, `/revert`, `/steps`, `/ask`, `/model`, `/context`, `/help`) |
| REQ-009 | Memory Handback Protocol entry | SKILL.md §4 references the shared `system-spec-kit/references/cli/memory_handback.md` and gives a Devin-specific `printf … \| node generate-context.js` example |
| REQ-010 | Four model presets documented | SKILL.md §3 documents the four-model preset: SWE-1.6 as default (context gathering / tool use / simple-to-medium well-defined code tasks), DeepSeek v4 Pro as primary for complex tasks, plus GLM 5.1 (agentic / tool-use) and Kimi k2.6 (large-context) as documented complex-task fallbacks. Selection guidance follows the routing matrix in `references/agent_delegation.md` §3 |
| REQ-011 | "When NOT to use" includes self-invocation case | SKILL.md §1 "When NOT to use" explicitly states: if the calling AI is itself a `devin` session running locally, the skill refuses unless the prompt explicitly requests a separate session via `devin` resume/fork or an explicit cloud handoff |
| REQ-012 | `assets/prompt_templates.md` has ≥5 copy-paste templates | One template each for: code-gen, code-review, web-research equivalent, agent delegation, cloud-handoff dispatch |

### P2 — Nice-to-have (may defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Manual testing playbook follows family canonical shape | `manual_testing_playbook/manual_testing_playbook.md` is the root file (matches cli-codex/cli-opencode/cli-claude-code/cli-gemini); 25 per-feature scenario files exist across 9 numbered category folders; each feature file uses the canonical 5-section structure (Overview / Scenario Contract / Test Execution / Source Files / Source Metadata) |
| REQ-014 | Skill-advisor trigger phrases verified | After save, `skill_advisor.py "delegate to devin"` returns cli-devin with confidence ≥0.8 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: From any sibling cli-* skill's session, an AI can dispatch a task to `devin` using the cli-devin SKILL.md §3 "Default Invocation" copy-paste block without external research.
- **SC-002**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/104-cli-devin-creation --strict` exits 0.
- **SC-003**: The cli-devin skill's `graph-metadata.json` is symmetric with all four siblings (each lists the others as `siblings[]`).
- **SC-004**: `grep -c '^## ' .opencode/skills/cli-devin/SKILL.md` returns exactly 8 (the family contract).
- **SC-005**: SKILL.md self-invocation guard prevents `cli-devin` from running when the calling AI is a local `devin` session (without explicit handoff keywords).
- **SC-006**: `references/cloud_handoff.md` is at least 100 LOC and includes the operator-confirmation gate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin CLI installed at dispatch time | Without `devin` binary, the skill cannot validate | SKILL.md §2 Prerequisite Detection block documents `command -v devin` + the install command from `cli.devin.ai/install.sh` |
| Dependency | Devin account with cloud-handoff entitlement | Cloud-handoff section is non-functional without it | `cloud_handoff.md` documents the dependency explicitly; the skill itself doesn't dispatch handoffs — it documents the pattern |
| Risk | Documentation drift if Devin CLI surface changes | Med | `references/cli_reference.md` cites `https://cli.devin.ai/docs/reference/commands` as canonical; mark as "as of 2026-05-15" in metadata |
| Risk | Self-invocation guard false positives | Low | Document the exact env-var prefix Devin uses; verify by reading `~/.config/devin/config.json` shape (if shipped) and process-ancestry pattern; refuse only on positive match, allow on ambiguous |
| Risk | Pricing-tier mismatch (free vs paid Devin account) | Med | Out of scope — document but don't enforce. Add a CHK item: "operator confirms Devin account is provisioned before dispatching cloud-handoff" |
| Risk | Unofficial PyPI `devin-cli` collision | Low | Skill targets the official `devin` Rust binary only; `cli_reference.md` notes the unofficial PyPI package and clarifies the skill does not support it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skill loading time should not regress family baseline. Inspection: `wc -l` of cli-devin/SKILL.md within 350–500 LOC (matches family range 398–454).
- **NFR-P02**: Dispatch latency is bounded by `devin` binary startup, not this skill — skill MUST NOT add synchronous network calls beyond `command -v devin` and `devin auth status` pre-flight.

### Security
- **NFR-S01**: SKILL.md MUST NOT recommend `--permission-mode bypass` without an explicit user-approval gate, mirroring cli-codex's `danger-full-access` and cli-claude-code's `--dangerously-skip-permissions` discipline.
- **NFR-S02**: Cloud-handoff section MUST warn that cloud sessions transmit local repo state to Devin's cloud sandbox; require operator confirmation per CHK-033 pattern.
- **NFR-S03**: SKILL.md MUST NOT log or include Devin API tokens in any example. All token references redirect to `devin auth login` / `~/.config/devin/config.json`.

### Reliability
- **NFR-R01**: Self-invocation guard MUST fail closed — when detection is ambiguous, refuse and emit the refusal message rather than dispatch.
- **NFR-R02**: Reference docs cite `https://cli.devin.ai/docs/reference/commands` and `https://devin.ai/terminal` with explicit "verified 2026-05-15" markers; downstream readers can re-verify.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Empty prompt**: SKILL.md §3 "Default Invocation" requires a prompt; calling AI MUST surface the empty-prompt error before dispatch.
- **Maximum prompt length**: Devin's `--prompt-file <path>` flag accommodates large prompts; templates default to file-based for prompts >2KB.
- **Invalid model name**: `devin --model <unknown>` fails fast at the binary level. Skill instructs callers to constrain selection to the four documented presets (SWE-1.6 default, DeepSeek v4 Pro primary for complex, GLM 5.1 and Kimi k2.6 as complex-task fallbacks).

### Error Scenarios
- **Devin binary not installed**: `command -v devin` fails → SKILL.md surfaces the install command and refuses to dispatch.
- **Auth missing/expired**: `devin auth status` shows unauthenticated → calling AI surfaces `devin auth login` to the operator; no auto-login.
- **Network timeout during cloud handoff**: Out of scope for the skill — cloud handoff is operator-initiated, not skill-orchestrated. `cloud_handoff.md` documents the failure mode.
- **Self-invocation detected**: Skill emits canonical refusal message (matching the family pattern) and exits without dispatching.

### State Transitions
- **Partial dispatch (binary started, output not returned)**: Calling AI MUST capture both stdout and stderr (`2>&1`), apply `</dev/null` for non-interactive runs (per family stdin-redirect convention), and surface raw output rather than guessing.
- **Cloud handoff initiated, local session continues**: Cloud session is asynchronous and returns a PR. `cloud_handoff.md` documents the integration step (PR review).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 12 new files + 4 small modifications; well-bounded |
| Risk | 10/25 | Low — additive only; no existing skill bodies modified; mirrors a proven family pattern |
| Research | 12/20 | External CLI surface had to be researched (already done in prior turn); family contract had to be extracted from 4 skills (done via cli-codex recon + local synthesis) |
| **Total** | **36/70** | **Level 2** (above the Level 1 ceiling at 100 LOC; below Level 3 threshold at 500 LOC) |

Justification for Level 2 (not Level 1): aggregate LOC across the 12 new files will exceed 1500. Justification for not Level 3: no architectural decisions beyond mirroring an existing pattern; no ADRs required; no cross-team coordination.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the official `devin` CLI expose a top-level `--json` flag for structured output (the way `opencode run --format json` does)? Search results suggested it; the official `cli.devin.ai/docs/reference/commands` page does not list it. **Action**: in `references/cli_reference.md` document as "unverified — confirm before relying on it in automation."
- Should `cli-devin` add a `:cloud` invocation modifier (analog of `:auto`/`:confirm`) to make the cloud-handoff path a first-class skill operation, or stay documentation-only? **Recommendation**: documentation-only for v1.0; revisit after first real use.
- Does Devin have a stable env-var prefix like `OPENCODE_*` / `CLAUDECODE`? **Action**: write the self-invocation guard to probe both `DEVIN_*` env-var prefix and `devin` in process ancestry; layer 3 (lockfile) requires confirmation against an actual Devin install — leave the probe path as TBD with explicit `# TODO verify` comment if uncertain.
- Codex sandbox flag for cloud-handoff dispatches from cli-codex (network-bound) — should the skill recommend `-c sandbox_workspace_write.network_access=true` per memory `feedback_codex_sandbox_blocks_network.md`? **Recommendation**: yes, document in `integration_patterns.md`.
<!-- /ANCHOR:questions -->

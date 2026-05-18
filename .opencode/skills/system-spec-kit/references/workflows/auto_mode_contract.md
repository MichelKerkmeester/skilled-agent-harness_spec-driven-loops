---
title: Auto Mode Contract Reference
description: Canonical three-tier `:auto` setup-resolution contract shared by every user-invokable `/command:*:auto` surface. Defines tier semantics (resolve → targeted ask → fail-fast), `PRE-BOUND SETUP ANSWERS:` marker grammar, default-resolution table format, fail-fast error template, `:confirm` invariance, and verification protocol.
---

# Auto Mode Contract Reference

This reference module defines the single canonical `:auto` setup-resolution contract used by every user-invokable `/command:*:auto` surface in spec-kit (`/spec_kit:*`, `/create:*`, `/improve:*`). Each command's §0 cites this contract and supplies only its own per-field Default Resolution Table + `PRE-BOUND SETUP ANSWERS:` field list. The contract semantics, marker grammar, error format, and verification protocol live here.

Origin: shipped from the deep-review prototype and generalized in `.../002-auto-mode-contract-generalization-to-all-commands/` (12-command rollout).

Related memory: `feedback_auto_mode_ask_only_when_ambiguous.md`, `feedback_codex_spawnagent_allowlist.md`, `feedback_gate3_no_tmp_exemption.md`.

---

## §1. Three-Tier Flow

`:auto` mode does NOT mean "never ask" (too rigid) and does NOT mean "always ask the full setup block" (too soft). It means "ask only when uncertain or ambiguous." This is achieved via three tiers, evaluated in order:

### Tier 1 — Resolve Confidently

When `execution_mode = AUTONOMOUS` (from `:auto` suffix), the command's §0 MUST attempt to resolve every required input from these sources in order:

1. **`$ARGUMENTS` flags** — explicit user-passed flags (e.g. `--max-iterations=10`, `--spec-folder=PATH`, command-specific flags)
2. **`PRE-BOUND SETUP ANSWERS:` block in the prompt body** — see §2 for grammar. Caller's explicit prompt-body binding wins over `$ARGUMENTS` when both are present
3. **Documented per-field defaults** — see the command's own Default Resolution Table (§3) for which fields carry sensible defaults

After resolution: if every required field has a value, persist the resolved map to the command's working-config file (e.g. `deep-review-config.json`, `plan-config.json`), set `STATUS: PASSED`, load the paired YAML workflow. Do NOT emit any setup question. End §0.

### Tier 2 — Targeted Ask

Use Tier 2 ONLY when Tier 1 leaves one or two required inputs unresolved AND each unresolved field is genuinely ambiguous AND no sensible default exists.

Constraints:
- Emit ONE narrow question per ambiguous field, naming only the ambiguous field. NEVER the full consolidated Q-block from the legacy setup phase.
- If two fields are ambiguous but one's resolution likely makes the other obvious (e.g. `review_target_type` may make `spec_folder` self-evident), ask the first one first; do not bundle multiple ambiguities into a single prompt.
- Missing required input (e.g. empty `$ARGUMENTS` with no marker for a required positional) is NOT ambiguity. Absence is a Tier 3 case.
- Wait briefly for user reply. If an answer arrives, merge it into the resolved map and re-run Tier 1 from the default-application step. If stdin is closed (`</dev/null`, redirected output, non-interactive dispatch) and no answer arrives, fall through to Tier 3. Never wait indefinitely.

### Tier 3 — Fail Fast

Use Tier 3 when `:auto` still has unresolved required inputs after Tier 1 and Tier 2, OR when Tier 2 produced no answer because stdin is closed.

Emit the named-missing-inputs error format (§4), exit non-zero, do NOT load the YAML workflow, do NOT emit any further setup question.

---

## §2. PRE-BOUND SETUP ANSWERS Schema

The `PRE-BOUND SETUP ANSWERS:` block is a structured marker the dispatched AI parses out of the prompt body. It allows callers to pre-bind setup field values without using individual `$ARGUMENTS` flags.

Grammar (YAML-style key/value, one field per line):

```
PRE-BOUND SETUP ANSWERS:
  <field_name>: <value>  # optional inline comment
  <field_name>: <value>
  ...
```

Rules:

- The block opens with `PRE-BOUND SETUP ANSWERS:` (exact case-sensitive heading, followed by colon). Indentation MAY be inside a markdown fenced code block or inline in the prompt text.
- Each field is `  <key>: <value>` indented two spaces, one per line.
- Values are interpreted by the command's Default Resolution Table (§3). Field types and value enums are command-specific.
- Comments after `#` on a value line are ignored.
- Unknown fields produce a warning (do not abort), so callers may include forward-compatible fields.
- Fields not specified fall back to: command-specific Default Resolution Table → command-specific default value → unresolved (triggers Tier 2 or Tier 3 per §1).
- Malformed lines (e.g. missing `:`, malformed value type) emit a parse error naming the line. Known fields parsed before the error may still be used; remaining unresolved fields continue to Tier 2 or Tier 3.
- A second `PRE-BOUND SETUP ANSWERS:` block in the same prompt body produces a duplicate-block error.

The marker block applies ONLY under `:auto`. Under `:confirm`, the block is informational and does not skip the consolidated question prompt.

---

## §3. Default Resolution Table

Every command MUST publish a Default Resolution Table in its §0 (after citing this contract). The table lists each setup field with the following columns:

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|

Column meanings:

- **Field**: the field name (matches the schema in §2 and the question label in the legacy consolidated Q-block).
- **Required**: `Y` (must be resolved before YAML load) or `N` (optional).
- **Resolves Via**: ordered list of resolution sources, e.g. `flag → $ARGUMENTS` / `marker → PRE-BOUND` / `default → "<value>"` / `auto-detect from <other field>` / `requires-ask`.
- **Default**: the documented default value when no flag, marker, or auto-detection applies. May be `none` (no default — Tier 2 or Tier 3 candidate).
- **Tier-2 Candidate**: `Y` if a missing value can be resolved by ONE targeted question (per §1); `N` if absence triggers fail-fast (Tier 3).

A field is a Tier-2 candidate only when ALL of:
- No flag exists for it.
- No marker is provided.
- No sensible default exists.
- The field is genuinely required (Required=`Y`).
- A user choice is the only resolution path (ambiguity, not absence).

---

## §4. Tier 3 Fail-Fast Error Template

When Tier 3 fires, the command emits this exact format and exits non-zero:

```
[ERROR] /<command>:auto — required inputs unresolved under autonomous mode:
  - <field>: <why-unresolved>
  - <field>: <why-unresolved>
Resolution: provide via $ARGUMENTS flags, PRE-BOUND SETUP ANSWERS: block, or switch to :confirm mode for interactive setup.
```

Rules:

- Replace `<command>` with the canonical command name (e.g. `spec_kit:deep-review`).
- One bulleted line per unresolved required field.
- `<why-unresolved>` is one short phrase: "missing — no flag, no marker, no default" or "ambiguous — Tier 2 received no answer (stdin closed)".
- Final line cites the three resolution paths verbatim.
- Do NOT load the YAML workflow.
- Do NOT emit setup questions in Tier 3.
- Exit code: non-zero (1 is the convention).

---

## §5. `:confirm` Invariance

The `:confirm` mode (interactive, with full consolidated Q-block) is unaffected by this contract. Commands MUST preserve their existing `:confirm` behavior exactly. The contract applies ONLY when `execution_mode = AUTONOMOUS` (from `:auto` suffix or explicit `--mode=AUTONOMOUS` flag).

Test invariant: a `:confirm` dispatch against any contract-adopting command MUST emit the original consolidated Q-block (Q0..Qn). Regression-check this per command after migration.

---

## §6. Verification Protocol

Each contract-adopting command requires four verification traces (dry-run mental dispatch traces against the command's §0):

### Trace A — Tier 1 pass
Dispatch with all required inputs resolvable (flags + markers + defaults). Expected: STATUS PASSED, YAML loaded, no question emitted.

### Trace B — Tier 2 targeted ask
Dispatch with exactly one ambiguous required field. Expected: ONE narrow question naming only that field; NEVER the full consolidated block.

### Trace C — Tier 3 fail fast
Dispatch with one or more truly missing required inputs (and stdin closed in non-interactive runtimes). Expected: error format from §4, exit non-zero, no YAML load.

### Trace D — `:confirm` regression
Dispatch with `:confirm` suffix and any inputs. Expected: existing full consolidated Q-block emitted.

Live verification (when feasible) extends the dry-run traces with actual non-interactive dispatches (codex `exec </dev/null`, opencode `run --pure ... </dev/null`, claude `--print`) capturing transcripts as evidence. Live verification confirms the contract works under real runtime stdin-closure conditions.

Evidence schema (one file per dispatch):
- Command invocation verbatim
- Full transcript
- Verdict footer: PASS / PARTIAL / FAIL / SKIP
- Optional: timing, model, runtime gotchas observed

Stored under `<packet>/evidence/<command-slug>-<trace>.txt`.

---

## §7. Adoption Checklist

For each command adopting this contract, the §0 of the command markdown:

- [ ] Adds a one-line citation: `Setup contract: see references/workflows/auto_mode_contract.md`
- [ ] Provides its own per-field Default Resolution Table (§3) listing every Q-block field with the four columns
- [ ] Provides its own `PRE-BOUND SETUP ANSWERS:` field list (one row per setup field, matching the Default Resolution Table)
- [ ] Documents any command-specific Tier-2 ordering rule (e.g. "ask review_target_type before spec_folder")
- [ ] Updates frontmatter `argument-hint` to reference the new bypass capability
- [ ] Preserves the existing `:confirm` consolidated Q-block path untouched
- [ ] Authors §0 dry-run traces (A/B/C/D) and stores them under the adopting packet's `evidence/`

Commands that have adopted this contract:

- `/spec_kit:deep-review` (prototype) — see `.../103/001-deep-review-three-tier-setup/`
- (to be appended as `.../103/002-...` rolls out)

---

## §8. Out of Scope

- Commands without paired YAML workflows (`/improve:prompt`, `agent_router`, etc.) — they have no setup-phase surface where the contract applies.
- Skill-internal `:auto` flows (sk-doc, sk-code routing, etc.) — those are skill SKILL.md surfaces, not `/command:*` surfaces.
- YAML workflow internal interaction gates (e.g. mid-loop approval gates) — handled by each YAML's own non-interactivity rules, not this contract.
- Cross-command `:auto` integration (e.g. `/spec_kit:plan:auto` chained into `/spec_kit:implement:auto`) — separate contract concern.

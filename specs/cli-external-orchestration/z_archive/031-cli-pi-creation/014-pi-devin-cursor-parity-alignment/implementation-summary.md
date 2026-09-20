---
title: "Implementation Summary: Pi devin/cursor parity alignment"
description: "Closed three concrete gaps between cli-pi and its cli-devin/cli-cursor siblings: authored a new pi-tools.md unique-capabilities reference, upgraded two references' stale confidence framing to cite phases 007/012/013's real findings, and added missing cross-validation/anti-patterns/overview sections; GLM-5.2 independently reviewed all 11 files and found 1 blocking + 3 minor factual issues, all fixed."
trigger_phrases:
  - "pi devin cursor parity alignment summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/014-pi-devin-cursor-parity-alignment"
    last_updated_at: "2026-07-27T21:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built directly, GLM-5.2 reviewed, all 4 findings fixed, closed Complete"
    next_safe_action: "None -- terminal phase; packet re-closes at 14 phases"
    blockers: []
    key_files: ["references/pi-tools.md", "references/native-skills-and-extensions.md", "references/mcp-and-third-party-packages.md", "references/integration-patterns.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["3 concrete structural/content gaps confirmed via direct file reads (not the earlier session catalog alone): missing unique-capabilities reference, stale confidence framing in 2 files, missing cross-validation/anti-patterns/overview sections.", "GLM-5.2 independently reviewed all 11 changed/new files against the real repo (not from memory): found 1 blocking factual error (a cli-devin reasoning-effort claim that was actually true only of cli-cursor) and 3 minor issues, all fixed.", "All 14 same-file and cross-file section cross-references across the whole packet, after 5 files' renumbering, verified correct by both me and GLM-5.2 independently."]
---
# Implementation Summary: Pi devin/cursor parity alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-pi-devin-cursor-parity-alignment |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This is the terminal phase of `031-cli-pi-creation`, added at operator request to align `cli-pi`'s references, assets, and general setup closer to `cli-devin` and `cli-cursor`. A 3-agent research pass (workflow `wf_f578832c-f69`) produced directly-comparable structured catalogs of all 3 packets; direct reads of `cli-pi`'s own current files then confirmed 3 concrete gaps worth closing.

### Gap 1: Missing unique-capabilities reference

Both `cli-devin` (`devin-tools.md`) and `cli-cursor` (`cursor-tools.md`) catalog what makes that CLI distinctive versus its 5 siblings. `cli-pi` had no equivalent. `references/pi-tools.md` was authored matching that structural pattern (OVERVIEW → per-capability What-It-Is/Capabilities/Compared-to-Other-CLI-Executors/Best-For → CAPABILITY COMPARISON table → BEST PRACTICES), covering: persistent bidirectional RPC (`--mode rpc`, unique among the 6), first-party native extensions (`.pi/extensions/*.ts`), first-party native prompt templates (`.pi/prompts/*.md`, shared only with `cli-codex`), the minimal 7-tool built-in surface with `--tools` allowlisting, and `--thinking` reasoning-effort control.

### Gap 2: Stale confidence framing

`native-skills-and-extensions.md` and `mcp-and-third-party-packages.md` were both written before phases 007/012/013 landed, and still framed several claims as "Per Pi docs, unconfirmed" that those later phases had already live-confirmed: `pi-mcp-extension`'s stdio transport (phase 007: `sequential_thinking` + `mk-spec-memory` both connected), `pi-subagents`' agent-mirroring (phase 012: 13/13 agents live-loaded without a schema error), and native prompt-template/extension discovery at the project-local surfaces this repo actually populates (phase 012: 36 prompts + 6 extensions live-loaded; phase 013: `$ARGUMENTS` substitution live-confirmed). Both files were corrected to cite the real evidence, while genuinely-still-open items (native skill-discovery precedence, a live lifecycle-event firing trace) stayed labeled as open.

### Gap 3: Missing structural sections

`integration-patterns.md` gained a CROSS-VALIDATION WITH OTHER CLI EXECUTORS section and an ANTI-PATTERNS section (5 named BAD/GOOD pairs), matching both sibling packets' own files. `assets/prompt-templates.md` gained an OVERVIEW/flag-reference section, a concrete "Example" under every existing template, and a new SPEC-FOLDER PRE-APPROVAL (GATE 3 BYPASS) template. Five reference files (`agent-delegation.md`, `model-dispatch-gpt-5.6.md`, `native-skills-and-extensions.md`, `mcp-and-third-party-packages.md`, `integration-patterns.md`) gained a leading OVERVIEW section — every devin/cursor reference file already had one; only `cli-reference.md` (built first) had one on the Pi side.

### Renumbering and cross-reference audit

Adding an OVERVIEW section to 5 files shifted every subsequent section number by one. A small Python script automated the renumbering and same-file `§N` shifts, but blindly shifted cross-file `§N` references too — including ones pointing at files that were NOT renumbered (`pi-tools.md`), or at files whose OWN shift didn't match the source file's shift timing. A full manual grep audit of every `§[0-9]` occurrence across every touched file, cross-checked against actual current headings, found and fixed 6 such mismatches before GLM-5.2's independent review re-confirmed all 14 cross-references resolve correctly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/pi-tools.md` | Created | Unique-capabilities catalog. |
| `references/native-skills-and-extensions.md` | Modified | Confidence upgrades (phases 012/013), new OVERVIEW section, renumbered. |
| `references/mcp-and-third-party-packages.md` | Modified | Confidence upgrades (phases 007/012), new OVERVIEW section, 2 lint fixes, renumbered. |
| `references/integration-patterns.md` | Modified | New CROSS-VALIDATION + ANTI-PATTERNS sections, new OVERVIEW section, renumbered. |
| `references/agent-delegation.md` | Modified | New OVERVIEW section, renumbered (incl. `2A` → `3A` hand-fix). |
| `references/model-dispatch-gpt-5.6.md` | Modified | New OVERVIEW section, renumbered. |
| `references/cli-reference.md` | Modified | One cross-reference to `pi-tools.md` added. |
| `assets/prompt-templates.md` | Modified | New OVERVIEW/flag-reference section, Examples added, new template. |
| `SKILL.md`, `README.md` | Modified | Link `pi-tools.md`. |
| `changelog/v1.1.0.0.md` | Created | Release changelog; `version:` bumped to `1.1.0.0` on every touched file. |
| `cli-external-orchestration/leaf-manifest.json` | Regenerated | `pi-tools.md` registered as a leaf. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built directly (no LUNA dispatch) since the task was comparative editorial judgment across three existing packets' content, not new-artifact scaffolding a fresh model could do from a brief alone. A 3-agent Workflow research pass produced the initial structural catalogs; every edit was then grounded in direct reads of the actual current files, not the catalog's paraphrase.

GLM-5.2 (`devin -p --model glm-5.2 --permission-mode auto`) independently reviewed all 11 changed/new files against the real repo: every `§N` cross-reference, every "Confirmed (phase N)" claim against the actual `implementation-summary.md` files, every factual claim about `cli-devin`/`cli-cursor` against their real `SKILL.md`/reference files, and every markdown link's resolution. It found 1 blocking issue and 3 minor issues, all in claims about sibling CLIs' own behavior:

1. **[BLOCKING]** `pi-tools.md`'s reasoning-effort comparison wrongly claimed `cli-devin` bakes effort into its model id and rejects a separate flag — that is true only of `cli-cursor`. `cli-devin`'s model ids carry no effort tier at all; reasoning depth toggles mid-session via `Alt+T`/`Opt+T`. Fixed to describe each CLI's real, distinct mechanism.
2. **[MINOR]** The example model id used a hyphen (`glm-5-2-max`) where `cli-cursor`'s real allowlist uses a dot (`glm-5.2-max`). Fixed.
3. **[MINOR]** A session-continuity claim conflated `cli-devin`'s `-c`/`-r` short forms with `cli-cursor`, which only has `--continue`/`--resume` (no short forms). Fixed to name each CLI's real flags separately.
4. **[MINOR]** A phase-007 citation implied phase 007 confirmed `pi-mcp-extension` was installed "alongside `pi-subagents`" — `pi-subagents` was actually added in phase 012, after phase 007's own install. Fixed to scope the phase-007 citation to `pi-mcp-extension`'s own install only.

GLM-5.2's review otherwise confirmed everything else: all 14 cross-file section references, every other phase-citation, every other devin/cursor factual claim (hooks.json/hooks.v1.json shape, Devin's 4-tier permission model, Cursor's lack of a `--tools` equivalent, both CLIs' command/skill symlink-mirror targets), all 30+ markdown links, and internal consistency against `SKILL.md`/`README.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build directly rather than dispatch to LUNA | The task is comparative editorial judgment across 3 existing packets' content and this packet's own confidence-labeling discipline — not new-artifact scaffolding a fresh model could reliably do from a brief. |
| Preserve every existing confidence label; only upgrade what a named phase actually confirmed | This packet's whole differentiator from its siblings is honest confidence-labeling; diluting that to look more "aligned" would be a regression, not an improvement. |
| Manually audit every `§N` cross-reference after the automated renumbering, rather than trust the script | The script blindly shifts every `§N` pattern in a file's text, including ones that point at a DIFFERENT file that wasn't itself renumbered (or was renumbered at a different point in the pass) — a real, silent-failure-mode risk a purely mechanical renumbering would have missed. |
| Get an independent GLM-5.2 review before commit, scoped to fact-checking sibling-CLI claims specifically | New cross-CLI comparison content is exactly the place a plausible-but-wrong claim about a sibling's behavior can hide; GLM's review caught 1 real blocking error here. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type reference` on all 9 touched/new markdown files | PASS — `VALID, 0 issues` each |
| `parent-skill-check.cjs` on the hub | PASS — 0 warnings, incl. `10b-byte-drift` leaf-manifest check |
| Manual `§N` cross-reference audit (all touched files) | PASS — 6 real mismatches found and fixed pre-review; GLM-5.2 independently re-confirmed all 14 cross-references correct post-fix |
| GLM-5.2 independent review | REQUEST CHANGES → all 4 findings (1 blocking, 3 minor) fixed → re-validated clean |
| Whole-packet `validate.sh --recursive --strict` (parent + all 14 phases) | Run via the established main-tree round-trip pattern; result recorded at commit time |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two Pi-native open questions remain genuinely open**, inherited from phases 004/008 and explicitly labeled as such in the updated content: native skill-discovery precedence/flattening behavior, and a live lifecycle-event firing trace for the extension API (currently type-confirmed only). Both need a credentialed provider session no phase in this packet has had.
2. **This phase did not re-audit phases 007/012/013's own historical `implementation-summary.md`/`checklist.md`/`tasks.md` content** — those remain accurate records of what was verified at completion time; only `cli-pi`'s reference-file content was updated to reflect the fuller picture now available.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->

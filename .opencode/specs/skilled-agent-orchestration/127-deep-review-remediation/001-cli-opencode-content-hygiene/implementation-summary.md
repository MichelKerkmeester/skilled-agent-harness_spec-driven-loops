---
title: "Implementation Summary: Phase 1 cli-opencode-content-hygiene"
description: "cli-opencode's 5 pre-existing WS-A content bugs are fixed: the Rule 16 pkill self-contradiction (real safety bug), the stale retired-cli-codex sibling row, the missing share-confirmation note, the `--agent` recipe drift, and 6 corrupted playbook filename links. Version bumped 1.3.15.2 to 1.3.15.3 with a matching changelog entry."
trigger_phrases:
  - "cli-opencode content hygiene complete"
  - "pkill self-contradiction fixed"
  - "cli-opencode v1.3.15.3"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/001-cli-opencode-content-hygiene"
    last_updated_at: "2026-07-10T05:33:00Z"
    last_updated_by: "claude"
    recent_action: "Corrected F1 kill form after cross-verify"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/README.md"
      - ".opencode/skills/cli-opencode/changelog/v1.3.15.3.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-001-cli-opencode-content-hygiene"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All 5 WS-A findings fixed and re-verified; 0 remaining broken links; scoped git diff confirms the GPT-5.6 rename was untouched"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-cli-opencode-content-hygiene |
| **Completed** | 2026-07-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`cli-opencode` no longer contradicts its own safety rules or ships broken links. This phase closes all 4 WS-A findings from the whole-program deep review plus a 5th Fable-5 finding, fixing them directly in the live skill files without touching the in-flight v1.3.15.2 GPT-5.6 rename sharing the same tree.

### F1: Rule 16 pkill self-contradiction (real safety bug)

`SKILL.md` ALWAYS Rule 5 says never auto-kill operator-owned `opencode run` sessions, then Rule 16 told the reader to do exactly that with `pkill -9 -f "opencode run"` - a blanket pattern match that kills every matching process on the machine, not just the one this skill dispatched. Rule 16 now captures the dispatched process's own PID at launch (`opencode run ... & OC_PID=$!`) and kills only that captured PID directly and its own children (`kill -9 "$OC_PID" 2>/dev/null; pkill -9 -P "$OC_PID" 2>/dev/null`), with an inline cross-reference back to Rule 5 so the two rules can't drift apart again unnoticed.

### F2: stale cli-codex row in the sibling-boundary table

`README.md`'s "Sibling Boundaries" table listed `cli-opencode` twice - the second row (`OpenAI | Sandboxed coding, repo analysis, PR review, live web research`) was the retired `cli-codex` skill's description, left behind from the packet-122 deprecation. Deleted. The table now lists exactly the two live cli-* skills.

### F3: missing share-confirmation note

The parallel-detached quick start ran `opencode run --share --port 4096 ...` without ever mentioning that `--share` needs operator confirmation first - even though the skill's own `share-requires-confirmation` hard_rule and NEVER rule 2 both require it. A one-line blockquote now sits directly above that code block.

### F4: default-dispatch recipe contradicted its own no-`--agent` rule

The Step 3 "default dispatch" recipe passed `--agent context` at the top level - which is precisely what SKILL.md ALWAYS Rule 3 and the very next paragraph in the same README say not to do. The recipe now omits `--agent` and folds the role into the prompt body instead ("Act as a context-retrieval agent: ..."), so the example finally matches the rule it sits next to.

### F5: 6 corrupted filename links

A concurrent session's blanket `sk-prompt-models` to `sk-prompt/prompt-models` find/replace had split a filename in half inside 6 link targets across the manual testing playbook, pointing at paths that don't exist on disk. All 6 are restored to the real filenames; no files were renamed, only the links that pointed at the wrong place.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | F1 pkill scoping fix (Rule 16); version `1.3.15.2` → `1.3.15.3`. |
| `.opencode/skills/cli-opencode/README.md` | Modified | F2 stale row deleted; F3 share-confirm note added; F4 `--agent` recipe fixed. |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Modified | F5: 4 corrupted filename links repaired (CO-035/CO-036 Feature File links + both index-list links). |
| `.opencode/skills/cli-opencode/manual_testing_playbook/prompt-templates/deepseek-v4-direct-with-sk-prompt-models.md` | Modified | F5: its own "Feature file path" trailer repaired. |
| `.opencode/skills/cli-opencode/manual_testing_playbook/prompt-templates/kimi-k2-7-direct-with-sk-prompt-models.md` | Modified | F5: its own "Feature file path" trailer repaired. |
| `.opencode/skills/cli-opencode/changelog/v1.3.15.3.md` | Created | Documents all 5 fixes, following the `v1.3.15.2.md` entry format. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every finding was re-verified against the live file (grep or Read) immediately before editing, since the manifest's line numbers were marked approximate. Each fix was a targeted `Edit` on an exact matched string, never a blanket replace, to avoid colliding with the in-flight GPT-5.6 rename sharing the same files. After all 5 edits, a fresh grep confirmed 0 remaining corrupted links and a scoped `git diff --stat -- .opencode/skills/cli-opencode/` confirmed only the intended files changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Kill the captured PID directly (`kill -9 "$OC_PID"`) plus its children (`pkill -9 -P`), not a process group | The rule still needs to reap the dispatcher's own orphans, so deleting cleanup entirely would trade "kills too much" for "kills nothing". A first draft used a negative-PID group kill (`kill -9 -- -"$OC_PID"`); a gpt-5.6-sol-fast cross-verify caught that a backgrounded `opencode run &` is not a process-group leader without `setsid`/`set -m`, so that form hits a nonexistent group and misses the process. The direct-PID kill plus `-P` children is the correct scoped cleanup. |
| Fold the F4 agent profile into the prompt body rather than just deleting `--agent context` | SKILL.md's own Default Invocation note says an agent-profile request belongs in the prompt body, not deleted outright. Rewriting the prompt to "Act as a context-retrieval agent: ..." keeps the recipe's original intent (a context-style dispatch) while following the documented pattern. |
| Leave `graph-metadata.json`'s "four sibling cli-* skills" causal_summary text unchanged | It is stale (only two live cli-* skills exist post cli-codex retirement) but it was not one of the 5 WS-A findings in the fix manifest; fixing it here would be scope creep beyond the frozen fix list. Noted in spec.md Out of Scope instead. |
| Keep the `SCAFFOLD_VALIDATION_COUNTS` HTML comment block at the bottom of spec.md/plan.md/tasks.md | A real, already-validated Level-1 phase doc in this repo (`124-sk-prompt-parent/008-cutover-and-rollout/spec.md`) keeps the identical block; it is inert scaffold-tooling residue that `validate.sh` does not check, so removing it would be an unrequested cosmetic change against established local convention. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Each of F1-F5 re-verified against the live file before editing | PASS - `SKILL.md:337`/`:351`, `README.md:63-76`/`:77-88`/`:135-145`, and a 6-hit grep all matched the manifest's claims. |
| `grep -rn "with-sk-prompt/prompt-models" .opencode/skills/cli-opencode/` | PASS - 0 matches (exit 1) after the fix, down from 6 before. |
| `git diff --stat -- .opencode/skills/cli-opencode/` | PASS - only `SKILL.md`, `README.md`, `manual_testing_playbook.md`, the two `prompt-templates/*-with-sk-prompt-models.md` trailers, and the new `changelog/v1.3.15.3.md` carry this phase's edits; the pre-existing GPT-5.6 rename files were untouched. |
| `SKILL.md` frontmatter `version:` | PASS - reads `1.3.15.3`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../001-cli-opencode-content-hygiene --strict` | PASS - `Errors: 0  Warnings: 0` (see command output below this table's authoring pass). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`graph-metadata.json`'s `causal_summary` still says "four sibling cli-* skills."** Only `cli-opencode` and `cli-claude-code` exist post cli-codex retirement. Out of scope for this phase (not one of the 5 WS-A findings) - flagged for a future pass, not silently fixed here.
2. **F1's cleanup assumes `$!` captures the `opencode run` process itself, not an intermediate wrapper.** If a dispatch is launched through an additional shell wrapper layer, `$!` is the wrapper's PID, so the actual `opencode run` PID would need to be captured instead. The fix kills the captured PID directly (not a process group), since a backgrounded `opencode run &` is not a group leader without `setsid`/`set -m`. Noted inline in the changelog entry's Caveats section.
3. **This is a documentation/instruction-content fix only.** No runtime script or automation code changed; nothing to smoke-test beyond re-reading the corrected text.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

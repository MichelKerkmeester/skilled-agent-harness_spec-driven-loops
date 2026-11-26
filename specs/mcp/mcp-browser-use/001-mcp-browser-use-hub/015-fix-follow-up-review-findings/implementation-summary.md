---
title: "Implementation Summary"
description: "A prompt naming all three browser modes routes to all three, one shared word no longer lifts a skill to the advisor floor, and the Aside installer runs only a pinned script."
trigger_phrases:
  - "fix follow up review findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings"
    last_updated_at: "2026-11-24T07:44:39Z"
    last_updated_by: "claude"
    recent_action: "Built and verified every phase 015 fix"
    next_safe_action: "Run a gate-proven re-review of the hub epic"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-fix-follow-up-review-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-fix-follow-up-review-findings |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt naming all three browser modes now routes to all three, and one shared word no longer lifts a skill to the advisor's 0.82 floor. The Aside installer runs only a script whose digest it knows, and the capture example cannot write outside `./tmp`.

### Phase 15: fix-follow-up-review-findings

The follow-up deep review returned CONDITIONAL without recorded stop gates. Each P1 was checked against source first, and this phase fixes the ones that held.

- **Front door.** `mcp-bladebro` was missing from Bladebro's aliases, so the other two mode ids each matched two vocabulary entries and pushed Bladebro outside the ambiguity window. Adding the id makes the three score alike. A canary case now holds that prompt.
- **Advisor.** The last word of a skill id counted as naming the skill on its own. That let ordinary words lift system-deep-loop ("loop"), mcp-tooling ("tooling") and mcp-code-mode ("mode"). The noun now counts only when the prompt shares another word with that skill too. Bare `staging` stopped anchoring the browser hub, and the hub dropped `mcp-code-mode` from its keyword list, which had pulled in "fix the code in the parser".
- **Aside.** The capability matrix lists console and network capture as not offered. The capture example rejects `..`, and the installer checks a pinned sha256 before it runs the vendor script.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | The id noun needs another shared lexical token |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `lanes/lexical.ts` | Modified | Bare `staging` dropped, `staging portal` added |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modified | `doctor-none-04` re-pinned to no recommendation |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v2.0.3.0.md` | Modified, Created | Advisor release 2.0.3.0 |
| `.skilled/skills/mcp-browser-use/hub-router.json`, `ROUTER.md` | Modified | `mcp-bladebro` alias; `ROUTER.md` synced, including two phrases it had dropped |
| `.skilled/skills/mcp-browser-use/SKILL.md` | Modified | Aside capture cell, keyword comment, version |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` | Modified | Rejects `..` in the session dir |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh` | Modified | Download, verify the pinned digest, then run |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json` | Modified | Three-mode bundle case |
| Hub `description.json`, `mode-registry.json`, `README.md`, `changelog/v1.1.3.0.md` | Modified, Created | Release 1.1.3.0 and the `leaf-scopes.json` description |
| Hub `graph-metadata.json` | Modified | Generated advisor intent signals gain the two phrases `ROUTER.md` had dropped |
| Hub benchmark reports index, playbook result pointer, `compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/` | Modified, Created | Index rows and the 52-row follow-up replay |
| Activation manifest and its archive copy | Modified | Re-minted for policy `fc55eafa` |
| `../review/review-report.md` | Modified | Corrects the staging, design and release-note rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The advisor change came first. In-process probes covered every id noun of four or more letters, and a temporary trace in `fusion.ts` attributed each lift to its anchor clause before the trace was reverted. Candidate rules were scored against the eight ratchet metrics and the browser replay. The full advisor suite then ran on a rebuilt `dist`. It moved one doctor-slice row, which the operator approved re-pinning (Q009). The hub fixes followed, each checked by its own command. After the version bump re-minted the policy hash, the 52-row replay ran once more. The advisor change is committed apart from the hub change, so either can be reverted alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A structural rule for the id noun, not a stop list | A list of `code`, `design` and `prompt` would change nothing, because the explicit lane already anchors those skills. The rule keeps "run the doctor update check" and drops the single-word lifts |
| Fold the scorer fix into this phase (Q006) | The operator chose it over a separate advisor packet |
| Keep `staging site`, `staging url`, `staging website` and add `staging portal` | Dropping bare `staging` alone made MBU-PB-06 lose the hub at stage one. A staging portal is the same kind of web front as the phrases already kept |
| Pin the Aside installer by sha256 (Q008) | The vendor publishes no checksum. A pin refuses a changed script rather than running it unread |
| Leave the shared 0.45 lexical anchor alone | It belongs to every skill and is not this review's finding. Changing it moves pinned slices across the whole advisor |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full advisor suite, `npx vitest run` | 2,737 passed, 4 skipped, 1 failed. The failure is the known empty `system-skilled-bots` test, the same as the 014 baseline |
| Advisor ratchet metrics, in process | Full 161, unknown 14, false fires 5, holdout 49, ambiguity 21, review 25, memory save 27, delegation 22. All equal to the committed variant |
| Two-stage replay, 52 rows | 51 PASS, 1 FAIL (MBU-PB-04, stage one only) |
| Hub canary harness | exit 0; exit 1 with the new alias removed |
| `compiled-route-guard.cjs --json` | 8 hubs fresh, 0 stale |
| `parent-skill-check.cjs .skilled/skills/mcp-browser-use` | OK, 0 warnings |
| `node --test .skilled/bin/tests/mcp-installers.test.cjs` | pass 5, fail 0 |
| Playbook validators, three modes and the hub | each `violations=0 warnings=0` |
| `quality-gate.cjs --worktree` | `NO_BLOCKER_FOUND`, 0 findings |
| `validate.sh` on the hub epic, `--strict --recursive` | RESULT: PASSED on every folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two generic words still pass the shared lexical anchor.** "fix the container orchestration config" lifts sk-code, mcp-code-mode and the browser hub to 0.82. The hub matches through its `chrome devtools orchestration` signal and the `fix` to `debug` synonym. A fix belongs to the shared anchor, not to one hub.
2. **MBU-PB-04 still gets no advisor recommendation.** The front door routes it to Chrome DevTools.
3. **The installer pin covers the script only.** The archive the vendor script downloads is not verified. A vendor update to the script needs the digest bumped after reading it.
4. **The path guard rejects any `..`,** so a folder name such as `./tmp/a..b` is refused too.
5. **Not done here:** the 006 status drift, the `@latest` install-guide convention and the install-gate, engine and packet-wording P2 findings. `spec.md` Out of Scope gives the reason for each. The follow-up review is not gate-proven, because its lineages skipped the terminal-gates step.
<!-- /ANCHOR:limitations -->

---



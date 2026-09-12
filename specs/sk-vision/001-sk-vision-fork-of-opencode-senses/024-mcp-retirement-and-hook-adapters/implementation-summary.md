---
title: "Implementation Summary: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters"
description: "What stage 1 built, what a live probe disproved before it was built, and what remains gated on an approved deletion."
trigger_phrases:
  - "sk-vision MCP retirement summary"
  - "sk-vision hook adapter summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters"
    last_updated_at: "2026-09-11T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Transport deleted, docs realigned, both host paths verified live."
    next_safe_action: "Open an agents-track packet for the retired code-index tool cleanup."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters/implementation-summary.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/evidence/prompt-evidence.ts"
      - ".opencode/skills/sk-vision/vision-runtime/src/cli/vision-cli.ts"
      - ".opencode/skills/sk-vision/hooks/devin/sk-vision.mjs"
      - ".devin/hooks.v1.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-024-mcp-retirement-and-hook-adapters"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Cursor delivers no prompt-time hook event, proven by probe."
      - "Cursor's route is the CLI, chosen by the operator."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:outcome -->
## 1. OUTCOME

The MCP transport is retired and both replacement paths are verified in live host sessions. Nine of eleven acceptance criteria are met.

The packet changed shape partway through. It was authored with both Cursor and Devin on prompt-time hooks. A live probe disproved the Cursor half before any adapter was written, and the operator chose a CLI for that host instead. Devin kept the hook, which is the stronger mechanism and the one its runtime actually supports.
<!-- /ANCHOR:outcome -->

---

<!-- ANCHOR:what-shipped -->
## 2. WHAT SHIPPED

| Area | Change |
|---|---|
| Evidence core | `vision-runtime/src/evidence/prompt-evidence.ts`: image-path detection over prompt text, analysis, evidence wrapping, per-call teardown |
| CLI | `vision-runtime/src/cli/vision-cli.ts`: the entry Cursor's command and rule invoke |
| Devin adapter | `hooks/devin/sk-vision.mjs` on `UserPromptSubmit`, registered in `.devin/hooks.v1.json`, mirrored into the shared hook hub |
| Build | Two node-targeted bundle entries added. The MCP entry stays until the deletion is approved |
| Cursor surfaces | `.cursor/commands/vision.md` and `hooks/cursor/vision-rule.md` now invoke the CLI and name no MCP tool |
| Devin rule | Rewritten as a fallback note, since the hook now injects without being asked |
| Dead registrations | Two decommissioned server grants removed from the Devin allowlist; an orphaned code-index bullet removed from the root README |
| Transport removal | MCP server, its test, the bin entry, the `mcp` script, the SDK dependency, the MCP build step, both skill-owned configs and both mirror symlinks deleted. Devin's Code Mode moved to a Devin-owned file first |
| Documentation | `SKILL.md`, both READMEs, the hooks topology doc, the feature catalog (MCP leaf replaced by two adapter leaves), the playbook (four MCP scenarios retired, two added), the injection contract and the kill-switch index |

Detection is deliberately conservative: a candidate path only counts when it resolves to a file that exists, so a prompt mentioning a filename in passing never spins the local GPU.
<!-- /ANCHOR:what-shipped -->

---

<!-- ANCHOR:validation -->
## 3. VALIDATION EVIDENCE

| Check | Baseline | Final |
|---|---|---|
| `bun test` in `vision-runtime` | 20 pass, 0 fail, 60 assertions | 27 pass, 0 fail, 57 assertions (4 MCP tests deleted, 11 added) |
| `bun test` in `hooks/devin` | did not exist | 8 pass, 0 fail, 15 assertions |
| `bunx tsc --noEmit` | exit 0 over 14 files | exit 0, no output |
| Build | `plugin.js`, `mcp-server.js` | plus `prompt-evidence.js` and `vision-cli.js` (33 KB against the MCP server's 1.1 MB) |

End to end, with the local model and a generated image carrying known text:

- The CLI returned scene, caption and OCR, and the OCR matched the text in the image.
- The Devin adapter returned the correct envelope with `hookEventName: UserPromptSubmit`, 1176 characters of injected context, the outer marker present, no nested bare tag, and zero bytes on stderr.
- No orphaned runtime process survived either call.

Live host runs:

- **Devin**, GLM-5.2 via `devin -p`: asked whether its context already carried a `SK-VISION EVIDENCE` block, the model answered YES and pasted the OCR line verbatim, without running any tool. A separate probe with a `SessionStart` control confirmed Devin delivers `UserPromptSubmit` in headless mode.
- **Cursor**, via `cursor-agent -p`: the model followed the always-apply rule to the exact CLI command and returned OCR recovering the fixture's code.

Gates after the deletion: catalog validator PASS with 0 violations, playbook validator PASS with 25 scenarios and 0 violations, `validate_document.py --type skill` VALID with 0 issues, and the skill-root metadata audit 13 of 13 passing after regenerating the leaf manifests.

The Cursor probe is recorded in `scratch/cursor-event-probe.md` and as ADR-005.
<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:deviations -->
## 4. DEVIATIONS AND DEFECTS FOUND

**Cursor's hook design was wrong and was replaced.** Two repository documents disagreed about whether `beforeSubmitPrompt` is delivered. A probe with a positive control settled it: the event does not fire on build `2026.09.02-c22c1a3`. ADR-005 carries the method.

**Two defects were found by running the code, not by a test.**

The Devin adapter first imported the CLI's bundle. A bundle exports only what its own entry exports, so the function it needed was `undefined` and the adapter fell through to its fail-open path on every turn. Every test still passed, because they all assert that same empty object. The fix gave the evidence core its own bundle entry, and a regression guard now asserts the dependency directly. That guard was itself negative-controlled: pointed at the wrong bundle it fails, pointed at the right one it passes.

The outer evidence wrapper reused `<SK-VISION>`, which the per-signal renderers already emit, so it nested the tag inside itself and stranded a closing tag. The marker is now `<SK-VISION EVIDENCE>`, following the OpenCode command hook's precedent.

**One instructed change was reverted.** Removing the retired code-index tool from the two Claude agent definitions tripped the mirror-sync commit gate: `.opencode` is canonical and still requires that tool through its body prose, so clearing only the mirror creates drift. Doing it properly means fifteen sites across four agent files plus regenerating the Pi mirrors, which is its own packet.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:remaining -->
## 5. DOC-ALIGNMENT FOLLOW-UP

A later pass audited every documentation surface describing what this packet changed, and found three gaps the original pass missed.

**The skill had no changelog entry and no version bump.** The convention here is one entry per version under the skill's own `changelog/`, and the existing entry documents the state this packet superseded. Added `v0.3.0.0` covering the retirement, both new adapters, the shared core, the marker, the kill-switch and the Devin config ownership move, with its verification table and the two operator notes. Bumped the version in `SKILL.md`, the skill `README.md` and the runtime `package.json`.

**`.devin/SYNC.md` was made false by this packet.** It stated that only `hooks.v1.json` is authored in that directory, and never listed `mcp_config.json` at all. Moving Devin's Code Mode registration into a Devin-owned real file made that claim wrong. Corrected the claim, added the inventory row, and recorded why ownership moved.

**One pre-existing defect was found and fixed.** `.pi/extensions/README.md` pointed at `sk-vision/pi/sk-vision.ts` in two places. That path has not existed since the hook restructure; the adapter lives under `hooks/pi/`. Not caused by this packet, cheap to correct while in the same surface family, and the symlink target confirms the corrected path.

Gates re-run from that final state: skill, readme and changelog documents VALID with zero issues, feature catalog PASS with zero violations, manual testing playbook PASS at 25 scenarios, skill-root metadata 13 of 13, and the alignment-drift verifier PASS over 38 files with zero findings.

---

## 6. REMAINING WORK

One item, and it belongs to a different track:

- **The retired code-index tool in the agent definitions.** `detect_changes` appears at fifteen sites across four agent files, including a permission grant and review-methodology prose, plus two generated Pi mirrors. Removing it from the Claude mirror alone trips the mirror-sync commit gate, because `.opencode` is canonical. This needs an agents-track packet and its own Gate 3 answer. Nothing breaks meanwhile: the agents already degrade gracefully when the tool is unavailable.

Two operator notes from the live runs:

- Cursor's headless mode needs `--force`. Its auto-review classifier rejects the shell call otherwise, and the model reports the block clearly rather than inventing an answer.
- The default `moondream2` reads synthetic rendered text poorly. It recovered `CODE 7741` but garbled surrounding words. The benchmark configuration uses `SK_VISION_MODEL=moondream3-preview`.
- Measured hook latency was 13 seconds on a warm model, comfortably inside the 60-second timeout. A cold first load still exceeds it, and a timed-out hook is skipped.
<!-- /ANCHOR:remaining -->

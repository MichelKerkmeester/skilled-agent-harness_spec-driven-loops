---
title: "Cross-runtime directive-lifecycle dedup"
description: "Lifecycle-scoped advisor policy delivery with transcript high-water tracking, trusted host-boundary invalidation, hardened durable state, confirmed identities, and evidence-class-aware runtime verification."
trigger_phrases:
  - "directive lifecycle dedup"
  - "directive dedup"
  - "SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP"
  - "SPECKIT_PI_DIRECTIVE_DEDUP"
  - "advisor directive repetition"
version: 3.7.0.3
---

# Cross-runtime directive-lifecycle dedup

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The skill-advisor brief carries a dynamic `Advisor:` route line followed by constant policy. Model-context runtimes send the complete block on the first proven turn and after lifecycle or transcript boundaries, then may retain only the route line on a proven repeat. When no brief exists the advisor hooks emit a fallback that opens with one status line above the directives block: `Advisor: outage (<label>); route by hand: ...`, `Advisor: no skill matched.` or `Advisor: prompt skipped.` Dedup treats that fallback like a brief, so a known, confirmed session gets the whole text on the first no-route turn and the status line alone on later turns, while unknown sessions, the kill switch and thrown errors always get the whole text. Pi's visible input transform instead suppresses its complete advisor-and-dispatch contribution on a proven repeat so the raw user turn remains byte-identical.

Suppression is fail-open. Missing transcript evidence, ambiguous or conflicting identity, clock drift, insecure durable state, store contention, changed policy, and disabled dedup all retain complete delivery.

---

## 2. HOW IT WORKS

The implementation separates three responsibilities:

1. **Contract and decision**
   - `directive-lifecycle-contract.ts` defines the versioned record, clock, state, and flag contract.
   - `directive-lifecycle.ts` owns brief splitting, confirmed-session checks, two-read clock stability, lifecycle boundaries, transcript high-water behavior, and global or per-session boundary advancement.
   - Normal transcript growth advances the high-water mark before route-only delivery is allowed. A later shrink therefore restores full delivery.

2. **Durable cross-process state**
   - `directive-lifecycle-file-store.ts` stores versioned records for per-prompt subprocess adapters.
   - Durable suppression requires private owned directories; regular owned files; restrictive modes; one link; bounded size and scans; no-follow opens; post-open directory identity checks; atomic replacement; per-session writer locks; monotonic high-water merging; and temp cleanup.
   - Symlink, type, owner, permission, link-count, size, topology, contention, Python-helper availability, or IO uncertainty disables suppression for that operation.
   - An identified host boundary advances one session epoch. An unidentified host boundary rotates the store generation so every older record fails open.

3. **Runtime adapters**
   - Claude, Codex, Cursor, and Devin use registered system-spec-kit adapters and the canonical advisor target.
   - Session and compaction owners notify the canonical store through a bounded boundary bridge instead of relying only on prompt payload fields.
   - OpenCode keeps an in-process mirror. Only one primitive, non-conflicting session identity can suppress. Ambiguous boundary events invalidate all older receipts. With the plugin's opt-in `deduplicateTransforms` on, the plugin hashes the full advisor block for same-message transform dedup before lifecycle reduction runs. Reduction runs only for a block that will be delivered, so dedup suppresses a repeated transform for the same message instead of delivering it as a shorter block.
   - Pi retains its runtime-local bounded lifecycle decision. A byte-identical repeat of the full contribution (route head plus directives) returns no input transform or delivery receipt; first turns, lifecycle resets, a changed contribution (route head or directives), missing identity, advisor failure, and disabled dedup fail open to the declared full-or-dispatch-only behavior. Tool-call dispatch enforcement remains independent of prompt-text cadence.

Kill switches:

- `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`: restores complete delivery for Claude, Codex, Cursor, Devin, and OpenCode.
- `SPECKIT_PI_DIRECTIVE_DEDUP`: restores complete Pi delivery.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts` | Versioned state and decision contract. |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` | Canonical decision, high-water logic, clocks, and in-memory state. |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` | Hardened cross-process durable store. |
| `.skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` | Canonical trusted-boundary target. |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Prompt adapter applying the canonical decision. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` | Registered runtime-to-advisor boundary bridge. |
| `.skilled/plugins/system-skill-advisor.js` | OpenCode identity, generation, epoch, and directive-delivery mirror. |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Pi lifecycle delivery. |

### Validation And Evidence

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/directive-lifecycle.vitest.ts` | High-water, uncertainty, generation, secure-store, contention, cleanup, and isolation tests. |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/directive-lifecycle-boundary.vitest.ts` | Identified and global boundary invalidation tests. |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Claude handler cadence, fallback, flag, and transcript integration. |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | OpenCode cadence, identity rejection, global invalidation, and status tests. |
| `.skilled/skills/system-spec-kit/runtime/tests/directive-lifecycle-adapter-parity.vitest.ts` | Registered Claude/Codex/Cursor/Devin payload and envelope parity. |
| `.skilled/skills/system-spec-kit/runtime/tests/directive-lifecycle-boundary-bridge.vitest.ts` | Registered host-boundary coupling. |
| `.skilled/hooks/dispatch/pi` | Pi dispatch and lifecycle suite. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md` | Evidence-class-aware operator scenario. |
| the retired scenario-persistence wrapper | Append-only reports with durable hashes and observed provenance. |

Evidence must state one controlled class: `unit`, `adapter-driven`, `registered-path`, or `native-host-delivered`. Adapter success never implies host delivery. Cursor remains registered-path `PASS` and native-host-delivered `SKIP` while `beforeSubmitPrompt` stays dormant.

---

## 4. SOURCE METADATA

- Group: UX Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/directive-lifecycle-dedup.md`
- Related reference: `.skilled/hooks/injection-contract.md`
- Manual scenario: 457

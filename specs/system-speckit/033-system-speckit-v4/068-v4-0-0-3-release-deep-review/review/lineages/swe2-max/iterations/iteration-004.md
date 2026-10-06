# Iteration 004 — security: hooks/plugins/scripts cross-cutting

## Scope and method

Reviewed the release's enforcement surface end-to-end for the security dimension:
injection screening, message-contract gates, dispatch guards, the new completion
sentinel, gate kill-switch plumbing, and per-runtime hook wiring.

- `.opencode/plugins/classifier-injection-screen.js` (new) — webfetch screen that
  buffers advisories per session and drains into `experimental.chat.system.transform`.
- `.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs`
  (new) — sectioning, 12-section/4-concurrent/20 s-budget classifier fan-out.
- `.skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs`
  (new) — fetched-text extraction + fixed-template advisory line.
- `.skilled/hooks/classifier-injection-screen/devin|claude/*-posttooluse.mjs` (new) —
  PostToolUse adapters; `.pi/extensions`, `.claude/hooks`, `.devin/hooks` mirrors are
  symlinks into `.skilled/`.
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` — `spawn` argv +
  stdin transport (no shell interpolation of fetched text).
- `.devin/hooks.v1.json` (new), `.cursor/hooks.json` (new) — full matcher inventory.
- `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` and the
  cursor twin — tool maps compared.
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`
  (new, 636 lines) — claim detection, checklist spawn, dedup store, bounded log, sweep.
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` — frontmatter `hard_rules:` →
  `hard-rules.json` sidecar migration; verified all 9 v4.0.0.2 rule sets map to
  sidecars with identical ids (cli-hermes checks byte-identical), and the
  `KNOWN_CHECKS` CI-guard test runs in `dispatch-enforcement-guard.yml`.
- `.skilled/hooks/git/pre-commit` — comment-hygiene gate rewritten to check *staged
  blobs* via `git show ":$file"` into a mktemp mirror; fail-closed on unreadable
  staged content; checker failure (rc>2) now blocks. `.skilled/scripts/git-hooks/
  pre-commit` carries identical logic — the primary and standalone gates agree.
- `.skilled/scripts/git-hooks/lib/gate-config.sh` + `gates.tsv` (new) — persistable
  gate kills via `git config speckit.hooks.*`, command-scope filtered out so
  `git -c` cannot bypass; kill switches print a notice (never silent).
- `.skilled/bin/system-skill-advisor-launcher.cjs` — stale-build daemon recycle +
  `diagnostics:false` on the bridge path (prevents stdout stream corruption).
- `.skilled/hooks/goal/lib/goal-core.cjs` — verifier evidence window moved to the
  trailing slice; blocking pattern gained zero-count exclusions.
- `steer.md` — re-read.

Verified-but-clean: advisory text is a fixed template interpolating only counts —
fetched page text never reaches the system prompt; every adapter fails open with
bounded budgets; `execFileSync` argv in the sentinel is injection-free; the dedup
store write is atomic; `MK_COMMUNICATION_PROJECTION` alias removal matches the
deleted plugin.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **sw2m-P1-005 — Devin hook wiring omits the `write` tool entirely: whole-file
   writes bypass spec-gate enforcement and post-edit quality.**
   `.devin/hooks.v1.json` binds spec-gate-enforce to `PreToolUse` matcher `^edit$`
   and post-edit-quality to `PostToolUse` `^edit$`; the adapter's
   `DEVIN_TOOL_MAP = { exec: 'bash', edit: 'edit' }`
   (`.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs:7`)
   has no `write` entry — an unmapped tool auto-approves at line 29. The Cursor twin
   maps `Write→write` (`cursor/spec-gate-enforce.mjs:7`) and its spec-gate entry
   carries no matcher, so it sees every tool. This session's Devin runtime exposes a
   distinct `write` tool (whole-file create/overwrite).
   Failure scenario: an agent creates a file with `write` — the Gate-3 spec-folder
   question and Gate-5 rule-load enforcement never fire (matcher misses, map lacks
   the name), and post-edit-quality never inspects the new file. On Cursor the same
   write is gated. The release ships a new hooks.v1.json carrying the omission —
   an enforcement gap on an entire mutation tool class for the Devin runtime.

### P2 Findings

2. **sw2m-P2-007 — goal verifier judges only the trailing 1200 chars of evidence;
   mid-transcript blockers become invisible.**
   `verifyGoalHeuristic` now tail-windows evidence
   (`.skilled/hooks/goal/lib/goal-core.cjs:592-605`; `DEFAULT_MAX_EVIDENCE_CHARS=1200`
   at :63). The comment concedes "a blocker stated earlier in a longer transcript
   is never seen by this verifier." The module's own contract says ambiguous/mixed
   evidence stays `not-met` — but truncation makes the blocker literally absent,
   not ambiguous.
   Failure scenario: a transcript records "P0 test still failing" 5 000 chars in,
   then drifts and ends with "summary: finished". The tail matches
   VERIFIER_COMPLETION_PATTERN, the blocking word is outside the window → `met` —
   the goal supervisor releases a goal whose own transcript says it is broken.
   Tool-derived text is attacker-influenceable, so "append a conclusive tail" is the
   cheapest spoof of this window.

3. **sw2m-P2-008 — injection-screen `UNKNOWN_SESSION` bucket bleeds or strands
   advisories across sessions.**
   The opencode plugin keys pending advisories by `sessionID`; a missing id folds
   into shared `'__unknown-session__'` (`classifier-injection-screen.js:31-41`), and
   the system transform drains whatever bucket its own (optional) id resolves to.
   Two loss modes: (a) a fetch under a real session whose transform arrives without
   a sessionID leaves the advisory pending forever — the screen ran, the warning is
   never delivered; (b) an advisory buffered under UNKNOWN drains into the next
   transform that lacks an id, attributing page X's warning to an unrelated turn.
   Bounded — the advisory is a fixed safety template carrying no fetched content —
   but the screen's delivery is best-effort in exactly the fan-out/headless paths
   where sessionID is most likely to be absent.

## Expansion note

Finding 1's blast radius is the Devin runtime hook contract — followed the
`hooks.v1.json` → adapter → core chain end-to-end and compared the Cursor twin to
confirm the omission is asymmetric. The `dispatch-rule-checks` migration was
followed into `.github/workflows/dispatch-enforcement-guard.yml` (outside steer
focus) to confirm the KNOWN_CHECKS guard is CI-wired — it is.

## Review verdict: CONDITIONAL

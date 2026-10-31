# Iteration 006 — traceability: agent cross-runtime mirrors and checklist evidence

## Scope and method

Adjudicated the mirror-difference signal recorded before this iteration
(`.claude/agents/{design,orchestrate,prompt-improver}.md` and `.pi/agents/*`
DIFFER from `.skilled/agents/*`) by tracing the generator and gate chain for
each runtime surface, then ran every applicable `--check`/verifier in read-only
mode:

- `.pi/agents/*.md` — generated from `.skilled/agents/*.md` by
  `system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`. The dialect transform is
  exact: `permission:` allow-map → `tools:` list via `PERMISSION_TOOL_MAP`
  (lines 30-38: `glob`→`find`, `list`→`ls`), `mode:`/`temperature:` dropped
  (OpenCode-only), unmapped allow keys preserved as a YAML comment
  (`renderAgent` lines 145-162). `tools:` is emitted even when empty because an
  absent key makes Pi inherit the full builtin set (comment lines 151-153).
  `sync-agents-pi.cjs --check` → **PASS: 12 agents in sync.**
- `.codex/agents/*.toml` — generated from `.skilled/agents/*.md` by
  `codex/sync-agents.cjs` (SOURCE_DIR `.skilled/agents`, line 21; per-agent
  `HISTORICAL_SETTINGS` sandbox/model map lines 29-49).
  `sync-agents.cjs --check` → **PASS: 12 agents in sync.**
- `.claude/agents/*.md` ↔ `.skilled/agents/*.md` — TWO canonical dialect trees,
  body-parity enforced by `deep-improvement/scripts/check-agent-mirror-sync.cjs`
  + `lib/mirror-sync-verify.cjs`. The verifier strips frontmatter, normalizes
  per-runtime agent paths to `<runtime-agent-*>` placeholders (lines 109-117),
  and compares token sets plus load-bearing marker sequences.
  `check-agent-mirror-sync.cjs --all` → **PASS: 12 agents, all mirrors in sync.**
  Raw diffs are all dialect-appropriate: the `**Path Convention**` line naming
  each tree's own canonical dir, and one ASCII-diagram padding difference in
  `ai-council` (non-token, invisible to the comparison).
- `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` — relative symlinks into
  `.claude/agents` (`sync-runtime-mirrors.cjs:120-124`); symlink form means
  content cannot drift, only break. `agent-roster-mirror-check.cjs` covers
  roster presence across all five surfaces (LINKED: cursor+devin resolve to
  `.claude` canonical; AUTHORED: opencode/codex/pi presence-only, dialects
  expected) and is wired into pre-commit MIRROR_CHECKS.
- Gate wiring — `pre-commit:150-169` runs `check-agent-mirror-sync.cjs` on
  staged `.(opencode|skilled|claude)/agents/` paths; pre-commit:242-249
  MIRROR_CHECKS runs `sync-runtime-mirrors`, `codex/sync-agents`,
  `codex/sync-prompts`, roster + command-catalog checks, hook-registration
  sync. CI `agent-mirror-sync.yml` runs the body-parity checker fail-closed;
  `spec-kit-check.yml:155-158` runs all four `--check` generators — the two
  Pi checks were **added by this release** (absent at v4.0.0.2).
- `AGENTS.md` delivery-prefix guard — `check-rule-copies.js` (new in range per
  `a7380ece83d`) asserts 21 anchors end ≤ byte 16,384 and file < 32,768;
  run live → **OK, all invariants present**. CI `rule-canary-sync.yml` executes
  it fail-closed (missing canary = error, lines 19-31). The last anchor
  (`#### Blast-Radius Management`) ends at byte 16,359 — 25-byte margin; the
  cut lands mid-§3 (Execution Behavior bullets), past every §1/§2/§4 hard
  blocker. Changelog's "every hard rule fits" verified literally true.
- `REPO RULES.md` — diff is trigger-phrase enrichment only (scope-discipline,
  evidence-and-proof, uncertainty-and-honesty, communication-prose rows gain
  phrases; no row add/remove). `check-repo-rules.cjs` → **11/11 PASS**,
  including new check 10 (fires-when coverage ≥0.3 over stemmed content words,
  61 bullets) and check 11 (rule-card sync, vacuous here — no cards dir).
- `README.md` claims — all spot-verified against the tree: 14 skills (counted
  `.skilled/skills/*/SKILL.md` = 14), 39 command entry points (find = 39),
  42 validation rules (validator-registry keys = 42), 13 repo-rules files
  (= 13), 13 plugins on the shared kill-switch (grep `hook-flags` = 13;
  `sk-git-message-gate` has none, `sk-vision`/`system-speckit-completion` own
  switches — all as documented), 6 mandatory gates, `cli-classifier` rename.
- `steer.md` — re-read; unchanged since iteration 5.

## Adjudication of the pre-iteration signal

The recorded `DIFFERS` results were a naive byte comparison. Every observed
difference maps to an owned transform or dialect: `.pi` and `.codex` outputs
match their generators byte-for-byte under `--check`; `.claude`↔`.skilled`
bodies match under the token/marker comparator modulo intentional dialect
lines. **No drift exists on this surface as of the tag.**

Residual observations below finding bar:

- pre-commit MIRROR_CHECKS omits `pi/sync-agents-pi.cjs`/`sync-prompts-pi.cjs`
  (CI-only coverage). Predates the release (v4.0.0.2 list identical); the
  release *added* the CI coverage — direction is improvement, not regression.
- `agent-roster-mirror-check.cjs` AUTHORED comment calls `.codex/agents`
  "independently-authored"; they are generated (`sync-agents.cjs`). Presence-
  only checking is correct for generated output; the wording is stale. Nit.
- `mirror-sync-verify.cjs` `RUNTIME_MIRRORS` lacks a `pi` entry — by design:
  `.pi` is generated with its own `--check`, wired in CI. Belt-and-suspenders,
  not a gap.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Expansion note

Followed the mirror question into the gate chain end-to-end: local pre-commit
gates, the doctor read-only roster check, and both CI workflows. The surface
shows a deliberate defense-in-depth pattern — canonical authored trees, one
generated tree per foreign dialect, symlink trees where dialects coincide —
with every layer check-gated. The one thin margin (25 bytes of headroom under
the Devin cut) is guarded by CI by design; growth past it fails the canary
workflow, which is the intended failure mode.

## Review verdict: PASS

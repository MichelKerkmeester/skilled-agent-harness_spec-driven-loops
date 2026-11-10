## Verdict

REQUEST CHANGES. The SessionStart guard still cannot self-heal `.skilled`-only checkouts, nested `.skilled` layouts remain misclassified as specs roots, and two new positive test rows pass unchanged on the parent commit.

## Findings

| ID | Severity (P0 blocks the phase, P1 must fix, P2 should fix) | File:line | Scenario (the inputs and the wrong outcome) | Suggested fix |
|---|---|---|---|---|
| F-005 | P1 | `.opencode/bin/check-git-hooks.sh:58-72,145-153`; `.opencode/scripts/install-git-hooks.sh:30-36` | In a Git repo with real `.skilled/skills/system-spec-kit/SKILL.md`, `.skilled/scripts/git-hooks/pre-commit`, no `.opencode`, live-sync enabled, and a missing hook link, the guard checks only `.opencode`, exits 0, and never invokes the installer’s new fallback. | Apply the same root fallback in the guard and derive the installer path from the selected root. |
| F-006 | P1 | `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:883-889,902-905,1008-1021` | With `/repo/.skilled/pkg/specs/system-spec-kit/902-packet` and `/repo/.skilled/pkg/.skilled/skills/system-spec-kit/SKILL.md`, the marker check accepts the nested `specs` directory and resolves the repository as `/repo/.skilled/pkg`, so an unsupported packet under `.skilled` is treated as valid. | Restrict the canonical-marker branch to the repository root and reject any `specs` path nested inside a source-root tree. |
| F-007 | P2 | `.opencode/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts:905-921`; parent `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:878-903` | The `skilled-only` and `whole-link` rows create a canonical `specs` root with `.skilled`; the parent implementation already accepted both layouts, so both rows pass without this commit and do not prove its change. | Remove them as duplicate coverage or replace them with assertions whose outcomes differ before and after the fix. |
Codex exit 0, 2026-09-17T12:19:09Z to 2026-09-17T12:25:50Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.

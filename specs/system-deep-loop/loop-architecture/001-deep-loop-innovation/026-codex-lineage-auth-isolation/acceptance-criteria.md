---
title: "Acceptance Criteria: Codex Lineage Credential Isolation"
trigger_phrases: []
---
# Acceptance Criteria: Codex Lineage Credential Isolation

Each criterion carries a number with a threshold and was demonstrated failing on the current tree
before the fix.

## AC-1 — a lineage-style home authenticates

**Threshold.** A dispatch through the runtime's own codex dispatcher, with `CODEX_HOME` set to a
freshly created lineage directory, exits 0 and returns the model's answer.

**Failing first.** Exit **1**, stderr carrying `401 Unauthorized` against the responses websocket
and `Reconnecting... 2/5`. The identical prompt with the inherited home exits **0** and returns
`OK`, which isolates the home as the only variable.

## AC-2 — the credential is never written into the repository

**Threshold.** After a lineage runs, `git status` shows no `auth.json` anywhere under the lineage
directory, and any credential path inside it is a link rather than a copy.

**Why this is a criterion and not a note.** Lineage artifacts are committed. The cheap fix for AC-1
is to copy the credential next to the session state, and that writes an OAuth token into git
history. The check exists so the cheap fix cannot pass.

## AC-3 — a missing credential fails fast and says why

**Threshold.** With no credential reachable, the dispatch returns in under 30 seconds with an error
naming authentication. It must not consume the dispatch timeout.

**Failing first.** The unauthenticated dispatch consumed the full **900s** budget, then **120s** on
retry, and reported `spawnSync codex ETIMEDOUT` — a timeout, with no mention of authentication
anywhere in the runner's output.

## AC-4 — the pre-flight validates the environment the dispatch will use

**Threshold.** The auth check reads the same `CODEX_HOME` the dispatch will run under. Given an
unauthenticated lineage home, the pre-flight fails.

**Failing first.** The pre-flight passed — `Logged in using ChatGPT` — while the dispatch that
followed it 401'd, because the two read different homes.

## AC-5 — a retry does not shrink the budget

**Threshold.** The second attempt's timeout is greater than or equal to the first's.

**Failing first.** Measured **900s then 120s** in the recorded state file.

## AC-6 — nothing else regresses

**Threshold.** The runtime's own unit suite passes, and a `cli-cursor` lineage — which has no home
override and was never affected — still completes.

## Out of scope, recorded

The lineage home writes 2.7MB of sqlite databases, downloaded system skills and lock files into a
spec folder inside the repository, where write containment then flags them. Relocating that state
outside the tree is a larger change than this repair and is not attempted here.

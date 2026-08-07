# Iteration 3: Private Repository Token Handling

## Focus
This iteration investigated BRAT private-repository access at the file-layer boundary: token validation, SecretStorage naming, settings UI behavior, and the way install/update paths choose per-repo versus global token secrets. The selected interpretation was narrow by design: token handling only, not the full command catalog or release asset mechanics, which remain separate open questions.

## Actions Taken
1. Read packet config, state, strategy, and registry before choosing focus.
2. Verified that `iteration-003.md` and `iter-003.jsonl` did not already exist and that allowed write targets stayed inside the `luna` research packet.
3. Consulted BRAT source for settings schema, migration, token validation, settings UI, and BetaPlugins install/update token use.
4. Consulted official BRAT private-repository documentation and BRAT release notes for SecretStorage behavior.
5. Attempted direct shell `curl` retrieval of raw GitHub source; DNS resolution failed, so the iteration used the web cache and GitHub HTML/raw cache instead.

## Findings
1. BRAT no longer treats token values as normal `data.json` data in v2.0+ flows: settings keep `globalTokenName` for the global PAT and `pluginSubListFrozenVersion[].tokenName` for per-repo tokens, while legacy `personalAccessToken` and per-plugin `token` are deprecated. The settings helper deliberately writes `token: undefined` and stores only `tokenName` when adding or updating tracked plugin entries. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L646-L690] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L781-L807]
2. BRAT's migration path creates deterministic SecretStorage names for old plain-text settings: `brat-gh-global` for the global token and `brat-gh-{owner}-{repo}` for per-repository tokens after lowercasing, dash-normalizing, and truncating to 64 characters; it also deduplicates by reusing an existing secret with the same token value before clearing the plain-text token fields and writing a migration log under the BRAT plugin folder. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts:L1-L2] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts:L0]
3. Install and update calls resolve tokens in this order: if the plugin entry passes a non-empty `secretName`, BRAT reads that SecretStorage value; if that value is missing, BRAT shows a "Secret not found" notice but continues with an empty token value; if there is no per-repo secret name, BRAT falls back to `settings.globalTokenName`. That means file-layer AI can safely register the name in `data.json`, but cannot complete private access unless the same SecretStorage entry exists in Obsidian on that device. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/BetaPlugins.ts:L11-L14] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2571-L2596]
4. BRAT sends GitHub authenticated API/release requests with `Authorization: Token ${personalAccessToken}` when a token value is available. Release selection uses `/repos/{owner}/{repo}/releases` or `/releases/tags/{version}`, and private-release asset download uses the asset API URL plus `Accept: application/octet-stream`; public downloads use `browser_download_url`. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts#L2582-L2664] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts:L2-L3]
5. Token validation is stricter than "try the install": BRAT accepts only `ghp_` and `github_pat_` prefixes and validates full token shape before making a GitHub request. It then derives scopes, accepted permissions, expiration, and rate-limit information from response headers; missing scopes/permissions produce an insufficient-scope error, expired tokens produce an expired error, and a repository-specific validation treats successful access to that repo as a valid token. [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/features/githubUtils.ts:L0-L2] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/utils/TokenValidator.ts#L470-L620]
6. The settings UI exposes tokens through Obsidian `SecretComponent`, so the visible setting is a secret name selector rather than a token text field. The global PAT setting stores the normalized secret name in `globalTokenName`, fetches the actual value from `app.secretStorage.getSecret(...)` for validation, and can clear only the saved name. The beta-plugin list separately flags entries where `tokenName` is configured but SecretStorage has no value, disables that plugin's update button, and passes the token name back into the edit modal. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L2850-L2895] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L3101-L3236]
7. Official BRAT docs still frame private repository support as experimental and simple: developers should create a fine-grained PAT scoped to the intended repository with contents read-only permission, and testers place that token in BRAT settings. The source-backed v2.0+ refinement is that the token value goes into SecretStorage, not into `data.json`; release notes confirm SecretStorage values are not synced, so the same secret name/value must be added on every device. [SOURCE: https://tfthacker.com/brat-private-repo:L0-L2] [SOURCE: https://newreleases.io/project/github/TfTHacker/obsidian42-brat/release/2.0.1:L17-L21]

## Ruled Out
- Storing a private GitHub token directly in BRAT `data.json` is ruled out for v2.0+ operation; current settings store secret names and intentionally remove token values from persisted settings. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts#L654-L690] [SOURCE: https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts:L1-L2]
- Treating a configured `tokenName` as proof of usable private access is ruled out; SettingsTab and BetaPlugins both separately check whether the named secret exists, and install/update can still proceed without a token value after warning. [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L3101-L3236] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts#L2571-L2596]
- Relying on raw GitHub retrieval via local shell was not usable in this environment because DNS resolution for `raw.githubusercontent.com` failed; the fallback evidence path was web-cached GitHub source pages. [SOURCE: command output: curl raw.githubusercontent.com returned "Could not resolve host: raw.githubusercontent.com"]

## Dead Ends
No source-level dead end should be promoted as exhausted. The shell `curl` failure is an environment retrieval limitation, not evidence that the source path is invalid.

## Edge Cases
- Ambiguous input: none affecting this iteration; "private repository token handling" was interpreted as the BRAT token path, not the full command catalog.
- Contradictory evidence: docs say testers place the token in BRAT settings, while v2.0+ source and release notes show the setting is now a SecretStorage-backed secret name/value workflow. This is resolved as documentation wording being user-facing shorthand; source is more precise for file-layer automation. [SOURCE: https://tfthacker.com/brat-private-repo:L2] [SOURCE: https://newreleases.io/project/github/TfTHacker/obsidian42-brat/release/2.0.1:L17-L21] [SOURCE: https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts#L2850-L2895]
- Missing dependencies: local shell network access to `raw.githubusercontent.com` failed; fallback was web-cached GitHub source and official documentation.
- Partial success: exact AddNewPluginModal internals were not fully retrieved, but BetaPlugins and SettingsTab expose the token-name parameters and settings edit path needed for this focus.

## Sources Consulted
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/settings.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/BetaPlugins.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/features/githubUtils.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/utils/TokenValidator.ts
- https://github.com/TfTHacker/obsidian42-brat/blob/main/src/ui/SettingsTab.ts
- https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/migrations.ts
- https://raw.githubusercontent.com/TfTHacker/obsidian42-brat/main/src/main.ts
- https://tfthacker.com/brat-private-repo
- https://newreleases.io/project/github/TfTHacker/obsidian42-brat/release/2.0.1
- command output: `curl -L --max-time 20 https://raw.githubusercontent.com/...` failed with DNS resolution error

## Assessment
- New information ratio: 0.93
- Questions addressed:
  - Which errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?
  - Which headless file-layer workflows are safe for plugin installation, enabling, registration, and frozen pinning?
- Questions answered:
  - Private-repository token storage, validation, settings UI, migration names, and missing-secret behavior are answered.
- Remaining uncertainty:
  - Full AddNewPluginModal field rendering should still be checked in a later command/UI pass.
  - The full command catalog and install-asset mechanics remain open by strategy design.

## Questions Answered
- BRAT token values belong in Obsidian SecretStorage, not `data.json`; `data.json` stores `globalTokenName` and per-repo `tokenName`.
- Migrated secret names are `brat-gh-global` and normalized `brat-gh-{owner}-{repo}` names, with deduplication against existing same-value secrets.
- Per-repo token names override the global token name for a plugin; missing per-repo secrets create warnings and disabled UI update controls but do not mutate the token value into settings.
- Validation checks prefix, full token pattern, expiration, scopes/permissions, rate limits, and optionally repository access.

## Questions Remaining
- What does every BRAT command do, including beta plugins, frozen release tags, updates, restart, and themes?
- What exact release/root asset-fetch and vault-file install/enabling mechanics does BRAT implement?
- Which non-token errors and edge cases occur, and what source-backed AI recipes and troubleshooting checks address them?

## Reflection
- What worked and why: The settings, migration, validation, and install/update sources triangulate cleanly: settings define names, migration creates names, SettingsTab binds them to SecretComponent, and BetaPlugins resolves names to values at the moment of GitHub access.
- What did not work and why: Direct shell source retrieval failed because DNS could not resolve `raw.githubusercontent.com`; web-cached source pages preserved enough primary evidence to proceed.
- What I would do differently: For the command-catalog iteration, use GitHub HTML/tree navigation first and only use raw-cache pages after exact file paths are known.

## Recommended Next Focus
Trace the full command catalog through `PluginCommands`, `AddNewPluginModal`, `VersionSuggestModal`, theme modals, update helpers, and restart/enable/disable actions, with special attention to how frozen-version commands pass release tags and token names into `BetaPlugins.addPlugin`.

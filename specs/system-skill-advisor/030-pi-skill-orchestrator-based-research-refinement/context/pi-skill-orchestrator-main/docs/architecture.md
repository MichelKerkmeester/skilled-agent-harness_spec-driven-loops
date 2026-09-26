# Architecture and context model

[Back to the main README](../README.md) · [Documentation index](README.md)

## Goal

The main goal is simple: do not spend model context on the complete skill catalog before the model needs a skill.

## Normal Pi behavior

Pi discovers skills at startup. Pi normally includes model-visible skill metadata in the system prompt. The metadata includes each skill name, description, and file location.

Pi still loads the full skill body later when the skill is used.

For a small library, this is reasonable. For a large library, the metadata catalog itself can become large.

## Skill Orchestrator behavior

Skill Orchestrator keeps installed skill metadata in extension memory.

Before each model turn, it removes Pi's native eager skill catalog and replaces it with a small scope stub.

The stub contains only the active scope identity, candidate count, and fixed instructions for using `skill_search` and `skill`.

The stub does not list every member skill.

## Scope model

Exactly one active scope exists at a time.

It can be:

- all skills;
- one profile;
- one group inside the active profile.

Switching scope replaces the previous scope. It does not append another scope block to the prompt.

A profile scope is the union of skills assigned to its groups.

An empty profile has zero automatic candidates.

## Lazy metadata search

The model calls `skill_search` with a task or capability.

The default search uses the active scope.

The extension ranks metadata internally. It returns only a bounded result set to the model.

The default result limit is 5. The maximum is 8.

Descriptions are truncated to `catalogDescriptionMax` characters. A value of `0` returns names only.

## Global fallback

A profile or group is a preferred discovery scope. It is not a permanent restriction on the whole workflow.

When the active scope has zero matches, the extension can perform one small global fallback search automatically.

When active matches exist but none is useful, the model can call `skill_search` again with `scope: "global"`.

Global fallback searches outside the active restrictive scope. It returns only a few candidates.

Only exact names returned by the current fallback search are authorized as outside-scope model roots. A later fallback search replaces that authorization set.

Changing the active profile or group clears fallback authorization.

## Skill loading

The model calls `skill` with one exact name.

The extension then loads:

1. the selected root skill;
2. all required recursive dependencies.

Dependencies can be outside the active group or profile.

Loading an outside-scope fallback skill does not change the active scope.

## Autocomplete is separate

Pi's editor autocomplete can know about all installed skills. That does not mean the model receives the same list.

Skill Orchestrator extends the editor autocomplete while removing Pi's all-skill metadata block from the model system prompt.

This separation is intentional.

## Optional Token Saver architecture

Token Saver is a second, optional layer. It does not change the lazy-skill architecture.

When enabled, Pi's `tool_result` event is the main input boundary. Large text results are classified and reduced before they become later model context. Images, short results, skill instructions, and explicit machine-readable output pass through unchanged.

Compacted originals are kept in a bounded in-memory recovery store. The model receives a short recovery ID and can call `token_retrieve` for an exact line range while that recovery entry exists. A result too large to fit in the complete recovery-store budget passes through unchanged. A failed transform also returns the original result. Recovery state is not persisted, so old compacted transcript entries can outlive their recovery IDs after restart, reload, resume, new-session, or fork boundaries.

### Tool-schema deferral

Unused tool definitions can also consume context. Token Saver uses Pi's public `getAllTools()`, `getActiveTools()`, and `setActiveTools()` APIs to move currently active non-core tools behind `token_tool_search`.

The core read/write/search/shell tools and Skill Orchestrator's own small discovery surface remain active. When the model needs another capability, `token_tool_search` searches only deferred metadata and activates a bounded matching set. Turning Token Saver off restores tool schemas that it deferred. Session shutdown performs the same cleanup before Pi replaces, reloads, or exits the session.

This follows the same lazy-discovery principle used for skills.

### Provider request shaping

The `before_provider_request` hook applies two bounded changes while Token Saver is enabled:

1. Very long top-level tool descriptions are shortened. Tool parameter schemas and parameter descriptions are not changed.
2. After a routine successful continuation, an existing provider effort field can be lowered. No new provider-specific field is invented. Errors and non-routine turns keep their original effort. With multiple tool results, any error or non-routine result blocks the reduction for that continuation.

### Prefix stability

Token Saver modifies new tool results before they become history. It does not continuously rewrite earlier turns. This preserves a stable prefix as much as Pi's extension boundary allows. Prompt-prefix drift is measured for diagnostics only.

Confirmed-cold prefix rewriting is not attempted because Pi does not expose a provider-neutral, reliable cache-TTL contract to extensions. Guessing that a cache is cold could destroy a warm provider cache.

## Failure behavior

Catalog removal is conservative. The extension recognizes Pi-style skill catalog blocks and preserves unrelated extension XML.

If Pi changes its catalog format in a way that cannot be removed safely, Skill Orchestrator warns instead of blindly deleting unknown prompt content.

Compatibility tests should be rerun after Pi changes its skill prompt format.

Mutation probes, 2026-10-20. Each probe ran in a temporary copy of the worktree: every root entry
symlinked, `.opencode/plugins` copied for real, the mutation applied to the copy only. The repository
was never mutated. Each file ends with the node --test exit status.

m1  a plain `zz-probe.js` with no dual export            -> plugin-inventory: "zz-probe.js is not bridged and not listed", exit 1
m2  a bridged `zz-probe.js` whose server returns no hooks -> new v2-registration: "zz-probe must register at least one v2 hook", exit 1
                                                           -> old v2-registration (pinned list, HEAD) on the same copy: 12 pass, exit 0
m3  mcp-route-guard default-exports the bare factory      -> plugin-inventory: "mcp-route-guard.js is not bridged and not listed", exit 1
m4  sk-vision.js removed, still listed as native-dual     -> plugin-inventory: "sk-vision.js is listed as native-dual but has no file", exit 1
m5  sk-git-message-gate returns an extra `chat.message`   -> plugin-inventory: "sk-git-message-gate.js unmapped hooks", exit 1
m6  session-cleanup compares against `session.bogus`      -> plugin-inventory: "handles session.bogus, which the bridge neither maps nor aliases", exit 1
m7  manifest lists `session.ghost`, no plugin handles it  -> plugin-inventory: "session.ghost is listed in the manifest but no bridged plugin handles it", exit 1
m8  the sk-vision hard-plugin case renamed                -> v2-hard-plugins: "sk-vision is a native-dual exception without a v2 registration case", exit 1
m9  session-cleanup compares against "session.bogus" (double quotes) -> plugin-inventory: "handles session.bogus ...", exit 1
m10 session-cleanup adds eventType.startsWith('session.')            -> plugin-inventory: "has an event check the scan cannot read: eventType.startsWith(", exit 1
m11 session-cleanup adds SESSION_GONE === eventType (constant on the left) -> plugin-inventory: "has an event check the scan cannot read", exit 1
m12 the opencode-goal unscanned entry also claims session.ghost             -> plugin-inventory: "covers session.ghost, which the bridge neither maps nor aliases", exit 1
m13 opencode-goal's endsWith('.disposed') changed to endsWith('.ghost')       -> plugin-inventory: unlisted check and stale manifest entry, exit 1
m14asession-cleanup adds eventType.toLowerCase() === 'session.ghost'          -> plugin-inventory: "has an event check the scan cannot read: eventType.toLowerCase()", exit 1
m14b session-cleanup's listed check `eventType.toLowerCase() === 'session.deleted'` edited to compare 'session.ghost' -> unlisted check plus stale manifest entry, exit 1
m15 session-cleanup adds eventType === EVENTS.GONE                            -> plugin-inventory: reported whole as "eventType === EVENTS.GONE", exit 1
m16 opencode-goal's only session.status comparison commented out -> first run exit 0: stripComments read a regex literal in opencode-goal.js as a string opener and stopped stripping; after teaching it regex literals: "session.status is listed in the manifest but no bridged plugin handles it", exit 1
m17 session-cleanup compares against `session.bogus` (template literal)   -> plugin-inventory: "handles session.bogus ...", exit 1
m18 session-cleanup checks WATCHED.has(eventType), WATCHED holds session.bogus -> plugin-inventory: "handles session.bogus ...", exit 1
m19 session-cleanup adds ['session.bogus'].includes(eventType)          -> plugin-inventory: "handles session.bogus ...", exit 1
m20 session-cleanup adds new Set(['session.bogus']).has(eventType)      -> plugin-inventory: "handles session.bogus ...", exit 1
m21 session-cleanup adds HANDLERS[eventType]?.()                         -> plugin-inventory: "has an event check the scan cannot read: HANDLERS[eventType]", exit 1
m22 session-cleanup adds event['type'] === 'session.bogus'              -> plugin-inventory: "handles session.bogus ...", exit 1

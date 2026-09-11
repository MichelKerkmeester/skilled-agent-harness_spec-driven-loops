# Advisor Route Exclusions

> Operator-adjustable denylist of skill ids the advisor must never recommend.

---

## 1. OVERVIEW

The advisor recommends skills for a prompt. Some skills should never be recommended, even when they score well. `route-exclusions.json` is the denylist that holds those skill ids out of routing.

A skill on this list is still fully usable. You invoke it by hand. The advisor just refuses to surface it as an automatic recommendation.

The loader is fail-safe. A missing or malformed config resolves to an empty set and never throws. A broken file can only stop excluding a skill. It can never crash the advisor or hide an active skill by accident.

---

## 2. FILES

| File | Tracked | Role |
|------|---------|------|
| `route-exclusions.json` | Committed | The shared denylist. Editing it changes routing for everyone. |
| `route-exclusions.local.json` | Git-ignored | Optional machine-local override. When present it fully replaces the committed list. |
| `route-exclusions.local.json.example` | Committed | Copy this to `route-exclusions.local.json` to start a local override. |

The committed file holds a single key:

```json
{
  "excludedSkillIds": ["sk-communication"]
}
```

Any key other than `excludedSkillIds` is ignored. Each entry is a skill id, matched exactly.

---

## 3. PRECEDENCE

The loader reads one source, not a merge:

- When `route-exclusions.local.json` exists, it fully replaces the committed list. Set `excludedSkillIds` to `[]` there to re-enable every skill on this machine.
- When the local file is absent, the committed `route-exclusions.json` applies.
- A present local file with an empty or malformed list yields an empty set. It never falls back to the committed file.

The resolved set is cached on first read. Tests reset the cache through the module's reset seam.

---

## 4. OVERRIDE DIRECTORY

`SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR` points the loader at a different config directory. When set, the loader reads `route-exclusions.local.json` then `route-exclusions.json` from that directory instead of the packaged one. This is how tests supply fixture configs and how a deployment can relocate the knob.

---

## 5. TAKING A CHANGE LIVE

The advisor runs from compiled output, and the packaged `dist/` is git-ignored (no compiled files are tracked). Editing a config file changes source only. For a change to take effect where the advisor actually runs:

1. Rebuild the advisor so the compiled gate loads the new config.
2. Reindex the advisor so its skill set reflects the intended routing.
3. Re-probe with a representative prompt to confirm the excluded skill no longer appears.

Until the rebuild and reindex run on the target, the old routing behavior stays in place.

---

## 6. WHERE THE DENYLIST IS ENFORCED

The set is consulted at both routability seams in the advisor:

- `lib/scorer/fusion.ts` `isDefaultRoutable` is the production recommend gate. An excluded id returns non-routable before it can be recommended.
- `lib/lifecycle/archive-handling.ts` `filterDefaultRoutable` drops excluded ids as a second, defensive filter.

Both seams read the same resolved set, so one denylist governs every routing path.

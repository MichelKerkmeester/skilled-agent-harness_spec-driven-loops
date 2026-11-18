Upstream fixes needed by Barter (ai-speckit vendors Skilled under `skilled/` with a root `.skilled` symlink, pinned at `728427e78c4`, overlays in `skilled/barter-overlays/`). Each item is upstream code that Barter can't fix from an overlay. The advisor results were re-run at the current pin on 2026-11-18.

## Fix 1: `/doctor:update record-base` fails in a vendored layout
- **Where:** `.skilled/commands/doctor/scripts/release-update.cjs:311` (`resolveRepo`), `:248` (`safeResolve`, error at `:260`).
- **Problem:** `resolveRepo` always returns `git rev-parse --show-toplevel`, so `--repo skilled` resolves to the ai-speckit root. There `.skilled` is a symlink, which `safeResolve` refuses.
- **Repro:** `record-base --repo . --dry-run --release v4.1.0.0` exits 1 with `path parent is not a real directory: <root>/.skilled`.
- **Fix:** use a `--repo` folder that holds a real `.skilled` directory before falling back to the git top level, or record the base from the vendoring manifest's pin. A tree pinned between tags (ours is past `v4.1.0.0`) has no matching tag, so the base also needs a commit-pin form.
- **Done when:** `record-base` succeeds in a repo whose `.skilled` is a symlink into a vendored subfolder.

## Fix 2: overlay engine loses content while status stays green
Verified against the engine source by an independent read. Line numbers are approximate.
- **2a.** `set` on a `json-entry` replaces a whole array and doesn't report the upstream items it drops, once the entry's hash names the new upstream copy. **Fix:** report dropped upstream items on re-pin.
- **2b.** A missing `before` anchor silently appends at the end, while `setKeyOnItem` throws in the same situation. **Fix:** fail, or at least warn, on a missing anchor.
- **2c.** Numeric path steps resolve by position. The warning covers `set` only. **Fix:** extend the warning to `appendItems` and `insertItems`.
- **2d.** A directory overlay deletes files that upstream adds, and the re-pin stage doesn't list them. **Fix:** list upstream-added files a directory overlay will remove.
- **2e.** `setKeyOnItem` and `insertObjectKeys` keep no record, which produces 6 NOTE lines on every status run. **Fix:** record them like the other operations.
- **Done when:** a re-pin that changes overlaid upstream content reports every loss. Barter now runs its own `repin-survival` check to catch these, and it should become unnecessary.

## Fix 3: `dashboard` token boost sends Figma prompts to sk-code
- **Where:** `system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `TOKEN_BOOSTS.dashboard` (to sk-code).
- **Repro:** "get the dashboard design from figma" → sk-code 0.9338, mcp-tooling 0.8232. "fetch the dashboard frame from figma" → sk-code 0.8721, mcp-tooling 0.82.
- **Fix:** skip the boost when the prompt names a design-tool source such as Figma, the way `8a6f64beac8` skips `review` on ticket-status wording.
- **Done when:** Figma fetch prompts route to mcp-tooling. Barter can't fix this with its own vocabulary without breaking another corpus row.

## Fix 4: a command ranks below its skill on an exact bridge match
- **Where:** `fusion.ts:1421-1422` subtracts 0.08 from commands when the prompt has no `/`, and `fusion.ts:1052-1075` orders the command after its owner skill.
- **Repro:** "re-pin the vendored skilled tree" → system-skilled-doctor (skill, 0.82, lexical) listed first, `/doctor:overlay repin` (command, 0.8962, explicit_author) second.
- **Fix:** when a command matches its bridge phrase and outscores its owner, rank it first.
- **Done when:** that prompt lists `/doctor:overlay repin` first.

## Fix 5: the wide-cluster floor drops a clear winner on short prompts
- **Where:** `fusion.ts:1480-1484` (low-information test), `ambiguity.ts` (cluster built with `applyFloorException=false`), the no-anchor uncertainty of 0.42 in `scoring-constants.ts:211` against the 0.35 cut-off.
- **Repro (v4.1.0.0, before Barter's overlay workaround):** "commit my changes" scored sk-git 0.8258 but returned nothing, because rivals that only reached the 0.82 floor counted as ties. Barter patched its way around this one prompt. The rule is still upstream.
- **Fix:** don't let a candidate that only reached the floor tie a real match on a low-information prompt.
- **Done when:** short single-intent prompts return their clear winner without a project phrase overlay.

## Fix 6: the CLI JSON has no per-lane scores
- **Where:** `advisor_recommend --format json`, and `lib/render.ts:289`, which emits `laneContributions: []`.
- **Repro:** none of the five prompts above returned a `laneContributions` field in the CLI JSON. Only `dominantLane` comes back.
- **Fix:** include `laneContributions` in the CLI JSON output.
- **Done when:** a routing result can be diagnosed from the CLI without an in-process trace.

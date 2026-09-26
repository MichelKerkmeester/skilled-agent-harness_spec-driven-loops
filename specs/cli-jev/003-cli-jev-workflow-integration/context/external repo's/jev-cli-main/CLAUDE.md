# CLAUDE.md

TypeScript CLI (`jev`, npm package `jevctl`) wrapping TypeSafe's Jev model. Commands: `verify`, `screen`, `find`, `ask`, `classify`, `extract`, `rerank`, `match`, `route`, `compact`, `batch`, `auth`. `README.md` is a short front door; per-command docs live in `docs/<command>.md`, one identical layout each. Layout and PR rules in `CONTRIBUTING.md`.

## Commands

```bash
npm run check        # typecheck (+ plugin hook), vendor sync check, lint, tests. Run before every commit.
npm test             # vitest; builds dist/ first, then spawns the CLI against a fake API
npm run lint:fix     # Biome format + safe fixes
npm run dev -- <args>            # run from source, e.g. npm run dev -- screen "hi" --dry-run
npm run test:e2e     # live API; needs TYPESAFE_API_KEY. Not run in CI unless the secret exists.
```

## Architecture in one breath

`src/cli.ts` (commander) → `src/commands/*` (flags + text rendering) → `src/core/*` (pure judgment logic taking an `AskFn`) → `src/provider.ts` (TypeSafe / OpenRouter / Cloudflare transports). `src/config.ts` resolves defaults < file < env < flags. `src/lib.ts` holds shared pure helpers.

## Rules

- Question design (instructions, criteria) lives only in `src/core/`. Policy (thresholds, exit codes, `--fail-on`) lives in code, never in prompts.
- `core/` functions take an `AskFn`; they must not read env, files, or `process`. That is what makes them testable without a key.
- Public contract: JSON field names, exit codes (`0` ok, `1` error, `2` judgment matched), flag names. Changing any of these needs a `CHANGELOG.md` entry under `Unreleased` and an update to `docs/<command>.md`.
- Ids sent to the model are sanitized; always report the caller's original id back (see `originalIds` in `lib.ts`).
- Tests never hit the network. One file per command in `test/commands/`, with a `core` describe (fake `AskFn`) and a `cli` describe (spawned binary via `test/helpers/cli.ts`). Name tests after the capability, never after the delivery batch.
- `src/vendor/compaction/` is vendored upstream code: change import paths only, keep `plugin/hooks/compaction/` in sync (`npm run sync:hooks`), never reformat it.
- No `Co-Authored-By` or tool attribution in commits.

## Releasing

Bump `package.json` version, move `Unreleased` notes under the new version in `CHANGELOG.md`, commit, then `git tag vX.Y.Z && git push origin main --tags`. CI publishes to npm via Trusted Publishing and creates the GitHub release.

## Plugin

`plugin/` is the Claude Code plugin (skill + `/jev:*` commands). Keep `plugin/skills/jev/SKILL.md` in sync when flags or JSON output change. Validate with `claude plugin validate ./plugin`.

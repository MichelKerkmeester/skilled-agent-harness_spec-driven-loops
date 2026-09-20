# Resource Map — live-b

Source map for the question "list every exported function of `write-containment.ts` with a one-line
purpose and a `file:line` citation". Revision anchor: `HEAD cbb1e4ae53`.

## Primary source

| Path | Role | Read range |
|------|------|-----------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | The module under inventory (1391 lines, sha256 `45b46278…e2a540`) | `:1-60` header and imports, `:60-300` exported types plus helpers, `:300-875` contention map, classification, baseline snapshot, detection, `:1010-1391` quarantine, revert, event-build, enforce |

## Corroborating sources

| Path | Role | Read range |
|------|------|-----------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Only production consumer | `:2776` import list, `:3436-3476` enforce call and result consumption |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Behavioral evidence for the exported names | `:18-25` import map, `:238-252`, `:1021-1024` assertions |
| `.opencode/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts` | Basis for the state-record routing note | `:60-70` |
| `.opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts` | Basis for the state-record routing note | `:538-541` |
| `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Basis for the legacy-writer sanction note | `:151`, `:199-207`, `:260-300` |

## Checked and ruled out

| Path | Outcome |
|------|---------|
| `.opencode/skills/system-deep-loop/feature-catalog/fanout-write-containment/fanout-write-containment.md` | Names none of the eight exported functions; unusable as inventory or cross-check |

## Commands used

- `grep -c "^export function" <module>` → `8` (count check)
- `grep -n "^export" <module>` → full exported-symbol list with line numbers
- `grep -rn "<exported names>" --include=*.ts --include=*.cjs --include=*.mjs --include=*.js .` → caller map
- `shasum -a 256 <module>` and `wc -l <module>` → revision fingerprint

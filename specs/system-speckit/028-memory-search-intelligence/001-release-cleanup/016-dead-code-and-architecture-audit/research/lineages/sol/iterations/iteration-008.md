# Iteration 008: Residue and portability

## Focus

Audit backup, scratch, rotated-log, hidden generated-scan, and local-path residue outside `.opencode/specs/`.

## Findings

1. `.opencode/logs/dist-freshness-guard.log.1` is a generated rotated log that appears as untracked because `.gitignore` ignores `*.log` but not rotated `*.log.*`. The plugin intentionally creates `.1`, so this is reproducible CAT-3 workspace pollution. [SOURCE: file:.gitignore:213] [SOURCE: file:.opencode/logs/dist-freshness-guard.log.1:1] [SOURCE: file:.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs:206]
2. Hidden committed scan scripts under system-spec-kit embed this workstation's absolute repository and spec paths. They are operationally misplaced/non-portable CAT-4 artifacts, although generated inventory text files are intentionally retained and two scripts are benchmark inputs. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-one.sh:5] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-one.sh:6] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-validate-all.py:7] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-validate-all.py:8]

## Sources Consulted

- `.gitignore:205-226`
- `.opencode/logs/dist-freshness-guard.log.1`
- Hidden `.scan-*` and inventory files under system-spec-kit scripts.
- `git ls-files` and literal searches for every hidden filename.

## Assessment

- New information ratio: 0.76
- Confidence: high for log ignore leakage and absolute-path non-portability.

## Reflection

No backup or reject files were found outside excluded specs. Runtime `.log` files are correctly ignored; only the rotated suffix escapes.

## Recommended Next Focus

Run exact multi-extension literal searches against every apparent dead-code candidate.

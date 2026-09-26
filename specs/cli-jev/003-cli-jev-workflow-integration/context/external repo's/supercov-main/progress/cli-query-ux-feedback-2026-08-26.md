# Deferred coverage-query UX feedback — 2026-08-26

Status: recorded for the next UX session. Do not implement as part of the
current engine/language-frontend work.

Observed against npm `supercov@0.0.16` and Essential SEO run
`run_e0473933f13ca35b`.

## Problems to solve

### `files` is technically bounded but visually dense

The current rows concatenate a long path and five missing-obligation counts:

```text
app/lib/shopify/PrismaSessionStorage.ts  missing: lines 47  stmts 39  funcs 9  branches 44  MC/DC 11
```

Twenty rows become difficult for a person to scan, especially after npm's
project-level warnings. Reconsider the presentation as a real aligned table or
another compact hierarchy with visible column headings. Preserve pagination,
stable ordering and copyable drill-down commands. Do not suppress warnings
that the wrapped command or package manager would ordinarily print.

### Human output must describe facts, not prescribe work

`Needed:` is too strong. An uncovered branch or MC/DC condition is an observed
measurement gap; it does not prove that the behavior is desirable, reachable,
or worth testing. Supercov must not imply a product decision.

Replace imperative advice such as:

```text
Needed: use the default value
Needed: provide an explicit value
Needed: show that `condition` independently changes the decision result
```

with factual language. Candidate vocabulary to evaluate, not a frozen design:

- `Unobserved` / `Not observed`;
- `Uncovered behavior`;
- `Independent effect not demonstrated`;
- branch alternatives displayed as facts, for example
  `default value — not observed` and `explicit value — not observed`.

The wording must remain accurate for unreachable, defensive, generated and
intentionally untested code. Avoid `required`, `must`, `needed` and equivalent
claims unless a user-selected policy actually makes an obligation mandatory.

### `file` and `line` are still too wordy

The improved source context is useful, but the current output repeats headings
and sentences around a small amount of information. Explore a diagnostic-style
layout similar in density to compiler/type-checker diagnostics:

```text
57 | error instanceof Prisma.PrismaClientKnownRequestError &&
     ^ MC/DC 0/2

Independent effect not demonstrated
  error instanceof Prisma.PrismaClientKnownRequestError
  error.code === UNIQUE_KEY_CONSTRAINT_ERROR_CODE

Covering tests: 0
```

This is an example only. The next session should compare several renderings
against real multi-obligation lines before freezing the human contract.

Questions to resolve:

- whether `Covering tests: 0` is useful or should be omitted when empty;
- whether fully covered, partially covered and unmeasured should be separate
  factual categories rather than prose statuses;
- how to show multiple statements/branches/decisions anchored to one line
  without exposing internal IDs or losing exact drill-down identity;
- whether percentages or covered/total counts make the `files` table more
  useful than raw missing counts;
- whether source carets/ranges remain legible for tabs, Unicode and multiline
  expressions;
- whether optional symbols add meaning without creating ambiguity in logs or
  agent transcripts.

## Human and agent output boundary

Do not try to infer reliably whether the caller is a human or an agent. PTY
presence is not sufficient. Keep `--json` the stable bounded agent contract;
keep default text deterministic, plain and useful in terminals, logs and agent
transcripts. Color or symbols may be considered only as optional decoration;
they must never carry unique semantics or change parsing.

## Acceptance gate for the future UX change

Before implementation, freeze golden examples for summary, files, file, line,
decision, test, empty results, limitations and pagination. Dogfood each example
as both a person and an agent. The JSON schema must remain unchanged unless a
separately versioned contract change is justified.

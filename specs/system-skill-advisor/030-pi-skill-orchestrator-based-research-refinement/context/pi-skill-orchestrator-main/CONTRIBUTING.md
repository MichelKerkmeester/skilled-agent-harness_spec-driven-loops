# Contributing to Pi Skill Orchestrator

[Back to the main README](README.md)

Bug reports, focused fixes, tests, and documentation improvements are welcome.

## Before you change code

Read:

- [Architecture and context model](docs/architecture.md);
- [Development and testing](docs/development.md);
- [Compatibility guide](docs/compatibility.md).

The zero-eager-catalog design is a core requirement. Do not replace it with a bulk skill list in the system prompt.

## Development setup

Clone the repository. Enter the repository. Run:

```bash
npm test
npm run check
```

No separate test framework is required.

## Change rules

Keep changes narrow. Add a regression test for a bug fix. Do not change unrelated behavior.

Do not:

- write to Pi's global `settings.json`;
- change `enableSkillCommands`;
- edit third-party `SKILL.md` files;
- add developer-specific absolute paths;
- add secrets or tokens;
- use private or deep Pi imports when a public package export exists;
- make group or profile activation bulk-load skill bodies.

## Pull requests

A pull request should explain:

1. the problem;
2. the change;
3. the tests added or changed;
4. the commands used to verify the change;
5. any Pi compatibility impact.

Run before opening the pull request:

```bash
npm run check
npm run pack:check
```

For runtime changes, also run:

```bash
pi -e ./src/index.ts
```

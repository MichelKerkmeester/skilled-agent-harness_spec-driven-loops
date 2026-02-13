# Contributing to GoopSpec

Thanks for taking the time to contribute. This project aims to keep contributions clear, well scoped, and easy to review.

## Ways to contribute
- Report bugs and regressions
- Improve documentation or examples
- Add tests or edge cases
- Implement features from open issues

If you plan to work on a larger change, open an issue first to confirm scope and approach.

## Development setup
Requirements:
- Bun >= 1.0.0
- Node.js for TypeScript tooling

Clone and install dependencies:

```bash
git clone https://github.com/hffmnnj/opencode-goopspec.git
cd opencode-goopspec
bun install
```

Useful scripts:

```bash
# Build
bun run build

# Watch build
bun run dev

# Type check
bun run typecheck

# Tests
bun test
```

## Project structure
Common locations:

```
agents/        # Agent definitions
commands/      # Command definitions
references/    # Reference docs
skills/        # Skill modules
templates/     # Templates
src/           # Core implementation
tests/         # Test suite
```

## Contribution workflow
1. Fork the repo and create a branch from `main`.
2. Keep changes focused and scoped to one purpose.
3. Add or update tests where it makes sense.
4. Run `bun run typecheck` and `bun test`.
5. Open a PR with a clear summary and rationale.

## Coding guidelines
- Follow existing code patterns and naming conventions.
- Prefer small, atomic changes.
- Avoid large refactors unless explicitly agreed in an issue.
- Keep comments minimal and only when logic is non-obvious.

## Tests
Please ensure relevant tests pass before opening a PR:

```bash
bun test
bun run typecheck
```

## Reporting issues
Use GitHub Issues for bugs and feature requests. Include:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Logs, screenshots, or minimal repros when applicable

## License
By contributing, you agree that your contributions will be licensed under the MIT License.

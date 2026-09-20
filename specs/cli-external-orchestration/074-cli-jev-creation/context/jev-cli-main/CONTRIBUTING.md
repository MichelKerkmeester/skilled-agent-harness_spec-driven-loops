# Contributing

Contributions are welcome through GitHub issues and pull requests.

## Development setup

Install Python 3.13 or later, [uv](https://docs.astral.sh/uv/), and GNU Make. Clone the repository, then create the development environment:

```bash
uv sync
```

## Development commands

Run the complete local quality gate before committing. This executes the unit tests and builds both the wheel and source distribution.

```bash
make check
```

Run an individual task when needed:

```bash
make test
make build
make install
```

`make install` installs the local package with `uv tool` and verifies the resulting `jev` command.

## Versioning

The project follows [Semantic Versioning](https://semver.org/). The version source of truth is `project.version` in `pyproject.toml`.

## Release preparation

Run `make build` after editing `skills/`; it refreshes the bundled package copy before building. Verify the wheel contains `jev_cli/bundled_skills/jev-cli/SKILL.md` before release.

Releases use `v<version>` tags, such as `v0.2.0`. The tag must match `project.version` in `pyproject.toml`.

The tag-triggered workflow reruns the quality gate, builds and smoke-tests the wheel, uploads the distributions as a workflow artifact, and creates a GitHub Release. It does not publish to PyPI.

Do not create or push a release tag until the exact commit has passed CI and the release is explicitly approved.

## Pull requests

- Keep changes focused.
- Add or update tests for behavior changes.
- Update the README when the command interface changes.
- Do not commit API keys, credential files, `.env` files, or personal paths.
- Ensure `make check` passes before submitting.

By contributing, you agree that your contributions are licensed under the MIT License.

"""Package only the unsolved tutorial project; no repository or answer files."""

import argparse
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

FILES = (
    ".gitignore",
    "package.json",
    "package-lock.json",
    "src/session.js",
    "tests/session.test.js",
)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    starter = Path(__file__).resolve().parent.parent / "starter"
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(args.output, "w", compression=ZIP_DEFLATED) as archive:
        for relative in FILES:
            entry = ZipInfo(f"supercov-tutorial/{relative}", (2026, 1, 1, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, (starter / relative).read_bytes())
    with ZipFile(args.output) as archive:
        assert archive.namelist() == [f"supercov-tutorial/{name}" for name in FILES]
        assert archive.testzip() is None
        for relative in FILES:
            assert archive.read(f"supercov-tutorial/{relative}") == (starter / relative).read_bytes()
    print(f"Packaged {len(FILES)} starter files: {args.output} ({args.output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()

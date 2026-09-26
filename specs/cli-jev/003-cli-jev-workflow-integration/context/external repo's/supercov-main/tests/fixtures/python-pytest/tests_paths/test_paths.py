import importlib.util
from pathlib import Path

from other_src.secondary import secondary_choice
from path_src.namespace_pkg.plugin import namespace_choice


ROOT = Path(__file__).resolve().parents[1]


def _load(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_namespace_package_and_second_source_root():
    assert namespace_choice(True) == "enabled"
    assert secondary_choice(-1) == 0


def test_alias_import_uses_one_physical_obligation_set():
    path = ROOT / "path_src" / "namespace_pkg" / "plugin.py"
    alias = _load("alternate_namespace_plugin", path)
    assert alias.namespace_choice(False) == "disabled"


def test_unicode_and_space_path():
    path = ROOT / "path_src" / "unicodé space" / "module.py"
    module = _load("unicode_space_module", path)
    assert module.unicode_choice(1) == "one"


def test_runtime_generated_and_evaluated_source():
    generated = ROOT / "generated_src" / "runtime_generated.py"
    source = (
        "def generated_choice(enabled):\n"
        "    if enabled:\n"
        "        return 'generated'\n"
        "    return 'fallback'\n"
    )
    generated.write_text(source, encoding="utf-8")
    namespace = {}
    exec(compile(source, str(generated), "exec"), namespace)
    assert namespace["generated_choice"](True) == "generated"

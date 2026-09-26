import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest


def printed(value):
    return (value + os.linesep).encode()


class Processes(unittest.TestCase):
    def call(self, args, **kwargs):
        result = subprocess.run([sys.executable, *args], capture_output=True, **kwargs)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stderr, b"")
        return result.stdout

    def test_imported_and_direct_entries(self):
        from app import entry_one, entry_two

        for name, module in [("one", entry_one), ("two", entry_two)]:
            self.assertEqual(module.value(), name)
            self.assertEqual(self.call([f"app/entry_{name}.py"]), printed(name))

    def test_module_entry(self):
        self.assertEqual(self.call(["-m", "app.module_entry"]), printed("module"))

    def test_empty_helper(self):
        self.assertEqual(self.call(["-c", "pass"]), b"")

    def test_nonzero_stderr(self):
        result = subprocess.run([sys.executable, "-c", "import sys;sys.stderr.write('expected');sys.exit(7)"], capture_output=True)
        self.assertEqual((result.returncode, result.stdout, result.stderr), (7, b"", b"expected"))

    def test_large_pipes(self):
        message = b"echo" * 65536
        self.assertEqual(self.call(["-c", "import sys;sys.stdout.buffer.write(sys.stdin.buffer.read())"], input=message), message)

    def test_nested_child(self):
        inner = "print('grandchild')"
        outer = f"import subprocess,sys;subprocess.run([sys.executable,'-c',{inner!r}],check=True)"
        self.assertEqual(self.call(["-c", outer]), printed("grandchild"))

    def test_isolated_environment(self):
        environment = {key: value for key, value in os.environ.items() if not key.startswith("SUPERCOV_") and key != "PYTHONPATH"}
        self.assertEqual(self.call(["-c", "import os;assert not any(k.startswith('SUPERCOV_') for k in os.environ)"], env=environment), b"")

    def test_positional_environment(self):
        environment = {key: value for key, value in os.environ.items() if not key.startswith("SUPERCOV_") and key != "PYTHONPATH"}
        code = "import os;assert not any(k.startswith('SUPERCOV_') for k in os.environ)"
        child = subprocess.Popen([sys.executable, "-c", code], -1, None, None, subprocess.PIPE, subprocess.PIPE, None, True, False, None, environment)
        out, err = child.communicate()
        self.assertEqual((child.returncode, out, err), (0, b"", b""))

    def test_parent_removes_observer_environment(self):
        removed = {key: value for key, value in os.environ.items() if key.startswith("SUPERCOV_") or key == "PYTHONPATH"}
        try:
            for key in removed:
                del os.environ[key]
            self.assertEqual(self.call(["-c", "print('isolated')"]), printed("isolated"))
        finally:
            os.environ.update(removed)

    @unittest.skipUnless(os.name == "posix", "POSIX bytes environment")
    def test_bytes_environment(self):
        environment = {os.fsencode(key): os.fsencode(value) for key, value in os.environ.items()}
        expected = os.environ.get("SUPERCOV_PYTHON_PLAN")
        # Context must come from the current test, not a stale bytes key.
        if expected:
            environment[b"SUPERCOV_CONTEXT"] = b'{"test":"stale","phase":"call"}'
        code = "from app.module_entry import value; print(value())"
        if expected:
            code += ";import supercov_runtime as s;assert 'test_bytes_environment' in s.runtime().current_identity()['test']"
        self.assertEqual(self.call(["-c", code], env=environment), printed("module"))

    def test_timeout_partial_output(self):
        with tempfile.TemporaryDirectory() as directory:
            ready = Path(directory) / "ready"
            code = f"import pathlib,time;print('partial stdout',flush=True);pathlib.Path({str(ready)!r}).touch();time.sleep(60)"
            child = subprocess.Popen([sys.executable, "-c", code], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            try:
                # Synchronize on actual startup, not an assumed interpreter
                # speed, before testing communicate's timeout semantics.
                deadline = time.monotonic() + 20
                while not ready.exists() and child.poll() is None and time.monotonic() < deadline:
                    time.sleep(0.01)
                self.assertTrue(ready.exists(), "child did not initialize")
                with self.assertRaises(subprocess.TimeoutExpired) as caught:
                    child.communicate(timeout=0.05)
                # Windows reader threads retain the bytes until EOF, so
                # TimeoutExpired has no output; the final communicate below
                # must still recover it. POSIX includes partial bytes now.
                if os.name == "nt":
                    self.assertIsNone(caught.exception.stdout)
                else:
                    self.assertEqual(caught.exception.stdout, printed("partial stdout"))
            finally:
                child.kill()
                out, err = child.communicate()
            self.assertEqual(out, printed("partial stdout"))
            self.assertEqual(err, b"")

    @unittest.skipUnless(os.name == "posix", "POSIX descriptor identity across exec")
    def test_descriptor_closes_on_reexec(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "launch"
            path.write_text("launch")
            check = """import os,sys
fd=int(sys.argv[1]);expected=os.stat(sys.argv[2])
try: actual=os.fstat(fd)
except OSError: pass
else: assert (actual.st_dev,actual.st_ino)!=(expected.st_dev,expected.st_ino)
print('closed')
"""
            launch = f"import os,sys;fd=os.open({str(path)!r},os.O_RDONLY);os.set_inheritable(fd,False);os.execve(sys.executable,[sys.executable,'-c',{check!r},str(fd),{str(path)!r}],os.environ)"
            self.assertEqual(self.call(["-c", launch]), printed("closed"))


if __name__ == "__main__":
    unittest.main()

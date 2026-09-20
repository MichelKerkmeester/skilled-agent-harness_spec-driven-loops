import io
import json
import os
import unittest
import urllib.error
from email.message import Message
from pathlib import Path
from unittest.mock import MagicMock, patch

try:
    import termios
except ImportError:
    termios = None

import jev_cli as jev


class JevTest(unittest.TestCase):
    def test_auth_test_calls_api_and_reports_valid_key(self):
        argv = ["jev", "auth", "test"]
        response = {"model": "jev-1.13.0", "answers": {"answer": {"noul": 1.0}}}
        with patch("sys.argv", argv), patch.object(jev, "call", return_value=response) as call, patch(
            "sys.stdout", new_callable=io.StringIO
        ) as stdout:
            self.assertEqual(jev.main(), 0)
        payload, endpoint, provider = call.call_args.args
        self.assertEqual(endpoint, jev.API_URL)
        self.assertEqual(provider, "official")
        self.assertEqual(payload["questions"]["answer"]["type"], "noul")
        self.assertEqual(
            json.loads(stdout.getvalue()),
            {"ok": True, "valid": True, "model": "jev-1.13.0"},
        )

    def test_auth_test_preserves_authentication_failure(self):
        argv = ["jev", "auth", "test"]
        with patch("sys.argv", argv), patch.object(
            jev, "call", side_effect=jev.CliError("API HTTP 401", 3)
        ), patch("sys.stderr", new_callable=io.StringIO) as stderr:
            self.assertEqual(jev.main(), 3)
        self.assertFalse(json.loads(stderr.getvalue())["ok"])

    def test_install_skills_target_matrix(self):
        import tempfile

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            cases = [
                (False, False, root / "project" / ".agents" / "skills"),
                (False, True, root / "project" / ".claude" / "skills"),
                (True, False, root / "home" / ".agents" / "skills"),
                (True, True, root / "home" / ".claude" / "skills"),
            ]
            for global_install, claude, expected_root in cases:
                result = jev.install_skills(
                    global_install=global_install,
                    claude=claude,
                    cwd=root / "project",
                    home=root / "home",
                )
                self.assertEqual(Path(result["destination"]), expected_root)
                self.assertEqual(result["installed"], ["jev-cli"])
                self.assertTrue((expected_root / "jev-cli" / "SKILL.md").is_file())

    def test_install_skills_refuses_unmanaged_destination(self):
        import tempfile

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            destination = root / ".agents" / "skills" / "jev-cli"
            destination.mkdir(parents=True)
            (destination / "SKILL.md").write_text("user managed")
            with self.assertRaisesRegex(jev.CliError, "refusing to overwrite"):
                jev.install_skills(global_install=False, claude=False, cwd=root, home=root)
            self.assertEqual((destination / "SKILL.md").read_text(), "user managed")

    def test_install_skills_refreshes_managed_destination(self):
        import tempfile

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            jev.install_skills(global_install=False, claude=False, cwd=root, home=root)
            destination = root / ".agents" / "skills" / "jev-cli"
            (destination / "stale.txt").write_text("stale")
            jev.install_skills(global_install=False, claude=False, cwd=root, home=root)
            self.assertFalse((destination / "stale.txt").exists())
            self.assertTrue((destination / jev.INSTALL_MARKER).is_file())

    def test_choice_request(self):
        args = jev.parser().parse_args(
            [
                "choice",
                "--question",
                "Route?",
                "--state",
                "broken",
                "-o",
                "tech=Bug",
                "-o",
                "sales=Purchase",
            ]
        )
        payload, kind = jev.request_for(args)
        self.assertEqual(kind, "choice")
        self.assertEqual(payload["questions"]["answer"]["criteria"], {"tech": "Bug", "sales": "Purchase"})

    def test_short_options_for_question_and_state(self):
        args = jev.parser().parse_args(["noul", "-q", "Urgent?", "-s", "today", "--value"])
        payload, kind = jev.request_for(args)
        self.assertEqual(kind, "noul")
        self.assertEqual(payload["questions"]["answer"]["instructions"], "Urgent?")
        self.assertEqual(payload["state"], "today")
        self.assertTrue(args.value)

    def test_json_state_from_stdin(self):
        args = jev.parser().parse_args(
            ["noul", "--question", "Urgent?", "--state", "-", "--json-state"]
        )
        with patch("sys.stdin", io.StringIO('{"message":"today"}')):
            payload, _ = jev.request_for(args)
        self.assertEqual(payload["state"], {"message": "today"})

    def test_api_key_reads_credential_store(self):
        with patch.dict(os.environ, {}, clear=True), patch.object(jev, "CREDENTIALS_FILE") as path:
            path.read_text.return_value = '{"api_key":"test-key"}'
            self.assertEqual(jev.api_key(), "test-key")

    def test_api_key_prefers_environment(self):
        with patch.dict(os.environ, {"TYPESAFE_API_KEY": "environment-key"}), patch.object(
            jev, "CREDENTIALS_FILE"
        ) as path:
            self.assertEqual(jev.api_key(), "environment-key")
            path.read_text.assert_not_called()

    def test_set_api_key_writes_private_credential_store(self):
        import tempfile
        from pathlib import Path

        with tempfile.TemporaryDirectory() as directory, patch.object(
            jev, "CREDENTIALS_FILE", Path(directory) / "jev-cli" / "credentials.json"
        ), patch("sys.stdin", io.StringIO("test-key\n")), patch.dict(os.environ, {}, clear=True):
            jev.set_api_key()
            self.assertEqual(jev.api_key(), "test-key")
            if os.name == "posix":
                self.assertEqual(jev.CREDENTIALS_FILE.stat().st_mode & 0o777, 0o600)
                self.assertEqual(jev.CREDENTIALS_FILE.parent.stat().st_mode & 0o777, 0o700)

    def test_auth_set_interrupt_exits_without_traceback(self):
        with patch("sys.argv", ["jev", "auth", "set"]), patch.object(
            jev, "set_api_key", side_effect=KeyboardInterrupt
        ), patch("sys.stderr", new_callable=io.StringIO) as stderr:
            self.assertEqual(jev.main(), 130)
        self.assertEqual(stderr.getvalue(), "\nCancelled.\n")
        self.assertNotIn("Traceback", stderr.getvalue())

    @unittest.skipIf(termios is None, "termios is unavailable")
    def test_masked_getpass_shows_one_asterisk_per_character(self):
        stdin = MagicMock()
        stdin.fileno.return_value = 7
        stdin.read.side_effect = ["s", "e", "x", "\x7f", "c", "r", "e", "t", "\n"]
        stderr = io.StringIO()
        with patch("sys.stdin", stdin), patch("sys.stderr", stderr), patch.object(
            termios, "tcgetattr", return_value=[0, 0, 0, termios.ECHO, 0, 0]
        ), patch.object(termios, "tcsetattr"):
            self.assertEqual(jev.masked_getpass("TypeSafe API key: "), "secret")
        self.assertEqual(stderr.getvalue(), "TypeSafe API key: ***\b \b****\n")

    def test_set_api_key_prompts_without_echo_on_tty(self):
        import tempfile
        from pathlib import Path

        with tempfile.TemporaryDirectory() as directory, patch.object(
            jev, "CREDENTIALS_FILE", Path(directory) / "jev-cli" / "credentials.json"
        ), patch("sys.stdin.isatty", return_value=True), patch.object(
            jev, "masked_getpass", return_value="prompted-key"
        ) as prompt, patch.dict(os.environ, {}, clear=True):
            jev.set_api_key()
            prompt.assert_called_once_with("TypeSafe API key: ")
            self.assertEqual(jev.api_key(), "prompted-key")

    def test_provider_defaults_and_models(self):
        cases = {
            "official": "jev-latest",
            "vercel": "typesafe-ai/jev",
            "openrouter": "typesafe/jev-1.13",
            "custom": "jev-latest",
        }
        for provider, model in cases.items():
            args = jev.parser().parse_args(
                ["noul", "--provider", provider, "-q", "Urgent?", "-s", "today"]
            )
            payload, _ = jev.request_for(args)
            self.assertEqual(payload["model"], model)

    def test_custom_provider_uses_its_own_configuration(self):
        environment = {
            "JEV_ENDPOINT": "https://proxy.example.test/v1/systemone",
            "JEV_API_KEY": "proxy-key",
            "JEV_MODEL": "proxy-jev",
        }
        with patch.dict(os.environ, environment, clear=True):
            args = jev.parser().parse_args(
                ["noul", "--provider", "custom", "-q", "Urgent?", "-s", "today"]
            )
            payload, _ = jev.request_for(args)
            self.assertEqual(jev.provider_endpoint("custom"), environment["JEV_ENDPOINT"])
            self.assertEqual(jev.api_key("custom"), environment["JEV_API_KEY"])
            self.assertEqual(payload["model"], environment["JEV_MODEL"])

    def test_custom_provider_requires_an_endpoint(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(jev.CliError, "JEV_ENDPOINT") as raised:
                jev.provider_endpoint("custom")
        self.assertEqual(raised.exception.exit_code, 2)

    def test_legacy_official_endpoint_override_is_preserved(self):
        with patch.dict(os.environ, {"TYPESAFE_API_URL": "https://example.test/systemone"}, clear=True):
            self.assertEqual(jev.provider_endpoint("official"), "https://example.test/systemone")
            self.assertEqual(jev.provider_endpoint("openrouter"), jev.PROVIDERS["openrouter"]["endpoint"])
            self.assertEqual(jev.provider_endpoint("official", "https://override.test"), "https://override.test")

    def test_invalid_provider_environment_is_structured_error(self):
        with patch.dict(os.environ, {"JEV_PROVIDER": "unknown"}, clear=True), patch(
            "sys.argv", ["jev", "noul", "-q", "Urgent?", "-s", "today"]
        ), patch("sys.stderr", new_callable=io.StringIO) as stderr:
            self.assertEqual(jev.main(), 2)
        self.assertIn("invalid JEV_PROVIDER", json.loads(stderr.getvalue())["error"])

    def test_vercel_request_and_response_translation(self):
        payload = {
            "model": "typesafe-ai/jev",
            "state": "today",
            "questions": {"answer": {"type": "noul", "instructions": "Urgent?"}},
        }
        translated, headers = jev.provider_request(payload, "vercel")
        self.assertNotIn("model", translated)
        self.assertEqual(translated["questions"]["answer"]["type"], "boolean")
        self.assertEqual(headers["ai-model-id"], "typesafe-ai/jev")
        self.assertEqual(headers["ai-gateway-protocol-version"], "0.0.1")
        self.assertEqual(headers["ai-gateway-auth-method"], "api-key")
        result = jev.normalize_response(
            {"answers": {"answer": {"type": "boolean", "probability": 0.9}}}, "vercel"
        )
        self.assertEqual(result["answers"]["answer"], {"noul": 0.9})

    def test_provider_api_keys_are_separate(self):
        import tempfile

        with tempfile.TemporaryDirectory() as directory, patch.object(
            jev, "CREDENTIALS_FILE", Path(directory) / "jev-cli" / "credentials.json"
        ), patch.dict(os.environ, {}, clear=True):
            for provider in jev.PROVIDERS:
                with patch("sys.stdin", io.StringIO(f"{provider}-key\n")):
                    jev.set_api_key(provider)
            for provider in jev.PROVIDERS:
                self.assertEqual(jev.api_key(provider), f"{provider}-key")

    def test_setting_provider_key_migrates_legacy_official_key(self):
        import tempfile

        with tempfile.TemporaryDirectory() as directory, patch.object(
            jev, "CREDENTIALS_FILE", Path(directory) / "jev-cli" / "credentials.json"
        ), patch.dict(os.environ, {}, clear=True):
            jev.CREDENTIALS_FILE.parent.mkdir(parents=True)
            jev.CREDENTIALS_FILE.write_text('{"api_key":"legacy-key"}')
            with patch("sys.stdin", io.StringIO("openrouter-key\n")):
                jev.set_api_key("openrouter")
            self.assertEqual(jev.api_key("official"), "legacy-key")
            self.assertEqual(jev.api_key("openrouter"), "openrouter-key")

    def test_malformed_provider_credentials_are_structured_error(self):
        with patch.dict(os.environ, {}, clear=True), patch.object(jev, "CREDENTIALS_FILE") as path:
            path.read_text.return_value = '{"providers":"invalid"}'
            with self.assertRaises(jev.CliError) as raised:
                jev.api_key("openrouter")
        self.assertEqual(raised.exception.exit_code, 3)

    def test_set_api_key_refuses_to_overwrite_invalid_credentials(self):
        import tempfile

        with tempfile.TemporaryDirectory() as directory, patch.object(
            jev, "CREDENTIALS_FILE", Path(directory) / "jev-cli" / "credentials.json"
        ), patch("sys.stdin", io.StringIO("new-key\n")), patch.dict(os.environ, {}, clear=True):
            jev.CREDENTIALS_FILE.parent.mkdir(parents=True)
            jev.CREDENTIALS_FILE.write_text("not-json")
            with self.assertRaisesRegex(jev.CliError, "refusing to overwrite") as raised:
                jev.set_api_key("openrouter")
            self.assertEqual(raised.exception.exit_code, 3)
            self.assertEqual(jev.CREDENTIALS_FILE.read_text(), "not-json")

    def test_provider_http_contracts(self):
        class Response(io.BytesIO):
            def __enter__(self):
                return self

            def __exit__(self, *args):
                self.close()

        payload = {
            "model": "custom-model",
            "state": "today",
            "questions": {
                "urgent": {"type": "noul", "instructions": "Urgent?"},
                "route": {"type": "choice", "instructions": "Route?", "criteria": {"a": "A", "b": "B"}},
                "quality": {"type": "score", "instructions": "Quality?", "criteria": ["low", "high"]},
            },
        }
        results = {
            "official": {"answers": {}},
            "openrouter": {"answers": {}},
            "custom": {"answers": {}},
            "vercel": {
                "answers": {
                    "urgent": {"type": "boolean", "probability": 0.9},
                    "route": {"type": "choice", "choice": "a", "probabilities": {"a": 0.8, "b": 0.2}},
                    "quality": {"type": "score", "score": 1.0, "probabilities": {"0": 0.0, "1": 1.0}},
                }
            },
        }
        for provider, config in jev.PROVIDERS.items():
            captured = []
            endpoint = config["endpoint"] or "https://proxy.example.test/v1/systemone"

            def open_url(request, timeout):
                captured.append((request, timeout))
                return Response(json.dumps(results[provider]).encode())

            with patch.object(jev, "api_key", return_value=f"{provider}-key"), patch(
                "urllib.request.urlopen", side_effect=open_url
            ):
                result = jev.call(payload, endpoint, provider)
            request, timeout = captured[0]
            body = json.loads(request.data)
            self.assertEqual(request.full_url, endpoint)
            self.assertEqual(request.headers["Authorization"], f"Bearer {provider}-key")
            self.assertEqual(timeout, 60)
            if provider == "vercel":
                self.assertNotIn("model", body)
                self.assertEqual(request.headers["Ai-model-id"], "custom-model")
                self.assertEqual(body["questions"]["urgent"]["type"], "boolean")
                self.assertEqual(result["answers"]["urgent"], {"noul": 0.9})
                self.assertEqual(result["answers"]["route"]["choice"], "a")
                self.assertEqual(result["answers"]["quality"]["score"], 1.0)
            else:
                self.assertEqual(body, payload)

    def test_primary_values(self):
        result = {"answers": {"answer": {"noul": 0.9, "choice": "a", "score": 1.5}}}
        self.assertEqual(jev.primary_value(result, "noul"), 0.9)
        self.assertEqual(jev.primary_value(result, "choice"), "a")
        self.assertEqual(jev.primary_value(result, "score"), 1.5)

    def test_call_maps_authentication_failure_to_exit_code_3(self):
        error = urllib.error.HTTPError(
            "https://example.test", 401, "Unauthorized", Message(), io.BytesIO(b'{"error":"bad key"}')
        )
        with patch.object(jev, "api_key", return_value="test-key"), patch(
            "urllib.request.urlopen", side_effect=error
        ):
            with self.assertRaisesRegex(jev.CliError, "API HTTP 401") as raised:
                jev.call({"state": "test", "questions": {}}, "https://example.test")
        self.assertEqual(raised.exception.exit_code, 3)

    def test_call_maps_connection_failure_to_exit_code_4(self):
        with patch.object(jev, "api_key", return_value="test-key"), patch(
            "urllib.request.urlopen", side_effect=urllib.error.URLError("offline")
        ):
            with self.assertRaisesRegex(jev.CliError, "API connection failed") as raised:
                jev.call({"state": "test", "questions": {}}, "https://example.test")
        self.assertEqual(raised.exception.exit_code, 4)

    def test_main_prints_only_primary_value(self):
        argv = ["jev", "noul", "--question", "Urgent?", "--state", "today", "--value"]
        with patch("sys.argv", argv), patch.object(
            jev, "call", return_value={"answers": {"answer": {"noul": 0.9}}}
        ), patch("sys.stdout", new_callable=io.StringIO) as stdout:
            self.assertEqual(jev.main(), 0)
        self.assertEqual(stdout.getvalue(), "0.9\n")

    def test_main_emits_structured_error(self):
        with patch("sys.argv", ["jev", "run", "missing.json"]), patch(
            "sys.stderr", new_callable=io.StringIO
        ) as stderr:
            self.assertEqual(jev.main(), 2)
        self.assertEqual(json.loads(stderr.getvalue())["ok"], False)


if __name__ == "__main__":
    unittest.main()

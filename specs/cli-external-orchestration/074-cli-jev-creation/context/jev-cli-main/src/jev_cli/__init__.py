#!/usr/bin/env python3
"""Small CLI and stdio MCP server for TypeSafe Jev."""

from __future__ import annotations

import argparse
import getpass
import json
import os
import shutil
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

PROVIDERS = {
    "official": {
        "endpoint": "https://api.typesafe.ai/v1/systemone",
        "key_env": "TYPESAFE_API_KEY",
        "model": "jev-latest",
    },
    "vercel": {
        "endpoint": "https://ai-gateway.vercel.sh/v4/ai/evaluation-model",
        "key_env": "AI_GATEWAY_API_KEY",
        "model": "typesafe-ai/jev",
    },
    "openrouter": {
        "endpoint": "https://openrouter.ai/api/alpha/decisions",
        "key_env": "OPENROUTER_API_KEY",
        "model": "typesafe/jev-1.13",
    },
    "custom": {
        "endpoint": None,
        "key_env": "JEV_API_KEY",
        "model": "jev-latest",
    },
}
API_URL = PROVIDERS["official"]["endpoint"]
CREDENTIALS_FILE = Path(os.environ.get("XDG_CONFIG_HOME", Path.home() / ".config")) / "jev-cli" / "credentials.json"
BUNDLED_SKILLS = Path(__file__).with_name("bundled_skills")
INSTALL_MARKER = ".jev-cli-managed"


class CliError(Exception):
    def __init__(self, message: str, exit_code: int = 2) -> None:
        super().__init__(message)
        self.exit_code = exit_code


def masked_getpass(prompt: str) -> str:
    """Read a secret while showing one asterisk per entered character."""
    try:
        import termios
    except ImportError:
        return getpass.getpass(prompt)

    stream = sys.stderr
    stream.write(prompt)
    stream.flush()
    fd = sys.stdin.fileno()
    previous = termios.tcgetattr(fd)
    current = previous.copy()
    current[3] &= ~(termios.ECHO | termios.ICANON)
    characters: list[str] = []
    try:
        termios.tcsetattr(fd, termios.TCSADRAIN, current)
        while True:
            character = sys.stdin.read(1)
            if character in ("\n", "\r"):
                stream.write("\n")
                return "".join(characters)
            if character == "\x03":
                raise KeyboardInterrupt
            if character in ("\x7f", "\b"):
                if characters:
                    characters.pop()
                    stream.write("\b \b")
            elif character:
                characters.append(character)
                stream.write("*")
            else:
                raise EOFError
            stream.flush()
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, previous)


def api_key(provider: str = "official") -> str:
    config = PROVIDERS[provider]
    if value := os.environ.get(config["key_env"]):
        return value
    try:
        data = json.loads(CREDENTIALS_FILE.read_text())
        providers = data.get("providers", {})
        if not isinstance(providers, dict):
            raise TypeError("providers must be an object")
        value = providers.get(provider)
        if value is None and provider == "official":
            value = data["api_key"]
    except (OSError, json.JSONDecodeError, KeyError, TypeError) as exc:
        raise CliError(
            f"{provider} API key is not stored; run: jev auth set --provider {provider}",
            3,
        ) from exc
    if not isinstance(value, str) or not value:
        raise CliError(f"stored {provider} API key is empty", 3)
    return value


def set_api_key(provider: str = "official") -> None:
    label = "TypeSafe" if provider == "official" else provider
    value = masked_getpass(f"{label} API key: ").strip() if sys.stdin.isatty() else sys.stdin.read().strip()
    if not value:
        raise CliError("API key is empty")
    CREDENTIALS_FILE.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    try:
        data = json.loads(CREDENTIALS_FILE.read_text())
    except FileNotFoundError:
        data = {}
    except (OSError, json.JSONDecodeError) as exc:
        raise CliError("stored credential file is invalid; refusing to overwrite it", 3) from exc
    if not isinstance(data, dict):
        raise CliError("stored credential file must contain an object", 3)
    providers = data.setdefault("providers", {})
    if not isinstance(providers, dict):
        raise CliError("stored credential file has an invalid providers object", 3)
    if old_key := data.pop("api_key", None):
        providers.setdefault("official", old_key)
    providers[provider] = value
    try:
        fd, temporary = tempfile.mkstemp(dir=CREDENTIALS_FILE.parent)
        with os.fdopen(fd, "w") as file:
            json.dump(data, file)
            file.write("\n")
        os.chmod(temporary, 0o600)
        os.replace(temporary, CREDENTIALS_FILE)
    except OSError as exc:
        raise CliError("could not write the Jev credential store", 3) from exc


def install_skills(
    *, global_install: bool, claude: bool, cwd: Path | None = None, home: Path | None = None
) -> dict[str, Any]:
    base = (home or Path.home()) if global_install else (cwd or Path.cwd())
    flavor = ".claude" if claude else ".agents"
    destination_root = base / flavor / "skills"
    installed: list[str] = []
    paths: list[str] = []
    for source in sorted(BUNDLED_SKILLS.iterdir()):
        if not source.is_dir() or not (source / "SKILL.md").is_file():
            continue
        destination = destination_root / source.name
        if destination.exists() and not (destination / INSTALL_MARKER).is_file():
            raise CliError(f"refusing to overwrite unmanaged skill: {destination}")
        destination_root.mkdir(parents=True, exist_ok=True)
        staged = Path(tempfile.mkdtemp(prefix=f".{source.name}-", dir=destination_root))
        try:
            shutil.copytree(source, staged, dirs_exist_ok=True)
            (staged / INSTALL_MARKER).write_text("managed by jev install-skills\n")
            if destination.exists():
                shutil.rmtree(destination)
            staged.replace(destination)
        except OSError as exc:
            shutil.rmtree(staged, ignore_errors=True)
            raise CliError(f"could not install skill: {exc}") from exc
        installed.append(source.name)
        paths.append(str(destination))
    return {
        "ok": True,
        "scope": "global" if global_install else "local",
        "flavor": "claude" if claude else "agents",
        "destination": str(destination_root),
        "installed": installed,
        "paths": paths,
    }


def read_text(value: str | None) -> str:
    if value is None or value == "-":
        if sys.stdin.isatty():
            raise CliError("state is required as an argument, @file, or stdin")
        return sys.stdin.read()
    if value.startswith("@"):
        try:
            return Path(value[1:]).read_text()
        except OSError as exc:
            raise CliError(f"cannot read state file: {exc}") from exc
    return value


def state_value(value: str | None, force_json: bool) -> Any:
    text = read_text(value)
    if force_json:
        try:
            return json.loads(text)
        except json.JSONDecodeError as exc:
            raise CliError(f"invalid JSON state: {exc}") from exc
    return text


def split_pair(value: str) -> tuple[str, str]:
    key, separator, description = value.partition("=")
    if not separator or not key or not description:
        raise argparse.ArgumentTypeError("expected KEY=DESCRIPTION")
    return key, description


def load_request(path: str) -> dict[str, Any]:
    text = read_text("-" if path == "-" else f"@{path}")
    try:
        payload = json.loads(text)
    except json.JSONDecodeError as exc:
        raise CliError(f"invalid request JSON: {exc}") from exc
    if not isinstance(payload, dict) or "state" not in payload or "questions" not in payload:
        raise CliError("request must be an object containing state and questions")
    return payload


def provider_request(payload: dict[str, Any], provider: str) -> tuple[dict[str, Any], dict[str, str]]:
    payload = dict(payload)
    headers: dict[str, str] = {}
    if provider == "vercel":
        payload["questions"] = {
            name: {**question, "type": "boolean" if question.get("type") == "noul" else question.get("type")}
            for name, question in payload["questions"].items()
        }
        headers = {
            "ai-gateway-protocol-version": "0.0.1",
            "ai-gateway-auth-method": "api-key",
            "ai-evaluation-model-specification-version": "4",
            "ai-model-id": payload.pop("model"),
        }
    return payload, headers


def normalize_response(result: dict[str, Any], provider: str) -> dict[str, Any]:
    if provider != "vercel":
        return result
    result = dict(result)
    result["answers"] = {
        name: (
            {"noul": answer["probability"], **{k: v for k, v in answer.items() if k not in ("type", "probability")}}
            if answer.get("type") == "boolean"
            else {k: v for k, v in answer.items() if k != "type"}
        )
        for name, answer in result["answers"].items()
    }
    return result


def provider_endpoint(provider: str, override: str | None = None) -> str:
    if override:
        return override
    if provider == "custom":
        if endpoint := os.environ.get("JEV_ENDPOINT"):
            return endpoint
        raise CliError("custom provider requires JEV_ENDPOINT or --endpoint", 2)
    if provider == "official" and (legacy := os.environ.get("TYPESAFE_API_URL")):
        return legacy
    endpoint = PROVIDERS[provider]["endpoint"]
    if not isinstance(endpoint, str):
        raise CliError(f"{provider} provider endpoint is not configured", 2)
    return endpoint


def provider_model(provider: str) -> str:
    if provider == "custom":
        return os.environ.get("JEV_MODEL", PROVIDERS[provider]["model"])
    return PROVIDERS[provider]["model"]


def call(payload: dict[str, Any], endpoint: str, provider: str = "official") -> dict[str, Any]:
    payload, provider_headers = provider_request(payload, provider)
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload, ensure_ascii=False).encode(),
        headers={
            "Authorization": f"Bearer {api_key(provider)}",
            "Content-Type": "application/json",
            "User-Agent": "jev-cli/0.6.2",
            **provider_headers,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            result = json.load(response)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode(errors="replace")
        try:
            detail = json.loads(body)
        except json.JSONDecodeError:
            detail = body
        code = 3 if exc.code in (401, 403) else 4 if exc.code in (429, 500, 502, 503, 504) else 1
        raise CliError(f"API HTTP {exc.code}: {json.dumps(detail, ensure_ascii=False)}", code) from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise CliError(f"API connection failed: {exc}", 4) from exc
    if not isinstance(result, dict):
        raise CliError("API returned a non-object response", 1)
    return normalize_response(result, provider)


def common_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(add_help=False)
    default_provider = os.environ.get("JEV_PROVIDER", "official")
    parser.add_argument(
        "--provider",
        choices=PROVIDERS,
        default=default_provider,
        help="API provider (default: official)",
    )
    parser.add_argument("--model", help="model name (default depends on provider)")
    parser.add_argument("--json-state", action="store_true", help="parse state as JSON")
    parser.add_argument("--pretty", action="store_true", help="pretty-print JSON")
    parser.add_argument("--value", action="store_true", help="print only the primary answer value")
    parser.add_argument("--endpoint", help=argparse.SUPPRESS)
    return parser


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(
        prog="jev",
        description="Evaluate text or JSON with TypeSafe Jev. Uses its own local credential store.",
    )
    root.add_argument("--version", action="version", version="jev 0.6.2")
    sub = root.add_subparsers(dest="command", required=True)
    common = common_parser()

    auth = sub.add_parser("auth", help="manage the API key in the Jev credential store")
    auth_sub = auth.add_subparsers(dest="auth_command", required=True)
    for name, help_text in (
        ("set", "store an API key from a hidden prompt or stdin"),
        ("status", "check whether an API key is stored"),
        ("test", "connect to Jev and verify the API key"),
    ):
        auth_command = auth_sub.add_parser(name, help=help_text)
        auth_command.add_argument("--provider", choices=PROVIDERS, default="official")

    skills = sub.add_parser("install-skills", help="install bundled agent skills")
    skills.add_argument("-g", "--global", dest="global_install", action="store_true", help="install in the user home")
    skills.add_argument("--claude", action="store_true", help="install for Claude instead of .agents")

    noul = sub.add_parser("noul", parents=[common], help="answer one yes/no question with a probability")
    noul.add_argument("-q", "--question", required=True, help="question to answer")
    noul.add_argument("-s", "--state", help="text, @file, or - for stdin (default: stdin)")

    choice = sub.add_parser("choice", parents=[common], help="choose one option")
    choice.add_argument("-q", "--question", required=True, help="question to answer")
    choice.add_argument("-s", "--state", help="text, @file, or - for stdin (default: stdin)")
    choice.add_argument("-o", "--option", action="append", type=split_pair, required=True, metavar="KEY=DESCRIPTION")

    score = sub.add_parser("score", parents=[common], help="score against ordered levels")
    score.add_argument("-q", "--question", required=True, help="question to answer")
    score.add_argument("-s", "--state", help="text, @file, or - for stdin (default: stdin)")
    score.add_argument("-l", "--level", action="append", required=True, metavar="DESCRIPTION")

    run = sub.add_parser("run", parents=[common], help="send a complete request JSON for batched questions")
    run.add_argument("request", help="JSON file or - for stdin")
    return root


def question_request(kind: str, state: Any, question: str, criteria: Any, model: str) -> dict[str, Any]:
    """Build a single-question System One request shared by the CLI and the MCP server."""
    specification: dict[str, Any] = {"type": kind, "instructions": question}
    if criteria is not None:
        specification["criteria"] = criteria
    return {"state": state, "model": model, "questions": {"answer": specification}}


def request_for(args: argparse.Namespace) -> tuple[dict[str, Any], str | None]:
    if args.command == "run":
        payload = load_request(args.request)
        payload.setdefault("model", args.model or provider_model(args.provider))
        return payload, None

    criteria = dict(args.option) if args.command == "choice" else args.level if args.command == "score" else None
    payload = question_request(
        args.command,
        state_value(args.state, args.json_state),
        args.question,
        criteria,
        args.model or provider_model(args.provider),
    )
    return payload, args.command


def primary_value(result: dict[str, Any], kind: str | None) -> Any:
    if kind is None:
        raise CliError("--value is available only for noul, choice, and score")
    answer = result["answers"]["answer"]
    return answer[{"noul": "noul", "choice": "choice", "score": "score"}[kind]]


def main() -> int:
    try:
        args = parser().parse_args()
        if args.command == "auth":
            if args.auth_command == "set":
                set_api_key(args.provider)
                print(json.dumps({"ok": True, "stored": True, "store": str(CREDENTIALS_FILE)}))
            elif args.auth_command == "test":
                result = call(
                    {
                        "state": "authentication test",
                        "model": provider_model(args.provider),
                        "questions": {
                            "answer": {
                                "type": "noul",
                                "instructions": "Is this an authentication test?",
                            }
                        },
                    },
                    provider_endpoint(args.provider),
                    args.provider,
                )
                print(json.dumps({"ok": True, "valid": True, "model": result.get("model")}))
            else:
                api_key(args.provider)
                print(json.dumps({"ok": True, "stored": True, "store": str(CREDENTIALS_FILE)}))
            return 0
        if args.command == "install-skills":
            print(json.dumps(install_skills(global_install=args.global_install, claude=args.claude)))
            return 0
        if args.provider not in PROVIDERS:
            raise CliError(f"invalid JEV_PROVIDER: {args.provider}")
        payload, kind = request_for(args)
        result = call(payload, provider_endpoint(args.provider, args.endpoint), args.provider)
        if args.value:
            print(primary_value(result, kind))
        else:
            print(json.dumps(result, ensure_ascii=False, indent=2 if args.pretty else None))
        return 0
    except CliError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return exc.exit_code
    except (KeyError, TypeError) as exc:
        print(json.dumps({"ok": False, "error": f"unexpected API response: {exc}"}), file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\nCancelled.", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main())

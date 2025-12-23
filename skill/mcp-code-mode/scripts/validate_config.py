#!/usr/bin/env python3
"""
Code Mode UTCP Configuration Validator

Validates .utcp_config.json files for:
- Valid JSON structure
- Valid manual names (JavaScript identifiers)
- Required fields present
- No duplicate manual names
- Environment variable references valid
- MCP server configuration completeness

Usage:
    python3 validate_config.py <path-to-.utcp_config.json>
    python3 validate_config.py <path-to-.utcp_config.json> --check-env <path-to-.env>
"""

import json
import re
import sys
import os
from pathlib import Path
from typing import Dict, List, Set, Tuple


class ConfigValidator:
    """Validates Code Mode UTCP configuration files"""

    # Valid JavaScript identifier pattern
    VALID_IDENTIFIER = re.compile(r'^[a-zA-Z_$][a-zA-Z0-9_$]*$')

    # Environment variable reference pattern
    ENV_VAR_PATTERN = re.compile(r'\$\{([A-Z_][A-Z0-9_]*)\}')

    def __init__(self, config_path: str, env_path: str = None):
        self.config_path = Path(config_path)
        self.env_path = Path(env_path) if env_path else None
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.config: Dict = {}
        self.env_vars: Set[str] = set()

    def validate(self) -> bool:
        """Run all validation checks. Returns True if valid, False otherwise."""
        print(f"Validating configuration: {self.config_path}\n")

        # Step 1: Load and parse JSON
        if not self._load_config():
            return False

        # Step 2: Load .env if provided
        if self.env_path:
            self._load_env()

        # Step 3: Validate structure
        self._validate_structure()

        # Step 4: Validate manual call templates
        self._validate_manual_templates()

        # Step 5: Validate environment variables
        if self.env_path:
            self._validate_env_vars()

        # Step 6: Print results
        self._print_results()

        return len(self.errors) == 0

    def _load_config(self) -> bool:
        """Load and parse configuration file"""
        if not self.config_path.exists():
            self.errors.append(f"Configuration file not found: {self.config_path}")
            return False

        try:
            with open(self.config_path, 'r') as f:
                self.config = json.load(f)
            print("✓ Valid JSON structure")
            return True
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON: {e}")
            return False

    def _load_env(self):
        """Load environment variables from .env file"""
        if not self.env_path.exists():
            self.warnings.append(f".env file not found: {self.env_path}")
            return

        try:
            with open(self.env_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        if '=' in line:
                            key = line.split('=', 1)[0].strip()
                            self.env_vars.add(key)
            print(f"✓ Loaded {len(self.env_vars)} environment variables from .env")
        except Exception as e:
            self.warnings.append(f"Error reading .env file: {e}")

    def _validate_structure(self):
        """Validate top-level configuration structure"""
        # Check for required top-level fields
        required_fields = ['manual_call_templates']
        for field in required_fields:
            if field not in self.config:
                self.errors.append(f"Missing required field: {field}")

        # Validate load_variables_from if present
        if 'load_variables_from' in self.config:
            if not isinstance(self.config['load_variables_from'], list):
                self.errors.append("'load_variables_from' must be an array")
            else:
                for idx, loader in enumerate(self.config['load_variables_from']):
                    if 'variable_loader_type' not in loader:
                        self.errors.append(
                            f"load_variables_from[{idx}]: missing 'variable_loader_type'"
                        )

        # Validate tool_repository if present
        if 'tool_repository' in self.config:
            if 'tool_repository_type' not in self.config['tool_repository']:
                self.errors.append("tool_repository: missing 'tool_repository_type'")

        # Validate tool_search_strategy if present
        if 'tool_search_strategy' in self.config:
            if 'tool_search_strategy_type' not in self.config['tool_search_strategy']:
                self.errors.append(
                    "tool_search_strategy: missing 'tool_search_strategy_type'"
                )

        if not self.errors:
            print("✓ Valid configuration structure")

    def _validate_manual_templates(self):
        """Validate manual_call_templates array"""
        if 'manual_call_templates' not in self.config:
            return

        templates = self.config['manual_call_templates']

        if not isinstance(templates, list):
            self.errors.append("'manual_call_templates' must be an array")
            return

        if len(templates) == 0:
            self.warnings.append("No manual call templates defined")
            return

        manual_names: Set[str] = set()

        for idx, template in enumerate(templates):
            self._validate_single_template(template, idx, manual_names)

        print(f"✓ Validated {len(templates)} manual call template(s)")

    def _validate_single_template(self, template: Dict, idx: int, manual_names: Set[str]):
        """Validate a single manual call template"""
        prefix = f"manual_call_templates[{idx}]"

        # Check required fields
        required_fields = ['name', 'call_template_type', 'config']
        for field in required_fields:
            if field not in template:
                self.errors.append(f"{prefix}: missing required field '{field}'")

        # Validate manual name
        if 'name' in template:
            name = template['name']

            # Check if valid JavaScript identifier
            if not self.VALID_IDENTIFIER.match(name):
                self.errors.append(
                    f"{prefix}: invalid manual name '{name}' "
                    "(must be valid JavaScript identifier: letters, digits, _, $ only)"
                )

            # Check for duplicates
            if name in manual_names:
                self.errors.append(f"{prefix}: duplicate manual name '{name}'")
            else:
                manual_names.add(name)

            # Check for hyphens (common mistake)
            if '-' in name:
                self.errors.append(
                    f"{prefix}: manual name '{name}' contains hyphen "
                    "(use underscores instead)"
                )

            # Check for spaces
            if ' ' in name:
                self.errors.append(
                    f"{prefix}: manual name '{name}' contains spaces "
                    "(use underscores instead)"
                )

        # Validate call_template_type
        if 'call_template_type' in template:
            valid_types = ['mcp', 'http', 'cli', 'file']
            if template['call_template_type'] not in valid_types:
                self.warnings.append(
                    f"{prefix}: unexpected call_template_type "
                    f"'{template['call_template_type']}' "
                    f"(expected one of: {', '.join(valid_types)})"
                )

        # Validate MCP config if type is 'mcp'
        if template.get('call_template_type') == 'mcp':
            self._validate_mcp_config(template.get('config', {}), prefix)

    def _validate_mcp_config(self, config: Dict, prefix: str):
        """Validate MCP server configuration"""
        if 'mcpServers' not in config:
            self.errors.append(f"{prefix}.config: missing 'mcpServers'")
            return

        servers = config['mcpServers']
        if not isinstance(servers, dict):
            self.errors.append(f"{prefix}.config.mcpServers: must be an object")
            return

        for server_key, server_config in servers.items():
            server_prefix = f"{prefix}.config.mcpServers.{server_key}"

            # Check required fields
            if 'transport' not in server_config:
                self.errors.append(f"{server_prefix}: missing 'transport'")

            # Validate stdio transport
            if server_config.get('transport') == 'stdio':
                if 'command' not in server_config:
                    self.errors.append(f"{server_prefix}: missing 'command'")
                if 'args' not in server_config:
                    self.errors.append(f"{server_prefix}: missing 'args'")
                elif not isinstance(server_config['args'], list):
                    self.errors.append(f"{server_prefix}.args: must be an array")

            # Validate SSE transport
            elif server_config.get('transport') == 'sse':
                if 'url' not in server_config:
                    self.errors.append(f"{server_prefix}: missing 'url'")

            # Extract environment variable references from env object
            if 'env' in server_config and isinstance(server_config['env'], dict):
                for env_key, env_value in server_config['env'].items():
                    if isinstance(env_value, str):
                        self._extract_env_vars(env_value, server_prefix)

    def _extract_env_vars(self, value: str, context: str):
        """Extract and track environment variable references"""
        for match in self.ENV_VAR_PATTERN.finditer(value):
            var_name = match.group(1)
            # Store for later validation if .env is provided
            if hasattr(self, '_required_env_vars'):
                self._required_env_vars.add((var_name, context))
            else:
                self._required_env_vars = {(var_name, context)}

    def _validate_env_vars(self):
        """Validate that all required environment variables are defined"""
        if not hasattr(self, '_required_env_vars'):
            return

        missing_vars = []
        for var_name, context in self._required_env_vars:
            if var_name not in self.env_vars:
                missing_vars.append(f"  - {var_name} (referenced in {context})")

        if missing_vars:
            self.errors.append(
                "Environment variables referenced but not defined in .env:\n" +
                "\n".join(missing_vars)
            )
        else:
            print(f"✓ All {len(self._required_env_vars)} required environment variables are defined")

    def _print_results(self):
        """Print validation results"""
        print("\n" + "=" * 70)

        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):\n")
            for warning in self.warnings:
                print(f"  • {warning}")

        if self.errors:
            print(f"\n❌ ERRORS ({len(self.errors)}):\n")
            for error in self.errors:
                print(f"  • {error}")
            print("\n" + "=" * 70)
            print("❌ VALIDATION FAILED")
        else:
            print("\n✅ VALIDATION PASSED")
            if self.warnings:
                print(f"   ({len(self.warnings)} warning(s))")

        print("=" * 70)


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    config_path = sys.argv[1]
    env_path = None

    # Parse optional --check-env flag
    if len(sys.argv) >= 4 and sys.argv[2] == '--check-env':
        env_path = sys.argv[3]

    validator = ConfigValidator(config_path, env_path)
    success = validator.validate()

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()

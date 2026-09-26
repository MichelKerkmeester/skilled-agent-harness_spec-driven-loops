//! Cargo-accurate configuration loading for the values Supercov must inspect.
//!
//! Cargo remains the execution authority. Supercov nevertheless has to know
//! the target runner that Cargo would replace when it injects its own runner.
//! `cargo-config2` does not currently implement Cargo 1.95's config `include`
//! or command-line `--config` layers, so those layers are modeled here with
//! definition provenance intact. The merge and include rules follow Cargo
//! 1.95.0 (`f2d3ce0bd`) and are checked against real Cargo in the compiler
//! corpus before this model may support a public Rust frontend.

use std::{
    collections::{BTreeMap, HashSet},
    fs,
    path::{Path, PathBuf},
};

use cargo_config2::Walk;
use toml_edit::{DocumentMut, Item};

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) enum CargoConfigDefinition {
    BuiltIn,
    File(PathBuf),
    Environment(String),
    CliFile(PathBuf),
    CliValue,
}

impl CargoConfigDefinition {
    fn include_root<'a>(&'a self, cwd: &'a Path) -> &'a Path {
        match self {
            Self::File(path) | Self::CliFile(path) => {
                path.parent().expect("loaded configuration has a parent")
            }
            Self::BuiltIn | Self::Environment(_) | Self::CliValue => cwd,
        }
    }

    pub(crate) fn value_root<'a>(&'a self, cwd: &'a Path) -> &'a Path {
        match self {
            // Cargo resolves config-relative program paths from the directory
            // above `.cargo`, including files passed through --config.
            Self::File(path) | Self::CliFile(path) => path
                .parent()
                .and_then(Path::parent)
                .expect("loaded configuration has a .cargo-style parent"),
            Self::BuiltIn | Self::Environment(_) | Self::CliValue => cwd,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub(crate) struct CargoConfigValue {
    pub(crate) kind: CargoConfigKind,
    pub(crate) definition: CargoConfigDefinition,
}

#[derive(Debug, Clone, PartialEq)]
pub(crate) enum CargoConfigKind {
    Integer(i64),
    String(String),
    List(Vec<CargoConfigValue>),
    Table(BTreeMap<String, CargoConfigValue>),
    Boolean(bool),
}

impl CargoConfigValue {
    fn empty() -> Self {
        Self {
            kind: CargoConfigKind::Table(BTreeMap::new()),
            definition: CargoConfigDefinition::BuiltIn,
        }
    }

    fn from_toml(
        value: toml::Value,
        definition: &CargoConfigDefinition,
    ) -> Result<Self, CargoConfigModelError> {
        let kind = match value {
            toml::Value::Integer(value) => CargoConfigKind::Integer(value),
            toml::Value::String(value) => CargoConfigKind::String(value),
            toml::Value::Array(values) => CargoConfigKind::List(
                values
                    .into_iter()
                    .map(|value| Self::from_toml(value, definition))
                    .collect::<Result<_, _>>()?,
            ),
            toml::Value::Table(values) => CargoConfigKind::Table(
                values
                    .into_iter()
                    .map(|(key, value)| Ok((key, Self::from_toml(value, definition)?)))
                    .collect::<Result<_, CargoConfigModelError>>()?,
            ),
            toml::Value::Boolean(value) => CargoConfigKind::Boolean(value),
            toml::Value::Float(_) | toml::Value::Datetime(_) => {
                return Err(CargoConfigModelError::Invalid(
                    "Cargo configuration supports only integers, strings, lists, tables and booleans"
                        .into(),
                ));
            }
        };
        Ok(Self {
            kind,
            definition: definition.clone(),
        })
    }

    pub(crate) fn at(&self, path: &[&str]) -> Option<&Self> {
        let mut value = self;
        for key in path {
            let CargoConfigKind::Table(table) = &value.kind else {
                return None;
            };
            value = table.get(*key)?;
        }
        Some(value)
    }

    pub(crate) fn table(&self) -> Option<&BTreeMap<String, Self>> {
        let CargoConfigKind::Table(table) = &self.kind else {
            return None;
        };
        Some(table)
    }

    pub(crate) fn string(&self) -> Option<&str> {
        let CargoConfigKind::String(value) = &self.kind else {
            return None;
        };
        Some(value)
    }

    pub(crate) fn string_list(&self) -> Option<Vec<&str>> {
        match &self.kind {
            CargoConfigKind::String(value) => Some(vec![value]),
            CargoConfigKind::List(values) => values
                .iter()
                .map(|value| value.string())
                .collect::<Option<Vec<_>>>(),
            _ => None,
        }
    }

    pub(crate) fn program_and_arguments(
        &self,
        cwd: &Path,
    ) -> Result<(PathBuf, Vec<String>), CargoConfigModelError> {
        let values = match &self.kind {
            CargoConfigKind::String(value) => value
                .split_ascii_whitespace()
                .map(str::to_owned)
                .collect::<Vec<_>>(),
            CargoConfigKind::List(values) => values
                .iter()
                .map(|value| {
                    value.string().map(str::to_owned).ok_or_else(|| {
                        CargoConfigModelError::Invalid(
                            "Cargo executable path and arguments must all be strings".into(),
                        )
                    })
                })
                .collect::<Result<Vec<_>, _>>()?,
            _ => {
                return Err(CargoConfigModelError::Invalid(
                    "Cargo executable path and arguments must be a string or string array".into(),
                ));
            }
        };
        let Some((program, arguments)) = values.split_first() else {
            return Err(CargoConfigModelError::Invalid(
                "Cargo executable path and arguments cannot be empty".into(),
            ));
        };
        let program = if program.contains('/') || program.contains('\\') {
            self.definition.value_root(cwd).join(program)
        } else {
            PathBuf::from(program)
        };
        Ok((program, arguments.to_vec()))
    }

    pub(crate) fn program_path(&self, cwd: &Path) -> Result<PathBuf, CargoConfigModelError> {
        let value = self.string().ok_or_else(|| {
            CargoConfigModelError::Invalid(
                "Cargo compiler and wrapper paths must be strings".into(),
            )
        })?;
        if value.is_empty() {
            return Ok(PathBuf::new());
        }
        if value.contains('/') || value.contains('\\') {
            Ok(self.definition.value_root(cwd).join(value))
        } else {
            Ok(PathBuf::from(value))
        }
    }

    fn description(&self) -> &'static str {
        match self.kind {
            CargoConfigKind::Integer(_) => "integer",
            CargoConfigKind::String(_) => "string",
            CargoConfigKind::List(_) => "array",
            CargoConfigKind::Table(_) => "table",
            CargoConfigKind::Boolean(_) => "boolean",
        }
    }

    fn merge(
        &mut self,
        mut incoming: Self,
        force: bool,
        path: &mut Vec<String>,
    ) -> Result<(), CargoConfigModelError> {
        match (&mut self.kind, &mut incoming.kind) {
            (CargoConfigKind::List(current), CargoConfigKind::List(next)) => {
                if non_mergeable_list(path) {
                    if force {
                        std::mem::swap(self, &mut incoming);
                    }
                } else if force {
                    current.append(next);
                } else {
                    next.append(current);
                    std::mem::swap(current, next);
                }
            }
            (CargoConfigKind::Table(current), CargoConfigKind::Table(next)) => {
                for (key, value) in std::mem::take(next) {
                    match current.get_mut(&key) {
                        Some(existing) => {
                            path.push(key.clone());
                            let result = existing.merge(value, force, path);
                            path.pop();
                            result?;
                        }
                        None => {
                            current.insert(key, value);
                        }
                    }
                }
            }
            (CargoConfigKind::List(_) | CargoConfigKind::Table(_), _)
            | (_, CargoConfigKind::List(_) | CargoConfigKind::Table(_)) => {
                return Err(CargoConfigModelError::Invalid(format!(
                    "cannot merge {} and {} at {}",
                    self.description(),
                    incoming.description(),
                    display_key(path)
                )));
            }
            _ if force => std::mem::swap(self, &mut incoming),
            _ => {}
        }
        Ok(())
    }
}

#[derive(Debug)]
pub(crate) enum CargoConfigModelError {
    Io { path: PathBuf, reason: String },
    Invalid(String),
}

impl std::fmt::Display for CargoConfigModelError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io { path, reason } => write!(formatter, "{}: {reason}", path.display()),
            Self::Invalid(reason) => formatter.write_str(reason),
        }
    }
}

impl std::error::Error for CargoConfigModelError {}

fn io_error(path: &Path, error: impl std::fmt::Display) -> CargoConfigModelError {
    CargoConfigModelError::Io {
        path: path.to_owned(),
        reason: error.to_string(),
    }
}

fn display_key(path: &[String]) -> String {
    if path.is_empty() {
        "<root>".into()
    } else {
        path.join(".")
    }
}

fn key_matches(path: &[String], pattern: &[&str]) -> bool {
    path.len() == pattern.len()
        && path
            .iter()
            .zip(pattern)
            .all(|(actual, expected)| *expected == "*" || actual == expected)
}

fn non_mergeable_list(path: &[String]) -> bool {
    [
        &["credential-alias", "*"][..],
        &["doc", "browser"],
        &["host", "runner"],
        &["registries", "*", "credential-provider"],
        &["registry", "credential-provider"],
        &["target", "*", "runner"],
    ]
    .iter()
    .any(|pattern| key_matches(path, pattern))
}

#[derive(Debug, Clone)]
struct ConfigInclude {
    path: PathBuf,
    optional: bool,
    definition: CargoConfigDefinition,
}

fn includes(value: &mut CargoConfigValue) -> Result<Vec<ConfigInclude>, CargoConfigModelError> {
    let CargoConfigKind::Table(table) = &mut value.kind else {
        return Err(CargoConfigModelError::Invalid(
            "Cargo configuration root is not a table".into(),
        ));
    };
    let Some(include) = table.remove("include") else {
        return Ok(Vec::new());
    };
    let CargoConfigKind::List(items) = include.kind else {
        return Err(CargoConfigModelError::Invalid(format!(
            "expected an array at include, found {}",
            include.description()
        )));
    };
    items
        .into_iter()
        .enumerate()
        .map(|(index, item)| {
            let definition = item.definition.clone();
            let (path, optional) = match item.kind {
                CargoConfigKind::String(path) => (PathBuf::from(path), false),
                CargoConfigKind::Table(mut table) => {
                    let path = table.remove("path").ok_or_else(|| {
                        CargoConfigModelError::Invalid(format!("missing include[{index}].path"))
                    })?;
                    let CargoConfigKind::String(path) = path.kind else {
                        return Err(CargoConfigModelError::Invalid(format!(
                            "include[{index}].path is not a string"
                        )));
                    };
                    let optional = match table.remove("optional") {
                        None => false,
                        Some(CargoConfigValue {
                            kind: CargoConfigKind::Boolean(value),
                            ..
                        }) => value,
                        Some(_) => {
                            return Err(CargoConfigModelError::Invalid(format!(
                                "include[{index}].optional is not a boolean"
                            )));
                        }
                    };
                    (PathBuf::from(path), optional)
                }
                _ => {
                    return Err(CargoConfigModelError::Invalid(format!(
                        "include[{index}] is not a string or table"
                    )));
                }
            };
            if path.extension().and_then(|value| value.to_str()) != Some("toml") {
                return Err(CargoConfigModelError::Invalid(format!(
                    "config include path must end in .toml: {}",
                    path.display()
                )));
            }
            if path
                .to_str()
                .is_some_and(|value| value.contains(['*', '?', '[', ']', '{', '}']))
            {
                return Err(CargoConfigModelError::Invalid(format!(
                    "config include path cannot contain glob or template syntax: {}",
                    path.display()
                )));
            }
            Ok(ConfigInclude {
                path,
                optional,
                definition,
            })
        })
        .collect()
}

#[derive(Debug, Clone, Copy)]
enum LoadKind {
    File,
    Cli,
}

fn load_file(
    path: &Path,
    cwd: &Path,
    seen: &mut HashSet<PathBuf>,
    kind: LoadKind,
) -> Result<CargoConfigValue, CargoConfigModelError> {
    if !seen.insert(path.to_owned()) {
        return Err(CargoConfigModelError::Invalid(format!(
            "config include cycle detected at {}",
            path.display()
        )));
    }
    let contents = fs::read_to_string(path).map_err(|error| io_error(path, error))?;
    let parsed = toml::from_str(&contents)
        .map_err(|error| CargoConfigModelError::Invalid(format!("{}: {error}", path.display())))?;
    let definition = match kind {
        LoadKind::File => CargoConfigDefinition::File(path.to_owned()),
        LoadKind::Cli => CargoConfigDefinition::CliFile(path.to_owned()),
    };
    let mut value = CargoConfigValue::from_toml(parsed, &definition)?;
    let includes = includes(&mut value)?;
    let mut root = CargoConfigValue {
        kind: CargoConfigKind::Table(BTreeMap::new()),
        definition: definition.clone(),
    };
    for include in includes {
        let include_path = include.definition.include_root(cwd).join(&include.path);
        if include.optional && !include_path.exists() {
            continue;
        }
        let included = load_file(&include_path, cwd, seen, kind)?;
        root.merge(included, true, &mut Vec::new())?;
    }
    root.merge(value, true, &mut Vec::new())?;
    Ok(root)
}

fn has_non_whitespace(raw: Option<&toml_edit::RawString>) -> bool {
    raw.is_some_and(|value| !value.as_str().unwrap_or_default().trim().is_empty())
}

fn has_decor(decor: &toml_edit::Decor) -> bool {
    has_non_whitespace(decor.prefix()) || has_non_whitespace(decor.suffix())
}

fn validate_cli_dotted_key(argument: &str) -> Result<(), CargoConfigModelError> {
    let document: DocumentMut = argument.parse().map_err(|error| {
        CargoConfigModelError::Invalid(format!(
            "failed to parse --config argument {argument:?}: {error}"
        ))
    })?;
    let mut table = document.as_table();
    let mut root = true;
    while table.is_dotted() || root {
        root = false;
        if table.len() != 1 {
            break;
        }
        let (key, item) = table.iter().next().expect("one item");
        match item {
            Item::Table(next) => {
                let key_has_decor = table.key(key).is_some_and(|key| {
                    has_decor(key.leaf_decor()) || has_decor(key.dotted_decor())
                });
                if key_has_decor || has_decor(next.decor()) {
                    break;
                }
                table = next;
            }
            Item::Value(value) if value.is_inline_table() => break,
            Item::Value(value) => {
                let key_prefix = table
                    .key(key)
                    .is_some_and(|key| has_non_whitespace(key.leaf_decor().prefix()));
                if !key_prefix && !has_decor(value.decor()) {
                    return Ok(());
                }
                break;
            }
            Item::ArrayOfTables(_) | Item::None => break,
        }
    }
    Err(CargoConfigModelError::Invalid(format!(
        "--config argument {argument:?} is not one undecorated TOML dotted-key assignment"
    )))
}

fn load_cli_value(cwd: &Path, argument: &str) -> Result<CargoConfigValue, CargoConfigModelError> {
    validate_cli_dotted_key(argument)?;
    let parsed = toml::from_str(argument).map_err(|error| {
        CargoConfigModelError::Invalid(format!(
            "failed to parse --config argument {argument:?}: {error}"
        ))
    })?;
    reject_cli_secrets(&parsed)?;
    let mut value = CargoConfigValue::from_toml(parsed, &CargoConfigDefinition::CliValue)?;
    let include_values = includes(&mut value)?;
    let mut root = CargoConfigValue {
        kind: CargoConfigKind::Table(BTreeMap::new()),
        definition: CargoConfigDefinition::CliValue,
    };
    let mut seen = HashSet::new();
    for include in include_values {
        let path = include.definition.include_root(cwd).join(&include.path);
        if include.optional && !path.exists() {
            continue;
        }
        let included = load_file(&path, cwd, &mut seen, LoadKind::Cli)?;
        root.merge(included, true, &mut Vec::new())?;
    }
    root.merge(value, true, &mut Vec::new())?;
    Ok(root)
}

fn reject_cli_secrets(value: &toml::Value) -> Result<(), CargoConfigModelError> {
    let table_has = |value: Option<&toml::Value>, key: &str| {
        value
            .and_then(toml::Value::as_table)
            .is_some_and(|table| table.contains_key(key))
    };
    if table_has(value.get("registry"), "token") {
        return Err(CargoConfigModelError::Invalid(
            "registry.token cannot be set through --config for security reasons".into(),
        ));
    }
    if let Some((name, _)) = value
        .get("registries")
        .and_then(toml::Value::as_table)
        .and_then(|registries| {
            registries
                .iter()
                .find(|(_, registry)| table_has(Some(registry), "token"))
        })
    {
        return Err(CargoConfigModelError::Invalid(format!(
            "registries.{name}.token cannot be set through --config for security reasons"
        )));
    }
    if table_has(value.get("registry"), "secret-key") {
        return Err(CargoConfigModelError::Invalid(
            "registry.secret-key cannot be set through --config for security reasons".into(),
        ));
    }
    if let Some((name, _)) = value
        .get("registries")
        .and_then(toml::Value::as_table)
        .and_then(|registries| {
            registries
                .iter()
                .find(|(_, registry)| table_has(Some(registry), "secret-key"))
        })
    {
        return Err(CargoConfigModelError::Invalid(format!(
            "registries.{name}.secret-key cannot be set through --config for security reasons"
        )));
    }
    Ok(())
}

pub(crate) fn load_cargo_configuration(
    cwd: &Path,
    cargo_home: Option<PathBuf>,
    cli_arguments: &[String],
) -> Result<CargoConfigValue, CargoConfigModelError> {
    let mut root = CargoConfigValue::empty();
    for path in Walk::with_cargo_home(cwd, cargo_home) {
        let value = load_file(&path, cwd, &mut HashSet::new(), LoadKind::File)?;
        root.merge(value, false, &mut Vec::new())?;
    }
    let mut cli_seen = HashSet::new();
    for argument in cli_arguments {
        let candidate = cwd.join(argument);
        let value = if !argument.is_empty() && candidate.exists() {
            load_file(&candidate, cwd, &mut cli_seen, LoadKind::Cli)?
        } else {
            load_cli_value(cwd, argument)?
        };
        root.merge(value, true, &mut Vec::new())?;
    }
    Ok(root)
}

#[cfg(test)]
mod tests {
    use std::{
        sync::atomic::{AtomicU64, Ordering},
        time::{SystemTime, UNIX_EPOCH},
    };

    use super::*;

    static FIXTURE_ID: AtomicU64 = AtomicU64::new(0);

    fn fixture() -> PathBuf {
        let root = std::env::temp_dir().join(format!(
            "supercov-cargo-config-model-{}-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos(),
            FIXTURE_ID.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(root.join("project/.cargo")).unwrap();
        root
    }

    fn string(value: Option<&CargoConfigValue>) -> Option<&str> {
        let CargoConfigKind::String(value) = &value?.kind else {
            return None;
        };
        Some(value)
    }

    fn list(value: Option<&CargoConfigValue>) -> Vec<&str> {
        let CargoConfigKind::List(values) = &value.unwrap().kind else {
            panic!("expected list")
        };
        values
            .iter()
            .map(|value| {
                let CargoConfigKind::String(value) = &value.kind else {
                    panic!("expected string")
                };
                value.as_str()
            })
            .collect()
    }

    #[test]
    fn includes_merge_in_order_before_the_including_file() {
        let root = fixture();
        let project = root.join("project");
        fs::write(
            project.join(".cargo/first.toml"),
            "[target.host]\nrunner=[\"first\",\"--one\"]\n[build]\nrustflags=[\"first\"]\n",
        )
        .unwrap();
        fs::write(
            project.join(".cargo/second.toml"),
            "[target.host]\nrunner=[\"second\"]\n[build]\nrustflags=[\"second\"]\n",
        )
        .unwrap();
        fs::write(
            project.join(".cargo/config.toml"),
            concat!(
                "include=[\"first.toml\",\"second.toml\"]\n",
                "[target.host]\nrunner=[\"local\",\"--local\"]\n",
                "[build]\nrustflags=[\"local\"]\n",
            ),
        )
        .unwrap();
        let config = load_cargo_configuration(&project, None, &[]).unwrap();
        assert_eq!(
            list(config.at(&["target", "host", "runner"])),
            ["local", "--local"]
        );
        assert_eq!(
            list(config.at(&["build", "rustflags"])),
            ["first", "second", "local"]
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn nearest_file_wins_and_lower_priority_arrays_precede_it() {
        let root = fixture();
        let project = root.join("project");
        fs::create_dir_all(root.join(".cargo")).unwrap();
        fs::write(
            root.join(".cargo/config.toml"),
            "[target.host]\nrunner=\"parent\"\n[build]\nrustflags=[\"parent\"]\n",
        )
        .unwrap();
        fs::write(
            project.join(".cargo/config.toml"),
            "[target.host]\nrunner=\"project\"\n[build]\nrustflags=[\"project\"]\n",
        )
        .unwrap();
        let config = load_cargo_configuration(&project, None, &[]).unwrap();
        assert_eq!(
            string(config.at(&["target", "host", "runner"])),
            Some("project")
        );
        assert_eq!(
            list(config.at(&["build", "rustflags"])),
            ["parent", "project"]
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cli_files_and_dotted_values_override_in_command_order() {
        let root = fixture();
        let project = root.join("project");
        fs::write(
            project.join("override.toml"),
            "[target.host]\nrunner=[\"file\",\"--file\"]\n",
        )
        .unwrap();
        fs::write(
            project.join(".cargo/config.toml"),
            "[target.host]\nrunner=[\"base\"]\n",
        )
        .unwrap();
        let config = load_cargo_configuration(
            &project,
            None,
            &[
                "override.toml".into(),
                "target.host.runner=[\"inline\",\"--inline\"]".into(),
            ],
        )
        .unwrap();
        assert_eq!(
            list(config.at(&["target", "host", "runner"])),
            ["inline", "--inline"]
        );
        assert_eq!(
            config.at(&["target", "host", "runner"]).unwrap().definition,
            CargoConfigDefinition::CliValue
        );
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn optional_missing_include_is_ignored_but_cycles_and_bad_cli_are_rejected() {
        let root = fixture();
        let project = root.join("project");
        fs::write(
            project.join(".cargo/config.toml"),
            "include=[{path=\"missing.toml\",optional=true}]\n",
        )
        .unwrap();
        load_cargo_configuration(&project, None, &[]).unwrap();
        fs::write(
            project.join(".cargo/config.toml"),
            "include=[\"cycle.toml\"]\n",
        )
        .unwrap();
        fs::write(
            project.join(".cargo/cycle.toml"),
            "include=[\"config.toml\"]\n",
        )
        .unwrap();
        assert!(
            load_cargo_configuration(&project, None, &[])
                .unwrap_err()
                .to_string()
                .contains("cycle")
        );
        fs::write(project.join(".cargo/config.toml"), "").unwrap();
        assert!(
            load_cargo_configuration(
                &project,
                None,
                &["target.host.runner='one' # decoration".into()]
            )
            .unwrap_err()
            .to_string()
            .contains("dotted-key")
        );
        fs::write(
            project.join("duplicate.toml"),
            "[target.host]\nrunner='duplicate'\n",
        )
        .unwrap();
        assert!(
            load_cargo_configuration(
                &project,
                None,
                &["include=['duplicate.toml','duplicate.toml']".into()]
            )
            .unwrap_err()
            .to_string()
            .contains("cycle")
        );
        assert_eq!(
            load_cargo_configuration(&project, None, &["registry.token='not-allowed'".into()])
                .unwrap_err()
                .to_string(),
            "registry.token cannot be set through --config for security reasons"
        );
        assert_eq!(
            load_cargo_configuration(
                &project,
                None,
                &["registries.private.secret-key='not-allowed'".into()]
            )
            .unwrap_err()
            .to_string(),
            "registries.private.secret-key cannot be set through --config for security reasons"
        );
        fs::remove_dir_all(root).unwrap();
    }
}

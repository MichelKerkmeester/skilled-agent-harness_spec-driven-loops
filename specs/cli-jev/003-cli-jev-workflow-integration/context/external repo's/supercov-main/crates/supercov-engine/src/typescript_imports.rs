//! Conservative import-elision policy for the supported tsc/tsx/ts-node path.
//! Unknown loaders, config resolution and emit overrides retain runtime obligations.
use crate::source_discovery::{strip_jsonc_comments, strip_trailing_commas};
use serde_json::{Map, Value};
use std::{
    collections::BTreeSet,
    fs,
    path::{Path, PathBuf},
};

fn json(path: &Path) -> Option<Value> {
    let text = fs::read_to_string(path).ok()?;
    serde_json::from_str(&strip_trailing_commas(&strip_jsonc_comments(&text))).ok()
}

fn options(root: &Path, path: &Path, seen: &mut BTreeSet<PathBuf>) -> Option<Map<String, Value>> {
    let path = fs::canonicalize(path).ok()?;
    if !path.starts_with(root) {
        return None;
    }
    if !seen.insert(path.clone()) || seen.len() > 32 {
        return None;
    }
    let config = json(&path)?;
    let mut result = Map::new();
    if let Some(extends) = config.get("extends") {
        let parents = match extends {
            Value::String(s) => vec![s.as_str()],
            Value::Array(a) => a.iter().map(Value::as_str).collect::<Option<Vec<_>>>()?,
            _ => return None,
        };
        for parent in parents {
            // Package-based and external config chains are deliberately not
            // guessed. They can keep imports alive through inherited settings.
            if !parent.starts_with('.') {
                return None;
            }
            let mut parent = path.parent()?.join(parent);
            if parent.extension().is_none() {
                parent.set_extension("json");
            }
            result.extend(options(root, &parent, seen)?);
        }
    }
    if let Some(local) = config.get("compilerOptions") {
        result.extend(local.as_object()?.clone());
    }
    seen.remove(&path);
    Some(result)
}

fn expanded_command(root: &Path, command: &[String]) -> String {
    let mut result = command.join(" ");
    // Expand only scripts actually named by the command. Other build tools in
    // package.json are not evidence about the compiler used by this run.
    if matches!(
        command.first().map(String::as_str),
        Some("npm" | "pnpm" | "yarn")
    ) && let Some(scripts) =
        json(&root.join("package.json")).and_then(|v| v.get("scripts").cloned())
    {
        for arg in command.iter().skip(1) {
            if let Some(script) = scripts.get(arg).and_then(Value::as_str) {
                result.push('\n');
                result.push_str(script);
            }
        }
    }
    result
}

/// Include relative base configs in the normal run fingerprint, even when a
/// base is named `base.json` rather than `tsconfig.*.json`.
pub(crate) fn config_paths(root: &Path, files: &[String]) -> BTreeSet<PathBuf> {
    fn add(root: &Path, path: PathBuf, paths: &mut BTreeSet<PathBuf>) {
        let Ok(path) = fs::canonicalize(path) else {
            return;
        };
        if !path.starts_with(root) || paths.len() > 256 || !paths.insert(path.clone()) {
            return;
        }
        if let Some(config) = json(&path) {
            let parents = match config.get("extends") {
                Some(Value::String(s)) => vec![s.as_str()],
                Some(Value::Array(a)) => a.iter().filter_map(Value::as_str).collect(),
                _ => Vec::new(),
            };
            for parent in parents.into_iter().filter(|p| p.starts_with('.')) {
                let mut parent = path.parent().unwrap().join(parent);
                if parent.extension().is_none() {
                    parent.set_extension("json");
                }
                add(root, parent, paths);
            }
        }
    }
    let root = fs::canonicalize(root).unwrap_or_else(|_| root.to_owned());
    let mut paths = BTreeSet::new();
    for file in files {
        let path = root.join(file);
        for parent in path
            .ancestors()
            .skip(1)
            .take_while(|p| p.starts_with(&root))
        {
            // Named root build configs can be selected with `tsc -p`. Include
            // their local bases too, even when those bases have arbitrary names.
            if let Ok(entries) = fs::read_dir(parent) {
                for entry in entries.flatten() {
                    let name = entry.file_name();
                    let name = name.to_string_lossy();
                    if name.starts_with("tsconfig") && name.ends_with(".json") {
                        add(&root, entry.path(), &mut paths);
                    }
                }
            }
        }
    }
    paths
}

pub(crate) fn elides_type_imports(
    root: &Path,
    file: &str,
    command: &[String],
    build: &[String],
) -> bool {
    let root_path = fs::canonicalize(root).unwrap_or_else(|_| root.to_owned());
    let root = root_path.as_path();
    let commands = [
        expanded_command(root, command),
        expanded_command(root, build),
    ];
    let text = commands.join(" ");
    let tokens = text
        .split(|c: char| !(c.is_alphanumeric() || matches!(c, '-' | '_' | '.')))
        .collect::<Vec<_>>();
    // A compiler name in an arbitrary argument is not evidence of execution.
    // Recognize direct invocations and Node's explicit TS loader options.
    let recognized = commands.iter().any(|command| {
        command.split(['\n', ';', '&', '|']).any(|part| {
            let words = part.split_whitespace().collect::<Vec<_>>();
            let executable = words
                .first()
                .and_then(|s| Path::new(s).file_name())
                .and_then(|s| s.to_str());
            matches!(executable, Some("tsc" | "tsx" | "ts-node"))
                || (executable == Some("node")
                    && words.iter().enumerate().any(|(i, word)| {
                        matches!(
                            *word,
                            "--import=tsx"
                                | "--loader=ts-node/esm"
                                | "--experimental-loader=ts-node/esm"
                        ) || (matches!(*word, "--import" | "--loader" | "--experimental-loader")
                            && words
                                .get(i + 1)
                                .is_some_and(|s| matches!(*s, "tsx" | "ts-node/esm")))
                    }))
        })
    });
    if !recognized {
        return false;
    }
    let mut explicit_configs = Vec::new();
    for command in &commands {
        let words = command.split_whitespace().collect::<Vec<_>>();
        for (index, word) in words.iter().enumerate() {
            let value = if matches!(*word, "-p" | "--project" | "--tsconfig") {
                let Some(value) = words.get(index + 1) else {
                    return false;
                };
                Some(*value)
            } else {
                word.strip_prefix("--project=")
                    .or_else(|| word.strip_prefix("--tsconfig="))
                    .or_else(|| word.strip_prefix("-p="))
            };
            if let Some(value) = value {
                let path = root.join(value);
                let Ok(path) = fs::canonicalize(path) else {
                    return false;
                };
                // Root-local named tsconfigs are included in the input fingerprint.
                // Other explicit config layouts remain conservative for now.
                let name = path.file_name().and_then(|s| s.to_str()).unwrap_or("");
                if path.parent() != Some(root)
                    || !name.starts_with("tsconfig")
                    || !name.ends_with(".json")
                {
                    return false;
                }
                explicit_configs.push(path);
            } else if word.starts_with("-p") && !word.starts_with("--") {
                return false;
            }
        }
    }
    // CLI/environment overrides may select a different config or import policy.
    if [
        "--verbatimModuleSyntax",
        "--preserveValueImports",
        "--importsNotUsedAsValues",
        "--emitDecoratorMetadata",
        "--compilerOptions",
        "--compiler-options",
    ]
    .iter()
    .any(|s| text.contains(s))
        || [
            "TS_NODE_COMPILER_OPTIONS",
            "TS_NODE_PROJECT",
            "TSX_TSCONFIG_PATH",
        ]
        .iter()
        .any(|s| std::env::var_os(s).is_some())
    {
        return false;
    }
    // A recognized transpiler is not sufficient if the same command also
    // invokes a custom bundler/loader with independently controlled emit.
    if tokens.iter().any(|s| {
        matches!(
            *s,
            "swc" | "babel" | "webpack" | "vite" | "vitest" | "esbuild"
        )
    }) {
        return false;
    }
    let permits_elision = |path: &Path| {
        let Some(opts) = options(root, path, &mut BTreeSet::new()) else {
            return false;
        };
        [
            "verbatimModuleSyntax",
            "preserveValueImports",
            "emitDecoratorMetadata",
        ]
        .iter()
        .all(|key| opts.get(*key).is_none_or(|v| v == &Value::Bool(false)))
            && opts
                .get("importsNotUsedAsValues")
                .is_none_or(|v| v == "remove")
    };
    if !explicit_configs.iter().all(|path| permits_elision(path)) {
        return false;
    }
    let mut directory = root.join(file).parent().map(Path::to_path_buf);
    while let Some(dir) = directory {
        if !dir.starts_with(root) {
            break;
        }
        let config = dir.join("tsconfig.json");
        if config.exists() {
            return permits_elision(&config);
        }
        directory = dir.parent().map(Path::to_path_buf);
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn config_chain_preservation_overrides_and_unknowns_fail_closed() {
        let root = std::env::temp_dir().join(format!("supercov-imports-{}", std::process::id()));
        fs::create_dir_all(root.join("src")).unwrap();
        let command = vec!["node".into(), "--import".into(), "tsx".into()];
        fs::write(
            root.join("base.json"),
            r#"{"compilerOptions":{"verbatimModuleSyntax":true}}"#,
        )
        .unwrap();
        for (config, expected) in [
            (
                r#"{/* default */ "compilerOptions": {"strict":true,},}"#,
                true,
            ),
            (r#"{"extends":"./base.json"}"#, false),
            (
                r#"{"extends":"./base.json","compilerOptions":{"verbatimModuleSyntax":false}}"#,
                true,
            ),
            (r#"{"extends":"@project/config"}"#, false),
            (
                r#"{"compilerOptions":{"emitDecoratorMetadata":true}}"#,
                false,
            ),
            (r#"{"extends":"./tsconfig.json"}"#, false),
        ] {
            fs::write(root.join("tsconfig.json"), config).unwrap();
            assert_eq!(
                elides_type_imports(&root, "src/main.ts", &command, &[]),
                expected,
                "{config}"
            );
        }
        fs::write(root.join("tsconfig.json"), "{}").unwrap();
        assert!(!elides_type_imports(
            &root,
            "src/main.ts",
            &["node".into(), "--experimental-strip-types".into()],
            &[]
        ));
        assert!(!elides_type_imports(
            &root,
            "src/main.ts",
            &["tsx".into(), "--tsconfig".into(), "other.json".into()],
            &[]
        ));
        fs::write(
            root.join("tsconfig.build.json"),
            r#"{"extends":"./tsconfig.json"}"#,
        )
        .unwrap();
        let build = vec!["tsc".into(), "-p".into(), "tsconfig.build.json".into()];
        assert!(elides_type_imports(&root, "src/main.ts", &command, &build));
        fs::write(
            root.join("tsconfig.build.json"),
            r#"{"extends":"./base.json"}"#,
        )
        .unwrap();
        assert!(!elides_type_imports(&root, "src/main.ts", &command, &build));
        assert!(
            config_paths(&root, &["src/main.ts".into()])
                .contains(&fs::canonicalize(root.join("base.json")).unwrap())
        );
        assert!(!elides_type_imports(
            &root,
            "src/main.ts",
            &["node".into(), "script.js".into(), "tsx".into()],
            &[]
        ));
        fs::remove_dir_all(root).unwrap();
    }
}

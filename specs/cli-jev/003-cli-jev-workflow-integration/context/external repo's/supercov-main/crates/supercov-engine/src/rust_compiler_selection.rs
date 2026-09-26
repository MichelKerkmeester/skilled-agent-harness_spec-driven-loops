use std::{
    env, fs,
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use supercov_contracts::{
    RustCompilerCompanionError, RustCompilerCompanionHandshake, RustCompilerIdentity,
    require_matching_rust_compiler_companion,
};

#[derive(Debug)]
pub enum RustCompilerSelectionError {
    Io {
        operation: &'static str,
        path: PathBuf,
        source: std::io::Error,
    },
    CommandFailed {
        program: PathBuf,
        operation: &'static str,
        status: Option<i32>,
    },
    UnexpectedStderr {
        program: PathBuf,
        operation: &'static str,
    },
    NonUtf8Output {
        program: PathBuf,
        operation: &'static str,
    },
    InvalidRustcVerbose(String),
    RustdocCompilerMismatch {
        path: PathBuf,
    },
    InvalidSysroot(String),
    InvalidDriverDirectory {
        path: PathBuf,
        count: usize,
    },
    NonRegularFile(PathBuf),
    MalformedHandshake {
        path: PathBuf,
        reason: String,
    },
    InvalidHandshake {
        path: PathBuf,
        source: RustCompilerCompanionError,
    },
    CompanionBuildIdMismatch {
        path: PathBuf,
    },
    NoMatchingCompanion,
    MultipleMatchingCompanions(Vec<PathBuf>),
}

impl std::fmt::Display for RustCompilerSelectionError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io {
                operation,
                path,
                source,
            } => {
                write!(
                    formatter,
                    "could not {operation} {}: {source}",
                    path.display()
                )
            }
            Self::CommandFailed {
                program,
                operation,
                status,
            } => write!(
                formatter,
                "{} failed while {operation} with status {}",
                program.display(),
                status.map_or_else(|| "signal".into(), |value| value.to_string())
            ),
            Self::UnexpectedStderr { program, operation } => write!(
                formatter,
                "{} wrote unexpected stderr while {operation}",
                program.display()
            ),
            Self::NonUtf8Output { program, operation } => write!(
                formatter,
                "{} produced non-UTF-8 output while {operation}",
                program.display()
            ),
            Self::InvalidRustcVerbose(reason) => {
                write!(formatter, "invalid rustc -vV output: {reason}")
            }
            Self::RustdocCompilerMismatch { path } => write!(
                formatter,
                "rustdoc {} does not match Cargo's exact rustc commit, release and host",
                path.display()
            ),
            Self::InvalidSysroot(reason) => write!(formatter, "invalid rustc sysroot: {reason}"),
            Self::InvalidDriverDirectory { path, count } => write!(
                formatter,
                "expected exactly one rustc driver in {}, found {count}",
                path.display()
            ),
            Self::NonRegularFile(path) => {
                write!(
                    formatter,
                    "expected a non-symlink regular file: {}",
                    path.display()
                )
            }
            Self::MalformedHandshake { path, reason } => write!(
                formatter,
                "invalid compiler companion handshake from {}: {reason}",
                path.display()
            ),
            Self::InvalidHandshake { path, source } => write!(
                formatter,
                "compiler companion {} was rejected: {source}",
                path.display()
            ),
            Self::CompanionBuildIdMismatch { path } => write!(
                formatter,
                "compiler companion {} reported a build ID that does not match its bytes",
                path.display()
            ),
            Self::NoMatchingCompanion => {
                formatter.write_str("no exact compiler companion matches the selected rustc")
            }
            Self::MultipleMatchingCompanions(paths) => write!(
                formatter,
                "multiple exact compiler companions match the selected rustc: {}",
                paths
                    .iter()
                    .map(|path| path.display().to_string())
                    .collect::<Vec<_>>()
                    .join(", ")
            ),
        }
    }
}

impl std::error::Error for RustCompilerSelectionError {}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SelectedRustCompilerCompanion {
    pub rustc_path: PathBuf,
    pub compiler_library_directory: PathBuf,
    pub companion_path: PathBuf,
    pub compiler: RustCompilerIdentity,
    pub handshake: RustCompilerCompanionHandshake,
}

fn resolve_program(program: &Path) -> Result<PathBuf, RustCompilerSelectionError> {
    let has_parent = program
        .parent()
        .is_some_and(|parent| !parent.as_os_str().is_empty());
    let candidate = if program.is_absolute() || has_parent {
        if program.is_absolute() {
            program.to_path_buf()
        } else {
            env::current_dir()
                .map_err(io_error("resolve current directory for", program))?
                .join(program)
        }
    } else {
        let path = env::var_os("PATH").ok_or_else(|| {
            RustCompilerSelectionError::InvalidSysroot(
                "PATH is unavailable while resolving rustc".into(),
            )
        })?;
        env::split_paths(&path)
            .map(|directory| directory.join(program))
            .find(|candidate| {
                fs::symlink_metadata(candidate).is_ok_and(|metadata| {
                    metadata.file_type().is_file() || metadata.file_type().is_symlink()
                })
            })
            .ok_or_else(|| RustCompilerSelectionError::Io {
                operation: "resolve executable",
                path: program.to_path_buf(),
                source: std::io::Error::new(std::io::ErrorKind::NotFound, "not found on PATH"),
            })?
    };
    let metadata =
        fs::symlink_metadata(&candidate).map_err(io_error("inspect executable", &candidate))?;
    if !metadata.file_type().is_file() && !metadata.file_type().is_symlink() {
        return Err(RustCompilerSelectionError::NonRegularFile(candidate));
    }
    Ok(candidate)
}

pub fn configure_companion_loader_environment(
    command: &mut Command,
    compiler_library_directory: &Path,
) -> Result<(), RustCompilerSelectionError> {
    let variable = if cfg!(target_os = "macos") {
        "DYLD_LIBRARY_PATH"
    } else if cfg!(windows) {
        "PATH"
    } else {
        "LD_LIBRARY_PATH"
    };
    let mut paths = vec![compiler_library_directory.to_path_buf()];
    if let Some(current) = env::var_os(variable) {
        paths.extend(env::split_paths(&current));
    }
    let paths = env::join_paths(paths).map_err(|source| {
        RustCompilerSelectionError::InvalidSysroot(format!(
            "could not construct {variable}: {source}"
        ))
    })?;
    command.env(variable, paths);
    Ok(())
}

fn io_error(
    operation: &'static str,
    path: &Path,
) -> impl FnOnce(std::io::Error) -> RustCompilerSelectionError {
    let path = path.to_path_buf();
    move |source| RustCompilerSelectionError::Io {
        operation,
        path,
        source,
    }
}

fn sha256_file(path: &Path) -> Result<String, RustCompilerSelectionError> {
    let metadata = fs::symlink_metadata(path).map_err(io_error("inspect", path))?;
    if !metadata.file_type().is_file() {
        return Err(RustCompilerSelectionError::NonRegularFile(
            path.to_path_buf(),
        ));
    }
    let bytes = fs::read(path).map_err(io_error("read", path))?;
    Ok(format!("{:x}", Sha256::digest(bytes)))
}

fn command_output(
    program: &Path,
    args: &[&str],
    operation: &'static str,
    require_empty_stderr: bool,
    compiler_library_directory: Option<&Path>,
) -> Result<Vec<u8>, RustCompilerSelectionError> {
    let mut command = Command::new(program);
    command.args(args).stdin(Stdio::null());
    if let Some(directory) = compiler_library_directory {
        configure_companion_loader_environment(&mut command, directory)?;
    }
    let output = command.output().map_err(io_error("execute", program))?;
    if !output.status.success() {
        return Err(RustCompilerSelectionError::CommandFailed {
            program: program.to_path_buf(),
            operation,
            status: output.status.code(),
        });
    }
    if require_empty_stderr && !output.stderr.is_empty() {
        return Err(RustCompilerSelectionError::UnexpectedStderr {
            program: program.to_path_buf(),
            operation,
        });
    }
    Ok(output.stdout)
}

fn unique_verbose_field(
    verbose: &str,
    prefix: &'static str,
) -> Result<String, RustCompilerSelectionError> {
    let values = verbose
        .lines()
        .filter_map(|line| line.strip_prefix(prefix).map(str::trim))
        .collect::<Vec<_>>();
    let [value] = values.as_slice() else {
        return Err(RustCompilerSelectionError::InvalidRustcVerbose(format!(
            "expected one {prefix} field, found {}",
            values.len()
        )));
    };
    if value.is_empty() {
        return Err(RustCompilerSelectionError::InvalidRustcVerbose(format!(
            "{prefix} field was empty"
        )));
    }
    Ok((*value).to_owned())
}

fn parse_rustc_verbose(
    verbose: &[u8],
) -> Result<(String, String, String), RustCompilerSelectionError> {
    let verbose =
        std::str::from_utf8(verbose).map_err(|_| RustCompilerSelectionError::NonUtf8Output {
            program: PathBuf::from("rustc"),
            operation: "inspecting compiler identity",
        })?;
    Ok((
        unique_verbose_field(verbose, "commit-hash:")?,
        unique_verbose_field(verbose, "release:")?,
        unique_verbose_field(verbose, "host:")?,
    ))
}

fn driver_file(directory: &Path) -> Result<PathBuf, RustCompilerSelectionError> {
    let entries =
        fs::read_dir(directory).map_err(io_error("read rustc driver directory", directory))?;
    let mut drivers = entries
        .map(|entry| {
            entry
                .map(|entry| entry.path())
                .map_err(io_error("read rustc driver entry", directory))
        })
        .collect::<Result<Vec<_>, _>>()?;
    drivers.retain(|path| {
        path.file_name()
            .and_then(|name| name.to_str())
            .is_some_and(|name| {
                name.starts_with("librustc_driver-")
                    && matches!(
                        path.extension().and_then(|extension| extension.to_str()),
                        Some("so" | "dylib")
                    )
            })
    });
    drivers.sort();
    drivers.dedup();
    let [driver] = drivers.as_slice() else {
        return Err(RustCompilerSelectionError::InvalidDriverDirectory {
            path: directory.to_path_buf(),
            count: drivers.len(),
        });
    };
    Ok(driver.clone())
}

struct ProbedRustc {
    identity: RustCompilerIdentity,
    driver_directory: PathBuf,
}

fn probe_rustc(rustc_path: &Path) -> Result<ProbedRustc, RustCompilerSelectionError> {
    let rustc_path = resolve_program(rustc_path)?;
    let verbose = command_output(
        &rustc_path,
        &["-vV"],
        "inspecting compiler identity",
        false,
        None,
    )?;
    let (rustc_commit_hash, rustc_release, host_triple) = parse_rustc_verbose(&verbose)?;
    let sysroot = command_output(
        &rustc_path,
        &["--print", "sysroot"],
        "inspecting compiler sysroot",
        false,
        None,
    )?;
    let sysroot =
        std::str::from_utf8(&sysroot).map_err(|_| RustCompilerSelectionError::NonUtf8Output {
            program: rustc_path.clone(),
            operation: "inspecting compiler sysroot",
        })?;
    let sysroot = sysroot.trim();
    if sysroot.is_empty() || sysroot.lines().count() != 1 {
        return Err(RustCompilerSelectionError::InvalidSysroot(
            "expected one non-empty path".into(),
        ));
    }
    let directory = Path::new(sysroot)
        .join("lib/rustlib")
        .join(&host_triple)
        .join("lib");
    let driver = driver_file(&directory)?;
    let rustc_driver_sha256 = sha256_file(&driver)?;
    Ok(ProbedRustc {
        identity: RustCompilerIdentity {
            rustc_commit_hash,
            rustc_release,
            host_triple,
            rustc_driver_sha256,
        },
        driver_directory: directory,
    })
}

pub fn probe_rustc_identity(
    rustc_path: &Path,
) -> Result<RustCompilerIdentity, RustCompilerSelectionError> {
    Ok(probe_rustc(rustc_path)?.identity)
}

/// Resolve the rustdoc executable adjacent to Cargo's exact rustc and require
/// the same compiler commit, release and host. Rustdoc intentionally has no
/// independent driver digest; the already-authenticated companion remains
/// bound to rustc's exact driver bytes.
pub fn resolve_matching_rustdoc(
    selection: &SelectedRustCompilerCompanion,
) -> Result<PathBuf, RustCompilerSelectionError> {
    #[cfg(windows)]
    let executable = "rustdoc.exe";
    #[cfg(not(windows))]
    let executable = "rustdoc";
    let rustdoc = resolve_program(&selection.rustc_path.with_file_name(executable))?;
    let verbose = command_output(
        &rustdoc,
        &["-vV"],
        "inspecting rustdoc identity",
        false,
        None,
    )?;
    let (commit, release, host) = parse_rustc_verbose(&verbose)?;
    if commit != selection.compiler.rustc_commit_hash
        || release != selection.compiler.rustc_release
        || host != selection.compiler.host_triple
    {
        return Err(RustCompilerSelectionError::RustdocCompilerMismatch { path: rustdoc });
    }
    Ok(rustdoc)
}

fn inspect_candidate(
    path: &Path,
    compiler: &RustCompilerIdentity,
    compiler_library_directory: &Path,
    require_public_capabilities: bool,
) -> Result<Option<(PathBuf, RustCompilerCompanionHandshake)>, RustCompilerSelectionError> {
    let path = fs::canonicalize(path).map_err(io_error("resolve compiler companion", path))?;
    let build_id = sha256_file(&path)?;
    let output = command_output(
        &path,
        &["--supercov-handshake"],
        "reading compiler companion handshake",
        true,
        Some(compiler_library_directory),
    )?;
    let handshake: RustCompilerCompanionHandshake =
        serde_json::from_slice(&output).map_err(|error| {
            RustCompilerSelectionError::MalformedHandshake {
                path: path.clone(),
                reason: error.to_string(),
            }
        })?;
    if handshake.companion_build_id != build_id {
        return Err(RustCompilerSelectionError::CompanionBuildIdMismatch { path });
    }
    match require_matching_rust_compiler_companion(
        &handshake,
        compiler,
        require_public_capabilities,
    ) {
        Ok(()) => Ok(Some((path, handshake))),
        Err(RustCompilerCompanionError::CompilerMismatch) => Ok(None),
        Err(source) => Err(RustCompilerSelectionError::InvalidHandshake { path, source }),
    }
}

pub fn select_rust_compiler_companion(
    rustc_path: &Path,
    candidates: &[PathBuf],
    require_public_capabilities: bool,
) -> Result<SelectedRustCompilerCompanion, RustCompilerSelectionError> {
    let rustc_path = resolve_program(rustc_path)?;
    let probed = probe_rustc(&rustc_path)?;
    let compiler = probed.identity;
    let mut matches = Vec::new();
    for candidate in candidates {
        if let Some(candidate) = inspect_candidate(
            candidate,
            &compiler,
            &probed.driver_directory,
            require_public_capabilities,
        )? {
            matches.push(candidate);
        }
    }
    match matches.as_slice() {
        [] => Err(RustCompilerSelectionError::NoMatchingCompanion),
        [(companion_path, handshake)] => Ok(SelectedRustCompilerCompanion {
            rustc_path,
            compiler_library_directory: probed.driver_directory,
            companion_path: companion_path.clone(),
            compiler,
            handshake: handshake.clone(),
        }),
        _ => Err(RustCompilerSelectionError::MultipleMatchingCompanions(
            matches.into_iter().map(|(path, _)| path).collect(),
        )),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use supercov_contracts::RustCompilerCompanionCapabilities;

    fn identity() -> RustCompilerIdentity {
        RustCompilerIdentity {
            rustc_commit_hash: "a".repeat(40),
            rustc_release: "1.95.0".into(),
            host_triple: "aarch64-apple-darwin".into(),
            rustc_driver_sha256: "b".repeat(64),
        }
    }

    fn handshake() -> RustCompilerCompanionHandshake {
        RustCompilerCompanionHandshake {
            protocol_version: 1,
            frontend_id: "rust".into(),
            coverage_model_variant: "rust-source-v1".into(),
            evidence_schema_version: 3,
            companion_build_id: "c".repeat(64),
            compiler: identity(),
            capabilities: RustCompilerCompanionCapabilities {
                expanded_hir_provenance: true,
                runtime_mir_probe_insertion: true,
                generated_source_provenance: true,
                ctfe_path_tracing: false,
                rustdoc_doctest_tracing: false,
                exact_test_harness_attribution: true,
            },
        }
    }

    #[test]
    fn verbose_identity_requires_exactly_one_of_each_field() {
        assert_eq!(
            parse_rustc_verbose(
                b"rustc 1.95.0\nbinary: rustc\ncommit-hash: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\ncommit-date: 2026-01-01\nhost: aarch64-apple-darwin\nrelease: 1.95.0\nLLVM version: 22.0.0\n"
            )
            .unwrap(),
            (
                "a".repeat(40),
                "1.95.0".into(),
                "aarch64-apple-darwin".into()
            )
        );
        assert!(parse_rustc_verbose(b"commit-hash: a\nrelease: x\n").is_err());
        assert!(
            parse_rustc_verbose(b"commit-hash: a\ncommit-hash: b\nrelease: x\nhost: y\n").is_err()
        );
    }

    #[test]
    fn public_readiness_is_not_inferred_from_partial_private_capabilities() {
        let handshake = handshake();
        require_matching_rust_compiler_companion(&handshake, &identity(), false).unwrap();
        assert!(require_matching_rust_compiler_companion(&handshake, &identity(), true).is_err());
    }
}

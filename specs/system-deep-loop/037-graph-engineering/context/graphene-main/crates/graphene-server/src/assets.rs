//! The UI, compiled into the binary.
//!
//! One file to ship, no npm, and **no network at build or runtime** — which is
//! also why the DAG layout is hand-written rather than pulled from a package.

use axum::extract::Path;
use axum::http::{header, StatusCode};
use axum::response::{IntoResponse, Response};
use rust_embed::Embed;

#[derive(Embed)]
#[folder = "$CARGO_MANIFEST_DIR/../../ui/"]
struct Ui;

pub(crate) async fn index() -> Response {
    serve("index.html")
}

pub(crate) async fn asset(Path(path): Path<String>) -> Response {
    serve(&path)
}

fn serve(path: &str) -> Response {
    match Ui::get(path) {
        Some(file) => {
            let mime = mime_guess::from_path(path).first_or_octet_stream();
            ([(header::CONTENT_TYPE, mime.as_ref())], file.data.into_owned()).into_response()
        }
        None => (StatusCode::NOT_FOUND, "not found").into_response(),
    }
}

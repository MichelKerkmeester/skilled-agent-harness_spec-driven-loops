fn main() {
    flatbuffers_build::BuilderOptions::new_with_files(["schema/query_index.fbs"])
        .compile()
        .expect("query-index FlatBuffers schema must compile");
}

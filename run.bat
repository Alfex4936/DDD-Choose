@echo off

call wasm-pack build --release --target web && npx http-server . --cors

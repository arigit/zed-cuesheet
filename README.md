# CUE Sheet for Zed

Support for [CUE sheets](https://en.wikipedia.org/wiki/Cue_sheet_(computing)) (`.cue`) in the [Zed](https://zed.dev) editor — the metadata files that describe the track layout of an audio CD rip or disc image.

Inspired by [vscode-cuesheet](https://github.com/zgracem/vscode-cuesheet).

## Features

- **Syntax highlighting** for all commands (`FILE`, `TRACK`, `INDEX`, `TITLE`, `PERFORMER`, `SONGWRITER`, `FLAGS`, `ISRC`, `CATALOG`, `CDTEXTFILE`, `PREGAP`, `POSTGAP`), file types, track modes, flags and `mm:ss:ff` timestamps
- **`REM` handling**: `REM GENRE "Rock"`, `REM DATE 1999`, `REM REPLAYGAIN_TRACK_GAIN -7.20 dB` etc. are shown as metadata; any other `REM` line is shown as a comment
- **Outline panel / symbol search** (`cmd-shift-o` / `ctrl-shift-o`): files and tracks, labelled with track number and title
- **Structure-aware editing**: auto-indent inside `FILE`/`TRACK` blocks, indentation-based folding, Vim text objects (`af` = track, `ac` = file), toggle comment (`REM `)
- **Snippets**: `new`, `newfiles`, `track`, `trackgap`, every command keyword, and common `REM` fields (`GENRE`, `DATE`, `DISCID`, `COMMENT`, `DISCNUMBER`, `REPLAYGAIN_*`)
- Tolerant parsing: lower-case keywords, UTF-8 BOM, CRLF line endings, missing trailing newline, and EAC-style sheets where a `FILE` appears inside a track

## Installation

### From source (dev extension)

1. Clone this repository:
   ```sh
   git clone https://github.com/arigit/zed-cuesheet.git
   ```
2. In Zed, open the command palette and run **`zed: install dev extension`**.
3. Select the cloned `zed-cuesheet` directory.

Zed downloads the grammar at the commit pinned in `extension.toml`, compiles it to WebAssembly and loads the extension. Open any `.cue` file to try it.

> **Note:** `.cue` is also the extension used by the [CUE configuration language](https://cuelang.org). If you have the CUE language extension installed as well, pick the language per project in your settings:
>
> ```json
> { "file_types": { "CUE Sheet": ["*.cue"] } }
> ```

## Repository layout

| Path | Contents |
| --- | --- |
| `extension.toml` | Extension manifest |
| `languages/cuesheet/` | Language config and Tree-sitter queries (highlights, outline, indents, brackets, text objects) |
| `snippets/cue sheet.json` | Snippets |
| `tree-sitter-cuesheet/` | The Tree-sitter grammar (`grammar.js`, external scanner, generated parser, tests) |
| `examples/` | Sample CUE sheets |

## Developing the grammar

```sh
cd tree-sitter-cuesheet
npx tree-sitter-cli@0.26 generate   # regenerate src/parser.c after editing grammar.js
npx tree-sitter-cli@0.26 test       # run the corpus tests
npx tree-sitter-cli@0.26 parse ../examples/album.cue
```

Zed builds the grammar from a pinned commit, so after changing the grammar, commit and push it, then update `rev` in `extension.toml` to that commit.

## License

MIT

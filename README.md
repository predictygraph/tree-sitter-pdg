# tree-sitter-pdg

[Tree-sitter](https://tree-sitter.github.io/) grammar for [predictygraph](https://github.com/predictygraph/predictygraph) `.pdg` diagrams: syntax highlighting, folding, indentation and CSS injection inside `css { … }` blocks.

The grammar follows the [language spec](https://github.com/predictygraph/predictygraph/blob/master/docs/SPEC.md). If the spec and this grammar disagree, the spec wins.

## Neovim

With [lazy.nvim](https://github.com/folke/lazy.nvim) and nvim-treesitter:

```lua
{ "predictygraph/tree-sitter-pdg", dependencies = { "nvim-treesitter/nvim-treesitter" } }
```

Then run `:TSInstall pdg`. The plugin maps `*.pdg` files to the `pdg` filetype and registers the parser. Queries in `queries/pdg/` are picked up from the runtime path.

## Helix

Add to `languages.toml`:

```toml
[[language]]
name = "pdg"
scope = "source.pdg"
file-types = ["pdg"]
comment-token = "#"

[[grammar]]
name = "pdg"
source = { git = "https://github.com/predictygraph/tree-sitter-pdg", rev = "master" }
```

Run `hx --grammar fetch` and `hx --grammar build`, then copy `queries/pdg/` to `runtime/queries/pdg/`.

## Zed, Emacs and others

Any editor that loads tree-sitter grammars can use `src/parser.c` and the queries in `queries/pdg/`.

## Development

```sh
tree-sitter generate
tree-sitter test
tree-sitter parse path/to/file.pdg
```

Corpus tests live in `test/corpus/`. When the language changes, update `grammar.js`, regenerate and commit `src/` with it.

## License

GPL-3.0-or-later, same as predictygraph.

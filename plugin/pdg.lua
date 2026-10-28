-- Registers the pdg parser with nvim-treesitter and maps *.pdg to it.
-- lazy.nvim: { "predictygraph/tree-sitter-pdg", dependencies = { "nvim-treesitter/nvim-treesitter" } }
vim.filetype.add({ extension = { pdg = "pdg" } })

local ok, parsers = pcall(require, "nvim-treesitter.parsers")
if not ok then
  return
end

local config = {
  install_info = {
    url = "https://github.com/predictygraph/tree-sitter-pdg",
    branch = "master",
    files = { "src/parser.c" },
    queries = "queries/pdg",
  },
  filetype = "pdg",
}

if type(parsers.get_parser_configs) == "function" then
  parsers.get_parser_configs().pdg = config -- nvim-treesitter master
else
  parsers.pdg = { install_info = config.install_info } -- nvim-treesitter main
end

vim.treesitter.language.register("pdg", "pdg")

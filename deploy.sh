#!/usr/bin/env bash
# Publica o guia no GitHub Pages.
#
# Porquê este script: o GitHub Pages manda "cache-control: max-age=600", por isso
# o browser guarda os ficheiros 10 minutos. Como têm sempre o mesmo nome, podia
# continuar a usar um app.js antigo mesmo depois de publicares. Carimbar ?v=<epoch>
# nos <script> obriga o browser a ir buscar os novos.
#
#   ./deploy.sh "mensagem do commit"
set -euo pipefail
cd "$(dirname "$0")"

v=$(date +%s)
# delimitador '#' porque o '|' é usado nas alternativas do grupo
sed -i '' -E "s#src=\"(data|artists|bios|links|app)\.js(\?v=[0-9]+)?\"#src=\"\1.js?v=$v\"#g" index.html

git add -A
if git diff --cached --quiet; then
  echo "Nada para publicar."
  exit 0
fi
git commit -q -m "${1:-update}"
git push -q origin main

echo "Publicado (v=$v)."
echo "https://outrojoao.github.io/nos-alive-guia/"
echo "Nota: o index.html ainda pode ficar até 10 min em cache. Depois disso, propaga sozinho."

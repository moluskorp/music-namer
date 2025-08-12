import fs from 'fs'
import path from 'path'

const pasta = 'C:\\Users\\molus\\Desktop\\Musics Novas'

async function main() {
  // Importação dinâmica para evitar problemas de compatibilidade
  const mm = await import('music-metadata')

  const arquivos = fs.readdirSync(pasta)
  let contador = 0

  console.log(`Encontrados ${arquivos.length} arquivos na pasta.`)

  for (const arquivo of arquivos) {
    const caminhoCompleto = path.join(pasta, arquivo)
    const extensao = path.extname(arquivo).toLowerCase()

    // Verifica se é um arquivo .flac ou .wav
    if (extensao === '.flac' || extensao === '.wav') {
      try {
        // Lê os metadados do arquivo
        const metadata = await mm.parseFile(caminhoCompleto)

        let artista = metadata.common.artist || 'Desconhecido'
        let titulo = metadata.common.title || path.basename(arquivo, extensao)

        // Remove caracteres inválidos para nomes de arquivo
        artista = artista.replace(/[\\/:*?"<>|]/g, '')
        titulo = titulo.replace(/[\\/:*?"<>|]/g, '')

        // Cria o novo nome no formato "Artista - Título"
        const novoNome = `${artista} - ${titulo}${extensao}`
        const novoCaminho = path.join(pasta, novoNome)

        // Renomeia o arquivo
        if (caminhoCompleto !== novoCaminho) {
          console.log({ caminhoCompleto, novoCaminho })
          fs.renameSync(caminhoCompleto, novoCaminho)
          console.log(`Renomeado: ${arquivo} -> ${novoNome}`)
          contador++
        }
      } catch (erro: any) {
        console.error(`Erro ao processar ${arquivo}:`, erro.message)
      }
    }
  }

  console.log(`Total de ${contador} arquivos renomeados com sucesso.`)
}

main().then(() => console.log('Fim'))

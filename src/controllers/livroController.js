import { autor, livro } from "../models/index.js"
import NaoEncontrado from "../erros/NaoEncontrado.js"

class LivroController {
  static async listaLivros(req, res, next) {
    try {
      const buscaLivros = livro.find()
      req.resultado = buscaLivros
      next()
    } catch (error) {
      next(error)
    }
  }

  static async buscaLivroPorId(req, res, next) {
    try {
      const id = req.params.id
      const livroEncontrado = await livro.findById(id, {}, { autopopulate: false })
        .populate("autor")
      if (livroEncontrado !== null) {
        res.status(200).json(livroEncontrado)
      } else {
        next(new NaoEncontrado("Id do Livro não localizado."))
      }
    } catch (error) {
      next(error)
    }
  }

  static async cadastrarLivro(req, res, next) {
    try {
      const novoLivro = await livro.create(req.body)
      res.status(201).json({ message: "Criado com sucesso", livro: novoLivro })
    } catch (error) {
      next(error)
    }
  }

  static async atualizarLivro(req, res, next) {
    try {
      const id = req.params.id
      const livroEncontrado = await livro.findByIdAndUpdate(id, req.body)
      if (livroEncontrado !== null) {
        res.status(200).json({ message: "Atualizado com sucesso" })
      } else {
        next(new NaoEncontrado("Id do Livro não localizado."))
      }
    } catch (error) {
      next(error)
    }
  }

  static async deletarLivro(req, res, next) {
    try {
      const id = req.params.id
      const livroEncontrado = await livro.findByIdAndDelete(id)
      if (livroEncontrado !== null) {
        res.status(200).json({ message: "Deletado com sucesso" })
      } else {
        next(new NaoEncontrado("Id do Livro não localizado."))
      }
    } catch (error) {
      next(error)
    }
  }

  static async listarLivroPorFiltro(req, res, next) {
    try {
      const busca = await processaBusca(req.query)

      if (busca === null) res.status(200).send([])

      const livrosResultado = livro.find(busca)

      req.resultado = livrosResultado
      next()
    } catch (error) {
      next(error)
    }
  }
}

async function processaBusca(parametros) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros
  let busca = {}
  if (minPaginas || maxPaginas) busca.paginas = {}
  if (maxPaginas) busca.paginas = { $lte: maxPaginas }
  if (minPaginas) busca.paginas = { $gte: minPaginas }
  if (editora) busca.editora = editora
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" }
  if (nomeAutor) {
    const autorEncontrado = await autor.findOne({ nome: { $regex: nomeAutor, $options: "i" } })
    if (autorEncontrado !== null) {
      busca.autor = autorEncontrado._id
    } else {
      busca = null
    }

  }
  return busca
}

export default LivroController
import { autor } from "../models/index.js"
import NaoEncontrado from "../erros/NaoEncontrado.js"

class AutorController {
  static async listaAutores(req, res, next) {
    try {
      const listaAutores = autor.find()
      req.resultado = listaAutores  
      next()
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  }

  static async buscaAutorPorId(req, res, next) {
    try {
      const id = req.params.id
      const autorEncontrado = await autor.findById(id)
      if (autorEncontrado !== null) {
        res.status(200).json(autorEncontrado)
      } else {
        next(new NaoEncontrado("Id do Autor não localizado."))
      }
    } catch (error) {
      next(error)
    }
  }

  static async cadastrarAutor(req, res, next) {
    try {
      const novoAutor = await autor.create(req.body)
      res.status(201).json({ message: "Criado com sucesso", autor: novoAutor })
    } catch (error) {
      next(error)
    }
  }

  static async atualizarAutor(req, res, next) {
    try {
      const id = req.params.id
      const autorEncontrado = await autor.findByIdAndUpdate(id, req.body)
      if (autorEncontrado !== null) {
        res.status(200).send({message: "Autor atualizado com sucesso"})
      } else {
        next(new NaoEncontrado("Id do Autor não localizado."))
      }
    } catch (error) {
      next(error)
    }
  }

  static async deletarAutor(req, res, next) {
    try {
      const id = req.params.id
      const autorEncontrado = await autor.findByIdAndDelete(id)
      if (autorEncontrado !== null) {
        res.status(200).send({message: "Autor removido com sucesso"})
      } else {
        next(new NaoEncontrado("Id do Autor não localizado."))
      }
    } catch (error) {
      next(error)
    }
  }
}

export default AutorController
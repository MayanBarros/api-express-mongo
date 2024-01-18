import mongoose from "mongoose"
import mongooseAutoPopulate from "mongoose-autopopulate"

const livroSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  titulo: {
    type: String,
    required: [true, "O título do livro é obrigatório."]
  },
  editora: {
    type: String,
    required: [true, "A editora do livro é obrigatória."],
    enum: {
      values: ["Editora A", "Editora B", "Editora C", "Editora D", "Editora E"],
      message: "Editora {VALUE} inválida."
    }
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "O autor do livro é obrigatório."],
    ref: "autores",
    autopopulate: { select: "nome" } 
  },
  preco: { type: Number },
  paginas: { type: Number },
  numeroPaginas: {
    type: Number,
    min: [10, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"],
    max: [5000, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"],
  },
}, { versionKey: false })

livroSchema.plugin(mongooseAutoPopulate)

const livro = mongoose.model("livros", livroSchema)

export default livro  
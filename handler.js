const { nanoid } = require('nanoid')
const booksData = require('./booksData')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  let finished = false
  if (readPage === pageCount) { finished = true } else { finished = false }
  const updatedAt = insertedAt

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    const newBookdata = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt
    }
    booksData.push(newBookdata)

    const isSuccess = booksData.filter((Databooks) => Databooks.id).length > 0
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      response.code(201)
      return response
    }
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}
// get all data
const getAllBookhandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: booksData.map((dataBooks) => ({
          id: dataBooks.id,
          name: dataBooks.name,
          publisher: dataBooks.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  if (name) {
    // filter query name
    const filterBookname = booksData.filter((nameBook) => {
      const bookRegex = new RegExp(name, 'gi')
      return bookRegex.test(nameBook.name)
    })
    const response = h.response({
      status: 'success',
      data: {
        books: filterBookname.map((nameBook) => ({
          id: nameBook.id,
          name: nameBook.name,
          publisher: nameBook.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else if (reading) {
    const response = h.response({
      status: 'success',
      data: {
        books: booksData.filter((readingBooks) => Number(readingBooks.reading) === Number(reading)).map((readingBooks) => ({
          id: readingBooks.id,
          name: readingBooks.name,
          publisher: readingBooks.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else if (finished) {
    const response = h.response({
      // optional finished
      status: 'success',
      data: {
        books: booksData.filter((finishedBooks) => Number(finishedBooks.finished) === Number(finished)).map((finishedBooks) => ({
          id: finishedBooks.id,
          name: finishedBooks.name,
          publisher: finishedBooks.publisher
        }))
      }
    })
    response.code(200)
    return response
  }
}

// get data by id
const getBookbyIdHandler = (request, h) => {
  const { id } = request.params

  const book = booksData.filter((dataBooks) => dataBooks.id === id)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

// update the Books
const updateBookByIdHandler = (request, h) => {
  const { id } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  let finished = false
  if (readPage === pageCount) { finished = true } else { finished = false }
  const updatedAt = new Date().toISOString()

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    const indexBooks = booksData.findIndex((dataBooks) => dataBooks.id === id)

    if (indexBooks !== -1) {
      booksData[indexBooks] = {
        ...booksData[indexBooks],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt
      }
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    }
  }
  // generic Error response
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

// delete the books
const deleteBookbyIdHandler = (request, h) => {
  const { id } = request.params

  const indexBooks = booksData.findIndex((bookshelf) => bookshelf.id === id)

  if (indexBooks !== -1) {
    booksData.splice(indexBooks, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBookhandler,
  getBookbyIdHandler,
  updateBookByIdHandler,
  deleteBookbyIdHandler
}

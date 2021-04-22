const { nanoid } = require('nanoid')
const booksData = require('./booksData')

// Add New Book
const addBookHandler = (request, h) => {
  const { // inisialisasi variable dan mengambil data dari JSON
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  // metadata generator
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const finished = pageCount === readPage
  const updatedAt = insertedAt

  if (!name) {
    // response ketika nama kosong
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    // response jika reading page > pagecount
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    // menambahkan new data book ketika semua kriteria terpenuhi
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
      // response ketika data book berhasil ditambahkan
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
    // response generic error
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}
// get all Books data
const getAllBookHandler = (request, h) => {
  // mengambil query
  const { name, reading, finished } = request.query

  if (!name && !reading && !finished) {
    // mengambil semua data books dari bookdata
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
    // [optional] filter query apakah sama dengan books name
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
    // [optional] filter buka telah dibaca atau belum
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
    // [optional] filter buku telah selesai dibaca ataupun belum
    const response = h.response({
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

// get Book data selected by id
const getBookbyIdHandler = (request, h) => {
  // mengambil data id dan maindata
  const { id } = request.params

  const book = booksData.filter((dataBooks) => dataBooks.id === id)[0]

  if (book) {
    // response menampilkan seluruh data saat variable book tidak kosong
    return {
      status: 'success',
      data: {
        book
      }
    }
  } else {
    const response = h.response({
      // response generic error
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }
}

// update the selected Book data
const updateBookByIdHandler = (request, h) => {
  const { id } = request.params// mengambil nilai ID dari URL
  const { // mengambil new data dari JSON
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  // metadata update generator
  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString()

  if (!name) {
    // response ketika nama kosong
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    // response ketika readpage > pageCount
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    // update data ketika semua kriteria terpenuhi
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
  const response = h.response({
    // response generic error
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

// delete the selected book
const deleteBookbyIdHandler = (request, h) => {
  // mengambil data id dan metadata
  const { id } = request.params

  const indexBooks = booksData.findIndex((bookshelf) => bookshelf.id === id)

  if (indexBooks !== -1) {
    // response ketika buku sudah dihapus
    booksData.splice(indexBooks, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    // response generic error
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

// export semua module
module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookbyIdHandler,
  updateBookByIdHandler,
  deleteBookbyIdHandler
}

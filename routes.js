const {
  addBookHandler,
  getAllBookhandler,
  getBookbyIdHandler,
  updateBookByIdHandler,
  deleteBookbyIdHandler
} = require('./handler')

const routes = [
// save a new book
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  // view a book
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookhandler
  },
  // view book by id
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookbyIdHandler
  },
  // update book
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookByIdHandler
  },
  // delete book
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookbyIdHandler
  }
  // Get Query books by name

]

module.exports = routes

const {
  addBookHandler,
  getAllBookHandler,
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
  // view a whole books
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler
  },
  // view book selected by id
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookbyIdHandler
  },
  // update book selected by id
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookByIdHandler
  },
  // delete book selected by id
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookbyIdHandler
  }

]

// export routes module
module.exports = routes

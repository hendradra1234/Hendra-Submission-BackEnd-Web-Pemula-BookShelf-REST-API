const hapi = require('@hapi/hapi')
const routes = require('./routes')

// inisialisasi server
const init = async () => {
  const server = hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.route(routes)// server routes
  await server.start()// running server

  // inisialisasi data pemforma pada system
  const Usagecpu = process.cpuUsage()
  const Usagememory = process.memoryUsage()
  // menampilkan data pemforma
  console.log('\nServer Resources Used\n=================================')
  console.log(`User CPU Usage : ${Usagecpu.user} `)
  console.log(`System CPU Usage : ${Usagecpu.system}`)
  console.log(`Memory Heap Total : ${Usagememory.heapTotal / 1048576} MB`)
  console.log('=================================\n')
  // menampilkan server running domain
  console.log('Server Already Running in Domain\n=================================')
  console.log(`${server.info.uri} \n=================================`)
  console.log('\nRESTful API Running in Domain\n=================================')
  console.log(`${server.info.uri}\\books \n=================================`)
}

init()

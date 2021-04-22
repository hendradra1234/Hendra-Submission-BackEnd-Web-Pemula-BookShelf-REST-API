const hapi = require('@hapi/hapi')
const routes = require('./routes')
const Usagecpu = process.cpuUsage()
const Usagememory = process.memoryUsage()

console.log('Resource Used')
console.log(`User CPU Usage : ${Usagecpu.user} Hz `)
console.log(`System CPU Usage : ${Usagecpu.system} Hz`)
console.log(`Memory Heap Total : ${Usagememory.heapTotal} kb`)

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

  server.route(routes)
  await server.start()
  console.log(`Server Aready Running in... ${server.info.uri}`)
}

init()

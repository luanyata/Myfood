import serve from './serve'

const { PORT: port = 4000 } = process.env

const main = async (): Promise<void> => {
  await serve.start({ port })
  console.log(`Listening at port ${port}`)
}

main().catch(console.log)

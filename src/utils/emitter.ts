import mitt from "mitt"

const emitter = mitt()

emitter.on("test", (message) => {
  console.log("emitter test:", message)
})

emitter.emit("test", "hello emitter")
emitter.off("test")

emitter.all.clear()

export default emitter
import {ROUTES} from "./routes"
import {RequestType} from "./request"
import {messageHandler} from "./message-handler"

describe("routes", function () {
  describe("stamp", function () {
    for (const key of Object.keys(ROUTES)) {
      it(`${RequestType[Number(key)]} should return a stamp if set`, function () {
        const request = {
          type: key,
          stamp: Math.random(),
        }

        const response = messageHandler(JSON.stringify(request))

        expect(response.stamp).toBe(request.stamp)
      })
    }
  })
})

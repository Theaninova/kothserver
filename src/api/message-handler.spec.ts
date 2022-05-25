import {messageHandler} from "./message-handler"
import {RequestType} from "./request"

describe("message-handler", function() {
  it("should reject a non-json request", function() {
    expect(messageHandler("not json")).toEqual({
      type: RequestType.INVALID_REQUEST,
      message: "Invalid Request: SyntaxError: Unexpected token o in JSON at position 1",
    })
  })

  it("should reject an invalid route", function() {
    expect(messageHandler(JSON.stringify({type: "invalid"}))).toEqual({
      type: RequestType.NOT_IMPLEMENTED,
      message: "Route invalid not implemented",
    })
  })
})

/*
 * Copyright (C) 2022 StApps
 *  This program is free software: you can redistribute it and/or modify it
 *  under the terms of the GNU General Public License as published by the Free
 *  Software Foundation, version 3.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT
 *  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 *  more details.
 *
 *  You should have received a copy of the GNU General Public License along with
 *  this program. If not, see <https://www.gnu.org/licenses/>.
 */
import {shuffle} from "./shuffle"

describe("shuffle", function () {
  it("should shuffle an array", function () {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const shuffled = shuffle(array)
    expect(shuffled).not.toEqual(array)
    expect(shuffled).toEqual(jasmine.arrayContaining(array))
  })

  it("should not modify the original array", function () {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    shuffle(array)
    expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

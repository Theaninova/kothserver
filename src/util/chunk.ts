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

/**
 * Chunk array into smaller arrays of a specified size.
 *
 * @param array The array to chunk.
 * @param chunkSize The size of each chunk.
 */
export function chunk<T>(array: T[], chunkSize = 1): T[][] {
  const arrayCopy = [...array]
  const out: T[][] = []
  if (chunkSize <= 0) return out
  while (arrayCopy.length > 0) out.push(arrayCopy.splice(0, chunkSize))
  return out
}

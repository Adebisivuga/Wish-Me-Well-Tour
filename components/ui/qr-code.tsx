"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export function QRCode({ value, size = 200, className }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Simple QR-like visual pattern based on value hash
    // In production, use a library like 'qrcode' for real QR codes
    const cellSize = Math.floor(size / 25)
    const padding = Math.floor((size - cellSize * 25) / 2)

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Generate deterministic pattern from value
    const hash = (str: string) => {
      let h = 0
      for (let i = 0; i < str.length; i++) {
        h = Math.imul(31, h) + str.charCodeAt(i) | 0
      }
      return h
    }

    const seed = hash(value)
    const random = (x: number, y: number) => {
      const n = Math.sin(seed + x * 12.9898 + y * 78.233) * 43758.5453
      return n - Math.floor(n)
    }

    ctx.fillStyle = "#000000"

    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      // Outer square
      ctx.fillRect(
        padding + x * cellSize,
        padding + y * cellSize,
        cellSize * 7,
        cellSize * 7
      )
      // Inner white square
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(
        padding + (x + 1) * cellSize,
        padding + (y + 1) * cellSize,
        cellSize * 5,
        cellSize * 5
      )
      // Center square
      ctx.fillStyle = "#000000"
      ctx.fillRect(
        padding + (x + 2) * cellSize,
        padding + (y + 2) * cellSize,
        cellSize * 3,
        cellSize * 3
      )
    }

    // Top-left finder
    drawFinderPattern(0, 0)
    // Top-right finder
    drawFinderPattern(18, 0)
    // Bottom-left finder
    drawFinderPattern(0, 18)

    // Fill data modules
    ctx.fillStyle = "#000000"
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        // Skip finder patterns
        if ((x < 8 && y < 8) || (x >= 17 && y < 8) || (x < 8 && y >= 17)) {
          continue
        }

        // Draw module based on pseudo-random value
        if (random(x, y) > 0.5) {
          ctx.fillRect(
            padding + x * cellSize,
            padding + y * cellSize,
            cellSize,
            cellSize
          )
        }
      }
    }
  }, [value, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
    />
  )
}

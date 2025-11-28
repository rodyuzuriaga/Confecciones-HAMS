"use client"

import { Camera, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CameraSelectorProps {
  activeCamera: string
  setActiveCamera: (camera: string) => void
}

const cameras = [
  { id: "CAM-01", name: "Cámara Principal", zone: "Entrada", status: "online" },
  { id: "CAM-02", name: "Cámara Lateral", zone: "Costuras", status: "online" },
  { id: "CAM-03", name: "Cámara Detalle", zone: "Botones", status: "online" },
  { id: "CAM-04", name: "Cámara Salida", zone: "Final", status: "online" },
]

export function CameraSelector({ activeCamera, setActiveCamera }: CameraSelectorProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Cámaras de Inspección</h3>
      </div>

      <div className="space-y-2">
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => setActiveCamera(cam.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
              activeCamera === cam.id
                ? "bg-primary/10 border-2 border-primary shadow-sm"
                : "bg-muted/50 border-2 border-transparent hover:bg-muted",
            )}
          >
            <div className="relative">
              <Circle
                className={cn(
                  "w-3 h-3",
                  cam.status === "online" ? "text-emerald-500 fill-emerald-500" : "text-slate-400",
                )}
              />
              {activeCamera === cam.id && (
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  activeCamera === cam.id ? "text-primary" : "text-foreground",
                )}
              >
                {cam.id}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {cam.name} - {cam.zone}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

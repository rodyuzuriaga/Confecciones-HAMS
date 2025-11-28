"use client"

import { Save, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import type { SystemConfig } from "@/app/page"

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: SystemConfig
  setConfig: (config: SystemConfig) => void
}

export function ConfigDialog({ open, onOpenChange, config, setConfig }: ConfigDialogProps) {
  const { setTheme, theme } = useTheme()

  const handleSave = () => {
    toast.success("Configuración guardada correctamente")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border text-foreground max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Configuración del Sistema</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajusta los parámetros de inspección y notificaciones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Apariencia</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Tema del Sistema</Label>
                <p className="text-xs text-muted-foreground">Selecciona el modo de visualización</p>
              </div>
              <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                <Button
                  variant={theme === "light" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="h-8 w-8 p-0"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="h-8 w-8 p-0"
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Separator />

          {/* AI Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Configuración de IA</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Umbral de Confianza Mínimo</Label>
                <span className="text-sm font-bold text-primary font-mono">{config.confidenceThreshold}%</span>
              </div>
              <Slider
                value={[config.confidenceThreshold]}
                onValueChange={(value) => setConfig({ ...config, confidenceThreshold: value[0] })}
                min={50}
                max={99}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Modelo de IA</Label>
              <Select value={config.aiModel} onValueChange={(value) => setConfig({ ...config, aiModel: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1.0">Vision AI v1.0</SelectItem>
                  <SelectItem value="v2.0">Vision AI v2.0 (Recomendado)</SelectItem>
                  <SelectItem value="v3.0">Vision AI v3.0 Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Sensibilidad de Detección</Label>
              <Select
                value={config.sensitivity}
                onValueChange={(value) => setConfig({ ...config, sensitivity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Rechazo Automático</Label>
                <p className="text-xs text-muted-foreground">Rechazar prendas con defectos críticos</p>
              </div>
              <Switch
                checked={config.autoReject}
                onCheckedChange={(checked) => setConfig({ ...config, autoReject: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-accent uppercase tracking-wide">Notificaciones</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Alertas por Email</Label>
                <p className="text-xs text-muted-foreground">Recibir reportes diarios</p>
              </div>
              <Switch
                checked={config.emailAlerts}
                onCheckedChange={(checked) => setConfig({ ...config, emailAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Alertas Sonoras</Label>
                <p className="text-xs text-muted-foreground">Sonido al detectar defectos</p>
              </div>
              <Switch
                checked={config.soundAlerts}
                onCheckedChange={(checked) => setConfig({ ...config, soundAlerts: checked })}
              />
            </div>
          </div>

          <Separator />

          {/* Camera Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide">Configuración de Cámaras</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Resolución</Label>
                <Select
                  value={config.resolution}
                  onValueChange={(value) => setConfig({ ...config, resolution: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                    <SelectItem value="4k">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">FPS</Label>
                <Select value={config.fps} onValueChange={(value) => setConfig({ ...config, fps: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 fps</SelectItem>
                    <SelectItem value="60">60 fps</SelectItem>
                    <SelectItem value="120">120 fps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

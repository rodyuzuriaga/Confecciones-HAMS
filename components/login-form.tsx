"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface LoginFormProps {
  onLogin: (username: string) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [error, setError] = useState("")

  const MAX_ATTEMPTS = 3

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) {
      setError("El formulario ha sido bloqueado por exceder los intentos permitidos.")
      return
    }

    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña")
      return
    }

    setIsLoading(true)
    setError("")

    // Primero verificar credenciales de prueba
    if (username === "admin" && password === "admin123") {
      console.log("Login successful with test credentials")
      toast.success("Inicio de sesión exitoso", {
        description: "Bienvenido, Administrador",
      })
      setAttempts(0)
      onLogin(username)
      setIsLoading(false)
      return
    }

    try {
      // Intentar autenticación con API si no son las credenciales de prueba
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Inicio de sesión exitoso", {
          description: `Bienvenido, ${data.user?.nombres || username}`,
        })
        setAttempts(0)
        onLogin(username)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsBlocked(true)
          setError(`Ha excedido el número máximo de intentos (${MAX_ATTEMPTS}). El formulario se ha bloqueado.`)
          toast.error("Cuenta bloqueada", {
            description: "Ha excedido el número máximo de intentos",
          })
        } else {
          setError(`Credenciales incorrectas. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`)
        }
      }
    } catch (err) {
      // Si no hay API y no son credenciales de prueba, mostrar error
      console.log("API call failed and not test credentials")
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true)
        setError(`Ha excedido el número máximo de intentos (${MAX_ATTEMPTS}). El formulario se ha bloqueado.`)
        toast.error("Cuenta bloqueada", {
          description: "Ha excedido el número máximo de intentos",
        })
      } else {
        setError(`Credenciales incorrectas. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAttempts(0)
    setIsBlocked(false)
    setError("")
    setUsername("")
    setPassword("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-card/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl font-bold text-primary-foreground">H</span>
          </div>
          <CardTitle className="text-2xl font-bold">HAM'S QC Vision AI</CardTitle>
          <CardDescription>
            Sistema de Control de Calidad Industrial
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pb-6">
            {error && (
              <Alert variant={isBlocked ? "destructive" : "default"} className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isBlocked && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Contacte al administrador para desbloquear su cuenta o espere 5 minutos.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isBlocked || isLoading}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isBlocked || isLoading}
                  className="pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {attempts > 0 && !isBlocked && (
              <div className="flex items-center gap-2 text-sm text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Intentos fallidos: {attempts} de {MAX_ATTEMPTS}</span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isBlocked || isLoading}
              size="lg"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
            
            {isBlocked && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleReset}
              >
                Intentar de nuevo
              </Button>
            )}
            
            <p className="text-xs text-center text-muted-foreground">
              Usuario de prueba: admin / admin123
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
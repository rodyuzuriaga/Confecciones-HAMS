"use client"

import { useState, useEffect } from "react"
import { 
  Search, Plus, Pencil, Trash2, Eye, EyeOff, Filter, 
  UserPlus, Users, Shield, Mail, Phone, MapPin, 
  ChevronDown, MoreHorizontal, Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { toast } from "sonner"

// Tipos de datos
interface Usuario {
  id: number
  nombreUsuario: string
  nombres: string
  apellidos: string
  dni: string
  email: string
  telefono: string
  rol: string
  permiso: string
  estado: "activo" | "inactivo" | "bloqueado"
  ultimoAcceso: Date | null
  intentosFallidos: number
}

// Datos de ejemplo
const usuariosEjemplo: Usuario[] = [
  {
    id: 1,
    nombreUsuario: "admin",
    nombres: "Administrador",
    apellidos: "Sistema",
    dni: "12345678",
    email: "admin@hams.com",
    telefono: "999888777",
    rol: "Administrador",
    permiso: "Total",
    estado: "activo",
    ultimoAcceso: new Date(),
    intentosFallidos: 0,
  },
  {
    id: 2,
    nombreUsuario: "jperez",
    nombres: "Juan",
    apellidos: "Pérez García",
    dni: "87654321",
    email: "jperez@hams.com",
    telefono: "999777666",
    rol: "Operador",
    permiso: "Lectura",
    estado: "activo",
    ultimoAcceso: new Date(Date.now() - 86400000),
    intentosFallidos: 0,
  },
  {
    id: 3,
    nombreUsuario: "mrodriguez",
    nombres: "María",
    apellidos: "Rodríguez López",
    dni: "11223344",
    email: "mrodriguez@hams.com",
    telefono: "999666555",
    rol: "Supervisor",
    permiso: "Lectura/Escritura",
    estado: "inactivo",
    ultimoAcceso: new Date(Date.now() - 604800000),
    intentosFallidos: 2,
  },
]

const roles = ["Administrador", "Supervisor", "Operador", "Invitado"]
const permisos = ["Total", "Lectura/Escritura", "Lectura", "Ninguno"]
const sexos = ["Masculino", "Femenino", "Otro"]
const estadosCiviles = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"]

export function UserManagement() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosEjemplo)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>(usuariosEjemplo)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [activeTab, setActiveTab] = useState("usuarios")

  // Formulario nuevo usuario
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    contrasena: "",
    nombres: "",
    apellidos: "",
    dni: "",
    email: "",
    telefono: "",
    rol: "",
    permiso: "",
    sexo: "",
    estadoCivil: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
  })

  // Filtro dinámico al escribir
  useEffect(() => {
    const filtered = usuarios.filter(
      (user) =>
        user.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dni.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsuarios(filtered)
  }, [searchTerm, usuarios])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (!formData.nombreUsuario || !formData.nombres || !formData.apellidos || !formData.dni) {
      toast.error("Campos requeridos", {
        description: "Por favor complete los campos obligatorios",
      })
      return
    }

    if (editingUser) {
      // Modificar usuario existente
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                nombreUsuario: formData.nombreUsuario,
                nombres: formData.nombres,
                apellidos: formData.apellidos,
                dni: formData.dni,
                email: formData.email,
                telefono: formData.telefono,
                rol: formData.rol || u.rol,
                permiso: formData.permiso || u.permiso,
              }
            : u
        )
      )
      toast.success("Usuario actualizado", {
        description: `El usuario ${formData.nombreUsuario} ha sido modificado`,
      })
    } else {
      // Crear nuevo usuario
      const newUser: Usuario = {
        id: usuarios.length + 1,
        nombreUsuario: formData.nombreUsuario,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
        email: formData.email,
        telefono: formData.telefono,
        rol: formData.rol || "Operador",
        permiso: formData.permiso || "Lectura",
        estado: "activo",
        ultimoAcceso: null,
        intentosFallidos: 0,
      }
      setUsuarios((prev) => [...prev, newUser])
      toast.success("Usuario creado", {
        description: `El usuario ${formData.nombreUsuario} ha sido registrado`,
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (user: Usuario) => {
    setEditingUser(user)
    setFormData({
      nombreUsuario: user.nombreUsuario,
      contrasena: "",
      nombres: user.nombres,
      apellidos: user.apellidos,
      dni: user.dni,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      permiso: user.permiso,
      sexo: "",
      estadoCivil: "",
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (user: Usuario) => {
    // Eliminación lógica (cambiar estado)
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, estado: "inactivo" as const } : u
      )
    )
    toast.success("Usuario desactivado", {
      description: `El usuario ${user.nombreUsuario} ha sido desactivado`,
    })
  }

  const resetForm = () => {
    setFormData({
      nombreUsuario: "",
      contrasena: "",
      nombres: "",
      apellidos: "",
      dni: "",
      email: "",
      telefono: "",
      rol: "",
      permiso: "",
      sexo: "",
      estadoCivil: "",
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
    })
    setEditingUser(null)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Activo</Badge>
      case "inactivo":
        return <Badge className="bg-gray-500/20 text-gray-500 border-gray-500/30">Inactivo</Badge>
      case "bloqueado":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Bloqueado</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestión de Usuarios
          </h2>
          <p className="text-muted-foreground">
            Administre usuarios, roles y permisos del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, DNI, email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}
                </DialogTitle>
                <DialogDescription>
                  Complete los datos del usuario. Los campos marcados con * son obligatorios.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="datos-acceso" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="datos-acceso">Acceso</TabsTrigger>
                  <TabsTrigger value="datos-personales">Personales</TabsTrigger>
                  <TabsTrigger value="contacto">Contacto</TabsTrigger>
                </TabsList>

                <TabsContent value="datos-acceso" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreUsuario">Usuario *</Label>
                      <Input
                        id="nombreUsuario"
                        value={formData.nombreUsuario}
                        onChange={(e) => handleInputChange("nombreUsuario", e.target.value)}
                        placeholder="nombre.usuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contrasena">Contraseña {!editingUser && "*"}</Label>
                      <Input
                        id="contrasena"
                        type="password"
                        value={formData.contrasena}
                        onChange={(e) => handleInputChange("contrasena", e.target.value)}
                        placeholder={editingUser ? "Dejar vacío para mantener" : "••••••••"}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rol">Rol *</Label>
                      <Select value={formData.rol} onValueChange={(v) => handleInputChange("rol", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((rol) => (
                            <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permiso">Permiso *</Label>
                      <Select value={formData.permiso} onValueChange={(v) => handleInputChange("permiso", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione permiso" />
                        </SelectTrigger>
                        <SelectContent>
                          {permisos.map((permiso) => (
                            <SelectItem key={permiso} value={permiso}>{permiso}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="datos-personales" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombres">Nombres *</Label>
                      <Input
                        id="nombres"
                        value={formData.nombres}
                        onChange={(e) => handleInputChange("nombres", e.target.value)}
                        placeholder="Juan Carlos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <Input
                        id="apellidos"
                        value={formData.apellidos}
                        onChange={(e) => handleInputChange("apellidos", e.target.value)}
                        placeholder="Pérez García"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI *</Label>
                      <Input
                        id="dni"
                        value={formData.dni}
                        onChange={(e) => handleInputChange("dni", e.target.value)}
                        placeholder="12345678"
                        maxLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo</Label>
                      <Select value={formData.sexo} onValueChange={(v) => handleInputChange("sexo", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          {sexos.map((sexo) => (
                            <SelectItem key={sexo} value={sexo}>{sexo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estadoCivil">Estado Civil</Label>
                      <Select value={formData.estadoCivil} onValueChange={(v) => handleInputChange("estadoCivil", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosCiviles.map((ec) => (
                            <SelectItem key={ec} value={ec}>{ec}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contacto" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="usuario@ejemplo.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="999888777"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                      placeholder="Av. Principal 123"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Select value={formData.departamento} onValueChange={(v) => handleInputChange("departamento", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lima">Lima</SelectItem>
                          <SelectItem value="arequipa">Arequipa</SelectItem>
                          <SelectItem value="cusco">Cusco</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia</Label>
                      <Select value={formData.provincia} onValueChange={(v) => handleInputChange("provincia", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lima">Lima</SelectItem>
                          <SelectItem value="callao">Callao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distrito">Distrito</Label>
                      <Select value={formData.distrito} onValueChange={(v) => handleInputChange("distrito", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="miraflores">Miraflores</SelectItem>
                          <SelectItem value="surco">Surco</SelectItem>
                          <SelectItem value="sjl">San Juan de Lurigancho</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingUser ? "Guardar Cambios" : "Registrar Usuario"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {usuarios.filter((u) => u.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {usuarios.filter((u) => u.estado === "inactivo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {usuarios.filter((u) => u.estado === "bloqueado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsuarios.length} usuario(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Permiso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.nombreUsuario}</TableCell>
                    <TableCell>{`${user.nombres} ${user.apellidos}`}</TableCell>
                    <TableCell>{user.dni}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.rol}</Badge>
                    </TableCell>
                    <TableCell>{user.permiso}</TableCell>
                    <TableCell>{getEstadoBadge(user.estado)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Desactivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
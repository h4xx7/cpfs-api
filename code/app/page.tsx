"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users, Database, Download } from "lucide-react"

type Person = {
  cpf: string
  name: string
  mother: string
  birthDate: string
  address: string
  email: string
  phone: string
  income: number
}

type IncomeCategory = "high" | "medium" | "low"

export default function Page() {
  const [people, setPeople] = useState<Person[]>([])
  const [formData, setFormData] = useState({
    cpf: "",
    name: "",
    mother: "",
    birthDate: "",
    address: "",
    email: "",
    phone: "",
    income: "",
  })
  const [searchCpf, setSearchCpf] = useState("")
  const [searchResult, setSearchResult] = useState<Person | null>(null)
  const [activeTab, setActiveTab] = useState<"register" | "search" | "list">("search")

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")
    }
    return value
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const cpfClean = formData.cpf.replace(/\D/g, "")

    if (cpfClean.length !== 11) {
      alert("CPF deve ter 11 dígitos")
      return
    }

    const newPerson: Person = {
      cpf: cpfClean,
      name: formData.name,
      mother: formData.mother,
      birthDate: formData.birthDate,
      address: formData.address,
      email: formData.email,
      phone: formData.phone.replace(/\D/g, ""),
      income: Number.parseFloat(formData.income),
    }

    setPeople([...people, newPerson])
    setFormData({ cpf: "", name: "", mother: "", birthDate: "", address: "", email: "", phone: "", income: "" })
    alert("Pessoa cadastrada com sucesso!")
  }

  const handleSearch = () => {
    const cpfClean = searchCpf.replace(/\D/g, "")
    const found = people.find((p) => p.cpf === cpfClean)
    setSearchResult(found || null)
    if (!found) {
      alert("CPF não encontrado no banco de dados")
    }
  }

  const getIncomeCategory = (income: number): IncomeCategory => {
    if (income >= 10000) return "high"
    if (income >= 4000) return "medium"
    return "low"
  }

  const getIncomeBadge = (income: number) => {
    const category = getIncomeCategory(income)
    const config = {
      high: { label: "VENDA BOA", color: "bg-green-600" },
      medium: { label: "VENDA MODERADA", color: "bg-yellow-600" },
      low: { label: "VENDA RUIM", color: "bg-red-600" },
    }
    return config[category]
  }

  const exportToTxt = () => {
    if (people.length === 0) {
      alert("Não há dados para exportar")
      return
    }

    let txtContent = "=".repeat(60) + "\n"
    txtContent += "BASE DE DADOS - CONSULTA CPF\n"
    txtContent += "Data de Exportação: " + new Date().toLocaleString("pt-BR") + "\n"
    txtContent += "Total de Registros: " + people.length + "\n"
    txtContent += "=".repeat(60) + "\n\n"

    people.forEach((person, index) => {
      txtContent += `REGISTRO ${index + 1}\n`
      txtContent += "-".repeat(60) + "\n"
      txtContent += `NOME: ${person.name}\n`
      txtContent += `MÃE: ${person.mother}\n`
      txtContent += `DATA DE NASCIMENTO: ${new Date(person.birthDate + "T00:00:00").toLocaleDateString("pt-BR")}\n`
      txtContent += `CPF: ${formatCPF(person.cpf)}\n`
      txtContent += `ENDEREÇO: ${person.address}\n`
      txtContent += `EMAIL: ${person.email}\n`
      txtContent += `TELEFONE: ${formatPhone(person.phone)}\n`
      txtContent += `RENDA: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(person.income)}\n`
      txtContent += `ANÁLISE: ${getIncomeBadge(person.income).label}\n`
      txtContent += "\n"
    })

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `banco_dados_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Database className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Consulta CPF</h1>
              <p className="text-muted-foreground text-sm">Sistema de Análise de Renda e Dados Cadastrais</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-card rounded-lg shadow-md p-2 mb-6 flex gap-2 border border-border">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === "search"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Search className="w-5 h-5" />
            Consultar CPF
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === "register"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Cadastrar
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === "list"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Users className="w-5 h-5" />
            Base de Dados ({people.length})
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div className="space-y-6">
            <Card className="shadow-lg border-border bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-foreground text-xl">Buscar Informações por CPF</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Digite o CPF para consultar os dados cadastrais e análise de renda
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Input
                    value={searchCpf}
                    onChange={(e) => setSearchCpf(formatCPF(e.target.value))}
                    maxLength={14}
                    className="h-12 text-lg bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                    placeholder="000.000.000-00"
                  />
                  <Button
                    onClick={handleSearch}
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Consultar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {searchResult && (
              <Card className="shadow-lg border-border bg-card">
                <CardHeader className="border-b border-border">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-foreground text-xl">Dados Encontrados</CardTitle>
                    <Badge className={`${getIncomeBadge(searchResult.income).color} text-white px-3 py-1`}>
                      {getIncomeBadge(searchResult.income).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">NOME:</p>
                      <p className="text-foreground font-medium text-lg">{searchResult.name}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">MÃE:</p>
                      <p className="text-foreground font-medium text-lg">{searchResult.mother}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">DATA DE NASCIMENTO:</p>
                      <p className="text-foreground font-medium text-lg">
                        {new Date(searchResult.birthDate + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">ENDEREÇO:</p>
                      <p className="text-foreground font-medium text-lg">{searchResult.address}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">EMAIL:</p>
                      <p className="text-foreground font-medium text-lg">{searchResult.email}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">TELEFONE:</p>
                      <p className="text-foreground font-medium text-lg">{formatPhone(searchResult.phone)}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">RENDA:</p>
                      <p className="text-foreground font-medium text-lg">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                          searchResult.income,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Register Tab */}
        {activeTab === "register" && (
          <Card className="shadow-lg border-border bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-foreground text-xl">Cadastrar Nova Pessoa</CardTitle>
              <CardDescription className="text-muted-foreground">
                Preencha todos os campos para adicionar uma nova pessoa ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mother" className="text-foreground font-medium">
                      Nome da Mãe
                    </Label>
                    <Input
                      id="mother"
                      value={formData.mother}
                      onChange={(e) => setFormData({ ...formData, mother: e.target.value })}
                      required
                      className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                      placeholder="Digite o nome da mãe"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="cpf" className="text-foreground font-medium">
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                      required
                      maxLength={14}
                      className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-foreground font-medium">
                      Data de Nascimento
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      required
                      className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-foreground font-medium">
                    Endereço
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                    placeholder="Rua, número, bairro, cidade - UF"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground font-medium">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                      required
                      maxLength={15}
                      className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="income" className="text-foreground font-medium">
                    Renda Mensal (R$)
                  </Label>
                  <Input
                    id="income"
                    type="number"
                    step="0.01"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    required
                    className="mt-2 bg-input border-border text-foreground focus:border-primary focus:ring-primary"
                    placeholder="0,00"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold"
                >
                  Cadastrar Pessoa
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* List Tab */}
        {activeTab === "list" && (
          <Card className="shadow-lg border-border bg-card">
            <CardHeader className="border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-foreground text-xl">Base de Dados</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {people.length} {people.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}
                  </CardDescription>
                </div>
                {people.length > 0 && (
                  <Button
                    onClick={exportToTxt}
                    variant="outline"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar TXT
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {people.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Nenhuma pessoa cadastrada ainda</p>
                  <p className="text-muted-foreground/70 text-sm mt-2">Use a aba Cadastrar para adicionar pessoas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {people.map((person, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-lg p-5 hover:border-primary hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-foreground font-semibold text-lg mb-1">{person.name}</h3>
                          <p className="text-muted-foreground text-sm">CPF: {formatCPF(person.cpf)}</p>
                        </div>
                        <Badge className={`${getIncomeBadge(person.income).color} text-white text-xs`}>
                          {getIncomeBadge(person.income).label}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <span className="text-foreground font-medium">Mãe:</span> {person.mother}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-foreground font-medium">Nascimento:</span>{" "}
                          {new Date(person.birthDate + "T00:00:00").toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-foreground font-medium">Email:</span> {person.email}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-foreground font-medium">Telefone:</span> {formatPhone(person.phone)}
                        </p>
                        <p className="text-muted-foreground md:col-span-2">
                          <span className="text-foreground font-medium">Endereço:</span> {person.address}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="text-foreground font-medium">Renda:</span>{" "}
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(person.income)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
